---
layout: doc
title: filter() - 过滤函数
permalink: /docs/builtins/filter/
category: builtins
tags: [过滤, 函数式编程, 条件筛选]
description: 根据条件过滤可迭代对象中的元素
author: Python文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: 中级
---

# filter() - 过滤函数

## 📝 概述

`filter()` 是Python中的内置函数，用于根据指定的条件函数过滤可迭代对象中的元素。它返回一个迭代器，只包含使条件函数返回True的元素。filter()是函数式编程的重要工具，可以简化数据筛选操作。<mcreference link="https://docs.python.org/3/library/functions.html" index="1">1</mcreference>

## 🎯 学习目标

- 掌握filter()函数的基本用法
- 理解filter()与条件判断的关系
- 学会使用filter()进行数据筛选
- 了解filter()在数据处理中的应用

## 📋 前置知识

- Python基本语法
- 函数的定义和调用
- 布尔值和条件判断
- lambda表达式的基本使用

## 🔍 详细内容

### 基本概念

`filter()` 函数接受一个函数和一个可迭代对象作为参数。函数应该返回布尔值，filter()会保留使函数返回True的元素，过滤掉返回False的元素。

### 语法格式

```python
filter(function, iterable)
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| function | callable/None | 是 | 无 | 用于测试的函数，返回布尔值 |
| iterable | iterable | 是 | 无 | 要过滤的可迭代对象 |

### 返回值

| 类型 | 说明 |
|------|------|
| filter | 迭代器，包含通过测试的元素 |

## 💡 实际应用

### 基础用法

```python
# 过滤偶数
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_numbers = filter(lambda x: x % 2 == 0, numbers)
print(list(even_numbers))  # [2, 4, 6, 8, 10]

# 过滤正数
numbers = [-3, -2, -1, 0, 1, 2, 3]
positive_numbers = filter(lambda x: x > 0, numbers)
print(list(positive_numbers))  # [1, 2, 3]

# 过滤非空字符串
strings = ['hello', '', 'world', ' ', 'python', '']
non_empty = filter(lambda s: s.strip(), strings)
print(list(non_empty))  # ['hello', 'world', 'python']

# 使用None作为函数（过滤假值）
values = [0, 1, False, True, '', 'hello', [], [1, 2], None]
truthy_values = filter(None, values)
print(list(truthy_values))  # [1, True, 'hello', [1, 2]]

# 自定义过滤函数
def is_long_word(word):
    return len(word) > 5

words = ['cat', 'elephant', 'dog', 'butterfly', 'ant']
long_words = filter(is_long_word, words)
print(list(long_words))  # ['elephant', 'butterfly']
```

### 高级用法

```python
# 复杂数据结构的过滤
students = [
    {'name': '张三', 'age': 20, 'score': 85},
    {'name': '李四', 'age': 22, 'score': 92},
    {'name': '王五', 'age': 19, 'score': 78},
    {'name': '赵六', 'age': 21, 'score': 95}
]

# 过滤成绩优秀的学生
excellent_students = filter(lambda s: s['score'] >= 90, students)
for student in excellent_students:
    print(f"{student['name']}: {student['score']}分")

# 过滤成年学生
adult_students = filter(lambda s: s['age'] >= 20, students)
print([s['name'] for s in adult_students])  # ['张三', '李四', '赵六']

# 多条件过滤
young_excellent = filter(
    lambda s: s['age'] < 21 and s['score'] >= 85, 
    students
)
print([s['name'] for s in young_excellent])  # ['张三']

# 字符串过滤
emails = [
    'user@example.com',
    'invalid-email',
    'test@domain.org',
    'another@test.com',
    'bad.email'
]

# 过滤有效邮箱
valid_emails = filter(
    lambda email: '@' in email and '.' in email.split('@')[1],
    emails
)
print(list(valid_emails))
# ['user@example.com', 'test@domain.org', 'another@test.com']

# 数字范围过滤
import random
random_numbers = [random.randint(1, 100) for _ in range(20)]
# 过滤50-80之间的数字
filtered_numbers = filter(lambda x: 50 <= x <= 80, random_numbers)
print(f"原数据: {random_numbers}")
print(f"过滤后: {list(filtered_numbers)}")
```

### 实际案例

```python
# 日志分析
def analyze_logs(log_lines):
    """分析日志文件"""
    # 过滤错误日志
    error_logs = filter(lambda line: 'ERROR' in line, log_lines)
    
    # 过滤警告日志
    warning_logs = filter(lambda line: 'WARNING' in line, log_lines)
    
    # 过滤今天的日志
    from datetime import datetime
    today = datetime.now().strftime('%Y-%m-%d')
    today_logs = filter(lambda line: today in line, log_lines)
    
    return {
        'errors': list(error_logs),
        'warnings': list(warning_logs),
        'today': list(today_logs)
    }

# 示例日志
logs = [
    '2024-01-15 10:30:00 INFO 系统启动',
    '2024-01-15 10:31:00 ERROR 数据库连接失败',
    '2024-01-15 10:32:00 WARNING 内存使用率过高',
    '2024-01-14 09:00:00 INFO 用户登录',
    '2024-01-15 11:00:00 ERROR 文件读取失败'
]

analysis = analyze_logs(logs)
print(f"错误日志数量: {len(analysis['errors'])}")
print(f"警告日志数量: {len(analysis['warnings'])}")

