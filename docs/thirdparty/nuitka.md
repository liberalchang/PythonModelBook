---
layout: doc
title: Nuitka - Python编译器和打包工具
permalink: /docs/thirdparty/nuitka/
category: thirdparty
tags: [编译器, 打包, 性能优化, 工具]
description: 使用Nuitka将Python程序编译成高性能的可执行文件
author: Python模型书
date: 2024-01-01
updated: 2024-01-01
version: 1.0
difficulty: "高级"
---

# Nuitka - Python编译器和打包工具

## 📝 概述

Nuitka是一个用Python编写的Python编译器，它将Python代码编译成C++代码，然后生成优化的可执行文件。与传统的打包工具不同，Nuitka不仅能打包程序，还能提供性能优化，支持Python 2.6-2.7和Python 3.3-3.11等多个版本。

## 🎯 学习目标

- 理解Nuitka的工作原理和优势
- 掌握Nuitka的安装和配置方法
- 学会使用Nuitka编译和打包Python程序
- 了解Nuitka的高级配置和优化选项

## 📋 前置知识

- Python编程基础和模块系统
- C/C++编译器的基本概念
- 命令行操作和环境变量配置
- Python虚拟环境管理

## 🔍 详细内容

### 基本概念

Nuitka是用Python编写的Python编译器。支持Python 2.6、2.7、3.3、3.4、3.5、3.6、3.7和3.8等版本。将你的python程序打包成一个可执行文件。

与PyInstaller不同，Nuitka不是简单的打包工具，而是真正的编译器，可以提供更好的性能和更小的文件体积。

**执行时间：** 复杂的程序进行打包的时候耗时是比较久的，打包速度这点比不上pyinstaller。

Nuitka的核心特点：

- **真正的编译**：将Python代码编译成C++，再编译成机器码
- **性能提升**：编译后的程序通常比解释执行快
- **兼容性好**：与CPython高度兼容
- **独立部署**：生成的可执行文件可独立运行

### 安装方法

#### 1. 安装C++编译器（Windows）

