---
layout: doc
title: tuple() - 元组构造函数
permalink: /docs/builtins/tuple/
category: builtins
tags: [类型转换, 容器, 序列, 不可变]
description: 创建元组对象或将可迭代对象转换为元组
author: Python文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: 初级
---

# tuple() - 元组构造函数

## 📝 概述

`tuple()` 是Python中的内置函数，用于创建元组对象或将可迭代对象转换为元组。元组是Python中的不可变序列类型，具有有序、不可变、允许重复元素的特性，常用于存储不需要修改的数据集合。

## 🎯 学习目标

- 掌握tuple()函数的基本用法
- 理解元组的特性和应用场景
- 学会不同类型到元组的转换
- 了解元组的性能优势

## 📋 前置知识

- Python基本数据类型
- 可迭代对象概念
- 序列类型基础
- 不可变对象概念

## 🔍 详细内容

### 基本概念

元组（tuple）是Python中的不可变序列类型，一旦创建就不能修改其内容。`tuple()` 函数可以创建空元组或将其他可迭代对象转换为元组，在需要不可变数据结构的场景中非常有用。

### 语法格式

```python
# 创建空元组
tuple()

# 从可迭代对象创建元组
tuple(iterable)
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| iterable | iterable | 否 | 无 | 可迭代对象（字符串、列表、集合等） |

### 返回值

- **类型**: tuple
- **说明**: 新创建的元组对象

## 💡 实际应用

### 基础用法

```python
# 创建空元组
empty_tuple = tuple()
print(f"空元组: {empty_tuple}")  # 输出: 空元组: ()
print(f"类型: {type(empty_tuple)}")  # 输出: 类型: <class 'tuple'>
print(f"长度: {len(empty_tuple)}")  # 输出: 长度: 0

# 等价的创建方式
empty_tuple2 = ()
print(f"字面量创建: {empty_tuple2}")  # 输出: 字面量创建: ()

# 从列表创建元组
list_data = [1, 2, 3, 4, 5]
list_to_tuple = tuple(list_data)
print(f"列表转元组: {list_to_tuple}")  # 输出: 列表转元组: (1, 2, 3, 4, 5)

# 从字符串创建元组
string_to_tuple = tuple("hello")
print(f"字符串转元组: {string_to_tuple}")  # 输出: 字符串转元组: ('h', 'e', 'l', 'l', 'o')

# 从集合创建元组
set_data = {3, 1, 4, 1, 5, 9, 2, 6}
set_to_tuple = tuple(set_data)
print(f"集合转元组: {set_to_tuple}")  # 输出: 集合转元组: (1, 2, 3, 4, 5, 6, 9) (顺序可能不同)

# 从range对象创建元组
range_to_tuple = tuple(range(5))
print(f"range转元组: {range_to_tuple}")  # 输出: range转元组: (0, 1, 2, 3, 4)

# 从字典创建元组（默认是键）
dict_data = {'a': 1, 'b': 2, 'c': 3}
dict_keys_to_tuple = tuple(dict_data)
print(f"字典键转元组: {dict_keys_to_tuple}")  # 输出: 字典键转元组: ('a', 'b', 'c')

# 字典值转元组
dict_values_to_tuple = tuple(dict_data.values())
print(f"字典值转元组: {dict_values_to_tuple}")  # 输出: 字典值转元组: (1, 2, 3)

# 字典项转元组
dict_items_to_tuple = tuple(dict_data.items())
print(f"字典项转元组: {dict_items_to_tuple}")  # 输出: 字典项转元组: (('a', 1), ('b', 2), ('c', 3))

# 单元素元组（注意逗号）
single_element = tuple([42])
print(f"单元素元组: {single_element}")  # 输出: 单元素元组: (42,)

# 字面量单元素元组
single_literal = (42,)  # 注意逗号
print(f"字面量单元素: {single_literal}")  # 输出: 字面量单元素: (42,)

# 不带逗号不是元组
not_tuple = (42)  # 这只是括号包围的整数
print(f"不是元组: {not_tuple}, 类型: {type(not_tuple)}")  # 输出: 不是元组: 42, 类型: <class 'int'>
```

### 元组的不可变性

```python
# 元组不可变性演示
original_tuple = (1, 2, 3, 4, 5)
print(f"原始元组: {original_tuple}")

# 尝试修改元组（会报错）
try:
    original_tuple[0] = 10
except TypeError as e:
    print(f"修改元组错误: {e}")

# 尝试删除元组元素（会报错）
try:
    del original_tuple[0]
