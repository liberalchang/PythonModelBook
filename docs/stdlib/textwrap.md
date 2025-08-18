---
layout: doc
title: 文本格式化 - textwrap模块
permalink: /docs/stdlib/textwrap/
category: stdlib
tags: [textwrap, 文本格式化, 段落包装, 文本缩进, 字符串处理, 文本填充]
description: Python textwrap模块详解，用于文本段落的格式化、包装、缩进和填充处理
author: Python文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "初级"
---

# 文本格式化 - textwrap模块

## 📝 概述

textwrap模块用于格式化文本段落，通过调整段落中换行符的位置来格式化文本。它提供的编程功能类似于许多文本编辑器和文字处理器中的段落包装或填充功能，在需要漂亮打印的情况下格式化输出文本。

## 🎯 学习目标

- 掌握textwrap模块的核心函数使用
- 学会文本段落的填充和包装技巧
- 理解文本缩进和去缩进的处理方法
- 掌握TextWrapper类的高级配置
- 学会在实际项目中应用文本格式化

## 📋 前置知识

- Python基本语法和字符串操作
- 文本处理基础概念
- 对文本格式化需求的理解

## 🔍 详细内容

### 基本概念

textwrap模块提供了三个便捷的方法：`wrap`、`fill`和`dedent`，以及一个功能完整的`TextWrapper`类。前三个方法是便捷的使用方式，内部运行时也是建立了一个TextWrapper对象。如果程序中需要大量运用这几个方法，最好还是创建TextWrapper比较快一些。

### 核心函数

#### 1. textwrap.fill()
填充段落，将文本作为输入并生成格式化文本作为输出。

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| text | str | 是 | 无 | 要处理的字符串 |
| width | int | 否 | 70 | 每行字符最大数量 |
| **kwargs | dict | 否 | - | 与TextWrapper实例中的参数相同 |

**返回值**: `str` - 格式化后的字符串

#### 2. textwrap.wrap()
包装文本，对text以每行width个字符自动换行，返回字符串列表。

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| text | str | 是 | 无 | 要处理的字符串 |
| width | int | 否 | 70 | 每行字符最大数量 |
| **kwargs | dict | 否 | - | 与TextWrapper实例中的参数相同 |

**返回值**: `list[str]` - 包含一个或多个字符串的列表，行尾不带换行符

#### 3. textwrap.dedent()
去除缩进，移除不被期望的空白符。

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| text | str | 是 | 无 | 要处理的字符串 |

**返回值**: `str` - 去除公共前导空白的文本

#### 4. textwrap.indent()
添加缩进，向字符串中的所有行添加一致的前缀文本。

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| text | str | 是 | 无 | 要处理的字符串 |
| prefix | str | 是 | 无 | 要添加的前缀字符串 |
| predicate | callable | 否 | None | 判断哪些行需要添加前缀的函数 |

#### 5. textwrap.shorten()
截断长文本，创建摘要或预览。

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| text | str | 是 | 无 | 要处理的字符串 |
| width | int | 是 | 无 | 最大字符长度 |
| placeholder | str | 否 | '[...]' | 截断时的占位符 |

### TextWrapper类属性

| 属性 | 默认值 | 说明 |
|------|--------|------|
| width | 70 | 每行最大字符数 |
| expand_tabs | True | 是否将制表符转换为空格 |
| replace_whitespace | True | 是否将空白符转化为空格 |
| drop_whitespace | True | 是否去掉每行开头和结尾的空白符 |
| initial_indent | '' | 第一行的前缀 |
| subsequent_indent | '' | 除第一行外其他行的前缀 |
| fix_sentence_endings | False | 是否检查句子结尾的两个空格分割 |
| break_long_words | True | 是否切断长单词 |
| break_on_hyphens | True | 是否在连字符处断行 |

## 💡 实际应用

### 基础用法

## 📎 原始文档（完整迁移）

一、例子

```python
s = "Look into my eyes, look into my eyes, the eyes, the eyes, \
the eyes, not around the eyes, don't look around the eyes, \
look into my eyes, you're under."

import textwrap

print(textwrap.fill(s, 70))
print()

print(textwrap.fill(s, 40))
print()

print(textwrap.fill(s, 40, initial_indent='    '))
print()
```

