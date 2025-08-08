---
layout: doc
title: hasattr() - 属性检查函数
permalink: /docs/builtins/hasattr/
category: builtins
tags: [属性检查, 反射, 对象检查, 动态编程]
description: 检查对象是否具有指定的属性
author: Python 文档工程师
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "初级"
---

# hasattr() - 属性检查函数

## 📝 概述

`hasattr()` 是 Python 中的内置函数，用于检查对象是否具有指定的属性。这个函数在动态编程、对象检查、API 兼容性检查等场景中非常有用。它可以帮助开发者在运行时安全地检查对象的属性，避免因访问不存在的属性而引发异常。

## 🎯 学习目标

- 掌握 hasattr()函数的基本用法和语法
- 理解属性检查的工作机制
- 学会在实际项目中使用 hasattr()进行安全的属性访问
- 了解 hasattr()与 getattr()、setattr()的配合使用
- 掌握动态属性检查的最佳实践

## 📋 前置知识

- Python 基本语法
- 对象和属性的基本概念
- 类的定义和实例化
- 异常处理的基本知识
- 动态编程的基本概念

## 🔍 详细内容

### 基本概念

`hasattr()` 函数用于检查对象是否具有指定名称的属性。它会返回一个布尔值：如果对象具有该属性则返回 `True`，否则返回 `False`。这个函数实际上是通过调用 `getattr()` 并捕获 `AttributeError` 异常来实现的。

### 语法格式

```python
hasattr(object, name)
```

### 参数说明

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|---------|
| object | 任意对象 | 是 | 无 | 要检查的对象 |
| name | 字符串 | 是 | 无 | 属性名称 |

### 返回值

- **类型**: bool
- **内容**: 如果对象具有指定属性则返回 True，否则返回 False

## 💡 代码示例

### 基本用法

```python
## 定义一个简单的类
class Person:
    """人员类"""
    def __init__(self, name, age):
        self.name = name
        self.age = age
        self._private_id = "P001"
    
    def greet(self):
        return f"你好,我是{self.name}"
    
    def get_info(self):
        return f"{self.name}, {self.age}岁"
    
    @property
    def display_name(self):
        return f"Mr./Ms. {self.name}"

## 创建实例
person = Person("张三", 30)

## 基本属性检查
print("基本属性检查:")
print(f"person 有'name'属性: {hasattr(person, 'name')}")  # True
print(f"person 有'age'属性: {hasattr(person, 'age')}")  # True
print(f"person 有'height'属性: {hasattr(person, 'height')}")  # False
print(f"person 有'_private_id'属性: {hasattr(person, '_private_id')}")  # True

## 方法检查
print(f"\n 方法检查:")
print(f"person 有'greet'方法: {hasattr(person, 'greet')}")  # True
print(f"person 有'get_info'方法: {hasattr(person, 'get_info')}")  # True
print(f"person 有'fly'方法: {hasattr(person, 'fly')}")  # False

## 属性装饰器检查
print(f"\n 属性装饰器检查:")
print(f"person 有'display_name'属性: {hasattr(person, 'display_name')}")  # True

## 类属性检查
print(f"\n 类属性检查:")
print(f"Person 类有'__init__'方法: {hasattr(Person, '__init__')}")  # True
print(f"Person 类有'greet'方法: {hasattr(Person, 'greet')}")  # True
print(f"Person 类有'name'属性: {hasattr(Person, 'name')}")  # False(实例属性)

## 内置对象检查
print(f"\n 内置对象检查:")
my_list = [1, 2, 3]
print(f"list 有'append'方法: {hasattr(my_list, 'append')}")  # True
print(f"list 有'remove'方法: {hasattr(my_list, 'remove')}")  # True
print(f"list 有'keys'方法: {hasattr(my_list, 'keys')}")  # False

my_dict = {'a': 1, 'b': 2}
print(f"dict 有'keys'方法: {hasattr(my_dict, 'keys')}")  # True
print(f"dict 有'append'方法: {hasattr(my_dict, 'append')}")  # False
```

### 安全的属性访问

```python
## 安全的属性访问模式
class SafeAttributeAccess:
    """安全属性访问示例"""
    
    @staticmethod
    def safe_get_attribute(obj, attr_name, default=None):
        """安全获取属性值"""
        if hasattr(obj, attr_name):
            return getattr(obj, attr_name)
        return default
    
    @staticmethod
    def safe_call_method(obj, method_name, *args, **kwargs):
        """安全调用方法"""
        if hasattr(obj, method_name):
            method = getattr(obj, method_name)
            if callable(method):
                try:
                    return method(*args, **kwargs)
                except Exception as e:
                    print(f"调用方法{method_name}时出错: {e}")
                    return None
            else:
                print(f"{method_name}不是可调用的方法")
                return None
        else:
            print(f"对象没有{method_name}方法")
            return None
    
    @staticmethod
    def check_interface(obj, required_methods):
        """检查对象是否实现了指定的接口"""
        missing_methods = []
        for method_name in required_methods:
            if not hasattr(obj, method_name):
                missing_methods.append(method_name)
            elif not callable(getattr(obj, method_name)):
                missing_methods.append(f"{method_name}(不可调用)")
        
        return len(missing_methods) == 0, missing_methods

## 测试安全属性访问
print("\n 安全属性访问示例:")

## 创建测试对象
class TestObject:
    def __init__(self):
        self.value = 42
        self.name = "测试对象"
    
    def get_value(self):
        return self.value
    
    def set_value(self, new_value):
        self.value = new_value
        return f"值已设置为{new_value}"

test_obj = TestObject()

## 安全获取属性
print(f"安全获取'value': {SafeAttributeAccess.safe_get_attribute(test_obj, 'value')}")
print(f"安全获取'missing': {SafeAttributeAccess.safe_get_attribute(test_obj, 'missing', '默认值')}")

## 安全调用方法
print(f"安全调用'get_value': {SafeAttributeAccess.safe_call_method(test_obj, 'get_value')}")
print(f"安全调用'set_value': {SafeAttributeAccess.safe_call_method(test_obj, 'set_value', 100)}")
print(f"安全调用'missing_method': {SafeAttributeAccess.safe_call_method(test_obj, 'missing_method')}")

## 接口检查
required_interface = ['get_value', 'set_value', 'get_name']
is_compatible, missing = SafeAttributeAccess.check_interface(test_obj, required_interface)
print(f"\n 接口兼容性检查:")
print(f"  兼容: {is_compatible}")
print(f"  缺失方法: {missing}")

## 完整接口检查
complete_interface = ['get_value', 'set_value']
is_compatible, missing = SafeAttributeAccess.check_interface(test_obj, complete_interface)
print(f"\n 完整接口检查:")
print(f"  兼容: {is_compatible}")
print(f"  缺失方法: {missing}")
```

### 动态属性检查

