---
layout: doc
title: dict() - 字典构造函数
permalink: /docs/builtins/dict/
category: builtins
tags: [类型转换, 容器, 映射, 可变]
description: 创建字典对象或将可迭代对象转换为字典
author: Python文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: 初级
---

# dict() - 字典构造函数

## 📝 概述

`dict()` 是Python中的内置函数，用于创建字典对象或将其他数据结构转换为字典。字典是Python中的可变映射类型，以键值对的形式存储数据，具有快速查找、插入和删除的特性，是数据处理中最重要的数据结构之一。

## 🎯 学习目标

- 掌握dict()函数的多种用法
- 理解字典的特性和应用场景
- 学会不同数据结构到字典的转换
- 了解字典的性能特点和最佳实践

## 📋 前置知识

- Python基本数据类型
- 可迭代对象概念
- 键值对概念
- 哈希表基础

## 🔍 详细内容

### 基本概念

字典（dict）是Python中的可变映射类型，使用键值对存储数据。`dict()` 函数提供了多种创建字典的方式，支持从各种数据源构建字典，是数据组织和处理的核心工具。

### 语法格式

```python
# 创建空字典
dict()

# 从关键字参数创建
dict(**kwargs)

# 从可迭代对象创建
dict(iterable)

# 从映射对象创建
dict(mapping)

# 混合方式
dict(iterable, **kwargs)
dict(mapping, **kwargs)
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| iterable | iterable | 否 | 无 | 包含键值对的可迭代对象 |
| mapping | mapping | 否 | 无 | 映射对象（如另一个字典） |
| **kwargs | any | 否 | 无 | 关键字参数形式的键值对 |

### 返回值

- **类型**: dict
- **说明**: 新创建的字典对象

## 💡 实际应用

### 基础用法

```python
# 创建空字典
empty_dict = dict()
print(f"空字典: {empty_dict}")  # 输出: 空字典: {}
print(f"类型: {type(empty_dict)}")  # 输出: 类型: <class 'dict'>

# 等价的创建方式
empty_dict2 = {}
print(f"字面量创建: {empty_dict2}")  # 输出: 字面量创建: {}

# 从关键字参数创建
kwargs_dict = dict(name='Alice', age=25, city='Beijing')
print(f"关键字参数创建: {kwargs_dict}")  # 输出: 关键字参数创建: {'name': 'Alice', 'age': 25, 'city': 'Beijing'}

# 从元组列表创建
tuple_list = [('a', 1), ('b', 2), ('c', 3)]
tuple_dict = dict(tuple_list)
print(f"元组列表转字典: {tuple_dict}")  # 输出: 元组列表转字典: {'a': 1, 'b': 2, 'c': 3}

# 从二维列表创建
list_pairs = [['x', 10], ['y', 20], ['z', 30]]
list_dict = dict(list_pairs)
print(f"二维列表转字典: {list_dict}")  # 输出: 二维列表转字典: {'x': 10, 'y': 20, 'z': 30}

# 从zip对象创建
keys = ['red', 'green', 'blue']
values = [255, 128, 64]
zip_dict = dict(zip(keys, values))
print(f"zip对象转字典: {zip_dict}")  # 输出: zip对象转字典: {'red': 255, 'green': 128, 'blue': 64}

# 从另一个字典创建（浅拷贝）
original = {'a': 1, 'b': 2, 'c': 3}
copied_dict = dict(original)
print(f"字典拷贝: {copied_dict}")  # 输出: 字典拷贝: {'a': 1, 'b': 2, 'c': 3}
print(f"是否同一对象: {original is copied_dict}")  # 输出: 是否同一对象: False

# 混合创建方式
mixed_dict = dict([('a', 1), ('b', 2)], c=3, d=4)
print(f"混合方式创建: {mixed_dict}")  # 输出: 混合方式创建: {'a': 1, 'b': 2, 'c': 3, 'd': 4}

# 从字符串对创建
string_pairs = ['ab', 'cd', 'ef']
string_dict = dict(string_pairs)
print(f"字符串对转字典: {string_dict}")  # 输出: 字符串对转字典: {'a': 'b', 'c': 'd', 'e': 'f'}
```

### 高级创建方式

```python
# 使用字典推导式
square_dict = {x: x**2 for x in range(5)}
print(f"字典推导式: {square_dict}")  # 输出: 字典推导式: {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# 条件字典推导式
even_squares = {x: x**2 for x in range(10) if x % 2 == 0}
print(f"条件字典推导式: {even_squares}")  # 输出: 条件字典推导式: {0: 0, 2: 4, 4: 16, 6: 36, 8: 64}

