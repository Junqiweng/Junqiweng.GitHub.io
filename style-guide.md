# 固定床反应器工具集 - 样式指南

本文档提供了如何在固定床反应器工具集网站中使用全局样式和页面特定样式的指南，以确保整个网站保持视觉一致性。

## 样式架构

网站采用了两层样式架构：

1. **全局样式 (`global-styles.css`)**：定义整个网站共享的视觉元素，如颜色、排版、基础组件等
2. **页面样式 (`styles.css`)**：定义页面特定的元素，可以覆盖全局样式中的部分定义

## 全局变量

所有样式使用CSS变量来保持一致性，主要包括：

### 颜色系统

```css
--primary-color: #4A90E2;        /* 主色调：蓝色 */
--secondary-color: #2C3E50;      /* 次要色调：深蓝灰色 */
--bg-color: #F5F7FA;             /* 背景色：浅灰色 */
--input-bg: #FFFFFF;             /* 输入框背景：白色 */
--button-primary: #2ECC71;       /* 主要按钮：绿色 */
--button-secondary: #E74C3C;     /* 次要按钮：红色 */
--button-reset: #3498DB;         /* 重置按钮：蓝色 */
--result-bg: #FFFFFF;            /* 结果背景：白色 */
--border-color: #E0E6ED;         /* 边框颜色：浅灰色 */
--error-color: #E74C3C;          /* 错误颜色：红色 */
--success-color: #27AE60;        /* 成功颜色：绿色 */
```

### 排版系统

```css
--font-large: 2.2em;             /* 大标题 */
--font-medium: 1.5em;            /* 中标题 */
--font-small: 1.3em;             /* 小标题 */
--font-normal: 1em;              /* 正文 */
--font-small-text: 0.9em;        /* 小文本 */
```

### 其他设计元素

```css
--border-radius: 8px;            /* 标准圆角 */
--box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);  /* 标准阴影 */
--hover-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* 悬停阴影 */
```

## 在新页面中使用全局样式

要在新页面中使用全局样式，只需：

1. 在HTML `<head>` 部分首先引入全局样式表：

```html
<link rel="stylesheet" href="../global-styles.css">
<!-- 然后引入页面特定样式 -->
<link rel="stylesheet" href="styles.css">
```

2. 遵循标准化的HTML结构：

```html
<div class="container">
    <header>
        <a href="../index.html" class="back-link">返回首页</a>
        <div class="header-line"></div>
        <h1>页面标题</h1>
        <h2>页面副标题</h2>
        <div class="header-line"></div>
    </header>
    
    <!-- 页面内容 -->
    
    <footer>
        <p>© 固定床反应器工具集（Junqi）2025</p>
    </footer>
</div>
```

## 页面特定样式

页面特定样式文件应当避免重复定义全局样式已有的样式。最佳实践是：

1. 仅定义页面特有的组件或元素
2. 仅覆盖需要与全局样式不同的样式
3. 利用全局样式中定义的变量，确保视觉一致性

示例：

```css
/* 页面特定组件 */
.special-component {
    background-color: rgba(74, 144, 226, 0.1);
    border-left: 3px solid var(--primary-color);
    padding: 15px;
    border-radius: var(--border-radius);
}
```

## 常见组件和类

全局样式表定义了多种常用组件和类，包括：

### 布局

- `.container`: 页面主容器
- `.input-section`: 输入区域
- `.input-grid`: 输入网格
- `.input-column`: 输入列
- `.input-group`: 输入组

### 按钮

- `.btn`: 基础按钮样式
- `.calc-btn`: 计算按钮（绿色）
- `.clear-btn`: 清除按钮（红色）
- `.reset-btn`: 重置按钮（蓝色）

### 标签页

- `.tabs`: 标签容器
- `.tab-btn`: 标签按钮
- `.tab-content`: 标签内容

### 结果展示

- `.results-section`: 结果区域
- `.results-wrapper`: 结果卡片包装器
- `.result-card`: 结果卡片
- `.results-table`: 结果表格

## 如何简化现有页面的样式

对于现有页面，可以按以下步骤简化并统一其样式：

1. 添加对全局样式的引用（放在自身样式表之前）
2. 从页面样式表中删除所有已在全局样式中定义的样式
3. 保留页面特有的样式定义
4. 检查并确保页面在样式整合后仍然正常显示

## 最佳实践

1. **始终使用变量**：使用 `var(--variable-name)` 而不是硬编码颜色和大小
2. **遵循组件命名规范**：使用统一的类名命名规则
3. **保持一致的间距**：使用相同的间距值（如 margin 和 padding）
4. **使用语义化的HTML结构**：确保HTML结构清晰、语义化
5. **响应式设计**：确保所有页面在不同设备上显示正常

## 常见问题解决

### 样式冲突

如果页面特定样式与全局样式冲突，可以通过以下方法解决：

1. 增加CSS选择器的特异性
2. 在页面样式中使用 `!important`（谨慎使用）
3. 调整样式引入顺序

### 不显示新样式

如果新样式没有生效，可能是：

1. 浏览器缓存问题（尝试强制刷新或清除缓存）
2. 样式表加载顺序问题
3. CSS选择器特异性不足

## 检查清单

实施全局样式后，使用以下检查清单确保一切正常：

- [ ] 所有页面都链接了全局样式表
- [ ] 页面特定样式只包含必要的覆盖和独特样式
- [ ] 所有页面在桌面和移动设备上都能正常显示
- [ ] 检查控制台是否有与样式相关的错误
- [ ] 确认所有页面元素使用了正确的样式类 