---
layout: doc
title: subprocess 模块 - 子进程管理和系统命令执行
permalink: /docs/stdlib/subprocess/
category: stdlib
tags: [subprocess, 子进程, 系统命令, Popen, 进程管理, shell]
description: Python subprocess 模块详解，提供子进程管理和系统命令执行的强大功能，用于替代 os.system() 和 os.popen() 等老旧模块
author: Python 文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# subprocess 模块 - 子进程管理和系统命令执行

## 📝 概述

subprocess 模块是 Python 标准库中用于创建新进程、连接输入/输出/错误管道并获取返回码的核心模块。它提供了一个统一的接口来执行系统命令和管理子进程，旨在替代一些老旧的模块和函数（如 `os.system()`、`os.popen()`、`commands` 等）。

subprocess 模块允许你生成新的进程，连接它们的输入、输出、错误管道，并且获取它们的返回码。

## 🎯 学习目标

- 掌握 subprocess 模块的基本概念和使用方法
- 学会使用不同的 subprocess 函数执行系统命令
- 理解 Popen 类的高级用法和进程管理
- 掌握进程间的输入输出重定向和管道操作
- 学会处理子进程的错误和异常情况
- 了解进程超时控制和信号处理

## 📋 前置知识

- Python 基本语法和面向对象编程
- 操作系统基础概念（进程、管道、标准输入输出）
- 命令行和 shell 基础知识
- 异常处理机制
- 文件操作和编码概念

## 🔍 详细内容

### 基本概念

subprocess 模块提供了多种方式来执行外部命令：

- **高级接口**：如 `run()`、`call()`、`check_call()`、`check_output()` 等
- **底层接口**：`Popen` 类，提供最大的灵活性
- **便利函数**：如 `getstatusoutput()`、`getoutput()` 等

### 快速入门示例

```python
import subprocess

# 基本示例
sh = "ls -la"         # shell命令
# val = os.system(sh)  # os.system只获得程序执行结果,以数字int型为返回结果，1表示执行成功
# val = os.popen(sh)   # os.popen()获得的是主函数main中输出的print
# vals = '/n'.join(val.readlines()) # 读取os.popen()的结果方法是readlines()或者read()
# (status,output) = subprocess.getstatusoutput(sh) # 获得shell命令执行后的状态status和控制台的所有输出output
# status：表示执行程序结果状态，值是0表示执行成功。
# output：就是打印到控制台一个以\n为拼接的字符串。
```

![subprocess 模块示例](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE34f17eeaa494de05e0ab98069604112e.png)

### 流式处理示例

```python
import subprocess

# 流式处理 ping 命令输出
cmd = 'ping 127.0.0.1'
proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
for line in iter(proc.stdout.readline, b''):
    print(line.decode('utf-8'))
```

## 💡 实际应用

### 1. subprocess.run() - 推荐的高级接口

**语法格式：**

```python
subprocess.run(args, *, stdin=None, input=None, stdout=None, stderr=None, 
               capture_output=False, shell=False, cwd=None, timeout=None, 
               check=False, encoding=None, errors=None, text=None, env=None, 
               universal_newlines=None)
```

**参数说明：**

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|------|
| args | str/list | 是 | 无 | 执行的命令，字符串列表格式，如果指定了shell=True可使用字符串形式 |
| stdin | file/int | 否 | None | 子进程的标准输入 |
| stdout | file/int | 否 | None | 子进程的标准输出 |
| stderr | file/int | 否 | None | 子进程的标准错误 |
| capture_output | bool | 否 | False | 是否捕获输出 |
| shell | bool | 否 | False | 是否通过操作系统的 shell 执行指定的命令 |
| cwd | str | 否 | None | 设置当前工作目录 |
| timeout | float | 否 | None | 设置命令超时时间 |
| check | bool | 否 | False | 如果为 True 且进程退出状态码不是 0，则抛出 CalledProcessError 异常 |
| encoding | str | 否 | None | 如果指定了该参数，则 stdin、stdout 和 stderr 可以接收字符串数据 |

**基础用法：**

