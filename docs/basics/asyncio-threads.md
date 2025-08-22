---
layout: doc
title: 在 asyncio 中使用多线程：run_in_executor、to_thread、run_coroutine_threadsafe
permalink: /docs/basics/asyncio-threads/
category: basics
tags: [asyncio, 多线程, ThreadPoolExecutor, to_thread, run_coroutine_threadsafe]
description: 在线程中运行阻塞代码（如 requests/数据库驱动），并与 asyncio 事件循环安全协同的最佳实践。
author: Python 编程指南
date: 2024-01-20
updated: 2024-01-20
version: 1.0
difficulty: "中级"
---

# 在 asyncio 中使用多线程

## 概述

当遇到不支持异步的阻塞库（如 requests、部分数据库驱动）时，可借助线程在线程中运行阻塞调用，同时保持 asyncio 的编程模型（await、gather、as_completed）。

## 三种常用方式

### 1）asyncio.to_thread（Python 3.9+）

语义简单，直接把阻塞函数放到默认线程池执行。

```python
import asyncio, requests

# 阻塞函数：发起 HTTP 请求
def get_status(url: str) -> int:
    r = requests.get(url)
    return r.status_code

async def main():
    # to_thread 会把函数丢到线程池中执行，并返回可等待对象
    code = await asyncio.to_thread(get_status, "https://www.example.com")
    print(code)

asyncio.run(main())
```

### 2）run_in_executor + ThreadPoolExecutor

可自定义线程池大小与生命周期，便于复用。

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor
import requests

pool = ThreadPoolExecutor(max_workers=20)  # 自定义线程池

def fetch(url: str) -> str:
    # 阻塞 IO：会释放 GIL，允许并发
    return requests.get(url, timeout=5).text[:60]

async def main():
    loop = asyncio.get_running_loop()
    # 提交到线程池
    fut = loop.run_in_executor(pool, fetch, "https://httpbin.org/get")
    content = await fut
    print(content)

asyncio.run(main())
```

### 3）run_coroutine_threadsafe（跨线程投递协程）

在“其它线程”上启动的事件循环中安全地投递协程。

```python
import asyncio, threading

async def coro():
    await asyncio.sleep(1)
    print("在其它线程的事件循环中运行")

def start_loop(loop: asyncio.AbstractEventLoop):
    asyncio.set_event_loop(loop)
    loop.run_forever()

# 在新线程中启动一个事件循环
loop2 = asyncio.new_event_loop()
threading.Thread(target=start_loop, args=(loop2,), daemon=True).start()

# 将协程安全地提交到该循环
f = asyncio.run_coroutine_threadsafe(coro(), loop2)
print(f.result())  # 阻塞等待结果
```

相关：loop.call_soon_threadsafe 可从其它线程安全地往循环投递回调。

## 取消、超时与线程安全

- 在线程中运行的阻塞函数无法被“强制取消”，取消通常意味着丢弃结果；可结合超时（wait_for/timeout）与资源清理。
- 阻塞库的调用请设置超时时间（如 requests 的 timeout 参数）。
- 注意线程安全：避免在多个线程中同时读写共享对象；必要时使用 Lock/RLock。
- CPU 密集型任务优先使用进程池（ProcessPoolExecutor），线程对 CPU 任务无益。

## 组合示例：并发抓取网页

```python
import asyncio, requests

def fetch(url: str) -> int:
    # 阻塞请求，返回状态码
    return requests.get(url, timeout=5).status_code

async def main():
    urls = ["https://www.example.com"] * 20
    # 使用 to_thread 简洁并发
    tasks = [asyncio.to_thread(fetch, u) for u in urls]
    for fut in asyncio.as_completed(tasks):
        code = await fut
        print("完成:", code)

asyncio.run(main())
```

## 相关阅读

- [线程池与进程池 - concurrent.futures](./concurrent-futures/)
- [多线程编程](./multithreading/)
- [asyncio.task 常用函数：sleep/shield/wait_for/wait/as_completed](./asyncio-task-functions/)