except TypeError as e:
    print(f"删除元组元素错误: {e}")

# 尝试添加元素（会报错）
try:
    original_tuple.append(6)
except AttributeError as e:
    print(f"添加元素错误: {e}")

# 但可以重新赋值整个元组
original_tuple = (10, 20, 30)
print(f"重新赋值后: {original_tuple}")

# 元组连接（创建新元组）
tuple1 = (1, 2, 3)
tuple2 = (4, 5, 6)
combined = tuple1 + tuple2
print(f"元组连接: {tuple1} + {tuple2} = {combined}")

# 元组重复
repeated = tuple1 * 3
print(f"元组重复: {tuple1} * 3 = {repeated}")

# 包含可变对象的元组
mutable_content = ([1, 2], [3, 4])
print(f"包含列表的元组: {mutable_content}")

# 可以修改内部的可变对象
mutable_content[0].append(3)
print(f"修改内部列表后: {mutable_content}")

# 但不能替换元组中的元素
try:
    mutable_content[0] = [10, 20]
except TypeError as e:
    print(f"替换元组元素错误: {e}")
```

### 元组作为字典键

```python
# 元组可以作为字典键（因为不可变）
coordinate_data = {
    (0, 0): "原点",
    (1, 0): "x轴上的点",
    (0, 1): "y轴上的点",
    (1, 1): "对角线上的点"
}

print("坐标字典:")
for coord, description in coordinate_data.items():
    print(f"  {coord}: {description}")

# 查找特定坐标
point = (1, 1)
if point in coordinate_data:
    print(f"点 {point} 的描述: {coordinate_data[point]}")

# 复杂的元组键
student_grades = {
    ('张三', '数学'): 95,
    ('张三', '英语'): 87,
    ('李四', '数学'): 92,
    ('李四', '英语'): 89,
    ('王五', '数学'): 78,
    ('王五', '英语'): 94
}

print("\n学生成绩:")
for (name, subject), grade in student_grades.items():
    print(f"  {name} - {subject}: {grade}分")

# 按学生查询
student_name = '张三'
student_scores = {subject: grade for (name, subject), grade in student_grades.items() if name == student_name}
print(f"\n{student_name}的成绩: {student_scores}")

# 按科目查询
subject_name = '数学'
subject_scores = {name: grade for (name, subject), grade in student_grades.items() if subject == subject_name}
print(f"{subject_name}成绩: {subject_scores}")

# 列表不能作为字典键（因为可变）
try:
    invalid_dict = {[1, 2]: "value"}
except TypeError as e:
    print(f"\n列表作为键的错误: {e}")

# 但可以将列表转换为元组作为键
list_key = [1, 2, 3]
tuple_key = tuple(list_key)
valid_dict = {tuple_key: "这是有效的"}
print(f"元组键字典: {valid_dict}")
```

### 函数返回多个值

```python
# 函数返回元组（多个值）
def calculate_stats(numbers):
    """计算统计信息，返回多个值"""
    if not numbers:
        return 0, 0, 0, 0  # 返回元组
    
    total = sum(numbers)
    count = len(numbers)
    average = total / count
    maximum = max(numbers)
    minimum = min(numbers)
    
    return total, count, average, maximum, minimum  # 自动打包为元组

# 使用函数
test_numbers = [10, 20, 30, 40, 50]
result = calculate_stats(test_numbers)
print(f"统计结果（元组）: {result}")
print(f"结果类型: {type(result)}")

# 元组解包
total, count, avg, max_val, min_val = calculate_stats(test_numbers)
print(f"\n解包结果:")
print(f"  总和: {total}")
print(f"  数量: {count}")
print(f"  平均值: {avg:.2f}")
print(f"  最大值: {max_val}")
print(f"  最小值: {min_val}")

# 部分解包
total, count, *rest = calculate_stats(test_numbers)
print(f"\n部分解包:")
print(f"  总和: {total}")
print(f"  数量: {count}")
print(f"  其余: {rest}")

# 忽略某些值
total, _, avg, *_ = calculate_stats(test_numbers)
print(f"\n忽略部分值:")
print(f"  总和: {total}")
print(f"  平均值: {avg:.2f}")

# 命名元组（更好的选择）
from collections import namedtuple

Stats = namedtuple('Stats', ['total', 'count', 'average', 'maximum', 'minimum'])

def calculate_named_stats(numbers):
    """返回命名元组"""
    if not numbers:
        return Stats(0, 0, 0, 0, 0)
    
    total = sum(numbers)
    count = len(numbers)
    average = total / count
    maximum = max(numbers)
    minimum = min(numbers)
    
    return Stats(total, count, average, maximum, minimum)

