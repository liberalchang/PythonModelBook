---
layout: doc
title: asyncio 队列详解：Queue、PriorityQueue、LifoQueue 与异步任务调度
permalink: /docs/basics/asyncio-queues/
category: basics
tags: [协程, asyncio, 队列, Queue, PriorityQueue, LifoQueue, 生产者消费者]
description: 详解 asyncio 支持的多种队列类型，包括基础队列、优先级队列、栈式队列的使用场景与实现原理
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# asyncio 队列详解：Queue、PriorityQueue、LifoQueue 与异步任务调度

## 📝 概述

在异步编程中，队列是实现生产者-消费者模式的核心工具。Python asyncio 提供了多种队列类型来处理不同的任务调度需求，包括基础队列（Queue）、优先级队列（PriorityQueue）和后进先出队列（LifoQueue）。本文深入探讨这些队列的实现原理、使用场景和最佳实践。

## 🎯 学习目标

- 理解异步队列在生产者-消费者模式中的作用
- 掌握 asyncio.Queue 的使用方法和内部机制
- 学会使用 PriorityQueue 处理有优先级的任务
- 了解 LifoQueue 的栈式处理特性
- 掌握队列在实际项目中的应用场景

## 📋 前置知识

- Python 异步编程基础
- 协程和 await 语法
- 生产者-消费者模式概念

## 🔍 详细内容

### 生产者-消费者模型基础

生产者-消费者模型是并发编程的经典模式：
- **生产者（Producer）**：负责生成数据或任务
- **消费者（Consumer）**：负责处理或消费数据
- **队列（Queue）**：作为缓冲区，解耦生产者和消费者

异步队列的优势：
- **异步操作**：put 和 get 操作可以异步等待
- **流量控制**：通过队列大小限制内存使用
- **任务协调**：提供 join() 方法等待所有任务完成

### asyncio.Queue 基础使用

#### 超市收银系统示例

```python
import asyncio
import random

async def checkout_customer(queue, cashier_id):
    """收银员处理顾客的协程"""
    while True:
        try:
            # 从队列中获取顾客（如果队列为空会等待）
            customer = await queue.get()
            
            # 模拟处理时间
            processing_time = random.uniform(1, 3)
            print(f"收银员 {cashier_id} 开始为顾客 {customer} 结账")
            await asyncio.sleep(processing_time)
            print(f"收银员 {cashier_id} 完成顾客 {customer} 结账")
            
            # 标记任务完成
            queue.task_done()
            
        except asyncio.CancelledError:
            # 收银员下班
            print(f"收银员 {cashier_id} 下班")
            break

async def main():
    # 创建队列（最大容量10）
    queue = asyncio.Queue(maxsize=10)
    
    # 添加顾客到队列
    customers = [f"顾客{i}" for i in range(1, 21)]
    for customer in customers:
        await queue.put(customer)
    
    # 启动多个收银员（消费者）
    cashiers = []
    for i in range(3):
        task = asyncio.create_task(checkout_customer(queue, i + 1))
        cashiers.append(task)
    
    # 等待所有顾客被处理完
    await queue.join()
    
    # 停止收银员
    for cashier in cashiers:
        cashier.cancel()
    
    # 等待所有收银员任务结束
    await asyncio.gather(*cashiers, return_exceptions=True)
    print("超市关门")

# 运行程序
asyncio.run(main())
```

### asyncio.Queue 源码解析

#### 核心属性和方法

```python
class Queue:
    def __init__(self, maxsize=0):
        self._maxsize = maxsize
        self._getters = collections.deque()  # 等待获取数据的协程
        self._putters = collections.deque()  # 等待放入数据的协程
        self._unfinished_tasks = 0           # 未完成任务计数
        self._finished = locks.Event()       # 任务完成事件
        self._init(maxsize)                  # 初始化存储容器
    
    def _init(self, maxsize):
        self._queue = collections.deque()    # 实际存储数据的双端队列
```

#### 关键机制详解

