---
layout: doc
title: 二进制与ASCII转换 - binascii模块
permalink: /docs/stdlib/binascii/
category: stdlib
tags: [binascii, 二进制编码, 十六进制, base64, uu, crc32]
description: binascii 模块提供在二进制数据与多种ASCII表示之间转换的函数，常用于编码/解码、校验和计算等任务。
author: Python文档团队
date: 2024-01-16
updated: 2024-01-16
version: 1.0
difficulty: "中级"
---

# 二进制与ASCII转换 - binascii模块

## 📝 概述

binascii 模块包含很多在二进制与各种ASCII编码表示之间转换的方法，常被 uu、base64、binhex 等更高级封装模块调用。为追求执行效率，许多函数由C实现。你通常不会直接使用这些底层函数，但当你需要更细粒度的控制或性能时，binascii 非常有用。

## 🎯 学习目标

- 掌握二进制到ASCII（十六进制、base64、uu、hqx等）的转换与逆转换
- 学会使用 crc32 与 crc_hqx 等校验函数
- 了解 quoted-printable、RLE等相关编码的处理方式
- 搞清楚何时优先使用 binascii，何时使用更高层的封装模块

## 📋 前置知识

- Python 字节串(bytes/bytearray)与字符串(str)的区别
- 常见编码方案（Base64、Quoted-Printable、Hex）
- 基本的校验和/CRC 的概念

## 🔍 详细内容

### 1. 模块功能总览

binascii 模块定义了以下函数（原始文档列出内容保留并按类别整理）：

- UU 编码：
  - a2b_uu(string)：将单行 uu 编码数据转换成二进制数据；每行通常包含 45 个字节（最后一行除外）
  - b2a_uu(data)：将二进制数据转换成一行 UU 编码的 ASCII 字符串（包含换行），输入长度最多 45 字节
- Base64：
  - a2b_base64(string)：将 base64 数据块转换成二进制，支持多行
  - b2a_base64(data, *, newline=True)：将二进制转为一行 Base64 字符串，newline=True 时结尾带换行；输出符合 RFC 3548
- Quoted-Printable：
  - a2b_qp(data, header=False)：QP 转二进制；header=True 时，下划线会被解码为空格
  - b2a_qp(data, quotetabs=False, istext=True, header=False)：二进制转QP，可控制制表符/空格编码、是否文本模式、RFC1522头编码
- BinHex/Hexbin (hqx)：
  - a2b_hqx(string)：binhex4 ASCII → 二进制（不做 RLE 解压）
  - rledecode_hqx(data)：按 binhex4 标准做 RLE 解压；若以孤立的指示符结束会抛 Incomplete 异常
  - rlecode_hqx(data)：对数据执行 binhex4 RLE 压缩
  - b2a_hqx(data)：执行 hexbin4 的二进制 → ASCII 转换，输入应先做 RLE 且长度可被 3 整除（末段除外）
- CRC 校验：
  - crc_hqx(data, value)：基于 CRC-CCITT 多项式 0x1021 的 16 位 CRC，常用于 binhex4
  - crc32(data[, value])：32 位 CRC，和 ZIP 文件校验一致；结果为无符号，推荐使用 crc32(data) & 0xffffffff 规范化
- 十六进制：
  - b2a_hex(data) / hexlify(data)：二进制 → 十六进制 ASCII，返回字节对象长度为原数据 2 倍
  - a2b_hex(hexstr) / unhexlify(hexstr)：十六进制 ASCII → 二进制，hexstr 必须为偶数个十六进制数字

异常类型：
- binascii.Error：通常因编程错误引发
- binascii.Incomplete：数据不完整引发，通常通过读取更多数据重试

备注：在 3.2 起，部分函数仅接受 bytes/bytearray；在 3.6 起，b2a_base64 增加 newline 形参。

### 2. 十六进制与基础演示

```python
# !/usr/bin/env python
# -*- coding:utf-8 -*-
# 演示 hexlify / unhexlify 以及 b2a_hex / a2b_hex

import binascii

a = b'BE27E8FFFF010203'
# 将字节串转换为十六进制ASCII
b = binascii.b2a_hex(a)
print(b)  # b'42453237453846464646303130323033'

# 逆转换
print(binascii.a2b_hex(b))  # b'BE27E8FFFF010203'

# 等价API
c = binascii.hexlify(a)
print(c)
print(binascii.unhexlify(c))
```

关于内置 hex()/bin()/oct()/chr()/ord() 的相关知识：

