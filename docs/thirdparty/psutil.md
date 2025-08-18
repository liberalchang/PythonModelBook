---
layout: doc
title: psutil - Python系统监控与进程管理库
permalink: /docs/thirdparty/psutil/
category: thirdparty
tags: [系统监控, 进程管理, 性能分析, 硬件信息, 系统资源]
description: psutil是跨平台的Python第三方模块，专门用来获取系统和硬件相关信息，包括CPU、内存、磁盘、网络、进程等监控功能
author: Python技术文档工程师
date: 2025-01-18
updated: 2025-01-18
version: 1.0
difficulty: "中级"
---

# psutil - Python系统监控与进程管理库

## 📝 概述

psutil（Python System and Process Utilities）是一个跨平台的第三方模块，专门用来获取操作系统以及硬件相关的信息。它提供了丰富的系统监控功能，包括获取CPU、内存、磁盘、网络以及进程信息，是系统监控、性能分析和运维开发的重要工具。

## 🎯 学习目标

通过本文档的学习，你将能够：

- 掌握psutil库的安装和基本使用方法
- 学会获取系统硬件信息（CPU、内存、磁盘、网络）
- 理解各种系统监控指标的含义和用途
- 掌握进程管理和监控的各种技巧
- 能够编写系统监控脚本和工具
- 了解跨平台系统信息获取的最佳实践

## 📋 前置知识

- Python基础语法和模块使用
- 基本的操作系统概念（进程、内存、文件系统）
- 了解系统监控和性能分析的基本概念
- 基础的网络知识（IP地址、端口、连接状态）

## 🔍 详细内容

### 安装方法

```bash
pip install psutil
```

### CPU相关监控

#### 获取CPU核心数量

```python
import psutil

# 获取CPU逻辑数量
print(psutil.cpu_count())  # 12

# 获取CPU物理核心数量
print(psutil.cpu_count(logical=False))  # 6
```

> 如果结果为6，说明是6核超线程；如果CPU的物理核心数和逻辑数相等，都为12，则说明是12核非超线程。

#### 统计CPU时间信息

```python
import psutil

# 统计CPU的用户/系统/空闲时间
print(psutil.cpu_times()) 
# scputimes(user=65531.796875, system=42440.76562500023, idle=1783904.3593749998, interrupt=5676.375, dpc=1846.609375)

# psutil.cpu_times_percent() 功能与之类似，只不过返回的是比例
```

> 返回的是一个namedtuple，包含各个时间段的统计信息。

#### 查看CPU使用率

```python
import psutil

for x in range(3):
    # interval：表示每隔0.5s刷新一次
    # percpu：表示查看所有cpu使用率
    print(psutil.cpu_percent(interval=0.5, percpu=True))
"""
[6.1, 6.2, 9.4, 3.1, 0.0, 0.0, 0.0, 6.2, 3.1, 3.1, 3.1, 0.0]
[0.0, 0.0, 6.1, 0.0, 6.1, 3.0, 0.0, 3.0, 3.0, 3.0, 0.0, 9.1]
[0.0, 0.0, 6.2, 3.1, 3.1, 0.0, 3.1, 3.1, 3.1, 3.1, 0.0, 0.0]
"""
# CPU逻辑数量是12，所以每个列表里面有12个元素
```

#### 其他CPU信息

```python
import psutil

# 查看CPU统计信息，包括上下文切换、中断、软中断，以及系统调用次数等
print(psutil.cpu_stats())
# scpustats(ctx_switches=2912990332, interrupts=4290503758, soft_interrupts=0, syscalls=2698751096)

# 查看CPU频率
print(psutil.cpu_freq())  # scpufreq(current=2208.0, min=0.0, max=2208.0)
```

### 内存相关监控

#### 物理内存信息

```python
import psutil

# 查看内存使用情况
print(psutil.virtual_memory())  
# svmem(total=17029259264, available=8437215232, percent=50.5, used=8592044032, free=8437215232)
```

