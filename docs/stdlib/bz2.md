---
layout: doc
title: bz2压缩 - bz2模块
permalink: /docs/stdlib/bz2/
category: stdlib
tags: [bz2, 压缩算法, 数据压缩, 文件压缩, 二进制处理, 数据传输]
description: Python bz2模块详解，提供高效的bzip2压缩和解压缩功能，支持内存操作、文件操作和网络传输场景
author: Python文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# bz2压缩 - bz2模块

## 📝 概述

bz2模块用于压缩数据以便存储或传输，提供了基于bzip2算法的高效压缩功能。该模块支持三种压缩/解压方式：一次性压缩/解压数据、迭代式压缩/解压数据、类似文件的类方式的压缩/解压数据。bzip2算法具有较高的压缩比，特别适用于大文件的压缩和网络传输。

## 🎯 学习目标

- 掌握bz2模块的三种压缩/解压方式
- 学会使用内存压缩与解压功能
- 理解增量压缩和文件操作
- 掌握压缩等级的选择和优化
- 学会在网络传输中应用bz2压缩

## 📋 前置知识

- Python基本语法和文件操作
- 二进制数据处理概念
- 网络编程基础（用于高级示例）
- 了解压缩算法的基本原理

## 🔍 详细内容

### 安装注意事项

```python
# 注意：
# 如果安装python的时候，没有安装bzip2-devel，导入bz2模块时，会报如下错误：
# ModuleNotFoundError: No module named bz2
# 解决方法：
# yum install bzip2-devel -y
# 重新编译安装python的源码即可
```

### 核心功能

bz2模块提供以下主要功能：

| 功能 | 方法/类 | 描述 |
|------|---------|------|
| **内存压缩** | `bz2.compress()` | 一次性压缩数据 |
| **内存解压** | `bz2.decompress()` | 一次性解压数据 |
| **增量压缩** | `BZ2Compressor` | 迭代式压缩处理 |
| **增量解压** | `BZ2Decompressor` | 迭代式解压处理 |
| **文件压缩** | `BZ2File` | 类文件对象处理 |
| **压缩等级** | `compresslevel` | 控制压缩比与速度 |

## 💡 实际应用

### 1. 内存压缩与解压示例

```python
#!/usr/bin/env python3
# encoding: utf-8

import bz2
import binascii

# 数据源
original_data = b'This is the original text.'
print('数据源长度: {} bytes'.format(len(original_data)))
print('数据源: ', original_data)

compressed = bz2.compress(original_data)
print('压缩后的数据源长度 : {} bytes'.format(len(compressed)))
hex_version = binascii.hexlify(compressed)
print(hex_version)

# 这里主要学习是如下，数据的折分方法
for i in range(len(hex_version) // 40 + 1):
    print(hex_version[i * 40:(i + 1) * 40])
```

运行效果：
```python
数据源长度: 26 bytes
数据源:  b'This is the original text.'
压缩后的数据源长度 : 62 bytes
b'425a683931415926535916be35a600000293804001040022e59c402000314c000111e93d434da223028cf9e73148cae0a0d6ed7f17724538509016be35a6'
b'425a683931415926535916be35a6000002938040'
b'01040022e59c402000314c000111e93d434da223'
b'028cf9e73148cae0a0d6ed7f17724538509016be'
b'35a6'
```

### 2. 根据数据源的长度，判断何时压缩数据时是最佳的示例

```python
#!/usr/bin/env python3
# encoding: utf-8

import bz2

original_data = b'This is the original text.'

fmt = '{:>15} {:>15}'
print(fmt.format('len(data)', 'len(compressed)'))
print(fmt.format('-' * 15, '-' * 15))
for i in range(5):
    data = original_data * i
    compressed = bz2.compress(data)
    print(fmt.format(len(data), len(compressed)), end='')  # 加end表示，结尾不使用回车符
    print('*' if len(data) < len(compressed) else '')  # 使用三目运算
```

运行效果：
```python
      len(data) len(compressed)
--------------- ---------------
              0              14*
             26              62*
             52              68*
             78              70  # 长度78时，可以使用压缩最好
            104              72
```

### 3. bz2增量压缩文件

