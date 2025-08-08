---
layout: doc
title: operator 模块
permalink: /docs/stdlib/operator/
category: stdlib
tags: [operator, 运算符, 函数式编程, 标准库]
description: Python operator 模块详解，包含运算符函数映射、attrgetter、itemgetter、methodcaller 等高效工具
author: Python 文档团队
date: 2024-01-01
updated: 2024-01-01
version: 1.0
difficulty: "中级"
---

# operator 模块

## 📝 概述

operator 模块提供了一套与 Python 内置运算符对应的高效率函数。许多函数名与特殊方法名相同，只是没有双下划线。该模块包含对象的比较运算、逻辑运算、数学运算以及序列运算，还提供了三个强大的类：attrgetter、itemgetter 和 methodcaller，用于函数式编程和高效数据处理。

## 🎯 学习目标

- 理解 operator 模块的作用和优势
- 掌握运算符到函数的映射关系
- 学会使用 attrgetter、itemgetter、methodcaller 三个核心类
- 了解 operator 模块在排序和数据处理中的应用
- 掌握性能优化技巧

## 📋 前置知识

- Python 基本语法和运算符
- 函数式编程基础概念
- 排序和数据处理基础

## 🔍 详细内容

### 运算符映射表

operator 模块将 Python 运算符映射为对应的函数，提供了更高的执行效率。

| 操作 | 语法 | 函数 |
|------|------|------|
| 加法 | `a + b` | `add(a, b)` |
| 减法 | `a - b` | `sub(a, b)` |
| 乘法 | `a * b` | `mul(a, b)` |
| 除法 | `a / b` | `truediv(a, b)` |
| 整除 | `a // b` | `floordiv(a, b)` |
| 取模 | `a % b` | `mod(a, b)` |
| 幂运算 | `a ** b` | `pow(a, b)` |
| 矩阵乘法 | `a @ b` | `matmul(a, b)` |

### 比较运算符

```python
import operator

## 比较运算符函数
print(operator.lt(3, 5))    # 小于: True
print(operator.le(3, 5))    # 小于等于: True
print(operator.eq(3, 3))    # 等于: True
print(operator.ne(3, 5))    # 不等于: True
print(operator.gt(5, 3))    # 大于: True
print(operator.ge(5, 3))    # 大于等于: True
```

### 逻辑运算符

```python
import operator

## 逻辑运算
print(operator.and_(True, False))   # 逻辑与: False
print(operator.or_(True, False))    # 逻辑或: True
print(operator.not_(True))          # 逻辑非: False
print(operator.xor(True, False))    # 异或: True

## 按位运算
print(operator.and_(5, 3))          # 按位与: 1
print(operator.or_(5, 3))           # 按位或: 7
print(operator.xor(5, 3))           # 按位异或: 6
print(operator.invert(5))           # 按位取反: -6
```

### 序列操作

```python
import operator

## 序列操作
data = [1, 2, 3, 4, 5]
print(operator.getitem(data, 2))        # 获取索引: 3
print(operator.contains(data, 3))       # 成员测试: True
print(operator.countOf(data, 2))        # 计数: 1
print(operator.indexOf(data, 4))        # 查找索引: 3

## 序列连接
list1 = [1, 2]
list2 = [3, 4]
print(operator.concat(list1, list2))    # 连接: [1, 2, 3, 4]
```

### attrgetter 类

attrgetter 用于获取对象的属性，特别适用于排序操作。

```python
from operator import attrgetter

class Student:
    def __init__(self, name, age, score):
        self.name = name
        self.age = age
        self.score = score
    
    def __repr__(self):
        return f'Student(name={self.name!r}, age={self.age}, score={self.score})'

## 创建学生列表
students = [
    Student("Alice", 20, 85),
    Student("Bob", 19, 92),
    Student("Charlie", 21, 78),
    Student("Diana", 20, 95)
]

## 按年龄排序
students_by_age = sorted(students, key=attrgetter('age'))
print("按年龄排序:", students_by_age)

## 按分数排序(降序)
students_by_score = sorted(students, key=attrgetter('score'), reverse=True)
print("按分数排序:", students_by_score)

## 多属性排序(先按年龄,再按分数)
students_multi = sorted(students, key=attrgetter('age', 'score'))
print("多属性排序:", students_multi)
```

### itemgetter 类

itemgetter 用于获取对象的项，支持索引、键和切片操作。

#### 基本用法

