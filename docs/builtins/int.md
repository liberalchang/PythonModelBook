---
layout: doc
title: int() - 整数转换函数
permalink: /docs/builtins/int/
category: builtins
tags: [类型转换, 整数, 数值]
description: 将值转换为整数类型
author: Python文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: 初级
---

# int() - 整数转换函数

## 📝 概述

`int()` 是Python中的内置函数，用于将数值或字符串转换为整数类型。它是最常用的类型转换函数之一，支持多种数据类型的转换，并可以指定进制进行转换。

## 🎯 学习目标

- 掌握int()函数的基本用法
- 理解不同数据类型到整数的转换规则
- 学会使用进制参数进行转换
- 了解转换过程中的异常处理

## 📋 前置知识

- Python基本数据类型
- 数值系统和进制概念
- 异常处理基础

## 🔍 详细内容

### 基本概念

`int()` 函数可以将浮点数、字符串或其他数值类型转换为整数。当转换浮点数时，会截断小数部分（向零取整）。

### 语法格式

```python
# 无参数调用，返回0
int()

# 转换数值或字符串
int(x)

# 指定进制转换字符串
int(x, base)
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| x | number/string | 否 | 无 | 要转换的数值或字符串 |
| base | int | 否 | 10 | 进制，范围2-36，仅当x为字符串时有效 |

### 返回值

- **类型**: int
- **说明**: 转换后的整数值

## 💡 实际应用

### 基础用法

```python
# 无参数调用
result = int()  # 返回 0
print(f"无参数调用: {result}")  # 输出: 无参数调用: 0

# 浮点数转换
float_num = 3.14
int_num = int(float_num)  # 截断小数部分
print(f"浮点数转换: {int_num}")  # 输出: 浮点数转换: 3

# 负数转换
neg_float = -2.8
neg_int = int(neg_float)  # 向零取整
print(f"负数转换: {neg_int}")  # 输出: 负数转换: -2

# 字符串转换
str_num = "123"
converted = int(str_num)
print(f"字符串转换: {converted}")  # 输出: 字符串转换: 123
```

### 进制转换

```python
# 二进制转换
binary_str = "1010"
binary_int = int(binary_str, 2)  # 二进制转十进制
print(f"二进制 {binary_str} = {binary_int}")  # 输出: 二进制 1010 = 10

# 八进制转换
octal_str = "755"
octal_int = int(octal_str, 8)  # 八进制转十进制
print(f"八进制 {octal_str} = {octal_int}")  # 输出: 八进制 755 = 493

# 十六进制转换
hex_str = "FF"
hex_int = int(hex_str, 16)  # 十六进制转十进制
print(f"十六进制 {hex_str} = {hex_int}")  # 输出: 十六进制 FF = 255

# 自定义进制
custom_str = "ZZ"
custom_int = int(custom_str, 36)  # 36进制转十进制
print(f"36进制 {custom_str} = {custom_int}")  # 输出: 36进制 ZZ = 1295
```

### 高级用法

```python
# 处理带前缀的字符串
prefix_binary = "0b1010"  # 二进制前缀
prefix_octal = "0o755"    # 八进制前缀
prefix_hex = "0xFF"      # 十六进制前缀

# 使用base=0自动识别进制
auto_binary = int(prefix_binary, 0)  # 自动识别为二进制
auto_octal = int(prefix_octal, 0)    # 自动识别为八进制
auto_hex = int(prefix_hex, 0)        # 自动识别为十六进制

print(f"自动识别: {auto_binary}, {auto_octal}, {auto_hex}")
# 输出: 自动识别: 10, 493, 255
```

### 实际案例：用户输入验证

```python
def get_valid_integer(prompt, min_value=None, max_value=None):
    """获取有效的整数输入"""
    while True:
        try:
            user_input = input(prompt)
            
            # 转换为整数
            number = int(user_input)
            
            # 范围验证
            if min_value is not None and number < min_value:
                print(f"数值不能小于 {min_value}")
                continue
                
            if max_value is not None and number > max_value:
                print(f"数值不能大于 {max_value}")
                continue
                
            return number
            
        except ValueError:
            print("请输入有效的整数")

