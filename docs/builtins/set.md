---
layout: doc
title: set() - 集合构造函数
permalink: /docs/builtins/set/
category: builtins
tags: [类型转换, 容器, 集合, 可变]
description: 创建集合对象或将可迭代对象转换为集合
author: Python文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: 初级
---

# set() - 集合构造函数

## 📝 概述

`set()` 是Python中的内置函数，用于创建集合对象或将其他可迭代对象转换为集合。集合是Python中的可变容器类型，存储唯一的、无序的元素，支持高效的成员测试、去重和集合运算操作，是数据处理中重要的数据结构。

## 🎯 学习目标

- 掌握set()函数的基本用法
- 理解集合的特性和应用场景
- 学会使用集合进行去重和集合运算
- 了解集合的性能特点和最佳实践

## 📋 前置知识

- Python基本数据类型
- 可迭代对象概念
- 哈希表基础
- 集合论基础概念

## 🔍 详细内容

### 基本概念

集合（set）是Python中的可变容器类型，存储唯一的、无序的可哈希元素。`set()` 函数提供了创建集合的标准方式，支持从各种可迭代对象构建集合，具有自动去重的特性。

### 语法格式

```python
# 创建空集合
set()

# 从可迭代对象创建
set(iterable)
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| iterable | iterable | 否 | 无 | 可迭代对象，如列表、元组、字符串等 |

### 返回值

- **类型**: set
- **说明**: 新创建的集合对象，包含可迭代对象中的唯一元素

## 💡 实际应用

### 基础用法

```python
# 创建空集合
empty_set = set()
print(f"空集合: {empty_set}")  # 输出: 空集合: set()
print(f"类型: {type(empty_set)}")  # 输出: 类型: <class 'set'>
print(f"长度: {len(empty_set)}")  # 输出: 长度: 0

# 注意：不能用{}创建空集合，{}创建的是空字典
empty_dict = {}
print(f"空字典类型: {type(empty_dict)}")  # 输出: 空字典类型: <class 'dict'>

# 从列表创建集合（自动去重）
list_with_duplicates = [1, 2, 3, 2, 4, 1, 5, 3]
set_from_list = set(list_with_duplicates)
print(f"原列表: {list_with_duplicates}")
print(f"转换后集合: {set_from_list}")  # 输出: 转换后集合: {1, 2, 3, 4, 5}

# 从字符串创建集合
string_set = set("hello world")
print(f"字符串集合: {string_set}")  # 输出: 字符串集合: {'h', 'e', 'l', 'o', ' ', 'w', 'r', 'd'}

# 从元组创建集合
tuple_set = set((1, 2, 3, 4, 5))
print(f"元组集合: {tuple_set}")  # 输出: 元组集合: {1, 2, 3, 4, 5}

# 从range创建集合
range_set = set(range(5))
print(f"range集合: {range_set}")  # 输出: range集合: {0, 1, 2, 3, 4}

# 从字典创建集合（只包含键）
dict_keys = {'a': 1, 'b': 2, 'c': 3}
keys_set = set(dict_keys)
print(f"字典键集合: {keys_set}")  # 输出: 字典键集合: {'a', 'b', 'c'}

# 从字典值创建集合
values_set = set(dict_keys.values())
print(f"字典值集合: {values_set}")  # 输出: 字典值集合: {1, 2, 3}

# 集合字面量语法
literal_set = {1, 2, 3, 4, 5}
print(f"字面量集合: {literal_set}")  # 输出: 字面量集合: {1, 2, 3, 4, 5}
print(f"与set()等价: {literal_set == set([1, 2, 3, 4, 5])}")  # 输出: 与set()等价: True

# 嵌套可迭代对象
nested_list = [[1, 2], [3, 4], [1, 2], [5, 6]]
# 注意：不能直接从嵌套列表创建集合，因为列表不可哈希
try:
    nested_set = set(nested_list)
except TypeError as e:
    print(f"嵌套列表错误: {e}")

