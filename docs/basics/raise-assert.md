---
layout: doc
title: raise、assert 关键字
permalink: /docs/basics/raise-assert/
---

# raise、assert 关键字

## 概述

`raise` 和 `assert` 是 Python 中用于异常处理和程序调试的两个重要关键字。`raise` 用于主动抛出异常，而 `assert` 用于在开发阶段进行条件断言，帮助发现程序中的逻辑错误。

## 学习目标

通过本章学习，你将掌握：
- raise 语句的语法和使用方法
- assert 语句的语法和使用场景
- 标准异常类型和自定义异常
- 异常处理的最佳实践
- 断言在调试和测试中的应用

## 前置知识

- Python 基础语法
- 异常处理机制（try-except-finally）
- 类和对象的基本概念

## 详细内容

### raise 语句

#### 基本语法

```python
raise [exception [, args [, traceback]]]
```

其中：
- `exception` 是异常的类型，可以是异常类的实例，也可以是异常类
- `args` 是异常的参数，可以是元组或字符串
- `traceback` 是异常的追踪信息（很少使用）

#### 基本使用

```python
## 抛出标准异常
def divide(a, b):
    if b == 0:
        raise ValueError("除数不能为零")
    return a / b

try:
    result = divide(10, 0)
except ValueError as e:
    print(f"捕获到异常: {e}")
```

#### 重新抛出异常

```python
def process_data(data):
    try:
#        # 一些可能引发异常的代码
        result = 1 / data
        return result
    except ZeroDivisionError as e:
#        # 记录异常并重新引发
        print(f"处理数据时发生错误: {e}")
        raise  # 重新抛出当前异常
    except Exception as e:
#        # 处理其他类型的异常
        print(f"未预期的错误: {e}")
        raise  # 重新抛出异常

try:
    process_data(0)
except ZeroDivisionError:
    print("在上层处理除零错误")
```

#### 异常链

```python
def convert_to_int(value):
    try:
        return int(value)
    except ValueError as e:
#        # 使用 raise...from 创建异常链
        raise TypeError(f"无法将 '{value}' 转换为整数") from e

try:
    convert_to_int("abc")
except TypeError as e:
    print(f"异常: {e}")
    print(f"原因: {e.__cause__}")
```

### 标准异常类型

#### 常见内置异常

```python
## ValueError - 值错误
def validate_age(age):
    if age < 0 or age > 150:
        raise ValueError(f"年龄必须在 0-150 之间,得到: {age}")
    return age

## TypeError - 类型错误
def add_numbers(a, b):
    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
        raise TypeError("参数必须是数字类型")
    return a + b

## IndexError - 索引错误
def get_item(items, index):
    if index >= len(items) or index < -len(items):
        raise IndexError(f"索引 {index} 超出范围 [0, {len(items)-1}]")
    return items[index]

## KeyError - 键错误
def get_config_value(config, key):
    if key not in config:
        raise KeyError(f"配置项 '{key}' 不存在")
    return config[key]

## 使用示例
try:
    validate_age(-5)
except ValueError as e:
    print(f"年龄验证失败: {e}")

try:
    add_numbers("hello", 5)
except TypeError as e:
    print(f"类型错误: {e}")
```

### 自定义异常

#### 基本自定义异常

```python
class CustomError(Exception):
    """自定义异常基类"""
    pass

class ValidationError(CustomError):
    """数据验证异常"""
    def __init__(self, message, field=None):
        super().__init__(message)
        self.field = field

class BusinessLogicError(CustomError):
    """业务逻辑异常"""
    def __init__(self, message, error_code=None):
        super().__init__(message)
        self.error_code = error_code

## 使用自定义异常
def validate_user_data(user_data):
    if 'name' not in user_data:
        raise ValidationError("用户名不能为空", field='name')
    
    if 'email' not in user_data:
        raise ValidationError("邮箱不能为空", field='email')
    
    if '@' not in user_data['email']:
        raise ValidationError("邮箱格式不正确", field='email')

def process_order(order):
    if order['amount'] <= 0:
        raise BusinessLogicError("订单金额必须大于 0", error_code='INVALID_AMOUNT')
    
    if order['status'] != 'pending':
        raise BusinessLogicError("只能处理待处理状态的订单", error_code='INVALID_STATUS')

## 异常处理示例
try:
    validate_user_data({'name': 'Alice'})
except ValidationError as e:
    print(f"验证错误: {e}, 字段: {e.field}")

try:
    process_order({'amount': -100, 'status': 'completed'})
except BusinessLogicError as e:
    print(f"业务逻辑错误: {e}, 错误码: {e.error_code}")
```

