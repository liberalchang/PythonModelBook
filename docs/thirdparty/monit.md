---
layout: doc
title: Monit - Unix系统监控与管理工具
permalink: /docs/thirdparty/monit/
category: thirdparty
tags: [监控, 系统管理, 进程管理, 自动维护, Unix]
description: Monit是一个小型开源的Unix系统监控和管理组件，可在错误情况下自动维护、修复和执行有意义的行为
author: Python 技术文档工程师
date: 2024-01-18
updated: 2024-01-18
version: 1.0
difficulty: "中级"
---

# Monit - Unix系统监控与管理工具

## 📝 概述

Monit是一个管理和监控Unix系统的小型开源组件。它可以在出现错误的情况下，自动维护、修复和执行一些有意义的行为。与Supervisor相比，Monit提供了更加轻量级和非侵入式的监控解决方案，支持监控进程、文件、文件系统和系统资源等多种类型。

## 🎯 学习目标

- 理解Monit的核心功能和工作原理
- 掌握Monit与Supervisor的区别和选择标准
- 学会配置各种类型的监控项目
- 能够编写和管理Monit配置文件
- 了解生产环境中的最佳实践

## 📋 前置知识

- 熟悉Unix/Linux系统基本操作
- 了解进程管理和系统监控概念
- 掌握基本的shell脚本编写
- 理解PID文件和进程监控原理

## 🔍 详细内容

### Monit VS Supervisor

#### Monit是什么

- Monit是一个管理和监控Unix系统的小型开源组件
- Monit可以在出现错误的情况下，自动维护、修复和执行一些有意义的行为

#### 为什么选择Monit

除了Monit还有一些其他的第三方监控方案(如Supervisor)，选择Monit作为监控的原因有：

- **超轻量、稳定、高可用**: 资源占用少，运行稳定
- **依赖少，安装配置方便**: 减少运维及学习成本，即使没有任何Monit基础的人，都能轻易读懂大部分监控文件
- **非侵入式**: 被监控的程序可以不用知道监控程序的存在(如果使用Supervisor监控，则服务必须从Supervisor启动)
- **基本功能完备**: 9种类型监控，邮件报警，支持用户自定义shell扩展

#### Supervisor优缺点

**优点**

1. 轻量、特性丰富、内存友好
2. 对被监控进程的状态获取迅速且精确——通过子进程管理，没办法不精确

**缺点**

1. 被监控进程必须运行在前台(可以理解为有自己的控制终端)——这也是最为致命的一点
2. 无法管理依赖，也就是说无法控制服务启动先后顺序
3. 无法管理被监控进程创建的子进程——重启服务时被监控进程的子进程无法正常退出，隐患大
4. 无法控制进程失败重试的间隔时间——有些进程需要清理资源

#### Monit优缺点

**优点**

1. 安装配置简单，同样轻量
2. 可以监控前台进程和非前台进程——完美的弥补了supervisor的致命缺点
3. 除了监控进程还能监控文件、文件系统，甚至系统资源，CPU利用率，内存使用也是可以的
4. 被监控的进程可以设置依赖，控制启动顺序

**缺点**

1. 无法监控没有pid文件的进程，如shell脚本
2. 对进程监控的状态感知有延时，即精度不够——采用轮询决定了它无法像supervisor一样实时感知被监控进程状态

### Monit基本用法

#### Monit常用命令

```bash
# 查看帮助信息
monit -h

# 常用选项
-c file       # 使用指定的控制文件
-d n          # 作为守护进程运行，每n秒检查一次
-g name       # 为monit命令设置组名
-l logfile    # 将日志信息输出到指定文件
-p pidfile    # 在守护进程模式下使用此锁文件
-s statefile  # 设置monit写入状态信息的文件
-I            # 不在后台运行(从init运行时需要)
-t            # 对控制文件进行语法检查
-v            # 详细模式，输出诊断信息
-vv           # 非常详细的模式，包含错误时的堆栈跟踪
-V            # 打印版本号和补丁级别
```

#### 基本命令操作

```bash
# 配置文件相关
monit -t                              # 语法检查
monit -c /var/monit/monitrc          # 指定配置文件

# 服务控制
monit start all                       # 启动所有服务
monit start <name>                    # 启动指定服务
monit stop all                        # 停止所有服务
monit stop <name>                     # 停止指定服务
monit restart all                     # 重启所有服务
monit restart <name>                  # 重启指定服务

# 监控控制
monit monitor all                     # 启用所有服务监控
monit monitor <name>                  # 启用指定服务监控
monit unmonitor all                   # 禁用所有服务监控
monit unmonitor <name>                # 禁用指定服务监控

# 系统操作
monit reload                          # 重新初始化monit
monit status [name]                   # 打印服务的完整状态信息
monit summary [name]                  # 打印服务的简短状态信息
monit quit                            # 终止monit守护进程
monit validate                        # 检查所有服务并启动未运行的服务

# 分组操作
monit -g <groupname> start/stop       # 对指定分组统一操作

# 进程匹配测试
monit procmatch <pattern>             # 测试进程匹配模式
```

