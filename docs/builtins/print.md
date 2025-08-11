---
layout: doc
title: print() - 输出函数
permalink: /docs/builtins/print/
category: builtins
tags: [输出, 格式化, 调试]
description: Python 内置输出函数，用于将对象打印到文本流
author: Python 文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "初级"
---

# print() - 输出函数

## 📝 概述

`print()` 是 Python 中最常用的内置函数之一，用于将对象打印到文本流文件，通常是标准输出（控制台）。它支持多种参数和格式化选项，是调试和输出信息的重要工具。<mcreference link="https://docs.python.org/3/library/functions.html" index="1">1</mcreference>

## 🎯 学习目标

- 掌握 print()函数的基本用法
- 理解 print()函数的各种参数
- 学会使用 print()进行格式化输出
- 了解输出重定向的方法

## 📋 前置知识

- Python 基本语法
- 字符串的基本概念
- 文件操作基础

## 🔍 详细内容

### 基本概念

`print()` 函数将给定的对象转换为字符串（如果它们还不是字符串的话），并将它们写入到指定的文本流，默认为 `sys.stdout`。

### 语法格式

```python
print(*objects, sep=' ', end='\n', file=sys.stdout, flush=False)
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| *objects | any | 否 | 无 | 要打印的对象，可以是多个 |
| sep | str | 否 | ' ' | 多个对象之间的分隔符 |
| end | str | 否 | '\n' | 打印结束后添加的字符 |
| file | file-like | 否 | sys.stdout | 输出的文件对象 |
| flush | bool | 否 | False | 是否强制刷新输出缓冲区 |

### 返回值

| 类型 | 说明 |
|------|------|
| None | 函数不返回任何值 |

## 💡 实际应用

### 基础用法

```python
## 基本输出
print("Hello, World!")
## 输出: Hello, World!

## 输出多个对象
print("姓名:", "张三", "年龄:", 25)
## 输出: 姓名: 张三 年龄: 25

## 输出变量
name = "李四"
age = 30
print("姓名:", name, "年龄:", age)
## 输出: 姓名: 李四 年龄: 30
```

### 高级用法

```python
## 自定义分隔符
print("苹果", "香蕉", "橙子", sep="-")
## 输出: 苹果-香蕉-橙子

## 自定义结束符
print("第一行", end="")
print("第二行")
## 输出: 第一行第二行

## 输出到文件
with open("output.txt", "w", encoding="utf-8") as f:
    print("这是写入文件的内容", file=f)

## 强制刷新缓冲区
import time
for i in range(5):
    print(f"计数: {i}", flush=True)
    time.sleep(1)  # 立即显示,不等待缓冲区满
```

### 实际案例

```python
## 格式化输出学生信息
def print_student_info(students):
    """打印学生信息表"""
    print("学生信息表")
    print("=" * 30)
    print("姓名\t 年龄\t 成绩")
    print("-" * 30)
    
    for student in students:
        print(f"{student['name']}\t{student['age']}\t{student['score']}")
    
    print("=" * 30)

## 使用示例
students = [
    {"name": "张三", "age": 20, "score": 85},
    {"name": "李四", "age": 21, "score": 92},
    {"name": "王五", "age": 19, "score": 78}
]

print_student_info(students)
```

## ⚠️ 注意事项

- `print()` 函数会自动在输出末尾添加换行符，可以通过 `end` 参数修改
- 当输出大量数据时，考虑使用 `flush=True` 确保及时显示
- 输出到文件时，记得正确处理文件编码
- 在生产环境中，避免使用 `print()` 进行日志记录，应使用专门的日志模块

## 🔗 相关内容

- [input() - 输入函数](../input/) - 获取用户输入
- [str() - 字符串构造函数](../str/) - 字符串转换
- [format() - 格式化函数](../format/) - 字符串格式化
- [repr() - 表示函数](../repr/) - 对象表示
- [len() - 长度函数](../len/) - 获取长度
- [type() - 类型函数](../type/) - 获取类型

## 📚 扩展阅读

- [Python 官方文档 - print()](https://docs.python.org/3/library/functions.html#print)
- [Python 输入输出教程](https://docs.python.org/3/tutorial/inputoutput.html)

## 🏷️ 标签

`输出` `格式化` `调试` `控制台` `文件输出`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档工程师  
**版本**: 1.0