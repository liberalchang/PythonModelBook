---
layout: doc
title: 函数定义与调用
permalink: /docs/basics/functions/
category: basics
tags: [函数, 函数定义, 参数, 返回值, 函数调用]
description: Python函数的定义、调用和参数传递详解
author: Python文档团队
date: 2024-01-01
updated: 2024-01-01
version: 1.0
difficulty: 初级
---

# 函数定义与调用

## 📝 概述

函数是Python编程中的核心概念，它允许我们将代码组织成可重用的模块。函数可以接收输入参数，执行特定的任务，并返回结果。掌握函数的定义、调用和参数传递是编写高质量Python代码的基础。

## 🎯 学习目标

- 掌握函数的定义语法和基本结构
- 理解函数的调用机制和参数传递
- 学会使用不同类型的参数（位置参数、关键字参数、默认参数）
- 掌握可变参数和参数解构的使用方法
- 了解函数返回值的处理

## 📋 前置知识

- Python基本语法和缩进规则
- 变量和数据类型
- 基本的输入输出操作
- 字符串格式化

## 🔍 详细内容

### 函数的定义

#### 基本语法

函数定义使用`def`关键字，遵循以下基本格式：

```python
def 函数名(参数列表):
    """函数文档字符串（可选）"""
    函数体(代码块)
    return 返回值  # return可以省略，默认返回None
```

#### 基础示例

```python
# 简单的函数定义
def greet(name):
    """问候函数，接收一个姓名参数"""
    message = f"你好，{name}！"
    return message

# 调用函数
result = greet("张三")
print(result)  # 输出：你好，张三！

# 无参数函数
def get_current_time():
    """获取当前时间"""
    import datetime
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

print(get_current_time())  # 输出：2024-01-01 12:00:00

# 无返回值函数
def print_separator():
    """打印分隔线"""
    print("-" * 50)

print_separator()  # 输出：--------------------------------------------------
```

#### 函数命名规范

```python
# 好的函数命名示例
def calculate_area(length, width):
    """计算矩形面积"""
    return length * width

def is_even(number):
    """判断数字是否为偶数"""
    return number % 2 == 0

def get_user_input():
    """获取用户输入"""
    return input("请输入内容：")

# 使用示例
area = calculate_area(5, 3)
print(f"面积：{area}")  # 输出：面积：15

print(is_even(4))   # 输出：True
print(is_even(5))   # 输出：False
```

### 函数的调用

#### 基本调用方式

```python
def add_numbers(a, b):
    """两数相加"""
    return a + b

# 直接调用并打印结果
print(add_numbers(3, 5))  # 输出：8

# 将结果赋值给变量
result = add_numbers(10, 20)
print(f"计算结果：{result}")  # 输出：计算结果：30

# 在表达式中使用
total = add_numbers(1, 2) + add_numbers(3, 4)
print(f"总和：{total}")  # 输出：总和：10
```

#### 函数作为参数

```python
def apply_operation(x, y, operation):
    """应用指定的操作函数"""
    return operation(x, y)

def multiply(a, b):
    """乘法运算"""
    return a * b

def divide(a, b):
    """除法运算"""
    if b != 0:
        return a / b
    else:
        return "除数不能为零"

# 使用示例
result1 = apply_operation(6, 3, multiply)
print(f"6 × 3 = {result1}")  # 输出：6 × 3 = 18

result2 = apply_operation(10, 2, divide)
print(f"10 ÷ 2 = {result2}")  # 输出：10 ÷ 2 = 5.0
```

### 参数传递

#### 位置参数

位置参数按照定义的顺序传递，参数的位置很重要。

```python
def introduce_person(name, age, city):
    """介绍一个人的信息"""
    print(f"我叫{name}，今年{age}岁，来自{city}")

# 按位置传递参数
introduce_person("李四", 25, "北京")
# 输出：我叫李四，今年25岁，来自北京

# 位置错误会导致逻辑错误
introduce_person(25, "王五", "上海")  # 参数位置错误
# 输出：我叫25，今年王五岁，来自上海
```

#### 关键字参数

关键字参数通过参数名指定值，不依赖于位置顺序。

