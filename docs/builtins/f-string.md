# f-string - 格式化字符串字面量

## 📖 概述

f-string（格式化字符串字面量）是Python 3.6引入的字符串格式化语法，提供了一种简洁、高效且易读的字符串格式化方式。f-string使用花括号 `{}` 来嵌入表达式，并在运行时计算这些表达式的值。

## 🎯 学习目标

通过本文档，你将学会：
- 掌握 f-string 的基本语法和用法
- 理解 f-string 的格式化规范
- 学会在 f-string 中使用表达式和函数调用
- 掌握高级格式化技巧和最佳实践
- 了解 f-string 与其他格式化方法的区别

## 📋 前置知识

- Python基础语法
- 字符串操作
- 变量和表达式
- 基本的面向对象概念

## 📚 详细内容

### 基本概念

f-string是以字母 `f` 或 `F` 为前缀的字符串字面量，其中可以包含用花括号包围的表达式。这些表达式在运行时被计算并格式化为字符串。

### 语法

```python
f"文本 {表达式} 更多文本"
F"文本 {表达式:格式规范} 更多文本"
```

### 基本特性

- **表达式求值**: 花括号内可以是任何有效的Python表达式
- **格式化规范**: 支持与 `format()` 函数相同的格式化规范
- **性能优化**: 比其他字符串格式化方法更快
- **可读性强**: 代码更简洁易懂

## 💡 代码示例

### 基本用法

```python
# f-string基本用法示例
print("f-string基本用法:")

# 1. 变量插值
name = "张三"
age = 25
print(f"我的名字是{name}，今年{age}岁。")

# 2. 表达式计算
width = 10
height = 5
print(f"矩形的面积是{width * height}平方米。")

# 3. 函数调用
import math
radius = 3
print(f"圆的面积是{math.pi * radius ** 2:.2f}平方米。")

# 4. 方法调用
text = "hello world"
print(f"大写: {text.upper()}")
print(f"标题格式: {text.title()}")
print(f"长度: {len(text)}")

# 5. 字典和列表访问
person = {'name': '李四', 'age': 30, 'city': '北京'}
scores = [85, 92, 78, 96]

print(f"姓名: {person['name']}")
print(f"年龄: {person['age']}")
print(f"第一个分数: {scores[0]}")
print(f"最高分: {max(scores)}")

# 6. 对象属性访问
class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade
    
    def get_status(self):
        return "优秀" if self.grade >= 90 else "良好" if self.grade >= 80 else "一般"

student = Student("王五", 88)
print(f"学生: {student.name}, 成绩: {student.grade}, 评价: {student.get_status()}")

# 7. 条件表达式
score = 85
print(f"成绩评级: {('优秀' if score >= 90 else '良好' if score >= 80 else '一般')}")

# 8. 列表推导式
numbers = [1, 2, 3, 4, 5]
print(f"平方数: {[x**2 for x in numbers]}")
print(f"偶数: {[x for x in numbers if x % 2 == 0]}")
```

### 格式化规范

