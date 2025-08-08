---
layout: doc
title: complex() - 复数构造函数
permalink: /docs/builtins/complex/
category: builtins
tags: [复数, 数学, 数据类型, 构造函数]
description: 创建复数对象或将值转换为复数
author: Python文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: 中级
---

# complex() - 复数构造函数

## 📝 概述

`complex()` 是Python中的内置函数，用于创建复数对象或将其他数值类型转换为复数。复数是数学中的重要概念，由实部和虚部组成，在科学计算、信号处理、工程计算等领域有广泛应用。Python原生支持复数运算，使得复数计算变得简单直观。

## 🎯 学习目标

- 掌握complex()函数的基本用法和语法
- 理解复数的概念和表示方法
- 学会复数的基本运算和操作
- 了解复数在实际编程中的应用场景
- 掌握复数与其他数值类型的转换

## 📋 前置知识

- Python基本语法
- 数值类型（int、float）的基本概念
- 数学中复数的基本概念
- 基本的数学运算

## 🔍 详细内容

### 基本概念

复数是由实部（real part）和虚部（imaginary part）组成的数，通常表示为 `a + bj` 的形式，其中 `a` 是实部，`b` 是虚部，`j` 是虚数单位（在数学中通常用 `i` 表示）。

### 语法格式

```python
complex([real[, imag]])
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| real | 数值或字符串 | 否 | 0 | 实部，可以是数值或表示复数的字符串 |
| imag | 数值 | 否 | 0 | 虚部，只能是数值类型 |

### 返回值

- **类型**: complex对象
- **内容**: 包含指定实部和虚部的复数

## 💡 代码示例

### 基本用法

```python
# 创建复数的不同方式

# 1. 无参数创建（默认为0+0j）
zero_complex = complex()
print(zero_complex)  # 输出: 0j
print(type(zero_complex))  # 输出: <class 'complex'>

# 2. 只指定实部
real_only = complex(3)
print(real_only)  # 输出: (3+0j)

# 3. 指定实部和虚部
full_complex = complex(3, 4)
print(full_complex)  # 输出: (3+4j)

# 4. 使用负数
negative_complex = complex(-2, -5)
print(negative_complex)  # 输出: (-2-5j)

# 5. 使用浮点数
float_complex = complex(1.5, 2.7)
print(float_complex)  # 输出: (1.5+2.7j)
```

### 从字符串创建复数

```python
# 从字符串创建复数

# 标准格式
complex_from_str1 = complex('3+4j')
print(complex_from_str1)  # 输出: (3+4j)

# 不同的字符串格式
complex_from_str2 = complex('5-2j')
print(complex_from_str2)  # 输出: (5-2j)

# 只有虚部
complex_from_str3 = complex('3j')
print(complex_from_str3)  # 输出: 3j

# 只有实部
complex_from_str4 = complex('7')
print(complex_from_str4)  # 输出: (7+0j)

# 带空格的字符串（会出错）
try:
    complex_with_space = complex('3 + 4j')  # 错误：不能有空格
except ValueError as e:
    print(f"错误: {e}")

# 正确的格式要求
valid_formats = ['1+2j', '1-2j', '1j', '-1j', '1', '1.5+2.7j']
for fmt in valid_formats:
    print(f"'{fmt}' -> {complex(fmt)}")
```

### 复数的属性和方法

```python
# 复数的属性
c = complex(3, 4)

# 获取实部和虚部
print(f"复数: {c}")
print(f"实部: {c.real}")  # 输出: 3.0
print(f"虚部: {c.imag}")  # 输出: 4.0

# 注意：实部和虚部总是浮点数类型
print(f"实部类型: {type(c.real)}")  # 输出: <class 'float'>
print(f"虚部类型: {type(c.imag)}")  # 输出: <class 'float'>

# 复数的共轭
conjugate = c.conjugate()
print(f"共轭复数: {conjugate}")  # 输出: (3-4j)

# 复数的模（绝对值）
modulus = abs(c)
print(f"模: {modulus}")  # 输出: 5.0

# 复数的字符串表示
print(f"字符串表示: {str(c)}")  # 输出: (3+4j)
print(f"repr表示: {repr(c)}")  # 输出: (3+4j)
```

### 复数运算

```python
# 复数的基本运算
c1 = complex(3, 4)
c2 = complex(1, 2)

