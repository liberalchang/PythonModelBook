---
title: "Python logging 模块详解"
permalink: "/stdlib/logging/"
category: "stdlib"
tags: ["日志", "调试", "监控", "标准库"]
description: "Python标准库logging模块的完整学习指南，包含基础使用、高级配置、处理器、格式化器等核心概念和实战案例"
author: "Python教程"
date: "2024-01-15"
updated: "2024-01-15"
version: "1.0"
difficulty: "中级"
---

# Python logging 模块详解

## 概述

logging是Python内置的标准日志模块，提供了灵活且强大的日志记录功能。它支持不同级别的日志输出、多种处理器、自定义格式化器和过滤器，是构建生产级应用程序日志系统的首选工具。

## 学习目标

通过本文档的学习，你将掌握：

- logging模块的核心概念和组件
- 不同日志级别的使用场景
- 处理器(Handler)的配置和使用
- 格式化器(Formatter)的自定义
- 过滤器(Filter)的实现
- 配置文件的使用方法
- 实际项目中的最佳实践

## 前置知识

- Python基础语法
- 面向对象编程概念
- 文件操作基础
- 异常处理机制

## 详细内容

### 1. 基础使用

#### 1.1 简单示例

```python
import logging

# 基本日志输出
logging.debug('debug message')
logging.info('info message')
logging.warning('warn message')
logging.error('error message')
logging.critical('critical message')
```

**输出结果：**
```
WARNING:root:warn message
ERROR:root:error message
CRITICAL:root:critical message
```

**重要说明：**
- 默认日志级别为WARNING
- 默认格式：[日志等级]:[Logger实例名称]:[日志消息内容]
- 只有日志级别高于或等于WARNING的日志才会输出

#### 1.2 装饰器示例

```python
from functools import wraps, partial
import logging

def logged(func=None, *, level=logging.DEBUG, name=None, message=None):
    """日志装饰器，用于记录函数调用"""
    if func is None:
        return partial(logged, level=level, name=name, message=message)

    logname = name if name else func.__module__
    log = logging.getLogger(logname)
    logmsg = message if message else func.__name__
    
    @wraps(func)
    def wrapper(*args, **kwargs):
        log.log(level, logmsg)
        return func(*args, **kwargs)
    return wrapper

# 使用示例
@logged
def add(x, y):
    """加法函数"""
    return x + y

@logged(level=logging.CRITICAL, name='example')
def spam():
    """示例函数"""
    print('Spam!')
```

### 2. 核心概念

logging模块基于四个核心组件：

#### 2.1 Logger (记录器)

Logger是应用程序代码直接使用的接口，采用树形层级结构。

```python
# 创建Logger实例
logger = logging.getLogger(logger_name)

# 设置日志级别
logger.setLevel(logging.ERROR)

# 添加/删除处理器
logger.addHandler(handler_name)
logger.removeHandler(handler_name)
```

#### 2.2 Handler (处理器)

Handler将日志记录发送到指定目的地（控制台、文件、网络等）。

**常用Handler类型：**

1. **StreamHandler** - 输出到控制台
```python
ch = logging.StreamHandler()
ch.setLevel(logging.WARN)
```

2. **FileHandler** - 输出到文件
```python
fh = logging.FileHandler('app.log', mode='a', encoding='utf-8')
```

3. **RotatingFileHandler** - 循环日志文件
```python
from logging.handlers import RotatingFileHandler
rh = RotatingFileHandler('app.log', maxBytes=1024*1024, backupCount=5)
```

4. **TimedRotatingFileHandler** - 定时循环日志
```python
from logging.handlers import TimedRotatingFileHandler
th = TimedRotatingFileHandler('app.log', when='midnight', interval=1, backupCount=7)
```

#### 2.3 Formatter (格式化器)

Formatter指定日志记录的最终输出格式。

```python
# 创建格式化器
formatter = logging.Formatter(
    fmt='%(asctime)s [%(threadName)s] [%(name)s] [%(levelname)s] %(filename)s[line:%(lineno)d] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

# 应用到处理器
handler.setFormatter(formatter)
```

