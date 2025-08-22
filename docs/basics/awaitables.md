---
layout: doc
title: Asyncio 可等待对象（Awaitables）：Coroutines、Tasks 与 Futures
permalink: /docs/basics/awaitables/
category: basics
tags: [asyncio, awaitable, coroutine, task, future]
description: 系统讲解 asyncio 中的三类可等待对象（协程、任务、Future），以及 asyncio.run 的入口流程和最佳实践
author: Python 编程指南
date: 2024-01-16
updated: 2024-01-16
version: 1.0
difficulty: "中级"
---

# Asyncio 可等待对象（Awaitables）

在 asyncio 中，能够被 await 的对象统称为可等待对象（Awaitable），主要包括：
- 协程（Coroutine）：由 async def 定义的协程函数对象
- 任务（Task）：事件循环调度的最小单位，对协程的包装
- Future：底层占位对象，代表一个将来可用的结果

本文将系统梳理三者的作用与关系，并介绍 asyncio.run 的入口流程与注意事项。

## 协程（Coroutine）

- 使用 `async def` 定义，调用后返回一个协程对象
- 协程对象本身不可直接执行，必须通过 await 或封装成 Task 交由事件循环调度
- 协程之间通过 await 挂起，形成协作式切换

示例：

```python
import asyncio

async def fetch_data(x):
    # 模拟 IO 耗时
    await asyncio.sleep(1)
    return x * 2

async def main():
    # 直接 await 协程对象
    result = await fetch_data(10)
    print(result)

asyncio.run(main())
```

## 任务（Task）

- 通过 `asyncio.create_task(coro)` 或 `loop.create_task(coro)` 将协程包装成 Task
- Task 会被事件循环调度执行，并在完成时持有结果或异常
- 适用于需要并发执行多个协程的场景

示例：

```python
import asyncio

async def worker(n):
    await asyncio.sleep(1)
    return n

async def main():
    tasks = [asyncio.create_task(worker(i)) for i in range(5)]
    results = await asyncio.gather(*tasks)
    print(results)

asyncio.run(main())
```

注意：Task 一旦创建即开始执行，如需延迟创建，使用条件/时机控制。

## Future 对象

- Future 表示一个尚未完成的结果，占位符模式
- 在 asyncio 中，Task 继承自 Future，扩展了协程驱动能力
- 用户代码通常不直接创建 Future，更多在底层库/适配层使用

示例：

```python
import asyncio

async def set_later(fut: asyncio.Future):
    await asyncio.sleep(1)
    fut.set_result("ok")

async def main():
    loop = asyncio.get_running_loop()
    fut = loop.create_future()
    loop.create_task(set_later(fut))
    result = await fut
    print(result)

asyncio.run(main())
```

## asyncio.run 入口流程

`asyncio.run(coro)` 是运行顶层协程的便捷入口，大致流程：

1. 创建并设置一个新的事件循环（EventLoop）
2. 将顶层协程封装为 Task 并调度执行
3. 运行事件循环直到 Task 完成，返回结果
4. 正确关闭循环并清理资源（包括异步生成器等）

注意：不要在已运行的事件循环内调用 `asyncio.run`，例如在 Jupyter/GUI 环境中。

## 三者关系图谱

- Coroutine：可等待的工作单元，描述需要做什么
- Task：调度器中的执行实体，驱动 Coroutine 运行
- Future：结果占位符，提供完成状态和回调机制

Task 继承自 Future，因此所有 Task 也是 Future；而协程需要被 Task 驱动才能并发调度。

## 最佳实践

1. 顶层入口使用 `asyncio.run`，在已有事件循环内用 `await main()`
2. 需要并发时使用 `create_task` 创建任务，与 `gather/as_completed` 组合
3. 避免裸 `await` 长耗时协程阻塞其它任务，尽量通过任务并发
4. 使用 `Task.set_name` 标注关键任务，便于调试
5. 使用 `shield` 保护关键任务避免被取消

## 延伸阅读

- 并发运行多个任务：`gather`、`as_completed`、`wait`
- 任务与超时管理：`asyncio.timeout`（3.11+）与 `wait_for`
- 同步与并发原语：`Lock`、`Semaphore`、`Event`、`Condition`

---

最后更新: 2024-01-16  |  作者: Python 编程指南  |  版本: 1.0