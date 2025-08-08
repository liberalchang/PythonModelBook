---
layout: doc
title: exec() - 代码执行函数
permalink: /docs/builtins/exec/
category: builtins
tags: [代码执行, 动态执行, 语句执行, 安全风险]
description: 执行字符串形式的Python代码
author: Python文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: 高级
---

# exec() - 代码执行函数

## 📝 概述

`exec()` 是Python中的内置函数，用于执行字符串形式的Python代码。与 `eval()` 不同，`exec()` 可以执行完整的Python语句，包括赋值、循环、函数定义、类定义等。这个函数提供了强大的动态代码执行能力，但同时也带来了严重的安全风险。

## ⚠️ 安全警告

**exec()函数存在极高的安全风险！**
- 永远不要对不可信的输入使用exec()
- 恶意代码可能完全控制系统
- 在生产环境中使用时必须进行严格的安全控制
- 考虑使用更安全的替代方案

## 🎯 学习目标

- 掌握exec()函数的基本用法和语法
- 理解exec()与eval()的区别
- 学会安全地使用exec()函数
- 了解exec()的应用场景和限制
- 掌握动态代码生成和执行技术

## 📋 前置知识

- Python基本语法
- 表达式和语句的区别
- 作用域和命名空间的概念
- 异常处理的基本知识
- 安全编程的基本概念
- 面向对象编程基础

## 🔍 详细内容

### 基本概念

`exec()` 函数接受一个字符串参数，将其作为Python代码进行执行。它可以执行任何有效的Python语句，包括：
- 赋值语句
- 控制流语句（if、for、while等）
- 函数定义
- 类定义
- 导入语句
- 其他复杂的Python代码

### 语法格式

```python
exec(object, globals=None, locals=None)
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| object | 字符串或代码对象 | 是 | 无 | 要执行的Python代码 |
| globals | 字典 | 否 | None | 全局命名空间 |
| locals | 字典 | 否 | None | 局部命名空间 |

### 返回值

- **类型**: None
- **说明**: exec()总是返回None，但执行的代码可能会修改命名空间

## 💡 代码示例

### 基本用法

```python
# 基本语句执行
print("基本语句执行:")

# 简单赋值
exec("x = 10")
print(f"x = {x}")  # 10

# 多行代码
code = """
y = 20
z = x + y
print(f'x + y = {z}')
"""
exec(code)

# 控制流语句
loop_code = """
for i in range(3):
    print(f'循环 {i}')
"""
print("\n控制流执行:")
exec(loop_code)

# 条件语句
condition_code = """
if x > 5:
    print('x 大于 5')
else:
    print('x 不大于 5')
"""
print("\n条件语句执行:")
exec(condition_code)

# 函数定义和调用
function_code = """
def greet(name):
    return f'Hello, {name}!'

message = greet('Python')
print(message)
"""
print("\n函数定义执行:")
exec(function_code)

# 类定义
class_code = """
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        return f'我是{self.name}，{self.age}岁'

person = Person('张三', 25)
print(person.introduce())
"""
print("\n类定义执行:")
exec(class_code)
```

### 使用自定义命名空间

```python
# 自定义命名空间示例
print("\n自定义命名空间示例:")

# 创建隔离的全局命名空间
custom_globals = {
    '__builtins__': {
        'print': print,
        'len': len,
        'range': range,
        'str': str,
        'int': int,
        'float': float
    },
    'math_pi': 3.14159,
    'math_e': 2.71828
}

# 创建局部命名空间
custom_locals = {}

# 在自定义命名空间中执行代码
code_with_namespace = """
# 定义一些变量
radius = 5
area = math_pi * radius ** 2

# 定义函数
def calculate_circle_area(r):
    return math_pi * r ** 2

def calculate_volume(r, h):
    base_area = calculate_circle_area(r)
    return base_area * h

# 计算结果
results = {
    'area': area,
    'volume': calculate_volume(3, 10)
}

print(f'圆面积: {area}')
print(f'圆柱体积: {results["volume"]}')
"""

print("在自定义命名空间中执行:")
exec(code_with_namespace, custom_globals, custom_locals)

# 查看执行后的局部变量
print(f"\n执行后的局部变量:")
for key, value in custom_locals.items():
    if not key.startswith('__'):
        print(f"  {key}: {value}")

# 尝试访问被限制的功能
print(f"\n安全性测试:")
try:
    restricted_code = """
import os
os.system('echo "这不应该执行"')
"""
    exec(restricted_code, custom_globals, {})
except Exception as e:
    print(f"访问受限功能失败（预期）: {e}")

# 动态变量访问
print(f"\n动态变量访问:")

# 从局部命名空间获取函数
if 'calculate_circle_area' in custom_locals:
    calc_func = custom_locals['calculate_circle_area']
    result = calc_func(7)
    print(f"动态调用函数结果: {result}")
