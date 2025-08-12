---
layout: doc
title: Collections - Python高级容器模块
permalink: /docs/stdlib/collections/
category: stdlib
tags: [collections, Counter, deque, namedtuple, OrderedDict, defaultdict, ChainMap]
description: Python collections模块提供了多种高级容器类型，包括Counter计数器、deque双端队列、namedtuple命名元组、OrderedDict有序字典等
author: Python模型书
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# Collections - Python高级容器模块

## 📝 概述

collections模块包含了一些特殊的容器，针对Python内置的容器（如list、dict、set和tuple）提供了另一种选择。这些容器提供了更强大的功能和更好的性能特性。

## 🎯 学习目标

- 掌握Counter计数器的使用方法和应用场景
- 理解deque双端队列的特性和优势
- 学会使用namedtuple创建命名元组
- 了解OrderedDict有序字典的特点
- 掌握defaultdict默认字典的用法
- 学习ChainMap多字典映射的使用

## 📋 前置知识

- Python基础语法和数据类型
- 字典、列表、元组等内置容器的使用
- 面向对象编程基础概念

## 🔍 详细内容

### 基本概念

collections模块提供了以下主要容器类型：

- **Counter**: dict的子类，用于计算可hash的对象
- **deque**: 类似于list的容器，可以快速在队列头部和尾部添加、删除元素
- **namedtuple**: 可以创建包含名称的tuple
- **OrderedDict**: dict的子类，可以记住元素的添加顺序
- **defaultdict**: dict的子类，可以调用提供默认值的函数
- **ChainMap**: 用于管理多个字典的映射

### 模块导入

```python
# 导入整个模块
import collections

# 导入特定类
from collections import Counter, deque, namedtuple, OrderedDict, defaultdict, ChainMap

# 导入所有类（不推荐）
from collections import *
```

## 💡 实际应用

### Counter - 计数器

Counter是dict的子类，专门用于计数可hash的对象。

#### 基础用法示例

```python
from collections import Counter

# 顾客光顾次数统计
name = ['z', 'l', 'x', 'x', 'p', 'y', 's', 'l', 'b', 'x']

# 统计次数
name_count = Counter(name)
print(name_count)
# 输出: Counter({'x': 3, 'l': 2, 'z': 1, 'p': 1, 'y': 1, 's': 1, 'b': 1})

# 打印来的最多的2个人
name_count_max2 = name_count.most_common(2)
print(name_count_max2)
# 输出: [('x', 3), ('l', 2)]

# 向历史中添加新的用户
name_new = ['a', 'z', 'l']
name_count.update(name_new)
print(name_count)

# 转化为字典
name_new_count = dict(name_count)
print(name_new_count)
```

#### Counter初始化方式

```python
from collections import Counter

# 创建空的counter
c = Counter()
print(c)  # Counter()

# 从可迭代字符串初始化
c = Counter("gallahad")
print(c)  # Counter({'a': 3, 'l': 2, 'h': 1, 'g': 1, 'd': 1})

# 从映射初始化
c = Counter({'red': 4, 'blue': 2})
print(c)  # Counter({'red': 4, 'blue': 2})

# 从关键字参数初始化
c = Counter(cats=4, dogs=8)
print(c)  # Counter({'dogs': 8, 'cats': 4})
```

#### Counter特殊方法

```python
from collections import Counter

# elements() - 返回迭代器
c = Counter(a=2, b=4, c=0, d=-2, e=1)
print(list(c.elements()))  # ['a', 'a', 'b', 'b', 'b', 'b', 'e']

# most_common() - 返回最常见的元素
print(Counter('abracadabra').most_common(3))
# 输出: [('a', 5), ('r', 2), ('b', 2)]

# subtract() - 元素相减
c = Counter(a=4, b=2, c=0, d=-2)
d = Counter(a=1, b=2, c=-3, d=4)
c.subtract(d)
print(c)  # Counter({'a': 3, 'c': 3, 'b': 0, 'd': -6})

# update() - 元素相加
c = Counter(a=4, b=2, c=0, d=-2)
d = Counter(a=1, b=2, c=-3, d=4)
c.update(d)
print(c)  # Counter({'a': 5, 'b': 4, 'd': 2, 'c': -3})
```

#### Counter数学操作

```python
from collections import Counter

c = Counter(a=3, b=1, c=-2)
d = Counter(a=1, b=2, c=4)

# 加法
print(c + d)  # Counter({'a': 4, 'b': 3, 'c': 2})

# 减法
print(c - d)  # Counter({'a': 2})

# 交集
print(c & d)  # Counter({'a': 1, 'b': 1})

# 并集
print(c | d)  # Counter({'c': 4, 'a': 3, 'b': 2})
```