# 正确方式：转换为元组
nested_tuples = [tuple(item) for item in nested_list]
nested_set = set(nested_tuples)
print(f"嵌套元组集合: {nested_set}")  # 输出: 嵌套元组集合: {(1, 2), (3, 4), (5, 6)}
```

### 数据去重

```python
# 基本去重
def remove_duplicates(data):
    """移除重复元素"""
    return list(set(data))

# 测试数据去重
test_data = [1, 2, 3, 2, 4, 1, 5, 3, 6, 4]
print(f"原始数据: {test_data}")
print(f"去重后: {remove_duplicates(test_data)}")

# 保持顺序的去重
def remove_duplicates_ordered(data):
    """保持原始顺序的去重"""
    seen = set()
    result = []
    for item in data:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result

print(f"保持顺序去重: {remove_duplicates_ordered(test_data)}")

# 字符串去重
text = "hello world programming"
unique_chars = set(text)
print(f"原文本: '{text}'")
print(f"唯一字符: {sorted(unique_chars)}")
print(f"字符数量: {len(unique_chars)}")

# 单词去重
sentence = "the quick brown fox jumps over the lazy dog the fox is quick"
words = sentence.split()
unique_words = set(words)
print(f"\n原句子: {sentence}")
print(f"所有单词: {words}")
print(f"唯一单词: {sorted(unique_words)}")
print(f"单词总数: {len(words)}, 唯一单词数: {len(unique_words)}")

# 复杂数据结构去重
students = [
    {'name': 'Alice', 'age': 20, 'major': 'CS'},
    {'name': 'Bob', 'age': 21, 'major': 'Math'},
    {'name': 'Alice', 'age': 20, 'major': 'CS'},  # 重复
    {'name': 'Charlie', 'age': 19, 'major': 'Physics'},
    {'name': 'Bob', 'age': 21, 'major': 'Math'},  # 重复
]

# 字典不能直接放入集合，需要转换
def deduplicate_dicts(dict_list, key_func=None):
    """字典列表去重"""
    if key_func is None:
        # 使用所有键值对作为标识
        key_func = lambda d: tuple(sorted(d.items()))
    
    seen_keys = set()
    result = []
    
    for item in dict_list:
        key = key_func(item)
        if key not in seen_keys:
            seen_keys.add(key)
            result.append(item)
    
    return result

unique_students = deduplicate_dicts(students)
print(f"\n学生总数: {len(students)}")
print(f"去重后学生数: {len(unique_students)}")
for student in unique_students:
    print(f"  {student}")

# 按特定字段去重
unique_by_name = deduplicate_dicts(students, lambda d: d['name'])
print(f"\n按姓名去重:")
for student in unique_by_name:
    print(f"  {student}")

# 文件内容去重
def deduplicate_lines(text):
    """文本行去重"""
    lines = text.strip().split('\n')
    unique_lines = []
    seen = set()
    
    for line in lines:
        line = line.strip()
        if line and line not in seen:
            seen.add(line)
            unique_lines.append(line)
    
    return '\n'.join(unique_lines)

sample_text = """apple
banana
apple
cherry
banana
date
apple
fig"""

print(f"\n原始文本:")
print(sample_text)
print(f"\n去重后:")
print(deduplicate_lines(sample_text))
```

### 集合运算

```python
# 基本集合运算
set_a = {1, 2, 3, 4, 5}
set_b = {4, 5, 6, 7, 8}
set_c = {1, 2, 3}

print(f"集合A: {set_a}")
print(f"集合B: {set_b}")
print(f"集合C: {set_c}")

# 并集（union）
union_ab = set_a | set_b  # 或者 set_a.union(set_b)
print(f"\nA ∪ B: {union_ab}")
print(f"A.union(B): {set_a.union(set_b)}")

# 交集（intersection）
intersection_ab = set_a & set_b  # 或者 set_a.intersection(set_b)
print(f"A ∩ B: {intersection_ab}")
print(f"A.intersection(B): {set_a.intersection(set_b)}")

# 差集（difference）
difference_ab = set_a - set_b  # 或者 set_a.difference(set_b)
difference_ba = set_b - set_a
print(f"A - B: {difference_ab}")
print(f"B - A: {difference_ba}")

