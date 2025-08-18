---
layout: doc
title: heapq 模块 - 堆队列算法
permalink: /docs/stdlib/heapq/
category: stdlib
tags: [heapq, 堆, 优先队列, 排序, 算法]
description: Python heapq 模块实现堆队列算法，提供最大值和最小值的高效查找与操作
author: Python 文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# heapq 模块 - 堆队列算法

## 📝 概述

heapq 模块提供了堆队列算法的实现，也称为优先队列算法。堆是一个二叉树，具有以下性质：每个父节点的值都小于或等于其任何子节点的值。这种实现使用数组，对于从 0 开始计数的数组，有 heap[k] <= heap[2*k+1] 和 heap[k] <= heap[2*k+2]。相比之下，Python 的堆总是最小堆。

## 🎯 学习目标

- 掌握 heapq 模块的基本使用方法
- 理解堆数据结构的特点和应用场景
- 学会使用堆解决实际的排序和优先级问题
- 掌握堆的创建、插入、删除和查找操作
- 了解堆在算法优化中的应用

## 📋 前置知识

- Python 基本语法和数据结构
- 列表操作基础
- 函数和 lambda 表达式
- 二叉树基本概念

## 🔍 详细内容

### 基本概念

堆是一种特殊的完全二叉树数据结构，分为最大堆和最小堆。Python 的 heapq 模块实现的是最小堆，即父节点的值总是小于或等于子节点的值。

### 核心函数

#### heapq.heappush(heap, item)
将 item 值加入 heap 中，保持堆的不变性。

#### heapq.heappop(heap)
弹出并返回 heap 的最小值，保持堆的不变性。

#### heapq.heapify(x)
将列表 x 转换成堆，复杂度为 O(n)。

#### heapq.nlargest(n, iterable[, key])
从数据集合中找到前 n 个最大元素。

#### heapq.nsmallest(n, iterable[, key])
从数据集合中找到前 n 个最小元素。

## 💡 实际应用

### 创建堆

heapq 有两种方式创建堆：

**方法一：使用空列表逐步添加元素**

```python
import heapq

# 创建空堆并逐步添加元素
nums = [2, 3, 5, 1, 54, 23, 132]
heap = []
for num in nums:
    heapq.heappush(heap, num)  # 加入堆

print(heap[0])  # 如果只是想获取最小值而不是弹出，使用heap[0]
print([heapq.heappop(heap) for _ in range(len(nums))])  # 堆排序结果
# 输出: [1, 2, 3, 5, 23, 54, 132]
```

**方法二：使用 heapify 转换现有列表**

```python
import heapq

# 将现有列表转换为堆
nums = [2, 3, 5, 1, 54, 23, 132]
heapq.heapify(nums)
print([heapq.heappop(nums) for _ in range(len(nums))])  # 堆排序结果
# 输出: [1, 2, 3, 5, 23, 54, 132]
```

### 访问堆内容

```python
import heapq

nums = [2, 43, 45, 23, 12]
heapq.heapify(nums)

print(heapq.heappop(nums))  # 弹出最小值
# 输出: 2

# 如果需要所有堆排序后的元素
result = [heapq.heappop(nums) for _ in range(len(nums))]
print(result)
# 输出: [12, 23, 43, 45]
```

### 替换操作

如果需要删除堆中最小元素并加入一个元素，可以使用 `heapq.heapreplace()` 函数：

```python
import heapq

nums = [1, 2, 4, 5, 3]
heapq.heapify(nums)

heapq.heapreplace(nums, 23)

print([heapq.heappop(nums) for _ in range(len(nums))])
# 输出: [2, 3, 4, 5, 23]
```

### 获取最大或最小值

使用 `heapq.nlargest()` 或 `heapq.nsmallest()` 函数查找范围值：

```python
import heapq

nums = [1, 3, 4, 5, 2]
print(heapq.nlargest(3, nums))   # 输出: [5, 4, 3]
print(heapq.nsmallest(3, nums))  # 输出: [1, 2, 3]
```

### 使用 key 参数处理复杂数据

这两个函数还接受一个 key 参数，用于字典或其他数据结构类型：

