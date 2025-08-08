---
layout: doc
title: globals() - 全局命名空间函数
permalink: /docs/builtins/globals/
category: builtins
tags: [命名空间, 全局变量, 作用域, 变量管理]
description: 返回当前全局命名空间的字典
author: Python文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: 中级
---

# globals() - 全局命名空间函数

## 📝 概述

`globals()` 是Python中的内置函数，用于返回当前全局命名空间的字典。这个字典包含了当前模块中所有全局变量、函数、类和导入的模块。通过 `globals()` 可以动态访问、修改和管理全局变量，这在元编程、调试和动态代码执行中非常有用。

## 🎯 学习目标

- 掌握globals()函数的基本用法和特性
- 理解全局命名空间的概念和作用
- 学会动态访问和修改全局变量
- 掌握globals()在调试和元编程中的应用
- 了解命名空间管理的最佳实践

## 📋 前置知识

- Python基本语法
- 变量作用域的概念
- 字典操作基础
- 函数定义和调用
- 模块和导入机制

## 🔍 详细内容

### 基本概念

全局命名空间是Python中存储全局变量的字典，包括：
1. 模块级别定义的变量
2. 函数定义
3. 类定义
4. 导入的模块和对象
5. 内置变量（如 `__name__`、`__file__` 等）

`globals()` 返回的是实际的全局命名空间字典，对其修改会直接影响全局变量。

### 语法格式

```python
globals()
```

### 参数说明

`globals()` 函数不接受任何参数。

### 返回值

- **类型**: 字典（dict）
- **内容**: 当前全局命名空间中的所有名称和对应的对象

## 💡 代码示例

### 基本用法

```python
# 基本用法示例
print("globals()基本用法:")

# 定义一些全局变量
global_var1 = "Hello"
global_var2 = 42
global_list = [1, 2, 3]

def global_function():
    """全局函数"""
    return "I'm a global function"

class GlobalClass:
    """全局类"""
    def __init__(self):
        self.value = "I'm a global class"

# 获取全局命名空间
global_namespace = globals()

print(f"全局命名空间类型: {type(global_namespace)}")
print(f"全局变量数量: {len(global_namespace)}")

# 查看一些特殊的全局变量
special_vars = ['__name__', '__file__', '__doc__']
print(f"\n特殊全局变量:")
for var in special_vars:
    if var in global_namespace:
        print(f"  {var}: {global_namespace[var]}")

# 查看我们定义的全局变量
our_vars = ['global_var1', 'global_var2', 'global_list', 'global_function', 'GlobalClass']
print(f"\n我们定义的全局变量:")
for var in our_vars:
    if var in global_namespace:
        value = global_namespace[var]
        print(f"  {var}: {value} (类型: {type(value).__name__})")

# 动态访问全局变量
print(f"\n动态访问全局变量:")
var_name = 'global_var1'
if var_name in global_namespace:
    print(f"  {var_name} = {global_namespace[var_name]}")

# 检查变量是否存在
print(f"\n变量存在性检查:")
vars_to_check = ['global_var1', 'nonexistent_var', 'global_function']
for var in vars_to_check:
    exists = var in global_namespace
    print(f"  {var}: {'存在' if exists else '不存在'}")

# 列出所有用户定义的全局变量（排除内置变量）
print(f"\n用户定义的全局变量:")
user_defined = {k: v for k, v in global_namespace.items() 
                if not k.startswith('__') and not k.startswith('_')}
for name, value in list(user_defined.items())[:10]:  # 只显示前10个
    print(f"  {name}: {type(value).__name__}")
```

### 动态变量操作

