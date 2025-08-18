---
title: "XlsxWriter - 强大的Excel文件写入库"
author: "Python技术文档工程师"
date: "2024-01-15"
updated: "2024-01-15"
version: "1.0"
python_version: "3.6+"
library_version: "xlsxwriter>=3.0.0"
tags: ["xlsxwriter", "Excel", "数据导出", "第三方库", "数据处理"]
difficulty: "初级"
estimated_time: "45分钟"
permalink: /docs/thirdparty/xlsxwriter/
category: thirdparty
description: "XlsxWriter是Python中功能强大的Excel文件创建库，支持丰富的格式化、图表和公式功能"
---

# XlsxWriter - 强大的Excel文件写入库

## 📝 概述

XlsxWriter是一个Python模块，专门用于创建Excel XLSX文件。它可以将文本、数字、公式和超链接写入多个工作表，支持丰富的格式化功能、图表创建、图片插入等高级特性。相比其他Excel处理库，XlsxWriter在写入功能方面表现卓越。

## 🎯 学习目标

通过本文档的学习，你将掌握：

- XlsxWriter的安装和基本使用方法
- Excel文件的创建和工作表操作
- 不同数据类型的写入技巧
- 格式化和样式设置
- 复杂数据结构的Excel导出
- 数据库数据导出到Excel
- 与其他Excel库的对比和选择

## 📋 前置知识

- Python基础语法
- 基本的Excel操作概念
- 数据结构（列表、字典）理解
- 数据库基础知识（可选）

## 🔍 详细内容

### 1. XlsxWriter模块介绍

XlsxWriter是专门用于创建Excel 2007+ XLSX文件的Python库，具有以下特点：

#### 1.1 优势特性

- **高保真度**：生成的文件与Excel原生文件几乎完全一致
- **丰富功能**：支持Excel的大部分高级特性
- **高性能**：快速处理，支持大文件生成
- **内存优化**：可配置为使用较少内存
- **文档完善**：拥有大量示例和测试用例

#### 1.2 与其他库对比

```python
# 三大Excel处理库对比
"""
openpyxl：读写.xlsx格式，功能全面，支持增删改查
xlwings：支持.xlsx和.xls，功能强大，支持与Excel应用交互
xlsxwriter：仅支持写入.xlsx，写入功能最强大
"""
```

### 2. 安装和基本使用

#### 2.1 安装

```bash
# 使用pip安装
pip install XlsxWriter

# 验证安装
python -c "import xlsxwriter; print('安装成功')"
```

#### 2.2 简单示例

```python
import xlsxwriter

# 创建工作簿和工作表
workbook = xlsxwriter.Workbook('hello.xlsx')
worksheet = workbook.add_worksheet()

# 写入数据
worksheet.write('A1', 'Hello world')

# 关闭工作簿
workbook.close()
```

### 3. 核心类和方法

#### 3.1 Workbook类

```python
import xlsxwriter

# 创建工作簿
workbook = xlsxwriter.Workbook('example.xlsx')

# 添加工作表
worksheet = workbook.add_worksheet()          # 默认名称
worksheet2 = workbook.add_worksheet('数据表')  # 自定义名称

# 添加格式
format1 = workbook.add_format({'bold': True})

# 关闭工作簿（必须调用）
workbook.close()
```

#### 3.2 Worksheet类主要方法

```python
# 写入方法
worksheet.write(row, col, data)           # 通用写入
worksheet.write_string(row, col, string)  # 字符串
worksheet.write_number(row, col, number)  # 数字
worksheet.write_formula(row, col, formula) # 公式
worksheet.write_datetime(row, col, date)  # 日期时间
worksheet.write_url(row, col, url)        # 链接

# 格式设置
worksheet.set_column(first_col, last_col, width)  # 列宽
worksheet.set_row(row, height)                    # 行高
worksheet.merge_range(range, data, format)       # 合并单元格
```

## 💡 实际应用

