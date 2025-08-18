---
layout: doc
title: Tenacity - Python重试库完全指南
permalink: /docs/thirdparty/tenacity/
category: thirdparty
tags: [Tenacity, 重试, 装饰器, 异常处理, 网络请求, 第三方库]
description: Tenacity是Python中强大且灵活的重试库，提供装饰器方式实现自动重试，支持多种等待策略、停止条件和异常处理机制
author: Python技术文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# Tenacity - Python重试库完全指南

## 📝 概述

Tenacity是Python中一个强大且灵活的重试库，它可以帮助你有效地处理不稳定操作相关的问题。在编写应用程序时，经常需要处理与外部服务通信或其他不稳定操作相关的问题，这些问题可能包括网络错误、服务不可用、超时等。在这些情况下，重试操作是一种常见的解决方案。

这篇文章将介绍Tenacity重试库的使用，包括如何安装和配置Tenacity，以及如何在不同场景下使用它来处理重试操作。还有Tenacity的各种功能和选项，并提供丰富的示例代码来帮助你更好地理解如何应用它。

Tenacity提供了装饰器方式实现自动重试，支持多种等待策略、停止条件和异常处理机制，使代码更加健壮和可靠。

## 🎯 学习目标

通过本文档的学习，你将能够：

- 掌握Tenacity的安装和基本配置方法
- 学会使用@retry装饰器实现自动重试
- 了解各种等待策略和停止条件的配置
- 掌握自定义重试条件和异常处理
- 学会使用回调函数进行日志记录和监控
- 理解Tenacity的高级功能如Jitter配置等

## 📋 前置知识

- Python基础语法和装饰器概念
- 异常处理机制（try/except）
- 了解网络请求和外部服务调用场景
- 基本的日志记录概念

## 🔧 安装

```bash
# 使用pip安装
pip install tenacity

# 或者使用conda安装
conda install -c conda-forge tenacity
```

## 🔍 详细内容

### 基本概念

Tenacity的基本思想是定义一个装饰器，该装饰器可以应用于函数或方法，以实现自动重试。核心概念包括：

- **@retry装饰器**：为函数添加重试功能的主要装饰器
- **停止策略(stop)**：定义何时停止重试的条件
- **等待策略(wait)**：定义重试之间的等待时间（固定/指数/随机等）
- **重试条件(retry)**：定义在哪些异常或结果下执行重试
- **回调函数**：如before_sleep，在重试过程中执行附加操作（记录日志、清理资源）

### 基本用法

下面是一个简单的示例（来自原始文档）：

```python
from tenacity import retry, stop_after_attempt

@retry(stop=stop_after_attempt(3))
def do_something():
    print("Doing something...")
    raise Exception("Something went wrong!")

try:
    do_something()
except Exception as e:
    print(f"Exception: {e}")
```

在上面的示例中，使用`@retry`装饰器来修饰`do_something`函数。配置了重试策略，即在前三次尝试后停止重试（`stop_after_attempt(3)`）。在`do_something`函数中，模拟了一个失败的操作，触发了异常。由于配置了重试，Tenacity将在异常发生时自动重试该函数，最多重试3次。

### 配置选项（来自原始文档）

Tenacity提供了许多配置选项，可以满足不同场景的需求。以下是一些常用的配置选项：

- `wait`：定义重试之间的等待时间，可以是固定的时间间隔或根据指数递增的时间间隔。
- `stop`：定义何时停止重试，可以根据尝试次数、总时间或其他条件停止。
- `retry`：定义在哪些异常情况下执行重试，可以根据异常类型、自定义条件或自定义回调函数执行。
- `before_sleep`：在每次重试之前执行的操作，可以用于执行清理或日志记录等任务。
- `reraise`：是否重新引发异常，如果设置为`True`，则在达到最大重试次数后会引发原始异常。

为便于查阅，补充一个简表：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| wait | wait对象 | 固定/指数/随机等等待策略 |
| stop | stop对象 | 重试停止条件（次数/时间/复合条件） |
| retry | retry对象 | 异常/结果驱动的重试条件 |
| before_sleep | 函数 | 重试前的回调（常用于日志记录） |
| reraise | bool | 达到上限后是否抛出原异常 |

### 自定义重试条件（来自原始文档）

