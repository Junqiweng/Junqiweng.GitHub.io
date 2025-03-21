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
        title: "Li & Finlayson 关联式详解",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.17(\\frac{d_p G}{\\mu})^{0.79} Pr^{0.33} (\\frac{d_p}{D_t})^{-0.25} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数"],
            ["Dt", "反应器直径", "固定床反应器内径"],
            ["ρ", "流体密度", "流体密度"],
            ["u₀", "流体表观速度", "流体通过床层的速度"]
        ],
        theory: `Li & Finlayson 关联式是用于估算固定床反应器壁面传热系数的经验公式。该关联式特别适用于工业应用中常见的低雷诺数区域（1 < Re < 100）。公式考虑了颗粒直径、流体物性、反应器几何等关键参数的影响。`,
        applicability: `<p>适用条件：</p>
<ul>
    <li>固定床反应器壁面传热系数计算</li>
    <li>1 < Re < 100</li>
    <li>适用于球形颗粒填充床</li>
    <li>适用于气相和液相系统</li>
</ul>`
    },
    dixon_cresswell: {
        title: "Dixon & Cresswell 关联式详解",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.23(\\frac{d_p G}{\\mu})^{0.7} Pr^{0.33} (\\frac{d_p}{D_t})^{-0.2} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `Dixon & Cresswell 关联式是另一种常用的固定床反应器壁面传热系数估算方法。该关联式在低雷诺数范围内表现出良好的预测精度，特别适合于实验室规模的反应器设计。`,
        applicability: `<p>适用条件：</p>
<ul>
    <li>固定床反应器壁面传热系数计算</li>
    <li>1 < Re < 50</li>
    <li>适用于球形和圆柱形颗粒</li>
    <li>适用于气相系统</li>
</ul>`
    },
    de_wasch_froment: {
        title: "De Wasch & Froment 关联式详解",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.31(\\frac{d_p G}{\\mu})^{0.93} Pr^{0.33} (\\frac{d_p}{D_t})^{-0.5} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `De Wasch & Froment 关联式适用于较高雷诺数范围的固定床反应器。该关联式特别考虑了管径与颗粒直径比的影响，在工业规模反应器中具有良好的适用性。`,
        applicability: `<p>适用条件：</p>
<ul>
    <li>固定床反应器壁面传热系数计算</li>
    <li>100 < Re < 1000</li>
    <li>适用于球形颗粒填充床</li>
    <li>适用于气相系统</li>
</ul>`
    },
    specchia: {
        title: "Specchia 关联式详解",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.27(\\frac{d_p G}{\\mu})^{0.85} Pr^{0.33} (\\frac{d_p}{D_t})^{-0.33} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `Specchia 关联式是一个适用范围较广的经验公式，特别适合中等雷诺数范围的应用。该关联式在工程应用中广受欢迎，因为它在各种操作条件下都能提供合理的预测结果。`,
        applicability: `<p>适用条件：</p>
<ul>
    <li>固定床反应器壁面传热系数计算</li>
    <li>50 < Re < 500</li>
    <li>适用于球形颗粒填充床</li>
    <li>适用于气相和液相系统</li>
</ul>`
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
                    <span class="formula-badge">TeX</span>
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
                                <td class="symbol-cell" title="数学符号">${symbol}</td>
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
                    <div class="theory-background">
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
        fluid_prandtl: 0.7,
        reactor_diameter: 0.05,
        fluid_thermal_conductivity: 0.025,
        fluid_density: 1.225,
        fluid_viscosity: 1.81e-5
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
            const fluidPrandtl = parseFloat(document.getElementById('fluid_prandtl').value);
            const reactorDiameter = parseFloat(document.getElementById('reactor_diameter').value);
            const fluidThermalConductivity = parseFloat(document.getElementById('fluid_thermal_conductivity').value);
            const fluidDensity = parseFloat(document.getElementById('fluid_density').value);
            const fluidViscosity = parseFloat(document.getElementById('fluid_viscosity').value);

            // Validate inputs
            if ([fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity].some(isNaN)) {
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
            let resultOutput = `<div class="section-header">🔍 计算结果</div>`;
            resultOutput += `
                <div class="section-header">💡 壁面传热系数计算结果 (Re = ${formatNumber(reynoldsNumber)})</div>
                <table class="results-table">
                    <tr>
                        <th>计算方程</th>
                        <th>壁面传热系数 h<sub>w</sub> (W/m²·K)</th>
                    </tr>`;

            for (const [name, result] of Object.entries(results)) {
                const correlationName = {
                    'li_finlayson': 'Li & Finlayson 关联式',
                    'dixon_cresswell': 'Dixon & Cresswell 关联式',
                    'de_wasch_froment': 'De Wasch & Froment 关联式',
                    'specchia': 'Specchia 关联式'
                }[name];

                resultOutput += `
                    <tr>
                        <td>${correlationName}</td>
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
                <div class="completion-message">✅ 计算完成！✨</div>
            `;

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
