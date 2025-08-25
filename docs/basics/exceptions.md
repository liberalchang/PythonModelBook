---
layout: doc
title: 异常处理 - try/except/else/finally 全面指南
permalink: /docs/basics/exceptions/
category: basics
tags: [异常处理, try, except, else, finally, raise, assert, 自定义异常]
description: 系统讲解 Python 异常处理的定义、常见异常类型、最佳实践与完整代码示例，帮助你编写健壮、可维护的代码。
author: Python 技术文档工程师
date: 2025-08-25
updated: 2025-08-25
version: 1.0
difficulty: "初级/中级"
---

# 异常处理 - try/except/else/finally 全面指南

## 📝 概述

异常（Exception）是程序运行过程中出现的错误状态。当出现异常且未被处理时，程序会中断并输出回溯信息（traceback）。合理的异常处理能让程序在面对错误时做出可控响应：记录日志、释放资源、回滚状态、向上抛出或降级处理。

## 🎯 学习目标

- 理解异常处理的基本概念、传播机制与栈回溯
- 掌握 try/except/else/finally 的语义与用法
- 熟悉常见内置异常类型及适用场景
- 学会编写自定义异常，并进行异常链式抛出与日志记录
- 掌握编写健壮代码的异常处理最佳实践

## 📋 前置知识

- 基本的 Python 语法与函数调用
- 文件/网络等资源的打开与关闭
- 日志记录与上下文管理（with）

## 🔍 详细内容

### 异常处理的定义与传播

- 异常是 Python 在运行时对错误条件的对象化表示（都是从 BaseException 派生的实例）。
- 当代码块抛出异常且当前帧未捕获时，异常会沿调用栈逐层向上“传播”，直到被某一层捕获，或者到达顶层导致程序终止并打印 traceback。
- 捕获异常的目标不是“吞掉错误”，而是做恰当处理：记录、清理、重试、转换为领域错误后再抛出等。

### try/except/else/finally 的语义

```python
## 基本结构示例：
try:
    # 可能抛出异常的代码
    risky_operation()
except SpecificError as e:
    # 处理具体异常
    handle(e)
except (TypeError, ValueError) as e:
    # 捕获多个异常类型
    handle_multi(e)
except Exception as e:
    # 最后兜底（不建议直接 except:）
    log_error(e)
else:
    # try 代码块未抛异常时执行（成功路径）
    on_success()
finally:
    # 无论是否异常都执行（资源清理）
    cleanup()
```

- except：从最具体到最通用依次排列；避免裸 except:，否则会拦截诸如 KeyboardInterrupt 等控制流异常。
- else：成功路径逻辑放在 else，有助于将正常流程与错误处理分离，提升可读性。
- finally：保证清理动作必定执行（关闭文件、释放锁、恢复环境变量等）。

### 常见内置异常类型与场景

- ValueError：值不合法（如 int("abc")）
- TypeError：类型不匹配（如 1 + "a"）
- KeyError/IndexError：字典键或序列索引不存在
- FileNotFoundError/PermissionError：文件不存在或权限不足
- OSError/IOError：操作系统/IO 层面的通用错误
- ZeroDivisionError：除以零
- AttributeError：对象属性不存在
- ImportError/ModuleNotFoundError：导入失败/模块不存在
- AssertionError：断言失败（用于开发期校验，不用于业务控制）
- RuntimeError/NotImplementedError：运行时错误/未实现分支
- TimeoutError：超时
- KeyboardInterrupt/SystemExit：用户中断/系统退出（通常不应拦截）

### 自定义异常

```python
## 定义层次化的自定义异常，便于精准捕获与语义表达
class AppError(Exception):
    """应用通用异常基类"""

class ConfigError(AppError):
    """配置不合法"""

class NetworkError(AppError):
    """网络相关错误"""

## 使用示例
def load_config(path: str) -> dict:
    """加载配置文件，若格式不合法则抛出 ConfigError"""
    import json, os
    if not os.path.exists(path):
        raise ConfigError(f"配置文件不存在: {path}")
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        # 转换底层异常为领域异常，保留上下文
        raise ConfigError(f"配置解析失败: {e}") from e
```

### 异常链与回溯保留

```python
## 使用 raise ... from ... 建立异常链，既保留根因回溯，又暴露更贴近业务的错误类型
try:
    connect_db()
except TimeoutError as e:
    raise NetworkError("数据库连接超时") from e
```

### 日志记录与调试

