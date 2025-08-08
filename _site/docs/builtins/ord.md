# ord() - Unicode码点获取函数

## 概述

`ord()` 是 Python 的内置函数，用于返回单个字符的 Unicode 码点（整数值）。它是 `chr()` 函数的逆操作，将字符转换为对应的整数表示。

## 学习目标

通过本文档，你将学会：
- 理解 `ord()` 函数的基本概念和用途
- 掌握 `ord()` 函数的语法和参数
- 学会在各种场景中使用 `ord()` 函数
- 了解 Unicode 编码和字符处理
- 掌握相关的最佳实践和常见陷阱

## 前置知识

- Python 基础语法
- 字符串和字符的基本概念
- Unicode 编码的基本理解
- 数值类型的基本操作

## 详细内容

### 基本概念

`ord()` 函数接受一个长度为 1 的字符串（即单个字符），返回该字符对应的 Unicode 码点。Unicode 是一个国际标准，为世界上几乎所有的字符分配了唯一的数字标识符。

### 语法

```python
ord(c)
```

### 参数

- **c**: 长度为 1 的字符串（单个字符）。必须是 Unicode 字符。

### 返回值

返回一个整数，表示字符 c 的 Unicode 码点。

### 代码示例

#### 基本用法

```python
# ASCII 字符的码点
print(ord('A'))    # 输出: 65
print(ord('a'))    # 输出: 97
print(ord('0'))    # 输出: 48
print(ord(' '))    # 输出: 32 (空格)
print(ord('\n'))   # 输出: 10 (换行符)

# 特殊字符的码点
print(ord('!'))    # 输出: 33
print(ord('@'))    # 输出: 64
print(ord('#'))    # 输出: 35

# 中文字符的码点
print(ord('中'))   # 输出: 20013
print(ord('文'))   # 输出: 25991
print(ord('你'))   # 输出: 20320
print(ord('好'))   # 输出: 22909

# 其他语言字符
print(ord('α'))    # 输出: 945 (希腊字母 alpha)
print(ord('β'))    # 输出: 946 (希腊字母 beta)
print(ord('π'))    # 输出: 960 (希腊字母 pi)
```

#### 字符范围分析

```python
# ASCII 字符范围分析
def analyze_ascii_range():
    """分析 ASCII 字符范围"""
    ranges = {
        '控制字符': (0, 31),
        '可打印字符': (32, 126),
        '数字': (48, 57),
        '大写字母': (65, 90),
        '小写字母': (97, 122)
    }
    
    print("ASCII 字符范围分析:")
    for name, (start, end) in ranges.items():
        print(f"\n{name} ({start}-{end}):")
        
        # 显示范围内的一些字符
        sample_chars = []
        for code in range(start, min(end + 1, start + 10)):
            try:
                char = chr(code)
                if char.isprintable() or char in '\t\n\r':
                    sample_chars.append(f"'{char}'({code})")
                else:
                    sample_chars.append(f"控制字符({code})")
            except ValueError:
                sample_chars.append(f"无效({code})")
        
        print(f"  示例: {', '.join(sample_chars)}")
        if end - start > 10:
            print(f"  ... 还有 {end - start - 9} 个字符")

# 调用分析函数
analyze_ascii_range()
```

#### Unicode 字符工具类

