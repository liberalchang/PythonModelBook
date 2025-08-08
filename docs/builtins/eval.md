---
layout: doc
title: eval() - 表达式求值函数
permalink: /docs/builtins/eval/
category: builtins
tags: [表达式求值, 动态执行, 代码执行, 安全风险]
description: 执行字符串形式的 Python 表达式并返回结果
author: Python 文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# eval() - 表达式求值函数

## 📝 概述

`eval()` 是 Python 中的内置函数，用于执行字符串形式的 Python 表达式并返回结果。这个函数可以动态地执行 Python 代码，但同时也带来了安全风险。它主要用于计算数学表达式、动态配置、简单的代码生成等场景。使用时需要特别注意安全性和性能问题。

## ⚠️ 安全警告

**eval()函数存在严重的安全风险！**
- 永远不要对不可信的输入使用 eval()
- 恶意代码可能导致系统被攻击
- 在生产环境中使用时必须进行严格的输入验证
- 考虑使用更安全的替代方案

## 🎯 学习目标

- 掌握 eval()函数的基本用法和语法
- 理解 eval()的工作机制和限制
- 学会安全地使用 eval()函数
- 了解 eval()的安全风险和防护措施
- 掌握 eval()的替代方案和最佳实践

## 📋 前置知识

- Python 基本语法
- 表达式和语句的区别
- 作用域和命名空间的概念
- 异常处理的基本知识
- 安全编程的基本概念

## 🔍 详细内容

### 基本概念

`eval()` 函数接受一个字符串参数，将其作为 Python 表达式进行求值，并返回表达式的结果。它只能执行表达式，不能执行语句（如赋值、循环等）。如果需要执行语句，应该使用 `exec()` 函数。

### 语法格式

```python
eval(expression, globals=None, locals=None)
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| expression | 字符串或代码对象 | 是 | 无 | 要执行的 Python 表达式 |
| globals | 字典 | 否 | None | 全局命名空间 |
| locals | 字典 | 否 | None | 局部命名空间 |

### 返回值

- **类型**: 任意类型
- **内容**: 表达式的计算结果

## 💡 代码示例

### 基本用法

```python
## 基本数学表达式
print("基本数学表达式:")
result1 = eval("2 + 3 * 4")
print(f"2 + 3 * 4 = {result1}")  # 14

result2 = eval("(10 + 5) / 3")
print(f"(10 + 5) / 3 = {result2}")  # 5.0

result3 = eval("2 ** 10")
print(f"2 ** 10 = {result3}")  # 1024

## 字符串表达式
print(f"\n 字符串表达式:")
result4 = eval("'Hello' + ' ' + 'World'")
print(f"字符串连接: {result4}")  # Hello World

result5 = eval("'Python' * 3")
print(f"字符串重复: {result5}")  # PythonPythonPython

## 列表和元组表达式
print(f"\n 列表和元组表达式:")
result6 = eval("[1, 2, 3] + [4, 5, 6]")
print(f"列表连接: {result6}")  # [1, 2, 3, 4, 5, 6]

result7 = eval("(1, 2) + (3, 4)")
print(f"元组连接: {result7}")  # (1, 2, 3, 4)

## 字典表达式
result8 = eval("{'a': 1, 'b': 2}")
print(f"字典创建: {result8}")  # {'a': 1, 'b': 2}

## 布尔表达式
print(f"\n 布尔表达式:")
result9 = eval("True and False")
print(f"True and False = {result9}")  # False

result10 = eval("5 > 3 and 2 < 4")
print(f"5 > 3 and 2 < 4 = {result10}")  # True

## 函数调用
print(f"\n 函数调用:")
result11 = eval("len('Hello World')")
print(f"字符串长度: {result11}")  # 11

result12 = eval("max([1, 5, 3, 9, 2])")
print(f"最大值: {result12}")  # 9

result13 = eval("abs(-42)")
print(f"绝对值: {result13}")  # 42
```

### 使用自定义命名空间

```python
## 自定义全局和局部命名空间
print("\n 自定义命名空间示例:")

## 定义自定义的全局命名空间
custom_globals = {
    '__builtins__': {},  # 限制内置函数访问
    'pi': 3.14159,
    'e': 2.71828,
    'sqrt': lambda x: x ** 0.5,
    'square': lambda x: x * x
}

## 定义自定义的局部命名空间
custom_locals = {
    'x': 10,
    'y': 20,
    'name': 'Python'
}

