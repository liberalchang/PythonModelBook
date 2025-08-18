---
layout: doc
title: Supervisor - Python进程管理与监控系统
permalink: /docs/thirdparty/supervisor/
category: thirdparty
tags: [supervisor, 进程管理, 监控, 自动重启, 日志管理, 系统管理]
description: Supervisor是用Python开发的客户端/服务器系统，用于管理和监控Linux/Unix系统下的进程，提供自动重启、日志管理和Web界面管理功能
author: Python 技术文档工程师
date: 2025-01-18
updated: 2025-01-18
version: 1.0
difficulty: "中级"
---

# Supervisor - Python进程管理与监控系统

## 📝 概述

Supervisor 是用Python开发的一个客户端/服务器系统，专门用于管理和监控Linux/Unix系统下的进程。它可以很方便地监听、启动、停止、重启一个或多个进程，当一个进程意外被杀死时，Supervisor能够自动将其重新拉起，实现进程的自动恢复功能。

Supervisor 不支持Windows系统，主要特点包括：
- **自动重启**：进程异常退出时自动重启
- **统一管理**：通过配置文件统一管理多个进程
- **日志管理**：自动记录进程的输出和错误日志
- **Web界面**：提供可视化的Web管理界面
- **状态监控**：实时监控进程运行状态

## 🎯 学习目标

通过本文档的学习，你将能够：

- 理解 Supervisor 的架构和工作原理
- 掌握 Supervisor 的安装和基础配置
- 学会编写进程配置文件管理应用程序
- 熟练使用 supervisorctl 命令行工具
- 配置并使用 Web 管理界面
- 了解多进程管理和事件监听机制
- 能够排查常见的配置和运行问题

## 📋 前置知识

- Linux/Unix 系统基础操作
- Python 基础知识和虚拟环境概念
- 进程和守护进程的基本概念
- 基本的网络和端口配置知识
- 了解系统服务和开机自启动概念

## 🔍 详细内容

### 基本概念

Supervisor 主要由三个组件构成：
- **supervisord**：守护进程服务，用于接收进程管理命令
- **supervisorctl**：客户端工具，用于和守护进程通信，发送管理进程的指令
- **echo_supervisord_conf**：生成初始配置文件的程序

### 安装配置

#### 安装 Supervisor

```bash
# 使用 pip 安装
pip install supervisor

# 或者使用系统包管理器（Ubuntu/Debian）
sudo apt-get install supervisor
```

#### 生成配置文件

```bash
# 创建配置目录
mkdir /etc/supervisor

# 生成默认配置文件
echo_supervisord_conf > /etc/supervisor/supervisord.conf
```

#### 设置环境变量（如需要）

```bash
# 编辑 bash_profile
vim ~/.bash_profile

# 添加Python路径
PATH=$PATH:$HOME/bin:/usr/local/python/bin

# 重新加载配置
source ~/.bash_profile
```

### 语法格式

#### 主配置文件结构

```ini
# /etc/supervisor/supervisord.conf

[unix_http_server]
file=/tmp/supervisor.sock   ; UNIX socket文件路径
chmod=0700                  ; socket文件权限
;username=user              ; 连接用户名
;password=123               ; 连接密码

[inet_http_server]          ; HTTP服务器配置（Web界面）
port=127.0.0.1:9001        ; 监听IP和端口
;username=user              ; Web界面用户名
;password=123               ; Web界面密码

[supervisord]               ; supervisord主进程配置
logfile=/tmp/supervisord.log ; 日志文件路径
logfile_maxbytes=50MB       ; 日志文件最大大小
logfile_backups=10          ; 日志文件备份数量
loglevel=info               ; 日志级别
pidfile=/tmp/supervisord.pid ; PID文件路径
nodaemon=false              ; 是否前台运行

[rpcinterface:supervisor]   ; RPC接口配置（必需）
supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface

[supervisorctl]             ; supervisorctl客户端配置
serverurl=unix:///tmp/supervisor.sock ; 连接地址

[include]                   ; 包含其他配置文件
files = /etc/supervisor/config.d/*.ini
```

#### 进程配置文件

```ini
# /etc/supervisor/config.d/myapp.ini

[program:myapp]             ; 程序名称
command=/usr/bin/python3 /path/to/myapp.py  ; 启动命令
directory=/path/to          ; 工作目录
user=appuser                ; 运行用户
autostart=true              ; 开机自启动
autorestart=true            ; 自动重启
startsecs=10                ; 启动10秒后认为成功
startretries=3              ; 启动重试次数
redirect_stderr=true        ; 重定向stderr到stdout
stdout_logfile=/var/log/myapp.log           ; 标准输出日志
stdout_logfile_maxbytes=20MB                ; 日志文件最大大小
stdout_logfile_backups=20                   ; 日志备份数量
environment=PATH="/usr/local/bin:/usr/bin"  ; 环境变量
```

### 参数说明

#### supervisord 主要参数

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|------|
| logfile | str | 否 | $CWD/supervisord.log | 日志文件路径 |
| logfile_maxbytes | str | 否 | 50MB | 日志文件最大大小 |
| logfile_backups | int | 否 | 10 | 日志备份文件数量 |
| loglevel | str | 否 | info | 日志级别 |
| pidfile | str | 否 | $CWD/supervisord.pid | PID文件路径 |
| nodaemon | bool | 否 | false | 是否前台运行 |
| minfds | int | 否 | 1024 | 最小文件描述符数 |
| minprocs | int | 否 | 200 | 最小进程描述符数 |