# 使用命名元组
named_result = calculate_named_stats(test_numbers)
print(f"\n命名元组结果: {named_result}")
print(f"  总和: {named_result.total}")
print(f"  平均值: {named_result.average:.2f}")
print(f"  最大值: {named_result.maximum}")
```

### 数据结构和算法应用

```python
# 坐标和几何计算
def distance_between_points(point1, point2):
    """计算两点间距离"""
    x1, y1 = point1
    x2, y2 = point2
    return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5

# 定义点
points = [
    (0, 0),
    (3, 4),
    (1, 1),
    (5, 0),
    (2, 3)
]

print("点坐标:")
for i, point in enumerate(points):
    print(f"  点{i+1}: {point}")

# 计算所有点到原点的距离
origin = (0, 0)
distances = []
for point in points:
    dist = distance_between_points(origin, point)
    distances.append((point, dist))

print("\n到原点的距离:")
for point, dist in distances:
    print(f"  {point}: {dist:.2f}")

# 找最近和最远的点
closest = min(distances, key=lambda x: x[1])
farthest = max(distances, key=lambda x: x[1])
print(f"\n最近点: {closest[0]}, 距离: {closest[1]:.2f}")
print(f"最远点: {farthest[0]}, 距离: {farthest[1]:.2f}")

# 元组在排序中的应用
students = [
    ('Alice', 85, 20),
    ('Bob', 92, 19),
    ('Charlie', 78, 21),
    ('Diana', 96, 20),
    ('Eve', 89, 18)
]

print("\n学生信息 (姓名, 成绩, 年龄):")
for student in students:
    print(f"  {student}")

# 按成绩排序
by_score = sorted(students, key=lambda x: x[1], reverse=True)
print("\n按成绩排序:")
for name, score, age in by_score:
    print(f"  {name}: {score}分, {age}岁")

# 按年龄排序
by_age = sorted(students, key=lambda x: x[2])
print("\n按年龄排序:")
for name, score, age in by_age:
    print(f"  {name}: {score}分, {age}岁")

# 多条件排序：先按成绩降序，再按年龄升序
multi_sort = sorted(students, key=lambda x: (-x[1], x[2]))
print("\n多条件排序（成绩降序，年龄升序）:")
for name, score, age in multi_sort:
    print(f"  {name}: {score}分, {age}岁")
```

### 配置和常量定义

```python
# 使用元组定义配置常量
COLORS = (
    (255, 0, 0),    # 红色
    (0, 255, 0),    # 绿色
    (0, 0, 255),    # 蓝色
    (255, 255, 0),  # 黄色
    (255, 0, 255),  # 紫色
    (0, 255, 255),  # 青色
)

COLOR_NAMES = (
    '红色', '绿色', '蓝色', 
    '黄色', '紫色', '青色'
)

print("颜色配置:")
for i, (color, name) in enumerate(zip(COLORS, COLOR_NAMES)):
    print(f"  {name}: RGB{color}")

# 数据库连接配置
DATABASE_CONFIGS = (
    ('localhost', 5432, 'mydb', 'user1', 'pass1'),
    ('192.168.1.100', 5432, 'testdb', 'user2', 'pass2'),
    ('prod.example.com', 5432, 'proddb', 'user3', 'pass3'),
)

print("\n数据库配置:")
for i, (host, port, db, user, password) in enumerate(DATABASE_CONFIGS):
    print(f"  配置{i+1}: {host}:{port}/{db} (用户: {user})")

# 游戏中的方向定义
DIRECTIONS = (
    (0, 1),   # 上
    (1, 0),   # 右
    (0, -1),  # 下
    (-1, 0),  # 左
)

DIRECTION_NAMES = ('上', '右', '下', '左')

def move_player(position, direction_index):
    """移动玩家位置"""
    x, y = position
    dx, dy = DIRECTIONS[direction_index]
    return (x + dx, y + dy)

# 测试玩家移动
player_pos = (5, 5)
print(f"\n玩家初始位置: {player_pos}")

for i, direction_name in enumerate(DIRECTION_NAMES):
    new_pos = move_player(player_pos, i)
    print(f"  向{direction_name}移动: {new_pos}")

# HTTP状态码定义
HTTP_STATUS = (
    (200, 'OK'),
    (201, 'Created'),
    (400, 'Bad Request'),
    (401, 'Unauthorized'),
    (404, 'Not Found'),
    (500, 'Internal Server Error'),
)