# 从函数结果创建
def get_word_length(words):
    """获取单词长度字典"""
    return dict((word, len(word)) for word in words)

words = ['python', 'java', 'javascript', 'go', 'rust']
word_lengths = get_word_length(words)
print(f"单词长度字典: {word_lengths}")

# 嵌套字典创建
students_data = [
    ('Alice', {'age': 20, 'grade': 'A', 'subjects': ['Math', 'Physics']}),
    ('Bob', {'age': 19, 'grade': 'B', 'subjects': ['Chemistry', 'Biology']}),
    ('Charlie', {'age': 21, 'grade': 'A', 'subjects': ['Math', 'Chemistry']})
]

students_dict = dict(students_data)
print(f"学生信息字典:")
for name, info in students_dict.items():
    print(f"  {name}: {info}")

# 多层嵌套字典
company_structure = dict([
    ('engineering', dict([
        ('frontend', ['Alice', 'Bob']),
        ('backend', ['Charlie', 'Diana']),
        ('devops', ['Eve'])
    ])),
    ('marketing', dict([
        ('digital', ['Frank', 'Grace']),
        ('content', ['Henry'])
    ])),
    ('sales', dict([
        ('enterprise', ['Ivy', 'Jack']),
        ('retail', ['Kate'])
    ]))
])

print(f"\n公司结构:")
for dept, teams in company_structure.items():
    print(f"  {dept}:")
    for team, members in teams.items():
        print(f"    {team}: {members}")
```

### 数据转换和处理

```python
# CSV数据转字典
csv_data = """name,age,city,salary
Alice,25,Beijing,8000
Bob,30,Shanghai,12000
Charlie,28,Guangzhou,10000
Diana,26,Shenzhen,9500"""

def csv_to_dict_list(csv_string):
    """将CSV字符串转换为字典列表"""
    lines = csv_string.strip().split('\n')
    headers = lines[0].split(',')
    
    result = []
    for line in lines[1:]:
        values = line.split(',')
        # 尝试转换数值
        converted_values = []
        for value in values:
            try:
                # 尝试转换为整数
                converted_values.append(int(value))
            except ValueError:
                try:
                    # 尝试转换为浮点数
                    converted_values.append(float(value))
                except ValueError:
                    # 保持字符串
                    converted_values.append(value)
        
        row_dict = dict(zip(headers, converted_values))
        result.append(row_dict)
    
    return result

employees = csv_to_dict_list(csv_data)
print("员工数据:")
for emp in employees:
    print(f"  {emp}")

# 数据分组
def group_by_key(data_list, key_func):
    """按键函数分组数据"""
    groups = {}
    for item in data_list:
        key = key_func(item)
        if key not in groups:
            groups[key] = []
        groups[key].append(item)
    return groups

# 按城市分组
by_city = group_by_key(employees, lambda emp: emp['city'])
print(f"\n按城市分组:")
for city, emp_list in by_city.items():
    names = [emp['name'] for emp in emp_list]
    print(f"  {city}: {names}")

# 按年龄段分组
def age_group(age):
    if age < 25:
        return '年轻组'
    elif age < 30:
        return '中年组'
    else:
        return '资深组'

by_age_group = group_by_key(employees, lambda emp: age_group(emp['age']))
print(f"\n按年龄段分组:")
for group, emp_list in by_age_group.items():
    names = [emp['name'] for emp in emp_list]
    print(f"  {group}: {names}")

# 数据聚合
def aggregate_data(data_list, group_key, agg_key, agg_func):
    """数据聚合"""
    groups = group_by_key(data_list, group_key)
    result = {}
    for group, items in groups.items():
        values = [item[agg_key] for item in items]
        result[group] = agg_func(values)
    return result

# 按城市统计平均工资
avg_salary_by_city = aggregate_data(
    employees, 
    lambda emp: emp['city'], 
    'salary', 
    lambda salaries: sum(salaries) / len(salaries)
)

print(f"\n各城市平均工资:")
for city, avg_salary in avg_salary_by_city.items():
    print(f"  {city}: ¥{avg_salary:.2f}")

