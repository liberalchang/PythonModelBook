---
layout: doc
title: asyncio.task 常用函数详解：sleep、shield、wait_for、wait、as_completed
permalink: /docs/basics/asyncio-task-functions/
category: basics
tags: [asyncio, task, sleep, shield, wait_for, wait, as_completed]
description: 深入解析 asyncio.task 模块中的核心函数，包括休眠、屏蔽取消、超时控制、等待管理等高级功能
author: Python 编程指南
date: 2024-01-18
updated: 2024-01-18
version: 1.0
difficulty: "高级"
---

# asyncio.task 常用函数详解

## 概述

`asyncio.task` 模块提供了一系列高级功能函数，用于更精细地控制协程的执行。这些函数通过 `asyncio.Future` 作为容器来同步调用端和可等待对象间的状态，实现了休眠、取消保护、超时控制、批量等待等功能。

## 学习目标

- 理解 asyncio.task 模块的设计原理
- 掌握休眠函数 asyncio.sleep 的实现机制
- 学会使用 asyncio.shield 保护任务免于取消
- 熟练使用 asyncio.wait_for 进行超时控制
- 理解 asyncio.wait 的批量等待机制
- 掌握 asyncio.as_completed 的迭代式任务处理

## 基础原理

所有 `asyncio.task` 函数的工作原理基本相同：它们接受可等待对象作为参数，通过 `asyncio.Future` 作为容器来同步调用端和可等待对象间的状态。

例如，实现休眠一秒的底层代码：

```python
import asyncio

async def main():
    loop = asyncio.get_event_loop()
    f = asyncio.Future()

    def _on_complete():
        f.set_result(True)

    loop.call_later(1, _on_complete)
    return await f

if __name__ == "__main__":
    import time
    s_t = time.time()
    asyncio.run(main())
    print(time.time() - s_t)  # 约 1.0 秒
```

## 1. 休眠 - asyncio.sleep

`asyncio.sleep` 让协程休眠指定时间，其源码实现：

```python
@types.coroutine
def __sleep0():
    yield

async def sleep(delay, result=None):
    """Coroutine that completes after a given time (in seconds)."""
    if delay <= 0:
        await __sleep0()
        return result

    loop = events.get_running_loop()
    future = loop.create_future()
    h = loop.call_later(delay,
                        futures._set_result_unless_cancelled,
                        future, result)
    try:
        return await future
    finally:
        h.cancel()
```

关键点：
- 当 `delay <= 0` 时，执行 `yield` 让出控制权但不休眠
- 使用 `loop.call_later` 创建定时器，到期后设置 Future 结果
- `asyncio.sleep(0)` 是最小的让出控制权的方法

### 主动让出控制权示例

```python
import asyncio

async def demo() -> None:
    for index, i in enumerate(range(10000)):
        if index % 100 == 0:
            await asyncio.sleep(0)  # 每循环100次让出控制权
        # 假设这里的代码占用过多的CPU时间
```

## 2. 屏蔽取消 - asyncio.shield

`asyncio.shield` 保护可等待对象不受协程链上的取消传播影响：

```python
import asyncio

async def sub(f):
    await asyncio.shield(f)

async def main():
    f1 = asyncio.Future()
    f2 = asyncio.Future()
    sub1 = asyncio.create_task(sub(f1))
    sub2 = asyncio.create_task(sub(f2))
    
    f1.cancel()      # 直接取消 Future
    sub2.cancel()    # 取消包装任务
    await asyncio.sleep(0)  # 确保取消完成
    
    print("f1 future done:", f1.done())      # True
    print("f2 future done:", f2.done())      # False
    print("sub1 task done:", sub1.done())    # True
    print("sub2 task done:", sub2.done())    # True

asyncio.run(main())
```

### shield 工作原理

`shield` 通过创建新的协程链来隔离取消传播：

1. 为可等待对象创建新的 Task 来驱动执行
2. 创建 Future 容器连接原协程链
3. 通过回调机制同步状态，但阻断取消传播

