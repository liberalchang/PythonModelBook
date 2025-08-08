---
layout: doc
title: len() - 长度函数
permalink: /docs/builtins/len/
category: builtins
tags: [长度, 序列, 容器]
description: 返回对象的长度（元素个数）
author: Python 文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "初级"
---

# len() - 长度函数

## 📝 概述

`len()` 是 Python 中最基础的内置函数之一，用于返回对象的长度（元素个数）。它可以应用于序列类型（如字符串、列表、元组）和容器类型（如字典、集合）。<mcreference link="https://docs.python.org/3/library/functions.html" index="1">1</mcreference>

## 🎯 学习目标

- 掌握 len()函数的基本用法
- 理解 len()函数适用的数据类型
- 学会在不同场景中使用 len()函数
- 了解 len()函数的实现原理

## 📋 前置知识

- Python 基本数据类型
- 序列和容器的概念
- 对象和方法的基本理解

## 🔍 详细内容

### 基本概念

`len()` 函数返回对象的长度（元素个数）。对于序列类型，返回序列中元素的数量；对于容器类型，返回容器中键值对或元素的数量。

### 语法格式

```python
len(s)
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| s | sequence/collection | 是 | 无 | 序列或容器对象 |

### 返回值

| 类型 | 说明 |
|------|------|
| int | 对象的长度（非负整数） |

## 💡 实际应用

### 基础用法

```python
## 字符串长度
text = "Hello, Python!"
print(len(text))  # 输出: 14

## 列表长度
numbers = [1, 2, 3, 4, 5]
print(len(numbers))  # 输出: 5

## 元组长度
coordinates = (10, 20, 30)
print(len(coordinates))  # 输出: 3

## 字典长度(键值对数量)
student = {"name": "张三", "age": 20, "grade": "A"}
print(len(student))  # 输出: 3

## 集合长度
unique_numbers = {1, 2, 3, 4, 5, 5, 5}
print(len(unique_numbers))  # 输出: 5(重复元素被去除)
```

### 高级用法

```python
## 嵌套结构的长度
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print(len(matrix))  # 输出: 3(外层列表的长度)
print(len(matrix[0]))  # 输出: 3(内层列表的长度)

## 空容器的长度
empty_list = []
empty_dict = {}
empty_string = ""
print(len(empty_list))   # 输出: 0
print(len(empty_dict))   # 输出: 0
print(len(empty_string)) # 输出: 0

## range 对象的长度
range_obj = range(10, 20)
print(len(range_obj))  # 输出: 10

## 字节串的长度
byte_data = b"Hello"
print(len(byte_data))  # 输出: 5
```

### 实际案例

```python
## 数据验证函数
def validate_password(password):
    """验证密码强度"""
    if len(password) < 8:
        return False, "密码长度至少 8 位"
    elif len(password) > 20:
        return False, "密码长度不能超过 20 位"
    else:
        return True, "密码长度符合要求"

## 统计文本信息
def analyze_text(text):
    """分析文本基本信息"""
    words = text.split()
    sentences = text.split('。')
    
    print(f"文本总长度: {len(text)} 个字符")
    print(f"单词数量: {len(words)} 个")
    print(f"句子数量: {len(sentences)} 个")
    
    return {
        "char_count": len(text),
        "word_count": len(words),
        "sentence_count": len(sentences)
    }

## 列表操作中的应用
def safe_get_item(lst, index):
    """安全获取列表元素"""
    if 0 <= index < len(lst):
        return lst[index]
    else:
        return None

## 使用示例
data = [10, 20, 30, 40, 50]
print(safe_get_item(data, 2))   # 输出: 30
print(safe_get_item(data, 10))  # 输出: None
```

## ⚠️ 注意事项

- `len()` 函数只能用于支持 `__len__()` 方法的对象
- 对于生成器对象，不能直接使用 `len()`，因为生成器是惰性求值的
- `len()` 函数的时间复杂度通常是 O(1)，因为大多数容器都会维护长度信息
- 空容器的长度为 0，这在条件判断中很有用

```python
## 错误示例:生成器不支持 len()
def number_generator():
    for i in range(5):
        yield i

gen = number_generator()
## print(len(gen))  # 这会引发 TypeError

## 正确做法:转换为列表
print(len(list(gen)))  # 输出: 5
```

## 🔗 相关内容

- [range() - 范围函数](../range/)
- [list() - 列表构造函数](../list/)
- [dict() - 字典构造函数](../dict/)

## 📚 扩展阅读

- [Python 官方文档 - len()](https://docs.python.org/3/library/functions.html#len)
- [Python 数据模型 - __len__方法](https://docs.python.org/3/reference/datamodel.html#object.__len__)

## 🏷️ 标签

`长度` `序列` `容器` `计数` `验证`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档工程师  
**版本**: 1.0