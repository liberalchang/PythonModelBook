---
layout: doc
title: Paramiko - Python SSH远程控制模块
permalink: /docs/thirdparty/paramiko/
category: thirdparty
tags: [网络编程, SSH, SFTP, 远程控制, 系统管理, 自动化]
description: Paramiko是实现SSHv2协议的Python库，提供SSH客户端和服务器功能，支持远程命令执行、文件传输和安全连接管理
author: Python技术文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# Paramiko - Python SSH远程控制模块

## 📝 概述

Paramiko是Python的SSH2协议库，基于cryptography实现。它提供了完整的SSH客户端和服务器功能，支持远程命令执行、文件传输（SFTP）、端口转发等，是运维自动化和远程管理的重要工具。

## 🎯 学习目标

通过本文档的学习，你将能够：

- 理解SSH协议和Paramiko的核心组件
- 掌握基于用户名密码和密钥的SSH连接方法
- 熟练使用SSHClient执行远程命令
- 掌握SFTP文件上传下载操作
- 了解Transport和Channel的底层机制
- 实现类似XShell的交互式终端功能
- 创建SSH服务端应用

## 📋 前置知识

- Python基础语法
- 网络编程基础概念
- Linux/Unix系统基础知识
- SSH协议基本理解

## 🔍 详细内容

### Paramiko核心组件

Paramiko包含两个核心组件：

- **SSHClient**: 类似于Linux的ssh命令，用于执行远程命令
- **SFTPClient**: 类似于Linux的sftp命令，用于文件传输操作

**基础概念**:

- **Channel**: 类Socket的安全SSH传输通道
- **Transport**: 加密会话，创建安全的通信隧道
- **Session**: 客户端与服务器的连接对象

### 安装配置

Paramiko安装需要以下模块：

```bash
# Python 3.6环境推荐版本
pip install ecdsa==0.13
pip install pycrypto==2.6.1
pip install paramiko==1.18.4

# 或者直接安装最新版本
pip install paramiko
```

Ubuntu系统可直接安装：

```bash
sudo apt install python3-paramiko
```

## 💡 实际应用

### 基于用户名密码的SSHClient连接

```python
#!/usr/bin/python
import paramiko

# 创建SSH客户端对象
ssh = paramiko.SSHClient()

# 允许将信任的主机自动加入到host_allow列表，此方法必须放在connect方法的前面
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

# 调用connect方法连接服务器
ssh.connect(hostname='192.168.2.129', port=22, username='super', password='super')

# 执行命令
stdin, stdout, stderr = ssh.exec_command('df -hl')

# 结果放到stdout中，如果有错误将放到stderr中
print(stdout.read().decode())

# 关闭连接
ssh.close()
```

### 基于用户名密码的Transport连接

Transport方式适用于需要执行多个操作的场景：

```python
import paramiko

# 实例化一个transport对象
trans = paramiko.Transport(('192.168.2.129', 22))
# 建立连接
trans.connect(username='super', password='super')

# 将sshclient的对象的transport指定为以上的trans
ssh = paramiko.SSHClient()
ssh._transport = trans

# 执行命令，和传统方法一样
stdin, stdout, stderr = ssh.exec_command('df -hl')
print(stdout.read().decode())

# 关闭连接
trans.close()
```

### 基于公钥密钥的SSHClient连接

```python
import paramiko

# 指定本地的RSA私钥文件，如果建立密钥对时设置的有密码，password为设定的密码
pkey = paramiko.RSAKey.from_private_key_file('/home/super/.ssh/id_rsa', password='12345')

# 建立连接
ssh = paramiko.SSHClient()
ssh.connect(hostname='192.168.2.129',
            port=22,
            username='super',
            pkey=pkey)

# 执行命令
stdin, stdout, stderr = ssh.exec_command('df -hl')
print(stdout.read().decode())

# 关闭连接
ssh.close()
```

### 基于密钥的Transport连接

