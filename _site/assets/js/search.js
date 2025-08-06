// 搜索功能管理
class SearchManager {
  constructor() {
    this.searchInput = document.getElementById('search-input');
    this.searchResults = document.getElementById('search-results');
    this.searchIndex = null;
    this.documents = [];
    this.isLoading = false;
    this.debounceTimer = null;
    this.init();
  }

  async init() {
    if (!this.searchInput || !this.searchResults) return;
    
    await this.loadSearchIndex();
    this.bindEvents();
    this.setupKeyboardNavigation();
  }

  // 加载搜索索引
  async loadSearchIndex() {
    try {
      this.isLoading = true;
      
      // 加载文档数据
      const response = await fetch('/search.json');
      if (!response.ok) {
        // 如果没有搜索索引文件，创建一个基本的文档列表
        this.documents = this.createBasicDocuments();
      } else {
        this.documents = await response.json();
      }

      // 创建Lunr搜索索引
      const self = this;
      this.searchIndex = lunr(function() {
        this.ref('id');
        this.field('title', { boost: 10 });
        this.field('content', { boost: 1 });
        this.field('tags', { boost: 5 });
        this.field('category', { boost: 3 });

        self.documents.forEach(doc => {
          this.add(doc);
        }, this);
      });

      console.log(`🔍 搜索索引已加载，包含 ${this.documents.length} 个文档`);
    } catch (error) {
      console.error('搜索索引加载失败:', error);
      this.documents = this.createBasicDocuments();
    } finally {
      this.isLoading = false;
    }
  }

  // 创建基本文档列表（当没有搜索索引时）
  createBasicDocuments() {
    return [
      {
        id: 'basics-variables',
        title: '变量与数据类型',
        content: 'Python变量定义、基本数据类型、类型转换',
        url: '/docs/basics/variables/',
        category: '基础语法',
        tags: ['变量', '数据类型', '基础']
      },
      {
        id: 'basics-control-flow',
        title: '控制流程',
        content: 'if语句、for循环、while循环、break、continue',
        url: '/docs/basics/control-flow/',
        category: '基础语法',
        tags: ['控制流', '循环', '条件']
      },
      {
        id: 'basics-functions',
        title: '函数定义',
        content: '函数定义、参数传递、返回值、作用域',
        url: '/docs/basics/functions/',
        category: '基础语法',
        tags: ['函数', '参数', '作用域']
      },
      {
        id: 'basics-classes',
        title: '类与对象',
        content: '面向对象编程、类定义、继承、多态',
        url: '/docs/basics/classes/',
        category: '基础语法',
        tags: ['类', '对象', '继承']
      },
      {
        id: 'builtins-string',
        title: '字符串函数',
        content: 'str方法、字符串格式化、正则表达式',
        url: '/docs/builtins/string-functions/',
        category: '内置函数',
        tags: ['字符串', '格式化', '正则']
      },
      {
        id: 'builtins-math',
        title: '数学函数',
        content: 'math模块、数值计算、统计函数',
        url: '/docs/builtins/math-functions/',
        category: '内置函数',
        tags: ['数学', '计算', '统计']
      },
      {
        id: 'stdlib-file',
        title: '文件操作',
        content: '文件读写、路径处理、目录操作',
        url: '/docs/stdlib/file-operations/',
        category: '标准库',
        tags: ['文件', '路径', '目录']
      },
      {
        id: 'stdlib-datetime',
        title: '日期时间',
        content: 'datetime模块、时间格式化、时区处理',
        url: '/docs/stdlib/datetime/',
        category: '标准库',
        tags: ['日期', '时间', '格式化']
      },
      {
        id: 'thirdparty-numpy',
        title: 'NumPy数组',
        content: '数组操作、数值计算、线性代数',
        url: '/docs/thirdparty/numpy/',
        category: '第三方库',
        tags: ['numpy', '数组', '计算']
      },
      {
        id: 'thirdparty-pandas',
        title: 'Pandas数据分析',
        content: 'DataFrame、数据清洗、数据分析',
        url: '/docs/thirdparty/pandas/',
        category: '第三方库',
        tags: ['pandas', '数据分析', 'dataframe']
      }
    ];
  }

