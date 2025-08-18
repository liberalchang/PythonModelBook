---
layout: doc
title: uv - 新一代 Python 项目与包管理器
permalink: /docs/thirdparty/uv/
category: thirdparty
tags: [uv, 包管理, 虚拟环境, 依赖解析, 锁定文件, Python版本管理, 项目初始化]
description: uv 是一个现代的 Python 项目管理工具，集成包管理、虚拟环境、依赖解析与锁定、Python 版本管理、项目初始化与发布等功能
author: Python 技术文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
estimated_time: "40分钟"
---

# uv - 新一代 Python 项目与包管理器

## 📝 概述

uv 是由 Astral 团队推出的新一代 Python 项目管理工具，提供包管理、虚拟环境管理、依赖解析与锁定、Python 版本管理、项目初始化、脚本运行、构建发布等一体化能力。相较于传统的 pip/venv，它提供更快的安装速度、更智能的依赖解析以及一体化的项目工作流。

## 🎯 学习目标

- 了解 uv 的核心功能和定位
- 掌握 uv 的安装方法（多平台）
- 熟悉项目初始化、依赖管理、锁定与同步
- 学会管理 Python 版本与虚拟环境
- 能够使用 uv 进行脚本运行与性能对比
- 理解依赖冲突的诊断方式

## 📋 前置知识

- 基本的 Python 与 pip 使用经验
- 虚拟环境概念与常用命令
- 对 pyproject.toml 有初步了解

## 🔍 详细内容

### 核心特性

| 功能点 | 描述 |
|---|---|
| 包管理 | 完全替代 pip 的功能，支持安装、升级、卸载 |
| 虚拟环境管理 | 内置虚拟环境创建与管理，无需安装 virtualenv/venv |
| 依赖解析与锁定 | 智能解析依赖并生成 uv.lock 锁定文件 |
| Python 版本管理 | 自动安装和管理不同版本的 Python 解释器 |
| 项目初始化 | 通过 uv init 快速创建新项目并生成标准结构 |
| 脚本运行 | 在虚拟环境中直接运行脚本，无需手动激活 |
| 包发布 | 支持构建与发布到 PyPI 等仓库 |

### 安装

```bash
# On Linux.
curl -LsSf https://astral.sh/uv/install.sh | sh

# On macOS
brew install uv

# On Windows.
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# With pip.
pip install uv
```

### 快速开始：初始化项目

```bash
uv init test-uv
```

项目结构：

```text
test-uv
    ├─ .git
    ├─ .gitignore
    ├─ .python-version
    ├─ README.md
    ├─ main.py
    ├─ pyproject.toml
```

示例 pyproject.toml：

```toml
[project]
name = "test-uv"
version = "0.1.0"
description = "Add your description here"
readme = "README.md"
requires-python = ">=3.9"
dependencies = []
```

`.python-version` 记录项目使用的 Python 版本：

```text
3.10
```

### 运行脚本

```bash
# 与前端中的 `npm run dev` 类似
uv run <command>
```

执行逻辑：
1) 检查当前目录是否存在 .venv，如果不存在则创建
2) 校验并安装缺失依赖
3) 在当前虚拟环境中执行命令，不污染其他环境

对比：

| 执行命令 | 环境处理 |
|---|---|
| uv run xxx | 自动关联 .venv，不用手动激活 |
| python xxx.py | 依赖当前 Shell，需要手动激活虚拟环境 |

### 管理依赖

#### add - 安装依赖并更新配置

```bash
# 安装最新版
uv add requests

# 安装指定版本
uv add "flask>=2.0.0"

# 从 Git 安装
uv add git+https://github.com/psf/requests.git
```

说明：`uv add` 相当于增强版的 `pip install`，同时更新 pyproject.toml 与 uv.lock。

#### remove - 卸载依赖并更新配置

```bash
uv remove requests
```

#### sync - 按锁定文件精确还原环境

```bash
# 同步所有依赖（含 dev）
uv sync

# 仅同步生产依赖
uv sync --production

# 同步并清理多余包
uv sync --clean
```

#### lock - 生成/更新锁定文件

```bash
# 生成锁定文件
uv lock

# 只检查不写入
uv lock --check

# 强制重新解析
uv lock --update
```

#### tree - 可视化依赖树

```bash
# 显示完整依赖树
uv tree

# 指定包的依赖路径
uv tree flask

# 反向追溯依赖
uv tree --reverse sqlalchemy

# JSON 输出
uv tree --format json
```

### 管理 Python 版本

```bash
uv python [OPTIONS] <COMMAND>
```

常用命令：

| 命令 | 描述 |
|---|---|
| list | 列出可用的 Python 安装版本 |
| install | 下载并安装指定版本 |
| find | 显示当前 Python 安装位置 |
| pin | 固定使用特定 Python 版本 |
| dir | 显示 uv Python 安装目录 |
| uninstall | 卸载 Python 版本 |

示例：

```bash
uv python list
uv python install python3.8
# 输出: Installed Python 3.8.20 in 3.98s
```

安装位置示例：

```text
~/.local/share/uv/python/
  ├─ cpython-3.10.16-macos-aarch64-none
  └─ cpython-3.8.20-macos-aarch64-none
```

### 下载速度对比

安装 torch：

```bash
# 传统 pip
time pip install torch
# 总耗时约 21s

# uv（指定项目的 Python）
time uv pip install torch --python .venv/bin/python
# 总耗时约 10s
```

说明：pip 串行安装，uv 多线程并行下载，并重用缓存，速度更快。

### 依赖冲突对比

```text
requirements.txt
langchain==0.3.23
langchain-core==0.1.0
lxml==5.2.0
```

- pip：按顺序下载，遇到冲突即报错，且不一定一次暴露所有冲突。
- uv：先解析依赖，明确给出冲突原因，便于一次性修复。

示例（uv 输出）：

```text
× No solution found when resolving dependencies:
  ╰─▶ Because langchain==0.3.23 depends on langchain-core>=0.3.51,<1.0.0 ...
```

## 💡 实际应用

### 团队项目最佳实践

```bash
# 统一初始化
uv init myproj && cd myproj

# 固定 Python 版本
echo "3.12" > .python-version

# 添加依赖
uv add fastapi uvicorn[standard]

# 锁定并同步
uv lock && uv sync --clean

# 运行开发服务器
uv run uvicorn app:app --reload
```

### 与现有项目集成

```bash
# 读取现有 requirements.txt
uv add --from-requirements requirements.txt

# 生成锁定文件并同步
uv lock && uv sync
```

## ⚠️ 注意事项

- uv 的某些功能需要网络访问，请配置合理的镜像源
- Windows 用户建议使用 PowerShell 执行安装脚本
- 与 Conda 共存时，建议在项目级使用 uv 管理避免干扰
- 对生产环境，务必使用 uv.lock 进行版本锁定与复现

## 🔗 相关内容

- [PyInstaller - 程序打包工具](../pyinstaller/)
- [Nuitka - Python 编译器](../nuitka/)
- [Pandas - 数据分析库](../pandas/)
- [Python 安装与环境配置](../../basics/python-installation/)

## 📚 扩展阅读

- 官方网站与安装脚本：https://astral.sh/uv
- 文档与命令参考：https://docs.astral.sh/uv/
- GitHub 仓库：https://github.com/astral-sh/uv

## 🏷️ 标签

`uv` `包管理` `虚拟环境` `依赖锁定` `Python版本管理` `项目初始化` `发布`

---

**最后更新**: 2024-01-15  
**作者**: Python 技术文档工程师  
**版本**: 1.0