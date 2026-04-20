// Format number to scientific notation if needed
function formatNumber(num) {
    if (num === 0) return '0';
    if (!isFinite(num) || isNaN(num)) return '无效数字';
    const absNum = Math.abs(num);
    if (absNum < 0.001 || absNum >= 10000) {
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

// 3. Sato et al. Lockhart-Martinelli型经验关联式
function calculateSatoModel(L, ε, dp, uL, uG, ρL, ρG, μL, μG, σ) {
    const ΔPL = calculateSinglePhasePressureDrop(L, ε, dp, uL, ρL, μL);
    const ΔPG = calculateSinglePhasePressureDrop(L, ε, dp, uG, ρG, μG);
    const X = Math.sqrt(ΔPL / ΔPG);

    if (!Number.isFinite(X) || X <= 0) {
        throw new Error('Sato关联式无法计算：Martinelli参数X必须为正有限值。');
    }

    // Sato et al. 适用范围：0.1 < X < 20（来源：Walas, Chemical Process Equipment, 引用 Sato 1973）
    if (X < 0.1 || X > 20) {
        console.warn(`Sato关联式：Martinelli参数 X=${X.toFixed(3)} 超出适用范围 0.1–20，结果仅供参考。`);
    }

    // Sato et al. 常用写法以 φ_L 表示液相两相乘子，压降使用 φ_L^2。
    const φL = 1.30 + 1.85 * Math.pow(X, -0.85);
    return ΔPL * φL * φL;
}

// 4. Attou-Boyer-Ferschneider型三相阻力闭合
function calculateAttouBoyerFerschneider(L, ε, dp, uL, uG, ρL, ρG, μL, μG, σ) {
    const αMin = 0.02;
    const αMax = 0.98;

    function calcForceBalance(αG) {
        const liquidSaturation = 1 - αG;
        const εG = ε * αG;
        const εL = ε * liquidSaturation;
        const uGi = uG / εG;
        const uLi = uL / εL;
        const ε3 = ε ** 3;

        // Attou型闭合中的液-固阻力项，单位为 Pa/m。
        const ALS = 150 * ((1 - ε) ** 2) / ((liquidSaturation ** 3) * ε3 * (dp ** 2));
        const BLS = 1.75 * (1 - ε) / ((liquidSaturation ** 3) * ε3 * dp);
        const FLS = ALS * μL * uLi + BLS * ρL * uLi * uLi;

        // 气-液界面阻力项；结构因子来自部分被液体占据孔隙的水力直径修正。
        const gasVoidFactor = Math.max(1 - ε * αG, 1e-12);
        const structureFactor = Math.pow((1 - ε) / gasVoidFactor, 1 / 3);
        const AGL = 150 * (gasVoidFactor ** 2) / ((αG ** 3) * ε3 * (dp ** 2)) * structureFactor;
        const BGL = 1.75 * gasVoidFactor / ((αG ** 3) * ε3 * dp) * structureFactor;
        const uRel = Math.abs(uGi - uLi);
        const FGL = εG * (AGL * μG * uRel + BGL * ρG * uRel * uRel);

        const residual = FGL - αG * FLS;
        const dPdz = FGL / Math.max(εG, 1e-12);
        return { residual, dPdz };
    }

    let lower = αMin;
    let upper = αMax;
    let previousAlpha = lower;
    let previous = calcForceBalance(previousAlpha);
    let bestAlpha = previousAlpha;
    let best = previous;
    let bracket = null;

    for (let i = 1; i <= 240; i++) {
        const αG = αMin + (αMax - αMin) * i / 240;
        const current = calcForceBalance(αG);
        if (Math.abs(current.residual) < Math.abs(best.residual)) {
            bestAlpha = αG;
            best = current;
        }
        if (previous.residual * current.residual <= 0) {
            bracket = [previousAlpha, αG];
            break;
        }
        previousAlpha = αG;
        previous = current;
    }

    if (bracket) {
        lower = bracket[0];
        upper = bracket[1];
        for (let i = 0; i < 80; i++) {
            const mid = 0.5 * (lower + upper);
            const fLower = calcForceBalance(lower);
            const fMid = calcForceBalance(mid);
            if (fLower.residual * fMid.residual <= 0) {
                upper = mid;
            } else {
                lower = mid;
            }
        }
        bestAlpha = 0.5 * (lower + upper);
        best = calcForceBalance(bestAlpha);
    }

    if (!Number.isFinite(best.dPdz) || best.dPdz <= 0) {
        throw new Error('Attou-Boyer-Ferschneider模型无法得到正的压降梯度。');
    }

    return best.dPdz * L;
}

// 5. Holub原始模型需要液持率-压降联立；未实现时不输出伪数值
function calculateHolubModel(L, ε, dp, uL, uG, ρL, ρG, μL, μG, σ, D) {
    throw new Error('Holub原始模型需要液持率、滑移因子和单相Ergun常数联立求解；当前版本不输出未经文献核实的简化压降。');
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
        <p>这是涓流床压降计算的基础模型，虽然简单但在许多情况下提供较好的估计。</p>
        <p><strong>⚠️ Chisholm系数C的使用限制：</strong>本实现固定取 C=20，这是 Chisholm (1967) 对管内<strong>湍流-湍流</strong>两相流的推荐值。对于涓流床中液相层流（Re<sub>L</sub>&lt;2000）或气相层流情形，C 应分别取10（液层/气湍）、12（液湍/气层）或5（层流-层流），使用固定C=20可能在低流速工况引入误差。</p>`,
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
        title: "Sato et al. 关联式详解",
        formula: "\\[ \\Delta P_{TP} = \\Delta P_L \\phi_L^2, \\quad \\phi_L = 1.30 + 1.85X^{-0.85}, \\quad X = \\sqrt{\\frac{\\Delta P_L}{\\Delta P_G}} \\]",
        parameters: [
            ["ΔP_TP", "两相流压降", "气液两相流通过床层的总压降"],
            ["ΔP_L", "液相单相压降", "仅液相通过床层的压降"],
            ["ΔP_G", "气相单相压降", "仅气相通过床层的压降"],
            ["φ_L", "液相两相乘子", "Sato关联式给出的液相压降乘子"],
            ["X", "Martinelli参数", "液相与气相单相压降比值的平方根"]
        ],
        theory: `<p><strong>Sato et al. 关联式</strong>采用Lockhart-Martinelli型参数X描述两相压降增大效应。</p>
        <p>该模型的主要特点：</p>
        <ul>
            <li>分别计算液相、气相单独通过填充床的压降</li>
            <li>用X = (ΔP<sub>L</sub>/ΔP<sub>G</sub>)<sup>1/2</sup> 表示相对流动阻力</li>
            <li>用φ<sub>L</sub><sup>2</sup>将液相单相压降换算为两相压降</li>
        </ul>
        <p>该式仍属于经验关联式，超出原实验范围时应进行装置标定或与其他模型交叉验证。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于可用Lockhart-Martinelli参数描述的涓流床两相压降</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">建议范围：0.1 &lt; X &lt; 20</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✗</span>
        <span class="condition-text">不显式包含表面张力、润湿效率和流型转变</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✗</span>
        <span class="condition-text">不应外推到强脉动流、喷射流或明显液泛区域</span>
    </div>
</div>`
    },
    attou_boyer_ferschneider: {
        title: "Attou-Boyer-Ferschneider型三相阻力闭合详解",
        formula: "\\[ F_{LS}=A_{LS}\\mu_Lu_{Li}+B_{LS}\\rho_Lu_{Li}^2, \\quad F_{GL}=\\varepsilon_G(A_{GL}\\mu_Gu_r+B_{GL}\\rho_Gu_r^2), \\quad F_{GL}=\\alpha_GF_{LS}, \\quad \\Delta P=L\\frac{F_{GL}}{\\varepsilon_G} \\]",
        parameters: [
            ["ΔP", "两相流压降", "气液两相流通过床层的总压降"],
            ["F_LS", "液-固阻力", "单位床层体积内液相与固体颗粒之间的阻力，单位Pa/m"],
            ["F_GL", "气-液界面阻力", "单位床层体积内气液界面阻力，单位Pa/m"],
            ["α_G", "气相饱和度", "气相占床层空隙体积的比例"],
            ["ε_G", "气相持率", "ε_G = εα_G"],
            ["u_Li, u_Gi", "相内速度", "由表观速度除以对应相持率得到"],
            ["A_LS, B_LS", "液-固阻力系数", "Ergun型粘性项和惯性项系数"],
            ["A_GL, B_GL", "气-液阻力系数", "气液界面Ergun型粘性项和惯性项系数"]
        ],
        theory: `<p><strong>Attou-Boyer-Ferschneider型模型</strong>将涓流床看作气、液、固三相相互作用体系，通过液-固和气-液阻力闭合求解气相饱和度。</p>
        <p>该模型的关键思想：</p>
        <ul>
            <li>液-固阻力采用Ergun型粘性项与惯性项</li>
            <li>气-液界面阻力采用孔隙占据修正后的Ergun型系数</li>
            <li>通过F<sub>GL</sub> = α<sub>G</sub>F<sub>LS</sub>求解稳态摩擦压降闭合</li>
            <li>当前实现忽略轴向加速度和重力项，输出摩擦压降</li>
        </ul>
        <p>该实现已删除旧版任意的(1+3α<sub>G</sub>)经验放大项，但仍应视为Attou型摩擦闭合实现，而非完整含重力/惯性项的一维CFD模型。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于稳态、均匀涓流区的摩擦压降估算</span>
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
        <span class="condition-text">不包含液泛、脉动流转变、轴向加速度和重力压头</span>
    </div>
</div>`
    },
    holub_model: {
        title: "Holub原始模型状态说明",
        formula: "\\[ \\text{当前版本不计算Holub压降。原模型需联立液持率、压降、滑移/剪切因子和单相Ergun常数。} \\]",
        parameters: [
            ["ΔP_TP", "两相流压降", "Holub模型的目标输出之一"],
            ["H_L", "液持率", "与压降联立求解的关键状态变量"],
            ["E_1, E_2", "Ergun常数", "由单相流数据确定的床层参数"],
            ["f_s, f_v", "滑移/剪切因子", "扩展Holub模型中的相间相互作用修正"],
            ["流型判据", "涓流-脉动转变", "原模型还包含流型转变判据"]
        ],
        theory: `<p><strong>Holub模型</strong>是孔尺度/狭缝型现象模型，用于同时预测压降、液持率和涓流-脉动流转变。</p>
        <p>本计算器不再输出旧版简化切换式，原因如下：</p>
        <ul>
            <li>原模型不是单一φ<sub>L</sub><sup>2</sup>经验切换式</li>
            <li>压降与液持率需要联立求解</li>
            <li>扩展模型还需要滑移和剪切因子，公开摘要不足以完整复现</li>
        </ul>
        <p>在完整文献公式和参数表补齐前，Holub项保持禁用，避免给出看似精确但不可追溯的压降值。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✗</span>
        <span class="condition-text">当前版本禁用数值计算</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">可作为后续实现液持率-压降联立模型的文档占位</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✗</span>
        <span class="condition-text">不可与旧版简化流型切换式等同</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✗</span>
        <span class="condition-text">需要原文方程、参数和求解策略后才能启用</span>
    </div>
</div>`
    }
};

const formulaReferences = {
    lockhart_martinelli: [
        {
            text: "Lockhart, R. W.; Martinelli, R. C. (1949). Proposed correlation of data for isothermal two-phase, two-component flow in pipes. Chemical Engineering Progress, 45, 39-48.",
            url: "https://scholar.google.com/scholar?q=Lockhart+Martinelli+1949+Proposed+correlation+of+data+for+isothermal+two-phase+two-component+flow"
        }
    ],
    larkins_white_jeffrey: [
        {
            text: "Larkins, R. P.; White, R. R.; Jeffrey, D. W. Trickle-bed pressure-drop correlation source and later model comparisons.",
            url: "https://www.sciencedirect.com/science/article/abs/pii/0009250988871045"
        }
    ],
    sato_model: [
        {
            text: "Sato, Y.; Hirose, T.; Takahashi, F.; Toda, M. (1973). Pressure drop and liquid holdup in gas-liquid concurrent flow in granular beds. Journal of Chemical Engineering of Japan, 6, 147-152.",
            url: "https://doi.org/10.1252/jcej.6.147"
        },
        {
            text: "Walas, S. M. Chemical Process Equipment: Selection and Design, Fig. 6.9; public scan with Sato correlation.",
            url: "https://enky-afina.ru/f/710_chemical_process_equipment_selection_and_design_stm_walas.pdf"
        }
    ],
    attou_boyer_ferschneider: [
        {
            text: "Attou, A.; Boyer, C.; Ferschneider, G. (1999). Modelling of the hydrodynamics of the cocurrent gas-liquid trickle flow through a trickle-bed reactor. Chemical Engineering Science, 54, 785-802.",
            url: "https://doi.org/10.1016/S0009-2509(98)00285-1"
        }
    ],
    holub_model: [
        {
            text: "Holub, R. A.; Dudukovic, M. P.; Ramachandran, P. A. (1992). A phenomenological model for pressure drop, liquid holdup, and flow regime transition in gas-liquid trickle flow. Chemical Engineering Science, 47, 2343-2348.",
            url: "https://doi.org/10.1016/0009-2509(92)87058-X"
        }
    ]
};

function renderFormulaReferences(formulaId) {
    const references = formulaReferences[formulaId] || [];
    if (!references.length) return '';

    return `
            <div class="formula-section references-section">
                <h4>
                    <span class="section-icon">📚</span>
                    <span class="section-title">参考文献</span>
                </h4>
                <div class="theory-content">
                    <div class="theory-card">
                        <ul>
                            ${references.map(ref => `<li><a href="${ref.url}" target="_blank" rel="noopener noreferrer">${ref.text}</a></li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>`;
}

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
            ${renderFormulaReferences(formulaId)}
        </div>
    `;

    detailContent.innerHTML = content;

    try {
        await showModal();
        if (typeof window.scheduleMathJaxTypeset === 'function') {
            window.scheduleMathJaxTypeset(detailContent);
            setTimeout(() => {
                document.querySelectorAll('.mjx-chtml').forEach(el => {
                    el.style.overflow = 'visible';
                    el.style.maxWidth = 'none';
                });
            }, 600);
        }
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
                try {
                    modal.style.display = "block";
                    await showFormulaDetail(formulaId);
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
                    name: 'Sato et al. 关联式',
                    value: value
                });
            }
            
            if (selectedEquations.attou_boyer_ferschneider) {
                const value = calculateAttouBoyerFerschneider(L, ε, dp, uL, uG, ρL, ρG, μL, μG, σ);
                results.push({
                    id: 'attou_boyer_ferschneider',
                    name: 'Attou-Boyer-Ferschneider型三相阻力闭合',
                    value: value
                });
            }
            
            if (selectedEquations.holub_model) {
                calculateHolubModel(L, ε, dp, uL, uG, ρL, ρG, μL, μG, σ, D);
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
