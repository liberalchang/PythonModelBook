---
layout: doc
title: 文件通配符搜索 - glob模块
permalink: /docs/stdlib/glob/
category: stdlib
tags: [glob, 文件通配符, 文件搜索, 模式匹配, 文件系统]
description: Python glob模块详解，使用Unix shell风格的通配符进行文件和目录的匹配搜索
author: Python文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "入门"
---

# 文件通配符搜索 - glob模块

## 📝 概述

glob模块使用Unix shell风格的通配符来匹配符合特定格式的文件和目录。它内部基于`os.listdir()`和`fnmatch.fnmatch()`实现，常用来批量查找文件。

## 🎯 学习目标

- 了解glob模块的核心函数
- 掌握**通配符**语义及递归搜索
- 学会处理点文件和路径格式
- 理解性能注意事项

## 📋 前置知识

- 文件系统与路径知识
- 通配符匹配基础

## 🔍 详细内容

### 核心函数

glob模块共包含以下3个函数：

#### 1. glob.glob(pathname, recursive=False)

- 参数：
  - pathname: 需要匹配的字符串（建议使用原始字符串r""）
  - recursive: 是否递归匹配，配合 ** 通配符使用
- 功能：
  - 返回匹配的路径列表
  - Windows路径中的 "\" 会被自动转义为 "\\"
  - Python 3.5+ 支持 ** 通配符递归匹配，需要设置 `recursive=True`

#### 2. glob.iglob(pathname, recursive=False)

- 与 `glob()` 参数一致
- 返回一个迭代器，不会一次性载入所有匹配结果

#### 3. glob.escape(pathname)

- Python 3.4+ 提供
- 作用：转义所有通配符，按字面量处理
- 用途：测试某文件是否存在时避免通配符生效

### 通配符支持

| 通配符 | 功能 |
|--------|------|
| * | 匹配0或多个字符 |
| ** | 递归匹配所有文件与目录（3.5+） |
| ? | 匹配1个字符 |
| [exp] | 匹配指定范围内的字符，如：[1-9] |
| [!exp] | 匹配不在指定范围内的字符 |

### 使用示例

```python
import glob

# 基本使用
print(glob.glob(r"E:/Picture/*.jpg"))  # 绝对路径
print(glob.glob(r'../*.py'))            # 相对路径

# 递归匹配
for path in glob.iglob('src/**/*.py', recursive=True):
    print(path)

# 处理点文件
# glob默认不匹配以点符号（.）开始的文件
# 假如当前文件夹包含test.txt和.test.txt两个文件
print(glob.glob('*.txt'))   # ['test.txt']
print(glob.glob('.*.txt'))  # ['.test.txt']
```

## 💡 实际应用

```python
import glob

def backup_files(pattern, backup_dir):
    """备份匹配模式的文件"""
    files = glob.glob(pattern)
    for file in files:
        # 执行备份操作
        print(f"备份文件: {file}")

def find_all_images(directory):
    """查找目录中的所有图片文件"""
    image_patterns = ['*.jpg', '*.png', '*.gif', '*.bmp']
    all_images = []
    for pattern in image_patterns:
        all_images.extend(glob.glob(f"{directory}/{pattern}"))
    return all_images
```

## ⚠️ 注意事项

- **点文件**：默认不匹配以点开头的文件
- **递归搜索**：使用 ** 通配符时注意性能影响
- **路径格式**：建议使用原始字符串避免转义问题
- **版本差异**：不同Python版本支持的功能略有不同

## 🔗 相关内容

- [文件名匹配 - fnmatch](../fnmatch/)
- [正则表达式 - re](../re/)
- [os模块 - 操作系统接口](../os/)
- [pathlib模块 - 路径处理](../pathlib/)

## 📚 扩展阅读

- [glob模块官方文档](https://docs.python.org/3/library/glob.html)

## 🏷️ 标签

`glob` `文件通配符` `文件搜索` `递归匹配` `批处理`

---

**最后更新**: 2024-01-15  
**作者**: Python文档团队  
**版本**: 1.0