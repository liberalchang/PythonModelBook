---
layout: doc
title: PyMySQL - 纯Python的MySQL客户端
permalink: /docs/thirdparty/pymysql/
category: thirdparty
tags: [数据库, MySQL, PyMySQL, 连接池, 安全, SQL注入]
description: PyMySQL是一个纯Python实现的MySQL客户端，兼容DB-API 2.0，为Python 3项目提供稳定、易用的MySQL数据库访问能力
author: Python技术文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# PyMySQL - 纯Python的MySQL客户端

## 📝 概述

PyMySQL是一个纯Python实现的MySQL客户端库，遵循Python DB-API 2.0规范，支持Python 3.x。它提供了简单一致的API用于连接MySQL数据库、执行SQL语句、管理事务，并支持与DBUtils等库集成实现连接池。

## 🎯 学习目标

- 掌握PyMySQL的安装与基本使用
- 熟练进行数据库连接、游标操作和CRUD
- 理解参数化查询，避免SQL注入
- 掌握事务处理和提交/回滚机制
- 学会在多线程环境中使用连接池

## 📋 前置知识

- Python基础语法
- MySQL基础与SQL语句
- 基本的并发编程概念（用于连接池部分）

## 🔍 详细内容

### Python数据库接口概述

Python标准数据库接口为Python DB-API，提供统一的数据库访问接口。常见MySQL访问方案：

- DB模块（原生SQL）
  - PyMySQL（支持Python 3）
  - MySQLdb（主要支持Python 2）
- ORM框架
  - SQLAlchemy

本文重点介绍PyMySQL，MySQLdb用法与之类似。

## 💡 实际应用

### 安装PyMySQL

```bash
pip install PyMySQL
```

### 基本使用

```python
import pymysql

# 创建连接
conn = pymysql.connect(
    host="127.0.0.1",
    port=3306,
    user='zff',
    passwd='zff123',
    db='zff',
    charset='utf8mb4'
)

# 创建游标（字典格式返回）
cursor = conn.cursor(pymysql.cursors.DictCursor)

# 1. 执行SQL，返回受影响的行数
effect_row1 = cursor.execute("select * from USER")

# 2. 执行SQL，批量插入
effect_row2 = cursor.executemany(
    "insert into USER (NAME) values (%s)",
    [("jack"), ("boom"), ("lucy")]
)

# 查询所有数据
result = cursor.fetchall()

# 提交事务
conn.commit()

# 关闭游标和连接
cursor.close()
conn.close()

print(result)
```

### 获取自增ID

```python
import pymysql

conn = pymysql.connect(host="127.0.0.1", port=3306, user='zff', passwd='zff123', db='zff', charset='utf8mb4')
cursor = conn.cursor()

# 插入数据
cursor.execute("insert into USER (NAME) values (%s)", ("eric",))
conn.commit()

new_id = cursor.lastrowid
print(new_id)

cursor.close()
conn.close()
```

### 查询操作

```python
import pymysql

conn = pymysql.connect(host="127.0.0.1", port=3306, user='zff', passwd='zff123', db='zff', charset='utf8mb4')
cursor = conn.cursor()

cursor.execute("select * from USER")

# 获取第一行
a = cursor.fetchone()
# 获取前n行
b = cursor.fetchmany(3)
# 获取所有
c = cursor.fetchall()

cursor.close()
conn.close()

print(a)
print(b)
print(c)
```

提示：按顺序获取数据，可通过cursor.scroll(num, mode)移动游标：
- cursor.scroll(1, mode='relative')  # 相对当前位置移动
- cursor.scroll(2, mode='absolute')  # 相对绝对位置移动

### 防止SQL注入

严禁拼接SQL字符串，使用参数化查询：

