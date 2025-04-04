# 固定床反应器工具集 - CursorRules

这个文档定义了使用Cursor编辑器开发固定床反应器工具集网站时应遵循的规则和指南，以确保所有子网页保持一致的风格和结构。

## 基本结构规则

### HTML结构

每个子网页必须遵循以下HTML基本结构:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[工具名称] - 固定床反应器工具集</title>
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
    <link rel="preconnect" href="https://polyfill.io">
    <!-- 引入全局样式表 -->
    <link rel="stylesheet" href="../global-styles.css">
    <!-- 页面特定样式 -->
    <style>
        /* 页面特定的关键CSS */
    </style>
    <!-- MathJax支持 -->
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6" defer></script>
    <script type="text/javascript" id="MathJax-script" async
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
    </script>
    <script>
        window.MathJax = {
            tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']],
                processEscapes: true
            },
            svg: {
                fontCache: 'global',
                scale: 1.1
            },
            startup: {
                typeset: false
            },
            options: {
                enableMenu: false
            }
        };
    </script>
</head>
<body>
    <div class="container">
        <!-- 标准头部 -->
        <header>
            <div class="header-line"></div>
            <h1>[工具名称]</h1>
            <h2>✨ [工具简短描述] ✨</h2>
            <div class="header-line"></div>
            <a href="../index.html" class="back-link">返回主页</a>
        </header>

        <!-- 标准标签页结构 -->
        <div class="tabs">
            <button class="tab-btn active" data-tab="input">输入参数</button>
            <button class="tab-btn" data-tab="results">计算结果</button>
        </div>

        <!-- 主要内容 -->
        <main>
            <!-- 输入标签页 -->
            <div id="input" class="tab-content active">
                <!-- 输入部分内容 -->
            </div>

            <!-- 结果标签页 -->
            <div id="results" class="tab-content">
                <!-- 结果部分内容 -->
            </div>
        </main>

        <!-- 标准页脚 -->
        <footer>
            <p>© 固定床反应器工具集（Junqi）2025</p>
        </footer>
    </div>
    
    <!-- 页面脚本 -->
    <script src="script.js"></script>
</body>
</html>
```

### CSS组织

1. 每个子网页必须首先引入全局样式表 `global-styles.css`

## 组件规则

### 输入区域

输入区域应使用以下结构:

```html
<section class="input-section">
    <h3>输入参数</h3>
    <div class="input-grid">
        <div class="input-column">
            <div class="input-group">
                <label class="tooltip" data-tooltip="参数说明">🔹 参数名称 (单位):</label>
                <input type="number" id="parameter_id" value="默认值" min="最小值" required>
            </div>
            <!-- 更多输入组 -->
        </div>
        <div class="input-column">
            <!-- 第二列输入组 -->
        </div>
    </div>
</section>
```

### 计算方程选择区域

当工具支持多种计算方程时，应使用以下结构:

```html
<section class="equations-section">
    <h3>选择计算方程</h3>
    <div class="equation-list">
        <label class="equation-item">
            <input type="checkbox" id="equation_id" checked>
            <span>📊 方程名称</span>
            <small>(简短描述)</small>
            <a href="#" class="info-link equation-info" data-formula="equation_id">ℹ️ 查看公式</a>
        </label>
        <!-- 更多方程选项 -->
    </div>
</section>
```

### 按钮区域

按钮区域应使用以下结构:

```html
<section class="buttons-section">
    <button id="calculate" class="btn calc-btn">✨ 计算[功能名称] ✨</button>
    <button id="clear" class="btn clear-btn">🗑️ 清除输入</button>
    <button id="reset" class="btn reset-btn">🔄 重置默认值</button>
</section>
```

### 结果展示区域

结果区域应使用以下结构:

```html
<section class="results-section">
    <h3>✨ 计算结果详情 ✨</h3>
    <div class="results-content">
        <div class="result-text" id="result-content-area">
            <!-- 初始欢迎消息 -->
            <div class="welcome-message">
                <div class="icon-container">
                    <i class="fas fa-chart-line pulse-animation"></i>
                </div>
                <h4>欢迎使用[工具名称]</h4>
                <p>请在「输入参数」标签页中输入参数并点击<br>「✨ 计算[功能名称] ✨」按钮开始计算</p>
                <div class="tips-container">
                    <div class="tip-item">
                        <i class="fas fa-lightbulb"></i>
                        <span>计算结果将显示在这里</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

## 交互规则

### 标签页切换

标签页交互应使用以下JavaScript代码实现:

```javascript
// 标签页切换
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 移除所有active类
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // 添加active类到当前标签和内容
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});
```

### 表单验证

所有输入字段应进行以下验证:

```javascript
// 表单验证
function validateInputs() {
    const inputs = document.querySelectorAll('input[type="number"]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value || input.value === '' || isNaN(parseFloat(input.value))) {
            input.classList.add('invalid');
            isValid = false;
        } else {
            input.classList.remove('invalid');
        }
    });
    
    return isValid;
}
```

### 计算按钮事件处理

计算按钮应实现以下事件处理逻辑:

```javascript
// 计算按钮事件
document.getElementById('calculate').addEventListener('click', function() {
    if (validateInputs()) {
        const inputValues = getInputValues();
        const results = calculate(inputValues);
        displayResults(results);
        // 切换到结果标签页
        document.querySelector('.tab-btn[data-tab="results"]').click();
    }
});
```

## 样式规则

### 颜色系统

所有页面必须使用全局样式中定义的颜色变量:

```css
:root {
    --primary-color: #6366F1;        /* 主色调 */
    --secondary-color: #1E293B;      /* 次要色调 */
    --bg-color: #F8FAFC;             /* 背景色 */
    --input-bg: #FFFFFF;             /* 输入框背景 */
    --accent-color: #F472B6;         /* 强调色 */
    --accent-light: #FDF4FF;         /* 浅强调色 */
    
    --button-primary: linear-gradient(135deg, #6366F1, #818CF8);
    --button-secondary: linear-gradient(135deg, #F472B6, #FB7185);
    --button-reset: linear-gradient(135deg, #94A3B8, #CBD5E1);
}
```

### 排版规则

使用全局样式中定义的字体大小和行高:

```css
h1 {
    font-size: var(--font-large);
    color: var(--primary-color);
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

h2 {
    font-size: var(--font-small);
    color: var(--secondary-color);
}

h3 {
    color: var(--primary-color);
    font-size: var(--font-medium);
}
```

### 响应式设计

所有页面必须包含响应式设计，至少支持以下断点:

```css
@media (max-width: 768px) {
    .input-grid {
        grid-template-columns: 1fr;
    }
    
    h1 {
        font-size: 2.2em;
    }
    
    h2 {
        font-size: 1.1em;
    }
}

@media (max-width: 500px) {
    .container {
        padding: 15px;
    }
    
    .input-section {
        padding: 20px;
    }
}
```

## JavaScript规则

### 代码组织

每个子网页的JavaScript应组织为以下结构:

```javascript
// 1. 获取DOM元素
const calculateBtn = document.getElementById('calculate');
const clearBtn = document.getElementById('clear');
const resetBtn = document.getElementById('reset');
const resultArea = document.getElementById('result-content-area');

// 2. 工具函数定义
function validateInputs() { /* ... */ }
function getInputValues() { /* ... */ }
function displayResults(results) { /* ... */ }

// 3. 计算函数定义
function calculate(inputValues) { /* ... */ }
function calculateWithSpecificModel(inputValues, model) { /* ... */ }

// 4. 事件监听器
calculateBtn.addEventListener('click', function() {
    if (validateInputs()) {
        const inputValues = getInputValues();
        const results = calculate(inputValues);
        displayResults(results);
        // 切换到结果标签页
        document.querySelector('.tab-btn[data-tab="results"]').click();
    }
});

clearBtn.addEventListener('click', function() { /* ... */ });
resetBtn.addEventListener('click', function() { /* ... */ });

// 5. 初始化函数(如果需要)
function init() { /* ... */ }
init();
```

### MathJax配置

所有使用数学公式的页面必须包含以下MathJax配置:

```javascript
window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true
    },
    svg: {
        fontCache: 'global',
        scale: 1.1
    },
    startup: {
        typeset: false
    },
    options: {
        enableMenu: false
    }
};
```

## 最佳实践检查列表

在完成子网页开发后，使用以下检查列表确保符合规则:

- [ ] HTML结构是否符合模板
- [ ] 是否正确引入全局样式表和页面特定样式
- [ ] 是否使用了正确的组件结构（输入区域、按钮区域、结果区域）
- [ ] 是否实现了标准的交互行为（标签页切换、表单验证）
- [ ] 是否使用了全局颜色变量和排版规则
- [ ] 是否实现了响应式设计
- [ ] JavaScript代码是否按规定结构组织
- [ ] 是否正确配置MathJax（如果需要）
- [ ] 是否包含标准页脚
- [ ] 返回主页链接是否正确

## 添加新子网页的流程

1. 从现有子网页复制基本HTML结构
2. 更新标题、描述和具体功能
3. 修改输入字段以适应特定应用
4. 实现特定的计算功能
5. 调整结果展示方式
6. 在主页添加新子网页的链接卡片
7. 运行检查列表确认所有规则都得到遵守 