```python
import subprocess

# 不捕获输出
result = subprocess.run(["ls", "-l"])
print(result.returncode)  # 返回状态码

# 捕获输出
result = subprocess.run(["ls", "-l"], capture_output=True, text=True)
print(result.stdout)  # 标准输出
print(result.stderr)  # 标准错误

# 使用 shell
result = subprocess.run("ls -l", shell=True, capture_output=True, text=True)
print(result.stdout)

# 检查返回码
try:
    subprocess.run("exit 1", shell=True, check=True)
except subprocess.CalledProcessError as e:
    print(f"命令执行失败: {e}")
```

**返回值：**

| 类型 | 说明 |
|------|------|
| CompletedProcess | 包含 args、returncode、stdout、stderr 等属性的实例 |

### 2. subprocess.Popen() - 底层灵活接口

**语法格式：**

```python
class subprocess.Popen(args, bufsize=-1, executable=None, stdin=None, stdout=None, 
                       stderr=None, preexec_fn=None, close_fds=True, shell=False, 
                       cwd=None, env=None, universal_newlines=False, startupinfo=None, 
                       creationflags=0, restore_signals=True, start_new_session=False, 
                       pass_fds=(), *, encoding=None, errors=None)
```

Popen 是 subprocess 的核心，子进程的创建和管理都靠它处理。此模块的底层的进程创建与管理由 Popen 类处理。它提供了很大的灵活性，因此开发者能够处理未被便利函数覆盖的不常见用例。

**参数说明：**

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| bufsize | int | -1 | 缓冲区大小。0：不使用缓冲区；1：行缓冲；正数：缓冲区大小；负数：系统默认 |
| stdin/stdout/stderr | file/int | None | 子进程的标准输入、输出和错误句柄 |
| shell | bool | False | 是否使用shell作为要执行的程序 |
| cwd | str | None | 子进程的当前工作目录 |
| env | dict | None | 子进程的环境变量 |
| universal_newlines | bool | False | 是否以文本模式打开文件对象 |

![Popen 类使用示例](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE26eb102a9fe8737c57328e6f91721f58.png)

**基础用法：**

```python
import subprocess

# 基本用法
p = subprocess.Popen("dir", shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)  
(stdoutput, erroutput) = p.communicate()
print(stdoutput.decode())
```

#### Popen 类的实例方法

| 方法 | 作用 | 备注 |
|------|------|------|
| poll() | 检查进程是否终止，如果终止返回 returncode，否则返回 None | 退出码由poll和wait设定，一个 None 值表示此进程仍未结束 |
| wait(timeout) | 等待子进程终止 | 当 stdout=PIPE 或者 stderr=PIPE 并且子进程产生了足以阻塞 OS 管道缓冲区接收更多数据的输出到管道时，将会发生死锁。当使用管道时用 Popen.communicate() 来规避它 |
| communicate(input,timeout) | 和子进程交互，发送和读取数据 | 1. 可选的 input 参数应当未被传输给子进程的数据，如果没有数据应被传输给子进程则为 None。如果流以文本模式打开， input 必须为字符串。否则，它必须为字节。2. communicate() 返回一个 (stdout_data, stderr_data) 元组 |
| kill() | 杀死子进程。发送 SIGKILL 信号到子进程 | 如果超时到期，子进程不会被杀死，所以为了正确清理一个行为良好的应用程序应该杀死子进程并完成通讯 |

**高级用法示例：**

```python
import subprocess

# 示例1：基本进程管理
p = subprocess.Popen('ls -l', shell=True)
print(f"进程ID: {p.pid}")
p.wait()  # 等待进程结束
print(f"返回码: {p.returncode}")

# 示例2：交互式进程
obj = subprocess.Popen(["python"], stdin=subprocess.PIPE, 
                       stdout=subprocess.PIPE, stderr=subprocess.PIPE)
obj.stdin.write(b'print(1)\n')
obj.stdin.write(b'print(2)\n')
obj.stdin.write(b'print(3)\n')
obj.stdin.close()
out, err = obj.communicate()
print(out.decode())

# 示例3：使用 communicate 发送输入
obj = subprocess.Popen(["python"], stdin=subprocess.PIPE, 
                       stdout=subprocess.PIPE, stderr=subprocess.PIPE)
out, err = obj.communicate(input=b'print("Hello World")\n')
print(out.decode())

# 示例4：管道操作 - 实现 df -Th | grep data
p1 = subprocess.Popen(['df', '-Th'], stdout=subprocess.PIPE)
p2 = subprocess.Popen(['grep', 'data'], stdin=p1.stdout, stdout=subprocess.PIPE)
p1.stdout.close()  # 允许p1在p2退出时接收SIGPIPE
out, err = p2.communicate()
print(out.decode())
```

