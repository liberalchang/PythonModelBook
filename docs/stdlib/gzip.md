---
layout: doc
title: gzip压缩 - gzip模块
permalink: /docs/stdlib/gzip/
category: stdlib
tags: [gzip, 压缩算法, 数据压缩, 文件压缩, 二进制处理, 数据传输]
description: Python gzip模块详解，基于zlib提供GNU zip格式的压缩与解压，支持文件、内存与流式处理
author: Python文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "初级"
---

# gzip压缩 - gzip模块

## 📝 概述

gzip模块为GNU zip文件提供了一个类似文件的接口，它内部使用zlib来压缩和解压数据，支持对文件、内存和网络流进行压缩处理。gzip在压缩速度与压缩比之间有较好的平衡，适合日志归档、网络传输等常见场景。

## 🎯 学习目标

- 了解gzip模块的核心用法与适用场景
- 掌握压缩级别的设置与取舍
- 学会对文件与内存进行读取与压缩
- 理解seek定位读取的工作方式
- 掌握BytesIO等内存流配合gzip的用法

## 📋 前置知识

- Python基本语法与文件I/O
- 二进制与文本编码基础
- zlib与压缩算法的基本概念

## 🔍 详细内容

### 核心功能

| 功能 | 方法/类 | 描述 |
|------|---------|------|
| 文件压缩/解压 | `gzip.open()` | 读写.gz压缩文件 |
| 内存压缩 | `gzip.GzipFile(fileobj=...)` | 结合BytesIO进行内存压缩 |
| 压缩级别 | `compresslevel` | 0-9，数值越大压缩效果越好但速度更慢 |
| 文本包装 | `io.TextIOWrapper` | 在二进制流外包裹文本编码 |

## 💡 实际应用

### 1. 写入gzip压缩文件

```python
#!/usr/bin/env python3
# encoding: utf-8

import gzip
import io
import os

out_file_name = "example.text.gz"
with gzip.open(out_file_name, 'wb') as output:
    with io.TextIOWrapper(output, encoding='utf-8') as enc:
        enc.write('test gzip content')
print(out_file_name, '包含的大小:{}bytes'.format(os.stat(out_file_name).st_size))
```

### 2. 压缩级别的测试与选择

```python
#!/usr/bin/env python3
# encoding: utf-8

import gzip
import io
import os
import hashlib

def get_hash(data):
    """返回md5值"""
    return hashlib.md5(data).hexdigest()

# 读取文件内容，并且复制1024份出来
data = open('content.txt', 'r').read() * 1024

# 输入文件内容，返回md5值
check_sum = get_hash(data.encode('utf-8'))

print('Level  Size        Checksum')
print('-----  ----------  ---------------------------------')
print('data   {:>5}      {}'.format(len(data), check_sum))

for i in range(0, 10):
    file_name = 'compress-level-{}.gz'.format(i)
    with gzip.open(file_name, 'wb', compresslevel=i) as output:
        with io.TextIOWrapper(output, encoding='utf-8') as enc:
            enc.write(data)
    size = os.stat(file_name).st_size
    check_sum = get_hash(open(file_name, 'rb').read())
    print('   {}   {:>4}        {}'.format(i, size, check_sum))
```

### 3. 多行写入压缩文件

```python
#!/usr/bin/env python3
# encoding: utf-8

import gzip
import io
import itertools

with gzip.open('example_line.txt.gz','wb') as output:
    with io.TextIOWrapper(output,encoding='utf-8') as enc:
        enc.writelines(
            itertools.repeat('The same line\n',10)  # 重复写入10次
        )
```

### 4. 读取gzip压缩文件内容

```python
#!/usr/bin/env python3
# encoding: utf-8

import gzip
import io

with gzip.open('example.text.gz', 'rb') as input_file:
    with io.TextIOWrapper(input_file, encoding='utf-8') as dec:
        print(dec.read())
```

### 5. seek定位读取

```python
#!/usr/bin/env python3
# encoding: utf-8

import gzip

with gzip.open('example.text.gz', 'rb') as input_file:
    print('读取整个压缩文件的内容')
    all_data = input_file.read()
    print(all_data)
    expected = all_data[5:10]  # 切片取值
    print('切片取值：', expected)

    # 将流文件的指针切至起始点
    input_file.seek(0)

    # 将流文件的指针切至5的下标
    input_file.seek(5)

    new_data = input_file.read(5)
    print('移动指针取值：', new_data)
    print('判断两种取值是否一样：', expected == new_data)
```

### 6. gzip字节流的处理（BytesIO）

```python
#!/usr/bin/env python3
# encoding: utf-8

import gzip
from io import BytesIO
import binascii

# 获取未压缩的数据
uncompress_data = b'The same line,over and over.\n' * 10
print('Uncompressed Len:', len(uncompress_data))
print('Uncompress Data:', uncompress_data)

buffer = BytesIO()
with gzip.GzipFile(mode='wb', fileobj=buffer) as f:
    f.write(uncompress_data)

# 获取压缩的数据
compress_data = buffer.getvalue()
print('Compressed:', len(compress_data))
print('Compress Data:', binascii.hexlify(compress_data))

# 重新读取数据
inbuffer = BytesIO(compress_data)
with gzip.GzipFile(mode='rb', fileobj=inbuffer) as f:
    reread_data = f.read(len(uncompress_data))
print('利用未压缩的长度，获取压缩后的数据长度:', len(reread_data))
print(reread_data)
```

## ⚠️ 注意事项

- compresslevel范围0-9，0表示不压缩，9压缩比最高但速度最慢
- 对于文本数据，建议搭配io.TextIOWrapper进行编码解码
- 使用seek时，注意对文本模式与二进制模式的区别
- 对小文件的压缩，可能会因格式头导致体积略增

## 🔗 相关内容

- [bz2模块 - bzip2压缩](../bz2/)
- [zlib模块 - zlib压缩](../zlib/)
- [os模块 - 文件与目录](../os/)
- [io模块 - 文本与二进制I/O](../io/)

## 📚 扩展阅读

- [gzip模块官方文档](https://docs.python.org/3/library/gzip.html)
- [GZIP文件格式说明](https://www.rfc-editor.org/rfc/rfc1952)

## 🏷️ 标签

`gzip` `压缩算法` `数据压缩` `文件压缩` `二进制处理` `数据传输`

---

**最后更新**: 2024-01-15  
**作者**: Python文档团队  
**版本**: 1.0