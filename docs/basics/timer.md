---
layout: doc
title: Python Threading.Timer 定时器
permalink: /docs/basics/timer/
category: basics
tags: [定时器, threading, Timer, 线程定时器, 多线程]
description: 学习使用 Python 标准库中的 threading.Timer 类实现异步定时任务，适合中等复杂度的定时需求
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# Python Threading.Timer 定时器

## 📝 概述

Threading.Timer 是 Python 标准库中的线程化定时器实现，基于 Threading 模块构建。与基础的 while+sleep 方法相比，Threading.Timer 提供了异步执行能力，能够在不阻塞主线程的情况下执行定时任务。这种实现特别适合需要在后台执行任务，但又不需要复杂调度框架的场景。

**主要特点：**
- 基于线程实现，支持异步执行
- 内置于 Python 标准库，无需额外安装
- 提供基本的控制接口 (start/cancel)
- 支持一次性任务和重复任务
- 可以方便地构建自定义定时器类

**适用场景：**
- 需要在后台执行的定时任务
- 不阻塞主线程的一次性延迟执行
- 对精确时间控制要求不高的应用
- 中等复杂度的定时需求

## 🎯 学习目标

通过本教程，你将掌握：

- [x] Threading.Timer 的工作原理和基本用法
- [x] 如何创建可重复执行的定时器
- [x] 多定时器的创建和控制
- [x] 定时器的取消和资源管理
- [x] 线程安全考虑和最佳实践
- [x] 与其他定时器实现的比较

## 📋 前置知识

- Python 基础语法
- 函数和类的定义与使用
- 基本的线程概念
- Python 中的异常处理
- 回调函数的概念

## 🧰 安装

Threading.Timer 是 Python 标准库的一部分，无需额外安装。本示例中用于系统监控的 psutil 库需要安装：

```bash
# 使用 pip 安装
pip install psutil

# 或使用 conda-forge 安装（推荐 conda 环境）
conda install -c conda-forge psutil
```

## 🔍 详细内容

### 系统监控函数准备

我们将继续使用系统监控函数来演示定时器的使用：

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
```

### Threading.Timer 基本用法

```python
import threading

def basic_timer_example():
    """Threading.Timer 基本用法示例"""
    print("Threading.Timer 基本用法演示")
    
    def delayed_message(message):
        print(f"延迟消息: {message}")
    
    # 创建一个3秒后执行的定时器
    timer = threading.Timer(3.0, delayed_message, args=["这是一个延迟3秒的消息"])
    
    print("启动定时器...")
    timer.start()  # 非阻塞，立即返回
    
    print("主线程继续执行其他任务...")
    # 模拟主线程工作
    for i in range(5):
        print(f"主线程工作中... {i+1}")
        time.sleep(1)  # 主线程中的等待不会影响定时器
    
    print("演示结束")

# basic_timer_example()
```

### 使用 Timer 执行系统监控

```python
def timer_monitor_example():
    """使用Threading.Timer执行系统监控"""
    # 创建定时器执行系统监控
    timer = threading.Timer(2.0, monitor_system)
    
    print("启动系统监控定时器...")
    timer.start()
    
    print("主线程继续执行...")
    time.sleep(3)  # 等待定时器执行完成
    
    print("监控示例结束")

