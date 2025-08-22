---
layout: doc
title: 异步生成器与异步迭代器：async def + yield 完全指南
permalink: /docs/basics/async-generators/
category: basics
tags: [异步编程, 协程, 异步生成器, 异步迭代器, yield]
description: 深入理解 Python 异步生成器和异步迭代器的实现原理、使用场景与最佳实践，掌握 async for、__aiter__ 和 __anext__ 的用法。
author: Python 编程指南
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# 异步生成器与异步迭代器：async def + yield 完全指南

## 概述

异步迭代器和异步生成器是 Python 异步编程中的重要组件，用于在异步环境中逐个生成数据。本文详细介绍异步迭代器协议（`__aiter__` 和 `__anext__`）的实现，以及使用异步生成器（`async def` + `yield`）的简化方案。

## 学习目标

- 掌握异步迭代器协议的实现方法
- 理解异步生成器的语法和特性
- 学会在实际场景中应用异步迭代和生成
- 掌握异步迭代中的异常处理和性能优化

## 异步迭代器协议

在 Python 中，异步迭代器需要实现两个特殊方法：

### __aiter__ 和 __anext__ 方法

1. **`__aiter__`**：
   - 返回异步迭代器对象本身
   - 必须是一个异步方法（使用 `async def`）
   - 通常直接返回 `self`

2. **`__anext__`**：
   - 异步返回迭代器的下一个值
   - 必须是一个异步方法（使用 `async def`）
   - 当迭代完成时，抛出 `StopAsyncIteration` 异常

### 手动实现异步迭代器

以下是一个完整的异步迭代器实现示例：

```python
import asyncio

class AsyncIteratorExample:
    def __init__(self, data):
        self.data = data  # 要迭代的数据
        self.index = 0    # 当前索引

    async def __aiter__(self):
        """返回异步迭代器对象本身"""
        return self

    async def __anext__(self):
        """异步返回下一个元素"""
        if self.index >= len(self.data):
            raise StopAsyncIteration  # 迭代完成时抛出异常
        
        value = self.data[self.index]
        self.index += 1
        await asyncio.sleep(1)  # 模拟异步延迟
        return value

# 使用示例
async def main():
    # 创建异步迭代器实例
    async_iter = AsyncIteratorExample([1, 2, 3, 4, 5])

    # 使用 async for 遍历
    async for item in async_iter:
        print(f"Got item: {item}")

# 运行异步程序
if __name__ == "__main__":
    asyncio.run(main())
```

### 实际应用场景：异步 API 迭代器

```python
import asyncio

class AsyncAPIIterator:
    def __init__(self, max_pages):
        self.max_pages = max_pages
        self.current_page = 0

    async def __aiter__(self):
        return self

    async def __anext__(self):
        if self.current_page >= self.max_pages:
            raise StopAsyncIteration
        
        # 模拟异步 API 调用
        await asyncio.sleep(1)
        data = f"Page {self.current_page}"
        self.current_page += 1
        return data

async def main():
    api_iter = AsyncAPIIterator(3)
    async for page in api_iter:
        print(f"Received: {page}")

if __name__ == "__main__":
    asyncio.run(main())
```

## 异步生成器（async def + yield）

异步生成器提供了更简洁的方式来创建异步迭代器，无需手动实现 `__aiter__` 和 `__anext__`。

### 基本语法

异步生成器使用 `async def` 定义，内部使用 `yield` 生成值：

```python
import asyncio

# 定义异步生成器
async def async_generator():
    for i in range(5):
        await asyncio.sleep(1)  # 模拟异步操作
        yield i

# 使用异步生成器
async def main():
    async for value in async_generator():
        print(f"Value: {value}")

# 运行
if __name__ == "__main__":
    asyncio.run(main())
```

### 核心特性

1. **异步迭代协议**：
   - 异步生成器自动实现 `__aiter__` 和 `__anext__`
   - 使用 `async for` 进行遍历
   - 支持 `StopAsyncIteration` 异常处理

2. **暂停与恢复**：
   - 每次 `yield` 时函数暂停，等待下一次迭代请求
   - `await` 允许在生成值前执行异步操作

3. **异常处理**：
   - 当生成器耗尽时，自动抛出 `StopAsyncIteration`

## 实际应用场景

### 场景 1：模拟异步数据流

```python
import asyncio

async def data_stream(max_items):
    """模拟从网络或数据库获取数据流"""
    for i in range(max_items):
        await asyncio.sleep(0.5)  # 模拟网络延迟
        yield f"Item {i}"

async def main():
    async for item in data_stream(3):
        print(f"Received: {item}")

if __name__ == "__main__":
    asyncio.run(main())
```

### 场景 2：异步 API 分页获取

