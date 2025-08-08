---
layout: doc
title: reversed() - 反转函数
permalink: /docs/builtins/reversed/
category: builtins
tags: [反转, 序列, 迭代器]
description: 返回反转的迭代器对象
author: Python 文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "初级"
---

# reversed() - 反转函数

## 📝 概述

`reversed()` 是 Python 中的内置函数，用于返回一个反转的迭代器。它可以处理序列（如列表、元组、字符串）或实现了`__reversed__()`方法的对象。<mcreference link="https://docs.python.org/3/library/functions.html" index="1">1</mcreference>

## 🎯 学习目标

- 掌握 reversed()函数的基本用法
- 理解 reversed()返回迭代器的特性
- 学会处理不同类型的序列
- 了解 reversed()与切片反转的区别
- 掌握在实际项目中的应用技巧

## 📋 前置知识

- Python 基本数据类型
- 序列类型（列表、元组、字符串）
- 迭代器和生成器的概念
- 切片操作的基本理解

## 🔍 详细内容

### 基本概念

`reversed()` 函数接受一个序列作为参数，返回一个反转的迭代器对象。这个迭代器可以用于遍历序列中的元素，但顺序是相反的。

### 语法格式

```python
reversed(seq)
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| seq | sequence | 是 | 无 | 要反转的序列对象 |

### 返回值

| 类型 | 说明 |
|------|------|
| reverse_iterator | 反转的迭代器对象 |

## 💡 实际应用

### 基础用法

```python
## 反转列表
numbers = [1, 2, 3, 4, 5]
reversed_numbers = reversed(numbers)
print(type(reversed_numbers))  # <class 'list_reverseiterator'>
print(list(reversed_numbers))  # [5, 4, 3, 2, 1]
print(numbers)                 # [1, 2, 3, 4, 5] (原列表不变)

## 反转字符串
text = "hello"
reversed_text = reversed(text)
print(list(reversed_text))     # ['o', 'l', 'l', 'e', 'h']
print(''.join(reversed(text))) # "olleh"

## 反转元组
data = (1, 2, 3, 4)
reversed_data = reversed(data)
print(tuple(reversed_data))    # (4, 3, 2, 1)

## 反转 range 对象
range_obj = range(5)
print(list(reversed(range_obj)))  # [4, 3, 2, 1, 0]

## 使用 for 循环遍历反转的序列
words = ['apple', 'banana', 'cherry']
print("正向遍历:")
for word in words:
    print(word)

print("\n 反向遍历:")
for word in reversed(words):
    print(word)

## 反转字典的键(Python 3.7+字典有序)
data_dict = {'a': 1, 'b': 2, 'c': 3}
print("正向键:", list(data_dict.keys()))
print("反向键:", list(reversed(data_dict.keys())))
print("反向值:", list(reversed(data_dict.values())))
print("反向项:", list(reversed(data_dict.items())))
```

### 迭代器特性

```python
## reversed()返回迭代器,只能遍历一次
numbers = [1, 2, 3, 4, 5]
rev_iter = reversed(numbers)

print("第一次遍历:")
for num in rev_iter:
    print(num, end=' ')  # 5 4 3 2 1

print("\n 第二次遍历:")
for num in rev_iter:
    print(num, end=' ')  # 无输出,迭代器已耗尽

## 如需多次使用,重新创建迭代器
print("\n 重新创建迭代器:")
rev_iter = reversed(numbers)
for num in rev_iter:
    print(num, end=' ')  # 5 4 3 2 1

## 或者转换为列表
rev_list = list(reversed(numbers))
print("\n 转换为列表后多次使用:")
print(rev_list)  # [5, 4, 3, 2, 1]
print(rev_list)  # [5, 4, 3, 2, 1]

## 使用 next()函数逐个获取元素
rev_iter = reversed([1, 2, 3])
print("\n 使用 next()获取元素:")
print(next(rev_iter))  # 3
print(next(rev_iter))  # 2
print(next(rev_iter))  # 1
## print(next(rev_iter))  # StopIteration 异常

