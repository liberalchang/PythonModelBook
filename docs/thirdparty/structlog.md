---
title: "Structlog - 结构化日志记录库"
permalink: "/thirdparty/structlog/"
category: "thirdparty"
tags: ["日志", "第三方库", "结构化", "监控", "分析"]
description: "Structlog是一个强大的Python结构化日志库，将日志数据以键值对形式存储，便于机器解析和分析"
author: "Python教程"
date: "2024-01-15"
updated: "2024-01-15"
version: "1.0"
difficulty: "中级"
---

# Structlog - 结构化日志记录库

## 概述

Structlog是一个强大的Python日志库，它鼓励使用结构化日志记录。相比传统的基于字符串的日志，结构化日志将数据以键值对的形式存储，更易于机器解析和分析，对于现代应用程序的监控、分析和调试至关重要。

## 学习目标

通过本文档的学习，你将掌握：

- 结构化日志的概念和优势
- Structlog的安装和基本使用
- 处理器(Processor)的配置和自定义
- 与标准logging库的集成
- JSON格式日志输出
- 实际项目中的应用场景
- 性能优化和最佳实践

## 前置知识

- Python基础语法
- 标准logging库的基本概念
- JSON数据格式
- 面向对象编程

## 详细内容

### 1. 为什么选择Structlog？

#### 1.1 结构化日志的优势

- **机器可读** - 键值对格式便于程序解析
- **易于搜索** - 可以按特定字段进行查询和过滤
- **便于分析** - 支持日志聚合和统计分析
- **标准化** - 统一的数据结构便于工具集成
- **可扩展** - 容易添加新的上下文信息

#### 1.2 与传统日志的对比

```python
# 传统字符串日志
logger.info("User john.doe logged in from 127.0.0.1")

# 结构化日志
logger.info("User logged in", user="john.doe", ip="127.0.0.1")
```

### 2. 安装和基本使用

#### 2.1 安装

```bash
pip install structlog
```

#### 2.2 基本示例

```python
import structlog
import logging

# 配置标准logging
logging.basicConfig(level=logging.INFO)

# 获取structlog的logger
log = structlog.get_logger()

# 记录结构化日志
log.info("用户登录", user="john.doe", ip="127.0.0.1")
log.warning("输入无效", field="username", reason="too short")
log.error("数据库连接失败", error="Connection refused", retry_count=3)

# 记录复杂数据
log.debug("数值数据", data=[1, 2, 3], count=10)
log.debug("字典数据", data={"a": 1, "b": 2}, count=10)
```

### 3. 配置Structlog

#### 3.1 基本配置

```python
import structlog
import logging
import sys

# 配置标准logging
logging.basicConfig(level=logging.INFO)

# 配置structlog
structlog.configure(
    processors=[
        structlog.stdlib.add_logger_name,      # 添加logger名称
        structlog.stdlib.add_log_level,        # 添加日志级别
        structlog.stdlib.ProcessorFormatter.wrap_for_formatter,  # 格式化包装
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),    # Logger工厂
    wrapper_class=structlog.stdlib.BoundLogger,         # 包装类
    cache_logger_on_first_use=True,                     # 缓存logger
)

# 配置输出格式
formatter = logging.Formatter(
    fmt="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

# 配置处理器
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(formatter)
logging.getLogger().addHandler(handler)

# 使用
log = structlog.get_logger()
log.info("用户登录", user="john.doe", ip="127.0.0.1")
```

#### 3.2 JSON输出配置

```python
import structlog
import logging
import sys

# 配置标准logging
logging.basicConfig(level=logging.INFO)

# 配置structlog输出JSON
structlog.configure(
    processors=[
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),  # 添加ISO格式时间戳
        structlog.processors.JSONRenderer(),          # JSON渲染器
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

# 配置输出到控制台
handler = logging.StreamHandler(sys.stdout)
logging.getLogger().addHandler(handler)

# 使用
log = structlog.get_logger()
log.info("用户登录", user="john.doe", ip="127.0.0.1")
log.error("数据库连接失败", error="Connection refused", retry_count=3)
```

**输出示例：**
```json
{"event": "用户登录", "level": "info", "logger": "__main__", "timestamp": "2024-01-15T10:30:45.123456", "user": "john.doe", "ip": "127.0.0.1"}
```

### 4. 处理器(Processors)

#### 4.1 常用内置处理器

