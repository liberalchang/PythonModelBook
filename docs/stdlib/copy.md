---
layout: doc
title: copy模块
permalink: /docs/stdlib/copy/
category: stdlib
tags: [copy, 拷贝, 深拷贝, 浅拷贝, 对象复制]
description: Python copy模块提供浅拷贝和深拷贝功能，用于复制对象
author: Python文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: 中级
---

# copy模块

## 📝 概述

`copy` 模块提供了浅拷贝（shallow copy）和深拷贝（deep copy）功能，用于复制Python对象。浅拷贝创建新对象但只复制引用，而深拷贝递归复制所有嵌套对象，确保完全独立的副本。

## 🎯 学习目标

- 理解浅拷贝和深拷贝的区别和工作原理
- 掌握 `copy.copy()` 和 `copy.deepcopy()` 的使用方法
- 了解赋值操作与拷贝操作的本质区别
- 学会根据不同场景选择合适的拷贝方式
- 掌握拷贝操作的性能考虑和最佳实践

## 📋 前置知识

- Python 基础语法和数据类型
- 可变对象和不可变对象的概念
- 对象引用和内存管理的基本理解
- 列表、字典、元组等数据结构的使用

## 🔍 详细内容

### 基本概念

在Python中，对象复制有三种方式：
1. **赋值操作（`=`）**：创建对象引用，不复制对象
2. **浅拷贝（shallow copy）**：复制对象本身，但嵌套对象仍为引用
3. **深拷贝（deep copy）**：递归复制对象及其所有嵌套对象

### 语法格式

```python
import copy

# 浅拷贝
shallow_copy = copy.copy(original_object)

# 深拷贝
deep_copy = copy.deepcopy(original_object)
```

### 主要函数说明

| 函数名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| `copy.copy(x)` | x: 要复制的对象 | 浅拷贝对象 | 创建对象的浅拷贝 |
| `copy.deepcopy(x[, memo])` | x: 要复制的对象<br>memo: 可选的备忘录字典 | 深拷贝对象 | 创建对象的深拷贝 |

## 💡 实际应用

### 赋值操作 vs 拷贝操作

```python
import copy

# 原始数据
original = [1, 2, [3, 4]]

# 赋值操作 - 创建引用
assignment = original
assignment[0] = 99
print(f"赋值后原始数据: {original}")  # 输出: [99, 2, [3, 4]]

# 重置数据
original = [1, 2, [3, 4]]

# 浅拷贝 - 复制顶层对象
shallow = copy.copy(original)
shallow[0] = 99
print(f"浅拷贝后原始数据: {original}")  # 输出: [1, 2, [3, 4]]
shallow[2][0] = 88
print(f"修改嵌套对象后: {original}")  # 输出: [1, 2, [88, 4]]

# 重置数据
original = [1, 2, [3, 4]]

# 深拷贝 - 完全独立的副本
deep = copy.deepcopy(original)
deep[0] = 99
deep[2][0] = 88
print(f"深拷贝后原始数据: {original}")  # 输出: [1, 2, [3, 4]]
```

### 浅拷贝的使用场景

```python
import copy

# 场景1: 简单数据结构
def shallow_copy_simple():
    """简单数据结构的浅拷贝"""
    numbers = [1, 2, 3, 4, 5]
    numbers_copy = copy.copy(numbers)
    
    numbers_copy[0] = 99
    print(f"原始列表: {numbers}")        # [1, 2, 3, 4, 5]
    print(f"拷贝列表: {numbers_copy}")    # [99, 2, 3, 4, 5]

# 场景2: 嵌套不可变对象
def shallow_copy_immutable():
    """嵌套不可变对象的浅拷贝"""
    data = (1, 2, (3, 4), "hello")
    data_copy = copy.copy(data)
    
    # 由于元组是不可变的，浅拷贝足够安全
    print(f"原始元组: {data}")
    print(f"拷贝元组: {data_copy}")
    print(f"是否为同一对象: {data is data_copy}")  # False

# 场景3: 字典的浅拷贝
def shallow_copy_dict():
    """字典的浅拷贝示例"""
    config = {
        'host': 'localhost',
        'port': 8080,
        'settings': {'debug': True, 'timeout': 30}
    }
    
    config_copy = copy.copy(config)
    config_copy['host'] = '127.0.0.1'
    config_copy['settings']['debug'] = False
    
    print(f"原始配置: {config}")
    print(f"拷贝配置: {config_copy}")
    # 注意: settings 字典被共享，修改会影响原始对象

shallow_copy_simple()
shallow_copy_immutable()
shallow_copy_dict()
```

