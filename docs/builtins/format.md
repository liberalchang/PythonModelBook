# format() - 格式化函数

## 📖 概述

`format()` 是Python的内置函数，用于格式化值并返回格式化后的字符串。它提供了灵活的字符串格式化功能，支持多种格式规范和自定义格式化行为。

## 🎯 学习目标

通过本文档，你将学会：
- 掌握 `format()` 函数的基本语法和用法
- 理解各种格式规范符的含义和应用
- 学会自定义对象的格式化行为
- 掌握高级格式化技巧和最佳实践
- 了解 `format()` 与 f-string 的区别和选择

## 📋 前置知识

- Python基础语法
- 字符串操作
- 基本的面向对象概念
- 魔术方法的理解

## 📚 详细内容

### 基本概念

`format()` 函数将值转换为格式化的字符串表示。它可以接受一个格式规范字符串，用于控制输出的格式。

### 语法

```python
format(value, format_spec='')
```

### 参数

- **value**: 要格式化的值
- **format_spec** (可选): 格式规范字符串，默认为空字符串

### 返回值

返回格式化后的字符串。

## 💡 代码示例

### 基本用法

```python
# 基本格式化示例
print("基本format()用法:")

# 1. 无格式规范
print("1. 无格式规范:")
print(f"format(42): '{format(42)}'")
print(f"format(3.14159): '{format(3.14159)}'")
print(f"format('hello'): '{format('hello')}'")
print(f"format(True): '{format(True)}'")

# 2. 基本数字格式化
print("\n2. 基本数字格式化:")
number = 1234.5678

# 小数位数控制
print(f"format({number}, '.2f'): '{format(number, '.2f')}'")
print(f"format({number}, '.4f'): '{format(number, '.4f')}'")
print(f"format({number}, '.0f'): '{format(number, '.0f')}'")

# 整数格式化
integer = 42
print(f"format({integer}, 'd'): '{format(integer, 'd')}'")
print(f"format({integer}, '05d'): '{format(integer, '05d')}'")
print(f"format({integer}, '+d'): '{format(integer, '+d')}'")

# 3. 字符串格式化
print("\n3. 字符串格式化:")
text = "Python"
print(f"format('{text}', '10s'): '{format(text, '10s')}'")
print(f"format('{text}', '<10s'): '{format(text, '<10s')}'")
print(f"format('{text}', '>10s'): '{format(text, '>10s')}'")
print(f"format('{text}', '^10s'): '{format(text, '^10s')}'")

# 4. 进制转换
print("\n4. 进制转换:")
num = 255
print(f"format({num}, 'b'): '{format(num, 'b')}'")  # 二进制
print(f"format({num}, 'o'): '{format(num, 'o')}'")  # 八进制
print(f"format({num}, 'x'): '{format(num, 'x')}'")  # 十六进制(小写)
print(f"format({num}, 'X'): '{format(num, 'X')}'")  # 十六进制(大写)

# 5. 科学计数法
print("\n5. 科学计数法:")
large_num = 1234567.89
print(f"format({large_num}, 'e'): '{format(large_num, 'e')}'")
print(f"format({large_num}, 'E'): '{format(large_num, 'E')}'")
print(f"format({large_num}, '.2e'): '{format(large_num, '.2e')}'")

# 6. 百分比格式
print("\n6. 百分比格式:")
ratio = 0.1234
print(f"format({ratio}, '%'): '{format(ratio, '%')}'")
print(f"format({ratio}, '.2%'): '{format(ratio, '.2%')}'")
print(f"format({ratio}, '.1%'): '{format(ratio, '.1%')}'")
```

### 高级格式化

