---
layout: doc
title: functools - 高阶函数和可调用对象操作
permalink: /docs/stdlib/functools/
category: stdlib
tags: [functools, 高阶函数, 装饰器, partial, wraps, reduce]
description: Python 标准库中用于高阶函数和可调用对象操作的工具模块
author: Python 文档团队
date: 2024-12-21
updated: 2024-12-21
version: 1.0
difficulty: "中级"
---

# functools - 高阶函数和可调用对象操作

## 📝 概述

`functools` 模块提供了用于高阶函数：指那些作用于函数或者返回其它函数的函数，通常只要是可以被当做函数调用的对象就是这个模块的目标。该模块为函数式编程提供了强大的工具，包括函数部分应用、装饰器工具、以及其他高级功能。

## 🎯 学习目标

- 掌握 `partial` 函数的部分应用技术
- 理解装饰器相关工具 `wraps` 和 `update_wrapper`
- 学会使用 `reduce` 进行聚合计算
- 了解 `total_ordering` 装饰器的比较功能
- 掌握 `cmp_to_key` 的转换技巧

## 📋 前置知识

- Python 基础语法和函数定义
- 装饰器概念和使用
- 函数式编程基础
- 类和对象的基本概念

## 🔍 详细内容

### 模块简介

functools 模块在 Python 2.7 及以上版本中提供了以下主要功能：

- `partial` - 针对函数起作用，实现部分参数固定
- `reduce` - 与 Python 内置的 reduce 函数功能一样（为 Python 3 过渡）
- `wraps` - 可用作装饰器，简化调用 update_wrapper 的过程
- `update_wrapper` - 更新包裹函数，使其看起来更像被包裹的函数
- `total_ordering` - 类装饰器，按照缺失顺序填充比较方法
- `cmp_to_key` - 将比较函数转换为关键字函数（Python 3 不支持）

### partial - 函数部分应用

`functools.partial` 用于部分应用一个函数，它基于一个函数创建一个可调用对象，把原函数的某些参数固定，调用时只需要传递未固定的参数即可。

#### 基本用法

```python
import functools

def add(a, b):
    print("当前结果值", a + b)
    return a + b

# 固定第一个参数为 1
add_one = functools.partial(add, 1)
result = add_one(2)  # 输出: 当前结果值 3

# 实际应用示例：固定读取块大小
RECORD_SIZE = 32

with open('data.bin', 'rb') as f:
    records = iter(partial(f.read, RECORD_SIZE), b'')
    for r in records:
        print(r)
```

#### partial 的实现原理

partial 是一个类，通过实现 `__new__` 和 `__call__` 方法来创建可调用对象：

```python
class partial:
    """New function with partial application of the given arguments
    and keywords.
    """
    
    __slots__ = "func", "args", "keywords", "__dict__", "__weakref__"

    def __new__(*args, **keywords):
        if not args:
            raise TypeError("descriptor '__new__' of partial needs an argument")
        if len(args) < 2:
            raise TypeError("type 'partial' takes at least one argument")
        cls, func, *args = args
        if not callable(func):
            raise TypeError("the first argument must be callable")
        args = tuple(args)

        # 支持嵌套调用：partial(partial(add,1),2)
        if hasattr(func, "func"):
            args = func.args + args
            tmpkw = func.keywords.copy()
            tmpkw.update(keywords)
            keywords = tmpkw
            del tmpkw
            func = func.func

        self = super(partial, cls).__new__(cls)
        self.func = func
        self.args = args
        self.keywords = keywords
        return self

    def __call__(*args, **keywords):
        if not args:
            raise TypeError("descriptor '__call__' of partial needs an argument")
        self, *args = args
        newkeywords = self.keywords.copy()
        newkeywords.update(keywords)
        return self.func(*self.args, *args, **newkeywords)
```

### wraps 和 update_wrapper

这两个函数用于装饰器开发，确保被装饰的函数保持原有的元数据。

#### update_wrapper 详解

```python
def update_wrapper(wrapper,
                   wrapped,
                   assigned = WRAPPER_ASSIGNMENTS,
                   updated = WRAPPER_UPDATES):
    """Update a wrapper function to look like the wrapped function"""
    for attr in assigned:
        try:
            value = getattr(wrapped, attr)
        except AttributeError:
            pass
        else:
            setattr(wrapper, attr, value)
    for attr in updated:
        getattr(wrapper, attr).update(getattr(wrapped, attr, {}))
    wrapper.__wrapped__ = wrapped
    return wrapper
```

#### wraps 装饰器

