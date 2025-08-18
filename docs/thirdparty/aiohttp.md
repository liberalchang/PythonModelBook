---
layout: doc
title: aiohttp - 基于 asyncio 的异步 HTTP 客户端与服务端
permalink: /docs/thirdparty/aiohttp/
category: thirdparty
tags: [aiohttp, asyncio, 异步HTTP, 爬虫, 客户端, 服务器]
description: aiohttp 是一个基于 asyncio 的异步 HTTP 库，提供高性能的客户端与服务端实现，常用于高并发网络请求与异步爬虫。
author: Python 技术文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# aiohttp - 基于 asyncio 的异步 HTTP 客户端与服务端

## 📝 概述

aiohttp 是一个基于 asyncio 的异步 HTTP 库，提供客户端和服务端两部分功能。与 requests 等同步库不同，aiohttp 通过协程并发有效提升 IO 密集型任务效率，广泛用于高并发爬虫、接口调用、实时数据拉取等场景。

## 🎯 学习目标

- 了解 aiohttp 的安装方式与基本概念
- 掌握客户端常用 API（会话、请求、响应处理）
- 学会设置超时、并发控制等实用技巧
- 能够实现一个简单的异步爬虫实战

## 📋 前置知识

- Python 3.7+ 的 asyncio 协程基础
- 基本的 HTTP 请求/响应概念

## 🔍 详细内容

### 安装

```bash
# 使用 pip 安装
pip install aiohttp
```

```bash
# 使用 conda 安装（推荐在 Anaconda/Miniconda 环境中）
# 来自 conda-forge 源
conda install -c conda-forge aiohttp
```

### 同步 vs 异步对比

- 同步 requests：请求需要等待响应返回再发起下一次请求，吞吐低。
- 异步 aiohttp：通过协程并发，任务在等待 IO 时主动让出控制权，提高吞吐量。

```python
# 同步请求示例（requests）
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 作者：钢铁知识库
import time
import datetime
import requests

# 同步请求
def main():
    start = time.time()
    for i in range(5):
        res = requests.get('http://httpbin.org/delay/2')
        print(f'当前时间：{datetime.datetime.now()}, status_code = {res.status_code}')
    print(f'requests同步耗时：{time.time() - start}')

if __name__ == '__main__':
    main()
```

```python
# 异步请求示例（aiohttp + asyncio）
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 作者：钢铁知识库
import asyncio
import time
import datetime
import aiohttp

async def async_http():
    # 声明一个支持异步的上下文管理器
    async with aiohttp.ClientSession() as session:
        res = await session.get('http://httpbin.org/delay/2')
        print(f'当前时间：{datetime.datetime.now()}, status_code = {res.status}')

async def main():
    tasks = [async_http() for _ in range(5)]
    start = time.time()
    await asyncio.gather(*tasks)
    print(f'aiohttp异步耗时：{time.time() - start}')

if __name__ == '__main__':
    # Python 3.7 及以后可直接使用 asyncio.run
    asyncio.run(main())
```

### 客户端基础

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 作者：钢铁知识库
import asyncio
import aiohttp

async def get_api(session, url):
    # 声明一个支持异步的上下文管理器
    async with session.get(url) as response:
        # 读取响应文本需要 await，因为是协程
        return await response.text(), response.status

async def main():
    async with aiohttp.ClientSession() as session:
        html, status = await get_api(session, 'http://httpbin.org/delay/2')
        print(f'html: {html[:50]}')
        print(f'status : {status}')

if __name__ == '__main__':
    asyncio.run(main())
```

### 请求参数与多种方法

- URL 查询参数：通过 params 传入字典
- 常用方法：GET、POST、PUT、DELETE、HEAD、OPTIONS、PATCH

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
import aiohttp
import asyncio

async def main():
    params = {'name': '钢铁知识库', 'age': 23}
    async with aiohttp.ClientSession() as session:
        async with session.get('https://www.httpbin.org/get', params=params) as res:
            print(await res.json())  # 读取 JSON 需要 await

if __name__ == '__main__':
    asyncio.run(main())
```

```python
# 其它方法示例
session.post('http://httpbin.org/post', data=b'data')
session.put('http://httpbin.org/put', data=b'data')
session.delete('http://httpbin.org/delete')
session.head('http://httpbin.org/get')
session.options('http://httpbin.org/get')
session.patch('http://httpbin.org/patch', data=b'data')
```

