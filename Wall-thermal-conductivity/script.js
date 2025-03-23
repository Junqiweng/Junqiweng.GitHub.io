// Format number to scientific notation if needed
function formatNumber(num) {
    if (num === 0) return '0';
    const absNum = Math.abs(num);
    if (absNum < 0.01 || absNum >= 10000) {
        return num.toExponential(4);
    }
    return num.toFixed(4);
}

// Formula details data
const formulaDetails = {
    li_finlayson: {
        title: "Li & Finlayson壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.17\\left(\\frac{d_p G}{\\mu}\\right)^{\\mathrm{0.79}} \\mathrm{Pr}^{\\mathrm{0.33}} \\left(\\frac{d_p}{D_t}\\right)^{\\mathrm{-0.25}} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数（Pr = μCp/kf），由其他参数计算得出"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Li & Finlayson关联式</strong>是基于一系列数值模拟和实验验证得出的经验关联式。</p>
        <p>关键特点：</p>
        <ul>
            <li>考虑了粒径与管径比的影响，通过(d_p/D_t)^{-0.25}项</li>
            <li>雷诺数指数0.79较为温和，适合低流速条件</li>
            <li>普朗特数指数1/3是传热关联式中的常见值</li>
        </ul>
        <p>该关联式在低雷诺数范围内表现良好，是化工反应器设计中的重要工具。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：1 < Re < 100</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于球形颗粒填充床</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于气相系统</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">N = Dt/dp > 10</span>
    </div>
</div>`
    },
    dixon_cresswell: {
        title: "Dixon & Cresswell壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.23\\left(\\frac{d_p G}{\\mu}\\right)^{\\mathrm{0.7}} \\mathrm{Pr}^{\\mathrm{0.33}} \\left(\\frac{d_p}{D_t}\\right)^{\\mathrm{-0.2}} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数（Pr = μCp/kf），由其他参数计算得出"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Dixon & Cresswell关联式</strong>是一种广泛用于固定床壁面传热的经典关联式。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数0.23高于Li & Finlayson关联式，预测传热系数通常更大</li>
            <li>雷诺数指数0.7较小，对流速变化的敏感性降低</li>
            <li>管径比的指数为-0.2，略小于Li & Finlayson关联式</li>
        </ul>
        <p>这个关联式特别适合于气固催化反应器中的壁面传热计算。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：1 < Re < 50</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于球形和圆柱形颗粒</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">气相和液相系统均适用</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">管径比范围：4 < N < 50</span>
    </div>
</div>`
    },
    de_wasch_froment: {
        title: "De Wasch & Froment壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.11\\left(\\frac{d_p G}{\\mu}\\right)^{\\mathrm{0.81}} \\mathrm{Pr}^{\\mathrm{0.33}} \\left(\\frac{d_p}{D_t}\\right)^{\\mathrm{-0.485}} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数（Pr = μCp/kf），由其他参数计算得出"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>De Wasch & Froment关联式</strong>特别适用于较高雷诺数范围的流动条件。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数0.11较低，但在高雷诺数下通过指数项补偿</li>
            <li>雷诺数指数0.81表明在高流速下传热效果更好</li>
            <li>管径比指数-0.485最高，表明对反应器直径更敏感</li>
        </ul>
        <p>这个关联式是在更高流速条件下的工业反应器设计中的重要工具。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：100 < Re < 1000</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">特别适用于气相反应系统</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">球形颗粒填充床</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">高流速、湍流条件</span>
    </div>
</div>`
    },
    specchia: {
        title: "Specchia壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.27\\left(\\frac{d_p G}{\\mu}\\right)^{\\mathrm{0.85}} \\mathrm{Pr}^{\\mathrm{0.33}} \\left(\\frac{d_p}{D_t}\\right)^{\\mathrm{-0.33}} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数（Pr = μCp/kf），由其他参数计算得出"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Specchia关联式</strong>是一个适用范围较广的经验公式，特别适合中等雷诺数范围的应用。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数0.27是四个关联式中最高的，预测传热系数通常较大</li>
            <li>雷诺数指数0.85是最高的，对流速最敏感</li>
            <li>管径比指数-0.33介于其他关联式之间</li>
        </ul>
        <p>该关联式在工程应用中广受欢迎，因为它在各种操作条件下都能提供合理的预测结果。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：50 < Re < 500</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于球形颗粒填充床</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于气相和液相系统</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">温度变化不大的情况</span>
    </div>
</div>`
    }
};

