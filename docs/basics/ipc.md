---
layout: doc
title: Python 进程间通信（IPC）
permalink: /docs/basics/ipc/
category: basics
tags: [进程间通信, IPC, Pipe, Queue, multiprocessing]
description: 掌握 Python 中进程间通信的各种机制，包括管道、队列和同步原语
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# Python 进程间通信（IPC）

## 📝 概述

由于进程间不共享内存空间，需要特殊的通信机制进行数据交换。Python `multiprocessing` 模块提供了多种进程间通信（IPC）方式，包括管道（Pipe）、队列（Queue）和同步原语（Lock、RLock）等。

## 🎯 学习目标

- 掌握管道（Pipe）的使用和注意事项
- 理解各种队列（Queue、SimpleQueue、JoinableQueue）的特点
- 学会使用多进程同步原语
- 了解并发处理中的安全问题和解决方案
- 掌握进程间数据传递的最佳实践

## 📋 前置知识

- 多进程编程基础
- Python 异常处理
- 并发编程概念
- 序列化与反序列化（pickle）

## 🔍 详细内容

### 1. 管道（Pipe）

管道提供了两个进程间的双向通信通道。

#### 基本使用

```python
from multiprocessing import Process, Pipe

def sender(conn):
    """发送数据的进程"""
    conn.send(['数据', 42, None])
    conn.send('你好，进程通信！')
    conn.close()

def receiver(conn):
    """接收数据的进程"""
    print("接收到:", conn.recv())  # ['数据', 42, None]
    print("接收到:", conn.recv())  # '你好，进程通信！'
    conn.close()

if __name__ == '__main__':
    # 创建管道
    parent_conn, child_conn = Pipe()
    
    # 创建进程
    p1 = Process(target=sender, args=(child_conn,))
    p2 = Process(target=receiver, args=(parent_conn,))
    
    p1.start()
    p2.start()
    
    p1.join()
    p2.join()
```

#### Connection 对象的属性和方法

```python
from multiprocessing import Pipe
import os

def explore_connection():
    """探索 Connection 对象的属性和方法"""
    parent_conn, child_conn = Pipe()
    
    print("Connection 对象属性:")
    print(f"可读: {parent_conn.readable}")
    print(f"可写: {parent_conn.writable}")
    print(f"文件描述符: {parent_conn.fileno()}")
    
    # 主要方法
    print("\nConnection 对象方法:")
    print("send(obj) - 发送对象")
    print("recv() - 接收对象")
    print("send_bytes(buffer) - 发送字节")
    print("recv_bytes() - 接收字节")
    print("poll([timeout]) - 检查是否有数据可读")
    print("close() - 关闭连接")

if __name__ == '__main__':
    explore_connection()
```

#### 管道的并发问题

```python
from multiprocessing import Process, Pipe
import time
import random

def concurrent_sender(conn, sender_id, count=5):
    """并发发送数据"""
    for i in range(count):
        message = f"发送者{sender_id}: 消息{i}"
        conn.send(message)
        print(f"[发送] {message}")
        time.sleep(random.uniform(0.1, 0.5))
    conn.close()

def concurrent_receiver(conn, total_messages):
    """并发接收数据"""
    received = 0
    while received < total_messages:
        try:
            if conn.poll(1):  # 超时1秒
                message = conn.recv()
                print(f"[接收] {message}")
                received += 1
            else:
                print("接收超时...")
                break
        except EOFError:
            print("管道已关闭")
            break
    conn.close()

if __name__ == '__main__':
    parent_conn, child_conn = Pipe()
    
    # 创建多个发送进程
    sender_count = 3
    message_per_sender = 3
    total_messages = sender_count * message_per_sender
    
    senders = []
    for i in range(sender_count):
        p = Process(target=concurrent_sender, 
                   args=(child_conn, i, message_per_sender))
        senders.append(p)
        p.start()
    
    # 创建接收进程
    receiver = Process(target=concurrent_receiver, 
                      args=(parent_conn, total_messages))
    receiver.start()
    
    # 等待所有进程完成
    for p in senders:
        p.join()
    
    receiver.join()
    print("管道通信演示完成")
```

### 2. 队列（Queue）

队列提供了更安全的多进程通信方式，内置了同步机制。

#### Queue - 标准队列