print(f"c1 = {c1}")
print(f"c2 = {c2}")

# 加法
addition = c1 + c2
print(f"加法: {c1} + {c2} = {addition}")  # 输出: (4+6j)

# 减法
subtraction = c1 - c2
print(f"减法: {c1} - {c2} = {subtraction}")  # 输出: (2+2j)

# 乘法
multiplication = c1 * c2
print(f"乘法: {c1} * {c2} = {multiplication}")  # 输出: (-5+10j)

# 除法
division = c1 / c2
print(f"除法: {c1} / {c2} = {division}")  # 输出: (2.2+0.4j)

# 幂运算
power = c1 ** 2
print(f"平方: {c1}^2 = {power}")  # 输出: (-7+24j)

# 与实数运算
real_add = c1 + 5
print(f"与实数相加: {c1} + 5 = {real_add}")  # 输出: (8+4j)

real_mult = c1 * 2
print(f"与实数相乘: {c1} * 2 = {real_mult}")  # 输出: (6+8j)
```

### 复数比较

```python
# 复数的比较
c1 = complex(3, 4)
c2 = complex(3, 4)
c3 = complex(1, 2)

# 相等比较
print(f"{c1} == {c2}: {c1 == c2}")  # 输出: True
print(f"{c1} == {c3}: {c1 == c3}")  # 输出: False

# 不等比较
print(f"{c1} != {c3}: {c1 != c3}")  # 输出: True

# 复数不支持大小比较
try:
    result = c1 > c2  # 这会引发TypeError
except TypeError as e:
    print(f"复数不支持大小比较: {e}")

# 但可以比较模的大小
print(f"模的比较: abs({c1}) > abs({c3}) = {abs(c1) > abs(c3)}")  # 输出: True
```

## 🚀 高级应用

### 极坐标形式转换

```python
import math

# 直角坐标转极坐标
def rect_to_polar(c):
    """将复数从直角坐标转换为极坐标形式"""
    r = abs(c)  # 模
    theta = math.atan2(c.imag, c.real)  # 幅角（弧度）
    return r, theta

# 极坐标转直角坐标
def polar_to_rect(r, theta):
    """将极坐标转换为复数"""
    real = r * math.cos(theta)
    imag = r * math.sin(theta)
    return complex(real, imag)

# 示例
c = complex(3, 4)
r, theta = rect_to_polar(c)
print(f"复数 {c}")
print(f"极坐标形式: r={r:.3f}, θ={theta:.3f}弧度 ({math.degrees(theta):.1f}度)")

# 验证转换
c_back = polar_to_rect(r, theta)
print(f"转换回来: {c_back}")
print(f"误差: {abs(c - c_back):.10f}")

# 欧拉公式: e^(iθ) = cos(θ) + i*sin(θ)
def euler_formula(theta):
    """欧拉公式实现"""
    return complex(math.cos(theta), math.sin(theta))

theta = math.pi / 4  # 45度
euler_result = euler_formula(theta)
print(f"\n欧拉公式 e^(i*π/4) = {euler_result}")
print(f"验证: cos(π/4) + i*sin(π/4) = {math.cos(theta)} + {math.sin(theta)}i")
```

### 复数序列和数组

```python
# 创建复数序列
def create_complex_sequence(n):
    """创建复数序列"""
    return [complex(i, i**2) for i in range(n)]

# 复数列表
complex_list = create_complex_sequence(5)
print("复数序列:")
for i, c in enumerate(complex_list):
    print(f"  {i}: {c}")

# 复数运算的向量化
def complex_vector_add(list1, list2):
    """复数列表的向量加法"""
    return [c1 + c2 for c1, c2 in zip(list1, list2)]

def complex_vector_multiply(complex_list, scalar):
    """复数列表的标量乘法"""
    return [c * scalar for c in complex_list]

# 示例
list1 = [complex(1, 2), complex(3, 4), complex(5, 6)]
list2 = [complex(2, 1), complex(4, 3), complex(6, 5)]

vector_sum = complex_vector_add(list1, list2)
print(f"\n向量加法结果: {vector_sum}")

scalar_mult = complex_vector_multiply(list1, complex(2, 1))
print(f"标量乘法结果: {scalar_mult}")
```

### 复数在信号处理中的应用

```python
import math

