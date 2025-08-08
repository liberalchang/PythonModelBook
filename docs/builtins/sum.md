---
layout: doc
title: sum() - 求和函数
permalink: /docs/builtins/sum/
category: builtins
tags: [数学运算, 序列操作, 聚合]
description: 计算可迭代对象中数值的总和
author: Python文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: 初级
---

# sum() - 求和函数

## 📝 概述

`sum()` 是Python中的内置函数，用于计算可迭代对象中所有数值的总和。它是数据分析和数值计算中最常用的函数之一，支持整数、浮点数以及任何定义了加法运算的对象。

## 🎯 学习目标

- 掌握sum()函数的基本用法
- 理解start参数的作用
- 学会处理不同数据类型的求和
- 了解性能优化技巧

## 📋 前置知识

- Python基本数据类型
- 可迭代对象概念
- 算术运算符基础
- 列表推导式基础

## 🔍 详细内容

### 基本概念

`sum()` 函数通过加法运算符 `+` 累加可迭代对象中的所有元素。它从左到右依次相加，支持数值类型以及任何实现了 `__add__` 方法的对象。

### 语法格式

```python
sum(iterable, start=0)
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| iterable | iterable | 是 | 无 | 包含数值的可迭代对象 |
| start | number | 否 | 0 | 求和的起始值 |

### 返回值

- **类型**: 与元素类型相关的数值类型
- **说明**: 所有元素的总和加上起始值

## 💡 实际应用

### 基础用法

```python
# 整数列表求和
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(f"sum({numbers}) = {total}")  # 输出: sum([1, 2, 3, 4, 5]) = 15

# 浮点数求和
float_numbers = [1.5, 2.3, 3.7, 4.1]
float_total = sum(float_numbers)
print(f"浮点数求和: {float_total}")  # 输出: 浮点数求和: 11.6

# 元组求和
tuple_numbers = (10, 20, 30, 40)
tuple_total = sum(tuple_numbers)
print(f"元组求和: {tuple_total}")  # 输出: 元组求和: 100

# 生成器求和
gen_numbers = (x for x in range(1, 6))
gen_total = sum(gen_numbers)
print(f"生成器求和: {gen_total}")  # 输出: 生成器求和: 15

# 空序列求和
empty_sum = sum([])
print(f"空列表求和: {empty_sum}")  # 输出: 空列表求和: 0

# range对象求和
range_sum = sum(range(1, 11))  # 1到10的和
print(f"1到10的和: {range_sum}")  # 输出: 1到10的和: 55
```

### 使用start参数

```python
# 指定起始值
numbers = [1, 2, 3, 4, 5]
sum_with_start = sum(numbers, 10)
print(f"从10开始求和: {sum_with_start}")  # 输出: 从10开始求和: 25

# 负数起始值
sum_negative_start = sum(numbers, -5)
print(f"从-5开始求和: {sum_negative_start}")  # 输出: 从-5开始求和: 10

# 浮点数起始值
sum_float_start = sum(numbers, 2.5)
print(f"从2.5开始求和: {sum_float_start}")  # 输出: 从2.5开始求和: 17.5

# 复数起始值
complex_numbers = [1, 2, 3]
sum_complex_start = sum(complex_numbers, 1+2j)
print(f"复数起始值求和: {sum_complex_start}")  # 输出: 复数起始值求和: (7+2j)

# 实际应用：计算总价（含税）
prices = [19.99, 29.99, 39.99, 49.99]
tax_rate = 0.08
subtotal = sum(prices)
tax = subtotal * tax_rate
total_with_tax = sum(prices, tax)
print(f"商品价格: {prices}")
print(f"小计: ${subtotal:.2f}")
print(f"税费: ${tax:.2f}")
print(f"总计: ${total_with_tax:.2f}")
```

### 列表推导式与sum结合

```python
# 计算平方和
numbers = [1, 2, 3, 4, 5]
square_sum = sum(x**2 for x in numbers)
print(f"平方和: {square_sum}")  # 输出: 平方和: 55

# 条件求和
all_numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_sum = sum(x for x in all_numbers if x % 2 == 0)
odd_sum = sum(x for x in all_numbers if x % 2 == 1)
print(f"偶数和: {even_sum}")  # 输出: 偶数和: 30
print(f"奇数和: {odd_sum}")    # 输出: 奇数和: 25

# 嵌套列表求和
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
matrix_sum = sum(sum(row) for row in matrix)
print(f"矩阵总和: {matrix_sum}")  # 输出: 矩阵总和: 45

# 字典值求和
scores = {'Alice': 85, 'Bob': 92, 'Charlie': 78, 'Diana': 96}
total_score = sum(scores.values())
average_score = total_score / len(scores)
print(f"总分: {total_score}")
print(f"平均分: {average_score:.2f}")