```python
## 动态属性检查和处理
class DynamicAttributeHandler:
    """动态属性处理器"""
    
    def __init__(self):
        self._dynamic_attrs = {}
    
    def __getattr__(self, name):
        """动态获取属性"""
        if name in self._dynamic_attrs:
            return self._dynamic_attrs[name]
        raise AttributeError(f"'{type(self).__name__}'对象没有属性'{name}'")
    
    def __setattr__(self, name, value):
        """动态设置属性"""
        if name.startswith('_'):
#            # 私有属性直接设置
            super().__setattr__(name, value)
        else:
#            # 公共属性存储在动态字典中
            if not hasattr(self, '_dynamic_attrs'):
                super().__setattr__('_dynamic_attrs', {})
            self._dynamic_attrs[name] = value
    
    def has_dynamic_attr(self, name):
        """检查是否有动态属性"""
        return name in getattr(self, '_dynamic_attrs', {})
    
    def list_dynamic_attrs(self):
        """列出所有动态属性"""
        return list(getattr(self, '_dynamic_attrs', {}).keys())
    
    def remove_dynamic_attr(self, name):
        """删除动态属性"""
        if self.has_dynamic_attr(name):
            del self._dynamic_attrs[name]
            return True
        return False

## 测试动态属性处理
print("\n 动态属性处理示例:")

dynamic_obj = DynamicAttributeHandler()

## 检查初始状态
print(f"初始状态:")
print(f"  有'name'属性: {hasattr(dynamic_obj, 'name')}")
print(f"  有'value'属性: {hasattr(dynamic_obj, 'value')}")
print(f"  动态属性列表: {dynamic_obj.list_dynamic_attrs()}")

## 动态添加属性
dynamic_obj.name = "动态对象"
dynamic_obj.value = 123
dynamic_obj.description = "这是一个动态属性示例"

print(f"\n 添加属性后:")
print(f"  有'name'属性: {hasattr(dynamic_obj, 'name')}")
print(f"  有'value'属性: {hasattr(dynamic_obj, 'value')}")
print(f"  有'description'属性: {hasattr(dynamic_obj, 'description')}")
print(f"  有'missing'属性: {hasattr(dynamic_obj, 'missing')}")
print(f"  动态属性列表: {dynamic_obj.list_dynamic_attrs()}")

## 访问属性
print(f"\n 属性值:")
print(f"  name: {dynamic_obj.name}")
print(f"  value: {dynamic_obj.value}")
print(f"  description: {dynamic_obj.description}")

## 删除属性
removed = dynamic_obj.remove_dynamic_attr('description')
print(f"\n 删除'description'属性: {removed}")
print(f"  有'description'属性: {hasattr(dynamic_obj, 'description')}")
print(f"  动态属性列表: {dynamic_obj.list_dynamic_attrs()}")

## 属性检查函数
def analyze_object_attributes(obj, show_private=False, show_methods=True):
    """分析对象的所有属性"""
    print(f"\n 对象 {type(obj).__name__} 的属性分析:")
    
#    # 获取所有属性名
    all_attrs = dir(obj)
    
#    # 分类属性
    public_attrs = []
    private_attrs = []
    methods = []
    properties = []
    
    for attr_name in all_attrs:
#        # 跳过私有属性(如果不显示)
        if not show_private and attr_name.startswith('_'):
            continue
        
        if hasattr(obj, attr_name):
            attr_value = getattr(obj, attr_name)
            
            if callable(attr_value):
                methods.append(attr_name)
            elif isinstance(attr_value, property):
                properties.append(attr_name)
            elif attr_name.startswith('_'):
                private_attrs.append(attr_name)
            else:
                public_attrs.append(attr_name)
    
#    # 显示结果
    print(f"  公共属性 ({len(public_attrs)}): {public_attrs}")
    
    if show_private:
        print(f"  私有属性 ({len(private_attrs)}): {private_attrs}")
    
    if show_methods:
        print(f"  方法 ({len(methods)}): {methods[:10]}{'...' if len(methods) > 10 else ''}")
    
    if properties:
        print(f"  属性装饰器 ({len(properties)}): {properties}")

## 分析不同类型的对象
test_objects = [
    person,
    dynamic_obj,
    [1, 2, 3],
    {'a': 1, 'b': 2},
    "hello world"
]

for obj in test_objects:
    analyze_object_attributes(obj, show_private=False, show_methods=True)
```

## 🚀 高级应用

### 插件系统中的属性检查