# 文件处理
def process_files(file_list):
    """处理文件列表"""
    # 过滤Python文件
    python_files = filter(lambda f: f.endswith('.py'), file_list)
    
    # 过滤大文件（假设有size属性）
    # large_files = filter(lambda f: f.size > 1024*1024, file_list)
    
    # 过滤隐藏文件
    visible_files = filter(lambda f: not f.startswith('.'), file_list)
    
    return {
        'python_files': list(python_files),
        'visible_files': list(visible_files)
    }

files = ['main.py', 'config.json', '.gitignore', 'utils.py', 'README.md']
result = process_files(files)
print(f"Python文件: {result['python_files']}")
print(f"可见文件: {result['visible_files']}")

# 数据清洗
def clean_survey_data(responses):
    """清洗调查数据"""
    # 过滤有效年龄
    valid_age = filter(lambda r: 0 < r.get('age', 0) < 120, responses)
    
    # 过滤完整回答
    complete_responses = filter(
        lambda r: all(key in r for key in ['name', 'age', 'email']),
        valid_age
    )
    
    # 过滤有效邮箱
    valid_email = filter(
        lambda r: '@' in r.get('email', ''),
        complete_responses
    )
    
    return list(valid_email)

# 示例调查数据
survey_data = [
    {'name': '张三', 'age': 25, 'email': 'zhang@example.com'},
    {'name': '李四', 'age': 150, 'email': 'li@example.com'},  # 无效年龄
    {'name': '王五', 'email': 'wang@example.com'},  # 缺少年龄
    {'name': '赵六', 'age': 30, 'email': 'invalid-email'},  # 无效邮箱
    {'name': '钱七', 'age': 28, 'email': 'qian@example.com'}
]

clean_data = clean_survey_data(survey_data)
print(f"清洗后的数据: {len(clean_data)} 条")
for data in clean_data:
    print(f"  {data['name']}, {data['age']}岁, {data['email']}")

# 商品筛选
def filter_products(products, **criteria):
    """根据条件筛选商品"""
    result = products
    
    # 价格范围筛选
    if 'min_price' in criteria:
        result = filter(lambda p: p['price'] >= criteria['min_price'], result)
    
    if 'max_price' in criteria:
        result = filter(lambda p: p['price'] <= criteria['max_price'], result)
    
    # 分类筛选
    if 'category' in criteria:
        result = filter(lambda p: p['category'] == criteria['category'], result)
    
    # 评分筛选
    if 'min_rating' in criteria:
        result = filter(lambda p: p['rating'] >= criteria['min_rating'], result)
    
    # 库存筛选
    if 'in_stock' in criteria and criteria['in_stock']:
        result = filter(lambda p: p['stock'] > 0, result)
    
    return list(result)

# 示例商品数据
products = [
    {'name': '笔记本电脑', 'price': 5999, 'category': '电子产品', 'rating': 4.5, 'stock': 10},
    {'name': '手机', 'price': 3999, 'category': '电子产品', 'rating': 4.2, 'stock': 0},
    {'name': '书籍', 'price': 29, 'category': '图书', 'rating': 4.8, 'stock': 50},
    {'name': '耳机', 'price': 299, 'category': '电子产品', 'rating': 4.0, 'stock': 20}
]

# 筛选条件：电子产品，价格1000-6000，评分4.0以上，有库存
filtered = filter_products(
    products,
    category='电子产品',
    min_price=1000,
    max_price=6000,
    min_rating=4.0,
    in_stock=True
)

print("筛选结果:")
for product in filtered:
    print(f"  {product['name']}: ¥{product['price']}, 评分{product['rating']}")
```

## ⚠️ 注意事项

- `filter()` 返回的是迭代器，只能遍历一次
- 当function为None时，filter()会过滤掉所有假值
- filter()是惰性求值的，只在需要时才计算结果
- 对于简单条件，列表推导式可能更直观

```python
# 迭代器特性
numbers = [1, 2, 3, 4, 5, 6]
filter_obj = filter(lambda x: x % 2 == 0, numbers)

# 第一次使用
print(list(filter_obj))  # [2, 4, 6]
# 第二次使用（空结果）
print(list(filter_obj))  # []

# None作为函数的特殊行为
values = [0, 1, 2, '', 'hello', [], [1], None, False, True]
filtered = filter(None, values)
print(list(filtered))  # [1, 2, 'hello', [1], True]

# filter() vs 列表推导式
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 使用filter()
even_filter = filter(lambda x: x % 2 == 0, numbers)
print(list(even_filter))

# 使用列表推导式（通常更直观）
even_list = [x for x in numbers if x % 2 == 0]
print(even_list)

# 复杂条件时，filter()可能更清晰
def is_prime(n):
    """判断是否为质数"""
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

# 使用filter()更清晰
primes = filter(is_prime, range(2, 50))
print(list(primes))
```

## 🔗 相关内容

- [map() - 映射函数](../map.md)
- [any() - 任意函数](../any.md)
- [all() - 全部函数](../all.md)

## 📚 扩展阅读

- [Python官方文档 - filter()](https://docs.python.org/3/library/functions.html#filter)
- [Python函数式编程](https://docs.python.org/3/howto/functional.html)
- [列表推导式详解](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions)

## 🏷️ 标签

`过滤` `函数式编程` `条件筛选` `数据清洗` `布尔判断`

---

**最后更新**: 2024-01-15  
**作者**: Python文档工程师  
**版本**: 1.0