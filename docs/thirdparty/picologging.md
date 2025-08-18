---
title: "Picologging - 高性能日志记录库"
permalink: "/thirdparty/picologging/"
category: "thirdparty"
tags: ["日志", "第三方库", "高性能", "优化", "兼容"]
description: "Picologging是一个高性能的Python日志库，与标准logging完全兼容，性能提升5-10倍"
author: "Python教程"
date: "2024-01-15"
updated: "2024-01-15"
version: "1.0"
difficulty: "中级"
---

# Picologging - 高性能日志记录库

## 概述

Picologging是一个高性能的Python日志库，作为标准logging模块的直接替代品。它在保持100%API兼容性的同时，通过C扩展和优化算法实现了5-10倍的性能提升，特别适合高并发、大量日志输出的应用场景。

## 学习目标

通过本文档的学习，你将掌握：

- Picologging的性能优势和适用场景
- 安装和基本使用方法
- 与标准logging的兼容性
- 性能优化技巧和最佳实践
- 在不同环境下的部署策略
- 实际项目中的应用案例
- 性能测试和监控方法

## 前置知识

- Python基础语法
- 标准logging库的使用
- 基本的性能优化概念
- 多线程和异步编程基础

## 详细内容

### 1. 为什么选择Picologging？

#### 1.1 性能优势

- **5-10倍性能提升** - 相比标准logging库显著提升
- **低内存占用** - 优化的内存管理减少GC压力
- **高并发支持** - 更好的多线程性能
- **快速格式化** - 优化的字符串格式化算法
- **智能过滤** - 高效的日志级别过滤机制

#### 1.2 兼容性保证

```python
# 标准logging代码
import logging
logger = logging.getLogger(__name__)
logger.info("Hello World")

# 直接替换为picologging
import picologging as logging  # 只需要改这一行
logger = logging.getLogger(__name__)
logger.info("Hello World")  # 其他代码完全不变
```

### 2. 安装和基本使用

#### 2.1 安装

```bash
# 使用pip安装
pip install picologging

# 或者从源码安装
git clone https://github.com/microsoft/picologging.git
cd picologging
pip install .
```

#### 2.2 基本使用

```python
# 方式1：直接替换import
import picologging as logging

# 方式2：显式导入
from picologging import getLogger, basicConfig, INFO, DEBUG

# 基本配置
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)

# 获取logger
logger = logging.getLogger(__name__)

# 记录日志
logger.debug("调试信息")
logger.info("应用启动")
logger.warning("警告信息")
logger.error("错误信息")
logger.critical("严重错误")

# 格式化日志
user_id = 12345
action = "login"
logger.info("用户操作: %s (ID: %d)", action, user_id)
logger.info(f"用户操作: {action} (ID: {user_id})")
```

#### 2.3 配置示例

```python
import picologging as logging
from picologging.handlers import RotatingFileHandler, TimedRotatingFileHandler
import sys

def setup_logging(app_name: str, debug: bool = False):
    """配置高性能日志系统"""
    
    # 设置日志级别
    level = logging.DEBUG if debug else logging.INFO
    
    # 创建格式化器
    formatter = logging.Formatter(
        fmt='%(asctime)s [%(levelname)8s] %(name)s: %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # 控制台处理器
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    console_handler.setFormatter(formatter)
    
    # 文件处理器 - 按大小轮转
    file_handler = RotatingFileHandler(
        filename=f'{app_name}.log',
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5,
        encoding='utf-8'
    )
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)
    
    # 错误日志处理器 - 按时间轮转
    error_handler = TimedRotatingFileHandler(
        filename=f'{app_name}_error.log',
        when='midnight',
        interval=1,
        backupCount=30,
        encoding='utf-8'
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(formatter)
    
    # 配置根logger
    logging.basicConfig(
        level=level,
        handlers=[console_handler, file_handler, error_handler]
    )
    
    return logging.getLogger(app_name)

# 使用示例
logger = setup_logging("myapp", debug=True)
logger.info("应用启动完成")
```