```python
# 高级格式化示例
print("\n" + "="*50)
print("高级format()用法:")

# 1. 千位分隔符
print("\n1. 千位分隔符:")
big_number = 1234567890
print(f"format({big_number}, ','): '{format(big_number, ',')}'")
print(f"format({big_number}, '_'): '{format(big_number, '_')}'")
print(f"format({big_number}, ',.2f'): '{format(big_number, ',.2f')}'")

# 2. 符号控制
print("\n2. 符号控制:")
positive = 42
negative = -42
zero = 0

print(f"format({positive}, '+d'): '{format(positive, '+d')}'")
print(f"format({negative}, '+d'): '{format(negative, '+d')}'")
print(f"format({zero}, '+d'): '{format(zero, '+d')}'")
print(f"format({positive}, ' d'): '{format(positive, ' d')}'")
print(f"format({negative}, ' d'): '{format(negative, ' d')}'")

# 3. 填充和对齐
print("\n3. 填充和对齐:")
value = "test"
print(f"format('{value}', '*<10'): '{format(value, '*<10')}'")
print(f"format('{value}', '*>10'): '{format(value, '*>10')}'")
print(f"format('{value}', '*^10'): '{format(value, '*^10')}'")
print(f"format('{value}', '=^10'): '{format(value, '=^10')}'")

# 数字的填充
num = 42
print(f"format({num}, '0>8d'): '{format(num, '0>8d')}'")
print(f"format({num}, '*^8d'): '{format(num, '*^8d')}'")

# 4. 复杂格式组合
print("\n4. 复杂格式组合:")
value = 1234.5678
print(f"format({value}, '+020,.2f'): '{format(value, '+020,.2f')}'")
print(f"format({value}, ' =+20,.3f'): '{format(value, ' =+20,.3f')}'")

# 5. 动态格式规范
print("\n5. 动态格式规范:")

def dynamic_format(value, width=10, precision=2, align='>'):
    """
    动态生成格式规范。
    
    参数:
        value: 要格式化的值
        width (int): 字段宽度
        precision (int): 精度
        align (str): 对齐方式
    
    返回:
        str: 格式化后的字符串
    """
    if isinstance(value, (int, float)):
        format_spec = f'{align}{width},.{precision}f'
    else:
        format_spec = f'{align}{width}s'
    
    return format(value, format_spec)

# 测试动态格式化
test_values = [123.456, 9876.54321, "Hello", 42]
for val in test_values:
    result = dynamic_format(val)
    print(f"dynamic_format({val}): '{result}'")

# 6. 格式化表格
print("\n6. 格式化表格:")

class TableFormatter:
    """
    表格格式化器。
    
    用于创建格式化的表格输出。
    """
    
    def __init__(self, headers, widths=None, aligns=None):
        """
        初始化表格格式化器。
        
        参数:
            headers (list): 表头列表
            widths (list, optional): 列宽列表
            aligns (list, optional): 对齐方式列表
        """
        self.headers = headers
        self.widths = widths or [10] * len(headers)
        self.aligns = aligns or ['<'] * len(headers)
    
    def format_row(self, row):
        """
        格式化一行数据。
        
        参数:
            row (list): 行数据
        
        返回:
            str: 格式化后的行字符串
        """
        formatted_cells = []
        for i, (cell, width, align) in enumerate(zip(row, self.widths, self.aligns)):
            if isinstance(cell, (int, float)):
                if isinstance(cell, float):
                    format_spec = f'{align}{width},.2f'
                else:
                    format_spec = f'{align}{width},d'
            else:
                format_spec = f'{align}{width}s'
            
            formatted_cells.append(format(cell, format_spec))
        
        return '|'.join(formatted_cells)
    
    def format_separator(self, char='-'):
        """
        生成分隔线。
        
        参数:
            char (str): 分隔字符
        
        返回:
            str: 分隔线字符串
        """
        return '+'.join(char * width for width in self.widths)
    
    def format_table(self, data):
        """
        格式化完整表格。
        
        参数:
            data (list): 表格数据
        
        返回:
            str: 格式化后的表格字符串
        """
        lines = []
        
        # 表头
        lines.append(self.format_row(self.headers))
        lines.append(self.format_separator())
        
        # 数据行
        for row in data:
            lines.append(self.format_row(row))
        
        return '\n'.join(lines)

# 测试表格格式化
headers = ['姓名', '年龄', '薪资', '部门']
widths = [8, 6, 12, 10]
aligns = ['<', '>', '>', '<']

formatter = TableFormatter(headers, widths, aligns)

data = [
    ['张三', 25, 8500.50, '开发部'],
    ['李四', 30, 12000.00, '产品部'],
    ['王五', 28, 9500.75, '设计部'],
    ['赵六', 35, 15000.00, '管理部']
]

print("\n格式化表格:")
print(formatter.format_table(data))
```

