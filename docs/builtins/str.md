---
layout: doc
title: str() - 字符串转换函数
permalink: /docs/builtins/str/
category: builtins
tags: [类型转换, 字符串, 文本处理]
description: 将值转换为字符串类型或创建字符串对象
author: Python 文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "初级"
---

# str() - 字符串转换函数

## 📝 概述

`str()` 是 Python 中的内置函数，用于将各种数据类型转换为字符串，或者创建新的字符串对象。它是最常用的类型转换函数之一，支持编码参数用于字节序列的解码。

## 🎯 学习目标

- 掌握 str()函数的基本用法
- 理解不同数据类型到字符串的转换规则
- 学会使用编码参数处理字节数据
- 了解字符串表示和显示的区别

## 📋 前置知识

- Python 基本数据类型
- 字符编码基础概念
- 字节和字符串的区别

## 🔍 详细内容

### 基本概念

`str()` 函数将输入对象转换为字符串表示。对于自定义对象，它会调用对象的 `__str__()` 方法，如果不存在则调用 `__repr__()` 方法。

### 语法格式

```python
## 无参数调用,返回空字符串
str()

## 转换对象为字符串
str(object)

## 从字节序列解码为字符串
str(object, encoding='utf-8', errors='strict')
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| object | any | 否 | 无 | 要转换的对象 |
| encoding | str | 否 | 'utf-8' | 字节解码时使用的编码 |
| errors | str | 否 | 'strict' | 编码错误的处理方式 |

### 返回值

- **类型**: str
- **说明**: 转换后的字符串对象

## 💡 实际应用

### 基础用法

```python
## 无参数调用
result = str()  # 返回空字符串
print(f"无参数调用: '{result}'")  # 输出: 无参数调用: ''
print(f"长度: {len(result)}")      # 输出: 长度: 0

## 数值转换
int_num = 42
float_num = 3.14159
complex_num = 3 + 4j

print(f"整数转换: '{str(int_num)}'")      # 输出: 整数转换: '42'
print(f"浮点数转换: '{str(float_num)}'")   # 输出: 浮点数转换: '3.14159'
print(f"复数转换: '{str(complex_num)}'")   # 输出: 复数转换: '(3+4j)'

## 布尔值转换
print(f"True 转换: '{str(True)}'")   # 输出: True 转换: 'True'
print(f"False 转换: '{str(False)}'") # 输出: False 转换: 'False'
```

### 容器类型转换

```python
## 列表转换
my_list = [1, 2, 3, 'hello']
list_str = str(my_list)
print(f"列表转换: {list_str}")  # 输出: 列表转换: [1, 2, 3, 'hello']

## 字典转换
my_dict = {'name': '张三', 'age': 25}
dict_str = str(my_dict)
print(f"字典转换: {dict_str}")  # 输出: 字典转换: {'name': '张三', 'age': 25}

## 元组转换
my_tuple = (1, 2, 3)
tuple_str = str(my_tuple)
print(f"元组转换: {tuple_str}")  # 输出: 元组转换: (1, 2, 3)

## 集合转换
my_set = {1, 2, 3}
set_str = str(my_set)
print(f"集合转换: {set_str}")  # 输出: 集合转换: {1, 2, 3}
```

### 字节序列解码

```python
## UTF-8 编码的字节序列
utf8_bytes = '你好世界'.encode('utf-8')
print(f"字节序列: {utf8_bytes}")

## 解码为字符串
decoded_str = str(utf8_bytes, encoding='utf-8')
print(f"解码结果: {decoded_str}")  # 输出: 解码结果: 你好世界

## 不同编码示例
text = "Hello 世界"
encodings = ['utf-8', 'utf-16', 'gbk']

for encoding in encodings:
    try:
#        # 编码为字节
        encoded_bytes = text.encode(encoding)
        print(f"\n{encoding}编码:")
        print(f"  字节序列: {encoded_bytes}")
        
