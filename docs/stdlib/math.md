---
layout: doc
title: math 模块
permalink: /docs/stdlib/math/
category: stdlib
tags: [数学, 计算, 三角函数, 对数, 常量]
description: Python math 模块详解 - 数学函数、三角函数、对数函数与数学常量的标准库实现
author: Python教程
date: 2024-12-19
updated: 2024-12-19
version: 1.0
difficulty: "入门"
---

# math 模块

## 📝 概述

Python math 模块提供了对 C 标准定义的数学函数的访问，包含数论函数、三角函数、对数函数、幂函数和数学常量。该模块中的函数不能用于复数，如需支持复数，可使用 cmath 模块中的同名函数。

## 🎯 学习目标

- 掌握 math 模块的基本数论函数和表示函数
- 熟练使用三角函数和反三角函数
- 了解对数、指数函数的应用场景
- 掌握数学常量的使用方法

## 📋 前置知识

- Python 基本数据类型（int、float）
- 基础数学概念（三角函数、对数、指数）

## 🔍 详细内容

### 模块概览

```python
# -*- coding: utf-8 -*-
import math

# 查看模块内容
print(dir(math))
# 获取帮助信息
# help(math)

# 注意：该模块所有函数的返回值类型若未明确说明，都为浮点数
```

### 数论和表示函数

| 函数 | 描述 | 实例 |
| - | - | - |
| math.ceil(x) | 返回 >= x 的最小整数 (int) | math.ceil(2.2) → 3 |
| math.floor(x) | 返回 <= x 的最大整数 (int) | math.floor(3.6) → 3 |
| math.trunc(x) | 将实数 x 截断为 int | math.trunc(3.4) → 3 |
| math.fabs(x) | 返回 x 的绝对值 | math.fabs(-2) → 2.0 |
| math.copysign(x, y) | 返回 x 绝对值，符号同 y 的浮点数 | math.copysign(1.2, -3) → -1.2 |

```python
# -*- coding: utf-8 -*-
import math

# 取整函数演示
numbers = [2.2, -2.7, 3.0]
for num in numbers:
    print(f"原数: {num}")
    print(f"ceil: {math.ceil(num)}")      # 向上取整
    print(f"floor: {math.floor(num)}")    # 向下取整
    print(f"trunc: {math.trunc(num)}")    # 截断小数部分
    print()
```

### 组合与排列函数

```python
# -*- coding: utf-8 -*-
import math

# 组合数：从 n 个项目中选出 k 个项目的方法数（无顺序）
print(f"C(5,2) = {math.comb(5, 2)}")     # 10

# 排列数：从 n 个项目中选择 k 个项目的方法数（有顺序）
print(f"P(5,2) = {math.perm(5, 2)}")     # 20

# 阶乘
print(f"5! = {math.factorial(5)}")       # 120

# 最大公约数和最小公倍数
print(f"gcd(12, 18) = {math.gcd(12, 18)}")  # 6
print(f"lcm(12, 18) = {math.lcm(12, 18)}")  # 36
```

### 取余与浮点操作

```python
# -*- coding: utf-8 -*-
import math

# 不同的取余函数
x, y = 7, -2
print(f"{x} % {y} = {x % y}")                    # Python 内置取余
print(f"fmod({x}, {y}) = {math.fmod(x, y)}")     # C 风格取余
print(f"remainder({x}, {y}) = {math.remainder(x, y)}")  # IEEE 754 取余

# 浮点数精确求和
numbers = [0.1] * 10
print(f"sum: {sum(numbers)}")           # 有精度误差
print(f"fsum: {math.fsum(numbers)}")    # 精确求和

# 浮点数内部表示
mantissa, exponent = math.frexp(3.4)
print(f"3.4 = {mantissa} * 2^{exponent}")
print(f"验证: {math.ldexp(mantissa, exponent)}")
```

### 幂函数和对数函数