```

### 动态代码生成

```python
# 动态代码生成示例
print("\n动态代码生成示例:")

# 代码生成器类
class CodeGenerator:
    """动态代码生成器"""
    
    def __init__(self):
        self.indent_level = 0
        self.code_lines = []
    
    def add_line(self, line):
        """添加代码行"""
        indent = '    ' * self.indent_level
        self.code_lines.append(indent + line)
    
    def indent(self):
        """增加缩进"""
        self.indent_level += 1
    
    def dedent(self):
        """减少缩进"""
        if self.indent_level > 0:
            self.indent_level -= 1
    
    def get_code(self):
        """获取生成的代码"""
        return '\n'.join(self.code_lines)
    
    def clear(self):
        """清空代码"""
        self.code_lines = []
        self.indent_level = 0

# 生成数学函数
def generate_math_function(func_name, operations):
    """生成数学函数"""
    generator = CodeGenerator()
    
    # 函数定义
    generator.add_line(f"def {func_name}(x):")
    generator.indent()
    
    # 添加操作
    for i, op in enumerate(operations):
        if i == 0:
            generator.add_line(f"result = x {op}")
        else:
            generator.add_line(f"result = result {op}")
    
    # 返回结果
    generator.add_line("return result")
    
    return generator.get_code()

# 生成并执行数学函数
math_operations = ['+ 10', '* 2', '- 5']
math_code = generate_math_function('custom_math', math_operations)

print("生成的数学函数代码:")
print(math_code)

print("\n执行生成的函数:")
exec(math_code)

# 测试生成的函数
test_values = [1, 5, 10, 15]
for val in test_values:
    result = custom_math(val)
    print(f"custom_math({val}) = {result}")

# 生成类定义
def generate_data_class(class_name, fields):
    """生成数据类"""
    generator = CodeGenerator()
    
    # 类定义
    generator.add_line(f"class {class_name}:")
    generator.indent()
    
    # __init__ 方法
    params = ', '.join(fields)
    generator.add_line(f"def __init__(self, {params}):")
    generator.indent()
    
    for field in fields:
        generator.add_line(f"self.{field} = {field}")
    
    generator.dedent()
    
    # __str__ 方法
    generator.add_line("def __str__(self):")
    generator.indent()
    
    field_strs = [f"'{field}: {{{field}}}'".replace('{field}', f'self.{field}') for field in fields]
    fields_format = ' + ", " + '.join(field_strs)
    generator.add_line(f"return f'{class_name}(' + {fields_format} + ')'")
    
    generator.dedent()
    
    # __repr__ 方法
    generator.add_line("def __repr__(self):")
    generator.indent()
    generator.add_line("return self.__str__()")
    
    return generator.get_code()

# 生成并执行数据类
data_fields = ['name', 'age', 'city']
data_class_code = generate_data_class('Person', data_fields)

print(f"\n生成的数据类代码:")
print(data_class_code)

print(f"\n执行生成的类:")
exec(data_class_code)

# 测试生成的类
person1 = Person('Alice', 30, 'Beijing')
person2 = Person('Bob', 25, 'Shanghai')

print(f"person1: {person1}")
print(f"person2: {person2}")
```

### 配置驱动的代码执行

```python
import json
from typing import Dict, Any, List

