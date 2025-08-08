---
layout: doc
title: type() - 类型函数
permalink: /docs/builtins/type/
category: builtins
tags: [类型检查, 对象, 元类]
description: 返回对象的类型或创建新的类型对象
author: Python 文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# type() - 类型函数

## 📝 概述

`type()` 是 Python 中的内置函数，具有两种主要用法：作为单参数函数时返回对象的类型，作为三参数函数时可以动态创建新的类型对象。它是 Python 类型系统和元编程的重要工具。<mcreference link="https://docs.python.org/3/library/functions.html" index="1">1</mcreference>

## 🎯 学习目标

- 掌握 type()函数的两种用法
- 理解 type()与 isinstance()的区别
- 学会使用 type()进行类型检查
- 了解动态创建类的方法

## 📋 前置知识

- Python 基本数据类型
- 类和对象的概念
- 继承的基本理解
- 元类的初步概念

## 🔍 详细内容

### 基本概念

`type()` 函数有两种形式：
1. `type(object)` - 返回对象的类型
2. `type(name, bases, dict)` - 创建新的类型对象

### 语法格式

```python
## 获取对象类型
type(object)

## 创建新类型
type(name, bases, dict, **kwds)
```

### 参数说明

#### 单参数形式
| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| object | any | 是 | 无 | 要检查类型的对象 |

#### 三参数形式
| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| name | str | 是 | 无 | 类的名称 |
| bases | tuple | 是 | 无 | 基类元组 |
| dict | dict | 是 | 无 | 类的命名空间字典 |
| **kwds | any | 否 | 无 | 传递给元类的关键字参数 |

### 返回值

| 类型 | 说明 |
|------|------|
| type | 对象的类型或新创建的类型对象 |

## 💡 实际应用

### 基础用法

```python
## 获取基本数据类型
print(type(42))          # <class 'int'>
print(type(3.14))        # <class 'float'>
print(type("hello"))     # <class 'str'>
print(type([1, 2, 3]))   # <class 'list'>
print(type({"a": 1}))    # <class 'dict'>

## 获取自定义类的类型
class Person:
    def __init__(self, name):
        self.name = name

person = Person("张三")
print(type(person))      # <class '__main__.Person'>
print(type(Person))      # <class 'type'>

## 类型比较
if type(person) == Person:
    print("person 是 Person 类的实例")
```

### 高级用法

```python
## type()与 isinstance()的区别
class Animal:
    pass

class Dog(Animal):
    pass

dog = Dog()

## type()不考虑继承关系
print(type(dog) == Dog)     # True
print(type(dog) == Animal)  # False

## isinstance()考虑继承关系
print(isinstance(dog, Dog))     # True
print(isinstance(dog, Animal))  # True

## 动态创建类
def init_method(self, name):
    self.name = name

def say_hello(self):
    return f"Hello, I'm {self.name}"

## 使用 type()创建类
Student = type('Student', (), {
    '__init__': init_method,
    'say_hello': say_hello,
    'school': '清华大学'  # 类属性
})

## 使用动态创建的类
student = Student("李四")
print(student.say_hello())  # Hello, I'm 李四
print(student.school)       # 清华大学
```

### 实际案例

```python
## 类型检查装饰器
def type_check(*expected_types):
    """类型检查装饰器"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            for i, arg in enumerate(args):
                if i < len(expected_types):
                    expected_type = expected_types[i]
                    if type(arg) != expected_type:
                        raise TypeError(
                            f"参数 {i+1} 期望类型 {expected_type.__name__}, "
                            f"实际类型 {type(arg).__name__}"
                        )
            return func(*args, **kwargs)
        return wrapper
    return decorator

## 使用类型检查装饰器
@type_check(str, int)
def greet(name, age):
    return f"你好,{name},你今年{age}岁"

## 正确调用
print(greet("张三", 25))  # 你好,张三,你今年 25 岁

## 错误调用会抛出异常
## greet(123, "25")  # TypeError

## 动态工厂模式
def create_data_class(class_name, fields):
    """动态创建数据类"""
    def __init__(self, **kwargs):
        for field in fields:
            setattr(self, field, kwargs.get(field))
    
    def __repr__(self):
        field_strs = [f"{field}={getattr(self, field, None)}" 
                     for field in fields]
        return f"{class_name}({', '.join(field_strs)})"
    
    def to_dict(self):
        return {field: getattr(self, field, None) for field in fields}
    
#    # 动态创建类
    return type(class_name, (), {
        '__init__': __init__,
        '__repr__': __repr__,
        'to_dict': to_dict,
        '_fields': fields
    })

## 使用动态工厂
Book = create_data_class('Book', ['title', 'author', 'price'])
book = Book(title="Python 编程", author="张三", price=59.9)
print(book)  # Book(title=Python 编程, author=张三, price=59.9)
print(book.to_dict())  # {'title': 'Python 编程', 'author': '张三', 'price': 59.9}
```

## ⚠️ 注意事项

- `type()` 进行严格的类型检查，不考虑继承关系
- 对于类型检查，通常推荐使用 `isinstance()` 而不是 `type()`
- 动态创建类时要注意命名空间和作用域问题
- `type()` 返回的是类型对象本身，而不是类型名称字符串

```python
## 常见误区
class Parent:
    pass

class Child(Parent):
    pass

child = Child()

## 错误的类型检查方式(不推荐)
if type(child) == Parent:
    print("是 Parent 类型")  # 这不会执行

## 正确的类型检查方式(推荐)
if isinstance(child, Parent):
    print("是 Parent 类型或其子类")  # 这会执行

## 获取类型名称
print(type(child).__name__)  # 'Child'
print(str(type(child)))      # "<class '__main__.Child'>"
```

## 🔗 相关内容

- [isinstance() - 实例检查函数](../isinstance/)
- [issubclass() - 子类检查函数](../issubclass/)
- [hasattr() - 属性检查函数](../hasattr/)

## 📚 扩展阅读

- [Python 官方文档 - type()](https://docs.python.org/3/library/functions.html#type)
- [Python 数据模型 - 元类](https://docs.python.org/3/reference/datamodel.html#metaclasses)
- [Python 类型系统详解](https://docs.python.org/3/library/typing.html)

## 🏷️ 标签

`类型检查` `对象` `元类` `动态创建` `反射`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档工程师  
**版本**: 1.0