```python
from abc import ABC, abstractmethod
from typing import List, Dict, Any

## 插件接口定义
class PluginInterface(ABC):
    """插件接口"""
    
    @property
    @abstractmethod
    def name(self) -> str:
        """插件名称"""
        pass
    
    @property
    @abstractmethod
    def version(self) -> str:
        """插件版本"""
        pass
    
    @abstractmethod
    def initialize(self) -> bool:
        """初始化插件"""
        pass
    
    @abstractmethod
    def execute(self, *args, **kwargs) -> Any:
        """执行插件功能"""
        pass
    
    def cleanup(self):
        """清理资源(可选)"""
        pass

## 插件验证器
class PluginValidator:
    """插件验证器"""
    
#    # 必需的属性和方法
    REQUIRED_ATTRIBUTES = ['name', 'version']
    REQUIRED_METHODS = ['initialize', 'execute']
    OPTIONAL_METHODS = ['cleanup', 'configure']
    
    @classmethod
    def validate_plugin(cls, plugin_obj) -> tuple[bool, List[str]]:
        """验证插件对象"""
        errors = []
        
#        # 检查必需属性
        for attr in cls.REQUIRED_ATTRIBUTES:
            if not hasattr(plugin_obj, attr):
                errors.append(f"缺少必需属性: {attr}")
            else:
                attr_value = getattr(plugin_obj, attr)
                if not isinstance(attr_value, str) or not attr_value.strip():
                    errors.append(f"属性{attr}必须是非空字符串")
        
#        # 检查必需方法
        for method in cls.REQUIRED_METHODS:
            if not hasattr(plugin_obj, method):
                errors.append(f"缺少必需方法: {method}")
            elif not callable(getattr(plugin_obj, method)):
                errors.append(f"{method}必须是可调用的方法")
        
#        # 检查可选方法(如果存在)
        for method in cls.OPTIONAL_METHODS:
            if hasattr(plugin_obj, method) and not callable(getattr(plugin_obj, method)):
                errors.append(f"{method}存在但不可调用")
        
        return len(errors) == 0, errors
    
    @classmethod
    def get_plugin_info(cls, plugin_obj) -> Dict[str, Any]:
        """获取插件信息"""
        info = {
            'type': type(plugin_obj).__name__,
            'module': type(plugin_obj).__module__,
        }
        
#        # 基本属性
        for attr in cls.REQUIRED_ATTRIBUTES:
            if hasattr(plugin_obj, attr):
                info[attr] = getattr(plugin_obj, attr)
        
#        # 方法检查
        available_methods = []
        for method in cls.REQUIRED_METHODS + cls.OPTIONAL_METHODS:
            if hasattr(plugin_obj, method) and callable(getattr(plugin_obj, method)):
                available_methods.append(method)
        
        info['available_methods'] = available_methods
        
#        # 额外属性
        extra_attrs = []
        for attr_name in dir(plugin_obj):
            if (not attr_name.startswith('_') and 
                attr_name not in cls.REQUIRED_ATTRIBUTES and 
                attr_name not in cls.REQUIRED_METHODS + cls.OPTIONAL_METHODS and
                hasattr(plugin_obj, attr_name)):
                
                attr_value = getattr(plugin_obj, attr_name)
                if not callable(attr_value):
                    extra_attrs.append(attr_name)
        
        info['extra_attributes'] = extra_attrs
        
        return info

## 具体插件实现
class TextProcessorPlugin(PluginInterface):
    """文本处理插件"""
    
    def __init__(self):
        self._initialized = False
        self.config = {}
    
    @property
    def name(self) -> str:
        return "Text Processor"
    
    @property
    def version(self) -> str:
        return "1.0.0"
    
    def initialize(self) -> bool:
        """初始化插件"""
        self._initialized = True
        return True
    
    def execute(self, text: str, operation: str = "upper") -> str:
        """执行文本处理"""
        if not self._initialized:
            raise RuntimeError("插件未初始化")
        
        if operation == "upper":
            return text.upper()
        elif operation == "lower":
            return text.lower()
        elif operation == "title":
            return text.title()
        else:
            return text
    
    def configure(self, **kwargs):
        """配置插件"""
        self.config.update(kwargs)
    
    def cleanup(self):
        """清理资源"""
        self._initialized = False
        self.config.clear()

class CalculatorPlugin(PluginInterface):
    """计算器插件"""
    
    @property
    def name(self) -> str:
        return "Calculator"
    
    @property
    def version(self) -> str:
        return "2.1.0"
    
    def initialize(self) -> bool:
        return True
    
    def execute(self, operation: str, *args) -> float:
        """执行计算"""
        if operation == "add":
            return sum(args)
        elif operation == "multiply":
            result = 1
            for arg in args:
                result *= arg
            return result
        else:
            raise ValueError(f"不支持的操作: {operation}")

## 不完整的插件(用于测试)
class IncompletePlugin:
    """不完整的插件"""
    
    @property
    def name(self) -> str:
        return "Incomplete Plugin"
    
#    # 缺少 version 属性和必需方法
    
    def some_method(self):
        return "这是一个方法"

## 插件管理器
class PluginManager:
    """插件管理器"""
    
    def __init__(self):
        self._plugins: Dict[str, PluginInterface] = {}
    
    def register_plugin(self, plugin_obj) -> bool:
        """注册插件"""
#        # 验证插件
        is_valid, errors = PluginValidator.validate_plugin(plugin_obj)
        
        if not is_valid:
            print(f"插件验证失败:")
            for error in errors:
                print(f"  - {error}")
            return False
        
#        # 获取插件信息
        plugin_info = PluginValidator.get_plugin_info(plugin_obj)
        plugin_name = plugin_info['name']
        
#        # 检查是否已存在
        if plugin_name in self._plugins:
            print(f"警告: 插件'{plugin_name}'已存在,将被替换")
        
#        # 初始化插件
        if hasattr(plugin_obj, 'initialize'):
            try:
                if not plugin_obj.initialize():
                    print(f"插件'{plugin_name}'初始化失败")
                    return False
            except Exception as e:
                print(f"插件'{plugin_name}'初始化时出错: {e}")
                return False
        
#        # 注册插件
        self._plugins[plugin_name] = plugin_obj
        print(f"成功注册插件: {plugin_name} v{plugin_info['version']}")
        
        return True
    
    def list_plugins(self):
        """列出所有插件"""
        print(f"\n 已注册的插件 ({len(self._plugins)})个:")
        for name, plugin in self._plugins.items():
            info = PluginValidator.get_plugin_info(plugin)
            print(f"\n  {name} v{info['version']}:")
            print(f"    类型: {info['type']}")
            print(f"    可用方法: {', '.join(info['available_methods'])}")
            if info['extra_attributes']:
                print(f"    额外属性: {', '.join(info['extra_attributes'])}")
    
    def execute_plugin(self, plugin_name: str, *args, **kwargs):
        """执行插件"""
        if plugin_name not in self._plugins:
            raise KeyError(f"未找到插件: {plugin_name}")
        
        plugin = self._plugins[plugin_name]
        return plugin.execute(*args, **kwargs)

## 测试插件系统
print("插件系统示例:")

## 创建插件管理器
manager = PluginManager()

## 测试插件
test_plugins = [
    TextProcessorPlugin(),
    CalculatorPlugin(),
    IncompletePlugin()  # 这个会失败
]

## 注册插件
for plugin in test_plugins:
    print(f"\n 注册插件 {type(plugin).__name__}:")
    success = manager.register_plugin(plugin)
    print(f"注册结果: {'成功' if success else '失败'}")

## 列出插件
manager.list_plugins()

## 执行插件
print(f"\n 执行插件:")
try:
    result1 = manager.execute_plugin("Text Processor", "hello world", "title")
    print(f"文本处理结果: {result1}")
    
    result2 = manager.execute_plugin("Calculator", "add", 1, 2, 3, 4, 5)
    print(f"计算结果: {result2}")
    
    result3 = manager.execute_plugin("Calculator", "multiply", 2, 3, 4)
    print(f"乘法结果: {result3}")
    
except Exception as e:
    print(f"执行插件时出错: {e}")
```

### API 兼容性检查

