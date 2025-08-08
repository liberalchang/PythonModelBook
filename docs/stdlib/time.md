---
layout: doc
title: time模块
permalink: /docs/stdlib/time/
category: stdlib
tags: [时间, 时间戳, 格式化, 标准库]
description: Python time模块的完整指南，包含时间获取、格式化、延时等功能
author: Python文档团队
date: 2024-01-01
updated: 2024-01-01
version: 1.0
difficulty: 初级
---

# time模块

## 📝 概述

time模块是Python标准库中处理时间的基础模块，提供了与时间相关的各种函数。它主要用于获取当前时间、时间格式化、程序延时等操作。time模块基于Unix时间戳（从1970年1月1日00:00:00 UTC开始的秒数）进行时间计算。

## 🎯 学习目标

- 掌握time模块的基本时间获取函数
- 学会时间格式化和解析
- 了解程序延时和性能测量
- 理解时间戳和结构化时间的转换
- 掌握时区相关的时间处理

## 📋 前置知识

- Python基本语法
- 了解Unix时间戳概念
- 基本的日期时间概念

## 🔍 详细内容

### 时间获取函数

#### 获取当前时间戳

```python
import time

# 获取当前时间戳（浮点数，包含微秒）
current_timestamp = time.time()
print(f"当前时间戳: {current_timestamp}")
# 输出: 当前时间戳: 1704067200.123456

# 获取单调时钟时间（用于测量时间间隔）
monotonic_time = time.monotonic()
print(f"单调时钟时间: {monotonic_time}")

# 获取性能计数器（最高精度）
perf_time = time.perf_counter()
print(f"性能计数器: {perf_time}")
```

#### 获取结构化时间

```python
# 获取当前本地时间的结构化时间
local_time = time.localtime()
print(f"本地时间: {local_time}")
# 输出: time.struct_time(tm_year=2024, tm_mon=1, tm_mday=1, ...)

# 获取UTC时间的结构化时间
utc_time = time.gmtime()
print(f"UTC时间: {utc_time}")

# 从时间戳转换为结构化时间
timestamp = 1704067200
struct_time = time.localtime(timestamp)
print(f"指定时间戳的本地时间: {struct_time}")
```

### 时间格式化

#### strftime - 格式化时间

```python
# 将结构化时间格式化为字符串
current_time = time.localtime()

# 常用格式化
formatted_time = time.strftime("%Y-%m-%d %H:%M:%S", current_time)
print(f"标准格式: {formatted_time}")
# 输出: 标准格式: 2024-01-01 12:00:00

# 中文格式化
chinese_format = time.strftime("%Y年%m月%d日 %H时%M分%S秒", current_time)
print(f"中文格式: {chinese_format}")

# 其他常用格式
formats = {
    "ISO格式": "%Y-%m-%dT%H:%M:%S",
    "美式格式": "%m/%d/%Y %I:%M:%S %p",
    "欧式格式": "%d/%m/%Y %H:%M:%S",
    "简短格式": "%y%m%d_%H%M%S"
}

for name, fmt in formats.items():
    result = time.strftime(fmt, current_time)
    print(f"{name}: {result}")
```

#### strptime - 解析时间字符串

```python
# 将时间字符串解析为结构化时间
time_string = "2024-01-01 12:30:45"
parsed_time = time.strptime(time_string, "%Y-%m-%d %H:%M:%S")
print(f"解析结果: {parsed_time}")

# 解析不同格式的时间字符串
time_formats = [
    ("2024/01/01 12:30:45", "%Y/%m/%d %H:%M:%S"),
    ("01-Jan-2024 12:30", "%d-%b-%Y %H:%M"),
    ("240101_123045", "%y%m%d_%H%M%S")
]

for time_str, fmt in time_formats:
    try:
        parsed = time.strptime(time_str, fmt)
        print(f"'{time_str}' 解析为: {parsed.tm_year}-{parsed.tm_mon:02d}-{parsed.tm_mday:02d}")
    except ValueError as e:
        print(f"解析失败: {e}")
```