## 使用自定义命名空间
try:
    result1 = eval("pi * square(x)", custom_globals, custom_locals)
    print(f"π * x² = {result1}")  # 314.159
    
    result2 = eval("sqrt(x * y)", custom_globals, custom_locals)
    print(f"√(x * y) = {result2}")  # 14.142135623730951
    
    result3 = eval("name + ' is great!'", custom_globals, custom_locals)
    print(f"字符串操作: {result3}")  # Python is great!
    
except Exception as e:
    print(f"执行出错: {e}")

## 尝试访问被限制的内置函数
print(f"\n 安全性测试:")
try:
#    # 这会失败,因为我们限制了__builtins__
    result = eval("len('test')", custom_globals, custom_locals)
except Exception as e:
    print(f"访问内置函数失败(预期): {e}")

## 动态变量访问
print(f"\n 动态变量访问:")
variables = {
    'a': 100,
    'b': 200,
    'operation': '+'
}

## 根据变量动态构建表达式
expression = f"a {variables['operation']} b"
result = eval(expression, {}, variables)
print(f"动态表达式 '{expression}' = {result}")  # 300

## 更复杂的动态表达式
math_operations = {
    'add': lambda x, y: x + y,
    'multiply': lambda x, y: x * y,
    'power': lambda x, y: x ** y
}

variables.update(math_operations)

complex_expr = "power(add(a, b), 2) - multiply(a, b)"
result = eval(complex_expr, {}, variables)
print(f"复杂表达式 '{complex_expr}' = {result}")  # 70000
```

### 安全的 eval 使用

```python
import re
import ast
from typing import Any, Dict, List, Union

## 安全的 eval 包装器
class SafeEval:
    """安全的表达式求值器"""
    
    def __init__(self):
#        # 允许的操作符
        self.allowed_operators = {
            ast.Add, ast.Sub, ast.Mult, ast.Div, ast.Mod, ast.Pow,
            ast.LShift, ast.RShift, ast.BitOr, ast.BitXor, ast.BitAnd,
            ast.FloorDiv, ast.And, ast.Or, ast.Eq, ast.NotEq,
            ast.Lt, ast.LtE, ast.Gt, ast.GtE, ast.Is, ast.IsNot,
            ast.In, ast.NotIn, ast.Not, ast.Invert, ast.UAdd, ast.USub
        }
        
#        # 允许的节点类型
        self.allowed_nodes = {
            ast.Expression, ast.BinOp, ast.UnaryOp, ast.Compare,
            ast.BoolOp, ast.Num, ast.Str, ast.List, ast.Tuple,
            ast.Dict, ast.Set, ast.Name, ast.Load, ast.Constant
        }
        
#        # 允许的内置函数
        self.allowed_builtins = {
            'abs', 'max', 'min', 'len', 'sum', 'round',
            'int', 'float', 'str', 'bool', 'list', 'tuple',
            'dict', 'set', 'sorted', 'reversed'
        }
        
#        # 安全的全局命名空间
        self.safe_globals = {
            '__builtins__': {name: __builtins__[name] 
                           for name in self.allowed_builtins 
                           if name in __builtins__}
        }
    
    def is_safe_expression(self, expression: str) -> tuple[bool, str]:
        """检查表达式是否安全"""
        try:
#            # 解析表达式
            tree = ast.parse(expression, mode='eval')
            
#            # 检查所有节点
            for node in ast.walk(tree):
                node_type = type(node)
                
#                # 检查节点类型
                if node_type not in self.allowed_nodes:
                    return False, f"不允许的节点类型: {node_type.__name__}"
                
#                # 检查操作符
                if isinstance(node, (ast.BinOp, ast.UnaryOp, ast.Compare, ast.BoolOp)):
                    if hasattr(node, 'op') and type(node.op) not in self.allowed_operators:
                        return False, f"不允许的操作符: {type(node.op).__name__}"
                    if hasattr(node, 'ops'):
                        for op in node.ops:
                            if type(op) not in self.allowed_operators:
                                return False, f"不允许的比较操作符: {type(op).__name__}"
                
#                # 检查函数调用
                if isinstance(node, ast.Call):
                    if isinstance(node.func, ast.Name):
                        func_name = node.func.id
                        if func_name not in self.allowed_builtins:
                            return False, f"不允许的函数调用: {func_name}"
                    else:
                        return False, "不允许的复杂函数调用"
                
#                # 检查属性访问
                if isinstance(node, ast.Attribute):
                    return False, "不允许属性访问"
                
