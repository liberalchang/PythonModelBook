# ascii() - ASCII 字符串表示函数

## 📖 概述

`ascii()` 是 Python 的内置函数，用于返回对象的 ASCII 字符串表示。它类似于 `repr()` 函数，但会将非 ASCII 字符转义为 `\x`、`\u` 或 `\U` 转义序列，确保返回的字符串只包含 ASCII 字符。这个函数在处理包含 Unicode 字符的数据时特别有用，尤其是在需要确保字符串可以在只支持 ASCII 的环境中正确显示时。

## 🎯 学习目标

通过本文档，你将学会：
- 掌握 `ascii()` 函数的基本用法和语法
- 理解 `ascii()` 与 `repr()` 的区别
- 学会处理 Unicode 字符和转义序列
- 掌握在国际化应用中的使用技巧
- 了解最佳实践和常见应用场景

## 📋 前置知识

- Python 基础语法
- 字符串和 Unicode 概念
- 字符编码基础
- `repr()` 函数的使用

## 📚 详细内容

### 基本概念

`ascii()` 函数调用对象的 `__repr__()` 方法，然后将结果中的非 ASCII 字符替换为适当的转义序列：
- `\x` 用于 0-255 范围内的字符
- `\u` 用于 Unicode BMP（基本多文种平面）字符
- `\U` 用于更高 Unicode 平面的字符

### 语法

```python
ascii(object)
```

### 参数

- **object**: 要获取 ASCII 字符串表示的对象

### 返回值

返回一个字符串，包含对象的 ASCII 表示，其中所有非 ASCII 字符都被转义。

## 💡 代码示例

### 基本用法

```python
## ascii()基本用法示例
print("ascii()基本用法:")

## 1. 基本字符串处理
print("\n1. 基本字符串处理:")

## ASCII 字符串
ascii_str = "Hello, World!"
print(f"ASCII 字符串: {ascii(ascii_str)}")
print(f"repr 比较: {repr(ascii_str)}")
print(f"相同结果: {ascii(ascii_str) == repr(ascii_str)}")

## 包含非 ASCII 字符的字符串
unicode_str = "你好,世界！"
print(f"\nUnicode 字符串: {ascii(unicode_str)}")
print(f"repr 比较: {repr(unicode_str)}")
print(f"不同结果: {ascii(unicode_str) != repr(unicode_str)}")

## 混合字符串
mixed_str = "Hello, 世界! 🌍"
print(f"\n 混合字符串: {ascii(mixed_str)}")
print(f"repr 比较: {repr(mixed_str)}")

## 特殊字符
special_chars = "\n\t\r\\\'\""
print(f"\n 特殊字符: {ascii(special_chars)}")
print(f"repr 比较: {repr(special_chars)}")

## 2. 不同类型的 Unicode 字符
print("\n2. 不同类型的 Unicode 字符:")

## 拉丁字符
latin_str = "café, naïve, résumé"
print(f"拉丁字符: {ascii(latin_str)}")

## 中文字符
chinese_str = "中文测试"
print(f"中文字符: {ascii(chinese_str)}")

## 日文字符
japanese_str = "こんにちは"
print(f"日文字符: {ascii(japanese_str)}")

## 阿拉伯字符
arabic_str = "مرحبا"
print(f"阿拉伯字符: {ascii(arabic_str)}")

## 表情符号
emoji_str = "😀😃😄😁"
print(f"表情符号: {ascii(emoji_str)}")

## 数学符号
math_str = "∑∏∫∆∇"
print(f"数学符号: {ascii(math_str)}")

## 3. 容器类型中的 Unicode
print("\n3. 容器类型中的 Unicode:")

## 列表
unicode_list = ["hello", "世界", "🌍", 42]
print(f"Unicode 列表: {ascii(unicode_list)}")
print(f"repr 比较: {repr(unicode_list)}")

## 字典
unicode_dict = {"name": "张三", "city": "北京", "emoji": "😊"}
print(f"\nUnicode 字典: {ascii(unicode_dict)}")
print(f"repr 比较: {repr(unicode_dict)}")

## 元组
unicode_tuple = ("café", "naïve", "🎉")
print(f"\nUnicode 元组: {ascii(unicode_tuple)}")

## 集合
unicode_set = {"α", "β", "γ", "δ"}
print(f"\nUnicode 集合: {ascii(unicode_set)}")

## 4. 字节字符串和编码
print("\n4. 字节字符串和编码:")

## 字节字符串
byte_str = b"Hello, \xe4\xb8\x96\xe7\x95\x8c!"
print(f"字节字符串: {ascii(byte_str)}")
print(f"repr 比较: {repr(byte_str)}")

## 编码后的字符串
original = "Hello, 世界!"
encoded_utf8 = original.encode('utf-8')
encoded_latin1 = original.encode('latin-1', errors='ignore')

print(f"\n 原始字符串: {ascii(original)}")
print(f"UTF-8 编码: {ascii(encoded_utf8)}")
print(f"Latin-1 编码: {ascii(encoded_latin1)}")

## 5. 转义序列的类型
print("\n5. 转义序列的类型:")

## \x 转义(0-255)
low_unicode = "\x80\x81\x82\xff"
print(f"低位 Unicode (\\x): {ascii(low_unicode)}")

## \u 转义(BMP 字符)
bmp_unicode = "\u4e2d\u6587\u6d4b\u8bd5"
print(f"BMP Unicode (\\u): {ascii(bmp_unicode)}")

## \U 转义(高位 Unicode)
high_unicode = "\U0001f600\U0001f601\U0001f602"
print(f"高位 Unicode (\\U): {ascii(high_unicode)}")

## 混合转义
mixed_escape = "Hello\x80\u4e2d\U0001f600"
print(f"混合转义: {ascii(mixed_escape)}")
```

