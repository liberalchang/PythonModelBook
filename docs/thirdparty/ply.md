---
layout: doc
title: PLY - Python词法和语法分析器
permalink: /docs/thirdparty/ply/
category: thirdparty
tags: [编译器, 词法分析, 语法分析, 解析器, DSL]
description: PLY是一个纯Python实现的词法分析器(Lex)和语法分析器(Yacc)工具，用于创建编程语言解析器
author: Python技术文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "高级"
---

# PLY - Python词法和语法分析器

## 📝 概述

Python-PLY（Python Lex-Yacc）是一个纯Python实现的词法分析器（Lex）和语法分析器（Yacc）工具。它用于创建编程语言的解析器，可以帮助你定义和解析自定义的语法和文法规则。PLY是基于Unix工具lex和yacc的Python实现，广泛用于编译器构建、DSL（领域特定语言）设计和其他需要解析文本的应用。

## 🎯 学习目标

- 理解词法分析和语法分析的基本概念
- 掌握PLY的基本使用方法和工作原理
- 学会定义词法规则和语法规则
- 能够构建简单的解析器和计算器
- 了解PLY在实际项目中的应用场景

## 📋 前置知识

- Python基础语法和正则表达式
- 编译原理基本概念（词法分析、语法分析）
- 上下文无关文法的基本知识
- 函数和装饰器的使用

## 🔍 详细内容

### 基本概念

PLY包含两个主要模块：
- **lex.py**：用于词法分析（Lexical Analysis），将输入文本分解为标记（tokens）
- **yacc.py**：用于语法分析（Syntax Analysis），将标记流解析为抽象语法树（AST）或其他结构

### 安装方法

```bash
# 使用pip安装PLY
pip install ply
```

### 词法分析（Lex）

#### 基本词法分析器定义

```python
import ply.lex as lex

# 定义标记列表
tokens = (
    'NUMBER',
    'PLUS',
    'MINUS',
    'TIMES',
    'DIVIDE',
    'LPAREN',
    'RPAREN',
)

# 定义标记的正则表达式规则
t_PLUS = r'\+'
t_MINUS = r'-'
t_TIMES = r'\*'
t_DIVIDE = r'/'
t_LPAREN = r'\('
t_RPAREN = r'\)'

# 定义NUMBER标记的正则表达式规则
def t_NUMBER(t):
    r'\d+'
    t.value = int(t.value)
    return t

# 定义忽略的字符（如空格和制表符）
t_ignore = ' \t'

# 定义处理换行符的规则
def t_newline(t):
    r'\n+'
    t.lexer.lineno += len(t.value)

# 定义错误处理规则
def t_error(t):
    print(f"Illegal character '{t.value[0]}'")
    t.lexer.skip(1)

# 构建词法分析器
lexer = lex.lex()
```

#### 测试词法分析器

```python
# 输入文本
data = '3 + 4 * (10 - 5)'

# 给词法分析器输入数据
lexer.input(data)

# 循环获取标记
while True:
    tok = lexer.token()
    if not tok:
        break
    print(tok)
```

输出结果：
```
LexToken(NUMBER, 3, 1, 0)
LexToken(PLUS, '+', 1, 2)
LexToken(NUMBER, 4, 1, 4)
LexToken(TIMES, '*', 1, 6)
LexToken(LPAREN, '(', 1, 8)
LexToken(NUMBER, 10, 1, 9)
LexToken(MINUS, '-', 1, 11)
LexToken(NUMBER, 5, 1, 13)
LexToken(RPAREN, ')', 1, 14)
```

### 语法分析（Yacc）

#### 基本语法分析器定义

```python
import ply.yacc as yacc

# 定义运算符优先级
precedence = (
    ('left', 'PLUS', 'MINUS'),
    ('left', 'TIMES', 'DIVIDE'),
    ('right', 'UMINUS'),
)

# 定义文法规则
def p_expression_plus(p):
    'expression : expression PLUS term'
    p[0] = p[1] + p[3]

def p_expression_minus(p):
    'expression : expression MINUS term'
    p[0] = p[1] - p[3]

def p_expression_term(p):
    'expression : term'
    p[0] = p[1]

def p_term_times(p):
    'term : term TIMES factor'
    p[0] = p[1] * p[3]

def p_term_divide(p):
    'term : term DIVIDE factor'
    p[0] = p[1] / p[3]

def p_term_factor(p):
    'term : factor'
    p[0] = p[1]

def p_factor_num(p):
    'factor : NUMBER'
    p[0] = p[1]

def p_factor_expr(p):
    'factor : LPAREN expression RPAREN'
    p[0] = p[2]

def p_error(p):
    print(f"Syntax error at '{p.value}'")

# 构建语法分析器
parser = yacc.yacc()
```

