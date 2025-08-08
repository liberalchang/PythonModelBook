---
layout: doc
title: 类的定义与基础概念
permalink: /docs/basics/class-definition/
category: basics
tags: [类, 面向对象, 构造函数, 实例属性, 类属性]
description: Python类的定义语法、构造函数、属性类型和基础概念详解
author: Python文档团队
date: 2024-01-01
updated: 2024-01-01
version: 1.0
difficulty: 初级
---

# 类的定义与基础概念

## 📝 概述

类是面向对象编程的核心概念，它是创建对象的蓝图或模板。在Python中，类定义了对象的属性和方法，通过类可以创建具有相同结构和行为的多个对象实例。理解类的定义和基础概念是掌握Python面向对象编程的第一步。

## 🎯 学习目标

- 掌握Python类的基本定义语法
- 理解构造函数`__init__`的作用和用法
- 区分实例属性和类属性的概念和使用
- 学会定义和使用实例方法、类方法和静态方法
- 理解Python中"一切皆对象"的哲学思想
- 掌握抽象、封装等面向对象基本概念

## 📋 前置知识

- Python基本语法和数据类型
- 函数的定义和调用
- 变量作用域的概念
- 基本的编程思维

## 🔍 详细内容

### 类的基本语法

在Python中，使用`class`关键字来定义类，基本语法如下：

```python
class ClassName:
    """类的文档字符串"""
    # 类属性定义
    class_attribute = value
    
    # 构造函数，用于初始化对象属性
    def __init__(self, parameter1, parameter2):
        """构造函数"""
        # 实例属性定义
        self.instance_attribute1 = parameter1
        self.instance_attribute2 = parameter2
    
    # 实例方法定义
    def instance_method(self):
        """实例方法"""
        print(f"这是一个实例方法，访问实例属性: {self.instance_attribute1}")
```

#### 类命名规范

- 类名使用大驼峰命名法（PascalCase）
- 每个单词首字母大写
- 避免使用Python关键字和内置函数名

```python
# 正确的类名示例
class Person:          # 人
class BankAccount:     # 银行账户
class HttpRequest:     # HTTP请求
class DatabaseManager: # 数据库管理器

# 错误的类名示例
class person:          # 应该首字母大写
class bank_account:    # 应该使用大驼峰命名
class list:            # 不应该使用内置类型名
```

### 构造函数__init__

`__init__`方法是Python类中的构造函数，在创建类的实例时自动调用，用于初始化对象的属性。

```python
import math

class Circle:
    """圆形类"""
    
    def __init__(self, radius):
        """初始化圆形
        
        Args:
            radius (float): 圆的半径
        """
        if radius <= 0:
            raise ValueError("半径必须大于0")
        self.radius = radius  # 初始化圆的半径
    
    def area(self):
        """计算圆的面积"""
        return math.pi * self.radius ** 2
    
    def circumference(self):
        """计算圆的周长"""
        return 2 * math.pi * self.radius
    
    def __str__(self):
        """字符串表示"""
        return f"Circle(radius={self.radius})"

# 创建圆形实例
my_circle = Circle(5)
print(f"圆的信息: {my_circle}")
print(f"圆的面积: {my_circle.area():.2f}")
print(f"圆的周长: {my_circle.circumference():.2f}")
```

#### 构造函数的特点

- 第一个参数必须是`self`，代表实例本身
- 在创建对象时自动调用，无需手动调用
- 可以接受参数来初始化实例属性
- 可以包含参数验证和初始化逻辑

### 实例属性与类属性

#### 实例属性

实例属性是每个实例独有的属性，在`__init__`方法中通过`self`进行定义和赋值。

```python
class Person:
    """人员类"""
    
    def __init__(self, name, age, email):
        """初始化人员信息"""
        self.name = name      # 实例属性：姓名
        self.age = age        # 实例属性：年龄
        self.email = email    # 实例属性：邮箱
        self._id = None       # 私有属性：ID（以下划线开头表示私有）
    
    def set_id(self, person_id):
        """设置人员ID"""
        self._id = person_id
    
    def get_info(self):
        """获取人员信息"""
        return f"姓名: {self.name}, 年龄: {self.age}, 邮箱: {self.email}"

# 创建不同的人员实例
person1 = Person("张三", 25, "zhangsan@example.com")
person2 = Person("李四", 30, "lisi@example.com")

print(person1.get_info())
print(person2.get_info())
```

#### 类属性

