---
layout: doc
title: DuckDuckGo Search - Python搜索API库完全指南
permalink: /docs/thirdparty/duckduckgo-search/
category: thirdparty
tags: [DuckDuckGo, 搜索API, 网络搜索, 图片搜索, 视频搜索, 新闻搜索, 地图搜索, 翻译API, 第三方库]
description: DuckDuckGo Search是一个强大的Python搜索库，提供网络搜索、图片搜索、视频搜索、新闻搜索等多种搜索功能，支持同步和异步操作
author: Python技术文档工程师
date: 2024-01-16
updated: 2024-01-16
version: 1.0
difficulty: "中级"
---

# DuckDuckGo Search - Python搜索API库完全指南

## 📝 概述

DuckDuckGo Search 是一个功能强大的 Python 库，它提供了对 DuckDuckGo 搜索引擎的编程接口访问。该库支持多种搜索类型，包括网页搜索、图片搜索、视频搜索、新闻搜索、地图搜索等，同时提供了翻译和搜索建议功能。

DuckDuckGo Search 的主要特点：
- **多种搜索类型**：支持文本、图片、视频、新闻、地图搜索
- **同步异步支持**：提供同步和异步API接口
- **代理支持**：支持HTTP代理和Tor网络
- **CLI工具**：内置命令行工具，方便直接使用
- **搜索操作符**：支持丰富的搜索操作符和筛选条件

**GitHub地址**：https://github.com/deedy5/duckduckgo_search

## 🎯 学习目标

- 掌握 DuckDuckGo Search 的安装和基本配置
- 学会使用 CLI 命令行工具进行各种搜索
- 掌握同步和异步API的使用方法
- 学会使用搜索操作符优化搜索结果
- 了解代理配置和异常处理机制
- 掌握在实际项目中集成搜索功能的最佳实践

## 📋 前置知识

- 熟悉 Python 基础语法与包管理（conda base 环境）
- 了解 requests/aiohttp 的基本用法（同步/异步请求）
- 基本的命令行操作经验（Windows PowerShell）
- 了解代理与网络超时的基本概念（可选）
- HTTP 请求和响应机制基础
- JSON 数据格式处理
- 异步编程概念（async/await）
- 命令行工具使用经验

## 🔍 详细内容

### 安装和配置

使用 pip 安装 DuckDuckGo Search：

```python
# 基础安装
pip install -U duckduckgo_search

# 从源码安装最新版本
pip install -U git+https://github.com/deedy5/duckduckgo_search.git
```

> 提示：若需在 text() 使用 backend="html" 或 backend="lite"，可安装 lxml 可选依赖（约 12MB）：
> pip install -U "duckduckgo_search[lxml]"

### CLI 命令行工具

DuckDuckGo Search 提供了强大的命令行工具：

```bash
# 基本搜索命令
ddgs --help

# 文本搜索
ddgs text -k "python programming"

# 图片搜索
ddgs images -k "sunset"

# 视频搜索
ddgs videos -k "programming tutorial"

# 新闻搜索
ddgs news -k "technology"

# 地图搜索
ddgs maps -k "restaurant"

# 翻译功能
ddgs translate -k "hello world" --to="zh"

# 搜索建议
ddgs suggestions -k "programming"
```

### 搜索操作符

支持丰富的搜索操作符来优化搜索结果：

| 操作符 | 功能 | 示例 |
|--------|------|------|
| `""` | 精确匹配 | `"python programming"` |
| `site:` | 特定网站搜索 | `site:github.com python` |
| `filetype:` | 特定文件类型 | `filetype:pdf python tutorial` |
| `-` | 排除关键词 | `python -java` |
| `+` | 提高关键词权重 | `cats +dogs` |
| `OR` | 或关系 | `python OR java` |
| `*` | 通配符 | `python * tutorial` |
| `..` | 数字范围 | `price 100..500` |
| `intitle:` | 标题包含关键词 | `intitle:dogs` |
| `inurl:` | URL 包含关键词 | `inurl:cats` |

### 地区和语言设置

完整地区代码列表（与 DuckDuckGo 一致）：