```python
# f-string格式化规范示例
print("\n" + "="*50)
print("f-string格式化规范:")

# 1. 数字格式化
print("\n1. 数字格式化:")
number = 1234.5678

# 小数位数
print(f"两位小数: {number:.2f}")
print(f"四位小数: {number:.4f}")
print(f"无小数: {number:.0f}")

# 千位分隔符
print(f"千位分隔符: {number:,.2f}")
print(f"下划线分隔: {number:_.2f}")

# 符号控制
positive = 42
negative = -42
zero = 0

print(f"正数带符号: {positive:+d}")
print(f"负数带符号: {negative:+d}")
print(f"零带符号: {zero:+d}")
print(f"正数空格: {positive: d}")
print(f"负数空格: {negative: d}")

# 2. 字符串格式化
print("\n2. 字符串格式化:")
text = "Python"

# 宽度和对齐
print(f"左对齐: '{text:<10}'")
print(f"右对齐: '{text:>10}'")
print(f"居中: '{text:^10}'")

# 填充字符
print(f"星号填充: '{text:*^10}'")
print(f"等号填充: '{text:=^10}'")
print(f"零填充: '{text:0>10}'")

# 截断
long_text = "这是一个很长的字符串"
print(f"截断到10字符: '{long_text[:10]}'")
print(f"截断并添加省略号: '{long_text[:10]}...' if len(long_text) > 10 else long_text")

# 3. 进制转换
print("\n3. 进制转换:")
num = 255

print(f"二进制: {num:b}")
print(f"八进制: {num:o}")
print(f"十六进制(小写): {num:x}")
print(f"十六进制(大写): {num:X}")
print(f"带前缀的十六进制: {num:#x}")
print(f"带前缀的二进制: {num:#b}")

# 4. 科学计数法
print("\n4. 科学计数法:")
large_num = 1234567.89
small_num = 0.000123456

print(f"科学计数法(小写): {large_num:e}")
print(f"科学计数法(大写): {large_num:E}")
print(f"两位精度: {large_num:.2e}")
print(f"小数科学计数法: {small_num:.3e}")

# 5. 百分比格式
print("\n5. 百分比格式:")
ratio = 0.1234
print(f"百分比: {ratio:%}")
print(f"两位小数百分比: {ratio:.2%}")
print(f"一位小数百分比: {ratio:.1%}")

# 6. 日期时间格式化
print("\n6. 日期时间格式化:")
from datetime import datetime, date

now = datetime.now()
today = date.today()

print(f"当前时间: {now}")
print(f"格式化时间: {now:%Y-%m-%d %H:%M:%S}")
print(f"中文格式: {now:%Y年%m月%d日 %H时%M分}")
print(f"今天日期: {today:%Y-%m-%d}")
print(f"星期几: {now:%A}")
print(f"月份名: {now:%B}")
```

### 高级用法