// Function to show formula details
async function showFormulaDetails(formulaId) {
    const formula = formulaDetails[formulaId];
    if (!formula) return;

    const detailContent = document.getElementById('formulaDetail');

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
                                <td class="symbol-cell" title="数学符号"><em>${symbol.replace(/_([^_]+)/g, '<sub style="font-style:normal">$1</sub>')}</em></td>
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

    detailContent.innerHTML = content;
    if (window.MathJax) {
        MathJax.typesetPromise([detailContent]).catch(error => {
            console.error('MathJax typesetting error:', error);
        });
    }
    showModal().catch(error => {
        console.error('Error showing modal:', error);
        loadingOverlay.classList.remove('show');
    });
}

// Calculation functions for different correlations
function calculateLiFinlayson(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    if (reynoldsNumber <= 1 || reynoldsNumber >= 100) {
        throw new Error('Li & Finlayson关联式：雷诺数超出适用范围(1 < Re < 100)！');
    }

    const hw = 0.17 * Math.pow(particleDiameter * massFlux / fluidViscosity, 0.79) 
               * Math.pow(fluidPrandtl, 0.33) 
               * Math.pow(particleDiameter / reactorDiameter, -0.25) 
               * (fluidThermalConductivity / particleDiameter);
    return hw;
}

function calculateDixonCresswell(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    if (reynoldsNumber <= 1 || reynoldsNumber >= 50) {
        throw new Error('Dixon & Cresswell关联式：雷诺数超出适用范围(1 < Re < 50)！');
    }

    const hw = 0.23 * Math.pow(particleDiameter * massFlux / fluidViscosity, 0.7) 
               * Math.pow(fluidPrandtl, 0.33) 
               * Math.pow(particleDiameter / reactorDiameter, -0.2) 
               * (fluidThermalConductivity / particleDiameter);
    return hw;
}

function calculateDeWaschFroment(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    if (reynoldsNumber <= 100 || reynoldsNumber >= 1000) {
        throw new Error('De Wasch & Froment关联式：雷诺数超出适用范围(100 < Re < 1000)！');
    }

    const hw = 0.31 * Math.pow(particleDiameter * massFlux / fluidViscosity, 0.93) 
               * Math.pow(fluidPrandtl, 0.33) 
               * Math.pow(particleDiameter / reactorDiameter, -0.5) 
               * (fluidThermalConductivity / particleDiameter);
    return hw;
}

function calculateSpecchia(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    if (reynoldsNumber <= 50 || reynoldsNumber >= 500) {
        throw new Error('Specchia关联式：雷诺数超出适用范围(50 < Re < 500)！');
    }

    const hw = 0.27 * Math.pow(particleDiameter * massFlux / fluidViscosity, 0.85) 
               * Math.pow(fluidPrandtl, 0.33) 
               * Math.pow(particleDiameter / reactorDiameter, -0.33) 
               * (fluidThermalConductivity / particleDiameter);
    return hw;
}