```python
import pymysql

conn = pymysql.connect(host="127.0.0.1", port=3306, user='zff', passwd='zff123', db='zff', charset='utf8mb4')
cursor = conn.cursor()

# 错误示例：存在SQL注入
sql = "insert into USER (NAME) values ('%s')" % ('zhangsan',)
cursor.execute(sql)

# 正确示例一：位置参数
sql = "insert into USER (NAME) values (%s)"
cursor.execute(sql, ['wang6'])
cursor.execute(sql, ('wang7',))

# 正确示例二：命名参数
sql = "insert into USER (NAME) values (%(name)s)"
cursor.execute(sql, {'name': 'wudalang'})

# 批量插入
cursor.executemany("insert into USER (NAME) values (%s)", [('ermazi'), ('dianxiaoer')])

conn.commit()
cursor.close()
conn.close()
```

### 数据库连接池

当程序需要频繁创建/释放连接或在多线程环境中，建议使用连接池。

#### 使用DBUtils实现连接池

- 模式一：每线程独享连接（PersistentDB）

```python
from DBUtils.PersistentDB import PersistentDB
import pymysql

POOL = PersistentDB(
    creator=pymysql,
    maxusage=None,
    setsession=[],
    ping=0,
    closeable=False,
    threadlocal=None,
    host='127.0.0.1', port=3306,
    user='zff', password='zff123',
    database='zff', charset='utf8',
)

def func():
    conn = POOL.connection(shareable=False)
    cursor = conn.cursor()
    cursor.execute('select * from USER')
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result

print(func())
```

- 模式二：共享连接池（PooledDB）

```python
import pymysql
from DBUtils.PooledDB import PooledDB

POOL = PooledDB(
    creator=pymysql,
    maxconnections=6,
    mincached=2,
    maxcached=5,
    maxshared=3,
    blocking=True,
    maxusage=None,
    setsession=[],
    ping=0,
    host='127.0.0.1', port=3306,
    user='zff', password='zff123',
    database='zff', charset='utf8'
)

def func():
    conn = POOL.connection()
    cursor = conn.cursor()
    cursor.execute('select * from USER')
    result = cursor.fetchall()
    conn.close()  # 归还给连接池
    return result

print(func())
```

提示：由于pymysql的threadsafety为1，PooledDB模式下连接可被共享，线程安全；无连接池的多线程环境需加锁，否则可能报错。

#### 多线程示例

- 加锁场景：

```python
import pymysql
from threading import RLock

LOCK = RLock()
CONN = pymysql.connect(host='127.0.0.1', port=3306, user='zff', password='zff123', database='zff', charset='utf8')

def task():
    with LOCK:
        cursor = CONN.cursor()
        cursor.execute('select * from USER')
        result = cursor.fetchall()
        cursor.close()
        print(result)
```

- 无锁场景（示例，可能报错）：

```python
import pymysql
import threading

CONN = pymysql.connect(host='127.0.0.1', port=3306, user='zff', password='zff123', database='zff', charset='utf8')

def task():
    cursor = CONN.cursor()
    cursor.execute('select * from USER')
    result = cursor.fetchall()
    cursor.close()
    print(result)

for i in range(10):
    threading.Thread(target=task).start()
```

### 实用封装示例

结合连接池对常用操作进行封装：

```python
import pymysql
from DBUtils.PooledDB import PooledDB

POOL = PooledDB(
    creator=pymysql,
    maxconnections=20,
    mincached=2,
    maxcached=5,
    blocking=True,
    maxusage=None,
    setsession=[],
    ping=0,
    host='192.168.11.38', port=3306,
    user='root', passwd='apNXgF6RDitFtDQx',
    db='m2day03db', charset='utf8'
)

def connect():
    conn = POOL.connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    return conn, cursor

def close(conn, cursor):
    cursor.close()
    conn.close()

def fetch_one(sql, args):
    conn, cursor = connect()
    cursor.execute(sql, args)
    result = cursor.fetchone()
    close(conn, cursor)
    return result

def fetch_all(sql, args):
    conn, cursor = connect()
    cursor.execute(sql, args)
    result = cursor.fetchall()
    close(conn, cursor)
    return result

def insert(sql, args):
    conn, cursor = connect()
    effect_row = cursor.execute(sql, args)
    conn.commit()
    close(conn, cursor)
    return effect_row
```