```python
import inspect
from typing import List, Dict, Callable, Any
from functools import wraps

## API 兼容性检查器
class APICompatibilityChecker:
    """API 兼容性检查器"""
    
    @staticmethod
    def check_method_signature(obj, method_name: str, expected_params: List[str]) -> tuple[bool, str]:
        """检查方法签名"""
        if not hasattr(obj, method_name):
            return False, f"缺少方法: {method_name}"
        
        method = getattr(obj, method_name)
        if not callable(method):
            return False, f"{method_name}不是可调用的方法"
        
        try:
            sig = inspect.signature(method)
            actual_params = list(sig.parameters.keys())
            
#            # 移除 self 参数(如果存在)
            if actual_params and actual_params[0] in ['self', 'cls']:
                actual_params = actual_params[1:]
            
#            # 检查参数
            missing_params = [p for p in expected_params if p not in actual_params]
            if missing_params:
                return False, f"方法{method_name}缺少参数: {missing_params}"
            
            return True, "签名兼容"
            
        except Exception as e:
            return False, f"检查方法{method_name}签名时出错: {e}"
    
    @staticmethod
    def check_api_compatibility(obj, api_spec: Dict[str, Any]) -> Dict[str, Any]:
        """检查 API 兼容性"""
        results = {
            'compatible': True,
            'errors': [],
            'warnings': [],
            'details': {}
        }
        
#        # 检查必需属性
        required_attrs = api_spec.get('required_attributes', [])
        for attr_name in required_attrs:
            if hasattr(obj, attr_name):
                results['details'][f'attr_{attr_name}'] = '✓ 存在'
            else:
                results['compatible'] = False
                results['errors'].append(f"缺少必需属性: {attr_name}")
                results['details'][f'attr_{attr_name}'] = '✗ 缺失'
        
#        # 检查必需方法
        required_methods = api_spec.get('required_methods', {})
        for method_name, expected_params in required_methods.items():
            is_compatible, message = APICompatibilityChecker.check_method_signature(
                obj, method_name, expected_params
            )
            
            if is_compatible:
                results['details'][f'method_{method_name}'] = f'✓ {message}'
            else:
                results['compatible'] = False
                results['errors'].append(message)
                results['details'][f'method_{method_name}'] = f'✗ {message}'
        
#        # 检查可选方法
        optional_methods = api_spec.get('optional_methods', {})
        for method_name, expected_params in optional_methods.items():
            if hasattr(obj, method_name):
                is_compatible, message = APICompatibilityChecker.check_method_signature(
                    obj, method_name, expected_params
                )
                
                if is_compatible:
                    results['details'][f'optional_{method_name}'] = f'✓ {message}'
                else:
                    results['warnings'].append(f"可选方法{method_name}签名不兼容: {message}")
                    results['details'][f'optional_{method_name}'] = f'⚠ {message}'
            else:
                results['details'][f'optional_{method_name}'] = '- 未实现'
        
        return results

## API 规范定义
FILE_PROCESSOR_API = {
    'required_attributes': ['name', 'supported_extensions'],
    'required_methods': {
        'process_file': ['file_path'],
        'validate_file': ['file_path'],
    },
    'optional_methods': {
        'get_metadata': ['file_path'],
        'configure': ['options'],
        'cleanup': [],
    }
}

DATA_VALIDATOR_API = {
    'required_attributes': ['validator_name'],
    'required_methods': {
        'validate': ['data'],
        'get_errors': [],
    },
    'optional_methods': {
        'set_rules': ['rules'],
        'reset': [],
    }
}

## 实现示例
class TextFileProcessor:
    """文本文件处理器(完整实现)"""
    
    def __init__(self):
        self.name = "Text File Processor"
        self.supported_extensions = ['.txt', '.md', '.log']
        self._processed_count = 0
    
    def process_file(self, file_path: str) -> str:
        """处理文件"""
        self._processed_count += 1
        return f"已处理文件: {file_path}"
    
    def validate_file(self, file_path: str) -> bool:
        """验证文件"""
        return any(file_path.endswith(ext) for ext in self.supported_extensions)
    
    def get_metadata(self, file_path: str) -> Dict[str, Any]:
        """获取文件元数据"""
        return {
            'processor': self.name,
            'file_path': file_path,
            'processed_count': self._processed_count
        }
    
    def configure(self, options: Dict[str, Any]):
        """配置处理器"""
        if 'extensions' in options:
            self.supported_extensions = options['extensions']

class ImageFileProcessor:
    """图像文件处理器(部分实现)"""
    
    def __init__(self):
        self.name = "Image File Processor"
        self.supported_extensions = ['.jpg', '.png', '.gif']
    
    def process_file(self, file_path: str, quality: int = 80) -> str:
        """处理文件(参数不匹配)"""
        return f"已处理图像: {file_path}"
    
#    # 缺少 validate_file 方法
    
    def get_metadata(self, file_path: str) -> Dict[str, Any]:
        """获取文件元数据"""
        return {
            'processor': self.name,
            'file_path': file_path,
            'type': 'image'
        }

class EmailValidator:
    """邮箱验证器(完整实现)"""
    
    def __init__(self):
        self.validator_name = "Email Validator"
        self._errors = []
    
    def validate(self, data: str) -> bool:
        """验证邮箱"""
        self._errors.clear()
        
        if not isinstance(data, str):
            self._errors.append("数据必须是字符串")
            return False
        
        if '@' not in data:
            self._errors.append("缺少@符号")
            return False
        
        if '.' not in data.split('@')[1]:
            self._errors.append("域名格式不正确")
            return False
        
        return True
    
    def get_errors(self) -> List[str]:
        """获取错误信息"""
        return self._errors.copy()
    
    def set_rules(self, rules: Dict[str, Any]):
        """设置验证规则"""
#        # 实现规则设置逻辑
        pass
    
    def reset(self):
        """重置验证器"""
        self._errors.clear()

class IncompleteValidator:
    """不完整的验证器"""
    
    def __init__(self):
#        # 缺少 validator_name 属性
        pass
    
    def validate(self, data: str, strict: bool = True) -> bool:
        """验证数据(参数不匹配)"""
        return True
    
#    # 缺少 get_errors 方法

## 兼容性检查装饰器
def require_api_compatibility(api_spec: Dict[str, Any]):
    """API 兼容性检查装饰器"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(obj, *args, **kwargs):
#            # 检查 API 兼容性
            results = APICompatibilityChecker.check_api_compatibility(obj, api_spec)
            
            if not results['compatible']:
                error_msg = "API 兼容性检查失败:\n" + "\n".join(results['errors'])
                raise TypeError(error_msg)
            
#            # 如果有警告,打印出来
            if results['warnings']:
                print("API 兼容性警告:")
                for warning in results['warnings']:
                    print(f"  - {warning}")
            
            return func(obj, *args, **kwargs)
        return wrapper
    return decorator

## 使用装饰器的函数
@require_api_compatibility(FILE_PROCESSOR_API)
def process_with_file_processor(processor, file_path: str):
    """使用文件处理器处理文件"""
    if processor.validate_file(file_path):
        result = processor.process_file(file_path)
        if hasattr(processor, 'get_metadata'):
            metadata = processor.get_metadata(file_path)
            return result, metadata
        return result, None
    else:
        raise ValueError(f"不支持的文件类型: {file_path}")

@require_api_compatibility(DATA_VALIDATOR_API)
def validate_with_validator(validator, data: Any):
    """使用验证器验证数据"""
    is_valid = validator.validate(data)
    errors = validator.get_errors()
    return is_valid, errors

## 测试 API 兼容性
print("\nAPI 兼容性检查示例:")

## 测试对象
test_processors = [
    ("TextFileProcessor", TextFileProcessor(), FILE_PROCESSOR_API),
    ("ImageFileProcessor", ImageFileProcessor(), FILE_PROCESSOR_API),
]

test_validators = [
    ("EmailValidator", EmailValidator(), DATA_VALIDATOR_API),
    ("IncompleteValidator", IncompleteValidator(), DATA_VALIDATOR_API),
]

## 检查文件处理器
print("文件处理器兼容性检查:")
for name, processor, api_spec in test_processors:
    print(f"\n{name}:")
    results = APICompatibilityChecker.check_api_compatibility(processor, api_spec)
    
    print(f"  兼容性: {'✓ 兼容' if results['compatible'] else '✗ 不兼容'}")
    
    if results['errors']:
        print(f"  错误:")
        for error in results['errors']:
            print(f"    - {error}")
    
    if results['warnings']:
        print(f"  警告:")
        for warning in results['warnings']:
            print(f"    - {warning}")
    
    print(f"  详细信息:")
    for key, value in results['details'].items():
        print(f"    {key}: {value}")

## 检查验证器
print(f"\n 验证器兼容性检查:")
for name, validator, api_spec in test_validators:
    print(f"\n{name}:")
    results = APICompatibilityChecker.check_api_compatibility(validator, api_spec)
    
    print(f"  兼容性: {'✓ 兼容' if results['compatible'] else '✗ 不兼容'}")
    
    if results['errors']:
        print(f"  错误:")
        for error in results['errors']:
            print(f"    - {error}")
    
    print(f"  详细信息:")
    for key, value in results['details'].items():
        print(f"    {key}: {value}")

## 测试装饰器
print(f"\n 装饰器测试:")

## 兼容的处理器
try:
    text_processor = TextFileProcessor()
    result = process_with_file_processor(text_processor, "test.txt")
    print(f"文本处理器测试成功: {result[0]}")
except Exception as e:
    print(f"文本处理器测试失败: {e}")

## 不兼容的处理器
try:
    image_processor = ImageFileProcessor()
    result = process_with_file_processor(image_processor, "test.jpg")
except Exception as e:
    print(f"图像处理器测试失败(预期): {e}")

## 兼容的验证器
try:
    email_validator = EmailValidator()
    result = validate_with_validator(email_validator, "test@example.com")
    print(f"邮箱验证器测试成功: 有效={result[0]}, 错误={result[1]}")
except Exception as e:
    print(f"邮箱验证器测试失败: {e}")

## 不兼容的验证器
try:
    incomplete_validator = IncompleteValidator()
    result = validate_with_validator(incomplete_validator, "test data")
except Exception as e:
    print(f"不完整验证器测试失败(预期): {e}")
```

