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
function generateResultsTable(L, ε, dp, u0, ρ, μ, D, shape, Re, N, results) {
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
    
    output += `
        <div class="result-card chart-card">
            <div class="section-header">
                <span class="section-icon">📊</span>
                <span class="section-title">压降结果可视化比较</span>
            </div>
            <div class="result-chart">
                <div class="chart-title">各计算方程结果比较</div>
                <div class="bar-chart">
                    ${results.map(result => {
                        const percent = (result.value/1000 / maxValue * 100).toFixed(1);
                        let barClass = "";
                        if (result.value/1000 === minValue) barClass = "min-bar";
                        if (result.value/1000 === maxValue) barClass = "max-bar";
                        
                        return `
                        <div class="chart-row">
                            <div class="chart-label">${result.name}</div>
                            <div class="chart-bar-container">
                                <div class="chart-bar ${barClass}" style="width: 0%;" data-width="${percent}%">
                                    <span class="bar-value">${formatNumber(result.value/1000)} kPa</span>
                                </div>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        </div>
        <div class="completion-message">✅ 计算完成！您可以修改输入参数重新计算 ✨</div>
    </div>`;
    
    return output;
}

// Calculate pressure drop functions
function calculateErgun(L, ε, dp, u0, ρ, μ) {
    return (L / dp) * (
        (150 * (1 - ε) ** 2 * μ * u0) / (ε ** 3 * dp) +
        (1.75 * (1 - ε) * ρ * u0 ** 2) / (ε ** 3)
    );
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
    const term2 = (0.922 + 16 / Re_m ** 0.46)*(Re_m / (Re_m + 52));
    return (L * ρ * u0 ** 2 / dp * (1 - ε) / ε ** 3) * (term1 + term2);
}

function calculateDixonWithWall(L, ε, dp, u0, ρ, μ, N, alpha = 0.564) {
    const Re = (ρ * u0 * dp) / μ;
    const Re_m = Re / (1 - ε);
    const term1 = (160 / Re_m) * (1 + (2 * alpha) / (3 * (1 - ε) * N))**2;
    const wallDamping = 1 - Math.exp(-0.22 * N);
    const term2 = (0.922 + (16 * wallDamping / (Re_m**0.46))) * (Re_m / (Re_m + 52));
    return (L * ρ * u0 ** 2 / dp * (1 - ε) / ε ** 3) * (term1 + term2);
}

function calculateKTA(L, ε, dp, u0, ρ, μ) {
    const Re = (ρ * u0 * dp) / μ;
    const Re_m = Re / (1 - ε);
    
    // 第一个公式：摩擦系数计算
    const fk = 160 / Re_m + 3.0 / Math.pow(Re_m, 0.1);
    
    // 第二个公式中的参数
    const ΔPdp = -L * ρ * u0 * u0 / (dp * ε * ε * ε);
    
    // 计算最终压降
    const dP = ΔPdp * (1 - ε) * fk;
    
    return Math.abs(dP); // 返回压降的绝对值
}

// Formula details data
const formulaDetails = {
    ergun: {
        title: "Ergun方程详解",
        formula: "\\[ \\frac{\\Delta P}{L} = \\frac{150(1-\\varepsilon)^2\\mu u_0}{\\varepsilon^3 d_p^2} + \\frac{1.75(1-\\varepsilon)\\rho u_0^2}{\\varepsilon^3 d_p} \\]",
        parameters: [
            ["L", "床层高度", "固定床反应器中填料的总高度"],
            ["d_p", "颗粒直径", "填充颗粒的等效直径"],
            ["ε", "空隙率", "床层中空隙体积与总体积之比"],
            ["μ", "流体粘度", "流体的动力粘度"],
            ["u_0", "流体表观速度", "基于空管的表观流速"],
            ["ρ", "流体密度", "操作条件下流体的密度"]
        ],
        theory: `<p><strong>Ergun方程</strong>是最广泛使用的压降计算关联式，由Ergun在1952年提出。</p>
        <p>该方程考虑了两个主要的压降来源：</p>
        <ol>
            <li><strong>粘性耗散（层流效应）</strong>：与流速的一次方成正比</li>
            <li><strong>动能耗散（湍流效应）</strong>：与流速的平方成正比</li>
        </ol>
        <p>此方程适用范围广泛，可用于计算雷诺数在0.1-1000范围内的压降。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">球形或近似球形颗粒</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">颗粒尺寸均匀</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">床层空隙率在0.35-0.7之间</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">床径与颗粒直径比大于10</span>
    </div>
</div>`
    },
    eisfeld_schnitzlein: {
        title: "Eisfeld-Schnitzlein方程详解",
        formula: "\\[ \\frac{\\Delta P}{L} = \\frac{A(1-\\varepsilon)^2\\mu u_0}{\\varepsilon^3 d_p^2} + \\frac{B(1-\\varepsilon)\\rho u_0^2}{\\varepsilon^3 d_p} \\]",
        parameters: [
            ["L", "床层高度", "固定床反应器中填料的总高度"],
            ["d_p", "颗粒直径", "填充颗粒的等效直径"],
            ["ε", "空隙率", "床层中空隙体积与总体积之比"],
            ["μ", "流体粘度", "流体的动力粘度"],
            ["u_0", "流体表观速度", "基于空管的表观流速"],
            ["ρ", "流体密度", "流体密度"],
            ["D", "柱直径", "反应器内径"],
            ["A,B", "修正系数", "与颗粒形状和管径比相关的修正系数"]
        ],
        theory: `<p><strong>Eisfeld-Schnitzlein方程</strong>是对Ergun方程的改进，特别考虑了壁面效应的影响。</p>
        <p>其主要特点：</p>
        <ul>
            <li>通过引入管径与颗粒直径之比(D/dp)的修正项，更准确地描述了小管径反应器中的压降</li>
            <li>修正系数A和B是复杂的经验关联式，随颗粒形状变化</li>
            <li>对于壁面效应显著的情况，该方程提供了更精确的预测</li>
        </ul>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于各种雷诺数范围</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">特别适合于管径与颗粒直径比小于50的情况</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">可处理不同形状的颗粒</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">考虑了壁面效应的影响</span>
    </div>
</div>`
    },
    dixon_no_wall: {
        title: "Dixon方程(无壁面效应)详解",
        formula: "\\[ \\frac{\\Delta P}{L} = \\frac{\\rho u_0^2(1-\\varepsilon)}{\\varepsilon^3 d_p} \\left[ \\frac{160}{Re_m} + \\left(0.922 + \\frac{16}{Re_m^{0.46}}\\right)\\frac{Re_m}{Re_m+52} \\right] \\]",
        parameters: [
            ["L", "床层高度", "固定床反应器中填料的总高度"],
            ["ρ", "流体密度", "流体密度"],
            ["u_0", "流体表观速度", "基于空管的表观流速"],
            ["d_p", "颗粒直径", "填充颗粒的等效直径"],
            ["ε", "空隙率", "床层中空隙体积与总体积之比"],
            ["Re_m", "修正雷诺数", "考虑空隙率影响的修正雷诺数"]
        ],
        theory: `<p><strong>Dixon无壁面效应方程</strong>是基于理论分析和实验数据的综合模型。</p>
        <p>该方程的显著特点：</p>
        <ul>
            <li>通过引入修正雷诺数(Re<sub>m</sub>)概念，更好地描述了流体在多孔介质中的流动行为</li>
            <li>方程包含了从层流到湍流的平滑过渡项</li>
            <li>适用于更广泛的雷诺数范围，能够准确预测不同流动条件下的压降</li>
        </ul>
        <p>修正雷诺数定义为：Re<sub>m</sub> = Re/(1-ε)，其中Re为常规雷诺数</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于广泛的雷诺数范围</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">球形或近似球形颗粒</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">均匀填充床层</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">忽略壁面效应的情况</span>
    </div>
</div>`
    },
    dixon_with_wall: {
        title: "Dixon方程(有壁面效应)详解",
        formula: "\\[ \\frac{\\Delta P}{L} = \\frac{\\rho u_0^2(1-\\varepsilon)}{\\varepsilon^3 d_p} \\left[ \\frac{160}{Re_m}\\left(1 + \\frac{2\\alpha}{3(1-\\varepsilon)N}\\right)^2 + \\left(0.922 + \\frac{16(1-e^{-0.22N})}{Re_m^{0.46}}\\right)\\frac{Re_m}{Re_m+52} \\right] \\]",
        parameters: [
            ["L", "床层高度", "固定床反应器中填料的总高度"],
            ["ρ", "流体密度", "流体密度"],
            ["u_0", "流体表观速度", "基于空管的表观流速"],
            ["d_p", "颗粒直径", "填充颗粒的等效直径"],
            ["ε", "空隙率", "床层中空隙体积与总体积之比"],
            ["Re_m", "修正雷诺数", "考虑空隙率影响的修正雷诺数"],
            ["N", "管径比", "柱直径与颗粒直径比"],
            ["α", "壁面系数", "描述壁面效应强度的系数"]
        ],
        theory: `<p><strong>Dixon有壁面效应方程</strong>在无壁面效应方程的基础上，增加了壁面影响的修正项。</p>
        <p>关键改进：</p>
        <ul>
            <li>通过引入管径比(N)和壁面系数(α)，更准确地描述了壁面效应对压降的影响</li>
            <li>壁面系数α通常取值为0.564（球形颗粒）</li>
            <li>修正项(1 + 2α/3(1-ε)N)<sup>2</sup>考虑了近壁区域流动变化</li>
            <li>惯性过渡项中的(1-e<sup>-0.22N</sup>)用于描述有限管径比下的壁效应衰减</li>
        </ul>
        <p>该方程特别适用于管径较小的反应器，当N<30时，壁面效应变得显著。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于广泛的雷诺数范围</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">考虑壁面效应的影响</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于小管径反应器</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">可处理不同的颗粒形状</span>
    </div>
</div>`
    },
    kta: {
        title: "KTA方程详解",
        formula: "\\[ \\frac{\\Delta P}{L} = \\frac{\\rho u_0^2(1-\\varepsilon)}{\\varepsilon^3 d_p} \\cdot \\left( \\frac{160}{Re_m} + \\frac{3.0}{Re_m^{0.1}} \\right), \\quad \\text{其中} \\quad Re_m = \\frac{\\rho u_0 d_p}{\\mu(1-\\varepsilon)} \\]",
        parameters: [
            ["L", "床层高度", "固定床反应器中填料的总高度"],
            ["d_p", "颗粒直径", "填充颗粒的等效直径"],
            ["ε", "空隙率", "床层中空隙体积与总体积之比"],
            ["μ", "流体粘度", "流体的动力粘度"],
            ["u_0", "流体表观速度", "基于空管的表观流速"],
            ["ρ", "流体密度", "操作条件下流体的密度"],
            ["Re_m", "修正雷诺数", "考虑空隙率影响的修正雷诺数"]
        ],
        theory: `<p><strong>KTA方程</strong>是由德国核安全标准委员会(Kerntechnischer Ausschuss, KTA)推荐的固定床压降关联式。</p>
        <p>该方程的主要特点：</p>
        <ul>
            <li>方程中的摩擦阻力系数表达式直接合并在主方程中，考虑了层流区和湍流区的平滑过渡</li>
            <li>通过修正雷诺数(Re<sub>m</sub>)概念描述颗粒周围的实际流动状态</li>
            <li>方程结构简单但预测精度高，特别适用于工程应用</li>
            <li>在高雷诺数区域具有良好的预测性能</li>
        </ul>
        <p>方程中括号内的第一项(160/Re<sub>m</sub>)代表层流贡献，第二项(3.0/Re<sub>m</sub><sup>0.1</sup>)代表湍流贡献。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于雷诺数在1-10000范围内</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">球形或近似球形颗粒</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">空隙率在0.36-0.42之间最准确</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">特别适用于核工业应用场景</span>
    </div>
</div>`
    }
};

const formulaReferences = {
    ergun: [
        {
            text: "Ergun, S. (1952). Fluid flow through packed columns. Chemical Engineering Progress, 48(2), 89-94.",
            url: "https://www.sciencedirect.com/science/article/abs/pii/S0032591011001410"
        }
    ],
    eisfeld_schnitzlein: [
        {
            text: "Eisfeld, B.; Schnitzlein, K. (2001). The influence of confining walls on the pressure drop in packed beds. Chemical Engineering Science, 56, 4321-4329.",
            url: "https://doi.org/10.1016/S0009-2509(00)00533-9"
        }
    ],
    dixon_no_wall: [
        {
            text: "Dixon, A. G. (2023). General correlation for pressure drop through randomly-packed beds of spheres with negligible wall effects. AIChE Journal, 69, e18035.",
            url: "https://doi.org/10.1002/aic.18035"
        }
    ],
    dixon_with_wall: [
        {
            text: "Dixon, A. G. (2024). Are there wall effects on pressure drop through randomly packed beds of spherical catalyst particles? AIChE Journal, 70, e18272.",
            url: "https://doi.org/10.1002/aic.18272"
        }
    ],
    kta: [
        {
            text: "KTA 3102.3 / pebble-bed pressure-drop friction factor reference used in nuclear fixed-bed evaluations.",
            url: "https://www.sciencedirect.com/science/article/pii/S0029549321001655"
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

let mathJaxLoadPromise = null;

function ensureMathJaxReady(timeoutMs = 5000) {
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
        return Promise.resolve(window.MathJax);
    }

    if (mathJaxLoadPromise) {
        return mathJaxLoadPromise;
    }

    mathJaxLoadPromise = new Promise((resolve) => {
        if (!document.getElementById('MathJax-script')) {
            const script = document.createElement('script');
            script.id = 'MathJax-script';
            script.async = true;
            script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
            script.onerror = () => resolve(null);
            document.head.appendChild(script);
        }

        const startedAt = Date.now();
        const timer = setInterval(() => {
            if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
                clearInterval(timer);
                resolve(window.MathJax);
            } else if (Date.now() - startedAt > timeoutMs) {
                clearInterval(timer);
                resolve(null);
            }
        }, 50);
    });

    return mathJaxLoadPromise;
}

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
                <div class="formula-math" data-formula="${formulaId}">
                    ${formula.formula}
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

    const modal = document.getElementById('formulaModal');
    modal.style.display = 'block';

    const firstFocusable = modal.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) firstFocusable.focus();

    const renderMath = async () => {
        const mathJax = await ensureMathJaxReady();
        if (mathJax) {
            try {
                await mathJax.typesetPromise([detailContent]);
            } catch (error) {
                console.error('MathJax typesetting error:', error);
            }
        }

        detailContent.querySelectorAll('.formula-math.loading').forEach(el => el.classList.remove('loading'));
    };

    if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(renderMath, { timeout: 1500 });
    } else {
        window.setTimeout(renderMath, 300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Loading indicator
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // 添加input-error样式
    const style = document.createElement('style');
    style.textContent = `
        .input-error {
            border-color: transparent !important;
            background-color: white !important;
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
    
    // Hide loading overlay once page is loaded
    window.addEventListener('load', function() {
        loadingOverlay.classList.remove('show');
    });

    // 从浏览器后退缓存恢复页面时，避免保留离开前的加载遮罩。
    window.addEventListener('pageshow', function() {
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
                try {
                    await showFormulaDetails(formulaId);
                } catch (error) {
                    console.error('Error showing formula details:', error);
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
    const particleShapeSelect = document.getElementById('particle_shape');

    // 颗粒形状选择事件监听
    particleShapeSelect.addEventListener('change', function() {
        if (this.value === '球形') {
            this.classList.add('sphere-selected');
        } else {
            this.classList.remove('sphere-selected');
        }
    });

    // 初始化时如果默认选中球形，添加特殊样式
    if (particleShapeSelect.value === '球形') {
        particleShapeSelect.classList.add('sphere-selected');
    }

    // 初始化时检查所有输入字段，确保没有显示默认验证错误状态
    document.querySelectorAll('input[type="number"]').forEach(input => {
        // 监听输入变化，在输入过程中隐藏验证错误
        input.addEventListener('input', function() {
            this.classList.remove('input-error');
        });
    });

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
        // 应用球形颗粒样式
        particleShapeSelect.classList.add('sphere-selected');
    });

    // Reset to default values
    resetBtn.addEventListener('click', () => {
        Object.entries(defaultValues).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.value = value;
        });
        // 检查是否为球形颗粒并应用样式
        if (particleShapeSelect.value === '球形') {
            particleShapeSelect.classList.add('sphere-selected');
        } else {
            particleShapeSelect.classList.remove('sphere-selected');
        }
    });

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

    // Main calculation
    calculateBtn.addEventListener('click', () => {
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
            const u0 = parseFloat(document.getElementById('fluid_velocity').value);
            const ρ = parseFloat(document.getElementById('fluid_density').value);
            const μ = parseFloat(document.getElementById('fluid_viscosity').value);
            const D = parseFloat(document.getElementById('column_diameter').value);
            const shape = document.getElementById('particle_shape').value;

            // Validate inputs
            if ([L, ε, dp, u0, ρ, μ, D].some(isNaN)) {
                throw new Error('请确保所有输入都是有效的数值！');
            }

            // Calculate Re and N
            const Re = (ρ * u0 * dp) / (μ * (1 - ε));
            const N = D / dp;

            // Calculate pressure drops
            const equations = [
                {id: 'ergun', name: 'Ergun方程', func: () => calculateErgun(L, ε, dp, u0, ρ, μ)},
                {id: 'eisfeld_schnitzlein', name: 'Eisfeld-Schnitzlein方程', func: () => calculateEisfeldSchnitzlein(L, ε, dp, u0, ρ, μ, D, shape)},
                {id: 'dixon_no_wall', name: 'Dixon方程(无壁面效应)', func: () => calculateDixonNoWall(L, ε, dp, u0, ρ, μ)},
                {id: 'dixon_with_wall', name: 'Dixon方程(有壁面效应)', func: () => calculateDixonWithWall(L, ε, dp, u0, ρ, μ, N)},
                {id: 'kta', name: 'KTA方程', func: () => calculateKTA(L, ε, dp, u0, ρ, μ)}
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
            let resultOutput = generateResultsTable(L, ε, dp, u0, ρ, μ, D, shape, Re, N, results);
            
            // Use innerHTML instead of textContent to render HTML
            document.getElementById('result-content-area').innerHTML = resultOutput;

            // Switch to results tab
            document.querySelector('[data-tab="results"]').click();

            // 添加动画序列效果
            setTimeout(() => {
                // 逐个显示结果卡片
                const resultCards = document.querySelectorAll('.result-card');
                resultCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                
                // 延迟显示图表动画
                setTimeout(() => {
                    const chartBars = document.querySelectorAll('.chart-bar');
                    chartBars.forEach((bar, index) => {
                        setTimeout(() => {
                            bar.style.width = bar.getAttribute('data-width');
                        }, index * 100);
                    });
                }, 500);
            }, 200);

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