```python
def create_user_profile(username, email, age, city):
    """创建用户档案"""
    profile = {
        "用户名": username,
        "邮箱": email,
        "年龄": age,
        "城市": city
    }
    return profile

# 使用关键字参数，顺序可以任意
user1 = create_user_profile(
    city="深圳",
    username="张三",
    age=28,
    email="zhangsan@example.com"
)
print(user1)
# 输出：{'用户名': '张三', '邮箱': 'zhangsan@example.com', '年龄': 28, '城市': '深圳'}
```

#### 位置参数和关键字参数混合使用

```python
def book_flight(departure, destination, date, time="09:00", class_type="经济舱"):
    """预订航班"""
    booking_info = {
        "出发地": departure,
        "目的地": destination,
        "日期": date,
        "时间": time,
        "舱位类型": class_type
    }
    return booking_info

# 混合使用位置参数和关键字参数
# 注意：位置参数必须在关键字参数之前
flight1 = book_flight("北京", "上海", "2024-01-15", class_type="商务舱")
print(flight1)

flight2 = book_flight("广州", "深圳", "2024-01-20", time="14:30")
print(flight2)

# 错误示例：关键字参数不能在位置参数之前
# flight3 = book_flight("北京", destination="上海", "2024-01-15")  # 语法错误
```

#### 默认参数（缺省参数）

默认参数为函数参数提供默认值，调用时可以省略这些参数。

```python
def calculate_circle_area(radius, pi=3.14159):
    """计算圆的面积"""
    area = pi * radius ** 2
    return area

# 使用默认的pi值
area1 = calculate_circle_area(5)
print(f"半径为5的圆面积：{area1:.2f}")  # 输出：半径为5的圆面积：78.54

# 提供自定义的pi值
import math
area2 = calculate_circle_area(5, math.pi)
print(f"半径为5的圆面积（精确）：{area2:.2f}")  # 输出：半径为5的圆面积（精确）：78.54

def send_email(to, subject, body, cc=None, bcc=None, priority="normal"):
    """发送邮件"""
    email_info = {
        "收件人": to,
        "主题": subject,
        "正文": body,
        "抄送": cc,
        "密送": bcc,
        "优先级": priority
    }
    print(f"邮件已发送：{email_info}")
    return email_info

# 只提供必需参数
send_email("user@example.com", "会议通知", "明天上午10点开会")

# 提供部分可选参数
send_email(
    "user@example.com", 
    "紧急通知", 
    "系统维护通知", 
    priority="high"
)
```

### 可变参数

#### 位置可变参数（*args）

使用`*args`可以接收任意数量的位置参数，这些参数会被收集到一个元组中。

```python
def calculate_sum(*numbers):
    """计算任意数量数字的和"""
    total = 0
    for num in numbers:
        total += num
    return total

# 传递不同数量的参数
print(calculate_sum(1, 2, 3))           # 输出：6
print(calculate_sum(1, 2, 3, 4, 5))     # 输出：15
print(calculate_sum(10))                # 输出：10
print(calculate_sum())                  # 输出：0

def print_info(name, age, *hobbies):
    """打印个人信息和爱好"""
    print(f"姓名：{name}")
    print(f"年龄：{age}")
    if hobbies:
        print(f"爱好：{', '.join(hobbies)}")
    else:
        print("暂无爱好信息")

# 使用示例
print_info("张三", 25, "读书", "游泳", "编程")
# 输出：
# 姓名：张三
# 年龄：25
# 爱好：读书, 游泳, 编程

print_info("李四", 30)
# 输出：
# 姓名：李四
# 年龄：30
# 暂无爱好信息
```

#### 关键字可变参数（**kwargs）

使用`**kwargs`可以接收任意数量的关键字参数，这些参数会被收集到一个字典中。

```python
def create_student_record(name, student_id, **additional_info):
    """创建学生记录"""
    record = {
        "姓名": name,
        "学号": student_id
    }
    
    # 添加额外信息
    record.update(additional_info)
    
    return record

# 使用示例
student1 = create_student_record(
    "张三", 
    "2024001", 
    专业="计算机科学", 
    年级="大二", 
    班级="CS2022-1",
    联系电话="13800138000"
)
print(student1)
# 输出：{'姓名': '张三', '学号': '2024001', '专业': '计算机科学', '年级': '大二', '班级': 'CS2022-1', '联系电话': '13800138000'}

def configure_database(**config):
    """配置数据库连接"""
    default_config = {
        "host": "localhost",
        "port": 3306,
        "charset": "utf8",
        "timeout": 30
    }
    
    # 更新默认配置
    default_config.update(config)
    
    print("数据库配置：")
    for key, value in default_config.items():
        print(f"  {key}: {value}")
    
    return default_config

# 使用示例
db_config = configure_database(
    host="192.168.1.100",
    username="admin",
    password="secret123",
    database="myapp"
)
```

