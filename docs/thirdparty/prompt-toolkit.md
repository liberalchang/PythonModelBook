---
layout: doc
title: Python Prompt Toolkit - 强大的交互式命令行库
permalink: /docs/thirdparty/prompt-toolkit/
category: thirdparty
tags: [prompt-toolkit, 命令行, 交互式, 终端应用, REPL, 自动补全]
description: Python Prompt Toolkit 是一个用于构建强大交互式命令行和终端应用程序的库，提供语法高亮、多行编辑、自动补全等高级功能
author: Python 技术文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
python_version: "3.6+"
library_version: "prompt-toolkit>=3.0.0"
difficulty: "高级"
estimated_time: "120分钟"
---

# Python Prompt Toolkit - 强大的交互式命令行库

## 📝 概述

Python Prompt Toolkit 是一个用于构建强大交互式命令行和终端应用程序的Python库 <mcreference link="https://python-prompt-toolkit.readthedocs.io/en/stable/" index="0">0</mcreference>。它可以作为GNU readline的高级纯Python替代品，也可以用于构建全屏终端应用程序 <mcreference link="https://python-prompt-toolkit.readthedocs.io/en/stable/" index="0">0</mcreference>。该库提供了丰富的功能，包括语法高亮、多行输入编辑、高级代码补全、文本选择复制粘贴、鼠标支持等特性 <mcreference link="https://python-prompt-toolkit.readthedocs.io/en/stable/" index="0">0</mcreference>。

## 🎯 学习目标

- 掌握 Prompt Toolkit 的基本概念和架构
- 学会创建交互式提示符和输入界面
- 熟练使用语法高亮和自动补全功能
- 掌握全屏终端应用程序的开发
- 了解进度条和对话框的实现
- 学会自定义键绑定和样式

## 📋 前置知识

- Python 基础语法和面向对象编程
- 终端和命令行基础概念
- 正则表达式基础知识
- 异步编程概念（asyncio）

## 🔍 详细内容

### 基本概念

Prompt Toolkit 的核心特性 <mcreference link="https://python-prompt-toolkit.readthedocs.io/en/stable/" index="0">0</mcreference>：

- **语法高亮**：支持输入时的实时语法高亮（例如使用Pygments词法分析器）
- **多行输入编辑**：支持复杂的多行文本编辑
- **高级代码补全**：智能的自动补全功能
- **文本选择**：支持复制粘贴操作（Emacs和Vi风格）
- **鼠标支持**：支持鼠标定位光标和滚动
- **自动建议**：类似fish shell的自动建议功能
- **无全局状态**：设计上避免全局状态

### 安装和基础设置

```bash
# 安装 Prompt Toolkit
pip install prompt-toolkit

# 安装完整功能（包括Pygments支持）
pip install prompt-toolkit[full]

# 验证安装
python -c "import prompt_toolkit; print(prompt_toolkit.__version__)"
```

### 兼容性和平台支持

Prompt Toolkit 具有出色的兼容性 <mcreference link="https://python-prompt-toolkit.readthedocs.io/en/stable/" index="0">0</mcreference>：

- **纯Python实现**：支持Python 3.6及以上版本
- **跨平台运行**：在Linux、macOS、OpenBSD和Windows系统上运行
- **轻量级依赖**：仅依赖Pygments和wcwidth库
- **I/O无关性**：可在telnet/ssh服务器或asyncio进程中运行

### 基础提示符创建

#### 简单的输入提示

```python
from prompt_toolkit import prompt

# 基础输入提示
def basic_prompt():
    """创建基础的输入提示"""
    user_input = prompt('请输入您的名字: ')
    print(f'您好, {user_input}!')

# 带默认值的提示
def prompt_with_default():
    """带默认值的输入提示"""
    name = prompt('请输入姓名: ', default='匿名用户')
    print(f'欢迎, {name}!')

# 运行示例
if __name__ == '__main__':
    basic_prompt()
    prompt_with_default()
```

#### 密码输入和隐藏文本

```python
from prompt_toolkit import prompt
import getpass

def secure_input():
    """安全输入示例"""
    
    # 隐藏密码输入
    password = prompt('请输入密码: ', is_password=True)
    
    # 或者使用getpass模块
    # password = getpass.getpass('请输入密码: ')
    
    print('密码已设置')

def confirm_password():
    """密码确认示例"""
    while True:
        password = prompt('请输入密码: ', is_password=True)
        confirm = prompt('请确认密码: ', is_password=True)
        
        if password == confirm:
            print('密码设置成功!')
            break
        else:
            print('密码不匹配，请重新输入')
```