#                # 检查导入
                if isinstance(node, (ast.Import, ast.ImportFrom)):
                    return False, "不允许导入语句"
            
            return True, "表达式安全"
            
        except SyntaxError as e:
            return False, f"语法错误: {e}"
        except Exception as e:
            return False, f"解析错误: {e}"
    
    def safe_eval(self, expression: str, variables: Dict[str, Any] = None) -> Any:
        """安全地执行表达式"""
#        # 检查表达式安全性
        is_safe, message = self.is_safe_expression(expression)
        if not is_safe:
            raise ValueError(f"不安全的表达式: {message}")
        
#        # 准备命名空间
        safe_locals = variables.copy() if variables else {}
        
#        # 执行表达式
        try:
            return eval(expression, self.safe_globals, safe_locals)
        except Exception as e:
            raise RuntimeError(f"表达式执行失败: {e}")

## 测试安全的 eval
print("\n 安全 eval 测试:")

safe_evaluator = SafeEval()

## 安全的表达式
safe_expressions = [
    "2 + 3 * 4",
    "max([1, 5, 3, 9, 2])",
    "len('Hello World')",
    "abs(-42)",
    "[1, 2, 3] + [4, 5, 6]",
    "{'a': 1, 'b': 2}",
    "x * 2 + y"
]

variables = {'x': 10, 'y': 5}

print("安全表达式测试:")
for expr in safe_expressions:
    try:
        result = safe_evaluator.safe_eval(expr, variables)
        print(f"  {expr} = {result}")
    except Exception as e:
        print(f"  {expr} 失败: {e}")

## 不安全的表达式
unsafe_expressions = [
    "__import__('os').system('ls')",  # 导入和系统调用
    "open('/etc/passwd').read()",      # 文件操作
    "exec('print(\"hello\")')",        # 执行代码
    "[].append.__globals__",           # 属性访问
    "eval('2+2')",                     # 嵌套 eval
]

print(f"\n 不安全表达式测试:")
for expr in unsafe_expressions:
    try:
        result = safe_evaluator.safe_eval(expr)
        print(f"  {expr} = {result} (不应该成功!)")
    except Exception as e:
        print(f"  {expr} 被阻止: {e}")
```

### 计算器应用示例

```python
import re
from typing import Optional

## 简单的计算器类
class SimpleCalculator:
    """简单的表达式计算器"""
    
    def __init__(self):
#        # 允许的字符模式
        self.allowed_pattern = re.compile(r'^[0-9+\-*/().\s]+$')
        
#        # 数学常量和函数
        self.math_context = {
            '__builtins__': {},
            'pi': 3.14159265359,
            'e': 2.71828182846,
            'sqrt': lambda x: x ** 0.5,
            'sin': lambda x: __import__('math').sin(x),
            'cos': lambda x: __import__('math').cos(x),
            'tan': lambda x: __import__('math').tan(x),
            'log': lambda x: __import__('math').log(x),
            'log10': lambda x: __import__('math').log10(x),
            'abs': abs,
            'max': max,
            'min': min,
            'round': round
        }
    
    def validate_expression(self, expression: str) -> tuple[bool, str]:
        """验证表达式"""
#        # 检查字符
        if not self.allowed_pattern.match(expression):
            return False, "表达式包含不允许的字符"
        
#        # 检查括号匹配
        if expression.count('(') != expression.count(')'):
            return False, "括号不匹配"
        
#        # 检查空表达式
        if not expression.strip():
            return False, "表达式为空"
        
        return True, "表达式有效"
    
    def calculate(self, expression: str) -> Optional[float]:
        """计算表达式"""
        try:
#            # 验证表达式
            is_valid, message = self.validate_expression(expression)
            if not is_valid:
                print(f"验证失败: {message}")
                return None
            
#            # 计算结果
            result = eval(expression, self.math_context, {})
            
#            # 检查结果类型
            if isinstance(result, (int, float)):
                return float(result)
            else:
                print(f"结果类型错误: {type(result)}")
                return None
                
        except ZeroDivisionError:
            print("错误: 除零")
            return None
        except OverflowError:
            print("错误: 数值溢出")
            return None
        except ValueError as e:
            print(f"数值错误: {e}")
            return None
        except SyntaxError as e:
            print(f"语法错误: {e}")
            return None
        except Exception as e:
            print(f"计算错误: {e}")
            return None
    
    def interactive_mode(self):
        """交互模式"""
        print("简单计算器 - 输入'quit'退出")
        print("支持的操作: +, -, *, /, (), 数字")
        print("支持的函数: sqrt, sin, cos, tan, log, log10, abs, max, min, round")
        print("支持的常量: pi, e")
        print("-" * 50)
        
        while True:
            try:
                expression = input(">>> ").strip()
                
                if expression.lower() in ['quit', 'exit', 'q']:
                    print("再见!")
                    break
                
                if not expression:
                    continue
                
                result = self.calculate(expression)
                if result is not None:
                    print(f"结果: {result}")
                
            except KeyboardInterrupt:
                print("\n 再见!")
                break
            except EOFError:
                print("\n 再见!")
                break

