---
layout: doc
title: optparse 模块 - 命令行选项解析
permalink: /docs/stdlib/optparse/
category: stdlib
tags: [命令行, 选项解析, 参数处理, 脚本, 工具]
description: Python optparse 模块详解 - 用于解析命令行选项和参数的标准库工具，已被 argparse 取代但仍在维护
author: Python教程
date: 2024-12-19
updated: 2024-12-19
version: 1.0
difficulty: "中级"
---

# optparse 模块 - 命令行选项解析

## 📝 概述

optparse 模块是 Python 标准库中用于处理命令行选项和参数的工具。它采用预先定义好的选项来解析命令行参数，可以方便地为脚本添加命令行接口。虽然在 Python 2.7 之后被 argparse 模块取代，但 optparse 仍在维护并广泛使用。

optparse 提供了比 getopt 更强大和易用的功能，可以自动生成标准的、符合 Unix/Posix 规范的命令行说明。

## 🎯 学习目标

- 理解 optparse 模块的基本概念和用途
- 掌握 OptionParser 对象的创建和使用
- 学会添加命令行选项（add_option）
- 了解各种 action 类型和参数配置
- 掌握选项解析和错误处理
- 能够构建完整的命令行工具

## 📋 前置知识

- Python 基础语法和模块导入
- 命令行基础概念
- 字典和列表的使用
- 异常处理机制

## 🔍 详细内容

### 基本概念

optparse 主要用来为脚本传递命令参数，采用预先定义好的选项来解析命令行参数。通过实例化一个 OptionParser() 对象，可以定制程序的参数选项控制。

### 创建 parser 实例

每个 parser 实例代表一类命令实例。例如 -f 是文件命令中的一个 option，它属于文件 parser 对象。

```python
from optparse import OptionParser
parser = OptionParser()
```

### 基础用法示例

```python
# coding=utf-8
"""
Python 有两个内建的模块用于处理命令行参数：
一个是 getopt，只能简单处理命令行参数；
另一个是 optparse，它功能强大，而且易于使用，可以方便地生成标准的、符合Unix/Posix 规范的命令行说明。
"""
import optparse

usage = "Usage: %prog [options] arg1 arg2 ..."
parser = optparse.OptionParser(usage, version="%prog 1.0")
options, args = parser.parse_args()

"""
解释：
optparse.OptionParser()对象中的参数中的：%prog 代表当前脚本名字即os.path.basename(sys.argv[0])
options,args=parser.parse_args()，optparse.OptionParser()对象实例调用parse_args()方法后即可解析脚本输入的参数值；
返回值：options是一个包含了option值的对象，args是一个位置参数的列表。
parse_args()方法可以接受命令中输入的参数，也可以接受一个列表List[]，parse_args(list)
"""
```

运行结果：
```bash
E:\HDCZU_Test\Test>python py15.py -h
Usage: py15.py [options] arg1 arg2 ...

Options:
  --version   show program's version number and exit
  -h, --help  show this help message and exit
```

### 添加选项

#### add_option 的参数

```python
parser.add_option("-f", "--file", action="store", type="string", dest="filename")
```

参数说明：

- **短参数名（-f）**：表示短参数名（后面空格或不用空格接参数属性值）
- **长参数名（--file）**：表示长参数名（后面空格或=号接参数属性值）
- **action**：告诉 optparse 遇到参数应该按照 add_option 时定义的来使用
  - `action="store"`：用户必须给出一个明确的参数值，并将参数值保存到 dest 定义的变量名中
  - `action="store_true"`：用户不需要给出参数值，将 bool 值 True 保存在 dest 定义的变量名中
  - `action="store_false"`：用户不需要给出参数值，将 bool 值 False 保存在 dest 定义的变量名中
- **dest**：定义一个变量名用来接收前面的长短参数名的参数值，即可调用 options.filename 来获取长短参数名的参数值
- **type**：定义前面长短参数名的参数值的类型，必须是字符串（这里可以是：string, int, num, float 等类型）
- **metavar**：当用户查看帮助信息时，如果没有定义 metavar 的值，那么显示的帮助信息中长短参数名后面默认带上 dest 所定义的变量名；如果定义了 metavar 的值，那么显示的帮助信息中长短参数名后面就带上 metavar 定义的值
- **default**：如果长短参数名未设置参数属性值，则使用默认值代替，前提是 action 未定义或 action 只能定义为 store_true/store_false
- **help**：仅显示帮助信息中的语句提示信息

### 语法格式

#### 基本选项添加示例

```python
import optparse

usage = "Usage: %prog [options] arg1 arg2 ..."
parser = optparse.OptionParser(usage, version="%prog 1.0")

# 自定义可以解析的参数名
parser.add_option("-f", "--file", action="store", dest="filename", type="string", metavar="FILE", help="write output to file")
options, args = parser.parse_args()

print("options :", options)
print(options.filename)
print("args :", args)
```

运行结果：
```bash
E:\HDCZU_Test\Test>python py15.py -f dchuoth
options : {'filename': 'dchuoth'}
dchuoth
args : []
```

#### 多选项配置示例

