---
layout: doc
title: asyncio 流：StreamReader 与 StreamWriter 深入指南
permalink: /docs/basics/asyncio-streams/
category: basics
tags: [asyncio, StreamReader, StreamWriter, 流, TCP, 协议, 传输]
description: 详解 asyncio 中的流 API，包括 StreamReader/StreamWriter 的使用、传输协议原理以及非阻塞命令行应用的构建
author: Python 编程指南
date: 2024-01-18
updated: 2024-01-18
version: 1.0
difficulty: "高级"
---

# asyncio 流：StreamReader 与 StreamWriter 深入指南

## 概述

在编写网络应用程序时，虽然直接使用 socket 库功能强大，但使用复杂。asyncio 的设计者构建了更高级的流 API（Stream API），使得创建客户端、服务端应用程序更方便且更健壮。流是在 asyncio 中构建基于网络应用程序的推荐方法。

## 学习目标

- 理解传输（Transport）和协议（Protocol）的底层原理
- 掌握 StreamReader 和 StreamWriter 的高级用法
- 学会构建非阻塞命令行应用程序
- 熟悉 asyncio 服务器创建与管理

## 什么是流

在 asyncio 中，流是一组高级的类和函数，用于创建、管理网络连接和通用数报流。使用它们，我们可以：

- 创建客户端连接来读取和写入数据
- 创建服务端并自己管理它们
- 抽象套接字管理（SSL、丢失连接等）

流 API 构建在称为传输和协议的一组较低级别的 API 之上。

## 传输和协议

### 传输（Transport）

传输是与任意数据流进行通信的抽象，提供了向源发送数据和从源接收数据的定义。主要包括：

- `ReadTransport`：只读传输
- `WriteTransport`：只写传输  
- `Transport`：读写传输

### 协议（Protocol）

协议管理套接字的生命周期：建立连接、写入数据、处理响应。传输在事件发生时调用协议上的方法。

### 传输和协议示例

```python
import asyncio
from asyncio import Transport, AbstractEventLoop
from typing import Optional

class HTTPGetClientProtocol(asyncio.Protocol):

    def __init__(self, host: str, loop: AbstractEventLoop):
        self._host = host
        self._future = loop.create_future()
        self._transport: Optional[Transport] = None
        self._response_buffer: bytes = b""

    async def get_response(self):
        # 等待 self._future，直到从服务器得到响应并写入 self._future
        return await self._future

    def _get_request_bytes(self) -> bytes:
        # 创建 HTTP 请求
        request = ("GET / HTTP/1.1\r\n"
                   "Connection: close\r\n"
                   f"Host: {self._host}\r\n\r\n")
        return request.encode("utf-8")

    def connection_made(self, transport: Transport) -> None:
        """底层套接字和服务器端建立连接时会调用此方法"""
        print(f"和 {self._host} 建立连接")
        # 保存传输并发送请求
        self._transport = transport
        self._transport.write(self._get_request_bytes())

    def data_received(self, data: bytes) -> None:
        """传输在收到数据时会调用协议的 data_received 方法"""
        print("收到数据")
        self._response_buffer += data

    def eof_received(self) -> Optional[bool]:
        """服务端数据全部返回完毕时调用"""
        print("数据全部接收完毕")
        # 响应数据都接收完毕，将其写入 future 中
        self._future.set_result(self._response_buffer)
        # 返回 False 让传输自行关闭
        return False

    def connection_lost(self, exc: Optional[Exception]) -> None:
        """当连接关闭时会调用此方法"""
        if exc is None:
            print("连接正常关闭")
        else:
            # 将异常设置到 future 里面
            self._future.set_exception(exc)

async def make_request(host: str, port: int, loop: AbstractEventLoop):
    # 协议工厂，调用之后创建一个协议实例
    def protocol_factory():
        return HTTPGetClientProtocol(host, loop)
        
    # create_connection 创建套接字连接并包装在传输中
    transport, protocol = await loop.create_connection(protocol_factory, host=host, port=port)
    return await protocol.get_response()

async def main():
    loop = asyncio.get_running_loop()
    result = await make_request("www.baidu.com", 80, loop)
    print("百度一下".encode("utf-8") in result)

# asyncio.run(main())
```