## 测试计算器
print("\n 计算器测试:")

calculator = SimpleCalculator()

## 测试表达式
test_expressions = [
    "2 + 3 * 4",
    "(10 + 5) / 3",
    "2 ** 10",
    "sqrt(16)",
    "pi * 2",
    "sin(pi / 2)",
    "log(e)",
    "max(1, 5, 3, 9, 2)",
    "round(3.14159, 2)",
    "1 / 0",  # 除零错误
    "2 +",    # 语法错误
    "sqrt(-1)" # 数学错误
]

for expr in test_expressions:
    print(f"\n 计算: {expr}")
    result = calculator.calculate(expr)
    if result is not None:
        print(f"结果: {result}")

## 如果需要交互模式,取消下面的注释
## calculator.interactive_mode()
```

## 🚀 高级应用

### 配置文件解析

```python
import json
from typing import Any, Dict, List

## 动态配置解析器
class DynamicConfigParser:
    """动态配置解析器"""
    
    def __init__(self):
#        # 配置上下文
        self.config_context = {
            '__builtins__': {},
#            # 环境变量
            'env': self._get_env_vars(),
#            # 系统信息
            'system': self._get_system_info(),
#            # 数学函数
            'math': {
                'max': max,
                'min': min,
                'abs': abs,
                'round': round
            }
        }
    
    def _get_env_vars(self) -> Dict[str, str]:
        """获取环境变量(模拟)"""
        return {
            'HOME': '/home/user',
            'PATH': '/usr/bin:/bin',
            'DEBUG': 'true',
            'PORT': '8080'
        }
    
    def _get_system_info(self) -> Dict[str, Any]:
        """获取系统信息(模拟)"""
        return {
            'cpu_count': 4,
            'memory_gb': 8,
            'platform': 'linux'
        }
    
    def parse_config_value(self, value: str) -> Any:
        """解析配置值"""
#        # 如果不是字符串,直接返回
        if not isinstance(value, str):
            return value
        
#        # 如果不包含表达式标记,直接返回
        if not (value.startswith('${') and value.endswith('}')):
            return value
        
#        # 提取表达式
        expression = value[2:-1].strip()
        
        try:
#            # 安全检查
            if any(dangerous in expression for dangerous in 
                   ['import', 'exec', 'eval', 'open', '__']):
                raise ValueError(f"不安全的表达式: {expression}")
            
