---
layout: doc
title: 并行编程概念基础
permalink: /docs/basics/concurrency-concepts/
category: basics
tags: [并发, 并行, 分布式, 死锁, 饥饿, 竞态, GIL]
description: 系统梳理并发与并行编程的关键概念、问题与在 Python 中的实现路径
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "初级"
---

# 并行编程概念基础

## 📝 概述

本章梳理并行编程的核心概念，包括并发、并行、分布式的差异，进程/线程模型，通信方式，常见问题（死锁、饥饿、竞态条件），以及 Python 中的实践路径与限制（GIL）。

## 🎯 学习目标

- 明确并发、并行、分布式的概念区分
- 理解共享内存与消息传递两类通信方式
- 掌握死锁、饥饿、竞态的定义、成因与规避
- 知道 Python 并行的主要技术方案与适用场景
- 了解 GIL 对多线程并行的影响

## 📋 前置知识

- Python 基础语法
- 操作系统进程与线程的基本概念

## 🔍 详细内容

### 1. 概念区分

- 并发（Concurrency）：在同一时间段内同时处理多个任务的结构安排
- 并行（Parallelism）：在同一时刻真正同时执行多个任务（需要多核）
- 分布式（Distributed）：将任务分散到多个独立节点，节点间通过网络通信

### 2. 通信方式

- 共享状态（Shared State）：线程共享内存，使用锁、条件变量、事件等同步原语
- 消息传递（Message Passing）：进程间通过队列、管道或网络消息传递数据

### 3. 常见问题

- 死锁（Deadlock）：多个线程/进程互相等待对方释放资源而陷入僵局
- 饥饿（Starvation）：某些任务长期得不到资源分配
- 竞态条件（Race Condition）：多个任务并发访问/修改共享状态导致结果不确定

#### 预防策略

- 统一资源获取顺序，避免循环等待
- 降低锁的粒度与持有时间，采用无锁/最小锁化数据结构
- 使用超时和回退策略
- 使用不可变数据、复制写（copy-on-write）

### 4. Python 生态与技术路径

- 线程（threading）：适合 I/O 密集型任务，受 GIL 限制无法实现 CPU 并行
- 进程（multiprocessing）：适合 CPU 密集型任务，进程间通信开销较大
- 并发抽象（concurrent.futures）：统一的线程池/进程池接口
- 任务队列（Celery）：分布式任务调度与执行

### 5. GIL（全局解释器锁）

- 目的：保证 CPython 解释器在多线程环境中的内存管理安全
- 影响：同一进程内同一时刻只有一个线程在执行 Python 字节码
- 应对：
  - I/O 密集：多线程仍然有效（阻塞 I/O 释放 GIL）
  - CPU 密集：使用多进程或 C 扩展释放 GIL

### 6. 生命周期与状态

- 线程：新建 -> 就绪 -> 运行 -> 阻塞 -> 终止
- 进程：新建 -> 就绪/调度 -> 运行 -> 等待/阻塞 -> 结束

## 💡 实际应用

### 选择策略建议

- I/O 密集：优先 threading + ThreadPoolExecutor
- CPU 密集：优先 multiprocessing + ProcessPoolExecutor 或 Pool
- 分布式：使用 Celery、Ray、Dask 等

### 实践清单

- 选择正确的并发/并行模型
- 分离计算与 I/O
- 明确共享状态边界，尽量避免共享
- 为关键路径加监控与超时
- 用基准测试验证加速效果

## ⚠️ 注意事项

- 在 Windows 上使用多进程需要 `if __name__ == "__main__":` 保护
- 设计 API 时尽量无副作用以降低并发复杂度
- 小心日志、标准输出的并发写入

## 🔗 相关内容

- [多线程编程](../multithreading/)
- [多进程与进程池](../multiprocessing/)
- [进程间通信（IPC）](../ipc/)
- [concurrent.futures](../concurrent-futures/)

## 📚 扩展阅读

- [Python 并发概述 - 官方文档](https://docs.python.org/3/library/concurrency.html)
- [GIL 解析 - 官方 FAQ](https://docs.python.org/3/faq/library.html#what-kinds-of-global-value-mutation-are-thread-safe)

## 🏷️ 标签

`并发` `并行` `分布式` `死锁` `饥饿` `竞态` `GIL`

---

**最后更新**: 2024-01-15  
**作者**: Python 编程指南  
**版本**: 1.0