# 统计信息字典
def calculate_statistics(data_list, numeric_fields):
    """计算统计信息"""
    stats = {}
    for field in numeric_fields:
        values = [item[field] for item in data_list]
        stats[field] = {
            'count': len(values),
            'sum': sum(values),
            'avg': sum(values) / len(values),
            'min': min(values),
            'max': max(values)
        }
    return stats

employee_stats = calculate_statistics(employees, ['age', 'salary'])
print(f"\n员工统计信息:")
for field, stats in employee_stats.items():
    print(f"  {field}:")
    for stat_name, value in stats.items():
        if stat_name == 'avg':
            print(f"    {stat_name}: {value:.2f}")
        else:
            print(f"    {stat_name}: {value}")
```

### 配置和设置管理

```python
# 配置文件处理
default_config = {
    'database': {
        'host': 'localhost',
        'port': 5432,
        'name': 'myapp',
        'user': 'admin',
        'password': 'secret'
    },
    'server': {
        'host': '0.0.0.0',
        'port': 8000,
        'debug': False,
        'workers': 4
    },
    'logging': {
        'level': 'INFO',
        'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        'file': 'app.log'
    }
}

def merge_configs(default, user_config):
    """合并配置字典"""
    result = dict(default)  # 创建默认配置的副本
    
    for key, value in user_config.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            # 递归合并嵌套字典
            result[key] = merge_configs(result[key], value)
        else:
            # 直接覆盖
            result[key] = value
    
    return result

# 用户自定义配置
user_config = {
    'database': {
        'host': 'prod.example.com',
        'password': 'prod_secret'
    },
    'server': {
        'debug': True,
        'workers': 8
    },
    'cache': {
        'type': 'redis',
        'host': 'cache.example.com'
    }
}

# 合并配置
final_config = merge_configs(default_config, user_config)
print("最终配置:")
for section, settings in final_config.items():
    print(f"  {section}:")
    for key, value in settings.items():
        print(f"    {key}: {value}")

# 环境变量配置
import os

def load_env_config(prefix='APP_'):
    """从环境变量加载配置"""
    env_config = {}
    for key, value in os.environ.items():
        if key.startswith(prefix):
            # 移除前缀并转换为小写
            config_key = key[len(prefix):].lower()
            
            # 尝试转换数据类型
            if value.lower() in ('true', 'false'):
                env_config[config_key] = value.lower() == 'true'
            elif value.isdigit():
                env_config[config_key] = int(value)
            else:
                try:
                    env_config[config_key] = float(value)
                except ValueError:
                    env_config[config_key] = value
    
    return env_config

# 模拟环境变量
os.environ.update({
    'APP_DEBUG': 'true',
    'APP_PORT': '9000',
    'APP_WORKERS': '6',
    'APP_LOG_LEVEL': 'DEBUG'
})

env_config = load_env_config()
print(f"\n环境变量配置: {env_config}")

# 配置验证
def validate_config(config, schema):
    """验证配置"""
    errors = []
    
    def validate_section(section_config, section_schema, path=''):
        for key, expected_type in section_schema.items():
            current_path = f"{path}.{key}" if path else key
            
            if key not in section_config:
                errors.append(f"缺少配置项: {current_path}")
                continue
            
            value = section_config[key]
            if isinstance(expected_type, dict):
                if not isinstance(value, dict):
                    errors.append(f"配置项 {current_path} 应该是字典类型")
                else:
                    validate_section(value, expected_type, current_path)
            elif not isinstance(value, expected_type):
                errors.append(f"配置项 {current_path} 类型错误，期望 {expected_type.__name__}，实际 {type(value).__name__}")
    
    validate_section(config, schema)
    return errors

# 配置模式
config_schema = {
    'database': {
        'host': str,
        'port': int,
        'name': str,
        'user': str,
        'password': str
    },
    'server': {
        'host': str,
        'port': int,
        'debug': bool,
        'workers': int
    }
}

validation_errors = validate_config(final_config, config_schema)
if validation_errors:
    print(f"\n配置验证错误:")
    for error in validation_errors:
        print(f"  - {error}")
else:
    print(f"\n配置验证通过")
