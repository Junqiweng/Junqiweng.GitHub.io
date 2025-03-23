// ... [保持前面的代码不变直到 results.forEach] ...

    results.forEach((result) => {
        const value = formatNumber(result.value);
        let indication = '';
        if (results.length > 1) {
            if (result.value === minValue) indication = '<span class="min-value">▼ 最小</span>';
            if (result.value === maxValue) indication = '<span class="max-value">▲ 最大</span>';
        }
        
        output += `
        <tr>
            <td>
                ${result.name}
                <a href="#" class="info-link correlation-info" data-formula="${result.id}" title="查看公式">ℹ️</a>
            </td>
            <td class="value-column">
                <div class="value-with-unit">
                    <span class="value-number">${value}</span>
                    <span class="value-unit">W/m·K</span>
                    ${indication}
                </div>
            </td>
        </tr>`;
    });

// ... [保持其他代码不变] ...

// 添加公式信息对象
const formulaInfo = {
    zehner_schlunder: {
        title: "Zehner-Schlünder 有效导热系数模型",
        formula: `\\[ \\lambda_{eff} = \\lambda_f \\left[ 1 - \\sqrt{1-\\varepsilon} + \\frac{\\sqrt{1-\\varepsilon}}{\\frac{\\lambda_s}{\\lambda_f}\\phi + \\frac{2}{3}} \\right] \\]
\\[ \\phi = 1 - \\frac{B}{N}\\ln\\left(\\frac{B+N}{B}\\right) \\]
\\[ B = 1.25\\left(\\frac{1-\\varepsilon}{\\varepsilon}\\right)^{10/9} \\]
\\[ N = \\frac{\\lambda_s}{\\lambda_f} \\]`,
        parameters: [
            ["\\lambda_{eff}", "有效导热系数", "固定床中固体和流体综合的有效导热系数"],
            ["\\lambda_f", "流体导热系数", "床层中流体的热导率"],
            ["\\lambda_s", "固体导热系数", "床层中固体颗粒的热导率"],
            ["\\varepsilon", "床层空隙率", "床层中空隙体积与总体积的比值"],
            ["\\phi", "形状因子", "描述颗粒形状和排列的参数"],
            ["B", "结构参数", "与床层结构有关的几何参数"],
            ["N", "导热比", "固体与流体导热系数的比值"]
        ],
        theory: `<p><strong>Zehner-Schlünder模型</strong>是固定床导热研究中的重要模型，由Zehner和Schlünder在1970年提出。</p>
        <p>关键特点：</p>
        <ul>
            <li>考虑了颗粒间接触热阻</li>
            <li>适用于低雷诺数流动区域</li>
            <li>考虑了辐射传热的影响</li>
            <li>适用于各种颗粒形状</li>
        </ul>
        <p>该模型将床层视为由单元体组成，每个单元体包含流体相和固体相，通过形状因子来考虑不同的传热路径。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">床层空隙率：0.36 - 0.48</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">导热比(λs/λf)：10 - 10,000</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于球形和非球形颗粒</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">参考文献：Zehner, P., & Schlünder, E. U. (1970)</span>
    </div>
</div>`
    },
    krupiczka: {
        title: "Krupiczka 有效导热系数方程",
        formula: `\\[ \\lambda_{eff} = \\lambda_f \\left( \\frac{\\lambda_s}{\\lambda_f} \\right)^n \\]
\\[ n = (0.280 - 0.757\\log_{10}\\varepsilon) \\cdot (0.057\\log_{10}(\\lambda_s/\\lambda_f)) \\]`,
        parameters: [
            ["\\lambda_{eff}", "有效导热系数", "固定床中固体和流体综合的有效导热系数"],
            ["\\lambda_f", "流体导热系数", "床层中流体的热导率"],
            ["\\lambda_s", "固体导热系数", "床层中固体颗粒的热导率"],
            ["\\varepsilon", "床层空隙率", "床层中空隙体积与总体积的比值"],
            ["n", "经验指数", "由空隙率和导热比确定的经验指数"]
        ],
        theory: `<p><strong>Krupiczka方程</strong>是一种经典的有效导热系数关联式，由Krupiczka在1967年提出。</p>
        <p>关键特点：</p>
        <ul>
            <li>简单的幂函数形式</li>
            <li>经验性关联式，基于实验数据</li>
            <li>便于工程应用</li>
            <li>在中等导热比范围内精度较高</li>
        </ul>
        <p>该方程是通过拟合大量实验数据得到的，适用于常见工程条件下的有效导热系数估算。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">床层空隙率：0.4 - 0.5</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">导热比(λs/λf)：10 - 2,000</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于球形和近似球形颗粒</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">参考文献：Krupiczka, R. (1967)</span>
    </div>
</div>`
    },
    woodside_messmer: {
        title: "Woodside-Messmer 有效导热系数模型",
        formula: `\\[ \\lambda_{eff} = \\lambda_f \\varepsilon + \\lambda_s (1-\\varepsilon) \\sqrt{\\frac{\\lambda_f}{\\lambda_s}} \\]`,
        parameters: [
            ["\\lambda_{eff}", "有效导热系数", "固定床中固体和流体综合的有效导热系数"],
            ["\\lambda_f", "流体导热系数", "床层中流体的热导率"],
            ["\\lambda_s", "固体导热系数", "床层中固体颗粒的热导率"],
            ["\\varepsilon", "床层空隙率", "床层中空隙体积与总体积的比值"]
        ],
        theory: `<p><strong>Woodside-Messmer模型</strong>是一种基于并联导热路径概念的方程，由Woodside和Messmer在1961年提出。</p>
        <p>关键特点：</p>
        <ul>
            <li>采用平行通路模型</li>
            <li>考虑了流体和固体的并联导热</li>
            <li>形式简单，易于应用</li>
            <li>适用于中等范围的导热比</li>
        </ul>
        <p>该模型假设热量沿着流体相和固体相的并联路径传递，是床层导热计算中的一种简化方法。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">床层空隙率：0.3 - 0.6</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">导热比(λs/λf)：5 - 500</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于低压系统</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">参考文献：Woodside, W., & Messmer, J. H. (1961)</span>
    </div>
</div>`
    }
};