  // 执行搜索
  search(query) {
    if (!query.trim() || !this.searchIndex) {
      this.hideResults();
      return;
    }

    try {
      // 使用Lunr进行搜索
      const results = this.searchIndex.search(query);
      
      // 获取匹配的文档
      const matchedDocs = results.map(result => {
        const doc = this.documents.find(d => d.id === result.ref);
        return {
          ...doc,
          score: result.score,
          matches: result.matchData
        };
      }).filter(Boolean);

      // 如果没有精确匹配，尝试模糊搜索
      if (matchedDocs.length === 0) {
        const fuzzyResults = this.fuzzySearch(query);
        this.displayResults(fuzzyResults, query, true);
      } else {
        this.displayResults(matchedDocs, query, false);
      }
    } catch (error) {
      console.error('搜索执行失败:', error);
      this.displayError();
    }
  }

  // 模糊搜索
  fuzzySearch(query) {
    const lowerQuery = query.toLowerCase();
    return this.documents.filter(doc => {
      const searchText = `${doc.title} ${doc.content} ${doc.tags?.join(' ') || ''}`.toLowerCase();
      return searchText.includes(lowerQuery);
    }).slice(0, 5); // 限制结果数量
  }

  // 显示搜索结果
  displayResults(results, query, isFuzzy = false) {
    if (results.length === 0) {
      this.displayNoResults(query);
      return;
    }

    const resultsHTML = results.map((result, index) => {
      const highlightedTitle = this.highlightText(result.title, query);
      const highlightedContent = this.highlightText(result.content, query);
      
      return `
        <div class="search-result-item" data-index="${index}" data-url="${result.url}">
          <div class="search-result-header">
            <h4 class="search-result-title">${highlightedTitle}</h4>
            <span class="search-result-category">${result.category}</span>
          </div>
          <p class="search-result-excerpt">${highlightedContent}</p>
          ${result.tags ? `<div class="search-result-tags">${result.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
        </div>
      `;
    }).join('');

    const headerHTML = isFuzzy ? 
      `<div class="search-results-header">找到 ${results.length} 个相关结果</div>` :
      `<div class="search-results-header">找到 ${results.length} 个匹配结果</div>`;

    this.searchResults.innerHTML = headerHTML + resultsHTML;
    this.showResults();
  }

  // 显示无结果
  displayNoResults(query) {
    this.searchResults.innerHTML = `
      <div class="search-no-results">
        <div class="no-results-icon">
          <i class="fas fa-search"></i>
        </div>
        <h4>未找到相关内容</h4>
        <p>没有找到与 "${this.escapeHtml(query)}" 相关的文档</p>
        <div class="search-suggestions">
          <p>建议：</p>
          <ul>
            <li>检查拼写是否正确</li>
            <li>尝试使用更简单的关键词</li>
            <li>使用同义词或相关术语</li>
          </ul>
        </div>
      </div>
    `;
    this.showResults();
  }

  // 显示错误信息
  displayError() {
    this.searchResults.innerHTML = `
      <div class="search-error">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h4>搜索出错</h4>
        <p>搜索功能暂时不可用，请稍后再试</p>
      </div>
    `;
    this.showResults();
  }

  // 高亮搜索关键词
  highlightText(text, query) {
    if (!text || !query) return text;
    
    const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // 转义HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 转义正则表达式
  escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 显示搜索结果
  showResults() {
    this.searchResults.classList.add('show');
  }

  // 隐藏搜索结果
  hideResults() {
    this.searchResults.classList.remove('show');
  }

  // 绑定事件
  bindEvents() {
    // 搜索输入事件
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.search(e.target.value);
      }, 300);
    });

    // 搜索框焦点事件
    this.searchInput.addEventListener('focus', () => {
      if (this.searchInput.value.trim()) {
        this.showResults();
      }
    });

    // 点击搜索结果
    this.searchResults.addEventListener('click', (e) => {
      const resultItem = e.target.closest('.search-result-item');
      if (resultItem) {
        const url = resultItem.dataset.url;
        if (url) {
          window.location.href = url;
        }
      }
    });

    // 点击外部隐藏结果
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        this.hideResults();
      }
    });

    // ESC键隐藏结果
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideResults();
        this.searchInput.blur();
      }
    });
  }

  // 键盘导航
  setupKeyboardNavigation() {
    let selectedIndex = -1;

    this.searchInput.addEventListener('keydown', (e) => {
      const items = this.searchResults.querySelectorAll('.search-result-item');
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
          this.updateSelection(items, selectedIndex);
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          selectedIndex = Math.max(selectedIndex - 1, -1);
          this.updateSelection(items, selectedIndex);
          break;
          
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && items[selectedIndex]) {
            const url = items[selectedIndex].dataset.url;
            if (url) {
              window.location.href = url;
            }
          }
          break;
      }
    });

    // 重置选择状态
    this.searchInput.addEventListener('input', () => {
      selectedIndex = -1;
    });
  }

  // 更新选择状态
  updateSelection(items, selectedIndex) {
    items.forEach((item, index) => {
      item.classList.toggle('selected', index === selectedIndex);
    });

    // 滚动到选中项
    if (selectedIndex >= 0 && items[selectedIndex]) {
      items[selectedIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }

  // 获取搜索建议
  getSuggestions(query) {
    if (!query.trim()) return [];

    const suggestions = new Set();
    const lowerQuery = query.toLowerCase();

    // 从文档标题中提取建议
    this.documents.forEach(doc => {
      const words = doc.title.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.startsWith(lowerQuery) && word !== lowerQuery) {
          suggestions.add(word);
        }
      });

      // 从标签中提取建议
      if (doc.tags) {
        doc.tags.forEach(tag => {
          const lowerTag = tag.toLowerCase();
          if (lowerTag.startsWith(lowerQuery) && lowerTag !== lowerQuery) {
            suggestions.add(tag);
          }
        });
      }
    });

    return Array.from(suggestions).slice(0, 5);
  }
}

// 搜索统计
class SearchAnalytics {
  constructor() {
    this.searches = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    this.maxHistory = 50;
  }

  // 记录搜索
  recordSearch(query, resultCount) {
    const search = {
      query: query.trim(),
      timestamp: Date.now(),
      resultCount
    };

    this.searches.unshift(search);
    this.searches = this.searches.slice(0, this.maxHistory);
    
    localStorage.setItem('searchHistory', JSON.stringify(this.searches));
  }

  // 获取热门搜索
  getPopularSearches(limit = 5) {
    const queryCount = {};
    
    this.searches.forEach(search => {
      queryCount[search.query] = (queryCount[search.query] || 0) + 1;
    });

    return Object.entries(queryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([query]) => query);
  }

  // 获取最近搜索
  getRecentSearches(limit = 5) {
    const uniqueQueries = new Set();
    const recent = [];

    for (const search of this.searches) {
      if (!uniqueQueries.has(search.query) && recent.length < limit) {
        uniqueQueries.add(search.query);
        recent.push(search.query);
      }
    }

    return recent;
  }

  // 清除搜索历史
  clearHistory() {
    this.searches = [];
    localStorage.removeItem('searchHistory');
  }
}

// 初始化搜索功能
document.addEventListener('DOMContentLoaded', () => {
  window.searchManager = new SearchManager();
  window.searchAnalytics = new SearchAnalytics();

  // 添加搜索结果样式
  const searchStyles = document.createElement('style');
  searchStyles.textContent = `
    .search-results-header {
      padding: 0.75rem 1rem;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
      font-size: 0.85rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .search-result-item {
      transition: background-color 0.2s;
    }
    
    .search-result-item.selected {
      background: var(--bg-secondary);
    }
    
    .search-result-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }
    
    .search-result-category {
      background: var(--primary-color);
      color: var(--text-inverse);
      padding: 0.2rem 0.5rem;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 500;
    }
    
    .search-result-tags {
      margin-top: 0.5rem;
      display: flex;
      gap: 0.25rem;
      flex-wrap: wrap;
    }
    
    .search-result-tags .tag {
      background: var(--bg-tertiary);
      color: var(--text-secondary);
      padding: 0.1rem 0.4rem;
      border-radius: 8px;
      font-size: 0.7rem;
    }
    
    .search-no-results,
    .search-error {
      padding: 2rem 1rem;
      text-align: center;
      color: var(--text-secondary);
    }
    
    .no-results-icon,
    .error-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }
    
    .search-suggestions {
      margin-top: 1rem;
      text-align: left;
      max-width: 300px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .search-suggestions ul {
      list-style: none;
      padding: 0;
      margin: 0.5rem 0;
    }
    
    .search-suggestions li {
      padding: 0.25rem 0;
      font-size: 0.85rem;
    }
    
    mark {
      background: rgba(59, 130, 246, 0.2);
      color: var(--text-primary);
      padding: 0.1rem 0.2rem;
      border-radius: 2px;
    }
  `;
  
  document.head.appendChild(searchStyles);

  console.log('🔍 搜索功能已初始化');
});

// 导出搜索模块
window.PythonDocsSearch = {
  SearchManager,
  SearchAnalytics
};