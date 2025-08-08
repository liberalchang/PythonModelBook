---
layout: doc
title: typing 模块：类型提示
permalink: /docs/stdlib/typing/
category: stdlib
tags: [typing, 类型提示, 类型检查, 泛型, 静态分析]
description: Python typing 模块提供类型提示支持，增强代码可读性和静态类型检查
author: Python 文档团队
date: 2024-01-15
updated: 2024-01-15
version: 1.0
difficulty: "中级"
---

# typing 模块：类型提示

## 📝 概述

Python 的`typing`模块为类型提示(Type Hints)提供运行时支持。从 Python 3.5 版本开始，typing 作为标准库引入，支持函数注解功能，可以配合类型检查工具如 mypy 实现静态类型检查。

**重要提示**：类型提示对程序运行没有任何影响，仅用于静态分析和代码文档化。

## 🎯 学习目标

- 理解类型提示的概念和作用
- 掌握基本类型注解的使用方法
- 学会使用泛型类型和类型变量
- 了解联合类型和可选类型
- 掌握复杂类型的定义和使用

## 📋 前置知识

- Python 基础语法
- 函数定义和调用
- 面向对象编程基础
- 装饰器的基本概念

## 🔍 详细内容

### 基本概念

类型提示是一种为 Python 代码添加类型信息的方式，主要优势：

- **代码可读性**：明确函数参数和返回值的类型
- **静态检查**：配合工具进行类型检查，提前发现错误
- **IDE 支持**：提供更好的代码补全和错误提示
- **文档化**：类型信息本身就是很好的文档

### 核心类型和工具

| 类型/工具 | 说明 |
|-----------|------|
| Any | 任意类型 |
| Union | 联合类型 |
| Optional | 可选类型 |
| List, Dict, Tuple | 容器类型 |
| Callable | 可调用类型 |
| TypeVar | 类型变量 |
| Generic | 泛型基类 |
| Literal | 字面量类型 |
| TypedDict | 类型化字典 |
| NewType | 新类型定义 |

## 💡 实际应用

### 基础类型注解

```python
from typing import List, Dict, Tuple, Optional

## 基本类型注解
def greet(name: str) -> str:
    """问候函数"""
    return f"Hello, {name}!"

## 容器类型注解
def process_numbers(numbers: List[int]) -> Dict[str, int]:
    """处理数字列表,返回统计信息"""
    return {
        "count": len(numbers),
        "sum": sum(numbers),
        "max": max(numbers) if numbers else 0,
        "min": min(numbers) if numbers else 0
    }

## 元组类型注解
def get_coordinates() -> Tuple[float, float]:
    """获取坐标点"""
    return (3.14, 2.71)

## 使用示例
result = greet("张三")
print(result)  # Hello, 张三!

stats = process_numbers([1, 2, 3, 4, 5])
print(stats)  # {'count': 5, 'sum': 15, 'max': 5, 'min': 1}

coords = get_coordinates()
print(f"坐标: ({coords[0]}, {coords[1]})")  # 坐标: (3.14, 2.71)
```

### 类型别名

```python
from typing import List, Dict

## 定义类型别名
Vector = List[float]
Matrix = List[Vector]
StudentGrades = Dict[str, List[int]]

def scale_vector(scalar: float, vector: Vector) -> Vector:
    """向量缩放"""
    return [scalar * num for num in vector]

def multiply_matrices(a: Matrix, b: Matrix) -> Matrix:
    """矩阵乘法(简化版)"""
#    # 简化实现,仅作示例
    if not a or not b or len(a[0]) != len(b):
        return []
    
    result = []
    for i in range(len(a)):
        row = []
        for j in range(len(b[0])):
            sum_val = sum(a[i][k] * b[k][j] for k in range(len(b)))
            row.append(sum_val)
        result.append(row)
    return result

def calculate_average_grade(grades: StudentGrades) -> Dict[str, float]:
    """计算学生平均成绩"""
    return {
        student: sum(scores) / len(scores) if scores else 0.0
        for student, scores in grades.items()
    }

## 使用示例
vec = [1.0, 2.0, 3.0]
scaled = scale_vector(2.0, vec)
print(f"缩放后的向量: {scaled}")  # 缩放后的向量: [2.0, 4.0, 6.0]

student_data: StudentGrades = {
    "张三": [85, 90, 78],
    "李四": [92, 88, 95],
    "王五": [76, 82, 89]
}
averages = calculate_average_grade(student_data)
for student, avg in averages.items():
    print(f"{student}的平均成绩: {avg:.2f}")
```

