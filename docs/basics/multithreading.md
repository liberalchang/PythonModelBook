---
layout: doc
title: Python 多线程编程
permalink: /docs/basics/multithreading/
category: basics
tags: [多线程, threading, Thread, 线程池, ThreadPoolExecutor, 线程锁]
description: 深入学习 Python threading 模块，掌握多线程编程的核心技术和最佳实践
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# Python 多线程编程

## 📝 概述

Python 的 `threading` 模块提供了强大的多线程编程支持，允许程序同时执行多个任务。多线程特别适用于 I/O 密集型任务，如文件读写、网络请求等。本文档详细介绍了 `threading` 模块的核心功能，包括线程创建、线程池、线程同步和锁机制等。

## 🎯 学习目标

- 掌握 Python `threading` 模块的基本使用
- 理解线程的创建方式和生命周期管理
- 学会使用线程池 `ThreadPoolExecutor` 进行批量任务处理
- 掌握各种线程锁机制确保线程安全
- 理解脏数据产生的原因和解决方案

## 📋 前置知识

- Python 基础语法和面向对象编程
- 函数定义和调用
- 并发编程基本概念
- 异常处理机制

## 🔍 详细内容

### Thread 对象

#### 线程的创建方式

**方式1：继承 Thread 类**

```python
import threading
import time

class MyThread(threading.Thread):
    def __init__(self, name):
        super().__init__()
        self.name = name
    
    def run(self):
        """线程执行的主要逻辑"""
        for i in range(5):
            print(f"线程 {self.name} 正在执行第 {i+1} 次")
            time.sleep(1)

# 创建并启动线程
thread1 = MyThread("线程1")
thread2 = MyThread("线程2")

thread1.start()
thread2.start()

# 等待线程完成
thread1.join()
thread2.join()

print("所有线程执行完成")
```

**方式2：直接注入任务函数**

```python
import threading
import time

def worker_task(name, count):
    """工作任务函数"""
    for i in range(count):
        print(f"工作线程 {name} 执行第 {i+1} 次任务")
        time.sleep(0.5)

# 创建线程对象
thread1 = threading.Thread(target=worker_task, args=("A", 3))
thread2 = threading.Thread(target=worker_task, args=("B", 3))

# 启动线程
thread1.start()
thread2.start()

# 等待线程完成
thread1.join()
thread2.join()

print("任务完成")
```

#### Thread 对象参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| `target` | callable | 线程要执行的目标函数 |
| `args` | tuple | 传递给目标函数的位置参数 |
| `kwargs` | dict | 传递给目标函数的关键字参数 |
| `name` | str | 线程名称，用于标识 |
| `daemon` | bool | 是否为守护线程 |

#### Thread 对象方法

```python
import threading
import time

def sample_task():
    for i in range(3):
        print(f"执行任务 {i+1}")
        time.sleep(1)

# 创建线程
thread = threading.Thread(target=sample_task, name="示例线程")

print(f"线程名称: {thread.name}")
print(f"线程ID: {thread.ident}")
print(f"是否存活: {thread.is_alive()}")

# 启动线程
thread.start()

# 检查线程状态
print(f"启动后是否存活: {thread.is_alive()}")

# 等待线程完成
thread.join()

print(f"完成后是否存活: {thread.is_alive()}")
```

#### join() 方法详解

```python
import threading
import time

def long_task(task_name, duration):
    print(f"{task_name} 开始执行")
    time.sleep(duration)
    print(f"{task_name} 执行完成")

# 创建多个线程
threads = []
for i in range(3):
    thread = threading.Thread(
        target=long_task, 
        args=(f"任务{i+1}", 2)
    )
    threads.append(thread)
    thread.start()

print("所有线程已启动")

# 等待所有线程完成
for thread in threads:
    thread.join()

print("所有任务执行完成")
```

#### setDaemon() 守护线程

```python
import threading
import time

def daemon_task():
    """守护线程任务"""
    count = 0
    while True:
        count += 1
        print(f"守护线程运行中... {count}")
        time.sleep(1)

def main_task():
    """主任务"""
    for i in range(5):
        print(f"主任务执行 {i+1}")
        time.sleep(0.5)

# 创建守护线程
daemon_thread = threading.Thread(target=daemon_task)
daemon_thread.daemon = True  # 设置为守护线程
daemon_thread.start()

# 创建主任务线程
main_thread = threading.Thread(target=main_task)
main_thread.start()
main_thread.join()

print("主程序结束，守护线程也会自动结束")
```

