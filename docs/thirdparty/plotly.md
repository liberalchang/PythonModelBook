---
layout: doc
title: Plotly - Python 交互式可视化图形库
permalink: /docs/thirdparty/plotly/
category: thirdparty
tags: [plotly, 可视化, 图表, 交互式, 数据分析, plotly.express, 绘图]
description: Plotly 是一个强大的 Python 图形库，可以制作交互式、出版物质量的图形，包括线图、散点图、条形图、热图等多种图表类型
author: Python 技术文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# Plotly - Python 交互式可视化图形库

## 📝 概述

Plotly 是一个功能强大的 Python 图形库，专门用于制作交互式、出版物质量的图形。它可以创建线图、散点图、面积图、条形图、误差条、方框图、直方图、热图、子图、多轴、极坐标图和气泡图等多种图表类型。Plotly 与 Pandas 深度集成，能够输出精美的互动式可视化网页图表。

## 🎯 学习目标

- 掌握 Plotly 的安装和基础配置
- 学会使用 Pandas 后端和 plotly.express 两种绘图方式
- 熟悉常用图表类型的创建和参数配置
- 理解图形样式定制和布局控制
- 掌握多图布局和子图创建
- 学会图表导出和保存

## 📋 前置知识

- Python 基础语法
- Pandas 数据处理基础
- 数据可视化基本概念

## 🔍 详细内容

### 安装配置

Plotly 在使用前需要先进行安装：

```python
# 安装 plotly
pip install plotly
```

### 两种使用方式

Plotly 提供两种主要的使用方式：

1. **Pandas 后端方式**：将 Pandas 的绘图引擎指定为 plotly
2. **plotly.express 方式**：直接使用 plotly.express 模块进行绘图

#### Pandas 后端配置

```python
import pandas as pd

# 以下两个方法其中之一都可以
pd.options.plotting.backend = "plotly"
pd.set_option('plotting.backend', 'plotly')

# 折线图 - 可以直接使用 Pandas 的 .plot() 方法
df.plot()
```

可传入 plotly.express 中各种图形函数的参数，其他图形同样适用。

#### plotly.express 方式

plotly.express 模块（通常作为 px 导入）包含可以一次创建整个图形的函数，称为 plotly express 或 px。Plotly Express 是 Plotly 库的内置部分，是创建最常见图形的推荐起点。

使用 Plotly Express 的优势：
- 每个函数在内部使用图形对象，返回 `plotly.graph_objects.Figure` 实例
- 代码简洁，相比图形对象方式减少 5 到 100 倍的代码量
- 提供统一的 API 接口

```python
import pandas as pd
import plotly.express as px

# 折线图
df.pipe(px.line, 'time', 'data')

# 绘制一个横向条形图，指定大小
df.pipe(px.bar, 'rate', 'label',
        height=1000, width=1300,
        orientation='h')

# 绘制一个饼图，指定大小，环状（中间洞的大小比例）
df.pipe(px.pie, names='label', values='rate',
        height=1000, width=1300, hole=0.5)

# 复合使用
import plotly.graph_objs as go

(
    df.pipe(px.line, 'name', ['Q1', 'Q2'])
    .update_traces(mode='markers', marker_line_width=2, marker_size=10)
    .update_layout(title='Styled Scatter',
                  yaxis_zeroline=False, xaxis_zeroline=False)
    .add_trace(go.Scatter(x=df.name, y=df.Q3))
)
```

### 常用参数配置

#### 全局配置

```python
import plotly.express as px
import plotly.io as pio

# 设置默认模板
pio.templates.default = "simple_white"

# 设置 plotly.express 默认参数
px.defaults.template = "ggplot2"
px.defaults.color_continuous_scale = px.colors.sequential.Blackbody
px.defaults.width = 600
px.defaults.height = 400
```

#### 通用参数

| 参数名 | 类型 | 描述 | 示例 |
|--------|------|------|------|
| title | str | 图表标题 | `title="数据图表"` |
| width | int | 图表宽度 | `width=800` |
| height | int | 图表高度 | `height=600` |
| color | Series/str | 色阶大小指示 | `color=df.Q2` |
| hover_name | Series/str | 鼠标悬停标题 | `hover_name=df.name` |
| hover_data | list | 鼠标悬停显示数据 | `hover_data=[df.Q1, df.team]` |

```python
title=None # 标题
width=None # 宽
height=None # 高
color=df.Q2 # 色阶大小指示
hover_name=df.name # 鼠标悬停标题
hover_data=[df.Q1, df.team] # 鼠标悬停显示数据
```

#### 柱状图专用参数