## 流读取与流写入

传输和协议是较低级别的 API，不推荐直接使用。asyncio 提供了更高级别的流 API：**StreamReader** 和 **StreamWriter**。

### 基本使用

```python
import asyncio
from asyncio import StreamReader
from typing import AsyncGenerator

async def read_until_empty(stream_reader: StreamReader) -> AsyncGenerator[bytes, None]:
    # 读取一行，直到没有任何剩余数据
    while response := await stream_reader.readline():
        yield response

async def main():
    host = "www.baidu.com"
    request = ("GET / HTTP/1.1\r\n"
               "Connection: close\r\n"
               f"Host: {host}\r\n\r\n")

    # 创建流连接
    stream_reader, stream_writer = await asyncio.open_connection(host, 80)
    try:
        # 写入请求
        stream_writer.write(request.encode("utf-8"))
        await stream_writer.drain()  # 确保数据发送完毕
        
        # 读取响应
        response = b"".join([r async for r in read_until_empty(stream_reader)])
        print("百度一下".encode("utf-8") in response)
    finally:
        # 关闭连接
        stream_writer.close()
        await stream_writer.wait_closed()

# asyncio.run(main())
```

### StreamReader 方法详解

- `read(n=-1)`：读取 n 个字节，-1 表示读到 EOF
- `readexactly(n)`：精确读取 n 个字节，不够则抛出 `IncompleteReadError`
- `readline()`：读取一行数据（直到 `\n`）
- `readuntil(separator=b'\n')`：读取数据直到指定分隔符

### StreamWriter 的 drain() 方法

`write()` 方法不是协程，可能导致写缓冲区填满。`drain()` 协程确保所有排队数据都被发送到套接字：

```python
stream_writer.write(data)
await stream_writer.drain()  # 等待数据发送完毕
```

## 非阻塞命令行输入

传统的 `input()` 函数会阻塞整个线程，在 asyncio 应用中会停止事件循环。我们可以使用流来创建非阻塞的命令行应用。

### 创建标准输入流读取器

```python
import asyncio
from asyncio import StreamReader
import sys

async def create_stdin_reader() -> StreamReader:
    """创建标准输入流读取器"""
    stream_reader = asyncio.StreamReader()
    protocol = asyncio.StreamReaderProtocol(stream_reader)
    loop = asyncio.get_running_loop()
    await loop.connect_read_pipe(lambda: protocol, sys.stdin)
    return stream_reader

async def delay(seconds):
    """延时任务"""
    print(f"休眠 {seconds} 秒")
    await asyncio.sleep(seconds)
    print(f"{seconds} 秒休眠完成")

async def main():
    """非阻塞命令行应用示例"""
    stdin_reader = await create_stdin_reader()
    while True:
        delay_time = await stdin_reader.readline()
        asyncio.create_task(delay(int(delay_time)))

# 注意：Windows 系统上 connect_read_pipe 与 sys.stdin 不兼容
# asyncio.run(main())
```

## 创建服务器

使用 `asyncio.start_server` 可以创建高级服务器，无需直接操作套接字。

### 回显服务器示例