print("\nHTTP状态码:")
for code, message in HTTP_STATUS:
    print(f"  {code}: {message}")

# 创建状态码字典
status_dict = dict(HTTP_STATUS)
print(f"\n状态码404的含义: {status_dict[404]}")
```

### 实际案例：数据分析

```python
def analyze_sales_by_region(sales_data):
    """按地区分析销售数据"""
    # 使用元组存储地区信息 (地区名, 销售额, 销售量)
    region_stats = []
    
    # 按地区分组
    regions = {}
    for record in sales_data:
        region = record['region']
        if region not in regions:
            regions[region] = []
        regions[region].append(record)
    
    # 计算每个地区的统计信息
    for region, records in regions.items():
        total_amount = sum(r['amount'] for r in records)
        total_quantity = sum(r['quantity'] for r in records)
        avg_price = total_amount / total_quantity if total_quantity > 0 else 0
        
        # 存储为元组
        region_stat = (region, total_amount, total_quantity, avg_price, len(records))
        region_stats.append(region_stat)
    
    # 按销售额排序
    region_stats.sort(key=lambda x: x[1], reverse=True)
    
    return tuple(region_stats)  # 返回元组，表示不可变的结果

# 测试销售数据
sales_records = [
    {'region': '北京', 'amount': 10000, 'quantity': 100, 'product': 'A'},
    {'region': '上海', 'amount': 15000, 'quantity': 120, 'product': 'B'},
    {'region': '广州', 'amount': 8000, 'quantity': 80, 'product': 'A'},
    {'region': '北京', 'amount': 12000, 'quantity': 90, 'product': 'C'},
    {'region': '上海', 'amount': 9000, 'quantity': 75, 'product': 'A'},
    {'region': '深圳', 'amount': 11000, 'quantity': 95, 'product': 'B'},
    {'region': '广州', 'amount': 7000, 'quantity': 70, 'product': 'C'},
]

analysis_result = analyze_sales_by_region(sales_records)

print("地区销售分析结果:")
print(f"{'地区':<8} {'销售额':<10} {'销售量':<8} {'平均价格':<10} {'订单数':<8}")
print("-" * 50)

for region, amount, quantity, avg_price, order_count in analysis_result:
    print(f"{region:<8} {amount:<10} {quantity:<8} {avg_price:<10.2f} {order_count:<8}")

# 提取特定信息
top_region = analysis_result[0]
print(f"\n销售额最高地区: {top_region[0]}，销售额: ¥{top_region[1]:,}")

# 计算总体统计
total_amount = sum(stat[1] for stat in analysis_result)
total_quantity = sum(stat[2] for stat in analysis_result)
overall_avg_price = total_amount / total_quantity

print(f"\n总体统计:")
print(f"  总销售额: ¥{total_amount:,}")
print(f"  总销售量: {total_quantity}")
print(f"  总体平均价格: ¥{overall_avg_price:.2f}")

# 地区排名
print(f"\n地区排名:")
for i, (region, amount, *_) in enumerate(analysis_result, 1):
    print(f"  第{i}名: {region} (¥{amount:,})")
```

### 缓存和记忆化

```python
# 使用元组作为缓存键
def memoize_with_tuple_key(func):
    """使用元组键的记忆化装饰器"""
    cache = {}
    
    def wrapper(*args, **kwargs):
        # 将参数转换为可哈希的键
        key = (args, tuple(sorted(kwargs.items())))
        
        if key not in cache:
            result = func(*args, **kwargs)
            cache[key] = result
            print(f"计算并缓存: {key} -> {result}")
        else:
            print(f"从缓存获取: {key} -> {cache[key]}")
        
        return cache[key]
    
    wrapper.cache = cache
    return wrapper

@memoize_with_tuple_key
def expensive_calculation(x, y, operation='add'):
    """模拟耗时计算"""
    import time
    time.sleep(0.1)  # 模拟计算时间
    
    if operation == 'add':
        return x + y
    elif operation == 'multiply':
        return x * y
    elif operation == 'power':
        return x ** y
    else:
        return 0

# 测试缓存
print("测试记忆化缓存:")
result1 = expensive_calculation(2, 3, operation='add')
result2 = expensive_calculation(2, 3, operation='add')  # 应该从缓存获取
result3 = expensive_calculation(2, 3, operation='multiply')
result4 = expensive_calculation(2, 3, operation='multiply')  # 应该从缓存获取