```python
# 动态变量操作示例
print("\n动态变量操作示例:")

# 动态创建全局变量
print("1. 动态创建全局变量:")
variable_names = ['dynamic_var1', 'dynamic_var2', 'dynamic_var3']
variable_values = ['Hello World', 123, [1, 2, 3, 4, 5]]

for name, value in zip(variable_names, variable_values):
    globals()[name] = value
    print(f"  创建变量 {name} = {value}")

# 验证变量已创建
print(f"\n验证动态创建的变量:")
for name in variable_names:
    if name in globals():
        print(f"  {name} = {globals()[name]}")

# 动态修改全局变量
print(f"\n2. 动态修改全局变量:")
original_value = global_var1
globals()['global_var1'] = "Modified Value"
print(f"  global_var1: {original_value} -> {global_var1}")

# 动态删除全局变量
print(f"\n3. 动态删除全局变量:")
if 'dynamic_var1' in globals():
    del globals()['dynamic_var1']
    print(f"  已删除 dynamic_var1")
    print(f"  dynamic_var1 存在: {'dynamic_var1' in globals()}")

# 批量操作全局变量
print(f"\n4. 批量操作全局变量:")

# 批量创建变量
batch_vars = {f'batch_var_{i}': i * 10 for i in range(1, 6)}
for name, value in batch_vars.items():
    globals()[name] = value

print(f"  批量创建了 {len(batch_vars)} 个变量")

# 批量查询变量
batch_names = [f'batch_var_{i}' for i in range(1, 6)]
batch_values = [globals().get(name, 'Not Found') for name in batch_names]
print(f"  批量查询结果: {dict(zip(batch_names, batch_values))}")

# 批量删除变量
for name in batch_names:
    if name in globals():
        del globals()[name]
print(f"  已批量删除变量")

# 条件性变量操作
print(f"\n5. 条件性变量操作:")

def set_global_if_not_exists(name, value):
    """如果全局变量不存在则设置"""
    if name not in globals():
        globals()[name] = value
        return True
    return False

def update_global_if_exists(name, value):
    """如果全局变量存在则更新"""
    if name in globals():
        old_value = globals()[name]
        globals()[name] = value
        return old_value
    return None

# 测试条件性操作
test_vars = [
    ('conditional_var1', 'First Value'),
    ('global_var2', 999),  # 这个变量已存在
    ('conditional_var2', 'Second Value')
]

for name, value in test_vars:
    created = set_global_if_not_exists(name, value)
    if created:
        print(f"  创建新变量: {name} = {value}")
    else:
        old_value = update_global_if_exists(name, value)
        print(f"  更新现有变量: {name} = {old_value} -> {value}")
```

### 函数中的globals()使用

```python
# 函数中的globals()使用示例
print("\n函数中的globals()使用示例:")

# 全局变量
function_global_var = "Original Global Value"
counter = 0

def demonstrate_globals_in_function():
    """演示在函数中使用globals()"""
    print(f"\n在函数中使用globals():")
    
    # 访问全局变量
    print(f"  访问全局变量: function_global_var = {globals()['function_global_var']}")
    
    # 修改全局变量
    globals()['function_global_var'] = "Modified in Function"
    print(f"  修改后: function_global_var = {globals()['function_global_var']}")
    
    # 创建新的全局变量
    globals()['new_global_from_function'] = "Created in Function"
    print(f"  创建新全局变量: new_global_from_function")
    
    # 访问和修改计数器
    globals()['counter'] += 1
    print(f"  计数器递增: counter = {globals()['counter']}")
    
    # 检查函数本身是否在全局命名空间中
    func_name = 'demonstrate_globals_in_function'
    if func_name in globals():
        print(f"  函数 {func_name} 在全局命名空间中")

def global_variable_manager():
    """全局变量管理器"""
    print(f"\n全局变量管理器:")
    
    # 获取所有用户定义的全局变量
    user_globals = {k: v for k, v in globals().items() 
                   if not k.startswith('_') and not callable(v) and k != 'user_globals'}
    
    print(f"  用户定义的全局变量 ({len(user_globals)} 个):")
    for name, value in user_globals.items():
        print(f"    {name}: {value} ({type(value).__name__})")
    
    return user_globals

def safe_global_access(var_name, default=None):
    """安全访问全局变量"""
    return globals().get(var_name, default)

def safe_global_update(var_name, new_value):
    """安全更新全局变量"""
    if var_name in globals():
        old_value = globals()[var_name]
        globals()[var_name] = new_value
        return old_value
    else:
        globals()[var_name] = new_value
        return None

# 测试函数
print(f"调用前: function_global_var = {function_global_var}")
demonstrate_globals_in_function()
print(f"调用后: function_global_var = {function_global_var}")
print(f"新创建的全局变量: new_global_from_function = {globals().get('new_global_from_function', 'Not Found')}")

# 测试全局变量管理器
managed_vars = global_variable_manager()

# 测试安全访问函数
print(f"\n安全访问测试:")
test_vars = ['counter', 'nonexistent_var', 'function_global_var']
for var in test_vars:
    value = safe_global_access(var, 'DEFAULT')
    print(f"  {var}: {value}")

# 测试安全更新函数
print(f"\n安全更新测试:")
old_value = safe_global_update('counter', 100)
print(f"  counter: {old_value} -> {counter}")

old_value = safe_global_update('new_safe_var', 'Safe Value')
print(f"  new_safe_var: {old_value} -> {globals().get('new_safe_var')}")
```

### 命名空间比较和分析

