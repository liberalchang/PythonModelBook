---
layout: doc
title: Pendulum库
permalink: /docs/thirdparty/pendulum/
category: thirdparty
tags: [第三方库, 日期时间, 时区, 解析, 格式化]
description: Pendulum - Python中更好的日期时间处理库，提供直观的API和强大的时区支持
author: Python文档团队
date: 2024-01-01
updated: 2024-01-01
version: 1.0
difficulty: 中级
---

# Pendulum库

## 📝 概述

Pendulum是一个Python第三方库，旨在成为标准datetime库的替代品。它提供了更直观的API、更好的时区支持、更强大的解析功能和本地化支持。Pendulum完全兼容datetime，但提供了更多便利的功能和更好的性能。

## 🎯 学习目标

- 掌握Pendulum库的安装和基本使用
- 学会使用Pendulum进行日期时间创建和操作
- 了解Pendulum的时区处理和转换
- 掌握日期时间的解析和格式化
- 学会使用Pendulum进行日期时间计算
- 了解本地化和人性化显示功能

## 📋 前置知识

- Python基本语法
- 了解datetime模块的基本概念
- 包管理工具pip的使用
- 时区和UTC概念

## 🔧 安装

```bash
# 使用pip安装
pip install pendulum

# 或使用conda安装
conda install -c conda-forge pendulum
```

## 🔍 详细内容

### 基本导入和创建

```python
import pendulum

# 获取当前时间
now = pendulum.now()
print(f"当前时间: {now}")

# 获取UTC时间
utc_now = pendulum.now('UTC')
print(f"UTC时间: {utc_now}")

# 获取特定时区的时间
beijing_now = pendulum.now('Asia/Shanghai')
tokyo_now = pendulum.now('Asia/Tokyo')
newyork_now = pendulum.now('America/New_York')

print(f"北京时间: {beijing_now}")
print(f"东京时间: {tokyo_now}")
print(f"纽约时间: {newyork_now}")

# 获取今天的日期
today = pendulum.today()
print(f"今天: {today}")

# 获取明天和昨天
tomorrow = pendulum.tomorrow()
yesterday = pendulum.yesterday()
print(f"明天: {tomorrow}")
print(f"昨天: {yesterday}")
```

### 创建特定日期时间

```python
# 创建特定日期时间
dt = pendulum.datetime(2024, 1, 1, 12, 30, 45)
print(f"指定日期时间: {dt}")

# 创建带时区的日期时间
dt_with_tz = pendulum.datetime(2024, 1, 1, 12, 30, 45, tz='Asia/Shanghai')
print(f"带时区的日期时间: {dt_with_tz}")

# 创建日期
date_only = pendulum.date(2024, 1, 1)
print(f"仅日期: {date_only}")

# 创建时间
time_only = pendulum.time(12, 30, 45)
print(f"仅时间: {time_only}")

# 从时间戳创建
timestamp = 1704110445
dt_from_timestamp = pendulum.from_timestamp(timestamp)
print(f"从时间戳创建: {dt_from_timestamp}")

# 从时间戳创建（指定时区）
dt_from_timestamp_tz = pendulum.from_timestamp(timestamp, tz='Asia/Shanghai')
print(f"从时间戳创建(带时区): {dt_from_timestamp_tz}")
```

### 字符串解析

```python
# 解析ISO格式字符串
iso_dt = pendulum.parse('2024-01-01T12:30:45')
print(f"解析ISO格式: {iso_dt}")

# 解析带时区的字符串
iso_with_tz = pendulum.parse('2024-01-01T12:30:45+08:00')
print(f"解析带时区: {iso_with_tz}")

# 解析各种格式的字符串
formats = [
    '2024-01-01',
    '2024/01/01',
    '01/01/2024',
    '2024-01-01 12:30:45',
    '2024年1月1日',
    'January 1, 2024',
    '1st January 2024'
]

print("\n解析不同格式的字符串:")
for fmt in formats:
    try:
        parsed = pendulum.parse(fmt)
        print(f"{fmt:20} -> {parsed}")
    except Exception as e:
        print(f"{fmt:20} -> 解析失败: {e}")

# 严格模式解析
try:
    strict_parse = pendulum.parse('2024-13-01', strict=True)  # 无效月份
except Exception as e:
    print(f"严格模式解析失败: {e}")

# 指定默认时区
default_tz_parse = pendulum.parse('2024-01-01 12:30:45', tz='Asia/Shanghai')
print(f"指定默认时区: {default_tz_parse}")
```

