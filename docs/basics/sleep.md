---
layout: doc
title: Python while+sleep 循环定时器
permalink: /docs/basics/sleep/
category: basics
tags: [定时器, sleep, while循环, 阻塞定时器, 循环控制]
description: 学习使用 while 循环和 sleep 函数实现最基础的 Python 定时器，适合简单的定时任务和快速原型验证
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "初级"
---

# Python while+sleep 循环定时器

## 📝 概述

while+sleep 是最基础的定时器实现方式，使用无限循环加上 sleep 函数来实现定时执行。这种方法简单直观，非常适合快速原型开发和简单的定时任务。虽然功能有限，但在特定场景下仍然是很实用的解决方案。

**主要特点：**
- 实现简单，代码易于理解
- 阻塞式执行，适合单任务场景
- 时间间隔固定，执行逻辑清晰
- 资源消耗低，适合轻量级应用

**适用场景：**
- 简单的定时监控脚本
- 测试环境中的原型验证
- 对时间精度要求不高的定时任务
- 学习定时器概念的入门示例

## 🎯 学习目标

通过本教程，你将掌握：

- [x] while+sleep 循环定时器的基本实现原理
- [x] 如何创建可控制的循环定时器
- [x] 异常处理和优雅退出机制
- [x] 这种方式的优缺点和适用场景
- [x] 与其他定时器实现方式的对比

## 📋 前置知识

- Python 基础语法和循环结构
- time 模块的基本使用
- 异常处理机制（try-except）
- 基础的系统信号处理概念

## 🧰 安装

本示例需要安装 psutil 库用于系统监控演示：

```bash
# 使用 pip 安装
pip install psutil

# 或使用 conda-forge 安装（推荐 conda 环境）
conda install -c conda-forge psutil
```

## 🔍 详细内容

### 基础实现原理

while+sleep 定时器的核心思想是使用无限循环结合 time.sleep() 函数来实现定时执行：

```python
import time

def basic_timer_example():
    """最基础的定时器示例"""
    count = 0
    
    print("开始基础定时器演示...")
    
    while True:
        count += 1
        print(f"第 {count} 次执行：{time.strftime('%H:%M:%S')}")
        
        # 等待 2 秒
        time.sleep(2)
        
        # 演示用：执行 5 次后退出
        if count >= 5:
            print("演示结束")
            break

# 执行基础示例
# basic_timer_example()
```

### 系统监控任务实现

为了演示实际应用，我们实现一个系统监控功能：

```python
# 系统监控功能实现
import psutil
import time
import datetime

def monitor_system(logfile=None):
    """监测系统CPU和内存使用情况"""
    # 获取CPU使用率
    cpu_percent = psutil.cpu_percent()
    
    # 获取内存使用情况
    memory = psutil.virtual_memory()
    memory_percent = memory.percent
    
    # 获取当前时间
    now = datetime.datetime.now()
    timestamp = now.strftime('%Y-%m-%d %H:%M:%S')
    
    # 格式化输出信息
    line = f'{timestamp} CPU:{cpu_percent}%, 内存:{memory_percent}%'
    print(line)
    
    # 可选：写入日志文件
    if logfile:
        logfile.write(line + '\n')
        logfile.flush()
    
    return cpu_percent, memory_percent

def monitor_network(logfile=None):
    """监测网络收发字节数"""
    # 获取网络IO统计
    net_info = psutil.net_io_counters()
    
    # 获取当前时间
    now = datetime.datetime.now()
    timestamp = now.strftime('%Y-%m-%d %H:%M:%S')
    
    # 格式化输出信息
    line = f'{timestamp} 发送字节={net_info.bytes_sent}, 接收字节={net_info.bytes_recv}'
    print(line)
    
    # 可选：写入日志文件
    if logfile:
        logfile.write(line + '\n')
        logfile.flush()
    
    return net_info.bytes_sent, net_info.bytes_recv

# 测试监控功能
def test_monitors():
    """测试系统监控功能"""
    print("系统监控功能测试：")
    monitor_system()
    monitor_network()

# test_monitors()
```

**输出示例：**
```
2024-01-15 14:23:41 CPU:0.6%, 内存:77.2%
2024-01-15 14:23:41 发送字节=169752183, 接收字节=1107900973
```

### 完整的循环定时器实现

```python
def simple_timer_loop():
    """使用while循环+sleep实现定时监控"""
    print("开始循环定时监控...")
    
    while True:
        # 执行监控任务
        monitor_system()
        
        # 等待3秒
        print("等待3秒...")
        time.sleep(3)

def demo_simple_timer():
    """演示简单定时器的使用"""
    try:
        simple_timer_loop()
    except KeyboardInterrupt:
        print("\n定时器已停止")

# 执行演示（注意：这会持续运行，按Ctrl+C停止）
# demo_simple_timer()
```

