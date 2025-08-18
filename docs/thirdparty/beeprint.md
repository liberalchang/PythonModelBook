---
layout: doc
title: beeprint 库 - 更强大的美观输出工具
permalink: /docs/thirdparty/beeprint/
category: thirdparty
tags: [beeprint, 格式化输出, 调试, 第三方库, 美观打印]
description: beeprint 是一个第三方格式化输出库，比 pprint 更适合打印对象、长文本等复杂数据结构
author: Python 文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "初级"
---

# beeprint 库 - 更强大的美观输出工具

## 📝 概述

beeprint 是一个第三方库，提供美观的格式化输出功能。除了和 pprint 一样支持 dict、list、tuple 等常规数据结构的输出，还支持对象（object）属性的友好展示、长文本自动裁剪等高级特性。对于调试复杂对象结构和长文本内容非常有帮助。

## 🎯 学习目标

- 了解 beeprint 的安装和基本使用方法
- 掌握 beeprint 与 pprint 的输出差异
- 学会打印对象属性、控制排序和长文本裁剪
- 掌握高阶配置选项以适配不同输出需求

## 📋 前置知识

- 熟悉 Python 基本数据结构
- 能够使用 pip 或 conda 安装第三方库
- 了解 pprint 的基本使用（可选）

## 🔍 详细内容

### 安装 beeprint

```bash
pip install beeprint
```

### 基本对比示例

下面是与 pprint 的对比：

pprint 输出：

```python
{'entities': {'hashtags': [],
              'urls': [{'display_url': 'tumblr.com/xnr37hf0yz',
                        'expanded_url': 'http://tumblr.com/xnr37hf0yz',
                        'indices': [107, 126],
                        'url': 'http://t.co/cCIWIwg'}],
              'user_mentions': []}}
```

beeprint 输出：

```python
{
  'entities': {
    'hashtags': [],
    'urls': [
      {
        'display_url': 'tumblr.com/xnr37hf0yz',
        'expanded_url': 'http://tumblr.com/xnr37hf0yz',
        'indices': [107, 126],
        'url': 'http://t.co/cCIWIwg',
      },
    ],
    'user_mentions': [],
  },
}
```

### 打印类与实例

pprint 输出类信息：

```python
<class 'definition.NormalClassNewStyle'>
```

beeprint 输出类信息：

```python
class(NormalClassNewStyle):
  dicts: {
  },
  lists: [],
  static_props: 1,
  tuple: (1, 2)
```

pprint 输出实例信息：

```python
<definition.NormalClassNewStyle object at 0x7f338e5a9dd0>
```

beeprint 输出实例信息：

```python
instance(NormalClassNewStyle):
  dicts: {
  },
  lists: [],
  say_hi: 'hello world',
  static_props: 1,
  tuple: (1, 2)
```

### 打印长文本的差异

pprint 输出长文本列表：

```python
[["\nThe sky and the earth were at first one blurred entity like an egg. Pangu was born into it...",
  "\n据民间神话传说古时盘古生在黑暗团中，他不能忍受黑暗，用神斧劈向四方..." ]]
```

beeprint 会对长文本进行裁剪显示：

```python
[
  [
    '\nThe sky and the earth were at first one blurred entity like an egg. Pangu
     was born into it.\n \n\tThe separation of the sky and the earth took
     ...(12 hidden lines)',
    '\n据民间神话传说古时盘古生在黑暗团中，他不能忍受黑暗，用神斧劈向四方，逐渐
     使天空高远，大地辽阔。\n\t他为不使天地会重新合并，继续施展法术。每当盘古的
     ...(3 hidden lines)',
  ],
]
```

### beeprint.pp 函数

```python
beeprint.pp(o, output=True, max_depth=5, indent=2, width=80, sort_keys=True, config=None, **kwargs)
```

#### 参数要点

- sort_keys: 是否在打印字典时按 key 排序（pprint 默认排序，不可选）
- max_depth: 限制打印的最大深度
- width: 控制每行宽度
- indent: 控制缩进
- config: 通过 beeprint.Config 进行更详细的配置（例如长文本裁剪行为）

## 💡 实际应用

### 对象友好打印

```python
from beeprint import pp

class User:
    """用户类"""
    def __init__(self, name, age):
        self.name = name
        self.age = age
        self.hobbies = ['reading', 'coding']

u = User('Alice', 30)
pp(u)  # 以更友好的格式打印对象属性
```

### 控制字典排序输出

```python
from beeprint import pp

# 字典 key 的自定义排序输出
data = {"b": 2, "a": 1, "c": 3}
pp(data, sort_keys=False)  # 关闭按 key 排序
```

## ⚠️ 注意事项

- beeprint 不是标准库，需要额外安装
- 打印对象时会访问其可访问属性，请确保不会触发副作用
- 在日志场景下建议结合 logging 使用，避免在生产环境频繁使用标准输出

## 🔗 相关内容

- [pprint 模块 - 标准库美观输出](../../stdlib/pprint/)
- [print() - 内置输出函数](../../builtins/print/)

## 📚 扩展阅读

- 项目主页与文档: https://pypi.org/project/beeprint/
- 文章: https://zhuanlan.zhihu.com/p/42504137

## 🏷️ 标签

`beeprint` `格式化输出` `调试` `对象打印` `长文本裁剪`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档团队  
**版本**: 1.0