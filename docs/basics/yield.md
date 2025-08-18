---
layout: doc
title: yield 关键字 - 生成器与协程
permalink: /docs/basics/yield/
category: basics
tags: [Python, yield, 生成器, 协程, send, 迭代器, 内存优化]
description: 深入学习 Python yield 关键字，掌握生成器函数、协程编程和 send() 方法的使用
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 2.0
difficulty: "中级"
---

# yield 关键字 - 生成器与协程

## 📝 概述

`yield` 是 Python 中用于创建生成器（Generator）的关键字。与 `return` 不同，`yield` 会暂停函数的执行并返回一个值，当再次调用时会从暂停的地方继续执行。这种机制不仅能实现内存高效的迭代，还能通过 `send()` 方法实现强大的协程编程模式。

## 🎯 学习目标

通过本章学习，你将掌握：
- yield 关键字的基本语法和工作原理
- 生成器函数的创建和使用
- 生成器表达式的语法
- yield from 语句的使用
- **协程的核心概念和 send() 方法**
- **协程装饰器和管道模式的实现**
- **yield 返回值与接收值的区别**
- 生成器在实际项目中的应用场景

## 📋 前置知识

- Python 基础语法
- 函数的定义和调用
- 迭代器和可迭代对象的概念
- 异常处理机制
- **装饰器的基本使用**
- **函数作用域和闭包概念**

## 详细内容

### yield 基本语法

#### 简单生成器

```python
def simple_generator():
    print("开始执行")
    yield 1
    print("第一次暂停后继续")
    yield 2
    print("第二次暂停后继续")
    yield 3
    print("生成器结束")

## 创建生成器对象
gen = simple_generator()
print(f"生成器对象: {gen}")

## 逐步获取值
print(f"第一个值: {next(gen)}")
print(f"第二个值: {next(gen)}")
print(f"第三个值: {next(gen)}")

## 尝试获取下一个值会引发 StopIteration
try:
    next(gen)
except StopIteration:
    print("生成器已耗尽")
```

#### 带参数的生成器

```python
def countdown(n):
    """倒计时生成器"""
    print(f"开始倒计时从 {n}")
    while n > 0:
        yield n
        n -= 1
    print("倒计时结束")

## 使用生成器
for num in countdown(5):
    print(f"倒计时: {num}")

print("\n 使用列表推导式对比:")
## 生成器表达式
gen_expr = (x * 2 for x in range(5))
print(f"生成器表达式: {gen_expr}")
print(f"生成器内容: {list(gen_expr)}")
```

#### 无限生成器

```python
def fibonacci():
    """斐波那契数列生成器"""
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

def prime_numbers():
    """质数生成器"""
    def is_prime(n):
        if n < 2:
            return False
        for i in range(2, int(n ** 0.5) + 1):
            if n % i == 0:
                return False
        return True
    
    n = 2
    while True:
        if is_prime(n):
            yield n
        n += 1

## 使用无限生成器
print("前 10 个斐波那契数:")
fib_gen = fibonacci()
for i, num in enumerate(fib_gen):
    if i >= 10:
        break
    print(num, end=" ")
print()

print("\n 前 10 个质数:")
prime_gen = prime_numbers()
for i, prime in enumerate(prime_gen):
    if i >= 10:
        break
    print(prime, end=" ")
print()
```

### 生成器的高级特性

#### send() 方法

```python
def interactive_generator():
    """可以接收外部输入的生成器"""
    print("生成器启动")
    value = yield "请发送一个值"
    
    while value is not None:
        print(f"收到值: {value}")
        if isinstance(value, str):
            response = f"处理字符串: {value.upper()}"
        elif isinstance(value, (int, float)):
            response = f"处理数字: {value * 2}"
        else:
            response = f"处理其他类型: {type(value).__name__}"
        
        value = yield response
    
    print("生成器结束")

## 使用 send() 方法
gen = interactive_generator()
print(next(gen))  # 启动生成器

print(gen.send("hello"))
print(gen.send(42))
print(gen.send([1, 2, 3]))

## 结束生成器
try:
    gen.send(None)
except StopIteration:
    print("生成器已结束")
```

#### throw() 和 close() 方法

