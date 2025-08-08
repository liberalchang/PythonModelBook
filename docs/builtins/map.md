---
layout: doc
title: map() - 映射函数
permalink: /docs/builtins/map/
category: builtins
tags: [映射, 函数式编程, 迭代]
description: 将函数应用到可迭代对象的每个元素
author: Python文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: 中级
---

# map() - 映射函数

## 📝 概述

`map()` 是Python中的内置函数，用于将指定函数应用到可迭代对象的每个元素上。它返回一个迭代器，产生函数调用的结果。map()是函数式编程的重要工具，可以简化对序列的批量处理操作。<mcreference link="https://docs.python.org/3/library/functions.html" index="1">1</mcreference>

## 🎯 学习目标

- 掌握map()函数的基本用法
- 理解map()与循环的区别和优势
- 学会使用map()进行数据转换
- 了解map()在函数式编程中的应用

## 📋 前置知识

- Python基本语法
- 函数的定义和调用
- 可迭代对象的概念
- lambda表达式的基本使用

## 🔍 详细内容

### 基本概念

`map()` 函数接受一个函数和一个或多个可迭代对象作为参数，将函数应用到每个可迭代对象的对应元素上，返回一个map对象（迭代器）。

### 语法格式

```python
map(function, iterable, ...)
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| function | callable | 是 | 无 | 要应用的函数 |
| iterable | iterable | 是 | 无 | 一个或多个可迭代对象 |

### 返回值

| 类型 | 说明 |
|------|------|
| map | 迭代器，产生函数应用结果 |

## 💡 实际应用

### 基础用法

```python
# 基本映射操作
numbers = [1, 2, 3, 4, 5]
squared = map(lambda x: x**2, numbers)
print(list(squared))  # [1, 4, 9, 16, 25]

# 使用内置函数
strings = ['1', '2', '3', '4', '5']
integers = map(int, strings)
print(list(integers))  # [1, 2, 3, 4, 5]

# 字符串操作
words = ['hello', 'world', 'python']
uppercase = map(str.upper, words)
print(list(uppercase))  # ['HELLO', 'WORLD', 'PYTHON']

# 自定义函数
def double(x):
    return x * 2

numbers = [1, 2, 3, 4]
doubled = map(double, numbers)
print(list(doubled))  # [2, 4, 6, 8]

# 多个可迭代对象
numbers1 = [1, 2, 3, 4]
numbers2 = [10, 20, 30, 40]
sums = map(lambda x, y: x + y, numbers1, numbers2)
print(list(sums))  # [11, 22, 33, 44]
```

### 高级用法

```python
# 复杂数据结构的处理
students = [
    {'name': '张三', 'score': 85},
    {'name': '李四', 'score': 92},
    {'name': '王五', 'score': 78}
]

# 提取姓名
names = map(lambda student: student['name'], students)
print(list(names))  # ['张三', '李四', '王五']

# 计算等级
def get_grade(score):
    if score >= 90:
        return 'A'
    elif score >= 80:
        return 'B'
    elif score >= 70:
        return 'C'
    else:
        return 'D'

scores = [85, 92, 78, 95, 67]
grades = map(get_grade, scores)
print(list(grades))  # ['B', 'A', 'C', 'A', 'D']

# 嵌套列表处理
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
# 计算每行的和
row_sums = map(sum, matrix)
print(list(row_sums))  # [6, 15, 24]

# 字符串格式化
data = [('张三', 25), ('李四', 30), ('王五', 35)]
formatted = map(lambda item: f"{item[0]}今年{item[1]}岁", data)
print(list(formatted))
# ['张三今年25岁', '李四今年30岁', '王五今年35岁']

# 条件映射
numbers = [1, 2, 3, 4, 5, 6]
# 偶数乘以2，奇数乘以3
result = map(lambda x: x * 2 if x % 2 == 0 else x * 3, numbers)
print(list(result))  # [3, 4, 9, 8, 15, 12]
```

### 实际案例

```python
# 数据清洗和转换
def clean_phone_number(phone):
    """清理电话号码格式"""
    # 移除所有非数字字符
    cleaned = ''.join(filter(str.isdigit, phone))
    # 格式化为标准格式
    if len(cleaned) == 11:
        return f"{cleaned[:3]}-{cleaned[3:7]}-{cleaned[7:]}"
    return cleaned