类属性是属于类本身的属性，定义在类中但在方法之外，所有实例共享该类属性。

```python
class Employee:
    """员工类"""
    
    # 类属性
    company_name = "科技有限公司"  # 公司名称
    employee_count = 0           # 员工总数
    base_salary = 5000          # 基础工资
    
    def __init__(self, name, department, position):
        """初始化员工信息"""
        self.name = name              # 实例属性：姓名
        self.department = department  # 实例属性：部门
        self.position = position      # 实例属性：职位
        self.employee_id = Employee.employee_count + 1  # 员工ID
        
        # 每创建一个员工，员工总数加1
        Employee.employee_count += 1
    
    def get_full_info(self):
        """获取完整员工信息"""
        return {
            "公司": Employee.company_name,
            "员工ID": self.employee_id,
            "姓名": self.name,
            "部门": self.department,
            "职位": self.position
        }
    
    @classmethod
    def get_company_info(cls):
        """获取公司信息（类方法）"""
        return f"{cls.company_name}，当前员工总数：{cls.employee_count}"
    
    @classmethod
    def set_company_name(cls, new_name):
        """设置公司名称（类方法）"""
        cls.company_name = new_name

# 创建员工实例
emp1 = Employee("王五", "技术部", "软件工程师")
emp2 = Employee("赵六", "市场部", "市场专员")
emp3 = Employee("孙七", "人事部", "人事专员")

# 访问实例属性
print(f"员工1信息: {emp1.get_full_info()}")
print(f"员工2信息: {emp2.get_full_info()}")

# 访问类属性
print(f"\n通过实例访问类属性: {emp1.company_name}")
print(f"通过类名访问类属性: {Employee.company_name}")
print(f"员工总数: {Employee.employee_count}")

# 修改类属性
Employee.set_company_name("新科技有限公司")
print(f"\n公司信息: {Employee.get_company_info()}")
```

### 方法类型

#### 实例方法

实例方法是最常见的方法类型，第一个参数是`self`，用于访问实例属性和其他实例方法。

```python
class Rectangle:
    """矩形类"""
    
    def __init__(self, width, height):
        """初始化矩形"""
        self.width = width
        self.height = height
    
    def area(self):
        """计算面积（实例方法）"""
        return self.width * self.height
    
    def perimeter(self):
        """计算周长（实例方法）"""
        return 2 * (self.width + self.height)
    
    def scale(self, factor):
        """缩放矩形（实例方法）"""
        self.width *= factor
        self.height *= factor
    
    def is_square(self):
        """判断是否为正方形（实例方法）"""
        return self.width == self.height

# 使用实例方法
rect = Rectangle(4, 6)
print(f"矩形面积: {rect.area()}")
print(f"矩形周长: {rect.perimeter()}")
print(f"是否为正方形: {rect.is_square()}")

rect.scale(2)
print(f"缩放后面积: {rect.area()}")
```

#### 类方法

类方法使用`@classmethod`装饰器定义，第一个参数是`cls`，代表类本身。

```python
class Student:
    """学生类"""
    
    school_name = "Python学院"  # 类属性
    student_count = 0          # 学生总数
    
    def __init__(self, name, grade, student_id=None):
        """初始化学生信息"""
        self.name = name
        self.grade = grade
        self.student_id = student_id or self._generate_student_id()
        Student.student_count += 1
    
    def _generate_student_id(self):
        """生成学生ID（私有方法）"""
        return f"STU{Student.student_count + 1:04d}"
    
    @classmethod
    def from_string(cls, student_string):
        """从字符串创建学生对象（类方法）"""
        name, grade = student_string.split('-')
        return cls(name, int(grade))
    
    @classmethod
    def from_dict(cls, student_dict):
        """从字典创建学生对象（类方法）"""
        return cls(
            student_dict['name'],
            student_dict['grade'],
            student_dict.get('student_id')
        )
    
    @classmethod
    def get_school_info(cls):
        """获取学校信息（类方法）"""
        return f"学校: {cls.school_name}, 学生总数: {cls.student_count}"
    
    @classmethod
    def set_school_name(cls, new_name):
        """设置学校名称（类方法）"""
        cls.school_name = new_name
    
    def __str__(self):
        return f"Student(ID: {self.student_id}, Name: {self.name}, Grade: {self.grade})"

# 使用不同方式创建学生对象
student1 = Student("张三", 10)
student2 = Student.from_string("李四-11")
student3 = Student.from_dict({
    'name': '王五',
    'grade': 12,
    'student_id': 'STU9999'
})

print(student1)
print(student2)
print(student3)
print(Student.get_school_info())
```

