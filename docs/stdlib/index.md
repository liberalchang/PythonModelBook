---
layout: page
title: 标准库
permalink: /docs/stdlib/
category: stdlib
---

# Python 标准库

Python 标准库是 Python 安装包自带的模块集合，提供了丰富的功能，从文件操作到网络编程，从数据处理到系统管理。

## 📋 本模块内容

### 文件操作
- [open()](../builtins/open/) - 文件打开与处理
- [os](./os/) - 操作系统接口
- [pathlib](./pathlib/) - 面向对象的路径处理
- [shutil](./shutil/) - 高级文件操作

### 系统信息与服务
- [sys](./sys/) - 系统特定参数和函数
- [subprocess](./subprocess/) - 子进程管理和系统命令执行
- [signal](./signal/) - 信号处理与进程间通信
- [cProfile/profile - 性能分析工具](./profile/) - 函数级性能分析与统计
- [optparse 模块 - 命令行选项解析](./optparse/)
- [argparse 模块 - 命令行参数解析](./argparse/)

### 日期时间
- [time 模块 - 基础时间处理功能](./time/)
- [calendar 模块 - 日历相关功能](./calendar/)
- [datetime 模块 - 高级日期时间处理](./datetime/)


### 文本与输出处理
- [re 模块 - 正则表达式](./re/)
- [fnmatch 模块 - 文件名匹配](./fnmatch/)
- [glob 模块 - 文件通配符搜索](./glob/)
- [textwrap 模块 - 文本格式化与包装](./textwrap/)
- [unicodedata 模块 - Unicode字符数据库处理](./unicodedata/)
- [pprint 模块 - 数据结构美观输出](./pprint/)
- [print 函数 - 高级输出与格式化技巧](./print/)
- [logging 模块 - 日志记录和管理](./logging/)
- [traceback 模块 - 异常追踪与调试](./traceback/)
- [hashlib 模块 - 安全哈希与消息摘要](./hashlib/)

### 图形与界面
- [turtle 模块 - 海龟绘图](./turtle/)
- [tkinter 模块 - 图形用户界面](https://docs.python.org/3/library/tkinter.html)

### 压缩与I/O
- [bz2 模块 - bzip2压缩](./bz2/)
- [gzip 模块 - gzip压缩](./gzip/)
- [io 模块 - 文本与二进制I/O](./io/)
- [binascii 模块 - 二进制与ASCII转换](./binascii/)

### 数据格式
- [xml.etree.ElementTree 模块 - XML解析与生成](./xml.etree.ElementTree/)
- [json 模块 - JSON 编解码与序列化](./json/)
- [csv 模块 - CSV 读写与方言配置](./csv/)
- [struct 模块 - C结构体打包与解包，二进制格式编解码](./struct/)


### 网络编程
- [socket 模块 - 网络编程基础，TCP/UDP套接字通信](./socket/)
- [socketserver 模块 - 简化网络服务器开发，支持多客户端并发处理](./socketserver/)
- [urllib 模块 - URL处理、HTTP请求与编码解码](./urllib/)
- [http.client 模块 - 低层HTTP客户端，手动构造与控制请求/响应](./http.client/)
- [ssl 模块 - TLS/SSL 支持，证书验证与主机名校验](./ssl/)
- [xmlrpc 模块 - Python 的 XML-RPC 远程过程调用](./xmlrpc/)

### 数学计算
- [math 模块 - 数学函数、三角函数、对数函数与数学常量](./math/)

### 数据结构
- [collections 模块 - 高级容器数据类型](./collections/)
- [heapq 模块 - 堆队列算法](./heapq/)
- [bisect 模块 - 二分查找与插入](./bisect/)

### 函数式编程
- [itertools 模块 - 高效的迭代器工具](./itertools/)
- [operator 模块 - 运算符函数映射](./operator/)
- [functools 模块 - 高阶函数和可调用对象操作](./functools/)
- [weakref 模块 - 弱引用与对象生命周期管理、基于弱引用的缓存](./weakref/)
- [copy 模块 - 对象拷贝功能](./copy/)
- [inspect 模块 - 对象检查和反射功能](./inspect/)
- [enum 模块 - 枚举类型和常量定义](./enum/)
- [typing 模块 - 类型提示和静态类型检查](./typing/)
- [contextlib 模块 - 上下文管理器工具](./contextlib/)
- [opcode 模块 - 操作码与字节码](./opcode/)
- [TypeGuard - 类型守卫与类型收缩](./typeguard/)


## 🎯 学习目标

完成本模块学习后，你将能够：

- 熟练使用 Python 标准库进行开发
- 掌握文件和目录操作技巧
- 能够处理日期时间相关任务
- 使用正则表达式进行文本处理
- 进行基本的网络编程
- 操作 SQLite 数据库

## 📊 标准库分类

| 分类 | 主要模块 | 功能描述 |
|------|----------|----------|
| 文件系统 | os, pathlib, shutil | 文件和目录操作 |
| 压缩与I/O | bz2, gzip, io | 数据压缩和输入输出处理 |
| 数据格式 | json, csv, xml | 数据序列化和解析 |
| 网络通信 | urllib, http, socket | 网络编程和通信 |
| 数据库 | sqlite3, dbm | 数据存储和查询 |
| 文本处理 | re, string, textwrap, pprint, print | 文本操作和格式化 |
| 数据结构 | collections, heapq | 专用容器数据类型、堆队列算法 |
| 时间日期 | datetime, time, calendar | 时间处理和计算 |
| 函数式编程 | itertools, operator, functools | 函数式编程工具 |
| 系统服务 | sys, os, platform | 系统信息和服务 |
| 并发编程 | threading, multiprocessing | 多线程和多进程 |

## 💡 使用建议

1. **优先使用标准库**：避免重复造轮子
2. **了解模块结构**：理解每个模块的主要功能和类
3. **查阅文档**：标准库文档详细且权威
4. **注意版本差异**：不同 Python 版本的标准库可能有差异
5. **性能考虑**：了解不同模块的性能特点

## 🔍 常用模块速查

### 必备模块
- **os**: 操作系统接口
- **sys**: 系统特定参数和函数
- **datetime**: 日期和时间
- **json**: JSON 编码器和解码器
- **re**: 正则表达式

### 实用模块
- **collections**: 专用容器数据类型
- **itertools**: 创建迭代器的函数
- **functools**: 高阶函数和可调用对象操作
- **operator**: 运算符函数和函数式编程工具
- **pathlib**: 面向对象的文件系统路径
- **urllib**: URL 处理模块

## 🔗 相关资源

- [Python 标准库官方文档](https://docs.python.org/3/library/)
- [Python 模块索引](https://docs.python.org/3/py-modindex.html)
- [Python HOWTOs](https://docs.python.org/3/howto/index.html)