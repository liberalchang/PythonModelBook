---
layout: doc
title: list() - 列表构造函数
permalink: /docs/builtins/list/
category: builtins
tags: [类型转换, 容器, 序列]
description: 创建列表对象或将可迭代对象转换为列表
author: Python文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: 初级
---

# list() - 列表构造函数

## 📝 概述

`list()` 是Python中的内置函数，用于创建列表对象或将可迭代对象转换为列表。列表是Python中最常用的数据结构之一，具有有序、可变、允许重复元素的特性，广泛应用于数据存储和处理。

## 🎯 学习目标

- 掌握list()函数的基本用法
- 理解列表的特性和应用场景
- 学会不同类型到列表的转换
- 了解列表的性能特点

## 📋 前置知识

- Python基本数据类型
- 可迭代对象概念
- 序列类型基础
- 索引和切片操作

## 🔍 详细内容

### 基本概念

列表（list）是Python中的可变序列类型，可以存储任意类型的对象。`list()` 函数可以创建空列表或将其他可迭代对象转换为列表，是数据处理中的基础工具。

### 语法格式

```python
# 创建空列表
list()

# 从可迭代对象创建列表
list(iterable)
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| iterable | iterable | 否 | 无 | 可迭代对象（字符串、元组、集合等） |

### 返回值

- **类型**: list
- **说明**: 新创建的列表对象

## 💡 实际应用

### 基础用法

```python
# 创建空列表
empty_list = list()
print(f"空列表: {empty_list}")  # 输出: 空列表: []
print(f"类型: {type(empty_list)}")  # 输出: 类型: <class 'list'>

# 等价的创建方式
empty_list2 = []
print(f"字面量创建: {empty_list2}")  # 输出: 字面量创建: []

# 从字符串创建列表
string_to_list = list("hello")
print(f"字符串转列表: {string_to_list}")  # 输出: 字符串转列表: ['h', 'e', 'l', 'l', 'o']

# 从元组创建列表
tuple_data = (1, 2, 3, 4, 5)
tuple_to_list = list(tuple_data)
print(f"元组转列表: {tuple_to_list}")  # 输出: 元组转列表: [1, 2, 3, 4, 5]

# 从集合创建列表
set_data = {3, 1, 4, 1, 5, 9, 2, 6}
set_to_list = list(set_data)
print(f"集合转列表: {set_to_list}")  # 输出: 集合转列表: [1, 2, 3, 4, 5, 6, 9] (顺序可能不同)

# 从range对象创建列表
range_to_list = list(range(5))
print(f"range转列表: {range_to_list}")  # 输出: range转列表: [0, 1, 2, 3, 4]

# 从字典创建列表（默认是键）
dict_data = {'a': 1, 'b': 2, 'c': 3}
dict_keys_to_list = list(dict_data)
print(f"字典键转列表: {dict_keys_to_list}")  # 输出: 字典键转列表: ['a', 'b', 'c']

# 字典值转列表
dict_values_to_list = list(dict_data.values())
print(f"字典值转列表: {dict_values_to_list}")  # 输出: 字典值转列表: [1, 2, 3]

# 字典项转列表
dict_items_to_list = list(dict_data.items())
print(f"字典项转列表: {dict_items_to_list}")  # 输出: 字典项转列表: [('a', 1), ('b', 2), ('c', 3)]
```

### 生成器和迭代器转换

```python
# 生成器表达式转列表
squares_gen = (x**2 for x in range(5))
squares_list = list(squares_gen)
print(f"平方数列表: {squares_list}")  # 输出: 平方数列表: [0, 1, 4, 9, 16]

# 过滤器转列表
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_filter = filter(lambda x: x % 2 == 0, numbers)
even_list = list(even_filter)
print(f"偶数列表: {even_list}")  # 输出: 偶数列表: [2, 4, 6, 8, 10]

# 映射器转列表
map_result = map(lambda x: x * 2, range(5))
map_list = list(map_result)
print(f"映射结果: {map_list}")  # 输出: 映射结果: [0, 2, 4, 6, 8]

# 枚举器转列表
words = ['apple', 'banana', 'cherry']
enum_result = enumerate(words)
enum_list = list(enum_result)
print(f"枚举结果: {enum_list}")  # 输出: 枚举结果: [(0, 'apple'), (1, 'banana'), (2, 'cherry')]