```python
#!/usr/bin/env python3
# encoding: utf-8

import bz2
import binascii
import io

compressor = bz2.BZ2Compressor()

# 打开文件，类型为字节，读模式
with open('content.txt', 'rb') as input:
    while True:
        block = input.read(64)  # 每次读取64字节
        if not block:
            break
        compressed = compressor.compress(block)  # 压缩文件
        if compressed:
            print('压缩: {}'.format(binascii.hexlify(compressed)))
        else:
            print('缓存中...')
    remaining = compressor.flush()
    print('刷新所有的压缩数据:{}'.format(binascii.hexlify(remaining)))
```

### 4. bz2.BZ2Decompressor()的unused_data属性的使用示例

```python
import bz2

content = open('content.txt', 'rt').read().encode('utf-8')
compressed = bz2.compress(content)  # 压缩的数据
combined = compressed + content  # 压缩的数据+未压缩的数据

# 创建一个解压的对象
decompressor = bz2.BZ2Decompressor()

# 解压混合的数据
decompressed = decompressor.decompress(combined)

# 判断解压数据与未解压数据是否相等
decompressed_matches = decompressed == content
print('解压数据与未解压数据是否相等', decompressed_matches)

# 判断解压对象的unused_data（即包含所有未使用的数据）与未解压数据是否相等
unused_matche = decompressor.unused_data == content
print('解压对象的unused_data（即包含所有未使用的数据）与未解压数据是否相等', unused_matche)
```

### 5. 内容压缩成bz2格式文件的示例

```python
import bz2
import io
import os

data = "Content of the example  file go here.\n"

with bz2.BZ2File('example.bz2','wb') as output:
    with io.TextIOWrapper(output,encoding='utf-8') as enc:
        enc.write(data)
os.system('file example.bz2')
```

### 6. bz2设置压缩等级进行压缩

```python
import bz2
import io
import os

data = open('content.txt', 'r', encoding='utf-8').read() * 1024
print('输入 {} 字节'.format(len(data.encode('utf-8'))))

for i in range(1, 10):
    filename = 'compress-level-{}.bz2'.format(i)
    with bz2.BZ2File(filename, 'wb', compresslevel=i) as output:
        with io.TextIOWrapper(output, encoding='utf-8') as enc:
            enc.write(data)
    os.system('cksum {}'.format(filename))
```

运行效果：
```python
输入 344064 字节
3563292108 2598 compress-level-1.bz2
2570483258 1426 compress-level-2.bz2
3725315122 1275 compress-level-3.bz2
766048418 617 compress-level-4.bz2  # 这个开始最佳
1786876353 617 compress-level-5.bz2
2751081060 617 compress-level-6.bz2
3839050503 617 compress-level-7.bz2
84226287 617 compress-level-8.bz2
1110202764 617 compress-level-9.bz2
```

### 7. bz2多行写入压缩数据

```python
import bz2
import io
import os
import itertools

data = 'The same line,over and over.\n'
with bz2.BZ2File('lines.bz2', 'wb') as output:
    with io.TextIOWrapper(output, encoding='utf-8') as enc:
        enc.writelines(itertools.repeat(data, 10))

os.system('bzcat lines.bz2')
```

### 8. 读取压缩文件

```python
import bz2
import io

with bz2.BZ2File('example.bz2', 'rb') as input:
    with io.TextIOWrapper(input, encoding='utf-8') as enc:
        print(enc.read())
```

### 9. bz2 seek()移位取值的示例

```python
#!/usr/bin/env python3
# encoding: utf-8

import bz2

with bz2.BZ2File('example.bz2', 'rb') as input:
    print('读取压缩文件内容')
    all_data = input.read()
    print('内容:', all_data)

    # 切片取值
    expected = all_data[5:15]

    # 指针指向0
    input.seek(0)

    # 指针移动5位
    input.seek(5)
    print('开始相对下标获取5到10个字节')
    partial = input.read(10)
    print('移动指针后获取的值', partial)
    print('一次性取值切片获取的值', expected)
```

### 10. bz2 seek() Unicode编码的注意示例

