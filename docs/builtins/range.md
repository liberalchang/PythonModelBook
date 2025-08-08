---
layout: doc
title: range() - 范围函数
permalink: /docs/builtins/range/
category: builtins
tags: [序列, 迭代, 循环]
description: 生成不可变的数字序列，常用于循环
author: Python文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: 初级
---

# range() - 范围函数

## 📝 概述

`range()` 是Python中的内置函数，用于生成不可变的整数序列。它是一个序列类型，常用于for循环中控制迭代次数。range对象是惰性求值的，只在需要时才生成数值，因此内存效率很高。<mcreference link="https://docs.python.org/3/library/functions.html" index="1">1</mcreference>

## 🎯 学习目标

- 掌握range()函数的三种调用形式
- 理解range对象的特性和优势
- 学会在循环中使用range()
- 了解range()的内存效率特点

## 📋 前置知识

- Python基本语法
- for循环的基本概念
- 序列和迭代器的理解
- 整数运算

## 🔍 详细内容

### 基本概念

`range()` 函数返回一个range对象，表示不可变的数字序列。它支持三种调用形式，可以指定起始值、结束值和步长。

### 语法格式

```python
# 单参数形式：从0开始到stop-1
range(stop)

# 双参数形式：从start开始到stop-1
range(start, stop)

# 三参数形式：从start开始到stop-1，步长为step
range(start, stop, step)
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| start | int | 否 | 0 | 序列的起始值（包含） |
| stop | int | 是 | 无 | 序列的结束值（不包含） |
| step | int | 否 | 1 | 序列的步长 |

### 返回值

| 类型 | 说明 |
|------|------|
| range | 不可变的整数序列对象 |

## 💡 实际应用

### 基础用法

```python
# 单参数形式：range(stop)
print(list(range(5)))        # [0, 1, 2, 3, 4]
print(list(range(0)))        # []

# 双参数形式：range(start, stop)
print(list(range(2, 8)))     # [2, 3, 4, 5, 6, 7]
print(list(range(5, 5)))     # []

# 三参数形式：range(start, stop, step)
print(list(range(0, 10, 2))) # [0, 2, 4, 6, 8]
print(list(range(10, 0, -1))) # [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
print(list(range(1, 10, 3))) # [1, 4, 7]

# 负数步长
print(list(range(5, 0, -1))) # [5, 4, 3, 2, 1]
print(list(range(10, 0, -2))) # [10, 8, 6, 4, 2]
```

### 高级用法

```python
# 在for循环中使用
for i in range(5):
    print(f"第{i+1}次循环")

# 生成索引
fruits = ["苹果", "香蕉", "橙子"]
for i in range(len(fruits)):
    print(f"索引{i}: {fruits[i]}")

# 倒序迭代
for i in range(len(fruits)-1, -1, -1):
    print(f"倒序: {fruits[i]}")

# range对象的特性
r = range(1000000)  # 创建大范围，但不占用大量内存
print(len(r))       # 1000000
print(r[999999])    # 999999
print(500000 in r)  # True

# range对象支持切片
print(list(r[10:20:2]))  # [10, 12, 14, 16, 18]

# range对象是不可变的
# r[0] = 10  # 这会引发TypeError
```

### 实际案例

```python
# 九九乘法表
def multiplication_table():
    """打印九九乘法表"""
    for i in range(1, 10):
        for j in range(1, i + 1):
            print(f"{j}×{i}={i*j}", end="\t")
        print()  # 换行

# 数字金字塔
def number_pyramid(height):
    """打印数字金字塔"""
    for i in range(1, height + 1):
        # 打印空格
        for j in range(height - i):
            print(" ", end="")
        # 打印数字
        for k in range(1, i + 1):
            print(k, end="")
        # 打印倒序数字
        for l in range(i - 1, 0, -1):
            print(l, end="")
        print()  # 换行

# 批量处理数据
def process_data_in_batches(data, batch_size):
    """分批处理数据"""
    total_items = len(data)
    for i in range(0, total_items, batch_size):
        batch = data[i:i + batch_size]
        print(f"处理批次 {i//batch_size + 1}: {len(batch)} 个项目")
        # 这里可以添加实际的处理逻辑
        for item in batch:
            print(f"  处理项目: {item}")

# 使用示例
data = list(range(1, 26))  # 1到25的数字
process_data_in_batches(data, 5)

# 生成等差数列
def arithmetic_sequence(first, last, step):
    """生成等差数列"""
    if step > 0:
        return list(range(first, last + 1, step))
    else:
        return list(range(first, last - 1, step))

print(arithmetic_sequence(2, 20, 3))   # [2, 5, 8, 11, 14, 17, 20]
print(arithmetic_sequence(20, 2, -3))  # [20, 17, 14, 11, 8, 5, 2]
```

## ⚠️ 注意事项

- range对象是惰性求值的，不会立即生成所有数值
- range的参数必须是整数，不支持浮点数
- 当step为0时会引发ValueError
- range对象是不可变的，不能修改其元素
- 负步长时，start应该大于stop

```python
# 常见错误示例
# range(1.5, 10)     # TypeError: 'float' object cannot be interpreted as an integer
# range(1, 10, 0)    # ValueError: range() arg 3 must not be zero

# 空range的情况
print(list(range(5, 1)))     # [] (step为正数，但start > stop)
print(list(range(1, 5, -1))) # [] (step为负数，但start < stop)

# 正确的负步长用法
print(list(range(5, 1, -1))) # [5, 4, 3, 2]
```

## 🔗 相关内容

- [enumerate() - 枚举函数](../enumerate/)
- [zip() - 打包函数](../zip/)
- [list() - 列表构造函数](../list/)

## 📚 扩展阅读

- [Python官方文档 - range()](https://docs.python.org/3/library/functions.html#func-range)
- [Python序列类型详解](https://docs.python.org/3/library/stdtypes.html#sequence-types-list-tuple-range)
- [Python迭代器和生成器](https://docs.python.org/3/tutorial/classes.html#iterators)

## 🏷️ 标签

`序列` `迭代` `循环` `数字生成` `内存效率`

---

**最后更新**: 2024-01-15  
**作者**: Python文档工程师  
**版本**: 1.0