```python
# f-string高级用法示例
print("\n" + "="*50)
print("f-string高级用法:")

# 1. 嵌套花括号
print("\n1. 嵌套花括号:")

# 动态格式规范
value = 123.456
precision = 2
width = 10

print(f"动态精度: {value:.{precision}f}")
print(f"动态宽度: {value:{width}.{precision}f}")
print(f"动态对齐: {value:>{width}.{precision}f}")

# 字典键的动态访问
data = {'name': '张三', 'age': 25, 'city': '北京'}
key = 'name'
print(f"动态键访问: {data[key]}")

# 2. 复杂表达式
print("\n2. 复杂表达式:")

# 数学运算
import math
x = 30
print(f"sin({x}°) = {math.sin(math.radians(x)):.4f}")
print(f"平方根: √{x} = {math.sqrt(x):.2f}")

# 字符串操作
words = ['hello', 'world', 'python']
print(f"连接字符串: {' '.join(words).upper()}")
print(f"反转列表: {words[::-1]}")

# 条件逻辑
temperature = 25
print(f"天气: {('炎热' if temperature > 30 else '温暖' if temperature > 20 else '凉爽' if temperature > 10 else '寒冷')}")

# 3. 函数和方法链
print("\n3. 函数和方法链:")

text = "  Hello World  "
print(f"处理后的文本: '{text.strip().lower().replace(' ', '_')}'")

# 列表操作
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print(f"偶数平方和: {sum(x**2 for x in numbers if x % 2 == 0)}")

# 4. 自定义对象的格式化
print("\n4. 自定义对象的格式化:")

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __str__(self):
        return f"({self.x}, {self.y})"
    
    def __repr__(self):
        return f"Point({self.x}, {self.y})"
    
    def __format__(self, format_spec):
        if format_spec == 'polar':
            r = math.sqrt(self.x**2 + self.y**2)
            theta = math.atan2(self.y, self.x)
            return f"(r={r:.2f}, θ={math.degrees(theta):.1f}°)"
        elif format_spec == 'distance':
            return f"{math.sqrt(self.x**2 + self.y**2):.2f}"
        else:
            return str(self)

point = Point(3, 4)
print(f"点坐标: {point}")
print(f"极坐标: {point:polar}")
print(f"距离原点: {point:distance}")
print(f"repr格式: {point!r}")

# 5. 调试和变量名显示
print("\n5. 调试和变量名显示:")

# Python 3.8+ 的调试功能
x = 42
y = 3.14
name = "Python"

# 使用 = 显示变量名和值
print(f"{x=}")
print(f"{y=}")
print(f"{name=}")
print(f"{x + y=}")
print(f"{len(name)=}")

# 6. 多行f-string
print("\n6. 多行f-string:")

person = {
    'name': '李明',
    'age': 28,
    'job': '软件工程师',
    'city': '上海',
    'salary': 15000
}

# 多行格式化
profile = f"""
个人信息:
  姓名: {person['name']}
  年龄: {person['age']}岁
  职业: {person['job']}
  城市: {person['city']}
  薪资: {person['salary']:,}元/月
  年薪: {person['salary'] * 12:,}元
"""

print(profile)

# 7. 格式化表格
print("\n7. 格式化表格:")

employees = [
    {'name': '张三', 'age': 25, 'salary': 8000, 'dept': '开发部'},
    {'name': '李四', 'age': 30, 'salary': 12000, 'dept': '产品部'},
    {'name': '王五', 'age': 28, 'salary': 9500, 'dept': '设计部'},
    {'name': '赵六', 'age': 35, 'salary': 15000, 'dept': '管理部'}
]

# 表头
header = f"{'姓名':<8} {'年龄':<6} {'薪资':<10} {'部门':<8}"
print(header)
print('-' * len(header))

# 数据行
for emp in employees:
    row = f"{emp['name']:<8} {emp['age']:<6} {emp['salary']:<10,} {emp['dept']:<8}"
    print(row)

# 统计信息
total_salary = sum(emp['salary'] for emp in employees)
avg_age = sum(emp['age'] for emp in employees) / len(employees)

print('-' * len(header))
print(f"总薪资: {total_salary:,}元")
print(f"平均年龄: {avg_age:.1f}岁")
```

### 实际应用场景