### 改进版本 - 可配置的定时器

```python
class SimpleTimer:
    """可配置的while+sleep定时器类"""
    
    def __init__(self, interval=1, max_iterations=None):
        self.interval = interval
        self.max_iterations = max_iterations
        self.is_running = False
        self.iteration_count = 0
    
    def start(self, task_func, *args, **kwargs):
        """启动定时器"""
        self.is_running = True
        self.iteration_count = 0
        
        print(f"定时器启动，间隔 {self.interval} 秒")
        if self.max_iterations:
            print(f"最大执行次数: {self.max_iterations}")
        
        try:
            while self.is_running:
                # 执行任务
                self.iteration_count += 1
                print(f"第 {self.iteration_count} 次执行：")
                task_func(*args, **kwargs)
                
                # 检查是否达到最大迭代次数
                if self.max_iterations and self.iteration_count >= self.max_iterations:
                    print(f"达到最大执行次数 {self.max_iterations}，定时器停止")
                    break
                
                # 等待
                time.sleep(self.interval)
                
        except KeyboardInterrupt:
            print(f"\n定时器被用户中断，共执行 {self.iteration_count} 次")
        finally:
            self.is_running = False
    
    def stop(self):
        """停止定时器"""
        self.is_running = False

def demo_configurable_timer():
    """演示可配置定时器的使用"""
    # 创建定时器实例
    timer = SimpleTimer(interval=2, max_iterations=5)
    
    # 启动定时器执行系统监控
    timer.start(monitor_system)

# 执行演示
# demo_configurable_timer()
```

### 带日志记录的定时器

```python
import os
from datetime import datetime

class LoggingTimer:
    """带日志记录的循环定时器"""
    
    def __init__(self, interval=1, log_file=None):
        self.interval = interval
        self.log_file = log_file
        self.is_running = False
        self.start_time = None
        self.iteration_count = 0
    
    def _write_log(self, message):
        """写入日志"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_line = f"[{timestamp}] {message}"
        
        print(log_line)
        
        if self.log_file:
            with open(self.log_file, 'a', encoding='utf-8') as f:
                f.write(log_line + '\n')
    
    def start(self, task_func, *args, **kwargs):
        """启动带日志的定时器"""
        self.is_running = True
        self.start_time = datetime.now()
        self.iteration_count = 0
        
        self._write_log(f"定时器启动，间隔 {self.interval} 秒")
        
        try:
            while self.is_running:
                self.iteration_count += 1
                
                try:
                    # 记录任务开始
                    self._write_log(f"开始执行第 {self.iteration_count} 次任务")
                    
                    # 执行任务
                    result = task_func(*args, **kwargs)
                    
                    # 记录任务完成
                    self._write_log(f"第 {self.iteration_count} 次任务执行完成")
                    
                except Exception as e:
                    # 记录任务异常
                    self._write_log(f"第 {self.iteration_count} 次任务执行失败: {str(e)}")
                
                # 等待下次执行
                time.sleep(self.interval)
                
        except KeyboardInterrupt:
            elapsed_time = datetime.now() - self.start_time
            self._write_log(f"定时器被用户中断，运行时长: {elapsed_time}, 执行次数: {self.iteration_count}")
        finally:
            self.is_running = False

def demo_logging_timer():
    """演示带日志的定时器"""
    # 创建日志文件名
    log_filename = f"timer_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    
    # 创建定时器
    timer = LoggingTimer(interval=3, log_file=log_filename)
    
    # 定义一个可能出错的任务
    def risky_task():
        import random
        if random.random() < 0.3:  # 30%概率出错
            raise Exception("模拟任务异常")
        monitor_system()
    
    print(f"启动带日志的定时器，日志文件: {log_filename}")
    timer.start(risky_task)

# 执行演示
# demo_logging_timer()
```

### 多任务循环定时器

虽然 while+sleep 本质上是单线程的，但我们可以在一个循环中执行多个任务：

