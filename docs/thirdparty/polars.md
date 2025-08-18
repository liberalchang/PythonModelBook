---
title: "Polars - 高性能DataFrame库"
author: "Python技术文档工程师"
date: "2024-01-15"
version: "1.0.0"
python_version: "3.8+"
library_version: "polars>=0.19.0"
tags: ["polars", "数据处理", "DataFrame", "高性能", "Rust", "数据分析"]
difficulty: "中级"
estimated_time: "45分钟"
permalink: /docs/thirdparty/polars/
---

# Polars - 高性能DataFrame库

## 📋 概述

Polars是一个用于操作结构化数据的高性能DataFrame库，被认为是平替pandas最有潜质的包。其核心部分用Rust编写，同时提供Python接口。Polars基于Apache Arrow数据格式，使用矢量化查询引擎和SIMD优化，提供了极高的性能和内存效率。

## 🎯 学习目标

通过本文档的学习，您将能够：

- 理解Polars的核心特性和性能优势
- 掌握Series和DataFrame的创建和操作
- 熟练使用Polars进行数据读写和I/O操作
- 学会使用表达式（Expressions）进行数据转换
- 了解lazy和eager两种API模式的区别
- 掌握数据连接、聚合和窗口函数等高级功能

## 📚 前置知识

- Python基础语法
- pandas基础操作（有助于理解概念对比）
- 数据分析基本概念
- 基本的数据结构知识

## 🔍 详细内容

### 核心特性

Polars相比传统数据处理库具有以下显著优势：

**🚀 极致性能**
- 从零开始编写，与机器紧密结合
- 无外部依赖，纯Rust实现核心逻辑
- 基于Apache Arrow列式存储格式
- 使用SIMD指令优化CPU使用

**📁 全面I/O支持**
- 支持本地文件系统
- 支持云存储（S3、Azure、GCS等）
- 支持各种数据库连接
- 支持多种文件格式（CSV、Parquet、JSON等）

**🎯 智能查询优化**
- 内置查询优化器
- 自动确定最有效的执行方式
- 谓词下推和列裁剪优化
- 延迟执行减少内存使用

**⚡ 并行处理能力**
- 自动在CPU核心间分配工作负载
- 无需额外配置即可并行执行
- 支持流式处理超大数据集
- 高效的内存管理和缓存利用

### 安装配置

```bash
# 基础安装
pip install polars

# 安装所有可选依赖
pip install polars[all]

# 指定版本安装
pip install polars>=0.19.0

# 验证安装
python -c "import polars as pl; print(pl.__version__)"
```

### 基础数据结构

#### Series - 一维数据结构

Series是Polars的一维数据结构，所有元素具有相同的数据类型。

```python
import polars as pl
import numpy as np

# 创建数值Series
s = pl.Series("numbers", [1, 2, 3, 4, 5])
print(s)
print(f"最小值: {s.min()}")
print(f"最大值: {s.max()}")

# 字符串操作
s_str = pl.Series("words", ["polar", "bear", "arctic", "polar fox", "polar bear"])
s2 = s_str.str.replace("polar", "pola")
print(s2)

# 日期序列
from datetime import date
start = date(2001, 1, 1)
stop = date(2001, 1, 9)
s_date = pl.date_range(start, stop, interval="2d", eager=True)
print(s_date.dt.day())
```

#### DataFrame - 二维数据结构

DataFrame是由一个或多个Series组成的二维数据结构，类似于SQL表格。

```python
from datetime import datetime

# 创建DataFrame
df = pl.DataFrame({
    "integer": [1, 2, 3, 4, 5],
    "date": [
        datetime(2022, 1, 1),
        datetime(2022, 1, 2),
        datetime(2022, 1, 3),
        datetime(2022, 1, 4),
        datetime(2022, 1, 5),
    ],
    "float": [4.0, 5.0, 6.0, 7.0, 8.0],
})

print(df)
print("\n前3行:")
print(df.head(3))
print("\n统计信息:")
print(df.describe())
```

### 数据读写操作

#### 文件I/O操作

```python
import polars as pl
from datetime import datetime

# 创建示例数据
df = pl.DataFrame({
    "integer": [1, 2, 3],
    "date": [
        datetime(2022, 1, 1),
        datetime(2022, 1, 2),
        datetime(2022, 1, 3),
    ],
    "float": [4.0, 5.0, 6.0],
})

# 写入CSV
df.write_csv("output.csv")

# 读取CSV（不解析日期）
df_csv = pl.read_csv("output.csv")
print("不解析日期:")
print(df_csv)

# 读取CSV（解析日期）
df_csv_parsed = pl.read_csv("output.csv", try_parse_dates=True)
print("\n解析日期:")
print(df_csv_parsed)
```

#### 支持的文件格式