```python
barmode="group" # 柱状图并列模式
# 连续数据颜色刻度色系取值，需要用 color 参数指定色阶字段
color_continuous_scale=px.colors.sequential.Rainbow
# 指定给予不同纹理用于区分的柱子
pattern_shape='Q2'
text='Q4' # 指定列数据标注在图形上
base='Q2' # bar 从哪个值的位置处开始画柱子
```

#### 饼图专用参数

```python
hole=0.3 # 甜甜圈中间洞的大小比例

# 饼图上显示值（不显示比例），字体大小
fig.update_traces(textinfo='value', textfont_size=10)
# 显示标签和值、比例
fig.update_traces(textinfo='label+value+percent')
# 将扇区从中心拉出
fig.update_traces(pull=[0, 0, 0, 0.2, 0, 0])
```

#### 动画参数

```python
animation_frame='Q1' # 每一动画帧的标记
animation_group='Q2' # 每帧的分组
```

#### 样式模板

```python
# 绘图显示样式
template="plotly_white"

# 可用样式模板（来自 plotly.io.templates）
templates = ['ggplot2', 'seaborn', 'simple_white',
             'plotly', 'plotly_white', 'plotly_dark',
             'presentation', 'xgridoff', 'ygridoff',
             'gridon', 'none']

# y 轴的范围，从 0 到 10
range_y=[0, 10]

# 简单示例，设置轴标签
px.line(x=t, y=np.cos(t), labels={'x':'t', 'y':'cos(t)'})
```

### 图表导出

```python
# 生成网页文件
fig.write_html("page.html")

# 导出图片（需要安装 kaleido: pip install -U kaleido）
# 支持 WebP/SVG/PDF 等格式
# 参考：https://plotly.com/python/static-image-export/
fig.write_image("images/img.png")

# 获取图片字节数据
img_bytes = fig.to_image(format="png")
```

## 💡 实际应用

### 图形样式定制

```python
# 参考：https://plotly.com/python/styling-plotly-express/

# 添加带有箭头的文本标注
fig.add_annotation(text="below target!",
                   x="Oah", y=50, arrowhead=3, showarrow=True)

# 添加一条水平"目标"线
fig.add_shape(
    type="line", line_color="salmon", line_width=3, opacity=1,
    line_dash="dot", x0=0, x1=1, xref="paper", y0=40, y1=60, yref="y"
)

# y轴的单位设置为美元
fig.update_yaxes(
    tickprefix="$", showgrid=True
)

# 自定义字体
fig.update_layout(
    font_family="Rockwell"
)
```

### 多图布局

```python
# 参考：https://plotly.com/python/subplots/
from plotly.subplots import make_subplots
import plotly.graph_objects as go

# 创建 1 行 2 列的子图布局
fig = make_subplots(rows=1, cols=2)

# 添加第一个子图
fig.add_trace(
    go.Scatter(x=[1, 2, 3], y=[4, 5, 6]),
    row=1, col=1
)

# 添加第二个子图
fig.add_trace(
    go.Scatter(x=[20, 30, 40], y=[50, 60, 70]),
    row=1, col=2
)

# 更新布局
fig.update_layout(height=600, width=800, title_text="多图布局示例")
fig.show()
```

### 完整应用示例

```python
import pandas as pd
import plotly.express as px
import numpy as np

# 创建示例数据
np.random.seed(42)
data = {
    'date': pd.date_range('2024-01-01', periods=100),
    'value': np.random.randn(100).cumsum(),
    'category': np.random.choice(['A', 'B', 'C'], 100),
    'size': np.random.randint(10, 100, 100)
}
df = pd.DataFrame(data)

# 创建交互式时间序列图
fig = px.line(df, x='date', y='value', color='category',
              title='交互式时间序列图',
              labels={'value': '数值', 'date': '日期'},
              template='plotly_white')

# 自定义样式
fig.update_traces(line_width=2)
fig.update_layout(
    font_family="Arial",
    title_font_size=20,
    xaxis_title_font_size=14,
    yaxis_title_font_size=14,
    hovermode='x unified'
)

fig.show()
```

## 🔍 功能介绍

### Plotly Express 图表类型

#### 基础图形
- **scatter**: 散点图
- **line**: 线图
- **area**: 面积图
- **bar**: 条形图
- **funnel**: 漏斗图
- **timeline**: 时间线图

#### 整体与部分的表示
- **pie**: 饼图
- **sunburst**: 旭日图
- **treemap**: 树状图
- **icicle**: 冰柱图
- **funnel_area**: 漏斗面积图

