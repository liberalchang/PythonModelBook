---
layout: doc
title: signal 模块 - 信号处理与进程间通信
permalink: /docs/stdlib/signal/
category: stdlib
tags: [signal, 信号处理, 进程通信, 异步通信, UNIX]
description: Python signal模块用于处理UNIX信号，实现异步进程间通信和信号拦截
author: Python文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# signal 模块 - 信号处理与进程间通信

## 📝 概述

signal模块是Python标准库中用于处理UNIX信号的模块。信号是进程间通信机制中唯一的异步通信机制，一个进程不必通过任何操作来等待信号的到达。signal模块主要针对UNIX平台，在Windows平台上功能有限。

## 🎯 学习目标

- 理解信号的概念和工作原理
- 掌握Python signal模块的基本使用
- 学会设置信号处理函数和信号拦截
- 了解常见信号类型及其用途
- 掌握定时器和进程控制的实现

## 📋 前置知识

- 基本的Python语法和函数定义
- 了解进程和操作系统概念
- 理解异步编程的基本概念

## 🔍 详细内容

### 信号基本概念

信号Signal的全称为软中断信号，是用来通知进程发生了异步事件，是在软件层次上对中断机制的一种模拟。原理上一个进程收到一个信号与CPU收到一个中断请求可以说是类似的。

信号是进程间通信机制中唯一的异步通信机制，一个进程不必通过任何操作来等待信号的到达。事实上进程也不知道信号到底什么时候到达，进程之间可以相互通过系统调用kill发送软中断信号。内核也可以因为内部事件而给进程发送信号，通知进程发生了某个事件。

#### 信号生命周期

对于一个完整的信号生命周期，从信号发送到相应的处理函数执行完毕来说，可以分为三个阶段：

1. **信号诞生**：信号事件的发生有两个来源分别是硬件来源和软件来源，最常用发送信号的系统函数是kill、raise、alarm、settimer、sigqueue。

2. **信号在目标进程中注册**：在进程表的表项中有一个软中断信号域，该域中每一位对应一个信号。内核给一个进程发送软中断信号的方法，是在进程所在的进程表项的信号域中设置对应于该信号的位。

3. **信号的执行和注销**：内核处理一个进程收到的软中断信号是在该进程的上下文，因此进程必须处于运行状态。

#### 信号处理方式

接收信号的进程对不同的信号有三种处理方式：

- **忽略信号**：大多数信号可以使用忽略信号这种方式来处理，但SIGKILL和SIGSTOP不能被忽略
- **捕捉（指定处理函数）**：写一个信号处理函数，然后将这个函数告诉内核
- **系统默认动作**：每个信号都有对应的默认处理动作，大部分是直接杀死进程

### 模块导入

```python
## 导入signal模块
import signal
import time
```

### 常见信号类型

| 信号名称 | 编号 | 说明 | 触发方式 |
|----------|------|------|----------|
| SIGINT | 2 | 终止进程 | Ctrl+C |
| SIGQUIT | 3 | 终端退出 | Ctrl+\ |
| SIGKILL | 9 | 杀死进程 | kill -9 |
| SIGTERM | 15 | 终止信号 | kill |
| SIGALRM | 14 | 闹钟信号 | alarm() |
| SIGSTOP | 19 | 暂停进程 | Ctrl+Z |
| SIGCONT | 18 | 继续执行 | fg命令 |