### 语法规则参数说明

| 参数 | 类型 | 说明 |
|------|------|------|
| p[0] | 任意 | 规则左边的非终结符的值 |
| p[1] | 任意 | 规则右边第一个符号的值 |
| p[2] | 任意 | 规则右边第二个符号的值 |
| p[n] | 任意 | 规则右边第n个符号的值 |

### 优先级说明

| 优先级类型 | 说明 |
|------------|------|
| left | 左结合 |
| right | 右结合 |
| nonassoc | 非结合 |

## 💡 实际应用

### 基础用法 - 完整计算器

```python
import ply.lex as lex
import ply.yacc as yacc

# Token定义
tokens = (
    'NUMBER',
    'PLUS',
    'MINUS',
    'TIMES',
    'DIVIDE',
    'LPAREN',
    'RPAREN',
)

# 词法规则
t_PLUS = r'\+'
t_MINUS = r'-'
t_TIMES = r'\*'
t_DIVIDE = r'/'
t_LPAREN = r'\('
t_RPAREN = r'\)'

def t_NUMBER(t):
    r'\d+'
    t.value = int(t.value)
    return t

t_ignore = ' \t'

def t_newline(t):
    r'\n+'
    t.lexer.lineno += len(t.value)

def t_error(t):
    print(f"Illegal character '{t.value[0]}'")
    t.lexer.skip(1)

# 构建词法分析器
lexer = lex.lex()

# 语法规则
def p_expression_plus(p):
    'expression : expression PLUS term'
    p[0] = p[1] + p[3]

def p_expression_minus(p):
    'expression : expression MINUS term'
    p[0] = p[1] - p[3]

def p_expression_term(p):
    'expression : term'
    p[0] = p[1]

def p_term_times(p):
    'term : term TIMES factor'
    p[0] = p[1] * p[3]

def p_term_divide(p):
    'term : term DIVIDE factor'
    p[0] = p[1] / p[3]

def p_term_factor(p):
    'term : factor'
    p[0] = p[1]

def p_factor_num(p):
    'factor : NUMBER'
    p[0] = p[1]

def p_factor_expr(p):
    'factor : LPAREN expression RPAREN'
    p[0] = p[2]

def p_error(p):
    print(f"Syntax error at '{p.value}'")

# 定义运算符优先级
precedence = (
    ('left', 'PLUS', 'MINUS'),
    ('left', 'TIMES', 'DIVIDE'),
    ('right', 'UMINUS'),
)

# 构建语法分析器
parser = yacc.yacc()

# 测试
if __name__ == '__main__':
    data = '3 + 4 * (10 - 5)'
    result = parser.parse(data)
    print(f"计算结果: {result}")  # 输出: 23
```

### 高级用法 - 支持变量和函数

```python
# 添加变量支持
symbol_table = {}

tokens += ('ID', 'EQUALS')

def t_ID(t):
    r'[a-zA-Z_][a-zA-Z0-9_]*'
    return t

t_EQUALS = r'='

def p_statement_assign(p):
    'statement : ID EQUALS expression'
    symbol_table[p[1]] = p[3]

def p_statement_expr(p):
    'statement : expression'
    print(p[1])

def p_expression_id(p):
    'expression : ID'
    try:
        p[0] = symbol_table[p[1]]
    except KeyError:
        print(f"Undefined name '{p[1]}'")
        p[0] = 0
```

### 实际案例 - DSL语言解析器

