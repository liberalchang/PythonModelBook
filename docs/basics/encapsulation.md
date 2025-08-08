---
layout: doc
title: "封装"
permalink: /docs/basics/encapsulation/
category: "Python基础"
tags: ["面向对象", "封装", "私有属性", "property", "访问控制"]
description: "深入理解Python中的封装概念，包括访问控制、私有属性、property装饰器以及封装的最佳实践"
author: "Python教程"
version: "1.0"
last_updated: "2024-01-20"
difficulty: "中级"
estimated_time: "50分钟"
prerequisites: ["类的定义", "实例属性和方法", "装饰器基础"]
related_topics: ["继承", "多态", "property装饰器"]
---

# 封装

## 概述

封装是面向对象编程的三大特性之一，它将数据（属性）和行为（方法）包装到类对象中，并控制对这些数据的访问。通过封装，我们可以隐藏对象的内部实现细节，只暴露必要的接口，从而提高代码的安全性、可维护性和可重用性。

## 学习目标

通过本章学习，你将能够：

- 理解封装的基本概念和重要性
- 掌握Python中的访问控制机制
- 学会使用私有属性和方法
- 熟练使用property装饰器
- 了解getter和setter方法的设计
- 能够设计良好封装的类
- 理解封装在实际开发中的应用

## 前置知识

- Python类的定义和实例化
- 实例属性和方法的使用
- 装饰器的基本概念
- 面向对象编程基础

## 详细内容

### 封装的基本概念

封装的核心思想是将对象的内部状态隐藏起来，只通过公共接口与外界交互。这样可以：

1. **保护数据完整性**：防止外部代码直接修改对象的内部状态
2. **隐藏实现细节**：外部代码不需要了解内部实现
3. **提供统一接口**：通过方法控制对属性的访问
4. **便于维护和扩展**：内部实现的改变不影响外部代码

### Python中的访问控制

Python使用命名约定来实现访问控制：

```python
class Person:
    def __init__(self, name, age):
        self.name = name           # 公有属性
        self._age = age           # 受保护属性（约定）
        self.__id = 12345         # 私有属性
    
    def get_info(self):           # 公有方法
        return f"{self.name}, {self._age}岁"
    
    def _internal_method(self):   # 受保护方法（约定）
        return "内部方法"
    
    def __private_method(self):   # 私有方法
        return "私有方法"
    
    def access_private(self):
        # 类内部可以访问私有成员
        return self.__private_method()

# 使用示例
person = Person("张三", 25)

# 公有属性和方法可以直接访问
print(person.name)          # 张三
print(person.get_info())    # 张三, 25岁

# 受保护属性可以访问，但不建议
print(person._age)          # 25

# 私有属性无法直接访问
# print(person.__id)        # AttributeError

# 但可以通过名称修饰访问（不推荐）
print(person._Person__id)   # 12345

# 通过公有方法访问私有方法
print(person.access_private())  # 私有方法
```

### 使用property实现属性封装

`property`装饰器是Python中实现属性封装的主要工具：

#### 基本用法

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius  # 使用受保护属性存储实际值
    
    @property
    def radius(self):
        """获取半径"""
        print("正在获取半径")
        return self._radius
    
    @radius.setter
    def radius(self, value):
        """设置半径"""
        if value <= 0:
            raise ValueError("半径必须大于0")
        print(f"正在设置半径为 {value}")
        self._radius = value
    
    @radius.deleter
    def radius(self):
        """删除半径"""
        print("正在删除半径")
        del self._radius
    
    @property
    def area(self):
        """计算面积（只读属性）"""
        return 3.14159 * self._radius ** 2
    
    @property
    def diameter(self):
        """计算直径（只读属性）"""
        return 2 * self._radius

# 使用示例
circle = Circle(5)

# 获取属性
print(f"半径: {circle.radius}")     # 正在获取半径\n半径: 5
print(f"面积: {circle.area:.2f}")   # 面积: 78.54
print(f"直径: {circle.diameter}")   # 直径: 10

# 设置属性
circle.radius = 3                   # 正在设置半径为 3
print(f"新半径: {circle.radius}")   # 正在获取半径\n新半径: 3

# 尝试设置无效值
try:
    circle.radius = -1              # ValueError: 半径必须大于0
except ValueError as e:
    print(f"错误: {e}")

