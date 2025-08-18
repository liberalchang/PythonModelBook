---
layout: doc
title: socket 模块
permalink: /docs/stdlib/socket/
category: stdlib
tags: [网络编程, TCP, UDP, 套接字, socket]
description: Python socket模块详解 - 网络编程基础，支持TCP/UDP协议通信
author: Python教程
date: 2024-12-19
updated: 2024-12-19
version: 1.0
difficulty: "中级"
---

# socket 模块

## 📝 概述

socket模块是Python网络编程的核心模块，提供了底层网络通信接口。Socket是应用层与TCP/IP协议族通信的中间软件抽象层，它把复杂的TCP/IP协议族隐藏在Socket接口后面，对用户来说，一组简单的接口就是全部。

官方文档：https://docs.python.org/zh-tw/3/library/socket.html

## 🎯 学习目标

- 理解Socket的基本概念和工作原理
- 掌握TCP和UDP套接字编程
- 学会使用socket模块进行客户端和服务端开发
- 了解网络编程的最佳实践和注意事项

## 📋 前置知识

- Python基础语法
- 基本的网络协议知识（TCP/IP、UDP）
- 多线程/多进程概念（用于并发处理）
- 异常处理机制

## 🔍 详细内容

### Socket的定义

Socket是应用层与TCP/IP协议族通信的中间软件抽象层，它是一组接口。在设计模式中，Socket其实就是一个门面模式，它把复杂的TCP/IP协议族隐藏在Socket接口后面，对用户来说，一组简单的接口就是全部，让Socket去组织数据，以符合指定的协议。

补充：也有人将socket说成ip+port，ip是用来标识互联网中的一台主机的位置，而port是用来标识这台机器上的一个应用程序，ip地址是配置到网卡上的，而port是应用程序开启的，ip与port的绑定就标识了互联网中独一无二的一个应用程序，而程序的pid是同一台机器上不同进程或者线程的标识。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCE411152d59ecc735ff1b2d7bce2d9b926.png)

### 套接字发展史及分类

套接字起源于20世纪70年代加利福尼亚大学伯克利分校版本的Unix，即人们所说的BSD Unix。因此，有时人们也把套接字称为"伯克利套接字"或"BSD套接字"。

套接字有两种类型：

#### 基于文件类型的套接字家族
- **套接字家族名称**：AF_UNIX
- **特点**：unix一切皆文件，基于文件的套接字调用的就是底层的文件系统来取数据，两个套接字进程运行在同一机器，可以通过访问同一个文件系统间接完成通信

#### 基于网络类型的套接字家族
- **套接字家族名称**：AF_INET
- **说明**：还有AF_INET6被用于ipv6，python支持很多种地址家族，但是由于我们只关心网络编程，所以大部分时候只使用AF_INET

### 套接字的工作流程

套接字的工作原理就像打电话一样：你要打电话给一个朋友，先拨号，朋友听到电话铃声后提起电话，这时你和你的朋友就建立起了连接，就可以讲话了。等交流结束，挂断电话结束此次交谈。

![](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/youdaonote-images/WEBRESOURCEb3e8707f4bfaf8a9b145dfbd7fe7451a.png)

服务器端先初始化Socket，然后与端口绑定(bind)，对端口进行监听(listen)，调用accept阻塞，等待客户端连接。客户端初始化一个Socket，然后连接服务器(connect)，如果连接成功，这时客户端与服务器端的连接就建立了。

### socket函数使用

#### 创建socket对象

```python
import socket

# socket函数用法
socket.socket(socket_family, socket_type, protocol=0)

# 获取tcp/ip套接字
tcpSock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 获取udp/ip套接字
udpSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# 使用from导入简化代码
from socket import *
tcpSock = socket(AF_INET, SOCK_STREAM)
```

#### 服务端套接字函数

| 方法 | 说明 |
|------|------|
| s.bind() | 绑定(主机,端口号)到套接字 |
| s.listen() | 开始TCP监听 |
| s.accept() | 被动接受TCP客户的连接,(阻塞式)等待连接的到来 |