### 自定义格式化

```python
# 自定义格式化示例
print("\n" + "="*50)
print("自定义format()行为:")

# 1. 实现__format__方法
print("\n1. 自定义类的格式化:")

class Person:
    """
    人员类，演示自定义格式化。
    """
    
    def __init__(self, name, age, salary):
        """
        初始化人员对象。
        
        参数:
            name (str): 姓名
            age (int): 年龄
            salary (float): 薪资
        """
        self.name = name
        self.age = age
        self.salary = salary
    
    def __format__(self, format_spec):
        """
        自定义格式化方法。
        
        参数:
            format_spec (str): 格式规范
        
        返回:
            str: 格式化后的字符串
        """
        if format_spec == 'short':
            return f"{self.name}({self.age})"
        elif format_spec == 'full':
            return f"{self.name}, {self.age}岁, 薪资{self.salary:,.2f}元"
        elif format_spec == 'name':
            return self.name
        elif format_spec == 'age':
            return str(self.age)
        elif format_spec == 'salary':
            return f"{self.salary:,.2f}"
        elif format_spec.startswith('salary:'):
            # 自定义薪资格式
            precision = format_spec.split(':')[1] if ':' in format_spec else '2'
            return f"{self.salary:,.{precision}f}元"
        else:
            # 默认格式
            return f"{self.name}({self.age}, {self.salary:,.0f})"
    
    def __str__(self):
        return f"Person(name='{self.name}', age={self.age}, salary={self.salary})"
    
    def __repr__(self):
        return f"Person('{self.name}', {self.age}, {self.salary})"

# 测试自定义格式化
person = Person("张三", 25, 8500.50)

print(f"format(person): '{format(person)}'")
print(f"format(person, 'short'): '{format(person, 'short')}'")
print(f"format(person, 'full'): '{format(person, 'full')}'")
print(f"format(person, 'name'): '{format(person, 'name')}'")
print(f"format(person, 'age'): '{format(person, 'age')}'")
print(f"format(person, 'salary'): '{format(person, 'salary')}'")
print(f"format(person, 'salary:0'): '{format(person, 'salary:0')}'")
print(f"format(person, 'salary:3'): '{format(person, 'salary:3')}'")

# 2. 复杂的自定义格式化
print("\n2. 复杂的自定义格式化:")

class Money:
    """
    货币类，演示复杂的格式化规则。
    """
    
    def __init__(self, amount, currency='CNY'):
        """
        初始化货币对象。
        
        参数:
            amount (float): 金额
            currency (str): 货币代码
        """
        self.amount = amount
        self.currency = currency
    
    def __format__(self, format_spec):
        """
        自定义货币格式化。
        
        支持的格式:
        - 'symbol': 显示货币符号
        - 'code': 显示货币代码
        - 'full': 完整格式
        - 'compact': 紧凑格式
        - 数字格式规范: 如'.2f', ',.0f'等
        
        参数:
            format_spec (str): 格式规范
        
        返回:
            str: 格式化后的字符串
        """
        # 货币符号映射
        symbols = {
            'CNY': '¥',
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥'
        }
        
        if format_spec == 'symbol':
            symbol = symbols.get(self.currency, self.currency)
            return f"{symbol}{self.amount:,.2f}"
        elif format_spec == 'code':
            return f"{self.amount:,.2f} {self.currency}"
        elif format_spec == 'full':
            symbol = symbols.get(self.currency, self.currency)
            return f"{symbol}{self.amount:,.2f} {self.currency}"
        elif format_spec == 'compact':
            # 紧凑格式，大数字使用K、M等单位
            if abs(self.amount) >= 1_000_000:
                value = self.amount / 1_000_000
                unit = 'M'
            elif abs(self.amount) >= 1_000:
                value = self.amount / 1_000
                unit = 'K'
            else:
                value = self.amount
                unit = ''
            
            symbol = symbols.get(self.currency, self.currency)
            return f"{symbol}{value:.1f}{unit}"
        elif format_spec.replace('.', '').replace('f', '').replace(',', '').replace('+', '').replace('-', '').replace(' ', '').isdigit() or format_spec in ['f', '.f', ',f']:
            # 数字格式规范
            formatted_amount = format(self.amount, format_spec)
            symbol = symbols.get(self.currency, self.currency)
            return f"{symbol}{formatted_amount}"
        else:
            # 默认格式
            return f"{self.amount:.2f} {self.currency}"

# 测试货币格式化
money_cny = Money(12345.67, 'CNY')
money_usd = Money(9876.54, 'USD')
money_large = Money(1234567.89, 'USD')

print(f"format(money_cny): '{format(money_cny)}'")
print(f"format(money_cny, 'symbol'): '{format(money_cny, 'symbol')}'")
print(f"format(money_cny, 'code'): '{format(money_cny, 'code')}'")
print(f"format(money_cny, 'full'): '{format(money_cny, 'full')}'")
print(f"format(money_cny, 'compact'): '{format(money_cny, 'compact')}'")
print(f"format(money_cny, ',.0f'): '{format(money_cny, ',.0f')}'")
print(f"format(money_large, 'compact'): '{format(money_large, 'compact')}'")

# 3. 日期时间格式化
print("\n3. 日期时间格式化:")

from datetime import datetime, date, time

class SmartDateTime:
    """
    智能日期时间类，支持多种格式化选项。
    """
    
    def __init__(self, dt=None):
        """
        初始化日期时间对象。
        
        参数:
            dt (datetime, optional): 日期时间对象，默认为当前时间
        """
        self.dt = dt or datetime.now()
    
    def __format__(self, format_spec):
        """
        自定义日期时间格式化。
        
        参数:
            format_spec (str): 格式规范
        
        返回:
            str: 格式化后的字符串
        """
        if format_spec == 'date':
            return self.dt.strftime('%Y-%m-%d')
        elif format_spec == 'time':
            return self.dt.strftime('%H:%M:%S')
        elif format_spec == 'datetime':
            return self.dt.strftime('%Y-%m-%d %H:%M:%S')
        elif format_spec == 'iso':
            return self.dt.isoformat()
        elif format_spec == 'chinese':
            return self.dt.strftime('%Y年%m月%d日 %H时%M分%S秒')
        elif format_spec == 'relative':
            # 相对时间（简化版）
            now = datetime.now()
            diff = now - self.dt
            
            if diff.days > 0:
                return f"{diff.days}天前"
            elif diff.seconds > 3600:
                hours = diff.seconds // 3600
                return f"{hours}小时前"
            elif diff.seconds > 60:
                minutes = diff.seconds // 60
                return f"{minutes}分钟前"
            else:
                return "刚刚"
        elif format_spec.startswith('%'):
            # 标准strftime格式
            return self.dt.strftime(format_spec)
        else:
            # 默认格式
            return str(self.dt)

# 测试日期时间格式化
from datetime import timedelta

smart_dt = SmartDateTime()
old_dt = SmartDateTime(datetime.now() - timedelta(hours=2, minutes=30))

print(f"format(smart_dt, 'date'): '{format(smart_dt, 'date')}'")
print(f"format(smart_dt, 'time'): '{format(smart_dt, 'time')}'")
print(f"format(smart_dt, 'datetime'): '{format(smart_dt, 'datetime')}'")
print(f"format(smart_dt, 'chinese'): '{format(smart_dt, 'chinese')}'")
print(f"format(smart_dt, 'iso'): '{format(smart_dt, 'iso')}'")
print(f"format(old_dt, 'relative'): '{format(old_dt, 'relative')}'")
print(f"format(smart_dt, '%A, %B %d, %Y'): '{format(smart_dt, '%A, %B %d, %Y')}'")
```

