# repr() - 对象字符串表示函数

## 📖 概述

`repr()` 是 Python 的内置函数，用于返回对象的"官方"字符串表示。这个表示应该是明确的、无歧义的，理想情况下应该是一个有效的 Python 表达式，可以用来重新创建具有相同值的对象。`repr()` 主要用于调试和开发，帮助开发者理解对象的内容和结构。

## 🎯 学习目标

通过本文档，你将学会：
- 掌握 `repr()` 函数的基本用法和语法
- 理解 `repr()` 与 `str()` 的区别
- 学会为自定义类实现 `__repr__()` 方法
- 掌握 `repr()` 在调试和开发中的应用
- 了解最佳实践和常见陷阱

## 📋 前置知识

- Python 基础语法
- 面向对象编程概念
- 特殊方法（魔术方法）
- 字符串操作基础

## 📚 详细内容

### 基本概念

`repr()` 函数调用对象的 `__repr__()` 方法来获取对象的字符串表示。这个表示应该：
1. 明确无歧义
2. 尽可能是有效的 Python 表达式
3. 包含足够的信息来重建对象
4. 适合开发者阅读和调试

### 语法

```python
repr(object)
```

### 参数

- **object**: 要获取字符串表示的对象

### 返回值

返回一个字符串，表示对象的"官方"字符串表示。

## 💡 代码示例

### 基本用法

```python
## repr()基本用法示例
print("repr()基本用法:")

## 1. 基本数据类型
print("\n1. 基本数据类型:")

## 数字
num_int = 42
num_float = 3.14159
num_complex = 3 + 4j

print(f"整数: {repr(num_int)}")
print(f"浮点数: {repr(num_float)}")
print(f"复数: {repr(num_complex)}")

## 字符串
string1 = "Hello, World!"
string2 = "Line 1\nLine 2\tTabbed"
string3 = "String with 'quotes' and \"double quotes\""

print(f"普通字符串: {repr(string1)}")
print(f"包含转义字符: {repr(string2)}")
print(f"包含引号: {repr(string3)}")

## 布尔值和 None
print(f"True: {repr(True)}")
print(f"False: {repr(False)}")
print(f"None: {repr(None)}")

## 2. 容器类型
print("\n2. 容器类型:")

## 列表
list1 = [1, 2, 3, 'hello', True]
list2 = []
list3 = [[1, 2], [3, 4], [5, 6]]

print(f"列表: {repr(list1)}")
print(f"空列表: {repr(list2)}")
print(f"嵌套列表: {repr(list3)}")

## 元组
tuple1 = (1, 2, 3)
tuple2 = (42,)  # 单元素元组
tuple3 = ()

print(f"元组: {repr(tuple1)}")
print(f"单元素元组: {repr(tuple2)}")
print(f"空元组: {repr(tuple3)}")

## 字典
dict1 = {'name': 'Alice', 'age': 30, 'city': 'Beijing'}
dict2 = {}
dict3 = {1: 'one', 2: 'two', (3, 4): 'tuple_key'}

print(f"字典: {repr(dict1)}")
print(f"空字典: {repr(dict2)}")
print(f"复杂键字典: {repr(dict3)}")

## 集合
set1 = {1, 2, 3, 4, 5}
set2 = set()
set3 = {'apple', 'banana', 'cherry'}

print(f"集合: {repr(set1)}")
print(f"空集合: {repr(set2)}")
print(f"字符串集合: {repr(set3)}")

## 3. 特殊对象
print("\n3. 特殊对象:")

## 函数
def my_function():
    """这是一个示例函数"""
    pass

print(f"函数: {repr(my_function)}")

## 类
class MyClass:
    pass

print(f"类: {repr(MyClass)}")

## 模块
import math
print(f"模块: {repr(math)}")

## 4. repr() vs str() 比较
print("\n4. repr() vs str() 比较:")

from datetime import datetime

now = datetime.now()
text = "Hello\nWorld"
number = 3.14159

print("对象\t\tstr()\t\t\trepr()")
print("-" * 60)
print(f"datetime\t{str(now)}\t{repr(now)}")
print(f"多行字符串\t{str(text)!r}\t\t{repr(text)}")
print(f"浮点数\t\t{str(number)}\t\t\t{repr(number)}")

## 5. 在不同上下文中的使用
print("\n5. 在不同上下文中的使用:")

## 调试信息
data = {'users': [{'name': 'Alice', 'age': 30}, {'name': 'Bob', 'age': 25}]}
print(f"调试信息: {repr(data)}")

## 日志记录
import logging
logging.basicConfig(level=logging.DEBUG, format='%(message)s')
logger = logging.getLogger()

user_input = "user\ninput\twith\tspecial\nchars"
logger.debug(f"用户输入: {repr(user_input)}")

## 错误信息
try:
    result = eval("invalid_expression")
except NameError as e:
    print(f"错误详情: {repr(e)}")
```

