---
layout: doc
title: Typer - 现代化 Python CLI 框架
permalink: /docs/thirdparty/typer/
category: thirdparty
tags: [typer, CLI, 命令行, 参数解析, 交互式, 现代化]
description: Typer 是一个现代化的 Python 命令行界面框架，基于 Python 类型提示构建，提供简洁的 API 和强大的功能
author: Python 技术文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
python_version: "3.6+"
library_version: "typer>=0.9.0"
difficulty: "中级"
estimated_time: "90分钟"
---

# Typer - 现代化 Python CLI 框架

## 📝 概述

Typer 是一个现代化的 Python 命令行界面（CLI）框架，建立在 Python 类型提示的基础之上。它由 FastAPI 的作者开发，旨在为创建命令行应用提供简洁、直观且功能强大的解决方案。Typer 自动生成帮助文档，支持参数验证和自动补全。

## 🎯 学习目标

- 掌握 Typer 的基本概念和设计理念
- 学会创建简单和复杂的命令行应用
- 熟练使用参数和选项处理
- 掌握子命令和多级命令的实现
- 了解交互式功能和用户输入处理
- 学会美化输出和错误处理

## 📋 前置知识

- Python 基础语法和函数定义
- Python 类型提示（Type Hints）
- 命令行基础概念
- 函数装饰器的基本使用

## 🔍 详细内容

### 基本概念

Typer 的核心特性：
- **基于类型提示**：使用 Python 类型提示自动推断参数类型
- **自动文档生成**：根据函数签名和文档字符串生成帮助信息
- **参数验证**：自动验证参数类型和约束
- **现代化API**：简洁直观的 API 设计
- **自动补全**：支持 shell 自动补全

### 安装和基础设置

```bash
# 安装 Typer
pip install typer

# 可选：安装完整功能（包括rich支持）
pip install "typer[all]"
```

### 基础命令定义

#### 创建第一个 Typer 应用

```python
import typer

app = typer.Typer()

@app.command()
def hello(name: str):
    """向指定的人问好"""
    typer.echo(f"Hello {name}")

@app.command()
def goodbye(name: str, formal: bool = False):
    """向指定的人告别"""
    if formal:
        typer.echo(f"Goodbye Ms. {name}. Have a great day.")
    else:
        typer.echo(f"Bye {name}!")

if __name__ == "__main__":
    app()
```

运行示例：
```bash
python app.py hello World
# 输出: Hello World

python app.py goodbye --formal Alice
# 输出: Goodbye Ms. Alice. Have a great day.
```

#### 单命令应用

```python
import typer

def main(name: str, count: int = 1, formal: bool = False):
    """
    简单的问候程序
    
    Args:
        name: 要问候的人的名字
        count: 问候的次数
        formal: 是否使用正式的问候语
    """
    greeting = "Good day" if formal else "Hi"
    for _ in range(count):
        typer.echo(f"{greeting} {name}!")

if __name__ == "__main__":
    typer.run(main)
```

### 参数和选项处理

#### 参数类型

```python
import typer
from typing import List
from pathlib import Path

app = typer.Typer()

@app.command()
def process_files(
    files: List[Path],
    output_dir: Path = typer.Option("./output", help="输出目录"),
    recursive: bool = typer.Option(False, "--recursive", "-r", help="递归处理"),
    verbose: bool = typer.Option(False, "--verbose", "-v", help="详细输出"),
    max_size: int = typer.Option(1024, help="最大文件大小（KB）")
):
    """处理指定的文件"""
    if verbose:
        typer.echo(f"处理 {len(files)} 个文件")
        typer.echo(f"输出目录: {output_dir}")
        typer.echo(f"递归模式: {recursive}")
        typer.echo(f"最大文件大小: {max_size}KB")
    
    for file in files:
        if file.exists():
            typer.echo(f"处理文件: {file}")
        else:
            typer.echo(f"文件不存在: {file}", err=True)
```

#### 参数验证和约束

