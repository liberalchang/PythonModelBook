/**
 * 文档页面交互功能
 * 包括难度筛选、卡片动画、学习路径交互等
 */

class DocsManager {
    constructor() {
        this.init();
    }

    init() {
        this.initDifficultyFilter();
        this.initCardAnimations();
        this.initLearningPath();
        this.initModuleStats();
        this.initProgressTracking();
    }

    /**
     * 初始化难度筛选功能
     */
    initDifficultyFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const docCards = document.querySelectorAll('.doc-card');
        const moduleSections = document.querySelectorAll('.module-section');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const difficulty = button.dataset.difficulty;
                
                // 更新按钮状态
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // 筛选文档卡片
                this.filterDocuments(difficulty, docCards, moduleSections);
                
                // 添加筛选动画
                this.animateFilterResults();
            });
        });
    }

    /**
     * 筛选文档
     */
    filterDocuments(difficulty, docCards, moduleSections) {
        if (difficulty === 'all') {
            // 显示所有内容
            docCards.forEach(card => {
                card.style.display = 'block';
                card.classList.remove('filtered-out');
            });
            moduleSections.forEach(section => {
                section.style.display = 'block';
            });
        } else {
            // 按难度筛选
            docCards.forEach(card => {
                const cardDifficulty = card.dataset.difficulty;
                if (cardDifficulty === difficulty) {
                    card.style.display = 'block';
                    card.classList.remove('filtered-out');
                } else {
                    card.style.display = 'none';
                    card.classList.add('filtered-out');
                }
            });
            
            // 隐藏没有匹配卡片的模块
            moduleSections.forEach(section => {
                const visibleCards = section.querySelectorAll('.doc-card:not(.filtered-out)');
                if (visibleCards.length === 0) {
                    section.style.display = 'none';
                } else {
                    section.style.display = 'block';
                }
            });
        }
    }

    /**
     * 筛选结果动画
     */
    animateFilterResults() {
        const visibleCards = document.querySelectorAll('.doc-card:not(.filtered-out)');
        
        visibleCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    /**
     * 初始化卡片动画
     */
    initCardAnimations() {
        const cards = document.querySelectorAll('.doc-card');
        
        // 添加悬停效果增强
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCardHover(card, false);
            });
            
            // 点击效果
            card.addEventListener('click', (e) => {
                if (e.target.tagName !== 'A') {
                    const link = card.querySelector('h4 a');
                    if (link) {
                        link.click();
                    }
                }
            });
        });
    }

    /**
     * 卡片悬停动画
     */
    animateCardHover(card, isHover) {
        const icon = card.querySelector('.card-icon');
        const title = card.querySelector('h4');
        
        if (isHover) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            title.style.color = 'var(--primary-color)';
            card.style.cursor = 'pointer';
        } else {
            icon.style.transform = 'scale(1) rotate(0deg)';
            title.style.color = '';
            card.style.cursor = '';
        }
    }

    /**
     * 初始化学习路径交互
     */
    initLearningPath() {
        const pathSteps = document.querySelectorAll('.path-step');
        
        pathSteps.forEach((step, index) => {
            step.addEventListener('click', () => {
                this.highlightLearningPath(index);
            });
            
            // 添加进度指示
            this.addProgressIndicator(step, index);
        });
        
        // 自动播放学习路径动画
        this.autoPlayLearningPath();
    }

    /**
     * 高亮学习路径
     */
    highlightLearningPath(activeIndex) {
        const pathSteps = document.querySelectorAll('.path-step');
        
        pathSteps.forEach((step, index) => {
            if (index <= activeIndex) {
                step.classList.add('completed');
            } else {
                step.classList.remove('completed');
            }
            
            if (index === activeIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    /**
     * 添加进度指示器
     */
    addProgressIndicator(step, index) {
        const stepNumber = step.querySelector('.step-number');
        const progress = this.getStepProgress(index);
        
        if (progress > 0) {
            stepNumber.innerHTML = `<i class="fas fa-check"></i>`;
            step.classList.add('completed');
        }
    }

    /**
     * 获取步骤进度（模拟数据）
     */
    getStepProgress(stepIndex) {
        const progress = localStorage.getItem(`learning_progress_${stepIndex}`) || 0;
        return parseInt(progress);
    }

    /**
     * 自动播放学习路径动画
     */
    autoPlayLearningPath() {
        const pathSteps = document.querySelectorAll('.path-step');
        
        pathSteps.forEach((step, index) => {
            setTimeout(() => {
                step.style.opacity = '0';
                step.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    step.style.transition = 'all 0.5s ease';
                    step.style.opacity = '1';
                    step.style.transform = 'translateY(0)';
                }, 100);
            }, index * 200);
        });
    }

    /**
     * 初始化模块统计
     */
    initModuleStats() {
        const moduleSections = document.querySelectorAll('.module-section');
        
        moduleSections.forEach(section => {
            const cards = section.querySelectorAll('.doc-card');
            const header = section.querySelector('.module-header');
            
            // 添加文档数量统计
            const statsElement = document.createElement('span');
            statsElement.className = 'module-stats';
            statsElement.innerHTML = `<i class="fas fa-file-alt"></i> ${cards.length} 个文档`;
            header.appendChild(statsElement);
            
            // 添加完成进度
            this.addModuleProgress(section);
        });
    }

    /**
     * 添加模块进度
     */
    addModuleProgress(section) {
        const cards = section.querySelectorAll('.doc-card');
        const completedCount = this.getModuleCompletedCount(section);
        const progressPercent = Math.round((completedCount / cards.length) * 100);
        
        const progressBar = document.createElement('div');
        progressBar.className = 'module-progress';
        progressBar.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            <span class="progress-text">${completedCount}/${cards.length} 已完成</span>
        `;
        
        const footer = section.querySelector('.module-footer');
        footer.insertBefore(progressBar, footer.firstChild);
    }

    /**
     * 获取模块完成数量（模拟数据）
     */
    getModuleCompletedCount(section) {
        const cards = section.querySelectorAll('.doc-card');
        let completed = 0;
        
        cards.forEach((card, index) => {
            const isCompleted = localStorage.getItem(`doc_completed_${card.querySelector('a').href}`);
            if (isCompleted) {
                completed++;
                card.classList.add('completed');
            }
        });
        
        return completed;
    }

    /**
     * 初始化进度跟踪
     */
    initProgressTracking() {
        const docLinks = document.querySelectorAll('.doc-card a');
        
        docLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.trackDocumentVisit(link.href);
            });
        });
    }

    /**
     * 跟踪文档访问
     */
    trackDocumentVisit(url) {
        const visits = JSON.parse(localStorage.getItem('doc_visits') || '{}');
        visits[url] = (visits[url] || 0) + 1;
        localStorage.setItem('doc_visits', JSON.stringify(visits));
        
        // 标记为已访问
        const visitedDocs = JSON.parse(localStorage.getItem('visited_docs') || '[]');
        if (!visitedDocs.includes(url)) {
            visitedDocs.push(url);
            localStorage.setItem('visited_docs', JSON.stringify(visitedDocs));
        }
    }

    /**
     * 添加搜索高亮功能
     */
    highlightSearchResults(query) {
        if (!query) return;
        
        const cards = document.querySelectorAll('.doc-card');
        const regex = new RegExp(query, 'gi');
        
        cards.forEach(card => {
            const title = card.querySelector('h4');
            const description = card.querySelector('p');
            
            // 高亮标题
            if (title) {
                const originalText = title.textContent;
                title.innerHTML = originalText.replace(regex, '<mark>$&</mark>');
            }
            
            // 高亮描述
            if (description) {
                const originalText = description.textContent;
                description.innerHTML = originalText.replace(regex, '<mark>$&</mark>');
            }
        });
    }

    /**
     * 清除搜索高亮
     */
    clearSearchHighlight() {
        const highlighted = document.querySelectorAll('mark');
        highlighted.forEach(mark => {
            const parent = mark.parentNode;
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize();
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new DocsManager();
    
    // 添加额外的CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .module-stats {
            background: var(--primary-color);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .module-progress {
            margin-bottom: 1rem;
            text-align: center;
        }
        
        .progress-bar {
            background: var(--border-color);
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 0.5rem;
        }
        
        .progress-fill {
            background: var(--primary-color);
            height: 100%;
            transition: width 0.3s ease;
        }
        
        .progress-text {
            font-size: 0.8rem;
            color: var(--text-muted);
        }
        
        .path-step.completed .step-number {
            background: var(--success-color);
        }
        
        .path-step.active {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
        }
        
        .doc-card.completed::after {
            content: '✓';
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: var(--success-color);
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: bold;
        }
        
        .filtered-out {
            display: none !important;
        }
        
        mark {
            background: var(--primary-color);
            color: white;
            padding: 0.1rem 0.2rem;
            border-radius: 3px;
        }
    `;
    document.head.appendChild(style);
});