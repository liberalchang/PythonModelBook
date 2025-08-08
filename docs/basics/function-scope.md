---
layout: doc
title: 函数作用域与闭包
permalink: /docs/basics/function-scope/
category: basics
tags: [作用域, 闭包, global, nonlocal, 变量作用域]
description: Python 函数作用域、闭包和变量生命周期详解
author: Python 文档团队
date: 2024-01-01
updated: 2024-01-01
version: 1.0
difficulty: "中级"
---

# 函数作用域与闭包

## 📝 概述

作用域是编程中的重要概念，它决定了变量在程序中的可见性和生命周期。Python 的作用域规则遵循 LEGB 原则（Local、Enclosing、Global、Built-in），理解作用域对于编写正确、高效的 Python 代码至关重要。闭包是函数式编程的重要特性，它允许内层函数访问外层函数的变量，创建强大而灵活的编程模式。

## 🎯 学习目标

- 理解 Python 的作用域规则和 LEGB 原则
- 掌握 global 和 nonlocal 关键字的使用
- 学会创建和使用闭包
- 了解变量的生命周期和销毁机制
- 掌握默认参数的作用域特性
- 能够解决作用域相关的常见问题

## 📋 前置知识

- Python 函数定义和调用
- 变量和数据类型
- 可变对象和不可变对象的概念
- 基本的面向对象概念

## 🔍 详细内容

### 作用域基础

#### 作用域定义

作用域决定了变量在程序中的可见范围和访问权限。

```python
## 全局作用域
global_var = "我是全局变量"

def outer_function():
#    # 外层函数作用域(Enclosing scope)
    outer_var = "我是外层函数变量"
    
    def inner_function():
#        # 局部作用域(Local scope)
        local_var = "我是局部变量"
        
#        # 可以访问所有外层作用域的变量
        print(f"局部变量:{local_var}")
        print(f"外层变量:{outer_var}")
        print(f"全局变量:{global_var}")
        print(f"内置函数:{len([1, 2, 3])}")
    
    inner_function()
    
#    # 无法访问内层函数的局部变量
#    # print(local_var)  # 这会引发 NameError

outer_function()

## 演示作用域查找顺序
def scope_demo():
    """演示 LEGB 作用域查找顺序"""
#    # Local - 局部作用域
    name = "局部作用域"
    
    def inner():
#        # 如果这里不定义 name,会向上查找
        print(f"内层函数访问:{name}")
    
    inner()
    print(f"外层函数访问:{name}")

scope_demo()
```

#### 变量查找规则

Python 按照 LEGB 顺序查找变量：

```python
## Built-in scope(内置作用域)
## len, print, str 等内置函数

## Global scope(全局作用域)
len = "我重新定义了 len"  # 不推荐这样做

def demonstrate_legb():
#    # Enclosing scope(外层作用域)
    len = "外层函数的 len"
    
    def inner_function():
#        # Local scope(局部作用域)
        len = "局部的 len"
        print(f"局部作用域中的 len:{len}")
        
#        # 访问不同作用域的变量
        def show_scopes():
            print(f"当前 len:{len}")  # 局部的 len
    
    inner_function()
    print(f"外层作用域中的 len:{len}")

demonstrate_legb()
print(f"全局作用域中的 len:{len}")

## 恢复内置的 len 函数
del len
print(f"内置的 len 函数:{len([1, 2, 3])}")  # 现在又可以正常使用了
```

### global 关键字

#### 基本用法

`global`关键字用于在函数内部声明全局变量。

```python
## 全局变量
counter = 0
user_name = "未设置"

def increment_counter():
    """增加计数器"""
    global counter
    counter += 1
    print(f"计数器值:{counter}")

def set_user_name(name):
    """设置用户名"""
    global user_name
    user_name = name
    print(f"用户名已设置为:{user_name}")

def get_user_info():
    """获取用户信息"""
#    # 只读取全局变量,不需要 global 声明
    print(f"当前用户:{user_name},访问次数:{counter}")

## 使用示例
print(f"初始计数器:{counter}")
increment_counter()
increment_counter()
set_user_name("张三")
get_user_info()
```

#### 复杂示例

