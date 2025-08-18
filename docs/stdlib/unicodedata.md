---
layout: doc
title: unicodedata 模块 - Unicode字符数据库处理
permalink: /docs/stdlib/unicodedata/
category: stdlib
tags: [Unicode, 字符处理, 文本处理, 字符编码, 国际化, 字符分类]
description: Python unicodedata模块详解，提供Unicode字符数据库访问功能，支持字符属性查询、字符分类、文本规范化等操作
author: Python文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# unicodedata 模块 - Unicode字符数据库处理

## 📝 概述

unicodedata模块提供了对Unicode字符数据库（UCD）的访问功能。UCD是Unicode字符数据库（Unicode Character DataBase）的缩写，由一些描述Unicode字符属性和内部关系的纯文本或html文件组成。该模块允许开发者查询字符的各种属性、进行字符分类、文本规范化等操作，是处理国际化文本的重要工具。

## 🎯 学习目标

- 理解Unicode字符数据库的基本概念和结构
- 掌握unicodedata模块的核心函数和使用方法
- 学会查询字符的各种属性（名称、分类、数值等）
- 掌握Unicode文本规范化技术
- 了解字符编码和国际化文本处理的最佳实践

## 📋 前置知识

- Python基本语法和字符串操作
- Unicode编码和字符集的基本概念
- 文本处理和国际化的基础知识
- 异常处理机制

## 🔍 详细内容

### Unicode字符数据库概述

UCD中的文本文件大都是适合于程序分析的Unicode相关数据。其中的html文件解释了数据库的组织，数据的格式和含义。

UCD中最庞大的文件无疑就是描述汉字属性的文件Unihan.txt。在UCD 5.0.0中，Unihan.txt文件大小有28,221K字节。Unihan.txt中包含了很多有参考价值的索引，例如汉字部首、笔划、拼音、使用频度、四角号码排序等。这些索引都是基于一些比较权威的辞典，但大多数索引只能检索部分汉字。

### 核心函数详解

#### 字符名称查询

**unicodedata.lookup(name)**
通过名称来查找一个字符。如果字符存在就返回相应字符，如果不存在抛出异常KeyError。

```python
import unicodedata

# 通过名称查找字符
print(unicodedata.lookup('LEFT CURLY BRACKET'))  # 输出: {
print(unicodedata.lookup('COMMERCIAL AT'))       # 输出: @

# 无效名称会抛出异常
try:
    print(unicodedata.lookup('LEFT'))
except KeyError as e:
    print(f"错误: {e}")  # 错误: "undefined character name 'LEFT'"
```

**unicodedata.name(chr[, default])**
通过字符来查找它的名称。如果成功返回相应名称，否则抛出异常ValueError。

{% raw %}
```python
import unicodedata

# 通过字符获取名称
print(unicodedata.name('{'))  # 输出: LEFT CURLY BRACKET
print(unicodedata.name('@'))  # 输出: COMMERCIAL AT
print(unicodedata.name('中')) # 输出: CJK UNIFIED IDEOGRAPH-4E2D

# 多字符会抛出异常
try:
    print(unicodedata.name('{{'))
except TypeError as e:
    print(f"错误: {e}")
```
{% endraw %}

#### 数值字符处理

**unicodedata.decimal(chr[, default])**
返回表示数字字符的数值。如果给一个没有数字的值时，会抛出异常ValueError。

```python
import unicodedata

# 获取数字字符的十进制值
print(unicodedata.decimal('7'))     # 输出: 7
print(unicodedata.decimal('九'))    # 输出: 9

# 使用默认值避免异常
print(unicodedata.decimal('a', -1)) # 输出: -1
```

**unicodedata.digit(chr[, default])**
把一个合法的数字字符串转换为数字值，比如0到9的字符串转换为相应的数字值。

```python
import unicodedata

# 获取数字字符的数字值
print(unicodedata.digit('9', None))  # 输出: 9
print(unicodedata.digit('②', None))  # 输出: 2

# 非单字符会抛出异常
try:
    print(unicodedata.digit('9a', None))
except TypeError as e:
    print(f"错误: {e}")
```

**unicodedata.numeric(chr[, default])**
把一个表示数字的字符串转换为浮点数返回。与digit()不一样的地方是它可以处理任意表示数值的字符，不仅仅限于0到9的字符。

