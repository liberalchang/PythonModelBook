---
layout: doc
title: Celery - 分布式任务队列与定时任务
permalink: /docs/thirdparty/celery/
category: thirdparty
tags: [celery, 分布式任务, 异步任务, 定时任务, 任务调度, RabbitMQ, Redis]
description: 学习使用Celery实现分布式异步任务处理与定时任务调度，包含安装、基本用法、周期性任务与结果存储等实战示例
author: Python 技术文档工程师
date: 2024-01-15
updated: 2025-08-22
version: 1.0
python_version: "3.7+"
library_version: "celery>=5.0.0"
difficulty: "中级"
estimated_time: "120分钟"
---

# Celery - 分布式任务队列与定时任务

## 📝 概述

在现代应用程序开发中，处理异步任务和分布式计算是常见的需求。Celery 是一个强大的分布式任务队列，它可以将任务异步执行，并在多台计算机上分布式运行。本文将深入介绍 Celery，包括其基本概念、安装方法、示例代码以及一些高级用法，以帮助你充分利用这一工具来处理异步任务和分布式计算。

**主要特点：**
- 分布式执行：支持将任务分发到多个计算机上，以实现分布式执行，从而提高处理能力和性能
- 异步任务：可以将任务交给 Celery 执行，而不必等待任务完成
- 任务调度：可在特定时间或间隔内运行任务
- 任务结果存储：支持将任务结果存储在后端以便检索
- 可扩展性：支持多个消息代理，包括 RabbitMQ、Redis 等
- 容错性：具备容错能力，处理任务执行过程中的错误和故障

**项目地址：** https://github.com/celery/celery

## 🎯 学习目标

- [x] 理解 Celery 的核心概念：App、Task、Broker、Backend
- [x] 完成 Celery 的安装与环境配置
- [x] 编写并运行基础任务：创建应用、启动 worker、调用任务
- [x] 实现周期性任务与 crontab 调度
- [x] 使用 Redis/RabbitMQ 作为消息代理与结果后端
- [x] 了解分布式部署、监控与调优要点

## 📋 前置知识

- Python 基础语法与模块化
- 进程/线程与并发基础
- 消息队列基础：RabbitMQ 或 Redis 的基本使用
- Linux/容器化部署基础（可选）

## ⚙️ 安装 Celery

```bash
pip install celery
# 如果使用 Redis 作为 broker/backend
pip install "celery[redis]"
# 如果使用 RabbitMQ，请安装并运行 RabbitMQ 服务器
```

## 🚀 基本用法

### 1) 创建 Celery 应用

创建一个名为 `celery_app.py` 的 Python 文件：

```python
from celery import Celery

# broker 使用 RabbitMQ，格式示例：pyamqp://用户:密码@主机:端口/虚拟主机
app = Celery('myapp', broker='pyamqp://guest@localhost//')

@app.task
def add(x, y):
    return x + y
```

### 2) 启动 Worker

在终端启动 Celery Worker：

```bash
celery -A celery_app worker --loglevel=info
```

### 3) 调用任务

创建 `main.py`：

```python
from celery_app import add

result = add.delay(4, 5)
print(result.get())  # 获取结果（会阻塞直到任务完成）
```

运行：

```bash
python main.py
```

## ⏰ 周期性与定时任务

Celery 内置周期性任务调度能力，可以使用 `add_periodic_task` 或 crontab 表达式。

```python
from celery import Celery
from celery.schedules import crontab

app = Celery('myapp', broker='pyamqp://guest@localhost//')

@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # 每分钟执行一次 my_task
    sender.add_periodic_task(60.0, my_task.s(), name='run every 1 minute')

@app.task
def my_task():
    # 定时任务逻辑
    print('Periodic task executed')
```

## 🌐 分布式任务与 Broker 配置

Celery 支持多种 Broker（消息代理）。以 Redis 为例：

```bash
# 安装 redis 扩展
pip install "celery[redis]"
```

```python
from celery import Celery

# 使用 Redis 作为 broker
app = Celery('myapp', broker='redis://localhost:6379/0')
```

在多台计算机上运行多个 Worker，即可实现分布式执行。

## 🗃️ 结果存储 Backend 配置

将任务结果存储到 Redis，便于后续查询：

```python
from celery import Celery
from celery.result import AsyncResult

app = Celery(
    'myapp',
    broker='pyamqp://guest@localhost//',
    backend='redis://localhost:6379/0'
)

@app.task
def add(x, y):
    return x + y

result = add.delay(4, 5)

# 获取任务ID与结果
result_id = result.id
result_obj = AsyncResult(result_id, app=app)
print(result_obj.get())
```

## 🔧 进阶配置与实践建议

