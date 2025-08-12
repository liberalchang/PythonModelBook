---
title: "NumPy 基础操作"
author: "Python技术文档工程师"
date: "2024-01-15"
version: "1.0.0"
python_version: "3.8+"
library_version: "numpy>=1.20.0"
tags: ["numpy", "数组", "数值计算", "科学计算", "线性代数"]
difficulty: "初级"
estimated_time: "45分钟"
---

# NumPy 基础操作

## 📝 概述

NumPy（Numerical Python）是Python中最重要的科学计算库，提供了高性能的多维数组对象和用于处理这些数组的工具。本文档介绍NumPy的基础概念、数组创建、基本操作和常用功能。

## 🎯 学习目标

- 理解NumPy数组（ndarray）的基本概念和属性
- 掌握各种数组创建方法
- 学会数组的基本运算和操作
- 了解数组的索引、切片和布尔索引
- 掌握数组的形状变换和轴操作

## 📋 前置知识

- Python基础语法
- 列表和元组的基本操作
- 基本的数学概念（矩阵、向量）

## 🔍 详细内容

### 数组的基本概念

#### ndarray的核心属性

```python
import numpy as np

# 创建一个示例数组
arr = np.array([[1, 2, 3], [4, 5, 6]])

# 查看数组的基本属性
print(f"数组形状: {arr.shape}")      # (2, 3)
print(f"数组维度: {arr.ndim}")       # 2
print(f"数据类型: {arr.dtype}")      # int64
print(f"元素总数: {arr.size}")       # 6
print(f"每个元素字节数: {arr.itemsize}")  # 8
```

#### 轴（axis）的概念

```python
# 对于2维数组：axis=0表示行方向，axis=1表示列方向
arr_2d = np.array([[1, 2, 3], [4, 5, 6]])
print(f"沿axis=0求和: {np.sum(arr_2d, axis=0)}")  # [5 7 9]
print(f"沿axis=1求和: {np.sum(arr_2d, axis=1)}")  # [6 15]

# 对于3维数组：axis=0是最外层，然后依次向内
arr_3d = np.array([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])
print(f"3维数组形状: {arr_3d.shape}")  # (2, 2, 2)
```

### 数组创建方法

#### 基本创建函数

| 函数 | 描述 | 示例 |
|------|------|------|
| `array` | 从列表、元组等序列创建数组 | `np.array([1, 2, 3])` |
| `asarray` | 转换为数组，如果已是数组则不复制 | `np.asarray([1, 2, 3])` |
| `arange` | 类似range的数组版本 | `np.arange(0, 10, 2)` |
| `linspace` | 在指定区间内生成等间距数组 | `np.linspace(0, 1, 5)` |

```python
# 从Python列表创建数组
list_data = [1, 2, 3, 4, 5]
arr_from_list = np.array(list_data)
print(f"从列表创建: {arr_from_list}")

# 使用arange创建等差数组
arr_range = np.arange(0, 10, 2)  # [0 2 4 6 8]
print(f"arange创建: {arr_range}")

# 使用linspace创建等间距数组
arr_linspace = np.linspace(0, 1, 5)  # [0.   0.25 0.5  0.75 1.  ]
print(f"linspace创建: {arr_linspace}")
```

#### 特殊值数组创建

```python
# 全零数组
zeros_arr = np.zeros((3, 4))  # 3行4列的全零数组
print(f"全零数组:\n{zeros_arr}")

# 全一数组
ones_arr = np.ones((2, 3), dtype=np.int32)  # 指定数据类型
print(f"全一数组:\n{ones_arr}")

# 单位矩阵
eye_arr = np.eye(3)  # 3x3单位矩阵
print(f"单位矩阵:\n{eye_arr}")

# 指定值填充的数组
full_arr = np.full((2, 3), 7)  # 用7填充的2x3数组
print(f"指定值数组:\n{full_arr}")

# 未初始化数组（值不确定）
empty_arr = np.empty((2, 2))
print(f"空数组:\n{empty_arr}")
```

#### 随机数组创建

```python
# 设置随机种子以获得可重复结果
np.random.seed(42)

# 标准正态分布随机数
randn_arr = np.random.randn(3, 3)
print(f"标准正态分布:\n{randn_arr}")

# 均匀分布随机数
rand_arr = np.random.rand(2, 4)  # [0, 1)区间
print(f"均匀分布:\n{rand_arr}")

# 指定范围的随机整数
randint_arr = np.random.randint(1, 10, size=(3, 3))
print(f"随机整数:\n{randint_arr}")
```

