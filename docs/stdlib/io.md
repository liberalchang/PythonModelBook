---
layout: doc
title: 文本与二进制I/O - io模块
permalink: /docs/stdlib/io/
category: stdlib
tags: [io, 文本IO, 二进制IO, StringIO, BytesIO, 文件操作]
description: Python io模块详解，覆盖文本I/O、二进制I/O、原始I/O的类层次结构与用法，包含StringIO与BytesIO的实战示例
author: Python文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# 文本与二进制I/O - io模块

## 📝 概述

io模块提供了Python用于处理各种类型I/O的主要工具，包括文本I/O、二进制I/O和原始I/O。io以抽象基类（ABC）组织类层次，提供了文件与内存I/O的一致接口，并通过StringIO与BytesIO支持内存中文本与二进制的读写。

## 🎯 学习目标

- 了解io模块的类层次结构与抽象基类
- 掌握文本I/O与二进制I/O的创建与使用
- 熟悉StringIO与BytesIO在内存I/O中的典型用法
- 理解缓冲、编码与换行符处理
- 知道RawIO与缓冲IO的差异与适用场景

## 📋 前置知识

- Python文件I/O基础
- 文本编码（如UTF-8）与二进制处理
- 迭代器与上下文管理器基础

## 🔍 详细内容

### 快速示例：StringIO

```python
import io
# 1、生成一个StringIO对象：
s = io.StringIO()

# 2、write()从读写位置将参数写入到对象s，参数为str类型，读写位置被移动
s.write('Hello World\n')

# 3、getvalue()：返回对象s中的所有数据
print(s.getvalue())

# 4、read(n)：限定读取长度
s = io.StringIO('Hello World\n')
print(s.read(2))     # He
print(s.read())      # llo World\n
# 5、readline(length)：限定读取到length或到行末\n
s = io.StringIO('Hello World\n')
print(s.readline(7)) # Hello W
```

### 快速示例：BytesIO

```python
import io
# 实例化一个BytesIO对象
s = io.BytesIO()
# 写入字节数据
s.write(b"hello world")
# 取回写入的字节
print(s.getvalue())  # b'hello world'

# 结合图片/网络：
from PIL import Image
import requests
res = requests.get('https://cn.bing.com/th?id=OHR.CorkTrees_ZH-CN1253123792_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp', stream=True)
# 初始化BytesIO对象并写入数据
s = io.BytesIO(res.content)
r = Image.open(s)            # Image打开字节流
print(r.format)              # 图片格式
print(r.size)                # 图片尺寸
r2 = s.getvalue()            # 图片字节流
```

## 1、io概述

io模块提供了python用于处理各种类型I/O的主要工具，主要有三种类型的I/O：文本I/O，二进制I/O和原始I/O；这些都是通用类型，各种后备存储可使用其中的每一种类型，所以这些类型的具体对象称为文件对象。他通常的术语叫流和文件对象。

每个具体流对象都具有各种功能：可以是只读，只写或读写。它可以允许任意的随机访问；向前或向后寻找任何位置或者只允许顺序访问如套接字或管道的情况下。

所有的流都会检测提供给它的数据类型，如给二进制流str字符类型的write()的写方法将会引发一个TypeError

## 2、io类层次结构

I/O流的实现被组织为类的层次结构，第一个抽象基类为ABCs,用于指定不同类别的流，然后提供标准流实现的具体类。

I/O层次结构的顶部是抽象基类IOBase,它定义了流的基本接口，但读取和写入流之间没有分离。

RawIOBase它是IOBase延伸的类，用来处理字节读取和写入流，RawIOBase的子类为机器文件系统中的文件提供接口。

BufferedIOBase类继承RawIOBase类，它的子类：BufferedWriter，BufferedReader，BufferedRWPair三个缓冲流类，实现功能为可写，可读，以及可读写。BufferedRandom子类为随机访问流提供缓冲接口，另一个子类BytesIO是内存中字节流。

TextIOBase类继承IOBase,用于处理字节表示文本流，并从字符串处理编码和解码。它的子类:TextIOWrapper是缓冲的原始流BufferedIOBase的缓冲文本接口，StringIO是文本的内存流。