```
xa-ar 阿拉伯
xa-en 阿拉伯（英语）
ar-es 阿根廷
au-en 澳大利亚
at-de 奥地利
be-fr 比利时（法语）
be-nl 比利时（荷兰语）
br-pt 巴西
bg-bg 保加利亚
ca-en 加拿大
ca-fr 加拿大（法语）
ct-ca 加泰罗尼亚
cl-es 智利
cn-zh 中国
co-es 哥伦比亚
hr-hr 克罗地亚
cz-cs 捷克共和国
dk-da 丹麦
ee-et 爱沙尼亚
fi-fi 芬兰
fr-fr 法国
de-de 德国
gr-el 希腊
hk-tzh 香港
hu-hu 匈牙利
in-en 印度
id-id 印度尼西亚
id-en 印度尼西亚（英语）
ie-en 爱尔兰
il-he 以色列
it-it 意大利
jp-jp 日本
kr-kr 韩国
lv-lv 拉脱维亚
lt-lt 立陶宛
xl-es 拉丁美洲
my-ms 马来西亚
my-en 马来西亚（英语）
mx-es 墨西哥
nl-nl 荷兰
nz-en 新西兰
no-no 挪威
pe-es 秘鲁
ph-en 菲律宾
ph-tl 菲律宾（他加禄语）
pl-pl 波兰
pt-pt 葡萄牙
ro-ro 罗马尼亚
ru-ru 俄罗斯
sg-en 新加坡
sk-sk 斯洛伐克共和国
sl-sl 斯洛文尼亚
za-en 南非
es-es 西班牙
se-sv 瑞典
ch-de 瑞士（德语）
ch-fr 瑞士（法语）
ch-it 瑞士（意大利语）
tw-tzh 台湾
th-th 泰国
tr-tr 土耳其
ua-uk 乌克兰
uk-en 英国
us-en 美国
ue-es 美国（西班牙语）
ve-es 委内瑞拉
vn-vi 越南
wt-wt 无地区（默认）
```

## 💡 实际应用

### 基础用法 - DDGS 类初始化

```python
from duckduckgo_search import DDGS

# 基本初始化
ddgs = DDGS()

# 配置请求头和代理
ddgs = DDGS(
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    proxy="http://proxy.example.com:8080",  # HTTP代理
    timeout=30  # 超时设置（秒）
)

# 使用Tor代理（"tb" 是 socks5://127.0.0.1:9150 的别名）
ddgs = DDGS(proxy="tb")
```

### AI 聊天 chat()

```python
from duckduckgo_search import DDGS, AsyncDDGS

# 同步聊天
reply = DDGS().chat("总结丹尼尔·笛福的《鲁滨逊漂流记》", model="gpt-4o-mini")
print(reply)

# 异步聊天
import asyncio
async def run_chat():
    result = await AsyncDDGS().achat("列出 Python 的三个特性", model="claude-3-haiku")
    print(result)
asyncio.run(run_chat())
```

### 文本搜索功能

```python
from duckduckgo_search import DDGS

def text_search_example():
    """文本搜索示例"""
    with DDGS() as ddgs:
        # 基础文本搜索
        results = ddgs.text(
            keywords="python programming",  # 搜索关键词
            region="wt-wt",                # 地区设置
            safesearch="moderate",         # 安全搜索：on/moderate/off
            timelimit="m",                 # 时间限制：d/w/m/y
            max_results=10                 # 最大结果数
        )
        
        for result in results:
            print(f"标题: {result['title']}")
            print(f"链接: {result['href']}")
            print(f"摘要: {result['body']}")
            print("-" * 50)

# 执行搜索
text_search_example()
```

### 即时答案 answers()

```python
from duckduckgo_search import DDGS, AsyncDDGS

# 同步
answers = DDGS().answers("太阳")
print(answers[:1])

# 异步
import asyncio
async def run_answers():
    res = await AsyncDDGS().aanswers("太阳")
    print(res[:1])
asyncio.run(run_answers())
```

### 图片搜索功能

```python
def image_search_example():
    """图片搜索示例"""
    with DDGS() as ddgs:
        images = ddgs.images(
            keywords="sunset landscape",   # 搜索关键词
            region="wt-wt",               # 地区设置
            safesearch="off",             # 安全搜索
            size="Medium",                # 图片尺寸：Small/Medium/Large/Wallpaper
            color="color",                # 颜色：color/Monochrome/Red/Orange等
            type_image="photo",           # 类型：photo/clipart/gif/transparent等
            layout="Square",              # 布局：Square/Tall/Wide
            license_image="Any",          # 许可证类型
            max_results=20
        )
        
        for idx, image in enumerate(images, 1):
            print(f"{idx}. 标题: {image['title']}")
            print(f"   图片链接: {image['image']}")
            print(f"   来源: {image['source']}")
            print(f"   尺寸: {image['width']}x{image['height']}")
```