print(f"\n缓存内容:")
for key, value in expensive_calculation.cache.items():
    print(f"  {key} -> {value}")

# 斐波那契数列缓存
fib_cache = {}

def fibonacci_with_cache(n):
    """带缓存的斐波那契数列"""
    key = (n,)  # 使用元组作为键
    
    if key in fib_cache:
        return fib_cache[key]
    
    if n <= 1:
        result = n
    else:
        result = fibonacci_with_cache(n-1) + fibonacci_with_cache(n-2)
    
    fib_cache[key] = result
    return result

print(f"\n斐波那契数列:")
for i in range(10):
    fib_value = fibonacci_with_cache(i)
    print(f"  fib({i}) = {fib_value}")

print(f"\n斐波那契缓存大小: {len(fib_cache)}")
```

## ⚠️ 注意事项

### 性能比较

```python
import time
import sys

# 创建大量数据进行性能测试
n = 100000
test_data = list(range(n))

# 列表 vs 元组创建时间
start_time = time.time()
test_list = list(test_data)
list_time = time.time() - start_time

start_time = time.time()
test_tuple = tuple(test_data)
tuple_time = time.time() - start_time

print(f"创建时间比较（{n}个元素）:")
print(f"  列表创建: {list_time:.6f}秒")
print(f"  元组创建: {tuple_time:.6f}秒")
print(f"  元组快 {list_time/tuple_time:.2f} 倍")

# 内存使用比较
list_size = sys.getsizeof(test_list)
tuple_size = sys.getsizeof(test_tuple)

print(f"\n内存使用比较:")
print(f"  列表大小: {list_size:,} 字节")
print(f"  元组大小: {tuple_size:,} 字节")
print(f"  元组节省: {((list_size - tuple_size) / list_size * 100):.1f}%")

# 访问速度比较
import random
indices = [random.randint(0, n-1) for _ in range(1000)]

# 列表访问
start_time = time.time()
for i in indices:
    _ = test_list[i]
list_access_time = time.time() - start_time

# 元组访问
start_time = time.time()
for i in indices:
    _ = test_tuple[i]
tuple_access_time = time.time() - start_time

print(f"\n访问速度比较（1000次随机访问）:")
print(f"  列表访问: {list_access_time:.6f}秒")
print(f"  元组访问: {tuple_access_time:.6f}秒")
if tuple_access_time > 0:
    print(f"  元组快 {list_access_time/tuple_access_time:.2f} 倍")
```

### 元组的陷阱

```python
# 单元素元组的陷阱
print("单元素元组陷阱:")
not_tuple = (42)  # 这不是元组！
real_tuple = (42,)  # 这才是元组

print(f"(42) 的类型: {type(not_tuple)}")
print(f"(42,) 的类型: {type(real_tuple)}")

# 函数参数中的陷阱
def print_coordinates(point):
    """打印坐标点"""
    x, y = point  # 期望point是包含两个元素的元组
    print(f"坐标: ({x}, {y})")

# 正确用法
print_coordinates((3, 4))

# 错误用法
try:
    print_coordinates(3, 4)  # 传递了两个参数而不是一个元组
except TypeError as e:
    print(f"参数错误: {e}")

# 元组解包的陷阱
data = (1, 2, 3, 4, 5)

# 正确解包
a, b, c, d, e = data
print(f"完全解包: a={a}, b={b}, c={c}, d={d}, e={e}")

# 部分解包
first, *middle, last = data
print(f"部分解包: first={first}, middle={middle}, last={last}")

# 解包数量不匹配
try:
    x, y = data  # 试图将5个元素解包为2个变量
except ValueError as e:
    print(f"解包错误: {e}")

# 嵌套元组的修改陷阱
nested_tuple = ([1, 2], [3, 4])
print(f"嵌套元组: {nested_tuple}")

# 可以修改内部的可变对象
nested_tuple[0].append(3)
print(f"修改内部列表后: {nested_tuple}")

# 但不能替换元组中的元素
try:
    nested_tuple[0] = [10, 20]
except TypeError as e:
    print(f"替换元素错误: {e}")
```

### 类型转换注意事项

```python
# 字符串转元组
string_data = "hello"
char_tuple = tuple(string_data)
print(f"字符串转元组: {char_tuple}")

# 如果想要单个字符串元素的元组
single_string_tuple = (string_data,)
print(f"单字符串元组: {single_string_tuple}")

# 数字转元组（需要先转为可迭代对象）
number = 12345
try:
    digit_tuple = tuple(number)
