---
layout: doc
title: pathlib 模块 - 面向对象的路径处理
permalink: /docs/stdlib/pathlib/
category: stdlib
tags: [pathlib, 路径处理, 文件系统, 跨平台, 面向对象]
description: Python pathlib 模块提供了面向对象的文件系统路径操作，覆盖路径拼接、查询、遍历等常见任务
author: Python 文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# pathlib 模块 - 面向对象的路径处理

## 📝 概述

pathlib 模块自 Python 3.4 引入，提供了面向对象的文件系统路径处理方式。相比 os.path，pathlib 使用更直观的类和方法来表示和操作路径，具备更好的可读性与跨平台兼容性。

## 🎯 学习目标

- 理解 Path 与 PurePath 的区别
- 掌握路径创建、查询、遍历等常见操作
- 学会跨平台安全处理路径
- 掌握文件与目录的增删改操作
- 熟悉路径模式匹配（glob）

## 📋 前置知识

- Python 基础语法
- 文件系统基本概念（路径、文件、目录）
- 异常处理

## 🔍 详细内容

### Path 类

Path 是 pathlib 模块的核心类，用于表示一个操作系统上的实际路径，支持大量方法来操作文件和目录。

#### 常用方法

- Path.cwd(): 获取当前工作目录
- Path.home(): 获取用户主目录
- Path.exists(): 判断路径是否存在
- Path.is_dir(): 是否为目录
- Path.is_file(): 是否为文件
- Path.mkdir(): 创建目录
- Path.rmdir(): 删除空目录
- Path.unlink(): 删除文件
- Path.rename(): 重命名
- Path.glob(): 模式匹配查找
- Path.resolve(): 解析为绝对路径

#### 示例

```python
from pathlib import Path

# 获取当前工作目录和用户主目录
path = Path.cwd()
print(path)
print(Path.home())

# 判断路径是否存在、是否为目录/文件
print(path.exists())
print(path.is_dir())
print(path.is_file())

# 创建/删除目录
Path("testdir").mkdir(exist_ok=True)
Path("testdir").rmdir()

# 创建/删除文件
f = Path("test.txt")
f.touch()   # 创建空文件
f.unlink()  # 删除文件

# 重命名文件
Path("old.txt").write_text("demo")
Path("old.txt").rename("new.txt")
Path("new.txt").unlink()

# 查找匹配的文件
for p in Path(".").glob("*.md"):
    print(p)
```

### PurePath 类

PurePath 是“纯路径”类，不涉及实际文件系统操作，适用于仅做路径解析和格式化的场景。在不同平台上，PurePath 会根据平台风格解析路径，但不会访问文件系统。

#### 常用属性与方法

- PurePath.joinpath(): 连接多个路径
- PurePath.parent: 父路径
- PurePath.name: 名称
- PurePath.suffix: 后缀名
- PurePath.suffixes: 所有后缀
- PurePath.stem: 主体名

### 路径创建与解析

```python
from pathlib import Path

# 创建 Path 对象（不会访问文件系统）
p = Path('folder') / 'sub' / 'file.txt'  # 使用 / 进行路径拼接
print(p)  # 自动使用当前平台的分隔符

# 解析为绝对路径
print(p.resolve())

# 获取父目录和名称
print(p.parent)  # folder/sub
print(p.name)    # file.txt
print(p.stem)    # file
print(p.suffix)  # .txt
print(p.suffixes)  # ['.tar', '.gz'] 等
```

### 目录遍历与查找

```python
from pathlib import Path

# 遍历目录（非递归）
for path in Path('.').iterdir():
    print(path)

# 模式匹配（递归）
for path in Path('.').rglob('*.py'):
    print(path)
```

### 安全创建目录与文件

```python
from pathlib import Path

# 递归创建目录
Path('my_dir/sub').mkdir(parents=True, exist_ok=True)

# 创建文件（若存在则不覆盖）
f = Path('file.txt')
if not f.exists():
    f.touch()
```

### 跨平台注意事项

- 使用 Path 或 PurePath，而不是手写分隔符
- 使用运算符 / 进行路径拼接，可读性更强
- 在需要字符串路径时，使用 str(Path对象)

### 从 os.path 迁移到 pathlib

```python
import os
from pathlib import Path

# os.path 风格
os_path = os.path.join('a', 'b', 'c.txt')
print(os_path)

# pathlib 风格
pl_path = Path('a') / 'b' / 'c.txt'
print(pl_path)
```

## 💡 实际应用

### 文件处理常用模式

```python
from pathlib import Path

# 写入文本
p = Path('demo.txt')
p.write_text('Hello, pathlib!', encoding='utf-8')

# 读取文本
text = p.read_text(encoding='utf-8')
print(text)

# 二进制读写
binp = Path('data.bin')
binp.write_bytes(b'\x00\x01')
print(binp.read_bytes())

# 批量改名
for i, file in enumerate(Path('.').glob('*.log')):
    file.rename(f"log_{i}.log")
```

### 路径模式注意事项（与 os.path.join 对照）

```python
from pathlib import Path

# 路径拼接：右侧为绝对路径会覆盖左侧
print(Path('aaa') / '/bbb' / 'ccc.txt')  # 输出: /bbb/ccc.txt

# 使用 joinpath 行为一致
print(Path('aaa').joinpath('/bbb', 'ccc.txt'))

# 处理包含 ./ 的路径
print(Path('/aaa').joinpath('./bbb', 'ccc.txt'))  # /aaa/bbb/ccc.txt
print(Path('aaa').joinpath('./bbb', 'ccc.txt'))   # aaa/bbb/ccc.txt
```

## ⚠️ 注意事项

- Path.unlink() 删除文件时，若不存在会抛出 FileNotFoundError，需要捕获或先判断 exists()
- Path.rmdir() 只能删除空目录，删除非空目录请使用 shutil.rmtree()
- Path.resolve() 在路径不存在时可能抛出异常，注意捕获

## 🔗 相关内容

- [os 模块 - 操作系统接口](../os/)
- [shutil 模块 - 高级文件操作](../shutil/)
- [open() 函数 - 文件打开操作](../../builtins/open/)

## 📚 扩展阅读

- [Python 官方文档 - pathlib](https://docs.python.org/3/library/pathlib.html)
- [PEP 428 - pathlib: object-oriented filesystem paths](https://peps.python.org/pep-0428/)

## 🏷️ 标签

`pathlib` `路径处理` `面向对象` `跨平台` `文件系统`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档团队  
**版本**: 1.0