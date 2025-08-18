---
layout: doc
title: weakref 模块
permalink: /docs/stdlib/weakref/
category: stdlib
tags: [弱引用, 缓存, 垃圾回收, 对象生命周期, 代理, 字典]
description: Python weakref 模块详解——弱引用、代理、finalize 与基于弱引用的缓存（WeakValueDictionary/WeakKeyDictionary/WeakSet）
author: Python教程
date: 2025-08-14
updated: 2025-08-14
version: 1.0
difficulty: "中级"
---

# weakref 模块

## 📝 概述

weakref 模块提供“弱引用”（weak reference）支持。弱引用不会增加对象的引用计数，因此当对象只被弱引用持有时，仍可被垃圾回收器回收。它常用于构建缓存、避免循环引用导致的内存泄露、以及对对象生命周期进行观察与回调（finalize）。weakref 还提供基于弱引用的容器类型，如 WeakValueDictionary、WeakKeyDictionary 和 WeakSet。

与强引用不同，弱引用不保证对象存活；当目标对象被回收后，弱引用会变为“死亡引用”，返回 None 或在代理访问时报错。

## 🎯 学习目标

- 理解强引用与弱引用的区别，以及弱引用的使用动机
- 掌握 weakref 的核心 API：ref、proxy、finalize 与弱引用容器
- 能够使用 WeakValueDictionary/WeakKeyDictionary 实现自动失效的缓存
- 了解 finalize 的用法与 atexit 行为，正确处理资源回收回调
- 掌握常见陷阱：循环引用与 __del__、代理 ReferenceError、可弱引用对象的限制

## 📋 前置知识

- Python 对象模型与引用计数的基础概念
- 垃圾回收（gc）与循环引用的基本原理
- 类与属性、描述符与 property 的基本用法

## 🔍 详细内容

### 基本概念

- 强引用：普通变量绑定的引用，会增加对象引用计数，保证对象不被回收。
- 弱引用：不增加引用计数的引用句柄，不能单独阻止对象被回收。
- 循环引用问题：两个对象相互引用可能导致引用计数无法归零；若还实现了 __del__，gc 可能无法安全回收并将对象放入 gc.garbage。
- 解决思路：将其中一条边替换为弱引用，打破强引用环，或使用 weakref 的弱引用容器与回调机制管理生命周期。

### 核心 API 总览

- weakref.ref(obj, callback=None)：创建指向 obj 的弱引用，调用 r() 返回目标或 None。目标回收时执行回调，回调参数是弱引用对象本身。
- weakref.proxy(obj, callback=None)：创建 obj 的代理对象，像原对象一样使用；对象回收后访问代理会抛出 ReferenceError。
- weakref.finalize(obj, func, *args, **kwargs)：当 obj 被回收时调用 func。返回的 finalize 对象有属性 atexit 控制进程退出阶段是否兜底调用（默认 True）。
- 容器类型：
  - WeakValueDictionary：对“值”持弱引用，值不再被其他强引用持有时会自动从字典中移除。
  - WeakKeyDictionary：对“键”持弱引用，键不再被其他强引用持有时条目会自动移除。
  - WeakSet：对元素持弱引用，元素无强引用后自动从集合中消失。

### 语法与示例

#### 1. 通过弱引用打破循环引用

下面的示例展示父子节点的双向引用关系引发的循环引用问题，以及如何用 weakref.ref 打破强引用环：

```python
# -*- coding: utf-8 -*-
import weakref

class Node(object):
    def __init__(self, data):
        self.data = data
        self._parent = None
        self.children = []

    @property
    def parent(self):
        # _parent 保存的是 weakref.ref 对象，需要调用()解引用
        return None if self._parent is None else self._parent()

    @parent.setter
    def parent(self, node):
        # 目标对象被回收时触发回调
        self._parent = weakref.ref(node, lambda r: print('__del__', r))

    def add_child(self, child):
        self.children.append(child)
        child.parent = self

n1 = Node(0)
n2 = Node(2)
n1.add_child(n2)
# 删除 n1 后，如果 n2.parent 只是弱引用，n1 仍可被回收
# 输出示例: __del__ <weakref at 0x...; dead>
```