```python
# f-string实际应用场景
print("\n" + "="*50)
print("f-string实际应用场景:")

# 1. 日志记录
print("\n1. 日志记录:")

import datetime
import logging

class Logger:
    """
    使用f-string的日志记录器。
    """
    
    def __init__(self, name):
        self.name = name
    
    def log(self, level, message, **kwargs):
        """
        记录日志。
        
        参数:
            level (str): 日志级别
            message (str): 日志消息
            **kwargs: 额外的上下文信息
        """
        timestamp = datetime.datetime.now()
        context = ' '.join(f"{k}={v}" for k, v in kwargs.items())
        log_entry = f"[{timestamp:%Y-%m-%d %H:%M:%S}] {level.upper():<5} {self.name}: {message}"
        if context:
            log_entry += f" | {context}"
        print(log_entry)
    
    def info(self, message, **kwargs):
        self.log('info', message, **kwargs)
    
    def error(self, message, **kwargs):
        self.log('error', message, **kwargs)
    
    def warning(self, message, **kwargs):
        self.log('warning', message, **kwargs)

# 使用日志记录器
logger = Logger('MyApp')
logger.info("应用程序启动")
logger.info("用户登录", user_id=12345, ip="192.168.1.100")
logger.warning("内存使用率较高", memory_usage=85.5, threshold=80)
logger.error("数据库连接失败", error_code=500, retry_count=3)

# 2. SQL查询构建
print("\n2. SQL查询构建:")

class QueryBuilder:
    """
    使用f-string构建SQL查询。
    """
    
    @staticmethod
    def select(table, columns='*', where=None, order_by=None, limit=None):
        """
        构建SELECT查询。
        
        参数:
            table (str): 表名
            columns (str): 列名
            where (str, optional): WHERE条件
            order_by (str, optional): 排序字段
            limit (int, optional): 限制条数
        
        返回:
            str: SQL查询字符串
        """
        query = f"SELECT {columns} FROM {table}"
        
        if where:
            query += f" WHERE {where}"
        
        if order_by:
            query += f" ORDER BY {order_by}"
        
        if limit:
            query += f" LIMIT {limit}"
        
        return query
    
    @staticmethod
    def insert(table, data):
        """
        构建INSERT查询。
        
        参数:
            table (str): 表名
            data (dict): 要插入的数据
        
        返回:
            str: SQL查询字符串
        """
        columns = ', '.join(data.keys())
        values = ', '.join(f"'{v}'" if isinstance(v, str) else str(v) for v in data.values())
        return f"INSERT INTO {table} ({columns}) VALUES ({values})"
    
    @staticmethod
    def update(table, data, where):
        """
        构建UPDATE查询。
        
        参数:
            table (str): 表名
            data (dict): 要更新的数据
            where (str): WHERE条件
        
        返回:
            str: SQL查询字符串
        """
        set_clause = ', '.join(f"{k} = '{v}'" if isinstance(v, str) else f"{k} = {v}" for k, v in data.items())
        return f"UPDATE {table} SET {set_clause} WHERE {where}"

# 使用查询构建器
print("SELECT查询:")
select_query = QueryBuilder.select(
    table='users',
    columns='id, name, email',
    where="age > 18 AND status = 'active'",
    order_by='name ASC',
    limit=10
)
print(select_query)

print("\nINSERT查询:")
insert_data = {'name': '张三', 'age': 25, 'email': 'zhangsan@example.com'}
insert_query = QueryBuilder.insert('users', insert_data)
print(insert_query)

print("\nUPDATE查询:")
update_data = {'age': 26, 'status': 'active'}
update_query = QueryBuilder.update('users', update_data, "id = 1")
print(update_query)

# 3. 配置文件生成
print("\n3. 配置文件生成:")

class ConfigGenerator:
    """
    使用f-string生成配置文件。
    """
    
    @staticmethod
    def generate_nginx_config(server_name, port, root_path, ssl=False):
        """
        生成Nginx配置。
        
        参数:
            server_name (str): 服务器名称
            port (int): 端口号
            root_path (str): 根目录路径
            ssl (bool): 是否启用SSL
        
        返回:
            str: Nginx配置内容
        """
        ssl_config = """
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;" if ssl else ""
        
{% raw %}
        config = f"""
server {{
    listen {port}{'ssl' if ssl else ''};
    server_name {server_name};
    root {root_path};
    index index.html index.htm;
{ssl_config}
    location / {{
        try_files $uri $uri/ =404;
    }}
    
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {{
        expires 1y;
        add_header Cache-Control "public, immutable";
    }}
{% endraw %}
}}
"""
        return config
    
    @staticmethod
    def generate_docker_compose(services):
        """
        生成Docker Compose配置。
        
        参数:
            services (dict): 服务配置字典
        
        返回:
            str: Docker Compose配置内容
        """
        config = "version: '3.8'\nservices:\n"
        
        for service_name, service_config in services.items():
            config += f"  {service_name}:\n"
            config += f"    image: {service_config['image']}\n"
            
            if 'ports' in service_config:
                config += "    ports:\n"
                for port in service_config['ports']:
                    config += f"      - \"{port}\"\n"
            
            if 'environment' in service_config:
                config += "    environment:\n"
                for key, value in service_config['environment'].items():
                    config += f"      {key}: {value}\n"
            
            if 'volumes' in service_config:
                config += "    volumes:\n"
                for volume in service_config['volumes']:
                    config += f"      - {volume}\n"
            
            config += "\n"
        
        return config

# 生成配置文件示例
print("Nginx配置:")
nginx_config = ConfigGenerator.generate_nginx_config(
    server_name='example.com',
    port=443,
    root_path='/var/www/html',
    ssl=True
)
print(nginx_config)

print("Docker Compose配置:")
services = {
    'web': {
        'image': 'nginx:latest',
        'ports': ['80:80', '443:443'],
        'volumes': ['./html:/usr/share/nginx/html']
    },
    'db': {
        'image': 'mysql:8.0',
        'environment': {
            'MYSQL_ROOT_PASSWORD': 'password',
            'MYSQL_DATABASE': 'myapp'
        },
        'volumes': ['db_data:/var/lib/mysql']
    }
}

docker_config = ConfigGenerator.generate_docker_compose(services)
print(docker_config)

# 4. 报告生成
print("\n4. 报告生成:")

class ReportGenerator:
    """
    使用f-string生成报告。
    """
    
    @staticmethod
    def generate_sales_report(data, period):
        """
        生成销售报告。
        
        参数:
            data (list): 销售数据
            period (str): 报告期间
        
        返回:
            str: 销售报告
        """
        total_sales = sum(item['amount'] for item in data)
        total_quantity = sum(item['quantity'] for item in data)
        avg_price = total_sales / total_quantity if total_quantity > 0 else 0
        
        # 按产品分组
        product_sales = {}
        for item in data:
            product = item['product']
            if product not in product_sales:
                product_sales[product] = {'quantity': 0, 'amount': 0}
            product_sales[product]['quantity'] += item['quantity']
            product_sales[product]['amount'] += item['amount']
        
        # 生成报告
        report = f"""
销售报告 - {period}
{'=' * 50}

总体统计:
  总销售额: {total_sales:,.2f}元
  总销售量: {total_quantity:,}件
  平均单价: {avg_price:.2f}元/件
  交易笔数: {len(data)}笔

产品销售明细:
{'产品名称':<15} {'销售量':<10} {'销售额':<12} {'平均单价':<10}
{'-' * 50}
"""
        
        for product, stats in sorted(product_sales.items(), key=lambda x: x[1]['amount'], reverse=True):
            avg_product_price = stats['amount'] / stats['quantity']
            report += f"{product:<15} {stats['quantity']:<10,} {stats['amount']:<12,.2f} {avg_product_price:<10.2f}\n"
        
        return report

# 生成销售报告示例
sales_data = [
    {'product': 'iPhone 14', 'quantity': 50, 'amount': 399950},
    {'product': 'MacBook Pro', 'quantity': 20, 'amount': 319980},
    {'product': 'iPad Air', 'quantity': 35, 'amount': 174965},
    {'product': 'AirPods Pro', 'quantity': 80, 'amount': 159920},
    {'product': 'Apple Watch', 'quantity': 45, 'amount': 134955}
]

sales_report = ReportGenerator.generate_sales_report(sales_data, "2024年1月")
print(sales_report)
```

