---
layout: doc
title: RQ - Redis Queue 异步任务队列
permalink: /docs/thirdparty/rq/
category: thirdparty
tags: [rq, redis, 任务队列, 异步任务, worker]
description: 使用 RQ（Redis Queue）将耗时任务放入队列并由独立 worker 进程异步执行，涵盖安装、基本用法、任务依赖、失败重试与批量入队等实践
author: Python 技术文档工程师
date: 2025-08-22
updated: 2025-08-22
version: 1.0
difficulty: "中级"
---

# RQ - Redis Queue 异步任务队列

## 📝 概述

RQ（Redis Queue）是一个基于 Redis 的轻量级 Python 任务队列。它允许你把耗时操作从主进程中解耦，推送到队列中，由独立的 worker 进程异步执行，从而提升应用响应速度与吞吐量。

## 🎯 学习目标

- 了解 RQ 的核心概念：Queue、Job、Worker、Registry、Redis
- 能够完成 RQ 的安装与 Redis 环境准备
- 掌握入队、启动 worker、任务依赖、失败重试的实操流程
- 学会监控任务状态，以及批量入队与自定义序列化等进阶能力

## 📋 前置知识

- Python 基础与虚拟环境管理
- Redis 基本概念与服务运行（本地或容器）
- 基本的命令行操作能力

## 🔍 详细内容

本文整合了两份原始资料（工程实践分步讲解与 API 参考式说明），在不删除原始内容的前提下进行了结构化编排与格式修复，便于系统性学习与查阅。

### 工程实践分步指南（文档1）

#### 引言

已经有一些关于 Python RQ 的教程了，比如 简易教程-RQ（外部教程链接），我写这篇 Python RQ 指南时站在工程师的角度，让你通过动手一步步走下来，看完这一篇文章基本搞懂 RQ 怎么用。我在这篇文章中也会带入我用 Python 处理数据时的一些思考。

#### 为什么我的 Python 程序需要队列？

我学习使用 Python 已经有一段时间了，主要是用做数据处理，需要把数据从机器上下载下来，经过处理后放到结构化的数据库中。我自己设计的爬虫需要用到这个 Python 程序，它每天定时执行，把需要处理的数据下载产生报表。爬虫要按照顺序执行好几个步骤，比如下载数据，解析数据，存储到数据库，然后产生摘要。我的同事还设计了 web 应用，允许用户手动调用这些步骤。但是，让人困扰的是怎么监控每个任务的运行状态，通过日志和任务进程，我个人感觉都不是规范的做法。当出现错误时候，怎么处理也是问题啊。

#### 第一步：你需要有个 Redis

Linux x86/mac 上快速启动 Redis（Docker）：

```bash
docker run --name my-redis-container -p 6379:6379 -d redis
```

LinuxOne/s390x：

```bash
docker run --name my-redis-container -p 6379:6379 -d s390x/redis
```

#### 第二步：安装 RQ

```bash
pip install --user rq
# 为了执行后面的测试程序，我们还需要安装 lxml 和 requests（示例依赖）
pip install --user lxml
pip install --user requests
```

#### 第三步：建立 Redis Queue

默认 RQ 连接到 `redis://@localhost:6379/0`。若你的配置不同，请根据实际参数调整。

```python
from redis import Redis
from rq import Queue

q = Queue(connection=Redis())
```

#### 第四步：准备好你的任务

你需要随便写个函数，并把它放在某个独立的 Python 文件中。注：RQ 不允许使用当前 "__main__" 所在文件中的函数。下面这个例子是官方文档提供的，会点网页的词数，代码如下（文件名：my_module.py）：

```python
import requests

def count_words_at_url(url):
    resp = requests.get(url)
    return len(resp.text.split())
```

#### 第五步：把任务加入 RQ 队列

```python
from rq import Queue
from redis import Redis
from my_module import count_words_at_url

q = Queue(connection=Redis())
result = q.enqueue(count_words_at_url, 'http://nvie.com')
```

RQ 不仅提供了 Python 库，还提供了 `rq` 命令。通过 `rq info` 子命令，可以看到任务已在队列中：

