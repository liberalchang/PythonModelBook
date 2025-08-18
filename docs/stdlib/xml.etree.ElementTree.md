---
layout: doc
title: xml.etree.ElementTree 模块
permalink: /docs/stdlib/xml.etree.ElementTree/
category: stdlib
tags: [XML, 数据解析, 文档处理, 元素树, XML生成]
description: Python xml.etree.ElementTree模块详解 - XML文档解析和生成的完整解决方案
author: Python教程
date: 2024-12-19
updated: 2024-12-19
version: 1.0
difficulty: "中级"
---

# xml.etree.ElementTree 模块

## 📝 概述

xml.etree.ElementTree模块是Python标准库中处理XML文档的主要工具。它提供了一个轻量级、高效的方式来解析和创建XML文档。该模块使用了ElementTree API，使XML操作变得简单直观。

XML（可扩展性标记语言eXtensible Markup Language）是一种非常常用的文件类型，被设计用来传输和存储数据而不是显示数据（HTML用于显示数据），XML标签没有被预定义。您需要自行定义标签。python3.3以后使用xml.etree.ElementTree模块。

## 🎯 学习目标

- 理解XML文档结构和ElementTree概念
- 掌握XML文档的解析和读取方法
- 学会动态生成XML文档
- 熟练使用Element对象的属性和方法
- 了解XML文档的修改和更新操作

## 📋 前置知识

- Python基础语法
- 文件操作基础
- 字典和列表的使用
- HTTP请求基础（用于网络XML示例）
- XML基本概念和格式

## 🔍 详细内容

### XML格式基础

XML文档由以下几个基本部分组成：

#### （1）标签/元素
XML元素是XML文档的基本构建块，由开始标签和结束标签包围。

#### （2）属性
元素可以包含属性，提供关于元素的额外信息。

#### （3）数据
元素可以包含文本数据或其他子元素。

例如：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<breakfast_menu>
    <food>
        <name>Belgian Waffles</name>
        <price>$5.95</price>
        <description>
            Two of our famous Belgian Waffles with plenty of real maple syrup
        </description>
        <calories>650</calories>
    </food>
    <food>
        <name>Strawberry Belgian Waffles</name>
        <price>$7.95</price>
        <description>
            Light Belgian waffles covered with strawberries and whipped cream
        </description>
        <calories>900</calories>
    </food>
</breakfast_menu>
```

### XML读取操作

有以下两种方式可以对XML字符串进行操作，都是拿到根节点元素，在此基础上增删改查XML：

#### （1）通过字符串方式读取
参数为XML字符串，直接返回的是一个根Element对象：

```python
import xml.etree.ElementTree as ET

xml_string = '''
<breakfast_menu>
    <food>
        <name>Belgian Waffles</name>
        <price>$5.95</price>
        <description>
            Two of our famous Belgian Waffles with plenty of real maple syrup
        </description>
        <calories>650</calories>
    </food>
    <food>
        <name>Strawberry Belgian Waffles</name>
        <price>$7.95</price>
        <description>
            Light Belgian waffles covered with strawberries and whipped cream
        </description>
        <calories>900</calories>
    </food>
    <food>
        <name>Berry-Berry Belgian Waffles</name>
        <price>$8.95</price>
        <description>Light Belgian waffles covered with an assortment of fresh berries and whipped cream</description>
        <calories>900</calories>
    </food>
    <food>
        <name>French Toast</name>
        <price>$4.50</price>
        <description>
            Thick slices made from our homemade sourdough bread
        </description>
        <calories>600</calories>
    </food>
    <food>
        <name>Homestyle Breakfast</name>
        <price>$6.95</price>
        <description>
            Two eggs, bacon or sausage, toast, and our ever-popular hash browns
        </description>
        <calories>950</calories>
    </food>
</breakfast_menu>
'''

