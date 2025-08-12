---
title: "Pandas 数据读写与合并"
author: "Python技术文档工程师"
date: "2024-01-15"
version: "1.0.0"
python_version: "3.8+"
library_version: "pandas>=1.3.0"
tags: ["pandas", "数据读写", "数据合并", "CSV", "Excel", "concat"]
difficulty: "中级"
estimated_time: "35分钟"
permalink: /docs/thirdparty/pandas-io/
---

# Pandas 数据读写与合并

## 📋 概述

Pandas提供了强大的数据输入输出功能，支持多种文件格式的读写操作。同时，Pandas还提供了灵活的数据合并功能，可以将多个数据源整合在一起进行分析。本文档详细介绍Pandas的数据读写操作和各种数据合并方法。

## 🎯 学习目标

通过本文档的学习，您将能够：

- 掌握各种文件格式的读写操作
- 理解数据合并的不同方式和参数
- 熟练使用concat、merge、join等合并方法
- 了解数据转换和格式化技巧
- 掌握处理大文件的策略

## 📚 前置知识

- Pandas基础操作
- 文件系统基础知识
- 数据库基本概念（可选）

## 📖 详细内容

### 数据读取操作

#### CSV文件读写

CSV是最常用的数据交换格式之一。

```python
import pandas as pd
import numpy as np

# 读取CSV文件
df = pd.read_csv('data.csv')
print(df.head())

# 指定参数读取
df = pd.read_csv(
    'data.csv',
    encoding='utf-8',  # 指定编码
    sep=',',           # 分隔符
    header=0,          # 表头行
    index_col=0,       # 索引列
    usecols=['col1', 'col2'],  # 指定读取的列
    dtype={'col1': str},       # 指定数据类型
    na_values=['NULL', 'N/A']  # 缺失值标识
)

# 保存为CSV
df.to_csv('output.csv', index=False, encoding='utf-8')
```

#### Excel文件读写

```python
# 读取Excel文件
df = pd.read_excel('data.xlsx', sheet_name='Sheet1')

# 读取多个工作表
all_sheets = pd.read_excel('data.xlsx', sheet_name=None)
sheet1 = all_sheets['Sheet1']
sheet2 = all_sheets['Sheet2']

# 保存为Excel
with pd.ExcelWriter('output.xlsx') as writer:
    df1.to_excel(writer, sheet_name='数据1', index=False)
    df2.to_excel(writer, sheet_name='数据2', index=False)
```

#### 其他格式读写

```python
# JSON格式
df = pd.read_json('data.json')
df.to_json('output.json', orient='records', force_ascii=False)

# Pickle格式（Python专用）
df.to_pickle('data.pickle')
df = pd.read_pickle('data.pickle')

# SQL数据库
import sqlite3
conn = sqlite3.connect('database.db')
df = pd.read_sql_query('SELECT * FROM table_name', conn)
df.to_sql('new_table', conn, if_exists='replace', index=False)
```

### 数据合并操作

#### concat函数 - 连接合并

**垂直合并（axis=0）**

```python
# 创建示例数据
df1 = pd.DataFrame({
    'A': [1, 2, 3],
    'B': [4, 5, 6]
})

df2 = pd.DataFrame({
    'A': [7, 8, 9],
    'B': [10, 11, 12]
})

df3 = pd.DataFrame({
    'A': [13, 14, 15],
    'B': [16, 17, 18]
})

# 垂直合并
result = pd.concat([df1, df2, df3], axis=0)
print(result)

# 重置索引
result = pd.concat([df1, df2, df3], axis=0, ignore_index=True)
print(result)
```

**水平合并（axis=1）**

```python
# 水平合并
df_left = pd.DataFrame({
    'A': [1, 2, 3],
    'B': [4, 5, 6]
})

df_right = pd.DataFrame({
    'C': [7, 8, 9],
    'D': [10, 11, 12]
})

result = pd.concat([df_left, df_right], axis=1)
print(result)
```

**处理不同列的合并**