```python
import unicodedata

class UnicodeAnalyzer:
    """Unicode 字符分析器"""
    
    @staticmethod
    def char_info(char):
        """获取字符的详细信息"""
        if len(char) != 1:
            raise ValueError("输入必须是单个字符")
        
        code_point = ord(char)
        
        info = {
            'character': char,
            'code_point': code_point,
            'hex_code': hex(code_point),
            'binary_code': bin(code_point),
            'unicode_name': unicodedata.name(char, '未知'),
            'category': unicodedata.category(char),
            'is_ascii': code_point < 128,
            'is_printable': char.isprintable(),
            'is_digit': char.isdigit(),
            'is_alpha': char.isalpha(),
            'is_alnum': char.isalnum(),
            'is_space': char.isspace(),
            'utf8_bytes': char.encode('utf-8'),
            'utf16_bytes': char.encode('utf-16le')
        }
        
        return info
    
    @staticmethod
    def compare_characters(chars):
        """比较多个字符"""
        print(f"{'字符':<5} {'码点':<8} {'十六进制':<10} {'类别':<5} {'名称':<30}")
        print("-" * 70)
        
        for char in chars:
            try:
                info = UnicodeAnalyzer.char_info(char)
                print(f"{char:<5} {info['code_point']:<8} {info['hex_code']:<10} "
                      f"{info['category']:<5} {info['unicode_name'][:28]:<30}")
            except Exception as e:
                print(f"{char:<5} 错误: {e}")
    
    @staticmethod
    def find_chars_in_range(start_code, end_code, max_results=20):
        """查找指定码点范围内的字符"""
        found_chars = []
        
        for code in range(start_code, min(end_code + 1, start_code + max_results)):
            try:
                char = chr(code)
                if char.isprintable():
                    found_chars.append({
                        'char': char,
                        'code': code,
                        'hex': hex(code),
                        'name': unicodedata.name(char, '未知')
                    })
            except ValueError:
                continue
        
        return found_chars
    
    @staticmethod
    def analyze_string(text):
        """分析字符串中所有字符"""
        analysis = {
            'total_chars': len(text),
            'unique_chars': len(set(text)),
            'code_point_range': None,
            'categories': {},
            'encoding_sizes': {
                'utf8': len(text.encode('utf-8')),
                'utf16': len(text.encode('utf-16le')),
                'utf32': len(text.encode('utf-32le'))
            },
            'char_details': []
        }
        
        code_points = [ord(char) for char in text]
        if code_points:
            analysis['code_point_range'] = (min(code_points), max(code_points))
        
        # 统计字符类别
        for char in text:
            category = unicodedata.category(char)
            if category not in analysis['categories']:
                analysis['categories'][category] = 0
            analysis['categories'][category] += 1
        
        # 详细字符信息（限制数量避免输出过长）
        unique_chars = list(set(text))[:10]
        for char in unique_chars:
            try:
                char_info = UnicodeAnalyzer.char_info(char)
                analysis['char_details'].append(char_info)
            except Exception:
                continue
        
        return analysis

# 使用示例
analyzer = UnicodeAnalyzer()

# 获取字符详细信息
char_info = analyzer.char_info('中')
print("字符 '中' 的详细信息:")
for key, value in char_info.items():
    print(f"  {key}: {value}")

# 比较多个字符
test_chars = ['A', 'a', '1', '中', 'α', '🐍', '©']
print("\n字符比较:")
analyzer.compare_characters(test_chars)

# 查找范围内的字符
print("\n希腊字母范围 (945-970):")
greek_chars = analyzer.find_chars_in_range(945, 970, 10)
for char_data in greek_chars:
    print(f"  {char_data['char']} ({char_data['code']}) - {char_data['name']}")

# 分析字符串
test_string = "Hello 世界! 🌍"
string_analysis = analyzer.analyze_string(test_string)
print(f"\n字符串 '{test_string}' 分析:")
print(f"  总字符数: {string_analysis['total_chars']}")
print(f"  唯一字符数: {string_analysis['unique_chars']}")
print(f"  码点范围: {string_analysis['code_point_range']}")
print(f"  编码大小: UTF-8({string_analysis['encoding_sizes']['utf8']}字节) "
      f"UTF-16({string_analysis['encoding_sizes']['utf16']}字节)")
```

### 实际应用场景

#### 文本处理和验证