```python
# 简单的配置文件解析器
def create_config_parser():
    """创建配置文件解析器"""
    
    tokens = ('NAME', 'VALUE', 'SECTION', 'LBRACKET', 'RBRACKET', 'EQUALS')
    
    def t_SECTION(t):
        r'\[[^\]]+\]'
        t.value = t.value[1:-1]  # 去掉方括号
        return t
    
    def t_NAME(t):
        r'[a-zA-Z_][a-zA-Z0-9_]*'
        return t
    
    def t_VALUE(t):
        r'"[^"]*"|\'[^\']*\'|\S+'
        if t.value.startswith('"') or t.value.startswith("'"):
            t.value = t.value[1:-1]  # 去掉引号
        return t
    
    t_EQUALS = r'='
    t_ignore = ' \t'
    
    def t_newline(t):
        r'\n+'
        t.lexer.lineno += len(t.value)
    
    def t_error(t):
        print(f"Illegal character '{t.value[0]}'")
        t.lexer.skip(1)
    
    return lex.lex()

# JSON解析器示例
def create_json_parser():
    """创建简单的JSON解析器"""
    
    tokens = (
        'NUMBER', 'STRING', 'TRUE', 'FALSE', 'NULL',
        'LBRACE', 'RBRACE', 'LBRACKET', 'RBRACKET',
        'COMMA', 'COLON'
    )
    
    def t_NUMBER(t):
        r'-?\d+(\.\d+)?([eE][+-]?\d+)?'
        if '.' in t.value or 'e' in t.value or 'E' in t.value:
            t.value = float(t.value)
        else:
            t.value = int(t.value)
        return t
    
    def t_STRING(t):
        r'"([^"\\]|\\.)*"'
        t.value = t.value[1:-1]  # 去掉引号
        return t
    
    t_TRUE = r'true'
    t_FALSE = r'false'
    t_NULL = r'null'
    t_LBRACE = r'\{'
    t_RBRACE = r'\}'
    t_LBRACKET = r'\['
    t_RBRACKET = r'\]'
    t_COMMA = r','
    t_COLON = r':'
    
    t_ignore = ' \t\n'
    
    def t_error(t):
        print(f"Illegal character '{t.value[0]}'")
        t.lexer.skip(1)
    
    return lex.lex()
```

## ⚠️ 注意事项

- **性能考虑**：PLY是纯Python实现，性能可能不如C语言实现的lex和yacc
- **复杂性管理**：对于非常复杂的语法，PLY的规则可能会变得难以管理
- **调试困难**：语法错误的调试可能比较困难，需要仔细检查文法规则
- **文件生成**：PLY会生成parser.out和parsetab.py文件，需要适当管理
- **规则冲突**：注意移进/归约冲突和归约/归约冲突的处理

## 🔗 相关内容

