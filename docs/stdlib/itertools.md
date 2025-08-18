---
layout: doc
title: itertools 模块 - 高效的迭代器工具
permalink: /docs/stdlib/itertools/
category: stdlib
tags: [迭代器, 组合, 排列, 生成器, 函数式编程]
description: Python itertools 模块提供了一系列用于创建高效迭代器的工具函数，包括无限迭代器、有限迭代器和组合迭代器
author: Python文档团队
date: 2024-01-01
updated: 2024-01-01
version: 1.0
difficulty: "中级"
---

# itertools 模块 - 高效的迭代器工具

## 📝 概述

itertools 模块是 Python 标准库中用来操作迭代器的强大工具模块。它包含的函数都能够创建迭代器来用于 for 循环或者 next() 函数。该模块受到来自 APL、Haskell 和 SML 等函数式编程语言的启发，构成了一个"迭代器代数"，使得在纯 Python 中简洁高效地构造专用工具成为可能。

## 🎯 学习目标

- 掌握 itertools 模块的基本概念和用途
- 理解无限迭代器、有限迭代器和组合迭代器的区别
- 学会使用各种迭代器函数解决实际问题
- 了解迭代器的内存效率优势
- 掌握组合、排列等数学运算的实现

## 📋 前置知识

- 掌握 Python 基本语法和数据类型
- 理解迭代器和生成器的概念
- 熟悉函数式编程基础
- 了解 lambda 函数的使用

## 🔍 详细内容

### 基本概念

itertools 模块中的函数主要分为三类：

1. **无限迭代器（Infinite Iterators）**：生成无限序列的迭代器
2. **有限迭代器（Iterators Terminating on the Shortest Input Sequence）**：基于输入序列的有限迭代器
3. **组合迭代器（Combinatoric Iterators）**：用于排列、组合等数学运算的迭代器

### 迭代器的优势

使用迭代器的主要原因有两个：
- **提高内存效率**：不需要一次性将所有数据加载到内存中
- **更快的执行时间**：惰性计算，只在需要时才进行计算

### 基本数据分组示例

```python
# 使用 itertools.groupby 进行数据分组
from itertools import groupby
from collections import defaultdict

rows = [
    {'address': '5412 N CLARK', 'date': '07/01/2012'},
    {'address': '5148 N CLARK', 'date': '07/04/2012'},
    {'address': '5800 E 58TH', 'date': '07/02/2012'},
    {'address': '2122 N CLARK', 'date': '07/03/2012'},
    {'address': '5645 N RAVENSWOOD', 'date': '07/02/2012'},
    {'address': '1060 W ADDISON', 'date': '07/02/2012'},
    {'address': '4801 N BROADWAY', 'date': '07/01/2012'},
    {'address': '1039 W GRANVILLE', 'date': '07/04/2012'},
]

# 方法一：使用 groupby
rows.sort(key=lambda _: _['date'])
rows_datesort_1 = {}
for date, rows_item in groupby(rows, lambda _: _['date']):
    rows_datesort_1[date] = list(rows_item)
print(rows_datesort_1)

# 方法二：使用 defaultdict
rows_datesort_2 = defaultdict(list)
for rows_item in rows:
    rows_datesort_2[rows_item['date']].append(rows_item)
print(dict(rows_datesort_2))
```

## 💡 实际应用

### 无限迭代器（Infinite Iterators）

#### count(start=0, step=1)

生成从 start 开始，步长为 step 的无限数列。

```python
import itertools

# 基础用法
for i in itertools.count(10, 2):
    print(i)
    if i > 20: 
        break
# 输出: 10, 12, 14, 16, 18, 20, 22
```

#### cycle(iterable)

无限循环迭代一个可迭代对象中的元素。

```python
import itertools

# 无限循环字符串
for i in itertools.cycle("abcd"):
    print(i)
    # 输出: a, b, c, d, a, b, c, d, ... (无限循环)
    break  # 实际使用时需要设置停止条件
```

#### repeat(elem [,n])

重复一个元素 n 次或无限次。

```python
import itertools

# 重复元素 5 次
for i in itertools.repeat("abcd", 5):
    print(i)
# 输出: abcd, abcd, abcd, abcd, abcd
```

### 组合迭代器（Combinatoric Iterators）

#### product(*iterables, repeat=1)

计算可迭代对象的笛卡儿积。

```python
import itertools

# 基础笛卡儿积
for i in itertools.product([1,2,3], [4,5,6]):
    print(i)
# 输出: (1,4), (1,5), (1,6), (2,4), (2,5), (2,6), (3,4), (3,5), (3,6)

# 使用 repeat 参数
for i in itertools.product('ab', 'cd', repeat=2):
    print(i)
# 输出: ('a','c','a','c'), ('a','c','a','d'), ... 等16种组合

# 实际应用：生成密码组合
def generate_combinations(message):
    """根据输入文本生成字符组合"""
    mes_list = message.split(' ')
    mes_list = [list(word) for word in mes_list]
    result = []
    for combination in itertools.product(*mes_list):
        result.append("".join(combination))
    return result

message = 'how are you'
print(generate_combinations(message))
```

#### permutations(iterable, r=None)

返回可迭代对象的排列。