```python
## 配置管理示例
config = {
    "debug": False,
    "max_connections": 100,
    "timeout": 30
}

log_level = "INFO"

def update_config(key, value):
    """更新配置"""
    global config
    if key in config:
        old_value = config[key]
        config[key] = value
        print(f"配置更新:{key} 从 {old_value} 改为 {value}")
    else:
        print(f"未知配置项:{key}")

def set_debug_mode(enabled):
    """设置调试模式"""
    global config, log_level
    config["debug"] = enabled
    log_level = "DEBUG" if enabled else "INFO"
    print(f"调试模式:{'开启' if enabled else '关闭'},日志级别:{log_level}")

def get_config_summary():
    """获取配置摘要"""
    print(f"当前配置:{config}")
    print(f"日志级别:{log_level}")

## 使用示例
get_config_summary()
update_config("max_connections", 200)
set_debug_mode(True)
get_config_summary()
```

#### 注意事项

```python
## 常见错误示例
x = 10

def problematic_function():
    """演示常见的 global 使用错误"""
    print(x)  # 这行可以正常执行
#    # x += 1  # 这行会报错:UnboundLocalError
#    # 因为+=操作既读取又赋值,Python 认为 x 是局部变量

def correct_function():
    """正确的做法"""
    global x
    print(x)
    x += 1
    print(f"x 增加后:{x}")

## 演示
print(f"初始 x:{x}")
problematic_function()  # 只打印,不修改
correct_function()      # 正确修改全局变量
print(f"最终 x:{x}")

## 另一个常见错误
y = [1, 2, 3]

def modify_list():
    """修改可变对象"""
#    # 对于可变对象,如果只是修改内容(不重新赋值),不需要 global
    y.append(4)
    print(f"修改后的列表:{y}")

def replace_list():
    """替换整个列表"""
    global y
    y = [10, 20, 30]
    print(f"替换后的列表:{y}")

modify_list()   # 修改内容
replace_list()  # 替换整个对象
```

### nonlocal 关键字

#### 基本概念

`nonlocal`关键字用于在嵌套函数中访问外层函数的变量。

```python
def create_counter():
    """创建一个计数器函数"""
    count = 0
    
    def increment():
        nonlocal count
        count += 1
        return count
    
    def decrement():
        nonlocal count
        count -= 1
        return count
    
    def get_count():
#        # 只读取,不需要 nonlocal
        return count
    
    def reset():
        nonlocal count
        count = 0
        return count
    
#    # 返回操作函数
    return {
        "increment": increment,
        "decrement": decrement,
        "get_count": get_count,
        "reset": reset
    }

## 使用示例
counter1 = create_counter()
print(f"初始计数:{counter1['get_count']()}")  # 0
print(f"增加后:{counter1['increment']()}")      # 1
print(f"再增加:{counter1['increment']()}")      # 2
print(f"减少后:{counter1['decrement']()}")      # 1
print(f"重置后:{counter1['reset']()}")         # 0

## 创建另一个独立的计数器
counter2 = create_counter()
print(f"计数器 2:{counter2['increment']()}")     # 1
print(f"计数器 1:{counter1['get_count']()}")    # 0(独立的)
```

#### 高级应用

```python
def create_bank_account(initial_balance=0):
    """创建银行账户"""
    balance = initial_balance
    transaction_history = []
    
    def deposit(amount):
        """存款"""
        nonlocal balance
        if amount > 0:
            balance += amount
            transaction_history.append(f"存款:+{amount},余额:{balance}")
            return True
        return False
    
    def withdraw(amount):
        """取款"""
        nonlocal balance
        if 0 < amount <= balance:
            balance -= amount
            transaction_history.append(f"取款:-{amount},余额:{balance}")
            return True
        return False
    
    def get_balance():
        """查询余额"""
        return balance
    
    def get_history():
        """查询交易历史"""
        return transaction_history.copy()
    
    def transfer_to(target_account, amount):
        """转账到其他账户"""
        if withdraw(amount):
            if target_account['deposit'](amount):
                transaction_history.append(f"转出:-{amount},余额:{balance}")
                return True
            else:
#                # 如果目标账户存款失败,回滚
                deposit(amount)
                transaction_history.pop()  # 移除取款记录
        return False
    
    return {
        "deposit": deposit,
        "withdraw": withdraw,
        "get_balance": get_balance,
        "get_history": get_history,
        "transfer_to": transfer_to
    }

## 使用示例
account1 = create_bank_account(1000)
account2 = create_bank_account(500)

print(f"账户 1 余额:{account1['get_balance']()}")
print(f"账户 2 余额:{account2['get_balance']()}")

## 存取款操作
account1['deposit'](200)
account1['withdraw'](150)

## 转账操作
if account1['transfer_to'](account2, 300):
    print("转账成功")
else:
    print("转账失败")

print(f"\n 账户 1 余额:{account1['get_balance']()}")
print(f"账户 2 余额:{account2['get_balance']()}")

print("\n 账户 1 交易历史:")
for record in account1['get_history']():
    print(f"  {record}")
```

