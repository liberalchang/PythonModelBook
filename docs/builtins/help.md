---
layout: doc
title: help() - 帮助信息函数
permalink: /docs/builtins/help/
category: builtins
tags: [帮助系统, 文档, 内省, 交互式帮助]
description: 显示对象的帮助信息和文档
author: Python 文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "初级"
---

# help() - 帮助信息函数

## 📝 概述

`help()` 是 Python 中的内置函数，用于显示对象的帮助信息和文档。它是 Python 交互式帮助系统的入口点，可以显示模块、函数、类、方法等的文档字符串和使用说明。当不带参数调用时，`help()` 会启动交互式帮助系统。这个函数对于学习 Python 和探索未知的模块、函数非常有用。

## 🎯 学习目标

- 掌握 help()函数的基本用法和特性
- 学会查看不同类型对象的帮助信息
- 理解 Python 文档字符串的重要性
- 掌握交互式帮助系统的使用
- 学会编写良好的文档字符串

## 📋 前置知识

- Python 基本语法
- 函数和类的基本概念
- 模块和包的使用
- 文档字符串（docstring）的概念

## 🔍 详细内容

### 基本概念

`help()` 函数是 Python 内置的帮助系统，它可以：

1. **显示对象文档**: 显示函数、类、模块的文档字符串
2. **交互式帮助**: 启动交互式帮助浏览器
3. **内省功能**: 提供对象的详细信息
4. **学习工具**: 帮助开发者了解未知的 API

### 语法格式

```python
help([object])
```

### 参数说明

- **object** (可选): 要获取帮助信息的对象
  - 如果提供对象，显示该对象的帮助信息
  - 如果不提供参数，启动交互式帮助系统

### 返回值

- **类型**: None
- **副作用**: 在标准输出中显示帮助信息

## 💡 代码示例

### 基本用法

```python
## 基本用法示例
print("help()函数基本用法:")

## 1. 查看内置函数的帮助
print("\n1. 查看内置函数帮助:")
print("help(len) 的输出:")
help(len)

print("\n" + "="*50)
print("help(print) 的输出:")
help(print)

print("\n" + "="*50)
print("help(range) 的输出:")
help(range)

## 2. 查看内置类型的帮助
print("\n2. 查看内置类型帮助:")
print("help(str) 的输出:")
help(str)

print("\n" + "="*50)
print("help(list) 的输出:")
help(list)

print("\n" + "="*50)
print("help(dict) 的输出:")
help(dict)

## 3. 查看模块的帮助
print("\n3. 查看模块帮助:")
import math
print("help(math) 的输出:")
help(math)

print("\n" + "="*50)
import os
print("help(os) 的输出 (部分):")
help(os.path)  # 查看 os.path 子模块

## 4. 查看特定方法的帮助
print("\n4. 查看特定方法帮助:")
print("help(str.split) 的输出:")
help(str.split)

print("\n" + "="*50)
print("help(list.append) 的输出:")
help(list.append)

print("\n" + "="*50)
print("help(dict.get) 的输出:")
help(dict.get)
```

### 自定义函数和类的帮助

```python
## 自定义函数和类的帮助示例
print("\n 自定义函数和类的帮助示例:")

## 1. 带文档字符串的函数
def calculate_area(length, width):
    """
    计算矩形面积的函数。
    
    这个函数接受长度和宽度两个参数,返回矩形的面积。
    
    参数:
        length (float): 矩形的长度,必须为正数
        width (float): 矩形的宽度,必须为正数
    
    返回:
        float: 矩形的面积
    
    异常:
        ValueError: 当长度或宽度不是正数时抛出
    
    示例:
        >>> calculate_area(5, 3)
        15.0
        >>> calculate_area(2.5, 4.0)
        10.0
    
    注意:
        此函数假设输入的单位是一致的。
    """
    if length <= 0 or width <= 0:
        raise ValueError("长度和宽度必须为正数")
    
    return length * width

print("\n1. 带文档字符串的函数帮助:")
help(calculate_area)

## 2. 没有文档字符串的函数
def simple_add(a, b):
    return a + b

print("\n" + "="*50)
print("2. 没有文档字符串的函数帮助:")
help(simple_add)

## 3. 带文档字符串的类
class Calculator:
    """
    一个简单的计算器类。
    
    这个类提供基本的数学运算功能,包括加法、减法、乘法和除法。
    所有的运算都会记录在历史记录中。
    
    属性:
        history (list): 存储运算历史的列表
        precision (int): 计算结果的精度,默认为 2 位小数
    
    示例:
        >>> calc = Calculator()
        >>> result = calc.add(5, 3)
        >>> print(result)
        8.0
        >>> print(calc.history)
        ['5.0 + 3.0 = 8.0']
    """
    
    def __init__(self, precision=2):
        """
        初始化计算器。
        
        参数:
            precision (int): 结果精度,默认为 2 位小数
        """
        self.history = []
        self.precision = precision
    
    def add(self, a, b):
        """
        执行加法运算。
        
        参数:
            a (float): 第一个加数
            b (float): 第二个加数
        
        返回:
            float: 加法结果
        """
        result = round(float(a) + float(b), self.precision)
        self.history.append(f"{a} + {b} = {result}")
        return result
    
    def subtract(self, a, b):
        """
        执行减法运算。
        
        参数:
            a (float): 被减数
            b (float): 减数
        
        返回:
            float: 减法结果
        """
        result = round(float(a) - float(b), self.precision)
        self.history.append(f"{a} - {b} = {result}")
        return result
    
    def multiply(self, a, b):
        """
        执行乘法运算。
        
        参数:
            a (float): 第一个乘数
            b (float): 第二个乘数
        
        返回:
            float: 乘法结果
        """
        result = round(float(a) * float(b), self.precision)
        self.history.append(f"{a} * {b} = {result}")
        return result
    
    def divide(self, a, b):
        """
        执行除法运算。
        
        参数:
            a (float): 被除数
            b (float): 除数
        
        返回:
            float: 除法结果
        
        异常:
            ZeroDivisionError: 当除数为 0 时抛出
        """
        if b == 0:
            raise ZeroDivisionError("除数不能为零")
        
        result = round(float(a) / float(b), self.precision)
        self.history.append(f"{a} / {b} = {result}")
        return result
    
    def get_history(self):
        """
        获取运算历史记录。
        
        返回:
            list: 包含所有运算记录的列表
        """
        return self.history.copy()
    
    def clear_history(self):
        """
        清空运算历史记录。
        """
        self.history.clear()

print("\n" + "="*50)
print("3. 带文档字符串的类帮助:")
help(Calculator)

print("\n" + "="*50)
print("4. 类方法的帮助:")
help(Calculator.add)

print("\n" + "="*50)
print("5. 实例方法的帮助:")
calc = Calculator()
help(calc.multiply)

## 4. 复杂类的示例
class DataProcessor:
    """
    数据处理器类。
    
    这个类提供了多种数据处理功能,包括数据清洗、转换和分析。
    支持多种数据格式,并提供灵活的配置选项。
    
    类属性:
        SUPPORTED_FORMATS (list): 支持的数据格式列表
        DEFAULT_ENCODING (str): 默认字符编码
    
    实例属性:
        data (list): 存储的数据
        config (dict): 处理配置
        processed_count (int): 已处理的数据项数量
    """
    
    SUPPORTED_FORMATS = ['csv', 'json', 'xml', 'txt']
    DEFAULT_ENCODING = 'utf-8'
    
    def __init__(self, config=None):
        """
        初始化数据处理器。
        
        参数:
            config (dict, optional): 配置字典,包含处理选项
        """
        self.data = []
        self.config = config or {}
        self.processed_count = 0
    
    @classmethod
    def from_file(cls, filename, file_format='auto'):
        """
        从文件创建数据处理器实例。
        
        参数:
            filename (str): 文件路径
            file_format (str): 文件格式,默认为'auto'自动检测
        
        返回:
            DataProcessor: 新的数据处理器实例
        
        异常:
            FileNotFoundError: 文件不存在时抛出
            ValueError: 不支持的文件格式时抛出
        """
#        # 这里只是示例,实际实现会读取文件
        instance = cls()
        instance.data = [f"从{filename}加载的数据"]
        return instance
    
    @staticmethod
    def validate_format(file_format):
        """
        验证文件格式是否支持。
        
        参数:
            file_format (str): 要验证的文件格式
        
        返回:
            bool: 如果格式支持返回 True,否则返回 False
        """
        return file_format.lower() in DataProcessor.SUPPORTED_FORMATS
    
    @property
    def data_count(self):
        """
        获取数据项数量。
        
        返回:
            int: 数据项的数量
        """
        return len(self.data)
    
    @data_count.setter
    def data_count(self, value):
        """
        设置数据项数量(仅用于演示,实际中不建议这样做)。
        
        参数:
            value (int): 新的数据项数量
        """
        if value < 0:
            raise ValueError("数据项数量不能为负数")
#        # 这里只是示例实现
        pass

print("\n" + "="*50)
print("6. 复杂类的帮助:")
help(DataProcessor)

print("\n" + "="*50)
print("7. 类方法的帮助:")
help(DataProcessor.from_file)

print("\n" + "="*50)
print("8. 静态方法的帮助:")
help(DataProcessor.validate_format)

print("\n" + "="*50)
print("9. 属性的帮助:")
help(DataProcessor.data_count)
```

