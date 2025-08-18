---
layout: doc
title: bisect 模块 - 二分查找与插入
permalink: /docs/stdlib/bisect/
category: stdlib
tags: [bisect, 二分查找, 有序数组, 排序, 插入]
description: Python bisect 模块提供二分查找算法支持，用于在有序数组中快速查找和插入元素，保持数组的排序状态
author: Python 文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# bisect 模块 - 二分查找与插入

## 📝 概述

bisect 模块为有序数组提供了二分查找算法的支持。该模块英文发音为 [baɪˈsekt]（对半分、二等分），是 Python 标准库中专门用于处理有序数组的高效工具。当你需要在 Python 中使用二分查找功能时，bisect 模块是首选解决方案。

二分搜索是一种在有序数组中查找某一特定元素的搜索算法。搜索过程从数组的中间元素开始，如果中间元素正好是要查找的元素，则搜索过程结束；如果某一特定元素大于或者小于中间元素，则在数组大于或小于中间元素的那一半中查找，而且跟开始一样从中间元素开始比较。如果在某一步骤数组为空，则代表找不到。这种搜索算法每一次比较都使搜索范围缩小一半。

![](https://www.runoob.com/wp-content/uploads/2019/05/Binary_search_into_array.png)

## 🎯 学习目标

- 掌握 bisect 模块的基本概念和二分查找原理
- 学会使用 bisect_left 和 bisect_right 查找插入位置
- 熟练使用 insort_left 和 insort_right 插入元素
- 理解左插入和右插入的区别及应用场景
- 掌握自定义有序容器的实现方法
- 学会使用二分查找解决实际问题

## 📋 前置知识

- Python 基本语法和数据结构
- 列表操作基础
- 排序算法基本概念
- 时间复杂度分析
- 面向对象编程基础

## 🔍 详细内容

### 基本概念

bisect 模块主要用于操作升序排序的有序数组。该模块提供的所有函数都假设操作的数组 `a` 是升序排序的有序数组。

### 核心函数

#### bisect_right(a, x, lo=0, hi=len(a))
在数组 `a` 中找到 `x` 应该插入的索引位置。如果 `a` 中已经存在元素 `x`，则返回在相同元素右边的插入位置。

**参数说明**:
- `a`: 有序数组
- `x`: 要查找插入位置的元素
- `lo`: 搜索范围的左边界（默认为0）
- `hi`: 搜索范围的右边界（默认为数组长度）

**返回值**: 应该插入的位置索引

#### bisect_left(a, x, lo=0, hi=len(a))
功能与 `bisect_right` 相同，但如果 `a` 中已经存在元素 `x`，则返回在相同元素左边的插入位置。

#### insort_right(a, x, lo=0, hi=len(a))
在数组 `a` 中插入元素 `x`，如果 `x` 已存在，则将 `x` 插入在相同元素的右边。

**返回值**: 无（直接修改原数组）

#### insort_left(a, x, lo=0, hi=len(a))
功能与 `insort_right` 相同，但如果 `x` 已存在，则将 `x` 插入在相同元素的左边。

#### insort(a, x, lo=0, hi=len(a))
根据实验结果，该方法与 `insort_right()` 功能相同。

#### bisect(a, x, lo=0, hi=len(a))
`bisect_right()` 的别名，功能完全相同。

## 💡 实际应用

### 自定义有序容器

以下示例展示了如何使用 bisect 模块创建一个自定义的有序容器：

```python
import collections
import bisect

class SortedItems(collections.abc.Sequence):
    """自定义有序容器示例"""
    def __init__(self, initial=None):
        self._items = sorted(initial) if initial is not None else []

    # 必需的序列方法
    def __getitem__(self, index):
        return self._items[index]

    def __len__(self):
        return len(self._items)

    # 在正确位置添加元素的方法
    def add(self, item):
        bisect.insort(self._items, item)

if __name__ == '__main__':
    items = SortedItems([5, 1, 3])
    print(list(items))  # [1, 3, 5]
    print(items[0])     # 1
    print(items[-1])    # 5
    items.add(2)
    print(list(items))  # [1, 2, 3, 5]
    items.add(-10)
    print(list(items))  # [-10, 1, 2, 3, 5]
    print(items[1:4])   # [1, 2, 3]
    print(3 in items)   # True
    print(len(items))   # 5
    for n in items:
        print(n)        # -10, 1, 2, 3, 5
```

### 边插入边排序

使用 bisect 可以在向数组插入数据的同时保持排序状态：

```python
import bisect
import random

random.seed(1)
print('New  pos  contents')
print('--------------------')
l = []

for i in range(1, 15):
    r = random.randint(1, 100)
    position = bisect.bisect(l, r)
    bisect.insort(l, r)
    print(f'{r:3d}  {position:3d}  {l}')
```

输出结果：
```
New  pos  contents
--------------------
 14    0  [14]
 85    1  [14, 85]
 77    1  [14, 77, 85]
 26    1  [14, 26, 77, 85]
 50    2  [14, 26, 50, 77, 85]
 45    2  [14, 26, 45, 50, 77, 85]
 66    4  [14, 26, 45, 50, 66, 77, 85]
 79    6  [14, 26, 45, 50, 66, 77, 79, 85]
 10    0  [10, 14, 26, 45, 50, 66, 77, 79, 85]
  3    0  [3, 10, 14, 26, 45, 50, 66, 77, 79, 85]
 84    9  [3, 10, 14, 26, 45, 50, 66, 77, 79, 84, 85]
 44    4  [3, 10, 14, 26, 44, 45, 50, 66, 77, 79, 84, 85]
 77    9  [3, 10, 14, 26, 44, 45, 50, 66, 77, 77, 79, 84, 85]
  1    0  [1, 3, 10, 14, 26, 44, 45, 50, 66, 77, 77, 79, 84, 85]
```

### 左插入与右插入的区别

当数组中存在重复元素时，左插入和右插入会有不同的行为：

```python
import bisect
import random

random.seed(1)
print('New  pos  contents (left insertion)')
print('-------------------------------------')
l = []

for i in range(1, 15):
    r = random.randint(1, 100)
    position = bisect.bisect_left(l, r)
    bisect.insort_left(l, r)
    print(f'{r:3d}  {position:3d}  {l}')
```

在上述代码中，当插入重复元素77时，使用左插入的位置索引是8，而使用右插入的位置索引是9。

### 自定义二分查找实现

#### 非递归实现

```python
def binary_search(alist, elem):
    """非递归二分查找"""
    start = 0
    end = len(alist) - 1
    while start <= end:
        mid = (end + start) // 2
        if elem == alist[mid]:
            return mid
        elif elem < alist[mid]:
            end = mid - 1
        else:
            start = mid + 1
    return None

# 测试
testlist = [0, 1, 2, 8, 13, 17, 19, 32, 42]
result = binary_search(testlist, 42)
print(f"元素42的索引: {result}")  # 输出: 8
```

#### 递归实现

```python
def binary_search_recursive(alist, elem):
    """递归二分查找"""
    if len(alist) == 0:
        return False
    
    mid = len(alist) // 2
    guess = alist[mid]
    
    if elem == guess:
        return True
    elif elem < guess:
        return binary_search_recursive(alist[:mid], elem)
    else:
        return binary_search_recursive(alist[mid+1:], elem)

# 测试
testlist = [0, 1, 2, 8, 13, 17, 19, 32, 42]
result = binary_search_recursive(testlist, 42)
print(f"元素42是否存在: {result}")  # 输出: True
```

#### 标准递归实现（返回索引）

```python
def binary_search_index(arr, l, r, x):
    """返回 x 在 arr 中的索引，如果不存在返回 -1"""
    
    # 基本判断
    if r >= l:
        mid = int(l + (r - l) / 2)
        
        # 元素正好在中间位置
        if arr[mid] == x:
            return mid
        
        # 元素小于中间位置的元素，只需要再比较左边的元素
        elif arr[mid] > x:
            return binary_search_index(arr, l, mid - 1, x)
        
        # 元素大于中间位置的元素，只需要再比较右边的元素
        else:
            return binary_search_index(arr, mid + 1, r, x)
    else:
        # 不存在
        return -1

# 测试数组
arr = [2, 3, 4, 10, 40]
x = 10

# 函数调用
result = binary_search_index(arr, 0, len(arr) - 1, x)

if result != -1:
    print(f"元素在数组中的索引为 {result}")
else:
    print("元素不在数组中")
```

### 高级应用

bisect 模块的 `bisect.bisect(list, key)` 函数类似于 Java 中 TreeMap 的 `tailMap(fromkey)` 方法，可以用于快速定位有序数据结构中的位置。

```python
import bisect

# 成绩排序应用示例
grades = [60, 70, 80, 85, 90, 95]
new_grade = 88

# 找到新成绩应该插入的位置
position = bisect.bisect_left(grades, new_grade)
print(f"成绩 {new_grade} 应该插入到位置 {position}")

# 插入新成绩并保持排序
bisect.insort(grades, new_grade)
print(f"插入后的成绩列表: {grades}")
```

## ⚠️ 注意事项

- bisect 模块的所有函数都假设输入数组是升序排序的
- 对于重复元素，要根据需求选择使用 left 还是 right 版本的函数
- bisect 模块主要用于维护已排序的数组，不适用于排序操作本身
- 时间复杂度为 O(log n)，比线性搜索 O(n) 更高效
- 插入操作的总时间复杂度为 O(n)，因为需要移动元素

## 🔗 相关内容

- [heapq 模块 - 堆队列算法](../heapq/)
- [sorted() 函数 - 排序操作](../../builtins/sorted/)
- [collections 模块 - 高级容器数据类型](../collections/)

## 📚 扩展阅读

- [Python 官方文档 - bisect 模块](https://docs.python.org/3/library/bisect.html)
- [二分查找算法详解](https://blog.csdn.net/qq_45978890/article/details/116094046)
- [算法导论 - 二分搜索](https://mitpress.mit.edu/books/introduction-algorithms)

## 🏷️ 标签

`bisect` `二分查找` `有序数组` `排序` `插入`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档团队  
**版本**: 1.0