```python
class TextValidator:
    """文本验证器"""
    
    @staticmethod
    def validate_ascii_only(text):
        """验证文本是否只包含 ASCII 字符"""
        non_ascii_chars = []
        
        for i, char in enumerate(text):
            if ord(char) > 127:
                non_ascii_chars.append({
                    'char': char,
                    'position': i,
                    'code_point': ord(char),
                    'hex_code': hex(ord(char))
                })
        
        return {
            'is_ascii_only': len(non_ascii_chars) == 0,
            'non_ascii_chars': non_ascii_chars,
            'total_chars': len(text),
            'ascii_chars': len(text) - len(non_ascii_chars)
        }
    
    @staticmethod
    def validate_printable_only(text):
        """验证文本是否只包含可打印字符"""
        non_printable_chars = []
        
        for i, char in enumerate(text):
            if not char.isprintable() and char not in '\t\n\r':
                non_printable_chars.append({
                    'char': repr(char),
                    'position': i,
                    'code_point': ord(char),
                    'hex_code': hex(ord(char))
                })
        
        return {
            'is_printable_only': len(non_printable_chars) == 0,
            'non_printable_chars': non_printable_chars,
            'total_chars': len(text)
        }
    
    @staticmethod
    def check_character_ranges(text):
        """检查字符所属的范围"""
        ranges = {
            'ASCII控制字符': (0, 31),
            'ASCII可打印': (32, 126),
            'Latin-1补充': (128, 255),
            'CJK统一汉字': (0x4E00, 0x9FFF),
            'emoji': (0x1F600, 0x1F64F),
            '数学符号': (0x2200, 0x22FF),
            '希腊字母': (0x0370, 0x03FF)
        }
        
        char_distribution = {name: [] for name in ranges.keys()}
        char_distribution['其他'] = []
        
        for char in text:
            code_point = ord(char)
            categorized = False
            
            for range_name, (start, end) in ranges.items():
                if start <= code_point <= end:
                    char_distribution[range_name].append({
                        'char': char,
                        'code_point': code_point
                    })
                    categorized = True
                    break
            
            if not categorized:
                char_distribution['其他'].append({
                    'char': char,
                    'code_point': code_point
                })
        
        # 移除空的分类
        return {k: v for k, v in char_distribution.items() if v}
    
    @staticmethod
    def suggest_encoding(text):
        """建议合适的编码方式"""
        max_code_point = max(ord(char) for char in text) if text else 0
        
        suggestions = []
        
        if max_code_point <= 127:
            suggestions.append({
                'encoding': 'ASCII',
                'reason': '所有字符都在ASCII范围内',
                'efficiency': '最高'
            })
        
        if max_code_point <= 255:
            suggestions.append({
                'encoding': 'Latin-1 (ISO-8859-1)',
                'reason': '所有字符都在Latin-1范围内',
                'efficiency': '高'
            })
        
        suggestions.append({
            'encoding': 'UTF-8',
            'reason': '通用Unicode编码，兼容性最好',
            'efficiency': '中等到高（取决于字符类型）'
        })
        
        if max_code_point > 0xFFFF:
            suggestions.append({
                'encoding': 'UTF-32',
                'reason': '包含需要4字节表示的字符',
                'efficiency': '低（固定4字节每字符）'
            })
        
        return {
            'max_code_point': max_code_point,
            'max_code_hex': hex(max_code_point),
            'suggestions': suggestions
        }

# 使用示例
validator = TextValidator()

# ASCII 验证
test_text1 = "Hello World!"
test_text2 = "Hello 世界!"

ascii_result1 = validator.validate_ascii_only(test_text1)
print(f"'{test_text1}' ASCII验证: {ascii_result1['is_ascii_only']}")

ascii_result2 = validator.validate_ascii_only(test_text2)
print(f"'{test_text2}' ASCII验证: {ascii_result2['is_ascii_only']}")
if not ascii_result2['is_ascii_only']:
    print("  非ASCII字符:")
    for char_info in ascii_result2['non_ascii_chars']:
        print(f"    位置{char_info['position']}: '{char_info['char']}' (码点: {char_info['code_point']})")

# 可打印字符验证
test_text3 = "Hello\x00World\x1F"
printable_result = validator.validate_printable_only(test_text3)
print(f"\n包含控制字符的文本可打印验证: {printable_result['is_printable_only']}")
if not printable_result['is_printable_only']:
    print("  非可打印字符:")
    for char_info in printable_result['non_printable_chars']:
        print(f"    位置{char_info['position']}: {char_info['char']} (码点: {char_info['code_point']})")

# 字符范围检查
test_text4 = "Hello 世界! αβγ 🐍 ∑∏∆"
range_result = validator.check_character_ranges(test_text4)
print(f"\n'{test_text4}' 字符范围分布:")
for range_name, chars in range_result.items():
    char_list = [f"'{c['char']}'({c['code_point']})" for c in chars[:3]]
    if len(chars) > 3:
        char_list.append(f"...还有{len(chars)-3}个")
    print(f"  {range_name}: {', '.join(char_list)}")

# 编码建议
encoding_suggestion = validator.suggest_encoding(test_text4)
print(f"\n编码建议 (最大码点: {encoding_suggestion['max_code_hex']}):")
for suggestion in encoding_suggestion['suggestions']:
    print(f"  {suggestion['encoding']}: {suggestion['reason']} (效率: {suggestion['efficiency']})")
```

