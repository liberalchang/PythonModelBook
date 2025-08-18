---
layout: doc
title: Docker SDK for Python - 容器化应用管理
permalink: /docs/thirdparty/docker/
category: thirdparty
tags: [docker, 容器化, SDK, 容器管理, 镜像管理, 网络管理, 安全, 部署]
description: Docker SDK for Python 是用于管理 Docker 容器、镜像、网络和数据卷的官方 Python 客户端库，提供安全的容器化应用操作接口
author: Python 技术文档工程师
date: 2025-01-21
updated: 2025-01-21
version: 1.0
python_version: "3.6+"
library_version: "docker>=6.0.0"
difficulty: "中级"
estimated_time: "120分钟"
---

# Docker SDK for Python - 容器化应用管理

## 📝 概述

Docker SDK for Python（原 docker-py）是 Docker 官方提供的 Python 客户端库，用于通过 Python 程序管理 Docker 容器、镜像、网络和数据卷。该库提供了完整的 Docker API 接口，支持安全连接、资源管理、事件监控等功能，是自动化容器部署和管理的重要工具。

## 🎯 学习目标

- 掌握 Docker SDK for Python 的安装和基本配置
- 理解客户端初始化和安全连接方式
- 学会容器、镜像、网络和数据卷的操作
- 掌握安全配置和权限控制
- 了解事件监控和错误处理
- 学习最佳实践和常见应用场景

## 📋 前置知识

- Python 基础语法和异常处理
- Docker 基本概念和命令行使用
- 容器化技术基础知识
- 网络和安全基本概念

## 🔍 详细内容

### 安装和环境准备

```bash
# 安装 Docker SDK for Python
pip install docker

# 或指定版本
pip install docker>=6.0.0

# 验证安装
python -c "import docker; print(docker.__version__)"
```

**环境要求**：
- Python 3.6+
- Docker Engine 运行中
- 适当的 Docker 访问权限

### 其他安装与环境建议

- 使用 Poetry 管理依赖
  - poetry add docker
- 指定镜像源（加速国内访问）
  - pip install -i https://pypi.tuna.tsinghua.edu.cn/simple docker
- 离线安装（内网环境）
  - 先在可联网环境下载 wheel 包，再在目标环境使用 pip install --no-index --find-links 本地目录 安装
- 版本约束建议（生产环境）
  - 将依赖锁定到小版本范围，例如 docker>=6.0,<6.2，确保升级可控
- 代理配置（构建/拉取镜像需要代理时）
  - Windows PowerShell: $env:HTTP_PROXY="http://proxy:8080"; $env:HTTPS_PROXY="http://proxy:8080"
  - Linux/macOS: export HTTP_PROXY=http://proxy:8080; export HTTPS_PROXY=http://proxy:8080

### 客户端初始化

#### 基本连接方式

```python
import docker

# 方式1：环境变量（推荐）
# 自动读取 DOCKER_HOST, DOCKER_TLS_VERIFY 等环境变量
client = docker.from_env()

# 方式2：本地套接字连接（Linux/macOS）
client = docker.DockerClient(base_url='unix://var/run/docker.sock')

# 方式3：TCP 连接（不推荐用于生产环境）
client = docker.DockerClient(base_url='tcp://localhost:2375')
```

#### 安全 TLS 连接

```python
import docker

# 生产环境安全连接
client = docker.DockerClient(
    base_url='tcp://docker-host:2376',
    tls=True,                          # 强制使用 TLS 加密
    ca_cert='ca.pem',                  # CA 证书路径
    client_cert=('cert.pem', 'key.pem'),  # 客户端证书和私钥
    version='auto'                     # 自动协商 API 版本
)

# 验证连接
try:
    info = client.info()
    print(f"Docker 版本: {info['ServerVersion']}")
    print(f"容器数量: {info['Containers']}")
except docker.errors.APIError as e:
    print(f"连接失败: {e}")
finally:
    client.close()
```

#### Windows 连接（Docker Desktop）

```python
import docker

# 在 Windows 上通过命名管道连接（需要 Docker Desktop 正在运行）
client = docker.DockerClient(base_url='npipe:////./pipe/docker_engine')

# 或在 WSL2 环境中使用 from_env() 自动发现
client = docker.from_env()
```

### 容器操作

#### 创建和运行容器

