# chr() - Unicode 字符生成函数

## 概述

`chr()` 是 Python 的内置函数，用于将 Unicode 码点（整数值）转换为对应的字符。它是 `ord()` 函数的逆操作，将整数表示转换为字符。

## 学习目标

通过本文档，你将学会：
- 理解 `chr()` 函数的基本概念和用途
- 掌握 `chr()` 函数的语法和参数
- 学会在各种场景中使用 `chr()` 函数
- 了解 Unicode 编码和字符生成
- 掌握相关的最佳实践和常见陷阱

## 前置知识

- Python 基础语法
- 字符串和字符的基本概念
- Unicode 编码的基本理解
- 数值类型的基本操作

## 详细内容

### 基本概念

`chr()` 函数接受一个整数参数（Unicode 码点），返回该码点对应的字符。有效的码点范围是 0 到 1,114,111（0x10FFFF），这涵盖了整个 Unicode 标准定义的字符集。

### 语法

```python
chr(i)
```

### 参数

- **i**: 整数，表示 Unicode 码点。必须在有效范围内（0 ≤ i ≤ 1,114,111）。

### 返回值

返回一个长度为 1 的字符串，表示码点 i 对应的 Unicode 字符。

### 异常

- **ValueError**: 当参数超出有效的 Unicode 范围时抛出。

### 代码示例

#### 基本用法

```python
## ASCII 字符生成
print(chr(65))     # 输出: A
print(chr(97))     # 输出: a
print(chr(48))     # 输出: 0
print(chr(32))     # 输出:   (空格)
print(chr(10))     # 输出: \n (换行符)

## 特殊字符生成
print(chr(33))     # 输出: !
print(chr(64))     # 输出: @
print(chr(35))     # 输出: #

## 中文字符生成
print(chr(20013))  # 输出: 中
print(chr(25991))  # 输出: 文
print(chr(20320))  # 输出: 你
print(chr(22909))  # 输出: 好

## 其他语言字符
print(chr(945))    # 输出: α (希腊字母 alpha)
print(chr(946))    # 输出: β (希腊字母 beta)
print(chr(960))    # 输出: π (希腊字母 pi)

## Emoji 字符
print(chr(128013)) # 输出: 🐍 (蛇)
print(chr(127757)) # 输出: 🌍 (地球)
print(chr(128640)) # 输出: 🚀 (火箭)
```

#### 字符范围生成器

```python
class CharacterGenerator:
    """字符生成器"""
    
    @staticmethod
    def generate_ascii_range(start_char, end_char):
        """生成 ASCII 字符范围"""
        start_code = ord(start_char)
        end_code = ord(end_char)
        
        if start_code > end_code:
            start_code, end_code = end_code, start_code
        
        return [chr(code) for code in range(start_code, end_code + 1)]
    
    @staticmethod
    def generate_unicode_block(start_code, end_code, max_chars=50):
        """生成 Unicode 块中的字符"""
        chars = []
        count = 0
        
        for code in range(start_code, min(end_code + 1, start_code + max_chars)):
            try:
                char = chr(code)
#                # 只包含可打印字符
                if char.isprintable():
                    chars.append({
                        'char': char,
                        'code': code,
                        'hex': hex(code),
                        'name': unicodedata.name(char, '未知')
                    })
                    count += 1
                    if count >= max_chars:
                        break
            except ValueError:
                continue
        
        return chars
    
    @staticmethod
    def create_alphabet(language='english'):
        """创建不同语言的字母表"""
        alphabets = {
            'english_upper': list(chr(i) for i in range(65, 91)),
            'english_lower': list(chr(i) for i in range(97, 123)),
            'digits': list(chr(i) for i in range(48, 58)),
            'greek_lower': list(chr(i) for i in range(945, 970)),
            'greek_upper': list(chr(i) for i in range(913, 938)),
            'cyrillic_upper': list(chr(i) for i in range(1040, 1072)),
            'cyrillic_lower': list(chr(i) for i in range(1072, 1104))
        }
        
        if language in alphabets:
            return alphabets[language]
        else:
            return list(alphabets.keys())
    
    @staticmethod
    def generate_symbols(category='math'):
        """生成特定类别的符号"""
        symbol_ranges = {
            'math': [(0x2200, 0x22FF), (0x2190, 0x21FF)],  # 数学符号
            'currency': [(0x20A0, 0x20CF)],                 # 货币符号
            'arrows': [(0x2190, 0x21FF)],                   # 箭头符号
            'geometric': [(0x25A0, 0x25FF)],                # 几何图形
            'misc_symbols': [(0x2600, 0x26FF)],             # 杂项符号
            'dingbats': [(0x2700, 0x27BF)],                 # 装饰符号
            'emoji_misc': [(0x1F300, 0x1F5FF)],             # 杂项符号和象形文字
            'emoji_emoticons': [(0x1F600, 0x1F64F)],        # 表情符号
            'emoji_transport': [(0x1F680, 0x1F6FF)]         # 交通和地图符号
        }
        
        if category not in symbol_ranges:
            return list(symbol_ranges.keys())
        
        symbols = []
        for start, end in symbol_ranges[category]:
            for code in range(start, min(end + 1, start + 50)):
                try:
                    char = chr(code)
                    if char.isprintable():
                        symbols.append({
                            'char': char,
                            'code': code,
                            'hex': hex(code),
                            'category': category
                        })
                except ValueError:
                    continue
        
        return symbols

## 使用示例
import unicodedata

generator = CharacterGenerator()

## 生成 ASCII 字符范围
uppercase = generator.generate_ascii_range('A', 'Z')
lowercase = generator.generate_ascii_range('a', 'z')
digits = generator.generate_ascii_range('0', '9')

print(f"大写字母: {''.join(uppercase)}")
print(f"小写字母: {''.join(lowercase)}")
print(f"数字: {''.join(digits)}")

## 生成 Unicode 块
print("\n 希腊字母 (部分):")
greek_chars = generator.generate_unicode_block(945, 970, 10)
for char_info in greek_chars:
    print(f"  {char_info['char']} ({char_info['code']}) - {char_info['name']}")

## 创建字母表
print("\n 可用的字母表:")
available_alphabets = generator.create_alphabet()
for alphabet_name in available_alphabets:
    alphabet = generator.create_alphabet(alphabet_name)
    print(f"  {alphabet_name}: {''.join(alphabet[:10])}{'...' if len(alphabet) > 10 else ''}")

## 生成符号
print("\n 数学符号 (部分):")
math_symbols = generator.generate_symbols('math')
for symbol in math_symbols[:10]:
    print(f"  {symbol['char']} ({symbol['hex']})")

print("\nEmoji 表情 (部分):")
emoji_symbols = generator.generate_symbols('emoji_emoticons')
for emoji in emoji_symbols[:10]:
    print(f"  {emoji['char']} ({emoji['hex']})")
```

