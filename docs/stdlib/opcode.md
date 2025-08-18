---
layout: doc
title: opcode 模块 - Python 操作码与字节码分析
permalink: /docs/stdlib/opcode/
category: stdlib
tags: [opcode, 字节码, 虚拟机, dis, 编译器, 性能优化]
description: Python opcode 模块详解，提供操作码和字节码分析工具，用于理解Python虚拟机的内部工作机制和性能优化
author: Python 文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "高级"
---

# opcode 模块 - Python 操作码与字节码分析

## 📝 概述

opcode 模块是 Python 标准库中用于操作码分析的核心模块。操作码（opcode，operation code）是将 Python 源代码编译后的中间表示形式，Python 虚拟机无法直接执行人类可读的源代码，因此 Python 编译器首先将源代码编译成操作码序列。理解操作码对于深入了解 Python 的执行机制、性能优化和调试具有重要意义。

## 🎯 学习目标

- 掌握操作码的基本概念和 Python 编译过程
- 学会使用 dis 模块分析和理解字节码
- 理解 PyCodeObject 对象的结构和作用
- 掌握操作码的执行流程和栈操作机制
- 了解 Python 编译器的窥孔优化技术
- 学会使用 opcode 模块进行代码分析和优化

## 📋 前置知识

- Python 基本语法和面向对象编程
- 计算机体系结构和汇编语言基础
- 栈数据结构的概念和操作
- Python 编译和执行过程的基本了解
- 二进制和十六进制数制转换

## 🔍 详细内容

### 什么是opcode

opcode又称为操作码，是将python源代码进行编译之后的结果，python虚拟机无法直接执行human-readable的源代码，因此python编译器第一步先将源代码进行编译，以此得到opcode。例如在执行python程序时一般会先生成一个pyc文件，pyc文件就是编译后的结果，其中含有opcode序列。

### opcode初见

dis是python提供的对操作码进行分析的内置模块，下面由一个简单的示例程序来认识opcode:

```python
import dis

def func():
    a = 10
    b = 20
    c = a + b
    return c

dis.dis(func)
```