| 格式 | 读取方法 | 写入方法 | 特点 |
|------|----------|----------|------|
| CSV | `pl.read_csv()` | `df.write_csv()` | 通用文本格式 |
| Parquet | `pl.read_parquet()` | `df.write_parquet()` | 高效列式存储 |
| JSON | `pl.read_json()` | `df.write_json()` | 灵活的数据交换 |
| Excel | `pl.read_excel()` | `df.write_excel()` | 办公软件兼容 |
| 数据库 | `pl.read_database()` | `df.write_database()` | 直接数据库操作 |

### 表达式系统

#### 基本选择和过滤

```python
# 创建示例数据
data = {
    'column1': [1, 2, 3, 4, 5],
    'column2': ['a', 'b', 'c', 'd', 'e']
}
df = pl.DataFrame(data)

# 列选择
selected_df = df.select(['column1'])
print("选择列:")
print(selected_df)

# 条件过滤
filtered_df = df.filter(pl.col('column1') > 2)
print("\n过滤结果:")
print(filtered_df)
```

#### 上下文（Contexts）

Polars提供三种主要上下文来评估表达式：

**1. 选择上下文（Selection）**

```python
df = pl.DataFrame({
    "nrs": [1, 2, 3, None, 5],
    "names": ["foo", "ham", "spam", "egg", None],
    "random": np.random.rand(5),
    "groups": ["A", "A", "B", "C", "B"],
})

# 选择和计算新列
out = df.select(
    pl.sum("nrs"),  # 求和
    pl.col("names").sort(),  # 排序
    pl.col("names").first().alias("first_name"),  # 第一个值
    (pl.mean("nrs") * 10).alias("10x_mean"),  # 均值的10倍
)
print(out)
```

**2. 过滤上下文（Filtering）**

```python
# 条件过滤
filtered = df.filter(pl.col("nrs") > 2)
print("过滤结果:")
print(filtered)
```

**3. 分组聚合上下文（Group by/Aggregation）**

```python
# 分组聚合
grouped = df.group_by("groups").agg(
    pl.sum("nrs"),  # 按组求和
    pl.col("random").count().alias("count"),  # 计数
    pl.col("random").filter(pl.col("names").is_not_null()).sum().name.suffix("_sum"),
    pl.col("names").reverse().alias("reversed_names"),
)
print("分组结果:")
print(grouped)
```

### Lazy vs Eager API

#### Eager API（即时执行）

```python
# Eager模式：查询立即执行
df = pl.read_csv("data.csv")
df_filtered = df.filter(pl.col("age") > 25)
df_grouped = df_filtered.group_by("category").agg(pl.col("value").mean())
print(df_grouped)
```

#### Lazy API（延迟执行）

```python
# Lazy模式：构建查询计划，稍后执行
lazy_query = (
    pl.scan_csv("data.csv")  # 扫描而不加载
    .filter(pl.col("age") > 25)
    .group_by("category")
    .agg(pl.col("value").mean())
)

# 执行查询
result = lazy_query.collect()
print(result)

# 流式执行（处理超大数据集）
result_streaming = lazy_query.collect(streaming=True)
print(result_streaming)
```

### 数据类型系统

Polars基于Apache Arrow类型系统，提供丰富的数据类型：

| 分类 | 类型 | 描述 |
|------|------|------|
| 数值型 | `Int8/16/32/64` | 有符号整数 |
| | `UInt8/16/32/64` | 无符号整数 |
| | `Float32/64` | 浮点数 |
| 时间型 | `Date` | 日期 |
| | `Datetime` | 日期时间 |
| | `Duration` | 时间间隔 |
| | `Time` | 时间 |
| 文本型 | `Utf8` | UTF-8字符串 |
| | `Binary` | 二进制数据 |
| 逻辑型 | `Boolean` | 布尔值 |
| 嵌套型 | `List` | 列表数组 |
| | `Struct` | 结构体 |
| 其他 | `Categorical` | 分类数据 |

### 高级功能

#### 数据连接操作

```python
# 创建示例数据
df_customers = pl.DataFrame({
    "customer_id": [1, 2, 3],
    "name": ["Alice", "Bob", "Charlie"],
})

df_orders = pl.DataFrame({
    "order_id": ["a", "b", "c"],
    "customer_id": [1, 2, 2],
    "amount": [100, 200, 300],
})

# 不同类型的连接
inner_join = df_customers.join(df_orders, on="customer_id", how="inner")
left_join = df_customers.join(df_orders, on="customer_id", how="left")
outer_join = df_customers.join(df_orders, on="customer_id", how="outer")

print("内连接结果:")
print(inner_join)
```

#### 窗口函数

