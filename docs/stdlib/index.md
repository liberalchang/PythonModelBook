---
layout: page
title: 标准库
permalink: /docs/stdlib/
category: stdlib
---

# Python 标准库

Python 标准库是 Python 安装包自带的模块集合，提供了丰富的功能，从文件操作到网络编程，从数据处理到系统管理。

## 📋 本模块内容

### [文件操作]


### 日期时间
- [time 模块 - 基础时间处理功能](./time/)
- [calendar 模块 - 日历相关功能](./calendar/)
- [datetime 模块 - 高级日期时间处理](./datetime/)


### 数据结构
- [collections 模块 - 高级容器数据类型](./collections/)

### 函数式编程
- [operator 模块 - 运算符函数映射](./operator/)
- [copy 模块 - 对象拷贝功能](./copy/)
- [inspect 模块 - 对象检查和反射功能](./inspect/)
- [enum 模块 - 枚举类型和常量定义](./enum/)
- [typing 模块 - 类型提示和静态类型检查](./typing/)


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
| 数据格式 | json, csv, xml | 数据序列化和解析 |
| 网络通信 | urllib, http, socket | 网络编程和通信 |
| 数据库 | sqlite3, dbm | 数据存储和查询 |
| 文本处理 | re, string, textwrap | 文本操作和格式化 |
| 时间日期 | datetime, time, calendar | 时间处理和计算 |
| 函数式编程 | operator, functools, itertools | 函数式编程工具 |
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