```bash
rq info
default      |█ 1
1 queues, 1 jobs total

31b8a4a03a524c1a9a106d00419f8532 (miaocx-mbp.local 27711): busy default
1 workers, 1 queues

Updated: 2020-03-26 14:33:13.925443
```

#### 第六步：起个 Worker 开始干活吧

可以通过 `rq worker` 启动一个 worker 来处理任务。注意：
1) 如果你的机器上有多个 Python 环境，请把 PATH 指向你要用的 Python 可执行程序所在目录；
2) 把 PYTHONPATH 指向 `my_module.py` 所在目录。

```bash
export PATH=~/my_env/venv/bin:$PATH
export PYTHONPATH=~/my_folder/cqyblog/python/:$PYTHONPATH
rq worker
```

再次查看 `rq info`：

```bash
rq info
default      |█ 1
1 queues, 1 jobs total

31b8a4a03a524c1a9a106d00419f8532 (miaocx-mbp.local 27711): busy default
1 workers, 1 queues

Updated: 2020-03-26 14:33:29.341319
```

#### 第七步：如果 Job 间有依赖关系

任务可能相互之间有先后关系或依赖关系。例如先下载页面，再找出页面中全部链接，分两步走：

```python
from my_module import download_page, count_links
job1 = q.enqueue(download_page, 'http://nvie.com')
job2 = q.enqueue(count_links, depends_on=job1.id)
```

如果 worker 还在运行，它会依次执行 job1、job2。若 `count_links` 读取了不存在的文件，worker 中会抛出类似：

```text
FileNotFoundError: [Errno 2] No such file or directory: 'page.txt'
```

#### 出错处理与重试

打印失败任务的 job id 和错误信息：

```python
for job_id in q.failed_job_registry.get_job_ids():
    job = q.fetch_job(job_id)
    print(job_id)
    print(job.exc_info)
```

修复问题后，可手动重试：

```bash
cp content.txt page.txt
```

```python
job = q.failed_job_registry.requeue(job_id)
```

如需删除失败的 job：

```python
q.failed_job_registry.remove("1440f09a-2921-439b-bde9-27abfd598041")
```

---

### 模块用法详解（文档2）

#### 1. 安装 rq

```bash
pip install rq
```

同时需要可用的 Redis：
- Linux (Debian/Ubuntu): `sudo apt install redis-server`
- macOS (Homebrew): `brew install redis`
- Windows: 从 https://redis.io/download 下载并安装

#### 2. 基本概念

- 队列（Queue）：rq 的核心，用来存放待执行的任务
- 任务（Job）：代表一个要异步执行的函数调用
- Worker：独立的进程，从队列中获取任务并执行
- Redis：用作消息中间件，存储队列和任务数据

#### 3. 核心组件

- `rq.Queue`：创建和管理队列
- `rq.job.Job`：代表一个任务
- `rq.Worker`：运行 worker 进程，处理队列中的任务
- `rq.Connection`：建立与 Redis 服务器的连接
- `rq.Registry`：管理已完成、失败或延迟的任务

#### 4. 使用方法

4.1 建立 Redis 连接

```python
import redis
from rq import Queue

# 默认连接 localhost:6379
conn = redis.Redis()
# 或者指定连接参数
# conn = redis.Redis(host='localhost', port=6379, db=0)

# 创建队列
q = Queue(connection=conn)
```

4.2 定义任务函数

```python
import time

def count_words(text):
    """一个耗时的任务函数，计算单词数量。"""
    print(f"任务开始执行, text: {text}")
    time.sleep(5)  # 模拟耗时操作
    words = text.split()
    print(f"任务执行完毕, text: {text}, 单词数量: {len(words)}")
    return len(words)
```

4.3 将任务加入队列

```python
from rq import Queue
import redis

# 建立 Redis 连接（确保与 worker 使用相同配置）
conn = redis.Redis()
q = Queue(connection=conn)

# 将任务加入队列（delay/enqueue 方式）
job = q.enqueue(count_words, "This is a long sentence to count words.")
# job.id 是任务的唯一标识符
print(f"任务已加入队列，任务 ID: {job.id}")
```