```python
import sys
import types
from typing import Dict, Any, List, Tuple

# 命名空间分析工具
class NamespaceAnalyzer:
    """命名空间分析工具"""
    
    def __init__(self):
        self.initial_globals = set(globals().keys())
    
    def analyze_globals(self) -> Dict[str, Any]:
        """分析全局命名空间"""
        current_globals = globals()
        
        analysis = {
            'total_count': len(current_globals),
            'categories': self._categorize_globals(current_globals),
            'new_variables': self._find_new_variables(current_globals),
            'memory_usage': self._estimate_memory_usage(current_globals),
            'type_distribution': self._analyze_types(current_globals)
        }
        
        return analysis
    
    def _categorize_globals(self, global_dict: Dict[str, Any]) -> Dict[str, List[str]]:
        """分类全局变量"""
        categories = {
            'builtin_vars': [],
            'modules': [],
            'functions': [],
            'classes': [],
            'variables': [],
            'special_vars': []
        }
        
        for name, value in global_dict.items():
            if name.startswith('__') and name.endswith('__'):
                categories['special_vars'].append(name)
            elif isinstance(value, types.ModuleType):
                categories['modules'].append(name)
            elif callable(value) and hasattr(value, '__name__'):
                if isinstance(value, type):
                    categories['classes'].append(name)
                else:
                    categories['functions'].append(name)
            elif name in dir(__builtins__):
                categories['builtin_vars'].append(name)
            else:
                categories['variables'].append(name)
        
        return categories
    
    def _find_new_variables(self, current_globals: Dict[str, Any]) -> List[str]:
        """查找新增的变量"""
        current_keys = set(current_globals.keys())
        return list(current_keys - self.initial_globals)
    
    def _estimate_memory_usage(self, global_dict: Dict[str, Any]) -> Dict[str, Any]:
        """估算内存使用"""
        total_size = 0
        large_objects = []
        
        for name, value in global_dict.items():
            try:
                size = sys.getsizeof(value)
                total_size += size
                
                if size > 1000:  # 大于1KB的对象
                    large_objects.append((name, size))
            except (TypeError, AttributeError):
                # 某些对象可能无法获取大小
                pass
        
        return {
            'total_size_bytes': total_size,
            'total_size_kb': total_size / 1024,
            'large_objects': sorted(large_objects, key=lambda x: x[1], reverse=True)
        }
    
    def _analyze_types(self, global_dict: Dict[str, Any]) -> Dict[str, int]:
        """分析类型分布"""
        type_counts = {}
        
        for value in global_dict.values():
            type_name = type(value).__name__
            type_counts[type_name] = type_counts.get(type_name, 0) + 1
        
        return dict(sorted(type_counts.items(), key=lambda x: x[1], reverse=True))
    
    def compare_namespaces(self, snapshot1: Dict[str, Any], snapshot2: Dict[str, Any]) -> Dict[str, Any]:
        """比较两个命名空间快照"""
        keys1 = set(snapshot1.keys())
        keys2 = set(snapshot2.keys())
        
        return {
            'added': list(keys2 - keys1),
            'removed': list(keys1 - keys2),
            'common': list(keys1 & keys2),
            'modified': self._find_modified_variables(snapshot1, snapshot2, keys1 & keys2)
        }
    
    def _find_modified_variables(self, snap1: Dict[str, Any], snap2: Dict[str, Any], 
                                common_keys: set) -> List[Tuple[str, Any, Any]]:
        """查找修改的变量"""
        modified = []
        
        for key in common_keys:
            try:
                if snap1[key] != snap2[key]:
                    modified.append((key, snap1[key], snap2[key]))
            except (TypeError, ValueError):
                # 某些对象可能无法比较
                pass
        
        return modified
    
    def print_analysis(self, analysis: Dict[str, Any]):
        """打印分析结果"""
        print(f"全局命名空间分析报告:")
        print(f"=" * 50)
        
        print(f"总变量数: {analysis['total_count']}")
        
        # 分类统计
        print(f"\n变量分类:")
        categories = analysis['categories']
        for category, items in categories.items():
            if items:
                print(f"  {category}: {len(items)} 个")
                if len(items) <= 5:
                    print(f"    {', '.join(items)}")
                else:
                    print(f"    {', '.join(items[:5])}... (还有{len(items)-5}个)")
        
        # 新增变量
        new_vars = analysis['new_variables']
        if new_vars:
            print(f"\n新增变量 ({len(new_vars)} 个):")
            print(f"  {', '.join(new_vars)}")
        
        # 内存使用
        memory = analysis['memory_usage']
        print(f"\n内存使用:")
        print(f"  总大小: {memory['total_size_kb']:.2f} KB")
        if memory['large_objects']:
            print(f"  大对象 (>1KB):")
            for name, size in memory['large_objects'][:5]:
                print(f"    {name}: {size/1024:.2f} KB")
        
        # 类型分布
        types_dist = analysis['type_distribution']
        print(f"\n类型分布 (前10个):")
        for type_name, count in list(types_dist.items())[:10]:
            print(f"  {type_name}: {count}")

# 测试命名空间分析
print("\n命名空间分析示例:")

analyzer = NamespaceAnalyzer()

# 创建一些测试变量
test_string = "This is a test string" * 100  # 大字符串
test_list = list(range(1000))  # 大列表
test_dict = {f'key_{i}': f'value_{i}' for i in range(100)}  # 大字典

def test_function():
    """测试函数"""
    pass

class TestClass:
    """测试类"""
    def __init__(self):
        self.data = [1, 2, 3]

test_instance = TestClass()

# 分析当前命名空间
analysis = analyzer.analyze_globals()
analyzer.print_analysis(analysis)

# 创建命名空间快照
print(f"\n创建命名空间快照...")
snapshot1 = dict(globals())

# 修改一些变量
test_string = "Modified string"
new_variable = "This is new"
del test_list  # 删除一个变量

# 创建第二个快照
snapshot2 = dict(globals())

# 比较快照
print(f"\n比较命名空间变化:")
comparison = analyzer.compare_namespaces(snapshot1, snapshot2)

print(f"新增变量: {comparison['added']}")
print(f"删除变量: {comparison['removed']}")
print(f"修改变量:")
for name, old_val, new_val in comparison['modified']:
    print(f"  {name}: {str(old_val)[:50]}... -> {str(new_val)[:50]}...")
```