### 数据类型和类型转换

#### NumPy数据类型

| 类型 | 类型代码 | 描述 |
|------|----------|------|
| `int8`, `uint8` | `i1`, `u1` | 8位有符号/无符号整数 |
| `int16`, `uint16` | `i2`, `u2` | 16位有符号/无符号整数 |
| `int32`, `uint32` | `i4`, `u4` | 32位有符号/无符号整数 |
| `int64`, `uint64` | `i8`, `u8` | 64位有符号/无符号整数 |
| `float16` | `f2` | 半精度浮点数 |
| `float32` | `f4` | 单精度浮点数 |
| `float64` | `f8` | 双精度浮点数 |
| `complex64` | `c8` | 64位复数 |
| `bool` | `?` | 布尔类型 |

```python
# 创建时指定数据类型
int_arr = np.array([1, 2, 3], dtype=np.int32)
float_arr = np.array([1.0, 2.0, 3.0], dtype=np.float32)

print(f"整数数组类型: {int_arr.dtype}")
print(f"浮点数组类型: {float_arr.dtype}")

# 类型转换
original = np.array([1.7, 2.3, 3.9])
int_converted = original.astype(np.int32)
print(f"原数组: {original}")
print(f"转换后: {int_converted}")

# 使用另一个数组的数据类型
template = np.array([1, 2, 3], dtype=np.float64)
converted = original.astype(template.dtype)
print(f"使用模板类型转换: {converted}")
```

### 数组的转置和轴变换

转置是一种特殊的数据重组形式，可以返回底层数据的视图而不需要复制任何内容。数组拥有transpose方法，也有特殊的T属性。

![数组轴的概念图](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCEf5e4f2b12cc69b72f344ded4b444d9ea.png)

```python
# 创建示例数组
arr = np.arange(12).reshape(3, 4)
print(f"原数组:\n{arr}")

# 转置操作
transposed = arr.T  # 或者 arr.transpose()
print(f"转置后:\n{transposed}")

# 示例：转置操作
a = np.arange(15).reshape(5, 3)
print(a.T)
# 返回结果：
# [[ 0  3  6  9 12]
#  [ 1  4  7 10 13]
#  [ 2  5  8 11 14]]

# 高维数组的轴变换
arr_3d = np.arange(24).reshape(2, 3, 4)
print(f"3D数组形状: {arr_3d.shape}")

# 指定轴的顺序进行转置
transposed_3d = arr_3d.transpose(1, 0, 2)  # 交换轴0和轴1
print(f"轴变换后形状: {transposed_3d.shape}")

# 交换任意两个轴
swapped = arr_3d.swapaxes(0, 2)  # 交换轴0和轴2
print(f"轴交换后形状: {swapped.shape}")
```

### 数组的基本运算

#### 算术运算

```python
# 创建示例数组
a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])

# 基本算术运算（元素级别）
print(f"加法:\n{a + b}")
print(f"减法:\n{a - b}")
print(f"乘法:\n{a * b}")
print(f"除法:\n{a / b}")
print(f"幂运算:\n{a ** 2}")

# 与标量的运算
print(f"数组乘以标量:\n{a * 3}")
print(f"数组加标量:\n{a + 10}")
```

#### 比较运算和布尔操作

```python
# 比较运算
arr = np.array([1, 2, 3, 4, 5])
print(f"大于3: {arr > 3}")  # [False False False  True  True]
print(f"等于3: {arr == 3}")  # [False False  True False False]

# 布尔索引
filtered = arr[arr > 3]  # 选择大于3的元素
print(f"筛选结果: {filtered}")  # [4 5]

# 复合条件
complex_filter = (arr > 2) & (arr < 5)  # 注意使用&而不是and
print(f"复合条件: {arr[complex_filter]}")  # [3 4]

# 布尔数组的统计
print(f"满足条件的元素个数: {(arr > 3).sum()}")
print(f"是否有元素大于10: {(arr > 10).any()}")
print(f"是否所有元素都大于0: {(arr > 0).all()}")
```

### 数组索引和切片

#### 基本索引

