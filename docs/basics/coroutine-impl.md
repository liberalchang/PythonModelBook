---
layout: doc
title: 初识 Python 协程的实现：从非阻塞 IO 到事件循环
permalink: /docs/basics/coroutine-impl/
category: basics
tags: [协程, 事件循环, 非阻塞IO, selectors, 生成器]
description: 通过构建一个最小可用的事件循环，理解协程的实现原理与并发 IO 的核心机制。
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# 初识 Python 协程的实现：从非阻塞 IO 到事件循环

## 概述

本文通过对比同步网络请求与非阻塞 IO，带你手写一个基于 selectors 的“迷你事件循环”，并从回调模型过渡到基于生成器的协程，帮助你掌握协程背后的核心思想。

## 学习目标

- 理解阻塞与非阻塞 IO 的差异
- 学会使用 selectors 构建简单事件循环
- 能实现并发网络请求的小示例
- 了解基于生成器（yield）的协程思想

## 前置知识

- socket 基础与 HTTP 请求基本结构
- Python 函数、异常处理、生成器与 yield

## 同步请求的局限

同步网络编程中，socket 默认是阻塞的：connect() 和 recv() 会阻塞当前线程，导致 CPU 空闲却无法处理其他任务。

示例：最简单的同步请求（演示阻塞点）

```python
import socket


def request(host: str) -> None:
    """同步请求并打印响应体（阻塞式）"""
    url: str = f"http://{host}"
    sock: socket.SocketType = socket.socket()
    sock.connect((host, 80))  # 阻塞点：等待连接建立
    sock.send(f"GET {url} HTTP/1.0\r\nHost: {host}\r\n\r\n".encode("ascii"))

    response_bytes: bytes = b""
    chunk: bytes = sock.recv(4096)  # 阻塞点：等待数据到来
    while chunk:
        response_bytes += chunk
        chunk = sock.recv(4096)

    print("\n".join([i for i in response_bytes.decode().split("\r\n")]))


if __name__ == "__main__":
    request("so1n.me")
```

问题：当你需要“同时”下载很多网页时，CPU 大部分时间都在空等 IO。

## 非阻塞 IO 与事件循环

将 socket 设为非阻塞后，connect/send/recv 不再等待，而是“尽快返回”。我们需要一种机制在“就绪”时被动触发处理逻辑，这就是事件循环的职责。

在 Python 中，selectors 封装了平台不同的 IO 多路复用实现（如 Linux 上的 epoll），我们可以用它注册“读/写事件”以及对应的回调。

核心思路：
- 将 socket 设为非阻塞
- 注册写事件，写事件就绪后发送 HTTP 请求，再注册读事件
- 读事件就绪则持续读取，直到连接关闭
- 主循环不断从 selector.select() 中取回可执行的回调并调用

示例：基于 selectors 的最小并发请求

```python
import socket
from selectors import DefaultSelector, EVENT_READ, EVENT_WRITE

# 选择最优事件循环实现
selector: DefaultSelector = DefaultSelector()
# 运行中的任务计数，用于结束主循环
running_cnt: int = 0


def request(host: str) -> None:
    """模拟并发请求并打印响应体（非阻塞+事件循环）"""
    global running_cnt
    running_cnt += 1  # 增加运行中的任务计数

    url: str = f"http://{host}"
    sock: socket.SocketType = socket.socket()
    sock.setblocking(False)  # 设置非阻塞

    try:
        sock.connect((host, 80))  # 非阻塞 connect 会抛 BlockingIOError
    except BlockingIOError:
        pass

    response_bytes: bytes = b""

    def read_response() -> None:
        """接收响应参数， 并判断请求是否结束"""
        nonlocal response_bytes
        chunk: bytes = sock.recv(4096)
        print(f"recv {host} body success")
        if chunk:
            response_bytes += chunk
        else:
            # 没有数据代表请求结束了， 注销监听
            selector.unregister(sock.fileno())
            global running_cnt
            running_cnt -= 1

    def connected() -> None:
        """socket 建立连接时的回调"""
        # 取消写事件监听
        selector.unregister(sock.fileno())
        print(f"{host} connect success")
        # 发送请求，并监听读事件
        sock.send(f"GET {url} HTTP/1.0\r\nHost: {host}\r\n\r\n".encode("ascii"))
        selector.register(sock.fileno(), EVENT_READ, read_response)

    # 监听写事件，等待连接就绪
    selector.register(sock.fileno(), EVENT_WRITE, connected)


if __name__ == "__main__":
    # 同时注册多个请求
    request("so1n.me")
    request("github.com")
    request("google.com")
    request("baidu.com")

    # 主事件循环
    while running_cnt > 0:
        for key, mask in selector.select():
            # key.data 保存了我们注册的回调函数
            key.data()
```

该程序近似“同时”请求多个站点，并按就绪顺序回调处理，整体耗时接近于最慢响应的耗时。

## 回调的痛点与生成器协程

回调风格会带来代码可读性与错误追踪困难（“回调地狱”）。更优雅的方式是使用“可暂停+可恢复”的协程。生成器正好具备这种能力：
- yield 暂停，恢复时继续从上次位置执行
- 可通过 throw() 将异常注入，便于错误传递

生成器与普通函数在字节码层面存在差异（例如包含 YIELD_VALUE），这使其天然适合实现“多步返回/让出”的协作式调度。

你可以先用生成器表达“等待某个 IO 事件再继续”的语义，再用事件循环驱动它们运行，这与 asyncio 的思想高度一致。

## 注意事项

- 非阻塞 socket 下，connect/send/recv 的错误语义与阻塞模式不同，注意异常处理与超时控制
- 事件循环是“协作式”的：回调/协程需要在遇到等待点时主动让出控制权
- 在高并发下，尽量避免 CPU 空转，依赖 IO 多路复用来唤醒

## 相关内容

- [什么是 asyncio？单线程并发与事件循环](../asyncio-intro/)
- [协程常用方法与可等待对象](../coroutine-methods/)

## 扩展阅读

- Python 官方库 selectors 文档
- 《Unix 网络编程》：IO 多路复用章节

---

最后更新: 2024-01-15  |  作者: Python 编程指南  |  版本: 1.0