document.addEventListener('DOMContentLoaded', () => {
    // Loading indicator
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // Hide loading overlay once page is loaded
    window.addEventListener('load', function() {
        loadingOverlay.classList.remove('show');
    });

    // Show loading indicator when navigating away
    window.addEventListener('beforeunload', function() {
        loadingOverlay.classList.add('show');
    });

    // Event delegation for formula info links
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.info-link, .equation-info')) {
            e.preventDefault();
            e.stopPropagation();
            const link = e.target.closest('.info-link, .equation-info');
            const formulaId = link.dataset.formula;
            if (formulaId) {
                loadingOverlay.classList.add('show');
                try {
                    modal.style.display = "block";
                    await showFormulaDetails(formulaId);
                    if (window.MathJax) {
                        await MathJax.typesetPromise([modal]);
                    }
                } catch (error) {
                    console.error('Error showing formula details:', error);
                } finally {
                    loadingOverlay.classList.remove('show');
                }
            }
        }
    });

    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Get DOM elements
    const calculateBtn = document.getElementById('calculate');
    const clearBtn = document.getElementById('clear');
    const resetBtn = document.getElementById('reset');
    const resultText = document.querySelector('.result-text');

    // Performance optimization for navigation
    document.querySelectorAll('a[href]').forEach(link => {
        if (link.hostname === window.location.hostname) {
            let prefetcher = document.createElement('link');
            prefetcher.rel = 'prefetch';
            prefetcher.href = link.href;
            document.head.appendChild(prefetcher);
        }
    });

    // Default values for reset
    const defaultValues = {
        fluid_velocity: 0.5,
        particle_diameter: 0.003,
        reactor_diameter: 0.05,
        fluid_thermal_conductivity: 0.025,
        fluid_density: 1.225,
        fluid_viscosity: 1.81e-5,
        fluid_heat_capacity: 1005
    };

    // Clear all inputs
    clearBtn.addEventListener('click', () => {
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.value = '';
        });
    });

    // Reset to default values
    resetBtn.addEventListener('click', () => {
        Object.entries(defaultValues).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.value = value;
        });
    });

    // Input validation
    function validateInputs() {
        const inputs = document.querySelectorAll('input[type="number"]');
        let isValid = true;
        inputs.forEach(input => {
            // 特殊处理流体热导率字段
            if (input.id === 'fluid_thermal_conductivity') {
                input.classList.remove('error');
                return;
            }
            
            if (!input.checkValidity()) {
                input.reportValidity();
                isValid = false;
            }
        });
        return isValid;
    }

    // Main calculation
    calculateBtn.addEventListener('click', () => {
        if (!validateInputs()) {
            return;
        }

        loadingOverlay.classList.add('show');
        calculateBtn.disabled = true;

        try {
            // Get input values
            const fluidVelocity = parseFloat(document.getElementById('fluid_velocity').value);
            const particleDiameter = parseFloat(document.getElementById('particle_diameter').value);
            const reactorDiameter = parseFloat(document.getElementById('reactor_diameter').value);
            const fluidThermalConductivity = parseFloat(document.getElementById('fluid_thermal_conductivity').value);
            const fluidDensity = parseFloat(document.getElementById('fluid_density').value);
            const fluidViscosity = parseFloat(document.getElementById('fluid_viscosity').value);
            const fluidHeatCapacity = parseFloat(document.getElementById('fluid_heat_capacity').value);

            // 计算普朗特数
            const fluidPrandtl = (fluidViscosity * fluidHeatCapacity) / fluidThermalConductivity;

            // Validate inputs
            if ([fluidVelocity, particleDiameter, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity, fluidHeatCapacity].some(isNaN)) {
                throw new Error('请确保所有输入都是有效的数值！');
            }

            // Calculate Reynolds number for display
            const massFlux = fluidDensity * fluidVelocity;
            const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;

            // Results storage
            const results = {};
            let successCount = 0;

            // Try each correlation and store valid results
            try {
                results.li_finlayson = calculateLiFinlayson(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, 
                                                          fluidThermalConductivity, fluidDensity, fluidViscosity);
                successCount++;
            } catch (error) {
                results.li_finlayson = error.message;
            }

            try {
                results.dixon_cresswell = calculateDixonCresswell(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, 
                                                                fluidThermalConductivity, fluidDensity, fluidViscosity);
                successCount++;
            } catch (error) {
                results.dixon_cresswell = error.message;
            }

            try {
                results.de_wasch_froment = calculateDeWaschFroment(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, 
                                                                 fluidThermalConductivity, fluidDensity, fluidViscosity);
                successCount++;
            } catch (error) {
                results.de_wasch_froment = error.message;
            }

            try {
                results.specchia = calculateSpecchia(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, 
                                                  fluidThermalConductivity, fluidDensity, fluidViscosity);
                successCount++;
            } catch (error) {
                results.specchia = error.message;
            }

            if (successCount === 0) {
                throw new Error('当前条件下没有适用的关联式！雷诺数 Re = ' + formatNumber(reynoldsNumber));
            }

            // Update results text using HTML structure
            let resultOutput = `<div class="results-wrapper">`;
            
            // 添加操作条件卡片
            resultOutput += `
            <div class="result-card condition-card">
                <div class="section-header">
                    <span class="section-icon">🔬</span>
                    <span class="section-title">操作条件</span>
                </div>
                <table class="results-table">
                    <tr>
                        <th width="40%">参数</th>
                        <th width="30%">数值</th>
                        <th width="30%">单位</th>
                    </tr>
                    <tr>
                        <td>流体表观速度 (<i>u</i><sub>0</sub>)</td>
                        <td class="value-column">${formatNumber(fluidVelocity)}</td>
                        <td>m/s</td>
                    </tr>
                    <tr>
                        <td>颗粒直径 (<i>d</i><sub>p</sub>)</td>
                        <td class="value-column">${formatNumber(particleDiameter)}</td>
                        <td>m</td>
                    </tr>
                    <tr>
                        <td>反应器直径 (<i>D</i>)</td>
                        <td class="value-column">${formatNumber(reactorDiameter)}</td>
                        <td>m</td>
                    </tr>
                    <tr>
                        <td>流体密度 (<i>ρ</i>)</td>
                        <td class="value-column">${formatNumber(fluidDensity)}</td>
                        <td>kg/m³</td>
                    </tr>
                    <tr>
                        <td>流体粘度 (<i>μ</i>)</td>
                        <td class="value-column">${formatNumber(fluidViscosity)}</td>
                        <td>Pa·s</td>
                    </tr>
                    <tr>
                        <td>流体热导率 (<i>λ</i><sub>f</sub>)</td>
                        <td class="value-column">${formatNumber(fluidThermalConductivity)}</td>
                        <td>W/m·K</td>
                    </tr>
                    <tr>
                        <td>流体比热容 (<i>C</i><sub>p</sub>)</td>
                        <td class="value-column">${formatNumber(fluidHeatCapacity)}</td>
                        <td>J/kg·K</td>
                    </tr>
                    <tr>
                        <td>流体普朗特数 (Pr) - 计算值</td>
                        <td class="value-column">${formatNumber(fluidPrandtl)}</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>雷诺数 (Re)</td>
                        <td class="value-column">${formatNumber(reynoldsNumber)}</td>
                        <td>-</td>
                    </tr>
                </table>
            </div>`;

            // 壁面传热系数计算结果卡片
            resultOutput += `
            <div class="result-card pressure-card">
                <div class="section-header">
                    <span class="section-icon">💡</span>
                    <span class="section-title">壁面传热系数计算结果</span>
                </div>
                <table class="results-table">
                    <tr>
                        <th>计算方程</th>
                        <th>壁面传热系数 h<sub>w</sub> (W/m²·K)</th>
                    </tr>`;

            // 找出最大值和最小值（只考虑有效的数值结果）
            const validResults = Object.entries(results)
                .filter(([_, result]) => typeof result === 'number')
                .map(([_, result]) => result);
            
            const minValue = validResults.length > 0 ? Math.min(...validResults) : null;
            const maxValue = validResults.length > 0 ? Math.max(...validResults) : null;

            for (const [name, result] of Object.entries(results)) {
                const correlationName = {
                    'li_finlayson': 'Li & Finlayson 关联式',
                    'dixon_cresswell': 'Dixon & Cresswell 关联式',
                    'de_wasch_froment': 'De Wasch & Froment 关联式',
                    'specchia': 'Specchia 关联式'
                }[name];

                resultOutput += `
                    <tr ${typeof result === 'number' && result === minValue ? 'class="min-value"' : typeof result === 'number' && result === maxValue ? 'class="max-value"' : ''}>
                        <td>
                            <div class="equation-name">
                                ${correlationName}
                                <a href="#" class="info-link" data-formula="${name}" title="查看公式">ℹ️</a>
                                ${typeof result === 'number' && result === minValue ? '<span class="result-badge min-badge">最小值</span>' : ''}
                                ${typeof result === 'number' && result === maxValue ? '<span class="result-badge max-badge">最大值</span>' : ''}
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">`;
                
                if (typeof result === 'number') {
                    resultOutput += `
                                <span class="value-number">${formatNumber(result)}</span>
                                <span class="value-unit">W/m²·K</span>`;
                } else {
                    resultOutput += `
                                <span class="error-message">${result}</span>`;
                }
                
                resultOutput += `
                            </div>
                        </td>
                    </tr>`;
            }

            resultOutput += `
                </table>
            </div>`;
            
            // 添加统计分析卡片（如果有超过1个有效结果）
            if (validResults.length > 1) {
                const avgValue = validResults.reduce((a, b) => a + b, 0) / validResults.length;
                const difference = maxValue - minValue;
                const percentDiff = (difference / avgValue * 100);
                
                resultOutput += `
                <div class="result-card stats-card">
                    <div class="section-header">
                        <span class="section-icon">📈</span>
                        <span class="section-title">结果统计分析</span>
                    </div>
                    <table class="results-table">
                        <tr>
                            <td>平均传热系数</td>
                            <td class="value-column">
                                <div class="value-with-unit">
                                    <span class="value-number">${formatNumber(avgValue)}</span>
                                    <span class="value-unit">W/m²·K</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>最大差异（最大值与最小值之差）</td>
                            <td class="value-column">
                                <div class="value-with-unit">
                                    <span class="value-number">${formatNumber(difference)}</span>
                                    <span class="value-unit">W/m²·K</span>
                                    <span class="percentage">(差异率: ${formatNumber(percentDiff)}%)</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                    
                    <div class="result-chart">
                        <div class="chart-title">计算结果图示比较</div>
                        <div class="bar-chart">
                            ${Object.entries(results)
                                .filter(([_, result]) => typeof result === 'number')
                                .map(([name, result]) => {
                                    const correlationName = {
                                        'li_finlayson': 'Li & Finlayson',
                                        'dixon_cresswell': 'Dixon & Cresswell',
                                        'de_wasch_froment': 'De Wasch & Froment',
                                        'specchia': 'Specchia'
                                    }[name];
                                    
                                    const percent = (result / maxValue * 100).toFixed(1);
                                    let barClass = "";
                                    if (result === minValue) barClass = "min-bar";
                                    if (result === maxValue) barClass = "max-bar";
                                    
                                    return `
                                    <div class="chart-row">
                                        <div class="chart-label">${correlationName}</div>
                                        <div class="chart-bar-container">
                                            <div class="chart-bar ${barClass}" style="width: ${percent}%;">
                                                <span class="bar-value">${formatNumber(result)}</span>
                                            </div>
                                        </div>
                                    </div>`;
                                }).join('')}
                        </div>
                    </div>
                </div>`;
            }

            resultOutput += `</div><div class="completion-message">✅ 计算完成！✨</div>`;

            // Use innerHTML instead of textContent to render HTML
            resultText.innerHTML = resultOutput;

            // Switch to results tab
            document.querySelector('[data-tab="results"]').click();

        } catch (error) {
            alert(error.message);
        } finally {
            calculateBtn.disabled = false;
            loadingOverlay.classList.remove('show');
        }
    });

    // Modal functionality
    const modal = document.getElementById('formulaModal');
    const modalClose = document.querySelector('.modal-close');
    
    // Load MathJax dynamically
    async function loadMathJax() {
        if (window.MathJax) {
            return Promise.resolve(window.MathJax);
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML';
            script.async = true;
            script.onload = () => {
                window.MathJax.Hub.Config({
                    tex2jax: {
                        inlineMath: [['$', '$'], ['\\(', '\\)']],
                        displayMath: [['$$', '$$'], ['\\[', '\\]']],
                        processEscapes: true
                    },
                    CommonHTML: {
                        scale: 115,
                        linebreaks: { automatic: true },
                        styles: {
                            '.MathJax_Display': {
                                color: '#2C3E50 !important',
                                opacity: '0.85 !important',
                                'font-weight': 'normal !important',
                                'z-index': '100 !important'
                            },
                            '.MathJax': {
                                color: '#2C3E50 !important',
                                opacity: '0.85 !important',
                                'font-weight': 'normal !important',
                                'z-index': '100 !important'
                            },
                            '.MathJax *': {
                                color: '#2C3E50 !important',
                                opacity: '0.85 !important'
                            },
                            '.MathJax .mjx-char': {
                                color: '#2C3E50 !important',
                                opacity: '0.85 !important',
                                'font-weight': 'normal !important'
                            },
                            '.MathJax .mjx-chtml': {
                                'font-weight': 'normal !important'
                            },
                            '.MathJax_CHTML': {
                                color: '#2C3E50 !important',
                                opacity: '0.85 !important',
                                'font-weight': 'normal !important',
                                'z-index': '100 !important'
                            }
                        }
                    },
                    SVG: {
                        scale: 115,
                        font: 'Arial',
                        blacker: 0,
                        undefinedFamily: 'Arial'
                    },
                    'HTML-CSS': {
                        scale: 115,
                        availableFonts: ['STIX', 'Arial'],
                        preferredFont: 'Arial',
                        webFont: 'Arial',
                        imageFont: 'Arial',
                        undefinedFamily: 'Arial'
                    }
                });
                resolve(window.MathJax);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async function showModal() {
        modal.style.display = "block";
        loadingOverlay.classList.add('show');
        
        try {
            await loadMathJax();
            if (window.MathJax && window.MathJax.Hub) {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, modal]);
                await new Promise(resolve => {
                    window.MathJax.Hub.Queue(() => resolve());
                });
            }
        } catch (error) {
            console.error('Error rendering MathJax:', error);
        } finally {
            loadingOverlay.classList.remove('show');
        }

        const firstFocusable = modal.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) firstFocusable.focus();
    }

    function hideModal() {
        modal.style.display = 'none';
        loadingOverlay.classList.remove('show');
    }

    modalClose.addEventListener('click', hideModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });

    // Initialize with default values
    resetBtn.click();

    // Remove loading overlay after initialization
    loadingOverlay.classList.remove('show');
});
