---
layout: doc
title: contextlib 模块 - 上下文管理器工具
permalink: /docs/stdlib/contextlib/
category: stdlib
tags: [contextlib, 上下文管理器, with语句, 异常处理, 资源管理, 装饰器]
description: Python contextlib 模块详解，提供上下文管理器工具，支持 with 语句、异常处理、资源管理和装饰器功能
author: Python 文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# contextlib 模块 - 上下文管理器工具

## 📝 概述

contextlib 模块包含的工具用于处理上下文管理器和 with 语句。它提供了创建和管理上下文管理器的实用工具，使代码更加简洁和健壮。通过 contextlib，您可以轻松地将函数转换为上下文管理器，管理多个上下文对象，以及处理异常和资源清理。

## 🎯 学习目标

- 掌握上下文管理器 API 的基本原理和使用方法
- 学会使用 contextlib 模块创建和管理上下文管理器
- 理解 @contextmanager 装饰器的工作机制
- 掌握异常处理和资源管理的最佳实践
- 学会使用 ExitStack 进行动态上下文管理
- 了解输出重定向和异常抑制技术

## 📋 前置知识

- Python 基本语法和面向对象编程
- with 语句的基本使用
- 异常处理机制
- 生成器和装饰器概念
- 文件操作基础

## 🔍 详细内容

### 上下文管理器 API

上下文管理器(context manager)负责管理一个代码块中的资源，会在进入代码块时创建资源，然后在退出代码块后清理这个资源。例如，文件就支持上下文管理器API，可以确保完成文件读写后关闭文件。

```python
with open('test.txt', 'wt') as f:
    f.write('contents go here')
```

上下文管理器由with语句启用，这个API包括两个方法。执行流进入with中的代码块时会运行__enter__()方法。它会返回在这个上下文中使用的一个对象。执行流离开with块时，则调用这个上下文管理器的__exit__()方法来清理所使用的资源。

```python
class Context:
    def __init__(self):
        print('__init__()')
    def __enter__(self):
        print('__enter__()')
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        print('__exit__()')

with Context():
    print('Doing work in the context')
```

相对于try:finally块，结合上下文管理器和with语句是一种更紧凑的写法，因为总会调用上下文管理器的__exit__()方法，即使产生异常的情况下也会调用这个方法。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE371ab9184e150567b8524dc59b7d46f5.png)

如果with语句的as子句中指定了名，那么__enter__()方法可以返回与这个名关联的任何对象。在这个例子中，Context会返回一个使用打开的上下文的对象。

```python
class WithinContext:
    def __init__(self, context):
        print('WithinContext.__init__({})'.format(context))
    def do_something(self):
        print('WithinContext.do_something()')
    def __del__(self):
        print('WithinContext.__del__')

class Context:
    def __init__(self):
        print('Context.__init__()')
    def __enter__(self):
        print('Context.__enter__()')
        return WithinContext(self)
    def __exit__(self, exc_type, exc_val, exc_tb):
        print('Context.__exit__()')

with Context() as c:
    c.do_something()
```

与变量c关联的值是__enter__()返回的对象，这不一定是with语句中创建的Context实例。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE22ee7582ea726853b82e9a93cca9e234.png)

__exit__()方法接收一些参数，其中包含with块中产生的所有异常的详细信息。 

```python
class Context:
    def __init__(self, handle_error):
        print('__init__({})'.format(handle_error))
        self.handle_error = handle_error
    def __enter__(self):
        print('__enter__()')
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        print('__exit__()')
        print('  exc_type =', exc_type)
        print('  exc_val  =', exc_val)
        print('  exc_tb   =', exc_tb)
        return self.handle_error

with Context(True):
    raise RuntimeError('error message handled')
print()
with Context(False):
    raise RuntimeError('error message propagated')
```

如果上下文管理器可以处理这个异常，那么__exit__()应当返回一个true值来指示这个异常不需要传播。如果返回false，则会在__exit__()返回后再次抛出这个异常。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCEf7c0fb5a8662987f9356fa91a0f1ce2a.png)

## 💡 实际应用

### 上下文管理器作为函数修饰符 

类ContextDecorator增加了对常规上下文管理器类的支持，因此其不仅可以作为上下文管理器，也可以作为函数修饰符。

