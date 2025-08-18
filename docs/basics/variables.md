---
layout: doc
title: 变量与数据类型
permalink: /docs/basics/variables/
category: basics
tags: [变量, 数据类型, 基础语法]
description: Python 变量定义、基本数据类型和类型转换的完整指南
author: Python 文档团队
date: 2024-01-01
updated: 2024-01-01
version: 1.0
difficulty: "初级"
---

# 变量与数据类型

## 📝 概述

变量是编程的基础概念，用于存储和操作数据。Python 提供了丰富的数据类型，包括数字、字符串、布尔值等基本类型，以及列表、字典等复合类型。

## 🎯 学习目标

- 理解变量的概念和命名规则
- 掌握 Python 的基本数据类型
- 学会进行类型转换和类型检查
- 了解可变和不可变对象的区别

## 📋 前置知识

- Python 基本语法
- 了解计算机内存的概念

## 🔍 详细内容

### 变量定义

在 Python 中，变量不需要声明类型，直接赋值即可创建。

```python
## 变量赋值
name = "Python"
age = 30
height = 1.75
is_student = True
```

### 变量命名规则

| 规则 | 说明 | 示例 |
|------|------|------|
| 字母开头 | 必须以字母或下划线开头 | `name`, `_private` |
| 字母数字下划线 | 只能包含字母、数字、下划线 | `user_name`, `age2` |
| 区分大小写 | 大小写敏感 | `Name` ≠ `name` |
| 不能是关键字 | 不能使用 Python 保留字 | 不能用 `if`, `for` 等 |

### 基本数据类型

#### 数字类型

```python
## 整数 (int)
count = 42
negative = -10
big_number = 1000000

## 浮点数 (float)
pi = 3.14159
temperature = -5.5
scientific = 1.5e-4  # 科学计数法

## 复数 (complex)
complex_num = 3 + 4j
print(complex_num.real)  # 实部: 3.0
print(complex_num.imag)  # 虚部: 4.0
```

#### 字符串类型

```python
## 字符串 (str)
single_quote = 'Hello'
double_quote = "World"
multi_line = """这是一个
多行字符串"""

## 字符串格式化
name = "Alice"
age = 25
message = f"我是{name},今年{age}岁"  # f-string
print(message)  # 输出: 我是 Alice,今年 25 岁
```

#### 布尔类型

```python
## 布尔值 (bool)
is_active = True
is_finished = False

## 布尔运算
result = True and False  # False
result = True or False   # True
result = not True        # False
```

### 复合数据类型

#### 列表 (List)

```python
## 列表 - 可变、有序
fruits = ["苹果", "香蕉", "橙子"]
numbers = [1, 2, 3, 4, 5]
mixed = ["文本", 42, True, 3.14]

## 列表操作
fruits.append("葡萄")     # 添加元素
fruits[0] = "红苹果"      # 修改元素
print(len(fruits))        # 获取长度
```

#### 元组 (Tuple)

```python
## 元组 - 不可变、有序
coordinates = (10, 20)
colors = ("红", "绿", "蓝")
single_item = (42,)  # 单元素元组需要逗号

## 元组解包
x, y = coordinates
print(f"坐标: ({x}, {y})")  # 输出: 坐标: (10, 20)
```

#### 字典 (Dictionary)

```python
## 字典 - 可变、无序(Python 3.7+保持插入顺序)
student = {
    "name": "张三",
    "age": 20,
    "grade": "A"
}

## 字典操作
student["major"] = "计算机科学"  # 添加键值对
print(student["name"])           # 访问值
print(student.get("phone", "未提供"))  # 安全访问
```

#### 集合 (Set)

```python
## 集合 - 可变、无序、不重复
unique_numbers = {1, 2, 3, 4, 5}
colors = {"红", "绿", "蓝"}

## 集合操作
unique_numbers.add(6)        # 添加元素
unique_numbers.remove(1)     # 删除元素
print(3 in unique_numbers)   # 成员检查
```

### 类型转换