## ⚠️ 注意事项

- 使用参数化查询避免SQL注入
- 批量插入使用executemany提升性能
- 多线程环境优先使用连接池
- 合理设置autocommit和事务控制
- 注意字符集设置（utf8/utf8mb4）

## 🔗 相关内容

- [MySQLdb - 基于C API的MySQL客户端](../mysqldb/)
- [SQLAlchemy - Python SQL工具包](../sqlalchemy/)
- [sqlite3 - Python内置数据库接口](../../stdlib/sqlite3/)

## 📚 原始文档（完整保留）

以下为原始文档内容，已完整保留以供参考：

---

### 一. python操作数据库介绍

Python 标准数据库接口为 Python DB-API，Python DB-API为开发人员提供了数据库应用编程接口。Python 数据库接口支持非常多的数据库，你可以选择适合你项目的数据库：

- GadFly

- mSQL

- MySQL

- PostgreSQL

- Microsoft SQL Server 2000

- Informix

- Interbase

- Oracle

- Sybase ...

你可以访问Python数据库接口及API查看详细的支持数据库列表。

不同的数据库你需要下载不同的DB API模块，例如你需要访问Oracle数据库和Mysql数据，你需要下载Oracle和MySQL数据库模块。

DB-API 是一个规范. 它定义了一系列必须的对象和数据库存取方式, 以便为各种各样的底层数据库系统和多种多样的数据库接口程序提供一致的访问接口 。

Python的DB-API，为大多数的数据库实现了接口，使用它连接各数据库后，就可以用相同的方式操作各数据库。

Python DB-API使用流程：

- 引入 API 模块。

- 获取与数据库的连接。

- 执行SQL语句和存储过程。

- 关闭数据库连接。

### 二. python操作MySQL模块

Python操作MySQL主要使用两种方式：

1. DB模块(原生SQL)

- PyMySQL(支持python2.x/3.x)

- MySQLdb(目前仅支持python2.x)

1. ORM框架

- SQLAchemy

### 2.1 PyMySQL模块

本文主要介绍PyMySQL模块,MySQLdb使用方式类似

#### 2.1.1 安装PyMySQL

PyMySQL是一个Python编写的MySQL驱动程序，让我们可以用Python语言操作MySQL数据库。

```
pip install PyMySQL

```

### 2.2 基本使用

```
#! /usr/bin/env python
# -*- coding: utf-8 -*-
# __author__ = "shuke"
# Date: 2018/5/13

import pymysql

# 创建连接
conn = pymysql.connect(host="127.0.0.1", port=3306, user='zff', passwd='zff123', db='zff', charset='utf8mb4')

# 创建游标(查询数据返回为元组格式)
# cursor = conn.cursor()

# 创建游标(查询数据返回为字典格式)
cursor = conn.cursor(pymysql.cursors.DictCursor)

# 1. 执行SQL,返回受影响的行数
effect_row1 = cursor.execute("select * from USER")

# 2. 执行SQL,返回受影响的行数,一次插入多行数据
effect_row2 = cursor.executemany("insert into USER (NAME) values(%s)", [("jack"), ("boom"), ("lucy")])  # 3

# 查询所有数据,返回数据为元组格式
result = cursor.fetchall()

# 增/删/改均需要进行commit提交,进行保存
conn.commit()

# 关闭游标
cursor.close()

# 关闭连接
conn.close()

print(result)
"""
[{'id': 6, 'name': 'boom'}, {'id': 5, 'name': 'jack'}, {'id': 7, 'name': 'lucy'}, {'id': 4, 'name': 'tome'}, {'id': 3, 'name': 'zff'}, {'id': 1, 'name': 'zhaofengfeng'}, {'id': 2, 'name': 'zhaofengfeng02'}]
"""

```

### 2.3 获取最新创建的数据自增ID