### 配置系统中的属性检查

```python
import json
import os
from typing import Any, Dict, List, Union, Optional
from dataclasses import dataclass, field
from pathlib import Path

## 配置项定义
@dataclass
class ConfigItem:
    """配置项定义"""
    name: str
    required: bool = True
    default: Any = None
    validator: Optional[callable] = None
    description: str = ""

## 配置验证器
class ConfigValidator:
    """配置验证器"""
    
    @staticmethod
    def validate_string(value: Any, min_length: int = 0, max_length: int = None) -> bool:
        """验证字符串"""
        if not isinstance(value, str):
            return False
        if len(value) < min_length:
            return False
        if max_length is not None and len(value) > max_length:
            return False
        return True
    
    @staticmethod
    def validate_integer(value: Any, min_val: int = None, max_val: int = None) -> bool:
        """验证整数"""
        if not isinstance(value, int):
            return False
        if min_val is not None and value < min_val:
            return False
        if max_val is not None and value > max_val:
            return False
        return True
    
    @staticmethod
    def validate_list(value: Any, item_type: type = None, min_items: int = 0) -> bool:
        """验证列表"""
        if not isinstance(value, list):
            return False
        if len(value) < min_items:
            return False
        if item_type is not None:
            return all(isinstance(item, item_type) for item in value)
        return True
    
    @staticmethod
    def validate_email(value: Any) -> bool:
        """验证邮箱"""
        if not isinstance(value, str):
            return False
        return '@' in value and '.' in value.split('@')[1]
    
    @staticmethod
    def validate_url(value: Any) -> bool:
        """验证 URL"""
        if not isinstance(value, str):
            return False
        return value.startswith(('http://', 'https://'))

## 配置管理器
class ConfigManager:
    """配置管理器"""
    
    def __init__(self, config_schema: List[ConfigItem]):
        self.schema = {item.name: item for item in config_schema}
        self.config_data = {}
        self.validation_errors = []
    
    def load_from_dict(self, data: Dict[str, Any]) -> bool:
        """从字典加载配置"""
        self.config_data = data.copy()
        return self.validate_config()
    
    def load_from_file(self, file_path: Union[str, Path]) -> bool:
        """从文件加载配置"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return self.load_from_dict(data)
        except Exception as e:
            self.validation_errors.append(f"加载配置文件失败: {e}")
            return False
    
    def load_from_object(self, obj: Any) -> bool:
        """从对象加载配置"""
        data = {}
        
#        # 提取对象的属性
        for item_name in self.schema.keys():
            if hasattr(obj, item_name):
                data[item_name] = getattr(obj, item_name)
        
        return self.load_from_dict(data)
    
    def validate_config(self) -> bool:
        """验证配置"""
        self.validation_errors.clear()
        
#        # 检查必需项
        for item_name, item_def in self.schema.items():
            if item_def.required and item_name not in self.config_data:
#                # 检查是否有默认值
                if item_def.default is not None:
                    self.config_data[item_name] = item_def.default
                else:
                    self.validation_errors.append(f"缺少必需配置项: {item_name}")
                    continue
            
#            # 验证值
            if item_name in self.config_data:
                value = self.config_data[item_name]
                if item_def.validator and not item_def.validator(value):
                    self.validation_errors.append(
                        f"配置项{item_name}验证失败: {value}"
                    )
        
        return len(self.validation_errors) == 0
    
    def get_config(self, name: str, default: Any = None) -> Any:
        """获取配置值"""
        return self.config_data.get(name, default)
    
    def set_config(self, name: str, value: Any) -> bool:
        """设置配置值"""
        if name not in self.schema:
            return False
        
        item_def = self.schema[name]
        if item_def.validator and not item_def.validator(value):
            return False
        
        self.config_data[name] = value
        return True
    
    def get_validation_errors(self) -> List[str]:
        """获取验证错误"""
        return self.validation_errors.copy()
    
    def get_config_summary(self) -> Dict[str, Any]:
        """获取配置摘要"""
        summary = {
            'total_items': len(self.schema),
            'configured_items': len(self.config_data),
            'missing_required': [],
            'validation_status': len(self.validation_errors) == 0,
            'items': {}
        }
        
        for item_name, item_def in self.schema.items():
            item_info = {
                'required': item_def.required,
                'has_value': item_name in self.config_data,
                'has_default': item_def.default is not None,
                'description': item_def.description
            }
            
            if item_name in self.config_data:
                item_info['value'] = self.config_data[item_name]
            elif item_def.default is not None:
                item_info['default_value'] = item_def.default
            
            if item_def.required and item_name not in self.config_data and item_def.default is None:
                summary['missing_required'].append(item_name)
            
            summary['items'][item_name] = item_info
        
        return summary

## 应用配置示例
class ApplicationConfig:
    """应用配置类"""
    
    def __init__(self):
#        # 定义配置模式
        self.schema = [
            ConfigItem(
                name="app_name",
                required=True,
                validator=lambda x: ConfigValidator.validate_string(x, min_length=1),
                description="应用程序名称"
            ),
            ConfigItem(
                name="version",
                required=True,
                default="1.0.0",
                validator=lambda x: ConfigValidator.validate_string(x, min_length=1),
                description="应用程序版本"
            ),
            ConfigItem(
                name="debug",
                required=False,
                default=False,
                validator=lambda x: isinstance(x, bool),
                description="调试模式"
            ),
            ConfigItem(
                name="port",
                required=True,
                default=8080,
                validator=lambda x: ConfigValidator.validate_integer(x, min_val=1, max_val=65535),
                description="服务端口"
            ),
            ConfigItem(
                name="database_url",
                required=True,
                validator=lambda x: ConfigValidator.validate_string(x, min_length=10),
                description="数据库连接 URL"
            ),
            ConfigItem(
                name="admin_email",
                required=True,
                validator=ConfigValidator.validate_email,
                description="管理员邮箱"
            ),
            ConfigItem(
                name="allowed_hosts",
                required=False,
                default=["localhost", "127.0.0.1"],
                validator=lambda x: ConfigValidator.validate_list(x, str, min_items=1),
                description="允许的主机列表"
            ),
            ConfigItem(
                name="api_url",
                required=False,
                validator=ConfigValidator.validate_url,
                description="API 服务 URL"
            )
        ]
        
        self.manager = ConfigManager(self.schema)
    
    def load_config(self, source: Union[str, Dict, Any]) -> bool:
        """加载配置"""
        if isinstance(source, str):
#            # 从文件加载
            return self.manager.load_from_file(source)
        elif isinstance(source, dict):
#            # 从字典加载
            return self.manager.load_from_dict(source)
        else:
#            # 从对象加载
            return self.manager.load_from_object(source)
    
    def get_config_value(self, name: str, default: Any = None) -> Any:
        """获取配置值"""
        return self.manager.get_config(name, default)
    
    def print_config_status(self):
        """打印配置状态"""
        summary = self.manager.get_config_summary()
        
        print(f"配置状态摘要:")
        print(f"  总配置项: {summary['total_items']}")
        print(f"  已配置项: {summary['configured_items']}")
        print(f"  验证状态: {'✓ 通过' if summary['validation_status'] else '✗ 失败'}")
        
        if summary['missing_required']:
            print(f"  缺少必需项: {summary['missing_required']}")
        
        errors = self.manager.get_validation_errors()
        if errors:
            print(f"  验证错误:")
            for error in errors:
                print(f"    - {error}")
        
        print(f"\n 详细配置:")
        for item_name, item_info in summary['items'].items():
            status = "✓" if item_info['has_value'] else ("D" if item_info['has_default'] else "✗")
            required_mark = "*" if item_info['required'] else " "
            
            print(f"  {status} {required_mark} {item_name}: ", end="")
            
            if item_info['has_value']:
                print(f"{item_info['value']}")
            elif item_info['has_default']:
                print(f"(默认: {item_info['default_value']})")
            else:
                print("未设置")
            
            if item_info['description']:
                print(f"      {item_info['description']}")

## 测试配置系统
print("\n 配置系统示例:")

## 创建应用配置
app_config = ApplicationConfig()

## 测试不同的配置源
test_configs = [
    {
        'name': '完整配置',
        'data': {
            "app_name": "My Application",
            "version": "2.0.0",
            "debug": True,
            "port": 9000,
            "database_url": "postgresql://user:pass@localhost/db",
            "admin_email": "admin@example.com",
            "allowed_hosts": ["localhost", "example.com"],
            "api_url": "https://api.example.com"
        }
    },
    {
        'name': '最小配置',
        'data': {
            "app_name": "Minimal App",
            "database_url": "sqlite:///app.db",
            "admin_email": "admin@minimal.com"
        }
    },
    {
        'name': '无效配置',
        'data': {
            "app_name": "",  # 空字符串,无效
            "port": 99999,  # 端口超出范围
            "admin_email": "invalid-email",  # 无效邮箱
            "allowed_hosts": []  # 空列表,无效
        }
    }
]

## 测试配置对象
class ConfigObject:
    """配置对象示例"""
    def __init__(self):
        self.app_name = "Object Config App"
        self.database_url = "mysql://user:pass@localhost/db"
        self.admin_email = "admin@object.com"
        self.debug = True
        self.extra_setting = "这个不在 schema 中"  # 这个会被忽略

## 添加对象配置测试
test_configs.append({
    'name': '对象配置',
    'data': ConfigObject()
})

## 测试所有配置
for test_config in test_configs:
    print(f"\n{'='*50}")
    print(f"测试: {test_config['name']}")
    print(f"{'='*50}")
    
#    # 加载配置
    success = app_config.load_config(test_config['data'])
    print(f"加载结果: {'成功' if success else '失败'}")
    
#    # 打印配置状态
    app_config.print_config_status()
    
#    # 如果加载成功,展示一些配置值的使用
    if success:
        print(f"\n 配置使用示例:")
        print(f"  应用名称: {app_config.get_config_value('app_name')}")
        print(f"  运行端口: {app_config.get_config_value('port')}")
        print(f"  调试模式: {app_config.get_config_value('debug')}")
        print(f"  允许主机: {app_config.get_config_value('allowed_hosts')}")

## 动态配置检查示例
print(f"\n{'='*50}")
print(f"动态配置检查示例")
print(f"{'='*50}")

## 检查运行时对象是否具有配置所需的属性
class RuntimeObject:
    """运行时对象"""
    def __init__(self):
        self.name = "Runtime Object"
        self.settings = {"key": "value"}
    
    def get_status(self):
        return "running"

runtime_obj = RuntimeObject()

## 检查对象是否具有配置相关的属性
config_attributes = ['name', 'settings', 'version', 'config']

print(f"运行时对象属性检查:")
for attr in config_attributes:
    has_attr = hasattr(runtime_obj, attr)
    print(f"  {attr}: {'✓ 存在' if has_attr else '✗ 不存在'}")
    
    if has_attr:
        value = getattr(runtime_obj, attr)
        print(f"    值: {value} (类型: {type(value).__name__})")

## 安全的配置属性访问
print(f"\n 安全的配置属性访问:")
for attr in config_attributes:
    value = getattr(runtime_obj, attr, "未设置")
    print(f"  {attr}: {value}")
```