#### 静态方法

静态方法使用`@staticmethod`装饰器定义，不需要`self`或`cls`参数，与类和实例都没有直接关联。

```python
class MathUtils:
    """数学工具类"""
    
    @staticmethod
    def is_prime(n):
        """判断是否为质数（静态方法）"""
        if n < 2:
            return False
        for i in range(2, int(n ** 0.5) + 1):
            if n % i == 0:
                return False
        return True
    
    @staticmethod
    def factorial(n):
        """计算阶乘（静态方法）"""
        if n < 0:
            raise ValueError("阶乘不能计算负数")
        if n <= 1:
            return 1
        result = 1
        for i in range(2, n + 1):
            result *= i
        return result
    
    @staticmethod
    def gcd(a, b):
        """计算最大公约数（静态方法）"""
        while b:
            a, b = b, a % b
        return a
    
    @staticmethod
    def lcm(a, b):
        """计算最小公倍数（静态方法）"""
        return abs(a * b) // MathUtils.gcd(a, b)

class Person:
    """人员类"""
    
    def __init__(self, name, birth_year):
        self.name = name
        self.birth_year = birth_year
    
    @staticmethod
    def is_adult(age):
        """判断是否成年（静态方法）"""
        return age >= 18
    
    @staticmethod
    def calculate_age(birth_year, current_year=2024):
        """计算年龄（静态方法）"""
        return current_year - birth_year
    
    def get_age(self, current_year=2024):
        """获取当前年龄（实例方法）"""
        return self.calculate_age(self.birth_year, current_year)
    
    def is_person_adult(self, current_year=2024):
        """判断此人是否成年（实例方法）"""
        age = self.get_age(current_year)
        return self.is_adult(age)

# 使用静态方法
print(f"17是质数吗？ {MathUtils.is_prime(17)}")
print(f"5的阶乘: {MathUtils.factorial(5)}")
print(f"12和18的最大公约数: {MathUtils.gcd(12, 18)}")
print(f"12和18的最小公倍数: {MathUtils.lcm(12, 18)}")

# 静态方法可以通过类名或实例调用
print(f"20岁是否成年: {Person.is_adult(20)}")
person = Person("张三", 2000)
print(f"16岁是否成年: {person.is_adult(16)}")
print(f"张三是否成年: {person.is_person_adult()}")
```

## 💡 实际应用

### 银行账户管理系统

