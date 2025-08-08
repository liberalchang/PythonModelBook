---
layout: doc
title: match-case语句
permalink: /docs/basics/match-case/
---

# match-case语句

## 概述

Python 3.10 引入了 match-case 语句，这是一种强大的结构匹配模式，类似于其他语言中的 switch-case 语句，但功能更加强大和灵活。match-case 不仅可以进行简单的值匹配，还支持复杂的模式匹配，包括序列匹配、字典匹配、类型匹配等。

## 学习目标

通过本章学习，你将掌握：
- match-case 语句的基本语法
- 标量匹配和多值匹配
- 序列和字典的模式匹配
- 类型匹配和自定义类匹配
- 通配符和变量绑定的使用
- match-case 的高级特性

## 前置知识

- Python 基础语法
- 数据类型（列表、元组、字典等）
- 类和对象的基本概念

## 详细内容

### 基本语法

```python
match subject:
    case <pattern_1>:
        <action_1>
    case <pattern_2>:
        <action_2>
    case <pattern_3>:
        <action_3>
    case _:
        <action_wildcard>
```

`case _:` 类似于其他语言中的 `default:`，当其他 case 都无法匹配时执行。

### 标量匹配

标量匹配是最基本的匹配方式，只能使用常量，不能使用变量：

```python
def http_error(status):
    match status:
        case 400:
            return "Bad request"
        case 404:
            return "Not found"
        case 418:
            return "I'm a teapot"
        case _:
            return "Something's wrong with the internet"

print(http_error(404))  # 输出: Not found
```

### 多值匹配

一个 case 可以匹配多个值，使用 `|` 分隔：

```python
def check_status(status):
    match status:
        case 401 | 403 | 404:
            return "Not allowed"
        case 500 | 502 | 503:
            return "Server error"
        case _:
            return "Unknown status"

print(check_status(403))  # 输出: Not allowed
```

### 序列匹配

#### 元组和列表匹配

```python
def analyze_point(point):
    match point:
        case (0, 0):
            print("坐标原点")
        case (0, y):
            print(f"Y轴上的点，Y={y}")
        case (x, 0):
            print(f"X轴上的点，X={x}")
        case (x, y) if x > 0 and y > 0:
            print(f"第一象限的点：({x}, {y})")
        case (x, y):
            print(f"其他象限的点：({x}, {y})")
        case _:
            print("不是二维坐标点")

analyze_point((0, 0))    # 坐标原点
analyze_point((3, 4))    # 第一象限的点：(3, 4)
analyze_point([0, 5])    # Y轴上的点，Y=5
```

#### 通配符使用

```python
def process_sequence(data):
    match data:
        case [x, *rest]:  # 匹配至少有一个元素的列表
            print(f"第一个元素: {x}, 其余元素: {rest}")
        case [x, y, *_]:  # 匹配至少有两个元素的列表
            print(f"前两个元素: {x}, {y}")
        case []:
            print("空列表")
        case _:
            print("其他类型")

process_sequence([1, 2, 3, 4])  # 第一个元素: 1, 其余元素: [2, 3, 4]
process_sequence([])            # 空列表
```

### 字典匹配

字典匹配只需要包含指定的键值对即可，可以有额外的键：

```python
def process_user(user_data):
    match user_data:
        case {'name': name, 'age': age} if age >= 18:
            print(f"成年用户: {name}, 年龄: {age}")
        case {'name': name, 'age': age}:
            print(f"未成年用户: {name}, 年龄: {age}")
        case {'name': name, **rest}:
            print(f"用户: {name}, 其他信息: {rest}")
        case _:
            print("无效的用户数据")

process_user({'name': 'Alice', 'age': 25, 'city': 'Beijing'})
# 输出: 成年用户: Alice, 年龄: 25
```

### 类型匹配

```python
def process_data(data):
    match data:
        case int() if data > 0:
            print(f"正整数: {data}")
        case int():
            print(f"非正整数: {data}")
        case str() if len(data) > 0:
            print(f"非空字符串: {data}")
        case list() as items:
            print(f"列表，包含 {len(items)} 个元素")
        case dict() as mapping:
            print(f"字典，包含 {len(mapping)} 个键")
        case _:
            print(f"其他类型: {type(data)}")

process_data(42)        # 正整数: 42
process_data("hello")   # 非空字符串: hello
process_data([1, 2, 3]) # 列表，包含 3 个元素
```

### 自定义类匹配

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

class Circle:
    def __init__(self, center, radius):
        self.center = center
        self.radius = radius

def analyze_shape(shape):
    match shape:
        case Point(x=0, y=0):
            print("原点")
        case Point(x=x, y=y):
            print(f"点坐标: ({x}, {y})")
        case Circle(center=Point(x=0, y=0), radius=r):
            print(f"以原点为圆心，半径为 {r} 的圆")
        case Circle(center=center, radius=r):
            print(f"圆心在 ({center.x}, {center.y})，半径为 {r} 的圆")
        case _:
            print("未知形状")