```python
import typer
from typing import Optional

app = typer.Typer()

@app.command()
def create_user(
    username: str = typer.Argument(..., help="用户名"),
    password: str = typer.Option(..., prompt=True, hide_input=True, help="密码"),
    email: Optional[str] = typer.Option(None, help="邮箱地址"),
    age: int = typer.Option(..., min=18, max=120, help="年龄（18-120）"),
    role: str = typer.Option("user", help="用户角色", 
                           click_type=typer.Choice(["admin", "user", "guest"]))
):
    """创建新用户"""
    typer.echo(f"创建用户: {username}")
    typer.echo(f"邮箱: {email or '未提供'}")
    typer.echo(f"年龄: {age}")
    typer.echo(f"角色: {role}")
```

### 子命令和多级命令

#### 创建子命令

```python
import typer

# 主应用
app = typer.Typer()

# 用户管理子命令组
users_app = typer.Typer()
app.add_typer(users_app, name="users")

# 项目管理子命令组
projects_app = typer.Typer()
app.add_typer(projects_app, name="projects")

@users_app.command("create")
def create_user(username: str, email: str):
    """创建新用户"""
    typer.echo(f"创建用户: {username} ({email})")

@users_app.command("delete")
def delete_user(username: str):
    """删除用户"""
    if typer.confirm(f"确定要删除用户 {username} 吗？"):
        typer.echo(f"用户 {username} 已删除")
    else:
        typer.echo("操作已取消")

@users_app.command("list")
def list_users():
    """列出所有用户"""
    users = ["alice", "bob", "charlie"]
    for user in users:
        typer.echo(f"- {user}")

@projects_app.command("create")
def create_project(name: str, description: str = ""):
    """创建新项目"""
    typer.echo(f"创建项目: {name}")
    if description:
        typer.echo(f"描述: {description}")

@projects_app.command("list")
def list_projects():
    """列出所有项目"""
    projects = ["web-app", "api-service", "data-pipeline"]
    for project in projects:
        typer.echo(f"- {project}")

if __name__ == "__main__":
    app()
```

使用示例：
```bash
python app.py users create alice alice@example.com
python app.py users list
python app.py projects create "my-app" "一个很棒的应用"
```

### 交互式功能

#### 用户输入和确认

```python
import typer
from typing import Optional

app = typer.Typer()

@app.command()
def interactive_setup():
    """交互式配置程序"""
    
    # 普通输入
    name = typer.prompt("请输入您的姓名")
    
    # 密码输入（隐藏）
    password = typer.prompt("请输入密码", hide_input=True)
    
    # 带默认值的输入
    email = typer.prompt("请输入邮箱", default="user@example.com")
    
    # 确认操作
    if typer.confirm("您确定要继续吗？"):
        typer.echo("配置已保存！")
        typer.echo(f"姓名: {name}")
        typer.echo(f"邮箱: {email}")
    else:
        typer.echo("配置已取消")

@app.command()
def choose_option():
    """选择选项示例"""
    
    options = ["选项1", "选项2", "选项3"]
    
    typer.echo("请选择一个选项:")
    for i, option in enumerate(options, 1):
        typer.echo(f"{i}. {option}")
    
    choice = typer.prompt("请输入选项编号", type=int)
    
    if 1 <= choice <= len(options):
        selected = options[choice - 1]
        typer.echo(f"您选择了: {selected}")
    else:
        typer.echo("无效的选项", err=True)
        raise typer.Exit(1)
```

### 美化输出和进度显示

#### 彩色输出和样式

