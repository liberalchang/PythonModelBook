---
layout: doc
title: Celery - 分布式任务队列与定时任务
permalink: /docs/thirdparty/celery/
category: thirdparty
tags: [celery, 分布式任务, 异步任务, 定时任务, 任务调度, RabbitMQ, Redis]
description: 学习使用Celery实现分布式异步任务处理与定时任务调度，包含安装、基本用法、周期性任务与结果存储等实战示例
author: Python 技术文档工程师
date: 2024-01-15
updated: 2024-01-15
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

**最后更新**: 2024-01-15  
**作者**: Python 技术文档工程师  
**版本**: 1.0