### 格式化输出

```python
dt = pendulum.now('Asia/Shanghai')

# 基本格式化
print(f"ISO格式: {dt.to_iso8601_string()}")
print(f"日期字符串: {dt.to_date_string()}")
print(f"时间字符串: {dt.to_time_string()}")
print(f"日期时间字符串: {dt.to_datetime_string()}")

# 自定义格式化
formats = {
    '标准格式': 'YYYY-MM-DD HH:mm:ss',
    '中文格式': 'YYYY年MM月DD日 HH时mm分ss秒',
    '美式格式': 'MM/DD/YYYY hh:mm:ss A',
    '欧式格式': 'DD/MM/YYYY HH:mm:ss',
    '简短格式': 'YYMMDD_HHmmss',
    '文件名格式': 'YYYY-MM-DD_HH-mm-ss',
    '星期格式': 'dddd, MMMM Do YYYY',
    '相对格式': 'YYYY-MM-DD (dddd)'
}

print("\n自定义格式化:")
for name, fmt in formats.items():
    formatted = dt.format(fmt)
    print(f"{name}: {formatted}")

# 本地化格式化
dt_cn = dt.in_timezone('Asia/Shanghai')
print(f"\n本地化格式化:")
print(f"中文: {dt_cn.format('YYYY年MM月DD日 dddd', locale='zh')}")
print(f"英文: {dt_cn.format('MMMM Do, YYYY (dddd)', locale='en')}")
print(f"日文: {dt_cn.format('YYYY年MM月DD日 (dddd)', locale='ja')}")
```

### 时区操作

```python
# 创建不同时区的时间
utc_time = pendulum.now('UTC')
beijing_time = pendulum.now('Asia/Shanghai')
tokyo_time = pendulum.now('Asia/Tokyo')
london_time = pendulum.now('Europe/London')
newyork_time = pendulum.now('America/New_York')

print("世界时间:")
print(f"UTC:    {utc_time.format('YYYY-MM-DD HH:mm:ss')}")
print(f"北京:   {beijing_time.format('YYYY-MM-DD HH:mm:ss')}")
print(f"东京:   {tokyo_time.format('YYYY-MM-DD HH:mm:ss')}")
print(f"伦敦:   {london_time.format('YYYY-MM-DD HH:mm:ss')}")
print(f"纽约:   {newyork_time.format('YYYY-MM-DD HH:mm:ss')}")

# 时区转换
base_time = pendulum.now('UTC')
print(f"\n时区转换 (基准UTC时间: {base_time.format('HH:mm:ss')}):")

timezones = [
    'Asia/Shanghai',
    'Asia/Tokyo', 
    'Europe/London',
    'America/New_York',
    'America/Los_Angeles',
    'Australia/Sydney'
]

for tz in timezones:
    converted = base_time.in_timezone(tz)
    print(f"{tz:20} {converted.format('HH:mm:ss (Z)')}")

# 获取时区信息
dt_with_tz = pendulum.now('Asia/Shanghai')
print(f"\n时区信息:")
print(f"时区名称: {dt_with_tz.timezone_name}")
print(f"时区缩写: {dt_with_tz.timezone.name}")
print(f"UTC偏移: {dt_with_tz.offset_hours}小时")
print(f"是否夏令时: {dt_with_tz.is_dst()}")
```

### 日期时间计算

```python
# 基本加减运算
base_dt = pendulum.now()
print(f"基准时间: {base_dt}")

# 加减时间
print(f"\n时间加减:")
print(f"1小时后: {base_dt.add(hours=1)}")
print(f"30分钟后: {base_dt.add(minutes=30)}")
print(f"1天后: {base_dt.add(days=1)}")
print(f"1周后: {base_dt.add(weeks=1)}")
print(f"1个月后: {base_dt.add(months=1)}")
print(f"1年后: {base_dt.add(years=1)}")

print(f"\n时间减法:")
print(f"1小时前: {base_dt.subtract(hours=1)}")
print(f"1天前: {base_dt.subtract(days=1)}")
print(f"1个月前: {base_dt.subtract(months=1)}")

# 复合运算
complex_add = base_dt.add(years=1, months=2, days=3, hours=4, minutes=5, seconds=6)
print(f"\n复合加法: {complex_add}")

# 时间差计算
start_time = pendulum.datetime(2024, 1, 1, 9, 0, 0)
end_time = pendulum.datetime(2024, 1, 1, 17, 30, 0)
diff = end_time - start_time

print(f"\n时间差计算:")
print(f"开始时间: {start_time}")
print(f"结束时间: {end_time}")
print(f"时间差: {diff}")
print(f"总秒数: {diff.total_seconds()}")
print(f"总小时数: {diff.total_seconds() / 3600}")

# 使用diff方法
diff_obj = start_time.diff(end_time)
print(f"\ndiff对象:")
print(f"小时差: {diff_obj.in_hours()}")
print(f"分钟差: {diff_obj.in_minutes()}")
print(f"秒差: {diff_obj.in_seconds()}")
print(f"天差: {diff_obj.in_days()}")
```

