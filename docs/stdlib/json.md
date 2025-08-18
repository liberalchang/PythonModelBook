---
layout: doc
title: json 模块
permalink: /docs/stdlib/json/
category: stdlib
tags: [JSON, 序列化, 反序列化, 数据格式, Unicode, 编码]
description: Python json 模块详解 - 将 Python 对象与 JSON 文本互转，支持定制编码与解码，Unicode处理
author: Python教程
date: 2024-12-19
updated: 2024-12-19
version: 1.0
difficulty: "初级"
---

# json 模块

## 📝 概述

JSON (JavaScript Object Notation) 是一种轻量级的数据交换格式，易于人阅读和编写，同时也易于机器解析和生成。Python 的 json 模块提供将 Python 对象编码为 JSON 字符串（序列化）和将 JSON 字符串解码为 Python 对象（反序列化）的功能，广泛用于配置、接口通信和数据存储。

## 🎯 学习目标

- 理解 JSON 格式和数据类型映射关系
- 熟悉 dumps/loads 与 dump/load 的区别
- 掌握缩进、美化、确保中文不转义等参数
- 了解对象钩子、默认编码等高级定制
- 解决 Unicode 和中文编码问题

## 📋 前置知识

- Python 基本数据结构（dict/list/str/int/float）
- 文件读写与文本编码
- 字符编码基础（UTF-8、Unicode）

## 🔍 详细内容

### JSON 格式和数据类型

JSON 支持基本类型（字符串，数字，布尔），以及嵌套数组和对象。下面是一个标准的 JSON 数据格式：

```json
{  
  "firstName": "Jane",  
  "lastName": "Doe",  
  "hobbies": [  
    "running",  
    "swimming",  
    "singing"  
  ],  
  "age": 28,  
  "children": [  
    {  
      "firstName": "Alex",  
      "age": 5  
    },  
    {  
      "firstName": "Bob",  
      "age": 7  
    }  
  ]  
}
```

### Python 与 JSON 类型映射

从 Python 到 JSON 的转换：

| Python           | JSON   |
| ---------------- | ------ |
| dict             | object |
| list, tuple      | array  |
| str              | string |
| int, long, float | number |
| True             | true   |
| False            | false  |
| None             | null   |

从 JSON 到 Python 的转换：

| JSON          | Python |
| ------------- | ------ |
| object        | dict   |
| array         | list   |
| string        | str    |
| number (int)  | int    |
| number (real) | float  |
| true          | True   |
| false         | False  |
| null          | None   |

### 基本用法：内存与文件

#### 从 Python 到 JSON

```python
import json

# 基本转换
person = {  
    "name": "John",  
    "age": 30,  
    "city": "New York",  
    "hasChildren": False,  
    "titles": ["engineer", "programmer"],  
}

# 转换为 JSON 字符串  
person_json = json.dumps(person)  
print(person_json)
# 输出: {"name": "John", "age": 30, "city": "New York", "hasChildren": false, "titles": ["engineer", "programmer"]}

# 指定其他参数进行美化  
person_json2 = json.dumps(  
    person,  
    indent=4,  
    separators=("; ", "= "),  
    sort_keys=True,  
)  
print(person_json2)
```

#### 从 JSON 到 Python

```python
import json

# JSON 字符串  
person_json = """  
{  
    "age": 30,   
    "city": "New York",  
    "hasChildren": false,   
    "name": "John",  
    "titles": [  
        "engineer",  
        "programmer"  
    ]  
}  
"""

# 转为 Python 对象  
person = json.loads(person_json)  
print(person)
print(person["name"])  # 正确的访问方式
```

#### 文件操作

```python
import json

# 保存到文件
person = {  
    "name": "John",  
    "age": 30,  
    "city": "New York",  
    "hasChildren": False,  
    "titles": ["engineer", "programmer"],  
}

# 写入文件（带缩进、美化）
with open("./person.json", "w", encoding="utf-8") as f:  
    json.dump(person, f, ensure_ascii=False, indent=2)

# 从文件读取
with open('./person.json', 'r', encoding="utf-8") as f:  
    person = json.load(f)  
    print(person)
```

### Unicode 和中文处理

#### 中文显示问题

在 Python 中经常遇见直接 print dict（字典），或者 dict 转 json 时，中文变成 Unicode 码的情况：

