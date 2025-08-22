---
layout: doc
title: 在 asyncio 中调用外部进程（子进程）
permalink: /docs/basics/asyncio-subprocess/
category: basics
tags: [asyncio, subprocess, 进程, 管道, 超时]
description: 使用 asyncio 的子进程 API 异步创建与管理外部命令，安全读写管道并正确处理超时与清理。
author: Python 编程指南
date: 2024-08-20
updated: 2024-08-20
version: 1.0
difficulty: "中级"
---

# 在 asyncio 中调用外部进程（子进程）

## 📝 概述

当你的 Python 应用需要复用现有的命令行工具或其他语言实现的程序（如 C++/Go/Rust），可以通过 asyncio 的子进程 API 将它们无缝集成到异步系统中。

- 两种创建方式：asyncio.create_subprocess_exec 与 asyncio.create_subprocess_shell
- 管道读写：重定向 stdout/stderr 到 PIPE 进行处理
- 避免死锁：优先使用 Process.communicate()
- 超时与清理：wait_for 只取消等待，不会杀死真实进程，需要显式 terminate/kill

## 📋 前置知识

- 熟悉基本命令行与外部程序调用
- 了解同步版 subprocess 模块的基本概念
- 会使用 asyncio 的事件循环、协程与任务

## 1. 创建子进程：exec 与 shell 的区别

- create_subprocess_exec：直接执行可执行文件，安全、可移植性更佳，优先推荐。
- create_subprocess_shell：通过系统 shell（bash/zsh/cmd）执行，只有在确实需要 shell 特性（如重定向、管道、通配符展开）时再使用。

```python
# 跨平台示例：根据平台选择命令（Windows 用 dir，类 Unix 用 ls）
# 代码注释使用中文，逻辑简洁易懂
import sys
import asyncio
from asyncio.subprocess import Process

async def main():
    # 根据平台选择命令
    cmd = ["cmd", "/c", "dir"] if sys.platform == "win32" else ["ls", "-l"]
    # 创建子进程（推荐使用 exec 版本）
    process: Process = await asyncio.create_subprocess_exec(*cmd)
    print(f"子进程 PID: {process.pid}")
    # 等待进程结束并获取返回码
    code = await process.wait()
    print(f"返回码: {code}")

asyncio.run(main())
```

注意：wait() 会阻塞当前任务直到进程退出；如果担心卡住，需要配合超时与清理，见后文。

## 2. 读取标准输出与标准错误（避免混淆）

当你需要处理子进程的输出，而不是让其直接打印到当前进程的 stdout/stderr 时，可以把它们重定向到 PIPE。

```python
# 将 stdout 重定向到管道，结束后一次性读取
import sys
import asyncio
from asyncio.subprocess import Process, PIPE
from asyncio.streams import StreamReader

async def main():
    cmd = ["cmd", "/c", "dir"] if sys.platform == "win32" else ["ls", "-la"]
    process: Process = await asyncio.create_subprocess_exec(*cmd, stdout=PIPE)
    print(f"子进程 PID: {process.pid}")
    # 等待进程结束
    await process.wait()
    # 读取标准输出（需要等进程结束，否则 read 会阻塞）
    stdout: StreamReader = process.stdout
    data = await stdout.read()
    print(data.decode("utf-8", errors="ignore")[:200])  # 仅演示前 200 个字符

asyncio.run(main())
```

## 3. 避免管道缓冲区死锁：使用 communicate()

如果子进程产生大量输出，直接 await wait() 可能导致缓冲区被写满而相互阻塞。更稳妥的做法是使用 Process.communicate()，它会并发地读取 stdout/stderr 并在进程结束后一次性返回。

```python
# 使用 communicate() 同时读取 stdout/stderr，避免死锁
import sys
import asyncio
from asyncio.subprocess import Process, PIPE

async def main():
    # 示例：调用一个会输出大量数据的程序
    process: Process = await asyncio.create_subprocess_exec(
        sys.executable, "-c",
        # Python 一行脚本：输出很多行
        "import sys; [sys.stdout.write('x'*100+'\n') for _ in range(10000)]; sys.stdout.flush()",
        stdout=PIPE, stderr=PIPE,
    )
    # communicate 会阻塞直到进程结束，并返回 (stdout, stderr)
    stdout, stderr = await process.communicate()
    print(f"返回码: {process.returncode}")
    print(f"输出长度: {len(stdout)} 字节, 错误长度: {len(stderr)} 字节")

asyncio.run(main())
```

## 4. 正确处理超时与清理

asyncio.wait_for 只会取消等待协程本身，不会杀死真实子进程。因此需要在超时后显式终止进程，并再次等待其退出。

