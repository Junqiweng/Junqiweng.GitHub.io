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
        formula: "\\ [ \\frac{h_w d_p}{k_f} = 0.17\\left(\\frac{d_p G}{\\mu}\\right)^{0.79} \\mathrm{Pr}^{0.33} \\left(\\frac{d_p}{D_t}\\right)^{-0.25} \\]",
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
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.23\\left(\\frac{d_p G}{\\mu}\\right)^{0.7} \\mathrm{Pr}^{0.33} \\left(\\frac{d_p}{D_t}\\right)^{-0.2} \\]",
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
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.31\\left(\\frac{d_p G}{\\mu}\\right)^{0.93} \\mathrm{Pr}^{0.33} \\left(\\frac{d_p}{D_t}\\right)^{-0.5} \\]",
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
            <li>系数0.31较低，但在高雷诺数下通过指数项补偿</li>
            <li>雷诺数指数0.93表明在高流速下传热效果更好</li>
            <li>管径比指数-0.5最高，表明对反应器直径更敏感</li>
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
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.27\\left(\\frac{d_p G}{\\mu}\\right)^{0.85} \\mathrm{Pr}^{0.33} \\left(\\frac{d_p}{D_t}\\right)^{-0.33} \\]",
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
    },
    leva: {
        title: "Leva壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.813\\left(\\frac{d_p G}{\\mu}\\right)^{0.9} \\left(\\frac{d_p}{D_t}\\right)^{0.1} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数（Pr = μCp/kf），由其他参数计算得出"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Leva关联式</strong>是一个适用于低雷诺数范围的经验公式。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数0.813是四个关联式中最高的，预测传热系数通常较大</li>
            <li>雷诺数指数0.9是最高的，对流速最敏感</li>
            <li>管径比指数0.1最低，表明对反应器直径不敏感</li>
        </ul>
        <p>该关联式在低雷诺数范围内表现良好，是化工反应器设计中的重要工具。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：100 < Re < 2000</span>
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
    },
    martin_nilles: {
        title: "Martin & Nilles壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = \\left(1.3 + 5\\frac{d_p}{D_t}\\right) + 0.19\\mathrm{Pr}^{1/3}\\left(\\frac{d_p G}{\\mu}\\right)^{0.75} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数（Pr = μCp/kf），由其他参数计算得出"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Martin & Nilles关联式</strong>是一种广泛用于固定床壁面传热的经典关联式。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数0.19是四个关联式中最高的，预测传热系数通常更大</li>
            <li>雷诺数指数0.75是最高的，对流速最敏感</li>
            <li>管径比指数1/3是传热关联式中的常见值</li>
        </ul>
        <p>该关联式在工程应用中广受欢迎，因为它在各种操作条件下都能提供合理的预测结果。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：35 < Re < 500</span>
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
    },
    demirel_et_al: {
        title: "Demirel et al.壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.047\\left(\\frac{d_p G}{\\mu}\\right)^{0.927} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数（Pr = μCp/kf），由其他参数计算得出"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Demirel et al.关联式</strong>是一种广泛用于固定床壁面传热的经典关联式。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数0.047是四个关联式中最低的，预测传热系数通常较小</li>
            <li>雷诺数指数0.927是最高的，对流速最敏感</li>
            <li>管径比指数1/3是传热关联式中的常见值</li>
        </ul>
        <p>该关联式在工程应用中广受欢迎，因为它在各种操作条件下都能提供合理的预测结果。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：200 < Re < 1450</span>
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
    },
    laguerre_et_al: {
        title: "Laguerre et al.壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 1.56\\mathrm{Pr}^{1/3}\\left(\\frac{d_p G}{\\mu}\\right)^{0.42} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数（Pr = μCp/kf），由其他参数计算得出"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Laguerre et al.关联式</strong>是一个适用范围较广的经验公式，特别适合中等雷诺数范围的应用。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数1.56是四个关联式中最高的，预测传热系数通常较大</li>
            <li>雷诺数指数0.42是最高的，对流速最敏感</li>
            <li>管径比指数1/3是传热关联式中的常见值</li>
        </ul>
        <p>该关联式在工程应用中广受欢迎，因为它在各种操作条件下都能提供合理的预测结果。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：100 < Re < 400</span>
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
    },
    das_et_al: {
        title: "Das et al.壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 1.351 + 0.1124\\mathrm{Pr}^{1/3}\\left(\\frac{d_p G}{\\mu}\\right)^{0.878} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数（Pr = μCp/kf），由其他参数计算得出"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Das et al.关联式</strong>是一个适用范围较广的经验公式，特别适合中等雷诺数范围的应用。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数1.351是四个关联式中最高的，预测传热系数通常较大</li>
            <li>雷诺数指数0.878是最高的，对流速最敏感</li>
            <li>管径比指数1/3是传热关联式中的常见值</li>
        </ul>
        <p>该关联式在工程应用中广受欢迎，因为它在各种操作条件下都能提供合理的预测结果。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：1 < Re < 500</span>
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
    },
    leva_et_al: {
        title: "Leva et al.壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 3.5\\left(\\frac{d_p}{D_t}\\right)\\exp\\left(-4.6\\frac{d_p}{D_t}\\right)\\left(\\frac{d_p G}{\\mu}\\right)^{0.7} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数（Pr = μCp/kf），由其他参数计算得出"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Leva et al.关联式</strong>是一个适用于低雷诺数范围的经验公式。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数3.5是四个关联式中最高的，预测传热系数通常较大</li>
            <li>雷诺数指数0.7是最高的，对流速最敏感</li>
            <li>管径比指数-4.6最低，表明对反应器直径不敏感</li>
        </ul>
        <p>该关联式在低雷诺数范围内表现良好，是化工反应器设计中的重要工具。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：250 < Re < 3000</span>
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
    },
    chu_storrow: {
        title: "Chu & Storrow壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.17\\left(\\frac{d_p G}{\\mu}\\right)^{0.8} \\mathrm{Pr}^{0.33} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数（Pr = μCp/kf），由其他参数计算得出"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Chu & Storrow关联式</strong>是一种广泛用于固定床壁面传热的经典关联式。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数0.17是四个关联式中最高的，预测传热系数通常较大</li>
            <li>雷诺数指数0.8是最高的，对流速最敏感</li>
            <li>普朗特数指数1/3是传热关联式中的常见值</li>
        </ul>
        <p>该关联式在工程应用中广受欢迎，因为它在各种操作条件下都能提供合理的预测结果。</p>`,
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
    yagi_wakao: {
        title: "Yagi & Wakao壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.12\\left(\\frac{d_p G}{\\mu}\\right)^{0.8} \\mathrm{Pr}^{0.33} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数（Pr = μCp/kf），由其他参数计算得出"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Yagi & Wakao关联式</strong>是一种广泛用于固定床壁面传热的经典关联式。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数0.12是四个关联式中最高的，预测传热系数通常较大</li>
            <li>雷诺数指数0.8是最高的，对流速最敏感</li>
            <li>普朗特数指数1/3是传热关联式中的常见值</li>
        </ul>
        <p>该关联式在工程应用中广受欢迎，因为它在各种操作条件下都能提供合理的预测结果。</p>`,
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
    kunii_et_al: {
        title: "Kunii et al.壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.2\\left(\\frac{d_p G}{\\mu}\\right)^{0.75} \\mathrm{Pr}^{0.33} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数（Pr = μCp/kf），由其他参数计算得出"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Kunii et al.关联式</strong>是一种广泛用于固定床壁面传热的经典关联式。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数0.2是四个关联式中最高的，预测传热系数通常较大</li>
            <li>雷诺数指数0.75是最高的，对流速最敏感</li>
            <li>普朗特数指数1/3是传热关联式中的常见值</li>
        </ul>
        <p>该关联式在工程应用中广受欢迎，因为它在各种操作条件下都能提供合理的预测结果。</p>`,
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
    olbrich_potter: {
        title: "Olbrich & Potter壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.28\\left(\\frac{d_p G}{\\mu}\\right)^{0.8} \\mathrm{Pr}^{0.33} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数（Pr = μCp/kf），由其他参数计算得出"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Olbrich & Potter关联式</strong>是一种广泛用于固定床壁面传热的经典关联式。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数0.28是四个关联式中最高的，预测传热系数通常较大</li>
            <li>雷诺数指数0.8是最高的，对流速最敏感</li>
            <li>普朗特数指数1/3是传热关联式中的常见值</li>
        </ul>
        <p>该关联式在工程应用中广受欢迎，因为它在各种操作条件下都能提供合理的预测结果。</p>`,
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
    specchia_et_al: {
        title: "Specchia et al.壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.255\\left(\\frac{d_p G}{\\mu}\\right)^{0.8} \\mathrm{Pr}^{0.33} \\left(\\frac{d_p}{D_t}\\right)^{-0.28} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数（Pr = μCp/kf），由其他参数计算得出"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Specchia et al.关联式</strong>是一个适用范围较广的经验公式，特别适合中等雷诺数范围的应用。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数0.255是四个关联式中最高的，预测传热系数通常较大</li>
            <li>雷诺数指数0.8是最高的，对流速最敏感</li>
            <li>管径比指数-0.28介于其他关联式之间</li>
        </ul>
        <p>该关联式在工程应用中广受欢迎，因为它在各种操作条件下都能提供合理的预测结果。</p>`,
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
    colledge_paterson: {
        title: "Colledge & Paterson壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.6\\left(\\frac{d_p G}{\\mu}\\right)^{0.5} \\mathrm{Pr}^{0.33} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数（Pr = μCp/kf），由其他参数计算得出"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Colledge & Paterson关联式</strong>是一个适用范围较广的经验公式，特别适合中等雷诺数范围的应用。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数0.6是四个关联式中最高的，预测传热系数通常较大</li>
            <li>雷诺数指数0.5是最高的，对流速最敏感</li>
            <li>管径比指数1/3是传热关联式中的常见值</li>
        </ul>
        <p>该关联式在工程应用中广受欢迎，因为它在各种操作条件下都能提供合理的预测结果。</p>`,
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
    dixon_et_al: {
        title: "Dixon et al.壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.22\\left(\\frac{d_p G}{\\mu}\\right)^{0.76} \\mathrm{Pr}^{0.33} \\left(\\frac{d_p}{D_t}\\right)^{-0.2} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数（Pr = μCp/kf），由其他参数计算得出"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Dixon et al.关联式</strong>是一种广泛用于固定床壁面传热的经典关联式。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数0.22是四个关联式中最低的，预测传热系数通常较小</li>
            <li>雷诺数指数0.76是最高的，对流速最敏感</li>
            <li>管径比指数1/3是传热关联式中的常见值</li>
        </ul>
        <p>该关联式在工程应用中广受欢迎，因为它在各种操作条件下都能提供合理的预测结果。</p>`,
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
    peters_et_al: {
        title: "Peters et al.壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.36\\left(\\frac{d_p G}{\\mu}\\right)^{0.65} \\mathrm{Pr}^{0.33} \\]",
        parameters: [
            ["hw", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["dp", "颗粒直径", "填充颗粒的直径"],
            ["kf", "流体热导率", "流体热导率"],
            ["G", "质量流速", "G = ρ * u₀"],
            ["μ", "流体粘度", "流体粘度"],
            ["Pr", "普朗特数", "流体的普朗特数（Pr = μCp/kf），由其他参数计算得出"],
            ["Dt", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Peters et al.关联式</strong>是一个适用范围较广的经验公式，特别适合中等雷诺数范围的应用。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数0.36是四个关联式中最高的，预测传热系数通常较大</li>
            <li>雷诺数指数0.65是最高的，对流速最敏感</li>
            <li>管径比指数1/3是传热关联式中的常见值</li>
        </ul>
        <p>该关联式在工程应用中广受欢迎，因为它在各种操作条件下都能提供合理的预测结果。</p>`,
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
    
    // 显示模态框
    modal.style.display = "block";
    
    // 尝试通过两种方式渲染公式 - 支持新旧版本的MathJax
    try {
    if (window.MathJax) {
            // MathJax 3.x 版本
            if (window.MathJax.typesetPromise) {
                await window.MathJax.typesetPromise([detailContent]);
            } 
            // MathJax 2.x 版本
            else if (window.MathJax.Hub) {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, detailContent]);
                // 等待处理完成
                await new Promise(resolve => {
                    window.MathJax.Hub.Queue(() => resolve());
                });
            } else {
                console.warn("未检测到MathJax typeset方法");
            }
        } else {
            console.warn("MathJax未加载，正在尝试动态加载");
            await loadMathJax();
            if (window.MathJax.typesetPromise) {
                await window.MathJax.typesetPromise([detailContent]);
            } else if (window.MathJax.Hub) {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, detailContent]);
            }
        }
    } catch (error) {
        console.error('MathJax处理公式出错:', error);
    } finally {
        // 移除加载状态
        document.querySelectorAll('.formula-math.loading').forEach(el => {
            el.classList.remove('loading');
        });
        loadingOverlay.classList.remove('show');
    }
}