```python
import heapq
from pprint import pprint

# 股票投资组合示例
portfolio = [
    {'name': 'IBM', 'shares': 100, 'price': 91.1},
    {'name': 'AAPL', 'shares': 50, 'price': 543.22},
    {'name': 'FB', 'shares': 200, 'price': 21.09},
    {'name': 'HPQ', 'shares': 35, 'price': 31.75},
    {'name': 'YHOO', 'shares': 45, 'price': 16.35},
    {'name': 'ACME', 'shares': 75, 'price': 115.65}
]

# 按价格排序找到最便宜的前三个
cheap = heapq.nsmallest(3, portfolio, key=lambda s: s['price'])
# 按价格排序找到最贵的前三个  
expensive = heapq.nlargest(3, portfolio, key=lambda s: s['price'])

pprint(cheap)
pprint(expensive)

"""
输出:
[{'name': 'YHOO', 'price': 16.35, 'shares': 45},
 {'name': 'FB', 'price': 21.09, 'shares': 200},
 {'name': 'HPQ', 'price': 31.75, 'shares': 35}]
[{'name': 'AAPL', 'price': 543.22, 'shares': 50},
 {'name': 'ACME', 'price': 115.65, 'shares': 75},
 {'name': 'IBM', 'price': 91.1, 'shares': 100}]
"""
```

### 合并有序序列

heapq 模块还提供了 `heapq.merge(*iterables)` 方法，用于合并多个排序后的序列：

```python
import heapq

num1 = [32, 3, 5, 34, 54, 23, 132]
num2 = [23, 2, 12, 656, 324, 23, 54]
num1 = sorted(num1)
num2 = sorted(num2)

res = heapq.merge(num1, num2)
print(list(res))
# 输出: [2, 3, 5, 12, 23, 23, 23, 32, 34, 54, 54, 132, 324, 656]
```

### 实际案例：实现堆排序算法

```python
from heapq import heappush, heappop

def heapsort(iterable):
    """使用堆实现排序算法"""
    h = []
    for value in iterable:
        heappush(h, value)
    return [heappop(h) for i in range(len(h))]

result = heapsort([1, 3, 5, 7, 9, 2, 4, 6, 8, 0])
print(result)
# 输出: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### 优先级队列示例

堆的值可以是元组类型，可以实现对带权值的元素进行排序：

```python
import heapq

# 任务优先级队列
h = []
heapq.heappush(h, (5, 'write code'))
heapq.heappush(h, (7, 'release product'))
heapq.heappush(h, (1, 'write spec'))
heapq.heappush(h, (3, 'create tests'))

# 按优先级顺序处理任务
while h:
    priority, task = heapq.heappop(h)
    print(f"优先级 {priority}: {task}")

"""
输出:
优先级 1: write spec
优先级 3: create tests
优先级 5: write code
优先级 7: release product
"""
```

## ⚠️ 注意事项

- **不稳定排序**：heapq 实现的排序算法是不稳定的，相等元素的相对顺序可能改变
- **最小堆特性**：Python 的 heapq 只实现最小堆，如需最大堆，可以将元素取负值
- **堆属性维护**：直接修改堆列表可能破坏堆属性，应使用提供的函数进行操作
- **空堆检查**：对空堆调用 `heappop()` 会引发 `IndexError`
- **性能考虑**：`nlargest()` 和 `nsmallest()` 对于小的 n 值比完整排序更高效

## 🔗 相关内容

- [sorted() - 排序函数](../../builtins/sorted/)
- [lambda 表达式 - 匿名函数](../../basics/lambda/)
- [collections.deque - 双端队列](../collections/)
- [queue 模块 - 队列实现](../queue/)

## 📚 扩展阅读

- [heapq 官方文档](https://docs.python.org/3/library/heapq.html)
- [堆数据结构详解](https://en.wikipedia.org/wiki/Heap_(data_structure))
- [优先队列应用](https://docs.python.org/3/library/queue.html#queue.PriorityQueue)

## 🏷️ 标签

`heapq` `堆` `优先队列` `排序` `算法` `数据结构`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档团队  
**版本**: 1.0