### 1. 创建简单Excel文件

```python
import xlsxwriter

# 创建工作簿
workbook = xlsxwriter.Workbook('expenses.xlsx')
worksheet = workbook.add_worksheet()

# 数据准备
expenses = (
    ['Rent', 1000],
    ['Gas', 100],
    ['Food', 300],
    ['Gym', 50],
)

# 写入数据
row = 0
col = 0

for item, cost in expenses:
    worksheet.write(row, col, item)
    worksheet.write(row, col + 1, cost)
    row += 1

# 添加汇总公式
worksheet.write(row, 0, 'Total')
worksheet.write(row, 1, '=SUM(B1:B4)')

workbook.close()
```

### 2. 带格式的Excel文件

```python
import xlsxwriter

workbook = xlsxwriter.Workbook('formatted_expenses.xlsx')
worksheet = workbook.add_worksheet()

# 创建格式
bold = workbook.add_format({'bold': True})
money = workbook.add_format({'num_format': '$#,##0'})

# 写入表头
worksheet.write('A1', 'Item', bold)
worksheet.write('B1', 'Cost', bold)

# 数据
expenses = (
    ['Rent', 1000],
    ['Gas', 100],
    ['Food', 300],
    ['Gym', 50],
)

# 写入数据和格式
row = 1
for item, cost in expenses:
    worksheet.write(row, 0, item)
    worksheet.write(row, 1, cost, money)
    row += 1

# 汇总行
worksheet.write(row, 0, 'Total', bold)
worksheet.write(row, 1, '=SUM(B2:B5)', money)

workbook.close()
```

### 3. 多数据类型写入

```python
from datetime import datetime
import xlsxwriter

workbook = xlsxwriter.Workbook('data_types.xlsx')
worksheet = workbook.add_worksheet()

# 格式定义
bold = workbook.add_format({'bold': True})
money_format = workbook.add_format({'num_format': '$#,##0'})
date_format = workbook.add_format({'num_format': 'yyyy-mm-dd'})

# 设置列宽
worksheet.set_column(1, 1, 15)

# 表头
worksheet.write('A1', 'Item', bold)
worksheet.write('B1', 'Date', bold)
worksheet.write('C1', 'Cost', bold)

# 数据
expenses = (
    ['Rent', '2023-01-13', 1000],
    ['Gas', '2023-01-14', 100],
    ['Food', '2023-01-16', 300],
    ['Gym', '2023-01-20', 50],
)

# 写入不同类型数据
row = 1
for item, date_str, cost in expenses:
    date = datetime.strptime(date_str, "%Y-%m-%d")
    
    worksheet.write_string(row, 0, item)
    worksheet.write_datetime(row, 1, date, date_format)
    worksheet.write_number(row, 2, cost, money_format)
    row += 1

# 汇总
worksheet.write(row, 0, 'Total', bold)
worksheet.write(row, 2, '=SUM(C2:C5)', money_format)

workbook.close()
```

### 4. 复杂数据结构导出

根据原文档中的复杂JSON结构示例：

