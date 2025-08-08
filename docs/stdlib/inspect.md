---
layout: doc
title: inspect模块
permalink: /docs/stdlib/inspect/
category: stdlib
tags: [inspect, 反射, 源码检查, 函数签名, 栈帧]
description: Python inspect模块用于检查现场对象，包括模块、类、实例、函数和方法的详细信息
author: Python文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: 中级
---

# inspect模块

## 📝 概述

inspect模块也被称为"检查现场对象"。这里的重点在于"现场"二字，也就是当前运行的状态。inspect模块提供了一些函数来了解现场对象，包括模块、类、实例、函数和方法。

## 🎯 学习目标

- 掌握inspect模块的基本概念和用途
- 学会使用inspect进行对象类型检查
- 掌握获取源代码和文档的方法
- 理解函数签名的概念和应用
- 学会使用栈帧进行调试和错误定位

## 📋 前置知识

- Python基础语法
- 面向对象编程概念
- 函数和方法的区别
- 基本的调试概念

## 🔍 详细内容

### 基本概念

inspect模块主要用于以下四个方面：

1. 对是否是模块、框架、函数进行类型检查
2. 获取源码
3. 获取类或者函数的参数信息
4. 解析堆栈

### 主要功能分类

#### 1. 获取成员与判断

| 函数名 | 功能描述 |
|--------|----------|
| `getmembers(object[, predicate])` | 返回对象的所有成员，以(name,value)对组成的列表 |
| `ismodule(object)` | 是否为模块 |
| `isclass(object)` | 是否为类 |
| `ismethod(object)` | 是否为方法 |
| `isfunction(object)` | 是否为函数 |
| `isgeneratorfunction(object)` | 是否为生成器函数 |
| `isgenerator(object)` | 是否为生成器 |
| `isbuiltin(object)` | 是否为内置函数或方法 |
| `isroutine(object)` | 是否为用户自定义或内置函数或方法 |

#### 2. 获取源代码

| 函数名 | 功能描述 |
|--------|----------|
| `getdoc(object)` | 获取对象的文档信息 |
| `getfile(object)` | 返回对象的文件名 |
| `getmodule(object)` | 返回对象所属的模块名 |
| `getsourcefile(object)` | 返回对象的Python源文件名 |
| `getsourcelines(object)` | 返回对象的源代码内容，行号+代码行 |
| `getsource(object)` | 以字符串形式返回对象的源代码 |

#### 3. 函数签名

| 函数名 | 功能描述 |
|--------|----------|
| `signature(callable)` | 获取可调用对象的签名 |
| `Parameter` | 表示函数参数的类 |
| `Signature` | 表示函数签名的类 |

#### 4. 调用栈

| 函数名 | 功能描述 |
|--------|----------|
| `currentframe()` | 获取当前栈帧 |
| `stack([context])` | 获取当前调用栈 |
| `getmro(cls)` | 获取类的方法解析顺序 |

## 💡 实际应用

### 基础用法

#### 1. 获取对象成员

```python
import inspect

# 定义示例类
class ExampleClass:
    """示例类"""
    
    def __init__(self, name):
        self.name = name
    
    def get_name(self):
        """获取名称"""
        return self.name
    
    @classmethod
    def class_method(cls):
        """类方法"""
        pass
    
    @staticmethod
    def static_method():
        """静态方法"""
        pass

# 获取类的所有成员
for name, data in inspect.getmembers(ExampleClass):
    if not name.startswith('__'):
        print(f"{name} : {data!r}")

# 只获取函数成员
for name, data in inspect.getmembers(ExampleClass, inspect.isfunction):
    print(f"{name} : {data!r}")

# 只获取方法成员
for name, data in inspect.getmembers(ExampleClass, inspect.ismethod):
    print(f"{name} : {data!r}")
```

#### 2. 获取源代码

```python
import inspect

# 获取类的源代码
print(inspect.getsource(ExampleClass))

# 获取方法的源代码
print(inspect.getsource(ExampleClass.get_name))

# 获取源代码行信息
lines, start_line = inspect.getsourcelines(ExampleClass.get_name)
print(f"源代码行: {lines}")
print(f"起始行号: {start_line}")
```

#### 3. 函数签名检查

```python
import inspect
from inspect import Parameter, Signature

def example_function(a, b, c=10, *args, d=100, **kwargs):
    """示例函数"""
    return a + b + c

# 获取函数签名
sig = inspect.signature(example_function)
print(f"函数签名: {sig}")

# 分析参数类型
for name, param in sig.parameters.items():
    print(f"参数: {name}, 类型: {param.kind}, 默认值: {param.default}")

# 参数绑定
bound = sig.bind(1, 2, 3, 4, 5, d=200, extra=300)
print(f"绑定参数: {bound.arguments}")
```

