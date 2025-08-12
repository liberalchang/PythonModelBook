---
title: "NumPy 数学函数与统计分析"
author: "Python技术文档工程师"
date: "2024-01-15"
version: "1.0.0"
python_version: "3.8+"
library_version: "numpy>=1.20.0"
tags: ["numpy", "数学函数", "统计分析", "通用函数", "线性代数"]
difficulty: "中级"
estimated_time: "40分钟"
permalink: /docs/thirdparty/numpy-math/
---

# NumPy 数学函数与统计分析

## 📝 概述

NumPy提供了丰富的数学函数和统计分析工具，包括基本数学运算、三角函数、指数对数函数、统计函数等。这些函数都是向量化的，能够高效地处理数组数据。

## 🎯 学习目标

- 掌握NumPy的通用函数（ufunc）概念
- 学会使用各种数学函数进行数值计算
- 了解统计分析函数的使用方法
- 掌握线性代数相关函数
- 学会处理特殊值（NaN、无穷大等）

## 📋 前置知识

- NumPy基础操作
- 基本的数学概念（三角函数、对数、统计学基础）
- 线性代数基础知识

## 🔍 详细内容

### 通用函数（Universal Functions）

#### 一元通用函数

| 函数 | 描述 | 示例 |
|------|------|------|
| `abs`, `fabs` | 绝对值 | `np.abs([-1, -2, 3])` |
| `sqrt` | 平方根 | `np.sqrt([1, 4, 9])` |
| `square` | 平方 | `np.square([1, 2, 3])` |
| `exp` | 自然指数e^x | `np.exp([0, 1, 2])` |
| `log`, `log10`, `log2` | 对数函数 | `np.log([1, np.e, 10])` |
| `sign` | 符号函数 | `np.sign([-2, 0, 3])` |
| `ceil`, `floor` | 向上/向下取整 | `np.ceil([1.2, 2.7])` |
| `rint` | 四舍五入到最近整数 | `np.rint([1.2, 2.7])` |
| `isnan`, `isfinite`, `isinf` | 检测特殊值 | `np.isnan([1, np.nan])` |

```python
import numpy as np

# 基本数学函数示例
arr = np.array([-2.5, -1.0, 0, 1.5, 2.7])

print(f"原数组: {arr}")
print(f"绝对值: {np.abs(arr)}")
print(f"向上取整: {np.ceil(arr)}")
print(f"向下取整: {np.floor(arr)}")
print(f"四舍五入: {np.rint(arr)}")
print(f"符号: {np.sign(arr)}")

# 指数和对数函数
positive_arr = np.array([1, 2, 4, 8])
print(f"\n指数函数: {np.exp(positive_arr)}")
print(f"自然对数: {np.log(positive_arr)}")
print(f"以10为底: {np.log10(positive_arr)}")
print(f"以2为底: {np.log2(positive_arr)}")
```

#### 三角函数

```python
# 角度和弧度转换
angles_deg = np.array([0, 30, 45, 60, 90])
angles_rad = np.deg2rad(angles_deg)  # 转换为弧度

print(f"角度: {angles_deg}")
print(f"弧度: {angles_rad}")

# 三角函数
print(f"\n正弦值: {np.sin(angles_rad)}")
print(f"余弦值: {np.cos(angles_rad)}")
print(f"正切值: {np.tan(angles_rad)}")

# 反三角函数
values = np.array([0, 0.5, 0.707, 0.866, 1])
print(f"\n反正弦: {np.rad2deg(np.arcsin(values))}")
print(f"反余弦: {np.rad2deg(np.arccos(values))}")
print(f"反正切: {np.rad2deg(np.arctan(values))}")

# 双曲函数
print(f"\n双曲正弦: {np.sinh([0, 1, 2])}")
print(f"双曲余弦: {np.cosh([0, 1, 2])}")
print(f"双曲正切: {np.tanh([0, 1, 2])}")
```

#### 二元通用函数

| 函数 | 描述 | 示例 |
|------|------|------|
| `add`, `subtract` | 加法、减法 | `np.add(a, b)` |
| `multiply`, `divide` | 乘法、除法 | `np.multiply(a, b)` |
| `power` | 幂运算 | `np.power(a, b)` |
| `mod` | 取模运算 | `np.mod(a, b)` |
| `maximum`, `minimum` | 逐元素最大值/最小值 | `np.maximum(a, b)` |
| `greater`, `less` | 比较运算 | `np.greater(a, b)` |
| `logical_and`, `logical_or` | 逻辑运算 | `np.logical_and(a, b)` |