```
#! /usr/bin/env python
# -*- coding: utf-8 -*-
# __author__ = "shuke"
# Date: 2018/5/13

import pymysql

# 创建连接
conn = pymysql.connect(host="127.0.0.1", port=3306, user='zff', passwd='zff123', db='zff', charset='utf8mb4')

# 创建游标(查询数据返回为元组格式)
cursor = conn.cursor()

# 获取新创建数据自增ID
effect_row = cursor.executemany("insert into USER (NAME)values(%s)", [("eric")])

# 增删改均需要进行commit提交
conn.commit()

# 关闭游标
cursor.close()

# 关闭连接
conn.close()

new_id = cursor.lastrowid
print(new_id)
"""
8
"""

```

### 2.4 查询操作

```
#! /usr/bin/env python
# -*- coding: utf-8 -*-
# __author__ = "shuke"
# Date: 2018/5/13

import pymysql

# 创建连接
conn = pymysql.connect(host="127.0.0.1", port=3306, user='zff', passwd='zff123', db='zff', charset='utf8mb4')

# 创建游标
cursor = conn.cursor()

cursor.execute("select * from USER")

# 获取第一行数据
row_1 = cursor.fetchone()

# 获取前n行数据
row_2 = cursor.fetchmany(3)
#
# # 获取所有数据
row_3 = cursor.fetchall()

# 关闭游标
cursor.close()

# 关闭连接
conn.close()
print(row_1)
print(row_2)
print(row_3)

```

⚠️ 在fetch数据时按照顺序进行，可以使用cursor.scroll(num,mode)来移动游标位置，如：

- cursor.scroll(1,mode='relative')  # 相对当前位置移动

- cursor.scroll(2,mode='absolute')  # 相对绝对位置移动

### 2.5 防止SQL注入

```
#! /usr/bin/env python
# -*- coding: utf-8 -*-
# __author__ = "shuke"
# Date: 2018/5/13

import pymysql

# 创建连接
conn = pymysql.connect(host="127.0.0.1", port=3306, user='zff', passwd='zff123', db='zff', charset='utf8mb4')

# 创建游标
cursor = conn.cursor()

# 存在sql注入情况(不要用格式化字符串的方式拼接SQL)
sql = "insert into USER (NAME) values('%s')" % ('zhangsan',)
effect_row = cursor.execute(sql)

# 正确方式一
# execute函数接受一个元组/列表作为SQL参数,元素个数只能有1个
sql = "insert into USER (NAME) values(%s)"
effect_row1 = cursor.execute(sql, ['wang6'])
effect_row2 = cursor.execute(sql, ('wang7',))

# 正确方式二
sql = "insert into USER (NAME) values(%(name)s)"
effect_row1 = cursor.execute(sql, {'name': 'wudalang'})

# 写入插入多行数据
effect_row2 = cursor.executemany("insert into USER (NAME) values(%s)", [('ermazi'), ('dianxiaoer')])

# 提交
conn.commit()
# 关闭游标
cursor.close()
# 关闭连接
conn.close()

```

### 三. 数据库连接池

上文中的方式存在一个问题,单线程情况下可以满足,程序需要频繁的创建释放连接来完成对数据库的操作,那么,我们的程序/脚本在多线程情况下会引发什么问题呢?此时,我们就需要使用数据库连接池来解决这个问题!

### 3.1 DBUtils模块

DBUtils是Python的一个用于实现数据库连接池的模块。

此连接池有两种连接模式：

- 为每个线程创建一个连接，线程即使调用了close方法，也不会关闭，只是把连接重新放到连接池，供自己线程再次使用。当线程终止时，连接才会自动关闭

- 创建一批连接到连接池，供所有线程共享使用(推荐使用)

### 3.2 模式一