### 响应读取方式

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
import aiohttp
import asyncio

async def main():
    data = {'name': '钢铁知识库', 'age': 23}
    async with aiohttp.ClientSession() as session:
        async with session.post('https://www.httpbin.org/post', data=data) as response:
            print('status:', response.status)            # 状态码
            print('headers:', response.headers)          # 响应头
            print('body:', await response.text())        # 文本
            print('bytes:', await response.read())       # 二进制
            print('json:', await response.json())        # JSON

if __name__ == '__main__':
    asyncio.run(main())
```

### 超时设置

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
import aiohttp
import asyncio

async def main():
    # 设置 1 秒的超时 
    timeout = aiohttp.ClientTimeout(total=1)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get('https://www.httpbin.org/delay/2') as response:
            print('status:', response.status)

if __name__ == '__main__':
    asyncio.run(main())
```

### 并发限制（Semaphore）

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 作者：钢铁知识库
import asyncio
from datetime import datetime
import aiohttp

# 声明最大并发量
semaphore = asyncio.Semaphore(2)

async def get_api(session):
    async with semaphore:
        print(f'scrapting...{datetime.now()}')
        async with session.get('https://www.baidu.com') as response:
            await asyncio.sleep(2)

async def main():
    async with aiohttp.ClientSession() as session:
        tasks = [asyncio.create_task(get_api(session)) for _ in range(10)]
        await asyncio.gather(*tasks)

if __name__ == '__main__':
    asyncio.run(main())
```

## 💡 实际应用：异步小说爬虫

{% raw %}
```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 作者：钢铁知识库
import asyncio
import json
import logging
import aiohttp
import requests

# 日志格式
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s: %(message)s')

# 章节目录api
b_id = '4308080950'
url = f'https://dushu.baidu.com/api/pc/getCatalog?data={{"book_id":"{b_id}"}}'
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
}

# 并发声明
semaphore = asyncio.Semaphore(5)

async def download(title, b_id, cid):
    # 组装详情接口 URL
    data = json.dumps({"book_id": b_id, "cid": f"{b_id}|{cid}"})
    detail_url = f'https://dushu.baidu.com/api/pc/getChapterContent?data={data}'
    async with semaphore:
        async with aiohttp.ClientSession(headers=headers) as session:
            async with session.get(detail_url) as response:
                res = await response.json()
                # 这里写入数据库（略）
                logging.info('title=%s, length=%s', title, len(res['data']['novel']['content']))

async def main():
    res = requests.get(url, headers=headers)
    tasks = []
    for item in res.json()['data']['novel']['items']:  # 拿到某小说目录cid
        title = item['title']
        cid = item['cid']
        tasks.append(download(title, b_id, cid))
    await asyncio.gather(*tasks)

if __name__ == '__main__':
    asyncio.run(main())
```
{% endraw %}

## ⚠️ 注意事项

- Python 3.7+ 推荐使用 asyncio.run 启动主协程
- ClientSession 建议复用，频繁创建/销毁会有额外开销
- JSON、text、read 等读取方法均需 await，因为是协程
- 设置合理超时，避免挂起导致资源占用
- 并发量需结合目标站点承载能力，避免过载

## 🔗 相关内容

- [asyncio 基础](../../basics/with/)  
- [requests 同步请求](https://docs.python-requests.org/)
- [Paramiko - SSH 远程控制](../paramiko/)

## 📚 扩展阅读

- [aiohttp 官方文档](https://docs.aiohttp.org/)
- [asyncio 官方文档](https://docs.python.org/3/library/asyncio.html)
- [httpbin 测试服务](https://httpbin.org/)

## 🏷️ 标签

`aiohttp` `asyncio` `异步HTTP` `客户端` `服务器` `爬虫`

---

**最后更新**: 2024-01-15  
**作者**: Python 技术文档工程师  
**版本**: 1.0

### 进阶技巧与最佳实践（客户端）

### 更细粒度的超时配置

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 更细粒度的超时：分别控制连接、连接建立、读取超时
import asyncio
import aiohttp

async def main():
    # total=None 表示不设置总超时，仅限制各阶段
    timeout = aiohttp.ClientTimeout(total=None, connect=3, sock_connect=3, sock_read=5)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        try:
            async with session.get('https://httpbin.org/delay/2') as resp:
                print('status:', resp.status)
        except asyncio.TimeoutError:
            # 任何阶段触发超时都会抛出 TimeoutError
            print('超时！')

if __name__ == '__main__':
    asyncio.run(main())
```