## 🚀 高级应用

### 动态模块加载器

```python
import importlib
import sys
from typing import Dict, Any, Optional, List

# 动态模块加载器
class DynamicModuleLoader:
    """动态模块加载器"""
    
    def __init__(self):
        self.loaded_modules: Dict[str, Any] = {}
        self.module_aliases: Dict[str, str] = {}
    
    def load_module(self, module_name: str, alias: Optional[str] = None, 
                   add_to_globals: bool = True) -> Any:
        """动态加载模块"""
        try:
            # 加载模块
            module = importlib.import_module(module_name)
            
            # 确定模块在全局命名空间中的名称
            global_name = alias or module_name.split('.')[-1]
            
            # 添加到全局命名空间
            if add_to_globals:
                globals()[global_name] = module
                print(f"模块 {module_name} 已加载为 {global_name}")
            
            # 记录加载的模块
            self.loaded_modules[global_name] = module
            if alias:
                self.module_aliases[alias] = module_name
            
            return module
            
        except ImportError as e:
            print(f"加载模块 {module_name} 失败: {e}")
            return None
    
    def load_from_module(self, module_name: str, items: List[str], 
                        add_to_globals: bool = True) -> Dict[str, Any]:
        """从模块加载特定项目"""
        try:
            module = importlib.import_module(module_name)
            loaded_items = {}
            
            for item_name in items:
                if hasattr(module, item_name):
                    item = getattr(module, item_name)
                    loaded_items[item_name] = item
                    
                    if add_to_globals:
                        globals()[item_name] = item
                        print(f"从 {module_name} 加载 {item_name}")
                else:
                    print(f"模块 {module_name} 中没有 {item_name}")
            
            return loaded_items
            
        except ImportError as e:
            print(f"从模块 {module_name} 加载项目失败: {e}")
            return {}
    
    def unload_module(self, module_name: str) -> bool:
        """卸载模块"""
        if module_name in globals():
            del globals()[module_name]
            
            if module_name in self.loaded_modules:
                del self.loaded_modules[module_name]
            
            # 检查是否是别名
            if module_name in self.module_aliases:
                del self.module_aliases[module_name]
            
            print(f"模块 {module_name} 已卸载")
            return True
        else:
            print(f"模块 {module_name} 未在全局命名空间中")
            return False
    
    def list_loaded_modules(self) -> Dict[str, str]:
        """列出已加载的模块"""
        result = {}
        for name, module in self.loaded_modules.items():
            module_file = getattr(module, '__file__', 'Built-in')
            result[name] = module_file
        return result
    
    def reload_module(self, module_name: str) -> bool:
        """重新加载模块"""
        if module_name in self.loaded_modules:
            try:
                module = self.loaded_modules[module_name]
                reloaded_module = importlib.reload(module)
                
                # 更新全局命名空间
                globals()[module_name] = reloaded_module
                self.loaded_modules[module_name] = reloaded_module
                
                print(f"模块 {module_name} 已重新加载")
                return True
                
            except Exception as e:
                print(f"重新加载模块 {module_name} 失败: {e}")
                return False
        else:
            print(f"模块 {module_name} 未加载")
            return False
    
    def get_module_info(self, module_name: str) -> Dict[str, Any]:
        """获取模块信息"""
        if module_name in self.loaded_modules:
            module = self.loaded_modules[module_name]
            
            return {
                'name': getattr(module, '__name__', 'Unknown'),
                'file': getattr(module, '__file__', 'Built-in'),
                'doc': getattr(module, '__doc__', 'No documentation'),
                'package': getattr(module, '__package__', None),
                'version': getattr(module, '__version__', 'Unknown'),
                'attributes': [attr for attr in dir(module) if not attr.startswith('_')]
            }
        else:
            return {'error': f'Module {module_name} not loaded'}

# 测试动态模块加载器
print("\n动态模块加载器示例:")

loader = DynamicModuleLoader()

# 加载标准库模块
print("1. 加载标准库模块:")
loader.load_module('json', 'json_module')
loader.load_module('datetime', 'dt')
loader.load_module('collections')

# 从模块加载特定项目
print("\n2. 从模块加载特定项目:")
math_items = loader.load_from_module('math', ['sqrt', 'pi', 'sin', 'cos'])
print(f"加载的数学函数: {list(math_items.keys())}")

# 测试加载的模块
print("\n3. 测试加载的模块:")
if 'json_module' in globals():
    test_data = {'name': 'Alice', 'age': 30}
    json_str = json_module.dumps(test_data)
    print(f"JSON序列化: {json_str}")

if 'dt' in globals():
    now = dt.datetime.now()
    print(f"当前时间: {now}")

if 'sqrt' in globals():
    print(f"sqrt(16) = {sqrt(16)}")
    print(f"pi = {pi}")

# 列出已加载的模块
print("\n4. 已加载的模块:")
loaded = loader.list_loaded_modules()
for name, file_path in loaded.items():
    print(f"  {name}: {file_path}")

# 获取模块信息
print("\n5. 模块信息:")
info = loader.get_module_info('json_module')
for key, value in info.items():
    if key == 'attributes':
        print(f"  {key}: {len(value)} 个属性")
    else:
        print(f"  {key}: {value}")

# 卸载模块
print("\n6. 卸载模块:")
loader.unload_module('collections')
print(f"collections 在全局命名空间: {'collections' in globals()}")
```