```python
import asyncio

async def fetch_page(page):
    """模拟获取单页数据"""
    await asyncio.sleep(1)  # 模拟 API 请求延迟
    return [f"Data {page * 10 + i}" for i in range(3)]

async def api_paginator(max_pages):
    """异步分页数据生成器"""
    for page in range(max_pages):
        data = await fetch_page(page)
        for item in data:
            yield item

async def main():
    async for item in api_paginator(2):
        print(f"Got: {item}")

if __name__ == "__main__":
    asyncio.run(main())
```

### 场景 3：异常处理

```python
import asyncio

async def error_generator():
    """演示异步生成器中的异常处理"""
    yield "First"
    await asyncio.sleep(1)
    yield "Second"
    raise ValueError("Something went wrong")

async def main():
    try:
        async for value in error_generator():
            print(f"Value: {value}")
    except ValueError as e:
        print(f"Caught error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
```

## 高级用法

### 与 asyncio.gather 结合

```python
import asyncio

async def gen1():
    """生成器 1"""
    for i in range(3):
        await asyncio.sleep(1)
        yield f"Gen1: {i}"

async def gen2():
    """生成器 2"""
    for i in range(3):
        await asyncio.sleep(0.5)
        yield f"Gen2: {i}"

async def collect_results(generator):
    """收集异步生成器的所有结果"""
    results = []
    async for item in generator():
        results.append(item)
    return results

async def main():
    # 并发运行多个异步生成器
    results = await asyncio.gather(
        collect_results(gen1),
        collect_results(gen2)
    )
    print(f"Gen1 results: {results[0]}")
    print(f"Gen2 results: {results[1]}")

if __name__ == "__main__":
    asyncio.run(main())
```

### 使用队列的异步生成器

```python
import asyncio
from collections import deque

async def queue_generator(queue):
    """从队列中异步生成数据"""
    while queue:
        await asyncio.sleep(0.5)
        yield queue.popleft()

async def main():
    q = deque([1, 2, 3, 4])
    async for item in queue_generator(q):
        print(f"Item: {item}")

if __name__ == "__main__":
    asyncio.run(main())
```

## 手动实现 vs 异步生成器对比

| 特性                | 手动实现 (`__aiter__` 和 `__anext__`) | 异步生成器 (`yield`) |
|---------------------|-------------------------------|----------------------|
| 控制粒度            | 高，可完全自定义逻辑          | 中等，依赖生成器机制 |
| 代码复杂度          | 较高，需要手动管理状态        | 较低，更简洁         |
| 使用场景            | 需要复杂状态或自定义行为时    | 简单序列生成         |

## 异步生成器 vs 普通生成器对比

| 特性                | 普通生成器 (`yield`)          | 异步生成器 (`async yield`)   |
|---------------------|-------------------------------|-----------------------------|
| 定义方式            | `def`                        | `async def`                |
| 迭代方式            | `for`                        | `async for`                |
| 返回值处理          | 同步                         | 异步（需 `await`）         |
| 使用场景            | 同步数据生成                 | 异步 I/O 操作              |

## 注意事项与最佳实践

### 重要注意事项

1. **事件循环要求**：
   - 异步生成器必须在事件循环中运行
   - 使用 `asyncio.run` 或现有循环环境

2. **异常处理**：
   - `__anext__` 必须抛出 `StopAsyncIteration`
   - 建议在 `async for` 外层添加异常处理

3. **性能考虑**：
   - 适合 I/O 密集型任务，不适合 CPU 密集型任务
   - CPU 密集型任务应使用多线程或多进程

4. **兼容性**：
   - 异步迭代器在 Python 3.5+ 中引入
   - 异步生成器需要 Python 3.6+，推荐 3.7+

### 最佳实践

1. **优先使用异步生成器**：除非需要复杂的状态管理，否则优先选择异步生成器
2. **合理使用 await**：只在真正的异步操作处使用 await
3. **异常安全**：确保异步生成器中的异常能被正确处理
4. **资源管理**：使用 `async with` 管理需要清理的资源

## 相关内容

- [生成器与 yield 关键字](../yield/) - 理解普通生成器基础
- [协程常用方法与可等待对象](../coroutine-methods/) - 协程基础知识
- [并发运行多个任务：gather、as_completed、wait](../concurrent-tasks/) - 并发任务管理

## 扩展阅读

- [PEP 492 - Coroutines with async and await syntax](https://www.python.org/dev/peps/pep-0492/)
- [PEP 525 - Asynchronous Generators](https://www.python.org/dev/peps/pep-0525/)
- [Python 官方文档 - 异步迭代器](https://docs.python.org/3/reference/datamodel.html#async-iterators)
- [Python 协程和异步编程指南](https://docs.python.org/3/library/asyncio.html)

---

**最后更新**: 2024-01-15  
**作者**: Python 编程指南  
**版本**: 1.0