### 格式化工具类

```python
# 格式化工具类
print("\n" + "="*50)
print("格式化工具类:")

class FormatHelper:
    """
    格式化助手类。
    
    提供各种常用的格式化功能。
    """
    
    @staticmethod
    def format_number(value, style='default', precision=2, thousands_sep=True):
        """
        格式化数字。
        
        参数:
            value (float): 要格式化的数字
            style (str): 格式化样式
            precision (int): 小数位数
            thousands_sep (bool): 是否使用千位分隔符
        
        返回:
            str: 格式化后的字符串
        """
        if style == 'currency':
            sep = ',' if thousands_sep else ''
            return format(value, f'{sep}.{precision}f')
        elif style == 'percent':
            return format(value, f'.{precision}%')
        elif style == 'scientific':
            return format(value, f'.{precision}e')
        elif style == 'compact':
            if abs(value) >= 1_000_000_000:
                return f"{value/1_000_000_000:.{precision}f}B"
            elif abs(value) >= 1_000_000:
                return f"{value/1_000_000:.{precision}f}M"
            elif abs(value) >= 1_000:
                return f"{value/1_000:.{precision}f}K"
            else:
                return f"{value:.{precision}f}"
        else:  # default
            sep = ',' if thousands_sep else ''
            return format(value, f'{sep}.{precision}f')
    
    @staticmethod
    def format_bytes(bytes_value, binary=True):
        """
        格式化字节数。
        
        参数:
            bytes_value (int): 字节数
            binary (bool): 是否使用二进制单位(1024)，否则使用十进制单位(1000)
        
        返回:
            str: 格式化后的字符串
        """
        if binary:
            units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
            base = 1024
        else:
            units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
            base = 1000
        
        if bytes_value == 0:
            return "0 B"
        
        for i, unit in enumerate(units):
            if bytes_value < base ** (i + 1) or i == len(units) - 1:
                value = bytes_value / (base ** i)
                if value >= 100:
                    return f"{value:.0f} {unit}"
                elif value >= 10:
                    return f"{value:.1f} {unit}"
                else:
                    return f"{value:.2f} {unit}"
    
    @staticmethod
    def format_duration(seconds):
        """
        格式化时间长度。
        
        参数:
            seconds (float): 秒数
        
        返回:
            str: 格式化后的时间字符串
        """
        if seconds < 60:
            return f"{seconds:.1f}秒"
        elif seconds < 3600:
            minutes = seconds / 60
            return f"{minutes:.1f}分钟"
        elif seconds < 86400:
            hours = seconds / 3600
            return f"{hours:.1f}小时"
        else:
            days = seconds / 86400
            return f"{days:.1f}天"
    
    @staticmethod
    def format_list(items, style='comma', max_items=None):
        """
        格式化列表。
        
        参数:
            items (list): 要格式化的列表
            style (str): 格式化样式
            max_items (int, optional): 最大显示项目数
        
        返回:
            str: 格式化后的字符串
        """
        if max_items and len(items) > max_items:
            display_items = items[:max_items]
            suffix = f" 等{len(items)}项"
        else:
            display_items = items
            suffix = ""
        
        if style == 'comma':
            return ', '.join(str(item) for item in display_items) + suffix
        elif style == 'and':
            if len(display_items) <= 1:
                return str(display_items[0]) if display_items else ""
            elif len(display_items) == 2:
                return f"{display_items[0]} 和 {display_items[1]}{suffix}"
            else:
                return ', '.join(str(item) for item in display_items[:-1]) + f" 和 {display_items[-1]}{suffix}"
        elif style == 'bullet':
            return '\n'.join(f"• {item}" for item in display_items) + (f"\n• ...还有{len(items) - max_items}项" if suffix else "")
        elif style == 'numbered':
            return '\n'.join(f"{i+1}. {item}" for i, item in enumerate(display_items)) + (f"\n{max_items+1}. ...还有{len(items) - max_items}项" if suffix else "")
        else:
            return str(display_items) + suffix
    
    @staticmethod
    def format_dict(data, style='json', indent=2):
        """
        格式化字典。
        
        参数:
            data (dict): 要格式化的字典
            style (str): 格式化样式
            indent (int): 缩进级别
        
        返回:
            str: 格式化后的字符串
        """
        if style == 'json':
            import json
            return json.dumps(data, ensure_ascii=False, indent=indent)
        elif style == 'table':
            lines = []
            max_key_len = max(len(str(k)) for k in data.keys()) if data else 0
            for key, value in data.items():
                key_str = format(str(key), f'<{max_key_len}s')
                lines.append(f"{key_str} : {value}")
            return '\n'.join(lines)
        elif style == 'compact':
            return ', '.join(f"{k}={v}" for k, v in data.items())
        else:
            return str(data)

# 测试格式化工具类
print("\n1. 数字格式化:")
test_number = 1234567.89
print(f"默认: {FormatHelper.format_number(test_number)}")
print(f"货币: {FormatHelper.format_number(test_number, 'currency')}")
print(f"百分比: {FormatHelper.format_number(0.1234, 'percent')}")
print(f"科学计数法: {FormatHelper.format_number(test_number, 'scientific')}")
print(f"紧凑格式: {FormatHelper.format_number(test_number, 'compact')}")

print("\n2. 字节格式化:")
bytes_values = [512, 1536, 1048576, 1073741824, 1099511627776]
for bv in bytes_values:
    print(f"{bv} bytes -> 二进制: {FormatHelper.format_bytes(bv, True)}, 十进制: {FormatHelper.format_bytes(bv, False)}")

print("\n3. 时间长度格式化:")
durations = [30, 90, 3600, 7200, 86400, 172800]
for duration in durations:
    print(f"{duration}秒 -> {FormatHelper.format_duration(duration)}")

print("\n4. 列表格式化:")
test_list = ['苹果', '香蕉', '橙子', '葡萄', '草莓']
print(f"逗号分隔: {FormatHelper.format_list(test_list, 'comma')}")
print(f"和连接: {FormatHelper.format_list(test_list, 'and')}")
print(f"项目符号:\n{FormatHelper.format_list(test_list, 'bullet')}")
print(f"编号列表:\n{FormatHelper.format_list(test_list, 'numbered')}")
print(f"限制3项: {FormatHelper.format_list(test_list, 'comma', 3)}")

print("\n5. 字典格式化:")
test_dict = {'姓名': '张三', '年龄': 25, '城市': '北京', '职业': '程序员'}
print(f"表格格式:\n{FormatHelper.format_dict(test_dict, 'table')}")
print(f"紧凑格式: {FormatHelper.format_dict(test_dict, 'compact')}")
```