// Calculation functions for different correlations
function calculateLiFinlayson(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;

    const nuw = 0.17 * Math.pow(reynoldsNumber, 0.79) * Math.pow(fluidPrandtl, 0.33) * Math.pow(ratio, -0.25);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculateDixonCresswell(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;

    const hw = 0.23 * Math.pow(reynoldsNumber, 0.7) 
               * Math.pow(fluidPrandtl, 0.33) 
               * Math.pow(ratio, -0.2) 
               * (fluidThermalConductivity / particleDiameter);
    return hw;
}

function calculateDeWaschFroment(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;

    const hw = 0.31 * Math.pow(reynoldsNumber, 0.93) 
               * Math.pow(fluidPrandtl, 0.33) 
               * Math.pow(ratio, -0.5) 
               * (fluidThermalConductivity / particleDiameter);
    return hw;
}

function calculateSpecchia(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;

    const hw = 0.27 * Math.pow(reynoldsNumber, 0.85) 
               * Math.pow(fluidPrandtl, 0.33) 
               * Math.pow(ratio, -0.33) 
               * (fluidThermalConductivity / particleDiameter);
    return hw;
}

function calculateLeva(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;

    const nuw = 0.813 * Math.pow(reynoldsNumber, 0.9) * Math.pow(particleDiameter / reactorDiameter, 0.1);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculateMartinNilles(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;
    
    // 注意：这里公式里有ksr/kr但我们没有这个参数，假设是1
    const ksr_kr = 1;

    const nuw = (1.3 + 5 * particleDiameter / reactorDiameter) * ksr_kr + 
                0.19 * Math.pow(fluidPrandtl, 1/3) * 
                Math.pow(reynoldsNumber, 0.75);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculateDemirelEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;

    const nuw = 0.047 * Math.pow(reynoldsNumber, 0.927);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculateLaguerreEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;

    const nuw = 1.56 * Math.pow(fluidPrandtl, 1/3) * Math.pow(reynoldsNumber, 0.42);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculateDasEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;

    const nuw = 1.351 + 0.1124 * Math.pow(fluidPrandtl, 1/3) * Math.pow(reynoldsNumber, 0.878);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculateLevaEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;

    const nuw = 3.5 * (particleDiameter / reactorDiameter) * 
                Math.exp(-4.6 * particleDiameter / reactorDiameter) * 
                Math.pow(reynoldsNumber, 0.7);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculateChuStorrow(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;

    const nuw = 0.17 * Math.pow(reynoldsNumber, 0.8) * Math.pow(fluidPrandtl, 0.33);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculateYagiWakao(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;

    const nuw = 0.12 * Math.pow(reynoldsNumber, 0.8) * Math.pow(fluidPrandtl, 0.33);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculateKuniiEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;

    const nuw = 0.2 * Math.pow(reynoldsNumber, 0.75) * Math.pow(fluidPrandtl, 0.33);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculateOlbrichPotter(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;

    const nuw = 0.28 * Math.pow(reynoldsNumber, 0.8) * Math.pow(fluidPrandtl, 0.33);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculateSpecchiaEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;

    const nuw = 0.255 * Math.pow(reynoldsNumber, 0.8) * Math.pow(fluidPrandtl, 0.33) * Math.pow(ratio, -0.28);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculateColledgePaterson(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;

    const nuw = 0.6 * Math.pow(reynoldsNumber, 0.5) * Math.pow(fluidPrandtl, 0.33);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculateDixonEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;

    const nuw = 0.22 * Math.pow(reynoldsNumber, 0.76) * Math.pow(fluidPrandtl, 0.33) * Math.pow(ratio, -0.2);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculatePetersEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;

    const nuw = 0.36 * Math.pow(reynoldsNumber, 0.65) * Math.pow(fluidPrandtl, 0.33);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
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
            // 检查是否至少选择了一个计算方程
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            let hasChecked = false;
            
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    hasChecked = true;
                }
            });
            
            if (!hasChecked) {
                throw new Error('请至少选择一种计算方法！');
            }

            // Get input values
            const fluidVelocity = parseFloat(document.getElementById('fluid_velocity').value);
            const particleDiameter = parseFloat(document.getElementById('particle_diameter').value);
            const reactorDiameter = parseFloat(document.getElementById('reactor_diameter').value);
            const fluidThermalConductivity = parseFloat(document.getElementById('fluid_thermal_conductivity').value);
            const fluidDensity = parseFloat(document.getElementById('fluid_density').value);
            const fluidViscosity = parseFloat(document.getElementById('fluid_viscosity').value);
            const fluidHeatCapacity = parseFloat(document.getElementById('fluid_heat_capacity').value);

            // Calculate intermediate parameters
            const fluidPrandtl = (fluidViscosity * fluidHeatCapacity) / fluidThermalConductivity;
            const reynoldsNumber = (particleDiameter * fluidDensity * fluidVelocity) / fluidViscosity;
            const ratio = reactorDiameter / particleDiameter;

            // Results container
            let results = [];
            let errorMessages = [];
            let warningMessages = [];

            // Set of calculations to perform based on equation selections
            if (document.getElementById('li_finlayson') && document.getElementById('li_finlayson').checked) {
                try {
                    const hw = calculateLiFinlayson(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Li & Finlayson (1977)',
                        value: hw,
                        year: 1977,
                        details: 'Re: ' + formatNumber(reynoldsNumber) + ' | Dt/Dp: ' + formatNumber(ratio),
                        validityRe: '20 < Re < 7600',
                        validityR: '3.3 < Dt/Dp < 20'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }

            if (document.getElementById('dixon_cresswell') && document.getElementById('dixon_cresswell').checked) {
                try {
                    const hw = calculateDixonCresswell(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Dixon & Cresswell (1979)',
                        value: hw,
                        year: 1979,
                        details: 'Re: ' + formatNumber(reynoldsNumber) + ' | Dt/Dp: ' + formatNumber(ratio),
                        validityRe: '1 < Re < 50',
                        validityR: '4 < Dt/Dp < 50'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }

            if (document.getElementById('de_wasch_froment') && document.getElementById('de_wasch_froment').checked) {
                try {
                    const hw = calculateDeWaschFroment(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'De Wasch & Froment (1972)',
                        value: hw,
                        year: 1972,
                        details: 'Re: ' + formatNumber(reynoldsNumber) + ' | Dt/Dp: ' + formatNumber(ratio),
                        validityRe: '100 < Re < 1000',
                        validityR: '适用范围广泛'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }

            if (document.getElementById('specchia') && document.getElementById('specchia').checked) {
                try {
                    const hw = calculateSpecchia(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Specchia et al. (1980)',
                        value: hw,
                        year: 1980,
                        details: 'Re: ' + formatNumber(reynoldsNumber) + ' | Dt/Dp: ' + formatNumber(ratio),
                        validityRe: '50 < Re < 500',
                        validityR: '适用范围广泛'
                    });
            } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('leva') && document.getElementById('leva').checked) {
                try {
                    const hw = calculateLeva(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Leva (1947)',
                        value: hw,
                        year: 1947,
                        details: 'Re: ' + formatNumber(reynoldsNumber) + ' | Dt/Dp: ' + formatNumber(ratio),
                        validityRe: '100 < Re < 2000',
                        validityR: '3.0 < Dt/Dp < 12.0'
                    });
            } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('leva_et_al') && document.getElementById('leva_et_al').checked) {
                try {
                    const hw = calculateLevaEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Leva et al. (1948)',
                        value: hw,
                        year: 1948,
                        details: 'Re: ' + formatNumber(reynoldsNumber) + ' | Dt/Dp: ' + formatNumber(ratio),
                        validityRe: '250 < Re < 3000',
                        validityR: '3.7 < Dt/Dp < 12.5'
                    });
            } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('chu_storrow') && document.getElementById('chu_storrow').checked) {
                try {
                    const hw = calculateChuStorrow(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Chu & Storrow (1952)',
                        value: hw,
                        year: 1952,
                        details: 'Re: ' + formatNumber(reynoldsNumber) + ' | Dt/Dp: ' + formatNumber(ratio),
                        validityRe: '110 < Re < 620',
                        validityR: '5.0 < Dt/Dp < 17.0'
                    });
            } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('yagi_wakao') && document.getElementById('yagi_wakao').checked) {
                try {
                    const hw = calculateYagiWakao(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Yagi & Wakao (1959)',
                        value: hw,
                        year: 1959,
                        details: 'Re: ' + formatNumber(reynoldsNumber) + ' | Dt/Dp: ' + formatNumber(ratio),
                        validityRe: '60 < Re < 1000',
                        validityR: '4.5 < Dt/Dp < 8.5'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('kunii_et_al') && document.getElementById('kunii_et_al').checked) {
                try {
                    const hw = calculateKuniiEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Kunii et al. (1968)',
                        value: hw,
                        year: 1968,
                        details: 'Re: ' + formatNumber(reynoldsNumber) + ' | Dt/Dp: ' + formatNumber(ratio),
                        validityRe: '20 < Re < 800',
                        validityR: '4.0 < Dt/Dp < 10.0'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('olbrich_potter') && document.getElementById('olbrich_potter').checked) {
                try {
                    const hw = calculateOlbrichPotter(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Olbrich & Potter (1972)',
                        value: hw,
                        year: 1972,
                        details: 'Re: ' + formatNumber(reynoldsNumber) + ' | Dt/Dp: ' + formatNumber(ratio),
                        validityRe: '50 < Re < 500',
                        validityR: '5.0 < Dt/Dp < 15.0'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('specchia_et_al') && document.getElementById('specchia_et_al').checked) {
                try {
                    const hw = calculateSpecchiaEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Specchia et al. (1980)',
                        value: hw,
                        year: 1980,
                        details: 'Re: ' + formatNumber(reynoldsNumber) + ' | Dt/Dp: ' + formatNumber(ratio),
                        validityRe: '50 < Re < 500',
                        validityR: '5.0 < Dt/Dp < 10.0'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('colledge_paterson') && document.getElementById('colledge_paterson').checked) {
                try {
                    const hw = calculateColledgePaterson(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Colledge & Paterson (1984)',
                        value: hw,
                        year: 1984,
                        details: 'Re: ' + formatNumber(reynoldsNumber) + ' | Dt/Dp: ' + formatNumber(ratio),
                        validityRe: '20 < Re < 800',
                        validityR: '4.0 < Dt/Dp < 10.0'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('dixon_et_al') && document.getElementById('dixon_et_al').checked) {
                try {
                    const hw = calculateDixonEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Dixon et al. (1984)',
                        value: hw,
                        year: 1984,
                        details: 'Re: ' + formatNumber(reynoldsNumber) + ' | Dt/Dp: ' + formatNumber(ratio),
                        validityRe: '50 < Re < 500',
                        validityR: '3.0 < Dt/Dp < 10.0'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('peters_et_al') && document.getElementById('peters_et_al').checked) {
                try {
                    const hw = calculatePetersEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Peters et al. (1988)',
                        value: hw,
                        year: 1988,
                        details: 'Re: ' + formatNumber(reynoldsNumber) + ' | Dt/Dp: ' + formatNumber(ratio),
                        validityRe: '40 < Re < 400',
                        validityR: '4.0 < Dt/Dp < 10.0'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('martin_nilles') && document.getElementById('martin_nilles').checked) {
                try {
                    const hw = calculateMartinNilles(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Martin & Nilles (1993)',
                        value: hw,
                        year: 1993,
                        details: 'Re: ' + formatNumber(reynoldsNumber) + ' | Dt/Dp: ' + formatNumber(ratio),
                        validityRe: '35 < Re < 500',
                        validityR: '5 < Dt/Dp < 12'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('demirel_et_al') && document.getElementById('demirel_et_al').checked) {
                try {
                    const hw = calculateDemirelEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Demirel et al. (2000)',
                        value: hw,
                        year: 2000,
                        details: 'Re: ' + formatNumber(reynoldsNumber) + ' | Dt/Dp: ' + formatNumber(ratio),
                        validityRe: '200 < Re < 1450',
                        validityR: '4.5 < Dt/Dp < 7.5'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('laguerre_et_al') && document.getElementById('laguerre_et_al').checked) {
                try {
                    const hw = calculateLaguerreEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Laguerre et al. (2006)',
                        value: hw,
                        year: 2006,
                        details: 'Re: ' + formatNumber(reynoldsNumber) + ' | Dt/Dp: ' + formatNumber(ratio),
                        validityRe: '100 < Re < 400',
                        validityR: 'Dt/Dp ≈ 5'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('das_et_al') && document.getElementById('das_et_al').checked) {
                try {
                    const hw = calculateDasEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Das et al. (2017)',
                        value: hw,
                        year: 2017,
                        details: 'Re: ' + formatNumber(reynoldsNumber) + ' | Dt/Dp: ' + formatNumber(ratio),
                        validityRe: '1 < Re < 500',
                        validityR: '4 < Dt/Dp < 8'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }

            if (results.length === 0) {
                throw new Error('没有成功计算任何结果，请检查参数输入和选择的计算方法！');
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
                    <tr>
                        <td>管径比 (Dt/Dp)</td>
                        <td class="value-column">${formatNumber(ratio)}</td>
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
                        <th>适用范围</th>
                    </tr>`;

            // 找出最大值和最小值
            const validValues = results.map(result => result.value);
            const minValue = validValues.length > 0 ? Math.min(...validValues) : null;
            const maxValue = validValues.length > 0 ? Math.max(...validValues) : null;

            results.forEach(result => {
                resultOutput += `
                    <tr ${result.value === minValue ? 'class="min-value"' : result.value === maxValue ? 'class="max-value"' : ''}>
                        <td>
                            <div class="equation-name">
                                ${result.name}
                                ${result.value === minValue ? '<span class="result-badge min-badge">最小值</span>' : ''}
                                ${result.value === maxValue ? '<span class="result-badge max-badge">最大值</span>' : ''}
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(result.value)}</span>
                                <span class="value-unit">W/m²·K</span>
                            </div>
                        </td>
                        <td class="range-column">
                            <div class="validity-info">
                                <div>Re: ${result.validityRe}</div>
                                <div>Dt/Dp: ${result.validityR}</div>
                            </div>
                        </td>
                    </tr>`;
            });

            resultOutput += `
                </table>
            </div>`;
            
            // 添加统计分析卡片（如果有超过1个有效结果）
            if (results.length > 1) {
                const avgValue = validValues.reduce((a, b) => a + b, 0) / validValues.length;
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
                            ${results.map((result, index) => {
                                const percent = (result.value / maxValue * 100).toFixed(1);
                                    let barClass = "";
                                if (result.value === minValue) barClass = "min-bar";
                                if (result.value === maxValue) barClass = "max-bar";
                                    
                                    return `
                                    <div class="chart-row">
                                    <div class="chart-label">${result.name}</div>
                                        <div class="chart-bar-container">
                                            <div class="chart-bar ${barClass}" style="width: ${percent}%;">
                                            <span class="bar-value">${formatNumber(result.value)}</span>
                                            </div>
                                        </div>
                                    </div>`;
                                }).join('')}
                        </div>
                    </div>
                </div>`;
            }

            // 添加警告信息区域
            if (warningMessages.length > 0) {
                resultOutput += `
                <div class="result-card warning-card">
                    <div class="section-header">
                        <span class="section-icon">⚠️</span>
                        <span class="section-title">计算警告</span>
                    </div>
                    <ul class="warning-list">
                        ${warningMessages.map(msg => `<li>${msg}</li>`).join('')}
                    </ul>
                    <div class="warning-note">以上警告不会阻止计算，但可能会影响结果的准确性。</div>
                </div>`;
            }

            // 添加错误信息区域
            if (errorMessages.length > 0) {
                resultOutput += `
                <div class="result-card error-card">
                    <div class="section-header">
                        <span class="section-icon">❌</span>
                        <span class="section-title">计算错误</span>
                    </div>
                    <ul class="error-list">
                        ${errorMessages.map(msg => `<li>${msg}</li>`).join('')}
                    </ul>
                </div>`;
            }

            resultOutput += `</div><div class="completion-message">✅ 计算完成！✨</div>`;

            // Use innerHTML instead of textContent to render HTML
            resultText.innerHTML = resultOutput;

            // 添加当前计算条件是否在各个关联式适用范围内的提示
            results.forEach(result => {
                // 提取适用范围数值范围并与当前条件比较
                const reMatch = result.validityRe.match(/(\d+(\.\d+)?)\s*<\s*Re\s*<\s*(\d+(\.\d+)?)/);
                const ratioMatch = result.validityR.match(/(\d+(\.\d+)?)\s*<\s*Dt\/Dp\s*<\s*(\d+(\.\d+)?)/);
                
                if (reMatch) {
                    const minRe = parseFloat(reMatch[1]);
                    const maxRe = parseFloat(reMatch[3]);
                    
                    if (reynoldsNumber < minRe || reynoldsNumber > maxRe) {
                        warningMessages.push(`${result.name}：当前雷诺数（${formatNumber(reynoldsNumber)}）超出适用范围（${minRe} < Re < ${maxRe}）`);
                    }
                }
                
                if (ratioMatch) {
                    const minRatio = parseFloat(ratioMatch[1]);
                    const maxRatio = parseFloat(ratioMatch[3]);
                    
                    if (ratio < minRatio || ratio > maxRatio) {
                        warningMessages.push(`${result.name}：当前管径比（${formatNumber(ratio)}）超出适用范围（${minRatio} < Dt/Dp < ${maxRatio}）`);
                    }
                }
            });

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
            // 尝试加载MathJax 3.x
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
            script.async = true;
            script.id = 'MathJax-script';
            
            script.onload = () => {
                window.MathJax = {
                    tex: {
                        inlineMath: [['$', '$'], ['\\(', '\\)']],
                        displayMath: [['$$', '$$'], ['\\[', '\\]']],
                        processEscapes: true
                    },
                    svg: {
                        fontCache: 'global'
                    },
                    options: {
                        enableMenu: false
                    }
                };
                
                // 给脚本加载一点时间初始化
                setTimeout(() => resolve(window.MathJax), 100);
            };
            
            script.onerror = () => {
                // 如果MathJax 3加载失败，尝试加载MathJax 2
                console.warn("MathJax 3加载失败，尝试加载MathJax 2");
                const fallbackScript = document.createElement('script');
                fallbackScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML';
                fallbackScript.async = true;
                
                fallbackScript.onload = () => {
                    if (window.MathJax) {
                window.MathJax.Hub.Config({
                    tex2jax: {
                        inlineMath: [['$', '$'], ['\\(', '\\)']],
                        displayMath: [['$$', '$$'], ['\\[', '\\]']],
                        processEscapes: true
                    },
                    CommonHTML: {
                        scale: 115,
                                linebreaks: { automatic: true }
                    }
                });
                resolve(window.MathJax);
                    } else {
                        reject(new Error("无法初始化MathJax"));
                    }
                };
                
                fallbackScript.onerror = () => {
                    reject(new Error("无法加载MathJax"));
                };
                
                document.head.appendChild(fallbackScript);
            };
            
            document.head.appendChild(script);
        });
    }

    async function showModal() {
        modal.style.display = "block";
        loadingOverlay.classList.add('show');
        
        try {
            // 确保MathJax已加载
            if (!window.MathJax) {
            await loadMathJax();
            }
            
            // 给MathJax一些时间来处理内容
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // 处理公式
            if (window.MathJax) {
                if (window.MathJax.typesetPromise) {
                    await window.MathJax.typesetPromise([modal]);
                } else if (window.MathJax.Hub) {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, modal]);
                await new Promise(resolve => {
                    window.MathJax.Hub.Queue(() => resolve());
                });
                }
            }
        } catch (error) {
            console.error('Error rendering MathJax:', error);
        } finally {
            loadingOverlay.classList.remove('show');
            
            // 移除所有加载状态
            document.querySelectorAll('.formula-math.loading').forEach(el => {
                el.classList.remove('loading');
            });
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