## ⚠️ 常见陷阱与最佳实践

### 错误处理和边界情况

```python
## 常见错误和解决方案

## 错误 1:属性名拼写错误
class SpellingErrorDemo:
    def __init__(self):
        self.correct_name = "正确的属性名"

obj = SpellingErrorDemo()

## 错误的检查
print("拼写错误示例:")
print(f"检查'corect_name': {hasattr(obj, 'corect_name')}")  # False,拼写错误
print(f"检查'correct_name': {hasattr(obj, 'correct_name')}")  # True,正确拼写

## 最佳实践:使用常量定义属性名
class AttributeNames:
    """属性名常量"""
    CORRECT_NAME = 'correct_name'
    VALUE = 'value'
    STATUS = 'status'

print(f"使用常量检查: {hasattr(obj, AttributeNames.CORRECT_NAME)}")

## 错误 2:忽略异常情况
class ProblematicClass:
    """有问题的类"""
    
    @property
    def problematic_property(self):
        """会抛出异常的属性"""
        raise RuntimeError("属性访问失败")
    
    def __getattr__(self, name):
        """动态属性访问"""
        if name == 'dynamic_error':
            raise ValueError("动态属性错误")
        raise AttributeError(f"没有属性 {name}")

problematic_obj = ProblematicClass()

print("\n 异常处理示例:")
## hasattr 会捕获 AttributeError,但不会捕获其他异常
try:
    result = hasattr(problematic_obj, 'problematic_property')
    print(f"检查 problematic_property: {result}")  # 可能会抛出 RuntimeError
except Exception as e:
    print(f"检查时出错: {e}")

## 安全的属性检查
def safe_hasattr(obj, attr_name):
    """安全的属性检查"""
    try:
        return hasattr(obj, attr_name)
    except Exception as e:
        print(f"检查属性{attr_name}时出错: {e}")
        return False

print(f"安全检查 problematic_property: {safe_hasattr(problematic_obj, 'problematic_property')}")
print(f"安全检查 dynamic_error: {safe_hasattr(problematic_obj, 'dynamic_error')}")
print(f"安全检查 normal_attr: {safe_hasattr(problematic_obj, 'normal_attr')}")

## 错误 3:性能问题
import time

class PerformanceTestClass:
    """性能测试类"""
    
    def __init__(self):
#        # 创建大量属性
        for i in range(1000):
            setattr(self, f'attr_{i}', i)
    
    def __getattr__(self, name):
        """模拟慢速属性访问"""
        time.sleep(0.001)  # 模拟 1ms 延迟
        raise AttributeError(f"没有属性 {name}")

perf_obj = PerformanceTestClass()

## 性能对比
print("\n 性能测试:")

## 测试存在的属性
start_time = time.time()
for i in range(100):
    hasattr(perf_obj, 'attr_500')
existing_time = time.time() - start_time

## 测试不存在的属性
start_time = time.time()
for i in range(100):
    hasattr(perf_obj, 'nonexistent_attr')
nonexistent_time = time.time() - start_time

print(f"检查存在属性 100 次耗时: {existing_time:.4f}秒")
print(f"检查不存在属性 100 次耗时: {nonexistent_time:.4f}秒")

## 最佳实践:缓存属性检查结果
class CachedAttributeChecker:
    """缓存属性检查器"""
    
    def __init__(self):
        self._attr_cache = {}
    
    def cached_hasattr(self, obj, attr_name):
        """缓存的属性检查"""
        obj_id = id(obj)
        cache_key = (obj_id, attr_name)
        
        if cache_key not in self._attr_cache:
            self._attr_cache[cache_key] = hasattr(obj, attr_name)
        
        return self._attr_cache[cache_key]
    
    def clear_cache(self):
        """清除缓存"""
        self._attr_cache.clear()

checker = CachedAttributeChecker()

## 测试缓存性能
start_time = time.time()
for i in range(100):
    checker.cached_hasattr(perf_obj, 'nonexistent_attr')
cached_time = time.time() - start_time

print(f"缓存检查不存在属性 100 次耗时: {cached_time:.4f}秒")
print(f"性能提升: {nonexistent_time/cached_time:.1f}倍")
```

