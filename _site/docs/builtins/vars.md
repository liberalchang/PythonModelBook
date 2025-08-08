# vars() - 对象属性字典获取函数

## 概述

`vars()` 是 Python 的内置函数，用于返回对象的 `__dict__` 属性，即对象的属性字典。当不传递参数时，它返回当前局部命名空间的字典，相当于 `locals()`。这个函数在调试、反射和动态属性访问中非常有用。

## 学习目标

通过本文档，你将学会：
- 理解 `vars()` 函数的基本概念和用途
- 掌握 `vars()` 函数的各种用法
- 学会使用 `vars()` 进行对象属性检查
- 了解 `vars()` 与 `__dict__` 的关系
- 掌握动态属性访问和修改技巧
- 学会在调试和反射中应用 `vars()`

## 前置知识

- Python 基础语法
- 面向对象编程概念
- 字典操作
- 命名空间和作用域

## 详细内容

### 基本概念

`vars()` 函数返回对象的 `__dict__` 属性，这是一个包含对象所有可变属性的字典。对于没有 `__dict__` 属性的对象（如内置类型），会引发 `TypeError`。

### 语法

```python
vars()  # 返回当前局部命名空间
vars(object)  # 返回对象的 __dict__ 属性
```

### 参数说明

- **无参数**: 返回当前局部命名空间的字典，等同于 `locals()`
- **object**: 要获取属性字典的对象

### 返回值

- 无参数时：返回当前局部命名空间的字典
- 有参数时：返回对象的 `__dict__` 属性字典

## 代码示例

### 基本用法

```python
# 无参数调用 - 返回局部命名空间
def demo_function():
    local_var = 42
    another_var = "hello"
    
    # 获取局部变量字典
    local_vars = vars()
    print(f"局部变量: {local_vars}")
    # 输出: {'local_var': 42, 'another_var': 'hello'}
    
    return local_vars

result = demo_function()
print(f"函数返回的局部变量: {result}")

# 在模块级别调用
module_var = "I'm a module variable"
print(f"模块级别的vars(): {vars()}")
# 包含所有模块级别的变量和导入的模块

# 对象属性字典
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
        self.city = "Unknown"
    
    def set_city(self, city):
        self.city = city

person = Person("Alice", 30)
print(f"Person对象的属性: {vars(person)}")
# 输出: {'name': 'Alice', 'age': 30, 'city': 'Unknown'}

# 修改属性
person.set_city("New York")
person.email = "alice@example.com"  # 动态添加属性
print(f"修改后的属性: {vars(person)}")
# 输出: {'name': 'Alice', 'age': 30, 'city': 'New York', 'email': 'alice@example.com'}
```

### 对象属性检查器