### 模块和包的帮助

```python
## 模块和包的帮助示例
print("\n 模块和包的帮助示例:")

## 1. 标准库模块
print("1. 标准库模块帮助:")

## datetime 模块
import datetime
print("datetime 模块帮助:")
help(datetime)

print("\n" + "="*50)
## json 模块
import json
print("json 模块帮助:")
help(json)

print("\n" + "="*50)
## collections 模块
import collections
print("collections 模块帮助:")
help(collections)

## 2. 模块中的特定类和函数
print("\n2. 模块中的特定类和函数:")

## datetime.datetime 类
print("datetime.datetime 类帮助:")
help(datetime.datetime)

print("\n" + "="*50)
## json.dumps 函数
print("json.dumps 函数帮助:")
help(json.dumps)

print("\n" + "="*50)
## collections.Counter 类
print("collections.Counter 类帮助:")
help(collections.Counter)

## 3. 创建自定义模块示例
print("\n3. 自定义模块示例:")

## 模拟一个自定义模块
class CustomModule:
    """
    自定义模块示例。
    
    这个模块提供了一些实用的工具函数和类。
    主要用于演示如何编写良好的文档字符串。
    
    模块包含:
        - 字符串处理工具
        - 数学计算工具
        - 数据验证工具
    
    版本: 1.0.0
    作者: Python 文档工程师
    """
    
    VERSION = "1.0.0"
    AUTHOR = "Python 文档工程师"
    
    @staticmethod
    def reverse_string(text):
        """
        反转字符串。
        
        参数:
            text (str): 要反转的字符串
        
        返回:
            str: 反转后的字符串
        
        示例:
            >>> CustomModule.reverse_string("hello")
            'olleh'
        """
        return text[::-1]
    
    @staticmethod
    def is_palindrome(text):
        """
        检查字符串是否为回文。
        
        参数:
            text (str): 要检查的字符串
        
        返回:
            bool: 如果是回文返回 True,否则返回 False
        
        示例:
            >>> CustomModule.is_palindrome("level")
            True
            >>> CustomModule.is_palindrome("hello")
            False
        """
        cleaned = text.lower().replace(" ", "")
        return cleaned == cleaned[::-1]
    
    @staticmethod
    def factorial(n):
        """
        计算阶乘。
        
        参数:
            n (int): 要计算阶乘的非负整数
        
        返回:
            int: n 的阶乘
        
        异常:
            ValueError: 当 n 为负数时抛出
            TypeError: 当 n 不是整数时抛出
        
        示例:
            >>> CustomModule.factorial(5)
            120
            >>> CustomModule.factorial(0)
            1
        """
        if not isinstance(n, int):
            raise TypeError("参数必须是整数")
        if n < 0:
            raise ValueError("参数必须是非负整数")
        
        if n <= 1:
            return 1
        return n * CustomModule.factorial(n - 1)

print("自定义模块帮助:")
help(CustomModule)

print("\n" + "="*50)
print("自定义模块方法帮助:")
help(CustomModule.reverse_string)

## 4. 包的帮助(模拟)
print("\n4. 包的帮助示例:")

## 模拟包结构
class PackageExample:
    """
    包示例。
    
    这是一个模拟的包结构,展示了如何为包编写文档。
    
    子模块:
        - utils: 实用工具模块
        - core: 核心功能模块
        - tests: 测试模块
    
    使用方法:
        import package_example
        from package_example import utils
        from package_example.core import MainClass
    """
    
    class utils:
        """
        实用工具子模块。
        
        提供各种实用的工具函数。
        """
        
        @staticmethod
        def format_number(num, precision=2):
            """
            格式化数字。
            
            参数:
                num (float): 要格式化的数字
                precision (int): 精度,默认为 2
            
            返回:
                str: 格式化后的数字字符串
            """
            return f"{num:.{precision}f}"
    
    class core:
        """
        核心功能子模块。
        
        包含主要的业务逻辑类和函数。
        """
        
        class MainClass:
            """
            主要业务类。
            
            这个类实现了包的核心功能。
            """
            
            def __init__(self, name):
                """
                初始化主类。
                
                参数:
                    name (str): 实例名称
                """
                self.name = name
            
            def process(self, data):
                """
                处理数据。
                
                参数:
                    data: 要处理的数据
                
                返回:
                    处理后的数据
                """
                return f"处理 {data} 使用 {self.name}"

print("包示例帮助:")
help(PackageExample)

print("\n" + "="*50)
print("子模块帮助:")
help(PackageExample.utils)

print("\n" + "="*50)
print("核心类帮助:")
help(PackageExample.core.MainClass)
```

### 交互式帮助系统

