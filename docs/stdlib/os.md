---
layout: doc
title: os 模块 - 操作系统接口
permalink: /docs/stdlib/os/
category: stdlib
tags: [os, 操作系统, 文件操作, 目录操作, 系统接口, 路径处理]
description: Python os 模块详解，提供操作系统接口功能，包括文件目录操作、路径处理、环境变量访问等跨平台系统功能
author: Python 文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# os 模块 - 操作系统接口

## 📝 概述

os 模块是 Python 标准库中用于访问操作系统功能的核心模块。它提供了便携式的操作系统接口，可以实现跨平台访问，包括文件和目录操作、环境变量访问、路径处理等功能。无论是在 Windows、Linux 还是 macOS 系统上，os 模块都能提供一致的 API 接口。

## 🎯 学习目标

- 掌握 os 模块的基本概念和系统接口功能
- 学会获取操作系统信息和环境变量
- 熟练使用文件和目录操作功能
- 掌握路径处理和文件系统遍历技巧
- 了解跨平台编程注意事项
- 学会使用 os.path 子模块进行路径操作

## 📋 前置知识

- Python 基本语法和数据类型
- 文件系统基本概念（文件、目录、路径）
- 操作系统基础知识
- 异常处理机制

## 🔍 详细内容

### 基本概念

os 模块提供了与操作系统交互的接口，主要功能包括：
- 获取系统信息和环境变量
- 文件和目录的创建、删除、重命名
- 路径处理和文件系统遍历
- 进程管理（部分功能）

### 系统信息获取

#### 获取路径分隔符

```python
import os

# 获取系统路径分隔符
print(os.sep)  # Linux/macOS: '/', Windows: '\'
```

#### 获取操作系统类型

```python
import os

# 获取操作系统名称
print(os.name)  
# 'posix' - Linux/macOS 系统
# 'nt' - Windows 系统
```

#### 获取详细系统信息

```python
import os

# 获取操作系统的详细信息（Unix/Linux 系统）
try:
    uname = os.uname()
    print(uname)  # 输出系统所有详细信息
    print(uname.sysname)   # 输出系统操作系统类型
    print(uname.nodename)  # 输出主机名称
    print(uname.release)   # 输出内核版本
    print(uname.version)   # 输出系统版本
    print(uname.machine)   # 输出硬件架构
except AttributeError:
    print("os.uname() 不支持 Windows 系统")
```

### 环境变量操作

#### 访问环境变量

```python
import os

# 获取所有环境变量（字典形式）
print(os.environ)

# 获取特定环境变量
print(os.environ.get('PATH'))  # 系统 PATH 环境变量
print(os.environ.get('HOME'))  # 用户主目录（Unix/Linux）
print(os.environ.get('USERPROFILE'))  # 用户主目录（Windows）

# 常用环境变量（Windows）
# os.environ['HOMEPATH']     # 当前用户主目录
# os.environ['TEMP']         # 临时目录路径
# os.environ['PATHEXT']      # 可执行文件扩展名
# os.environ['SYSTEMROOT']   # 系统主目录
# os.environ['LOGONSERVER']  # 机器名
# os.environ['PROMPT']       # 设置提示符
```

#### 设置和修改环境变量

```python
import os

# 设置环境变量
os.environ['MY_VAR'] = 'my_value'

# 删除环境变量
if 'MY_VAR' in os.environ:
    del os.environ['MY_VAR']
```

## 💡 实际应用

### 文件操作

#### 创建和删除文件

```python
import os

# 创建空文件（Unix/Linux）
try:
    os.mknod('/tmp/test_file.txt')  # 文件存在时会报错
    print("文件创建成功")
except FileExistsError:
    print("文件已存在")
except AttributeError:
    # Windows 系统不支持 mknod，使用 open 代替
    with open('test_file.txt', 'w') as f:
        pass  # 创建空文件

# 删除文件
try:
    os.remove('test_file.txt')  # 文件不存在时会报错
    print("文件删除成功")
except FileNotFoundError:
    print("文件不存在")
```

#### 安全的文件操作

