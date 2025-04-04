// Format number to scientific notation if needed
function formatNumber(num) {
    if (num === 0) return '0';
    const absNum = Math.abs(num);
    if (absNum < 0.01 || absNum >= 10000) {
        return num.toExponential(4);
    }
    return num.toFixed(4);
}

// Function to generate results table
function generateResultsTable(L, ε, dp, uL, uG, ρL, ρG, μL, μG, σ, D, results) {
    let output = `
    <div class="results-wrapper">
        <div class="result-card condition-card">
            <div class="section-header">
                <span class="section-icon">📝</span>
                <span class="section-title">操作条件</span>
            </div>
            <table class="results-table">
                <tr><th>参数</th><th>数值</th></tr>
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
                    <td>液相表观速度</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(uL)}</span>
                            <span class="value-unit">m/s</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>气相表观速度</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(uG)}</span>
                            <span class="value-unit">m/s</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>液体密度</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(ρL)}</span>
                            <span class="value-unit">kg/m³</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>气体密度</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(ρG)}</span>
                            <span class="value-unit">kg/m³</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>液体粘度</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(μL)}</span>
                            <span class="value-unit">Pa·s</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>气体粘度</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(μG)}</span>
                            <span class="value-unit">Pa·s</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>表面张力</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(σ)}</span>
                            <span class="value-unit">N/m</span>
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
            </table>
        </div>

        <div class="result-card parameters-card">
            <div class="section-header">
                <span class="section-icon">📊</span>
                <span class="section-title">特征参数</span>
            </div>
            <table class="results-table">
                <tr>
                    <th>参数</th>
                    <th>数值</th>
                </tr>
                <tr>
                    <td>液相雷诺数 (Re<sub>L</sub>)</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(ρL * uL * dp / μL)}</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>气相雷诺数 (Re<sub>G</sub>)</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(ρG * uG * dp / μG)}</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Weber数 (We)</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(ρL * uL * uL * dp / σ)}</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>管径与颗粒直径之比 (N)</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(D / dp)}</span>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="result-card pressure-card">
            <div class="section-header">
                <span class="section-icon">💡</span>
                <span class="section-title">压降计算结果</span>
            </div>
            <table class="results-table">
                <tr>
                    <th>计算方程</th>
                    <th>压降结果 (kPa)</th>
                </tr>`;

    const values = results.map(r => r.value/1000);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    results.forEach((result) => {
        const value_kPa = formatNumber(result.value/1000);
        let indication = '';
        let badgeClass = '';
        
        if (results.length > 1) {
            if (result.value/1000 === minValue) {
                indication = '最小值';
                badgeClass = 'min-badge';
            }
            if (result.value/1000 === maxValue) {
                indication = '最大值';
                badgeClass = 'max-badge';
            }
        }
        
        output += `
        <tr>
            <td>
                <div class="equation-name">
                    ${result.name}
                    <a href="#" class="info-link" data-formula="${result.id}" title="查看公式">ℹ️</a>
                </div>
            </td>
            <td class="value-column">
                <div class="value-with-unit">
                    <span class="value-number">${value_kPa}</span>
                    <span class="value-unit">kPa</span>
                    ${indication ? `<span class="result-badge ${badgeClass}">${indication}</span>` : ''}
                </div>
            </td>
        </tr>`;
    });

    output += '</table></div>';

    if (results.length > 1) {
        const difference = formatNumber(maxValue - minValue);
        const avgValue = formatNumber(values.reduce((a, b) => a + b, 0) / values.length);
        const percentDiff = formatNumber((maxValue - minValue) / avgValue * 100);
        
        output += `
        <div class="result-card stats-card">
            <div class="section-header">
                <span class="section-icon">📈</span>
                <span class="section-title">结果统计分析</span>
            </div>
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
                            <span class="percentage">(差异率: ${percentDiff}%)</span>
                        </div>
                    </td>
                </tr>
            </table>
        </div>`;
    }

    output += '</div>';
    return output;
}