```python
# 为子进程执行设置总超时，超时后优雅终止，再必要时强制杀死
import sys
import asyncio
from asyncio.subprocess import Process, PIPE

async def run_with_timeout(cmd, timeout: float = 3.0):
    process: Process = await asyncio.create_subprocess_exec(*cmd, stdout=PIPE, stderr=PIPE)
    try:
        # 对等待进程结束设置超时
        await asyncio.wait_for(process.wait(), timeout=timeout)
    except asyncio.TimeoutError:
        print("超时：尝试终止子进程……")
        # 先尝试优雅终止（Windows 下等价于 TerminateProcess）
        process.terminate()
        try:
            await asyncio.wait_for(process.wait(), timeout=1.0)
        except asyncio.TimeoutError:
            print("终止失败，强制杀死……")
            process.kill()
            await process.wait()
    # 此时进程一定已退出，可以安全地读取输出
    stdout, stderr = await process.communicate()
    return process.returncode, stdout, stderr

async def main():
    # 一个会卡住的示例：sleep 10
    cmd = [sys.executable, "-c", "import time; time.sleep(10); print('done')"]
    code, out, err = await run_with_timeout(cmd, timeout=2.0)
    print("返回码:", code)
    print("输出:", out.decode("utf-8", errors="ignore"))

asyncio.run(main())
```

实践建议：
- 读取大量输出时，优先使用 communicate()；
- 需要实时处理输出时，循环 read(n)/readline() 但要避免仅仅 wait() 导致的死锁；
- 任何超时策略都必须负责“杀干净”子进程，避免孤儿进程。

## 5. 实时读取输出（逐行/分块）

当你需要边运行边处理输出（例如持续打印日志、动态进度），可以实时读取 stdout/stderr。注意：
- 子进程应以非缓冲模式输出（加 -u 参数或每次 print 使用 flush=True）
- 同时消费 stdout 与 stderr，避免任一管道阻塞导致死锁

方式 A：逐行读取（推荐处理文本日志）

```python
# 逐行实时读取子进程输出
import sys
import asyncio
from asyncio.subprocess import PIPE

SCRIPT = (
    "import sys, time\n"
    "for i in range(5):\n"
    "    print(f'line {i}', flush=True)\n"
    "    time.sleep(0.5)\n"
)

async def main():
    # -u 让 Python 子进程的标准流无缓冲，便于实时输出
    process = await asyncio.create_subprocess_exec(
        sys.executable, "-u", "-c", SCRIPT, stdout=PIPE, stderr=PIPE
    )

    async def read_stream(stream, name):
        while True:
            line = await stream.readline()  # 逐行读取
            if not line:
                break
            print(f"[{name}] {line.decode('utf-8', 'ignore').rstrip()}")

    # 并发读取 stdout/stderr，避免堵塞
    t_out = asyncio.create_task(read_stream(process.stdout, "STDOUT"))
    t_err = asyncio.create_task(read_stream(process.stderr, "STDERR"))

    code = await process.wait()
    await asyncio.gather(t_out, t_err)
    print("返回码:", code)

asyncio.run(main())
```

方式 B：分块读取（推荐处理二进制或大块数据流）

```python
# 分块读取，适用于二进制流或不要求按行处理的场景
import sys
import asyncio
from asyncio.subprocess import PIPE

SCRIPT = (
    "import sys, time\n"
    "for i in range(3):\n"
    "    sys.stdout.buffer.write((b'x'*4096) + b'\n')\n"
    "    sys.stdout.flush()\n"
    "    time.sleep(0.2)\n"
)

async def main():
    process = await asyncio.create_subprocess_exec(
        sys.executable, "-u", "-c", SCRIPT, stdout=PIPE, stderr=PIPE
    )

    async def read_chunks(stream, name, size=1024):
        while True:
            chunk = await stream.read(size)  # 分块读取
            if not chunk:
                break
            print(f"[{name}] got {len(chunk)} bytes")

    t_out = asyncio.create_task(read_chunks(process.stdout, "STDOUT"))
    t_err = asyncio.create_task(read_chunks(process.stderr, "STDERR"))

    await process.wait()
    await asyncio.gather(t_out, t_err)

asyncio.run(main())
```

实践提示：
- 子进程若是你可控的 Python 程序，优先使用 -u 或对每次输出 flush=True；
- 不要先 wait 再读，实时消费应一边读一边等进程结束；
- 同时读取 stdout 与 stderr，避免某一端写满导致阻塞；
- 若仅需最终完整输出，仍优先使用 communicate() 更简单。

## ✅ 小结

- 使用 create_subprocess_exec 优先于 shell 版本，除非需要 shell 特性
- 使用 PIPE 重定向输出，配合 communicate() 避免死锁
- wait_for 超时不会自动结束真实进程，需显式 terminate/kill 并再次 wait
- 跨平台命令需考虑 Windows/类 Unix 差异