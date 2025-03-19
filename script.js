document.addEventListener('DOMContentLoaded', () => {
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

    // Default values for reset
    const defaultValues = {
        bed_length: 0.5,
        void_fraction: 0.4,
        particle_diameter: 0.003,
        fluid_velocity: 0.5,
        fluid_density: 1.225,
        fluid_viscosity: 1.81e-5,
        column_diameter: 0.1,
        particle_shape: "球形"
    };

    // Clear all inputs
    clearBtn.addEventListener('click', () => {
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.value = '';
        });
        document.getElementById('particle_shape').value = '球形';
    });

    // Reset to default values
    resetBtn.addEventListener('click', () => {
        Object.entries(defaultValues).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.value = value;
        });
    });

    // Calculation functions
    function calculateErgun(L, ε, dp, u0, ρ, μ) {
        return (L / dp) * (
            (150 * (1 - ε) ** 2 * μ * u0) / (ε ** 3 * dp) +
            (1.75 * (1 - ε) * ρ * u0 ** 2) / (ε ** 3)
        );
    }

    function calculateCarmanKozeny(L, ε, dp, u0, μ) {
        return (L * 180 * (1 - ε) ** 2 * μ * u0) / (dp ** 2 * ε ** 3);
    }

    function calculateBurkePlummer(L, ε, dp, u0, ρ) {
        return (L * 1.75 * (1 - ε) * ρ * u0 ** 2) / (dp * ε ** 3);
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
        const term2 = 0.922 + 16 / (Re_m + 52) ** 0.46;
        return (L * ρ * u0 ** 2 / dp * (1 - ε) / ε ** 3) * (term1 + term2);
    }

    function calculateDixonWithWall(L, ε, dp, u0, ρ, μ, N, alpha = 0.564) {
        const Re = (ρ * u0 * dp) / μ;
        const Re_m = Re / (1 - ε);
        const term1 = (160 / Re_m) * (1 + (2 * alpha) / (3 * (1 - ε) * N));
        const term2 = 0.922 + (16 / Re_m ** 0.46) * Re_m / (Re_m + 52);
        return (L * ρ * u0 ** 2 / dp * (1 - ε) / ε ** 3) * (term1 + term2);
    }

    // Input validation
    function validateInputs() {
        const inputs = document.querySelectorAll('input[type="number"]');
        let isValid = true;
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity();
                isValid = false;
            }
        });
        return isValid;
    }

    // Format number to scientific notation if needed
    function formatNumber(num) {
        if (num === 0) return '0';
        const absNum = Math.abs(num);
        if (absNum < 0.01 || absNum >= 10000) {
            return num.toExponential(4);
        }
        return num.toFixed(4);
    }

    // Main calculation
    calculateBtn.addEventListener('click', () => {
        if (!validateInputs()) {
            return;
        }

        calculateBtn.classList.add('loading');
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
            if ([L, ε, dp, u0, ρ, μ, D].some(isNaN) || ε >= 1 || ε <= 0) {
                throw new Error('请确保所有输入都是有效的数值，且空隙率必须在0到1之间！');
            }

            // Calculate Re and N
            const Re = (ρ * u0 * dp) / (μ * (1 - ε));
            const N = D / dp;

            // Calculate pressure drops
            const equations = [
                {id: 'ergun', name: 'Ergun方程', func: () => calculateErgun(L, ε, dp, u0, ρ, μ)},
                {id: 'carman_kozeny', name: 'Carman-Kozeny方程', func: () => calculateCarmanKozeny(L, ε, dp, u0, μ)},
                {id: 'burke_plummer', name: 'Burke-Plummer方程', func: () => calculateBurkePlummer(L, ε, dp, u0, ρ)},
                {id: 'eisfeld_schnitzlein', name: 'Eisfeld-Schnitzlein方程', func: () => calculateEisfeldSchnitzlein(L, ε, dp, u0, ρ, μ, D, shape)},
                {id: 'dixon_no_wall', name: 'Dixon方程(无壁面效应)', func: () => calculateDixonNoWall(L, ε, dp, u0, ρ, μ)},
                {id: 'dixon_with_wall', name: 'Dixon方程(有壁面效应)', func: () => calculateDixonWithWall(L, ε, dp, u0, ρ, μ, N)}
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
                        value: dp_value
                    });
                }
            });

            // Update results text
            let resultOutput = '🔍 计算结果 🔍\n\n';
            resultOutput += `🔹 操作条件\n`;
            resultOutput += `   床层高度: ${formatNumber(L)} m\n`;
            resultOutput += `   空隙率: ${formatNumber(ε)}\n`;
            resultOutput += `   颗粒直径: ${formatNumber(dp)} m\n`;
            resultOutput += `   流体速度: ${formatNumber(u0)} m/s\n`;
            resultOutput += `   流体密度: ${formatNumber(ρ)} kg/m³\n`;
            resultOutput += `   流体粘度: ${formatNumber(μ)} Pa·s\n`;
            resultOutput += `   柱直径: ${formatNumber(D)} m\n`;
            resultOutput += `   颗粒形状: ${shape}\n\n`;
            resultOutput += `🔹 特征参数\n`;
            resultOutput += `   雷诺数 (Re) = ${formatNumber(Re)}\n`;
            resultOutput += `   管径与颗粒直径之比 (N) = ${formatNumber(N)}\n\n`;
            resultOutput += '🔹 压降计算结果\n';
            resultOutput += '=' + '='.repeat(48) + '\n';

            results.forEach((result) => {
                const value_Pa = formatNumber(result.value);
                const value_kPa = formatNumber(result.value/1000);
                resultOutput += `${result.name}:\n`;
                resultOutput += `   ${value_Pa} Pa (${value_kPa} kPa)\n`;
            });

            resultOutput += '\n✅ 计算完成！✨';
            resultText.textContent = resultOutput;

            // Switch to results tab
            document.querySelector('[data-tab="results"]').click();
        } catch (error) {
            alert(error.message);
        } finally {
            calculateBtn.classList.remove('loading');
            calculateBtn.disabled = false;
        }
    });
});
