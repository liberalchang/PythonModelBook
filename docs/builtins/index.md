---
layout: page
title: 内置函数
permalink: /docs/builtins/
category: builtins
tags: [Python, 内置函数, builtins, 基础]
description: Python 内置函数完整参考文档，包含所有常用内置函数的详细说明和使用示例
author: Python 模型书
date: 2024-01-15
updated: 2024-01-15
version: 2.0
difficulty: "初级"
---

# Python 内置函数完整参考

## 📝 概述

Python 内置函数是解释器自带的函数，无需导入任何模块即可直接使用。这些函数涵盖了数据类型转换、数学运算、序列操作、输入输出、对象检查等各个方面，是 Python 编程的基础工具。

## 🎯 学习目标

完成本模块学习后，你将能够：

- 熟练使用 Python 所有常用内置函数
- 理解不同数据类型的操作方法
- 掌握输入输出的各种方式
- 能够进行高效的数据处理和类型转换
- 编写更简洁优雅的 Python 代码
- 理解函数式编程的基本概念

## 📋 前置知识

- Python 基本语法
- 数据类型（字符串、列表、元组、字典等）
- 基本的编程概念（变量、函数、循环等）

## 🔍 内置函数或方法分类详览

### 🔤 类型转换
- [int() - 整数转换函数](./int/)
- [float() - 浮点数转换函数](./float/)
- [str() - 字符串转换函数](./str/)
- [bool() - 布尔值转换函数](./bool/)
- [list() - 列表构造函数](./list/)
- [tuple() - 元组构造函数](./tuple/)
- [dict() - 字典构造函数](./dict/)
- [set() - 集合构造函数](./set/)
- [frozenset() - 不可变集合构造函数](./frozenset/)
- [complex() - 复数构造函数](./complex/)
- [bytes() - 字节对象构造函数](./bytes/)
- [bytearray() - 可变字节数组构造函数](./bytearray/)

### 🔢 数学运算
- [abs() - 绝对值函数](./abs/)
- [round() - 数字四舍五入函数](./round/)
- [min() - 最小值函数](./min/)
- [max() - 最大值函数](./max/)
- [sum() - 求和函数](./sum/)
- [pow() - 幂运算函数](./pow/)
- [divmod() - 除法和取模运算函数](./divmod/)
- [round() - 数字四舍五入函数](./round/)

### 📊 序列操作
- [len() - 长度函数](./len/)
- [sorted() - 排序函数](./sorted/)
- [reversed() - 反转函数](./reversed/)
- [range() - 范围函数](./range/)
- [slice() - 切片对象创建函数](./slice/)

### 🔄 迭代工具
- [enumerate() - 枚举函数](./enumerate/)
- [zip() - 打包函数](./zip/)
- [map() - 映射函数](./map/)
- [filter() - 过滤函数](./filter/)
- [iter() - 迭代器创建函数](./iter/)
- [next() - 迭代器元素获取函数](./next/)

### 🧠 逻辑判断
- [any() - 逻辑或函数](./any/)
- [all() - 逻辑与函数](./all/)

### 🔍 对象检查
- [type() - 类型函数](./type/)
- [isinstance() - 实例检查函数](./isinstance/)
- [issubclass() - 子类检查函数](./issubclass/)
- [hasattr() - 属性检查函数](./hasattr/)

### 📥📤 输入输出
- [print() - 输出函数](./print/)
- [input() - 输入函数](./input/)
- [open() - 文件操作函数](./open/)

### 🔧 高级功能
- [eval() - 表达式求值函数](./eval/)
- [exec() - 代码执行函数](./exec/)
- [compile() - 代码编译函数](./compile/)
- [globals() - 全局命名空间函数](./globals/)
- [locals() - 局部命名空间函数](./locals/)
- [vars() - 对象属性字典获取函数](./vars/)
- [memoryview() - 内存视图对象构造函数](./memoryview/)
- [help() - 帮助系统函数](./help/)
- [format() - 格式化函数](./format/)
- [f-string - 格式化字符串字面量](./f-string/)
- [repr() - 对象字符串表示函数](./repr/)
- [ascii() - ASCII 字符串表示函数](./ascii/)

### 🔢 进制转换
- [bin() - 二进制转换函数](./bin/)
- [oct() - 八进制转换函数](./oct/)
- [hex() - 十六进制转换函数](./hex/)
- [ord() - Unicode 码点获取函数](./ord/)
- [chr() - Unicode 字符生成函数](./chr/)



## ⚠️ 注意事项

### 性能考虑
- **内置函数优先**：内置函数通常比自定义函数更高效，因为它们是用 C 语言实现的
- **避免重复转换**：不要在循环中重复进行类型转换
- **合理使用生成器**：对于大数据集，考虑使用生成器表达式而不是列表推导式

### 常见错误
- **类型错误**：确保传递给函数的参数类型正确
- **空序列处理**：使用 min()、max()等函数时要注意空序列会引发异常
- **浮点数精度**：使用 round()函数时要注意浮点数精度问题

### 最佳实践
1. **函数组合**：学会将多个内置函数组合使用以实现复杂功能
2. **错误处理**：在使用可能引发异常的函数时添加适当的错误处理
3. **代码可读性**：虽然内置函数很强大，但要保持代码的可读性
4. **文档查阅**：遇到问题时查阅官方文档获取准确信息

## 📊 函数使用频率统计

| 使用频率 | 函数列表 | 应用场景 |
|----------|----------|----------|
| 极高频 | print(), len(), type(), str(), int() | 日常编程必备 |
| 高频 | list(), dict(), range(), enumerate(), zip() | 数据结构操作 |
| 中频 | map(), filter(), sorted(), any(), all() | 数据处理和验证 |
| 低频 | eval(), exec(), compile(), globals(), locals() | 高级编程和元编程 |



## 相关模块
- [Python 基础语法](../basics/) - Python 编程基础
- [Python 标准库](../stdlib/) - 标准库函数和模块
- [第三方库](../thirdparty/) - 常用第三方库

## 📚 扩展阅读

- [Python 内置函数官方文档](https://docs.python.org/3/library/functions.html)
- [Python 数据模型官方文档](https://docs.python.org/3/reference/datamodel.html)
- [Python 标准库概览](https://docs.python.org/3/library/index.html)
- [Python 函数式编程指南](https://docs.python.org/3/howto/functional.html)
- [Python 性能优化技巧](https://wiki.python.org/moin/PythonSpeed/PerformanceTips)

## 🏷️ 标签

`Python` `内置函数` `builtins` `基础编程` `数据处理` `类型转换` `函数式编程`

---

**最后更新**: 2024-01-15  
**作者**: Python 模型书  
**版本**: 2.0