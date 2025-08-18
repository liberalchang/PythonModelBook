---
layout: doc
title: Arrow 日期时间处理库
permalink: /docs/thirdparty/arrow/
category: thirdparty
tags: [arrow, 日期时间, 时间处理, 格式化, 时区]
description: 使用 Arrow 更高效地创建、操作、格式化和转换日期时间，提供人性化 API，补足内置模块的可用性不足。
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "初级"
---

# Arrow 日期时间处理库

## 📝 概述

Arrow 是一个 Python 库，提供了优雅且人性化的 API 用于创建、操作、格式化和转换日期、时间和时间戳。它扩展和改进了 datetime 类型，弥补了标准库在易用性上的不足，支持多种常见时间创建与处理方案。

为什么使用 Arrow 而不是内置模块？
- 标准库涉及多个模块：datetime、time、calendar、dateutil、pytz 等，使用分散
- 类型繁多：date、time、datetime、tzinfo、timedelta、relativedelta 等
- 时区与时间戳转换冗长不友好
- 时区“天真/naive”问题常见
- 功能缺口：ISO 8601 解析、时间跨度、人性化表达

## 🎯 学习目标

- 了解 Arrow 的优势与适用场景
- 学会获取当前时间、时间戳与常用属性
- 掌握格式化、解析与本地化人性化输出
- 掌握时间偏移与时间段处理

## 📋 前置知识

- Python 基础：变量、函数、模块
- datetime/time 基本概念
- 基本的包管理（pip/conda）

## 安装

```bash
pip install arrow
```

## 🔍 详细内容

### 基本概念

- Arrow 对 datetime API 进行友好封装，返回 Arrow 对象
- 所有操作大多是链式调用，可读性强

### 快速上手：获取当前时间

```python
# 获取当前本地时间（返回 Arrow 对象）
import arrow

now = arrow.now()
print(now)  # 2022-05-06T09:32:41.296610+08:00

utc_now = arrow.utcnow()
print(utc_now)  # 2022-05-06T01:50:44.670980+00:00
```

### 获取时间戳

```python
import arrow

print(arrow.now().timestamp)         # 1651800761（整数秒）
print(arrow.now().float_timestamp)   # 1651800761.29661（浮点秒）
```

### 访问 datetime 属性

```python
import arrow

now = arrow.now()  # 2022-05-06T09:32:41.296610+08:00
print(now.year)   # 2022
print(now.month)  # 5
print(now.day)    # 6
print(now.hour)   # 9
print(now.minute) # 32
print(now.second) # 41
```

### 将 Arrow 对象格式化为字符串

```python
import arrow

now = arrow.now()
print(now.format())                      # '2022-05-06 09:32:41+08:00'
print(now.format('YYYY-MM-DD HH:mm:ss ZZ'))  # '2022-05-06 09:32:41 +08:00'
print(now.format('YYYY-MM-DD HH:mm:ss'))     # '2022-05-06 09:32:41'
print(now.format('YYYYMMDD'))                # '20220506'
print(now.format('X'))                       # '1651800761' （字符串格式的时间戳）
print(now.format('MMMM'))                    # 'May'（英文月份）
```

### 从时间戳创建 Arrow 对象

```python
import arrow

obj = arrow.get(1651800761)
print(obj)  # 2022-05-06T01:32:41+00:00
print(obj.format('YYYY-MM-DD HH:mm:ss'))
```

### 从字符串解析时间

日期和时间格式的任一侧可以被以下任一标点分隔：`, . ; : ? ! \" ` ' [ ] { } ( ) < >`

```python
import arrow

print(arrow.get("Cool date: 2019-10-31T09:12:45.123456+04:30.", "YYYY-MM-DDTHH:mm:ss.SZZ"))
print(arrow.get("Tomorrow (2019-10-31) is Halloween!", "YYYY-MM-DD"))
print(arrow.get("Halloween is on 2019.10.31.", "YYYY.MM.DD"))

# 错误示例：由于日期后面有多个标点符号，解析失败
# arrow.get("It's Halloween tomorrow (2019-10-31)!", "YYYY-MM-DD")
```

### 字符串转换为时间戳

```python
import arrow

print(arrow.get("2022-05-01").int_timestamp)    # 1651363200
print(arrow.get("2022-05-01").float_timestamp)  # 1651363200.0
print(arrow.get("2022-05-01").timestamp())      # 1651363200.0
```

### 转换为 datetime 对象

```python
import arrow

print(arrow.now().datetime)  # 2022-05-06 09:32:41.296610+08:00
```

### 时间偏移（shift）

```python
import arrow

now = arrow.now()
print(now.shift(days=3).format('YYYY:MM:DD HH:mm:ss'))   # 后3天
print(now.shift(days=-2).format('YYYY:MM:DD HH:mm:ss'))  # 前2天
print(now.shift(years=-1).format('YYYY:MM:DD HH:mm:ss')) # 上1年
print(now.shift(months=2).format('YYYY:MM:DD HH:mm:ss')) # 下2个月
print(now.shift(hours=2).format('YYYY:MM:DD HH:mm:ss'))  # 2小时后
print(now.shift(minutes=-1).format('YYYY:MM:DD HH:mm:ss')) # 1分钟前
print(now.shift(seconds=-30).format('YYYY:MM:DD HH:mm:ss')) # 30秒前

# 多个参数同时使用
print(now.shift(hours=2, minutes=-1, seconds=-30).format('YYYY:MM:DD HH:mm:ss'))
```