```python
# -*- coding: utf-8 -*-
import math

# 指数函数
print(f"e^2 = {math.exp(2)}")
print(f"exp(1e-5) - 1 = {math.exp(1e-5) - 1}")    # 精度损失
print(f"expm1(1e-5) = {math.expm1(1e-5)}")        # 高精度计算

# 对数函数
print(f"ln(e) = {math.log(math.e)}")
print(f"log2(8) = {math.log2(8)}")
print(f"log10(100) = {math.log10(100)}")
print(f"log(8, 2) = {math.log(8, 2)}")

# 幂函数和平方根
print(f"2^3 = {math.pow(2, 3)}")      # 返回浮点数
print(f"2**3 = {2**3}")               # 内置运算符，保持类型
print(f"sqrt(16) = {math.sqrt(16)}")
```

### 三角函数

```python
# -*- coding: utf-8 -*-
import math

# 角度转换
degrees_90 = 90
radians_90 = math.radians(degrees_90)
print(f"90度 = {radians_90} 弧度")

# 三角函数
angle = math.pi / 4  # 45度
print(f"sin(π/4) = {math.sin(angle)}")
print(f"cos(π/4) = {math.cos(angle)}")
print(f"tan(π/4) = {math.tan(angle)}")

# 反三角函数
print(f"asin(0.5) = {math.asin(0.5)} 弧度")
print(f"asin(0.5) = {math.degrees(math.asin(0.5))} 度")

# 两点间距离和向量计算
point1 = (1, 1)
point2 = (4, 5)
distance = math.dist(point1, point2)
print(f"点({point1})到点({point2})的距离: {distance}")

# 直角三角形斜边长度
print(f"斜边长度 hypot(3, 4) = {math.hypot(3, 4)}")
```

### 双曲函数

```python
# -*- coding: utf-8 -*-
import math

x = 1.0
print(f"sinh({x}) = {math.sinh(x)}")    # 双曲正弦
print(f"cosh({x}) = {math.cosh(x)}")    # 双曲余弦
print(f"tanh({x}) = {math.tanh(x)}")    # 双曲正切

# 反双曲函数
print(f"asinh(1) = {math.asinh(1)}")
print(f"acosh(2) = {math.acosh(2)}")
print(f"atanh(0.5) = {math.atanh(0.5)}")
```

### 特殊函数与数值检测

```python
# -*- coding: utf-8 -*-
import math

# 特殊函数
print(f"gamma(5) = {math.gamma(5)}")     # Gamma函数 (4! = 24)
print(f"erf(1) = {math.erf(1)}")         # 误差函数

# 数值检测
values = [1.5, float('inf'), float('nan'), float('-inf')]
for val in values:
    print(f"值: {val}")
    print(f"  isfinite: {math.isfinite(val)}")
    print(f"  isinf: {math.isinf(val)}")
    print(f"  isnan: {math.isnan(val)}")

# 数值接近性判断
print(f"isclose(1.0, 1.0000001): {math.isclose(1.0, 1.0000001)}")
```

### 数学常量

```python
# -*- coding: utf-8 -*-
import math

print(f"π (pi) = {math.pi}")
print(f"e = {math.e}")
print(f"τ (tau) = {math.tau}")          # τ = 2π
print(f"正无穷 = {math.inf}")
print(f"负无穷 = {-math.inf}")
print(f"NaN = {math.nan}")

# 使用常量计算圆的面积和周长
radius = 5
area = math.pi * radius ** 2
circumference = 2 * math.pi * radius
print(f"半径{radius}的圆：面积={area:.2f}, 周长={circumference:.2f}")
```

## 💡 实际应用

### 1. 数学计算器功能

```python
# -*- coding: utf-8 -*-
import math

class MathCalculator:
    """简单的数学计算器"""
    
    @staticmethod
    def quadratic_formula(a, b, c):
        """求解二次方程 ax²+bx+c=0"""
        discriminant = b**2 - 4*a*c
        if discriminant < 0:
            return None  # 无实数解
        elif discriminant == 0:
            return -b / (2*a)  # 一个解
        else:
            sqrt_d = math.sqrt(discriminant)
            x1 = (-b + sqrt_d) / (2*a)
            x2 = (-b - sqrt_d) / (2*a)
            return x1, x2

    @staticmethod
    def triangle_area(a, b, c):
        """使用海伦公式计算三角形面积"""
        s = (a + b + c) / 2  # 半周长
        area = math.sqrt(s * (s-a) * (s-b) * (s-c))
        return area

# 使用示例
calc = MathCalculator()
print(f"方程 x²-5x+6=0 的解: {calc.quadratic_formula(1, -5, 6)}")
print(f"边长为 3,4,5 的三角形面积: {calc.triangle_area(3, 4, 5)}")
```