**常用格式化变量：**

| 格式 | 描述 |
|------|------|
| %(asctime)s | 日志时间 |
| %(name)s | Logger名称 |
| %(levelname)s | 日志级别名称 |
| %(levelno)s | 日志级别数值 |
| %(pathname)s | 完整路径名 |
| %(filename)s | 文件名 |
| %(funcName)s | 函数名 |
| %(lineno)d | 行号 |
| %(process)d | 进程ID |
| %(thread)d | 线程ID |
| %(threadName)s | 线程名称 |
| %(message)s | 日志消息 |

#### 2.4 Filter (过滤器)

Filter提供更细粒度的日志控制。

```python
# 创建过滤器
filter = logging.Filter(name='myapp')

# 自定义过滤器
class CriticalFilter(logging.Filter):
    def filter(self, record):
        return record.levelno == logging.CRITICAL

# 应用过滤器
handler.addFilter(CriticalFilter())
```

### 3. 配置方法

#### 3.1 显式配置

```python
import logging

# 创建logger
logger = logging.getLogger('example')
logger.setLevel(logging.DEBUG)

# 创建文件处理器
fh = logging.FileHandler('app.log')
fh.setLevel(logging.WARNING)

# 创建格式化器
formatter = logging.Formatter(
    '%(asctime)s [%(threadName)s] [%(name)s] [%(levelname)s] %(filename)s[line:%(lineno)d] %(message)s'
)

# 组装
fh.setFormatter(formatter)
logger.addHandler(fh)

# 使用
logger.debug('调试信息')
logger.info('普通信息')
logger.warning('警告信息')
logger.error('错误信息')
logger.critical('严重错误')
```

#### 3.2 basicConfig配置

```python
import logging

logging.basicConfig(
    filename='app.log',
    level=logging.DEBUG,
    format='%(asctime)s [%(threadName)s] [%(name)s] [%(levelname)s] %(filename)s[line:%(lineno)d] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logging.debug('调试信息')
logging.info('普通信息')
logging.warning('警告信息')
```

**basicConfig参数说明：**

| 参数 | 描述 |
|------|------|
| filename | 日志文件名 |
| filemode | 文件打开模式，默认'a' |
| format | 日志格式字符串 |
| datefmt | 日期格式 |
| level | 日志级别 |
| stream | 输出流，与filename互斥 |
| handlers | 处理器列表 |

#### 3.3 配置文件方式

**logging.conf配置文件：**
```ini
[loggers]
keys=root,fileLogger,rotatingFileLogger

[handlers]
keys=consoleHandler,fileHandler,rotatingFileHandler

[formatters]
keys=simpleFormatter

[logger_root]
level=DEBUG
handlers=consoleHandler

[logger_fileLogger]
level=DEBUG
handlers=fileHandler
qualname=fileLogger
propagate=0

[handler_consoleHandler]
class=StreamHandler
level=DEBUG
formatter=simpleFormatter
args=(sys.stdout,)

[handler_fileHandler]
class=FileHandler
level=INFO
formatter=simpleFormatter
args=('app.log', 'a')

[formatter_simpleFormatter]
format=%(asctime)s - %(name)s - %(levelname)s - %(message)s
datefmt=%Y-%m-%d %H:%M:%S
```

**使用配置文件：**
```python
import logging.config

# 加载配置文件
logging.config.fileConfig('logging.conf')

# 获取logger
logger = logging.getLogger('fileLogger')
logger.info('使用配置文件的日志')
```

### 4. 工作流程

logging模块的处理流程：

1. **级别判断** - 检查日志级别是否满足要求
2. **生成日志** - 创建LogRecord对象，处理异常和格式化
3. **过滤处理** - 应用Logger级别的过滤器
4. **查找处理器** - 在当前Logger及父Logger中查找Handler
5. **Handler过滤** - 应用Handler级别的过滤器
6. **格式化输出** - 使用Formatter格式化并输出

### 5. 最佳实践

#### 5.1 日志级别使用指南

