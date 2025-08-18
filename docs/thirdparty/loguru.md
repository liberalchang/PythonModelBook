---
title: "Loguru - 简单强大的Python日志库"
permalink: "/thirdparty/loguru/"
category: "thirdparty"
tags: ["日志", "第三方库", "调试", "监控"]
description: "Loguru是一个功能强大且易于使用的Python第三方日志库，提供开箱即用的日志功能和丰富的配置选项"
author: "Python教程"
date: "2024-01-15"
updated: "2024-01-15"
version: "1.0"
difficulty: "初级"
---

# Loguru - 简单强大的Python日志库

## 概述

Loguru是一个功能强大且易于使用的Python第三方日志库，旨在简化日志记录的配置和使用。与标准库logging相比，Loguru提供了开箱即用的功能，无需复杂配置即可实现强大的日志记录功能。

## 学习目标

通过本文档的学习，你将掌握：

- Loguru的安装和基本使用
- 日志输出到文件的配置方法
- 日志轮转和压缩功能
- 异常追踪和调试功能
- 字符串格式化和结构化日志
- 与标准logging库的对比
- 实际项目中的应用场景

## 前置知识

- Python基础语法
- 基本的日志概念
- 文件操作基础
- 异常处理机制

## 详细内容

### 1. 安装和导入

```bash
# 安装Loguru
pip install loguru
```

```python
# 导入logger对象（单例模式）
from loguru import logger
```

### 2. 基础使用

#### 2.1 直接使用

```python
from loguru import logger

# 直接使用，无需配置
logger.debug("调试信息")
logger.info("普通信息")
logger.warning("警告信息")
logger.error("错误信息")
logger.critical("严重错误")
```

**输出效果：**
- 自动带有颜色区分
- 包含时间戳、日志级别、文件名和行号
- 格式清晰，易于阅读

#### 2.2 与标准logging对比

```python
# 标准logging需要配置
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Loguru开箱即用
from loguru import logger
# 直接使用，无需配置
```

### 3. 输出到文件 - add()方法

#### 3.1 基本文件输出

```python
from loguru import logger

# 添加文件输出
logger.add("app.log")

logger.info("这条日志会同时输出到控制台和文件")
```

#### 3.2 常用参数配置

```python
logger.add(
    "app.log",
    level="INFO",                    # 日志级别
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {name}:{function}:{line} - {message}",  # 格式
    filter=lambda record: "sensitive" not in record["message"],  # 过滤器
    rotation="500 MB",               # 文件轮转
    retention="10 days",             # 保留时间
    compression="zip",               # 压缩格式
    encoding="utf-8"                 # 编码格式
)
```

### 4. 日志轮转功能

#### 4.1 按时间轮转

```python
# 每天午夜创建新文件
logger.add("daily_{time}.log", rotation="00:00")

# 每周创建新文件
logger.add("weekly_{time}.log", rotation="1 week")

# 每小时创建新文件
logger.add("hourly_{time}.log", rotation="1 hour")
```

#### 4.2 按大小轮转

```python
# 超过500MB创建新文件
logger.add("size_{time}.log", rotation="500 MB")

# 超过1GB创建新文件
logger.add("large_{time}.log", rotation="1 GB")
```

#### 4.3 按条数轮转

```python
# 每1000条日志创建新文件
logger.add("count_{time}.log", rotation=1000)
```

### 5. 日志保留和压缩

#### 5.1 保留策略

```python
# 保留最近15天的日志
logger.add("app.log", retention="15 days")

# 保留最近10个日志文件
logger.add("app.log", retention=10)

# 使用timedelta对象
import datetime
logger.add("app.log", retention=datetime.timedelta(hours=5))
```

#### 5.2 压缩格式

```python
# 支持多种压缩格式
logger.add("app.log", compression="zip")     # ZIP压缩
logger.add("app.log", compression="gz")      # GZIP压缩
logger.add("app.log", compression="bz2")     # BZIP2压缩
logger.add("app.log", compression="xz")      # XZ压缩
logger.add("app.log", compression="tar.gz")  # TAR.GZ压缩
```

### 6. 字符串格式化

#### 6.1 类似str.format()的格式化