# 对称差集（symmetric difference）
sym_diff_ab = set_a ^ set_b  # 或者 set_a.symmetric_difference(set_b)
print(f"A △ B: {sym_diff_ab}")
print(f"A.symmetric_difference(B): {set_a.symmetric_difference(set_b)}")

# 子集和超集检查
print(f"\n子集和超集关系:")
print(f"C ⊆ A (C是A的子集): {set_c <= set_a}")
print(f"C ⊂ A (C是A的真子集): {set_c < set_a}")
print(f"A ⊇ C (A是C的超集): {set_a >= set_c}")
print(f"A ⊃ C (A是C的真超集): {set_a > set_c}")

# 不相交检查
print(f"A和B不相交: {set_a.isdisjoint(set_b)}")
print(f"A和{10, 11, 12}不相交: {set_a.isdisjoint({10, 11, 12})}")

# 多集合运算
sets = [set_a, set_b, set_c]
all_union = set().union(*sets)
all_intersection = set_a.intersection(*sets[1:])

print(f"\n多集合运算:")
print(f"所有集合并集: {all_union}")
print(f"所有集合交集: {all_intersection}")

# 实际应用：权限管理
user_permissions = {
    'alice': {'read', 'write', 'execute'},
    'bob': {'read', 'write'},
    'charlie': {'read'},
    'admin': {'read', 'write', 'execute', 'delete', 'admin'}
}

required_permissions = {'read', 'write'}
admin_permissions = {'admin', 'delete'}

print(f"\n权限管理示例:")
for user, perms in user_permissions.items():
    has_required = required_permissions <= perms
    has_admin = bool(perms & admin_permissions)
    missing = required_permissions - perms
    
    print(f"{user}:")
    print(f"  权限: {perms}")
    print(f"  满足基本要求: {has_required}")
    print(f"  有管理权限: {has_admin}")
    if missing:
        print(f"  缺少权限: {missing}")

# 数据分析应用
survey_responses = {
    'question1': {'A', 'B', 'C', 'A', 'B', 'A'},
    'question2': {'Yes', 'No', 'Yes', 'Maybe', 'Yes', 'No'},
    'question3': {'Good', 'Excellent', 'Good', 'Fair', 'Excellent'}
}

print(f"\n调查数据分析:")
for question, responses in survey_responses.items():
    unique_responses = set(responses)
    print(f"{question}: {len(unique_responses)}种不同回答 - {unique_responses}")

# 找出所有问题的共同回答模式
all_responses = set()
for responses in survey_responses.values():
    all_responses.update(responses)

print(f"所有回答类型: {all_responses}")
```

### 高级应用

```python
# 图算法中的应用
class Graph:
    def __init__(self):
        self.adjacency = {}
    
    def add_edge(self, u, v):
        """添加边"""
        if u not in self.adjacency:
            self.adjacency[u] = set()
        if v not in self.adjacency:
            self.adjacency[v] = set()
        
        self.adjacency[u].add(v)
        self.adjacency[v].add(u)  # 无向图
    
    def get_neighbors(self, node):
        """获取邻居节点"""
        return self.adjacency.get(node, set())
    
    def bfs(self, start):
        """广度优先搜索"""
        visited = set()
        queue = [start]
        result = []
        
        while queue:
            node = queue.pop(0)
            if node not in visited:
                visited.add(node)
                result.append(node)
                
                # 添加未访问的邻居
                neighbors = self.get_neighbors(node) - visited
                queue.extend(neighbors)
        
        return result
    
    def find_connected_components(self):
        """查找连通分量"""
        visited = set()
        components = []
        
        for node in self.adjacency:
            if node not in visited:
                component = set(self.bfs(node))
                visited.update(component)
                components.append(component)
        
        return components

# 创建图并测试
graph = Graph()
edges = [(1, 2), (2, 3), (4, 5), (6, 7), (7, 8), (1, 3)]

for u, v in edges:
    graph.add_edge(u, v)

print("图的邻接表:")
for node, neighbors in graph.adjacency.items():
    print(f"  {node}: {neighbors}")

print(f"\n从节点1开始的BFS: {graph.bfs(1)}")
print(f"连通分量: {graph.find_connected_components()}")