#### 字符编码转换工具

```python
class CharacterConverter:
    """字符编码转换工具"""
    
    @staticmethod
    def from_hex_string(hex_str):
        """从十六进制字符串生成字符"""
        try:
#            # 移除可能的前缀
            hex_str = hex_str.replace('0x', '').replace('U+', '').replace('\\u', '').replace('\\U', '')
            code_point = int(hex_str, 16)
            return chr(code_point)
        except (ValueError, OverflowError) as e:
            raise ValueError(f"无效的十六进制字符串: {hex_str}, 错误: {e}")
    
    @staticmethod
    def from_decimal_string(decimal_str):
        """从十进制字符串生成字符"""
        try:
            code_point = int(decimal_str)
            return chr(code_point)
        except (ValueError, OverflowError) as e:
            raise ValueError(f"无效的十进制字符串: {decimal_str}, 错误: {e}")
    
    @staticmethod
    def from_binary_string(binary_str):
        """从二进制字符串生成字符"""
        try:
#            # 移除可能的前缀
            binary_str = binary_str.replace('0b', '')
            code_point = int(binary_str, 2)
            return chr(code_point)
        except (ValueError, OverflowError) as e:
            raise ValueError(f"无效的二进制字符串: {binary_str}, 错误: {e}")
    
    @staticmethod
    def from_octal_string(octal_str):
        """从八进制字符串生成字符"""
        try:
#            # 移除可能的前缀
            octal_str = octal_str.replace('0o', '')
            code_point = int(octal_str, 8)
            return chr(code_point)
        except (ValueError, OverflowError) as e:
            raise ValueError(f"无效的八进制字符串: {octal_str}, 错误: {e}")
    
    @staticmethod
    def from_unicode_escape(escape_str):
        """从 Unicode 转义序列生成字符"""
        try:
#            # 处理不同的转义格式
            if escape_str.startswith('\\u'):
                hex_part = escape_str[2:]
                if len(hex_part) == 4:
                    return chr(int(hex_part, 16))
            elif escape_str.startswith('\\U'):
                hex_part = escape_str[2:]
                if len(hex_part) == 8:
                    return chr(int(hex_part, 16))
            elif escape_str.startswith('\\x'):
                hex_part = escape_str[2:]
                if len(hex_part) == 2:
                    return chr(int(hex_part, 16))
            
            raise ValueError(f"不支持的转义格式: {escape_str}")
            
        except (ValueError, OverflowError) as e:
            raise ValueError(f"无效的 Unicode 转义序列: {escape_str}, 错误: {e}")
    
    @staticmethod
    def batch_convert(values, input_format='decimal'):
        """批量转换"""
        converters = {
            'decimal': CharacterConverter.from_decimal_string,
            'hex': CharacterConverter.from_hex_string,
            'binary': CharacterConverter.from_binary_string,
            'octal': CharacterConverter.from_octal_string,
            'unicode_escape': CharacterConverter.from_unicode_escape
        }
        
        if input_format not in converters:
            raise ValueError(f"不支持的输入格式: {input_format}")
        
        converter = converters[input_format]
        results = []
        
        for value in values:
            try:
                char = converter(str(value))
                results.append({
                    'input': value,
                    'output': char,
                    'code_point': ord(char),
                    'success': True,
                    'error': None
                })
            except Exception as e:
                results.append({
                    'input': value,
                    'output': None,
                    'code_point': None,
                    'success': False,
                    'error': str(e)
                })
        
        return results
    
    @staticmethod
    def create_character_table(start_code, end_code, columns=8):
        """创建字符表"""
        table = []
        current_row = []
        
        for code in range(start_code, end_code + 1):
            try:
                char = chr(code)
                if char.isprintable():
                    current_row.append({
                        'char': char,
                        'code': code,
                        'hex': f"U+{code:04X}"
                    })
                else:
                    current_row.append({
                        'char': '·',  # 不可打印字符用点表示
                        'code': code,
                        'hex': f"U+{code:04X}"
                    })
                
                if len(current_row) == columns:
                    table.append(current_row)
                    current_row = []
                    
            except ValueError:
#                # 无效码点跳过
                continue
        
#        # 添加最后一行(如果不完整)
        if current_row:
            table.append(current_row)
        
        return table

## 使用示例
converter = CharacterConverter()

## 从不同格式转换
print("从不同格式转换字符:")
test_conversions = [
    ('65', 'decimal'),
    ('0x41', 'hex'),
    ('U+0041', 'hex'),
    ('0b1000001', 'binary'),
    ('0o101', 'octal'),
    ('\\u0041', 'unicode_escape'),
    ('\\U00000041', 'unicode_escape')
]

for value, format_type in test_conversions:
    try:
        if format_type == 'decimal':
            char = converter.from_decimal_string(value)
        elif format_type == 'hex':
            char = converter.from_hex_string(value)
        elif format_type == 'binary':
            char = converter.from_binary_string(value)
        elif format_type == 'octal':
            char = converter.from_octal_string(value)
        elif format_type == 'unicode_escape':
            char = converter.from_unicode_escape(value)
        
        print(f"  {value} ({format_type}) -> '{char}' (码点: {ord(char)})")
    except Exception as e:
        print(f"  {value} ({format_type}) -> 错误: {e}")

## 批量转换
print("\n 批量转换 (十六进制):")
hex_values = ['41', '42', '43', '4E2D', '6587']
batch_results = converter.batch_convert(hex_values, 'hex')
for result in batch_results:
    if result['success']:
        print(f"  {result['input']} -> '{result['output']}' (码点: {result['code_point']})")
    else:
        print(f"  {result['input']} -> 错误: {result['error']}")

## 创建字符表
print("\nASCII 字符表 (65-90):")
ascii_table = converter.create_character_table(65, 90, 6)
for row in ascii_table:
    row_str = "  "
    for cell in row:
        row_str += f"{cell['char']}({cell['code']:<3}) "
    print(row_str)
```

### 实际应用场景

#### 文本生成和模板处理