结果输出内容如下，其中LOAD_CONST，STORE_FAST，BINARY_ADD即是我们提到的opcode，python是基于栈的语言，LOAD_CONST是将常量进行压栈，STORE_FAST是将栈顶元素赋值给参数指定的变量。python 2.7版中共计定义了约110个操作码，其中90以上的操作码需要参数，操作码定义参见 [opcode.h](https://www.jianshu.com/p/f540e540f940)。

```
  2           0 LOAD_CONST               1 (10)
              3 STORE_FAST               0 (a)

  3           6 LOAD_CONST               2 (20)
              9 STORE_FAST               1 (b)

  4          12 LOAD_FAST                0 (a)
             15 LOAD_FAST                1 (b)
             18 BINARY_ADD
             19 STORE_FAST               2 (c)

  5          22 LOAD_FAST                2 (c)
             25 RETURN_VALUE
```

### PyCodeObject 详解

在解释opcode在python虚拟机的行为之前来认识一下PyCodeObject，python代码在编译完成后在内存中的对象称为PyCodeObject，PyCodeObject的C定义（python底层基于C语言）如下：

```c
typedef struct {
    PyObject_HEAD
    int co_argcount;             /* #arguments, except *args */
    int co_kwonlyargcount;       /* #keyword only arguments */
    int co_nlocals;              /* #local variables */
    int co_stacksize;            /* #entries needed for evaluation stack */
    int co_flags;                /* CO_..., see below */
    PyObject *co_code;           /* instruction opcodes */
    PyObject *co_consts;         /* list (constants used) */
    PyObject *co_names;          /* list of strings (names used) */
    PyObject *co_varnames;       /* tuple of strings (local variable names) */
    PyObject *co_freevars;       /* tuple of strings (free variable names) */
    PyObject *co_cellvars;       /* tuple of strings (cell variable names) */
    /* The rest doesn't count for hash or comparisons */
    unsigned char *co_cell2arg;  /* Maps cell vars which are arguments. */
    PyObject *co_filename;       /* unicode (where it was loaded from) */
    PyObject *co_name;           /* unicode (name, for reference) */
    int co_firstlineno;          /* first source line number */
    PyObject *co_lnotab;         /* string (encoding addr<->lineno mapping) See
                                    Objects/lnotab_notes.txt for details. */
    void *co_zombieframe;        /* for optimization only (see frameobject.c) */
    PyObject *co_weakreflist;    /* to support weakrefs to code objects */
} PyCodeObject;
```

其中这里面我们关心co_consts和co_names两个列表，第一个存放了所有的常量，第二存放了所有的变量，因此有下面的结论。

> - LOAD_CONST 0 表示将co_consts中的第0个（下标0）放入栈中。
> - STORE_FAST 0  表示将栈顶元素赋值给co_names中存放的第0个元素。

有了上面的知识很容易理解出下面操作码序列所表示的内容 c=a+b:

```
             12 LOAD_FAST                0 (a)
             15 LOAD_FAST                1 (b)
             18 BINARY_ADD
             19 STORE_FAST               2 (c)
```

### 字节码存储与解析

co_code中存储了操作码序列，编译好的操作码以二进制的方式进行存储，co_code = [opcode][args{0,1}]+ 的形式，其中opcode占用一个byte，编号90以下的操作码不需要参数，90及以上的操作码需要两个byte的args，下面是func函数编译之后得到的PyCodeObject信息，这里 [PythonCodeObjectParser](https://github.com/yukunxie/PythonCodeObjectParser/blob/master/codeparser.py) 提供了一个PyCodeObject的查看工具。

```xml
        <item idx="0" name="func" type="codeobject">
            <co_consts count="3">
                <item idx="0">None</item>
                <item idx="1">10</item>
                <item idx="2">20</item>
            </co_consts>
            <co_names count="0"/>
            <co_varnames count="3">
                <name idx="0">a</name>
                <name idx="1">b</name>
                <name idx="2">c</name>
            </co_varnames>
            <co_cellvars count="0"/>
            <co_freevars count="0"/>
            <co_filename>code.py</co_filename>
            <co_ename>func</co_ename>
            <co_nlocals>3</co_nlocals>
            <co_stacksize>2</co_stacksize>
            <co_argcount>0</co_argcount>
            <co_code>6401007d00006402007d01007c00007c0100177d02007c020053</co_code>
        </item>
```

#### 字节码解析过程

1. 再看由16进制表示的co_code序列，第一个Byte是0x64，是LOAD_CONST的操作码，由于LOAD_CONST含有参数，后面两个字节表示了LOAD_CONST的参数0100，由于使用big-endian的编码方式，因此0100就是1，而co_consts[1] 中存储的就是10。

2. 再往后一个opcode是7d=125，指的是STORE_FAST的操作码，同样STORE_FAST后面需要一个参数（0000=0）,即将栈顶值赋值给co_names存储的第0个元素(即a)，至此完成了a = 10指令的处理。同理，后面6402007d0100即完成了b=20的操作。

3. 完成两个赋值操作之后，紧接着是7c00007c0100，7C对应的操作码是LOAD_FAST，0000和0100分别是LOAD_FAST的参数，即从co_names中读取相应的两个元素压入栈中。

4. 然后是指令0x17=23，表示操作码BINARY_ADD，由于23<90，因此BINARY_ADD不需要参数，该指令直接将栈顶的两个元素进行相加，并将两个元素出栈后再将结果放入栈顶。

5. 接着是指令0x7d,即STORE_FAST，后面的参数为0200，对应co_names[2]表示的变量c，至此完成对c的赋值。

6. 接着是0x7c0200，根据前面的内容可以知道是将co_names[2]压入栈中。

7. 最后0x53=83是RETURN_VALUE的操作码，由于小于90，因此也不需要操作，RETURN_VALUE只是将栈顶元素弹出，然后标记函数返回。

## 💡 实际应用

### 关于优化

python的目标不是一个性能高效的语言，出于脚本动态类型的原因虚拟机做了大量计算来判断一个变量的当前类型，并且整个python虚拟机是基于栈逻辑的，频繁的压栈出栈操作也需要大量计算。动态类型变化导致python的性能优化非常困难，尽管如此python在编译阶段还是在操作码层做了简单的peephole(窥孔优化)。窥孔优化的原理比较简单，详情可以参见 [Peephole optimization](https://en.wikipedia.org/wiki/Peephole_optimization)。这里举一个tuple相关的优化，更多的peephole相关的优化这里不作深入讨论。

```python
import dis

# 优化示例
a = (1, 2, 3, 4)
dis.dis(lambda: (1, 2, 3, 4))
```

优化后的结果是：

```
  2           0 LOAD_CONST               5 ((1, 2, 3, 4))
              3 STORE_FAST               0 (a)
              6 LOAD_CONST               0 (None)
              9 RETURN_VALUE
```

优化前的结果是：

```
  2           0 LOAD_CONST               1 (1)
              3 LOAD_CONST               2 (2)
              6 LOAD_CONST               3 (3)
              9 LOAD_CONST               4 (4)
             12 BUILD_TUPLE              4
             15 STORE_FAST               0 (a)
             18 LOAD_CONST               0 (None)
             21 RETURN_VALUE
```

对比优化前后的结果可以发现，优化后明显减少了指令的数量，Peephole优化只能对tuple进行优化，而对dict和list则无法进行优化，因为tuple属于在运行时不会发生变化的结构，可以存储于co_consts中，而list和dict则在运行时可以被更改，无法存储于co_consts中。

### opcode 模块的方法和属性

opcode共有11个方法/函数/属性，以下是常用的功能：

1. **opcode.opmap** - 操作码名称到数字的映射，31个项目使用
2. **opcode.opname** - 操作码数字到名称的映射，18个项目使用
3. **opcode.HAVE_ARGUMENT** - 标识需要参数的操作码阈值，15个项目使用
4. **opcode.EXTENDED_ARG** - 扩展参数操作码，11个项目使用
5. **opcode.hasname()** - 操作全局名称的操作码集合，9个项目使用
6. **opcode.haslocal()** - 操作局部变量的操作码集合，9个项目使用
7. **opcode.cmp_op** - 比较操作符列表，6个项目使用
8. **opcode.hasconst()** - 操作常量的操作码集合，5个项目使用
9. **opcode.hasfree()** - 操作自由变量的操作码集合，5个项目使用
10. **opcode.hascompare()** - 比较操作的操作码集合，5个项目使用
11. **opcode.hasjrel()** - 相对跳转操作的操作码集合，5个项目使用

### opcode.opmap 使用示例

```python
# 需要导入模块: import opcode [as 别名]
# 或者: from opcode import opmap [as 别名]
def co_code_findloadednames(co):
    """Find in the code of a code object, all loaded names.
    (by LOAD_NAME, LOAD_GLOBAL or LOAD_FAST) """

    import dis
    from opcode import HAVE_ARGUMENT, opmap
    hasloadname = (opmap['LOAD_NAME'],
                   opmap['LOAD_GLOBAL'], opmap['LOAD_FAST'])
    insns = dis.get_instructions(co)
    len_co_names = len(co.co_names)
    indexset = {}
    for insn in insns:
        if insn.opcode >= HAVE_ARGUMENT:
            if insn.opcode in hasloadname:
                indexset[insn.argval] = 1
                if len(indexset) >= len_co_names:
                    break
    for name in co.co_varnames:
        try:
            del indexset[name]
        except KeyError:
            pass
    return indexset 
```

### opcode.opname 使用示例

```python
# 需要导入模块: import opcode [as 别名]
# 或者: from opcode import opname [as 别名]
def common_instructions(profile):
    """Returns the most common opcodes in order of descending frequency.

    The result is a list of tuples of the form
      (opcode, opname, # of occurrences)

    """
    if has_pairs(profile) and profile:
        inst_list = profile[-1]
    else:
        inst_list = profile
    result = [(op, opcode.opname[op], count)
              for op, count in enumerate(inst_list)
              if count > 0]
    result.sort(key=operator.itemgetter(2), reverse=True)
    return result 
```

### 实际分析案例

```python
import dis
import opcode

def analyze_function(func):
    """分析函数的字节码"""
    print(f"分析函数: {func.__name__}")
    print("=" * 40)
    
    # 显示字节码
    dis.dis(func)
    
    # 获取代码对象
    code_obj = func.__code__
    
    print(f"\n常量表: {code_obj.co_consts}")
    print(f"变量名: {code_obj.co_varnames}")
    print(f"全局名: {code_obj.co_names}")
    print(f"栈大小: {code_obj.co_stacksize}")
    
    # 分析指令
    instructions = list(dis.get_instructions(func))
    print(f"\n总指令数: {len(instructions)}")
    
    opcode_count = {}
    for instr in instructions:
        opcode_count[instr.opname] = opcode_count.get(instr.opname, 0) + 1
    
    print("\n操作码统计:")
    for opname, count in sorted(opcode_count.items()):
        print(f"  {opname}: {count}")

# 测试函数
def example_func(x, y):
    """示例函数用于分析"""
    if x > y:
        result = x * 2
    else:
        result = y * 2
    return result + 1

# 分析函数
analyze_function(example_func)
```

## ⚠️ 注意事项

- **版本差异**：不同Python版本的操作码可能有所不同，建议查阅对应版本的文档
- **性能影响**：直接操作字节码可能影响代码的可读性和维护性
- **调试用途**：opcode分析主要用于性能调优和学习Python内部机制
- **栈操作**：理解基于栈的虚拟机模型对分析字节码很重要
- **优化限制**：Python的动态特性限制了编译时优化的可能性

## 🔗 相关内容

- [inspect 模块 - 对象检查和反射功能](../inspect/)
- [compile() - 编译函数](../../builtins/compile/)
- [exec() - 执行代码对象](../../builtins/exec/)

## 📚 扩展阅读

- [Python 字节码官方文档](https://docs.python.org/3/library/dis.html)
- [CPython 内部实现](https://github.com/python/cpython)
- [Python 虚拟机设计](https://docs.python.org/3/reference/executionmodel.html)

## 🏷️ 标签

`opcode` `字节码` `虚拟机` `性能优化` `编译器` `dis`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档团队  
**版本**: 1.0