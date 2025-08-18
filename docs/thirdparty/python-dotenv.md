---
layout: doc
title: python-dotenv - 环境变量管理与配置加载
permalink: /docs/thirdparty/python-dotenv/
category: thirdparty
tags: [python-dotenv, 环境变量, 配置, 加载, 安全]
description: 从 .env 文件加载键值对到环境变量，简化配置管理并支持覆盖与编码设置
author: Python 技术文档工程师
date: 2025-08-18
updated: 2025-08-18
version: 1.0
difficulty: "初级"
---

# python-dotenv - 环境变量管理与配置加载

## 📝 概述

python-dotenv 用于从项目根目录中的 .env 文件读取键值对，并将其注入到进程的环境变量中，便于集中管理配置与敏感信息（如数据库密码、API 密钥）。无需修改系统环境，即可通过 os.getenv 在代码中读取配置，适合本地开发、测试与部署场景。

## 🎯 学习目标

- 理解 .env 文件与环境变量的关系与使用场景
- 掌握 load_dotenv/find_dotenv 的常见用法
- 了解覆盖策略（override）与编码（encoding）等关键参数
- 会从文件、路径与流对象加载变量，并在代码中安全访问
- 熟悉常见坑点，如 URL 中 # 的处理与变量更新策略

## 📋 前置知识

- Python 基础与模块导入
- 基础的文件路径与字符编码知识
- 对环境变量与配置分离原则有所了解

## 🔍 详细内容

### 基本概念

- .env 文件：以 KEY=VALUE 的形式存放配置的纯文本文件，便于本地与不同环境的隔离配置。
- 环境变量：进程级别的配置来源，可通过 os.getenv("KEY") 获取。
- 目标：在不污染系统环境的情况下，为项目提供一致、可版本化（但通常不应提交敏感值）的配置加载方式。

### 语法格式

```python
# settings.py
# 通过 python-dotenv 从 .env 文件加载变量
from dotenv import load_dotenv, find_dotenv
from pathlib import Path
import os

# 自动查找并加载（会在当前目录及父级目录查找 .env）
load_dotenv(verbose=True)  # verbose=True 输出加载详情，便于调试

# 或者显式指定 .env 文件路径
env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path, verbose=True)

# 在代码中读取环境变量
# 如果未设置，则可提供默认值（例如 None 或具体默认字符串）
REDIS_ADDR = os.getenv('REDIS_ADDRESS', 'localhost:6379')
MEANING = os.getenv('MEANING_OF_LIFE', '42')
```

```text
# .env 示例
# 这是一个注释，将被忽略
REDIS_ADDRESS=localhost:6379
MEANING_OF_LIFE=42
MULTILINE_VAR="hello\nworld"
```

- 注意：如果以 export 作为每行前缀，python-dotenv 会忽略该变量；但该文件仍可用 shell 的 source 命令执行。

#### 从流对象加载（dict 返回）

```python
# 从可读流加载配置，并以字典形式返回
from io import StringIO
from dotenv import dotenv_values

filelike = StringIO('SPAM=EGGS\n')
filelike.seek(0)  # 确保指针在文件开头
parsed = dotenv_values(stream=filelike)
assert parsed['SPAM'] == 'EGGS'
```

### 参数说明（load_dotenv）

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|------|
| dotenv_path | str/Path/None | 否 | None | 指定 .env 文件路径；若为 None，会自动查找（文件名不是 .env 时必须显式指定） |
| override | bool | 否 | False | 当系统已有同名环境变量时，是否使用 .env 中的值覆盖 |
| encoding | str/None | 否 | None | 指定读取文件的编码（如 'utf-8'） |
| verbose | bool | 否 | False | 是否输出加载过程信息，便于调试 |

辅助函数与返回值：
- find_dotenv()：返回自动发现的 .env 路径，常与 load_dotenv(find_dotenv(), override=True) 搭配。
- load_dotenv(...) 的典型效果是将变量注入 os.environ；通常用于副作用，不依赖返回值。

### 返回值

| 类型 | 说明 |
|------|------|
| bool | 是否成功解析并加载至少一个变量（在多数场景下更关注副作用） |

## 💡 实际应用

### 基础用法

```python
# 读取 .env 后在业务代码中取值
import os
from dotenv import load_dotenv

load_dotenv()  # 默认自动查找 .env
# 使用默认值避免 KeyError
base_url = os.getenv('BASE_URL', 'http://localhost:8000')
print(base_url)
```

### 高级用法

```python
# 1) 显式查找并允许覆盖，适合本地调试时更新变量值
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv(), override=True)

# 2) 文件名不是 .env 的场景（例如 config/dev.env）
from dotenv import load_dotenv
load_dotenv(dotenv_path='config/dev.env', override=True)
```

### 实际案例

```python
# 使用环境变量连接 Redis（示例）
import os
from dotenv import load_dotenv

load_dotenv()
redis_addr = os.getenv('REDIS_ADDRESS', 'localhost:6379')
# 解析 host 与 port（简单示例，生产环境需健壮性校验）
host, port = redis_addr.split(':')
# 在此处使用你选择的 Redis 客户端进行连接
# r = redis.Redis(host=host, port=int(port))
```

## ⚠️ 注意事项

- 覆盖策略：load_dotenv 默认不会覆盖已有环境变量。若你在 .env 中更新了变量值却未生效，请使用 override=True。
- URL 中的 #：在 .env 中，# 表示注释开始。如果变量值包含 #（如 URL 锚点），请使用引号包裹：
  - BASEURL="http://codehub.com/#/python"
  - BASEURL='http://codehub.com/#/python'
- 编码问题：跨平台或包含中文时建议显式指定 encoding='utf-8'。
- 安全与版本控制：不要提交包含敏感信息的 .env 文件；建议将 .env 添加到 .gitignore，并通过示例模板（如 .env.example）说明所需变量。

## 🔗 相关内容

- [os - 与环境变量相关的标准库接口](../stdlib/os/)
- [Typer - CLI 应用快速构建](./typer/)
- [Loguru - 现代日志记录库](./loguru/)

## 📚 扩展阅读

- [项目主页 - GitHub](https://github.com/theskumar/python-dotenv)
- [PyPI: python-dotenv](https://pypi.org/project/python-dotenv/)

## 🏷️ 标签

`环境变量` `配置管理` `dotenv` `加载` `覆盖`

---

**最后更新**: 2025-08-18  
**作者**: Python 技术文档工程师  
**版本**: 1.0