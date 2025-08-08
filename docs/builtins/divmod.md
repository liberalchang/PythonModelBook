---
layout: doc
title: divmod() - 除法和取模运算函数
permalink: /docs/builtins/divmod/
category: builtins
tags: [数学运算, 除法, 取模, 商和余数]
description: 同时返回除法的商和余数的内置函数
author: Python 文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "初级"
---

# divmod() - 除法和取模运算函数

## 📝 概述

`divmod()` 是 Python 中用于同时执行除法和取模运算的内置函数。它接受两个数字参数，返回一个包含商和余数的元组。这个函数在需要同时获取除法结果和余数时非常有用，比整除运算符 `//` 和取模运算符 `%` 分别计算更加高效。

## 🎯 学习目标

- 掌握 divmod()函数的基本语法和用法
- 理解除法和取模运算的数学原理
- 学会在实际编程中应用 divmod()函数
- 了解 divmod()与//和%运算符的关系和性能差异
- 掌握在时间计算、进制转换等场景中的应用

## 📋 前置知识

- Python 基本数据类型（整数、浮点数）
- 数学基础（除法、取模概念）
- 基本的算术运算符
- 元组的基本使用

## 🔍 详细内容

### 基本概念

`divmod()` 函数实现了欧几里得除法，对于两个数字 a 和 b，返回 (q, r)，其中 q 是商，r 是余数，满足等式：a = b * q + r，且 0 ≤ |r| < |b|。

### 语法格式

```python
divmod(a, b)
```

### 参数说明

| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|---------|
| a | number | 是 | 被除数 |
| b | number | 是 | 除数（不能为 0） |

### 返回值