```python
import docker
import os

client = docker.from_env()

# 创建安全容器
container = client.containers.create(
    image='nginx:alpine',
    name='web-server',
    command=["nginx", "-g", "daemon off;"],
    detach=True,
    
    # 安全配置
    user="1000:1000",                  # 非 root 用户运行
    cap_drop=["ALL"],                  # 移除所有特权能力
    security_opt=["no-new-privileges"], # 禁止获取新特权
    read_only=True,                    # 只读文件系统
    pids_limit=100,                    # 最大进程数限制
    mem_limit='512m',                  # 内存限制
    cpuset_cpus='0-1',                # CPU 核心限制
    network_mode='bridge',             # 网络隔离
    
    # 端口映射
    ports={'80/tcp': 8080},
    
    # 环境变量（避免敏感信息）
    environment={
        'NGINX_HOST': 'localhost',
        'SECRET_KEY': os.environ.get('APP_SECRET', 'default')
    },
    
    # 卷挂载
    volumes={
        '/host/config': {
            'bind': '/etc/nginx/conf.d',
            'mode': 'ro'               # 只读挂载
        },
        '/host/logs': {
            'bind': '/var/log/nginx',
            'mode': 'rw'               # 读写挂载
        }
    }
)

# 启动容器
container.start()
print(f"容器已启动: {container.id[:12]}")
```

#### 容器生命周期管理

```python
# 获取容器列表
containers = client.containers.list(all=True)
for container in containers:
    print(f"容器: {container.name} - 状态: {container.status}")

# 获取特定容器
try:
    container = client.containers.get('web-server')
    
    # 容器操作
    container.start()                  # 启动
    container.restart(timeout=10)      # 重启（10秒超时）
    container.stop(timeout=10)         # 优雅停止
    container.kill()                   # 强制终止
    container.pause()                  # 暂停
    container.unpause()                # 恢复
    
except docker.errors.NotFound:
    print("容器不存在")
except docker.errors.APIError as e:
    print(f"操作失败: {e}")
```

#### 容器信息和日志

```python
# 获取容器详细信息
container = client.containers.get('web-server')
inspect_data = container.attrs

print(f"容器 ID: {inspect_data['Id'][:12]}")
print(f"运行状态: {inspect_data['State']['Status']}")
print(f"IP 地址: {inspect_data['NetworkSettings']['IPAddress']}")

# 获取资源使用统计
stats = container.stats(stream=False)
print(f"内存使用: {stats['memory_stats']['usage']} bytes")

# 获取日志（安全审计）
logs = container.logs(
    since='2025-01-01T00:00:00',      # 开始时间
    until='2025-01-01T23:59:59',      # 结束时间
    tail=100,                          # 最后 100 行
    timestamps=True                    # 包含时间戳
)
print(logs.decode('utf-8'))

# 实时日志流
for log_line in container.logs(stream=True, follow=True):
    print(log_line.decode('utf-8').strip())
```

### 镜像管理

#### 拉取和验证镜像

```python
# 从仓库拉取镜像
try:
    image = client.images.pull(
        'nginx',
        tag='alpine',
        auth_config={
            'username': 'your_username',
            'password': 'your_password'
        }
    )
    print(f"镜像拉取成功: {image.id[:12]}")
    
    # 验证镜像签名（安全检查）
    labels = image.attrs.get('Config', {}).get('Labels', {})
    if not labels.get('signed'):
        print("警告: 镜像未签名")
        
except docker.errors.APIError as e:
    print(f"拉取失败: {e}")
```

#### 构建镜像

```python
# 从 Dockerfile 构建镜像
dockerfile_content = '''
FROM python:3.9-alpine
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "app.py"]
'''

import io
dockerfile = io.BytesIO(dockerfile_content.encode())

try:
    image, build_logs = client.images.build(
        fileobj=dockerfile,
        tag='myapp:latest',
        rm=True,                       # 构建后删除中间容器
        forcerm=True,                  # 强制删除中间容器
        pull=True,                     # 拉取最新基础镜像
        
        # 安全构建参数
        buildargs={
            'HTTP_PROXY': os.environ.get('HTTP_PROXY', ''),
            'BUILD_SECRET': os.environ.get('BUILD_SECRET', '')
        },
        
        # 网络设置
        network_mode='host'
    )
    
    # 处理构建日志
    for chunk in build_logs:
        if 'error' in chunk:
            print(f"构建错误: {chunk['error']}")
        elif 'stream' in chunk:
            print(chunk['stream'].strip())
            
    print(f"镜像构建成功: {image.id[:12]}")
    
except docker.errors.BuildError as e:
    print(f"构建失败: {e}")
```

#### 镜像操作