```

### 缓存和记忆化

```python
# 简单缓存实现
class SimpleCache:
    def __init__(self, max_size=100):
        self.cache = {}
        self.max_size = max_size
        self.access_order = []  # 记录访问顺序
    
    def get(self, key):
        """获取缓存值"""
        if key in self.cache:
            # 更新访问顺序
            self.access_order.remove(key)
            self.access_order.append(key)
            return self.cache[key]
        return None
    
    def set(self, key, value):
        """设置缓存值"""
        if key in self.cache:
            # 更新现有键
            self.cache[key] = value
            self.access_order.remove(key)
            self.access_order.append(key)
        else:
            # 添加新键
            if len(self.cache) >= self.max_size:
                # 移除最久未使用的项
                oldest_key = self.access_order.pop(0)
                del self.cache[oldest_key]
            
            self.cache[key] = value
            self.access_order.append(key)
    
    def clear(self):
        """清空缓存"""
        self.cache.clear()
        self.access_order.clear()
    
    def stats(self):
        """缓存统计"""
        return {
            'size': len(self.cache),
            'max_size': self.max_size,
            'keys': list(self.cache.keys())
        }

# 测试缓存
cache = SimpleCache(max_size=3)

# 添加数据
cache.set('user:1', {'name': 'Alice', 'age': 25})
cache.set('user:2', {'name': 'Bob', 'age': 30})
cache.set('user:3', {'name': 'Charlie', 'age': 28})

print("缓存状态:", cache.stats())

# 访问数据
user1 = cache.get('user:1')
print(f"获取用户1: {user1}")

# 添加新数据（会移除最久未使用的）
cache.set('user:4', {'name': 'Diana', 'age': 26})
print("添加用户4后:", cache.stats())

# 函数结果缓存
def memoize(func):
    """记忆化装饰器"""
    cache = {}
    
    def wrapper(*args, **kwargs):
        # 创建缓存键
        key = str(args) + str(sorted(kwargs.items()))
        
        if key not in cache:
            result = func(*args, **kwargs)
            cache[key] = result
            print(f"计算并缓存: {func.__name__}{args} -> {result}")
        else:
            print(f"从缓存获取: {func.__name__}{args} -> {cache[key]}")
        
        return cache[key]
    
    wrapper.cache = cache
    return wrapper

