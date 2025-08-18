---
layout: doc
title: Python 定时器实现方式详解
permalink: /docs/basics/timer-complete/
category: basics
tags: [定时器, timer, schedule, APScheduler, 定时任务, 循环控制, 任务调度]
description: 深入学习 Python 中四种主要定时器实现方式，包括基础循环、Timer 类、schedule 模块和 APScheduler 框架
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# Python 定时器实现方式详解

## 📝 概述

定时器是程序中常用的功能，用于定时或定点执行特定任务。Python 提供了多种定时器实现方式，从简单的循环+sleep到专业的任务调度框架。每种方式都有自己的应用场景和特点。本文将详细介绍四种主要的定时器实现方式，帮助你根据实际需求选择最合适的方案。

**主要特点：**
- 多种实现方式，适应不同场景需求
- 从简单阻塞到复杂并发调度
- 支持定时和定点任务执行
- 可扩展性和可维护性考虑

**适用场景：**
- 系统监控和资源统计
- 定时数据备份和清理
- 周期性任务执行
- 自动化运维脚本

## 🎯 学习目标

通过本教程，你将掌握：

- [x] 四种主要定时器实现方式的优缺点对比
- [x] while+sleep 基础循环定时器的使用
- [x] threading.Timer 类的异步定时器实现
- [x] schedule 模块的轻量级任务调度
- [x] APScheduler 框架的专业任务调度
- [x] 定时器选择的最佳实践和性能考虑

## 📋 前置知识

- Python 基础语法和循环结构
- 多线程编程基础概念
- 异常处理机制
- 时间和日期处理基础

## 🧰 安装

在 conda base 环境下，推荐优先使用 conda-forge 或 pip 安装本文示例所需依赖：

```bash
# 使用 pip 安装（任选其一）
pip install psutil schedule apscheduler

# 或使用 conda-forge 安装（推荐 conda 环境）
conda install -c conda-forge psutil schedule apscheduler
```

> 提示：若网络环境受限，可配置国内镜像源或使用离线包进行安装。

## 🔍 详细内容

### 定时器方案对比

在开始详细介绍之前，我们先了解各种定时器实现方式的特点：

| 方法 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| while + sleep | 简单直接，易于理解 | 阻塞主线程，只能处理单个任务 | 简单的定时循环，测试环境 |
| threading.Timer | 非阻塞，支持异步执行 | 不易管理多个定时任务 | 单次或简单延迟任务 |
| schedule 模块 | API 简洁，支持多种时间格式 | 阻塞式执行，任务间可能影响 | 轻量级定时任务 |
| APScheduler | 功能强大，支持分布式和持久化 | 相对复杂，学习成本较高 | 专业的任务调度系统 |

### 准备工作 - 系统监控任务

为了更好地演示各种定时器的使用，我们先实现一个系统监控任务，用于定时监测 CPU 和内存使用率：

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
if __name__ == "__main__":
    print("系统监控功能测试：")
    monitor_system()
    monitor_network()
```

**输出示例：**
```
2024-01-15 14:23:41 CPU:0.6%, 内存:77.2%
2024-01-15 14:23:41 发送字节=169752183, 接收字节=1107900973
```

### 1. 最简单方式：while + sleep

这是最基础的定时器实现方式，使用无限循环加上 sleep 函数来实现定时执行：

```python
import time

def simple_timer_loop():
    """使用while循环+sleep实现定时监控"""
    print("开始循环定时监控...")
    
    while True:
        # 执行监控任务
        monitor_system()
        
        # 等待3秒
        print("等待3秒...")
        time.sleep(3)

# 使用示例
def demo_simple_timer():
    """演示简单定时器的使用"""
    try:
        simple_timer_loop()
    except KeyboardInterrupt:
        print("\n定时器已停止")

# 执行演示（注意：这会持续运行，按Ctrl+C停止）
# demo_simple_timer()
```

**优点：**
- 实现简单，代码易懂
- 适合快速原型和测试

**缺点：**
- 阻塞主线程，无法处理其他任务
- 只能处理单个定时任务
- 时间精度受到任务执行时间影响

**适用场景：**
- 简单的定时监控脚本
- 测试环境中的原型验证
- 对时间精度要求不高的场景

### 2. threading.Timer 实现方式

Timer 是 threading 模块提供的定时器类，可以实现非阻塞的定时任务执行：

```python
from threading import Timer
import datetime