### 自定义类的 ascii 支持

```python
## 自定义类的 ascii 支持示例
print("\n" + "="*50)
print("自定义类的 ascii 支持:")

## 1. 基本的__repr__实现
print("\n1. 基本的__repr__实现:")

class Person:
    """人员类,包含 Unicode 字符。"""
    
    def __init__(self, name, city, description=""):
        self.name = name
        self.city = city
        self.description = description
    
    def __repr__(self):
        return f"Person(name={self.name!r}, city={self.city!r}, description={self.description!r})"
    
    def __str__(self):
        return f"{self.name} from {self.city}"

## 测试 Person 类
person1 = Person("张三", "北京", "软件工程师")
person2 = Person("Alice", "New York", "Data Scientist")
person3 = Person("José", "São Paulo", "Designer 🎨")

print(f"中文人员 ascii: {ascii(person1)}")
print(f"中文人员 repr:  {repr(person1)}")
print(f"英文人员 ascii: {ascii(person2)}")
print(f"混合人员 ascii: {ascii(person3)}")

## 2. 国际化数据类
print("\n2. 国际化数据类:")

from dataclasses import dataclass
from typing import List, Optional

@dataclass
class Product:
    """产品数据类,支持多语言。"""
    name: str
    name_translations: dict
    price: float
    currency: str
    description: Optional[str] = None
    tags: List[str] = None
    
    def __post_init__(self):
        if self.tags is None:
            self.tags = []

## 创建包含多语言的产品
product = Product(
    name="智能手机",
    name_translations={
        "en": "Smartphone",
        "ja": "スマートフォン",
        "ko": "스마트폰",
        "ar": "هاتف ذكي"
    },
    price=999.99,
    currency="¥",
    description="最新款智能手机 📱",
    tags=["电子产品", "通讯", "科技"]
)

print(f"产品 ascii: {ascii(product)}")
print(f"产品 repr:  {repr(product)}")

## 3. 自定义 ascii 行为
print("\n3. 自定义 ascii 行为:")

class UnicodeAwareClass:
    """Unicode 感知类,提供自定义 ascii 行为。"""
    
    def __init__(self, data):
        self.data = data
    
    def __repr__(self):
        return f"UnicodeAwareClass(data={self.data!r})"
    
    def __ascii__(self):
        """自定义 ascii 方法(注意:这不是标准方法)。"""
#        # 这只是演示概念,实际上 ascii()不会调用__ascii__
        return f"UnicodeAwareClass(data=<ASCII_SAFE_DATA>)"
    
    def get_ascii_safe_repr(self):
        """获取 ASCII 安全的表示。"""
        return ascii(self)
    
    def get_unicode_repr(self):
        """获取 Unicode 表示。"""
        return repr(self)

## 测试 Unicode 感知类
unicode_obj = UnicodeAwareClass("测试数据 🚀")
print(f"Unicode 对象 ascii: {unicode_obj.get_ascii_safe_repr()}")
print(f"Unicode 对象 repr:  {unicode_obj.get_unicode_repr()}")

## 4. 处理复杂嵌套结构
print("\n4. 处理复杂嵌套结构:")

class MultilingualContainer:
    """多语言容器类。"""
    
    def __init__(self, items):
        self.items = items
        self.metadata = {
            "created_by": "系统管理员",
            "description": "多语言数据容器 🌐",
            "supported_languages": ["中文", "English", "日本語", "한국어"]
        }
    
    def __repr__(self):
        return f"MultilingualContainer(items={self.items!r}, metadata={self.metadata!r})"
    
    def __len__(self):
        return len(self.items)
    
    def add_item(self, item):
        """添加项目。"""
        self.items.append(item)
    
    def get_ascii_summary(self):
        """获取 ASCII 摘要。"""
        summary = {
            "item_count": len(self.items),
            "ascii_repr": ascii(self),
            "unicode_repr": repr(self)
        }
        return summary

## 创建多语言容器
container = MultilingualContainer([
    {"text": "Hello", "lang": "en"},
    {"text": "你好", "lang": "zh"},
    {"text": "こんにちは", "lang": "ja"},
    {"text": "안녕하세요", "lang": "ko"},
    {"text": "🌍🌎🌏", "lang": "emoji"}
])

print(f"容器 ascii: {ascii(container)}")
print(f"\n 容器摘要:")
summary = container.get_ascii_summary()
for key, value in summary.items():
    print(f"  {key}: {value}")
```

