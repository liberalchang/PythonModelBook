---
layout: doc
title: datetime模块
permalink: /docs/stdlib/datetime/
category: stdlib
tags: [日期时间, 时区, 格式化, 计算, 标准库]
description: Python datetime模块的完整指南，包含日期时间创建、格式化、计算和时区处理
author: Python文档团队
date: 2024-01-01
updated: 2024-01-01
version: 1.0
difficulty: 中级
---

# datetime模块

## 📝 概述

datetime模块是Python中处理日期和时间的核心模块，提供了比time模块更高级、更面向对象的日期时间处理功能。它包含了date、time、datetime、timedelta、timezone等类，支持日期时间的创建、格式化、计算和时区处理。

## 🎯 学习目标

- 掌握datetime模块的核心类和方法
- 学会日期时间的创建和格式化
- 了解时间差计算和日期运算
- 掌握时区处理和转换
- 学会日期时间的比较和排序

## 📋 前置知识

- Python基本语法和面向对象概念
- 了解时区和UTC概念
- 基本的日期时间概念

## 🔍 详细内容

### 核心类概述

| 类名 | 功能 | 示例 |
|------|------|------|
| date | 日期（年月日） | 2024-01-01 |
| time | 时间（时分秒微秒） | 12:30:45.123456 |
| datetime | 日期时间 | 2024-01-01 12:30:45 |
| timedelta | 时间差 | 7天3小时 |
| timezone | 时区 | UTC+8 |

### date类 - 日期处理

#### 创建日期对象

```python
from datetime import date, datetime

# 创建日期对象的几种方式
today = date.today()  # 今天的日期
print(f"今天: {today}")

# 指定日期
specific_date = date(2024, 1, 1)
print(f"指定日期: {specific_date}")

# 从时间戳创建
import time
timestamp = time.time()
date_from_timestamp = date.fromtimestamp(timestamp)
print(f"从时间戳创建: {date_from_timestamp}")

# 从序数创建（从公元1年1月1日开始的天数）
ordinal_date = date.fromordinal(738521)  # 2024年1月1日
print(f"从序数创建: {ordinal_date}")

# 从ISO格式字符串创建
iso_date = date.fromisoformat('2024-01-01')
print(f"从ISO格式创建: {iso_date}")
```

#### 日期属性和方法

```python
today = date.today()

# 获取日期组件
print(f"年份: {today.year}")
print(f"月份: {today.month}")
print(f"日期: {today.day}")

# 星期相关
print(f"星期几: {today.weekday()}")  # 0=周一, 6=周日
print(f"ISO星期几: {today.isoweekday()}")  # 1=周一, 7=周日

# 格式化
print(f"ISO格式: {today.isoformat()}")
print(f"字符串格式: {today.strftime('%Y年%m月%d日')}")

# 其他方法
print(f"序数: {today.toordinal()}")
print(f"时间元组: {today.timetuple()}")
print(f"ISO日历: {today.isocalendar()}")  # (年, 周数, 星期)
```

### time类 - 时间处理

#### 创建时间对象

```python
from datetime import time

# 创建时间对象
simple_time = time(14, 30, 0)  # 14:30:00
print(f"简单时间: {simple_time}")

# 包含微秒的时间
detailed_time = time(14, 30, 45, 123456)  # 14:30:45.123456
print(f"详细时间: {detailed_time}")

# 包含时区的时间
from datetime import timezone, timedelta
tz = timezone(timedelta(hours=8))  # UTC+8
time_with_tz = time(14, 30, 0, tzinfo=tz)
print(f"带时区时间: {time_with_tz}")

# 从ISO格式创建
iso_time = time.fromisoformat('14:30:45')
print(f"从ISO格式创建: {iso_time}")
```

#### 时间属性和操作

```python
t = time(14, 30, 45, 123456)

# 获取时间组件
print(f"小时: {t.hour}")
print(f"分钟: {t.minute}")
print(f"秒: {t.second}")
print(f"微秒: {t.microsecond}")
print(f"时区: {t.tzinfo}")

# 格式化
print(f"ISO格式: {t.isoformat()}")
print(f"自定义格式: {t.strftime('%H时%M分%S秒')}")

# 替换时间组件
new_time = t.replace(hour=16, minute=0)
print(f"替换后: {new_time}")
```