raw_phones = ['138-1234-5678', '(139)2345-6789', '150 3456 7890']
cleaned_phones = map(clean_phone_number, raw_phones)
print(list(cleaned_phones))
# ['138-1234-5678', '139-2345-6789', '150-3456-7890']

# 文件处理
def process_log_line(line):
    """处理日志行"""
    parts = line.strip().split(' ')
    if len(parts) >= 3:
        timestamp = parts[0]
        level = parts[1]
        message = ' '.join(parts[2:])
        return {
            'timestamp': timestamp,
            'level': level,
            'message': message
        }
    return None

log_lines = [
    '2024-01-15 INFO 系统启动成功',
    '2024-01-15 ERROR 数据库连接失败',
    '2024-01-15 DEBUG 处理用户请求'
]

processed_logs = map(process_log_line, log_lines)
for log in processed_logs:
    if log:
        print(f"[{log['level']}] {log['message']}")

# 数学计算
import math

# 计算圆的面积
radii = [1, 2, 3, 4, 5]
areas = map(lambda r: math.pi * r**2, radii)
print([f"{area:.2f}" for area in areas])
# ['3.14', '12.57', '28.27', '50.27', '78.54']

# 温度转换
def celsius_to_fahrenheit(celsius):
    """摄氏度转华氏度"""
    return celsius * 9/5 + 32

celsius_temps = [0, 10, 20, 30, 40]
fahrenheit_temps = map(celsius_to_fahrenheit, celsius_temps)
print(list(fahrenheit_temps))  # [32.0, 50.0, 68.0, 86.0, 104.0]

# 数据验证
def validate_email(email):
    """简单的邮箱验证"""
    return '@' in email and '.' in email.split('@')[1]

emails = ['user@example.com', 'invalid-email', 'test@domain.org']
valid_flags = map(validate_email, emails)
for email, is_valid in zip(emails, valid_flags):
    status = "有效" if is_valid else "无效"
    print(f"{email}: {status}")

# 批量API调用模拟
def get_user_info(user_id):
    """模拟获取用户信息"""
    # 这里模拟API调用
    return {
        'id': user_id,
        'name': f'用户{user_id}',
        'status': 'active' if user_id % 2 == 0 else 'inactive'
    }

user_ids = [1, 2, 3, 4, 5]
user_infos = map(get_user_info, user_ids)
for info in user_infos:
    print(f"用户{info['id']}: {info['name']} ({info['status']})")
```

## ⚠️ 注意事项

- `map()` 返回的是迭代器，只能遍历一次
- 当有多个可迭代对象时，以最短的为准
- `map()` 是惰性求值的，只在需要时才计算结果
- 对于简单操作，列表推导式可能更直观

```python
# 迭代器特性
numbers = [1, 2, 3, 4]
map_obj = map(lambda x: x**2, numbers)

# 第一次使用
print(list(map_obj))  # [1, 4, 9, 16]
# 第二次使用（空结果）
print(list(map_obj))  # []

# 长度不同的可迭代对象
list1 = [1, 2, 3, 4, 5]
list2 = [10, 20, 30]
result = map(lambda x, y: x + y, list1, list2)
print(list(result))  # [11, 22, 33] (只处理3个元素)

# map() vs 列表推导式
numbers = [1, 2, 3, 4, 5]

# 使用map()
squared_map = map(lambda x: x**2, numbers)
print(list(squared_map))

# 使用列表推导式（通常更直观）
squared_list = [x**2 for x in numbers]
print(squared_list)

# 对于复杂操作，map()可能更清晰
def complex_transform(x):
    # 复杂的转换逻辑
    result = x**2 + 2*x + 1
    return result if result > 10 else 0

# 使用map()更清晰
transformed = map(complex_transform, numbers)
print(list(transformed))
```

## 🔗 相关内容

- [filter() - 过滤函数](../filter/)
- [reduce() - 归约函数](../reduce/)
- [zip() - 打包函数](../zip/)

## 📚 扩展阅读

- [Python官方文档 - map()](https://docs.python.org/3/library/functions.html#map)
- [Python函数式编程](https://docs.python.org/3/howto/functional.html)
- [列表推导式 vs map()](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions)

## 🏷️ 标签

`映射` `函数式编程` `迭代` `数据转换` `批量处理`

---

**最后更新**: 2024-01-15  
**作者**: Python文档工程师  
**版本**: 1.0