---
layout: doc
title: Collections - Python高级容器模块
permalink: /docs/stdlib/collections/
category: stdlib
tags: [collections, Counter, deque, namedtuple, OrderedDict, defaultdict, ChainMap]
description: Python collections模块提供了多种高级容器类型，包括Counter计数器、deque双端队列、namedtuple命名元组、OrderedDict有序字典、defaultdict默认字典、ChainMap多字典映射
author: Python模型书
date: 2024-01-15
updated: 2025-08-18
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

#### 设计理念与主要特点（来自原始文档迁移与增强）

- 组合多个字典：ChainMap 可以将多个字典组合在一起，形成一个单一的视图；这是逻辑组合，底层字典保持独立。
- 优先级搜索：按照传入顺序查找键，先匹配先返回，高优先级配置可覆盖低优先级配置。
- 可变性：对 ChainMap 的赋值、删除只作用于第一个映射（maps[0]），适合动态配置管理。
- 内存效率：只保存底层映射的引用而非拷贝，适合大规模配置上下文。
- 责任链模式：天然适合“默认值 → 用户配置 → 环境变量/临时配置”等覆盖场景。

#### 创建嵌套上下文：new_child() 与 parents

```python
from collections import ChainMap

# 创建基础上下文
base = ChainMap({'base_key': 'base_value'})

# 创建子上下文（作为新的头部映射）
child1 = base.new_child({'child1_key': 'child1_value'})
child2 = base.new_child({'child2_key': 'child2_value'})

# 常用访问
print(child1.maps[0])    # 当前上下文: {'child1_key': 'child1_value'}
print(child1.maps[-1])   # 根上下文: {'base_key': 'base_value'}
print(child1.parents)    # 父级链: ChainMap({'base_key': 'base_value'})

# 增删改查（仍然只影响头部映射）
child1['new_key'] = 'new_value'
print(child1['new_key'])     # 'new_value'
del child1['new_key']

# 实用方法
print(list(child1))          # 列出所有键
print('base_key' in child1)  # True
print(len(child1))           # 键的总数
print(dict(child1))          # 转普通字典（会进行合并生成快照）
print(child1.items())        # ItemsView 视图
```

#### 命令行参数 + 环境变量 + 默认配置（多源优先级整合）

```python
from collections import ChainMap
import os
import argparse

# 1) 解析命令行参数
parser = argparse.ArgumentParser()
parser.add_argument('-u', '--user')
parser.add_argument('-d', '--debug')
args = parser.parse_args()

# 仅保留有值的参数
cli_args = {k: v for k, v in vars(args).items() if v}

# 2) 默认配置
defaults = {'user': 'guest', 'debug': 'False'}

# 3) 将多个配置源组合：命令行 > 环境变量 > 默认值
config = ChainMap(cli_args, os.environ, defaults)

print(f"User: {config['user']}")
print(f"Debug: {config['debug']}")

# 运行示例：
# python main.py          -> User: guest, Debug: False
# python main.py -u admin --debug true  -> User: admin, Debug: true
```

提示：如需了解命令行解析细节，可参考相关文档：argparse 与 os 环境变量读取。

- 相关文档：
  - [argparse 模块 - 命令行参数解析](./argparse/)
  - [os 模块 - 操作系统接口](./os/)

#### 结合 configparser 的配置管理（覆盖优先级 + 类型转换）

```python
from collections import ChainMap
import configparser
import os

# 解析默认配置（INI）
config = configparser.ConfigParser()
config.read_string('''
[Database]
host = localhost
port = 5432
name = myapp_db

[Server]
host = 127.0.0.1
port = 8000
debug = False
''')

# 从解析结果构造默认配置字典
default_db = dict(config['Database'])
default_server = dict(config['Server'])

# 环境变量（高优先级），仅取存在的键
env_db = {k: v for k, v in {
    'host': os.environ.get('DB_HOST'),
    'port': os.environ.get('DB_PORT'),
    'name': os.environ.get('DB_NAME')
}.items() if v is not None}

env_server = {k: v for k, v in {
    'host': os.environ.get('SERVER_HOST'),
    'port': os.environ.get('SERVER_PORT'),
    'debug': os.environ.get('SERVER_DEBUG')
}.items() if v is not None}

# 使用 ChainMap 组合：环境变量 > 默认配置
db_config = ChainMap(env_db, default_db)
server_config = ChainMap(env_server, default_server)

# 统一访问函数（含类型转换）
def get_database_config():
    return {
        'host': db_config['host'],
        'port': int(db_config['port']),
        'name': db_config['name']
    }


def get_server_config():
    return {
        'host': server_config['host'],
        'port': int(server_config['port']),
        'debug': str(server_config['debug']).lower() == 'true'
    }

if __name__ == '__main__':
    print('数据库配置:', get_database_config())
    print('服务器配置:', get_server_config())
```