### 2. 统计函数实现

```python
# -*- coding: utf-8 -*-
import math

def standard_normal_cdf(x):
    """标准正态分布的累积分布函数"""
    return (1.0 + math.erf(x / math.sqrt(2.0))) / 2.0

def geometric_mean(values):
    """几何平均数"""
    if not values or any(v <= 0 for v in values):
        return None
    product = math.prod(values)
    return product ** (1.0 / len(values))

def harmonic_mean(values):
    """调和平均数"""
    if not values or any(v <= 0 for v in values):
        return None
    reciprocal_sum = sum(1.0/v for v in values)
    return len(values) / reciprocal_sum

# 使用示例
data = [2, 4, 8]
print(f"数据 {data}:")
print(f"几何平均数: {geometric_mean(data):.2f}")
print(f"调和平均数: {harmonic_mean(data):.2f}")
print(f"P(Z ≤ 1) = {standard_normal_cdf(1):.4f}")
```

### 3. 角度和坐标转换

```python
# -*- coding: utf-8 -*-
import math

def polar_to_cartesian(r, theta):
    """极坐标转直角坐标"""
    x = r * math.cos(theta)
    y = r * math.sin(theta)
    return x, y

def cartesian_to_polar(x, y):
    """直角坐标转极坐标"""
    r = math.hypot(x, y)
    theta = math.atan2(y, x)
    return r, theta

# 使用示例
r, theta = 5, math.pi/3  # 极坐标
x, y = polar_to_cartesian(r, theta)
print(f"极坐标 ({r}, {theta:.3f}) → 直角坐标 ({x:.2f}, {y:.2f})")

r2, theta2 = cartesian_to_polar(x, y)
print(f"验证转换: ({r2:.2f}, {theta2:.3f})")
```

## ⚠️ 注意事项

- **浮点精度**：使用 `math.fsum()` 代替 `sum()` 进行精确浮点求和
- **定义域限制**：注意函数的定义域，如 `math.sqrt()` 不能用于负数
- **角度单位**：三角函数使用弧度制，需要时使用 `math.degrees()` 和 `math.radians()` 转换
- **复数支持**：math 模块不支持复数，需要复数运算请使用 cmath 模块
- **无穷大和 NaN**：使用 `math.isfinite()`, `math.isinf()`, `math.isnan()` 检测特殊值

## 🔗 相关内容

