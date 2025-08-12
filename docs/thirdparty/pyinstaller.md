---
layout: doc
title: PyInstaller - Python程序打包工具
permalink: /docs/thirdparty/pyinstaller/
category: thirdparty
tags: [打包, 可执行文件, 部署, 工具]
description: 使用PyInstaller将Python程序打包成独立的可执行文件
author: Python模型书
date: 2024-01-01
updated: 2024-01-01
version: 1.0
difficulty: "中级"
---

# PyInstaller - Python程序打包工具

## 📝 概述

PyInstaller是一个功能强大的Python程序打包工具，可以将Python应用程序及其依赖项打包成独立的可执行文件，支持Windows、Linux和macOS等多个平台。使用PyInstaller打包后的程序可以在没有安装Python环境的计算机上运行。

## 🎯 学习目标

- 掌握PyInstaller的安装和基本使用方法
- 了解PyInstaller的常用命令行选项
- 学会处理打包过程中的常见问题
- 掌握复杂项目的自定义打包配置

## 📋 前置知识

- Python基础语法和模块导入机制
- 命令行操作基础
- Python虚拟环境的使用

## 🔍 详细内容

### 基本概念

PyInstaller通过分析Python程序的导入关系，将程序及其依赖的模块、库文件打包成一个或多个文件，生成可以独立运行的可执行程序。它支持两种打包模式：

- **单文件模式(-F)**：生成一个独立的可执行文件
- **目录模式(-D)**：生成包含可执行文件和依赖库的目录

### 安装方法

```bash
# 使用pip安装PyInstaller
pip install pyinstaller

# 验证安装
pyinstaller --version
```

### 基本语法格式

```bash
pyinstaller [选项] Python源文件
```

### 常用命令选项

| 选项 | 说明 |
|------|------|
| -F, --onefile | 生成单个可执行文件 |
| -D, --onedir | 生成目录模式（默认） |
| -w, --windowed | 不显示控制台窗口（仅Windows） |
| -c, --console | 显示控制台窗口（默认） |
| -n NAME | 指定生成文件的名称 |
| -p DIR | 添加Python模块搜索路径 |
| --hidden-import MODULE | 手动指定隐藏导入的模块 |
| -o DIR | 指定输出目录 |
| --add-data | 添加数据文件 |
| --icon ICON | 设置可执行文件图标 |

## 💡 实际应用

### 基础用法

```python
# 示例程序 app.py
def main():
    print('Hello, PyInstaller!')
    name = input('请输入您的姓名: ')
    print(f'您好, {name}!')

if __name__ == '__main__':
    main()
```

```bash
# 基本打包命令
pyinstaller app.py

# 生成单文件
pyinstaller -F app.py

# 无控制台窗口的GUI程序
pyinstaller -F -w app.py
```

### 高级用法

#### 1. 使用spec文件进行自定义配置

```bash
# 生成spec配置文件
pyi-makespec -F app.py

# 使用spec文件打包
pyinstaller app.spec
```

#### 2. 复杂项目的自定义打包

如果不是单文件项目，而是有多级目录（包含一些依赖的静态资源），需要自定义打包。

以打包单页面网页demo为例，各级目录结构如下：

![项目目录结构](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCEf9d3426fae2291f28fea2f6854a27e9e.png)

**2.1 生成配置文件**

为了进行自定义配置打包，需要先输出配置文件.spec文件：

```bash
pyi-makespec -D -w main.py
```

注：
- `-w` 参数是为了保证不会产生黑色控制台窗口
- `-D` 参数生成一个文件目录包含可执行文件和相关动态链接库和资源文件等（默认选项，也可以不加）

生成的 main.spec 文件如下：

![spec文件内容](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE1c9d2c33bd5a4e7af80f5db3497bc901.png)

**2.2 添加静态资源依赖**

为了使打包生成后的exe文件可以加载css、js、图片等静态资源，这里需要添加依赖路径（注意：要保证自己 html 里面加载静态资源的路径是相对路径才行）。具体来说，此类资源文件的打包需要设置Analysis的datas，如下：

![添加数据文件配置](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE83a94e093e4f1882ae8084b8be59e499.png)

