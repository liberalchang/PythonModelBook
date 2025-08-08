---
layout: page
title: 魔术方法
permalink: /docs/basics/magic-methods/
category: basics
tags: [Python, 面向对象, 魔术方法, 特殊方法]
author: Python 学习指南
date: 2024-01-01
---

# Python 魔术方法详解

魔术方法（Magic Methods），也称为特殊方法（Special Methods）或双下划线方法（Dunder Methods），是 Python 中以双下划线开头和结尾的特殊方法。这些方法定义了对象在特定操作下的行为，是 Python 面向对象编程的核心机制之一。

## 📚 学习目标

通过本章学习，你将能够：

- 理解魔术方法的概念和作用机制
- 掌握常用魔术方法的使用方法
- 学会自定义对象的特殊行为
- 实现对象的运算符重载
- 控制对象的生命周期和表示形式

## 🔍 魔术方法概述

### 什么是魔术方法

魔术方法是 Python 中以双下划线`__`包裹的特殊方法，它们定义了对象在特定操作下的行为。当我们对对象执行某些操作时，Python 会自动调用相应的魔术方法。

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __str__(self):
        return f"Point({self.x}, {self.y})"
    
    def __add__(self, other):
        return Point(self.x + other.x, self.y + other.y)

## 创建对象时自动调用 __init__
p1 = Point(1, 2)

## 打印对象时自动调用 __str__
print(p1)  # 输出: Point(1, 2)

## 对象相加时自动调用 __add__
p2 = Point(3, 4)
p3 = p1 + p2  # 自动调用 p1.__add__(p2)
print(p3)  # 输出: Point(4, 6)
```

## 🏗️ 对象创建和销毁

### `__new__` - 对象构造

`__new__`方法负责创建对象实例，在`__init__`之前调用。

```python
class Person:
    def __new__(cls, name):
        print(f"创建 {name} 的实例")
#        # 必须返回实例对象
        return super().__new__(cls)
    
    def __init__(self, name):
        print(f"初始化 {name}")
        self.name = name

## 创建对象
p = Person("张三")
## 输出:
## 创建 张三 的实例
## 初始化 张三
```

### `__init__` - 对象初始化

`__init__`方法在对象创建后立即调用，用于初始化对象属性。

```python
class Student:
    def __init__(self, name, age, grade):
        """初始化学生对象"""
        self.name = name
        self.age = age
        self.grade = grade
        print(f"学生 {name} 初始化完成")

## 创建学生对象
student = Student("李四", 18, "高三")
```

### `__del__` - 对象销毁

`__del__`方法在对象被垃圾回收时调用，用于清理资源。

```python
class FileManager:
    def __init__(self, filename):
        self.filename = filename
        self.file = open(filename, 'w')
        print(f"打开文件: {filename}")
    
    def __del__(self):
        if hasattr(self, 'file') and not self.file.closed:
            self.file.close()
            print(f"关闭文件: {self.filename}")

## 使用示例
fm = FileManager("test.txt")
del fm  # 手动删除,触发 __del__
```

## 🎭 对象表示

### `__str__` - 用户友好的字符串表示

`__str__`方法定义对象的字符串表示，主要面向最终用户。

```python
class Book:
    def __init__(self, title, author, price):
        self.title = title
        self.author = author
        self.price = price
    
    def __str__(self):
        return f"《{self.title}》 - {self.author} (¥{self.price})"

book = Book("Python 编程", "张三", 89.9)
print(book)  # 输出: 《Python 编程》 - 张三 (¥89.9)
```

### `__repr__` - 开发者友好的字符串表示

`__repr__`方法定义对象的"官方"字符串表示，主要面向开发者。

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def __str__(self):
        return f"{self.name} is {self.age} years old"
    
    def __repr__(self):
        return f"Person('{self.name}', {self.age})"

p = Person("Alice", 25)
print(str(p))   # 输出: Alice is 25 years old
print(repr(p))  # 输出: Person('Alice', 25)
```

## 🔢 数值运算

### 算术运算符重载

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __str__(self):
        return f"Vector({self.x}, {self.y})"
    
    def __add__(self, other):
        """加法运算"""
        return Vector(self.x + other.x, self.y + other.y)
    
    def __sub__(self, other):
        """减法运算"""
        return Vector(self.x - other.x, self.y - other.y)
    
    def __mul__(self, scalar):
        """标量乘法"""
        return Vector(self.x * scalar, self.y * scalar)
    
    def __truediv__(self, scalar):
        """标量除法"""
        return Vector(self.x / scalar, self.y / scalar)

## 使用示例
v1 = Vector(3, 4)
v2 = Vector(1, 2)