# 生成复数信号
def generate_complex_signal(frequency, duration, sample_rate):
    """生成复数正弦信号"""
    t_values = [i / sample_rate for i in range(int(duration * sample_rate))]
    signal = []
    
    for t in t_values:
        # 复数信号: e^(i*2π*f*t) = cos(2πft) + i*sin(2πft)
        angle = 2 * math.pi * frequency * t
        signal.append(complex(math.cos(angle), math.sin(angle)))
    
    return t_values, signal

# 计算信号的功率
def signal_power(signal):
    """计算复数信号的平均功率"""
    power_sum = sum(abs(s)**2 for s in signal)
    return power_sum / len(signal)

# 示例：生成1Hz信号，持续1秒，采样率10Hz
time, signal = generate_complex_signal(frequency=1, duration=1, sample_rate=10)

print("复数信号示例（前5个采样点）:")
for i in range(5):
    print(f"  t={time[i]:.1f}s: {signal[i]:.3f}")

power = signal_power(signal)
print(f"\n信号平均功率: {power:.3f}")

# 信号的频谱分析（简化版DFT）
def simple_dft(signal, k):
    """简化的离散傅里叶变换（单个频率分量）"""
    N = len(signal)
    result = complex(0, 0)
    
    for n in range(N):
        angle = -2 * math.pi * k * n / N
        twiddle = complex(math.cos(angle), math.sin(angle))
        result += signal[n] * twiddle
    
    return result / N

# 计算几个频率分量
print("\n频谱分析（DFT系数）:")
for k in range(5):
    dft_coeff = simple_dft(signal, k)
    print(f"  k={k}: {dft_coeff:.3f} (幅度: {abs(dft_coeff):.3f})")
```

### 复数在几何变换中的应用

```python
import math

# 复数表示的2D点
class ComplexPoint:
    def __init__(self, x, y):
        self.complex_coord = complex(x, y)
    
    @property
    def x(self):
        return self.complex_coord.real
    
    @property
    def y(self):
        return self.complex_coord.imag
    
    def rotate(self, angle):
        """绕原点旋转"""
        rotation = complex(math.cos(angle), math.sin(angle))
        rotated = self.complex_coord * rotation
        return ComplexPoint(rotated.real, rotated.imag)
    
    def scale(self, factor):
        """缩放"""
        scaled = self.complex_coord * factor
        return ComplexPoint(scaled.real, scaled.imag)
    
    def translate(self, dx, dy):
        """平移"""
        translated = self.complex_coord + complex(dx, dy)
        return ComplexPoint(translated.real, translated.imag)
    
    def __str__(self):
        return f"({self.x:.2f}, {self.y:.2f})"

# 几何变换示例
original_point = ComplexPoint(3, 4)
print(f"原始点: {original_point}")

# 旋转90度
rotated_point = original_point.rotate(math.pi / 2)
print(f"旋转90度后: {rotated_point}")

# 缩放2倍
scaled_point = original_point.scale(2)
print(f"缩放2倍后: {scaled_point}")

# 平移
translated_point = original_point.translate(1, -2)
print(f"平移(1,-2)后: {translated_point}")

# 复合变换：先旋转45度，再缩放1.5倍
complex_transform = original_point.rotate(math.pi / 4).scale(1.5)
print(f"复合变换后: {complex_transform}")

# 多边形的变换
def transform_polygon(vertices, transformation_func):
    """对多边形的所有顶点应用变换"""
    return [transformation_func(vertex) for vertex in vertices]

# 创建一个正方形
square = [
    ComplexPoint(0, 0),
    ComplexPoint(1, 0),
    ComplexPoint(1, 1),
    ComplexPoint(0, 1)
]

print("\n原始正方形顶点:")
for i, vertex in enumerate(square):
    print(f"  顶点{i}: {vertex}")

# 旋转正方形45度
rotated_square = transform_polygon(square, lambda p: p.rotate(math.pi / 4))
print("\n旋转45度后的正方形:")
for i, vertex in enumerate(rotated_square):
    print(f"  顶点{i}: {vertex}")