### 自定义类的 repr 实现

```python
## 自定义类的 repr 实现示例
print("\n" + "="*50)
print("自定义类的 repr 实现:")

## 1. 基本的 repr 实现
print("\n1. 基本的 repr 实现:")

class Person:
    """基本的 Person 类,演示 repr 实现。"""
    
    def __init__(self, name, age, email=None):
        self.name = name
        self.age = age
        self.email = email
    
    def __repr__(self):
        """返回对象的官方字符串表示。"""
        if self.email:
            return f"Person(name={self.name!r}, age={self.age!r}, email={self.email!r})"
        else:
            return f"Person(name={self.name!r}, age={self.age!r})"
    
    def __str__(self):
        """返回对象的非正式字符串表示。"""
        return f"{self.name} ({self.age}岁)"

## 测试 Person 类
person1 = Person("张三", 25)
person2 = Person("李四", 30, "lisi@example.com")

print(f"person1 repr: {repr(person1)}")
print(f"person1 str: {str(person1)}")
print(f"person2 repr: {repr(person2)}")
print(f"person2 str: {str(person2)}")

## 验证 repr 的可执行性
print("\n 验证 repr 的可执行性:")
repr_string = repr(person1)
print(f"repr 字符串: {repr_string}")

## 注意:这里只是演示概念,实际执行需要 Person 类在作用域中
try:
    recreated_person = eval(repr_string)
    print(f"重建对象: {recreated_person}")
    print(f"重建成功: {recreated_person.name == person1.name and recreated_person.age == person1.age}")
except Exception as e:
    print(f"重建失败: {e}")

## 2. 复杂对象的 repr 实现
print("\n2. 复杂对象的 repr 实现:")

class BankAccount:
    """银行账户类,演示复杂对象的 repr 实现。"""
    
    def __init__(self, account_number, holder_name, balance=0.0, account_type="savings"):
        self.account_number = account_number
        self.holder_name = holder_name
        self.balance = balance
        self.account_type = account_type
        self.transactions = []
    
    def deposit(self, amount):
        """存款。"""
        self.balance += amount
        self.transactions.append(f"存款: +{amount}")
    
    def withdraw(self, amount):
        """取款。"""
        if amount <= self.balance:
            self.balance -= amount
            self.transactions.append(f"取款: -{amount}")
            return True
        return False
    
    def __repr__(self):
        """返回详细的对象表示。"""
        return (f"BankAccount("
                f"account_number={self.account_number!r}, "
                f"holder_name={self.holder_name!r}, "
                f"balance={self.balance!r}, "
                f"account_type={self.account_type!r})") 
    
    def __str__(self):
        """返回用户友好的字符串表示。"""
        return f"账户 {self.account_number}: {self.holder_name}, 余额: ¥{self.balance:.2f}"

## 测试 BankAccount 类
account = BankAccount("1234567890", "王五", 1000.0, "checking")
account.deposit(500)
account.withdraw(200)

print(f"账户 repr: {repr(account)}")
print(f"账户 str: {str(account)}")

## 3. 容器类的 repr 实现
print("\n3. 容器类的 repr 实现:")

class CustomList:
    """自定义列表类,演示容器的 repr 实现。"""
    
    def __init__(self, items=None):
        self.items = list(items) if items else []
    
    def append(self, item):
        """添加元素。"""
        self.items.append(item)
    
    def __len__(self):
        return len(self.items)
    
    def __getitem__(self, index):
        return self.items[index]
    
    def __repr__(self):
        """返回可重建对象的字符串表示。"""
        return f"CustomList({self.items!r})"
    
    def __str__(self):
        """返回用户友好的字符串表示。"""
        return f"CustomList with {len(self.items)} items: {self.items}"

## 测试 CustomList 类
custom_list = CustomList([1, 2, 3])
custom_list.append("hello")
custom_list.append(Person("测试", 20))

print(f"CustomList repr: {repr(custom_list)}")
print(f"CustomList str: {str(custom_list)}")

## 4. 数据类的 repr 实现
print("\n4. 数据类的 repr 实现:")

from dataclasses import dataclass
from typing import List, Optional

@dataclass
class Product:
    """产品数据类,自动生成 repr。"""
    name: str
    price: float
    category: str
    tags: List[str] = None
    description: Optional[str] = None
    
    def __post_init__(self):
        if self.tags is None:
            self.tags = []

## 测试 Product 数据类
product = Product(
    name="iPhone 14",
    price=7999.0,
    category="电子产品",
    tags=["手机", "苹果", "5G"],
    description="最新款 iPhone"
)

print(f"Product repr: {repr(product)}")
print(f"Product str: {str(product)}")

## 5. 自定义 repr 的最佳实践
print("\n5. 自定义 repr 的最佳实践:")

class Point:
    """点类,演示 repr 最佳实践。"""
    
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __repr__(self):
        """返回明确的、可执行的字符串表示。"""
#        # 使用类名和参数,确保可重建
        return f"{self.__class__.__name__}({self.x!r}, {self.y!r})"
    
    def __str__(self):
        """返回用户友好的字符串表示。"""
        return f"({self.x}, {self.y})"
    
    def __eq__(self, other):
        """相等性比较。"""
        if isinstance(other, Point):
            return self.x == other.x and self.y == other.y
        return False

class Point3D(Point):
    """3D 点类,继承 Point。"""
    
    def __init__(self, x, y, z):
        super().__init__(x, y)
        self.z = z
    
    def __repr__(self):
        """3D 点的 repr 实现。"""
        return f"{self.__class__.__name__}({self.x!r}, {self.y!r}, {self.z!r})"
    
    def __str__(self):
        return f"({self.x}, {self.y}, {self.z})"

## 测试 Point 类
point2d = Point(3, 4)
point3d = Point3D(1, 2, 3)

print(f"2D 点 repr: {repr(point2d)}")
print(f"2D 点 str: {str(point2d)}")
print(f"3D 点 repr: {repr(point3d)}")
print(f"3D 点 str: {str(point3d)}")

## 验证 repr 的可执行性
print("\n 验证 repr 的可执行性:")
repr_2d = repr(point2d)
repr_3d = repr(point3d)

print(f"2D 点 repr: {repr_2d}")
print(f"3D 点 repr: {repr_3d}")

## 重建对象
rebuilt_2d = eval(repr_2d)
rebuilt_3d = eval(repr_3d)

print(f"重建 2D 点: {rebuilt_2d}")
print(f"重建 3D 点: {rebuilt_3d}")
print(f"2D 点相等: {point2d == rebuilt_2d}")
print(f"3D 点相等: {point3d == rebuilt_3d}")
```