```python
## 交互式帮助系统示例
print("\n 交互式帮助系统示例:")

## 注意:在实际的交互式环境中,help()会启动交互式帮助
## 这里我们演示如何模拟和理解交互式帮助的概念

print("1. 交互式帮助系统概述:")
print("""
当你在 Python 交互式环境中输入 help() 时,会启动交互式帮助系统。

交互式帮助系统的特点:
- 提供搜索功能
- 支持主题浏览
- 可以查看关键字帮助
- 提供模块列表
- 支持退出命令

常用命令:
- help> modules        # 列出所有可用模块
- help> keywords       # 列出 Python 关键字
- help> symbols        # 列出符号
- help> topics         # 列出帮助主题
- help> quit           # 退出帮助系统
""")

## 2. 模拟交互式帮助功能
class InteractiveHelpSimulator:
    """
    交互式帮助系统模拟器。
    
    这个类模拟了 Python 交互式帮助系统的一些功能。
    """
    
    def __init__(self):
        self.topics = {
            'MODULES': '显示所有可用模块',
            'KEYWORDS': '显示 Python 关键字',
            'SYMBOLS': '显示特殊符号',
            'TOPICS': '显示帮助主题',
            'FUNCTIONS': '显示内置函数',
            'CLASSES': '显示内置类'
        }
        
        self.keywords = [
            'and', 'as', 'assert', 'break', 'class', 'continue', 'def',
            'del', 'elif', 'else', 'except', 'finally', 'for', 'from',
            'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
            'not', 'or', 'pass', 'raise', 'return', 'try', 'while',
            'with', 'yield', 'True', 'False', 'None'
        ]
        
        self.symbols = {
            '+': '加法运算符',
            '-': '减法运算符',
            '*': '乘法运算符',
            '/': '除法运算符',
            '//': '整数除法运算符',
            '%': '取模运算符',
            '**': '幂运算符',
            '=': '赋值运算符',
            '==': '等于比较运算符',
            '!=': '不等于比较运算符',
            '<': '小于比较运算符',
            '>': '大于比较运算符',
            '<=': '小于等于比较运算符',
            '>=': '大于等于比较运算符'
        }
    
    def show_topics(self):
        """
        显示可用的帮助主题。
        """
        print("\n 可用的帮助主题:")
        for topic, description in self.topics.items():
            print(f"  {topic:<12} - {description}")
    
    def show_keywords(self):
        """
        显示 Python 关键字。
        """
        print("\nPython 关键字:")
        for i, keyword in enumerate(self.keywords):
            if i % 6 == 0:
                print()
            print(f"{keyword:<12}", end="")
        print()
    
    def show_symbols(self):
        """
        显示特殊符号。
        """
        print("\n 特殊符号:")
        for symbol, description in self.symbols.items():
            print(f"  {symbol:<4} - {description}")
    
    def show_modules_info(self):
        """
        显示模块信息。
        """
        print("\n 常用模块信息:")
        import sys
        
#        # 显示一些常用模块
        common_modules = [
            'os', 'sys', 'math', 'random', 'datetime', 'json',
            'collections', 'itertools', 'functools', 're'
        ]
        
        for module_name in common_modules:
            try:
                module = __import__(module_name)
                doc = getattr(module, '__doc__', '无文档')
                if doc:
#                    # 只显示文档的第一行
                    first_line = doc.split('\n')[0].strip()
                    print(f"  {module_name:<12} - {first_line}")
                else:
                    print(f"  {module_name:<12} - 无文档")
            except ImportError:
                print(f"  {module_name:<12} - 模块未找到")
    
    def search_help(self, query):
        """
        搜索帮助信息。
        
        参数:
            query (str): 搜索查询
        """
        print(f"\n 搜索 '{query}' 的帮助信息:")
        
#        # 在关键字中搜索
        if query.lower() in [kw.lower() for kw in self.keywords]:
            print(f"  '{query}' 是 Python 关键字")
        
#        # 在符号中搜索
        if query in self.symbols:
            print(f"  '{query}' - {self.symbols[query]}")
        
#        # 尝试获取对象的帮助
        try:
#            # 这里简化处理,实际中会更复杂
            if hasattr(__builtins__, query):
                obj = getattr(__builtins__, query)
                print(f"  '{query}' 是内置对象: {type(obj).__name__}")
                if hasattr(obj, '__doc__') and obj.__doc__:
                    doc_lines = obj.__doc__.split('\n')
                    print(f"  文档: {doc_lines[0].strip()}")
        except:
            pass
        
        print(f"  提示: 使用 help({query}) 获取详细信息")

## 测试交互式帮助模拟器
print("\n2. 交互式帮助模拟器演示:")
help_sim = InteractiveHelpSimulator()

print("显示帮助主题:")
help_sim.show_topics()

print("\n 显示关键字:")
help_sim.show_keywords()

print("\n 显示符号:")
help_sim.show_symbols()

print("\n 显示模块信息:")
help_sim.show_modules_info()

print("\n 搜索帮助:")
help_sim.search_help('print')
help_sim.search_help('for')
help_sim.search_help('+')

## 3. 实际的 help()使用技巧
print("\n3. help()使用技巧:")

print("""
help()函数的高级使用技巧:

1. 查看对象类型:
   help(type(obj))  # 查看对象类型的帮助

2. 查看模块的特定部分:
   help(module.function)  # 查看模块中特定函数的帮助

3. 在字符串上使用:
   help('MODULES')  # 列出所有模块
   help('KEYWORDS') # 列出所有关键字

4. 查看运算符:
   help('OPERATORS')  # 查看运算符帮助

5. 查看特殊方法:
   help(obj.__method__)  # 查看特殊方法的帮助

6. 使用 pydoc 模块:
   import pydoc
   pydoc.help(obj)  # 等同于 help(obj)
""")

## 演示一些技巧
print("\n 实际演示:")

## 查看字符串类型的帮助(简化输出)
print("\n 查看字符串类型:")
test_string = "hello"
print(f"type(test_string): {type(test_string)}")
print("help(type(test_string)) 会显示 str 类的完整帮助")

## 查看列表的特定方法
print("\n 查看列表的 append 方法:")
test_list = []
print("help(test_list.append) 会显示 append 方法的帮助")

## 使用字符串参数
print("\n 使用字符串参数:")
print("help('MODULES') 会列出所有可用模块")
print("help('KEYWORDS') 会列出所有 Python 关键字")
```

### 高级应用：自定义帮助系统

