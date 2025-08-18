---
layout: doc
title: Python 装饰器详解
permalink: /docs/basics/decorators/
category: basics
tags: [装饰器, 函数, 高阶函数, 闭包, 元编程]
description: 深入理解 Python 装饰器的概念、实现原理和实际应用
author: Python 文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# Python 装饰器详解

## 📝 概述

装饰器是Python中一个强大的元编程特性，它允许我们在不修改原函数代码的前提下为函数添加额外功能。装饰器本质上是一个返回函数的函数，是闭包的一个经典应用。Python支持使用@符号直接将装饰器应用到函数，这种语法糖让代码更加简洁优雅。

## 🎯 学习目标

- 理解装饰器的基本概念和工作原理
- 掌握装饰器的定义和使用方法
- 学会处理带参数的装饰器
- 理解类装饰器的实现方式
- 掌握装饰器相关模块的使用
- 学会在实际项目中应用装饰器

## 📋 前置知识

- Python 基础语法
- 函数定义和调用
- 闭包概念
- 类和对象基础
- 高阶函数概念

## 🔍 详细内容

### 装饰器介绍

装饰器也是一个函数，它是让其他函数在不改变变动的前提下增加额外的功能。

装饰器是一个闭包，把一个函数当作参数返回一个替代版的函数，本质是一个返回函数的函数（即返回值为函数对象）。

python3支持用@符号直接将装饰器应用到函数。

装饰器工作场景：插入日志、性能测试、事务处理等等。

函数被装饰器装饰过后，此函数的属性均已发生变化，如名称变为装饰器的名称。

#### 1. 简单的装饰器

**1.1. 被装饰的函数不带参数**

```python
"""入门装饰器：函数功能不带参数"""
def my_decorator(func):
    def inner():
        print("**********")
        print("要添加的功能代码")
        func()
    return inner

# script1()函数调用装饰器的第一种方法
def script1():
    print("测试")
runScript1 = my_decorator(script1)    # 运行script()函数的同时添加有my_decorator()函数的功能
runScript1()

# script1()函数调用装饰器的第二种方法：使用@符号，简单明了
@my_decorator
def script1():
    print("测试")
script1()
```

**1.2. 被装饰的函数带参数**

可变参数args和关键字参数*kwargs添加函数通用的装饰器

```python
"""入门装饰器：函数带参数"""
def my_decorator(func):
    def inner(*args, **kwargs):     # 可变参数*args和关键字参数**kwargs
        print("**********")
        print("要添加的功能代码")
        func(*args, **kwargs)
    return inner

# script2()函数调用装饰器的第一种方法：了解即可
def script2(arg):
    print("测试：%s" % arg)
runScript2 = my_decorator(script2)
runScript2("aaa")

# script2()函数调用装饰器的第二种方法：使用@符号，目前使用此方法
@my_decorator
def script2(arg):
    print("测试：%s" % arg)
script2("aaa")
```

### 2. 装饰器带参数

```python
"""装饰器：装饰器带参数"""
def my_decorator(name):
    def outer(func):
        def inner(*args, **kwargs):
            print("********")
            print("添加带装饰器参数%s的功能代码" % name)
            func(*args, **kwargs)
        return inner
    return outer

@my_decorator(name='settings')
def script3(arg):
    print("测试----%s" % arg)
script3("bbb")
```

### 3. 基于类封装的装饰器

`__call__()`方法是将实例成为一个可调用对象（即callable对象），同时不影响实例的构造，但可以改变实例的内部值。

**3.1. 基于类封装的不带参数装饰器**

通过类封装装饰器的实现方法：先通过构造函数`__init__()`传入函数；再通过`__call__`方法重载，并返回一个函数。

```python
"""基于类封装的不带参数装饰器"""
import functools

class MyDecorator:
    def __init__(self, func):
        functools.update_wrapper(self, func)
        self.func = func

    def __call__(self, *args, **kwargs):
        print("********")
        print("类装饰器：添加功能代码")
        return self.func(*args, **kwargs)

@MyDecorator
def script4(arg):
    print("测试----%s" % arg)
script4("ccc")
```

**3.2. 基于类封装的带参数装饰器**

```python
"""基于类封装的带参数装饰器"""
import functools

class MyDecoratorWithArgs:
    def __init__(self, name):
        self.name = name

    def __call__(self, func):
        functools.update_wrapper(self, func)
        def wrapper(*args, **kwargs):
            print("********")
            print("类装饰器带参数%s：添加功能代码" % self.name)
            return func(*args, **kwargs)
        return wrapper

@MyDecoratorWithArgs(name='settings')
def script5(arg):
    print("测试----%s" % arg)
script5("ddd")
```