```python
from operator import itemgetter

## 处理元组列表
data = [
    ("Alice", 25, 85),
    ("Bob", 23, 92),
    ("Charlie", 27, 78),
    ("Diana", 24, 95)
]

## 按年龄(索引 1)排序
sorted_by_age = sorted(data, key=itemgetter(1))
print("按年龄排序:", sorted_by_age)

## 按分数(索引 2)排序
sorted_by_score = sorted(data, key=itemgetter(2), reverse=True)
print("按分数排序:", sorted_by_score)
```

#### 多项获取

```python
from operator import itemgetter

## 获取多个项
get_multiple = itemgetter(1, 3, 5)
result = get_multiple('ABCDEFG')
print(result)  # 输出: ('B', 'D', 'F')

## 使用切片
get_slice = itemgetter(slice(2, None))
result = get_slice('ABCDEFG')
print(result)  # 输出: 'CDEFG'

## 处理字典列表
inventory = [
    {'name': 'apple', 'count': 3, 'price': 1.2},
    {'name': 'banana', 'count': 2, 'price': 0.8},
    {'name': 'orange', 'count': 5, 'price': 1.5}
]

## 按数量排序
sorted_by_count = sorted(inventory, key=itemgetter('count'))
print("按数量排序:", sorted_by_count)
```

### methodcaller 类

methodcaller 用于调用对象的方法，支持传递参数。

```python
from operator import methodcaller
import math

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __repr__(self):
        return f'Point({self.x}, {self.y})'
    
    def distance(self, x, y):
        """计算到指定点的距离"""
        return math.hypot(self.x - x, self.y - y)
    
    def move(self, dx, dy):
        """移动点的位置"""
        self.x += dx
        self.y += dy
        return self

## 创建点列表
points = [
    Point(3, 4),
    Point(1, 2),
    Point(5, 0),
    Point(2, 3)
]

## 按到原点的距离排序
sorted_points = sorted(points, key=methodcaller('distance', 0, 0))
print("按距离排序:", sorted_points)

## 批量调用方法
move_right = methodcaller('move', 1, 0)
for point in points:
    move_right(point)
print("移动后:", points)
```

## 💡 实际应用

### 基础用法

```python
from operator import itemgetter, attrgetter

## 数据处理示例
def process_sales_data():
    """处理销售数据"""
    sales_data = [
        {'product': 'iPhone', 'quantity': 100, 'price': 999},
        {'product': 'iPad', 'quantity': 50, 'price': 599},
        {'product': 'MacBook', 'quantity': 30, 'price': 1299},
        {'product': 'AirPods', 'quantity': 200, 'price': 179}
    ]
    
#    # 按价格排序
    by_price = sorted(sales_data, key=itemgetter('price'), reverse=True)
    print("按价格排序:", by_price)
    
#    # 按数量排序
    by_quantity = sorted(sales_data, key=itemgetter('quantity'))
    print("按数量排序:", by_quantity)
    
#    # 计算总收入并排序
    for item in sales_data:
        item['revenue'] = item['quantity'] * item['price']
    
    by_revenue = sorted(sales_data, key=itemgetter('revenue'), reverse=True)
    print("按收入排序:", by_revenue)

process_sales_data()
```

### 高级用法

```python
from operator import itemgetter, attrgetter, methodcaller
from collections import namedtuple

## 使用 namedtuple 和 operator 的组合
Employee = namedtuple('Employee', ['name', 'department', 'salary', 'years'])

employees = [
    Employee('Alice', 'Engineering', 95000, 5),
    Employee('Bob', 'Marketing', 75000, 3),
    Employee('Charlie', 'Engineering', 105000, 8),
    Employee('Diana', 'Sales', 85000, 4)
]

class EmployeeAnalyzer:
    """员工数据分析器"""
    
    def __init__(self, employees):
        self.employees = employees
    
    def sort_by_salary(self, reverse=True):
        """按薪资排序"""
        return sorted(self.employees, key=attrgetter('salary'), reverse=reverse)
    
    def sort_by_department_and_salary(self):
        """按部门和薪资排序"""
        return sorted(self.employees, key=attrgetter('department', 'salary'))
    
    def get_top_earners(self, n=3):
        """获取收入最高的 N 个员工"""
        return self.sort_by_salary()[:n]
    
    def group_by_department(self):
        """按部门分组"""
        from itertools import groupby
        sorted_emp = sorted(self.employees, key=attrgetter('department'))
        return {dept: list(group) for dept, group in groupby(sorted_emp, key=attrgetter('department'))}

## 使用示例
analyzer = EmployeeAnalyzer(employees)
print("薪资排序:", analyzer.sort_by_salary())
print("部门分组:", analyzer.group_by_department())
```