#            # 执行表达式
            result = eval(expression, self.config_context, {})
            return result
            
        except Exception as e:
            print(f"解析配置值失败 '{value}': {e}")
            return value  # 返回原始值
    
    def parse_config(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """解析整个配置"""
        result = {}
        
        for key, value in config.items():
            if isinstance(value, dict):
#                # 递归处理嵌套字典
                result[key] = self.parse_config(value)
            elif isinstance(value, list):
#                # 处理列表
                result[key] = [self.parse_config_value(item) if isinstance(item, str) 
                              else item for item in value]
            else:
#                # 处理单个值
                result[key] = self.parse_config_value(value)
        
        return result

## 测试动态配置解析
print("\n 动态配置解析示例:")

parser = DynamicConfigParser()

## 示例配置
sample_config = {
    "app": {
        "name": "MyApp",
        "debug": "${env['DEBUG'] == 'true'}",
        "port": "${int(env['PORT'])}",
        "workers": "${system['cpu_count'] * 2}",
        "memory_limit": "${system['memory_gb'] * 1024}MB"
    },
    "database": {
        "host": "localhost",
        "port": 5432,
        "max_connections": "${math['max'](10, system['cpu_count'] * 5)}",
        "timeout": "${30 if env['DEBUG'] == 'true' else 10}"
    },
    "cache": {
        "enabled": "${system['memory_gb'] >= 4}",
        "size": "${math['min'](system['memory_gb'] * 128, 1024)}MB",
        "ttl": 3600
    },
    "features": [
        "feature1",
        "${env['DEBUG'] == 'true' and 'debug_feature' or 'prod_feature'}",
        "feature3"
    ]
}

print("原始配置:")
print(json.dumps(sample_config, indent=2, ensure_ascii=False))

## 解析配置
parsed_config = parser.parse_config(sample_config)

print("\n 解析后的配置:")
print(json.dumps(parsed_config, indent=2, ensure_ascii=False))

## 显示解析结果
print("\n 解析结果分析:")
print(f"应用调试模式: {parsed_config['app']['debug']}")
print(f"应用端口: {parsed_config['app']['port']}")
print(f"工作进程数: {parsed_config['app']['workers']}")
print(f"内存限制: {parsed_config['app']['memory_limit']}")
print(f"数据库最大连接数: {parsed_config['database']['max_connections']}")
print(f"缓存启用: {parsed_config['cache']['enabled']}")
print(f"缓存大小: {parsed_config['cache']['size']}")
print(f"功能列表: {parsed_config['features']}")
```

### 表达式引擎

```python
import operator
from typing import Any, Callable, Dict, List, Union

## 表达式引擎
class ExpressionEngine:
    """表达式引擎"""
    
    def __init__(self):
#        # 操作符映射
        self.operators = {
            '+': operator.add,
            '-': operator.sub,
            '*': operator.mul,
            '/': operator.truediv,
            '//': operator.floordiv,
            '%': operator.mod,
            '**': operator.pow,
            '==': operator.eq,
            '!=': operator.ne,
            '<': operator.lt,
            '<=': operator.le,
            '>': operator.gt,
            '>=': operator.ge,
            'and': operator.and_,
            'or': operator.or_,
            'not': operator.not_
        }
        
#        # 内置函数
        self.functions = {
            'abs': abs,
            'max': max,
            'min': min,
            'len': len,
            'sum': sum,
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
        
#        # 常量
        self.constants = {
            'True': True,
            'False': False,
            'None': None,
            'pi': 3.14159265359,
            'e': 2.71828182846
        }
        
#        # 变量存储
        self.variables = {}
    
    def set_variable(self, name: str, value: Any):
        """设置变量"""
        self.variables[name] = value
    
    def get_variable(self, name: str) -> Any:
        """获取变量"""
        return self.variables.get(name)
    
    def add_function(self, name: str, func: Callable):
        """添加自定义函数"""
        self.functions[name] = func
    
    def create_context(self, extra_vars: Dict[str, Any] = None) -> Dict[str, Any]:
        """创建执行上下文"""
        context = {
            '__builtins__': self.functions,
            **self.constants,
            **self.variables
        }
        
        if extra_vars:
            context.update(extra_vars)
        
        return context
    
    def evaluate(self, expression: str, variables: Dict[str, Any] = None) -> Any:
        """求值表达式"""
        try:
            context = self.create_context(variables)
            return eval(expression, {'__builtins__': {}}, context)
        except Exception as e:
            raise RuntimeError(f"表达式求值失败: {e}")
    
    def evaluate_batch(self, expressions: List[str], 
                      variables: Dict[str, Any] = None) -> List[Any]:
        """批量求值"""
        results = []
        context = self.create_context(variables)
        
        for expr in expressions:
            try:
                result = eval(expr, {'__builtins__': {}}, context)
                results.append(result)
            except Exception as e:
                results.append(f"错误: {e}")
        
        return results
    
    def create_formula(self, name: str, expression: str, 
                      parameters: List[str]) -> Callable:
        """创建公式函数"""
        def formula(*args):
            if len(args) != len(parameters):
                raise ValueError(f"参数数量不匹配: 期望{len(parameters)}, 实际{len(args)}")
            
#            # 创建参数映射
            param_vars = dict(zip(parameters, args))
            
#            # 求值表达式
            return self.evaluate(expression, param_vars)
        
#        # 设置函数名和文档
        formula.__name__ = name
        formula.__doc__ = f"公式: {expression}, 参数: {parameters}"
        
#        # 添加到函数库
        self.add_function(name, formula)
        
        return formula

## 测试表达式引擎
print("\n 表达式引擎示例:")

engine = ExpressionEngine()

## 设置变量
engine.set_variable('x', 10)
engine.set_variable('y', 20)
engine.set_variable('name', 'Python')
engine.set_variable('items', [1, 2, 3, 4, 5])

## 基本表达式测试
basic_expressions = [
    "x + y",
    "x * y + 100",
    "max(items)",
    "sum(items)",
    "len(name)",
    "name + ' is great!'",
    "x > 5 and y < 30",
    "pi * 2",
    "round(e, 3)"
]

print("基本表达式测试:")
for expr in basic_expressions:
    try:
        result = engine.evaluate(expr)
        print(f"  {expr} = {result}")
    except Exception as e:
        print(f"  {expr} 失败: {e}")

## 批量求值测试
print(f"\n 批量求值测试:")
batch_results = engine.evaluate_batch(basic_expressions)
for expr, result in zip(basic_expressions, batch_results):
    print(f"  {expr} = {result}")

## 创建自定义函数
print(f"\n 自定义函数测试:")

## 添加自定义函数
def factorial(n):
    """计算阶乘"""
    if n <= 1:
        return 1
    return n * factorial(n - 1)

def fibonacci(n):
    """计算斐波那契数"""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

engine.add_function('factorial', factorial)
engine.add_function('fibonacci', fibonacci)

## 测试自定义函数
custom_expressions = [
    "factorial(5)",
    "fibonacci(10)",
    "factorial(x // 2)",
    "max(factorial(3), fibonacci(5))"
]

for expr in custom_expressions:
    try:
        result = engine.evaluate(expr)
        print(f"  {expr} = {result}")
    except Exception as e:
        print(f"  {expr} 失败: {e}")

## 创建公式
print(f"\n 公式创建测试:")

## 创建数学公式
area_circle = engine.create_formula('area_circle', 'pi * r ** 2', ['r'])
area_rectangle = engine.create_formula('area_rectangle', 'width * height', ['width', 'height'])
quadratic = engine.create_formula('quadratic', 'a * x ** 2 + b * x + c', ['a', 'b', 'c', 'x'])

## 测试公式
print(f"圆形面积 (r=5): {area_circle(5)}")
print(f"矩形面积 (3x4): {area_rectangle(3, 4)}")
print(f"二次函数 (1, 2, 1, 3): {quadratic(1, 2, 1, 3)}")

## 在表达式中使用公式
formula_expressions = [
    "area_circle(10)",
    "area_rectangle(x, y)",
    "quadratic(1, -2, 1, 5)",
    "max(area_circle(3), area_rectangle(2, 4))"
]

print(f"\n 公式表达式测试:")
for expr in formula_expressions:
    try:
        result = engine.evaluate(expr)
        print(f"  {expr} = {result}")
    except Exception as e:
        print(f"  {expr} 失败: {e}")
```

## ⚠️ 常见陷阱与最佳实践

### 安全风险和防护

```python
## 安全风险示例和防护措施

print("\n 安全风险和防护示例:")

## 危险示例 1:代码注入
print("1. 代码注入风险:")

## 危险的用法(永远不要这样做！)
def dangerous_calculator(expression):
    """危险的计算器 - 仅用于演示"""
    try:
        return eval(expression)  # 极其危险！
    except:
        return "错误"

## 这些输入可能造成严重安全问题
dangerous_inputs = [
    "__import__('os').system('echo 危险命令')",
    "open('/etc/passwd', 'r').read()",
    "[].append.__globals__['__builtins__']['exec']('import os; os.system(\"ls\")')",
    "().__class__.__bases__[0].__subclasses__()[104].__init__.__globals__['sys'].exit()"
]

print("危险输入示例(不会实际执行):")
for dangerous_input in dangerous_inputs:
    print(f"  - {dangerous_input}")

## 安全的防护措施
print("\n2. 安全防护措施:")

## 方法 1:限制全局和局部命名空间
def safe_eval_v1(expression, allowed_names=None):
    """安全的 eval - 方法 1"""
    if allowed_names is None:
        allowed_names = {}
    
#    # 创建安全的命名空间
    safe_dict = {
        '__builtins__': {
            'abs': abs, 'max': max, 'min': min, 'round': round,
            'int': int, 'float': float, 'str': str, 'len': len
        }
    }
    safe_dict.update(allowed_names)
    
    try:
        return eval(expression, safe_dict, {})
    except Exception as e:
        raise ValueError(f"表达式执行失败: {e}")

## 方法 2:使用 AST 解析检查
import ast

def safe_eval_v2(expression):
    """安全的 eval - 方法 2"""
    try:
#        # 解析表达式
        tree = ast.parse(expression, mode='eval')
        
#        # 检查节点类型
        for node in ast.walk(tree):
            if isinstance(node, (ast.Import, ast.ImportFrom, ast.Call)):
                if isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
#                    # 只允许特定的函数调用
                    allowed_functions = {'abs', 'max', 'min', 'round', 'int', 'float', 'str', 'len'}
                    if node.func.id not in allowed_functions:
                        raise ValueError(f"不允许的函数调用: {node.func.id}")
                elif isinstance(node, (ast.Import, ast.ImportFrom)):
                    raise ValueError("不允许导入语句")
                elif isinstance(node, ast.Call):
                    raise ValueError("不允许复杂的函数调用")
        
#        # 安全执行
        safe_globals = {
            '__builtins__': {
                'abs': abs, 'max': max, 'min': min, 'round': round,
                'int': int, 'float': float, 'str': str, 'len': len
            }
        }
        
        return eval(compile(tree, '<string>', 'eval'), safe_globals, {})
        
    except SyntaxError as e:
        raise ValueError(f"语法错误: {e}")
    except Exception as e:
        raise ValueError(f"执行错误: {e}")

## 方法 3:使用正则表达式预检查
import re

def safe_eval_v3(expression):
    """安全的 eval - 方法 3"""
#    # 检查危险模式
    dangerous_patterns = [
        r'__\w+__',  # 双下划线属性
        r'import',   # 导入语句
        r'exec',     # 执行函数
        r'eval',     # 嵌套 eval
        r'open',     # 文件操作
        r'file',     # 文件对象
        r'input',    # 输入函数
        r'raw_input', # Python 2 的输入
        r'compile',  # 编译函数
        r'globals',  # 全局变量
        r'locals',   # 局部变量
        r'vars',     # 变量字典
        r'dir',      # 目录函数
        r'hasattr',  # 属性检查
        r'getattr',  # 属性获取
        r'setattr',  # 属性设置
        r'delattr',  # 属性删除
    ]
    
    for pattern in dangerous_patterns:
        if re.search(pattern, expression, re.IGNORECASE):
            raise ValueError(f"表达式包含危险模式: {pattern}")
    
#    # 只允许安全字符
    safe_pattern = re.compile(r'^[a-zA-Z0-9+\-*/().\s,\[\]{}:\'"_]+$')
    if not safe_pattern.match(expression):
        raise ValueError("表达式包含不安全字符")
    
#    # 安全执行
    safe_globals = {
        '__builtins__': {
            'abs': abs, 'max': max, 'min': min, 'round': round,
            'int': int, 'float': float, 'str': str, 'len': len
        }
    }
    
    try:
        return eval(expression, safe_globals, {})
    except Exception as e:
        raise ValueError(f"执行错误: {e}")

## 测试安全方法
print("\n 安全方法测试:")

safe_expressions = [
    "2 + 3 * 4",
    "max(1, 5, 3)",
    "abs(-42)",
    "round(3.14159, 2)",
    "int('123') + float('45.6')",
    "len('hello world')"
]

unsafe_expressions = [
    "__import__('os')",
    "exec('print(1)')",
    "open('file.txt')",
    "globals()",
    "[].append.__globals__"
]

for method_name, method in [('方法 1', safe_eval_v1), ('方法 2', safe_eval_v2), ('方法 3', safe_eval_v3)]:
    print(f"\n{method_name}测试:")
    
    print("  安全表达式:")
    for expr in safe_expressions:
        try:
            result = method(expr)
            print(f"    {expr} = {result}")
        except Exception as e:
            print(f"    {expr} 失败: {e}")
    
    print("  不安全表达式:")
    for expr in unsafe_expressions:
        try:
            result = method(expr)
            print(f"    {expr} = {result} (不应该成功!)")
        except Exception as e:
            print(f"    {expr} 被阻止: {e}")
```

### 性能优化

```python
import time
from functools import lru_cache

## 性能优化示例
print("\n 性能优化示例:")

## 问题 1:重复编译
print("1. 编译缓存优化:")

## 低效的方法
def slow_evaluator(expressions, variables):
    """慢速求值器"""
    results = []
    for expr in expressions:
        result = eval(expr, {}, variables)
        results.append(result)
    return results

## 优化的方法
class CachedEvaluator:
    """缓存求值器"""
    
    def __init__(self):
        self.compiled_cache = {}
    
    @lru_cache(maxsize=128)
    def compile_expression(self, expression):
        """编译并缓存表达式"""
        return compile(expression, '<string>', 'eval')
    
    def evaluate(self, expression, variables):
        """求值表达式"""
        compiled_expr = self.compile_expression(expression)
        return eval(compiled_expr, {}, variables)
    
    def evaluate_batch(self, expressions, variables):
        """批量求值"""
        return [self.evaluate(expr, variables) for expr in expressions]

## 性能测试
test_expressions = [
    "x + y",
    "x * y + z",
    "max(x, y, z)",
    "(x + y) * z / 2",
    "x ** 2 + y ** 2 + z ** 2"
] * 100  # 重复 100 次

test_variables = {'x': 10, 'y': 20, 'z': 30}

## 测试慢速方法
start_time = time.time()
slow_results = slow_evaluator(test_expressions, test_variables)
slow_time = time.time() - start_time

## 测试快速方法
cached_evaluator = CachedEvaluator()
start_time = time.time()
fast_results = cached_evaluator.evaluate_batch(test_expressions, test_variables)
fast_time = time.time() - start_time

print(f"慢速方法耗时: {slow_time:.4f}秒")
print(f"缓存方法耗时: {fast_time:.4f}秒")
print(f"性能提升: {slow_time/fast_time:.1f}倍")
print(f"结果一致: {slow_results == fast_results}")

## 问题 2:复杂表达式优化
print(f"\n2. 复杂表达式优化:")

## 使用预计算优化复杂表达式
class OptimizedEvaluator:
    """优化的求值器"""
    
    def __init__(self):
        self.cache = {}
        self.precomputed = {}
    
    def precompute_constants(self, expression, constants):
        """预计算常量"""
#        # 简单的常量替换
        optimized_expr = expression
        for name, value in constants.items():
            optimized_expr = optimized_expr.replace(name, str(value))
        
        self.precomputed[expression] = optimized_expr
        return optimized_expr
    
    def evaluate_optimized(self, expression, variables, constants=None):
        """优化求值"""
        if constants:
            if expression not in self.precomputed:
                self.precompute_constants(expression, constants)
            expression = self.precomputed[expression]
        
        return eval(expression, {}, variables)

## 测试优化
optimized_evaluator = OptimizedEvaluator()

## 包含常量的复杂表达式
complex_expr = "pi * r ** 2 + e * h"
constants = {'pi': 3.14159, 'e': 2.71828}
variables = {'r': 5, 'h': 10}

## 普通方法
start_time = time.time()
for _ in range(1000):
    result1 = eval(complex_expr, {}, {**constants, **variables})
normal_time = time.time() - start_time

## 优化方法
start_time = time.time()
for _ in range(1000):
    result2 = optimized_evaluator.evaluate_optimized(complex_expr, variables, constants)
optimized_time = time.time() - start_time

print(f"普通方法耗时: {normal_time:.4f}秒")
print(f"优化方法耗时: {optimized_time:.4f}秒")
print(f"性能提升: {normal_time/optimized_time:.1f}倍")
print(f"结果一致: {abs(result1 - result2) < 1e-10}")
```

## 📚 相关函数和模块

### 内置函数
- `exec()` - 执行 Python 语句
- `compile()` - 编译 Python 代码
- `globals()` - 获取全局命名空间
- `locals()` - 获取局部命名空间
- `vars()` - 获取对象的属性字典
- `dir()` - 列出对象的属性
- `hasattr()` - 检查属性是否存在
- `getattr()` - 获取属性值
- `setattr()` - 设置属性值

### 标准库模块
- `ast` - 抽象语法树
- `code` - 交互式解释器
- `codeop` - 编译 Python 代码
- `dis` - 字节码反汇编
- `inspect` - 对象检查
- `types` - 动态类型创建
- `operator` - 函数形式的操作符
- `math` - 数学函数
- `re` - 正则表达式

### 第三方库
- `sympy` - 符号数学
- `numexpr` - 快速数值表达式求值
- `asteval` - 安全的表达式求值
- `RestrictedPython` - 受限的 Python 执行
- `pyparsing` - 解析库

## 📖 扩展阅读

1. **Python 官方文档**
   - [Built-in Functions - eval()](https://docs.python.org/3/library/functions.html#eval)
   - [AST - Abstract Syntax Trees](https://docs.python.org/3/library/ast.html)

2. **安全相关**
   - Python 代码注入攻击
   - 安全编程最佳实践
   - 沙箱执行环境

3. **性能优化**
   - 表达式编译和缓存
   - 数值计算优化
   - 解释器性能调优

## 🏷️ 标签

`表达式求值` `动态执行` `代码执行` `安全风险` `AST 解析` `性能优化` `配置解析` `计算器` `公式引擎` `沙箱执行`