#### 密码学和哈希应用

```python
import hashlib

class CharacterCrypto:
    """基于字符码点的密码学应用"""
    
    @staticmethod
    def simple_caesar_cipher(text, shift):
        """简单的凯撒密码（支持Unicode）"""
        encrypted = []
        
        for char in text:
            # 获取原始码点
            original_code = ord(char)
            
            # 应用偏移
            new_code = original_code + shift
            
            # 确保在有效的Unicode范围内
            if new_code > 0x10FFFF:  # Unicode最大码点
                new_code = new_code % 0x10FFFF
            elif new_code < 0:
                new_code = 0x10FFFF + new_code
            
            try:
                encrypted_char = chr(new_code)
                encrypted.append(encrypted_char)
            except ValueError:
                # 如果码点无效，保持原字符
                encrypted.append(char)
        
        return ''.join(encrypted)
    
    @staticmethod
    def character_checksum(text):
        """基于字符码点的校验和"""
        checksum = 0
        for i, char in enumerate(text):
            # 使用位置权重计算校验和
            checksum += ord(char) * (i + 1)
        
        return checksum % 0xFFFF  # 16位校验和
    
    @staticmethod
    def text_fingerprint(text):
        """生成文本指纹"""
        # 收集所有字符的码点
        code_points = [ord(char) for char in text]
        
        fingerprint = {
            'length': len(text),
            'unique_chars': len(set(text)),
            'code_point_sum': sum(code_points),
            'code_point_avg': sum(code_points) / len(code_points) if code_points else 0,
            'min_code_point': min(code_points) if code_points else 0,
            'max_code_point': max(code_points) if code_points else 0,
            'checksum': CharacterCrypto.character_checksum(text),
            'md5_hash': hashlib.md5(text.encode('utf-8')).hexdigest()[:16]
        }
        
        return fingerprint
    
    @staticmethod
    def generate_char_based_key(seed_text, key_length=16):
        """基于字符码点生成密钥"""
        if not seed_text:
            raise ValueError("种子文本不能为空")
        
        # 使用字符码点作为随机种子
        seed_value = sum(ord(char) * (i + 1) for i, char in enumerate(seed_text))
        
        # 生成密钥字符
        key_chars = []
        current_seed = seed_value
        
        for i in range(key_length):
            # 简单的线性同余生成器
            current_seed = (current_seed * 1103515245 + 12345) % (2**31)
            
            # 将种子值映射到可打印ASCII字符范围 (33-126)
            char_code = 33 + (current_seed % 94)
            key_chars.append(chr(char_code))
        
        return ''.join(key_chars)
    
    @staticmethod
    def analyze_text_entropy(text):
        """分析文本的熵值"""
        if not text:
            return {'entropy': 0, 'analysis': '空文本'}
        
        # 计算字符频率
        char_freq = {}
        for char in text:
            code_point = ord(char)
            if code_point not in char_freq:
                char_freq[code_point] = 0
            char_freq[code_point] += 1
        
        # 计算熵值
        text_length = len(text)
        entropy = 0
        
        for count in char_freq.values():
            probability = count / text_length
            if probability > 0:
                entropy -= probability * (probability.bit_length() - 1)
        
        analysis = {
            'entropy': entropy,
            'max_possible_entropy': len(char_freq).bit_length() - 1,
            'entropy_ratio': entropy / (len(char_freq).bit_length() - 1) if len(char_freq) > 1 else 0,
            'unique_chars': len(char_freq),
            'total_chars': text_length,
            'most_frequent_char': max(char_freq.items(), key=lambda x: x[1]) if char_freq else None
        }
        
        return analysis

# 使用示例
crypto = CharacterCrypto()

# 凯撒密码
original_text = "Hello 世界!"
shift = 3
encrypted = crypto.simple_caesar_cipher(original_text, shift)
decrypted = crypto.simple_caesar_cipher(encrypted, -shift)

print(f"原文: {original_text}")
print(f"加密 (偏移{shift}): {encrypted}")
print(f"解密: {decrypted}")

# 字符校验和
checksum = crypto.character_checksum(original_text)
print(f"\n'{original_text}' 的校验和: {checksum} (0x{checksum:04x})")

# 文本指纹
fingerprint = crypto.text_fingerprint(original_text)
print(f"\n文本指纹:")
for key, value in fingerprint.items():
    print(f"  {key}: {value}")

# 生成密钥
key = crypto.generate_char_based_key(original_text, 16)
print(f"\n基于 '{original_text}' 生成的密钥: {key}")

# 熵值分析
entropy_analysis = crypto.analyze_text_entropy(original_text)
print(f"\n熵值分析:")
for key, value in entropy_analysis.items():
    if key == 'most_frequent_char' and value:
        char_code, freq = value
        print(f"  {key}: '{chr(char_code)}'({char_code}) 出现{freq}次")
    else:
        print(f"  {key}: {value}")
```