## ⚠️ 常见陷阱与最佳实践

### f-string使用注意事项

```python
# f-string使用注意事项
print("\nf-string使用注意事项:")

# 1. 引号冲突
print("1. 引号冲突:")

# 错误示例（会导致语法错误）
# name = "John"
# print(f"He said 'Hello, {name}'s world!'")

# 正确的解决方案
name = "John"
print(f'He said "Hello, {name}\'s world!"')  # 使用单引号包围f-string
print(f"He said 'Hello, {name}\'s world!'")   # 转义单引号
print(f"He said 'Hello, {name}\u2019s world!'")

# 使用三引号
message = f"""
He said: "Hello, {name}'s world!"
This is a multi-line string.
"""
print(message)

# 2. 花括号转义
print("\n2. 花括号转义:")

# 显示字面量花括号
value = 42
print(f"The value is {value}")
{% raw %}
print(f"To display braces: {{value}} = {value}")
print(f"JSON format: {{\"key\": {value}}")
{% endraw %}

# 3. 表达式限制
print("\n3. 表达式限制:")

# f-string中不能使用反斜杠
# 错误示例：
# print(f"Path: {os.path.join('folder', 'file.txt')}")

# 正确的解决方案
import os
path = os.path.join('folder', 'file.txt')
print(f"Path: {path}")

# 或者使用原始字符串
print(f"Raw path: {'folder/file.txt'}")

# 4. 调试时的变量作用域
print("\n4. 调试时的变量作用域:")

def debug_example():
    local_var = "local value"
    global_var = "global value"
    
    # 在函数内部使用f-string
    print(f"Local variable: {local_var}")
    print(f"Global variable: {global_var}")
    
    # 注意：f-string会在定义时求值
    return f"Captured: {local_var}"

result = debug_example()
print(f"Returned: {result}")

# 5. 性能考虑
print("\n5. 性能考虑:")

import time

def performance_comparison():
    """
    比较不同字符串格式化方法的性能。
    """
    name = "Python"
    version = 3.9
    iterations = 100000
    
    # f-string
    start = time.time()
    for _ in range(iterations):
        result = f"Language: {name}, Version: {version}"
    fstring_time = time.time() - start
    
    # str.format()
    start = time.time()
    for _ in range(iterations):
        result = "Language: {}, Version: {}".format(name, version)
    format_time = time.time() - start
    
    # % 格式化
    start = time.time()
    for _ in range(iterations):
        result = "Language: %s, Version: %s" % (name, version)
    percent_time = time.time() - start
    
    # 字符串连接
    start = time.time()
    for _ in range(iterations):
        result = "Language: " + name + ", Version: " + str(version)
    concat_time = time.time() - start
    
    print(f"  f-string: {fstring_time:.4f}秒")
    print(f"  str.format(): {format_time:.4f}秒")
    print(f"  % 格式化: {percent_time:.4f}秒")
    print(f"  字符串连接: {concat_time:.4f}秒")
    
    # 性能比较
    fastest = min(fstring_time, format_time, percent_time, concat_time)
    print(f"\n  性能比较（相对于最快方法）:")
    print(f"    f-string: {fstring_time/fastest:.2f}x")
    print(f"    str.format(): {format_time/fastest:.2f}x")
    print(f"    % 格式化: {percent_time/fastest:.2f}x")
    print(f"    字符串连接: {concat_time/fastest:.2f}x")

performance_comparison()

# 6. 最佳实践
print("\n6. f-string最佳实践:")

class FStringBestPractices:
    """
    f-string最佳实践示例。
    """
    
    @staticmethod
    def safe_format(template, **kwargs):
        """
        安全的f-string格式化。
        
        参数:
            template (str): 模板字符串
            **kwargs: 格式化参数
        
        返回:
            str: 格式化后的字符串
        """
        try:
            # 使用eval和f-string模拟（仅用于演示，实际不推荐）
            return template.format(**kwargs)
        except KeyError as e:
            return f"Missing variable: {e}"
        except Exception as e:
            return f"Formatting error: {e}"
    
    @staticmethod
    def conditional_format(condition, true_template, false_template, **kwargs):
        """
        条件格式化。
        
        参数:
            condition: 条件表达式
            true_template (str): 条件为真时的模板
            false_template (str): 条件为假时的模板
            **kwargs: 格式化参数
        
        返回:
            str: 格式化后的字符串
        """
        template = true_template if condition else false_template
        return template.format(**kwargs)
    
    @staticmethod
    def multi_line_format(data, template):
        """
        多行数据格式化。
        
        参数:
            data (list): 数据列表
            template (str): 格式化模板
        
        返回:
            str: 格式化后的多行字符串
        """
        lines = []
        for item in data:
            if isinstance(item, dict):
                line = template.format(**item)
            else:
                line = template.format(item)
            lines.append(line)
        return '\n'.join(lines)
    
    @staticmethod
    def nested_format(data, max_depth=3, current_depth=0):
        """
        嵌套数据格式化。
        
        参数:
            data: 要格式化的数据
            max_depth (int): 最大嵌套深度
            current_depth (int): 当前深度
        
        返回:
            str: 格式化后的字符串
        """
        indent = "  " * current_depth
        
        if isinstance(data, dict):
            if current_depth >= max_depth:
{% raw %}
                return f"{indent}{{...}}"
            
            lines = [f"{indent}{{"]{% endraw %}
            for key, value in data.items():
                formatted_value = FStringBestPractices.nested_format(
                    value, max_depth, current_depth + 1
                )
                lines.append(f"{indent}  {key}: {formatted_value.strip()}")
            lines.append(f"{indent}}}")
            return '\n'.join(lines)
        
        elif isinstance(data, list):
            if current_depth >= max_depth:
                return f"{indent}[...]"
            
            if len(data) <= 3:
                items = [str(item) for item in data]
                return f"{indent}[{', '.join(items)}]"
            else:
                return f"{indent}[{data[0]}, {data[1]}, ... ({len(data)} items)]"
        
        else:
            return f"{indent}{data!r}"

# 测试最佳实践
print("\n测试f-string最佳实践:")

# 安全格式化
print("\n1. 安全格式化:")
template = "Hello, {name}! You are {age} years old."
result1 = FStringBestPractices.safe_format(template, name="Alice", age=25)
result2 = FStringBestPractices.safe_format(template, name="Bob")  # 缺少age参数
print(f"完整参数: {result1}")
print(f"缺少参数: {result2}")

# 条件格式化
print("\n2. 条件格式化:")
score = 85
result = FStringBestPractices.conditional_format(
    score >= 80,
    "恭喜！你的分数是 {score}，成绩优秀！",
    "你的分数是 {score}，需要继续努力。",
    score=score
)
print(result)

# 多行格式化
print("\n3. 多行格式化:")
students = [
    {'name': '张三', 'score': 85, 'grade': 'A'},
    {'name': '李四', 'score': 92, 'grade': 'A+'},
    {'name': '王五', 'score': 78, 'grade': 'B'}
]

template = "{name:<6} 分数: {score:>3} 等级: {grade}"
result = FStringBestPractices.multi_line_format(students, template)
print("学生成绩单:")
print(result)

# 嵌套格式化
print("\n4. 嵌套格式化:")
complex_data = {
    'user': {
        'name': '张三',
        'profile': {
            'age': 25,
            'interests': ['编程', '阅读', '旅行'],
            'contact': {
                'email': 'zhangsan@example.com',
                'phone': '13800138000'
            }
        }
    },
    'settings': {
        'theme': 'dark',
        'notifications': True
    }
}

formatted = FStringBestPractices.nested_format(complex_data)
print("复杂数据结构:")
print(formatted)
```