```python
#!/usr/bin/env python3
# encoding: utf-8

import bz2

data = 'Character with an åccent.'

with bz2.open('example.bz2', 'wt', encoding='utf-8') as output:
    output.write(data)

with bz2.open('example.bz2', 'rt', encoding='utf-8') as input:
    print('压缩文件所有的内容:{}'.format(input.read()))

with bz2.open('example.bz2', 'rt', encoding='utf-8') as input:
    input.seek(18)
    print('读取第一个字符{}'.format(input.read(1)))

with bz2.open('example.bz2', 'rt', encoding='utf-8') as input:
    input.seek(19)
    try:
        print('读取第一个字符{}', input.read(1))
    except UnicodeDecodeError:
        print('错误：解码失败,因为文件指针是针对字节移动，而不是按字符移动，unicode编码占2个字节')
```

### 11. bz2网络传输压缩与解压数据的示例

服务端代码：
```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import bz2
import socketserver
import logging
import binascii

BLOCK_SIZE = 32

class Bz2RequestHandler(socketserver.BaseRequestHandler):
    logger = logging.getLogger('Server')

    def handle(self):
        # 创建一个压缩对象
        compressor = bz2.BZ2Compressor()
        file_name = self.request.recv(1024).decode('utf-8')
        self.logger.debug('接收到客户端文件名：%s', file_name)
        with open(file_name, 'rb') as input:
            while True:
                block = input.read(BLOCK_SIZE)
                if not block:
                    break
                self.logger.debug('读取到数据：%r', block)
                # 压缩数据
                compressed = compressor.compress(block)
                if compressed:
                    self.logger.debug('发送中 %r', binascii.hexlify(compressed))
                    self.request.send(compressed)
                else:
                    self.logger.debug('缓存中...')
        # 获取缓存所有的压缩数据
        remaining = compressor.flush()
        while remaining:
            to_send = remaining[:BLOCK_SIZE]
            remaining = remaining[BLOCK_SIZE:]
            self.logger.debug('FLUSHING %r', binascii.hexlify(to_send))
            self.request.send(to_send)
        return


if __name__ == '__main__':
    address = ('localhost', 8888)
    server = socketserver.TCPServer(address, Bz2RequestHandler)
    ip, port = server.server_address
    server.serve_forever()
```

客户端代码：
```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import socket
import sys
from io import StringIO
import logging
import bz2
import binascii

if __name__ == '__main__':
    BLOCK_SIZE = 64

    logging.basicConfig(level=logging.DEBUG, format='%(name)s : %(message)s')
    server_address = ('localhost', 8888)
    logger = logging.getLogger('Client')
    logging.debug('连接服务器: %s:%s', server_address[0], server_address[1])
    sk = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sk.connect(server_address)

    # 输入文件名的参数
    requested_file = (sys.argv[0] if len(sys.argv) > 1 else "content.txt")

    sk.send(requested_file.encode('utf-8'))

    buffer = StringIO()
    decompressor = bz2.BZ2Decompressor()  # 创建解压对像

    while True:
        response = sk.recv(BLOCK_SIZE)
        if not response:
            break
        logging.debug('读取到 %r', binascii.hexlify(response))

        decompressed = decompressor.decompress(response)
        print(decompressed)
        if decompressed:
            logging.debug('解压数据 %r', decompressed)
            buffer.write(decompressed.decode('utf-8'))
        else:
            logging.debug('缓存中...')

    full_response = buffer.getvalue()
    content = open(requested_file, 'rt').read()
    logging.debug('读取文件内容与服务器响应数据的匹配: %s', full_response == content)

    sk.close()
```

## ⚠️ 注意事项

- **压缩效率**：小文件压缩后可能比原文件更大，建议用于较大文件
- **压缩等级**：等级1-9，数字越大压缩率越高但速度越慢，等级4-9通常效果最佳
- **Unicode处理**：使用seek()时注意Unicode字符可能占用多个字节
- **内存使用**：大文件建议使用增量压缩避免内存溢出
- **依赖安装**：确保系统已安装bzip2-devel包

## 🔗 相关内容

- [gzip模块 - GNU zip压缩](../gzip/)
- [zlib模块 - zlib压缩](../zlib/)
- [文件操作 - os模块](../os/)
- [二进制IO - io模块](../io/)

## 📚 扩展阅读

- [bz2模块官方文档](https://docs.python.org/3/library/bz2.html)
- [bzip2算法说明](https://en.wikipedia.org/wiki/Bzip2)

## 🏷️ 标签

`bz2` `压缩算法` `数据压缩` `文件压缩` `网络传输` `二进制处理`

---

**最后更新**: 2024-01-15  
**作者**: Python文档团队  
**版本**: 1.0