#### 数据转换和编码

```python
class CharacterEncoder:
    """字符编码转换器"""
    
    @staticmethod
    def to_numeric_codes(text, base=10):
        """将文本转换为数字码点序列"""
        codes = [ord(char) for char in text]
        
        if base == 10:
            return codes
        elif base == 16:
            return [hex(code) for code in codes]
        elif base == 8:
            return [oct(code) for code in codes]
        elif base == 2:
            return [bin(code) for code in codes]
        else:
            raise ValueError(f"不支持的进制: {base}")
    
    @staticmethod
    def from_numeric_codes(codes, base=10):
        """从数字码点序列恢复文本"""
        chars = []
        
        for code in codes:
            try:
                if base == 10:
                    char_code = int(code)
                elif base == 16:
                    char_code = int(str(code).replace('0x', ''), 16)
                elif base == 8:
                    char_code = int(str(code).replace('0o', ''), 8)
                elif base == 2:
                    char_code = int(str(code).replace('0b', ''), 2)
                else:
                    raise ValueError(f"不支持的进制: {base}")
                
                chars.append(chr(char_code))
            except (ValueError, OverflowError):
                chars.append('?')  # 无效码点用?替代
        
        return ''.join(chars)
    
    @staticmethod
    def encode_as_escape_sequence(text):
        """编码为转义序列"""
        encoded = []
        
        for char in text:
            code_point = ord(char)
            
            if code_point < 32 or code_point > 126:
                # 非可打印字符使用Unicode转义
                if code_point <= 0xFF:
                    encoded.append(f'\\x{code_point:02x}')
                elif code_point <= 0xFFFF:
                    encoded.append(f'\\u{code_point:04x}')
                else:
                    encoded.append(f'\\U{code_point:08x}')
            else:
                # 可打印ASCII字符直接使用
                if char in '\\"\'':
                    encoded.append('\\' + char)
                else:
                    encoded.append(char)
        
        return ''.join(encoded)
    
    @staticmethod
    def create_character_map(text):
        """创建字符映射表"""
        char_map = {}
        reverse_map = {}
        
        unique_chars = list(set(text))
        unique_chars.sort(key=ord)  # 按码点排序
        
        for i, char in enumerate(unique_chars):
            char_map[char] = i
            reverse_map[i] = char
        
        return {
            'char_to_index': char_map,
            'index_to_char': reverse_map,
            'mapping_table': [(char, ord(char), i) for i, char in enumerate(unique_chars)]
        }
    
    @staticmethod
    def compress_repeated_chars(text):
        """压缩重复字符（简单的行程编码）"""
        if not text:
            return []
        
        compressed = []
        current_char = text[0]
        count = 1
        
        for char in text[1:]:
            if char == current_char:
                count += 1
            else:
                compressed.append({
                    'char': current_char,
                    'code_point': ord(current_char),
                    'count': count
                })
                current_char = char
                count = 1
        
        # 添加最后一个字符组
        compressed.append({
            'char': current_char,
            'code_point': ord(current_char),
            'count': count
        })
        
        return compressed
    
    @staticmethod
    def decompress_repeated_chars(compressed_data):
        """解压缩重复字符"""
        decompressed = []
        
        for item in compressed_data:
            char = item['char']
            count = item['count']
            decompressed.extend([char] * count)
        
        return ''.join(decompressed)

# 使用示例
encoder = CharacterEncoder()

# 数字码点转换
test_text = "Hello 世界!"
print(f"原文: {test_text}")

# 转换为不同进制的码点
decimal_codes = encoder.to_numeric_codes(test_text, 10)
hex_codes = encoder.to_numeric_codes(test_text, 16)
print(f"十进制码点: {decimal_codes}")
print(f"十六进制码点: {hex_codes}")

# 从码点恢复文本
restored_text = encoder.from_numeric_codes(decimal_codes, 10)
print(f"恢复的文本: {restored_text}")

# 转义序列编码
escaped = encoder.encode_as_escape_sequence(test_text)
print(f"\n转义序列: {escaped}")

# 字符映射表
char_mapping = encoder.create_character_map(test_text)
print(f"\n字符映射表:")
for char, code_point, index in char_mapping['mapping_table']:
    print(f"  '{char}' (码点{code_point}) -> 索引{index}")

# 重复字符压缩
repeat_text = "aaabbbcccdddeee"
compressed = encoder.compress_repeated_chars(repeat_text)
decompressed = encoder.decompress_repeated_chars(compressed)

print(f"\n原文: {repeat_text}")
print(f"压缩结果:")
for item in compressed:
    print(f"  '{item['char']}' x {item['count']}")
print(f"解压结果: {decompressed}")
print(f"压缩率: {len(compressed)}/{len(repeat_text)} = {len(compressed)/len(repeat_text):.2%}")
```