### 人性化显示

```python
# 相对时间显示
base_time = pendulum.now()

times = [
    base_time.subtract(years=2),
    base_time.subtract(months=3),
    base_time.subtract(weeks=2),
    base_time.subtract(days=5),
    base_time.subtract(hours=3),
    base_time.subtract(minutes=30),
    base_time.subtract(seconds=45),
    base_time.add(seconds=30),
    base_time.add(minutes=15),
    base_time.add(hours=2),
    base_time.add(days=3),
    base_time.add(weeks=1),
    base_time.add(months=2),
    base_time.add(years=1)
]

print("人性化时间显示:")
for time_obj in times:
    print(f"{time_obj.format('YYYY-MM-DD HH:mm:ss'):20} -> {time_obj.diff_for_humans()}")

# 本地化的人性化显示
print(f"\n本地化人性化显示:")
for time_obj in times[:5]:
    print(f"英文: {time_obj.diff_for_humans(locale='en')}")
    print(f"中文: {time_obj.diff_for_humans(locale='zh')}")
    print(f"日文: {time_obj.diff_for_humans(locale='ja')}")
    print("---")
```

### 日期时间属性和方法

```python
dt = pendulum.now('Asia/Shanghai')

print("日期时间属性:")
print(f"年份: {dt.year}")
print(f"月份: {dt.month}")
print(f"日期: {dt.day}")
print(f"小时: {dt.hour}")
print(f"分钟: {dt.minute}")
print(f"秒: {dt.second}")
print(f"微秒: {dt.microsecond}")
print(f"星期几: {dt.day_of_week}")
print(f"一年中的第几天: {dt.day_of_year}")
print(f"一年中的第几周: {dt.week_of_year}")
print(f"一月中的第几周: {dt.week_of_month}")
print(f"季度: {dt.quarter}")

print(f"\n星期和月份名称:")
print(f"星期名称: {dt.format('dddd')}")
print(f"月份名称: {dt.format('MMMM')}")
print(f"星期缩写: {dt.format('ddd')}")
print(f"月份缩写: {dt.format('MMM')}")

print(f"\n布尔属性:")
print(f"是否闰年: {dt.is_leap_year()}")
print(f"是否夏令时: {dt.is_dst()}")
print(f"是否过去: {dt.is_past()}")
print(f"是否未来: {dt.is_future()}")
print(f"是否今天: {dt.is_today()}")
print(f"是否昨天: {dt.is_yesterday()}")
print(f"是否明天: {dt.is_tomorrow()}")
print(f"是否周末: {dt.is_weekend()}")
print(f"是否工作日: {dt.is_weekday()}")

# 月份和年份的开始/结束
print(f"\n时间边界:")
print(f"月初: {dt.start_of('month')}")
print(f"月末: {dt.end_of('month')}")
print(f"年初: {dt.start_of('year')}")
print(f"年末: {dt.end_of('year')}")
print(f"周初: {dt.start_of('week')}")
print(f"周末: {dt.end_of('week')}")
print(f"日初: {dt.start_of('day')}")
print(f"日末: {dt.end_of('day')}")
```

## 💡 实际应用

### 基础用法