### 3. 性能优化特性

#### 3.1 延迟格式化

```python
import picologging as logging
import time

logger = logging.getLogger(__name__)

def expensive_operation():
    """模拟耗时操作"""
    time.sleep(0.1)
    return "expensive result"

# 不推荐：总是执行耗时操作
logger.debug(f"结果: {expensive_operation()}")

# 推荐：使用延迟格式化
logger.debug("结果: %s", expensive_operation())  # 只在DEBUG级别启用时执行

# 更好的方式：检查日志级别
if logger.isEnabledFor(logging.DEBUG):
    result = expensive_operation()
    logger.debug("结果: %s", result)
```

#### 3.2 批量日志处理

```python
import picologging as logging
from picologging.handlers import QueueHandler, QueueListener
from queue import Queue
import threading

# 创建队列和处理器
log_queue = Queue()
queue_handler = QueueHandler(log_queue)

# 创建实际的日志处理器
file_handler = logging.FileHandler('batch.log')
file_handler.setFormatter(
    logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
)

# 创建队列监听器
queue_listener = QueueListener(log_queue, file_handler)
queue_listener.start()

# 配置logger使用队列处理器
logger = logging.getLogger('batch_logger')
logger.addHandler(queue_handler)
logger.setLevel(logging.INFO)

# 高频日志记录
def worker(worker_id):
    """工作线程"""
    for i in range(1000):
        logger.info("Worker %d processing item %d", worker_id, i)

# 启动多个工作线程
threads = []
for i in range(5):
    t = threading.Thread(target=worker, args=(i,))
    t.start()
    threads.append(t)

# 等待所有线程完成
for t in threads:
    t.join()

# 停止队列监听器
queue_listener.stop()
```

#### 3.3 条件日志记录

```python
import picologging as logging

logger = logging.getLogger(__name__)

class ConditionalLogger:
    """条件日志记录器"""
    
    def __init__(self, logger, sample_rate=0.1):
        self.logger = logger
        self.sample_rate = sample_rate
        self.counter = 0
    
    def sample_log(self, level, msg, *args, **kwargs):
        """采样日志记录"""
        self.counter += 1
        if self.counter % int(1 / self.sample_rate) == 0:
            getattr(self.logger, level)(msg, *args, **kwargs)
    
    def rate_limited_log(self, level, msg, *args, max_per_second=10, **kwargs):
        """限流日志记录"""
        import time
        
        current_time = time.time()
        if not hasattr(self, '_last_log_time'):
            self._last_log_time = current_time
            self._log_count = 0
        
        # 重置计数器（每秒）
        if current_time - self._last_log_time >= 1.0:
            self._last_log_time = current_time
            self._log_count = 0
        
        # 检查是否超过限制
        if self._log_count < max_per_second:
            self._log_count += 1
            getattr(self.logger, level)(msg, *args, **kwargs)

# 使用示例
conditional_logger = ConditionalLogger(logger, sample_rate=0.01)  # 1%采样率

# 高频操作，只记录1%的日志
for i in range(10000):
    conditional_logger.sample_log('info', "处理项目 %d", i)

# 限流日志记录
for i in range(100):
    conditional_logger.rate_limited_log('warning', "警告信息 %d", i, max_per_second=5)
```

### 4. 实际应用场景

#### 4.1 微服务日志系统