# 复杂条件求和
students = [
    {'name': '张三', 'age': 20, 'score': 85, 'grade': 'A'},
    {'name': '李四', 'age': 19, 'score': 92, 'grade': 'A'},
    {'name': '王五', 'age': 21, 'score': 78, 'grade': 'B'},
    {'name': '赵六', 'age': 18, 'score': 88, 'grade': 'A'}
]

# A级学生总分
a_grade_total = sum(s['score'] for s in students if s['grade'] == 'A')
print(f"A级学生总分: {a_grade_total}")

# 成年学生总分
adult_total = sum(s['score'] for s in students if s['age'] >= 20)
print(f"成年学生总分: {adult_total}")

# 高分学生数量（使用布尔值求和）
high_score_count = sum(1 for s in students if s['score'] >= 85)
print(f"高分学生数量: {high_score_count}")
```

### 实际案例：财务数据分析

```python
def analyze_financial_data(transactions):
    """分析财务交易数据"""
    if not transactions:
        return {}
    
    # 总收入和支出
    total_income = sum(t['amount'] for t in transactions if t['amount'] > 0)
    total_expense = sum(abs(t['amount']) for t in transactions if t['amount'] < 0)
    net_income = sum(t['amount'] for t in transactions)
    
    # 按类别统计
    categories = {}
    for transaction in transactions:
        category = transaction['category']
        if category not in categories:
            categories[category] = 0
        categories[category] += transaction['amount']
    
    # 按月份统计
    monthly_totals = {}
    for transaction in transactions:
        month = transaction['date'][:7]  # YYYY-MM格式
        if month not in monthly_totals:
            monthly_totals[month] = 0
        monthly_totals[month] += transaction['amount']
    
    # 计算平均值
    avg_transaction = sum(t['amount'] for t in transactions) / len(transactions)
    avg_income = total_income / sum(1 for t in transactions if t['amount'] > 0) if total_income > 0 else 0
    avg_expense = total_expense / sum(1 for t in transactions if t['amount'] < 0) if total_expense > 0 else 0
    
    return {
        'total_income': total_income,
        'total_expense': total_expense,
        'net_income': net_income,
        'categories': categories,
        'monthly_totals': monthly_totals,
        'averages': {
            'transaction': avg_transaction,
            'income': avg_income,
            'expense': avg_expense
        },
        'transaction_count': len(transactions)
    }

# 测试财务数据
financial_transactions = [
    {'date': '2024-01-15', 'amount': 3000, 'category': '工资', 'description': '月薪'},
    {'date': '2024-01-16', 'amount': -800, 'category': '房租', 'description': '房租支付'},
    {'date': '2024-01-17', 'amount': -200, 'category': '食物', 'description': '超市购物'},
    {'date': '2024-01-18', 'amount': -50, 'category': '交通', 'description': '地铁卡充值'},
    {'date': '2024-01-20', 'amount': 500, 'category': '兼职', 'description': '周末兼职'},
    {'date': '2024-02-01', 'amount': -300, 'category': '娱乐', 'description': '看电影购物'},
    {'date': '2024-02-05', 'amount': 3000, 'category': '工资', 'description': '月薪'},
    {'date': '2024-02-10', 'amount': -150, 'category': '食物', 'description': '餐厅用餐'}
]

analysis = analyze_financial_data(financial_transactions)
print("财务分析报告:")
print(f"总收入: ¥{analysis['total_income']:.2f}")
print(f"总支出: ¥{analysis['total_expense']:.2f}")
print(f"净收入: ¥{analysis['net_income']:.2f}")
print(f"交易笔数: {analysis['transaction_count']}")
print(f"平均交易额: ¥{analysis['averages']['transaction']:.2f}")

print("\n按类别统计:")
for category, amount in analysis['categories'].items():
    print(f"  {category}: ¥{amount:.2f}")

print("\n按月份统计:")
for month, total in analysis['monthly_totals'].items():
    print(f"  {month}: ¥{total:.2f}")
```

### 数学计算应用

```python
import math

def calculate_statistics(data):
    """计算基本统计量"""
    if not data:
        return None
    
    n = len(data)
    total = sum(data)
    mean = total / n
    
    # 方差和标准差
    variance = sum((x - mean) ** 2 for x in data) / n
    std_dev = math.sqrt(variance)
    
    # 样本方差和标准差
    sample_variance = sum((x - mean) ** 2 for x in data) / (n - 1) if n > 1 else 0
    sample_std_dev = math.sqrt(sample_variance) if n > 1 else 0
    
    return {
        'count': n,
        'sum': total,
        'mean': mean,
        'variance': variance,
        'std_dev': std_dev,
        'sample_variance': sample_variance,
        'sample_std_dev': sample_std_dev
    }

