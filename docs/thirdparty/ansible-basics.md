---
layout: doc
title: Ansible - 自动化运维与配置管理工具
permalink: /docs/thirdparty/ansible-basics/
category: thirdparty
tags: [自动化运维, 配置管理, SSH, 批量操作, 系统管理, DevOps]
description: Ansible是一个强大的自动化运维工具，通过SSH实现无Agent的远程管理，支持批量执行命令、配置管理和应用部署
author: Python技术文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# Ansible - 自动化运维与配置管理工具

## 📝 概述

Ansible是一个开源的自动化运维工具，基于Python开发，通过SSH协议实现对远程主机的管理。它采用无Agent架构，只需要在控制节点安装Ansible，被管理节点只需要开启SSH服务即可。Ansible通过Playbook描述自动化任务，实现配置管理、应用部署、任务执行等功能。

**主要特点：**
- 无Agent架构：被管理节点无需安装客户端程序
- 基于SSH：利用SSH协议进行安全通信
- 幂等性：多次执行相同任务结果一致
- 简单易学：使用YAML语法编写配置
- 模块化设计：丰富的内置模块支持各种操作

## 🎯 学习目标

通过本文档的学习，你将能够：

- 掌握Ansible的安装和基本配置
- 理解Ansible的核心概念和架构
- 配置主机清单（Inventory）
- 设置SSH密钥认证
- 使用Ansible执行基本的远程操作
- 了解常用命令和参数

## 📋 前置知识

- Linux/Unix系统基础知识
- SSH协议基本理解
- Python基础（有助于理解模块工作原理）
- YAML语法基础
- 网络基础概念

## 🔍 详细内容

### Ansible架构概念

Ansible包含以下核心组件：

- **控制节点（Control Node）**: 安装Ansible的机器，执行命令和playbook
- **被管理节点（Managed Node）**: 被Ansible管理的目标机器
- **清单（Inventory）**: 定义被管理节点的文件
- **模块（Module）**: 执行具体任务的代码单元
- **任务（Task）**: 对模块的调用
- **剧本（Playbook）**: 定义一系列任务的YAML文件

## 💡 实际应用

### 安装Ansible

**使用pip安装**（推荐）：

```bash
# 安装Ansible和SSH工具
pip3 install ansible
sudo apt-get install sshpass
```

**使用apt安装**（Ubuntu/Debian）：

```bash
sudo apt update
sudo apt install software-properties-common
sudo apt-add-repository --yes --update ppa:ansible/ansible
sudo apt install ansible
```

**从源码安装**：

```bash
git clone https://github.com/ansible/ansible.git
cd ./ansible

# 设置环境变量
# Using Bash:
source ./hacking/env-setup

# Using Fish:
source ./hacking/env-setup.fish

# 如果要抑制虚假警告/错误:
source ./hacking/env-setup -q
```

**验证安装**：

```bash
ansible --version
# 输出示例：
# ansible 2.7.7
#   config file = /etc/ansible/ansible.cfg
#   configured module search path = ['/root/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
#   ansible python module location = /usr/lib/python2.7/site-packages/ansible
#   executable location = /usr/bin/ansible
#   python version = 2.7.5 (default, Apr 11 2018, 07:36:10) [GCC 4.8.5 20150623 (Red Hat 4.8.5-28)]
```

### 自动补全配置

安装argcomplete以支持命令自动补全：

```bash
pip3 install argcomplete
```

### 基本配置

#### 配置文件结构

Ansible按以下优先级顺序查找配置文件：

1. `ANSIBLE_CONFIG` 环境变量指定的文件
2. 当前目录下的 `ansible.cfg`
3. 用户主目录下的 `~/.ansible.cfg`
4. 系统级配置文件 `/etc/ansible/ansible.cfg`

#### 生成示例配置文件

```bash
# 生成完全注释的示例配置文件
ansible-config init --disabled > ansible.cfg

# 生成包含现有插件的完整配置文件
ansible-config init --disabled -t all > ansible.cfg
```

#### 主要配置参数

编辑 `/etc/ansible/ansible.cfg`：

```ini
[defaults]
# 主机清单文件路径
inventory = /etc/ansible/hosts

# 并发执行数量
forks = 5

# 默认SSH端口
remote_port = 22

# 禁用SSH主机密钥检查（建议开启）
host_key_checking = False

# 默认远程用户
remote_user = root

# 日志文件路径（建议开启）
log_path = /var/log/ansible.log

# 角色存放路径
roles_path = /etc/ansible/roles

# 模块语言环境
module_lang = C

# 异步任务查询间隔（秒）
poll_interval = 15
```

### 主机清单配置

#### 清单文件格式

编辑 `/etc/ansible/hosts`：

```ini
# 单台主机（可以不分组）
192.168.1.100
www.example.com
192.168.1.101:2222  # 非标准SSH端口

# 主机分组
[webservers]
web1 ansible_host=192.168.1.10
web2 ansible_host=192.168.1.11
192.168.1.12

[databases]
db1 ansible_host=192.168.1.20 ansible_user=mysql
db2 ansible_host=192.168.1.21

# 连续IP地址范围
[cluster]
node[01:50] ansible_host=192.168.1.[1:50]

# 组变量设置
[webservers:vars]
ansible_user=nginx
ansible_ssh_pass=password123
ansible_port=22

# 组嵌套
[production:children]
webservers
databases
```

#### 主机变量参数