```bash
# 查看系统支持的所有信号
$ kill -l
 1) SIGHUP   2) SIGINT   3) SIGQUIT  4) SIGILL   5) SIGTRAP
 6) SIGABRT  7) SIGBUS   8) SIGFPE   9) SIGKILL 10) SIGUSR1
11) SIGSEGV 12) SIGUSR2 13) SIGPIPE 14) SIGALRM 15) SIGTERM
16) SIGSTKFLT   17) SIGCHLD 18) SIGCONT 19) SIGSTOP 20) SIGTSTP
21) SIGTTIN 22) SIGTTOU 23) SIGURG  24) SIGXCPU 25) SIGXFSZ
26) SIGVTALRM   27) SIGPROF 28) SIGWINCH    29) SIGIO   30) SIGPWR
31) SIGSYS  34) SIGRTMIN    35) SIGRTMIN+1  36) SIGRTMIN+2  37) SIGRTMIN+3
38) SIGRTMIN+4  39) SIGRTMIN+5  40) SIGRTMIN+6  41) SIGRTMIN+7  42) SIGRTMIN+8
43) SIGRTMIN+9  44) SIGRTMIN+10 45) SIGRTMIN+11 46) SIGRTMIN+12 47) SIGRTMIN+13
48) SIGRTMIN+14 49) SIGRTMIN+15 50) SIGRTMAX-14 51) SIGRTMAX-13 52) SIGRTMAX-12
53) SIGRTMAX-11 54) SIGRTMAX-10 55) SIGRTMAX-9  56) SIGRTMAX-8  57) SIGRTMAX-7
58) SIGRTMAX-6  59) SIGRTMAX-5  60) SIGRTMAX-4  61) SIGRTMAX-3  62) SIGRTMAX-2
63) SIGRTMAX-1  64) SIGRTMAX    

信号分类

- POSIX标准规则信号regular signal 1-31

- 实时信号real-time signal 32-63

由于不同系统中同一个数值对应的信号类型不同，所以最好使用信号名称。另外，信号的数值越小，优先级越高。

信号通信

- 被动式
内核检测到一个系统事件，比如子进程退出时会向父进程发送SIGCHLD信号，当键盘按下Ctrl+C时会发送SIGINT信号等。

- 主动式
比如通过系统调用kill向指定进程发送信号

常见信号

- SIGINT 表示键盘按下Ctrl+c键时会发送给前台的每一个进程。

- SIGQUIT 表示键盘按下Ctrl+\键

- SIGSTP 表示键盘按下Ctrl+z键

- SIGKILL 表示结束某个进程，不能被忽略处理。

- SIGALRM 表示时钟信号，常用作定时器。

- SIGSTOP表示暂停某个进程，且不能被忽略处理。

- SIGCHLD表示子进程发送给父进程信号

可以在中断输入kill -l命令查看系统支持的所有信号列表



```
kill -l [信号声明]

```




```
kill [-s 信号声明 | -n 信号编号 | -信号声明] 进程号 | 任务声明...

```



- 在信号列表中，34号之后的信号尚未定义。

- 进程结束信号可使用SIGKILL和SIGTERM

- 对于SIGKILL结束信号时，进程是不能忽略的，该信号意味着不管进程正在做什么都必须立即停止。

- 对于SIGTERM结束信号是比较友好的，进程能捕捉到这个信号，会根据用户的需要来关闭程序。在关闭程序之前，可以结束打开的记录文件和完成正在做的任务。在某些情况下，假如进程正在进行作业而且不能中断，那么进程可以忽略这个SIGTERM信号。

## Python信号模块signal


尽管signal是Python中的模块，但主要针对UNIX平台，而Windows内核中由于对信号机制支持不充分，所以在Windows上的Python不能发会信号系统的功能。

Python的signal模块负责程序内部的信号处理，典型的操作包括信号处理函数、暂停并等待信号，定时发出SIGALRM等。

加载模块



```
import signal

```



### 信号名称



```
# 连接挂断
signal.SIGUP

```




```
# 非法指令
signal.SIGILL

```




```
# 终止进程
signal.SIGINT

```


SIGINT信号编号为2，当按下键盘CTRL+c组合键时进程会收到此信号，用于终止进程。



```
# 暂停进程CTRL+z
signal.SIGSTP

```




```
# 杀死进程，此信号不能被捕获或忽略。
signal.SIGKILL

```



SIGKILL信号用于强制杀死进程，此信号进程无法忽视，直接在系统层面将进程杀死，所以在Python中它是不能监听的。



```
# 终端退出
signal.SIGQUIT

```




```
# 终止信号，软件终止信号。
signal.SIGTERM

```



当终端用户输入kill sigerm pid时对应PID的进程会接收到此信号，此信号进程是可以捕获并指定函数处理。比如做一下程序清理等工作，当然也是可以忽视此信号的。



```
# 闹钟信号，由signal.alarm()发起。
signal.SIGALRM

```




```
# 继续执行暂停进程
signal.SIGCONT

```


### 信号处理函数

#### 设置发送SIGALRM信号的定时器



```
signal.alarm(time)

