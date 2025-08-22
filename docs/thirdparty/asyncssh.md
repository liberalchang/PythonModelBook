---
layout: doc
title: AsyncSSH - 异步 SSH 客户端与服务器
permalink: /docs/thirdparty/asyncssh/
category: thirdparty
tags: [asyncssh, SSH, SFTP, SCP, 异步, asyncio, 端口转发]
description: AsyncSSH 提供基于 asyncio 的 SSHv2 客户端与服务器实现，支持命令执行、SFTP/SCP、端口转发与 SOCKS 代理等；本文按模板整理安装、认证、常见用法与最佳实践
author: Python 技术文档工程师
date: 2025-08-22
updated: 2025-08-22
version: 1.0
difficulty: "中级"
---

# AsyncSSH - 异步 SSH 客户端与服务器

## 📝 概述

AsyncSSH 是一个建立在 Python asyncio 之上的异步 SSHv2 客户端与服务器实现，支持远程命令执行、交互式 Shell、SFTP/SCP 文件传输、端口与 UNIX 套接字转发、SOCKS 动态转发、以及多种认证方式与加密算法。适合需要高并发 SSH 连接管理与文件分发的场景。

## 🎯 学习目标

- 了解 AsyncSSH 的定位、能力边界与常见应用场景
- 掌握客户端常用 API：连接、认证、运行命令、SFTP/SCP、端口转发
- 了解服务器端最小实现思路与安全配置建议

## 📋 前置知识

- 熟悉 Python 3 与 asyncio 基本用法
- 了解 SSH 基础概念（公私钥、known_hosts、authorized_keys、端口转发）
- 具备 Linux/Unix 基础与 OpenSSH 常识

## 🔍 详细内容

### 基本概念

- AsyncSSH 基于 asyncio，提供 SSH 客户端与服务器能力；客户端可在同一连接上并发创建多个通道（命令/子系统/TCP/UNIX/TUN/TAP）。
- 认证方式涵盖用户名密码、公私钥、键盘交互、代理（ssh-agent/Pageant）等；支持 OpenSSH 风格的 known_hosts 和 authorized_keys 文件。
- 文件传输支持 SFTP v3（含 OpenSSH 扩展）与 SCP，适合高并发分发与采集；还支持本地/远程端口转发与 SOCKS 动态代理。

### 安装与环境

- 安装命令：`pip install asyncssh`（建议使用虚拟环境）
- 依赖要求：Python 3.6+，加密依赖为 PyCA cryptography；可选依赖用于 U2F/FIDO2、PKCS#11、GSSAPI、后量子 KEX 等高级特性

### 客户端：快速上手

#### 1. 运行远程命令（最简）

```python
# 使用 run() 一步执行远程命令，适合脚本化批处理
import asyncio, asyncssh

async def main():
    # 使用默认凭据与 known_hosts 校验连接本机
    async with asyncssh.connect('localhost') as conn:  # 建立 SSH 连接
        result = await conn.run('echo "Hello!"', check=True)  # 运行命令并检查退出码
        print(result.stdout, end='')  # 打印标准输出

if __name__ == '__main__':
    asyncio.run(main())
```

#### 2. 更灵活的进程 API

```python
# 使用 create_process() 获取 stdin/stdout/stderr，更适合交互与流式处理
import asyncio, asyncssh, sys

async def main():
    async with asyncssh.connect('example.com', username='user') as conn:
        proc = await conn.create_process('ls -l /tmp')  # 创建远程进程
        async for line in proc.stdout:  # 异步逐行读取输出
            print(line, end='')
        await proc.wait()  # 等待进程结束

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except (OSError, asyncssh.Error) as exc:
        sys.exit('SSH connection failed: ' + str(exc))
```

#### 3. SFTP 文件传输

```python
# 使用 SFTP 实现上传下载与目录操作
import asyncio, asyncssh

async def main():
    async with asyncssh.connect('files.example.com') as conn:
        sftp = await conn.start_sftp_client()  # 启动 SFTP 客户端
        await sftp.put('local.txt', 'remote.txt')  # 上传文件
        await sftp.get('remote.txt', 'local_copy.txt')  # 下载文件
        await sftp.rename('remote.txt', 'remote.old')  # 重命名

if __name__ == '__main__':
    asyncio.run(main())
```

#### 4. 端口转发（本地 → 远程）

```python
# 将本地 8080 转发到远端 80 端口，便于调试内网服务
import asyncio, asyncssh

async def main():
    async with asyncssh.connect('bastion.example.com') as conn:
        listener = await conn.forward_local_port('127.0.0.1', 8080, 'intranet.example.com', 80)
        await asyncio.sleep(3600)  # 保持转发 1 小时
        listener.close()

if __name__ == '__main__':
    asyncio.run(main())
```

### 认证与安全

- 用户名/密码：在 connect() 传参 username/password；或在 SSHClient 回调中返回凭据
- 公钥认证：确保私钥可读、远端 authorized_keys 配置正确；必要时传入 client_keys、passphrase 等
- 主机校验：默认读取用户 known_hosts 校验远端主机；也可显式指定 trusted_host_keys/known_hosts
- 加密与算法：支持多种 KEX/加解密/MAC，含后量子 KEX（ML-KEM、SNTRUP）与可选 gzip 压缩

### 服务器端（最小示例思路）

- 使用 asyncssh.create_server()/start_server() 启动 SSH 服务器，配置 host_keys、允许的认证方式与回调
- 在会话请求时创建自定义 SSHServerSession，按需启动 Shell/命令/子系统或转发处理
- 建议：使用最小权限账户与受控命令白名单、启用强算法与严格 host_keys 管理，并配合审计

## 💡 实际应用

- 大规模资产巡检：并发 run() 采集系统信息，失败重试与超时控制
- 批量分发：SFTP/SCP 结合并发实现文件下发与校验
- 远程调试：端口转发/SOCKS 与堡垒机联动，安全访问内网服务

## ⚠️ 注意事项

- 网络抖动与超时：合理设置连接超时、命令超时与重试策略
- 认证失败与指纹变化：处理 known_hosts 不匹配与首连场景
- 资源清理：确保连接、监听器与 SFTP 客户端正确关闭

## 🔗 相关内容

- [Paramiko - Python SSH远程控制模块](../paramiko/)
- [RPyC - Python远程过程调用框架](../rpyc/)

## 📚 扩展阅读

- 官方文档（总览与示例）
- API 文档（客户端、会话、转发、SFTP/SCP）

## 🏷️ 标签

`asyncssh` `SSH` `SFTP` `SCP` `asyncio` `端口转发`

---

**最后更新**: 2025-08-22  
**作者**: Python 技术文档工程师  
**版本**: 1.0