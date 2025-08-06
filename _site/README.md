# Python知识体系文档

一个系统化整理Python知识体系的开源项目，旨在为Python学习者提供完整、清晰、易于导航的技术文档。

## 🌐 项目地址

- **GitHub仓库**: [https://github.com/liberalchang/PythonModelBook.git](https://github.com/liberalchang/PythonModelBook.git)
- **在线文档**: [https://liberalchang.github.io/PythonModelBook](https://liberalchang.github.io/PythonModelBook)
- **项目主页**: [https://liberalchang.github.io/PythonModelBook](https://liberalchang.github.io/PythonModelBook)

## 📁 项目结构

```
PythonModelBook/
├── _config.yml              # Jekyll配置文件
├── _layouts/                 # 页面布局模板
│   └── doc.html             # 文档页面布局
├── docs/                     # 文档内容目录
│   ├── _template.md         # 文档模板
│   ├── index.md             # 文档总索引
│   ├── basics/              # 基础语法模块
│   │   ├── index.md         # 模块索引
│   │   ├── variables.md     # 变量与数据类型
│   │   ├── control-flow.md  # 控制流程
│   │   ├── functions.md     # 函数定义
│   │   ├── classes.md       # 类与对象
│   │   └── exceptions.md    # 异常处理
│   ├── builtins/            # 内置函数模块
│   │   ├── index.md         # 模块索引
│   │   ├── string-functions.md    # 字符串函数
│   │   ├── math-functions.md      # 数学函数
│   │   ├── collection-functions.md # 集合函数
│   │   └── io-functions.md        # 输入输出函数
│   ├── stdlib/              # 标准库模块
│   │   ├── index.md         # 模块索引
│   │   ├── file-operations.md     # 文件操作
│   │   ├── datetime.md            # 日期时间
│   │   ├── regex.md               # 正则表达式
│   │   ├── networking.md          # 网络编程
│   │   └── database.md            # 数据库操作
│   └── thirdparty/          # 第三方库模块
│       ├── index.md         # 模块索引
│       ├── data-analysis.md       # 数据分析
│       ├── web-development.md     # Web开发
│       ├── machine-learning.md    # 机器学习
│       └── image-processing.md    # 图像处理
├── index.md                 # 网站首页
├── Gemfile                  # Ruby依赖管理
├── CONTRIBUTING.md          # 贡献指南
├── LICENSE                  # 开源协议
└── README.md               # 项目说明
```

## 📚 文档目录

### 🔤 [基础语法](docs/basics/)
Python语言的核心语法和基本概念
- [变量与数据类型](docs/basics/variables.md) - 变量定义、基本数据类型、类型转换
- [控制流程](docs/basics/control-flow.md) - 条件语句、循环结构、流程控制
- [函数定义](docs/basics/functions.md) - 函数定义、参数传递、作用域、闭包
- [类与对象](docs/basics/classes.md) - 面向对象编程、继承、多态
- [异常处理](docs/basics/exceptions.md) - 异常捕获、处理机制、自定义异常

### ⚙️ [内置函数](docs/builtins/)
Python解释器内置的函数和方法
- [字符串函数](docs/builtins/string-functions.md) - 字符串操作、格式化、编码
- [数学函数](docs/builtins/math-functions.md) - 数值计算、类型转换、比较
- [集合函数](docs/builtins/collection-functions.md) - 列表、字典、集合操作
- [输入输出函数](docs/builtins/io-functions.md) - 标准输入输出、文件操作

### 📦 [标准库](docs/stdlib/)
Python标准库中的重要模块
- [文件操作](docs/stdlib/file-operations.md) - os、pathlib、shutil模块
- [日期时间](docs/stdlib/datetime.md) - datetime、time、calendar模块
- [正则表达式](docs/stdlib/regex.md) - re模块、模式匹配
- [网络编程](docs/stdlib/networking.md) - urllib、http、socket模块
- [数据库操作](docs/stdlib/database.md) - sqlite3模块、数据库设计

### 🚀 [第三方库](docs/thirdparty/)
流行的第三方库和框架
- [数据分析](docs/thirdparty/data-analysis.md) - NumPy、Pandas、Matplotlib
- [Web开发](docs/thirdparty/web-development.md) - Django、Flask、FastAPI
- [机器学习](docs/thirdparty/machine-learning.md) - Scikit-learn、TensorFlow、PyTorch
- [图像处理](docs/thirdparty/image-processing.md) - Pillow、OpenCV

## 🎯 项目特色

### ✨ 功能特点
- **系统化结构**: 按照学习路径组织内容，循序渐进
- **搜索功能**: 支持全文搜索，快速定位相关内容
- **响应式设计**: 适配桌面和移动设备
- **目录导航**: 页面右侧显示文档结构，支持快速跳转
- **评论系统**: 集成Disqus评论，支持交流讨论
- **标签分类**: 多维度标签系统，便于内容分类

### 📖 文档规范
- **统一模板**: 所有文档遵循统一的结构模板
- **代码示例**: 每个概念都包含可运行的代码示例
- **实际应用**: 提供真实场景的应用案例
- **最佳实践**: 包含编程最佳实践和注意事项
- **交叉引用**: 相关内容之间建立链接关系

## 🚀 快速开始

### 本地运行

1. **克隆仓库**
```bash
git clone https://github.com/username/PythonModelBook.git
cd PythonModelBook
```

2. **安装依赖**
```bash
# 安装Ruby和Bundler
gem install bundler

# 安装项目依赖
bundle install
```

3. **启动服务**
```bash
bundle exec jekyll serve
#指定端口
bundle exec jekyll serve --host 0.0.0.0 --port 4000 
```

4. **访问网站**
打开浏览器访问 `http://localhost:4000`

### GitHub Pages部署

1. Fork本仓库到您的GitHub账户
2. 在仓库设置中启用GitHub Pages
3. 选择源分支（通常是main或gh-pages）
4. 访问 `https://your-username.github.io/PythonModelBook`

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看 [贡献指南](CONTRIBUTING.md) 了解详细信息。

### 贡献方式
- 📝 **内容贡献**: 添加新文档、完善现有内容
- 🐛 **错误修正**: 修复文档错误、代码问题
- 💡 **功能改进**: 优化网站功能、用户体验
- 🌍 **国际化**: 翻译文档、多语言支持

### 贡献者

感谢所有为本项目做出贡献的开发者！

<!-- 贡献者列表将自动生成 -->

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## 📞 联系我们

- **GitHub Issues**: [项目问题反馈](https://github.com/username/PythonModelBook/issues)
- **GitHub Discussions**: [项目讨论](https://github.com/username/PythonModelBook/discussions)
- **Email**: project@example.com

## 🔗 相关链接

- [Python官方文档](https://docs.python.org/3/)
- [Python教程](https://docs.python.org/3/tutorial/)
- [PEP索引](https://www.python.org/dev/peps/)
- [Python包索引](https://pypi.org/)

---

⭐ 如果这个项目对您有帮助，请给我们一个Star！