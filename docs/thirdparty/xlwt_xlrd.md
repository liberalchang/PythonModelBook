---
layout: post
title: Excel文件处理：xlwt与xlrd完全指南
permalink: /docs/thirdparty/xlwt-xlrd/
category: thirdparty
tags: 
  - xlwt
  - xlrd
  - Excel
  - 数据处理
  - 文件操作
  - 办公自动化
description: 全面掌握xlwt和xlrd库，学会高效处理Excel文件的读写操作
author: 熊猫Jay
date: 2024-01-15
updated: 2024-01-15
version: "1.0"
python_version: "3.6+"
library_version: "xlwt 1.3.0, xlrd 2.0.1"
difficulty: 初级
estimated_time: 90分钟
---

## 概述

xlwt和xlrd是Python中处理Excel文件的经典库组合。xlrd专门用于读取Excel文件，xlwt专门用于写入Excel文件。虽然功能相对基础，但它们在特定场景下仍然非常实用，特别是处理简单的Excel文件读写任务。

**主要特点：**
- xlrd：高效读取Excel文件(.xls和.xlsx格式)
- xlwt：写入Excel文件(仅支持.xls格式)
- 轻量级，性能良好
- 简单易用的API设计
- 与xlutils配合可实现更复杂的Excel操作

**适用场景：**
- 批量处理Excel文件
- 数据导入导出
- 报表自动化生成
- Excel格式转换
- 办公自动化任务

## 学习目标

通过本教程，你将掌握：

- [x] xlrd库的安装和基本概念
- [x] Excel文件读取的各种方法
- [x] 工作簿、工作表、单元格的操作
- [x] xlwt库的Excel文件创建和写入
- [x] Excel样式和格式设置
- [x] xlwt与xlrd的组合应用
- [x] 实际项目中的最佳实践

## 前置条件

- Python 3.6+ 环境
- 了解Python基础语法
- 熟悉Excel基本概念(工作簿、工作表、单元格)
- 了解文件路径操作

## 详细内容

### 1. 环境准备与安装

#### 1.1 安装xlrd和xlwt

```bash
# 安装xlrd (读取Excel)
pip install xlrd

# 安装xlwt (写入Excel)
pip install xlwt

# 安装xlutils (辅助工具，可选)
pip install xlutils
```

#### 1.2 版本兼容性说明

```python
import xlrd
import xlwt

print(f"xlrd版本: {xlrd.__version__}")
print(f"xlwt版本: {xlwt.__version__}")

# 注意：xlrd 2.0+版本默认不支持xlsx格式
# 如需读取xlsx文件，安装旧版本：pip install xlrd==1.2.0
```

### 2. xlrd库详解 - Excel文件读取

#### 2.1 打开工作簿

```python
import xlrd

# 打开Excel文件
workbook = xlrd.open_workbook('data.xlsx')

# 查看所有工作表名称
sheet_names = workbook.sheet_names()
print("所有工作表:", sheet_names)

# 获取工作表数量
sheet_count = workbook.nsheets
print(f"工作表数量: {sheet_count}")
```

#### 2.2 选择工作表的三种方法

```python
# 方法1: 通过索引获取(从0开始)
sheet1 = workbook.sheets()[0]
sheet2 = workbook.sheet_by_index(0)

# 方法2: 通过名称获取
sheet3 = workbook.sheet_by_name('Sheet1')

# 查看工作表信息
print(f"工作表名称: {sheet1.name}")
print(f"行数: {sheet1.nrows}")
print(f"列数: {sheet1.ncols}")
```

#### 2.3 读取单元格数据

```python
# 获取单元格值的三种方法
cell_value1 = sheet1.row(0)[0].value  # 通过行对象
cell_value2 = sheet1.cell(0, 0).value  # 直接指定行列
cell_value3 = sheet1.col(0)[0].value  # 通过列对象

print(f"A1单元格值: {cell_value1}")

# 获取单元格类型
cell_type = sheet1.cell_type(0, 0)
print(f"单元格类型: {cell_type}")
# 类型对照: 0=empty, 1=string, 2=number, 3=date, 4=boolean, 5=error
```

#### 2.4 读取行和列数据