```python
def datetime_formatter():
    """日期时间格式化工具"""
    now = pendulum.now('Asia/Shanghai')
    
    formats = {
        'ISO': now.to_iso8601_string(),
        'RFC': now.to_rfc3339_string(),
        '时间戳': str(now.timestamp()),
        '日期': now.to_date_string(),
        '时间': now.to_time_string(),
        '中文': now.format('YYYY年MM月DD日 HH时mm分ss秒'),
        '文件名': now.format('YYYY-MM-DD_HH-mm-ss'),
        '日志': now.format('[YYYY-MM-DD HH:mm:ss]'),
        '相对时间': now.diff_for_humans()
    }
    
    print("日期时间格式化:")
    for name, value in formats.items():
        print(f"{name:8}: {value}")
    
    return formats

# 使用示例
datetime_formatter()
```

### 高级用法

```python
class TimeZoneConverter:
    """时区转换器"""
    
    def __init__(self):
        self.common_timezones = {
            'UTC': 'UTC',
            '北京': 'Asia/Shanghai',
            '东京': 'Asia/Tokyo',
            '首尔': 'Asia/Seoul',
            '新加坡': 'Asia/Singapore',
            '悉尼': 'Australia/Sydney',
            '伦敦': 'Europe/London',
            '巴黎': 'Europe/Paris',
            '纽约': 'America/New_York',
            '洛杉矶': 'America/Los_Angeles',
            '芝加哥': 'America/Chicago',
            '多伦多': 'America/Toronto'
        }
    
    def convert_time(self, time_str, from_tz, to_tz):
        """转换时间到不同时区"""
        # 解析时间字符串
        dt = pendulum.parse(time_str, tz=from_tz)
        
        # 转换到目标时区
        converted = dt.in_timezone(to_tz)
        
        return {
            'original': dt,
            'converted': converted,
            'from_tz': from_tz,
            'to_tz': to_tz
        }
    
    def world_clock(self, base_time=None):
        """世界时钟"""
        if base_time is None:
            base_time = pendulum.now('UTC')
        elif isinstance(base_time, str):
            base_time = pendulum.parse(base_time, tz='UTC')
        
        world_times = {}
        for city, tz in self.common_timezones.items():
            local_time = base_time.in_timezone(tz)
            world_times[city] = {
                'time': local_time,
                'formatted': local_time.format('YYYY-MM-DD HH:mm:ss'),
                'timezone': tz,
                'offset': local_time.format('Z')
            }
        
        return world_times
    
    def meeting_time_finder(self, participants_tz, duration_hours=1):
        """寻找适合多时区参与者的会议时间"""
        # 工作时间范围（9:00-18:00）
        work_start = 9
        work_end = 18
        
        base_date = pendulum.tomorrow('UTC').start_of('day')
        suitable_times = []
        
        # 检查24小时内的每个小时
        for hour in range(24):
            meeting_time = base_date.add(hours=hour)
            is_suitable = True
            
            participant_times = {}
            for participant, tz in participants_tz.items():
                local_time = meeting_time.in_timezone(tz)
                participant_times[participant] = local_time
                
                # 检查是否在工作时间内
                if not (work_start <= local_time.hour < work_end - duration_hours):
                    is_suitable = False
                    break
                
                # 检查是否为工作日
                if local_time.is_weekend():
                    is_suitable = False
                    break
            
            if is_suitable:
                suitable_times.append({
                    'utc_time': meeting_time,
                    'participant_times': participant_times
                })
        
        return suitable_times
    
    def display_world_clock(self):
        """显示世界时钟"""
        world_times = self.world_clock()
        
        print("🌍 世界时钟")
        print("=" * 50)
        
        for city, info in world_times.items():
            time_str = info['formatted']
            offset = info['offset']
            print(f"{city:8} {time_str} ({offset})")
        
        return world_times

# 使用示例
converter = TimeZoneConverter()

# 显示世界时钟
converter.display_world_clock()

# 时区转换
result = converter.convert_time('2024-01-15 14:30:00', 'Asia/Shanghai', 'America/New_York')
print(f"\n时区转换:")
print(f"原时间: {result['original']} ({result['from_tz']})")
print(f"转换后: {result['converted']} ({result['to_tz']})")

# 寻找会议时间
participants = {
    '张三': 'Asia/Shanghai',
    'John': 'America/New_York',
    'Tanaka': 'Asia/Tokyo',
    'Smith': 'Europe/London'
}

suitable_times = converter.meeting_time_finder(participants)
print(f"\n适合的会议时间:")
for i, time_slot in enumerate(suitable_times[:3], 1):
    print(f"\n选项 {i}: {time_slot['utc_time'].format('YYYY-MM-DD HH:mm')} UTC")
    for participant, local_time in time_slot['participant_times'].items():
        print(f"  {participant:8}: {local_time.format('YYYY-MM-DD HH:mm')} ({local_time.timezone_name})")
```