### 常见陷阱和最佳实践

#### 错误处理和边界情况

```python
class SafeOrdProcessor:
    """安全的 ord() 处理器"""
    
    @staticmethod
    def safe_ord(value):
        """安全的 ord() 调用"""
        try:
            # 检查输入类型
            if not isinstance(value, str):
                return {
                    'success': False,
                    'error': f"输入必须是字符串，实际类型: {type(value).__name__}",
                    'code_point': None
                }
            
            # 检查长度
            if len(value) != 1:
                return {
                    'success': False,
                    'error': f"输入必须是单个字符，实际长度: {len(value)}",
                    'code_point': None
                }
            
            # 执行转换
            code_point = ord(value)
            
            return {
                'success': True,
                'error': None,
                'code_point': code_point,
                'hex_code': hex(code_point),
                'character': value
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f"未知错误: {str(e)}",
                'code_point': None
            }
    
    @staticmethod
    def batch_ord_safe(text):
        """批量安全处理字符串中的每个字符"""
        results = {
            'successful': [],
            'failed': [],
            'summary': {
                'total_chars': len(text),
                'success_count': 0,
                'error_count': 0
            }
        }
        
        for i, char in enumerate(text):
            result = SafeOrdProcessor.safe_ord(char)
            
            if result['success']:
                results['successful'].append({
                    'position': i,
                    'character': char,
                    'code_point': result['code_point'],
                    'hex_code': result['hex_code']
                })
                results['summary']['success_count'] += 1
            else:
                results['failed'].append({
                    'position': i,
                    'character': char,
                    'error': result['error']
                })
                results['summary']['error_count'] += 1
        
        return results
    
    @staticmethod
    def validate_unicode_range(char, min_code=0, max_code=0x10FFFF):
        """验证字符是否在指定的Unicode范围内"""
        try:
            code_point = ord(char)
            
            if min_code <= code_point <= max_code:
                return {
                    'valid': True,
                    'code_point': code_point,
                    'message': f"字符 '{char}' 在范围 [{min_code}, {max_code}] 内"
                }
            else:
                return {
                    'valid': False,
                    'code_point': code_point,
                    'message': f"字符 '{char}' (码点{code_point}) 超出范围 [{min_code}, {max_code}]"
                }
                
        except Exception as e:
            return {
                'valid': False,
                'code_point': None,
                'message': f"处理字符 '{char}' 时出错: {str(e)}"
            }
    
    @staticmethod
    def find_problematic_chars(text, encoding='utf-8'):
        """查找在指定编码下可能有问题的字符"""
        problematic = []
        
        for i, char in enumerate(text):
            try:
                # 尝试编码
                char.encode(encoding)
                
                # 检查是否为代理对（在UTF-16中使用）
                code_point = ord(char)
                if 0xD800 <= code_point <= 0xDFFF:
                    problematic.append({
                        'position': i,
                        'character': char,
                        'code_point': code_point,
                        'issue': '代理对字符，在某些上下文中可能有问题'
                    })
                
                # 检查是否为私用区字符
                elif (0xE000 <= code_point <= 0xF8FF or
                      0xF0000 <= code_point <= 0xFFFFD or
                      0x100000 <= code_point <= 0x10FFFD):
                    problematic.append({
                        'position': i,
                        'character': char,
                        'code_point': code_point,
                        'issue': '私用区字符，显示可能因系统而异'
                    })
                
            except UnicodeEncodeError as e:
                problematic.append({
                    'position': i,
                    'character': char,
                    'code_point': ord(char),
                    'issue': f'无法用{encoding}编码: {str(e)}'
                })
        
        return problematic

# 使用示例
safe_processor = SafeOrdProcessor()

# 安全的 ord() 调用
test_cases = ['A', 'Hello', '', 123, None, '中']
print("安全 ord() 测试:")
for test_case in test_cases:
    result = safe_processor.safe_ord(test_case)
    if result['success']:
        print(f"  '{test_case}' -> {result['code_point']} ({result['hex_code']})")
    else:
        print(f"  {test_case} -> 错误: {result['error']}")

# 批量处理
test_string = "Hello 世界! 🌍"
batch_result = safe_processor.batch_ord_safe(test_string)
print(f"\n批量处理 '{test_string}':")
print(f"  成功: {batch_result['summary']['success_count']} 个字符")
print(f"  失败: {batch_result['summary']['error_count']} 个字符")

# 显示前几个成功的结果
for item in batch_result['successful'][:5]:
    print(f"    位置{item['position']}: '{item['character']}' -> {item['code_point']}")

# Unicode范围验证
print("\nUnicode范围验证:")
test_chars = ['A', '中', '🌍', '\uD800']  # 最后一个是代理对
for char in test_chars:
    # 验证是否在基本多语言平面 (BMP) 内
    result = safe_processor.validate_unicode_range(char, 0, 0xFFFF)
    print(f"  {result['message']}")

# 查找问题字符
problematic_text = "Hello\uD800\uDC00World"  # 包含代理对
problems = safe_processor.find_problematic_chars(problematic_text)
print(f"\n在 '{repr(problematic_text)}' 中发现的问题:")
for problem in problems:
    print(f"  位置{problem['position']}: {problem['issue']}")
```