```python
# 一维数组索引
arr_1d = np.arange(10)
print(f"第3个元素: {arr_1d[2]}")
print(f"最后一个元素: {arr_1d[-1]}")
print(f"切片[2:7]: {arr_1d[2:7]}")

# 二维数组索引
arr_2d = np.arange(12).reshape(3, 4)
print(f"第2行第3列: {arr_2d[1, 2]}")
print(f"第2行所有列: {arr_2d[1, :]}")
print(f"所有行第3列: {arr_2d[:, 2]}")
print(f"子矩阵: \n{arr_2d[1:3, 1:3]}")
```

#### 花式索引

```python
# 使用整数数组进行索引
arr = np.arange(20)
indices = [1, 3, 5, 7]
print(f"花式索引结果: {arr[indices]}")

# 二维数组的花式索引
arr_2d = np.arange(12).reshape(3, 4)
row_indices = [0, 2]
col_indices = [1, 3]
print(f"选择特定位置: {arr_2d[row_indices, col_indices]}")

# 组合使用
print(f"选择多行: \n{arr_2d[[0, 2]]}")
print(f"选择多行多列: \n{arr_2d[[0, 2]][:, [1, 3]]}")
```

### 数组形状操作

#### reshape和resize

```python
# reshape：返回新视图，不改变原数组
arr = np.arange(12)
reshaped = arr.reshape(3, 4)
print(f"重塑为3x4:\n{reshaped}")

# 自动计算维度
auto_reshaped = arr.reshape(3, -1)  # -1表示自动计算
print(f"自动计算维度:\n{auto_reshaped}")

# resize：直接修改原数组
arr_copy = arr.copy()
arr_copy.resize(2, 6)
print(f"resize后:\n{arr_copy}")
```

#### 数组展平

```python
arr_2d = np.arange(12).reshape(3, 4)

# flatten：返回副本
flattened = arr_2d.flatten()
print(f"flatten结果: {flattened}")

# ravel：返回视图（如果可能）
raveled = arr_2d.ravel()
print(f"ravel结果: {raveled}")

# 验证是否为视图
raveled[0] = 999
print(f"修改ravel后原数组:\n{arr_2d}")  # 原数组也会改变
```

## 💡 实际应用

### 基础用法示例

```python
# 计算数组的基本统计信息
data = np.random.randn(1000)
print(f"均值: {np.mean(data):.4f}")
print(f"标准差: {np.std(data):.4f}")
print(f"最大值: {np.max(data):.4f}")
print(f"最小值: {np.min(data):.4f}")
```

### 矩阵运算示例

```python
# 矩阵乘法
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# 元素级乘法
element_wise = A * B
print(f"元素级乘法:\n{element_wise}")

# 矩阵乘法
matrix_mult = np.dot(A, B)  # 或者 A @ B
print(f"矩阵乘法:\n{matrix_mult}")
```

### 数据处理示例

```python
# 处理缺失值
data_with_nan = np.array([1.0, 2.0, np.nan, 4.0, 5.0])

# 检测NaN
nan_mask = np.isnan(data_with_nan)
print(f"NaN位置: {nan_mask}")

# 移除NaN
clean_data = data_with_nan[~nan_mask]
print(f"清理后数据: {clean_data}")

# 用0替换NaN
data_filled = np.where(np.isnan(data_with_nan), 0, data_with_nan)
print(f"填充后数据: {data_filled}")
```

## ⚠️ 注意事项

1. **数组切片返回视图**：修改切片会影响原数组
2. **数据类型转换**：可能导致精度损失或溢出
3. **广播规则**：不同形状数组运算时要注意广播规则
4. **内存使用**：大数组操作时注意内存消耗
5. **布尔运算符**：使用`&`、`|`、`~`而不是`and`、`or`、`not`

## 🔗 相关内容

- [NumPy 数学函数和统计](./numpy-math/)
- [NumPy 线性代数](./numpy-linalg/)
- [NumPy 随机数生成](./numpy-random/)
- [NumPy 文件输入输出](./numpy-io/)

## 📚 扩展阅读

- [NumPy官方文档](https://numpy.org/doc/stable/)
- [NumPy用户指南](https://numpy.org/doc/stable/user/index.html)
- [NumPy API参考](https://numpy.org/doc/stable/reference/index.html)
- [Python数据科学手册](https://jakevdp.github.io/PythonDataScienceHandbook/)

## 🏷️ 标签

`numpy` `数组` `数值计算` `科学计算` `线性代数` `数据类型` `索引` `切片` `形状操作`

---

**最后更新**: 2024-01-15  
**作者**: Python技术文档工程师  
**版本**: 1.0.0