---
layout: doc
title: Python 协程 API 发展：从生成器到 async/await
permalink: /docs/basics/asyncio-different-apis/
category: basics
tags: [协程, asyncio, async/await, 生成器, 事件循环, 并发]
description: 深入了解 Python 协程的发展历程，从 yield from 到 async/await 语法，掌握 asyncio 的核心概念与最佳实践。
author: Python 编程指南
date: 2024-01-20
updated: 2024-01-20
version: 1.0
difficulty: "中级"
---

# Python 协程 API 发展：从生成器到 async/await

## 概述

协程本质上是一个线程，不过它是协作式的非抢占式程序，面向的是IO操作。Python 有 GIL 的限制，不能充分利用多线程实现高并发。进程和线程都是通过 CPU 的调度实现不同任务的有序执行，协程则要在写代码的时候确定执行顺序。由于协程在一个线程中，所以协程不能阻塞。

## 协程的优缺点

### 优点
- 无需线程上下文切换的开销
- 在一个线程中，不需要加锁

### 缺点
- 无法利用多核资源：协程的本质是单线程，需要和进程配合才能运行在多CPU上
- 进行阻塞(Blocking)操作(如IO时)会阻塞掉整个程序

## Python 协程的发展历程

Python 协程的发展时间较长：

- **Python 2.5**: 为生成器引入 `.send()`、`.throw()`、`.close()` 方法
- **Python 3.3**: 引入 `yield from`，可以接收返回值，可以使用 `yield from` 定义协程
- **Python 3.4**: 加入了 `asyncio` 模块
- **Python 3.5**: 增加 `async`、`await` 关键字，在语法层面提供支持
- **Python 3.7**: 使用 `async def + await` 的方式定义协程
- **Python 3.10**: 移除以 `yield from` 的方式定义协程（目前已实现）

随着 asyncio 模块的不断完善和稳定，对底层 API 进行了封装和扩展，极大地方便了使用者。由于每个版本都会新增功能，网上有很多教程使用的接口官方已经不建议直接使用，应该改用更高级的 API。

## 现代协程语法

### 基本定义

要点：
- 使用 `async def` 的形式定义
- 在协程中可以使用 `await` 关键字，注意其后跟的是"可等待对象"(协程、任务和 Future)
- 协程不能直接执行，需要在 `asyncio.run()` 中执行，也可以跟在 `await` 后面
- `async` 和 `await` 这两个关键字只能在协程中使用

```python
import asyncio

async def foo(name):
    await asyncio.sleep(1)      # 这是一个不会阻塞的sleep，是一个协程
    print(f"name = {name}")

async def main():
    # 协程本身就是一个可等待对象
    await foo("lczmx")  # 执行协程
    print("done")

if __name__ == '__main__':
    # 使用 asyncio.run 运行
    asyncio.run(main())
```

`asyncio.run(main, *, debug=False)` 方法就是对 `run_until_complete` 进行了封装：
```python
loop = events.new_event_loop()
return loop.run_until_complete(main)
```

## 可等待对象

可等待对象(awaitable)是能在 `await` 表达式中使用的对象。可以是协程或是具有 `__await__()` 方法的对象。

那么协程是如何成为可等待对象的呢？

`collections.abc.Awaitable` 类，这是为可等待对象提供的类，可被用于 `await` 表达式中：

```python
class Awaitable(metaclass=ABCMeta):
    __slots__ = ()

    @abstractmethod
    def __await__(self):    # __await__方法必须返回一个 iterator
        yield

    @classmethod
    def __subclasshook__(cls, C):
        if cls is Awaitable:
            return _check_methods(C, "__await__")
        return NotImplemented
```

用 `async def` 复合语句创建的函数，它返回的是一个 `Coroutine` 对象，而 `Coroutine` 继承 `Awaitable`。

## 协程并发

使用协程进行并发操作有几种方式：

### 方法一：使用 asyncio.create_task()

使用 `asyncio.create_task(coro)` 方法，返回一个 `Task` 对象，`Task` 类继承 `Future`，在 Python 3.7 以下版本中使用 `asyncio.ensure_future(coro_or_future)`。