# timer_monitor_example()
```

### 可控制的重复执行定时器类

```python
class RepeatingTimer:
    """可重复执行的定时器类"""
    
    def __init__(self, interval, function, *args, **kwargs):
        self.interval = interval
        self.function = function
        self.args = args
        self.kwargs = kwargs
        self.timer = None
        self.is_running = False
        self.next_call = 0
        self.iteration_count = 0
    
    def _run(self):
        """内部运行函数，执行任务并安排下一次执行"""
        self.is_running = True
        self.iteration_count += 1
        
        try:
            # 执行目标函数
            self.function(*self.args, **self.kwargs)
        except Exception as e:
            print(f"定时任务执行异常: {str(e)}")
        
        # 只有当仍在运行时才安排下一次执行
        if self.is_running:
            # 计算下一次执行时间
            self.next_call = time.time() + self.interval
            self.timer = threading.Timer(self.interval, self._run)
            self.timer.daemon = True  # 设为守护线程，主程序退出时自动结束
            self.timer.start()
    
    def start(self):
        """启动定时器"""
        if not self.is_running:
            self.next_call = time.time() + self.interval
            self.timer = threading.Timer(self.interval, self._run)
            self.timer.daemon = True
            self.timer.start()
            self.is_running = True
            print(f"定时器已启动，间隔 {self.interval} 秒")
    
    def stop(self):
        """停止定时器"""
        if self.is_running and self.timer:
            self.timer.cancel()
            self.is_running = False
            print(f"定时器已停止，共执行 {self.iteration_count} 次")
    
    def get_stats(self):
        """获取定时器状态"""
        return {
            "is_running": self.is_running,
            "interval": self.interval,
            "iteration_count": self.iteration_count,
            "next_call_in": max(0, self.next_call - time.time()) if self.is_running else None
        }

def demo_repeating_timer():
    """演示可重复执行的定时器"""
    # 创建定时器
    timer = RepeatingTimer(2, monitor_system)
    
    # 启动定时器
    timer.start()
    
    # 让定时器运行一段时间
    for i in range(5):
        print(f"主线程工作中... ({i+1}/5)")
        # 输出定时器状态
        stats = timer.get_stats()
        print(f"定时器状态: 运行={stats['is_running']}, 次数={stats['iteration_count']}, 下次执行={stats['next_call_in']:.1f}秒后")
        time.sleep(1)
    
    # 停止定时器
    timer.stop()
    
    print("演示结束")

# 执行演示
# demo_repeating_timer()
```

### 多任务定时器管理器

```python
class TimerManager:
    """多任务定时器管理器"""
    
    def __init__(self):
        self.timers = {}
        self.lock = threading.Lock()  # 用于线程安全操作
    
    def add_timer(self, name, interval, function, *args, **kwargs):
        """添加定时器"""
        with self.lock:
            if name in self.timers:
                print(f"定时器 '{name}' 已存在，将被替换")
                self.stop_timer(name)
            
            timer = RepeatingTimer(interval, function, *args, **kwargs)
            self.timers[name] = timer
            print(f"定时器 '{name}' 已添加，间隔 {interval} 秒")
            return timer
    
    def start_timer(self, name):
        """启动指定名称的定时器"""
        with self.lock:
            if name in self.timers:
                self.timers[name].start()
                return True
            else:
                print(f"定时器 '{name}' 不存在")
                return False
    
    def stop_timer(self, name):
        """停止指定名称的定时器"""
        with self.lock:
            if name in self.timers:
                self.timers[name].stop()
                return True
            else:
                print(f"定时器 '{name}' 不存在")
                return False
    
    def remove_timer(self, name):
        """移除指定名称的定时器"""
        with self.lock:
            if name in self.timers:
                self.stop_timer(name)
                del self.timers[name]
                print(f"定时器 '{name}' 已移除")
                return True
            else:
                print(f"定时器 '{name}' 不存在")
                return False
    
    def start_all(self):
        """启动所有定时器"""
        with self.lock:
            if not self.timers:
                print("没有定时器可启动")
                return
            
            count = 0
            for name, timer in self.timers.items():
                timer.start()
                count += 1
            
            print(f"已启动 {count} 个定时器")
    
    def stop_all(self):
        """停止所有定时器"""
        with self.lock:
            if not self.timers:
                print("没有定时器可停止")
                return
            
            count = 0
            for name, timer in self.timers.items():
                timer.stop()
                count += 1
            
            print(f"已停止 {count} 个定时器")
    
    def list_timers(self):
        """列出所有定时器状态"""
        with self.lock:
            if not self.timers:
                print("当前没有注册的定时器")
                return []
            
            result = []
            print("\n当前定时器列表:")
            print("-" * 70)
            print(f"{'名称':<15} {'状态':<10} {'间隔(秒)':<10} {'执行次数':<10} {'下次执行':<15}")
            print("-" * 70)
            
            for name, timer in self.timers.items():
                stats = timer.get_stats()
                status = "运行中" if stats["is_running"] else "已停止"
                next_call = f"{stats['next_call_in']:.1f}秒后" if stats["is_running"] else "N/A"
                
                print(f"{name:<15} {status:<10} {stats['interval']:<10.1f} {stats['iteration_count']:<10} {next_call:<15}")
                
                result.append({
                    "name": name,
                    "status": status,
                    "interval": stats["interval"],
                    "iteration_count": stats["iteration_count"],
                    "next_call": next_call
                })
            
            print("-" * 70)
            return result