### 类型安全和最佳实践

```python
from typing import Any, Optional, Type, Union

## 类型安全的属性检查
class TypeSafeAttributeChecker:
    """类型安全的属性检查器"""
    
    @staticmethod
    def has_attribute_of_type(obj: Any, attr_name: str, expected_type: Type) -> bool:
        """检查对象是否有指定类型的属性"""
        if not hasattr(obj, attr_name):
            return False
        
        attr_value = getattr(obj, attr_name)
        return isinstance(attr_value, expected_type)
    
    @staticmethod
    def has_callable_attribute(obj: Any, attr_name: str) -> bool:
        """检查对象是否有可调用的属性"""
        if not hasattr(obj, attr_name):
            return False
        
        attr_value = getattr(obj, attr_name)
        return callable(attr_value)
    
    @staticmethod
    def get_attribute_type(obj: Any, attr_name: str) -> Optional[Type]:
        """获取属性的类型"""
        if not hasattr(obj, attr_name):
            return None
        
        attr_value = getattr(obj, attr_name)
        return type(attr_value)
    
    @staticmethod
    def check_interface_compliance(obj: Any, interface_spec: dict) -> tuple[bool, list]:
        """检查对象是否符合接口规范"""
        errors = []
        
        for attr_name, attr_spec in interface_spec.items():
            if not hasattr(obj, attr_name):
                errors.append(f"缺少属性: {attr_name}")
                continue
            
            attr_value = getattr(obj, attr_name)
            
#            # 检查类型
            if 'type' in attr_spec:
                expected_type = attr_spec['type']
                if not isinstance(attr_value, expected_type):
                    errors.append(
                        f"属性{attr_name}类型错误: 期望{expected_type.__name__}, "
                        f"实际{type(attr_value).__name__}"
                    )
            
#            # 检查是否可调用
            if attr_spec.get('callable', False):
                if not callable(attr_value):
                    errors.append(f"属性{attr_name}必须是可调用的")
        
        return len(errors) == 0, errors

## 测试类型安全检查
class TestClass:
    """测试类"""
    
    def __init__(self):
        self.name = "测试对象"
        self.value = 42
        self.items = [1, 2, 3]
        self.config = {"debug": True}
    
    def get_info(self):
        return f"{self.name}: {self.value}"
    
    def process(self, data):
        return f"处理数据: {data}"

test_obj = TestClass()
checker = TypeSafeAttributeChecker()

print("\n 类型安全检查示例:")

## 基本类型检查
print(f"name 是字符串: {checker.has_attribute_of_type(test_obj, 'name', str)}")
print(f"value 是整数: {checker.has_attribute_of_type(test_obj, 'value', int)}")
print(f"items 是列表: {checker.has_attribute_of_type(test_obj, 'items', list)}")
print(f"config 是字典: {checker.has_attribute_of_type(test_obj, 'config', dict)}")
print(f"name 是整数: {checker.has_attribute_of_type(test_obj, 'name', int)}")

## 可调用检查
print(f"\nget_info 是可调用的: {checker.has_callable_attribute(test_obj, 'get_info')}")
print(f"process 是可调用的: {checker.has_callable_attribute(test_obj, 'process')}")
print(f"name 是可调用的: {checker.has_callable_attribute(test_obj, 'name')}")

## 获取属性类型
print(f"\n 属性类型:")
for attr in ['name', 'value', 'items', 'config', 'get_info']:
    attr_type = checker.get_attribute_type(test_obj, attr)
    print(f"  {attr}: {attr_type.__name__ if attr_type else 'None'}")

## 接口规范检查
interface_spec = {
    'name': {'type': str},
    'value': {'type': int},
    'items': {'type': list},
    'get_info': {'callable': True},
    'process': {'callable': True},
    'missing_attr': {'type': str},  # 这个不存在
    'config': {'type': str}  # 类型不匹配
}

is_compliant, errors = checker.check_interface_compliance(test_obj, interface_spec)
print(f"\n 接口规范检查:")
print(f"  符合规范: {is_compliant}")
if errors:
    print(f"  错误:")
    for error in errors:
        print(f"    - {error}")

## 属性检查装饰器
def require_attributes(*required_attrs):
    """要求对象具有指定属性的装饰器"""
    def decorator(func):
        def wrapper(obj, *args, **kwargs):
            missing_attrs = []
            for attr in required_attrs:
                if not hasattr(obj, attr):
                    missing_attrs.append(attr)
            
            if missing_attrs:
                raise AttributeError(
                    f"对象缺少必需属性: {missing_attrs}"
                )
            
            return func(obj, *args, **kwargs)
        return wrapper
    return decorator

@require_attributes('name', 'value', 'get_info')
def process_object(obj):
    """处理对象"""
    info = obj.get_info()
    return f"处理结果: {info}, 值: {obj.value}"

## 测试装饰器
print(f"\n 装饰器测试:")
try:
    result = process_object(test_obj)
    print(f"成功: {result}")
except AttributeError as e:
    print(f"失败: {e}")

## 测试缺少属性的对象
class IncompleteObject:
    def __init__(self):
        self.name = "不完整对象"
#        # 缺少 value 和 get_info

incomplete_obj = IncompleteObject()
try:
    result = process_object(incomplete_obj)
except AttributeError as e:
    print(f"预期失败: {e}")
```