```python
def robust_generator():
    """具有异常处理的生成器"""
    try:
        print("生成器开始")
        yield 1
        
        print("继续执行")
        yield 2
        
        print("即将结束")
        yield 3
        
    except ValueError as e:
        print(f"捕获到 ValueError: {e}")
        yield f"错误处理: {e}"
    
    except GeneratorExit:
        print("生成器被关闭")
#        # 不能在 GeneratorExit 处理中使用 yield
    
    finally:
        print("生成器清理")

## 测试异常处理
gen = robust_generator()
print(f"第一个值: {next(gen)}")

## 向生成器抛出异常
try:
    result = gen.throw(ValueError, "测试异常")
    print(f"异常处理结果: {result}")
except StopIteration:
    print("生成器在异常处理后结束")

## 测试关闭生成器
gen2 = robust_generator()
print(f"第一个值: {next(gen2)}")
gen2.close()  # 关闭生成器
```

### yield from 语句

#### 基本用法

```python
def sub_generator():
    """子生成器"""
    yield "来自子生成器的值 1"
    yield "来自子生成器的值 2"
    yield "来自子生成器的值 3"
    return "子生成器返回值"

def delegating_generator():
    """委托生成器"""
    yield "开始"
    
#    # 使用 yield from 委托给子生成器
    result = yield from sub_generator()
    print(f"子生成器返回: {result}")
    
    yield "结束"

## 使用委托生成器
for value in delegating_generator():
    print(value)
```

#### 复杂的 yield from 示例

```python
def flatten(nested_list):
    """扁平化嵌套列表"""
    for item in nested_list:
        if isinstance(item, list):
            yield from flatten(item)  # 递归处理嵌套列表
        else:
            yield item

def chain_generators(*generators):
    """链接多个生成器"""
    for gen in generators:
        yield from gen

## 测试扁平化
nested = [1, [2, 3], [4, [5, 6]], 7]
flat_list = list(flatten(nested))
print(f"扁平化结果: {flat_list}")

## 测试生成器链接
def gen1():
    yield 1
    yield 2

def gen2():
    yield 3
    yield 4

def gen3():
    yield 5
    yield 6

chained = chain_generators(gen1(), gen2(), gen3())
print(f"链接结果: {list(chained)}")
```

### 协程基础

#### 什么是协程

协程（Coroutine）是一种特殊的函数，它可以在执行过程中暂停和恢复。与普通函数不同，协程可以有多个入口点，并且能够保持状态。在 Python 中，使用 `yield` 关键字的生成器函数可以实现简单的协程。

#### 协程的核心机制：send() 方法

协程的强大之处在于它不仅能够产生值，还能够接收外部传入的值。这通过 `send()` 方法实现。

```python
def coroutine_example():
    """协程示例：接收并处理外部传入的值"""
    while True:
        x = yield  # 等待接收值
        print("收到值:", x)

# 创建协程
g = coroutine_example()
next(g)  # 启动协程，程序运行到 yield 处停止

# 使用 send() 传递值
g.send(1)  # 将值 1 传递给 yield，赋值给 x，然后打印
g.send(2)  # 将值 2 传递给 yield，赋值给 x，然后打印
next(g)    # 不传递值，x 为 None，继续执行

# 输出：
# 收到值: 1
# 收到值: 2
# 收到值: None
```

#### send() 方法的双重功能

`send()` 方法具有两个重要功能：
1. **传值功能**：将值传递给 `yield` 表达式
2. **推进功能**：类似 `next()`，推进协程执行到下一个 `yield`

```python
def value_receiver():
    """演示 send() 的双重功能"""
    print("协程启动")
    while True:
        value = yield "请发送一个值"  # yield 既能接收值，也能返回值
        if value is None:
            break
        print(f"处理接收到的值: {value}")
    print("协程结束")

# 使用协程
gen = value_receiver()
result = next(gen)  # 启动协程，获取第一个返回值
print(f"协程返回: {result}")

result = gen.send("hello")  # 发送值并获取返回值
print(f"协程返回: {result}")

result = gen.send("world")
print(f"协程返回: {result}")

# 结束协程
try:
    gen.send(None)
except StopIteration:
    print("协程已结束")
```

#### 协程启动的限制

新创建的协程必须先启动才能接收非 None 值：

