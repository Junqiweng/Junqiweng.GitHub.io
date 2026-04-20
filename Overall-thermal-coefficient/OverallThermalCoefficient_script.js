document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const inputElements = {
        fluidVelocity: document.getElementById('fluid_velocity'),
        particleDiameter: document.getElementById('particle_diameter'),
        voidFraction: document.getElementById('void_fraction'),
        fluidThermalConductivity: document.getElementById('fluid_thermal_conductivity'),
        solidThermalConductivity: document.getElementById('solid_thermal_conductivity'),
        fluidDensity: document.getElementById('fluid_density'),
        fluidViscosity: document.getElementById('fluid_viscosity'),
        fluidHeatCapacity: document.getElementById('fluid_heat_capacity'),
        tubeDiameter: document.getElementById('tube_diameter')
    };
    const calculateBtn = document.getElementById('calculate');
    const clearBtn = document.getElementById('clear');
    const resetBtn = document.getElementById('reset');
    const resultsOutput = document.getElementById('results-output');
    const calculationDetailsOutput = document.getElementById('calculation-details');
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const modal = document.getElementById('formulaModal');
    const modalContent = document.getElementById('formulaDetailContent');
    const closeModalBtn = modal ? modal.querySelector('.modal-close') : null;
    const form = document.getElementById('calculation-form');
    const loadingOverlay = document.getElementById('loading-overlay');

    // --- Initial Check for Modal Elements ---
    if (!modal) {
        console.error("ERROR: Modal element (#formulaModal) not found!");
    } else {
        console.log("LOG: Modal element (#formulaModal) found:", modal);
    }
    if (!modalContent) {
        console.error("ERROR: Modal content element (#formulaDetailContent) not found!");
    } else {
         console.log("LOG: Modal content element (#formulaDetailContent) found:", modalContent);
    }
     if (!closeModalBtn) {
        console.error("ERROR: Modal close button (.modal-close within #formulaModal) not found!");
    } else {
         console.log("LOG: Modal close button (.modal-close) found:", closeModalBtn);
    }
    // -----------------------------------------

    // Initial default values (example)
    const defaultValues = {
        fluidVelocity: 1,
        particleDiameter: 0.006,
        voidFraction: 0.4,
        fluidThermalConductivity: 0.0257,
        solidThermalConductivity: 20,
        fluidDensity: 1.225,
        fluidViscosity: 1.81e-5,
        fluidHeatCapacity: 1005,
        tubeDiameter: 0.05
    };

    // --- Utility Functions ---
    function formatNumber(num, precision = 3) { // Allow specifying precision
        if (num === 0) return '0';
        if (isNaN(num) || !isFinite(num)) return '无效数字'; // Handle non-numeric results
        const absNum = Math.abs(num);
        if (absNum < 0.0001 || absNum >= 100000) { // Adjust thresholds if needed
            return num.toExponential(precision > 0 ? precision -1 : 2); // Exponential notation with precision
        }
        // Adjust decimal places based on magnitude for better readability
        let fixedPrecision = precision;
        if (absNum >= 100) fixedPrecision = Math.max(0, precision - 2);
        else if (absNum >= 10) fixedPrecision = Math.max(0, precision - 1);
        else if (absNum < 1) fixedPrecision = precision + 1; // More precision for small numbers < 1

        return num.toFixed(fixedPrecision);
    }

    function showLoading() {
        if (loadingOverlay) loadingOverlay.classList.add('show');
    }

    function hideLoading() {
        if (loadingOverlay) loadingOverlay.classList.remove('show');
    }

    // --- MathJax Handling ---
    async function typesetMath(element) {
        if (!element) {
            console.error("typesetMath: No element provided");
            return;
        }

        if (typeof window.scheduleMathJaxTypeset === 'function') {
            window.scheduleMathJaxTypeset(element);
        } else if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
            MathJax.typesetPromise([element]).catch(error => {
                console.error("MathJax typesetting error:", error);
            });
        }
    }

    // --- Modal Functionality ---
    async function showModal(content) {
        if (!modal || !modalContent) {
            console.error("ERROR: Cannot show modal, modal or modalContent element is missing.");
            return;
        }

        // 设置内容
        modalContent.innerHTML = content;
        modal.removeAttribute('hidden');
        modal.style.display = 'block';

        typesetMath(modalContent);

        // 焦点管理
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) firstFocusable.focus();
    }

    function hideModal() {
        if (!modal) {
             console.error("ERROR: Cannot hide modal, modal element is missing.");
             return;
        }
        console.log("LOG: Hiding modal.");
        modal.style.display = 'none';
        modal.setAttribute('hidden', '');
        modalContent.innerHTML = ''; // Clear content
    }

    // Event listener for closing the modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideModal);
    } else {
        console.warn("LOG: Close modal button not found, click event listener not added.");
    }
    // Close modal if clicking outside the content area
    if (modal) {
        modal.addEventListener('click', (event) => {
            // Check if the click target is the modal backdrop itself
            if (event.target === modal) {
                hideModal();
            }
        });
    } else {
         console.warn("LOG: Modal element not found, backdrop click listener not added.");
    }

    // --- Formula Details ---
    const formulaDetails = {
        overall_u: {
            title: "综合传热系数 (U) - 完整模型",
            formula: `
                <div class="formula-line">$$ \\frac{1}{U} = \\frac{1}{h_w} + \\frac{D_t}{2k_{er}}\\frac{I_0(N_w)}{N_w I_1(N_w)} $$</div>
                
                <div class="formula-line">$$ N_w = \\frac{D_t}{2}\\sqrt{\\frac{4h_w}{k_{er} D_t}} $$</div>
                
                <div class="formula-line">$$ h_w = Nu_w \\cdot \\frac{k_f}{d_p} $$</div>
                
                <div class="formula-line">$$ Nu_w = (0.5 \\cdot Re_p^{0.5} + 0.2 \\cdot Re_p^{2/3}) \\cdot Pr^{1/3} $$</div>
                
                <div class="formula-line">$$ k_{er} = k_e + k_f \\frac{Re_p Pr}{8.65\\left[1+19.4\\left(d_p/D_t\\right)^2\\right]} $$</div>
                
                <div class="formula-line">$$ k_e = k_f \\cdot \\left[ \\epsilon + (1-\\epsilon) \\cdot \\frac{k_s/k_f}{1 + 0.1 \\cdot (k_s/k_f)} \\right] $$</div>
                
                <div class="formula-line">$$ Re_p = \\frac{d_p \\cdot u_0 \\cdot \\rho_f}{\\mu_f} $$</div>
                
                <div class="formula-line">$$ Pr = \\frac{C_{p,f} \\cdot \\mu_f}{k_f} $$</div>
            `,
            parameters: [
                { symbol: "U", description: "综合传热系数", unit: "W/(m²·K)" },
                { symbol: "h_w", description: "壁面传热系数", unit: "W/(m²·K)" },
                { symbol: "D_t", description: "管内径", unit: "m" },
                { symbol: "k_{er}", description: "床层径向有效导热系数", unit: "W/(m·K)" },
                { symbol: "I_0", description: "第一类零阶修正贝塞尔函数", unit: "-" },
                { symbol: "I_1", description: "第一类一阶修正贝塞尔函数", unit: "-" },
                { symbol: "N_w", description: "壁面修正因子", unit: "-" },
                { symbol: "k_e", description: "床层静态有效导热系数", unit: "W/(m·K)" },
                { symbol: "k_f", description: "流体导热系数", unit: "W/(m·K)" },
                { symbol: "k_s", description: "固体颗粒导热系数", unit: "W/(m·K)" },
                { symbol: "\\epsilon", description: "床层空隙率", unit: "-" },
                { symbol: "Nu_w", description: "壁面努谢尔数", unit: "-" },
                { symbol: "Re_p", description: "颗粒雷诺数", unit: "-" },
                { symbol: "Pr", description: "普朗特数", unit: "-" },
                { symbol: "d_p", description: "颗粒直径", unit: "m" },
                { symbol: "u_0", description: "流体表观速度", unit: "m/s" },
                { symbol: "\\rho_f", description: "流体密度", unit: "kg/m³" },
                { symbol: "\\mu_f", description: "流体动力黏度", unit: "Pa·s" },
                { symbol: "C_{p,f}", description: "流体比热容", unit: "J/(kg·K)" }
            ],
            theory: `
                <p>该模型基于能量守恒原理，结合辐射和对流传热机制，使用修正贝塞尔函数来描述固定床中热量从中心向壁面的传递过程。完整模型考虑了壁面效应和径向导热的非均匀性，特别适用于管径与颗粒直径比较小的情况。</p>
                <p>公式中的贝塞尔函数修正项 \(\\frac{I_0(N_w)}{N_w I_1(N_w)}\) 考虑了由于壁面效应导致的温度分布非线性。</p>
            `,
            applicability: `
                <p>该模型适用于以下条件：</p>
                <ul>
                    <li>固定床反应器中的稳态传热</li>
                    <li>Reynolds数范围: 10 < Re<sub>p</sub> < 2000</li>
                    <li>Prandtl数范围: 0.7 < Pr < 100</li>
                    <li>管径与颗粒直径比: 2 < D<sub>t</sub>/d<sub>p</sub> < 100</li>
                    <li>床层空隙率范围: 0.3 < ε < 0.6</li>
                </ul>
            `
        },
        overall_u_approximation: {
            title: "综合传热系数 (U) - 简化近似模型",
            formula: `
                <div class="formula-line">$$ \\frac{1}{U} = \\frac{1}{h_w} + \\frac{D_t}{4k_{er}} $$</div>
                
                <div class="formula-line">$$ h_w = Nu_w \\cdot \\frac{k_f}{d_p} $$</div>
                
                <div class="formula-line">$$ Nu_w = (0.5 \\cdot Re_p^{0.5} + 0.2 \\cdot Re_p^{2/3}) \\cdot Pr^{1/3} $$</div>
                
                <div class="formula-line">$$ k_{er} = k_e + k_f \\frac{Re_p Pr}{8.65\\left[1+19.4\\left(d_p/D_t\\right)^2\\right]} $$</div>
                
                <div class="formula-line">$$ k_e = k_f \\cdot \\left[ \\epsilon + (1-\\epsilon) \\cdot \\frac{k_s/k_f}{1 + 0.1 \\cdot (k_s/k_f)} \\right] $$</div>
                
                <div class="formula-line">$$ Re_p = \\frac{d_p \\cdot u_0 \\cdot \\rho_f}{\\mu_f} $$</div>
                
                <div class="formula-line">$$ Pr = \\frac{C_{p,f} \\cdot \\mu_f}{k_f} $$</div>
            `,
            parameters: [
                { symbol: "U", description: "综合传热系数", unit: "W/(m²·K)" },
                { symbol: "h_w", description: "壁面传热系数", unit: "W/(m²·K)" },
                { symbol: "D_t", description: "管内径", unit: "m" },
                { symbol: "k_{er}", description: "床层径向有效导热系数", unit: "W/(m·K)" },
                { symbol: "k_e", description: "床层静态有效导热系数", unit: "W/(m·K)" },
                { symbol: "k_f", description: "流体导热系数", unit: "W/(m·K)" },
                { symbol: "k_s", description: "固体颗粒导热系数", unit: "W/(m·K)" },
                { symbol: "\\epsilon", description: "床层空隙率", unit: "-" },
                { symbol: "Nu_w", description: "壁面努谢尔数", unit: "-" },
                { symbol: "Re_p", description: "颗粒雷诺数", unit: "-" },
                { symbol: "Pr", description: "普朗特数", unit: "-" },
                { symbol: "d_p", description: "颗粒直径", unit: "m" },
                { symbol: "u_0", description: "流体表观速度", unit: "m/s" },
                { symbol: "\\rho_f", description: "流体密度", unit: "kg/m³" },
                { symbol: "\\mu_f", description: "流体动力黏度", unit: "Pa·s" },
                { symbol: "C_{p,f}", description: "流体比热容", unit: "J/(kg·K)" }
            ],
            theory: `
                <p>简化近似模型是对完整模型的简化版本，将贝塞尔函数修正项简化为常数值 1/2，即 \(\\frac{I_0(N_w)}{N_w I_1(N_w)} \\approx \\frac{1}{2}\)。这种简化在管径与颗粒直径比较大时是合理的近似。</p>
                <p>这种简化使计算变得更加简单，同时在大多数工程应用中保持了足够的精度。</p>
            `,
            applicability: `
                <p>该简化模型最适用于以下条件：</p>
                <ul>
                    <li>管径与颗粒直径比较大: D<sub>t</sub>/d<sub>p</sub> > 10</li>
                    <li>Reynolds数范围: 10 < Re<sub>p</sub> < 2000</li>
                    <li>Prandtl数范围: 0.7 < Pr < 100</li>
                    <li>床层空隙率范围: 0.3 < ε < 0.6</li>
                </ul>
                <p>当管径与颗粒直径比较小时(<10)，简化模型可能导致较大误差，此时应使用完整模型。</p>
            `
        }
    };

    const formulaReferences = {
        overall_u: [
            {
                text: "Dixon, A. G.; Cresswell, D. L. (1979). Theoretical prediction of effective heat transfer parameters in packed beds. AIChE Journal.",
                url: "https://scholar.google.com/scholar?q=Dixon+Cresswell+1979+Theoretical+prediction+effective+heat+transfer+parameters+packed+beds"
            },
            {
                text: "Dixon, A. G. (1996). Improved equation for overall heat transfer coefficient in packed beds. Chemical Engineering and Processing.",
                url: "https://www.sciencedirect.com/science/article/abs/pii/0255270196800122"
            }
        ],
        overall_u_approximation: [
            {
                text: "Dixon, A. G.; Cresswell, D. L. (1979). Effective heat-transfer parameters in packed beds; approximate resistance-network forms.",
                url: "https://scholar.google.com/scholar?q=Dixon+Cresswell+1979+effective+heat+transfer+parameters+packed+beds"
            },
            {
                text: "Dixon improved overall heat-transfer coefficient comparison formula.",
                url: "https://www.sciencedirect.com/science/article/abs/pii/0255270196800122"
            }
        ]
    };

    function renderFormulaReferences(formulaId) {
        const references = formulaReferences[formulaId] || [];
        if (!references.length) return '';

        return `
            <div class="formula-section">
                <h5><span class="section-icon">📚</span> 参考文献</h5>
                <div class="theory-text">
                    <ul>
                        ${references.map(ref => `<li><a href="${ref.url}" target="_blank" rel="noopener noreferrer">${ref.text}</a></li>`).join('')}
                    </ul>
                </div>
            </div>`;
    }

    async function showFormulaDetails(formulaId) {
        // 检查公式ID是否存在
        if (!formulaDetails[formulaId]) {
            console.error(`Formula with ID ${formulaId} not found!`);
            return;
        }
        
        // 获取公式详情
        const formula = formulaDetails[formulaId];
        
        // 创建模态框内容
        let modalContentHTML = `
        <div class="formula-detail">
            <h4 class="modal-title-enhanced">${formula.title}</h4>
            
            <div class="formula-section">
                <h5><span class="section-icon">📝</span> 公式表达式</h5>
                <div class="formula-math">
                    ${formula.formula}
                </div>
            </div>
            
            <div class="formula-section">
                <h5><span class="section-icon">ℹ️</span> 参数说明</h5>
                <div class="parameter-table-container">
                    <table class="parameter-table">
                        <tr>
                            <th>符号</th>
                            <th>描述</th>
                            <th>单位</th>
                        </tr>`;
                        
        // 添加参数表格行
        if (formula.parameters) {
            formula.parameters.forEach(param => {
                modalContentHTML += `
                <tr>
                    <td><code>${param.symbol}</code></td>
                    <td>${param.description}</td>
                    <td>${param.unit || '-'}</td>
                </tr>`;
            });
        }
        
        modalContentHTML += `
                    </table>
                </div>
            </div>`;
            
        // 添加理论部分(如果存在)
        if (formula.theory) {
            modalContentHTML += `
            <div class="formula-section">
                <h5><span class="section-icon">🧠</span> 理论背景</h5>
                <div class="theory-text">
                    ${formula.theory}
                </div>
            </div>`;
        }
        
        // 添加适用性部分(如果存在)
        if (formula.applicability) {
            modalContentHTML += `
            <div class="formula-section">
                <h5><span class="section-icon">🔍</span> 适用范围</h5>
                <div class="applicability-text">
                    ${formula.applicability}
                </div>
            </div>`;
        }

        modalContentHTML += renderFormulaReferences(formulaId);
        
        modalContentHTML += `</div>`;
        
        // 显示模态框
        await showModal(modalContentHTML);
    }

    // --- Calculation Logic ---
    
    // 贝塞尔函数I0(x)的近似计算
    function besselI0(x) {
        if (x < 0) x = -x;
        
        // 小参数近似
        if (x < 3.75) {
            const y = (x / 3.75) * (x / 3.75);
            return 1.0 + y * (3.5156229 + y * (3.0899424 + y * (1.2067492 + y * (0.2659732 + y * (0.0360768 + y * 0.0045813)))));
        }
        
        // 大参数近似
        const ax = Math.abs(x);
        const y = 3.75 / ax;
        const bess = (Math.exp(ax) / Math.sqrt(ax)) * 
                   (0.39894228 + y * (0.01328592 + y * (0.00225319 + y * (-0.00157565 + y * (0.00916281 + y * (-0.02057706 + 
                   y * (0.02635537 + y * (-0.01647633 + y * 0.00392377))))))));
        return bess;
    }
    
    // 贝塞尔函数I1(x)的近似计算
    function besselI1(x) {
        const sign = x < 0 ? -1 : 1;
        const ax = Math.abs(x);
        
        // 小参数近似
        if (ax < 3.75) {
            const y = (x / 3.75) * (x / 3.75);
            return sign * ax * (0.5 + y * (0.87890594 + y * (0.51498869 + y * (0.15084934 + y * (0.02658733 + y * (0.00301532 + y * 0.00032411))))));
        }
        
        // 大参数近似
        const y = 3.75 / ax;
        const ans = (Math.exp(ax) / Math.sqrt(ax)) * 
                  (0.39894228 + y * (-0.03988024 + y * (-0.00362018 + y * (0.00163801 + y * (-0.01031555 + y * (0.02282967 + 
                  y * (-0.02895312 + y * (0.01787654 - y * 0.00420059))))))));
        return sign * ans;
    }

    /**
     * 计算U，同时考虑壁面传热阻力和径向导热阻力
     */
    function calculateU_Complete(params) {
        const { 
            fluidVelocity, 
            fluidThermalConductivity, 
            fluidDensity, 
            fluidViscosity, 
            fluidHeatCapacity, 
            particleDiameter, 
            tubeDiameter,
            solidThermalConductivity,
            voidFraction
        } = params;

        // 计算雷诺数 (Rep 基于颗粒直径)
        const Re_p = (particleDiameter * fluidVelocity * fluidDensity) / fluidViscosity;
        if (!isFinite(Re_p) || Re_p < 0) {
            console.warn("Invalid Reynolds number calculated.");
            return { overall_u: NaN, Re_p: NaN, Pr: NaN, Nu_w: NaN, k_e: NaN, k_er: NaN, N_w: NaN };
        }

        // 计算普朗特数 (Pr)
        const Pr = (fluidHeatCapacity * fluidViscosity) / fluidThermalConductivity;
        if (!isFinite(Pr) || Pr < 0) {
            console.warn("Invalid Prandtl number calculated.");
            return { overall_u: NaN, Re_p, Pr: NaN, Nu_w: NaN, k_e: NaN, k_er: NaN, N_w: NaN };
        }

        // 计算壁面努塞尔数 (Nu_w) 
        // Nu_w = (0.5 * Re^0.5 + 0.2 * Re^(2/3)) * Pr^(1/3)
        const Rep_sqrt = Math.pow(Re_p, 0.5);
        const Rep_2_3 = Math.pow(Re_p, 2/3);
        const Pr_1_3 = Math.pow(Pr, 1/3);
        const Nu_w = (0.5 * Rep_sqrt + 0.2 * Rep_2_3) * Pr_1_3;
        if (!isFinite(Nu_w) || Nu_w < 0) {
            console.warn("Invalid Nusselt number calculated.");
            return { overall_u: NaN, Re_p, Pr, Nu_w: NaN, k_e: NaN, k_er: NaN, N_w: NaN };
        }

        // Nu_w 定义为 h_w d_p/k_f，特征长度为颗粒直径
        const h_w = Nu_w * fluidThermalConductivity / particleDiameter;
        if (!isFinite(h_w) || h_w < 0) {
            console.warn("Invalid wall heat transfer coefficient (hw) calculated.");
            return { overall_u: NaN, Re_p, Pr, Nu_w, h_w: NaN, k_e: NaN, k_er: NaN, N_w: NaN };
        }

        // 计算静态有效导热系数 k_e
        const ks_kf_ratio = solidThermalConductivity / fluidThermalConductivity;
        const k_e = fluidThermalConductivity * (voidFraction + (1 - voidFraction) * ks_kf_ratio / (1 + 0.1 * ks_kf_ratio));
        if (!isFinite(k_e) || k_e < 0) {
            console.warn("Invalid static effective conductivity (k_e) calculated.");
            return { overall_u: NaN, Re_p, Pr, Nu_w, h_w, k_e: NaN, k_er: NaN, N_w: NaN };
        }

        // 计算有效径向导热系数 k_er：静态项 + Dixon-Cresswell 型径向热弥散项
        const K5 = 8.65 * (1 + 19.4 * Math.pow(particleDiameter / tubeDiameter, 2));
        const k_er = k_e + fluidThermalConductivity * Re_p * Pr / K5;
        if (!isFinite(k_er) || k_er < 0) {
            console.warn("Invalid effective radial conductivity (k_er) calculated.");
            return { overall_u: NaN, Re_p, Pr, Nu_w, h_w, k_e, k_er: NaN, N_w: NaN };
        }

        // 计算壁面导热数 Nw
        const N_w = (tubeDiameter / 2) * Math.sqrt(4 * h_w / (k_er * tubeDiameter));
        if (!isFinite(N_w) || N_w < 0) {
            console.warn("Invalid wall conduction number (Nw) calculated.");
            return { overall_u: NaN, Re_p, Pr, Nu_w, h_w, k_e, k_er, N_w: NaN };
        }

        // 计算贝塞尔函数项
        const I0_Nw = besselI0(N_w);
        const I1_Nw = besselI1(N_w);
        const bessel_term = I0_Nw / (N_w * I1_Nw);
        if (!isFinite(bessel_term)) {
            console.warn("Invalid Bessel function term calculated.");
            return { overall_u: NaN, Re_p, Pr, Nu_w, h_w, k_e, k_er, N_w, bessel_term: NaN };
        }

        // 计算总传热系数 U
        const radial_resistance = (tubeDiameter / (2 * k_er)) * bessel_term;
        const wall_resistance = 1 / h_w;
        const overall_u = 1 / (wall_resistance + radial_resistance);

        return {
            overall_u,
            Re_p,
            Pr,
            Nu_w,
            h_w,
            k_e,
            k_er,
            N_w,
            bessel_term
        };
    }

    /**
     * 原来的简化计算函数，保留作为对比
     * Calculates U based on the approximation U ≈ hw,
     * where hw is calculated from a simplified Nu_w correlation.
     */
    function calculateU_Approximation(params) {
        const { fluidVelocity, fluidThermalConductivity, fluidDensity, fluidViscosity, fluidHeatCapacity, particleDiameter, tubeDiameter, solidThermalConductivity, voidFraction } = params;

        // Calculate Reynolds number (Rep based on particle diameter)
        const Re_p = (particleDiameter * fluidVelocity * fluidDensity) / fluidViscosity;
        if (!isFinite(Re_p) || Re_p < 0) {
            console.warn("Invalid Reynolds number calculated.");
            return { overall_u: NaN, Re_p: NaN, Pr: NaN, Nu_w: NaN };
        }

        // Calculate Prandtl number (Pr)
        const Pr = (fluidHeatCapacity * fluidViscosity) / fluidThermalConductivity;
         if (!isFinite(Pr) || Pr < 0) {
            console.warn("Invalid Prandtl number calculated.");
            return { overall_u: NaN, Re_p, Pr: NaN, Nu_w: NaN };
        }

        // Calculate Nusselt number (Nu_w) using the simplified correlation
        // Nu_w = (0.5 * Re^0.5 + 0.2 * Re^(2/3)) * Pr^(1/3)
        const Rep_sqrt = Math.pow(Re_p, 0.5);
        const Rep_2_3 = Math.pow(Re_p, 2/3);
        const Pr_1_3 = Math.pow(Pr, 1/3);

        const Nu_w = (0.5 * Rep_sqrt + 0.2 * Rep_2_3) * Pr_1_3;
         if (!isFinite(Nu_w) || Nu_w < 0) {
            console.warn("Invalid Nusselt number calculated.");
            return { overall_u: NaN, Re_p, Pr, Nu_w: NaN };
        }

        // Nu_w 定义为 h_w d_p/k_f，特征长度为颗粒直径
        const h_w = Nu_w * fluidThermalConductivity / particleDiameter;
        if (!isFinite(h_w) || h_w < 0) {
            console.warn("Invalid wall heat transfer coefficient (hw) calculated.");
            return { overall_u: NaN, Re_p, Pr, Nu_w, h_w: NaN };
        }

        // 计算静态有效导热系数 k_e
        const ks_kf_ratio = solidThermalConductivity / fluidThermalConductivity;
        const k_e = fluidThermalConductivity * (voidFraction + (1 - voidFraction) * ks_kf_ratio / (1 + 0.1 * ks_kf_ratio));
        
        // 计算有效径向导热系数 k_er：静态项 + Dixon-Cresswell 型径向热弥散项
        const K5 = 8.65 * (1 + 19.4 * Math.pow(particleDiameter / tubeDiameter, 2));
        const k_er = k_e + fluidThermalConductivity * Re_p * Pr / K5;

        // 简化模型，忽略贝塞尔函数项
        const radial_resistance = tubeDiameter / (4 * k_er);
        const wall_resistance = 1 / h_w;
        const overall_u = 1 / (wall_resistance + radial_resistance);

        return {
            overall_u,
            Re_p,
            Pr,
            Nu_w,
            h_w,
            k_e,
            k_er
        };
    }

    // --- Input Validation ---
    function validateInputs(inputs) {
        let errors = [];
        let isValid = true;

        // Check required numeric inputs
        const requiredFields = [
            { input: inputElements.fluidVelocity, name: "流体表观速度", value: inputs.fluidVelocity },
            { input: inputElements.fluidThermalConductivity, name: "流体导热系数", value: inputs.fluidThermalConductivity },
            { input: inputElements.fluidDensity, name: "流体密度", value: inputs.fluidDensity },
            { input: inputElements.fluidViscosity, name: "流体粘度", value: inputs.fluidViscosity },
            { input: inputElements.fluidHeatCapacity, name: "流体比热容", value: inputs.fluidHeatCapacity },
            { input: inputElements.particleDiameter, name: "颗粒直径", value: inputs.particleDiameter },
            { input: inputElements.tubeDiameter, name: "管径", value: inputs.tubeDiameter },
            { input: inputElements.solidThermalConductivity, name: "固体导热系数", value: inputs.solidThermalConductivity },
            { input: inputElements.voidFraction, name: "床层空隙率", value: inputs.voidFraction }
        ];

        requiredFields.forEach(field => {
            field.input.classList.remove('error-input');
            if (isNaN(field.value) || (field.input.min && field.value < parseFloat(field.input.min)) || (field.input.max && field.value > parseFloat(field.input.max))) {
                isValid = false;
                errors.push(`${field.name}无效或超出范围 (${field.value})。`);
                field.input.classList.add('error-input');
            }
        });

        // Specific checks for non-negative values needed for calculations
        const nonNegativeFields = [
            { input: inputElements.fluidThermalConductivity, name: "流体导热系数", value: inputs.fluidThermalConductivity },
            { input: inputElements.solidThermalConductivity, name: "固体导热系数", value: inputs.solidThermalConductivity },
            { input: inputElements.fluidDensity, name: "流体密度", value: inputs.fluidDensity },
            { input: inputElements.fluidViscosity, name: "流体粘度", value: inputs.fluidViscosity },
            { input: inputElements.fluidHeatCapacity, name: "流体比热容", value: inputs.fluidHeatCapacity },
            { input: inputElements.particleDiameter, name: "颗粒直径", value: inputs.particleDiameter },
            { input: inputElements.tubeDiameter, name: "管径", value: inputs.tubeDiameter }
        ];
        
        nonNegativeFields.forEach(field => {
            if (field.value <= 0) {
                 isValid = false;
                 errors.push(`${field.name}必须为正数。`);
                field.input.classList.add('error-input');
            }
        });
        
        // 特殊检查：空隙率范围
        if (inputs.voidFraction <= 0 || inputs.voidFraction >= 1) {
            isValid = false;
            errors.push(`床层空隙率必须在0到1之间。`);
            inputElements.voidFraction.classList.add('error-input');
        }
        
        // 管径与颗粒直径比值检查
        const dt_dp_ratio = inputs.tubeDiameter / inputs.particleDiameter;
        if (dt_dp_ratio < 5) {
            errors.push(`警告：管径与颗粒直径比值(${formatNumber(dt_dp_ratio, 1)})较小，计算模型可能不够准确。`);
        }

        if (!isValid) {
            let errorMessage = "请检查以下输入：<ul>";
            errors.forEach(error => {
                errorMessage += `<li>${error}</li>`;
            });
            errorMessage += "</ul>";
            
            resultsOutput.innerHTML = `<p class="error-message">${errorMessage}</p>`;
            calculationDetailsOutput.innerHTML = '';
        }
        
        return isValid;
    }

    // --- Event Handlers ---
    async function handleCalculation(event) {
        if (event) event.preventDefault();
        showLoading();

        try {
            // Validate inputs before calculation
            const inputs = {
                fluidVelocity: parseFloat(inputElements.fluidVelocity.value),
                particleDiameter: parseFloat(inputElements.particleDiameter.value),
                voidFraction: parseFloat(inputElements.voidFraction.value),
                fluidThermalConductivity: parseFloat(inputElements.fluidThermalConductivity.value),
                solidThermalConductivity: parseFloat(inputElements.solidThermalConductivity.value),
                fluidDensity: parseFloat(inputElements.fluidDensity.value),
                fluidViscosity: parseFloat(inputElements.fluidViscosity.value),
                fluidHeatCapacity: parseFloat(inputElements.fluidHeatCapacity.value),
                tubeDiameter: parseFloat(inputElements.tubeDiameter.value)
            };

            // Check for validation errors
            if (!validateInputs(inputs)) {
                hideLoading();
                return;
            }

            // Define calculation methods map
            const calculationResults = {};
            const calculationDetails = {};
            
            // 获取选择的计算方法
            const completeModelChecked = document.getElementById('complete_model').checked;
            const approximationModelChecked = document.getElementById('approximation_model').checked;
            
            // 如果没有选择任何计算方法
            if (!completeModelChecked && !approximationModelChecked) {
                alert('请至少选择一种计算方法！');
                hideLoading();
                return;
            }
            
            // 执行完整模型计算
            if (completeModelChecked) {
                const completeResult = calculateU_Complete(inputs);
                calculationResults.overall_u_complete = completeResult.overall_u;
                calculationDetails.complete = completeResult;
            }
            
            // 执行近似模型计算
            if (approximationModelChecked) {
                const approximationResult = calculateU_Approximation(inputs);
                calculationResults.overall_u_approximation = approximationResult.overall_u;
                calculationDetails.approximation = approximationResult;
            }
            
            // 显示结果和计算细节
            displayResults(calculationResults);
            
            // 合并计算细节
            const mergedDetails = calculationDetails.complete || calculationDetails.approximation || {};
            
            displayCalculationDetails(inputs, mergedDetails);
        } catch (error) {
            console.error("Calculation error:", error);
            alert(`计算错误: ${error.message}`);
        } finally {
            hideLoading();
        }
    }

    function displayResults(results) {
        if (!resultsOutput) {
            console.error("Results output element not found!");
            return;
        }

        // 创建结果卡片布局
        let resultsHTML = `
            <div class="result-card">
                <h4 class="section-header"><span class="section-icon">📊</span> 综合传热系数计算结果</h4>
                <table class="results-table">
                    <tr>
                        <th>计算方法</th>
                        <th>综合传热系数 U (W/m²·K)</th>
                    </tr>`;
        
        // 添加完整模型结果
        if (results.overall_u_complete !== undefined) {
            resultsHTML += `
                <tr>
                    <td>完整模型（基于Bessel修正）</td>
                    <td class="value-column">
                        <span class="value-with-unit">
                            <span class="value-number">${formatNumber(results.overall_u_complete)}</span>
                            <span class="value-unit">W/m²·K</span>
                        </span>
                    </td>
                </tr>`;
        }
        
        // 添加近似模型结果
        if (results.overall_u_approximation !== undefined) {
            resultsHTML += `
                <tr>
                    <td>简化近似模型</td>
                    <td class="value-column">
                        <span class="value-with-unit">
                            <span class="value-number">${formatNumber(results.overall_u_approximation)}</span>
                            <span class="value-unit">W/m²·K</span>
                        </span>
                    </td>
                </tr>`;
        }
        
        // 添加误差分析（如果有两种方法）
        if (results.overall_u_complete !== undefined && results.overall_u_approximation !== undefined) {
            const errorPercentage = Math.abs((results.overall_u_approximation - results.overall_u_complete) / results.overall_u_complete * 100);
            resultsHTML += `
                <tr>
                    <td>两种方法相对误差</td>
                    <td class="value-column">
                        <span class="value-with-unit">
                            <span class="value-number">${formatNumber(errorPercentage, 2)}</span>
                            <span class="value-unit">%</span>
                        </span>
                    </td>
                </tr>`;
        }
        
        resultsHTML += `
                </table>
            </div>
            
            <div class="result-card">
                <h4 class="section-header"><span class="section-icon">💡</span> 结果说明</h4>
                <div class="explanation-content">
                    <p>综合传热系数(U)是描述固定床反应器中从流体通过床层到壁面的总传热能力的关键参数。</p>
                    <ul>
                        <li><strong>U值越大</strong>：表示传热效率越高，热量传递更快。</li>
                        <li><strong>U值越小</strong>：表示传热阻力越大，需要更大的温度差来驱动相同的热流。</li>
                    </ul>
                    <div class="note">
                        <p><strong>注意：</strong>计算结果受多种因素影响，包括管径与颗粒直径比(Dt/dp)、固体导热系数(ks)、床层空隙率(ε)及流体雷诺数(Rep)等。</p>
                    </div>
                </div>
            </div>`;
        
        resultsOutput.innerHTML = resultsHTML;
        
        // 切换到结果选项卡
        switchToTab('results');
    }

    function displayCalculationDetails(params, resultsData) {
        if (!calculationDetailsOutput) {
            console.error("Calculation details output element not found!");
            return;
        }

        // 创建中间计算参数表
        let detailsHTML = `
            <div class="result-card">
                <h4 class="section-header"><span class="section-icon">🔬</span> 中间计算参数</h4>
                <table class="results-table">
                    <tr>
                        <th>参数</th>
                        <th>符号</th>
                        <th>数值</th>
                        <th>单位</th>
                    </tr>
                    <tr>
                        <td>颗粒雷诺数</td>
                        <td>Re<sub>p</sub></td>
                        <td>${formatNumber(resultsData.Re_p)}</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>普朗特数</td>
                        <td>Pr</td>
                        <td>${formatNumber(resultsData.Pr)}</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>壁面努谢尔数</td>
                        <td>Nu<sub>w</sub></td>
                        <td>${formatNumber(resultsData.Nu_w)}</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>床层静态有效导热系数</td>
                        <td>k<sub>e</sub></td>
                        <td>${formatNumber(resultsData.k_e)}</td>
                        <td>W/m·K</td>
                    </tr>
                    <tr>
                        <td>床层径向有效导热系数</td>
                        <td>k<sub>er</sub></td>
                        <td>${formatNumber(resultsData.k_er)}</td>
                        <td>W/m·K</td>
                    </tr>
                    <tr>
                        <td>壁面传热系数</td>
                        <td>h<sub>w</sub></td>
                        <td>${formatNumber(resultsData.h_w)}</td>
                        <td>W/m²·K</td>
                    </tr>
                    <tr>
                        <td>N<sub>w</sub>参数 (修正因子)</td>
                        <td>N<sub>w</sub></td>
                        <td>${formatNumber(resultsData.N_w)}</td>
                        <td>-</td>
                    </tr>
                </table>
            </div>
            
            <div class="result-card">
                <h4 class="section-header"><span class="section-icon">📝</span> 计算方法说明</h4>
                <div class="explanation-content">
                    <p><strong>完整模型：</strong> 使用Bessel函数修正因子，考虑了壁面效应和径向导热的非均匀性，适用于各种管径与颗粒直径比。</p>
                    <p><strong>简化模型：</strong> 省略了Bessel函数修正，适用于管径与颗粒直径比较大的情况(Dt/dp > 10)，计算速度更快。</p>
                </div>
            </div>`;
        
        calculationDetailsOutput.innerHTML = detailsHTML;
    }

    function handleClear() {
        form.reset(); // Resets form fields to their default HTML values

        // Clear any previous validation styles
        Object.values(inputElements).forEach(input => {
            if(input) input.classList.remove('error-input');
        });

        resultsOutput.innerHTML = '<p>请输入参数并点击"计算总传热系数 U"按钮。</p>';
        calculationDetailsOutput.innerHTML = '<p>详细的中间计算值将显示在此处。</p>';
        switchToTab('input');
    }

    function handleReset() {
        for (const key in defaultValues) {
            if (inputElements[key]) {
                inputElements[key].value = defaultValues[key];
            }
        }
        
        // Clear any previous validation styles
        Object.values(inputElements).forEach(input => {
             if(input) input.classList.remove('error-input');
        });

        resultsOutput.innerHTML = '<p>请输入参数并点击"计算总传热系数 U"按钮。</p>';
        calculationDetailsOutput.innerHTML = '<p>详细的中间计算值将显示在此处。</p>';
        switchToTab('input');
    }

    // --- Tab Switching ---
    function switchToTab(tabId) {
        // 移除所有活动标签和内容的活动状态
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // 添加活动状态到选定的标签和内容
        const selectedTab = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(tabId);
        
        if (selectedTab) {
            selectedTab.classList.add('active');
        } else {
            console.warn(`警告: 找不到标签按钮 data-tab="${tabId}"`);
        }
        
        if (selectedContent) {
            selectedContent.classList.add('active');
        } else {
            console.warn(`警告: 找不到内容面板 id="${tabId}"`);
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchToTab(tabId);
        });
    });

    // --- Event Listeners Setup ---
    if (form) {
        form.addEventListener('submit', handleCalculation);
    }
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', handleCalculation);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', handleClear);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', handleReset);
    }
    
    // Formula info links
    document.addEventListener('click', async function(event) {
        const target = event.target;
        
        // 处理公式信息链接
        if (target.classList.contains('info-link') || target.closest('.info-link')) {
            event.preventDefault();
            const formulaLink = target.classList.contains('info-link') ? target : target.closest('.info-link');
            const formulaId = formulaLink.getAttribute('data-formula');
            
            if (formulaId) {
                try {
                    await showFormulaDetails(formulaId);
                } catch (err) {
                    console.error("Error showing formula details:", err);
                }
            }
        }
    });

    // --- Initial Setup ---
    handleReset(); // Set default values on page load
    switchToTab('input'); // Ensure input tab is active initially

    // 确保在页面加载时检查控制台错误
    console.log("脚本加载完成，DOM元素状态:");
    console.log("- 结果标签页元素:", document.getElementById('results'));
    console.log("- 输入标签页元素:", document.getElementById('input'));
    console.log("- 计算按钮元素:", calculateBtn);
    console.log("- 加载遮罩元素:", loadingOverlay);
});