### 类中使用装饰器

#### 类中使用外部装饰器

```python
from functools import wraps

def ensure_running_state(method):
    @wraps(method)
    def wrapper(self, *args, **kwargs):
        with self.mutex:
            self.running = True
        result = method(self, *args, **kwargs)
        with self.mutex:
            self.running = False
        return result
    return wrapper

class OpenMap(QThread):
    mes = pyqtSignal(list)

    def __init__(self, load, parent=None):
        super(OpenMap, self).__init__(parent)
        self.load = load
        self.position = []
        self.mutex = QMutex()
        self.running = False

    @ensure_running_state
    def run(self):
        try:
            if self.load[-4:] == 'mooe':
                with open(self.load, 'r', encoding='utf-8') as fr:
                    mLaneMarks = json.load(fr).get('mLaneMarks', [])
                for i in mLaneMarks:
                    mLaneMarksName = i.get('mLaneMarkName', '-1')
                    mlaneMarkType = i.get('mLaneMarkType', '-1')
                    mLaneMarkID = i.get('mLaneMarkID', '-1')
                    if mLaneMarksName == '':
                        continue
                    if mlaneMarkType in [11, 2] and mLaneMarksName[-1] not in ['点', '检']:
                        self.position.append({"mLaneMarkName": mLaneMarksName, "mLaneMarkID": mLaneMarkID})
                if self.position:
                    self.mes.emit(self.position)
                else:
                    self.mes.emit(["文件为空"])
            else:
                self.mes.emit(["文件格式错误"])
        except Exception as e:
            print(e)
            self.mes.emit(["文件解析失败"])
```

#### 类中使用内部装饰器

```python
from functools import wraps

class OpenMap(QThread):
    mes = pyqtSignal(list)

    def __init__(self, load, parent=None):
        super(OpenMap, self).__init__(parent)
        self.load = load
        self.position = []
        self.mutex = QMutex()
        self.running = False

    def ensure_running_state(method):
        @wraps(method)
        def wrapper(self, *args, **kwargs):
            with self.mutex:
                self.running = True
            result = method(self, *args, **kwargs)
            with self.mutex:
                self.running = False
            return result
        return wrapper

    @ensure_running_state
    def run(self):
        try:
            if self.load[-4:] == 'mooe':
                with open(self.load, 'r', encoding='utf-8') as fr:
                    mLaneMarks = json.load(fr).get('mLaneMarks', [])
                for i in mLaneMarks:
                    mLaneMarksName = i.get('mLaneMarkName', '-1')
                    mlaneMarkType = i.get('mLaneMarkType', '-1')
                    mLaneMarkID = i.get('mLaneMarkID', '-1')
                    if mLaneMarksName == '':
                        continue
                    if mlaneMarkType in [11, 2] and mLaneMarksName[-1] not in ['点', '检']:
                        self.position.append({"mLaneMarkName": mLaneMarksName, "mLaneMarkID": mLaneMarkID})
                if self.position:
                    self.mes.emit(self.position)
                else:
                    self.mes.emit(["文件为空"])
            else:
                self.mes.emit(["文件格式错误"])
        except Exception as e:
            print(e)
            self.mes.emit(["文件解析失败"])
```

## 💡 实际应用

### 装饰器相关模块使用

- **wraps**：该模块提供了一个函数，可以将装饰器的属性复制到被装饰的函数上。
- **cached_property**：该模块提供了一个装饰器，用于缓存函数的返回值。
- **singleton**：该模块提供了一个装饰器，用于创建单例模式。
- **contextlib**：该模块提供了一个装饰器，用于在函数执行期间启用或禁用某些功能。

#### wraps

**wraps** 模块中的 `wraps()` 函数可以将装饰器的属性复制到被装饰的函数上。这对于保持被装饰函数的元数据（如名称、参数类型等）完整很有用。

```python
from functools import wraps

def log(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print("Calling function:", func.__name__)
        return func(*args, **kwargs)
    return wrapper

@log
def target():
    print("Hello, world!")

target()
```

这段代码将 `log()` 函数作为装饰器应用到 `target()` 函数上。 `log()` 函数使用 `wraps()` 函数将 `target()` 函数的名称复制到包装函数上。因此，在调用 `target()` 函数时，会打印以下消息：

```
Calling function: target
Hello, world!
```

`wraps()` 函数是 Python 中一个非常实用的工具。它可以帮助您更轻松地使用装饰器。

#### cached_property

**cached_property** 模块中的 `cached_property()` 装饰器用于缓存函数的返回值。这对于提高函数的性能很有用。