```python
import inspect
import textwrap
from typing import Any, Dict, List, Optional

## 自定义帮助系统
class CustomHelpSystem:
    """
    自定义帮助系统。
    
    这个类扩展了 Python 内置的 help()功能,提供更丰富的帮助信息。
    """
    
    def __init__(self):
        self.help_cache = {}
        self.custom_docs = {}
    
    def register_custom_doc(self, obj, custom_doc):
        """
        为对象注册自定义文档。
        
        参数:
            obj: 要注册文档的对象
            custom_doc (str): 自定义文档字符串
        """
        self.custom_docs[id(obj)] = custom_doc
    
    def enhanced_help(self, obj):
        """
        提供增强的帮助信息。
        
        参数:
            obj: 要获取帮助的对象
        """
        print(f"\n{'='*60}")
        print(f"增强帮助信息: {self._get_object_name(obj)}")
        print(f"{'='*60}")
        
#        # 基本信息
        self._show_basic_info(obj)
        
#        # 文档字符串
        self._show_documentation(obj)
        
#        # 签名信息
        self._show_signature(obj)
        
#        # 属性和方法
        self._show_attributes_and_methods(obj)
        
#        # 继承信息
        self._show_inheritance_info(obj)
        
#        # 使用示例
        self._show_usage_examples(obj)
        
#        # 相关信息
        self._show_related_info(obj)
    
    def _get_object_name(self, obj):
        """
        获取对象名称。
        """
        if hasattr(obj, '__name__'):
            return obj.__name__
        elif hasattr(obj, '__class__'):
            return f"{obj.__class__.__name__} instance"
        else:
            return str(type(obj))
    
    def _show_basic_info(self, obj):
        """
        显示基本信息。
        """
        print(f"\n📋 基本信息:")
        print(f"  类型: {type(obj).__name__}")
        print(f"  模块: {getattr(obj, '__module__', 'unknown')}")
        
        if hasattr(obj, '__file__'):
            print(f"  文件: {obj.__file__}")
        
        if hasattr(obj, '__version__'):
            print(f"  版本: {obj.__version__}")
        
        if hasattr(obj, '__author__'):
            print(f"  作者: {obj.__author__}")
    
    def _show_documentation(self, obj):
        """
        显示文档字符串。
        """
        print(f"\n📖 文档:")
        
#        # 检查自定义文档
        custom_doc = self.custom_docs.get(id(obj))
        if custom_doc:
            print(f"  自定义文档:")
            print(textwrap.indent(custom_doc, "    "))
        
#        # 显示原始文档
        doc = getattr(obj, '__doc__', None)
        if doc:
            print(f"  原始文档:")
#            # 格式化文档字符串
            formatted_doc = textwrap.dedent(doc).strip()
            print(textwrap.indent(formatted_doc, "    "))
        else:
            print("  无文档字符串")
    
    def _show_signature(self, obj):
        """
        显示函数签名。
        """
        if callable(obj):
            print(f"\n✍️ 签名:")
            try:
                sig = inspect.signature(obj)
                print(f"  {self._get_object_name(obj)}{sig}")
                
#                # 显示参数详情
                if sig.parameters:
                    print(f"\n  参数详情:")
                    for name, param in sig.parameters.items():
                        param_info = f"    {name}"
                        
                        if param.annotation != param.empty:
                            param_info += f": {param.annotation}"
                        
                        if param.default != param.empty:
                            param_info += f" = {param.default}"
                        
                        if param.kind == param.VAR_POSITIONAL:
                            param_info = f"    *{name} (可变位置参数)"
                        elif param.kind == param.VAR_KEYWORD:
                            param_info = f"    **{name} (可变关键字参数)"
                        
                        print(param_info)
                
#                # 显示返回类型
                if sig.return_annotation != sig.empty:
                    print(f"\n  返回类型: {sig.return_annotation}")
                    
            except (ValueError, TypeError):
                print("  无法获取签名信息")
    
    def _show_attributes_and_methods(self, obj):
        """
        显示属性和方法。
        """
        print(f"\n🔧 属性和方法:")
        
#        # 获取所有属性
        all_attrs = dir(obj)
        
#        # 分类属性
        public_attrs = []
        private_attrs = []
        special_attrs = []
        methods = []
        properties = []
        
        for attr_name in all_attrs:
            try:
                attr_value = getattr(obj, attr_name)
                
                if attr_name.startswith('__') and attr_name.endswith('__'):
                    special_attrs.append(attr_name)
                elif attr_name.startswith('_'):
                    private_attrs.append(attr_name)
                elif callable(attr_value):
                    methods.append(attr_name)
                elif isinstance(inspect.getattr_static(obj, attr_name), property):
                    properties.append(attr_name)
                else:
                    public_attrs.append(attr_name)
            except:
                continue
        
#        # 显示分类结果
        if public_attrs:
            print(f"  公共属性 ({len(public_attrs)}): {', '.join(public_attrs[:10])}{'...' if len(public_attrs) > 10 else ''}")
        
        if methods:
            print(f"  方法 ({len(methods)}): {', '.join(methods[:10])}{'...' if len(methods) > 10 else ''}")
        
        if properties:
            print(f"  属性 ({len(properties)}): {', '.join(properties[:10])}{'...' if len(properties) > 10 else ''}")
        
        if private_attrs:
            print(f"  私有属性 ({len(private_attrs)}): {', '.join(private_attrs[:5])}{'...' if len(private_attrs) > 5 else ''}")
        
        if special_attrs:
            print(f"  特殊属性 ({len(special_attrs)}): {', '.join(special_attrs[:5])}{'...' if len(special_attrs) > 5 else ''}")
    
    def _show_inheritance_info(self, obj):
        """
        显示继承信息。
        """
        if inspect.isclass(obj):
            print(f"\n🏗️ 继承信息:")
            
#            # 基类
            bases = obj.__bases__
            if bases:
                print(f"  直接基类: {', '.join(base.__name__ for base in bases)}")
            
#            # MRO
            mro = obj.__mro__
            if len(mro) > 1:
                mro_names = [cls.__name__ for cls in mro]
                print(f"  方法解析顺序: {' -> '.join(mro_names)}")
            
#            # 子类(如果是内置类型,可能无法获取)
            try:
                subclasses = obj.__subclasses__()
                if subclasses:
                    subclass_names = [cls.__name__ for cls in subclasses[:5]]
                    print(f"  已知子类: {', '.join(subclass_names)}{'...' if len(subclasses) > 5 else ''}")
            except:
                pass
    
    def _show_usage_examples(self, obj):
        """
        显示使用示例。
        """
        print(f"\n💡 使用示例:")
        
        obj_name = self._get_object_name(obj)
        
        if inspect.isfunction(obj):
            print(f"  # 函数调用示例")
            print(f"  result = {obj_name}(args)")
        elif inspect.isclass(obj):
            print(f"  # 类实例化示例")
            print(f"  instance = {obj_name}()")
            print(f"  # 或带参数")
            print(f"  instance = {obj_name}(param1, param2)")
        elif inspect.ismethod(obj):
            print(f"  # 方法调用示例")
            print(f"  result = obj.{obj_name}(args)")
        elif inspect.ismodule(obj):
            print(f"  # 模块导入示例")
            print(f"  import {obj_name}")
            print(f"  from {obj_name} import function_name")
        else:
            print(f"  # 使用示例")
            print(f"  value = {obj_name}")
    
    def _show_related_info(self, obj):
        """
        显示相关信息。
        """
        print(f"\n🔗 相关信息:")
        
#        # 相关的内置函数
        related_builtins = []
        if inspect.isclass(obj):
            related_builtins.extend(['isinstance', 'issubclass', 'type'])
        if callable(obj):
            related_builtins.extend(['callable', 'inspect.signature'])
        
        if related_builtins:
            print(f"  相关内置函数: {', '.join(related_builtins)}")
        
#        # 相关模块
        if hasattr(obj, '__module__') and obj.__module__:
            print(f"  所属模块: {obj.__module__}")
        
#        # 文档链接(示例)
        print(f"  在线文档: https://docs.python.org/3/library/")
        print(f"  更多帮助: help({self._get_object_name(obj)})")
    
    def compare_objects(self, obj1, obj2):
        """
        比较两个对象的帮助信息。
        
        参数:
            obj1: 第一个对象
            obj2: 第二个对象
        """
        print(f"\n🔍 对象比较:")
        print(f"{'='*60}")
        
        name1 = self._get_object_name(obj1)
        name2 = self._get_object_name(obj2)
        
        print(f"比较 {name1} 和 {name2}:")
        
#        # 类型比较
        type1 = type(obj1)
        type2 = type(obj2)
        print(f"\n 类型: {type1.__name__} vs {type2.__name__}")
        
        if type1 == type2:
            print("  ✅ 类型相同")
        else:
            print("  ❌ 类型不同")
        
#        # 属性比较
        attrs1 = set(dir(obj1))
        attrs2 = set(dir(obj2))
        
        common_attrs = attrs1 & attrs2
        unique_to_1 = attrs1 - attrs2
        unique_to_2 = attrs2 - attrs1
        
        print(f"\n 属性比较:")
        print(f"  共同属性: {len(common_attrs)}")
        print(f"  {name1}独有: {len(unique_to_1)}")
        print(f"  {name2}独有: {len(unique_to_2)}")
        
        if unique_to_1:
            print(f"  {name1}独有属性: {', '.join(list(unique_to_1)[:5])}{'...' if len(unique_to_1) > 5 else ''}")
        
        if unique_to_2:
            print(f"  {name2}独有属性: {', '.join(list(unique_to_2)[:5])}{'...' if len(unique_to_2) > 5 else ''}")
        
#        # 继承关系
        if inspect.isclass(obj1) and inspect.isclass(obj2):
            print(f"\n 继承关系:")
            if issubclass(obj1, obj2):
                print(f"  {name1} 是 {name2} 的子类")
            elif issubclass(obj2, obj1):
                print(f"  {name2} 是 {name1} 的子类")
            else:
                print(f"  无直接继承关系")

## 测试自定义帮助系统
print("\n 高级应用:自定义帮助系统")

custom_help = CustomHelpSystem()

## 创建测试对象
class TestClass:
    """
    测试类。
    
    这是一个用于演示自定义帮助系统的测试类。
    """
    
    def __init__(self, name: str):
        """
        初始化测试类。
        
        参数:
            name: 实例名称
        """
        self.name = name
    
    def test_method(self, value: int = 10) -> str:
        """
        测试方法。
        
        参数:
            value: 测试值
        
        返回:
            格式化的字符串
        """
        return f"测试 {self.name}: {value}"
    
    @property
    def display_name(self) -> str:
        """
        显示名称属性。
        """
        return f"[{self.name}]"

## 注册自定义文档
custom_help.register_custom_doc(
    TestClass,
    "这是为 TestClass 添加的自定义文档,提供了额外的使用说明和注意事项。"
)

print("\n1. 增强帮助信息演示:")
custom_help.enhanced_help(TestClass)

print("\n2. 函数帮助信息演示:")
custom_help.enhanced_help(len)

print("\n3. 对象比较演示:")
custom_help.compare_objects(list, tuple)

print("\n4. 实例帮助信息演示:")
test_instance = TestClass("示例")
custom_help.enhanced_help(test_instance)
```