```python
from datetime import datetime
from typing import List, Optional

class BankAccount:
    """银行账户类"""
    
    # 类属性
    bank_name = "Python银行"
    account_count = 0
    interest_rate = 0.03  # 年利率3%
    
    def __init__(self, owner_name: str, initial_balance: float = 0):
        """初始化银行账户
        
        Args:
            owner_name: 账户持有人姓名
            initial_balance: 初始余额
        """
        if initial_balance < 0:
            raise ValueError("初始余额不能为负数")
        
        # 实例属性
        self.owner_name = owner_name
        self.balance = initial_balance
        self.account_number = self._generate_account_number()
        self.transaction_history: List[dict] = []
        self.created_at = datetime.now()
        
        # 更新账户总数
        BankAccount.account_count += 1
        
        # 记录开户交易
        if initial_balance > 0:
            self._add_transaction("开户存款", initial_balance)
    
    def _generate_account_number(self) -> str:
        """生成账户号码（私有方法）"""
        return f"ACC{BankAccount.account_count + 1:08d}"
    
    def _add_transaction(self, transaction_type: str, amount: float, balance_after: Optional[float] = None):
        """添加交易记录（私有方法）"""
        self.transaction_history.append({
            "时间": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "类型": transaction_type,
            "金额": amount,
            "余额": balance_after or self.balance
        })
    
    def deposit(self, amount: float) -> bool:
        """存款（实例方法）"""
        if amount <= 0:
            print("存款金额必须大于0")
            return False
        
        self.balance += amount
        self._add_transaction("存款", amount)
        print(f"存款成功！当前余额: ¥{self.balance:.2f}")
        return True
    
    def withdraw(self, amount: float) -> bool:
        """取款（实例方法）"""
        if amount <= 0:
            print("取款金额必须大于0")
            return False
        
        if amount > self.balance:
            print("余额不足，取款失败")
            return False
        
        self.balance -= amount
        self._add_transaction("取款", -amount)
        print(f"取款成功！当前余额: ¥{self.balance:.2f}")
        return True
    
    def transfer(self, target_account: 'BankAccount', amount: float) -> bool:
        """转账（实例方法）"""
        if amount <= 0:
            print("转账金额必须大于0")
            return False
        
        if amount > self.balance:
            print("余额不足，转账失败")
            return False
        
        # 执行转账
        self.balance -= amount
        target_account.balance += amount
        
        # 记录交易
        self._add_transaction(f"转账给{target_account.owner_name}", -amount)
        target_account._add_transaction(f"来自{self.owner_name}的转账", amount)
        
        print(f"转账成功！向{target_account.owner_name}转账¥{amount:.2f}")
        print(f"当前余额: ¥{self.balance:.2f}")
        return True
    
    def get_balance(self) -> float:
        """查询余额（实例方法）"""
        return self.balance
    
    def get_transaction_history(self, limit: int = 10) -> List[dict]:
        """获取交易历史（实例方法）"""
        return self.transaction_history[-limit:]
    
    def calculate_interest(self, months: int = 12) -> float:
        """计算利息（实例方法）"""
        return self.balance * (BankAccount.interest_rate / 12) * months
    
    @classmethod
    def from_existing_account(cls, owner_name: str, account_number: str, balance: float):
        """从现有账户信息创建对象（类方法）"""
        account = cls(owner_name, balance)
        account.account_number = account_number
        return account
    
    @classmethod
    def get_bank_info(cls) -> str:
        """获取银行信息（类方法）"""
        return f"银行: {cls.bank_name}, 总账户数: {cls.account_count}, 年利率: {cls.interest_rate*100}%"
    
    @classmethod
    def set_interest_rate(cls, new_rate: float):
        """设置利率（类方法）"""
        if 0 <= new_rate <= 1:
            cls.interest_rate = new_rate
            print(f"利率已更新为: {new_rate*100}%")
        else:
            print("利率必须在0-100%之间")
    
    @staticmethod
    def is_valid_amount(amount: float) -> bool:
        """验证金额是否有效（静态方法）"""
        return isinstance(amount, (int, float)) and amount > 0
    
    @staticmethod
    def format_currency(amount: float) -> str:
        """格式化货币显示（静态方法）"""
        return f"¥{amount:,.2f}"
    
    def __str__(self) -> str:
        """字符串表示"""
        return f"BankAccount(账户号: {self.account_number}, 持有人: {self.owner_name}, 余额: {self.format_currency(self.balance)})"
    
    def __repr__(self) -> str:
        """开发者表示"""
        return f"BankAccount('{self.owner_name}', {self.balance})"

# 使用银行账户系统
if __name__ == "__main__":
    # 创建账户
    account1 = BankAccount("张三", 1000)
    account2 = BankAccount("李四", 500)
    
    print("=== 账户信息 ===")
    print(account1)
    print(account2)
    print(f"\n{BankAccount.get_bank_info()}")
    
    print("\n=== 银行操作 ===")
    # 存款
    account1.deposit(200)
    
    # 取款
    account1.withdraw(150)
    
    # 转账
    account1.transfer(account2, 300)
    
    # 查询余额
    print(f"\n张三账户余额: {BankAccount.format_currency(account1.get_balance())}")
    print(f"李四账户余额: {BankAccount.format_currency(account2.get_balance())}")
    
    # 计算利息
    interest = account1.calculate_interest(12)
    print(f"张三账户年利息: {BankAccount.format_currency(interest)}")
    
    # 查看交易历史
    print("\n=== 张三的交易历史 ===")
    for transaction in account1.get_transaction_history():
        print(f"{transaction['时间']} - {transaction['类型']}: {BankAccount.format_currency(transaction['金额'])}, 余额: {BankAccount.format_currency(transaction['余额'])}")
```

### 学生成绩管理系统