```python
import json

d = {'name': '张三', 'age': '1'}
print(d)  # {'age': '1', 'name': '\xe5\xbc\xa0\xe4\xb8\x89'}

jd = json.dumps(d)
print(jd)  # {"age": "1", "name": "\u5f20\u4e09"}
```

#### 解决方案

要将字典中的中文正确输出，需要使用 `ensure_ascii=False` 参数：

```python
import json

d = {'name': '张三', 'age': '1'}
jd = json.dumps(d, ensure_ascii=False, encoding='utf-8')
print(jd)  # {"age": "1", "name": "张三"}

# Python 3 版本文件写入解决方案
with open('filename.json', 'w', encoding="utf-8") as f:
    f.write(json.dumps(d, ensure_ascii=False))
```

#### 参数说明

- `ensure_ascii=False`: 不将非 ASCII 字符转义为 \uXXXX 序列
- `encoding='utf-8'`: 指定字符编码（Python 2 中需要，Python 3 中可省略）

### 自定义编码解码

#### 自定义编码

对于自定义对象，需要提供转换函数：

```python
import json

def encode_complex(z):  
    if isinstance(z, complex):  
        return {z.__class__.__name__: True, "real": z.real, "imag": z.imag}  
    else:  
        raise TypeError(f"'{z.__class__.__name__}' 不是指定的格式！")  

z = 5 + 9j  
zJSON = json.dumps(z, default=encode_complex)  
print(zJSON)  # {"complex": true, "real": 5.0, "imag": 9.0}
```

#### 自定义编码器类

```python
import json
from json import JSONEncoder

class ComplexEncoder(JSONEncoder):  
    def default(self, o):  
        if isinstance(o, complex):  
            return {o.__class__.__name__: True, "real": o.real, "imag": o.imag}  
        return JSONEncoder.default(self, o)  

z = 5 + 9j  
zJSON = json.dumps(z, cls=ComplexEncoder)  
print(zJSON)
```

#### 自定义解码

```python
import json

def decode_complex(dct):  
    if complex.__name__ in dct:  
        return complex(dct["real"], dct["imag"])  
    return dct  

zJSON = '{"complex": true, "real": 5.0, "imag": 9.0}'
z = json.loads(zJSON, object_hook=decode_complex)  
print(type(z))  # <class 'complex'>
print(z)        # (5+9j)
```

#### 通用对象编码解码

```python
import json

class User:  
    def __init__(self, name, age, active, balance, friends):  
        self.name = name  
        self.age = age  
        self.active = active  
        self.balance = balance  
        self.friends = friends  

def encode_obj(obj):  
    """将自定义对象转换为字典表示"""
    obj_dict = {  
        "__class__": obj.__class__.__name__,  
        "__module__": obj.__module__,  
    }  
    obj_dict.update(obj.__dict__)  
    return obj_dict  

def decode_dct(dct):  
    """将字典转换回自定义对象"""
    if "__class__" in dct:  
        class_name = dct.pop("__class__")  
        module_name = dct.pop("__module__")  
        module = __import__(module_name)  
        class_ = getattr(module, class_name)  
        obj = class_(**dct)  
    else:  
        obj = dct  
    return obj  

# 使用示例
user = User("John", 28, True, 20.70, ["Jane", "Tom"])  
userJSON = json.dumps(user, default=encode_obj, indent=4, sort_keys=True)  
print(userJSON)

user_decoded = json.loads(userJSON, object_hook=decode_dct)  
print(type(user_decoded))  # <class '__main__.User'>
```

### 高级参数和技巧

#### sort_keys 排序

```python
import json

data1 = {'b':789,'c':456,'a':123}
data2 = {'a':123,'b':789,'c':456}

d1 = json.dumps(data1, sort_keys=True)
d2 = json.dumps(data2)
d3 = json.dumps(data2, sort_keys=True)

print('sorted data1(d1):', d1)      # {"a": 123, "b": 789, "c": 456}
print('unsorted data2(d2):', d2)    # {"a": 123, "c": 456, "b": 789}
print('sorted data2(d3):', d3)      # {"a": 123, "b": 789, "c": 456}
print('d1==d3?:', d1==d3)           # True
```

#### indent 缩进美化

```python
import json

data = {'b':789,'c':456,'a':123}
d1 = json.dumps(data, sort_keys=True, indent=4)
print('4 indented data:\n', d1)

# 解码时会自动移除缩进
d2 = json.loads(d1)
print('decoded DATA:', repr(d2))
```

#### separators 压缩