```python
class TextGenerator:
    """文本生成器"""
    
    @staticmethod
    def generate_password(length=12, include_symbols=True):
        """生成随机密码"""
        import random
        
#        # 定义字符集
        lowercase = [chr(i) for i in range(97, 123)]  # a-z
        uppercase = [chr(i) for i in range(65, 91)]   # A-Z
        digits = [chr(i) for i in range(48, 58)]      # 0-9
        
        char_pool = lowercase + uppercase + digits
        
        if include_symbols:
#            # 添加常用符号
            symbols = [chr(i) for i in [33, 35, 36, 37, 38, 42, 43, 45, 61, 63, 64, 94, 95, 126]]
            char_pool.extend(symbols)
        
#        # 确保密码包含各种类型的字符
        password = []
        password.append(random.choice(lowercase))
        password.append(random.choice(uppercase))
        password.append(random.choice(digits))
        
        if include_symbols:
            password.append(random.choice(symbols))
        
#        # 填充剩余长度
        for _ in range(length - len(password)):
            password.append(random.choice(char_pool))
        
#        # 打乱顺序
        random.shuffle(password)
        
        return ''.join(password)
    
    @staticmethod
    def create_box_drawing(text, style='single'):
        """创建文本框"""
#        # 不同样式的框线字符
        box_chars = {
            'single': {
                'top_left': chr(9484),     # ┌
                'top_right': chr(9488),    # ┐
                'bottom_left': chr(9492),  # └
                'bottom_right': chr(9496), # ┘
                'horizontal': chr(9472),   # ─
                'vertical': chr(9474)      # │
            },
            'double': {
                'top_left': chr(9556),     # ╔
                'top_right': chr(9559),    # ╗
                'bottom_left': chr(9562),  # ╚
                'bottom_right': chr(9565), # ╝
                'horizontal': chr(9552),   # ═
                'vertical': chr(9553)      # ║
            },
            'rounded': {
                'top_left': chr(9581),     # ╭
                'top_right': chr(9582),    # ╮
                'bottom_left': chr(9584),  # ╰
                'bottom_right': chr(9583), # ╯
                'horizontal': chr(9472),   # ─
                'vertical': chr(9474)      # │
            }
        }
        
        if style not in box_chars:
            style = 'single'
        
        chars = box_chars[style]
        lines = text.split('\n')
        max_width = max(len(line) for line in lines) if lines else 0
        
#        # 构建框架
        result = []
        
#        # 顶部
        top_line = chars['top_left'] + chars['horizontal'] * (max_width + 2) + chars['top_right']
        result.append(top_line)
        
#        # 内容行
        for line in lines:
            content_line = chars['vertical'] + ' ' + line.ljust(max_width) + ' ' + chars['vertical']
            result.append(content_line)
        
#        # 底部
        bottom_line = chars['bottom_left'] + chars['horizontal'] * (max_width + 2) + chars['bottom_right']
        result.append(bottom_line)
        
        return '\n'.join(result)
    
    @staticmethod
    def generate_progress_bar(percentage, width=20, fill_char=None, empty_char=None):
        """生成进度条"""
        if fill_char is None:
            fill_char = chr(9608)  # █ 实心块
        if empty_char is None:
            empty_char = chr(9617)  # ░ 轻阴影块
        
        filled_width = int(width * percentage / 100)
        empty_width = width - filled_width
        
        progress = fill_char * filled_width + empty_char * empty_width
        return f"[{progress}] {percentage:3.0f}%"
    
    @staticmethod
    def create_separator(width=50, char_code=None, pattern='single'):
        """创建分隔线"""
        patterns = {
            'single': [chr(9472)],           # ─
            'double': [chr(9552)],           # ═
            'dotted': [chr(8230)],           # …
            'dashed': [chr(45), chr(32)],    # - (空格)
            'wave': [chr(8764)],             # ∼
            'star': [chr(42)],               # *
            'hash': [chr(35)],               # #
            'mixed': [chr(9472), chr(9552), chr(9472)]  # ─═─
        }
        
        if char_code is not None:
            try:
                char = chr(char_code)
                return char * width
            except ValueError:
                pattern = 'single'
        
        if pattern not in patterns:
            pattern = 'single'
        
        chars = patterns[pattern]
        separator = ''
        
        for i in range(width):
            separator += chars[i % len(chars)]
        
        return separator
    
    @staticmethod
    def generate_unicode_art(text, style='block'):
        """生成 Unicode 艺术字"""
#        # 简单的块字符映射(仅支持数字和部分字母)
        block_patterns = {
            '0': ['███', '█ █', '█ █', '█ █', '███'],
            '1': [' █ ', '██ ', ' █ ', ' █ ', '███'],
            '2': ['███', '  █', '███', '█  ', '███'],
            '3': ['███', '  █', '███', '  █', '███'],
            '4': ['█ █', '█ █', '███', '  █', '  █'],
            '5': ['███', '█  ', '███', '  █', '███'],
            'A': ['███', '█ █', '███', '█ █', '█ █'],
            'B': ['██ ', '█ █', '██ ', '█ █', '██ '],
            'C': ['███', '█  ', '█  ', '█  ', '███'],
            ' ': ['   ', '   ', '   ', '   ', '   ']
        }
        
        if style != 'block':
            return f"不支持的样式: {style}"
        
        text = text.upper()
        height = 5
        result_lines = [''] * height
        
        for char in text:
            if char in block_patterns:
                pattern = block_patterns[char]
                for i in range(height):
                    result_lines[i] += pattern[i] + ' '
            else:
#                # 未知字符用问号表示
                unknown_pattern = ['███', '█ █', ' ██', '   ', ' █ ']
                for i in range(height):
                    result_lines[i] += unknown_pattern[i] + ' '
        
        return '\n'.join(result_lines)

## 使用示例
generator = TextGenerator()

## 生成密码
print("生成的密码:")
for i in range(3):
    password = generator.generate_password(12, True)
    print(f"  密码 {i+1}: {password}")

## 创建文本框
print("\n 文本框示例:")
sample_text = "Hello World!\n 你好,世界！\nPython 编程"
for style in ['single', 'double', 'rounded']:
    print(f"\n{style.capitalize()} 样式:")
    boxed_text = generator.create_box_drawing(sample_text, style)
    print(boxed_text)

## 进度条
print("\n 进度条示例:")
for percent in [0, 25, 50, 75, 100]:
    progress = generator.generate_progress_bar(percent, 30)
    print(f"  {progress}")

## 分隔线
print("\n 分隔线示例:")
for pattern in ['single', 'double', 'dotted', 'wave', 'mixed']:
    separator = generator.create_separator(40, None, pattern)
    print(f"  {pattern}: {separator}")

## Unicode 艺术字
print("\nUnicode 艺术字:")
art_text = generator.generate_unicode_art("ABC 123")
print(art_text)
```