```python
def shield(arg):
    inner = _ensure_future(arg)  # 创建新协程链
    if inner.done():
        return inner
    
    loop = futures._get_loop(inner)
    outer = loop.create_future()  # 创建容器
    
    def _inner_done_callback(inner):
        if outer.cancelled():
            if not inner.cancelled():
                inner.exception()  # 获取结果以便回收
            return
        
        if inner.cancelled():
            outer.cancel()
        else:
            exc = inner.exception()
            if exc is not None:
                outer.set_exception(exc)
            else:
                outer.set_result(inner.result())
    
    # 设置回调，单向传播状态
    inner.add_done_callback(_inner_done_callback)
    return outer
```

## 3. 超时控制 - asyncio.wait_for

`asyncio.wait_for` 为可等待对象设置超时，超时后取消并抛出 `TimeoutError`：

```python
import asyncio

async def long_task():
    await asyncio.sleep(3)
    return "完成"

async def main():
    try:
        result = await asyncio.wait_for(long_task(), timeout=1.0)
        print(result)
    except asyncio.TimeoutError:
        print("任务超时")

asyncio.run(main())
```

### wait_for 核心逻辑

```python
async def wait_for(fut, timeout):
    loop = events.get_running_loop()
    
    if timeout is None:
        return await fut
    
    if timeout <= 0:
        # 立即检查是否完成，否则取消
        fut = ensure_future(fut, loop=loop)
        if fut.done():
            return fut.result()
        await _cancel_and_wait(fut, loop=loop)
        try:
            return fut.result()
        except exceptions.CancelledError as exc:
            raise exceptions.TimeoutError() from exc
    
    # 创建超时容器
    waiter = loop.create_future()
    timeout_handle = loop.call_later(timeout, _release_waiter, waiter)
    cb = functools.partial(_release_waiter, waiter)
    
    fut = ensure_future(fut, loop=loop)
    fut.add_done_callback(cb)
    
    try:
        await waiter  # 等待超时或完成
        if fut.done():
            return fut.result()
        else:
            # 超时处理
            fut.remove_done_callback(cb)
            await _cancel_and_wait(fut, loop=loop)
            raise exceptions.TimeoutError()
    finally:
        timeout_handle.cancel()
```

## 4. 批量等待 - asyncio.wait

`asyncio.wait` 等待一批可等待对象，支持多种返回条件：

```python
import asyncio

async def worker(n):
    await asyncio.sleep(n)
    return n

async def main():
    tasks = [asyncio.create_task(worker(i)) for i in [1, 2, 3]]
    
    done, pending = await asyncio.wait(
        tasks, 
        timeout=2.0,
        return_when=asyncio.FIRST_COMPLETED
    )
    
    print(f"已完成: {len(done)}, 待完成: {len(pending)}")
    
    # 取消未完成的任务
    for task in pending:
        task.cancel()

asyncio.run(main())
```

### 返回条件选项

- `ALL_COMPLETED`：所有任务完成（默认）
- `FIRST_COMPLETED`：至少一个任务完成
- `FIRST_EXCEPTION`：出现第一个异常

注意：`wait` 在超时时**不会取消**未完成的任务，需要手动处理。

### wait 实现原理

```python
async def _wait(fs, timeout, return_when, loop):
    waiter = loop.create_future()
    timeout_handle = None
    
    if timeout is not None:
        timeout_handle = loop.call_later(timeout, _release_waiter, waiter)
    
    counter = len(fs)
    
    def _on_completion(f):
        nonlocal counter
        counter -= 1
        if (counter <= 0 or
            return_when == FIRST_COMPLETED or
            return_when == FIRST_EXCEPTION and
             (not f.cancelled() and f.exception() is not None)):
            
            if timeout_handle is not None:
                timeout_handle.cancel()
            if not waiter.done():
                waiter.set_result(None)
    
    # 为每个任务添加完成回调
    for f in fs:
        f.add_done_callback(_on_completion)
    
    try:
        await waiter
    finally:
        # 清理资源
        if timeout_handle is not None:
            timeout_handle.cancel()
        for f in fs:
            f.remove_done_callback(_on_completion)
    
    # 按完成状态分组返回
    done, pending = set(), set()
    for f in fs:
        if f.done():
            done.add(f)
        else:
            pending.add(f)
    return done, pending
```