### 实际应用场景

```python
## ascii()实际应用场景
print("\n" + "="*50)
print("ascii()实际应用场景:")

## 1. 日志记录和调试
print("\n1. 日志记录和调试:")

import logging
from datetime import datetime

class UnicodeLogger:
    """Unicode 安全的日志记录器。"""
    
    def __init__(self, name, ascii_mode=False):
        self.name = name
        self.ascii_mode = ascii_mode
        self.logger = logging.getLogger(name)
        
#        # 配置日志格式
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
        self.logger.setLevel(logging.DEBUG)
    
    def _format_data(self, data):
        """格式化数据以确保 ASCII 兼容性。"""
        if self.ascii_mode:
            return ascii(data)
        else:
            return repr(data)
    
    def log_data(self, level, message, data=None):
        """记录数据日志。"""
        if data is not None:
            formatted_data = self._format_data(data)
            full_message = f"{message} | Data: {formatted_data}"
        else:
            full_message = message
        
        getattr(self.logger, level)(full_message)
    
    def debug_unicode(self, obj, description=""):
        """调试 Unicode 对象。"""
        info = {
            "description": description,
            "type": type(obj).__name__,
            "ascii_repr": ascii(obj),
            "unicode_repr": repr(obj),
            "str_repr": str(obj)
        }
        
        self.log_data("debug", "Unicode 对象调试", info)

## 测试 Unicode 日志记录
logger_ascii = UnicodeLogger("ASCII_Logger", ascii_mode=True)
logger_unicode = UnicodeLogger("Unicode_Logger", ascii_mode=False)

test_data = {
    "user_name": "张三",
    "message": "Hello, 世界! 🌍",
    "timestamp": datetime.now(),
    "metadata": {"source": "用户输入", "type": "文本消息"}
}

print("ASCII 模式日志:")
logger_ascii.log_data("info", "用户数据处理", test_data)

print("\nUnicode 模式日志:")
logger_unicode.log_data("info", "用户数据处理", test_data)

## 调试特定对象
logger_ascii.debug_unicode(test_data["message"], "用户消息")

## 2. 数据序列化和传输
print("\n2. 数据序列化和传输:")

import json

class DataSerializer:
    """数据序列化器,支持 ASCII 安全模式。"""
    
    @staticmethod
    def serialize_for_ascii_transport(data):
        """
        为 ASCII 传输序列化数据。
        
        参数:
            data: 要序列化的数据
        
        返回:
            str: ASCII 安全的序列化字符串
        """
#        # 将数据转换为 ASCII 安全格式
        ascii_data = ascii(data)
        
#        # 创建传输包装
        transport_package = {
            "data_type": type(data).__name__,
            "ascii_repr": ascii_data,
            "original_repr": repr(data),
            "timestamp": datetime.now().isoformat(),
            "encoding": "ascii_safe"
        }
        
        return json.dumps(transport_package, ensure_ascii=True)
    
    @staticmethod
    def deserialize_from_ascii_transport(serialized_data):
        """
        从 ASCII 传输格式反序列化数据。
        
        参数:
            serialized_data (str): 序列化的数据
        
        返回:
            dict: 反序列化的数据包
        """
        try:
            package = json.loads(serialized_data)
            
#            # 尝试重建原始对象
            try:
                original_obj = eval(package["original_repr"])
                package["reconstructed_object"] = original_obj
                package["reconstruction_success"] = True
            except Exception as e:
                package["reconstruction_error"] = str(e)
                package["reconstruction_success"] = False
            
            return package
        except json.JSONDecodeError as e:
            return {"error": f"JSON 解析失败: {e}"}

## 测试数据序列化
test_objects = [
    "Hello, 世界!",
    {"name": "张三", "city": "北京", "hobby": "编程 💻"},
    ["apple", "苹果", "🍎"],
    Person("李四", "上海", "设计师 🎨")
]

print("数据序列化测试:")
for i, obj in enumerate(test_objects):
    print(f"\n--- 对象 {i+1}: {type(obj).__name__} ---")
    
#    # 序列化
    serialized = DataSerializer.serialize_for_ascii_transport(obj)
    print(f"序列化长度: {len(serialized)} 字符")
    print(f"序列化数据: {serialized[:100]}..." if len(serialized) > 100 else f"序列化数据: {serialized}")
    
#    # 反序列化
    deserialized = DataSerializer.deserialize_from_ascii_transport(serialized)
    print(f"反序列化成功: {deserialized.get('reconstruction_success', False)}")
    if deserialized.get('reconstruction_success'):
        print(f"重建对象: {deserialized['reconstructed_object']}")

## 3. 配置文件处理
print("\n3. 配置文件处理:")

class ConfigManager:
    """配置管理器,处理 Unicode 配置。"""
    
    def __init__(self, ascii_safe=True):
        self.ascii_safe = ascii_safe
        self.config = {}
    
    def set_config(self, key, value):
        """设置配置项。"""
        self.config[key] = value
    
    def get_config_repr(self, key):
        """获取配置项的字符串表示。"""
        if key in self.config:
            value = self.config[key]
            if self.ascii_safe:
                return ascii(value)
            else:
                return repr(value)
        return None
    
    def export_config(self, format_type="ascii"):
        """导出配置。"""
        if format_type == "ascii":
            return {k: ascii(v) for k, v in self.config.items()}
        elif format_type == "unicode":
            return {k: repr(v) for k, v in self.config.items()}
        else:
            return self.config.copy()
    
    def validate_ascii_compatibility(self):
        """验证 ASCII 兼容性。"""
        issues = []
        for key, value in self.config.items():
            ascii_repr = ascii(value)
            unicode_repr = repr(value)
            
            if ascii_repr != unicode_repr:
                issues.append({
                    "key": key,
                    "value_type": type(value).__name__,
                    "has_unicode": True,
                    "ascii_repr": ascii_repr,
                    "unicode_repr": unicode_repr
                })
            else:
                issues.append({
                    "key": key,
                    "value_type": type(value).__name__,
                    "has_unicode": False,
                    "repr": ascii_repr
                })
        
        return issues

## 测试配置管理
config_manager = ConfigManager(ascii_safe=True)

## 设置各种配置
config_manager.set_config("app_name", "我的应用程序")
config_manager.set_config("welcome_message", "欢迎使用! 🎉")
config_manager.set_config("supported_languages", ["中文", "English", "日本語"])
config_manager.set_config("database_url", "mysql://user:pass@localhost/数据库")
config_manager.set_config("debug_mode", True)
config_manager.set_config("max_connections", 100)

print("配置验证结果:")
validation_results = config_manager.validate_ascii_compatibility()
for result in validation_results:
    print(f"  {result['key']}: {result['value_type']} - Unicode: {result['has_unicode']}")
    if result['has_unicode']:
        print(f"    ASCII: {result['ascii_repr']}")
        print(f"    Unicode: {result['unicode_repr']}")
    else:
        print(f"    表示: {result['repr']}")

print("\n 导出配置 (ASCII 格式):")
ascii_config = config_manager.export_config("ascii")
for key, value in ascii_config.items():
    print(f"  {key}: {value}")

## 4. 错误处理和异常信息
print("\n4. 错误处理和异常信息:")

class UnicodeErrorHandler:
    """Unicode 错误处理器。"""
    
    @staticmethod
    def safe_error_message(error, include_unicode=False):
        """
        生成安全的错误消息。
        
        参数:
            error (Exception): 异常对象
            include_unicode (bool): 是否包含 Unicode 信息
        
        返回:
            dict: 错误信息字典
        """
        error_info = {
            "error_type": type(error).__name__,
            "ascii_message": ascii(str(error)),
            "ascii_repr": ascii(error)
        }
        
        if include_unicode:
            error_info["unicode_message"] = str(error)
            error_info["unicode_repr"] = repr(error)
        
        return error_info
    
    @staticmethod
    def log_unicode_error(error, context=""):
        """记录 Unicode 相关错误。"""
        print(f"错误上下文: {context}")
        error_info = UnicodeErrorHandler.safe_error_message(error, include_unicode=True)
        
        for key, value in error_info.items():
            print(f"  {key}: {value}")

## 测试错误处理
print("Unicode 错误处理测试:")

try:
#    # 模拟包含 Unicode 的错误
    raise ValueError("无效的输入数据: 用户名不能包含特殊字符 🚫")
except ValueError as e:
    UnicodeErrorHandler.log_unicode_error(e, "用户输入验证")

try:
#    # 模拟编码错误
    problematic_data = "测试数据 🔥"
    problematic_data.encode('ascii')  # 这会引发 UnicodeEncodeError
except UnicodeEncodeError as e:
    UnicodeErrorHandler.log_unicode_error(e, "数据编码转换")

## 5. 国际化和本地化
print("\n5. 国际化和本地化:")

class I18nHelper:
    """国际化辅助工具。"""
    
    def __init__(self):
        self.translations = {
            "en": {
                "hello": "Hello",
                "goodbye": "Goodbye",
                "welcome": "Welcome"
            },
            "zh": {
                "hello": "你好",
                "goodbye": "再见",
                "welcome": "欢迎"
            },
            "ja": {
                "hello": "こんにちは",
                "goodbye": "さようなら",
                "welcome": "いらっしゃいませ"
            },
            "emoji": {
                "hello": "👋",
                "goodbye": "👋",
                "welcome": "🎉"
            }
        }
    
    def get_translation(self, key, lang="en"):
        """获取翻译。"""
        return self.translations.get(lang, {}).get(key, key)
    
    def get_ascii_safe_translations(self):
        """获取 ASCII 安全的翻译。"""
        ascii_translations = {}
        for lang, translations in self.translations.items():
            ascii_translations[lang] = {}
            for key, value in translations.items():
                ascii_translations[lang][key] = {
                    "original": value,
                    "ascii": ascii(value),
                    "is_ascii_safe": ascii(value) == repr(value)
                }
        return ascii_translations
    
    def analyze_unicode_usage(self):
        """分析 Unicode 使用情况。"""
        analysis = {}
        for lang, translations in self.translations.items():
            unicode_count = 0
            total_count = len(translations)
            
            for key, value in translations.items():
                if ascii(value) != repr(value):
                    unicode_count += 1
            
            analysis[lang] = {
                "total_translations": total_count,
                "unicode_translations": unicode_count,
                "ascii_only_translations": total_count - unicode_count,
                "unicode_percentage": (unicode_count / total_count * 100) if total_count > 0 else 0
            }
        
        return analysis

## 测试国际化工具
i18n = I18nHelper()

print("翻译示例:")
for lang in ["en", "zh", "ja", "emoji"]:
    hello = i18n.get_translation("hello", lang)
    print(f"  {lang}: {hello} (ASCII: {ascii(hello)})")

print("\nUnicode 使用分析:")
analysis = i18n.analyze_unicode_usage()
for lang, stats in analysis.items():
    print(f"  {lang}:")
    print(f"    总翻译数: {stats['total_translations']}")
    print(f"    Unicode 翻译: {stats['unicode_translations']}")
    print(f"    ASCII 翻译: {stats['ascii_only_translations']}")
    print(f"    Unicode 比例: {stats['unicode_percentage']:.1f}%")

print("\nASCII 安全翻译:")
ascii_safe = i18n.get_ascii_safe_translations()
for lang, translations in ascii_safe.items():
    print(f"  {lang}:")
    for key, info in translations.items():
        print(f"    {key}: {info['original']} -> {info['ascii']} (安全: {info['is_ascii_safe']})")
```

