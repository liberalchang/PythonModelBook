---
layout: doc
title: sorted() - 排序函数
permalink: /docs/builtins/sorted/
category: builtins
tags: [排序, 序列, 迭代器]
description: 返回排序后的新列表，不修改原序列
author: Python文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: 中级
---

# sorted() - 排序函数

## 📝 概述

`sorted()` 是Python中的内置函数，用于对可迭代对象进行排序并返回一个新的排序列表。与列表的`sort()`方法不同，`sorted()`不会修改原始对象，而是返回一个新的排序列表。<mcreference link="https://docs.python.org/3/library/functions.html" index="1">1</mcreference>

## 🎯 学习目标

- 掌握sorted()函数的基本用法
- 理解key参数的使用方法
- 学会使用reverse参数控制排序方向
- 了解sorted()与list.sort()的区别
- 掌握复杂数据结构的排序技巧

## 📋 前置知识

- Python基本数据类型
- 列表和元组的使用
- 函数和lambda表达式
- 比较运算符的理解

## 🔍 详细内容

### 基本概念

`sorted()` 函数接受一个可迭代对象，返回一个包含所有元素的新排序列表。排序是稳定的，这意味着当多个记录具有相同的键时，它们的原始顺序会被保留。

### 语法格式

```python
sorted(iterable, *, key=None, reverse=False)
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| iterable | iterable | 是 | 无 | 要排序的可迭代对象 |
| key | function | 否 | None | 指定排序键的函数 |
| reverse | bool | 否 | False | 是否逆序排列 |

### 返回值

| 类型 | 说明 |
|------|------|
| list | 包含排序后元素的新列表 |

## 💡 实际应用

### 基础用法

```python
# 基本排序
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
print(sorted(numbers))  # [1, 1, 2, 3, 4, 5, 6, 9]
print(numbers)          # [3, 1, 4, 1, 5, 9, 2, 6] (原列表不变)

# 字符串排序
words = ['banana', 'apple', 'cherry', 'date']
print(sorted(words))    # ['apple', 'banana', 'cherry', 'date']

# 逆序排列
print(sorted(numbers, reverse=True))  # [9, 6, 5, 4, 3, 2, 1, 1]

# 对字符串进行排序
text = "python"
print(sorted(text))     # ['h', 'n', 'o', 'p', 't', 'y']

# 对元组排序
tuples = [(1, 'one'), (3, 'three'), (2, 'two')]
print(sorted(tuples))   # [(1, 'one'), (2, 'two'), (3, 'three')]

# 对集合排序
num_set = {3, 1, 4, 1, 5}
print(sorted(num_set))  # [1, 3, 4, 5]

# 对字典的键排序
data = {'c': 3, 'a': 1, 'b': 2}
print(sorted(data))           # ['a', 'b', 'c']
print(sorted(data.keys()))    # ['a', 'b', 'c']
print(sorted(data.values()))  # [1, 2, 3]
print(sorted(data.items()))   # [('a', 1), ('b', 2), ('c', 3)]
```

### 使用key参数

```python
# 按字符串长度排序
words = ['python', 'java', 'c', 'javascript', 'go']
print(sorted(words, key=len))  # ['c', 'go', 'java', 'python', 'javascript']

# 按绝对值排序
numbers = [-5, 2, -1, 3, -4]
print(sorted(numbers, key=abs))  # [-1, 2, 3, -4, -5]

# 忽略大小写排序
words = ['Apple', 'banana', 'Cherry', 'date']
print(sorted(words))                    # ['Apple', 'Cherry', 'banana', 'date']
print(sorted(words, key=str.lower))     # ['Apple', 'banana', 'Cherry', 'date']

# 按字符串的最后一个字符排序
words = ['hello', 'world', 'python', 'code']
print(sorted(words, key=lambda x: x[-1]))  # ['code', 'hello', 'world', 'python']