```

## ⚠️ 常见陷阱与最佳实践

### 字符串格式要求

```python
# 正确的字符串格式
valid_strings = [
    '1+2j',    # 标准格式
    '1-2j',    # 负虚部
    '1j',      # 只有虚部
    '-1j',     # 负虚部
    '1',       # 只有实部
    '1.5+2.7j' # 浮点数
]

for s in valid_strings:
    print(f"'{s}' -> {complex(s)}")

# 错误的字符串格式
invalid_strings = [
    '1 + 2j',   # 不能有空格
    '1+2i',     # 必须用j，不能用i
    '1+j2',     # j必须在数字后面
    '(1+2j)',   # 不能有括号
    '1+2*j'     # 不能有乘号
]

print("\n错误格式示例:")
for s in invalid_strings:
    try:
        result = complex(s)
        print(f"'{s}' -> {result}")
    except ValueError as e:
        print(f"'{s}' -> 错误: {e}")
```

### 浮点数精度问题

```python
# 浮点数精度问题
c1 = complex(0.1, 0.2)
c2 = complex(0.3, 0.0)
c3 = c1 + c1 + c1

print(f"c1 = {c1}")
print(f"c2 = {c2}")
print(f"c3 = c1 + c1 + c1 = {c3}")
print(f"c3 == c2: {c3 == c2}")  # 可能为False
print(f"差值: {c3 - c2}")

# 解决方案：使用容差比较
def complex_almost_equal(c1, c2, tolerance=1e-9):
    """复数的近似相等比较"""
    return abs(c1 - c2) < tolerance

print(f"近似相等: {complex_almost_equal(c3, c2)}")

# 使用decimal模块提高精度
from decimal import Decimal, getcontext

# 设置精度
getcontext().prec = 50

# 使用Decimal创建高精度复数
def high_precision_complex(real_str, imag_str):
    """创建高精度复数"""
    real = float(Decimal(real_str))
    imag = float(Decimal(imag_str))
    return complex(real, imag)

hp_c1 = high_precision_complex('0.1', '0.2')
hp_c2 = high_precision_complex('0.3', '0.0')
hp_c3 = hp_c1 + hp_c1 + hp_c1

print(f"\n高精度计算:")
print(f"hp_c3 = {hp_c3}")
print(f"hp_c2 = {hp_c2}")
print(f"差值: {hp_c3 - hp_c2}")
```

### 性能优化

```python
import time

# 性能比较：不同创建方式
def performance_comparison():
    """比较不同复数创建方式的性能"""
    n = 100000
    
    # 方法1：使用complex()函数
    start = time.time()
    for i in range(n):
        c = complex(i, i+1)
    method1_time = time.time() - start
    
    # 方法2：使用复数字面量
    start = time.time()
    for i in range(n):
        c = i + (i+1)*1j
    method2_time = time.time() - start
    
    # 方法3：从字符串创建（最慢）
    start = time.time()
    for i in range(1000):  # 减少次数，因为很慢
        c = complex(f"{i}+{i+1}j")
    method3_time = (time.time() - start) * (n / 1000)
    
    print(f"性能比较（{n}次创建）:")
    print(f"  complex()函数: {method1_time:.4f}秒")
    print(f"  复数字面量: {method2_time:.4f}秒")
    print(f"  字符串解析: {method3_time:.4f}秒（估算）")
    print(f"  最快方法比最慢方法快: {method3_time / method2_time:.1f}倍")

performance_comparison()

# 批量复数运算优化
def optimized_complex_operations():
    """优化的复数批量运算"""
    # 创建大量复数
    n = 10000
    complex_list = [complex(i, i*2) for i in range(n)]
    
    # 方法1：逐个运算
    start = time.time()
    result1 = []
    for c in complex_list:
        result1.append(c * c.conjugate())  # 计算模的平方
    method1_time = time.time() - start
    
    # 方法2：列表推导式
    start = time.time()
    result2 = [c * c.conjugate() for c in complex_list]
    method2_time = time.time() - start
    
    # 方法3：使用内置函数
    start = time.time()
    result3 = [abs(c)**2 for c in complex_list]
    method3_time = time.time() - start
    
    print(f"\n批量运算性能比较（{n}个复数）:")
    print(f"  逐个运算: {method1_time:.4f}秒")
    print(f"  列表推导式: {method2_time:.4f}秒")
    print(f"  内置函数: {method3_time:.4f}秒")
    print(f"  结果一致性: {result1[:5] == result2[:5] == result3[:5]}")