```python
import picologging as logging
from picologging.handlers import SysLogHandler, HTTPHandler
import json
import time
import uuid
from typing import Dict, Any

class MicroserviceLogger:
    """微服务日志系统"""
    
    def __init__(self, service_name: str, version: str, environment: str):
        self.service_name = service_name
        self.version = version
        self.environment = environment
        self.logger = self._setup_logger()
    
    def _setup_logger(self):
        """设置logger"""
        logger = logging.getLogger(self.service_name)
        logger.setLevel(logging.INFO)
        
        # JSON格式化器
        class JSONFormatter(logging.Formatter):
            def format(self, record):
                log_entry = {
                    'timestamp': time.time(),
                    'level': record.levelname,
                    'service': self.service_name,
                    'version': self.version,
                    'environment': self.environment,
                    'message': record.getMessage(),
                    'module': record.module,
                    'function': record.funcName,
                    'line': record.lineno
                }
                
                # 添加异常信息
                if record.exc_info:
                    log_entry['exception'] = self.formatException(record.exc_info)
                
                # 添加自定义字段
                if hasattr(record, 'extra_fields'):
                    log_entry.update(record.extra_fields)
                
                return json.dumps(log_entry, ensure_ascii=False)
        
        # 控制台处理器
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(JSONFormatter())
        logger.addHandler(console_handler)
        
        # 文件处理器
        file_handler = logging.FileHandler(f'{self.service_name}.log')
        file_handler.setFormatter(JSONFormatter())
        logger.addHandler(file_handler)
        
        return logger
    
    def log_request(self, request_id: str, method: str, path: str, 
                   status_code: int, duration_ms: float, **kwargs):
        """记录请求日志"""
        extra_fields = {
            'request_id': request_id,
            'method': method,
            'path': path,
            'status_code': status_code,
            'duration_ms': duration_ms,
            'type': 'request',
            **kwargs
        }
        
        # 创建LogRecord并添加额外字段
        record = self.logger.makeRecord(
            self.logger.name, logging.INFO, __file__, 0,
            f"{method} {path} - {status_code} ({duration_ms}ms)",
            (), None
        )
        record.extra_fields = extra_fields
        
        self.logger.handle(record)
    
    def log_business_event(self, event_type: str, event_data: Dict[str, Any], 
                          user_id: str = None, **kwargs):
        """记录业务事件"""
        extra_fields = {
            'event_type': event_type,
            'event_data': event_data,
            'user_id': user_id,
            'type': 'business_event',
            **kwargs
        }
        
        record = self.logger.makeRecord(
            self.logger.name, logging.INFO, __file__, 0,
            f"Business event: {event_type}",
            (), None
        )
        record.extra_fields = extra_fields
        
        self.logger.handle(record)
    
    def log_error(self, error: Exception, context: Dict[str, Any] = None, **kwargs):
        """记录错误日志"""
        extra_fields = {
            'error_type': type(error).__name__,
            'error_message': str(error),
            'context': context or {},
            'type': 'error',
            **kwargs
        }
        
        record = self.logger.makeRecord(
            self.logger.name, logging.ERROR, __file__, 0,
            f"Error occurred: {error}",
            (), (type(error), error, error.__traceback__)
        )
        record.extra_fields = extra_fields
        
        self.logger.handle(record)

# 使用示例
service_logger = MicroserviceLogger(
    service_name="user-service",
    version="1.2.3",
    environment="production"
)

# 记录请求日志
request_id = str(uuid.uuid4())
service_logger.log_request(
    request_id=request_id,
    method="POST",
    path="/api/users",
    status_code=201,
    duration_ms=45.6,
    user_agent="Mozilla/5.0",
    ip_address="192.168.1.100"
)

# 记录业务事件
service_logger.log_business_event(
    event_type="user_created",
    event_data={"user_id": 12345, "email": "user@example.com"},
    user_id="12345",
    request_id=request_id
)

# 记录错误
try:
    # 模拟错误
    raise ValueError("Invalid user data")
except Exception as e:
    service_logger.log_error(
        error=e,
        context={"user_data": {"email": "invalid-email"}},
        request_id=request_id
    )
```

#### 4.2 高并发Web应用