## ⚠️ 常见陷阱与最佳实践

### ascii()使用注意事项

```python
## ascii()使用注意事项
print("\nascii()使用注意事项:")

## 1. 性能考虑
print("1. 性能考虑:")

import time

def performance_comparison():
    """比较 ascii()和 repr()的性能。"""
#    # 测试数据
    ascii_data = "Hello, World!" * 1000
    unicode_data = "你好,世界！🌍" * 1000
    iterations = 10000
    
#    # ASCII 数据测试
    print("\nASCII 数据性能测试:")
    
#    # repr()性能
    start = time.time()
    for _ in range(iterations):
        result = repr(ascii_data)
    repr_time_ascii = time.time() - start
    
#    # ascii()性能
    start = time.time()
    for _ in range(iterations):
        result = ascii(ascii_data)
    ascii_time_ascii = time.time() - start
    
    print(f"  repr(): {repr_time_ascii:.4f}秒")
    print(f"  ascii(): {ascii_time_ascii:.4f}秒")
    print(f"  性能比: {ascii_time_ascii/repr_time_ascii:.2f}x")
    
#    # Unicode 数据测试
    print("\nUnicode 数据性能测试:")
    
#    # repr()性能
    start = time.time()
    for _ in range(iterations):
        result = repr(unicode_data)
    repr_time_unicode = time.time() - start
    
#    # ascii()性能
    start = time.time()
    for _ in range(iterations):
        result = ascii(unicode_data)
    ascii_time_unicode = time.time() - start
    
    print(f"  repr(): {repr_time_unicode:.4f}秒")
    print(f"  ascii(): {ascii_time_unicode:.4f}秒")
    print(f"  性能比: {ascii_time_unicode/repr_time_unicode:.2f}x")

performance_comparison()

## 2. 内存使用
print("\n2. 内存使用:")

def memory_usage_comparison():
    """比较 ascii()和 repr()的内存使用。"""
    import sys
    
    test_string = "测试字符串 🚀" * 100
    
#    # 原始字符串大小
    original_size = sys.getsizeof(test_string)
    
#    # repr()结果大小
    repr_result = repr(test_string)
    repr_size = sys.getsizeof(repr_result)
    
#    # ascii()结果大小
    ascii_result = ascii(test_string)
    ascii_size = sys.getsizeof(ascii_result)
    
    print(f"原始字符串: {original_size} 字节")
    print(f"repr()结果: {repr_size} 字节 ({repr_size/original_size:.2f}x)")
    print(f"ascii()结果: {ascii_size} 字节 ({ascii_size/original_size:.2f}x)")
    print(f"ascii vs repr: {ascii_size/repr_size:.2f}x")
    
    print(f"\n 长度比较:")
    print(f"原始字符串: {len(test_string)} 字符")
    print(f"repr()结果: {len(repr_result)} 字符")
    print(f"ascii()结果: {len(ascii_result)} 字符")

memory_usage_comparison()

## 3. 编码兼容性
print("\n3. 编码兼容性:")

class EncodingHelper:
    """编码兼容性辅助工具。"""
    
    @staticmethod
    def test_encoding_compatibility(text, encodings=None):
        """
        测试文本的编码兼容性。
        
        参数:
            text (str): 要测试的文本
            encodings (list): 要测试的编码列表
        
        返回:
            dict: 兼容性测试结果
        """
        if encodings is None:
            encodings = ['ascii', 'latin-1', 'utf-8', 'utf-16', 'cp1252']
        
        results = {
            "original_text": text,
            "ascii_repr": ascii(text),
            "unicode_repr": repr(text),
            "encoding_tests": {}
        }
        
        for encoding in encodings:
            try:
#                # 测试原始文本
                encoded = text.encode(encoding)
                decoded = encoded.decode(encoding)
                original_success = (decoded == text)
                
#                # 测试 ascii 表示
                ascii_repr = ascii(text)
#                # 移除引号进行测试
                ascii_text = eval(ascii_repr)
                ascii_encoded = ascii_text.encode(encoding)
                ascii_decoded = ascii_encoded.decode(encoding)
                ascii_success = (ascii_decoded == ascii_text)
                
                results["encoding_tests"][encoding] = {
                    "original_compatible": original_success,
                    "ascii_compatible": ascii_success,
                    "encoded_size": len(encoded),
                    "error": None
                }
                
            except Exception as e:
                results["encoding_tests"][encoding] = {
                    "original_compatible": False,
                    "ascii_compatible": False,
                    "encoded_size": None,
                    "error": str(e)
                }
        
        return results
    
    @staticmethod
    def recommend_safe_representation(text):
        """
        推荐安全的文本表示方式。
        
        参数:
            text (str): 输入文本
        
        返回:
            dict: 推荐结果
        """
        ascii_repr = ascii(text)
        unicode_repr = repr(text)
        
#        # 检查是否包含非 ASCII 字符
        has_unicode = ascii_repr != unicode_repr
        
#        # 检查 ASCII 兼容性
        try:
            text.encode('ascii')
            ascii_compatible = True
        except UnicodeEncodeError:
            ascii_compatible = False
        
        recommendation = {
            "original_text": text,
            "has_unicode": has_unicode,
            "ascii_compatible": ascii_compatible,
            "recommended_repr": ascii_repr if has_unicode else unicode_repr,
            "reason": ""
        }
        
        if not has_unicode:
            recommendation["reason"] = "文本只包含 ASCII 字符,使用 repr()即可"
        elif ascii_compatible:
            recommendation["reason"] = "文本 ASCII 兼容但包含扩展字符,建议使用 ascii()"
        else:
            recommendation["reason"] = "文本包含 Unicode 字符,必须使用 ascii()确保兼容性"
        
        return recommendation

## 测试编码兼容性
test_texts = [
    "Hello, World!",
    "café",
    "你好,世界！",
    "Hello, 世界! 🌍",
    "∑∏∫∆∇",
    "🚀🎉🌟"
]

print("编码兼容性测试:")
for text in test_texts:
    print(f"\n--- 测试文本: {text} ---")
    
#    # 兼容性测试
    compatibility = EncodingHelper.test_encoding_compatibility(text)
    print(f"ASCII 表示: {compatibility['ascii_repr']}")
    
#    # 显示编码测试结果
    for encoding, result in compatibility['encoding_tests'].items():
        if result['error']:
            print(f"  {encoding}: 失败 - {result['error']}")
        else:
            print(f"  {encoding}: 原始={'✓' if result['original_compatible'] else '✗'}, ASCII={'✓' if result['ascii_compatible'] else '✗'}")
    
#    # 获取推荐
    recommendation = EncodingHelper.recommend_safe_representation(text)
    print(f"推荐: {recommendation['reason']}")
    print(f"推荐表示: {recommendation['recommended_repr']}")

## 4. 最佳实践
print("\n4. ascii()最佳实践:")

class ASCIIBestPractices:
    """ASCII 最佳实践示例。"""
    
    @staticmethod
    def safe_ascii_conversion(obj, fallback="<不可表示>"):
        """
        安全的 ASCII 转换。
        
        参数:
            obj: 要转换的对象
            fallback (str): 失败时的回退值
        
        返回:
            str: ASCII 安全的字符串
        """
        try:
            return ascii(obj)
        except Exception as e:
            return f"{fallback} (错误: {e})"
    
    @staticmethod
    def conditional_ascii(obj, force_ascii=False):
        """
        条件 ASCII 转换。
        
        参数:
            obj: 要转换的对象
            force_ascii (bool): 是否强制使用 ASCII
        
        返回:
            str: 字符串表示
        """
        if force_ascii:
            return ascii(obj)
        else:
#            # 检查是否需要 ASCII 转换
            repr_str = repr(obj)
            ascii_str = ascii(obj)
            
            if repr_str == ascii_str:
                return repr_str  # 没有 Unicode 字符,使用 repr
            else:
                return ascii_str  # 有 Unicode 字符,使用 ascii
    
    @staticmethod
    def smart_logging_format(obj, context="", max_length=200):
        """
        智能日志格式化。
        
        参数:
            obj: 要记录的对象
            context (str): 上下文信息
            max_length (int): 最大长度
        
        返回:
            str: 格式化的日志字符串
        """
        ascii_repr = ascii(obj)
        
#        # 截断过长的表示
        if len(ascii_repr) > max_length:
            ascii_repr = ascii_repr[:max_length-3] + "..."
        
#        # 添加上下文
        if context:
            return f"[{context}] {ascii_repr}"
        else:
            return ascii_repr
    
    @staticmethod
    def compare_representations(obj):
        """
        比较不同的字符串表示。
        
        参数:
            obj: 要比较的对象
        
        返回:
            dict: 比较结果
        """
        try:
            str_repr = str(obj)
            repr_repr = repr(obj)
            ascii_repr = ascii(obj)
            
            return {
                "str": str_repr,
                "repr": repr_repr,
                "ascii": ascii_repr,
                "str_length": len(str_repr),
                "repr_length": len(repr_repr),
                "ascii_length": len(ascii_repr),
                "has_unicode": repr_repr != ascii_repr,
                "all_same": str_repr == repr_repr == ascii_repr
            }
        except Exception as e:
            return {"error": str(e)}

## 测试最佳实践
print("\n 最佳实践测试:")

test_objects = [
    "Hello",
    "你好",
    ["apple", "苹果"],
    {"name": "张三", "emoji": "😊"},
    Person("李四", "北京", "工程师 🔧")
]

for i, obj in enumerate(test_objects):
    print(f"\n--- 对象 {i+1} ---")
    
#    # 安全转换
    safe_result = ASCIIBestPractices.safe_ascii_conversion(obj)
    print(f"安全转换: {safe_result}")
    
#    # 条件转换
    conditional_result = ASCIIBestPractices.conditional_ascii(obj)
    print(f"条件转换: {conditional_result}")
    
#    # 智能日志格式
    log_format = ASCIIBestPractices.smart_logging_format(obj, f"对象{i+1}")
    print(f"日志格式: {log_format}")
    
#    # 表示比较
    comparison = ASCIIBestPractices.compare_representations(obj)
    if "error" not in comparison:
        print(f"表示比较:")
        print(f"  str: {comparison['str']} (长度: {comparison['str_length']})")
        print(f"  repr: {comparison['repr']} (长度: {comparison['repr_length']})")
        print(f"  ascii: {comparison['ascii']} (长度: {comparison['ascii_length']})")
        print(f"  包含 Unicode: {comparison['has_unicode']}")
        print(f"  全部相同: {comparison['all_same']}")
    else:
        print(f"比较失败: {comparison['error']}")
```