### 视频搜索功能

```python
def video_search_example():
    """视频搜索示例"""
    with DDGS() as ddgs:
        videos = ddgs.videos(
            keywords="python tutorial",   # 搜索关键词
            region="wt-wt",               # 地区设置
            safesearch="moderate",        # 安全搜索
            timelimit="m",                # 时间限制
            resolution="high",            # 分辨率：high/standard
            duration="medium",            # 时长：short/medium/long
            license_videos="youtube",     # 许可证：creativeCommon/youtube
            max_results=15
        )
        
        for video in videos:
            print(f"标题: {video['title']}")
            print(f"时长: {video['duration']}")
            print(f"发布者: {video['uploader']}")
            print(f"链接: {video['content']}")
```

### 新闻搜索功能

```python
def news_search_example():
    """新闻搜索示例"""
    with DDGS() as ddgs:
        news_results = ddgs.news(
            keywords="artificial intelligence",  # 搜索关键词
            region="wt-wt",                     # 地区设置
            safesearch="moderate",              # 安全搜索
            timelimit="d",                      # 时间限制：最近一天
            max_results=10
        )
        
        for news in news_results:
            print(f"标题: {news['title']}")
            print(f"来源: {news['source']}")
            print(f"发布时间: {news['date']}")
            print(f"摘要: {news['body']}")
            print(f"链接: {news['url']}")
            print("-" * 60)
```

### 地图搜索功能

```python
def maps_search_example():
    """地图搜索示例"""
    with DDGS() as ddgs:
        # 根据地点搜索
        places = ddgs.maps(
            keywords="restaurant",        # 搜索关键词
            place="New York",            # 指定地点
            max_results=20
        )
        
        # 根据具体地址搜索
        specific_places = ddgs.maps(
            keywords="coffee shop",
            street="5th Avenue",         # 街道
            city="New York",            # 城市
            state="NY",                 # 州
            country="USA",              # 国家
            radius=5,                   # 搜索半径（公里）
            max_results=10
        )
        
        for place in places:
            print(f"名称: {place['title']}")
            print(f"地址: {place['address']}")
            print(f"电话: {place['phone']}")
            print(f"坐标: ({place['latitude']}, {place['longitude']})")
            if place['hours']:
                print(f"营业状态: {'营业中' if place['hours']['is_open'] else '已关闭'}")
```

### 翻译功能

```python
def translation_example():
    """翻译功能示例"""
    with DDGS() as ddgs:
        # 单个文本翻译
        result = ddgs.translate(
            keywords="Hello, how are you?",  # 要翻译的文本
            from_=None,                     # 源语言（自动检测）
            to="zh"                         # 目标语言
        )
        
        print(f"原文: {result[0]['original']}")
        print(f"译文: {result[0]['translated']}")
        print(f"检测到的语言: {result[0]['detected_language']}")
        
        # 批量翻译
        texts = ["Good morning", "Thank you", "Goodbye"]
        batch_results = ddgs.translate(keywords=texts, to="zh")
        
        for translation in batch_results:
            print(f"{translation['original']} -> {translation['translated']}")
```

### 搜索建议功能

```python
def suggestions_example():
    """搜索建议示例"""
    with DDGS() as ddgs:
        suggestions = ddgs.suggestions(
            keywords="python prog",      # 部分关键词
            region="us-en"              # 地区设置
        )
        
        print("搜索建议:")
        for suggestion in suggestions:
            print(f"- {suggestion['phrase']}")
```

### 异步操作

```python
import asyncio
from duckduckgo_search import AsyncDDGS

async def async_search_example():
    """异步搜索示例"""
    async with AsyncDDGS() as addgs:
        # 异步文本搜索
        text_results = await addgs.atext(
            keywords="machine learning",
            max_results=5
        )
        
        # 异步图片搜索
        image_results = await addgs.aimages(
            keywords="nature",
            max_results=5
        )
        
        # 异步新闻搜索
        news_results = await addgs.anews(
            keywords="technology",
            max_results=5
        )
        
        print(f"找到 {len(text_results)} 个文本结果")
        print(f"找到 {len(image_results)} 个图片结果")
        print(f"找到 {len(news_results)} 个新闻结果")

# 运行异步搜索
asyncio.run(async_search_example())
```