```python
import typer
import time
from rich.console import Console
from rich.table import Table
from rich.progress import track

app = typer.Typer()
console = Console()

@app.command()
def colored_output():
    """彩色输出示例"""
    
    # 使用 typer.secho 进行彩色输出
    typer.secho("成功消息", fg=typer.colors.GREEN, bold=True)
    typer.secho("警告消息", fg=typer.colors.YELLOW)
    typer.secho("错误消息", fg=typer.colors.RED, err=True)
    
    # 使用 rich 进行更丰富的输出
    console.print("这是 [bold red]粗体红色[/bold red] 文本")
    console.print("这是 [italic blue]斜体蓝色[/italic blue] 文本")

@app.command()
def show_table():
    """显示表格"""
    
    table = Table(title="用户信息")
    table.add_column("ID", style="cyan")
    table.add_column("姓名", style="magenta")
    table.add_column("邮箱", style="green")
    
    table.add_row("1", "Alice", "alice@example.com")
    table.add_row("2", "Bob", "bob@example.com")
    table.add_row("3", "Charlie", "charlie@example.com")
    
    console.print(table)

@app.command()
def progress_demo():
    """进度条示例"""
    
    tasks = ["任务1", "任务2", "任务3", "任务4", "任务5"]
    
    for task in track(tasks, description="处理中..."):
        time.sleep(1)  # 模拟耗时操作
        typer.echo(f"完成 {task}")
```

### 错误处理和退出

```python
import typer
from pathlib import Path

app = typer.Typer()

@app.command()
def process_file(file_path: Path):
    """处理文件"""
    
    if not file_path.exists():
        typer.echo(f"错误: 文件 {file_path} 不存在", err=True)
        raise typer.Exit(1)
    
    if not file_path.is_file():
        typer.echo(f"错误: {file_path} 不是一个文件", err=True)
        raise typer.Exit(1)
    
    try:
        with open(file_path, 'r') as f:
            content = f.read()
            typer.echo(f"文件大小: {len(content)} 字符")
    except PermissionError:
        typer.echo("错误: 没有权限读取文件", err=True)
        raise typer.Exit(1)
    except Exception as e:
        typer.echo(f"处理文件时出错: {e}", err=True)
        raise typer.Exit(1)

@app.command()
def safe_operation():
    """安全操作示例"""
    
    try:
        # 危险操作
        result = 10 / 0
    except ZeroDivisionError:
        typer.echo("除零错误!", err=True)
        if typer.confirm("是否继续其他操作？"):
            typer.echo("继续执行...")
        else:
            raise typer.Abort()  # 用户取消操作
```

## 💡 实际应用

### 文件管理工具

```python
import typer
import shutil
from pathlib import Path
from typing import Optional, List

app = typer.Typer(help="文件管理工具")

@app.command()
def copy(
    source: Path = typer.Argument(..., help="源文件或目录"),
    destination: Path = typer.Argument(..., help="目标位置"),
    recursive: bool = typer.Option(False, "--recursive", "-r", help="递归复制目录"),
    overwrite: bool = typer.Option(False, "--overwrite", help="覆盖已存在的文件")
):
    """复制文件或目录"""
    
    if not source.exists():
        typer.echo(f"错误: 源路径 {source} 不存在", err=True)
        raise typer.Exit(1)
    
    if destination.exists() and not overwrite:
        if not typer.confirm(f"目标 {destination} 已存在，是否覆盖？"):
            typer.echo("操作已取消")
            return
    
    try:
        if source.is_file():
            shutil.copy2(source, destination)
        elif source.is_dir() and recursive:
            shutil.copytree(source, destination, dirs_exist_ok=overwrite)
        else:
            typer.echo("错误: 复制目录需要使用 --recursive 选项", err=True)
            raise typer.Exit(1)
        
        typer.secho(f"✓ 复制完成: {source} -> {destination}", fg=typer.colors.GREEN)
    
    except Exception as e:
        typer.echo(f"复制失败: {e}", err=True)
        raise typer.Exit(1)

@app.command()
def find(
    pattern: str = typer.Argument(..., help="搜索模式"),
    directory: Path = typer.Option(".", help="搜索目录"),
    file_type: Optional[str] = typer.Option(None, help="文件类型过滤（如 .py, .txt）")
):
    """搜索文件"""
    
    if not directory.exists():
        typer.echo(f"错误: 目录 {directory} 不存在", err=True)
        raise typer.Exit(1)
    
    matches = []
    
    for path in directory.rglob(pattern):
        if file_type and not path.name.endswith(file_type):
            continue
        matches.append(path)
    
    if matches:
        typer.echo(f"找到 {len(matches)} 个匹配项:")
        for match in matches:
            typer.echo(f"  {match}")
    else:
        typer.echo("未找到匹配的文件")

if __name__ == "__main__":
    app()
```