### 实际案例

```python
from operator import itemgetter, attrgetter, methodcaller
import time

class LogEntry:
    """日志条目类"""
    
    def __init__(self, timestamp, level, message, module):
        self.timestamp = timestamp
        self.level = level
        self.message = message
        self.module = module
    
    def __repr__(self):
        return f'LogEntry({self.timestamp}, {self.level}, {self.module})'
    
    def format_message(self, format_type='simple'):
        """格式化消息"""
        if format_type == 'simple':
            return f"[{self.level}] {self.message}"
        elif format_type == 'detailed':
            return f"[{time.ctime(self.timestamp)}] [{self.level}] {self.module}: {self.message}"
        return self.message

class LogAnalyzer:
    """日志分析器"""
    
    def __init__(self):
        self.logs = []
    
    def add_log(self, timestamp, level, message, module):
        """添加日志条目"""
        self.logs.append(LogEntry(timestamp, level, message, module))
    
    def sort_by_time(self, reverse=False):
        """按时间排序"""
        return sorted(self.logs, key=attrgetter('timestamp'), reverse=reverse)
    
    def sort_by_level(self):
        """按日志级别排序"""
        level_priority = {'DEBUG': 0, 'INFO': 1, 'WARNING': 2, 'ERROR': 3, 'CRITICAL': 4}
        return sorted(self.logs, key=lambda log: level_priority.get(log.level, 0))
    
    def filter_by_level(self, level):
        """按级别过滤"""
        return [log for log in self.logs if log.level == level]
    
    def format_all(self, format_type='simple'):
        """格式化所有日志"""
        formatter = methodcaller('format_message', format_type)
        return [formatter(log) for log in self.logs]

## 使用示例
analyzer = LogAnalyzer()
analyzer.add_log(time.time() - 3600, 'ERROR', 'Database connection failed', 'db')
analyzer.add_log(time.time() - 1800, 'INFO', 'User logged in', 'auth')
analyzer.add_log(time.time() - 900, 'WARNING', 'High memory usage', 'system')
analyzer.add_log(time.time(), 'DEBUG', 'Processing request', 'api')

print("按时间排序:", analyzer.sort_by_time())
print("按级别排序:", analyzer.sort_by_level())
print("格式化输出:", analyzer.format_all('detailed'))
```

## ⚠️ 注意事项

- **性能优势**: operator 函数通常比 lambda 表达式更快，特别是在大数据集上
- **可读性**: 对于简单操作，operator 函数可能比 lambda 更清晰
- **内存效率**: operator 函数是 C 实现的，内存占用更少
- **多属性排序**: attrgetter 和 itemgetter 支持多属性排序
- **错误处理**: 使用时要注意属性或键是否存在

```python
## 性能比较示例
import time
from operator import itemgetter

data = [(i, i*2) for i in range(100000)]

## 使用 lambda
start = time.time()
sorted_lambda = sorted(data, key=lambda x: x[1])
lambda_time = time.time() - start

## 使用 itemgetter
start = time.time()
sorted_itemgetter = sorted(data, key=itemgetter(1))
itemgetter_time = time.time() - start

print(f"Lambda 时间: {lambda_time:.4f}秒")
print(f"itemgetter 时间: {itemgetter_time:.4f}秒")
print(f"性能提升: {lambda_time/itemgetter_time:.2f}倍")
```

## 🔗 相关内容

- [functools 模块](functools/) - 函数式编程工具
- [itertools 模块](itertools/) - 迭代器工具
- [collections 模块](collections/) - 专用容器数据类型
- [排序算法](../basics/sorting/) - 排序的基础知识

## 📚 扩展阅读

- [Python operator 模块官方文档](https://docs.python.org/3/library/operator.html)
- [函数式编程指南](https://docs.python.org/3/howto/functional.html)
- [Python 性能优化技巧](https://wiki.python.org/moin/PythonSpeed/PerformanceTips)

## 🏷️ 标签

`operator` `运算符` `函数式编程` `标准库` `性能优化` `排序` `数据处理`

---

**最后更新**: 2024-01-01  
**作者**: Python 文档团队  
**版本**: 1.0