```python
# 列出所有镜像
images = client.images.list()
for image in images:
    print(f"镜像: {image.tags} - 大小: {image.attrs['Size']} bytes")

# 删除镜像
try:
    client.images.remove('myapp:old', force=True)  # force=True 强制删除
    print("镜像删除成功")
except docker.errors.ImageNotFound:
    print("镜像不存在")

# 清理悬空镜像
client.images.prune()
print("悬空镜像已清理")
```

### 网络管理

#### 创建自定义网络

```python
# 创建私有网络
network = client.networks.create(
    "app_network",
    driver="bridge",
    internal=True,                     # 禁止外部访问
    ipam=docker.types.IPAMConfig(
        pool_configs=[
            docker.types.IPAMPool(
                subnet="172.28.0.0/16",
                gateway="172.28.5.1"
            )
        ]
    ),
    labels={"security_zone": "internal", "project": "myapp"}
)

print(f"网络创建成功: {network.name}")
```

#### 网络连接和管理

```python
# 将容器连接到网络
network.connect(
    container=container.id,
    aliases=["web", "frontend"],       # 网络别名
    ipv4_address="172.28.5.10"        # 指定 IP 地址
)

# 断开网络连接
network.disconnect(container.id)

# 列出所有网络
networks = client.networks.list()
for net in networks:
    print(f"网络: {net.name} - 驱动: {net.attrs['Driver']}")

# 删除网络
network.remove()
```

### 数据卷管理

#### 创建和配置数据卷

```python
# 创建加密数据卷
volume = client.volumes.create(
    name="app_data",
    driver="local",
    driver_opts={
        "type": "ext4",
        "device": "/dev/sdb1",
        "o": "encrypt"                 # 加密选项
    },
    labels={
        "backup": "daily",
        "retention": "30d",
        "project": "myapp"
    }
)

print(f"数据卷创建成功: {volume.name}")
```

#### 数据卷操作

```python
# 列出所有数据卷
volumes = client.volumes.list()
for vol in volumes:
    print(f"数据卷: {vol.name} - 挂载点: {vol.attrs['Mountpoint']}")

# 在容器中使用数据卷
container = client.containers.run(
    image="postgres:13",
    name="database",
    detach=True,
    environment={
        'POSTGRES_DB': 'myapp',
        'POSTGRES_USER': 'user',
        'POSTGRES_PASSWORD': os.environ.get('DB_PASSWORD', 'secret')
    },
    volumes={
        'app_data': {
            'bind': '/var/lib/postgresql/data',
            'mode': 'rw'
        }
    }
)

# 删除数据卷
try:
    volume.remove(force=True)
    print("数据卷删除成功")
except docker.errors.APIError as e:
    print(f"删除失败: {e}")
```

### 安全操作和验证

#### 容器安全检查

```python
def check_container_security(container):
    """检查容器安全配置"""
    inspect = container.attrs
    host_config = inspect['HostConfig']
    
    # 检查特权模式
    if host_config.get('Privileged', False):
        raise SecurityError("容器运行在特权模式，存在安全风险")
    
    # 检查能力添加
    if host_config.get('CapAdd'):
        print(f"警告: 容器添加了能力 {host_config['CapAdd']}")
    
    # 检查资源限制
    if not host_config.get('Memory'):
        print("警告: 未设置内存限制")
    
    if not host_config.get('CpuQuota'):
        print("警告: 未设置 CPU 限制")
    
    print("安全检查完成")

# 使用示例
try:
    container = client.containers.get('web-server')
    check_container_security(container)
except Exception as e:
    print(f"安全检查失败: {e}")
```

#### 资源限制验证

```python
def validate_resource_limits(container):
    """验证容器资源限制"""
    config = container.attrs['HostConfig']
    
    # 内存限制检查（不超过 1GB）
    memory_limit = config.get('Memory', 0)
    max_memory = 1024 * 1024 * 1024  # 1GB
    assert memory_limit <= max_memory, f"内存限制 {memory_limit} 超过最大值 {max_memory}"
    
    # CPU 限制检查（不超过 2 核）
    nano_cpus = config.get('NanoCpus', 0)
    max_cpus = 2 * 1e9  # 2 核
    assert nano_cpus <= max_cpus, f"CPU 限制 {nano_cpus} 超过最大值 {max_cpus}"
    
    # 进程数限制检查
    pids_limit = config.get('PidsLimit', 0)
    if pids_limit == 0 or pids_limit > 1000:
        print("警告: 进程数限制过高或未设置")
    
    print("资源限制验证通过")

# 验证示例
validate_resource_limits(container)
```