### 时间转换

```python
# 结构化时间转换为时间戳
struct_time = time.localtime()
timestamp = time.mktime(struct_time)
print(f"结构化时间转时间戳: {timestamp}")

# 时间戳转换为可读字符串
timestamp = time.time()
readable_time = time.ctime(timestamp)
print(f"时间戳转可读格式: {readable_time}")
# 输出: Mon Jan  1 12:00:00 2024

# 直接获取当前时间的可读格式
current_readable = time.ctime()
print(f"当前时间: {current_readable}")
```

### 程序延时

```python
# 程序暂停指定秒数
print("开始延时...")
time.sleep(2)  # 暂停2秒
print("延时结束")

# 精确延时示例
start_time = time.perf_counter()
time.sleep(1.5)
end_time = time.perf_counter()
actual_delay = end_time - start_time
print(f"预期延时: 1.5秒, 实际延时: {actual_delay:.3f}秒")

# 循环中的延时
for i in range(3):
    print(f"第{i+1}次执行")
    time.sleep(0.5)  # 每次间隔0.5秒
```

### 格式化代码表

| 代码 | 含义 | 示例 |
|------|------|------|
| %Y | 四位年份 | 2024 |
| %y | 两位年份 | 24 |
| %m | 月份(01-12) | 01 |
| %B | 月份全名 | January |
| %b | 月份简称 | Jan |
| %d | 日期(01-31) | 01 |
| %H | 小时(00-23) | 12 |
| %I | 小时(01-12) | 12 |
| %M | 分钟(00-59) | 30 |
| %S | 秒(00-59) | 45 |
| %p | AM/PM | PM |
| %A | 星期全名 | Monday |
| %a | 星期简称 | Mon |
| %w | 星期数字(0-6) | 1 |
| %j | 年中第几天 | 001 |
| %U | 年中第几周 | 01 |
| %Z | 时区名称 | CST |

## 💡 实际应用

### 基础用法

```python
def get_current_time_info():
    """获取当前时间的详细信息"""
    current = time.time()
    local_time = time.localtime(current)
    
    info = {
        '时间戳': current,
        '标准格式': time.strftime('%Y-%m-%d %H:%M:%S', local_time),
        '中文格式': time.strftime('%Y年%m月%d日 %H时%M分%S秒', local_time),
        '星期': time.strftime('%A', local_time),
        '年中第几天': local_time.tm_yday,
        '是否夏令时': '是' if local_time.tm_isdst else '否'
    }
    
    return info

# 使用示例
time_info = get_current_time_info()
for key, value in time_info.items():
    print(f"{key}: {value}")
```

### 高级用法

```python
class TimeTracker:
    """时间追踪器类"""
    
    def __init__(self):
        self.start_times = {}
        self.records = []
    
    def start_timer(self, name):
        """开始计时"""
        self.start_times[name] = time.perf_counter()
        print(f"开始计时: {name}")
    
    def stop_timer(self, name):
        """停止计时"""
        if name not in self.start_times:
            print(f"错误: 没有找到名为'{name}'的计时器")
            return None
        
        elapsed = time.perf_counter() - self.start_times[name]
        record = {
            'name': name,
            'duration': elapsed,
            'timestamp': time.time(),
            'formatted_time': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        self.records.append(record)
        del self.start_times[name]
        
        print(f"计时结束: {name}, 耗时: {elapsed:.3f}秒")
        return elapsed
    
    def get_summary(self):
        """获取计时摘要"""
        if not self.records:
            return "暂无计时记录"
        
        total_time = sum(record['duration'] for record in self.records)
        avg_time = total_time / len(self.records)
        
        summary = f"总计时记录: {len(self.records)}个\n"
        summary += f"总耗时: {total_time:.3f}秒\n"
        summary += f"平均耗时: {avg_time:.3f}秒\n\n"
        summary += "详细记录:\n"
        
        for record in self.records:
            summary += f"- {record['name']}: {record['duration']:.3f}秒 ({record['formatted_time']})\n"
        
        return summary

# 使用示例
tracker = TimeTracker()

tracker.start_timer("数据处理")
time.sleep(1.2)  # 模拟数据处理
tracker.stop_timer("数据处理")

tracker.start_timer("文件操作")
time.sleep(0.8)  # 模拟文件操作
tracker.stop_timer("文件操作")

print("\n" + tracker.get_summary())
```