### 语法高亮和格式化

#### 使用Pygments进行语法高亮

```python
from prompt_toolkit import prompt
from prompt_toolkit.lexers import PygmentsLexer
from pygments.lexers.python import PythonLexer

def python_code_input():
    """Python代码输入with语法高亮"""
    
    code = prompt(
        'Python>>> ',
        lexer=PygmentsLexer(PythonLexer),
        multiline=True
    )
    
    print('您输入的代码:')
    print(code)

# SQL语法高亮示例
from pygments.lexers.sql import SqlLexer

def sql_input():
    """SQL输入with语法高亮"""
    
    query = prompt(
        'SQL> ',
        lexer=PygmentsLexer(SqlLexer),
        multiline=True
    )
    
    print(f'执行查询: {query}')
```

#### 自定义语法高亮

```python
from prompt_toolkit import prompt
from prompt_toolkit.lexers import SimpleLexer
from prompt_toolkit.styles import Style

# 自定义样式
custom_style = Style.from_dict({
    'keyword': '#ff0066 bold',
    'string': '#44aa44',
    'number': '#aa6600',
    'comment': '#999999 italic',
})

def custom_highlight():
    """自定义语法高亮"""
    
    text = prompt(
        '自定义> ',
        style=custom_style,
        lexer=SimpleLexer('keyword')
    )
    
    print(f'输入内容: {text}')
```

### 自动补全功能

#### 基础自动补全

```python
from prompt_toolkit import prompt
from prompt_toolkit.completion import WordCompleter

def basic_completion():
    """基础单词补全"""
    
    # 预定义的补全选项
    commands = ['list', 'create', 'delete', 'update', 'help', 'exit']
    completer = WordCompleter(commands)
    
    while True:
        user_input = prompt('命令> ', completer=completer)
        
        if user_input == 'exit':
            break
        elif user_input in commands:
            print(f'执行命令: {user_input}')
        else:
            print('未知命令，输入help查看帮助')

# 忽略大小写的补全
def case_insensitive_completion():
    """忽略大小写的补全"""
    
    languages = ['Python', 'JavaScript', 'Java', 'C++', 'Go', 'Rust']
    completer = WordCompleter(languages, ignore_case=True)
    
    language = prompt('选择编程语言: ', completer=completer)
    print(f'您选择了: {language}')
```

#### 高级补全功能

```python
from prompt_toolkit.completion import Completer, Completion
import os

class FileCompleter(Completer):
    """文件路径补全器"""
    
    def get_completions(self, document, complete_event):
        """获取文件路径补全选项"""
        
        text = document.text_before_cursor
        
        # 获取当前目录的文件和文件夹
        try:
            if os.path.isdir(text):
                directory = text
                prefix = ''
            else:
                directory = os.path.dirname(text) or '.'
                prefix = os.path.basename(text)
            
            for filename in os.listdir(directory):
                if filename.startswith(prefix):
                    full_path = os.path.join(directory, filename)
                    if os.path.isdir(full_path):
                        filename += '/'
                    
                    yield Completion(
                        filename,
                        start_position=-len(prefix)
                    )
        except (OSError, PermissionError):
            pass

def file_browser():
    """文件浏览器示例"""
    
    completer = FileCompleter()
    
    while True:
        file_path = prompt('文件路径> ', completer=completer)
        
        if file_path == 'exit':
            break
        
        if os.path.exists(file_path):
            if os.path.isfile(file_path):
                print(f'文件: {file_path}')
            elif os.path.isdir(file_path):
                print(f'目录: {file_path}')
        else:
            print('路径不存在')
```

### 输入验证

#### 基础验证器

```python
from prompt_toolkit import prompt
from prompt_toolkit.validation import Validator, ValidationError
import re

class EmailValidator(Validator):
    """邮箱地址验证器"""
    
    def validate(self, document):
        """验证邮箱格式"""
        text = document.text
        
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        
        if not re.match(email_pattern, text):
            raise ValidationError(
                message='请输入有效的邮箱地址',
                cursor_position=len(text)
            )

class NumberValidator(Validator):
    """数字验证器"""
    
    def __init__(self, min_value=None, max_value=None):
        self.min_value = min_value
        self.max_value = max_value
    
    def validate(self, document):
        """验证数字范围"""
        text = document.text
        
        try:
            number = int(text)
            
            if self.min_value is not None and number < self.min_value:
                raise ValidationError(
                    message=f'数字必须大于等于 {self.min_value}',
                    cursor_position=len(text)
                )
            
            if self.max_value is not None and number > self.max_value:
                raise ValidationError(
                    message=f'数字必须小于等于 {self.max_value}',
                    cursor_position=len(text)
                )
        
        except ValueError:
            raise ValidationError(
                message='请输入有效的数字',
                cursor_position=len(text)
            )

def validation_example():
    """验证示例"""
    
    # 邮箱验证
    email = prompt('请输入邮箱: ', validator=EmailValidator())
    print(f'邮箱: {email}')
    
    # 年龄验证
    age = prompt('请输入年龄 (18-100): ', 
                validator=NumberValidator(18, 100))
    print(f'年龄: {age}')
```