```python
# 使用位置参数
logger.info("用户 {} 登录成功", username)

# 使用关键字参数
logger.info("Python版本: {version}, 特性: {feature}", version=3.8, feature="f-strings")

# 混合使用
logger.info("处理文件 {}, 大小: {size} MB", filename, size=file_size)
```

#### 6.2 结构化日志

```python
# 使用bind()方法添加上下文
context_logger = logger.bind(user_id=12345, request_id="abc-123")
context_logger.info("用户执行操作")
context_logger.error("操作失败")

# 临时上下文
with logger.contextualize(task_id=67890):
    logger.info("任务开始")
    logger.info("任务进行中")
    logger.info("任务完成")
```

### 7. 异常追踪

#### 7.1 使用装饰器捕获异常

```python
from loguru import logger

@logger.catch
def risky_function(x, y, z):
    """可能出错的函数"""
    return 1 / (x + y + z)

# 调用函数，异常会被自动捕获和记录
risky_function(0, 0, 0)
```

#### 7.2 手动异常记录

```python
try:
    risky_operation()
except Exception as e:
    logger.exception("操作失败")
    # 或者
    logger.opt(exception=True).error("操作失败")
```

#### 7.3 详细的异常信息

Loguru提供非常详细的异常追踪信息，包括：
- 完整的调用堆栈
- 每个变量的值
- 彩色输出便于阅读
- 精确的错误位置

### 8. 高级配置

#### 8.1 自定义格式

```python
# 自定义日志格式
custom_format = (
    "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
    "<level>{level: <8}</level> | "
    "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
    "<level>{message}</level>"
)

logger.add("custom.log", format=custom_format)
```

#### 8.2 过滤器

```python
# 简单过滤器
logger.add("filtered.log", filter=lambda record: record["level"].name == "ERROR")

# 复杂过滤器函数
def my_filter(record):
    """自定义过滤器"""
    # 过滤掉包含敏感信息的日志
    if "password" in record["message"].lower():
        return False
    # 只记录特定模块的日志
    if record["name"].startswith("myapp."):
        return True
    return False

logger.add("secure.log", filter=my_filter)
```

#### 8.3 多个输出目标

```python
# 移除默认处理器
logger.remove()

# 添加控制台输出（彩色）
logger.add(
    sys.stderr,
    format="<green>{time}</green> <level>{message}</level>",
    level="INFO"
)

# 添加文件输出（详细）
logger.add(
    "detailed.log",
    format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level} | {name}:{function}:{line} | {message}",
    level="DEBUG"
)

# 添加错误日志文件
logger.add(
    "errors.log",
    format="{time} | {level} | {message}",
    level="ERROR",
    rotation="1 week"
)
```

### 9. 性能优化

#### 9.1 延迟格式化

```python
# 推荐：延迟格式化
logger.debug("处理数据: {}", expensive_operation)

# 不推荐：立即格式化
logger.debug(f"处理数据: {expensive_operation()}")
```

#### 9.2 条件日志

```python
# 使用opt()方法进行条件日志记录
if logger.level("DEBUG").no >= logger._core.min_level:
    logger.debug("详细调试信息: {}", complex_debug_info())
```

#### 9.3 异步日志

```python
# 启用异步日志记录
logger.add("async.log", enqueue=True)
```

### 10. 与其他库集成

#### 10.1 与标准logging集成

```python
import logging
from loguru import logger

# 将标准logging重定向到loguru
class InterceptHandler(logging.Handler):
    def emit(self, record):
        # 获取对应的loguru级别
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        # 查找调用者
        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )

# 配置标准logging使用loguru
logging.basicConfig(handlers=[InterceptHandler()], level=0)
```

#### 10.2 与Flask集成

```python
from flask import Flask
from loguru import logger
import sys

app = Flask(__name__)

# 移除默认处理器
logger.remove()

# 添加自定义处理器
logger.add(
    sys.stderr,
    format="{time} {level} {message}",
    level="INFO"
)

logger.add(
    "flask_app.log",
    rotation="1 day",
    retention="1 month",
    level="DEBUG"
)

@app.route('/')
def index():
    logger.info("访问首页")
    return "Hello World!"
```

