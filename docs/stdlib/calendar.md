---
layout: doc
title: calendar模块
permalink: /docs/stdlib/calendar/
category: stdlib
tags: [日历, 月历, 年历, 标准库]
description: Python calendar模块的完整指南，包含日历生成、日期计算、节假日处理等功能
author: Python文档团队
date: 2024-01-01
updated: 2024-01-01
version: 1.0
difficulty: 初级
---

# calendar模块

## 📝 概述

calendar模块提供了与日历相关的实用函数，可以生成文本和HTML格式的日历，进行日期计算，以及处理与星期、月份相关的各种操作。该模块遵循理想化的日历，当前的公历向前和向后无限延伸。

## 🎯 学习目标

- 掌握日历的生成和显示
- 学会日期和星期的计算
- 了解闰年判断和月份天数计算
- 掌握日历的自定义和格式化
- 学会HTML日历的生成

## 📋 前置知识

- Python基本语法
- 基本的日期时间概念
- 了解公历系统

## 🔍 详细内容

### 基本日历函数

#### 日历显示

```python
import calendar

# 显示整年日历
print("2024年日历:")
print(calendar.calendar(2024))

# 显示指定月份的日历
print("\n2024年1月日历:")
print(calendar.month(2024, 1))

# 设置日历格式
calendar.setfirstweekday(calendar.MONDAY)  # 设置周一为一周的第一天
print("\n以周一为首的2024年1月日历:")
print(calendar.month(2024, 1))

# 恢复默认设置（周日为首）
calendar.setfirstweekday(calendar.SUNDAY)
```

#### 日历信息获取

```python
# 获取月份的日历矩阵
month_calendar = calendar.monthcalendar(2024, 1)
print("2024年1月日历矩阵:")
for week in month_calendar:
    print(week)
# 输出: [[0, 1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12, 13], ...]
# 注意: 0表示不属于当月的日期

# 获取月份范围
first_weekday, days_in_month = calendar.monthrange(2024, 1)
print(f"\n2024年1月第一天是星期{first_weekday}，共有{days_in_month}天")
# first_weekday: 0=周一, 1=周二, ..., 6=周日

# 获取指定日期是星期几
weekday = calendar.weekday(2024, 1, 1)
print(f"2024年1月1日是星期{weekday}")
# 0=周一, 1=周二, ..., 6=周日
```

### 日期计算函数

#### 闰年和天数计算

```python
# 判断是否为闰年
years = [2020, 2021, 2022, 2023, 2024]
for year in years:
    is_leap = calendar.isleap(year)
    print(f"{year}年是{'闰年' if is_leap else '平年'}")

# 计算指定年份范围内的闰年数量
leap_count = calendar.leapdays(2020, 2025)
print(f"\n2020-2024年间有{leap_count}个闰年")

# 获取月份天数
months = [(2024, 2), (2023, 2), (2024, 4), (2024, 12)]
for year, month in months:
    days = calendar.monthrange(year, month)[1]
    print(f"{year}年{month}月有{days}天")
```

#### 星期相关计算

```python
# 星期名称
weekday_names = {
    0: '周一', 1: '周二', 2: '周三', 3: '周四',
    4: '周五', 5: '周六', 6: '周日'
}

# 计算一年中每个月1号是星期几
print("2024年各月1号的星期:")
for month in range(1, 13):
    weekday = calendar.weekday(2024, month, 1)
    month_name = calendar.month_name[month]
    print(f"{month_name}1日: {weekday_names[weekday]}")

# 获取星期和月份的名称
print("\n星期名称:")
for i in range(7):
    print(f"{i}: {calendar.day_name[i]} ({calendar.day_abbr[i]})")

print("\n月份名称:")
for i in range(1, 13):
    print(f"{i}: {calendar.month_name[i]} ({calendar.month_abbr[i]})")
```

### 自定义日历类

#### TextCalendar类