### 全局配置管理器

```python
import json
import os
from typing import Dict, Any, Optional, Union
from pathlib import Path

# 全局配置管理器
class GlobalConfigManager:
    """全局配置管理器"""
    
    def __init__(self, config_prefix: str = 'CONFIG_'):
        self.config_prefix = config_prefix
        self.config_file: Optional[str] = None
        self.auto_save = False
        self.config_history: List[Dict[str, Any]] = []
    
    def load_config_from_file(self, file_path: str, auto_save: bool = False) -> bool:
        """从文件加载配置"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                config_data = json.load(f)
            
            # 将配置加载到全局命名空间
            for key, value in config_data.items():
                global_key = f"{self.config_prefix}{key.upper()}"
                globals()[global_key] = value
                print(f"加载配置: {global_key} = {value}")
            
            self.config_file = file_path
            self.auto_save = auto_save
            
            # 保存配置历史
            self._save_config_snapshot()
            
            return True
            
        except Exception as e:
            print(f"加载配置文件失败: {e}")
            return False
    
    def save_config_to_file(self, file_path: Optional[str] = None) -> bool:
        """保存配置到文件"""
        target_file = file_path or self.config_file
        if not target_file:
            print("未指定配置文件路径")
            return False
        
        try:
            # 收集所有配置变量
            config_data = self.get_all_config()
            
            # 确保目录存在
            Path(target_file).parent.mkdir(parents=True, exist_ok=True)
            
            # 保存到文件
            with open(target_file, 'w', encoding='utf-8') as f:
                json.dump(config_data, f, indent=2, ensure_ascii=False)
            
            print(f"配置已保存到: {target_file}")
            return True
            
        except Exception as e:
            print(f"保存配置文件失败: {e}")
            return False
    
    def set_config(self, key: str, value: Any, save_immediately: bool = None) -> None:
        """设置配置项"""
        global_key = f"{self.config_prefix}{key.upper()}"
        old_value = globals().get(global_key)
        
        globals()[global_key] = value
        print(f"设置配置: {global_key} = {value}")
        
        # 记录变更
        if old_value != value:
            self._record_config_change(global_key, old_value, value)
        
        # 自动保存
        if save_immediately or (save_immediately is None and self.auto_save):
            self.save_config_to_file()
    
    def get_config(self, key: str, default: Any = None) -> Any:
        """获取配置项"""
        global_key = f"{self.config_prefix}{key.upper()}"
        return globals().get(global_key, default)
    
    def get_all_config(self) -> Dict[str, Any]:
        """获取所有配置项"""
        config_data = {}
        
        for key, value in globals().items():
            if key.startswith(self.config_prefix):
                # 移除前缀并转换为小写
                config_key = key[len(self.config_prefix):].lower()
                config_data[config_key] = value
        
        return config_data
    
    def remove_config(self, key: str, save_immediately: bool = None) -> bool:
        """删除配置项"""
        global_key = f"{self.config_prefix}{key.upper()}"
        
        if global_key in globals():
            old_value = globals()[global_key]
            del globals()[global_key]
            print(f"删除配置: {global_key}")
            
            # 记录变更
            self._record_config_change(global_key, old_value, None)
            
            # 自动保存
            if save_immediately or (save_immediately is None and self.auto_save):
                self.save_config_to_file()
            
            return True
        else:
            print(f"配置项 {global_key} 不存在")
            return False
    
    def list_config(self) -> None:
        """列出所有配置项"""
        config_data = self.get_all_config()
        
        if config_data:
            print(f"当前配置项 ({len(config_data)} 个):")
            for key, value in config_data.items():
                print(f"  {key}: {value} ({type(value).__name__})")
        else:
            print("没有配置项")
    
    def reset_config(self) -> None:
        """重置所有配置"""
        config_keys = [key for key in globals().keys() if key.startswith(self.config_prefix)]
        
        for key in config_keys:
            del globals()[key]
        
        print(f"已重置 {len(config_keys)} 个配置项")
        
        # 保存配置历史
        self._save_config_snapshot()
    
    def _save_config_snapshot(self) -> None:
        """保存配置快照"""
        snapshot = {
            'timestamp': __import__('datetime').datetime.now().isoformat(),
            'config': self.get_all_config().copy()
        }
        self.config_history.append(snapshot)
        
        # 限制历史记录数量
        if len(self.config_history) > 10:
            self.config_history.pop(0)
    
    def _record_config_change(self, key: str, old_value: Any, new_value: Any) -> None:
        """记录配置变更"""
        change_record = {
            'timestamp': __import__('datetime').datetime.now().isoformat(),
            'key': key,
            'old_value': old_value,
            'new_value': new_value,
            'action': 'delete' if new_value is None else 'update' if old_value is not None else 'create'
        }
        
        if not hasattr(self, 'change_log'):
            self.change_log = []
        
        self.change_log.append(change_record)
        
        # 限制变更日志数量
        if len(self.change_log) > 50:
            self.change_log.pop(0)
    
    def get_config_history(self) -> List[Dict[str, Any]]:
        """获取配置历史"""
        return self.config_history.copy()
    
    def get_change_log(self) -> List[Dict[str, Any]]:
        """获取变更日志"""
        return getattr(self, 'change_log', []).copy()
    
    def create_config_template(self, template_path: str) -> bool:
        """创建配置模板文件"""
        template_config = {
            "database": {
                "host": "localhost",
                "port": 5432,
                "name": "myapp",
                "user": "username",
                "password": "password"
            },
            "api": {
                "base_url": "https://api.example.com",
                "timeout": 30,
                "retries": 3
            },
            "logging": {
                "level": "INFO",
                "file": "app.log",
                "max_size": "10MB"
            },
            "features": {
                "debug_mode": False,
                "cache_enabled": True,
                "max_connections": 100
            }
        }
        
        try:
            Path(template_path).parent.mkdir(parents=True, exist_ok=True)
            
            with open(template_path, 'w', encoding='utf-8') as f:
                json.dump(template_config, f, indent=2, ensure_ascii=False)
            
            print(f"配置模板已创建: {template_path}")
            return True
            
        except Exception as e:
            print(f"创建配置模板失败: {e}")
            return False

# 测试全局配置管理器
print("\n全局配置管理器示例:")

config_manager = GlobalConfigManager()

# 创建配置模板
print("1. 创建配置模板:")
template_file = "config_template.json"
config_manager.create_config_template(template_file)

# 手动设置一些配置
print("\n2. 手动设置配置:")
config_manager.set_config('app_name', 'MyApplication')
config_manager.set_config('version', '1.0.0')
config_manager.set_config('debug', True)
config_manager.set_config('max_users', 1000)

# 列出当前配置
print("\n3. 当前配置:")
config_manager.list_config()

# 保存配置到文件
print("\n4. 保存配置:")
config_file = "app_config.json"
config_manager.save_config_to_file(config_file)

# 修改配置
print("\n5. 修改配置:")
config_manager.set_config('debug', False)
config_manager.set_config('max_users', 2000)
config_manager.set_config('new_feature', 'enabled')

# 获取特定配置
print("\n6. 获取配置:")
app_name = config_manager.get_config('app_name')
debug_mode = config_manager.get_config('debug')
nonexistent = config_manager.get_config('nonexistent', 'default_value')

print(f"应用名称: {app_name}")
print(f"调试模式: {debug_mode}")
print(f"不存在的配置: {nonexistent}")

# 查看变更日志
print("\n7. 配置变更日志:")
change_log = config_manager.get_change_log()
for change in change_log[-5:]:  # 显示最近5个变更
    print(f"  {change['timestamp']}: {change['action']} {change['key']}")
    if change['action'] != 'create':
        print(f"    {change['old_value']} -> {change['new_value']}")

# 删除配置
print("\n8. 删除配置:")
config_manager.remove_config('new_feature')

# 最终配置状态
print("\n9. 最终配置状态:")
config_manager.list_config()

# 验证全局变量
print("\n10. 验证全局变量:")
config_vars = [key for key in globals().keys() if key.startswith('CONFIG_')]
print(f"全局配置变量: {config_vars}")

# 清理测试文件
try:
    os.remove(template_file)
    os.remove(config_file)
    print(f"\n已清理测试文件")
except:
    pass
```