## 5. 迭代完成 - asyncio.as_completed

`asyncio.as_completed` 返回迭代器，任务完成即可立即处理：

```python
import asyncio

async def worker(i):
    await asyncio.sleep(i)
    return i

async def main():
    tasks = [worker(i) for i in range(5)]
    
    for future in asyncio.as_completed(tasks, timeout=3):
        try:
            result = await future
            print(f"完成: {result}")
        except asyncio.TimeoutError:
            print("超时")
            break

asyncio.run(main())
```

### as_completed 实现原理

使用队列机制实现按完成顺序返回：

```python
def as_completed(fs, *, timeout=None):
    from .queues import Queue
    done = Queue()
    
    loop = events._get_event_loop()
    todo = {ensure_future(f, loop=loop) for f in set(fs)}
    timeout_handle = None
    
    def _on_timeout():
        # 超时时推送空值到队列
        for f in todo:
            f.remove_done_callback(_on_completion)
            done.put_nowait(None)
        todo.clear()
    
    def _on_completion(f):
        # 完成时推送结果到队列
        if not todo:
            return
        todo.remove(f)
        done.put_nowait(f)
        if not todo and timeout_handle is not None:
            timeout_handle.cancel()
    
    async def _wait_for_one():
        f = await done.get()
        if f is None:
            raise exceptions.TimeoutError
        return f.result()
    
    # 添加回调并设置超时
    for f in todo:
        f.add_done_callback(_on_completion)
    if todo and timeout is not None:
        timeout_handle = loop.call_later(timeout, _on_timeout)
    
    # 返回协程生成器
    for _ in range(len(todo)):
        yield _wait_for_one()
```

### as_completed 注意事项

超时时不会取消未完成的任务，可能导致"任务泄漏"：

```python
import asyncio
import random

async def unstable_task():
    f = asyncio.Future()
    if random.choice([0, 1]) == 0:
        f.set_result(None)
    return await f  # 50% 概率会永远等待

async def main():
    try:
        for f in asyncio.as_completed([unstable_task() for _ in range(5)], timeout=1):
            result = await f
            print("完成")
    except asyncio.TimeoutError:
        pass
    
    # 检查泄漏的任务
    leak_count = sum(1 for task in asyncio.all_tasks() 
                     if task._coro.__name__ == 'unstable_task')
    print(f"泄漏任务数: {leak_count}")

asyncio.run(main())
```

## 最佳实践

1. **合理使用 sleep(0)**：在 CPU 密集型循环中主动让出控制权
2. **谨慎使用 shield**：只在真正需要保护关键任务时使用
3. **设置合理超时**：避免任务无限等待，但给足够时间完成
4. **及时清理任务**：使用 wait 或 as_completed 时注意取消未完成任务
5. **异常处理**：妥善处理超时异常和任务取消异常

## 函数选择指南

| 函数 | 适用场景 | 特点 |
|------|----------|------|
| `sleep` | 协程休眠、让出控制权 | 简单可靠 |
| `shield` | 保护关键任务不被取消 | 隔离取消传播 |
| `wait_for` | 单个任务超时控制 | 自动取消超时任务 |
| `wait` | 批量任务等待，灵活控制 | 不自动取消，需手动处理 |
| `as_completed` | 按完成顺序处理结果 | 适合流式处理 |

## 相关内容

- [并发运行多个任务：gather、as_completed、wait](../concurrent-tasks/)
- [Asyncio 调度原理：EventLoop 工作机制](../asyncio-scheduling/)
- [可等待对象：协程、任务与 Future](../awaitables/)

## 扩展阅读

- asyncio 官方文档：Tasks and Coroutines
- PEP 3156: Asynchronous IO Support Rework

---

最后更新: 2024-01-18  |  作者: Python 编程指南  |  版本: 1.0