#### 异常层次结构

```python
class APIError(Exception):
    """API 异常基类"""
    def __init__(self, message, status_code=500):
        super().__init__(message)
        self.status_code = status_code

class ClientError(APIError):
    """客户端错误 (4xx)"""
    def __init__(self, message, status_code=400):
        super().__init__(message, status_code)

class ServerError(APIError):
    """服务器错误 (5xx)"""
    def __init__(self, message, status_code=500):
        super().__init__(message, status_code)

class NotFoundError(ClientError):
    """资源未找到错误"""
    def __init__(self, resource):
        super().__init__(f"资源 '{resource}' 未找到", 404)
        self.resource = resource

class UnauthorizedError(ClientError):
    """未授权错误"""
    def __init__(self, message="未授权访问"):
        super().__init__(message, 401)

## 使用异常层次结构
def api_handler(request):
    try:
        if not request.get('auth_token'):
            raise UnauthorizedError()
        
        resource_id = request.get('resource_id')
        if not resource_id:
            raise NotFoundError('resource')
        
#        # 模拟处理逻辑
        return {'status': 'success'}
    
    except ClientError as e:
        return {'error': str(e), 'status_code': e.status_code}
    except ServerError as e:
        return {'error': '服务器内部错误', 'status_code': e.status_code}
    except Exception as e:
        return {'error': '未知错误', 'status_code': 500}

## 测试
result = api_handler({'resource_id': None})
print(result)  # {'error': "资源 'resource' 未找到", 'status_code': 404}
```

### assert 语句

#### 基本语法

```python
assert expression [, message]
```

等价于：

```python
if not expression:
    raise AssertionError(message)
```

#### 基本使用

```python
def calculate_average(numbers):
    assert len(numbers) > 0, "数字列表不能为空"
    assert all(isinstance(n, (int, float)) for n in numbers), "所有元素必须是数字"
    
    return sum(numbers) / len(numbers)

## 正常使用
result = calculate_average([1, 2, 3, 4, 5])
print(f"平均值: {result}")

## 触发断言
try:
    calculate_average([])
except AssertionError as e:
    print(f"断言失败: {e}")

try:
    calculate_average([1, 2, "3", 4])
except AssertionError as e:
    print(f"断言失败: {e}")
```

#### 调试模式和优化模式

```python
## 检查当前是否为调试模式
print(f"调试模式: {__debug__}")

def debug_function(x):
    assert x > 0, "x 必须是正数"
    
    if __debug__:
        print(f"调试信息: 处理值 {x}")
    
    return x * 2

## 在调试模式下运行
result = debug_function(5)
print(f"结果: {result}")

## 注意:使用 python -O script.py 运行时,断言会被禁用
```

#### 断言的最佳实践

```python
class BankAccount:
    def __init__(self, initial_balance=0):
        assert initial_balance >= 0, "初始余额不能为负数"
        self._balance = initial_balance
    
    def deposit(self, amount):
        assert amount > 0, "存款金额必须大于 0"
        self._balance += amount
        
#        # 后置条件断言
        assert self._balance >= amount, "余额更新错误"
    
    def withdraw(self, amount):
#        # 前置条件断言
        assert amount > 0, "取款金额必须大于 0"
        assert amount <= self._balance, "余额不足"
        
        old_balance = self._balance
        self._balance -= amount
        
#        # 后置条件断言
        assert self._balance == old_balance - amount, "余额计算错误"
        assert self._balance >= 0, "余额不能为负数"
    
    @property
    def balance(self):
#        # 不变量断言
        assert self._balance >= 0, "余额不能为负数"
        return self._balance

## 使用示例
account = BankAccount(100)
account.deposit(50)
print(f"存款后余额: {account.balance}")

account.withdraw(30)
print(f"取款后余额: {account.balance}")

## 触发断言
try:
    account.withdraw(200)  # 余额不足
except AssertionError as e:
    print(f"断言失败: {e}")
```

## 实际应用场景

### 1. 输入验证

