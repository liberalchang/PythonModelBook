---
layout: doc
title: argparse 模块 - 命令行参数解析
permalink: /docs/stdlib/argparse/
category: stdlib
tags: [命令行解析, 选项参数, 子命令, 标准库]
description: Python argparse 模块完整指南，涵盖位置参数、可选参数、类型转换、默认值、必需参数、nargs、action 等用法
author: Python 文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "初级"
---

# argparse 模块 - 命令行参数解析

## 📝 概述

argparse 是 Python 标准库中用于解析命令行参数的模块，提供了强大的参数定义、类型转换、默认值、必需参数、子命令等功能，适合编写复杂命令行工具。

## 🎯 学习目标

- 掌握位置参数与可选参数的定义与区别
- 学会 `type`、`default`、`required`、`choices` 等常用参数设置
- 理解 `nargs` 的多种写法并选择合适的使用场景
- 熟悉 `action` 的常见用法（store/store_true/append/count 等）
- 能够编写结构清晰、可读性强的命令行接口

## 📋 前置知识

- Python 基本语法
- 命令行基础（如何执行 Python 脚本并传参）

## 🔍 详细内容

### 基本概念

- 位置参数：按顺序提供的参数，名称不带前缀。
- 可选参数：带有 `-` 或 `--` 前缀的参数，顺序不敏感，适合配置项。
- 参数命名：短选项使用单个短横线，如 `-v`；长选项使用两个短横线，如 `--verbose`。

### 快速上手：传入一个参数

```python
import argparse

parser = argparse.ArgumentParser(description='命令行中传入一个数字')
# type 是参数数据类型，help 是提示信息
parser.add_argument('integers', type=str, help='传入的数字')

args = parser.parse_args()

# 获得传入的参数
print(args)  # Namespace(integers='5')
```

- 在命令行运行：

```text
python demo.py -h
# usage: demo.py [-h] integers
# positional arguments:
#   integers    传入的数字
# optional arguments:
#   -h, --help  show this help message and exit
```

- 传入一个参数示例：

```text
python demo.py 5
# 输出: Namespace(integers='5')
```

### 访问解析结果（类似字典）

```python
import argparse

parser = argparse.ArgumentParser(description='命令行中传入一个数字')
parser.add_argument('integers', type=str, help='传入的数字')
args = parser.parse_args()

# 获得 integers 参数
print(args.integers)  # 5
```

### 传入多个参数（nargs）

```python
import argparse

parser = argparse.ArgumentParser(description='命令行中传入一个或多个数字')
parser.add_argument('integers', type=str, nargs='+', help='传入的数字')
args = parser.parse_args()

print(args.integers)  # ['1', '2', '3', '4']
```

- nargs 的补充说明：
  - nargs='*' 表示可设置零个或多个
  - nargs='+' 表示至少一个
  - nargs='?' 表示零个或一个

### 改变数据类型（type）

```python
import argparse

parser = argparse.ArgumentParser(description='命令行中传入若干整数并求和')
parser.add_argument('integers', type=int, nargs='+', help='传入的数字')
args = parser.parse_args()

# 对传入的数据进行加总
print(sum(args.integers))  # 1 2 3 4 -> 10
```

### 位置参数示例

```python
import argparse

parser = argparse.ArgumentParser(description='姓名')
parser.add_argument('param1', type=str, help='姓')
parser.add_argument('param2', type=str, help='名')
args = parser.parse_args()

# 打印姓名
print(args.param1 + args.param2)
```

- 输入顺序不同会得到不同结果：`张 三` -> `张三`，`三 张` -> `三张`。

### 可选参数（更可读）

```python
import argparse

parser = argparse.ArgumentParser(description='姓名')
parser.add_argument('--family', type=str, help='姓')
parser.add_argument('--name', type=str, help='名')
args = parser.parse_args()

print(args.family + args.name)
```

- 运行示例：`python demo.py --family=张 --name=三` -> `张三`

### 默认值（default）

```python
import argparse

parser = argparse.ArgumentParser(description='姓名')
parser.add_argument('--family', type=str, default='张', help='姓')
parser.add_argument('--name', type=str, default='三', help='名')
args = parser.parse_args()

print(args.family + args.name)  # 未提供参数时输出 张三
```

### 必需参数（required）

```python
import argparse

parser = argparse.ArgumentParser(description='姓名')
parser.add_argument('--family', type=str, help='姓')
parser.add_argument('--name', type=str, required=True, default='', help='名')
args = parser.parse_args()

print(args.family + args.name)
```

- 当未传入 `--name` 时，解析器会报错并提示：

```text
usage: demo.py [-h] [--family FAMILY] --name NAME
demo.py: error: the following arguments are required: --name
```

### add_argument 详解

基本语法：

```python
parser.add_argument(name_or_flags, action=None, nargs=None, const=None, default=None,
                    type=None, choices=None, required=None, help=None, metavar=None, dest=None)
```

- name_or_flags：位置参数名或选项参数标志，如 `'filename'` 或 `'-f'/'--file'`
- action：解析行为，如 `'store'`(默认)、`'store_true'`/`'store_false'`、`'append'`、`'count'`
- nargs：接收值的个数，整数或 `'?'`、`'+'`、`'*'`
- const：与 `store_const` 或 `nargs='?'` 配合，提供缺省常量
- default：未提供参数时的默认值
- type：类型转换函数，如 `int`、`float`、`str`
- choices：限定可选值
- required：是否必需（仅对可选参数有效）
- help：帮助文本
- metavar：帮助中显示的占位名
- dest：存储到 `args` 中的属性名

示例：