## ⚠️ 常见陷阱与最佳实践

### 文档字符串编写最佳实践

```python
## 文档字符串编写最佳实践
print("\n 文档字符串编写最佳实践:")

## 1. 良好的文档字符串示例
print("1. 良好的文档字符串示例:")

def good_docstring_example(data: list, threshold: float = 0.5, 
                          normalize: bool = True) -> dict:
    """
    处理数据并返回统计信息。
    
    这个函数对输入的数值列表进行处理,计算各种统计指标,
    并根据阈值进行分类。支持数据标准化选项。
    
    参数:
        data (list): 包含数值的列表,不能为空
        threshold (float, optional): 分类阈值,默认为 0.5
            - 必须在 0.0 到 1.0 之间
            - 用于区分高值和低值
        normalize (bool, optional): 是否标准化数据,默认为 True
            - True: 将数据标准化到[0,1]范围
            - False: 使用原始数据
    
    返回:
        dict: 包含统计信息的字典,包含以下键:
            - 'mean': 平均值 (float)
            - 'median': 中位数 (float)
            - 'std': 标准差 (float)
            - 'high_count': 高于阈值的数量 (int)
            - 'low_count': 低于阈值的数量 (int)
            - 'normalized': 是否进行了标准化 (bool)
    
    异常:
        ValueError: 当 data 为空或 threshold 不在有效范围时抛出
        TypeError: 当 data 不是列表或包含非数值元素时抛出
    
    示例:
        >>> data = [1, 2, 3, 4, 5]
        >>> result = good_docstring_example(data)
        >>> print(result['mean'])
        3.0
        
        >>> result = good_docstring_example(data, threshold=0.7, normalize=False)
        >>> print(result['high_count'])
        2
    
    注意:
        - 输入数据会被复制,不会修改原始列表
        - 标准化使用 min-max 方法
        - 空值会被自动过滤
    
    另请参阅:
        - numpy.mean(): NumPy 的平均值计算
        - statistics.median(): 标准库的中位数计算
        - sklearn.preprocessing.MinMaxScaler: 专业的数据标准化工具
    
    版本历史:
        - 1.0: 初始版本
        - 1.1: 添加标准化功能
        - 1.2: 改进错误处理
    """
#    # 实现代码(简化)
    if not data:
        raise ValueError("数据列表不能为空")
    
    if not (0.0 <= threshold <= 1.0):
        raise ValueError("阈值必须在 0.0 到 1.0 之间")
    
#    # 简化的实现
    mean_val = sum(data) / len(data)
    sorted_data = sorted(data)
    median_val = sorted_data[len(data) // 2]
    
    return {
        'mean': mean_val,
        'median': median_val,
        'std': 0.0,  # 简化
        'high_count': sum(1 for x in data if x > threshold * max(data)),
        'low_count': sum(1 for x in data if x <= threshold * max(data)),
        'normalized': normalize
    }

print("查看良好文档字符串的帮助:")
help(good_docstring_example)

## 2. 不良的文档字符串示例
print("\n" + "="*50)
print("2. 不良的文档字符串示例:")

def bad_docstring_example(d, t=0.5, n=True):
    """处理数据"""
#    # 没有详细说明参数、返回值、异常等
    return {'result': 'done'}

def no_docstring_example(data, threshold, normalize):
#    # 完全没有文档字符串
    return {}

def confusing_docstring_example(x, y, z):
    """
    这个函数做一些事情
    x 是输入
    y 也是输入
    z 可能是可选的
    返回一些东西
    """
    return x + y + (z or 0)

print("查看不良文档字符串的帮助:")
help(bad_docstring_example)
print("\n 查看无文档字符串的帮助:")
help(no_docstring_example)
print("\n 查看混乱文档字符串的帮助:")
help(confusing_docstring_example)

## 3. 类的文档字符串最佳实践
print("\n" + "="*50)
print("3. 类的文档字符串最佳实践:")

class WellDocumentedClass:
    """
    一个文档完善的示例类。
    
    这个类演示了如何编写高质量的类文档字符串。它提供了
    数据管理和处理功能,支持多种操作模式。
    
    类属性:
        DEFAULT_SIZE (int): 默认大小,值为 100
        SUPPORTED_TYPES (tuple): 支持的数据类型元组
    
    实例属性:
        name (str): 实例名称
        data (list): 存储的数据列表
        size (int): 当前大小
        readonly (bool): 是否为只读模式
    
    示例:
        >>> obj = WellDocumentedClass("test")
        >>> obj.add_data([1, 2, 3])
        >>> print(obj.size)
        3
        
        >>> obj = WellDocumentedClass("readonly", readonly=True)
        >>> obj.add_data([1, 2, 3])  # 会抛出异常
        Traceback (most recent call last):
        ...
        RuntimeError: 只读模式下不能添加数据
    
    注意:
        - 在只读模式下,所有修改操作都会失败
        - 数据会自动去重
        - 支持上下文管理器协议
    """
    
    DEFAULT_SIZE = 100
    SUPPORTED_TYPES = (int, float, str)
    
    def __init__(self, name: str, readonly: bool = False):
        """
        初始化类实例。
        
        参数:
            name (str): 实例名称,不能为空
            readonly (bool, optional): 是否为只读模式,默认 False
        
        异常:
            ValueError: 当 name 为空字符串时抛出
        """
        if not name:
            raise ValueError("名称不能为空")
        
        self.name = name
        self.data = []
        self.readonly = readonly
    
    def add_data(self, items: list) -> int:
        """
        添加数据到实例中。
        
        参数:
            items (list): 要添加的数据项列表
        
        返回:
            int: 成功添加的项目数量
        
        异常:
            RuntimeError: 在只读模式下调用时抛出
            TypeError: 当 items 包含不支持的类型时抛出
        
        示例:
            >>> obj = WellDocumentedClass("test")
            >>> count = obj.add_data([1, 2, 3, 2])  # 2 会被去重
            >>> print(count)
            3
        """
        if self.readonly:
            raise RuntimeError("只读模式下不能添加数据")
        
        added_count = 0
        for item in items:
            if not isinstance(item, self.SUPPORTED_TYPES):
                raise TypeError(f"不支持的数据类型: {type(item)}")
            
            if item not in self.data:
                self.data.append(item)
                added_count += 1
        
        return added_count
    
    @property
    def size(self) -> int:
        """
        获取当前数据大小。
        
        返回:
            int: 数据项的数量
        """
        return len(self.data)
    
    @classmethod
    def from_list(cls, name: str, data_list: list) -> 'WellDocumentedClass':
        """
        从列表创建实例。
        
        参数:
            name (str): 实例名称
            data_list (list): 初始数据列表
        
        返回:
            WellDocumentedClass: 新创建的实例
        
        示例:
            >>> obj = WellDocumentedClass.from_list("test", [1, 2, 3])
            >>> print(obj.size)
            3
        """
        instance = cls(name)
        instance.add_data(data_list)
        return instance
    
    @staticmethod
    def validate_data(data: list) -> bool:
        """
        验证数据是否有效。
        
        参数:
            data (list): 要验证的数据列表
        
        返回:
            bool: 如果数据有效返回 True,否则返回 False
        
        示例:
            >>> WellDocumentedClass.validate_data([1, 2, 3])
            True
            >>> WellDocumentedClass.validate_data([1, 2, object()])
            False
        """
        return all(isinstance(item, cls.SUPPORTED_TYPES) for item in data)
    
    def __enter__(self):
        """
        进入上下文管理器。
        
        返回:
            WellDocumentedClass: 返回自身实例
        """
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """
        退出上下文管理器。
        
        参数:
            exc_type: 异常类型
            exc_val: 异常值
            exc_tb: 异常回溯
        
        返回:
            bool: 是否抑制异常,这里返回 False
        """
#        # 清理资源
        if not self.readonly:
            self.data.clear()
        return False
    
    def __str__(self) -> str:
        """
        返回字符串表示。
        
        返回:
            str: 对象的字符串表示
        """
        return f"WellDocumentedClass(name='{self.name}', size={self.size}, readonly={self.readonly})"
    
    def __repr__(self) -> str:
        """
        返回开发者友好的字符串表示。
        
        返回:
            str: 对象的详细字符串表示
        """
        return f"WellDocumentedClass(name='{self.name}', readonly={self.readonly})"

print("查看完善类文档的帮助:")
help(WellDocumentedClass)

## 4. 模块文档字符串最佳实践
print("\n" + "="*50)
print("4. 模块文档字符串最佳实践:")

## 模拟模块文档字符串
module_docstring_example = """
数据处理工具模块。

这个模块提供了一套完整的数据处理工具,包括数据清洗、
转换、分析和可视化功能。适用于科学计算和数据分析场景。

主要功能:
    - 数据导入和导出
    - 数据清洗和预处理
    - 统计分析
    - 数据可视化
    - 机器学习预处理

典型用法:
    import data_tools
    
#    # 加载数据
    data = data_tools.load_csv('data.csv')
    
#    # 清洗数据
    clean_data = data_tools.clean_data(data)
    
#    # 分析数据
    stats = data_tools.analyze(clean_data)
    
#    # 可视化
    data_tools.plot(clean_data)

依赖:
    - numpy >= 1.19.0
    - pandas >= 1.2.0
    - matplotlib >= 3.3.0
    - scikit-learn >= 0.24.0

作者: 数据科学团队
版本: 2.1.0
许可证: MIT
联系方式: data-team@example.com

更新日志:
    2.1.0 (2024-01-15):
        - 添加新的机器学习预处理功能
        - 改进数据可视化
        - 修复内存泄漏问题
    
    2.0.0 (2023-12-01):
        - 重构核心 API
        - 添加并行处理支持
        - 提升性能

注意事项:
    - 大数据集处理可能需要大量内存
    - 某些功能需要 GPU 支持
    - 建议在虚拟环境中使用
"""

print("模块文档字符串示例:")
print(module_docstring_example)

## 5. 文档字符串格式规范
print("\n" + "="*50)
print("5. 文档字符串格式规范:")

class DocstringFormats:
    """
    文档字符串格式规范示例。
    
    这个类展示了不同的文档字符串格式规范。
    """
    
    def google_style_docstring(self, param1, param2=None):
        """
        Google 风格的文档字符串。
        
        这个方法演示了 Google 风格的文档字符串格式。
        
        Args:
            param1 (str): 第一个参数的描述。
            param2 (int, optional): 第二个参数的描述。默认为 None。
        
        Returns:
            bool: 返回值的描述。
        
        Raises:
            ValueError: 当 param1 为空时抛出。
            TypeError: 当 param2 不是整数时抛出。
        
        Example:
            >>> obj = DocstringFormats()
            >>> result = obj.google_style_docstring("test", 42)
            >>> print(result)
            True
        
        Note:
            这是一个注意事项。
        """
        return True
    
    def numpy_style_docstring(self, param1, param2=None):
        """
        NumPy 风格的文档字符串。
        
        这个方法演示了 NumPy 风格的文档字符串格式。
        
        Parameters
        ----------
        param1 : str
            第一个参数的描述。
        param2 : int, optional
            第二个参数的描述,默认为 None。
        
        Returns
        -------
        bool
            返回值的描述。
        
        Raises
        ------
        ValueError
            当 param1 为空时抛出。
        TypeError
            当 param2 不是整数时抛出。
        
        Examples
        --------
        >>> obj = DocstringFormats()
        >>> result = obj.numpy_style_docstring("test", 42)
        >>> print(result)
        True
        
        Notes
        -----
        这是一个注意事项。
        
        See Also
        --------
        google_style_docstring : Google 风格的文档字符串
        """
        return True
    
    def sphinx_style_docstring(self, param1, param2=None):
        """
        Sphinx 风格的文档字符串。
        
        这个方法演示了 Sphinx 风格的文档字符串格式。
        
        :param param1: 第一个参数的描述
        :type param1: str
        :param param2: 第二个参数的描述
        :type param2: int or None
        :returns: 返回值的描述
        :rtype: bool
        :raises ValueError: 当 param1 为空时抛出
        :raises TypeError: 当 param2 不是整数时抛出
        
        .. note::
           这是一个注意事项。
        
        .. example::
           >>> obj = DocstringFormats()
           >>> result = obj.sphinx_style_docstring("test", 42)
           >>> print(result)
           True
        """
        return True

print("查看不同格式的文档字符串:")
help(DocstringFormats.google_style_docstring)
print("\n" + "-"*30)
help(DocstringFormats.numpy_style_docstring)
print("\n" + "-"*30)
help(DocstringFormats.sphinx_style_docstring)

## 6. 文档字符串检查工具
print("\n" + "="*50)
print("6. 文档字符串检查工具:")

class DocstringChecker:
    """
    文档字符串检查工具。
    
    这个类提供了检查和评估文档字符串质量的方法。
    """
    
    @staticmethod
    def check_docstring_quality(obj):
        """
        检查对象的文档字符串质量。
        
        参数:
            obj: 要检查的对象
        
        返回:
            dict: 包含检查结果的字典
        """
        result = {
            'has_docstring': False,
            'docstring_length': 0,
            'has_parameters': False,
            'has_returns': False,
            'has_examples': False,
            'has_raises': False,
            'quality_score': 0
        }
        
        doc = getattr(obj, '__doc__', None)
        if doc:
            result['has_docstring'] = True
            result['docstring_length'] = len(doc)
            
            doc_lower = doc.lower()
            
#            # 检查是否包含参数说明
            if any(keyword in doc_lower for keyword in ['参数', 'parameters', 'args', 'param']):
                result['has_parameters'] = True
            
#            # 检查是否包含返回值说明
            if any(keyword in doc_lower for keyword in ['返回', 'returns', 'return']):
                result['has_returns'] = True
            
#            # 检查是否包含示例
            if any(keyword in doc_lower for keyword in ['示例', 'example', '>>>', 'examples']):
                result['has_examples'] = True
            
#            # 检查是否包含异常说明
            if any(keyword in doc_lower for keyword in ['异常', 'raises', 'raise', 'exception']):
                result['has_raises'] = True
            
#            # 计算质量分数
            score = 0
            if result['docstring_length'] > 50:
                score += 2
            elif result['docstring_length'] > 20:
                score += 1
            
            if result['has_parameters']:
                score += 2
            if result['has_returns']:
                score += 2
            if result['has_examples']:
                score += 2
            if result['has_raises']:
                score += 1
            
            result['quality_score'] = min(score, 10)  # 最高 10 分
        
        return result
    
    @staticmethod
    def suggest_improvements(obj):
        """
        为对象的文档字符串提供改进建议。
        
        参数:
            obj: 要检查的对象
        
        返回:
            list: 改进建议列表
        """
        suggestions = []
        quality = DocstringChecker.check_docstring_quality(obj)
        
        if not quality['has_docstring']:
            suggestions.append("添加文档字符串")
        else:
            if quality['docstring_length'] < 20:
                suggestions.append("增加文档字符串的详细程度")
            
            if not quality['has_parameters'] and callable(obj):
                try:
                    sig = inspect.signature(obj)
                    if sig.parameters:
                        suggestions.append("添加参数说明")
                except:
                    pass
            
            if not quality['has_returns'] and callable(obj):
                suggestions.append("添加返回值说明")
            
            if not quality['has_examples']:
                suggestions.append("添加使用示例")
            
            if not quality['has_raises'] and callable(obj):
                suggestions.append("添加异常说明(如果适用)")
        
        return suggestions
    
    @staticmethod
    def generate_docstring_template(obj):
        """
        为对象生成文档字符串模板。
        
        参数:
            obj: 要生成模板的对象
        
        返回:
            str: 文档字符串模板
        """
        if not callable(obj):
            return '"""\n 对象描述。\n\n 详细说明。\n"""'
        
        try:
            sig = inspect.signature(obj)
            obj_name = getattr(obj, '__name__', 'function')
            
            template = f'"""\n{obj_name}的简短描述。\n\n 详细描述{obj_name}的功能和用途。\n'
            
            if sig.parameters:
                template += '\n 参数:\n'
                for name, param in sig.parameters.items():
                    param_type = 'type' if param.annotation == param.empty else str(param.annotation)
                    if param.default != param.empty:
                        template += f'    {name} ({param_type}, optional): {name}的描述,默认为{param.default}\n'
                    else:
                        template += f'    {name} ({param_type}): {name}的描述\n'
            
            if sig.return_annotation != sig.empty:
                template += f'\n 返回:\n    {sig.return_annotation}: 返回值的描述\n'
            else:
                template += '\n 返回:\n    type: 返回值的描述\n'
            
            template += '\n 异常:\n    ExceptionType: 异常条件的描述\n'
            template += '\n 示例:\n    >>> result = {}()\n    >>> print(result)\n'.format(obj_name)
            template += '"""'
            
            return template
            
        except:
            return '"""\n 函数描述。\n\n 详细说明。\n\n 参数:\n    param: 参数描述\n\n 返回:\n    type: 返回值描述\n"""'

## 测试文档字符串检查工具
print("测试文档字符串检查工具:")

## 检查不同质量的文档字符串
test_objects = [
    good_docstring_example,
    bad_docstring_example,
    no_docstring_example,
    WellDocumentedClass
]

for obj in test_objects:
    name = getattr(obj, '__name__', str(obj))
    quality = DocstringChecker.check_docstring_quality(obj)
    suggestions = DocstringChecker.suggest_improvements(obj)
    
    print(f"\n 对象: {name}")
    print(f"  质量分数: {quality['quality_score']}/10")
    print(f"  有文档字符串: {quality['has_docstring']}")
    print(f"  文档长度: {quality['docstring_length']}")
    print(f"  有参数说明: {quality['has_parameters']}")
    print(f"  有返回值说明: {quality['has_returns']}")
    print(f"  有示例: {quality['has_examples']}")
    
    if suggestions:
        print(f"  改进建议: {', '.join(suggestions)}")
    else:
        print(f"  改进建议: 文档质量良好")

## 生成模板示例
print("\n" + "-"*30)
print("文档字符串模板生成示例:")

def template_example_function(name, age=25, active=True):
    pass

template = DocstringChecker.generate_docstring_template(template_example_function)
print(f"\n 为 template_example_function 生成的模板:")
print(template)
```

