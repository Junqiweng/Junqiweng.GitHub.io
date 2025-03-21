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

    // Default values
    const defaultValues = {
        fluid_velocity: 0.1,      // m/s
        particle_diameter: 0.003, // m
        bed_height: 0.5,          // m
        tube_ratio: 10,           // D/dp
        fluid_density: 1000,      // kg/m³
        fluid_viscosity: 0.001,   // Pa·s
        molecular_diffusivity: 1e-9, // m²/s
        bed_porosity: 0.4,        // dimensionless
        fluid_conductivity: 0.6,   // W/m·K
        solid_conductivity: 15,    // W/m·K
        fluid_heat_capacity: 4200, // J/kg·K
        use_thermal_params: false  // boolean
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
        const fluidVelocity = parseFloat(document.getElementById('fluid_velocity').value) || defaultValues.fluid_velocity;
        const particleDiameter = parseFloat(document.getElementById('particle_diameter').value) || defaultValues.particle_diameter;
        const bedHeight = parseFloat(document.getElementById('bed_height').value) || defaultValues.bed_height;
        const tubeRatio = parseFloat(document.getElementById('tube_ratio').value) || defaultValues.tube_ratio;
        const fluidDensity = parseFloat(document.getElementById('fluid_density').value) || defaultValues.fluid_density;
        const fluidViscosity = parseFloat(document.getElementById('fluid_viscosity').value) || defaultValues.fluid_viscosity;
        const molecularDiffusivity = parseFloat(document.getElementById('molecular_diffusivity').value) || defaultValues.molecular_diffusivity;
        const bedPorosity = parseFloat(document.getElementById('bed_porosity').value) || defaultValues.bed_porosity;
        
        // Get thermal parameters
        const fluidConductivity = parseFloat(document.getElementById('fluid-conductivity').value) || defaultValues.fluid_conductivity;
        const solidConductivity = parseFloat(document.getElementById('solid-conductivity').value) || defaultValues.solid_conductivity;
        const fluidHeatCapacity = parseFloat(document.getElementById('fluid-heat-capacity').value) || defaultValues.fluid_heat_capacity;
        const useThermalParams = document.getElementById('use-thermal-params').checked || defaultValues.use_thermal_params;
        
        // Calculate dimensionless numbers
        const Re = (fluidVelocity * particleDiameter * fluidDensity) / fluidViscosity;
        const Sc = fluidViscosity / (fluidDensity * molecularDiffusivity);
        const Pe_m = Re * Sc;
        
        // Prepare inputs object for results display
        const inputs = {
            fluidVelocity,
            particleDiameter,
            bedHeight,
            tubeRatio,
            fluidDensity,
            fluidViscosity,
            molecularDiffusivity,
            bedPorosity,
            fluidConductivity,
            solidConductivity,
            fluidHeatCapacity,
            useThermalParams
        };

        // Calculate dispersion coefficients
        const tubeDiameter = tubeRatio * particleDiameter;
        const epsilon = bedPorosity;  // Using input bed porosity instead of hardcoded value
        
        // Calculate axial dispersion coefficients
        const D_ax_ER = 0.73 * molecularDiffusivity + 0.5 * fluidVelocity * particleDiameter / (1 + 9.7 * molecularDiffusivity / (fluidVelocity * particleDiameter));
        const D_ax_ZS = 2 * molecularDiffusivity / epsilon + 0.5 * fluidVelocity * particleDiameter;
        const D_ax_Gunn = 0.7 * molecularDiffusivity + 0.5 * fluidVelocity * particleDiameter;
        const D_ax_WK = epsilon * molecularDiffusivity + 0.5 * fluidVelocity * particleDiameter;

        // Calculate radial dispersion coefficients
        const D_rad_ER = molecularDiffusivity * epsilon + 0.08 * fluidVelocity * particleDiameter / (1 + 9.7 * molecularDiffusivity / (fluidVelocity * particleDiameter));
        const D_rad_ZS = molecularDiffusivity * epsilon + 0.1 * fluidVelocity * particleDiameter;
        const D_rad_Gunn = molecularDiffusivity * epsilon + epsilon * 0.1 * fluidVelocity * particleDiameter;
        const D_rad_WK = molecularDiffusivity * epsilon + 0.1 * fluidVelocity * particleDiameter;

        // Calculate Peclet numbers
        const Pe_ax_ER = fluidVelocity * particleDiameter / D_ax_ER;
        const Pe_ax_ZS = fluidVelocity * particleDiameter / D_ax_ZS;
        const Pe_ax_Gunn = fluidVelocity * particleDiameter / D_ax_Gunn;
        const Pe_ax_WK = fluidVelocity * particleDiameter / D_ax_WK;

        const Pe_rad_ER = fluidVelocity * particleDiameter / D_rad_ER;
        const Pe_rad_ZS = fluidVelocity * particleDiameter / D_rad_ZS;
        const Pe_rad_Gunn = fluidVelocity * particleDiameter / D_rad_Gunn;
        const Pe_rad_WK = fluidVelocity * particleDiameter / D_rad_WK;

        // Calculate effective thermal conductivity if thermal parameters are used
        let thermalResults = {};
        if (useThermalParams) {
            thermalResults = calculateEffectiveThermalConductivity(inputs, Re);
        }

        // Prepare results object
        const results = {
            // Axial dispersion coefficients
            D_ax_ER,
            D_ax_ZS,
            D_ax_Gunn,
            D_ax_WK,
            
            // Radial dispersion coefficients
            D_rad_ER,
            D_rad_ZS,
            D_rad_Gunn,
            D_rad_WK,
            
            // Peclet numbers - axial
            Pe_ax_ER,
            Pe_ax_ZS,
            Pe_ax_Gunn,
            Pe_ax_WK,
            
            // Peclet numbers - radial
            Pe_rad_ER,
            Pe_rad_ZS,
            Pe_rad_Gunn,
            Pe_rad_WK,
            
            // Effective thermal conductivity results
            ...thermalResults
        };

        // Display results in the UI
        displayResults(inputs, results);
        
        // Switch to results tab
        document.querySelector('[data-tab="results"]').click();
    }
    
    function calculateEffectiveThermalConductivity(inputs, Re) {
        const { 
            fluidVelocity, 
            particleDiameter, 
            bedPorosity, 
            fluidDensity, 
            fluidViscosity, 
            fluidConductivity, 
            solidConductivity, 
            fluidHeatCapacity 
        } = inputs;
        
        const epsilon = bedPorosity;
        const Pr = (fluidViscosity * fluidHeatCapacity) / fluidConductivity;
        
        // Calculate effective thermal conductivity using different models
        
        // 1. Krupiczka model (static contribution)
        const lambda_ratio = solidConductivity / fluidConductivity;
        const k_Krupiczka = fluidConductivity * Math.pow(lambda_ratio, 0.280 - 0.757 * Math.log10(epsilon) - 0.057 * Math.log10(lambda_ratio));
        
        // 2. Zehner-Schlünder model (static contribution)
        const B = 1.25 * Math.pow((1 - epsilon) / epsilon, 10/9);
        const k_ZS = fluidConductivity * (1 - Math.sqrt(1 - epsilon) + 2 * Math.sqrt(1 - epsilon) / 
                    (1 - B * lambda_ratio) * 
                    ((1 - 1/lambda_ratio) * B * 
                    Math.log(lambda_ratio / B) - (B - 1) * (1 - 1/lambda_ratio)));
        
        // 3. Wakao-Kaguei model (includes dynamic contribution)
        const Nu = 2.0 + 1.1 * Math.pow(Re, 0.6) * Math.pow(Pr, 1/3);
        const k_WK_static = fluidConductivity * (epsilon + 0.5 * (1 - epsilon) * 
                          (solidConductivity / fluidConductivity));
        const k_WK_dynamic = 0.5 * fluidConductivity * Re * Pr;
        const k_WK = k_WK_static + k_WK_dynamic;
        
        // 4. Kunii-Smith model
        const k_KS = fluidConductivity * (epsilon + (1 - epsilon) / 
                   ((2/3) * (fluidConductivity/solidConductivity) + 1/3));
                   
        // 5. Effective thermal conductivity with dispersion
        // Calculate axial thermal dispersion coefficient (similar to D_ax but for heat)
        const D_heat_ax = 0.73 * (fluidConductivity / (fluidDensity * fluidHeatCapacity)) + 
                          0.5 * fluidVelocity * particleDiameter;
        
        // Calculate radial thermal dispersion coefficient (similar to D_rad but for heat)
        const D_heat_rad = epsilon * (fluidConductivity / (fluidDensity * fluidHeatCapacity)) + 
                           0.1 * fluidVelocity * particleDiameter;
        
        // Convert thermal diffusivity to thermal conductivity
        const k_eff_ax = D_heat_ax * fluidDensity * fluidHeatCapacity;
        const k_eff_rad = D_heat_rad * fluidDensity * fluidHeatCapacity;
        
        return {
            k_Krupiczka,
            k_ZS,
            k_WK,
            k_WK_static,
            k_WK_dynamic,
            k_KS,
            k_eff_ax,
            k_eff_rad
        };
    }

    // Formula Information
    const formulaInfo = {
        axial_standard: {
            title: "轴向反混系数 - 标准模型",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ D_{ax} = \\frac{u_0 d_p}{Pe_{ax}}, \\quad Pe_{ax} = 2.0 \\]
                    </div>
                    <p>适用范围：</p>
                    <ul>
                        <li>Reynolds数 (Re): 0 - 50</li>
                        <li>床层高度与颗粒直径比 > 50</li>
                        <li>颗粒直径：0.5-6 mm</li>
                    </ul>
                    <p>参数说明：</p>
                    <ul>
                        <li>D_ax: 轴向反混系数</li>
                        <li>u₀: 流体表观速度</li>
                        <li>dp: 颗粒直径</li>
                        <li>Pe_ax: 轴向佩克列数</li>
                    </ul>
                </div>`
        },
        axial_edwards: {
            title: "轴向反混系数 - Edwards-Richardson模型",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ \\frac{1}{Pe_{ax}} = \\frac{0.73\\varepsilon}{Re\\cdot Sc} + \\frac{0.5}{1 + \\frac{9.7\\varepsilon}{Re\\cdot Sc}} \\]
                        \\[ D_{ax} = \\frac{u_0 d_p}{Pe_{ax}} \\]
                    </div>
                    <p>适用范围：</p>
                    <ul>
                        <li>Reynolds数 (Re): 0.008 - 50</li>
                        <li>管径与颗粒直径比 (D/dp): 14 - 220</li>
                    </ul>
                    <p>特点：</p>
                    <ul>
                        <li>Edwards和Richardson在1968年提出</li>
                        <li>考虑了床层空隙率的影响</li>
                        <li>适用于低雷诺数条件</li>
                    </ul>
                    <p>参考文献：Edwards, M. F., & Richardson, J. F. (1968)</p>
                </div>`
        },
        axial_zehner: {
            title: "轴向反混系数 - Zehner-Schlünder模型",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ \\frac{1}{Pe_{ax}} = \\frac{1-\\sqrt{1-\\varepsilon_b}}{Re\\cdot Sc} + \\frac{1}{2} \\]
                        \\[ D_{ax} = \\frac{u_0 d_p}{Pe_{ax}} \\]
                    </div>
                    <p>适用范围：</p>
                    <ul>
                        <li>适用于多孔介质中流体的轴向混合</li>
                        <li>考虑了床层空隙率的影响</li>
                    </ul>
                    <p>特点：</p>
                    <ul>
                        <li>Zehner和Schlünder在1970年提出</li>
                        <li>结合了分子扩散和对流混合机制</li>
                        <li>依赖于床层结构参数</li>
                    </ul>
                    <p>参考文献：Zehner, P., & Schlünder, E. U. (1970)</p>
                </div>`
        },
        axial_gunn: {
            title: "轴向反混系数 - Gunn模型",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ Pe_{ax} = \\frac{\\tau \\cdot Re \\cdot Sc}{\\varepsilon_b} \\cdot \\frac{1}{\\frac{\\varepsilon_b}{\\tau \\cdot Re \\cdot Sc} + \\frac{1}{2}} \\]
                        \\[ \\tau = \\frac{\\varepsilon_b}{(1-\\varepsilon_b)^{1/3}} \\]
                        \\[ D_{ax} = \\frac{u_0 d_p}{Pe_{ax}} \\]
                    </div>
                    <p>适用范围：</p>
                    <ul>
                        <li>Reynolds数 (Re): 1 - 1000</li>
                        <li>床层空隙率 (ε): 0.3 - 0.6</li>
                        <li>适用于多孔介质中的流动</li>
                    </ul>
                    <p>特点：</p>
                    <ul>
                        <li>Gunn在1987年提出</li>
                        <li>考虑了分子扩散和对流扩散的共同作用</li>
                        <li>包含床层结构参数(τ)的影响</li>
                    </ul>
                    <p>参考文献：Gunn, D. J. (1987)</p>
                </div>`
        },
        radial_lerou: {
            title: "径向反混系数 - Lerou-Wammes模型",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ Pe_{rad} = \\frac{8}{1 + \\frac{20}{N^2}} \\]
                        \\[ D_{rad} = \\frac{u_0 d_p}{Pe_{rad}} \\]
                    </div>
                    <p>适用范围：</p>
                    <ul>
                        <li>管径比 (N = D/dp) > 5</li>
                        <li>Reynolds数 (Re): 1 - 1000</li>
                        <li>颗粒球形度 > 0.8</li>
                    </ul>
                    <p>特点：</p>
                    <ul>
                        <li>考虑了壁面效应的影响</li>
                        <li>适用于均匀粒径分布</li>
                    </ul>
                </div>`
        },
        radial_bauer: {
            title: "径向反混系数 - Bauer模型",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ \\frac{1}{Pe_{rm}} = \\frac{0.73\\varepsilon_b}{Re\\cdot Pr} + \\frac{1}{7\\left[2-\\left(1-\\frac{2}{N}\\right)\\right]^2} \\]
                        \\[ D_{rad} = \\frac{u_0 d_p}{Pe_{rm}} \\]
                        \\[ N = \\frac{D}{d_p} \\]
                    </div>
                    <p>适用范围：</p>
                    <ul>
                        <li>Reynolds数 (Re): 10 - 2000</li>
                        <li>管径比 (N = D/dp) > 5</li>
                    </ul>
                    <p>特点：</p>
                    <ul>
                        <li>Bauer在1978年提出</li>
                        <li>考虑了管径比对径向混合的影响</li>
                        <li>适用于较宽的流动条件</li>
                    </ul>
                    <p>参考文献：Bauer, R. (1978)</p>
                </div>`
        },
        radial_wakao_kaguei: {
            title: "径向反混系数 - Wakao-Kaguei模型",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ \\frac{1}{Pe_{rm}} = \\frac{(0.6-0.8)\\varepsilon_b}{Re\\cdot Pr} + \\frac{1}{10} \\]
                        \\[ D_{rad} = \\frac{u_0 d_p}{Pe_{rm}} \\]
                    </div>
                    <p>适用范围：</p>
                    <ul>
                        <li>Reynolds数 (Re): 5 - 1000</li>
                        <li>主要适用于气固和液固系统</li>
                    </ul>
                    <p>特点：</p>
                    <ul>
                        <li>Wakao和Kaguei在1982年提出</li>
                        <li>考虑了床层空隙率的影响</li>
                        <li>在传热和传质分析中经常使用</li>
                    </ul>
                    <p>参考文献：Wakao, N., & Kaguei, S. (1982)</p>
                </div>`
        },
        radial_specchia: {
            title: "径向反混系数 - Specchia模型",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ \\frac{1}{Pe_{rm}} = \\frac{1}{8.65\\left(1+\\frac{19.4}{N^2}\\right)} \\]
                        \\[ D_{rad} = \\frac{u_0 d_p}{Pe_{rm}} \\]
                        \\[ N = \\frac{D}{d_p} \\]
                    </div>
                    <p>适用范围：</p>
                    <ul>
                        <li>管径比 (N = D/dp) > 10</li>
                        <li>Specchia等人在1980年提出</li>
                    </ul>
                    <p>特点：</p>
                    <ul>
                        <li>不考虑驻点扩散的影响</li>
                        <li>主要考虑管径比对径向混合的影响</li>
                        <li>形式简单，易于应用</li>
                    </ul>
                    <p>参考文献：Specchia, V., et al. (1980)</p>
                </div>`
        }
    };

    // Display Results Function
    function displayResults(inputs, results) {
        const resultsContent = document.querySelector('.results-content');
        let html = '<h4>操作条件</h4>';
        html += '<table class="results-table">';
        html += '<tr><th>参数</th><th>数值</th></tr>';
        html += `<tr><td>流体表观速度 (<i>u</i><sub>0</sub>)</td><td>${inputs.fluidVelocity.toExponential(3)} m/s</td></tr>`;
        html += `<tr><td>颗粒直径 (<i>d</i><sub>p</sub>)</td><td>${inputs.particleDiameter.toExponential(3)} m</td></tr>`;
        html += `<tr><td>床层高度 (<i>H</i>)</td><td>${inputs.bedHeight.toExponential(3)} m</td></tr>`;
        html += `<tr><td>管径/颗粒直径比 (<i>N</i> = <i>D</i>/<i>d</i><sub>p</sub>)</td><td>${inputs.tubeRatio.toExponential(3)}</td></tr>`;
        html += `<tr><td>床层空隙率 (<i>ε</i>)</td><td>${inputs.bedPorosity.toFixed(3)}</td></tr>`;
        html += `<tr><td>流体密度 (<i>ρ</i>)</td><td>${inputs.fluidDensity.toExponential(3)} kg/m³</td></tr>`;
        html += `<tr><td>流体黏度 (<i>μ</i>)</td><td>${inputs.fluidViscosity.toExponential(3)} Pa·s</td></tr>`;
        html += `<tr><td>分子扩散系数 (<i>D</i><sub>m</sub>)</td><td>${inputs.molecularDiffusivity.toExponential(3)} m²/s</td></tr>`;
        html += '</table>';

        // Display thermal properties if enabled
        if (inputs.useThermalParams) {
            html += '<h4>导热参数</h4>';
            html += '<table class="results-table">';
            html += '<tr><th>参数</th><th>数值</th></tr>';
            html += `<tr><td>流体导热系数 (<i>λ</i><sub>f</sub>)</td><td>${inputs.fluidConductivity.toExponential(3)} W/m·K</td></tr>`;
            html += `<tr><td>颗粒导热系数 (<i>λ</i><sub>s</sub>)</td><td>${inputs.solidConductivity.toExponential(3)} W/m·K</td></tr>`;
            html += `<tr><td>流体比热容 (<i>c</i><sub>p</sub>)</td><td>${inputs.fluidHeatCapacity.toExponential(3)} J/kg·K</td></tr>`;
            html += '</table>';
        }

        // Display dimensionless numbers
        html += '<h4>无量纲参数</h4>';
        html += '<table class="results-table">';
        html += '<tr><th>参数</th><th>数值</th><th>说明</th></tr>';
        
        const Re = (inputs.fluidVelocity * inputs.particleDiameter * inputs.fluidDensity) / inputs.fluidViscosity;
        const Sc = inputs.fluidViscosity / (inputs.fluidDensity * inputs.molecularDiffusivity);
        const Pe_m = Re * Sc;
        
        // Calculate Prandtl, Nusselt, and Peclet numbers for thermal calculations
        let Pr, Nu, Pe;
        if (inputs.useThermalParams) {
            Pr = (inputs.fluidViscosity * inputs.fluidHeatCapacity) / inputs.fluidConductivity;
        } else {
            Pr = Sc; // Use Schmidt number as approximation
        }
        Nu = 2.0 + 1.1 * Math.pow(Re, 0.6) * Math.pow(Pr, 1/3);
        Pe = Re * Pr;
        
        html += `<tr><td>雷诺数 (<i>Re</i>)</td><td>${Re.toExponential(3)}</td><td>表征惯性力与黏性力的比值</td></tr>`;
        html += `<tr><td>施密特数 (<i>Sc</i>)</td><td>${Sc.toExponential(3)}</td><td>表征动量扩散与物质扩散的比值</td></tr>`;
        html += `<tr><td>分子佩克列数 (<i>Pe</i><sub>m</sub>)</td><td>${Pe_m.toExponential(3)}</td><td>表征对流传质与分子扩散的比值</td></tr>`;
        
        // Add thermal dimensionless numbers if thermal parameters are used
        if (inputs.useThermalParams) {
            html += `<tr><td>普朗特数 (<i>Pr</i>)</td><td>${Pr.toExponential(3)}</td><td>表征动量扩散与热扩散的比值</td></tr>`;
            html += `<tr><td>努塞尔数 (<i>Nu</i>)</td><td>${Nu.toExponential(3)}</td><td>表征对流换热与导热的比值</td></tr>`;
            html += `<tr><td>热佩克列数 (<i>Pe</i>)</td><td>${Pe.toExponential(3)}</td><td>表征对流换热与热扩散的比值</td></tr>`;
        }
        
        html += '</table>';

        // Display axial dispersion coefficients
        html += '<h4>轴向弥散系数 (<i>D</i><sub>ax</sub>)</h4>';
        html += '<table class="results-table">';
        html += '<tr><th>模型</th><th>弥散系数 (m²/s)</th><th>佩克列数 (<i>Pe</i><sub>ax</sub>)</th></tr>';
        html += `<tr><td>Edwards-Richardson</td><td>${results.D_ax_ER.toExponential(3)}</td><td>${results.Pe_ax_ER.toExponential(3)}</td></tr>`;
        html += `<tr><td>Zehner-Schlünder</td><td>${results.D_ax_ZS.toExponential(3)}</td><td>${results.Pe_ax_ZS.toExponential(3)}</td></tr>`;
        html += `<tr><td>Gunn</td><td>${results.D_ax_Gunn.toExponential(3)}</td><td>${results.Pe_ax_Gunn.toExponential(3)}</td></tr>`;
        html += `<tr><td>Wakao-Kaguei</td><td>${results.D_ax_WK.toExponential(3)}</td><td>${results.Pe_ax_WK.toExponential(3)}</td></tr>`;
        html += '</table>';

        // Display radial dispersion coefficients
        html += '<h4>径向弥散系数 (<i>D</i><sub>rad</sub>)</h4>';
        html += '<table class="results-table">';
        html += '<tr><th>模型</th><th>弥散系数 (m²/s)</th><th>佩克列数 (<i>Pe</i><sub>rad</sub>)</th></tr>';
        html += `<tr><td>Edwards-Richardson</td><td>${results.D_rad_ER.toExponential(3)}</td><td>${results.Pe_rad_ER.toExponential(3)}</td></tr>`;
        html += `<tr><td>Zehner-Schlünder</td><td>${results.D_rad_ZS.toExponential(3)}</td><td>${results.Pe_rad_ZS.toExponential(3)}</td></tr>`;
        html += `<tr><td>Gunn</td><td>${results.D_rad_Gunn.toExponential(3)}</td><td>${results.Pe_rad_Gunn.toExponential(3)}</td></tr>`;
        html += `<tr><td>Wakao-Kaguei</td><td>${results.D_rad_WK.toExponential(3)}</td><td>${results.Pe_rad_WK.toExponential(3)}</td></tr>`;
        html += '</table>';
        
        // Display effective thermal conductivity if thermal parameters are used
        if (inputs.useThermalParams) {
            html += '<h4>有效导热系数</h4>';
            html += '<table class="results-table">';
            html += '<tr><th>模型</th><th>有效导热系数 (W/m·K)</th><th>说明</th></tr>';
            html += `<tr><td>Krupiczka</td><td>${results.k_Krupiczka.toExponential(3)}</td><td>静态导热贡献</td></tr>`;
            html += `<tr><td>Zehner-Schlünder</td><td>${results.k_ZS.toExponential(3)}</td><td>静态导热贡献</td></tr>`;
            html += `<tr><td>Kunii-Smith</td><td>${results.k_KS.toExponential(3)}</td><td>静态导热贡献</td></tr>`;
            html += `<tr><td>Wakao-Kaguei (静态)</td><td>${results.k_WK_static.toExponential(3)}</td><td>静态导热贡献</td></tr>`;
            html += `<tr><td>Wakao-Kaguei (动态)</td><td>${results.k_WK_dynamic.toExponential(3)}</td><td>动态导热贡献</td></tr>`;
            html += `<tr><td>Wakao-Kaguei (总)</td><td>${results.k_WK.toExponential(3)}</td><td>静态+动态导热贡献</td></tr>`;
            html += `<tr><td>轴向有效导热系数</td><td>${results.k_eff_ax.toExponential(3)}</td><td>包含轴向热弥散</td></tr>`;
            html += `<tr><td>径向有效导热系数</td><td>${results.k_eff_rad.toExponential(3)}</td><td>包含径向热弥散</td></tr>`;
            html += '</table>';
        }

        resultsContent.innerHTML = html;
    }

    // Modal Functionality
    function showModal() {
        modal.style.display = "block";
        setTimeout(() => {
            // Re-render math formulas
            if (window.MathJax && window.MathJax.typeset) {
                window.MathJax.typeset();
            }
            // Focus first interactive element
            const firstFocusable = modal.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (firstFocusable) firstFocusable.focus();
        }, 100);
    }

    // Event Listeners
    calculateBtn.addEventListener('click', calculate);
    clearBtn.addEventListener('click', clearValues);
    resetBtn.addEventListener('click', resetValues);
    
    // Also add event listener to the new button
    document.getElementById('calculate-button').addEventListener('click', calculate);

    modalClose.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    infoLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const correlation = link.dataset.correlation;
            const info = formulaInfo[correlation];
            if (info) {
                loadingOverlay.classList.add('show');
                formulaDetail.innerHTML = `<h4>${info.title}</h4>${info.content}`;
                // Load MathJax if not already loaded
                loadMathJax();
                showModal();
                // Hide loading overlay after a short delay
                setTimeout(() => {
                    loadingOverlay.classList.remove('show');
                }, 300);
            }
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

    // Initialize with default values
    resetValues();

    // Remove loading overlay after initialization
    loadingOverlay.classList.remove('show');

    // Set default values on page load
    window.onload = function() {
        // Set default values for input fields
        document.getElementById('fluid_velocity').value = defaultValues.fluid_velocity;
        document.getElementById('particle_diameter').value = defaultValues.particle_diameter;
        document.getElementById('bed_height').value = defaultValues.bed_height;
        document.getElementById('tube_ratio').value = defaultValues.tube_ratio;
        document.getElementById('fluid_density').value = defaultValues.fluid_density;
        document.getElementById('fluid_viscosity').value = defaultValues.fluid_viscosity;
        document.getElementById('molecular_diffusivity').value = defaultValues.molecular_diffusivity;
        document.getElementById('bed_porosity').value = defaultValues.bed_porosity;
        
        // Set default values for thermal parameters
        document.getElementById('fluid-conductivity').value = defaultValues.fluid_conductivity;
        document.getElementById('solid-conductivity').value = defaultValues.solid_conductivity;
        document.getElementById('fluid-heat-capacity').value = defaultValues.fluid_heat_capacity;
        document.getElementById('use-thermal-params').checked = defaultValues.use_thermal_params;
        
        // Set up event listeners
        document.getElementById('calculate-button').addEventListener('click', calculate);
        
        // Set up correlation info popovers
        infoLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const info = this.nextElementSibling;
                if (info.style.display === 'none' || info.style.display === '') {
                    info.style.display = 'block';
                } else {
                    info.style.display = 'none';
                }
            });
        });
    };
});
