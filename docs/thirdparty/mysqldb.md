---
layout: doc
title: MySQLdb - Python MySQL数据库接口
permalink: /docs/thirdparty/mysqldb/
category: thirdparty
tags: [数据库, MySQL, MySQLdb, 第三方库, 数据库操作, SQL]
description: MySQLdb是基于MySQL C API的Python数据库接口，实现了Python DB-API 2.0规范，提供高性能的MySQL数据库访问功能
author: Python技术文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# MySQLdb - Python MySQL数据库接口

## 📝 概述

MySQLdb是用于Python连接MySQL数据库的接口，它实现了Python数据库API规范V2.0，基于MySQL C API构建。MySQLdb提供了高性能的MySQL数据库访问功能，是传统Python MySQL开发中的重要工具。

## 🎯 学习目标

通过本文档的学习，你将能够：

- 了解Python数据库接口规范和MySQLdb的特点
- 掌握MySQLdb的安装和基本配置
- 学会使用MySQLdb进行数据库连接和基本操作
- 掌握CRUD（增删改查）操作的实现方法
- 理解事务处理和错误处理机制
- 了解MySQLdb与其他MySQL Python库的差异

## 📋 前置知识

- Python基础语法
- MySQL数据库基础知识
- SQL语句基础
- 数据库概念（表、字段、索引等）

## 🔍 详细内容

### Python数据库接口概述

Python标准数据库接口为Python DB-API，为开发人员提供了数据库应用编程接口。Python数据库接口支持多种数据库系统：

- **关系型数据库**: MySQL、PostgreSQL、Oracle、SQL Server
- **轻量级数据库**: SQLite、mSQL
- **NoSQL数据库**: MongoDB、Redis
- **其他数据库**: Informix、Interbase、Sybase等

DB-API是一个规范，它定义了一系列必须的对象和数据库存取方式，为各种底层数据库系统和多样的数据库接口程序提供一致的访问接口。

### Python DB-API使用流程

1. **引入API模块** - 导入相应的数据库模块
2. **获取数据库连接** - 建立与数据库的连接
3. **执行SQL语句和存储过程** - 进行数据库操作
4. **关闭数据库连接** - 释放资源

### MySQLdb介绍

MySQLdb是用于Python连接MySQL数据库的接口，具有以下特点：

- **高性能**: 基于MySQL C API构建，执行效率高
- **标准兼容**: 实现Python数据库API规范V2.0
- **成熟稳定**: 长期维护，在生产环境中广泛使用
- **功能完整**: 支持MySQL的各种特性和数据类型

## 💡 实际应用

### 安装MySQLdb

MySQLdb的安装可能因平台而异，需要确保系统中已安装MySQL开发库。

#### 检查安装

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

try:
    import MySQLdb
    print("MySQLdb安装成功")
except ImportError as e:
    print(f"MySQLdb未安装: {e}")
```

#### 安装方法

**Linux/macOS平台:**

```bash
# 源码安装
$ wget https://pypi.python.org/packages/source/M/MySQL-python/MySQL-python-1.2.5.tar.gz
$ tar -xzf MySQL-python-1.2.5.tar.gz
$ cd MySQL-python-1.2.5
$ python setup.py build
$ python setup.py install
```

**注意事项:**
- 确保具有root权限进行安装
- 需要预先安装MySQL开发库
- Python 3.x建议使用PyMySQL替代

### 数据库连接

连接数据库前需要确认以下配置：

- 已创建目标数据库（如TESTDB）
- 数据库中已创建相应的表结构
- 具有有效的数据库用户名和密码
- 数据库服务正常运行

#### 基本连接示例

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

import MySQLdb

# 建立数据库连接
db = MySQLdb.connect(
    host="localhost",     # 数据库主机地址
    user="testuser",      # 数据库用户名
    passwd="test123",     # 数据库密码
    db="TESTDB",          # 数据库名
    charset='utf8'        # 字符编码
)

# 获取操作游标
cursor = db.cursor()

# 执行SQL查询
cursor.execute("SELECT VERSION()")

# 获取查询结果
data = cursor.fetchone()
print(f"Database version : {data}")

# 关闭数据库连接
db.close()
```