- 使用配置文件或环境变量管理 broker/backend 地址
- 区分开发、测试、生产配置（队列名、并发数、序列化方式等）
- 任务应保持幂等性，必要时实现重试（autoretry_for）
- 使用 Flower 等工具监控任务执行
- 合理拆分任务粒度，避免长时间阻塞

## 更多入门示例与实践补充（来自原始资料）

### Celery 是什么？优势

- 异步任务：将耗时操作（发送短信/邮件、消息推送、音视频处理等）交给 Celery 异步执行
- 定时任务：例如每天定时运行爬虫
- 分布式：可扩展为分布式爬虫系统等
- 简单、高可用、快速、灵活：大部分组件可扩展或独立使用

### 执行流程图

![Celery 执行流程图](https://pic4.zhimg.com/80/v2-4211d9f0ddd4c971c26131b74274fa77_720w.webp)

### 使用 Redis 作为 Broker/Backend 的完整示例

```python
# tasks.py
import time
from celery import Celery

# 消息中间件与结果存储均使用 Redis
app = Celery(
    'celeryDemo',
    broker='redis://localhost:6379/1',
    backend='redis://localhost:6379/2',
)

@app.task
def add(x, y):
    print('task enter ....')
    time.sleep(5)
    return x + y
```

```python
# app.py
from tasks import add

if __name__ == '__main__':
    print('task start....')
    result = add.delay(2, 3)
    print('task end....')
    print(result)
```

启动 worker：

```bash
celery worker -A tasks -l INFO
```

### 配置文件与多任务拆分

```python
# celery_demo/__init__.py
from celery import Celery

app = Celery(
    'demo',
    include=[
        'celery_demo.task1',
        'celery_demo.task2',
    ]
)
app.config_from_object('celery_demo.celeryconfig')
```

```python
# celery_demo/celeryconfig.py （节选）
BROKER_URL = 'redis://localhost:6379/1'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/2'
CELERY_TIMEZONE = 'Asia/Shanghai'
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
```

```python
# celery_demo/task1.py
import time
from celery_demo import app

@app.task
def add(x, y):
    time.sleep(5)
    return x + y
```

```python
# celery_demo/task2.py
import time
from celery_demo import app

@app.task
def mut(x, y):
    time.sleep(5)
    return x * y
```

### 定时任务（celery beat）

```python
# celery_demo/celeryconfig.py （定时任务节选）
from datetime import timedelta
from celery.schedules import crontab

CELERYBEAT_SCHEDULE = {
    'task1': {
        'task': 'celery_demo.task1.add',
        'schedule': timedelta(seconds=10),  # 每 10 秒
        'args': (10, 20),
    },
    'task2': {
        'task': 'celery_demo.task2.mut',
        'schedule': crontab(hour=22, minute=24),  # 每天 22:24
        'args': (10, 10),
    },
}
```

启动：

```bash
celery beat -A celery_demo -l INFO
```

### 队列与路由、限速与专门 worker

```python
# celeryconf.py （节选）
from kombu import Exchange, Queue

CELERY_QUEUES = (
    Queue('default', exchange=Exchange('default'), routing_key='default'),
    Queue('crawl_caipu_list', exchange='crawl_caipu_list', routing_key='crawl_caipu_list'),
    Queue('crawl_caipu_detail', exchange='crawl_caipu_detail', routing_key='crawl_caipu_detail'),
)

CELERY_ROUTES = {
    'celery_app.teskone.crawl_caipu_list': {
        'queue': 'crawl_caipu_list',
        'routing_key': 'crawl_caipu_list',
    },
    'celery_app.teskone.crawl_caipu_detail': {
        'queue': 'crawl_caipu_detail',
        'routing_key': 'crawl_caipu_detail',
    },
}

# 限制所有任务的请求频率（示例）
CELERY_ANNOTATIONS = {'*': {'rate_limit': '1/s'}}
```

运行只消费特定队列的 worker：

```bash
celery worker -A celery项目 -l INFO -Q queuename
```

### 分布式爬虫示例

简单的使用 Celery 完成“下厨房”菜谱详情分布式爬虫示例项目：

- https://github.com/ljhyigehaoren/celery_best.git

---

## 🔗 相关内容

- [Huey - 轻量级任务队列](../huey/)
- [Schedule - Python 任务调度](../schedule/)

## 📚 扩展阅读

- 官方文档: https://docs.celeryq.dev/
- GitHub: https://github.com/celery/celery
- Brocker/Backend 选型: Redis vs RabbitMQ

## 🏷️ 标签

`分布式任务` `异步任务` `定时任务` `任务调度` `Celery` `Redis` `RabbitMQ`

---

**最后更新**: 2025-08-22  
**作者**: Python 技术文档工程师  
**版本**: 1.0