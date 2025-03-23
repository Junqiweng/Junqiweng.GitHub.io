document.addEventListener('DOMContentLoaded', function() {
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

    // 添加自定义输入验证
    setupInputValidation();

    // Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const calculateBtn = document.getElementById('calculate');
    const clearBtn = document.getElementById('clear');
    const resetBtn = document.getElementById('reset');
    const modal = document.getElementById('formulaModal');
    const modalClose = document.querySelector('.modal-close');
    const formulaDetail = document.getElementById('formulaDetail');
    const infoLinks = document.querySelectorAll('.correlation-info');
    
    // 设置所有关联式子默认选中
    const correlationCheckboxes = document.querySelectorAll('.correlation-item input[type="checkbox"]');
    correlationCheckboxes.forEach(checkbox => {
        checkbox.checked = true;
    });

    // Default Values
    const defaultValues = {
        fluid_velocity: 1,
        particle_diameter: 0.006,
        void_fraction: 0.4,
        fluid_density: 1.225,
        fluid_viscosity: 1.81e-5,
        fluid_thermal_conductivity: 0.0257,
        fluid_specific_heat: 1005,
        molecular_diffusivity: 2e-5
    };

    // Reset Function
    function resetValues() {
        for (const [id, value] of Object.entries(defaultValues)) {
            const element = document.getElementById(id);
            if (element) element.value = value;
        }
        
        // 重置时也确保所有关联式子被选中
        correlationCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
    }

    // Clear Function
    function clearValues() {
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => input.value = '');
    }

    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Calculate Function
    function calculate() {
        // Get input values
        const inputs = {
            fluidVelocity: parseFloat(document.getElementById('fluid_velocity').value),
            particleDiameter: parseFloat(document.getElementById('particle_diameter').value),
            voidFraction: parseFloat(document.getElementById('void_fraction').value),
            fluidDensity: parseFloat(document.getElementById('fluid_density').value),
            fluidViscosity: parseFloat(document.getElementById('fluid_viscosity').value),
            fluidThermalConductivity: parseFloat(document.getElementById('fluid_thermal_conductivity').value),
            fluidSpecificHeat: parseFloat(document.getElementById('fluid_specific_heat').value),
            molecularDiffusivity: parseFloat(document.getElementById('molecular_diffusivity').value)
        };

        // Validate inputs
        for (const [key, value] of Object.entries(inputs)) {
            if (isNaN(value) || value <= 0) {
                alert('请确保所有输入均为正数！');
                return;
            }
        }

        // Calculate dimensionless numbers
        const Re = (inputs.fluidDensity * inputs.fluidVelocity * inputs.particleDiameter) / inputs.fluidViscosity;
        const Sc = inputs.fluidViscosity / (inputs.fluidDensity * inputs.molecularDiffusivity);
        const Pr = (inputs.fluidViscosity * inputs.fluidSpecificHeat) / inputs.fluidThermalConductivity;

        let results = {
            dimensionless: { Re, Sc, Pr },
            massTransfer: {},
            heatTransfer: {}
        };

        // Ranz-Marshall mass transfer correlation
        if (document.getElementById('ranz_marshall').checked) {
            const Sh_rm = 2 + 0.6 * Math.pow(Re, 0.5) * Math.pow(Sc, 1/3);
            const k_rm = (Sh_rm * inputs.molecularDiffusivity) / inputs.particleDiameter;
            results.massTransfer.ranzMarshall = { Sh: Sh_rm, k: k_rm };
        }

        // Wakao-Funazkri correlation
        if (document.getElementById('wakao_funazkri').checked) {
            const Sh_wf = 2 + 1.1 * Math.pow(Re, 0.6) * Math.pow(Sc, 1/3);
            const k_wf = (Sh_wf * inputs.molecularDiffusivity) / inputs.particleDiameter;
            results.massTransfer.wakaoFunazkri = { Sh: Sh_wf, k: k_wf };
        }

        // Froessling mass transfer correlation
        if (document.getElementById('froessling_mass').checked) {
            const Sh_froessling = 2 + 0.6 * Math.pow(Re, 0.5) * Math.pow(Sc, 1/3); // Same form as Ranz-Marshall
            const k_froessling = (Sh_froessling * inputs.molecularDiffusivity) / inputs.particleDiameter;
            results.massTransfer.froessling = { Sh: Sh_froessling, k: k_froessling };
        }

        // Rowe mass transfer correlation
        if (document.getElementById('rowe_mass').checked) {
            const Sh_rowe = 1.1 * (Math.pow(Re, 0.5) + 0.2 * Math.pow(Re, 0.67)) * Math.pow(Sc, 0.33);
            const k_rowe = (Sh_rowe * inputs.molecularDiffusivity) / inputs.particleDiameter;
            results.massTransfer.rowe = { Sh: Sh_rowe, k: k_rowe };
        }

        // Heat transfer coefficients
        // Ranz-Marshall heat transfer correlation
        if (document.getElementById('ranz_marshall_heat').checked) {
            const Nu_rm = 2 + 0.6 * Math.pow(Re, 0.5) * Math.pow(Pr, 1/3);
            const h_rm = (Nu_rm * inputs.fluidThermalConductivity) / inputs.particleDiameter;
            results.heatTransfer.ranzMarshall = { Nu: Nu_rm, h: h_rm };
        }

        // Gnielinski correlation
        if (document.getElementById('gnielinski').checked) {
            const Nu_lam = 0.664 * Math.sqrt(Re) * Math.pow(Pr, 1/3);
            const Nu_turb = (0.037 * Math.pow(Re, 0.8) * Pr) / (1 + 2.443 * Math.pow(Re, -0.1) * (Math.pow(Pr, 2/3) - 1));
            const Nu_gn = 2 + Math.sqrt(Nu_lam**2 + Nu_turb**2);
            const h_gn = (Nu_gn * inputs.fluidThermalConductivity) / inputs.particleDiameter;
            results.heatTransfer.gnielinski = { Nu: Nu_gn, h: h_gn };
        }

        // Dittus-Boelter heat transfer correlation
        if (document.getElementById('dittus_boelter_heat').checked) {
            const n = 0.4; // for heating
            const Nu_db = 0.023 * Math.pow(Re, 0.8) * Math.pow(Pr, n);
            const h_db = (Nu_db * inputs.fluidThermalConductivity) / inputs.particleDiameter;
            results.heatTransfer.dittusBoelter = { Nu: Nu_db, h: h_db };
        }

        // Hausen heat transfer correlation
        if (document.getElementById('hausen_heat').checked) {
            const dp_L_factor = 1; // Simplified calculation, ignoring (dp/L)^(2/3) term
            const Nu_hausen = 0.037 * Math.pow(Re, 0.8) * Math.pow(Pr, 1/3) * dp_L_factor;
            const h_hausen = (Nu_hausen * inputs.fluidThermalConductivity) / inputs.particleDiameter;
            results.heatTransfer.hausen = { Nu: Nu_hausen, h: h_hausen };
        }

        displayResults(results);
        document.querySelector('[data-tab="results"]').click();
    }

    // Formula details data
    const formulaDetails = {
        ranz_marshall: {
            title: "Ranz-Marshall传质关联式详解",
            formula: "\\[ Sh = 2 + 0.6Re^{0.5}Sc^{1/3} \\] \\[ k = \\frac{Sh D_{AB}}{d_p} \\]",
            parameters: [
                ["Sh", "Sherwood数", "代表对流传质与分子扩散的比值"],
                ["Re", "Reynolds数", "表征流体的惯性力与粘性力的比值"],
                ["Sc", "Schmidt数", "表征动量扩散与质量扩散的比值"],
                ["k", "传质系数", "描述传质过程的速率系数"],
                ["D_AB", "分子扩散系数", "描述组分在流体中的扩散能力"],
                ["d_p", "颗粒直径", "填充颗粒的特征尺寸"]
            ],
            theory: `<p><strong>Ranz-Marshall传质关联式</strong>是一个经典的传质关系式，适用于单颗粒或填充床的传质过程。</p>
            <p>该关联式考虑了两个主要部分：</p>
            <ul>
                <li>常数项2代表纯分子扩散的贡献</li>
                <li>变化项0.6Re^{0.5}Sc^{1/3}描述了对流传质的影响</li>
            </ul>
            <p>这个关联式最早由Ranz和Marshall在1952年通过单颗粒实验得出，后被广泛应用于各种传质工程计算。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">Reynolds数范围：2 < Re < 200</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">Schmidt数范围：0.6 < Sc < 2.7</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">球形或近似球形颗粒</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">单颗粒或稀疏填充床</span>
    </div>
</div>`
        },
        wakao_funazkri: {
            title: "Wakao-Funazkri传质关联式详解",
            formula: "\\[ Sh = 2 + 1.1Re^{0.6}Sc^{1/3} \\] \\[ k = \\frac{Sh D_{AB}}{d_p} \\]",
            parameters: [
                ["Sh", "Sherwood数", "代表对流传质与分子扩散的比值"],
                ["Re", "Reynolds数", "表征流体的惯性力与粘性力的比值"],
                ["Sc", "Schmidt数", "表征动量扩散与质量扩散的比值"],
                ["k", "传质系数", "描述传质过程的速率系数"],
                ["D_AB", "分子扩散系数", "描述组分在流体中的扩散能力"],
                ["d_p", "颗粒直径", "填充颗粒的特征尺寸"]
            ],
            theory: `<p><strong>Wakao-Funazkri关联式</strong>是一种广泛用于固定床传质计算的改进关联式。</p>
            <p>与Ranz-Marshall相比，主要区别在于：</p>
            <ul>
                <li>指数项从0.5增加到0.6，增强了湍流效应的影响</li>
                <li>系数从0.6增加到1.1，提高了对流传质的贡献</li>
            </ul>
            <p>这些修改使得该关联式在更宽的Reynolds数范围内具有更好的适用性，尤其适合于密集填充床。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">Reynolds数范围：3 < Re < 10,000</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于各种填充颗粒形状</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">尤其适合密集填充床</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">已被大量实验数据验证</span>
    </div>
</div>`
        },
        ranz_marshall_heat: {
            title: "Ranz-Marshall传热关联式详解",
            formula: "\\[ Nu = 2 + 0.6Re^{0.5}Pr^{1/3} \\] \\[ h = \\frac{Nu k_f}{d_p} \\]",
            parameters: [
                ["Nu", "Nusselt数", "代表对流传热与热传导的比值"],
                ["Re", "Reynolds数", "表征流体的惯性力与粘性力的比值"],
                ["Pr", "Prandtl数", "表征动量扩散与热扩散的比值"],
                ["h", "传热系数", "描述传热过程的速率系数"],
                ["k_f", "流体热导率", "描述流体传导热量的能力"],
                ["d_p", "颗粒直径", "填充颗粒的特征尺寸"]
            ],
            theory: `<p><strong>Ranz-Marshall传热关联式</strong>与传质关联式形式相同，体现了传热与传质的相似性原理。</p>
            <p>关键特点：</p>
            <ul>
                <li>将Schmidt数替换为Prandtl数，其他形式完全相同</li>
                <li>常数项2表示纯传导贡献</li>
                <li>变化项0.6Re^{0.5}Pr^{1/3}表示对流传热的增强效应</li>
            </ul>
            <p>这种传热-传质相似性是化工传递过程中的重要理论基础，为不同传递过程的统一分析提供了便利。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">Reynolds数范围：2 < Re < 200</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">Prandtl数范围：0.6 < Pr < 380</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">球形或近似球形颗粒</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">单颗粒或稀疏填充床</span>
    </div>
</div>`
        },
        gnielinski: {
            title: "Gnielinski传热关联式详解",
            formula: "\\[ Nu = 2 + \\sqrt{Nu_{lam}^2 + Nu_{turb}^2} \\] \\[ Nu_{lam} = 0.664Re^{0.5}Pr^{1/3} \\] \\[ Nu_{turb} = \\frac{0.037Re^{0.8}Pr}{1+2.443Re^{-0.1}(Pr^{2/3}-1)} \\] \\[ h = \\frac{Nu k_f}{d_p} \\]",
            parameters: [
                ["Nu", "Nusselt数", "代表对流传热与热传导的比值"],
                ["Nu_{lam}", "层流Nusselt数", "层流条件下的Nusselt数贡献"],
                ["Nu_{turb}", "湍流Nusselt数", "湍流条件下的Nusselt数贡献"],
                ["Re", "Reynolds数", "表征流体的惯性力与粘性力的比值"],
                ["Pr", "Prandtl数", "表征动量扩散与热扩散的比值"],
                ["h", "传热系数", "描述传热过程的速率系数"],
                ["k_f", "流体热导率", "描述流体传导热量的能力"],
                ["d_p", "颗粒直径", "填充颗粒的特征尺寸"]
            ],
            theory: `<p><strong>Gnielinski关联式</strong>是一种更加复杂的传热关联式，考虑了层流和湍流的共同影响。</p>
            <p>关键特点：</p>
            <ul>
                <li>分别计算层流和湍流的Nusselt数贡献</li>
                <li>通过平方和的平方根进行组合，平滑过渡区域</li>
                <li>湍流部分包含复杂的Prandtl数修正</li>
                <li>常数项2代表纯传导贡献</li>
            </ul>
            <p>这种复杂结构使得该关联式在从低Reynolds数到高Reynolds数的整个范围内都能提供较好的预测。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用范围极广：10 < Re < 100,000</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">Prandtl数范围：0.5 < Pr < 2000</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于各种颗粒形状</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">在过渡区域传热计算尤为准确</span>
    </div>
</div>`
        },
        froessling_mass: {
            title: "Froessling传质关联式详解",
            formula: "\\[ Sh = 2 + 0.6Re^{0.5}Sc^{1/3} \\] \\[ k = \\frac{Sh D_{AB}}{d_p} \\]",
            parameters: [
                ["Sh", "Sherwood数", "代表对流传质与分子扩散的比值"],
                ["Re", "Reynolds数", "表征流体的惯性力与粘性力的比值"],
                ["Sc", "Schmidt数", "表征动量扩散与质量扩散的比值"],
                ["k", "传质系数", "描述传质过程的速率系数"],
                ["D_AB", "分子扩散系数", "描述组分在流体中的扩散能力"],
                ["d_p", "颗粒直径", "填充颗粒的特征尺寸"]
            ],
            theory: `<p><strong>Froessling关联式</strong>是传质研究中的一个历史性关联式，实际上Ranz-Marshall关联式是在此基础上发展而来的。</p>
            <p>关键特点：</p>
            <ul>
                <li>形式与Ranz-Marshall相同，但理论基础和推导过程略有不同</li>
                <li>更强调单颗粒在流体中的传质行为</li>
                <li>通常用于单颗粒蒸发、燃烧等研究</li>
            </ul>
            <p>Froessling在1938年最早提出这一关系，对后续传质理论有深远影响。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">主要适用于单颗粒研究</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">Reynolds数范围：2 < Re < 800</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于球形颗粒</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">常用于颗粒蒸发和燃烧过程</span>
    </div>
</div>`
        },
        rowe_mass: {
            title: "Rowe传质关联式详解",
            formula: "\\[ Sh = 1.1(Re^{0.5} + 0.2Re^{0.67})Sc^{0.33} \\] \\[ k = \\frac{Sh D_{AB}}{d_p} \\]",
            parameters: [
                ["Sh", "Sherwood数", "代表对流传质与分子扩散的比值"],
                ["Re", "Reynolds数", "表征流体的惯性力与粘性力的比值"],
                ["Sc", "Schmidt数", "表征动量扩散与质量扩散的比值"],
                ["k", "传质系数", "描述传质过程的速率系数"],
                ["D_AB", "分子扩散系数", "描述组分在流体中的扩散能力"],
                ["d_p", "颗粒直径", "填充颗粒的特征尺寸"]
            ],
            theory: `<p><strong>Rowe传质关联式</strong>采用了不同于其他关联式的函数形式，特别适合于较宽Reynolds数范围的计算。</p>
            <p>关键特点：</p>
            <ul>
                <li>结合了两个不同指数的Reynolds数项，增强了适用范围</li>
                <li>没有明确的常数项，意味着在极低Reynolds数时可能低估传质效果</li>
                <li>系数1.1经过大量实验数据拟合得出</li>
            </ul>
            <p>这个关联式在较高Reynolds数时与Wakao-Funazkri关联式结果接近，但在中间Reynolds数区域有其独特优势。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用范围极广：1 < Re < 30,000</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于各种颗粒形状</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">在中等Reynolds数范围内尤为准确</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">可用于各种气固传质系统</span>
    </div>
</div>`
        },
        dittus_boelter_heat: {
            title: "Dittus-Boelter传热关联式详解",
            formula: "\\[ Nu = 0.023Re^{0.8}Pr^{n} \\] \\[ h = \\frac{Nu k_f}{d_p} \\]",
            parameters: [
                ["Nu", "Nusselt数", "代表对流传热与热传导的比值"],
                ["Re", "Reynolds数", "表征流体的惯性力与粘性力的比值"],
                ["Pr", "Prandtl数", "表征动量扩散与热扩散的比值"],
                ["n", "指数", "加热时取0.4，冷却时取0.3"],
                ["h", "传热系数", "描述传热过程的速率系数"],
                ["k_f", "流体热导率", "描述流体传导热量的能力"],
                ["d_p", "颗粒直径", "填充颗粒的特征尺寸"]
            ],
            theory: `<p><strong>Dittus-Boelter关联式</strong>最初是为管内湍流传热开发的，后被修改应用于填充床计算。</p>
            <p>关键特点：</p>
            <ul>
                <li>没有常数项，仅适用于较高Reynolds数条件</li>
                <li>形式简单，容易应用</li>
                <li>Prandtl数指数n随加热/冷却工况而变</li>
                <li>较高的Reynolds数指数(0.8)体现了湍流传热的显著影响</li>
            </ul>
            <p>尽管结构简单，在湍流区域内该关联式仍能提供合理的传热系数估计。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于湍流区域：Re > 10,000</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">Prandtl数范围：0.7 < Pr < 100</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">温度变化不大的工况</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">计算简单，工程应用广泛</span>
    </div>
</div>`
        },
        hausen_heat: {
            title: "Hausen传热关联式详解",
            formula: "\\[ Nu = 0.037Re^{0.8}Pr^{1/3} \\] \\[ h = \\frac{Nu k_f}{d_p} \\]",
            parameters: [
                ["Nu", "Nusselt数", "代表对流传热与热传导的比值"],
                ["Re", "Reynolds数", "表征流体的惯性力与粘性力的比值"],
                ["Pr", "Prandtl数", "表征动量扩散与热扩散的比值"],
                ["h", "传热系数", "描述传热过程的速率系数"],
                ["k_f", "流体热导率", "描述流体传导热量的能力"],
                ["d_p", "颗粒直径", "填充颗粒的特征尺寸"]
            ],
            theory: `<p><strong>Hausen关联式</strong>是一种简化的湍流传热关联式，形式接近Dittus-Boelter关联式但系数不同。</p>
            <p>关键特点：</p>
            <ul>
                <li>没有常数项，主要适用于湍流区域</li>
                <li>系数0.037略高于Dittus-Boelter的0.023</li>
                <li>Prandtl数指数固定为1/3，不区分加热/冷却</li>
                <li>由于简化，在原始公式中忽略了一些修正因子</li>
            </ul>
            <p>这个关联式在工程计算中常用作快速估算传热系数的方法。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于中高雷诺数：Re > 5,000</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于大多数常见流体</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">结构简单，便于工程计算</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">精度适中，适合初步设计</span>
    </div>
</div>`
        }
    };

    // Display Results Function
    function displayResults(results) {
        const resultsContent = document.querySelector('.results-content');
        
        // 获取输入值以显示在结果中
        const inputs = {
            fluidVelocity: parseFloat(document.getElementById('fluid_velocity').value),
            particleDiameter: parseFloat(document.getElementById('particle_diameter').value),
            voidFraction: parseFloat(document.getElementById('void_fraction').value),
            fluidDensity: parseFloat(document.getElementById('fluid_density').value),
            fluidViscosity: parseFloat(document.getElementById('fluid_viscosity').value),
            fluidThermalConductivity: parseFloat(document.getElementById('fluid_thermal_conductivity').value),
            fluidSpecificHeat: parseFloat(document.getElementById('fluid_specific_heat').value),
            molecularDiffusivity: parseFloat(document.getElementById('molecular_diffusivity').value)
        };
        
        // 找出传质系数的最大值和最小值
        let kValues = [];
        let massTransferNames = [];
        if (results.massTransfer.ranzMarshall) {
            kValues.push(results.massTransfer.ranzMarshall.k);
            massTransferNames.push("Ranz-Marshall");
        }
        if (results.massTransfer.wakaoFunazkri) {
            kValues.push(results.massTransfer.wakaoFunazkri.k);
            massTransferNames.push("Wakao-Funazkri");
        }
        if (results.massTransfer.froessling) {
            kValues.push(results.massTransfer.froessling.k);
            massTransferNames.push("Froessling");
        }
        if (results.massTransfer.rowe) {
            kValues.push(results.massTransfer.rowe.k);
            massTransferNames.push("Rowe");
        }
        
        const kMinValue = Math.min(...kValues);
        const kMaxValue = Math.max(...kValues);
        
        // 找出传热系数的最大值和最小值
        let hValues = [];
        let heatTransferNames = [];
        if (results.heatTransfer.ranzMarshall) {
            hValues.push(results.heatTransfer.ranzMarshall.h);
            heatTransferNames.push("Ranz-Marshall");
        }
        if (results.heatTransfer.gnielinski) {
            hValues.push(results.heatTransfer.gnielinski.h);
            heatTransferNames.push("Gnielinski");
        }
        if (results.heatTransfer.dittusBoelter) {
            hValues.push(results.heatTransfer.dittusBoelter.h);
            heatTransferNames.push("Dittus-Boelter");
        }
        if (results.heatTransfer.hausen) {
            hValues.push(results.heatTransfer.hausen.h);
            heatTransferNames.push("Hausen");
        }
        
        const hMinValue = Math.min(...hValues);
        const hMaxValue = Math.max(...hValues);
        
        // 格式化数字显示函数
        const formatNumber = (num) => {
            if (Math.abs(num) < 0.001 || Math.abs(num) >= 10000) {
                return num.toExponential(3);
            } else {
                return parseFloat(num.toFixed(4)).toString();
            }
        };
        
        // 生成结果HTML
        let html = `
        <div class="results-wrapper">
            <!-- 操作条件卡片 -->
            <div class="result-card condition-card">
                <div class="section-header">
                    <span class="section-icon">🔬</span>
                    <span class="section-title">操作条件</span>
                </div>
                <table class="results-table">
                    <tr>
                        <th>参数</th>
                        <th>数值</th>
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
                        <td>颗粒直径</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(inputs.particleDiameter)}</span>
                                <span class="value-unit">m</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>床层空隙率</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(inputs.voidFraction)}</span>
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
                        <td>流体粘度</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(inputs.fluidViscosity)}</span>
                                <span class="value-unit">Pa·s</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>流体热导率</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(inputs.fluidThermalConductivity)}</span>
                                <span class="value-unit">W/m·K</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>流体比热容</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(inputs.fluidSpecificHeat)}</span>
                                <span class="value-unit">J/kg·K</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>分子扩散系数</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(inputs.molecularDiffusivity)}</span>
                                <span class="value-unit">m²/s</span>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- 特征参数卡片 -->
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
                                <span class="value-number">${formatNumber(results.dimensionless.Re)}</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Schmidt数 (Sc)</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(results.dimensionless.Sc)}</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Prandtl数 (Pr)</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(results.dimensionless.Pr)}</span>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>`;

        // 传质系数结果卡片
        if (Object.keys(results.massTransfer).length > 0) {
            html += `
            <div class="result-card pressure-card">
                <div class="section-header">
                    <span class="section-icon">💡</span>
                    <span class="section-title">传质系数计算结果</span>
                </div>
                <table class="results-table">
                    <tr>
                        <th>计算方程</th>
                        <th>Sherwood数</th>
                        <th>传质系数 (m/s)</th>
                    </tr>`;
            
            if (results.massTransfer.ranzMarshall) {
                const isMin = results.massTransfer.ranzMarshall.k === kMinValue;
                const isMax = results.massTransfer.ranzMarshall.k === kMaxValue;
                const indication = isMin ? '最小值' : isMax ? '最大值' : '';
                const badgeClass = isMin ? 'min-badge' : isMax ? 'max-badge' : '';
                
                html += `
                    <tr>
                        <td>
                            <div class="equation-name">
                                Ranz-Marshall
                                <a href="#" class="info-link correlation-info" data-correlation="ranz_marshall" title="查看公式">ℹ️</a>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(results.massTransfer.ranzMarshall.Sh)}</span>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(results.massTransfer.ranzMarshall.k)}</span>
                                <span class="value-unit">m/s</span>
                                ${indication ? `<span class="result-badge ${badgeClass}">${indication}</span>` : ''}
                            </div>
                        </td>
                    </tr>`;
            }
            
            if (results.massTransfer.wakaoFunazkri) {
                const isMin = results.massTransfer.wakaoFunazkri.k === kMinValue;
                const isMax = results.massTransfer.wakaoFunazkri.k === kMaxValue;
                const indication = isMin ? '最小值' : isMax ? '最大值' : '';
                const badgeClass = isMin ? 'min-badge' : isMax ? 'max-badge' : '';
                
                html += `
                    <tr>
                        <td>
                            <div class="equation-name">
                                Wakao-Funazkri
                                <a href="#" class="info-link correlation-info" data-correlation="wakao_funazkri" title="查看公式">ℹ️</a>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(results.massTransfer.wakaoFunazkri.Sh)}</span>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(results.massTransfer.wakaoFunazkri.k)}</span>
                                <span class="value-unit">m/s</span>
                                ${indication ? `<span class="result-badge ${badgeClass}">${indication}</span>` : ''}
                            </div>
                        </td>
                    </tr>`;
            }
            
            if (results.massTransfer.froessling) {
                const isMin = results.massTransfer.froessling.k === kMinValue;
                const isMax = results.massTransfer.froessling.k === kMaxValue;
                const indication = isMin ? '最小值' : isMax ? '最大值' : '';
                const badgeClass = isMin ? 'min-badge' : isMax ? 'max-badge' : '';
                
                html += `
                    <tr>
                        <td>
                            <div class="equation-name">
                                Froessling
                                <a href="#" class="info-link correlation-info" data-correlation="froessling_mass" title="查看公式">ℹ️</a>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(results.massTransfer.froessling.Sh)}</span>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(results.massTransfer.froessling.k)}</span>
                                <span class="value-unit">m/s</span>
                                ${indication ? `<span class="result-badge ${badgeClass}">${indication}</span>` : ''}
                            </div>
                        </td>
                    </tr>`;
            }

            if (results.massTransfer.rowe) {
                const isMin = results.massTransfer.rowe.k === kMinValue;
                const isMax = results.massTransfer.rowe.k === kMaxValue;
                const indication = isMin ? '最小值' : isMax ? '最大值' : '';
                const badgeClass = isMin ? 'min-badge' : isMax ? 'max-badge' : '';
                
                html += `
                    <tr>
                        <td>
                            <div class="equation-name">
                                Rowe
                                <a href="#" class="info-link correlation-info" data-correlation="rowe_mass" title="查看公式">ℹ️</a>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(results.massTransfer.rowe.Sh)}</span>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(results.massTransfer.rowe.k)}</span>
                                <span class="value-unit">m/s</span>
                                ${indication ? `<span class="result-badge ${badgeClass}">${indication}</span>` : ''}
                            </div>
                        </td>
                    </tr>`;
            }
            
            html += `</table>`;
            
            // 如果有多个结果，添加统计分析和图表
            if (massTransferNames.length > 1) {
                const avgValue = kValues.reduce((a, b) => a + b, 0) / kValues.length;
                const difference = kMaxValue - kMinValue;
                const percentDiff = (difference / avgValue * 100);
                
                html += `
                <div class="result-chart">
                    <div class="chart-title">传质系数比较</div>
                    <div class="bar-chart">
                        ${massTransferNames.map((name, idx) => {
                            const value = kValues[idx];
                            const percent = (value / kMaxValue * 100).toFixed(1);
                            let barClass = "";
                            if (value === kMinValue) barClass = "min-bar";
                            if (value === kMaxValue) barClass = "max-bar";
                            
                            return `
                            <div class="chart-row">
                                <div class="chart-label">${name}</div>
                                <div class="chart-bar-container">
                                    <div class="chart-bar ${barClass}" style="width: ${percent}%;">
                                        <span class="bar-value">${formatNumber(value)}</span>
                                    </div>
                                </div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>
                
                <div class="section-header" style="margin-top: 15px;">
                    <span class="section-icon">📈</span>
                    <span class="section-title">传质系数统计分析</span>
                </div>
                <table class="results-table">
                    <tr>
                        <td>平均传质系数</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(avgValue)}</span>
                                <span class="value-unit">m/s</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>最大差异（最大值与最小值之差）</td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(difference)}</span>
                                <span class="value-unit">m/s</span>
                                <span class="percentage">(差异率: ${formatNumber(percentDiff)}%)</span>
                            </div>
                        </td>
                    </tr>
                </table>`;
            }
            
            html += `</div>`;
        }

        // 传热系数结果卡片
        if (Object.keys(results.heatTransfer).length > 0) {
            html += `
            <div class="result-card pressure-card" style="border-top-color: #27AE60;">
                <div class="section-header">
                    <span class="section-icon">🔥</span>
                    <span class="section-title">传热系数计算结果</span>
                </div>
                <table class="results-table">
                    <tr>
                        <th>计算方程</th>
                        <th>Nusselt数</th>
                        <th>传热系数 (W/m²·K)</th>
                    </tr>`;
            
            if (results.heatTransfer.ranzMarshall) {
                const isMin = results.heatTransfer.ranzMarshall.h === hMinValue;
                const isMax = results.heatTransfer.ranzMarshall.h === hMaxValue;
                const indication = isMin ? '最小值' : isMax ? '最大值' : '';
                const badgeClass = isMin ? 'min-badge' : isMax ? 'max-badge' : '';
                
                html += `
                    <tr>
                        <td>
                            <div class="equation-name">
                                Ranz-Marshall
                                <a href="#" class="info-link correlation-info" data-correlation="ranz_marshall_heat" title="查看公式">ℹ️</a>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(results.heatTransfer.ranzMarshall.Nu)}</span>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(results.heatTransfer.ranzMarshall.h)}</span>
                                <span class="value-unit">W/m²·K</span>
                                ${indication ? `<span class="result-badge ${badgeClass}">${indication}</span>` : ''}
                            </div>
                        </td>
                    </tr>`;
            }
            
            if (results.heatTransfer.gnielinski) {
                const isMin = results.heatTransfer.gnielinski.h === hMinValue;
                const isMax = results.heatTransfer.gnielinski.h === hMaxValue;
                const indication = isMin ? '最小值' : isMax ? '最大值' : '';
                const badgeClass = isMin ? 'min-badge' : isMax ? 'max-badge' : '';
                
                html += `
                    <tr>
                        <td>
                            <div class="equation-name">
                                Gnielinski
                                <a href="#" class="info-link correlation-info" data-correlation="gnielinski" title="查看公式">ℹ️</a>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(results.heatTransfer.gnielinski.Nu)}</span>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(results.heatTransfer.gnielinski.h)}</span>
                                <span class="value-unit">W/m²·K</span>
                                ${indication ? `<span class="result-badge ${badgeClass}">${indication}</span>` : ''}
                            </div>
                        </td>
                    </tr>`;
            }
            
            if (results.heatTransfer.dittusBoelter) {
                const isMin = results.heatTransfer.dittusBoelter.h === hMinValue;
                const isMax = results.heatTransfer.dittusBoelter.h === hMaxValue;
                const indication = isMin ? '最小值' : isMax ? '最大值' : '';
                const badgeClass = isMin ? 'min-badge' : isMax ? 'max-badge' : '';
                
                html += `
                    <tr>
                        <td>
                            <div class="equation-name">
                                Dittus-Boelter
                                <a href="#" class="info-link correlation-info" data-correlation="dittus_boelter_heat" title="查看公式">ℹ️</a>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(results.heatTransfer.dittusBoelter.Nu)}</span>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(results.heatTransfer.dittusBoelter.h)}</span>
                                <span class="value-unit">W/m²·K</span>
                                ${indication ? `<span class="result-badge ${badgeClass}">${indication}</span>` : ''}
                            </div>
                        </td>
                    </tr>`;
            }
            
            if (results.heatTransfer.hausen) {
                const isMin = results.heatTransfer.hausen.h === hMinValue;
                const isMax = results.heatTransfer.hausen.h === hMaxValue;
                const indication = isMin ? '最小值' : isMax ? '最大值' : '';
                const badgeClass = isMin ? 'min-badge' : isMax ? 'max-badge' : '';
                
                html += `
                    <tr>
                        <td>
                            <div class="equation-name">
                                Hausen
                                <a href="#" class="info-link correlation-info" data-correlation="hausen_heat" title="查看公式">ℹ️</a>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(results.heatTransfer.hausen.Nu)}</span>
                            </div>
                        </td>
                        <td class="value-column">
                            <div class="value-with-unit">
                                <span class="value-number">${formatNumber(results.heatTransfer.hausen.h)}</span>
                                <span class="value-unit">W/m²·K</span>
                                ${indication ? `<span class="result-badge ${badgeClass}">${indication}</span>` : ''}
                            </div>
                        </td>
                    </tr>`;
            }
            
            html += `</table>`;
            
            // 如果有多个结果，添加统计分析和图表
            if (heatTransferNames.length > 1) {
                const avgValue = hValues.reduce((a, b) => a + b, 0) / hValues.length;
                const difference = hMaxValue - hMinValue;
                const percentDiff = (difference / avgValue * 100);
                
                html += `
                <div class="result-chart">
                    <div class="chart-title">传热系数比较</div>
                    <div class="bar-chart">
                        ${heatTransferNames.map((name, idx) => {
                            const value = hValues[idx];
                            const percent = (value / hMaxValue * 100).toFixed(1);
                            let barClass = "";
                            if (value === hMinValue) barClass = "min-bar";
                            if (value === hMaxValue) barClass = "max-bar";
                            
                            return `
                            <div class="chart-row">
                                <div class="chart-label">${name}</div>
                                <div class="chart-bar-container">
                                    <div class="chart-bar ${barClass}" style="width: ${percent}%;">
                                        <span class="bar-value">${formatNumber(value)}</span>
                                    </div>
                                </div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>
                
                <div class="section-header" style="margin-top: 15px;">
                    <span class="section-icon">📈</span>
                    <span class="section-title">传热系数统计分析</span>
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
                </table>`;
            }
            
            html += `</div>`;
        }

        html += `</div><div class="completion-message">✅ 计算完成！✨</div>`;
        resultsContent.innerHTML = html;
        
        // 重新绑定公式信息链接的点击事件
        const newInfoLinks = document.querySelectorAll('.results-content .info-link');
        newInfoLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const correlationId = this.dataset.correlation;
                showFormulaDetails(correlationId);
                showModal();
            });
        });
    }

    // Modal Functionality
    async function showModal() {
        modal.style.display = "block";
        loadingOverlay.classList.add('show');
        
        try {
            if (window.MathJax) {
                if (typeof MathJax.typesetPromise === 'function') {
                    await MathJax.typesetPromise([modal]);
                } else if (typeof MathJax.typeset === 'function') {
                    MathJax.typeset([modal]);
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

    // Event Listeners
    calculateBtn.addEventListener('click', calculate);
    clearBtn.addEventListener('click', clearValues);
    resetBtn.addEventListener('click', resetValues);

    modalClose.addEventListener('click', hideModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });

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
            </div>
        `;

        // 增强公式显示效果
        function enhanceFormulas() {
            // 直接设置公式元素的样式
            const formulaElements = document.querySelectorAll('.formula-math');
            formulaElements.forEach(elem => {
                elem.style.border = '2px solid var(--primary-color)';
                elem.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                elem.style.background = '#ffffff';
            });
            
            // 设置所有MathJax相关元素的样式
            setTimeout(() => {
                const mathJaxElements = document.querySelectorAll('.MathJax, .mjx-chtml, .mjx-math, .mjx-mrow, .mjx-mi, .mjx-mn, .mjx-mo');
                mathJaxElements.forEach(elem => {
                    elem.style.color = '#000000';
                    elem.style.opacity = '1';
                });
                
                // 处理MathJax中的SVG路径
                const svgPaths = document.querySelectorAll('.MathJax_SVG_Display path, .MathJax_SVG path, .MathJax path, svg path');
                svgPaths.forEach(path => {
                    path.setAttribute('stroke', '#000000');
                    path.setAttribute('fill', '#000000');
                    path.style.stroke = '#000000';
                    path.style.fill = '#000000';
                });
            }, 100);
        }

        detailContent.innerHTML = content;
        
        if (window.MathJax) {
            MathJax.typesetPromise([detailContent]).then(() => {
                // 确保所有MathJax元素都在顶层
                document.querySelectorAll('.formula-math .MathJax').forEach(element => {
                    element.style.zIndex = "100";
                    element.style.color = "#000000";
                    element.style.opacity = "1";
                    element.style.fontWeight = "500";
                    
                    // 处理MathJax内部的所有元素
                    const allMathElements = element.querySelectorAll('*');
                    allMathElements.forEach(el => {
                        el.style.color = "#000000";
                        el.style.opacity = "1";
                    });
                });
                
                // 为公式区域添加额外样式以增强显示效果
                document.querySelectorAll('.formula-math').forEach(mathContainer => {
                    mathContainer.style.background = "#ffffff";
                    mathContainer.style.border = "2px solid #4A90E2";
                });
                
                // 额外调用增强函数
                enhanceFormulas();
            }).catch(error => {
                console.error('MathJax typesetting error:', error);
            });
        }
        
        showModal().catch(error => {
            console.error('Error showing modal:', error);
            loadingOverlay.classList.remove('show');
        });
    }

    // Event delegation for formula info links
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.correlation-info')) {
            e.preventDefault();
            e.stopPropagation();
            const link = e.target.closest('.correlation-info');
            const formulaId = link.dataset.correlation;
            if (formulaId) {
                loadingOverlay.classList.add('show');
                try {
                    modal.style.display = "block";
                    await showFormulaDetails(formulaId);
                } catch (error) {
                    console.error('Error showing formula details:', error);
                } finally {
                    loadingOverlay.classList.remove('show');
                }
            }
        }
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

    // Initialize with default values
    resetValues();

    // Remove loading overlay after initialization
    loadingOverlay.classList.remove('show');

    // 设置输入验证
    function setupInputValidation() {
        const inputs = document.querySelectorAll('input[type="number"]');
        
        inputs.forEach(input => {
            input.addEventListener('input', function(e) {
                // 移除浏览器原生的无效样式
                this.style.borderColor = '';
                
                // 当输入内容发生变化时，重置边框颜色
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                }
                
                // 如果用户聚焦，使用定义的聚焦样式
                if (document.activeElement === this) {
                    this.style.borderColor = 'var(--primary-color)';
                }
            });
            
            // 当输入框获得焦点时应用聚焦样式
            input.addEventListener('focus', function() {
                this.style.borderColor = 'var(--primary-color)';
            });
            
            // 当输入框失去焦点时恢复正常样式
            input.addEventListener('blur', function() {
                this.style.borderColor = '';
            });
        });
    }
});