```python
import structlog

# 常用处理器列表
processors = [
    # 标准库集成
    structlog.stdlib.add_logger_name,        # 添加logger名称
    structlog.stdlib.add_log_level,          # 添加日志级别
    
    # 时间戳处理器
    structlog.processors.TimeStamper(fmt="iso"),           # ISO格式时间
    structlog.processors.TimeStamper(fmt="%Y-%m-%d %H:%M:%S"),  # 自定义格式
    
    # 调用信息
    structlog.processors.StackInfoRenderer(),  # 堆栈信息
    structlog.processors.CallsiteParameterAdder(),  # 调用位置信息
    
    # 渲染器
    structlog.processors.JSONRenderer(),       # JSON输出
    structlog.dev.ConsoleRenderer(),          # 开发友好的控制台输出
    structlog.processors.KeyValueRenderer(),   # 键值对输出
    
    # 标准库包装
    structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
]
```

#### 4.2 自定义处理器

```python
def uppercase_level(logger, method_name, event_dict):
    """将日志级别转换为大写"""
    event_dict["level"] = event_dict["level"].upper()
    return event_dict

def add_request_id(logger, method_name, event_dict):
    """添加请求ID"""
    # 从某个地方获取请求ID（如Flask的g对象）
    request_id = getattr(g, 'request_id', None)
    if request_id:
        event_dict["request_id"] = request_id
    return event_dict

def filter_sensitive_data(logger, method_name, event_dict):
    """过滤敏感数据"""
    sensitive_keys = ['password', 'token', 'secret']
    for key in sensitive_keys:
        if key in event_dict:
            event_dict[key] = "[FILTERED]"
    return event_dict

# 使用自定义处理器
structlog.configure(
    processors=[
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        uppercase_level,              # 自定义处理器
        add_request_id,              # 自定义处理器
        filter_sensitive_data,       # 自定义处理器
        structlog.processors.JSONRenderer(),
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)
```

### 5. 上下文绑定

#### 5.1 绑定上下文信息

```python
import structlog

log = structlog.get_logger()

# 绑定用户上下文
user_log = log.bind(user_id=12345, username="john.doe")
user_log.info("用户执行操作", action="login")
user_log.info("用户执行操作", action="logout")

# 绑定请求上下文
request_log = log.bind(request_id="abc-123", method="POST", path="/api/users")
request_log.info("请求开始")
request_log.info("请求处理中", step="validation")
request_log.info("请求完成", status_code=200)
```

#### 5.2 临时上下文

```python
# 使用上下文管理器
with log.contextualize(task_id=67890, worker="worker-1"):
    log.info("任务开始")
    log.info("任务进行中", progress=50)
    log.info("任务完成", result="success")

# 嵌套上下文
with log.contextualize(batch_id="batch-001"):
    with log.contextualize(item_id="item-123"):
        log.info("处理项目")
```

### 6. 与标准logging集成

#### 6.1 完整集成示例

```python
import structlog
import logging
import logging.handlers
from pathlib import Path

def setup_logging(app_name: str, log_dir: str = "logs", debug: bool = False):
    """配置结构化日志"""
    # 创建日志目录
    log_path = Path(log_dir)
    log_path.mkdir(exist_ok=True)
    
    # 配置标准logging
    logging.basicConfig(
        level=logging.DEBUG if debug else logging.INFO,
        handlers=[
            # 控制台处理器
            logging.StreamHandler(),
            # 文件处理器
            logging.handlers.RotatingFileHandler(
                log_path / f"{app_name}.log",
                maxBytes=10*1024*1024,  # 10MB
                backupCount=5
            ),
            # JSON日志文件
            logging.handlers.TimedRotatingFileHandler(
                log_path / f"{app_name}_structured.log",
                when="midnight",
                interval=1,
                backupCount=30
            )
        ]
    )
    
    # 配置structlog
    structlog.configure(
        processors=[
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )
    
    return structlog.get_logger(app_name)

# 使用示例
logger = setup_logging("myapp", debug=True)
logger.info("应用启动", version="1.0.0", environment="production")
```

### 7. 实际应用场景

#### 7.1 Web API日志记录