### NewType 的使用

```python
from typing import NewType

## 创建新类型
UserId = NewType('UserId', int)
ProductId = NewType('ProductId', int)
Price = NewType('Price', float)

def get_user_info(user_id: UserId) -> str:
    """获取用户信息"""
    return f"用户 ID: {user_id}"

def get_product_price(product_id: ProductId) -> Price:
    """获取产品价格"""
#    # 模拟数据库查询
    prices = {1001: 99.99, 1002: 149.99, 1003: 79.99}
    return Price(prices.get(product_id, 0.0))

def calculate_total(price: Price, quantity: int) -> Price:
    """计算总价"""
    return Price(price * quantity)

## 使用示例
user = UserId(12345)
product = ProductId(1001)

user_info = get_user_info(user)
print(user_info)  # 用户 ID: 12345

unit_price = get_product_price(product)
total_price = calculate_total(unit_price, 3)
print(f"单价: {unit_price}, 总价: {total_price}")  # 单价: 99.99, 总价: 299.97

## NewType 提供类型安全
## get_user_info(product)  # 类型检查器会报错
```

### Any 类型

```python
from typing import Any, List

def process_data(data: Any) -> str:
    """处理任意类型的数据"""
    if isinstance(data, str):
        return f"字符串: {data}"
    elif isinstance(data, (int, float)):
        return f"数字: {data}"
    elif isinstance(data, list):
        return f"列表,长度: {len(data)}"
    else:
        return f"其他类型: {type(data).__name__}"

def flexible_function(value: Any) -> Any:
    """灵活的函数,可以处理任何类型"""
#    # Any 类型可以赋值给任何其他类型
    result: str = str(value)  # 不会有类型检查错误
    return result

## 使用示例
print(process_data("Hello"))      # 字符串: Hello
print(process_data(42))           # 数字: 42
print(process_data([1, 2, 3]))    # 列表,长度: 3
print(process_data({"key": "value"}))  # 其他类型: dict
```

### Union 和 Optional

```python
from typing import Union, Optional, List

## Union 类型:可以是多种类型之一
def format_value(value: Union[int, float, str]) -> str:
    """格式化不同类型的值"""
    if isinstance(value, (int, float)):
        return f"数值: {value:.2f}"
    else:
        return f"文本: {value}"

## Optional 类型:可以是指定类型或 None
def find_user(user_id: int) -> Optional[str]:
    """查找用户,可能返回 None"""
    users = {1: "张三", 2: "李四", 3: "王五"}
    return users.get(user_id)

def safe_divide(a: float, b: float) -> Optional[float]:
    """安全除法,除零时返回 None"""
    if b == 0:
        return None
    return a / b

def process_optional_list(items: Optional[List[int]]) -> int:
    """处理可选的列表"""
    if items is None:
        return 0
    return sum(items)

## 使用示例
print(format_value(3.14159))    # 数值: 3.14
print(format_value("Hello"))    # 文本: Hello

user = find_user(1)
if user:
    print(f"找到用户: {user}")   # 找到用户: 张三
else:
    print("用户不存在")

result = safe_divide(10, 2)
if result is not None:
    print(f"除法结果: {result}")  # 除法结果: 5.0

print(process_optional_list([1, 2, 3]))  # 6
print(process_optional_list(None))       # 0
```

### Callable 类型