// Calculate single-phase pressure drop for liquid and gas
function calculateSinglePhasePressureDrop(L, ε, dp, u, ρ, μ) {
    // Use Ergun equation for single-phase pressure drop
    const Re = ρ * u * dp / μ;
    const ΔP = 150 * ((1-ε)*(1-ε)*μ*u) / (ε*ε*ε*dp*dp) + 1.75 * ((1-ε)*ρ*u*u) / (ε*ε*ε*dp);
    return ΔP * L;
}

// 1. Lockhart-Martinelli 方程
function calculateLockhartMartinelli(L, ε, dp, uL, uG, ρL, ρG, μL, μG) {
    // 计算单相压降
    const ΔPL = calculateSinglePhasePressureDrop(L, ε, dp, uL, ρL, μL);
    const ΔPG = calculateSinglePhasePressureDrop(L, ε, dp, uG, ρG, μG);
    
    // 计算马丁内利参数
    const X = Math.sqrt(ΔPL / ΔPG);
    
    // 计算二相流系数，使用Chisholm系数
    const C = 20; // 典型值，对于湍流-湍流情况
    const φL2 = 1 + C/X + 1/(X*X);
    
    // 计算两相压降
    const ΔP = ΔPL * φL2;
    
    return ΔP;
}

// 2. Larkins, White & Jeffrey方程
function calculateLarkinsWhiteJeffrey(L, ε, dp, uL, uG, ρL, ρG, μL, μG) {
    // 计算单相压降
    const ΔPL = calculateSinglePhasePressureDrop(L, ε, dp, uL, ρL, μL);
    
    // 修正系数，考虑床层影响
    const ReL = ρL * uL * dp / μL;
    const ReG = ρG * uG * dp / μG;
    
    // Larkins等人的修正系数，基于实验数据拟合
    const φL2 = 1 + 40 * (uG / uL) * Math.pow(ρG / ρL, 0.5) * Math.pow(ReL, -0.2);
    
    // 计算两相压降
    const ΔP = ΔPL * φL2;
    
    return ΔP;
}

// 3. Sato模型
function calculateSatoModel(L, ε, dp, uL, uG, ρL, ρG, μL, μG, σ) {
    // 单相压降
    const ΔPL = calculateSinglePhasePressureDrop(L, ε, dp, uL, ρL, μL);
    
    // 计算液相雷诺数和气相雷诺数
    const ReL = ρL * uL * dp / μL;
    const ReG = ρG * uG * dp / μG;
    
    // 计算韦伯数
    const We = ρL * uL * uL * dp / σ;
    
    // Sato修正因子，适用于高气液比的工况
    let φL2 = 1 + 25 * Math.pow(uG / uL, 0.8) * Math.pow(ReG / ReL, 0.3) * Math.pow(We, -0.15);
    
    // 限制修正因子的范围
    φL2 = Math.max(1, Math.min(φL2, 50));
    
    // 计算两相压降
    const ΔP = ΔPL * φL2;
    
    return ΔP;
}

// 4. Attou-Boyer-Ferschneider模型
function calculateAttouBoyerFerschneider(L, ε, dp, uL, uG, ρL, ρG, μL, μG, σ) {
    // 计算特征参数
    const ReL = ρL * uL * dp / μL;
    const αG = uG / (uL + uG); // 气相体积分率估计
    
    // 计算气液界面摩擦系数
    const fGL = 0.3 / ReL; // 简化的气液界面摩擦系数
    
    // 计算颗粒床阻力系数
    const κ = 150 * ((1-ε)*(1-ε)) / (ε*ε*ε) + 1.75 * (1-ε) / (ε*ε*ε) * ReL;
    
    // 计算三相作用下的压降
    const ΔP = (κ * μL * uL / (dp*dp) + fGL * ρL * uL * uL / dp) * (1 + 3 * αG) * L;
    
    return ΔP;
}