### 高级应用

```python
## repr()高级应用示例
print("\n" + "="*50)
print("repr()高级应用:")

## 1. 调试工具
print("\n1. 调试工具:")

class DebugHelper:
    """调试辅助工具。"""
    
    @staticmethod
    def debug_vars(**kwargs):
        """打印变量的调试信息。"""
        print("调试信息:")
        for name, value in kwargs.items():
            print(f"  {name} = {repr(value)} (type: {type(value).__name__})")
    
    @staticmethod
    def compare_objects(obj1, obj2, name1="obj1", name2="obj2"):
        """比较两个对象。"""
        print(f"对象比较:")
        print(f"  {name1}: {repr(obj1)}")
        print(f"  {name2}: {repr(obj2)}")
        print(f"  相等: {obj1 == obj2}")
        print(f"  同一对象: {obj1 is obj2}")
        print(f"  类型相同: {type(obj1) == type(obj2)}")
    
    @staticmethod
    def inspect_object(obj, max_attrs=10):
        """检查对象的属性。"""
        print(f"对象检查: {repr(obj)}")
        print(f"类型: {type(obj).__name__}")
        
#        # 获取属性
        attrs = [attr for attr in dir(obj) if not attr.startswith('_')]
        if len(attrs) > max_attrs:
            attrs = attrs[:max_attrs]
            truncated = True
        else:
            truncated = False
        
        print("公共属性:")
        for attr in attrs:
            try:
                value = getattr(obj, attr)
                print(f"  {attr}: {repr(value)}")
            except Exception as e:
                print(f"  {attr}: <无法访问: {e}>")
        
        if truncated:
            print(f"  ... (还有 {len(dir(obj)) - len(attrs)} 个属性)")

## 使用调试工具
test_data = {
    'numbers': [1, 2, 3.14, complex(1, 2)],
    'strings': ['hello', 'world\n', '中文'],
    'nested': {'a': [1, 2], 'b': {'c': 3}}
}

DebugHelper.debug_vars(
    test_list=[1, 2, 3],
    test_dict={'key': 'value'},
    test_str="hello\nworld",
    test_data=test_data
)

## 比较对象
list1 = [1, 2, 3]
list2 = [1, 2, 3]
list3 = list1

DebugHelper.compare_objects(list1, list2, "list1", "list2")
DebugHelper.compare_objects(list1, list3, "list1", "list3")

## 检查对象
DebugHelper.inspect_object(test_data)

## 2. 序列化和反序列化
print("\n2. 序列化和反序列化:")

class SerializableObject:
    """可序列化对象基类。"""
    
    def __repr__(self):
        """返回可重建对象的字符串表示。"""
#        # 获取所有非私有属性
        attrs = {k: v for k, v in self.__dict__.items() if not k.startswith('_')}
        attr_strs = [f"{k}={v!r}" for k, v in attrs.items()]
        return f"{self.__class__.__name__}({', '.join(attr_strs)})"
    
    @classmethod
    def from_repr(cls, repr_str):
        """从 repr 字符串重建对象。"""
        try:
            return eval(repr_str)
        except Exception as e:
            raise ValueError(f"无法从 repr 字符串重建对象: {e}")
    
    def serialize(self):
        """序列化对象。"""
        return repr(self)
    
    @classmethod
    def deserialize(cls, data):
        """反序列化对象。"""
        return cls.from_repr(data)

class Configuration(SerializableObject):
    """配置类示例。"""
    
    def __init__(self, host="localhost", port=8080, debug=False, features=None):
        self.host = host
        self.port = port
        self.debug = debug
        self.features = features or []

## 测试序列化
config = Configuration(
    host="example.com",
    port=443,
    debug=True,
    features=["ssl", "cache", "logging"]
)

print(f"原始配置: {config}")

## 序列化
serialized = config.serialize()
print(f"序列化数据: {serialized}")

## 反序列化
deserialized = Configuration.deserialize(serialized)
print(f"反序列化配置: {deserialized}")

## 验证
print(f"序列化成功: {config.host == deserialized.host and config.port == deserialized.port}")

## 3. 对象缓存和记忆化
print("\n3. 对象缓存和记忆化:")

class CachedObject:
    """带缓存的对象。"""
    
    _cache = {}
    
    def __new__(cls, *args, **kwargs):
#        # 使用 repr 作为缓存键
        key = f"{cls.__name__}({', '.join(map(repr, args))}, {', '.join(f'{k}={v!r}' for k, v in kwargs.items())})"
        
        if key not in cls._cache:
            instance = super().__new__(cls)
            cls._cache[key] = instance
            print(f"创建新对象: {key}")
        else:
            print(f"使用缓存对象: {key}")
        
        return cls._cache[key]
    
    def __init__(self, value):
        if not hasattr(self, '_initialized'):
            self.value = value
            self._initialized = True
    
    def __repr__(self):
        return f"{self.__class__.__name__}({self.value!r})"
    
    @classmethod
    def clear_cache(cls):
        """清空缓存。"""
        cls._cache.clear()
        print("缓存已清空")
    
    @classmethod
    def cache_info(cls):
        """获取缓存信息。"""
        print(f"缓存大小: {len(cls._cache)}")
        for key in cls._cache:
            print(f"  {key}")

## 测试对象缓存
print("创建对象:")
obj1 = CachedObject("hello")
obj2 = CachedObject("world")
obj3 = CachedObject("hello")  # 应该使用缓存

print(f"\nobj1 is obj3: {obj1 is obj3}")
print(f"obj1 == obj3: {obj1 == obj3}")

CachedObject.cache_info()

## 4. 动态代码生成
print("\n4. 动态代码生成:")

class CodeGenerator:
    """代码生成器。"""
    
    @staticmethod
    def generate_class_code(class_name, attributes, methods=None):
        """
        生成类的代码。
        
        参数:
            class_name (str): 类名
            attributes (dict): 属性字典
            methods (dict, optional): 方法字典
        
        返回:
            str: 生成的类代码
        """
        lines = [f"class {class_name}:"]
        lines.append('    """动态生成的类。"""')
        lines.append("")
        
#        # 生成__init__方法
        init_params = ["self"] + [f"{name}=None" for name in attributes.keys()]
        lines.append(f"    def __init__({', '.join(init_params)}):")
        for name, default_value in attributes.items():
            lines.append(f"        self.{name} = {name} if {name} is not None else {default_value!r}")
        lines.append("")
        
#        # 生成__repr__方法
        {% raw %}
attr_reprs = [f"{name}={{self.{name}!r}}" for name in attributes.keys()]
{% endraw %}
        repr_format = f"{class_name}(" + ", ".join(attr_reprs) + ")"
        lines.append("    def __repr__(self):")
        lines.append(f'        return f"{repr_format}"')
        lines.append("")
        
#        # 生成其他方法
        if methods:
            for method_name, method_code in methods.items():
                lines.append(f"    def {method_name}(self):")
                for line in method_code.split('\n'):
                    lines.append(f"        {line}")
                lines.append("")
        
        return '\n'.join(lines)
    
    @staticmethod
    def create_class_from_data(class_name, data_samples):
        """
        从数据样本创建类。
        
        参数:
            class_name (str): 类名
            data_samples (list): 数据样本列表
        
        返回:
            str: 生成的类代码
        """
        if not data_samples:
            return f"class {class_name}: pass"
        
#        # 分析数据样本,提取属性
        all_keys = set()
        for sample in data_samples:
            if isinstance(sample, dict):
                all_keys.update(sample.keys())
        
#        # 确定默认值
        attributes = {}
        for key in all_keys:
            values = [sample.get(key) for sample in data_samples if isinstance(sample, dict) and key in sample]
            if values:
#                # 使用第一个非 None 值作为默认值
                default_value = next((v for v in values if v is not None), None)
                attributes[key] = default_value
            else:
                attributes[key] = None
        
        return CodeGenerator.generate_class_code(class_name, attributes)

## 测试代码生成
print("生成简单类:")
simple_class_code = CodeGenerator.generate_class_code(
    "Person",
    {"name": "Unknown", "age": 0, "email": None}
)
print(simple_class_code)

print("\n 从数据生成类:")
user_data = [
    {"username": "alice", "email": "alice@example.com", "age": 25},
    {"username": "bob", "email": "bob@example.com", "age": 30, "city": "Beijing"},
    {"username": "charlie", "age": 28}
]

user_class_code = CodeGenerator.create_class_from_data("User", user_data)
print(user_class_code)

## 执行生成的代码
print("\n 执行生成的代码:")
exec(user_class_code)

## 创建 User 实例
user1 = User(username="test_user", email="test@example.com", age=35)
print(f"生成的用户对象: {repr(user1)}")
```