# zip对象转列表
names = ['Alice', 'Bob', 'Charlie']
ages = [25, 30, 35]
zip_result = zip(names, ages)
zip_list = list(zip_result)
print(f"zip结果: {zip_list}")  # 输出: zip结果: [('Alice', 25), ('Bob', 30), ('Charlie', 35)]

# 自定义迭代器转列表
class CountDown:
    def __init__(self, start):
        self.start = start
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.start <= 0:
            raise StopIteration
        self.start -= 1
        return self.start + 1

countdown = CountDown(5)
countdown_list = list(countdown)
print(f"倒计时列表: {countdown_list}")  # 输出: 倒计时列表: [5, 4, 3, 2, 1]
```

### 文件和数据处理

```python
# 读取文件行到列表
def read_file_to_list(filename):
    """读取文件内容到列表"""
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            lines = list(file)  # 每行作为一个元素
            # 去除换行符
            clean_lines = [line.strip() for line in lines]
            return clean_lines
    except FileNotFoundError:
        print(f"文件 {filename} 不存在")
        return []

# 模拟文件内容
sample_content = """第一行内容
第二行内容
第三行内容
第四行内容"""

# 创建临时文件进行测试
import tempfile
import os

with tempfile.NamedTemporaryFile(mode='w', delete=False, encoding='utf-8') as temp_file:
    temp_file.write(sample_content)
    temp_filename = temp_file.name

# 读取文件到列表
file_lines = read_file_to_list(temp_filename)
print(f"文件行列表: {file_lines}")

# 清理临时文件
os.unlink(temp_filename)

# CSV数据处理
csv_data = "name,age,city\nAlice,25,New York\nBob,30,London\nCharlie,35,Tokyo"
csv_lines = csv_data.split('\n')
csv_list = list(csv_lines)
print(f"CSV行列表: {csv_list}")

# 解析CSV数据
header = csv_list[0].split(',')
data_rows = [row.split(',') for row in csv_list[1:]]
print(f"CSV头部: {header}")
print(f"CSV数据: {data_rows}")

# 转换为字典列表
csv_dicts = []
for row in data_rows:
    row_dict = dict(zip(header, row))
    csv_dicts.append(row_dict)
print(f"CSV字典列表: {csv_dicts}")
```

### 数据结构转换和操作

```python
# 嵌套结构展平
def flatten_list(nested_list):
    """展平嵌套列表"""
    result = []
    for item in nested_list:
        if isinstance(item, list):
            result.extend(flatten_list(item))  # 递归处理
        else:
            result.append(item)
    return result

# 测试嵌套列表
nested = [1, [2, 3], [4, [5, 6]], 7, [8, [9, [10]]]]
flattened = flatten_list(nested)
print(f"原始嵌套: {nested}")
print(f"展平结果: {flattened}")

# 使用itertools.chain展平（更高效）
from itertools import chain
simple_nested = [[1, 2], [3, 4], [5, 6]]
chain_flattened = list(chain.from_iterable(simple_nested))
print(f"chain展平: {chain_flattened}")

# 矩阵转置
def transpose_matrix(matrix):
    """矩阵转置"""
    if not matrix or not matrix[0]:
        return []
    return list(zip(*matrix))

matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
transposed = transpose_matrix(matrix)
print(f"原矩阵: {matrix}")
print(f"转置矩阵: {list(map(list, transposed))}")

# 列表去重（保持顺序）
def remove_duplicates_ordered(lst):
    """去重并保持顺序"""
    seen = set()
    result = []
    for item in lst:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result

with_duplicates = [1, 2, 3, 2, 4, 1, 5, 3, 6]
unique_ordered = remove_duplicates_ordered(with_duplicates)
print(f"原列表: {with_duplicates}")
print(f"去重后: {unique_ordered}")

# 使用dict.fromkeys去重（Python 3.7+保持顺序）
unique_dict_method = list(dict.fromkeys(with_duplicates))
print(f"dict方法去重: {unique_dict_method}")

# 列表分组
def group_by_key(lst, key_func):
    """按键函数分组"""
    groups = {}
    for item in lst:
        key = key_func(item)
        if key not in groups:
            groups[key] = []
        groups[key].append(item)
    return groups

