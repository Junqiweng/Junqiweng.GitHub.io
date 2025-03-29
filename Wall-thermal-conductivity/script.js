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
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.17 \\cdot \\mathrm{Re}_p^{0.79} \\]",
        parameters: [
            ["<i>h</i><sub>w</sub>", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["<i>d</i><sub>p</sub>", "颗粒直径", "填充颗粒的直径"],
            ["<i>k</i><sub>f</sub>", "流体热导率", "流体热导率"],
            ["<i>G</i>", "质量流速", "<i>G</i> = <i>ρ</i> × <i>u</i><sub>0</sub>"],
            ["<i>μ</i>", "流体粘度", "流体粘度"],
            ["<i>Re</i><sub>p</sub>", "粒子雷诺数", "粒子雷诺数（<i>Re</i><sub>p</sub> = <i>d</i><sub>p</sub>·<i>G</i>/<i>μ</i>），由其他参数计算得出"]
        ],
        theory: `<p><strong>Li & Finlayson关联式</strong>是基于一系列数值模拟和实验验证得出的经验关联式，这里使用其简化形式。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数0.17反映了该模型在标准条件下的传热能力</li>
            <li>雷诺数指数0.79表明流速对传热的影响较为显著</li>
            <li>简化形式适用于快速估算和对比</li>
        </ul>
        <p>该关联式在工程应用中广受欢迎，是化工反应器设计中的重要工具。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：1 < <i>Re</i><sub>p</sub> < 1000（分段计算）</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">管径与粒径比: 3.3 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 20</span>
    </div>
</div>`
    },
    leva: {
        title: "Leva壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.813\\left(\\frac{d_p}{D_t}\\right)\\exp\\left(-6\\frac{d_p}{D_t}\\right)\\left(\\frac{d_p G}{\\mu}\\right)^{0.9} \\]",
        parameters: [
            ["<i>h</i><sub>w</sub>", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["<i>d</i><sub>p</sub>", "颗粒直径", "填充颗粒的直径"],
            ["<i>k</i><sub>f</sub>", "流体热导率", "流体热导率"],
            ["<i>G</i>", "质量流速", "<i>G</i> = <i>ρ</i> × <i>u</i><sub>0</sub>"],
            ["<i>μ</i>", "流体粘度", "流体粘度"],
            ["<i>Pr</i>", "普朗特数", "流体的普朗特数（<i>Pr</i> = <i>μC</i><sub>p</sub>/<i>k</i><sub>f</sub>），由其他参数计算得出"],
            ["<i>D</i><sub>t</sub>", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Leva关联式</strong>是一个适用于低雷诺数范围的经验公式。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数0.813与管径比和指数函数项组合，更精确地反映了几何因素的影响</li>
            <li>包含指数项exp(-6*dp/Dt)，考虑了粒径与管径比的非线性影响</li>
            <li>雷诺数指数0.9表明对流速高度敏感</li>
        </ul>
        <p>该关联式通过引入指数衰减项，更准确地描述了传热系数与管径比的关系，在特定范围内表现优异。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：250 < <i>Re</i><sub>p</sub> < 3000</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">管径与粒径比: 3.3 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 20</span>
    </div>
</div>`
    },
    martin_nilles: {
        title: "Martin & Nilles壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = \\left(1.3 + 5\\frac{d_p}{D_t}\\right) \\frac{k_{er}}{k_f} + 0.19\\mathrm{Pr}^{\\frac{1}{3}}\\mathrm{Re}_p^{0.75} \\]",
        parameters: [
            ["<i>h</i><sub>w</sub>", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["<i>d</i><sub>p</sub>", "颗粒直径", "填充颗粒的直径"],
            ["<i>k</i><sub>f</sub>", "流体热导率", "流体热导率"],
            ["<i>k</i><sub>er</sub>", "有效径向热导率", "填充床有效径向热导率"],
            ["<i>G</i>", "质量流速", "<i>G</i> = <i>ρ</i> × <i>u</i><sub>0</sub>"],
            ["<i>μ</i>", "流体粘度", "流体粘度"],
            ["<i>Pr</i>", "普朗特数", "流体的普朗特数（<i>Pr</i> = <i>μC</i><sub>p</sub>/<i>k</i><sub>f</sub>），由其他参数计算得出"],
            ["<i>Re</i><sub>p</sub>", "粒子雷诺数", "基于颗粒直径的雷诺数，<i>Re</i><sub>p</sub> = <i>d</i><sub>p</sub><i>G</i>/<i>μ</i>"],
            ["<i>D</i><sub>t</sub>", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Martin & Nilles关联式</strong>是一种考虑有效热导率影响的壁面传热关联式。</p>
        <p>关键特点：</p>
        <ul>
            <li>公式分为两部分：导热贡献和对流贡献</li>
            <li>导热部分包含几何因素(1.3+5dp/Dt)和有效热导率比(ker/kf)</li>
            <li>对流部分中的雷诺数指数0.75表示对流体流动的显著依赖性</li>
            <li>普朗特数三分之一次方是传热关联式中的典型值</li>
        </ul>
        <p>该关联式适合于考虑导热和对流共同影响的复杂传热情况，特别适用于径向温度梯度较大的系统。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：35 < <i>Re</i><sub>p</sub> < 500</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">管径与粒径比: 3.3 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 20</span>
    </div>
</div>`
    },
    demirel_et_al: {
        title: "Demirel et al.壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.047\\left(\\frac{d_p G}{\\mu}\\right)^{0.927} \\]",
        parameters: [
            ["<i>h</i><sub>w</sub>", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["<i>d</i><sub>p</sub>", "颗粒直径", "填充颗粒的直径"],
            ["<i>k</i><sub>f</sub>", "流体热导率", "流体热导率"],
            ["<i>G</i>", "质量流速", "<i>G</i> = <i>ρ</i> × <i>u</i><sub>0</sub>"],
            ["<i>μ</i>", "流体粘度", "流体粘度"],
            ["<i>Pr</i>", "普朗特数", "流体的普朗特数（<i>Pr</i> = <i>μC</i><sub>p</sub>/<i>k</i><sub>f</sub>），由其他参数计算得出"],
            ["<i>D</i><sub>t</sub>", "反应器直径", "固定床反应器内径"]
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
        <span class="condition-text">雷诺数范围：200 < <i>Re</i><sub>p</sub> < 1450</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">管径与粒径比: 4.0 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 7.5</span>
    </div>
</div>`
    },
    laguerre_et_al: {
        title: "Laguerre et al.壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 1.56\\mathrm{Pr}^{1/3}\\left(\\frac{d_p G}{\\mu}\\right)^{0.42} \\]",
        parameters: [
            ["<i>h</i><sub>w</sub>", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["<i>d</i><sub>p</sub>", "颗粒直径", "填充颗粒的直径"],
            ["<i>k</i><sub>f</sub>", "流体热导率", "流体热导率"],
            ["<i>G</i>", "质量流速", "<i>G</i> = <i>ρ</i> × <i>u</i><sub>0</sub>"],
            ["<i>μ</i>", "流体粘度", "流体粘度"],
            ["<i>Pr</i>", "普朗特数", "流体的普朗特数（<i>Pr</i> = <i>μC</i><sub>p</sub>/<i>k</i><sub>f</sub>），由其他参数计算得出"],
            ["<i>D</i><sub>t</sub>", "反应器直径", "固定床反应器内径"]
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
        <span class="condition-text">雷诺数范围：100 < <i>Re</i><sub>p</sub> < 400</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">管径与粒径比: <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> = 5.0</span>
    </div>
</div>`
    },
    das_et_al: {
        title: "Das et al.壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 1.351 + 0.1124\\mathrm{Pr}^{1/3}\\left(\\frac{d_p G}{\\mu}\\right)^{0.878} \\]",
        parameters: [
            ["<i>h</i><sub>w</sub>", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["<i>d</i><sub>p</sub>", "颗粒直径", "填充颗粒的直径"],
            ["<i>k</i><sub>f</sub>", "流体热导率", "流体热导率"],
            ["<i>G</i>", "质量流速", "<i>G</i> = <i>ρ</i> × <i>u</i><sub>0</sub>"],
            ["<i>μ</i>", "流体粘度", "流体粘度"],
            ["<i>Pr</i>", "普朗特数", "流体的普朗特数（<i>Pr</i> = <i>μC</i><sub>p</sub>/<i>k</i><sub>f</sub>），由其他参数计算得出"],
            ["<i>D</i><sub>t</sub>", "反应器直径", "固定床反应器内径"]
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
        <span class="condition-text">雷诺数范围：1 < <i>Re</i><sub>p</sub> < 500</span>
    </div>

    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">管径与粒径比: 4.0 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 8</span>
    </div>
</div>`
    },
    leva_et_al: {
        title: "Leva et al.壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 3.5\\left(\\frac{d_p}{D_t}\\right)\\exp\\left(-4.6\\frac{d_p}{D_t}\\right)\\left(\\frac{d_p G}{\\mu}\\right)^{0.7} \\]",
        parameters: [
            ["<i>h</i><sub>w</sub>", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["<i>d</i><sub>p</sub>", "颗粒直径", "填充颗粒的直径"],
            ["<i>k</i><sub>f</sub>", "流体热导率", "流体热导率"],
            ["<i>G</i>", "质量流速", "<i>G</i> = <i>ρ</i> × <i>u</i><sub>0</sub>"],
            ["<i>μ</i>", "流体粘度", "流体粘度"],
            ["<i>Pr</i>", "普朗特数", "流体的普朗特数（<i>Pr</i> = <i>μC</i><sub>p</sub>/<i>k</i><sub>f</sub>），由其他参数计算得出"],
            ["<i>D</i><sub>t</sub>", "反应器直径", "固定床反应器内径"]
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
        <span class="condition-text">雷诺数范围：250 < <i>Re</i><sub>p</sub> < 3000</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">管径与粒径比: 3.7 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 12.5</span>
    </div>
</div>`
    },
    chu_storrow: {
        title: "Chu & Storrow壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.134 \\left(\\frac{d_p}{D_t}\\right)^{-0.13} \\left(\\frac{L_t}{D_t}\\right)^{-0.9} \\mathrm{Re}_p^{1.17} \\]",
        parameters: [
            ["<i>h</i><sub>w</sub>", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["<i>d</i><sub>p</sub>", "颗粒直径", "填充颗粒的直径"],
            ["<i>k</i><sub>f</sub>", "流体热导率", "流体热导率"],
            ["<i>G</i>", "质量流速", "<i>G</i> = <i>ρ</i> × <i>u</i><sub>0</sub>"],
            ["<i>μ</i>", "流体粘度", "流体粘度"],
            ["<i>Pr</i>", "普朗特数", "流体的普朗特数（<i>Pr</i> = <i>μC</i><sub>p</sub>/<i>k</i><sub>f</sub>），由其他参数计算得出"],
            ["<i>D</i><sub>t</sub>", "反应器直径", "固定床反应器内径"],
            ["<i>L</i><sub>t</sub>", "床层长度", "固定床反应器床层长度"]
        ],
        theory: `<p><strong>Chu & Storrow关联式</strong>是一种用于固定床壁面传热的经典关联式，其特点是考虑了床层长度的影响。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数0.134反映了该模型在特定几何条件下的传热特性</li>
            <li>包含了床层长度与反应器直径比（Lt/Dt）的影响</li>
            <li>雷诺数指数1.17是所有关联式中最高的，表明对流速极其敏感</li>
            <li>几何因素指数合理，可解释性强</li>
        </ul>
        <p>该关联式特别适合于有较长床层的反应器，能够更准确地考虑轴向位置的影响。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：<i>Re</i><sub>p</sub> < 1600</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">管径与粒径比: 3.9 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 25.7</span>
    </div>
</div>`
    },
    yagi_wakao: {
        title: "Yagi & Wakao壁面传热关联式",
        formula: "\\[ \\frac{h_w d_t}{k_f} = \\begin{cases} 0.6 \\cdot \\mathrm{Re}_p^{0.5} & \\text{for } \\mathrm{Re}_p < 40 \\\\ 0.2 \\cdot \\mathrm{Re}_p^{0.8} & \\text{for } \\mathrm{Re}_p \\geq 40 \\end{cases} \\]",
        parameters: [
            ["<i>h</i><sub>w</sub>", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["<i>d</i><sub>p</sub>", "颗粒直径", "填充颗粒的直径"],
            ["<i>k</i><sub>f</sub>", "流体热导率", "流体热导率"],
            ["<i>G</i>", "质量流速", "<i>G</i> = <i>ρ</i> × <i>u</i><sub>0</sub>"],
            ["<i>μ</i>", "流体粘度", "流体粘度"],
            ["<i>Pr</i>", "普朗特数", "流体的普朗特数（<i>Pr</i> = <i>μC</i><sub>p</sub>/<i>k</i><sub>f</sub>），由其他参数计算得出"],
            ["<i>Re</i><sub>p</sub>", "粒子雷诺数", "粒子雷诺数（<i>Re</i><sub>p</sub> = <i>d</i><sub>p</sub>·<i>G</i>/<i>μ</i>），由其他参数计算得出"],
            ["<i>D</i><sub>t</sub>", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Yagi & Wakao关联式</strong>是一种用于固定床壁面传热的分段关联式，根据雷诺数范围使用不同的公式。</p>
        <p>关键特点：</p>
        <ul>
            <li>分段处理不同流动区域：低雷诺数（<40）和高雷诺数（≥40）</li>
            <li>低雷诺数区域指数为0.5，符合层流传热理论</li>
            <li>高雷诺数区域指数为0.8，反映了湍流效应的增强</li>
            <li>简洁实用，易于应用</li>
        </ul>
        <p>该关联式的分段特性使其在广泛的流动条件下表现良好，从层流到湍流过渡区都有合理的预测能力。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：20 < <i>Re</i><sub>p</sub> < 2000</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">管径与粒径比: 6.0 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 47.0</span>
    </div>
</div>`
    },
    kunii_et_al: {
        title: "Kunii et al.壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = C_1 \\cdot \\mathrm{Re}_p^{0.75} \\cdot \\mathrm{Pr}^{1/3} \\]",
        parameters: [
            ["<i>h</i><sub>w</sub>", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["<i>d</i><sub>p</sub>", "颗粒直径", "填充颗粒的直径"],
            ["<i>k</i><sub>f</sub>", "流体热导率", "流体热导率"],
            ["<i>G</i>", "质量流速", "<i>G</i> = <i>ρ</i> × <i>u</i><sub>0</sub>"],
            ["<i>μ</i>", "流体粘度", "流体粘度"],
            ["<i>Pr</i>", "普朗特数", "流体的普朗特数（<i>Pr</i> = <i>μC</i><sub>p</sub>/<i>k</i><sub>f</sub>），由其他参数计算得出"],
            ["<i>Re</i><sub>p</sub>", "粒子雷诺数", "粒子雷诺数（<i>Re</i><sub>p</sub> = <i>d</i><sub>p</sub>·<i>G</i>/<i>μ</i>），由其他参数计算得出"],
            ["<i>D</i><sub>t</sub>", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Kunii et al.关联式</strong>是一种适用于中高雷诺数范围的壁面传热关联式。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数C1取决于反应器几何形状和填充物属性</li>
            <li>雷诺数指数0.75表示对流体流动有强依赖性</li>
            <li>包含普朗特数的影响，考虑流体物性的作用</li>
            <li>形式简洁，易于应用</li>
        </ul>
        <p>该关联式在工程应用中常用于快速估算壁面传热系数，特别是在中高雷诺数区间。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：<i>Re</i><sub>p</sub> > 100</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">管径与粒径比: 3.3 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 5.0</span>
    </div>
</div>`
    },
    olbrich_potter: {
        title: "Olbrich & Potter壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 8.9 \\cdot \\mathrm{Pr}^{1/3} \\cdot \\mathrm{Re}_p^{0.34} \\]",
        parameters: [
            ["<i>h</i><sub>w</sub>", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["<i>d</i><sub>p</sub>", "颗粒直径", "填充颗粒的直径"],
            ["<i>k</i><sub>f</sub>", "流体热导率", "流体热导率"],
            ["<i>G</i>", "质量流速", "<i>G</i> = <i>ρ</i> × <i>u</i><sub>0</sub>"],
            ["<i>μ</i>", "流体粘度", "流体粘度"],
            ["<i>Pr</i>", "普朗特数", "流体的普朗特数（<i>Pr</i> = <i>μC</i><sub>p</sub>/<i>k</i><sub>f</sub>），由其他参数计算得出"],
            ["<i>Re</i><sub>p</sub>", "粒子雷诺数", "粒子雷诺数（<i>Re</i><sub>p</sub> = <i>d</i><sub>p</sub>·<i>G</i>/<i>μ</i>），由其他参数计算得出"],
            ["<i>D</i><sub>t</sub>", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Olbrich & Potter关联式</strong>是一种考虑几何因素和流动条件共同影响的壁面传热关联式。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数8.9较高，表明在特定条件下传热效率较好</li>
            <li>雷诺数指数0.34较低，表明流速对传热有较小影响</li>
            <li>普朗特数指数1/3符合传热理论的标准值</li>
            <li>公式形式简洁，适用于快速工程计算</li>
        </ul>
        <p>该关联式在特定条件下表现优异，广泛应用于工业反应器的设计。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：100 < <i>Re</i><sub>p</sub> < 3000</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">管径与粒径比: 4.06 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 26.6</span>
    </div>
</div>`
    },
    specchia_et_al: {
        title: "Specchia et al.壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 2\\cdot \\varepsilon + 0.0835 \\mathrm{Re}_p^{0.91} \\]",
        parameters: [
            ["<i>h</i><sub>w</sub>", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["<i>d</i><sub>p</sub>", "颗粒直径", "填充颗粒的直径"],
            ["<i>k</i><sub>f</sub>", "流体热导率", "流体热导率"],
            ["<i>G</i>", "质量流速", "<i>G</i> = <i>ρ</i> × <i>u</i><sub>0</sub>"],
            ["<i>μ</i>", "流体粘度", "流体粘度"],
            ["<i>Pr</i>", "普朗特数", "流体的普朗特数（<i>Pr</i> = <i>μC</i><sub>p</sub>/<i>k</i><sub>f</sub>），由其他参数计算得出"],
            ["<i>Re</i><sub>p</sub>", "粒子雷诺数", "粒子雷诺数（<i>Re</i><sub>p</sub> = <i>d</i><sub>p</sub>·<i>G</i>/<i>μ</i>），由其他参数计算得出"],
            ["<i>D</i><sub>t</sub>", "反应器直径", "固定床反应器内径"],
            ["<i>ε</i>", "床层孔隙率", "床层孔隙率，表示流体在床层中所占的体积分数"]
        ],
        theory: `<p><strong>Specchia et al.关联式</strong>是一种全面考虑几何因素、流动条件和床层特性的壁面传热关联式。</p>
        <p>关键特点：</p>
        <ul>
            <li>包含了床层孔隙率的影响（ε^-0.2）</li>
            <li>考虑了管径与粒径比的影响（Dt/dp）^0.2</li>
            <li>雷诺数指数0.673处于中等水平，提供合理的流速敏感性</li>
            <li>普朗特数指数1/3符合传热理论的标准值</li>
        </ul>
        <p>该关联式的显著特点是考虑了床层孔隙率的影响，这使其能够对不同紧密度的床层提供更准确的预测。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：10 < <i>Re</i><sub>p</sub> < 1200</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">管径与粒径比: 3.5 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 8.4</span>
    </div>
</div>`
    },
    colledge_paterson: {
        title: "Colledge & Paterson壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 0.523 \\left(1 - \\frac{d_p}{D_t}\\right) \\mathrm{Pr}^{\\frac{1}{3}} \\mathrm{Re}_p^{0.738} \\]",
        parameters: [
            ["<i>h</i><sub>w</sub>", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["<i>d</i><sub>p</sub>", "颗粒直径", "填充颗粒的直径"],
            ["<i>k</i><sub>f</sub>", "流体热导率", "流体热导率"],
            ["<i>G</i>", "质量流速", "<i>G</i> = <i>ρ</i> × <i>u</i><sub>0</sub>"],
            ["<i>μ</i>", "流体粘度", "流体粘度"],
            ["<i>Pr</i>", "普朗特数", "流体的普朗特数（<i>Pr</i> = <i>μC</i><sub>p</sub>/<i>k</i><sub>f</sub>），由其他参数计算得出"],
            ["<i>Re</i><sub>p</sub>", "粒子雷诺数", "粒子雷诺数（<i>Re</i><sub>p</sub> = <i>d</i><sub>p</sub>·<i>G</i>/<i>μ</i>），由其他参数计算得出"],
            ["<i>D</i><sub>t</sub>", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Colledge & Paterson关联式</strong>是一种结合几何修正的壁面传热关联式。</p>
        <p>关键特点：</p>
        <ul>
            <li>考虑颗粒与管径的几何关系，通过因子(1-dp/Dt)进行修正</li>
            <li>雷诺数指数0.738较高，表明流速对传热有较大影响</li>
            <li>普朗特数指数1/3符合传热理论的标准值</li>
            <li>系数0.523是经实验数据拟合的优化值</li>
        </ul>
        <p>该关联式提供了简洁实用的表达式，同时考虑了几何影响，适用于快速工程估算。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用范围：一般适用</span>
    </div>
</div>`
    },
    dixon_et_al: {
        title: "Dixon et al.壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = \\left(1 - 1.5\\left(\\frac{d_p}{D_t}\\right)^{1.5}\\right) \\cdot \\mathrm{Pr}^{\\frac{1}{3}} \\cdot \\mathrm{Re}_p^{0.59} \\]",
        parameters: [
            ["<i>h</i><sub>w</sub>", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["<i>d</i><sub>p</sub>", "颗粒直径", "填充颗粒的直径"],
            ["<i>k</i><sub>f</sub>", "流体热导率", "流体热导率"],
            ["<i>G</i>", "质量流速", "<i>G</i> = <i>ρ</i> × <i>u</i><sub>0</sub>"],
            ["<i>μ</i>", "流体粘度", "流体粘度"],
            ["<i>Pr</i>", "普朗特数", "流体的普朗特数（<i>Pr</i> = <i>μC</i><sub>p</sub>/<i>k</i><sub>f</sub>），由其他参数计算得出"],
            ["<i>Re</i><sub>p</sub>", "粒子雷诺数", "粒子雷诺数（<i>Re</i><sub>p</sub> = <i>d</i><sub>p</sub>·<i>G</i>/<i>μ</i>），由其他参数计算得出"],
            ["<i>D</i><sub>t</sub>", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Dixon et al.关联式</strong>是一种考虑几何因素影响的壁面传热关联式。</p>
        <p>关键特点：</p>
        <ul>
            <li>采用非线性几何修正因子(1-1.5(dp/Dt)^1.5)，能更准确地描述几何影响</li>
            <li>雷诺数指数0.59适中，表明流速对传热有显著但不过度的影响</li>
            <li>普朗特数指数1/3符合传热理论的标准值</li>
            <li>无需额外系数，形式简洁</li>
        </ul>
        <p>该关联式的几何修正项采用了更复杂的幂函数形式，能够更好地反映床层结构对传热的影响。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：50 < <i>Re</i><sub>p</sub> < 500</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">管径与粒径比: 3.0 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 12.0</span>
    </div>
</div>`
    },
    peters_et_al: {
        title: "Peters et al.壁面传热关联式",
        formula: "\\[ \\frac{h_w d_p}{k_f} = 4.9 \\cdot \\left(\\frac{d_p}{D_t}\\right)^{0.26} \\cdot \\mathrm{Pr}^{\\frac{1}{3}} \\cdot \\mathrm{Re}_p^{0.45} \\]",
        parameters: [
            ["<i>h</i><sub>w</sub>", "壁面传热系数", "固定床反应器壁面传热系数"],
            ["<i>d</i><sub>p</sub>", "颗粒直径", "填充颗粒的直径"],
            ["<i>k</i><sub>f</sub>", "流体热导率", "流体热导率"],
            ["<i>G</i>", "质量流速", "<i>G</i> = <i>ρ</i> × <i>u</i><sub>0</sub>"],
            ["<i>μ</i>", "流体粘度", "流体粘度"],
            ["<i>Pr</i>", "普朗特数", "流体的普朗特数（<i>Pr</i> = <i>μC</i><sub>p</sub>/<i>k</i><sub>f</sub>），由其他参数计算得出"],
            ["<i>Re</i><sub>p</sub>", "粒子雷诺数", "粒子雷诺数（<i>Re</i><sub>p</sub> = <i>d</i><sub>p</sub>·<i>G</i>/<i>μ</i>），由其他参数计算得出"],
            ["<i>D</i><sub>t</sub>", "反应器直径", "固定床反应器内径"]
        ],
        theory: `<p><strong>Peters et al.关联式</strong>是一种考虑几何因素和流动条件的壁面传热关联式，特别适合高雷诺数范围。</p>
        <p>关键特点：</p>
        <ul>
            <li>系数4.9较高，表明在特定条件下传热效率较好</li>
            <li>几何影响通过(dp/Dt)^0.26表达，与其他关联式不同</li>
            <li>雷诺数指数0.45较低，表明流速影响相对较小</li>
            <li>普朗特数指数1/3符合传热理论的标准值</li>
        </ul>
        <p>该关联式适用于较宽的雷诺数范围，特别是在高雷诺数区域表现优异，广泛应用于工业反应器的设计。</p>`,
        applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">雷诺数范围：200 < <i>Re</i><sub>p</sub> < 8000</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">管径与粒径比: 3.0 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 11.0</span>
    </div>
</div>`
    }
};

// Function to show formula details
async function showFormulaDetails(formulaId) {
    const formula = formulaDetails[formulaId];
    if (!formula) return;

    const detailContent = document.getElementById('formulaDetail');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    loadingOverlay.classList.add('show');

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
        </div>
    `;

    detailContent.innerHTML = content;
    
    // 显示模态框
    const modal = document.getElementById('formulaModal');
    modal.style.display = "block";
    
    // 确保MathJax已加载
    if (!window.MathJax) {
        try {
            await loadMathJax();
        } catch (error) {
            console.error('无法加载MathJax:', error);
            loadingOverlay.classList.remove('show');
            return;
        }
    }
    
    // 渲染公式
    try {
        // MathJax 3.x 版本
        if (window.MathJax && window.MathJax.typesetPromise) {
            await window.MathJax.typesetPromise([detailContent]);
        } 
        // MathJax 2.x 版本
        else if (window.MathJax && window.MathJax.Hub) {
            window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, detailContent]);
            // 等待处理完成
            await new Promise(resolve => {
                window.MathJax.Hub.Queue(() => resolve());
            });
        } else {
            console.warn("未检测到MathJax渲染方法");
        }
    } catch (error) {
        console.error('MathJax处理公式出错:', error);
    } finally {
        // 移除加载状态
        loadingOverlay.classList.remove('show');
    }
}

// Calculation functions for different correlations
function calculateLiFinlayson(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    // 使用简化的 Li & Finlayson 公式: 0.17 · Re_p^0.79
    const nuw = 0.17 * Math.pow(reynoldsNumber, 0.79);
    
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

    // 修改公式符合图片中所示：0.813 * (D_a/D_s) * exp(-6*D_a/D_s) * Re^0.9
    const nuw = 0.813 * (particleDiameter / reactorDiameter) * 
                Math.exp(-6 * particleDiameter / reactorDiameter) * 
                Math.pow(reynoldsNumber, 0.9);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculateMartinNilles(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity, effectiveRadialConductivity, fluidConductivity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = particleDiameter / reactorDiameter; // dp/Dt 比值
    
    // 计算有效径向热导率与流体热导率的比值
    const ksr_kr = effectiveRadialConductivity / fluidConductivity; // ker/kf 比值

    // 使用Martin & Nilles新公式: (1.3 + 5*dp/Dt)*(ker/kf) + 0.19*Pr^(1/3)*Re_p^0.75
    const nuw = (1.3 + 5 * ratio) * ksr_kr + 
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

function calculateChuStorrow(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity, bedLength) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    // 几何参数比值
    const particleReactorRatio = particleDiameter / reactorDiameter;
    const lengthReactorRatio = bedLength / reactorDiameter;
    
    // 使用 Chu & Storrow 公式: 0.134·(dp/Dt)^(-0.13)·(Lt/Dt)^(-0.9)·Re_p^1.17
    const nuw = 0.134 * Math.pow(particleReactorRatio, -0.13) * Math.pow(lengthReactorRatio, -0.9) * Math.pow(reynoldsNumber, 1.17);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculateYagiWakao(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = reactorDiameter / particleDiameter;

    // 根据雷诺数范围使用不同的公式
    let nuw;
    if (reynoldsNumber < 40) {
        // 当 Re_p < 40 时
        nuw = 0.6 * Math.pow(reynoldsNumber, 0.5);
    } else {
        // 当 Re_p ≥ 40 时
        nuw = 0.2 * Math.pow(reynoldsNumber, 0.8);
    }
    
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

    // 更新为正确的 Olbrich & Potter 公式：8.9 · Pr^(1/3) · Re^0.34
    const nuw = 8.9 * Math.pow(fluidPrandtl, 1/3) * Math.pow(reynoldsNumber, 0.34);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculateSpecchiaEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity, voidFraction) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    // 使用 Specchia et al. 公式: 2ε_w + 0.0835 · Re_p^0.91，其中ε_w是床层孔隙率
    const nuw = 2 * voidFraction + 0.0835 * Math.pow(reynoldsNumber, 0.91);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculateColledgePaterson(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = particleDiameter / reactorDiameter; // dp/Dt 比值

    // 使用Colledge & Paterson新公式: 0.523 · (1 - dp/Dt) · Pr^(1/3) · Re_p^0.738
    const nuw = 0.523 * (1 - ratio) * Math.pow(fluidPrandtl, 1/3) * Math.pow(reynoldsNumber, 0.738);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculateDixonEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = particleDiameter / reactorDiameter; // dp/Dt

    // 使用Dixon et al.新公式: (1 - 1.5(dp/Dt)^1.5) · Pr^(1/3) · Re_p^0.59
    const nuw = (1 - 1.5 * Math.pow(ratio, 1.5)) * Math.pow(fluidPrandtl, 1/3) * Math.pow(reynoldsNumber, 0.59);
    
    const hw = nuw * fluidThermalConductivity / particleDiameter;
    return hw;
}

function calculatePetersEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity) {
    const massFlux = fluidDensity * fluidVelocity;
    const reynoldsNumber = (particleDiameter * massFlux) / fluidViscosity;
    
    const ratio = particleDiameter / reactorDiameter; // dp/Dt

    // 使用Peters et al.新公式: 4.9 · (dp/Dt)^0.26 · Pr^(1/3) · Re_p^0.45
    const nuw = 4.9 * Math.pow(ratio, 0.26) * Math.pow(fluidPrandtl, 1/3) * Math.pow(reynoldsNumber, 0.45);
    
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
                try {
                    await showFormulaDetails(formulaId);
                } catch (error) {
                    console.error('Error showing formula details:', error);
                    document.getElementById('loading-overlay').classList.remove('show');
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
        fluid_velocity: 1.0,
        particle_diameter: 0.003,
        reactor_diameter: 0.05,
        bed_length: 1,
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
            const bedLength = parseFloat(document.getElementById('bed_length').value);
            const voidFraction = parseFloat(document.getElementById('void_fraction').value);
            const fluidThermalConductivity = parseFloat(document.getElementById('fluid_thermal_conductivity').value);
            const effectiveRadialConductivity = parseFloat(document.getElementById('effective_radial_conductivity').value);
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
            
            if (document.getElementById('leva') && document.getElementById('leva').checked) {
                try {
                    const hw = calculateLeva(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Leva (1947)',
                        value: hw,
                        year: 1947,
                        details: '<i>Re</i><sub>p</sub>: ' + formatNumber(reynoldsNumber) + ' | <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub>: ' + formatNumber(ratio),
                        validityRe: '250 < <i>Re</i><sub>p</sub> < 3000',
                        validityR: '3.3 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 20.0'
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
                        details: '<i>Re</i><sub>p</sub>: ' + formatNumber(reynoldsNumber) + ' | <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub>: ' + formatNumber(ratio),
                        validityRe: '250 < <i>Re</i><sub>p</sub> < 3000',
                        validityR: '3.7 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 12.5'
                    });
            } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('chu_storrow') && document.getElementById('chu_storrow').checked) {
                try {
                    const hw = calculateChuStorrow(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity, bedLength);
                    results.push({
                        name: 'Chu & Storrow (1952)',
                        value: hw,
                        year: 1952,
                        details: '<i>Re</i><sub>p</sub>: ' + formatNumber(reynoldsNumber) + ' | <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub>: ' + formatNumber(ratio) + ' | <i>L</i><sub>t</sub>/<i>D</i><sub>t</sub>: ' + formatNumber(bedLength/reactorDiameter),
                        validityRe: '<i>Re</i><sub>p</sub> < 1600',
                        validityR: '3.9 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 25.7'
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
                        details: '<i>Re</i><sub>p</sub>: ' + formatNumber(reynoldsNumber) + ' | <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub>: ' + formatNumber(ratio) + ' | 公式: ' + (reynoldsNumber < 40 ? '0.6·<i>Re</i><sub>p</sub><sup>0.5</sup>' : '0.2·<i>Re</i><sub>p</sub><sup>0.8</sup>'),
                        validityRe: '20 < <i>Re</i><sub>p</sub> < 2000',
                        validityR: '6 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 47.0'
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
                        details: '<i>Re</i><sub>p</sub>: ' + formatNumber(reynoldsNumber) + ' | <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub>: ' + formatNumber(ratio),
                        validityRe: '<i>Re</i><sub>p</sub> > 100',
                        validityR: '3.3 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 5.0'
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
                        details: '<i>Re</i><sub>p</sub>: ' + formatNumber(reynoldsNumber) + ' | <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub>: ' + formatNumber(ratio),
                        validityRe: '100 < <i>Re</i><sub>p</sub> < 3000',
                        validityR: '4.06 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 26.6'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }

            if (document.getElementById('li_finlayson') && document.getElementById('li_finlayson').checked) {
                try {
                    const hw = calculateLiFinlayson(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    results.push({
                        name: 'Li & Finlayson (1977)',
                        value: hw,
                        year: 1977,
                        details: '<i>Re</i><sub>p</sub>: ' + formatNumber(reynoldsNumber) + ' | <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub>: ' + formatNumber(ratio),
                        validityRe: '20 < <i>Re</i><sub>p</sub> < 7600',
                        validityR: '3.3 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 20'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('specchia_et_al') && document.getElementById('specchia_et_al').checked) {
                try {
                    const hw = calculateSpecchiaEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity, voidFraction);
                    results.push({
                        name: 'Specchia et al. (1980)',
                        value: hw,
                        year: 1980,
                        details: '<i>Re</i><sub>p</sub>: ' + formatNumber(reynoldsNumber) + ' | <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub>: ' + formatNumber(ratio) + ' | <i>ε</i>: ' + formatNumber(voidFraction),
                        validityRe: '10 < <i>Re</i><sub>p</sub> < 1200',
                        validityR: '3.5 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 8.4'
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
                        details: '<i>Re</i><sub>p</sub>: ' + formatNumber(reynoldsNumber) + ' | <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub>: ' + formatNumber(reactorDiameter/particleDiameter) + ' | (1-<i>d</i><sub>p</sub>/<i>D</i><sub>t</sub>): ' + formatNumber(1-particleDiameter/reactorDiameter) + ' | <i>Pr</i><sup>1/3</sup>: ' + formatNumber(Math.pow(fluidPrandtl, 1/3)),
                        validityRe: 'N/A',
                        validityR: 'N/A'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('dixon_et_al') && document.getElementById('dixon_et_al').checked) {
                try {
                    const hw = calculateDixonEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    const dpDt = particleDiameter / reactorDiameter; // Dp/Dt比值
                    const geometryFactor = 1 - 1.5 * Math.pow(dpDt, 1.5); // 几何修正因子(1-1.5(Dp/Dt)^1.5)
                    
                    results.push({
                        name: 'Dixon et al. (1984)',
                        value: hw,
                        year: 1984,
                        details: '<i>Re</i><sub>p</sub>: ' + formatNumber(reynoldsNumber) + ' | <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub>: ' + formatNumber(reactorDiameter/particleDiameter) + ' | (1-1.5(<i>d</i><sub>p</sub>/<i>D</i><sub>t</sub>)<sup>1.5</sup>): ' + formatNumber(geometryFactor),
                        validityRe: '50 < <i>Re</i><sub>p</sub> < 500',
                        validityR: '3.0 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 12.0'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('peters_et_al') && document.getElementById('peters_et_al').checked) {
                try {
                    const hw = calculatePetersEtAl(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity);
                    const dpDt = particleDiameter / reactorDiameter; // dp/Dt比值
                    const geometryFactor = Math.pow(dpDt, 0.26); // 几何修正因子(dp/Dt)^0.26
                    
                    results.push({
                        name: 'Peters et al. (1988)',
                        value: hw,
                        year: 1988,
                        details: '<i>Re</i><sub>p</sub>: ' + formatNumber(reynoldsNumber) + ' | <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub>: ' + formatNumber(reactorDiameter/particleDiameter) + ' | (<i>d</i><sub>p</sub>/<i>D</i><sub>t</sub>)<sup>0.26</sup>: ' + formatNumber(geometryFactor),
                        validityRe: '200 < <i>Re</i><sub>p</sub> < 8000',
                        validityR: '3.0 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 11.0'
                    });
                } catch (error) {
                    errorMessages.push(error.message);
                }
            }
            
            if (document.getElementById('martin_nilles') && document.getElementById('martin_nilles').checked) {
                try {
                    const hw = calculateMartinNilles(fluidVelocity, particleDiameter, fluidPrandtl, reactorDiameter, fluidThermalConductivity, fluidDensity, fluidViscosity, effectiveRadialConductivity, fluidThermalConductivity);
                    results.push({
                        name: 'Martin & Nilles (1993)',
                        value: hw,
                        year: 1993,
                        details: '<i>Re</i><sub>p</sub>: ' + formatNumber(reynoldsNumber) + ' | <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub>: ' + formatNumber(ratio) + ' | <i>k</i><sub>er</sub>/<i>k</i><sub>f</sub>: ' + formatNumber(effectiveRadialConductivity/fluidThermalConductivity),
                        validityRe: '35 < <i>Re</i><sub>p</sub> < 500',
                        validityR: '3.3 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 20'
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
                        details: '<i>Re</i><sub>p</sub>: ' + formatNumber(reynoldsNumber) + ' | <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub>: ' + formatNumber(ratio),
                        validityRe: '200 < <i>Re</i><sub>p</sub> < 1450',
                        validityR: '4.0 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 7.5'
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
                        details: '<i>Re</i><sub>p</sub>: ' + formatNumber(reynoldsNumber) + ' | <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub>: ' + formatNumber(ratio),
                        validityRe: '100 < <i>Re</i><sub>p</sub> < 400',
                        validityR: '<i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> = 5.0'
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
                        details: '<i>Re</i><sub>p</sub>: ' + formatNumber(reynoldsNumber) + ' | <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub>: ' + formatNumber(ratio),
                        validityRe: '1 < <i>Re</i><sub>p</sub> < 500',
                        validityR: '4.0 < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < 8'
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
                        <td>床层长度 (<i>L</i>)</td>
                        <td class="value-column">${formatNumber(bedLength)}</td>
                        <td>m</td>
                    </tr>
                    <tr>
                        <td>床层孔隙率 (<i>ε</i>)</td>
                        <td class="value-column">${formatNumber(voidFraction)}</td>
                        <td>-</td>
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
                        <td>有效径向热导率 (<i>k</i><sub>er</sub>)</td>
                        <td class="value-column">${formatNumber(effectiveRadialConductivity)}</td>
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
                        <td>管径比 (Dt/dp)</td>
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
                        <th>壁面传热系数 <i>h</i><sub>w</sub> (W/m²·K)</th>
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
                                <div><i>Re</i><sub>p</sub>: ${result.validityRe}</div>
                                <div><i>D</i><sub>t</sub>/<i>d</i><sub>p</sub>: ${result.validityR}</div>
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
                const reMatch = result.validityRe.match(/(\d+(\.\d+)?)\s*<\s*.*Re.*\s*<\s*(\d+(\.\d+)?)/);
                const ratioMatch = result.validityR.match(/(\d+(\.\d+)?)\s*<\s*.*Dt\/dp.*\s*<\s*(\d+(\.\d+)?)/);
                
                if (reMatch) {
                    const minRe = parseFloat(reMatch[1]);
                    const maxRe = parseFloat(reMatch[3]);
                    
                    if (reynoldsNumber < minRe || reynoldsNumber > maxRe) {
                        warningMessages.push(`${result.name}：当前雷诺数（<i>Re</i><sub>p</sub> = ${formatNumber(reynoldsNumber)}）超出适用范围（${minRe} < <i>Re</i><sub>p</sub> < ${maxRe}）`);
                    }
                }
                
                if (ratioMatch) {
                    const minRatio = parseFloat(ratioMatch[1]);
                    const maxRatio = parseFloat(ratioMatch[3]);
                    
                    if (ratio < minRatio || ratio > maxRatio) {
                        warningMessages.push(`${result.name}：当前管径比（<i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> = ${formatNumber(ratio)}）超出适用范围（${minRatio} < <i>D</i><sub>t</sub>/<i>d</i><sub>p</sub> < ${maxRatio}）`);
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
            script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
            script.async = true;
            script.id = 'MathJax-script';
            
            // 设置MathJax配置
            window.MathJax = {
                tex: {
                    inlineMath: [['$', '$'], ['\\(', '\\)']],
                    displayMath: [['$$', '$$'], ['\\[', '\\]']],
                    processEscapes: true,
                    packages: {'[+]': ['ams']}
                },
                svg: {
                    fontCache: 'global',
                    scale: 1.1
                },
                options: {
                    enableMenu: false
                },
                startup: {
                    pageReady: function() {
                        console.log("MathJax已准备就绪");
                        return MathJax.startup.defaultPageReady();
                    }
                }
            };
            
            let timeoutId = setTimeout(() => {
                console.warn("MathJax加载超时，尝试备用方法");
                clearTimeout(timeoutId);
                tryFallback();
            }, 5000);
            
            script.onload = () => {
                clearTimeout(timeoutId);
                // 给MathJax一些时间初始化
                setTimeout(() => resolve(window.MathJax), 200);
            };
            
            script.onerror = () => {
                clearTimeout(timeoutId);
                tryFallback();
            };
            
            function tryFallback() {
                // 如果MathJax 3加载失败，尝试加载MathJax 2
                console.warn("尝试加载MathJax 2作为备选");
                const fallbackScript = document.createElement('script');
                fallbackScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
                fallbackScript.async = true;
                
                // 设置MathJax 2配置
                window.MathJax = {
                    tex2jax: {
                        inlineMath: [['$', '$'], ['\\(', '\\)']],
                        displayMath: [['$$', '$$'], ['\\[', '\\]']],
                        processEscapes: true
                    },
                    CommonHTML: {
                        scale: 100,
                        linebreaks: { automatic: true }
                    },
                    "HTML-CSS": {
                        scale: 100,
                        linebreaks: { automatic: true }
                    },
                    SVG: {
                        scale: 100,
                        linebreaks: { automatic: true }
                    },
                    showMathMenu: false,
                    messageStyle: "none"
                };
                
                let fallbackTimeoutId = setTimeout(() => {
                    console.error("MathJax 2加载也失败");
                    clearTimeout(fallbackTimeoutId);
                    reject(new Error("无法加载MathJax"));
                }, 5000);
                
                fallbackScript.onload = () => {
                    clearTimeout(fallbackTimeoutId);
                    // 给MathJax 2一些时间初始化
                    setTimeout(() => {
                        if (window.MathJax && window.MathJax.Hub) {
                            window.MathJax.Hub.Config({
                                tex2jax: {
                                    inlineMath: [['$', '$'], ['\\(', '\\)']],
                                    displayMath: [['$$', '$$'], ['\\[', '\\]']]
                                },
                                showMathMenu: false,
                                messageStyle: "none"
                            });
                            resolve(window.MathJax);
                        } else {
                            reject(new Error("无法初始化MathJax 2"));
                        }
                    }, 200);
                };
                
                fallbackScript.onerror = () => {
                    clearTimeout(fallbackTimeoutId);
                    reject(new Error("无法加载MathJax"));
                };
                
                document.head.appendChild(fallbackScript);
            }
            
            document.head.appendChild(script);
        });
    }

    async function showModal() {
        const modal = document.getElementById('formulaModal');
        const loadingOverlay = document.getElementById('loading-overlay');
        
        modal.style.display = "block";
        loadingOverlay.classList.add('show');
        
        try {
            // 确保MathJax已加载
            if (!window.MathJax) {
                await loadMathJax();
            }
            
            // 处理公式渲染
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