```python
# 不同列的DataFrame
df1 = pd.DataFrame({
    'A': [1, 2, 3],
    'B': [4, 5, 6]
})

df2 = pd.DataFrame({
    'B': [7, 8, 9],
    'C': [10, 11, 12]
})

# 外连接（默认）
outer_join = pd.concat([df1, df2], sort=False)
print(outer_join)

# 内连接
inner_join = pd.concat([df1, df2], join='inner')
print(inner_join)
```

#### merge函数 - 数据库式合并

**基本合并操作**

```python
# 创建示例数据
employees = pd.DataFrame({
    'emp_id': [1, 2, 3, 4],
    'name': ['张三', '李四', '王五', '赵六'],
    'dept_id': [10, 20, 10, 30]
})

departments = pd.DataFrame({
    'dept_id': [10, 20, 30],
    'dept_name': ['技术部', '销售部', '人事部']
})

# 内连接
inner_result = pd.merge(employees, departments, on='dept_id', how='inner')
print(inner_result)

# 左连接
left_result = pd.merge(employees, departments, on='dept_id', how='left')
print(left_result)

# 右连接
right_result = pd.merge(employees, departments, on='dept_id', how='right')
print(right_result)

# 外连接
outer_result = pd.merge(employees, departments, on='dept_id', how='outer')
print(outer_result)
```

**多列合并**

```python
# 多列作为合并键
df1 = pd.DataFrame({
    'key1': ['A', 'B', 'C'],
    'key2': [1, 2, 3],
    'value1': [10, 20, 30]
})

df2 = pd.DataFrame({
    'key1': ['A', 'B', 'D'],
    'key2': [1, 2, 4],
    'value2': [100, 200, 400]
})

result = pd.merge(df1, df2, on=['key1', 'key2'], how='outer')
print(result)
```

**不同列名合并**

```python
# 不同列名的合并
df1 = pd.DataFrame({
    'emp_id': [1, 2, 3],
    'name': ['张三', '李四', '王五']
})

df2 = pd.DataFrame({
    'employee_id': [1, 2, 4],
    'salary': [5000, 6000, 7000]
})

result = pd.merge(df1, df2, left_on='emp_id', right_on='employee_id', how='left')
print(result)
```

#### join方法 - 基于索引的合并

```python
# 基于索引的合并
df1 = pd.DataFrame({
    'A': [1, 2, 3],
    'B': [4, 5, 6]
}, index=['X', 'Y', 'Z'])

df2 = pd.DataFrame({
    'C': [7, 8, 9],
    'D': [10, 11, 12]
}, index=['X', 'Y', 'W'])

# 左连接（默认）
result = df1.join(df2, how='left')
print(result)

# 内连接
result = df1.join(df2, how='inner')
print(result)
```

### DataFrame转换操作

#### 转换为字典

```python
# 创建示例DataFrame
students = pd.DataFrame({
    '姓名': ['张三', '李四', '王五'],
    '年龄': [20, 21, 19],
    '成绩': [85, 92, 78]
})

# 不同格式的字典转换
dict_default = students.to_dict()  # 默认格式
dict_list = students.to_dict(orient='list')  # 列表格式
dict_records = students.to_dict(orient='records')  # 记录格式
dict_index = students.to_dict(orient='index')  # 索引格式
dict_split = students.to_dict(orient='split')  # 分割格式

print("默认格式:", dict_default)
print("列表格式:", dict_list)
print("记录格式:", dict_records)
print("索引格式:", dict_index)
print("分割格式:", dict_split)
```

#### 数据类型转换

```python
# 数据类型转换
df = pd.DataFrame({
    'A': ['1', '2', '3'],
    'B': ['4.5', '5.6', '6.7'],
    'C': ['True', 'False', 'True']
})

# 转换数据类型
df['A'] = df['A'].astype(int)
df['B'] = df['B'].astype(float)
df['C'] = df['C'].astype(bool)

print(df.dtypes)
```

## 💡 实际应用

### 基础用法示例

