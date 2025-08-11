---
layout: doc
title: min() - 最小值函数
permalink: /docs/builtins/min/
category: builtins
tags: [序列操作, 比较, 最值]
description: 返回可迭代对象中的最小值或多个参数中的最小值
author: Python 文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "初级"
---

# min() - 最小值函数

## 📝 概述

`min()` 是 Python 中的内置函数，用于返回可迭代对象中的最小值，或者多个参数中的最小值。它支持自定义比较函数和默认值设置，是数据分析和处理中的重要工具。

## 🎯 学习目标

- 掌握 min()函数的基本用法
- 理解不同数据类型的比较规则
- 学会使用 key 参数进行自定义比较
- 了解 default 参数的使用场景

## 📋 前置知识

- Python 基本数据类型
- 可迭代对象概念
- 比较运算符基础
- lambda 函数基础

## 🔍 详细内容

### 基本概念

`min()` 函数通过比较操作找到最小值。对于数值类型，比较大小；对于字符串，按字典序比较；对于自定义对象，可以通过 key 参数指定比较方式。

### 语法格式

```python
## 多个参数的最小值
min(arg1, arg2, *args, key=None)

## 可迭代对象的最小值
min(iterable, *, default=object(), key=None)
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| iterable | iterable | 是* | 无 | 可迭代对象 |
| arg1, arg2, ... | any | 是* | 无 | 要比较的多个参数 |
| key | function | 否 | None | 用于比较的函数 |
| default | any | 否 | 无 | 空迭代器时的默认返回值 |

*注：iterable 和多个参数二选一

### 返回值

- **类型**: 与输入元素类型相同
- **说明**: 最小的元素值

## 💡 实际应用

### 基础用法

```python
## 多个参数的最小值
print(f"min(5, 2, 8, 1): {min(5, 2, 8, 1)}")  # 输出: min(5, 2, 8, 1): 1
print(f"min(3.14, 2.71, 1.41): {min(3.14, 2.71, 1.41)}")  # 输出: min(3.14, 2.71, 1.41): 1.41

## 列表的最小值
numbers = [10, 5, 8, 3, 15, 2]
print(f"min({numbers}): {min(numbers)}")  # 输出: min([10, 5, 8, 3, 15, 2]): 2

## 字符串的最小值(按字典序)
words = ['apple', 'banana', 'cherry', 'date']
print(f"min({words}): {min(words)}")  # 输出: min(['apple', 'banana', 'cherry', 'date']): apple

## 字符串中字符的最小值
text = "hello"
print(f"min('{text}'): {min(text)}")  # 输出: min('hello'): e

## 元组的最小值
tuples = [(1, 2), (3, 1), (2, 3)]
print(f"min({tuples}): {min(tuples)}")  # 输出: min([(1, 2), (3, 1), (2, 3)]): (1, 2)
```

### 使用 key 参数

```python
## 按绝对值找最小值
numbers = [-10, 5, -3, 8, -1]
min_abs = min(numbers, key=abs)
print(f"按绝对值最小: {min_abs}")  # 输出: 按绝对值最小: -1

## 按字符串长度找最短字符串
words = ['python', 'java', 'c', 'javascript', 'go']
shortest = min(words, key=len)
print(f"最短单词: {shortest}")  # 输出: 最短单词: c

## 按字符串长度,然后按字典序
words_with_same_length = ['cat', 'dog', 'bat', 'rat']
## 先按长度,再按字典序
min_word = min(words_with_same_length, key=lambda x: (len(x), x))
print(f"按长度和字典序最小: {min_word}")  # 输出: 按长度和字典序最小: bat

## 复杂对象的比较
students = [
    {'name': '张三', 'age': 20, 'score': 85},
    {'name': '李四', 'age': 19, 'score': 92},
    {'name': '王五', 'age': 21, 'score': 78},
    {'name': '赵六', 'age': 18, 'score': 88}
]

## 按年龄找最小
youngest = min(students, key=lambda s: s['age'])
print(f"最年轻的学生: {youngest['name']}, 年龄: {youngest['age']}")

## 按成绩找最小
lowest_score = min(students, key=lambda s: s['score'])
print(f"成绩最低的学生: {lowest_score['name']}, 成绩: {lowest_score['score']}")
```

### 使用 default 参数

```python
## 空列表的处理
empty_list = []

## 不使用 default 会抛出异常
try:
    result = min(empty_list)
except ValueError as e:
    print(f"空列表错误: {e}")

## 使用 default 参数
result_with_default = min(empty_list, default=0)
print(f"空列表使用默认值: {result_with_default}")  # 输出: 空列表使用默认值: 0