### 线程池 ThreadPoolExecutor

#### 基本使用

```python
from concurrent.futures import ThreadPoolExecutor
import time

def process_item(item):
    """处理单个项目"""
    print(f"开始处理项目: {item}")
    time.sleep(1)  # 模拟处理时间
    result = f"项目{item}处理完成"
    print(result)
    return result

# 使用线程池
with ThreadPoolExecutor(max_workers=3) as executor:
    items = ['A', 'B', 'C', 'D', 'E']
    
    # 提交任务
    futures = [executor.submit(process_item, item) for item in items]
    
    # 获取结果
    for future in futures:
        result = future.result()
        print(f"获取结果: {result}")
```

#### as_completed() 方法

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import random

def download_file(filename):
    """模拟文件下载"""
    download_time = random.uniform(1, 3)
    time.sleep(download_time)
    return f"{filename} 下载完成，耗时 {download_time:.2f}s"

files = ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt']

with ThreadPoolExecutor(max_workers=2) as executor:
    # 提交所有任务
    future_to_file = {
        executor.submit(download_file, file): file 
        for file in files
    }
    
    # 按完成顺序处理结果
    for future in as_completed(future_to_file):
        filename = future_to_file[future]
        try:
            result = future.result()
            print(f"[完成] {result}")
        except Exception as exc:
            print(f"[错误] {filename} 下载失败: {exc}")
```

#### Executor.map() 方法

```python
from concurrent.futures import ThreadPoolExecutor
import time

def calculate_square(number):
    """计算平方"""
    time.sleep(0.1)  # 模拟计算时间
    result = number ** 2
    print(f"{number}^2 = {result}")
    return result

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

print("使用 map() 方法批量处理:")
with ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(calculate_square, numbers))

print(f"所有结果: {results}")
```

#### wait() 方法

```python
from concurrent.futures import ThreadPoolExecutor, wait, FIRST_COMPLETED, ALL_COMPLETED
import time
import random

def task_with_random_time(task_id):
    """随机执行时间的任务"""
    execution_time = random.uniform(1, 4)
    time.sleep(execution_time)
    return f"任务{task_id}完成，耗时{execution_time:.2f}s"

with ThreadPoolExecutor(max_workers=3) as executor:
    # 提交任务
    futures = [
        executor.submit(task_with_random_time, i) 
        for i in range(5)
    ]
    
    print("等待第一个任务完成...")
    done, not_done = wait(futures, return_when=FIRST_COMPLETED)
    
    for future in done:
        print(f"[最先完成] {future.result()}")
    
    print(f"剩余 {len(not_done)} 个任务继续执行...")
    
    # 等待所有任务完成
    done, not_done = wait(not_done, return_when=ALL_COMPLETED)
    
    for future in done:
        print(f"[后续完成] {future.result()}")
```

### 线程锁机制

#### 脏数据问题演示

```python
import threading
import time

# 共享资源
counter = 0

def increment_counter():
    """不安全的计数器增加"""
    global counter
    for _ in range(100000):
        # 这里存在竞态条件
        temp = counter
        temp += 1
        counter = temp

# 创建多个线程同时修改计数器
threads = []
for i in range(5):
    thread = threading.Thread(target=increment_counter)
    threads.append(thread)
    thread.start()

# 等待所有线程完成
for thread in threads:
    thread.join()

print(f"最终计数器值: {counter}")
print(f"期望值: {5 * 100000}")
print(f"数据丢失: {5 * 100000 - counter}")
```

#### Lock 互斥锁

```python
import threading
import time

# 共享资源和锁
counter = 0
lock = threading.Lock()

def safe_increment_counter():
    """使用锁保护的计数器增加"""
    global counter
    for _ in range(100000):
        with lock:  # 使用 with 语句自动管理锁
            counter += 1

# 或者手动管理锁
def manual_lock_increment():
    """手动管理锁的示例"""
    global counter
    for _ in range(100000):
        lock.acquire()
        try:
            counter += 1
        finally:
            lock.release()

# 测试线程安全的版本
counter = 0
threads = []

for i in range(5):
    thread = threading.Thread(target=safe_increment_counter)
    threads.append(thread)
    thread.start()