```python
def demo_coroutine():
    while True:
        x = yield
        print("值:", x)

g = demo_coroutine()

# 错误示例：直接发送非 None 值
try:
    g.send(1)  # 这会引发 TypeError
except TypeError as e:
    print(f"错误: {e}")

# 正确做法：先启动协程
g = demo_coroutine()
next(g)  # 或者 g.send(None)
g.send(1)  # 现在可以正常发送值
```

#### 简单协程

```python
def simple_coroutine():
    """简单协程示例"""
    print("协程启动")
    
    while True:
        value = yield
        if value is None:
            break
        print(f"协程处理: {value}")
    
    print("协程结束")

def data_processor():
    """数据处理协程"""
    total = 0
    count = 0
    
    while True:
        value = yield
        if value is None:
            break
        
        if isinstance(value, (int, float)):
            total += value
            count += 1
            avg = total / count
            print(f"接收: {value}, 总和: {total}, 平均值: {avg:.2f}")
        else:
            print(f"忽略非数字值: {value}")

## 使用协程
coro = data_processor()
next(coro)  # 启动协程

## 发送数据
coro.send(10)
coro.send(20)
coro.send("hello")  # 非数字值
coro.send(30)
coro.send(None)  # 结束协程
```

#### 协程的实际应用：管道模式

协程非常适合实现数据处理管道，每个协程负责处理的一个环节：

```python
def coroutine_starter(func):
    """协程启动装饰器"""
    def wrapper(*args, **kwargs):
        gen = func(*args, **kwargs)
        next(gen)  # 自动启动协程
        return gen
    return wrapper

@coroutine_starter
def data_processor_pipeline():
    """数据处理协程"""
    while True:
        data = yield
        if data is None:
            break
        
        # 数据预处理
        processed = data.strip().lower()
        print(f"处理数据: {data} -> {processed}")

@coroutine_starter
def data_filter(target, condition):
    """数据过滤协程"""
    while True:
        data = yield
        if data is None:
            target.send(None)
            break
        
        if condition(data):
            target.send(data)

@coroutine_starter
def data_collector():
    """数据收集协程"""
    results = []
    while True:
        data = yield results.copy()
        if data is None:
            break
        results.append(data)

# 构建处理管道
collector = data_collector()
filter_pipeline = data_filter(collector, lambda x: len(x) > 3)
processor = data_processor_pipeline()

# 处理数据
test_data = ["Hello", "Hi", "Python", "AI", "World"]
for item in test_data:
    processor.send(item)
    if len(item) > 3:  # 符合过滤条件
        filter_pipeline.send(item)

# 获取结果
final_results = collector.send(None)
print(f"最终结果: {final_results}")
```

#### 高级应用：文件搜索管道

下面是一个复杂的协程应用示例，模拟 `grep -rl 'pattern' /path` 命令的功能：

```python
import os

def coroutine_starter(func):
    """协程启动装饰器"""
    def wrapper(*args, **kwargs):
        gen = func(*args, **kwargs)
        next(gen)  # 自动启动协程
        return gen
    return wrapper

@coroutine_starter
def file_searcher(target):
    """文件搜索协程：遍历目录，将文件路径发送给下一个协程"""
    while True:
        search_path = yield
        if search_path is None:
            target.send(None)
            break
            
        # 遍历目录
        for parent_dir, _, files in os.walk(search_path):
            for file in files:
                file_path = os.path.join(parent_dir, file)
                target.send(file_path)

@coroutine_starter
def file_opener(target):
    """文件打开协程：打开文件并发送文件对象"""
    while True:
        file_path = yield
        if file_path is None:
            target.send(None)
            break
            
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                target.send((file_path, f))
        except (OSError, IOError):
            continue  # 跳过无法打开的文件

@coroutine_starter
def file_reader(target):
    """文件读取协程：逐行读取文件内容"""
    while True:
        file_data = yield
        if file_data is None:
            target.send(None)
            break
            
        file_path, file_obj = file_data
        for line_num, line in enumerate(file_obj, 1):
            # 发送文件路径、行号和行内容
            should_stop = target.send((file_path, line_num, line))
            if should_stop:  # 如果找到匹配，停止读取此文件
                break

@coroutine_starter
def pattern_matcher(target, pattern):
    """模式匹配协程：检查行是否包含指定模式"""
    matched_files = set()  # 记录已匹配的文件，避免重复
    
    while True:
        line_data = yield False  # 默认返回 False（继续读取）
        if line_data is None:
            target.send(None)
            break
            
        file_path, line_num, line = line_data
        
        if pattern in line:
            if file_path not in matched_files:
                matched_files.add(file_path)
                target.send((file_path, line_num, line.strip()))
                yield True  # 返回 True，通知停止读取此文件
            else:
                yield True  # 文件已匹配过，停止读取

@coroutine_starter
def result_printer():
    """结果打印协程：打印匹配的文件信息"""
    while True:
        result = yield
        if result is None:
            break
            
        file_path, line_num, matched_line = result
        print(f"文件: {file_path}")
        print(f"行号: {line_num}")
        print(f"内容: {matched_line}")
        print("-" * 50)

# 使用示例
def search_files_with_pattern(search_path, pattern):
    """在指定路径中搜索包含特定模式的文件"""
    # 构建协程管道
    printer = result_printer()
    matcher = pattern_matcher(printer, pattern)
    reader = file_reader(matcher)
    opener = file_opener(reader)
    searcher = file_searcher(opener)
    
    # 开始搜索
    searcher.send(search_path)
    
    # 清理协程
    searcher.send(None)

# 实际使用
# search_files_with_pattern(r'D:\CODE_FILE\python\test', 'root')
```