- [正则表达式 - re](../../stdlib/re/)
- [字符串处理 - str](../../builtins/str/)
- [文本解析 - textwrap](../../stdlib/textwrap/)
- [AST抽象语法树 - ast](https://docs.python.org/3/library/ast.html)

## 📚 扩展阅读

- [PLY官方文档](http://www.dabeaz.com/ply/)
- [编译原理基础教程](https://en.wikipedia.org/wiki/Compiler)
- [Python AST模块文档](https://docs.python.org/3/library/ast.html)
- [其他Python解析库对比](https://github.com/topics/parser-python)

## 📎 原始文档（完整迁移）

一、例子

```python
# Example of parsing with PLY

from ply.lex import lex
from ply.yacc import yacc

# Token list
tokens = [ 'NUM', 'PLUS', 'MINUS', 'TIMES', 'DIVIDE', 'LPAREN', 'RPAREN' ]

# Ignored characters

t_ignore = ' \t\n'

# Token specifications (as regexs)
t_PLUS   = r'\+'
t_MINUS  = r'-'
t_TIMES  = r'\*'
t_DIVIDE = r'/'
t_LPAREN = r'\('
t_RPAREN = r'\)'

# Token processing functions
def t_NUM(t):
    r'\d+'
    t.value = int(t.value)
    return t

# Error handler
def t_error(t):
    print('Bad character: {!r}'.format(t.value[0]))
    t.skip(1)

# Build the lexer
lexer = lex()

# Grammar rules and handler functions
def p_expr(p):
    '''
    expr : expr PLUS term
         | expr MINUS term
    '''
    if p[2] == '+':
        p[0] = p[1] + p[3]
    elif p[2] == '-':
        p[0] = p[1] - p[3]

def p_expr_term(p):
    '''
    expr : term
    '''
    p[0] = p[1]

def p_term(p):
    '''
    term : term TIMES factor
         | term DIVIDE factor
    '''
    if p[2] == '*':
        p[0] = p[1] * p[3]
    elif p[2] == '/':
        p[0] = p[1] / p[3]

def p_term_factor(p):
    '''
    term : factor
    '''
    p[0] = p[1]

def p_factor(p):
    '''
    factor : NUM
    '''
    p[0] = p[1]

def p_factor_group(p):
    '''
    factor : LPAREN expr RPAREN
    '''
    p[0] = p[2]

def p_error(p):
    print('Syntax error')

parser = yacc()

if __name__ == '__main__':
    print(parser.parse('2'))
    print(parser.parse('2+3'))
    print(parser.parse('2+(3+4)*5'))

```

**Python-PLY（Python Lex-Yacc）** 是一个纯Python实现的词法分析器（Lex）和语法分析器（Yacc）工具。它用于创建编程语言的解析器，可以帮助你定义和解析自定义的语法和文法规则。PLY 是基于 Unix 工具 **lex** 和 **yacc** 的 Python 实现，广泛用于编译器构建、DSL（领域特定语言）设计和其他需要解析文本的应用。

---

## 1. PLY 的基本概念

PLY 包含两个主要模块：
- **lex.py**：用于词法分析（Lexical Analysis），将输入文本分解为标记（tokens）。
- **yacc.py**：用于语法分析（Syntax Analysis），将标记流解析为抽象语法树（AST）或其他结构。

---

## 2. 安装 PLY

你可以通过 pip 安装 PLY：

```bash
pip install ply
```

---

## 3. 词法分析（Lex）

词法分析是将输入文本分解为标记（tokens）的过程。以下是一个简单的词法分析器示例：

### 3.1 定义标记（Tokens）

```python
import ply.lex as lex

# 定义标记列表
tokens = (
    'NUMBER',
    'PLUS',
    'MINUS',
    'TIMES',
    'DIVIDE',
    'LPAREN',
    'RPAREN',
)

# 定义标记的正则表达式规则
t_PLUS = r'\+'
t_MINUS = r'-'
t_TIMES = r'\*'
t_DIVIDE = r'/'
t_LPAREN = r'\('
t_RPAREN = r'\)'

# 定义 NUMBER 标记的正则表达式规则
def t_NUMBER(t):
    r'\d+'
    t.value = int(t.value)
    return t

# 定义忽略的字符（如空格和制表符）
t_ignore = ' \t'

# 定义处理换行符的规则
def t_newline(t):
    r'\n+'
    t.lexer.lineno += len(t.value)

# 定义错误处理规则
def t_error(t):
    print(f"Illegal character '{t.value[0]}'")
    t.lexer.skip(1)

# 构建词法分析器
lexer = lex.lex()
```

### 3.2 测试词法分析器

```python
# 输入文本
data = '3 + 4 * (10 - 5)'

# 给词法分析器输入数据
lexer.input(data)

# 循环获取标记
while True:
    tok = lexer.token()
    if not tok:
        break
    print(tok)
```

输出：
```
LexToken(NUMBER, 3, 1, 0)
LexToken(PLUS, '+', 1, 2)
LexToken(NUMBER, 4, 1, 4)
LexToken(TIMES, '*', 1, 6)
LexToken(LPAREN, '(', 1, 8)
LexToken(NUMBER, 10, 1, 9)
LexToken(MINUS, '-', 1, 11)
LexToken(NUMBER, 5, 1, 13)
LexToken(RPAREN, ')', 1, 14)
```

---

## 4. 语法分析（Yacc）

语法分析是将标记流解析为抽象语法树（AST）或其他结构的过程。以下是一个简单的语法分析器示例：

### 4.1 定义文法规则

```python
import ply.yacc as yacc

# 定义运算符优先级
precedence = (
    ('left', 'PLUS', 'MINUS'),
    ('left', 'TIMES', 'DIVIDE'),
    ('right', 'UMINUS'),
)

# 定义文法规则
def p_expression_plus(p):
    'expression : expression PLUS term'
    p[0] = p[1] + p[3]

def p_expression_minus(p):
    'expression : expression MINUS term'
    p[0] = p[1] - p[3]

def p_expression_term(p):
    'expression : term'
    p[0] = p[1]

def p_term_times(p):
    'term : term TIMES factor'
    p[0] = p[1] * p[3]

def p_term_divide(p):
    'term : term DIVIDE factor'
    p[0] = p[1] / p[3]

def p_term_factor(p):
    'term : factor'
    p[0] = p[1]

def p_factor_num(p):
    'factor : NUMBER'
    p[0] = p[1]

def p_factor_expr(p):
    'factor : LPAREN expression RPAREN'
    p[0] = p[2]

def p_error(p):
    print(f"Syntax error at '{p.value}'")

# 构建语法分析器
parser = yacc.yacc()
```

### 4.2 测试语法分析器

```python
# 解析输入文本
result = parser.parse(data)
print("Result:", result)
```

输出：
```
Result: 23
```

---

## 5. 完整示例：计算器

以下是一个完整的计算器示例，支持加减乘除和括号：

```python
import ply.lex as lex
import ply.yacc as yacc

# 定义标记
tokens = (
    'NUMBER',
    'PLUS',
    'MINUS',
    'TIMES',
    'DIVIDE',
    'LPAREN',
    'RPAREN',
)

# 定义标记的正则表达式规则
t_PLUS = r'\+'
t_MINUS = r'-'
t_TIMES = r'\*'
t_DIVIDE = r'/'
t_LPAREN = r'\('
t_RPAREN = r'\)'

def t_NUMBER(t):
    r'\d+'
    t.value = int(t.value)
    return t

t_ignore = ' \t'

def t_newline(t):
    r'\n+'
    t.lexer.lineno += len(t.value)

def t_error(t):
    print(f"Illegal character '{t.value[0]}'")
    t.lexer.skip(1)

# 构建词法分析器
lexer = lex.lex()

# 定义文法规则
def p_expression_plus(p):
    'expression : expression PLUS term'
    p[0] = p[1] + p[3]

def p_expression_minus(p):
    'expression : expression MINUS term'
    p[0] = p[1] - p[3]

def p_expression_term(p):
    'expression : term'
    p[0] = p[1]

def p_term_times(p):
    'term : term TIMES factor'
    p[0] = p[1] * p[3]

def p_term_divide(p):
    'term : term DIVIDE factor'
    p[0] = p[1] / p[3]

def p_term_factor(p):
    'term : factor'
    p[0] = p[1]

def p_factor_num(p):
    'factor : NUMBER'
    p[0] = p[1]

def p_factor_expr(p):
    'factor : LPAREN expression RPAREN'
    p[0] = p[2]

def p_error(p):
    print(f"Syntax error at '{p.value}'")

# 定义运算符优先级
precedence = (
    ('left', 'PLUS', 'MINUS'),
    ('left', 'TIMES', 'DIVIDE'),
    ('right', 'UMINUS'),
)

# 构建语法分析器
parser = yacc.yacc()

# 测试
data = '3 + 4 * (10 - 5)'
result = parser.parse(data)
print("Result:", result)
```

输出：
```
Result: 23
```

---

## 6. 高级用法

### 6.1 处理负数

为了支持负数，你需要添加一个规则来处理一元减号（UMINUS）：

```python
def p_factor_minus(p):
    'factor : MINUS factor %prec UMINUS'
    p[0] = -p[2]
```

### 6.2 添加变量和函数

你可以扩展 PLY 来支持变量和函数。例如，添加一个符号表来存储变量：

```python
symbol_table = {}

def p_expression_id(p):
    'expression : ID'
    p[0] = symbol_table[p[1]]

def p_expression_assign(p):
    'expression : ID EQUALS expression'
    symbol_table[p[1]] = p[3]

tokens += ('ID', 'EQUALS')

def t_ID(t):
    r'[a-zA-Z_][a-zA-Z0-9_]*'
    return t

t_EQUALS = r'='

# 更新文法规则
def p_statement_assign(p):
    'statement : ID EQUALS expression'
    symbol_table[p[1]] = p[3]

def p_statement_expr(p):
    'statement : expression'
    print(p[1])
```

---

## 7. PLY 的优点

- **纯 Python 实现**：无需依赖外部工具，如 lex 和 yacc。
- **易于使用**：提供简单的 API 来定义词法和语法规则。
- **灵活性**：可以轻松扩展以支持复杂的语法和语义规则。
- **调试支持**：提供调试工具来帮助诊断词法和语法错误。

---

## 8. PLY 的缺点

- **性能**：由于 PLY 是纯 Python 实现，其性能可能不如 C 语言实现的 lex 和 yacc。
- **复杂性**：对于非常复杂的语法，PLY 的规则可能会变得难以管理。

---

## 9. 实际应用

PLY 广泛用于以下场景：
- 编程语言的解析器。
- DSL（领域特定语言）的设计。
- 配置文件的解析。
- 数据格式的解析（如 JSON、XML 的子集）。

---

## 10. 其他工具

除了 PLY，还有其他 Python 解析工具：
- **PyParsing**：一个纯 Python 的解析库，不需要生成器。
- **ANTLR**：一个强大的解析器生成器，支持多种语言。
- **Lark**：一个现代的解析库，支持上下文无关文法（CFG）和 Earley 解析算法。

---

## 11. 总结

PLY 是一个强大的工具，可以帮助你构建自定义的解析器。通过定义词法和语法规则，你可以解析和处理各种文本格式。如果你需要构建一个简单的解析器，PLY 是一个不错的选择。如果你有其他问题或需要进一步的帮助，请告诉我！


二、涉及

-----ply-----

参考地址：https://www.cnblogs.com/LiuRunky/p/Python_Ply_Tutorial.html

参考地址：https://blog.csdn.net/feixiaoxing/article/details/79123776

## 🏷️ 标签

`ply` `词法分析` `语法分析` `编译器` `DSL` `解析器`

---

**最后更新**: 2024-01-15  
**作者**: Python技术文档工程师  
**版本**: 1.0