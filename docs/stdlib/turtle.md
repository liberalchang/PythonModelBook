---
layout: doc
title: turtle 模块 - 海龟绘图与 tkinter 图形界面
permalink: /docs/stdlib/turtle/
category: stdlib
tags: [turtle, tkinter, 绘图, 图形界面, GUI, 海龟绘图, 画布]
description: Python turtle 和 tkinter 模块详解，包括海龟绘图系统和图形用户界面开发，提供丰富的绘图功能和控件操作
author: Python 文档团队
date: 2024-12-16
updated: 2024-12-16
version: 1.0
difficulty: "初级"
---

# turtle 模块 - 海龟绘图与 tkinter 图形界面

## 📝 概述

turtle 绘图模块是 Python 内置的一个简单绘图工具，通常称为海龟绘图。绘图时有一个箭头，按照命令一笔一笔画出图形，就像海龟在屏幕上爬行，并留下爬行足迹，于是形成图形。同时 tkinter 模块提供了完整的图形用户界面（GUI）开发框架，是 Python 标准库中最重要的图形编程工具。

## 🎯 学习目标

- 掌握 turtle 模块的基本绘图概念和命令
- 学会使用 turtle 进行各种图形绘制
- 了解 tkinter 模块的基本组件和布局管理
- 掌握 tkinter 画布绘图和事件处理
- 能够创建基本的图形用户界面应用程序
- 学会使用 tkinter 控件进行交互式界面开发

## 📋 前置知识

- Python 基本语法和控制结构
- 函数定义和调用
- 基本的数学坐标概念
- 面向对象编程基础（tkinter 部分）

## 🔍 详细内容

### turtle 模块基础

#### 模块导入

使用 turtle 模块有两种导入方法：

```python
import turtle  
# 或者
from turtle import * 
```

#### 绘图三要素

turtle 绘图有位置、方向、画笔三个要素：

- **位置**：箭头在窗口中的位置，采用笛卡尔坐标系，以窗口中心为原点，向右为 x 轴正方向，向上为 y 轴正方向
- **方向**：箭头的指向，可以使用 `left(degree)`、`right(degree)` 函数使箭头分别向左向右旋转 degree 度
- **画笔**：绘制线条的颜色和宽度

#### 画笔控制函数

```python
# 画笔状态控制
down()          # 放下画笔，移动时绘制图形，为默认状态
up()            # 提起画笔，移动时不绘制图形

# 画笔属性设置
pensize(w)      # 或 width(w)：设置画笔宽度，w 为正数
pencolor(s)     # 或 color(s)：设置画笔颜色，s 为颜色字符串
fillcolor(s)    # 设置填充颜色
```

#### 箭头运动控制

```python
# 位置控制
goto(x, y)      # 将箭头移动到坐标 (x,y) 位置
reset()         # 清空绘图窗口并将箭头置于原点
forward(d)      # 向前移动 d 个像素距离
backward(d)     # 向后移动 d 个像素距离

# 方向控制
left(degree)    # 向左旋转 degree 度
right(degree)   # 向右旋转 degree 度

# 速度控制
speed(v)        # 控制移动速度，取值范围 [0,10]，也可用 'slow'、'fast'
```

## 💡 实际应用

### turtle 基础绘图示例

#### 基本操作示例

```python
import turtle

# 创建绘图窗口和画笔
t = turtle.Pen()

# 基本绘图操作
t.forward(50)    # 前进50像素
t.left(90)       # 左转90度
t.backward(100)  # 后退100像素
t.right(90)      # 右转90度

# 画笔控制
t.up()           # 抬起画笔，移动位置不会画出
t.down()         # 画笔放下，移动位置会画出路径
t.reset()        # 重置，清除画布，画笔回到起点
t.clear()        # 清除，只清屏，画笔起点不变

# 颜色和填充
t.color(1, 1, 0) # 设置填充颜色 RGB
t.circle(50)     # 画圆
t.begin_fill()   # 开始填充
t.end_fill()     # 结束填充
```

#### 绘制基本图形

##### 绘制正方形

```python
import turtle
t = turtle.Pen()
t.reset()

for x in range(1, 5):
    t.forward(50)
    t.left(90)
```

##### 绘制八角星星

```python
import turtle
t = turtle.Pen()
t.reset()

for x in range(1, 9):
    t.forward(100)
    t.left(225)
```

##### 绘制多角星星

```python
import turtle
t = turtle.Pen()
t.reset()

for x in range(1, 38):
    t.forward(100)
    t.left(175)
```

##### 绘制螺旋星

```python
import turtle
t = turtle.Pen()
t.reset()

for x in range(1, 20):
    t.forward(100)
    t.left(95)
```

##### 绘制长角星星

```python
import turtle
t = turtle.Pen()
t.reset()

for x in range(1, 19):
    t.forward(100)
    if x % 2 == 0:
        t.left(175)
    else:
        t.left(225)
```

#### 高级图形：科赫分形曲线雪花

