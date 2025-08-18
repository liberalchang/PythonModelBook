---
layout: doc
title: Python 进度条库完全指南 - tqdm/Progress/Alive Progress/PySimpleGUI
permalink: /docs/thirdparty/progress-bars/
category: thirdparty
tags: [tqdm, Progress, Alive Progress, PySimpleGUI, 进度条, 用户界面, 第三方库]
description: 全面介绍 Python 中的进度条库，包括 tqdm、Progress、Alive Progress 和 PySimpleGUI，让长时间运行的程序提供直观的进度反馈。
author: Python技术文档工程师
date: 2024-01-16
updated: 2024-01-16
version: 1.0
difficulty: "初级"
---

# Python 进度条库完全指南

## 📝 概述

进度条是长时间运行程序的重要用户界面元素，能够直观显示任务完成情况，提升用户体验。本文档介绍四个主要的 Python 进度条库：tqdm（最流行）、Progress（多样式）、Alive Progress（动画效果）和 PySimpleGUI（图形界面），帮助开发者选择合适的解决方案。

## 🎯 学习目标

- 掌握 tqdm 的基础用法和高级功能
- 了解 Progress 库的多种进度条样式
- 学会使用 Alive Progress 创建动画进度条
- 掌握 PySimpleGUI 的图形化进度条实现
- 能够根据需求选择合适的进度条库

## 📋 前置知识

- Python 基础语法和循环结构
- 基本的文件操作和时间处理
- 简单的函数定义和模块导入

## 🔧 安装

```bash
# 安装 tqdm（最常用）
pip install tqdm

# 安装 Progress
pip install progress

# 安装 Alive Progress
pip install alive-progress

# 安装 PySimpleGUI（图形界面）
pip install PySimpleGUI
```

## 🔍 详细内容

### tqdm - 功能最全面的进度条库

#### 基本概念

tqdm 模块可以在控制台显示一个进度条，支持包装可迭代对象、手动更新、自定义样式等功能。

官方资源：
- PyPI 项目地址: https://pypi.org/project/tqdm/
- GitHub 仓库: https://github.com/tqdm/tqdm
- tqdm wiki: https://github.com/tqdm/tqdm/wiki

#### 简单用法 - 包装可迭代对象

```python
import tqdm
import time

# 包装 range 对象
for i in tqdm.tqdm(range(100)):
    # i = 0, 1, 2, ..., 99
    time.sleep(0.01)

# 包装列表
lt = ["a", "b", "c", "d"]
for i in tqdm.tqdm(lt):
    # i = "a", "b", "c", "d"
    time.sleep(1)

# 动态输出：
# 100%|██████████| 100/100 [00:01<00:00, 58.57it/s]
# 100%|██████████| 4/4 [00:04<00:00,  1.00s/it]
```

#### 使用 trange - 优化版本

```python
import tqdm
import time

# tqdm.trange(i) 是 tqdm(range(i)) 的优化实例
for i in tqdm.trange(100):
    # i = 0, 1, 2, ..., 99
    time.sleep(0.01)
```

#### 添加描述信息

```python
import tqdm
import time

# 在进度条前面添加描述
pbar = tqdm.tqdm(["A", "B", "C", "D"])
for c in pbar:
    time.sleep(1)
    pbar.set_description(f"Processing {c}")
    
# 动态输出：
# Processing D: 100%|██████████| 4/4 [00:04<00:00,  1.00s/it]
```

#### 手动创建和更新进度条

```python
import tqdm
import time

# 手动创建进度条
pbar = tqdm.tqdm(total=100)
try:
    for i in range(10):
        time.sleep(0.1)
        pbar.update(10)     # 更新 10 次 10，总数就是 100
finally:
    pbar.close()

# tqdm 支持 with 语句，上面代码相当于：
with tqdm.tqdm(total=100) as pbar:
    for i in range(10):
        time.sleep(0.1)
        pbar.update(10)

# 动态输出：
# 100%|██████████| 100/100 [00:01<00:00, 98.41it/s]
```

#### 自定义速度单位

```python
import tqdm
import time

# 自定义显示速度的单位（默认为"it"）
with tqdm.tqdm(total=100, unit="MB") as pbar:
    for i in range(10):
        time.sleep(0.1)
        pbar.update(10)
        
# 动态输出：
# 100%|██████████| 100/100 [00:01<00:00, 97.40MB/s]
```

#### 添加前缀、后缀和自定义单位

```python
import tqdm
import time

with tqdm.tqdm(total=1000, unit="KB") as pbar:
    for i in range(pbar.total):
        time.sleep(0.01)
        # 添加前缀，字符串形式
        pbar.set_description("Downloading")
        # 添加后缀，字典形式
        pbar.set_postfix({"written": f"{i}KB", "total": f"{pbar.total}KB"})
        # 更新进度
        pbar.update(1)

# 动态输出：
# Downloading: 100%|██████████| 1000/1000 [00:11<00:00, 84.49KB/s, written=999KB, total=1000KB]
```

### Progress - 多样式进度条库

#### 基本用法

```python
import time
from progress.bar import IncrementalBar

mylist = [1, 2, 3, 4, 5, 6, 7, 8]
bar = IncrementalBar('Countdown', max=len(mylist))
for item in mylist:
    bar.next()
    time.sleep(1)
bar.finish()
```

Progress 实现的进度条效果如下：

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/image/Pasted%20image%2020240315142705.png)

_Progressbar 的增量进度条_

如果你不喜欢该进度条的格式，还可以从以下格式中挑选：

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/image/Pasted%20image%2020240315142751.png)

#### 多种样式选择

Progress 库提供多种进度条样式：