### 创建数据库表

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

import MySQLdb

# 建立数据库连接
db = MySQLdb.connect("localhost", "testuser", "test123", "TESTDB", charset='utf8')
cursor = db.cursor()

# 删除已存在的表
cursor.execute("DROP TABLE IF EXISTS EMPLOYEE")

# 创建数据表SQL语句
sql = """CREATE TABLE EMPLOYEE (
         FIRST_NAME  CHAR(20) NOT NULL,
         LAST_NAME  CHAR(20),
         AGE INT,  
         SEX CHAR(1),
         INCOME FLOAT )"""

try:
    cursor.execute(sql)
    print("表创建成功")
except Exception as e:
    print(f"表创建失败: {e}")

# 关闭数据库连接
db.close()
```

### 数据库插入操作

#### 基本插入

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

import MySQLdb

db = MySQLdb.connect("localhost", "testuser", "test123", "TESTDB", charset='utf8')
cursor = db.cursor()

# SQL插入语句
sql = """INSERT INTO EMPLOYEE(FIRST_NAME,
         LAST_NAME, AGE, SEX, INCOME)
         VALUES ('Mac', 'Mohan', 20, 'M', 2000)"""

try:
    # 执行SQL语句
    cursor.execute(sql)
    # 提交到数据库执行
    db.commit()
    print("数据插入成功")
except Exception as e:
    # 发生错误时回滚
    db.rollback()
    print(f"数据插入失败: {e}")

db.close()
```

#### 参数化插入

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

import MySQLdb

db = MySQLdb.connect("localhost", "testuser", "test123", "TESTDB", charset='utf8')
cursor = db.cursor()

# 使用参数化查询防止SQL注入
sql = "INSERT INTO EMPLOYEE(FIRST_NAME, LAST_NAME, AGE, SEX, INCOME) VALUES (%s, %s, %s, %s, %s)"

try:
    # 执行参数化插入
    cursor.execute(sql, ('John', 'Doe', 25, 'M', 3000))
    db.commit()
    print("参数化插入成功")
except Exception as e:
    db.rollback()
    print(f"插入失败: {e}")

db.close()
```

### 数据库查询操作

MySQLdb提供了多种数据获取方法：

- **fetchone()**: 获取下一个查询结果集
- **fetchall()**: 获取所有返回结果行
- **fetchmany(size)**: 获取指定数量的记录
- **rowcount**: 返回执行execute()方法后影响的行数

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

import MySQLdb

db = MySQLdb.connect("localhost", "testuser", "test123", "TESTDB", charset='utf8')
cursor = db.cursor()

# SQL查询语句
sql = "SELECT * FROM EMPLOYEE WHERE INCOME > %s" % (1000)

try:
    # 执行SQL语句
    cursor.execute(sql)
    
    # 获取所有记录列表
    results = cursor.fetchall()
    
    for row in results:
        fname = row[0]
        lname = row[1]
        age = row[2]
        sex = row[3]
        income = row[4]
        
        # 打印结果
        print(f"姓名: {fname} {lname}, 年龄: {age}, 性别: {sex}, 收入: {income}")
        
except Exception as e:
    print(f"数据查询失败: {e}")

db.close()
```

### 数据库更新操作

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

import MySQLdb

db = MySQLdb.connect("localhost", "testuser", "test123", "TESTDB", charset='utf8')
cursor = db.cursor()

# SQL更新语句
sql = "UPDATE EMPLOYEE SET AGE = AGE + 1 WHERE SEX = %s"

try:
    # 执行SQL语句
    cursor.execute(sql, ('M',))
    
    # 提交到数据库执行
    db.commit()
    
    print(f"更新了 {cursor.rowcount} 条记录")
    
except Exception as e:
    # 发生错误时回滚
    db.rollback()
    print(f"更新失败: {e}")