### 异常处理

```python
from duckduckgo_search import DDGS, RatelimitException, TimeoutException

def error_handling_example():
    """异常处理示例"""
    try:
        with DDGS() as ddgs:
            results = ddgs.text("python", max_results=100)
            
    except RatelimitException as e:
        print(f"搜索频率限制: {e}")
        # 等待一段时间后重试
        import time
        time.sleep(60)
        
    except TimeoutException as e:
        print(f"请求超时: {e}")
        # 增加超时时间或重试
        
    except Exception as e:
        print(f"其他错误: {e}")
```

### 高级用法 - 自定义搜索类

```python
class AdvancedSearcher:
    """高级搜索封装类"""
    
    def __init__(self, proxy=None, timeout=30):
        """初始化搜索器
        
        Args:
            proxy: 代理设置
            timeout: 超时时间
        """
        self.ddgs = DDGS(proxy=proxy, timeout=timeout)
    
    def comprehensive_search(self, query, max_results=20):
        """综合搜索：同时搜索文本、图片、新闻
        
        Args:
            query: 搜索关键词
            max_results: 每种类型的最大结果数
            
        Returns:
            dict: 包含各种搜索结果的字典
        """
        results = {}
        
        try:
            # 文本搜索
            results['text'] = list(self.ddgs.text(
                keywords=query, 
                max_results=max_results
            ))
            
            # 图片搜索
            results['images'] = list(self.ddgs.images(
                keywords=query, 
                max_results=max_results
            ))
            
            # 新闻搜索
            results['news'] = list(self.ddgs.news(
                keywords=query, 
                max_results=max_results
            ))
            
        except Exception as e:
            print(f"搜索出错: {e}")
            
        return results
    
    def filtered_search(self, query, site=None, filetype=None, exclude=None):
        """筛选搜索：使用搜索操作符
        
        Args:
            query: 基础查询词
            site: 限制在特定网站
            filetype: 限制文件类型
            exclude: 排除词汇
            
        Returns:
            list: 搜索结果列表
        """
        # 构建搜索查询
        search_query = query
        
        if site:
            search_query += f" site:{site}"
        if filetype:
            search_query += f" filetype:{filetype}"
        if exclude:
            search_query += f" -{exclude}"
            
        return list(self.ddgs.text(keywords=search_query, max_results=20))

# 使用示例
searcher = AdvancedSearcher()

# 综合搜索
all_results = searcher.comprehensive_search("Python教程")
print(f"找到文本结果: {len(all_results['text'])}")
print(f"找到图片结果: {len(all_results['images'])}")
print(f"找到新闻结果: {len(all_results['news'])}")

# 筛选搜索
github_results = searcher.filtered_search(
    query="Python项目", 
    site="github.com", 
    exclude="Java"
)
```

## ⚠️ 注意事项

1. **使用限制**: DuckDuckGo 有搜索频率限制，避免过于频繁的请求
2. **代理配置**: 在某些网络环境下可能需要配置代理
3. **异常处理**: 务必处理网络异常和搜索限制异常
4. **结果数量**: 不设置 `max_results` 时只返回第一页结果
5. **合规使用**: 遵守 DuckDuckGo 服务条款，不要用于违法用途

## 🔗 相关链接

### 官方资源
- [DuckDuckGo 官网](https://duckduckgo.com/)
- [GitHub 项目地址](https://github.com/deedy5/duckduckgo_search)
- [DuckDuckGo 搜索参数文档](https://duckduckgo.com/params)

### 相关工具和库
- [requests - HTTP 请求库](../../stdlib/urllib/)
- [aiohttp - 异步HTTP客户端](./aiohttp/)
- [beautifulsoup4 - HTML解析](https://www.crummy.com/software/BeautifulSoup/)
- [selenium - Web自动化](https://selenium-python.readthedocs.io/)

## 免责声明

本库与 DuckDuckGo 没有任何关联，仅供教育目的使用。不得用于商业用途或任何违反 DuckDuckGo 服务条款的目的。使用本库即表示您承认不会以侵犯 DuckDuckGo 条款的方式使用它。DuckDuckGo 官方网站：https://duckduckgo.com/

## 🏷️ 标签

`DuckDuckGo` `搜索API` `网络搜索` `图片搜索` `视频搜索` `新闻搜索` `地图搜索` `翻译API` `异步编程` `CLI工具` `代理支持`