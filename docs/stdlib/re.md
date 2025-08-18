---
layout: doc
title: 正则表达式 - re模块
permalink: /docs/stdlib/re/
category: stdlib
tags: [正则表达式, 模式匹配, 文本处理, 字符串匹配, re, 文本解析]
description: Python re模块详解，掌握正则表达式的强大功能，包括模式匹配、文本搜索、替换操作和分组提取
author: Python文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# 正则表达式 - re模块

## 📝 概述

re模块是Python中用于正则表达式处理的核心模块，提供强大的模式匹配功能，用于动态、模糊的字符串匹配。该模块在爬虫、文本处理、数据验证等领域使用广泛，是Python开发者必须掌握的重要工具。

## 🎯 学习目标

- 掌握re模块的核心方法和使用技巧
- 理解正则表达式的语法规则和特殊字符
- 学会使用分组功能进行复杂模式匹配
- 掌握标志位的使用和两种调用形式
- 学会在实际项目中应用正则表达式

## 📋 前置知识

- Python基本语法和数据类型
- 字符串操作和处理方法
- 基本的模式匹配概念
- 文件和文本处理基础

## 🔍 详细内容

### 基本概念

re模块是Python中用于正则表达式处理的核心模块，功能用来匹配字符串（动态、模糊的匹配），在爬虫和文本处理中使用广泛。

### 核心方法

re模块提供了以下常用方法：

| 方法 | 功能 | 返回值 |
|------|------|--------|
| **match()** | 从头匹配 | Match对象或None |
| **search()** | 从整个文本搜索 | Match对象或None |
| **findall()** | 找到所有符合的 | 列表 |
| **split()** | 分割 | 列表 |
| **sub()** | 替换 | 字符串 |
| **group()** | 结果转化为内容 | 字符串 |
| **groupdict()** | 结果转化为字典 | 字典 |

#### 方法详解

1. **compile函数**：用于编译正则表达式，生成一个正则表达式Pattern对象，供match()和search()这两个函数使用。

2. **re.match**：尝试从字符串的起始位置匹配一个模式，如果不是起始位置匹配成功的话，match()就返回none。

3. **re.search**：扫描整个字符串并返回第一个成功的匹配。

4. **findall**：在字符串中找到正则表达式所匹配的所有子串，并返回一个列表，如果没有找到匹配的，则返回空列表。

> **注意**：match和search是匹配一次，findall匹配所有。

### 正则表达式符号

常用正则表达式符号包括：

| 符号 | 含义 | 示例 |
|------|------|------|
| . | 匹配除换行符外的任意字符 | a.c 匹配 abc、adc |
| * | 匹配前面字符0次或多次 | ab* 匹配 a、ab、abb |
| + | 匹配前面字符1次或多次 | ab+ 匹配 ab、abb，不匹配 a |
| ? | 匹配前面字符0次或1次 | ab? 匹配 a、ab |
| ^ | 匹配字符串开头 | ^abc 匹配以abc开头的字符串 |
| $ | 匹配字符串结尾 | abc$ 匹配以abc结尾的字符串 |
| [] | 字符集，匹配其中任意一个字符 | [abc] 匹配 a、b 或 c |
| \| | 或运算符 | abc\|def 匹配 abc 或 def |
| () | 分组 | (abc)+ 匹配 abc、abcabc |
| {n} | 匹配前面字符恰好n次 | a{3} 匹配 aaa |
| {n,m} | 匹配前面字符n到m次 | a{2,4} 匹配 aa、aaa、aaaa |

### 详细使用示例

```python
import re

# （1）.：默认匹配除\n之外的任意一个字符。若指定flag DOTALL,则匹配任意字符，包括换行
res = re.match('......', 'li123kunhong123')
print(res.group())  # 结果——li123k

# （2）+：匹配前一个字符1次或多次。
res = re.match('.+', 'li123kunhong123')
print(res.group())  # 结果——li123kunhong123

# （3）^：从开头匹配字符。
res = re.match('^li\d+', 'li123kunhong123')
print(res.group())  # 结果——li123

# （4）$：匹配字符结尾, $前面的必须是字符串结尾
res = re.search('k.+3$', 'li123kunhong123')  # 获取k开始，中间任意，3结尾的字符串
print(res.group())  # 结果——kunhong123

# （5）[]：限制
# 匹配中间的英文
res = re.search('k[a-z]+g', 'likunhong123')
print(res.group())  # 结果——kunhong
# 连数字一起匹配
res = re.search('k[a-z0-9]+g', 'likun123hong123')
print(res.group())  # 结果——kun123hong

# 匹配两个井号之间的
res = re.search('#.+#', 'asdf#saffff123#sadf')
print(res.group())  # 结果——#saffff123#

# （6）?：匹配?的前一个字符出现或者不出现
res = re.search('ax?', 'abcd')  # 意思为ax中的a必须出现，x可以出现或者不出现
print(res.group())  # 结果——a
res = re.search('ax?', 'axbcd')  # 匹配ax，其中a必须出现，x可不出现
print(res.group())  # 结果——ax
res = re.search('a?nnc?', 'asdnnc')  # 匹配annc，其中nn必须出现
print(res.group())  # 结果——nnc

# （7）{m}{n,m}：匹配前一个字符m次,匹配前一个字符n到m次
res = re.search('[0-9]{3}', 'a1a11a111')
print(res.group())  # 结果——111
res = re.findall('[0-9]{3}', 'a123a113a1114')
print(res)  # 结果——['123', '113', '111']

# （8）|：或
res = re.search('abc|ABC', 'aaabcAAABC')
print(res.group())  # 结果为abc
res = re.findall('abc|ABC', 'aaabcAAABC')
print(res)  # 结果为['abc', 'ABC']

# （9）()：分组匹配
res = re.search('abc{2}', '3asfabccasdf')
print(res.group())  # 结果为abcc

res = re.search('(abc){2}(\|\|=)', '857kjhabcabc||=32342')
print(res.group())  # 结果为abcabc||=
```