### datetime类 - 日期时间处理

#### 创建datetime对象

```python
from datetime import datetime, timezone, timedelta

# 获取当前时间
now = datetime.now()  # 本地时间
print(f"当前本地时间: {now}")

utc_now = datetime.utcnow()  # UTC时间（已弃用，建议使用timezone.utc）
print(f"当前UTC时间: {utc_now}")

# 推荐的UTC时间获取方式
utc_now_new = datetime.now(timezone.utc)
print(f"当前UTC时间(新): {utc_now_new}")

# 指定日期时间
specific_dt = datetime(2024, 1, 1, 12, 30, 45)
print(f"指定日期时间: {specific_dt}")

# 从字符串解析
dt_from_str = datetime.strptime('2024-01-01 12:30:45', '%Y-%m-%d %H:%M:%S')
print(f"从字符串解析: {dt_from_str}")

# 从ISO格式创建
iso_dt = datetime.fromisoformat('2024-01-01T12:30:45')
print(f"从ISO格式创建: {iso_dt}")

# 从时间戳创建
timestamp = 1704110445.0
dt_from_timestamp = datetime.fromtimestamp(timestamp)
print(f"从时间戳创建: {dt_from_timestamp}")
```

#### datetime属性和方法

```python
dt = datetime.now()

# 日期时间组件
print(f"年: {dt.year}, 月: {dt.month}, 日: {dt.day}")
print(f"时: {dt.hour}, 分: {dt.minute}, 秒: {dt.second}")
print(f"微秒: {dt.microsecond}")
print(f"时区: {dt.tzinfo}")

# 获取日期和时间部分
print(f"日期部分: {dt.date()}")
print(f"时间部分: {dt.time()}")

# 星期相关
print(f"星期几: {dt.weekday()}")
print(f"ISO星期几: {dt.isoweekday()}")

# 格式化
print(f"ISO格式: {dt.isoformat()}")
print(f"时间戳: {dt.timestamp()}")
print(f"自定义格式: {dt.strftime('%Y年%m月%d日 %H:%M:%S')}")

# 替换组件
new_dt = dt.replace(year=2025, hour=0, minute=0, second=0, microsecond=0)
print(f"替换后: {new_dt}")
```

### timedelta类 - 时间差计算

#### 创建时间差对象

```python
from datetime import timedelta

# 创建时间差
week = timedelta(weeks=1)
day = timedelta(days=1)
hour = timedelta(hours=1)
minute = timedelta(minutes=30)
second = timedelta(seconds=45)
microsecond = timedelta(microseconds=123456)

# 组合时间差
complex_delta = timedelta(days=7, hours=3, minutes=30, seconds=45)
print(f"复合时间差: {complex_delta}")

# 从总秒数创建
total_seconds = 3661  # 1小时1分1秒
delta_from_seconds = timedelta(seconds=total_seconds)
print(f"从秒数创建: {delta_from_seconds}")
```

#### 时间差运算

```python
from datetime import datetime, timedelta

now = datetime.now()
print(f"当前时间: {now}")

# 时间加减
tomorrow = now + timedelta(days=1)
yesterday = now - timedelta(days=1)
next_week = now + timedelta(weeks=1)
next_hour = now + timedelta(hours=1)

print(f"明天: {tomorrow}")
print(f"昨天: {yesterday}")
print(f"下周: {next_week}")
print(f"一小时后: {next_hour}")

# 计算时间差
start_time = datetime(2024, 1, 1, 9, 0, 0)
end_time = datetime(2024, 1, 1, 17, 30, 0)
work_duration = end_time - start_time
print(f"工作时长: {work_duration}")
print(f"工作小时数: {work_duration.total_seconds() / 3600}")

# 时间差属性
delta = timedelta(days=5, hours=3, minutes=30, seconds=45)
print(f"天数: {delta.days}")
print(f"秒数: {delta.seconds}")
print(f"微秒: {delta.microseconds}")
print(f"总秒数: {delta.total_seconds()}")
```

### 时区处理

#### timezone类

