---
layout: doc
title: ssl 模块
permalink: /docs/stdlib/ssl/
category: stdlib
tags: [SSL, TLS, 加密, 证书, HTTPS]
description: Python ssl 模块详解 - 为套接字添加 TLS/SSL 支持，证书验证与安全通信
author: Python教程
date: 2024-12-19
updated: 2024-12-19
version: 1.0
difficulty: "中级"
---

# ssl 模块

## 📝 概述

ssl 模块为 socket 提供 TLS/SSL 加密层，支持证书验证、主机名校验、双向认证等，是实现 HTTPS 与安全通信的基础。

## 🎯 学习目标

- 掌握创建安全 SSLContext 的方法
- 学会将已有 socket 包装为安全连接
- 正确处理服务器证书验证与主机名匹配
- 了解自签名证书的测试方式与风险

## 📋 前置知识

- 网络编程与 socket 基础
- HTTPS/SSL/TLS 基本概念
- 证书、公钥/私钥、CA 的基本知识

## 🔍 详细内容

### 创建默认安全上下文

```python
# -*- coding: utf-8 -*-
import ssl

# 推荐：使用系统 CA 与安全默认值
ctx = ssl.create_default_context()
print(ctx.check_hostname)       # True
print(ctx.verify_mode == ssl.CERT_REQUIRED)
```

### 包装套接字为 TLS 连接

```python
# -*- coding: utf-8 -*-
import socket, ssl

ctx = ssl.create_default_context()

with socket.create_connection(("www.python.org", 443), timeout=5) as sock:
    with ctx.wrap_socket(sock, server_hostname="www.python.org") as ssock:
        ssock.send(b"GET / HTTP/1.1\r\nHost: www.python.org\r\nConnection: close\r\n\r\n")
        print(ssock.recv(80))
```

### 加载自定义 CA 或客户端证书（双向认证）

```python
# -*- coding: utf-8 -*-
import ssl

ctx = ssl.create_default_context(cafile="/path/to/ca.pem")
# 或：ctx.load_verify_locations(cafile="/path/to/ca.pem")

# 客户端证书与私钥
# ctx.load_cert_chain(certfile="/path/to/client.crt", keyfile="/path/to/client.key", password=None)
```

### 放宽验证（仅测试用，不推荐）

```python
# -*- coding: utf-8 -*-
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
```

## 💡 实际应用

### 1. 与 urllib 协同（自定义上下文）

```python
# -*- coding: utf-8 -*-
from urllib.request import urlopen
import ssl

ctx = ssl.create_default_context()
with urlopen('https://httpbin.org/get', context=ctx, timeout=5) as resp:
    print(resp.status)
```

### 2. 与 http.client 协同

```python
# -*- coding: utf-8 -*-
from http.client import HTTPSConnection
import ssl

ctx = ssl.create_default_context()
conn = HTTPSConnection('httpbin.org', context=ctx)
conn.request('GET', '/get')
print(conn.getresponse().status)
conn.close()
```

## ⚠️ 注意事项

- 生产环境务必进行证书验证与主机名校验
- 切勿在生产中关闭证书验证（CERT_NONE）
- 妥善保管私钥，避免泄露
- 注意最低 TLS 版本与加密套件的安全性

## 🔗 相关内容

- [socket 模块](../socket/) - 基础网络套接字
- [http.client 模块](../http.client/) - 低层 HTTP 客户端
- [urllib 模块](../urllib/) - 高层 HTTP 客户端

## 📚 扩展阅读

- 官方文档：https://docs.python.org/3/library/ssl.html
- Mozilla TLS 指南：https://wiki.mozilla.org/Security/Server_Side_TLS

## 🏷️ 标签

`SSL` `TLS` `加密` `证书` `HTTPS`

---

**最后更新**: 2024-12-19  
**作者**: Python教程  
**版本**: 1.0