```python
from multiprocessing import Process, Queue
import time
import random

def producer(q, producer_id):
    """生产者进程"""
    for i in range(5):
        item = f"生产者{producer_id}的产品{i}"
        q.put(item)
        print(f"[生产] {item}")
        time.sleep(random.uniform(0.1, 0.3))
    
    # 发送结束信号
    q.put(None)

def consumer(q, consumer_id):
    """消费者进程"""
    while True:
        item = q.get()
        if item is None:
            # 收到结束信号，重新放回队列供其他消费者
            q.put(None)
            break
        
        print(f"[消费者{consumer_id}] 处理: {item}")
        time.sleep(random.uniform(0.2, 0.4))

if __name__ == '__main__':
    # 创建队列
    q = Queue(maxsize=10)  # 限制队列大小
    
    # 创建生产者进程
    producers = []
    for i in range(2):
        p = Process(target=producer, args=(q, i))
        producers.append(p)
        p.start()
    
    # 创建消费者进程
    consumers = []
    for i in range(3):
        p = Process(target=consumer, args=(q, i))
        consumers.append(p)
        p.start()
    
    # 等待生产者完成
    for p in producers:
        p.join()
    
    # 发送结束信号
    q.put(None)
    
    # 等待消费者完成
    for p in consumers:
        p.join()
    
    print("队列通信演示完成")
```

#### SimpleQueue - 简化队列

```python
from multiprocessing import Process, SimpleQueue
import time

def simple_producer(q):
    """简单生产者"""
    for i in range(5):
        q.put(f"简单消息{i}")
        print(f"发送: 简单消息{i}")
        time.sleep(0.5)

def simple_consumer(q):
    """简单消费者"""
    for _ in range(5):
        message = q.get()
        print(f"接收: {message}")

if __name__ == '__main__':
    # SimpleQueue 不支持 maxsize 参数
    sq = SimpleQueue()
    
    p1 = Process(target=simple_producer, args=(sq,))
    p2 = Process(target=simple_consumer, args=(sq,))
    
    p1.start()
    p2.start()
    
    p1.join()
    p2.join()
    
    print("SimpleQueue 演示完成")
```

#### JoinableQueue - 可连接队列

```python
from multiprocessing import Process, JoinableQueue
import time
import random

def task_producer(q):
    """任务生产者"""
    tasks = ['任务A', '任务B', '任务C', '任务D', '任务E']
    
    for task in tasks:
        q.put(task)
        print(f"添加任务: {task}")
        time.sleep(0.2)

def task_worker(q, worker_id):
    """任务工作者"""
    while True:
        task = q.get()
        if task is None:
            q.task_done()  # 标记 None 任务完成
            break
        
        print(f"[工作者{worker_id}] 开始处理: {task}")
        time.sleep(random.uniform(1, 2))  # 模拟任务处理时间
        print(f"[工作者{worker_id}] 完成: {task}")
        
        q.task_done()  # 标记任务完成

if __name__ == '__main__':
    jq = JoinableQueue()
    
    # 启动生产者
    producer = Process(target=task_producer, args=(jq,))
    producer.start()
    
    # 启动工作者
    workers = []
    for i in range(3):
        w = Process(target=task_worker, args=(jq, i))
        w.start()
        workers.append(w)
    
    # 等待生产者完成
    producer.join()
    
    # 等待所有任务完成
    jq.join()
    print("所有任务已完成!")
    
    # 发送停止信号给工作者
    for _ in workers:
        jq.put(None)
    
    # 等待工作者退出
    for w in workers:
        w.join()
    
    print("JoinableQueue 演示完成")
```

### 3. 多进程同步原语

#### Lock - 互斥锁

```python
from multiprocessing import Process, Lock
import time

# 共享资源（文件）
SHARED_FILE = 'shared_counter.txt'

def write_to_file(lock, process_id, count):
    """使用锁保护文件写入"""
    for i in range(count):
        with lock:  # 获取锁
            try:
                # 读取当前值
                try:
                    with open(SHARED_FILE, 'r') as f:
                        current = int(f.read().strip() or '0')
                except FileNotFoundError:
                    current = 0
                
                # 增加值
                current += 1
                
                # 写回文件
                with open(SHARED_FILE, 'w') as f:
                    f.write(str(current))
                
                print(f"进程{process_id}: 写入值 {current}")
                
            except Exception as e:
                print(f"进程{process_id} 出错: {e}")
        
        time.sleep(0.1)  # 模拟其他工作

if __name__ == '__main__':
    # 清理文件
    try:
        with open(SHARED_FILE, 'w') as f:
            f.write('0')
    except:
        pass
    
    lock = Lock()
    
    # 创建多个进程
    processes = []
    for i in range(3):
        p = Process(target=write_to_file, args=(lock, i, 5))
        processes.append(p)
        p.start()
    
    # 等待所有进程完成
    for p in processes:
        p.join()
    
    # 读取最终结果
    try:
        with open(SHARED_FILE, 'r') as f:
            final_value = f.read().strip()
        print(f"最终计数器值: {final_value}")
    except FileNotFoundError:
        print("文件未找到")
```

