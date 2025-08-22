---
layout: doc
title: asyncio 异步应用对象与网络编程
permalink: /docs/basics/asyncio-application-objects/
category: basics
tags: [asyncio, 网络编程, Streams, TCP, Server]
description: 使用 asyncio 的高层 Streams API 构建 TCP 客户端/服务端、请求-响应协议与数据管道。
author: Python 编程指南
date: 2024-01-20
updated: 2024-01-20
version: 1.0
difficulty: "中高级"
---

# asyncio 异步应用对象与网络编程

本页聚焦 asyncio 提供的高层网络抽象：Streams API（`StreamReader`/`StreamWriter`），以及 `open_connection` 和 `start_server` 的使用方式。

## 基本概念

- `asyncio.open_connection(host, port)`：建立 TCP 客户端连接，返回 `(reader, writer)`。
- `asyncio.start_server(client_connected_cb, host, port)`：启动 TCP 服务器，回调形如 `async def handle(reader, writer)`。
- `StreamReader`：读取字节流，常用 `read(n)`、`readuntil(sep)`、`readline()`、`readexactly(n)`。
- `StreamWriter`：写入并刷出字节流，常用 `write(data)`、`writelines(lines)`、`drain()`、`close()`。

## 客户端示例

```python
import asyncio

async def tcp_client(host='127.0.0.1', port=8888):
    reader, writer = await asyncio.open_connection(host, port)
    # 发送请求
    writer.write(b'Hello, server!')
    await writer.drain()
    # 接收响应
    data = await reader.read(100)
    print('Received:', data)
    writer.close()
    await writer.wait_closed()

asyncio.run(tcp_client())
```

## 服务器示例

```python
import asyncio

async def handle(reader: asyncio.StreamReader, writer: asyncio.StreamWriter):
    addr = writer.get_extra_info('peername')
    print('Client:', addr)
    while True:
        data = await reader.read(100)
        if not data:
            break
        writer.write(data)  # 回显
        await writer.drain()
    writer.close()
    await writer.wait_closed()

async def main():
    server = await asyncio.start_server(handle, '127.0.0.1', 8888)
    async with server:
        await server.serve_forever()

asyncio.run(main())
```

## 低层网络与协议（简述）

- 传输/协议（Transports/Protocols）接口用于更底层与细粒度控制，但通常推荐优先使用 Streams API。
- 对于 UDP，可使用 `create_datagram_endpoint()`；对于自定义协议，可实现 `asyncio.Protocol`。

## 异步子进程与队列（桥接）

- 子进程：`asyncio.create_subprocess_exec()` 可与 Streams 一致的方式读取子进程 stdout/stderr。
- 队列：`asyncio.Queue` 适合在任务间传递消息，结合服务器处理管线构建有界缓冲。

## 最佳实践

- 使用 `asyncio.start_server` 的异步上下文管理器确保优雅关闭。
- 每次写入后配合 `await writer.drain()`，避免输出缓冲撑爆。
- 连接/请求级别添加 `asyncio.wait_for` 超时，防止悬挂。
- 服务器端考虑背压与限流，结合 `Queue` 或信号量 `asyncio.Semaphore`。

## 相关阅读

- [asyncio Streams 入门](./asyncio-streams/)
- [asyncio 子进程与管道](./asyncio-subprocess/)
- [并发任务与背压控制](./concurrent-tasks/)