#### 混合使用可变参数

```python
def flexible_function(required_arg, default_arg="default", *args, **kwargs):
    """演示参数的综合使用"""
    print(f"必需参数：{required_arg}")
    print(f"默认参数：{default_arg}")
    
    if args:
        print(f"位置可变参数：{args}")
    
    if kwargs:
        print(f"关键字可变参数：{kwargs}")

# 使用示例
print("示例1：")
flexible_function("必需值")

print("\n示例2：")
flexible_function("必需值", "自定义默认值", "额外1", "额外2", key1="value1", key2="value2")

# keyword-only参数
def advanced_function(name, age, *, email, phone=None, **other_info):
    """使用keyword-only参数"""
    info = {
        "姓名": name,
        "年龄": age,
        "邮箱": email
    }
    
    if phone:
        info["电话"] = phone
    
    info.update(other_info)
    
    return info

# 使用示例
user_info = advanced_function(
    "张三", 
    25, 
    email="zhangsan@example.com", 
    phone="13800138000",
    address="北京市朝阳区",
    department="技术部"
)
print(user_info)
```

### 参数解构

参数解构允许我们将集合（列表、元组、字典）的元素作为函数参数传递。

#### 解构列表和元组（*操作符）

```python
def calculate_rectangle_area(length, width):
    """计算矩形面积"""
    return length * width

# 使用列表解构
dimensions = [5, 3]
area = calculate_rectangle_area(*dimensions)
print(f"矩形面积：{area}")  # 输出：矩形面积：15

# 使用元组解构
size = (4, 6)
area = calculate_rectangle_area(*size)
print(f"矩形面积：{area}")  # 输出：矩形面积：24

def print_student_info(name, age, grade, *subjects):
    """打印学生信息"""
    print(f"学生：{name}，年龄：{age}，年级：{grade}")
    if subjects:
        print(f"选修课程：{', '.join(subjects)}")

# 解构包含多个元素的列表
student_data = ["李明", 16, "高一", "数学", "物理", "化学"]
print_student_info(*student_data)
# 输出：
# 学生：李明，年龄：16，年级：高一
# 选修课程：数学, 物理, 化学
```

#### 解构字典（**操作符）

```python
def create_user_account(username, email, password, **profile):
    """创建用户账户"""
    account = {
        "用户名": username,
        "邮箱": email,
        "密码": "*" * len(password),  # 隐藏密码
        "档案": profile
    }
    return account

# 使用字典解构
user_data = {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secret123",
    "first_name": "John",
    "last_name": "Doe",
    "age": 30,
    "city": "New York"
}

account = create_user_account(**user_data)
print(account)

# 混合使用位置参数和字典解构
login_info = {"email": "jane@example.com", "password": "mypassword"}
profile_info = {"first_name": "Jane", "age": 28, "occupation": "Engineer"}

account2 = create_user_account(
    "jane_smith", 
    **login_info, 
    **profile_info
)
print(account2)
```

## 💡 实际应用

### 基础用法

```python
def temperature_converter():
    """温度转换器"""
    def celsius_to_fahrenheit(celsius):
        """摄氏度转华氏度"""
        return (celsius * 9/5) + 32
    
    def fahrenheit_to_celsius(fahrenheit):
        """华氏度转摄氏度"""
        return (fahrenheit - 32) * 5/9
    
    def celsius_to_kelvin(celsius):
        """摄氏度转开尔文"""
        return celsius + 273.15
    
    while True:
        print("\n温度转换器")
        print("1. 摄氏度 → 华氏度")
        print("2. 华氏度 → 摄氏度")
        print("3. 摄氏度 → 开尔文")
        print("4. 退出")
        
        choice = input("请选择转换类型（1-4）：")
        
        if choice == '4':
            print("谢谢使用！")
            break
        
        try:
            if choice == '1':
                celsius = float(input("请输入摄氏度："))
                fahrenheit = celsius_to_fahrenheit(celsius)
                print(f"{celsius}°C = {fahrenheit:.2f}°F")
            
            elif choice == '2':
                fahrenheit = float(input("请输入华氏度："))
                celsius = fahrenheit_to_celsius(fahrenheit)
                print(f"{fahrenheit}°F = {celsius:.2f}°C")
            
            elif choice == '3':
                celsius = float(input("请输入摄氏度："))
                kelvin = celsius_to_kelvin(celsius)
                print(f"{celsius}°C = {kelvin:.2f}K")
            
            else:
                print("无效选择，请重新输入")
        
        except ValueError:
            print("请输入有效的数字")

# 使用示例
# temperature_converter()
```