print(v1 + v2)  # 输出: Vector(4, 6)
print(v1 - v2)  # 输出: Vector(2, 2)
print(v1 * 2)   # 输出: Vector(6, 8)
print(v1 / 2)   # 输出: Vector(1.5, 2.0)
```

## 🔍 比较运算

### 比较运算符重载

```python
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score
    
    def __str__(self):
        return f"{self.name}({self.score}分)"
    
    def __eq__(self, other):
        """等于比较"""
        return self.score == other.score
    
    def __lt__(self, other):
        """小于比较"""
        return self.score < other.score
    
    def __le__(self, other):
        """小于等于比较"""
        return self.score <= other.score
    
    def __gt__(self, other):
        """大于比较"""
        return self.score > other.score
    
    def __ge__(self, other):
        """大于等于比较"""
        return self.score >= other.score

## 使用示例
s1 = Student("张三", 85)
s2 = Student("李四", 92)

print(s1 < s2)   # True
print(s1 == s2)  # False
print(s2 > s1)   # True

## 可以直接排序
students = [s1, s2, Student("王五", 78)]
students.sort()
for student in students:
    print(student)
```

## 📦 容器行为

### `__len__` - 长度获取

```python
class Playlist:
    def __init__(self):
        self.songs = []
    
    def add_song(self, song):
        self.songs.append(song)
    
    def __len__(self):
        return len(self.songs)
    
    def __str__(self):
        return f"播放列表({len(self)}首歌曲)"

playlist = Playlist()
playlist.add_song("歌曲 1")
playlist.add_song("歌曲 2")

print(len(playlist))  # 输出: 2
print(playlist)       # 输出: 播放列表(2 首歌曲)
```

### `__getitem__` 和 `__setitem__` - 索引访问

```python
class Matrix:
    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols
        self.data = [[0] * cols for _ in range(rows)]
    
    def __getitem__(self, key):
        """获取元素"""
        row, col = key
        return self.data[row][col]
    
    def __setitem__(self, key, value):
        """设置元素"""
        row, col = key
        self.data[row][col] = value
    
    def __str__(self):
        return '\n'.join([' '.join(map(str, row)) for row in self.data])

## 使用示例
matrix = Matrix(3, 3)
matrix[0, 0] = 1
matrix[1, 1] = 2
matrix[2, 2] = 3

print(matrix[0, 0])  # 输出: 1
print(matrix)
## 输出:
## 1 0 0
## 0 2 0
## 0 0 3
```

## 🎯 其他重要魔术方法

### `__call__` - 可调用对象

```python
class Multiplier:
    def __init__(self, factor):
        self.factor = factor
    
    def __call__(self, value):
        return value * self.factor

## 创建乘法器
double = Multiplier(2)
triple = Multiplier(3)

## 像函数一样调用对象
print(double(5))  # 输出: 10
print(triple(4))  # 输出: 12
```

### `__bool__` - 布尔值转换

```python
class BankAccount:
    def __init__(self, balance=0):
        self.balance = balance
    
    def __bool__(self):
        """账户有余额时返回 True"""
        return self.balance > 0
    
    def __str__(self):
        return f"账户余额: ¥{self.balance}"

## 使用示例
account1 = BankAccount(100)
account2 = BankAccount(0)

if account1:
    print("账户 1 有余额")

if not account2:
    print("账户 2 没有余额")
```

### `__hash__` - 哈希值计算

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def __hash__(self):
        return hash((self.name, self.age))
    
    def __eq__(self, other):
        if isinstance(other, Person):
            return self.name == other.name and self.age == other.age
        return False
    
    def __str__(self):
        return f"{self.name}({self.age}岁)"

## 使用示例
p1 = Person("张三", 25)
p2 = Person("张三", 25)
p3 = Person("李四", 30)

## 可以作为字典键或集合元素
people_set = {p1, p2, p3}  # p1 和 p2 被认为是同一个人
print(f"集合中有 {len(people_set)} 个不同的人")  # 输出: 2
```

## 🎨 实际应用案例

### 案例 1：自定义数字类

