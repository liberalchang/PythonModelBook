---
layout: doc
title: xmlrpc 模块 - Python 的 XML-RPC 远程过程调用
permalink: /docs/stdlib/xmlrpc/
category: stdlib
tags: [标准库, 网络编程, RPC, XML-RPC, 客户端服务器]
description: Python 标准库中的 xmlrpc 模块提供了简单轻量的远程过程调用能力，包括 xmlrpc.server 与 xmlrpc.client 两部分，支持函数远程调用与二进制数据传输
author: Python技术文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "初级"
---

# xmlrpc 模块 - Python 的 XML-RPC 远程过程调用

## 📝 概述

XML-RPC（Remote Procedure Call）是一种通过网络从远程计算机调用过程（函数）的协议，基于 HTTP 作为传输，使用 XML 进行编码。Python 标准库中的 xmlrpc 模块（分为 xmlrpc.server 和 xmlrpc.client）提供了开箱即用的 RPC 支持，适用于轻量级的远程调用场景。

## 🎯 学习目标

- 理解 RPC 与 XML-RPC 的基本概念
- 掌握 xmlrpc.server 与 xmlrpc.client 的基本用法
- 能够编写简单的 XML-RPC 服务器与客户端
- 掌握多线程服务器与文件上传/下载（Binary）的实现
- 了解在 UNIX 套接字上的扩展实现方式

## 📋 前置知识

- Python 基础语法
- 基本的网络编程与客户端-服务器模型理解

## 🔍 详细内容

### RPC 基本概念

RPC（Remote Procedure Call）使得在一台机器上运行的程序像调用本地函数一样调用另一台机器上的函数。它采用客户端/服务器模式：客户端发送带参数的调用请求，服务器处理后返回结果。XML-RPC 是 RPC 的一种具体实现，使用 HTTP + XML 编码。

### xmlrpc 库结构（Python 3）

在 Python 3 中，XML-RPC 相关功能在同一个 xmlrpc 包中：
- 服务端：xmlrpc.server.SimpleXMLRPCServer
- 客户端：xmlrpc.client.ServerProxy

## 💡 实际应用

### 简单的服务器端

```python
# _*_ coding:utf-8 _*_

from xmlrpc.server import SimpleXMLRPCServer

# 调用函数
def respon_string(s: str) -> str:
    """返回带前缀的字符串"""
    return f"get string:{s}"

if __name__ == '__main__':
    # 初始化并监听端口
    server = SimpleXMLRPCServer(('localhost', 8888))
    # 注册函数：第一个为本地函数对象，第二个为对外暴露的名字
    server.register_function(respon_string, "get_string")
    print("Listening for Client")
    # 保持等待调用状态
    server.serve_forever()
```

### 简单的客户端

```python
# _*_ coding:utf-8 _*_

from xmlrpc.client import ServerProxy

if __name__ == '__main__':
    # 根据 URL 和端口初始化代理对象
    server = ServerProxy("http://localhost:8888")
    # 远程调用并传参
    print(server.get_string("cloudox"))
```

当服务器和客户端分别运行后，服务端将保持监听，客户端会进行远程调用并输出结果。

### 多线程访问（并发处理）

```python
# _*_ coding:utf-8 _*_

from xmlrpc.server import SimpleXMLRPCServer
from socketserver import ThreadingMixIn

class ThreadXMLRPCServer(ThreadingMixIn, SimpleXMLRPCServer):
    """支持多线程的 XML-RPC 服务器"""
    pass

# 调用函数1

def respon_string(s: str) -> str:
    return f"get string:{s}"

# 调用函数2

def add(x: int, y: int) -> int:
    return x + y

if __name__ == '__main__':
    server = ThreadXMLRPCServer(('localhost', 8888))
    server.register_function(respon_string, "get_string")
    server.register_function(add, 'add')
    print("Listening for Client")
    server.serve_forever()
```

客户端示例：

```python
# _*_ coding:utf-8 _*_

from xmlrpc.client import ServerProxy

if __name__ == '__main__':
    server = ServerProxy("http://localhost:8888")
    print(server.get_string("cloudox"))
    print(server.add(8, 8))
```

### 文件上传与下载（Binary）

