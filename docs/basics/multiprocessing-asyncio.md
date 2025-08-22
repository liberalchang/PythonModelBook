---
layout: doc
title: 在 asyncio 中引入多进程（CPU 密集型任务协作）
permalink: /docs/basics/multiprocessing-asyncio/
category: basics
tags: [asyncio, multiprocessing, 并发, 并行, 进程池]
description: 将 CPU 密集型任务交由多进程处理，并与 asyncio 事件循环协作以提升吞吐与响应性。
author: Python 编程指南
date: 2024-01-20
updated: 2024-01-20
version: 1.0
difficulty: "中高级"
---

# 在 asyncio 中引入多进程

当任务为 CPU 密集型时，单线程事件循环难以有效利用多核。此时可通过多进程并行计算，结合 asyncio 调度 IO 密集型部分，实现更好的吞吐与响应。

## 方式一：concurrent.futures + ProcessPoolExecutor

```python
# -*- coding: utf-8 -*-
import asyncio
from concurrent.futures import ProcessPoolExecutor

# CPU 密集型函数（纯阻塞）
def cpu_bound(n: int) -> int:
    # 简单计算：斐波那契（递归版仅演示）
    if n < 2:
        return n
    return cpu_bound(n - 1) + cpu_bound(n - 2)

async def main():
    loop = asyncio.get_running_loop()
    with ProcessPoolExecutor(max_workers=4) as pool:
        tasks = [loop.run_in_executor(pool, cpu_bound, i) for i in range(25, 30)]
        results = await asyncio.gather(*tasks)
        print(results)

asyncio.run(main())
```

## 方式二：asyncio.to_thread vs 进程

- `asyncio.to_thread` 适合 IO 阻塞或轻量 CPU 任务，受 GIL 限制无法并行多核。
- CPU 密集建议使用 `ProcessPoolExecutor` 或 `multiprocessing` 原生 API。

## 方式三：原生 multiprocessing 协作（简单示例）

```python
from multiprocessing import Pool
import os

# 在子进程执行的纯函数

def work(x):
    # 这里避免调用协程/事件循环相关代码
    return x * x

if __name__ == '__main__':
    with Pool(processes=os.cpu_count()) as p:
        print(p.map(work, range(10)))
```

在 asyncio 应用中，可将计算任务封装为进程池提交；事件循环继续处理网络 IO，实现“计算-IO”解耦。

## 性能与注意事项

- 进程间通信与序列化成本较高，宜用于粒度较大的任务。
- 可重入/可序列化：提交到进程池的函数必须可被 pickle。
- 在 Windows 上使用 `if __name__ == "__main__":` 保护入口，避免子进程递归创建。
- 留意关闭时机：在应用退出前显式关闭进程池或使用上下文管理器。

## 相关阅读

- [多进程与进程池基础](../multiprocessing/)
- [concurrent.futures 概览](../concurrent-futures/)
- [在 asyncio 中使用多线程](../asyncio-threads/)