# 删除属性
del circle.radius                   # 正在删除半径
```

#### 使用property()函数

除了装饰器语法，还可以使用`property()`函数：

```python
class Temperature:
    def __init__(self, celsius=0):
        self._celsius = celsius
    
    def get_celsius(self):
        """获取摄氏温度"""
        return self._celsius
    
    def set_celsius(self, value):
        """设置摄氏温度"""
        if value < -273.15:
            raise ValueError("温度不能低于绝对零度")
        self._celsius = value
    
    def del_celsius(self):
        """删除温度"""
        del self._celsius
    
    def get_fahrenheit(self):
        """获取华氏温度"""
        return self._celsius * 9/5 + 32
    
    def set_fahrenheit(self, value):
        """设置华氏温度"""
        self._celsius = (value - 32) * 5/9
    
    # 使用property()函数定义属性
    celsius = property(get_celsius, set_celsius, del_celsius, "摄氏温度")
    fahrenheit = property(get_fahrenheit, set_fahrenheit, None, "华氏温度")

# 使用示例
temp = Temperature(25)
print(f"摄氏温度: {temp.celsius}°C")      # 25°C
print(f"华氏温度: {temp.fahrenheit}°F")   # 77.0°F

temp.fahrenheit = 100
print(f"摄氏温度: {temp.celsius:.1f}°C")   # 37.8°C
```

### 数据验证和处理

封装的一个重要作用是在设置属性时进行数据验证：

```python
class BankAccount:
    def __init__(self, account_number, initial_balance=0):
        self._account_number = account_number
        self._balance = 0
        self.balance = initial_balance  # 使用setter进行验证
        self._transaction_history = []
    
    @property
    def account_number(self):
        """账户号码（只读）"""
        return self._account_number
    
    @property
    def balance(self):
        """账户余额"""
        return self._balance
    
    @balance.setter
    def balance(self, amount):
        """设置账户余额"""
        if not isinstance(amount, (int, float)):
            raise TypeError("余额必须是数字")
        if amount < 0:
            raise ValueError("余额不能为负数")
        
        old_balance = getattr(self, '_balance', 0)
        self._balance = amount
        
        # 记录交易历史
        if hasattr(self, '_transaction_history'):
            change = amount - old_balance
            if change != 0:
                self._add_transaction(f"余额变更: {change:+.2f}")
    
    @property
    def transaction_history(self):
        """交易历史（只读）"""
        return self._transaction_history.copy()  # 返回副本，防止外部修改
    
    def deposit(self, amount):
        """存款"""
        if amount <= 0:
            raise ValueError("存款金额必须大于0")
        
        self._balance += amount
        self._add_transaction(f"存款: +{amount:.2f}")
        return self._balance
    
    def withdraw(self, amount):
        """取款"""
        if amount <= 0:
            raise ValueError("取款金额必须大于0")
        if amount > self._balance:
            raise ValueError("余额不足")
        
        self._balance -= amount
        self._add_transaction(f"取款: -{amount:.2f}")
        return self._balance
    
    def _add_transaction(self, description):
        """添加交易记录（私有方法）"""
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self._transaction_history.append(f"[{timestamp}] {description}")
    
    def get_statement(self):
        """获取账户对账单"""
        statement = f"账户: {self.account_number}\n"
        statement += f"当前余额: ¥{self.balance:.2f}\n"
        statement += "交易历史:\n"
        for transaction in self.transaction_history:
            statement += f"  {transaction}\n"
        return statement

# 使用示例
account = BankAccount("123456789", 1000)

print(f"账户号码: {account.account_number}")
print(f"初始余额: ¥{account.balance}")

# 进行一些操作
account.deposit(500)
account.withdraw(200)
account.deposit(100)

print(f"\n最终余额: ¥{account.balance}")
print("\n对账单:")
print(account.get_statement())

# 尝试非法操作
try:
    account.withdraw(2000)  # 余额不足
except ValueError as e:
    print(f"错误: {e}")

try:
    account.balance = -100  # 负数余额
except ValueError as e:
    print(f"错误: {e}")
