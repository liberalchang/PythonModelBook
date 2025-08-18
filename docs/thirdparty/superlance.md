---
layout: doc
title: Superlance - Supervisor进程监控扩展工具包
permalink: /docs/thirdparty/superlance/
category: thirdparty
tags: [监控, 进程管理, Supervisor, 邮件通知, 内存监控]
description: Superlance是Supervisor的扩展工具包，提供进程状态监控、内存使用监控、HTTP健康检查等功能，支持邮件和短信通知
author: Python 技术文档工程师
date: 2024-01-18
updated: 2024-01-18
version: 1.0
difficulty: "中级"
---

# Superlance - Supervisor进程监控扩展工具包

## 📝 概述

Superlance是一个工具包，它集成了可以对运行在Supervisor中的进程进行监控与控制的相关工具代码。它提供了多种监控组件，如进程状态监控、内存使用监控、HTTP健康检查等，并支持通过邮件或短信发送告警通知。

## 🎯 学习目标

- 理解Superlance的作用和核心功能
- 掌握各种监控组件的安装和配置
- 学会设置进程状态监控和内存监控
- 能够配置HTTP健康检查和邮件通知
- 了解常见问题的解决方案

## 📋 前置知识

- 熟悉Supervisor的基本使用和配置
- 了解Linux进程管理和监控概念
- 掌握SMTP邮件服务器配置
- 理解事件监听器的工作原理

## 🔍 详细内容

### 基本概念

Superlance是Supervisor的官方扩展工具包，通过事件监听器机制对Supervisor管理的进程进行监控。它包含6个主要组件：

- **httpok**: HTTP健康检查监控
- **crashmail**: 进程崩溃邮件通知
- **memmon**: 内存使用监控
- **crashmailbatch**: 批量崩溃邮件通知
- **fatalmailbatch**: 致命错误批量邮件通知
- **crashsms**: 崩溃短信通知

### 安装和基本配置

#### 安装Superlance

```bash
## 使用pip安装Superlance
pip install superlance

## 验证安装是否成功
ls /usr/local/bin/crash* /usr/local/bin/httpok /usr/local/bin/memmon
# 应该显示6个可执行文件：crashmail, crashmailbatch, crashsms, fatalmailbatch, httpok, memmon
```

#### 在Supervisor中启用事件监听器

```ini
## 在supervisord.conf中配置事件监听器
[eventlistener:crashmail]
command=/usr/local/bin/crashmail -a -m admin@example.com
events=PROCESS_STATE_EXITED
stdout_logfile=/var/log/supervisor/crashmail.log
stderr_logfile=/var/log/supervisor/crashmail.err
autorestart=false

## 如果Supervisor启用了身份认证，需要配置环境变量
;environment=SUPERVISOR_USERNAME="username",SUPERVISOR_PASSWORD="password"
```

### 核心组件配置

#### httpok - HTTP健康检查

httpok通过定期发送HTTP请求检测服务是否正常运行。

```ini
## 基本HTTP健康检查配置
[eventlistener:httpok]
command=/usr/local/bin/httpok -p nginx http://localhost
events=TICK_60
autorestart=false
stdout_logfile=/var/log/supervisor/httpok.log
stderr_logfile=/var/log/supervisor/httpok.err

## 高级配置示例
[eventlistener:httpok_advanced]
command=/usr/local/bin/httpok -p webapp -t 30 -c 200 -m admin@example.com http://localhost:8080/health
events=TICK_30
autorestart=false
stdout_logfile=/var/log/supervisor/httpok_advanced.log
stderr_logfile=/var/log/supervisor/httpok_advanced.err
```

**httpok参数说明**：

| 参数 | 全称 | 说明 | 默认值 |
|------|------|------|--------|
| -p | --process | 指定要监控的进程名 | 无 |
| -a | --any | 监控所有进程 | false |
| -t | --timeout | HTTP请求超时时间(秒) | 10 |
| -c | --code | 期望的HTTP状态码 | 200 |
| -b | --body | 期望的响应内容 | 无 |
| -m | --email | 收件人邮箱地址 | 无 |
| -s | --sendmail | sendmail命令路径 | /usr/sbin/sendmail -t -i |

