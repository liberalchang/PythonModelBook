---
layout: doc
title: Asyncio 调度原理：EventLoop 工作机制深度剖析
permalink: /docs/basics/asyncio-scheduling/
category: basics
tags: [asyncio, EventLoop, 调度, Handler, TimerHandler, 事件循环]
description: 深入解析 Python Asyncio 的调度原理，包括 EventLoop 运作机制、Handler 对象原理、_run_once 核心调度逻辑
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "高级"
---

# Asyncio 调度原理：EventLoop 工作机制深度剖析

## 概述

Python Asyncio 是一个大而全的异步编程库，其核心调度逻辑主要位于事件循环（EventLoop）中。本文通过源码分析，深入解析 EventLoop 的运作机制，包括 Handler 和 TimerHandler 对象的作用，以及 `_run_once` 函数的核心调度逻辑。

## 学习目标

- 理解 Asyncio 库的核心组件架构
- 掌握 Handler 和 TimerHandler 的工作原理
- 深入了解 EventLoop 的调度机制
- 理解 `loop.call_xxx` 系列方法的实现原理
- 掌握 `_run_once` 函数的核心调度逻辑

## Asyncio 核心组件架构

Python Asyncio 库中，与核心调度相关的逻辑主要分布在三个文件中：

### 1. runners.py - Runner 类

`Runner` 类的主要职责：
- 初始化事件循环，为进入协程模式做准备
- 在退出协程模式时清理内存中的协程、生成器等对象

### 2. event.py - Handler 对象

`event.py` 文件包含两个重要的可调度对象：`Handler` 和 `TimerHandler`，它们作为容器连接待调度对象和事件循环。

#### Handler 类源码分析

```python
class Handle:
    def __init__(self, callback, args, loop, context=None):
        # 初始化上下文，确保执行时能找到 Handle 所在的上下文
        if context is None:
            context = contextvars.copy_context()
        self._context = context
        self._loop = loop
        self._callback = callback
        self._args = args
        self._cancelled = False

    def cancel(self):
        """设置当前 Handle 为取消状态"""
        if not self._cancelled:
            self._cancelled = True
            self._callback = None
            self._args = None

    def cancelled(self):
        return self._cancelled

    def _run(self):
        """执行真正的函数，并通过 context.run 方法确保在自己的上下文内执行"""
        try:
            # 在自己持有的上下文中执行对应的回调
            self._context.run(self._callback, *self._args)
        except (SystemExit, KeyboardInterrupt):
            raise
        except BaseException as exc:
            cb = format_helpers._format_callback_source(
                self._callback, self._args)
            msg = f'Exception in callback {cb}'
            context = {
                'message': msg,
                'exception': exc,
                'handle': self,
            }
            self._loop.call_exception_handler(context)
```

#### TimerHandle 类特点

`TimerHandle` 继承自 `Handle`，增加了时间和排序相关的功能：

```python
class TimerHandle(Handle):
    def __init__(self, when, callback, args, loop, context=None):
        super().__init__(callback, args, loop, context)
        self._when = when
        self._scheduled = False

    def __lt__(self, other):
        """支持时间排序比较"""
        if isinstance(other, TimerHandle):
            return self._when < other._when
        return NotImplemented

    def when(self):
        return self._when

    def cancel(self):
        if not self._cancelled:
            # 通知事件循环当前 Handle 已经退出
            self._loop._timer_handle_cancelled(self)
        super().cancel()
```

## loop.call_xxx 系列方法

这些方法是 EventLoop 的注册操作，所有非 IO 的异步操作都需要通过它们注册到 EventLoop 中。

### call_soon 方法

```python
class BaseEventLoop:
    def call_soon(self, callback, *args, context=None):
        # 检查事件循环是否关闭
        self._check_closed()
        handle = self._call_soon(callback, args, context)
        return handle

    def _call_soon(self, callback, args, context):
        # 把调用封装成一个 handle，方便被事件循环调用
        handle = events.Handle(callback, args, self, context)
        # 添加到 _ready 队列，等待被调用
        self._ready.append(handle)
        return handle
```

### call_at 和 call_later 方法

```python
class BaseEventLoop:
    def call_later(self, delay, callback, *args, context=None):
        if delay is None:
            raise TypeError('delay must not be None')
        timer = self.call_at(self.time() + delay, callback, *args, context=context)
        return timer

    def call_at(self, when, callback, *args, context=None):
        if when is None:
            raise TypeError("when cannot be None")
        self._check_closed()
        # 创建一个 timer handle，添加到事件循环的 _scheduled 中
        timer = events.TimerHandle(when, callback, args, self, context)
        heapq.heappush(self._scheduled, timer)
        timer._scheduled = True
        return timer
```