db.close()
```

### 数据库删除操作

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

import MySQLdb

db = MySQLdb.connect("localhost", "testuser", "test123", "TESTDB", charset='utf8')
cursor = db.cursor()

# SQL删除语句
sql = "DELETE FROM EMPLOYEE WHERE AGE > %s"

try:
    # 执行SQL语句
    cursor.execute(sql, (20,))
    
    # 提交修改
    db.commit()
    
    print(f"删除了 {cursor.rowcount} 条记录")
    
except Exception as e:
    # 发生错误时回滚
    db.rollback()
    print(f"删除失败: {e}")

# 关闭连接
db.close()
```

### 事务处理

事务处理确保数据一致性，具有ACID特性：

- **原子性(Atomicity)**: 事务是不可分割的工作单位
- **一致性(Consistency)**: 事务必须使数据库从一个一致性状态变到另一个一致性状态
- **隔离性(Isolation)**: 一个事务的执行不能被其他事务干扰
- **持久性(Durability)**: 事务一旦提交，对数据库的改变应该是永久性的

#### 事务处理示例

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

import MySQLdb

db = MySQLdb.connect("localhost", "testuser", "test123", "TESTDB", charset='utf8')
cursor = db.cursor()

try:
    # 开始事务（自动开始）
    
    # 执行多个相关操作
    cursor.execute("INSERT INTO EMPLOYEE(FIRST_NAME, LAST_NAME, AGE, SEX, INCOME) VALUES (%s, %s, %s, %s, %s)", 
                   ('Alice', 'Smith', 28, 'F', 4000))
    
    cursor.execute("UPDATE EMPLOYEE SET INCOME = INCOME + 500 WHERE FIRST_NAME = %s", ('Alice',))
    
    # 提交事务
    db.commit()
    print("事务提交成功")
    
except Exception as e:
    # 发生错误时回滚
    db.rollback()
    print(f"事务回滚: {e}")

db.close()
```

## ⚠️ 注意事项

### 错误处理

MySQLdb定义了多种数据库操作的错误和异常：

| 异常类型 | 说明 |
|---------|------|
| Warning | 当有严重警告时触发 |
| Error | 警告以外所有其他错误类 |
| InterfaceError | 当有数据库接口模块本身的错误时触发 |
| DatabaseError | 当有数据库相关的错误时触发 |
| DataError | 当有数据处理时的错误时触发 |
| OperationalError | 指非用户控制的，而是操作数据库时发生的错误 |
| IntegrityError | 完整性相关的错误 |
| InternalError | 数据库的内部错误 |
| ProgrammingError | 程序错误 |
| NotSupportedError | 不支持错误 |

### 安全考虑

1. **防止SQL注入**: 始终使用参数化查询
2. **连接安全**: 使用安全的连接参数
3. **权限控制**: 数据库用户权限最小化
4. **数据验证**: 验证输入数据的合法性

### 性能优化

1. **连接池**: 在高并发环境中使用连接池
2. **预编译语句**: 重复使用的SQL语句进行预编译
3. **批量操作**: 使用executemany()进行批量插入
4. **适当的索引**: 确保查询字段有适当的索引

### Python版本兼容性

- MySQLdb主要支持Python 2.x
- Python 3.x建议使用PyMySQL或mysql-connector-python
- 现代Python项目推荐使用ORM框架如SQLAlchemy

## 🔗 相关内容

- [PyMySQL - 纯Python MySQL客户端](../pymysql/)
- [SQLAlchemy - Python SQL工具包](../sqlalchemy/)
- [sqlite3 - Python内置数据库接口](../../stdlib/sqlite3/)

## 📚 扩展阅读

- [MySQL官方文档](https://dev.mysql.com/doc/)
- [Python DB-API 2.0规范](https://www.python.org/dev/peps/pep-0249/)
- [MySQL-python项目主页](https://pypi.org/project/MySQL-python/)

## 🏷️ 标签

`数据库` `MySQL` `MySQLdb` `第三方库` `数据库操作` `SQL`

---

**最后更新**: 2024-01-15  
**作者**: Python技术文档工程师  
**版本**: 1.0