def timer_task_system():
    """使用Timer执行系统监控任务"""
    monitor_system()
    
    # 创建新的Timer，3秒后再次执行
    timer = Timer(3.0, timer_task_system)
    timer.start()

def timer_task_network():
    """使用Timer执行网络监控任务"""
    monitor_network()
    
    # 创建新的Timer，1秒后再次执行
    timer = Timer(1.0, timer_task_network)
    timer.start()

def demo_timer_threading():
    """演示threading.Timer的使用"""
    print("开始Timer定时任务...")
    print(f"开始时间: {datetime.datetime.now()}")
    
    # 启动两个不同频率的定时任务
    timer_task_system()   # 每3秒执行系统监控
    timer_task_network()  # 每1秒执行网络监控
    
    # 主线程可以做其他事情
    try:
        while True:
            time.sleep(10)
            print(f"主线程活动时间: {datetime.datetime.now()}")
    except KeyboardInterrupt:
        print("\n定时器已停止")

# 执行演示
# demo_timer_threading()
```

**改进版本 - 可控制的Timer：**

```python
import threading
from threading import Timer

class ControllableTimer:
    """可控制的定时器类"""
    
    def __init__(self, interval, function, *args, **kwargs):
        self.interval = interval
        self.function = function
        self.args = args
        self.kwargs = kwargs
        self.timer = None
        self.is_running = False
    
    def start(self):
        """启动定时器"""
        if not self.is_running:
            self.is_running = True
            self._run()
    
    def stop(self):
        """停止定时器"""
        self.is_running = False
        if self.timer:
            self.timer.cancel()
    
    def _run(self):
        """内部运行方法"""
        if self.is_running:
            self.function(*self.args, **self.kwargs)
            self.timer = Timer(self.interval, self._run)
            self.timer.start()

def demo_controllable_timer():
    """演示可控制定时器的使用"""
    # 创建定时器实例
    system_timer = ControllableTimer(3, monitor_system)
    network_timer = ControllableTimer(1, monitor_network)
    
    # 启动定时器
    system_timer.start()
    network_timer.start()
    
    print("定时器已启动，10秒后自动停止...")
    time.sleep(10)
    
    # 停止定时器
    system_timer.stop()
    network_timer.stop()
    print("定时器已停止")

# 执行演示
# demo_controllable_timer()
```

**优点：**
- 非阻塞执行，主线程可以处理其他任务
- 可以同时运行多个定时器
- 支持异步执行

**缺点：**
- 每次执行后需要重新创建Timer对象
- 任务管理相对复杂
- 不适合复杂的调度需求

### 3. schedule 模块

schedule 是一个轻量级的第三方任务调度模块，提供了简洁的 API 来创建定时任务：

```python
import schedule
import time
import datetime