# 文本分析：词汇统计
def analyze_text_vocabulary(texts):
    """分析文本词汇"""
    all_words = set()
    text_vocabularies = []
    
    for i, text in enumerate(texts):
        words = set(text.lower().split())
        text_vocabularies.append(words)
        all_words.update(words)
        print(f"文本{i+1}词汇量: {len(words)}")
    
    print(f"\n总词汇量: {len(all_words)}")
    
    # 计算词汇重叠
    if len(text_vocabularies) >= 2:
        common_words = text_vocabularies[0]
        for vocab in text_vocabularies[1:]:
            common_words &= vocab
        
        print(f"所有文本共同词汇: {len(common_words)}")
        if common_words:
            print(f"共同词汇: {sorted(common_words)}")
    
    # 计算每个文本的独特词汇
    for i, vocab in enumerate(text_vocabularies):
        unique_words = vocab
        for j, other_vocab in enumerate(text_vocabularies):
            if i != j:
                unique_words -= other_vocab
        
        print(f"文本{i+1}独特词汇: {len(unique_words)}")
        if unique_words:
            print(f"  {sorted(unique_words)}")
    
    return {
        'total_vocabulary': all_words,
        'text_vocabularies': text_vocabularies,
        'common_words': common_words if len(text_vocabularies) >= 2 else set()
    }

# 测试文本分析
sample_texts = [
    "Python is a powerful programming language",
    "Programming with Python is fun and easy",
    "Machine learning uses Python for data analysis"
]

analysis = analyze_text_vocabulary(sample_texts)

# 推荐系统：基于集合的相似度
def calculate_jaccard_similarity(set1, set2):
    """计算Jaccard相似度"""
    intersection = len(set1 & set2)
    union = len(set1 | set2)
    return intersection / union if union > 0 else 0

def recommend_items(user_items, all_user_items, threshold=0.3):
    """基于用户物品集合的推荐"""
    recommendations = set()
    
    for other_user, other_items in all_user_items.items():
        similarity = calculate_jaccard_similarity(user_items, other_items)
        
        if similarity >= threshold:
            # 推荐其他用户有但当前用户没有的物品
            new_items = other_items - user_items
            recommendations.update(new_items)
            print(f"与用户{other_user}相似度: {similarity:.3f}, 新物品: {new_items}")
    
    return recommendations

# 用户购买记录
user_purchases = {
    'alice': {'laptop', 'mouse', 'keyboard', 'monitor'},
    'bob': {'laptop', 'mouse', 'headphones', 'webcam'},
    'charlie': {'tablet', 'stylus', 'case', 'charger'},
    'diana': {'laptop', 'mouse', 'keyboard', 'headphones'},
    'eve': {'monitor', 'keyboard', 'speakers', 'webcam'}
}

current_user_items = {'laptop', 'mouse'}
print(f"\n当前用户物品: {current_user_items}")
print(f"推荐物品:")

recommended = recommend_items(current_user_items, user_purchases)
print(f"\n最终推荐: {recommended}")

# 数据质量检查
def check_data_quality(datasets):
    """检查数据集质量"""
    print("数据质量检查:")
    
    for name, data in datasets.items():
        data_set = set(data)
        duplicates = len(data) - len(data_set)
        
        print(f"\n{name}:")
        print(f"  总记录数: {len(data)}")
        print(f"  唯一记录数: {len(data_set)}")
        print(f"  重复记录数: {duplicates}")
        print(f"  重复率: {duplicates/len(data)*100:.1f}%")
        
        # 检查空值
        empty_values = sum(1 for item in data if not item or str(item).strip() == '')
        print(f"  空值数量: {empty_values}")
        
        # 检查数据类型一致性
        types = set(type(item).__name__ for item in data_set)
        print(f"  数据类型: {types}")
        
        if len(types) > 1:
            print(f"  ⚠️ 警告：数据类型不一致")

# 测试数据质量检查
test_datasets = {
    'user_ids': [1, 2, 3, 2, 4, 5, 1, 6, 7, 3],
    'emails': ['a@test.com', 'b@test.com', '', 'c@test.com', 'a@test.com', None],
    'scores': [85, 92, 78, 85, 90, 88, 92, 76, 85]
}