#### 一维分布
- **histogram**: 直方图
- **box**: 箱型图
- **violin**: 小提琴图
- **strip**: 条带图
- **ecdf**: 经验累积分布函数图

#### 二维分布
- **density_heatmap**: 密度热图
- **density_contour**: 密度等高线图

#### 矩阵或图像输入
- **imshow**: 图像显示

#### 三维图形
- **scatter_3d**: 三维散点图
- **line_3d**: 三维线图

#### 多维图形
- **scatter_matrix**: 散点矩阵图
- **parallel_coordinates**: 平行坐标图
- **parallel_categories**: 平行类别图

#### 地图图形
- **scatter_mapbox**: Mapbox 散点图
- **line_mapbox**: Mapbox 线图
- **choropleth_mapbox**: Mapbox 分级统计图
- **density_mapbox**: Mapbox 密度图
- **scatter_geo**: 地理散点图
- **line_geo**: 地理线图
- **choropleth**: 分级统计图

#### 极坐标图形
- **scatter_polar**: 极坐标散点图
- **line_polar**: 极坐标线图
- **bar_polar**: 极坐标条形图

#### 三元图表
- **scatter_ternary**: 三元散点图
- **line_ternary**: 三元线图

### 高级功能特性

#### 核心特性
- **单一入口点**: 只需导入 `plotly.express` 即可访问所有绘图功能
- **内置数据集**: `px.data` 提供演示数据集
- **内置色彩**: `px.color` 提供色阶和序列
- **Figure 对象**: 每个函数返回 `plotly.graph_objects.Figure` 对象

#### 智能默认值
- **合理默认**: 自动推断合理的默认值
- **可覆盖**: 所有默认值都可以自定义覆盖

#### 灵活输入格式
- **多种数据源**: 支持列表、字典、Pandas DataFrames、numpy 数组、xarrays、GeoPandas GeoDataFrames

#### 自动配置
- **自动跟踪**: 为不同数据组合自动创建图形轨迹
- **布局配置**: 自动配置子图和布局
- **图例管理**: 智能管理图例显示和分组

#### 标签和悬停
- **自动标签**: 根据输入数据自动标记轴、图例和颜色条
- **标签控制**: 通过 `labels` 参数提供额外控制
- **悬停标签**: 自动填充悬停标签，支持 `hover_name` 和 `hover_data` 参数

#### 样式控制
- **模板系统**: 从默认图形模板读取样式信息
- **分类控制**: 支持 `category_orders` 和 `color_discrete_map` 等参数
- **颜色处理**: 根据输入类型自动切换连续颜色和分类颜色

#### 高级布局
- **分面**: 支持 `facet_row`、`facet_col` 和 `facet_col_wrap` 参数
- **边际图**: 支持 `marginal`、`marginal_x` 和 `marginal_y` 参数
- **Pandas 后端**: 可作为 Pandas 绘图后端使用

#### 交互功能
- **趋势线**: `px.scatter` 支持内置趋势线和模型输出
- **动画**: 通过 `animation_frame` 和 `animation_group` 参数支持动画
- **WebGL 渲染**: 大型散点图自动使用 WebGL 硬件加速

## ⚠️ 注意事项

- **性能考虑**: 大数据集绘图时考虑使用 WebGL 渲染或数据采样
- **内存使用**: 复杂图形可能占用较多内存，注意及时释放不需要的 Figure 对象
- **导出依赖**: 图片导出功能需要安装 `kaleido` 包
- **浏览器兼容**: 某些高级交互功能可能需要现代浏览器支持
- **数据格式**: 确保数据格式正确，特别是时间序列数据的日期格式

## 🔗 相关内容

- [Pandas 数据分析库](../pandas/)
- [NumPy 数值计算库](../numpy/)
- [Matplotlib 绘图库文档](https://matplotlib.org/)
- [Seaborn 统计可视化](https://seaborn.pydata.org/)

## 📚 扩展阅读

- [Plotly Python 官方文档](https://plotly.com/python/)
- [Plotly Express 参考手册](https://plotly.com/python/plotly-express/)
- [图例设置指南](https://plotly.com/python/legend/)
- [标记样式指南](https://plotly.com/python/marker-style/)
- [子图布局指南](https://plotly.com/python/subplots/)
- [样式和模板](https://plotly.com/python/styling-plotly-express/)
- [静态图片导出](https://plotly.com/python/static-image-export/)

## 🏷️ 标签

`可视化` `图表` `交互式` `plotly` `数据分析` `绘图`

---

**最后更新**: 2024-01-15  
**作者**: Python 技术文档工程师  
**版本**: 1.0