#### memmon - 内存监控

memmon监控进程内存使用情况，超出限制时自动重启进程。

```ini
## 基本内存监控配置
[eventlistener:memmon]
command=/usr/local/bin/memmon -a 500MB -m admin@example.com
events=TICK_60
autorestart=false
stdout_logfile=/var/log/supervisor/memmon.log
stderr_logfile=/var/log/supervisor/memmon.err

## 针对特定进程的内存监控
[eventlistener:memmon_specific]
command=/usr/local/bin/memmon -p webapp=200MB -p redis=100MB -m admin@example.com
events=TICK_60
autorestart=false
stdout_logfile=/var/log/supervisor/memmon_specific.log
stderr_logfile=/var/log/supervisor/memmon_specific.err
```

**memmon参数说明**：

| 参数 | 全称 | 说明 | 示例 |
|------|------|------|------|
| -p | --process | 指定进程和内存限制 | -p nginx=100MB |
| -g | --group | 指定进程组和内存限制 | -g webgroup=500MB |
| -a | --any | 任意进程的内存限制 | -a 200MB |
| -c | --cumulative | 累计子进程内存 | -c |
| -m | --email | 收件人邮箱 | -m admin@example.com |
| -s | --sendmail | sendmail命令 | -s "/usr/sbin/sendmail -t -i" |

#### crashmail - 进程崩溃通知

crashmail监控进程退出事件并发送邮件通知。

```ini
## 监控所有进程崩溃
[eventlistener:crashmail]
command=/usr/local/bin/crashmail -a -m admin@example.com
events=PROCESS_STATE_EXITED
autorestart=false
stdout_logfile=/var/log/supervisor/crashmail.log
stderr_logfile=/var/log/supervisor/crashmail.err

## 监控特定进程
[eventlistener:crashmail_specific]
command=/usr/local/bin/crashmail -p webapp -p nginx -m admin@example.com
events=PROCESS_STATE_EXITED
autorestart=false
stdout_logfile=/var/log/supervisor/crashmail_specific.log
stderr_logfile=/var/log/supervisor/crashmail_specific.err
```

#### crashmailbatch - 批量邮件通知

crashmailbatch将一定时间内的多个告警批量发送，避免邮件轰炸。

```ini
## 批量邮件通知配置
[eventlistener:crashmailbatch]
command=/usr/local/bin/crashmailbatch --toEmail="admin@example.com" --fromEmail="supervisor@example.com"
events=PROCESS_STATE,TICK_60
autorestart=false
stdout_logfile=/var/log/supervisor/crashmailbatch.log
stderr_logfile=/var/log/supervisor/crashmailbatch.err

## 使用SMTP服务器发送
[eventlistener:crashmailbatch_smtp]
command=/usr/local/bin/crashmailbatch -t admin@example.com -f supervisor@example.com -H smtp.gmail.com -u smtp_user -p smtp_pass --tls
events=PROCESS_STATE,TICK_60
autorestart=false
stdout_logfile=/var/log/supervisor/crashmailbatch_smtp.log
stderr_logfile=/var/log/supervisor/crashmailbatch_smtp.err
```

## 💡 实际应用

### Web应用监控配置

```ini
## 综合监控Web应用的配置示例
[eventlistener:webapp_httpok]
command=/usr/local/bin/httpok -p webapp -t 15 -c 200 -m admin@example.com http://localhost:8080/health
events=TICK_30
autorestart=false
stdout_logfile=/var/log/supervisor/webapp_httpok.log
stderr_logfile=/var/log/supervisor/webapp_httpok.err

[eventlistener:webapp_memmon]
command=/usr/local/bin/memmon -p webapp=512MB -m admin@example.com -u 1d
events=TICK_60
autorestart=false
stdout_logfile=/var/log/supervisor/webapp_memmon.log
stderr_logfile=/var/log/supervisor/webapp_memmon.err

[eventlistener:webapp_crashmail]
command=/usr/local/bin/crashmail -p webapp -m admin@example.com -o "WebApp Alert"
events=PROCESS_STATE_EXITED
autorestart=false
stdout_logfile=/var/log/supervisor/webapp_crashmail.log
stderr_logfile=/var/log/supervisor/webapp_crashmail.err
```