## 安全使用 next()with 默认值
rev_iter = reversed([1, 2, 3])
while True:
    value = next(rev_iter, None)
    if value is None:
        break
    print(f"值: {value}")
```

### 与切片反转的比较

```python
## 方法 1: 使用 reversed()
numbers = [1, 2, 3, 4, 5]
method1 = list(reversed(numbers))
print(f"reversed(): {method1}")

## 方法 2: 使用切片
method2 = numbers[::-1]
print(f"切片[::-1]: {method2}")

## 性能比较
import time

large_list = list(range(1000000))

## 测试 reversed()
start = time.time()
result1 = list(reversed(large_list))
time1 = time.time() - start

## 测试切片
start = time.time()
result2 = large_list[::-1]
time2 = time.time() - start

print(f"\nreversed()耗时: {time1:.4f}秒")
print(f"切片[::-1]耗时: {time2:.4f}秒")
print(f"切片更快: {time1/time2:.2f}倍")

## 内存使用差异
print(f"\nreversed()返回: {type(reversed(numbers))}")
print(f"切片返回: {type(numbers[::-1])}")

## reversed()的优势:惰性求值
def demonstrate_lazy_evaluation():
    """演示惰性求值的优势"""
    large_range = range(1000000)
    
#    # reversed()不会立即创建所有元素
    rev_iter = reversed(large_range)
    print(f"创建 reversed 迭代器: {type(rev_iter)}")
    
#    # 只获取前 3 个元素
    first_three = []
    for i, value in enumerate(rev_iter):
        if i >= 3:
            break
        first_three.append(value)
    
    print(f"前 3 个反转元素: {first_three}")
    return first_three

demonstrate_lazy_evaluation()
```

### 高级用法

```python
## 自定义类实现__reversed__方法
class CustomSequence:
    def __init__(self, data):
        self.data = data
    
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, index):
        return self.data[index]
    
    def __reversed__(self):
        """自定义反转逻辑"""
        print("调用自定义__reversed__方法")
        for i in range(len(self.data) - 1, -1, -1):
            yield self.data[i]
    
    def __repr__(self):
        return f"CustomSequence({self.data})"

custom_seq = CustomSequence([1, 2, 3, 4, 5])
print(f"原序列: {custom_seq}")
print(f"反转后: {list(reversed(custom_seq))}")

## 处理嵌套结构
nested_list = [[1, 2], [3, 4], [5, 6]]
print(f"\n 原嵌套列表: {nested_list}")
print(f"反转外层: {list(reversed(nested_list))}")

## 反转每个子列表
reversed_nested = [list(reversed(sublist)) for sublist in reversed(nested_list)]
print(f"完全反转: {reversed_nested}")

## 字符串处理
def reverse_words_in_sentence(sentence):
    """反转句子中每个单词,但保持单词顺序"""
    words = sentence.split()
    reversed_words = [''.join(reversed(word)) for word in words]
    return ' '.join(reversed_words)

def reverse_sentence_order(sentence):
    """反转句子中单词的顺序"""
    words = sentence.split()
    return ' '.join(reversed(words))

sentence = "Hello World Python"
print(f"\n 原句子: {sentence}")
print(f"反转单词内容: {reverse_words_in_sentence(sentence)}")
print(f"反转单词顺序: {reverse_sentence_order(sentence)}")

## 数据结构操作
class Stack:
    """使用列表实现的栈"""
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        if self.items:
            return self.items.pop()
        return None
    
    def peek(self):
        if self.items:
            return self.items[-1]
        return None
    
    def reverse_view(self):
        """返回栈的反转视图(不修改原栈)"""
        return list(reversed(self.items))
    
    def __repr__(self):
        return f"Stack({self.items})"

stack = Stack()
for i in range(1, 6):
    stack.push(i)

print(f"\n 栈内容: {stack}")
print(f"反转视图: {stack.reverse_view()}")
print(f"栈顶元素: {stack.peek()}")
```

### 实际案例

```python
## 回文检查
def is_palindrome(text):
    """检查文本是否为回文"""