总结io模块提供的类层次方法：

|类名|继承|存根方法|Mixin方法和属性|
|---|---|---|---|
|IOBase||fileno，seek和truncate|close，closed，__enter__，__exit__，flush，isatty，__iter__，__next__，readable，readline，readlines，seekable，tell，writable，writelines|
|RawIOBaes|IOBase|readinto,write|继承的IOBase方法read和readall|
|BufferedIOBase|IOBase|detah,read,readl,write|继承IOBase方法readinto,readintol|
|TextioBase|IOBase|detach,read,readline,write|继承IOBase方法encoding,errors,newlines|

## 3、IO基类

### （1）class io.IOBase

所有IO类的抽象基类，作用于字节流，没有公共构造函数。

它为派生类提供了许多方法，IOBase类以及其子类都支持迭代器协议。

IOBase提供的数据属性和方法：

- close()：冲洗并关闭此流，一旦文件关闭，对文件的任何操作都会引发一次ValueError异常
- closed()：如果流文件被关闭则返回True否则返回False
- fileno()：返回流的底层文件描述符为整数
- flush()：刷新流到写入缓冲区
- isatty()：如果流是交互式即连接到终端设备则返回True否则返回False
- readable()：如果可以从流中读取则返回True否则返回False
- readline(size=-1)：从流中读取并返回一行，如果size指定，则读取指定大小字节的数据
- readlines(hint=-1)：从流中读取并返回行列表，可以指定hint来控制读取的行数。
- seek(offset[,whence])：将流位置更改为给定的字节偏移量（offset），whence为偏移量指示位置，默认为SEEK_SET即0流的开始位置
- seekable()：如果流支持随机访问则返回True否则返回false
- tell()：返回当前流的位置
- truncate(size=None)：将流大小调整为以字节为单位的给定大小（size），返回新的文件大小
- writable()：如果流支持写入则返回true，否则返回false
- writelines()：写入流列表，不提供换行符
- __del__()：销毁对象，close()方法为此方法的默认实现

### （2）class io.RawIOBase

原始二进制IO的基类，它继承IOBase，没有公共构造函数

原始二进制IO通常提供对底层操作系统设备或API的低级别访问。

除了IOBase提供的属性和方法外，RawIOBase还提供了以下方法：

- read(size=-1)：从对象中读取size指定大小的字节并返回
- readall()：读取并返回流中的所有字节
- readinto(b)：将字节读入预先分配的可写类字节对象b，并返回读取的字节数
- write(b)：写入给定类字节对象b，并返回写入字节的数目

### （3）class io.BufferedIOBase

支持以缓冲的二进制流的基类，它继承IOBase，没有公共构造函数。

它与RawIOBase的区别在于方法read(),readinto()和write()，都将尝试读取尽可能多的输入或者消耗所有给定的输出，会造成多次系统调用。

BufferedIOBase继承或覆盖IOBase的属性和方法：

- detach()：将底层原始流从缓冲区分离出来并返回

## 4、文本IO

文本IO所产生的是str对象，如果后备存储本身使用的是字节组成，可以通过编码和解码数据来适应平台数据类型。

文件和内存文本流的创建方法：

```python
import io
# 文件创建文本流
f = open('myfile.txt','r',encoding='utf-8')

# 内存中的文本流可以使用StringIO对象来创建
f1 = io.StringIO("some initial text datal")
print(f1.getvalue()) # 读取文本流信息
```

### （1）class io.TextIOBase

文本流的基类，这个类提供了一个基于字符和行的接口流IO，没有readinto()方法，因为python的字符串是不可变的，它继承IOBase。

TextIOBase继承或覆盖了IOBase的属性和方法外，还提供了以下方法和属性：

- encoding：用于将流的字节解码为字符串
- errors：解码器或编码器的错误设置
- newlines：表示翻译的换行符
- buffer：基本的二进制缓冲区
- detach()：分离底层二进制缓冲区并返回
- read() / readline(size=-1) / seek() / tell() / write(s)

