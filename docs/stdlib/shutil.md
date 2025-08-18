---
layout: doc
title: shutil 模块 - 高级文件操作
permalink: /docs/stdlib/shutil/
category: stdlib
tags: [shutil, 文件操作, 复制, 移动, 压缩, 解压]
description: Python shutil 模块提供了高级的文件复制、移动、删除以及压缩/解压功能
author: Python 文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# shutil 模块 - 高级文件操作

## 📝 概述

shutil 模块是对 os 模块在文件操作方面的补充，提供了一系列高级的文件和目录操作，包括复制、移动、删除、压缩和解压。

## 🎯 学习目标

- 掌握文件和目录的复制与移动
- 学会递归复制目录树
- 理解压缩与解压 API 的用法
- 掌握常见错误处理与边界情况

## 📋 前置知识

- Python 文件系统基础
- os 模块基础
- 异常处理

## 🔍 详细内容

### 文件复制

```python
import shutil

# 复制文件到目标目录（若存在同名文件，将覆盖）
shutil.copy('source.txt', 'dest_dir/')

# 复制文件到新文件路径
shutil.copy('source.txt', 'dest_dir/new_name.txt')

# 复制文件并保留元数据（权限、时间戳等）
shutil.copy2('source.txt', 'dest_dir/')
```

### 目录复制

```python
import shutil

# 复制整个目录树到新目录（目标目录必须不存在）
shutil.copytree('src_dir', 'dst_dir')

# 若目标目录存在，使用 dirs_exist_ok=True（Python 3.8+）
shutil.copytree('src_dir', 'dst_dir', dirs_exist_ok=True)
```

### 文件与目录移动/重命名

```python
import shutil

# 移动文件到另一个目录
shutil.move('file.txt', 'backup_dir/')

# 重命名文件（也可用于跨目录移动）
shutil.move('old_name.txt', 'new_name.txt')
```

### 删除目录

```python
import shutil

# 删除目录（包括非空目录）
shutil.rmtree('dir_to_delete')
```

### 生成压缩包

```python
import shutil

# 创建压缩包（zip/tar/bztar/gztar/xztar）
# 例如：创建 zip 压缩包，打包 root_dir 目录
shutil.make_archive('archive_name', 'zip', root_dir='path/to/dir')

# base_name: 目标文件名（不含扩展名）
# format: 'zip', 'tar', 'bztar', 'gztar', 'xztar'
# root_dir: 需要打包的根目录
# base_dir: 可选，指定在 root_dir 下的子目录作为打包起始目录
```

### 解压压缩包

```python
import shutil

# 解压文件到指定目录
shutil.unpack_archive('archive.zip', extract_dir='output_dir')

# 自动根据扩展名判断格式，也可显式指定 format
# 支持 'zip', 'tar', 'bztar', 'gztar', 'xztar'
```

## 💡 实际应用

### 备份与归档脚本示例

```python
import shutil
from pathlib import Path

def backup_directory(src: Path, dst_zip_base: Path):
    """备份目录到 zip 压缩包"""
    if not src.exists() or not src.is_dir():
        raise ValueError(f"源目录不存在: {src}")
    
    # 创建父目录
    dst_zip_base.parent.mkdir(parents=True, exist_ok=True)
    
    # 生成压缩包
    archive_path = shutil.make_archive(str(dst_zip_base), 'zip', root_dir=str(src))
    print(f"已创建压缩包: {archive_path}")

# 使用示例
backup_directory(Path('project'), Path('backup/project_backup'))
```

### 安全移动：处理重名与覆盖

```python
import shutil
from pathlib import Path

def safe_move(src: Path, dst: Path):
    """安全移动文件或目录：若目标存在则改名"""
    if not src.exists():
        raise FileNotFoundError(src)
    
    target = dst
    if target.exists():
        # 若目标已存在，追加后缀避免覆盖
        i = 1
        while True:
            candidate = target.with_name(f"{target.stem}_{i}{target.suffix}")
            if not candidate.exists():
                target = candidate
                break
            i += 1
    
    moved = shutil.move(str(src), str(target))
    print(f"已移动到: {moved}")

# 使用示例
# safe_move(Path('file.txt'), Path('dest/file.txt'))
```

## ⚠️ 注意事项

- copytree 在 Python 3.8 之前不支持目标目录存在；需要自行处理或升级版本
- move 在目标存在时会抛出异常，需提前判断处理
- rmtree 操作不可恢复，务必确认路径
- make_archive 的 base_name 不包含扩展名，输出路径与权限需确认

## 🔗 相关内容

- [os 模块 - 操作系统接口](../os/)
- [pathlib 模块 - 面向对象的路径处理](../pathlib/)
- [open() 函数 - 文件打开操作](../../builtins/open/)

## 📚 扩展阅读

- [Python 官方文档 - shutil](https://docs.python.org/3/library/shutil.html)

## 🏷️ 标签

`shutil` `文件操作` `复制` `移动` `压缩` `解压`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档团队  
**版本**: 1.0