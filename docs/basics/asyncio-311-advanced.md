---
layout: doc
title: Python 3.11 中的 asyncio 新特性：TaskGroup 与 timeout 高级用法
permalink: /docs/basics/asyncio-311-advanced/
category: basics
tags: [asyncio, TaskGroup, timeout, 3.11, 超时管理]
description: 介绍 Python 3.11 中 asyncio 的两个高级特性 TaskGroup 与 timeout，提供人性化的超时管理与任务编排示例
author: Python 编程指南
date: 2024-01-17
updated: 2024-01-17
version: 1.0
difficulty: "中级"
---

# Python 3.11 中的 asyncio 新特性

Python 3.11 为 asyncio 引入了两个非常实用的高级特性：`TaskGroup` 和 `asyncio.timeout`。它们分别用于更优雅地组织一组任务以及更直观地处理超时逻辑。

## TaskGroup：结构化并发

`TaskGroup` 借鉴了“结构化并发”的思想，提供了安全、明确的任务生命周期管理：

- 同一上下文内启动的任务在退出时会被妥善等待或取消
- 任何子任务异常会向上传播，避免“任务泄漏”
- 任务命名、错误聚合与清理更一致

示例：

```python
import asyncio

async def worker(n):
    await asyncio.sleep(1)
    return n

async def main():
    results = []
    async with asyncio.TaskGroup() as tg:
        for i in range(5):
            # 创建任务并附带回调收集结果
            tg.create_task(worker(i)).add_done_callback(
                lambda t: results.append(t.result())
            )
    print(sorted(results))  # TaskGroup 退出前确保所有任务完成

asyncio.run(main())
```

注意：`TaskGroup` 会在上下文退出时处理子任务的异常与取消，若任一任务抛出异常，会取消组内其它任务并向外抛出。

## asyncio.timeout：人性化的超时管理

相比 `asyncio.wait_for`，`asyncio.timeout` 提供了更直观的上下文管理方式：

```python
import asyncio

async def fetch():
    await asyncio.sleep(2)
    return "OK"

async def main():
    try:
        async with asyncio.timeout(1.0):  # 1 秒超时窗口
            res = await fetch()
            print(res)
    except asyncio.TimeoutError:
        print("超时被优雅捕获")

asyncio.run(main())
```

- 使用上下文可以包裹一段逻辑，避免在多层 await 中到处传递超时
- 支持嵌套与层层传递，语义自然

## TaskGroup 与 timeout 组合使用

将结构化并发与超时控制结合，可以编写出更加健壮的并发逻辑：

```python
import asyncio

async def fetch(i):
    await asyncio.sleep(0.3 * i)
    return i

async def main():
    results = []
    try:
        async with asyncio.timeout(1.0):
            async with asyncio.TaskGroup() as tg:
                for i in range(6):
                    tg.create_task(fetch(i)).add_done_callback(
                        lambda t: results.append(t.result())
                    )
    except asyncio.TimeoutError:
        print("整体操作超时，TaskGroup 中的任务已被取消")
    print(sorted(results))

asyncio.run(main())
```

## 与传统 API 的对比

- 与 `gather` 对比：`TaskGroup` 提供结构化生命周期，异常处理更稳健
- 与 `wait_for` 对比：`timeout` 用上下文表达范围，错误边界更清晰

## 最佳实践

1. 在需要明确任务边界与错误传播时首选 `TaskGroup`
2. 统一使用 `asyncio.timeout` 进行超时控制，避免分散的 `wait_for`
3. 对关键任务设置名称与日志，便于定位问题
4. 对需要长期存在的后台任务，使用专门的管理器而非 `TaskGroup`

---

最后更新: 2024-01-17  |  作者: Python 编程指南  |  版本: 1.0