```python
# 窗口函数示例
pokemon_df = pl.DataFrame({
    "Name": ["Bulbasaur", "Ivysaur", "Venusaur", "Charmander"],
    "Type1": ["Grass", "Grass", "Grass", "Fire"],
    "Attack": [49, 62, 82, 52],
    "Defense": [49, 63, 83, 43]
})

# 计算类型平均值
windowed = pokemon_df.select(
    "Name",
    "Type1",
    "Attack",
    pl.col("Attack").mean().over("Type1").alias("avg_attack_by_type"),
    pl.col("Defense").mean().over("Type1").alias("avg_defense_by_type"),
)
print(windowed)
```

## 💡 实际应用

### 性能对比示例

```python
import polars as pl
import pandas as pd
import time

# 创建大数据集
n = 1_000_000
data = {
    'id': range(n),
    'value': np.random.randn(n),
    'category': np.random.choice(['A', 'B', 'C'], n)
}

# Polars操作
start_time = time.time()
df_pl = pl.DataFrame(data)
result_pl = df_pl.group_by('category').agg(pl.col('value').mean())
polars_time = time.time() - start_time

# Pandas操作
start_time = time.time()
df_pd = pd.DataFrame(data)
result_pd = df_pd.groupby('category')['value'].mean()
pandas_time = time.time() - start_time

print(f"Polars执行时间: {polars_time:.4f}秒")
print(f"Pandas执行时间: {pandas_time:.4f}秒")
print(f"性能提升: {pandas_time/polars_time:.2f}倍")
```

### 大数据处理案例

```python
# 处理大型CSV文件
lazy_df = (
    pl.scan_csv("large_dataset.csv")
    .filter(pl.col("timestamp") > "2023-01-01")
    .group_by("category")
    .agg([
        pl.col("amount").sum().alias("total_amount"),
        pl.col("amount").mean().alias("avg_amount"),
        pl.count().alias("record_count")
    ])
    .sort("total_amount", descending=True)
)

# 流式执行，节省内存
result = lazy_df.collect(streaming=True)
print(result.head(10))
```

### 数据清洗和转换

```python
# 数据清洗示例
df = pl.DataFrame({
    "name": ["Alice", "Bob", None, "Charlie"],
    "age": [25, 30, 35, None],
    "salary": [50000, 60000, 55000, 70000]
})

# 处理缺失值和数据转换
cleaned = df.with_columns([
    pl.col("name").fill_null("Unknown"),
    pl.col("age").fill_null(pl.col("age").mean()),
    pl.col("salary").cast(pl.Float64) / 1000.0  # 转换为千为单位
]).with_columns([
    pl.when(pl.col("age") < 30)
    .then(pl.lit("Young"))
    .otherwise(pl.lit("Mature"))
    .alias("age_group")
])

print(cleaned)
```

## ⚠️ 注意事项

1. **内存管理**: Polars通常比pandas更节省内存，但大数据集仍需注意内存使用
2. **API差异**: 虽然概念相似，但Polars的API与pandas有所不同，需要适应
3. **生态系统**: Polars生态相对较新，某些第三方集成可能不如pandas丰富
4. **学习曲线**: 表达式系统需要一定时间掌握，但掌握后非常强大
5. **版本兼容**: Polars更新较频繁，注意版本兼容性问题

## 📊 性能特点

| 方面 | Pandas | Polars | 提升倍数 |
|------|--------|--------|----------|
| 内存使用 | 基准 | 更低 | 2-5x |
| 查询速度 | 基准 | 更快 | 3-30x |
| 并行处理 | 有限 | 原生支持 | 取决于核心数 |
| 大数据处理 | 内存限制 | 流式处理 | 无限制 |
| 启动时间 | 快 | 稍慢 | - |

## 🔗 相关内容

### 官方资源
- [Polars官方文档](https://pola-rs.github.io/polars/)
- [Polars用户指南](https://pola-rs.github.io/polars/user-guide/)
- [Polars API参考](https://pola-rs.github.io/polars/py-polars/html/reference/)

### 数据处理相关
- [NumPy 数值计算库](../numpy/)
- [Pandas 数据分析库](../pandas/)
- [Arrow 数据格式](../arrow/)

### 性能优化
- [Vaex - 超大数据集处理](../vaex/)
- [cuPyNumeric - GPU加速](../cupynumeric/)

## 📚 扩展阅读

- [Apache Arrow官方文档](https://arrow.apache.org/)
- [Rust编程语言](https://www.rust-lang.org/)
- [SIMD指令集优化](https://en.wikipedia.org/wiki/SIMD)
- [列式存储vs行式存储](https://en.wikipedia.org/wiki/Column-oriented_DBMS)

## 🏷️ 标签

`polars` `数据处理` `DataFrame` `高性能` `Rust` `数据分析` `Apache Arrow` `列式存储`

---

**最后更新**: 2024-01-15  
**作者**: Python技术文档工程师  
**版本**: 1.0.0