```python
class UserValidator:
    @staticmethod
    def validate_email(email):
        if not isinstance(email, str):
            raise TypeError("邮箱必须是字符串类型")
        
        if '@' not in email:
            raise ValueError("邮箱格式不正确:缺少 @ 符号")
        
        if email.count('@') != 1:
            raise ValueError("邮箱格式不正确:@ 符号数量错误")
        
        local, domain = email.split('@')
        if not local or not domain:
            raise ValueError("邮箱格式不正确:本地部分或域名部分为空")
        
        return True
    
    @staticmethod
    def validate_password(password):
        if not isinstance(password, str):
            raise TypeError("密码必须是字符串类型")
        
        if len(password) < 8:
            raise ValueError("密码长度至少为 8 位")
        
        if not any(c.isupper() for c in password):
            raise ValueError("密码必须包含至少一个大写字母")
        
        if not any(c.islower() for c in password):
            raise ValueError("密码必须包含至少一个小写字母")
        
        if not any(c.isdigit() for c in password):
            raise ValueError("密码必须包含至少一个数字")
        
        return True

## 使用验证器
def register_user(email, password):
    try:
        UserValidator.validate_email(email)
        UserValidator.validate_password(password)
        print(f"用户注册成功: {email}")
        return True
    except (TypeError, ValueError) as e:
        print(f"注册失败: {e}")
        return False

## 测试
register_user("user@example.com", "Password123")
register_user("invalid-email", "weak")
```

### 2. 配置验证

```python
class ConfigurationError(Exception):
    """配置错误异常"""
    pass

class ConfigValidator:
    @staticmethod
    def validate_database_config(config):
        required_keys = ['host', 'port', 'database', 'username']
        
        for key in required_keys:
            if key not in config:
                raise ConfigurationError(f"缺少必需的配置项: {key}")
        
#        # 验证端口号
        port = config['port']
        if not isinstance(port, int) or port <= 0 or port > 65535:
            raise ConfigurationError(f"端口号无效: {port}")
        
#        # 验证主机名
        host = config['host']
        if not isinstance(host, str) or not host.strip():
            raise ConfigurationError("主机名不能为空")
        
        return True
    
    @staticmethod
    def validate_api_config(config):
        assert 'base_url' in config, "API 配置必须包含 base_url"
        assert 'timeout' in config, "API 配置必须包含 timeout"
        
        timeout = config['timeout']
        assert isinstance(timeout, (int, float)), "timeout 必须是数字"
        assert timeout > 0, "timeout 必须大于 0"
        
        base_url = config['base_url']
        assert isinstance(base_url, str), "base_url 必须是字符串"
        assert base_url.startswith(('http://', 'https://')), "base_url 必须以 http:// 或 https:// 开头"

## 使用配置验证
def load_config(config_data):
    try:
        if 'database' in config_data:
            ConfigValidator.validate_database_config(config_data['database'])
        
        if 'api' in config_data:
            ConfigValidator.validate_api_config(config_data['api'])
        
        print("配置验证通过")
        return config_data
    
    except (ConfigurationError, AssertionError) as e:
        print(f"配置验证失败: {e}")
        raise

## 测试配置
valid_config = {
    'database': {
        'host': 'localhost',
        'port': 5432,
        'database': 'mydb',
        'username': 'user'
    },
    'api': {
        'base_url': 'https://api.example.com',
        'timeout': 30
    }
}

load_config(valid_config)
```

### 3. 单元测试中的断言

```python
class TestCalculator:
    def __init__(self):
        self.test_count = 0
        self.passed_count = 0
    
    def assert_equal(self, actual, expected, message=""):
        self.test_count += 1
        try:
            assert actual == expected, f"期望 {expected},实际 {actual}. {message}"
            self.passed_count += 1
            print(f"✓ 测试通过: {message or '值相等'}")
        except AssertionError as e:
            print(f"✗ 测试失败: {e}")
            raise
    
    def assert_raises(self, exception_type, func, *args, **kwargs):
        self.test_count += 1
        try:
            func(*args, **kwargs)
            print(f"✗ 测试失败: 期望抛出 {exception_type.__name__} 异常")
            assert False, f"期望抛出 {exception_type.__name__} 异常,但没有异常被抛出"
        except exception_type:
            self.passed_count += 1
            print(f"✓ 测试通过: 正确抛出 {exception_type.__name__} 异常")
        except Exception as e:
            print(f"✗ 测试失败: 期望 {exception_type.__name__},实际 {type(e).__name__}")
            raise
    
    def run_tests(self):
        print("开始运行测试...")
        
#        # 测试正常功能
        self.assert_equal(2 + 2, 4, "基本加法")
        self.assert_equal(10 - 5, 5, "基本减法")
        
#        # 测试异常情况
        def divide_by_zero():
            return 1 / 0
        
        self.assert_raises(ZeroDivisionError, divide_by_zero)
        
        print(f"\n 测试结果: {self.passed_count}/{self.test_count} 通过")

## 运行测试
tester = TestCalculator()
tester.run_tests()
```