**1. _unfinished_tasks 计数器**
```python
def put_nowait(self, item):
    """非阻塞放入数据"""
    if self.full():
        raise QueueFull
    self._put(item)
    self._unfinished_tasks += 1  # 增加未完成任务计数
    self._finished.clear()       # 清除完成标志
    self._wakeup_next(self._getters)  # 唤醒等待的获取者

def task_done(self):
    """标记任务完成"""
    if self._unfinished_tasks <= 0:
        raise ValueError('task_done() called too many times')
    self._unfinished_tasks -= 1
    if self._unfinished_tasks == 0:
        self._finished.set()  # 设置完成标志
```

**2. join() 方法等待机制**
```python
async def join(self):
    """等待所有任务完成"""
    while not self._finished.is_set():
        await self._finished.wait()
```

**3. 阻塞与唤醒机制**
```python
async def get(self):
    """异步获取数据"""
    while self.empty():
        # 队列为空时，将当前协程加入等待队列
        getter = loops.get_event_loop().create_future()
        self._getters.append(getter)
        try:
            await getter  # 等待被唤醒
        except:
            self._getters.remove(getter)
            raise
    return self.get_nowait()

def _wakeup_next(self, waiters):
    """唤醒下一个等待的协程"""
    while waiters:
        waiter = waiters.popleft()
        if not waiter.done():
            waiter.set_result(None)  # 唤醒协程
            break
```

### 实际应用场景

#### Web 应用订单处理

```python
import asyncio
import json
from datetime import datetime

class OrderProcessor:
    def __init__(self, max_workers=5):
        self.order_queue = asyncio.Queue(maxsize=100)
        self.max_workers = max_workers
        self.workers = []
    
    async def add_order(self, order_data):
        """添加订单到处理队列"""
        order = {
            'id': order_data['id'],
            'customer': order_data['customer'],
            'items': order_data['items'],
            'timestamp': datetime.now().isoformat()
        }
        await self.order_queue.put(order)
        print(f"订单 {order['id']} 已加入处理队列")
    
    async def process_order(self, worker_id):
        """订单处理工作者"""
        while True:
            try:
                order = await self.order_queue.get()
                
                # 模拟订单处理
                print(f"工作者 {worker_id} 开始处理订单 {order['id']}")
                await asyncio.sleep(2)  # 模拟处理时间
                
                # 订单处理完成
                print(f"订单 {order['id']} 处理完成")
                self.order_queue.task_done()
                
            except asyncio.CancelledError:
                break
    
    async def start(self):
        """启动订单处理系统"""
        # 启动工作者
        for i in range(self.max_workers):
            worker = asyncio.create_task(self.process_order(i + 1))
            self.workers.append(worker)
    
    async def shutdown(self):
        """关闭处理系统"""
        # 等待所有订单处理完成
        await self.order_queue.join()
        
        # 停止工作者
        for worker in self.workers:
            worker.cancel()
        
        await asyncio.gather(*self.workers, return_exceptions=True)

# 使用示例
async def main():
    processor = OrderProcessor(max_workers=3)
    await processor.start()
    
    # 模拟接收订单
    orders = [
        {'id': f'ORDER_{i}', 'customer': f'客户{i}', 'items': ['商品A', '商品B']}
        for i in range(1, 11)
    ]
    
    for order in orders:
        await processor.add_order(order)
    
    await processor.shutdown()

asyncio.run(main())
```

#### 网络爬虫任务队列