## 实际应用

### 完整的应用程序日志配置

```python
from loguru import logger
import sys
from pathlib import Path

def setup_logging(app_name: str, log_dir: str = "logs", debug: bool = False):
    """配置应用程序日志"""
    # 创建日志目录
    log_path = Path(log_dir)
    log_path.mkdir(exist_ok=True)
    
    # 移除默认处理器
    logger.remove()
    
    # 控制台输出
    logger.add(
        sys.stderr,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level="DEBUG" if debug else "INFO",
        colorize=True
    )
    
    # 应用日志文件
    logger.add(
        log_path / f"{app_name}.log",
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} | {message}",
        level="DEBUG",
        rotation="00:00",      # 每天午夜轮转
        retention="30 days",   # 保留30天
        compression="zip",     # 压缩旧文件
        encoding="utf-8"
    )
    
    # 错误日志单独记录
    logger.add(
        log_path / f"{app_name}_error.log",
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} | {message}",
        level="ERROR",
        rotation="100 MB",     # 100MB轮转
        retention=10,          # 保留10个文件
        compression="gz"
    )
    
    return logger

# 使用示例
if __name__ == "__main__":
    app_logger = setup_logging("myapp", debug=True)
    
    app_logger.info("应用程序启动")
    app_logger.warning("这是一个警告")
    app_logger.error("这是一个错误")
    
    # 异常捕获示例
    @app_logger.catch
    def divide(a, b):
        return a / b
    
    divide(10, 0)  # 异常会被自动记录
```

### Web爬虫日志示例

```python
from loguru import logger
import requests
from urllib.parse import urljoin

# 配置爬虫日志
logger.add(
    "crawler_{time:YYYY-MM-DD}.log",
    format="{time} | {level} | {message}",
    rotation="00:00",
    retention="7 days",
    level="INFO"
)

class WebCrawler:
    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()
        
    @logger.catch
    def fetch_page(self, url):
        """获取网页内容"""
        full_url = urljoin(self.base_url, url)
        logger.info("开始抓取: {}", full_url)
        
        try:
            response = self.session.get(full_url, timeout=10)
            response.raise_for_status()
            
            logger.success("抓取成功: {} (状态码: {})", full_url, response.status_code)
            return response.text
            
        except requests.RequestException as e:
            logger.error("抓取失败: {} - {}", full_url, str(e))
            return None
    
    def crawl_urls(self, urls):
        """批量抓取URL"""
        logger.info("开始批量抓取，共{}个URL", len(urls))
        
        results = []
        for i, url in enumerate(urls, 1):
            with logger.contextualize(url_index=i, total_urls=len(urls)):
                content = self.fetch_page(url)
                results.append(content)
                
                if i % 10 == 0:
                    logger.info("进度: {}/{}", i, len(urls))
        
        logger.success("批量抓取完成，成功{}个", sum(1 for r in results if r is not None))
        return results

# 使用示例
if __name__ == "__main__":
    crawler = WebCrawler("https://example.com")
    urls = ["/page1", "/page2", "/page3"]
    crawler.crawl_urls(urls)
```

## 注意事项

1. **性能考虑** - 虽然Loguru性能良好，但大量日志输出仍可能影响性能
2. **文件权限** - 确保应用程序有写入日志文件的权限
3. **磁盘空间** - 合理配置日志轮转和保留策略，避免占用过多磁盘空间
4. **敏感信息** - 避免在日志中记录密码、API密钥等敏感信息
5. **编码问题** - 确保日志文件使用正确的编码格式
6. **线程安全** - Loguru是线程安全的，可以在多线程环境中安全使用

## 相关内容

- [logging模块](../../stdlib/logging/) - Python标准日志库
- [structlog模块](../structlog/) - 结构化日志记录
- [picologging模块](../picologging/) - 高性能日志库

## 扩展阅读

- [Loguru官方文档](https://loguru.readthedocs.io/)
- [Loguru GitHub仓库](https://github.com/Delgan/loguru)
- [Python日志最佳实践](https://docs.python-guide.org/writing/logging/)
- [结构化日志的优势](https://www.structlog.org/en/stable/why.html)