---
layout: doc
title: 线程池与进程池 - concurrent.futures 模块
permalink: /docs/basics/concurrent-futures/
category: basics
tags: [concurrent.futures, 线程池, 进程池, Future, Executor]
description: 统一掌握 ThreadPoolExecutor 和 ProcessPoolExecutor 的使用模式与最佳实践
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# 线程池与进程池 - concurrent.futures 模块

## 📝 概述

`concurrent.futures` 提供了统一的高层接口，用于线程池（ThreadPoolExecutor）和进程池（ProcessPoolExecutor）。你可以通过 `submit`、`map` 提交任务，通过 Future 获取结果，或使用回调与等待机制管理任务生命周期。

## 🎯 学习目标

- 熟悉 `ThreadPoolExecutor` 与 `ProcessPoolExecutor` 的参数与使用
- 掌握 `Future` 的状态控制和结果获取
- 学会 `as_completed()`、`wait()`、`add_done_callback()` 的用法
- 理解 `Executor.map()` 的行为差异

## 📋 前置知识

- Python 函数与异常处理
- threading/multiprocessing 基础

## 🔍 详细内容

### 1. 快速入门

```python
from concurrent.futures import ThreadPoolExecutor
import time

def work(x):
    time.sleep(0.5)
    return x * x

with ThreadPoolExecutor(max_workers=4) as executor:
    futures = [executor.submit(work, i) for i in range(8)]
    results = [f.result() for f in futures]
print(results)
```

### 2. 关键 API

#### Executor.submit()

- 提交单个任务，返回 `Future`

```python
future = executor.submit(work, 10)
print(future.done())
print(future.result(timeout=2))
```

#### Executor.map()

- 批量任务映射，返回按输入顺序的结果迭代器
- 默认相当于 `chunksize=1`（进程池可指定切块）

```python
from concurrent.futures import ProcessPoolExecutor

with ProcessPoolExecutor() as executor:
    for result in executor.map(work, range(10)):
        print(result)
```

#### as_completed()

- 按任务完成顺序产出 `Future`

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import random, time


def io_task(i):
    t = random.uniform(0.1, 1.0)
    time.sleep(t)
    return i, t

with ThreadPoolExecutor(max_workers=4) as executor:
    futures = [executor.submit(io_task, i) for i in range(10)]
    for future in as_completed(futures):
        print("完成:", future.result())
```

#### wait()

- 等待一组 Future 的状态转变

```python
from concurrent.futures import ThreadPoolExecutor, wait, FIRST_COMPLETED

with ThreadPoolExecutor(max_workers=3) as executor:
    futures = [executor.submit(work, i) for i in range(6)]
    done, not_done = wait(futures, return_when=FIRST_COMPLETED)
    print("最先完成:", [f.result() for f in done])
```

#### add_done_callback()

- 在 `Future` 完成时触发回调（成功或失败均会触发）

```python
from concurrent.futures import ThreadPoolExecutor

def on_done(future):
    try:
        print("回调获取结果:", future.result())
    except Exception as e:
        print("任务异常:", e)

with ThreadPoolExecutor(max_workers=2) as executor:
    f = executor.submit(work, 5)
    f.add_done_callback(on_done)
```

### 3. 重要参数与行为

- `max_workers`：最大并发工作者数量
- 线程池：适用于 I/O 密集型；进程池：适用于 CPU 密集型
- 进程池函数参数与返回必须可序列化（pickle）
- 进程池在 Windows 上必须在 `__main__` 保护下创建

### 4. 进阶：异常与取消

```python
from concurrent.futures import ThreadPoolExecutor


def may_fail(x):
    if x % 3 == 0:
        raise ValueError(f"bad {x}")
    return x

with ThreadPoolExecutor(max_workers=3) as executor:
    futures = [executor.submit(may_fail, i) for i in range(6)]
    for f in futures:
        try:
            print(f.result())
        except Exception as e:
            print("捕获异常:", e)
```

```python
# 取消任务
f = executor.submit(work, 100)
f.cancel()           # 尝试取消（尚未开始时成功）
print(f.cancelled())
```

### 5. 源码一瞥（ThreadPoolExecutor）

- 任务通过内部队列排队，工作线程从队列中取出任务执行
- `Future` 封装任务状态、回调与结果/异常
- `shutdown(wait=True)` 等待任务完成并回收资源

## 💡 实际应用

### 并发网络请求

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests

urls = [
    'https://httpbin.org/delay/1',
    'https://httpbin.org/delay/2',
    'https://httpbin.org/get',
]

def fetch(url):
    resp = requests.get(url, timeout=5)
    return url, resp.status_code

with ThreadPoolExecutor(max_workers=5) as executor:
    futures = [executor.submit(fetch, url) for url in urls]
    for f in as_completed(futures):
        print(f.result())
```

### CPU 密集任务并行

```python
from concurrent.futures import ProcessPoolExecutor

def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)

with ProcessPoolExecutor() as executor:
    results = list(executor.map(fib, [20, 21, 22, 23]))
print(results)
```

## ⚠️ 注意事项

- 防止过度线程化/进程化：合理设置 `max_workers`
- 对共享资源加锁，避免竞态条件
- 正确释放资源：`with` 上下文或 `shutdown()`

## 🔗 相关内容

- [多线程编程](../multithreading/)
- [多进程与进程池](../multiprocessing/)
- [进程间通信（IPC）](../ipc/)

## 📚 扩展阅读

- [Python 官方文档 - concurrent.futures](https://docs.python.org/3/library/concurrent.futures.html)

## 🏷️ 标签

`线程池` `进程池` `Future` `Executor` `并发`

---

**最后更新**: 2024-01-15  
**作者**: Python 编程指南  
**版本**: 1.0