#### 数据编码和解码

```python
class DataEncoder:
    """数据编码器"""
    
    @staticmethod
    def encode_to_unicode_points(data):
        """将数据编码为 Unicode 码点序列"""
        if isinstance(data, str):
            return [ord(char) for char in data]
        elif isinstance(data, bytes):
            return list(data)
        elif isinstance(data, (list, tuple)):
            return [int(x) % 1114112 for x in data]  # 确保在有效范围内
        else:
            return [ord(char) for char in str(data)]
    
    @staticmethod
    def decode_from_unicode_points(points):
        """从 Unicode 码点序列解码数据"""
        try:
            return ''.join(chr(point) for point in points)
        except (ValueError, TypeError) as e:
            raise ValueError(f"无法解码码点序列: {e}")
    
    @staticmethod
    def create_custom_encoding(alphabet):
        """创建自定义编码映射"""
        if len(set(alphabet)) != len(alphabet):
            raise ValueError("字母表中不能有重复字符")
        
#        # 创建编码和解码映射
        encode_map = {char: i for i, char in enumerate(alphabet)}
        decode_map = {i: char for i, char in enumerate(alphabet)}
        
        return {
            'alphabet': alphabet,
            'encode_map': encode_map,
            'decode_map': decode_map,
            'base': len(alphabet)
        }
    
    @staticmethod
    def base_n_encode(number, base, custom_alphabet=None):
        """N 进制编码"""
        if base < 2 or base > 1114112:
            raise ValueError(f"进制必须在 2-1114112 之间,实际: {base}")
        
        if custom_alphabet:
            if len(custom_alphabet) != base:
                raise ValueError(f"自定义字母表长度必须等于进制数: {len(custom_alphabet)} != {base}")
            alphabet = custom_alphabet
        else:
#            # 使用 Unicode 字符作为默认字母表
            alphabet = [chr(i) for i in range(base)]
        
        if number == 0:
            return alphabet[0]
        
        result = []
        while number > 0:
            result.append(alphabet[number % base])
            number //= base
        
        return ''.join(reversed(result))
    
    @staticmethod
    def base_n_decode(encoded_str, base, custom_alphabet=None):
        """N 进制解码"""
        if custom_alphabet:
            if len(custom_alphabet) != base:
                raise ValueError(f"自定义字母表长度必须等于进制数: {len(custom_alphabet)} != {base}")
#            # 创建字符到值的映射
            char_to_value = {char: i for i, char in enumerate(custom_alphabet)}
        else:
            char_to_value = {chr(i): i for i in range(base)}
        
        result = 0
        for char in encoded_str:
            if char not in char_to_value:
                raise ValueError(f"字符 '{char}' 不在字母表中")
            result = result * base + char_to_value[char]
        
        return result
    
    @staticmethod
    def compress_text_with_unicode(text):
        """使用 Unicode 字符压缩文本"""
#        # 统计字符频率
        char_freq = {}
        for char in text:
            char_freq[char] = char_freq.get(char, 0) + 1
        
#        # 按频率排序
        sorted_chars = sorted(char_freq.items(), key=lambda x: x[1], reverse=True)
        
#        # 创建压缩映射(高频字符使用低码点)
        compress_map = {}
        decompress_map = {}
        
        for i, (char, freq) in enumerate(sorted_chars):
#            # 使用私用区字符避免冲突
            compressed_char = chr(0xE000 + i)
            compress_map[char] = compressed_char
            decompress_map[compressed_char] = char
        
#        # 压缩文本
        compressed = ''.join(compress_map[char] for char in text)
        
        return {
            'compressed': compressed,
            'mapping': decompress_map,
            'original_length': len(text),
            'compressed_length': len(compressed),
            'unique_chars': len(sorted_chars),
            'compression_ratio': len(compressed) / len(text) if text else 0
        }
    
    @staticmethod
    def decompress_text_with_unicode(compressed_data):
        """解压缩 Unicode 压缩的文本"""
        compressed = compressed_data['compressed']
        mapping = compressed_data['mapping']
        
        try:
            decompressed = ''.join(mapping[char] for char in compressed)
            return decompressed
        except KeyError as e:
            raise ValueError(f"解压缩失败,找不到字符映射: {e}")

## 使用示例
encoder = DataEncoder()

## Unicode 码点编码/解码
test_text = "Hello 世界! 🌍"
print(f"原文: {test_text}")

## 编码为码点
code_points = encoder.encode_to_unicode_points(test_text)
print(f"码点序列: {code_points}")

## 从码点解码
decoded_text = encoder.decode_from_unicode_points(code_points)
print(f"解码结果: {decoded_text}")
print(f"编码正确: {test_text == decoded_text}")

## 自定义编码
print("\n 自定义编码示例:")
custom_alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
encoding_system = encoder.create_custom_encoding(custom_alphabet)
print(f"自定义字母表: {custom_alphabet}")
print(f"进制: {encoding_system['base']}")

## N 进制编码
test_number = 12345
encoded = encoder.base_n_encode(test_number, 36, custom_alphabet)
decoded_number = encoder.base_n_decode(encoded, 36, custom_alphabet)
print(f"\n 数字 {test_number} 的 36 进制编码: {encoded}")
print(f"解码结果: {decoded_number}")
print(f"编码正确: {test_number == decoded_number}")

## Unicode 压缩
print("\nUnicode 文本压缩:")
repeat_text = "这是一个测试文本,这个文本包含重复的字符和词汇。测试文本用于验证压缩效果。"
compressed_result = encoder.compress_text_with_unicode(repeat_text)
decompressed_text = encoder.decompress_text_with_unicode(compressed_result)

print(f"原文长度: {compressed_result['original_length']} 字符")
print(f"压缩后长度: {compressed_result['compressed_length']} 字符")
print(f"唯一字符数: {compressed_result['unique_chars']}")
print(f"压缩比: {compressed_result['compression_ratio']:.2%}")
print(f"解压正确: {repeat_text == decompressed_text}")

## 显示压缩映射(前几个)
print("\n 压缩映射 (前 10 个):")
for i, (compressed_char, original_char) in enumerate(list(compressed_result['mapping'].items())[:10]):
    print(f"  '{original_char}' -> '{compressed_char}' (码点: {ord(compressed_char)})")
```

#### 国际化和本地化