### 监控配置文件格式

Monit支持9种类型的监控，所有配置都符合以下规则：

- 如果指定的path不存在，而且配置块里包含start方法，会调用这个start方法
- 如果path指定的文件类型不对，Monit不能监控这个项目

#### 1. Process - 进程监控

```bash
CHECK PROCESS <unique name> <PIDFILE <path> | MATCHING <regex>>

# 示例：通过PID文件监控
check process nginx with pidfile /var/run/nginx.pid
    start program = "/usr/sbin/nginx"
    stop program = "/usr/sbin/nginx -s quit"
    if failed host 127.0.0.1 port 80 then restart
    if 5 restarts within 5 cycles then timeout

# 示例：通过进程名监控
check process sshd with matching sshd
    start program = "/etc/init.d/ssh start"
    stop program = "/etc/init.d/ssh stop"
```

#### 2. File - 文件监控

```bash
CHECK FILE <unique name> PATH <path>

# 示例：监控配置文件
check file nginx_conf with path /etc/nginx/nginx.conf
    if changed timestamp then alert
    if changed checksum then alert
```

#### 3. Fifo - 命名管道监控

```bash
CHECK FIFO <unique name> PATH <path>

# 示例：监控命名管道
check fifo myfifo with path /tmp/myfifo
    if failed permission 644 then alert
```

#### 4. Filesystem - 文件系统监控

```bash
CHECK FILESYSTEM <unique name> PATH <path>

# 示例：监控磁盘空间
check filesystem rootfs with path /
    if space usage > 80% then alert
    if inode usage > 80% then alert
```

#### 5. Directory - 目录监控

```bash
CHECK DIRECTORY <unique name> PATH <path>

# 示例：监控日志目录
check directory log_dir with path /var/log
    if failed permission 755 then alert
    if changed timestamp then alert
```

#### 6. Remote host - 远程主机监控

```bash
CHECK HOST <unique name> ADDRESS <host>

# 示例：监控远程主机
check host myserver with address 192.168.1.100
    if failed ping then alert
    if failed port 22 then alert
```

#### 7. System - 系统资源监控

```bash
CHECK SYSTEM <unique name>

# 示例：监控系统资源
check system $HOST
    if loadavg (1min) > 4 then alert
    if loadavg (5min) > 2 then alert
    if memory usage > 75% then alert
    if cpu usage (user) > 70% then alert
    if cpu usage (system) > 30% then alert
```

#### 8. Program - 程序脚本监控

```bash
CHECK PROGRAM <unique name> PATH <executable file> [TIMEOUT <number> SECONDS]

# 示例：监控脚本执行
check program diskspace with path "/bin/df"
    if status != 0 then alert
    every 5 cycles
```

#### 9. Network - 网络接口监控

```bash
CHECK NETWORK <unique name> <ADDRESS <ipaddress> | INTERFACE <name>>

# 示例：监控网络接口
check network eth0 with interface eth0
    if failed link then alert
    if saturation > 90% then alert
```

## 💡 实际应用

### 基础配置实例

```bash
# 基本监控配置文件 /etc/monit/monitrc
set daemon 60  # 每60秒检查一次
set logfile syslog facility log_daemon
set idfile /var/lib/monit/id
set statefile /var/lib/monit/state

# 设置邮件服务器
set mailserver localhost

# 设置报警接收者
set alert admin@example.com

# 监控Nginx进程
check process nginx with pidfile /var/run/nginx.pid
    start program = "/usr/sbin/nginx"
    stop program = "/usr/sbin/nginx -s quit"
    if failed host 127.0.0.1 port 80 then restart
    if 5 restarts within 5 cycles then timeout

# 监控MySQL进程
check process mysql with pidfile /var/run/mysqld/mysqld.pid
    start program = "/etc/init.d/mysql start"
    stop program = "/etc/init.d/mysql stop"
    if failed host 127.0.0.1 port 3306 then restart
    if 5 restarts within 5 cycles then timeout

# 监控系统资源
check system localhost
    if loadavg (1min) > 4 then alert
    if loadavg (5min) > 2 then alert
    if memory usage > 75% then alert
    if cpu usage (user) > 70% then alert
```

### 高级配置实例

```bash
# 高级监控配置示例
# 监控Web应用程序
check process webapp with pidfile /var/run/webapp.pid
    start program = "/usr/bin/webapp --daemon"
    stop program = "/bin/kill -QUIT $(cat /var/run/webapp.pid)"
    if failed host 127.0.0.1 port 8080 protocol http 
        and request "/health" then restart
    if total memory usage > 512 MB for 5 cycles then restart
    if total cpu usage > 80% for 5 cycles then restart
    if 3 restarts within 5 cycles then timeout
    depend on webapp_config
    group webapp

# 监控配置文件依赖
check file webapp_config with path /etc/webapp/config.yaml
    if changed checksum then restart webapp
    group webapp

# 监控磁盘空间
check filesystem datafs with path /data
    if space usage > 90% then alert
    if space usage > 95% then stop webapp
    if inode usage > 90% then alert

# 监控数据库连接
check program db_check with path "/usr/local/bin/check_db.sh"
    if status != 0 for 3 cycles then alert
    every 2 cycles
```

