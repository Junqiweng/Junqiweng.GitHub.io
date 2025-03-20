// 公式详情数据
const formulaDetails = {
    ergun: {
        title: "Ergun方程详解",
        formula: "\\[ \\frac{\\Delta P}{L} = \\frac{150(1-\\varepsilon)^2\\mu u_0}{\\varepsilon^3 d_p^2} + \\frac{1.75(1-\\varepsilon)\\rho u_0^2}{\\varepsilon^3 d_p} \\]",
        parameters: [
            ["L", "床层高度", "固定床反应器中填料的总高度"],
            ["dp", "颗粒直径", "填充颗粒的等效直径"],
            ["ε", "空隙率", "床层中空隙体积与总体积之比"],
            ["μ", "流体粘度", "流体的动力粘度"],
            ["u₀", "流体表观速度", "基于空管的表观流速"],
            ["ρ", "流体密度", "操作条件下流体的密度"]
        ],
        theory: `Ergun方程是最广泛使用的压降计算关联式，由Ergun在1952年提出。该方程考虑了两个主要的压降来源：
        1. 粘性耗散（层流效应）：与流速的一次方成正比
        2. 动能耗散（湍流效应）：与流速的平方成正比
        
        此方程适用范围广泛，可用于计算雷诺数在0.1-1000范围内的压降。`,
        applicability: `<p>适用条件：</p>
<ul>
    <li>球形或近似球形颗粒</li>
    <li>颗粒尺寸均匀</li>
    <li>床层空隙率在0.35-0.7之间</li>
    <li>床径与颗粒直径比大于10</li>
</ul>`
    },
    carman_kozeny: {
        title: "Carman-Kozeny方程详解",
        formula: "\\[ \\frac{\\Delta P}{L} = \\frac{180(1-\\varepsilon)^2\\mu u_0}{\\varepsilon^3 d_p^2} \\]",
        parameters: [
            ["L", "床层高度", "固定床反应器中填料的总高度"],
            ["ε", "空隙率", "床层中空隙体积与总体积之比"],
            ["μ", "流体粘度", "流体的动力粘度"],
            ["u₀", "流体表观速度", "基于空管的表观流速"],
            ["dp", "颗粒直径", "填充颗粒的等效直径"]
        ],
        theory: `Carman-Kozeny方程是从Kozeny-Carman理论发展而来，主要考虑层流条件下的压降。
        该方程将固定床视为一系列弯曲的微小通道，通过引入水力半径概念推导得出。
        系数180是经验常数，代表了通道的曲折度和实际流动路径的延长。`,
        applicability: `<p>适用条件：</p>
<ul>
    <li>低雷诺数区域（Re < 10）</li>
    <li>层流条件</li>
    <li>颗粒形状规则</li>
    <li>颗粒尺寸分布较窄</li>
</ul>`
    },
    burke_plummer: {
        title: "Burke-Plummer方程详解",
        formula: "\\[ \\frac{\\Delta P}{L} = \\frac{1.75(1-\\varepsilon)\\rho u_0^2}{\\varepsilon^3 d_p} \\]",
        parameters: [
            ["L", "床层高度", "固定床反应器中填料的总高度"],
            ["ε", "空隙率", "床层中空隙体积与总体积之比"],
            ["ρ", "流体密度", "流体密度"],
            ["u₀", "流体表观速度", "基于空管的表观流速"],
            ["dp", "颗粒直径", "填充颗粒的等效直径"]
        ],
        theory: `Burke-Plummer方程描述了湍流区域的压降行为，是Ergun方程的高雷诺数极限形式。
        在高流速下，惯性力占主导地位，压降主要由动能损失引起，与流速的平方成正比。
        系数1.75是通过大量实验数据拟合得到的经验常数。`,
        applicability: `<p>适用条件：</p>
<ul>
    <li>高雷诺数区域（Re > 1000）</li>
    <li>湍流条件</li>
    <li>惯性力主导的流动</li>
    <li>适用于气体和液体系统</li>
</ul>`
    },
    eisfeld_schnitzlein: {
        title: "Eisfeld-Schnitzlein方程详解",
        formula: "\\[ \\frac{\\Delta P}{L} = \\frac{A(1-\\varepsilon)^2\\mu u_0}{\\varepsilon^3 d_p^2} + \\frac{B(1-\\varepsilon)\\rho u_0^2}{\\varepsilon^3 d_p} \\]",
        parameters: [
            ["L", "床层高度", "固定床反应器中填料的总高度"],
            ["dp", "颗粒直径", "填充颗粒的等效直径"],
            ["ε", "空隙率", "床层中空隙体积与总体积之比"],
            ["μ", "流体粘度", "流体的动力粘度"],
            ["u₀", "流体表观速度", "基于空管的表观流速"],
            ["ρ", "流体密度", "流体密度"],
            ["D", "柱直径", "反应器内径"],
            ["A,B", "修正系数", "与颗粒形状和管径比相关的修正系数"]
        ],
        theory: `Eisfeld-Schnitzlein方程是对Ergun方程的改进，特别考虑了壁面效应的影响。
        通过引入管径与颗粒直径之比(D/dp)的修正项，更准确地描述了小管径反应器中的压降。
        修正系数A和B是复杂的经验关联式，随颗粒形状变化。`,
        applicability: `<p>适用条件：</p>
<ul>
    <li>适用于各种雷诺数范围</li>
    <li>特别适合于管径与颗粒直径比小于50的情况</li>
    <li>可处理不同形状的颗粒</li>
    <li>考虑了壁面效应的影响</li>
</ul>`
    },
    dixon_no_wall: {
        title: "Dixon方程(无壁面效应)详解",
        formula: "\\[ \\frac{\\Delta P}{L} = \\frac{\\rho u_0^2(1-\\varepsilon)}{\\varepsilon^3 d_p} \\left[ \\frac{160}{Re_m} + \\left(0.922 + \\frac{16}{Re_m^{0.46}}\\right)\\frac{Re_m}{Re_m+52} \\right] \\]",
        parameters: [
            ["L", "床层高度", "固定床反应器中填料的总高度"],
            ["ρ", "流体密度", "流体密度"],
            ["u₀", "流体表观速度", "基于空管的表观流速"],
            ["dp", "颗粒直径", "填充颗粒的等效直径"],
            ["ε", "空隙率", "床层中空隙体积与总体积之比"],
            ["Re_m", "修正雷诺数", "考虑空隙率影响的修正雷诺数"]
        ],
        theory: `Dixon无壁面效应方程是基于理论分析和实验数据的综合模型。
        通过引入修正雷诺数(Re_m)概念，更好地描述了流体在多孔介质中的流动行为。
        方程包含了从层流到湍流的平滑过渡项。`,
        applicability: `<p>适用条件：</p>
<ul>
    <li>适用于广泛的雷诺数范围</li>
    <li>球形或近似球形颗粒</li>
    <li>均匀填充床层</li>
    <li>忽略壁面效应的情况</li>
</ul>`
    },
    dixon_with_wall: {
        title: "Dixon方程(有壁面效应)详解",
        formula: "\\[ \\frac{\\Delta P}{L} = \\frac{\\rho u_0^2(1-\\varepsilon)}{\\varepsilon^3 d_p} \\left[ \\frac{160}{Re_m}\\left(1 + \\frac{2\\alpha}{3(1-\\varepsilon)N}\\right)^2 + \\left(0.922 + \\frac{16}{Re_m^{0.46}}\\right)\\frac{Re_m}{Re_m+52} \\right] \\]",
        parameters: [
            ["L", "床层高度", "固定床反应器中填料的总高度"],
            ["ρ", "流体密度", "流体密度"],
            ["u₀", "流体表观速度", "基于空管的表观流速"],
            ["dp", "颗粒直径", "填充颗粒的等效直径"],
            ["ε", "空隙率", "床层中空隙体积与总体积之比"],
            ["Re_m", "修正雷诺数", "考虑空隙率影响的修正雷诺数"],
            ["N", "管径比", "柱直径与颗粒直径之比"],
            ["α", "壁面系数", "描述壁面效应强度的系数"]
        ],
        theory: `Dixon有壁面效应方程在无壁面效应方程的基础上，增加了壁面影响的修正项。
        通过引入管径比(N)和壁面系数(α)，更准确地描述了壁面效应对压降的影响。
        该方程特别适用于管径较小的反应器。`,
        applicability: `<p>适用条件：</p>
<ul>
    <li>适用于广泛的雷诺数范围</li>
    <li>考虑壁面效应的影响</li>
    <li>适用于小管径反应器</li>
    <li>可处理不同的颗粒形状</li>
</ul>`
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize info links for equations
    document.querySelectorAll('.equation-info').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent equation item click
            showFormulaDetails(e.target.dataset.formula);
        });
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

    // Default values for reset
    const defaultValues = {
        bed_length: 1,
        void_fraction: 0.4,
        particle_diameter: 0.006,
        fluid_velocity: 1,
        fluid_density: 1.225,
        fluid_viscosity: 1.81e-5,
        column_diameter: 0.03,
        particle_shape: "球形"
    };

    // Clear all inputs
    clearBtn.addEventListener('click', () => {
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.value = '';
        });
        document.getElementById('particle_shape').value = '球形';
    });

    // Reset to default values
    resetBtn.addEventListener('click', () => {
        Object.entries(defaultValues).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.value = value;
        });
    });

    // Calculation functions
    function calculateErgun(L, ε, dp, u0, ρ, μ) {
        return (L / dp) * (
            (150 * (1 - ε) ** 2 * μ * u0) / (ε ** 3 * dp) +
            (1.75 * (1 - ε) * ρ * u0 ** 2) / (ε ** 3)
        );
    }

    function calculateCarmanKozeny(L, ε, dp, u0, μ) {
        return (L * 180 * (1 - ε) ** 2 * μ * u0) / (dp ** 2 * ε ** 3);
    }

    function calculateBurkePlummer(L, ε, dp, u0, ρ) {
        return (L * 1.75 * (1 - ε) * ρ * u0 ** 2) / (dp * ε ** 3);
    }

    function calculateEisfeldSchnitzlein(L, ε, dp, u0, ρ, μ, D, shape) {
        let K1, k1, k2;
        switch (shape) {
            case "球形":
                K1 = 154; k1 = 1.15; k2 = 0.87;
                break;
            case "圆柱形":
                K1 = 190; k1 = 2.00; k2 = 0.77;
                break;
            default: // 不规则形状
                K1 = 155; k1 = 1.42; k2 = 0.83;
        }

        const Aw = 1 + (2 / 3) / (D / dp) / (1 - ε);
        const Bw = (k1 * (dp / D) ** 2 + k2) ** 2;
        const A = K1 * Aw ** 2;
        const B = Aw / Bw;

        return (L / dp) * (
            (A * (1 - ε) ** 2 * μ * u0) / (ε ** 3 * dp) +
            (B * (1 - ε) * ρ * u0 ** 2) / (ε ** 3)
        );
    }

    function calculateDixonNoWall(L, ε, dp, u0, ρ, μ) {
        const Re = (ρ * u0 * dp) / μ;
        const Re_m = Re / (1 - ε);
        const term1 = 160.0 / Re_m;
        // 修正后的公式
        const term2 = (0.922 + 16 / Re_m ** 0.46)*(Re_m / (Re_m + 52));
        return (L * ρ * u0 ** 2 / dp * (1 - ε) / ε ** 3) * (term1 + term2);
    }

    function calculateDixonWithWall(L, ε, dp, u0, ρ, μ, N, alpha = 0.564) {
        const Re = (ρ * u0 * dp) / μ;
        const Re_m = Re / (1 - ε);
        const term1 = (160 / Re_m) * (1 + (2 * alpha) / (3 * (1 - ε) * N))**2;
        // 修正后的公式
        const term2 = (0.922 + (16 / (Re_m**0.46))) * (Re_m / (Re_m + 52));
        return (L * ρ * u0 ** 2 / dp * (1 - ε) / ε ** 3) * (term1 + term2);
    }

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

    // Format number to scientific notation if needed
    function formatNumber(num) {
        if (num === 0) return '0';
        const absNum = Math.abs(num);
        if (absNum < 0.01 || absNum >= 10000) {
            return num.toExponential(4);
        }
        return num.toFixed(4);
    }

    // Main calculation
    calculateBtn.addEventListener('click', () => {
        if (!validateInputs()) {
            return;
        }

        calculateBtn.classList.add('loading');
        calculateBtn.disabled = true;

        try {
            // Get input values
            const L = parseFloat(document.getElementById('bed_length').value);
            const ε = parseFloat(document.getElementById('void_fraction').value);
            const dp = parseFloat(document.getElementById('particle_diameter').value);
            const u0 = parseFloat(document.getElementById('fluid_velocity').value);
            const ρ = parseFloat(document.getElementById('fluid_density').value);
            const μ = parseFloat(document.getElementById('fluid_viscosity').value);
            const D = parseFloat(document.getElementById('column_diameter').value);
            const shape = document.getElementById('particle_shape').value;

            // Validate inputs
            if ([L, ε, dp, u0, ρ, μ, D].some(isNaN) || ε >= 1 || ε <= 0) {
                throw new Error('请确保所有输入都是有效的数值，且空隙率必须在0到1之间！');
            }

            // Calculate Re and N
            const Re = (ρ * u0 * dp) / (μ * (1 - ε));
            const N = D / dp;

            // Calculate pressure drops
            const equations = [
                {id: 'ergun', name: 'Ergun方程', func: () => calculateErgun(L, ε, dp, u0, ρ, μ)},
                {id: 'carman_kozeny', name: 'Carman-Kozeny方程', func: () => calculateCarmanKozeny(L, ε, dp, u0, μ)},
                {id: 'burke_plummer', name: 'Burke-Plummer方程', func: () => calculateBurkePlummer(L, ε, dp, u0, ρ)},
                {id: 'eisfeld_schnitzlein', name: 'Eisfeld-Schnitzlein方程', func: () => calculateEisfeldSchnitzlein(L, ε, dp, u0, ρ, μ, D, shape)},
                {id: 'dixon_no_wall', name: 'Dixon方程(无壁面效应)', func: () => calculateDixonNoWall(L, ε, dp, u0, ρ, μ)},
                {id: 'dixon_with_wall', name: 'Dixon方程(有壁面效应)', func: () => calculateDixonWithWall(L, ε, dp, u0, ρ, μ, N)}
            ];

            // Check if at least one equation is selected
            const selectedCount = equations.filter(eq => document.getElementById(eq.id).checked).length;
            if (selectedCount === 0) {
                throw new Error('请至少选择一种计算方程！');
            }

            // Calculate results
            const results = [];
            equations.forEach((eq) => {
                if (document.getElementById(eq.id).checked) {
                    const dp_value = eq.func();
                    results.push({
                        name: eq.name,
                        value: dp_value,
                        id: eq.id
                    });
                }
            });

            // Update results text using HTML structure
            let resultOutput = `<div class="section-header">🔍 计算结果</div>`;

            // 操作条件表格
            resultOutput += `
            <div class="section-header">📝 操作条件</div>
            <table class="results-table">
                <tr>
                    <th>参数</th>
                    <th>数值</th>
                </tr>
                <tr>
                    <td>床层高度</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(L)}</span>
                            <span class="value-unit">m</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>空隙率</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(ε)}</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>颗粒直径</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(dp)}</span>
                            <span class="value-unit">m</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>流体速度</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(u0)}</span>
                            <span class="value-unit">m/s</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>流体密度</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(ρ)}</span>
                            <span class="value-unit">kg/m³</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>流体粘度</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(μ)}</span>
                            <span class="value-unit">Pa·s</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>柱直径</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(D)}</span>
                            <span class="value-unit">m</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>颗粒形状</td>
                    <td class="value-column">${shape}</td>
                </tr>
            </table>

            <div class="section-header">📊 特征参数</div>
            <table class="results-table">
                <tr>
                    <th>参数</th>
                    <th>数值</th>
                </tr>
                <tr>
                    <td>雷诺数 (Re)</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(Re)}</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>管径与颗粒直径之比 (N)</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(N)}</span>
                        </div>
                    </td>
                </tr>
            </table>

            <div class="section-header">💡 压降计算结果</div>
            <table class="results-table">
                <tr>
                    <th>计算方程</th>
                    <th>压降结果 (kPa)</th>
                </tr>`;

            // 找到最小和最大压降值
            const values = results.map(r => r.value/1000);
            const minValue = Math.min(...values);
            const maxValue = Math.max(...values);

            results.forEach((result) => {
                const value_kPa = formatNumber(result.value/1000);
                let indication = '';
                if (results.length > 1) {
                    if (result.value/1000 === minValue) indication = '<span class="min-value">▼ 最小</span>';
                    if (result.value/1000 === maxValue) indication = '<span class="max-value">▲ 最大</span>';
                }
                
                resultOutput += `
                <tr>
                    <td>
                        ${result.name}
                        <a href="#" class="info-link" data-formula="${result.id}" title="查看公式详情">ℹ️</a>
                    </td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${value_kPa}</span>
                            <span class="value-unit">kPa</span>
                            ${indication}
                        </div>
                    </td>
                </tr>`;
            });

            resultOutput += '</table>';

            // 添加结果对比提示
            if (results.length > 1) {
                const difference = formatNumber(maxValue - minValue);
                const avgValue = formatNumber(values.reduce((a, b) => a + b, 0) / values.length);
                resultOutput += `
                <div class="section-header">📈 结果统计分析</div>
                <table class="results-table">
                    <tr>
                        <td>平均压降</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${avgValue}</span>
                                <span class="value-unit">kPa</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>最大差异（最大值与最小值之差）</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${difference}</span>
                                <span class="value-unit">kPa</span>
                            </div>
                        </td>
                    </tr>
                </table>`;
            }

            resultOutput += `
            <div class="completion-message">✅ 计算完成！✨</div>`;
            
            // Use innerHTML instead of textContent to render HTML
            resultText.innerHTML = resultOutput;

            // Update event listeners for all info links
            document.querySelectorAll('.info-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    showFormulaDetails(e.target.dataset.formula);
                });
            });

    // Switch to results tab
    document.querySelector('[data-tab="results"]').click();

    // Add click handlers for equation info links
    document.querySelectorAll('.equation-info').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent equation item click
            showFormulaDetails(e.target.dataset.formula);
        });
    });
        } catch (error) {
            alert(error.message);
        } finally {
            calculateBtn.classList.remove('loading');
            calculateBtn.disabled = false;
        }
    });

    // Enhanced Modal functionality
    const modal = document.getElementById('formulaModal');
    const modalClose = document.querySelector('.modal-close');
    
    function showModal() {
        modal.style.display = "block";
        // Trigger animation
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
    }
    
    function hideModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = "none";
            // Clear content when modal is fully hidden
            document.getElementById('formulaDetail').innerHTML = '';
        }, 300); // Match transition duration
    }
    
    // Enhanced modal functionality
    function handleModalClose(e) {
        if (e) e.preventDefault();
        hideModal();
    }

    function handleModalClick(e) {
        if (e.target === modal) {
            hideModal();
        }
    }

    function handleKeyboard(e) {
        if (!modal.classList.contains('show')) return;
        
        if (e.key === 'Escape') {
            hideModal();
        }
        
        // Trap focus within modal
        if (e.key === 'Tab') {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    }

    modalClose.addEventListener('click', handleModalClose);
    modal.addEventListener('click', handleModalClick);
    document.addEventListener('keydown', handleKeyboard);

    // Accessibility improvements
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modalClose.setAttribute('aria-label', '关闭详情');

    // Function to show formula details
    function showFormulaDetails(formulaId) {
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
            showModal();
            // Focus first interactive element
            setTimeout(() => {
                const firstFocusable = modal.querySelector(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (firstFocusable) firstFocusable.focus();
            }, 100);
        
        // Trigger MathJax to render the new content
        MathJax.typesetPromise && MathJax.typesetPromise();
    }
});