### 深拷贝的使用场景

```python
import copy

# 场景1: 复杂嵌套结构
def deep_copy_nested():
    """复杂嵌套结构的深拷贝"""
    company = {
        'name': 'TechCorp',
        'departments': {
            'engineering': {
                'employees': ['Alice', 'Bob'],
                'projects': ['Project A', 'Project B']
            },
            'marketing': {
                'employees': ['Charlie', 'Diana'],
                'campaigns': ['Campaign X', 'Campaign Y']
            }
        }
    }
    
    # 深拷贝确保完全独立
    company_copy = copy.deepcopy(company)
    
    # 修改拷贝不会影响原始数据
    company_copy['departments']['engineering']['employees'].append('Eve')
    company_copy['departments']['marketing']['campaigns'][0] = 'New Campaign'
    
    print("原始公司数据:")
    print(company)
    print("\n拷贝公司数据:")
    print(company_copy)

# 场景2: 树形数据结构
class TreeNode:
    """树节点类"""
    def __init__(self, value):
        self.value = value
        self.children = []
    
    def add_child(self, child):
        self.children.append(child)
    
    def __repr__(self):
        return f"TreeNode({self.value})"

def deep_copy_tree():
    """树形结构的深拷贝"""
    # 创建树结构
    root = TreeNode('root')
    child1 = TreeNode('child1')
    child2 = TreeNode('child2')
    grandchild = TreeNode('grandchild')
    
    root.add_child(child1)
    root.add_child(child2)
    child1.add_child(grandchild)
    
    # 深拷贝树结构
    root_copy = copy.deepcopy(root)
    
    # 修改拷贝的树
    root_copy.value = 'root_copy'
    root_copy.children[0].value = 'child1_copy'
    
    print(f"原始根节点: {root.value}")
    print(f"原始子节点: {root.children[0].value}")
    print(f"拷贝根节点: {root_copy.value}")
    print(f"拷贝子节点: {root_copy.children[0].value}")

# 场景3: 避免副作用的函数设计
def process_data_safe(data):
    """安全的数据处理函数，不修改原始数据"""
    # 深拷贝确保不修改原始数据
    data_copy = copy.deepcopy(data)
    
    # 对拷贝进行处理
    for item in data_copy:
        if isinstance(item, list):
            item.sort()
        elif isinstance(item, dict):
            item['processed'] = True
    
    return data_copy

def demonstrate_safe_processing():
    """演示安全的数据处理"""
    original_data = [
        [3, 1, 4, 1, 5],
        {'name': 'Alice', 'age': 30},
        [9, 2, 6, 5, 3]
    ]
    
    processed_data = process_data_safe(original_data)
    
    print("原始数据:")
    print(original_data)
    print("\n处理后数据:")
    print(processed_data)

deep_copy_nested()
deep_copy_tree()
demonstrate_safe_processing()
```

### 性能比较和选择指南

```python
import copy
import time

def performance_comparison():
    """性能比较示例"""
    # 创建测试数据
    large_data = {
        'numbers': list(range(10000)),
        'nested': [list(range(100)) for _ in range(100)],
        'strings': [f'string_{i}' for i in range(1000)]
    }
    
    # 测试赋值操作
    start_time = time.time()
    assignment = large_data
    assignment_time = time.time() - start_time
    
    # 测试浅拷贝
    start_time = time.time()
    shallow = copy.copy(large_data)
    shallow_time = time.time() - start_time
    
    # 测试深拷贝
    start_time = time.time()
    deep = copy.deepcopy(large_data)
    deep_time = time.time() - start_time
    
    print(f"赋值操作时间: {assignment_time:.6f} 秒")
    print(f"浅拷贝时间: {shallow_time:.6f} 秒")
    print(f"深拷贝时间: {deep_time:.6f} 秒")
    
    return {
        'assignment': assignment_time,
        'shallow': shallow_time,
        'deep': deep_time
    }

def copy_selection_guide():
    """拷贝方式选择指南"""
    scenarios = {
        '简单数据，无嵌套': 'copy.copy() 或切片操作',
        '嵌套不可变对象': 'copy.copy() 足够',
        '嵌套可变对象，需要独立性': 'copy.deepcopy()',
        '大数据量，性能敏感': '考虑是否真的需要拷贝',
        '函数参数，避免副作用': 'copy.deepcopy()',
        '配置对象，部分修改': 'copy.copy() + 手动处理嵌套'
    }
    
    print("拷贝方式选择指南:")
    for scenario, recommendation in scenarios.items():
        print(f"- {scenario}: {recommendation}")

performance_comparison()
print()
copy_selection_guide()
```