analyze_shape(Point(3, 4))  # 点坐标: (3, 4)
analyze_shape(Circle(Point(0, 0), 5))  # 以原点为圆心，半径为 5 的圆
```

### AS 模式

AS 模式用于在匹配的同时进行变量绑定：

```python
def process_nested_data(data):
    match data:
        case {'user': {'name': str() as name, 'age': int() as age}}:
            print(f"用户信息 - 姓名: {name}, 年龄: {age}")
        case [int() as first, *rest] if len(rest) > 0:
            print(f"数字列表 - 第一个: {first}, 其余: {rest}")
        case str() as text if len(text) > 10:
            print(f"长字符串: {text[:10]}...")
        case _:
            print("其他数据")

process_nested_data({'user': {'name': 'Bob', 'age': 30}})
# 输出: 用户信息 - 姓名: Bob, 年龄: 30
```

### 条件匹配

可以在 case 后添加 if 条件：

```python
def grade_score(score):
    match score:
        case x if x >= 90:
            return "优秀"
        case x if x >= 80:
            return "良好"
        case x if x >= 70:
            return "中等"
        case x if x >= 60:
            return "及格"
        case _:
            return "不及格"

print(grade_score(85))  # 输出: 良好
```

## 实际应用场景

### 1. 命令行参数处理

```python
def handle_command(command):
    match command:
        case ['help']:
            print("显示帮助信息")
        case ['list', '--all']:
            print("列出所有项目")
        case ['list', category]:
            print(f"列出 {category} 类别的项目")
        case ['create', name, '--type', type_name]:
            print(f"创建类型为 {type_name} 的 {name}")
        case ['delete', name] if name != 'important':
            print(f"删除 {name}")
        case _:
            print("未知命令")

handle_command(['create', 'myproject', '--type', 'web'])
# 输出: 创建类型为 web 的 myproject
```

### 2. JSON 数据处理

```python
def process_api_response(response):
    match response:
        case {'status': 'success', 'data': data}:
            return f"成功获取数据: {len(data)} 条记录"
        case {'status': 'error', 'message': msg, 'code': code}:
            return f"错误 {code}: {msg}"
        case {'status': 'pending', 'progress': progress}:
            return f"处理中... {progress}%"
        case _:
            return "未知响应格式"

response1 = {'status': 'success', 'data': [1, 2, 3]}
print(process_api_response(response1))  # 成功获取数据: 3 条记录
```

### 3. 状态机实现

```python
class StateMachine:
    def __init__(self):
        self.state = 'idle'
        self.data = None
    
    def process_event(self, event):
        match (self.state, event):
            case ('idle', 'start'):
                self.state = 'running'
                print("状态机启动")
            case ('running', 'pause'):
                self.state = 'paused'
                print("状态机暂停")
            case ('paused', 'resume'):
                self.state = 'running'
                print("状态机恢复")
            case ('running' | 'paused', 'stop'):
                self.state = 'idle'
                print("状态机停止")
            case _:
                print(f"无效的状态转换: {self.state} -> {event}")

sm = StateMachine()
sm.process_event('start')   # 状态机启动
sm.process_event('pause')   # 状态机暂停
sm.process_event('resume')  # 状态机恢复
```

## 常见陷阱与最佳实践

### 1. 变量绑定注意事项

```python
# 错误：变量不能作为匹配模式
# error_code = 500
# match status:
#     case error_code:  # 这会报错
#         return "Server Error"

# 正确：使用常量或条件
match status:
    case x if x == 500:
        return "Server Error"
```

### 2. 匹配顺序很重要

```python
def check_number(x):
    match x:
        case n if n > 0:
            return "正数"
        case 0:
            return "零"  # 这个永远不会被执行到
        case n if n < 0:
            return "负数"

# 正确的顺序
def check_number_correct(x):
    match x:
        case 0:
            return "零"
        case n if n > 0:
            return "正数"
        case n if n < 0:
            return "负数"
```

### 3. 性能考虑

```python
# 对于简单的值匹配，match-case 比 if-elif 更高效
def handle_status_match(status):
    match status:
        case 200: return "OK"
        case 404: return "Not Found"
        case 500: return "Server Error"
        case _: return "Unknown"

# 但对于复杂条件，if-elif 可能更清晰
def handle_complex_condition(data):
    if isinstance(data, dict) and 'user' in data and data['user'].get('active'):
        return "Active user"
    elif isinstance(data, list) and len(data) > 10:
        return "Large list"
    else:
        return "Other"
```

## 相关函数与模块

### 内置函数
- `isinstance()` - 类型检查
- `hasattr()` - 属性检查
- `callable()` - 可调用对象检查

### 标准库模块
- `enum` - 枚举类型，常与 match-case 配合使用
- `dataclasses` - 数据类，便于模式匹配
- `typing` - 类型提示，增强匹配的可读性

### 第三方库
- `pydantic` - 数据验证库，支持复杂的数据匹配
- `attrs` - 类定义库，简化自定义类的匹配

## 扩展阅读

- [PEP 634 - Structural Pattern Matching](https://www.python.org/dev/peps/pep-0634/)
- [PEP 635 - Structural Pattern Matching: Motivation and Rationale](https://www.python.org/dev/peps/pep-0635/)
- [PEP 636 - Structural Pattern Matching: Tutorial](https://www.python.org/dev/peps/pep-0636/)
- [Python 官方文档 - match 语句](https://docs.python.org/3/reference/compound_stmts.html#the-match-statement)

## 相关标签

`Python` `控制流` `模式匹配` `条件语句` `结构化匹配` `Python3.10` `语法糖`