```python
import os

def safe_create_file(filename):
    """安全创建文件"""
    try:
        with open(filename, 'x') as f:  # 'x' 模式：独占创建
            pass
        print(f"文件 {filename} 创建成功")
    except FileExistsError:
        print(f"文件 {filename} 已存在")

def safe_remove_file(filename):
    """安全删除文件"""
    if os.path.exists(filename):
        os.remove(filename)
        print(f"文件 {filename} 删除成功")
    else:
        print(f"文件 {filename} 不存在")

# 使用示例
safe_create_file('example.txt')
safe_remove_file('example.txt')
```

### 目录操作

#### 基本目录操作

```python
import os

# 列出目录内容
print(os.listdir('.'))  # 列出当前目录

# 创建目录
try:
    os.mkdir('test_dir')  # 创建单级目录，父目录必须存在
    print("目录创建成功")
except FileExistsError:
    print("目录已存在")

# 递归创建目录
os.makedirs('parent/child/grandchild', exist_ok=True)
print("递归目录创建成功")

# 删除空目录
try:
    os.rmdir('test_dir')  # 只能删除空目录
    print("目录删除成功")
except OSError as e:
    print(f"删除失败: {e}")

# 递归删除空目录
try:
    os.removedirs('parent/child/grandchild')  # 递归删除空目录
    print("递归目录删除成功")
except OSError as e:
    print(f"递归删除失败: {e}")
```

#### 安全的目录操作

```python
import os
import shutil

def safe_mkdir(path):
    """安全创建目录"""
    try:
        os.makedirs(path, exist_ok=True)
        print(f"目录 {path} 创建成功")
    except PermissionError:
        print(f"没有权限创建目录 {path}")

def safe_rmdir(path):
    """安全删除目录（包括非空目录）"""
    if os.path.exists(path):
        if os.path.isdir(path):
            try:
                shutil.rmtree(path)  # 删除整个目录树
                print(f"目录 {path} 删除成功")
            except PermissionError:
                print(f"没有权限删除目录 {path}")
        else:
            print(f"{path} 不是目录")
    else:
        print(f"目录 {path} 不存在")

# 使用示例
safe_mkdir('test/nested/path')
safe_rmdir('test')
```

### 文件和目录重命名

```python
import os

def safe_rename(old_name, new_name):
    """安全重命名文件或目录"""
    try:
        if os.path.exists(old_name):
            if not os.path.exists(new_name):
                os.rename(old_name, new_name)
                print(f"重命名成功: {old_name} -> {new_name}")
            else:
                print(f"目标 {new_name} 已存在")
        else:
            print(f"源 {old_name} 不存在")
    except OSError as e:
        print(f"重命名失败: {e}")

# 使用示例
# 创建测试文件和目录
with open('old_file.txt', 'w') as f:
    f.write("测试内容")
os.mkdir('old_dir')

# 重命名操作
safe_rename('old_file.txt', 'new_file.txt')
safe_rename('old_dir', 'new_dir')

# 清理
os.remove('new_file.txt')
os.rmdir('new_dir')
```

### 路径处理（os.path 模块）

#### 路径判断

```python
import os.path

# 判断路径是否存在
print(os.path.exists('/etc'))  # Linux: True, Windows: False
print(os.path.exists('C:\\Windows'))  # Windows: True, Linux: False

# 判断是否为目录
print(os.path.isdir('.'))  # True (当前目录)

# 判断是否为文件
print(os.path.isfile(__file__))  # True (当前脚本文件)

# 判断是否为绝对路径
print(os.path.isabs('/home/user'))  # Unix: True
print(os.path.isabs('C:\\Users'))   # Windows: True
print(os.path.isabs('relative/path'))  # False
```

#### 路径处理和组合

```python
import os.path

# 获取绝对路径
print(os.path.abspath('relative/path'))
print(os.path.abspath('.'))  # 当前目录的绝对路径

# 路径组合
path1 = os.path.join('home', 'user', 'documents')
print(path1)  # home/user/documents (Unix) 或 home\user\documents (Windows)

# 特殊情况：绝对路径会覆盖前面的路径
path2 = os.path.join('home', '/tmp', 'file.txt')
print(path2)  # /tmp/file.txt

# 安全的路径组合
def safe_join(*paths):
    """安全的路径组合，处理绝对路径"""
    result = paths[0]
    for path in paths[1:]:
        if os.path.isabs(path):
            print(f"警告: {path} 是绝对路径，将覆盖前面的路径")
        result = os.path.join(result, path)
    return result

print(safe_join('home', 'user', 'file.txt'))
```