```python
import inspect
from typing import Any, Dict, List, Optional, Type

class ObjectInspector:
    """对象属性检查器"""
    
    @staticmethod
    def get_object_info(obj: Any) -> Dict[str, Any]:
        """获取对象的详细信息"""
        info = {
            'type': type(obj).__name__,
            'module': getattr(type(obj), '__module__', 'Unknown'),
            'has_dict': hasattr(obj, '__dict__'),
            'attributes': {},
            'methods': {},
            'properties': {},
            'class_attributes': {}
        }
        
        # 获取实例属性
        try:
            instance_vars = vars(obj)
            info['attributes'] = instance_vars.copy()
        except TypeError:
            info['attributes'] = "对象没有 __dict__ 属性"
        
        # 获取类属性和方法
        obj_class = type(obj)
        try:
            class_vars = vars(obj_class)
            for name, value in class_vars.items():
                if not name.startswith('_'):  # 跳过私有属性
                    if callable(value):
                        info['methods'][name] = str(value)
                    elif isinstance(value, property):
                        info['properties'][name] = str(value)
                    else:
                        info['class_attributes'][name] = value
        except TypeError:
            pass
        
        return info
    
    @staticmethod
    def compare_objects(obj1: Any, obj2: Any) -> Dict[str, Any]:
        """比较两个对象的属性"""
        try:
            vars1 = vars(obj1)
            vars2 = vars(obj2)
        except TypeError as e:
            return {'error': f'无法获取对象属性: {e}'}
        
        # 找出差异
        all_keys = set(vars1.keys()) | set(vars2.keys())
        
        comparison = {
            'common_attributes': {},
            'only_in_obj1': {},
            'only_in_obj2': {},
            'different_values': {},
            'identical_attributes': {}
        }
        
        for key in all_keys:
            if key in vars1 and key in vars2:
                if vars1[key] == vars2[key]:
                    comparison['identical_attributes'][key] = vars1[key]
                else:
                    comparison['different_values'][key] = {
                        'obj1': vars1[key],
                        'obj2': vars2[key]
                    }
            elif key in vars1:
                comparison['only_in_obj1'][key] = vars1[key]
            else:
                comparison['only_in_obj2'][key] = vars2[key]
        
        return comparison
    
    @staticmethod
    def track_attribute_changes(obj: Any) -> 'AttributeTracker':
        """创建属性变化跟踪器"""
        return AttributeTracker(obj)
    
    @staticmethod
    def filter_attributes(obj: Any, 
                         include_private: bool = False,
                         attribute_type: Optional[Type] = None,
                         name_pattern: Optional[str] = None) -> Dict[str, Any]:
        """过滤对象属性"""
        try:
            all_vars = vars(obj)
        except TypeError:
            return {}
        
        filtered = {}
        
        for name, value in all_vars.items():
            # 检查私有属性
            if not include_private and name.startswith('_'):
                continue
            
            # 检查类型
            if attribute_type and not isinstance(value, attribute_type):
                continue
            
            # 检查名称模式
            if name_pattern:
                import re
                if not re.search(name_pattern, name):
                    continue
            
            filtered[name] = value
        
        return filtered

class AttributeTracker:
    """属性变化跟踪器"""
    
    def __init__(self, obj: Any):
        self.obj = obj
        try:
            self.initial_state = vars(obj).copy()
        except TypeError:
            self.initial_state = {}
        self.changes = []
    
    def snapshot(self, label: str = None) -> Dict[str, Any]:
        """创建当前状态快照"""
        try:
            current_state = vars(self.obj).copy()
        except TypeError:
            current_state = {}
        
        # 记录变化
        changes = self._detect_changes(self.initial_state, current_state)
        
        snapshot_data = {
            'timestamp': __import__('time').time(),
            'label': label or f'Snapshot {len(self.changes) + 1}',
            'state': current_state,
            'changes_from_initial': changes
        }
        
        self.changes.append(snapshot_data)
        return snapshot_data
    
    def _detect_changes(self, old_state: Dict, new_state: Dict) -> Dict[str, Any]:
        """检测状态变化"""
        changes = {
            'added': {},
            'removed': {},
            'modified': {},
            'unchanged': {}
        }
        
        all_keys = set(old_state.keys()) | set(new_state.keys())
        
        for key in all_keys:
            if key in old_state and key in new_state:
                if old_state[key] == new_state[key]:
                    changes['unchanged'][key] = new_state[key]
                else:
                    changes['modified'][key] = {
                        'old': old_state[key],
                        'new': new_state[key]
                    }
            elif key in new_state:
                changes['added'][key] = new_state[key]
            else:
                changes['removed'][key] = old_state[key]
        
        return changes
    
    def get_change_history(self) -> List[Dict[str, Any]]:
        """获取变化历史"""
        return self.changes.copy()
    
    def reset_tracking(self):
        """重置跟踪"""
        try:
            self.initial_state = vars(self.obj).copy()
        except TypeError:
            self.initial_state = {}
        self.changes = []

# 使用示例
class TestClass:
    class_var = "I'm a class variable"
    
    def __init__(self, name):
        self.name = name
        self.value = 0
    
    def increment(self):
        self.value += 1
    
    @property
    def display_name(self):
        return f"Name: {self.name}"
    
    def method_example(self):
        return "This is a method"

# 创建测试对象
obj1 = TestClass("Object1")
obj2 = TestClass("Object2")
obj2.value = 10
obj2.extra_attr = "Extra"

inspector = ObjectInspector()

# 获取对象信息
print("=== 对象信息检查 ===")
info = inspector.get_object_info(obj1)
for key, value in info.items():
    print(f"{key}: {value}")

# 比较对象
print("\n=== 对象比较 ===")
comparison = inspector.compare_objects(obj1, obj2)
for category, data in comparison.items():
    if data:
        print(f"{category}: {data}")

# 属性过滤
print("\n=== 属性过滤 ===")
# 只获取字符串类型的属性
string_attrs = inspector.filter_attributes(obj2, attribute_type=str)
print(f"字符串属性: {string_attrs}")

# 获取包含'name'的属性
name_attrs = inspector.filter_attributes(obj2, name_pattern=r'.*name.*')
print(f"包含'name'的属性: {name_attrs}")

# 属性变化跟踪
print("\n=== 属性变化跟踪 ===")
tracker = inspector.track_attribute_changes(obj1)

# 初始快照
tracker.snapshot("初始状态")

# 修改对象
obj1.value = 5
obj1.new_attr = "新属性"
tracker.snapshot("第一次修改")

# 再次修改
obj1.increment()
del obj1.new_attr
obj1.another_attr = [1, 2, 3]
tracker.snapshot("第二次修改")

# 查看变化历史
history = tracker.get_change_history()
for i, change in enumerate(history):
    print(f"\n快照 {i+1}: {change['label']}")
    changes = change['changes_from_initial']
    for change_type, data in changes.items():
        if data:
            print(f"  {change_type}: {data}")
```