for thread in threads:
    thread.join()

print(f"使用锁后的计数器值: {counter}")
print(f"期望值: {5 * 100000}")
```

#### RLock 可重入锁

```python
import threading
import time

class Counter:
    def __init__(self):
        self._value = 0
        self._lock = threading.RLock()  # 可重入锁
    
    def increment(self):
        """增加计数"""
        with self._lock:
            self._value += 1
    
    def decrement(self):
        """减少计数"""
        with self._lock:
            self._value -= 1
    
    def increment_twice(self):
        """增加两次 - 演示重入特性"""
        with self._lock:
            self.increment()  # 再次获取同一个锁
            self.increment()
    
    def get_value(self):
        """获取当前值"""
        with self._lock:
            return self._value

# 测试可重入锁
counter = Counter()

def worker():
    for _ in range(1000):
        counter.increment_twice()

threads = []
for i in range(5):
    thread = threading.Thread(target=worker)
    threads.append(thread)
    thread.start()

for thread in threads:
    thread.join()

print(f"最终计数值: {counter.get_value()}")
print(f"期望值: {5 * 1000 * 2}")
```

#### Semaphore 信号量

```python
import threading
import time
import random

# 创建信号量，限制同时访问资源的线程数
semaphore = threading.Semaphore(3)  # 最多3个线程同时访问

def access_resource(thread_id):
    """访问有限资源"""
    print(f"线程 {thread_id} 等待访问资源...")
    
    with semaphore:
        print(f"线程 {thread_id} 获得资源访问权")
        # 模拟使用资源
        time.sleep(random.uniform(1, 3))
        print(f"线程 {thread_id} 释放资源")

# 创建多个线程尝试访问资源
threads = []
for i in range(8):
    thread = threading.Thread(target=access_resource, args=(i,))
    threads.append(thread)
    thread.start()

for thread in threads:
    thread.join()

print("所有线程完成")
```

#### Event 事件对象

```python
import threading
import time

# 创建事件对象
event = threading.Event()

def waiter(name):
    """等待事件的线程"""
    print(f"{name} 等待事件...")
    event.wait()  # 阻塞直到事件被设置
    print(f"{name} 收到事件，开始工作")

def setter():
    """设置事件的线程"""
    time.sleep(3)
    print("设置事件...")
    event.set()  # 设置事件，唤醒所有等待的线程

# 创建等待线程
for i in range(3):
    thread = threading.Thread(target=waiter, args=(f"等待者{i+1}",))
    thread.start()

# 创建设置事件的线程
setter_thread = threading.Thread(target=setter)
setter_thread.start()

setter_thread.join()
time.sleep(1)  # 等待所有线程完成
```

#### Condition 条件变量

```python
import threading
import time
import random

# 创建条件变量
condition = threading.Condition()
items = []
MAX_ITEMS = 10

def consumer(name):
    """消费者"""
    with condition:
        while True:
            # 等待有商品可消费
            while len(items) == 0:
                print(f"消费者 {name} 等待商品...")
                condition.wait()
            
            # 消费商品
            item = items.pop(0)
            print(f"消费者 {name} 消费了商品 {item}")
            
            # 通知生产者可以继续生产
            condition.notify_all()
            
            time.sleep(random.uniform(0.5, 1.5))

def producer(name):
    """生产者"""
    for i in range(5):
        with condition:
            # 等待有空间生产
            while len(items) >= MAX_ITEMS:
                print(f"生产者 {name} 等待空间...")
                condition.wait()
            
            # 生产商品
            item = f"{name}-商品{i+1}"
            items.append(item)
            print(f"生产者 {name} 生产了 {item}")
            
            # 通知消费者有新商品
            condition.notify_all()
        
        time.sleep(random.uniform(0.5, 1))

# 创建生产者和消费者线程
producer_thread = threading.Thread(target=producer, args=("生产者A",))
consumer_thread1 = threading.Thread(target=consumer, args=("消费者1",))
consumer_thread2 = threading.Thread(target=consumer, args=("消费者2",))

# 设置消费者为守护线程
consumer_thread1.daemon = True
consumer_thread2.daemon = True

# 启动线程
producer_thread.start()
consumer_thread1.start()
consumer_thread2.start()

