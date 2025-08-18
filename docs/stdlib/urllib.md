---
layout: doc
title: urllib 模块
permalink: /docs/stdlib/urllib/
category: stdlib
tags: [HTTP, URL处理, 网络请求, 编码解码, 抓取]
description: Python urllib模块详解 - URL解析、HTTP请求与编码解码的标准库工具
author: Python教程
date: 2024-12-19
updated: 2024-12-19
version: 1.0
difficulty: "中级"
---

# urllib 模块

## 📝 概述

urllib是Python标准库中用于处理URL（统一资源定位符）的模块集合，涵盖URL解析、HTTP请求、编码解码、错误处理等功能。Python 3中将其拆分为多个子模块：
- urllib.request：发送HTTP/HTTPS请求
- urllib.parse：URL解析与构建
- urllib.error：异常类型
- urllib.robotparser：解析robots.txt

它适用于轻量级的HTTP操作，若需要复杂会话管理推荐使用第三方库requests。

## 🎯 学习目标

- 了解urllib的模块结构和核心功能
- 掌握GET/POST等常见HTTP请求的发送
- 学会URL解析、拼装和编码/解码
- 处理网络请求异常与重试
- 理解代理、超时、Headers的配置

## 📋 前置知识

- HTTP基础知识（方法、状态码、Headers）
- 编码与字符集（UTF-8、URL编码）
- 字典、列表、字符串操作

## 🔍 详细内容

### urllib.request - 请求发送

#### 基本GET请求

```python
from urllib.request import urlopen

resp = urlopen('https://httpbin.org/get?name=python&age=30')
print(resp.status)            # 状态码
print(resp.getheaders())      # 响应头
print(resp.read().decode())   # 响应体
```

#### 设置超时与异常处理

```python
from urllib.request import urlopen
from urllib.error import URLError, HTTPError

try:
    resp = urlopen('https://httpbin.org/delay/3', timeout=2)
    print(resp.read())
except HTTPError as e:
    print('HTTP错误:', e.code, e.reason)
except URLError as e:
    print('网络错误:', e.reason)
```

#### 自定义请求（Headers/POST/二进制）

```python
from urllib.request import Request, urlopen
from urllib.parse import urlencode

# 构建POST数据
form = {'username': 'alice', 'password': 'secret'}
body = urlencode(form).encode('utf-8')

req = Request(
    url='https://httpbin.org/post',
    data=body,                      # 有data即为POST
    headers={
        'User-Agent': 'Mozilla/5.0',
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    method='POST'
)
resp = urlopen(req)
print(resp.status)
print(resp.read().decode('utf-8'))
```

#### 代理、认证与Cookie

```python
from urllib.request import ProxyHandler, build_opener, HTTPCookieProcessor
from http.cookiejar import CookieJar

# 设置HTTP代理
proxy = ProxyHandler({'http': 'http://127.0.0.1:8080', 'https': 'http://127.0.0.1:8080'})

# 管理Cookie
cookies = CookieJar()
opener = build_opener(proxy, HTTPCookieProcessor(cookies))

# 使用自定义opener发送请求
resp = opener.open('https://httpbin.org/cookies/set?k1=v1&k2=v2')
print('Cookies:', [c.name + '=' + c.value for c in cookies])
```

### urllib.parse - URL解析构建

```python
from urllib.parse import urlparse, urlunparse, urlsplit, urlunsplit
from urllib.parse import urlencode, parse_qs, quote, unquote

# 解析URL
u = urlparse('https://user:pass@www.example.com:8080/path/index.html?a=1&b=2#frag')
print(u.scheme, u.netloc, u.path, u.params, u.query, u.fragment)

# 拼装URL
u2 = urlunparse(('https', 'www.example.com', '/search', '', urlencode({'q': 'python 3'}), ''))
print(u2)

# 查询参数解析与编码
qs = parse_qs('a=1&a=2&b=hello%20world')
print(qs)  # {'a': ['1', '2'], 'b': ['hello world']}

print(quote('中文 与 空格'))       # URL编码
print(unquote('%E4%B8%AD%E6%96%87%20%E4%B8%8E%20%E7%A9%BA%E6%A0%BC'))  # 解码
```

### urllib.error - 异常

- HTTPError：HTTP层面的错误（含状态码）
- URLError：网络层错误或URL错误（DNS、超时等）

### urllib.robotparser - robots.txt

```python
from urllib.robotparser import RobotFileParser

rp = RobotFileParser()
rp.set_url('https://www.python.org/robots.txt')
rp.read()
print(rp.can_fetch('*', 'https://www.python.org/'))    # 是否允许抓取
```

## 💡 实际应用

### 1. 简易爬虫：抓取分页数据

```python
# -*- coding: utf-8 -*-
from urllib.request import Request, urlopen
from urllib.parse import urlencode
import json, time

BASE = 'https://httpbin.org/get'

for page in range(1, 4):
    params = urlencode({'page': page, 'q': 'python'})
    req = Request(BASE + '?' + params, headers={'User-Agent': 'Mozilla/5.0'})
    with urlopen(req, timeout=5) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print('Page', page, 'args:', data['args'])
    time.sleep(0.5)
```

### 2. 文件下载与断点续传（示意）

```python
# -*- coding: utf-8 -*-
from urllib.request import Request, urlopen
import os

url = 'https://speed.hetzner.de/100MB.bin'
local = '100MB.bin'

# 断点位置
try:
    pos = os.path.getsize(local)
except FileNotFoundError:
    pos = 0

headers = {}
if pos > 0:
    headers['Range'] = f'bytes={pos}-'  # 续传

req = Request(url, headers=headers)
with urlopen(req, timeout=30) as resp, open(local, 'ab' if pos else 'wb') as f:
    while True:
        chunk = resp.read(8192)
        if not chunk:
            break
        f.write(chunk)
```

### 3. 与xml.etree.ElementTree结合

```python
from urllib.request import urlopen
import xml.etree.ElementTree as ET

u = urlopen('https://www.w3schools.com/xml/simple.xml')
root = ET.fromstring(u.read())
for food in root.findall('food'):
    print(food.findtext('name'), food.findtext('price'))
```

## ⚠️ 注意事项

- 默认不支持HTTP/2和高级特性（如连接池、重试策略可自定义实现）
- HTTPS证书验证：企业内网或自签名证书时需要处理ssl上下文
- 字符集问题：响应体需根据Content-Type或内容推测解码
- 频繁请求请尊重网站robots.txt及限速

## 🔗 相关内容

- [xml.etree.ElementTree 模块](../xml.etree.ElementTree/) - XML解析与生成
- [socket 模块](../socket/) - 网络编程基础
- [socketserver 模块](../socketserver/) - 网络服务器框架
- [urllib.parse 文档](https://docs.python.org/3/library/urllib.parse.html)

## 📚 扩展阅读

- Python官方urllib文档：https://docs.python.org/3/library/urllib.html
- urllib.request高级用法：https://docs.python.org/3/howto/urllib2.html
- RFC 3986 - URI通用语法：https://www.rfc-editor.org/rfc/rfc3986

## 🏷️ 标签

`HTTP` `URL` `网络请求` `编码解码` `抓取`

---

**最后更新**: 2024-12-19  
**作者**: Python教程  
**版本**: 1.0