```python
import asyncio
import aiohttp
from urllib.parse import urljoin, urlparse

class WebCrawler:
    def __init__(self, max_workers=10, max_depth=2):
        self.url_queue = asyncio.Queue()
        self.visited = set()
        self.max_workers = max_workers
        self.max_depth = max_depth
        self.session = None
    
    async def fetch_url(self, url, depth):
        """获取URL内容"""
        if depth > self.max_depth or url in self.visited:
            return
        
        self.visited.add(url)
        
        try:
            async with self.session.get(url, timeout=10) as response:
                if response.status == 200:
                    content = await response.text()
                    print(f"爬取成功: {url} (深度: {depth})")
                    
                    # 提取链接（简化版）
                    if depth < self.max_depth:
                        # 这里可以解析HTML提取链接
                        pass
                        
        except Exception as e:
            print(f"爬取失败: {url}, 错误: {e}")
    
    async def worker(self, worker_id):
        """爬虫工作者"""
        while True:
            try:
                url, depth = await self.url_queue.get()
                await self.fetch_url(url, depth)
                self.url_queue.task_done()
            except asyncio.CancelledError:
                break
    
    async def crawl(self, start_urls):
        """开始爬取"""
        # 初始化HTTP会话
        self.session = aiohttp.ClientSession()
        
        try:
            # 添加起始URL
            for url in start_urls:
                await self.url_queue.put((url, 0))
            
            # 启动工作者
            workers = []
            for i in range(self.max_workers):
                worker = asyncio.create_task(self.worker(i + 1))
                workers.append(worker)
            
            # 等待所有URL处理完成
            await self.url_queue.join()
            
            # 停止工作者
            for worker in workers:
                worker.cancel()
            
            await asyncio.gather(*workers, return_exceptions=True)
            
        finally:
            await self.session.close()

# 使用示例
async def main():
    crawler = WebCrawler(max_workers=5, max_depth=1)
    start_urls = [
        'https://httpbin.org/html',
        'https://httpbin.org/json'
    ]
    await crawler.crawl(start_urls)

asyncio.run(main())
```

### asyncio.PriorityQueue 优先级队列

PriorityQueue 基于堆排序实现，支持按优先级处理任务：

```python
import asyncio
import heapq
from dataclasses import dataclass, field
from typing import Any

@dataclass
class PriorityTask:
    priority: int
    item: Any = field(compare=False)  # 不参与比较，避免类型错误

async def priority_worker(queue, worker_id):
    """优先级任务处理器"""
    while True:
        try:
            priority_task = await queue.get()
            priority, task = priority_task.priority, priority_task.item
            
            print(f"工作者 {worker_id} 处理优先级 {priority} 任务: {task}")
            await asyncio.sleep(1)  # 模拟处理时间
            
            queue.task_done()
        except asyncio.CancelledError:
            break

async def main():
    # 创建优先级队列
    pq = asyncio.PriorityQueue()
    
    # 添加不同优先级的任务（数字越小优先级越高）
    tasks = [
        PriorityTask(priority=3, item="低优先级任务1"),
        PriorityTask(priority=1, item="高优先级任务1"),
        PriorityTask(priority=2, item="中优先级任务1"),
        PriorityTask(priority=1, item="高优先级任务2"),
        PriorityTask(priority=3, item="低优先级任务2"),
    ]
    
    # 添加任务到队列
    for task in tasks:
        await pq.put(task)
    
    # 启动工作者
    workers = [
        asyncio.create_task(priority_worker(pq, i + 1))
        for i in range(2)
    ]
    
    # 等待所有任务完成
    await pq.join()
    
    # 停止工作者
    for worker in workers:
        worker.cancel()
    
    await asyncio.gather(*workers, return_exceptions=True)

asyncio.run(main())
```

#### 解决优先级相同时的排序不稳定问题

当优先级相同时，Python 的堆排序可能产生不稳定的结果。解决方案是添加唯一索引：