#### 2. 代理对象 proxy：像原对象一样使用

```python
import weakref

class Node:
    def __init__(self, data):
        self.data = data

n = Node(10)
p = weakref.proxy(n)  # 创建代理
print(p.data)          # 10，与 n.data 等价

# 当 n 被删除后再访问 p，会抛出 ReferenceError
# del n
# print(p.data)  # ReferenceError: weakly-referenced object no longer exists
```

#### 3. finalize：对象回收时执行回调

```python
import weakref

class ExpensiveObject:
    def __del__(self):
        print('(Deleting {})'.format(self))

def on_finalize(*args):
    print('on_finalize({!r})'.format(args))

obj = ExpensiveObject()
f = weakref.finalize(obj, on_finalize, 'extra argument')
# 可选：控制在进程退出阶段是否兜底调用
f.atexit = True

# 删除强引用后，obj 被回收时将调用 on_finalize
# del obj
```

注意：如果将被跟踪对象（obj）自身作为回调参数或保存在闭包中，可能无意中保留了强引用，导致对象无法回收；谨慎设计回调签名。

#### 4. 基于弱引用的缓存：WeakValueDictionary

```python
# 使用 WeakValueDictionary 让未被他处使用的缓存项自动过期
import weakref

class CachedSpamManager:
    def __init__(self):
        self._cache = weakref.WeakValueDictionary()

    def get_spam(self, name):
        if name not in self._cache:
            s = Spam(name)
            self._cache[name] = s
        return self._cache[name]

class Spam:
    def __init__(self, name):
        self.name = name

m = CachedSpamManager()
a = m.get_spam('foo')
b = m.get_spam('bar')
# 如果外部没有保存对某个 Spam 的强引用，对应缓存会在回收后自动移除
```

#### 5. WeakKeyDictionary 与 WeakSet 简述

- WeakKeyDictionary：常用于以对象作为键的映射（如实例元数据表），当键对象不再使用时，条目自动清理。
- WeakSet：集合元素以弱引用持有，元素对象生命周期结束即从集合淡出，无需手动删除。

### 参数说明（核心函数）

| 函数 | 关键参数 | 说明 |
|------|----------|------|
| weakref.ref(obj, callback=None) | obj, callback | 创建指向 obj 的弱引用；obj 回收时调用 callback(reference) |
| weakref.proxy(obj, callback=None) | obj, callback | 创建代理；目标回收后访问属性/方法会抛 ReferenceError |
| weakref.finalize(obj, func, *args, **kwargs) | obj, func | 关联回调；通过 f.atexit 控制进程退出时的兜底执行 |
| weakref.WeakValueDictionary() | — | 值以弱引用保存，值无强引用后自动剔除 |
| weakref.WeakKeyDictionary() | — | 键以弱引用保存，键无强引用后自动剔除 |
| weakref.WeakSet() | — | 元素以弱引用保存，元素无强引用后自动剔除 |

### 返回值

- ref 返回的弱引用对象可调用：r() → 目标或 None。
- proxy 返回的代理与目标接口一致，但在目标死亡后访问会抛 ReferenceError。
- finalize 返回的对象可控制 atexit 属性与是否已调用等状态。
- 弱引用容器的行为与对应内置容器类似，但元素/键/值的存在不阻止回收。

## 💡 实际应用

### 缓存与对象池
- 使用 WeakValueDictionary 维护对象缓存，避免长期占用内存；当外部不再使用对象时，缓存项自动清理。

### 观察对象生命周期
- 使用 weakref.ref 配合回调，或使用 finalize，在对象回收时执行清理逻辑（如关闭句柄、释放外部资源、更新监控指标）。

### 打破循环引用
- 在双向关系建模（如父子、图结构）中，将至少一侧改为弱引用，避免循环引用阻止回收。

## ⚠️ 注意事项