### 事件监控

```python
# 监控 Docker 事件
def monitor_docker_events():
    """监控 Docker 事件并记录"""
    event_stream = client.events(
        decode=True,
        filters={
            'type': ['container', 'network', 'volume'],
            'event': ['create', 'destroy', 'start', 'stop']
        }
    )
    
    for event in event_stream:
        timestamp = event.get('time', 'unknown')
        event_type = event.get('Type', 'unknown')
        action = event.get('Action', 'unknown')
        actor_id = event.get('Actor', {}).get('ID', 'unknown')[:12]
        
        print(f"[{timestamp}] {event_type.upper()} {action}: {actor_id}")
        
        # 安全事件处理
        if action in ['create', 'start'] and event_type == 'container':
            try:
                container = client.containers.get(actor_id)
                check_container_security(container)
            except Exception as e:
                print(f"安全检查异常: {e}")

# 在后台线程中运行事件监控
import threading
monitor_thread = threading.Thread(target=monitor_docker_events, daemon=True)
monitor_thread.start()
```

### 错误处理模式

```python
import docker.errors
import time

def robust_container_operation(operation_func, max_retries=3, delay=1):
    """带重试的容器操作"""
    for attempt in range(max_retries):
        try:
            return operation_func()
        except docker.errors.NotFound:
            print("资源不存在")
            return None
        except docker.errors.Conflict as e:
            print(f"冲突错误: {e.explanation}")
            if attempt < max_retries - 1:
                time.sleep(delay)
                continue
            raise
        except docker.errors.APIError as e:
            if e.status_code == 500:  # 服务器错误，可重试
                if attempt < max_retries - 1:
                    print(f"服务器错误，{delay}秒后重试...")
                    time.sleep(delay)
                    continue
            print(f"API 错误: {e.explanation}")
            raise
        except Exception as e:
            print(f"未知错误: {e}")
            raise
        finally:
            # 确保客户端连接关闭
            if hasattr(operation_func, '__self__'):
                getattr(operation_func.__self__, 'close', lambda: None)()

# 使用示例
def create_test_container():
    return client.containers.create('alpine', command=['echo', 'hello'])

container = robust_container_operation(create_test_container)
```

## ✅ 最佳实践

- 安全基线
  - 使用非 root 用户运行容器（user 参数）
  - 严格移除能力（cap_drop=['ALL']）并开启只读文件系统（read_only=True）
  - 使用 no-new-privileges 与 seccomp/AppArmor 配置
- 稳定性与可观测性
  - 配置 restart_policy 与 healthcheck，提升容器自愈能力
  - 打通日志（logging driver 或容器内统一写到 stdout/err），结合标准库 logging 统一采集
- 供应链与镜像治理
  - 固定镜像版本或摘要（tag 或 digest），定期扫描与更新
  - 采用精简基础镜像与多阶段构建，减小攻击面与镜像体积
- 资源与隔离
  - 为 CPU/内存/进程数设置上限，避免资源争抢
  - 使用自定义网络进行服务隔离，根据需要限制外网访问（internal 网络）
- 机密管理
  - 不在镜像中硬编码密钥，优先使用环境变量/文件挂载/密钥管理服务

## 💡 实际应用

### 基础用法

```python
# 简单的容器管理脚本
import docker

def manage_web_app():
    """管理 Web 应用容器"""
    client = docker.from_env()
    
    try:
        # 检查容器是否存在
        try:
            container = client.containers.get('web-app')
            print(f"容器状态: {container.status}")
        except docker.errors.NotFound:
            # 创建新容器
            container = client.containers.run(
                image='nginx:alpine',
                name='web-app',
                ports={'80/tcp': 8080},
                detach=True,
                restart_policy={"Name": "unless-stopped"}
            )
            print(f"容器已创建: {container.id[:12]}")
        
        # 确保容器运行
        if container.status != 'running':
            container.start()
            print("容器已启动")
        
    finally:
        client.close()

if __name__ == "__main__":
    manage_web_app()
```

### 高级用法