- IncrementalBar - 增量进度条
- FillingSquaresBar - 填充方块
- FillingCirclesBar - 填充圆圈
- ChargingBar - 充电样式
- ShadyBar - 阴影样式

官方文档：https://pypi.org/project/progress/1.5/

### Alive Progress - 动画进度条库

#### 基本概念

Alive Progress 库可以创建具有动画效果的进度条，比传统进度条更加生动有趣。

#### 基本用法

```python
from alive_progress import alive_bar
import time

mylist = [1, 2, 3, 4, 5, 6, 7, 8]
with alive_bar(len(mylist)) as bar:
    for i in mylist:
        bar()
        time.sleep(1)
```

效果示例：

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/image/Pasted%20image%2020240315142938.png)

官方仓库：https://github.com/rsalmei/alive-progress

### PySimpleGUI - 图形化进度条

#### 基本概念

PySimpleGUI 提供图形化的进度条界面，适合桌面应用程序。

#### 简单图形进度条

```python
import PySimpleGUI as sg
import time

mylist = [1, 2, 3, 4, 5, 6, 7, 8]
for i, item in enumerate(mylist):
    sg.one_line_progress_meter('This is my progress meter!', 
                              i+1, len(mylist), '-key-')
    time.sleep(1)
```

运行示例：

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/image/Pasted%20image%2020240315143139.png)

#### 自定义窗口进度条

```python
import PySimpleGUI as sg
import time

mylist = [1, 2, 3, 4, 5, 6, 7, 8]

# 定义布局
progressbar = [[sg.ProgressBar(len(mylist), orientation='h', 
                              size=(51, 10), key='progressbar')]]
outputwin = [[sg.Output(size=(78, 20))]]
layout = [
    [sg.Frame('Progress', layout=progressbar)],
    [sg.Frame('Output', layout=outputwin)],
    [sg.Submit('Start'), sg.Cancel()]
]

# 创建窗口
window = sg.Window('Custom Progress Meter', layout)
progress_bar = window['progressbar']

while True:
    event, values = window.read(timeout=10)
    if event == 'Cancel' or event is None:
        break
    elif event == 'Start':
        for i, item in enumerate(mylist):
            print(item)
            time.sleep(1)
            progress_bar.UpdateBar(i + 1)

window.close()
```

## 💡 实际应用

### 场景 1：文件处理进度显示

```python
import tqdm
import os
import time

def process_files(directory):
    """处理目录中的所有文件"""
    files = os.listdir(directory)
    
    with tqdm.tqdm(total=len(files), desc="Processing files") as pbar:
        for filename in files:
            # 模拟文件处理
            time.sleep(0.1)
            pbar.set_postfix({"current": filename})
            pbar.update(1)

# 使用示例
# process_files('/path/to/files')
```

### 场景 2：数据下载进度

```python
import tqdm
import requests

def download_with_progress(url, filename):
    """带进度条的文件下载"""
    response = requests.get(url, stream=True)
    total_size = int(response.headers.get('content-length', 0))
    
    with open(filename, 'wb') as file, \
         tqdm.tqdm(desc=filename, total=total_size, unit='B', 
                  unit_scale=True, unit_divisor=1024) as pbar:
        for chunk in response.iter_content(chunk_size=1024):
            size = file.write(chunk)
            pbar.update(size)

# 使用示例
# download_with_progress('https://example.com/file.zip', 'file.zip')
```

### 场景 3：机器学习训练进度

```python
import tqdm
import time

def train_model(epochs=100):
    """模拟机器学习训练过程"""
    losses = []
    
    with tqdm.trange(epochs, desc="Training") as pbar:
        for epoch in pbar:
            # 模拟训练过程
            time.sleep(0.05)
            loss = 1.0 / (epoch + 1)  # 模拟损失递减
            losses.append(loss)
            
            # 更新进度条显示
            pbar.set_postfix({
                'Loss': f'{loss:.4f}',
                'Avg Loss': f'{sum(losses)/len(losses):.4f}'
            })

# 使用示例
# train_model(50)
```

## ⚠️ 注意事项

### tqdm 使用注意

- 在 Jupyter Notebook 中使用 `tqdm.notebook.tqdm` 获得更好效果
- 多进程环境下使用 `tqdm.tqdm(..., position=进程ID)` 避免输出混乱
- 嵌套循环中使用 `leave=False` 参数避免进度条残留

### Progress 库注意

- 需要手动调用 `bar.finish()` 完成进度条
- 不同样式的 API 略有差异
- 在某些终端中显示效果可能不一致

### PySimpleGUI 注意

- 图形界面会阻塞程序执行
- 需要处理窗口事件循环
- 在某些操作系统上可能需要额外配置

## 🔗 相关内容

- [标准库 - time 模块](../../stdlib/time/)
- [标准库 - os 模块](../../stdlib/os/)
- [第三方库 - requests](../requests/)

## 📚 扩展阅读

- [tqdm 官方文档](https://tqdm.github.io/)
- [Progress 库官方页面](https://pypi.org/project/progress/)
- [Alive Progress 项目主页](https://github.com/rsalmei/alive-progress)
- [PySimpleGUI 官方文档](https://pysimplegui.readthedocs.io/)
- [Requests 官方文档](https://docs.python-requests.org/)
- 本文参考链接：https://xiets.blog.csdn.net/article/details/117606314
- [Python 进度条最佳实践指南](https://realpython.com/python-progress-bars/)

## 🏷️ 标签

`tqdm` `Progress` `Alive Progress` `PySimpleGUI` `进度条` `用户界面` `第三方库`

---

**最后更新**: 2024-01-16  
**作者**: Python技术文档工程师  
**版本**: 1.0