```python
import locale
import unicodedata

class InternationalizationHelper:
    """国际化助手"""
    
    @staticmethod
    def generate_locale_characters(locale_name='en_US'):
        """生成特定区域的字符集"""
#        # 不同区域的字符范围
        locale_ranges = {
            'en_US': [(65, 90), (97, 122)],           # 英文
            'zh_CN': [(0x4E00, 0x9FFF)],              # 中文汉字
            'ja_JP': [(0x3040, 0x309F), (0x30A0, 0x30FF)],  # 日文平假名和片假名
            'ko_KR': [(0xAC00, 0xD7AF)],              # 韩文
            'ar_SA': [(0x0600, 0x06FF)],              # 阿拉伯文
            'ru_RU': [(0x0400, 0x04FF)],              # 俄文西里尔字母
            'el_GR': [(0x0370, 0x03FF)],              # 希腊文
            'he_IL': [(0x0590, 0x05FF)],              # 希伯来文
            'th_TH': [(0x0E00, 0x0E7F)],              # 泰文
            'hi_IN': [(0x0900, 0x097F)]               # 印地文天城文
        }
        
        if locale_name not in locale_ranges:
            return f"不支持的区域: {locale_name}"
        
        characters = []
        for start, end in locale_ranges[locale_name]:
            for code in range(start, min(end + 1, start + 100)):  # 限制数量
                try:
                    char = chr(code)
                    if char.isprintable():
                        characters.append({
                            'char': char,
                            'code': code,
                            'hex': f"U+{code:04X}",
                            'name': unicodedata.name(char, '未知'),
                            'category': unicodedata.category(char)
                        })
                except ValueError:
                    continue
        
        return characters
    
    @staticmethod
    def create_multilingual_greeting():
        """创建多语言问候语"""
        greetings = [
            ("Hello", "en", "英语"),
            ("你好", "zh", "中文"),
            ("こんにちは", "ja", "日语"),
            ("안녕하세요", "ko", "韩语"),
            ("مرحبا", "ar", "阿拉伯语"),
            ("Привет", "ru", "俄语"),
            ("Γεια σας", "el", "希腊语"),
            ("שלום", "he", "希伯来语"),
            ("สวัสดี", "th", "泰语"),
            ("नमस्ते", "hi", "印地语"),
            ("Bonjour", "fr", "法语"),
            ("Hola", "es", "西班牙语"),
            ("Guten Tag", "de", "德语"),
            ("Ciao", "it", "意大利语"),
            ("Olá", "pt", "葡萄牙语")
        ]
        
        result = []
        for greeting, lang_code, lang_name in greetings:
            char_info = []
            for char in greeting:
                if not char.isspace():
                    char_info.append({
                        'char': char,
                        'code': ord(char),
                        'hex': f"U+{ord(char):04X}"
                    })
            
            result.append({
                'greeting': greeting,
                'language_code': lang_code,
                'language_name': lang_name,
                'char_count': len(greeting),
                'unique_chars': len(set(greeting)),
                'char_details': char_info
            })
        
        return result
    
    @staticmethod
    def analyze_text_language(text):
        """分析文本的语言特征"""
#        # 定义语言字符范围
        language_ranges = {
            'Latin': [(0x0000, 0x007F), (0x0080, 0x00FF), (0x0100, 0x017F)],
            'Chinese': [(0x4E00, 0x9FFF), (0x3400, 0x4DBF)],
            'Japanese': [(0x3040, 0x309F), (0x30A0, 0x30FF), (0x31F0, 0x31FF)],
            'Korean': [(0xAC00, 0xD7AF), (0x1100, 0x11FF)],
            'Arabic': [(0x0600, 0x06FF), (0x0750, 0x077F)],
            'Cyrillic': [(0x0400, 0x04FF)],
            'Greek': [(0x0370, 0x03FF)],
            'Hebrew': [(0x0590, 0x05FF)],
            'Thai': [(0x0E00, 0x0E7F)],
            'Devanagari': [(0x0900, 0x097F)]
        }
        
        language_counts = {lang: 0 for lang in language_ranges}
        total_chars = 0
        
        for char in text:
            if char.isalpha():  # 只分析字母字符
                total_chars += 1
                code_point = ord(char)
                
                for language, ranges in language_ranges.items():
                    for start, end in ranges:
                        if start <= code_point <= end:
                            language_counts[language] += 1
                            break
        
#        # 计算百分比
        language_percentages = {}
        if total_chars > 0:
            for language, count in language_counts.items():
                if count > 0:
                    language_percentages[language] = (count / total_chars) * 100
        
#        # 确定主要语言
        primary_language = max(language_percentages.items(), key=lambda x: x[1]) if language_percentages else ("Unknown", 0)
        
        return {
            'total_alpha_chars': total_chars,
            'language_counts': language_counts,
            'language_percentages': language_percentages,
            'primary_language': primary_language[0],
            'primary_percentage': primary_language[1],
            'is_multilingual': len([p for p in language_percentages.values() if p > 5]) > 1
        }
    
    @staticmethod
    def create_unicode_font_test():
        """创建 Unicode 字体测试文本"""
        test_sections = [
            {
                'name': '基本拉丁字母',
                'range': (0x0020, 0x007F),
                'sample': 'The quick brown fox jumps over the lazy dog. 0123456789'
            },
            {
                'name': '中文汉字',
                'range': (0x4E00, 0x4E2F),
                'sample': ''.join(chr(i) for i in range(0x4E00, 0x4E20))
            },
            {
                'name': '日文平假名',
                'range': (0x3040, 0x309F),
                'sample': ''.join(chr(i) for i in range(0x3041, 0x3061))
            },
            {
                'name': '阿拉伯文',
                'range': (0x0600, 0x065F),
                'sample': ''.join(chr(i) for i in range(0x0627, 0x0647) if chr(i).isprintable())
            },
            {
                'name': '数学符号',
                'range': (0x2200, 0x22FF),
                'sample': '∀∁∂∃∄∅∆∇∈∉∊∋∌∍∎∏∐∑−∓∔∕∖∗∘∙√∛∜∝∞∟∠∡∢∣∤∥∦∧∨∩∪∫∬∭∮∯∰∱∲∳∴∵∶∷∸∹∺∻∼∽∾∿≀≁≂≃≄≅≆≇≈≉≊≋≌≍≎≏≐≑≒≓≔≕≖≗≘≙≚≛≜≝≞≟≠≡≢≣≤≥≦≧≨≩≪≫≬≭≮≯≰≱≲≳≴≵≶≷≸≹≺≻≼≽≾≿⊀⊁⊂⊃⊄⊅⊆⊇⊈⊉⊊⊋⊌⊍⊎⊏⊐⊑⊒⊓⊔⊕⊖⊗⊘⊙⊚⊛⊜⊝⊞⊟⊠⊡⊢⊣⊤⊥⊦⊧⊨⊩⊪⊫⊬⊭⊮⊯⊰⊱⊲⊳⊴⊵⊶⊷⊸⊹⊺⊻⊼⊽⊾⊿⋀⋁⋂⋃⋄⋅⋆⋇⋈⋉⋊⋋⋌⋍⋎⋏⋐⋑⋒⋓⋔⋕⋖⋗⋘⋙⋚⋛⋜⋝⋞⋟⋠⋡⋢⋣⋤⋥⋦⋧⋨⋩⋪⋫⋬⋭⋮⋯⋰⋱⋲⋳⋴⋵⋶⋷⋸⋹⋺⋻⋼⋽⋾⋿'
            },
            {
                'name': 'Emoji 表情',
                'range': (0x1F600, 0x1F64F),
                'sample': '😀😁😂😃😄😅😆😇😈😉😊😋😌😍😎😏😐😑😒😓😔😕😖😗😘😙😚😛😜😝😞😟😠😡😢😣😤😥😦😧😨😩😪😫😬😭😮😯😰😱😲😳😴😵😶😷😸😹😺😻😼😽😾😿🙀🙁🙂🙃🙄🙅🙆🙇🙈🙉🙊🙋🙌🙍🙎🙏'
            }
        ]
        
        font_test = []
        for section in test_sections:
            font_test.append(f"\n=== {section['name']} ===")
            font_test.append(f"范围: U+{section['range'][0]:04X} - U+{section['range'][1]:04X}")
            font_test.append(f"示例: {section['sample']}")
            font_test.append("")
        
        return '\n'.join(font_test)

## 使用示例
i18n_helper = InternationalizationHelper()

## 生成特定区域字符
print("中文字符示例:")
zh_chars = i18n_helper.generate_locale_characters('zh_CN')
for char_info in zh_chars[:10]:  # 只显示前 10 个
    print(f"  {char_info['char']} ({char_info['hex']}) - {char_info['name']}")

## 多语言问候语
print("\n 多语言问候语:")
greetings = i18n_helper.create_multilingual_greeting()
for greeting_info in greetings[:8]:  # 显示前 8 个
    print(f"  {greeting_info['language_name']}: {greeting_info['greeting']} "
          f"({greeting_info['char_count']}字符, {greeting_info['unique_chars']}唯一字符)")

## 文本语言分析
print("\n 文本语言分析:")
test_texts = [
    "Hello World!",
    "你好世界！",
    "こんにちは世界！",
    "Hello 你好 こんにちは مرحبا",
    "Привет мир!"
]

for text in test_texts:
    analysis = i18n_helper.analyze_text_language(text)
    print(f"  '{text}':")
    print(f"    主要语言: {analysis['primary_language']} ({analysis['primary_percentage']:.1f}%)")
    print(f"    多语言文本: {'是' if analysis['is_multilingual'] else '否'}")
    if analysis['language_percentages']:
        top_languages = sorted(analysis['language_percentages'].items(), key=lambda x: x[1], reverse=True)[:3]
        print(f"    语言分布: {', '.join([f'{lang}({pct:.1f}%)' for lang, pct in top_languages])}")
    print()

## Unicode 字体测试
print("Unicode 字体测试文本:")
font_test = i18n_helper.create_unicode_font_test()
print(font_test[:500] + "..." if len(font_test) > 500 else font_test)  # 限制输出长度
```