// 5. Holub模型
function calculateHolubModel(L, ε, dp, uL, uG, ρL, ρG, μL, μG, σ, D) {
    // 计算特征参数
    const ReL = ρL * uL * dp / μL;
    const ReG = ρG * uG * dp / μG;
    const We = ρL * uL * uL * dp / σ;
    const Fr = uL * uL / (9.81 * dp); // Froude数
    
    // 计算流型参数，用于判断是否为脉动流
    const flowParameterΨ = ReL * Math.pow(ReG, 0.4) * Math.pow(Fr, -0.6);
    
    let φL2;
    
    // 根据流型选择不同的压降计算模型
    if (flowParameterΨ < 100) {
        // 涓流区域 - 使用修正的Lockhart-Martinelli关联式
        const X = Math.sqrt(calculateSinglePhasePressureDrop(L, ε, dp, uL, ρL, μL) / calculateSinglePhasePressureDrop(L, ε, dp, uG, ρG, μG));
        φL2 = 1 + 20/X + 1/(X*X);
    } else {
        // 脉动流区域 - 考虑更高的压降
        φL2 = 1 + 60 * Math.pow(uG / uL, 0.9) * Math.pow(ReG / ReL, 0.2) * Math.pow(We, -0.1);
    }
    
    // 计算总压降
    const ΔP = calculateSinglePhasePressureDrop(L, ε, dp, uL, ρL, μL) * φL2;
    
    return ΔP;
}