```python
import unicodedata

# 获取各种数字字符的数值
print(unicodedata.numeric('四', None))  # 输出: 4.0
print(unicodedata.numeric('8', None))   # 输出: 8.0
print(unicodedata.numeric('½', None))   # 输出: 0.5
print(unicodedata.numeric('Ⅴ', None))   # 输出: 5.0
```

#### 字符分类和属性

**unicodedata.category(chr)**
返回字符在Unicode中的分类类型。

| 代码 | 分类 | 描述 |
|------|------|------|
| Cc | Other, Control | 控制字符 |
| Cf | Other, Format | 格式字符 |
| Cn | Other, Not Assigned | 未分配字符 |
| Co | Other, Private Use | 私用字符 |
| Cs | Other, Surrogate | 代理字符 |
| Ll | Letter, Lowercase | 小写字母 |
| Lm | Letter, Modifier | 修饰字母 |
| Lo | Letter, Other | 其他字母 |
| Lt | Letter, Titlecase | 标题字母 |
| Lu | Letter, Uppercase | 大写字母 |
| Mc | Mark, Spacing Combining | 间距组合标记 |
| Me | Mark, Enclosing | 包围标记 |
| Mn | Mark, Nonspacing | 非间距标记 |
| Nd | Number, Decimal Digit | 十进制数字 |
| Nl | Number, Letter | 字母数字 |
| No | Number, Other | 其他数字 |
| Pc | Punctuation, Connector | 连接标点 |
| Pd | Punctuation, Dash | 破折号标点 |
| Pe | Punctuation, Close | 关闭标点 |
| Pf | Punctuation, Final quote | 结束引号 |
| Pi | Punctuation, Initial quote | 开始引号 |
| Po | Punctuation, Other | 其他标点 |
| Ps | Punctuation, Open | 开放标点 |
| Sc | Symbol, Currency | 货币符号 |
| Sk | Symbol, Modifier | 修饰符号 |
| Sm | Symbol, Math | 数学符号 |
| So | Symbol, Other | 其他符号 |
| Zl | Separator, Line | 行分隔符 |
| Zp | Separator, Paragraph | 段落分隔符 |
| Zs | Separator, Space | 空格分隔符 |

```python
import unicodedata

# 查询字符分类
print(unicodedata.category('四'))  # 输出: Lo (Letter, Other)
print(unicodedata.category('8'))   # 输出: Nd (Number, Decimal Digit)
print(unicodedata.category('a'))   # 输出: Ll (Letter, Lowercase)
print(unicodedata.category('A'))   # 输出: Lu (Letter, Uppercase)
print(unicodedata.category('$'))   # 输出: Sc (Symbol, Currency)
```

**unicodedata.bidirectional(chr)**
返回字符的双向类别，用于确定从左到右还是从右到左的排列。

```python
import unicodedata

# 查询字符的双向属性
print(unicodedata.bidirectional('9'))        # 输出: EN (European Number)
print(unicodedata.bidirectional('\u0660'))   # 输出: AN (Arabic Number)
print(unicodedata.bidirectional('中'))       # 输出: L (Letter)
print(unicodedata.bidirectional('a'))        # 输出: L (Letter)
```

其中：
- EN表示European Number（欧洲数字）
- AN表示Arabic Number（阿拉伯数字）
- L表示Letter（字母）
- R表示Right-to-Left（从右到左）

#### 字符组合和显示属性

**unicodedata.combining(chr)**
返回字符的权威组合值，如果没有定义，默认返回0。在正规化操作时，可以根据这个值进行排序，大的值排在小的值后面。

```python
import unicodedata

# 查询字符的组合类
print(unicodedata.combining('9'))   # 输出: 0
print(unicodedata.combining('A'))   # 输出: 0
print(unicodedata.combining('\u0300'))  # 输出: 230 (重音符)
```

**unicodedata.east_asian_width(chr)**
返回字符显示的宽度类别。

宽度类别：
- 'F' (Fullwidth) - 全角
- 'H' (Halfwidth) - 半角
- 'W' (Wide) - 宽字符
- 'Na' (Narrow) - 窄字符
- 'A' (Ambiguous) - 不确定
- 'N' (Natural) - 自然宽度