def demo_timer_manager():
    """演示定时器管理器的使用"""
    manager = TimerManager()
    
    # 添加多个定时器
    manager.add_timer("system", 3, monitor_system)
    manager.add_timer("network", 5, monitor_network)
    manager.add_timer("clock", 2, lambda: print(f"当前时间: {datetime.datetime.now().strftime('%H:%M:%S')}"))
    
    # 列出所有定时器
    manager.list_timers()
    
    # 启动所有定时器
    manager.start_all()
    
    # 等待一段时间
    time.sleep(6)
    
    # 查看定时器状态
    manager.list_timers()
    
    # 停止特定定时器
    manager.stop_timer("network")
    
    # 再等待一段时间
    time.sleep(4)
    
    # 最终状态
    manager.list_timers()
    
    # 停止所有定时器
    manager.stop_all()
    
    print("演示结束")

# 执行演示
# demo_timer_manager()
```

### 高级功能：带优先级的任务定时器

```python
class PriorityTask:
    """带优先级的任务"""
    
    def __init__(self, priority, function, *args, **kwargs):
        self.priority = priority  # 优先级：1(高) - 5(低)
        self.function = function
        self.args = args
        self.kwargs = kwargs
    
    def execute(self):
        """执行任务"""
        return self.function(*self.args, **self.kwargs)

class PriorityTimer:
    """带优先级的定时器"""
    
    def __init__(self, interval):
        self.interval = interval
        self.tasks = []  # 任务列表
        self.timer = None
        self.is_running = False
        self.lock = threading.Lock()
    
    def add_task(self, priority, function, *args, **kwargs):
        """添加任务"""
        with self.lock:
            task = PriorityTask(priority, function, *args, **kwargs)
            self.tasks.append(task)
            # 按优先级排序（低数字 = 高优先级）
            self.tasks.sort(key=lambda t: t.priority)
            return len(self.tasks)
    
    def _run(self):
        """内部运行函数"""
        if not self.is_running:
            return
        
        with self.lock:
            # 按优先级执行任务
            for task in self.tasks:
                try:
                    print(f"执行优先级 {task.priority} 的任务...")
                    task.execute()
                except Exception as e:
                    print(f"任务执行错误: {str(e)}")
        
        # 安排下一次执行
        if self.is_running:
            self.timer = threading.Timer(self.interval, self._run)
            self.timer.daemon = True
            self.timer.start()
    
    def start(self):
        """启动定时器"""
        with self.lock:
            if not self.is_running:
                self.is_running = True
                self.timer = threading.Timer(self.interval, self._run)
                self.timer.daemon = True
                self.timer.start()
                print(f"优先级定时器已启动，间隔 {self.interval} 秒，共 {len(self.tasks)} 个任务")
    
    def stop(self):
        """停止定时器"""
        with self.lock:
            if self.is_running and self.timer:
                self.is_running = False
                self.timer.cancel()
                print("优先级定时器已停止")

