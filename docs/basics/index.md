---
layout: page
title: 基础语法
permalink: /docs/basics/
category: basics
navigation_weight: 1
---

# Python 基础语法

Python 基础语法是学习 Python 编程的起点，本模块涵盖了 Python 语言的核心概念和基本语法结构。

## 📋 本模块内容

### 开发环境与安装
- [Python 安装与环境配置](./python-installation/)

### 变量与数据类型
- [变量与数据类型](./variables/)

### 控制流程
- [判断语句与循环语句](./control-flow/)
- [match-case 语句 - 结构化模式匹配](./match-case/)
- [with 语句 - 上下文管理器](./with/)
- [raise/assert - 异常抛出和断言](./raise-assert/)
- [yield - 生成器与协程 (增强版)](./yield/)
- [while+sleep 循环定时器](./sleep/)
- [Threading.Timer 定时器](./timer/)  
- [schedule 模块调度](./schedule/)
- [APScheduler 企业级调度](./apscheduler/)

### 函数
- [函数定义与调用](./functions/)
- [函数作用域与闭包](./function-scope/)
- [lambda 表达式 - 匿名函数](./lambda/)
- [函数柯里化 - 高阶函数编程技术](./currying/)
- [装饰器 - 函数增强与复用](./decorators/)
- [API 测试装饰器 - 自动化测试实践](./api-testing-decorators/)

### 模块与包
- [Python 包和__init__.py 文件](./packages/)

### 算法基础
- [Python 排序算法完全指南](./sorting-algorithms/)

### 类与对象

- [类的定义与使用](./class-definition/)
- [类的继承](./class-inheritance/)
- [多态性](./polymorphism/)
- [封装](./encapsulation/)
- [魔术方法](./magic-methods/)
- [抽象基类](./abstract-classes/)
- [接口设计](./interface-design/)
- [数据类 (dataclass)](./dataclasses/)
- [单例模式 - 设计模式实现](./singleton/)




### 并发与并行
- [并行编程概念基础](./concurrency-concepts/)
- [多线程编程](./multithreading/)
- [线程池与进程池 - concurrent.futures](./concurrent-futures/)
- [多进程与进程池](./multiprocessing/)
- [进程池 Pool 深入指南](./pool/)
- [进程间通信（IPC）](./ipc/)
- [子进程与并行 - subprocess](./subprocess/)
- [在 asyncio 中引入多进程（CPU 密集型任务协作）](./multiprocessing-asyncio/)

### 协程与异步
- [初识 Python 协程的实现](./coroutine-impl/)
- [什么是 asyncio？单线程并发与事件循环](./asyncio-intro/)
- [协程常用方法与可等待对象](./coroutine-methods/)
- [并发运行多个任务：gather、as_completed、wait](./concurrent-tasks/)
- [asyncio 并发原语：锁、信号量、事件、条件变量](./sync-primitives/)
- [Asyncio 调度原理（EventLoop 工作机制）](./asyncio-scheduling/)
- [可等待对象：协程、任务与 Future](./awaitables/)
- [Python 3.11：TaskGroup 与 timeout](./asyncio-311-advanced/)
- [asyncio.task 常用函数：sleep/shield/wait_for/wait/as_completed](./asyncio-task-functions/)
- [网络流：StreamReader 与 StreamWriter（TCP 流编程）](./asyncio-streams/)
- [异步队列：Queue、PriorityQueue、LifoQueue](./asyncio-queues/)
- [异步生成器与异步迭代器](./async-generators/)
- [在 asyncio 中调用外部进程（子进程）](./asyncio-subprocess/)
- [异步上下文管理器：async with 与 asynccontextmanager](./async-context-managers/)
- [限制并发数量：Semaphore、令牌与连接池实战](./concurrency-limiting/)
- [在 asyncio 中使用多线程：run_in_executor、to_thread、run_coroutine_threadsafe](./asyncio-threads/)
- [取消语义与安全退出：CancelledError、传播、shield 与清理](./cancellation/)
- [在微服务架构中使用 asyncio：BFF、超时、重试、熔断与降级](./asyncio-microservices/)
- [不同 Python 协程 API：从生成器到 async/await](./asyncio-different-apis/)
- [asyncio 高阶常用方法与事件循环精要](./asyncio-advanced-methods/)
- [asyncio 异步应用对象与网络编程](./asyncio-application-objects/)
- [asyncio + SQLAlchemy 并发访问数据库](./asyncio-sqlalchemy/)
- [Trio 入门：结构化并发的另一种选择](./trio-intro/)

## 🎯 学习目标

完成本模块学习后，你将能够：

- 熟练使用 Python 基本语法编写程序
- 理解 Python 的数据类型和变量机制
- 掌握控制流程的使用方法
- 能够定义和使用函数
- 理解面向对象编程的基本概念
- 正确处理程序中的异常情况

## 💡 学习建议

1. **循序渐进**：按照顺序学习各个主题
2. **动手实践**：每个概念都要通过代码实践
3. **多做练习**：完成每个章节的练习题
4. **查阅文档**：养成查阅官方文档的习惯

## 🔗 相关资源

- [Python 官方教程](https://docs.python.org/3/tutorial/)
- [Python 语言参考](https://docs.python.org/3/reference/)
- [PEP 8 代码风格指南](https://www.python.org/dev/peps/pep-0008/)