## 实际应用场景

### 配置管理和动态属性

```python
import json
import os
from typing import Any, Dict, List, Optional, Union

class ConfigManager:
    """配置管理器"""
    
    def __init__(self, config_file: Optional[str] = None):
        self.config_file = config_file
        self._config_data = {}
        
        if config_file and os.path.exists(config_file):
            self.load_from_file()
    
    def load_from_file(self) -> bool:
        """从文件加载配置"""
        try:
            with open(self.config_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.update_config(data)
            return True
        except Exception as e:
            print(f"加载配置文件失败: {e}")
            return False
    
    def save_to_file(self) -> bool:
        """保存配置到文件"""
        if not self.config_file:
            return False
        
        try:
            # 使用vars()获取所有配置属性
            config_data = {}
            for key, value in vars(self).items():
                if not key.startswith('_') and key != 'config_file':
                    config_data[key] = value
            
            with open(self.config_file, 'w', encoding='utf-8') as f:
                json.dump(config_data, f, indent=2, ensure_ascii=False)
            return True
        except Exception as e:
            print(f"保存配置文件失败: {e}")
            return False
    
    def update_config(self, config_dict: Dict[str, Any]):
        """更新配置"""
        for key, value in config_dict.items():
            setattr(self, key, value)
    
    def get_config(self, key: str, default: Any = None) -> Any:
        """获取配置值"""
        return getattr(self, key, default)
    
    def set_config(self, key: str, value: Any):
        """设置配置值"""
        setattr(self, key, value)
    
    def remove_config(self, key: str) -> bool:
        """删除配置项"""
        if hasattr(self, key) and not key.startswith('_'):
            delattr(self, key)
            return True
        return False
    
    def list_configs(self) -> Dict[str, Any]:
        """列出所有配置"""
        configs = {}
        for key, value in vars(self).items():
            if not key.startswith('_') and key != 'config_file':
                configs[key] = value
        return configs
    
    def validate_config(self, schema: Dict[str, Dict]) -> Dict[str, List[str]]:
        """验证配置"""
        errors = {}
        current_config = self.list_configs()
        
        for key, rules in schema.items():
            field_errors = []
            
            # 检查必需字段
            if rules.get('required', False) and key not in current_config:
                field_errors.append(f"缺少必需字段: {key}")
                continue
            
            if key in current_config:
                value = current_config[key]
                
                # 类型检查
                expected_type = rules.get('type')
                if expected_type and not isinstance(value, expected_type):
                    field_errors.append(f"类型错误: 期望 {expected_type.__name__}, 得到 {type(value).__name__}")
                
                # 值范围检查
                if 'min_value' in rules and isinstance(value, (int, float)):
                    if value < rules['min_value']:
                        field_errors.append(f"值太小: {value} < {rules['min_value']}")
                
                if 'max_value' in rules and isinstance(value, (int, float)):
                    if value > rules['max_value']:
                        field_errors.append(f"值太大: {value} > {rules['max_value']}")
                
                # 选择值检查
                if 'choices' in rules and value not in rules['choices']:
                    field_errors.append(f"无效选择: {value}, 可选值: {rules['choices']}")
            
            if field_errors:
                errors[key] = field_errors
        
        return errors
    
    def create_backup(self) -> Dict[str, Any]:
        """创建配置备份"""
        return self.list_configs().copy()
    
    def restore_from_backup(self, backup: Dict[str, Any]):
        """从备份恢复配置"""
        # 清除当前配置（除了内部属性）
        current_vars = list(vars(self).keys())
        for key in current_vars:
            if not key.startswith('_') and key != 'config_file':
                delattr(self, key)
        
        # 恢复备份的配置
        self.update_config(backup)
    
    def __str__(self):
        configs = self.list_configs()
        return f"ConfigManager({len(configs)} configs): {list(configs.keys())}"
    
    def __repr__(self):
        return f"ConfigManager(config_file='{self.config_file}', configs={self.list_configs()})"

class DynamicObject:
    """动态对象 - 支持动态添加和删除属性"""
    
    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
    
    def add_attribute(self, name: str, value: Any, overwrite: bool = True) -> bool:
        """添加属性"""
        if hasattr(self, name) and not overwrite:
            return False
        setattr(self, name, value)
        return True
    
    def remove_attribute(self, name: str) -> bool:
        """删除属性"""
        if hasattr(self, name):
            delattr(self, name)
            return True
        return False
    
    def has_attribute(self, name: str) -> bool:
        """检查是否有属性"""
        return hasattr(self, name)
    
    def get_attribute(self, name: str, default: Any = None) -> Any:
        """获取属性值"""
        return getattr(self, name, default)
    
    def list_attributes(self) -> Dict[str, Any]:
        """列出所有属性"""
        return vars(self).copy()
    
    def update_attributes(self, **kwargs):
        """批量更新属性"""
        for key, value in kwargs.items():
            setattr(self, key, value)
    
    def clear_attributes(self, keep: Optional[List[str]] = None):
        """清除属性"""
        keep = keep or []
        current_attrs = list(vars(self).keys())
        for attr in current_attrs:
            if attr not in keep:
                delattr(self, attr)
    
    def copy_attributes_from(self, other_obj: Any, exclude: Optional[List[str]] = None):
        """从其他对象复制属性"""
        exclude = exclude or []
        try:
            other_vars = vars(other_obj)
            for key, value in other_vars.items():
                if key not in exclude:
                    setattr(self, key, value)
        except TypeError:
            print(f"无法从 {type(other_obj)} 复制属性")
    
    def to_dict(self) -> Dict[str, Any]:
        """转换为字典"""
        return vars(self).copy()
    
    def from_dict(self, data: Dict[str, Any], clear_existing: bool = False):
        """从字典加载属性"""
        if clear_existing:
            self.clear_attributes()
        
        for key, value in data.items():
            setattr(self, key, value)
    
    def __str__(self):
        attrs = vars(self)
        return f"DynamicObject({len(attrs)} attributes): {list(attrs.keys())}"
    
    def __repr__(self):
        return f"DynamicObject({vars(self)})"

# 使用示例
print("=== 配置管理示例 ===")

# 创建配置管理器
config = ConfigManager()

# 设置一些配置
config.set_config('database_host', 'localhost')
config.set_config('database_port', 5432)
config.set_config('debug_mode', True)
config.set_config('max_connections', 100)
config.set_config('app_name', 'MyApp')

print(f"当前配置: {config.list_configs()}")

# 配置验证
schema = {
    'database_host': {'required': True, 'type': str},
    'database_port': {'required': True, 'type': int, 'min_value': 1, 'max_value': 65535},
    'debug_mode': {'required': False, 'type': bool},
    'max_connections': {'required': True, 'type': int, 'min_value': 1},
    'log_level': {'required': False, 'type': str, 'choices': ['DEBUG', 'INFO', 'WARNING', 'ERROR']}
}

validation_errors = config.validate_config(schema)
if validation_errors:
    print(f"配置验证错误: {validation_errors}")
else:
    print("配置验证通过")

# 创建备份
backup = config.create_backup()
print(f"配置备份: {backup}")

# 修改配置
config.set_config('database_port', 3306)
config.set_config('new_feature', True)
print(f"修改后配置: {config.list_configs()}")

# 从备份恢复
config.restore_from_backup(backup)
print(f"恢复后配置: {config.list_configs()}")

print("\n=== 动态对象示例 ===")

# 创建动态对象
dynamic_obj = DynamicObject(name="Dynamic", version=1.0)
print(f"初始对象: {dynamic_obj}")

# 动态添加属性
dynamic_obj.add_attribute('description', '这是一个动态对象')
dynamic_obj.add_attribute('features', ['feature1', 'feature2'])
dynamic_obj.add_attribute('config', {'setting1': 'value1', 'setting2': 42})

print(f"添加属性后: {dynamic_obj.list_attributes()}")

# 从字典更新
update_data = {
    'version': 2.0,
    'author': 'Python Developer',
    'tags': ['python', 'dynamic', 'object']
}
dynamic_obj.from_dict(update_data)
print(f"从字典更新后: {dynamic_obj.list_attributes()}")

# 复制属性
other_obj = ConfigManager()
other_obj.source = 'other_object'
other_obj.data = [1, 2, 3, 4, 5]

dynamic_obj.copy_attributes_from(other_obj, exclude=['config_file'])
print(f"复制属性后: {dynamic_obj.list_attributes()}")

# 清除部分属性
dynamic_obj.clear_attributes(keep=['name', 'version', 'author'])
print(f"清除属性后: {dynamic_obj.list_attributes()}")
```