### 闭包

#### 闭包的概念

闭包是指内层函数引用了外层函数的变量，即使外层函数已经执行完毕，这些变量仍然被保持。

```python
def create_multiplier(factor):
    """创建乘法器闭包"""
    def multiply(number):
#        # 这里引用了外层函数的 factor 变量
        return number * factor
    
    return multiply

## 创建不同的乘法器
double = create_multiplier(2)
triple = create_multiplier(3)
tenfold = create_multiplier(10)

## 使用闭包
print(f"5 的两倍:{double(5)}")      # 10
print(f"5 的三倍:{triple(5)}")      # 15
print(f"5 的十倍:{tenfold(5)}")     # 50

## 每个闭包都保持着自己的 factor 值
print(f"double 的 factor:{double.__closure__[0].cell_contents}")
print(f"triple 的 factor:{triple.__closure__[0].cell_contents}")
```

#### 闭包的实际应用

```python
def create_validator(validation_rule):
    """创建验证器闭包"""
    def validate(value):
        return validation_rule(value)
    
    return validate

## 创建不同的验证器
is_positive = create_validator(lambda x: x > 0)
is_even = create_validator(lambda x: x % 2 == 0)
is_in_range = create_validator(lambda x: 1 <= x <= 100)

## 使用验证器
test_values = [-5, 0, 2, 15, 150]

for value in test_values:
    print(f"值 {value}:")
    print(f"  是正数:{is_positive(value)}")
    print(f"  是偶数:{is_even(value)}")
    print(f"  在范围内:{is_in_range(value)}")
    print()

def create_cache():
    """创建缓存闭包"""
    cache = {}
    
    def cached_function(func):
        def wrapper(*args, **kwargs):
#            # 创建缓存键
            key = str(args) + str(sorted(kwargs.items()))
            
            if key in cache:
                print(f"缓存命中:{key}")
                return cache[key]
            
#            # 计算结果并缓存
            result = func(*args, **kwargs)
            cache[key] = result
            print(f"缓存存储:{key} -> {result}")
            return result
        
        return wrapper
    
    def get_cache_info():
        return {
            "size": len(cache),
            "keys": list(cache.keys())
        }
    
    def clear_cache():
        cache.clear()
        print("缓存已清空")
    
    return cached_function, get_cache_info, clear_cache

## 使用缓存闭包
cached_decorator, get_info, clear = create_cache()

@cached_decorator
def expensive_calculation(n):
    """模拟耗时计算"""
    import time
    time.sleep(0.1)  # 模拟计算时间
    return n ** 2

## 测试缓存效果
print("第一次计算:")
result1 = expensive_calculation(5)
print(f"结果:{result1}")

print("\n 第二次计算(相同参数):")
result2 = expensive_calculation(5)
print(f"结果:{result2}")

print(f"\n 缓存信息:{get_info()}")
```

### 默认参数的作用域

#### 可变默认参数的陷阱

```python
## 错误示例:可变默认参数
def add_item_wrong(item, target_list=[]):
    """错误的默认参数使用"""
    target_list.append(item)
    return target_list

## 演示问题
list1 = add_item_wrong("第一个")
print(f"第一次调用:{list1}")  # ['第一个']

list2 = add_item_wrong("第二个")
print(f"第二次调用:{list2}")  # ['第一个', '第二个'] - 意外！

list3 = add_item_wrong("第三个")
print(f"第三次调用:{list3}")  # ['第一个', '第二个', '第三个'] - 更意外！

## 查看默认参数
print(f"函数默认参数:{add_item_wrong.__defaults__}")

## 正确的做法 1:使用 None 作为默认值
def add_item_correct1(item, target_list=None):
    """正确的默认参数使用方法 1"""
    if target_list is None:
        target_list = []
    target_list.append(item)
    return target_list

## 正确的做法 2:使用影子拷贝
def add_item_correct2(item, target_list=None):
    """正确的默认参数使用方法 2"""
    if target_list is None:
        target_list = []
    else:
        target_list = target_list.copy()  # 创建副本
    target_list.append(item)
    return target_list

## 测试正确的实现
print("\n 正确实现的测试:")
list_a = add_item_correct1("A")
list_b = add_item_correct1("B")
print(f"列表 A:{list_a}")  # ['A']
print(f"列表 B:{list_b}")  # ['B']
```

#### 默认参数的最佳实践