#### 路径分解

```python
import os.path

filepath = '/home/user/documents/file.txt'

# 获取文件名
print(os.path.basename(filepath))  # file.txt

# 获取目录路径
print(os.path.dirname(filepath))   # /home/user/documents

# 分离路径和文件名
dir_path, filename = os.path.split(filepath)
print(f"目录: {dir_path}, 文件名: {filename}")

# 分离文件名和扩展名
name, ext = os.path.splitext(filepath)
print(f"文件名: {name}, 扩展名: {ext}")

# 实际应用示例
def analyze_path(path):
    """分析路径信息"""
    print(f"原始路径: {path}")
    print(f"绝对路径: {os.path.abspath(path)}")
    print(f"目录: {os.path.dirname(path)}")
    print(f"文件名: {os.path.basename(path)}")
    
    name, ext = os.path.splitext(path)
    print(f"不含扩展名: {name}")
    print(f"扩展名: {ext}")
    
    print(f"存在: {os.path.exists(path)}")
    if os.path.exists(path):
        print(f"是文件: {os.path.isfile(path)}")
        print(f"是目录: {os.path.isdir(path)}")

# 测试
analyze_path(__file__)  # 分析当前脚本文件
```

### 目录遍历

#### 使用 os.walk() 遍历目录树

```python
import os
from os.path import join

def walk_directory(directory):
    """遍历目录树"""
    for root, dirs, files in os.walk(directory):
        # root: 当前目录路径
        # dirs: 当前目录下的子目录列表
        # files: 当前目录下的文件列表
        
        print(f"目录: {root}")
        print(f"  子目录: {dirs}")
        print(f"  文件: {files}")
        
        # 处理每个文件
        for filename in files:
            filepath = join(root, filename)
            print(f"  完整路径: {filepath}")
        print("-" * 50)

# 遍历当前目录
walk_directory('.')
```

#### 高级目录遍历

```python
import os
import fnmatch

def find_files(directory, pattern="*", recursive=True):
    """查找匹配模式的文件"""
    found_files = []
    
    if recursive:
        for root, dirs, files in os.walk(directory):
            for filename in files:
                if fnmatch.fnmatch(filename, pattern):
                    found_files.append(os.path.join(root, filename))
    else:
        for filename in os.listdir(directory):
            filepath = os.path.join(directory, filename)
            if os.path.isfile(filepath) and fnmatch.fnmatch(filename, pattern):
                found_files.append(filepath)
    
    return found_files

# 查找所有 Python 文件
python_files = find_files('.', '*.py')
print("Python 文件:")
for file in python_files:
    print(f"  {file}")

# 查找所有文本文件（非递归）
text_files = find_files('.', '*.txt', recursive=False)
print("文本文件:")
for file in text_files:
    print(f"  {file}")
```

### 工作目录操作

```python
import os

# 获取当前工作目录
current_dir = os.getcwd()
print(f"当前目录: {current_dir}")

# 改变工作目录
try:
    os.chdir('..')  # 切换到上级目录
    print(f"切换后目录: {os.getcwd()}")
    
    # 切换回原目录
    os.chdir(current_dir)
    print(f"恢复目录: {os.getcwd()}")
except OSError as e:
    print(f"目录切换失败: {e}")
```

### 进程与命令执行

os 模块提供了若干与进程和命令执行相关的函数，但在现代代码中更推荐使用 subprocess 模块以获得更好的可控性与安全性。