```python
# DEBUG: 详细的诊断信息
logger.debug(f"处理用户请求: {user_id}, 参数: {params}")

# INFO: 程序正常运行的信息
logger.info(f"用户 {user_id} 登录成功")

# WARNING: 警告信息，程序仍能正常运行
logger.warning(f"用户 {user_id} 尝试访问受限资源")

# ERROR: 错误信息，程序某些功能无法正常执行
logger.error(f"数据库连接失败: {error_msg}")

# CRITICAL: 严重错误，程序可能无法继续运行
logger.critical(f"系统内存不足，服务即将停止")
```

#### 5.2 异常日志记录

```python
try:
    result = risky_operation()
except Exception as e:
    # 记录异常堆栈信息
    logger.exception("操作失败")
    # 或者
    logger.error("操作失败", exc_info=True)
```

#### 5.3 结构化日志

```python
# 使用extra参数添加结构化信息
logger.info(
    "用户操作",
    extra={
        'user_id': user.id,
        'action': 'login',
        'ip_address': request.remote_addr,
        'user_agent': request.headers.get('User-Agent')
    }
)
```

#### 5.4 性能优化

```python
# 使用延迟格式化
logger.debug("处理数据: %s", expensive_operation())  # 推荐
logger.debug(f"处理数据: {expensive_operation()}")   # 不推荐

# 条件日志记录
if logger.isEnabledFor(logging.DEBUG):
    logger.debug("详细调试信息: %s", complex_debug_info())
```

## 实际应用

### Web应用日志配置

```python
import logging
import logging.handlers
from pathlib import Path

def setup_logging(app_name, log_dir='logs', debug=False):
    """配置应用程序日志"""
    # 创建日志目录
    log_path = Path(log_dir)
    log_path.mkdir(exist_ok=True)
    
    # 根logger配置
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG if debug else logging.INFO)
    
    # 控制台处理器
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    console_handler.setFormatter(console_formatter)
    
    # 文件处理器（按日期轮转）
    file_handler = logging.handlers.TimedRotatingFileHandler(
        log_path / f'{app_name}.log',
        when='midnight',
        interval=1,
        backupCount=30,
        encoding='utf-8'
    )
    file_handler.setLevel(logging.DEBUG)
    file_formatter = logging.Formatter(
        '%(asctime)s [%(process)d] [%(threadName)s] %(name)s %(levelname)s: %(message)s'
    )
    file_handler.setFormatter(file_formatter)
    
    # 错误日志单独记录
    error_handler = logging.handlers.RotatingFileHandler(
        log_path / f'{app_name}_error.log',
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(file_formatter)
    
    # 添加处理器
    root_logger.addHandler(console_handler)
    root_logger.addHandler(file_handler)
    root_logger.addHandler(error_handler)
    
    return root_logger

# 使用示例
if __name__ == '__main__':
    logger = setup_logging('myapp', debug=True)
    
    logger.info("应用程序启动")
    logger.warning("这是一个警告")
    logger.error("这是一个错误")
```

## 注意事项

1. **避免在循环中创建Logger** - Logger应该在模块级别创建并重用
2. **合理设置日志级别** - 生产环境避免DEBUG级别日志
3. **注意日志文件大小** - 使用轮转处理器避免日志文件过大
4. **敏感信息保护** - 避免在日志中记录密码、密钥等敏感信息
5. **性能考虑** - 大量日志输出可能影响应用性能
6. **编码问题** - 确保日志文件使用正确的编码格式

## 相关内容

- [loguru模块](../../thirdparty/loguru/) - 更简单易用的第三方日志库
- [structlog模块](../../thirdparty/structlog/) - 结构化日志记录
- [picologging模块](../../thirdparty/picologging/) - 高性能日志库

## 扩展阅读

- [Python官方logging文档](https://docs.python.org/3/library/logging.html)
- [Logging HOWTO](https://docs.python.org/3/howto/logging.html)
- [Python日志最佳实践](https://docs.python-guide.org/writing/logging/)
- [12-Factor App日志原则](https://12factor.net/logs)