```python
from turtle import *

def koch(n, k):
    """递归绘制科赫曲线"""
    if n == 0:
        forward(k)
    else:
        for angle in (60, -120, 60, 0):
            koch(n-1, k/3)
            left(angle)

# 绘制雪花
up()
goto(-150, 90)
down()

# 绘制三条边
koch(3, 300)
right(120)
koch(3, 300)
right(120)
koch(3, 300)
```

### tkinter 图形界面开发

#### 模块导入和基本概念

```python
from tkinter import *
```

tkinter 图形库由若干模块组成，包括 _tkinter（二进制扩展模块）、tkinter（主模块）和 tkinter.constants（常量定义）等。

#### 创建主窗口

```python
from tkinter import *

# 创建主窗口
tk = Tk()

# 设置窗口属性
tk['width'] = 300
tk['height'] = 200  
tk['bg'] = 'red'

# 设置窗口标题
tk.title('主窗口')

# 设置窗口尺寸和位置
tk.geometry("200x100-0+0")  # 宽度x高度±m±n

# 设置窗口是否可调整大小
tk.resizable(width=False, height=True)
```

#### 画布对象创建和使用

```python
from tkinter import *

tk = Tk()

# 创建画布
c = Canvas(tk, width=300, height=200, bg='white')

# 显示画布
c.pack()
```

#### tkinter 坐标系

tkinter 模块为画布建立了坐标系，以画布左上角为原点，从原点水平向右为 x 轴，从原点垂直向下为 y 轴。画布坐标使用整数，单位为像素。

#### 图形对象标识

图形对象采用标识号和标签（tag）方法进行标识：

```python
# 创建图形时指定标签
id1 = c.create_rectangle(10, 10, 100, 50, tags="No1")
id2 = c.create_rectangle(20, 30, 200, 100, tags=("myRect", "No2"))

# 修改标签
c.itemconfig(id1, tags=("myRect", "Rect1"))

# 添加新标签
c.addtag_withtag("ourRect", "Rect1")
```

#### 图形对象通用操作

```python
# 获取标签
print(c.gettags(id1))  # ('myRect','Rect1','ourRect')

# 查找图形对象
print(c.find_withtag("Rect1"))  # (1,)
print(c.find_withtag("all"))    # (1,2)

# 删除图形对象
c.delete(id1)

# 移动图形对象
c.move(id2, 10, 20)  # x方向移动10像素，y方向移动20像素
```

### tkinter 绘图功能

#### 颜色表示

```python
# 字符串颜色
colors = ['red', 'yellow', 'green', 'blue', 'gray', 'cyan', 'magenta', 'white', 'black']

# 深浅颜色
# red1, red2, red3, red4 (颜色逐渐加深)

# 十六进制颜色
# #rgb, #rrggbb, #rrrgggbbb
hex_colors = ['#f00', '#ff0000', '#fff000000']
```

#### 绘制矩形

```python
from tkinter import *

tk = Tk()
c = Canvas(tk, width=300, height=200, bg='white')
c.pack()

# 基本矩形
rect_id = c.create_rectangle(10, 10, 100, 50)

# 带属性的矩形
rect_id2 = c.create_rectangle(
    20, 20, 120, 80,
    outline='red',      # 边框颜色
    width=3,           # 边框宽度
    dash=(5, 2),       # 虚线样式
    fill='yellow',     # 填充颜色
    stipple='gray25',  # 填充效果
    state='normal'     # 显示状态
)

# 使用坐标元组
p1 = (10, 10)
p2 = (150, 100)
pp = (50, 60, 100, 150)
c.create_rectangle(p1, p2)
c.create_rectangle(pp)
```

#### 绘制椭圆

```python
# 椭圆由外接矩形定义
oval_id = c.create_oval(
    50, 50, 150, 100,
    outline='blue',
    width=2,
    fill='lightblue'
)
```

#### 绘制圆弧

```python
# 圆弧绘制
arc_id = c.create_arc(
    10, 10, 100, 100,
    start=0,        # 开始角度
    extent=90,      # 弧度范围
    style='pieslice', # 样式：pieslice(扇形)、arc(弧)、chord(弓形)
    outline='green',
    fill='lightgreen'
)
```

#### 绘制线条

```python
# 基本线条
line_id = c.create_line(
    10, 10, 50, 50, 100, 10, 150, 50,
    width=3,
    fill='red',
    smooth=True,        # 平滑曲线
    arrow='last',       # 箭头：none、first、last、both
    arrowshape=(8, 10, 3)  # 箭头形状
)
```

#### 绘制多边形

```python
# 多边形
polygon_id = c.create_polygon(
    50, 50, 100, 50, 125, 86, 75, 86,
    outline='purple',
    fill='pink',
    width=2,
    smooth=False
)
```

#### 显示文本