### 数据库服务监控

```ini
## Redis监控配置
[eventlistener:redis_monitor]
command=/usr/local/bin/memmon -p redis=256MB -m dba@example.com
events=TICK_60
autorestart=false
stdout_logfile=/var/log/supervisor/redis_monitor.log
stderr_logfile=/var/log/supervisor/redis_monitor.err

## MySQL监控配置  
[eventlistener:mysql_monitor]
command=/usr/local/bin/memmon -p mysql=1GB -m dba@example.com -u 12h
events=TICK_60
autorestart=false
stdout_logfile=/var/log/supervisor/mysql_monitor.log
stderr_logfile=/var/log/supervisor/mysql_monitor.err
```

### 使用msmtp替代sendmail

当系统没有sendmail时，可以使用msmtp作为替代：

```bash
## 安装msmtp
sudo apt-get install msmtp

## 配置msmtp
cat > ~/.msmtprc << EOF
defaults
auth on
tls on
tls_trust_file /etc/ssl/certs/ca-certificates.crt

account gmail
host smtp.gmail.com
port 587
from your-email@gmail.com
user your-email@gmail.com
password your-app-password

account default : gmail
EOF

chmod 600 ~/.msmtprc
```

```ini
## 在Superlance中使用msmtp
[eventlistener:httpok_msmtp]
command=/usr/local/bin/httpok -p nginx -s "/usr/bin/msmtp -t" -m admin@example.com http://localhost
events=TICK_60
autorestart=false
stdout_logfile=/var/log/supervisor/httpok_msmtp.log
stderr_logfile=/var/log/supervisor/httpok_msmtp.err
```

## ⚠️ 注意事项

### 权限和身份验证

- **Supervisor身份验证**: 如果Supervisor启用了身份验证，需要在事件监听器中配置环境变量
- **邮件服务依赖**: 确保sendmail或msmtp正确配置并可用
- **日志文件权限**: 确保Supervisor有权限写入指定的日志文件

### 监控范围限制

- **直接子进程监控**: Superlance只能监控Supervisor直接管理的进程
- **派生进程不可见**: 由Supervisor子进程创建的孙进程无法被监控
- **系统兼容性**: memmon依赖ps命令，主要支持Linux和macOS

### 邮件配置问题

```bash
## 测试sendmail是否工作
echo "Subject: Test Email
This is a test message." | /usr/sbin/sendmail -t -i your-email@example.com

## 测试msmtp是否工作
echo "Subject: Test msmtp
This is a test message." | /usr/bin/msmtp -t your-email@example.com
```

### 常见错误解决

#### 1. 权限错误 (401 Unauthorized)

```ini
## 解决方案：配置身份验证环境变量
[eventlistener:example]
command=/usr/local/bin/crashmail -a -m admin@example.com
events=PROCESS_STATE_EXITED
environment=SUPERVISOR_USERNAME="username",SUPERVISOR_PASSWORD="password"
```

#### 2. PATH环境变量问题

```bash
## 查找Superlance工具安装路径
which httpok crashmail memmon

## 使用绝对路径配置
command=/usr/local/bin/httpok -p nginx http://localhost
```

#### 3. 邮件发送失败

```bash
## 检查邮件服务状态
systemctl status postfix  # 或 sendmail

## 查看邮件队列
mailq

## 测试SMTP连接
telnet smtp.example.com 587
```

## 🔗 相关内容

- [Supervisor - Python进程管理与监控系统](../supervisor/)
- [Python logging模块 - 日志记录与管理](../../stdlib/logging/)
- [Loguru - 简单易用的日志记录库](../loguru/)

## 📚 扩展阅读

- [Superlance官方文档](https://superlance.readthedocs.io/)
- [Superlance GitHub仓库](https://github.com/Supervisor/superlance)
- [Supervisor事件系统文档](http://supervisord.org/events.html)
- [MSMTP邮件服务配置指南](https://marlam.de/msmtp/)

## 🏷️ 标签

`监控` `进程管理` `Supervisor` `邮件通知` `内存监控`

---

**最后更新**: 2024-01-18  
**作者**: Python 技术文档工程师  
**版本**: 1.0