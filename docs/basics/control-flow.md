---
layout: doc
title: 控制流程
permalink: /docs/basics/control-flow/
category: basics
tags: [控制流程, 条件语句, 循环, if 语句, for 循环, while 循环]
description: Python 控制流程详解，包括条件语句、循环结构和流程控制
author: Python 文档团队
date: 2024-01-01
updated: 2024-01-01
version: 1.0
difficulty: "初级"
---

# 控制流程

## 📝 概述

控制流程是编程中的核心概念，它决定了程序代码的执行顺序。Python 提供了丰富的控制流程语句，包括条件语句（if、elif、else）、循环语句（for、while）以及流程控制语句（break、continue、pass）。掌握这些语句是编写逻辑清晰、功能完整程序的基础。

## 🎯 学习目标

- 掌握条件语句的语法和使用方法
- 学会使用 for 和 while 循环处理重复任务
- 了解 break、continue、pass 等流程控制语句
- 掌握条件表达式和循环推导式的使用
- 能够编写复杂的控制流程逻辑

## 📋 前置知识

- Python 基本语法和缩进规则
- 变量和数据类型
- 运算符和表达式
- 布尔值和逻辑运算

## 🔍 详细内容

### 条件语句

#### if 语句

if 语句是最基本的条件控制语句，用于根据条件执行不同的代码块。

```python
## 基本 if 语句
age = 18
if age >= 18:
    print("你已经成年了")

## 带 else 的 if 语句
score = 85
if score >= 60:
    print("考试通过")
else:
    print("考试不及格")

## 多条件判断
temperature = 25
if temperature > 30:
    print("天气很热")
elif temperature > 20:
    print("天气温暖")
elif temperature > 10:
    print("天气凉爽")
else:
    print("天气寒冷")
```

#### 嵌套 if 语句

```python
## 嵌套条件判断
username = "admin"
password = "123456"
is_active = True

if username == "admin":
    if password == "123456":
        if is_active:
            print("登录成功")
        else:
            print("账户已被禁用")
    else:
        print("密码错误")
else:
    print("用户名错误")

## 使用逻辑运算符简化嵌套
if username == "admin" and password == "123456" and is_active:
    print("登录成功")
else:
    print("登录失败")
```

#### 条件表达式（三元运算符）

```python
## 条件表达式的基本语法:值 1 if 条件 else 值 2
age = 20
status = "成年人" if age >= 18 else "未成年人"
print(f"你是{status}")

## 在函数调用中使用
def get_grade(score):
    return "及格" if score >= 60 else "不及格"

print(get_grade(75))  # 输出:及格
print(get_grade(45))  # 输出:不及格

## 嵌套条件表达式
score = 85
grade = "优秀" if score >= 90 else "良好" if score >= 80 else "及格" if score >= 60 else "不及格"
print(f"成绩等级:{grade}")
```

### 循环结构

#### for 循环

for 循环用于遍历序列（如列表、元组、字符串）或其他可迭代对象。

```python
## 遍历列表
fruits = ["苹果", "香蕉", "橙子", "葡萄"]
for fruit in fruits:
    print(f"我喜欢吃{fruit}")

## 遍历字符串
for char in "Python":
    print(char)

## 使用 range()函数
print("使用 range(5):")
for i in range(5):
    print(f"第{i+1}次循环")

print("\n 使用 range(1, 6):")
for i in range(1, 6):
    print(f"数字:{i}")

print("\n 使用 range(0, 10, 2):")
for i in range(0, 10, 2):
    print(f"偶数:{i}")

## 遍历字典
student = {"姓名": "张三", "年龄": 20, "专业": "计算机科学"}

print("遍历字典的键:")
for key in student:
    print(key)

print("\n 遍历字典的值:")
for value in student.values():
    print(value)

print("\n 遍历字典的键值对:")
for key, value in student.items():
    print(f"{key}: {value}")
```

#### enumerate()函数