```python
import json
import os
import xlsxwriter

def write_complex_data_to_excel():
    """将复杂嵌套数据结构写入Excel"""
    
    # 构建复杂数据结构
    data = {
        "name1": [
            {
                "title": "title-1-1",
                "comments": [
                    {"content": "comments-name-1-1", "created_at": "2020-04-13 12:17:10"},
                    {"content": "comments-name-1-2", "created_at": "2020-04-13 12:17:10"}
                ]
            },
            {
                "title": "title-1-2",
                "comments": [
                    {"content": "comments-name-1-2", "created_at": "2020-04-13 12:17:10"},
                    {"content": "comments-name-1-3", "created_at": "2020-04-13 12:17:10"}
                ]
            }
        ],
        "name2": [
            {
                "title": "title-2-1",
                "comments": [
                    {"content": "comments-name-2-1", "created_at": "2020-04-13 12:17:10"},
                    {"content": "comments-name-2-2", "created_at": "2020-04-13 12:17:10"},
                    {"content": "comments-name-2-3", "created_at": "2020-04-13 12:17:10"}
                ]
            }
        ],
        "name3": [
            {
                "title": "title-3-1",
                "comments": [
                    {"content": "comments-name-3-1", "created_at": "2020-04-13 12:17:10"}
                ]
            }
        ]
    }
    
    filename = 'complex_data.xlsx'
    
    # 删除已存在的文件
    if os.path.isfile(filename):
        os.remove(filename)
    
    # 写入Excel
    write_to_excel(filename, data)

def write_to_excel(output, data):
    """写入Excel的核心逻辑"""
    
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet('History and Comment')
    
    # 定义样式
    header = workbook.add_format({
        'bg_color': '#F7F7F7',
        'color': 'black',
        'align': 'center',
        'valign': 'top',
        'border': 1
    })
    
    merge_format = workbook.add_format({
        'bold': True,
        'border': 6,
        'align': 'center',
        'valign': 'vcenter',
        'fg_color': '#D7E4BC',
    })
    
    bold_cell = workbook.add_format({
        'bold': True,
        'align': 'left',
        'valign': 'top',
        'text_wrap': True,
        'border': 1
    })
    
    cell = workbook.add_format({
        'align': 'left',
        'valign': 'top',
        'text_wrap': True,
        'border': 1
    })
    
    # 写入表头
    headers = ['Name', 'Title', 'Created At', 'Content']
    for i, header_text in enumerate(headers):
        worksheet.write(0, i, header_text, header)
    
    # 设置列宽
    col_widths = [50, 50, 50, 50]
    for i, width in enumerate(col_widths):
        worksheet.set_column(i, i, width)
    
    # 写入数据
    data_row = 1
    data_row_2 = 1
    data_row_1 = 1
    
    for name in data.keys():
        # 写入评论数据（第3、4列）
        for history in data[name]:
            for comment in history['comments']:
                worksheet.write_string(data_row, 2, comment['created_at'], bold_cell)
                worksheet.write_string(data_row, 3, comment['content'], cell)
                data_row += 1
            
            # 写入标题（第2列）
            comments_len = len(history['comments'])
            if comments_len == 1:
                worksheet.write_string(data_row_2, 1, history['title'], bold_cell)
                data_row_2 += 1
            else:
                # 合并单元格
                range_str = f'B{data_row_2+1}:B{data_row_2+comments_len}'
                worksheet.merge_range(range_str, history['title'], merge_format)
                data_row_2 += comments_len
        
        # 写入姓名（第1列）
        if data_row_2 - data_row_1 == 1:
            worksheet.write_string(data_row_1, 0, name, bold_cell)
        else:
            range_str = f'A{data_row_1+1}:A{data_row_2}'
            worksheet.merge_range(range_str, name, merge_format)
        data_row_1 = data_row_2
    
    workbook.close()

# 使用示例
if __name__ == '__main__':
    write_complex_data_to_excel()
```

### 5. 数据库数据导出

```python
import xlsxwriter
# 注意：这里使用通用的数据库示例，实际使用时替换为具体的数据库库
# import pymysql  # MySQL示例

def export_database_to_excel():
    """将数据库查询结果导出到Excel"""
    
    # 模拟数据库查询结果
    # 实际使用时，这里应该是真实的数据库查询
    headers = ["empno", "ename", "mgr", "hiredate"]
    rows = [
        ('7369', 'SMITH', '7902', '1980-12-17'),
        ('7499', 'ALLEN', '7698', '1981-02-20'),
        ('7521', 'WARD', '7698', '1981-02-22'),
        ('7566', 'JONES', '7839', '1981-04-02'),
    ]
    
    # 创建Excel文件
    workbook = xlsxwriter.Workbook('employee_data.xlsx')
    worksheet = workbook.add_worksheet()
    
    # 创建格式
    bold = workbook.add_format({'bold': True})
    
    # 写入表头
    for col, header in enumerate(headers):
        worksheet.write(0, col, header, bold)
    
    # 写入数据
    for row_idx, row_data in enumerate(rows, start=1):
        for col_idx, cell_data in enumerate(row_data):
            worksheet.write(row_idx, col_idx, str(cell_data))
    
    workbook.close()

# 使用示例
export_database_to_excel()
```