```python
import picologging as logging
from picologging.handlers import QueueHandler, QueueListener
from queue import Queue
import asyncio
import aiohttp
from aiohttp import web
import time
import threading

# 设置异步日志系统
log_queue = Queue(maxsize=10000)  # 限制队列大小防止内存溢出
queue_handler = QueueHandler(log_queue)

# 文件处理器
file_handler = logging.FileHandler('webapp.log')
file_handler.setFormatter(
    logging.Formatter('%(asctime)s [%(levelname)s] %(name)s: %(message)s')
)

# 启动队列监听器
queue_listener = QueueListener(log_queue, file_handler, respect_handler_level=True)
queue_listener.start()

# 配置应用logger
app_logger = logging.getLogger('webapp')
app_logger.addHandler(queue_handler)
app_logger.setLevel(logging.INFO)

class PerformanceLogger:
    """性能日志记录器"""
    
    def __init__(self, logger):
        self.logger = logger
        self.request_count = 0
        self.total_duration = 0
        self.last_report = time.time()
    
    def log_request(self, method: str, path: str, status: int, duration: float):
        """记录请求性能"""
        self.request_count += 1
        self.total_duration += duration
        
        # 每1000个请求或每60秒报告一次性能统计
        current_time = time.time()
        if (self.request_count % 1000 == 0 or 
            current_time - self.last_report >= 60):
            
            avg_duration = self.total_duration / self.request_count
            rps = self.request_count / (current_time - self.last_report + 0.001)
            
            self.logger.info(
                "性能统计 - 请求数: %d, 平均响应时间: %.2fms, RPS: %.1f",
                self.request_count, avg_duration * 1000, rps
            )
            
            # 重置统计
            self.request_count = 0
            self.total_duration = 0
            self.last_report = current_time
        
        # 记录慢请求
        if duration > 1.0:  # 超过1秒的请求
            self.logger.warning(
                "慢请求 - %s %s - %d (%.2fms)",
                method, path, status, duration * 1000
            )

perf_logger = PerformanceLogger(app_logger)

# 中间件
async def logging_middleware(request, handler):
    """日志中间件"""
    start_time = time.time()
    
    try:
        response = await handler(request)
        duration = time.time() - start_time
        
        # 记录成功请求
        perf_logger.log_request(
            request.method, request.path, response.status, duration
        )
        
        return response
        
    except Exception as e:
        duration = time.time() - start_time
        
        # 记录异常请求
        app_logger.error(
            "请求异常 - %s %s - %s (%.2fms)",
            request.method, request.path, str(e), duration * 1000
        )
        
        perf_logger.log_request(
            request.method, request.path, 500, duration
        )
        
        raise

# 路由处理器
async def hello_handler(request):
    """示例处理器"""
    name = request.query.get('name', 'World')
    
    # 模拟一些处理时间
    await asyncio.sleep(0.01)
    
    app_logger.info("处理hello请求", extra={'name': name})
    
    return web.json_response({'message': f'Hello, {name}!'})

async def heavy_handler(request):
    """重负载处理器"""
    # 模拟重负载操作
    await asyncio.sleep(0.5)
    
    app_logger.info("完成重负载操作")
    
    return web.json_response({'status': 'completed'})

# 创建应用
app = web.Application(middlewares=[logging_middleware])
app.router.add_get('/hello', hello_handler)
app.router.add_post('/heavy', heavy_handler)

# 启动应用
if __name__ == '__main__':
    app_logger.info("启动Web应用")
    
    try:
        web.run_app(app, host='localhost', port=8080)
    finally:
        app_logger.info("关闭Web应用")
        queue_listener.stop()
```

#### 4.3 数据处理管道