## 常见陷阱与最佳实践

### 1. 断言的使用场景

```python
## ✓ 正确:用于调试和开发阶段的检查
def calculate_factorial(n):
    assert isinstance(n, int), "n 必须是整数"
    assert n >= 0, "n 必须是非负数"
    
    if n <= 1:
        return 1
    return n * calculate_factorial(n - 1)

## ✗ 错误:不要用断言处理用户输入
def bad_user_input_handler(user_input):
#    # 这是错误的,因为断言可能被禁用
    assert user_input.isdigit(), "输入必须是数字"
    return int(user_input)

## ✓ 正确:用异常处理用户输入
def good_user_input_handler(user_input):
    if not user_input.isdigit():
        raise ValueError("输入必须是数字")
    return int(user_input)
```

### 2. 异常信息的清晰性

```python
## ✗ 错误:异常信息不够清晰
def bad_example(data):
    if not data:
        raise ValueError("错误")

## ✓ 正确:提供清晰的异常信息
def good_example(data):
    if not data:
        raise ValueError("数据不能为空或 None")
    
    if not isinstance(data, list):
        raise TypeError(f"期望 list 类型,得到 {type(data).__name__}")
    
    if len(data) == 0:
        raise ValueError("数据列表不能为空")
```

### 3. 异常处理的层次

```python
class DataProcessor:
    def __init__(self):
        self.processed_count = 0
    
    def process_item(self, item):
        """处理单个项目,可能抛出具体异常"""
        if not isinstance(item, dict):
            raise TypeError(f"项目必须是字典类型,得到 {type(item).__name__}")
        
        if 'id' not in item:
            raise KeyError("项目必须包含 'id' 字段")
        
        if 'value' not in item:
            raise KeyError("项目必须包含 'value' 字段")
        
#        # 处理逻辑
        self.processed_count += 1
        return {'id': item['id'], 'processed_value': item['value'] * 2}
    
    def process_batch(self, items):
        """批量处理,捕获并重新包装异常"""
        if not isinstance(items, list):
            raise TypeError("items 必须是列表类型")
        
        results = []
        errors = []
        
        for i, item in enumerate(items):
            try:
                result = self.process_item(item)
                results.append(result)
            except (TypeError, KeyError) as e:
                error_info = {
                    'index': i,
                    'item': item,
                    'error': str(e),
                    'error_type': type(e).__name__
                }
                errors.append(error_info)
        
        if errors:
            raise ValueError(f"批量处理失败,{len(errors)} 个项目出错: {errors}")
        
        return results

## 使用示例
processor = DataProcessor()

## 正常处理
valid_items = [
    {'id': 1, 'value': 10},
    {'id': 2, 'value': 20}
]

try:
    results = processor.process_batch(valid_items)
    print(f"处理成功: {results}")
except ValueError as e:
    print(f"批量处理失败: {e}")

## 异常处理
invalid_items = [
    {'id': 1, 'value': 10},
    {'id': 2},  # 缺少 value 字段
    "invalid"   # 不是字典类型
]

try:
    results = processor.process_batch(invalid_items)
except ValueError as e:
    print(f"批量处理失败: {e}")
```

## 相关函数与模块

### 内置函数
- `isinstance()` - 类型检查，常与异常处理配合使用
- `hasattr()` - 属性检查
- `callable()` - 可调用对象检查

### 标准库模块
- `traceback` - 异常追踪信息处理
- `logging` - 日志记录，常用于记录异常信息
- `warnings` - 警告处理
- `unittest` - 单元测试框架，包含丰富的断言方法

### 第三方库
- `pytest` - 测试框架，提供强大的断言功能
- [Pydantic - 数据验证库](../../thirdparty/pydantic/)
- `marshmallow` - 序列化和验证库

## 扩展阅读

- [Python 官方文档 - 异常处理](https://docs.python.org/3/tutorial/errors.html)
- [Python 官方文档 - 内置异常](https://docs.python.org/3/library/exceptions.html)
- [PEP 3134 - Exception Chaining and Embedded Tracebacks](https://www.python.org/dev/peps/pep-3134/)
- [Python 官方文档 - assert 语句](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement)

## 相关标签

`Python` `异常处理` `raise` `assert` `调试` `错误处理` `断言` `自定义异常` `程序健壮性`