check_data_quality(test_datasets)
```

### 性能优化

```python
import time
import random

# 成员测试性能比较
def performance_comparison():
    """性能比较测试"""
    # 创建测试数据
    n = 100000
    test_list = list(range(n))
    test_set = set(test_list)
    test_tuple = tuple(test_list)
    
    # 随机选择测试元素
    test_elements = random.sample(test_list, 1000)
    
    print(f"性能测试（数据量: {n:,}，测试次数: {len(test_elements)}）:")
    
    # 列表成员测试
    start_time = time.time()
    for element in test_elements:
        _ = element in test_list
    list_time = time.time() - start_time
    
    # 集合成员测试
    start_time = time.time()
    for element in test_elements:
        _ = element in test_set
    set_time = time.time() - start_time
    
    # 元组成员测试
    start_time = time.time()
    for element in test_elements:
        _ = element in test_tuple
    tuple_time = time.time() - start_time
    
    print(f"列表查找时间: {list_time:.6f}秒")
    print(f"集合查找时间: {set_time:.6f}秒")
    print(f"元组查找时间: {tuple_time:.6f}秒")
    
    if set_time > 0:
        print(f"集合比列表快: {list_time/set_time:.1f}倍")
        print(f"集合比元组快: {tuple_time/set_time:.1f}倍")

performance_comparison()

# 集合操作性能
def set_operations_performance():
    """集合操作性能测试"""
    # 创建大型集合
    set1 = set(range(50000))
    set2 = set(range(25000, 75000))
    
    print(f"\n集合操作性能测试:")
    print(f"集合1大小: {len(set1):,}")
    print(f"集合2大小: {len(set2):,}")
    
    operations = [
        ('并集', lambda: set1 | set2),
        ('交集', lambda: set1 & set2),
        ('差集', lambda: set1 - set2),
        ('对称差集', lambda: set1 ^ set2)
    ]
    
    for name, operation in operations:
        start_time = time.time()
        result = operation()
        end_time = time.time()
        
        print(f"{name}: {end_time - start_time:.6f}秒, 结果大小: {len(result):,}")

set_operations_performance()

# 内存使用比较
import sys

def memory_comparison():
    """内存使用比较"""
    data = list(range(10000))
    
    # 不同数据结构的内存使用
    list_obj = list(data)
    set_obj = set(data)
    tuple_obj = tuple(data)
    
    print(f"\n内存使用比较（{len(data):,}个元素）:")
    print(f"列表: {sys.getsizeof(list_obj):,} 字节")
    print(f"集合: {sys.getsizeof(set_obj):,} 字节")
    print(f"元组: {sys.getsizeof(tuple_obj):,} 字节")
    
    # 计算每个元素的平均内存开销
    print(f"\n每元素内存开销:")
    print(f"列表: {sys.getsizeof(list_obj)/len(data):.2f} 字节/元素")
    print(f"集合: {sys.getsizeof(set_obj)/len(data):.2f} 字节/元素")
    print(f"元组: {sys.getsizeof(tuple_obj)/len(data):.2f} 字节/元素")

memory_comparison()

# 集合创建方式性能比较
def creation_performance():
    """集合创建性能比较"""
    data = list(range(10000))
    
    print(f"\n集合创建性能比较:")
    
    # 方法1: set()构造函数
    start_time = time.time()
    set1 = set(data)
    time1 = time.time() - start_time
    
    # 方法2: 集合推导式
    start_time = time.time()
    set2 = {x for x in data}
    time2 = time.time() - start_time
    
    # 方法3: 循环添加
    start_time = time.time()
    set3 = set()
    for x in data:
        set3.add(x)
    time3 = time.time() - start_time
    
    # 方法4: 字面量（小数据集）
    small_data = list(range(100))
    start_time = time.time()
    set4 = {0, 1, 2, 3, 4}  # 示例
    time4 = time.time() - start_time
    
    print(f"set()构造: {time1:.6f}秒")
    print(f"集合推导式: {time2:.6f}秒")
    print(f"循环添加: {time3:.6f}秒")
    
    # 验证结果一致性
    print(f"\n结果一致性检查:")
    print(f"set1 == set2: {set1 == set2}")
    print(f"set2 == set3: {set2 == set3}")