```python
import asyncio
import itertools
from dataclasses import dataclass, field

@dataclass
class StablePriorityTask:
    priority: int
    index: int = field(compare=True)   # 用于稳定排序
    item: Any = field(compare=False)   # 实际任务数据

class StablePriorityQueue:
    def __init__(self):
        self._queue = asyncio.PriorityQueue()
        self._counter = itertools.count()  # 全局计数器
    
    async def put(self, priority, item):
        """添加任务，自动分配索引确保稳定排序"""
        task = StablePriorityTask(
            priority=priority,
            index=next(self._counter),
            item=item
        )
        await self._queue.put(task)
    
    async def get(self):
        """获取任务"""
        task = await self._queue.get()
        return task.priority, task.item
    
    def task_done(self):
        """标记任务完成"""
        return self._queue.task_done()
    
    async def join(self):
        """等待所有任务完成"""
        return await self._queue.join()

# 使用示例
async def stable_worker(queue, worker_id):
    """稳定的优先级任务处理器"""
    while True:
        try:
            priority, task = await queue.get()
            print(f"工作者 {worker_id} 处理优先级 {priority} 任务: {task}")
            await asyncio.sleep(0.1)
            queue.task_done()
        except asyncio.CancelledError:
            break

async def main():
    queue = StablePriorityQueue()
    
    # 添加相同优先级的任务
    tasks = [
        (1, "任务A"), (1, "任务B"), (1, "任务C"),
        (2, "任务D"), (2, "任务E")
    ]
    
    for priority, task in tasks:
        await queue.put(priority, task)
    
    # 启动工作者
    worker = asyncio.create_task(stable_worker(queue, 1))
    
    # 等待完成
    await queue.join()
    worker.cancel()

asyncio.run(main())
```

### asyncio.LifoQueue 后进先出队列

LifoQueue 实现栈的行为，最后添加的元素最先被处理：

```python
import asyncio

async def lifo_worker(queue, worker_id):
    """LIFO队列工作者"""
    while True:
        try:
            item = await queue.get()
            print(f"工作者 {worker_id} 处理: {item}")
            await asyncio.sleep(0.5)
            queue.task_done()
        except asyncio.CancelledError:
            break

async def main():
    # 创建LIFO队列
    lifo_queue = asyncio.LifoQueue()
    
    # 依次添加任务
    tasks = ["任务1", "任务2", "任务3", "任务4", "任务5"]
    for task in tasks:
        await lifo_queue.put(task)
        print(f"添加: {task}")
    
    print("\n开始处理（后进先出）:")
    
    # 启动工作者
    worker = asyncio.create_task(lifo_worker(lifo_queue, 1))
    
    # 等待所有任务完成
    await lifo_queue.join()
    
    # 停止工作者
    worker.cancel()

# 输出顺序: 任务5 -> 任务4 -> 任务3 -> 任务2 -> 任务1
asyncio.run(main())
```

## ⚠️ 注意事项

### 队列特性限制
- **非分布式**：asyncio 队列仅在单进程内有效
- **非持久化**：程序重启后队列数据丢失
- **内存限制**：大量数据可能导致内存溢出

### 使用建议
- 合理设置队列大小，避免无限制增长
- 及时调用 `task_done()` 避免 `join()` 永久等待
- 在异常处理中正确清理资源
- 考虑使用外部消息队列（如 Redis、RabbitMQ）处理分布式场景

## 🎯 最佳实践

1. **合理选择队列类型**：
   - 普通任务使用 `Queue`
   - 有优先级需求使用 `PriorityQueue`
   - 需要栈式处理使用 `LifoQueue`

2. **正确的生命周期管理**：
   - 使用 `try/except` 处理 `CancelledError`
   - 确保调用 `task_done()` 与 `put()` 次数匹配
   - 在程序退出前等待 `join()` 完成

3. **性能优化**：
   - 根据任务特性调整工作者数量
   - 避免过大的队列占用内存
   - 考虑批量处理减少上下文切换

## 🔗 相关内容

- [asyncio 基础概念](../asyncio-intro/)
- [协程与任务](../coroutine-methods/)
- [并发任务执行](../concurrent-tasks/)
- [asyncio 同步原语](../sync-primitives/)

## 📚 扩展阅读

- [asyncio 官方文档 - Queues](https://docs.python.org/3/library/asyncio-queue.html)
- [生产者-消费者模式](https://en.wikipedia.org/wiki/Producer%E2%80%93consumer_problem)
- [堆排序算法原理](https://en.wikipedia.org/wiki/Heapsort)

## 🏷️ 标签

`asyncio` `队列` `Queue` `PriorityQueue` `LifoQueue` `生产者消费者` `异步编程`

---

**最后更新**: 2024-01-15  
**作者**: Python 编程指南  
**版本**: 1.0