---
layout: doc
title: 子进程与并行 - subprocess 模块
permalink: /docs/basics/subprocess/
category: basics
tags: [subprocess, 子进程, 并行, 进程管理]
description: 深入掌握 Python subprocess 模块，使用 run 和 Popen 管理外部进程
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# 子进程与并行 - subprocess 模块

## 📝 概述

`subprocess` 模块用于在 Python 程序中创建和管理外部进程。它提供了简单易用的 `run()` 接口和更灵活的 `Popen` 类，适用于外部命令调用、管道连接、实时输出处理等场景。

## 🎯 学习目标

- 掌握 `subprocess.run()` 的基本用法与常见参数
- 熟悉使用 `Popen` 进行流控制与异步交互
- 学会管理子进程的生命周期和错误处理
- 了解进程管道、输入输出重定向的用法

## 📋 前置知识

- 操作系统命令行基础
- Python 异常处理机制
- 文件与 IO 基础

## 🔍 详细内容

### 1. subprocess.run()

`run()` 是调用外部命令的便捷接口，返回 `CompletedProcess` 对象。

```python
import subprocess

# 最简单的调用
result = subprocess.run(["echo", "hello"], capture_output=True, text=True)
print(result.stdout.strip())  # hello
```

常用参数：

- `args`: 命令及参数（列表形式更安全）
- `cwd`: 指定工作目录
- `env`: 环境变量
- `shell`: 是否通过 shell 执行（Windows 上建议 False）
- `timeout`: 超时时间（秒）
- `capture_output`: 捕获 stdout/stderr（等价于设置 `stdout=PIPE, stderr=PIPE`）
- `text`: 文本模式（自动解码为字符串）
- `check`: 为 True 时非零返回码会抛出异常

```python
# 带超时与错误检查
try:
    result = subprocess.run(
        ["ping", "-c", "1", "python.org"],
        capture_output=True,
        text=True,
        timeout=5,
        check=True
    )
    print("命令输出:\n", result.stdout)
except subprocess.CalledProcessError as e:
    print("命令失败:", e)
except subprocess.TimeoutExpired:
    print("命令超时")
```

返回对象 `CompletedProcess`：

- `args`: 执行的命令
- `returncode`: 进程返回码
- `stdout`/`stderr`: 标准输出/错误输出（需要在 run 时启用捕获）

### 2. Popen - 灵活的子进程控制

`Popen` 提供了更细粒度的控制，可进行管道连接、实时读取输出、向进程写入输入等。

```python
import subprocess

process = subprocess.Popen(
    ["ping", "-c", "3", "python.org"],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

# 实时读取输出
for line in process.stdout:
    print("输出:", line.strip())

returncode = process.wait()  # 等待子进程结束
print("返回码:", returncode)
```

#### 管道与进程链

```python
import subprocess

# 等价于: ps aux | grep python
p1 = subprocess.Popen(["ps", "aux"], stdout=subprocess.PIPE)
p2 = subprocess.Popen(["grep", "python"], stdin=p1.stdout, stdout=subprocess.PIPE, text=True)

# 关闭 p1 的 stdout 以便 p1 收到 SIGPIPE
p1.stdout.close()
output = p2.communicate()[0]
print(output)
```

#### 向子进程发送输入

```python
import subprocess

p = subprocess.Popen(["python", "-c", "print(input())"], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
output = p.communicate(input="Hello from parent\n")[0]
print(output)
```

#### 终止与超时

```python
import subprocess, time

p = subprocess.Popen(["sleep", "10"])  # 长时间任务
try:
    p.wait(timeout=2)
except subprocess.TimeoutExpired:
    print("超时，终止进程...")
    p.terminate()  # 温和终止
    try:
        p.wait(timeout=2)
    except subprocess.TimeoutExpired:
        print("强制杀死进程")
        p.kill()
```

### 3. 安全与跨平台注意事项

- 优先使用列表参数而非字符串，避免 shell 注入
- Windows 平台默认不支持某些 Unix 命令，请使用等效命令
- `shell=True` 时需格外小心输入拼接
- 长时间运行进程需正确处理 stdout/stderr，避免管道阻塞

## 💡 实际应用

### 批量执行外部命令并并发收集结果

```python
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

commands = [
    ["python", "-V"],
    ["pip", "-V"],
    ["python", "-c", "print('ok')"],
]

def run_command(cmd):
    result = subprocess.run(cmd, capture_output=True, text=True)
    return {
        'cmd': ' '.join(cmd),
        'returncode': result.returncode,
        'stdout': result.stdout.strip(),
        'stderr': result.stderr.strip(),
    }

with ThreadPoolExecutor(max_workers=3) as executor:
    futures = [executor.submit(run_command, cmd) for cmd in commands]
    for future in as_completed(futures):
        print(future.result())
```

### 监控子进程实时输出（日志型任务）

```python
import subprocess

def follow_output(cmd):
    with subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True) as p:
        for line in p.stdout:
            print("[子进程]", line.rstrip())
        return p.wait()

follow_output(["python", "-c", "import time; [print(i) or time.sleep(0.5) for i in range(5)]"])  # noqa
```

## ⚠️ 注意事项

- 尽量避免在 Windows 上使用 `shell=True`
- 使用 `timeout` 参数避免子进程失控
- 注意编码问题：使用 `text=True` 或 `encoding='utf-8'`
- 对大量输出的进程，务必消费其输出以避免阻塞

## 🔗 相关内容

- [多进程与进程池](../multiprocessing/)
- [进程间通信（IPC）](../ipc/)
- [多线程编程](../multithreading/)

## 📚 扩展阅读

- [Python 官方文档 - subprocess](https://docs.python.org/3/library/subprocess.html)

## 🏷️ 标签

`subprocess` `子进程` `Popen` `run` `并行`

---

**最后更新**: 2024-01-15  
**作者**: Python 编程指南  
**版本**: 1.0