```python
class MultiTaskTimer:
    """多任务循环定时器"""
    
    def __init__(self, interval=1):
        self.interval = interval
        self.tasks = []
        self.is_running = False
    
    def add_task(self, task_func, *args, **kwargs):
        """添加任务"""
        task = {
            'func': task_func,
            'args': args, 
            'kwargs': kwargs,
            'name': task_func.__name__
        }
        self.tasks.append(task)
        print(f"已添加任务: {task['name']}")
    
    def remove_task(self, task_name):
        """移除任务"""
        self.tasks = [task for task in self.tasks if task['name'] != task_name]
        print(f"已移除任务: {task_name}")
    
    def start(self):
        """启动多任务定时器"""
        if not self.tasks:
            print("没有任务需要执行")
            return
        
        self.is_running = True
        cycle_count = 0
        
        print(f"多任务定时器启动，共 {len(self.tasks)} 个任务，间隔 {self.interval} 秒")
        
        try:
            while self.is_running:
                cycle_count += 1
                print(f"\n=== 第 {cycle_count} 轮任务执行 ===")
                
                # 依次执行所有任务
                for i, task in enumerate(self.tasks, 1):
                    try:
                        print(f"执行任务 {i}/{len(self.tasks)}: {task['name']}")
                        task['func'](*task['args'], **task['kwargs'])
                    except Exception as e:
                        print(f"任务 {task['name']} 执行失败: {str(e)}")
                
                print(f"第 {cycle_count} 轮任务完成，等待 {self.interval} 秒...")
                time.sleep(self.interval)
                
        except KeyboardInterrupt:
            print(f"\n多任务定时器被中断，共执行 {cycle_count} 轮")
        finally:
            self.is_running = False
    
    def stop(self):
        """停止定时器"""
        self.is_running = False

def demo_multi_task_timer():
    """演示多任务定时器"""
    timer = MultiTaskTimer(interval=2)
    
    # 添加多个任务
    timer.add_task(monitor_system)
    timer.add_task(monitor_network)
    timer.add_task(lambda: print(f"当前时间: {datetime.datetime.now()}"))
    
    # 启动定时器
    timer.start()

# 执行演示
# demo_multi_task_timer()
```

## 💡 优缺点分析

### 优点分析

```python
def advantages_demo():
    """演示while+sleep定时器的优点"""
    print("while+sleep 定时器的优点:")
    print("1. 实现简单，代码易懂")
    print("2. 适合快速原型开发")
    print("3. 资源消耗低")
    print("4. 调试容易")
    
    # 演示简单实现
    def simple_monitor():
        count = 0
        while count < 3:
            count += 1
            print(f"简单监控第 {count} 次")
            time.sleep(1)
    
    simple_monitor()

# advantages_demo()
```

### 缺点和限制

```python
def limitations_demo():
    """演示while+sleep定时器的缺点"""
    print("while+sleep 定时器的缺点:")
    print("1. 阻塞主线程")
    print("2. 时间精度受任务执行时间影响")
    print("3. 只能处理单一任务流")
    print("4. 难以实现复杂调度")
    
    # 演示时间精度问题
    def precision_test():
        start_time = time.time()
        
        for i in range(3):
            print(f"开始第 {i+1} 次任务: {time.time() - start_time:.2f}s")
            
            # 模拟耗时任务
            time.sleep(0.5)  # 任务执行时间
            
            # 定时间隔
            time.sleep(1)    # 期望的间隔时间
        
        total_time = time.time() - start_time
        print(f"总耗时: {total_time:.2f}s (期望: 4.5s)")
    
    precision_test()

# limitations_demo()
```

## ⚠️ 注意事项

1. **时间精度**：
   - sleep() 的精度受操作系统影响
   - 任务执行时间会影响实际间隔
   - 系统负载会影响定时器精度

2. **资源管理**：
   - 确保及时释放文件句柄和网络连接
   - 注意内存使用，避免无限增长
   - 在循环中避免创建大量临时对象

3. **异常处理**：
   - 任务中的异常可能中断整个循环
   - 使用 try-except 保护关键代码
   - 考虑异常恢复和重试机制

4. **优雅退出**：
   - 处理 KeyboardInterrupt 信号
   - 提供清理资源的机制
   - 记录运行状态和统计信息

## 🔗 相关内容

- [threading.Timer 定时器](./timer/)
- [schedule 模块调度](./schedule/)
- [APScheduler 框架](./apscheduler/)
- [时间处理模块 - time](../../stdlib/time/)
- [日期时间处理 - datetime](../../stdlib/datetime/)

## 📚 扩展阅读

- [Python time 模块文档](https://docs.python.org/3/library/time.html)
- [Python 异常处理最佳实践](https://docs.python.org/3/tutorial/errors.html)
- [psutil 系统监控库](https://psutil.readthedocs.io/)
- [Python 循环和控制流](https://docs.python.org/3/tutorial/controlflow.html)

## 🏷️ 标签

`定时器` `sleep` `while循环` `阻塞定时器` `循环控制`

---

**最后更新**: 2024-01-15  
**作者**: Python 编程指南  
**版本**: 1.0