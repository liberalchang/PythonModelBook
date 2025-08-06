---
layout: page
title: 标准库
permalink: /docs/stdlib/
category: stdlib
---

# Python标准库

Python标准库是Python安装包自带的模块集合，提供了丰富的功能，从文件操作到网络编程，从数据处理到系统管理。

## 📋 本模块内容

### [文件操作](file-operations/)
- os模块：操作系统接口
- pathlib模块：面向对象的路径操作
- shutil模块：高级文件操作
- glob模块：文件名模式匹配
- tempfile模块：临时文件和目录

### [日期时间](datetime/)
- datetime模块：日期和时间处理
- time模块：时间相关函数
- calendar模块：日历相关功能
- 时区处理和格式化
- 时间计算和比较

### [正则表达式](regex/)
- re模块：正则表达式操作
- 模式匹配和搜索
- 文本替换和分割
- 正则表达式编译和优化
- 常用正则表达式模式

### [网络编程](networking/)
- urllib模块：URL处理
- http模块：HTTP客户端和服务器
- socket模块：底层网络接口
- email模块：邮件处理
- json模块：JSON数据处理

### [数据库操作](database/)
- sqlite3模块：SQLite数据库
- 数据库连接和事务
- SQL查询和数据操作
- 数据库设计最佳实践
- ORM概念介绍

### [operator模块](operator/)
- 运算符函数映射
- attrgetter：属性获取器
- itemgetter：项获取器
- methodcaller：方法调用器
- 函数式编程和性能优化

## 🎯 学习目标

完成本模块学习后，你将能够：

- 熟练使用Python标准库进行开发
- 掌握文件和目录操作技巧
- 能够处理日期时间相关任务
- 使用正则表达式进行文本处理
- 进行基本的网络编程
- 操作SQLite数据库

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
4. **注意版本差异**：不同Python版本的标准库可能有差异
5. **性能考虑**：了解不同模块的性能特点

## 🔍 常用模块速查

### 必备模块
- **os**: 操作系统接口
- **sys**: 系统特定参数和函数
- **datetime**: 日期和时间
- **json**: JSON编码器和解码器
- **re**: 正则表达式

### 实用模块
- **collections**: 专用容器数据类型
- **itertools**: 创建迭代器的函数
- **functools**: 高阶函数和可调用对象操作
- **operator**: 运算符函数和函数式编程工具
- **pathlib**: 面向对象的文件系统路径
- **urllib**: URL处理模块

## 🔗 相关资源

- [Python标准库官方文档](https://docs.python.org/3/library/)
- [Python模块索引](https://docs.python.org/3/py-modindex.html)
- [Python HOWTOs](https://docs.python.org/3/howto/index.html)