```python
from typing import Dict, List, Optional
from statistics import mean, median

class Subject:
    """科目类"""
    
    def __init__(self, name: str, credit: int):
        """初始化科目
        
        Args:
            name: 科目名称
            credit: 学分
        """
        self.name = name
        self.credit = credit
    
    def __str__(self):
        return f"{self.name}({self.credit}学分)"

class Grade:
    """成绩类"""
    
    def __init__(self, subject: Subject, score: float, semester: str):
        """初始化成绩
        
        Args:
            subject: 科目对象
            score: 分数
            semester: 学期
        """
        if not 0 <= score <= 100:
            raise ValueError("分数必须在0-100之间")
        
        self.subject = subject
        self.score = score
        self.semester = semester
        self.grade_point = self._calculate_grade_point(score)
        self.letter_grade = self._get_letter_grade(score)
    
    @staticmethod
    def _calculate_grade_point(score: float) -> float:
        """计算绩点（静态方法）"""
        if score >= 90:
            return 4.0
        elif score >= 80:
            return 3.0 + (score - 80) * 0.1
        elif score >= 70:
            return 2.0 + (score - 70) * 0.1
        elif score >= 60:
            return 1.0 + (score - 60) * 0.1
        else:
            return 0.0
    
    @staticmethod
    def _get_letter_grade(score: float) -> str:
        """获取等级成绩（静态方法）"""
        if score >= 90:
            return 'A'
        elif score >= 80:
            return 'B'
        elif score >= 70:
            return 'C'
        elif score >= 60:
            return 'D'
        else:
            return 'F'
    
    def __str__(self):
        return f"{self.subject.name}: {self.score}分 ({self.letter_grade})"

class Student:
    """学生类"""
    
    # 类属性
    school_name = "Python大学"
    student_count = 0
    
    def __init__(self, name: str, student_id: str, major: str):
        """初始化学生
        
        Args:
            name: 学生姓名
            student_id: 学号
            major: 专业
        """
        self.name = name
        self.student_id = student_id
        self.major = major
        self.grades: List[Grade] = []  # 成绩列表
        
        Student.student_count += 1
    
    def add_grade(self, subject: Subject, score: float, semester: str):
        """添加成绩（实例方法）"""
        grade = Grade(subject, score, semester)
        self.grades.append(grade)
        print(f"已添加成绩: {grade}")
    
    def get_grades_by_semester(self, semester: str) -> List[Grade]:
        """按学期获取成绩（实例方法）"""
        return [grade for grade in self.grades if grade.semester == semester]
    
    def get_subject_grade(self, subject_name: str) -> Optional[Grade]:
        """获取指定科目成绩（实例方法）"""
        for grade in self.grades:
            if grade.subject.name == subject_name:
                return grade
        return None
    
    def calculate_gpa(self, semester: Optional[str] = None) -> float:
        """计算GPA（实例方法）"""
        if semester:
            grades = self.get_grades_by_semester(semester)
        else:
            grades = self.grades
        
        if not grades:
            return 0.0
        
        total_points = sum(grade.grade_point * grade.subject.credit for grade in grades)
        total_credits = sum(grade.subject.credit for grade in grades)
        
        return total_points / total_credits if total_credits > 0 else 0.0
    
    def calculate_average_score(self, semester: Optional[str] = None) -> float:
        """计算平均分（实例方法）"""
        if semester:
            grades = self.get_grades_by_semester(semester)
        else:
            grades = self.grades
        
        if not grades:
            return 0.0
        
        return mean([grade.score for grade in grades])
    
    def get_total_credits(self, semester: Optional[str] = None) -> int:
        """获取总学分（实例方法）"""
        if semester:
            grades = self.get_grades_by_semester(semester)
        else:
            grades = self.grades
        
        return sum(grade.subject.credit for grade in grades)
    
    def get_grade_distribution(self) -> Dict[str, int]:
        """获取成绩分布（实例方法）"""
        distribution = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0}
        for grade in self.grades:
            distribution[grade.letter_grade] += 1
        return distribution
    
    def is_honor_student(self, gpa_threshold: float = 3.5) -> bool:
        """判断是否为优秀学生（实例方法）"""
        return self.calculate_gpa() >= gpa_threshold
    
    def get_transcript(self) -> str:
        """获取成绩单（实例方法）"""
        transcript = f"\n=== {self.name} 的成绩单 ===\n"
        transcript += f"学号: {self.student_id}\n"
        transcript += f"专业: {self.major}\n"
        transcript += f"学校: {Student.school_name}\n\n"
        
        # 按学期分组显示成绩
        semesters = set(grade.semester for grade in self.grades)
        for semester in sorted(semesters):
            transcript += f"--- {semester} ---\n"
            semester_grades = self.get_grades_by_semester(semester)
            for grade in semester_grades:
                transcript += f"{grade.subject.name:12} {grade.score:6.1f}分 {grade.letter_grade:2} {grade.subject.credit}学分\n"
            
            semester_gpa = self.calculate_gpa(semester)
            semester_avg = self.calculate_average_score(semester)
            transcript += f"学期GPA: {semester_gpa:.2f}, 平均分: {semester_avg:.1f}\n\n"
        
        # 总体统计
        overall_gpa = self.calculate_gpa()
        overall_avg = self.calculate_average_score()
        total_credits = self.get_total_credits()
        
        transcript += f"--- 总体统计 ---\n"
        transcript += f"总GPA: {overall_gpa:.2f}\n"
        transcript += f"总平均分: {overall_avg:.1f}\n"
        transcript += f"总学分: {total_credits}\n"
        transcript += f"优秀学生: {'是' if self.is_honor_student() else '否'}\n"
        
        return transcript
    
    @classmethod
    def create_from_info(cls, info_dict: Dict):
        """从信息字典创建学生（类方法）"""
        return cls(
            info_dict['name'],
            info_dict['student_id'],
            info_dict['major']
        )
    
    @classmethod
    def get_school_stats(cls) -> str:
        """获取学校统计信息（类方法）"""
        return f"学校: {cls.school_name}, 学生总数: {cls.student_count}"
    
    @staticmethod
    def compare_students(student1: 'Student', student2: 'Student') -> str:
        """比较两个学生的成绩（静态方法）"""
        gpa1 = student1.calculate_gpa()
        gpa2 = student2.calculate_gpa()
        avg1 = student1.calculate_average_score()
        avg2 = student2.calculate_average_score()
        
        result = f"学生比较:\n"
        result += f"{student1.name}: GPA {gpa1:.2f}, 平均分 {avg1:.1f}\n"
        result += f"{student2.name}: GPA {gpa2:.2f}, 平均分 {avg2:.1f}\n"
        
        if gpa1 > gpa2:
            result += f"{student1.name} 的GPA更高"
        elif gpa2 > gpa1:
            result += f"{student2.name} 的GPA更高"
        else:
            result += "两人GPA相同"
        
        return result
    
    def __str__(self):
        return f"Student({self.name}, {self.student_id}, {self.major})"

# 使用学生成绩管理系统
if __name__ == "__main__":
    # 创建科目
    math = Subject("高等数学", 4)
    physics = Subject("大学物理", 3)
    english = Subject("大学英语", 2)
    programming = Subject("程序设计", 3)
    
    # 创建学生
    student1 = Student("张三", "2024001", "计算机科学")
    student2 = Student("李四", "2024002", "软件工程")
    
    # 添加成绩
    student1.add_grade(math, 92, "2024春季")
    student1.add_grade(physics, 88, "2024春季")
    student1.add_grade(english, 85, "2024春季")
    student1.add_grade(programming, 95, "2024秋季")
    
    student2.add_grade(math, 78, "2024春季")
    student2.add_grade(physics, 82, "2024春季")
    student2.add_grade(english, 90, "2024春季")
    student2.add_grade(programming, 88, "2024秋季")
    
    # 显示成绩单
    print(student1.get_transcript())
    print(student2.get_transcript())
    
    # 比较学生
    print(Student.compare_students(student1, student2))
    
    # 学校统计
    print(f"\n{Student.get_school_stats()}")
```