```python
from typing import Callable, List

## 定义函数类型
MathOperation = Callable[[float, float], float]
Validator = Callable[[str], bool]
Transformer = Callable[[List[int]], List[int]]

def add(x: float, y: float) -> float:
    """加法运算"""
    return x + y

def multiply(x: float, y: float) -> float:
    """乘法运算"""
    return x * y

def apply_operation(a: float, b: float, operation: MathOperation) -> float:
    """应用数学运算"""
    return operation(a, b)

def is_email(text: str) -> bool:
    """简单的邮箱验证"""
    return "@" in text and "." in text

def is_phone(text: str) -> bool:
    """简单的电话验证"""
    return text.isdigit() and len(text) >= 10

def validate_input(value: str, validator: Validator) -> bool:
    """验证输入"""
    return validator(value)

def double_values(numbers: List[int]) -> List[int]:
    """将所有数字翻倍"""
    return [x * 2 for x in numbers]

def filter_even(numbers: List[int]) -> List[int]:
    """过滤偶数"""
    return [x for x in numbers if x % 2 == 0]

def transform_list(data: List[int], transformer: Transformer) -> List[int]:
    """转换列表"""
    return transformer(data)

## 使用示例
print(apply_operation(5, 3, add))       # 8.0
print(apply_operation(5, 3, multiply))  # 15.0

print(validate_input("test@example.com", is_email))  # True
print(validate_input("1234567890", is_phone))        # True

numbers = [1, 2, 3, 4, 5]
print(transform_list(numbers, double_values))  # [2, 4, 6, 8, 10]
print(transform_list(numbers, filter_even))    # [2, 4]
```

### TypeVar 和泛型

```python
from typing import TypeVar, Generic, List, Optional

## 定义类型变量
T = TypeVar('T')
K = TypeVar('K')
V = TypeVar('V')

## 泛型函数
def first_element(items: List[T]) -> Optional[T]:
    """获取列表的第一个元素"""
    return items[0] if items else None

def last_element(items: List[T]) -> Optional[T]:
    """获取列表的最后一个元素"""
    return items[-1] if items else None

def swap_pair(a: T, b: T) -> tuple[T, T]:
    """交换两个相同类型的值"""
    return b, a

## 泛型类
class Stack(Generic[T]):
    """泛型栈实现"""
    
    def __init__(self) -> None:
        self._items: List[T] = []
    
    def push(self, item: T) -> None:
        """入栈"""
        self._items.append(item)
    
    def pop(self) -> Optional[T]:
        """出栈"""
        return self._items.pop() if self._items else None
    
    def peek(self) -> Optional[T]:
        """查看栈顶元素"""
        return self._items[-1] if self._items else None
    
    def is_empty(self) -> bool:
        """检查栈是否为空"""
        return len(self._items) == 0
    
    def size(self) -> int:
        """获取栈的大小"""
        return len(self._items)

class KeyValueStore(Generic[K, V]):
    """泛型键值存储"""
    
    def __init__(self) -> None:
        self._data: dict[K, V] = {}
    
    def set(self, key: K, value: V) -> None:
        """设置键值对"""
        self._data[key] = value
    
    def get(self, key: K) -> Optional[V]:
        """获取值"""
        return self._data.get(key)
    
    def keys(self) -> List[K]:
        """获取所有键"""
        return list(self._data.keys())
    
    def values(self) -> List[V]:
        """获取所有值"""
        return list(self._data.values())

## 使用示例
print(first_element([1, 2, 3]))      # 1
print(first_element(["a", "b"]))     # a
print(last_element([1.1, 2.2]))      # 2.2

a, b = swap_pair("hello", "world")
print(f"交换后: {a}, {b}")  # 交换后: world, hello

## 使用泛型栈
int_stack: Stack[int] = Stack()
int_stack.push(1)
int_stack.push(2)
int_stack.push(3)
print(f"栈顶元素: {int_stack.peek()}")  # 栈顶元素: 3
print(f"出栈: {int_stack.pop()}")       # 出栈: 3

str_stack: Stack[str] = Stack()
str_stack.push("Python")
str_stack.push("typing")
print(f"字符串栈大小: {str_stack.size()}")  # 字符串栈大小: 2

## 使用泛型键值存储
user_store: KeyValueStore[int, str] = KeyValueStore()
user_store.set(1, "张三")
user_store.set(2, "李四")
print(f"用户 1: {user_store.get(1)}")  # 用户 1: 张三

config_store: KeyValueStore[str, bool] = KeyValueStore()
config_store.set("debug", True)
config_store.set("production", False)
print(f"配置项: {config_store.keys()}")  # 配置项: ['debug', 'production']
```

### Literal 类型