root = ET.fromstring(xml_string)
print(root)  # ==> <Element 'breakfast_menu' at 0x101f94a98>
```

#### （2）从xml文件中读取
用getroot获取根节点，根节点也是Element对象：

```python
import xml.etree.ElementTree as ET

tree = ET.parse('xml_test')
root = tree.getroot()
print(tree)  # ==> <xml.etree.ElementTree.ElementTree object at 0x104100a20>
print(root)  # ==> <Element 'breakfast_menu' at 0x101d94a98>这个同第一种方式直接获取的结果一样
```

### 访问XML元素：标签（tag）、属性（attrib）、值（text）

#### （1）访问Element元素对象的标签、属性、值

```python
tag = element.tag        # 获取标签名
attrib = element.attrib  # 获取属性字典
value = element.text     # 获取文本内容
```

#### （2）访问子节点元素对象及其标签、属性、值

```python
# 这里的for i in root只能访问root的直接子元素，下面的for i in root.iter()是访问所有子元素
for child in root:
    print(child, child.tag, child.attrib, child.text)
    for child_child in child:
        print(child_child, child_child.tag, child_child.attrib, child_child.text)

# 结果类似如下：
# <Element 'food' at 0x101e94bd8> food {} 
#         <Element 'name' at 0x104111cc8> name {} Belgian Waffles
#         <Element 'price' at 0x104570278> price {} $5.95
#         <Element 'description' at 0x1045702c8> description {} 
#                   Two of our famous Belgian Waffles with plenty of real maple syrup
#         <Element 'calories' at 0x104570908> calories {} 650
```

#### （3）Elements元素对象都是可迭代的对象

可以直接对其list(Element)将其转化为列表或者直接索引取：

```python
import xml.etree.ElementTree as ET
tree = ET.parse('xml_test')
root = tree.getroot()
print(list(root))  # ==> [<Element 'food' at 0x101c94bd8>, <Element 'food' at 0x10457aa48>, <Element 'food' at 0x10457ac28>, <Element 'food' at 0x10457ae08>, <Element 'food' at 0x10457af98>]
print(root[0], root[1])
```

如上，list(root)的结果就是其子元素组成的列表，这时可以访问其标签、属性、值，然后对其每个子元素也可以同样的方法转换为列表访问各个属性，当然可以通过迭代的方法用for循环来操作。

#### （4）按照元素名字访问或者迭代元素

```python
# 1. Element.iter("tag")，可以罗列该节点所包含的所有其他节点（element对象）
print(root.iter())  # 返回一个可迭代对象，迭代这个对象可以迭代出包括根节点在内的所有元素节点
print(list(root.iter()))  # 返回一个列表，将所有元素对象放在一个列表中
print(root.iter('name'))  # 返回一个可迭代对象，迭代这个对象可以迭代出所有元素标签名为name的元素对象
print(list(root.iter('name')))  # 返回一个列表，将所有标签名为name的元素对象放到一个列表中

# 2. Element.findall("tag")：查找当前元素为"tag"的直接子元素,tag不能省略
# 3. Element.find("tag")：查找为tag的第一个直接子元素，如没有，返回None
```

### 修改XML文件

```python
# ElementTree.write("xml_test")：更新xml文件
# Element.append(element)：为当前element对象添加子元素（element）
# Element.set(key,value)：为当前element的key属性设置value值
# Element.remove(element)：删除为element的节点
```

修改示例：

```python
# 读取待修改xml文件
updateTree = ET.parse("xml_test")
root = updateTree.getroot()

# 创建新节点并添加为root的子节点
newEle = ET.Element("NewElement")
newEle.attrib = {"name":"NewElement","age":"20"}
newEle.text = "This is a new element"
root.append(newEle)

# 修改sub1的name属性
sub1 = root.find("food")
sub1.set("name","New Name")

# 修改sub2的数据值
sub2 = root.find("sub2")
sub2.text = "New Value"