XML-RPC 支持二进制数据传输，需要使用 xmlrpc.client.Binary 封装。若服务器端返回 None 或未返回值，需在创建 Server/Proxy 时设置 allow_none=True。

服务器：

```python
# _*_ coding:utf-8 _*_

from xmlrpc.server import SimpleXMLRPCServer
from socketserver import ThreadingMixIn
import xmlrpc.client

class ThreadXMLRPCServer(ThreadingMixIn, SimpleXMLRPCServer):
    pass

# 供客户端下载文件

def image_get():
    with open("boy.jpg", 'rb') as handle:
        return xmlrpc.client.Binary(handle.read())

# 供客户端上传文件

def image_put(data):
    with open("get_girl.jpg", 'wb') as handle:
        # 注意：写入 Binary.data
        handle.write(data.data)

if __name__ == '__main__':
    server = ThreadXMLRPCServer(('localhost', 8888), allow_none=True)
    server.register_function(image_put, 'image_put')
    server.register_function(image_get, 'image_get')
    print("Listening for Client")
    server.serve_forever()
```

客户端：

```python
from xmlrpc.client import ServerProxy
import xmlrpc.client

if __name__ == '__main__':
    server = ServerProxy("http://localhost:8888", allow_none=True)
    # 上传文件
    with open("girl.jpg", 'rb') as put_handle:
        server.image_put(xmlrpc.client.Binary(put_handle.read()))
    # 下载文件
    with open("get_boy.jpg", 'wb') as get_handle:
        get_handle.write(server.image_get().data)
```

注意：下载文件时写入的是返回值的 .data 属性，而不是返回值本身。

### 扩展：通过 UNIX 套接字访问 Supervisor（可选）

标准库的 xmlrpc.client.ServerProxy 默认只支持 http:// 和 https:// 协议；若需要通过 UNIX 套接字访问（如 Supervisor 的 XML-RPC 接口），可使用第三方库或 Supervisor 自带的传输封装。

方式一：使用第三方库 xmlrpc_unix（仅示例）

```python
# pip install xmlrpc_unix
from xmlrpc_unix import UnixServerProxy

def get_supervisor_status():
    supervisor_url = 'unix:///var/run/supervisor.sock'
    proxy = UnixServerProxy(supervisor_url)
    return proxy.supervisor.getAllProcessInfo()
```

方式二：使用 supervisor.xmlrpc.SupervisorTransport（Python 3.11 可用）

```python
import supervisor.xmlrpc
import xmlrpc.client

# 注意：serverurl 要与 supervisor.conf 中保持一致
s = xmlrpc.client.ServerProxy(
    'http://127.0.0.1',
    transport=supervisor.xmlrpc.SupervisorTransport(
        None, None, serverurl='unix:///tmp/supervisor.sock')
)

# 可用方法示例
print(s.system.listMethods())
```

supervisor.conf 关键配置示例：

```conf
[unix_http_server]
file=/tmp/supervisor.sock

[rpcinterface:supervisor]
supervisor.rpcinterface_factory=supervisor.rpcinterface:make_main_rpcinterface

[supervisorctl]
serverurl=unix:///tmp/supervisor.sock
```

## ⚠️ 注意事项

- SimpleXMLRPCServer 默认是单线程，如需并发处理请结合 ThreadingMixIn
- 二进制传输需使用 xmlrpc.client.Binary，写入时取 data 属性
- 允许 None 返回值需设置 allow_none=True
- 出于安全考虑，建议在可信网络或加密隧道内使用 XML-RPC
- XML-RPC 协议简单但功能有限，不适合复杂对象图和高性能场景

## 🔗 相关内容

- [socket 模块 - 网络编程基础](../socket/)
- [socketserver 模块 - 并发网络服务器](../socketserver/)
- [Paramiko - SSH远程控制模块](../../thirdparty/paramiko/)
- [RPyC - Python 远程过程调用框架](../../thirdparty/rpyc/)

## 📚 扩展阅读

- [Python 官方文档：xmlrpc 模块](https://docs.python.org/3/library/xmlrpc.html)
- [Supervisor 官方文档](http://supervisord.org/)

## 🏷️ 标签

`标准库` `RPC` `XML-RPC` `网络编程` `客户端服务器`

---

**最后更新**: 2024-01-15  
**作者**: Python技术文档工程师  
**版本**: 1.0