```python
import optparse

usage = "Usage: %prog [options] arg1 arg2 ..."
parser = optparse.OptionParser(usage, version="%prog 1.0")

# 自定义可以解析的参数名
parser.add_option("-f", "--file", action="store", dest="filename", type="string", metavar="FILE", help="write output to file")
parser.add_option("-u", "--user", action="store", dest="username", type="string", metavar="USER", help="write user to username")
parser.add_option("-v", default="1.2", help="print version")

# 设置默认值也可以这样：parser.set_defaults(v="1.2")
options, args = parser.parse_args()

print("options :", options)
print(options.filename)
print(options.username)
print(options.v)
print("args :", args)
```

运行结果：
```bash
E:\HDCZU_Test\Test>python py15.py -fdchuoth -uhzhu
options : {'filename': 'dchuoth', 'v': '1.2', 'username': 'hzhu'}
dchuoth
hzhu
1.2
args : []
```

### 参数说明

#### action 参数详解

| action | 说明 |
|--------|------|
| store | 告诉 optparse 按照 add_option 时定义的那样解析（默认值） |
| store_true | option 后面有参数那么选项值为 True |
| store_false | option 后面有参数那么选项值为 False |

#### type 参数

指定选项值的类型，可选值：
- string（默认）
- int
- float
- choice

#### dest 参数

指定选项名（也就是 options 字典中的键值）

#### default 参数

当没有参数时默认给选项字典赋值

#### help 参数

帮助信息提示，添加了 usage 信息

```python
USAGE = "one two three"
parser = OptionParser(USAGE)
parser.add_option("-f", "--file", action="store", type="string", dest="filename", default="hahaha", help="no help")
parser.print_usage()
parser.print_help()
```

### 返回值

parse_args() 方法返回一个元组：
- **options**：包含选项值的对象，可以通过 options.选项名 访问
- **args**：位置参数的列表，除了选项后跟着的参数外都是参数列表中的参数

## 💡 实际应用

### 基础用法

```python
from optparse import OptionParser

parser = OptionParser()
parser.add_option("-f", "--file")
(options, params) = parser.parse_args()
print(options)
print(params)
```

### 高级用法

#### 完整的选项配置

```python
import optparse

usage = "Usage: %prog [options] arg1 arg2 ..."
parser = optparse.OptionParser(usage, version="%prog 1.0")

# 文件选项
parser.add_option("-f", "--file", action="store", dest="filename", 
                  type="string", metavar="FILE", help="write output to file")

# 用户选项
parser.add_option("-u", "--user", action="store", dest="username", 
                  type="string", metavar="USER", help="write user to username")

# 版本选项
parser.add_option("-v", default="1.2", help="print version")

# 布尔选项
parser.add_option("-b", action="store_true", dest="verbose")
parser.add_option("-d", action="store_false", dest="verbose")

options, args = parser.parse_args()

print("options :", options)
print("filename:", options.filename)
print("username:", options.username)
print("version:", options.v)
print("verbose:", options.verbose)
print("args :", args)

# 错误处理
if not options.verbose:
    parser.error("verbose must be true")
```

### 实际案例

#### 文件处理工具

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import optparse
import sys
import os

def main():
    usage = "Usage: %prog [options] input_file"
    parser = optparse.OptionParser(usage, version="%prog 1.0")
    
    parser.add_option("-o", "--output", dest="output_file",
                      help="输出文件路径", metavar="FILE")
    parser.add_option("-v", "--verbose", action="store_true",
                      dest="verbose", default=False,
                      help="显示详细信息")
    parser.add_option("-q", "--quiet", action="store_false",
                      dest="verbose", help="静默模式")
    
    (options, args) = parser.parse_args()
    
    # 检查参数
    if len(args) != 1:
        parser.error("需要指定一个输入文件")
    
    input_file = args[0]
    if not os.path.exists(input_file):
        parser.error("输入文件不存在: %s" % input_file)
    
    # 处理文件
    if options.verbose:
        print("处理文件: %s" % input_file)
    
    # 文件处理逻辑...
    
    if options.output_file:
        if options.verbose:
            print("输出到: %s" % options.output_file)
    else:
        if options.verbose:
            print("输出到标准输出")

if __name__ == "__main__":
    main()
```

## ⚠️ 注意事项

- **废弃状态**：optparse 在 Python 2.7 之后被 argparse 取代，新项目建议使用 argparse
- **兼容性**：optparse 仍在维护，保持向后兼容
- **parse_args()参数**：可以接受命令行参数，也可以接受一个列表 `parse_args(list)`
- **%prog 占位符**：在 usage 和 version 中，%prog 会被替换为当前脚本名
- **错误处理**：使用 `parser.error("error message")` 来处理错误
- **选项顺序**：选项可以出现在位置参数的任何位置
- **参数格式**：短选项可以连写（如 `-fdchuoth`），长选项用等号连接（如 `--file=filename`）

## 🔗 相关内容

- [sys 模块 - 系统特定参数和函数](../sys/)
- [getopt 模块 - C 风格的命令行选项解析](https://docs.python.org/3/library/getopt.html)
- [argparse 模块 - 命令行选项、参数和子命令解析器](https://docs.python.org/3/library/argparse.html)

## 📚 扩展阅读

- [Python optparse 官方文档](https://docs.python.org/3/library/optparse.html)
- [命令行接口设计指南](https://clig.dev/)
- [Unix 命令行工具设计原则](https://www.gnu.org/software/coreutils/manual/html_node/Common-options.html)

## 🏷️ 标签

`命令行` `选项解析` `参数处理` `脚本` `工具`

---

**最后更新**: 2024-12-19  
**作者**: Python教程  
**版本**: 1.0