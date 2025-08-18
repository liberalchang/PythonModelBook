---
layout: doc
title: PyAutoGUI - Python 自动化控制库
permalink: /docs/thirdparty/pyautogui/
category: thirdparty
tags: [pyautogui, 自动化, GUI, 鼠标控制, 键盘控制, 截图, 图像识别, 桌面自动化]
description: PyAutoGUI 是一个跨平台的 Python 自动化库，可以控制鼠标和键盘，自动化桌面操作，支持截图和图像识别功能
author: Python 技术文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
python_version: "2.7, 3.3+"
library_version: "pyautogui>=0.9.0"
difficulty: "初级"
estimated_time: "120分钟"
---

# PyAutoGUI - Python 自动化控制库

## 📝 概述

PyAutoGUI 是一个功能强大的跨平台 Python 自动化库，允许 Python 脚本控制鼠标和键盘，并自动与其他应用程序交互。PyAutoGUI 的 API 设计简单直观，易于上手，支持 Windows、macOS 和 Linux 系统，并且兼容 Python 2 和 Python 3。

该库的主要特点：
- **跨平台兼容**：支持 Windows、macOS、Linux
- **简单易用**：API 设计直观，学习成本低  
- **功能全面**：鼠标控制、键盘输入、截图、图像识别
- **安全保护**：内置故障保护机制防止程序失控

## 🎯 学习目标

- 掌握 PyAutoGUI 的安装和基本配置
- 学会控制鼠标移动、点击和拖拽操作
- 熟练使用键盘输入和快捷键功能
- 掌握屏幕截图和图像定位技术
- 了解消息框和用户交互功能
- 学会编写实用的桌面自动化脚本

## 📋 前置知识

- Python 基础语法和函数调用
- 计算机坐标系统概念
- 基本的图像处理知识
- 键盘快捷键操作

## 🔍 详细内容

### 安装配置

#### Windows 安装
```bash
pip install pyautogui
```

#### Linux 安装
```bash
python3 -m pip install pyautogui
sudo apt-get install scrot
sudo apt-get install python3-tk
sudo apt-get install python3-dev
```

#### 导入库
```python
import pyautogui
```

### 坐标系统

PyAutoGUI 使用笛卡尔坐标系统：
- X 坐标：从左侧的 0 开始，向右增加
- Y 坐标：从顶部的 0 开始，向下增加  
- 左上角像素位于坐标 (0, 0)
- 分辨率为 1920x1080 的屏幕，右下角坐标为 (1919, 1079)

```
0,0       X increases -->
+---------------------------+
|                           | Y increases
|                           |     |
|   1920 x 1080 screen      |     |
|                           |     V
|                           |
|                           |
+---------------------------+ 1919, 1079
```

### 基础函数

#### 屏幕信息获取
```python
# 获取当前鼠标位置
current_pos = pyautogui.position()
print(f"鼠标当前位置: {current_pos}")

# 获取屏幕分辨率
screen_size = pyautogui.size()
print(f"屏幕分辨率: {screen_size}")

# 判断坐标是否在屏幕范围内
x, y = 100, 200
is_on_screen = pyautogui.onScreen(x, y)
print(f"坐标 ({x}, {y}) 是否在屏幕上: {is_on_screen}")
```

### 安全保护机制

#### 设置暂停间隔
```python
# 每次调用后暂停 2.5 秒
pyautogui.PAUSE = 2.5
```

#### 故障保护功能
```python
# 启用故障保护（默认开启）
# 鼠标移动到屏幕左上角会抛出 FailSafeException 异常
pyautogui.FAILSAFE = True

# 关闭故障保护（不推荐）
# pyautogui.FAILSAFE = False
```

## 💡 实际应用

### 鼠标控制

#### 鼠标移动
```python
# 将鼠标移动到指定位置
x, y = 200, 100
duration = 1  # 移动时间（秒）
pyautogui.moveTo(x, y, duration=duration)

# 相对移动鼠标
x_offset, y_offset = 30, -50
duration = 0.5
pyautogui.moveRel(x_offset, y_offset, duration=duration)
```