**字段说明**：
- `total`: 总内存
- `available`: 可用内存  
- `percent`: 内存使用率
- `used`: 已使用的内存
- `free`: 空闲内存

#### 交换内存信息

```python
import psutil

# 查看交换内存信息
print(psutil.swap_memory())
# sswap(total=19579396096, used=15708250112, free=3871145984, percent=80.2, sin=0, sout=0)
```

> **内存类型说明**：
> - **物理内存**：实际的内存条提供的临时数据存储空间
> - **交换内存**：专门用来临时存储数据，通常在页面调度和交换进程数据时使用
> - **虚拟内存**：当物理内存不够时，在硬盘上开辟的虚拟内存空间

### 磁盘相关监控

#### 磁盘分区信息

```python
from pprint import pprint
import psutil

# 查看磁盘分区信息
pprint(psutil.disk_partitions())
"""
[sdiskpart(device='C:\\', mountpoint='C:\\', fstype='NTFS', opts='rw,fixed'),
 sdiskpart(device='D:\\', mountpoint='D:\\', fstype='NTFS', opts='rw,fixed'),
 sdiskpart(device='E:\\', mountpoint='E:\\', fstype='NTFS', opts='rw,fixed')]
"""
# fstype表示文件系统格式是NTFS，opts中的rw表示可读写
# all参数默认为False，如果指定为True，返回内容还会包含/proc等特殊文件系统的挂载信息
```

#### 磁盘使用情况

```python
import psutil

# 查看某个磁盘使用情况
print(psutil.disk_usage("C:\\"))
# sdiskusage(total=267117391872, used=88213196800, free=178904195072, percent=33.0)
```

#### 磁盘IO统计

```python
from pprint import pprint
import psutil

# 查看磁盘IO统计信息
pprint(psutil.disk_io_counters())
# sdiskio(read_count=1270037, write_count=2146886, read_bytes=34637616128, write_bytes=53505994240, read_time=551, write_time=1258)
```

**字段说明**：
- `read_count`: 读次数
- `write_count`: 写次数  
- `read_bytes`: 读的字节数
- `write_bytes`: 写的字节数
- `read_time`: 读时间
- `write_time`: 写时间

```python
# 按磁盘分别统计
pprint(psutil.disk_io_counters(perdisk=True))
"""
{'PhysicalDrive0': sdiskio(read_count=1262459, write_count=2149207, read_bytes=34598280704, write_bytes=53708976128, read_time=532, write_time=1261),
 'PhysicalDrive1': sdiskio(read_count=7702, write_count=98, read_bytes=41695232, write_bytes=4730880, read_time=19, write_time=0)}
"""
```

### 网络相关监控

#### 网络IO统计

```python
from pprint import pprint
import psutil

# 查看网卡的网络IO统计信息
pprint(psutil.net_io_counters())
"""
snetio(bytes_sent=536008958, bytes_recv=8676204996, packets_sent=2725499, packets_recv=7225179, errin=0, errout=9, dropin=0, dropout=0)
"""
```

**字段说明**：
- `bytes_sent`: 发送的字节数
- `bytes_recv`: 接收的字节数
- `packets_sent`: 发送的包数据量  
- `packets_recv`: 接收的包数据量
- `errin`: 接收包时出错的次数
- `errout`: 发送包时出错的次数
- `dropin`: 接收包时丢弃的次数
- `dropout`: 发送包时丢弃的次数

```python
# 分网卡统计
pprint(psutil.net_io_counters(pernic=True))
"""
{'Loopback Pseudo-Interface 1': snetio(bytes_sent=0, bytes_recv=0, packets_sent=0, packets_recv=0, errin=0, errout=0, dropin=0, dropout=0),
 'WLAN': snetio(bytes_sent=534497477, bytes_recv=8678905297, packets_sent=2706204, packets_recv=7244187, errin=0, errout=0, dropin=0, dropout=0),
 '以太网': snetio(bytes_sent=0, bytes_recv=0, packets_sent=0, packets_recv=0, errin=0, errout=0, dropin=0, dropout=0)}
"""
```