```python
def create_user_profile(name, age, hobbies=None, settings=None):
    """创建用户档案的最佳实践"""
#    # 使用 None 作为可变对象的默认值
    if hobbies is None:
        hobbies = []
    if settings is None:
        settings = {"theme": "light", "notifications": True}
    
    profile = {
        "name": name,
        "age": age,
        "hobbies": hobbies.copy(),  # 创建副本避免意外修改
        "settings": settings.copy()
    }
    
    return profile

def log_message(message, timestamp=None, level="INFO"):
    """日志记录函数"""
    if timestamp is None:
        import datetime
        timestamp = datetime.datetime.now()
    
    log_entry = f"[{timestamp}] {level}: {message}"
    print(log_entry)
    return log_entry

## 使用示例
user1 = create_user_profile("张三", 25, ["读书", "游泳"])
user2 = create_user_profile("李四", 30)  # 使用默认值

print(f"用户 1:{user1}")
print(f"用户 2:{user2}")

## 修改 user1 的爱好不会影响 user2
user1["hobbies"].append("编程")
print(f"修改后用户 1:{user1['hobbies']}")
print(f"用户 2 仍然是:{user2['hobbies']}")

## 日志示例
log_message("系统启动")
log_message("用户登录", level="DEBUG")
log_message("错误发生", level="ERROR")
```

### 函数的销毁和生命周期

#### 全局函数的销毁

```python
## 演示函数的销毁
def original_function():
    """原始函数"""
    return "我是原始函数"

print(f"调用原始函数:{original_function()}")

## 方法 1:重新定义同名函数
def original_function():
    """重新定义的函数"""
    return "我是新函数"

print(f"调用新函数:{original_function()}")

## 方法 2:使用 del 删除函数
def temp_function():
    return "临时函数"

print(f"临时函数存在:{temp_function()}")
del temp_function

try:
    temp_function()
except NameError as e:
    print(f"函数已删除:{e}")

## 方法 3:程序结束时自动销毁(这里只是演示概念)
print("程序结束时,所有函数都会被销毁")
```

#### 局部函数和闭包的生命周期

```python
def demonstrate_function_lifecycle():
    """演示函数生命周期"""
    
    def create_closure_with_data():
        data = [1, 2, 3, 4, 5]
        
        def inner_function():
            return sum(data)
        
        return inner_function
    
#    # 创建闭包
    closure_func = create_closure_with_data()
    print(f"闭包结果:{closure_func()}")
    
#    # 即使外层函数执行完毕,闭包仍然保持对 data 的引用
    print(f"闭包仍然有效:{closure_func()}")
    
#    # 删除闭包引用
    del closure_func
    print("闭包引用已删除")
    
#    # 演示局部函数的销毁
    def outer_with_inner():
        def inner():
            return "内层函数"
        
#        # 在外层函数内部可以调用
        result = inner()
        return result
    
    result = outer_with_inner()
    print(f"外层函数结果:{result}")
    
#    # 外层函数执行完毕后,内层函数也被销毁
#    # inner()  # 这会引发 NameError

demonstrate_function_lifecycle()
```

## 💡 实际应用

### 配置管理器

```python
def create_config_manager():
    """创建配置管理器"""
    _config = {}
    _defaults = {}
    _validators = {}
    
    def set_default(key, value, validator=None):
        """设置默认值"""
        nonlocal _defaults, _validators
        _defaults[key] = value
        if validator:
            _validators[key] = validator
    
    def set_config(key, value):
        """设置配置值"""
        nonlocal _config
        
#        # 验证值
        if key in _validators:
            if not _validators[key](value):
                raise ValueError(f"配置值 {key}={value} 验证失败")
        
        _config[key] = value
    
    def get_config(key, default=None):
        """获取配置值"""
        if key in _config:
            return _config[key]
        elif key in _defaults:
            return _defaults[key]
        else:
            return default
    
    def get_all_config():
        """获取所有配置"""
        result = _defaults.copy()
        result.update(_config)
        return result
    
    def reset_config(key=None):
        """重置配置"""
        nonlocal _config
        if key:
            _config.pop(key, None)
        else:
            _config.clear()
    
    return {
        "set_default": set_default,
        "set_config": set_config,
        "get_config": get_config,
        "get_all_config": get_all_config,
        "reset_config": reset_config
    }

## 使用配置管理器
config_mgr = create_config_manager()

## 设置默认值和验证器
config_mgr["set_default"]("max_connections", 100, lambda x: isinstance(x, int) and x > 0)
config_mgr["set_default"]("timeout", 30, lambda x: isinstance(x, (int, float)) and x > 0)
config_mgr["set_default"]("debug", False, lambda x: isinstance(x, bool))

## 设置配置
config_mgr["set_config"]("max_connections", 200)
config_mgr["set_config"]("debug", True)

print("当前配置:")
for key, value in config_mgr["get_all_config"]().items():
    print(f"  {key}: {value}")

## 尝试设置无效值
try:
    config_mgr["set_config"]("max_connections", -1)
except ValueError as e:
    print(f"配置错误:{e}")
```