```python
from tenacity import retry, stop_after_attempt, retry_if_exception_type

@retry(
    stop=stop_after_attempt(5),
    retry=retry_if_exception_type(IOError)
)
def open_file(file_path):
    print(f"Opening file: {file_path}")
    raise IOError("File not found")

try:
    open_file("example.txt")
except IOError as e:
    print(f"Exception: {e}")
```

在上面的示例中，定义了自定义的重试条件，仅当捕获到`IOError`异常时才重试，最多重试5次。

### 配置等待时间（来自原始文档）

```python
from tenacity import retry, wait_fixed

@retry(wait=wait_fixed(2))
def slow_function():
    print("Slow function running...")
    raise Exception("Something went wrong!")

try:
    slow_function()
except Exception as e:
    print(f"Exception: {e}")
```

这个示例中，配置了一个固定的等待时间为2秒，表示在每次重试之间等待2秒。

### 使用before_sleep回调（来自原始文档 + 日志增强）

```python
import logging
from tenacity import retry, wait_fixed, before_sleep_log

# 配置日志
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

@retry(wait=wait_fixed(2), before_sleep=before_sleep_log(logger, logging.INFO))
def some_operation():
    print("Doing some operation...")
    raise Exception("Failed!")

try:
    some_operation()
except Exception as e:
    print(f"Exception: {e}")
```

在这个示例中，使用了`before_sleep`回调函数，它会在每次重试之前执行，并通过日志记录等待时间。这有助于更好地理解Tenacity的工作方式。

## 💡 实际应用

### 基础用法 - 网络请求重试（补充）

```python
import requests
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=10)
)
def fetch_data(url):
    """网络请求重试示例"""
    resp = requests.get(url, timeout=5)
    resp.raise_for_status()
    return resp.json()

try:
    data = fetch_data("https://api.example.com/data")
    print("获取到数据:", data)
except Exception as e:
    print("请求失败:", e)
```

### 高级用法 - Jitter配置（来自原始文档）

```python
from tenacity import retry, wait_random

@retry(wait=wait_random(min=1, max=5))
def operation_with_jitter():
    print("Operation with Jitter...")
    raise Exception("Failed!")

try:
    operation_with_jitter()
except Exception as e:
    print(f"Exception: {e}")
```

### 等待可重试条件（来自原始文档）

```python
from tenacity import retry, retry_if_result, stop_after_attempt

def should_retry(result):
    return result is not None

@retry(retry=retry_if_result(should_retry), stop=stop_after_attempt(3))
def operation_with_custom_retry_condition():
    result = do_operation()
    return result

def do_operation():
    print("Doing operation...")
    return None

try:
    operation_with_custom_retry_condition()
except Exception as e:
    print(f"Exception: {e}")
```

### 自定义停止策略（来自原始文档）

```python
from tenacity import retry, stop_after_delay, retry_if_exception, stop_after_attempt

@retry(stop=stop_after_delay(10) | stop_after_attempt(5), retry=retry_if_exception())
def operation_with_custom_stop():
    print("Operation with Custom Stop...")
    raise Exception("Failed!")

try:
    operation_with_custom_stop()
except Exception as e:
    print(f"Exception: {e}")
```

## ⚠️ 注意事项

- **合理设置重试次数**：避免无限重试导致资源浪费
- **选择合适的等待策略**：固定等待、指数退避或随机等待
- **异常类型筛选**：只对可恢复的异常进行重试
- **监控和日志**：使用before_sleep回调记录重试状态
- **超时设置**：结合总时间限制避免长时间阻塞
- **资源清理**：在重试前确保清理之前的资源
- **幂等性**：确保重试的操作是幂等的，多次执行结果一致

## 🔗 相关内容

- [Python异常处理](../../basics/raise-assert/)
- [装饰器使用](../../basics/decorators/)
- [标准库 - time模块](../../stdlib/time/)
- [标准库 - logging模块](../../stdlib/logging/)

## 📚 扩展阅读

- [Tenacity官方文档](https://tenacity.readthedocs.io/)
- [Tenacity PyPI页面](https://pypi.org/project/tenacity/)
- [Tenacity GitHub仓库](https://github.com/jd/tenacity)
- [Python装饰器最佳实践](https://realpython.com/primer-on-python-decorators/)
- [网络编程异常处理指南](https://docs.python.org/3/library/urllib.error.html)

## 🏷️ 标签

`Tenacity` `重试` `装饰器` `异常处理` `网络请求` `第三方库` `稳定性` `容错`

---

**最后更新**: 2024-01-15  
**作者**: Python技术文档工程师  
**版本**: 1.0