students = [
    {'name': 'Alice', 'grade': 'A', 'age': 20},
    {'name': 'Bob', 'grade': 'B', 'age': 19},
    {'name': 'Charlie', 'grade': 'A', 'age': 21},
    {'name': 'Diana', 'grade': 'B', 'age': 20}
]

# 按成绩分组
by_grade = group_by_key(students, lambda s: s['grade'])
print("按成绩分组:")
for grade, student_list in by_grade.items():
    names = [s['name'] for s in student_list]
    print(f"  {grade}级: {names}")

# 按年龄分组
by_age = group_by_key(students, lambda s: s['age'])
print("\n按年龄分组:")
for age, student_list in by_age.items():
    names = [s['name'] for s in student_list]
    print(f"  {age}岁: {names}")
```

### 实际案例：数据分析

```python
def analyze_sales_data(sales_records):
    """分析销售数据"""
    if not sales_records:
        return {}
    
    # 提取各种数据列表
    products = list(set(record['product'] for record in sales_records))
    sales_amounts = [record['amount'] for record in sales_records]
    sales_dates = [record['date'] for record in sales_records]
    
    # 按产品分组
    product_sales = {}
    for record in sales_records:
        product = record['product']
        if product not in product_sales:
            product_sales[product] = []
        product_sales[product].append(record['amount'])
    
    # 计算统计信息
    product_stats = {}
    for product, amounts in product_sales.items():
        product_stats[product] = {
            'total': sum(amounts),
            'average': sum(amounts) / len(amounts),
            'count': len(amounts),
            'max': max(amounts),
            'min': min(amounts)
        }
    
    # 按月份统计
    monthly_sales = {}
    for record in sales_records:
        month = record['date'][:7]  # YYYY-MM格式
        if month not in monthly_sales:
            monthly_sales[month] = 0
        monthly_sales[month] += record['amount']
    
    # 排序结果
    top_products = sorted(product_stats.items(), 
                         key=lambda x: x[1]['total'], 
                         reverse=True)
    
    return {
        'products': products,
        'total_sales': sum(sales_amounts),
        'total_transactions': len(sales_records),
        'average_transaction': sum(sales_amounts) / len(sales_records),
        'product_stats': product_stats,
        'monthly_sales': monthly_sales,
        'top_products': top_products
    }

# 测试销售数据
sales_data = [
    {'date': '2024-01-15', 'product': 'iPhone', 'amount': 999, 'customer': 'Alice'},
    {'date': '2024-01-16', 'product': 'MacBook', 'amount': 1999, 'customer': 'Bob'},
    {'date': '2024-01-17', 'product': 'iPhone', 'amount': 999, 'customer': 'Charlie'},
    {'date': '2024-01-18', 'product': 'iPad', 'amount': 599, 'customer': 'Diana'},
    {'date': '2024-02-01', 'product': 'MacBook', 'amount': 1999, 'customer': 'Eve'},
    {'date': '2024-02-02', 'product': 'iPhone', 'amount': 999, 'customer': 'Frank'},
    {'date': '2024-02-03', 'product': 'iPad', 'amount': 599, 'customer': 'Grace'}
]

analysis = analyze_sales_data(sales_data)
print("销售数据分析:")
print(f"产品列表: {analysis['products']}")
print(f"总销售额: ${analysis['total_sales']:,}")
print(f"总交易数: {analysis['total_transactions']}")
print(f"平均交易额: ${analysis['average_transaction']:.2f}")

print("\n产品统计:")
for product, stats in analysis['product_stats'].items():
    print(f"  {product}:")
    print(f"    总销售: ${stats['total']:,}")
    print(f"    平均价格: ${stats['average']:.2f}")
    print(f"    销售次数: {stats['count']}")

print("\n月度销售:")
for month, amount in analysis['monthly_sales'].items():
    print(f"  {month}: ${amount:,}")

print("\n销售排行:")
for i, (product, stats) in enumerate(analysis['top_products'], 1):
    print(f"  {i}. {product}: ${stats['total']:,}")
```

### 高级列表操作

```python
# 列表推导式与list()结合
numbers = range(10)

# 条件过滤
even_squares = list(x**2 for x in numbers if x % 2 == 0)
print(f"偶数平方: {even_squares}")

# 嵌套推导
matrix = [[i*j for j in range(1, 4)] for i in range(1, 4)]
print(f"乘法表矩阵: {matrix}")