```python
from datetime import datetime, timezone, timedelta

# 创建时区对象
utc = timezone.utc
beijing = timezone(timedelta(hours=8))
tokyo = timezone(timedelta(hours=9))
newyork = timezone(timedelta(hours=-5))

print(f"UTC时区: {utc}")
print(f"北京时区: {beijing}")
print(f"东京时区: {tokyo}")
print(f"纽约时区: {newyork}")

# 创建带时区的datetime
utc_time = datetime.now(utc)
beijing_time = datetime.now(beijing)

print(f"UTC时间: {utc_time}")
print(f"北京时间: {beijing_time}")

# 时区转换
utc_dt = datetime(2024, 1, 1, 12, 0, 0, tzinfo=utc)
beijing_dt = utc_dt.astimezone(beijing)
tokyo_dt = utc_dt.astimezone(tokyo)

print(f"UTC: {utc_dt}")
print(f"北京: {beijing_dt}")
print(f"东京: {tokyo_dt}")
```

#### 时区转换示例

```python
# 本地时间转UTC
local_dt = datetime.now()
print(f"本地时间: {local_dt}")

# 为本地时间添加时区信息（假设是北京时间）
local_with_tz = local_dt.replace(tzinfo=beijing)
utc_converted = local_with_tz.astimezone(utc)
print(f"转换为UTC: {utc_converted}")

# UTC转其他时区
utc_dt = datetime.now(utc)
print(f"UTC时间: {utc_dt}")

timezones = {
    '北京': timezone(timedelta(hours=8)),
    '东京': timezone(timedelta(hours=9)),
    '伦敦': timezone(timedelta(hours=0)),
    '纽约': timezone(timedelta(hours=-5)),
    '洛杉矶': timezone(timedelta(hours=-8))
}

print("\n世界时间:")
for city, tz in timezones.items():
    local_time = utc_dt.astimezone(tz)
    print(f"{city}: {local_time.strftime('%Y-%m-%d %H:%M:%S %Z')}")
```

## 💡 实际应用

### 基础用法

```python
def format_datetime_examples():
    """日期时间格式化示例"""
    now = datetime.now()
    
    formats = {
        '标准格式': '%Y-%m-%d %H:%M:%S',
        '中文格式': '%Y年%m月%d日 %H时%M分%S秒',
        '美式格式': '%m/%d/%Y %I:%M:%S %p',
        '欧式格式': '%d/%m/%Y %H:%M:%S',
        '简短格式': '%y%m%d_%H%M%S',
        'ISO格式': '%Y-%m-%dT%H:%M:%S',
        '文件名格式': '%Y%m%d_%H%M%S',
        '日志格式': '[%Y-%m-%d %H:%M:%S]'
    }
    
    print("日期时间格式化示例:")
    for name, fmt in formats.items():
        formatted = now.strftime(fmt)
        print(f"{name}: {formatted}")
    
    return formats

# 使用示例
format_datetime_examples()
```

### 高级用法

```python
class DateTimeHelper:
    """日期时间助手类"""
    
    @staticmethod
    def get_age(birth_date):
        """计算年龄"""
        today = date.today()
        age = today.year - birth_date.year
        
        # 检查是否还没过生日
        if today.month < birth_date.month or \
           (today.month == birth_date.month and today.day < birth_date.day):
            age -= 1
        
        return age
    
    @staticmethod
    def get_workdays(start_date, end_date, holidays=None):
        """计算工作日数量（排除周末和节假日）"""
        if holidays is None:
            holidays = set()
        
        workdays = 0
        current = start_date
        
        while current <= end_date:
            # 检查是否为工作日（周一到周五）
            if current.weekday() < 5 and current not in holidays:
                workdays += 1
            current += timedelta(days=1)
        
        return workdays
    
    @staticmethod
    def get_next_weekday(start_date, weekday):
        """获取下一个指定星期几的日期"""
        days_ahead = weekday - start_date.weekday()
        if days_ahead <= 0:  # 目标日期已过，获取下周的
            days_ahead += 7
        return start_date + timedelta(days=days_ahead)
    
    @staticmethod
    def get_month_range(year, month):
        """获取指定月份的日期范围"""
        first_day = date(year, month, 1)
        
        # 计算下个月的第一天，然后减一天得到本月最后一天
        if month == 12:
            next_month = date(year + 1, 1, 1)
        else:
            next_month = date(year, month + 1, 1)
        
        last_day = next_month - timedelta(days=1)
        
        return first_day, last_day
    
    @staticmethod
    def format_duration(td):
        """格式化时间差为可读字符串"""
        total_seconds = int(td.total_seconds())
        
        days = total_seconds // 86400
        hours = (total_seconds % 86400) // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60
        
        parts = []
        if days:
            parts.append(f"{days}天")
        if hours:
            parts.append(f"{hours}小时")
        if minutes:
            parts.append(f"{minutes}分钟")
        if seconds or not parts:
            parts.append(f"{seconds}秒")
        
        return "".join(parts)

# 使用示例
helper = DateTimeHelper()

# 计算年龄
birth_date = date(1990, 5, 15)
age = helper.get_age(birth_date)
print(f"年龄: {age}岁")

# 计算工作日
start = date(2024, 1, 1)
end = date(2024, 1, 31)
holidays = {date(2024, 1, 1)}  # 元旦
workdays = helper.get_workdays(start, end, holidays)
print(f"2024年1月工作日: {workdays}天")

# 获取下一个周五
today = date.today()
next_friday = helper.get_next_weekday(today, 4)  # 4表示周五
print(f"下一个周五: {next_friday}")

# 获取月份范围
first, last = helper.get_month_range(2024, 2)
print(f"2024年2月: {first} 到 {last}")

# 格式化时间差
duration = timedelta(days=5, hours=3, minutes=30, seconds=45)
formatted = helper.format_duration(duration)
print(f"时间差: {formatted}")
```