#### 性能考虑

- 查找性能：时间复杂度 O(n)，n 为包含的映射数量；映射过多时查找成本上升。
- 内存使用：轻量，仅保存引用，不复制底层字典。
- 更新操作：仅作用于第一个映射，更新路径明确，性能稳定。

#### ChainMap 与其他工具的对比

1) 与字典合并（update、解包）
- 优点：简单直接，适合一次性合并。
- 缺点：会创建新对象，不能保留源字典独立性，动态优先级不便。
- ChainMap：逻辑组合，保留独立性，优先级可动态调整。

2) 与配置文件解析器（如 configparser）
- 解析器优点：支持多格式、持久化、适合文件配置。
- 解析器缺点：需读写文件，运行时灵活性弱于内存结构。
- ChainMap：适合运行时在内存中叠加与切换配置层。

3) 与环境变量
- 环境变量优点：跨平台、便于 CI/CD。
- 环境变量缺点：不适合复杂层级结构，类型/校验需自管。
- ChainMap：把环境变量视作一层映射，与其他配置源灵活组合。

#### 最佳实践

1) 合理的优先级顺序（建议）：
   - 命令行参数（最高） → 环境变量 → 用户配置文件 → 系统默认值（最低）

2) 健壮的异常处理：
```python
try:
    value = c['non_existent_key']
except KeyError:
    print('键不存在')
```

3) 明确更新策略（只修改头部映射）：
```python
# 推荐：更新第一个映射
c['key'] = 'value'

# 若必须更新后续映射，显式指定
c.maps[1]['key'] = 'value'  # 谨慎使用
```

#### 注意事项

- 更新操作只影响第一个字典；如需修改后续层，直接操作对应 maps[i]。
- 始终清楚键的查找顺序，避免意外覆盖；可通过 .maps 观察当前链顺序。
- 底层字典若变更，变更会实时反映在 ChainMap 视图中；如需快照可使用 copy/deepcopy。

#### 常见问题与解决方案（FAQ）

1) 如何处理重复键（查看所有层的值）？
```python
from collections import ChainMap

d1 = {'a': 1, 'b': 2}
d2 = {'b': 3, 'c': 4}
chain = ChainMap(d1, d2)
all_b_values = [d['b'] for d in chain.maps if 'b' in d]
print(all_b_values)  # [2, 3]
```

2) 如何创建只读视图？
```python
from collections import ChainMap
from types import MappingProxyType

# 方法1：使用 MappingProxyType 包裹底层字典
rd1 = MappingProxyType({'a': 1, 'b': 2})
rd2 = MappingProxyType({'c': 3, 'd': 4})
readonly_chain = ChainMap(rd1, rd2)

# 方法2：自定义只读 ChainMap
class ReadOnlyChainMap(ChainMap):
    def __setitem__(self, key, value):
        raise TypeError('只读 ChainMap 不支持修改操作')
    def pop(self, key, *args):
        raise TypeError('只读 ChainMap 不支持删除操作')
    def clear(self):
        raise TypeError('只读 ChainMap 不支持清空操作')

config = ReadOnlyChainMap({'debug': True}, {'port': 8000})
try:
    config['debug'] = False  # 将引发 TypeError
except TypeError as e:
    print(f'错误：{e}')
```

#### 小结

ChainMap 是管理多层配置与上下文的利器，通过 new_child/parents 可以轻松构建层叠作用域；将命令行参数、环境变量与默认配置组合到一个视图中，能显著简化配置覆盖逻辑。在理解“只影响头部映射”的更新语义与查找顺序后，你可以构建清晰、可维护、性能良好的配置系统。

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