```python
import picologging as logging
from picologging.handlers import RotatingFileHandler
import multiprocessing as mp
import time
import random
from typing import List, Dict, Any
import json

# 配置多进程安全的日志系统
def setup_worker_logging(worker_id: int):
    """为工作进程设置日志"""
    logger = logging.getLogger(f'worker_{worker_id}')
    logger.setLevel(logging.INFO)
    
    # 每个进程使用独立的日志文件
    handler = RotatingFileHandler(
        f'worker_{worker_id}.log',
        maxBytes=5*1024*1024,  # 5MB
        backupCount=3
    )
    
    formatter = logging.Formatter(
        '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    
    return logger

class DataProcessor:
    """数据处理器"""
    
    def __init__(self, worker_id: int):
        self.worker_id = worker_id
        self.logger = setup_worker_logging(worker_id)
        self.processed_count = 0
        self.error_count = 0
        self.start_time = time.time()
    
    def process_batch(self, batch: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """处理数据批次"""
        batch_id = f"batch_{int(time.time())}_{self.worker_id}"
        
        self.logger.info(
            "开始处理批次 - ID: %s, 大小: %d",
            batch_id, len(batch)
        )
        
        results = []
        batch_start = time.time()
        
        for i, item in enumerate(batch):
            try:
                # 模拟数据处理
                processed_item = self._process_item(item)
                results.append(processed_item)
                self.processed_count += 1
                
                # 每处理100个项目记录一次进度
                if (i + 1) % 100 == 0:
                    self.logger.debug(
                        "批次进度 - %s: %d/%d (%.1f%%)",
                        batch_id, i + 1, len(batch), (i + 1) / len(batch) * 100
                    )
                
            except Exception as e:
                self.error_count += 1
                self.logger.error(
                    "处理项目失败 - 批次: %s, 项目: %d, 错误: %s",
                    batch_id, i, str(e)
                )
        
        batch_duration = time.time() - batch_start
        
        self.logger.info(
            "批次处理完成 - ID: %s, 成功: %d, 失败: %d, 耗时: %.2fs",
            batch_id, len(results), len(batch) - len(results), batch_duration
        )
        
        # 记录性能统计
        self._log_performance_stats()
        
        return results
    
    def _process_item(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """处理单个数据项"""
        # 模拟处理时间
        time.sleep(random.uniform(0.001, 0.01))
        
        # 模拟处理错误
        if random.random() < 0.05:  # 5%错误率
            raise ValueError(f"处理失败: {item.get('id', 'unknown')}")
        
        # 模拟数据转换
        return {
            'id': item['id'],
            'processed_value': item['value'] * 2,
            'timestamp': time.time(),
            'worker_id': self.worker_id
        }
    
    def _log_performance_stats(self):
        """记录性能统计"""
        current_time = time.time()
        total_duration = current_time - self.start_time
        
        if total_duration > 0:
            processing_rate = self.processed_count / total_duration
            error_rate = self.error_count / (self.processed_count + self.error_count) if (self.processed_count + self.error_count) > 0 else 0
            
            self.logger.info(
                "性能统计 - 处理速度: %.1f items/s, 错误率: %.2f%%, 总处理: %d, 总错误: %d",
                processing_rate, error_rate * 100, self.processed_count, self.error_count
            )

def worker_process(worker_id: int, input_queue: mp.Queue, output_queue: mp.Queue):
    """工作进程函数"""
    processor = DataProcessor(worker_id)
    
    while True:
        try:
            batch = input_queue.get(timeout=5)
            if batch is None:  # 结束信号
                break
            
            results = processor.process_batch(batch)
            output_queue.put(results)
            
        except Exception as e:
            processor.logger.exception("工作进程异常: %s", str(e))

def main():
    """主函数"""
    # 设置主进程日志
    main_logger = logging.getLogger('main')
    main_logger.setLevel(logging.INFO)
    
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(name)s: %(message)s')
    handler.setFormatter(formatter)
    main_logger.addHandler(handler)
    
    # 创建队列
    input_queue = mp.Queue(maxsize=100)
    output_queue = mp.Queue()
    
    # 启动工作进程
    num_workers = mp.cpu_count()
    workers = []
    
    main_logger.info("启动 %d 个工作进程", num_workers)
    
    for i in range(num_workers):
        worker = mp.Process(
            target=worker_process,
            args=(i, input_queue, output_queue)
        )
        worker.start()
        workers.append(worker)
    
    # 生成测试数据
    total_items = 10000
    batch_size = 100
    
    main_logger.info("开始处理 %d 个数据项，批次大小: %d", total_items, batch_size)
    
    # 发送数据批次
    for i in range(0, total_items, batch_size):
        batch = [
            {'id': j, 'value': random.randint(1, 100)}
            for j in range(i, min(i + batch_size, total_items))
        ]
        input_queue.put(batch)
    
    # 发送结束信号
    for _ in range(num_workers):
        input_queue.put(None)
    
    # 收集结果
    all_results = []
    processed_batches = 0
    expected_batches = (total_items + batch_size - 1) // batch_size
    
    while processed_batches < expected_batches:
        try:
            results = output_queue.get(timeout=10)
            all_results.extend(results)
            processed_batches += 1
            
            if processed_batches % 10 == 0:
                main_logger.info(
                    "已处理批次: %d/%d (%.1f%%)",
                    processed_batches, expected_batches,
                    processed_batches / expected_batches * 100
                )
        except:
            main_logger.warning("等待结果超时")
            break
    
    # 等待所有工作进程结束
    for worker in workers:
        worker.join(timeout=5)
        if worker.is_alive():
            main_logger.warning("强制终止工作进程 %d", worker.pid)
            worker.terminate()
    
    main_logger.info(
        "数据处理完成 - 输入: %d, 输出: %d, 成功率: %.2f%%",
        total_items, len(all_results), len(all_results) / total_items * 100
    )

if __name__ == '__main__':
    main()
```