# 等待生产者完成
producer_thread.join()
print("生产者完成，程序结束")
```

## 💡 实际应用

### 网络请求并发处理

```python
import threading
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

def fetch_url(url):
    """获取URL内容"""
    try:
        start_time = time.time()
        response = requests.get(url, timeout=5)
        end_time = time.time()
        
        return {
            'url': url,
            'status_code': response.status_code,
            'response_time': end_time - start_time,
            'content_length': len(response.content)
        }
    except Exception as e:
        return {
            'url': url,
            'error': str(e)
        }

# 要请求的URL列表
urls = [
    'https://httpbin.org/delay/1',
    'https://httpbin.org/delay/2',
    'https://httpbin.org/delay/1',
    'https://httpbin.org/delay/3',
]

print("开始并发请求...")
start_time = time.time()

with ThreadPoolExecutor(max_workers=4) as executor:
    future_to_url = {executor.submit(fetch_url, url): url for url in urls}
    
    for future in as_completed(future_to_url):
        result = future.result()
        if 'error' in result:
            print(f"请求失败: {result['url']} - {result['error']}")
        else:
            print(f"请求成功: {result['url']} - "
                  f"状态码: {result['status_code']}, "
                  f"响应时间: {result['response_time']:.2f}s")

total_time = time.time() - start_time
print(f"总耗时: {total_time:.2f}s")
```

### 文件处理并发

```python
import threading
import os
import time
from pathlib import Path

class FileProcessor:
    def __init__(self, max_workers=4):
        self.lock = threading.Lock()
        self.processed_count = 0
        self.max_workers = max_workers
    
    def process_file(self, filepath):
        """处理单个文件"""
        try:
            # 模拟文件处理
            file_size = os.path.getsize(filepath)
            time.sleep(0.1)  # 模拟处理时间
            
            with self.lock:
                self.processed_count += 1
                print(f"已处理: {filepath.name} ({file_size} bytes) - "
                      f"进度: {self.processed_count}")
            
            return {'filepath': filepath, 'size': file_size, 'status': 'success'}
            
        except Exception as e:
            return {'filepath': filepath, 'error': str(e), 'status': 'error'}
    
    def process_directory(self, directory_path):
        """并发处理目录中的所有文件"""
        directory = Path(directory_path)
        files = [f for f in directory.rglob('*') if f.is_file()]
        
        print(f"找到 {len(files)} 个文件待处理")
        
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = [executor.submit(self.process_file, file) for file in files]
            
            results = []
            for future in as_completed(futures):
                result = future.result()
                results.append(result)
        
        return results

# 使用示例
# processor = FileProcessor(max_workers=4)
# results = processor.process_directory('/path/to/directory')
# print(f"处理完成，共处理 {len(results)} 个文件")
```

## ⚠️ 注意事项

1. **GIL 限制**：
   - Python 的全局解释器锁（GIL）限制了真正的并行执行
   - 多线程主要适用于 I/O 密集型任务
   - CPU 密集型任务建议使用多进程

2. **线程安全**：
   - 共享数据必须使用适当的锁机制保护
   - 避免竞态条件和数据竞争
   - 注意死锁的预防

3. **资源管理**：
   - 及时关闭线程池和释放资源
   - 使用 `with` 语句管理资源生命周期
   - 避免创建过多线程导致系统资源耗尽

4. **异常处理**：
   - 线程中的异常不会传播到主线程
   - 使用 `future.result()` 获取异常信息
   - 在线程函数中妥善处理异常

## 🔗 相关内容

- [进程和进程池](../multiprocessing/)
- [进程间通信](../ipc/)
- [子进程与并行](../subprocess/)
- [并行编程概念基础](../concurrency-concepts/)
- [concurrent.futures 模块](../concurrent-futures/)

## 📚 扩展阅读

- [Python 官方文档 - threading](https://docs.python.org/3/library/threading.html)
- [Python 官方文档 - concurrent.futures](https://docs.python.org/3/library/concurrent.futures.html)
- [Real Python - Python Threading](https://realpython.com/intro-to-python-threading/)
- [Python GIL 详解](https://realpython.com/python-gil/)

## 🏷️ 标签

`多线程` `threading` `Thread` `线程池` `ThreadPoolExecutor` `线程锁`

---

**最后更新**: 2024-01-15  
**作者**: Python 编程指南  
**版本**: 1.0