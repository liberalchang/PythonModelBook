---
layout: doc
title: Python 安装与环境配置
permalink: /docs/basics/python-installation/
category: basics
tags: [Python安装, 环境配置, Ubuntu, 编译安装, pip, 虚拟环境, 源码安装]
description: 详细介绍 Python 在不同系统上的安装方法，包括源码编译、包管理器安装、环境配置和多版本管理
author: Python 技术文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
estimated_time: "30分钟"
---

# Python 安装与环境配置

## 📝 概述

Python 是一门跨平台的编程语言，支持在 Windows、Linux、macOS 等多种操作系统上运行。本文档详细介绍了 Python 在不同系统上的安装方法，重点讲解 Ubuntu 系统下的安装配置，包括源码编译安装、多版本管理、环境配置等内容。

## 🎯 学习目标

- 掌握检查和查看 Python 版本的方法
- 学会在 Ubuntu 系统上安装不同版本的 Python
- 熟练使用源码编译安装 Python
- 掌握 Python 多版本管理和切换
- 学会配置 pip 和虚拟环境
- 了解 Python 环境变量配置

## 📋 前置知识

- Linux 基础命令行操作
- 软件编译安装的基本概念
- 文件权限和用户管理基础
- 环境变量的概念

## 🔍 详细内容

### 检查已安装的 Python 版本

在开始安装之前，首先检查系统中是否已经安装了 Python：

```bash
# 查看 Python 3 版本
python3 -V
# 或者
python3 --version

# 查看 Python 2 版本（如果存在）
python -V
```

如果系统中没有安装 Python，这些命令会报错。

### Ubuntu 系统 Python 安装

#### 方法一：使用包管理器安装

##### 1. 添加 Python 软件源

```bash
# 更新包索引
sudo apt update

# 安装必要的支持包
sudo apt install software-properties-common

# 添加 Deadsnakes PPA（推荐的第三方软件源）
sudo add-apt-repository ppa:deadsnakes/ppa

# 确认安装（需要按回车确认）
# 再次更新包索引
sudo apt update
```

##### 2. 安装不同版本的 Python

```bash
# 安装 Python 3.7
sudo apt install python3.7

# 安装 Python 3.8
sudo apt install python3.8

# 安装 Python 3.9
sudo apt install python3.9

# 安装 Python 3.10
sudo apt install python3.10
```

安装后可以使用特定版本号调用：

```bash
# 查看 Python 3.7 版本
python3.7 -V

# 查看 Python 3.8 版本
python3.8 -V
```

**注意**：使用 `python3.x` 而不是 `python3`，因为 `python3` 通常指向系统默认版本。

#### 方法二：源码编译安装

##### 1. 安装编译依赖

```bash
# 升级包索引和软件
sudo apt update
sudo apt upgrade -y

# 安装编译所需的依赖包
sudo apt install build-essential zlib1g-dev libbz2-dev libncurses5-dev \
libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev wget \
libsqlite3-dev liblzma-dev tk-dev
```

##### 2. 下载 Python 源码

```bash
# 下载 Python 3.7.4 源码包
wget https://www.python.org/ftp/python/3.7.4/Python-3.7.4.tgz

# 解压源码包
tar -xzvf Python-3.7.4.tgz
```

##### 3. 编译和安装

```bash
# 进入源码目录
cd Python-3.7.4

# 配置编译选项（指定安装路径）
./configure --prefix=/usr/local/src/python37 --enable-optimizations

# 编译（这一步会花费较长时间）
sudo make

# 安装
sudo make install
```

**重要参数说明**：
- `--prefix=/usr/local/src/python37`：指定安装路径
- `--enable-optimizations`：启用优化，提高性能但编译时间更长

##### 4. 创建软链接

```bash
# 为 Python 3.7 创建软链接
sudo ln -s /usr/local/src/python37/bin/python3.7 /usr/bin/python3.7

# 为 pip3.7 创建软链接
sudo ln -s /usr/local/src/python37/bin/pip3.7 /usr/bin/pip3.7
```

### Python 多版本管理

#### 配置系统默认 Python 版本

Ubuntu 20.04 LTS 默认已移除 Python 2，但某些情况下仍需要 Python 2.7：

##### 1. 安装 Python 2.7

```bash
# 安装 Python 2.7
sudo apt install python2
```

##### 2. 配置版本切换

```bash
# 安装 Python 版本管理工具
sudo update-alternatives --install /usr/bin/python python /usr/bin/python2.7 1
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3.8 2
```

**说明**：数字表示优先级，数字越大优先级越高。

##### 3. 查看和切换版本

```bash
# 查看当前默认版本
python --version

# 查看所有已安装的版本
sudo update-alternatives --list python

# 手动切换版本
sudo update-alternatives --config python
```

![Python 版本切换示例](youdaonote-images/WEBRESOURCEeea77e9954f6a8eb87df023fcbc08c8f.png)

#### 替换系统默认 python3（谨慎操作）

如果想用新安装的版本替换系统默认的 python3：