```python
import paramiko

# 指定本地的RSA私钥文件
pkey = paramiko.RSAKey.from_private_key_file('/home/super/.ssh/id_rsa', password='12345')

# 建立连接
trans = paramiko.Transport(('192.168.2.129', 22))
trans.connect(username='super', pkey=pkey)

# 将sshclient的对象的transport指定为以上的trans
ssh = paramiko.SSHClient()
ssh._transport = trans

# 执行命令，和传统方法一样
stdin, stdout, stderr = ssh.exec_command('df -hl')
print(stdout.read().decode())

# 关闭连接
trans.close()
```

### SFTP文件传输

```python
import paramiko

# 实例化一个transport对象
trans = paramiko.Transport(('192.168.2.129', 22))

# 建立连接
trans.connect(username='super', password='super')

# 实例化一个sftp对象，指定连接的通道
sftp = paramiko.SFTPClient.from_transport(trans)

# 发送文件
sftp.put(localpath='/tmp/11.txt', remotepath='/tmp/22.txt')

# 下载文件
# sftp.get(remotepath, localpath)

trans.close()
```

### 实现类似XShell的交互式功能

基本版本（仅适用于Linux）：

```python
import paramiko
import os
import select
import sys

# 建立一个socket
trans = paramiko.Transport(('192.168.2.129', 22))
# 启动一个客户端
trans.start_client()

# 如果使用用户名和密码登录
trans.auth_password(username='super', password='super')

# 打开一个通道
channel = trans.open_session()
# 获取终端
channel.get_pty()
# 激活终端，这样就可以登录到终端了，就和我们用类似于xshell登录系统一样
channel.invoke_shell()

# 下面就可以执行你所有的操作，用select实现
# 对输入终端sys.stdin和通道进行监控
while True:
    readlist, writelist, errlist = select.select([channel, sys.stdin,], [], [])
    
    # 如果是用户输入命令了,sys.stdin发生变化
    if sys.stdin in readlist:
        # 获取输入的内容
        input_cmd = sys.stdin.read(1)
        # 将命令发送给服务器
        channel.sendall(input_cmd)

    # 服务器返回了结果,channel通道接受到结果,发生变化 select感知到
    if channel in readlist:
        # 获取结果
        result = channel.recv(1024)
        # 断开连接后退出
        if len(result) == 0:
            print("\r\n**** EOF **** \r\n")
            break
        # 输出到屏幕
        sys.stdout.write(result.decode())
        sys.stdout.flush()

# 关闭通道和连接
channel.close()
trans.close()
```

**注意**: 在Windows中，sys.stdin不是一个socket或file-like对象，而是PseudoOutputFile对象，不能被select处理。上面的脚本不能在Windows中运行，只能用于Linux。

### 支持Tab自动补全的版本

```python
import paramiko
import os
import select
import sys
import tty
import termios

# 建立一个socket
trans = paramiko.Transport(('192.168.2.129', 22))
# 启动一个客户端
trans.start_client()

# 如果使用用户名和密码登录
trans.auth_password(username='super', password='super')

# 打开一个通道
channel = trans.open_session()
# 获取终端
channel.get_pty()
# 激活终端
channel.invoke_shell()

# 获取原操作终端属性
oldtty = termios.tcgetattr(sys.stdin)

try:
    # 将现在的操作终端属性设置为服务器上的原生终端属性，可以支持tab了
    tty.setraw(sys.stdin)
    channel.settimeout(0)

    while True:
        readlist, writelist, errlist = select.select([channel, sys.stdin,], [], [])
        
        # 如果是用户输入命令了,sys.stdin发生变化
        if sys.stdin in readlist:
            # 获取输入的内容，输入一个字符发送1个字符
            input_cmd = sys.stdin.read(1)
            # 将命令发送给服务器
            channel.sendall(input_cmd)

        # 服务器返回了结果,channel通道接受到结果,发生变化 select感知到
        if channel in readlist:
            # 获取结果
            result = channel.recv(1024)
            # 断开连接后退出
            if len(result) == 0:
                print("\r\n**** EOF **** \r\n")
                break
            # 输出到屏幕
            sys.stdout.write(result.decode())
            sys.stdout.flush()
finally:
    # 执行完后将现在的终端属性恢复为原操作终端属性
    termios.tcsetattr(sys.stdin, termios.TCSADRAIN, oldtty)

# 关闭通道和连接
channel.close()
trans.close()
```

