# 贡献指南

感谢您对Python知识体系文档项目的关注！我们欢迎所有形式的贡献，包括但不限于内容补充、错误修正、结构优化和功能改进。

## 🤝 如何贡献

### 1. 报告问题

如果您发现了错误或有改进建议，请：

- 在GitHub上创建Issue
- 详细描述问题或建议
- 如果是错误，请提供重现步骤
- 如果是新功能建议，请说明使用场景

### 2. 提交内容

#### 准备工作

1. Fork本仓库到您的GitHub账户
2. 克隆Fork的仓库到本地
3. 创建新的分支进行修改

```bash
git clone https://github.com/your-username/PythonModelBook.git
cd PythonModelBook
git checkout -b feature/your-feature-name
```

#### 内容规范

1. **文档结构**
   - 使用提供的文档模板 (`docs/_template.md`)
   - 保持一致的目录结构
   - 文件名使用小写字母和连字符

2. **内容质量**
   - 内容准确、完整
   - 代码示例可运行
   - 包含适当的注释
   - 提供实际应用场景

3. **格式规范**
   - 使用Markdown格式
   - 遵循中文技术文档写作规范
   - 代码块指定语言类型
   - 表格格式整齐

#### 提交流程

1. 在本地进行修改和测试
2. 提交更改到您的分支
3. 推送到您的GitHub仓库
4. 创建Pull Request

```bash
git add .
git commit -m "feat: 添加XXX功能的文档"
git push origin feature/your-feature-name
```

### 3. 代码贡献

如果您想贡献网站功能代码：

- 遵循Jekyll项目结构
- 确保代码在本地正常运行
- 添加必要的注释
- 测试在GitHub Pages上的兼容性

## 📝 文档写作指南

### 文档模板使用

每个新文档都应基于 `docs/_template.md` 创建，包含以下部分：

1. **Front Matter**: 元数据信息
2. **概述**: 简要介绍
3. **学习目标**: 明确的学习目标
4. **详细内容**: 核心内容
5. **实际应用**: 代码示例
6. **注意事项**: 重要提醒
7. **相关内容**: 交叉引用

### 代码示例规范

```python
# 好的代码示例
def calculate_average(numbers):
    """计算数字列表的平均值
    
    Args:
        numbers (list): 数字列表
        
    Returns:
        float: 平均值
        
    Raises:
        ValueError: 当列表为空时抛出异常
    """
    if not numbers:
        raise ValueError("列表不能为空")
    
    return sum(numbers) / len(numbers)

# 使用示例
numbers = [1, 2, 3, 4, 5]
average = calculate_average(numbers)
print(f"平均值: {average}")  # 输出: 平均值: 3.0
```

### 文档分类

- **basics**: 基础语法
- **builtins**: 内置函数
- **stdlib**: 标准库
- **thirdparty**: 第三方库

### 难度标记

- **初级**: 适合Python初学者
- **中级**: 需要一定Python基础
- **高级**: 需要深入的Python知识

## 🔍 审核标准

### 内容审核

- [ ] 内容准确性
- [ ] 代码可运行性
- [ ] 示例完整性
- [ ] 格式规范性
- [ ] 语言表达清晰

### 技术审核

- [ ] 符合Python最佳实践
- [ ] 代码风格一致
- [ ] 性能考虑合理
- [ ] 安全性检查

## 🏷️ 提交信息规范

使用约定式提交格式：

```
<类型>(<范围>): <描述>

[可选的正文]

[可选的脚注]
```

### 类型

- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 文档更新
- `style`: 格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 示例

```
feat(basics): 添加变量与数据类型文档

- 添加基本数据类型介绍
- 包含类型转换示例
- 添加最佳实践建议

Closes #123
```

## 🎯 贡献重点

我们特别欢迎以下类型的贡献：

1. **内容补充**
   - 缺失的函数或模块文档
   - 实际应用案例
   - 最佳实践总结

2. **质量改进**
   - 错误修正
   - 代码示例优化
   - 表达方式改进

3. **功能增强**
   - 搜索功能改进
   - 导航体验优化
   - 响应式设计改进

4. **国际化**
   - 英文版本翻译
   - 多语言支持

## 📞 联系方式

如果您有任何问题或建议，可以通过以下方式联系我们：

- GitHub Issues: 项目相关问题
- GitHub Discussions: 一般讨论
- Email: [项目邮箱]

## 🙏 致谢

感谢所有为本项目做出贡献的开发者！您的每一份贡献都让这个项目变得更好。

---

再次感谢您的贡献！让我们一起构建更好的Python学习资源。