```python
import structlog
from flask import Flask, request, g
import uuid
import time

app = Flask(__name__)
logger = structlog.get_logger("api")

@app.before_request
def before_request():
    """请求前处理"""
    g.request_id = str(uuid.uuid4())
    g.start_time = time.time()
    
    # 绑定请求上下文
    g.logger = logger.bind(
        request_id=g.request_id,
        method=request.method,
        path=request.path,
        remote_addr=request.remote_addr,
        user_agent=request.headers.get('User-Agent', '')
    )
    
    g.logger.info("请求开始")

@app.after_request
def after_request(response):
    """请求后处理"""
    duration = time.time() - g.start_time
    
    g.logger.info(
        "请求完成",
        status_code=response.status_code,
        duration_ms=round(duration * 1000, 2),
        content_length=response.content_length
    )
    
    return response

@app.route('/users/<int:user_id>')
def get_user(user_id):
    """获取用户信息"""
    user_logger = g.logger.bind(user_id=user_id)
    
    try:
        user_logger.info("查询用户信息")
        
        # 模拟数据库查询
        if user_id == 999:
            user_logger.error("用户不存在")
            return {"error": "User not found"}, 404
        
        user_data = {"id": user_id, "name": f"User {user_id}"}
        user_logger.info("用户信息查询成功", user_data=user_data)
        
        return user_data
        
    except Exception as e:
        user_logger.exception("查询用户信息失败")
        return {"error": "Internal server error"}, 500
```

#### 7.2 数据处理管道

```python
import structlog
from typing import List, Dict, Any
import time

logger = structlog.get_logger("pipeline")

class DataProcessor:
    def __init__(self, pipeline_id: str):
        self.pipeline_id = pipeline_id
        self.logger = logger.bind(pipeline_id=pipeline_id)
    
    def process_batch(self, batch_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """处理数据批次"""
        batch_id = f"batch_{int(time.time())}"
        batch_logger = self.logger.bind(
            batch_id=batch_id,
            batch_size=len(batch_data)
        )
        
        batch_logger.info("开始处理批次")
        
        results = []
        errors = 0
        
        for i, item in enumerate(batch_data):
            item_logger = batch_logger.bind(
                item_index=i,
                item_id=item.get('id', 'unknown')
            )
            
            try:
                item_logger.debug("处理项目", item_data=item)
                
                # 模拟处理逻辑
                processed_item = self._process_item(item)
                
                item_logger.debug("项目处理成功", result=processed_item)
                results.append(processed_item)
                
            except Exception as e:
                errors += 1
                item_logger.exception("项目处理失败", error=str(e))
        
        batch_logger.info(
            "批次处理完成",
            success_count=len(results),
            error_count=errors,
            success_rate=len(results) / len(batch_data) if batch_data else 0
        )
        
        return results
    
    def _process_item(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """处理单个项目"""
        # 模拟处理逻辑
        if item.get('value', 0) < 0:
            raise ValueError("Value cannot be negative")
        
        return {
            'id': item['id'],
            'processed_value': item['value'] * 2,
            'timestamp': time.time()
        }

# 使用示例
processor = DataProcessor("data_pipeline_001")

test_data = [
    {'id': 1, 'value': 10},
    {'id': 2, 'value': 20},
    {'id': 3, 'value': -5},  # 这个会出错
    {'id': 4, 'value': 30},
]

results = processor.process_batch(test_data)
```

#### 7.3 微服务间调用追踪

```python
import structlog
import requests
import uuid
from typing import Optional

logger = structlog.get_logger("service")

class ServiceClient:
    def __init__(self, service_name: str, base_url: str):
        self.service_name = service_name
        self.base_url = base_url
        self.logger = logger.bind(service=service_name)
    
    def call_service(self, endpoint: str, method: str = "GET", 
                    data: Optional[dict] = None, 
                    trace_id: Optional[str] = None) -> dict:
        """调用其他服务"""
        if not trace_id:
            trace_id = str(uuid.uuid4())
        
        call_logger = self.logger.bind(
            trace_id=trace_id,
            endpoint=endpoint,
            method=method,
            target_service=self.service_name
        )
        
        url = f"{self.base_url}{endpoint}"
        headers = {
            'X-Trace-ID': trace_id,
            'Content-Type': 'application/json'
        }
        
        call_logger.info("开始服务调用", url=url, headers=headers)
        
        try:
            start_time = time.time()
            
            if method.upper() == "POST":
                response = requests.post(url, json=data, headers=headers, timeout=30)
            else:
                response = requests.get(url, headers=headers, timeout=30)
            
            duration = time.time() - start_time
            
            call_logger.info(
                "服务调用完成",
                status_code=response.status_code,
                duration_ms=round(duration * 1000, 2),
                response_size=len(response.content)
            )
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.Timeout:
            call_logger.error("服务调用超时")
            raise
        except requests.exceptions.RequestException as e:
            call_logger.error("服务调用失败", error=str(e))
            raise
        except Exception as e:
            call_logger.exception("服务调用异常")
            raise

# 使用示例
user_service = ServiceClient("user-service", "http://user-service:8080")
order_service = ServiceClient("order-service", "http://order-service:8080")

# 模拟服务调用链
trace_id = str(uuid.uuid4())

try:
    # 获取用户信息
    user_data = user_service.call_service("/users/123", trace_id=trace_id)
    
    # 获取用户订单
    orders = order_service.call_service(
        "/orders", 
        method="POST", 
        data={"user_id": 123}, 
        trace_id=trace_id
    )
    
    logger.info(
        "业务流程完成",
        trace_id=trace_id,
        user_id=user_data.get('id'),
        order_count=len(orders)
    )
    
except Exception as e:
    logger.exception("业务流程失败", trace_id=trace_id)
```