## ⚠️ 常见陷阱与最佳实践

### help()使用注意事项

```python
## help()使用注意事项
print("\nhelp()使用注意事项:")

## 1. 输出重定向问题
print("1. 输出重定向问题:")

import io
import sys
from contextlib import redirect_stdout

def capture_help_output(obj):
    """
    捕获 help()的输出。
    
    参数:
        obj: 要获取帮助的对象
    
    返回:
        str: help()的输出内容
    """
    output = io.StringIO()
    with redirect_stdout(output):
        help(obj)
    return output.getvalue()

## 演示捕获 help 输出
print("捕获 help(len)的输出:")
help_output = capture_help_output(len)
print(f"输出长度: {len(help_output)} 字符")
print(f"前 100 个字符: {help_output[:100]}...")

## 2. 交互式环境 vs 脚本环境
print("\n2. 交互式环境 vs 脚本环境:")

print("""
在不同环境中 help()的行为差异:

交互式环境(REPL):
- help()启动交互式帮助系统
- 输出会分页显示
- 支持搜索和导航

脚本环境:
- help()直接输出到 stdout
- 没有分页功能
- 输出可能很长

建议:
- 在脚本中使用 help()时考虑输出重定向
- 对于长输出,考虑使用 pydoc 模块
- 在自动化脚本中避免使用交互式 help()
""")

## 3. 性能考虑
print("\n3. 性能考虑:")

import time

def performance_test():
    """
    测试 help()的性能影响。
    """
#    # 测试对象
    test_objects = [len, str, list, dict, int]
    
    print("  help()性能测试:")
    
    for obj in test_objects:
        start_time = time.time()
        
#        # 捕获输出以避免打印
        output = io.StringIO()
        with redirect_stdout(output):
            help(obj)
        
        end_time = time.time()
        
        obj_name = getattr(obj, '__name__', str(obj))
        print(f"    {obj_name}: {(end_time - start_time)*1000:.2f}ms")

performance_test()

## 4. 内存使用
print("\n4. 内存使用注意事项:")

print("""
help()的内存使用特点:

- help()会加载对象的完整文档
- 对于大型模块,可能消耗较多内存
- 文档字符串会被缓存
- 在内存受限环境中需要注意

建议:
- 避免在循环中频繁调用 help()
- 对于大型对象,考虑查看特定部分
- 使用 inspect 模块获取特定信息
""")

## 5. 最佳实践总结
print("\n5. help()使用最佳实践:")

class HelpBestPractices:
    """
    help()使用最佳实践示例。
    """
    
    @staticmethod
    def smart_help(obj, capture_output=False, max_lines=50):
        """
        智能帮助函数。
        
        参数:
            obj: 要获取帮助的对象
            capture_output (bool): 是否捕获输出
            max_lines (int): 最大显示行数
        
        返回:
            str or None: 如果 capture_output 为 True,返回帮助文本
        """
        if capture_output:
            output = io.StringIO()
            with redirect_stdout(output):
                help(obj)
            
            help_text = output.getvalue()
            
#            # 限制输出行数
            if max_lines > 0:
                lines = help_text.split('\n')
                if len(lines) > max_lines:
                    help_text = '\n'.join(lines[:max_lines]) + '\n... (输出被截断)'
            
            return help_text
        else:
            help(obj)
    
    @staticmethod
    def quick_info(obj):
        """
        快速获取对象信息。
        
        参数:
            obj: 要检查的对象
        
        返回:
            dict: 对象的基本信息
        """
        info = {
            'name': getattr(obj, '__name__', 'unknown'),
            'type': type(obj).__name__,
            'module': getattr(obj, '__module__', 'unknown'),
            'doc_available': bool(getattr(obj, '__doc__', None)),
            'callable': callable(obj)
        }
        
        if info['doc_available']:
            doc = obj.__doc__
            info['doc_length'] = len(doc)
            info['doc_first_line'] = doc.split('\n')[0].strip() if doc else ''
        
        if callable(obj):
            try:
                sig = inspect.signature(obj)
                info['parameters'] = list(sig.parameters.keys())
                info['parameter_count'] = len(sig.parameters)
            except:
                info['parameters'] = []
                info['parameter_count'] = 0
        
        return info
    
    @staticmethod
    def help_summary(obj):
        """
        显示对象的帮助摘要。
        
        参数:
            obj: 要显示摘要的对象
        """
        info = HelpBestPractices.quick_info(obj)
        
        print(f"\n📋 {info['name']} 摘要:")
        print(f"  类型: {info['type']}")
        print(f"  模块: {info['module']}")
        print(f"  可调用: {info['callable']}")
        
        if info['doc_available']:
            print(f"  文档长度: {info['doc_length']} 字符")
            print(f"  文档首行: {info['doc_first_line']}")
        else:
            print(f"  文档: 无")
        
        if info['callable'] and 'parameter_count' in info:
            print(f"  参数数量: {info['parameter_count']}")
            if info['parameters']:
                print(f"  参数列表: {', '.join(info['parameters'])}")
        
        print(f"\n💡 获取完整帮助: help({info['name']})")
    
    @staticmethod
    def compare_help(obj1, obj2):
        """
        比较两个对象的帮助信息。
        
        参数:
            obj1: 第一个对象
            obj2: 第二个对象
        """
        info1 = HelpBestPractices.quick_info(obj1)
        info2 = HelpBestPractices.quick_info(obj2)
        
        print(f"\n🔍 对象比较:")
        print(f"  {info1['name']} vs {info2['name']}")
        print(f"  类型: {info1['type']} vs {info2['type']}")
        print(f"  模块: {info1['module']} vs {info2['module']}")
        print(f"  可调用: {info1['callable']} vs {info2['callable']}")
        print(f"  有文档: {info1['doc_available']} vs {info2['doc_available']}")
        
        if info1['callable'] and info2['callable']:
            count1 = info1.get('parameter_count', 0)
            count2 = info2.get('parameter_count', 0)
            print(f"  参数数量: {count1} vs {count2}")

## 测试最佳实践
print("\n 测试 help()最佳实践:")

## 智能帮助
print("1. 智能帮助示例:")
help_text = HelpBestPractices.smart_help(len, capture_output=True, max_lines=10)
print(f"捕获的帮助文本(前 200 字符): {help_text[:200]}...")

## 快速信息
print("\n2. 快速信息示例:")
HelpBestPractices.help_summary(len)
HelpBestPractices.help_summary(WellDocumentedClass)

## 对象比较
print("\n3. 对象比较示例:")
HelpBestPractices.compare_help(list, tuple)
HelpBestPractices.compare_help(len, max)
```

## 🔗 相关函数和模块

### 内置函数
- `dir()` - 列出对象的属性
- `vars()` - 返回对象的属性字典
- `type()` - 获取对象类型
- `isinstance()` - 检查对象类型
- `hasattr()` - 检查对象是否有指定属性
- `getattr()` - 获取对象属性值
- `callable()` - 检查对象是否可调用

### 标准库模块
- `inspect` - 对象检查和内省
- `pydoc` - 文档生成工具
- `doctest` - 文档测试
- `ast` - 抽象语法树
- `types` - 动态类型创建

### 第三方库
- `sphinx` - 文档生成工具
- `pdoc` - 自动文档生成
- `mkdocs` - Markdown 文档生成
- `jupyter` - 交互式文档环境

## 📚 扩展阅读

- [Python 文档字符串约定](https://www.python.org/dev/peps/pep-0257/)
- [内置函数文档](https://docs.python.org/3/library/functions.html#help)
- [pydoc 模块文档](https://docs.python.org/3/library/pydoc.html)
- [Sphinx 文档工具](https://www.sphinx-doc.org/)

## 🏷️ 标签

`帮助系统` `文档` `内省` `交互式帮助` `文档字符串` `API 文档` `代码文档` `开发工具`