```python
## 获取索引和值
colors = ["红色", "绿色", "蓝色", "黄色"]

for index, color in enumerate(colors):
    print(f"索引{index}: {color}")

## 指定起始索引
for index, color in enumerate(colors, start=1):
    print(f"第{index}种颜色: {color}")
```

#### zip()函数

```python
## 同时遍历多个序列
names = ["张三", "李四", "王五"]
ages = [20, 25, 30]
cities = ["北京", "上海", "广州"]

for name, age, city in zip(names, ages, cities):
    print(f"{name},{age}岁,来自{city}")

## 处理长度不同的序列
list1 = [1, 2, 3, 4, 5]
list2 = ['a', 'b', 'c']

for num, letter in zip(list1, list2):
    print(f"{num} - {letter}")
```

#### while 循环

while 循环在条件为真时重复执行代码块。

```python
## 基本 while 循环
count = 0
while count < 5:
    print(f"计数:{count}")
    count += 1

## 用户输入验证
password = ""
while password != "123456":
    password = input("请输入密码:")
    if password != "123456":
        print("密码错误,请重新输入")
print("密码正确！")

## 无限循环(需要 break 退出)
while True:
    user_input = input("输入'quit'退出:")
    if user_input.lower() == 'quit':
        break
    print(f"你输入了:{user_input}")

## 计算阶乘
n = 5
factorial = 1
i = 1
while i <= n:
    factorial *= i
    i += 1
print(f"{n}的阶乘是:{factorial}")
```

### 循环控制语句

#### break 语句

break 用于立即退出循环。

```python
## 在 for 循环中使用 break
for i in range(10):
    if i == 5:
        print("遇到 5,退出循环")
        break
    print(i)

## 在 while 循环中使用 break
count = 0
while True:
    if count >= 3:
        print("达到限制,退出循环")
        break
    print(f"计数:{count}")
    count += 1

## 在嵌套循环中使用 break
for i in range(3):
    print(f"外层循环:{i}")
    for j in range(5):
        if j == 2:
            print("  内层循环遇到 2,退出内层循环")
            break
        print(f"  内层循环:{j}")
```

#### continue 语句

continue 用于跳过当前循环的剩余部分，直接进入下一次循环。

```python
## 跳过偶数
for i in range(10):
    if i % 2 == 0:
        continue
    print(f"奇数:{i}")

## 处理列表中的特殊值
numbers = [1, 2, -1, 4, -2, 6, 0, 8]
for num in numbers:
    if num <= 0:
        print(f"跳过非正数:{num}")
        continue
    print(f"处理正数:{num}")
    result = 100 / num
    print(f"100 / {num} = {result}")
```

#### pass 语句

pass 是一个空操作语句，用作占位符。

```python
## 作为占位符
def future_function():
    pass  # 暂时不实现,避免语法错误

## 在条件语句中使用
age = 20
if age < 18:
    pass  # 暂时不处理未成年情况
else:
    print("可以投票")

## 在循环中使用
for i in range(5):
    if i == 2:
        pass  # 什么都不做,继续循环
    else:
        print(i)

## 在异常处理中使用
try:
    result = 10 / 0
except ZeroDivisionError:
    pass  # 忽略除零错误
```

### else 子句

Python 的循环语句可以有 else 子句，当循环正常结束时执行。

```python
## for 循环的 else 子句
for i in range(5):
    print(i)
else:
    print("循环正常结束")

## 带 break 的 for 循环
for i in range(5):
    if i == 3:
        print("遇到 3,退出循环")
        break
    print(i)
else:
    print("这行不会执行,因为循环被 break 中断")

## while 循环的 else 子句
count = 0
while count < 3:
    print(f"计数:{count}")
    count += 1
else:
    print("while 循环正常结束")

## 实际应用:查找元素
numbers = [1, 3, 5, 7, 9]
target = 6

for num in numbers:
    if num == target:
        print(f"找到了{target}")
        break
else:
    print(f"没有找到{target}")
```

## 💡 实际应用

### 基础用法