creation_performance()
```

## ⚠️ 注意事项

### 元素要求

```python
# 集合元素必须是可哈希的
print("集合元素要求:")

# 有效的元素类型
valid_elements = {
    'string',
    42,
    3.14,
    (1, 2, 3),
    frozenset([1, 2, 3]),
    True
}

print(f"有效元素集合: {valid_elements}")

# 无效的元素类型
print("\n无效元素类型示例:")
invalid_elements = [
    ([1, 2, 3], "列表"),
    ({1, 2, 3}, "集合"),
    ({'a': 1}, "字典")
]

for invalid_element, description in invalid_elements:
    try:
        test_set = {invalid_element}
    except TypeError as e:
        print(f"  {description}: {e}")

# 可变对象的处理
print("\n可变对象处理:")
original_list = [1, 2, 3]
print(f"原始列表: {original_list}")

# 转换为不可变类型
immutable_tuple = tuple(original_list)
test_set = {immutable_tuple}
print(f"转换为元组后可以加入集合: {test_set}")

# 嵌套结构的处理
nested_data = [[1, 2], [3, 4], [1, 2]]
print(f"\n嵌套列表: {nested_data}")

# 转换为可哈希的元组
hashable_data = [tuple(item) for item in nested_data]
unique_tuples = set(hashable_data)
print(f"转换为元组集合: {unique_tuples}")

# 自定义对象的哈希
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __hash__(self):
        return hash((self.x, self.y))
    
    def __eq__(self, other):
        return isinstance(other, Point) and self.x == other.x and self.y == other.y
    
    def __repr__(self):
        return f"Point({self.x}, {self.y})"

# 测试自定义对象
points = [Point(1, 2), Point(3, 4), Point(1, 2), Point(5, 6)]
point_set = set(points)
print(f"\n点对象集合: {point_set}")
print(f"原始点数: {len(points)}, 唯一点数: {len(point_set)}")
```

### 常见陷阱

```python
# 空集合创建陷阱
print("空集合创建陷阱:")

# 错误方式
empty_dict = {}  # 这是字典，不是集合
print(f"{{}} 的类型: {type(empty_dict)}")

# 正确方式
empty_set = set()
print(f"set() 的类型: {type(empty_set)}")

# 集合是无序的
print("\n集合无序性:")
for i in range(3):
    test_set = set([3, 1, 4, 1, 5, 9, 2, 6])
    print(f"第{i+1}次创建: {test_set}")

# 集合修改时的迭代陷阱
print("\n迭代时修改集合的陷阱:")
test_set = {1, 2, 3, 4, 5, 6}
print(f"原始集合: {test_set}")

# 错误的方式（可能导致RuntimeError）
try:
    for item in test_set:
        if item % 2 == 0:
            test_set.remove(item)  # 在迭代时修改集合
except RuntimeError as e:
    print(f"迭代时修改错误: {e}")

# 正确的方式1：先收集要删除的元素
test_set = {1, 2, 3, 4, 5, 6}
to_remove = []
for item in test_set:
    if item % 2 == 0:
        to_remove.append(item)

for item in to_remove:
    test_set.remove(item)

print(f"正确删除后: {test_set}")

# 正确的方式2：使用集合推导式
original_set = {1, 2, 3, 4, 5, 6}
filtered_set = {item for item in original_set if item % 2 != 0}
print(f"推导式过滤: {filtered_set}")

# 集合与列表的转换顺序问题
print("\n集合与列表转换的顺序问题:")
original_list = [3, 1, 4, 1, 5, 9, 2, 6, 5]
print(f"原始列表: {original_list}")

# 通过集合去重会丢失顺序
deduped_unordered = list(set(original_list))
print(f"集合去重（无序）: {deduped_unordered}")

# 保持顺序的去重
def ordered_unique(lst):
    seen = set()
    result = []
    for item in lst:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result