#### 性能优化

```python
import time
from functools import lru_cache

class OrdPerformance:
    """ord() 性能优化"""
    
    @staticmethod
    @lru_cache(maxsize=1000)
    def cached_ord(char):
        """缓存的 ord() 调用"""
        return ord(char)
    
    @staticmethod
    def batch_ord_optimized(text):
        """优化的批量 ord() 处理"""
        # 使用列表推导式，比循环更快
        return [ord(char) for char in text]
    
    @staticmethod
    def ord_with_lookup_table(text, use_cache=True):
        """使用查找表的 ord() 处理"""
        if use_cache:
            return [OrdPerformance.cached_ord(char) for char in text]
        else:
            return [ord(char) for char in text]
    
    @staticmethod
    def performance_comparison(test_text, iterations=1000):
        """性能比较测试"""
        methods = {
            '普通ord()': lambda text: [ord(char) for char in text],
            '缓存ord()': lambda text: [OrdPerformance.cached_ord(char) for char in text],
            '批量优化': OrdPerformance.batch_ord_optimized
        }
        
        results = {}
        
        for method_name, method_func in methods.items():
            start_time = time.time()
            
            for _ in range(iterations):
                result = method_func(test_text)
            
            end_time = time.time()
            results[method_name] = {
                'time': end_time - start_time,
                'avg_time': (end_time - start_time) / iterations
            }
        
        return results
    
    @staticmethod
    def memory_efficient_ord_processing(large_text):
        """内存高效的大文本处理"""
        def ord_generator(text):
            """ord() 生成器，节省内存"""
            for char in text:
                yield ord(char)
        
        # 分块处理大文本
        chunk_size = 10000
        processed_count = 0
        code_point_stats = {
            'min': float('inf'),
            'max': 0,
            'sum': 0,
            'count': 0
        }
        
        for i in range(0, len(large_text), chunk_size):
            chunk = large_text[i:i + chunk_size]
            ord_gen = ord_generator(chunk)
            
            for code_point in ord_gen:
                processed_count += 1
                code_point_stats['min'] = min(code_point_stats['min'], code_point)
                code_point_stats['max'] = max(code_point_stats['max'], code_point)
                code_point_stats['sum'] += code_point
                code_point_stats['count'] += 1
            
            if processed_count % 100000 == 0:
                print(f"已处理 {processed_count} 个字符")
        
        code_point_stats['avg'] = code_point_stats['sum'] / code_point_stats['count']
        return code_point_stats

# 性能测试
perf = OrdPerformance()

# 生成测试文本
test_text = "Hello World! 你好世界! αβγδε 🌍🚀🎉" * 100

print(f"测试文本长度: {len(test_text)} 字符")
print("性能比较测试 (1000次迭代):")

# 性能比较
perf_results = perf.performance_comparison(test_text, 1000)

sorted_results = sorted(perf_results.items(), key=lambda x: x[1]['time'])
for method, stats in sorted_results:
    print(f"  {method:<12}: {stats['time']:.6f}秒 (平均: {stats['avg_time']:.8f}秒)")

# 计算性能提升
fastest_time = sorted_results[0][1]['time']
print("\n性能提升比较:")
for method, stats in sorted_results:
    speedup = fastest_time / stats['time']
    print(f"  {method:<12}: {speedup:.2f}x")

# 大文本内存效率测试
print("\n大文本内存效率测试:")
large_text = test_text * 1000  # 约100万字符
stats = perf.memory_efficient_ord_processing(large_text)
print(f"处理完成，统计结果:")
print(f"  字符数: {stats['count']}")
print(f"  最小码点: {stats['min']} ('{chr(stats['min'])}')") 
print(f"  最大码点: {stats['max']} ('{chr(stats['max']) if stats['max'] <= 0x10FFFF else '无效'}')")
print(f"  平均码点: {stats['avg']:.2f}")
```

## 相关函数和模块

### 内置函数
- `chr()` - Unicode码点转字符（ord的逆操作）
- `hex()` - 整数转十六进制字符串
- `bin()` - 整数转二进制字符串
- `int()` - 字符串转整数

### 标准库
- `unicodedata` - Unicode字符数据库
- `codecs` - 编解码器注册和基类
- `string` - 字符串常量和类
- `re` - 正则表达式操作

### 第三方库
- `unidecode` - Unicode文本转ASCII
- `chardet` - 字符编码检测
- `ftfy` - 修复Unicode文本

## 扩展阅读

- [Python 官方文档 - ord()](https://docs.python.org/3/library/functions.html#ord)
- [Unicode 标准](https://unicode.org/standard/standard.html)
- [UTF-8 编码详解](https://en.wikipedia.org/wiki/UTF-8)
- [Python Unicode HOWTO](https://docs.python.org/3/howto/unicode.html)

## 标签

`内置函数` `Unicode` `字符编码` `文本处理` `码点转换` `字符串操作` `国际化` `编码转换`