```python
from typing import Literal, Union

## 字面量类型
Mode = Literal["read", "write", "append"]
LogLevel = Literal["DEBUG", "INFO", "WARNING", "ERROR"]
Direction = Literal["up", "down", "left", "right"]

def open_file(filename: str, mode: Mode) -> str:
    """打开文件"""
    return f"以{mode}模式打开文件: {filename}"

def log_message(message: str, level: LogLevel = "INFO") -> None:
    """记录日志"""
    print(f"[{level}] {message}")

def move_character(direction: Direction, steps: int = 1) -> str:
    """移动角色"""
    return f"向{direction}移动{steps}步"

## 布尔字面量
def validate_data(data: str, strict: Literal[True]) -> bool:
    """严格验证模式"""
    return len(data) > 0 and data.isalnum()

def validate_data_flexible(data: str, strict: Literal[False]) -> bool:
    """宽松验证模式"""
    return len(data) > 0

## 数字字面量
HttpStatus = Literal[200, 404, 500]

def handle_response(status: HttpStatus) -> str:
    """处理 HTTP 响应"""
    if status == 200:
        return "请求成功"
    elif status == 404:
        return "资源未找到"
    elif status == 500:
        return "服务器错误"
    else:
        return "未知状态"  # 这行代码永远不会执行

## 使用示例
print(open_file("data.txt", "read"))     # 以 read 模式打开文件: data.txt
log_message("系统启动", "INFO")           # [INFO] 系统启动
log_message("发生错误", "ERROR")          # [ERROR] 发生错误

print(move_character("up", 3))           # 向 up 移动 3 步
print(move_character("left"))            # 向 left 移动 1 步

print(validate_data("abc123", True))     # True
print(validate_data_flexible("hello!", False))  # True

print(handle_response(200))              # 请求成功
print(handle_response(404))              # 资源未找到
```

### TypedDict

```python
from typing import TypedDict, List, Optional

## 定义类型化字典
class Person(TypedDict):
    name: str
    age: int
    email: str

class Product(TypedDict):
    id: int
    name: str
    price: float
    in_stock: bool

class Order(TypedDict):
    order_id: str
    customer: Person
    items: List[Product]
    total: float
    status: Literal["pending", "processing", "shipped", "delivered"]

## 可选字段的 TypedDict
class UserProfile(TypedDict, total=False):
    username: str      # 必需字段
    email: str         # 必需字段
    phone: Optional[str]     # 可选字段
    address: Optional[str]   # 可选字段
    bio: Optional[str]       # 可选字段

def create_person(name: str, age: int, email: str) -> Person:
    """创建人员信息"""
    return {
        "name": name,
        "age": age,
        "email": email
    }

def calculate_order_total(items: List[Product]) -> float:
    """计算订单总额"""
    return sum(item["price"] for item in items if item["in_stock"])

def process_order(order: Order) -> str:
    """处理订单"""
    customer_name = order["customer"]["name"]
    item_count = len(order["items"])
    total = order["total"]
    status = order["status"]
    
    return f"客户{customer_name}的订单包含{item_count}件商品,总额{total:.2f}元,状态:{status}"

def update_user_profile(profile: UserProfile, **updates) -> UserProfile:
    """更新用户资料"""
    updated_profile = profile.copy()
    for key, value in updates.items():
        if key in UserProfile.__annotations__:
            updated_profile[key] = value
    return updated_profile

## 使用示例
person1 = create_person("张三", 30, "zhangsan@example.com")
print(f"创建用户: {person1['name']}, 年龄: {person1['age']}")

products: List[Product] = [
    {"id": 1, "name": "笔记本电脑", "price": 5999.99, "in_stock": True},
    {"id": 2, "name": "无线鼠标", "price": 199.99, "in_stock": True},
    {"id": 3, "name": "机械键盘", "price": 899.99, "in_stock": False}
]

total_amount = calculate_order_total(products)
print(f"可购买商品总额: {total_amount:.2f}元")

order: Order = {
    "order_id": "ORD-2024-001",
    "customer": person1,
    "items": products[:2],  # 只包含有库存的商品
    "total": 6199.98,
    "status": "pending"
}

print(process_order(order))

## 用户资料示例
user_profile: UserProfile = {
    "username": "zhangsan",
    "email": "zhangsan@example.com"
}

updated_profile = update_user_profile(
    user_profile, 
    phone="13800138000", 
    bio="Python 开发者"
)
print(f"更新后的资料: {updated_profile}")
```

### 实际案例：API 响应处理