## ⚠️ 注意事项

- **命名规范**: 类名使用大驼峰命名法，方法和属性使用小写加下划线
- **私有属性**: 以单下划线开头的属性表示私有，不应在类外部直接访问
- **文档字符串**: 为类和方法添加清晰的文档字符串
- **参数验证**: 在构造函数中进行必要的参数验证
- **类型提示**: 使用类型提示提高代码可读性和可维护性
- **方法选择**: 根据功能选择合适的方法类型（实例方法、类方法、静态方法）
- **属性访问**: 优先使用方法来访问和修改属性，而不是直接访问

## 🔗 相关内容

- [类的继承](../class-inheritance/) - 学习类的继承机制
- [类的方法](../class-methods/) - 深入了解各种方法类型
- [魔术方法](../magic-methods/) - 学习特殊方法的使用
- [属性管理](../class-attributes/) - 掌握属性的高级管理

## 📚 扩展阅读

- [Python官方文档 - 类](https://docs.python.org/3/tutorial/classes.html)
- [PEP 8 - Python代码风格指南](https://www.python.org/dev/peps/pep-0008/)
- [面向对象编程原则](https://realpython.com/python3-object-oriented-programming/)

## 🏷️ 标签

`类` `面向对象` `构造函数` `实例属性` `类属性` `实例方法` `类方法` `静态方法`

---

**最后更新**: 2024-01-01  
**作者**: Python文档团队  
**版本**: 1.0