```python
import itertools

# 全排列
for i in itertools.permutations('abc'):
    print(i)
# 输出: ('a','b','c'), ('a','c','b'), ('b','a','c'), ('b','c','a'), ('c','a','b'), ('c','b','a')

# 指定长度的排列
for i in itertools.permutations('abc', 2):
    print(i)
# 输出: ('a','b'), ('a','c'), ('b','a'), ('b','c'), ('c','a'), ('c','b')
```

#### combinations(iterable, r)

返回可迭代对象的组合（不考虑顺序）。

```python
import itertools

# 从4个元素中选择2个的组合
for i in itertools.combinations('1234', 2):
    print(i)
# 输出: ('1','2'), ('1','3'), ('1','4'), ('2','3'), ('2','4'), ('3','4')
```

#### combinations_with_replacement(iterable, r)

返回可与自身重复的元素组合。

```python
import itertools

# 可重复的组合
for i in itertools.combinations_with_replacement('1234', 2):
    print(i)
# 输出: ('1','1'), ('1','2'), ('1','3'), ('1','4'), ('2','2'), ('2','3'), ('2','4'), ('3','3'), ('3','4'), ('4','4')
```

### 有限迭代器（Iterators Terminating on the Shortest Input Sequence）

#### chain(*iterables)

将多个可迭代对象连接成一个更大的迭代器。

```python
import itertools

# 连接不同类型的序列
l = [1, 2, 3, 4, 5]
t = (6, 7, 8, 9, 10)
s = 'abcdefg'
for i in itertools.chain(l, t, s):
    print(i)
# 输出: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, a, b, c, d, e, f, g
```

#### groupby(iterable, key=None)

按照 key 函数对相邻元素进行分组。

```python
import itertools

# 按大小写分组
for key, group in itertools.groupby('AaaBBbcCAAa', lambda c: c.upper()):
    print(f"{key}: {list(group)}")
# 输出: A: ['A','a','a'], B: ['B','B','b'], C: ['c','C'], A: ['A','A','a']

# 注意：使用前需要先排序
data = ['apple', 'banana', 'cherry', 'apricot', 'blueberry']
data.sort(key=lambda x: x[0])  # 按首字母排序
for key, group in itertools.groupby(data, key=lambda x: x[0]):
    print(f"{key}: {list(group)}")
```

#### accumulate(iterable [,func])

计算累积值的迭代器。

```python
import itertools

# 默认累加
for i in itertools.accumulate([0,1,0,1,1,2,3,5]):
    print(i)
# 输出: 0, 1, 1, 2, 3, 5, 8, 13

# 使用自定义函数
for i in itertools.accumulate([2,1,4,3,5], max):
    print(i)
# 输出: 2, 2, 4, 4, 5

# 处理字典键
d = {'a': 1, 'b': 2, 'c': 3}
for i in itertools.accumulate(d):
    print(i)
# 输出累积的键: a, ab, abc

# 处理字典值
for i in itertools.accumulate(d.values()):
    print(i)
# 输出: 1, 3, 6
```

### 高级应用案例

#### 内存高效的数据分组

```python
def naive_grouper(inputs, n):
    """内存效率低的分组方法"""
    num_groups = len(inputs) // n
    return [tuple(inputs[i*n:(i+1)*n]) for i in range(num_groups)]

def better_grouper(inputs, n):
    """使用迭代器的高效分组方法"""
    iters = [iter(inputs)] * n
    return zip(*iters)

# 比较内存使用
# naive_grouper 处理大数据时会消耗大量内存
# better_grouper 使用迭代器，内存效率高630倍
```

#### 函数式工具应用

```python
import itertools
from operator import pow

# 使用 starmap 应用函数到元组序列
data = [(1, 1), (2, 2), (3, 3)]
result = list(itertools.starmap(pow, data))
print(result)  # 输出: [1, 4, 27]

# 过滤和选择
numbers = [1, 3, 6, 7, 1]

# takewhile: 满足条件时收集元素
result1 = list(itertools.takewhile(lambda x: x < 5, numbers))
print(result1)  # 输出: [1, 3]

# dropwhile: 跳过满足条件的元素，然后收集剩余所有元素
result2 = list(itertools.dropwhile(lambda x: x < 5, numbers))
print(result2)  # 输出: [6, 7, 1]
```

## ⚠️ 注意事项

- **groupby 使用前需要排序**：groupby 只对相邻相同的元素进行分组，所以通常需要先排序
- **无限迭代器需要设置停止条件**：count、cycle、repeat 等函数会产生无限序列
- **迭代器只能遍历一次**：迭代器被消耗后需要重新创建
- **内存效率**：itertools 函数返回迭代器，不是列表，注意在需要时使用 list() 转换
- **Python 版本差异**：某些函数在不同 Python 版本中可能有变化（如 imap 在 Python 3 中已废弃）

## 🔗 相关内容

- [operator 模块 - 运算符函数映射](../operator/)
- [collections 模块 - 高级容器数据类型](../collections/)
- [functools 模块 - 高阶函数工具](../functools/)

## 📚 扩展阅读

- [Python itertools 官方文档](https://docs.python.org/3/library/itertools.html)
- [Itertools Recipes](https://docs.python.org/3/library/itertools.html#itertools-recipes)
- [函数式编程指南](https://docs.python.org/3/howto/functional.html)

## 🏷️ 标签

`迭代器` `组合` `排列` `生成器` `函数式编程`

---

**最后更新**: 2024-01-01  
**作者**: Python文档团队  
**版本**: 1.0