#### RLock - 可重入锁

```python
from multiprocessing import Process, RLock
import time

def recursive_function(rlock, process_id, depth, max_depth=3):
    """递归函数演示 RLock 的可重入性"""
    if depth > max_depth:
        return
    
    with rlock:
        print(f"进程{process_id}: 进入层级 {depth}")
        time.sleep(0.1)
        
        # 递归调用 - RLock 允许同一进程多次获取锁
        recursive_function(rlock, process_id, depth + 1, max_depth)
        
        print(f"进程{process_id}: 退出层级 {depth}")

if __name__ == '__main__':
    rlock = RLock()
    
    processes = []
    for i in range(2):
        p = Process(target=recursive_function, args=(rlock, i, 1))
        processes.append(p)
        p.start()
    
    for p in processes:
        p.join()
    
    print("RLock 演示完成")
```

## 💡 实际应用

### 多进程日志收集系统

```python
from multiprocessing import Process, Queue, current_process
import time
import random
import logging
from datetime import datetime

def log_collector(log_queue):
    """日志收集进程"""
    # 配置日志
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        filename='multiprocess.log'
    )
    
    logger = logging.getLogger('LogCollector')
    
    while True:
        try:
            # 获取日志消息（超时3秒）
            log_record = log_queue.get(timeout=3)
            
            if log_record is None:  # 结束信号
                logger.info("日志收集器正在关闭...")
                break
            
            # 写入日志
            logger.info(f"[{log_record['process']}] {log_record['message']}")
            
        except Exception as e:
            logger.error(f"日志收集出错: {e}")

def worker_process(process_id, log_queue, work_duration=10):
    """工作进程 - 产生日志"""
    start_time = time.time()
    
    while time.time() - start_time < work_duration:
        # 模拟工作并产生日志
        work_type = random.choice(['处理数据', '网络请求', '文件操作', '计算任务'])
        
        log_message = {
            'process': f'Worker-{process_id}',
            'message': f'正在执行: {work_type}',
            'timestamp': datetime.now().isoformat()
        }
        
        log_queue.put(log_message)
        
        # 随机工作时间
        time.sleep(random.uniform(0.5, 1.5))
    
    # 发送完成消息
    final_message = {
        'process': f'Worker-{process_id}',
        'message': '工作完成',
        'timestamp': datetime.now().isoformat()
    }
    log_queue.put(final_message)

if __name__ == '__main__':
    # 创建日志队列
    log_queue = Queue()
    
    # 启动日志收集进程
    log_collector_process = Process(target=log_collector, args=(log_queue,))
    log_collector_process.start()
    
    # 启动工作进程
    workers = []
    for i in range(4):
        w = Process(target=worker_process, args=(i, log_queue, 5))
        workers.append(w)
        w.start()
    
    # 等待所有工作进程完成
    for w in workers:
        w.join()
    
    # 发送结束信号给日志收集器
    log_queue.put(None)
    
    # 等待日志收集器完成
    log_collector_process.join()
    
    print("多进程日志收集演示完成")
    print("查看 multiprocess.log 文件获取详细日志")
```

## ⚠️ 注意事项

1. **管道并发问题**：
   - 多个进程同时写入一个管道可能导致数据混乱
   - 使用队列替代管道进行多对多通信

2. **队列的选择**：
   - `Queue`：功能完整，支持大小限制
   - `SimpleQueue`：轻量级，无大小限制
   - `JoinableQueue`：支持任务跟踪

3. **锁的使用**：
   - 进程锁开销比线程锁大
   - 避免死锁：统一获取锁的顺序
   - 使用 `with` 语句确保锁的释放

4. **序列化限制**：
   - 通过 IPC 传递的对象必须可 pickle 序列化
   - 某些对象（如文件句柄、锁）无法跨进程传递

## 🔗 相关内容

- [多进程与进程池](../multiprocessing/)
- [子进程与并行](../subprocess/)
- [并行编程概念基础](../concurrency-concepts/)
- [多线程编程](../multithreading/)

## 📚 扩展阅读

- [Python 官方文档 - multiprocessing](https://docs.python.org/3/library/multiprocessing.html)
- [Python 官方文档 - multiprocessing.Pipe](https://docs.python.org/3/library/multiprocessing.html#pipes-and-queues)
- [Python 官方文档 - multiprocessing.Queue](https://docs.python.org/3/library/multiprocessing.html#multiprocessing.Queue)

## 🏷️ 标签

`进程间通信` `IPC` `Pipe` `Queue` `multiprocessing` `同步原语`

---

**最后更新**: 2024-01-15  
**作者**: Python 编程指南  
**版本**: 1.0