#        # 解码回字符串
        decoded = str(encoded_bytes, encoding=encoding)
        print(f"  解码结果: {decoded}")
        
    except UnicodeEncodeError as e:
        print(f"  {encoding}编码失败: {e}")
```

### 错误处理模式

```python
## 包含无效字节的序列
invalid_bytes = b'\xff\xfe\x00H\x00e\x00l\x00l\x00o'

## 不同的错误处理模式
error_modes = ['strict', 'ignore', 'replace', 'xmlcharrefreplace']

for mode in error_modes:
    try:
        result = str(invalid_bytes, encoding='utf-8', errors=mode)
        print(f"{mode}模式: '{result}'")
    except UnicodeDecodeError as e:
        print(f"{mode}模式: 解码错误 - {e}")

## 输出示例:
## strict 模式: 解码错误 - 'utf-8' codec can't decode byte 0xff in position 0
## ignore 模式: 'Hello'
## replace 模式: '��Hello'
## xmlcharrefreplace 模式: '&#255;&#254;&#0;H&#0;e&#0;l&#0;l&#0;o'
```

### 自定义对象转换

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def __str__(self):
        """定义字符串表示"""
        return f"{self.name}({self.age}岁)"
    
    def __repr__(self):
        """定义开发者表示"""
        return f"Person(name='{self.name}', age={self.age})"

class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade
    
#    # 只定义__repr__,没有__str__
    def __repr__(self):
        return f"Student(name='{self.name}', grade='{self.grade}')"

## 测试自定义对象
person = Person("张三", 25)
student = Student("李四", "高三")

print(f"Person str(): {str(person)}")    # 调用__str__
print(f"Person repr(): {repr(person)}")  # 调用__repr__
print(f"Student str(): {str(student)}")  # 调用__repr__(因为没有__str__)
print(f"Student repr(): {repr(student)}") # 调用__repr__
```

### 实际案例：数据格式化

```python
def format_data_report(data_dict):
    """格式化数据报告"""
    report_lines = []
    report_lines.append("=" * 50)
    report_lines.append("数据报告")
    report_lines.append("=" * 50)
    
    for key, value in data_dict.items():
#        # 根据数据类型进行不同的格式化
        if isinstance(value, (int, float)):
            if isinstance(value, float):
                formatted_value = f"{value:.2f}"
            else:
                formatted_value = str(value)
        elif isinstance(value, list):
            if len(value) <= 5:
                formatted_value = str(value)
            else:
                formatted_value = f"[{', '.join(map(str, value[:3]))}, ... 共{len(value)}项]"
        elif isinstance(value, dict):
            formatted_value = f"字典(包含{len(value)}个键)"
        else:
            formatted_value = str(value)
        
        report_lines.append(f"{key}: {formatted_value}")
    
    report_lines.append("=" * 50)
    return "\n".join(report_lines)

## 测试数据
test_data = {
    "用户数量": 1250,
    "平均年龄": 28.5,
    "活跃用户": ["user1", "user2", "user3", "user4", "user5", "user6"],
    "配置信息": {"theme": "dark", "language": "zh-CN"},
    "状态": True,
    "最后更新": "2024-01-15"
}

report = format_data_report(test_data)
print(report)
```

### 性能优化技巧

```python
import time

## 大量字符串转换的性能比较
numbers = list(range(100000))

## 方法 1:使用 str()函数
start_time = time.time()
results1 = [str(num) for num in numbers]
time1 = time.time() - start_time

## 方法 2:使用 map()函数
start_time = time.time()
results2 = list(map(str, numbers))
time2 = time.time() - start_time

## 方法 3:使用格式化字符串
start_time = time.time()
results3 = [f"{num}" for num in numbers]
time3 = time.time() - start_time

print(f"str()函数耗时: {time1:.4f}秒")
print(f"map()函数耗时: {time2:.4f}秒")
print(f"f-string 耗时: {time3:.4f}秒")

## 字符串连接性能比较
strings = [str(i) for i in range(10000)]

## 方法 1:使用+操作符(低效)
start_time = time.time()
result1 = ""
for s in strings[:1000]:  # 只测试 1000 个,避免过慢
    result1 += s
time1 = time.time() - start_time

## 方法 2:使用 join()方法(高效)
start_time = time.time()
result2 = "".join(strings)
time2 = time.time() - start_time

print(f"\n 字符串连接比较:")
print(f"+操作符耗时: {time1:.4f}秒")
print(f"join()方法耗时: {time2:.4f}秒")
print(f"性能提升: {(time1/time2):.1f}倍")
```