```



- 功能：在time秒后向进程自身发送SIGALRM信号

- 参数：time为时间参数，单位为秒。

例如：设置时钟



```
$ vim sigalrm.py

```




```
#!/usr/bin/env python
# -*- coding:utf-8 -*-

import signal, time

# 3秒后终止程序
signal.alarm(3)

while True:
    time.sleep(1)
    print("working")

```




```
$ python sigalrm.py
working
working
闹钟

```



一个进程中只能设置一个时钟，如果设置第二个则会覆盖第一个的时间，并返回第一个的剩余时间，同时第一个闹钟返回为0。

例如：当在一个程序中出现两个signal.alarm()函数时



```
$ vim sigalrm.py

```




```
#!/usr/bin/env python
# -*- coding:utf-8 -*-

import signal, time

# 3秒后终止程序
print(signal.alarm(3)) # output:0
time.sleep(1)
print(signal.alarm(3)) # output:2

while True:
    time.sleep(1)
    print("working")

```




```
$ python sigalrm.py
0
2
working
working
闹钟

```



使用signal.pause阻塞函数，让进程暂停以等待信号，也就时阻塞进程执行，简单来说当接收到信号后使进程停止。

例如：



```
$ vim sigalrm.py

```




```
#!/usr/bin/env python
# -*- coding:utf-8 -*-

import signal, time

# 3秒后终止程序
print(signal.alarm(3)) # output:0
time.sleep(1)
print(signal.alarm(3)) # output:2

# 阻塞等待信号的发生，无论什么信号都可以。
signal.pause()

while True:
    time.sleep(1)
    print("working")

```




```
$ python sigalrm.py
0
2
闹钟

```



### 使程序进入休眠



```
signal.pause()

```



- 作用：使程序进入休眠直到程序接收到某个信号量

### 获取当前程序注册signalnum信号量的处理函数



```
signal.getsignal(signalnum)

```



- 作用：获取当前程序注册signalnum信号量的处理函数

- 返回值：可能使Python可调用对象如signal.SIG_DFL、signal.SIG_IGN、None。

### 设置信号处理函数



```
signal.signal(sig, handler)

```



- 功能：按照handler处理器制定的信号处理方案处理函数

- 参数：


- sig拟需处理的信号 ，处理信号只针对这一种信号其作用。

- handler信号处理方案，进程可以无视信号采取默认操作也可自定义操作。

当handler为下列函数时将有如下操作

- SIG_IGN信号被无视ignore或忽略

- SIG_DFL进程采用默认default行为处理

- function处理器handler作为函数名称时，进程采用自定义函数处理。

- SIGSTOP SIGKILL不能处理只能采用

例如：



```
$ vim signal.py

```




```
#!/usr/bin/env python
# -*- coding:utf-8 -*-

import signal, time

# 3秒后终止程序
signal.alarm(3)
# 当遇到SIGINT即CTRL+C时忽略SIG_IGN
signal.signal(signal.SIGINT, signal.SIG_IGN)
# 阻塞等待信号的发生，无论什么信号都可以。
signal.pause()

```




```
$ python signal.py
闹钟

```



### 信号拦截

为什么需要设置信号拦截呢？如果使用多线程或多协程，为了防止主线程结束而子线程和子协程还在运行，此时就需要使用signal模块，使用signal模块可以绑定一个处理函数，当接收步到信号的时候不会立即结束程序。

在Python中拦截信号通常有两种方式

- 第一种是发出kill信号



```
# SIGTERM 表示关闭程序信号
signal.signal(signal.SIGTERM, self._term_handler)

```



- 第二种是发出CTRL+C信号



```
# SIGINT表示CTRL+C信号
signal.signal(signal.SIGINT, self._term_handler)

```



在多线程多协程的程序设计时，一般多线程或的多协程程序在设计时应该设计一个程序终止标记，当收到终止信号的时候，让终止标记状态由False修改为True，此时运行的程序只有终止标记在False状态下时才能够以运行。如果由需要休眠的协程，还应给协程增加一个休眠标记，当程序休眠的时候休眠标记设置为True，当收到终止信号的时候，不仅仅要把终止标记设置为True，还要将休眠中的协程结束掉。



链接：https://www.jianshu.com/p/e0a69beb98bb