这个例子展示了协程的强大之处：
- **模块化设计**：每个协程负责一个特定功能
- **流式处理**：数据在协程间流动，内存效率高
- **可组合性**：可以轻松添加新的处理步骤
- **状态保持**：每个协程可以维护自己的状态

#### 重要概念：yield 的返回值与接收值

这是协程编程中的一个关键概念，需要明确区分：

```python
@coroutine_starter
def value_demo():
    """演示 yield 返回值与接收值的区别"""
    result_list = []
    
    while True:
        # yield 右边的值是返回给调用者的
        # yield 接收的值（通过 send 传入）会赋值给左边的变量
        received_value = yield result_list  # 返回 result_list，接收外部传入的值
        
        if received_value is None:
            break
            
        result_list.append(received_value)
        print(f"接收到的值: {received_value}")

# 使用示例
demo = value_demo()

# 第一次调用，获取初始返回值
initial_result = demo.send('apple')
print(f"返回的列表: {initial_result}")  # ['apple']

# 继续发送值并获取返回值
result = demo.send('banana')
print(f"返回的列表: {result}")  # ['apple', 'banana']

result = demo.send('orange')
print(f"返回的列表: {result}")  # ['apple', 'banana', 'orange']
```

**关键点**：
- `yield` 右边的表达式是**返回值**，会传递给调用 `send()` 或 `next()` 的代码
- `send()` 传递的值是**输入值**，会赋值给 `yield` 左边的变量
- 这两个值是完全独立的，不要混淆

#### 协程装饰器

```python
def coroutine_decorator(func):
    """协程装饰器,自动启动协程"""
    def wrapper(*args, **kwargs):
        gen = func(*args, **kwargs)
        next(gen)  # 自动启动
        return gen
    return wrapper

@coroutine_decorator
def auto_started_coroutine():
    """自动启动的协程"""
    print("协程已自动启动")
    
    while True:
        value = yield
        if value is None:
            break
        print(f"处理: {value}")

## 使用自动启动的协程
coro = auto_started_coroutine()
coro.send("第一个值")
coro.send("第二个值")
coro.send(None)
```

## 实际应用场景

### 1. 大文件处理