#### 网络接口信息

```python
from pprint import pprint
import psutil

# 以字典的形式返回网卡的配置信息，包括IP地址、MAC地址、子网掩码、广播地址等
pprint(psutil.net_if_addrs())
"""
{'Loopback Pseudo-Interface 1': [snicaddr(family=<AddressFamily.AF_INET: 2>, address='127.0.0.1', netmask='255.0.0.0', broadcast=None, ptp=None),
                                 snicaddr(family=<AddressFamily.AF_INET6: 23>, address='::1', netmask=None, broadcast=None, ptp=None)],
 'WLAN': [snicaddr(family=<AddressFamily.AF_LINK: -1>, address='04-EA-56-8C-36-24', netmask=None, broadcast=None, ptp=None),
          snicaddr(family=<AddressFamily.AF_INET: 2>, address='192.168.8.115', netmask='255.255.255.0', broadcast=None, ptp=None)]}
"""

# 返回网卡的详细信息，包括是否启动、通信类型、传输速度、MTU
pprint(psutil.net_if_stats())
"""
{'Loopback Pseudo-Interface 1': snicstats(isup=True, duplex=<NicDuplex.NIC_DUPLEX_FULL: 2>, speed=1073, mtu=1500),
 'WLAN': snicstats(isup=True, duplex=<NicDuplex.NIC_DUPLEX_FULL: 2>, speed=866, mtu=1500)}
"""
```

#### 网络连接信息

```python
from pprint import pprint
import psutil

# 以列表的形式返回每个网络连接的详细信息
pprint(psutil.net_connections())
"""
[sconn(fd=-1, family=<AddressFamily.AF_INET: 2>, type=<SocketKind.SOCK_STREAM: 1>, laddr=addr(ip='0.0.0.0', port=1024), raddr=(), status='LISTEN', pid=940),
 sconn(fd=-1, family=<AddressFamily.AF_INET: 2>, type=<SocketKind.SOCK_STREAM: 1>, laddr=addr(ip='127.0.0.1', port=10637), raddr=addr(ip='127.0.0.1', port=10638), status='ESTABLISHED', pid=10152)]
"""

# 在生产环境中，线上服务器很多都是最小化安装，并不能保证每台机器上都有ss或者netstat命令
# 而这个时候psutil就派上用场了
```

### 系统信息监控

#### 用户信息

```python
from pprint import pprint
import psutil

# 查看当前登录的用户信息
pprint(psutil.users())  
# [suser(name='satori', terminal=None, host='0.0.0.0', started=1609841661.0, pid=None)]
```

**字段说明**：
- `name`: 用户名
- `terminal`: 终端
- `host`: 主机地址
- `started`: 登录时间
- `pid`: 进程ID

#### 系统启动时间

```python
import psutil
import datetime

print(psutil.boot_time())  # 1585282271.0
print(datetime.datetime.fromtimestamp(psutil.boot_time()))  # 2020-03-27 12:11:11
```

## 💡 实际应用

### 进程管理

#### 基础进程操作

```python
from pprint import pprint
import psutil

# 查看当前存在的所有进程的PID
pprint(psutil.pids())
"""
[0, 4, 144, 512, 536, 632, 640, 664, 696, 768, 776, ...]
"""

# 查看某个进程是否存在
print(psutil.pid_exists(22333))  # False
print(psutil.pid_exists(0))      # True

# 返回所有进程（Process）对象组成的迭代器
print(psutil.process_iter())  # <generator object process_iter at 0x000001F12032C9E0>

# 根据PID获取一个进程对应的Process对象
p = psutil.Process(pid=0)
print(p)  # psutil.Process(pid=0, name='System Idle Process', started='2020-2-27 09:07:47')
```

#### 进程详细信息获取