### 全屏终端应用

#### 创建简单的全屏应用

```python
from prompt_toolkit.application import Application
from prompt_toolkit.key_binding import KeyBindings
from prompt_toolkit.layout import Layout
from prompt_toolkit.widgets import TextArea, Frame
from prompt_toolkit.layout.containers import HSplit

def create_text_editor():
    """创建简单的文本编辑器"""
    
    # 创建文本区域
    text_area = TextArea(
        text='欢迎使用简单文本编辑器!\n按 Ctrl+Q 退出。',
        multiline=True,
        scrollbar=True
    )
    
    # 创建键绑定
    kb = KeyBindings()
    
    @kb.add('c-q')  # Ctrl+Q
    def exit_app(event):
        """退出应用"""
        event.app.exit()
    
    @kb.add('c-s')  # Ctrl+S
    def save_file(event):
        """保存文件（示例）"""
        # 这里可以添加保存逻辑
        text_area.text = text_area.text + '\n[已保存]'
    
    # 创建布局
    layout = Layout(
        Frame(
            body=text_area,
            title='简单文本编辑器'
        )
    )
    
    # 创建应用
    app = Application(
        layout=layout,
        key_bindings=kb,
        full_screen=True
    )
    
    return app

# 运行文本编辑器
def run_editor():
    """运行文本编辑器"""
    app = create_text_editor()
    app.run()
```

#### 多窗格应用

```python
from prompt_toolkit.layout.containers import VSplit, HSplit, Window
from prompt_toolkit.layout.controls import BufferControl
from prompt_toolkit.buffer import Buffer

def create_multi_pane_app():
    """创建多窗格应用"""
    
    # 创建缓冲区
    left_buffer = Buffer()
    right_buffer = Buffer()
    bottom_buffer = Buffer()
    
    # 创建窗口
    left_window = Window(
        content=BufferControl(buffer=left_buffer),
        wrap_lines=True
    )
    
    right_window = Window(
        content=BufferControl(buffer=right_buffer),
        wrap_lines=True
    )
    
    bottom_window = Window(
        content=BufferControl(buffer=bottom_buffer),
        height=5
    )
    
    # 创建布局
    layout = Layout(
        HSplit([
            VSplit([
                Frame(left_window, title='左侧面板'),
                Frame(right_window, title='右侧面板')
            ]),
            Frame(bottom_window, title='底部面板')
        ])
    )
    
    # 键绑定
    kb = KeyBindings()
    
    @kb.add('c-q')
    def exit_app(event):
        event.app.exit()
    
    return Application(
        layout=layout,
        key_bindings=kb,
        full_screen=True
    )
```

### 进度条和状态显示

#### 基础进度条

```python
from prompt_toolkit.shortcuts import ProgressBar
import time

def basic_progress_bar():
    """基础进度条示例"""
    
    with ProgressBar() as pb:
        for i in pb(range(100), label='处理中'):
            time.sleep(0.1)  # 模拟工作
    
    print('任务完成!')

def multiple_progress_bars():
    """多个进度条示例"""
    
    with ProgressBar() as pb:
        # 任务1
        task1 = pb(range(50), label='任务1')
        for i in task1:
            time.sleep(0.05)
        
        # 任务2
        task2 = pb(range(30), label='任务2')
        for i in task2:
            time.sleep(0.1)
        
        # 任务3
        task3 = pb(range(20), label='任务3')
        for i in task3:
            time.sleep(0.15)
    
    print('所有任务完成!')
```

#### 自定义进度条

```python
from prompt_toolkit.formatted_text import HTML
from prompt_toolkit.shortcuts import ProgressBar
from prompt_toolkit.styles import Style

def custom_progress_bar():
    """自定义样式的进度条"""
    
    # 自定义样式
    custom_style = Style.from_dict({
        'progressbar.title': '#884444 bold',
        'progressbar.label': '#ff8844',
        'progressbar.percentage': '#00aa44 bold',
        'progressbar.bar': '#44aa88',
        'progressbar.current': '#ffffff bold',
        'progressbar.total': '#ffffff bold',
    })
    
    with ProgressBar(style=custom_style) as pb:
        for i in pb(range(100), 
                   label=HTML('<b>自定义进度条</b>')):
            time.sleep(0.05)
```

