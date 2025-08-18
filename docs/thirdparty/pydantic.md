---
layout: doc
title: Pydantic - Python数据验证与模型库完全指南
permalink: /docs/thirdparty/pydantic/
category: thirdparty
tags: [Pydantic, 数据验证, BaseModel, FastAPI, 类型注解, 数据建模, 第三方库]
description: Pydantic是一个强大的Python数据验证库，通过类型注解进行数据验证和设置管理，特别适用于FastAPI等现代Web框架
author: Python技术文档工程师
date: 2024-01-16
updated: 2024-01-16
version: 1.0
difficulty: "中级"
---

# Pydantic - Python数据验证与模型库完全指南

## 📝 概述

Pydantic 是一个用于数据验证和设置管理的 Python 库，特别适用于 FastAPI 等框架。它通过定义数据模型来确保数据的有效性和一致性，利用Python的类型注解来执行运行时数据验证。

Pydantic的核心理念是"使用Python类型注解进行数据验证"，它能够：
- 在运行时验证数据类型的正确性
- 提供清晰的错误信息
- 序列化和反序列化数据
- 与现代IDE完美集成，提供类型提示

**官方文档**: https://docs.pydantic.dev/  
**中文文档**: https://pydantic.com.cn/  
**GitHub地址**: https://github.com/pydantic/pydantic

## 🎯 学习目标

- 掌握 Pydantic 的基本概念和 BaseModel 用法
- 学会定义数据模型和使用类型注解进行验证
- 掌握默认值、可选字段和嵌套模型的使用
- 学会创建自定义验证器和验证逻辑
- 了解数据序列化和反序列化的方法
- 掌握在 FastAPI 等框架中集成 Pydantic 的最佳实践

## 📋 前置知识

- Python 基础语法和面向对象编程
- Python 类型注解（Type Hints）的基本使用
- 字典、列表等基本数据结构操作
- 异常处理机制

## 🔧 安装

使用 pip 安装 Pydantic：

```bash
# 安装基础版本
pip install pydantic

# 安装完整版本（包含email验证等额外功能）
pip install "pydantic[email]"

# 安装Pydantic v2（推荐）
pip install "pydantic>=2.0"
```

## 🔍 详细内容

### 基本概念

Pydantic 的核心是 `BaseModel` 类，通过继承这个类来定义数据模型：

```python
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    email: str
```

### 创建实例与自动验证

创建模型实例时，Pydantic 会自动验证数据类型：

```python
# 正确的数据
user = User(id=1, name="John Doe", email="john@example.com")
print(user)

# 错误的数据类型会抛出验证错误
try:
    user = User(id="not-an-int", name="John Doe", email="john@example.com")
except ValueError as e:
    print(e)  # 打印验证错误信息
```

### 使用默认值和可选字段

你可以为字段设置默认值，或者使用 `Optional` 来定义可选字段：

```python
from typing import Optional

class User(BaseModel):
    id: int
    name: str
    email: str
    age: Optional[int] = None  # 可选字段，默认值为 None
```

### 嵌套模型

Pydantic 支持嵌套模型，可以在一个模型中使用另一个模型：

```python
class Address(BaseModel):
    street: str
    city: str
    state: str

class User(BaseModel):
    id: int
    name: str
    email: str
    address: Address  # 嵌套模型

# 创建嵌套模型实例
address = Address(street="123 Main St", city="Anytown", state="CA")
user = User(id=1, name="John Doe", email="john@example.com", address=address)
print(user)
```

### 数据序列化和反序列化

Pydantic 模型可以方便地进行 JSON 序列化和反序列化：

```python
# 转换为字典
user_dict = user.model_dump()  # v1中为 .dict()
print(user_dict)

# 转换为 JSON
user_json = user.model_dump_json()  # v1中为 .json()
print(user_json)

# 从字典创建模型实例
user_from_dict = User(**user_dict)
```

### 自定义验证器

你可以定义自定义验证器来实现更复杂的验证逻辑（v2使用 field_validator/model_validator，v1使用 validator）：

```python
# v2 写法
from pydantic import BaseModel, field_validator

class User(BaseModel):
    id: int
    name: str
    email: str

    @field_validator('email')
    @classmethod
    def email_must_be_valid(cls, v: str) -> str:
        if "@" not in v:
            raise ValueError('Invalid email address')
        return v

# v1 写法
from pydantic import validator

class UserV1(BaseModel):
    id: int
    name: str
    email: str

    @validator('email')
    def email_must_be_valid_v1(cls, v):
        if "@" not in v:
            raise ValueError('Invalid email address')
        return v
```

## 💡 实际应用

### 基础用法

```python
# 基础模型的创建与验证
user = User(id=1, name="Alice", email="alice@example.com")
print(user.model_dump())
```

### 高级用法

```python
# 通过模型间嵌套组织更复杂的数据结构
class Company(BaseModel):
    name: str
    owner: User  # 嵌套User模型

company = Company(name="Acme", owner=user)
print(company.model_dump())
```

### 实际案例

```python
# 实际场景：注册时的跨字段验证（v2写法）
from pydantic import BaseModel, model_validator

class RegisterForm(BaseModel):
    username: str
    password: str
    confirm_password: str

    @model_validator(mode='after')
    def check_passwords(self):
        if self.password != self.confirm_password:
            raise ValueError('Password mismatch')
        return self
```

## ⚠️ 注意事项

- v1 与 v2 API 存在差异：v2 推荐使用 `model_dump/model_validation/field_validator/model_validator` 等新接口
- 复杂嵌套可能带来性能开销，注意在高频路径中的使用
- 如果需要设置赋值时验证，请开启 `validate_assignment`（v2 在 `ConfigDict` 中设置）

## 🔗 相关内容

- [Cerberus - Python数据验证库完全指南](../cerberus/)
- [python-dotenv - 环境变量管理](../python-dotenv/)

## 📚 扩展阅读

- [Pydantic 官方文档](https://docs.pydantic.dev/)
- [Pydantic 中文文档](https://pydantic.com.cn/)
- [FastAPI 中的 Pydantic 使用](https://fastapi.tiangolo.com/tutorial/body/)

## 🏷️ 标签

`pydantic` `数据验证` `BaseModel` `FastAPI` `类型注解` `数据建模`

---

**最后更新**: 2024-01-16  
**作者**: Python技术文档工程师  
**版本**: 1.0