# 写回原文件
updateTree.write("xml_test")
```

具体修改示例：

```python
# sample.xml
"""
<data data_attrib="hello xml" data_attrib2="hello xml2">
    <country name="Liechtenstein">
        <rank>1</rank>
        <year>2008</year>
        <gdppc>141100</gdppc>
        <neighbor direction="E" name="Austria">textqqq</neighbor>
        <neighbor direction="W" name="Switzerland" />
    </country>
    <country name="Singapore">
        <rank>4</rank>
        <year>2011</year>
        <gdppc>59900</gdppc>
        <neighbor direction="N" name="Malaysia" />
    </country>
    <country name="Panama">
        <rank>68</rank>
        <year>2012</year>
        <gdppc>13600</gdppc>
        <neighbor direction="W" name="Costa Rica" />
        <neighbor direction="E" name="Colombia" />
    </country>
    <country name="China">
        <rank>8</rank>
        <neighbor direction="E" name="Japan">I am Japan</neighbor>
    </country>
</data>
"""

tree = ET.parse('sample.xml')
root = tree.getroot()
for country in root.findall('country'):
    if country.attrib["name"] == "China":
        neighbor = country.find("neighbor")
        neighbor.text = "I am Japan"
        tree.write('sample.xml')
```

## 💡 实际应用

### 1. XML文件解析示例

以网易汽车的销量数据为例：

```python
# -*- coding: utf-8 -*-
from urllib.request import urlopen
import xml.etree.ElementTree as ET

# 以网易汽车为例
u = urlopen('http://db.auto.sohu.com/cxdata/xml/sales/model/model1001sales.xml')
# 获取文本
s = u.read().decode('gbk')
root = ET.fromstring(s)

# 从根节点迭代子节点
for elem in root.iter():
    print(elem.tag, elem.attrib)

# 取所有的sales子节点循环
for item in root.iterfind('sales'):
    # 获取两列数据
    print(item.get("date"), '\t', item.get("salesNum"))
```

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE21e86cabad7d89706355b227a41c3d0e.png)

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE6e9328af520ac935b9b88cf751f39192.png)

### 2. XML文件生成示例

在很多情境下，需要生成xml文件，例如我们可以通过字典的方式，将数据库的配置信息放入XML文件中：

```python
# -*- coding: utf-8 -*-
from xml.etree.ElementTree import Element, ElementTree
from xml.etree.ElementTree import tostring


def dict_to_xml(tag, d):
    '''
    Turn a simple dict of key/value pairs into XML
    '''
    elem = Element(tag)  # 使用Element创建元素
    # 循环key与val
    for key, val in d.items():
        # 创建新的元素,确定元素的值
        child = Element(key)
        child.text = str(val)
        # 添加为elem的子节点
        elem.append(child)
    return elem


if __name__ == "__main__":
    # 数据库配置的信息
    db_config = {
        'host': '127.0.0.1',
        'port': 3306,
        'user': 'db_user',
        'password': 'db_user_passwd',
        'db': 'database_name',
        'charset': 'utf8'
    }
    # 调用方法
    e = dict_to_xml('db', db_config)
    print(tostring(e))
    # 转化为ElementTree
    tree = ElementTree(e)
    # 写成xml文件
    tree.write('output.xml', encoding='UTF-8')
```

注意生成的xml没有头信息。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE7b9245b3119de4845640c204c62d2ecd.png)

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCEd516ce777966f4d2c0738b2f382edb2e.png)

### 3. 高效解析大型XML文件

对于大型XML文件，可以使用iterparse进行流式解析：

```python
from xml.etree.ElementTree import iterparse


def parse_and_remove(filename, path):
    path_parts = path.split('/')
    doc = iterparse(filename, ('start', 'end'))
    # Skip the root element
    next(doc)

    tag_stack = []
    elem_stack = []
    for event, elem in doc:
        if event == 'start':
            tag_stack.append(elem.tag)
            elem_stack.append(elem)
        elif event == 'end':
            if tag_stack == path_parts:
                yield elem
                elem_stack[-2].remove(elem)
            try:
                tag_stack.pop()
                elem_stack.pop()
            except IndexError:
                pass


