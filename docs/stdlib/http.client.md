---
layout: doc
title: http.client 模块
permalink: /docs/stdlib/http.client/
category: stdlib
tags: [HTTP, 客户端, 网络编程, 请求, 响应]
description: Python http.client 模块详解 - 低层HTTP客户端，手动构造请求与处理响应
author: Python教程
date: 2024-12-19
updated: 2024-12-19
version: 1.0
difficulty: "中级"
---

# http.client 模块

## 📝 概述

http.client 模块是 Python 标准库提供的低层 HTTP/HTTPS 客户端实现，可用于手动构造 HTTP 请求、发送并读取响应。相较于 urllib，它更贴近协议细节，适合需要精细控制请求/响应的场景。

## 🎯 学习目标

- 理解 HTTPConnection/HTTPSConnection 的用法
- 能够手动构造请求行、请求头与请求体
- 掌握响应的状态码、响应头与正文读取
- 了解持久连接、分块传输等常见细节
- 能与 ssl 模块配合完成 HTTPS 连接

## 📋 前置知识

- HTTP 协议基础（方法、状态码、报文结构）
- 文本编码、二进制与文件读写
- 基础网络编程概念

## 🔍 详细内容

### 基本用法：GET 请求

```python
# -*- coding: utf-8 -*-
from http.client import HTTPConnection

# 创建连接（默认 80 端口）
conn = HTTPConnection('httpbin.org', 80, timeout=5)

# 发送请求行与头
conn.request('GET', '/get?name=python&age=30', headers={
    'User-Agent': 'Python-HttpClient/1.0'
})

# 获取响应
resp = conn.getresponse()
print(resp.status, resp.reason)      # 状态码与原因
print(dict(resp.getheaders()))       # 响应头字典

# 读取响应体并解码
body = resp.read().decode('utf-8')
print(body)

# 关闭连接
conn.close()
```

### POST 表单与 JSON 请求

```python
# -*- coding: utf-8 -*-
from http.client import HTTPSConnection
import json

conn = HTTPSConnection('httpbin.org', 443, timeout=5)

# 发送表单（application/x-www-form-urlencoded）
form = 'username=alice&password=secret'
conn.request('POST', '/post', body=form, headers={
    'Content-Type': 'application/x-www-form-urlencoded',
})
resp = conn.getresponse()
print('form status:', resp.status)
resp.read()  # 读取并丢弃，复用连接

# 发送 JSON（application/json）
payload = json.dumps({'msg': 'hello', 'n': 1}).encode('utf-8')
conn.request('POST', '/post', body=payload, headers={
    'Content-Type': 'application/json',
})
resp = conn.getresponse()
print('json status:', resp.status)
print(resp.read().decode('utf-8'))

conn.close()
```

### 自定义请求细节

- 自定义请求头：在 request(headers=...) 传入字典
- 持久连接：同一连接上多次 request/getresponse
- 流式读取：使用 resp.read(n) 分块读取；或使用 resp.fp 进行更底层控制
- Chunked 编码：http.client 会自动处理响应端的 chunked；发送端如需分块需自行管理 body 流

### HTTPS 与证书验证

```python
# -*- coding: utf-8 -*-
from http.client import HTTPSConnection
import ssl

# 创建严格验证的 SSL 上下文（推荐）
ctx = ssl.create_default_context()

# 如需自签名证书测试，可加载 CA 或关闭验证（不推荐）
# ctx.check_hostname = False
# ctx.verify_mode = ssl.CERT_NONE

conn = HTTPSConnection('httpbin.org', 443, context=ctx, timeout=5)
conn.request('GET', '/get')
resp = conn.getresponse()
print(resp.status)
print(resp.read()[:80])  # 查看前 80 字节
conn.close()
```

## 💡 实际应用

### 1. 下载小文件到内存

```python
# -*- coding: utf-8 -*-
from http.client import HTTPSConnection

conn = HTTPSConnection('httpbin.org')
conn.request('GET', '/bytes/128')  # 返回 128 字节
resp = conn.getresponse()
data = resp.read()
print(len(data))
conn.close()
```

### 2. 与 json 模块配合处理 API

```python
# -*- coding: utf-8 -*-
from http.client import HTTPSConnection
import json

conn = HTTPSConnection('httpbin.org')
conn.request('GET', '/json')
resp = conn.getresponse()
obj = json.loads(resp.read().decode('utf-8'))
print(obj.get('slideshow', {}).get('title'))
conn.close()
```

## ⚠️ 注意事项

- 低层 API 需要手动管理连接与异常，建议封装复用
- 超时、异常处理需完善（如 socket 超时、SSL 错误）
- 不内置 Cookies、重试、连接池等高级能力（可自行实现或使用 urllib/第三方库）
- 使用 HTTPS 时务必开启证书验证，避免中间人攻击

## 🔗 相关内容

- [urllib 模块](../urllib/) - 更高层的 HTTP 客户端
- [ssl 模块](../ssl/) - TLS/SSL 支持
- [socket 模块](../socket/) - 底层网络通信

## 📚 扩展阅读

- 官方文档：https://docs.python.org/3/library/http.client.html
- HTTP/1.1 规范（RFC 7230-7235）：https://www.rfc-editor.org/rfc/rfc7230

## 🏷️ 标签

`HTTP` `客户端` `网络编程` `请求` `响应`

---

**最后更新**: 2024-12-19  
**作者**: Python教程  
**版本**: 1.0