### 5. 性能测试和监控

#### 5.1 性能基准测试

```python
import picologging as logging
import logging as stdlib_logging
import time
import threading
from concurrent.futures import ThreadPoolExecutor
import statistics

def benchmark_logging_performance():
    """日志性能基准测试"""
    
    # 测试配置
    num_threads = 10
    logs_per_thread = 10000
    total_logs = num_threads * logs_per_thread
    
    def setup_picologging():
        """设置picologging"""
        logger = logging.getLogger('pico_test')
        logger.setLevel(logging.INFO)
        handler = logging.FileHandler('pico_test.log')
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger
    
    def setup_stdlib_logging():
        """设置标准logging"""
        logger = stdlib_logging.getLogger('stdlib_test')
        logger.setLevel(stdlib_logging.INFO)
        handler = stdlib_logging.FileHandler('stdlib_test.log')
        formatter = stdlib_logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger
    
    def log_worker(logger, thread_id, num_logs):
        """日志工作函数"""
        start_time = time.time()
        
        for i in range(num_logs):
            logger.info("Thread %d - Log message %d with some data: %s", 
                       thread_id, i, "sample_data" * 10)
        
        return time.time() - start_time
    
    def run_benchmark(logger_setup_func, test_name):
        """运行基准测试"""
        print(f"\n开始 {test_name} 性能测试...")
        
        logger = logger_setup_func()
        
        # 预热
        for i in range(100):
            logger.info("Warmup message %d", i)
        
        # 开始测试
        start_time = time.time()
        
        with ThreadPoolExecutor(max_workers=num_threads) as executor:
            futures = [
                executor.submit(log_worker, logger, i, logs_per_thread)
                for i in range(num_threads)
            ]
            
            thread_times = [future.result() for future in futures]
        
        total_time = time.time() - start_time
        
        # 计算统计信息
        avg_thread_time = statistics.mean(thread_times)
        max_thread_time = max(thread_times)
        min_thread_time = min(thread_times)
        logs_per_second = total_logs / total_time
        
        print(f"{test_name} 结果:")
        print(f"  总时间: {total_time:.2f}s")
        print(f"  平均线程时间: {avg_thread_time:.2f}s")
        print(f"  最大线程时间: {max_thread_time:.2f}s")
        print(f"  最小线程时间: {min_thread_time:.2f}s")
        print(f"  日志/秒: {logs_per_second:.0f}")
        print(f"  总日志数: {total_logs}")
        
        return {
            'total_time': total_time,
            'logs_per_second': logs_per_second,
            'avg_thread_time': avg_thread_time
        }
    
    # 运行测试
    pico_results = run_benchmark(setup_picologging, "Picologging")
    stdlib_results = run_benchmark(setup_stdlib_logging, "标准Logging")
    
    # 比较结果
    speedup = stdlib_results['logs_per_second'] / pico_results['logs_per_second']
    time_improvement = (stdlib_results['total_time'] - pico_results['total_time']) / stdlib_results['total_time'] * 100
    
    print(f"\n性能对比:")
    print(f"  Picologging 相对标准库提升: {speedup:.2f}x")
    print(f"  时间节省: {time_improvement:.1f}%")

if __name__ == '__main__':
    benchmark_logging_performance()
```