#### 鼠标点击
```python
# 基本点击操作
x, y = 500, 300
pyautogui.click(x=x, y=y, clicks=1, interval=0.5, button='left')

# 便捷点击函数
pyautogui.rightClick(x=x+50, y=y)      # 右键单击
pyautogui.middleClick(x=x+100, y=y)    # 中键单击
pyautogui.doubleClick(x=x+150, y=y)    # 左键双击
pyautogui.tripleClick(x=x+200, y=y)    # 左键三击
```

#### 鼠标拖拽
```python
# 拖拽到指定位置
start_x, start_y = 100, 100
end_x, end_y = 300, 300
duration = 1.5
pyautogui.dragTo(end_x, end_y, duration=duration)

# 相对拖拽
x_offset, y_offset = 50, -30
duration = 1.0
pyautogui.dragRel(x_offset, y_offset, duration=duration)
```

#### 鼠标滚动
```python
# 在指定位置滚动
x, y = 500, 400
scroll_clicks = 3  # 正数向上滚动，负数向下滚动
pyautogui.scroll(clicks=scroll_clicks, x=x, y=y)
```

### 键盘控制

#### 文本输入
```python
# 输入文本
text = "Hello, PyAutoGUI!"
interval = 0.1  # 字符之间的间隔
pyautogui.typewrite(message=text, interval=interval)

# 输入特殊按键
special_keys = ['tab', 'enter', 'space', 'backspace', 'delete']
pyautogui.typewrite(special_keys, interval=0.2)

# 查看所有支持的按键
print(pyautogui.KEYBOARD_KEYS)
```

#### 快捷键操作
```python
# 组合键
pyautogui.hotkey('ctrl', 'c')    # 复制
pyautogui.hotkey('ctrl', 'v')    # 粘贴
pyautogui.hotkey('alt', 'tab')   # 切换窗口

# 单个按键
pyautogui.press('enter')         # 按回车键
pyautogui.press('f1')           # 按 F1 键
pyautogui.press('left', presses=3)  # 按左箭头键 3 次
```

#### 按键保持
```python
# 方式1：使用 keyDown 和 keyUp
pyautogui.keyDown('shift')
pyautogui.press('left')
pyautogui.press('left')
pyautogui.keyUp('shift')

# 方式2：使用上下文管理器
with pyautogui.hold('shift'):
    pyautogui.press(['left', 'left', 'left'])
```

### 截图和图像识别

#### 屏幕截图
```python
# 全屏截图
screenshot = pyautogui.screenshot()
screenshot.save('full_screen.png')

# 区域截图
region = (100, 100, 300, 200)  # (x, y, width, height)
region_shot = pyautogui.screenshot('region.png', region=region)
```

#### 图像定位
```python
# 在屏幕上查找图像
try:
    # 查找图像位置（返回左上角坐标及宽高）
    location = pyautogui.locateOnScreen('button.png', confidence=0.8)
    if location:
        print(f"找到图像，位置: {location}")
        
        # 获取图像中心坐标
        center = pyautogui.locateCenterOnScreen('button.png', confidence=0.8)
        if center:
            pyautogui.click(center)  # 点击图像中心
    else:
        print("未找到指定图像")
        
except pyautogui.ImageNotFoundException:
    print("图像识别失败")
```

#### 像素颜色检测
```python
# 获取指定位置的像素颜色
x, y = 100, 200
pixel_color = pyautogui.pixel(x, y)
print(f"位置 ({x}, {y}) 的颜色: {pixel_color}")

# 检查像素颜色是否匹配
expected_color = (255, 255, 255)  # 白色
tolerance = 10  # 容差范围
is_match = pyautogui.pixelMatchesColor(x, y, expected_color, tolerance=tolerance)
print(f"颜色匹配: {is_match}")
```

### 消息框和用户交互

#### 各类消息框
```python
# 警告框
alert_result = pyautogui.alert('这是一个警告消息！', '警告', 'OK')
print(f"警告框返回值: {alert_result}")

# 确认框
confirm_result = pyautogui.confirm('确定要继续吗？', '确认', ['是', '否'])
print(f"确认框返回值: {confirm_result}")

# 输入框
prompt_result = pyautogui.prompt('请输入您的姓名:', '输入', '默认值')
print(f"输入框返回值: {prompt_result}")

# 密码输入框
password_result = pyautogui.password('请输入密码:', '密码', default='', mask='*')
print(f"密码框返回值: {password_result}")
```

### 高级功能