### 常见陷阱和最佳实践

#### 错误处理和验证

```python
class SafeChrProcessor:
    """安全的 chr() 处理器"""
    
#    # Unicode 有效范围常量
    MIN_UNICODE = 0
    MAX_UNICODE = 0x10FFFF  # 1,114,111
    
    @staticmethod
    def safe_chr(code_point):
        """安全的 chr() 调用"""
        try:
#            # 类型检查
            if not isinstance(code_point, int):
                try:
                    code_point = int(code_point)
                except (ValueError, TypeError):
                    return {
                        'success': False,
                        'error': f"无法将 {type(code_point).__name__} 类型转换为整数",
                        'character': None,
                        'code_point': None
                    }
            
#            # 范围检查
            if not (SafeChrProcessor.MIN_UNICODE <= code_point <= SafeChrProcessor.MAX_UNICODE):
                return {
                    'success': False,
                    'error': f"码点 {code_point} 超出有效范围 [{SafeChrProcessor.MIN_UNICODE}, {SafeChrProcessor.MAX_UNICODE}]",
                    'character': None,
                    'code_point': code_point
                }
            
#            # 代理对检查(UTF-16 代理对在 Python 中无效)
            if 0xD800 <= code_point <= 0xDFFF:
                return {
                    'success': False,
                    'error': f"码点 {code_point} 是 UTF-16 代理对,在 Python 中无效",
                    'character': None,
                    'code_point': code_point
                }
            
#            # 执行转换
            character = chr(code_point)
            
            return {
                'success': True,
                'error': None,
                'character': character,
                'code_point': code_point,
                'hex_code': f"U+{code_point:04X}",
                'is_printable': character.isprintable(),
                'category': unicodedata.category(character),
                'name': unicodedata.name(character, '未知')
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f"未知错误: {str(e)}",
                'character': None,
                'code_point': code_point if 'code_point' in locals() else None
            }
    
    @staticmethod
    def batch_chr_safe(code_points, stop_on_error=False):
        """批量安全处理码点"""
        results = {
            'successful': [],
            'failed': [],
            'summary': {
                'total_points': len(code_points),
                'success_count': 0,
                'error_count': 0,
                'stopped_early': False
            }
        }
        
        for i, code_point in enumerate(code_points):
            result = SafeChrProcessor.safe_chr(code_point)
            
            if result['success']:
                results['successful'].append({
                    'index': i,
                    'code_point': result['code_point'],
                    'character': result['character'],
                    'hex_code': result['hex_code'],
                    'is_printable': result['is_printable']
                })
                results['summary']['success_count'] += 1
            else:
                results['failed'].append({
                    'index': i,
                    'code_point': code_point,
                    'error': result['error']
                })
                results['summary']['error_count'] += 1
                
                if stop_on_error:
                    results['summary']['stopped_early'] = True
                    break
        
        return results
    
    @staticmethod
    def validate_code_point_sequence(code_points):
        """验证码点序列的有效性"""
        validation_result = {
            'is_valid': True,
            'issues': [],
            'statistics': {
                'total_points': len(code_points),
                'valid_points': 0,
                'invalid_points': 0,
                'surrogate_pairs': 0,
                'private_use': 0,
                'control_chars': 0,
                'printable_chars': 0
            }
        }
        
        for i, code_point in enumerate(code_points):
            try:
#                # 基本有效性检查
                if not isinstance(code_point, int):
                    validation_result['issues'].append({
                        'index': i,
                        'code_point': code_point,
                        'issue': f"不是整数类型: {type(code_point).__name__}"
                    })
                    validation_result['is_valid'] = False
                    validation_result['statistics']['invalid_points'] += 1
                    continue
                
#                # 范围检查
                if not (0 <= code_point <= 0x10FFFF):
                    validation_result['issues'].append({
                        'index': i,
                        'code_point': code_point,
                        'issue': f"超出 Unicode 范围 [0, 1114111]"
                    })
                    validation_result['is_valid'] = False
                    validation_result['statistics']['invalid_points'] += 1
                    continue
                
#                # 代理对检查
                if 0xD800 <= code_point <= 0xDFFF:
                    validation_result['issues'].append({
                        'index': i,
                        'code_point': code_point,
                        'issue': "UTF-16 代理对,在 Python 中无效"
                    })
                    validation_result['is_valid'] = False
                    validation_result['statistics']['surrogate_pairs'] += 1
                    continue
                
#                # 尝试转换为字符
                char = chr(code_point)
                validation_result['statistics']['valid_points'] += 1
                
#                # 字符类型统计
                if 0xE000 <= code_point <= 0xF8FF or 0xF0000 <= code_point <= 0xFFFFD or 0x100000 <= code_point <= 0x10FFFD:
                    validation_result['statistics']['private_use'] += 1
                elif code_point < 32 or code_point == 127:
                    validation_result['statistics']['control_chars'] += 1
                elif char.isprintable():
                    validation_result['statistics']['printable_chars'] += 1
                
            except ValueError as e:
                validation_result['issues'].append({
                    'index': i,
                    'code_point': code_point,
                    'issue': f"chr() 转换失败: {str(e)}"
                })
                validation_result['is_valid'] = False
                validation_result['statistics']['invalid_points'] += 1
        
        return validation_result
    
    @staticmethod
    def suggest_alternatives(invalid_code_point):
        """为无效码点建议替代方案"""
        suggestions = []
        
        try:
            code_point = int(invalid_code_point)
        except (ValueError, TypeError):
            return ["输入必须是整数"]
        
#        # 超出范围的处理
        if code_point < 0:
            suggestions.append(f"使用绝对值: {abs(code_point)}")
            if abs(code_point) <= 0x10FFFF:
                suggestions.append(f"对应字符: '{chr(abs(code_point))}'")
        
        elif code_point > 0x10FFFF:
#            # 建议模运算
            mod_result = code_point % 0x110000
            suggestions.append(f"使用模运算: {code_point} % 1114112 = {mod_result}")
            if mod_result != 0:
                try:
                    suggestions.append(f"对应字符: '{chr(mod_result)}'")
                except ValueError:
                    pass
        
#        # 代理对的处理
        elif 0xD800 <= code_point <= 0xDFFF:
            suggestions.append("这是 UTF-16 代理对,Python 不支持")
            suggestions.append(f"尝试使用相近的有效码点: {0xD7FF} 或 {0xE000}")
            suggestions.append(f"U+D7FF: '{chr(0xD7FF)}'")
            suggestions.append(f"U+E000: '{chr(0xE000)}'")
        
#        # 其他情况
        else:
            suggestions.append("码点在有效范围内,但可能有其他问题")
        
        return suggestions

## 使用示例
safe_processor = SafeChrProcessor()

## 安全的 chr() 调用测试
test_cases = [65, 20013, -1, 1114112, 0xD800, "65", 3.14, None]
print("安全 chr() 测试:")
for test_case in test_cases:
    result = safe_processor.safe_chr(test_case)
    if result['success']:
        print(f"  {test_case} -> '{result['character']}' ({result['hex_code']}) - {result['name']}")
    else:
        print(f"  {test_case} -> 错误: {result['error']}")

## 批量处理
code_points = [65, 66, 67, -1, 20013, 1114112, 0xD800, 128013]
batch_result = safe_processor.batch_chr_safe(code_points)
print(f"\n 批量处理结果:")
print(f"  成功: {batch_result['summary']['success_count']} 个")
print(f"  失败: {batch_result['summary']['error_count']} 个")

## 显示成功的结果
for item in batch_result['successful'][:5]:
    print(f"    {item['code_point']} -> '{item['character']}' ({item['hex_code']})")

## 显示失败的结果
for item in batch_result['failed']:
    print(f"    错误: {item['code_point']} - {item['error']}")

## 码点序列验证
test_sequence = [65, 66, 67, -1, 20013, 0xD800, 128013, "invalid"]
validation = safe_processor.validate_code_point_sequence(test_sequence)
print(f"\n 序列验证结果:")
print(f"  有效: {validation['is_valid']}")
print(f"  统计: 总数{validation['statistics']['total_points']}, "
      f"有效{validation['statistics']['valid_points']}, "
      f"无效{validation['statistics']['invalid_points']}")

if validation['issues']:
    print("  问题:")
    for issue in validation['issues'][:3]:  # 只显示前 3 个问题
        print(f"    位置{issue['index']}: {issue['issue']}")

## 替代方案建议
print("\n 无效码点的替代建议:")
invalid_points = [-1, 1114112, 0xD800]
for point in invalid_points:
    suggestions = safe_processor.suggest_alternatives(point)
    print(f"  {point}:")
    for suggestion in suggestions:
        print(f"    - {suggestion}")
```