#### 客户端套接字函数

| 方法 | 说明 |
|------|------|
| s.connect() | 主动初始化TCP服务器连接 |
| s.connect_ex() | connect()函数的扩展版本,出错时返回出错码,而不是抛出异常 |

#### 公共用途的套接字函数

| 方法 | 说明 |
|------|------|
| s.recv() | 接收TCP数据 |
| s.send() | 发送TCP数据(send在待发送数据量大于己端缓存区剩余空间时,数据丢失,不会发完) |
| s.sendall() | 发送完整的TCP数据(本质就是循环调用send,sendall在待发送数据量大于己端缓存区剩余空间时,数据不丢失,循环调用send直到发完) |
| s.recvfrom() | 接收UDP数据 |
| s.sendto() | 发送UDP数据 |
| s.getpeername() | 连接到当前套接字的远端的地址 |
| s.getsockname() | 当前套接字的地址 |
| s.getsockopt() | 返回指定套接字的参数 |
| s.setsockopt() | 设置指定套接字的参数 |
| s.close() | 关闭套接字 |

#### 面向锁的套接字方法

| 方法 | 说明 |
|------|------|
| s.setblocking() | 设置套接字的阻塞与非阻塞模式 |
| s.settimeout() | 设置阻塞套接字操作的超时时间 |
| s.gettimeout() | 得到阻塞套接字操作的超时时间 |

#### 面向文件的套接字方法

| 方法 | 说明 |
|------|------|
| s.fileno() | 套接字的文件描述符 |
| s.makefile() | 创建一个与该套接字相关的文件 |

## 💡 实际应用

### 基于TCP的套接字编程

#### TCP服务端流程

```python
ss = socket()       # 创建服务器套接字
ss.bind()          # 把地址绑定到套接字
ss.listen()        # 监听链接
inf_loop:          # 服务器无限循环
    cs = ss.accept()    # 接受客户端链接
    comm_loop:          # 通讯循环
        cs.recv()/cs.send() # 对话(接收与发送)
    cs.close()      # 关闭客户端套接字
ss.close()          # 关闭服务器套接字(可选)
```

#### TCP客户端流程

```python
cs = socket()       # 创建客户套接字
cs.connect()        # 尝试连接服务器
comm_loop:          # 通讯循环
    cs.send()/cs.recv()  # 对话(发送/接收)
cs.close()          # 关闭客户套接字
```

#### 简单的TCP服务端示例

```python
import socket

# 服务端
ip_port = ('127.0.0.1', 8080)
BUFSIZE = 1024
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  # 买手机
s.bind(ip_port)     # 手机插卡
s.listen(5)         # 手机待机

print('starting....')
conn, addr = s.accept()                    # 接电话
print('client addr', addr)
client_msg = conn.recv(BUFSIZE)            # 收消息
print('client msg: %s' % client_msg)
conn.send(client_msg.upper())              # 发消息

conn.close()
s.close()
```

#### 简单的TCP客户端示例

```python
import socket

# 客户端
phone = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
phone.connect(('127.0.0.1', 8080))        # 拨通电话

phone.send('hello'.encode('utf-8'))        # 发消息
back_msg = phone.recv(1024)
print(back_msg)

phone.close()
```

#### 改进的TCP服务端（支持多客户端）

```python
import socket

ip_port = ('127.0.0.1', 8081)
BUFSIZE = 1024
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(ip_port)
s.listen(5)

while True:                          # 新增接收链接循环,可以不停的接电话
    conn, addr = s.accept()          # 手机接电话
    print('接到来自%s的电话' % addr[0])
    while True:                      # 新增通信循环,可以不断的通信,收发消息
        msg = conn.recv(BUFSIZE)     # 听消息,听话
        if len(msg) == 0: break      # 如果不加,那么正在链接的客户端突然断开,recv便不再阻塞,死循环发生
        print(msg, type(msg))
        conn.send(msg.upper())       # 发消息,说话
    conn.close()                     # 挂电话

s.close()                           # 手机关机
```