### 实际案例

```python
from datetime import datetime, timedelta, timezone
import json

class EventScheduler:
    """事件调度器"""
    
    def __init__(self):
        self.events = []
        self.timezone = timezone(timedelta(hours=8))  # 默认北京时间
    
    def add_event(self, title, start_time, duration_minutes, description=""):
        """添加事件"""
        if isinstance(start_time, str):
            start_time = datetime.fromisoformat(start_time)
        
        # 确保时间有时区信息
        if start_time.tzinfo is None:
            start_time = start_time.replace(tzinfo=self.timezone)
        
        end_time = start_time + timedelta(minutes=duration_minutes)
        
        event = {
            'id': len(self.events) + 1,
            'title': title,
            'start_time': start_time,
            'end_time': end_time,
            'duration': timedelta(minutes=duration_minutes),
            'description': description,
            'created_at': datetime.now(self.timezone)
        }
        
        self.events.append(event)
        return event['id']
    
    def get_events_by_date(self, target_date):
        """获取指定日期的事件"""
        if isinstance(target_date, str):
            target_date = datetime.fromisoformat(target_date).date()
        elif isinstance(target_date, datetime):
            target_date = target_date.date()
        
        day_events = []
        for event in self.events:
            if event['start_time'].date() == target_date:
                day_events.append(event)
        
        # 按开始时间排序
        day_events.sort(key=lambda x: x['start_time'])
        return day_events
    
    def check_conflicts(self, start_time, end_time):
        """检查时间冲突"""
        conflicts = []
        
        for event in self.events:
            # 检查时间重叠
            if (start_time < event['end_time'] and end_time > event['start_time']):
                conflicts.append(event)
        
        return conflicts
    
    def get_free_time(self, date, work_start=9, work_end=18):
        """获取指定日期的空闲时间段"""
        if isinstance(date, str):
            date = datetime.fromisoformat(date).date()
        
        # 工作时间范围
        work_start_dt = datetime.combine(date, datetime.min.time().replace(hour=work_start))
        work_end_dt = datetime.combine(date, datetime.min.time().replace(hour=work_end))
        
        # 添加时区信息
        work_start_dt = work_start_dt.replace(tzinfo=self.timezone)
        work_end_dt = work_end_dt.replace(tzinfo=self.timezone)
        
        # 获取当天的事件
        day_events = self.get_events_by_date(date)
        
        free_periods = []
        current_time = work_start_dt
        
        for event in day_events:
            # 如果事件开始时间在工作时间内
            if event['start_time'] >= work_start_dt and event['start_time'] <= work_end_dt:
                if current_time < event['start_time']:
                    # 添加空闲时间段
                    free_periods.append({
                        'start': current_time,
                        'end': event['start_time'],
                        'duration': event['start_time'] - current_time
                    })
                
                # 更新当前时间到事件结束时间
                current_time = max(current_time, event['end_time'])
        
        # 检查最后一个事件到工作结束时间的空闲时间
        if current_time < work_end_dt:
            free_periods.append({
                'start': current_time,
                'end': work_end_dt,
                'duration': work_end_dt - current_time
            })
        
        return free_periods
    
    def generate_daily_schedule(self, date):
        """生成日程表"""
        events = self.get_events_by_date(date)
        free_times = self.get_free_time(date)
        
        schedule = f"\n{date} 日程安排\n"
        schedule += "=" * 30 + "\n"
        
        if not events:
            schedule += "今天没有安排事件\n"
        else:
            schedule += "已安排事件:\n"
            for event in events:
                start_str = event['start_time'].strftime('%H:%M')
                end_str = event['end_time'].strftime('%H:%M')
                duration_str = DateTimeHelper.format_duration(event['duration'])
                
                schedule += f"  {start_str}-{end_str} {event['title']} ({duration_str})\n"
                if event['description']:
                    schedule += f"    描述: {event['description']}\n"
        
        if free_times:
            schedule += "\n空闲时间:\n"
            for free in free_times:
                start_str = free['start'].strftime('%H:%M')
                end_str = free['end'].strftime('%H:%M')
                duration_str = DateTimeHelper.format_duration(free['duration'])
                schedule += f"  {start_str}-{end_str} (空闲 {duration_str})\n"
        
        return schedule
    
    def export_events(self, filename):
        """导出事件到JSON文件"""
        export_data = []
        
        for event in self.events:
            export_event = {
                'id': event['id'],
                'title': event['title'],
                'start_time': event['start_time'].isoformat(),
                'end_time': event['end_time'].isoformat(),
                'duration_minutes': int(event['duration'].total_seconds() / 60),
                'description': event['description'],
                'created_at': event['created_at'].isoformat()
            }
            export_data.append(export_event)
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, ensure_ascii=False, indent=2)
        
        print(f"事件已导出到 {filename}")

# 使用示例
scheduler = EventScheduler()

# 添加一些事件
scheduler.add_event("晨会", "2024-01-15T09:00:00", 30, "团队日常晨会")
scheduler.add_event("项目评审", "2024-01-15T10:30:00", 90, "新项目方案评审")
scheduler.add_event("午餐", "2024-01-15T12:00:00", 60, "团队聚餐")
scheduler.add_event("客户会议", "2024-01-15T14:00:00", 120, "与客户讨论需求")
scheduler.add_event("代码审查", "2024-01-15T16:30:00", 60, "代码质量检查")

# 生成日程表
schedule = scheduler.generate_daily_schedule(date(2024, 1, 15))
print(schedule)

# 检查冲突
conflicts = scheduler.check_conflicts(
    datetime(2024, 1, 15, 10, 0, tzinfo=scheduler.timezone),
    datetime(2024, 1, 15, 11, 0, tzinfo=scheduler.timezone)
)

if conflicts:
    print(f"\n时间冲突检测:")
    for conflict in conflicts:
        print(f"  与 '{conflict['title']}' 冲突")
else:
    print("\n没有时间冲突")

# 导出事件
scheduler.export_events('events.json')
```

## ⚠️ 注意事项

- **时区处理**: 始终明确指定时区，避免时区混乱
- **夏令时**: 在处理时区转换时要考虑夏令时的影响
- **精度**: datetime的精度为微秒，对于更高精度需求考虑其他方案
- **性能**: 大量日期时间计算时注意性能优化
- **本地化**: 月份和星期名称的本地化需要额外处理
- **闰秒**: datetime不处理闰秒，如需要考虑使用专门的库

## 🔗 相关内容

- [time模块](time/) - 基础时间处理功能
- [calendar模块](calendar/) - 日历相关功能
- [内置函数](../builtins/) - 了解相关的内置函数

## 📚 扩展阅读

- [Python datetime模块官方文档](https://docs.python.org/3/library/datetime.html)
- [ISO 8601日期时间标准](https://en.wikipedia.org/wiki/ISO_8601)
- [时区数据库](https://www.iana.org/time-zones)
- [Python时区处理最佳实践](https://docs.python.org/3/library/datetime.html#timezone-objects)

## 🏷️ 标签

`日期时间` `时区` `格式化` `计算` `时间差` `标准库`

---

**最后更新**: 2024-01-01  
**作者**: Python文档团队  
**版本**: 1.0