### SSH服务端实现

实现SSH服务端必须继承ServerInterface，并实现里面相应的方法。具体代码如下：

```python
import socket
import sys
import threading
import paramiko

host_key = paramiko.RSAKey(filename='private_key.key')

class Server(paramiko.ServerInterface):
    def __init__(self):
        # 执行start_server()方法首先会触发Event，如果返回成功，is_active返回True
        self.event = threading.Event()

    # 当is_active返回True，进入到认证阶段
    def check_auth_password(self, username, password):
        if (username == 'root') and (password == '123456'):
            return paramiko.AUTH_SUCCESSFUL
        return paramiko.AUTH_FAILED

    # 当认证成功，client会请求打开一个Channel
    def check_channel_request(self, kind, chanid):
        if kind == 'session':
            return paramiko.OPEN_SUCCEEDED

# 命令行接收ip与port
server = sys.argv[1]
ssh_port = int(sys.argv[2])

# 建立socket
try:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)    # TCP socket
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind((server, ssh_port))   
    sock.listen(100)    
    print '[+] Listening for connection ...'
    client, addr = sock.accept()
except Exception, e:
    print '[-] Listen failed: ' + str(e)
    sys.exit(1)
print '[+] Got a connection!'

try:
    # 用sock.accept()返回的socket实例化Transport
    bhSession = paramiko.Transport(client)
    # 添加一个RSA密钥加密会话
    bhSession.add_server_key(host_key)
    server = Server()
    try:
    # 启动SSH服务端
        bhSession.start_server(server=server)
    except paramiko.SSHException, x:
        print '[-] SSH negotiation failed'
    chan = bhSession.accept(20) 
    print '[+] Authenticated!'
    print chan.recv(1024)
    chan.send("Welcome to my ssh")
    while True:
        try:
            command = raw_input("Enter command:").strip("\n") 
            if command != 'exit':
                chan.send(command)
                print chan.recv(1024) + '\n'
            else:
                chan.send('exit')
                print 'exiting'
                bhSession.close()
                raise Exception('exit')
        except KeyboardInterrupt:
            bhSession.close()
except Exception, e:
    print '[-] Caught exception: ' + str(e)
    try:
        bhSession.close()
    except:
        pass
    sys.exit(1)
```

### SSHClient高级用法

#### 常用方法介绍

**connect()方法参数**:

- `hostname`: 连接的目标主机
- `port=SSH_PORT`: 指定端口  
- `username=None`: 验证的用户名
- `password=None`: 验证的用户密码
- `pkey=None`: 私钥方式用于身份验证
- `key_filename=None`: 指定私钥文件
- `timeout=None`: TCP连接超时时间
- `allow_agent=True`: 是否允许连接到ssh代理
- `look_for_keys=True`: 是否在~/.ssh中搜索私钥文件
- `compress=False`: 是否打开压缩

**set_missing_host_key_policy()策略**:

- `AutoAddPolicy`: 自动添加主机名及主机密钥到本地，不需要确认
- `WarningPolicy`: 记录未知主机密钥的警告并接受连接
- `RejectPolicy`: 自动拒绝未知的主机名和密钥（默认）

#### 批量操作示例