```python
def read_large_file(filename, chunk_size=1024):
    """逐块读取大文件"""
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            while True:
                chunk = file.read(chunk_size)
                if not chunk:
                    break
                yield chunk
    except FileNotFoundError:
        print(f"文件 {filename} 不存在")
        return

def process_log_file(filename):
    """处理日志文件"""
    line_count = 0
    error_count = 0
    
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            for line in file:
                line_count += 1
                
#                # 处理每一行
                if 'ERROR' in line.upper():
                    error_count += 1
                    yield {
                        'line_number': line_count,
                        'content': line.strip(),
                        'type': 'error'
                    }
                elif 'WARNING' in line.upper():
                    yield {
                        'line_number': line_count,
                        'content': line.strip(),
                        'type': 'warning'
                    }
                
#                # 每处理 1000 行报告一次进度
                if line_count % 1000 == 0:
                    yield {
                        'line_number': line_count,
                        'content': f"已处理 {line_count} 行,发现 {error_count} 个错误",
                        'type': 'progress'
                    }
    
    except FileNotFoundError:
        yield {
            'line_number': 0,
            'content': f"文件 {filename} 不存在",
            'type': 'error'
        }

## 创建示例日志文件
sample_log = """INFO: 应用启动
DEBUG: 连接数据库
ERROR: 数据库连接失败
WARNING: 重试连接
INFO: 连接成功
ERROR: 查询超时
INFO: 应用关闭"""

with open('sample.log', 'w', encoding='utf-8') as f:
    f.write(sample_log)

## 处理日志文件
print("处理日志文件:")
for event in process_log_file('sample.log'):
    print(f"[{event['type'].upper()}] 行 {event['line_number']}: {event['content']}")
```

### 2. 数据流处理

```python
class DataPipeline:
    """数据处理管道"""
    
    def __init__(self):
        self.processors = []
    
    def add_processor(self, processor):
        """添加处理器"""
        self.processors.append(processor)
    
    def process(self, data_stream):
        """处理数据流"""
        current_stream = data_stream
        
        for processor in self.processors:
            current_stream = processor(current_stream)
        
        yield from current_stream

def data_source(count=10):
    """数据源生成器"""
    for i in range(count):
        yield {'id': i, 'value': i * 2, 'status': 'raw'}

def filter_processor(data_stream):
    """过滤处理器"""
    for item in data_stream:
        if item['value'] % 4 == 0:  # 只保留值能被 4 整除的项
            yield item

def transform_processor(data_stream):
    """转换处理器"""
    for item in data_stream:
        item['value'] = item['value'] ** 2  # 平方
        item['status'] = 'transformed'
        yield item

def validate_processor(data_stream):
    """验证处理器"""
    for item in data_stream:
        if item['value'] < 1000:  # 验证值小于 1000
            item['status'] = 'valid'
            yield item
        else:
            item['status'] = 'invalid'
            print(f"验证失败: {item}")

## 构建数据处理管道
pipeline = DataPipeline()
pipeline.add_processor(filter_processor)
pipeline.add_processor(transform_processor)
pipeline.add_processor(validate_processor)

## 处理数据
print("数据处理管道结果:")
for result in pipeline.process(data_source(20)):
    print(result)
```

### 3. 状态机实现

```python
class StateMachine:
    """基于生成器的状态机"""
    
    def __init__(self):
        self.state = None
        self.context = {}
    
    def run(self, initial_state, events):
        """运行状态机"""
        self.state = initial_state
        state_gen = self.state(self.context)
        
        try:
#            # 启动状态
            next(state_gen)
            
            for event in events:
                try:
                    new_state = state_gen.send(event)
                    if new_state is not None:
#                        # 状态转换
                        print(f"状态转换: {self.state.__name__} -> {new_state.__name__}")
                        self.state = new_state
                        state_gen = self.state(self.context)
                        next(state_gen)  # 启动新状态
                
                except StopIteration:
                    print("状态机结束")
                    break
        
        except StopIteration:
            print("状态机结束")

def idle_state(context):
    """空闲状态"""
    print("进入空闲状态")
    
    while True:
        event = yield
        print(f"空闲状态收到事件: {event}")
        
        if event == 'start':
            yield working_state
        elif event == 'shutdown':
            yield shutdown_state

def working_state(context):
    """工作状态"""
    print("进入工作状态")
    context['work_count'] = context.get('work_count', 0)
    
    while True:
        event = yield
        print(f"工作状态收到事件: {event}")
        
        if event == 'work':
            context['work_count'] += 1
            print(f"完成工作,总计: {context['work_count']}")
        elif event == 'pause':
            yield paused_state
        elif event == 'stop':
            yield idle_state
        elif event == 'shutdown':
            yield shutdown_state

def paused_state(context):
    """暂停状态"""
    print("进入暂停状态")
    
    while True:
        event = yield
        print(f"暂停状态收到事件: {event}")
        
        if event == 'resume':
            yield working_state
        elif event == 'stop':
            yield idle_state
        elif event == 'shutdown':
            yield shutdown_state

def shutdown_state(context):
    """关闭状态"""
    print("进入关闭状态")
    print(f"最终工作计数: {context.get('work_count', 0)}")
    return  # 结束状态机

## 使用状态机
events = ['start', 'work', 'work', 'pause', 'resume', 'work', 'stop', 'shutdown']

sm = StateMachine()
sm.run(idle_state, events)
```