```python
# 十进制转十六进制（整型）
>>> hex(88)
'0x58'
# 浮点数转十六进制表示
>>> 1.23.hex()
'0x1.3ae147ae147aep+0'
# 注意：内置 hex 只接受整型，不接受字节串或字符串
>>> hex('88')
TypeError: hex() argument can't be converted to hex

# 十进制转二进制
>>> bin(88)
'0b1011000'

# 十进制转八进制（展示旧风格示例）
>>> oct(500)
'0764'

# 整数与字符互转
>>> chr(98)
'b'
>>> ord('b')
98
```

进一步的 hexlify 示例：

```python
#coding:utf-8
import binascii

a = b'worker'
print(binascii.b2a_hex(a))
print(binascii.a2b_hex(binascii.b2a_hex(a)))
print(binascii.hexlify(a))
print(binascii.unhexlify(binascii.hexlify(a)))
```

## 💡 实际应用

### 1) 使用 crc32 计算校验

```python
import binascii

print(binascii.crc32(b"hello world"))
# 分段更新：
crc = binascii.crc32(b"hello")
crc = binascii.crc32(b" world", crc)
print('crc32 = {:#010x}'.format(crc & 0xffffffff))  # 规范化为无符号
```

### 2) Base64/Quoted-Printable/UU 的常见转换

```python
import binascii

# base64
encoded = binascii.b2a_base64(b'hello', newline=False)
print(encoded)
print(binascii.a2b_base64(encoded))

# quoted-printable（常见于邮件头/正文）
qp = binascii.b2a_qp(b'Tab\t Space ', quotetabs=True)
print(qp)
print(binascii.a2b_qp(qp))

# uu
uu_line = binascii.b2a_uu(b'abc')
print(uu_line)
print(binascii.a2b_uu(uu_line))
```

### 3) hqx 与 RLE 处理

```python
import binascii

raw = b'AAABBBBBCCCCCCDD'
# RLE 压缩与解压（示意，用于 binhex4 工作流）
comp = binascii.rlecode_hqx(raw)
restored = binascii.rledecode_hqx(comp)
print(raw == restored)
```

## ⚠️ 注意事项

- 大多数函数入参需要 bytes/bytearray，而非 str
- a2b_hex/unhexlify 需要偶数长度的十六进制字符串，否则抛出 binascii.Error
- b2a_base64 的 newline 参数影响输出尾部是否带换行
- crc32 结果规范为无符号可使用 & 0xffffffff
- 若只需通用用法，优先考虑 base64/uu/binhex 等封装模块；binascii 适用于底层/性能场景

## 🔗 相关内容

- [os 模块 - 文件与目录](../os/)
- [gzip 模块 - gzip压缩](../gzip/)
- [bz2 模块 - bzip2压缩](../bz2/)
- [io 模块 - 文本与二进制I/O](../io/)

## 📚 扩展阅读

