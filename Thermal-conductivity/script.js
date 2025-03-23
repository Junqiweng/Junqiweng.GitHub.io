document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');

    // Loading indicator
    const loadingOverlay = document.getElementById('loading-overlay');
    const modal = document.getElementById('formulaModal');
    const modalClose = document.querySelector('.modal-close');
    const formulaDetail = document.getElementById('formulaDetail');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const calculateBtn = document.getElementById('calculate');
    const clearBtn = document.getElementById('clear');
    const resetBtn = document.getElementById('reset');
    const resultsSection = document.querySelector('.results-content');

    // Debug info
    console.log('Initial setup:', {
        loadingOverlay,
        modal,
        modalClose,
        formulaDetail,
        formulaLinks: document.querySelectorAll('.correlation-info')
    });

    // 添加按钮事件监听器
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            console.log('Calculate button clicked');
            calculateThermalConductivity();
        });
    } else {
        console.error('Calculate button not found');
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            console.log('Clear button clicked');
            clearInputs();
        });
    } else {
        console.error('Clear button not found');
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            console.log('Reset button clicked');
            resetToDefaults();
        });
    } else {
        console.error('Reset button not found');
    }

    // 添加标签切换功能
    tabBtns.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // 移除所有标签页的active类
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 为当前选中的标签和内容添加active类
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Check HTML structure
    const formulaLinks = document.querySelectorAll('.correlation-info');
    formulaLinks.forEach(link => {
        console.log('Formula link:', {
            element: link,
            formulaId: link.dataset.correlation,
            href: link.href
        });
    });

    // 添加公式详情数据
    const formulaDetails = {
        // 静态导热系数关联式
        yagi_kunii_static: {
            title: "Yagi-Kunii静态导热系数关联式",
            formula: "$$ k_0 = \\epsilon k_g + (1-\\epsilon) \\left[ \\frac{1}{\\frac{1}{k_s + k_r} + \\frac{1}{k_g}} \\right] $$",
            parameters: [
                ["k_0", "静态有效导热系数", "固定床在无流动状态下的导热系数"],
                ["k_g", "气体导热系数", "床层中流体的导热系数"],
                ["k_s", "固体导热系数", "颗粒的导热系数"],
                ["k_r", "辐射导热系数", "通常在高温下考虑，低温可忽略"],
                ["\\epsilon", "空隙率", "床层的孔隙度"]
            ],
            theory: `<p><strong>Yagi-Kunii模型</strong>考虑了通过气体和颗粒的传热，以及颗粒间接触的热阻。</p>
            <p>关键特点：</p>
            <ul>
                <li>将床层视为由流体和固体颗粒组成的复合介质</li>
                <li>考虑了气相和固相的并联和串联传热路径</li>
                <li>可以包含辐射传热的贡献(高温条件)</li>
            </ul>
            <p>这是最早发展的固定床导热模型之一，至今仍被广泛应用。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于多数固定床反应器的静态导热计算</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">特别适合催化剂颗粒床层</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于气固和液固系统</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">低温可忽略辐射导热部分</span>
    </div>
</div>`
        },
        zbs_static: {
            title: "ZBS(Zehner-Bauer-Schlünder)静态导热系数关联式",
            formula: "$$ k_0 = k_g \\left[ 1 - \\sqrt{1-\\epsilon} + \\sqrt{1-\\epsilon} \\cdot \\frac{2}{1-B/A} \\left( \\frac{(1-B/A)^{-1} \\ln(A/B) - 1}{(B/A)^2} \\right) \\right] $$",
            parameters: [
                ["k_0", "静态有效导热系数", "固定床在无流动状态下的导热系数"],
                ["k_g", "气体导热系数", "床层中流体的导热系数"],
                ["\\epsilon", "空隙率", "床层的孔隙度"],
                ["A", "形状因子", "与颗粒形状和排列有关"],
                ["B", "导热比", "固体与流体导热系数的比值 (k_s/k_g)"]
            ],
            theory: `<p><strong>ZBS模型</strong>是一种较为复杂但精确的静态导热模型，考虑了颗粒形状、接触点传热以及空隙率分布的影响。</p>
            <p>关键特点：</p>
            <ul>
                <li>将颗粒之间的空间分为串联和并联热传导单元</li>
                <li>考虑了颗粒形状对热传导的影响</li>
                <li>能处理较大导热系数比(k_s/k_g)的情况</li>
            </ul>
            <p>这个模型虽然计算复杂，但在精确预测固定床导热性能方面表现优异。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">广泛适用于各种颗粒形状的固定床</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适合较大导热系数比(k_s/k_g)的情况</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于大多数化工和反应工程系统</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">考虑了空隙率分布的影响</span>
    </div>
</div>`
        },
        
        // 轴向弥散系数关联式
        yagi_kunii_dispersion_axial: {
            title: "Yagi-Kunii轴向弥散系数关联式",
            formula: "$$ \\frac{k_{ea}}{k_0} = 1 + \\frac{Pe_p}{2} $$",
            parameters: [
                ["k_{ea}", "轴向有效导热系数", "考虑流动影响的轴向导热系数"],
                ["k_0", "静态有效导热系数", "无流动状态下的导热系数"],
                ["Pe_p", "颗粒佩克莱数", "颗粒尺度下的对流与传导比值 (Pe_p = Re_p·Pr)"]
            ],
            theory: `<p><strong>Yagi-Kunii轴向弥散关联式</strong>基于静态导热和流动引起的弥散效应的叠加。</p>
            <p>关键特点：</p>
            <ul>
                <li>将轴向导热分为静态部分和流动部分</li>
                <li>佩克莱数表示对流传热与导热的比值</li>
                <li>系数1/2表示流动对轴向传热的增强效应</li>
            </ul>
            <p>这是一个经典模型，形式简单但物理意义明确，广泛应用于反应器工程。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于低雷诺数(Re_p < 100)的层流区域</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适合中等颗粒尺寸的固定床</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">气固系统有较好的预测能力</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于轴向温度梯度明显的系统</span>
    </div>
</div>`
        },
        vortmeyer_dispersion_axial: {
            title: "Vortmeyer轴向弥散系数关联式",
            formula: "$$ \\frac{k_{ea}}{k_g} = \\epsilon + 0.75 \\cdot Pr \\cdot Re_p $$",
            parameters: [
                ["k_{ea}", "轴向有效导热系数", "考虑流动影响的轴向导热系数"],
                ["k_g", "气体导热系数", "床层中流体的导热系数"],
                ["\\epsilon", "空隙率", "床层的孔隙度"],
                ["Pr", "普朗特数", "流体的动量扩散与热扩散的比值"],
                ["Re_p", "颗粒雷诺数", "基于颗粒直径的雷诺数"]
            ],
            theory: `<p><strong>Vortmeyer关联式</strong>直接将轴向有效导热系数与流体导热系数关联，结构简单明了。</p>
            <p>关键特点：</p>
            <ul>
                <li>考虑空隙率作为静态导热的贡献</li>
                <li>雷诺数与普朗特数的乘积表示流动的影响</li>
                <li>系数0.75反映了流动混合的强度</li>
            </ul>
            <p>这种简化形式在工程计算中很实用，尤其适合于初步设计阶段。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于中高雷诺数区域(10 < Re_p < 1000)</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">对于气固系统有较好的预测能力</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">计算简单，工程应用方便</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于空隙率0.3-0.5的常规填充床</span>
    </div>
</div>`
        },
        edwards_axial: {
            title: "Edwards轴向弥散系数关联式",
            formula: "$$ \\frac{k_{ea}}{k_g} = \\frac{k_0}{k_g} + 0.5 \\cdot Re_p \\cdot Pr $$",
            parameters: [
                ["k_{ea}", "轴向有效导热系数", "考虑流动影响的轴向导热系数"],
                ["k_g", "气体导热系数", "床层中流体的导热系数"],
                ["k_0", "静态有效导热系数", "无流动状态下的导热系数"],
                ["Re_p", "颗粒雷诺数", "基于颗粒直径的雷诺数"],
                ["Pr", "普朗特数", "流体的动量扩散与热扩散的比值"]
            ],
            theory: `<p><strong>Edwards关联式</strong>在静态导热系数的基础上，加入了与流体流动相关的贡献项。</p>
            <p>关键特点：</p>
            <ul>
                <li>明确区分了静态导热和流动导热的贡献</li>
                <li>系数0.5表示流动混合对轴向传热的增强</li>
                <li>结合了静态传热模型和对流传热模型</li>
            </ul>
            <p>形式简单但适用性较广，是反应器设计中常用的轴向导热模型。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用范围广，特别适合中等雷诺数(10 < Re_p < 500)</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">气固系统和液固系统均有良好的预测能力</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于催化剂填充床反应器</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">结合静态导热模型使用效果更佳</span>
    </div>
</div>`
        },
        
        // 径向弥散系数关联式
        yagi_kunii_dispersion_radial: {
            title: "Yagi-Kunii径向弥散系数关联式",
            formula: "$$ \\frac{k_{er}}{k_0} = 1 + \\frac{Pe_p}{10} $$",
            parameters: [
                ["k_{er}", "径向有效导热系数", "考虑流动影响的径向导热系数"],
                ["k_0", "静态有效导热系数", "无流动状态下的导热系数"],
                ["Pe_p", "颗粒佩克莱数", "颗粒尺度下的对流与传导比值 (Pe_p = Re_p·Pr)"]
            ],
            theory: `<p><strong>Yagi-Kunii径向弥散关联式</strong>表示径向导热系数受流动影响的程度。</p>
            <p>关键特点：</p>
            <ul>
                <li>与轴向关联式结构相似，但系数不同</li>
                <li>系数(1/10)小于轴向弥散系数(1/2)，表明径向弥散影响较小</li>
                <li>基于物理实验和理论分析得出</li>
            </ul>
            <p>这个关联式反映了固定床中径向导热通常比轴向导热弱的物理事实。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于低雷诺数(Re_p < 100)的层流区域</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">在气固固定床中有较好的预测能力</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于径向温度梯度存在的系统</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">与轴向模型配合使用效果更佳</span>
    </div>
</div>`
        },
        bauer_schlunder_dispersion: {
            title: "Bauer-Schlünder径向弥散系数关联式",
            formula: "$$ \\frac{k_{er}}{k_g} = 8 \\cdot \\left( \\frac{k_0}{k_g} \\right) + 0.1 \\cdot Re_p \\cdot Pr $$",
            parameters: [
                ["k_{er}", "径向有效导热系数", "考虑流动影响的径向导热系数"],
                ["k_g", "气体导热系数", "床层中流体的导热系数"],
                ["k_0", "静态有效导热系数", "无流动状态下的导热系数"],
                ["Re_p", "颗粒雷诺数", "基于颗粒直径的雷诺数"],
                ["Pr", "普朗特数", "流体的动量扩散与热扩散的比值"]
            ],
            theory: `<p><strong>Bauer-Schlünder关联式</strong>结合了静态导热和流体混合的贡献。</p>
            <p>关键特点：</p>
            <ul>
                <li>系数8表示静态导热在径向传热中的重要性</li>
                <li>系数0.1表示流体混合对径向传热的贡献</li>
                <li>形式与Edwards轴向关联式类似，但参数不同</li>
            </ul>
            <p>这个模型强调了在径向传热中，静态导热比流体混合更为重要。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于中高雷诺数区域(10 < Re_p < 2000)</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">对于大多数工业固定床反应器有较好的预测能力</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于气固和液固系统</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">特别适合径向热传递重要的大直径反应器</span>
    </div>
</div>`
        },
        peclet_radial: {
            title: "佩克莱数径向弥散系数关联式",
            formula: "$$ \\frac{k_{er}}{k_g} = \\frac{k_0}{k_g} + \\frac{Re_p \\cdot Pr}{Pe_r} $$",
            parameters: [
                ["k_{er}", "径向有效导热系数", "考虑流动影响的径向导热系数"],
                ["k_g", "气体导热系数", "床层中流体的导热系数"],
                ["k_0", "静态有效导热系数", "无流动状态下的导热系数"],
                ["Re_p", "颗粒雷诺数", "基于颗粒直径的雷诺数"],
                ["Pr", "普朗特数", "流体的动量扩散与热扩散的比值"],
                ["Pe_r", "径向佩克莱数", "径向混合特性参数，通常为8-12"]
            ],
            theory: `<p><strong>佩克莱数关联式</strong>基于佩克莱数的概念，将径向热扩散与流体流动和颗粒特性联系起来。</p>
            <p>关键特点：</p>
            <ul>
                <li>径向佩克莱数Pe_r是一个经验常数，表示径向混合的难易程度</li>
                <li>结合了静态导热和流动导热的贡献</li>
                <li>形式灵活，可通过调整Pe_r适应不同系统</li>
            </ul>
            <p>这个模型在反应器设计中广泛使用，特别是对于需要精确控制温度分布的系统。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">广泛适用于各种固定床系统</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">特别适用于气固系统</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">对于径向温度梯度明显的反应器设计非常有用</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">Pe_r参数可根据具体情况调整(通常取8-12)</span>
    </div>
</div>`
        }
    };

    // Add click handler to each formula link
    formulaLinks.forEach(link => {
        link.addEventListener('click', async function(e) {
            console.log('Link clicked:', this.dataset.correlation);
            e.preventDefault();
            e.stopPropagation();
            
            const formulaId = this.dataset.correlation;
            if (!formulaId) {
                console.error('No formula ID found');
                return;
            }

            console.log('Processing formula:', formulaId);
            if (!modal) {
                console.error('Modal element not found');
                return;
            }

            try {
                loadingOverlay?.classList.add('show');
                modal.style.display = "block";
                modal.classList.add('show');
                
                const formula = formulaDetails[formulaId];
                if (!formula) {
                    console.error('Formula not found:', formulaId);
                    return;
                }

                await showFormulaDetails(formulaId);
                
                // 确保MathJax完成渲染
                if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
                    try {
                    await MathJax.typesetPromise([modal]);
                        console.log('Modal MathJax typesetting complete');
                    } catch (error) {
                        console.error('Error in MathJax typesetting for modal:', error);
                    }
                }
            } catch (error) {
                console.error('Error showing formula:', error);
            } finally {
                loadingOverlay?.classList.remove('show');
            }
        });
    });

    // Modal handlers
    modalClose?.addEventListener('click', () => {
        console.log('Modal close clicked');
        hideModal();
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            console.log('Modal background clicked');
            hideModal();
        }
    });

    // Modal functions
    function showModal() {
        if (!modal) {
            console.error('Modal element not found in showModal');
            return;
        }
        console.log('Showing modal');
        modal.style.display = "block";
        modal.classList.add('show');
    }

    function hideModal() {
        if (!modal) {
            console.error('Modal element not found in hideModal');
            return;
        }
        console.log('Hiding modal');
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            if (formulaDetail) {
                formulaDetail.innerHTML = '';
            }
        }, 300);
    }

    // Formula details function
    async function showFormulaDetails(formulaId) {
        console.log('Showing formula details for:', formulaId);
        const formula = formulaDetails[formulaId];
        if (!formula) {
            console.error('Formula not found:', formulaId);
            return;
        }

        if (!formulaDetail) {
            console.error('Formula detail element not found');
            return;
        }

        let content = `
            <div class="formula-detail">
                <h4>${formula.title}</h4>
                
                <div class="formula-section formula-main">
                    <h4>
                        <span class="section-icon">📐</span>
                        <span class="section-title">数学表达式</span>
                    </h4>
                    <div class="formula-math loading" data-formula="${formulaId}">
                        ${formula.formula}
                        <div class="formula-overlay"></div>
                    </div>
                </div>
                
                <div class="formula-section parameters-section">
                    <h4>
                        <span class="section-icon">📝</span>
                        <span class="section-title">参数说明</span>
                        <span class="param-count">${formula.parameters.length}个参数</span>
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
                            ${formula.parameters.map(([symbol, param, desc]) => `
                                <tr>
                                    <td class="symbol-cell" title="数学符号">$${symbol}$</td>
                                    <td class="param-cell" title="参数名称">${param}</td>
                                    <td class="desc-cell" title="详细说明">${desc}</td>
                                </tr>
                            `).join('')}
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
                            ${formula.theory}
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
                            ${formula.applicability}
                        </div>
                        ${formula.parameters.length > 0 ? `
                        <div class="param-summary">
                            <span class="summary-label">所需参数：</span>
                            <span class="param-count">${formula.parameters.length}</span>
                        </div>` : ''}
                    </div>
                </div>
            </div>
        `;

        formulaDetail.innerHTML = content;
        
        // 确保MathJax处理所有表格内容
        if (window.MathJax) {
            try {
                console.log('Typesetting formula with MathJax');
                    await MathJax.typesetPromise([formulaDetail]);
                console.log('MathJax typesetting complete');
                
                // 移除loading效果
                const formulaMath = formulaDetail.querySelector('.formula-math');
                if (formulaMath) {
                    formulaMath.classList.remove('loading');
                }
            } catch (error) {
                console.error('MathJax typesetting error:', error);
            }
        } else {
            console.warn('MathJax not available');
        }
    }

    // 清除所有输入字段
    function clearInputs() {
        console.log('Clearing all inputs');
        const inputs = document.querySelectorAll('input[type="number"], input[type="text"]');
        inputs.forEach(input => {
            if (input.id !== 'void_fraction') {
                input.value = '';
            } else {
                // 空隙率保持在合理范围内
                input.value = '0.4';
            }
        });
        
        // 重置结果区域
        if (resultsSection) {
            resultsSection.innerHTML = `
                <div class="result-text">
                    📊 输入已清除<br><br>
                    请输入新的参数并点击'✨ 计算传递系数 ✨'按钮开始计算<br><br>
                </div>
            `;
        }
    }

    // 重置为默认值
    function resetToDefaults() {
        console.log('Resetting to default values');
        
        // 设置默认值
        const defaultValues = {
            'particle_diameter': '0.006',
            'void_fraction': '0.4',
            'solid_thermal_conductivity': '20',
            'fluid_velocity': '1',
            'fluid_thermal_conductivity': '0.0257',
            'fluid_density': '1.225',
            'fluid_viscosity': '1.81e-5',
            'fluid_heat_capacity': '1005'
        };
        
        // 应用默认值
        Object.keys(defaultValues).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = defaultValues[id];
            } else {
                console.warn(`Element with id ${id} not found`);
            }
        });
        
        // 重置结果区域
        if (resultsSection) {
            resultsSection.innerHTML = `
                <div class="result-text">
                    📊 已重置为默认值<br><br>
                    请点击'✨ 计算传递系数 ✨'按钮开始计算<br><br>
                </div>
            `;
        }
        
        // 重新选中所有关联式
        const correlationChecks = document.querySelectorAll('.correlation-item input[type="checkbox"]');
        correlationChecks.forEach(checkbox => {
            checkbox.checked = true;
        });
    }

    // 计算导热系数
    function calculateThermalConductivity() {
        console.log('Calculating thermal conductivity');
        
        try {
            // 显示加载指示器
            loadingOverlay?.classList.add('show');
            
            // 获取输入值
            const inputs = {
                particleDiameter: getInputValue('particle_diameter'),
                voidFraction: getInputValue('void_fraction'),
                solidThermalConductivity: getInputValue('solid_thermal_conductivity'),
                fluidVelocity: getInputValue('fluid_velocity'),
                fluidThermalConductivity: getInputValue('fluid_thermal_conductivity'),
                fluidDensity: getInputValue('fluid_density'),
                fluidViscosity: getInputValue('fluid_viscosity', true),
                fluidHeatCapacity: getInputValue('fluid_heat_capacity')
            };
            
            // 验证输入
            for (const [key, value] of Object.entries(inputs)) {
                if (isNaN(value) || value <= 0) {
                    throw new Error(`${key} 输入无效，请输入大于0的数值`);
                }
            }
            
            // 获取选中的关联式
            const selectedCorrelations = {
                static: [],
                axial: [],
                radial: []
            };
            
            // 静态导热
            if (document.getElementById('yagi_kunii_static').checked) {
                selectedCorrelations.static.push('yagi_kunii_static');
            }
            if (document.getElementById('zbs_static').checked) {
                selectedCorrelations.static.push('zbs_static');
            }
            
            // 轴向弥散
            if (document.getElementById('yagi_kunii_dispersion_axial').checked) {
                selectedCorrelations.axial.push('yagi_kunii_dispersion_axial');
            }
            if (document.getElementById('vortmeyer_dispersion_axial').checked) {
                selectedCorrelations.axial.push('vortmeyer_dispersion_axial');
            }
            if (document.getElementById('edwards_axial').checked) {
                selectedCorrelations.axial.push('edwards_axial');
            }
            
            // 径向弥散
            if (document.getElementById('yagi_kunii_dispersion_radial').checked) {
                selectedCorrelations.radial.push('yagi_kunii_dispersion_radial');
            }
            if (document.getElementById('bauer_schlunder_dispersion').checked) {
                selectedCorrelations.radial.push('bauer_schlunder_dispersion');
            }
            if (document.getElementById('peclet_radial').checked) {
                selectedCorrelations.radial.push('peclet_radial');
            }
            
            // 计算中间变量
            const Re = calculateReynolds(inputs);
            const Pr = calculatePrandtl(inputs);
            const Pe = Re * Pr;
            
            // 计算结果
            const results = {
                re: Re.toFixed(2),
                pr: Pr.toFixed(2),
                pe: Pe.toFixed(2),
                static: calculateStaticConductivity(inputs, selectedCorrelations.static),
                axial: calculateAxialConductivity(inputs, selectedCorrelations.axial, Re, Pr),
                radial: calculateRadialConductivity(inputs, selectedCorrelations.radial, Re, Pr)
            };
            
            // 显示结果
            displayResults(results);
            
            // 切换到结果选项卡
            document.querySelector('[data-tab="results"]').click();
            
            } catch (error) {
            console.error('Calculation error:', error);
            alert('计算错误: ' + error.message);
        } finally {
            // 隐藏加载指示器
            loadingOverlay?.classList.remove('show');
        }
    }
    
    // 获取输入值
    function getInputValue(id, isScientific = false) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id ${id} not found`);
            return NaN;
        }
        
        let value = element.value.trim();
        
        if (isScientific) {
            // 处理科学计数法, 如 "1.81e-5"
            return Number(value);
        } else {
            return parseFloat(value);
        }
    }
    
    // 计算雷诺数
    function calculateReynolds(inputs) {
        const { particleDiameter, fluidVelocity, fluidDensity, fluidViscosity } = inputs;
        return (fluidDensity * fluidVelocity * particleDiameter) / fluidViscosity;
    }
    
    // 计算普朗特数
    function calculatePrandtl(inputs) {
        const { fluidViscosity, fluidHeatCapacity, fluidThermalConductivity } = inputs;
        return (fluidViscosity * fluidHeatCapacity) / fluidThermalConductivity;
    }
    
    // 计算静态导热系数
    function calculateStaticConductivity(inputs, correlations) {
        const results = {};
        
        if (correlations.includes('yagi_kunii_static')) {
            // Yagi-Kunii 静态导热
            const { voidFraction, fluidThermalConductivity, solidThermalConductivity } = inputs;
            const k_r = 0; // 低温下辐射导热忽略
            const k0_yagi = voidFraction * fluidThermalConductivity + 
                    (1 - voidFraction) * (1 / ((1 / (solidThermalConductivity + k_r)) + (1 / fluidThermalConductivity)));
            results['yagi_kunii_static'] = k0_yagi.toFixed(4);
        }
        
        if (correlations.includes('zbs_static')) {
            // ZBS 静态导热
            const { voidFraction, fluidThermalConductivity, solidThermalConductivity } = inputs;
            const B = solidThermalConductivity / fluidThermalConductivity;
            const A = 10; // 典型形状因子
            
            // 简化后的ZBS公式
            const term1 = 1 - Math.sqrt(1 - voidFraction);
            const term2 = Math.sqrt(1 - voidFraction);
            const term3 = 2 / (1 - B / A);
            const term4 = ((1 / (1 - B / A)) * Math.log(A / B) - 1) / Math.pow(B / A, 2);
            const k0_zbs = fluidThermalConductivity * (term1 + term2 * term3 * term4);
            
            results['zbs_static'] = k0_zbs.toFixed(4);
        }
        
        // 计算平均值
        if (Object.keys(results).length > 0) {
            const sum = Object.values(results).reduce((acc, val) => acc + parseFloat(val), 0);
            results['average'] = (sum / Object.keys(results).length).toFixed(4);
        }
        
        return results;
    }
    
    // 计算轴向导热系数
    function calculateAxialConductivity(inputs, correlations, Re, Pr) {
        const results = {};
        const { voidFraction, fluidThermalConductivity } = inputs;
        const Pe = Re * Pr;
        const staticResults = calculateStaticConductivity(inputs, ['yagi_kunii_static', 'zbs_static']);
        const k0 = parseFloat(staticResults['average']);
        
        if (correlations.includes('yagi_kunii_dispersion_axial')) {
            // Yagi-Kunii 轴向弥散
            const kea_yagi = k0 * (1 + Pe / 2);
            results['yagi_kunii_dispersion_axial'] = kea_yagi.toFixed(4);
        }
        
        if (correlations.includes('vortmeyer_dispersion_axial')) {
            // Vortmeyer 轴向弥散
            const kea_vortmeyer = fluidThermalConductivity * (voidFraction + 0.75 * Pr * Re);
            results['vortmeyer_dispersion_axial'] = kea_vortmeyer.toFixed(4);
        }
        
        if (correlations.includes('edwards_axial')) {
            // Edwards 轴向弥散
            const kea_edwards = fluidThermalConductivity * (k0 / fluidThermalConductivity + 0.5 * Re * Pr);
            results['edwards_axial'] = kea_edwards.toFixed(4);
        }
        
        // 计算平均值
        if (Object.keys(results).length > 0) {
            const sum = Object.values(results).reduce((acc, val) => acc + parseFloat(val), 0);
            results['average'] = (sum / Object.keys(results).length).toFixed(4);
        }
        
        return results;
    }
    
    // 计算径向导热系数
    function calculateRadialConductivity(inputs, correlations, Re, Pr) {
        const results = {};
        const { fluidThermalConductivity } = inputs;
        const Pe = Re * Pr;
        const staticResults = calculateStaticConductivity(inputs, ['yagi_kunii_static', 'zbs_static']);
        const k0 = parseFloat(staticResults['average']);
        
        if (correlations.includes('yagi_kunii_dispersion_radial')) {
            // Yagi-Kunii 径向弥散
            const ker_yagi = k0 * (1 + Pe / 10);
            results['yagi_kunii_dispersion_radial'] = ker_yagi.toFixed(4);
        }
        
        if (correlations.includes('bauer_schlunder_dispersion')) {
            // Bauer-Schlunder 径向弥散
            const ker_bauer = fluidThermalConductivity * (8 * (k0 / fluidThermalConductivity) + 0.1 * Re * Pr);
            results['bauer_schlunder_dispersion'] = ker_bauer.toFixed(4);
        }
        
        if (correlations.includes('peclet_radial')) {
            // 佩克莱数径向弥散
            const Pe_r = 10; // 典型值
            const ker_pe = fluidThermalConductivity * (k0 / fluidThermalConductivity + (Re * Pr) / Pe_r);
            results['peclet_radial'] = ker_pe.toFixed(4);
        }
        
        // 计算平均值
        if (Object.keys(results).length > 0) {
            const sum = Object.values(results).reduce((acc, val) => acc + parseFloat(val), 0);
            results['average'] = (sum / Object.keys(results).length).toFixed(4);
        }
        
        return results;
    }
    
    // 显示计算结果
    function displayResults(results) {
        console.log('Displaying results:', results);
        
        if (!resultsSection) {
            console.error('Results section not found');
            return;
        }
        
        // 获取输入值
        const inputs = {
            particleDiameter: getInputValue('particle_diameter'),
            voidFraction: getInputValue('void_fraction'),
            solidThermalConductivity: getInputValue('solid_thermal_conductivity'),
            fluidVelocity: getInputValue('fluid_velocity'),
            fluidThermalConductivity: getInputValue('fluid_thermal_conductivity'),
            fluidDensity: getInputValue('fluid_density'),
            fluidViscosity: getInputValue('fluid_viscosity', true),
            fluidHeatCapacity: getInputValue('fluid_heat_capacity')
        };
        
        // 构建结果HTML
        let html = `
        <div class="results-wrapper">
            <div class="result-card condition-card">
                <div class="section-header">
                    <span class="section-icon">📝</span>
                    <span class="section-title">操作条件</span>
                </div>
                <table class="results-table">
                    <tr><th>参数</th><th>数值</th></tr>
                    <tr>
                        <td>颗粒直径</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(inputs.particleDiameter)}</span>
                                <span class="value-unit">m</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>空隙率</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(inputs.voidFraction)}</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>固体颗粒导热系数</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(inputs.solidThermalConductivity)}</span>
                                <span class="value-unit">W/m·K</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>流体表观速度</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(inputs.fluidVelocity)}</span>
                                <span class="value-unit">m/s</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>流体导热系数</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(inputs.fluidThermalConductivity)}</span>
                                <span class="value-unit">W/m·K</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>流体密度</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(inputs.fluidDensity)}</span>
                                <span class="value-unit">kg/m³</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>流体黏度</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(inputs.fluidViscosity)}</span>
                                <span class="value-unit">Pa·s</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>流体比热容</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(inputs.fluidHeatCapacity)}</span>
                                <span class="value-unit">J/kg·K</span>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>

            <div class="result-card parameters-card">
                <div class="section-header">
                    <span class="section-icon">📊</span>
                    <span class="section-title">无量纲参数</span>
                </div>
                <table class="results-table">
                    <tr>
                        <th>参数</th>
                        <th>数值</th>
                    </tr>
                    <tr>
                        <td>颗粒雷诺数 (Re<sub>p</sub>)</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${results.re}</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>普朗特数 (Pr)</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${results.pr}</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>颗粒佩克莱数 (Pe<sub>p</sub>)</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${results.pe}</span>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            
            <div class="result-card static-card">
                <div class="section-header">
                    <span class="section-icon">🔷</span>
                    <span class="section-title">静态导热系数 (W/m·K)</span>
                </div>
                <table class="results-table">
                    <tr>
                        <th>关联式</th>
                        <th>数值</th>
                    </tr>
        `;
        
        // 获取静态导热系数的最大值和最小值
        const staticValues = Object.entries(results.static)
            .filter(([key]) => key !== 'average')
            .map(([_, value]) => parseFloat(value));
        const staticMinValue = Math.min(...staticValues);
        const staticMaxValue = Math.max(...staticValues);
        
        // 添加静态导热系数结果
        Object.entries(results.static).forEach(([key, value]) => {
            if (key === 'average') {
                html += `
                    <tr class="average-row">
                        <td><strong>平均值</strong></td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number"><strong>${value}</strong></span>
                                <span class="value-unit">W/m·K</span>
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                const correlationName = key === 'yagi_kunii_static' ? 'Yagi-Kunii静态导热' : 'ZBS静态导热';
                let indication = '';
                let badgeClass = '';
                
                if (staticValues.length > 1) {
                    if (parseFloat(value) === staticMinValue) {
                        indication = '最小值';
                        badgeClass = 'min-badge';
                    }
                    if (parseFloat(value) === staticMaxValue) {
                        indication = '最大值';
                        badgeClass = 'max-badge';
                    }
                }
                
                html += `
                    <tr>
                        <td>
                            <div class="equation-name">
                                ${correlationName}
                                <a href="#" class="info-link correlation-info" data-correlation="${key}" title="查看公式">ℹ️</a>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${value}</span>
                                <span class="value-unit">W/m·K</span>
                                ${indication ? `<span class="result-badge ${badgeClass}">${indication}</span>` : ''}
                            </div>
                        </td>
                    </tr>
                `;
            }
        });
        
        html += `
                </table>
            </div>
            
            <div class="result-card axial-card">
                <div class="section-header">
                    <span class="section-icon">⬆️</span>
                    <span class="section-title">轴向有效导热系数 (W/m·K)</span>
                </div>
                <table class="results-table">
                    <tr>
                        <th>关联式</th>
                        <th>数值</th>
                    </tr>
        `;
        
        // 获取轴向导热系数的最大值和最小值
        const axialValues = Object.entries(results.axial)
            .filter(([key]) => key !== 'average')
            .map(([_, value]) => parseFloat(value));
        const axialMinValue = Math.min(...axialValues);
        const axialMaxValue = Math.max(...axialValues);
        
        // 添加轴向导热系数结果
        Object.entries(results.axial).forEach(([key, value]) => {
            if (key === 'average') {
                html += `
                    <tr class="average-row">
                        <td><strong>平均值</strong></td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number"><strong>${value}</strong></span>
                                <span class="value-unit">W/m·K</span>
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                let correlationName = '';
                switch(key) {
                    case 'yagi_kunii_dispersion_axial':
                        correlationName = 'Yagi-Kunii轴向弥散';
                        break;
                    case 'vortmeyer_dispersion_axial':
                        correlationName = 'Vortmeyer轴向弥散';
                        break;
                    case 'edwards_axial':
                        correlationName = 'Edwards轴向弥散';
                        break;
                }
                
                let indication = '';
                let badgeClass = '';
                
                if (axialValues.length > 1) {
                    if (parseFloat(value) === axialMinValue) {
                        indication = '最小值';
                        badgeClass = 'min-badge';
                    }
                    if (parseFloat(value) === axialMaxValue) {
                        indication = '最大值';
                        badgeClass = 'max-badge';
                    }
                }
                
                html += `
                    <tr>
                        <td>
                            <div class="equation-name">
                                ${correlationName}
                                <a href="#" class="info-link correlation-info" data-correlation="${key}" title="查看公式">ℹ️</a>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${value}</span>
                                <span class="value-unit">W/m·K</span>
                                ${indication ? `<span class="result-badge ${badgeClass}">${indication}</span>` : ''}
                            </div>
                        </td>
                    </tr>
                `;
            }
        });
        
        html += `
                </table>
        `;
        
        // 如果有多个轴向结果，添加图表
        if (axialValues.length > 1) {
            const axialDifference = (axialMaxValue - axialMinValue).toFixed(4);
            const axialAvgValue = (axialValues.reduce((a, b) => a + b, 0) / axialValues.length).toFixed(4);
            const axialPercentDiff = ((axialMaxValue - axialMinValue) / parseFloat(axialAvgValue) * 100).toFixed(2);
            
            html += `
                <div class="result-chart">
                    <div class="chart-title">轴向导热系数结果图示比较</div>
                    <div class="bar-chart">
            `;
            
            Object.entries(results.axial).forEach(([key, value]) => {
                if (key !== 'average') {
                    let correlationName = '';
                    switch(key) {
                        case 'yagi_kunii_dispersion_axial':
                            correlationName = 'Yagi-Kunii轴向弥散';
                            break;
                        case 'vortmeyer_dispersion_axial':
                            correlationName = 'Vortmeyer轴向弥散';
                            break;
                        case 'edwards_axial':
                            correlationName = 'Edwards轴向弥散';
                            break;
                    }
                    
                    const percent = (parseFloat(value) / axialMaxValue * 100).toFixed(1);
                    let barClass = "";
                    if (parseFloat(value) === axialMinValue) barClass = "min-bar";
                    if (parseFloat(value) === axialMaxValue) barClass = "max-bar";
                    
                    html += `
                        <div class="chart-row">
                            <div class="chart-label">${correlationName}</div>
                            <div class="chart-bar-container">
                                <div class="chart-bar ${barClass}" style="width: ${percent}%;">
                                    <span class="bar-value">${value}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }
            });
            
            html += `
                    </div>
                </div>
                
                <table class="results-table">
                    <tr>
                        <td>最大差异（最大值与最小值之差）</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${axialDifference}</span>
                                <span class="value-unit">W/m·K</span>
                                <span class="percentage">(差异率: ${axialPercentDiff}%)</span>
                            </div>
                        </td>
                    </tr>
                </table>
            `;
        }
        
        html += `
            </div>
            
            <div class="result-card radial-card">
                <div class="section-header">
                    <span class="section-icon">↔️</span>
                    <span class="section-title">径向有效导热系数 (W/m·K)</span>
                </div>
                <table class="results-table">
                    <tr>
                        <th>关联式</th>
                        <th>数值</th>
                    </tr>
        `;
        
        // 获取径向导热系数的最大值和最小值
        const radialValues = Object.entries(results.radial)
            .filter(([key]) => key !== 'average')
            .map(([_, value]) => parseFloat(value));
        const radialMinValue = Math.min(...radialValues);
        const radialMaxValue = Math.max(...radialValues);
        
        // 添加径向导热系数结果
        Object.entries(results.radial).forEach(([key, value]) => {
            if (key === 'average') {
                html += `
                    <tr class="average-row">
                        <td><strong>平均值</strong></td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number"><strong>${value}</strong></span>
                                <span class="value-unit">W/m·K</span>
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                let correlationName = '';
                switch(key) {
                    case 'yagi_kunii_dispersion_radial':
                        correlationName = 'Yagi-Kunii径向弥散';
                        break;
                    case 'bauer_schlunder_dispersion':
                        correlationName = 'Bauer-Schlunder弥散';
                        break;
                    case 'peclet_radial':
                        correlationName = '佩克莱数径向弥散';
                        break;
                }
                
                let indication = '';
                let badgeClass = '';
                
                if (radialValues.length > 1) {
                    if (parseFloat(value) === radialMinValue) {
                        indication = '最小值';
                        badgeClass = 'min-badge';
                    }
                    if (parseFloat(value) === radialMaxValue) {
                        indication = '最大值';
                        badgeClass = 'max-badge';
                    }
                }
                
                html += `
                    <tr>
                        <td>
                            <div class="equation-name">
                                ${correlationName}
                                <a href="#" class="info-link correlation-info" data-correlation="${key}" title="查看公式">ℹ️</a>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${value}</span>
                                <span class="value-unit">W/m·K</span>
                                ${indication ? `<span class="result-badge ${badgeClass}">${indication}</span>` : ''}
                            </div>
                        </td>
                    </tr>
                `;
            }
        });
        
        html += `
                </table>
        `;
        
        // 如果有多个径向结果，添加图表
        if (radialValues.length > 1) {
            const radialDifference = (radialMaxValue - radialMinValue).toFixed(4);
            const radialAvgValue = (radialValues.reduce((a, b) => a + b, 0) / radialValues.length).toFixed(4);
            const radialPercentDiff = ((radialMaxValue - radialMinValue) / parseFloat(radialAvgValue) * 100).toFixed(2);
            
            html += `
                <div class="result-chart">
                    <div class="chart-title">径向导热系数结果图示比较</div>
                    <div class="bar-chart">
            `;
            
            Object.entries(results.radial).forEach(([key, value]) => {
                if (key !== 'average') {
                    let correlationName = '';
                    switch(key) {
                        case 'yagi_kunii_dispersion_radial':
                            correlationName = 'Yagi-Kunii径向弥散';
                            break;
                        case 'bauer_schlunder_dispersion':
                            correlationName = 'Bauer-Schlunder弥散';
                            break;
                        case 'peclet_radial':
                            correlationName = '佩克莱数径向弥散';
                            break;
                    }
                    
                    const percent = (parseFloat(value) / radialMaxValue * 100).toFixed(1);
                    let barClass = "";
                    if (parseFloat(value) === radialMinValue) barClass = "min-bar";
                    if (parseFloat(value) === radialMaxValue) barClass = "max-bar";
                    
                    html += `
                        <div class="chart-row">
                            <div class="chart-label">${correlationName}</div>
                            <div class="chart-bar-container">
                                <div class="chart-bar ${barClass}" style="width: ${percent}%;">
                                    <span class="bar-value">${value}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }
            });
            
            html += `
                    </div>
                </div>
                
                <table class="results-table">
                    <tr>
                        <td>最大差异（最大值与最小值之差）</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${radialDifference}</span>
                                <span class="value-unit">W/m·K</span>
                                <span class="percentage">(差异率: ${radialPercentDiff}%)</span>
                            </div>
                        </td>
                    </tr>
                </table>
            `;
        }
        
        html += `
            </div>
            
            <div class="result-card summary-card">
                <div class="section-header">
                    <span class="section-icon">📋</span>
                    <span class="section-title">计算结果总结</span>
                </div>
                <div class="calculation-summary">
                    <p>✨ 计算完成! 轴向有效导热系数平均值: <strong>${results.axial.average}</strong> W/m·K</p>
                    <p>✨ 径向有效导热系数平均值: <strong>${results.radial.average}</strong> W/m·K</p>
                </div>
            </div>
        </div>
        <div class="completion-message">✅ 计算完成！✨</div>
        `;
        
        resultsSection.innerHTML = html;
    }
    
    // 添加格式化数字的函数
    function formatNumber(num) {
        if (num === 0) return '0';
        const absNum = Math.abs(num);
        if (absNum < 0.01 || absNum >= 10000) {
            return Number(num).toExponential(4);
        }
        return Number(num).toFixed(4);
    }
    
    // 添加关联式公式信息弹出框
    function setupCorrelationInfoLinks() {
        // 委托事件处理到结果部分
        resultsSection.addEventListener('click', function(e) {
            // 检查是否点击了关联式信息链接
            if (e.target.classList.contains('correlation-info')) {
                e.preventDefault();
                
                const correlationKey = e.target.dataset.correlation;
                showCorrelationInfo(correlationKey);
            }
        });
    }
    
    // 格式化显示的数字
    function formatNumber(num) {
        if (num === 0) return "0";
        
        const absNum = Math.abs(num);
        if (absNum < 0.001 || absNum >= 10000) {
            return num.toExponential(4);
        } else {
            return num.toFixed(4);
        }
    }
    
    // 显示相关性公式信息
    function showCorrelationInfo(correlationKey) {
        let title, formulaHtml, description;
        
        switch(correlationKey) {
            case 'yagi_kunii_static':
                title = "Yagi-Kunii 静态导热系数模型";
                formulaHtml = `
                    <div class="formula">
                        <div class="latex-formula">
                            k_s = k_g [φ + (1-φ)/(1/ψ + k_g/k_p)]
                        </div>
                    </div>
                    <div class="formula-legend">
                        <p>参数说明:</p>
                        <ul>
                            <li>k_s - 静态导热系数 (W/m·K)</li>
                            <li>k_g - 流体导热系数 (W/m·K)</li>
                            <li>k_p - 固体颗粒导热系数 (W/m·K)</li>
                            <li>φ - 空隙率</li>
                            <li>ψ - 形状因子 (球形颗粒约为0.9)</li>
                        </ul>
                    </div>
                `;
                description = "Yagi和Kunii提出的静态导热系数模型，考虑流体相和固体相的导热贡献，以及颗粒形状的影响。";
                break;
                
            case 'zbs_static':
                title = "ZBS (Zehner-Bauer-Schlünder) 静态导热系数模型";
                formulaHtml = `
                    <div class="formula">
                        <div class="latex-formula">
                            k_s = k_g (1 - √(1-φ)) + k_g·√(1-φ)/(1/(K·k_g/k_p) + 2/3)
                        </div>
                    </div>
                    <div class="formula-legend">
                        <p>参数说明:</p>
                        <ul>
                            <li>k_s - 静态导热系数 (W/m·K)</li>
                            <li>k_g - 流体导热系数 (W/m·K)</li>
                            <li>k_p - 固体颗粒导热系数 (W/m·K)</li>
                            <li>φ - 空隙率</li>
                            <li>K - 形状影响系数 (球形颗粒约为2.5)</li>
                        </ul>
                    </div>
                `;
                description = "Zehner, Bauer和Schlünder提出的静态导热系数模型，通过考虑颗粒接触点和流体路径改进了传热模拟。该模型对于高导热比(k_p/k_g)的系统非常适用。";
                break;
                
            case 'yagi_kunii_dispersion_axial':
                title = "Yagi-Kunii 轴向有效导热系数模型";
                formulaHtml = `
                    <div class="formula">
                        <div class="latex-formula">
                            k_ea = k_s + 0.5·Pe_p·k_g
                        </div>
                    </div>
                    <div class="formula-legend">
                        <p>参数说明:</p>
                        <ul>
                            <li>k_ea - 轴向有效导热系数 (W/m·K)</li>
                            <li>k_s - 静态导热系数 (W/m·K)</li>
                            <li>k_g - 流体导热系数 (W/m·K)</li>
                            <li>Pe_p - 颗粒Peclet数 (Pe_p = Re_p·Pr)</li>
                            <li>Re_p - 颗粒Reynolds数 (Re_p = ρ·u·d_p/μ)</li>
                            <li>Pr - Prandtl数 (Pr = C_p·μ/k_g)</li>
                        </ul>
                    </div>
                `;
                description = "Yagi和Kunii提出的轴向有效导热系数模型，考虑静态导热和轴向热弥散两部分的贡献。系数0.5表示轴向热弥散的贡献程度。";
                break;
                
            case 'vortmeyer_dispersion_axial':
                title = "Vortmeyer 轴向有效导热系数模型";
                formulaHtml = `
                    <div class="formula">
                        <div class="latex-formula">
                            k_ea = k_s + 0.7·Pe_p·k_g
                        </div>
                    </div>
                    <div class="formula-legend">
                        <p>参数说明:</p>
                        <ul>
                            <li>k_ea - 轴向有效导热系数 (W/m·K)</li>
                            <li>k_s - 静态导热系数 (W/m·K)</li>
                            <li>k_g - 流体导热系数 (W/m·K)</li>
                            <li>Pe_p - 颗粒Peclet数 (Pe_p = Re_p·Pr)</li>
                        </ul>
                    </div>
                `;
                description = "Vortmeyer提出的轴向有效导热系数模型，通过调整系数为0.7对Yagi-Kunii模型进行了修正，适用于大多数气固反应器系统。";
                break;
                
            case 'edwards_axial':
                title = "Edwards 轴向有效导热系数模型";
                formulaHtml = `
                    <div class="formula">
                        <div class="latex-formula">
                            k_ea = k_s + 0.73·Pe_p·k_g·φ/(φ + 0.5(1-φ)·Pe_p)
                        </div>
                    </div>
                    <div class="formula-legend">
                        <p>参数说明:</p>
                        <ul>
                            <li>k_ea - 轴向有效导热系数 (W/m·K)</li>
                            <li>k_s - 静态导热系数 (W/m·K)</li>
                            <li>k_g - 流体导热系数 (W/m·K)</li>
                            <li>φ - 空隙率</li>
                            <li>Pe_p - 颗粒Peclet数 (Pe_p = Re_p·Pr)</li>
                        </ul>
                    </div>
                `;
                description = "Edwards提出的轴向有效导热系数模型，考虑了空隙率对轴向热弥散的影响，适用范围更广，尤其在较大雷诺数下表现更好。";
                break;
                
            case 'yagi_kunii_dispersion_radial':
                title = "Yagi-Kunii 径向有效导热系数模型";
                formulaHtml = `
                    <div class="formula">
                        <div class="latex-formula">
                            k_er = k_s + 0.1·Pe_p·k_g
                        </div>
                    </div>
                    <div class="formula-legend">
                        <p>参数说明:</p>
                        <ul>
                            <li>k_er - 径向有效导热系数 (W/m·K)</li>
                            <li>k_s - 静态导热系数 (W/m·K)</li>
                            <li>k_g - 流体导热系数 (W/m·K)</li>
                            <li>Pe_p - 颗粒Peclet数 (Pe_p = Re_p·Pr)</li>
                        </ul>
                    </div>
                `;
                description = "Yagi和Kunii提出的径向有效导热系数模型，基于静态导热系数，加上弥散项的贡献。系数0.1反映了径向弥散通常小于轴向弥散的特性。";
                break;
                
            case 'bauer_schlunder_dispersion':
                title = "Bauer-Schlünder 径向有效导热系数模型";
                formulaHtml = `
                    <div class="formula">
                        <div class="latex-formula">
                            k_er = k_s + 0.11·Pe_p·k_g·(1/Pe_p + 0.167)·Pr^(1/3)
                        </div>
                    </div>
                    <div class="formula-legend">
                        <p>参数说明:</p>
                        <ul>
                            <li>k_er - 径向有效导热系数 (W/m·K)</li>
                            <li>k_s - 静态导热系数 (W/m·K)</li>
                            <li>k_g - 流体导热系数 (W/m·K)</li>
                            <li>Pe_p - 颗粒Peclet数 (Pe_p = Re_p·Pr)</li>
                            <li>Pr - Prandtl数 (Pr = C_p·μ/k_g)</li>
                        </ul>
                    </div>
                `;
                description = "Bauer和Schlünder提出的径向有效导热系数模型，考虑了Prandtl数的影响，适用于高Prandtl数流体的系统。模型的复杂项考虑了不同流动状态下的径向弥散特性。";
                break;
                
            case 'peclet_radial':
                title = "佩克莱数 径向有效导热系数模型";
                formulaHtml = `
                    <div class="formula">
                        <div class="latex-formula">
                            k_er = k_s + (Pe_p·k_g/8)·(1/(1+9.7/Pe_p))
                        </div>
                    </div>
                    <div class="formula-legend">
                        <p>参数说明:</p>
                        <ul>
                            <li>k_er - 径向有效导热系数 (W/m·K)</li>
                            <li>k_s - 静态导热系数 (W/m·K)</li>
                            <li>k_g - 流体导热系数 (W/m·K)</li>
                            <li>Pe_p - 颗粒Peclet数 (Pe_p = Re_p·Pr)</li>
                        </ul>
                    </div>
                `;
                description = "基于佩克莱数的径向有效导热系数模型，将径向弥散贡献表示为Peclet数的函数，适用于从低到高雷诺数的宽广范围。";
                break;
                
            default:
                title = "未知相关性模型";
                formulaHtml = "<p>无可用信息</p>";
                description = "未找到该模型的详细信息。";
        }
        
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'equation-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>${title}</h3>
                ${formulaHtml}
                <p class="description">${description}</p>
                <div class="modal-footer">
                    <button class="modal-close-btn">关闭</button>
                </div>
            </div>
        `;
        
        // 添加到文档中
        document.body.appendChild(modal);
        
        // 添加显示类名后显示模态框
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // 关闭模态框的点击事件
        modal.querySelector('.close-modal').addEventListener('click', () => {
            closeModal(modal);
        });
        
        modal.querySelector('.modal-close-btn').addEventListener('click', () => {
            closeModal(modal);
        });
        
        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    }
    
    // 关闭模态框
    function closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
    
    // 设置关联式信息链接点击事件
    function setupCorrelationInfoLinks() {
        document.addEventListener('click', function(e) {
            // 检查是否点击了相关性信息链接
            if (e.target && e.target.classList.contains('correlation-info')) {
                e.preventDefault();
                const correlationKey = e.target.getAttribute('data-correlation');
                showCorrelationInfo(correlationKey);
            }
        });
    }
    
    // 初始化时设置关联式信息链接
    setupCorrelationInfoLinks();
});