```python
# 读取整行数据
first_row = sheet1.row_values(0)
print("第一行数据:", first_row)

# 读取整列数据
first_col = sheet1.column_values(0)
print("第一列数据:", first_col)

# 读取指定范围的行数据
partial_row = sheet1.row_values(0, start_colx=1, end_colx=3)
print("部分行数据:", partial_row)
```

#### 2.5 遍历所有数据

```python
# 遍历所有行
for row_idx in range(sheet1.nrows):
    row_data = sheet1.row_values(row_idx)
    print(f"第{row_idx+1}行: {row_data}")

# 更高效的遍历方法
all_data = []
for row_idx in range(sheet1.nrows):
    all_data.append(sheet1.row_values(row_idx))
```

### 3. xlwt库详解 - Excel文件写入

#### 3.1 创建工作簿和工作表

```python
import xlwt

# 创建新的工作簿
workbook = xlwt.Workbook(encoding='utf-8')

# 添加工作表
worksheet = workbook.add_sheet('数据表1')

# 允许覆盖写入(可选)
worksheet2 = workbook.add_sheet('数据表2', cell_overwrite_ok=True)
```

#### 3.2 写入基本数据

```python
# 写入不同类型的数据
worksheet.write(0, 0, '姓名')      # 字符串
worksheet.write(0, 1, '年龄')      # 字符串
worksheet.write(0, 2, '分数')      # 字符串

worksheet.write(1, 0, '张三')      # 字符串
worksheet.write(1, 1, 25)         # 数字
worksheet.write(1, 2, 85.5)       # 浮点数

# 批量写入数据
data = [
    ['李四', 28, 92.0],
    ['王五', 23, 78.5],
    ['赵六', 30, 88.0]
]

for row_idx, row_data in enumerate(data, start=2):
    for col_idx, value in enumerate(row_data):
        worksheet.write(row_idx, col_idx, value)
```

#### 3.3 设置单元格样式

```python
# 创建样式对象
style = xlwt.XFStyle()

# 设置字体
font = xlwt.Font()
font.name = 'Times New Roman'
font.bold = True
font.underline = True
font.italic = True
font.colour_index = 2  # 红色
style.font = font

# 设置对齐方式
alignment = xlwt.Alignment()
alignment.horz = xlwt.Alignment.HORZ_CENTER  # 水平居中
alignment.vert = xlwt.Alignment.VERT_CENTER  # 垂直居中
style.alignment = alignment

# 应用样式写入
worksheet.write(0, 0, '标题', style)
```

#### 3.4 高级样式设置

```python
# 设置边框
borders = xlwt.Borders()
borders.left = xlwt.Borders.THIN
borders.right = xlwt.Borders.THIN
borders.top = xlwt.Borders.THIN
borders.bottom = xlwt.Borders.THIN
style.borders = borders

# 设置背景色
pattern = xlwt.Pattern()
pattern.pattern = xlwt.Pattern.SOLID_PATTERN
pattern.pattern_fore_colour = 5  # 黄色
style.pattern = pattern

# 设置数字格式
style.num_format_str = '0.00'  # 保留两位小数

# 应用完整样式
worksheet.write(1, 1, 123.456, style)
```

#### 3.5 设置列宽和行高

```python
# 设置列宽 (单位: 1/256字符宽度)
worksheet.col(0).width = 256 * 20  # 20个字符宽度
worksheet.col(1).width = 256 * 15
worksheet.col(2).width = 256 * 10

# 设置行高 (单位: 1/20磅)
worksheet.row(0).height_mismatch = True
worksheet.row(0).height = 20 * 30  # 30磅高度
```

### 4. 高级功能

#### 4.1 写入公式

```python
# 写入Excel公式
worksheet.write(5, 0, '总计')
worksheet.write(5, 2, xlwt.Formula('SUM(C2:C4)'))  # 求和公式
worksheet.write(6, 2, xlwt.Formula('AVERAGE(C2:C4)'))  # 平均值公式
```

#### 4.2 添加超链接

```python
# 创建超链接样式
hyperlink_style = xlwt.XFStyle()
hyperlink_font = xlwt.Font()
hyperlink_font.underline = True
hyperlink_font.colour_index = 4  # 蓝色
hyperlink_style.font = hyperlink_font

# 写入超链接
worksheet.write(7, 0, xlwt.Formula('HYPERLINK("https://www.python.org","Python官网")'), hyperlink_style)
```