```python
import asyncio

async def foo(char: str, count: int):
    for i in range(count):
        print(f"{char}-{i}")
        await asyncio.sleep(.5)

async def main():
    task1 = asyncio.create_task(foo("A", 2))
    task2 = asyncio.create_task(foo("B", 3))
    task3 = asyncio.create_task(foo("C", 2))

    await task1
    await task2
    await task3

if __name__ == '__main__':
    asyncio.run(main())
```

### 方法二：使用 asyncio.gather()

使用 `asyncio.gather()` 方法，其内部调用的是 `asyncio.ensure_future()` 方法：

```python
import asyncio

async def foo(char: str, count: int):
    for i in range(count):
        print(f"{char}-{i}")
        await asyncio.sleep(.5)

async def main():
    await asyncio.gather(foo("A", 2), foo("B", 3), foo("C", 2))

if __name__ == '__main__':
    asyncio.run(main())
```

## 回调与返回值

要完成这些功能需要 `Task` 对象，即 `asyncio.create_task()` 的返回值。由于 `Task` 继承 `Future`，实现了除 `Future.set_result()` 和 `Future.set_exception()` 外的全部 API，而 `asyncio.Future` 模仿的是 `concurrent.futures.Future` 类，所以 `Task` 很多方法和在使用线/进程池时用到的方法类似（有细微差别）。

使用回调函数和取得返回值的例子：

```python
import asyncio

def callback(future):
    # 唯一参数是一个 Task 对象
    print(future)
    # <Task finished name='Task-2' coro=<foo() done, defined at ...> result=123>
    
    print(future.result())      # 123   # 接收返回值
    print(future.get_name())    # foo

async def foo():
    print("running")
    return 123

async def main():
    task = asyncio.create_task(foo(), name="foo")   # name 形参 3.8 及以上版本可用
    task.add_done_callback(callback)                # 添加回调函数
    await task

if __name__ == '__main__':
    asyncio.run(main())
```

## 与线程结合

我们知道，协程本身就只有一个线程，假如这协程阻塞了，那么整个程序也就阻塞了。为此我们在执行一些必然会产生阻塞的代码时，可以把代码放入到其它线程/进程中，这样可以继续执行协程的其它代码了。

### 方法一：asyncio.to_thread（Python 3.9+）

这是 Python 3.9 的新方法，3.9 以下版本看方法二。在不同的线程中异步地运行函数 `func`。向此函数提供的任何 `*args` 和 `**kwargs` 会被直接传给 `func`。其返回值是一个协程，所以假如有回调等操作，使用 `asyncio.create_task(coro)` 方法，再调用 `Task` 对象的方法。

```python
import asyncio
import time

def block_func(name: str):
    time.sleep(2)       # 模拟阻塞时间
    print(f"name = {name}")

async def foo():
    # 一个协程
    print("async foo")
    await asyncio.sleep(1)

async def main():
    await asyncio.gather(
        asyncio.to_thread(block_func, name="lczmx"),
        foo()
    )

if __name__ == '__main__':
    asyncio.run(main())
```

### 方法二：loop.run_in_executor

`awaitable loop.run_in_executor(executor, func, *args)` 安排在指定的执行器(线/进程池)中调用 `func`。该方法的返回值 `awaitable` 对象，其实就是一个 `asyncio.Future` 对象。这个方法使用起来也比较简单，不过要注意传参方式：位置参数可以直接传入，而关键字参数需要使用 `functools.partial()`。

```python
from concurrent.futures import ThreadPoolExecutor
from functools import partial
import asyncio
import time

def block_func(name: str, age: int):
    time.sleep(2)  # 模拟阻塞时间
    print(f"name = {name}, age = {age}")

async def foo():
    # 一个协程
    print("async foo")
    await asyncio.sleep(1)

async def main():
    loop = asyncio.get_running_loop()

    with ThreadPoolExecutor(5) as pool:
        task = loop.run_in_executor(pool, partial(block_func, "lczmx", age=18))
        # task 可以添加回调等操作

    await asyncio.gather(foo(), task)

if __name__ == '__main__':
    asyncio.run(main())
```

## 相关阅读

- [协程常用方法与可等待对象](./coroutine-methods/)
- [并发运行多个任务：gather、as_completed、wait](./concurrent-tasks/)
- [在 asyncio 中使用多线程：run_in_executor、to_thread、run_coroutine_threadsafe](./asyncio-threads/)
- [初识 Python 协程的实现](./coroutine-impl/)
- [什么是 asyncio？单线程并发与事件循环](./asyncio-intro/)