- 并非所有对象都支持弱引用：某些内建类型不支持；自定义类若使用 __slots__，需包含 "__weakref__" 槽位才可被弱引用。
- 使用 proxy 访问已被回收的对象会抛 ReferenceError，访问前需确保对象存活或捕获异常。
- 当类实现 __del__ 时，参与循环引用的对象可能无法被自动回收（进入 gc.garbage）；可通过弱引用设计或显式打破环。
- finalize 的回调若意外持有被跟踪对象的强引用（作为参数或闭包捕获），会阻止对象回收，谨慎设计回调签名与参数。

## 🔗 相关内容

- [collections 模块](./collections/) - 高级容器数据类型
- [functools 模块](./functools/) - 高阶函数与工具（与缓存策略常搭配）

## 📚 扩展阅读

- Python 官方文档 - weakref 模块: https://docs.python.org/3/library/weakref.html
- Python 官方文档 - 数据模型与垃圾回收: https://docs.python.org/3/reference/datamodel.html

## 🏷️ 标签

`弱引用` `缓存` `垃圾回收` `代理` `finalize` `WeakValueDictionary` `WeakKeyDictionary` `WeakSet`

---

## 原始文档内容参考

以下为迁移前的原始文档，完整保留了文本、代码与图片，便于对照与回溯。

一、例子

```python
import weakref

class CachedSpamManager:
    def __init__(self):
        self._cache = weakref.WeakValueDictionary()
    def get_spam(self, name):
        if name not in self._cache:
            s = Spam(name)
            self._cache[name] = s
        else:
            s = self._cache[name]
        return s
      
class Spam:
    def __init__(self, name):
        self.name = name

Spam.manager = CachedSpamManager()

def get_spam(name):
    return Spam.manager.get_spam(name)

if __name__ == '__main__':
    a = get_spam('foo')
    b = get_spam('bar')
    print('a is b:', a is b)
    c = get_spam('foo')
    print('a is c:', a is c)

```

二、模块

-----weakref-----

```
class Node(object):

    def __init__(self, data):
        self.data = data
        self.parent = None
        self.children = []

    def add_child(self, child):
        self.children.append(child)
        child.parent = self

    def __del__(self):
        print '__del__'

n = Node(0)
del n
# __del__
n1 = Node(1)
n2 = Node(2)
n1.add_child(n2)
del n1 # no output
n2.parent
# <__main__.Node at 0x7fd87ad5c250>


```

双亲节点的指针指向孩子节点，孩子节点又指向双亲节点。这构成了循环引用，所以每个对象的引用计数都不可能变成 0


我们可以手动使用 gc 模块来进行垃圾回收


```
import gc

gc.collect()


```

糟糕的是，我们这里循环引用的对象都实现了 __del__ 方法，gc 模块不会销毁这些对象，因为 gc 模块不知道应该先调用哪个对象的 __del__ 方法。gc模块会把这样的对象放到 gc.garbage 中，并不会销毁对象。


```
n1 = Node(1)
n2 = Node(2)
print n1, n2
# <__main__.Node object at 0x7f94109906d0> <__main__.Node object at 0x7f9410990610>
n1.add_child(n2)
del n1
del n2
gc.collect()
# 64
gc.garbage
# [<__main__.Node object at 0x7f94109906d0> <__main__.Node object at 0x7f9410990610>]


```

我们可以通过 weakref 来解决，如果一个对象只剩下一个弱引用，那么它是可以被垃圾回收的


```
import weakref

class Node(object):

    def __init__(self, data):
        self.data = data
        self._parent = None
        self.children = []

    @property
    def parent(self):
        return None if self._parent is None else self._parent()

    @parent.setter
    def parent(self, node):
        self._parent = weakref.ref(node, callback)

    def add_child(self, child):
        self.children.append(child)
        child.parent = self

def callback(ref):
    print '__del__', ref

n1 = Node(0)
n2 = Node(2)
print n1,n2
# <__main__.Node object at 0x7fb0c2750c10> <__main__.Node object at 0x7fb0c2750d10>
n1.add_child(n2)
del n1
# __del__ <weakref at 0x7fb0c26e75d0; dead>


```