### 3. 便利函数集合

#### subprocess.getstatusoutput(cmd)

```python
# 获取命令执行状态和输出
import subprocess

# 成功执行
retcode, output = subprocess.getstatusoutput('ls -l')
print(f"返回码: {retcode}")
print(f"输出: {output}")

# 执行失败
retcode, output = subprocess.getstatusoutput('ls -l /nonexistent')
print(f"返回码: {retcode}")
print(f"错误输出: {output}")
```

#### subprocess.getoutput(cmd)

```python
# 只获取命令输出，忽略状态码
import subprocess

output = subprocess.getoutput('ls -l')
print(output)
```

#### subprocess.call()

```python
# 执行命令并返回状态码
import subprocess

# 基本用法
returncode = subprocess.call(['ls', '-l'])
print(f"返回码: {returncode}")

# 使用 shell
returncode = subprocess.call('ls -l', shell=True)
print(f"返回码: {returncode}")

# 重定向输出
returncode = subprocess.call(['ls', '-l'], stdout=subprocess.DEVNULL)
print(f"返回码: {returncode}")
```

#### subprocess.check_call()

```python
# 执行命令，如果失败则抛出异常
import subprocess

try:
    subprocess.check_call(['ls', '-l'])
    print("命令执行成功")
except subprocess.CalledProcessError as e:
    print(f"命令执行失败: {e}")

# 失败示例
try:
    subprocess.check_call('ls -l /nonexistent', shell=True)
except subprocess.CalledProcessError as e:
    print(f"命令执行失败，返回码: {e.returncode}")
```

#### subprocess.check_output()

```python
# 执行命令并返回输出，如果失败则抛出异常
import subprocess

try:
    # 获取字节输出
    output = subprocess.check_output(['ls', '-l'])
    print(output.decode())
    
    # 获取文本输出
    output = subprocess.check_output(['ls', '-l'], universal_newlines=True)
    print(output)
    
except subprocess.CalledProcessError as e:
    print(f"命令执行失败: {e}")
```

### 实际案例

#### 案例1：执行系统命令并处理输出

```python
import subprocess
import sys

def run_command(cmd, shell=True, capture_output=True):
    """执行系统命令的通用函数"""
    try:
        result = subprocess.run(
            cmd, 
            shell=shell, 
            capture_output=capture_output, 
            text=True, 
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"命令执行失败: {e}", file=sys.stderr)
        print(f"错误输出: {e.stderr}", file=sys.stderr)
        return None

# 使用示例
if sys.platform == "win32":
    output = run_command("dir")
else:
    output = run_command("ls -la")

if output:
    print(output)
```

#### 案例2：实时监控命令输出

```python
import subprocess
import sys

def monitor_command(cmd):
    """实时监控命令输出"""
    process = subprocess.Popen(
        cmd,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True,
        bufsize=1
    )
    
    try:
        for line in process.stdout:
            print(f"[OUTPUT] {line.rstrip()}")
        
        process.wait()
        if process.returncode != 0:
            print(f"命令执行失败，返回码: {process.returncode}")
    except KeyboardInterrupt:
        process.terminate()
        print("命令被用户中断")

# 使用示例（监控 ping 命令）
if sys.platform == "win32":
    monitor_command("ping -n 4 127.0.0.1")
else:
    monitor_command("ping -c 4 127.0.0.1")
```

#### 案例3：批量文件处理