#### 缓动函数（动画效果）
```python
# 查看所有可用的缓动函数
print([func for func in dir(pyautogui) if func.startswith('ease')])

# 使用不同的缓动效果
x, y = 500, 300
duration = 2

# 开始慢，结束快
pyautogui.moveTo(x, y, duration, pyautogui.easeInQuad)

# 开始快，结束慢
pyautogui.moveTo(x+100, y, duration, pyautogui.easeOutQuad)

# 弹跳效果
pyautogui.moveTo(x+200, y, duration, pyautogui.easeInBounce)

# 弹性效果
pyautogui.moveTo(x+300, y, duration, pyautogui.easeInElastic)
```

#### 自动化脚本示例
```python
def automate_form_filling():
    """自动填写表单示例"""
    try:
        # 设置安全暂停
        pyautogui.PAUSE = 1
        
        # 点击姓名输入框
        name_box = pyautogui.locateCenterOnScreen('name_field.png', confidence=0.8)
        if name_box:
            pyautogui.click(name_box)
            pyautogui.typewrite('张三', interval=0.1)
        
        # 按 Tab 键移动到下一个输入框
        pyautogui.press('tab')
        pyautogui.typewrite('zhangsan@email.com', interval=0.05)
        
        # 提交表单
        submit_btn = pyautogui.locateCenterOnScreen('submit_button.png', confidence=0.8)
        if submit_btn:
            pyautogui.click(submit_btn)
            
        print("表单填写完成")
        
    except Exception as e:
        print(f"自动化过程出错: {e}")

# 调用自动化函数
# automate_form_filling()
```

## ⚠️ 注意事项

### 使用限制
- **双屏支持**：PyAutoGUI 只能处理主屏幕，不支持多显示器操作
- **按键状态**：无法检测当前键盘某个键是否被按下
- **权限要求**：某些系统可能需要额外权限才能控制鼠标和键盘

### 性能注意事项
- **图像识别速度**：图像定位功能较耗时（约 3 秒左右），建议使用 `region` 参数限制搜索区域
- **置信度设置**：调整 `confidence` 参数可以提高识别成功率，但需要安装 OpenCV
- **灰度加速**：使用 `grayscale=True` 可以提升约 30% 的识别速度

### 安全建议
- **保持故障保护开启**：避免程序失控时无法停止
- **设置适当暂停**：给操作之间留出足够的反应时间
- **异常处理**：在自动化脚本中添加适当的错误处理机制
- **测试环境**：在安全的测试环境中调试脚本

### 常见问题解决
```python
# 1. 图像识别失败时的处理
try:
    location = pyautogui.locateOnScreen('target.png', confidence=0.7)
except pyautogui.ImageNotFoundException:
    print("未找到目标图像，请检查图像文件和屏幕内容")

# 2. 提高图像识别效率
region = (0, 0, 800, 600)  # 限制搜索区域
location = pyautogui.locateOnScreen('target.png', region=region, grayscale=True)

# 3. 处理不同分辨率
screen_width, screen_height = pyautogui.size()
# 使用相对坐标而非绝对坐标
relative_x = int(screen_width * 0.5)  # 屏幕中央
relative_y = int(screen_height * 0.3)
```

## 🔗 相关内容

- [NumPy 数值计算库](../numpy/) - 图像数组处理
- [Pandas 数据分析库](../pandas/) - 数据记录和分析
- [Loguru 日志记录库](../loguru/) - 自动化脚本日志记录
- [Python 基础语法](../../basics/) - 函数和异常处理

## 📚 扩展阅读

- [PyAutoGUI 官方文档](https://pyautogui.readthedocs.io/)
- [PyAutoGUI GitHub 仓库](https://github.com/asweigart/pyautogui)
- [PyAutoGUI 中文教程](https://github.com/asweigart/pyautogui/blob/master/docs/simplified-chinese.ipynb)
- [图像识别最佳实践](https://pyautogui.readthedocs.io/en/latest/screenshot.html)
- [桌面自动化案例集合](https://automatetheboringstuff.com/)
- [参考：原文链接（CSDN）](https://blog.csdn.net/LuohenYJ/article/details/122071733)

## 🏷️ 标签

`桌面自动化` `鼠标控制` `键盘输入` `图像识别` `截图` `GUI 测试` `RPA` `批量操作`

---

**最后更新**: 2024-01-15  
**作者**: Python 技术文档工程师  
**版本**: 1.0