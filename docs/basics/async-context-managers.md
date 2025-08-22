---
layout: doc
title: 异步上下文管理器：async with 与 asynccontextmanager
permalink: /docs/basics/async-context-managers/
category: basics
tags: [asyncio, context manager, async with, asynccontextmanager]
description: 系统掌握异步上下文管理器的两种实现方式（类与装饰器），并正确在实际项目中管理异步资源的创建与清理。
author: Python 编程指南
date: 2024-08-21
updated: 2024-08-21
version: 1.0
difficulty: "中级"
---

# 异步上下文管理器：async with 与 asynccontextmanager

## 📝 概述

异步上下文管理器用于在异步代码中优雅管理资源的“获取与清理”。它与同步的 with 类似，但允许在进入/退出阶段执行异步操作：
- 进入：实现异步的 __aenter__
- 退出：实现异步的 __aexit__（包括异常时的清理）
常见资源：网络连接（aiohttp/SQLAlchemy async engine）、异步锁/信号量/条件变量、服务器对象（Server）、TaskGroup、超时窗口等。

建议先阅读：<mcfile name="with.md" path="d:\BaiduSyncdisk\PythonModelBook\docs\basics\with.md"></mcfile>（同步上下文管理器基础）与 <mcfile name="sync-primitives.md" path="d:\BaiduSyncdisk\PythonModelBook\docs\basics\sync-primitives.md"></mcfile>（锁/信号量）。

## 1. 自定义类：实现 __aenter__/__aexit__

```python
# 通过实现 __aenter__/__aexit__ 定义异步上下文管理器
import asyncio

class AsyncConn:
    def __init__(self):
        self.connected = False

    async def __aenter__(self):
        # 异步初始化资源
        await asyncio.sleep(0.1)
        self.connected = True
        print("已建立连接")
        return self  # 返回给 as 变量

    async def __aexit__(self, exc_type, exc, tb):
        # 无论是否异常都要清理
        await asyncio.sleep(0.1)
        self.connected = False
        print("已关闭连接")
        # 返回 False 表示异常继续向外抛；返回 True 表示“吞掉”异常
        return False

async def main():
    async with AsyncConn() as conn:
        # 在此范围内安全使用资源
        print("连接状态:", conn.connected)

asyncio.run(main())
```

要点：
- __aenter__ 返回的对象赋给 as 后的变量
- __aexit__ 必须负责清理；如需抑制异常，返回 True 即可

## 2. 使用装饰器：contextlib.asynccontextmanager

相比自定义类，装饰器方式更简洁，适合一次性封装“获取→使用→清理”的流程。

```python
# 用 asynccontextmanager 快速构建异步上下文管理器
import asyncio
from contextlib import asynccontextmanager

@asynccontextmanager
async def request_session(timeout: float = 5.0):
    # 进入阶段：创建资源
    import aiohttp
    async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=timeout)) as session:
        try:
            yield session  # 使用阶段：将资源暴露给 with 体
        finally:
            # 退出阶段：清理工作由内部 async with 自动完成
            pass

async def main():
    async with request_session(10) as session:
        async with session.get("https://httpbin.org/get") as resp:
            data = await resp.json()
            print("状态码:", resp.status, "keys:", list(data.keys())[:3])

asyncio.run(main())
```

要点：
- yield 之前是“进入”逻辑，yield 之后是“退出”逻辑
- 在 finally 中确保清理（即便发生异常）

## 3. 常见内置/库对象的异步上下文管理

- 网络会话：aiohttp.ClientSession、SQLAlchemy AsyncEngine/AsyncSession
- 同步原语：asyncio.Lock/Semaphore/Condition 均可通过 async with 管理
- 服务器对象：asyncio.start_server 返回的 Server 可作为异步上下文管理器，退出时优雅关闭
- 3.11 新特性：asyncio.TaskGroup、asyncio.timeout 也以 async with 使用

示例 1：使用信号量限制并发
```python
# 用 Semaphore 控制并发数量，进入/退出自动 acquire/release
import asyncio

sem = asyncio.Semaphore(10)

async def fetch(i):
    async with sem:  # 进入临界区（计数-1），退出自动释放
        await asyncio.sleep(0.1)
        return i

async def main():
    results = await asyncio.gather(*(fetch(i) for i in range(50)))
    print("数量:", len(results))

asyncio.run(main())
```

示例 2：Server 对象的优雅关闭
```python
# 使用 async with 确保服务器退出时正确关闭
import asyncio

async def handle(reader, writer):
    data = await reader.readline()
    writer.write(data)
    await writer.drain()
    writer.close()
    await writer.wait_closed()

async def main():
    server = await asyncio.start_server(handle, "127.0.0.1", 8888)
    async with server:  # 退出时自动关闭 server
        await server.serve_forever()

# asyncio.run(main())  # 运行示例请取消注释
```

## 4. 异常处理与最佳实践

- 总是使用 async with 管理需要清理的异步资源，防止忘记释放
- __aexit__/finally 中的清理应“尽力而为”，并考虑超时与取消
- 在 with 体中发生异常时，__aexit__ 仍会被调用；如需抑制异常，返回 True
- 对于需要限流/并发控制的场景，优先使用信号量/连接池等 async with 方案

## ✅ 小结

- async with 支持在进入/退出阶段执行异步逻辑，适合网络连接、锁、服务器等需要清理的资源
- 两种实现方式：自定义类（__aenter__/__aexit__）与 asynccontextmanager 装饰器
- 最佳实践：始终用 async with 包裹资源使用范围，异常也能确保执行清理逻辑