#### program 主要参数

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|------|
| command | str | 是 | - | 程序启动命令 |
| directory | str | 否 | - | 程序运行目录 |
| user | str | 否 | - | 运行程序的用户 |
| autostart | bool | 否 | true | 是否自动启动 |
| autorestart | str | 否 | unexpected | 自动重启策略 |
| startsecs | int | 否 | 1 | 启动成功判定时间 |
| startretries | int | 否 | 3 | 启动重试次数 |
| priority | int | 否 | 999 | 启动优先级 |
| redirect_stderr | bool | 否 | false | 是否重定向stderr |
| stdout_logfile | str | 否 | AUTO | 标准输出日志文件 |
| numprocs | int | 否 | 1 | 进程实例数量 |

### 返回值

| 命令 | 返回值 | 说明 |
|------|--------|------|
| supervisorctl status | 状态信息 | 显示所有进程运行状态 |
| supervisorctl start | 成功/失败 | 启动指定进程 |
| supervisorctl stop | 成功/失败 | 停止指定进程 |
| supervisorctl restart | 成功/失败 | 重启指定进程 |

## 💡 实际应用

### 基础用法

#### 示例一：管理Web应用

```ini
# /etc/supervisor/config.d/webapp.ini
[program:webapp]
command=/usr/bin/python3 /home/www/app.py
directory=/home/www
user=www-data
autostart=true
autorestart=true
startsecs=5
redirect_stderr=true
stdout_logfile=/var/log/webapp.log
environment=FLASK_ENV="production"
```

```bash
# 启动supervisor
supervisord -c /etc/supervisor/supervisord.conf

# 检查状态
supervisorctl status

# 重新加载配置
supervisorctl reread
supervisorctl update
```

### 高级用法

#### 示例二：多进程管理

```ini
# 管理多个worker进程
[program:worker]
command=/usr/bin/python3 /home/app/worker.py
process_name=%(program_name)s_%(process_num)02d
numprocs=4                  ; 启动4个进程
directory=/home/app
user=appuser
autostart=true
autorestart=true
startsecs=5
startretries=3
stderr_logfile=/tmp/worker_err.log
stdout_logfile=/tmp/worker_out.log
```

#### 示例三：Nginx进程管理

```ini
[program:nginx]
command=/usr/local/nginx/sbin/nginx -g 'daemon off;'
autostart=true
autorestart=true
user=root
startsecs=3
stdout_logfile=/etc/supervisor/logs/nginx.log
stderr_logfile=/etc/supervisor/logs/nginx-error.log
```

**注意**：必须使用 `daemon off` 参数让nginx在前台运行，否则supervisor无法管理后台进程。

### 实际案例

#### 案例一：Django应用部署

```ini
# Django + Gunicorn 配置
[program:django_app]
command=/home/venv/bin/gunicorn myproject.wsgi:application
directory=/home/myproject
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/django.log
environment=DJANGO_SETTINGS_MODULE="myproject.settings.production"
```

#### 案例二：Redis服务管理

```ini
[program:redis]
command=/usr/local/bin/redis-server /etc/redis/redis.conf --daemonize no
directory=/var/lib/redis
user=redis
autostart=true
autorestart=true
stdout_logfile=/var/log/redis/redis.log
stderr_logfile=/var/log/redis/redis-error.log
```

## ⚠️ 注意事项

### 配置注意事项

1. **进程前台运行**：被管理的程序必须以前台模式运行，不能自己变成守护进程
2. **权限问题**：确保supervisor有权限执行目标程序和写入日志文件
3. **路径问题**：使用绝对路径指定命令和文件路径
4. **环境变量**：需要的环境变量必须在配置中显式指定

### 常见问题解决

#### 问题1：端口占用错误
```bash
# 错误：Another program is already listening on a port
# 解决方案：杀死已存在的进程
ps -ef | grep supervisord
kill -s SIGTERM [PID]
# 或者删除socket文件
unlink /tmp/supervisor.sock
```

#### 问题2：中文程序名支持
```ini
# 在配置文件中添加环境变量
environment=LANG="en_US.UTF-8",LC_ALL="en_US.UTF-8"
```

#### 问题3：pip安装问题
```bash
# 如果pip安装报错，可以指定源
pip install supervisor -i http://pypi.douban.com/simple --trusted-host pypi.douban.com
```

### 安全建议

1. **Web界面安全**：如果开启Web界面，必须设置用户名密码，避免公网暴露
2. **文件权限**：合理设置配置文件和socket文件的权限
3. **日志轮转**：定期清理日志文件，避免磁盘空间不足
4. **用户隔离**：不同应用使用不同的用户运行，遵循最小权限原则

## 🔗 相关内容

- [systemd 系统服务管理](../systemd/)
- [Docker 容器化部署](../docker/)
- [Nginx 反向代理配置](../nginx/)
- [Python 应用部署最佳实践](../python-deployment/)

## 📚 扩展阅读

- [Supervisor 官方文档](http://supervisord.org/)
- [Supervisor GitHub 仓库](https://github.com/Supervisor/supervisor)
- [进程管理最佳实践指南](https://12factor.net/processes)
- [Linux 系统服务管理详解](https://systemd.io/)

---

**标签**: #supervisor #进程管理 #监控 #自动重启 #日志管理 #系统管理