```python
import asyncio
from asyncio import StreamReader, StreamWriter
import logging

class ServerState:
    """服务器状态管理"""

    def __init__(self):
        self._writers = []

    async def add_client(self, reader: StreamReader, writer: StreamWriter):
        """添加客户端，并创建回显任务"""
        self._writers.append(writer)
        await self._on_connect(writer)
        asyncio.create_task(self._echo(reader, writer))

    async def _on_connect(self, writer: StreamWriter):
        """新连接处理"""
        writer.write(f"欢迎，当前在线人数有 {len(self._writers)} 人\n".encode("utf-8"))
        await writer.drain()
        await self._notify_all("新用户上线\n")

    async def _echo(self, reader: StreamReader, writer: StreamWriter):
        """回显处理"""
        try:
            while (data := await reader.readline()) != b"":
                writer.write(data + b"~")
                await writer.drain()
            # 客户端断开连接
            self._writers.remove(writer)
            await self._notify_all(f"有人断开连接，当前在线人数为 {len(self._writers)}")
        except ConnectionError:
            logging.info("客户端断开连接")
        except Exception as e:
            logging.error(f"出现异常: {e}")
            self._writers.remove(writer)

    async def _notify_all(self, message: str):
        """向所有客户端发送消息"""
        for writer in self._writers:
            try:
                writer.write(message.encode("utf-8"))
                await writer.drain()
            except ConnectionError:
                logging.error("无法向客户端写入数据，连接断开")
                self._writers.remove(writer)

async def main():
    """服务器主程序"""
    server_state = ServerState()

    async def client_connected(reader: StreamReader, writer: StreamWriter):
        await server_state.add_client(reader, writer)

    # 创建服务器
    server = await asyncio.start_server(client_connected, "localhost", 9999)
    async with server:
        await server.serve_forever()

# asyncio.run(main())
```

## 最佳实践

### 1. 资源管理

```python
# 正确的连接管理
async def http_client_example():
    reader, writer = await asyncio.open_connection('httpbin.org', 80)
    try:
        writer.write(b"GET /get HTTP/1.1\r\nHost: httpbin.org\r\n\r\n")
        await writer.drain()
        
        response = await reader.read(1024)
        return response
    finally:
        writer.close()
        await writer.wait_closed()
```

### 2. 异常处理

```python
async def robust_client():
    try:
        reader, writer = await asyncio.open_connection('example.com', 80)
        # 进行网络操作
    except ConnectionError as e:
        print(f"连接错误: {e}")
    except asyncio.TimeoutError:
        print("连接超时")
    finally:
        if 'writer' in locals():
            writer.close()
            await writer.wait_closed()
```

### 3. 超时控制

```python
async def client_with_timeout():
    try:
        # 设置连接超时
        reader, writer = await asyncio.wait_for(
            asyncio.open_connection('example.com', 80),
            timeout=5.0
        )
        
        # 设置读取超时
        data = await asyncio.wait_for(
            reader.read(1024),
            timeout=10.0
        )
        
    except asyncio.TimeoutError:
        print("操作超时")
```

## 注意事项

1. **Windows 兼容性**：`connect_read_pipe` 与 `sys.stdin` 在 Windows 上不兼容
2. **资源清理**：始终正确关闭 StreamWriter 和等待 `wait_closed()`
3. **异常处理**：网络操作容易出现异常，需要完善的异常处理机制
4. **缓冲区管理**：使用 `drain()` 确保数据发送完毕，避免缓冲区溢出

## 性能优化

1. **连接复用**：对于多次请求，复用连接而不是每次都创建新连接
2. **批量操作**：合并小的写操作，减少系统调用次数
3. **适当缓冲**：使用合适的缓冲区大小平衡内存和性能

## 相关内容

- [协程常用方法与可等待对象](../coroutine-methods/)
- [什么是 asyncio？单线程并发与事件循环](../asyncio-intro/)
- [并发运行多个任务：gather、as_completed、wait](../concurrent-tasks/)
- [Asyncio 调度原理：EventLoop 工作机制](../asyncio-scheduling/)

## 扩展阅读

- asyncio 官方文档：Streams
- asyncio 官方文档：Transports and Protocols
- Python 网络编程最佳实践

---

最后更新: 2024-01-18  |  作者: Python 编程指南  |  版本: 1.0