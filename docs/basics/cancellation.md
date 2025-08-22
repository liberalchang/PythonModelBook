---
layout: doc
title: 取消语义与安全退出：CancelledError、传播、shield 与清理
permalink: /docs/basics/cancellation/
category: basics
tags: [asyncio, 取消, CancelledError, shield, 清理]
description: 深入理解 asyncio 的取消机制与传播规则，掌握编写“取消安全”的协程与库代码的方法。
author: Python 编程指南
date: 2024-01-20
updated: 2024-01-20
version: 1.0
difficulty: "中级"
---

# 取消语义与安全退出

## 概述

取消（Cancellation）是 asyncio 的一等公民：当任务被取消时，会在“可取消点（await 处）”抛出 CancelledError，从而中断当前协程的执行。如果库代码未正确处理取消，可能导致资源泄漏、状态错乱，甚至数据混淆。

## 关键概念

- CancelledError：在 await 处抛出并向上冒泡的异常，用于打断协程执行。
- 传播规则：取消会沿调用栈传播；使用 asyncio.shield 可“屏蔽取消”。
- 可取消点：绝大多数 await（如 sleep、IO 等）都是取消点；纯计算不是取消点。

```python
import asyncio

async def worker():
    try:
        while True:
            # await 是取消点，可能抛出 CancelledError
            await asyncio.sleep(1)
    finally:
        # 在这里做清理工作（关闭连接/回滚/释放资源等）
        print("清理资源，确保取消安全")

async def main():
    task = asyncio.create_task(worker())
    await asyncio.sleep(0.1)
    task.cancel()  # 触发取消
    try:
        await task
    except asyncio.CancelledError:
        print("已取消")

asyncio.run(main())
```

## 屏蔽取消：asyncio.shield

当你希望某段关键清理代码不被取消打断，可用 shield 包裹。

```python
import asyncio

async def commit_txn():
    # 关键阶段：不要被取消打断
    await asyncio.sleep(0.5)

async def handle_request():
    try:
        # 处理阶段...
        await asyncio.sleep(1)
    except asyncio.CancelledError:
        # 捕获后仍需完成关键收尾
        await asyncio.shield(commit_txn())
        raise
```

注意：shield 不会吞掉取消，只是推迟到关键段结束后再继续传播。

## 库设计与最佳实践

- 任何可能被取消打断的协程，都应在 finally 中完成“可重入”的清理。
- 使用异步上下文管理器（async with）封装资源的获取与释放，配合 __aexit__ 保证释放。
- 尽量避免在“发送请求已成功，但读取响应被取消”的状态下直接复用连接；必要时丢弃连接或主动清空缓冲。
- 文档中明确：哪些操作可取消、取消后的资源状态、是否需要重试。

## 与超时的关系

- 超时本质上“触发取消”（如 wait_for/timeout）；请在 finally 中妥善清理。
- 被取消的子任务，建议通过 gather(..., return_exceptions=True) 收集并合理处理。

## 小结

- 在 await 处会触发取消；使用 try/finally 做清理，必要时用 shield 保护关键段。
- 设计库时，考虑“部分完成 + 被取消”的中间状态，避免资源/状态污染。

## 相关阅读

- [asyncio.task 常用函数：sleep/shield/wait_for/wait/as_completed](./asyncio-task-functions/)
- [异步上下文管理器：async with 与 asynccontextmanager](./async-context-managers/)