不过，如果我们使用 weakref.ref() 创建弱引用，每次使用时都需要形如这样 xx() 来获取，有一点别扭。 可以通过 weakref.proxy() 这种来避免 () 操作。


```
n = Node(10)
p = weakref.proxy(n)
p.data
# 10
```

# 1. weakref对象的非永久引用

weakref模块支持对象的弱引用。正常的引用会增加对象的引用数，并避免它被垃圾回收。但结果并不总是如期望中的那样，比如有时可能会出现一个循环引用，或者有时需要内存时可能要删除对象的缓存。弱引用(weak reference)是一个不能避免对象被自动清理的对象句柄

### 1.1 引用

对象的弱引用要通过ref类来管理。要获取原对象，可以调用引用对象。

```python
import weakref
class ExpensiveObject:
    def __del__(self):
        print('(Deleting {})'.format(self))
obj = ExpensiveObject()
r = weakref.ref(obj)
print('obj:', obj)
print('ref:', r)
print('r():', r())
print('deleting obj')
del obj
print('r():', r())
```

在这里，由于obj在第二次调用引用之前已经被删除，所以ref返回None。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE81493c01554b6c69ae4b811972154f9c.png)

## 1.2 引用回调 

ref构造函数接受一个可选的回调函数，删除所引用的对象时会调用这个函数。

```python
import weakref
class ExpensiveObject:
    def __del__(self):
        print('(Deleting {})'.format(self))
def callback(reference):
    """Invoked when referenced object is deleted"""
    print('callback({!r})'.format(reference))
obj = ExpensiveObject()
r = weakref.ref(obj, callback)
print('obj:', obj)
print('ref:', r)
print('r():', r())
print('deleting obj')
del obj
print('r():', r())
```

当引用已经“死亡”而且不再引用原对象时，这个回调会接受这个引用对象作为参数。这个特性的一种用法就是从缓存中删除弱引用对象。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCEc6e49b1a3ef18d794a5251628d27f27e.png)

## 1.3 最终化对象

清理弱引用时要对资源完成更健壮的管理，可以使用finalize将回调与对象关联。finalize实例会一直保留(直到所关联的对象被删除) ，即使应用并没有保留最终化对象的引用。

```python
import weakref
class ExpensiveObject:
    def __del__(self):
        print('(Deleting {})'.format(self))
def on_finalize(*args):
    print('on_finalize({!r})'.format(args))
obj = ExpensiveObject()
weakref.finalize(obj, on_finalize, 'extra argument')
del obj
```

finalize的参数包括要跟踪的对象，对象被垃圾回收时要调用的callable，以及传入这个callable的所有位置或命名参数。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCEd24a08d573e33f7e54a1963167ad10cc.png)

这个finalize实例有一个可写属性atexit，用来控制程序退出时是否调用这个回调(如果还未调用)。 

```python
import sys
import weakref
class ExpensiveObject:
    def __del__(self):
        print('(Deleting {})'.format(self))
def on_finalize(*args):
    print('on_finalize({!r})'.format(args))
obj = ExpensiveObject()
f = weakref.finalize(obj, on_finalize, 'extra argument')
f.atexit = bool(int(sys.argv[1]))
```

默认设置是调用这个回调。将atexit设置为false会禁用这种行为。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE4f33556618e34fa0cb73290439007d5f.png)

如果向finalize实例提供所跟踪对象的一个引用，这便会导致一个引用被保留，所以这个对象永远不会被垃圾回收。 

```python
import gc
import weakref
class ExpensiveObject:
    def __del__(self):
        print('(Deleting {})'.format(self))
def on_finalize(*args):
    print('on_finalize({!r})'.format(args))
obj = ExpensiveObject()
obj_id = id(obj)
f = weakref.finalize(obj, on_finalize, obj)
f.atexit = False
del obj
for o in gc.get_objects():
    if id(o) == obj_id:
        print('found uncollected object in gc')
```