## ⚠️ 常见陷阱与最佳实践

### format()使用注意事项

```python
# format()使用注意事项
print("\nformat()使用注意事项:")

# 1. 格式规范错误
print("1. 格式规范错误:")

try:
    # 错误的格式规范
    result = format(123, 'invalid_format')
except ValueError as e:
    print(f"格式规范错误: {e}")

try:
    # 类型不匹配的格式规范
    result = format("hello", '.2f')
except ValueError as e:
    print(f"类型不匹配: {e}")

# 2. 精度和性能考虑
print("\n2. 精度和性能考虑:")

import time

def performance_comparison():
    """
    比较不同格式化方法的性能。
    """
    value = 1234.5678
    iterations = 100000
    
    # format()函数
    start = time.time()
    for _ in range(iterations):
        result = format(value, '.2f')
    format_time = time.time() - start
    
    # f-string
    start = time.time()
    for _ in range(iterations):
        result = f"{value:.2f}"
    fstring_time = time.time() - start
    
    # str.format()
    start = time.time()
    for _ in range(iterations):
        result = "{:.2f}".format(value)
    str_format_time = time.time() - start
    
    # % 格式化
    start = time.time()
    for _ in range(iterations):
        result = "%.2f" % value
    percent_time = time.time() - start
    
    print(f"  format()函数: {format_time:.4f}秒")
    print(f"  f-string: {fstring_time:.4f}秒")
    print(f"  str.format(): {str_format_time:.4f}秒")
    print(f"  % 格式化: {percent_time:.4f}秒")
    
    # 性能排序
    methods = [
        ('format()函数', format_time),
        ('f-string', fstring_time),
        ('str.format()', str_format_time),
        ('% 格式化', percent_time)
    ]
    methods.sort(key=lambda x: x[1])
    
    print(f"\n  性能排序（从快到慢）:")
    for i, (method, time_taken) in enumerate(methods, 1):
        print(f"    {i}. {method}: {time_taken:.4f}秒")

performance_comparison()

# 3. 浮点数精度问题
print("\n3. 浮点数精度问题:")

value = 0.1 + 0.2
print(f"0.1 + 0.2 = {value}")
print(f"format(0.1 + 0.2, '.1f') = {format(value, '.1f')}")
print(f"format(0.1 + 0.2, '.17f') = {format(value, '.17f')}")

# 使用Decimal避免精度问题
from decimal import Decimal, getcontext

getcontext().prec = 28  # 设置精度
decimal_value = Decimal('0.1') + Decimal('0.2')
print(f"Decimal('0.1') + Decimal('0.2') = {decimal_value}")
print(f"format(decimal_value, '.1f') = {format(decimal_value, '.1f')}")

# 4. 国际化和本地化
print("\n4. 国际化和本地化:")

import locale

# 注意：在某些系统上可能需要安装相应的locale
try:
    # 设置中文locale
    locale.setlocale(locale.LC_ALL, 'zh_CN.UTF-8')
except locale.Error:
    try:
        # Windows中文locale
        locale.setlocale(locale.LC_ALL, 'Chinese_China.936')
    except locale.Error:
        print("  无法设置中文locale，使用默认设置")

# 使用locale格式化数字
value = 1234567.89
print(f"  默认格式: {format(value, ',.2f')}")

try:
    # 使用locale格式化（如果支持）
    formatted = locale.format_string('%.2f', value, grouping=True)
    print(f"  locale格式: {formatted}")
except:
    print("  locale格式化不可用")

# 5. 最佳实践总结
print("\n5. format()最佳实践:")

class FormatBestPractices:
    """
    format()最佳实践示例。
    """
    
    @staticmethod
    def safe_format(value, format_spec, default="N/A"):
        """
        安全的格式化函数。
        
        参数:
            value: 要格式化的值
            format_spec (str): 格式规范
            default (str): 默认值
        
        返回:
            str: 格式化后的字符串或默认值
        """
        try:
            return format(value, format_spec)
        except (ValueError, TypeError) as e:
            print(f"    格式化错误: {e}，使用默认值: {default}")
            return default
    
    @staticmethod
    def smart_number_format(value, auto_precision=True):
        """
        智能数字格式化。
        
        参数:
            value: 数字值
            auto_precision (bool): 是否自动调整精度
        
        返回:
            str: 格式化后的字符串
        """
        if not isinstance(value, (int, float)):
            return str(value)
        
        # 整数不显示小数点
        if isinstance(value, int) or value.is_integer():
            return format(int(value), ',')
        
        # 自动调整精度
        if auto_precision:
            if abs(value) >= 1000:
                precision = 0
            elif abs(value) >= 1:
                precision = 2
            else:
                precision = 4
        else:
            precision = 2
        
        return format(value, f',.{precision}f')
    
    @staticmethod
    def conditional_format(value, conditions):
        """
        条件格式化。
        
        参数:
            value: 要格式化的值
            conditions (list): 条件列表，每个条件是(condition_func, format_spec)元组
        
        返回:
            str: 格式化后的字符串
        """
        for condition_func, format_spec in conditions:
            if condition_func(value):
                return format(value, format_spec)
        
        # 默认格式
        return str(value)
    
    @staticmethod
    def format_with_units(value, unit, format_spec='.2f'):
        """
        带单位的格式化。
        
        参数:
            value: 数值
            unit (str): 单位
            format_spec (str): 格式规范
        
        返回:
            str: 格式化后的字符串
        """
        formatted_value = format(value, format_spec)
        return f"{formatted_value} {unit}"

# 测试最佳实践
print("\n测试format()最佳实践:")

# 安全格式化
print("\n1. 安全格式化:")
test_values = [123.456, "hello", None, [1, 2, 3]]
for val in test_values:
    result = FormatBestPractices.safe_format(val, '.2f')
    print(f"  safe_format({val}, '.2f'): {result}")

# 智能数字格式化
print("\n2. 智能数字格式化:")
numbers = [1234567, 123.456, 1.23456, 0.001234]
for num in numbers:
    result = FormatBestPractices.smart_number_format(num)
    print(f"  smart_number_format({num}): {result}")

# 条件格式化
print("\n3. 条件格式化:")
conditions = [
    (lambda x: x < 0, '+.2f'),  # 负数显示符号
    (lambda x: x > 1000, ',.0f'),  # 大数不显示小数
    (lambda x: x < 1, '.4f'),  # 小数显示更多位
]

test_numbers = [-123.45, 1234.56, 0.001234, 42.0]
for num in test_numbers:
    result = FormatBestPractices.conditional_format(num, conditions)
    print(f"  conditional_format({num}): {result}")

# 带单位格式化
print("\n4. 带单位格式化:")
measurements = [
    (25.6, '°C'),
    (1024, 'MB'),
    (3.14159, 'π'),
    (9.8, 'm/s²')
]

for value, unit in measurements:
    result = FormatBestPractices.format_with_units(value, unit)
    print(f"  format_with_units({value}, '{unit}'): {result}")
```

## 🔗 相关函数和模块

### 内置函数
- `str()` - 将对象转换为字符串
- `repr()` - 返回对象的字符串表示
- `print()` - 打印输出
- `type()` - 获取对象类型
- `isinstance()` - 检查对象类型

### 标准库模块
- `string` - 字符串常量和模板
- `locale` - 国际化服务
- `decimal` - 十进制浮点运算
- `datetime` - 日期和时间处理
- `json` - JSON编码和解码

### 第三方库
- `babel` - 国际化工具
- `humanize` - 人性化格式化
- `tabulate` - 表格格式化
- `rich` - 富文本和美观的终端输出

## 📚 扩展阅读

- [Python字符串格式化](https://docs.python.org/3/library/string.html#format-string-syntax)
- [内置函数文档](https://docs.python.org/3/library/functions.html#format)
- [格式规范迷你语言](https://docs.python.org/3/library/string.html#format-specification-mini-language)
- [PEP 3101 - 高级字符串格式化](https://www.python.org/dev/peps/pep-3101/)

## 🏷️ 标签

`字符串格式化` `format函数` `格式规范` `数字格式化` `自定义格式化` `文本处理` `数据展示` `国际化`