## 🔗 相关函数和模块

### 内置函数
- `format()` - 格式化单个值
- `str()` - 将对象转换为字符串
- `repr()` - 返回对象的字符串表示
- `print()` - 打印输出

### 字符串方法
- `str.format()` - 字符串格式化方法
- `str.join()` - 连接字符串
- `str.replace()` - 替换字符串
- `str.strip()` - 去除空白字符

### 标准库模块
- `string` - 字符串常量和模板
- `datetime` - 日期和时间处理
- `decimal` - 十进制浮点运算
- `locale` - 国际化服务
- `json` - JSON编码和解码

### 第三方库
- `babel` - 国际化工具
- `humanize` - 人性化格式化
- `rich` - 富文本和美观的终端输出
- `tabulate` - 表格格式化

## 📚 扩展阅读

- [PEP 498 - 字面量字符串插值](https://www.python.org/dev/peps/pep-0498/)
- [Python字符串格式化](https://docs.python.org/3/library/string.html#format-string-syntax)
- [格式规范迷你语言](https://docs.python.org/3/library/string.html#format-specification-mini-language)
- [Python 3.8新特性 - f-string调试](https://docs.python.org/3/whatsnew/3.8.html#f-strings-support-for-self-documenting-expressions-and-debugging)

## 🏷️ 标签

`f-string` `字符串格式化` `字面量插值` `表达式求值` `格式规范` `字符串模板` `文本处理` `代码可读性`