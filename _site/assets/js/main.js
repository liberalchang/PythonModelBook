// 主题管理
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.applyTheme();
    this.bindEvents();
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    this.updateThemeIcon();
  }

  updateThemeIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
  }

  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
  }

  bindEvents() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggle());
    }
  }
}

// 移动端菜单管理
class MobileMenu {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createMobileMenu();
    this.bindEvents();
  }

  createMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    // 创建移动端菜单覆盖层
    const mobileMenuOverlay = document.createElement('div');
    mobileMenuOverlay.className = 'mobile-menu-overlay';
    mobileMenuOverlay.innerHTML = `
      <div class="mobile-menu-content">
        <div class="mobile-menu-header">
          <h3>菜单</h3>
          <button class="mobile-menu-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <nav class="mobile-nav">
          <a href="/" class="mobile-nav-link">首页</a>
          <a href="/docs/" class="mobile-nav-link">文档</a>
          <a href="/about/" class="mobile-nav-link">关于</a>
        </nav>
        <div class="mobile-menu-footer">
          <button id="mobile-theme-toggle" class="mobile-theme-toggle">
            <i class="fas fa-moon"></i>
            <span>切换主题</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(mobileMenuOverlay);

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .mobile-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }
      
      .mobile-menu-overlay.show {
        opacity: 1;
        visibility: visible;
      }
      
      .mobile-menu-content {
        position: absolute;
        top: 0;
        right: 0;
        width: 280px;
        height: 100%;
        background: var(--bg-primary);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        flex-direction: column;
      }
      
      .mobile-menu-overlay.show .mobile-menu-content {
        transform: translateX(0);
      }
      
      .mobile-menu-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
      }
      
      .mobile-menu-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        color: var(--text-secondary);
        cursor: pointer;
      }
      
      .mobile-nav {
        flex: 1;
        padding: 1rem 0;
      }
      
      .mobile-nav-link {
        display: block;
        padding: 0.75rem 1rem;
        color: var(--text-primary);
        text-decoration: none;
        border-bottom: 1px solid var(--border-color);
        transition: background-color 0.2s;
      }
      
      .mobile-nav-link:hover {
        background: var(--bg-secondary);
      }
      
      .mobile-menu-footer {
        padding: 1rem;
        border-top: 1px solid var(--border-color);
      }
      
      .mobile-theme-toggle {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--text-primary);
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      .mobile-theme-toggle:hover {
        background: var(--bg-tertiary);
      }
      
      @media (min-width: 769px) {
        .mobile-menu-overlay {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  toggle() {
    const overlay = document.querySelector('.mobile-menu-overlay');
    if (!overlay) return;

    this.isOpen = !this.isOpen;
    overlay.classList.toggle('show', this.isOpen);
    document.body.style.overflow = this.isOpen ? 'hidden' : '';
  }

  close() {
    const overlay = document.querySelector('.mobile-menu-overlay');
    if (!overlay) return;

    this.isOpen = false;
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  bindEvents() {
    // 菜单按钮
    const menuBtn = document.getElementById('mobile-menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => this.toggle());
    }

    // 关闭按钮
    document.addEventListener('click', (e) => {
      if (e.target.closest('.mobile-menu-close')) {
        this.close();
      }
    });

    // 覆盖层点击关闭
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('mobile-menu-overlay')) {
        this.close();
      }
    });

    // 移动端主题切换
    document.addEventListener('click', (e) => {
      if (e.target.closest('#mobile-theme-toggle')) {
        window.themeManager?.toggle();
      }
    });

    // ESC键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }
}

// 返回顶部按钮
class BackToTop {
  constructor() {
    this.button = document.getElementById('back-to-top');
    this.init();
  }

  init() {
    if (!this.button) return;
    this.bindEvents();
    this.handleScroll();
  }

  show() {
    this.button.classList.add('show');
  }

  hide() {
    this.button.classList.remove('show');
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 300) {
      this.show();
    } else {
      this.hide();
    }
  }

  bindEvents() {
    this.button.addEventListener('click', () => this.scrollToTop());
    window.addEventListener('scroll', () => this.handleScroll());
  }
}

// 平滑滚动
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  scrollToElement(target) {
    const element = document.querySelector(target);
    if (!element) return;

    const offsetTop = element.offsetTop - 80; // 考虑固定导航栏高度
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      this.scrollToElement(href);
    });
  }
}

// 导航栏滚动效果
class NavbarScroll {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.lastScrollTop = 0;
    this.init();
  }

  init() {
    if (!this.navbar) return;
    this.bindEvents();
  }

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 添加阴影效果
    if (scrollTop > 10) {
      this.navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
      this.navbar.style.boxShadow = 'none';
    }

    this.lastScrollTop = scrollTop;
  }

  bindEvents() {
    window.addEventListener('scroll', () => this.handleScroll());
  }
}

// 代码复制功能
class CodeCopy {
  constructor() {
    this.init();
  }

  init() {
    this.addCopyButtons();
  }

  addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (pre.querySelector('.copy-button')) return; // 避免重复添加

      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.innerHTML = '<i class="fas fa-copy"></i>';
      copyButton.title = '复制代码';

      // 添加样式
      copyButton.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 0.5rem;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
        color: var(--text-secondary);
        font-size: 0.8rem;
      `;

      pre.style.position = 'relative';
      pre.appendChild(copyButton);

      // 鼠标悬停显示按钮
      pre.addEventListener('mouseenter', () => {
        copyButton.style.opacity = '1';
      });

      pre.addEventListener('mouseleave', () => {
        copyButton.style.opacity = '0';
      });

      // 复制功能
      copyButton.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(codeBlock.textContent);
          copyButton.innerHTML = '<i class="fas fa-check"></i>';
          copyButton.style.color = 'var(--accent-color)';
          
          setTimeout(() => {
            copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            copyButton.style.color = 'var(--text-secondary)';
          }, 2000);
        } catch (err) {
          console.error('复制失败:', err);
        }
      });
    });
  }
}