### 高级用法

```python
class Calculator:
    """计算器类，演示函数的高级用法"""
    
    def __init__(self):
        self.history = []
    
    def add_to_history(self, operation, result):
        """添加计算历史"""
        self.history.append({
            "operation": operation,
            "result": result,
            "timestamp": self._get_timestamp()
        })
    
    def _get_timestamp(self):
        """获取时间戳（私有方法）"""
        import datetime
        return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    def calculate(self, operation_func, *args, **kwargs):
        """通用计算方法"""
        try:
            result = operation_func(*args, **kwargs)
            operation_name = operation_func.__name__
            self.add_to_history(f"{operation_name}{args}", result)
            return result
        except Exception as e:
            print(f"计算错误：{e}")
            return None
    
    def basic_operations(self, a, b, operation="add"):
        """基本运算"""
        operations = {
            "add": lambda x, y: x + y,
            "subtract": lambda x, y: x - y,
            "multiply": lambda x, y: x * y,
            "divide": lambda x, y: x / y if y != 0 else "除数不能为零"
        }
        
        if operation in operations:
            return operations[operation](a, b)
        else:
            return "不支持的运算类型"
    
    def advanced_operations(self, numbers, operation="sum"):
        """高级运算"""
        if not numbers:
            return 0
        
        if operation == "sum":
            return sum(numbers)
        elif operation == "average":
            return sum(numbers) / len(numbers)
        elif operation == "max":
            return max(numbers)
        elif operation == "min":
            return min(numbers)
        elif operation == "product":
            result = 1
            for num in numbers:
                result *= num
            return result
        else:
            return "不支持的运算类型"
    
    def get_history(self, limit=None):
        """获取计算历史"""
        if limit:
            return self.history[-limit:]
        return self.history
    
    def clear_history(self):
        """清空历史记录"""
        self.history.clear()
        print("历史记录已清空")

# 使用示例
calc = Calculator()

# 基本运算
result1 = calc.basic_operations(10, 5, "add")
print(f"10 + 5 = {result1}")

result2 = calc.basic_operations(10, 3, "divide")
print(f"10 ÷ 3 = {result2:.2f}")

# 高级运算
numbers = [1, 2, 3, 4, 5]
result3 = calc.advanced_operations(numbers, "average")
print(f"平均值：{result3}")

result4 = calc.advanced_operations(numbers, "product")
print(f"乘积：{result4}")

# 查看历史记录
print("\n计算历史：")
for record in calc.get_history():
    print(f"{record['timestamp']}: {record['operation']} = {record['result']}")
```

### 实际案例