## EventLoop 核心调度机制

### run_until_complete 入口

```python
class BaseEventLoop:
    def run_until_complete(self, future):
        # 把 coroutine 转换成 task，事件循环的最小调度单位为 task
        future = tasks.ensure_future(future, loop=self)
        
        # 当该 task 完成时，关闭当前事件循环
        future.add_done_callback(_run_until_complete_cb)
        
        try:
            # 事件循环开始运行
            self.run_forever()
        except:
            # 异常处理逻辑
            raise
        finally:
            future.remove_done_callback(_run_until_complete_cb)
        
        return future.result()
```

### run_forever 主循环

```python
def run_forever(self):
    # 进行初始化工作
    self._check_closed()
    self._check_running()
    self._thread_id = threading.get_ident()

    # 设置异步生成器钩子
    old_agen_hooks = sys.get_asyncgen_hooks()
    sys.set_asyncgen_hooks(
        firstiter=self._asyncgen_firstiter_hook,
        finalizer=self._asyncgen_finalizer_hook
    )
    
    try:
        # 设置当前运行的事件循环到全局变量
        events._set_running_loop(self)
        while True:
            # 核心调度逻辑
            self._run_once()
            if self._stopping:
                break
    finally:
        # 清理资源
        self._stopping = False
        self._thread_id = None
        events._set_running_loop(None)
        sys.set_asyncgen_hooks(*old_agen_hooks)
```

### _run_once 核心调度函数

`_run_once` 函数是事件循环的核心，包含三个主要阶段：

#### 第一阶段：整理 _scheduled 队列

```python
def _run_once(self):
    # _scheduled 是一个列表，只存放 TimerHandle
    sched_count = len(self._scheduled)
    
    # 当待调度任务数量超过100且待取消任务占总任务的50%时
    if (sched_count > _MIN_SCHEDULED_TIMER_HANDLES and
        self._timer_cancelled_count / sched_count > _MIN_CANCELLED_TIMER_HANDLES_FRACTION):
        
        # 把需要取消的任务移除
        new_scheduled = []
        for handle in self._scheduled:
            if handle._cancelled:
                handle._scheduled = False
            else:
                new_scheduled.append(handle)

        # 重新构建堆
        heapq.heapify(new_scheduled)
        self._scheduled = new_scheduled
        self._timer_cancelled_count = 0
```

#### 第二阶段：将到期任务移至 _ready 队列

```python
# 把到了执行时间的 TimerHandle 移动到 _ready
while self._scheduled:
    handle = self._scheduled[0]
    if handle._when > self.time():
        break
    handle = heapq.heappop(self._scheduled)
    handle._scheduled = False
    self._ready.append(handle)
```

#### 第三阶段：执行就绪任务

```python
# 批量执行 _ready 中的所有 Handle
ntodo = len(self._ready)
for i in range(ntodo):
    handle = self._ready.popleft()
    if handle._cancelled:
        continue
    
    # 执行 Handle 中的回调函数
    handle._run()
    handle = None  # 防止循环引用
```

## Task 对象的自我驱动机制

Task 对象在初始化时会通过 `loop.call_soon` 方法将自己注册到 EventLoop 中：

```python
class Task:
    def __init__(self, coro, *, loop=None):
        super().__init__(loop=loop)
        self._coro = coro
        
        # Task 初始化后立即通知事件循环执行自己的 __step 函数
        self._loop.call_soon(self.__step, context=self._context)
```

这样，Task 对象就能实现自我驱动，但多个 Task 的并发执行仍需要 EventLoop 来协调调度。

## 最佳实践与注意事项

1. **理解调度顺序**：`_ready` 队列中的任务按 FIFO 顺序执行
2. **定时器优化**：EventLoop 会定期清理已取消的定时器任务
3. **上下文隔离**：每个 Handle 都在自己的上下文中执行
4. **异常处理**：Handle 执行中的异常会被捕获并传递给异常处理器

## 相关内容

- [Python 协程基础实现原理](../coroutine-impl/)
- [什么是 asyncio？单线程并发与事件循环](../asyncio-intro/)
- [协程常用方法与可等待对象](../coroutine-methods/)

## 扩展阅读

- asyncio 官方文档：事件循环实现
- PEP 3156: Asynchronous IO Support Rework

---

最后更新: 2024-01-15  |  作者: Python 编程指南  |  版本: 1.0