## 条件过滤后可能为空的情况
numbers = [1, 3, 5, 7, 9]
even_numbers = [x for x in numbers if x % 2 == 0]
min_even = min(even_numbers, default="无偶数")
print(f"最小偶数: {min_even}")  # 输出: 最小偶数: 无偶数

## 实际应用:安全的最小值查找
def safe_min(data, condition=None, default=None):
    """安全的最小值查找"""
    if condition:
        filtered_data = [x for x in data if condition(x)]
    else:
        filtered_data = data
    
    return min(filtered_data, default=default)

## 测试
test_data = [10, -5, 3, -8, 15, -2]
print(f"所有数据最小值: {safe_min(test_data)}")
print(f"正数最小值: {safe_min(test_data, lambda x: x > 0, '无正数')}")
print(f"大于 20 的最小值: {safe_min(test_data, lambda x: x > 20, '无符合条件的数')}")
```

### 实际案例：数据分析

```python
def analyze_sales_data(sales_records):
    """分析销售数据"""
    if not sales_records:
        return "无销售数据"
    
    analysis = {}
    
#    # 最低销售额
    min_amount = min(sales_records, key=lambda x: x['amount'])
    analysis['lowest_sale'] = {
        'amount': min_amount['amount'],
        'date': min_amount['date'],
        'product': min_amount['product']
    }
    
#    # 最早销售日期
    earliest_sale = min(sales_records, key=lambda x: x['date'])
    analysis['earliest_date'] = earliest_sale['date']
    
#    # 按产品分组找最低价格
    products = {}
    for record in sales_records:
        product = record['product']
        if product not in products:
            products[product] = []
        products[product].append(record)
    
    analysis['min_price_by_product'] = {}
    for product, records in products.items():
        min_record = min(records, key=lambda x: x['amount'])
        analysis['min_price_by_product'][product] = min_record['amount']
    
    return analysis

## 测试销售数据
sales_data = [
    {'date': '2024-01-15', 'product': 'iPhone', 'amount': 999},
    {'date': '2024-01-16', 'product': 'iPad', 'amount': 599},
    {'date': '2024-01-14', 'product': 'iPhone', 'amount': 899},
    {'date': '2024-01-17', 'product': 'MacBook', 'amount': 1299},
    {'date': '2024-01-15', 'product': 'iPad', 'amount': 549},
    {'date': '2024-01-18', 'product': 'iPhone', 'amount': 799}
]

analysis_result = analyze_sales_data(sales_data)
print("销售数据分析:")
print(f"  最低销售额: {analysis_result['lowest_sale']['amount']}元")
print(f"  产品: {analysis_result['lowest_sale']['product']}")
print(f"  日期: {analysis_result['lowest_sale']['date']}")
print(f"  最早销售日期: {analysis_result['earliest_date']}")
print("  各产品最低价格:")
for product, price in analysis_result['min_price_by_product'].items():
    print(f"    {product}: {price}元")
```

### 多维数据处理

```python
def find_min_in_matrix(matrix):
    """在二维矩阵中找最小值及其位置"""
    if not matrix or not matrix[0]:
        return None, None
    
    min_value = float('inf')
    min_position = None
    
    for i, row in enumerate(matrix):
        for j, value in enumerate(row):
            if value < min_value:
                min_value = value
                min_position = (i, j)
    
    return min_value, min_position

def find_min_by_dimension(matrix, dimension=0):
    """按维度找最小值"""
    if dimension == 0:  # 按行找最小值
        return [min(row) for row in matrix]
    elif dimension == 1:  # 按列找最小值
        return [min(matrix[i][j] for i in range(len(matrix))) 
                for j in range(len(matrix[0]))]
    else:
        raise ValueError("维度只能是 0(行)或 1(列)")

## 测试矩阵
test_matrix = [
    [5, 2, 8, 1],
    [3, 9, 4, 6],
    [7, 1, 5, 2]
]

print(f"矩阵: {test_matrix}")

## 全局最小值
min_val, min_pos = find_min_in_matrix(test_matrix)
print(f"全局最小值: {min_val}, 位置: {min_pos}")

## 按行最小值
row_mins = find_min_by_dimension(test_matrix, 0)
print(f"各行最小值: {row_mins}")

## 按列最小值
col_mins = find_min_by_dimension(test_matrix, 1)
print(f"各列最小值: {col_mins}")

## 使用内置函数的简洁写法
print(f"\n 使用内置函数:")
print(f"全局最小值: {min(min(row) for row in test_matrix)}")
print(f"各行最小值: {[min(row) for row in test_matrix]}")
print(f"各列最小值: {[min(col) for col in zip(*test_matrix)]}")
```

### 性能优化技巧

```python
import time
import random

## 生成测试数据
large_data = [random.randint(1, 1000000) for _ in range(100000)]