#    # 清理文本:移除空格和标点,转为小写
    import re
    cleaned = re.sub(r'[^a-zA-Z0-9]', '', text.lower())
    
#    # 方法 1:使用 reversed()
    return cleaned == ''.join(reversed(cleaned))
    
#    # 方法 2:使用切片(更简洁)
#    # return cleaned == cleaned[::-1]

test_texts = [
    "A man a plan a canal Panama",
    "race a car",
    "hello",
    "Madam",
    "12321"
]

print("回文检查:")
for text in test_texts:
    result = is_palindrome(text)
    print(f"'{text}' -> {result}")

## 文件行反转处理
def reverse_file_lines(content):
    """反转文件行的顺序"""
    lines = content.strip().split('\n')
    return '\n'.join(reversed(lines))

sample_content = """第一行
第二行
第三行
第四行"""

print(f"\n 原文件内容:\n{sample_content}")
print(f"\n 反转后:\n{reverse_file_lines(sample_content)}")

## 数据分析:时间序列反转
class TimeSeriesData:
    def __init__(self, timestamps, values):
        self.timestamps = timestamps
        self.values = values
    
    def reverse_chronological(self):
        """按时间倒序排列"""
        rev_timestamps = list(reversed(self.timestamps))
        rev_values = list(reversed(self.values))
        return TimeSeriesData(rev_timestamps, rev_values)
    
    def get_recent_data(self, n=5):
        """获取最近 n 个数据点"""
        recent_timestamps = []
        recent_values = []
        
        for i, (timestamp, value) in enumerate(zip(reversed(self.timestamps), 
                                                   reversed(self.values))):
            if i >= n:
                break
            recent_timestamps.append(timestamp)
            recent_values.append(value)
        
        return list(reversed(recent_timestamps)), list(reversed(recent_values))
    
    def __repr__(self):
        return f"TimeSeriesData(len={len(self.timestamps)})"

## 模拟时间序列数据
timestamps = ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05']
values = [100, 105, 98, 110, 115]

ts_data = TimeSeriesData(timestamps, values)
print(f"\n 原时间序列: {list(zip(ts_data.timestamps, ts_data.values))}")

reversed_data = ts_data.reverse_chronological()
print(f"反转时间序列: {list(zip(reversed_data.timestamps, reversed_data.values))}")

recent_times, recent_vals = ts_data.get_recent_data(3)
print(f"最近 3 个数据点: {list(zip(recent_times, recent_vals))}")

## 算法应用:反转链表模拟
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
    
    def __repr__(self):
        return f"ListNode({self.val})"

class LinkedList:
    def __init__(self, values=None):
        self.head = None
        if values:
            for val in values:
                self.append(val)
    
    def append(self, val):
        new_node = ListNode(val)
        if not self.head:
            self.head = new_node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = new_node
    
    def to_list(self):
        """转换为 Python 列表"""
        result = []
        current = self.head
        while current:
            result.append(current.val)
            current = current.next
        return result
    
    def reverse_using_builtin(self):
        """使用内置函数反转"""
        values = self.to_list()
        reversed_values = list(reversed(values))
        return LinkedList(reversed_values)
    
    def __repr__(self):
        return f"LinkedList({self.to_list()})"

## 测试链表反转
original_list = LinkedList([1, 2, 3, 4, 5])
print(f"\n 原链表: {original_list}")

reversed_list = original_list.reverse_using_builtin()
print(f"反转链表: {reversed_list}")

## 游戏开发:撤销操作
class GameState:
    def __init__(self):
        self.history = []
        self.current_state = {"player_pos": (0, 0), "score": 0}
    
    def save_state(self):
        """保存当前状态"""
        self.history.append(self.current_state.copy())
    
    def make_move(self, new_pos, score_change):
        """执行移动"""
        self.save_state()
        self.current_state["player_pos"] = new_pos
        self.current_state["score"] += score_change
    
    def undo_moves(self, steps=1):
        """撤销指定步数的移动"""
        if len(self.history) < steps:
            steps = len(self.history)
        
#        # 使用 reversed()获取最近的状态
        recent_states = list(reversed(self.history))[:steps]
        
        if recent_states:
#            # 恢复到指定步数前的状态
            self.current_state = recent_states[-1].copy()
#            # 移除撤销的历史记录
            self.history = self.history[:-steps]
    
    def get_move_history(self):
        """获取移动历史(最新的在前)"""
        return list(reversed(self.history))
    
    def __repr__(self):
        return f"GameState(pos={self.current_state['player_pos']}, score={self.current_state['score']})"

## 测试游戏状态管理
game = GameState()
print(f"\n 初始状态: {game}")

## 执行一系列移动
moves = [((1, 0), 10), ((2, 0), 15), ((2, 1), 20), ((3, 1), 25)]
for pos, score in moves:
    game.make_move(pos, score)
    print(f"移动到 {pos},得分 +{score}: {game}")

print(f"\n 移动历史: {[state['player_pos'] for state in game.get_move_history()]}")

## 撤销操作
print("\n 撤销 2 步:")
game.undo_moves(2)
print(f"撤销后状态: {game}")
print(f"剩余历史: {[state['player_pos'] for state in game.get_move_history()]}")
```

## ⚠️ 注意事项

- `reversed()` 返回迭代器，只能遍历一次
- 不是所有对象都支持 `reversed()`，需要是序列或实现 `__reversed__()` 方法
- 对于大数据集，`reversed()` 比切片更节省内存
- 字典在 Python 3.7+中保持插入顺序，可以使用 `reversed()`

```python
## 错误示例和解决方案

## 1. 不支持 reversed()的对象
try:
    result = reversed({1, 2, 3})  # 集合不支持 reversed()
except TypeError as e:
    print(f"错误: {e}")
#    # 解决方案:先转换为列表
    result = list(reversed(list({1, 2, 3})))
    print(f"解决方案: {result}")

## 2. 迭代器耗尽问题
numbers = [1, 2, 3, 4, 5]
rev_iter = reversed(numbers)

## 第一次使用
first_use = list(rev_iter)
print(f"第一次使用: {first_use}")

## 第二次使用(迭代器已耗尽)
second_use = list(rev_iter)
print(f"第二次使用: {second_use}")  # []

## 解决方案:重新创建或转换为列表
rev_list = list(reversed(numbers))
print(f"转换为列表: {rev_list}")

## 3. 内存使用考虑
import sys

large_list = list(range(100000))

## reversed()返回迭代器(内存友好)
rev_iter = reversed(large_list)
print(f"迭代器大小: {sys.getsizeof(rev_iter)} bytes")

## 切片创建新列表(内存消耗大)
rev_slice = large_list[::-1]
print(f"切片列表大小: {sys.getsizeof(rev_slice)} bytes")

## 4. 字符串反转的不同方法
text = "hello world"

## 方法 1:reversed() + join
method1 = ''.join(reversed(text))
print(f"reversed(): {method1}")

## 方法 2:切片
method2 = text[::-1]
print(f"切片: {method2}")

## 性能比较
import timeit

text = "hello world" * 1000

time1 = timeit.timeit(lambda: ''.join(reversed(text)), number=10000)
time2 = timeit.timeit(lambda: text[::-1], number=10000)

print(f"\nreversed()耗时: {time1:.4f}秒")
print(f"切片耗时: {time2:.4f}秒")
print(f"切片更快: {time1/time2:.2f}倍")
```

## 🔗 相关内容

- [sorted() - 排序函数](../sorted/)
- [list.reverse() - 列表反转方法](../list.md#reverse)
- [slice - 切片操作](../slice/)
- [iter() - 迭代器函数](../iter/)

## 📚 扩展阅读

- [Python 官方文档 - reversed()](https://docs.python.org/3/library/functions.html#reversed)
- [Python 迭代器和生成器](https://docs.python.org/3/tutorial/classes.html#iterators)
- [序列类型操作](https://docs.python.org/3/library/stdtypes.html#sequence-types-list-tuple-range)

## 🏷️ 标签

`反转` `序列` `迭代器` `惰性求值` `内存优化`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档工程师  
**版本**: 1.0