optimized_complex_operations()
```

## 🔧 实际应用场景

### 电路分析

```python
import math

# 交流电路分析
class ACCircuit:
    def __init__(self):
        self.components = []
    
    def add_resistor(self, resistance):
        """添加电阻（实数阻抗）"""
        impedance = complex(resistance, 0)
        self.components.append(('R', resistance, impedance))
        return impedance
    
    def add_capacitor(self, capacitance, frequency):
        """添加电容（负虚数阻抗）"""
        omega = 2 * math.pi * frequency
        impedance = complex(0, -1 / (omega * capacitance))
        self.components.append(('C', capacitance, impedance))
        return impedance
    
    def add_inductor(self, inductance, frequency):
        """添加电感（正虚数阻抗）"""
        omega = 2 * math.pi * frequency
        impedance = complex(0, omega * inductance)
        self.components.append(('L', inductance, impedance))
        return impedance
    
    def series_impedance(self):
        """计算串联总阻抗"""
        total = complex(0, 0)
        for _, _, impedance in self.components:
            total += impedance
        return total
    
    def parallel_impedance(self):
        """计算并联总阻抗"""
        if not self.components:
            return complex(0, 0)
        
        reciprocal_sum = complex(0, 0)
        for _, _, impedance in self.components:
            if impedance != 0:
                reciprocal_sum += 1 / impedance
        
        return 1 / reciprocal_sum if reciprocal_sum != 0 else complex(float('inf'), 0)

# 示例：RLC串联电路
frequency = 50  # 50Hz
circuit = ACCircuit()

# 添加组件
R = circuit.add_resistor(100)  # 100Ω电阻
L = circuit.add_inductor(0.1, frequency)  # 0.1H电感
C = circuit.add_capacitor(100e-6, frequency)  # 100μF电容

print("RLC串联电路分析:")
print(f"电阻阻抗: {R:.2f}Ω")
print(f"电感阻抗: {L:.2f}Ω")
print(f"电容阻抗: {C:.2f}Ω")

total_impedance = circuit.series_impedance()
print(f"总阻抗: {total_impedance:.2f}Ω")
print(f"阻抗模: {abs(total_impedance):.2f}Ω")
print(f"相位角: {math.degrees(math.atan2(total_impedance.imag, total_impedance.real)):.1f}度")

# 计算电流和功率
voltage = complex(220, 0)  # 220V交流电压
current = voltage / total_impedance
power = voltage * current.conjugate()

print(f"\n电压: {voltage}V")
print(f"电流: {current:.3f}A")
print(f"电流幅值: {abs(current):.3f}A")
print(f"功率: {power:.2f}W")
print(f"有功功率: {power.real:.2f}W")
print(f"无功功率: {power.imag:.2f}VAR")
```

### 量子计算模拟

```python
import math
import random

# 简单的量子比特模拟
class Qubit:
    def __init__(self, alpha=1, beta=0):
        """初始化量子比特状态 |ψ⟩ = α|0⟩ + β|1⟩"""
        self.alpha = complex(alpha)  # |0⟩态的振幅
        self.beta = complex(beta)    # |1⟩态的振幅
        self.normalize()
    
    def normalize(self):
        """归一化量子态"""
        norm = math.sqrt(abs(self.alpha)**2 + abs(self.beta)**2)
        if norm > 0:
            self.alpha /= norm
            self.beta /= norm
    
    def probability_0(self):
        """测量到|0⟩态的概率"""
        return abs(self.alpha)**2
    
    def probability_1(self):
        """测量到|1⟩态的概率"""
        return abs(self.beta)**2
    
    def measure(self):
        """测量量子比特"""
        prob_0 = self.probability_0()
        if random.random() < prob_0:
            # 坍缩到|0⟩态
            self.alpha = complex(1, 0)
            self.beta = complex(0, 0)
            return 0
        else:
            # 坍缩到|1⟩态
            self.alpha = complex(0, 0)
            self.beta = complex(1, 0)
            return 1
    
    def hadamard(self):
        """Hadamard门操作"""
        new_alpha = (self.alpha + self.beta) / math.sqrt(2)
        new_beta = (self.alpha - self.beta) / math.sqrt(2)
        self.alpha = new_alpha
        self.beta = new_beta
    
    def pauli_x(self):
        """Pauli-X门操作（量子非门）"""
        self.alpha, self.beta = self.beta, self.alpha
    
    def pauli_z(self):
        """Pauli-Z门操作"""
        self.beta = -self.beta
    
    def phase(self, theta):
        """相位门操作"""
        phase_factor = complex(math.cos(theta), math.sin(theta))
        self.beta *= phase_factor
    
    def __str__(self):
        return f"|ψ⟩ = {self.alpha:.3f}|0⟩ + {self.beta:.3f}|1⟩"

