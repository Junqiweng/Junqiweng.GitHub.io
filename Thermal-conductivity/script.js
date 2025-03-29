document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');

    // 添加错误值的CSS样式
    const errorStyle = document.createElement('style');
    errorStyle.textContent = `
        .error-value {
            color: #e74c3c;
            font-weight: bold;
        }
        .error-value .value-number {
            text-decoration: underline wavy #e74c3c;
        }
        .info-note {
            background-color: #f0f9ff;
            border-left: 4px solid #3498db;
            padding: 10px 15px;
            margin: 10px 0;
            border-radius: 4px;
            font-size: 0.92em;
            display: flex;
            align-items: center;
        }
        .info-icon {
            margin-right: 10px;
            font-size: 1.2em;
        }
        .info-text {
            line-height: 1.4;
            color: #444;
        }
    `;
    document.head.appendChild(errorStyle);

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
            formula: "$$ \\lambda_{bed}^0 = \\lambda_f \\left[ 1 - \\sqrt{1-\\epsilon} + \\sqrt{1-\\epsilon} \\cdot \\frac{2}{1-B/\\kappa} \\left( \\frac{(1-1/\\kappa) \\cdot B \\cdot \\ln(\\kappa/B)}{(1-B/\\kappa)^2} - \\frac{B-1}{1-B/\\kappa} - \\frac{B+1}{2} \\right) \\right] $$",
            parameters: [
                ["\\lambda_{bed}^0", "静态有效导热系数", "固定床在无流动状态下的导热系数"],
                ["\\lambda_f", "流体导热系数", "床层中流体的导热系数"],
                ["\\lambda_s", "固体导热系数", "颗粒的导热系数"],
                ["\\epsilon", "空隙率", "床层的孔隙度"],
                ["\\kappa", "导热比", "固体与流体导热系数的比值 (λ_s/λ_f)"],
                ["B", "形状因子", "与颗粒形状有关的参数，球形颗粒通常取1.25"]
            ],
            theory: `<p><strong>ZBS模型</strong>是一种较为复杂但精确的静态导热模型，考虑了颗粒形状、接触点传热以及空隙率分布的影响。</p>
            <p>关键特点：</p>
            <ul>
                <li>将颗粒之间的空间分为串联和并联热传导单元</li>
                <li>考虑了颗粒形状对热传导的影响（通过形状因子B表示）</li>
                <li>能处理较大导热系数比(λ_s/λ_f)的情况</li>
            </ul>
            <p>这个模型在精确预测固定床导热性能方面表现优异，特别是对于球形颗粒填充床。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">广泛适用于各种颗粒形状的固定床</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适合较大导热系数比(λ_s/λ_f)的情况</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于大多数化工和反应工程系统</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">形状因子B对于球形颗粒通常取1.25</span>
    </div>
</div>`
        },
        zbs_static_radiation: {
            title: "ZBS(Zehner-Bauer-Schlünder)静态导热系数关联式（含辐射）",
            formula: `$$ \\lambda_{bed}^0 = \\lambda_f \\left[ (1 - \\sqrt{1-\\epsilon})\\epsilon \\left(\\frac{1}{\\frac{1}{\\epsilon} - \\frac{1}{k_G}} + k_r\\right) + \\sqrt{1-\\epsilon}(\\phi\\kappa + (1-\\phi)k_c) \\right] $$`,
            parameters: [
                ["\\lambda_{bed}^0", "静态有效导热系数（含辐射）", "固定床在无流动状态下的导热系数"],
                ["\\lambda_f", "流体导热系数", "床层中流体的导热系数"],
                ["\\epsilon", "空隙率", "床层的孔隙度"],
                ["\\kappa", "导热比", "固体与流体导热系数的比值 (λ_s/λ_f)"],
                ["k_r", "辐射导热系数", "考虑辐射效应的参数"],
                ["k_G", "气相导热比", "通常为1"],
                ["\\phi", "形状因子", "与颗粒接触有关的参数，通常取0.0077"]
            ],
            theory: `<p><strong>ZBS模型（含辐射）</strong>在原ZBS模型基础上增加了辐射传热的贡献，适用于高温条件下的固定床。</p>
            <p>关键特点：</p>
            <ul>
                <li>考虑了辐射传热对有效导热系数的贡献</li>
                <li>适用于高温反应器和催化剂床层</li>
                <li>在低温条件下，辐射项接近于零，模型简化为标准ZBS模型</li>
            </ul>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">特别适用于高温固定床反应器</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适合温度＞500K的工况</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于催化剂再生器和高温裂解反应器</span>
    </div>
</div>`
        },
        
        // 轴向弥散系数关联式
        yagi_kunii_wakao_axial: {
            title: "Yagi-Kunii/Wakao-Kaguei 轴向弥散系数模型",
            formula: `$$ \\ k_{ea}= C_{disp,a}·\\rho_f·Cp_f·u·d_p $$`,
            parameters: [
                ["k_{ea}", "轴向弥散系数", "W/m·K"],
                ["C_{disp,a}", "轴向弥散系数", "对于气体和液体，推荐值为0.5 (K_a = 2)"],  
            ],
            theory: `<p><strong>Yagi-Kunii/Wakao-Kaguei轴向弥散模型</strong>描述了流体流动引起的导热贡献。</p>
            <p>关键特点：</p>
            <ul>
                <li>轴向弥散系数与颗粒佩克莱数成正比</li>
                <li>对于气体和液体系统，推荐[C_{disp,a}≈0.5 (K_a = 2)</li>
                <li>与径向弥散系数相比，轴向弥散通常是径向的4-5倍</li>
                <li>此版本仅计算弥散效应，不包含静态导热系数</li>
            </ul>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于大多数固定床反应器的轴向热传导计算</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于气相和液相系统</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：Re_p = 10-10000</span>
    </div>
</div>`
        },
        
        // 径向弥散系数关联式
        dixon_cresswell_radial: {
            title: "Dixon-Cresswell 径向弥散系数模型",
            formula: `$$ \\ k_{er} = \\frac{\\rho_f·Cp_f·u·d_p}{K_5} $$
            $$ K_5 = 8.65 \\left[ 1 + 1.94 \\left( \\frac{d_p}{d_t} \\right)^2 \\right] $$`,
            parameters: [
                ["k_{er}", "径向弥散系数", "W/m·K"],
                ["k_f", "流体导热系数", "W/m·K"],
                ["K_5", "考虑壁面效应的参数", "当d_t/d_p很大时（壁面影响小），K_5≈8.65"],
                ["d_p", "颗粒直径", "m"],
                ["d_t", "反应器/管直径", "m"]
            ],
            theory: `<p><strong>Dixon-Cresswell径向弥散模型</strong>考虑了管径与颗粒直径比对径向弥散的影响。</p>
            <p>关键特点：</p>
            <ul>
                <li>通过K_5参数考虑管壁效应</li>
                <li>当d_t/d_p很大时（壁面影响小），K_5≈8.65，接近Yagi和Kunii的结果</li>
                <li>当d_t/d_p较小时，壁面附近空隙率增大，流速不均，导致径向混合减弱，K_5增大，动态贡献减小</li>
                <li>此版本仅计算弥散效应，不包含静态导热系数</li>
            </ul>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">特别适用于小直径反应器或大颗粒系统</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于d_t/d_p = 5-30的范围</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于气固和液固系统</span>
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
            'fluid_heat_capacity': '1005',
            'temperature': '300',
            'pressure': '101325',
            'molar_mass': '0.029',
            'tube_particle_ratio': '0.06'  // 管径默认值，对应于之前的比值10
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
                fluidHeatCapacity: getInputValue('fluid_heat_capacity'),
                temperature: getInputValue('temperature'),
                pressure: getInputValue('pressure'),
                molarMass: getInputValue('molar_mass'),
                tubeDiameter: getInputValue('tube_particle_ratio') // 现在获取的是管径而不是比值
            };
            
            // 计算管径与颗粒直径比值
            inputs.tubeParticleRatio = inputs.tubeDiameter / inputs.particleDiameter;
            console.log(`计算管径/颗粒直径比值: ${inputs.tubeDiameter} / ${inputs.particleDiameter} = ${inputs.tubeParticleRatio}`);
            
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
            
            // 检查ZBS静态导热（辐射）选项
            if (document.getElementById('zbs_static_radiation').checked) {
                selectedCorrelations.static.push('zbs_static_radiation');
            }
            
            // 轴向弥散
            if (document.getElementById('yagi_kunii_wakao_axial').checked) {
                selectedCorrelations.axial.push('yagi_kunii_wakao_axial');
            }
            
            // 径向弥散
            if (document.getElementById('dixon_cresswell_radial').checked) {
                selectedCorrelations.radial.push('dixon_cresswell_radial');
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
            // ZBS 静态导热 - 使用改进的函数逻辑
            const { voidFraction, fluidThermalConductivity, solidThermalConductivity } = inputs;
            
            // 使用与Python函数相同的逻辑实现ZBS公式
            const B = 1.25; // 球形颗粒的形状因子，默认为1.25
            const kappa = solidThermalConductivity / fluidThermalConductivity;
            const sqrt_1_minus_epsilon = Math.sqrt(1 - voidFraction);
            
            // 检查潜在的除零或对数域错误
            const term_1_minus_B_div_kappa = 1.0 - B / kappa;
            
            if (Math.abs(term_1_minus_B_div_kappa) < 1e-9) {
                console.warn(`警告: kappa (${kappa.toFixed(4)}) 非常接近 B (${B.toFixed(4)}). 结果可能不稳定或无效。`);
                results['zbs_static'] = "计算错误";
            } else if (kappa / B <= 0) {
                console.error(`错误: kappa/B (${(kappa/B).toFixed(4)}) 必须为正数才能计算对数。`);
                results['zbs_static'] = "计算错误";
            } else {
                try {
                    const log_kappa_div_B = Math.log(kappa / B);
                    
                    // 计算复杂项（term2_factor）
                    const termA = ((1.0 - 1.0 / kappa) * B / (term_1_minus_B_div_kappa**2)) * log_kappa_div_B;
                    const termB = (B - 1.0) / term_1_minus_B_div_kappa;
                    const termC = (B + 1.0) / 2.0;
                    const term2_factor = (2.0 / term_1_minus_B_div_kappa) * (termA - termB - termC);
                    
                    // 结合各项计算比值 lambda_bed^0 / lambda_f
                    const lambda_ratio = (1.0 - sqrt_1_minus_epsilon) + sqrt_1_minus_epsilon * term2_factor;
                    const k0_zbs = fluidThermalConductivity * lambda_ratio;
                    
                    results['zbs_static'] = k0_zbs.toFixed(4);
                } catch (error) {
                    console.error(`计算期间出现数学错误: ${error.message}`);
                    results['zbs_static'] = "计算错误";
                }
            }
        }
        
        if (correlations.includes('zbs_static_radiation')) {
            // ZBS静态导热（辐射）- 参考Python代码中的ZBS模型，包含辐射传热
            const { 
                voidFraction, 
                fluidThermalConductivity, 
                solidThermalConductivity, 
                particleDiameter,
                fluidDensity,
                fluidViscosity,
                fluidHeatCapacity,
                temperature,
                pressure,
                molarMass
            } = inputs;
            
            // 计算气体分子平均自由程所需参数
            const R = 8.314; // 气体常数 J/(mol·K)
            const sigma = 5.67e-8; // Stefan-Boltzmann常数 W/(m^2·K^4)
            const emissivity = 0.8; // 辐射发射率，可以添加额外输入字段
            
            try {
                // 计算固体与流体热导率的比值
                const kappa = solidThermalConductivity / fluidThermalConductivity;
                
                // 变形参数B
                const B = 1.25 * Math.pow((1 - voidFraction) / voidFraction, 10/9);
                
                // 辐射参数
                const k_r = (4 * sigma * Math.pow(temperature, 3) * particleDiameter) / (2 / emissivity - 1) / fluidThermalConductivity;
                
                // 修正自由程计算
                const a_T = 1; // 热适应系数
                const l = 2 * (2 - a_T) / a_T * 
                      Math.sqrt(2 * Math.PI * R * temperature / molarMass) * 
                      fluidThermalConductivity / 
                      (pressure * (2 * fluidHeatCapacity - R / molarMass));
                
                // Knudsen参数
                const k_G = 1 / (1 + l / particleDiameter);
                
                // 计算N参数
                const N = 1 / k_G * (1 + (k_r - B * k_G) / kappa) - B * (1 / k_G - 1) * (1 + k_r / kappa);
                
                // 计算k_c参数
                const k_c_term1 = 2 / N * (B * (kappa + k_r - 1) / (N**2 * k_G * kappa) * 
                                 Math.log((kappa + k_r) / (B * (k_G + (1 - k_G) * (kappa + k_r)))));
                const k_c_term2 = 2 / N * (B + 1) / (2 * B) * (k_r / k_G - B * (1 + (1 - k_G) / k_G * k_r));
                const k_c_term3 = -2 / N * (B - 1) / (N * k_G);
                const k_c = k_c_term1 + k_c_term2 + k_c_term3;
                
                // 形状因子
                const phi = 0.0077;
                
                // 计算有效热导率
                const k_eff_ratio = (1 - Math.sqrt(1 - voidFraction)) * voidFraction * 
                                   ((voidFraction - 1 + 1 / k_G) ** (-1) + k_r) + 
                                   Math.sqrt(1 - voidFraction) * (phi * kappa + (1 - phi) * k_c);
                
                const k0_zbs_rad = fluidThermalConductivity * k_eff_ratio;
                
                results['zbs_static_radiation'] = k0_zbs_rad.toFixed(4);
            } catch (error) {
                console.error(`ZBS辐射模型计算期间出现数学错误: ${error.message}`);
                results['zbs_static_radiation'] = "计算错误";
            }
        }
        
        // 计算平均值（只对有效数值计算平均值）
        const validResults = Object.entries(results)
            .filter(([_, value]) => !isNaN(parseFloat(value)) && value !== "计算错误")
            .map(([_, value]) => parseFloat(value));
        
        if (validResults.length > 0) {
            const sum = validResults.reduce((acc, val) => acc + val, 0);
            results['average'] = (sum / validResults.length).toFixed(4);
        } else if (Object.keys(results).length > 0) {
            results['average'] = "无有效结果";
        }
        
        return results;
    }
    
    // 计算轴向导热系数
    function calculateAxialConductivity(inputs, correlations, Re, Pr) {
        const results = {};
        const { fluidThermalConductivity } = inputs;
        const Pe = Re * Pr;
        
        // 在计算静态导热系数时也考虑ZBS静态导热（辐射）模型
        const staticModels = ['yagi_kunii_static', 'zbs_static'];
        if (document.getElementById('zbs_static_radiation').checked) {
            staticModels.push('zbs_static_radiation');
        }
        const staticResults = calculateStaticConductivity(inputs, staticModels);
        const k0 = parseFloat(staticResults['average']);
        
        // 添加Yagi-Kunii/Wakao-Kaguei轴向弥散模型
        if (correlations.includes('yagi_kunii_wakao_axial')) {
            // 计算轴向弥散导热系数，Cdisp,a = 0.5 (Ka = 2)
            const Cdisp_a = 0.5; // 气体和液体推荐值
            const dispersion = fluidThermalConductivity * Cdisp_a * Pe;
            // 删除静态有效导热系数的贡献，只考虑弥散部分
            // const kea = k0 + dispersion;
            const kea = dispersion;
            
            results['yagi_kunii_wakao_axial'] = kea.toFixed(4);
            results['yagi_kunii_wakao_axial_disp_only'] = dispersion.toFixed(4); // 仅弥散部分
        }
        
        // 计算平均值
        if (Object.keys(results).length > 0) {
            // 仅使用总有效导热系数计算平均值
            const totalConductivityKeys = ['yagi_kunii_wakao_axial'];
            const validKeys = totalConductivityKeys.filter(key => Object.keys(results).includes(key));
            const sum = validKeys.reduce((acc, key) => acc + parseFloat(results[key]), 0);
            results['average'] = (sum / validKeys.length).toFixed(4);
        }
        
        return results;
    }
    
    // 计算径向导热系数
    function calculateRadialConductivity(inputs, correlations, Re, Pr) {
        const results = {};
        const { fluidThermalConductivity, tubeParticleRatio } = inputs;
        const Pe = Re * Pr;
        
        // 在计算静态导热系数时也考虑ZBS静态导热（辐射）模型
        const staticModels = ['yagi_kunii_static', 'zbs_static'];
        if (document.getElementById('zbs_static_radiation').checked) {
            staticModels.push('zbs_static_radiation');
        }
        const staticResults = calculateStaticConductivity(inputs, staticModels);
        const k0 = parseFloat(staticResults['average']);
        
        // 添加Dixon-Cresswell径向弥散模型
        if (correlations.includes('dixon_cresswell_radial')) {
            // 计算K5参数 - 考虑壁面效应
            const dt_dp = tubeParticleRatio || 10; // 默认值为10（如果未提供）
            const K5 = 8.65 * (1 + 1.94 * Math.pow(dt_dp, -2));
            
            // 计算径向弥散导热系数
            const dispersion = fluidThermalConductivity * (Pe / K5);
            // 删除静态有效导热系数的贡献，只考虑弥散部分
            // const ker = k0 + dispersion;
            const ker = dispersion;
            
            results['dixon_cresswell_radial'] = ker.toFixed(4);
            results['dixon_cresswell_radial_disp_only'] = dispersion.toFixed(4); // 仅弥散部分
            results['dixon_cresswell_K5'] = K5.toFixed(4); // 输出K5参数值
        }
        
        // 计算平均值
        if (Object.keys(results).length > 0) {
            // 仅使用总有效导热系数计算平均值
            const totalConductivityKeys = ['dixon_cresswell_radial'];
            const validKeys = totalConductivityKeys.filter(key => Object.keys(results).includes(key));
            const sum = validKeys.reduce((acc, key) => acc + parseFloat(results[key]), 0);
            results['average'] = (sum / validKeys.length).toFixed(4);
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
            fluidHeatCapacity: getInputValue('fluid_heat_capacity'),
            temperature: getInputValue('temperature'),
            pressure: getInputValue('pressure'),
            molarMass: getInputValue('molar_mass'),
            tubeDiameter: getInputValue('tube_particle_ratio')
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
                        <td>管径</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(inputs.tubeDiameter)}</span>
                                <span class="value-unit">m</span>
                            </div>
                            <div class="parameter-info">
                                <small>管径/颗粒直径比值: ${formatNumber(inputs.tubeParticleRatio)}</small>
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
                    <tr>
                        <td>温度</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(inputs.temperature)}</span>
                                <span class="value-unit">K</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>压力</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(inputs.pressure)}</span>
                                <span class="value-unit">Pa</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>气体摩尔质量</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(inputs.molarMass)}</span>
                                <span class="value-unit">kg/mol</span>
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
            .filter(([key, value]) => key !== 'average' && value !== "计算错误" && value !== "无有效结果")
            .map(([_, value]) => parseFloat(value));
        const staticMinValue = staticValues.length > 0 ? Math.min(...staticValues) : 0;
        const staticMaxValue = staticValues.length > 0 ? Math.max(...staticValues) : 0;
        
        // 添加静态导热系数结果
        Object.entries(results.static).forEach(([key, value]) => {
            if (key === 'average') {
                // 移除平均值显示
                return;
            } else {
                const correlationName = key === 'yagi_kunii_static' ? 'Yagi-Kunii静态导热' : 
                                           (key === 'zbs_static' ? 'ZBS静态导热' : 
                                           (key === 'zbs_static_radiation' ? 'ZBS静态导热（辐射）' : key));
                let indication = '';
                let badgeClass = '';
                
                // 检查是否为错误结果
                if (value === "计算错误" || value === "无有效结果") {
                    html += `
                        <tr>
                            <td>
                                <div class="equation-name">
                                    ${correlationName}
                                    <a href="#" class="info-link correlation-info" data-correlation="${key}" title="查看公式">ℹ️</a>
                                </div>
                            </td>
                            <td class="value-column">
                                <div class="value-with-unit error-value">
                                    <span class="value-number">${value}</span>
                                </div>
                            </td>
                        </tr>
                    `;
                    return; // 跳过后续处理
                }
                
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
                    <span class="section-title">轴向弥散系数 (W/m·K)</span>
                </div>
                <div class="info-note">
                    <span class="info-icon">ℹ️</span>
                    <span class="info-text">此处展示了流体流动引起的弥散导热贡献，不包含静态导热系数。</span>
                </div>
                <table class="results-table">
                    <tr>
                        <th>关联式</th>
                        <th>弥散系数</th>
                    </tr>
        `;
        
        // 获取轴向导热系数的最大值和最小值
        const axialValues = Object.entries(results.axial)
            .filter(([key]) => key !== 'average' && !key.includes('_disp_only'))
            .map(([_, value]) => parseFloat(value));
        const axialMinValue = Math.min(...axialValues);
        const axialMaxValue = Math.max(...axialValues);
        
        // 添加轴向导热系数结果
        Object.entries(results.axial).forEach(([key, value]) => {
            if (key !== 'average' && !key.includes('_disp_only')) {
                let correlationName = '';
                switch(key) {
                    case 'yagi_kunii_wakao_axial':
                        correlationName = 'Yagi-Kunii/Wakao';
                        break;
                    default:
                        correlationName = key;
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
                            </div>
                        </td>
                    </tr>
                `;
            }
        });
        
        html += `
                </table>
            </div>
            
            <div class="result-card radial-card">
                <div class="section-header">
                    <span class="section-icon">↔️</span>
                    <span class="section-title">径向弥散系数 (W/m·K)</span>
                </div>
                <div class="info-note">
                    <span class="info-icon">ℹ️</span>
                    <span class="info-text">此处展示了流体流动引起的弥散导热贡献，不包含静态导热系数。</span>
                </div>
                <table class="results-table">
                    <tr>
                        <th>关联式</th>
                        <th>弥散系数</th>
                    </tr>
        `;
        
        // 获取径向导热系数的最大值和最小值
        const radialValues = Object.entries(results.radial)
            .filter(([key]) => key !== 'average' && !key.includes('_disp_only') && !key.includes('_K5'))
            .map(([_, value]) => parseFloat(value));
        const radialMinValue = Math.min(...radialValues);
        const radialMaxValue = Math.max(...radialValues);
        
        // 添加径向导热系数结果
        Object.entries(results.radial).forEach(([key, value]) => {
            if (key !== 'average' && !key.includes('_disp_only') && !key.includes('_K5')) {
                let correlationName = '';
                switch(key) {
                    case 'dixon_cresswell_radial':
                        correlationName = 'Dixon-Cresswell';
                        break;
                    default:
                        correlationName = key;
                }
                
                // 获取K5参数（如有）
                const k5Value = key === 'dixon_cresswell_radial' && 'dixon_cresswell_K5' in results.radial ? 
                    results.radial['dixon_cresswell_K5'] : null;
                
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
                            </div>
                            ${k5Value ? `<div class="parameter-info"><small>K<sub>5</sub>参数: ${k5Value}</small></div>` : ''}
                        </td>
                    </tr>
                `;
            }
        });
        
        html += `
                </table>
            </div>
            
            <div class="result-card summary-card">
                <div class="section-header">
                    <span class="section-icon">📋</span>
                    <span class="section-title">计算结果总结</span>
                </div>
                <div class="calculation-summary">
                    <p>✨ 计算完成! 请查看上方详细结果。</p>
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
    
    // 添加关联式公式信息弹出框 - 使用事件委托处理所有公式链接，包括动态添加的
    function setupCorrelationInfoLinks() {
        // 使用事件委托，确保即使是动态添加的链接也能触发事件
        document.addEventListener('click', function(e) {
            // 检查是否点击了相关性信息链接
            if (e.target && e.target.classList.contains('correlation-info') && !e.target._hasEventListener) {
                e.preventDefault();
                e.stopPropagation();
                
                const correlationKey = e.target.getAttribute('data-correlation');
                if (!correlationKey) {
                    console.error('No correlation key found');
                    return;
                }
                
                console.log('显示公式信息:', correlationKey);
                
                if (!modal) {
                    console.error('Modal element not found');
                    return;
                }

                try {
                    loadingOverlay?.classList.add('show');
                    modal.style.display = "block";
                    modal.classList.add('show');
                    
                    // 调用统一的公式展示函数
                    showFormulaDetails(correlationKey);
                } catch (error) {
                    console.error('Error showing formula:', error);
                } finally {
                    loadingOverlay?.classList.remove('show');
                }
            }
        });
    }
    
    // 初始化时设置关联式信息链接
    setupCorrelationInfoLinks();
    
    // 手动触发MathJax渲染
    function renderMathJax() {
        if (window.MathJax) {
            window.MathJax.typeset();
        }
    }

    function closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
});