deduped_ordered = ordered_unique(original_list)
print(f"保持顺序去重: {deduped_ordered}")

# 集合比较的陷阱
print("\n集合比较陷阱:")
set1 = {1, 2, 3}
set2 = {3, 2, 1}
set3 = {1, 2}

print(f"set1: {set1}")
print(f"set2: {set2}")
print(f"set3: {set3}")
print(f"set1 == set2: {set1 == set2}")  # True，集合相等不考虑顺序
print(f"set1 > set3: {set1 > set3}")    # True，set1是set3的超集
print(f"set3 < set1: {set3 < set1}")    # True，set3是set1的子集

# 注意：集合比较是基于包含关系，不是大小
set4 = {10}
set5 = {1, 2, 3}
try:
    result = set4 > set5  # 这不会抛出错误，但结果是False
    print(f"{set4} > {set5}: {result}")  # False，因为{10}不包含{1,2,3}
except Exception as e:
    print(f"比较错误: {e}")

# 集合的浅拷贝问题
print("\n集合浅拷贝问题:")
original_set = {(1, [2, 3]), (4, [5, 6])}  # 这会出错，因为列表不可哈希

# 正确的方式
original_set = {(1, (2, 3)), (4, (5, 6))}
copied_set = set(original_set)  # 浅拷贝

print(f"原始集合: {original_set}")
print(f"拷贝集合: {copied_set}")
print(f"是否同一对象: {original_set is copied_set}")
print(f"内容是否相等: {original_set == copied_set}")

# 对于包含可变对象的情况，需要深拷贝
import copy

class MutablePoint:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.metadata = []
    
    def __hash__(self):
        return hash((self.x, self.y))
    
    def __eq__(self, other):
        return isinstance(other, MutablePoint) and self.x == other.x and self.y == other.y
    
    def __repr__(self):
        return f"MutablePoint({self.x}, {self.y}, {self.metadata})"

point1 = MutablePoint(1, 2)
point1.metadata.append("info")
original_set = {point1}

shallow_copy = set(original_set)
deep_copy = copy.deepcopy(original_set)

print(f"\n可变对象集合:")
print(f"原始: {original_set}")
print(f"浅拷贝: {shallow_copy}")
print(f"深拷贝: {deep_copy}")

# 修改原始对象
point1.metadata.append("modified")
print(f"\n修改后:")
print(f"原始: {original_set}")
print(f"浅拷贝: {shallow_copy}")
print(f"深拷贝: {deep_copy}")
```

## 🔗 相关内容

### 相关函数
- [list() - 列表构造函数](list.md) - 创建列表
- [tuple() - 元组构造函数](tuple.md) - 创建元组
- [dict() - 字典构造函数](dict.md) - 创建字典
- [frozenset() - 不可变集合](frozenset.md) - 创建不可变集合
- [len() - 长度函数](len.md) - 获取长度
- [any() - 任意为真](any.md) - 检查任意元素
- [all() - 全部为真](all.md) - 检查所有元素

### 相关模块
- [collections模块](../stdlib/collections.md) - 容器数据类型
- [itertools模块](../stdlib/itertools.md) - 迭代工具
- [copy模块](../stdlib/copy.md) - 拷贝操作
- [operator模块](../stdlib/operator.md) - 操作符函数

### 相关概念
- [集合推导式](../basics/set-comprehensions.md) - 集合生成
- [哈希表](../advanced/hash-tables.md) - 底层实现
- [集合论](../math/set-theory.md) - 数学基础
- [数据结构](../basics/data-structures.md) - 数据组织

## 📚 扩展阅读

- [Python官方文档 - set()](https://docs.python.org/3/library/functions.html#func-set)
- [Python官方文档 - 集合类型](https://docs.python.org/3/library/stdtypes.html#set)
- [集合推导式](https://docs.python.org/3/tutorial/datastructures.html#sets)
- [集合操作](https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset)

## 🏷️ 标签

`类型转换` `容器` `集合` `可变类型` `哈希表` `去重` `集合运算`

---

**最后更新**: 2024-01-15  
**作者**: Python文档工程师  
**版本**: 1.0