```python
# 二元函数示例
a = np.array([1, 2, 3, 4, 5])
b = np.array([5, 4, 3, 2, 1])

print(f"数组a: {a}")
print(f"数组b: {b}")
print(f"逐元素最大值: {np.maximum(a, b)}")
print(f"逐元素最小值: {np.minimum(a, b)}")
print(f"幂运算a^b: {np.power(a, b)}")
print(f"取模运算: {np.mod(a, b)}")

# 比较和逻辑运算
print(f"\na > b: {np.greater(a, b)}")
print(f"a == b: {np.equal(a, b)}")
print(f"逻辑与: {np.logical_and(a > 2, b > 2)}")
print(f"逻辑或: {np.logical_or(a > 4, b > 4)}")
```

### 统计函数

#### 基本统计量

```python
# 创建示例数据
np.random.seed(42)
data = np.random.randn(100)
data_2d = np.random.randn(10, 8)

# 基本统计函数
print(f"数据形状: {data.shape}")
print(f"均值: {np.mean(data):.4f}")
print(f"中位数: {np.median(data):.4f}")
print(f"标准差: {np.std(data):.4f}")
print(f"方差: {np.var(data):.4f}")
print(f"最大值: {np.max(data):.4f}")
print(f"最小值: {np.min(data):.4f}")
print(f"极差: {np.ptp(data):.4f}")  # peak to peak

# 分位数
percentiles = [25, 50, 75, 90, 95]
print(f"\n分位数:")
for p in percentiles:
    value = np.percentile(data, p)
    print(f"{p}%分位数: {value:.4f}")
```

#### 沿轴统计

```python
# 二维数组的轴向统计
print(f"\n2D数组形状: {data_2d.shape}")
print(f"沿axis=0的均值 (列均值): {np.mean(data_2d, axis=0)}")
print(f"沿axis=1的均值 (行均值): {np.mean(data_2d, axis=1)}")

# 累积统计
print(f"\n累积和: {np.cumsum([1, 2, 3, 4, 5])}")
print(f"累积积: {np.cumprod([1, 2, 3, 4, 5])}")

# 差分
arr = np.array([1, 3, 6, 10, 15])
print(f"\n原数组: {arr}")
print(f"一阶差分: {np.diff(arr)}")
print(f"二阶差分: {np.diff(arr, n=2)}")
```

#### 统计函数汇总表

| 函数 | 描述 | 可选参数 |
|------|------|----------|
| `sum` | 求和 | `axis`, `keepdims` |
| `mean` | 算术平均值 | `axis`, `keepdims` |
| `median` | 中位数 | `axis`, `keepdims` |
| `std` | 标准差 | `axis`, `ddof`, `keepdims` |
| `var` | 方差 | `axis`, `ddof`, `keepdims` |
| `min`, `max` | 最小值、最大值 | `axis`, `keepdims` |
| `argmin`, `argmax` | 最小值、最大值的索引 | `axis` |
| `ptp` | 极差（最大值-最小值） | `axis`, `keepdims` |
| `percentile` | 百分位数 | `q`, `axis` |
| `quantile` | 分位数 | `q`, `axis` |

```python
# 统计函数的高级用法
data_3d = np.random.randn(4, 5, 6)

# 保持维度
mean_keepdims = np.mean(data_3d, axis=1, keepdims=True)
print(f"保持维度的均值形状: {mean_keepdims.shape}")

# 多轴统计
mean_multi_axis = np.mean(data_3d, axis=(0, 2))
print(f"多轴均值形状: {mean_multi_axis.shape}")

# 自由度调整的标准差
std_ddof0 = np.std(data, ddof=0)  # 总体标准差
std_ddof1 = np.std(data, ddof=1)  # 样本标准差
print(f"\n总体标准差: {std_ddof0:.4f}")
print(f"样本标准差: {std_ddof1:.4f}")
```

### 线性代数函数

#### 基本线性代数运算