#### 5.2 实时性能监控

```python
import picologging as logging
import time
import threading
import psutil
import gc
from collections import deque
from typing import Dict, List

class LoggingPerformanceMonitor:
    """日志性能监控器"""
    
    def __init__(self, monitor_interval: float = 5.0):
        self.monitor_interval = monitor_interval
        self.logger = logging.getLogger('perf_monitor')
        self.logger.setLevel(logging.INFO)
        
        # 性能指标
        self.log_counts = deque(maxlen=100)  # 最近100个时间窗口的日志数量
        self.response_times = deque(maxlen=1000)  # 最近1000次日志操作的响应时间
        self.memory_usage = deque(maxlen=100)  # 内存使用情况
        self.cpu_usage = deque(maxlen=100)  # CPU使用情况
        
        self.current_log_count = 0
        self.last_monitor_time = time.time()
        
        # 启动监控线程
        self.monitor_thread = threading.Thread(target=self._monitor_loop, daemon=True)
        self.monitor_thread.start()
    
    def record_log_operation(self, operation_time: float):
        """记录日志操作"""
        self.current_log_count += 1
        self.response_times.append(operation_time)
    
    def _monitor_loop(self):
        """监控循环"""
        while True:
            try:
                current_time = time.time()
                
                # 计算日志速率
                time_diff = current_time - self.last_monitor_time
                log_rate = self.current_log_count / time_diff if time_diff > 0 else 0
                self.log_counts.append(log_rate)
                
                # 获取系统资源使用情况
                process = psutil.Process()
                memory_percent = process.memory_percent()
                cpu_percent = process.cpu_percent()
                
                self.memory_usage.append(memory_percent)
                self.cpu_usage.append(cpu_percent)
                
                # 计算响应时间统计
                if self.response_times:
                    avg_response_time = sum(self.response_times) / len(self.response_times)
                    max_response_time = max(self.response_times)
                    min_response_time = min(self.response_times)
                else:
                    avg_response_time = max_response_time = min_response_time = 0
                
                # 记录性能指标
                self.logger.info(
                    "性能监控 - 日志速率: %.1f/s, 内存: %.1f%%, CPU: %.1f%%, "
                    "响应时间 avg/max/min: %.3f/%.3f/%.3fms",
                    log_rate, memory_percent, cpu_percent,
                    avg_response_time * 1000, max_response_time * 1000, min_response_time * 1000
                )
                
                # 检查性能警告
                self._check_performance_warnings(log_rate, memory_percent, cpu_percent, avg_response_time)
                
                # 重置计数器
                self.current_log_count = 0
                self.last_monitor_time = current_time
                
                time.sleep(self.monitor_interval)
                
            except Exception as e:
                self.logger.error("监控异常: %s", str(e))
                time.sleep(self.monitor_interval)
    
    def _check_performance_warnings(self, log_rate: float, memory_percent: float, 
                                   cpu_percent: float, avg_response_time: float):
        """检查性能警告"""
        # 日志速率过低警告
        if log_rate < 100 and len(self.log_counts) > 5:
            recent_avg = sum(list(self.log_counts)[-5:]) / 5
            if recent_avg < 100:
                self.logger.warning("日志速率较低: %.1f/s (最近5分钟平均: %.1f/s)", log_rate, recent_avg)
        
        # 内存使用过高警告
        if memory_percent > 80:
            self.logger.warning("内存使用过高: %.1f%%", memory_percent)
        
        # CPU使用过高警告
        if cpu_percent > 80:
            self.logger.warning("CPU使用过高: %.1f%%", cpu_percent)
        
        # 响应时间过长警告
        if avg_response_time > 0.01:  # 10ms
            self.logger.warning("日志响应时间过长: %.3fms", avg_response_time * 1000)
    
    def get_performance_summary(self) -> Dict:
        """获取性能摘要"""
        if not self.log_counts:
            return {}
        
        return {
            'avg_log_rate': sum(self.log_counts) / len(self.log_counts),
            'max_log_rate': max(self.log_counts),
            'min_log_rate': min(self.log_counts),
            'avg_memory_usage': sum(self.memory_usage) / len(self.memory_usage) if self.memory_usage else 0,
            'avg_cpu_usage': sum(self.cpu_usage) / len(self.cpu_usage) if self.cpu_usage else 0,
            'avg_response_time': sum(self.response_times) / len(self.response_times) if self.response_times else 0,
        }

# 使用示例
monitor = LoggingPerformanceMonitor(monitor_interval=3.0)

# 模拟高频日志记录
def simulate_logging():
    """模拟日志记录"""
    logger = logging.getLogger('test_app')
    logger.setLevel(logging.INFO)
    
    handler = logging.FileHandler('test_app.log')
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    
    for i in range(10000):
        start_time = time.time()
        
        logger.info("测试日志消息 %d - 包含一些数据: %s", i, "data" * 20)
        
        operation_time = time.time() - start_time
        monitor.record_log_operation(operation_time)
        
        # 模拟不同的负载
        if i % 1000 == 0:
            time.sleep(0.1)  # 模拟偶尔的延迟
        elif i % 100 == 0:
            time.sleep(0.01)  # 模拟小延迟
    
    # 输出性能摘要
    summary = monitor.get_performance_summary()
    print("\n性能摘要:")
    for key, value in summary.items():
        if 'time' in key:
            print(f"  {key}: {value*1000:.3f}ms")
        elif 'rate' in key:
            print(f"  {key}: {value:.1f}/s")
        else:
            print(f"  {key}: {value:.2f}")

if __name__ == '__main__':
    simulate_logging()
```