### 实际案例

```python
class EventManager:
    """事件管理器"""
    
    def __init__(self, default_timezone='Asia/Shanghai'):
        self.events = []
        self.default_timezone = default_timezone
    
    def add_event(self, title, start_time, duration=None, end_time=None, 
                  timezone=None, description="", location=""):
        """添加事件"""
        if timezone is None:
            timezone = self.default_timezone
        
        # 解析开始时间
        if isinstance(start_time, str):
            start_dt = pendulum.parse(start_time, tz=timezone)
        else:
            start_dt = start_time
        
        # 计算结束时间
        if end_time:
            if isinstance(end_time, str):
                end_dt = pendulum.parse(end_time, tz=timezone)
            else:
                end_dt = end_time
        elif duration:
            if isinstance(duration, dict):
                end_dt = start_dt.add(**duration)
            else:
                # 假设duration是小时数
                end_dt = start_dt.add(hours=duration)
        else:
            # 默认1小时
            end_dt = start_dt.add(hours=1)
        
        event = {
            'id': len(self.events) + 1,
            'title': title,
            'start_time': start_dt,
            'end_time': end_dt,
            'duration': end_dt - start_dt,
            'timezone': timezone,
            'description': description,
            'location': location,
            'created_at': pendulum.now(timezone)
        }
        
        self.events.append(event)
        return event['id']
    
    def get_events_by_date_range(self, start_date, end_date, timezone=None):
        """获取日期范围内的事件"""
        if timezone is None:
            timezone = self.default_timezone
        
        # 解析日期
        if isinstance(start_date, str):
            start_dt = pendulum.parse(start_date, tz=timezone).start_of('day')
        else:
            start_dt = start_date.start_of('day')
        
        if isinstance(end_date, str):
            end_dt = pendulum.parse(end_date, tz=timezone).end_of('day')
        else:
            end_dt = end_date.end_of('day')
        
        filtered_events = []
        for event in self.events:
            event_start = event['start_time'].in_timezone(timezone)
            if start_dt <= event_start <= end_dt:
                filtered_events.append(event)
        
        # 按开始时间排序
        filtered_events.sort(key=lambda x: x['start_time'])
        return filtered_events
    
    def get_upcoming_events(self, days=7, timezone=None):
        """获取即将到来的事件"""
        if timezone is None:
            timezone = self.default_timezone
        
        now = pendulum.now(timezone)
        future_date = now.add(days=days)
        
        upcoming = []
        for event in self.events:
            event_start = event['start_time'].in_timezone(timezone)
            if now <= event_start <= future_date:
                upcoming.append(event)
        
        upcoming.sort(key=lambda x: x['start_time'])
        return upcoming
    
    def generate_calendar_view(self, year, month, timezone=None):
        """生成日历视图"""
        if timezone is None:
            timezone = self.default_timezone
        
        # 获取月份的第一天和最后一天
        first_day = pendulum.datetime(year, month, 1, tz=timezone)
        last_day = first_day.end_of('month')
        
        # 获取该月的所有事件
        month_events = self.get_events_by_date_range(first_day, last_day, timezone)
        
        # 按日期分组事件
        events_by_date = {}
        for event in month_events:
            event_date = event['start_time'].in_timezone(timezone).date()
            if event_date not in events_by_date:
                events_by_date[event_date] = []
            events_by_date[event_date].append(event)
        
        # 生成日历
        calendar_str = f"\n{year}年{month}月 日历\n"
        calendar_str += "=" * 40 + "\n"
        calendar_str += "日  一  二  三  四  五  六\n"
        calendar_str += "-" * 40 + "\n"
        
        # 获取月份第一天是星期几
        first_weekday = first_day.day_of_week % 7  # 转换为0=周日的格式
        
        # 填充第一周的空白
        calendar_str += "   " * first_weekday
        
        # 填充日期
        current_date = first_day
        while current_date.month == month:
            day_str = f"{current_date.day:2d}"
            
            # 检查是否有事件
            if current_date.date() in events_by_date:
                day_str += "*"  # 标记有事件的日期
            else:
                day_str += " "
            
            calendar_str += day_str
            
            # 换行处理
            if current_date.day_of_week % 7 == 6:  # 周六
                calendar_str += "\n"
            
            current_date = current_date.add(days=1)
        
        # 添加事件详情
        if events_by_date:
            calendar_str += "\n\n事件详情:\n"
            calendar_str += "-" * 40 + "\n"
            
            for date, events in sorted(events_by_date.items()):
                calendar_str += f"\n{date.format('MM月DD日')} ({pendulum.instance(date).format('dddd')}):")
                for event in events:
                    start_time = event['start_time'].in_timezone(timezone)
                    end_time = event['end_time'].in_timezone(timezone)
                    calendar_str += f"\n  {start_time.format('HH:mm')}-{end_time.format('HH:mm')} {event['title']}"
                    if event['location']:
                        calendar_str += f" @ {event['location']}"
        
        return calendar_str
    
    def export_to_ical(self, filename):
        """导出为iCal格式"""
        ical_content = "BEGIN:VCALENDAR\n"
        ical_content += "VERSION:2.0\n"
        ical_content += "PRODID:-//Event Manager//Event Manager 1.0//EN\n"
        
        for event in self.events:
            ical_content += "BEGIN:VEVENT\n"
            ical_content += f"UID:{event['id']}@eventmanager\n"
            ical_content += f"DTSTART:{event['start_time'].format('YYYYMMDDTHHmmss')}Z\n"
            ical_content += f"DTEND:{event['end_time'].format('YYYYMMDDTHHmmss')}Z\n"
            ical_content += f"SUMMARY:{event['title']}\n"
            if event['description']:
                ical_content += f"DESCRIPTION:{event['description']}\n"
            if event['location']:
                ical_content += f"LOCATION:{event['location']}\n"
            ical_content += f"CREATED:{event['created_at'].format('YYYYMMDDTHHmmss')}Z\n"
            ical_content += "END:VEVENT\n"
        
        ical_content += "END:VCALENDAR\n"
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(ical_content)
        
        print(f"日历已导出到 {filename}")

# 使用示例
manager = EventManager()

# 添加一些事件
manager.add_event(
    "项目启动会议",
    "2024-01-15 09:00:00",
    duration={'hours': 2},
    description="新项目启动会议，讨论项目计划和分工",
    location="会议室A"
)

manager.add_event(
    "客户演示",
    "2024-01-15 14:00:00",
    end_time="2024-01-15 16:00:00",
    description="向客户演示产品功能",
    location="客户办公室"
)

manager.add_event(
    "团队建设活动",
    "2024-01-20 10:00:00",
    duration={'hours': 4},
    description="团队户外活动",
    location="公园"
)

# 获取即将到来的事件
upcoming = manager.get_upcoming_events(days=30)
print("即将到来的事件:")
for event in upcoming:
    start_time = event['start_time']
    print(f"- {event['title']}: {start_time.format('MM月DD日 HH:mm')} ({start_time.diff_for_humans()})")

# 生成日历视图
calendar_view = manager.generate_calendar_view(2024, 1)
print(calendar_view)

# 导出日历
manager.export_to_ical('events.ics')
```

## ⚠️ 注意事项

- **性能**: Pendulum比标准datetime稍慢，但提供更多功能
- **依赖**: Pendulum依赖于系统的时区数据库
- **兼容性**: 虽然兼容datetime，但某些操作可能需要转换
- **本地化**: 需要安装相应的语言包才能支持本地化
- **时区数据**: 确保时区数据库是最新的
- **内存使用**: 大量日期时间对象可能占用较多内存

## 🔗 相关内容

- [datetime模块](datetime/) - Python标准日期时间模块
- [time模块](time/) - 基础时间处理功能
- [calendar模块](calendar/) - 日历相关功能

## 📚 扩展阅读

- [Pendulum官方文档](https://pendulum.eustace.io/)
- [时区数据库](https://www.iana.org/time-zones)
- [ISO 8601标准](https://en.wikipedia.org/wiki/ISO_8601)
- [RFC 3339标准](https://tools.ietf.org/html/rfc3339)
- [Python时间处理最佳实践](https://docs.python.org/3/library/datetime.html#datetime-objects)

## 🏷️ 标签

`第三方库` `日期时间` `时区` `解析` `格式化` `本地化` `人性化`

---

**最后更新**: 2024-01-01  
**作者**: Python文档团队  
**版本**: 1.0