```python
from typing import TypedDict, List, Optional, Union, Literal
import json

## 定义 API 响应类型
class ApiResponse(TypedDict):
    success: bool
    message: str
    data: Optional[dict]
    errors: Optional[List[str]]

class UserData(TypedDict):
    id: int
    username: str
    email: str
    created_at: str
    is_active: bool

class PaginationInfo(TypedDict):
    page: int
    per_page: int
    total: int
    pages: int

class UserListResponse(TypedDict):
    success: bool
    data: List[UserData]
    pagination: PaginationInfo

## API 状态类型
ApiStatus = Literal["success", "error", "loading"]
HttpMethod = Literal["GET", "POST", "PUT", "DELETE"]

class ApiClient:
    """API 客户端类"""
    
    def __init__(self, base_url: str) -> None:
        self.base_url = base_url
    
    def make_request(self, 
                    endpoint: str, 
                    method: HttpMethod = "GET", 
                    data: Optional[dict] = None) -> ApiResponse:
        """发送 API 请求"""
#        # 模拟 API 请求
        if endpoint == "/users" and method == "GET":
            return {
                "success": True,
                "message": "用户列表获取成功",
                "data": {
                    "users": [
                        {
                            "id": 1,
                            "username": "zhangsan",
                            "email": "zhangsan@example.com",
                            "created_at": "2024-01-01T00:00:00Z",
                            "is_active": True
                        }
                    ]
                },
                "errors": None
            }
        else:
            return {
                "success": False,
                "message": "请求失败",
                "data": None,
                "errors": ["端点不存在"]
            }
    
    def get_users(self, page: int = 1, per_page: int = 10) -> UserListResponse:
        """获取用户列表"""
#        # 模拟分页用户数据
        users: List[UserData] = [
            {
                "id": i,
                "username": f"user{i}",
                "email": f"user{i}@example.com",
                "created_at": "2024-01-01T00:00:00Z",
                "is_active": True
            }
            for i in range(1, per_page + 1)
        ]
        
        return {
            "success": True,
            "data": users,
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": 100,
                "pages": 10
            }
        }

def handle_api_response(response: ApiResponse) -> str:
    """处理 API 响应"""
    if response["success"]:
        return f"请求成功: {response['message']}"
    else:
        errors = response.get("errors", [])
        error_msg = ", ".join(errors) if errors else "未知错误"
        return f"请求失败: {error_msg}"

def format_user_info(user: UserData) -> str:
    """格式化用户信息"""
    status = "活跃" if user["is_active"] else "非活跃"
    return f"用户 {user['username']} ({user['email']}) - {status}"

## 使用示例
client = ApiClient("https://api.example.com")

## 获取用户列表
user_response = client.get_users(page=1, per_page=5)
if user_response["success"]:
    users = user_response["data"]
    pagination = user_response["pagination"]
    
    print(f"获取到 {len(users)} 个用户 (第{pagination['page']}页,共{pagination['pages']}页)")
    for user in users:
        print(f"  - {format_user_info(user)}")
else:
    print("获取用户列表失败")

## 测试 API 请求
api_response = client.make_request("/users", "GET")
print(handle_api_response(api_response))
```

## ⚠️ 注意事项

- **运行时无影响**：类型提示不会影响程序的实际运行
- **工具支持**：需要配合 mypy、PyCharm 等工具才能发挥作用
- **渐进式采用**：可以逐步为现有代码添加类型提示
- **性能考虑**：复杂的类型检查可能影响导入时间
- **版本兼容性**：某些特性需要较新的 Python 版本
- **泛型限制**：过度使用泛型可能使代码复杂化

## 🔗 相关内容

- [dataclasses 模块](../dataclasses/) - 数据类与类型提示
- [abc 模块](../abc/) - 抽象基类
- [functools 模块](../functools/) - 函数工具

## 📚 扩展阅读

- [Python 官方文档 - typing 模块](https://docs.python.org/3/library/typing.html)
- [PEP 484 - Type Hints](https://www.python.org/dev/peps/pep-0484/)
- [mypy 官方文档](https://mypy.readthedocs.io/)
- [Real Python - Python Type Checking Guide](https://realpython.com/python-type-checking/)

## 🏷️ 标签

`typing` `类型提示` `类型检查` `泛型` `静态分析`

---

**最后更新**: 2024-01-15  
**作者**: Python 文档团队  
**版本**: 1.0