```python
from paramiko.ssh_exception import NoValidConnectionsError, AuthenticationException

def connect(cmd, hostname, port=22, username='root', passwd='westos'):
    import paramiko

    # 创建SSH对象
    client = paramiko.SSHClient()
    # 自动选择yes
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(hostname=hostname, port=port, username=username, password=passwd)
        print('正在连接主机%s......' % (hostname))
        
        # 执行操作
        stdin, stdout, stderr = client.exec_command(cmd)
        # 获取命令执行的结果
        result = stdout.read().decode('utf-8')
        print(result)
        
    except NoValidConnectionsError:
        print("连接失败")
    except AuthenticationException:
        print('密码错误')
    finally:
        client.close()

# 批量连接示例
with open('ip.txt') as f:  # ip.txt为本地局域网内的一些用户信息
    for line in f:
        line = line.strip()  # 去掉换行符
        hostname, port, username, passwd = line.split(':')
        print(hostname.center(50, '*'))
        connect('uname', hostname, port, username, passwd)
```

#### 基于密钥的批量连接

```python
import paramiko
from paramiko.ssh_exception import NoValidConnectionsError, AuthenticationException

def connect(cmd, hostname, port=22, user='root'):
    client = paramiko.SSHClient()
    private_key = paramiko.RSAKey.from_private_key_file('id_rsa')
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(hostname=hostname, port=port, username=user, pkey=private_key)
        stdin, stdout, stderr = client.exec_command(cmd)
        result = stdout.read().decode('utf-8')
        print(result)
    except NoValidConnectionsError:
        print("连接失败")
    except AuthenticationException:
        print("认证错误")
    finally:
        client.close()

# 批量扫描网段
for count in range(254):
    host = '172.25.254.%s' % (count + 1)
    print(host.center(50, '*'))
    connect('uname', host)
```

### 实际案例：运维工具封装

