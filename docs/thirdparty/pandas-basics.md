---
title: "Pandas 基础操作"
author: "Python技术文档工程师"
date: "2024-01-15"
version: "1.0.0"
python_version: "3.8+"
library_version: "pandas>=1.3.0"
tags: ["pandas", "数据分析", "DataFrame", "Series", "数据处理"]
difficulty: "初级"
estimated_time: "45分钟"
permalink: /docs/thirdparty/pandas-basics/
---

# Pandas 基础操作

## 📋 概述

Pandas是Python中最重要的数据分析库之一，提供了高性能、易用的数据结构和数据分析工具。本文档详细介绍Pandas的基础操作，包括Series和DataFrame的创建、索引、切片、数据对齐、排序排名等核心功能。

## 🎯 学习目标

通过本文档的学习，您将能够：

- 掌握Series和DataFrame的创建和基本操作
- 理解Pandas的索引机制和数据对齐原理
- 熟练使用各种数据选择和过滤方法
- 掌握数据排序、排名和统计分析功能
- 了解唯一值处理和成员属性检查

## 📚 前置知识

- Python基础语法
- NumPy基础操作
- 基本的数据结构概念

## 📖 详细内容

### 基本概念

#### Series - 一维数据结构

Series是带有标签的一维数组，可以保存任何数据类型。

```python
import pandas as pd
import numpy as np

# 创建Series
s = pd.Series([1, 3, 5, np.nan, 6, 8])
print(s)

# 带索引的Series
s_indexed = pd.Series([1, 2, 3, 4], index=['a', 'b', 'c', 'd'])
print(s_indexed)

# 从字典创建Series
dict_data = {'a': 1, 'b': 2, 'c': 3}
s_dict = pd.Series(dict_data)
print(s_dict)
```

#### DataFrame - 二维数据结构

DataFrame是二维的标签化数据结构，类似于电子表格或SQL表。

```python
# 创建DataFrame
data = {
    '姓名': ['张三', '李四', '王五'],
    '年龄': [25, 30, 35],
    '城市': ['北京', '上海', '广州']
}
df = pd.DataFrame(data)
print(df)

# 指定索引
df_indexed = pd.DataFrame(data, index=['员工1', '员工2', '员工3'])
print(df_indexed)
```

### 数据索引和选择

#### 基本索引操作

```python
# 创建示例DataFrame
df = pd.DataFrame({
    'A': [1, 2, 3, 4],
    'B': [5, 6, 7, 8],
    'C': [9, 10, 11, 12]
}, index=['row1', 'row2', 'row3', 'row4'])

# 选择列
print(df['A'])  # 选择单列
print(df[['A', 'C']])  # 选择多列

# 选择行
print(df[1:3])  # 切片选择行
print(df.iloc[0])  # 按位置选择行
print(df.loc['row1'])  # 按标签选择行
```

#### 高级索引方法

**loc - 基于标签的索引**

```python
# loc方法 - 基于标签
print(df.loc['row1', 'A'])  # 选择特定位置
print(df.loc['row1':'row3', 'A':'C'])  # 切片选择
print(df.loc[['row1', 'row3'], ['A', 'C']])  # 列表选择
```

**iloc - 基于位置的索引**

```python
# iloc方法 - 基于位置
print(df.iloc[0, 1])  # 选择特定位置
print(df.iloc[0:2, 1:3])  # 切片选择
print(df.iloc[[0, 2], [0, 2]])  # 列表选择
```

**at和iat - 快速标量访问**

```python
# 快速访问单个值
print(df.at['row1', 'A'])  # 基于标签
print(df.iat[0, 0])  # 基于位置
```

#### 布尔索引

```python
# 布尔索引
df_sample = pd.DataFrame({
    'score': [85, 92, 78, 96, 88],
    'grade': ['B', 'A', 'C', 'A', 'B']
})

# 条件筛选
high_scores = df_sample[df_sample['score'] > 90]
print(high_scores)

# 多条件筛选
a_grade_high = df_sample[(df_sample['grade'] == 'A') & (df_sample['score'] > 90)]
print(a_grade_high)
```

### 数据对齐和算术运算

#### 自动数据对齐

```python
# 创建两个DataFrame
df1 = pd.DataFrame({
    'A': [1, 2, 3],
    'B': [4, 5, 6]
}, index=[0, 1, 2])

df2 = pd.DataFrame({
    'A': [10, 20],
    'C': [30, 40]
}, index=[1, 2])

# 算术运算会自动对齐
result = df1 + df2
print(result)

# 使用fill_value处理缺失值
result_filled = df1.add(df2, fill_value=0)
print(result_filled)
```

#### 算术方法

```python
# 各种算术方法
df = pd.DataFrame(np.arange(12).reshape(3, 4), columns=['A', 'B', 'C', 'D'])

# 减法操作
result = df.sub(df.iloc[0], axis=1)  # 每行减去第一行
print(result)

# 应用函数
range_func = lambda x: x.max() - x.min()
print(df.apply(range_func))  # 对每列应用函数
print(df.apply(range_func, axis=1))  # 对每行应用函数
```