```python
# 完整的应用部署脚本
import docker
import os
import yaml

class ApplicationDeployer:
    """应用部署管理器"""
    
    def __init__(self, config_file='docker-config.yml'):
        self.client = docker.from_env()
        self.config = self._load_config(config_file)
    
    def _load_config(self, config_file):
        """加载配置文件"""
        with open(config_file, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    
    def deploy_application(self):
        """部署完整应用栈"""
        try:
            # 创建网络
            network = self._create_network()
            
            # 创建数据卷
            volumes = self._create_volumes()
            
            # 部署数据库
            db_container = self._deploy_database(network, volumes)
            
            # 部署应用
            app_container = self._deploy_application_server(network, volumes)
            
            # 部署负载均衡器
            lb_container = self._deploy_load_balancer(network)
            
            print("应用部署完成")
            return {
                'network': network,
                'database': db_container,
                'application': app_container,
                'load_balancer': lb_container
            }
            
        except Exception as e:
            print(f"部署失败: {e}")
            self._cleanup()
            raise
    
    def _create_network(self):
        """创建应用网络"""
        network_config = self.config['network']
        try:
            return self.client.networks.get(network_config['name'])
        except docker.errors.NotFound:
            return self.client.networks.create(
                network_config['name'],
                driver=network_config.get('driver', 'bridge'),
                ipam=docker.types.IPAMConfig(
                    pool_configs=[
                        docker.types.IPAMPool(
                            subnet=network_config['subnet']
                        )
                    ]
                )
            )
    
    def _create_volumes(self):
        """创建数据卷"""
        volumes = {}
        for vol_name, vol_config in self.config['volumes'].items():
            try:
                volume = self.client.volumes.get(vol_name)
            except docker.errors.NotFound:
                volume = self.client.volumes.create(
                    name=vol_name,
                    driver=vol_config.get('driver', 'local'),
                    labels=vol_config.get('labels', {})
                )
            volumes[vol_name] = volume
        return volumes
    
    def _deploy_database(self, network, volumes):
        """部署数据库容器"""
        db_config = self.config['services']['database']
        
        return self.client.containers.run(
            image=db_config['image'],
            name=db_config['name'],
            detach=True,
            network=network.name,
            environment=db_config['environment'],
            volumes={
                volumes['db_data'].name: {
                    'bind': '/var/lib/postgresql/data',
                    'mode': 'rw'
                }
            },
            restart_policy={"Name": "unless-stopped"},
            healthcheck=docker.types.Healthcheck(
                test=["CMD-SHELL", "pg_isready -U postgres"],
                interval=30000000000,  # 30s in nanoseconds
                timeout=10000000000,   # 10s in nanoseconds
                retries=3
            )
        )
    
    def _cleanup(self):
        """清理资源"""
        # 实现清理逻辑
        pass
    
    def __del__(self):
        """析构函数，确保客户端关闭"""
        if hasattr(self, 'client'):
            self.client.close()

# 配置文件示例 (docker-config.yml)
config_example = """
network:
  name: "app_network"
  driver: "bridge"
  subnet: "172.20.0.0/16"

volumes:
  db_data:
    driver: "local"
    labels:
      backup: "daily"
  app_logs:
    driver: "local"

services:
  database:
    name: "app_db"
    image: "postgres:13"
    environment:
      POSTGRES_DB: "myapp"
      POSTGRES_USER: "appuser"
      POSTGRES_PASSWORD: "secure_password"
"""
```

### 实际案例

```python
# 微服务健康检查和自动恢复
import docker
import time
import requests

class ServiceMonitor:
    """服务监控和自动恢复"""
    
    def __init__(self):
        self.client = docker.from_env()
        self.services = [
            {
                'name': 'web-api',
                'health_url': 'http://localhost:8080/health',
                'image': 'myapp:latest',
                'ports': {'8080/tcp': 8080}
            },
            {
                'name': 'worker',
                'health_cmd': ['python', 'health_check.py'],
                'image': 'myapp-worker:latest'
            }
        ]
    
    def monitor_services(self):
        """监控服务健康状态"""
        while True:
            for service in self.services:
                try:
                    container = self.client.containers.get(service['name'])
                    
                    if not self._is_healthy(service, container):
                        print(f"服务 {service['name']} 不健康，正在重启...")
                        self._restart_service(service, container)
                    else:
                        print(f"服务 {service['name']} 健康")
                        
                except docker.errors.NotFound:
                    print(f"服务 {service['name']} 不存在，正在创建...")
                    self._create_service(service)
                
                except Exception as e:
                    print(f"监控服务 {service['name']} 时出错: {e}")
            
            time.sleep(30)  # 30秒检查一次
    
    def _is_healthy(self, service, container):
        """检查服务健康状态"""
        # 检查容器状态
        if container.status != 'running':
            return False
        
        # HTTP 健康检查
        if 'health_url' in service:
            try:
                response = requests.get(service['health_url'], timeout=5)
                return response.status_code == 200
            except requests.RequestException:
                return False
        
        # 命令健康检查
        if 'health_cmd' in service:
            try:
                result = container.exec_run(service['health_cmd'])
                return result.exit_code == 0
            except Exception:
                return False
        
        return True
    
    def _restart_service(self, service, container):
        """重启服务"""
        try:
            container.restart(timeout=10)
            time.sleep(5)  # 等待服务启动
        except Exception as e:
            print(f"重启失败，尝试重新创建: {e}")
            container.remove(force=True)
            self._create_service(service)
    
    def _create_service(self, service):
        """创建服务容器"""
        try:
            self.client.containers.run(
                image=service['image'],
                name=service['name'],
                detach=True,
                ports=service.get('ports', {}),
                restart_policy={"Name": "unless-stopped"},
                healthcheck=docker.types.Healthcheck(
                    test=service.get('health_cmd', ["CMD-SHELL", "exit 0"]),
                    interval=30000000000,  # 30s
                    timeout=10000000000,   # 10s
                    retries=3
                )
            )
            print(f"服务 {service['name']} 创建成功")
        except Exception as e:
            print(f"创建服务失败: {e}")

# 使用示例
if __name__ == "__main__":
    monitor = ServiceMonitor()
    monitor.monitor_services()
```