# 复杂对象排序
class Student:
    def __init__(self, name, age, grade):
        self.name = name
        self.age = age
        self.grade = grade
    
    def __repr__(self):
        return f"Student('{self.name}', {self.age}, {self.grade})"

students = [
    Student('Alice', 20, 85),
    Student('Bob', 19, 92),
    Student('Charlie', 21, 78),
    Student('Diana', 20, 95)
]

# 按年龄排序
print("按年龄排序:")
for student in sorted(students, key=lambda s: s.age):
    print(student)

# 按成绩排序（降序）
print("\n按成绩排序（降序）:")
for student in sorted(students, key=lambda s: s.grade, reverse=True):
    print(student)

# 按姓名排序
print("\n按姓名排序:")
for student in sorted(students, key=lambda s: s.name):
    print(student)

# 多级排序：先按年龄，再按成绩
print("\n多级排序（年龄升序，成绩降序）:")
for student in sorted(students, key=lambda s: (s.age, -s.grade)):
    print(student)
```

### 高级用法

```python
# 使用operator模块进行排序
from operator import itemgetter, attrgetter

# 按元组的第二个元素排序
data = [('Alice', 25), ('Bob', 20), ('Charlie', 30)]
print(sorted(data, key=itemgetter(1)))  # [('Bob', 20), ('Alice', 25), ('Charlie', 30)]

# 按字典的值排序
scores = {'Alice': 85, 'Bob': 92, 'Charlie': 78}
print(sorted(scores.items(), key=itemgetter(1)))  # [('Charlie', 78), ('Alice', 85), ('Bob', 92)]

# 按对象属性排序
print("使用attrgetter按成绩排序:")
for student in sorted(students, key=attrgetter('grade')):
    print(student)

# 多属性排序
print("\n多属性排序（年龄，然后姓名）:")
for student in sorted(students, key=attrgetter('age', 'name')):
    print(student)

# 自定义排序函数
def custom_sort_key(item):
    """自定义排序键函数"""
    if isinstance(item, str):
        return (0, item.lower())  # 字符串优先，按字母顺序
    elif isinstance(item, int):
        return (1, item)          # 数字其次，按数值大小
    else:
        return (2, str(item))     # 其他类型最后，转为字符串

mixed_data = ['banana', 42, 'apple', 17, 'cherry', 3]
print(sorted(mixed_data, key=custom_sort_key))
# ['apple', 'banana', 'cherry', 3, 17, 42]

# 稳定排序示例
data = [('Alice', 'A'), ('Bob', 'B'), ('Alice', 'C'), ('Bob', 'D')]
print("原始数据:", data)
print("按第一个元素排序（稳定）:", sorted(data, key=itemgetter(0)))
# [('Alice', 'A'), ('Alice', 'C'), ('Bob', 'B'), ('Bob', 'D')]

# 链式排序（多次排序）
data = [('Alice', 25, 85), ('Bob', 20, 92), ('Charlie', 25, 78), ('Diana', 20, 95)]
print("\n原始数据:", data)

# 先按成绩排序，再按年龄排序（保持成绩的相对顺序）
result = sorted(data, key=itemgetter(2))  # 先按成绩
result = sorted(result, key=itemgetter(1))  # 再按年龄（稳定排序）
print("链式排序结果:", result)
```

### 实际案例

```python
# 文件大小排序
import os
from pathlib import Path

def get_file_info(directory):
    """获取目录中文件信息"""
    files = []
    try:
        for file_path in Path(directory).iterdir():
            if file_path.is_file():
                size = file_path.stat().st_size
                files.append({
                    'name': file_path.name,
                    'size': size,
                    'path': str(file_path)
                })
    except Exception as e:
        print(f"读取目录失败: {e}")
    return files

# 模拟文件数据
files = [
    {'name': 'document.pdf', 'size': 1024000, 'path': '/docs/document.pdf'},
    {'name': 'image.jpg', 'size': 512000, 'path': '/images/image.jpg'},
    {'name': 'script.py', 'size': 2048, 'path': '/scripts/script.py'},
    {'name': 'data.csv', 'size': 256000, 'path': '/data/data.csv'}
]