### 事件系统

```python
def create_event_system():
    """创建事件系统"""
    _listeners = {}
    _event_history = []
    
    def add_listener(event_type, callback):
        """添加事件监听器"""
        nonlocal _listeners
        if event_type not in _listeners:
            _listeners[event_type] = []
        _listeners[event_type].append(callback)
    
    def remove_listener(event_type, callback):
        """移除事件监听器"""
        nonlocal _listeners
        if event_type in _listeners:
            try:
                _listeners[event_type].remove(callback)
                if not _listeners[event_type]:
                    del _listeners[event_type]
            except ValueError:
                pass
    
    def emit_event(event_type, data=None):
        """触发事件"""
        nonlocal _event_history
        
#        # 记录事件历史
        import datetime
        event_record = {
            "type": event_type,
            "data": data,
            "timestamp": datetime.datetime.now(),
            "listeners_count": len(_listeners.get(event_type, []))
        }
        _event_history.append(event_record)
        
#        # 调用所有监听器
        if event_type in _listeners:
            for callback in _listeners[event_type]:
                try:
                    callback(data)
                except Exception as e:
                    print(f"事件监听器错误:{e}")
    
    def get_listeners(event_type=None):
        """获取监听器信息"""
        if event_type:
            return _listeners.get(event_type, [])
        return _listeners.copy()
    
    def get_event_history(limit=None):
        """获取事件历史"""
        if limit:
            return _event_history[-limit:]
        return _event_history.copy()
    
    def clear_history():
        """清空事件历史"""
        nonlocal _event_history
        _event_history.clear()
    
    return {
        "add_listener": add_listener,
        "remove_listener": remove_listener,
        "emit_event": emit_event,
        "get_listeners": get_listeners,
        "get_event_history": get_event_history,
        "clear_history": clear_history
    }

## 使用事件系统
event_system = create_event_system()

## 定义事件处理函数
def on_user_login(data):
    print(f"用户登录:{data['username']}")

def on_user_logout(data):
    print(f"用户登出:{data['username']}")

def log_all_events(data):
    print(f"事件日志:{data}")

## 注册事件监听器
event_system["add_listener"]("user_login", on_user_login)
event_system["add_listener"]("user_logout", on_user_logout)
event_system["add_listener"]("user_login", log_all_events)
event_system["add_listener"]("user_logout", log_all_events)

## 触发事件
event_system["emit_event"]("user_login", {"username": "张三", "ip": "192.168.1.100"})
event_system["emit_event"]("user_logout", {"username": "张三"})

## 查看事件历史
print("\n 事件历史:")
for event in event_system["get_event_history"]():
    print(f"  {event['timestamp']}: {event['type']} (监听器: {event['listeners_count']})")
```

## ⚠️ 注意事项

- **避免过度使用 global**: 全局变量会增加代码的复杂性和耦合度
- **谨慎使用可变默认参数**: 使用 None 作为默认值，在函数内部创建可变对象
- **理解闭包的内存影响**: 闭包会保持对外层变量的引用，可能影响垃圾回收
- **nonlocal 的限制**: nonlocal 只能用于嵌套函数，不能用于全局作用域
- **作用域查找性能**: 访问局部变量比全局变量更快
- **避免循环引用**: 在闭包中要注意避免创建循环引用

## 🔗 相关内容

- [函数定义与调用](../functions/) - 学习函数的基本概念
- [面向对象编程](../oop/) - 了解类的作用域规则
- [装饰器](../decorators/) - 闭包的高级应用
- [异常处理](../exceptions/) - 异常的作用域特性

## 📚 扩展阅读

- [Python 官方文档 - 作用域和命名空间](https://docs.python.org/3/tutorial/classes.html#scopes-and-namespaces)
- [PEP 227 - Statically Nested Scopes](https://www.python.org/dev/peps/pep-0227/)
- [Python 闭包详解](https://realpython.com/python-closure/)

## 🏷️ 标签

`作用域` `闭包` `global` `nonlocal` `变量作用域` `LEGB` `函数生命周期`

---

**最后更新**: 2024-01-01  
**作者**: Python 文档团队  
**版本**: 1.0