# 使用示例
# age = get_valid_integer("请输入年龄 (0-150): ", 0, 150)
# print(f"您的年龄是: {age}")
```

### 数据处理应用

```python
def process_numeric_data(data_list):
    """处理包含数值字符串的数据"""
    processed_data = []
    errors = []
    
    for i, item in enumerate(data_list):
        try:
            # 尝试转换为整数
            if isinstance(item, str):
                # 处理可能的进制前缀
                if item.startswith('0x'):
                    number = int(item, 16)
                elif item.startswith('0b'):
                    number = int(item, 2)
                elif item.startswith('0o'):
                    number = int(item, 8)
                else:
                    number = int(item)
            else:
                number = int(item)
                
            processed_data.append(number)
            
        except (ValueError, TypeError) as e:
            errors.append(f"索引 {i}: {item} - {str(e)}")
            processed_data.append(None)
    
    return processed_data, errors

# 测试数据
test_data = ["123", "0xFF", "0b1010", "3.14", "invalid", 42]
results, errors = process_numeric_data(test_data)

print(f"处理结果: {results}")
# 输出: 处理结果: [123, 255, 10, 3, None, 42]
print(f"错误信息: {errors}")
# 输出: 错误信息: ['索引 4: invalid - invalid literal for int() with base 10: 'invalid'']
```

## ⚠️ 注意事项

### 转换规则

```python
# 浮点数转换：向零取整
print(int(3.9))   # 输出: 3
print(int(-3.9))  # 输出: -3

# 布尔值转换
print(int(True))   # 输出: 1
print(int(False))  # 输出: 0

# 字符串必须是有效的数字格式
try:
    int("3.14")  # 错误：字符串包含小数点
except ValueError as e:
    print(f"转换错误: {e}")
```

### 进制限制

```python
# 进制范围：2-36
try:
    int("10", 1)   # 错误：进制太小
except ValueError as e:
    print(f"进制错误: {e}")

try:
    int("10", 37)  # 错误：进制太大
except ValueError as e:
    print(f"进制错误: {e}")
```

### 性能考虑

```python
import time

# 大量转换时的性能比较
data = [str(i) for i in range(100000)]

# 使用int()转换
start_time = time.time()
results1 = [int(x) for x in data]
time1 = time.time() - start_time

# 使用列表推导式优化
start_time = time.time()
results2 = list(map(int, data))
time2 = time.time() - start_time

print(f"列表推导式耗时: {time1:.4f}秒")
print(f"map函数耗时: {time2:.4f}秒")
```

## 🔗 相关内容

### 相关函数
- [float() - 浮点数转换函数](float.md) - 转换为浮点数
- [str() - 字符串转换函数](str.md) - 转换为字符串
- [bool() - 布尔转换函数](bool.md) - 转换为布尔值
- [bin() - 二进制转换函数](bin.md) - 转换为二进制字符串
- [hex() - 十六进制转换函数](hex.md) - 转换为十六进制字符串
- [oct() - 八进制转换函数](oct.md) - 转换为八进制字符串

### 相关概念
- [Python数据类型](../basics/data-types.md) - 基本数据类型
- [异常处理](../basics/exceptions.md) - 异常处理机制
- [数值系统](../advanced/number-systems.md) - 进制转换详解

## 📚 扩展阅读

- [Python官方文档 - int()](https://docs.python.org/3/library/functions.html#int)
- [Python数值类型](https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex)
- [进制转换详解](https://docs.python.org/3/tutorial/introduction.html#numbers)

## 🏷️ 标签

`类型转换` `整数` `进制转换` `数值处理` `输入验证`

---

**最后更新**: 2024-01-15  
**作者**: Python文档工程师  
**版本**: 1.0