```bash
# 备份原有链接
sudo mv /usr/bin/python3 /usr/bin/python3.backup

# 创建新的软链接
sudo ln -s /usr/local/src/python37/bin/python3.7 /usr/bin/python3

# 同样处理 pip3
sudo ln -s /usr/local/src/python37/bin/pip3.7 /usr/bin/pip3
```

**警告**：修改系统默认 Python 版本可能影响系统工具的正常运行，请谨慎操作。

### pip 安装和配置

#### 安装 pip

```bash
# 移除旧版本 pip3
sudo apt-get remove python3-pip

# 安装新版本 pip3
sudo apt-get install python3-pip

# 升级 pip3
sudo pip3 install --upgrade pip
```

#### 手动安装 Python 2 的 pip

由于 Ubuntu 20.04 无法直接安装 python-pip，需要手动安装：

```bash
# 安装 curl 下载工具
sudo apt-get install curl

# 下载 pip 安装脚本
sudo curl https://bootstrap.pypa.io/pip/2.7/get-pip.py -o get-pip.py

# 运行安装脚本
sudo python get-pip.py
```

#### pip 换源配置

为了加快包下载速度，建议配置国内镜像源：

```bash
# 创建 pip 配置目录
sudo mkdir ~/.pip

# 创建配置文件
sudo gedit ~/.pip/pip.conf
```

在配置文件中添加以下内容：

```ini
[global]
index-url = http://mirrors.aliyun.com/pypi/simple/

[install]
trusted-host=mirrors.aliyun.com
```

#### 常用 pip 命令

```bash
# 安装软件包
pip3 install package_name

# 升级软件包
pip3 install --upgrade package_name

# 查看已安装的软件包
pip3 list

# 卸载软件包
pip3 uninstall package_name

# 查看软件包信息
pip3 show package_name
```

### 自动化安装脚本

以下是一个完整的自动化安装脚本示例：

```bash
#!/bin/bash
# Python 3.8.15 自动安装脚本

# 设置安装路径
path='/home/catmd5'

# 更新系统
sudo apt-get update

# 安装编译依赖
sudo apt-get install -y gcc make build-essential libssl-dev zlib1g-dev \
libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev \
libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev

# 创建安装目录并解压源码
cd ${path} && mkdir .venv && tar -Jxvf Python-3.8.15.tar.xz && cd Python-3.8.15

# 配置和编译
sudo ./configure --enable-optimizations --prefix=/home/catmd5/.venv
sudo make && sudo make install

# 升级 pip
sudo /home/catmd5/.venv/bin/python3.8 -m pip install --upgrade pip -i https://pypi.douban.com/simple/

# 安装常用包
sudo .venv/bin/pip3 install paramiko pandas nuitka -i https://pypi.douban.com/simple/

# 清理临时文件
sudo rm -rf Python-3.8.15.tar.xz Python-3.8.15
```

### 环境变量配置

#### 添加 Python 到 PATH

```bash
# 编辑全局环境变量
sudo vim /etc/profile

# 在文件末尾添加
export PATH=/usr/python3/bin:$PATH

# 使配置生效
source /etc/profile

# 验证配置
python3 -V
pip3 -V
```

#### 虚拟环境配置

```bash
# 安装 virtualenv
pip3 install virtualenv

# 创建虚拟环境
python3 -m venv myproject

# 激活虚拟环境
source myproject/bin/activate

# 退出虚拟环境
deactivate
```

## 💡 实际应用

### 开发环境搭建最佳实践

```python
# 创建项目虚拟环境
python3 -m venv dev_env

# 激活环境
source dev_env/bin/activate

# 安装项目依赖
pip install -r requirements.txt

# 验证安装
python --version
pip list
```

### 生产环境部署

```bash
# 使用系统包管理器安装稳定版本
sudo apt install python3.8

# 配置系统服务
sudo systemctl enable python3-service

# 设置环境变量
export PYTHONPATH=/opt/myapp
export PYTHONDONTWRITEBYTECODE=1
```

## ⚠️ 注意事项

- **系统兼容性**：不要随意替换系统默认的 Python 版本，可能影响系统工具运行
- **权限管理**：编译安装需要 sudo 权限，注意安全性
- **依赖管理**：使用虚拟环境隔离项目依赖，避免版本冲突
- **备份重要文件**：修改系统配置前先备份原始文件
- **版本选择**：选择 LTS（长期支持）版本用于生产环境
- **编译时间**：源码编译安装耗时较长，启用优化会进一步延长编译时间

## 🔗 相关内容

- [Python 包和__init__.py 文件](../packages/)
- [虚拟环境管理 - uv 工具](../../thirdparty/uv/)
- [变量与数据类型](../variables/)

## 📚 扩展阅读

- [Python 官方安装指南](https://docs.python.org/3/using/unix.html)
- [Python 源码编译选项](https://docs.python.org/3/using/configure.html)
- [pip 官方文档](https://pip.pypa.io/en/stable/)
- [虚拟环境和包管理](https://docs.python.org/3/tutorial/venv.html)

## 🏷️ 标签

`Python安装` `Ubuntu` `源码编译` `环境配置` `多版本管理` `pip配置` `虚拟环境` `软件源` `包管理`

---

**最后更新**: 2024-01-15  
**作者**: Python 技术文档工程师  
**版本**: 1.0