@memoize
def fibonacci(n):
    """斐波那契数列"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

@memoize
def factorial(n):
    """阶乘计算"""
    if n <= 1:
        return 1
    return n * factorial(n-1)

print("\n斐波那契数列测试:")
for i in range(8):
    result = fibonacci(i)
    print(f"fib({i}) = {result}")

print(f"\n斐波那契缓存大小: {len(fibonacci.cache)}")

print("\n阶乘测试:")
for i in range(1, 6):
    result = factorial(i)
    print(f"{i}! = {result}")

print(f"阶乘缓存大小: {len(factorial.cache)}")
```

### 实际案例：数据分析系统

```python
def build_analytics_system(raw_data):
    """构建数据分析系统"""
    
    # 数据清洗和转换
    def clean_data(data):
        """数据清洗"""
        cleaned = []
        for record in data:
            if all(key in record for key in ['user_id', 'action', 'timestamp', 'value']):
                # 数据类型转换
                try:
                    cleaned_record = dict(
                        user_id=str(record['user_id']),
                        action=str(record['action']),
                        timestamp=int(record['timestamp']),
                        value=float(record['value'])
                    )
                    cleaned.append(cleaned_record)
                except (ValueError, TypeError):
                    continue  # 跳过无效数据
        return cleaned
    
    # 用户行为分析
    def analyze_user_behavior(data):
        """分析用户行为"""
        user_stats = {}
        
        for record in data:
            user_id = record['user_id']
            if user_id not in user_stats:
                user_stats[user_id] = {
                    'total_actions': 0,
                    'total_value': 0.0,
                    'actions': {},
                    'first_seen': record['timestamp'],
                    'last_seen': record['timestamp']
                }
            
            stats = user_stats[user_id]
            stats['total_actions'] += 1
            stats['total_value'] += record['value']
            
            action = record['action']
            if action not in stats['actions']:
                stats['actions'][action] = {'count': 0, 'total_value': 0.0}
            stats['actions'][action]['count'] += 1
            stats['actions'][action]['total_value'] += record['value']
            
            stats['first_seen'] = min(stats['first_seen'], record['timestamp'])
            stats['last_seen'] = max(stats['last_seen'], record['timestamp'])
        
        return user_stats
    
    # 行为模式分析
    def analyze_action_patterns(data):
        """分析行为模式"""
        action_stats = {}
        hourly_stats = {}
        
        for record in data:
            action = record['action']
            timestamp = record['timestamp']
            value = record['value']
            
            # 行为统计
            if action not in action_stats:
                action_stats[action] = {
                    'count': 0,
                    'total_value': 0.0,
                    'unique_users': set(),
                    'avg_value': 0.0
                }
            
            action_stats[action]['count'] += 1
            action_stats[action]['total_value'] += value
            action_stats[action]['unique_users'].add(record['user_id'])
            
            # 按小时统计
            hour = timestamp // 3600  # 简化的小时计算
            if hour not in hourly_stats:
                hourly_stats[hour] = {'count': 0, 'total_value': 0.0}
            hourly_stats[hour]['count'] += 1
            hourly_stats[hour]['total_value'] += value
        
        # 计算平均值
        for action, stats in action_stats.items():
            stats['avg_value'] = stats['total_value'] / stats['count']
            stats['unique_users'] = len(stats['unique_users'])
        
        return action_stats, hourly_stats
    
    # 生成报告
    def generate_report(user_stats, action_stats, hourly_stats):
        """生成分析报告"""
        report = {
            'summary': {
                'total_users': len(user_stats),
                'total_actions': sum(stats['total_actions'] for stats in user_stats.values()),
                'total_value': sum(stats['total_value'] for stats in user_stats.values())
            },
            'top_users': [],
            'top_actions': [],
            'peak_hours': []
        }
        
        # 最活跃用户
        top_users = sorted(
            user_stats.items(),
            key=lambda x: x[1]['total_actions'],
            reverse=True
        )[:5]
        
        for user_id, stats in top_users:
            report['top_users'].append({
                'user_id': user_id,
                'total_actions': stats['total_actions'],
                'total_value': stats['total_value'],
                'avg_value': stats['total_value'] / stats['total_actions']
            })
        
        # 最热门行为
        top_actions = sorted(
            action_stats.items(),
            key=lambda x: x[1]['count'],
            reverse=True
        )
        
        for action, stats in top_actions:
            report['top_actions'].append({
                'action': action,
                'count': stats['count'],
                'unique_users': stats['unique_users'],
                'avg_value': stats['avg_value']
            })
        
        # 高峰时段
        peak_hours = sorted(
            hourly_stats.items(),
            key=lambda x: x[1]['count'],
            reverse=True
        )[:5]
        
        for hour, stats in peak_hours:
            report['peak_hours'].append({
                'hour': hour,
                'count': stats['count'],
                'total_value': stats['total_value']
            })
        
        return report
    
    # 执行分析流程
    cleaned_data = clean_data(raw_data)
    user_stats = analyze_user_behavior(cleaned_data)
    action_stats, hourly_stats = analyze_action_patterns(cleaned_data)
    report = generate_report(user_stats, action_stats, hourly_stats)
    
    return {
        'cleaned_data': cleaned_data,
        'user_stats': user_stats,
        'action_stats': action_stats,
        'hourly_stats': hourly_stats,
        'report': report
    }

# 测试数据
test_data = [
    {'user_id': 'user1', 'action': 'login', 'timestamp': 1640995200, 'value': 1.0},
    {'user_id': 'user1', 'action': 'view_page', 'timestamp': 1640995260, 'value': 0.5},
    {'user_id': 'user1', 'action': 'purchase', 'timestamp': 1640995320, 'value': 99.99},
    {'user_id': 'user2', 'action': 'login', 'timestamp': 1640995400, 'value': 1.0},
    {'user_id': 'user2', 'action': 'view_page', 'timestamp': 1640995460, 'value': 0.5},
    {'user_id': 'user2', 'action': 'view_page', 'timestamp': 1640995520, 'value': 0.5},
    {'user_id': 'user3', 'action': 'login', 'timestamp': 1640995600, 'value': 1.0},
    {'user_id': 'user3', 'action': 'purchase', 'timestamp': 1640995660, 'value': 149.99},
    {'user_id': 'user1', 'action': 'logout', 'timestamp': 1640995720, 'value': 0.0},
]

# 运行分析
analysis_result = build_analytics_system(test_data)

print("数据分析结果:")
print(f"\n总体统计:")
summary = analysis_result['report']['summary']
print(f"  总用户数: {summary['total_users']}")
print(f"  总行为数: {summary['total_actions']}")
print(f"  总价值: {summary['total_value']:.2f}")

print(f"\n最活跃用户:")
for user in analysis_result['report']['top_users']:
    print(f"  {user['user_id']}: {user['total_actions']}次行为, 总价值{user['total_value']:.2f}")

print(f"\n最热门行为:")
for action in analysis_result['report']['top_actions']:
    print(f"  {action['action']}: {action['count']}次, {action['unique_users']}个用户")
```

## ⚠️ 注意事项

### 键的要求

```python
# 字典键必须是可哈希的
print("字典键的要求:")

# 有效的键类型
valid_keys = {
    'string': '字符串键',
    42: '整数键',
    3.14: '浮点数键',
    (1, 2): '元组键',
    frozenset([1, 2, 3]): '冻结集合键',
    True: '布尔键'
}

print("有效键类型:")
for key, description in valid_keys.items():
    print(f"  {key} ({type(key).__name__}): {description}")

# 无效的键类型
print("\n无效键类型示例:")
invalid_keys = [
    ([1, 2, 3], "列表"),
    ({1, 2, 3}, "集合"),
    ({'a': 1}, "字典")
]

for invalid_key, description in invalid_keys:
    try:
        test_dict = {invalid_key: "value"}
    except TypeError as e:
        print(f"  {description}: {e}")

# 键的哈希一致性
print("\n键的哈希一致性:")
key1 = (1, 2, 3)
key2 = (1, 2, 3)
print(f"key1 == key2: {key1 == key2}")
print(f"hash(key1) == hash(key2): {hash(key1) == hash(key2)}")

# 可变对象作为值是可以的
mutable_values_dict = {
    'list': [1, 2, 3],
    'dict': {'nested': 'value'},
    'set': {4, 5, 6}
}
print(f"\n包含可变值的字典: {mutable_values_dict}")

# 修改可变值
mutable_values_dict['list'].append(4)
print(f"修改后: {mutable_values_dict}")
```

### 性能考虑

```python
import time
import sys

# 字典 vs 列表查找性能
n = 100000

# 创建测试数据
test_list = list(range(n))
test_dict = {i: i for i in range(n)}
test_keys = [i for i in range(0, n, 1000)]  # 每1000个取一个

print(f"性能测试（数据量: {n}）:")

# 列表查找
start_time = time.time()
for key in test_keys:
    _ = key in test_list
list_time = time.time() - start_time

# 字典查找
start_time = time.time()
for key in test_keys:
    _ = key in test_dict
dict_time = time.time() - start_time

print(f"列表查找时间: {list_time:.6f}秒")
print(f"字典查找时间: {dict_time:.6f}秒")
if dict_time > 0:
    print(f"字典快 {list_time/dict_time:.2f} 倍")

# 内存使用比较
list_size = sys.getsizeof(test_list)
dict_size = sys.getsizeof(test_dict)

print(f"\n内存使用:")
print(f"列表大小: {list_size:,} 字节")
print(f"字典大小: {dict_size:,} 字节")
print(f"字典额外开销: {((dict_size - list_size) / list_size * 100):.1f}%")

# 字典创建方式性能比较
test_data = [(f'key{i}', i) for i in range(10000)]

# 方法1: dict()构造函数
start_time = time.time()
dict1 = dict(test_data)
time1 = time.time() - start_time

# 方法2: 字典推导式
start_time = time.time()
dict2 = {k: v for k, v in test_data}
time2 = time.time() - start_time

# 方法3: 循环构建
start_time = time.time()
dict3 = {}
for k, v in test_data:
    dict3[k] = v
time3 = time.time() - start_time

print(f"\n字典创建性能比较:")
print(f"dict()构造: {time1:.6f}秒")
print(f"字典推导式: {time2:.6f}秒")
print(f"循环构建: {time3:.6f}秒")
```

### 常见陷阱

```python
# 默认值陷阱
print("字典默认值陷阱:")

# 错误的默认值处理
def wrong_default_dict():
    """错误的默认值处理"""
    d = {}
    key = 'missing_key'
    
    # 这样会抛出KeyError
    try:
        value = d[key]
    except KeyError:
        print(f"KeyError: {key}")
    
    # 正确的方式
    value = d.get(key, 'default_value')
    print(f"使用get方法: {value}")
    
    # 或者使用setdefault
    value = d.setdefault(key, 'default_value')
    print(f"使用setdefault: {value}")
    print(f"字典现在包含: {d}")

wrong_default_dict()

# 可变默认值陷阱
print("\n可变默认值陷阱:")

# 错误的方式
def wrong_mutable_default(key, value, d={}):
    """错误：使用可变默认参数"""
    d[key] = value
    return d

result1 = wrong_mutable_default('a', 1)
result2 = wrong_mutable_default('b', 2)
print(f"第一次调用: {result1}")
print(f"第二次调用: {result2}")
print(f"两次结果相同: {result1 is result2}")

# 正确的方式
def correct_mutable_default(key, value, d=None):
    """正确：使用None作为默认值"""
    if d is None:
        d = {}
    d[key] = value
    return d

result3 = correct_mutable_default('a', 1)
result4 = correct_mutable_default('b', 2)
print(f"\n正确方式第一次: {result3}")
print(f"正确方式第二次: {result4}")
print(f"两次结果相同: {result3 is result4}")

# 字典修改时的迭代陷阱
print("\n迭代时修改字典的陷阱:")

test_dict = {'a': 1, 'b': 2, 'c': 3, 'd': 4}

# 错误的方式（可能导致RuntimeError）
print("原始字典:", test_dict)
try:
    for key in test_dict:
        if test_dict[key] % 2 == 0:
            del test_dict[key]  # 在迭代时修改字典
except RuntimeError as e:
    print(f"迭代时修改错误: {e}")

# 正确的方式1：先收集要删除的键
test_dict = {'a': 1, 'b': 2, 'c': 3, 'd': 4}
keys_to_delete = []
for key, value in test_dict.items():
    if value % 2 == 0:
        keys_to_delete.append(key)

for key in keys_to_delete:
    del test_dict[key]

print(f"正确删除后: {test_dict}")

# 正确的方式2：使用字典推导式
original_dict = {'a': 1, 'b': 2, 'c': 3, 'd': 4}
filtered_dict = {k: v for k, v in original_dict.items() if v % 2 != 0}
print(f"推导式过滤: {filtered_dict}")

# 浅拷贝陷阱
print("\n浅拷贝陷阱:")
original = {'a': [1, 2, 3], 'b': [4, 5, 6]}
shallow_copy = dict(original)

print(f"原始字典: {original}")
print(f"浅拷贝: {shallow_copy}")

# 修改浅拷贝中的可变对象
shallow_copy['a'].append(4)
print(f"修改浅拷贝后:")
print(f"原始字典: {original}")
print(f"浅拷贝: {shallow_copy}")
print(f"列表对象相同: {original['a'] is shallow_copy['a']}")

# 深拷贝解决方案
import copy
deep_copy = copy.deepcopy(original)
deep_copy['a'].append(5)
print(f"\n深拷贝修改后:")
print(f"原始字典: {original}")
print(f"深拷贝: {deep_copy}")
```

## 🔗 相关内容

### 相关函数
- [list() - 列表构造函数](list/) - 创建列表
- [tuple() - 元组构造函数](tuple/) - 创建元组
- [set() - 集合构造函数](set/) - 创建集合
- [str() - 字符串构造函数](str/) - 创建字符串
- [len() - 长度函数](len/) - 获取长度
- [zip() - 打包函数](zip/) - 并行迭代

### 相关模块
- [collections模块](../stdlib/collections/) - 容器数据类型
- [copy模块](../stdlib/copy/) - 拷贝操作
- [json模块](../stdlib/json/) - JSON处理
- [pickle模块](../stdlib/pickle/) - 对象序列化

### 相关概念
- [字典推导式](../basics/dict-comprehensions/) - 字典生成
- [映射类型](../basics/mapping-types/) - 映射操作
- [哈希表](../advanced/hash-tables/) - 底层实现
- [数据结构](../basics/data-structures/) - 数据组织

## 📚 扩展阅读

- [Python官方文档 - dict()](https://docs.python.org/3/library/functions.html#func-dict)
- [Python官方文档 - 字典类型](https://docs.python.org/3/library/stdtypes.html#dict)
- [字典推导式](https://docs.python.org/3/tutorial/datastructures.html#dictionaries)
- [映射类型操作](https://docs.python.org/3/library/stdtypes.html#mapping-types-dict)

## 🏷️ 标签

`类型转换` `容器` `映射` `可变类型` `哈希表`

---

**最后更新**: 2024-01-15  
**作者**: Python文档工程师  
**版本**: 1.0