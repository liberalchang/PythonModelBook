---
layout: doc
title: 进程池 Pool 深入指南
permalink: /docs/basics/pool/
category: basics
tags: [multiprocessing, Pool, 进程池, 并行, AsyncResult]
description: 全面介绍 multiprocessing.Pool 的核心方法、参数、最佳实践与性能优化
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# 进程池 Pool 深入指南

## 📝 概述

`multiprocessing.Pool` 通过维护一组工作进程来并行执行任务，提供了同步与异步两类接口（apply/map 系列）。本指南系统讲解 Pool 的方法、参数、注意事项与性能优化策略。

## 🎯 学习目标

- 理解 Pool 的工作原理与常用方法
- 熟练掌握同步/异步任务提交与结果收集
- 掌握 `AsyncResult` 的使用
- 学会在实际项目中优化 Pool 的性能

## 📋 前置知识

- Python 函数与异常处理
- multiprocessing 基础

## 🔍 详细内容

### 1. 核心方法总览

- `apply(func, args, kwds)`：同步调用
- `apply_async(func, args, kwds, callback, error_callback)`：异步调用
- `map(func, iterable, chunksize)`：同步批量映射
- `map_async(func, iterable, chunksize, callback, error_callback)`：异步批量映射
- `imap(func, iterable, chunksize)`：惰性有序迭代
- `imap_unordered(func, iterable, chunksize)`：惰性无序迭代
- `close()`：关闭池，不再接收新任务
- `terminate()`：立即终止工作进程
- `join()`：等待子进程退出（需 close/terminate 后）

### 2. 基本使用

```python
from multiprocessing import Pool

def square(x):
    return x * x

if __name__ == '__main__':
    with Pool(processes=4) as pool:
        results = pool.map(square, range(10))
    print(results)
```

### 3. 异步提交与回调

```python
from multiprocessing import Pool

def work(x):
    return x + 100

def on_ok(result):
    print("回调成功:", result)


def on_err(e):
    print("回调异常:", e)

if __name__ == '__main__':
    with Pool(4) as pool:
        async_res = pool.apply_async(work, (1,), callback=on_ok, error_callback=on_err)
        print("ready?", async_res.ready())
        print("result:", async_res.get(timeout=3))
```

### 4. AsyncResult 对象

```python
res = pool.apply_async(work, (5,))
print(res.ready())
print(res.successful())
print(res.get(timeout=2))
```

### 5. 关键参数

- `processes`：工作进程数量，默认 `os.cpu_count()`
- `maxtasksperchild`：每个进程在处理一定数量任务后重启（缓解内存泄漏）
- `initializer/initargs`：子进程启动时执行的初始化函数及其参数
- `chunksize`：批处理切块大小

```python
from multiprocessing import Pool

def init_worker():
    print("初始化子进程")

if __name__ == '__main__':
    with Pool(processes=4, maxtasksperchild=200, initializer=init_worker) as pool:
        for r in pool.imap_unordered(square, range(100), chunksize=5):
            print(r)
```

### 6. 注意事项与陷阱

- 避免共享可变全局状态，使用参数传递或 `Manager`
- 传参与返回值必须可被 `pickle` 序列化
- Windows 平台必须使用 `if __name__ == '__main__':` 保护
- 及时释放资源：`with` 或 `close()/join()`

### 7. 性能优化建议

- 合理设置 `processes`（一般与 CPU 核心数相当）
- 对大量小任务使用合适的 `chunksize`
- 使用 `maxtasksperchild` 限制长期运行造成的内存膨胀
- 避免在回调里执行耗时操作

## 💡 实际应用

### 大文件并行处理

```python
from multiprocessing import Pool
from pathlib import Path


def line_count(path: Path) -> int:
    return sum(1 for _ in path.open('r', encoding='utf-8', errors='ignore'))

if __name__ == '__main__':
    files = list(Path('.').rglob('*.log'))
    with Pool() as pool:
        counts = pool.map(line_count, files, chunksize=10)
    print('总行数:', sum(counts))
```

## ⚠️ 注意事项

- 进程池任务异常会在 `get()` 时重新抛出
- 回调函数在主进程中执行，注意线程安全
- 关闭顺序：先 `close()` 再 `join()`

## 🔗 相关内容

- [多进程与进程池](../multiprocessing/)
- [进程间通信（IPC）](../ipc/)
- [concurrent.futures](../concurrent-futures/)

## 📚 扩展阅读

- [multiprocessing.Pool 官方文档](https://docs.python.org/3/library/multiprocessing.html#module-multiprocessing.pool)

## 🏷️ 标签

`Pool` `进程池` `multiprocessing` `AsyncResult`

---

**最后更新**: 2024-01-15  
**作者**: Python 编程指南  
**版本**: 1.0