```python
import json

data = {'b':789,'c':456,'a':123}
print('DATA:', repr(data))
print('repr(data)             :', len(repr(data)))
print('dumps(data)            :', len(json.dumps(data)))
print('dumps(data, indent=4)  :', len(json.dumps(data, indent=4)))
print('dumps(data, separators):', len(json.dumps(data, separators=(',',':'))))
```

#### skipkeys 跳过非法键

```python
import json

data = {'b':789,'c':456,(1,2):123}
print('original data:', repr(data))
print('json encoded:', json.dumps(data, skipkeys=True))  # 跳过 (1,2) 键
```

## 💡 实际应用

### 1. 与 HTTP API 配合

```python
from http.client import HTTPSConnection
import json

conn = HTTPSConnection('httpbin.org')
conn.request('GET', '/json')
resp = conn.getresponse()
data = json.loads(resp.read().decode('utf-8'))
print(list(data.keys()))
conn.close()
```

### 2. 配置文件处理

```python
import json

# 读取配置
with open('config.json', 'r', encoding='utf-8') as f:
    config = json.load(f)

# 修改配置
config['debug'] = True
config['database']['host'] = 'localhost'

# 保存配置
with open('config.json', 'w', encoding='utf-8') as f:
    json.dump(config, f, ensure_ascii=False, indent=2)
```

### 3. 读取行分隔 JSON（NDJSON）

```python
import json

lines = ['{"id":1}', '{"id":2}', '{"id":3}']
items = [json.loads(line) for line in lines]
print(items)  # [{'id': 1}, {'id': 2}, {'id': 3}]
```

### 4. 字符串转字典的多种方法

#### 方法一：json.loads（推荐）

```python
import json

user_info = '{"name" : "john", "gender" : "male", "age": 28}'
user_dict = json.loads(user_info)
print(user_dict)  # {'name': 'john', 'gender': 'male', 'age': 28}
```

#### 方法二：ast.literal_eval（最安全）

```python
import ast

user_info = "{'name' : 'john', 'gender' : 'male', 'age': 28}"
user_dict = ast.literal_eval(user_info)
print(user_dict)  # {'name': 'john', 'gender': 'male', 'age': 28}
```

#### 方法三：eval（不推荐，有安全风险）

```python
# 不推荐使用，存在安全隐患
user_info = "{'name' : 'john', 'gender' : 'male', 'age': 28}"
user_dict = eval(user_info)  # 可能执行恶意代码
```

### 5. 与 dataclass 结合使用

```python
import json
from dataclasses import dataclass, asdict

@dataclass
class User:
    name: str
    age: int

u = User("Alice", 28)

# 序列化
s = json.dumps(u, default=lambda o: asdict(o), ensure_ascii=False)
print(s)

# 反序列化
u2 = User(**json.loads(s))
print(u2)
```

## ⚠️ 注意事项

### 数据类型限制

- JSON 不支持 Python 的 set、complex、datetime 等类型，需要自定义转换
- tuple 会被转换为 list
- dict 的键必须是字符串类型

### 编码问题

- 使用 `ensure_ascii=False` 避免中文被转义为 `\uXXXX`
- 文件操作时指定正确的编码（通常是 UTF-8）
- 注意 Python 2 和 Python 3 在 Unicode 处理上的差异

### 精度问题

- 浮点精度问题：金融场景推荐使用 Decimal，或以整数（最小货币单位）传输
- 大整数可能在某些 JavaScript 环境中丢失精度

### 安全考虑

- 不要使用 `eval()` 解析 JSON 字符串
- 使用 `ast.literal_eval()` 作为更安全的替代方案

## 🔗 相关内容

- [ast 模块](../ast/) - 抽象语法树操作
- [xml.etree.ElementTree 模块](../xml.etree.ElementTree/) - XML 解析与生成
- [urllib 模块](../urllib/) - HTTP 客户端
- [http.client 模块](../http.client/) - 低层 HTTP 客户端
- [csv 模块](../csv/) - CSV 读写与互转

## 📚 扩展阅读

- [官方文档](https://docs.python.org/3/library/json.html)
- [JSON 规范（ECMA-404）](https://www.ecma-international.org/publications-and-standards/standards/ecma-404/)
- [JSON 官方网站](https://www.json.org/)

## 🏷️ 标签

`JSON` `序列化` `反序列化` `数据格式` `Unicode` `编码`

---

**最后更新**: 2024-12-19  
**作者**: Python教程  
**版本**: 1.0