```python
# 矩阵运算
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
v = np.array([1, 2])

print(f"矩阵A:\n{A}")
print(f"矩阵B:\n{B}")
print(f"向量v: {v}")

# 矩阵乘法
print(f"\n矩阵乘法 A@B:\n{A @ B}")
print(f"矩阵向量乘法 A@v: {A @ v}")

# 点积
print(f"向量点积: {np.dot(v, v)}")

# 矩阵的迹
print(f"矩阵A的迹: {np.trace(A)}")

# 矩阵的行列式
print(f"矩阵A的行列式: {np.linalg.det(A)}")

# 矩阵的逆
if np.linalg.det(A) != 0:
    A_inv = np.linalg.inv(A)
    print(f"矩阵A的逆:\n{A_inv}")
    print(f"验证 A @ A_inv:\n{A @ A_inv}")
```

#### 特征值和特征向量

```python
# 对称矩阵的特征值分解
S = np.array([[3, 1], [1, 3]])
eigenvalues, eigenvectors = np.linalg.eig(S)

print(f"对称矩阵S:\n{S}")
print(f"特征值: {eigenvalues}")
print(f"特征向量:\n{eigenvectors}")

# 验证特征值和特征向量
for i in range(len(eigenvalues)):
    lambda_i = eigenvalues[i]
    v_i = eigenvectors[:, i]
    print(f"\n验证特征值{i+1}:")
    print(f"S @ v = {S @ v_i}")
    print(f"λ * v = {lambda_i * v_i}")
```

#### 矩阵分解

```python
# QR分解
A = np.random.randn(4, 3)
Q, R = np.linalg.qr(A)

print(f"原矩阵A形状: {A.shape}")
print(f"Q矩阵形状: {Q.shape}")
print(f"R矩阵形状: {R.shape}")
print(f"验证QR分解: {np.allclose(Q @ R, A)}")

# SVD分解
U, s, Vt = np.linalg.svd(A)
print(f"\nSVD分解:")
print(f"U形状: {U.shape}")
print(f"奇异值: {s}")
print(f"Vt形状: {Vt.shape}")

# 重构矩阵
S_matrix = np.zeros((U.shape[1], Vt.shape[0]))
np.fill_diagonal(S_matrix, s)
A_reconstructed = U @ S_matrix @ Vt
print(f"重构验证: {np.allclose(A, A_reconstructed)}")
```

#### 线性方程组求解

```python
# 求解线性方程组 Ax = b
A = np.array([[2, 1], [1, 3]])
b = np.array([3, 4])

# 直接求解
x = np.linalg.solve(A, b)
print(f"方程组解: {x}")
print(f"验证: A @ x = {A @ x}, b = {b}")

# 最小二乘解（超定系统）
A_overdetermined = np.array([[1, 1], [1, 2], [1, 3]])
b_overdetermined = np.array([2, 3, 4])
x_lstsq = np.linalg.lstsq(A_overdetermined, b_overdetermined, rcond=None)[0]
print(f"\n最小二乘解: {x_lstsq}")
```

### 特殊值处理

#### NaN和无穷大处理

```python
# 创建包含特殊值的数组
data_with_special = np.array([1.0, 2.0, np.nan, 4.0, np.inf, -np.inf])
print(f"原数据: {data_with_special}")

# 检测特殊值
print(f"NaN位置: {np.isnan(data_with_special)}")
print(f"无穷大位置: {np.isinf(data_with_special)}")
print(f"有限值位置: {np.isfinite(data_with_special)}")

# 忽略NaN的统计函数
print(f"\n忽略NaN的均值: {np.nanmean(data_with_special)}")
print(f"忽略NaN的标准差: {np.nanstd(data_with_special)}")
print(f"忽略NaN的最大值: {np.nanmax(data_with_special)}")

# 替换特殊值
clean_data = np.where(np.isfinite(data_with_special), data_with_special, 0)
print(f"清理后数据: {clean_data}")
```

#### 数值稳定性

```python
# 避免数值下溢的log-sum-exp技巧
def logsumexp(x):
    """数值稳定的log-sum-exp计算"""
    x_max = np.max(x)
    return x_max + np.log(np.sum(np.exp(x - x_max)))

# 示例：大数值的log-sum-exp
large_values = np.array([1000, 1001, 1002])
print(f"大数值: {large_values}")
print(f"稳定的log-sum-exp: {logsumexp(large_values)}")

# 直接计算会溢出
try:
    direct_result = np.log(np.sum(np.exp(large_values)))
    print(f"直接计算结果: {direct_result}")
except:
    print("直接计算导致溢出")
```