如上所示，尽管obj的显式引用已经删除，但是这个对象仍保留，通过f对垃圾回收器可见。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCEa37cb11652bb72f7818a854eccf8ee48.png)

使用所跟踪对象的一个绑定方法作为callable也可以适当地避免对象最终化。

```python
import gc
import weakref
class ExpensiveObject:
    def __del__(self):
        print('(Deleting {})'.format(self))
    def do_finalize(self):
        print('do_finalize')
obj = ExpensiveObject()
obj_id = id(obj)
f = weakref.finalize(obj, obj.do_finalize)
f.atexit = False
del obj
for o in gc.get_objects():
    if id(o) == obj_id:
        print('found uncollected object in gc')
```

由于为finalize提供的callable是实例obj的一个绑定方法，所以最终化方法保留了obj的一个引用，它不能被删除和被垃圾回收。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE417f96e49f1180cb21e53aeff9af3f0c.png)



## 1.4 代理

有时使用代理比较弱引用更方便。使用代理可以像使用原对象一样，而且不要求在访问对象之前先调用代理。这说明，可以将代理传递到一个库，而这个库并不知道它接收的是一个引用而不是真正的对象。

```python
import weakref
class ExpensiveObject:
    def __init__(self, name):
        self.name = name
    def __del__(self):
        print('(Deleting {})'.format(self))
obj = ExpensiveObject('My Object')
r = weakref.ref(obj)
p = weakref.proxy(obj)
print('via obj:', obj.name)
print('via ref:', r().name)
print('via proxy:', p.name)
del obj
print('via proxy:', p.name)
```

如果引用对象被删除后再访问代理，会产生一个ReferenceError异常。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE9c5d87ef32cdd95d629e4d706fafbb8d.png)



## 1.5 缓存对象

ref和proxy类被认为是“底层”的。尽管它们对于维护单个对象的弱引用很有用，并且还支持对循环引用的垃圾回收，但WeakKeyDictionary和WeakValueDictionary类为创建多个对象的缓存提供了一个更适合的API。

WeakValueDictionary类使用它包含的值的弱引用，当其他代码不再真正使用这些值时，则允许垃圾回收。利用垃圾回收器的显式调用，下面展示了使用常规字典和WeakValueDictionary完成内存处理的区别。 

```python
import gc
from pprint import pprint
import weakref
gc.set_debug(gc.DEBUG_UNCOLLECTABLE)
class ExpensiveObject:
    def __init__(self, name):
        self.name = name
    def __repr__(self):
        return 'ExpensiveObject({})'.format(self.name)
    def __del__(self):
        print('    (Deleting {})'.format(self))

def demo(cache_factory):
    # hold objects so any weak references
    # are not removed immediately
    all_refs = {}
    # create the cache using the factory
    print('CACHE TYPE:', cache_factory)
    cache = cache_factory()
    for name in ['one', 'two', 'three']:
        o = ExpensiveObject(name)
        cache[name] = o
        all_refs[name] = o
        del o  # decref
 
    print('  all_refs =', end=' ')
    pprint(all_refs)
    print('\n  Before, cache contains:', list(cache.keys()))
    for name, value in cache.items():
        print('    {} = {}'.format(name, value))
        del value  # decref
 
    # remove all references to the objects except the cache
    print('\n  Cleanup:')
    del all_refs
    gc.collect()
    print('\n  After, cache contains:', list(cache.keys()))
    for name, value in cache.items():
        print('    {} = {}'.format(name, value))
    print('  demo returning')
    return

demo(dict)
print()
demo(weakref.WeakValueDictionary)
```

如果循环变量指示所缓存的值，那么这些循环变量必须被显式清除，以使对象的引用数减少。否则，垃圾回收器不会删除这些对象，它们仍然会保留在缓存中。类似地，all_refs变量用来保存引用，以防止它们被过早地垃圾回收。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCEd3e3d7341b1f36661e81ee5cb84cebab.png)

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE5939467fbbb1d0ac3f28774e2c213200.png)

WeakKeyDictionary的工作与之类似，不过使用了字典中键的弱引用而不是值的弱引用