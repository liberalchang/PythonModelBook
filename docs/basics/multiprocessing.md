---
layout: doc
title: Python 多进程与进程池
permalink: /docs/basics/multiprocessing/
category: basics
tags: [多进程, multiprocessing, Process, 进程池, Pool]
description: 全面掌握 Python multiprocessing 模块，学会使用进程、进程池与任务提交 API 进行并行处理
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# Python 多进程与进程池

## 📝 概述

`multiprocessing` 模块提供了与 `threading` 类似的 API，但每个子进程拥有独立的内存空间，适用于 CPU 密集型任务。本文介绍 `Process` 的创建方式、属性方法，以及进程池 `Pool` 的核心能力和使用方式。

## 🎯 学习目标

- 掌握 `multiprocessing.Process` 的使用方式
- 学会使用 `Pool` 进程池进行任务并行
- 理解同步与异步任务提交（apply/apply_async/map/map_async/imap）
- 熟悉 `AsyncResult` 的使用
- 掌握资源回收与优雅关闭

## 📋 前置知识

- 并发与并行的基本概念
- Python 函数、模块与异常处理
- 线程与进程差异

## 🔍 详细内容

### 1. 创建子进程

#### 方式一：直接实例化 Process

```python
from multiprocessing import Process
import os, time

# 子进程执行的任务函数
def worker(name, duration=1):
    """工作进程任务"""
    print(f"子进程 {name} 启动，PID={os.getpid()}")
    time.sleep(duration)
    print(f"子进程 {name} 结束")

if __name__ == "__main__":
    p = Process(target=worker, args=("A", 2), kwargs={"duration": 1})
    p.start()
    p.join()  # 等待子进程结束
    print("主进程结束")
```

常用参数与属性：

- `target`：目标函数
- `args/kwargs`：传参
- `name`：进程名称
- `pid`：进程 PID
- `daemon`：守护进程标志
- `is_alive()`：是否存活
- `join()/terminate()`：等待/终止

#### 方式二：继承 Process 子类

```python
from multiprocessing import Process
import os, time

class MyProcess(Process):
    def __init__(self, name):
        super().__init__()
        self.name = name
    
    def run(self):
        print(f"[{self.name}] 运行在 PID {os.getpid()}")
        time.sleep(1)
        print(f"[{self.name}] 结束")

if __name__ == "__main__":
    p1 = MyProcess("P1")
    p2 = MyProcess("P2")
    
    p1.start()
    p2.start()
    
    p1.join(); p2.join()
    print("所有子进程结束")
```

### 2. 进程池 Pool

#### 初始化与基本用法

```python
from multiprocessing import Pool
import time

def square(x):
    time.sleep(0.2)
    return x * x

if __name__ == "__main__":
    with Pool(processes=4) as pool:  # 默认 os.cpu_count()
        results = pool.map(square, range(10))
    print(results)
```

#### 同步与异步提交

- `apply(func, args)`: 同步调用，阻塞直到返回
- `apply_async(func, args)`: 异步调用，返回 `AsyncResult`
- `map(func, iterable)`: 同步批处理
- `map_async(func, iterable)`: 异步批处理，返回 `AsyncResult`
- `imap(func, iterable)`: 惰性迭代返回结果（有序）
- `imap_unordered(func, iterable)`: 惰性迭代返回结果（无序）

```python
from multiprocessing import Pool
import time

def cube(x):
    time.sleep(0.5)
    return x ** 3

if __name__ == "__main__":
    with Pool(4) as pool:
        # 异步提交
        async_results = [pool.apply_async(cube, (i,)) for i in range(6)]
        
        # 获取结果（同时捕获异常）
        results = []
        for r in async_results:
            try:
                results.append(r.get(timeout=3))
            except Exception as e:
                results.append(f"任务失败: {e}")
        print(results)
```

#### AsyncResult 对象

```python
res = pool.apply_async(cube, (5,))
print(res.ready())   # 是否完成
print(res.successful())  # 是否成功
print(res.get(timeout=2))  # 获取结果/抛出异常
```

#### 资源释放与关闭

```python
with Pool(4) as pool:
    pool.map(cube, range(10))
# 上下文退出会自动调用 close/join

# 手动方式：
pool = Pool(4)
try:
    pool.map(cube, range(10))
finally:
    pool.close()  # 不再接收新任务
    pool.join()   # 等待任务完成
    # pool.terminate() 可强制终止
```

### 3. Pool 进阶参数

- `maxtasksperchild`: 每个进程处理的最大任务数，超限自动重启（防内存泄漏）
- `initializer/initargs`: 子进程启动时执行的初始化函数
- `chunksize`: 批处理时的任务切块大小（对大量小任务有效）

```python
from multiprocessing import Pool

def init_worker():
    print("子进程初始化")

if __name__ == "__main__":
    with Pool(processes=4, maxtasksperchild=100, initializer=init_worker) as pool:
        pool.map(square, range(1000), chunksize=10)
```

## 💡 实际应用

### 图片处理（CPU 密集型）

```python
from multiprocessing import Pool, cpu_count
from PIL import Image, ImageFilter
from pathlib import Path

# 注意：Pillow 需要安装依赖
# pip install pillow

def blur_image(path: Path):
    # 打开图片并进行高斯模糊
    img = Image.open(path)
    blurred = img.filter(ImageFilter.GaussianBlur(radius=2))
    save_path = path.parent / f"blurred_{path.name}"
    blurred.save(save_path)
    return str(save_path)

if __name__ == "__main__":
    image_dir = Path("./images")
    images = list(image_dir.glob("*.jpg"))
    
    with Pool(cpu_count()) as pool:
        for out in pool.imap_unordered(blur_image, images):
            print("保存:", out)
```

### 文本搜索（多文件批处理）

```python
from multiprocessing import Pool
from pathlib import Path

# 在大量文件中搜索关键字

def search_in_file(args):
    path, keyword = args
    try:
        content = Path(path).read_text(encoding='utf-8', errors='ignore')
        return path if keyword in content else None
    except Exception:
        return None

if __name__ == "__main__":
    files = list(Path('.').rglob('*.md'))
    keyword = 'multiprocessing'
    
    with Pool(4) as pool:
        results = list(filter(None, pool.map(search_in_file, [(f, keyword) for f in files])))
    print("命中文件数量:", len(results))
```

## ⚠️ 注意事项

- Windows 平台需使用 `if __name__ == "__main__":` 保护主入口
- 子进程之间不共享内存，使用 `Queue`、`Pipe` 或 `Manager` 进行通信
- 进程创建和切换的开销较大，适用于 CPU 密集型任务
- 配置 `maxtasksperchild` 可缓解内存泄漏

## 🔗 相关内容

- [进程间通信（IPC）](../ipc/)
- [线程池与进程池 concurrent.futures](../concurrent-futures/)
- [多线程编程](../multithreading/)
- [子进程与并行](../subprocess/)

## 📚 扩展阅读

- [Python 官方文档 - multiprocessing](https://docs.python.org/3/library/multiprocessing.html)
- [Python 官方文档 - multiprocessing.Pool](https://docs.python.org/3/library/multiprocessing.html#module-multiprocessing.pool)

## 🏷️ 标签

`多进程` `multiprocessing` `Process` `Pool` `进程池`

---

**最后更新**: 2024-01-15  
**作者**: Python 编程指南  
**版本**: 1.0