- mingw64下载页面：[MinGW64官网](http://mingw-w64.org/)
- 页面拉到最下面，目前最新版本为8.1.0

可选版本：
```
x86_64-posix-sjlj
x86_64-posix-seh
x86_64-win32-sjlj
x86_64-win32-seh
i686-posix-sjlj
i686-posix-dwarf
i686-win32-sjlj
i686-win32-dwarf
```

推荐选择：
- 64位系统建议选择：`x86_64-posix-sjlj`
- 32位系统建议选择：`i686-posix-sjlj`

注：官方文档中说要设置一下环境变量，实际使用过程中发现不设置也可以正常使用。

#### 2. 安装Nuitka

```bash
# 使用pip安装
pip install nuitka

# 或使用conda安装
conda install nuitka

# 验证安装
nuitka --version
```

### 基本语法格式

```bash
nuitka [选项] Python源文件
# 或
python -m nuitka [选项] Python源文件
```

### 常用命令参数

```bash
--mingw64                    # 默认为已经安装的vs2017去编译，否则就按指定的比如mingw
--standalone                 # 独立文件，这是必须的
--follow-imports             # 把开头import的文件或者模块一起打包
--windows-disable-console    # 没有CMD控制窗口
--recurse-all                # 所有的资源文件 这个也选上
--recurse-not-to=numpy,jinja2 # 不编译的模块，防止速度会更慢
--output-dir=out             # 生成exe到out文件夹下面去
--show-progress              # 显示编译的进度，很直观
--show-memory                # 显示内存的占用
--plugin-enable=pylint-warnings # 报警信息
--plugin-enable=qt-plugins   # 需要加载的PyQT插件
--nofollow-imports           # 所有的import不编译，交给python3x.dll执行
--follow-import-to=need      # need为你需要编译成C/C++的py文件夹命名
--include-package            # 将python的requests包打包进exe
--include-plugin-directory   # 可以将某文件夹里的所有文件打包进执行档中，这里的路径需要写绝对路径
```

### 命令示例

```bash
# 基本编译
python -m nuitka --follow-imports --show-progress --plugin-enable=pylint-warnings --recurse-all --output-dir=out main.py

# 完整编译（包含Qt插件）
nuitka --mingw64 --windows-disable-console --standalone --show-progress --show-memory --plugin-enable=qt-plugins --plugin-enable=pylint-warnings --recurse-all --recurse-not-to=numpy --output-dir=out index.py

# 调试模式
nuitka --standalone --mingw64 --show-memory --show-progress --nofollow-imports --plugin-enable=qt-plugins --follow-import-to=lib --output-dir=o main.py

# release 模式
nuitka --standalone --windows-disable-console --mingw64 --nofollow-imports --show-memory --show-progress --plugin-enable=qt-plugins --follow-import-to=lib --recurse-all --output-dir=o main.py
# 打包完成后将相关的python 包拷贝到exe所在目录
```

### 核心命令选项

| 选项 | 说明 |
|------|------|
| --standalone | 生成独立的可执行文件（推荐） |
| --onefile | 生成单个可执行文件 |
| --mingw64 | 使用MinGW64编译器（Windows） |
| --show-progress | 显示编译进度 |
| --show-memory | 显示内存使用情况 |
| --output-dir=DIR | 指定输出目录 |
| --windows-disable-console | 禁用控制台窗口（Windows GUI） |
| --enable-plugin=PLUGIN | 启用特定插件 |

### 详细参数说明

**基本选项：**
```bash
--version                    # 显示程序的版本号并退出
-h, --help                   # 显示帮助信息并退出
--standalone                 # 启用 standalone 独立模式来进行构建
--python-arch=PYTHON_ARCH    # 要使用的 Python 架构。为 x86 或 x86_64
--python-debug               # 是否使用调试版本
--python-flag=PYTHON_FLAGS   # 要使用的 Python flag 标志
--python-for-scons=PYTHON_SCONS # 如果使用 Python3.3 或 Python3.4，提供用于 Scons 的 Python 二进制文件路径
--warn-implicit-exceptions   # 对编译时检测到的隐式异常启用警告
--warn-unusual-code          # 对编译时检测到的异常代码启用警告
--assume-yes-for-downloads    # 如果有必要，允许 Nuitka 下载代码
```

**控制模块和包的包含：**
```bash
--include-package=PACKAGE     # 包含一个包
--include-module=MODULE       # 包含一个模块
--include-plugin-directory=MODULE/PACKAGE # 包含目录的内容
--include-plugin-files=PATTERN # 包含所有匹配的文件
```

**控制导入模块的递归：**
```bash
--follow-stdlib, --recurse-stdlib    # 从标准库中导入模块
--nofollow-imports, --recurse-none   # 完全不导入任何模块
--follow-imports, --recurse-all      # 导入所有模块
--follow-import-to=MODULE/PACKAGE, --recurse-to=MODULE/PACKAGE # 递归指定的模块或包
--nofollow-import-to=MODULE/PACKAGE, --recurse-not-to=MODULE/PACKAGE # 不递归指定的模块或包
```

**编译后立即执行：**
```bash
--run                        # 立即执行创建的二进制文件
--debugger, --gdb            # 在 gdb 内执行，以自动获取堆栈跟踪
--execute-with-pythonpath    # 当立即执行创建的二进制文件时，不要重置 PYTHONPATH
```

**代码生成选项：**
```bash
--full-compat                # 强制与 CPython 绝对兼容
--file-reference-choice=FILE_REFERENCE_MODE # 选择 __file__ 的值
```

**输出选项：**
```bash
-o FILENAME                  # 指定应如何命名可执行文件
--output-dir=DIRECTORY       # 指定最终文件的输出目录
--remove-output              # 生成模块或 exe 文件之后删除生成目录
--no-pyi-file                # 不要为创建的扩展模块创建 .pyi 文件
```

**调试特性：**
```bash
--debug                      # 执行所有可能的自检以查找 Nuitka 中的错误
--unstripped                 # 在生成的对象文件中保留调试信息
--profile                    # 启用基于 vmprof 的时间分析
--graph                      # 创建优化过程图
--trace-execution            # 跟踪执行输出，在执行前输出代码行
--recompile-c-only           # 这不是增量编译，而是仅用于 Nuitka 开发
--generate-c-only            # 只生成 C 源代码，不编译生成二进制文件或模块
--experimental=EXPERIMENTAL  # 使用声明为 experimental 的功能
--disable-dll-dependency-cache # 禁用依赖项的缓存
--force-dll-dependency-cache-update # 用于更新依赖性缓存
```

**后端 C 编辑器的选择：**
```bash
--clang                      # 强制使用 clang
--mingw64                    # 在 Windows 上强制使用 MinGW64
--msvc=MSVC                  # 在 Windows 上强制使用特定的 MSVC 版本
-j N, --jobs=N               # 指定允许的并发 C 编译器的作业数量
--lto                        # 如果可用，请使用链接时间优化
```

**跟踪特性：**
```bash
--show-scons                 # 在非安静模式下操作 Scons，显示执行的命令
--show-progress              # 提供进度信息和统计数据
--show-memory                # 提供内存信息和统计数据
--show-modules               # 提供包含模块的最终汇总信息
--verbose                    # 输出所采取操作的详细信息
```

**Windows 特定控制：**
```bash
--windows-dependency-tool=DEPENDENCY_TOOL # 在为 Windows 编译时，使用此依赖性工具
--windows-disable-console    # 在为 Windows 编辑时，禁用控制台窗口
--windows-icon=ICON_PATH     # 添加可执行文件的图标（只有 Windows 下）
```

**插件控制：**
```bash
--plugin-enable=PLUGINS_ENABLED, --enable-plugin=PLUGINS_ENABLED # 启用插件
--plugin-disable=PLUGINS_DISABLED, --disable-plugin=PLUGINS_DISABLED # 禁用插件
--plugin-no-detection        # 插件会检测是否可以使用他们
--plugin-list                # 显示所有可用的插件并退出
--user-plugin=USER_PLUGINS   # 用户插件的文件名
```

## 💡 实际应用

### 打包模块与follow import详解

**核心概念：** nuitka能够根据py文件中的import语句找到所有引用的库，然后将这些库文件打包进二进制文件中。找到import，然后follow，所以是follow import。所有被导入的库可以看作一个列表，而这部分参数的作用就是让用户在这个列表中进行选择，只有被选中的部分会被打包进exe。

**选择策略：**

1. **全选**
   ```bash
   --follow-imports, --recurse-all
   ```

2. **不选**
   ```bash
   --nofollow-imports, --recurse-none
   ```

3. **仅选择标准库**
   ```bash
   --follow-stdlib, --recurse-stdlib
   ```

4. **仅选择指定模块/包**
   ```bash
   --follow-import-to=MODULE/PACKAGE, --recurse-to=MODULE/PACKAGE
   ```

5. **不选择指定模块/包**（这个选项会覆盖其他递归选项）
   ```bash
   --nofollow-import-to=MODULE/PACKAGE, --recurse-not-to=MODULE/PACKAGE
   ```

**重要说明：**
- 如果某些库没有被打包进exe，程序仍会试图通过python3x.dll去搜索路径中查找这些库，然后进行调用，调用方式跟py文件一模一样
- nuitka打包相对来说是比较耗费时间的，特别是针对像pandas这样的大家伙，所以在最终发布之前，可以暂时不对这些库进行打包（--nofollow-imports），而是将这些库手动拷贝到搜索路径中，比如exe同级目录
- 只要能够找到这些库，程序就能正常运行，否则会提示no module named xxx
- 注意：这部分参数仅仅能够处理py或者pyc文件，如果遇到pyd或者dll则会跳过

### 基础用法

```python
# hello.py - 简单示例
def greet(name):
    """问候函数"""
    return f"Hello, {name}!"

def main():
    """主函数"""
    print("欢迎使用Nuitka!")
    name = input("请输入您的姓名: ")
    print(greet(name))

if __name__ == "__main__":
    main()
```

```bash
# 简单使用
python -m nuitka --standalone main.py

# 执行结果差异如下
# hello-world-demo: python main.py
# Talk Hello World
# 
# hello-world-demo: ./main.dist/main
# Talk Hello World
# hello-world-demo:

# 基本编译命令
nuitka --standalone hello.py

# 显示进度的编译
nuitka --standalone --show-progress hello.py

# 生成单文件
nuitka --onefile --show-progress hello.py
```

### 高级用法

#### 1. 复杂项目编译

```bash
# 编译带依赖的项目
nuitka --standalone \
       --show-progress \
       --show-memory \
       --mingw64 \
       --follow-imports \
       --output-dir=dist \
       main.py
```

#### 2. 选择性模块编译

```bash
# 调试模式：不编译第三方库，加快编译速度
nuitka --standalone \
       --mingw64 \
       --show-progress \
       --nofollow-imports \
       --follow-import-to=mypackage \
       --output-dir=debug \
       main.py

# 发布模式：编译所有模块
nuitka --standalone \
       --windows-disable-console \
       --mingw64 \
       --show-progress \
       --follow-imports \
       --nofollow-import-to=numpy,pandas \
       --output-dir=release \
       main.py
```

#### 3. GUI应用编译

```python
# gui_app.py - Tkinter GUI示例
import tkinter as tk
from tkinter import messagebox

class SimpleApp:
    def __init__(self, root):
        """初始化GUI应用"""
        self.root = root
        self.root.title("Nuitka GUI示例")
        self.root.geometry("300x200")
        
        # 创建界面元素
        self.label = tk.Label(root, text="请输入您的姓名:")
        self.label.pack(pady=10)
        
        self.entry = tk.Entry(root, width=20)
        self.entry.pack(pady=5)
        
        self.button = tk.Button(root, text="问候", command=self.greet)
        self.button.pack(pady=10)
    
    def greet(self):
        """问候功能"""
        name = self.entry.get()
        if name:
            messagebox.showinfo("问候", f"Hello, {name}!")
        else:
            messagebox.showwarning("警告", "请输入姓名")

def main():
    """主函数"""
    root = tk.Tk()
    app = SimpleApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
```

```bash
# 编译GUI应用
nuitka --standalone \
       --windows-disable-console \
       --mingw64 \
       --show-progress \
       --enable-plugin=tk-inter \
       --output-dir=gui_dist \
       gui_app.py
```

### 实际案例

#### 案例1：阿里云站点监控功能打包

**背景：** 原始代码功能是用来添加阿里云站点监控功能的，之前尝试使用pyinstaller来进行打包，但是没有成功，失败的原因是因为aliyunsdkcore依赖了entry_config.json文件，而pyinstaller并不能去获取到，我尝试添加目录也没有成功，今天试下nuitka看看是否能够成功。

**打包前执行效果：**
```bash
aliyun-alert(master) ✗: python alertadd.py www.baidu.com
{"RequestId":"D1DD68D4-7D93-2C94-A362-DF9F1E8C46F4","Data":"29884879351CF69959852ABFC269EFEB26564237","Code":"200","Success":true}
{"RequestId":"048AF305-EC0A-4D3A-8722-C6D2FA163E46","Data":"7A2E57F9E7D1FF3ED242163231A403C526564237","Code":"200","Success":true}
```

**打包命令：**
```bash
python -m nuitka --follow-imports --include-plugin-directory=/aliyun-alert alertadd.py
```

**打包后执行效果：**
```bash
aliyun-alert(master) ✗: ./alertadd.bin www.baidu.com
{"RequestId":"E8D95559-9133-4A5E-AEC0-70581DB87A21","Data":"D64121A091FB85A818DB42268E8B5D3F26564254","Code":"200","Success":true}
aliyun-alert(master) ✗:
```

**结果：** 成功！Nuitka成功解决了PyInstaller无法处理的依赖问题。

#### 案例2：Web服务编译示例

```python
# web_server.py - Flask Web服务
from flask import Flask, jsonify
import os
import sys

app = Flask(__name__)

@app.route('/')
def home():
    """首页路由"""
    return jsonify({
        "message": "Hello from Nuitka compiled Flask app!",
        "status": "success"
    })

@app.route('/info')
def info():
    """信息路由"""
    return jsonify({
        "python_version": sys.version,
        "executable": sys.executable,
        "platform": sys.platform
    })

def main():
    """主函数"""
    print("启动Nuitka编译的Flask应用...")
    app.run(host='127.0.0.1', port=5000, debug=False)

if __name__ == "__main__":
    main()
```

```bash
# 编译Web服务
nuitka --standalone \
       --show-progress \
       --mingw64 \
       --include-package=flask \
       --follow-import-to=flask \
       --output-dir=web_dist \
       web_server.py
```

## ⚠️ 注意事项

### 性能考虑

1. **编译时间**：复杂项目编译时间较长，建议在开发阶段使用`--nofollow-imports`
2. **内存使用**：编译过程消耗大量内存，建议关闭其他程序
3. **文件大小**：编译后的文件通常比PyInstaller生成的文件更大

### 兼容性问题

```bash
# 处理特定库的兼容性
# 对于某些库，可能需要特殊处理
nuitka --standalone \
       --show-progress \
       --mingw64 \
       --nofollow-import-to=numpy,scipy,matplotlib \
       --include-package=requests \
       main.py

# 编译完成后手动复制不兼容的库到输出目录
```

### 调试技巧

1. **分阶段编译**：先用`--nofollow-imports`快速测试
2. **查看详细信息**：使用`--show-memory`和`--show-progress`
3. **插件支持**：根据需要启用相应插件

```bash
# 常用插件
--enable-plugin=tk-inter      # Tkinter支持
--enable-plugin=qt-plugins    # PyQt支持
--enable-plugin=numpy         # NumPy优化
--enable-plugin=pylint-warnings  # 警告信息
```

### 最佳实践

1. **开发环境**：使用虚拟环境，只安装必要的包
2. **分层编译**：核心业务逻辑编译，第三方库保持原样
3. **测试验证**：编译后充分测试功能完整性

```bash
# 推荐的开发流程
# 1. 创建虚拟环境
conda create -n nuitka_env python=3.9
conda activate nuitka_env

# 2. 安装必要依赖
pip install nuitka 项目依赖包

# 3. 调试编译
nuitka --standalone --show-progress --nofollow-imports main.py

# 4. 发布编译
nuitka --standalone --show-progress --follow-imports main.py
```

## 📊 同类工具对比

nuitka工具的出色程度超出了我的预料(同样也是支持win的)，哈哈，是真的香甜可口，除了我们前面提到的工具之外还有什么其他的么？同类工具对比图片：

| Solution | Windows | Linux | OSX | Python3 | License | One-file mode | Zipfile import | Eggs | pkg_resources support | Latest release date |
| -------- | ------- | ----- | --- | ------- | ------- | ------------- | -------------- | ---- | -------------------- | ------------------- |
| bbFreeze | yes | yes | yes | no | MIT | no | yes | yes | yes | Jan 20,2014 |
| py2exe | yes | no | no | yes | MIT | yes | yes | no | no | Oct 21,2014 |
| pyInstaller | yes | yes | yes | yes | GPL | yes | no | yes | no | Jul 9,2019 |
| cx_Freeze | yes | yes | yes | yes | PSF | no | yes | yes | no | Aug 29,2019 |
| py2app | yes | no | yes | yes | MIT | no | yes | yes | yes | Mar 25,2019 |

## 🔗 相关内容

- [PyInstaller - Python打包工具](../pyinstaller/)
- [Python性能优化](../../basics/)
- [Python模块和包管理](../../basics/packages/)

## 📚 扩展阅读

**引用链接：**

[1] Nuitka对应的github地址: https://github.com/Nuitka/Nuitka

[2] Nuitka官网: http://nuitka.net/

[3] 同类工具对比图片来源: https://docs.python-guide.org/shipping/freezing/

**其他相关资源：**
- [Nuitka官方网站](http://nuitka.net/)
- [Nuitka GitHub仓库](https://github.com/Nuitka/Nuitka)
- [Nuitka用户手册](http://nuitka.net/doc/user-manual.html)
- [Python编译器比较](https://wiki.python.org/moin/PythonImplementations)

## 🏷️ 标签

`编译器` `打包` `性能优化` `工具` `Nuitka`

---

**最后更新**: 2024-01-01  
**作者**: Python模型书  
**版本**: 1.0