```
#! /usr/bin/env python
# -*- coding: utf-8 -*-
# __author__ = "shuke"
# Date: 2018/5/13

from DBUtils.PersistentDB import PersistentDB
import pymysql

POOL = PersistentDB(
    creator=pymysql,  # 使用链接数据库的模块
    maxusage=None,  # 一个链接最多被重复使用的次数，None表示无限制
    setsession=[],  # 开始会话前执行的命令列表。如：["set datestyle to ...", "set time zone ..."]
    ping=0,
    # ping MySQL服务端，检查是否服务可用。# 如：0 = None = never, 1 = default = whenever it is requested, 2 = when a cursor is created, 4 = when a query is executed, 7 = always
    closeable=False,
    # 如果为False时， conn.close() 实际上被忽略，供下次使用，再线程关闭时，才会自动关闭链接。如果为True时， conn.close()则关闭链接，那么再次调用pool.connection时就会报错，因为已经真的关闭了连接（pool.steady_connection()可以获取一个新的链接）
    threadlocal=None,  # 本线程独享值得对象，用于保存链接对象，如果链接对象被重置
    host='127.0.0.1',
    port=3306,
    user='zff',
    password='zff123',
    database='zff',
    charset='utf8',
)


def func():
    conn = POOL.connection(shareable=False)
    cursor = conn.cursor()
    cursor.execute('select * from USER')
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result


result = func()
print(result)

```

### 3.2 模式二

```
#! /usr/bin/env python
# -*- coding: utf-8 -*-
# __author__ = "shuke"
# Date: 2018/5/13

import time
import pymysql
import threading
from DBUtils.PooledDB import PooledDB, SharedDBConnection

POOL = PooledDB(
    creator=pymysql,  # 使用链接数据库的模块
    maxconnections=6,  # 连接池允许的最大连接数，0和None表示不限制连接数
    mincached=2,  # 初始化时，链接池中至少创建的空闲的链接，0表示不创建
    maxcached=5,  # 链接池中最多闲置的链接，0和None不限制
    maxshared=3,
    # 链接池中最多共享的链接数量，0和None表示全部共享。PS: 无用，因为pymysql和MySQLdb等模块的 threadsafety都为1，所有值无论设置为多少，_maxcached永远为0，所以永远是所有链接都共享。
    blocking=True,  # 连接池中如果没有可用连接后，是否阻塞等待。True，等待；False，不等待然后报错
    maxusage=None,  # 一个链接最多被重复使用的次数，None表示无限制
    setsession=[],  # 开始会话前执行的命令列表。如：["set datestyle to ...", "set time zone ..."]
    ping=0,
    # ping MySQL服务端，检查是否服务可用。# 如：0 = None = never, 1 = default = whenever it is requested, 2 = when a cursor is created, 4 = when a query is executed, 7 = always
    host='127.0.0.1',
    port=3306,
    user='zff',
    password='zff123',
    database='zff',
    charset='utf8'
)


def func():
    # 检测当前正在运行连接数的是否小于最大链接数，如果不小于则：等待或报raise TooManyConnections异常
    # 否则
    # 则优先去初始化时创建的链接中获取链接 SteadyDBConnection。
    # 然后将SteadyDBConnection对象封装到PooledDedicatedDBConnection中并返回。
    # 如果最开始创建的链接没有链接，则去创建一个SteadyDBConnection对象，再封装到PooledDedicatedDBConnection中并返回。
    # 一旦关闭链接后，连接就返回到连接池让后续线程继续使用。
    conn = POOL.connection()

    # print('连接被拿走了', conn._con)
    # print('池子里目前有', POOL._idle_cache, '\r\n')

    cursor = conn.cursor()
    cursor.execute('select * from USER')
    result = cursor.fetchall()
    conn.close()
    return result


result = func()
print(result)

```

⚠️ 由于pymysql、MySQLdb等threadsafety值为1，所以该模式连接池中的线程会被所有线程共享,因此是线程安全的。如果没有连接池，使用pymysql来连接数据库时，单线程应用完全没有问题，但如果涉及到多线程应用那么就需要加锁，一旦加锁那么连接势必就会排队等待，当请求比较多时，性能就会降低了。