### 排序和排名

#### 排序操作

```python
# 创建示例数据
df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie', 'David'],
    'score': [85, 92, 78, 96],
    'age': [25, 30, 22, 28]
})

# 按值排序
sorted_by_score = df.sort_values('score', ascending=False)
print(sorted_by_score)

# 多列排序
sorted_multi = df.sort_values(['age', 'score'])
print(sorted_multi)

# 按索引排序
sorted_by_index = df.sort_index()
print(sorted_by_index)
```

#### 排名操作

```python
# Series排名
scores = pd.Series([85, 92, 78, 96, 85])
print(scores.rank())  # 默认平均排名
print(scores.rank(method='min'))  # 最小排名
print(scores.rank(method='dense'))  # 密集排名

# DataFrame排名
print(df.rank())  # 对所有列排名
print(df.rank(axis=1))  # 对每行排名
```

### 描述性统计

#### 基本统计信息

```python
# 创建示例数据
df = pd.DataFrame({
    'A': [1, 2, 3, 4, 5],
    'B': [10, 20, np.nan, 40, 50],
    'C': [100, 200, 300, 400, 500]
})

# 基本统计
print(df.describe())  # 描述性统计
print(df.sum())  # 求和
print(df.mean())  # 平均值
print(df.std())  # 标准差
print(df.count())  # 非空值计数
```

#### 相关性和协方差

```python
# 相关性分析
print(df.corr())  # 相关性矩阵
print(df.cov())  # 协方差矩阵

# 单独计算相关性
print(df['A'].corr(df['C']))  # 两列之间的相关性
```

### 唯一值和成员检查

#### 唯一值操作

```python
# 创建示例Series
s = pd.Series([1, 2, 2, 3, 3, 3, 4])

# 唯一值
print(s.unique())  # 获取唯一值
print(s.value_counts())  # 值计数
print(s.nunique())  # 唯一值数量
```

#### 成员检查

```python
# 成员检查
print(s.isin([2, 3]))  # 检查是否包含指定值
filtered = s[s.isin([2, 3])]  # 筛选包含指定值的元素
print(filtered)
```

## 💡 实际应用

### 基础用法示例

```python
# 学生成绩管理系统
students = pd.DataFrame({
    '姓名': ['张三', '李四', '王五', '赵六'],
    '数学': [85, 92, 78, 96],
    '英语': [88, 85, 92, 89],
    '物理': [90, 88, 85, 94]
})

# 计算总分和平均分
students['总分'] = students[['数学', '英语', '物理']].sum(axis=1)
students['平均分'] = students[['数学', '英语', '物理']].mean(axis=1)

# 按总分排序
students_sorted = students.sort_values('总分', ascending=False)
print(students_sorted)

# 筛选优秀学生（平均分>90）
excellent_students = students[students['平均分'] > 90]
print(excellent_students)
```

### 高级用法示例

```python
# 销售数据分析
sales_data = pd.DataFrame({
    '产品': ['A', 'B', 'C', 'A', 'B', 'C'],
    '季度': ['Q1', 'Q1', 'Q1', 'Q2', 'Q2', 'Q2'],
    '销量': [100, 150, 120, 110, 160, 130],
    '单价': [10, 15, 12, 11, 16, 13]
})

# 计算销售额
sales_data['销售额'] = sales_data['销量'] * sales_data['单价']

# 透视表分析
pivot_table = sales_data.pivot_table(
    values='销售额', 
    index='产品', 
    columns='季度', 
    aggfunc='sum'
)
print(pivot_table)

# 计算增长率
pivot_table['增长率'] = (pivot_table['Q2'] - pivot_table['Q1']) / pivot_table['Q1'] * 100
print(pivot_table)
```

## ⚠️ 注意事项

1. **索引对齐**：Pandas会自动对齐索引，不匹配的位置会产生NaN值
2. **数据类型**：注意数据类型的一致性，避免意外的类型转换
3. **内存使用**：大数据集时要注意内存使用，考虑使用分块处理
4. **链式操作**：避免过长的链式操作，影响代码可读性
5. **视图vs副本**：理解何时返回视图，何时返回副本

## 🔗 相关内容

- [Pandas 数据读写](../pandas-io)
- [Pandas 数据清洗](../pandas-cleaning)
- [Pandas 分组聚合](../pandas-groupby)
- [NumPy 基础操作](../numpy-basics)

## 📚 扩展阅读

- [Pandas官方文档](https://pandas.pydata.org/docs/)
- [10 Minutes to pandas](https://pandas.pydata.org/docs/user_guide/10min.html)
- [Pandas Cookbook](https://pandas.pydata.org/docs/user_guide/cookbook.html)
- [Python数据分析实战](https://book.douban.com/subject/26340936/)

## 🏷️ 标签

`pandas` `数据分析` `DataFrame` `Series` `索引` `数据处理` `统计分析`