```python
import unicodedata

# 查询字符显示宽度
print(unicodedata.east_asian_width('9'))   # 输出: Na (Narrow)
print(unicodedata.east_asian_width('A'))   # 输出: Na (Narrow)
print(unicodedata.east_asian_width('蔡'))  # 输出: W (Wide)
print(unicodedata.east_asian_width('　'))  # 输出: F (Fullwidth)
```

**unicodedata.mirrored(chr)**
判断一个字符是否支持镜像属性，如果支持返回1，否则返回0。

```python
import unicodedata

# 查询字符镜像属性
print(unicodedata.mirrored('9'))    # 输出: 0
print(unicodedata.mirrored('A'))    # 输出: 0
print(unicodedata.mirrored('('))    # 输出: 1
print(unicodedata.mirrored('['))    # 输出: 1
```

#### 字符分解和规范化

**unicodedata.decomposition(chr)**
返回字符的分解形式，如果不可分解，返回空字符串。

```python
import unicodedata

# 查询字符分解
print(unicodedata.decomposition('9'))     # 输出: (空字符串)
print(unicodedata.decomposition('-'))     # 输出: (空字符串)
print(unicodedata.decomposition('蔡'))    # 输出: (空字符串)
print(unicodedata.decomposition('ガ'))    # 输出: 30AB 3099
print(unicodedata.decomposition('ñ'))     # 输出: 006E 0303
```

**unicodedata.normalize(form, unistr)**
将Unicode字符串转换为指定的规范化形式。支持四种规范化格式：

- **NFC** (Canonical Decomposition, followed by Canonical Composition) - 标准分解后重组
- **NFKC** (Compatibility Decomposition, followed by Canonical Composition) - 兼容分解后重组
- **NFD** (Canonical Decomposition) - 标准分解
- **NFKD** (Compatibility Decomposition) - 兼容分解

```python
import unicodedata

# 文本规范化示例
title = "Klüft skräms inför på fédéral électoral große"

# 使用NFKD规范化并转换为ASCII
normalized = unicodedata.normalize('NFKD', title)
ascii_version = normalized.encode('ascii', 'ignore').decode('ascii')
print(ascii_version)  # 输出: Kluft skrams infor pa federal electoral groe

# 对比不同规范化形式
text = "café"  # 包含组合字符
print(f"原文: {text}")
print(f"NFC: {unicodedata.normalize('NFC', text)}")
print(f"NFD: {unicodedata.normalize('NFD', text)}")
print(f"NFKC: {unicodedata.normalize('NFKC', text)}")
print(f"NFKD: {unicodedata.normalize('NFKD', text)}")
```

#### 版本信息

**unicodedata.unidata_version**
返回当前Unicode使用的数据库版本。

**unicodedata.ucd_3_2_0**
提供UCD 3.2的对象方式访问，以便兼容旧的IDNA应用程序。

```python
import unicodedata

# 查询Unicode数据库版本
print(unicodedata.unidata_version)  # 输出: 13.0.0 (版本号会因Python版本而异)

# 访问旧版本UCD
print(unicodedata.ucd_3_2_0)  # 输出: <unicodedata.UCD object at 0x...>
```

## 💡 实际应用

### 文本清理和规范化

```python
import unicodedata
import re

def clean_text(text):
    """清理和规范化文本"""
    # 规范化为NFKD形式
    normalized = unicodedata.normalize('NFKD', text)
    
    # 移除重音符号
    no_accents = ''.join(c for c in normalized 
                        if unicodedata.category(c) != 'Mn')
    
    # 转换为小写
    return no_accents.lower()

# 示例使用
text = "Café résumé naïve Zürich"
cleaned = clean_text(text)
print(f"原文: {text}")
print(f"清理后: {cleaned}")  # 输出: cafe resume naive zurich
```

### 字符分类统计

```python
import unicodedata
from collections import Counter

def analyze_text(text):
    """分析文本中字符的类型分布"""
    categories = []
    for char in text:
        if char.strip():  # 忽略空白字符
            cat = unicodedata.category(char)
            categories.append(cat)
    
    return Counter(categories)

# 示例使用
text = "Hello, 世界! 123 @#$"
analysis = analyze_text(text)
for category, count in analysis.items():
    print(f"{category}: {count}")
```

### 数值字符处理