### deque - 双端队列

deque是"double-end queue"的简称，支持线程安全、高效的在两端插入和删除元素。

#### 基础用法

```python
from collections import deque

# 创建deque
d = deque('ghi')
print(d)  # deque(['g', 'h', 'i'])

# 右侧添加元素
d.append('j')
print(d)  # deque(['g', 'h', 'i', 'j'])

# 左侧添加元素
d.appendleft('f')
print(d)  # deque(['f', 'g', 'h', 'i', 'j'])

# 右侧删除元素
right_item = d.pop()
print(right_item)  # 'j'
print(d)  # deque(['f', 'g', 'h', 'i'])

# 左侧删除元素
left_item = d.popleft()
print(left_item)  # 'f'
print(d)  # deque(['g', 'h', 'i'])
```

#### deque高级操作

```python
from collections import deque

d = deque('ghi')

# 扩展操作
d.extend('jkl')  # 右侧扩展
print(d)  # deque(['g', 'h', 'i', 'j', 'k', 'l'])

d.extendleft('abc')  # 左侧扩展（注意顺序相反）
print(d)  # deque(['c', 'b', 'a', 'g', 'h', 'i', 'j', 'k', 'l'])

# 旋转操作
d.rotate(1)  # 向右旋转1位
print(d)  # deque(['l', 'c', 'b', 'a', 'g', 'h', 'i', 'j', 'k'])

d.rotate(-1)  # 向左旋转1位
print(d)  # deque(['c', 'b', 'a', 'g', 'h', 'i', 'j', 'k', 'l'])
```

#### 实际应用案例

```python
from collections import deque
import itertools

# 限定长度的deque - 类似Unix tail命令
def tail(filename, n=10):
    """返回文件的最后n行"""
    return deque(open(filename), n)

# 滑动窗口平均值计算
def moving_average(iterable, n=3):
    """计算滑动窗口平均值"""
    it = iter(iterable)
    d = deque(itertools.islice(it, n-1))
    d.appendleft(0)
    s = sum(d)
    for ele in it:
        s += ele - d.popleft()
        d.append(ele)
        yield s / float(n)

# 使用示例
array = [40, 30, 50, 46, 39, 44]
for avg in moving_average(array, n=3):
    print(f"平均值: {avg:.2f}")
```

### namedtuple - 命名元组

namedtuple可以创建包含名称的tuple，使代码更具可读性。

#### 基础用法

```python
from collections import namedtuple

# 创建Point类
Point = namedtuple('Point', ['x', 'y'])

# 实例化对象
p = Point(11, y=22)
print(p)  # Point(x=11, y=22)

# 通过索引访问
print(p[0] + p[1])  # 33

# 通过名称访问
print(p.x + p.y)  # 33

# 解包
x, y = p
print(x, y)  # 11 22
```

#### namedtuple特殊方法

```python
from collections import namedtuple

Point = namedtuple('Point', ['x', 'y'])
p = Point(11, 22)

# _make() - 从序列创建
t = [33, 44]
p2 = Point._make(t)
print(p2)  # Point(x=33, y=44)

# _asdict() - 转换为OrderedDict
print(p._asdict())  # OrderedDict([('x', 11), ('y', 22)])

# _replace() - 替换字段值
p3 = p._replace(x=33)
print(p3)  # Point(x=33, y=22)

# _fields - 字段名称
print(Point._fields)  # ('x', 'y')
```

#### 扩展namedtuple

```python
from collections import namedtuple

# 创建扩展的Point类
class Point(namedtuple('Point', 'x y')):
    __slots__ = ()
    
    @property
    def hypot(self):
        """计算到原点的距离"""
        return (self.x ** 2 + self.y ** 2) ** 0.5
    
    def __str__(self):
        return f"Point: x={self.x:6.3f} y={self.y:6.3f} hypot={self.hypot:6.3f}"

# 使用示例
for p in [Point(3, 4), Point(14, 5/7)]:
    print(p)
```

### OrderedDict - 有序字典

OrderedDict记住元素插入的顺序，在迭代时按插入顺序返回元素。

#### 基础用法

```python
from collections import OrderedDict

# 创建有序字典
od = OrderedDict()
od['apple'] = 1
od['banana'] = 2
od['cherry'] = 3

print(od)  # OrderedDict([('apple', 1), ('banana', 2), ('cherry', 3)])

# 按键排序
d = {"banana": 3, "apple": 2, "pear": 1, "orange": 4}
sorted_by_key = OrderedDict(sorted(d.items(), key=lambda t: t[0]))
print(sorted_by_key)
# OrderedDict([('apple', 2), ('banana', 3), ('orange', 4), ('pear', 1)])

# 按值排序
sorted_by_value = OrderedDict(sorted(d.items(), key=lambda t: t[1]))
print(sorted_by_value)
# OrderedDict([('pear', 1), ('apple', 2), ('banana', 3), ('orange', 4)])
```