### （2）class io.TextIOWrapper

一个BufferedIOBase二进制流缓冲的文本流，它继承TextIOBase。

- newline：控制行结束的处理方式
- line_buffering：是否启用行缓冲

### （3）class io.StringIO

用于文本IO在内存中的流，close()调用后文本缓冲被丢弃。

- getvalue()：返回一个str包含缓冲区的全部内容

## 5、二进制IO

二进制IO也称为缓冲IO需要类似字节的对象并生成bytes对象，不执行编码、解码或换行，适用于非文本数据。

创建二进制流的方法：

```python
import io
# f_b = open("myfile.jpg", 'rb')
# 内存创建二进制流
f_b_m = io.BytesIO(b"some initial binary data:\x00\x01")
print(f_b_m.getvalue())
```

### （1）class io.BytesIO([initial_bytes])

使用内存中字节缓冲区的流，它继承BufferedIOBase。

- getbuffer()：返回可读写视图，修改视图会更新缓冲区
- getvalue()：返回bytes包含缓冲区全部内容

```python
import io

b = io.BytesIO(b'abcdef')
view = b.getbuffer()
view[2:4] = b'56'
print(b.getvalue())  # b'ab56ef'
```

### （2）class io.BufferedReader(raw, buffer_size=...)

对可读、顺序RawIOBase对象的更高级访问。

- peek([size]) / read([size]) / read1(size)

### （3）class io.BufferedWriter(raw, buffer_size=...)

对可写、顺序RawIOBase对象的更高级访问。

- flush() / write(b)

### （4）class io.BufferedRandom(raw, buffer_size=...)

随机访问流的缓冲接口，支持seek()/tell()。

### （5）class io.BufferedRWPair(reader, writer, buffer_size=...)

将两个单向RawIOBase对象组合为单个双向端点。

## 6、原始IO

原始IO（无缓冲IO）通常用作二进制和文本流的低级构建块，亦可通过禁用缓冲打开文件获得：

```python
f_raw = open("54.jpg", 'rb', buffering=0)  # type: _io.FileIO
print(type(f_raw))
```

class io.FileIO(name, mode='r', closefd=True, opener=None)

- mode：'r'/'w'/'x'/'a' 等
- name：路径或已有文件描述符

## 内存中读写：StringIO与BytesIO

### StringIO 的读写

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from io import StringIO
# 写入
f = StringIO()
f.write('hello')
f.write(' ')
f.write('world!')
print(f.getvalue())
print('---------------')
# 读取
f = StringIO('Hello!\nHi!\nGoodbye!')
while True:
    s = f.readline()
    if s == '':
        break
    print(s.strip())
```

输出：
```python
hello world!
---------------
Hello!
Hi!
Goodbye!
```

### BytesIO 的读写

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from io import BytesIO
# 写入
f = BytesIO()
f.write('中文'.encode('utf-8'))
print(f.getvalue())
# 读取
f = BytesIO(b'\xe4\xb8\xad\xe6\x96\x87',)
print(f.read())
```

输出：
```python
b'\xe4\xb8\xad\xe6\x96\x87'
b'\xe4\xb8\xad\xe6\x96\x87'
```

## ⚠️ 注意事项

- 二进制流严格区分bytes与str，写入类型错误会抛出TypeError
- 文本与二进制的seek与长度单位不同，注意Unicode多字节字符
- 使用TextIOWrapper时，合理设置encoding/newline/line_buffering
- 大型文件建议优先考虑缓冲IO以降低系统调用次数

## 🔗 相关内容

- [文件系统接口 - os](../os/)
- [路径处理 - pathlib](../pathlib/)
- [压缩与归档 - gzip](../gzip/) · [bz2](../bz2/)

## 📚 扩展阅读

- [io模块官方文档](https://docs.python.org/3/library/io.html)

## 🏷️ 标签

`io` `文本IO` `二进制IO` `StringIO` `BytesIO` `文件操作`

---

**最后更新**: 2024-01-15  
**作者**: Python文档团队  
**版本**: 1.0