# 展平嵌套推导
flattened_matrix = list(item for row in matrix for item in row)
print(f"展平矩阵: {flattened_matrix}")

# 条件表达式
processed = list('positive' if x > 0 else 'negative' if x < 0 else 'zero' 
                for x in [-2, -1, 0, 1, 2])
print(f"数值分类: {processed}")

# 多重迭代
combinations = list((x, y) for x in [1, 2, 3] for y in ['a', 'b'] if x > 1)
print(f"条件组合: {combinations}")

# 函数式编程结合
from functools import reduce
from operator import add

# 累积操作
numbers = [1, 2, 3, 4, 5]
cumulative = []
for i in range(1, len(numbers) + 1):
    cumulative.append(reduce(add, numbers[:i]))
print(f"累积和: {cumulative}")

# 更简洁的累积和
import itertools
cumsum = list(itertools.accumulate(numbers))
print(f"itertools累积和: {cumsum}")

# 滑动窗口
def sliding_window(lst, window_size):
    """滑动窗口"""
    return [lst[i:i+window_size] for i in range(len(lst)-window_size+1)]

data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
windows = sliding_window(data, 3)
print(f"滑动窗口(大小3): {windows}")

# 分块处理
def chunk_list(lst, chunk_size):
    """将列表分块"""
    return [lst[i:i+chunk_size] for i in range(0, len(lst), chunk_size)]

chunks = chunk_list(data, 3)
print(f"分块处理(大小3): {chunks}")
```

## ⚠️ 注意事项

### 性能考虑

```python
import time
import sys

# 创建方式性能比较
n = 100000

# 方法1: list()构造
start_time = time.time()
list1 = list(range(n))
time1 = time.time() - start_time

# 方法2: 列表推导式
start_time = time.time()
list2 = [i for i in range(n)]
time2 = time.time() - start_time

# 方法3: 预分配+循环
start_time = time.time()
list3 = [None] * n
for i in range(n):
    list3[i] = i
time3 = time.time() - start_time

print(f"性能比较（{n}个元素）:")
print(f"list(range()): {time1:.6f}秒")
print(f"列表推导式: {time2:.6f}秒")
print(f"预分配+循环: {time3:.6f}秒")

# 内存使用比较
print(f"\n内存使用:")
print(f"list对象大小: {sys.getsizeof(list1)} 字节")
print(f"range对象大小: {sys.getsizeof(range(n))} 字节")
print(f"生成器大小: {sys.getsizeof(x for x in range(n))} 字节")
```

### 浅拷贝与深拷贝

```python
import copy

# 原始数据
original = [[1, 2], [3, 4], [5, 6]]

# 直接赋值（引用）
reference = original
print(f"原始数据: {original}")
print(f"引用: {reference}")
print(f"是否同一对象: {original is reference}")

# list()创建浅拷贝
shallow_copy = list(original)
print(f"浅拷贝: {shallow_copy}")
print(f"是否同一对象: {original is shallow_copy}")
print(f"内部列表是否同一对象: {original[0] is shallow_copy[0]}")

# 修改测试
original[0][0] = 999
print(f"\n修改原始数据后:")
print(f"原始数据: {original}")
print(f"引用: {reference}")
print(f"浅拷贝: {shallow_copy}")

# 深拷贝
original2 = [[1, 2], [3, 4], [5, 6]]
deep_copy = copy.deepcopy(original2)
original2[0][0] = 888
print(f"\n深拷贝测试:")
print(f"原始数据: {original2}")
print(f"深拷贝: {deep_copy}")

# 使用列表推导式创建深拷贝
original3 = [[1, 2], [3, 4], [5, 6]]
deep_copy_manual = [row[:] for row in original3]  # 对于二维列表
original3[0][0] = 777
print(f"\n手动深拷贝:")
print(f"原始数据: {original3}")
print(f"手动深拷贝: {deep_copy_manual}")
```

### 类型转换注意事项

```python
# 字符串转换
string_data = "hello"
char_list = list(string_data)
print(f"字符串转列表: {char_list}")

# 数字字符串
number_string = "12345"
digit_list = list(number_string)
print(f"数字字符串转列表: {digit_list}")

