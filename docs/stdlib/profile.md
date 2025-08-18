---
layout: doc
title: cProfile 与 profile - Python性能分析工具
permalink: /docs/stdlib/profile/
category: stdlib
tags: [性能分析, 调试, 优化, 标准库, cProfile, profile, pstats]
description: cProfile 和 profile 是 Python 标准库中的性能分析器，提供函数级别的调用统计和耗时分析，可结合 pstats 进行结果筛选与可视化
author: Python 文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# cProfile 与 profile - Python性能分析工具

## 📝 概述

cProfile 和 profile 是 Python 标准库提供的性能分析工具（profiler）。profile 是纯 Python 实现，cProfile 是基于 C 的高性能实现，推荐优先使用 cProfile。二者输出格式兼容，可通过 pstats 模块进行统计结果的加载、过滤和排序。

## 🎯 学习目标

- 了解 profile/cProfile 的工作原理和差异
- 掌握命令行和代码内两种使用方式
- 学会读取、筛选、排序分析结果
- 掌握 pstats 的常见操作
- 与 line_profiler、memory_profiler 进行互补分析

## 📋 前置知识

- Python 函数与模块基础
- 命令行基础
- 了解性能优化的基本概念

## 🔍 详细内容

### 选择哪个分析器？

- 优先使用 cProfile（更快、开销更低）
- profile 主要用于需要自定义或调试 profiler 自身的场景
- 输出可通过 pstats 统一处理

### 安装与可用性

cProfile/profile/pstats 属于标准库，随 Python 一起提供，无需安装。

## 💡 实际应用

### 1. 命令行使用

```bash
# 直接分析一个脚本（输出到控制台）
python -m cProfile your_script.py

# 保存统计结果到文件（便于后续用 pstats 分析）
python -m cProfile -o stats.prof your_script.py

# 指定排序方式（按总耗时排序）
python -m cProfile -s tottime your_script.py
```

常见排序键：ncalls, tottime, percall, cumtime, filename, function, line

### 2. 代码内使用

```python
import cProfile
import pstats
from pstats import SortKey

# 被分析的函数

def heavy_computation(n: int) -> int:
    """计算密集型函数"""
    total = 0
    for i in range(n):
        total += sum(j*j for j in range(1000))
    return total

# 运行并保存结果
if __name__ == '__main__':
    profiler = cProfile.Profile()
    profiler.enable()  # 开始分析
    result = heavy_computation(200)
    profiler.disable()  # 停止分析

    # 打印到控制台（按累计耗时排序）
    stats = pstats.Stats(profiler).strip_dirs()
    stats.sort_stats(SortKey.CUMULATIVE).print_stats(20)

    # 保存到文件，便于后续深入分析
    stats.dump_stats('stats.prof')
```

### 3. 使用 pstats 进行深入分析

```python
import pstats
from pstats import SortKey

# 从文件加载统计结果
stats = pstats.Stats('stats.prof')

# 常见操作
stats.strip_dirs()  # 去掉路径前缀，输出更简洁
stats.sort_stats(SortKey.TIME)  # 按函数自身耗时排序（tottime）
stats.print_stats(30)  # 打印前30条

# 按模块/函数名过滤
stats.print_stats('your_module')
stats.print_stats('heavy_computation')

# 查看调用关系（调用者/被调用者）
stats.print_callers(20)
stats.print_callees(20)
```

### 4. 与第三方工具协作

- 与 line_profiler 互补：cProfile 定位到“函数级热点”，再用 line_profiler 精细到“代码行级”
- 与 memory_profiler 搭配：同时掌握时间与内存两个维度

示例：函数级筛选热点后做逐行分析

```python
import cProfile, pstats
from pstats import SortKey
from line_profiler import LineProfiler

# 假设有多个函数

def f1():
    data = [i for i in range(100000)]  # 构造数据
    return sum(data)

def f2():
    return sum(i*i for i in range(20000))

def main():
    f1(); f2()

# 第一步：使用 cProfile 找热点
prof = cProfile.Profile()
prof.runcall(main)
stats = pstats.Stats(prof).sort_stats(SortKey.TIME)
stats.print_stats(10)

# 第二步：对热点函数进行逐行分析
lp = LineProfiler()
lp.add_function(f1)
wrapped = lp(main)
wrapped()
lp.print_stats()
```

### 5. 输出字段含义速查

cProfile 输出的主要字段：
- ncalls: 调用次数（含递归/原始次数）
- tottime: 在函数自身消耗的总时间（不含子调用）
- percall: 每次调用的平均时间（tottime/ncalls 或 cumtime/primitive calls）
- cumtime: 函数累计耗时（包含所有子函数调用）
- filename:py:lineno(function): 函数定位信息

### 6. 常见用法模式

#### 6.1 快速定位性能瓶颈

```bash
python -m cProfile -s tottime your_script.py | head -n 40
```

#### 6.2 只分析特定代码段

```python
import cProfile

prof = cProfile.Profile()
prof.enable()
# 需要分析的代码段
...
prof.disable()
prof.print_stats()
```

#### 6.3 与 unittest/pytest 集成（示例）

```python
# 在测试套件中包裹运行（示例）
import cProfile, pstats
from your_project.tests import run_all_tests

prof = cProfile.Profile()
prof.runcall(run_all_tests)
pstats.Stats(prof).sort_stats('cumtime').print_stats(50)
```

## ⚠️ 注意事项与最佳实践

- 分析时尽量固定输入与环境，避免噪声影响
- 使用 -o 导出结果，以便复现与分享
- 按 tottime 与 cumtime 综合判断热点位置
- 对 I/O 密集场景，结合时间戳日志与采样分析工具（如 py-spy）
- 对多线程程序，可考虑使用 setprofile 钩子或采样分析器

## 🔗 相关内容

- [line_profiler - 逐行时间分析](/docs/thirdparty/line-profiler/)
- [memory_profiler - 逐行内存分析](/docs/thirdparty/memory-profiler/)
- [Python 标准库](/docs/stdlib/)

## 📚 参考资源

- Python 官方文档：profile/cProfile/pstats
- pstats 模块 API 参考
- 实战文章与最佳实践