## ⚠️ 常见陷阱与最佳实践

### repr()使用注意事项

```python
## repr()使用注意事项
print("\nrepr()使用注意事项:")

## 1. repr()与 str()的区别
print("1. repr()与 str()的区别:")

class DemoClass:
    """演示 repr 和 str 区别的类。"""
    
    def __init__(self, value):
        self.value = value
    
    def __repr__(self):
#        # repr 应该明确、无歧义,适合开发者
        return f"DemoClass(value={self.value!r})"
    
    def __str__(self):
#        # str 应该易读、用户友好
        return f"Demo 对象,值为: {self.value}"

demo = DemoClass("test\nvalue")
print(f"repr(): {repr(demo)}")
print(f"str(): {str(demo)}")
print(f"print(): {demo}")  # 默认使用 str()

## 在容器中的表现
demo_list = [demo]
print(f"列表中的 repr: {demo_list}")  # 容器总是使用 repr

## 2. 循环引用问题
print("\n2. 循环引用问题:")

class Node:
    """演示循环引用的节点类。"""
    
    def __init__(self, value):
        self.value = value
        self.parent = None
        self.children = []
    
    def add_child(self, child):
        """添加子节点。"""
        child.parent = self
        self.children.append(child)
    
    def __repr__(self):
#        # 避免循环引用导致的无限递归
        parent_info = f"parent={self.parent.value!r}" if self.parent else "parent=None"
        children_info = f"children=[{', '.join(child.value for child in self.children)}]"
        return f"Node(value={self.value!r}, {parent_info}, {children_info})"

## 创建有循环引用的结构
root = Node("root")
child1 = Node("child1")
child2 = Node("child2")

root.add_child(child1)
root.add_child(child2)

print(f"根节点: {repr(root)}")
print(f"子节点: {repr(child1)}")

## 3. 大对象的 repr 性能问题
print("\n3. 大对象的 repr 性能问题:")

class LargeDataContainer:
    """大数据容器类。"""
    
    def __init__(self, data):
        self.data = data
    
    def __repr__(self):
#        # 对于大数据,限制 repr 的输出长度
        if len(self.data) <= 10:
            return f"LargeDataContainer({self.data!r})"
        else:
            preview = self.data[:3] + ['...'] + self.data[-3:]
            return f"LargeDataContainer({preview!r} # {len(self.data)} items total)"
    
    def __str__(self):
        return f"LargeDataContainer with {len(self.data)} items"

## 测试大数据容器
small_container = LargeDataContainer([1, 2, 3])
large_container = LargeDataContainer(list(range(1000)))

print(f"小容器: {repr(small_container)}")
print(f"大容器: {repr(large_container)}")

## 4. 安全性考虑
print("\n4. 安全性考虑:")

class SecureObject:
    """安全对象,不在 repr 中暴露敏感信息。"""
    
    def __init__(self, username, password, api_key):
        self.username = username
        self._password = password  # 私有属性
        self._api_key = api_key
    
    def __repr__(self):
#        # 不暴露敏感信息
        return f"SecureObject(username={self.username!r}, password='***', api_key='***')"
    
    def __str__(self):
        return f"用户: {self.username}"

secure_obj = SecureObject("admin", "secret123", "api_key_12345")
print(f"安全对象: {repr(secure_obj)}")

## 5. 最佳实践示例
print("\n5. 最佳实践示例:")

class BestPracticeClass:
    """展示 repr 最佳实践的类。"""
    
    def __init__(self, name, value, metadata=None):
        self.name = name
        self.value = value
        self.metadata = metadata or {}
    
    def __repr__(self):
#        # 最佳实践:
#        # 1. 使用类名
#        # 2. 包含所有重要参数
#        # 3. 使用!r 确保正确转义
#        # 4. 格式清晰易读
#        # 5. 理想情况下可以重建对象
        
        args = [f"name={self.name!r}", f"value={self.value!r}"]
        if self.metadata:
            args.append(f"metadata={self.metadata!r}")
        
        return f"{self.__class__.__name__}({', '.join(args)})"
    
    def __str__(self):
        return f"{self.name}: {self.value}"
    
    def __eq__(self, other):
        if isinstance(other, BestPracticeClass):
            return (self.name == other.name and 
                   self.value == other.value and 
                   self.metadata == other.metadata)
        return False

## 测试最佳实践
best_obj = BestPracticeClass("test", 42, {"type": "integer", "unit": "count"})
print(f"最佳实践对象: {repr(best_obj)}")

## 验证可重建性
repr_str = repr(best_obj)
rebuilt_obj = eval(repr_str)
print(f"重建对象: {repr(rebuilt_obj)}")
print(f"对象相等: {best_obj == rebuilt_obj}")

## 6. 调试辅助工具
print("\n6. 调试辅助工具:")

class ReprHelper:
    """repr 辅助工具。"""
    
    @staticmethod
    def safe_repr(obj, max_length=100):
        """
        安全的 repr,限制长度。
        
        参数:
            obj: 要表示的对象
            max_length (int): 最大长度
        
        返回:
            str: 安全的 repr 字符串
        """
        try:
            repr_str = repr(obj)
            if len(repr_str) <= max_length:
                return repr_str
            else:
                return repr_str[:max_length-3] + "..."
        except Exception as e:
            return f"<repr failed: {e}>"
    
    @staticmethod
    def compare_repr_str(obj1, obj2):
        """
        比较两个对象的 repr 和 str。
        
        参数:
            obj1, obj2: 要比较的对象
        """
        print(f"对象 1 repr: {ReprHelper.safe_repr(obj1)}")
        print(f"对象 1 str:  {str(obj1)}")
        print(f"对象 2 repr: {ReprHelper.safe_repr(obj2)}")
        print(f"对象 2 str:  {str(obj2)}")
        print(f"repr 相等: {repr(obj1) == repr(obj2)}")
        print(f"str 相等:  {str(obj1) == str(obj2)}")
        print(f"对象相等: {obj1 == obj2}")
    
    @staticmethod
    def analyze_repr(obj):
        """
        分析对象的 repr 特性。
        
        参数:
            obj: 要分析的对象
        """
        repr_str = repr(obj)
        str_str = str(obj)
        
        print(f"对象类型: {type(obj).__name__}")
        print(f"repr 长度: {len(repr_str)}")
        print(f"str 长度:  {len(str_str)}")
        print(f"repr: {ReprHelper.safe_repr(obj)}")
        print(f"str:  {str_str}")
        print(f"repr==str: {repr_str == str_str}")
        
#        # 检查是否可以重建
        try:
            rebuilt = eval(repr_str)
            print(f"可重建: 是")
            print(f"重建后相等: {obj == rebuilt}")
        except Exception as e:
            print(f"可重建: 否 ({e})")

## 测试辅助工具
test_objects = [
    42,
    "hello\nworld",
    [1, 2, 3],
    {'a': 1, 'b': 2},
    best_obj,
    large_container
]

for i, obj in enumerate(test_objects):
    print(f"\n--- 对象 {i+1} ---")
    ReprHelper.analyze_repr(obj)
```