#### 4.3 合并单元格

```python
# 合并单元格(起始行, 结束行, 起始列, 结束列)
worksheet.merge(8, 9, 0, 2)
worksheet.write(8, 0, '合并的单元格')
```

### 5. 组合应用实例

#### 5.1 Excel文件复制和修改

```python
import xlrd
import xlwt
from xlutils.copy import copy

# 读取原文件
rb = xlrd.open_workbook('original.xls', formatting_info=True)
wb = copy(rb)  # 复制工作簿
ws = wb.get_sheet(0)  # 获取第一个工作表

# 修改数据
ws.write(0, 0, '修改后的数据')

# 保存修改后的文件
wb.save('modified.xls')
```

#### 5.2 数据转换和清洗

```python
def excel_data_processing(input_file, output_file):
    """Excel数据处理示例"""
    
    # 读取原始数据
    rb = xlrd.open_workbook(input_file)
    rs = rb.sheet_by_index(0)
    
    # 创建新工作簿
    wb = xlwt.Workbook()
    ws = wb.add_sheet('清洗后数据')
    
    # 写入表头
    headers = ['ID', '姓名', '年龄', '分数', '等级']
    for col, header in enumerate(headers):
        ws.write(0, col, header)
    
    # 处理数据
    for row in range(1, rs.nrows):
        row_data = rs.row_values(row)
        
        # 数据清洗逻辑
        if len(row_data) >= 3:
            name = str(row_data[0]).strip()
            age = int(row_data[1]) if row_data[1] else 0
            score = float(row_data[2]) if row_data[2] else 0.0
            
            # 计算等级
            if score >= 90:
                grade = 'A'
            elif score >= 80:
                grade = 'B'
            elif score >= 70:
                grade = 'C'
            else:
                grade = 'D'
            
            # 写入清洗后的数据
            ws.write(row, 0, row)
            ws.write(row, 1, name)
            ws.write(row, 2, age)
            ws.write(row, 3, score)
            ws.write(row, 4, grade)
    
    # 保存文件
    wb.save(output_file)
    print(f"数据处理完成，保存至: {output_file}")

# 使用示例
# excel_data_processing('input.xls', 'output.xls')
```

## 实际应用

### 应用场景1：批量数据导出

```python
def export_data_to_excel(data_list, filename):
    """将数据列表导出为Excel文件"""
    
    wb = xlwt.Workbook()
    ws = wb.add_sheet('数据导出')
    
    # 设置标题样式
    title_style = xlwt.XFStyle()
    title_font = xlwt.Font()
    title_font.bold = True
    title_style.font = title_font
    
    # 写入数据
    for row_idx, row_data in enumerate(data_list):
        for col_idx, value in enumerate(row_data):
            style = title_style if row_idx == 0 else xlwt.XFStyle()
            ws.write(row_idx, col_idx, value, style)
    
    wb.save(filename)
    return filename

# 使用示例
sample_data = [
    ['产品名称', '价格', '库存'],
    ['笔记本电脑', 5999.00, 50],
    ['台式机', 3999.00, 30],
    ['平板电脑', 2999.00, 80]
]

export_data_to_excel(sample_data, 'products.xls')
```

### 应用场景2：Excel报表生成

```python
def generate_report(sales_data):
    """生成销售报表"""
    
    wb = xlwt.Workbook()
    ws = wb.add_sheet('销售报表')
    
    # 报表标题
    title_style = xlwt.XFStyle()
    title_font = xlwt.Font()
    title_font.bold = True
    title_font.height = 20 * 20  # 字体大小
    title_style.font = title_font
    
    alignment = xlwt.Alignment()
    alignment.horz = xlwt.Alignment.HORZ_CENTER
    title_style.alignment = alignment
    
    ws.merge(0, 0, 0, 4)
    ws.write(0, 0, '月度销售报表', title_style)
    
    # 表头
    headers = ['产品', '销量', '单价', '总额', '占比']
    header_style = xlwt.XFStyle()
    header_font = xlwt.Font()
    header_font.bold = True
    header_style.font = header_font
    
    for col, header in enumerate(headers):
        ws.write(2, col, header, header_style)
    
    # 数据写入
    total_sales = sum(item['quantity'] * item['price'] for item in sales_data)
    
    for row, item in enumerate(sales_data, start=3):
        ws.write(row, 0, item['product'])
        ws.write(row, 1, item['quantity'])
        ws.write(row, 2, item['price'])
        
        total = item['quantity'] * item['price']
        ws.write(row, 3, total)
        
        percentage = (total / total_sales) * 100
        ws.write(row, 4, f"{percentage:.1f}%")
    
    # 总计行
    summary_row = len(sales_data) + 4
    ws.write(summary_row, 0, '总计', header_style)
    ws.write(summary_row, 3, total_sales, header_style)
    
    wb.save('sales_report.xls')

# 使用示例
sales_data = [
    {'product': 'A产品', 'quantity': 100, 'price': 50.0},
    {'product': 'B产品', 'quantity': 80, 'price': 75.0},
    {'product': 'C产品', 'quantity': 120, 'price': 30.0}
]

generate_report(sales_data)
```