```python
## 记录异常详情与回溯，便于排查问题
import logging, traceback
logger = logging.getLogger(__name__)

try:
    do_something()
except Exception as e:
    # 打印完整回溯信息
    logger.error("执行失败: %s\n%s", e, traceback.format_exc())
    # 或使用 logger.exception 在 except 块中直接记录回溯
    # logger.exception("执行失败")
    raise  # 处理后继续向上抛出，避免静默失败
```

### 清理资源：finally 与 with

```python
## finally 确保清理
f = open('data.txt', 'w')
try:
    f.write('hello')
finally:
    f.close()  # 无论是否异常都执行

## 推荐使用 with 管理资源
with open('data.txt', 'w') as f:
    f.write('hello')  # 自动关闭文件，异常也会正确传播
```

### 多 except、分组捕获与重新抛出

```python
## 将语义相近的异常合并捕获，避免重复代码
try:
    parse_and_write()
except (ValueError, TypeError) as e:
    fix_input(e)
except OSError as e:
    recover_file(e)
except Exception:
    # 兜底只做记录，然后重新抛出
    log_unexpected()
    raise
```

### 断言 assert 的定位

```python
## 断言用于开发期不变量校验，生产环境可能被 -O 优化移除
## 不要用 assert 取代业务异常（如参数校验）
assert isinstance(port, int) and port > 0, "端口必须为正整数"
```

### asyncio 与并发中的异常

```python
## 在协程中捕获并处理，避免任务静默失败
import asyncio

async def worker(i):
    try:
        # 这里可能抛出异常
        return 10 / (i - 3)
    except ZeroDivisionError as e:
        # 针对特定异常返回降级结果
        return float('inf')

async def main():
    tasks = [asyncio.create_task(worker(i)) for i in range(6)]
    # 返回异常而不是直接失败（按需选择）
    results = await asyncio.gather(*tasks, return_exceptions=True)
    print(results)

# asyncio.run(main())
```

```python
## 超时控制
import asyncio

async def op():
    await asyncio.sleep(2)
    return 42

async def main():
    try:
        res = await asyncio.wait_for(op(), timeout=1)
    except asyncio.TimeoutError:
        res = None  # 超时降级
    print(res)

# asyncio.run(main())
```

## 💡 实际应用

### 参数校验与错误转换

```python
def get_user_age(record: dict) -> int:
    """将底层 KeyError/TypeError 转换为语义更清晰的 ValueError"""
    try:
        age = record["age"]
        if not isinstance(age, int) or age < 0:
            raise ValueError("年龄必须为非负整数")
        return age
    except KeyError as e:
        raise ValueError("缺少必需字段: age") from e
```

### 重试与降级（示意）

```python
import time

def fetch_with_retry(fetch, retries=3, delay=0.5):
    for i in range(retries):
        try:
            return fetch()
        except NetworkError as e:
            if i == retries - 1:
                raise  # 仍抛出，交由上层处理
            time.sleep(delay)  # 简单重试等待
```

## ⚠️ 最佳实践与注意事项

- 只捕获你能处理的异常：未知异常记录后向上抛出，避免静默失败。
- 从具体到通用按序捕获，减少误捕；避免裸 except:。
- 将正常路径逻辑放在 else，清理工作放在 finally 或 with 中。
- 日志记录要包含回溯（logger.exception 或 traceback.format_exc）。
- 自定义异常按层次化组织，向上抛出领域语义更清晰的异常，必要时使用异常链（raise ... from ...）。
- 不要用异常控制正常流程；也不要滥用 assert 进行业务校验。
- 注意 KeyboardInterrupt/SystemExit 等控制流异常一般不应拦截。
- 在并发与异步中，确保任务的异常不被吞掉（gather 的 return_exceptions、任务回调等）。
- 对资源进行正确的生命周期管理（with/try-finally）。
- 在公共 API 层，提供稳定的异常契约：明确抛出的异常类型与含义。

## 🔗 相关内容

- [with 语句 - 上下文管理器](../with/)
- [raise/assert - 异常抛出和断言](../raise-assert/)
- [logging - 日志记录](../../stdlib/logging/)
- [contextlib - 上下文工具](../../stdlib/contextlib/)

## 📚 扩展阅读

- Python 官方教程：Errors and Exceptions
- Python 语言参考：Exceptions

## 🏷️ 标签

`异常处理` `try` `except` `finally` `raise` `assert`

---

**最后更新**: 2025-08-25  
**作者**: Python 技术文档工程师  
**版本**: 1.0