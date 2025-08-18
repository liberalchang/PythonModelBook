---
layout: doc
title: csv 模块
permalink: /docs/stdlib/csv/
category: stdlib
tags: [CSV, 文件, I/O, 数据格式]
description: Python csv 模块详解 - 读写逗号分隔值文本，支持方言、定制分隔符与编码
author: Python教程
date: 2024-12-19
updated: 2024-12-19
version: 1.0
difficulty: "入门"
---

# csv 模块

## 📝 概述

csv 模块用于读写 CSV（逗号分隔值）文件，支持多种方言（dialect）、自定义分隔符、转义规则与引用策略，广泛用于数据交换与表格处理。

## 🎯 学习目标

- 熟悉 reader、DictReader、writer、DictWriter 的使用
- 掌握换行与编码在不同平台的正确配置
- 能够定制分隔符、引号、转义符

## 📋 前置知识

- 文本文件读写、编码基础
- 基本的列表、字典操作

## 🔍 详细内容

### 读取 CSV：列表与字典两种形式

```python
# -*- coding: utf-8 -*-
import csv

# 列表形式读取
with open('data.csv', 'r', encoding='utf-8', newline='') as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)  # 每行是一个列表

# 字典形式读取（首行作为表头）
with open('data.csv', 'r', encoding='utf-8', newline='') as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row['name'], row.get('age'))
```

### 写入 CSV：列表与字典两种形式

```python
# -*- coding: utf-8 -*-
import csv

rows = [
    ['name', 'age', 'city'],
    ['Alice', '30', 'Beijing'],
    ['Bob', '25', 'Shanghai'],
]

with open('out.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)

# 字典写入（字段顺序由 fieldnames 控制）
fieldnames = ['name', 'age', 'city']
with open('out2.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerow({'name': 'Alice', 'age': 30, 'city': 'Beijing'})
```

### 自定义分隔符、引用与转义

```python
# -*- coding: utf-8 -*-
import csv

with open('semicolon.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(
        f,
        delimiter=';',        # 分号分隔
        quotechar='"',        # 引号字符
        quoting=csv.QUOTE_MINIMAL,
        escapechar='\\',     # 转义符
    )
    writer.writerow(['a;b', 'x"y', 'hello\\world'])
```

### 处理大文件：流式与迭代

```python
# -*- coding: utf-8 -*-
import csv

def iter_csv_rows(path):
    # 使用生成器逐行处理，降低内存占用
    with open(path, 'r', encoding='utf-8', newline='') as f:
        for row in csv.reader(f):
            yield row

for row in iter_csv_rows('big.csv'):
    # 在此进行业务处理
    pass
```

## 💡 实际应用

### 1. 与 json 配合完成格式转换

```python
# -*- coding: utf-8 -*-
import csv, json

# CSV -> JSON 数组
with open('data.csv', 'r', encoding='utf-8', newline='') as f:
    items = list(csv.DictReader(f))

with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

# JSON -> CSV
items = [
    {"name": "Alice", "age": 30},
    {"name": "Bob", "age": 25},
]
with open('out.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'age'])
    writer.writeheader()
    writer.writerows(items)
```

### 2. 与 urllib 结合：下载并解析在线 CSV

```python
# -*- coding: utf-8 -*-
from urllib.request import urlopen
import csv, io

url = 'https://people.sc.fsu.edu/~jburkardt/data/csv/airtravel.csv'
with urlopen(url, timeout=5) as resp:
    text = resp.read().decode('utf-8')

reader = csv.DictReader(io.StringIO(text))
for row in reader:
    print(row)
```

## ⚠️ 注意事项

- Windows 下打开文件时务必传 newline='' 以避免额外空行
- 字段中包含分隔符、换行或引号时需正确设置 quoting/escapechar
- 注意编码一致性，必要时检测并转换编码

## 🔗 相关内容

- [json 模块](../json/) - JSON 格式互转
- [io 模块](../io/) - 文本与二进制 I/O
- [urllib 模块](../urllib/) - 下载在线 CSV

## 📚 扩展阅读

- 官方文档：https://docs.python.org/3/library/csv.html
- RFC 4180（CSV）：https://www.rfc-editor.org/rfc/rfc4180

## 🏷️ 标签

`CSV` `文件` `I/O` `数据格式`

---

**最后更新**: 2024-12-19  
**作者**: Python教程  
**版本**: 1.0