```python
def grade_calculator():
    """成绩计算器"""
    while True:
        try:
            score = float(input("请输入成绩(0-100),输入-1 退出:"))
            
            if score == -1:
                print("程序结束")
                break
            
            if score < 0 or score > 100:
                print("成绩必须在 0-100 之间")
                continue
            
#            # 计算等级
            if score >= 90:
                grade = "A"
                comment = "优秀"
            elif score >= 80:
                grade = "B"
                comment = "良好"
            elif score >= 70:
                grade = "C"
                comment = "中等"
            elif score >= 60:
                grade = "D"
                comment = "及格"
            else:
                grade = "F"
                comment = "不及格"
            
            print(f"成绩:{score},等级:{grade},评价:{comment}")
            
        except ValueError:
            print("请输入有效的数字")

## 使用示例
## grade_calculator()
```

### 高级用法

```python
def number_guessing_game():
    """数字猜测游戏"""
    import random
    
    print("欢迎来到数字猜测游戏！")
    
    while True:
#        # 生成随机数
        secret_number = random.randint(1, 100)
        attempts = 0
        max_attempts = 7
        
        print(f"\n 我想了一个 1 到 100 之间的数字,你有{max_attempts}次机会猜中它！")
        
        while attempts < max_attempts:
            try:
                guess = int(input(f"第{attempts + 1}次猜测,请输入你的猜测:"))
                attempts += 1
                
                if guess < 1 or guess > 100:
                    print("请输入 1 到 100 之间的数字")
                    continue
                
                if guess == secret_number:
                    print(f"🎉 恭喜你！猜对了！数字就是{secret_number}")
                    print(f"你用了{attempts}次就猜中了！")
                    break
                elif guess < secret_number:
                    print("太小了！")
                else:
                    print("太大了！")
                
#                # 给出提示
                remaining = max_attempts - attempts
                if remaining > 0:
                    print(f"还有{remaining}次机会")
                
            except ValueError:
                print("请输入有效的数字")
        else:
            print(f"😢 很遗憾,你没有猜中！正确答案是{secret_number}")
        
#        # 询问是否继续
        while True:
            play_again = input("\n 是否再玩一次？(y/n): ").lower()
            if play_again in ['y', 'yes', '是']:
                break
            elif play_again in ['n', 'no', '否']:
                print("谢谢游戏！再见！")
                return
            else:
                print("请输入 y 或 n")

## 使用示例
## number_guessing_game()
```

### 实际案例

```python
class TaskManager:
    """任务管理器"""
    
    def __init__(self):
        self.tasks = []
        self.completed_tasks = []
    
    def add_task(self, task):
        """添加任务"""
        self.tasks.append({
            'id': len(self.tasks) + len(self.completed_tasks) + 1,
            'description': task,
            'completed': False
        })
        print(f"任务 '{task}' 已添加")
    
    def list_tasks(self):
        """列出所有任务"""
        if not self.tasks and not self.completed_tasks:
            print("没有任务")
            return
        
        print("\n=== 待完成任务 ===")
        if self.tasks:
            for task in self.tasks:
                print(f"{task['id']}. {task['description']}")
        else:
            print("无待完成任务")
        
        print("\n=== 已完成任务 ===")
        if self.completed_tasks:
            for task in self.completed_tasks:
                print(f"✓ {task['id']}. {task['description']}")
        else:
            print("无已完成任务")
    
    def complete_task(self, task_id):
        """完成任务"""
        for i, task in enumerate(self.tasks):
            if task['id'] == task_id:
                completed_task = self.tasks.pop(i)
                completed_task['completed'] = True
                self.completed_tasks.append(completed_task)
                print(f"任务 '{completed_task['description']}' 已完成")
                return
        print(f"未找到 ID 为{task_id}的任务")
    
    def delete_task(self, task_id):
        """删除任务"""
#        # 在待完成任务中查找
        for i, task in enumerate(self.tasks):
            if task['id'] == task_id:
                deleted_task = self.tasks.pop(i)
                print(f"任务 '{deleted_task['description']}' 已删除")
                return
        
#        # 在已完成任务中查找
        for i, task in enumerate(self.completed_tasks):
            if task['id'] == task_id:
                deleted_task = self.completed_tasks.pop(i)
                print(f"任务 '{deleted_task['description']}' 已删除")
                return
        
        print(f"未找到 ID 为{task_id}的任务")
    
    def run(self):
        """运行任务管理器"""
        print("欢迎使用任务管理器！")
        
        while True:
            print("\n=== 任务管理器 ===")
            print("1. 添加任务")
            print("2. 查看任务")
            print("3. 完成任务")
            print("4. 删除任务")
            print("5. 退出")
            
            choice = input("请选择操作(1-5):")
            
            if choice == '1':
                task = input("请输入任务描述:")
                if task.strip():
                    self.add_task(task.strip())
                else:
                    print("任务描述不能为空")
            
            elif choice == '2':
                self.list_tasks()
            
            elif choice == '3':
                self.list_tasks()
                if self.tasks:
                    try:
                        task_id = int(input("请输入要完成的任务 ID:"))
                        self.complete_task(task_id)
                    except ValueError:
                        print("请输入有效的任务 ID")
                else:
                    print("没有待完成的任务")
            
            elif choice == '4':
                self.list_tasks()
                if self.tasks or self.completed_tasks:
                    try:
                        task_id = int(input("请输入要删除的任务 ID:"))
                        self.delete_task(task_id)
                    except ValueError:
                        print("请输入有效的任务 ID")
                else:
                    print("没有任务可删除")
            
            elif choice == '5':
                print("谢谢使用！再见！")
                break
            
            else:
                print("无效选择,请输入 1-5")

## 使用示例
## task_manager = TaskManager()
## task_manager.run()
```

