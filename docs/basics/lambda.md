---
layout: doc
title: lambda 表达式 - 匿名函数
permalink: /docs/basics/lambda/
category: basics
tags: [lambda, 匿名函数, 函数式编程, 表达式]
description: Python 中的 lambda 表达式是匿名函数的语法形式，常用于简洁地定义一次性的小函数
author: Python 文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "入门"
---

# lambda 表达式 - 匿名函数

## 📝 概述

lambda 表达式用于创建匿名函数，适合在只使用一次或简单函数逻辑的场景，能够让代码更简洁，尤其在函数式编程风格中与 filter、map、sorted、reduce 等函数配合使用更为便捷。

## 🎯 学习目标

- 掌握 lambda 表达式的基本语法
- 理解 lambda 与普通函数的区别与使用场景
- 学会将 lambda 与内置函数结合使用
- 掌握排序、过滤、映射等常见操作中的 lambda 用法

## 📋 前置知识

- Python 函数定义与调用
- 基本的列表、字典等数据结构
- 表达式与运算符

## 🔍 详细内容

### 基本语法

```python
lambda 参数列表: 表达式
```

- lambda 表达式只包含一个表达式，该表达式的计算结果就是函数的返回值
- 不能包含赋值语句、while/for 等复杂语句

#### 示例：与普通函数等价

```python
# 使用普通函数定义加法

def add(x, y):
    return x + y

# 使用 lambda 定义加法
add_lambda = lambda x, y: x + y

print(add(2, 3))        # 输出: 5
print(add_lambda(2, 3)) # 输出: 5
```

### 常见用法

#### 1) filter 与 lambda：过滤数据

```python
# 过滤出偶数
nums = [1, 2, 3, 4, 5, 6]
result = list(filter(lambda x: x % 2 == 0, nums))
print(result)  # 输出: [2, 4, 6]
```

#### 2) map 与 lambda：映射转换

```python
# 所有元素平方
nums = [1, 2, 3, 4]
result = list(map(lambda x: x ** 2, nums))
print(result)  # 输出: [1, 4, 9, 16]
```

#### 3) sorted 与 lambda：自定义排序

```python
# 按元组的第二个元素排序
pairs = [("a", 3), ("b", 1), ("c", 2)]
print(sorted(pairs, key=lambda x: x[1]))  # 输出: [('b', 1), ('c', 2), ('a', 3)]

# 按字符串长度排序
words = ["apple", "fig", "banana"]
print(sorted(words, key=lambda w: len(w)))  # 输出: ['fig', 'apple', 'banana']
```

#### 4) reduce 与 lambda：聚合计算

```python
from functools import reduce

# 求和
nums = [1, 2, 3, 4]
s = reduce(lambda acc, x: acc + x, nums, 0)
print(s)  # 输出: 10
```

### 进阶技巧

#### 条件表达式（类似三元运算）

```python
# 根据条件返回不同的结果
f = lambda x: "偶数" if x % 2 == 0 else "奇数"
print(f(3))  # 输出: 奇数
```

#### 结合 list.sort 进行原地排序

```python
# 学生列表，按分数倒序，再按年龄升序
students = [
    {"name": "Alice", "score": 90, "age": 20},
    {"name": "Bob", "score": 95, "age": 19},
    {"name": "Carol", "score": 95, "age": 21},
]

# 使用元组作为排序键，先比较分数的负值实现倒序，再按年龄正序
students.sort(key=lambda s: (-s["score"], s["age"]))
print(students)
# 输出: [{'name': 'Bob', 'score': 95, 'age': 19}, {'name': 'Carol', 'score': 95, 'age': 21}, {'name': 'Alice', 'score': 90, 'age': 20}]
```

#### 与字典/列表推导式配合

```python
# 根据复杂规则生成字典
keys = ["a", "b", "c"]
values = [1, 2, 3]
rule = lambda k, v: (k.upper(), v * v)
result = {rule(k, v)[0]: rule(k, v)[1] for k, v in zip(keys, values)}
print(result)  # 输出: {'A': 1, 'B': 4, 'C': 9}
```

### 与内置函数的配合示例

```python
# max/min 的 key 参数
nums = ["alpha", "beta", "gamma", "d"]
print(max(nums, key=lambda s: len(s)))  # 输出: gamma
print(min(nums, key=lambda s: len(s)))  # 输出: d
```

## ⚠️ 注意事项

- lambda 适合简单逻辑，复杂逻辑请使用 def 定义具名函数，提升可读性
- lambda 只能写表达式，不能包含赋值、多条语句或注释块
- 在调试时，lambda 没有函数名，调用栈定位不如具名函数直观

## 🔗 相关内容

- [函数定义与调用](../functions/)
- [函数作用域与闭包](../function-scope/)
- [sorted() - 排序函数](../../builtins/sorted/)
- [map() - 映射函数](../../builtins/map/)
- [filter() - 过滤函数](../../builtins/filter/)
- [reduce() - 归约函数（functools）](../../stdlib/functools/)

## 📚 扩展阅读

- Python 官方文档：lambda 表达式
- 《流畅的 Python》：函数式编程章节

## 🏷️ 标签

`lambda` `匿名函数` `函数式编程` `表达式` `排序` `过滤` `映射`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档团队  
**版本**: 1.0