# 如果想要数字列表
number_list = [int(digit) for digit in number_string]
print(f"数字列表: {number_list}")

# 字节串转换
byte_data = b"hello"
byte_list = list(byte_data)
print(f"字节串转列表: {byte_list}")  # 输出ASCII码值

# 字节串转字符列表
char_from_bytes = list(byte_data.decode('utf-8'))
print(f"字节串转字符列表: {char_from_bytes}")

# None值处理
try:
    none_list = list(None)
except TypeError as e:
    print(f"None转换错误: {e}")

# 处理可能为None的情况
def safe_list_conversion(obj):
    """安全的列表转换"""
    if obj is None:
        return []
    try:
        return list(obj)
    except TypeError:
        return [obj]  # 如果不可迭代，包装成单元素列表

test_values = [None, "hello", [1, 2, 3], 42, (4, 5, 6)]
for value in test_values:
    result = safe_list_conversion(value)
    print(f"{value} -> {result}")
```

### 大数据处理

```python
# 处理大型数据集时的内存优化
def process_large_dataset(data_source, batch_size=1000):
    """批量处理大型数据集"""
    batch = []
    results = []
    
    for item in data_source:
        batch.append(item)
        
        if len(batch) >= batch_size:
            # 处理批次
            processed_batch = [item * 2 for item in batch]  # 示例处理
            results.extend(processed_batch)
            batch = []  # 清空批次
    
    # 处理剩余数据
    if batch:
        processed_batch = [item * 2 for item in batch]
        results.extend(processed_batch)
    
    return results

# 模拟大型数据源
def large_data_generator(size):
    """生成大型数据的生成器"""
    for i in range(size):
        yield i

# 测试批量处理
large_data = large_data_generator(10000)
processed_results = process_large_dataset(large_data, batch_size=500)
print(f"处理了 {len(processed_results)} 个数据项")
print(f"前10个结果: {processed_results[:10]}")
print(f"后10个结果: {processed_results[-10:]}")

# 内存友好的数据转换
def memory_efficient_conversion(iterable, chunk_size=1000):
    """内存友好的大型可迭代对象转换"""
    result = []
    chunk = []
    
    for item in iterable:
        chunk.append(item)
        if len(chunk) >= chunk_size:
            result.extend(chunk)
            chunk = []  # 释放内存
    
    if chunk:
        result.extend(chunk)
    
    return result

# 比较内存使用
import tracemalloc

# 开始内存跟踪
tracemalloc.start()

# 直接转换大型range
large_range = range(100000)
direct_list = list(large_range)

current, peak = tracemalloc.get_traced_memory()
print(f"直接转换内存使用: 当前 {current / 1024 / 1024:.2f} MB, 峰值 {peak / 1024 / 1024:.2f} MB")

tracemalloc.stop()
```

## 🔗 相关内容

### 相关函数
- [tuple() - 元组构造函数](tuple/) - 创建元组
- [set() - 集合构造函数](set/) - 创建集合
- [dict() - 字典构造函数](dict/) - 创建字典
- [str() - 字符串构造函数](str/) - 创建字符串
- [range() - 范围函数](range/) - 生成数字序列
- [enumerate() - 枚举函数](enumerate/) - 枚举索引

### 相关模块
- [copy模块](../stdlib/copy/) - 拷贝操作
- [itertools模块](../stdlib/itertools/) - 迭代工具
- [collections模块](../stdlib/collections/) - 容器数据类型
- [array模块](../stdlib/array/) - 数组类型

### 相关概念
- [列表推导式](../basics/list-comprehensions/) - 列表生成
- [序列类型](../basics/sequence-types/) - 序列操作
- [迭代器和生成器](../advanced/iterators-generators/) - 迭代协议
- [内存管理](../advanced/memory-management/) - 内存优化

## 📚 扩展阅读

- [Python官方文档 - list()](https://docs.python.org/3/library/functions.html#func-list)
- [Python官方文档 - 列表类型](https://docs.python.org/3/library/stdtypes.html#list)
- [列表推导式](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions)
- [序列类型操作](https://docs.python.org/3/library/stdtypes.html#sequence-types-list-tuple-range)

## 🏷️ 标签

`类型转换` `容器` `序列` `数据结构` `可变类型`

---

**最后更新**: 2024-01-15  
**作者**: Python文档工程师  
**版本**: 1.0