### 调试和开发工具

```python
import sys
import traceback
import functools
from typing import Any, Callable, Dict, List, Optional

class DebugHelper:
    """调试助手"""
    
    @staticmethod
    def print_vars(obj: Any = None, title: str = "Variables", 
                   filter_private: bool = True, 
                   filter_callable: bool = True) -> None:
        """打印变量信息"""
        print(f"\n=== {title} ===")
        
        if obj is None:
            # 获取调用者的局部变量
            frame = sys._getframe(1)
            variables = frame.f_locals
        else:
            try:
                variables = vars(obj)
            except TypeError:
                print(f"对象 {type(obj)} 没有 __dict__ 属性")
                return
        
        if not variables:
            print("没有变量")
            return
        
        for name, value in variables.items():
            # 过滤私有变量
            if filter_private and name.startswith('_'):
                continue
            
            # 过滤可调用对象
            if filter_callable and callable(value):
                continue
            
            value_type = type(value).__name__
            value_str = str(value)
            
            # 限制显示长度
            if len(value_str) > 100:
                value_str = value_str[:97] + "..."
            
            print(f"  {name:<20} ({value_type:<10}): {value_str}")
    
    @staticmethod
    def compare_vars(obj1: Any, obj2: Any, title: str = "Variable Comparison") -> None:
        """比较两个对象的变量"""
        print(f"\n=== {title} ===")
        
        try:
            vars1 = vars(obj1) if obj1 is not None else {}
            vars2 = vars(obj2) if obj2 is not None else {}
        except TypeError as e:
            print(f"无法比较变量: {e}")
            return
        
        all_keys = set(vars1.keys()) | set(vars2.keys())
        
        if not all_keys:
            print("没有变量可比较")
            return
        
        for key in sorted(all_keys):
            if key in vars1 and key in vars2:
                if vars1[key] == vars2[key]:
                    print(f"  ✓ {key}: {vars1[key]} (相同)")
                else:
                    print(f"  ✗ {key}: {vars1[key]} → {vars2[key]} (不同)")
            elif key in vars1:
                print(f"  - {key}: {vars1[key]} (仅在obj1中)")
            else:
                print(f"  + {key}: {vars2[key]} (仅在obj2中)")
    
    @staticmethod
    def trace_vars(func: Callable) -> Callable:
        """装饰器：跟踪函数执行过程中的变量变化"""
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            print(f"\n=== 开始执行 {func.__name__} ===")
            
            # 执行前的局部变量
            print("执行前的参数:")
            if args:
                print(f"  位置参数: {args}")
            if kwargs:
                print(f"  关键字参数: {kwargs}")
            
            try:
                result = func(*args, **kwargs)
                print(f"\n函数 {func.__name__} 执行成功")
                print(f"返回值: {result}")
                return result
            except Exception as e:
                print(f"\n函数 {func.__name__} 执行失败")
                print(f"错误: {e}")
                traceback.print_exc()
                raise
            finally:
                print(f"=== 结束执行 {func.__name__} ===\n")
        
        return wrapper
    
    @staticmethod
    def monitor_object_changes(obj: Any, interval: float = 1.0, 
                              max_iterations: int = 10) -> None:
        """监控对象变化"""
        import time
        
        print(f"开始监控对象 {type(obj).__name__} 的变化...")
        
        try:
            previous_state = vars(obj).copy()
        except TypeError:
            print("对象没有 __dict__ 属性，无法监控")
            return
        
        for i in range(max_iterations):
            time.sleep(interval)
            
            try:
                current_state = vars(obj)
            except TypeError:
                print("对象已失效")
                break
            
            # 检查变化
            changes_detected = False
            
            # 检查新增和修改的属性
            for key, value in current_state.items():
                if key not in previous_state:
                    print(f"[{i+1}] 新增属性: {key} = {value}")
                    changes_detected = True
                elif previous_state[key] != value:
                    print(f"[{i+1}] 属性变化: {key} = {previous_state[key]} → {value}")
                    changes_detected = True
            
            # 检查删除的属性
            for key in previous_state:
                if key not in current_state:
                    print(f"[{i+1}] 删除属性: {key} = {previous_state[key]}")
                    changes_detected = True
            
            if not changes_detected:
                print(f"[{i+1}] 无变化")
            
            previous_state = current_state.copy()
        
        print("监控结束")

class VarsAnalyzer:
    """vars() 分析器"""
    
    @staticmethod
    def analyze_object_structure(obj: Any) -> Dict[str, Any]:
        """分析对象结构"""
        analysis = {
            'object_type': type(obj).__name__,
            'has_dict': hasattr(obj, '__dict__'),
            'attribute_count': 0,
            'attribute_types': {},
            'memory_usage': 0,
            'circular_references': [],
            'nested_objects': []
        }
        
        try:
            obj_vars = vars(obj)
            analysis['attribute_count'] = len(obj_vars)
            
            for name, value in obj_vars.items():
                value_type = type(value).__name__
                
                # 统计类型
                if value_type in analysis['attribute_types']:
                    analysis['attribute_types'][value_type] += 1
                else:
                    analysis['attribute_types'][value_type] = 1
                
                # 检查嵌套对象
                if hasattr(value, '__dict__'):
                    analysis['nested_objects'].append({
                        'name': name,
                        'type': value_type,
                        'attribute_count': len(vars(value)) if hasattr(value, '__dict__') else 0
                    })
                
                # 检查循环引用
                if value is obj:
                    analysis['circular_references'].append(name)
            
            # 估算内存使用
            analysis['memory_usage'] = sys.getsizeof(obj_vars)
            
        except TypeError:
            analysis['error'] = '对象没有 __dict__ 属性'
        
        return analysis
    
    @staticmethod
    def find_large_attributes(obj: Any, size_threshold: int = 1024) -> List[Dict[str, Any]]:
        """查找占用内存较大的属性"""
        large_attrs = []
        
        try:
            obj_vars = vars(obj)
            
            for name, value in obj_vars.items():
                size = sys.getsizeof(value)
                if size > size_threshold:
                    large_attrs.append({
                        'name': name,
                        'type': type(value).__name__,
                        'size': size,
                        'size_mb': size / (1024 * 1024)
                    })
            
            # 按大小排序
            large_attrs.sort(key=lambda x: x['size'], reverse=True)
            
        except TypeError:
            pass
        
        return large_attrs
    
    @staticmethod
    def generate_object_report(obj: Any) -> str:
        """生成对象报告"""
        report = []
        report.append(f"对象报告: {type(obj).__name__}")
        report.append("=" * 50)
        
        # 基本分析
        analysis = VarsAnalyzer.analyze_object_structure(obj)
        
        if 'error' in analysis:
            report.append(f"错误: {analysis['error']}")
            return "\n".join(report)
        
        report.append(f"属性数量: {analysis['attribute_count']}")
        report.append(f"内存使用: {analysis['memory_usage']} 字节")
        
        # 类型统计
        if analysis['attribute_types']:
            report.append("\n属性类型分布:")
            for attr_type, count in sorted(analysis['attribute_types'].items()):
                report.append(f"  {attr_type}: {count}")
        
        # 嵌套对象
        if analysis['nested_objects']:
            report.append("\n嵌套对象:")
            for nested in analysis['nested_objects']:
                report.append(f"  {nested['name']} ({nested['type']}): {nested['attribute_count']} 属性")
        
        # 循环引用
        if analysis['circular_references']:
            report.append("\n循环引用:")
            for ref in analysis['circular_references']:
                report.append(f"  {ref}")
        
        # 大属性
        large_attrs = VarsAnalyzer.find_large_attributes(obj)
        if large_attrs:
            report.append("\n大属性 (>1KB):")
            for attr in large_attrs[:5]:  # 只显示前5个
                report.append(f"  {attr['name']} ({attr['type']}): {attr['size_mb']:.2f} MB")
        
        return "\n".join(report)

# 使用示例
print("=== 调试工具示例 ===")

# 创建测试类
class TestObject:
    def __init__(self):
        self.name = "Test Object"
        self.data = list(range(1000))  # 大数据
        self.config = {'debug': True, 'version': '1.0'}
        self.nested = TestObject.__new__(TestObject)  # 嵌套对象
        self.nested.value = 42
        # self.circular = self  # 循环引用（注释掉避免问题）
    
    def process_data(self):
        self.processed = [x * 2 for x in self.data[:10]]
        return self.processed

# 创建测试对象
test_obj = TestObject()

# 使用调试助手
debug_helper = DebugHelper()

# 打印变量
debug_helper.print_vars(test_obj, "测试对象属性")

# 使用跟踪装饰器
@debug_helper.trace_vars
def modify_object(obj):
    obj.name = "Modified Object"
    obj.new_attr = "New Value"
    return obj.process_data()

result = modify_object(test_obj)

# 对象分析
analyzer = VarsAnalyzer()
analysis = analyzer.analyze_object_structure(test_obj)
print(f"\n对象分析结果: {analysis}")

# 生成报告
report = analyzer.generate_object_report(test_obj)
print(f"\n{report}")

# 查找大属性
large_attrs = analyzer.find_large_attributes(test_obj, 100)
print(f"\n大属性: {large_attrs}")
```