```python
import contextlib

class Context(contextlib.ContextDecorator):
    def __init__(self, how_used):
        self.how_used = how_used
        print('__init__({})'.format(how_used))
    def __enter__(self):
        print('__enter__({})'.format(self.how_used))
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        print('__exit__({})'.format(self.how_used))

@Context('as decorator')
def func(message):
    print(message)

print()
with Context('as context manager'):
    print('Doing work in the context')
print()
func('Doing work in the wrapped function')
```

使用上下文管理器作为修饰符时有一点不同：__enter__()返回的值在被修饰的函数中不可用，这与使用with和as时不一样。传入被修饰函数的参数可以正常使用。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCEf109c360ff764f02ac8ed023e8921de9.png)

### 从生成器到上下文管理器

采用传统方式创建上下文管理器并不难，即编写一个包含__enter__()和__exit__()方法的类。不过有些时候，如果只有很少的上下文要管理，那么完整的写出所有代码便会成为额外的负担。在这些情况下，可以使用contextmanager()修饰符将一个生成器函数转换为上下文管理器。 

```python
import contextlib

@contextlib.contextmanager
def make_context():
    print('  entering')
    try:
        yield {}
    except RuntimeError as err:
        print('  ERROR:', err)
    finally:
        print('  exiting')

print('Normal:')
with make_context() as value:
    print('  inside with statement:', value)

print('\nHandled error:')
with make_context() as value:
    raise RuntimeError('showing example of handling an error')

print('\nUnhandled error:')
with make_context() as value:
    raise ValueError('this exception is not handled')
```

生成器要初始化上下文，调用一次yield，然后清理上下文。所生成的值（如果有）会绑定到with语句as子句中的变量。with块中抛出的异常会在生成器中再次抛出，从而可以在生成器中得到处理。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCEa356e70232f5d8672dfcc76a6fbd967e.png)

contextmanager()返回的上下文管理器派生自ContextDecorator，所以也可以被用作函数修饰符。 

```python
import contextlib

@contextlib.contextmanager
def make_context():
    print('  entering')
    try:
        # Yield control, but not a value, because any value
        # yielded is not available when the context manager
        # is used as a decorator.
        yield
    except RuntimeError as err:
        print('  ERROR:', err)
    finally:
        print('  exiting')

@make_context()
def normal():
    print('  inside with statement')

@make_context()
def throw_error(err):
    raise err

print('Normal:')
normal()

print('\nHandled error:')
throw_error(RuntimeError('showing example of handling an error'))

print('\nUnhandled error:')
throw_error(ValueError('this exception is not handled'))
```

与前面的ContextDecorator例子一样，上下文管理器被用作修饰符时，生成器生成的值在被修饰的函数中不可用。传入被修饰函数的参数仍然可用，如这个例子中的throw_error()所示。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE167ea4eebc3f50724c3117f38bcfafbf.png)

### 关闭打开的句柄 

file类直接支持上下文管理器API，但另外一些表示打开句柄的对象却并不支持。contextlib的标准库文档中给出的示例是从urllib.urlopen()返回的对象。另外一些遗留的类会使用close()方法但不支持上下文管理器API。为了确保关闭句柄，要使用closing()为它创建一个上下文管理器。 

```python
import contextlib

class Door:
    def __init__(self):
        print('  __init__()')
        self.status = 'open'
 
    def close(self):
        print('  close()')
        self.status = 'closed'
 
print('Normal Example:')
with contextlib.closing(Door()) as door:
    print('  inside with statement: {}'.format(door.status))
print('  outside with statement: {}'.format(door.status))

print('\nError handling example:')
try:
    with contextlib.closing(Door()) as door:
        print('  raising from inside with statement')
        raise RuntimeError('error message')
except Exception as err:
    print('  Had an error:', err)
```

不论with块中是否有错误，都会关闭这个句柄。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE2b2233a375664637577df8976b0727ab.png)

### 忽略异常

很多情况下，忽略库产生的异常通常很有用，因为这个错误可能会显示期望的状态已经被实现，否则该错误可以被忽略。要忽略异常，最常见的方法是利用一个try:except语句，其在except块中只包含一个pass语句。 

```python
class NonFatalError(Exception):
    pass
 
def non_idempotent_operation():
    raise NonFatalError(
        'The operation failed because of existing state'
    )

try:
    print('trying non-idempotent operation')
    non_idempotent_operation()
    print('succeeded!')
except NonFatalError:
    pass
 
print('done')
```