## 最佳实践

### 1. 部署建议

- **渐进式迁移** - 先在非关键模块测试，逐步扩展
- **性能监控** - 部署后持续监控性能指标
- **回退计划** - 准备快速回退到标准logging的方案
- **版本锁定** - 在生产环境中锁定picologging版本

### 2. 配置优化

- **合理设置日志级别** - 避免过多的DEBUG日志
- **使用异步处理** - 对于高频日志使用队列处理
- **文件轮转** - 合理配置日志文件大小和保留策略
- **格式化优化** - 避免复杂的格式化操作

### 3. 监控和维护

- **性能指标** - 监控日志吞吐量和响应时间
- **资源使用** - 关注内存和CPU使用情况
- **错误率** - 监控日志记录失败率
- **存储空间** - 监控日志文件大小和磁盘使用

## 注意事项

1. **兼容性** - 虽然API兼容，但某些边缘情况可能有差异
2. **依赖管理** - 需要C编译环境，在某些环境下可能安装困难
3. **内存使用** - 高频日志可能导致内存使用增加
4. **调试困难** - C扩展部分的错误较难调试
5. **版本更新** - 新版本可能引入不兼容的变化
6. **平台支持** - 某些平台可能不支持C扩展

## 相关内容

- [logging模块](/stdlib/logging/) - Python标准日志库
- [loguru模块](../loguru/) - 简单易用的日志库
- [structlog模块](../structlog/) - 结构化日志库

## 扩展阅读

- [Picologging官方文档](https://github.com/microsoft/picologging)
- [Picologging性能基准](https://github.com/microsoft/picologging#benchmarks)
- [Python日志最佳实践](https://docs.python.org/3/howto/logging.html)
- [高性能Python编程](https://www.oreilly.com/library/view/high-performance-python/9781449361747/)
- [微软技术博客 - Picologging](https://devblogs.microsoft.com/python/)