## ⚠️ 注意事项

### 安全最佳实践

1. **认证安全**：
   - 禁止使用未加密的 TCP 连接（`tcp://` 必须配合 TLS）
   - 定期轮换客户端证书
   - 使用环境变量管理敏感信息

2. **运行时安全**：
   ```python
   # 必须配置的安全参数
   security_params = {
       'user': 'nonroot_user',        # 非 root 用户
       'cap_drop': ['ALL'],           # 移除所有特权
       'read_only': True,             # 只读文件系统
       'security_opt': ['no-new-privileges'],  # 禁止新特权
       'network_mode': 'isolated_network'      # 网络隔离
   }
   ```

3. **镜像安全**：
   - 使用官方或可信镜像
   - 定期扫描镜像漏洞
   - 验证镜像签名和完整性

4. **资源限制**：
   ```python
   resource_limits = {
       'mem_limit': '512m',           # 内存限制
       'cpuset_cpus': '0-1',         # CPU 核心限制
       'pids_limit': 100,            # 进程数限制
       'ulimits': [
           docker.types.Ulimit(name='nofile', soft=1024, hard=2048)
       ]
   }
   ```

### 性能优化

- 合理设置资源限制，避免资源竞争
- 使用多阶段构建减少镜像大小
- 定期清理无用容器和镜像
- 使用健康检查确保服务可用性

### 错误处理

- 总是使用 try-except 捕获 Docker API 异常
- 实现重试机制处理临时性错误
- 记录详细的错误日志用于排查
- 确保在异常情况下正确清理资源

## 🧭 操作速查表

| 操作               | 方法                              | 安全参数示例                         |
|--------------------|-----------------------------------|--------------------------------------|
| 创建安全容器       | `containers.create()`             | `user`, `cap_drop`, `read_only`      |
| 运行一次性任务     | `containers.run()`                | `auto_remove=True`                    |
| 审计容器日志       | `container.logs()`                | `since`, `until`                      |
| 镜像漏洞扫描       | 集成 Trivy/Clair                  | 返回扫描报告                          |
| 网络隔离           | `network.create(internal=True)`   | 禁止外部访问                          |

> 建议结合使用 Seccomp 和 AppArmor 配置文件：`security_opt=['seccomp=/path/to/profile.json']`

## 🔗 相关内容
- [subprocess - 进程管理](../../stdlib/subprocess/)
- [logging 模块 - 日志记录与管理](/stdlib/logging/)
- [Paramiko - SSH 远程控制](../paramiko/)
- [PyInstaller - 程序打包](../pyinstaller/)
- [Nuitka - 编译打包](../nuitka/)

## 📚 扩展阅读

- [Docker SDK for Python 官方文档](https://docker-py.readthedocs.io/)
- [Docker API 参考](https://docs.docker.com/engine/api/)
- [Docker 安全最佳实践](https://docs.docker.com/engine/security/)
- [容器化应用部署指南](https://kubernetes.io/docs/concepts/)

## 🏷️ 标签

`docker` `容器化` `SDK` `容器管理` `镜像管理` `网络管理` `安全` `部署`

---

**最后更新**: 2025-01-21  
**作者**: Python 技术文档工程师  
**版本**: 1.0