// Formula details data
const formulaDetails = {
    lockhart_martinelli: {
        title: "Lockhart-Martinelli方程详解",
        formula: "\\[ \\Delta P_{TP} = \\Delta P_L \\cdot \\phi_L^2, \\quad \\text{其中} \\quad \\phi_L^2 = 1 + \\frac{C}{X} + \\frac{1}{X^2}, \\quad X = \\sqrt{\\frac{\\Delta P_L}{\\Delta P_G}} \\]",
        parameters: [
            ["ΔP_TP", "两相流压降", "气液两相流通过床层的总压降"],
            ["ΔP_L", "液相单相压降", "仅液相通过床层的压降"],
            ["ΔP_G", "气相单相压降", "仅气相通过床层的压降"],
            ["φ_L^2", "两相流系数", "液相压降的修正系数"],
            ["X", "Martinelli参数", "液相与气相压降比值的平方根"],
            ["C", "Chisholm系数", "经验修正系数，典型值为20"]
        ],
        theory: `<p><strong>Lockhart-Martinelli方程</strong>是最早应用于管道两相流的经典关联式，后被扩展到涓流床反应器。</p>
        <p>该方程的基本思想是：</p>
        <ul>
            <li>分别计算单相流体（液相和气相）通过床层的压降</li>
            <li>通过马丁内利参数X建立两相流压降与单相压降的关系</li>
            <li>引入修正系数φ_L^2来考虑两相间的相互作用</li>
        </ul>
        <p>这是涓流床压降计算的基础模型，虽然简单但在许多情况下提供较好的估计。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于低到中等气液流速</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">对于涓流流型具有较好预测</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✗</span>
        <span class="condition-text">高气液流速下预测精度降低</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✗</span>
        <span class="condition-text">脉动流和雾状流区域预测偏差较大</span>
    </div>
</div>`
    },
    larkins_white_jeffrey: {
        title: "Larkins, White & Jeffrey方程详解",
        formula: "\\[ \\Delta P_{TP} = \\Delta P_L \\cdot \\phi_L^2, \\quad \\text{其中} \\quad \\phi_L^2 = 1 + 40 \\left(\\frac{u_G}{u_L}\\right) \\left(\\frac{\\rho_G}{\\rho_L}\\right)^{0.5} Re_L^{-0.2} \\]",
        parameters: [
            ["ΔP_TP", "两相流压降", "气液两相流通过床层的总压降"],
            ["ΔP_L", "液相单相压降", "仅液相通过床层的压降"],
            ["φ_L^2", "两相流系数", "液相压降的修正系数"],
            ["u_G", "气相表观速度", "基于空管截面的气相表观流速"],
            ["u_L", "液相表观速度", "基于空管截面的液相表观流速"],
            ["ρ_G", "气体密度", "操作条件下气体的密度"],
            ["ρ_L", "液体密度", "液体密度"],
            ["Re_L", "液相雷诺数", "液相流体的雷诺数"]
        ],
        theory: `<p><strong>Larkins, White & Jeffrey方程</strong>是针对涓流床反应器的改进关联式，更好地考虑了床层特性对压降的影响。</p>
        <p>主要改进：</p>
        <ul>
            <li>通过引入液相雷诺数的幂函数修正，考虑流体-颗粒相互作用</li>
            <li>气液速度比和密度比的影响更加明确</li>
            <li>修正系数更适合于涓流床常见的操作条件</li>
        </ul>
        <p>该方程在涓流区域的中低雷诺数范围内具有较好的预测精度。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于典型的涓流床操作区域</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">对于低液相雷诺数情况预测较好</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">考虑了气液物性对压降的影响</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✗</span>
        <span class="condition-text">脉动流区域预测精度有限</span>
    </div>
</div>`
    },
    sato_model: {
        title: "Sato模型详解",
        formula: "\\[ \\Delta P_{TP} = \\Delta P_L \\cdot \\phi_L^2, \\quad \\text{其中} \\quad \\phi_L^2 = 1 + 25 \\left(\\frac{u_G}{u_L}\\right)^{0.8} \\left(\\frac{Re_G}{Re_L}\\right)^{0.3} We^{-0.15} \\]",
        parameters: [
            ["ΔP_TP", "两相流压降", "气液两相流通过床层的总压降"],
            ["ΔP_L", "液相单相压降", "仅液相通过床层的压降"],
            ["φ_L^2", "两相流系数", "液相压降的修正系数"],
            ["u_G", "气相表观速度", "基于空管截面的气相表观流速"],
            ["u_L", "液相表观速度", "基于空管截面的液相表观流速"],
            ["Re_G", "气相雷诺数", "气相流体的雷诺数"],
            ["Re_L", "液相雷诺数", "液相流体的雷诺数"],
            ["We", "韦伯数", "惯性力与表面张力的比值"]
        ],
        theory: `<p><strong>Sato模型</strong>是专为高气液通量条件下的涓流床反应器设计的压降模型。</p>
        <p>该模型的主要特点：</p>
        <ul>
            <li>引入韦伯数(We)考虑表面张力对压降的影响</li>
            <li>同时考虑气相和液相雷诺数的比值，更全面地描述相间作用</li>
            <li>通过经验系数25调整，适用于高气液流速工况</li>
        </ul>
        <p>在高气液比条件下，该模型考虑了更复杂的流动形态，预测精度优于经典Lockhart-Martinelli方程。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于高气液流速工况</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">考虑表面张力影响的情况</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">脉动流和过渡流区域预测较好</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✗</span>
        <span class="condition-text">超低液相雷诺数时可能预测不准</span>
    </div>
</div>`
    },
    attou_boyer_ferschneider: {
        title: "Attou-Boyer-Ferschneider模型详解",
        formula: "\\[ \\Delta P = \\left( \\kappa \\frac{\\mu_L u_L}{d_p^2} + f_{GL} \\frac{\\rho_L u_L^2}{d_p} \\right) (1 + 3\\alpha_G) L \\]",
        parameters: [
            ["ΔP", "两相流压降", "气液两相流通过床层的总压降"],
            ["κ", "床层阻力系数", "由Ergun方程计算的床层阻力系数"],
            ["μ_L", "液体粘度", "液体的动力粘度"],
            ["u_L", "液相表观速度", "液相表观流速"],
            ["d_p", "颗粒直径", "填充颗粒的特征直径"],
            ["f_GL", "气液界面摩擦系数", "气液两相间的摩擦系数"],
            ["ρ_L", "液体密度", "液体密度"],
            ["α_G", "气相体积分率", "反应器中气相占据的体积比例"],
            ["L", "床层高度", "反应器床层的总高度"]
        ],
        theory: `<p><strong>Attou-Boyer-Ferschneider模型</strong>是一种基于多相流力学的理论模型，考虑了气液固三相间的相互作用。</p>
        <p>该模型的关键思想：</p>
        <ul>
            <li>将床层中的流动视为气液固三相系统，而不仅是两相流</li>
            <li>考虑固体颗粒与流体间的摩擦、气液界面摩擦等多种作用力</li>
            <li>引入气相体积分率(α_G)作为关键参数，影响总压降</li>
            <li>将Ergun方程的床层阻力与气液界面阻力结合，获得更全面的模型</li>
        </ul>
        <p>这是一个更为理论化的模型，适用于各种操作条件和流型。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于各种气液流速工况</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">考虑气液固三相相互作用</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">理论基础更为坚实</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✗</span>
        <span class="condition-text">计算复杂度高于其他模型</span>
    </div>
</div>`
    },
    holub_model: {
        title: "Holub模型详解",
        formula: "\\[ \\Delta P_{TP} = \\Delta P_L \\cdot \\phi_L^2, \\quad \\text{其中} \\quad \\phi_L^2 = \\begin{cases} 1 + \\frac{20}{X} + \\frac{1}{X^2}, & \\text{涓流区域 } (\\Psi < 100) \\\\ 1 + 60 \\left(\\frac{u_G}{u_L}\\right)^{0.9} \\left(\\frac{Re_G}{Re_L}\\right)^{0.2} We^{-0.1}, & \\text{脉动流区域 } (\\Psi \\geq 100) \\end{cases} \\]",
        parameters: [
            ["ΔP_TP", "两相流压降", "气液两相流通过床层的总压降"],
            ["ΔP_L", "液相单相压降", "仅液相通过床层的压降"],
            ["φ_L^2", "两相流系数", "液相压降的修正系数，取决于流型"],
            ["X", "Martinelli参数", "液相与气相压降比值的平方根"],
            ["Ψ", "流型参数", "判断流型的无量纲参数"],
            ["Re_G", "气相雷诺数", "气相流体的雷诺数"],
            ["Re_L", "液相雷诺数", "液相流体的雷诺数"],
            ["We", "韦伯数", "惯性力与表面张力的比值"]
        ],
        theory: `<p><strong>Holub模型</strong>的独特之处在于它根据流型自动选择不同的关联式，是一种"智能"压降模型。</p>
        <p>该模型的核心亮点：</p>
        <ul>
            <li>引入流型参数Ψ = Re<sub>L</sub>·Re<sub>G</sub><sup>0.4</sup>·Fr<sup>-0.6</sup>，用于判断流型</li>
            <li>在涓流区域(Ψ < 100)采用修正的Lockhart-Martinelli关联式</li>
            <li>在脉动流区域(Ψ ≥ 100)采用针对高气液流速的改进关联式</li>
            <li>考虑了雷诺数、韦伯数和弗劳德数等多种无量纲参数的影响</li>
        </ul>
        <p>这种"自动切换"的特性使其在宽广的操作条件范围内具有良好的适用性。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于广泛的流型和操作条件</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">自动选择适合的关联式</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">考虑重力、惯性和表面张力多种效应</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">流型过渡区预测较准确</span>
    </div>
</div>`
    }
};

