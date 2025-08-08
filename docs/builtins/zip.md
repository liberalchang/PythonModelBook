---
layout: doc
title: zip() - 打包函数
permalink: /docs/builtins/zip/
category: builtins
tags: [迭代, 打包, 并行]
description: 将多个可迭代对象打包成元组的迭代器
author: Python文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: 初级
---

# zip() - 打包函数

## 📝 概述

`zip()` 是Python中的内置函数，用于将多个可迭代对象的对应元素打包成元组。它返回一个迭代器，可以同时遍历多个序列，在数据处理和并行迭代中非常有用。<mcreference link="https://docs.python.org/3/library/functions.html" index="1">1</mcreference>

## 🎯 学习目标

- 掌握zip()函数的基本用法
- 理解zip()的行为特点和限制
- 学会使用zip()进行数据组合和转换
- 了解zip()在实际编程中的应用场景

## 📋 前置知识

- Python基本语法
- 可迭代对象的概念
- 元组和列表的基本操作
- for循环和元组解包

## 🔍 详细内容

### 基本概念

`zip()` 函数接受多个可迭代对象作为参数，返回一个迭代器。该迭代器生成元组，每个元组包含来自各个可迭代对象的对应位置的元素。当最短的可迭代对象耗尽时，迭代停止。

### 语法格式

```python
zip(*iterables)
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| *iterables | iterable | 否 | 无 | 零个或多个可迭代对象 |

### 返回值

| 类型 | 说明 |
|------|------|
| zip | 迭代器，产生元组序列 |

## 💡 实际应用

### 基础用法

```python
# 基本打包
names = ["张三", "李四", "王五"]
ages = [25, 30, 35]
for name, age in zip(names, ages):
    print(f"{name}今年{age}岁")
# 输出:
# 张三今年25岁
# 李四今年30岁
# 王五今年35岁

# 转换为列表查看结果
print(list(zip(names, ages)))  # [('张三', 25), ('李四', 30), ('王五', 35)]

# 三个列表的组合
names = ["张三", "李四", "王五"]
ages = [25, 30, 35]
cities = ["北京", "上海", "广州"]
for name, age, city in zip(names, ages, cities):
    print(f"{name}，{age}岁，来自{city}")

# 空参数调用
print(list(zip()))  # []

# 单个参数
numbers = [1, 2, 3]
print(list(zip(numbers)))  # [(1,), (2,), (3,)]
```

### 高级用法

```python
# 长度不同的序列
list1 = [1, 2, 3, 4, 5]
list2 = ['a', 'b', 'c']
print(list(zip(list1, list2)))  # [(1, 'a'), (2, 'b'), (3, 'c')]
# 注意：较长的序列中的额外元素被忽略

# 字符串的zip
word1 = "hello"
word2 = "world"
for char1, char2 in zip(word1, word2):
    print(f"{char1}-{char2}")
# 输出: h-w, e-o, l-r, l-l, o-d

# 解包操作（转置）
matrix = [(1, 2, 3), (4, 5, 6), (7, 8, 9)]
print(list(zip(*matrix)))  # [(1, 4, 7), (2, 5, 8), (3, 6, 9)]

# 创建字典
keys = ['name', 'age', 'city']
values = ['张三', 25, '北京']
person = dict(zip(keys, values))
print(person)  # {'name': '张三', 'age': 25, 'city': '北京'}

# 并行处理多个列表
numbers1 = [1, 2, 3, 4]
numbers2 = [10, 20, 30, 40]
sums = [x + y for x, y in zip(numbers1, numbers2)]
print(sums)  # [11, 22, 33, 44]
```

### 实际案例

```python
# 数据表格处理
def create_table(headers, *rows):
    """创建简单的数据表格"""
    # 打印表头
    print("|", end="")
    for header in headers:
        print(f" {header:^10} |", end="")
    print()
    
    # 打印分隔线
    print("|" + "-" * (12 * len(headers) + 1) + "|")
    
    # 打印数据行
    for row in rows:
        print("|", end="")
        for item in row:
            print(f" {str(item):^10} |", end="")
        print()

# 使用示例
headers = ["姓名", "年龄", "城市"]
row1 = ["张三", 25, "北京"]
row2 = ["李四", 30, "上海"]
row3 = ["王五", 35, "广州"]
create_table(headers, row1, row2, row3)

# 数据统计分析
def analyze_scores(subjects, scores):
    """分析各科成绩"""
    print("成绩分析报告:")
    print("-" * 30)
    
    total_score = 0
    for subject, score in zip(subjects, scores):
        print(f"{subject}: {score}分")
        total_score += score
    
    average = total_score / len(scores)
    print("-" * 30)
    print(f"总分: {total_score}分")
    print(f"平均分: {average:.2f}分")
    
    return total_score, average