#### 自定义OrderedDict

```python
from collections import OrderedDict

# 记住最后更新顺序的字典
class LastUpdatedOrderedDict(OrderedDict):
    def __setitem__(self, key, value):
        if key in self:
            del self[key]
        OrderedDict.__setitem__(self, key, value)

# 使用示例
obj = LastUpdatedOrderedDict()
obj["apple"] = 2
obj["windows"] = 3
print(obj)  # LastUpdatedOrderedDict([('apple', 2), ('windows', 3)])

obj["apple"] = 1  # 更新已存在的键
print(obj)  # LastUpdatedOrderedDict([('windows', 3), ('apple', 1)])
```

### defaultdict - 默认字典

defaultdict是dict的子类，当访问不存在的键时会自动创建默认值。

#### 基础用法

```python
from collections import defaultdict

# 使用list作为默认工厂
dd = defaultdict(list)
s = [('yellow', 1), ('blue', 2), ('yellow', 3), ('blue', 4), ('red', 5)]

for k, v in s:
    dd[k].append(v)

print(dict(dd))  # {'yellow': [1, 3], 'blue': [2, 4], 'red': [5]}

# 使用int作为默认工厂（计数）
dd_count = defaultdict(int)
s = "mississippi"

for k in s:
    dd_count[k] += 1

print(dict(dd_count))  # {'m': 1, 'i': 4, 's': 4, 'p': 2}
```

#### 使用set作为默认工厂

```python
from collections import defaultdict

dd = defaultdict(set)
s = [('red', 1), ('blue', 2), ('red', 3), ('blue', 4), ('red', 1), ('blue', 4)]

for k, v in s:
    dd[k].add(v)

print(dict(dd))  # {'red': {1, 3}, 'blue': {2, 4}}
```

### ChainMap - 多字典映射

ChainMap用于管理多个字典的映射，提供单一视图。

#### 基础用法

```python
from collections import ChainMap

a = {'x': 1, 'z': 5}
b = {'y': 2, 'z': 4}

# 创建ChainMap
c = ChainMap(a, b)
print(c['x'])  # 1 (来自a)
print(c['y'])  # 2 (来自b)
print(c['z'])  # 5 (来自a，优先级更高)

# 基本操作
print('长度:', len(c))  # 3
print('键:', list(c.keys()))  # ['y', 'z', 'x']
print('值:', list(c.values()))  # [2, 5, 1]

# 修改操作（只影响第一个字典）
c['z'] = 10
c['w'] = 40
del c['x']
print("字典a:", a)  # {'z': 10, 'w': 40}
```

#### 作用域管理示例

```python
from collections import ChainMap

# 模拟变量作用域
values = ChainMap()
values['x'] = 1

# 添加新的作用域
values = values.new_child()
values['x'] = 2

# 再添加一个作用域
values = values.new_child()
values['x'] = 3

print(values)  # ChainMap({'x': 3}, {'x': 2}, {'x': 1})
print(values['x'])  # 3

# 退出作用域
values = values.parents
print(values['x'])  # 2

values = values.parents
print(values['x'])  # 1
```

### 判断可迭代对象

```python
from collections.abc import Iterable

# 判断对象是否可迭代
print(isinstance('abc', Iterable))  # True
print(isinstance([1, 2, 3], Iterable))  # True
print(isinstance(123, Iterable))  # False
```

## ⚠️ 注意事项

- Counter对象访问不存在的键时返回0，而不是抛出KeyError
- deque在两端操作的时间复杂度是O(1)，但中间位置访问是O(n)
- namedtuple创建的是不可变对象，不能修改字段值
- OrderedDict在Python 3.7+中，普通dict也保持插入顺序，但OrderedDict提供了额外的方法
- defaultdict的default_factory必须是可调用对象或None
- ChainMap中的修改操作只影响第一个字典

## 🔗 相关内容

- [Python内置数据类型](../../builtins/dict/)
- [Python迭代器和生成器](../../basics/yield/)
- [Python面向对象编程](../../basics/class-definition/)

## 📚 扩展阅读

- [Python官方文档 - collections](https://docs.python.org/3/library/collections.html)
- [Python官方文档 - collections.abc](https://docs.python.org/3/library/collections.abc.html)

## 🏷️ 标签

`collections` `Counter` `deque` `namedtuple` `OrderedDict` `defaultdict` `ChainMap` `容器` `数据结构`

---

**最后更新**: 2024-01-15  
**作者**: Python模型书  
**版本**: 1.0