#### 性能优化和缓存

```python
import time
from functools import lru_cache
import weakref

class ChrPerformance:
    """chr() 性能优化"""
    
    def __init__(self):
        self._cache = {}
        self._stats = {
            'cache_hits': 0,
            'cache_misses': 0,
            'total_calls': 0
        }
    
    @lru_cache(maxsize=10000)
    def cached_chr(self, code_point):
        """使用 LRU 缓存的 chr() 调用"""
        return chr(code_point)
    
    def manual_cached_chr(self, code_point):
        """手动缓存的 chr() 调用"""
        self._stats['total_calls'] += 1
        
        if code_point in self._cache:
            self._stats['cache_hits'] += 1
            return self._cache[code_point]
        
        self._stats['cache_misses'] += 1
        result = chr(code_point)
        
#        # 限制缓存大小
        if len(self._cache) >= 5000:
#            # 移除最旧的条目
            oldest_key = next(iter(self._cache))
            del self._cache[oldest_key]
        
        self._cache[code_point] = result
        return result
    
    def get_cache_stats(self):
        """获取缓存统计信息"""
        hit_rate = 0
        if self._stats['total_calls'] > 0:
            hit_rate = self._stats['cache_hits'] / self._stats['total_calls'] * 100
        
        return {
            'total_calls': self._stats['total_calls'],
            'cache_hits': self._stats['cache_hits'],
            'cache_misses': self._stats['cache_misses'],
            'hit_rate': hit_rate,
            'cache_size': len(self._cache)
        }
    
    def clear_cache(self):
        """清空缓存"""
        self._cache.clear()
        self._stats = {'cache_hits': 0, 'cache_misses': 0, 'total_calls': 0}
        self.cached_chr.cache_clear()
    
    @staticmethod
    def benchmark_chr_methods(code_points, iterations=1000):
        """基准测试不同的 chr() 方法"""
        perf = ChrPerformance()
        
        methods = {
            '普通 chr()': lambda points: [chr(p) for p in points],
            'LRU 缓存 chr()': lambda points: [perf.cached_chr(p) for p in points],
            '手动缓存 chr()': lambda points: [perf.manual_cached_chr(p) for p in points]
        }
        
        results = {}
        
        for method_name, method_func in methods.items():
#            # 预热缓存
            if '缓存' in method_name:
                method_func(code_points[:100])
            
            start_time = time.time()
            
            for _ in range(iterations):
                result = method_func(code_points)
            
            end_time = time.time()
            
            results[method_name] = {
                'time': end_time - start_time,
                'avg_time': (end_time - start_time) / iterations,
                'chars_per_second': len(code_points) * iterations / (end_time - start_time)
            }
            
#            # 重置缓存以确保公平比较
            perf.clear_cache()
        
        return results
    
    @staticmethod
    def memory_efficient_chr_generation(start_code, end_code, chunk_size=1000):
        """内存高效的字符生成"""
        def chr_generator(start, end, chunk):
            """字符生成器"""
            for i in range(start, end, chunk):
                chunk_end = min(i + chunk, end)
                yield [chr(code) for code in range(i, chunk_end) if 0 <= code <= 0x10FFFF]
        
        total_chars = 0
        valid_chars = 0
        
        for chunk in chr_generator(start_code, end_code, chunk_size):
            total_chars += len(chunk)
            valid_chars += len([c for c in chunk if c.isprintable()])
            
            if total_chars % 10000 == 0:
                print(f"已生成 {total_chars} 个字符,其中 {valid_chars} 个可打印")
        
        return {
            'total_generated': total_chars,
            'printable_chars': valid_chars,
            'printable_ratio': valid_chars / total_chars if total_chars > 0 else 0
        }

## 性能测试
perf = ChrPerformance()

## 生成测试数据
test_codes = list(range(65, 91)) + list(range(97, 123)) + list(range(48, 58))  # A-Z, a-z, 0-9
test_codes += [20013, 25991, 20320, 22909]  # 一些中文字符
test_codes *= 10  # 增加重复以测试缓存效果

print(f"测试数据: {len(test_codes)} 个码点")
print("性能基准测试 (1000 次迭代):")

## 运行基准测试
benchmark_results = perf.benchmark_chr_methods(test_codes, 1000)

## 按性能排序
sorted_results = sorted(benchmark_results.items(), key=lambda x: x[1]['time'])

for method, stats in sorted_results:
    print(f"  {method:<15}: {stats['time']:.6f}秒 "
          f"(平均: {stats['avg_time']:.8f}秒, "
          f"{stats['chars_per_second']:.0f} 字符/秒)")

## 计算性能提升
fastest_time = sorted_results[0][1]['time']
print("\n 性能提升比较:")
for method, stats in sorted_results:
    speedup = fastest_time / stats['time']
    print(f"  {method:<15}: {speedup:.2f}x")

## 缓存效果测试
print("\n 缓存效果测试:")
perf.clear_cache()

## 第一次调用(缓存未命中)
for code in test_codes[:50]:
    perf.manual_cached_chr(code)

stats_after_first = perf.get_cache_stats()
print(f"第一次调用后: 命中率 {stats_after_first['hit_rate']:.1f}%, "
      f"缓存大小 {stats_after_first['cache_size']}")

## 第二次调用相同数据(应该有缓存命中)
for code in test_codes[:50]:
    perf.manual_cached_chr(code)

stats_after_second = perf.get_cache_stats()
print(f"第二次调用后: 命中率 {stats_after_second['hit_rate']:.1f}%, "
      f"缓存大小 {stats_after_second['cache_size']}")

## 内存效率测试
print("\n 内存效率测试:")
memory_stats = perf.memory_efficient_chr_generation(0, 10000, 1000)
print(f"生成完成:")
print(f"  总字符数: {memory_stats['total_generated']}")
print(f"  可打印字符: {memory_stats['printable_chars']}")
print(f"  可打印比例: {memory_stats['printable_ratio']:.2%}")
```

## 相关函数和模块

### 内置函数
- `ord()` - 字符转 Unicode 码点（chr 的逆操作）
- `hex()` - 整数转十六进制字符串
- `bin()` - 整数转二进制字符串
- `int()` - 字符串转整数
- `str()` - 对象转字符串

### 标准库
- `unicodedata` - Unicode 字符数据库
- `codecs` - 编解码器注册和基类
- `string` - 字符串常量和类
- `locale` - 国际化服务
- `re` - 正则表达式操作

### 第三方库
- `unidecode` - Unicode 文本转 ASCII
- `chardet` - 字符编码检测
- `ftfy` - 修复 Unicode 文本
- `emoji` - Emoji 处理库

## 扩展阅读

- [Python 官方文档 - chr()](https://docs.python.org/3/library/functions.html#chr)
- [Unicode 标准](https://unicode.org/standard/standard.html)
- [UTF-8 编码详解](https://en.wikipedia.org/wiki/UTF-8)
- [Python Unicode HOWTO](https://docs.python.org/3/howto/unicode.html)
- [Unicode 字符分类](https://www.unicode.org/reports/tr44/)

## 标签

`内置函数` `Unicode` `字符生成` `文本处理` `码点转换` `字符串操作` `国际化` `编码转换`