```python
import psutil
from pprint import pprint

# 以微信进程为例
p = psutil.Process(pid=16948)

# 基本信息
print(p.name())     # WeChat.exe
print(p.exe())      # D:\WeChat\WeChat.exe
print(p.cwd())      # D:\WeChat
print(p.cmdline())  # ['D:\\WeChat\\WeChat.exe']
print(p.pid)        # 16948
print(p.ppid())     # 11700 (父进程ID)
print(p.status())   # running
print(p.username()) # LAPTOP-264ORES3\satori

# 时间信息
print(p.create_time())  # 1561775539.0 (进程创建时间戳)

# 父子进程关系
print(p.parent())       # psutil.Process(pid=11700, name='explorer.exe', started='09:19:06')
pprint(p.children())    # 子进程列表
"""
[psutil.Process(pid=17452, name='WeChatWeb.exe', started='09:21:02'), 
 psutil.Process(pid=16216, name='WeChatApp.exe', started='09:21:40')]
"""
```

#### 进程资源使用情况

```python
import psutil

p = psutil.Process(pid=16948)

# CPU使用情况
print(p.cpu_times())  # pcputimes(user=133.3125, system=188.203125, children_user=0.0, children_system=0.0)
print(p.cpu_percent()) # CPU占用率（百分比）

# 内存使用情况  
print(p.memory_info())
"""
pmem(rss=128634880, vms=117067776, num_page_faults=12193918, 
     peak_wset=263921664, wset=128634880, peak_paged_pool=1398584, 
     paged_pool=1329936, peak_nonpaged_pool=313896, nonpaged_pool=152192, 
     pagefile=117067776, peak_pagefile=201670656, private=117067776)
"""

# 线程信息
print(p.num_threads())  # 66 (线程数量)
pprint(p.threads())     # 所有线程信息
"""
[pthread(id=13340, user_time=113.328125, system_time=179.015625),
 pthread(id=17120, user_time=0.0, system_time=0.0625),
 ...]
"""
```

#### 进程文件和网络连接

```python
import psutil
from pprint import pprint

p = psutil.Process(pid=16948)

# 进程打开的文件
pprint(p.open_files())
"""
[popenfile(path='C:\\Users\\satori\\Documents\\WeChat Files\\wxid_3ksrps1o47mf22\\Msg\\Media.db-wal', fd=-1),
 popenfile(path='C:\\Users\\satori\\AppData\\Roaming\\Tencent\\WeChat\\All Users\\CefResources\\2581\\qb_200_percent.pak', fd=-1),
 ...]
"""

# 进程相关的网络连接
pprint(p.connections())
"""
[pconn(fd=-1, family=<AddressFamily.AF_INET: 2>, type=<SocketKind.SOCK_STREAM: 1>, 
       laddr=addr(ip='192.168.8.115', port=5162), raddr=addr(ip='183.3.234.107', port=443), status='ESTABLISHED'),
 pconn(fd=-1, family=<AddressFamily.AF_INET: 2>, type=<SocketKind.SOCK_STREAM: 1>, 
       laddr=addr(ip='0.0.0.0', port=8680), raddr=(), status='LISTEN')]
"""

# 进程的环境变量
pprint(p.environ())
"""
{'ALLUSERSPROFILE': 'C:\\ProgramData',
 'APPDATA': 'C:\\Users\\satori\\AppData\\Roaming',
 'COMPUTERNAME': 'LAPTOP-264ORES3',
 'PATH': 'C:\\Program Files (x86)\\Intel\\Intel(R) Management Engine Components\\iCLS\\;...',
 ...}
"""
```

### 高级应用示例

#### 系统监控脚本

```python
import psutil
import time

def system_monitor():
    """系统资源监控脚本"""
    while True:
        # CPU信息
        cpu_percent = psutil.cpu_percent(interval=1)
        
        # 内存信息
        memory = psutil.virtual_memory()
        
        # 磁盘信息
        disk = psutil.disk_usage('/')
        
        print(f"CPU使用率: {cpu_percent}%")
        print(f"内存使用率: {memory.percent}% ({memory.used/1024/1024/1024:.2f}GB/{memory.total/1024/1024/1024:.2f}GB)")
        print(f"磁盘使用率: {disk.percent}% ({disk.used/1024/1024/1024:.2f}GB/{disk.total/1024/1024/1024:.2f}GB)")
        print("-" * 50)
        
        time.sleep(5)

# system_monitor()  # 取消注释运行
```