### 实际案例

```python
import time
import os

class LogManager:
    """日志管理器"""
    
    def __init__(self, log_file="app.log"):
        self.log_file = log_file
    
    def log(self, level, message):
        """记录日志"""
        timestamp = time.time()
        formatted_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(timestamp))
        
        log_entry = f"[{formatted_time}] [{level}] {message}\n"
        
        with open(self.log_file, 'a', encoding='utf-8') as f:
            f.write(log_entry)
        
        print(log_entry.strip())
    
    def info(self, message):
        """记录信息日志"""
        self.log("INFO", message)
    
    def warning(self, message):
        """记录警告日志"""
        self.log("WARNING", message)
    
    def error(self, message):
        """记录错误日志"""
        self.log("ERROR", message)
    
    def get_log_stats(self):
        """获取日志统计信息"""
        if not os.path.exists(self.log_file):
            return "日志文件不存在"
        
        with open(self.log_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        stats = {
            'total_lines': len(lines),
            'info_count': sum(1 for line in lines if '[INFO]' in line),
            'warning_count': sum(1 for line in lines if '[WARNING]' in line),
            'error_count': sum(1 for line in lines if '[ERROR]' in line)
        }
        
        if lines:
            # 解析第一条和最后一条日志的时间
            first_line = lines[0]
            last_line = lines[-1]
            
            try:
                first_time_str = first_line.split('] [')[0][1:]
                last_time_str = last_line.split('] [')[0][1:]
                
                first_time = time.strptime(first_time_str, '%Y-%m-%d %H:%M:%S')
                last_time = time.strptime(last_time_str, '%Y-%m-%d %H:%M:%S')
                
                first_timestamp = time.mktime(first_time)
                last_timestamp = time.mktime(last_time)
                
                duration = last_timestamp - first_timestamp
                stats['duration_seconds'] = duration
                stats['first_log_time'] = first_time_str
                stats['last_log_time'] = last_time_str
            except:
                stats['duration_seconds'] = 0
        
        return stats

# 使用示例
logger = LogManager("demo.log")

logger.info("应用程序启动")
time.sleep(0.1)
logger.warning("配置文件缺少某些参数")
time.sleep(0.1)
logger.error("数据库连接失败")
time.sleep(0.1)
logger.info("应用程序关闭")

# 获取统计信息
stats = logger.get_log_stats()
print("\n日志统计:")
for key, value in stats.items():
    print(f"{key}: {value}")
```

## ⚠️ 注意事项

- **时区问题**: `time.localtime()`返回本地时间，`time.gmtime()`返回UTC时间
- **精度限制**: `time.time()`的精度取决于系统，通常为微秒级
- **性能测量**: 使用`time.perf_counter()`而不是`time.time()`进行性能测量
- **线程安全**: time模块的大部分函数都是线程安全的
- **平台差异**: 某些函数在不同操作系统上可能有细微差别
- **夏令时**: 在处理本地时间时要注意夏令时的影响

## 🔗 相关内容

- [datetime模块](datetime/) - 更高级的日期时间处理
- [calendar模块](calendar/) - 日历相关功能
- [内置函数](../builtins/) - 了解相关的内置函数

## 📚 扩展阅读

- [Python time模块官方文档](https://docs.python.org/3/library/time.html)
- [Unix时间戳详解](https://en.wikipedia.org/wiki/Unix_time)
- [时区和夏令时处理](https://docs.python.org/3/library/datetime.html#timezone-objects)

## 🏷️ 标签

`时间` `时间戳` `格式化` `延时` `性能测量` `标准库`

---

**最后更新**: 2024-01-01  
**作者**: Python文档团队  
**版本**: 1.0