### 3.3 加锁

```
#! /usr/bin/env python
# -*- coding: utf-8 -*-
# __author__ = "shuke"
# Date: 2018/5/13

import pymysql
import threading
from threading import RLock

LOCK = RLock()
CONN = pymysql.connect(host='127.0.0.1',
                       port=3306,
                       user='zff',
                       password='zff123',
                       database='zff',
                       charset='utf8')


def task(arg):
    with LOCK:
        cursor = CONN.cursor()
        cursor.execute('select * from USER ')
        result = cursor.fetchall()
        cursor.close()

        print(result)


for i in range(10):
    t = threading.Thread(target=task, args=(i,))
    t.start()

```

### 3.4 无锁(报错)

```
#! /usr/bin/env python
# -*- coding: utf-8 -*-
# __author__ = "shuke"
# Date: 2018/5/13

import pymysql
import threading

CONN = pymysql.connect(host='127.0.0.1',
                       port=3306,
                       user='zff',
                       password='zff123',
                       database='zff',
                       charset='utf8')


def task(arg):
    cursor = CONN.cursor()
    cursor.execute('select * from USER ')
    # cursor.execute('select sleep(10)')
    result = cursor.fetchall()
    cursor.close()
    print(result)


for i in range(10):
    t = threading.Thread(target=task, args=(i,))
    t.start()

```

此时可以在数据库中查看连接情况: show status like 'Threads%';

### 四. 数据库连接池结合pymsql使用

```
# cat sql_helper.py

import pymysql
import threading
from DBUtils.PooledDB import PooledDB, SharedDBConnection
POOL = PooledDB(
    creator=pymysql,  # 使用链接数据库的模块
    maxconnections=20,  # 连接池允许的最大连接数，0和None表示不限制连接数
    mincached=2,  # 初始化时，链接池中至少创建的空闲的链接，0表示不创建
    maxcached=5,  # 链接池中最多闲置的链接，0和None不限制
    #maxshared=3,  # 链接池中最多共享的链接数量，0和None表示全部共享。PS: 无用，因为pymysql和MySQLdb等模块的 threadsafety都为1，所有值无论设置为多少，_maxcached永远为0，所以永远是所有链接都共享。
    blocking=True,  # 连接池中如果没有可用连接后，是否阻塞等待。True，等待；False，不等待然后报错
    maxusage=None,  # 一个链接最多被重复使用的次数，None表示无限制
    setsession=[],  # 开始会话前执行的命令列表。如：["set datestyle to ...", "set time zone ..."]
    ping=0,
    # ping MySQL服务端，检查是否服务可用。# 如：0 = None = never, 1 = default = whenever it is requested, 2 = when a cursor is created, 4 = when a query is executed, 7 = always
    host='192.168.11.38',
    port=3306,
    user='root',
    passwd='apNXgF6RDitFtDQx',
    db='m2day03db',
    charset='utf8'
)


def connect():
    # 创建连接
    # conn = pymysql.connect(host='192.168.11.38', port=3306, user='root', passwd='apNXgF6RDitFtDQx', db='m2day03db')
    conn = POOL.connection()
    # 创建游标
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    return conn,cursor

def close(conn,cursor):
    # 关闭游标
    cursor.close()
    # 关闭连接
    conn.close()

def fetch_one(sql,args):
    conn,cursor = connect()
    # 执行SQL，并返回收影响行数
    effect_row = cursor.execute(sql,args)
    result = cursor.fetchone()
    close(conn,cursor)

    return result

def fetch_all(sql,args):
    conn, cursor = connect()

    # 执行SQL，并返回收影响行数
    cursor.execute(sql,args)
    result = cursor.fetchall()

    close(conn, cursor)
    return result

def insert(sql,args):
    """
    创建数据
    :param sql: 含有占位符的SQL
    :return:
    """
    conn, cursor = connect()

    # 执行SQL，并返回收影响行数
    effect_row = cursor.execute(sql,args)
    conn.commit()
```