- [binascii 官方文档](https://docs.python.org/3/library/binascii.html)
- [Base64 编码 - 官方文档](https://docs.python.org/3/library/base64.html)

## 🏷️ 标签

`binascii` `二进制编码` `十六进制` `base64` `uu` `crc32`

---

**最后更新**: 2024-01-16  
**作者**: Python文档团队  
**版本**: 1.0


<!-- 原始文档全文保留区（为遵循 step13 的“保留原有内容”要求） -->

## 原始文档（未删改内容）

一、例子

二、涉及

-----binasscii-----

binascii 模块包含很多在二进制和二进制表示的各种ASCII码之间转换的方法。 通常情况不会直接使用这些函数，而是使用像 uu ， base64 ，或 binhex 这样的封装模块。 为了执行效率高，binascii 模块含有许多用 C 写的低级函数，这些底层函数被一些高级模块所使用

binascii 模块定义了以下函数：

- binascii.a2b_uu(string)

将单行 uu 编码数据转换成二进制数据并返回。uu 编码每行的数据通常包含45 个（二进制）字节，最后一行除外。每行数据后面可能跟有空格。

- binascii.b2a_uu(data)

Convert binary data to a line of ASCII characters, the return value is the converted line, including a newline char. The length of data should be at most 45.

- binascii.a2b_base64(string)

将 base64 数据块转换成二进制并以二进制数据形式返回。一次可以传递多行数据。

- binascii.b2a_base64(data, *, newline=True)

将二进制数据转换为一行用 base64 编码的ASCII字符串。返回值是转换后的行数据，如果 newline 为true，则返回值包括换行符。该函数的输出符合：rfc：3548。

在 3.6 版更改: 增加 newline 形参。

- binascii.a2b_qp(data, header=False)

将一个引号可打印的数据块转换成二进制数据并返回。一次可以转换多行。如果可选参数 header 存在且为true，则数据中的下划线将被解码成空格。

- binascii.b2a_qp(data, quotetabs=False, istext=True, header=False)

将二进制数据转换为一行或多行带引号可打印编码的ASCII字符串。返回值是转换后的行数据。如果可选参数 quotetabs 存在且为真值，则对所有制表符和空格进行编码。如果可选参数 istext 存在且为真值，则不对新行进行编码，但将对尾随空格进行编码。如果可选参数 header 存在且为true，则空格将被编码为下划线 RFC 1522。如果可选参数 header 存在且为假值，则也会对换行符进行编码;不进行换行转换编码可能会破坏二进制数据流。

- binascii.a2b_hqx(string)

将 binhex4 格式的 ASCII 数据不进行 RLE 解压缩直接转换为二进制数据。该字符串应包含完整数量的二进制字节，或者（在binhex4 数据最后部分）剩余位为零。

- binascii.rledecode_hqx(data)

根据 binhex4 标准对数据执行 RLE 解压缩。该算法在一个字节的数据后使用 0x90 作为重复指示符，然后计数。计数 0 指定字节值 0x90 。该例程返回解压缩的数据，输入数据以孤立的重复指示符结束的情况下，将引发 Incomplete 异常。

在 3.2 版更改: 仅接受 bytestring 或 bytearray 对象作为输入。

- binascii.rlecode_hqx(data)

在 data 上执行 binhex4 游程编码压缩并返回结果。

- binascii.b2a_hqx(data)

执行 hexbin4 类型二进制到 ASCII 码的转换并返回结果字符串。输入数据应经过 RLE 编码，且数据长度可被3整除（除了最后一个片段）。

- binascii.crc_hqx(data, value)

以 value 作为初始 CRC 计算 data 的16位 CRC 值，返回其结果。这里使用 CRC-CCITT 生成多项式 x16 + x12 + x5 + 1 ，通常表示为0x1021。该 CRC 被用于 binhex4 格式。

- binascii.crc32(data[, value])

计算 CRC-32 ，从 value 的初始 CRC 开始计算 data 的32位校验和。默认初始 CRC 为零。该算法与 ZIP 文件校验和一致。由于该算法被设计用作校验和算法，因此不适合用作通用散列算法。使用方法如下：

```python
print(binascii.crc32(b"hello world"))
# Or, in two pieces:
crc = binascii.crc32(b"hello")
crc = binascii.crc32(b" world", crc)
print('crc32 = {:#010x}'.format(crc))
```

在 3.0 版更改: 校验结果始终是无符号类型的。要在所有Python版本和平台上生成相同的数值，请使用 crc32(data) & 0xffffffff 。

- binascii.b2a_hex(data)

- binascii.hexlify(data)

返回二进制数据 data 的十六进制表示形式。 data 的每个字节都被转换为相应的2位十六进制表示形式。因此返回的字节对象的长度是 data 的两倍。

- binascii.a2b_hex(hexstr)

- binascii.unhexlify(hexstr)

返回由十六进制字符串 hexstr 表示的二进制数据。此函数功能与 b2a_hex() 相反。 hexstr 必须包含偶数个十六进制数字（可以是大写或小写），否则会引发 Error 异常。

- exception binascii.Error

通常是因为编程错误引发的异常。

- exception binascii.Incomplete

数据不完整引发的异常。通常不是编程错误导致的，可以通过读取更多的数据并再次尝试来处理该异常。

----------------------------------------------------------------------------------------------------------------------------------------------------

```
# !/usr/bin/env python
# -*- coding:utf-8 -*-

 
# 导入binascii模块
import binascii
 
a = b'BE27E8FFFF010203'
# 先把b'BE27E8FFFF010203'转换成二进制数据然后在用十六进制表示
b = binascii.b2a_hex(a)
# 打印出：b'42453237453846464646303130323033'，例如B对应ascii码42，E对应ascii码45
print(b)
 
 
# 与b2a_hex相反，打印出：b'BE27E8FFFF010203'
print(binascii.a2b_hex(b))
 
 
# 这个功能和b2a_hex()一样
# 打印出：b'42453237453846464646303130323033'，例如B对应ascii码42，E对应ascii码45
c = binascii.hexlify(a)
print(c)
 
# 这个功能和a2b_hex()一样，打印出：b'BE27E8FFFF010203'
print(binascii.unhexlify(c))
 
```

hex() :十进制转十六进制

```
#把10进制转整形换成16进制
>>> hex(88)
'0x58'
#把浮点型转换成16进制
>>> 1.23.hex()
'0x1.3ae147ae147aep+0'
#内置函数hex和binascii.hexlify()的区别就在于，
#hex只能接受整形不能接受字符串
>>> hex('88')
Traceback (most recent call last):
  File "<pyshell#26>", line 1, in <module>
    hex('88')
TypeError: hex() argument can't be converted to hexbin():ba
```

bin():把十进制整形转换成二进制字符

```
#把十进制整型转换成二进制
>>> bin(88)
'0b1011000'
>>> bin(33)
'0b100001'
```

oct():把十进制转换成八进制字符

```
#把十进制转换成八进制
>>> oct(500)
'0764'
>>> oct(488)
'0750'
```

chr():把一个整形转换成ASCII码表中对应的单个字符

```
#把一个整形转换成ASCII码表中对应的单个字符
>>> chr(98)
'b'
>>> chr(97)
'a'
```

ord():和chr相反，把ASCII码表中的字符转换成对应的整形

```
>>> ord('b')
98
>>> ord('c')
99
```

-------------------------------------------------------------------------------------------------------------------------

binascii模块包含很多在二进制和ASCII编码的二进制表示转换的方法。通常情况不会直接使用这些功能，而是使用像UU，base64编码，或BinHex封装模块。 binascii模块包含更高级别的模块使用的，用C语言编写的低级高效功能。

```python
#coding:utf-8

import binascii

a = b'worker'
#先把worker转换成二进制数据然后在用十六进制表示
b = binascii.b2a_hex(a)
print(b)
#与b2a_hex相反
print(binascii.a2b_hex(b))
#这个功能和b2a_hex()一样
c = binascii.hexlify(a)
print(c)
#这个功能和a2b_hex()一样
print(binascii.unhexlify(c))
######运行结果######
b'776f726b6572'
b'worker'
b'776f726b6572'
b'worker'

python内置函数：

hex():
#把10进制转整形换成16进制
>>> hex(88)
'0x58'

#把浮点型转换成16进制
>>> 1.23.hex()
'0x1.3ae147ae147aep+0'

#内置函数hex和binascii.hexlify()的区别就在于，hex只能接受整形不能接受字符串
>>> hex('88')
Traceback (most recent call last):
  File "<pyshell#26>", line 1, in <module>
    hex('88')
TypeError: hex() argument can't be converted to hexbin():ba 


int([x[,base]]) 转换字符串或者数值为整。参数为字符串的时候，必须制定进制base，默认进制是10，可以取[2,36]或者0。为0的时候，进制信息从字符串中获取。Int的返回为10进制的整数。输入为浮点数时，会进行靠近0截断处理。类似的内置函数有float，long等。

>>> int(0x17)
23
>>> int(-0x17)
-23
>>> int('23')
23
>>> int('1101',2)
13
>>> int('1101',36)
47953
>>> int('1101',8)
577
>>> int(11.92)
11
>>> int(-11.92)
-11

bin():把十进制整形转换成二进制字符

#把十进制整型转换成二进制
>>> bin(88)
'0b1011000'
>>> bin(33)
'0b100001' 

oct():把十进制转换成八进制字符

#把十进制转换成八进制
>>> oct(500)
'0764'
>>> oct(488)
'0750' 

chr():把一个整形转换成ASCII码表中对应的单个字符 ,该参数必须是在范围[0..255]。

unichr(i)是chr的unicode版本，例如，unichr（97）返回字符串u'a'。参数的取值范围取决于Python如何配置 - 这可能是UCS2 [0..0xFFFF]或UCS4 [0..0x10FFFF]。

#把一个整形转换成ASCII码表中对应的单个字符
>>> chr(98)
'b'
>>> chr(97)
'a' 

ord():和chr相反，把ASCII码表中的字符转换成对应的整形

>>> ord('b')
98
>>> ord('c')
99

Hexlify的优势在于可以同时处理多个字符。下面2个操作有一定类似性，返回值都是字符串，不过hexlify去掉了’0x’。

>>> hex(ord('a'))
'0x61'
>>> hexlify('a')
'61'

```

- 函数列表：

```python
binascii.a2b_uu(string)

binascii.b2a_uu(data)

binascii.a2b_base64(string)

binascii.b2a_base64(data)

binascii.a2b_qp(string[, header])

binascii.b2a_qp(data[, quotetabs, istext, header])

binascii.a2b_hqx(string)

binascii.rledecode_hqx(data)

binascii.rlecode_hqx(data)

binascii.b2a_hqx(data)

binascii.crc_hqx(data, crc)

binascii.crc32(data[, crc])

binascii.b2a_hex(data)

binascii.b2a_hex(data)

binascii.hexlify(data)

binascii.a2b_hex(hexstr)

binascii.unhexlify(hexstr)

异常有：

exception binascii.Error

exception binascii.Incomplete

```