def job_system_monitor():
    """系统监控任务"""
    print('系统监控任务: 每隔3秒执行一次')
    print(f'开始时间: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    
    # 模拟任务执行时间
    monitor_system()
    time.sleep(1)  # 模拟处理时间
    
    print(f'结束时间: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    print('-' * 50)

def job_network_monitor():
    """网络监控任务"""
    print('网络监控任务: 每隔1秒执行一次')
    print(f'开始时间: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    
    monitor_network()
    
    print(f'结束时间: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    print('-' * 50)

def job_daily_report():
    """每日报告任务"""
    print('每日报告任务: 每天指定时间执行')
    print(f'执行时间: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    # 这里可以添加生成日报的逻辑
    print('生成每日系统使用报告...')
    print('-' * 50)

def demo_schedule_basic():
    """演示schedule模块的基本使用"""
    # 清空所有任务（在Jupyter环境中很有用）
    schedule.clear()
    
    # 注册各种定时任务
    schedule.every(3).seconds.do(job_system_monitor)     # 每3秒执行
    schedule.every(1).seconds.do(job_network_monitor)    # 每1秒执行
    schedule.every().day.at('15:30').do(job_daily_report) # 每天15:30执行
    
    # 更多调度示例
    # schedule.every(10).minutes.do(job_system_monitor)   # 每10分钟
    # schedule.every().hour.do(job_system_monitor)        # 每小时
    # schedule.every().monday.do(job_daily_report)        # 每周一
    # schedule.every(5).to(10).seconds.do(job_network_monitor)  # 每5-10秒随机
    
    print("调度任务已启动...")
    
    # 运行调度器
    start_time = time.time()
    try:
        while time.time() - start_time < 10:  # 运行10秒
            schedule.run_pending()
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n调度器已停止")
    
    print("演示结束")

# 执行演示
# demo_schedule_basic()
```

**schedule 模块的高级用法：**

```python
def demo_schedule_advanced():
    """演示schedule的高级用法"""
    schedule.clear()
    
    # 带参数的任务
    def task_with_params(name, duration):
        print(f"执行任务: {name}，预计耗时: {duration}秒")
        time.sleep(duration)
        print(f"任务 {name} 完成")
    
    # 任务标签和管理
    schedule.every(2).seconds.do(
        task_with_params, 
        name="快速任务", 
        duration=0.5
    ).tag('fast')
    
    schedule.every(5).seconds.do(
        task_with_params, 
        name="慢速任务", 
        duration=2
    ).tag('slow')
    
    # 条件执行
    def conditional_job():
        if datetime.datetime.now().second % 10 == 0:
            print("条件满足，执行特殊任务")
        else:
            print("条件不满足，跳过执行")
    
    schedule.every(1).seconds.do(conditional_job)
    
    print("高级调度演示开始...")
    start_time = time.time()
    
    while time.time() - start_time < 15:
        schedule.run_pending()
        time.sleep(0.1)
    
    # 清除特定标签的任务
    schedule.clear('slow')
    print("已清除慢速任务")

# 执行高级演示
# demo_schedule_advanced()
```

**优点：**
- API 简洁直观，易于使用
- 支持多种时间格式
- 支持任务标签和管理
- 轻量级，依赖少

**缺点：**
- 阻塞式执行，长时间任务会影响其他任务
- 功能相对简单，不支持复杂调度
- 需要手动管理调度循环

### 4. APScheduler 框架

APScheduler（Advanced Python Scheduler）是功能最强大的 Python 任务调度框架：

```python
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.schedulers.background import BackgroundScheduler
import time
import datetime

def system_monitor_job():
    """APScheduler系统监控任务"""
    now = datetime.datetime.now()
    timestamp = now.strftime('%Y-%m-%d %H:%M:%S')
    print(f'APScheduler任务执行: {timestamp}')
    monitor_system()

def network_monitor_job():
    """APScheduler网络监控任务"""
    now = datetime.datetime.now()
    timestamp = now.strftime('%Y-%m-%d %H:%M:%S')
    print(f'网络监控任务: {timestamp}')
    monitor_network()

def demo_apscheduler_blocking():
    """演示APScheduler阻塞式调度器"""
    # 创建阻塞式调度器
    scheduler = BlockingScheduler()
    
    # 添加任务 - 间隔调度
    scheduler.add_job(
        system_monitor_job, 
        'interval', 
        seconds=3, 
        id='system_monitor'
    )
    
    scheduler.add_job(
        network_monitor_job, 
        'interval', 
        seconds=1, 
        id='network_monitor'
    )
    
    # 添加定时调度 - 每天特定时间执行
    scheduler.add_job(
        lambda: print("每日定时任务执行"), 
        'cron', 
        hour=15, 
        minute=45, 
        id='daily_task'
    )
    
    print("APScheduler调度器启动...")
    try:
        scheduler.start()
    except KeyboardInterrupt:
        print("调度器已停止")

def demo_apscheduler_background():
    """演示APScheduler后台调度器"""
    # 创建后台调度器
    scheduler = BackgroundScheduler()
    
    # 添加各种类型的任务
    scheduler.add_job(
        system_monitor_job, 
        'interval', 
        seconds=2, 
        id='bg_system_monitor'
    )
    
    # Cron表达式调度
    scheduler.add_job(
        network_monitor_job,
        'cron',
        second='*/5',  # 每5秒执行
        id='bg_network_monitor'
    )
    
    # 启动调度器
    scheduler.start()
    print("后台调度器已启动...")
    
    # 主线程可以做其他事情
    try:
        time.sleep(20)  # 运行20秒
    except KeyboardInterrupt:
        pass
    finally:
        scheduler.shutdown()
        print("后台调度器已关闭")

# 执行演示
# demo_apscheduler_background()
```

**APScheduler 复杂调度示例：**

```python
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger

def demo_apscheduler_advanced():
    """演示APScheduler的高级功能"""
    scheduler = BlockingScheduler()
    
    # 复杂的Cron表达式
    def complex_task():
        print(f"复杂调度任务执行: {datetime.datetime.now()}")
    
    # 工作日早上5:30执行
    scheduler.add_job(
        complex_task,
        CronTrigger(day_of_week='mon-fri', hour=5, minute=30),
        id='workday_morning'
    )
    
    # 每月第一天执行
    scheduler.add_job(
        complex_task,
        CronTrigger(day=1, hour=0, minute=0),
        id='monthly_task'
    )
    
    # 每年特定日期执行
    scheduler.add_job(
        complex_task,
        CronTrigger(month=12, day=25, hour=17, minute=19, second=7),
        id='christmas_task'
    )
    
    # 任务管理
    def manage_jobs():
        print("当前调度任务:")
        for job in scheduler.get_jobs():
            print(f"- {job.id}: {job.next_run_time}")
    
    scheduler.add_job(manage_jobs, 'interval', seconds=30, id='job_manager')
    
    print("高级APScheduler调度器启动...")
    try:
        scheduler.start()
    except KeyboardInterrupt:
        print("调度器已停止")

# 执行高级演示
# demo_apscheduler_advanced()
```

**优点：**
- 功能强大，支持多种触发器类型
- 支持任务持久化和分布式调度
- 非阻塞执行，任务间不影响
- 提供丰富的任务管理接口
- 支持多种存储后端

**缺点：**
- 学习成本较高
- 对于简单需求可能过于复杂
- 依赖较多

## 💡 实际应用

### 选择合适的定时器方案

根据不同的应用场景，选择合适的定时器实现：

```python
def choose_timer_solution():
    """根据场景选择定时器方案的指导"""
    
    scenarios = {
        "简单测试脚本": {
            "推荐方案": "while + sleep",
            "原因": "实现简单，适合快速验证",
            "示例": "定时检查文件是否存在"
        },
        
        "单次延迟任务": {
            "推荐方案": "threading.Timer",
            "原因": "非阻塞，支持延迟执行",
            "示例": "登录超时检查，缓存过期清理"
        },
        
        "轻量级定时任务": {
            "推荐方案": "schedule",
            "原因": "API简洁，功能够用",
            "示例": "日志文件轮转，简单的数据备份"
        },
        
        "企业级任务调度": {
            "推荐方案": "APScheduler",
            "原因": "功能强大，支持复杂调度",
            "示例": "数据ETL，报表生成，系统维护"
        }
    }
    
    print("定时器方案选择指南:")
    print("=" * 50)
    
    for scenario, info in scenarios.items():
        print(f"\n场景: {scenario}")
        print(f"推荐方案: {info['推荐方案']}")
        print(f"选择原因: {info['原因']}")
        print(f"应用示例: {info['示例']}")

# 显示选择指南
choose_timer_solution()
```

### 性能对比测试

```python
import time
import threading
from concurrent.futures import ThreadPoolExecutor

def performance_comparison():
    """定时器性能对比测试"""
    
    def simple_task():
        """简单任务，用于性能测试"""
        time.sleep(0.001)  # 模拟1ms的工作
    
    def test_timer_performance(method_name, setup_func, iterations=100):
        """测试定时器性能"""
        print(f"\n测试 {method_name}:")
        start_time = time.time()
        
        setup_func(simple_task, iterations)
        
        end_time = time.time()
        total_time = end_time - start_time
        avg_time = total_time / iterations * 1000  # 转换为毫秒
        
        print(f"总耗时: {total_time:.4f}秒")
        print(f"平均每次: {avg_time:.4f}毫秒")
        print(f"理论QPS: {1/avg_time*1000:.2f}")
    
    # 测试不同定时器方案的性能
    def setup_threading_timer(task, iterations):
        """设置threading.Timer测试"""
        timers = []
        for i in range(iterations):
            timer = threading.Timer(0.01, task)
            timers.append(timer)
            timer.start()
        
        for timer in timers:
            timer.join()
    
    def setup_thread_pool(task, iterations):
        """设置线程池测试"""
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(task) for _ in range(iterations)]
            for future in futures:
                future.result()
    
    # 执行性能测试
    test_timer_performance("Threading.Timer", setup_threading_timer)
    test_timer_performance("ThreadPoolExecutor", setup_thread_pool)

# 执行性能对比
# performance_comparison()
```

### 生产环境最佳实践

```python
import logging
import traceback
from threading import Lock
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.events import EVENT_JOB_ERROR, EVENT_JOB_EXECUTED

class ProductionTimer:
    """生产环境定时器类"""
    
    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.job_lock = Lock()
        self.setup_logging()
        self.setup_error_handling()
    
    def setup_logging(self):
        """设置日志记录"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('timer.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def setup_error_handling(self):
        """设置错误处理"""
        def job_listener(event):
            if event.exception:
                self.logger.error(f"任务 {event.job_id} 执行失败: {event.exception}")
            else:
                self.logger.info(f"任务 {event.job_id} 执行成功")
        
        self.scheduler.add_listener(job_listener, EVENT_JOB_ERROR | EVENT_JOB_EXECUTED)
    
    def safe_task_wrapper(self, func, *args, **kwargs):
        """安全的任务包装器"""
        def wrapper():
            try:
                with self.job_lock:  # 防止并发执行
                    self.logger.info(f"开始执行任务: {func.__name__}")
                    result = func(*args, **kwargs)
                    self.logger.info(f"任务执行完成: {func.__name__}")
                    return result
            except Exception as e:
                self.logger.error(f"任务执行异常: {func.__name__}, 错误: {str(e)}")
                self.logger.error(f"异常详情: {traceback.format_exc()}")
                # 可以在这里添加告警通知逻辑
                raise
        return wrapper
    
    def add_job(self, func, trigger_type='interval', **trigger_args):
        """添加带错误处理的任务"""
        safe_func = self.safe_task_wrapper(func)
        return self.scheduler.add_job(safe_func, trigger_type, **trigger_args)
    
    def start(self):
        """启动调度器"""
        self.logger.info("生产环境定时器启动")
        self.scheduler.start()
    
    def shutdown(self):
        """关闭调度器"""
        self.logger.info("生产环境定时器关闭")
        self.scheduler.shutdown(wait=True)

# 使用示例
def demo_production_timer():
    """演示生产环境定时器使用"""
    timer = ProductionTimer()
    
    def critical_task():
        """关键业务任务"""
        # 模拟可能出现的异常
        import random
        if random.random() < 0.3:  # 30%概率出现异常
            raise Exception("模拟业务异常")
        
        print("关键任务执行成功")
        return "success"
    
    def monitoring_task():
        """监控任务"""
        print(f"系统监控: {datetime.datetime.now()}")
        monitor_system()
    
    # 添加任务
    timer.add_job(critical_task, 'interval', seconds=5, id='critical_job')
    timer.add_job(monitoring_task, 'interval', seconds=2, id='monitor_job')
    
    # 启动定时器
    timer.start()
    
    try:
        time.sleep(30)  # 运行30秒
    except KeyboardInterrupt:
        pass
    finally:
        timer.shutdown()

# 执行演示
# demo_production_timer()
```

### 常见错误处理模式

```python
def error_handling_patterns():
    """常见定时器错误处理模式"""
    
    # 1. 重试机制
    def retry_decorator(max_retries=3, delay=1):
        """重试装饰器"""
        def decorator(func):
            def wrapper(*args, **kwargs):
                for attempt in range(max_retries + 1):
                    try:
                        return func(*args, **kwargs)
                    except Exception as e:
                        if attempt == max_retries:
                            print(f"任务 {func.__name__} 重试 {max_retries} 次后仍然失败")
                            raise e
                        print(f"任务 {func.__name__} 第 {attempt + 1} 次尝试失败，{delay}秒后重试")
                        time.sleep(delay)
            return wrapper
        return decorator
    
    @retry_decorator(max_retries=2, delay=2)
    def unstable_task():
        """不稳定的任务（用于演示重试）"""
        import random
        if random.random() < 0.7:  # 70%概率失败
            raise Exception("网络连接异常")
        print("任务执行成功")
    
    # 2. 超时控制
    import signal
    from contextlib import contextmanager
    
    @contextmanager
    def timeout(seconds):
        """超时上下文管理器"""
        def signal_handler(signum, frame):
            raise TimeoutError(f"任务执行超时: {seconds}秒")
        
        # 设置信号处理器
        old_handler = signal.signal(signal.SIGALRM, signal_handler)
        signal.alarm(seconds)
        
        try:
            yield
        finally:
            signal.alarm(0)
            signal.signal(signal.SIGALRM, old_handler)
    
    def long_running_task():
        """长时间运行的任务"""
        try:
            with timeout(5):  # 5秒超时
                # 模拟长时间操作
                time.sleep(3)
                print("任务在超时前完成")
        except TimeoutError as e:
            print(f"任务执行超时: {e}")
        except Exception as e:
            print(f"任务执行异常: {e}")
    
    # 3. 资源清理
    class ResourceManager:
        """资源管理器"""
        
        def __init__(self):
            self.resources = []
        
        def acquire_resource(self, resource_name):
            """获取资源"""
            print(f"获取资源: {resource_name}")
            self.resources.append(resource_name)
            return resource_name
        
        def release_all(self):
            """释放所有资源"""
            for resource in self.resources:
                print(f"释放资源: {resource}")
            self.resources.clear()
    
    def resource_safe_task():
        """资源安全的任务"""
        manager = ResourceManager()
        try:
            # 获取资源
            db_conn = manager.acquire_resource("database_connection")
            file_handle = manager.acquire_resource("log_file")
            
            # 执行业务逻辑
            print("执行业务逻辑...")
            
            # 模拟可能的异常
            if datetime.datetime.now().second % 10 == 0:
                raise Exception("业务逻辑异常")
                
        except Exception as e:
            print(f"业务执行异常: {e}")
        finally:
            # 确保资源清理
            manager.release_all()
    
    print("错误处理模式演示:")
    print("1. 重试机制:")
    unstable_task()
    
    print("\n2. 超时控制:")
    long_running_task()
    
    print("\n3. 资源清理:")
    resource_safe_task()

# 执行错误处理演示
# error_handling_patterns()
```

## ⚠️ 注意事项

1. **资源管理**：
   - Timer 对象使用后要及时清理
   - 长时间运行的定时器要考虑内存泄漏
   - 注意线程数量的控制

2. **时间精度**：
   - sleep() 的精度受操作系统影响
   - 任务执行时间会影响下次调度时间
   - 系统负载会影响定时器精度

3. **异常处理**：
   - 定时任务中的异常要妥善处理
   - 避免异常导致整个定时器停止工作
   - 考虑任务失败后的重试机制

4. **并发控制**：
   - 注意多个定时任务间的资源竞争
   - 考虑使用锁来保护共享资源
   - 避免任务重叠执行

## 🔗 相关内容

- [时间处理模块 - time](../../stdlib/time/)
- [日期时间处理 - datetime](../../stdlib/datetime/)
- [yield - 生成器与协程](../../basics/yield/)
- [信号处理 - signal](../../stdlib/signal/)
- [任务调度框架 - APScheduler](../../thirdparty/schedule/)

## 📚 扩展阅读

- [APScheduler 官方文档](https://apscheduler.readthedocs.io/)
- [schedule 模块文档](https://schedule.readthedocs.io/)
- [Python threading 模块文档](https://docs.python.org/3/library/threading.html)
- [psutil 系统监控库](https://psutil.readthedocs.io/)

## 🏷️ 标签

`定时器` `timer` `schedule` `APScheduler` `定时任务` `循环控制` `任务调度`

---

**最后更新**: 2024-01-15  
**作者**: Python 编程指南  
**版本**: 1.0