```

### 只读和只写属性

有时我们需要创建只读或只写的属性：

```python
class User:
    def __init__(self, username, password):
        self._username = username
        self._password_hash = self._hash_password(password)
        self._login_count = 0
        self._last_login = None
    
    @property
    def username(self):
        """用户名（只读）"""
        return self._username
    
    @property
    def login_count(self):
        """登录次数（只读）"""
        return self._login_count
    
    @property
    def last_login(self):
        """最后登录时间（只读）"""
        return self._last_login
    
    @property
    def password(self):
        """密码（只写，不能读取）"""
        raise AttributeError("密码不可读取")
    
    @password.setter
    def password(self, new_password):
        """设置新密码"""
        if len(new_password) < 6:
            raise ValueError("密码长度至少6位")
        self._password_hash = self._hash_password(new_password)
    
    def _hash_password(self, password):
        """密码哈希（私有方法）"""
        # 简化的哈希实现，实际应用中应使用更安全的方法
        return hash(password)
    
    def verify_password(self, password):
        """验证密码"""
        return self._hash_password(password) == self._password_hash
    
    def login(self, password):
        """用户登录"""
        if self.verify_password(password):
            self._login_count += 1
            from datetime import datetime
            self._last_login = datetime.now()
            return True
        return False

# 使用示例
user = User("alice", "secret123")

print(f"用户名: {user.username}")        # alice
print(f"登录次数: {user.login_count}")   # 0

# 尝试读取密码
try:
    print(user.password)  # AttributeError: 密码不可读取
except AttributeError as e:
    print(f"错误: {e}")

# 修改密码
user.password = "newpassword123"
print("密码已更新")

# 登录
if user.login("newpassword123"):
    print("登录成功")
    print(f"登录次数: {user.login_count}")
    print(f"最后登录: {user.last_login}")
```

### 计算属性

使用property可以创建基于其他属性计算的动态属性：

```python
class Rectangle:
    def __init__(self, width, height):
        self._width = width
        self._height = height
    
    @property
    def width(self):
        return self._width
    
    @width.setter
    def width(self, value):
        if value <= 0:
            raise ValueError("宽度必须大于0")
        self._width = value
    
    @property
    def height(self):
        return self._height
    
    @height.setter
    def height(self, value):
        if value <= 0:
            raise ValueError("高度必须大于0")
        self._height = value
    
    @property
    def area(self):
        """面积（计算属性）"""
        return self._width * self._height
    
    @property
    def perimeter(self):
        """周长（计算属性）"""
        return 2 * (self._width + self._height)
    
    @property
    def diagonal(self):
        """对角线长度（计算属性）"""
        return (self._width ** 2 + self._height ** 2) ** 0.5
    
    @property
    def is_square(self):
        """是否为正方形（计算属性）"""
        return self._width == self._height
    
    def scale(self, factor):
        """按比例缩放"""
        self._width *= factor
        self._height *= factor
    
    def __str__(self):
        return f"Rectangle({self._width}x{self._height})"

# 使用示例
rect = Rectangle(4, 3)

print(f"矩形: {rect}")
print(f"面积: {rect.area}")
print(f"周长: {rect.perimeter}")
print(f"对角线: {rect.diagonal:.2f}")
print(f"是否为正方形: {rect.is_square}")

# 修改尺寸
rect.width = 5
print(f"\n修改宽度后:")
print(f"矩形: {rect}")
print(f"面积: {rect.area}")
print(f"是否为正方形: {rect.is_square}")

# 缩放
rect.scale(2)
print(f"\n缩放2倍后:")
print(f"矩形: {rect}")
print(f"面积: {rect.area}")
```

## 实际应用案例

### 案例1：配置管理类

```python
import json
import os
from typing import Any, Dict