## 💡 实际应用

### 数据标准化

```python
# Z-score标准化
def zscore_normalize(data):
    """Z-score标准化"""
    return (data - np.mean(data)) / np.std(data)

# Min-Max标准化
def minmax_normalize(data, feature_range=(0, 1)):
    """Min-Max标准化"""
    min_val, max_val = feature_range
    data_min, data_max = np.min(data), np.max(data)
    return (data - data_min) / (data_max - data_min) * (max_val - min_val) + min_val

# 示例
raw_data = np.random.randn(100) * 10 + 50
zscore_data = zscore_normalize(raw_data)
minmax_data = minmax_normalize(raw_data)

print(f"原始数据 - 均值: {np.mean(raw_data):.2f}, 标准差: {np.std(raw_data):.2f}")
print(f"Z-score标准化 - 均值: {np.mean(zscore_data):.2f}, 标准差: {np.std(zscore_data):.2f}")
print(f"Min-Max标准化 - 最小值: {np.min(minmax_data):.2f}, 最大值: {np.max(minmax_data):.2f}")
```

### 相关性分析

```python
# 计算相关系数矩阵
np.random.seed(42)
n_samples, n_features = 100, 4
data_matrix = np.random.randn(n_samples, n_features)

# 添加一些相关性
data_matrix[:, 1] = data_matrix[:, 0] + 0.5 * np.random.randn(n_samples)
data_matrix[:, 2] = -data_matrix[:, 0] + 0.3 * np.random.randn(n_samples)

# 计算相关系数矩阵
corr_matrix = np.corrcoef(data_matrix.T)
print(f"相关系数矩阵:\n{corr_matrix}")

# 协方差矩阵
cov_matrix = np.cov(data_matrix.T)
print(f"\n协方差矩阵:\n{cov_matrix}")
```

### 信号处理示例

```python
# 生成信号
t = np.linspace(0, 1, 1000)
frequency1, frequency2 = 5, 20
signal = np.sin(2 * np.pi * frequency1 * t) + 0.5 * np.sin(2 * np.pi * frequency2 * t)
noise = 0.2 * np.random.randn(len(t))
noisy_signal = signal + noise

# 简单的移动平均滤波
window_size = 10
filtered_signal = np.convolve(noisy_signal, np.ones(window_size)/window_size, mode='same')

print(f"原始信号均值: {np.mean(signal):.4f}")
print(f"噪声信号均值: {np.mean(noisy_signal):.4f}")
print(f"滤波后信号均值: {np.mean(filtered_signal):.4f}")
print(f"滤波效果 (噪声减少): {np.std(noisy_signal - signal):.4f} -> {np.std(filtered_signal - signal):.4f}")
```

## ⚠️ 注意事项

1. **数值精度**：浮点数运算可能存在精度问题
2. **特殊值处理**：注意NaN和无穷大值的传播
3. **内存使用**：大数组的数学运算可能消耗大量内存
4. **广播规则**：确保理解NumPy的广播机制
5. **线性代数**：注意矩阵的条件数和数值稳定性

## 🔗 相关内容

- [NumPy 基础操作](../numpy-basics/)
- [NumPy 随机数生成](../numpy-random/)
- [NumPy 高级索引](../numpy-advanced/)
- [SciPy 科学计算](../scipy/)

## 📚 扩展阅读

- [NumPy数学函数文档](https://numpy.org/doc/stable/reference/routines.math.html)
- [NumPy统计函数文档](https://numpy.org/doc/stable/reference/routines.statistics.html)
- [NumPy线性代数文档](https://numpy.org/doc/stable/reference/routines.linalg.html)
- [数值分析教程](https://en.wikipedia.org/wiki/Numerical_analysis)

## 🏷️ 标签

`numpy` `数学函数` `统计分析` `线性代数` `通用函数` `数值计算` `特征值` `矩阵分解`

---

**最后更新**: 2024-01-15  
**作者**: Python技术文档工程师  
**版本**: 1.0.0