在这种情况下，这个操作会失败，而错误将被忽略。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCEe41d16f4b939cf23e26d9ff40c7a8d18.png)

try:except也可以被替换为contextlib.suppress()，以更显式的抑制with块中产生某一类异常。 

```python
import contextlib

class NonFatalError(Exception):
    pass
 
def non_idempotent_operation():
    raise NonFatalError(
        'The operation failed because of existing state'
    )

with contextlib.suppress(NonFatalError):
    print('trying non-idempotent operation')
    non_idempotent_operation()
    print('succeeded!')

print('done')
```

在这个更新后的版本中，异常会被完全丢弃。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE642a6af3d3a97903869f18ea74bc6b90.png)

### 重定向输出流

设计不当的库代码可能会直接写sys.stdout或sys.stderr，而没有提供参数来配置不同的输出目标。可以用redirect_stdout()和redirect_stderr()上下文管理器从这些函数捕捉输出，因为无法修改这些函数的源代码来接收新的输出参数。 

```python
from contextlib import redirect_stdout, redirect_stderr
import io
import sys

def misbehaving_function(a):
    sys.stdout.write('(stdout) A: {!r}\n'.format(a))
    sys.stderr.write('(stderr) A: {!r}\n'.format(a))

capture = io.StringIO()
with redirect_stdout(capture), redirect_stderr(capture):
    misbehaving_function(5)

print(capture.getvalue())
```

在这个例子中，misbehaving_function()同时写至stdout和stderr，不过两个上下文管理器将这个输出发送到同一个io.StringIO实例，会在这里保存以备以后使用。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE1fc7eb80255fca7461bb26df2f860da4.png)

### 动态上下文管理器栈

大多数上下文管理器都一次处理一个对象，如单个文件或数据库句柄。在这些情况下，对象是提前已知的，并且使用上下文管理器的代码可以建立这一个对象上。另外一些情况下，程序可能需要在一个上下文中创建未知数目的对象，控制流退出这个上下文时所有这些对象都要清理。ExitStack就是用来处理这些更动态的情况。

ExitStack实例会维护清理回调的一个栈数据结构。这些回调显式的填充在上下文中，在控制流退出上下文时会以逆序调用所有注册的回调。结果类似于有多个嵌套的with语句，只不过它们是动态建立的。

可以使用多种方法填充ExitStack。下面这个例子使用enter_context()来为栈增加一个新的上下文管理器。 

```python
import contextlib

@contextlib.contextmanager
def make_context(i):
    print('{} entering'.format(i))
    yield {}
    print('{} exiting'.format(i))

def variable_stack(n, msg):
    with contextlib.ExitStack() as stack:
        for i in range(n):
            stack.enter_context(make_context(i))
        print(msg)

variable_stack(2, 'inside context')
```

enter_context()首先在上下文管理器上调用__enter__()。然后把它的__exit__()方法注册为一个回调，撤销栈时将调用这个回调。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCEc482b8f8ee185787fac2619cc11fb2a1.png)

## ⚠️ 注意事项

- 使用 @contextmanager 装饰器时，生成器函数只能包含一个 yield 语句
- 在生成器中处理异常时，需要正确地重新抛出未处理的异常
- 使用 ExitStack 时，注册的回调函数会按照注册的逆序执行
- redirect_stdout 和 redirect_stderr 只影响 Python 代码的输出，不影响 C 扩展的输出
- suppress() 只能抑制指定类型的异常，其他异常仍然会正常传播

## 🔗 相关内容

- [with 语句 - 上下文管理器基础](../../basics/with/)
- [装饰器 - Python 装饰器详解](../../basics/decorators/)
- [异常处理 - raise 和 assert](../../basics/raise-assert/)
- [io 模块 - 文本与二进制I/O](./io/)

## 📚 扩展阅读

- [Python 官方文档 - contextlib 模块](https://docs.python.org/3/library/contextlib.html)
- [PEP 343 - with 语句规范](https://www.python.org/dev/peps/pep-0343/)
- [上下文管理器协议详解](https://docs.python.org/3/reference/datamodel.html#context-managers)

## 🏷️ 标签

`contextlib` `上下文管理器` `with语句` `异常处理` `资源管理` `装饰器`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档团队  
**版本**: 1.0