def demo_priority_timer():
    """演示带优先级的定时器"""
    # 创建定时器
    timer = PriorityTimer(interval=2)
    
    # 添加不同优先级的任务
    timer.add_task(1, lambda: print("高优先级任务 - 紧急系统检查"))
    timer.add_task(3, monitor_system)
    timer.add_task(5, monitor_network)
    timer.add_task(2, lambda: print(f"重要任务 - 当前时间: {datetime.datetime.now().strftime('%H:%M:%S')}"))
    
    # 启动定时器
    timer.start()
    
    # 等待几个周期
    time.sleep(7)
    
    # 停止定时器
    timer.stop()
    
    print("演示结束")

# 执行演示
# demo_priority_timer()
```

## 💡 优缺点分析

### 优点

```python
def threading_timer_advantages():
    """演示Threading.Timer的优点"""
    print("Threading.Timer 的优点:")
    print("1. 基于标准库，无需额外依赖")
    print("2. 支持异步执行，不阻塞主线程")
    print("3. 使用简单，API 直观")
    print("4. 可以方便地扩展为自定义定时器类")
    print("5. 适合中等复杂度的定时需求")
    
    # 演示异步非阻塞特性
    def delayed_task():
        print("定时任务执行...")
    
    print("\n异步执行演示:")
    timer = threading.Timer(2, delayed_task)
    timer.start()
    
    print("主线程继续执行，不受定时器影响")
    time.sleep(3)  # 等待定时器执行完毕

# threading_timer_advantages()
```

### 缺点和限制

```python
def threading_timer_limitations():
    """演示Threading.Timer的缺点"""
    print("Threading.Timer 的限制:")
    print("1. 只支持一次性执行，需要自行实现重复执行")
    print("2. 没有内置的错误处理机制")
    print("3. 没有提供复杂的调度能力（如cron表达式）")
    print("4. 需要手动管理线程资源")
    print("5. 多定时器协调需要额外代码")
    
    # 演示一次性执行的限制
    print("\n一次性执行限制演示:")
    timer = threading.Timer(1, lambda: print("这个定时器只会执行一次"))
    timer.start()
    time.sleep(2)  # 等待定时器执行
    
    print("如需再次执行，需要创建新的定时器实例")
    timer2 = threading.Timer(1, lambda: print("这是第二个定时器实例"))
    timer2.start()
    time.sleep(2)  # 等待第二个定时器执行

# threading_timer_limitations()
```

## ⚠️ 注意事项

1. **线程安全考虑**：
   - 在多个定时器访问共享资源时需要使用锁
   - 注意线程间的数据共享和状态管理
   - 避免死锁和线程竞争条件

2. **资源管理**：
   - 确保不再使用的定时器被正确取消
   - 长时间运行的应用中要避免创建过多线程
   - 考虑使用线程池来限制并发线程数

3. **错误处理**：
   - 定时器线程中的异常不会传播到主线程
   - 需要在定时器中添加 try-except 块处理异常
   - 考虑添加日志记录机制跟踪错误

4. **时间精度**：
   - 定时器精度受 Python 解释器和操作系统影响
   - 任务执行时间会影响定时精度
   - 不适合需要高精度定时的场景（如音频处理）

## 🔗 相关内容

- [while+sleep 循环定时器](./sleep/)
- [schedule 模块调度](./schedule/)
- [APScheduler 框架](./apscheduler/)
- [线程模块 - threading](../../stdlib/threading/)
- [线程池 - concurrent.futures](../../stdlib/concurrent.futures/)

## 📚 扩展阅读

- [Python threading 模块文档](https://docs.python.org/3/library/threading.html)
- [Python 线程编程最佳实践](https://docs.python.org/3/library/threading.html#threading-objects)
- [Timer 类源码分析](https://github.com/python/cpython/blob/main/Lib/threading.py)
- [Python 多线程编程技巧](https://realpython.com/intro-to-python-threading/)

## 🏷️ 标签

`定时器` `threading` `Timer` `线程定时器` `多线程`

---

**最后更新**: 2024-01-15  
**作者**: Python 编程指南  
**版本**: 1.0