// 图片懒加载
class LazyLoad {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
          }
        });
      });

      this.images.forEach(img => this.observer.observe(img));
    } else {
      // 降级处理
      this.images.forEach(img => this.loadImage(img));
    }
  }

  loadImage(img) {
    img.src = img.dataset.src;
    img.classList.add('fade-in');
    if (this.observer) {
      this.observer.unobserve(img);
    }
  }
}

// 表格响应式处理
class ResponsiveTable {
  constructor() {
    this.init();
  }

  init() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => this.wrapTable(table));
  }

  wrapTable(table) {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    wrapper.style.cssText = `
      overflow-x: auto;
      margin: 1rem 0;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
    `;
    
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  }
}

// 工具提示
class Tooltip {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  show(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: absolute;
      background: var(--bg-dark);
      color: var(--text-inverse);
      padding: 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
    `;

    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';

    setTimeout(() => tooltip.style.opacity = '1', 10);

    return tooltip;
  }

  hide(tooltip) {
    if (tooltip) {
      tooltip.style.opacity = '0';
      setTimeout(() => tooltip.remove(), 200);
    }
  }

  bindEvents() {
    document.addEventListener('mouseenter', (e) => {
      // 确保目标是元素节点，避免在文本节点上调用closest方法
      if (!e.target || typeof e.target.closest !== 'function') return;
      
      const element = e.target.closest('[title]');
      if (!element) return;

      const title = element.getAttribute('title');
      if (!title) return;

      element.removeAttribute('title');
      element.dataset.originalTitle = title;
      element.tooltip = this.show(element, title);
    }, true);

    document.addEventListener('mouseleave', (e) => {
      // 确保目标是元素节点，避免在文本节点上调用closest方法
      if (!e.target || typeof e.target.closest !== 'function') return;
      
      const element = e.target.closest('[data-original-title]');
      if (!element) return;

      this.hide(element.tooltip);
      element.setAttribute('title', element.dataset.originalTitle);
      delete element.dataset.originalTitle;
      delete element.tooltip;
    }, true);
  }
}

// 性能监控
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => this.logPerformance(), 0);
      });
    }
  }

  logPerformance() {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (!navigation) return;

    const metrics = {
      'DNS查询': navigation.domainLookupEnd - navigation.domainLookupStart,
      'TCP连接': navigation.connectEnd - navigation.connectStart,
      '请求响应': navigation.responseEnd - navigation.requestStart,
      'DOM解析': navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      '页面加载': navigation.loadEventEnd - navigation.loadEventStart,
      '总时间': navigation.loadEventEnd - navigation.navigationStart
    };

    console.group('🚀 页面性能指标');
    Object.entries(metrics).forEach(([name, time]) => {
      if (time > 0) {
        console.log(`${name}: ${Math.round(time)}ms`);
      }
    });
    console.groupEnd();
  }
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
  // 初始化各个模块
  window.themeManager = new ThemeManager();
  window.mobileMenu = new MobileMenu();
  window.backToTop = new BackToTop();
  window.smoothScroll = new SmoothScroll();
  window.navbarScroll = new NavbarScroll();
  window.codeCopy = new CodeCopy();
  window.lazyLoad = new LazyLoad();
  window.responsiveTable = new ResponsiveTable();
  window.tooltip = new Tooltip();
  window.performanceMonitor = new PerformanceMonitor();

  // 添加页面加载动画
  document.body.classList.add('fade-in');

  console.log('🎉 Python知识体系文档已加载完成');
});

// 导出模块供其他脚本使用
window.PythonDocs = {
  ThemeManager,
  MobileMenu,
  BackToTop,
  SmoothScroll,
  NavbarScroll,
  CodeCopy,
  LazyLoad,
  ResponsiveTable,
  Tooltip,
  PerformanceMonitor
};