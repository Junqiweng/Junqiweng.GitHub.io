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

        displayResults(results);
        document.querySelector('[data-tab="results"]').click();
    }

    // Formula Information
    const formulaInfo = {
        ranz_marshall: {
            title: "Ranz-Marshall传质关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ Sh = 2 + 0.6Re^{0.5}Sc^{1/3} \\]
                        \\[ k = \\frac{Sh D_{AB}}{d_p} \\]
                    </div>
                    <p>适用范围：</p>
                    <ul>
                        <li>Reynolds数 (Re): 2 - 200</li>
                        <li>Schmidt数 (Sc): 0.6 - 2.7</li>
                    </ul>
                </div>`
        },
        wakao_funazkri: {
            title: "Wakao-Funazkri传质关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ Sh = 2 + 1.1Re^{0.6}Sc^{1/3} \\]
                        \\[ k = \\frac{Sh D_{AB}}{d_p} \\]
                    </div>
                    <p>适用范围：</p>
                    <ul>
                        <li>Reynolds数 (Re): 3 - 10⁴</li>
                        <li>Schmidt数 (Sc): 0.5 - 10⁴</li>
                    </ul>
                </div>`
        },
        ranz_marshall_heat: {
            title: "Ranz-Marshall传热关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ Nu = 2 + 0.6Re^{0.5}Pr^{1/3} \\]
                        \\[ h = \\frac{Nu k_f}{d_p} \\]
                    </div>
                    <p>适用范围：</p>
                    <ul>
                        <li>Reynolds数 (Re): 2 - 200</li>
                        <li>Prandtl数 (Pr): 0.6 - 380</li>
                    </ul>
                </div>`
        },
        gnielinski: {
            title: "Gnielinski传热关联式",
            content: `
                <div class="formula-section">
                    <div class="formula-math">
                        \\[ Nu = 2 + \\sqrt{Nu_{lam}^2 + Nu_{turb}^2} \\]
                        \\[ Nu_{lam} = 0.664Re^{0.5}Pr^{1/3} \\]
                        \\[ Nu_{turb} = \\frac{0.037Re^{0.8}Pr}{1 + 2.443Re^{-0.1}(Pr^{2/3}-1)} \\]
                        \\[ h = \\frac{Nu k_f}{d_p} \\]
                    </div>
                    <p>适用范围：</p>
                    <ul>
                        <li>Reynolds数 (Re): 10 - 10⁷</li>
                        <li>Prandtl数 (Pr): 0.6 - 10⁵</li>
                    </ul>
                </div>`
        }
    };

    // Display Results Function
    function displayResults(results) {
        const resultsContent = document.querySelector('.results-content');
        let html = '<h4>无量纲参数</h4>';
        html += '<table class="results-table">';
        html += '<tr><th>参数</th><th>值</th></tr>';
        html += `<tr><td>Reynolds数 (Re)</td><td>${results.dimensionless.Re.toExponential(3)}</td></tr>`;
        html += `<tr><td>Schmidt数 (Sc)</td><td>${results.dimensionless.Sc.toExponential(3)}</td></tr>`;
        html += `<tr><td>Prandtl数 (Pr)</td><td>${results.dimensionless.Pr.toExponential(3)}</td></tr>`;
        html += '</table>';

        if (Object.keys(results.massTransfer).length > 0) {
            html += '<h4>传质系数计算结果</h4>';
            html += '<table class="results-table">';
            html += '<tr><th>关联式</th><th>Sherwood数 (Sh)</th><th>传质系数 k (m/s)</th></tr>';
            
            if (results.massTransfer.ranzMarshall) {
                html += `<tr>
                    <td>Ranz-Marshall</td>
                    <td>${results.massTransfer.ranzMarshall.Sh.toExponential(3)}</td>
                    <td>${results.massTransfer.ranzMarshall.k.toExponential(3)}</td>
                </tr>`;
            }
            
            if (results.massTransfer.wakaoFunazkri) {
                html += `<tr>
                    <td>Wakao-Funazkri</td>
                    <td>${results.massTransfer.wakaoFunazkri.Sh.toExponential(3)}</td>
                    <td>${results.massTransfer.wakaoFunazkri.k.toExponential(3)}</td>
                </tr>`;
            }
            
            html += '</table>';
        }

        if (Object.keys(results.heatTransfer).length > 0) {
            html += '<h4>传热系数计算结果</h4>';
            html += '<table class="results-table">';
            html += '<tr><th>关联式</th><th>Nusselt数 (Nu)</th><th>传热系数 h (W/m²·K)</th></tr>';
            
            if (results.heatTransfer.ranzMarshall) {
                html += `<tr>
                    <td>Ranz-Marshall</td>
                    <td>${results.heatTransfer.ranzMarshall.Nu.toExponential(3)}</td>
                    <td>${results.heatTransfer.ranzMarshall.h.toExponential(3)}</td>
                </tr>`;
            }
            
            if (results.heatTransfer.gnielinski) {
                html += `<tr>
                    <td>Gnielinski</td>
                    <td>${results.heatTransfer.gnielinski.Nu.toExponential(3)}</td>
                    <td>${results.heatTransfer.gnielinski.h.toExponential(3)}</td>
                </tr>`;
            }
            
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
});