```python
# 学生成绩数据处理
# 读取多个班级的成绩文件
class1 = pd.read_csv('class1_scores.csv')
class2 = pd.read_csv('class2_scores.csv')
class3 = pd.read_csv('class3_scores.csv')

# 添加班级标识
class1['班级'] = '一班'
class2['班级'] = '二班'
class3['班级'] = '三班'

# 合并所有班级数据
all_students = pd.concat([class1, class2, class3], ignore_index=True)

# 读取学生基本信息
student_info = pd.read_excel('student_info.xlsx')

# 合并成绩和基本信息
complete_data = pd.merge(
    all_students, 
    student_info, 
    on='学号', 
    how='left'
)

# 保存完整数据
complete_data.to_excel('complete_student_data.xlsx', index=False)
```

### 高级用法示例

```python
# 销售数据整合分析
# 读取不同来源的销售数据
online_sales = pd.read_csv('online_sales.csv')
offline_sales = pd.read_csv('offline_sales.csv')
product_info = pd.read_excel('product_catalog.xlsx')
customer_info = pd.read_json('customer_data.json')

# 标记销售渠道
online_sales['渠道'] = '线上'
offline_sales['渠道'] = '线下'

# 合并销售数据
all_sales = pd.concat([online_sales, offline_sales], ignore_index=True)

# 关联产品信息
sales_with_product = pd.merge(
    all_sales, 
    product_info, 
    left_on='产品ID', 
    right_on='ID', 
    how='left'
)

# 关联客户信息
complete_sales = pd.merge(
    sales_with_product,
    customer_info,
    left_on='客户ID',
    right_on='customer_id',
    how='left'
)

# 数据清洗和处理
complete_sales['销售额'] = complete_sales['数量'] * complete_sales['单价']
complete_sales['销售日期'] = pd.to_datetime(complete_sales['销售日期'])

# 保存处理后的数据
with pd.ExcelWriter('sales_analysis.xlsx') as writer:
    complete_sales.to_excel(writer, sheet_name='完整销售数据', index=False)
    
    # 按渠道汇总
    channel_summary = complete_sales.groupby('渠道')['销售额'].sum()
    channel_summary.to_excel(writer, sheet_name='渠道汇总')
    
    # 按产品类别汇总
    category_summary = complete_sales.groupby('产品类别')['销售额'].sum()
    category_summary.to_excel(writer, sheet_name='类别汇总')
```

### 大文件处理示例

```python
# 处理大型CSV文件
def process_large_csv(filename, chunk_size=10000):
    """分块处理大型CSV文件"""
    processed_chunks = []
    
    for chunk in pd.read_csv(filename, chunksize=chunk_size):
        # 对每个块进行处理
        chunk_processed = chunk.dropna()  # 删除缺失值
        chunk_processed = chunk_processed[chunk_processed['amount'] > 0]  # 筛选条件
        processed_chunks.append(chunk_processed)
    
    # 合并所有处理后的块
    result = pd.concat(processed_chunks, ignore_index=True)
    return result

# 使用示例
large_data = process_large_csv('large_dataset.csv')
large_data.to_csv('processed_large_dataset.csv', index=False)
```

## ⚠️ 注意事项

1. **文件编码**：注意文件的编码格式，中文数据建议使用UTF-8
2. **内存管理**：处理大文件时考虑使用分块读取
3. **数据类型**：读取时指定合适的数据类型可以节省内存
4. **合并键**：确保合并键的数据类型一致
5. **重复数据**：合并后检查是否产生重复数据
6. **索引处理**：注意合并后的索引是否需要重置

## 🔗 相关内容

- [Pandas 基础操作](pandas-basics.md)
- [Pandas 数据清洗](pandas-cleaning.md)
- [Pandas 分组聚合](pandas-groupby.md)
- [数据可视化](pandas-visualization.md)

## 📚 扩展阅读

- [Pandas IO工具](https://pandas.pydata.org/docs/user_guide/io.html)
- [Pandas合并操作](https://pandas.pydata.org/docs/user_guide/merging.html)
- [处理大数据集](https://pandas.pydata.org/docs/user_guide/scale.html)
- [数据格式转换最佳实践](https://realpython.com/pandas-read-write-files/)

## 🏷️ 标签

`pandas` `数据读写` `CSV` `Excel` `数据合并` `concat` `merge` `join` `数据转换`