## 🔗 相关函数和模块

### 内置函数
- `str()` - 返回对象的字符串表示
- `format()` - 格式化对象
- `print()` - 打印输出
- `eval()` - 执行字符串表达式
- `type()` - 获取对象类型

### 特殊方法
- `__repr__()` - 定义对象的官方字符串表示
- `__str__()` - 定义对象的非正式字符串表示
- `__format__()` - 定义对象的格式化方式

### 标准库模块
- `pprint` - 美观打印
- `inspect` - 对象检查
- `dataclasses` - 数据类
- `json` - JSON 编码和解码
- `pickle` - 对象序列化

### 第三方库
- `rich` - 富文本和美观的终端输出
- `prettyprinter` - 美观的对象打印
- `devtools` - 开发调试工具

## 📚 扩展阅读

- [Python 数据模型 - 特殊方法](https://docs.python.org/3/reference/datamodel.html#special-method-names)
- [repr()函数文档](https://docs.python.org/3/library/functions.html#repr)
- [字符串表示最佳实践](https://docs.python.org/3/tutorial/classes.html#odds-and-ends)
- [调试技巧和工具](https://realpython.com/python-debugging-pdb/)

## 🏷️ 标签

`repr` `字符串表示` `调试` `对象检查` `序列化` `开发工具` `特殊方法` `代码生成`