```python
def data_processor():
    """数据处理器，演示函数的实际应用"""
    
    def validate_data(data, required_fields=None, data_types=None):
        """数据验证"""
        if not isinstance(data, dict):
            return False, "数据必须是字典格式"
        
        # 检查必需字段
        if required_fields:
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                return False, f"缺少必需字段：{missing_fields}"
        
        # 检查数据类型
        if data_types:
            for field, expected_type in data_types.items():
                if field in data and not isinstance(data[field], expected_type):
                    return False, f"字段 '{field}' 类型错误，期望 {expected_type.__name__}"
        
        return True, "数据验证通过"
    
    def clean_data(data, **cleaning_options):
        """数据清洗"""
        cleaned_data = data.copy()
        
        # 移除空值
        if cleaning_options.get("remove_empty", False):
            cleaned_data = {k: v for k, v in cleaned_data.items() 
                          if v is not None and v != ""}
        
        # 转换字符串为小写
        if cleaning_options.get("lowercase_strings", False):
            for key, value in cleaned_data.items():
                if isinstance(value, str):
                    cleaned_data[key] = value.lower()
        
        # 移除前后空格
        if cleaning_options.get("strip_strings", True):
            for key, value in cleaned_data.items():
                if isinstance(value, str):
                    cleaned_data[key] = value.strip()
        
        return cleaned_data
    
    def transform_data(data, transformations):
        """数据转换"""
        transformed_data = data.copy()
        
        for field, transform_func in transformations.items():
            if field in transformed_data:
                try:
                    transformed_data[field] = transform_func(transformed_data[field])
                except Exception as e:
                    print(f"转换字段 '{field}' 时出错：{e}")
        
        return transformed_data
    
    def process_batch(data_list, *processing_steps, **options):
        """批量处理数据"""
        results = []
        errors = []
        
        for i, data in enumerate(data_list):
            try:
                processed_data = data
                
                # 应用所有处理步骤
                for step_func in processing_steps:
                    if callable(step_func):
                        processed_data = step_func(processed_data, **options)
                
                results.append(processed_data)
                
            except Exception as e:
                error_info = {
                    "index": i,
                    "data": data,
                    "error": str(e)
                }
                errors.append(error_info)
                
                if not options.get("continue_on_error", True):
                    break
        
        return {
            "results": results,
            "errors": errors,
            "success_count": len(results),
            "error_count": len(errors)
        }
    
    # 示例数据
    sample_data = [
        {"name": "  张三  ", "age": "25", "email": "ZHANG@EXAMPLE.COM", "city": "北京"},
        {"name": "李四", "age": "30", "email": "li@example.com", "city": ""},
        {"name": "", "age": "invalid", "email": "wang@example.com", "city": "上海"},
        {"name": "王五", "age": "28", "email": "wang@example.com", "city": "广州"}
    ]
    
    # 定义转换函数
    def age_to_int(age_str):
        """将年龄字符串转换为整数"""
        return int(age_str) if age_str.isdigit() else None
    
    # 处理步骤
    def step1_clean(data, **options):
        return clean_data(data, strip_strings=True, remove_empty=True)
    
    def step2_transform(data, **options):
        transformations = {
            "age": age_to_int,
            "email": str.lower
        }
        return transform_data(data, transformations)
    
    def step3_validate(data, **options):
        required_fields = ["name", "age", "email"]
        data_types = {"name": str, "age": int, "email": str}
        
        is_valid, message = validate_data(data, required_fields, data_types)
        if not is_valid:
            raise ValueError(message)
        
        return data
    
    # 批量处理
    print("开始批量处理数据...")
    result = process_batch(
        sample_data,
        step1_clean,
        step2_transform,
        step3_validate,
        continue_on_error=True
    )
    
    print(f"\n处理完成：")
    print(f"成功处理：{result['success_count']} 条")
    print(f"处理失败：{result['error_count']} 条")
    
    print("\n成功处理的数据：")
    for i, data in enumerate(result['results'], 1):
        print(f"{i}. {data}")
    
    if result['errors']:
        print("\n处理失败的数据：")
        for error in result['errors']:
            print(f"索引 {error['index']}: {error['error']}")
    
    return result

# 使用示例
# data_processor()
```

## ⚠️ 注意事项

- **参数顺序**: 普通参数 → 默认参数 → *args → keyword-only参数 → **kwargs
- **可变默认参数**: 避免使用可变对象（如列表、字典）作为默认参数
- **函数命名**: 使用描述性的函数名，遵循Python命名规范
- **文档字符串**: 为函数添加清晰的文档说明
- **参数验证**: 在函数内部验证参数的有效性
- **异常处理**: 适当处理可能出现的异常情况

## 🔗 相关内容

- [变量和数据类型](../variables/) - 了解函数参数的数据类型
- [控制流程](../control-flow/) - 学习函数内的逻辑控制
- [函数作用域](../function-scope/) - 深入理解变量作用域
- [面向对象编程](../oop/) - 学习类方法和实例方法

## 📚 扩展阅读

- [Python官方文档 - 函数定义](https://docs.python.org/3/tutorial/controlflow.html#defining-functions)
- [PEP 3102 - Keyword-Only Arguments](https://www.python.org/dev/peps/pep-3102/)
- [Python函数式编程指南](https://docs.python.org/3/howto/functional.html)

## 🏷️ 标签

`函数` `函数定义` `参数` `返回值` `函数调用` `可变参数` `默认参数` `参数解构`

---

**最后更新**: 2024-01-01  
**作者**: Python文档团队  
**版本**: 1.0