### 4. 网络爬虫

```python
import time
import random

def url_generator(base_urls, max_depth=2):
    """URL 生成器"""
    visited = set()
    queue = [(url, 0) for url in base_urls]
    
    while queue:
        url, depth = queue.pop(0)
        
        if url in visited or depth > max_depth:
            continue
        
        visited.add(url)
        yield url, depth
        
#        # 模拟发现新链接
        if depth < max_depth:
            for i in range(random.randint(1, 3)):
                new_url = f"{url}/page{i}"
                if new_url not in visited:
                    queue.append((new_url, depth + 1))

def web_crawler(urls, delay=1):
    """网络爬虫生成器"""
    for url, depth in url_generator(urls):
        print(f"正在爬取 (深度 {depth}): {url}")
        
#        # 模拟网络请求
        time.sleep(delay)
        
#        # 模拟响应
        response = {
            'url': url,
            'depth': depth,
            'status': 200,
            'content_length': random.randint(1000, 10000),
            'title': f"页面标题 - {url.split('/')[-1]}"
        }
        
        yield response

## 使用爬虫
base_urls = ['https://example.com', 'https://test.com']

print("开始爬取:")
for i, page_data in enumerate(web_crawler(base_urls, delay=0.1)):
    print(f"[{i+1}] {page_data['title']} - {page_data['content_length']} bytes")
    
    if i >= 10:  # 限制爬取数量
        break
```

## ⚠️ 注意事项

### 协程使用注意事项

1. **协程必须先启动**
   ```python
   # ❌ 错误：直接向未启动的协程发送值
   def my_coroutine():
       while True:
           x = yield
           print(x)
   
   gen = my_coroutine()
   gen.send(1)  # TypeError: can't send non-None value to a just-started generator
   
   # ✅ 正确：先启动协程
   gen = my_coroutine()
   next(gen)  # 或 gen.send(None)
   gen.send(1)  # 现在可以正常工作
   ```

2. **yield 返回值与接收值的区别**
   ```python
   # 要明确区分这两个概念：
   def demo():
       value = yield "返回值"  # "返回值"被返回，外部send的值赋给value
   ```

3. **协程的生命周期管理**
   ```python
   # ✅ 推荐使用装饰器自动启动协程
   def coroutine_starter(func):
       def wrapper(*args, **kwargs):
           gen = func(*args, **kwargs)
           next(gen)
           return gen
       return wrapper
   ```

4. **避免在 GeneratorExit 中使用 yield**
   ```python
   def problematic_coroutine():
       try:
           while True:
               value = yield
               print(value)
       except GeneratorExit:
           yield "cleanup"  # ❌ 这会引发 RuntimeError
   ```

## 常见陷阱与最佳实践

### 1. 生成器的一次性使用

```python
## ✗ 错误:尝试多次使用同一个生成器
def bad_example():
    gen = (x * 2 for x in range(5))
    
    print("第一次使用:")
    for value in gen:
        print(value)
    
    print("第二次使用:")
    for value in gen:  # 这里不会输出任何内容
        print(value)

## ✓ 正确:每次创建新的生成器
def good_example():
    def create_generator():
        return (x * 2 for x in range(5))
    
    print("第一次使用:")
    for value in create_generator():
        print(value)
    
    print("第二次使用:")
    for value in create_generator():
        print(value)

bad_example()
print("\n" + "="*30 + "\n")
good_example()
```

### 2. 内存效率对比

```python
import sys

def memory_comparison():
    """内存使用对比"""
    
#    # 列表方式(占用大量内存)
    large_list = [x * 2 for x in range(1000000)]
    print(f"列表大小: {sys.getsizeof(large_list)} bytes")
    
#    # 生成器方式(占用很少内存)
    large_gen = (x * 2 for x in range(1000000))
    print(f"生成器大小: {sys.getsizeof(large_gen)} bytes")
    
#    # 使用生成器处理大数据
    def process_large_data():
        total = 0
        count = 0
        
        for value in large_gen:
            total += value
            count += 1
            
            if count >= 1000:  # 只处理前 1000 个
                break
        
        return total / count
    
    avg = process_large_data()
    print(f"前 1000 个数的平均值: {avg}")

memory_comparison()
```