### 高级用法

#### 1. 创建自定义签名

```python
from inspect import Signature, Parameter

# 创建参数列表
params = [
    Parameter('x', Parameter.POSITIONAL_OR_KEYWORD),
    Parameter('y', Parameter.POSITIONAL_OR_KEYWORD, default=9),
    Parameter('z', Parameter.VAR_KEYWORD)
]

# 创建签名
sig = Signature(params)
print(f"自定义签名: {sig}")

# 绑定参数
bound = sig.bind(1, z_extra=100)
print(f"绑定结果: {bound.arguments}")
```

#### 2. 栈帧分析

```python
import inspect
import pprint

def analyze_stack():
    """分析当前调用栈"""
    frame = inspect.currentframe()
    print(f"当前行号: {frame.f_lineno}")
    print(f"当前文件: {frame.f_code.co_filename}")
    print("局部变量:")
    pprint.pprint(frame.f_locals)

def recursive_function(limit):
    """递归函数示例"""
    local_var = "." * limit
    
    if limit <= 0:
        analyze_stack()
        return
    
    recursive_function(limit - 1)
    return local_var

# 调用递归函数
recursive_function(2)
```

#### 3. 完整栈信息

```python
import inspect

def show_complete_stack():
    """显示完整调用栈"""
    for level in inspect.stack():
        print(f"文件: {level.filename}")
        print(f"行号: {level.lineno}")
        print(f"函数: {level.function}")
        print(f"代码: {level.code_context[level.index].strip()}")
        print("-" * 50)

def function_a():
    function_b()

def function_b():
    function_c()

def function_c():
    show_complete_stack()

# 调用函数链
function_a()
```

### 实际案例

#### 1. 动态API文档生成器

```python
import inspect

def generate_api_doc(module):
    """生成模块的API文档"""
    doc = f"# {module.__name__} 模块文档\n\n"
    
    # 获取所有类
    classes = inspect.getmembers(module, inspect.isclass)
    for name, cls in classes:
        if cls.__module__ == module.__name__:  # 只处理本模块的类
            doc += f"## {name} 类\n\n"
            doc += f"{inspect.getdoc(cls) or '无文档'}\n\n"
            
            # 获取类的方法
            methods = inspect.getmembers(cls, inspect.isfunction)
            for method_name, method in methods:
                if not method_name.startswith('_'):
                    sig = inspect.signature(method)
                    doc += f"### {method_name}{sig}\n\n"
                    doc += f"{inspect.getdoc(method) or '无文档'}\n\n"
    
    return doc

# 使用示例
# print(generate_api_doc(some_module))
```

#### 2. 函数参数验证装饰器

```python
import inspect
from functools import wraps

def validate_types(**type_checks):
    """类型验证装饰器"""
    def decorator(func):
        sig = inspect.signature(func)
        
        @wraps(func)
        def wrapper(*args, **kwargs):
            # 绑定参数
            bound = sig.bind(*args, **kwargs)
            bound.apply_defaults()
            
            # 验证类型
            for param_name, expected_type in type_checks.items():
                if param_name in bound.arguments:
                    value = bound.arguments[param_name]
                    if not isinstance(value, expected_type):
                        raise TypeError(
                            f"参数 {param_name} 期望类型 {expected_type.__name__}, "
                            f"实际类型 {type(value).__name__}"
                        )
            
            return func(*args, **kwargs)
        return wrapper
    return decorator

# 使用示例
@validate_types(name=str, age=int)
def create_person(name, age=0):
    return f"姓名: {name}, 年龄: {age}"

# 正确调用
print(create_person("张三", 25))

# 错误调用（会抛出TypeError）
# create_person("张三", "25")
```

## ⚠️ 注意事项

- `getsource()` 和 `getsourcelines()` 只能用于有源文件的对象，不能用于内置模块
- 使用 `getmembers()` 时注意过滤私有属性（以`__`开头的属性）
- `currentframe()` 返回的frame对象在函数返回后会失效
- 函数签名检查时要注意参数的默认值处理
- 栈帧分析主要用于调试，不建议在生产代码中大量使用

## 🔗 相关内容

- [types模块](types.md) - 动态类型创建
- [sys模块](sys.md) - 系统相关功能
- [functools模块](functools.md) - 函数工具

## 📚 扩展阅读

- [Python官方文档 - inspect模块](https://docs.python.org/3/library/inspect.html)
- [Python反射机制详解](https://realpython.com/python-reflection/)
- [函数签名和参数绑定](https://docs.python.org/3/library/inspect.html#inspect.signature)

## 🏷️ 标签

`inspect` `反射` `源码检查` `函数签名` `栈帧` `调试` `元编程`

---

**最后更新**: 2024-01-15  
**作者**: Python文档团队  
**版本**: 1.0