# 使用示例
subjects = ["语文", "数学", "英语", "物理", "化学"]
scores = [85, 92, 78, 88, 90]
analyze_scores(subjects, scores)

# 文件对比
def compare_files(file1_lines, file2_lines):
    """逐行对比两个文件"""
    differences = []
    for line_num, (line1, line2) in enumerate(zip(file1_lines, file2_lines), 1):
        if line1.strip() != line2.strip():
            differences.append({
                'line': line_num,
                'file1': line1.strip(),
                'file2': line2.strip()
            })
    
    if differences:
        print(f"发现 {len(differences)} 处差异:")
        for diff in differences:
            print(f"第{diff['line']}行:")
            print(f"  文件1: {diff['file1']}")
            print(f"  文件2: {diff['file2']}")
    else:
        print("两个文件内容相同")
    
    return differences

# 坐标变换
def transform_coordinates(x_coords, y_coords, dx=0, dy=0):
    """坐标平移变换"""
    transformed = []
    for x, y in zip(x_coords, y_coords):
        new_x = x + dx
        new_y = y + dy
        transformed.append((new_x, new_y))
    return transformed

# 使用示例
original_x = [1, 2, 3, 4]
original_y = [1, 4, 9, 16]
transformed_coords = transform_coordinates(original_x, original_y, dx=10, dy=5)
print(f"原坐标: {list(zip(original_x, original_y))}")
print(f"变换后: {transformed_coords}")

# 数据验证
def validate_user_data(names, emails, ages):
    """验证用户数据"""
    errors = []
    
    for i, (name, email, age) in enumerate(zip(names, emails, ages)):
        # 验证姓名
        if not name or len(name.strip()) == 0:
            errors.append(f"第{i+1}行: 姓名不能为空")
        
        # 验证邮箱
        if '@' not in email:
            errors.append(f"第{i+1}行: 邮箱格式不正确")
        
        # 验证年龄
        if not isinstance(age, int) or age < 0 or age > 150:
            errors.append(f"第{i+1}行: 年龄必须是0-150之间的整数")
    
    if errors:
        print("数据验证失败:")
        for error in errors:
            print(f"  - {error}")
        return False
    else:
        print("数据验证通过")
        return True

# 测试数据
test_names = ["张三", "", "王五"]
test_emails = ["zhangsan@email.com", "lisi.email.com", "wangwu@email.com"]
test_ages = [25, 30, 200]
validate_user_data(test_names, test_emails, test_ages)
```

## ⚠️ 注意事项

- `zip()` 以最短的可迭代对象为准，较长对象的多余元素会被忽略
- `zip()` 返回的是迭代器，只能遍历一次
- 如果需要处理不同长度的序列，考虑使用 `itertools.zip_longest()`
- 空的zip()调用返回空迭代器

```python
# 长度不同的处理
from itertools import zip_longest

list1 = [1, 2, 3, 4, 5]
list2 = ['a', 'b', 'c']

# 标准zip()会截断
print(list(zip(list1, list2)))  # [(1, 'a'), (2, 'b'), (3, 'c')]

# zip_longest()会填充缺失值
print(list(zip_longest(list1, list2, fillvalue='X')))
# [(1, 'a'), (2, 'b'), (3, 'c'), (4, 'X'), (5, 'X')]

# 迭代器特性
data1 = [1, 2, 3]
data2 = ['a', 'b', 'c']
zip_obj = zip(data1, data2)

# 第一次遍历
print("第一次:", list(zip_obj))  # [(1, 'a'), (2, 'b'), (3, 'c')]
# 第二次遍历（空结果）
print("第二次:", list(zip_obj))  # []
```

## 🔗 相关内容

- [enumerate() - 枚举函数](../enumerate.md)
- [map() - 映射函数](../map.md)
- [itertools模块 - 迭代工具](../../stdlib/itertools.md)

## 📚 扩展阅读

- [Python官方文档 - zip()](https://docs.python.org/3/library/functions.html#zip)
- [itertools.zip_longest()](https://docs.python.org/3/library/itertools.html#itertools.zip_longest)
- [Python循环技巧](https://docs.python.org/3/tutorial/datastructures.html#looping-techniques)

## 🏷️ 标签

`迭代` `打包` `并行` `数据组合` `转置`

---

**最后更新**: 2024-01-15  
**作者**: Python文档工程师  
**版本**: 1.0