---
layout: doc
title: 并发运行多个任务：gather、as_completed、wait 完全指南
permalink: /docs/basics/concurrent-tasks/
category: basics
tags: [协程, asyncio, gather, as_completed, wait, 并发]
description: 详解 asyncio 中并发执行多个任务的各种方法，包括 gather、as_completed、wait 的使用场景与最佳实践。
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# 并发运行多个任务：gather、as_completed、wait 完全指南

## 概述

在异步编程中，我们常需要并发执行多个任务以提升性能。Python asyncio 提供了多种方式来管理并发任务，包括 `asyncio.gather`、`asyncio.as_completed` 和 `asyncio.wait`。本文详细介绍这些方法的使用场景、特点与最佳实践。

## 学习目标

- 掌握三种主要的并发任务执行方式：gather、as_completed、wait
- 理解异步上下文管理器的使用（async with）
- 学会处理超时、异常和任务取消
- 熟悉 aiohttp 库在并发请求中的应用

## aiohttp 简介

传统的 `requests` 库使用阻塞套接字，无法与 asyncio 良好配合。为了实现真正的异步并发请求，我们需要使用 `aiohttp` 库，它基于非阻塞套接字，完全兼容 asyncio。

```python
import aiohttp
import asyncio

async def fetch_url(session, url):
    async with session.get(url) as response:
        return await response.text()

async def main():
    async with aiohttp.ClientSession() as session:
        result = await fetch_url(session, 'https://httpbin.org/get')
        print(result)

asyncio.run(main())
```

## 异步上下文管理器

异步上下文管理器（`async with`）用于管理需要异步初始化和清理的资源，如网络连接、数据库连接等。

```python
# 传统同步上下文管理器
with open('file.txt', 'r') as f:
    content = f.read()

# 异步上下文管理器
async with aiohttp.ClientSession() as session:
    async with session.get(url) as response:
        content = await response.text()
```

## 并发执行任务的三种方式

### 1. asyncio.gather

`gather` 用于等待所有任务完成，按提交顺序返回结果。

```python
import asyncio
import aiohttp

async def fetch_status(session, url):
    async with session.get(url) as response:
        return response.status

async def main():
    urls = [
        'https://httpbin.org/status/200',
        'https://httpbin.org/status/201',
        'https://httpbin.org/status/400'
    ]
    
    async with aiohttp.ClientSession() as session:
        # 所有请求并发执行，等待全部完成
        results = await asyncio.gather(
            *[fetch_status(session, url) for url in urls]
        )
        print(results)  # [200, 201, 400]

asyncio.run(main())
```

特点：
- 等待所有任务完成
- 按提交顺序返回结果
- 任一任务失败则整体失败（除非设置 `return_exceptions=True`）

### 2. asyncio.as_completed

`as_completed` 返回一个迭代器，任务完成即可立即处理结果。

```python
import asyncio
import aiohttp

async def fetch_with_delay(session, url, delay):
    await asyncio.sleep(delay)  # 模拟不同延时
    async with session.get(url) as response:
        return f"{url}: {response.status}"

async def main():
    urls_delays = [
        ('https://httpbin.org/delay/1', 1),
        ('https://httpbin.org/delay/2', 2),
        ('https://httpbin.org/delay/3', 3)
    ]
    
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_with_delay(session, url, delay) 
                for url, delay in urls_delays]
        
        # 按完成顺序处理结果
        for future in asyncio.as_completed(tasks):
            result = await future
            print(f"完成: {result}")

asyncio.run(main())
```

特点：
- 按完成顺序返回结果
- 可以立即处理已完成的任务
- 适合需要尽快处理结果的场景

### 3. asyncio.wait

`wait` 提供最灵活的控制，支持多种等待条件。

```python
import asyncio
import aiohttp

async def fetch_url(session, url):
    async with session.get(url) as response:
        return f"{url}: {response.status}"

async def main():
    urls = ['https://httpbin.org/delay/1' for _ in range(5)]
    
    async with aiohttp.ClientSession() as session:
        tasks = [asyncio.create_task(fetch_url(session, url)) 
                for url in urls]
        
        # 等待至少2个任务完成
        done, pending = await asyncio.wait(
            tasks, 
            return_when=asyncio.FIRST_COMPLETED  # 或 ALL_COMPLETED, FIRST_EXCEPTION
        )
        
        print(f"已完成: {len(done)}, 待完成: {len(pending)}")
        
        # 取消未完成的任务
        for task in pending:
            task.cancel()

asyncio.run(main())
```

等待条件选项：
- `ALL_COMPLETED`：所有任务完成（默认）
- `FIRST_COMPLETED`：至少一个任务完成
- `FIRST_EXCEPTION`：出现第一个异常

## 超时处理

### 整体超时

```python
import asyncio
import aiohttp

async def main():
    urls = ['https://httpbin.org/delay/2' for _ in range(3)]
    
    async with aiohttp.ClientSession() as session:
        tasks = [session.get(url) for url in urls]
        
        try:
            # 5秒超时
            results = await asyncio.wait_for(
                asyncio.gather(*tasks), 
                timeout=5.0
            )
        except asyncio.TimeoutError:
            print("请求超时")

asyncio.run(main())
```

### 单个请求超时

```python
async def fetch_with_timeout(session, url, timeout=3):
    try:
        async with session.get(url, timeout=timeout) as response:
            return await response.text()
    except asyncio.TimeoutError:
        return f"超时: {url}"
```

## 异常处理

```python
async def safe_fetch(session, url):
    try:
        async with session.get(url) as response:
            return response.status
    except Exception as e:
        return f"错误: {e}"

async def main():
    urls = [
        'https://httpbin.org/status/200',
        'https://httpbin.org/status/404',
        'https://invalid-url'
    ]
    
    async with aiohttp.ClientSession() as session:
        # gather 异常处理
        results = await asyncio.gather(
            *[safe_fetch(session, url) for url in urls],
            return_exceptions=True  # 返回异常而不是抛出
        )
        print(results)
```

## 性能对比与选择指南

| 方法 | 适用场景 | 特点 |
|------|----------|------|
| `gather` | 需要所有结果，按提交顺序 | 简单易用，适合批处理 |
| `as_completed` | 需要尽快处理结果 | 按完成顺序，响应性好 |
| `wait` | 需要灵活控制等待条件 | 功能最全，但较复杂 |

## 最佳实践

1. **使用连接池**：复用 `ClientSession`，避免频繁创建连接
2. **设置合理超时**：防止任务无限等待
3. **异常处理**：妥善处理网络错误、超时等异常
4. **限制并发数**：使用 `Semaphore` 控制同时进行的请求数量
5. **资源清理**：确保正确关闭会话和取消未完成任务

## 相关内容

- [协程常用方法与可等待对象](../coroutine-methods/)
- [什么是 asyncio？单线程并发与事件循环](../asyncio-intro/)
- [asyncio 并发原语：锁、信号量、事件](../sync-primitives/)

## 扩展阅读

- aiohttp 官方文档：客户端使用指南
- asyncio 官方文档：Task 和协程管理

---

最后更新: 2024-01-15  |  作者: Python 编程指南  |  版本: 1.0