```python
def wraps(wrapped,
          assigned = WRAPPER_ASSIGNMENTS,
          updated = WRAPPER_UPDATES):
    """Decorator factory to apply update_wrapper() to a wrapper function"""
    return partial(update_wrapper, wrapped=wrapped,
                   assigned=assigned, updated=updated)

# 使用示例
def my_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"调用函数: {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@my_decorator
def example():
    """这是一个示例函数"""
    pass

print(example.__name__)  # 输出: example
print(example.__doc__)   # 输出: 这是一个示例函数
```

### reduce - 聚合函数

与 Python 内置的 reduce 函数功能相同，用于累积计算：

```python
from functools import reduce

# 计算列表元素乘积
numbers = [1, 2, 3, 4, 5]
product = reduce(lambda x, y: x * y, numbers)
print(product)  # 输出: 120

# 找到最大值
max_value = reduce(lambda x, y: x if x > y else y, numbers)
print(max_value)  # 输出: 5
```

### total_ordering - 比较方法自动生成

这个装饰器针对某个类，如果定义了 `__eq__` 和其他比较方法中的至少一个，会自动生成其他几个比较方法：

```python
from functools import total_ordering

@total_ordering
class Person:
    def __init__(self, firstname, lastname):
        self.firstname = firstname
        self.lastname = lastname
    
    # 定义相等的比较函数
    def __eq__(self, other):
        return ((self.lastname.lower(), self.firstname.lower()) == 
                (other.lastname.lower(), other.firstname.lower()))

    # 定义小于的比较函数
    def __lt__(self, other):
        return ((self.lastname.lower(), self.firstname.lower()) < 
                (other.lastname.lower(), other.firstname.lower()))

p1 = Person("000", "123")
p2 = Person("000", "1231")

print(p1 < p2)   # True
print(p1 <= p2)  # True  (自动生成)
print(p1 == p2)  # False
print(p1 > p2)   # False (自动生成)
print(p1 >= p2)  # False (自动生成)
```

### cmp_to_key - 比较函数转换

将老式比较函数转换成 key 函数，用在接受 key 函数的方法中：

```python
from functools import cmp_to_key

def compare(x, y):
    """比较函数：小于返回负数，等于返回0，大于返回正数"""
    return x - y

# 转换为 key 函数用于排序
numbers = [5, 2, 8, 1, 9]
sorted_numbers = sorted(numbers, key=cmp_to_key(compare))
print(sorted_numbers)  # 输出: [1, 2, 5, 8, 9]
```

## 💡 实际应用

### 基础用法：文件读取优化

```python
from functools import partial

def read_file_chunks(filename, chunk_size=1024):
    """使用 partial 简化文件块读取"""
    with open(filename, 'rb') as f:
        reader = partial(f.read, chunk_size)
        for chunk in iter(reader, b''):
            yield chunk

# 使用示例
for chunk in read_file_chunks('large_file.dat', 4096):
    process_chunk(chunk)
```

### 高级用法：装饰器开发

```python
from functools import wraps
import time

def timer(func):
    """计时装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} 执行时间: {end - start:.4f}秒")
        return result
    return wrapper

@timer
def slow_function():
    """一个慢函数示例"""
    time.sleep(1)
    return "完成"

result = slow_function()
```

### 实际案例：配置化函数

```python
from functools import partial

# 日志记录器配置
def log_message(level, message, timestamp=None):
    """通用日志记录函数"""
    if timestamp is None:
        timestamp = time.time()
    print(f"[{level}] {timestamp}: {message}")

# 创建特定级别的日志记录器
info = partial(log_message, "INFO")
error = partial(log_message, "ERROR")
debug = partial(log_message, "DEBUG")

# 使用
info("系统启动成功")
error("数据库连接失败")
debug("正在处理用户请求")
```

## ⚠️ 注意事项

- `partial` 对象不是函数，而是可调用对象，在某些需要真正函数的场景中可能不适用
- 使用 `wraps` 装饰器时，确保在装饰器内部函数定义之前使用
- `total_ordering` 要求类必须定义 `__eq__` 方法和至少一个其他比较方法
- `cmp_to_key` 在 Python 3 中主要用于兼容老代码
- 过度使用函数式编程可能影响代码可读性，需要权衡使用

## 🔗 相关内容

- [operator 模块](../operator/) - 运算符函数映射
- [itertools 模块](../itertools/) - 迭代器工具
- [inspect 模块](../inspect/) - 对象检查和反射
- [copy 模块](../copy/) - 对象拷贝功能

## 📚 扩展阅读

- [Python 官方文档 - functools](https://docs.python.org/3/library/functools.html)
- [函数式编程 HOWTO](https://docs.python.org/3/howto/functional.html)
- [装饰器模式详解](https://python-patterns.guide/gang-of-four/decorator-pattern/)

## 🏷️ 标签

`functools` `高阶函数` `装饰器` `partial` `wraps` `reduce`

---

**最后更新**: 2024-12-21  
**作者**: Python 文档团队  
**版本**: 1.0