### 应用场景3：多工作表数据汇总

```python
def consolidate_excel_files(file_list, output_file):
    """合并多个Excel文件到一个工作簿"""
    
    wb_output = xlwt.Workbook()
    
    for file_idx, filename in enumerate(file_list):
        # 读取源文件
        rb = xlrd.open_workbook(filename)
        rs = rb.sheet_by_index(0)
        
        # 创建新工作表
        ws = wb_output.add_sheet(f'数据表{file_idx+1}')
        
        # 复制数据
        for row in range(rs.nrows):
            row_values = rs.row_values(row)
            for col, value in enumerate(row_values):
                ws.write(row, col, value)
    
    # 创建汇总表
    summary_ws = wb_output.add_sheet('汇总')
    summary_ws.write(0, 0, '文件汇总信息')
    
    for idx, filename in enumerate(file_list):
        summary_ws.write(idx+2, 0, f'文件{idx+1}')
        summary_ws.write(idx+2, 1, filename)
    
    wb_output.save(output_file)
    print(f"文件合并完成: {output_file}")

# 使用示例
files_to_merge = ['data1.xls', 'data2.xls', 'data3.xls']
# consolidate_excel_files(files_to_merge, 'consolidated.xls')
```

## 重要说明

### 版本兼容性

- **xlrd 2.0+**: 默认不支持xlsx格式，如需要可安装旧版本
- **xlwt**: 仅支持xls格式输出，不支持xlsx
- **替代方案**: 对于xlsx格式，建议使用openpyxl或pandas

### 性能考虑

```python
# 大文件处理时的优化建议
def efficient_excel_processing(large_file):
    """高效处理大型Excel文件"""
    
    rb = xlrd.open_workbook(large_file, on_demand=True)  # 按需加载
    
    # 只处理需要的工作表
    sheet_names = rb.sheet_names()
    for sheet_name in sheet_names:
        if sheet_name.startswith('数据'):  # 只处理特定工作表
            ws = rb.sheet_by_name(sheet_name)
            # 处理逻辑...
            rb.unload_sheet(sheet_name)  # 释放内存
```

### 错误处理

```python
def safe_excel_read(filename):
    """安全的Excel读取函数"""
    try:
        rb = xlrd.open_workbook(filename)
        return rb
    except xlrd.XLRDError as e:
        print(f"Excel文件读取错误: {e}")
        return None
    except FileNotFoundError:
        print(f"文件未找到: {filename}")
        return None
    except Exception as e:
        print(f"未知错误: {e}")
        return None
```

## 相关内容

- <mcfile name="pandas.md" path="docs/thirdparty/pandas.md"></mcfile> - 更强大的数据处理库
- <mcfile name="numpy.md" path="docs/thirdparty/numpy.md"></mcfile> - 数值计算基础
- <mcfile name="xlsxwriter.md" path="docs/thirdparty/xlsxwriter.md"></mcfile> - 现代Excel写入库
- <mcfile name="pyautogui.md" path="docs/thirdparty/pyautogui.md"></mcfile> - GUI自动化操作

## 扩展阅读

- [xlrd官方文档](https://xlrd.readthedocs.io/)
- [xlwt官方文档](https://xlwt.readthedocs.io/)
- [xlutils工具包](https://xlutils.readthedocs.io/)
- [Python-Excel教程](https://python-excel.org/)
- [Excel文件格式详解](https://en.wikipedia.org/wiki/Microsoft_Excel_file_format)