## 🚀 实际应用场景

### Web 框架中的中间件检查

```python
## Web 框架中间件示例
class MiddlewareManager:
    """中间件管理器"""
    
    def __init__(self):
        self.middlewares = []
    
    def add_middleware(self, middleware):
        """添加中间件"""
#        # 检查中间件是否实现了必需的方法
        required_methods = ['process_request', 'process_response']
        optional_methods = ['process_exception', 'process_view']
        
        missing_methods = []
        for method in required_methods:
            if not hasattr(middleware, method):
                missing_methods.append(method)
            elif not callable(getattr(middleware, method)):
                missing_methods.append(f"{method}(不可调用)")
        
        if missing_methods:
            raise ValueError(
                f"中间件{type(middleware).__name__}缺少必需方法: {missing_methods}"
            )
        
#        # 检查可选方法
        available_optional = []
        for method in optional_methods:
            if hasattr(middleware, method) and callable(getattr(middleware, method)):
                available_optional.append(method)
        
        self.middlewares.append({
            'instance': middleware,
            'name': type(middleware).__name__,
            'optional_methods': available_optional
        })
        
        print(f"添加中间件: {type(middleware).__name__}")
        if available_optional:
            print(f"  可选方法: {available_optional}")
    
    def process_request(self, request):
        """处理请求"""
        for middleware_info in self.middlewares:
            middleware = middleware_info['instance']
            response = middleware.process_request(request)
            if response is not None:
                return response
        return None
    
    def process_response(self, request, response):
        """处理响应"""
        for middleware_info in reversed(self.middlewares):
            middleware = middleware_info['instance']
            response = middleware.process_response(request, response)
        return response

## 中间件示例
class AuthenticationMiddleware:
    """认证中间件"""
    
    def process_request(self, request):
        """处理请求"""
        if not hasattr(request, 'user'):
            request.user = None
        return None
    
    def process_response(self, request, response):
        """处理响应"""
        return response

class LoggingMiddleware:
    """日志中间件"""
    
    def process_request(self, request):
        """处理请求"""
        print(f"请求: {request.path}")
        return None
    
    def process_response(self, request, response):
        """处理响应"""
        print(f"响应: {response.status_code}")
        return response
    
    def process_exception(self, request, exception):
        """处理异常"""
        print(f"异常: {exception}")
        return None

class IncompleteMiddleware:
    """不完整的中间件"""
    
    def process_request(self, request):
        return None
    
#    # 缺少 process_response 方法

## 测试中间件管理器
print("\n 中间件管理器示例:")

manager = MiddlewareManager()

## 添加有效的中间件
try:
    manager.add_middleware(AuthenticationMiddleware())
    manager.add_middleware(LoggingMiddleware())
except ValueError as e:
    print(f"添加中间件失败: {e}")

## 尝试添加无效的中间件
try:
    manager.add_middleware(IncompleteMiddleware())
except ValueError as e:
    print(f"添加不完整中间件失败: {e}")
```

## 📚 相关函数和模块

### 内置函数
- `getattr()` - 获取对象属性值
- `setattr()` - 设置对象属性值
- `delattr()` - 删除对象属性
- `dir()` - 列出对象的所有属性和方法
- `vars()` - 返回对象的__dict__属性
- `callable()` - 检查对象是否可调用
- `isinstance()` - 检查对象类型
- `issubclass()` - 检查类继承关系

### 标准库模块
- `inspect` - 对象检查和反射
- `types` - 动态类型创建和名称
- `abc` - 抽象基类
- `typing` - 类型提示支持
- `dataclasses` - 数据类装饰器
- `attrs` - 第三方属性库

### 第三方库
- `pydantic` - 数据验证和设置管理
- `marshmallow` - 对象序列化/反序列化
- `cerberus` - 轻量级数据验证

## 📖 扩展阅读

1. **Python 官方文档**
   - [Built-in Functions - hasattr()](https://docs.python.org/3/library/functions.html#hasattr)
   - [Data Model - Attribute Access](https://docs.python.org/3/reference/datamodel.html#attribute-access)

2. **相关概念**
   - 反射和内省
   - 动态编程
   - 鸭子类型
   - 属性描述符

3. **设计模式**
   - 适配器模式
   - 装饰器模式
   - 策略模式
   - 插件架构

## 🏷️ 标签

`属性检查` `反射` `对象检查` `动态编程` `类型安全` `API 兼容性` `中间件` `插件系统` `配置管理` `错误处理`