```python
class Money:
    """货币类,支持各种运算"""
    
    def __init__(self, amount, currency="CNY"):
        self.amount = amount
        self.currency = currency
    
    def __str__(self):
        symbols = {"CNY": "¥", "USD": "$", "EUR": "€"}
        symbol = symbols.get(self.currency, self.currency)
        return f"{symbol}{self.amount:.2f}"
    
    def __repr__(self):
        return f"Money({self.amount}, '{self.currency}')"
    
    def __add__(self, other):
        if isinstance(other, Money):
            if self.currency != other.currency:
                raise ValueError("不能直接相加不同货币")
            return Money(self.amount + other.amount, self.currency)
        return Money(self.amount + other, self.currency)
    
    def __sub__(self, other):
        if isinstance(other, Money):
            if self.currency != other.currency:
                raise ValueError("不能直接相减不同货币")
            return Money(self.amount - other.amount, self.currency)
        return Money(self.amount - other, self.currency)
    
    def __mul__(self, factor):
        return Money(self.amount * factor, self.currency)
    
    def __truediv__(self, divisor):
        return Money(self.amount / divisor, self.currency)
    
    def __eq__(self, other):
        return (isinstance(other, Money) and 
                self.amount == other.amount and 
                self.currency == other.currency)
    
    def __lt__(self, other):
        if isinstance(other, Money) and self.currency == other.currency:
            return self.amount < other.amount
        raise ValueError("无法比较不同货币")
    
    def __bool__(self):
        return self.amount > 0

## 使用示例
price1 = Money(99.99)
price2 = Money(50.00)

print(f"商品 1: {price1}")  # 输出: 商品 1: ¥99.99
print(f"商品 2: {price2}")  # 输出: 商品 2: ¥50.00
print(f"总价: {price1 + price2}")  # 输出: 总价: ¥149.99
print(f"差价: {price1 - price2}")  # 输出: 差价: ¥49.99
print(f"打 8 折: {price1 * 0.8}")  # 输出: 打 8 折: ¥79.99
```

### 案例 2：智能列表类

```python
class SmartList:
    """智能列表,提供额外功能"""
    
    def __init__(self, items=None):
        self.items = list(items) if items else []
    
    def __str__(self):
        return f"SmartList({self.items})"
    
    def __len__(self):
        return len(self.items)
    
    def __getitem__(self, index):
        return self.items[index]
    
    def __setitem__(self, index, value):
        self.items[index] = value
    
    def __contains__(self, item):
        return item in self.items
    
    def __iter__(self):
        return iter(self.items)
    
    def __add__(self, other):
        if isinstance(other, SmartList):
            return SmartList(self.items + other.items)
        elif isinstance(other, list):
            return SmartList(self.items + other)
        else:
            return SmartList(self.items + [other])
    
    def __bool__(self):
        return len(self.items) > 0
    
    def append(self, item):
        self.items.append(item)
    
    def remove(self, item):
        self.items.remove(item)
    
    @property
    def unique(self):
        """获取去重后的列表"""
        return SmartList(list(set(self.items)))
    
    @property
    def reversed(self):
        """获取反转后的列表"""
        return SmartList(self.items[::-1])

## 使用示例
smart_list = SmartList([1, 2, 3, 2, 4, 3])
print(f"原列表: {smart_list}")
print(f"长度: {len(smart_list)}")
print(f"包含 2: {2 in smart_list}")
print(f"去重: {smart_list.unique}")
print(f"反转: {smart_list.reversed}")

## 列表操作
smart_list += [5, 6]
print(f"添加后: {smart_list}")
```

## 📝 最佳实践

### 1. 魔术方法的一致性

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __eq__(self, other):
        if isinstance(other, Point):
            return self.x == other.x and self.y == other.y
        return False
    
    def __hash__(self):
#        # 如果实现了__eq__,通常也要实现__hash__
        return hash((self.x, self.y))
    
    def __str__(self):
        return f"Point({self.x}, {self.y})"
    
    def __repr__(self):
#        # __repr__应该返回可以重新创建对象的字符串
        return f"Point({self.x}, {self.y})"
```

### 2. 错误处理

```python
class SafeList:
    def __init__(self, items=None):
        self.items = list(items) if items else []
    
    def __getitem__(self, index):
        try:
            return self.items[index]
        except IndexError:
            return None  # 返回 None 而不是抛出异常
    
    def __setitem__(self, index, value):
#        # 自动扩展列表
        while len(self.items) <= index:
            self.items.append(None)
        self.items[index] = value
```

### 3. 性能考虑

```python
class EfficientContainer:
    def __init__(self):
        self._items = []
        self._length = 0  # 缓存长度
    
    def __len__(self):
        return self._length  # 直接返回缓存的长度
    
    def append(self, item):
        self._items.append(item)
        self._length += 1  # 更新缓存
    
    def remove(self, item):
        self._items.remove(item)
        self._length -= 1  # 更新缓存
```

## 🔗 扩展阅读

- [Python 官方文档 - 特殊方法](https://docs.python.org/3/reference/datamodel.html#special-method-names)
- [Python 魔术方法完整列表](https://docs.python.org/3/reference/datamodel.html)
- [运算符重载最佳实践](https://docs.python.org/3/reference/datamodel.html#emulating-numeric-types)
- [容器类型的实现](https://docs.python.org/3/reference/datamodel.html#emulating-container-types)

---

魔术方法是 Python 面向对象编程的强大工具，通过合理使用这些方法，可以让自定义类的行为更加自然和直观。记住要保持方法之间的一致性，并考虑性能和错误处理。