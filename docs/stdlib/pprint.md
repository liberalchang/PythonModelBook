---
layout: doc
title: pprint 模块 - 数据结构美观输出
permalink: /docs/stdlib/pprint/
category: stdlib
tags: [pprint, 格式化输出, 调试, 数据结构, 美观打印]
description: Python pprint 模块的完整指南，提供数据结构的美观格式化输出功能
author: Python 文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "初级"
---

# pprint 模块 - 数据结构美观输出

## 📝 概述

pprint 模块是 Python 标准库模块，全称 pretty printer，可以让各种数据结构更美观地输出。相比于 print() 函数将所有输出结果都显示在一行，pprint 模块打印的数据结构更加完整，每行为一个数据结构，更加方便阅读和调试代码。

## 🎯 学习目标

- 掌握 pprint 模块的基本使用方法
- 了解 pprint 与 print 的区别和优势
- 学会使用各种参数来控制输出格式
- 掌握 PrettyPrinter 类的使用方法
- 学会在实际开发中应用 pprint 进行调试

## 📋 前置知识

- Python 基本语法和数据类型
- 字典、列表等数据结构的基本操作
- 了解标准输出和文件输出概念

## 🔍 详细内容

### pprint 与 print 的对比

普通的 print() 函数输出结果都在一行，不方便查看复杂的数据结构：

```python
## 使用 print 输出复杂数据结构
game = {
    'players': [
        {'name': 'player_1', 'hp': 3}, 
        {'name': 'player_2', 'hp': 5}
    ]
}

print(game)
# 输出: {'players': [{'name': 'player_1', 'hp': 3}, {'name': 'player_2', 'hp': 5}]}
```

而 pprint 模块可以让数据结构以更美观的格式输出：

```python
import pprint

## 使用 pprint 输出同样的数据结构
pprint.pprint(game, width=4)
# 输出:
# {'players': [{'hp': 3,
#               'name': 'player_1'},
#              {'hp': 5,
#               'name': 'player_2'}]}
```

### 基本用法示例

```python
from pprint import pprint

# 创建测试数据
name_age = {
    "张三": 24,
    "小明": 18,
    "小开": 22,
}

# 按条件筛选出大于20岁的人
name_big20 = {key: value for key, value in name_age.items() if value >= 20}
pprint(name_big20)

# 按提供人名找出信息
name_in = ["张三", "小王"]
name_yet = {key: value for key, value in name_age.items() if key in name_in}
pprint(name_yet)
```

## 💡 实际应用

### pprint.pprint() 函数

```python
pprint.pprint(object, stream=None, indent=1, width=80, depth=None, *, compact=False)
```

#### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|------|
| object | Any | 是 | 无 | 要打印的对象 |
| stream | TextIO | 否 | sys.stdout | 输出流，默认是屏幕输出 |
| indent | int | 否 | 1 | 缩进空格数 |
| width | int | 否 | 80 | 每行最大宽度，超过宽度会换行 |
| depth | int | 否 | None | 限制数据的层级，可以限制过多的嵌套 |
| compact | bool | 否 | False | 若设为 True，则输出会在接近 width 限制才进行换行 |

#### 使用示例

```python
import pprint

# 测试数据
stuff = ['spam', 'eggs', 'lumberjack', 'knights', 'ni']
stuff.insert(0, stuff[:])  # 添加嵌套结构

# 使用不同的缩进
pprint.pprint(stuff, indent=4)
# 输出:
# [   ['spam', 'eggs', 'lumberjack', 'knights', 'ni'],
#     'spam',
#     'eggs',
#     'lumberjack',
#     'knights',
#     'ni']

# 使用 compact 参数
pprint.pprint(stuff, width=41, compact=True)
# 输出:
# [['spam', 'eggs', 'lumberjack',
#   'knights', 'ni'],
#  'spam', 'eggs', 'lumberjack', 'knights',
#  'ni']
```

### pprint.pformat() 函数

```python
pprint.pformat(object, indent=1, width=80, depth=None, *, compact=False)
```

和 pprint.pprint() 的区别是，该函数不会打印到输出流，而是返回一个格式化字符串：

```python
import pprint

stuff = ['spam', 'eggs', 'lumberjack', 'knights', 'ni']
stuff.insert(0, stuff)

# 获取格式化字符串
formatted_string = pprint.pformat(stuff)
print(f"格式化结果:\n{formatted_string}")

# 处理递归引用
pprint.pprint(stuff)
# 输出:
# [<Recursion on list with id=...>,
#  'spam',
#  'eggs',
#  'lumberjack',
#  'knights',
#  'ni']
```

### PrettyPrinter 类

当需要复用格式化设置时，可以创建 PrettyPrinter 对象：

```python
class pprint.PrettyPrinter(indent=1, width=80, depth=None, stream=None, *, compact=False)
```

#### 使用示例

```python
import pprint

# 创建自定义的 PrettyPrinter 对象
pp = pprint.PrettyPrinter(width=40, compact=True)

# 测试数据
game = {
    'players': [
        {'name': 'player_1', 'hp': 3}, 
        {'name': 'player_2', 'hp': 5}
    ]
}

stuff = ['spam', 'eggs', 'lumberjack', 'knights', 'ni']

# 使用自定义格式打印
pp.pprint(game)
# 输出:
# {'players': [{'hp': 3,
#               'name': 'player_1'},
#              {'hp': 5,
#               'name': 'player_2'}]}

pp.pprint(stuff)
# 输出:
# ['spam', 'eggs', 'lumberjack',
#  'knights', 'ni']
```

### 高级用法

#### 控制输出深度

```python
import pprint

# 创建深层嵌套的数据结构
deep_data = {
    'level1': {
        'level2': {
            'level3': {
                'level4': {
                    'data': 'deep_value'
                }
            }
        }
    }
}

# 限制输出深度
pprint.pprint(deep_data, depth=2)
# 输出会在第2层停止，更深的层次显示为 {...}
```

#### 自定义输出流

```python
import pprint
import io

# 创建字符串缓冲区
string_buffer = io.StringIO()

# 将输出重定向到字符串缓冲区
data = {'key1': 'value1', 'key2': [1, 2, 3, 4, 5]}
pprint.pprint(data, stream=string_buffer)

# 获取输出内容
output = string_buffer.getvalue()
print(f"捕获的输出:\n{output}")
```

## ⚠️ 注意事项

- pprint 是一个模块，使用前需要先导入
- 对于简单的数据结构，pprint 和 print 的输出差别不大
- pprint 主要优势体现在复杂的嵌套数据结构上
- width 参数不会强制分割单个对象，比如一段长字符串不会被换行
- 递归引用的对象会被特殊标记显示，避免无限递归

## 🔗 相关内容

- [print() - 基础输出函数](../print/)
- [format() - 字符串格式化函数](../../builtins/format/)
- [f-string - 格式化字符串字面量](../../builtins/f-string/)
- [logging 模块 - 日志记录](../logging/)

## 📚 扩展阅读

- [pprint 官方文档](https://docs.python.org/3/library/pprint.html)
- [Python 调试技巧](https://docs.python.org/3/library/debug.html)

## 🏷️ 标签

`pprint` `格式化输出` `调试` `数据结构` `美观打印`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档团队  
**版本**: 1.0