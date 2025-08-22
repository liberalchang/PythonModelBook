---
layout: doc
title: asyncio + SQLAlchemy 并发访问数据库
permalink: /docs/basics/asyncio-sqlalchemy/
category: basics
tags: [asyncio, SQLAlchemy, 数据库, 并发]
description: 结合 asyncio 与 SQLAlchemy 的异步能力，在单线程内并发访问 MySQL / PostgreSQL。
author: Python 编程指南
date: 2024-01-20
updated: 2024-01-20
version: 1.0
difficulty: "中高级"
---

# asyncio + SQLAlchemy 并发访问数据库

本页介绍如何使用 SQLAlchemy 的异步 API，与 asyncio 事件循环协同进行并发数据库访问。

## 选择异步驱动

- MySQL：`asyncmy`、`aiomysql`（前者更活跃）。
- PostgreSQL：`asyncpg`。

## 安装示例（conda/pip）

```bash
# MySQL 驱动
pip install sqlalchemy[asyncio] asyncmy
# PostgreSQL 驱动
pip install sqlalchemy[asyncio] asyncpg
```

## 异步引擎与会话

```python
# -*- coding: utf-8 -*-
# 使用 SQLAlchemy 2.x 风格
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import select, String, Integer

# 定义 ORM Base
class Base(DeclarativeBase):
    pass

# 定义模型
class User(Base):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50))

async def main():
    engine = create_async_engine(
        "mysql+asyncmy://user:password@127.0.0.1:3306/testdb",
        echo=True,
        pool_pre_ping=True,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    Session = async_sessionmaker(engine, expire_on_commit=False)

    # 插入示例
    async with Session() as session:
        session.add_all([User(name='Alice'), User(name='Bob')])
        await session.commit()

    # 查询示例
    async with Session() as session:
        stmt = select(User).where(User.name.like('%o%'))
        result = await session.execute(stmt)
        users = result.scalars().all()
        print(users)

    await engine.dispose()

if __name__ == '__main__':
    asyncio.run(main())
```

## 连接串格式

- MySQL：`mysql+asyncmy://user:password@host:port/dbname`
- PostgreSQL：`postgresql+asyncpg://user:password@host:port/dbname`

## 并发查询与事务

```python
# 并发执行多个查询
async with Session() as session:
    tasks = [session.execute(select(User).where(User.id == i)) for i in range(1, 6)]
    results = await asyncio.gather(*tasks)
    rows = [r.scalars().first() for r in results]

# 事务
async with Session.begin() as session:
    session.add(User(name='Carol'))
    # 发生异常将自动回滚
```

## 最佳实践

- 数据库操作是 IO 密集型，协程间并发能提升吞吐，但应注意连接池上限（`pool_size`/`max_overflow`）。
- 单个会话对象不应在多个并发任务中共享，推荐为每个任务创建独立会话或使用会话工厂。
- 对慢查询设置超时与取消，避免阻塞事件循环，可结合 `asyncio.wait_for`。

## 相关阅读

- [SQLAlchemy 官方文档：AsyncIO 支持](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)
- [asyncpg](https://github.com/MagicStack/asyncpg)
- [asyncmy](https://github.com/long2ice/asyncmy)