#### 改进的TCP客户端（支持持续通信）

```python
import socket

ip_port = ('127.0.0.1', 8081)
BUFSIZE = 1024
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

s.connect_ex(ip_port)               # 拨电话

while True:                         # 新增通信循环,客户端可以不断发收消息
    msg = input('>>: ').strip()
    if len(msg) == 0: continue
    s.send(msg.encode('utf-8'))     # 发消息,说话(只能发送字节类型)

    feedback = s.recv(BUFSIZE)      # 收消息,听话
    print(feedback.decode('utf-8'))

s.close()                          # 挂电话
```

### 基于UDP的套接字编程

#### UDP服务端流程

```python
ss = socket()       # 创建一个服务器的套接字
ss.bind()          # 绑定服务器套接字
inf_loop:          # 服务器无限循环
    cs = ss.recvfrom()/ss.sendto()  # 对话(接收与发送)
ss.close()         # 关闭服务器套接字
```

#### UDP客户端流程

```python
cs = socket()       # 创建客户套接字
comm_loop:         # 通讯循环
    cs.sendto()/cs.recvfrom()  # 对话(发送/接收)
cs.close()         # 关闭客户套接字
```

#### UDP服务端示例

```python
import socket

ip_port = ('127.0.0.1', 9000)
BUFSIZE = 1024
udp_server_client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

udp_server_client.bind(ip_port)

while True:
    msg, addr = udp_server_client.recvfrom(BUFSIZE)
    print(msg, addr)
    udp_server_client.sendto(msg.upper(), addr)
```

#### UDP客户端示例

```python
import socket

ip_port = ('127.0.0.1', 9000)
BUFSIZE = 1024
udp_server_client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

while True:
    msg = input('>>: ').strip()
    if not msg: continue

    udp_server_client.sendto(msg.encode('utf-8'), ip_port)
    back_msg, addr = udp_server_client.recvfrom(BUFSIZE)
    print(back_msg.decode('utf-8'), addr)
```

### 远程命令执行程序示例

#### 客户端

```python
import socket

BUFSIZE = 1024
ip_port = ('127.0.0.1', 8080)

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
res = s.connect_ex(ip_port)

while True:
    msg = input('>>: ').strip()
    if len(msg) == 0: continue
    if msg == 'quit': break

    s.send(msg.encode('utf-8'))
    act_res = s.recv(BUFSIZE)
    print(act_res.decode('utf-8'), end='')
```

#### 服务端

```python
from socket import *
import subprocess

ip_port = ('127.0.0.1', 8080)
BUFSIZE = 1024

tcp_socket_server = socket(AF_INET, SOCK_STREAM)
tcp_socket_server.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
tcp_socket_server.bind(ip_port)
tcp_socket_server.listen(5)

while True:
    conn, addr = tcp_socket_server.accept()
    print('客户端', addr)

    while True:
        cmd = conn.recv(BUFSIZE)
        if len(cmd) == 0: break

        res = subprocess.Popen(cmd.decode('utf-8'), shell=True,
                             stdout=subprocess.PIPE,
                             stdin=subprocess.PIPE,
                             stderr=subprocess.PIPE)

        stderr = res.stderr.read()
        stdout = res.stdout.read()
        conn.send(stderr)
        conn.send(stdout)
```

### 模拟QQ聊天程序

#### QQ服务端

```python
import socket

ip_port = ('127.0.0.1', 8081)
udp_server_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
udp_server_sock.bind(ip_port)

while True:
    qq_msg, addr = udp_server_sock.recvfrom(1024)
    print('来自[%s:%s]的一条消息:\033[1;44m%s\033[0m' % (addr[0], addr[1], qq_msg.decode('utf-8')))
    back_msg = input('回复消息: ').strip()
    udp_server_sock.sendto(back_msg.encode('utf-8'), addr)
```

