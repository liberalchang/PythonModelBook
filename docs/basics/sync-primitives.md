---
layout: doc
title: asyncio 并发原语：锁、信号量、事件、条件变量详解
permalink: /docs/basics/sync-primitives/
category: basics
tags: [协程, asyncio, 锁, 信号量, 事件, 条件]
description: 讲解 asyncio 中的同步与并发原语，包括 Lock、Semaphore、Event、Condition 的使用方式与典型场景。
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# asyncio 并发原语：锁、信号量、事件、条件变量详解

## 概述

虽然 asyncio 是单线程模型，但并发场景下仍可能出现数据竞争或时序问题。为此，asyncio 提供了多种并发原语帮助我们协调协程之间的执行顺序与访问控制。

## 学习目标

- 了解为何单线程异步仍需同步原语
- 掌握 Lock、Semaphore、Event、Condition 的使用
- 学会在实际项目中进行限流、任务协调、条件等待

## 单线程并发中的数据竞争

- 即使没有线程切换，协程切换仍可能在 await 点发生，导致共享状态在多次 await 间被其他协程修改
- 使用同步原语确保关键区在一个协程内完整执行，或协调多个协程之间的状态流转

## Lock 锁

```python
import asyncio

lock = asyncio.Lock()

counter = 0

async def safe_increment():
    global counter
    async with lock:  # 进入临界区
        tmp = counter
        await asyncio.sleep(0.01)  # 模拟耗时
        counter = tmp + 1

async def main():
    tasks = [asyncio.create_task(safe_increment()) for _ in range(100)]
    await asyncio.gather(*tasks)
    print(counter)  # 100

asyncio.run(main())
```

## Semaphore 信号量（限流）

```python
import asyncio
import aiohttp

sem = asyncio.Semaphore(10)  # 同时最多进行 10 个请求

async def fetch(session, url):
    async with sem:
        async with session.get(url) as resp:
            return await resp.text()
```

## Event 事件（通知机制）

```python
import asyncio

evt = asyncio.Event()

async def waiter():
    print("等待事件...")
    await evt.wait()
    print("事件已触发！")

async def setter():
    await asyncio.sleep(1)
    evt.set()

async def main():
    await asyncio.gather(waiter(), setter())

asyncio.run(main())
```

### 优雅停止长运行任务（用 Event 作为停止信号）

```python
# 用 Event 控制协程生命周期，避免无限循环无法退出
import asyncio

stop_event = asyncio.Event()  # 停止信号

async def monitor_process():
    try:
        while not stop_event.is_set():
            # 执行监控逻辑，例如采集指标/检查进程状态
            await asyncio.sleep(1)  # 可取消点
    finally:
        # 清理资源（文件句柄/网络连接等）
        pass

async def main():
    task = asyncio.create_task(monitor_process())  # 后台运行
    await asyncio.sleep(5)  # 运行一段时间
    stop_event.set()        # 发出停止信号
    await task              # 等待任务优雅退出

asyncio.run(main())
```

## Condition 条件变量（复杂协作）

```python
import asyncio

cond = asyncio.Condition()
queue = []

async def producer():
    async with cond:
        queue.append(1)
        cond.notify()  # 通知一个等待者

async def consumer():
    async with cond:
        while not queue:
            await cond.wait()
        item = queue.pop(0)
        print("消费:", item)
```

## 最佳实践

- 确定是否真的需要同步：很多场景可通过避免共享状态来消除竞争
- 尽量缩小临界区范围，减少持锁时间
- 使用 Semaphore 做外部资源限流（如 HTTP 连接）
- 利用 Event/Condition 进行协作而不是忙等

## 相关内容

- [并发运行多个任务：gather、as_completed、wait](../concurrent-tasks/)
- [协程常用方法与可等待对象](../coroutine-methods/)

---

最后更新: 2024-01-15  |  作者: Python 编程指南  |  版本: 1.0