### 连接池与并发管理（TCPConnector）

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 通过连接器限制总并发与单主机并发，并启用 DNS 缓存
import asyncio
import aiohttp

async def fetch(session, url):
    async with session.get(url) as resp:
        return await resp.text()

async def main():
    connector = aiohttp.TCPConnector(limit=100, limit_per_host=10, ttl_dns_cache=300)
    async with aiohttp.ClientSession(connector=connector) as session:
        tasks = [fetch(session, 'https://httpbin.org/get') for _ in range(50)]
        await asyncio.gather(*tasks)

if __name__ == '__main__':
    asyncio.run(main())
```

### 代理与 SSL 证书

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 代理方式：
# 1) 从系统环境变量读取代理（HTTP_PROXY/HTTPS_PROXY）：trust_env=True
# 2) 在请求级别指定 proxy 参数
# 3) 关于 SSL：生产环境建议使用默认验证；如确需跳过验证，可传 ssl=False（不安全）
import asyncio
import aiohttp

async def main():
    async with aiohttp.ClientSession(trust_env=True) as session:
        # 指定代理示例：proxy='http://127.0.0.1:7890'
        async with session.get('https://httpbin.org/ip', proxy=None, ssl=True) as resp:
            print(await resp.json())

    # 如必须跳过 SSL 验证（不安全，谨慎使用）
    async with aiohttp.ClientSession() as session:
        async with session.get('https://self-signed.badssl.com/', ssl=False) as resp:
            print('status:', resp.status)

if __name__ == '__main__':
    asyncio.run(main())
```

### 简单重试与指数退避

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 使用简单的 for 循环实现重试与指数退避，避免瞬时网络抖动导致失败
import asyncio
import aiohttp

async def get_with_retry(session, url, retries=3, base_delay=0.5):
    for i in range(retries):
        try:
            async with session.get(url) as resp:
                # 可根据状态码决定是否重试，例如 5xx 重试
                if 500 <= resp.status < 600:
                    raise aiohttp.ClientResponseError(
                        request_info=resp.request_info, history=resp.history,
                        status=resp.status, message='server error')
                return await resp.text()
        except (aiohttp.ClientError, asyncio.TimeoutError) as e:
            if i == retries - 1:
                raise
            # 指数退避
            await asyncio.sleep(base_delay * (2 ** i))

async def main():
    timeout = aiohttp.ClientTimeout(total=5)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        html = await get_with_retry(session, 'https://httpbin.org/status/500')
        print(html[:80])

if __name__ == '__main__':
    asyncio.run(main())
```

### 流式下载（节省内存）

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 使用流式读取按块写入文件，避免一次性读入内存
import asyncio
import aiohttp

async def download(url, filepath):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            resp.raise_for_status()
            with open(filepath, 'wb') as f:
                async for chunk in resp.content.iter_chunked(8192):
                    f.write(chunk)

async def main():
    await download('https://httpbin.org/image/png', 'image.png')

if __name__ == '__main__':
    asyncio.run(main())
```

## 服务端快速上手（aiohttp.web）

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 最小可运行的 aiohttp 服务端示例
# 访问: http://127.0.0.1:8080/hello
import asyncio
from aiohttp import web

async def hello(request):
    name = request.query.get('name', 'world')
    return web.json_response({'msg': f'Hello, {name}!'});

async def init_app():
    app = web.Application()
    app.router.add_get('/hello', hello)
    return app

def main():
    web.run_app(init_app(), host='127.0.0.1', port=8080)

if __name__ == '__main__':
    # Windows/conda 环境可直接运行
    main()
```

```python
# 简单客户端调用示例
#!/usr/bin/env python
# -*- coding: utf-8 -*-
import asyncio
import aiohttp

async def main():
    async with aiohttp.ClientSession() as session:
        async with session.get('http://127.0.0.1:8080/hello', params={'name': 'Trae'}) as resp:
            print(await resp.json())

if __name__ == '__main__':
    asyncio.run(main())
```