```python
# 创建自定义文本日历
text_cal = calendar.TextCalendar(firstweekday=0)  # 周一为首

# 生成月份日历
month_str = text_cal.formatmonth(2024, 1)
print("自定义月历:")
print(month_str)

# 生成年度日历
year_str = text_cal.formatyear(2024, w=2, l=1, c=6, m=3)
print("\n自定义年历:")
print(year_str)

# 迭代月份中的日期
print("\n2024年1月的所有日期:")
for week in text_cal.monthdays2calendar(2024, 1):
    for day, weekday in week:
        if day != 0:
            print(f"{day}日({weekday_names[weekday]})", end="  ")
    print()  # 换行
```

#### HTMLCalendar类

```python
# 创建HTML日历
html_cal = calendar.HTMLCalendar(firstweekday=0)

# 生成HTML月历
html_month = html_cal.formatmonth(2024, 1)
print("HTML月历:")
print(html_month[:200] + "...")  # 只显示前200个字符

# 生成HTML年历
html_year = html_cal.formatyear(2024)
print(f"\nHTML年历长度: {len(html_year)} 字符")

# 保存HTML日历到文件
with open('calendar_2024.html', 'w', encoding='utf-8') as f:
    f.write(f"""
<!DOCTYPE html>
<html>
<head>
    <title>2024年日历</title>
    <meta charset="utf-8">
    <style>
        table { border-collapse: collapse; margin: 20px; }
        th, td { border: 1px solid #ccc; padding: 5px; text-align: center; }
        th { background-color: #f0f0f0; }
        .today { background-color: #ffeb3b; }
    </style>
</head>
<body>
    <h1>2024年日历</h1>
    {html_year}
</body>
</html>
    """)
print("HTML日历已保存到 calendar_2024.html")
```

### 日历格式化选项

| 参数 | 说明 | 默认值 |
|------|------|--------|
| firstweekday | 一周的第一天 (0=周一, 6=周日) | 0 |
| w | 日期列宽 | 2 |
| l | 每周行数 | 1 |
| c | 月份间距 | 6 |
| m | 每行月份数 | 3 |

## 💡 实际应用

### 基础用法

```python
def get_month_info(year, month):
    """获取指定月份的详细信息"""
    # 基本信息
    first_weekday, days_in_month = calendar.monthrange(year, month)
    month_name = calendar.month_name[month]
    
    # 计算工作日和周末天数
    workdays = 0
    weekends = 0
    
    for day in range(1, days_in_month + 1):
        weekday = calendar.weekday(year, month, day)
        if weekday < 5:  # 周一到周五
            workdays += 1
        else:  # 周六周日
            weekends += 1
    
    info = {
        '年份': year,
        '月份': f"{month}月 ({month_name})",
        '总天数': days_in_month,
        '工作日': workdays,
        '周末': weekends,
        '第一天星期': weekday_names[first_weekday],
        '是否闰年': '是' if calendar.isleap(year) else '否'
    }
    
    return info

# 使用示例
month_info = get_month_info(2024, 2)
print("月份信息:")
for key, value in month_info.items():
    print(f"{key}: {value}")
```

### 高级用法