```python
import os
import paramiko
from paramiko.ssh_exception import NoValidConnectionsError, AuthenticationException, SSHException

class SshRemoteHost(object):
    def __init__(self, hostname, port, user, passwd, cmd):
        self.hostname = hostname
        self.port = port
        self.user = user
        self.passwd = passwd
        self.cmd = cmd
    def run(self):
        """默认调用的内容"""
        # cmd hostname 
        # put 
        # get 
        cmd_str = self.cmd.split()[0]  # cmd 
        # 类的反射，判断类里面是否可以支持该操作 
        if hasattr(self, 'do_' + cmd_str):  # do_cmd 
            getattr(self, 'do_' + cmd_str)()
        else:
            print("目前不支持该功能")

    def do_cmd(self):
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            client.connect(hostname=self.hostname,
                           port=self.port,
                           username=self.user,
                           password=self.passwd)
            print("正在连接%s......." % (self.hostname))
        except NoValidConnectionsError as e:
            print("连接失败")
        except AuthenticationException as e:
            print("密码错误")
        else:
            # 4. 执行操作 
            cmd = ''.join(self.cmd.split()[1:])  ##将输入的后面的取出，作为 
            stdin, stdout, stderr = client.exec_command(cmd)
            # 5.获取命令执行的结果 
            result = stdout.read().decode('utf-8')
            print(result)
        finally:
            # 6.关闭连接 
            client.close()


def do_put(self):
    ###put /tmp/passwd ###将本地的/tmp/passwd上传到远端/tmp/passwd 
    print('正在上传...')
    try:
        # 获取Transport实例 
        tran = paramiko.Transport(self.hostname, int(self.port))  ##由于端口为整形，而我们用split方法得到的是str 
        # 连接SSH服务端 
        tran.connect(username=self.user, password=self.passwd)
    except SSHException as e:
        print('连接失败')
    else:
        # 获取SFTP实例 
        sftp = paramiko.SFTPClient.from_transport(tran)
        newCmd = self.cmd.split()[1:]
        if len(newCmd) == 2:
            # 设置上传的本地/远程文件路径 
            localpath = newCmd[0]
            remotepath = newCmd[1]
            # 执行上传动作 
            sftp.put(localpath, remotepath)
            print('%s文件上传到%s主机的%s文件成功' % (localpath, self.hostname, remotepath))
        else:
            print('上传文件信息错误')
            tran.close()


def do_get(self):
    print('正在下载...')
    try:
        # 获取Transport实例 
        tran = paramiko.Transport(self.hostname, int(self.port))  ##由于端口为整形，而我们用split方法得到的是str 
        # 连接SSH服务端 
        tran.connect(username=self.user, password=self.passwd)
    except SSHException as e:
        print('连接失败')
    else:
        # 获取SFTP实例 
        sftp = paramiko.SFTPClient.from_transport(tran)
        newCmd = self.cmd.split()[1:]
        if len(newCmd) == 2:
            # 设置下载的本地/远程文件路径 
            localpath = newCmd[1]
            remotepath = newCmd[0]
            # 执行上传动作 
            sftp.get(remotepath, localpath)
            print('%s主机的%s文件下载到%s文件成功' % (self.hostname, remotepath, localpath))
        else:
            print('上传文件信息错误')
            tran.close()

import paramiko
import os
# 1.选择操作的主机组:eg:mysql,web,ftp 
groups = [file.rstrip('.conf') for file in os.listdir('conf')]
print("主机组显示：".center(50, '*'))
for group in groups:
    print('\t', group)
choiceGroup = input("选择批量操作的主机组(eg:mysql):")
##2.根据选择的主机组，显示包含的主机IP/主机名 
# 1).打开文件conf/choiceGroup.conf 
# 2).依次读取文件每一行 
# 3).只拿出 
print("主机组包含的主机：".center(50, '*'))
with open('conf/%s.conf' % (choiceGroup)) as f:
    for line in f:
        print(line.split(':')[0])
f.seek(0, 0)  ##把指针移动到文件最开始 
hostinfos = [line.strip() for line in f.readlines()]
###3.让用户确认信息，选择需要批量执行的命令； 
## -cmd shell 命令 
## -put 本地文件 远程文件 
## -get 远程文件 本地文件 
print("批量执行脚本".center(50, "*"))
while True:
    cmd = input('>>:').strip()
    if cmd:
        if cmd == 'exit' or cmd == "quit":
            print("执行完毕，正在退出")
            break
for info in hostinfos:
    host, port, user, passwd = info.split(':')
clientObj = SshRemoteHost(host, port, user, passwd, cmd)
clientObj.run()

```

## ⚠️ 注意事项

1. **平台兼容性**: Windows下的select模块有限制，交互式功能主要适用于Linux/Unix
2. **连接管理**: 及时关闭连接避免资源泄露
3. **异常处理**: 妥善处理网络异常和认证异常
4. **安全性**: 
   - 避免在代码中硬编码密码
   - 推荐使用密钥认证方式
   - 注意私钥文件的权限设置
5. **性能优化**: 
   - 复用Transport连接
   - 使用连接池管理多个连接
   - 合理设置超时参数

## 🔗 相关内容

### 相关模块
- [fabric](https://www.fabfile.org/) - 基于Paramiko的高级部署工具
- [ansible](https://www.ansible.com/) - 自动化运维平台
- [pexpect](https://pexpect.readthedocs.io/) - 控制其他程序的Python模块

### 替代方案
- **subprocess + ssh命令**: 简单场景的替代方案
- **fabric**: 更高级的远程执行框架
- **ansible**: 企业级自动化工具

## 📚 扩展阅读

- [Paramiko官方文档](http://www.paramiko.org/)
- [SSH协议规范RFC 4251](https://tools.ietf.org/html/rfc4251)
- [cryptography库文档](https://cryptography.io/)
- [Python Socket编程](https://docs.python.org/3/library/socket.html)

## 🏷️ 标签

`SSH` `远程控制` `SFTP` `网络编程` `系统管理` `自动化运维`

---

**最后更新**: 2024-01-15  
**作者**: Python技术文档工程师  
**版本**: 1.0