### 循环推导式

```python
## 列表推导式
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

## 基本列表推导式
squares = [x**2 for x in numbers]
print(f"平方数:{squares}")

## 带条件的列表推导式
even_squares = [x**2 for x in numbers if x % 2 == 0]
print(f"偶数的平方:{even_squares}")

## 复杂条件
filtered_numbers = [x for x in numbers if x > 3 and x < 8]
print(f"3 到 8 之间的数:{filtered_numbers}")

## 字符串处理
words = ["hello", "world", "python", "programming"]
uppercase_words = [word.upper() for word in words if len(word) > 5]
print(f"长度大于 5 的大写单词:{uppercase_words}")

## 嵌套循环推导式
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
print(f"展平的矩阵:{flattened}")

## 字典推导式
square_dict = {x: x**2 for x in range(1, 6)}
print(f"平方字典:{square_dict}")

## 集合推导式
unique_lengths = {len(word) for word in words}
print(f"单词长度集合:{unique_lengths}")

## 生成器表达式
square_generator = (x**2 for x in range(1, 6))
print(f"生成器对象:{square_generator}")
print(f"生成器内容:{list(square_generator)}")
```

## ⚠️ 注意事项

- **缩进**: Python 使用缩进来表示代码块，确保缩进一致
- **无限循环**: 使用 while True 时要确保有退出条件
- **循环变量**: 避免在循环内修改循环变量可能导致的问题
- **性能**: 大量数据时考虑使用生成器而不是列表推导式
- **可读性**: 复杂的嵌套条件可以考虑拆分为多个函数
- **异常处理**: 在循环中处理用户输入时要考虑异常情况

## 🔗 相关内容

- [变量和数据类型](../variables/) - 了解基本数据类型
- [运算符](../operators/) - 掌握各种运算符
- [函数](../functions/) - 学习函数定义和调用
- [异常处理](../exceptions/) - 处理程序错误

## 📚 扩展阅读

- [Python 官方文档 - 控制流程](https://docs.python.org/3/tutorial/controlflow.html)
- [PEP 289 - 生成器表达式](https://www.python.org/dev/peps/pep-0289/)
- [Python 编程最佳实践](https://docs.python-guide.org/)

## 🏷️ 标签

`控制流程` `条件语句` `循环` `if 语句` `for 循环` `while 循环` `break` `continue` `pass`

---

**最后更新**: 2024-01-01  
**作者**: Python 文档团队  
**版本**: 1.0