def weighted_average(values, weights):
    """计算加权平均值"""
    if len(values) != len(weights):
        raise ValueError("值和权重的数量必须相等")
    
    weighted_sum = sum(v * w for v, w in zip(values, weights))
    weight_sum = sum(weights)
    
    return weighted_sum / weight_sum if weight_sum != 0 else 0

def moving_average(data, window_size):
    """计算移动平均值"""
    if window_size > len(data):
        return []
    
    moving_averages = []
    for i in range(len(data) - window_size + 1):
        window = data[i:i + window_size]
        avg = sum(window) / window_size
        moving_averages.append(avg)
    
    return moving_averages

def cumulative_sum(data):
    """计算累积和"""
    cumsum = []
    running_total = 0
    for value in data:
        running_total += value
        cumsum.append(running_total)
    return cumsum

# 测试数据
test_data = [10, 15, 20, 25, 30, 35, 40, 45, 50]

# 基本统计
stats = calculate_statistics(test_data)
print("基本统计量:")
for key, value in stats.items():
    print(f"  {key}: {value:.4f}")

# 加权平均
scores = [85, 90, 78, 92, 88]
weights = [0.2, 0.3, 0.1, 0.25, 0.15]
weighted_avg = weighted_average(scores, weights)
print(f"\n加权平均分: {weighted_avg:.2f}")

# 移动平均
stock_prices = [100, 102, 98, 105, 103, 107, 104, 109, 106, 111]
ma_3 = moving_average(stock_prices, 3)
print(f"\n股价: {stock_prices}")
print(f"3日移动平均: {[f'{x:.2f}' for x in ma_3]}")

# 累积和
daily_sales = [120, 150, 180, 200, 175, 190, 210]
cumsum = cumulative_sum(daily_sales)
print(f"\n每日销售: {daily_sales}")
print(f"累积销售: {cumsum}")
print(f"总销售额: {sum(daily_sales)}")
```

### 字符串和序列操作

```python
# 字符串不能直接用sum（会报错）
try:
    result = sum(['hello', 'world'])
except TypeError as e:
    print(f"字符串求和错误: {e}")

# 正确的字符串连接方式
strings = ['hello', ' ', 'world', '!']
concatenated = ''.join(strings)  # 推荐方式
print(f"字符串连接: '{concatenated}'")

# 使用sum连接字符串（不推荐，性能差）
# concatenated_sum = sum(strings, '')  # 这会报错

# 但可以用于其他可相加的对象
lists = [[1, 2], [3, 4], [5, 6]]
flattened = sum(lists, [])
print(f"列表展平: {flattened}")

# 更好的列表展平方式
from itertools import chain
flattened_better = list(chain.from_iterable(lists))
print(f"更好的展平: {flattened_better}")

# 集合操作
sets = [{1, 2}, {2, 3}, {3, 4}]
union_set = sum(sets, set())  # 求并集
print(f"集合并集: {union_set}")

# 计数器操作
from collections import Counter
counters = [Counter('hello'), Counter('world'), Counter('python')]
total_counter = sum(counters, Counter())
print(f"计数器求和: {total_counter}")

# 自定义对象的求和
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    
    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

vectors = [Vector(1, 2), Vector(3, 4), Vector(5, 6)]
vector_sum = sum(vectors, Vector(0, 0))
print(f"向量求和: {vector_sum}")
```

## ⚠️ 注意事项

### 数据类型兼容性

```python
# 混合数据类型
mixed_numbers = [1, 2.5, 3, 4.7]
mixed_sum = sum(mixed_numbers)
print(f"混合类型求和: {mixed_sum}, 类型: {type(mixed_sum)}")

# 布尔值求和（True=1, False=0）
bool_values = [True, False, True, True, False]
bool_sum = sum(bool_values)
print(f"布尔值求和: {bool_sum}")  # 输出: 3

# 复数求和
complex_numbers = [1+2j, 3+4j, 5+6j]
complex_sum = sum(complex_numbers)
print(f"复数求和: {complex_sum}")

# 不兼容的类型
try:
    incompatible = [1, '2', 3]
    result = sum(incompatible)
except TypeError as e:
    print(f"类型不兼容: {e}")
```

### 浮点数精度问题

```python
# 浮点数精度问题
float_list = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
float_sum = sum(float_list)
print(f"浮点数求和: {float_sum}")
print(f"是否等于1.0: {float_sum == 1.0}")
print(f"差值: {abs(float_sum - 1.0)}")