- [cmath 模块](https://docs.python.org/3/library/cmath.html) - 复数数学函数
- [statistics 模块](https://docs.python.org/3/library/statistics.html) - 统计函数
- [random 模块](https://docs.python.org/3/library/random.html) - 随机数生成
- [decimal 模块](https://docs.python.org/3/library/decimal.html) - 高精度十进制运算
- [fractions 模块](https://docs.python.org/3/library/fractions.html) - 有理数运算

## 📚 扩展阅读

- [Python 官方文档 - math 模块](https://docs.python.org/3/library/math.html)
- [IEEE 754 浮点数标准](https://en.wikipedia.org/wiki/IEEE_754)
- [数学函数精度和特殊值处理](https://docs.python.org/3/tutorial/floatingpoint.html)

## 🏷️ 标签

`数学` `计算` `三角函数` `对数` `常量`

---

**原始文档内容参考**：

一、例子

二、模块

-----math-----

python math 模块提供了对 C 标准定义的数学函数的访问，该模块中的函数不能用于复数，如需支持复数，可使用 cmath 模块中的同名函数。

查看 math 模块的内容：

```text
>>> import math
>>> dir(math)
['__doc__', '__loader__', '__name__', '__package__', '__spec__', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atan2', 'atanh', 'ceil', 'comb', 'copysign', 'cos', 'cosh', 'degrees', 'dist', 'e', 'erf', 'erfc', 'exp', 'expm1', 'fabs', 'factorial', 'floor', 'fmod', 'frexp', 'fsum', 'gamma', 'gcd', 'hypot', 'inf', 'isclose', 'isfinite', 'isinf', 'isnan', 'isqrt', 'lcm', 'ldexp', 'lgamma', 'log', 'log10', 'log1p', 'log2', 'modf', 'nan', 'nextafter', 'perm', 'pi', 'pow', 'prod', 'radians', 'remainder', 'sin', 'sinh', 'sqrt', 'tan', 'tanh', 'tau', 'trunc', 'ulp']
>>> help(math)
```

注意：该模块所有函数的返回值类型若未明确说明，都为浮点数。

## 数论和表示函数

| 函数 | 描述 | 实例 |
| - | - | - |
| math.ceil(x) | 返回 >= x 的最小整数 (int) | >>> math.ceil(2.2)<br>3 |
| math.floor(x) | 返回 <= x 的最大整数 (int) | >>> math.floor(3.6)<br>3 |
| math.modf(x) | 返回 x 的小数部分和整数部分，两个结果都带有 x 的符号并且是浮点数。注意：Python 浮点数通常不超过 53 位的精度（与 C double 相同），任何 abs(x) >= 2**52 的浮点数 x 必然没有小数位。 | >>> math.modf(3.4)<br>(0.3999999999999999, 3.0)<br>>>math.modf(2**52+0.55)<br>(0.0, 4503599627370497.0) |
| math.comb(n, k) | 返回从 n 个项目中选出 k 个项目的方法数，不重复且无顺序，也称为二项式系数。当 k <= n 时，n! / (k! * (n - k)!)当 k > n 时，为 0 | >>> math.comb(3, 2)<br>3<br>>> math.comb(2, 3)<br>0 |
| math.perm(n, k=None) | 返回从 n 个项目中选择 k 个项目的方法数，不重复且有顺序。当 k <= n 时，n! / (n - k)!当 k > n 时，为 0当 k = None 时，k 默认为 n ，函数返回 n！ | >>> math.perm(3, 2)<br>6<br>>> math.perm(2, 3)<br>0 |
| math.copysign(x, y) | 返回一个大小为 x 的绝对值，符号同 y 的浮点数 | >>> math.copysign(1.2, -3)<br>-1.2<br>>> math.copysign(-1, 3)<br>1.0 |
| math.fabs(x) | 返回 x 的绝对值 | >>> math.fabs(-2)<br>2.0 |
| math.factorial(x) | 返回 x 的阶乘 (int) | >>> math.factorial(4)<br>24 |
| math.fmod(x, y) | 取余，与 x % y 可能会返回不同的结果math.fmod(x, y) 符号同 x，x % y 符号同 y在处理 float 时，通常首选函数 fmod()，而在处理 int 时，首选 x % y。 | >>> math.fmod(7, -2)<br>1.0<br>>> 7 % -2<br>-1 |
| math.remainder(x, y) | 取余（遵循 IEEE 754），若 x / y 正好位于两个连续整数的中间，则商使用最近的偶数 | >>> math.remainder(5, 2)<br>1.0<br>>> math.remainder(7, 2)<br>-1.0 |
| math.frexp(x) | 用以获得浮点数的内部表示，返回 x 的尾数和指数 (m, e)，m 为 float，e 为 int，x == m * 2**e。若 x 为 0，则返回 (0.0, 0)，否则 0.5 <= abs(m) < 1 | >>> math.frexp(3.4)<br>(0.85, 2) |
| math.ldexp(x, i) | 返回 x * (2**i)，本质上是函数 frexp() 的反函数 | >>> math.ldexp(0.85, 2)<br>3.4 |
| math.fsum(iterable) | 返回可迭代对象中值的准确浮点总和，通过跟踪多个中间部分的总和来避免精度损失 | >>> sum([.1]*10)<br>0.9999999999999999<br>>> math.fsum([.1]*10)<br>1.0 |
| math.gcd(*integers) | GCD: Greatest Common Divisor<br>返回所有参数 (int) 的最大公约数 | >>>math.gcd(4, 6, 8)<br>2 |
| math.lcm(*integers) | LCM: Least Common Multiple<br>返回所有参数 (int) 的最小公倍数 | >>>math.lcm(3, 5)<br>15 |
| math.isclose(a, b, *, rel_tol=1e09, abs_tol=0.0) | 根据给定的 rel_tol 和 abs_tol 确定 a, b 是否接近，rel_tol 是相对容差，abs_tol 是最小绝对容差。若 abs(a-b) <= max(rel_tol * max(abs(a), abs(b)), abs_tol)，返回 True | >>> math.isclose(3.4, 3.4)<br>True |
| math.isfinite(x) | 若 x 既不是无穷大也不是 NaN，则返回 True，否则返回 False | >>> math.isfinite(3.4)<br>True |
| math.isinf(x) | 若 x 是正无穷大或负无穷大，则返回 True，否则返回 False。 | >>> math.isinf(float('inf'))<br>True |
| math.isnan(x) | 若 x 是 NaN（非数），则返回 True，否则返回 False。 | >>> math.isnan(float('nan'))<br>True |
| math.isqrt(n) | ISqRt: Integer Square Root返回非负整数 n 的整数平方根 a ，使得 a²≤n | >>> math.isqrt(5)<br>2 |
| math.nextafter(x, y) | 返回 x 之后朝向 y 的下一个浮点值 | >>> math.nextafter(3, math.inf)<br>3.0000000000000004<br>>> math.nextafter(3, 0.0)<br>2.9999999999999996 |
| math.ulp(x) | ULP: Unit in the Last Place返回浮点数 x 的最低有效位的值,这样第一个大于 x 的浮点数是 x + ulp(x)。 | >>> math.ulp(3.4)<br>4.440892098500626e-16 |
| math.prod(iterable, *, start=1) | prod : product<br>返回 start 与 iterable 中各元素的乘积，若 iterable为空，则返回start | >>> math.prod((2, 3))<br>6<br>>> math.prod((2, 3), start=2)<br>12 |
| math.trunc(x) | trunc : truncate<br>将实数 x 截断为int (通常为 int) | >>> math.trunc(3.4)<br>3 |


## 幂函数和对数函数

| 函数 | 描述 | 实例 |
| - | - | - |
| math.exp(x) | 返回 e 的 x 次幂，其中 e = 2.718281……是自然对数的底。这通常比 math.e ** x 或 pow(math.e, x) 更准确 | >>> math.exp(2)<br>7.38905609893065 |
| math.expm1(x) | expm1: exp, minus 1<br>返回 e 的 x 次幂，减去 1。对于小浮点数 x，exp(x) - 1 会导致精度的显着损失；exp.m1() 函数提供了一种方法来计算到全精度 | >>> math.exp(1e-5) - 1<br>1.0000050000069649e-05<br>>> math.expm1(1e-5)<br>1.0000050000166667e-05 |
| math.log(x[, base]) | 返回以base为底，x 的对数，计算为 log(x)/log(base)。若未指定base，默认为e | >>> math.log(2)<br>0.6931471805599453<br>>> math.log(2, 2)<br>1.0 |
| math.log1p(x) | 返回 1+x（以 e 为底）的自然对数。结果的计算方式对于接近零的 x 是准确的 | >>> math.log1p(2)<br>1.0986122886681098 |
| math.log2(x) | 返回 x 的以 2 为底的对数。这通常比 log(x, 2) 更准确 | >>> math.log2(2)<br>1.0 |
| math.log10(x) | 返回 x 的以 10 为底的对数。这通常比 log(x, 10) 更准确 | >>> math.log10(100)<br>2.0 |
| math.pow(x, y) | 返回 x 的 y 次幂。与内置的 ** 运算符不同，math.pow() 将其两个参数都转换为 float 类型。使用 ** 或内置的 pow() 函数计算精确的整数幂。 | >>> math.pow(2, 3)<br>8.0<br>>> pow(2, 3)<br>8 |
| math.sqrt((x) | 返回 x 的平方根 (square root) | >>> math.sqrt(4)<br>2.0 |


## 三角函数

| 函数 | 描述 | 实例 |
| - | - | - |
| math.sin(x) | sin : sine<br>返回 x 弧度的正弦值 | >>> math.sin(math.pi/2)<br>1.0 |
| math.asin(x) | asin : arc sine<br>返回 x 的反正弦，单位：弧度。结果在 -pi/2 和 pi/2 之间 | >>> math.asin(1)<br>1.5707963267948966 |
| math.cos(x) | cos : cosine<br>返回 x 弧度的余弦值 | >>> math.cos(math.pi)<br>-1.0 |
| math.acos(x) | acos : arc cosine<br>返回 x 的反余弦值，单位：弧度。结果在 0 和 pi 之间 | >>> math.acos(-1)<br>3.141592653589793 |
| math.tan(x) | tan : tangent<br>返回 x 弧度的切线 | >>> math.tan(math.pi/4)<br>0.9999999999999999 |
| math.atan(x) | atan : arc tangent<br>返回 x 的反正切，单位：弧度。结果介于 -pi/2 和 pi/2 之间。 | >>> math.atan(1)<br>0.7853981633974483 |
| math.atan2(y, x) | 返回平面中从原点到点 (x, y) 的向量与正 X 轴形成的角度 atan(y / x)，单位：弧度。结果介于 -pi 和 pi 之间。 | >>> math.atan2(1, 1)<br>0.7853981633974483 |
| math.dist(p, q) | dist : distance<br>返回两点 p 和 q 之间的欧几里得距离，每个点都作为坐标序列（或可迭代）给出。这两个点必须具有相同的维度。大致相当于：sqrt(sum((px - qx) ** 2.0 for px, qx in zip(p, q))) | >>> math.dist((1, 1), (2, 2))<br>1.4142135623730951 |
| math.hypot(*coordinates) | hypot : hypotenuse （斜边）<br>返回欧几里得范数，sqrt(sum(x**2 for x in coordinates))。这是从原点到坐标给定点的向量的长度。对于二维点 (x, y)，这等效于使用勾股定理 sqrt(x*x + y*y) 计算直角三角形的斜边。3.8 版之前仅支持二维，之后添加了对n维点的支持。 | >>> math.hypot(1, 1)<br>1.4142135623730951 |


## 角度转换

| 函数 | 描述 | 实例 |
| - | - | - |
| math.degrees(x) | 将角度 x 从弧度转换为度数 | >>> math.degrees(math.pi)<br>180.0 |
| math.radians(x) | 将角度 x 从度数转换为弧度 | >>> math.radians(180)<br>3.141592653589793 |


## 双曲函数

| 函数 | 描述 |
| - | - |
| math.cosh(x) | 返回 x 的双曲余弦值, h : hyperbolic |
| math.acosh(x) | 返回 x 的反双曲余弦值, a: arc |
| math.sinh(x) | 返回 x 的双曲正弦值 |
| math.asinh(x) | 返回 x 的反双曲正弦值 |
| math.tanh(x) | 返回 x 的双曲正切值 |
| math.atanh(x) | 返回 x 的反双曲正切值 |


## 特殊函数

| 函数 | 描述 |
| - | - |
| math.erf(x) | erf : error function<br>返回 x 处的误差函数。可用于计算传统的统计函数，例如累积标准正态分布(cumulative standard normal distribution):def phi(x): 'Cumulative distribution function for the standard normal distribution' return (1.0 + erf(x / sqrt(2.0))) / 2.0 |
| math.erfc(x) | c : complementary<br>返回 x 处的互补误差函数。互补误差函数定义为 1.0 - erf(x)，它用于较大的 x 值（从 1 中减去会导致显着性损失）。 |
| math.gamma(x) | 返回 x 处的 Gamma 函数 |
| math.lgamma(x) | l : logarithm<br>返回 Gamma 函数在 x 处的绝对值的自然对数 |


## 常数

| 函数 | 描述 |
| - | - |
| math.pi | 数学常数 π = 3.141592…，达到可用精度 |
| math.e | 数学常数 e = 2.718281…，达到可用精度 |
| math.tau | 数学常数 τ = 6.283185…，达到可用精度。Tau 是一个圆常数，等于 2π，即圆的周长与其半径的比值。要了解有关 Tau 的更多信息，请观看 Vi Hart 的视频 Pi is (still) Wrong |
| math.inf | 浮点正无穷大，相当于 float('inf') 的输出。负无穷大：-math.inf |
| math.nan | 浮点"非数”(NaN) 值，相当于 float('nan') 的输出 |

---

**最后更新**: 2024-12-19  
**作者**: Python教程  
**版本**: 1.0