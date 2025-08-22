---
layout: doc
title: asyncio 高阶常用方法与事件循环精要
permalink: /docs/basics/asyncio-advanced-methods/
category: basics
tags: [asyncio, 事件循环, 回调, call_soon, call_later, run_until_complete]
description: 面向库/框架编写者的 asyncio 进阶指南：事件循环获取、运行与停止、回调调度、线程安全投递等高级用法。
author: Python 编程指南
date: 2024-01-20
updated: 2024-01-20
version: 1.0
difficulty: "中高级"
---

# asyncio 高阶常用方法与事件循环精要

事件循环是每个 asyncio 应用的核心，运行异步任务和回调，执行网络 IO 操作，以及运行子进程。应用开发者通常应当使用高层级的 `asyncio.run()`，应尽量少引用循环对象；本文聚焦库和框架开发者需要的底层控制能力。

## 获取事件循环

- `asyncio.get_running_loop()`：返回当前 OS 线程中正在运行的事件循环（只能在协程或回调中调用）。
- `asyncio.get_event_loop()`：在协程或回调内与 `get_running_loop()` 等价；否则遵循策略返回/创建循环。
- `asyncio.set_event_loop(loop)`：设置当前线程的事件循环。
- `asyncio.new_event_loop()`：创建并返回一个新的事件循环对象。

> 由于策略较复杂，推荐在协程和回调中优先使用 `get_running_loop()`。

## 运行与停止事件循环

- `loop.run_until_complete(fut)`：运行直到 `Future/Task` 完成并返回结果；传入协程会被隐式封装成 Task。
- `loop.run_forever()`：持续运行事件循环，直至 `loop.stop()` 被调用；停止后可再次 `run_forever()` 或 `run_until_complete()`。

示例：

```python
import asyncio

async def foo():
    print("这是一个协程")

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    try:
        print("开始运行协程")
        coro = foo()
        print("进入事件循环")
        loop.run_until_complete(coro)
    finally:
        print("关闭事件循环")
        loop.close()
```

带返回值：

```python
import asyncio

async def foo():
    print("这是一个协程")
    return "返回值"

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    try:
        result = loop.run_until_complete(foo())
        print(f"run_until_complete可以获取协程的{result}，默认输出None")
    finally:
        loop.close()
```

## 安排回调（Callbacks）

### loop.call_soon

在下一个事件循环迭代中立即调用回调，按注册顺序执行，每个回调仅调用一次。

```python
import asyncio

def callback_foo(name):
    print(f'callback_foo...{name}')

async def foo():
    print('async foo...')

async def main(loop):
    print('Start main...')
    loop.call_soon(callback_foo, 'Jackson')
    print('call_soon...')
    await foo()
    await asyncio.sleep(0.2)

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(main(loop))
    finally:
        loop.close()
```

- 线程安全版本：`loop.call_soon_threadsafe()` 适用于跨线程投递回调。

### loop.call_later

延时调度回调：`loop.call_later(delay, callback, *args)`。

```python
import asyncio

def callback(n):
    print(f"callback {n} invoked")

async def main(loop):
    print("注册callbacks")
    loop.call_later(0.2, callback, 1)
    loop.call_later(0.1, callback, 2)
    loop.call_soon(callback, 3)
    await asyncio.sleep(0.4)

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(main(loop))
    finally:
        loop.close()
```

## 线程池/进程池协作（简述）

- `loop.run_in_executor(executor, func, *args)`：在线程/进程池执行阻塞函数，返回 `Future`；与 `asyncio.to_thread` 类似但更通用。
- `loop.call_soon_threadsafe(cb, *args)`：在其它线程安全地投递回调。

详见：
- [在 asyncio 中使用多线程](./asyncio-threads/)
- [进程池/线程池 concurrent.futures](./concurrent-futures/)

## 最佳实践

- 常规应用优先使用 `asyncio.run()` 管理事件循环的生命周期。
- 库/框架编写者才需要直接操作 `loop`，并确保在关闭阶段清理任务与句柄。
- 跨线程协作务必使用线程安全 API：`call_soon_threadsafe`、`run_coroutine_threadsafe`。

## 相关阅读

- [什么是 asyncio？单线程并发与事件循环](./asyncio-intro/)
- [协程常用方法与可等待对象](./coroutine-methods/)
- [asyncio.task 常用函数：sleep/shield/wait_for/wait/as_completed](./asyncio-task-functions/)
- [在 asyncio 中使用多线程：run_in_executor、to_thread、run_coroutine_threadsafe](./asyncio-threads/)