---
layout: doc
title: Conda（Anaconda）安装与使用
permalink: /docs/thirdparty/anaconda/
category: thirdparty
tags: [conda, anaconda, 包管理, 虚拟环境, 镜像源, 环境导出]
description: 基于原始文档，结构化整理 Conda/Anaconda 的安装、环境与包管理、镜像配置、环境导入导出与清理等常用操作。
author: Python模型书
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "入门"
---

# Conda（Anaconda）安装与使用

## 📝 概述

Conda 是跨平台的包与环境管理器，Anaconda 则是包含 Conda 与大量科学计算库的发行版。本文基于原始笔记，整理 Conda 的安装与常用命令，包括镜像配置、环境管理、包管理、清理缓存和 Python 版本管理等。

## 🎯 学习目标

- 快速安装 Anaconda 并完成 PATH 配置
- 熟练创建、激活、导出、删除 Conda 虚拟环境
- 配置清华/中科大等镜像源加速下载
- 掌握包安装、卸载、查询与缓存清理

## 📋 前置知识

- 基础 Shell/PowerShell 使用
- 了解虚拟环境与包管理的基本概念

## 🔍 详细内容

### 安装 Anaconda

```sh
# 以 Linux x86_64 为例，下载安装脚本
wget https://repo.anaconda.com/archive/Anaconda3-2023.07-1-Linux-x86_64.sh
# 运行安装程序（按提示确认安装路径与许可）
bash Anaconda3-2023.07-1-Linux-x86_64.sh
```

安装后设置 PATH（按需调整为你的安装路径）：

```sh
# 将 anaconda3/bin 加入 PATH（Linux/macOS）
sudo vim ~/.bashrc
# 在文件末尾追加（注意将 ~ 展开为绝对路径）
export PATH="~/anaconda3/bin":$PATH

# 让配置生效
source ~/.bashrc
# 或使用 Anaconda 自带激活脚本（切换默认 Python 为 Anaconda）
source ~/anaconda3/bin/activate
```

> 提示：Windows 用户可使用图形安装器，勾选 “Add Anaconda to my PATH environment variable”。

### 基础命令速览

```sh
# 查看 Conda 版本（验证安装）
conda --version

# 查看 Conda 配置（所有可见配置项）
conda config --show
```

### 创建与管理虚拟环境

```sh
# 创建名为 xxx 的虚拟环境，并指定 Python 版本
conda create -n xxx python=3.6

# 查看已有环境列表（多种等价命令）
conda env list
conda info -e
conda info --envs  # 显示所有已创建的虚拟环境及其路径

# 激活/退出环境
source activate xxx     # 旧语法（Linux/macOS）
conda activate xxx      # 新语法（跨平台）
conda deactivate        # 退出当前环境

# 删除虚拟环境
conda remove -n xxx --all
```

### 配置国内镜像源（加速下载）

```sh
# 添加清华 TUNA 镜像
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/bioconda/

# 也可直接添加逻辑频道名（bioconda、conda-forge）
conda config --add channels bioconda
conda config --add channels conda-forge

# 搜索时显示通道地址，便于调试与溯源
conda config --set show_channel_urls yes
```

### 环境导出与复现

```sh
# 导出指定环境的完整配置（依赖/版本/通道）
conda env export --name myenv > myenv.yml

# 从 yml 文件精确创建环境（跨机器复现）
conda env create -f myenv.yml
```

### 包管理（安装/卸载/查询）

```sh
# 查看当前环境中的所有包
conda list

# 查看特定包或通配查询
conda list pkgname
conda list pkgname*

# 安装与卸载
conda install package_name
conda install numpy=0.20.3   # 指定版本安装
conda uninstall package_name
```

### 清理缓存

```sh
# 删除未使用的包（packages）
conda clean -p
# 删除 tar 压缩包（tarballs）
conda clean -t
# 一键清理所有索引缓存/锁定文件/未使用包和 tar 包
conda clean -y -all
```

### Python 版本管理（基于 Conda）

```sh
# 将当前环境的 Python 切换到指定版本
conda install python=3.5
# 升级到该渠道可用的最新版本
conda update python
```

## 💡 实际应用与建议

- 每个项目创建独立环境，避免依赖冲突
- 使用环境导出（.yml）与锁定版本，保证可复现
- 优先添加 conda-forge 频道以获取更丰富、更新的包
- 与 uv/pip 共存时，建议单项目内固定一种管理方式

## ⚠️ 注意事项

- 修改 PATH 时请确保不影响系统 Python 的关键工具
- 旧语法 `source activate` 仍可用，但推荐 `conda activate`
- 企业/内网环境可搭建私有镜像源，提升稳定性

## 🔗 相关内容

- [uv - 新一代 Python 项目与包管理器](../uv/)
- [Python 安装与环境配置](../../basics/python-installation/)
- [Anaconda 包仓库](https://anaconda.org/)

## 📚 扩展阅读

- 官方下载与文档：https://www.anaconda.com/
- Conda 官方文档：https://docs.conda.io/
- conda-forge 频道：https://conda-forge.org/

## 🏷️ 标签

`conda` `anaconda` `包管理` `虚拟环境` `镜像源` `环境导出`

---

**最后更新**: 2024-01-15  
**作者**: Python模型书  
**版本**: 1.0