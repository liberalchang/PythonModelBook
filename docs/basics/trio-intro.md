---
layout: doc
title: Trio 入门：结构化并发的另一种选择
permalink: /docs/basics/trio-intro/
category: basics
tags: [Trio, asyncio, 异步, 结构化并发]
description: 介绍 Trio 的核心概念（nursery、任务作用域）与示例，对比 asyncio 的编程模型。
author: Python 编程指南
date: 2024-01-20
updated: 2024-01-20
version: 1.0
difficulty: "中高级"
---

# Trio 入门：结构化并发

Trio 是一个强调“结构化并发”的异步库，相比 asyncio，Trio 以 nursery（托管区）明确任务的创建与生命周期，使异常处理与资源管理更简单。

## 基本用法

```python
import trio

async def main():
    print('Hello Trio')

trio.run(main)
```

## 并发与 nursery

```python
import trio

async def worker(name, delay):
    await trio.sleep(delay)
    print(f'{name} done')

async def main():
    async with trio.open_nursery() as nursery:
        nursery.start_soon(worker, 'A', 1)
        nursery.start_soon(worker, 'B', 2)
        # 退出 with 语句块前会等待所有子任务结束

trio.run(main)
```

- nursery 保证子任务作用域，异常会向上冒泡，便于集中处理。

## 简易 TCP 客户端示例

```python
import trio

async def tcp_client(host='127.0.0.1', port=8888):
    stream = await trio.open_tcp_stream(host, port)
    await stream.send_all(b'Hello!')
    data = await stream.receive_some(1024)
    print('Received:', data)
    await stream.aclose()

trio.run(tcp_client)
```

## 与 asyncio 的差异（要点）

- 结构化并发：通过 nursery 显式管理任务生命周期，避免“游离任务”。
- 取消传播与超时：基于作用域更直观；错误传播默认严格。
- API 风格：Trio 避免回调式接口，风格更统一。

## 相关阅读

- [Trio 官方文档](https://trio.readthedocs.io/)
- [Structured Concurrency 论文/讨论](https://vorpus.org/blog/notes-on-structured-concurrency/)