```python
# 修改spec文件添加数据文件
a = Analysis(['main.py'],
             pathex=[],
             binaries=[],
             datas=[('templates', 'templates'), ('static', 'static')],  # 添加Web资源文件
             hiddenimports=[],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
```

**2.3 执行打包**

```bash
pyinstaller main.spec
```

成功！最终结果：

![打包结果](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE2791533b069c3765d0a71e5ad02cb69f.png)

### 实际案例

#### Web应用打包示例

```python
# web_app.py - Flask应用示例
from flask import Flask, render_template
import os
import sys

app = Flask(__name__)

# 获取资源文件路径
def resource_path(relative_path):
    """获取资源文件的绝对路径"""
    try:
        # PyInstaller创建临时文件夹，将路径存储在_MEIPASS中
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=False, host='127.0.0.1', port=5000)
```

```bash
# 打包Web应用
pyinstaller -F --add-data "templates;templates" --add-data "static;static" web_app.py
```

#### 处理第三方库依赖

```bash
# 包含特定模块
pyinstaller -F --hidden-import requests --hidden-import json app.py

# 指定Python路径
pyinstaller -F -p "C:/Python/Lib/site-packages" app.py
```

## ⚠️ 注意事项

### 常见问题及解决方案

#### 1. RecursionError: maximum recursion depth exceeded

**问题描述：** 执行打包命令时，报错：RecursionError: maximum recursion depth exceeded

**原因：** 应该是python库递归遍历太深，超过了python预设的递归深度，导致出现 "RecursionError: maximum recursion depth exceeded" 的错误

**解决方案：** 在spec文件里设置一个大点的递归深度，在该文件第二行，添加代码如下：

```python
import sys
sys.setrecursionlimit(50000)
```

#### 2. WebBrowserInterop.x64.dll not found

**问题描述：** python打包pywebview时，可能会报错：WebBrowserInterop.x64.dll not found

**原因：** 这是由于系统没有找到WebBrowserInterop.x64.dll

**解决方案：** 将WebBrowserInterop.x64.dll文件的所在路径添加到系统环境变量里即可！

WebBrowserInterop.x64.dll文件的所在路径：

![WebBrowserInterop.x64.dll路径](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCEf6115842bfe4f2045856ee6bf089ca05.png)

添加到系统环境变量：

![添加环境变量](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCEf342a8a7a4fa1e26d9213818a95d63c5.png)

#### 3. 模块找不到错误

```bash
# 方法1：使用--hidden-import
pyinstaller -F --hidden-import missing_module app.py

# 方法2：添加路径
pyinstaller -F -p "path/to/modules" app.py
```

#### 4. 编码错误（Windows）

```bash
# 设置编码后再打包
chcp 65001
pyinstaller -F app.py
```

#### 4. 减小打包体积

**方法：** 如果要减小打包体积，可以使用conda创建python虚拟环境，然后只安装需要的包，最后再进行打包，这样体积会大大减小

- 使用虚拟环境，只安装必要的包
- 使用`--exclude-module`排除不需要的模块
- 考虑使用目录模式而非单文件模式

```bash
# 创建虚拟环境进行打包
conda create -n pack_env python=3.8
conda activate pack_env
pip install 必要的包
pyinstaller -F app.py

# 排除不必要的模块
pyinstaller --exclude-module tkinter app.py

# 使用UPX压缩
pyinstaller --upx-dir /path/to/upx app.py
```

### 调试技巧

1. **查看详细错误信息**：不使用`-w`参数，在控制台中运行exe查看错误
2. **使用调试模式**：添加`-d`参数生成调试版本
3. **检查依赖**：使用`--log-level DEBUG`查看详细打包过程

## 🔗 相关内容

- [Nuitka - 另一种Python打包工具](../nuitka/)
- [Python模块和包](../../basics/packages/)

## 📚 扩展阅读

- [PyInstaller官方文档](https://pyinstaller.readthedocs.io/)
- [PyInstaller GitHub仓库](https://github.com/pyinstaller/pyinstaller)
- [Python打包最佳实践](https://packaging.python.org/)

## 🏷️ 标签

`打包` `可执行文件` `部署` `工具` `PyInstaller`

---

**最后更新**: 2024-01-01  
**作者**: Python模型书  
**版本**: 1.0