### 特殊转义字符

```python
# 特殊字符说明
'''
'\A'    只从字符开头匹配，re.search("\Aabc","alexabc") 是匹配不到的
'\Z'    匹配字符结尾，同$
'\d'    匹配数字0-9
'\D'    匹配非数字
'\w'    匹配[A-Za-z0-9]
'\W'    匹配非[A-Za-z0-9]
'\s'     匹配空白字符、\t、\n、\r , re.search("\s+","ab\tc1\n3").group() 结果 '\t'
'''
```

### Flags标志

```python
# 1、忽略大小写
res = re.search('[a-z]+', 'asdf\dx', flags=re.I)
print(res.group())  # 结果为asdf

# 2、多行模式
res = re.search('^g', '\ngqwqw\ndxas\nadf\nasdf', flags=re.M)
print(res.group())  # 结果为g

# 3、匹配任意字符
res = re.search('.', '\ngqwqw\ndxas\nadf\nasdf', flags=re.S)
print(res.group())  # 结果为换行符
```

### 两种使用形式

re模块支持两种调用形式：

```python
import re

# 方式一：预编译模式
kk = re.compile(r'\d+')
result = kk.findall('one1two2three3four4')
print(result)  # ['1', '2', '3', '4']

# 方式二：直接调用
kk = re.compile(r'\d+')
result = re.findall(kk, "one123")
print(result)  # ['1', '2', '3']
```

### 分组功能详解

#### findall()中的括号行为

```python
import re

string = "abcdefg  acbdgef  abcdgfe  cadbgfe"

# 带括号与不带括号的区别
# 双重括号
regex = re.compile("((\w+)\s+\w+)")
print(regex.findall(string))
# 输出：[('abcdefg  acbdgef', 'abcdefg'), ('abcdgfe  cadbgfe', 'abcdgfe')]

# 单括号
regex1 = re.compile("(\w+)\s+\w+")
print(regex1.findall(string))
# 输出：['abcdefg', 'abcdgfe']

# 无括号
regex2 = re.compile("\w+\s+\w+")
print(regex2.findall(string))
# 输出：['abcdefg  acbdgef', 'abcdgfe  cadbgfe']
```

**规律总结**：
- 第一个regex中带有2个括号，输出是一个list中包含2个tuple
- 第二个regex中带有1个括号，输出的内容就是括号匹配到的内容，而不是整个表达式所匹配到的结果
- 第三个regex中不带有括号，输出的内容就是整个表达式所匹配到的内容

**结论**：findall()返回的是括号所匹配到的结果，多个括号就会返回多个括号分别匹配到的结果，如果没有括号就返回整条语句所匹配到的结果。

#### group()方法详解

group()在正则表达式中用于获取分段截获的字符串：

```python
import re

a = "123abc456"
match_obj = re.search("([0-9]+)([a-z]+)([0-9]+)", a)

print(match_obj.group(0))  # 123abc456，返回整体
print(match_obj.group(1))  # 123
print(match_obj.group(2))  # abc
print(match_obj.group(3))  # 456
```

**重要说明**：
- `m.group(N)` 返回第N组括号匹配的字符
- `m.group()` == `m.group(0)` == 所有匹配的字符，与括号无关
- `m.groups()` 返回所有括号匹配的字符，以tuple格式
- `m.groups()` == `(m.group(1), m.group(2), ...)`

### Python3中函数说明

```python
findall(pattern, string, flags=0)
    """
    Return a list of all non-overlapping matches in the string.

    If one or more capturing groups are present in the pattern, return
    a list of groups; this will be a list of tuples if the pattern
    has more than one group.

    Empty matches are included in the result.
    """
```