# 配置驱动的代码执行系统
class ConfigDrivenExecutor:
    """配置驱动的代码执行器"""
    
    def __init__(self):
        self.safe_builtins = {
            'print': print,
            'len': len,
            'range': range,
            'enumerate': enumerate,
            'zip': zip,
            'map': map,
            'filter': filter,
            'sum': sum,
            'max': max,
            'min': min,
            'abs': abs,
            'round': round,
            'int': int,
            'float': float,
            'str': str,
            'bool': bool,
            'list': list,
            'tuple': tuple,
            'dict': dict,
            'set': set
        }
        
        self.execution_context = {
            '__builtins__': self.safe_builtins,
            'data': {},
            'results': {},
            'config': {}
        }
    
    def load_config(self, config_data: Dict[str, Any]):
        """加载配置"""
        self.execution_context['config'] = config_data
    
    def set_data(self, data: Dict[str, Any]):
        """设置数据"""
        self.execution_context['data'] = data
    
    def execute_script(self, script: str) -> Dict[str, Any]:
        """执行脚本"""
        try:
            # 创建独立的局部命名空间
            local_context = {}
            
            # 执行脚本
            exec(script, self.execution_context, local_context)
            
            # 更新结果
            if 'results' in local_context:
                self.execution_context['results'].update(local_context['results'])
            
            return local_context
            
        except Exception as e:
            raise RuntimeError(f"脚本执行失败: {e}")
    
    def execute_config_scripts(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """执行配置中的脚本"""
        self.load_config(config)
        results = {}
        
        # 执行初始化脚本
        if 'init_script' in config:
            print("执行初始化脚本...")
            init_result = self.execute_script(config['init_script'])
            results['init'] = init_result
        
        # 执行数据处理脚本
        if 'data_scripts' in config:
            results['data_processing'] = []
            for i, script in enumerate(config['data_scripts']):
                print(f"执行数据处理脚本 {i+1}...")
                script_result = self.execute_script(script)
                results['data_processing'].append(script_result)
        
        # 执行清理脚本
        if 'cleanup_script' in config:
            print("执行清理脚本...")
            cleanup_result = self.execute_script(config['cleanup_script'])
            results['cleanup'] = cleanup_result
        
        return results

# 测试配置驱动执行
print("\n配置驱动执行示例:")

executor = ConfigDrivenExecutor()

# 设置测试数据
test_data = {
    'numbers': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    'names': ['Alice', 'Bob', 'Charlie', 'David'],
    'scores': [85, 92, 78, 96]
}

executor.set_data(test_data)

# 配置脚本
config = {
    'init_script': '''
# 初始化变量
total_count = 0
processed_items = []
statistics = {}

print("初始化完成")
''',
    
    'data_scripts': [
        '''
# 处理数字数据
numbers = data['numbers']
even_numbers = [n for n in numbers if n % 2 == 0]
odd_numbers = [n for n in numbers if n % 2 == 1]

statistics['even_count'] = len(even_numbers)
statistics['odd_count'] = len(odd_numbers)
statistics['total_sum'] = sum(numbers)
statistics['average'] = sum(numbers) / len(numbers)

print(f"处理了 {len(numbers)} 个数字")
print(f"偶数: {even_numbers}")
print(f"奇数: {odd_numbers}")
''',
        
        '''
# 处理名字和分数数据
names = data['names']
scores = data['scores']

# 创建学生记录
students = []
for name, score in zip(names, scores):
    grade = 'A' if score >= 90 else 'B' if score >= 80 else 'C'
    students.append({
        'name': name,
        'score': score,
        'grade': grade
    })

# 统计成绩
grade_counts = {'A': 0, 'B': 0, 'C': 0}
for student in students:
    grade_counts[student['grade']] += 1

statistics['students'] = students
statistics['grade_distribution'] = grade_counts
statistics['highest_score'] = max(scores)
statistics['lowest_score'] = min(scores)

print(f"处理了 {len(students)} 个学生记录")
for student in students:
    print(f"  {student['name']}: {student['score']} ({student['grade']})")
'''
    ],
    
    'cleanup_script': '''
# 生成最终报告
report = {
    'summary': {
        'total_numbers': len(data['numbers']),
        'total_students': len(data['names']),
        'processing_complete': True
    },
    'statistics': statistics
}

results['final_report'] = report

print("\n=== 最终报告 ===")
print(f"处理数字总数: {report['summary']['total_numbers']}")
print(f"学生总数: {report['summary']['total_students']}")
print(f"数字总和: {statistics['total_sum']}")
print(f"平均值: {statistics['average']:.2f}")
print(f"最高分: {statistics['highest_score']}")
print(f"最低分: {statistics['lowest_score']}")
print(f"成绩分布: {statistics['grade_distribution']}")
print("处理完成!")
'''
}

# 执行配置脚本
print("开始执行配置脚本:")
print("=" * 50)

try:
    execution_results = executor.execute_config_scripts(config)
    
    print("\n=== 执行结果 ===")
    if 'final_report' in executor.execution_context['results']:
        final_report = executor.execution_context['results']['final_report']
        print("最终报告已生成")
        print(f"统计信息: {len(final_report['statistics'])} 项")
    
except Exception as e:
    print(f"执行失败: {e}")
```

## 🚀 高级应用

### 插件系统

```python
import os
import importlib.util
from typing import Dict, Any, List, Callable
from abc import ABC, abstractmethod

# 插件系统实现
class Plugin(ABC):
    """插件基类"""
    
    @abstractmethod
    def get_name(self) -> str:
        """获取插件名称"""
        pass
    
    @abstractmethod
    def get_version(self) -> str:
        """获取插件版本"""
        pass
    
    @abstractmethod
    def execute(self, context: Dict[str, Any]) -> Any:
        """执行插件"""
        pass

class PluginManager:
    """插件管理器"""
    
    def __init__(self):
        self.plugins: Dict[str, Plugin] = {}
        self.plugin_code_cache: Dict[str, str] = {}
        
        # 安全的执行环境
        self.safe_globals = {
            '__builtins__': {
                'print': print,
                'len': len,
                'range': range,
                'enumerate': enumerate,
                'zip': zip,
                'sum': sum,
                'max': max,
                'min': min,
                'abs': abs,
                'round': round,
                'int': int,
                'float': float,
                'str': str,
                'bool': bool,
                'list': list,
                'tuple': tuple,
                'dict': dict,
                'set': set
            },
            'Plugin': Plugin
        }
    
    def load_plugin_from_code(self, plugin_name: str, plugin_code: str) -> bool:
        """从代码加载插件"""
        try:
            # 创建插件命名空间
            plugin_namespace = {}
            
            # 执行插件代码
            exec(plugin_code, self.safe_globals, plugin_namespace)
            
            # 查找插件类
            plugin_class = None
            for name, obj in plugin_namespace.items():
                if (isinstance(obj, type) and 
                    issubclass(obj, Plugin) and 
                    obj != Plugin):
                    plugin_class = obj
                    break
            
            if plugin_class is None:
                raise ValueError("未找到有效的插件类")
            
            # 创建插件实例
            plugin_instance = plugin_class()
            
            # 注册插件
            self.plugins[plugin_name] = plugin_instance
            self.plugin_code_cache[plugin_name] = plugin_code
            
            print(f"插件 '{plugin_name}' 加载成功")
            print(f"  名称: {plugin_instance.get_name()}")
            print(f"  版本: {plugin_instance.get_version()}")
            
            return True
            
        except Exception as e:
            print(f"加载插件 '{plugin_name}' 失败: {e}")
            return False
    
    def execute_plugin(self, plugin_name: str, context: Dict[str, Any] = None) -> Any:
        """执行插件"""
        if plugin_name not in self.plugins:
            raise ValueError(f"插件 '{plugin_name}' 未找到")
        
        plugin = self.plugins[plugin_name]
        context = context or {}
        
        try:
            return plugin.execute(context)
        except Exception as e:
            raise RuntimeError(f"执行插件 '{plugin_name}' 失败: {e}")
    
    def list_plugins(self) -> List[Dict[str, str]]:
        """列出所有插件"""
        plugin_list = []
        for name, plugin in self.plugins.items():
            plugin_list.append({
                'name': name,
                'plugin_name': plugin.get_name(),
                'version': plugin.get_version()
            })
        return plugin_list
    
    def unload_plugin(self, plugin_name: str) -> bool:
        """卸载插件"""
        if plugin_name in self.plugins:
            del self.plugins[plugin_name]
            if plugin_name in self.plugin_code_cache:
                del self.plugin_code_cache[plugin_name]
            print(f"插件 '{plugin_name}' 已卸载")
            return True
        return False

# 测试插件系统
print("\n插件系统示例:")

plugin_manager = PluginManager()

# 数学计算插件
math_plugin_code = '''
class MathPlugin(Plugin):
    """数学计算插件"""
    
    def get_name(self) -> str:
        return "数学计算器"
    
    def get_version(self) -> str:
        return "1.0.0"
    
    def execute(self, context: dict) -> dict:
        numbers = context.get('numbers', [])
        
        if not numbers:
            return {'error': '没有提供数字'}
        
        results = {
            'count': len(numbers),
            'sum': sum(numbers),
            'average': sum(numbers) / len(numbers),
            'min': min(numbers),
            'max': max(numbers),
            'even_count': len([n for n in numbers if n % 2 == 0]),
            'odd_count': len([n for n in numbers if n % 2 == 1])
        }
        
        return results
'''

# 文本处理插件
text_plugin_code = '''
class TextPlugin(Plugin):
    """文本处理插件"""
    
    def get_name(self) -> str:
        return "文本处理器"
    
    def get_version(self) -> str:
        return "1.1.0"
    
    def execute(self, context: dict) -> dict:
        text = context.get('text', '')
        
        if not text:
            return {'error': '没有提供文本'}
        
        words = text.split()
        
        results = {
            'original_text': text,
            'character_count': len(text),
            'word_count': len(words),
            'line_count': text.count('\\n') + 1,
            'uppercase': text.upper(),
            'lowercase': text.lower(),
            'title_case': text.title(),
            'word_frequency': {}
        }
        
        # 计算词频
        for word in words:
            clean_word = word.lower().strip('.,!?;:')
            if clean_word:
                results['word_frequency'][clean_word] = results['word_frequency'].get(clean_word, 0) + 1
        
        return results
'''

# 数据分析插件
data_plugin_code = '''
class DataAnalysisPlugin(Plugin):
    """数据分析插件"""
    
    def get_name(self) -> str:
        return "数据分析器"
    
    def get_version(self) -> str:
        return "2.0.0"
    
    def execute(self, context: dict) -> dict:
        data = context.get('data', [])
        
        if not data:
            return {'error': '没有提供数据'}
        
        # 分析不同类型的数据
        analysis = {
            'total_items': len(data),
            'data_types': {},
            'numeric_analysis': {},
            'string_analysis': {},
            'list_analysis': {}
        }
        
        # 统计数据类型
        for item in data:
            item_type = type(item).__name__
            analysis['data_types'][item_type] = analysis['data_types'].get(item_type, 0) + 1
        
        # 数值分析
        numeric_data = [item for item in data if isinstance(item, (int, float))]
        if numeric_data:
            analysis['numeric_analysis'] = {
                'count': len(numeric_data),
                'sum': sum(numeric_data),
                'average': sum(numeric_data) / len(numeric_data),
                'min': min(numeric_data),
                'max': max(numeric_data)
            }
        
        # 字符串分析
        string_data = [item for item in data if isinstance(item, str)]
        if string_data:
            analysis['string_analysis'] = {
                'count': len(string_data),
                'total_length': sum(len(s) for s in string_data),
                'average_length': sum(len(s) for s in string_data) / len(string_data),
                'longest': max(string_data, key=len),
                'shortest': min(string_data, key=len)
            }
        
        # 列表分析
        list_data = [item for item in data if isinstance(item, list)]
        if list_data:
            analysis['list_analysis'] = {
                'count': len(list_data),
                'total_elements': sum(len(lst) for lst in list_data),
                'average_length': sum(len(lst) for lst in list_data) / len(list_data)
            }
        
        return analysis
'''

# 加载插件
print("加载插件:")
plugin_manager.load_plugin_from_code('math', math_plugin_code)
plugin_manager.load_plugin_from_code('text', text_plugin_code)
plugin_manager.load_plugin_from_code('data', data_plugin_code)

# 列出插件
print(f"\n已加载的插件:")
for plugin_info in plugin_manager.list_plugins():
    print(f"  {plugin_info['name']}: {plugin_info['plugin_name']} v{plugin_info['version']}")

# 测试数学插件
print(f"\n测试数学插件:")
math_context = {'numbers': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
math_result = plugin_manager.execute_plugin('math', math_context)
print(f"数学计算结果: {math_result}")

# 测试文本插件
print(f"\n测试文本插件:")
text_context = {'text': 'Hello World! This is a test text. Hello again!'}
text_result = plugin_manager.execute_plugin('text', text_context)
print(f"文本处理结果:")
for key, value in text_result.items():
    if key != 'word_frequency':
        print(f"  {key}: {value}")
print(f"  词频统计: {text_result['word_frequency']}")

# 测试数据分析插件
print(f"\n测试数据分析插件:")
data_context = {
    'data': [1, 2, 3, 'hello', 'world', [1, 2, 3], [4, 5], 4.5, 'test', [6, 7, 8, 9]]
}
data_result = plugin_manager.execute_plugin('data', data_context)
print(f"数据分析结果:")
for key, value in data_result.items():
    print(f"  {key}: {value}")
```

### 模板引擎

```python
import re
from typing import Dict, Any, List, Optional

# 简单的模板引擎
class TemplateEngine:
    """简单的模板引擎"""
    
    def __init__(self):
        # 模板语法模式
        {% raw %}
        self.variable_pattern = re.compile(r'\{\{\s*([^}]+)\s*\}\}')
        self.code_block_pattern = re.compile(r'\{%\s*([^%]+)\s*%\}', re.DOTALL)
        self.comment_pattern = re.compile(r'\{#\s*([^#]*)\s*#\}')
        {% endraw %}
        
        # 安全的执行环境
        self.safe_builtins = {
            'len': len,
            'range': range,
            'enumerate': enumerate,
            'zip': zip,
            'sum': sum,
            'max': max,
            'min': min,
            'abs': abs,
            'round': round,
            'int': int,
            'float': float,
            'str': str,
            'bool': bool,
            'list': list,
            'tuple': tuple,
            'dict': dict,
            'set': set,
            'sorted': sorted,
            'reversed': reversed
        }
    
    def render_template(self, template: str, context: Dict[str, Any]) -> str:
        """渲染模板"""
        # 移除注释
        template = self.comment_pattern.sub('', template)
        
        # 处理代码块
        template = self._process_code_blocks(template, context)
        
        # 处理变量
        template = self._process_variables(template, context)
        
        return template
    
    def _process_variables(self, template: str, context: Dict[str, Any]) -> str:
        """处理变量替换"""
        def replace_variable(match):
            var_expr = match.group(1).strip()
            try:
                # 创建安全的执行环境
                safe_context = {
                    '__builtins__': self.safe_builtins,
                    **context
                }
                
                # 求值变量表达式
                result = eval(var_expr, safe_context, {})
                return str(result)
            except Exception as e:
                {% raw %}return f"{{{{ ERROR: {e} }}}}"{% endraw %}
        
        return self.variable_pattern.sub(replace_variable, template)
    
    def _process_code_blocks(self, template: str, context: Dict[str, Any]) -> str:
        """处理代码块"""
        def replace_code_block(match):
            code = match.group(1).strip()
            try:
                # 创建输出缓冲区
                output_buffer = []
                
                # 创建安全的执行环境
                safe_context = {
                    '__builtins__': self.safe_builtins,
                    'output': output_buffer,
                    'print_to_template': lambda *args: output_buffer.append(' '.join(str(arg) for arg in args)),
                    **context
                }
                
                # 执行代码块
                exec(code, safe_context, {})
                
                # 返回输出
                return '\n'.join(output_buffer)
            except Exception as e:
                return f"{% raw %}{% ERROR: {e} %}{% endraw %}"
        
        return self.code_block_pattern.sub(replace_code_block, template)
    
    def render_file_template(self, template_path: str, context: Dict[str, Any]) -> str:
        """渲染文件模板"""
        try:
            with open(template_path, 'r', encoding='utf-8') as f:
                template = f.read()
            return self.render_template(template, context)
        except Exception as e:
            raise RuntimeError(f"渲染模板文件失败: {e}")

# 测试模板引擎
print("\n模板引擎示例:")

template_engine = TemplateEngine()

# 简单变量模板
simple_template = """
欢迎 {{ name }}!
您的年龄是 {{ age }} 岁。
您的分数是 {{ score }}，等级是 {{ 'A' if score >= 90 else 'B' if score >= 80 else 'C' }}。
"""

simple_context = {
    'name': '张三',
    'age': 25,
    'score': 95
}

print("简单变量模板:")
print(template_engine.render_template(simple_template, simple_context))

# 循环模板
{% raw %}
loop_template = """
学生列表:
{% 
for i, student in enumerate(students):
    grade = 'A' if student['score'] >= 90 else 'B' if student['score'] >= 80 else 'C'
    print_to_template(f"{i+1}. {student['name']}: {student['score']} ({grade})")
%}

统计信息:
- 总人数: {{ len(students) }}
- 平均分: {{ sum(s['score'] for s in students) / len(students) }}
- 最高分: {{ max(s['score'] for s in students) }}
- 最低分: {{ min(s['score'] for s in students) }}
"""

loop_context = {
    'students': [
        {'name': 'Alice', 'score': 95},
        {'name': 'Bob', 'score': 87},
        {'name': 'Charlie', 'score': 92},
        {'name': 'David', 'score': 78}
    ]
}

print(f"\n循环模板:")
print(template_engine.render_template(loop_template, loop_context))

# 条件模板
conditional_template = """
{# 这是注释，不会显示 #}
系统状态报告
==================

{% 
if system_status == 'healthy':
    print_to_template("✅ 系统运行正常")
    print_to_template(f"CPU使用率: {cpu_usage}%")
    print_to_template(f"内存使用率: {memory_usage}%")
else:
    print_to_template("❌ 系统异常")
    print_to_template(f"错误信息: {error_message}")
%}

服务状态:
{% 
for service, status in services.items():
    icon = '🟢' if status == 'running' else '🔴'
    print_to_template(f"{icon} {service}: {status}")
%}

{% 
if alerts:
    print_to_template("\n⚠️ 警告信息:")
    for alert in alerts:
        print_to_template(f"- {alert}")
else:
    print_to_template("\n✅ 无警告信息")
%}
"""

conditional_context = {
    'system_status': 'healthy',
    'cpu_usage': 45,
    'memory_usage': 67,
    'services': {
        'web_server': 'running',
        'database': 'running',
        'cache': 'stopped',
        'queue': 'running'
    },
    'alerts': [
        '缓存服务已停止',
        '磁盘空间不足 (85% 已使用)'
    ]
}

print(f"\n条件模板:")
print(template_engine.render_template(conditional_template, conditional_context))

# 复杂数据处理模板
complex_template = """
HTML报告生成
=============

{% 
# 数据预处理
total_sales = sum(item['amount'] for item in sales_data)
average_sale = total_sales / len(sales_data) if sales_data else 0
top_products = sorted(sales_data, key=lambda x: x['amount'], reverse=True)[:3]

# 按类别分组
category_sales = {}
for item in sales_data:
    category = item['category']
    if category not in category_sales:
        category_sales[category] = []
    category_sales[category].append(item)

# 生成报告
print_to_template(f"销售总额: ${total_sales:,.2f}")
print_to_template(f"平均销售额: ${average_sale:,.2f}")
print_to_template(f"交易数量: {len(sales_data)}")
print_to_template("")
print_to_template("前三名产品:")
for i, product in enumerate(top_products, 1):
    print_to_template(f"{i}. {product['name']}: ${product['amount']:,.2f}")

print_to_template("")
print_to_template("按类别统计:")
for category, items in category_sales.items():
    category_total = sum(item['amount'] for item in items)
    print_to_template(f"{category}: ${category_total:,.2f} ({len(items)} 项)")
%}
"""

complex_context = {
    'sales_data': [
        {'name': '笔记本电脑', 'category': '电子产品', 'amount': 1299.99},
        {'name': '手机', 'category': '电子产品', 'amount': 899.99},
        {'name': '办公椅', 'category': '家具', 'amount': 299.99},
        {'name': '键盘', 'category': '电子产品', 'amount': 79.99},
        {'name': '书桌', 'category': '家具', 'amount': 399.99},
        {'name': '显示器', 'category': '电子产品', 'amount': 249.99},
        {'name': '台灯', 'category': '家具', 'amount': 49.99}
    ]
}

print(f"\n复杂数据处理模板:")
print(template_engine.render_template(complex_template, complex_context))
{% endraw %}
```

## ⚠️ 常见陷阱与最佳实践

### 安全风险防护

```python
# 安全风险防护示例
print("\n安全风险防护示例:")

# 安全的exec包装器
class SecureExecutor:
    """安全的代码执行器"""
    
    def __init__(self):
        # 危险关键词
        self.dangerous_keywords = {
            'import', 'exec', 'eval', 'compile', 'open', 'file',
            '__import__', '__builtins__', '__globals__', '__locals__',
            'globals', 'locals', 'vars', 'dir', 'hasattr', 'getattr',
            'setattr', 'delattr', 'input', 'raw_input', 'reload'
        }
        
        # 危险模块
        self.dangerous_modules = {
            'os', 'sys', 'subprocess', 'shutil', 'tempfile',
            'pickle', 'marshal', 'shelve', 'dbm', 'sqlite3',
            'socket', 'urllib', 'http', 'ftplib', 'smtplib'
        }
        
        # 安全的内置函数
        self.safe_builtins = {
            'abs', 'all', 'any', 'bin', 'bool', 'chr', 'dict',
            'enumerate', 'filter', 'float', 'hex', 'int', 'len',
            'list', 'map', 'max', 'min', 'oct', 'ord', 'range',
            'reversed', 'round', 'set', 'sorted', 'str', 'sum',
            'tuple', 'zip'
        }
    
    def is_safe_code(self, code: str) -> tuple[bool, str]:
        """检查代码是否安全"""
        # 检查危险关键词
        for keyword in self.dangerous_keywords:
            if keyword in code:
                return False, f"包含危险关键词: {keyword}"
        
        # 检查危险模块
        for module in self.dangerous_modules:
            if module in code:
                return False, f"尝试访问危险模块: {module}"
        
        # 检查双下划线属性
        if '__' in code:
            return False, "包含双下划线属性访问"
        
        # 检查点号访问（可能的属性访问）
        if '.' in code and any(dangerous in code for dangerous in ['class', 'base', 'subclass']):
            return False, "可能的危险属性访问"
        
        return True, "代码安全"
    
    def create_safe_environment(self, allowed_vars: Dict[str, Any] = None) -> Dict[str, Any]:
        """创建安全的执行环境"""
        # 创建受限的内置函数字典
        restricted_builtins = {}
        for name in self.safe_builtins:
            if hasattr(__builtins__, name):
                restricted_builtins[name] = getattr(__builtins__, name)
        
        # 基础环境
        safe_env = {
            '__builtins__': restricted_builtins,
            '__name__': '__restricted__',
            '__doc__': None
        }
        
        # 添加允许的变量
        if allowed_vars:
            safe_env.update(allowed_vars)
        
        return safe_env
    
    def safe_exec(self, code: str, allowed_vars: Dict[str, Any] = None) -> Dict[str, Any]:
        """安全地执行代码"""
        # 检查代码安全性
        is_safe, message = self.is_safe_code(code)
        if not is_safe:
            raise SecurityError(f"不安全的代码: {message}")
        
        # 创建安全环境
        safe_globals = self.create_safe_environment(allowed_vars)
        safe_locals = {}
        
        try:
            # 执行代码
            exec(code, safe_globals, safe_locals)
            return safe_locals
        except Exception as e:
            raise RuntimeError(f"代码执行失败: {e}")

# 自定义安全异常
class SecurityError(Exception):
    """安全异常"""
    pass

# 测试安全执行器
print("安全执行器测试:")

secure_executor = SecureExecutor()

# 安全代码测试
safe_codes = [
    "x = 10\ny = 20\nresult = x + y",
    "numbers = [1, 2, 3, 4, 5]\ntotal = sum(numbers)",
    "text = 'Hello World'\nlength = len(text)",
    "data = [1, 2, 3]\nfiltered = list(filter(lambda x: x > 1, data))"
]

print("\n安全代码测试:")
for i, code in enumerate(safe_codes, 1):
    try:
        result = secure_executor.safe_exec(code)
        print(f"  测试 {i}: 成功")
        print(f"    变量: {list(result.keys())}")
    except Exception as e:
        print(f"  测试 {i}: 失败 - {e}")

# 危险代码测试
dangerous_codes = [
    "import os\nos.system('ls')",
    "exec('print(\"hello\")')",
    "open('/etc/passwd').read()",
    "__import__('subprocess').call(['ls'])",
    "[].append.__globals__['__builtins__']['eval']('1+1')",
    "().__class__.__bases__[0].__subclasses__()"
]

print(f"\n危险代码测试:")
for i, code in enumerate(dangerous_codes, 1):
    try:
        result = secure_executor.safe_exec(code)
        print(f"  测试 {i}: 成功（不应该成功!）")
    except SecurityError as e:
        print(f"  测试 {i}: 被安全机制阻止 - {e}")
    except Exception as e:
        print(f"  测试 {i}: 其他错误 - {e}")

# 资源限制
print(f"\n资源限制示例:")

import signal
import time

class ResourceLimitedExecutor(SecureExecutor):
    """资源受限的执行器"""
    
    def __init__(self, timeout: int = 5, max_memory: int = 100*1024*1024):  # 100MB
        super().__init__()
        self.timeout = timeout
        self.max_memory = max_memory
    
    def timeout_handler(self, signum, frame):
        """超时处理器"""
        raise TimeoutError(f"代码执行超时 ({self.timeout}秒)")
    
    def safe_exec_with_limits(self, code: str, allowed_vars: Dict[str, Any] = None) -> Dict[str, Any]:
        """带资源限制的安全执行"""
        # 设置超时
        old_handler = signal.signal(signal.SIGALRM, self.timeout_handler)
        signal.alarm(self.timeout)
        
        try:
            # 记录开始时间
            start_time = time.time()
            
            # 执行代码
            result = self.safe_exec(code, allowed_vars)
            
            # 记录执行时间
            execution_time = time.time() - start_time
            result['__execution_time__'] = execution_time
            
            return result
            
        finally:
            # 恢复信号处理器
            signal.alarm(0)
            signal.signal(signal.SIGALRM, old_handler)

# 测试资源限制（在支持信号的系统上）
try:
    limited_executor = ResourceLimitedExecutor(timeout=2)
    
    # 正常代码
    normal_code = """
result = 0
for i in range(1000):
    result += i
"""
    
    print("正常代码执行:")
    result = limited_executor.safe_exec_with_limits(normal_code)
    print(f"  执行时间: {result.get('__execution_time__', 0):.4f}秒")
    print(f"  结果: {result.get('result', 'N/A')}")
    
    # 可能超时的代码（注释掉以避免实际超时）
    # timeout_code = """
    # import time
    # time.sleep(10)  # 这会超时
    # """
    # 
    # print("\n超时代码测试:")
    # try:
    #     result = limited_executor.safe_exec_with_limits(timeout_code)
    # except TimeoutError as e:
    #     print(f"  超时被捕获: {e}")
    
except Exception as e:
    print(f"资源限制测试跳过（可能不支持信号）: {e}")
```

## 📚 相关函数和模块

### 内置函数
- `eval()` - 执行Python表达式
- `compile()` - 编译Python代码
- `globals()` - 获取全局命名空间
- `locals()` - 获取局部命名空间
- `vars()` - 获取对象的属性字典
- `dir()` - 列出对象的属性
- `hasattr()` - 检查属性是否存在
- `getattr()` - 获取属性值
- `setattr()` - 设置属性值
- `delattr()` - 删除属性

### 标准库模块
- `ast` - 抽象语法树
- `code` - 交互式解释器
- `codeop` - 编译Python代码
- `dis` - 字节码反汇编
- `inspect` - 对象检查
- `types` - 动态类型创建
- `importlib` - 导入机制
- `runpy` - 运行Python模块
- `traceback` - 异常跟踪

### 第三方库
- `RestrictedPython` - 受限的Python执行
- `asteval` - 安全的表达式求值
- `PyPy` - Python解释器
- `Jinja2` - 模板引擎
- `Mako` - 模板引擎

## 📖 扩展阅读

1. **Python官方文档**
   - [Built-in Functions - exec()](https://docs.python.org/3/library/functions.html#exec)
   - [Code Objects](https://docs.python.org/3/reference/datamodel.html#code-objects)

2. **安全相关**
   - Python代码注入攻击防护
   - 沙箱执行环境设计
   - 安全编程最佳实践

3. **高级应用**
   - 动态代码生成技术
   - 插件系统设计
   - 模板引擎实现

## 🏷️ 标签

`代码执行` `动态执行` `语句执行` `安全风险` `插件系统` `模板引擎` `代码生成` `沙箱执行` `资源限制` `安全编程`