#### QQ客户端

```python
import socket

BUFSIZE = 1024
udp_client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

qq_name_dic = {
    'TOM': ('127.0.0.1', 8081),
    'JACK': ('127.0.0.1', 8081),
    '一棵树': ('127.0.0.1', 8081),
    '武大郎': ('127.0.0.1', 8081),
}

while True:
    qq_name = input('请选择聊天对象: ').strip()
    while True:
        msg = input('请输入消息,回车发送: ').strip()
        if msg == 'quit': break
        if not msg or not qq_name or qq_name not in qq_name_dic: continue
        udp_client_socket.sendto(msg.encode('utf-8'), qq_name_dic[qq_name])

        back_msg, addr = udp_client_socket.recvfrom(BUFSIZE)
        print('来自[%s:%s]的一条消息:\033[1;44m%s\033[0m' % (addr[0], addr[1], back_msg.decode('utf-8')))

udp_client_socket.close()
```

## ⚠️ 注意事项

### 地址重用问题

在重启服务端时可能会遇到地址被占用的错误，这是由于服务端仍然存在四次挥手的time_wait状态在占用地址。

**解决方法一：**
```python
# 加入socket配置，重用ip和端口
phone = socket(AF_INET, SOCK_STREAM)
phone.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)  # 在bind前加
phone.bind(('127.0.0.1', 8080))
```

**解决方法二（Linux系统）：**
```bash
# 调整linux内核参数
vi /etc/sysctl.conf

# 加入以下内容：
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_tw_recycle = 1
net.ipv4.tcp_fin_timeout = 30

# 执行使参数生效
/sbin/sysctl -p
```

### recv与recvfrom的区别

- **TCP**: send发消息，recv收消息
- **UDP**: sendto发消息，recvfrom收消息

#### TCP协议特点

1. 如果收消息缓冲区里的数据为空，那么recv就会阻塞
2. TCP客户端send一个空数据就是真的空数据
3. 基于连接通信，需要先运行服务端，然后客户端发起连接请求
4. 如果一端断开连接，另一端的连接也会断开，recv将不会阻塞，收到的是空

#### UDP协议特点

1. 如果收消息缓冲区里的数据为"空"，recvfrom也会阻塞
2. UDP客户端sendto一个空数据并不是真的空数据（包含空数据+地址信息）
3. 无连接，因此无需listen，更没有连接池概念
4. sendto不用管是否有正在运行的服务端，可以一直发消息，只不过数据丢失
5. recvfrom收的数据小于sendto发送的数据时，在mac和linux系统上数据直接丢失，在windows系统上直接报错

### 编程注意事项

- 单独运行UDP客户端不会报错，TCP却会报错，因为UDP只负责把包发出去，不管对方收不收
- TCP是基于连接的，必须有服务端先运行，客户端才能建立连接
- 服务端有几个recvfrom就要对应几个sendto，哪怕是sendto(b'')
- 正确处理客户端断开连接的情况，避免服务端死循环
- 发送数据时要进行编码，接收数据时要进行解码

## 🔗 相关内容

- [os 模块](../os/) - 操作系统接口
- [sys 模块](../sys/) - 系统特定参数和函数
- [threading 模块] - 多线程编程
- [asyncio 模块] - 异步编程
- [selectors 模块] - 高级I/O复用

## 📚 扩展阅读

- [Python官方socket文档](https://docs.python.org/zh-tw/3/library/socket.html)
- [TCP/IP协议详解](https://en.wikipedia.org/wiki/Internet_protocol_suite)
- [网络编程最佳实践](https://realpython.com/python-sockets/)
- [异步网络编程指南](https://docs.python.org/3/library/asyncio.html)

## 🏷️ 标签

`网络编程` `TCP` `UDP` `套接字` `socket`

---

**最后更新**: 2024-12-19  
**作者**: Python教程  
**版本**: 1.0