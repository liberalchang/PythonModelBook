---
layout: doc
title: 限制并发数量：Semaphore、令牌与连接池实战
permalink: /docs/basics/concurrency-limiting/
category: basics
tags: [asyncio, 并发控制, 限流, Semaphore, BoundedSemaphore]
description: 使用 asyncio.Semaphore/BoundedSemaphore 实现并发数量限制与限流的通用模式与实战示例。
author: Python 编程指南
date: 2024-01-20
updated: 2024-01-20
version: 1.0
difficulty: "中级"
---

# 限制并发数量：Semaphore、令牌与连接池实战

## 概述

在异步编程中，无节制地同时发起成百上千个协程会带来资源耗尽、对端限流、系统拥塞甚至崩溃的问题。通过信号量（Semaphore）等原语，我们可以优雅地限制同一时刻的并发量，实现“有界并发”。

## 适用场景

- 大量并发请求外部服务（HTTP、数据库、Redis 等）
- 本地资源有上限（文件句柄、进程/线程、连接数）
- 对端有 QPS/并发限制，需要限流与退避

## 核心 API

- asyncio.Semaphore(n)：允许最多同时 n 个协程进入临界区
- asyncio.BoundedSemaphore(n)：在释放次数大于获取次数时抛出错误，防止“多释放”导致的计数失衡

推荐模式：配合 async with 自动获取/释放。

```python
import asyncio

# 限制并发为 10
sem = asyncio.Semaphore(10)

async def worker(i: int):
    # 使用上下文管理器，确保异常也能释放
    async with sem:
        # 执行受限的异步操作
        await asyncio.sleep(0.1)  # 模拟 IO
        return i

async def main():
    tasks = [asyncio.create_task(worker(i)) for i in range(100)]
    # 分批或直接 gather 都可，根据规模与内存选择
    results = await asyncio.gather(*tasks)
    print(len(results))

asyncio.run(main())
```

## 实战：受限并发的子进程扫描（示例）

下面示例展示如何用信号量限制并发创建子进程的数量，避免瞬间创建过多进程导致系统压力过大。

```python
import asyncio
import subprocess

MAX_CONCURRENT = 50
sem = asyncio.Semaphore(MAX_CONCURRENT)

async def run_ping(host: str) -> bool:
    # 通过信号量控制同一时刻的子进程数量
    async with sem:
        proc = await asyncio.create_subprocess_exec(
            'ping', '-n', '1', host,  # Windows 下 -n 表示次数
            stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        stdout, _ = await proc.communicate()
        # Windows 下，返回码为 0 表示可达
        return proc.returncode == 0

async def scan(hosts: list[str]) -> list[str]:
    tasks = [asyncio.create_task(run_ping(h)) for h in hosts]
    results = await asyncio.gather(*tasks)
    # 根据结果筛选可达主机
    return [h for h, ok in zip(hosts, results) if ok]
```

提示：
- 子进程的标准输出建议设置为 PIPE 并及时读取，避免缓冲区写满导致阻塞。
- 对于大型扫描，建议分批次提交任务或使用 as_completed 流式处理结果以降低内存峰值。

## 实战：基于信号量的“令牌桶”限流

将信号量视作“令牌桶”，每次请求消耗 1 个令牌，定期补充令牌即可实现限流。

```python
import asyncio

# 初始令牌 5 个，最多并发 5
tokens = asyncio.BoundedSemaphore(5)

async def refill(period: float, n: int):
    # 定期补充 n 个令牌
    while True:
        await asyncio.sleep(period)
        for _ in range(n):
            try:
                tokens.release()  # 多释放会抛错，使用 BoundedSemaphore 更安全
            except ValueError:
                # 令牌满了，忽略
                break

async def call_api(i: int):
    async with tokens:
        # 调用外部 API 的受限区域
        await asyncio.sleep(0.2)
        return i

async def main():
    asyncio.create_task(refill(1.0, 5))  # 每秒补充 5 个令牌
    tasks = [asyncio.create_task(call_api(i)) for i in range(30)]
    for fut in asyncio.as_completed(tasks):
        res = await fut
        print("完成:", res)

asyncio.run(main())
```

## 常见问题与最佳实践

- 始终使用 async with 获取/释放信号量，避免异常导致“忘记释放”。
- 选择合适的并发上限：通常与对端/资源限额一致或略低。
- 大规模任务优先使用 as_completed 流式处理，降低内存压力。
- 需要公平性时，可考虑队列排队模式（先入先出），信号量只负责容量控制。

## 相关阅读

- [asyncio 并发原语：锁、信号量、事件、条件变量](./sync-primitives/)
- [并发运行多个任务：gather、as_completed、wait](./concurrent-tasks/)
- [在 asyncio 中调用外部进程（子进程）](./asyncio-subprocess/)