```python
# 文本显示
text_id = c.create_text(
    150, 100,
    text="Hello\nWorld",
    anchor='center',        # 锚点：n、s、e、w、center等
    fill='black',
    justify='center',       # 对齐：left、center、right
    font=("Arial", 12, "bold")
)
```

#### 显示图像

```python
# 加载和显示图像
try:
    image = PhotoImage(file="example.gif")  # 支持gif、png、bmp等
    image_id = c.create_image(
        100, 100,
        image=image,
        anchor='center'
    )
except:
    print("图像文件未找到")
```

### tkinter 控件系统

#### 常用控件类型

```python
from tkinter import *

root = Tk()

# 标签控件
label = Label(root, text="Python", font=('Arial', 12, 'bold'))
label.pack()

# 按钮控件
button = Button(root, text="Quit", command=root.quit)
button.pack()

# 输入框
entry = Entry(root, width=20)
entry.pack()

# 文本框
text = Text(root, width=30, height=10)
text.pack()

# 框架
frame = Frame(root, bg='lightgray')
frame.pack()

# 列表框
listbox = Listbox(root)
listbox.insert(1, "Item 1")
listbox.insert(2, "Item 2")
listbox.pack()
```

#### 控件属性设置

```python
# 方法1：使用 config() 方法
label.config(text="New Text", fg="red", bg="blue")

# 方法2：字典方式
label["text"] = "New Text"
label["fg"] = "red"

# 一次设置多个属性
label.config(text="Multi", fg="green", bg="yellow", font=("Times", 14))
```

#### 布局管理器

```python
from tkinter import *

root = Tk()

# pack 布局（打包布局）
label1 = Label(root, text="Top", bg="red")
label1.pack(side=TOP)

label2 = Label(root, text="Bottom", bg="blue")
label2.pack(side=BOTTOM)

label3 = Label(root, text="Left", bg="green")
label3.pack(side=LEFT)

label4 = Label(root, text="Right", bg="yellow")
label4.pack(side=RIGHT)

# grid 布局（网格布局）
button1 = Button(root, text="Button 1")
button1.grid(row=0, column=0)

button2 = Button(root, text="Button 2")
button2.grid(row=0, column=1)

button3 = Button(root, text="Button 3")
button3.grid(row=1, column=0)

# place 布局（精确位置布局）
label_place = Label(root, text="Placed", bg="orange")
label_place.place(x=50, y=50)
```

#### 选择性控件

```python
from tkinter import *

root = Tk()

# 复选框
var1 = IntVar()
check1 = Checkbutton(root, text="Python", variable=var1)
check1.pack()

var2 = IntVar()
check2 = Checkbutton(root, text="Java", variable=var2)
check2.pack()

# 单选按钮
var = IntVar()
radio1 = Radiobutton(root, text="选项1", variable=var, value=1)
radio1.pack()

radio2 = Radiobutton(root, text="选项2", variable=var, value=2)
radio2.pack()

# 获取选择状态
def get_selection():
    print(f"复选框1: {var1.get()}")
    print(f"复选框2: {var2.get()}")
    print(f"单选按钮: {var.get()}")

button = Button(root, text="获取选择", command=get_selection)
button.pack()
```

## ⚠️ 注意事项

### turtle 注意事项

- 使用 `from turtle import *` 时要注意命名空间污染
- 绘图完成后记得调用 `turtle.done()` 或在程序末尾添加 `input()` 等待用户输入，防止窗口立即关闭
- 复杂图形绘制时注意设置合适的绘图速度，避免等待时间过长
- 坐标系以窗口中心为原点，与一般的屏幕坐标系不同

### tkinter 注意事项

- tkinter 是单线程的，长时间运行的任务会阻塞界面
- 图像文件路径要使用正确的相对或绝对路径
- 不同操作系统上的字体可能不同，建议使用通用字体
- 控件的 `command` 参数传递的是函数对象，不要加括号
- 记得调用 `mainloop()` 进入事件循环

### 兼容性注意事项

- Python 2.x 中模块名是 `Tkinter`（大写T），Python 3.x 中是 `tkinter`（小写t）
- 某些方法在不同版本间可能有差异
- 颜色名称和显示效果在不同系统上可能略有不同

## 🔗 相关内容

- [math 模块 - 数学函数](../math/) - 绘图中的数学计算
- [Plotly](../../thirdparty/plotly/) - 交互式可视化库

## 📚 扩展阅读

- [Python turtle 官方文档](https://docs.python.org/3/library/turtle.html)
- [tkinter 官方文档](https://docs.python.org/3/library/tkinter.html)
- [Tk 官方文档](https://www.tcl.tk/man/tcl8.6/TkCmd/contents.htm)
- [Python GUI 编程教程](https://realpython.com/python-gui-tkinter/)

## 🏷️ 标签

`turtle` `tkinter` `绘图` `图形界面` `GUI` `海龟绘图` `画布` `控件` `事件处理` `布局管理`

---

**最后更新**: 2024-12-16  
**作者**: Python 文档团队  
**版本**: 1.0