# 量子计算示例
print("量子比特模拟:")

# 创建|0⟩态
qubit = Qubit(1, 0)
print(f"初始态: {qubit}")
print(f"测量到|0⟩的概率: {qubit.probability_0():.3f}")
print(f"测量到|1⟩的概率: {qubit.probability_1():.3f}")

# 应用Hadamard门创建叠加态
qubit.hadamard()
print(f"\nHadamard门后: {qubit}")
print(f"测量到|0⟩的概率: {qubit.probability_0():.3f}")
print(f"测量到|1⟩的概率: {qubit.probability_1():.3f}")

# 多次测量统计
measurement_results = []
for _ in range(1000):
    test_qubit = Qubit(1, 0)
    test_qubit.hadamard()
    result = test_qubit.measure()
    measurement_results.append(result)

count_0 = measurement_results.count(0)
count_1 = measurement_results.count(1)
print(f"\n1000次测量结果:")
print(f"  |0⟩: {count_0}次 ({count_0/1000:.3f})")
print(f"  |1⟩: {count_1}次 ({count_1/1000:.3f})")

# 量子干涉演示
print("\n量子干涉演示:")
qubit = Qubit(1, 0)
print(f"初始态: {qubit}")

# H-Z-H序列
qubit.hadamard()
print(f"第一个H门后: {qubit}")

qubit.pauli_z()
print(f"Z门后: {qubit}")

qubit.hadamard()
print(f"第二个H门后: {qubit}")
print(f"最终测量到|1⟩的概率: {qubit.probability_1():.3f}")
```

## 🔗 相关函数

### 内置函数
- **int()** - 整数转换函数
- **float()** - 浮点数转换函数
- **abs()** - 绝对值函数（复数的模）
- **round()** - 四舍五入函数
- **pow()** - 幂运算函数
- **divmod()** - 除法和取模运算

### 标准库模块
- **math** - 数学函数
  - `sqrt()` - 平方根
  - `atan2()` - 反正切函数
  - `cos()`, `sin()` - 三角函数
  - `pi`, `e` - 数学常数
- **cmath** - 复数数学函数
  - `sqrt()` - 复数平方根
  - `exp()` - 复数指数函数
  - `log()` - 复数对数函数
  - `sin()`, `cos()` - 复数三角函数
  - `phase()` - 复数相位
  - `polar()` - 极坐标转换
  - `rect()` - 直角坐标转换
- **decimal** - 高精度十进制运算
- **fractions** - 分数运算

### 第三方库
- **numpy** - 数值计算
  - `np.complex64`, `np.complex128` - 复数数组类型
  - `np.real()`, `np.imag()` - 实部虚部提取
  - `np.conj()` - 共轭
  - `np.angle()` - 相位角
  - `np.fft` - 快速傅里叶变换
- **scipy** - 科学计算
  - `scipy.signal` - 信号处理
  - `scipy.fft` - 傅里叶变换
- **matplotlib** - 绘图
  - 复数的可视化
  - 复平面绘图

## 📚 扩展阅读

- [Python官方文档 - complex()](https://docs.python.org/3/library/functions.html#complex)
- [Python官方文档 - 数值类型](https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex)
- [Python官方文档 - cmath模块](https://docs.python.org/3/library/cmath.html)
- [复数数学基础](https://en.wikipedia.org/wiki/Complex_number)
- [复数在工程中的应用](https://en.wikipedia.org/wiki/Phasor)

## 🏷️ 标签

`复数` `数学` `数据类型` `构造函数` `科学计算` `信号处理`

---

**最后更新**: 2024-01-15  
**作者**: Python文档工程师  
**版本**: 1.0