## 💡 配置实践

### 使用模板生成配置

#### 创建基础配置模板

```bash
# 创建通用配置 basic.j2
# 设置日志
set logfile /var/log/monit.log

# 设置检查间隔
set daemon {{ monit_poll_interval }}

# 设置事件队列
set eventqueue basedir /var/lib/monit/events slots 5000

# 设置邮件服务器
set mailserver smtp.xxx.com port 465

# 设置报警接收者
set alert xxx@xxx.com { nonexist, timeout, resource }

# 设置邮件格式
set mail-format {
  from: xxx@xxx.com
  subject: monit alert -- $SERVICE $EVENT at $DATE
  message: $EVENT Service $SERVICE
                Date:        $DATE
                Action:      $ACTION
                Host:        $HOST
                Description: $DESCRIPTION

           Your faithful employee,
           Monit
}
```

#### 创建标准应用监控模板

```bash
# 标准守护进程监控 daemon_set.j2
check process xxx with pidfile /run/xxx/daemon.pid
    start program = "/usr/bin/python2 /bin/xxx restart"
    stop program = "/usr/bin/python2 /bin/xxx stop"
    if 10 restarts within 10 cycles then unmonitor

check process xxxx with matching xxxx
    start program = "/etc/init.d/xxxx start"
    stop program = "/etc/init.d/xxxx stop"
    if 10 restarts within 10 cycles then unmonitor
```

#### 创建自定义应用监控模板

{% raw %}
```bash
# 自定义逻辑服务监控 logic_service.j2
check process {{ service_name }} with pidfile {{ root_dir }}/{{ service_name }}/deploy/{{ monit_name }}.pid
    start program = "/bin/bash -c 'cd {{ root_dir }}/{{ service_name }}/deploy && ./start.sh &>start.log '"
    stop program = "/bin/bash -c 'cd {{ root_dir }}/{{ service_name }}/deploy && ./stop.sh &>stop.log '"
    
    if 5 restarts within 15 cycles then unmonitor
    {% if memory_usage is defined %}
    if total memory usage > {{ memory_usage }} for 10 cycles then restart
    {% endif %}
```
{% endraw %}

### 使用Ansible自动化部署

{% raw %}
```yaml
# ansible playbook示例
- name: Deploy Monit Configuration
  hosts: servers
  vars:
    monit_poll_interval: 60
    services:
      - name: nginx
        pidfile: /var/run/nginx.pid
        start_cmd: "/usr/sbin/nginx"
        stop_cmd: "/usr/sbin/nginx -s quit"
        
  tasks:
    - name: Generate monit config
      template:
        src: "{{ item }}.j2"
        dest: "/etc/monit/conf.d/{{ item }}"
      loop:
        - basic
        - daemon_set
      notify: reload monit
      
    - name: Start monit service
      service:
        name: monit
        state: started
        enabled: yes
```
{% endraw %}

## ⚠️ 注意事项

### 配置文件注意事项

- **PID文件路径**: 确保PID文件路径正确，进程启动后能正常创建PID文件
- **权限问题**: Monit需要有足够权限读取PID文件和执行启动/停止命令
- **路径规范**: 所有路径都必须使用绝对路径
- **语法检查**: 配置完成后使用`monit -t`进行语法检查

### 监控精度vs资源消耗

- **检查间隔**: 较短的检查间隔提供更好的响应性，但消耗更多资源
- **重启策略**: 合理设置重启次数限制，避免无限重启循环
- **依赖关系**: 正确配置服务依赖关系，确保启动顺序

### 邮件报警配置

- **SMTP配置**: 确保邮件服务器配置正确
- **报警过滤**: 合理设置报警条件，避免报警轰炸
- **报警分组**: 对不同类型的服务设置不同的报警接收者

### 生产环境最佳实践

- **配置备份**: 定期备份Monit配置文件
- **日志轮转**: 配置日志轮转避免日志文件过大
- **监控监控**: 监控Monit本身的运行状态
- **测试验证**: 在测试环境充分验证配置后再部署到生产

## 🔗 相关内容

- [Supervisor - Python进程管理与监控系统](../supervisor/)
- [Superlance - Supervisor进程监控扩展工具包](../superlance/)
- [系统监控与日志管理最佳实践](../../stdlib/logging/)

## 📚 扩展阅读

- [Monit官方文档](https://mmonit.com/documentation/)
- [Monit配置示例](https://mmonit.com/wiki/Monit/ConfigurationExamples)
- [Unix系统监控最佳实践](https://www.kernel.org/doc/Documentation/)
- [进程管理与监控对比分析](https://en.wikipedia.org/wiki/Process_supervision)

## 🏷️ 标签

`监控` `系统管理` `进程管理` `自动维护` `Unix`

---

**最后更新**: 2024-01-18  
**作者**: Python 技术文档工程师  
**版本**: 1.0