```python
import cached_property

class MyClass():
    @cached_property
    def property(self):
        # 计算函数
        return 1 + 2

my_class = MyClass()
print(my_class.property)
print(my_class.property)
```

这段代码将 `cached_property()` 装饰器应用到 `MyClass.property()` 属性上。 `cached_property()` 装饰器将缓存 `property()` 属性的返回值。因此，第二次调用 `property()` 属性时，将直接返回缓存的值，而不会重新计算。

#### singleton

**singleton** 模块中的 `singleton()` 装饰器用于创建单例模式。这对于确保程序中的某些对象只能有一个实例很有用。

```python
import singleton

@singleton
class MyClass():
    pass

my_class1 = MyClass()
my_class2 = MyClass()

print(my_class1 is my_class2)
```

这段代码将 `singleton()` 装饰器应用到 `MyClass` 类上。 `singleton()` 装饰器将确保 `MyClass` 类的所有实例都指向同一个对象。因此，`my_class1` 和 `my_class2` 都是同一个对象。

#### contextlib

`contextmanager()` 装饰器用于将一个普通函数转换为一个上下文管理器。上下文管理器是一种特殊的函数，可以使用 `with` 语句来管理资源的使用。

```python
from contextlib import contextmanager

@contextmanager
def open_file(filename):
    # 打开文件
    file = open(filename, "r")
    try:
        yield file
    finally:
        # 关闭文件
        file.close()

with open_file("example.txt") as f:
    print(f.read())
```

这段代码将 `contextmanager()` 装饰器应用到 `open_file()` 函数上。 `open_file()` 函数将在执行期间打开一个文件，并在函数执行结束后关闭该文件。

### property装饰器详解

在 Python 中，property() 函数用于将一个普通函数转换为一个属性。属性是一种特殊的对象，可以像普通变量一样访问和修改。

#### 使用@property装饰器

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius  # 使用带有下划线的名称表示这是一个私有属性

    @property
    def radius(self):
        """Getter method for the radius."""
        return self._radius

    @radius.setter
    def radius(self, value):
        """Setter method for the radius."""
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value

    @property
    def area(self):
        """Calculate and return the area of the circle."""
        return 3.14 * self._radius ** 2

# 创建 Circle 实例
my_circle = Circle(radius=5)

# 使用 getter 方法获取半径
print(my_circle.radius)  # 输出: 5

# 使用 setter 方法设置半径
my_circle.radius = 7

# 使用 getter 方法获取半径
print(my_circle.radius)  # 输出: 7

# 使用 getter 方法获取面积
print(my_circle.area)    # 输出: 153.86
```

#### property()函数用法

```python
class Student:
    def __init__(self):
        self._age = None

    def get_age(self):
        print('获取属性时执行的代码')
        return self._age

    def set_age(self, age):
        print('设置属性时执行的代码')
        self._age = age

    def del_age(self):
        print('删除属性时执行的代码')
        del self._age

    age = property(get_age, set_age, del_age, '学生年龄')

student = Student()
# 注意要用 类名.属性.__doc__ 的形式查看属性的文档字符串
print('查看属性的文档字符串：' + Student.age.__doc__)

# 设置属性
student.age = 18

# 获取属性
print('学生年龄为：' + str(student.age))

# 删除属性
del student.age
```

## ⚠️ 注意事项

- 可以省略设置属性值的方法，此时该属性变成只读属性
- 如果报错 RecursionError，很可能是对象属性名和 @property 装饰的方法名重名了
- 一般会在对象属性名前加一个下划线 _ 避免重名，并且表明这是一个受保护的属性
- 使用 `wraps` 装饰器时，确保在装饰器内部函数定义之前使用
- 装饰器会改变被装饰函数的属性，如名称、文档字符串等

## 🔗 相关内容

- [函数定义与调用](../functions/) - 函数基础
- [函数作用域与闭包](../function-scope/) - 闭包概念
- [类的定义与使用](../class-definition/) - 类方法和静态方法装饰器
- [with 语句](../with/) - contextmanager装饰器

## 📚 扩展阅读

- [Python 官方文档 - 装饰器](https://docs.python.org/3/glossary.html#term-decorator)
- [PEP 318 - Decorators for Functions and Methods](https://www.python.org/dev/peps/pep-0318/)
- [Real Python - Python Decorators](https://realpython.com/primer-on-python-decorators/)
- [functools 模块文档](https://docs.python.org/3/library/functools.html)

## 🏷️ 标签

`装饰器` `函数` `高阶函数` `闭包` `元编程` `property` `wraps` `contextmanager`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档团队  
**版本**: 1.0