### 对话框和弹窗

#### 消息框和确认对话框

```python
from prompt_toolkit.shortcuts import message_dialog, yes_no_dialog, input_dialog

def dialog_examples():
    """对话框示例"""
    
    # 消息对话框
    message_dialog(
        title='信息',
        text='这是一个消息对话框'
    ).run()
    
    # 确认对话框
    result = yes_no_dialog(
        title='确认',
        text='您确定要继续吗？'
    ).run()
    
    if result:
        print('用户选择了是')
    else:
        print('用户选择了否')
    
    # 输入对话框
    user_input = input_dialog(
        title='输入',
        text='请输入您的名字:'
    ).run()
    
    if user_input:
        print(f'您输入了: {user_input}')
```

#### 选择对话框

```python
from prompt_toolkit.shortcuts import radiolist_dialog, checkboxlist_dialog

def selection_dialogs():
    """选择对话框示例"""
    
    # 单选对话框
    languages = [
        ('python', 'Python'),
        ('java', 'Java'),
        ('javascript', 'JavaScript'),
        ('go', 'Go'),
        ('rust', 'Rust')
    ]
    
    selected_language = radiolist_dialog(
        title='选择编程语言',
        text='请选择您喜欢的编程语言:',
        values=languages
    ).run()
    
    if selected_language:
        print(f'您选择了: {selected_language}')
    
    # 多选对话框
    skills = [
        ('web', 'Web开发'),
        ('mobile', '移动开发'),
        ('ai', '人工智能'),
        ('data', '数据分析'),
        ('devops', 'DevOps')
    ]
    
    selected_skills = checkboxlist_dialog(
        title='选择技能',
        text='请选择您的技能领域:',
        values=skills
    ).run()
    
    if selected_skills:
        print(f'您选择的技能: {", ".join(selected_skills)}')
```

### 异步支持

#### 异步应用

```python
import asyncio
from prompt_toolkit.application import Application
from prompt_toolkit.eventloop import use_asyncio_event_loop

async def async_prompt_example():
    """异步提示符示例"""
    
    use_asyncio_event_loop()
    
    # 异步输入
    user_input = await prompt('异步输入> ', async_=True)
    print(f'您输入了: {user_input}')
    
    # 模拟异步处理
    await asyncio.sleep(1)
    print('异步处理完成')

def run_async_example():
    """运行异步示例"""
    asyncio.run(async_prompt_example())
```

## 💡 实际应用

### REPL (Read-Eval-Print Loop) 实现

```python
from prompt_toolkit import prompt
from prompt_toolkit.lexers import PygmentsLexer
from prompt_toolkit.completion import WordCompleter
from pygments.lexers.python import PythonLexer

class SimpleREPL:
    """简单的REPL实现"""
    
    def __init__(self):
        # 预定义命令
        self.commands = ['help', 'exit', 'clear', 'history']
        self.completer = WordCompleter(self.commands)
        self.history = []
    
    def run(self):
        """运行REPL"""
        print('欢迎使用简单REPL!')
        print('输入help查看帮助，exit退出')
        
        while True:
            try:
                user_input = prompt(
                    '>>> ',
                    completer=self.completer,
                    lexer=PygmentsLexer(PythonLexer)
                )
                
                if not user_input.strip():
                    continue
                
                self.history.append(user_input)
                
                if user_input == 'exit':
                    print('再见!')
                    break
                elif user_input == 'help':
                    self.show_help()
                elif user_input == 'clear':
                    os.system('cls' if os.name == 'nt' else 'clear')
                elif user_input == 'history':
                    self.show_history()
                else:
                    # 执行Python代码
                    try:
                        result = eval(user_input)
                        if result is not None:
                            print(result)
                    except Exception as e:
                        print(f'错误: {e}')
            
            except KeyboardInterrupt:
                print('\n使用exit命令退出')
            except EOFError:
                break
    
    def show_help(self):
        """显示帮助信息"""
        print('可用命令:')
        print('  help    - 显示此帮助')
        print('  exit    - 退出REPL')
        print('  clear   - 清屏')
        print('  history - 显示历史记录')
        print('  或输入任何Python表达式')
    
    def show_history(self):
        """显示历史记录"""
        print('历史记录:')
        for i, cmd in enumerate(self.history[-10:], 1):
            print(f'  {i}: {cmd}')

# 运行REPL
def run_repl():
    repl = SimpleREPL()
    repl.run()
```