### 人性化输出（humanize）与本地化

```python
import arrow

now = arrow.now()
print(now.humanize())                  # '26 seconds ago'
print(now.humanize(locale='zh-cn'))    # '26秒前'

future = now.shift(hours=2)
print(future.humanize(now, locale='zh-cn'))  # '2小时后'
```

### 时间区间与边界

```python
import arrow

now = arrow.now()
print(now.span('hour'))   # (<Arrow [...]:00>, <Arrow [...]:59.999999>)
print(now.floor('hour'))  # 小时开始
print(now.ceil('hour'))   # 小时结束
```

## 🔧 源码解析与实现要点

以下是 Arrow 1.2.2 版本的核心实现分析：

### 基础架构

Arrow 基于 Python 标准库构建：

```python
# arrow.py 中的核心导入
import calendar
import datetime
import time
from dateutil import parser, tz
```

### format() 方法实现

位置：arrow.py 文件中 Arrow 类的 format() 方法（约 1095 行）

```python
def format(self, fmt: str = "YYYY-MM-DD HH:mm:ssZZ", locale: str = DEFAULT_LOCALE) -> str:
    """返回格式化的字符串表示"""
    return formatter.DateTimeFormatter(locale).format(self._datetime, fmt)
```

**自定义建议**：
- 默认 fmt 为 "YYYY-MM-DD HH:mm:ssZZ"，可改为 "YYYY-MM-DD HH:mm:ss"
- 默认 DEFAULT_LOCALE 为 "en-us"，可改为 "zh-cn"

### 本地化实现

**locale 支持**：
- 在 constants.py 中 DEHUMANIZE_LOCALES 列表（约 70 行）可找到支持的地区
- 中国地区的 locale 值为 "zh" 或 "zh-cn"

**ChineseCNLocale 类**（locales.py 约 954 行）：

```python
class ChineseCNLocale(Locale):
    names = ["zh", "zh-cn"]
    
    past = "{0}前"
    future = "{0}后"
    
    timeframes = {
        "now": "刚才",
        "second": "秒",
        "minute": "分钟", 
        "hour": "小时",
        "day": "天",
        "week": "周",
        "month": "个月",
        "year": "年",
    }
    
    month_names = [
        "", "1月", "2月", "3月", "4月", "5月", "6月",
        "7月", "8月", "9月", "10月", "11月", "12月"
    ]
    
    day_names = [
        "", "星期一", "星期二", "星期三", "星期四", 
        "星期五", "星期六", "星期日"
    ]
```

### 格式化令牌实现

在 formatter.py 的 DateTimeFormatter 类中的 _format_token() 方法定义了各种格式化字母：

- YYYY/YY: 年份（4位/2位）
- MM/M: 月份（补零/不补零）
- DD/D: 日期（补零/不补零）
- HH/H: 小时（补零/不补零）
- mm/m: 分钟（补零/不补零）
- ss/s: 秒钟（补零/不补零）
- MMMM/MMM: 月份名称（完整/缩写）
- X: Unix 时间戳

大小写和长度的不同决定了输出格式的差异。

## 💡 实际应用

### 示例：统一业务时间格式化

```python
# 统一项目中的时间格式输出
import arrow

DEFAULT_FMT = 'YYYY-MM-DD HH:mm:ss'

def ts_to_str(ts: int) -> str:
    """时间戳转字符串（统一格式）"""
    return arrow.get(ts).format(DEFAULT_FMT)

print(ts_to_str(1651800761))
```

### 示例：日志时间本地化

```python
# 日志中输出本地化的人性化时间
import arrow

start = arrow.now().shift(minutes=-5)
print(start.humanize(locale='zh-cn'))  # '5分钟前'
```

## ⚠️ 注意事项

- 注意 naive/aware datetime 的时区问题，确保转换时带上时区信息
- humanize 依赖 locale，请确认 locale 设置正确，否则输出为英文
- 字符串解析需要格式与内容对齐，标点和空格都可能影响解析

## 🔗 相关内容

- [datetime 模块](../../stdlib/datetime/) - Python 标准日期时间模块
- [time 模块](../../stdlib/time/) - 基础时间处理功能
- [calendar 模块](../../stdlib/calendar/) - 日历相关功能
- [Pendulum - 更好的日期时间处理库](../pendulum/) - Arrow 的现代替代品

## 📚 扩展阅读

- [Arrow 官方文档](https://arrow.readthedocs.io/)
- [PyPI 项目页面](https://pypi.org/project/arrow/)
- [GitHub 源码仓库](https://github.com/arrow-py/arrow)
- [ISO 8601 标准](https://en.wikipedia.org/wiki/ISO_8601)
- [Python 时间处理最佳实践](https://docs.python.org/3/library/datetime.html)

## 🏷️ 标签

`第三方库` `arrow` `日期时间` `时间处理` `格式化` `时区` `本地化`

---

**最后更新**: 2024-01-15  
**作者**: Python 编程指南  
**版本**: 1.0