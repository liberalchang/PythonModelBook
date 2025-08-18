---
layout: doc
title: Python schedule 模块定时调度
permalink: /docs/basics/schedule/
category: basics
tags: [定时器, schedule, 任务调度, 轻量级调度]
description: 学习使用 Python 的 schedule 模块实现轻量级的任务定时调度，适合简单的周期性任务
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "初级-中级"
---

# Python schedule 模块定时调度

## 📝 概述

schedule 是一个轻量级的 Python 定时调度库，使用简单的 API 语法即可实现灵活的定时任务配置。适合在脚本和小型应用中实现周期性任务，不需要复杂的线程管理和持久化。

**主要特点：**
- API 直观，链式调用易读易写
- 支持多种调度表达式（every、seconds/minutes/hours/days、at 等）
- 轻量级实现，不依赖线程池或复杂框架
- 适合脚本和小型应用中的定时需求

**适用场景：**
- 简单的周期性任务
- 需要快速实现任务调度的脚本
- 没有持久化与复杂调度需求的应用

## 🎯 学习目标

- [x] schedule 的基本使用方法
- [x] 多任务调度与标签过滤
- [x] 条件执行与动态调度
- [x] 与其他定时器实现方式的对比
- [x] 注意事项与最佳实践

## 🧰 安装

```bash
# 使用 pip 安装
pip install schedule

# 或使用 conda-forge 安装（推荐 conda 环境）
conda install -c conda-forge schedule
```

## 🔍 详细内容

### 准备：监控函数

```python
import psutil
import time
import datetime

def monitor_system():
    """监测系统CPU和内存使用情况"""
    cpu_percent = psutil.cpu_percent()
    memory_percent = psutil.virtual_memory().percent
    print(f"{datetime.datetime.now():%H:%M:%S} CPU:{cpu_percent}% 内存:{memory_percent}%")

def monitor_network():
    """监测网络收发字节数"""
    net_info = psutil.net_io_counters()
    print(f"{datetime.datetime.now():%H:%M:%S} 发送={net_info.bytes_sent} 接收={net_info.bytes_recv}")
```

### 基本用法

```python
import schedule

# 每2秒执行一次
schedule.every(2).seconds.do(monitor_system)

# 每5秒执行一次
schedule.every(5).seconds.do(monitor_network)

# 主循环：检查待执行任务
print("启动schedule调度器...")
while True:
    schedule.run_pending()
    time.sleep(0.5)  # 适度休眠，降低CPU使用率
```

### 指定时间与复杂表达式

```python
# 每天 10:30 执行
schedule.every().day.at("10:30").do(lambda: print("每天固定时间执行"))

# 每周一、周三、周五执行
schedule.every().monday.do(lambda: print("每周一执行"))
schedule.every().wednesday.do(lambda: print("每周三执行"))
schedule.every().friday.do(lambda: print("每周五执行"))

# 每小时的第 15 分钟执行
schedule.every().hour.at(":15").do(lambda: print("每小时第15分钟执行"))
```

### 使用标签管理任务

```python
# 使用标签标识任务
schedule.every(2).seconds.do(monitor_system).tag("system", "fast")
schedule.every(5).seconds.do(monitor_network).tag("network")

# 只运行带有特定标签的任务
print("只运行 system 标签的任务 5 秒...")
start_time = time.time()
while time.time() - start_time < 5:
    schedule.run_pending("system")
    time.sleep(0.5)

# 清除特定标签的任务
schedule.clear("fast")
```

### 条件执行与动态调度

```python
# 条件执行：当CPU使用率高于80%时增加监控频率
import random

def dynamic_task():
    # 模拟系统负载
    cpu_load = random.randint(50, 100)
    print(f"当前模拟CPU负载: {cpu_load}%")
    
    if cpu_load > 80:
        # 增加监控频率
        print("CPU高负载，增加监控频率")
        schedule.every(1).seconds.do(monitor_system).tag("dynamic")
    else:
        # 降低监控频率
        print("CPU较空闲，降低监控频率")
        schedule.clear("dynamic")

# 每10秒检查一次系统状态
schedule.every(10).seconds.do(dynamic_task)

# 主循环
print("启动动态调度示例...")
for _ in range(30):  # 运行一段时间
    schedule.run_pending()
    time.sleep(1)
```

### 并发与长任务处理

```python
# 将长任务放入线程池执行，避免阻塞schedule主循环
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=3)

# 使用线程池包装任务
schedule.every(3).seconds.do(lambda: executor.submit(monitor_system))
schedule.every(7).seconds.do(lambda: executor.submit(monitor_network))

# 定时清理线程池完成的任务（示例）
def cleanup_finished_futures():
    # 这里可以维护 futures 列表并清理已完成的任务
    print("清理完成的后台任务...")

schedule.every(30).seconds.do(cleanup_finished_futures)

# 主循环
print("启动并发调度示例...")
for _ in range(20):
    schedule.run_pending()
    time.sleep(0.5)

executor.shutdown(wait=True)
```

## 💡 优缺点分析

### 优点

```python
def schedule_advantages():
    print("schedule 的优点:")
    print("1. API 简洁直观，易于编写与阅读")
    print("2. 适合脚本和小型服务中的周期任务")
    print("3. 轻量级，无需复杂配置")
```

### 缺点和限制

```python
def schedule_limitations():
    print("schedule 的限制:")
    print("1. 需要显式循环 run_pending，无法脱离主循环")
    print("2. 不内置持久化与分布式功能")
    print("3. 对复杂调度场景支持有限（如错过任务触发、持久化存储）")
```

## ⚠️ 注意事项

1. 调度检查需要在主循环中执行，考虑合理的 sleep 间隔
2. 考虑长任务的并发执行，避免阻塞主循环
3. 无持久化与分布式能力，不适合企业级复杂调度
4. 程序退出前清理线程池与资源

## 🔗 相关内容

- [while+sleep 循环定时器](./sleep/)
- [threading.Timer 定时器](./timer/)
- [APScheduler 框架](./apscheduler/)

## 📚 扩展阅读

- schedule 官方文档: https://schedule.readthedocs.io/
- 任务调度基础概念

## 🏷️ 标签

`定时器` `schedule` `任务调度` `轻量级调度`

---

**最后更新**: 2024-01-15  
**作者**: Python 编程指南  
**版本**: 1.0