### 3. 异常处理最佳实践

```python
def safe_generator(data):
    """安全的生成器,包含异常处理"""
    try:
        for item in data:
            if item is None:
                continue
            
            try:
#                # 尝试处理每个项目
                if isinstance(item, str):
                    yield item.upper()
                elif isinstance(item, (int, float)):
                    yield item * 2
                else:
                    yield f"未知类型: {type(item).__name__}"
            
            except Exception as e:
#                # 处理单个项目的异常
                yield f"处理错误: {e}"
    
    except Exception as e:
#        # 处理整体异常
        print(f"生成器异常: {e}")
        yield "生成器发生错误"
    
    finally:
        print("生成器清理")

## 测试异常处理
test_data = ["hello", 42, None, [1, 2, 3], "world"]

print("安全生成器测试:")
for result in safe_generator(test_data):
    print(result)
```

### 4. 性能优化技巧

```python
import time
from functools import wraps

def timing_decorator(func):
    """计时装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} 执行时间: {end - start:.4f} 秒")
        return result
    return wrapper

@timing_decorator
def list_approach(n):
    """列表方式"""
    return [x * 2 for x in range(n) if x % 2 == 0]

@timing_decorator
def generator_approach(n):
    """生成器方式"""
    return list(x * 2 for x in range(n) if x % 2 == 0)

@timing_decorator
def lazy_generator_approach(n):
    """惰性生成器方式"""
    def gen():
        for x in range(n):
            if x % 2 == 0:
                yield x * 2
    return gen()

## 性能测试
n = 100000

print("性能对比测试:")
list_result = list_approach(n)
generator_result = generator_approach(n)
lazy_gen = lazy_generator_approach(n)

print(f"\n 结果长度对比:")
print(f"列表长度: {len(list_result)}")
print(f"生成器转列表长度: {len(generator_result)}")
print(f"惰性生成器前 10 个: {[next(lazy_gen) for _ in range(10)]}")
```

## 相关函数与模块

### 内置函数
- `next()` - 获取生成器的下一个值
- `iter()` - 创建迭代器
- `enumerate()` - 枚举迭代器
- `zip()` - 并行迭代多个序列

### 标准库模块
- `itertools` - 迭代器工具，提供强大的生成器功能
- `functools` - 函数工具，包含生成器相关装饰器
- `collections.abc` - 抽象基类，定义生成器接口
- `asyncio` - 异步编程，基于协程

## 🔗 相关内容

- [函数定义与调用](../functions/) - 理解函数基础
- [函数作用域与闭包](../function-scope/) - 协程中的作用域概念
- [装饰器 - lambda 表达式](../lambda/) - 协程启动装饰器的实现
- [异常处理 - raise/assert](../raise-assert/) - 协程中的异常处理
- [itertools 模块](../../stdlib/itertools/) - 生成器工具集

### 第三方库
- `more-itertools` - 扩展的迭代器工具
- `toolz` - 函数式编程工具
- `asyncio` - 异步生成器支持

## 📚 扩展阅读

- [Python 官方文档 - 生成器](https://docs.python.org/3/tutorial/classes.html#generators)
- [PEP 255 - Simple Generators](https://www.python.org/dev/peps/pep-0255/)
- [PEP 342 - Coroutines via Enhanced Generators](https://www.python.org/dev/peps/pep-0342/)
- [PEP 380 - Syntax for Delegating to a Subgenerator](https://www.python.org/dev/peps/pep-0380/)
- [Python 官方文档 - itertools 模块](https://docs.python.org/3/library/itertools.html)
- [Python 协程和异步编程](https://docs.python.org/3/library/asyncio.html)

## 🏷️ 标签

`Python` `生成器` `yield` `迭代器` `协程` `send` `内存优化` `惰性求值` `函数式编程` `数据流处理` `管道模式` `装饰器`

---

**最后更新**: 2024-01-15  
**作者**: Python 编程指南  
**版本**: 2.0