```python
class CustomCalendar:
    """自定义日历类"""
    
    def __init__(self, locale='zh_CN'):
        self.locale = locale
        self.holidays = {}  # 存储节假日
        
        # 中文星期和月份名称
        self.cn_weekdays = ['一', '二', '三', '四', '五', '六', '日']
        self.cn_months = ['', '一月', '二月', '三月', '四月', '五月', '六月',
                         '七月', '八月', '九月', '十月', '十一月', '十二月']
    
    def add_holiday(self, year, month, day, name):
        """添加节假日"""
        date_key = f"{year}-{month:02d}-{day:02d}"
        self.holidays[date_key] = name
    
    def is_holiday(self, year, month, day):
        """检查是否为节假日"""
        date_key = f"{year}-{month:02d}-{day:02d}"
        return date_key in self.holidays
    
    def get_holiday_name(self, year, month, day):
        """获取节假日名称"""
        date_key = f"{year}-{month:02d}-{day:02d}"
        return self.holidays.get(date_key, '')
    
    def format_chinese_month(self, year, month):
        """生成中文格式的月历"""
        month_cal = calendar.monthcalendar(year, month)
        month_name = self.cn_months[month]
        
        result = f"\n{year}年{month_name}\n"
        result += "  " + "  ".join(self.cn_weekdays) + "\n"
        result += "-" * 20 + "\n"
        
        for week in month_cal:
            week_str = ""
            for day in week:
                if day == 0:
                    week_str += "  "
                else:
                    if self.is_holiday(year, month, day):
                        week_str += f"{day:2d}*"  # 节假日标记*
                    else:
                        week_str += f"{day:2d} "
                week_str += " "
            result += week_str + "\n"
        
        # 添加节假日说明
        holidays_in_month = []
        for day in range(1, calendar.monthrange(year, month)[1] + 1):
            if self.is_holiday(year, month, day):
                holiday_name = self.get_holiday_name(year, month, day)
                holidays_in_month.append(f"{day}日: {holiday_name}")
        
        if holidays_in_month:
            result += "\n节假日:\n"
            for holiday in holidays_in_month:
                result += f"  {holiday}\n"
        
        return result
    
    def get_year_statistics(self, year):
        """获取年度统计信息"""
        total_days = 366 if calendar.isleap(year) else 365
        total_workdays = 0
        total_weekends = 0
        total_holidays = 0
        
        for month in range(1, 13):
            days_in_month = calendar.monthrange(year, month)[1]
            for day in range(1, days_in_month + 1):
                weekday = calendar.weekday(year, month, day)
                
                if self.is_holiday(year, month, day):
                    total_holidays += 1
                elif weekday < 5:  # 周一到周五
                    total_workdays += 1
                else:  # 周六周日
                    total_weekends += 1
        
        return {
            '总天数': total_days,
            '工作日': total_workdays,
            '周末': total_weekends,
            '节假日': total_holidays,
            '是否闰年': calendar.isleap(year)
        }

# 使用示例
cal = CustomCalendar()

# 添加一些节假日
cal.add_holiday(2024, 1, 1, '元旦')
cal.add_holiday(2024, 2, 10, '春节')
cal.add_holiday(2024, 2, 11, '春节')
cal.add_holiday(2024, 2, 12, '春节')
cal.add_holiday(2024, 5, 1, '劳动节')
cal.add_holiday(2024, 10, 1, '国庆节')
cal.add_holiday(2024, 10, 2, '国庆节')
cal.add_holiday(2024, 10, 3, '国庆节')

# 显示中文月历
print(cal.format_chinese_month(2024, 1))
print(cal.format_chinese_month(2024, 10))

# 显示年度统计
stats = cal.get_year_statistics(2024)
print("2024年统计信息:")
for key, value in stats.items():
    print(f"{key}: {value}")
```

### 实际案例