## ⚠️ 常见陷阱与最佳实践

### 安全使用globals()

```python
# 安全使用globals()的最佳实践
print("\n安全使用globals()的最佳实践:")

# 1. 避免意外覆盖重要变量
print("1. 避免意外覆盖:")

# 危险的做法
def dangerous_global_modification():
    """危险的全局变量修改"""
    # 可能意外覆盖重要的内置函数
    globals()['len'] = lambda x: 0  # 危险！覆盖了内置函数
    globals()['print'] = lambda *args: None  # 危险！覆盖了print函数

# 安全的做法
def safe_global_modification():
    """安全的全局变量修改"""
    # 检查是否会覆盖重要变量
    important_names = {'len', 'print', 'input', 'open', 'range', 'list', 'dict', 'str', 'int'}
    
    def safe_set_global(name, value):
        if name in important_names:
            print(f"警告: 尝试覆盖重要变量 {name}")
            return False
        
        if name in dir(__builtins__):
            print(f"警告: 尝试覆盖内置变量 {name}")
            return False
        
        globals()[name] = value
        return True
    
    # 安全设置变量
    safe_set_global('my_custom_var', 'safe value')
    safe_set_global('len', 'dangerous value')  # 会被阻止

print("  测试危险操作（已注释）:")
# dangerous_global_modification()  # 不要运行这个！

print("  测试安全操作:")
safe_global_modification()

# 2. 命名空间污染防护
print("\n2. 命名空间污染防护:")

class NamespaceProtector:
    """命名空间保护器"""
    
    def __init__(self):
        self.protected_names = set(dir(__builtins__))
        self.protected_names.update(['globals', 'locals', 'vars', 'dir'])
        self.original_globals = set(globals().keys())
    
    def is_safe_name(self, name: str) -> bool:
        """检查名称是否安全"""
        if name in self.protected_names:
            return False
        
        if name.startswith('__') and name.endswith('__'):
            return False
        
        return True
    
    def safe_set_global(self, name: str, value: Any) -> bool:
        """安全设置全局变量"""
        if not self.is_safe_name(name):
            print(f"拒绝设置受保护的名称: {name}")
            return False
        
        globals()[name] = value
        print(f"安全设置: {name} = {value}")
        return True
    
    def cleanup_namespace(self) -> List[str]:
        """清理命名空间"""
        current_names = set(globals().keys())
        added_names = current_names - self.original_globals
        
        cleaned = []
        for name in added_names:
            if not name.startswith('_') and self.is_safe_name(name):
                del globals()[name]
                cleaned.append(name)
        
        return cleaned
    
    def get_namespace_report(self) -> Dict[str, Any]:
        """获取命名空间报告"""
        current_names = set(globals().keys())
        added_names = current_names - self.original_globals
        
        return {
            'total_variables': len(current_names),
            'original_count': len(self.original_globals),
            'added_count': len(added_names),
            'added_names': list(added_names),
            'protected_count': len(self.protected_names)
        }

# 测试命名空间保护器
protector = NamespaceProtector()

print("  测试安全设置:")
protector.safe_set_global('safe_var1', 'value1')
protector.safe_set_global('safe_var2', [1, 2, 3])
protector.safe_set_global('len', 'dangerous')  # 会被拒绝
protector.safe_set_global('__special__', 'special')  # 会被拒绝

# 获取命名空间报告
report = protector.get_namespace_report()
print(f"\n  命名空间报告:")
print(f"    总变量数: {report['total_variables']}")
print(f"    新增变量数: {report['added_count']}")
print(f"    新增变量: {report['added_names'][:5]}...")  # 只显示前5个

# 清理命名空间
print(f"\n  清理命名空间:")
cleaned = protector.cleanup_namespace()
print(f"    已清理 {len(cleaned)} 个变量")

# 3. 性能考虑
print("\n3. 性能考虑:")

import time

def performance_comparison():
    """性能比较"""
    # 直接访问 vs globals()访问
    test_var = "test_value"
    globals()['test_global'] = "test_value"
    
    iterations = 100000
    
    # 直接访问
    start_time = time.time()
    for _ in range(iterations):
        value = test_var
    direct_time = time.time() - start_time
    
    # globals()访问
    start_time = time.time()
    for _ in range(iterations):
        value = globals()['test_global']
    globals_time = time.time() - start_time
    
    # globals().get()访问
    start_time = time.time()
    for _ in range(iterations):
        value = globals().get('test_global')
    globals_get_time = time.time() - start_time
    
    print(f"  性能比较 ({iterations} 次迭代):")
    print(f"    直接访问: {direct_time:.4f}秒")
    print(f"    globals()访问: {globals_time:.4f}秒 (慢 {globals_time/direct_time:.1f}倍)")
    print(f"    globals().get()访问: {globals_get_time:.4f}秒 (慢 {globals_get_time/direct_time:.1f}倍)")
    
    # 清理
    del globals()['test_global']

performance_comparison()

# 4. 调试和监控
print("\n4. 调试和监控:")

class GlobalsMonitor:
    """全局变量监控器"""
    
    def __init__(self):
        self.baseline = set(globals().keys())
        self.monitoring = False
        self.changes = []
    
    def start_monitoring(self):
        """开始监控"""
        self.monitoring = True
        self.baseline = set(globals().keys())
        self.changes = []
        print("开始监控全局变量变化")
    
    def stop_monitoring(self):
        """停止监控"""
        self.monitoring = False
        print("停止监控全局变量变化")
    
    def check_changes(self) -> Dict[str, List[str]]:
        """检查变化"""
        if not self.monitoring:
            return {'error': 'Not monitoring'}
        
        current = set(globals().keys())
        added = current - self.baseline
        removed = self.baseline - current
        
        if added or removed:
            change_record = {
                'timestamp': time.time(),
                'added': list(added),
                'removed': list(removed)
            }
            self.changes.append(change_record)
            
            # 更新基线
            self.baseline = current
        
        return {
            'added': list(added),
            'removed': list(removed),
            'total_changes': len(self.changes)
        }
    
    def get_change_history(self) -> List[Dict[str, Any]]:
        """获取变化历史"""
        return self.changes.copy()
    
    def print_summary(self):
        """打印监控摘要"""
        if not self.changes:
            print("  没有检测到变化")
            return
        
        total_added = sum(len(change['added']) for change in self.changes)
        total_removed = sum(len(change['removed']) for change in self.changes)
        
        print(f"  监控摘要:")
        print(f"    变化次数: {len(self.changes)}")
        print(f"    总新增: {total_added}")
        print(f"    总删除: {total_removed}")
        
        if self.changes:
            latest = self.changes[-1]
            print(f"    最近变化: +{len(latest['added'])} -{len(latest['removed'])}")

# 测试监控器
monitor = GlobalsMonitor()
monitor.start_monitoring()

# 进行一些变化
test_monitoring_var1 = "value1"
test_monitoring_var2 = "value2"

# 检查变化
changes = monitor.check_changes()
print(f"  检测到变化: +{len(changes['added'])} -{len(changes['removed'])}")
print(f"  新增变量: {changes['added']}")

# 删除一个变量
del test_monitoring_var1

# 再次检查
changes = monitor.check_changes()
print(f"  再次检测: +{len(changes['added'])} -{len(changes['removed'])}")
print(f"  删除变量: {changes['removed']}")

monitor.stop_monitoring()
monitor.print_summary()

# 清理
if 'test_monitoring_var2' in globals():
    del globals()['test_monitoring_var2']
```

## 🔗 相关函数和模块

### 内置函数
- `locals()` - 返回局部命名空间字典
- `vars()` - 返回对象的属性字典
- `dir()` - 列出对象的属性名
- `hasattr()` - 检查对象是否有指定属性
- `getattr()` - 获取对象属性值
- `setattr()` - 设置对象属性值
- `delattr()` - 删除对象属性

### 标准库模块
- `inspect` - 对象检查和内省
- `types` - 动态类型创建和检查
- `sys` - 系统相关参数和函数
- `importlib` - 动态导入工具
- `gc` - 垃圾回收接口

### 第三方库
- `varname` - 获取变量名
- `dill` - 扩展的序列化库
- `cloudpickle` - 云端序列化

## 📚 扩展阅读

- [Python命名空间和作用域](https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces)
- [内置函数文档](https://docs.python.org/3/library/functions.html#globals)
- [Python数据模型](https://docs.python.org/3/reference/datamodel.html)
- [动态导入指南](https://docs.python.org/3/library/importlib.html)

## 🏷️ 标签

`命名空间` `全局变量` `作用域` `变量管理` `动态访问` `元编程` `调试工具` `配置管理`