```python
import unicodedata

def extract_numeric_values(text):
    """提取文本中所有数值字符的数值"""
    values = []
    for char in text:
        try:
            # 尝试获取数值
            value = unicodedata.numeric(char)
            values.append((char, value))
        except ValueError:
            # 非数值字符，跳过
            continue
    return values

# 示例使用
text = "第1章：五四运动，发生在1919年。数量：½ 罗马数字：Ⅴ"
numeric_chars = extract_numeric_values(text)
for char, value in numeric_chars:
    print(f"字符 '{char}' 的数值: {value}")
```

### Unicode字符信息查询

```python
import unicodedata

def get_char_info(char):
    """获取字符的详细信息"""
    try:
        info = {
            'character': char,
            'name': unicodedata.name(char),
            'category': unicodedata.category(char),
            'bidirectional': unicodedata.bidirectional(char),
            'combining': unicodedata.combining(char),
            'east_asian_width': unicodedata.east_asian_width(char),
            'mirrored': bool(unicodedata.mirrored(char)),
            'decomposition': unicodedata.decomposition(char) or 'None'
        }
        
        # 尝试获取数值
        try:
            info['numeric_value'] = unicodedata.numeric(char)
        except ValueError:
            info['numeric_value'] = 'N/A'
            
        return info
    except ValueError:
        return {'character': char, 'error': 'Character information not available'}

# 示例使用
for char in ['A', '中', '1', '€', '(']:
    info = get_char_info(char)
    print(f"\n字符 '{char}' 的信息:")
    for key, value in info.items():
        if key != 'character':
            print(f"  {key}: {value}")
```

### 文件名安全化

```python
import unicodedata
import re

def safe_filename(filename):
    """将文件名转换为安全的ASCII文件名"""
    # 规范化文本
    normalized = unicodedata.normalize('NFKD', filename)
    
    # 移除重音符号和特殊字符
    ascii_name = normalized.encode('ascii', 'ignore').decode('ascii')
    
    # 替换不安全的字符
    safe_name = re.sub(r'[<>:"/\\|?*]', '_', ascii_name)
    
    # 移除多余的空格和下划线
    safe_name = re.sub(r'[_\s]+', '_', safe_name).strip('_')
    
    return safe_name

# 示例使用
filenames = [
    "Résumé (français).pdf",
    "データファイル.txt",
    "文档<版本1>.docx",
    "café/bar menu.xlsx"
]

for filename in filenames:
    safe = safe_filename(filename)
    print(f"原文件名: {filename}")
    print(f"安全文件名: {safe}\n")
```

## ⚠️ 注意事项

### 性能考虑

- **大文本处理**: 对于大量文本的规范化操作，考虑使用生成器或分块处理
- **缓存结果**: 频繁查询的字符信息可以缓存以提高性能
- **选择合适的规范化形式**: 不同的规范化形式有不同的性能特征

### 编码问题

- **字符串类型**: 确保输入是Unicode字符串，避免字节字符串导致的错误
- **单字符限制**: 大多数函数只接受单个字符作为参数
- **异常处理**: 合理处理KeyError、ValueError等异常

### 版本差异

- **Unicode版本**: 不同Python版本使用的Unicode数据库版本可能不同
- **字符支持**: 较新的字符可能在旧版本中不被支持
- **兼容性**: 使用ucd_3_2_0进行向后兼容时要注意功能限制

### 国际化考虑

- **语言特性**: 不同语言的字符处理规则可能不同
- **文化差异**: 文本排序和比较需要考虑locale设置
- **字体支持**: 确保目标环境支持相应的字符显示

## 🔗 相关内容

- [字符串类型 - str](../../builtins/str/)
- [正则表达式 - re](../re/)
- [文本处理 - string](../string/)
- [编码解码 - codecs](../codecs/)

## 📚 扩展阅读

- [Python unicodedata官方文档](https://docs.python.org/3/library/unicodedata.html)
- [Unicode标准官方网站](https://unicode.org/)
- [Unicode字符数据库](https://www.unicode.org/ucd/)
- [Unicode规范化表单](https://unicode.org/reports/tr15/)

## 🏷️ 标签

`Unicode` `字符处理` `文本处理` `字符编码` `国际化` `字符分类`

---

**最后更新**: 2024-01-15  
**作者**: Python文档团队  
**版本**: 1.0