## 💡 实际应用

### 数据验证

```python
import re

def validate_email(email):
    """验证邮箱格式"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_phone(phone):
    """验证电话号码格式"""
    pattern = r'^\d{3}-\d{3}-\d{4}$'
    return bool(re.match(pattern, phone))

def validate_id_card(id_card):
    """验证身份证号格式"""
    pattern = r'^\d{17}[\dX]$'
    return bool(re.match(pattern, id_card))
```

### 信息提取

```python
import re

# 身份证号解析
def parse_id_card(id_card):
    """解析身份证信息"""
    pattern = r'(?P<province>\d{3})(?P<city>\d{3})(?P<birth>\d{8})(?P<seq>\d{2})(?P<check>\d{2})'
    match = re.search(pattern, id_card)
    if match:
        return match.groupdict()
    return None

# 个人信息提取
def extract_personal_info(text):
    """提取姓名、年龄、职业信息"""
    pattern = r'(?P<name>[a-zA-Z]+)(?P<age>[0-9]+)(?P<job>\w+)'
    match = re.search(pattern, text)
    if match:
        return match.groupdict()
    return None

# 提取电话号码
def extract_phone_numbers(text):
    """提取文本中的电话号码"""
    pattern = r'\b\d{3}-\d{3}-\d{4}\b'
    return re.findall(pattern, text)
```

### 文本处理

```python
import re

def clean_text(text):
    """清理文本中的特殊字符"""
    return re.sub(r'[^\w\s]', '', text)

def split_sentences(text):
    """按句号分割句子"""
    return re.split(r'[.!?]+', text)

def replace_numbers(text, replacement='#'):
    """替换文本中的数字"""
    return re.sub(r'\d+', replacement, text)

def extract_urls(text):
    """提取文本中的URL"""
    pattern = r'https?://[^\s]+'
    return re.findall(pattern, text)
```

### 实际应用案例

#### 身份证识别

```python
# 身份证号解析
id_card = '300100199905120516'
result = re.search('(?P<province>\d{3})(?P<city>\d{3})(?P<birth>\d{8})(?P<seq>\d{2})(?P<check>\d{2})', id_card).groupdict()
print(result)
# 结果为：{'province': '300', 'city': '100', 'birth': '19990512', 'seq': '05', 'check': '16'}
```

#### 个人信息提取

```python
# 提取姓名、年龄、职业信息
text = 'likunhong23student'
result = re.search("(?P<name>[a-zA-Z]+)(?P<age>[0-9]+)(?P<job>\w+)", text).groupdict()
print(result)
# 结果为：{'name': 'likunhong', 'age': '23', 'job': 'student'}
```

#### 文本处理操作

```python
# split()分割
res = re.split('[0-9]+', 'ab23bas23basd9989ad')
print(res)  # 结果为['ab', 'bas', 'basd', 'ad']

# sub()替换,count不写默认为全体换
res = re.sub('[0-9]+', '?', 'abc2abc8abc4d', count=2)
print(res)  # 结果为abc?abc?abc4d

# 匹配反斜杠
res = re.search(r'\\d', 'asdf\dx')
print(res.group())  # 结果为\d
```

## ⚠️ 注意事项

### 性能优化

- **预编译模式**：频繁使用正则表达式时，建议使用`re.compile()`预编译
- **原始字符串**：使用原始字符串（r""）避免转义字符问题
- **贪婪匹配**：注意`.`和`+`等的贪婪匹配特性，必要时使用非贪婪匹配

### 常见陷阱

- **分组返回**：使用`findall()`时注意括号分组的影响
- **字符转义**：特殊字符需要正确转义，如`\d`、`\w`等
- **边界匹配**：注意`^`和`$`的边界匹配行为

### 最佳实践

- 复杂正则表达式应添加注释说明
- 使用命名分组提高代码可读性
- 合理使用标志位控制匹配行为
- 注意正则表达式的可维护性

## 🔗 相关内容

- [字符串类型 - str](../../builtins/str/)
- [文件操作 - open()](../../builtins/open/)
- [文件名匹配 - fnmatch](../fnmatch/)
- [文件通配符 - glob](../glob/)

## 📚 扩展阅读

- [Python正则表达式官方文档](https://docs.python.org/3/library/re.html)
- [正则表达式学习教程](https://blog.csdn.net/qq_30534935/article/details/93917459)
- [高级正则表达式技巧](https://blog.csdn.net/qq_30534935/article/details/94205176)
- [正则表达式在线测试工具](https://regex101.com/)

## 🏷️ 标签

`正则表达式` `模式匹配` `文本处理` `字符串匹配` `数据验证` `信息提取`

---

**最后更新**: 2024-01-15  
**作者**: Python文档团队  
**版本**: 1.0