## 常见陷阱和最佳实践

### 错误处理和安全使用

```python
class SafeVarsProcessor:
    """安全的 vars() 处理器"""
    
    @staticmethod
    def safe_vars(obj: Any = None) -> Dict[str, Any]:
        """安全的 vars() 调用"""
        result = {
            'success': False,
            'vars': {},
            'error': None,
            'info': {}
        }
        
        try:
            if obj is None:
                # 获取调用者的局部变量
                import sys
                frame = sys._getframe(1)
                result['vars'] = frame.f_locals.copy()
                result['info']['source'] = 'local_namespace'
            else:
                result['vars'] = vars(obj)
                result['info']['source'] = 'object_dict'
                result['info']['object_type'] = type(obj).__name__
            
            result['success'] = True
            result['info']['var_count'] = len(result['vars'])
            
        except TypeError as e:
            result['error'] = f"对象没有 __dict__ 属性: {e}"
            result['info']['object_type'] = type(obj).__name__ if obj is not None else 'None'
        except Exception as e:
            result['error'] = f"未知错误: {e}"
        
        return result
    
    @staticmethod
    def safe_modify_vars(obj: Any, modifications: Dict[str, Any], 
                        allow_new: bool = True, 
                        allow_delete: bool = False) -> Dict[str, Any]:
        """安全的变量修改"""
        result = {
            'success': False,
            'applied_changes': [],
            'failed_changes': [],
            'error': None
        }
        
        try:
            obj_vars = vars(obj)
        except TypeError:
            result['error'] = "对象没有 __dict__ 属性"
            return result
        
        for key, value in modifications.items():
            change_info = {'key': key, 'action': None, 'old_value': None, 'new_value': value}
            
            try:
                # 检查是否为删除操作
                if value is None and allow_delete and key in obj_vars:
                    change_info['action'] = 'delete'
                    change_info['old_value'] = obj_vars[key]
                    delattr(obj, key)
                    result['applied_changes'].append(change_info)
                
                # 检查是否为新增操作
                elif key not in obj_vars:
                    if allow_new:
                        change_info['action'] = 'add'
                        setattr(obj, key, value)
                        result['applied_changes'].append(change_info)
                    else:
                        change_info['error'] = '不允许添加新属性'
                        result['failed_changes'].append(change_info)
                
                # 修改现有属性
                else:
                    change_info['action'] = 'modify'
                    change_info['old_value'] = obj_vars[key]
                    setattr(obj, key, value)
                    result['applied_changes'].append(change_info)
            
            except Exception as e:
                change_info['error'] = str(e)
                result['failed_changes'].append(change_info)
        
        result['success'] = len(result['failed_changes']) == 0
        return result
    
    @staticmethod
    def validate_object_vars(obj: Any, schema: Dict[str, Dict]) -> Dict[str, Any]:
        """验证对象变量"""
        validation_result = {
            'valid': True,
            'errors': {},
            'warnings': {},
            'summary': {
                'total_attributes': 0,
                'valid_attributes': 0,
                'invalid_attributes': 0,
                'missing_required': 0
            }
        }
        
        try:
            obj_vars = vars(obj)
        except TypeError:
            validation_result['valid'] = False
            validation_result['errors']['object'] = '对象没有 __dict__ 属性'
            return validation_result
        
        validation_result['summary']['total_attributes'] = len(obj_vars)
        
        # 验证每个属性
        for attr_name, rules in schema.items():
            attr_errors = []
            attr_warnings = []
            
            # 检查必需属性
            if rules.get('required', False) and attr_name not in obj_vars:
                attr_errors.append('缺少必需属性')
                validation_result['summary']['missing_required'] += 1
                continue
            
            if attr_name in obj_vars:
                value = obj_vars[attr_name]
                
                # 类型验证
                expected_type = rules.get('type')
                if expected_type and not isinstance(value, expected_type):
                    attr_errors.append(f'类型错误: 期望 {expected_type.__name__}, 得到 {type(value).__name__}')
                
                # 值验证
                validator = rules.get('validator')
                if validator and callable(validator):
                    try:
                        if not validator(value):
                            attr_errors.append('自定义验证失败')
                    except Exception as e:
                        attr_errors.append(f'验证器错误: {e}')
                
                # 范围验证
                if 'min_value' in rules and hasattr(value, '__lt__'):
                    if value < rules['min_value']:
                        attr_errors.append(f'值太小: {value} < {rules["min_value"]}')
                
                if 'max_value' in rules and hasattr(value, '__gt__'):
                    if value > rules['max_value']:
                        attr_errors.append(f'值太大: {value} > {rules["max_value"]}')
                
                # 长度验证
                if 'min_length' in rules and hasattr(value, '__len__'):
                    if len(value) < rules['min_length']:
                        attr_errors.append(f'长度太短: {len(value)} < {rules["min_length"]}')
                
                if 'max_length' in rules and hasattr(value, '__len__'):
                    if len(value) > rules['max_length']:
                        attr_errors.append(f'长度太长: {len(value)} > {rules["max_length"]}')
                
                # 选择验证
                if 'choices' in rules and value not in rules['choices']:
                    attr_errors.append(f'无效选择: {value}, 可选值: {rules["choices"]}')
                
                # 警告检查
                if rules.get('deprecated', False):
                    attr_warnings.append('属性已弃用')
            
            # 记录验证结果
            if attr_errors:
                validation_result['errors'][attr_name] = attr_errors
                validation_result['summary']['invalid_attributes'] += 1
                validation_result['valid'] = False
            else:
                validation_result['summary']['valid_attributes'] += 1
            
            if attr_warnings:
                validation_result['warnings'][attr_name] = attr_warnings
        
        return validation_result
    
    @staticmethod
    def deep_copy_vars(obj: Any) -> Dict[str, Any]:
        """深度复制对象变量"""
        import copy
        
        try:
            obj_vars = vars(obj)
            return copy.deepcopy(obj_vars)
        except TypeError:
            return {}
        except Exception as e:
            print(f"深度复制失败: {e}")
            return {}
    
    @staticmethod
    def serialize_vars(obj: Any, format_type: str = 'json') -> str:
        """序列化对象变量"""
        try:
            obj_vars = vars(obj)
        except TypeError:
            return '{}'
        
        if format_type.lower() == 'json':
            import json
            try:
                return json.dumps(obj_vars, default=str, indent=2, ensure_ascii=False)
            except Exception as e:
                return f'{{"error": "JSON序列化失败: {e}"}}'
        
        elif format_type.lower() == 'yaml':
            try:
                import yaml
                return yaml.dump(obj_vars, default_flow_style=False, allow_unicode=True)
            except ImportError:
                return 'YAML模块未安装'
            except Exception as e:
                return f'YAML序列化失败: {e}'
        
        else:
            return str(obj_vars)

# 使用示例
print("=== 安全 vars() 处理示例 ===")

safe_processor = SafeVarsProcessor()

# 创建测试对象
class TestValidation:
    def __init__(self):
        self.name = "Test"
        self.age = 25
        self.email = "test@example.com"
        self.score = 85.5
        self.tags = ["python", "programming"]
        self.active = True

test_obj = TestValidation()

# 安全获取变量
result = safe_processor.safe_vars(test_obj)
print(f"安全获取变量: {result}")

# 定义验证模式
validation_schema = {
    'name': {
        'required': True,
        'type': str,
        'min_length': 1,
        'max_length': 50
    },
    'age': {
        'required': True,
        'type': int,
        'min_value': 0,
        'max_value': 150
    },
    'email': {
        'required': False,
        'type': str,
        'validator': lambda x: '@' in x and '.' in x
    },
    'score': {
        'required': False,
        'type': (int, float),
        'min_value': 0,
        'max_value': 100
    },
    'tags': {
        'required': False,
        'type': list,
        'max_length': 10
    },
    'deprecated_field': {
        'required': False,
        'deprecated': True
    }
}

# 验证对象
validation_result = safe_processor.validate_object_vars(test_obj, validation_schema)
print(f"\n验证结果: {validation_result}")

# 安全修改变量
modifications = {
    'name': 'Updated Test',
    'new_field': 'New Value',
    'age': 30
}

modify_result = safe_processor.safe_modify_vars(test_obj, modifications)
print(f"\n修改结果: {modify_result}")

# 序列化变量
json_str = safe_processor.serialize_vars(test_obj, 'json')
print(f"\nJSON序列化:\n{json_str}")

# 深度复制
deep_copy = safe_processor.deep_copy_vars(test_obj)
print(f"\n深度复制: {deep_copy}")

# 测试没有 __dict__ 的对象
print("\n=== 测试内置类型 ===")
int_result = safe_processor.safe_vars(42)
print(f"整数对象: {int_result}")

list_result = safe_processor.safe_vars([1, 2, 3])
print(f"列表对象: {list_result}")
```