二、涉及

-----textwrap-----

## textwrap - 格式化文本段落

## 目的：通过调整段落中出现换行符的位置来格式化文本。

>  模块可用于在需要漂亮打印的情况下格式化输出文本。它提供的编程功能类似于许多文本编辑器和文字处理器中的段落包装或填充功能。

## 示例数据

下面所示是一个  ：


```python
sample_text = '''
Beautiful is     better than ugly.    
Explicit            is     better than implicit.
Simple is           better than complex. 
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't    special enough to break the rules.
Although practicality beats purity.
Errors should   never pass silently.
Unless explicitly           silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!
    '''
```

## 填写段落（Filling Paragraphs）

 函数的作用是将文本作为输入，并生成格式化文本作为输出。

```python
result_text = textwrap.fill(text=sample_text, width=50)
```

输出结果如下所示：

```python
 Beautiful is     better than ugly.     Explicit
is     better than implicit. Simple is
better than complex.  Complex is better than
complicated. Flat is better than nested. Sparse is
better than dense. Readability counts. Special
cases aren't    special enough to break the rules.
Although practicality beats purity. Errors should
never pass silently. Unless explicitly
silenced. In the face of ambiguity, refuse the
temptation to guess. There should be one-- and
preferably only one --obvious way to do it.
Although that way may not be obvious at first
unless you're Dutch. Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a
bad idea. If the implementation is easy to
explain, it may be a good idea. Namespaces are one
honking great idea -- let's do more of those!
```

结果有些不尽如人意。文本现在左对齐，但第一行保留缩进，后续每行前面的空格嵌入段落中。

## 去掉缩进（Removing Existing Indentation）

前面的示例在输出的中间混合了嵌入了tab和space，所以输出的结果不尽人意。使用  从示例文本的所有行中删除公共空白前缀会产生更好的结果，并允许直接从Python代码中使用docstring或嵌入的多行字符串，同时删除代码本身的格式。

代码为：

```text
result_text = textwrap.dedent(text=sample_text)
```

运行结果如下，可以看出前面的空格已经删除了。

```text
Beautiful is     better than ugly.    
Explicit            is     better than implicit.
Simple is           better than complex. 
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't    special enough to break the rules.
Although practicality beats purity.
Errors should   never pass silently.
Unless explicitly           silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!
```

由于   是   的反义词，因此结果是一个文本块，其中每行的公共初始空格都被删除。如果一行的缩进比另一行多，则不会删除部分空白。

具体如下所示

假设输入为以下文本：

```
_Line one  # 前面一个空格
__line two  # 前面两个空格
___line three  # 前面三个空格
_line four  # 前面一个空格
```

则输出为：

```text
Line one  # 前面无空格
_line two  # 前面一个空格
__line three  # 前面两个空格
line four  # 前面无空格
```

## 混合填充（Combining Detent and Fill）

接下来，可以使用几个不同的宽度值通过   传递   文本。

```text
dedented_text = textwrap.dedent(sample_text).strip()
for width in [45, 60]:
    print(f'width = {width}')
    print(textwrap.fill(dedented_text, width=width))
```

输出结果为：

```text
width = 45
Beautiful is     better than ugly.
Explicit            is     better than
implicit. Simple is           better than
complex.  Complex is better than complicated.
Flat is better than nested. Sparse is better
than dense. Readability counts. Special cases
aren't    special enough to break the rules.
Although practicality beats purity. Errors
should   never pass silently. Unless
explicitly           silenced. In the face of
ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one
--obvious way to do it. Although that way may
not be obvious at first unless you're Dutch.
Now is better than never. Although never is
often better than *right* now. If the
implementation is hard to explain, it's a bad
idea. If the implementation is easy to
explain, it may be a good idea. Namespaces
are one honking great idea -- let's do more
of those!
width = 60
Beautiful is     better than ugly.     Explicit
is     better than implicit. Simple is           better than
complex.  Complex is better than complicated. Flat is better
than nested. Sparse is better than dense. Readability
counts. Special cases aren't    special enough to break the
rules. Although practicality beats purity. Errors should
never pass silently. Unless explicitly           silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way
to do it. Although that way may not be obvious at first
unless you're Dutch. Now is better than never. Although
never is often better than *right* now. If the
implementation is hard to explain, it's a bad idea. If the
implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of
those!
```