### API 客户端工具

```python
import typer
import requests
from typing import Optional
from rich.console import Console
from rich.json import JSON

app = typer.Typer(help="API 客户端工具")
console = Console()

@app.command()
def get(
    url: str = typer.Argument(..., help="API URL"),
    headers: Optional[List[str]] = typer.Option(None, "--header", "-H", help="请求头 (格式: Key:Value)"),
    timeout: int = typer.Option(30, help="超时时间（秒）"),
    pretty: bool = typer.Option(True, help="美化 JSON 输出")
):
    """发送 GET 请求"""
    
    # 解析请求头
    request_headers = {}
    if headers:
        for header in headers:
            if ':' in header:
                key, value = header.split(':', 1)
                request_headers[key.strip()] = value.strip()
    
    try:
        with console.status("[bold green]发送请求中..."):
            response = requests.get(url, headers=request_headers, timeout=timeout)
        
        # 显示响应信息
        console.print(f"[bold]状态码:[/bold] {response.status_code}")
        console.print(f"[bold]响应时间:[/bold] {response.elapsed.total_seconds():.2f}s")
        
        # 显示响应内容
        if response.headers.get('content-type', '').startswith('application/json'):
            try:
                json_data = response.json()
                if pretty:
                    console.print(JSON.from_data(json_data))
                else:
                    console.print(json_data)
            except ValueError:
                console.print("响应不是有效的 JSON 格式")
                console.print(response.text)
        else:
            console.print(response.text)
    
    except requests.RequestException as e:
        typer.echo(f"请求失败: {e}", err=True)
        raise typer.Exit(1)

@app.command()
def post(
    url: str = typer.Argument(..., help="API URL"),
    data: Optional[str] = typer.Option(None, help="POST 数据"),
    file: Optional[Path] = typer.Option(None, help="从文件读取 POST 数据"),
    content_type: str = typer.Option("application/json", help="Content-Type")
):
    """发送 POST 请求"""
    
    # 准备请求数据
    post_data = None
    if file:
        if not file.exists():
            typer.echo(f"错误: 文件 {file} 不存在", err=True)
            raise typer.Exit(1)
        post_data = file.read_text()
    elif data:
        post_data = data
    
    headers = {"Content-Type": content_type}
    
    try:
        with console.status("[bold green]发送 POST 请求中..."):
            response = requests.post(url, data=post_data, headers=headers)
        
        console.print(f"[bold]状态码:[/bold] {response.status_code}")
        console.print(response.text)
    
    except requests.RequestException as e:
        typer.echo(f"请求失败: {e}", err=True)
        raise typer.Exit(1)

if __name__ == "__main__":
    app()
```

## ⚠️ 注意事项

- **类型提示是必需的**：Typer 依赖类型提示来推断参数类型
- **参数顺序很重要**：位置参数必须在关键字参数之前
- **选项名称约定**：使用下划线的参数名会自动转换为连字符
- **导入依赖**：某些功能（如 rich 支持）需要额外安装依赖
- **错误处理**：适当使用 `typer.Exit()` 和 `typer.Abort()` 来处理错误
- **性能考虑**：对于简单脚本，Typer 可能比内置的 argparse 略重

## 🔗 相关内容

- [sys 模块 - 命令行参数处理](../../stdlib/sys/) （底层参数处理）
- [argparse 模块 - 参数解析](../../stdlib/argparse/) （标准库替代方案）
- [Click 库 - Typer 的基础](../click/)
- [Rich 库 - 终端美化](../rich/)

## 📚 扩展阅读

- [Typer 官方文档](https://typer.tiangolo.com/)
- [FastAPI 官方文档](https://fastapi.tiangolo.com/) （同一作者）
- [Python 类型提示指南](https://docs.python.org/3/library/typing.html)
- [Click 文档](https://click.palletsprojects.com/)

## 🏷️ 标签

`typer` `CLI` `命令行` `类型提示` `现代化` `交互式`

---

**最后更新**: 2024-01-15  
**作者**: Python 技术文档工程师  
**版本**: 1.0