```python
import calendar
import datetime

class WorkdayCalculator:
    """工作日计算器"""
    
    def __init__(self):
        self.holidays = set()  # 存储节假日
        self.workdays = set(range(5))  # 默认周一到周五为工作日
    
    def add_holiday(self, year, month, day):
        """添加节假日"""
        date = datetime.date(year, month, day)
        self.holidays.add(date)
    
    def remove_holiday(self, year, month, day):
        """移除节假日"""
        date = datetime.date(year, month, day)
        self.holidays.discard(date)
    
    def set_workdays(self, workdays):
        """设置工作日（0=周一, 6=周日）"""
        self.workdays = set(workdays)
    
    def is_workday(self, year, month, day):
        """判断是否为工作日"""
        date = datetime.date(year, month, day)
        
        # 如果是节假日，不是工作日
        if date in self.holidays:
            return False
        
        # 检查是否在工作日范围内
        weekday = calendar.weekday(year, month, day)
        return weekday in self.workdays
    
    def count_workdays(self, start_year, start_month, start_day, 
                      end_year, end_month, end_day):
        """计算两个日期之间的工作日数量"""
        start_date = datetime.date(start_year, start_month, start_day)
        end_date = datetime.date(end_year, end_month, end_day)
        
        if start_date > end_date:
            start_date, end_date = end_date, start_date
        
        workday_count = 0
        current_date = start_date
        
        while current_date <= end_date:
            if self.is_workday(current_date.year, current_date.month, current_date.day):
                workday_count += 1
            current_date += datetime.timedelta(days=1)
        
        return workday_count
    
    def get_month_workdays(self, year, month):
        """获取指定月份的工作日列表"""
        days_in_month = calendar.monthrange(year, month)[1]
        workdays = []
        
        for day in range(1, days_in_month + 1):
            if self.is_workday(year, month, day):
                weekday = calendar.weekday(year, month, day)
                workdays.append({
                    'date': f"{year}-{month:02d}-{day:02d}",
                    'day': day,
                    'weekday': weekday,
                    'weekday_name': weekday_names[weekday]
                })
        
        return workdays
    
    def generate_work_calendar(self, year, month):
        """生成工作日历"""
        month_cal = calendar.monthcalendar(year, month)
        month_name = calendar.month_name[month]
        
        result = f"\n{year}年{month}月工作日历\n"
        result += "周一 周二 周三 周四 周五 周六 周日\n"
        result += "-" * 28 + "\n"
        
        for week in month_cal:
            week_str = ""
            for day in week:
                if day == 0:
                    week_str += "   "
                else:
                    if self.is_workday(year, month, day):
                        week_str += f"{day:2d}W"  # W表示工作日
                    elif datetime.date(year, month, day) in self.holidays:
                        week_str += f"{day:2d}H"  # H表示节假日
                    else:
                        week_str += f"{day:2d} "  # 普通周末
                week_str += " "
            result += week_str + "\n"
        
        # 统计信息
        workdays = self.get_month_workdays(year, month)
        result += f"\n本月工作日: {len(workdays)}天\n"
        
        return result

# 使用示例
calc = WorkdayCalculator()

# 添加节假日
calc.add_holiday(2024, 1, 1)  # 元旦
calc.add_holiday(2024, 5, 1)  # 劳动节
calc.add_holiday(2024, 10, 1) # 国庆节

# 生成工作日历
print(calc.generate_work_calendar(2024, 1))
print(calc.generate_work_calendar(2024, 5))

# 计算工作日
workdays = calc.count_workdays(2024, 1, 1, 2024, 1, 31)
print(f"2024年1月工作日总数: {workdays}天")

# 获取月份工作日详情
january_workdays = calc.get_month_workdays(2024, 1)
print(f"\n2024年1月工作日详情 (共{len(january_workdays)}天):")
for workday in january_workdays[:5]:  # 只显示前5个
    print(f"  {workday['date']} ({workday['weekday_name']})")
if len(january_workdays) > 5:
    print(f"  ... 还有{len(january_workdays) - 5}个工作日")
```

## ⚠️ 注意事项

- **日历系统**: calendar模块使用理想化的公历，不考虑历史上的日历改革
- **星期编号**: Python中周一为0，周日为6，与某些系统不同
- **时区**: calendar模块不处理时区，只处理日期
- **本地化**: 月份和星期名称默认为英文，需要自定义中文显示
- **性能**: 对于大量日期计算，考虑使用datetime模块
- **闰秒**: calendar模块不考虑闰秒

## 🔗 相关内容

- [datetime模块](datetime/) - 更强大的日期时间处理
- [time模块](time/) - 时间相关的基础功能
- [内置函数](../builtins/) - 了解相关的内置函数

## 📚 扩展阅读

- [Python calendar模块官方文档](https://docs.python.org/3/library/calendar.html)
- [公历系统详解](https://en.wikipedia.org/wiki/Gregorian_calendar)
- [ISO 8601日期标准](https://en.wikipedia.org/wiki/ISO_8601)

## 🏷️ 标签

`日历` `月历` `年历` `工作日` `节假日` `标准库`

---

**最后更新**: 2024-01-01  
**作者**: Python文档团队  
**版本**: 1.0