#### 进程查找和管理

```python
import psutil

def find_process_by_name(process_name):
    """根据进程名查找进程ID"""
    for proc in psutil.process_iter():
        try:
            if proc.name().lower() == process_name.lower():
                print(f"找到进程: {proc.name()} (PID: {proc.pid})")
                return proc.pid
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    return None

# 查找微信进程
wechat_pid = find_process_by_name("wechat.exe")
if wechat_pid:
    # 获取进程详细信息
    p = psutil.Process(wechat_pid)
    print(f"进程路径: {p.exe()}")
    print(f"CPU使用率: {p.cpu_percent()}%")
    print(f"内存使用: {p.memory_info().rss / 1024 / 1024:.2f} MB")
```

#### 模拟ps命令

```python
import psutil

def simulate_ps_command():
    """模拟Linux ps命令"""
    print(f"{'USER':<12} {'PID':<8} {'%MEM':<6} {'VSZ':<10} {'RSS':<10} {'STATUS':<8} {'CMDLINE'}")
    print("-" * 80)
    
    for proc in psutil.process_iter(['pid', 'name', 'username', 'memory_info', 'status', 'cmdline']):
        try:
            info = proc.info
            user = info['username'] if info['username'] else 'N/A'
            pid = info['pid']
            memory_info = info['memory_info']
            rss = memory_info.rss / 1024 / 1024  # MB
            vms = memory_info.vms / 1024 / 1024  # MB
            memory_percent = psutil.virtual_memory().percent
            status = info['status']
            cmdline = ' '.join(info['cmdline']) if info['cmdline'] else info['name']
            
            print(f"{user:<12} {pid:<8} {memory_percent:<6.1f} {vms:<10.1f} {rss:<10.1f} {status:<8} {cmdline[:40]}")
            
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue

# simulate_ps_command()  # 取消注释运行
```

#### 或者直接使用内置的test函数

```python
import psutil

# psutil提供的内置测试函数，模拟ps命令输出
psutil.test()
"""
USER         PID  %MEM     VSZ     RSS  NICE STATUS  START   TIME  CMDLINE
SYSTEM         0   0.0   60.0K    8.0K        runni  Dec30  00:39  System Idle P
SYSTEM         4   0.0  236.0K    1.4M        runni  Dec30  14:32  System
             144   0.2    8.1M   32.2M        runni  Dec30  00:03  Registry
             512   0.0    1.1M  304.0K        runni  Dec30  00:00  smss.exe
...
"""
```

## ⚠️ 注意事项

- **权限问题**: 某些系统信息和进程操作需要管理员权限
- **跨平台差异**: 不同操作系统返回的字段和值可能有差异
- **性能影响**: 频繁调用某些函数（如进程遍历）可能影响系统性能
- **异常处理**: 进程可能在获取信息过程中消失，需要适当的异常处理
- **版本兼容**: 不同psutil版本的API可能有细微差异
- **内存占用**: 长时间运行的监控程序要注意内存泄漏问题

## 🔗 相关内容

- [Supervisor - Python进程管理与监控系统](../supervisor/)
- [Monit - Unix系统监控与管理工具](../monit/)
- [memory_profiler - Python内存使用分析工具](../memory-profiler/)
- [line_profiler - Python逐行性能分析工具](../line-profiler/)

## 📚 扩展阅读

- [psutil官方文档](https://psutil.readthedocs.io/)
- [Python系统监控最佳实践](https://realpython.com/python-psutil/)
- [跨平台系统信息获取指南](https://github.com/giampaolo/psutil)

## 🏷️ 标签

`系统监控` `进程管理` `性能分析` `硬件信息` `系统资源`

---

**最后更新**: 2025-01-18  
**作者**: Python技术文档工程师  
**版本**: 1.0