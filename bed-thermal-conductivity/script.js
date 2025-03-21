document.addEventListener('DOMContentLoaded', function() {
    // Loading indicator
    const loadingOverlay = document.getElementById('loading-overlay');
    const modal = document.getElementById('formulaModal');
    const modalClose = document.querySelector('.modal-close');
    const formulaDetail = document.getElementById('formulaDetail');
    const infoLinks = document.querySelectorAll('.correlation-info');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const calculateBtn = document.getElementById('calculate');
    const clearBtn = document.getElementById('clear');
    const resetBtn = document.getElementById('reset');

    // Default Values
    const defaultValues = {
        fluid_velocity: 1,
        particle_diameter: 0.006,
        fluid_thermal_conductivity: 0.0257,
        solid_thermal_conductivity: 20,
        void_fraction: 0.4,
        fluid_density: 1.225,
        fluid_viscosity: "1.81e-5",
        fluid_heat_capacity: 1005
    };

    // Reset Function
    function resetValues() {
        for (const [id, value] of Object.entries(defaultValues)) {
            const element = document.getElementById(id);
            if (element) element.value = value;
        }
    }

    // Clear Function
    function clearValues() {
        const inputs = document.querySelectorAll('input[type="number"], input[type="text"]');
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

    // Modal Functionality
    function showModal() {
        if (!modal) return;
        modal.style.display = "block";
        // Add show class after a brief delay to trigger transitions
        setTimeout(() => {
            modal.classList.add('show');
            // Focus first interactive element
            const firstFocusable = modal.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (firstFocusable) firstFocusable.focus();
        }, 10);
    }

    // Event Listeners for formulas
    infoLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const correlation = link.dataset.correlation;
            const info = formulaInfo[correlation];
            if (info) {
                loadingOverlay.classList.add('show');
                formulaDetail.innerHTML = `<h4>${info.title}</h4>${info.content}`;
                showModal();
                
                // Ensure MathJax processes the new content
                if (window.MathJax) {
                    window.MathJax.typesetPromise([formulaDetail]).then(() => {
                        loadingOverlay.classList.remove('show');
                    }).catch((err) => {
                        console.error('MathJax处理错误:', err);
                        loadingOverlay.classList.remove('show');
                    });
                } else {
                    console.warn('MathJax未加载');
                    loadingOverlay.classList.remove('show');
                }
            }
        });
    });

    // Modal close handlers
    function hideModal() {
        modal.classList.remove('show');
        // Wait for transition to complete before hiding
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    modalClose.addEventListener('click', hideModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Formula Information
    const formulaInfo = {
        yagi_kunii_axial: {
            title: "Yagi-Kunii轴向导热关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ k_{eff,a} = k_f(0.7Re\\cdot Pr) + k_f\\frac{1-\\varepsilon}{1+\\varepsilon(k_s/k_f-1)} \\]
                    </div>
                    <p>该公式包含两部分：</p>
                    <ul>
                        <li>第一项: 弥散导热贡献 k<sub>disp</sub> = k<sub>f</sub>(0.7Re·Pr)</li>
                        <li>第二项: 静态导热贡献 k<sub>static</sub> = k<sub>f</sub>(1-ε)/(1+ε(k<sub>s</sub>/k<sub>f</sub>-1))</li>
                    </ul>
                    <p>适用范围：</p>
                    <ul>
                        <li>0.2 < Re < 200</li>
                        <li>空隙率: 0.35 - 0.75</li>
                    </ul>
                </div>`
        },
        yagi_kunii_radial: {
            title: "Yagi-Kunii径向导热关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ k_{eff,r} = k_f(0.1Re) + k_f\\frac{1-\\varepsilon}{2+\\varepsilon(k_s/k_f-1)} \\]
                    </div>
                    <p>该公式包含两部分：</p>
                    <ul>
                        <li>第一项: 弥散导热贡献 k<sub>disp</sub> = k<sub>f</sub>(0.1Re)</li>
                        <li>第二项: 静态导热贡献 k<sub>static</sub> = k<sub>f</sub>(1-ε)/(2+ε(k<sub>s</sub>/k<sub>f</sub>-1))</li>
                    </ul>
                    <p>适用范围与轴向相同</p>
                </div>`
        },
        zbs_axial: {
            title: "Zehner-Bauer-Schluender轴向关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ k_{eff} = k_f \\left\\{ (1-\\sqrt{1-\\varepsilon})(1 + \\beta Nu) + \\sqrt{1-\\varepsilon} \\frac{2}{N} \\frac{(B-1)}{\\Psi} \\left[ \\frac{\\Psi - \\ln(\\Psi)}{(\\Psi)^2} - \\frac{1}{2}\\Psi - \\frac{3}{8} \\right] \\right\\} + k_r \\]
                    </div>
                    <p>该模型综合考虑了静态导热和流体弥散传热的贡献：</p>
                    <ul>
                        <li>第一项 (1-√(1-ε))(1+βNu): 主要反映流体弥散效应</li>
                        <li>第二项 √(1-ε)(...): 主要反映静态导热贡献</li>
                        <li>k<sub>r</sub>: 辐射热量传递的贡献</li>
                    </ul>
                    <p>适用范围：</p>
                    <ul>
                        <li>空隙率 (ε): 0.35 - 0.75</li>
                        <li>颗粒形状: 球形及近似球形</li>
                        <li>流体Prandtl数 (Pr) 接近 1</li>
                    </ul>
                </div>`
        },
        zbs_radial: {
            title: "Zehner-Bauer-Schluender径向关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ k_{eff,r} = 0.8k_{eff,a} \\]
                    </div>
                    <p>径向导热系数通常比轴向小约20%，保持静态和弥散组分的相对比例</p>
                </div>`
        },
        vortmeyer_axial: {
            title: "Vortmeyer轴向关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ k_{eff,a} = k_f(8) + k_f(0.054Pe) \\]
                    </div>
                    <p>该公式包含两部分：</p>
                    <ul>
                        <li>第一项 k<sub>f</sub>(8): 静态导热贡献，与流速无关</li>
                        <li>第二项 k<sub>f</sub>(0.054Pe): 弥散导热贡献，与流速相关</li>
                        <li>Pe = Re·Pr (佩克莱数)</li>
                    </ul>
                </div>`
        },
        bauer_schlunder: {
            title: "Bauer-Schlunder关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ k_{eff,r} = k_0 (1 + 0.14 Re \\sqrt{\\frac{\\varepsilon}{1-\\varepsilon}}) \\]
                    </div>
                    <p>包含静态和弥散两部分：</p>
                    <ul>
                        <li>k<sub>0</sub>: 静态导热系数部分</li>
                        <li>弥散因子 (1 + 0.14Re√(ε/(1-ε))): 考虑流动对导热的增强</li>
                    </ul>
                    <div class="formula-math">
                        \\[ k_0 = k_f (1 - \\sqrt{1-\\varepsilon} + \\frac{\\sqrt{1-\\varepsilon}}{\\frac{1}{B} + \\frac{1}{3}}) \\]
                    </div>
                    <p>适用范围：</p>
                    <ul>
                        <li>0.2 < Re < 1000</li>
                        <li>0.3 < ε < 0.6</li>
                        <li>1 < B = ks/kf < 1000</li>
                    </ul>
                </div>`
        },
        static_dispersion_axial: {
            title: "静态-弥散组合模型（轴向）",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ k_{eff,a} = k_{static,a} + k_{disp,a} = k_{static,a} + \\frac{1}{2}k_f \\cdot RePr \\]
                    </div>
                    <p>明确的双组分模型：</p>
                    <ul>
                        <li>k<sub>static,a</sub>: 静态轴向导热系数，使用Yagi-Kunii关联式的静态部分</li>
                        <li>k<sub>disp,a</sub> = (1/2)k<sub>f</sub>·Re·Pr: 流动引起的弥散导热贡献</li>
                    </ul>
                    <p>该模型清晰区分了静态导热和弥散导热的贡献，便于分析不同流动条件下的影响。</p>
                </div>`
        },
        static_dispersion_radial: {
            title: "静态-弥散组合模型（径向）",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ k_{eff,r} = k_{static,r} + k_{disp,r} = k_{static,r} + \\frac{RePr}{Pe_{th}(\\infty)}k_f \\]
                    </div>
                    <p>明确的双组分模型：</p>
                    <ul>
                        <li>k<sub>static,r</sub>: 静态径向导热系数，使用Yagi-Kunii关联式的静态部分</li>
                        <li>k<sub>disp,r</sub> = (Re·Pr/Pe<sub>th</sub>(∞))·k<sub>f</sub>: 流动引起的弥散导热贡献</li>
                        <li>Pe<sub>th</sub>(∞): 渐近热佩克莱特数，取值范围8-12，本计算器取10</li>
                    </ul>
                    <p>该模型对于研究径向换热特性特别有用，可明确区分静态和弥散导热效应。</p>
                </div>`
        },
        yagi_kunii_static: {
            title: "Yagi-Kunii静态导热系数关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ k_{static} = k_f\\frac{1-\\varepsilon}{1+\\varepsilon(k_s/k_f-1)} \\text{ (轴向)} \\]
                        \\[ k_{static} = k_f\\frac{1-\\varepsilon}{2+\\varepsilon(k_s/k_f-1)} \\text{ (径向)} \\]
                    </div>
                    <p>静态导热系数是指流体不流动时的有效导热系数，主要由填料结构和流体、固体的导热系数决定。</p>
                    <p>适用范围：</p>
                    <ul>
                        <li>空隙率: 0.35 - 0.75</li>
                        <li>颗粒形状: 球形及近似球形</li>
                    </ul>
                </div>`
        },
        zbs_static: {
            title: "Zehner-Bauer-Schlunder静态导热系数关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ k_{static} = k_f \\left\\{ (1-\\sqrt{1-\\varepsilon}) + \\sqrt{1-\\varepsilon} \\frac{2}{N} \\frac{(B-1)}{\\Psi} \\left[ \\frac{\\Psi - \\ln(\\Psi)}{(\\Psi)^2} - \\frac{1}{2}\\Psi - \\frac{3}{8} \\right] \\right\\} \\]
                    </div>
                    <p>其中：</p>
                    <ul>
                        <li>B = k<sub>s</sub>/k<sub>f</sub>: 固体与流体导热系数比</li>
                        <li>Ψ = B</li>
                        <li>N: 形状系数</li>
                    </ul>
                    <p>该模型考虑了颗粒几何形状的影响，在静态条件下更精确。</p>
                </div>`
        },
        vortmeyer_static: {
            title: "Vortmeyer静态导热系数关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ k_{static} = 8 \\cdot k_f \\]
                    </div>
                    <p>Vortmeyer模型中静态导热系数是流体导热系数的8倍，这是一个简化模型，适用于低雷诺数情况。</p>
                </div>`
        },
        yagi_kunii_dispersion_axial: {
            title: "Yagi-Kunii轴向弥散系数关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ k_{disp,a} = 0.7 \\cdot k_f \\cdot Re \\cdot Pr \\]
                    </div>
                    <p>轴向弥散导热系数是由流体流动引起的有效导热增强效应，与雷诺数和普朗特数成正比。</p>
                    <p>适用范围：</p>
                    <ul>
                        <li>0.2 < Re < 200</li>
                    </ul>
                </div>`
        },
        vortmeyer_dispersion_axial: {
            title: "Vortmeyer轴向弥散系数关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ k_{disp,a} = 0.054 \\cdot k_f \\cdot Pe \\]
                    </div>
                    <p>其中：</p>
                    <ul>
                        <li>Pe = Re·Pr (佩克莱数)</li>
                    </ul>
                    <p>该关联式直接将弥散系数与佩克莱数关联，适用于较广泛的流动条件。</p>
                </div>`
        },
        edwards_axial: {
            title: "Edwards轴向弥散系数关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ k_{disp,a} = \\frac{1}{2} \\cdot k_f \\cdot Re \\cdot Pr \\]
                    </div>
                    <p>Edwards模型提出了一种简单的弥散系数计算方法，系数为1/2，是一种常用的轴向弥散估计方法。</p>
                </div>`
        },
        yagi_kunii_dispersion_radial: {
            title: "Yagi-Kunii径向弥散系数关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ k_{disp,r} = 0.1 \\cdot k_f \\cdot Re \\]
                    </div>
                    <p>径向弥散导热系数通常小于轴向，在Yagi-Kunii模型中，径向弥散仅与雷诺数相关，不包含普朗特数。</p>
                </div>`
        },
        bauer_schlunder_dispersion: {
            title: "Bauer-Schlunder径向弥散系数关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ k_{disp,r} = k_0 \\cdot 0.14 \\cdot Re \\sqrt{\\frac{\\varepsilon}{1-\\varepsilon}} \\]
                    </div>
                    <p>其中k<sub>0</sub>为静态导热系数，该模型考虑了空隙率的影响。</p>
                    <p>适用范围：</p>
                    <ul>
                        <li>0.2 < Re < 1000</li>
                        <li>0.3 < ε < 0.6</li>
                    </ul>
                </div>`
        },
        peclet_radial: {
            title: "佩克莱数径向弥散关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ k_{disp,r} = \\frac{Re \\cdot Pr}{Pe_{th}(\\infty)} \\cdot k_f \\]
                    </div>
                    <p>其中：</p>
                    <ul>
                        <li>Pe<sub>th</sub>(∞): 渐近热佩克莱特数，通常取值8-12</li>
                    </ul>
                    <p>该模型通过引入渐近热佩克莱特数，给出了径向弥散系数的通用关联式。</p>
                </div>`
        }
    };

    // Initialize Nusselt number calculation
    function calculateNusselt(Re, Pr) {
        return 0.24 * Math.pow(Re, 0.6) * Math.pow(Pr, 0.36);
    }

    // Calculate Reynolds number
    function calculateReynolds(fluidVelocity, particleDiameter, fluidDensity, fluidViscosity) {
        // Ensure all parameters are valid
        if (isNaN(fluidVelocity) || isNaN(particleDiameter) || isNaN(fluidDensity) || isNaN(fluidViscosity) ||
            fluidVelocity <= 0 || particleDiameter <= 0 || fluidDensity <= 0 || fluidViscosity <= 0) {
            console.error("Invalid parameters for Reynolds number calculation", {
                fluidVelocity, particleDiameter, fluidDensity, fluidViscosity
            });
            return 0;
        }
        return (fluidDensity * fluidVelocity * particleDiameter) / fluidViscosity;
    }

    // Calculate Prandtl number
    function calculatePrandtl(fluidCp, fluidViscosity, fluidThermalConductivity) {
        // Ensure all parameters are valid
        if (isNaN(fluidCp) || isNaN(fluidViscosity) || isNaN(fluidThermalConductivity) ||
            fluidCp <= 0 || fluidViscosity <= 0 || fluidThermalConductivity <= 0) {
            console.error("Invalid parameters for Prandtl number calculation", {
                fluidCp, fluidViscosity, fluidThermalConductivity
            });
            return 0;
        }
        return (fluidCp * fluidViscosity) / fluidThermalConductivity;
    }

    // Axial thermal conductivity calculations
    function calculateYagiKuniiAxial(inputs) {
        const staticComponent = calculateStaticThermalConductivity(inputs, 'axial');
        const dispersionComponent = calculateDispersionThermalConductivity(inputs, 'axial');
        return staticComponent + dispersionComponent;
    }

    function calculateZBSAxial(inputs) {
        const { fluidThermalConductivity: kf, solidThermalConductivity: ks, voidFraction: ε } = inputs;
        const B = ks/kf;
        const β = 0.1;
        const N = 1.0; // 使用固定形状系数值
        const Nu = calculateNusselt(calculateReynolds(inputs.fluidVelocity, inputs.particleDiameter, inputs.fluidDensity, inputs.fluidViscosity),
                                 calculatePrandtl(inputs.fluidHeatCapacity, inputs.fluidViscosity, kf));
        const ψ = (B * (1 + β * Nu)) / (1 - Math.sqrt(1 - ε));
        return kf * ((1 - Math.sqrt(1 - ε)) * (1 + β * Nu) + 
                    Math.sqrt(1 - ε) * (2/N) * ((B-1)/ψ) * 
                    ((ψ - Math.log(ψ))/(ψ*ψ) - 0.5*ψ - 0.375));
    }

    function calculateVortmeyerAxial(inputs) {
        const { fluidThermalConductivity: kf } = inputs;
        const Pe = calculateReynolds(inputs.fluidVelocity, inputs.particleDiameter, inputs.fluidDensity, inputs.fluidViscosity) * 
                   calculatePrandtl(inputs.fluidHeatCapacity, inputs.fluidViscosity, kf);
        return kf * (8 + 0.054 * Pe);
    }

    // Radial thermal conductivity calculations
    function calculateYagiKuniiRadial(inputs) {
        const staticComponent = calculateStaticThermalConductivity(inputs, 'radial');
        const dispersionComponent = calculateDispersionThermalConductivity(inputs, 'radial');
        return staticComponent + dispersionComponent;
    }

    function calculateZBSRadial(inputs) {
        return calculateZBSAxial(inputs) * 0.8;  // Radial conductivity is typically smaller
    }

    // 新增静态导热系数计算
    function calculateStaticThermalConductivity(inputs, direction) {
        const { fluidThermalConductivity: kf, solidThermalConductivity: ks, voidFraction: ε } = inputs;
        const ratio = ks / kf;
        
        // 使用简化模型计算静态导热系数
        if (direction === 'axial') {
            // 轴向静态导热系数 - 使用Yagi-Kunii静态部分
            return kf * ((1 - ε) * (ks/kf) / (1 + ε * (ks/kf - 1)));
        } else { // radial
            // 径向静态导热系数 - 使用Yagi-Kunii静态部分
            return kf * ((1 - ε) * (ks/kf) / (2 + ε * (ks/kf - 1)));
        }
    }
    
    // 计算弥散导热系数
    function calculateDispersionThermalConductivity(inputs, direction) {
        const { fluidThermalConductivity: kf } = inputs;
        const Re = calculateReynolds(inputs.fluidVelocity, inputs.particleDiameter, inputs.fluidDensity, inputs.fluidViscosity);
        const Pr = calculatePrandtl(inputs.fluidHeatCapacity, inputs.fluidViscosity, kf);
        
        if (direction === 'axial') {
            // 轴向弥散导热系数 - 从Yagi-Kunii弥散部分提取
            return kf * (0.7 * Re * Pr);
        } else { // radial
            // 径向弥散导热系数 - 从Yagi-Kunii弥散部分提取
            return kf * (0.1 * Re);
        }
    }

    // 新增静态-弥散组合模型计算函数
    function calculateStaticDispersionAxial(inputs) {
        const { fluidThermalConductivity: kf } = inputs;
        // 计算静态导热系数部分
        const staticThermal = calculateStaticThermalConductivity(inputs, 'axial');
        // 计算雷诺数和普朗特数
        const Re = calculateReynolds(inputs.fluidVelocity, inputs.particleDiameter, inputs.fluidDensity, inputs.fluidViscosity);
        const Pr = calculatePrandtl(inputs.fluidHeatCapacity, inputs.fluidViscosity, kf);
        
        // 计算弥散项
        const dispersion = 0.5 * Re * Pr * kf;
        
        // 总的有效导热系数 = 静态部分 + 弥散部分
        return staticThermal + dispersion;
    }

    function calculateStaticDispersionRadial(inputs) {
        const { fluidThermalConductivity: kf } = inputs;
        // 计算静态导热系数部分
        const staticThermal = calculateStaticThermalConductivity(inputs, 'radial');
        // 计算雷诺数和普朗特数
        const Re = calculateReynolds(inputs.fluidVelocity, inputs.particleDiameter, inputs.fluidDensity, inputs.fluidViscosity);
        const Pr = calculatePrandtl(inputs.fluidHeatCapacity, inputs.fluidViscosity, kf);
        
        // 计算弥散项，Pe_th(∞)取10
        const pecletAsymptotic = 10; 
        const dispersion = (Re * Pr / pecletAsymptotic) * kf;
        
        // 总的有效导热系数 = 静态部分 + 弥散部分
        return staticThermal + dispersion;
    }

    // 定义专门的静态导热系数计算函数
    function calculateYagiKuniiStatic(inputs, direction) {
        const { fluidThermalConductivity: kf, solidThermalConductivity: ks, voidFraction: ε } = inputs;
        
        if (direction === 'axial') {
            return kf * ((1 - ε) * (ks/kf) / (1 + ε * (ks/kf - 1)));
        } else { // radial
            return kf * ((1 - ε) * (ks/kf) / (2 + ε * (ks/kf - 1)));
        }
    }

    function calculateZBSStatic(inputs) {
        const { fluidThermalConductivity: kf, solidThermalConductivity: ks, voidFraction: ε } = inputs;
        const B = ks/kf;
        const N = 1.0; // 形状系数，球形颗粒取1.0
        
        // 保护性检查
        if (B <= 0 || ε <= 0 || ε >= 1) {
            console.error('Invalid parameters for ZBS static calculation');
            return 0;
        }

        // 静态导热系数计算 - 使用改进的形式
        const sqrtTerm = Math.sqrt(1 - ε);
        const firstTerm = kf * (1 - sqrtTerm);
        
        // 计算第二项，避免数值不稳定性
        let secondTerm;
        if (B > 1) {
            // 当B > 1时的计算方式
            secondTerm = kf * sqrtTerm * (2/N) * 
                        ((B - 1)/B) * 
                        (0.5 * (B + 1));
        } else {
            // 当B ≤ 1时的计算方式
            secondTerm = kf * sqrtTerm * (2/N) * 
                        (1 - 1/B) * 
                        (0.5 * (1 + 1/B));
        }
        
        return firstTerm + secondTerm;
    }

    // 定义专门的弥散导热系数计算函数
    function calculateYagiKuniiDispersionAxial(inputs) {
        const { fluidThermalConductivity: kf } = inputs;
        const Re = calculateReynolds(inputs.fluidVelocity, inputs.particleDiameter, inputs.fluidDensity, inputs.fluidViscosity);
        const Pr = calculatePrandtl(inputs.fluidHeatCapacity, inputs.fluidViscosity, kf);
        
        return kf * (0.7 * Re * Pr);
    }

    function calculateVortmeyerDispersionAxial(inputs) {
        const { fluidThermalConductivity: kf } = inputs;
        const Re = calculateReynolds(inputs.fluidVelocity, inputs.particleDiameter, inputs.fluidDensity, inputs.fluidViscosity);
        const Pr = calculatePrandtl(inputs.fluidHeatCapacity, inputs.fluidViscosity, kf);
        
        return kf * (0.054 * Re * Pr);
    }

    function calculateEdwardsAxial(inputs) {
        const { fluidThermalConductivity: kf } = inputs;
        const Re = calculateReynolds(inputs.fluidVelocity, inputs.particleDiameter, inputs.fluidDensity, inputs.fluidViscosity);
        const Pr = calculatePrandtl(inputs.fluidHeatCapacity, inputs.fluidViscosity, kf);
        
        return kf * (0.5 * Re * Pr);
    }

    function calculateYagiKuniiDispersionRadial(inputs) {
        const { fluidThermalConductivity: kf } = inputs;
        const Re = calculateReynolds(inputs.fluidVelocity, inputs.particleDiameter, inputs.fluidDensity, inputs.fluidViscosity);
        
        return kf * (0.1 * Re);
    }

    function calculateBauerSchlunderDispersion(inputs) {
        const { fluidThermalConductivity: kf, voidFraction: ε } = inputs;
        const Re = calculateReynolds(inputs.fluidVelocity, inputs.particleDiameter, inputs.fluidDensity, inputs.fluidViscosity);
        const k0 = calculateYagiKuniiStatic(inputs, 'radial');
        
        return k0 * 0.14 * Re * Math.sqrt(ε/(1-ε));
    }

    function calculatePecletRadial(inputs) {
        const { fluidThermalConductivity: kf } = inputs;
        const Re = calculateReynolds(inputs.fluidVelocity, inputs.particleDiameter, inputs.fluidDensity, inputs.fluidViscosity);
        const Pr = calculatePrandtl(inputs.fluidHeatCapacity, inputs.fluidViscosity, kf);
        const pecletAsymptotic = 10;
        
        return (Re * Pr / pecletAsymptotic) * kf;
    }

    // Calculate Function
    function calculate() {
        // Parse fluid viscosity specifically to handle scientific notation
        const fluidViscosityStr = document.getElementById('fluid_viscosity').value;
        let fluidViscosity;
        try {
            // Handle scientific notation properly
            fluidViscosity = Number(fluidViscosityStr);
        } catch (e) {
            alert('流体黏度输入格式不正确！');
            return;
        }
        
        const inputs = {
            fluidVelocity: parseFloat(document.getElementById('fluid_velocity').value),
            particleDiameter: parseFloat(document.getElementById('particle_diameter').value),
            fluidThermalConductivity: parseFloat(document.getElementById('fluid_thermal_conductivity').value),
            solidThermalConductivity: parseFloat(document.getElementById('solid_thermal_conductivity').value),
            voidFraction: parseFloat(document.getElementById('void_fraction').value),
            fluidDensity: parseFloat(document.getElementById('fluid_density').value),
            fluidViscosity: fluidViscosity,
            fluidHeatCapacity: parseFloat(document.getElementById('fluid_heat_capacity').value),
            shapeFactor: 1.0, // Default value
            radiationCoefficient: 0 // Default value
        };

        // 验证需要用户输入的参数 (不包括shapeFactor和radiationCoefficient)
        const requiredInputs = {
            fluidVelocity: inputs.fluidVelocity,
            particleDiameter: inputs.particleDiameter,
            fluidThermalConductivity: inputs.fluidThermalConductivity,
            solidThermalConductivity: inputs.solidThermalConductivity,
            voidFraction: inputs.voidFraction,
            fluidDensity: inputs.fluidDensity,
            fluidViscosity: inputs.fluidViscosity,
            fluidHeatCapacity: inputs.fluidHeatCapacity
        };

        // Validate inputs
        for (const [key, value] of Object.entries(requiredInputs)) {
            if (isNaN(value) || value <= 0) {
                const fieldNames = {
                    fluidVelocity: "流体表观速度",
                    particleDiameter: "颗粒直径",
                    fluidThermalConductivity: "流体导热系数",
                    solidThermalConductivity: "固体颗粒导热系数",
                    voidFraction: "空隙率",
                    fluidDensity: "流体密度",
                    fluidViscosity: "流体黏度",
                    fluidHeatCapacity: "流体比热容"
                };
                
                alert(`请确保所有输入均为正数！检查参数: ${fieldNames[key] || key}`);
                return;
            }
        }

        // 计算各种静态导热系数
        let staticResults = {
            axial: {},
            radial: {}
        };

        if (document.getElementById('yagi_kunii_static').checked) {
            staticResults.axial.yagiKunii = calculateYagiKuniiStatic(inputs, 'axial');
            staticResults.radial.yagiKunii = calculateYagiKuniiStatic(inputs, 'radial');
        }
        if (document.getElementById('zbs_static').checked) {
            staticResults.axial.zbs = calculateZBSStatic(inputs);
            staticResults.radial.zbs = calculateZBSStatic(inputs) * 0.8; // 径向静态导热通常是轴向的0.8倍
        }

        // 计算轴向弥散系数
        let axialDispersionResults = {};
        if (document.getElementById('yagi_kunii_dispersion_axial').checked) {
            axialDispersionResults.yagiKunii = calculateYagiKuniiDispersionAxial(inputs);
        }
        if (document.getElementById('vortmeyer_dispersion_axial').checked) {
            axialDispersionResults.vortmeyer = calculateVortmeyerDispersionAxial(inputs);
        }
        if (document.getElementById('edwards_axial').checked) {
            axialDispersionResults.edwards = calculateEdwardsAxial(inputs);
        }

        // 计算径向弥散系数
        let radialDispersionResults = {};
        if (document.getElementById('yagi_kunii_dispersion_radial').checked) {
            radialDispersionResults.yagiKunii = calculateYagiKuniiDispersionRadial(inputs);
        }
        if (document.getElementById('bauer_schlunder_dispersion').checked) {
            radialDispersionResults.bauerSchlunder = calculateBauerSchlunderDispersion(inputs);
        }
        if (document.getElementById('peclet_radial').checked) {
            radialDispersionResults.peclet = calculatePecletRadial(inputs);
        }

        // 组合计算结果
        let combinedResults = {
            axial: {},
            radial: {}
        };

        // 计算轴向总有效导热系数组合
        for (const [staticName, staticValue] of Object.entries(staticResults.axial)) {
            for (const [dispName, dispValue] of Object.entries(axialDispersionResults)) {
                const combinedName = `${staticName}_${dispName}`;
                combinedResults.axial[combinedName] = staticValue + dispValue;
            }
        }

        // 计算径向总有效导热系数组合
        for (const [staticName, staticValue] of Object.entries(staticResults.radial)) {
            for (const [dispName, dispValue] of Object.entries(radialDispersionResults)) {
                const combinedName = `${staticName}_${dispName}`;
                combinedResults.radial[combinedName] = staticValue + dispValue;
            }
        }

        displayResults(inputs, staticResults, axialDispersionResults, radialDispersionResults, combinedResults);
        document.querySelector('[data-tab="results"]').click();
    }

    // Display Results Function
    function displayResults(inputs, staticResults, axialDispersionResults, radialDispersionResults, combinedResults) {
        const resultsContent = document.querySelector('.results-content');
        let html = '<h4>操作条件</h4>';
        html += '<table class="results-table">';
        html += '<tr><th>参数</th><th>数值</th></tr>';
        html += `<tr><td>流体表观速度</td><td>${inputs.fluidVelocity.toExponential(3)} m/s</td></tr>`;
        html += `<tr><td>颗粒直径</td><td>${inputs.particleDiameter.toExponential(3)} m</td></tr>`;
        html += `<tr><td>流体导热系数</td><td>${inputs.fluidThermalConductivity.toExponential(3)} W/m·K</td></tr>`;
        html += `<tr><td>流体密度</td><td>${inputs.fluidDensity.toExponential(3)} kg/m³</td></tr>`;
        html += `<tr><td>流体黏度</td><td>${inputs.fluidViscosity.toExponential(3)} Pa·s</td></tr>`;
        html += `<tr><td>流体比热容</td><td>${inputs.fluidHeatCapacity.toExponential(3)} J/kg·K</td></tr>`;
        html += `<tr><td>固体颗粒导热系数</td><td>${inputs.solidThermalConductivity.toExponential(3)} W/m·K</td></tr>`;
        html += `<tr><td>空隙率</td><td>${inputs.voidFraction.toFixed(3)}</td></tr>`;
        html += '</table>';

        // 无量纲数结果
        if (inputs.fluidVelocity > 0) {
            const Re = calculateReynolds(inputs.fluidVelocity, inputs.particleDiameter, inputs.fluidDensity, inputs.fluidViscosity);
            const Pr = calculatePrandtl(inputs.fluidHeatCapacity, inputs.fluidViscosity, inputs.fluidThermalConductivity);
            const Nu = calculateNusselt(Re, Pr);
            const Pe = Re * Pr;

            html += '<h4 class="section-header">传热特征参数</h4>';
            html += '<table class="results-table">';
            html += '<tr><th>参数</th><th>数值</th></tr>';
            html += `<tr><td>Reynolds数 (Re)</td><td>${Re.toExponential(3)}</td></tr>`;
            html += `<tr><td>Prandtl数 (Pr)</td><td>${Pr.toExponential(3)}</td></tr>`;
            html += `<tr><td>Nusselt数 (Nu)</td><td>${Nu.toExponential(3)}</td></tr>`;
            html += `<tr><td>Peclet数 (Pe)</td><td>${Pe.toExponential(3)}</td></tr>`;
            html += '</table>';
        }

        // 静态导热系数结果
        if (Object.keys(staticResults.axial).length > 0) {
            html += '<h4 class="section-header">静态导热系数计算结果</h4>';
            html += '<table class="results-table">';
            html += '<tr><th>计算方法</th><th>轴向静态导热系数 (W/m·K)</th><th>径向静态导热系数 (W/m·K)</th></tr>';
            
            if (staticResults.axial.yagiKunii !== undefined) {
                html += `<tr><td>Yagi-Kunii静态导热</td><td>${staticResults.axial.yagiKunii.toExponential(3)}</td><td>${staticResults.radial.yagiKunii.toExponential(3)}</td></tr>`;
            }
            if (staticResults.axial.zbs !== undefined) {
                html += `<tr><td>ZBS静态导热</td><td>${staticResults.axial.zbs.toExponential(3)}</td><td>${staticResults.radial.zbs.toExponential(3)}</td></tr>`;
            }
            html += '</table>';
        }

        // 弥散系数结果
        html += '<h4 class="section-header">弥散系数计算结果</h4>';
        
        // 轴向弥散系数
        if (Object.keys(axialDispersionResults).length > 0) {
            html += '<h5>轴向弥散系数</h5>';
            html += '<table class="results-table">';
            html += '<tr><th>计算方法</th><th>弥散系数 (W/m·K)</th></tr>';
            
            for (const [name, value] of Object.entries(axialDispersionResults)) {
                let methodName = "";
                if (name === "yagiKunii") methodName = "Yagi-Kunii轴向弥散";
                else if (name === "vortmeyer") methodName = "Vortmeyer轴向弥散";
                else if (name === "edwards") methodName = "Edwards轴向弥散";
                html += `<tr><td>${methodName}</td><td>${value.toExponential(3)}</td></tr>`;
            }
            html += '</table>';
        }
        
        // 径向弥散系数
        if (Object.keys(radialDispersionResults).length > 0) {
            html += '<h5>径向弥散系数</h5>';
            html += '<table class="results-table">';
            html += '<tr><th>计算方法</th><th>弥散系数 (W/m·K)</th></tr>';
            
            for (const [name, value] of Object.entries(radialDispersionResults)) {
                let methodName = "";
                if (name === "yagiKunii") methodName = "Yagi-Kunii径向弥散";
                else if (name === "bauerSchlunder") methodName = "Bauer-Schlunder弥散";
                else if (name === "peclet") methodName = "佩克莱数径向弥散";
                html += `<tr><td>${methodName}</td><td>${value.toExponential(3)}</td></tr>`;
            }
            html += '</table>';
        }

        // 组合计算结果 - 轴向
        if (Object.keys(combinedResults.axial).length > 0) {
            html += '<h4 class="section-header">有效导热系数组合计算结果</h4>';
            
            html += '<h5>轴向有效导热系数</h5>';
            html += '<table class="results-table">';
            html += '<tr><th>静态模型</th><th>弥散模型</th><th>总有效导热系数 (W/m·K)</th></tr>';
            
            for (const [combinedName, combinedValue] of Object.entries(combinedResults.axial)) {
                const [staticModel, dispModel] = combinedName.split('_');
                let staticModelName = "";
                let dispModelName = "";
                
                // 转换静态模型名称
                if (staticModel === "yagiKunii") staticModelName = "Yagi-Kunii静态";
                else if (staticModel === "zbs") staticModelName = "ZBS静态";
                
                // 转换弥散模型名称
                if (dispModel === "yagiKunii") dispModelName = "Yagi-Kunii弥散";
                else if (dispModel === "vortmeyer") dispModelName = "Vortmeyer弥散";
                else if (dispModel === "edwards") dispModelName = "Edwards弥散";
                
                html += `<tr><td>${staticModelName}</td><td>${dispModelName}</td><td>${combinedValue.toExponential(3)}</td></tr>`;
            }
            html += '</table>';
        
            // 组合计算结果 - 径向
            if (Object.keys(combinedResults.radial).length > 0) {
                html += '<h5>径向有效导热系数</h5>';
                html += '<table class="results-table">';
                html += '<tr><th>静态模型</th><th>弥散模型</th><th>总有效导热系数 (W/m·K)</th></tr>';
                
                for (const [combinedName, combinedValue] of Object.entries(combinedResults.radial)) {
                    const [staticModel, dispModel] = combinedName.split('_');
                    let staticModelName = "";
                    let dispModelName = "";
                    
                    // 转换静态模型名称
                    if (staticModel === "yagiKunii") staticModelName = "Yagi-Kunii静态";
                    else if (staticModel === "zbs") staticModelName = "ZBS静态";
                    
                    // 转换弥散模型名称
                    if (dispModel === "yagiKunii") dispModelName = "Yagi-Kunii弥散";
                    else if (dispModel === "bauerSchlunder") dispModelName = "Bauer-Schlunder弥散";
                    else if (dispModel === "peclet") dispModelName = "佩克莱数弥散";
                    
                    html += `<tr><td>${staticModelName}</td><td>${dispModelName}</td><td>${combinedValue.toExponential(3)}</td></tr>`;
                }
                html += '</table>';
            }
        }

        resultsContent.innerHTML = html;
    }

    // Event Listeners
    calculateBtn.addEventListener('click', calculate);
    clearBtn.addEventListener('click', clearValues);
    resetBtn.addEventListener('click', resetValues);

    // Hide loading overlay once page is loaded
    window.addEventListener('load', function() {
        loadingOverlay.classList.remove('show');
    });

    // Show loading indicator when navigating away
    window.addEventListener('beforeunload', function() {
        loadingOverlay.classList.add('show');
    });

    // Initialize with default values
    resetValues();
});