### 自定义拷贝行为

```python
import copy

class CustomCopyClass:
    """自定义拷贝行为的类"""
    
    def __init__(self, name, data):
        self.name = name
        self.data = data
        self.created_at = time.time()
    
    def __copy__(self):
        """自定义浅拷贝行为"""
        print(f"执行 {self.name} 的浅拷贝")
        # 创建新实例，但共享 data
        return CustomCopyClass(f"{self.name}_copy", self.data)
    
    def __deepcopy__(self, memo):
        """自定义深拷贝行为"""
        print(f"执行 {self.name} 的深拷贝")
        # 创建完全独立的副本
        new_data = copy.deepcopy(self.data, memo)
        return CustomCopyClass(f"{self.name}_deepcopy", new_data)
    
    def __repr__(self):
        return f"CustomCopyClass(name='{self.name}', data={self.data})"

def demonstrate_custom_copy():
    """演示自定义拷贝行为"""
    original = CustomCopyClass("original", [1, 2, [3, 4]])
    
    print("原始对象:", original)
    
    # 浅拷贝
    shallow = copy.copy(original)
    print("浅拷贝:", shallow)
    
    # 深拷贝
    deep = copy.deepcopy(original)
    print("深拷贝:", deep)
    
    # 测试独立性
    original.data[2][0] = 99
    print("\n修改原始对象后:")
    print("原始对象:", original)
    print("浅拷贝:", shallow)  # 受影响
    print("深拷贝:", deep)    # 不受影响

demonstrate_custom_copy()
```

## ⚠️ 注意事项

### 常见陷阱

1. **混淆赋值和拷贝**
   ```python
   # 错误：以为这是拷贝
   list2 = list1  # 这只是创建引用
   
   # 正确：真正的拷贝
   list2 = copy.copy(list1)  # 浅拷贝
   list2 = copy.deepcopy(list1)  # 深拷贝
   ```

2. **浅拷贝的嵌套对象陷阱**
   ```python
   original = [[1, 2], [3, 4]]
   shallow = copy.copy(original)
   shallow[0][0] = 99  # 会影响原始对象！
   ```

3. **循环引用问题**
   ```python
   # deepcopy 可以处理循环引用
   a = [1, 2]
   b = [3, 4]
   a.append(b)
   b.append(a)  # 循环引用
   
   # copy.deepcopy() 可以正确处理
   c = copy.deepcopy(a)
   ```

### 性能考虑

- 深拷贝比浅拷贝慢得多，特别是对于大型或复杂对象
- 对于不可变对象，浅拷贝通常足够
- 考虑使用其他方法，如工厂函数或构建器模式

### 内存使用

- 深拷贝会显著增加内存使用
- 对于大型数据结构，考虑是否真的需要完整拷贝
- 可以考虑写时复制（copy-on-write）策略

## 🔗 相关内容

- [Python 对象模型](../basics/objects/)
- [内存管理](../advanced/memory-management/)
- [可变与不可变对象](../basics/mutability/)

## 📚 扩展阅读

- [Python 官方文档 - copy 模块](https://docs.python.org/3/library/copy.html)
- [Python 深拷贝和浅拷贝详解](https://realpython.com/copying-python-objects/)
- [Python 对象复制最佳实践](https://docs.python-guide.org/writing/gotchas/#mutable-default-arguments)

## 🏷️ 标签

`copy` `拷贝` `深拷贝` `浅拷贝` `对象复制` `内存管理` `引用` `标准库`

---

**最后更新**: 2024-01-15  
**作者**: Python文档团队  
**版本**: 1.0