## 缩进块（Indenting Blocks）

使用  函数向字符串中的所有行添加一致的前缀文本。此示例将相同的示例文本格式化为回复中引用的电子邮件的一部分，并使用   作为每行的前缀。

![[公式]](https://www.zhihu.com/equation?tex=%3E

```text
dedented_text = textwrap.dedent(sample_text)
wrapped = textwrap.fill(dedented_text, width=50)
wrapped += '\n\nSecond paragraph after a blank line.'
final = textwrap.indent(wrapped, '> ')

print('Quoted block:\n')
print(final)
```

文本块在换行符上拆分，前缀添加到包含文本的每一行，然后将这些行合并回一个新字符串并返回。

```text
>  Beautiful is     better than ugly.     Explicit
> is     better than implicit. Simple is
> better than complex.  Complex is better than
> complicated. Flat is better than nested. Sparse is
> better than dense. Readability counts. Special
> cases aren't    special enough to break the rules.
> Although practicality beats purity. Errors should
> never pass silently. Unless explicitly
> silenced. In the face of ambiguity, refuse the
> temptation to guess. There should be one-- and
> preferably only one --obvious way to do it.
> Although that way may not be obvious at first
> unless you're Dutch. Now is better than never.
> Although never is often better than *right* now.
> If the implementation is hard to explain, it's a
> bad idea. If the implementation is easy to
> explain, it may be a good idea. Namespaces are one
> honking great idea -- let's do more of those!

> Second paragraph after a blank line.
```

要控制哪些行接收新前缀，请将   作为谓词参数传递给  。将依次为每行文本调用  ，并为返回值为   的行添加前缀。


```text
def should_indent(line):
    print('Indent {!r}?'.format(line))
    return len(line.strip()) % 2 == 0

dedented_text = textwrap.dedent(sample_text)
wrapped = textwrap.fill(dedented_text, width=50)
final = textwrap.indent(wrapped, 'EVEN ',
                        predicate=should_indent)

print('\nQuoted block:\n')
print(final)
```

本例将前缀   添加到包含偶数个字符的行中。

```text
Indent ' Beautiful is     better than ugly.     Explicit\n'?
Indent 'is     better than implicit. Simple is\n'?
Indent 'better than complex.  Complex is better than\n'?
Indent 'complicated. Flat is better than nested. Sparse is\n'?
Indent 'better than dense. Readability counts. Special\n'?
Indent "cases aren't    special enough to break the rules.\n"?
Indent 'Although practicality beats purity. Errors should\n'?
Indent 'never pass silently. Unless explicitly\n'?
Indent 'silenced. In the face of ambiguity, refuse the\n'?
Indent 'temptation to guess. There should be one-- and\n'?
Indent 'preferably only one --obvious way to do it.\n'?
Indent 'Although that way may not be obvious at first\n'?
Indent "unless you're Dutch. Now is better than never.\n"?
Indent 'Although never is often better than *right* now.\n'?
Indent "If the implementation is hard to explain, it's a\n"?
Indent 'bad idea. If the implementation is easy to\n'?
Indent 'explain, it may be a good idea. Namespaces are one\n'?
Indent "honking great idea -- let's do more of those!"?

Quoted block:

 Beautiful is     better than ugly.     Explicit
EVEN is     better than implicit. Simple is
EVEN better than complex.  Complex is better than
EVEN complicated. Flat is better than nested. Sparse is
EVEN better than dense. Readability counts. Special
EVEN cases aren't    special enough to break the rules.
Although practicality beats purity. Errors should
EVEN never pass silently. Unless explicitly
EVEN silenced. In the face of ambiguity, refuse the
EVEN temptation to guess. There should be one-- and
preferably only one --obvious way to do it.
Although that way may not be obvious at first
EVEN unless you're Dutch. Now is better than never.
EVEN Although never is often better than *right* now.
EVEN If the implementation is hard to explain, it's a
EVEN bad idea. If the implementation is easy to
EVEN explain, it may be a good idea. Namespaces are one
honking great idea -- let's do more of those!
```

## 悬挂缩进（Hanging Indents）

与设置输出宽度的方法相同，第一行的缩进可以独立于后续行进行控制。

```text
dedented_text = textwrap.dedent(sample_text).strip()
print(textwrap.fill(dedented_text,
                    initial_indent='',
                    subsequent_indent=' ' * 4,
                    width=50,
                    ))
```

这使得产生悬挂缩进成为可能，其中第一行缩进小于其他行。

```text
Beautiful is     better than ugly.     Explicit
    is     better than implicit. Simple is
    better than complex.  Complex is better than
    complicated. Flat is better than nested.
    Sparse is better than dense. Readability
    counts. Special cases aren't    special enough
    to break the rules. Although practicality
    beats purity. Errors should   never pass
    silently. Unless explicitly
    silenced. In the face of ambiguity, refuse the
    temptation to guess. There should be one-- and
    preferably only one --obvious way to do it.
    Although that way may not be obvious at first
    unless you're Dutch. Now is better than never.
    Although never is often better than *right*
    now. If the implementation is hard to explain,
    it's a bad idea. If the implementation is easy
    to explain, it may be a good idea. Namespaces
    are one honking great idea -- let's do more of
    those!
```

缩进值也可以包括非空白字符。例如，悬挂缩进可以以   作为前缀以生成项目符号。


## 截断长文本（Truncating Long Text）

截断长文本要截断文本以创建摘要或预览，可以使用  。所有现有的空白，如制表符、换行符和一系列多个空格，都将标准化为一个空格。然后，文本将在单词边界之间被截断为小于或等于所请求的长度，以便不包含部分单词。


```text
dedented_text = textwrap.dedent(sample_text)
original = textwrap.fill(dedented_text, width=50)

print('Original:\n')
print(original)

shortened = textwrap.shorten(original, 100)
shortened_wrapped = textwrap.fill(shortened, width=50)

print('\nShortened:\n')
print(shortened_wrapped)
```

如果在截断过程中从原始文本中删除了非空白文本，则会将其替换为占位符值。可以通过为  提供占位符参数来替换默认值   。


```text
Original:

 Beautiful is     better than ugly.     Explicit
is     better than implicit. Simple is
better than complex.  Complex is better than
complicated. Flat is better than nested. Sparse is
a better than dense. Readability counts. Special
cases aren't    special enough to break the rules.
Although practicality beats purity. Errors should
never pass silently. Unless explicitly
silenced. In the face of ambiguity, refuse the
temptation to guess. There should be one-- and
preferably only one --obvious way to do it.
Although that way may not be obvious at first
unless you're Dutch. Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a
bad idea. If the implementation is easy to
explain, it may be a good idea. Namespaces are one
honking great idea -- let's do more of those!

Shortened:

Beautiful is better than ugly. Explicit is better
than implicit. Simple is better than [...]
```



*******

该模块首先提供了三个便捷的方法：wrap，fill和decent，也提供了TextWrapper类。其中TextWrapper提供了全套的方法，前三个方法只是便捷的使用，因为在内部的运行中也是建立了一个TextWrapper对象。如果程序中需要大量运用这几个方法，最好还是创建TextWrapper比较快一些。

- textwrap.wrap(text,[width[,…]])

text: str，要处理的字符串

width: int，默认为 70，每行字符最大数量

**kwargs: 可选参数，与 TextWrapper 实例中的参数相同

返回值:

list[str, str, str, ...]，包含一个或多个 str 类型子元素的列表

对 text 以每行 width 个字符自动换行，所有行组成列表返回，行尾不带换行符

这个方法是将一个字符串按照width的宽度进行切割，切割后返回list

```python
#-*-coding:utf-8-*-
import textwrap
sample_text = '''aaabbbcccdddeeeedddddfffffggggghhhhhhkkkkkkk'''
sample_text2 = '''aaa bbb ccc ddd eeee ddddd fffff ggggg hhhhhh kkkkkkk'''

print sample_text
print textwrap.wrap(sample_text,width=5)
print textwrap.wrap(sample_text2,width=5)
```




下面是执行结果

```python
aaabbbcccdddeeeedddddfffffggggghhhhhhkkkkkkk
['aaabb', 'bcccd', 'ddeee', 'edddd', 'dffff', 'fgggg', 'ghhhh', 'hhkkk', 'kkkk']
['aaa', 'bbb', 'ccc', 'ddd', 'eeee', 'ddddd', 'fffff', 'ggggg', 'hhhhh', 'h kkk', 'kkkk']

```

看第三个打印的结果，并不是保证了每个list元素都是按照width的，因为不但要考虑到width，也要考虑到空格，也就是一个单词。

- textwrap.fill(text[, width[, …]])

这个和上面wrap方法类似，不过返回结果是不一样的。

```python
#-*-coding:utf-8-*-
import textwrap
sample_text = '''aaabbbcccdddeeeedddddfffffggggghhhhhhkkkkkkk'''
sample_text2 = '''aaa bbb ccc ddd eeee ddddd fffff ggggg hhhhhh kkkkkkk'''

print sample_text
print textwrap.fill(sample_text,width=5)
print textwrap.fill(sample_text2,width=5)

aaabbbcccdddeeeedddddfffffggggghhhhhhkkkkkkk
aaabb
bcccd
ddeee
edddd
dffff
fgggg
ghhhh
hhkkk
kkkk
aaa
bbb
ccc
ddd
eeee
ddddd
fffff
ggggg
hhhhh
h kkk
kkkk
```

- textwrap.dedent(text)这个方法是用来移除不被期望的空白符。

```python
#-*-coding:utf-8-*-
import textwrap
sample_text = '''
    aaabbb
                cccdddee    eedddddfffffggggghhhhhhkkkkkkk'''
print sample_text
print textwrap.dedent(sample_text)

    aaabbb
                cccdddee    eedddddfffffggggghhhhhhkkkkkkk

aaabbb
            cccdddee    eedddddfffffggggghhhhhhkkkkkkk
```

下面是包中的一个类TextWrapperclass textwrap.TextWrapper(…)这个类的构造函数接受一系列的关键字参数来初始化自己的属性信息，例如用如下代码初始化：

```
wrapper = TextWrapper(initial_indent="* ")
```

相当于是用了如下代码

```
wrapper = TextWrapper()
wrapper.initial_indent = "* "
```

你可以多次复用自己创建的实例，而且在用的过程中可以随意改变实例属性值。

下面是该类的一些属性：

width：宽度最大值，默认是70，这和上面wrap的参数一样。

expand_tabs：默认为true，如果设置为true，那么字符串里的所有制表符都会被变成空格，相当于用了字符串方法的expandtabs()。

```python
import textwrap
sample_text = '''   aaa'''
textWrap = textwrap.TextWrapper()
textWrap.expand_tabs = True
print textWrap.wrap(sample_text)
```

replace_whitespace：如果设置为true，那么就会把字符串中的空白符转化为空格。

drop_whitespace：默认true，如果设置为true，则每行开头和结尾的空白符都会被去掉，如果要去掉的空白符占据了整行，那么就会把整行去掉。

initial_indent:进行初始化，如下代码：

```python
#-*-coding:utf-8-*-
import textwrap
sample_text = '''aaa'''
textWrap = textwrap.TextWrapper()
textWrap.initial_indent = 'bbb'
print textWrap.wrap(sample_text)
---------------------------------------
执行结果
['bbbaaa']
```

subsequent_indent:初始化除了第一行的所有行：

```python
#-*-coding:utf-8-*-
import textwrap
sample_text = '''aaa
kkk
jjj'''
textWrap = textwrap.TextWrapper(width = 2)
textWrap.initial_indent = 'bbb'
textWrap.subsequent_indent = 'ccc'
print textWrap.wrap(sample_text)
---------------------------------------
下面是执行结果
['bbba', 'ccca', 'ccca', 'ccck', 'ccck', 'ccck', 'cccj', 'cccj', 'cccj']
```

fix_sentence_endings：默认为false，如果为true，那么就会试图检查每个句子的结尾是两个空格分割，这个只在等宽字体里被需要。但是这个检查的算法是有缺陷的，它假设了句子是以.!?等这些字符为结尾。

break_long_words：默认为true，切断长句子来让每行的数据宽度都小于width。

break_on_hyphens：连字符相关，默认true

wrap(text)

fill(text)上面两个方法和最上面的类似，不细说