// DOM元素
const modal = document.getElementById('formulaModal');
const formulaDetail = document.getElementById('formulaDetail');
const closeModalBtn = document.querySelector('.modal-close');
const loadingOverlay = document.getElementById('loading-overlay');

// 模态框功能
function showModal() {
    modal.style.display = "block";
    
    // 关注可访问性
    setTimeout(() => {
        // 重新渲染数学公式
        if (window.MathJax) {
            try {
                // 先尝试使用typesetPromise
                if (typeof MathJax.typesetPromise === 'function') {
                    MathJax.typesetPromise([formulaDetail]);
                } 
                // 如果没有typesetPromise方法，尝试使用typeset
                else if (typeof MathJax.typeset === 'function') {
                    MathJax.typeset([formulaDetail]);
                }
                // 如果两者都不存在，等待MathJax加载完成后再尝试渲染
                else if (typeof MathJax.startup !== 'undefined') {
                    MathJax.startup.promise.then(() => {
                        MathJax.typesetPromise([formulaDetail]);
                    });
                }
            } catch (error) {
                console.error('MathJax typesetting error:', error);
            }
        }
        
        // 聚焦第一个可交互元素
        const firstFocusable = modal.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) firstFocusable.focus();
    }, 100);
}

function closeModal() {
    modal.style.display = "none";
}

// 关闭模态框
closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// 键盘控制模态框
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// 加载MathJax
function loadMathJax() {
    if (window.MathJax) return;
    
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    script.async = true;
    document.head.appendChild(script);
}

// 使用事件委托处理公式信息链接点击
document.addEventListener('click', async (e) => {
    if (e.target.closest('.info-link')) {
        e.preventDefault();
        const link = e.target.closest('.info-link');
        const formula = link.getAttribute('data-formula');
        const info = formulaInfo[formula];
        
        if (info) {
            loadingOverlay.classList.add('show');
            
            // 使用新的HTML结构展示公式详情
            let content = `
                <div class="formula-detail">
                    <h4>${info.title}</h4>
                    
                    <div class="formula-section formula-main">
                        <h4>
                            <span class="section-icon">📐</span>
                            <span class="section-title">数学表达式</span>
                        </h4>
                        <div class="formula-math loading">
                            ${info.formula}
                            <div class="formula-overlay"></div>
                        </div>
                    </div>
                    
                    <div class="formula-section parameters-section">
                        <h4>
                            <span class="section-icon">📝</span>
                            <span class="section-title">参数说明</span>
                            <span class="param-count">${info.parameters ? info.parameters.length : 0}个参数</span>
                        </h4>
                        <table class="param-table">
                            <thead>
                                <tr>
                                    <th width="15%">符号</th>
                                    <th width="25%">参数</th>
                                    <th>说明</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${info.parameters ? info.parameters.map(([symbol, param, desc]) => `
                                    <tr>
                                        <td class="symbol-cell" title="数学符号"><em>${symbol}</em></td>
                                        <td class="param-cell" title="参数名称">${param}</td>
                                        <td class="desc-cell" title="详细说明">${desc}</td>
                                    </tr>
                                `).join('') : ''}
                            </tbody>
                        </table>
                    </div>

                    <div class="formula-section theory-section">
                        <h4>
                            <span class="section-icon">💡</span>
                            <span class="section-title">理论基础</span>
                        </h4>
                        <div class="theory-content">
                            <div class="theory-card">
                                ${info.theory || ''}
                            </div>
                        </div>
                    </div>

                    <div class="formula-section applicability-section">
                        <h4>
                            <span class="section-icon">📋</span>
                            <span class="section-title">适用条件</span>
                        </h4>
                        <div class="applicability-content">
                            <div class="conditions-list">
                                ${info.applicability || ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            formulaDetail.innerHTML = content;
            
            // 加载MathJax (如果尚未加载)
            if (typeof window.MathJax === 'undefined') {
                loadMathJax();
            }
            
            showModal();
            
            // 短暂延迟后隐藏加载覆盖层
            setTimeout(() => {
                loadingOverlay.classList.remove('show');
            }, 300);
        }
    }
});

// ... existing code ...