class ConfigManager:
    """配置管理类，演示封装的实际应用"""
    
    def __init__(self, config_file: str):
        self._config_file = config_file
        self._config_data = {}
        self._is_modified = False
        self._load_config()
    
    @property
    def config_file(self) -> str:
        """配置文件路径（只读）"""
        return self._config_file
    
    @property
    def is_modified(self) -> bool:
        """配置是否已修改（只读）"""
        return self._is_modified
    
    @property
    def config_data(self) -> Dict[str, Any]:
        """配置数据（只读副本）"""
        return self._config_data.copy()
    
    def get(self, key: str, default: Any = None) -> Any:
        """获取配置项"""
        return self._config_data.get(key, default)
    
    def set(self, key: str, value: Any) -> None:
        """设置配置项"""
        if not isinstance(key, str) or not key.strip():
            raise ValueError("配置键必须是非空字符串")
        
        old_value = self._config_data.get(key)
        if old_value != value:
            self._config_data[key] = value
            self._is_modified = True
            print(f"配置项 '{key}' 已更新: {old_value} -> {value}")
    
    def delete(self, key: str) -> bool:
        """删除配置项"""
        if key in self._config_data:
            del self._config_data[key]
            self._is_modified = True
            print(f"配置项 '{key}' 已删除")
            return True
        return False
    
    def save(self) -> bool:
        """保存配置到文件"""
        try:
            with open(self._config_file, 'w', encoding='utf-8') as f:
                json.dump(self._config_data, f, indent=2, ensure_ascii=False)
            self._is_modified = False
            print(f"配置已保存到 {self._config_file}")
            return True
        except Exception as e:
            print(f"保存配置失败: {e}")
            return False
    
    def reload(self) -> bool:
        """重新加载配置"""
        try:
            self._load_config()
            self._is_modified = False
            print("配置已重新加载")
            return True
        except Exception as e:
            print(f"重新加载配置失败: {e}")
            return False
    
    def _load_config(self) -> None:
        """加载配置文件（私有方法）"""
        if os.path.exists(self._config_file):
            try:
                with open(self._config_file, 'r', encoding='utf-8') as f:
                    self._config_data = json.load(f)
            except Exception as e:
                print(f"加载配置文件失败: {e}")
                self._config_data = {}
        else:
            self._config_data = {}
            print(f"配置文件 {self._config_file} 不存在，使用默认配置")
    
    def __enter__(self):
        """上下文管理器入口"""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """上下文管理器出口，自动保存修改"""
        if self._is_modified:
            self.save()
    
    def __str__(self):
        return f"ConfigManager({self._config_file}, {len(self._config_data)} items)"

# 使用示例
with ConfigManager("app_config.json") as config:
    # 设置配置项
    config.set("database_url", "sqlite:///app.db")
    config.set("debug_mode", True)
    config.set("max_connections", 100)
    
    # 获取配置项
    print(f"数据库URL: {config.get('database_url')}")
    print(f"调试模式: {config.get('debug_mode')}")
    print(f"最大连接数: {config.get('max_connections')}")
    
    # 检查修改状态
    print(f"配置是否已修改: {config.is_modified}")
    
    # 删除配置项
    config.delete("debug_mode")
    
    print(f"最终配置: {config.config_data}")
# 退出上下文时自动保存
```

### 案例2：数据验证类

```python
from datetime import datetime, date
from typing import Union, Optional
import re

