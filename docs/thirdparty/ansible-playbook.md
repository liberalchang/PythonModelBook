---
layout: doc
title: Ansible Playbook - 剧本编写与任务编排
permalink: /docs/thirdparty/ansible-playbook/
category: thirdparty
tags: [Ansible, Playbook, 自动化, 配置管理, DevOps, YAML]
description: 系统介绍Ansible Playbook的编写方法与进阶用法，包括变量、模板、条件、循环、handlers、roles等核心概念与实战示例
author: Python技术文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# Ansible Playbook - 剧本编写与任务编排

## 📝 概述

Playbook是Ansible用于描述自动化任务的YAML文件。它以可读的方式组织一组主机、变量和一系列任务（Tasks），并提供条件、循环、通知（notify/handlers）以及角色（Roles）以实现复杂的自动化编排。

## 🎯 学习目标

- 掌握Playbook的基本结构
- 学会定义变量、使用模板（Jinja2）
- 能够编写条件与循环
- 使用handlers实现变更驱动的操作
- 理解并使用roles组织大型项目
- 了解常见的Playbook实践模式

## 📋 前置知识

- 熟悉Ansible基础与Inventory配置
- 了解YAML语法
- 理解SSH免密登录配置

## 📦 基本结构

一个最小的Playbook示例：

```yaml
- name: 基本示例
  hosts: webservers
  become: yes
  vars:
    pkg: nginx
  tasks:
    - name: 安装软件包
      apt:
        name: "{{ pkg }}"
        state: present
      when: ansible_os_family == 'Debian'

    - name: 启动服务
      service:
        name: "{{ pkg }}"
        state: started
        enabled: yes
```

字段说明：
- name: Play或Task的说明
- hosts: 目标主机或主机组
- become: 是否提权
- vars: 变量定义
- tasks: 任务列表

## 🔧 变量与优先级

常见变量来源：
- 在Playbook中使用 vars 定义
- 通过 `-e/--extra-vars` 从命令行传入
- Inventory中的组变量与主机变量
- 角色（Role）中的默认变量与变量
- Facts（setup模块收集的信息）

命令行示例：

```bash
ansible-playbook site.yml -e "env=prod version=1.2.3"
```

变量引用：`{{ variable_name }}`。支持过滤器，如：

```yaml
vars:
  port: 8080
  workers: 2

- name: 渲染配置
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
```

## 🧩 条件与循环

条件执行：

```yaml
- name: 仅在Debian执行
  apt:
    name: nginx
    state: latest
  when: ansible_os_family == 'Debian'
```

循环（with_items / loop）：

```yaml
- name: 创建多个目录
  file:
    path: "/data/{{ item }}"
    state: directory
    mode: '0755'
  loop:
    - app
    - logs
    - tmp
```

注册变量与条件：

```yaml
- name: 检查文件是否存在
  stat:
    path: /etc/nginx/nginx.conf
  register: nginx_conf

- name: 备份配置
  copy:
    src: /etc/nginx/nginx.conf
    dest: /etc/nginx/nginx.conf.bak
  when: nginx_conf.stat.exists
```

## 🔔 Handlers与通知

当某些任务发生改变时触发处理器：

```yaml
- hosts: web
  become: yes
  tasks:
    - name: 部署配置
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
      notify: 重启nginx

  handlers:
    - name: 重启nginx
      service:
        name: nginx
        state: restarted
```

注意：相同名称的handler在一次Play中只会执行一次（即使被多次notify）。

## 🧪 模板（Jinja2）

Jinja2模板用于动态生成文件，例如Nginx配置：

nginx.conf.j2：

```jinja
user nginx;
worker_processes auto;

http {
  server {
    listen {{ port }};
    location / {
      proxy_pass http://127.0.0.1:{{ app_port }};
    }
  }
}
```

在Playbook中引用：

```yaml
- name: 渲染Nginx配置
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  notify: 重启nginx
```

## 📁 组织结构与Roles

随着Playbook规模扩大，推荐使用roles：

目录结构（示例）：

```
site.yml
inventories/
  production/
    hosts
    group_vars/
      webservers.yml
    host_vars/
      web1.yml
roles/
  web/
    tasks/
      main.yml
    handlers/
      main.yml
    templates/
      nginx.conf.j2
    files/
    vars/
      main.yml
    defaults/
      main.yml
    meta/
      main.yml
```

- tasks: 主要任务入口
- handlers: 变更触发处理
- templates: Jinja2模板
- files: 静态文件
- vars: 角色内部变量
- defaults: 角色默认变量（优先级最低）
- meta: 角色依赖等元数据

在site.yml中引用：

```yaml
- hosts: webservers
  become: yes
  roles:
    - role: web
```

## 🔄 标签与选择性执行

使用tags选择性地运行部分任务：

```yaml
- hosts: all
  tasks:
    - name: 安装nginx
      apt: { name: nginx, state: present }
      tags: ['install','nginx']

    - name: 部署配置
      template: { src: nginx.conf.j2, dest: /etc/nginx/nginx.conf }
      tags: ['config','nginx']
```

命令行：

```bash
# 仅运行带install标签的任务
ansible-playbook site.yml --tags install

# 跳过带config标签的任务
ansible-playbook site.yml --skip-tags config
```

## 🔐 凭据与敏感信息（Ansible Vault）

使用Vault加密敏感变量：

```bash
# 创建加密文件
ansible-vault create secrets.yml

# 编辑加密文件
ansible-vault edit secrets.yml

# 查看加密文件
ansible-vault view secrets.yml

# 运行playbook时指定vault密码
ansible-playbook site.yml --ask-vault-pass
```

## 🧰 常用实践：从零部署一个Web服务

示例：在Debian系统上部署并启动nginx

site.yml：

```yaml
- hosts: webservers
  become: yes
  vars:
    pkg: nginx
    port: 80
  tasks:
    - name: 使用apt安装nginx
      apt:
        name: "{{ pkg }}"
        state: present
      when: ansible_os_family == 'Debian'

    - name: 渲染nginx配置
      template:
        src: templates/nginx.conf.j2
        dest: /etc/nginx/nginx.conf
      notify: 重启nginx

  handlers:
    - name: 重启nginx
      service:
        name: nginx
        state: restarted
```

templates/nginx.conf.j2：

```jinja
user  nginx;
worker_processes auto;

http {
  server {
    listen {{ port }};
    location / {
      return 200 'Hello Ansible';
    }
  }
}
```

执行：

```bash
ansible-playbook -i inventories/production/hosts site.yml
```

## ⚠️ 注意事项

- 幂等性：尽量使用幂等模块（如apt/yum/service等），避免使用非幂等的shell命令
- 变量优先级：命令行 -e > 角色vars > Inventory变量 > 角色defaults
- 错误处理：使用ignore_errors、failed_when等提高健壮性
- 性能：合理使用forks、serial、strategy等参数

## 🔗 相关内容

- [Ansible 基础 - 安装、配置与常用模块](../ansible-basics/)
- [Paramiko - Python SSH远程控制模块](../paramiko/)
- Jinja2 模板引擎: https://jinja.palletsprojects.com/

## 📚 扩展阅读

- Ansible User Guide: https://docs.ansible.com/ansible/latest/user_guide/index.html
- Playbook Best Practices: https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html
- Jinja2 Template Designer Documentation: https://jinja.palletsprojects.com/

---

最后更新: 2024-01-15  
作者: Python技术文档工程师  
版本: 1.0