## 相关函数和模块

### 内置函数
- `locals()` - 返回当前局部命名空间
- `globals()` - 返回全局命名空间
- `dir()` - 返回对象的属性列表
- `hasattr()` - 检查对象是否有指定属性
- `getattr()` - 获取对象属性值
- `setattr()` - 设置对象属性值
- `delattr()` - 删除对象属性

### 标准库
- `inspect` - 对象检查工具
- `types` - 动态类型创建和名称
- `sys` - 系统特定的参数和函数
- `gc` - 垃圾回收接口
- `weakref` - 弱引用支持

### 第三方库
- `attrs` - 类装饰器和属性定义
- `dataclasses` - 数据类支持
- `pydantic` - 数据验证和设置管理
- `marshmallow` - 对象序列化/反序列化

## 扩展阅读

- [Python 官方文档 - vars()](https://docs.python.org/3/library/functions.html#vars)
- [Python 数据模型 - __dict__](https://docs.python.org/3/reference/datamodel.html#object.__dict__)
- [Python 命名空间和作用域](https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces)
- [对象属性访问](https://docs.python.org/3/reference/datamodel.html#customizing-attribute-access)
- [反射和内省技术](https://docs.python.org/3/library/inspect.html)

## 标签

`内置函数` `对象属性` `反射` `调试工具` `命名空间` `动态属性` `对象检查` `元编程`