4.4 启动 Worker（新终端执行）

```bash
rq worker --url redis://localhost:6379
```

> 如果 redis 监听的是非默认端口或者需要指定 db，可替换 `--url` 的值，如：`--url redis://localhost:6380/1`

4.5 监控任务状态

```python
import redis
from rq import Queue
from rq.job import Job
import time

# 建立 Redis 连接（确保与 worker 使用相同配置）
conn = redis.Redis()
q = Queue(connection=conn)

# 任务 ID 来自 enqueue 时的返回值
job_id = 'your_job_id'  # 请替换为你的任务 id
job = Job.fetch(job_id, connection=conn)

while True:
    print(f"任务状态: {job.get_status()}")
    if job.is_finished:
        if job.result:
            print(f"任务执行结果: {job.result}")
        break
    elif job.is_failed:
        print(f"任务执行失败: {job.exc_info}")
        break
    time.sleep(1)
```

#### 5. 高级用法

- 延时任务：`enqueue_in(seconds, func, *args, **kwargs)` 将任务延迟一段时间再执行
- 任务优先级：使用不同的队列处理不同优先级任务
- 任务结果：使用 `job.result` 获取任务的返回值
- 任务失败处理：使用 `job.exc_info` 获取任务的异常信息
- Worker 配置：可配置并发数、超时时间等
- 自定义序列化器：使用 `rq.serializers.Serializer` 实现自定义任务序列化/反序列化

#### 6. 示例：带参数的任务

```python
import redis
from rq import Queue
import time

def add_numbers(x, y):
    print(f"任务开始执行, x: {x}, y: {y}")
    time.sleep(3)
    result = x + y
    print(f"任务执行完毕, x: {x}, y: {y}, result: {result}")
    return result

# 建立 Redis 连接
conn = redis.Redis()
q = Queue(connection=conn)

# 将带参数的任务加入队列
job = q.enqueue(add_numbers, 5, 10)
print(f"任务已加入队列，任务 ID: {job.id}")
```

#### 7. 示例：批量添加任务

```python
import redis
from rq import Queue
import time

def long_task(i):
    print(f"任务开始执行，任务编号: {i}")
    time.sleep(2)
    print(f"任务结束执行，任务编号: {i}")
    return i

# 连接 Redis
conn = redis.Redis()
# 获取队列
queue = Queue(connection=conn)

# 批量入队（逐个 enqueue 示例）
jobs = [queue.enqueue(long_task, i) for i in range(10)]
for job in jobs:
    print(f'任务已入队：{job.id}')
```

> 注：不同 RQ 版本提供的批量 API 略有差异，可根据实际版本选用 `enqueue_many`、列表推导逐个入队等方式。

#### 8. 注意事项

- 确保 Redis 服务正常运行
- 在 worker 中确保可以导入任务函数
- 根据需要配置 Redis 连接参数（host、port、db 等）
- 处理任务中的异常，必要时实现重试
- 生产环境：更高阶与分布式需求可评估使用 Celery 等方案

#### 总结

RQ 易于上手，适合各类 Python 应用将耗时任务异步化处理，显著提升响应与用户体验。通过 worker 解耦执行、结合任务依赖和失败重试机制，能够实现稳定可靠的后台作业处理流程。
## 💡 实际应用

- 将 IO 密集或耗时任务（爬虫、报表生成、音视频处理等）从 Web 请求线程/进程中剥离
- 通过多 worker 并行执行任务，提升吞吐量

## ⚠️ 注意事项

- 保证 Redis 服务稳定可用
- worker 进程需要能 import 到你的任务函数（注意 PYTHONPATH）
- 任务要尽量做到幂等，并为失败重试设计好补偿逻辑

## 🔗 相关内容

- [Celery - 分布式任务队列与定时任务](../celery/)
- [Huey - 轻量级任务队列库](../huey/)

## 📚 扩展阅读

- 官方站点与文档: https://python-rq.org/

## 🏷️ 标签

`rq` `redis` `任务队列` `异步任务` `worker`

---

**最后更新**: 2025-08-22  
**作者**: Python 技术文档工程师  
**版本**: 1.0