// Function to show modal with animation
async function showModal() {
    return new Promise((resolve) => {
        const modal = document.getElementById('formulaModal');
        modal.style.display = 'flex';
        
        // Force a reflow to ensure CSS transition works
        modal.offsetHeight;
        
        // Add a small delay to ensure smooth transition
        setTimeout(() => {
            resolve();
        }, 300);
    });
}

// Function to show formula details
async function showFormulaDetail(formulaId) {
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
    
    // 使用Promise确保MathJax渲染完成
    if (window.MathJax) {
        try {
            await MathJax.typesetPromise([detailContent]);
            // 确保公式元素已完全渲染
            document.querySelectorAll('.mjx-chtml').forEach(el => {
                el.style.overflow = 'visible';
                el.style.maxWidth = 'none';
            });
        } catch (error) {
            console.error('MathJax typesetting error:', error);
        }
    }
    
    try {
        await showModal();
    } catch (error) {
        console.error('Error showing modal:', error);
    } finally {
        document.getElementById('loading-overlay').classList.remove('show');
    }
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // 加载指示器
    const loadingOverlay = document.getElementById('loading-overlay');
    const modal = document.getElementById('formulaModal');
    const modalClose = document.querySelector('.modal-close');
    
    // 隐藏加载指示器
    window.addEventListener('load', function() {
        loadingOverlay.classList.remove('show');
    });
    
    // 在页面离开时显示加载指示器
    window.addEventListener('beforeunload', function() {
        loadingOverlay.classList.add('show');
    });
    
    // 使用事件委托处理公式链接点击
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.info-link, .equation-info')) {
            e.preventDefault();
            e.stopPropagation();
            const link = e.target.closest('.info-link, .equation-info');
            const formulaId = link.getAttribute('data-formula');
            
            if (formulaId) {
                loadingOverlay.classList.add('show');
                try {
                    modal.style.display = "block";
                    await showFormulaDetail(formulaId);
                    if (window.MathJax) {
                        await MathJax.typesetPromise([modal]);
                    }
                } catch (error) {
                    console.error('显示公式详情时出错:', error);
                } finally {
                    loadingOverlay.classList.remove('show');
                }
            }
        }
    });
    
    // 关闭模态框
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
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
    
    // 添加input-error样式
    const style = document.createElement('style');
    style.textContent = `
        .input-error {
            border-color: var(--error-color) !important;
            background-color: rgba(255, 0, 0, 0.05) !important;
        }
        input[type="number"] {
            border: 1px solid var(--border-color) !important;
            border-radius: var(--border-radius-sm) !important;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03) !important;
        }
        input[type="number"]:focus {
            border-color: var(--primary-color) !important;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
        }
    `;
    document.head.appendChild(style);
    
    // 初始化时检查所有输入字段，确保没有显示默认验证错误状态
    document.querySelectorAll('input[type="number"]').forEach(input => {
        // 监听输入变化，在输入过程中隐藏验证错误
        input.addEventListener('input', function() {
            this.classList.remove('input-error');
        });
    });
    
    // Performance optimization for navigation
    document.querySelectorAll('a[href]').forEach(link => {
        if (link.hostname === window.location.hostname) {
            // Preload same-domain pages
            let prefetcher = document.createElement('link');
            prefetcher.rel = 'prefetch';
            prefetcher.href = link.href;
            document.head.appendChild(prefetcher);
        }
    });
    
    // Calculate button functionality
    const calculateBtn = document.getElementById('calculate');
    calculateBtn.addEventListener('click', calculatePressureDrop);
    
    // Input validation
    function validateInputs() {
        const inputs = document.querySelectorAll('input[type="number"]');
        let isValid = true;
        
        inputs.forEach(input => {
            // 移除之前的验证状态
            input.classList.remove('input-error');
            
            // 检查是否为空
            if (!input.value) {
                input.classList.add('input-error');
                isValid = false;
                return;
            }
        });
        
        return isValid;
    }
    
    // Clear button functionality
    const clearBtn = document.getElementById('clear');
    clearBtn.addEventListener('click', () => {
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.value = '';
        });
        document.getElementById('result-content-area').innerHTML = `
            <div class="welcome-message">
                <div class="icon-container">
                    <i class="fas fa-chart-line pulse-animation"></i>
                </div>
                <h4>输入已清除</h4>
                <p>请重新输入参数并点击「✨ 计算压降 ✨」按钮开始计算</p>
            </div>
        `;
    });
    
    // Reset button functionality
    const resetBtn = document.getElementById('reset');
    resetBtn.addEventListener('click', () => {
        // Default values for reset
        const defaultValues = {
            bed_length: 1,
            void_fraction: 0.4,
            particle_diameter: 0.003,
            liquid_velocity: 0.01,
            gas_velocity: 0.1,
            liquid_density: 997,
            gas_density: 1.225,
            liquid_viscosity: 0.001,
            gas_viscosity: 1.81e-5,
            surface_tension: 0.072,
            column_diameter: 0.03
        };
        
        Object.entries(defaultValues).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.value = value;
        });
        
        document.querySelectorAll('.equation-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
        });
        
        document.getElementById('result-content-area').innerHTML = `
            <div class="welcome-message">
                <div class="icon-container">
                    <i class="fas fa-chart-line pulse-animation"></i>
                </div>
                <h4>参数已重置为默认值</h4>
                <p>请点击「✨ 计算压降 ✨」按钮开始计算</p>
            </div>
        `;
    });
    
    // Main calculation function
    function calculatePressureDrop() {
        if (!validateInputs()) {
            return;
        }
        
        loadingOverlay.classList.add('show');
        calculateBtn.disabled = true;
        
        try {
            // Get input values
            const L = parseFloat(document.getElementById('bed_length').value);
            const ε = parseFloat(document.getElementById('void_fraction').value);
            const dp = parseFloat(document.getElementById('particle_diameter').value);
            const uL = parseFloat(document.getElementById('liquid_velocity').value);
            const uG = parseFloat(document.getElementById('gas_velocity').value);
            const ρL = parseFloat(document.getElementById('liquid_density').value);
            const ρG = parseFloat(document.getElementById('gas_density').value);
            const μL = parseFloat(document.getElementById('liquid_viscosity').value);
            const μG = parseFloat(document.getElementById('gas_viscosity').value);
            const σ = parseFloat(document.getElementById('surface_tension').value);
            const D = parseFloat(document.getElementById('column_diameter').value);
            
            // Validate inputs
            if ([L, ε, dp, uL, uG, ρL, ρG, μL, μG, σ, D].some(isNaN)) {
                throw new Error('请确保所有输入都是有效的数值！');
            }
            
            // Get selected equations
            const selectedEquations = {
                lockhart_martinelli: document.getElementById('lockhart_martinelli').checked,
                larkins_white_jeffrey: document.getElementById('larkins_white_jeffrey').checked,
                sato_model: document.getElementById('sato_model').checked,
                attou_boyer_ferschneider: document.getElementById('attou_boyer_ferschneider').checked,
                holub_model: document.getElementById('holub_model').checked
            };
            
            // Check if at least one equation is selected
            const selectedCount = Object.values(selectedEquations).filter(Boolean).length;
            if (selectedCount === 0) {
                throw new Error('请至少选择一种计算方程！');
            }
            
            // Calculate results for selected equations
            const results = [];
            
            if (selectedEquations.lockhart_martinelli) {
                const value = calculateLockhartMartinelli(L, ε, dp, uL, uG, ρL, ρG, μL, μG);
                results.push({
                    id: 'lockhart_martinelli',
                    name: 'Lockhart-Martinelli方程',
                    value: value
                });
            }
            
            if (selectedEquations.larkins_white_jeffrey) {
                const value = calculateLarkinsWhiteJeffrey(L, ε, dp, uL, uG, ρL, ρG, μL, μG);
                results.push({
                    id: 'larkins_white_jeffrey',
                    name: 'Larkins, White & Jeffrey方程',
                    value: value
                });
            }
            
            if (selectedEquations.sato_model) {
                const value = calculateSatoModel(L, ε, dp, uL, uG, ρL, ρG, μL, μG, σ);
                results.push({
                    id: 'sato_model',
                    name: 'Sato模型',
                    value: value
                });
            }
            
            if (selectedEquations.attou_boyer_ferschneider) {
                const value = calculateAttouBoyerFerschneider(L, ε, dp, uL, uG, ρL, ρG, μL, μG, σ);
                results.push({
                    id: 'attou_boyer_ferschneider',
                    name: 'Attou-Boyer-Ferschneider模型',
                    value: value
                });
            }
            
            if (selectedEquations.holub_model) {
                const value = calculateHolubModel(L, ε, dp, uL, uG, ρL, ρG, μL, μG, σ, D);
                results.push({
                    id: 'holub_model',
                    name: 'Holub模型',
                    value: value
                });
            }
            
            // Display results
            const resultContent = document.getElementById('result-content-area');
            
            // Generate HTML for results
            resultContent.innerHTML = generateResultsTable(L, ε, dp, uL, uG, ρL, ρG, μL, μG, σ, D, results);
            
            // Switch to results tab
            document.querySelector('.tab-btn[data-tab="results"]').click();
        } catch (error) {
            alert(error.message || '计算过程中发生错误');
        } finally {
            // 恢复按钮状态，隐藏加载指示器
            calculateBtn.disabled = false;
            loadingOverlay.classList.remove('show');
        }
    }
}); 