```python
import argparse

parser = argparse.ArgumentParser(description="示例参数解析器")

parser.add_argument('filename', type=str, help="要处理的文件名")            # 位置参数
parser.add_argument('-v', '--verbose', action='store_true', help="启用详细模式")
parser.add_argument('-t', '--timeout', type=int, default=30, help="超时时间（秒）")
parser.add_argument('--mode', choices=['debug', 'release'], default='debug', help="运行模式")

args = parser.parse_args()

print(args.filename)  # 获取位置参数
print(args.verbose)   # 获取布尔值
print(args.timeout)   # 获取整数值
print(args.mode)      # 获取选项值
```

运行示例：

```bash
$ python script.py myfile.txt --verbose --timeout 60 --mode release
myfile.txt
True
60
release
```

## 💡 实际应用

### 基础用法：小工具示例

```python
# 命令: python resize.py input.jpg --width 800 --height 600 --keep-aspect
import argparse

parser = argparse.ArgumentParser(description='批量图片大小调整')
parser.add_argument('file', help='输入文件路径')
parser.add_argument('--width', type=int, required=True, help='目标宽度')
parser.add_argument('--height', type=int, required=True, help='目标高度')
parser.add_argument('--keep-aspect', action='store_true', help='保持宽高比')
args = parser.parse_args()

print(args)  # 在此处集成你的业务逻辑
```

### 高级用法：计数与追加

```python
import argparse

parser = argparse.ArgumentParser(description='日志与级别')
parser.add_argument('-v', '--verbose', action='count', default=0, help='增加日志详细程度, 可重复 -v')
parser.add_argument('-I', '--include', action='append', default=[], help='可重复传入多个包含路径')
args = parser.parse_args()

print(args.verbose)  # -vvv -> 3
print(args.include)  # --include a --include b -> ['a','b']
```

### 子命令（可扩展 CLI）

```python
import argparse

parser = argparse.ArgumentParser(prog='pkg', description='包管理器')
subparsers = parser.add_subparsers(dest='command', required=True)

# 安装子命令
install = subparsers.add_parser('install', help='安装包')
install.add_argument('name', help='包名')
install.add_argument('-y', '--yes', action='store_true', help='自动确认')

# 卸载子命令
uninstall = subparsers.add_parser('uninstall', help='卸载包')
uninstall.add_argument('name', help='包名')

args = parser.parse_args()
print(args)
```

### 自定义参数类型验证

你可以创建自定义的类型转换函数来验证参数：

```python
import argparse

def check_positive(value):
    """验证参数是否为正数"""
    ivalue = int(value)
    if ivalue <= 0:
        raise argparse.ArgumentTypeError(f"{value} 必须是一个正数")
    return ivalue

def check_file_extension(value):
    """验证文件扩展名"""
    if not value.endswith(('.txt', '.log')):
        raise argparse.ArgumentTypeError(f"文件 {value} 必须是 .txt 或 .log 格式")
    return value

parser = argparse.ArgumentParser(description='参数验证示例')
parser.add_argument('positive_int', type=check_positive, help='正整数参数')
parser.add_argument('--file', type=check_file_extension, help='文本文件路径')

args = parser.parse_args()
print(f"正数: {args.positive_int}, 文件: {args.file}")
```

### 综合实战案例

```python
import argparse
import sys

def create_backup_tool():
    """创建一个完整的备份工具命令行接口"""
    parser = argparse.ArgumentParser(
        prog='backup-tool',
        description='文件备份工具',
        epilog='示例: python backup-tool.py /home/user --dest /backup --compress gzip'
    )
    
    # 位置参数
    parser.add_argument('source', help='源目录路径')
    
    # 必需的可选参数
    parser.add_argument('-d', '--dest', required=True, help='备份目标目录')
    
    # 带默认值的参数
    parser.add_argument('--compress', choices=['none', 'gzip', 'zip'], 
                       default='none', help='压缩格式')
    
    # 布尔标志
    parser.add_argument('--verbose', '-v', action='store_true', help='详细输出')
    parser.add_argument('--dry-run', action='store_true', help='模拟运行，不执行实际操作')
    
    # 数值参数
    parser.add_argument('--threads', type=int, default=4, help='并发线程数')
    
    # 多值参数
    parser.add_argument('--exclude', action='append', default=[], 
                       help='排除的文件模式，可多次指定')
    
    return parser

# 使用示例
if __name__ == '__main__':
    parser = create_backup_tool()
    args = parser.parse_args()
    
    print(f"源目录: {args.source}")
    print(f"目标目录: {args.dest}")
    print(f"压缩格式: {args.compress}")
    print(f"详细模式: {args.verbose}")
    print(f"模拟运行: {args.dry_run}")
    print(f"线程数: {args.threads}")
    print(f"排除模式: {args.exclude}")
```

## ⚠️ 注意事项

- 合理区分位置参数与可选参数，避免用户混淆
- 为每个参数提供清晰的 `help`，提高可用性
- 使用 `choices` 限制非法输入；必要时结合 `type` 做校验
- 使用 `metavar` 改善 `--help` 输出的可读性
- 复杂 CLI 建议使用子命令划分职责
- 自定义类型验证函数应抛出 `ArgumentTypeError` 异常
- 使用 `epilog` 参数提供使用示例

## 🔗 相关内容

- [sys 模块](../sys/) - 命令行参数与系统交互
- [os 模块](../os/) - 文件与路径操作
- [subprocess 模块](../subprocess/) - 运行外部命令
- [optparse 模块 - 过时的选项解析器](../optparse/)

## 📚 扩展阅读

- [官方文档：argparse](https://docs.python.org/3/library/argparse.html)

## 🏷️ 标签

`命令行解析` `参数` `选项` `子命令` `标准库`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档团队  
**版本**: 1.0