## 🔗 相关函数和模块

### 内置函数
- `repr()` - 返回对象的字符串表示
- `str()` - 返回对象的字符串形式
- `ord()` - 返回字符的 Unicode 码点
- `chr()` - 返回 Unicode 码点对应的字符
- `eval()` - 执行字符串表达式

### 字符串方法
- `str.encode()` - 字符串编码
- `str.decode()` - 字节解码
- `str.isascii()` - 检查是否为 ASCII 字符
- `str.isprintable()` - 检查是否为可打印字符

### 标准库模块
- `unicodedata` - Unicode 字符数据库
- `codecs` - 编解码器注册和基类
- `locale` - 国际化服务
- `json` - JSON 编码器（支持 ensure_ascii 参数）
- `logging` - 日志记录

### 第三方库
- `unidecode` - Unicode 到 ASCII 转换
- `chardet` - 字符编码检测
- `ftfy` - 修复 Unicode 文本

## 📚 扩展阅读

- [Python Unicode HOWTO](https://docs.python.org/3/howto/unicode.html)
- [ascii()函数文档](https://docs.python.org/3/library/functions.html#ascii)
- [字符编码和 Unicode](https://docs.python.org/3/library/codecs.html)
- [国际化和本地化](https://docs.python.org/3/library/locale.html)

## 🏷️ 标签

`ascii` `Unicode` `字符编码` `字符串表示` `国际化` `调试` `日志记录` `数据传输`