| 参数名 | 说明 | 示例 |
|-------|------|------|
| ansible_host | 目标主机IP或域名 | ansible_host=192.168.1.100 |
| ansible_port | SSH连接端口 | ansible_port=2222 |
| ansible_user | SSH连接用户名 | ansible_user=root |
| ansible_ssh_pass | SSH连接密码 | ansible_ssh_pass=password |
| ansible_ssh_private_key_file | 私钥文件路径 | ansible_ssh_private_key_file=/root/.ssh/id_rsa |
| ansible_connection | 连接类型 | ansible_connection=ssh |
| ansible_python_interpreter | Python解释器路径 | ansible_python_interpreter=/usr/bin/python3 |

### SSH密钥管理

#### 生成SSH密钥对

```bash
# 生成RSA密钥对
ssh-keygen -t rsa
# 按提示输入密钥文件路径（默认：/root/.ssh/id_rsa）
# 设置密钥密码（可选）
```

#### 推送公钥到目标主机

**单台主机推送**：

```bash
# 推送公钥到指定主机
ssh-copy-id root@192.168.1.100
ssh-copy-id root@192.168.1.101
```

**批量推送公钥**：

1. 在主机清单中配置密码认证：

```ini
[testservers]
192.168.1.100 ansible_user=root ansible_ssh_pass=password123
192.168.1.101 ansible_user=root ansible_ssh_pass=password123
```

2. 创建推送公钥的playbook文件 `push-ssh.yaml`：

```yaml
- hosts: testservers
  user: root
  tasks:
   - name: push ssh public key
     authorized_key: 
       user: root 
       key: "{{ lookup('file', '/root/.ssh/id_rsa.pub') }}"
     tags:
       - sshkey
```

3. 执行推送：

```bash
# 禁用主机密钥检查
echo "host_key_checking = False" >> /etc/ansible/ansible.cfg

# 执行批量推送
ansible-playbook push-ssh.yaml
```

#### 设置SSH免交互登录

```bash
# 启动ssh-agent
ssh-agent bash

# 添加私钥到agent
ssh-add
# 输入密钥密码
```

### 基本命令使用

#### 测试连通性

```bash
# 测试所有主机
ansible all -m ping

# 测试指定主机
ansible 192.168.1.100 -m ping

# 测试指定组
ansible webservers -m ping
```

#### 主机选择模式

```bash
# 单主机操作
ansible 192.168.1.100 -m ping

# 多主机操作（冒号分隔）
ansible "192.168.1.100:192.168.1.101" -m ping

# 通配符模式
ansible 192.168.1.* -m ping

# 组操作
ansible webservers -m ping

# 多组操作
ansible 'webservers:databases' -m ping

# 逻辑与操作（两个组都包含的主机）
ansible 'webservers:&databases' -m ping

# 逻辑非操作（在webservers组但不在databases组）
ansible 'webservers:!databases' -m ping

# 正则表达式
ansible '~(web|db).*' -m ping

# 所有主机
ansible all -m ping
ansible '*' -m ping
```

#### 执行Shell命令

```bash
# 执行简单命令
ansible all -m command -a 'uptime'
ansible webservers -m shell -a 'df -h'

# 使用sudo执行
ansible all -m command -a 'systemctl status nginx' --become

# 指定用户执行
ansible all -m command -a 'whoami' --become-user=nginx
```

#### 查看主机信息

```bash
# 列出主机清单
ansible all --list-hosts
ansible webservers --list-hosts

# 查看主机变量
ansible all -m setup
ansible 192.168.1.100 -m setup
```

### 常用模块示例

#### 文件操作

```bash
# 复制文件
ansible all -m copy -a "src=/etc/hosts dest=/tmp/hosts"

# 创建目录
ansible all -m file -a "path=/tmp/test state=directory mode=0755"

# 删除文件
ansible all -m file -a "path=/tmp/test.txt state=absent"
```

#### 包管理

```bash
# 安装软件包
ansible all -m yum -a "name=nginx state=present"
ansible all -m apt -a "name=nginx state=present"

# 卸载软件包
ansible all -m yum -a "name=nginx state=absent"
```

#### 服务管理

```bash
# 启动服务
ansible all -m service -a "name=nginx state=started"

# 停止服务
ansible all -m service -a "name=nginx state=stopped"

# 重启服务
ansible all -m service -a "name=nginx state=restarted"

# 设置开机自启
ansible all -m service -a "name=nginx enabled=yes"
```

## ⚠️ 注意事项

- **安全性**: 妥善保管SSH私钥，避免密码明文存储
- **权限管理**: 合理配置sudo权限，遵循最小权限原则
- **网络连通性**: 确保控制节点能够SSH连接到所有被管理节点
- **版本兼容**: 注意Ansible版本与Python版本的兼容性
- **并发控制**: 根据网络和系统性能调整forks参数
- **日志记录**: 启用日志记录便于问题排查和审计

## 🔗 相关内容

- [Ansible Playbook - 剧本编写与任务编排](../ansible-playbook/)
- [Paramiko - Python SSH远程控制模块](../paramiko/)
- [Schedule - Python 任务调度](../schedule/)

## 📚 扩展阅读

- [Ansible官方文档](https://docs.ansible.com/)
- [Ansible中文文档](https://cn-ansibledoc.readthedocs.io/)
- [Ansible GitHub仓库](https://github.com/ansible/ansible)
- [YAML语法指南](https://yaml.org/spec/1.2/spec.html)

## 🏷️ 标签

`自动化运维` `配置管理` `SSH` `批量操作` `DevOps` `系统管理`

---

**最后更新**: 2024-01-15  
**作者**: Python技术文档工程师  
**版本**: 1.0