- **返回类型**: tuple
- **返回内容**: (商, 余数) 的二元组
- **等价关系**: divmod(a, b) 等价于 (a // b, a % b)

## 💡 实际应用

### 基础除法和取模运算

```python
## 基础除法和取模运算示例
print("基础除法和取模运算示例:")

## 1. 基本整数运算
print("\n1. 基本整数运算:")

basic_cases = [
    (17, 5),    # 17 ÷ 5 = 3 余 2
    (20, 3),    # 20 ÷ 3 = 6 余 2
    (100, 7),   # 100 ÷ 7 = 14 余 2
    (50, 10),   # 50 ÷ 10 = 5 余 0
    (7, 3),     # 7 ÷ 3 = 2 余 1
]

for a, b in basic_cases:
    quotient, remainder = divmod(a, b)
    
#    # 验证结果
    verification = b * quotient + remainder
    
    print(f"divmod({a}, {b}) = ({quotient}, {remainder})")
    print(f"验证: {b} × {quotient} + {remainder} = {verification} {'✓' if verification == a else '✗'}")
    
#    # 与运算符比较
    op_quotient = a // b
    op_remainder = a % b
    print(f"运算符: {a} // {b} = {op_quotient}, {a} % {b} = {op_remainder}")
    print(f"结果一致: {(quotient, remainder) == (op_quotient, op_remainder)}")
    print()

## 2. 负数运算
print("2. 负数运算:")

negative_cases = [
    (-17, 5),   # 负被除数
    (17, -5),   # 负除数
    (-17, -5),  # 双负数
    (-20, 3),   # 负被除数,正除数
    (20, -3),   # 正被除数,负除数
]

for a, b in negative_cases:
    quotient, remainder = divmod(a, b)
    verification = b * quotient + remainder
    
    print(f"divmod({a}, {b}) = ({quotient}, {remainder})")
    print(f"验证: {b} × {quotient} + {remainder} = {verification} {'✓' if verification == a else '✗'}")
    
#    # 余数符号规则说明
    if remainder != 0:
        print(f"余数符号与除数一致: {remainder} 与 {b} 同号" if (remainder > 0) == (b > 0) else f"余数符号规则异常")
    print()

## 3. 浮点数运算
print("3. 浮点数运算:")

float_cases = [
    (17.5, 3.2),    # 浮点数除法
    (10.7, 2.1),    # 小数运算
    (100.0, 7.0),   # 整数形式的浮点数
    (15.75, 2.5),   # 精确除法
    (22.3, 4.7),    # 不精确除法
]

for a, b in float_cases:
    quotient, remainder = divmod(a, b)
    verification = b * quotient + remainder
    
    print(f"divmod({a}, {b}) = ({quotient:.6f}, {remainder:.6f})")
    print(f"验证: {b} × {quotient:.6f} + {remainder:.6f} = {verification:.6f}")
    print(f"误差: {abs(verification - a):.10f}")
    print()

## 4. 特殊值处理
print("4. 特殊值处理:")

special_cases = [
    (0, 5),         # 零被除数
    (10, 1),        # 除数为 1
    (10, 10),       # 相等的数
    (5, 10),        # 被除数小于除数
]

for a, b in special_cases:
    quotient, remainder = divmod(a, b)
    print(f"divmod({a}, {b}) = ({quotient}, {remainder})")
    
    if a == 0:
        print("  零被除数的结果总是 (0, 0)")
    elif b == 1:
        print(f"  除数为 1 时,商等于被除数,余数为 0")
    elif a == b:
        print(f"  相等数字的除法结果为 (1, 0)")
    elif a < b and a >= 0 and b > 0:
        print(f"  被除数小于除数时,商为 0,余数等于被除数")
    print()

## 5. 错误处理
print("5. 错误处理:")

error_cases = [
    (10, 0),        # 除零错误
    (0, 0),         # 零除零
    (float('inf'), 5),  # 无穷大
    (5, float('inf')),  # 除以无穷大
    (float('nan'), 5),  # NaN
]

for a, b in error_cases:
    try:
        result = divmod(a, b)
        print(f"divmod({a}, {b}) = {result}")
    except Exception as e:
        print(f"divmod({a}, {b}) 错误: {type(e).__name__}: {e}")
```

### 时间和日期计算

```python
## 时间和日期计算应用
print("时间和日期计算应用:")

## 1. 秒数转换为时分秒
print("\n1. 秒数转换为时分秒:")

def seconds_to_hms(total_seconds):
    """将总秒数转换为时:分:秒格式"""
    hours, remainder = divmod(total_seconds, 3600)  # 1 小时 = 3600 秒
    minutes, seconds = divmod(remainder, 60)        # 1 分钟 = 60 秒
    return int(hours), int(minutes), int(seconds)

## 测试不同的秒数
test_seconds = [3661, 7200, 3725, 86400, 90061, 123456]

for total_sec in test_seconds:
    h, m, s = seconds_to_hms(total_sec)
    print(f"{total_sec}秒 = {h}小时 {m}分钟 {s}秒")
    
#    # 验证转换
    verification = h * 3600 + m * 60 + s
    print(f"验证: {h}×3600 + {m}×60 + {s} = {verification} {'✓' if verification == total_sec else '✗'}")
    print()

## 2. 分钟转换为小时和分钟
print("2. 分钟转换为小时和分钟:")

def minutes_to_hm(total_minutes):
    """将总分钟数转换为小时:分钟格式"""
    hours, minutes = divmod(total_minutes, 60)
    return int(hours), int(minutes)

test_minutes = [90, 150, 480, 1440, 2000]

for total_min in test_minutes:
    h, m = minutes_to_hm(total_min)
    print(f"{total_min}分钟 = {h}小时 {m}分钟")

## 3. 天数转换为年月日(简化版)
print("\n3. 天数转换为年月日(简化版):")

def days_to_ymd(total_days):
    """将总天数转换为年月日(简化计算,不考虑闰年)"""
    years, remainder = divmod(total_days, 365)
    months, days = divmod(remainder, 30)  # 简化:每月 30 天
    return int(years), int(months), int(days)

test_days = [400, 1000, 2000, 3650]

for total_day in test_days:
    y, m, d = days_to_ymd(total_day)
    print(f"{total_day}天 ≈ {y}年 {m}月 {d}天(简化计算)")

## 4. 工作时间计算
print("\n4. 工作时间计算:")

def work_time_breakdown(total_minutes):
    """工作时间分解(8 小时工作日)"""
#    # 一个工作日 = 8 小时 = 480 分钟
    work_days, remainder = divmod(total_minutes, 480)
    work_hours, work_minutes = divmod(remainder, 60)
    
    return int(work_days), int(work_hours), int(work_minutes)

work_scenarios = [
    (500, "加班 20 分钟"),
    (960, "两个工作日"),
    (1200, "2.5 个工作日"),
    (2400, "一周工作时间"),
]

for minutes, description in work_scenarios:
    days, hours, mins = work_time_breakdown(minutes)
    print(f"{description}: {minutes}分钟 = {days}个工作日 {hours}小时 {mins}分钟")

## 5. 时区转换辅助
print("\n5. 时区转换辅助:")

def timezone_offset_to_hm(offset_minutes):
    """时区偏移分钟数转换为±小时:分钟格式"""
    sign = '+' if offset_minutes >= 0 else '-'
    abs_offset = abs(offset_minutes)
    hours, minutes = divmod(abs_offset, 60)
    return f"{sign}{hours:02d}:{minutes:02d}"

## 常见时区偏移(相对于 UTC 的分钟数)
timezone_offsets = [
    (480, "北京时间 UTC+8"),
    (-300, "美国东部时间 UTC-5"),
    (330, "印度标准时间 UTC+5:30"),
    (-480, "美国太平洋时间 UTC-8"),
    (0, "格林威治时间 UTC+0"),
    (570, "澳大利亚阿德莱德 UTC+9:30"),
]

for offset, description in timezone_offsets:
    formatted_offset = timezone_offset_to_hm(offset)
    print(f"{description}: {formatted_offset}")
```

### 进制转换和数学应用

```python
## 进制转换和数学应用
print("进制转换和数学应用:")

## 1. 十进制转任意进制
print("\n1. 十进制转任意进制:")

def decimal_to_base(number, base):
    """将十进制数转换为指定进制"""
    if number == 0:
        return "0"
    
    digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    result = []
    
    while number > 0:
        number, remainder = divmod(number, base)
        result.append(digits[remainder])
    
    return ''.join(reversed(result))

## 测试不同进制转换
test_numbers = [255, 1000, 42, 16, 100]
bases = [2, 8, 16, 36]

print("十进制数转换为不同进制:")
for num in test_numbers:
    print(f"\n 十进制 {num}:")
    for base in bases:
        converted = decimal_to_base(num, base)
        print(f"  {base}进制: {converted}")
        
#        # 验证转换(对于常见进制)
        if base == 2:
            verification = bin(num)[2:]  # 去掉'0b'前缀
            print(f"    验证: bin({num}) = {verification} {'✓' if converted == verification else '✗'}")
        elif base == 8:
            verification = oct(num)[2:]  # 去掉'0o'前缀
            print(f"    验证: oct({num}) = {verification} {'✓' if converted == verification else '✗'}")
        elif base == 16:
            verification = hex(num)[2:].upper()  # 去掉'0x'前缀并转大写
            print(f"    验证: hex({num}) = {verification} {'✓' if converted == verification else '✗'}")

## 2. 分数化简
print("\n2. 分数化简:")

def gcd(a, b):
    """计算最大公约数(欧几里得算法)"""
    while b:
        a, b = b, a % b
    return a

def simplify_fraction(numerator, denominator):
    """化简分数"""
#    # 使用最大公约数化简
    common_divisor = gcd(abs(numerator), abs(denominator))
    simplified_num = numerator // common_divisor
    simplified_den = denominator // common_divisor
    
#    # 确保分母为正
    if simplified_den < 0:
        simplified_num = -simplified_num
        simplified_den = -simplified_den
    
    return simplified_num, simplified_den

## 测试分数化简
fractions = [
    (12, 18),   # 12/18 = 2/3
    (15, 25),   # 15/25 = 3/5
    (100, 150), # 100/150 = 2/3
    (7, 21),    # 7/21 = 1/3
    (24, 36),   # 24/36 = 2/3
    (-8, 12),   # -8/12 = -2/3
]

print("分数化简:")
for num, den in fractions:
    simplified_num, simplified_den = simplify_fraction(num, den)
    gcd_value = gcd(abs(num), abs(den))
    
    print(f"{num}/{den} = {simplified_num}/{simplified_den}")
    print(f"  最大公约数: {gcd_value}")
    print(f"  化简过程: {num}÷{gcd_value} = {num//gcd_value}, {den}÷{gcd_value} = {den//gcd_value}")
    print()

## 3. 欧几里得算法的详细过程
print("3. 欧几里得算法详细过程:")

def extended_gcd_steps(a, b):
    """显示欧几里得算法的详细步骤"""
    print(f"计算 gcd({a}, {b}):")
    original_a, original_b = a, b
    step = 1
    
    while b != 0:
        quotient, remainder = divmod(a, b)
        print(f"  步骤{step}: {a} = {b} × {quotient} + {remainder}")
        a, b = b, remainder
        step += 1
    
    print(f"  结果: gcd({original_a}, {original_b}) = {a}")
    return a

## 演示欧几里得算法
gcd_examples = [(48, 18), (1071, 462), (252, 105)]

for a, b in gcd_examples:
    result = extended_gcd_steps(a, b)
    print()

## 4. 数字分解
print("4. 数字分解应用:")

def money_breakdown(amount_cents):
    """将金额(分)分解为不同面额"""
#    # 面额(分):100 元、50 元、20 元、10 元、5 元、1 元、5 角、1 角、5 分、1 分
    denominations = [10000, 5000, 2000, 1000, 500, 100, 50, 10, 5, 1]
    denomination_names = ['100 元', '50 元', '20 元', '10 元', '5 元', '1 元', '5 角', '1 角', '5 分', '1 分']
    
    breakdown = []
    remaining = amount_cents
    
    for i, denom in enumerate(denominations):
        count, remaining = divmod(remaining, denom)
        if count > 0:
            breakdown.append((denomination_names[i], count))
    
    return breakdown

## 测试金额分解
test_amounts = [12345, 6789, 999, 10050]  # 单位:分

print("金额分解:")
for amount in test_amounts:
    yuan = amount / 100
    breakdown = money_breakdown(amount)
    
    print(f"\n{yuan:.2f}元 ({amount}分) 的最优分解:")
    for denom_name, count in breakdown:
        print(f"  {denom_name}: {count}张/个")
    
#    # 验证分解结果
    total_check = 0
    denominations = [10000, 5000, 2000, 1000, 500, 100, 50, 10, 5, 1]
    for i, (denom_name, count) in enumerate(breakdown):
        total_check += denominations[i] * count
    
    print(f"  验证: 总计 {total_check}分 {'✓' if total_check == amount else '✗'}")

## 5. 坐标系转换
print("\n5. 坐标系应用:")

def linear_index_to_2d(index, width):
    """将一维索引转换为二维坐标"""
    row, col = divmod(index, width)
    return row, col

def coord_2d_to_linear(row, col, width):
    """将二维坐标转换为一维索引"""
    return row * width + col

## 测试坐标转换(例如:8x8 棋盘)
board_width = 8
test_indices = [0, 7, 8, 15, 63, 35, 42]

print(f"一维索引与二维坐标转换({board_width}x{board_width}网格):")
for index in test_indices:
    row, col = linear_index_to_2d(index, board_width)
    back_to_index = coord_2d_to_linear(row, col, board_width)
    
    print(f"索引 {index} → 坐标 ({row}, {col}) → 索引 {back_to_index} {'✓' if back_to_index == index else '✗'}")

## 6. 分页计算
print("\n6. 分页计算:")

def calculate_pagination(total_items, items_per_page):
    """计算分页信息"""
    total_pages, remaining_items = divmod(total_items, items_per_page)
    
#    # 如果有剩余项目,需要额外一页
    if remaining_items > 0:
        total_pages += 1
    
    return total_pages, remaining_items

def get_page_items(total_items, items_per_page, page_number):
    """获取指定页面的项目范围"""
    start_index = (page_number - 1) * items_per_page
    end_index = min(start_index + items_per_page, total_items)
    return start_index, end_index

## 测试分页计算
pagination_tests = [
    (100, 10),  # 100 个项目,每页 10 个
    (97, 10),   # 97 个项目,每页 10 个
    (50, 7),    # 50 个项目,每页 7 个
    (1000, 25), # 1000 个项目,每页 25 个
]

print("分页计算:")
for total, per_page in pagination_tests:
    total_pages, remaining = calculate_pagination(total, per_page)
    
    print(f"\n 总项目: {total}, 每页: {per_page}")
    print(f"总页数: {total_pages}")
    print(f"最后一页项目数: {remaining if remaining > 0 else per_page}")
    
#    # 显示前几页和最后一页的项目范围
    pages_to_show = [1, 2, total_pages] if total_pages > 2 else list(range(1, total_pages + 1))
    for page in pages_to_show:
        start, end = get_page_items(total, per_page, page)
        item_count = end - start
        print(f"  第{page}页: 项目 {start+1}-{end} (共{item_count}个)")
```

### 算法和数据结构应用

```python
## 算法和数据结构应用
print("算法和数据结构应用:")

## 1. 哈希表实现中的应用
print("\n1. 哈希表索引计算:")

class SimpleHashTable:
    """简单哈希表实现"""
    
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]  # 使用链表解决冲突
    
    def _hash(self, key):
        """简单哈希函数"""
        if isinstance(key, str):
            hash_value = sum(ord(c) for c in key)
        else:
            hash_value = hash(key)
        
#        # 使用 divmod 确保索引在有效范围内
        _, index = divmod(abs(hash_value), self.size)
        return index
    
    def put(self, key, value):
        """插入键值对"""
        index = self._hash(key)
        bucket = self.table[index]
        
#        # 检查是否已存在该键
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)  # 更新值
                return
        
#        # 添加新的键值对
        bucket.append((key, value))
    
    def get(self, key):
        """获取值"""
        index = self._hash(key)
        bucket = self.table[index]
        
        for k, v in bucket:
            if k == key:
                return v
        
        raise KeyError(key)
    
    def display(self):
        """显示哈希表内容"""
        for i, bucket in enumerate(self.table):
            if bucket:
                print(f"  索引 {i}: {bucket}")

## 测试哈希表
ht = SimpleHashTable(7)
test_data = [
    ("apple", 1),
    ("banana", 2),
    ("cherry", 3),
    ("date", 4),
    ("elderberry", 5),
    (123, "number key"),
    ("apple", 10),  # 更新已存在的键
]

print("哈希表操作:")
for key, value in test_data:
    index = ht._hash(key)
    print(f"插入 ({key}, {value}) → 哈希索引: {index}")
    ht.put(key, value)

print("\n 哈希表内容:")
ht.display()

## 2. 循环数组索引
print("\n2. 循环数组索引:")

class CircularArray:
    """循环数组实现"""
    
    def __init__(self, size):
        self.size = size
        self.array = [None] * size
        self.start = 0  # 起始位置
        self.count = 0  # 当前元素数量
    
    def add(self, item):
        """添加元素"""
        if self.count < self.size:
#            # 数组未满,直接添加
            index = (self.start + self.count) % self.size
            self.array[index] = item
            self.count += 1
        else:
#            # 数组已满,覆盖最旧的元素
            self.array[self.start] = item
            self.start = (self.start + 1) % self.size
    
    def get(self, logical_index):
        """根据逻辑索引获取元素"""
        if logical_index >= self.count:
            raise IndexError("Index out of range")
        
#        # 使用 divmod 计算实际物理索引
        _, physical_index = divmod(self.start + logical_index, self.size)
        return self.array[physical_index]
    
    def display(self):
        """显示数组状态"""
        print(f"  大小: {self.size}, 元素数: {self.count}, 起始位置: {self.start}")
        print(f"  物理数组: {self.array}")
        if self.count > 0:
            logical_view = [self.get(i) for i in range(self.count)]
            print(f"  逻辑视图: {logical_view}")

## 测试循环数组
circ_array = CircularArray(5)
test_items = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

print("循环数组操作:")
for i, item in enumerate(test_items):
    print(f"\n 添加元素 '{item}':")
    circ_array.add(item)
    circ_array.display()

## 3. 时间轮算法
print("\n3. 时间轮算法模拟:")

class TimeWheel:
    """简单时间轮实现"""
    
    def __init__(self, slots=60):
        self.slots = slots  # 时间槽数量(例如 60 秒)
        self.wheel = [[] for _ in range(slots)]
        self.current_time = 0
    
    def add_task(self, delay, task):
        """添加延时任务"""
#        # 计算任务应该放在哪个槽中
        target_time = self.current_time + delay
        _, slot_index = divmod(target_time, self.slots)
        
#        # 计算需要转多少圈
        rounds, _ = divmod(delay, self.slots)
        
        self.wheel[slot_index].append({
            'task': task,
            'rounds': rounds,
            'target_time': target_time
        })
        
        print(f"任务 '{task}' 延时 {delay}秒,放入槽 {slot_index},需等待 {rounds} 圈")
    
    def tick(self):
        """时间前进一秒"""
        current_slot = self.current_time % self.slots
        tasks_to_execute = []
        remaining_tasks = []
        
#        # 检查当前槽中的任务
        for task_info in self.wheel[current_slot]:
            if task_info['rounds'] == 0:
                tasks_to_execute.append(task_info['task'])
            else:
                task_info['rounds'] -= 1
                remaining_tasks.append(task_info)
        
#        # 更新当前槽
        self.wheel[current_slot] = remaining_tasks
        
#        # 执行到期任务
        if tasks_to_execute:
            print(f"时间 {self.current_time}: 执行任务 {tasks_to_execute}")
        
        self.current_time += 1
        return tasks_to_execute

## 测试时间轮
time_wheel = TimeWheel(10)  # 10 个时间槽

## 添加一些任务
tasks = [
    (3, "任务 A"),
    (7, "任务 B"),
    (15, "任务 C"),  # 需要转 1 圈多
    (25, "任务 D"),  # 需要转 2 圈多
    (5, "任务 E"),
]

print("时间轮任务调度:")
for delay, task in tasks:
    time_wheel.add_task(delay, task)

print("\n 时间轮运行:")
## 模拟 30 秒的运行
for _ in range(30):
    executed = time_wheel.tick()
    if not executed and time_wheel.current_time % 10 == 0:
        print(f"时间 {time_wheel.current_time}: 无任务执行")

## 4. 负载均衡算法
print("\n4. 轮询负载均衡:")

class RoundRobinBalancer:
    """轮询负载均衡器"""
    
    def __init__(self, servers):
        self.servers = servers
        self.current_index = 0
        self.request_count = 0
    
    def get_server(self):
        """获取下一个服务器"""
#        # 使用 divmod 实现轮询
        _, server_index = divmod(self.request_count, len(self.servers))
        selected_server = self.servers[server_index]
        
        self.request_count += 1
        return selected_server, server_index
    
    def get_stats(self):
        """获取统计信息"""
        requests_per_server, remainder = divmod(self.request_count, len(self.servers))
        return {
            'total_requests': self.request_count,
            'requests_per_server': requests_per_server,
            'extra_requests': remainder,
            'servers': self.servers
        }

## 测试负载均衡
servers = ['Server-A', 'Server-B', 'Server-C', 'Server-D']
balancer = RoundRobinBalancer(servers)

print("轮询负载均衡测试:")
print(f"服务器列表: {servers}")
print("\n 请求分发:")

## 模拟 15 个请求
for i in range(15):
    server, index = balancer.get_server()
    print(f"请求 {i+1:2d} → {server} (索引 {index})")

## 显示统计信息
stats = balancer.get_stats()
print(f"\n 统计信息:")
print(f"总请求数: {stats['total_requests']}")
print(f"每服务器基础请求数: {stats['requests_per_server']}")
print(f"额外请求数: {stats['extra_requests']}")
print(f"前{stats['extra_requests']}个服务器各多处理 1 个请求")
```

## ⚠️ 注意事项

### 常见陷阱和最佳实践

```python
## divmod()函数的常见陷阱和最佳实践
print("divmod()函数常见陷阱和最佳实践:")

## 陷阱 1: 负数的除法和取模行为
print("\n 陷阱 1: 负数的除法和取模行为")

## Python 的除法和取模遵循特定规则
test_cases = [
    (7, 3),     # 正数情况
    (-7, 3),    # 负被除数
    (7, -3),    # 负除数
    (-7, -3),   # 双负数
]

print("Python 的除法和取模规则:")
for a, b in test_cases:
    q, r = divmod(a, b)
    floor_div = a // b
    mod_result = a % b
    
    print(f"\ndivmod({a}, {b}) = ({q}, {r})")
    print(f"{a} // {b} = {floor_div}, {a} % {b} = {mod_result}")
    print(f"验证: {b} × {q} + {r} = {b * q + r}")
    
#    # 重要规则说明
    if r != 0:
        print(f"余数符号与除数一致: {r} 与 {b} {'同号' if (r > 0) == (b > 0) else '异号'}")
    
#    # 与其他语言的差异
    if a < 0 and b > 0:
        print(f"注意: 在 C/Java 中,{a} / {b} 的商可能是 {a // b + 1},余数是 {a % b - b}")

print("\n 重要规则:")
print("1. Python 使用向下取整除法(floor division)")
print("2. 余数的符号总是与除数相同")
print("3. 满足等式: a = b * q + r,且 0 ≤ |r| < |b|")

## 陷阱 2: 浮点数精度问题
print("\n 陷阱 2: 浮点数精度问题")

float_cases = [
    (10.0, 3.0),
    (1.0, 0.1),     # 0.1 无法精确表示
    (0.3, 0.1),     # 两个无法精确表示的数
    (1.0, 0.3),
]

print("浮点数 divmod 可能的精度问题:")
for a, b in float_cases:
    q, r = divmod(a, b)
    verification = b * q + r
    error = abs(verification - a)
    
    print(f"\ndivmod({a}, {b}) = ({q}, {r})")
    print(f"验证: {b} × {q} + {r} = {verification}")
    print(f"误差: {error}")
    
    if error > 1e-15:
        print(f"⚠️  存在精度误差")
        print(f"建议: 对于精确计算,考虑使用 decimal 模块")

## 使用 decimal 模块的精确计算
print("\n 使用 decimal 模块进行精确计算:")
from decimal import Decimal, getcontext

getcontext().prec = 28  # 设置精度

decimal_a = Decimal('1.0')
decimal_b = Decimal('0.3')
q, r = divmod(decimal_a, decimal_b)

print(f"Decimal divmod({decimal_a}, {decimal_b}) = ({q}, {r})")
print(f"验证: {decimal_b} × {q} + {r} = {decimal_b * q + r}")

## 陷阱 3: 除零错误
print("\n 陷阱 3: 除零错误处理")

def safe_divmod(a, b):
    """安全的 divmod 函数"""
    try:
        return divmod(a, b)
    except ZeroDivisionError:
        print(f"错误: 不能除以零 (divmod({a}, {b}))")
        return None, None
    except Exception as e:
        print(f"错误: {type(e).__name__}: {e}")
        return None, None

## 测试错误处理
error_cases = [
    (10, 0),
    (0, 0),
    (float('inf'), 5),
    (5, float('inf')),
]

print("错误处理测试:")
for a, b in error_cases:
    print(f"safe_divmod({a}, {b}):")
    result = safe_divmod(a, b)
    print(f"  结果: {result}")

## 陷阱 4: 性能考虑
print("\n 陷阱 4: 性能考虑")

import time

## 比较 divmod 与分别使用//和%的性能
test_data = [(i, 7) for i in range(100000)]

## 方法 1: 使用 divmod
start = time.time()
results1 = [divmod(a, b) for a, b in test_data]
time1 = time.time() - start

## 方法 2: 分别使用//和%
start = time.time()
results2 = [(a // b, a % b) for a, b in test_data]
time2 = time.time() - start

print(f"性能比较 (100,000 次操作):")
print(f"divmod 方法: {time1:.6f}秒")
print(f"//和%方法: {time2:.6f}秒")
print(f"性能差异: {abs(time1 - time2):.6f}秒")
print(f"结果一致: {results1 == results2}")

if time1 < time2:
    print("divmod 更快,推荐在需要同时获取商和余数时使用")
else:
    print("分别计算更快,但差异通常很小")

## 陷阱 5: 类型转换问题
print("\n 陷阱 5: 类型转换问题")

type_cases = [
    (10, 3),        # int, int
    (10.0, 3),      # float, int
    (10, 3.0),      # int, float
    (10.0, 3.0),    # float, float
    (True, 2),      # bool, int (True = 1)
    (10, True),     # int, bool (True = 1)
]

print("不同类型的 divmod 结果:")
for a, b in type_cases:
    q, r = divmod(a, b)
    print(f"divmod({a} ({type(a).__name__}), {b} ({type(b).__name__})) = ({q} ({type(q).__name__}), {r} ({type(r).__name__}))")

print("\n 类型规则:")
print("1. 如果任一操作数是 float,结果为 float")
print("2. 如果两个操作数都是 int,结果为 int")
print("3. bool 被视为 int(True=1, False=0)")

## 最佳实践总结
print("\n 最佳实践总结:")
print("1. 理解 Python 的向下取整除法规则")
print("2. 注意负数的除法和取模行为")
print("3. 对于精确计算,考虑使用 decimal 模块")
print("4. 始终处理除零错误")
print("5. 在需要同时获取商和余数时,优先使用 divmod")
print("6. 注意不同数据类型的结果类型")
print("7. 在性能敏感的场景中,测试 divmod 与分别计算的性能")
print("8. 在算法实现中,divmod 常用于索引计算和数值分解")
```

## 🔧 性能优化

### divmod() 性能优化技巧

```python
## divmod() 性能优化技巧
print("divmod() 性能优化技巧:")
import time

## 1. 批量操作优化
print("\n1. 批量操作优化:")

## 生成测试数据
test_data = [(i, 7) for i in range(100000)]

## 方法 1: 列表推导式
def batch_divmod_list_comp(data):
    return [divmod(a, b) for a, b in data]

## 方法 2: 生成器表达式
def batch_divmod_generator(data):
    return list(divmod(a, b) for a, b in data)

## 方法 3: 传统循环
def batch_divmod_loop(data):
    results = []
    for a, b in data:
        results.append(divmod(a, b))
    return results

## 方法 4: 预分配列表
def batch_divmod_preallocated(data):
    results = [None] * len(data)
    for i, (a, b) in enumerate(data):
        results[i] = divmod(a, b)
    return results

## 性能测试
methods = [
    ("列表推导式", batch_divmod_list_comp),
    ("生成器表达式", batch_divmod_generator),
    ("传统循环", batch_divmod_loop),
    ("预分配列表", batch_divmod_preallocated),
]

print(f"批量操作性能测试 ({len(test_data)}次操作):")
results = {}

for name, func in methods:
    start = time.time()
    result = func(test_data[:10000])  # 使用较小的数据集进行测试
    elapsed = time.time() - start
    results[name] = (elapsed, result)
    print(f"{name}: {elapsed:.6f}秒")

## 验证结果一致性
first_result = list(results.values())[0][1]
all_same = all(result == first_result for _, result in results.values())
print(f"所有方法结果一致: {all_same}")

## 2. 缓存优化
print("\n2. 缓存优化:")

class DivmodCache:
    """divmod 结果缓存"""
    
    def __init__(self, max_size=10000):
        self.cache = {}
        self.max_size = max_size
        self.hits = 0
        self.misses = 0
    
    def divmod_cached(self, a, b):
        """带缓存的 divmod"""
        key = (a, b)
        
        if key in self.cache:
            self.hits += 1
            return self.cache[key]
        
        result = divmod(a, b)
        self.misses += 1
        
#        # 简单的缓存大小控制
        if len(self.cache) < self.max_size:
            self.cache[key] = result
        
        return result
    
    def get_stats(self):
        total = self.hits + self.misses
        hit_rate = self.hits / total if total > 0 else 0
        return {
            'hits': self.hits,
            'misses': self.misses,
            'hit_rate': hit_rate,
            'cache_size': len(self.cache)
        }

## 创建重复数据进行缓存测试
import random
random.seed(42)
repeated_data = [(random.randint(1, 100), random.randint(1, 20)) for _ in range(1000)]
repeated_data = repeated_data * 10  # 重复 10 次增加缓存命中率
random.shuffle(repeated_data)

cache = DivmodCache()

## 无缓存测试
start = time.time()
no_cache_results = [divmod(a, b) for a, b in repeated_data]
no_cache_time = time.time() - start

## 有缓存测试
start = time.time()
cache_results = [cache.divmod_cached(a, b) for a, b in repeated_data]
cache_time = time.time() - start

stats = cache.get_stats()
print(f"缓存测试结果:")
print(f"数据量: {len(repeated_data)}")
print(f"无缓存时间: {no_cache_time:.6f}秒")
print(f"有缓存时间: {cache_time:.6f}秒")
print(f"性能提升: {no_cache_time/cache_time:.2f}x")
print(f"缓存命中率: {stats['hit_rate']:.2%}")
print(f"缓存大小: {stats['cache_size']}")
print(f"结果一致: {no_cache_results == cache_results}")

## 3. 特殊情况优化
print("\n3. 特殊情况优化:")

def optimized_divmod(a, b):
    """优化的 divmod 实现"""
#    # 特殊情况快速处理
    if b == 1:
        return a, 0
    elif b == -1:
        return -a, 0
    elif a == 0:
        return 0, 0
    elif a == b:
        return 1, 0
    elif abs(a) < abs(b):
        if (a >= 0) == (b >= 0):  # 同号
            return 0, a
        else:  # 异号
            return -1, a + b
    else:
        return divmod(a, b)

## 测试优化版本
optimization_cases = [
    (100, 1),    # 除数为 1
    (100, -1),   # 除数为-1
    (0, 5),      # 被除数为 0
    (7, 7),      # 相等
    (3, 5),      # 被除数小于除数(正数)
    (-3, 5),     # 被除数小于除数(负被除数)
    (3, -5),     # 被除数小于除数(负除数)
    (123, 7),    # 一般情况
]

print("优化版本测试:")
for a, b in optimization_cases:
    standard_result = divmod(a, b)
    optimized_result = optimized_divmod(a, b)
    
    print(f"divmod({a}, {b}):")
    print(f"  标准版本: {standard_result}")
    print(f"  优化版本: {optimized_result}")
    print(f"  结果一致: {standard_result == optimized_result}")
    print()

## 4. 向量化操作(使用 NumPy)
print("4. 向量化操作(NumPy):")

try:
    import numpy as np
    
#    # 生成大量测试数据
    np.random.seed(42)
    a_array = np.random.randint(1, 1000, 100000)
    b_array = np.random.randint(1, 100, 100000)
    
#    # Python 标准方法
    start = time.time()
    python_results = [divmod(int(a), int(b)) for a, b in zip(a_array, b_array)]
    python_time = time.time() - start
    
#    # NumPy 向量化方法
    start = time.time()
    numpy_quotients = a_array // b_array
    numpy_remainders = a_array % b_array
    numpy_results = list(zip(numpy_quotients, numpy_remainders))
    numpy_time = time.time() - start
    
    print(f"向量化操作性能比较 ({len(a_array)}个元素):")
    print(f"Python 标准方法: {python_time:.6f}秒")
    print(f"NumPy 向量化: {numpy_time:.6f}秒")
    print(f"性能提升: {python_time/numpy_time:.2f}x")
    
#    # 验证结果一致性(检查前几个)
    sample_size = min(100, len(python_results))
    results_match = python_results[:sample_size] == numpy_results[:sample_size]
    print(f"结果一致性(前{sample_size}个): {results_match}")
    
except ImportError:
    print("NumPy 未安装,跳过向量化测试")

## 5. 内存优化
print("\n5. 内存优化:")

def memory_efficient_batch_divmod(data, chunk_size=1000):
    """内存高效的批量 divmod 处理"""
    for i in range(0, len(data), chunk_size):
        chunk = data[i:i+chunk_size]
        yield [divmod(a, b) for a, b in chunk]

def process_large_dataset(data):
    """处理大数据集"""
    results = []
    for chunk_results in memory_efficient_batch_divmod(data, 1000):
        results.extend(chunk_results)
    return results

## 测试内存优化
large_data = [(i, 7) for i in range(10000)]

## 标准方法
start = time.time()
standard_results = [divmod(a, b) for a, b in large_data]
standard_time = time.time() - start

## 内存优化方法
start = time.time()
optimized_results = process_large_dataset(large_data)
optimized_time = time.time() - start

print(f"内存优化测试:")
print(f"数据量: {len(large_data)}")
print(f"标准方法: {standard_time:.6f}秒")
print(f"优化方法: {optimized_time:.6f}秒")
print(f"结果一致: {standard_results == optimized_results}")
print(f"内存优化方法适用于超大数据集,可以减少内存峰值使用")

print("\n 性能优化总结:")
print("1. 对于批量操作,列表推导式通常最快")
print("2. 重复计算场景下,缓存可以显著提升性能")
print("3. 特殊情况的快速路径可以避免不必要的计算")
print("4. NumPy 向量化操作对大数组有显著性能优势")
print("5. 对于超大数据集,考虑分块处理以优化内存使用")
print("6. 在性能关键的代码中,测试不同方法的实际性能")
```

## 📚 相关函数和模块

### 相关内置函数
- [`abs()`](./abs/) - 绝对值函数
- [`round()`](./round/) - 数字四舍五入函数
- [`pow()`](./pow/) - 幂运算函数
- [`int()`](./int/) - 整数转换函数
- [`float()`](./float/) - 浮点数转换函数
- [`min()`](./min/) - 最小值函数
- [`max()`](./max/) - 最大值函数

### 相关标准库模块
- `math` - 数学函数（包括 gcd, lcm 等）
- `decimal` - 十进制浮点运算
- `fractions` - 分数运算
- `operator` - 函数形式的运算符
- `itertools` - 迭代工具

### 相关第三方库
- `numpy` - 数值计算（包括向量化的除法和取模）
- `pandas` - 数据分析（包括时间序列的除法运算）
- `sympy` - 符号数学计算

## 🔗 扩展阅读

- [Python 官方文档 - divmod()](https://docs.python.org/3/library/functions.html#divmod)
- [欧几里得除法](https://en.wikipedia.org/wiki/Euclidean_division)
- [模运算](https://en.wikipedia.org/wiki/Modular_arithmetic)
- [欧几里得算法](https://en.wikipedia.org/wiki/Euclidean_algorithm)
- [时间复杂度分析](https://en.wikipedia.org/wiki/Time_complexity)

## 🏷️ 标签

`数学运算` `除法` `取模` `商和余数` `算法` `性能优化` `数值计算`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档工程师