# 使用decimal模块提高精度
from decimal import Decimal
decimal_list = [Decimal('0.1')] * 10
decimal_sum = sum(decimal_list)
print(f"Decimal求和: {decimal_sum}")
print(f"是否等于1.0: {decimal_sum == Decimal('1.0')}")

# 使用fractions模块
from fractions import Fraction
fraction_list = [Fraction(1, 10)] * 10
fraction_sum = sum(fraction_list)
print(f"Fraction求和: {fraction_sum}")
print(f"转换为浮点数: {float(fraction_sum)}")
```

### 性能优化

```python
import time
import numpy as np

# 生成大量测试数据
large_data = list(range(1000000))

# 方法1：内置sum函数
start_time = time.time()
result1 = sum(large_data)
time1 = time.time() - start_time

# 方法2：手动循环
start_time = time.time()
total = 0
for num in large_data:
    total += num
result2 = total
time2 = time.time() - start_time

# 方法3：numpy数组（如果可用）
try:
    np_array = np.array(large_data)
    start_time = time.time()
    result3 = np.sum(np_array)
    time3 = time.time() - start_time
    
    print(f"性能比较（数据量: {len(large_data)}）:")
    print(f"内置sum(): {time1:.6f}秒, 结果: {result1}")
    print(f"手动循环: {time2:.6f}秒, 结果: {result2}")
    print(f"numpy.sum(): {time3:.6f}秒, 结果: {result3}")
    print(f"numpy快 {time1/time3:.2f} 倍")
except ImportError:
    print(f"性能比较（数据量: {len(large_data)}）:")
    print(f"内置sum(): {time1:.6f}秒, 结果: {result1}")
    print(f"手动循环: {time2:.6f}秒, 结果: {result2}")

# 内存优化：使用生成器
def large_number_generator(n):
    """生成大量数字的生成器"""
    for i in range(n):
        yield i

# 生成器求和（内存友好）
start_time = time.time()
gen_sum = sum(large_number_generator(1000000))
time_gen = time.time() - start_time
print(f"生成器求和: {time_gen:.6f}秒, 结果: {gen_sum}")
```

### 边界情况处理

```python
# 空序列
empty_sum = sum([])
print(f"空列表求和: {empty_sum}")

# 单元素序列
single_sum = sum([42])
print(f"单元素求和: {single_sum}")

# 包含零的序列
with_zeros = [1, 0, 2, 0, 3]
zero_sum = sum(with_zeros)
print(f"包含零的求和: {zero_sum}")

# 负数求和
negative_numbers = [-1, -2, -3, -4, -5]
negative_sum = sum(negative_numbers)
print(f"负数求和: {negative_sum}")

# 极大数值
large_numbers = [10**100, 10**100, 10**100]
large_sum = sum(large_numbers)
print(f"极大数求和: {large_sum}")

# 无穷大
inf_numbers = [float('inf'), 1, 2, 3]
inf_sum = sum(inf_numbers)
print(f"包含无穷大的求和: {inf_sum}")

# NaN值
nan_numbers = [1, 2, float('nan'), 4]
nan_sum = sum(nan_numbers)
print(f"包含NaN的求和: {nan_sum}")
```

## 🔗 相关内容

### 相关函数
- [min() - 最小值函数](min/) - 找最小值
- [max() - 最大值函数](max/) - 找最大值
- [len() - 长度函数](len/) - 获取长度
- [abs() - 绝对值函数](abs/) - 绝对值计算
- [round() - 四舍五入函数](round/) - 数值舍入
- [pow() - 幂运算函数](pow/) - 幂运算

### 相关模块
- [math模块](../stdlib/math/) - 数学函数
- [statistics模块](../stdlib/statistics/) - 统计函数
- [decimal模块](../stdlib/decimal/) - 精确小数
- [fractions模块](../stdlib/fractions/) - 分数运算
- [numpy模块](../third-party/numpy/) - 数值计算

### 相关概念
- [算术运算符](../basics/arithmetic-operators/) - 数学运算
- [生成器表达式](../advanced/generator-expressions/) - 内存优化
- [列表推导式](../basics/list-comprehensions/) - 数据处理
- [浮点数精度](../advanced/floating-point-precision/) - 精度问题

## 📚 扩展阅读

- [Python官方文档 - sum()](https://docs.python.org/3/library/functions.html#sum)
- [浮点数算术](https://docs.python.org/3/tutorial/floatingpoint.html)
- [数值类型](https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex)
- [decimal模块文档](https://docs.python.org/3/library/decimal.html)

## 🏷️ 标签

`数学运算` `序列操作` `聚合` `统计` `数值计算`

---

**最后更新**: 2024-01-15  
**作者**: Python文档工程师  
**版本**: 1.0