```python
import os
import sys

# 1) 简单执行系统命令（不推荐用于复杂需求）
ret = os.system('echo Hello OS')  # 返回命令退出码，0 表示成功
print(f"退出码: {ret}")

# 2) 使用 exec* 家族替换当前进程映像（调用后不再返回）
# 将当前 Python 进程替换为新的 Python 进程并执行内联代码
# 注意：执行到 execl 后，后续代码不会再运行
if '--exec-demo' in sys.argv:
    print('before exec...')
    os.execl(sys.executable, sys.executable, '-c', "print('replaced process')")
    print('this will never print')

# 3) 使用 execvp 传递参数列表（同样会替换当前进程）
# os.execvp('python', ['python', '-c', "print('hello from execvp')"])  # 示例

# 实践建议：优先使用 subprocess.run()/Popen() 进行进程管理
# import subprocess
# result = subprocess.run(['python', '-c', "print('hello')"], capture_output=True, text=True)
# print(result.stdout)

# Windows 平台便捷打开文件（注意仅限 Windows）
# if os.name == 'nt':
#     os.startfile('README.md')
```

要点与注意：
- os.system 仅返回退出码，无法方便地获取标准输出、标准错误；复杂场景建议使用 subprocess
- exec* 家族（execl/execv/execle/execve/execvp/execvpe）会替换掉当前进程，不会返回；适用于“移交控制权”的场景
- Windows 与 Unix 命令差异较大，跨平台场景避免直接硬编码命令字符串
- Windows 下可用 os.startfile 打开与文件关联的程序；Linux/macOS 下可使用 xdg-open/open 等命令（需配合 subprocess）

## ⚠️ 注意事项

### 跨平台兼容性

- **路径分隔符**：使用 `os.path.join()` 而不是硬编码的 `/` 或 `\`
- **绝对路径**：Windows 和 Unix 系统的绝对路径格式不同
- **权限**：不同系统的文件权限模式不同
- **特殊功能**：某些函数（如 `os.uname()`）只在特定系统上可用

### 错误处理

```python
import os

def robust_file_operation(filename):
    """健壮的文件操作示例"""
    try:
        # 检查文件是否存在
        if os.path.exists(filename):
            print(f"文件 {filename} 存在")
            
            # 获取文件信息
            stat_info = os.stat(filename)
            print(f"文件大小: {stat_info.st_size} 字节")
            
        else:
            print(f"文件 {filename} 不存在")
            
    except PermissionError:
        print(f"没有权限访问 {filename}")
    except OSError as e:
        print(f"操作系统错误: {e}")
    except Exception as e:
        print(f"未知错误: {e}")

# 测试
robust_file_operation(__file__)
robust_file_operation('/root/protected_file.txt')
```

### 打包工具兼容性

```python
import sys
import os

def get_script_directory():
    """获取脚本所在目录（兼容打包工具）"""
    if getattr(sys, 'frozen', False):
        # 使用 PyInstaller 等工具打包后
        return os.path.dirname(os.path.realpath(sys.argv[0]))
    else:
        # 正常运行的 Python 脚本
        return os.path.dirname(os.path.abspath(__file__))

script_dir = get_script_directory()
print(f"脚本目录: {script_dir}")
```

### 性能考虑

- **大目录遍历**：使用 `os.scandir()` 比 `os.listdir()` 更高效
- **路径操作**：频繁的路径操作考虑使用 `pathlib` 模块
- **文件检查**：避免重复调用 `os.path.exists()`

```python
import os

# 高效的目录扫描（Python 3.5+）
def efficient_scan(directory):
    """高效扫描目录"""
    try:
        with os.scandir(directory) as entries:
            for entry in entries:
                if entry.is_file():
                    print(f"文件: {entry.name}")
                elif entry.is_dir():
                    print(f"目录: {entry.name}")
    except OSError as e:
        print(f"扫描失败: {e}")

efficient_scan('.')
```

## 🔗 相关内容

- [pathlib 模块 - 面向对象的路径处理](../pathlib/)
- [shutil 模块 - 高级文件操作](../shutil/)
- [open() 函数 - 文件打开操作](../../builtins/open/)
- [文件操作基础](../../basics/with/)

## 📚 扩展阅读

- [Python 官方文档 - os 模块](https://docs.python.org/3/library/os.html)
- [Python 官方文档 - os.path 模块](https://docs.python.org/3/library/os.path.html)
- [PEP 519 - 添加文件系统路径协议](https://peps.python.org/pep-0519/)
- [跨平台 Python 开发指南](https://docs.python.org/3/howto/pyporting.html)

## 🏷️ 标签

`os` `操作系统` `文件操作` `目录操作` `路径处理` `跨平台` `系统接口`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档团队  
**版本**: 1.0