### 6. 高级格式化和样式

```python
import xlsxwriter

def create_styled_excel():
    """创建具有丰富样式的Excel文件"""
    
    workbook = xlsxwriter.Workbook('styled_report.xlsx')
    worksheet = workbook.add_worksheet('Sales Report')
    
    # 定义多种格式
    title_format = workbook.add_format({
        'bold': True,
        'font_size': 16,
        'align': 'center',
        'valign': 'vcenter',
        'bg_color': '#4F81BD',
        'font_color': 'white'
    })
    
    header_format = workbook.add_format({
        'bold': True,
        'font_size': 12,
        'align': 'center',
        'valign': 'vcenter',
        'bg_color': '#B8CCE4',
        'border': 1
    })
    
    currency_format = workbook.add_format({
        'num_format': '$#,##0.00',
        'align': 'right',
        'border': 1
    })
    
    percent_format = workbook.add_format({
        'num_format': '0.0%',
        'align': 'right',
        'border': 1
    })
    
    # 设置列宽
    worksheet.set_column('A:A', 20)
    worksheet.set_column('B:D', 15)
    worksheet.set_row(0, 30)  # 标题行高度
    
    # 写入标题
    worksheet.merge_range('A1:D1', '2023年销售报表', title_format)
    
    # 写入表头
    headers = ['产品名称', '销售额', '成本', '利润率']
    for col, header in enumerate(headers):
        worksheet.write(2, col, header, header_format)
    
    # 销售数据
    sales_data = [
        ['产品A', 50000, 30000, 0.4],
        ['产品B', 75000, 45000, 0.4],
        ['产品C', 60000, 40000, 0.33],
        ['产品D', 85000, 50000, 0.41]
    ]
    
    # 写入数据
    for row, (product, sales, cost, margin) in enumerate(sales_data, start=3):
        worksheet.write(row, 0, product)
        worksheet.write(row, 1, sales, currency_format)
        worksheet.write(row, 2, cost, currency_format)
        worksheet.write(row, 3, margin, percent_format)
    
    workbook.close()

create_styled_excel()
```

## ⚠️ 注意事项

1. **文件关闭**：必须调用 `workbook.close()` 才能保存文件
2. **内存管理**：处理大文件时考虑使用 `options={'constant_memory': True}`
3. **格式对象**：format对象可以重复使用，提高效率
4. **行列索引**：从0开始，支持 `'A1'` 样式的单元格引用
5. **数据类型**：自动检测数据类型，也可使用专门的写入方法
6. **性能优化**：批量操作比逐个写入更高效

## 🔗 相关内容

- [openpyxl 模块 - Excel读写操作](../openpyxl/)
- [pandas 模块 - 数据分析与导出](../pandas/)
- [csv 模块 - CSV文件处理](../../stdlib/csv/)
- [json 模块 - JSON数据处理](../../stdlib/json/)

## 📚 扩展阅读

- [XlsxWriter官方文档](https://xlsxwriter.readthedocs.io/)
- [Excel文件格式规范](https://docs.microsoft.com/en-us/openspecs/office_file_formats/ms-xlsx/)
- [Python数据导出最佳实践](https://realpython.com/python-excel/)

## 🏷️ 标签

`xlsxwriter` `Excel` `数据导出` `第三方库` `数据处理`

---

**最后更新**: 2024-01-15  
**作者**: Python技术文档工程师  
**版本**: 1.0