## ⚠️ 注意事项

### str() vs repr()

```python
## str()和 repr()的区别
text = "Hello\nWorld"
date_obj = datetime.datetime.now()

print(f"str(text): {str(text)}")
print(f"repr(text): {repr(text)}")
print(f"str(date): {str(date_obj)}")
print(f"repr(date): {repr(date_obj)}")

## str()面向用户,repr()面向开发者
print("\n 区别说明:")
print("str() - 用户友好的字符串表示")
print("repr() - 开发者友好的字符串表示,通常可以用 eval()重建对象")
```

### 编码问题

```python
## 常见编码问题
text = "中文测试"

## 正确的编码解码流程
encoded = text.encode('utf-8')  # 字符串 -> 字节
decoded = str(encoded, 'utf-8')  # 字节 -> 字符串

print(f"原始文本: {text}")
print(f"编码后: {encoded}")
print(f"解码后: {decoded}")
print(f"是否相等: {text == decoded}")

## 错误示例:编码不匹配
try:
    wrong_decode = str(encoded, 'ascii')  # 用 ASCII 解码 UTF-8
except UnicodeDecodeError as e:
    print(f"解码错误: {e}")
```

### 内存使用

```python
import sys

## 字符串内存使用
short_str = "hello"
long_str = "hello" * 1000

print(f"短字符串内存: {sys.getsizeof(short_str)} 字节")
print(f"长字符串内存: {sys.getsizeof(long_str)} 字节")

## 字符串驻留(string interning)
a = "hello"
b = "hello"
c = str("hello")

print(f"\n 字符串驻留:")
print(f"a is b: {a is b}")  # True,小字符串会被驻留
print(f"a is c: {a is c}")  # True,相同内容
print(f"id(a): {id(a)}")
print(f"id(b): {id(b)}")
print(f"id(c): {id(c)}")
```

## 🔗 相关内容

### 相关函数
- [repr() - 对象表示函数](../repr/) - 获取对象的开发者表示
- [ascii() - ASCII 表示函数](../ascii/) - 获取 ASCII 字符串表示
- [format() - 格式化函数](../format/) - 格式化值
- [int() - 整数转换函数](../int/) - 转换为整数
- [float() - 浮点数转换函数](../float/) - 转换为浮点数
- [bool() - 布尔转换函数](../bool/) - 转换为布尔值

### 字符串方法
- [字符串方法详解](../basics/string-methods/) - 字符串操作方法
- [字符串格式化](../basics/string-formatting/) - 格式化技巧
- [正则表达式](../stdlib/regex/) - 模式匹配

### 相关概念
- [字符编码](../advanced/character-encoding/) - 编码详解
- [Python 数据类型](../basics/data-types/) - 基本数据类型
- [异常处理](../basics/exceptions/) - 异常处理机制

## 📚 扩展阅读

- [Python 官方文档 - str()](https://docs.python.org/3/library/functions.html#func-str)
- [Python 字符串方法](https://docs.python.org/3/library/stdtypes.html#string-methods)
- [Unicode 和字符编码](https://docs.python.org/3/howto/unicode.html)
- [字符串格式化](https://docs.python.org/3/library/string.html#format-string-syntax)

## 🏷️ 标签

`类型转换` `字符串` `编码解码` `文本处理` `格式化`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档工程师  
**版本**: 1.0