## 方法 1:直接使用 min()
start_time = time.time()
result1 = min(large_data)
time1 = time.time() - start_time

## 方法 2:手动循环查找
start_time = time.time()
min_val = large_data[0]
for val in large_data[1:]:
    if val < min_val:
        min_val = val
result2 = min_val
time2 = time.time() - start_time

## 方法 3:使用 heapq(对于部分最小值)
import heapq
start_time = time.time()
result3 = heapq.nsmallest(1, large_data)[0]
time3 = time.time() - start_time

print(f"性能比较(数据量: {len(large_data)}):")
print(f"min()函数: {time1:.6f}秒, 结果: {result1}")
print(f"手动循环: {time2:.6f}秒, 结果: {result2}")
print(f"heapq 方法: {time3:.6f}秒, 结果: {result3}")

## 对于需要多个最小值的情况
print(f"\n 获取最小的 5 个值:")
start_time = time.time()
sorted_method = sorted(large_data)[:5]
time_sorted = time.time() - start_time

start_time = time.time()
heap_method = heapq.nsmallest(5, large_data)
time_heap = time.time() - start_time

print(f"排序方法: {time_sorted:.6f}秒")
print(f"堆方法: {time_heap:.6f}秒")
print(f"堆方法快 {time_sorted/time_heap:.2f} 倍")
```

## ⚠️ 注意事项

### 比较规则

```python
## 不同类型的比较可能出错
try:
    result = min([1, '2', 3.0])  # 混合类型
except TypeError as e:
    print(f"类型错误: {e}")

## 字符串比较是按字典序
strings = ['10', '2', '30']
print(f"字符串比较: {min(strings)}")  # 输出: '10' (字典序)

## 数值字符串需要转换
numeric_strings = ['10', '2', '30']
min_numeric = min(numeric_strings, key=int)
print(f"按数值比较: {min_numeric}")  # 输出: '2'

## 元组比较是逐元素比较
tuples = [(1, 3), (1, 2), (2, 1)]
print(f"元组比较: {min(tuples)}")  # 输出: (1, 2)
```

### 空序列处理

```python
## 空序列的不同处理方式
empty_cases = [
    [],
    (),
    set(),
    '',
    range(0)
]

for empty in empty_cases:
    try:
        result = min(empty)
        print(f"{type(empty).__name__}: {result}")
    except ValueError:
        print(f"{type(empty).__name__}: 空序列,无法计算最小值")
#        # 使用 default 参数
        result = min(empty, default="空")
        print(f"  使用默认值: {result}")
```

### 自定义对象比较

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def __lt__(self, other):
        """定义小于比较"""
        return self.age < other.age
    
    def __str__(self):
        return f"{self.name}({self.age}岁)"

class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price
    
#    # 没有定义比较方法
    def __str__(self):
        return f"{self.name}: {self.price}元"

## 有比较方法的对象
people = [
    Person("张三", 25),
    Person("李四", 20),
    Person("王五", 30)
]

youngest = min(people)
print(f"最年轻的人: {youngest}")

## 没有比较方法的对象需要使用 key
products = [
    Product("苹果", 5.0),
    Product("香蕉", 3.0),
    Product("橙子", 4.0)
]

cheapest = min(products, key=lambda p: p.price)
print(f"最便宜的产品: {cheapest}")
```

## 🔗 相关内容

### 相关函数
- [max() - 最大值函数](../max/) - 找最大值
- [sorted() - 排序函数](../sorted/) - 排序操作
- [sum() - 求和函数](../sum/) - 数值求和
- [len() - 长度函数](../len/) - 获取长度
- [any() - 逻辑或函数](../any/) - 任一为真
- [all() - 逻辑与函数](../all/) - 全部为真

### 相关模块
- [heapq 模块](../stdlib/heapq/) - 堆队列算法
- [operator 模块](../stdlib/operator/) - 操作符函数
- [functools 模块](../stdlib/functools/) - 函数工具

### 相关概念
- [比较运算](../basics/comparison-operators/) - 比较运算符
- [排序算法](../algorithms/sorting/) - 排序算法详解
- [lambda 函数](../basics/lambda-functions/) - 匿名函数

## 📚 扩展阅读

- [Python 官方文档 - min()](https://docs.python.org/3/library/functions.html#min)
- [Python 排序指南](https://docs.python.org/3/howto/sorting.html)
- [比较运算](https://docs.python.org/3/reference/expressions.html#comparisons)
- [数据模型 - 比较方法](https://docs.python.org/3/reference/datamodel.html#object.__lt__)

## 🏷️ 标签

`序列操作` `比较` `最值` `数据分析` `排序`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档工程师  
**版本**: 1.0