### 配置管理工具

```python
import json
import os
from prompt_toolkit import prompt
from prompt_toolkit.validation import Validator, ValidationError

class ConfigManager:
    """配置管理工具"""
    
    def __init__(self, config_file='config.json'):
        self.config_file = config_file
        self.config = self.load_config()
    
    def load_config(self):
        """加载配置文件"""
        if os.path.exists(self.config_file):
            with open(self.config_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    
    def save_config(self):
        """保存配置文件"""
        with open(self.config_file, 'w', encoding='utf-8') as f:
            json.dump(self.config, f, ensure_ascii=False, indent=2)
    
    def setup_database(self):
        """数据库配置设置"""
        print('=== 数据库配置 ===')
        
        host = prompt('数据库主机: ', default=self.config.get('db_host', 'localhost'))
        port = prompt('数据库端口: ', default=str(self.config.get('db_port', 5432)))
        database = prompt('数据库名称: ', default=self.config.get('db_name', ''))
        username = prompt('用户名: ', default=self.config.get('db_user', ''))
        password = prompt('密码: ', is_password=True)
        
        self.config.update({
            'db_host': host,
            'db_port': int(port),
            'db_name': database,
            'db_user': username,
            'db_password': password
        })
    
    def setup_email(self):
        """邮箱配置设置"""
        print('=== 邮箱配置 ===')
        
        smtp_server = prompt('SMTP服务器: ', default=self.config.get('smtp_server', ''))
        smtp_port = prompt('SMTP端口: ', default=str(self.config.get('smtp_port', 587)))
        email = prompt('邮箱地址: ', default=self.config.get('email', ''))
        email_password = prompt('邮箱密码: ', is_password=True)
        
        self.config.update({
            'smtp_server': smtp_server,
            'smtp_port': int(smtp_port),
            'email': email,
            'email_password': email_password
        })
    
    def interactive_setup(self):
        """交互式配置设置"""
        print('欢迎使用配置管理工具!')
        
        while True:
            print('\n可用选项:')
            print('1. 数据库配置')
            print('2. 邮箱配置')
            print('3. 显示当前配置')
            print('4. 保存并退出')
            print('5. 退出不保存')
            
            choice = prompt('请选择 (1-5): ')
            
            if choice == '1':
                self.setup_database()
            elif choice == '2':
                self.setup_email()
            elif choice == '3':
                print('\n当前配置:')
                for key, value in self.config.items():
                    if 'password' in key:
                        value = '*' * len(str(value))
                    print(f'  {key}: {value}')
            elif choice == '4':
                self.save_config()
                print('配置已保存!')
                break
            elif choice == '5':
                print('退出不保存')
                break
            else:
                print('无效选择，请重新输入')

# 运行配置管理工具
def run_config_manager():
    manager = ConfigManager()
    manager.interactive_setup()
```

## ⚠️ 注意事项

- **依赖管理**：确保安装了必要的依赖（Pygments、wcwidth）
- **终端兼容性**：某些功能在不同终端中的表现可能有差异
- **键绑定冲突**：自定义键绑定时要注意与系统快捷键的冲突
- **内存使用**：大型全屏应用要注意内存使用情况
- **异步编程**：使用异步功能时要正确处理事件循环
- **Unicode支持**：确保终端支持Unicode字符显示
- **性能考虑**：复杂的语法高亮和补全可能影响响应速度

## 🔗 相关内容

- [Typer - 现代化 CLI 框架](../typer/) （简化的CLI开发）
- [Rich - 终端美化库](../rich/) （丰富的终端输出）
- [Click - 命令行界面创建工具](../click/)
- [sys 模块 - 系统接口](../../stdlib/sys/) （底层系统交互）

## 📚 扩展阅读

- [Python Prompt Toolkit 官方文档](https://python-prompt-toolkit.readthedocs.io/en/stable/) <mcreference link="https://python-prompt-toolkit.readthedocs.io/en/stable/" index="0">0</mcreference>
- [Pygments 语法高亮库](https://pygments.org/)
- [Python 异步编程指南](https://docs.python.org/3/library/asyncio.html)
- [终端控制序列参考](https://en.wikipedia.org/wiki/ANSI_escape_code)

## 🏷️ 标签

`prompt-toolkit` `交互式` `终端应用` `REPL` `语法高亮` `自动补全`

---

**最后更新**: 2024-01-15  
**作者**: Python 技术文档工程师  
**版本**: 1.0