except TypeError as e:
    print(f"数字直接转元组错误: {e}")

# 正确方式：先转为字符串
digit_tuple = tuple(str(number))
print(f"数字转元组: {digit_tuple}")

# 或者转为数字列表
digit_list_tuple = tuple(int(d) for d in str(number))
print(f"数字列表元组: {digit_list_tuple}")

# None值处理
try:
    none_tuple = tuple(None)
except TypeError as e:
    print(f"None转元组错误: {e}")

# 安全的元组转换函数
def safe_tuple_conversion(obj):
    """安全的元组转换"""
    if obj is None:
        return ()
    if isinstance(obj, (str, bytes)):
        return tuple(obj)
    try:
        return tuple(obj)
    except TypeError:
        return (obj,)  # 包装为单元素元组

# 测试安全转换
test_values = [None, "hello", [1, 2, 3], 42, (4, 5, 6), {7, 8, 9}]
print("\n安全转换测试:")
for value in test_values:
    result = safe_tuple_conversion(value)
    print(f"  {value} -> {result}")
```

### 元组与列表的选择

```python
# 何时使用元组 vs 列表的指导原则
print("元组 vs 列表选择指南:")
print("\n使用元组的场景:")
print("  1. 数据不需要修改（配置、常量）")
print("  2. 作为字典键")
print("  3. 函数返回多个值")
print("  4. 坐标、RGB值等固定结构")
print("  5. 性能要求高的场景")

print("\n使用列表的场景:")
print("  1. 数据需要修改（添加、删除、排序）")
print("  2. 数据量可能变化")
print("  3. 需要列表特有的方法（append、remove等）")
print("  4. 数据处理和分析")

# 实际示例对比
print("\n实际示例:")

# 配置数据 - 使用元组
DATABASE_CONFIG = ('localhost', 5432, 'mydb', 'user', 'password')
print(f"数据库配置（元组）: {DATABASE_CONFIG}")

# 购物车 - 使用列表
shopping_cart = ['苹果', '香蕉', '橙子']
shopping_cart.append('葡萄')  # 可以修改
print(f"购物车（列表）: {shopping_cart}")

# 坐标点 - 使用元组
point = (10, 20)
print(f"坐标点（元组）: {point}")

# 学生成绩 - 使用列表（可能需要修改）
student_scores = [85, 92, 78, 96]
student_scores.append(89)  # 添加新成绩
print(f"学生成绩（列表）: {student_scores}")

# RGB颜色 - 使用元组
red_color = (255, 0, 0)
print(f"红色RGB（元组）: {red_color}")

# 日志记录 - 使用列表（会不断添加）
log_entries = []
log_entries.append(('2024-01-15 10:00:00', 'INFO', '系统启动'))
log_entries.append(('2024-01-15 10:01:00', 'DEBUG', '连接数据库'))
print(f"日志记录（列表包含元组）: {log_entries}")
```

## 🔗 相关内容

### 相关函数
- [list() - 列表构造函数](list.md) - 创建列表
- [set() - 集合构造函数](set.md) - 创建集合
- [dict() - 字典构造函数](dict.md) - 创建字典
- [str() - 字符串构造函数](str.md) - 创建字符串
- [len() - 长度函数](len.md) - 获取长度
- [enumerate() - 枚举函数](enumerate.md) - 枚举索引

### 相关模块
- [collections模块](../stdlib/collections.md) - 容器数据类型
- [itertools模块](../stdlib/itertools.md) - 迭代工具
- [operator模块](../stdlib/operator.md) - 操作符函数
- [copy模块](../stdlib/copy.md) - 拷贝操作

### 相关概念
- [序列类型](../basics/sequence-types.md) - 序列操作
- [不可变对象](../basics/immutable-objects.md) - 不可变性
- [元组解包](../basics/tuple-unpacking.md) - 解包操作
- [命名元组](../advanced/named-tuples.md) - 结构化数据

## 📚 扩展阅读

- [Python官方文档 - tuple()](https://docs.python.org/3/library/functions.html#func-tuple)
- [Python官方文档 - 元组类型](https://docs.python.org/3/library/stdtypes.html#tuple)
- [序列类型操作](https://docs.python.org/3/library/stdtypes.html#sequence-types-list-tuple-range)
- [数据结构](https://docs.python.org/3/tutorial/datastructures.html)

## 🏷️ 标签

`类型转换` `容器` `序列` `不可变` `数据结构`

---

**最后更新**: 2024-01-15  
**作者**: Python文档工程师  
**版本**: 1.0