### 8. 性能优化

#### 8.1 延迟处理

```python
# 使用延迟处理避免不必要的计算
def expensive_operation():
    """耗时操作"""
    time.sleep(1)
    return "expensive result"

# 不推荐：总是执行耗时操作
logger.debug("结果", result=expensive_operation())

# 推荐：只在需要时执行
if logger.isEnabledFor(logging.DEBUG):
    logger.debug("结果", result=expensive_operation())

# 或者使用lambda延迟执行
logger.debug("结果", result=lambda: expensive_operation())
```

#### 8.2 批量处理

```python
import structlog
from queue import Queue
import threading
import time

class BatchLogger:
    def __init__(self, batch_size: int = 100, flush_interval: float = 5.0):
        self.batch_size = batch_size
        self.flush_interval = flush_interval
        self.queue = Queue()
        self.logger = structlog.get_logger("batch")
        
        # 启动后台线程处理批量日志
        self.worker_thread = threading.Thread(target=self._worker, daemon=True)
        self.worker_thread.start()
    
    def log(self, level: str, event: str, **kwargs):
        """添加日志到批次"""
        log_entry = {
            'level': level,
            'event': event,
            'timestamp': time.time(),
            **kwargs
        }
        self.queue.put(log_entry)
    
    def _worker(self):
        """后台工作线程"""
        batch = []
        last_flush = time.time()
        
        while True:
            try:
                # 等待新的日志条目
                entry = self.queue.get(timeout=1.0)
                batch.append(entry)
                
                # 检查是否需要刷新
                now = time.time()
                if (len(batch) >= self.batch_size or 
                    now - last_flush >= self.flush_interval):
                    self._flush_batch(batch)
                    batch = []
                    last_flush = now
                    
            except:
                # 超时或其他异常，刷新当前批次
                if batch:
                    self._flush_batch(batch)
                    batch = []
                    last_flush = time.time()
    
    def _flush_batch(self, batch):
        """刷新批次到日志"""
        self.logger.info(
            "批量日志",
            batch_size=len(batch),
            entries=batch
        )

# 使用示例
batch_logger = BatchLogger(batch_size=50, flush_interval=3.0)

for i in range(200):
    batch_logger.log("info", "处理项目", item_id=i, status="success")
    time.sleep(0.1)
```

## 注意事项

1. **性能影响** - 结构化日志处理比简单字符串日志稍慢，在高频场景下需要注意
2. **内存使用** - 大量的键值对数据可能增加内存使用
3. **序列化成本** - JSON序列化有一定的CPU开销
4. **字段命名** - 保持字段命名的一致性，便于后续分析
5. **敏感数据** - 注意过滤敏感信息，避免泄露
6. **存储空间** - 结构化日志通常比文本日志占用更多存储空间

## 相关内容

- [logging模块](../../stdlib/logging/) - Python标准日志库
- [loguru模块](../loguru/) - 简单易用的日志库
- [picologging模块](../picologging/) - 高性能日志库

## 扩展阅读

- [Structlog官方文档](https://www.structlog.org/)
- [Structlog GitHub仓库](https://github.com/hynek/structlog)
- [结构化日志最佳实践](https://www.structlog.org/en/stable/why.html)
- [ELK Stack日志分析](https://www.elastic.co/what-is/elk-stack)
- [OpenTelemetry日志规范](https://opentelemetry.io/docs/reference/specification/logs/)