print("按文件大小排序（从小到大）:")
for file in sorted(files, key=lambda f: f['size']):
    print(f"{file['name']}: {file['size']} bytes")

print("\n按文件名排序:")
for file in sorted(files, key=lambda f: f['name']):
    print(f"{file['name']}: {file['size']} bytes")

# 学生成绩分析
class GradeAnalyzer:
    def __init__(self, students):
        self.students = students
    
    def top_students(self, n=3):
        """获取前n名学生"""
        return sorted(self.students, key=lambda s: s.grade, reverse=True)[:n]
    
    def students_by_age_group(self):
        """按年龄分组并排序"""
        return sorted(self.students, key=lambda s: (s.age, -s.grade))
    
    def grade_distribution(self):
        """成绩分布分析"""
        grades = sorted([s.grade for s in self.students])
        return {
            'min': grades[0],
            'max': grades[-1],
            'median': grades[len(grades)//2],
            'sorted_grades': grades
        }

analyzer = GradeAnalyzer(students)

print("\n前3名学生:")
for student in analyzer.top_students(3):
    print(student)

print("\n按年龄分组（年龄升序，成绩降序）:")
for student in analyzer.students_by_age_group():
    print(student)

print("\n成绩分布:")
distribution = analyzer.grade_distribution()
for key, value in distribution.items():
    print(f"{key}: {value}")

# 数据处理管道
def process_sales_data(sales):
    """处理销售数据"""
    # 按销售额排序（降序）
    sorted_by_amount = sorted(sales, key=lambda x: x['amount'], reverse=True)
    
    # 按日期排序
    sorted_by_date = sorted(sales, key=lambda x: x['date'])
    
    # 按销售员和金额排序
    sorted_by_salesperson = sorted(sales, key=lambda x: (x['salesperson'], -x['amount']))
    
    return {
        'by_amount': sorted_by_amount,
        'by_date': sorted_by_date,
        'by_salesperson': sorted_by_salesperson
    }

# 模拟销售数据
sales_data = [
    {'date': '2024-01-15', 'salesperson': 'Alice', 'amount': 1500},
    {'date': '2024-01-10', 'salesperson': 'Bob', 'amount': 2000},
    {'date': '2024-01-12', 'salesperson': 'Alice', 'amount': 1200},
    {'date': '2024-01-08', 'salesperson': 'Charlie', 'amount': 1800},
    {'date': '2024-01-14', 'salesperson': 'Bob', 'amount': 2200}
]

processed = process_sales_data(sales_data)

print("\n按销售额排序（降序）:")
for sale in processed['by_amount'][:3]:  # 显示前3名
    print(f"{sale['date']}: {sale['salesperson']} - ${sale['amount']}")

print("\n按销售员分组排序:")
for sale in processed['by_salesperson']:
    print(f"{sale['salesperson']}: ${sale['amount']} ({sale['date']})")

# 文本分析
def analyze_text(text):
    """分析文本中的单词"""
    import re
    from collections import Counter
    
    # 提取单词
    words = re.findall(r'\b\w+\b', text.lower())
    word_count = Counter(words)
    
    # 按频率排序
    by_frequency = sorted(word_count.items(), key=lambda x: x[1], reverse=True)
    
    # 按字母顺序排序
    by_alphabet = sorted(word_count.items(), key=lambda x: x[0])
    
    # 按长度排序
    by_length = sorted(word_count.items(), key=lambda x: len(x[0]), reverse=True)
    
    return {
        'by_frequency': by_frequency,
        'by_alphabet': by_alphabet,
        'by_length': by_length
    }

sample_text = """
Python is a powerful programming language. Python is easy to learn and 
Python is widely used in data science, web development, and automation.
Programming with Python is fun and productive.
"""

analysis = analyze_text(sample_text)

print("\n词频分析（前5个）:")
for word, count in analysis['by_frequency'][:5]:
    print(f"{word}: {count}")

print("\n按长度排序（前5个）:")
for word, count in analysis['by_length'][:5]:
    print(f"{word} ({len(word)}字符): {count}")

# 配置文件排序
def sort_config_items(config):
    """排序配置项"""
    if isinstance(config, dict):
        # 按键名排序
        sorted_items = sorted(config.items())
        return dict(sorted_items)
    elif isinstance(config, list):
        # 如果是字典列表，按第一个键排序
        if config and isinstance(config[0], dict):
            first_key = list(config[0].keys())[0]
            return sorted(config, key=lambda x: x.get(first_key, ''))
        else:
            return sorted(config)
    return config

config_data = {
    'database': {
        'host': 'localhost',
        'port': 5432,
        'name': 'mydb'
    },
    'api': {
        'timeout': 30,
        'retries': 3,
        'base_url': 'https://api.example.com'
    },
    'logging': {
        'level': 'INFO',
        'file': 'app.log'
    }
}

print("\n排序后的配置:")
sorted_config = sort_config_items(config_data)
for section, settings in sorted_config.items():
    print(f"[{section}]")
    sorted_settings = sort_config_items(settings)
    for key, value in sorted_settings.items():
        print(f"  {key} = {value}")
    print()
```

## ⚠️ 注意事项

- `sorted()` 返回新列表，不修改原对象
- 排序是稳定的，相等元素保持原有顺序
- key函数应该返回可比较的值
- 对于复杂排序，考虑使用多次排序或元组键

```python
# sorted() vs list.sort() 对比
original = [3, 1, 4, 1, 5]

# sorted() 返回新列表
sorted_list = sorted(original)
print(f"原列表: {original}")        # [3, 1, 4, 1, 5]
print(f"排序结果: {sorted_list}")    # [1, 1, 3, 4, 5]

# list.sort() 修改原列表
original.sort()
print(f"sort()后: {original}")      # [1, 1, 3, 4, 5]

# 性能考虑
import time

large_list = list(range(10000, 0, -1))

# 测试sorted()
start = time.time()
result1 = sorted(large_list)
time1 = time.time() - start

# 测试list.sort()
large_list2 = large_list.copy()
start = time.time()
large_list2.sort()
time2 = time.time() - start

print(f"\nsorted()耗时: {time1:.4f}秒")
print(f"list.sort()耗时: {time2:.4f}秒")
print(f"list.sort()更快: {time1/time2:.2f}倍")

# 错误处理
try:
    # 不同类型无法比较
    mixed = [1, 'hello', 3.14]
    result = sorted(mixed)  # TypeError
except TypeError as e:
    print(f"\n排序错误: {e}")
    # 解决方案：使用key函数
    result = sorted(mixed, key=str)
    print(f"使用str作为key: {result}")

# 处理None值
data_with_none = [3, None, 1, None, 2]
try:
    result = sorted(data_with_none)  # TypeError
except TypeError as e:
    print(f"\nNone值排序错误: {e}")
    # 解决方案：将None放在最后
    result = sorted(data_with_none, key=lambda x: (x is None, x))
    print(f"处理None值: {result}")
```

## 🔗 相关内容

- [list.sort() - 列表排序方法](../list.md#sort)
- [min() - 最小值函数](../min.md)
- [max() - 最大值函数](../max.md)
- [reversed() - 反转函数](../reversed.md)

## 📚 扩展阅读

- [Python官方文档 - sorted()](https://docs.python.org/3/library/functions.html#sorted)
- [Python排序指南](https://docs.python.org/3/howto/sorting.html)
- [operator模块文档](https://docs.python.org/3/library/operator.html)

## 🏷️ 标签

`排序` `序列` `迭代器` `稳定排序` `key函数`

---

**最后更新**: 2024-01-15  
**作者**: Python文档工程师  
**版本**: 1.0