class Person:
    """人员信息类，演示数据验证和封装"""
    
    def __init__(self, name: str, email: str, birth_date: Union[str, date]):
        # 使用setter进行初始化，确保数据验证
        self.name = name
        self.email = email
        self.birth_date = birth_date
        self._phone = None
        self._address = None
    
    @property
    def name(self) -> str:
        """姓名"""
        return self._name
    
    @name.setter
    def name(self, value: str) -> None:
        """设置姓名"""
        if not isinstance(value, str):
            raise TypeError("姓名必须是字符串")
        
        value = value.strip()
        if not value:
            raise ValueError("姓名不能为空")
        
        if len(value) < 2 or len(value) > 50:
            raise ValueError("姓名长度必须在2-50个字符之间")
        
        # 检查是否包含特殊字符
        if not re.match(r'^[\u4e00-\u9fa5a-zA-Z\s]+$', value):
            raise ValueError("姓名只能包含中文、英文字母和空格")
        
        self._name = value
    
    @property
    def email(self) -> str:
        """邮箱地址"""
        return self._email
    
    @email.setter
    def email(self, value: str) -> None:
        """设置邮箱地址"""
        if not isinstance(value, str):
            raise TypeError("邮箱地址必须是字符串")
        
        value = value.strip().lower()
        if not value:
            raise ValueError("邮箱地址不能为空")
        
        # 邮箱格式验证
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, value):
            raise ValueError("邮箱地址格式无效")
        
        self._email = value
    
    @property
    def birth_date(self) -> date:
        """出生日期"""
        return self._birth_date
    
    @birth_date.setter
    def birth_date(self, value: Union[str, date]) -> None:
        """设置出生日期"""
        if isinstance(value, str):
            try:
                # 尝试解析日期字符串
                value = datetime.strptime(value, '%Y-%m-%d').date()
            except ValueError:
                raise ValueError("日期格式无效，请使用 YYYY-MM-DD 格式")
        
        if not isinstance(value, date):
            raise TypeError("出生日期必须是日期对象或日期字符串")
        
        # 检查日期合理性
        today = date.today()
        if value > today:
            raise ValueError("出生日期不能是未来日期")
        
        # 检查年龄是否合理（假设最大150岁）
        age = today.year - value.year
        if age > 150:
            raise ValueError("年龄不能超过150岁")
        
        self._birth_date = value
    
    @property
    def age(self) -> int:
        """年龄（计算属性）"""
        today = date.today()
        age = today.year - self._birth_date.year
        
        # 如果今年的生日还没到，年龄减1
        if today.month < self._birth_date.month or \
           (today.month == self._birth_date.month and today.day < self._birth_date.day):
            age -= 1
        
        return age
    
    @property
    def phone(self) -> Optional[str]:
        """电话号码"""
        return self._phone
    
    @phone.setter
    def phone(self, value: Optional[str]) -> None:
        """设置电话号码"""
        if value is None:
            self._phone = None
            return
        
        if not isinstance(value, str):
            raise TypeError("电话号码必须是字符串")
        
        # 清理电话号码（移除空格、横线等）
        cleaned = re.sub(r'[\s-()]', '', value)
        
        # 中国手机号码验证
        if re.match(r'^1[3-9]\d{9}$', cleaned):
            self._phone = cleaned
        # 中国固定电话验证
        elif re.match(r'^0\d{2,3}-?\d{7,8}$', value):
            self._phone = value
        else:
            raise ValueError("电话号码格式无效")
    
    @property
    def address(self) -> Optional[str]:
        """地址"""
        return self._address
    
    @address.setter
    def address(self, value: Optional[str]) -> None:
        """设置地址"""
        if value is None:
            self._address = None
            return
        
        if not isinstance(value, str):
            raise TypeError("地址必须是字符串")
        
        value = value.strip()
        if len(value) > 200:
            raise ValueError("地址长度不能超过200个字符")
        
        self._address = value if value else None
    
    @property
    def is_adult(self) -> bool:
        """是否成年（计算属性）"""
        return self.age >= 18
    
    def get_info(self) -> dict:
        """获取完整信息"""
        return {
            'name': self.name,
            'email': self.email,
            'birth_date': self.birth_date.isoformat(),
            'age': self.age,
            'phone': self.phone,
            'address': self.address,
            'is_adult': self.is_adult
        }
    
    def __str__(self):
        return f"Person(name='{self.name}', age={self.age}, email='{self.email}')"
    
    def __repr__(self):
        return self.__str__()

# 使用示例
try:
    # 创建人员对象
    person = Person(
        name="张三",
        email="zhangsan@example.com",
        birth_date="1990-05-15"
    )
    
    print(f"创建成功: {person}")
    print(f"年龄: {person.age}")
    print(f"是否成年: {person.is_adult}")
    
    # 设置可选信息
    person.phone = "13812345678"
    person.address = "北京市朝阳区某某街道123号"
    
    print(f"\n完整信息:")
    for key, value in person.get_info().items():
        print(f"  {key}: {value}")
    
    # 测试数据验证
    print("\n测试数据验证:")
    
    # 无效邮箱
    try:
        person.email = "invalid-email"
    except ValueError as e:
        print(f"邮箱验证: {e}")
    
    # 无效电话
    try:
        person.phone = "123"
    except ValueError as e:
        print(f"电话验证: {e}")
    
    # 无效姓名
    try:
        person.name = "A"
    except ValueError as e:
        print(f"姓名验证: {e}")
    
    # 未来日期
    try:
        person.birth_date = "2030-01-01"
    except ValueError as e:
        print(f"日期验证: {e}")
        
except Exception as e:
    print(f"创建失败: {e}")
```

## 注意事项

1. **适度封装**：不要过度封装，简单的属性不一定需要property
2. **性能考虑**：property会增加一定的性能开销
3. **文档说明**：为property添加适当的文档字符串
4. **一致性**：保持接口的一致性，避免混用直接属性和property
5. **错误处理**：在setter中进行适当的错误处理和验证
6. **向后兼容**：修改现有属性为property时要考虑向后兼容性

## 相关内容

- [类的定义](./class-definition.md) - 封装的基础
- [继承](./class-inheritance.md) - 封装在继承中的表现
- [多态](./polymorphism.md) - 封装与多态的结合
- [装饰器](../advanced/decorators.md) - property装饰器的原理

## 扩展阅读

- Python官方文档：property装饰器
- 《Effective Python》中关于封装的最佳实践
- 面向对象设计原则中的封装原则
- Python描述符协议的深入理解