# Find zip code with most potholes
from collections import Counter

potholes_by_zip = Counter()

data = parse_and_remove('potholes.xml', 'row/row')
for pothole in data:
    potholes_by_zip[pothole.findtext('zip')] += 1

for zipcode, num in potholes_by_zip.most_common():
    print(zipcode, num)
```

### 4. XML数据转换

将XML数据转换为Python数据结构：

```python
import xml.etree.ElementTree as ET


def xml_to_dict(element):
    """将XML元素转换为字典"""
    result = {}
    
    # 添加属性
    if element.attrib:
        result['@attributes'] = element.attrib
    
    # 添加文本内容
    if element.text and element.text.strip():
        result['text'] = element.text.strip()
    
    # 添加子元素
    children = {}
    for child in element:
        child_data = xml_to_dict(child)
        if child.tag in children:
            # 如果标签已存在，转换为列表
            if not isinstance(children[child.tag], list):
                children[child.tag] = [children[child.tag]]
            children[child.tag].append(child_data)
        else:
            children[child.tag] = child_data
    
    result.update(children)
    return result


# 使用示例
xml_string = """
<person id="123">
    <name>张三</name>
    <age>30</age>
    <address>
        <city>北京</city>
        <street>中关村大街</street>
    </address>
</person>
"""

root = ET.fromstring(xml_string)
data = xml_to_dict(root)
print(data)
```

### 5. XML验证和错误处理

```python
import xml.etree.ElementTree as ET
from xml.etree.ElementTree import ParseError


def safe_parse_xml(xml_content):
    """安全解析XML内容"""
    try:
        if isinstance(xml_content, str):
            root = ET.fromstring(xml_content)
        else:
            root = ET.parse(xml_content).getroot()
        return root, None
    except ParseError as e:
        return None, f"XML解析错误: {e}"
    except FileNotFoundError as e:
        return None, f"文件未找到: {e}"
    except Exception as e:
        return None, f"未知错误: {e}"


# 使用示例
xml_content = """
<invalid>
    <unclosed>内容
</invalid>
"""

root, error = safe_parse_xml(xml_content)
if error:
    print(error)
else:
    print("XML解析成功")
```

## ⚠️ 注意事项

### 编码问题
- 处理不同编码的XML文件时，注意指定正确的编码格式
- 生成XML时建议使用UTF-8编码

### 命名空间处理
- 对于包含命名空间的XML文档，需要在标签名前加上命名空间前缀
- 使用`{namespace}tagname`的格式来访问带命名空间的元素

### 内存使用
- 对于大型XML文件，考虑使用iterparse进行流式解析
- 避免将整个大文件加载到内存中

### 安全性考虑
- 处理来自不可信源的XML时，要注意XML炸弹等安全问题
- 考虑使用defusedxml库来提高安全性

### 性能优化
- 对于重复操作，可以预编译查找路径
- 使用适当的查找方法（find vs findall vs iter）

## 🔗 相关内容

- [urllib 模块](../urllib/) - 网络请求和URL处理
- [io 模块](../io/) - 文本与二进制I/O
- [os 模块](../os/) - 文件与目录操作
- [re 模块](../re/) - 文本与正则处理

## 📚 扩展阅读

- [Python官方XML处理文档](https://docs.python.org/3/library/xml.html)
- [XML规范](https://www.w3.org/XML/)
- [ElementTree API文档](https://docs.python.org/3/library/xml.etree.elementtree.html)
- [defusedxml安全处理](https://pypi.org/project/defusedxml/)

## 🏷️ 标签

`XML` `数据解析` `文档处理` `元素树` `XML生成`

---

**最后更新**: 2024-12-19  
**作者**: Python教程  
**版本**: 1.0