```python
## 显式类型转换
num_str = "123"
num_int = int(num_str)      # 字符串转整数
num_float = float(num_str)  # 字符串转浮点数

## 数字转字符串
age = 25
age_str = str(age)

## 列表和元组互转
list_data = [1, 2, 3]
tuple_data = tuple(list_data)  # 列表转元组
back_to_list = list(tuple_data)  # 元组转列表
```

### 类型检查

```python
## 检查变量类型
value = 42
print(type(value))           # <class 'int'>
print(isinstance(value, int)) # True

## 检查多种类型
print(isinstance(value, (int, float)))  # True
```

## 💡 实际应用

### 基础用法

```python
## 用户信息管理
def create_user_profile():
    """创建用户档案"""
    profile = {
        "username": input("请输入用户名: "),
        "age": int(input("请输入年龄: ")),
        "hobbies": [],
        "is_active": True
    }
    return profile

## 使用示例
user = create_user_profile()
print(f"用户 {user['username']} 创建成功！")
```

### 高级用法

```python
## 数据验证和转换
def validate_and_convert(data):
    """验证并转换数据类型"""
    result = {}
    
#    # 处理年龄
    if 'age' in data:
        try:
            result['age'] = int(data['age'])
            if result['age'] < 0 or result['age'] > 150:
                raise ValueError("年龄必须在 0-150 之间")
        except ValueError as e:
            print(f"年龄转换错误: {e}")
            result['age'] = None
    
#    # 处理邮箱列表
    if 'emails' in data:
        if isinstance(data['emails'], str):
            result['emails'] = [data['emails']]
        elif isinstance(data['emails'], list):
            result['emails'] = data['emails']
        else:
            result['emails'] = []
    
    return result
```

### 实际案例

```python
## 学生成绩管理系统
class StudentGradeManager:
    """学生成绩管理系统"""
    
    def __init__(self):
        self.students = {}  # 字典存储学生信息
    
    def add_student(self, student_id, name, grades=None):
        """添加学生"""
        if grades is None:
            grades = []
        
        self.students[student_id] = {
            'name': str(name),
            'grades': list(grades),
            'average': 0.0
        }
        self._calculate_average(student_id)
    
    def add_grade(self, student_id, grade):
        """添加成绩"""
        if student_id in self.students:
            try:
                grade = float(grade)
                if 0 <= grade <= 100:
                    self.students[student_id]['grades'].append(grade)
                    self._calculate_average(student_id)
                else:
                    print("成绩必须在 0-100 之间")
            except ValueError:
                print("成绩必须是数字")
        else:
            print("学生不存在")
    
    def _calculate_average(self, student_id):
        """计算平均分"""
        grades = self.students[student_id]['grades']
        if grades:
            self.students[student_id]['average'] = sum(grades) / len(grades)
        else:
            self.students[student_id]['average'] = 0.0
    
    def get_student_info(self, student_id):
        """获取学生信息"""
        return self.students.get(student_id, None)

## 使用示例
manager = StudentGradeManager()
manager.add_student("001", "张三", [85, 90, 78])
manager.add_grade("001", 92)
print(manager.get_student_info("001"))
```

## ⚠️ 注意事项

- **可变 vs 不可变**: 字符串、数字、元组是不可变的；列表、字典、集合是可变的
- **变量作用域**: 注意全局变量和局部变量的区别
- **内存管理**: Python 自动管理内存，但要注意循环引用
- **类型提示**: 建议使用类型提示提高代码可读性

```python
## 类型提示示例
def calculate_area(length: float, width: float) -> float:
    """计算矩形面积"""
    return length * width
```

## 🔗 相关内容

- [控制流程](../control-flow/) - 学习如何使用变量进行条件判断
- [函数定义](../functions/) - 了解变量在函数中的作用域
- [内置函数](../builtins/) - 学习操作不同数据类型的内置函数

## 📚 扩展阅读

- [Python 数据模型官方文档](https://docs.python.org/3/reference/datamodel.html)
- [PEP 484 - 类型提示](https://www.python.org/dev/peps/pep-0484/)
- [Python 内存管理机制](https://docs.python.org/3/c-api/memory.html)

## 🏷️ 标签

`变量` `数据类型` `基础语法` `类型转换` `内存管理`

---

**最后更新**: 2024-01-01  
**作者**: Python 文档团队  
**版本**: 1.0