```python
import subprocess
import os
from pathlib import Path

def batch_process_files(directory, pattern="*.txt"):
    """批量处理文件的示例"""
    directory = Path(directory)
    
    if not directory.exists():
        print(f"目录不存在: {directory}")
        return
    
    # 查找匹配的文件
    try:
        if os.name == 'nt':  # Windows
            result = subprocess.run(
                f'dir /B "{directory}\\{pattern}"',
                shell=True,
                capture_output=True,
                text=True,
                cwd=directory
            )
        else:  # Unix/Linux
            result = subprocess.run(
                f'ls {pattern}',
                shell=True,
                capture_output=True,
                text=True,
                cwd=directory
            )
        
        if result.returncode == 0:
            files = result.stdout.strip().split('\n')
            print(f"找到 {len(files)} 个文件:")
            for file in files:
                if file.strip():
                    print(f"  - {file}")
        else:
            print("未找到匹配的文件")
            
    except Exception as e:
        print(f"搜索文件时出错: {e}")

# 使用示例
batch_process_files(".", "*.py")
```

## ⚠️ 注意事项

### 安全注意事项

- **避免 shell 注入**：当使用 `shell=True` 时，确保输入已经过验证和清理
- **参数验证**：对用户输入的命令参数进行严格验证
- **权限控制**：注意子进程的权限不应超过父进程

```python
# 不安全的做法
user_input = input("输入命令: ")
subprocess.run(user_input, shell=True)  # 可能导致命令注入

# 安全的做法
allowed_commands = ['ls', 'pwd', 'date']
cmd = input("选择命令 (ls/pwd/date): ")
if cmd in allowed_commands:
    subprocess.run([cmd])
else:
    print("不允许的命令")
```

### 性能和资源管理

- **及时关闭资源**：使用完毕后关闭文件句柄和进程
- **避免僵尸进程**：确保调用 `wait()` 或 `poll()` 来收集子进程
- **内存控制**：对于大量输出，避免使用 `communicate()`，改用流式处理

```python
# 正确的资源管理
import subprocess
import contextlib

@contextlib.contextmanager
def managed_process(*args, **kwargs):
    process = subprocess.Popen(*args, **kwargs)
    try:
        yield process
    finally:
        process.terminate()
        process.wait()

# 使用示例
with managed_process(['long-running-command'], stdout=subprocess.PIPE) as proc:
    for line in proc.stdout:
        process_line(line)
```

### 平台兼容性

- **路径分隔符**：使用 `os.path.join()` 或 `pathlib` 处理路径
- **命令差异**：Windows 和 Unix/Linux 的命令可能不同
- **编码问题**：注意不同平台的默认编码

```python
import subprocess
import sys
import os

def cross_platform_ls(directory="."):
    """跨平台的目录列表命令"""
    if sys.platform == "win32":
        cmd = ["dir", "/B", directory]
        # Windows 默认使用 GBK 编码
        result = subprocess.run(cmd, shell=True, capture_output=True, encoding='gbk')
    else:
        cmd = ["ls", "-1", directory]
        result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        return result.stdout.strip().split('\n')
    else:
        return []
```

### 版本选择建议

根据 Python 版本选择合适的函数：

1. **Python 3.5+**：推荐使用 `subprocess.run()`
2. **Python 2.7-3.4**：使用 `subprocess.call()`、`subprocess.check_call()` 或 `subprocess.check_output()`
3. **复杂需求**：使用 `subprocess.Popen` 类
4. **简单命令**：可以使用 `subprocess.getoutput()` 或 `subprocess.getstatusoutput()`

## 🔗 相关内容

- [os 模块 - 操作系统接口](../os/)
- [shutil 模块 - 高级文件操作](../shutil/)
- [sys 模块 - 系统参数和函数](../sys/)
- [io 模块 - 文本与二进制I/O](../io/)

## 📚 扩展阅读

- [Python subprocess 官方文档](https://docs.python.org/3/library/subprocess.html)
- [subprocess 安全指南](https://docs.python.org/3/library/subprocess.html#security-considerations)
- [进程管理最佳实践](https://docs.python.org/3/library/subprocess.html#popen-constructor)

## 🏷️ 标签

`subprocess` `子进程` `系统命令` `Popen` `进程管理` `shell`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档团队  
**版本**: 1.0