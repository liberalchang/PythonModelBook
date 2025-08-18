---
layout: doc
title: 文件名匹配 - fnmatch模块
permalink: /docs/stdlib/fnmatch/
category: stdlib
tags: [文件匹配, 模式匹配, 文件名, shell通配符, fnmatch]
description: Python fnmatch模块详解，使用Unix shell风格的通配符进行文件名匹配与过滤
author: Python文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "入门"
---

# 文件名匹配 - fnmatch模块

## 📝 概述

fnmatch模块提供Unix shell风格的文件名匹配功能，常用于快速过滤文件列表，判断文件名是否符合指定的通配符模式。

## 🎯 学习目标

- 掌握fnmatch模块的核心函数
- 理解大小写敏感与不敏感匹配的差异
- 学会将通配符模式转换为正则表达式
- 在项目中使用fnmatch对文件名进行过滤

## 📋 前置知识

- Python基础
- 文件系统与路径基础
- 通配符匹配概念

## 🔍 详细内容

### 核心函数

#### 1. fnmatch.fnmatch - 基本文件名匹配

```python
import fnmatch
import os

pattern = 'server_*.py'
print('Pattern:', pattern)

files = os.listdir('.')
for name in sorted(files):
    print('文件名: {:<25} {}'.format(name, fnmatch.fnmatch(name, pattern)))
```

#### 2. fnmatch.fnmatchcase - 大小写敏感匹配

```python
import fnmatch
import os

pattern = 'SERVER_*.PY'
print('Pattern:', pattern)

files = os.listdir('.')
for name in sorted(files):
    print('文件名: {:<25} {}'.format(name, fnmatch.fnmatchcase(name, pattern)))
```

#### 3. fnmatch.filter - 过滤匹配文件名

```python
import fnmatch
import os
import pprint

pattern = 'server_*.py'
print('Pattern : ', pattern)

files = list(sorted(os.listdir('.')))
print('Files :')
import pprint
pprint.pprint(files)

print('\nMatches :')
print(fnmatch.filter(files, pattern))
```

#### 4. fnmatch.translate - 转换为正则表达式

```python
import fnmatch

pattern = 'server_*.py'
print('Pattern : ', pattern)

print('正则表达式', fnmatch.translate(pattern))
```

### 常用通配符

| 通配符 | 功能 |
|--------|------|
| * | 匹配0或多个字符 |
| ? | 匹配1个字符 |
| [exp] | 匹配指定范围内的字符，如：[1-9] |
| [!exp] | 匹配不在指定范围内的字符 |

## 💡 实际应用

```python
import fnmatch
import os

def find_python_files(directory):
    """查找目录中的Python文件"""
    python_files = []
    for root, dirs, files in os.walk(directory):
        for filename in fnmatch.filter(files, '*.py'):
            python_files.append(os.path.join(root, filename))
    return python_files

def filter_log_files(file_list):
    """过滤日志文件"""
    return fnmatch.filter(file_list, '*.log')
```

## ⚠️ 注意事项

- 大小写敏感性：`fnmatch()`是否区分大小写取决于操作系统；`fnmatchcase()`总是区分大小写
- 路径分隔符：注意Windows和类Unix系统的路径分隔符差异
- 功能限制：只支持简单通配符，不支持复杂模式

## 🔗 相关内容

- [正则表达式 - re](../re/)
- [文件通配符 - glob](../glob/)
- [os模块 - 操作系统接口](../os/)
- [pathlib模块 - 路径处理](../pathlib/)

## 📚 扩展阅读

- [fnmatch模块官方文档](https://docs.python.org/3/library/fnmatch.html)

## 🏷️ 标签

`文件匹配` `模式匹配` `shell通配符` `文件过滤` `fnmatch`

---

**最后更新**: 2024-01-15  
**作者**: Python文档团队  
**版本**: 1.0