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

    // 显示错误提示函数
    function showErrorTooltip(elementId, message) {
        const input = document.getElementById(elementId);
        const inputGroup = input.closest('.input-group');
        
        // 检查是否已存在错误提示
        let errorSpan = inputGroup.querySelector('.error-message');
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            inputGroup.appendChild(errorSpan);
        }
        
        errorSpan.textContent = message;
    }
    
    // 清除所有错误提示
    function clearErrorTooltips() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
    }

    // 显示错误消息
    function showError(input, message) {
        input.classList.add('error');
        const inputGroup = input.closest('.input-group');
        let errorSpan = inputGroup.querySelector('.error-message');
        
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            inputGroup.appendChild(errorSpan);
        }
        
        errorSpan.textContent = message;
    }

    // 清除错误状态
    function clearError(input) {
        input.classList.remove('error');
        const inputGroup = input.closest('.input-group');
        const errorSpan = inputGroup.querySelector('.error-message');
    }

    // 单个字段验证
    function validateField(fieldId) {
        console.log(`验证字段: ${fieldId}`);
        const field = typeof fieldId === 'string' ? document.getElementById(fieldId) : fieldId;
        
        if (!field) {
            console.error(`找不到字段元素: ${fieldId}`);
            return false;
        }
        
        const value = field.value.trim();
        
        // 清除之前的错误状态
        field.classList.remove('error');
        const inputGroup = field.closest('.input-group');
        const errorSpan = inputGroup.querySelector('.error-message');
        if (errorSpan) errorSpan.remove();
        
        // 检查是否为空
        if (!value) {
            // 只有在用户实际输入后才显示错误
            // 如果默认值是空的，避免标记为错误
            if (field.hasAttribute('data-user-input')) {
                field.classList.add('error');
                showErrorTooltip(field.id, '此字段不能为空');
                console.log(`${fieldId}: 空值错误`);
                return false;
            }
            return true;
        }
        
        // 标记字段已被用户输入过
        field.setAttribute('data-user-input', 'true');
        
        // 接受任何可能是数字的输入，包括科学计数法和多位小数
        // 判断是否为合法数字的正则表达式
        const numberPattern = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;
        if (!numberPattern.test(value)) {
            field.classList.add('error');
            showErrorTooltip(field.id, '请输入有效的数字');
            console.log(`${fieldId}: 无效数字格式`);
            return false;
        }
        
        console.log(`${fieldId}: 验证通过，值为 ${value}`);
        // 接受任何数值，不进行额外限制
        return true;
    }
    
    // 设置输入字段验证
    function setupValidation() {
        const inputs = document.querySelectorAll('.input-group input[type="number"]');
        inputs.forEach(input => {
            // 初始化时清除所有错误状态
            input.classList.remove('error');
            const inputGroup = input.closest('.input-group');
            const errorSpans = inputGroup.querySelectorAll('.error-message');
            errorSpans.forEach(span => span.remove());
            
            // 移除之前可能的事件监听器
            const oldInputHandler = input._inputHandler;
            const oldBlurHandler = input._blurHandler;
            
            if (oldInputHandler) {
                input.removeEventListener('input', oldInputHandler);
            }
            
            if (oldBlurHandler) {
                input.removeEventListener('blur', oldBlurHandler);
            }
            
            // 定义新的事件处理函数
            const inputHandler = () => {
                // 标记为用户输入
                input.setAttribute('data-user-input', 'true');
                validateField(input);
            };
            
            const blurHandler = () => {
                if (input.value) {
                    input.setAttribute('data-user-input', 'true');
                }
                validateField(input);
            };
            
            // 保存引用以便以后移除
            input._inputHandler = inputHandler;
            input._blurHandler = blurHandler;
            
            // 添加事件监听器
            input.addEventListener('input', inputHandler);
            input.addEventListener('blur', blurHandler);
        });
    }

    // Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const modal = document.getElementById('formulaModal');
    const modalClose = document.querySelector('.modal-close');
    const formulaDetail = document.getElementById('formulaDetail');
    const infoLinks = document.querySelectorAll('.correlation-info');

    // 设置默认值
    const defaultValues = {
        fluid_velocity: 1,        // m/s
        particle_diameter: 0.006, // m
        bed_height: 1,            // m
        tube_ratio: 10,           // D/dp
        fluid_density: 1.225,     // kg/m³ (常温空气)
        fluid_viscosity: 1.8e-5,  // Pa·s (常温空气)
        molecular_diffusivity: 2e-5, // m²/s (常温空气)
        bed_porosity: 0.4         // dimensionless
    };

    // 初始化函数
    function initializeInputs() {
        // 清除所有错误状态
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.classList.remove('error');
            const inputGroup = input.closest('.input-group');
            const errorSpan = inputGroup.querySelector('.error-message');
            if (errorSpan) errorSpan.remove();
            
            // 移除用户输入标记，避免初始状态触发验证
            input.removeAttribute('data-user-input');
        });
        
        // 设置默认值
        Object.entries(defaultValues).forEach(([id, value]) => {
            const input = document.getElementById(id);
            if (input) {
                input.value = value;
                // 确保没有错误类
                input.classList.remove('error');
            }
        });
    }

    // 页面加载时初始化
    initializeInputs();
    
    // 设置所有输入框接受任意精度的小数
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.setAttribute('step', 'any');
    });
    
    // 完全禁用页面加载时的自动验证
    // setTimeout(setupValidation, 100);

    // Reset Function
    function resetValues() {
        // 先清除所有错误提示和状态
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.classList.remove('error');
            input.style.border = ''; // 移除任何可能的边框样式
            
            // 移除用户输入标记，避免重置后触发验证
            input.removeAttribute('data-user-input');
            
            const inputGroup = input.closest('.input-group');
            const errorSpans = inputGroup.querySelectorAll('.error-message');
            errorSpans.forEach(span => span.remove());
            
            // 移除step属性的限制
            input.setAttribute('step', 'any');
        });
        
        // 清除所有错误提示
        clearErrorTooltips();
        
        // 然后设置默认值
        for (const [id, value] of Object.entries(defaultValues)) {
            const element = document.getElementById(id);
            if (element) {
                element.value = value;
                element.classList.remove('error');
                // 确保所有输入框都接受任意小数位数
                element.setAttribute('step', 'any');
            }
        }
    }

    // Clear Function
    function clearValues() {
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => input.value = '');
        // 清除后清除所有错误提示
        clearErrorTooltips();
        inputs.forEach(input => input.classList.remove('error'));
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
        console.log('计算函数开始执行');
        try {
            // 清除之前的错误状态
            const inputs = document.querySelectorAll('input[type="number"]');
            inputs.forEach(input => input.classList.remove('error'));
            
            // 移除之前的错误提示
            clearErrorTooltips();
            
            // 验证所有输入字段
            let hasError = false;
            
            const inputFields = [
                'fluid_velocity', 'particle_diameter', 'bed_height', 'tube_ratio',
                'fluid_density', 'fluid_viscosity', 'molecular_diffusivity', 'bed_porosity'
            ];
            
            console.log('开始验证输入字段');
            // 验证所有字段
            inputFields.forEach(fieldId => {
                if (!validateField(fieldId)) {
                    hasError = true;
                    console.log(`字段 ${fieldId} 验证失败`);
                }
            });
            
            // 如果有错误，停止计算
            if (hasError) {
                console.log('输入验证失败，计算终止');
                return;
            }
            
            // 自定义函数解析数字，确保正确处理科学计数法和任意精度小数
            function parseNumberValue(value) {
                // 检查是否为科学计数法
                if (typeof value === 'string' && (value.includes('e') || value.includes('E'))) {
                    return Number(value);
                }
                
                // 使用parseFloat解析普通数字
                const parsed = parseFloat(value);
                
                // 确保返回有效数字，如果解析失败返回0
                return isNaN(parsed) ? 0 : parsed;
            }
            
            // 获取输入值（使用自定义解析函数）
            const fluidVelocity = parseNumberValue(document.getElementById('fluid_velocity').value);
            const particleDiameter = parseNumberValue(document.getElementById('particle_diameter').value);
            const bedHeight = parseNumberValue(document.getElementById('bed_height').value);
            const tubeRatio = parseNumberValue(document.getElementById('tube_ratio').value);
            const fluidDensity = parseNumberValue(document.getElementById('fluid_density').value);
            const fluidViscosity = parseNumberValue(document.getElementById('fluid_viscosity').value);
            const molecularDiffusivity = parseNumberValue(document.getElementById('molecular_diffusivity').value);
            const bedPorosity = parseNumberValue(document.getElementById('bed_porosity').value);
            
            // 直接使用用户输入的值，不进行替换
            const inputs_obj = {
                fluidVelocity: fluidVelocity,
                particleDiameter: particleDiameter,
                bedHeight: bedHeight,
                tubeRatio: tubeRatio,
                fluidDensity: fluidDensity,
                fluidViscosity: fluidViscosity,
                molecularDiffusivity: molecularDiffusivity,
                bedPorosity: bedPorosity
            };
            
            // Calculate dimensionless numbers
            const Re = (inputs_obj.fluidVelocity * inputs_obj.particleDiameter * inputs_obj.fluidDensity) / inputs_obj.fluidViscosity;
            const Sc = inputs_obj.fluidViscosity / (inputs_obj.fluidDensity * inputs_obj.molecularDiffusivity);
            const Pe_m = Re * Sc;

            // Calculate axial dispersion coefficients
            const tubeDiameter = inputs_obj.tubeRatio * inputs_obj.particleDiameter;
            const epsilon = inputs_obj.bedPorosity;  // Using input bed porosity instead of hardcoded value
            
            // Edwards-Richardson 模型
            const molDiffusionTerm = inputs_obj.molecularDiffusivity / (inputs_obj.fluidDensity * inputs_obj.fluidViscosity);
            const Pe_ax_ER_inv = (0.73 * epsilon) / (Re * Sc) + 0.5 / (1 + 9.7 * epsilon / (Re * Sc));
            const D_ax_ER = inputs_obj.fluidVelocity * inputs_obj.particleDiameter * Pe_ax_ER_inv;
            
            // Zehner-Schlünder 模型
            const Pe_ax_ZS_inv = (1 - Math.sqrt(1 - epsilon)) / (Re * Sc) + 0.5;
            const D_ax_ZS = inputs_obj.fluidVelocity * inputs_obj.particleDiameter * Pe_ax_ZS_inv;
            
            // Gunn 模型
            const tau = epsilon / Math.pow(1 - epsilon, 1/3);
            const Pe_ax_Gunn_inv = (epsilon / (tau * Re * Sc)) + 0.5;
            const Pe_ax_Gunn = 1 / Pe_ax_Gunn_inv;  // 修改变量名
            const D_ax_Gunn = inputs_obj.fluidVelocity * inputs_obj.particleDiameter / Pe_ax_Gunn;
            
            // Wakao-Kaguei 模型
            const D_ax_WK = inputs_obj.molecularDiffusivity * epsilon + 0.5 * inputs_obj.fluidVelocity * inputs_obj.particleDiameter;

            // Calculate radial dispersion coefficients
            // Edwards-Richardson 径向模型
            const D_rad_ER = inputs_obj.molecularDiffusivity * epsilon + 0.073 * inputs_obj.fluidVelocity * inputs_obj.particleDiameter / (1 + 9.7 * inputs_obj.molecularDiffusivity / (inputs_obj.fluidVelocity * inputs_obj.particleDiameter));
            
            // Zehner-Schlünder 径向模型
            const N = inputs_obj.tubeRatio; // 管径比
            const Pe_rad_ZS_inv = (epsilon / (9.5 * Re * Sc)) + (1 / 11);
            const D_rad_ZS = inputs_obj.fluidVelocity * inputs_obj.particleDiameter * Pe_rad_ZS_inv;
            
            // Gunn 径向模型
            const D_rad_Gunn = inputs_obj.molecularDiffusivity * epsilon * (1 + 0.11 * Math.pow(Re * Sc, 0.8)) / (1 + 10.5 * inputs_obj.molecularDiffusivity / (inputs_obj.fluidVelocity * inputs_obj.particleDiameter));
            
            // Wakao-Kaguei 径向模型
            const Pe_rad_WK_inv = (0.7 * epsilon) / (Re * Sc) + 0.1;
            const D_rad_WK = inputs_obj.fluidVelocity * inputs_obj.particleDiameter * Pe_rad_WK_inv;

            // 计算Lerou-Wammes模型（替换了以前的ER径向模型）
            const Pe_rad_Lerou = 8 / (1 + 20 / Math.pow(N, 2));
            const D_rad_Lerou = inputs_obj.fluidVelocity * inputs_obj.particleDiameter / Pe_rad_Lerou;
            
            // 计算Bauer模型
            const Pe_rad_Bauer_inv = (0.73 * epsilon) / (Re * Sc) + 1 / (7 * Math.pow(2 - (1 - 2/N), 2));
            const D_rad_Bauer = inputs_obj.fluidVelocity * inputs_obj.particleDiameter * Pe_rad_Bauer_inv;
            
            // Specchia模型
            const Pe_rad_Specchia_inv = (epsilon / (10 * Re * Sc)) + (1 / 12);
            const D_rad_Specchia = inputs_obj.fluidVelocity * inputs_obj.particleDiameter * Pe_rad_Specchia_inv;

            // Calculate Peclet numbers
            const Pe_ax_standard = 2.0; // 标准轴向佩克列数
            const D_ax_standard = inputs_obj.fluidVelocity * inputs_obj.particleDiameter / Pe_ax_standard;
            
            const Pe_ax_ER = 1 / Pe_ax_ER_inv;
            const Pe_ax_ZS = 1 / Pe_ax_ZS_inv;
            // Gunn 模型已经在前面计算为 Pe_ax_Gunn
            const Pe_ax_WK = inputs_obj.fluidVelocity * inputs_obj.particleDiameter / D_ax_WK;
            
            // 径向
            const Pe_rad_ER = inputs_obj.fluidVelocity * inputs_obj.particleDiameter / D_rad_ER;
            const Pe_rad_ZS = 1 / Pe_rad_ZS_inv;
            const Pe_rad_Gunn = inputs_obj.fluidVelocity * inputs_obj.particleDiameter / D_rad_Gunn;
            const Pe_rad_WK = 1 / Pe_rad_WK_inv;
            const Pe_rad_Bauer = 1 / Pe_rad_Bauer_inv;
            const Pe_rad_Specchia = 1 / Pe_rad_Specchia_inv;

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
                D_rad_Lerou,
                D_rad_Bauer,
                D_rad_Specchia,
                
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
                Pe_rad_Lerou,
                Pe_rad_Bauer,
                Pe_rad_Specchia
            };

            // Display results in the UI
            displayResults(inputs_obj, results);
            
            // Switch to results tab
            document.querySelector('[data-tab="results"]').click();
        } catch (error) {
            console.error('计算过程中发生错误:', error);
            alert('计算过程中发生错误: ' + error.message);
        }
    }
    
    // Display Results Function
    function displayResults(inputs, results) {
        console.log('开始显示结果');
        try {
            const resultsContent = document.querySelector('.results-content');
            if (!resultsContent) {
                console.error('未找到结果容器元素 .results-content');
                return;
            }
            console.log('输入参数:', inputs);
            console.log('计算结果:', results);
            
            // 格式化数字函数
            function formatNumber(num) {
                if (num === 0) return "0";
                if (!isFinite(num) || isNaN(num)) return '无效数字';
                const absNum = Math.abs(num);
                if (absNum < 0.001 || absNum >= 10000) {
                    return num.toExponential(4);
                }
                return num.toFixed(4);
            }
            
            // 查找最大和最小值
            function findMinMax(obj, prefix) {
                const values = Object.entries(obj)
                    .filter(([key]) => key.startsWith(prefix))
                    .map(([_, value]) => value);
                return { 
                    min: Math.min(...values), 
                    max: Math.max(...values) 
                };
            }
            
            // 为轴向和径向反混系数找出最大最小值
            // 轴向部分：只包含标准模型和三个轴向模型
            const axialValues = [
                inputs.fluidVelocity * inputs.particleDiameter / 2.0, // 标准模型
                results.D_ax_ER,
                results.D_ax_ZS,
                results.D_ax_Gunn
            ];
            const axialMinMax = {
                min: Math.min(...axialValues),
                max: Math.max(...axialValues)
            };
            
            // 径向部分：只包含四个径向模型
            const radialValues = [
                results.D_rad_Lerou,
                results.D_rad_Bauer,
                results.D_rad_WK,
                results.D_rad_Specchia
            ];
            const radialMinMax = {
                min: Math.min(...radialValues),
                max: Math.max(...radialValues)
            };
            
            // 准备结果卡片数据
            const Re = (inputs.fluidVelocity * inputs.particleDiameter * inputs.fluidDensity) / inputs.fluidViscosity;
            const Sc = inputs.fluidViscosity / (inputs.fluidDensity * inputs.molecularDiffusivity);
            const Pe_m = Re * Sc;
            
            // 构建结果HTML
            let html = `
            <div class="results-wrapper">
                <!-- 操作条件卡片 -->
                <div class="result-card condition-card">
                    <div class="section-header">
                        <span class="section-icon">🔬</span>
                        操作条件
                    </div>
                    <table class="results-table">
                        <tr>
                            <th width="40%">参数</th>
                            <th width="30%">数值</th>
                            <th width="30%">单位</th>
                        </tr>
                        <tr>
                            <td>流体表观速度 (<i>u</i><sub>0</sub>)</td>
                            <td class="value-column">${formatNumber(inputs.fluidVelocity)}</td>
                            <td>m/s</td>
                        </tr>
                        <tr>
                            <td>颗粒直径 (<i>d</i><sub>p</sub>)</td>
                            <td class="value-column">${formatNumber(inputs.particleDiameter)}</td>
                            <td>m</td>
                        </tr>
                        <tr>
                            <td>床层高度 (<i>H</i>)</td>
                            <td class="value-column">${formatNumber(inputs.bedHeight)}</td>
                            <td>m</td>
                        </tr>
                        <tr>
                            <td>管径/颗粒直径比 (<i>N</i>)</td>
                            <td class="value-column">${formatNumber(inputs.tubeRatio)}</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>床层空隙率 (<i>ε</i>)</td>
                            <td class="value-column">${formatNumber(inputs.bedPorosity)}</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>流体密度 (<i>ρ</i>)</td>
                            <td class="value-column">${formatNumber(inputs.fluidDensity)}</td>
                            <td>kg/m³</td>
                        </tr>
                        <tr>
                            <td>流体黏度 (<i>μ</i>)</td>
                            <td class="value-column">${formatNumber(inputs.fluidViscosity)}</td>
                            <td>Pa·s</td>
                        </tr>
                        <tr>
                            <td>分子扩散系数 (<i>D</i><sub>m</sub>)</td>
                            <td class="value-column">${formatNumber(inputs.molecularDiffusivity)}</td>
                            <td>m²/s</td>
                        </tr>
                    </table>
                </div>
                
                <!-- 无量纲参数卡片 -->
                <div class="result-card parameters-card">
                    <div class="section-header">
                        <span class="section-icon">📊</span>
                        无量纲参数
                    </div>
                    <table class="results-table">
                        <tr>
                            <th width="25%">参数</th>
                            <th width="25%">数值</th>
                            <th width="50%">说明</th>
                        </tr>
                        <tr>
                            <td>雷诺数 (<i>Re</i>)</td>
                            <td class="value-column">${formatNumber(Re)}</td>
                            <td>表征惯性力与黏性力的比值</td>
                        </tr>
                        <tr>
                            <td>施密特数 (<i>Sc</i>)</td>
                            <td class="value-column">${formatNumber(Sc)}</td>
                            <td>表征动量扩散与物质扩散的比值</td>
                        </tr>
                        <tr>
                            <td>分子佩克列数 (<i>Pe</i><sub>m</sub>)</td>
                            <td class="value-column">${formatNumber(Pe_m)}</td>
                            <td>表征对流传质与分子扩散的比值</td>
                        </tr>
                    </table>
                </div>
                
                <!-- 轴向反混系数卡片 -->
                <div class="result-card pressure-card">
                    <div class="section-header">
                        <span class="section-icon">↕️</span>
                        轴向反混系数 (<i>D</i><sub>ax</sub>)
                    </div>
                    <table class="results-table">
                        <tr>
                            <th width="40%">模型</th>
                            <th width="30%">反混系数 (m²/s)</th>
                            <th width="30%">佩克列数 (<i>Pe</i><sub>ax</sub>)</th>
                        </tr>
                        <tr ${inputs.fluidVelocity * inputs.particleDiameter / 2.0 === axialMinMax.min ? 'class="min-value"' : inputs.fluidVelocity * inputs.particleDiameter / 2.0 === axialMinMax.max ? 'class="max-value"' : ''}>
                            <td class="equation-name">
                                标准模型
                                ${inputs.fluidVelocity * inputs.particleDiameter / 2.0 === axialMinMax.min ? '<span class="result-badge min-badge">最小值</span>' : ''}
                                ${inputs.fluidVelocity * inputs.particleDiameter / 2.0 === axialMinMax.max ? '<span class="result-badge max-badge">最大值</span>' : ''}
                            </td>
                            <td class="value-column">${formatNumber(inputs.fluidVelocity * inputs.particleDiameter / 2.0)}</td>
                            <td class="value-column">2.00</td>
                        </tr>
                        <tr ${results.D_ax_ER === axialMinMax.min ? 'class="min-value"' : results.D_ax_ER === axialMinMax.max ? 'class="max-value"' : ''}>
                            <td class="equation-name">
                                Edwards-Richardson模型
                                ${results.D_ax_ER === axialMinMax.min ? '<span class="result-badge min-badge">最小值</span>' : ''}
                                ${results.D_ax_ER === axialMinMax.max ? '<span class="result-badge max-badge">最大值</span>' : ''}
                            </td>
                            <td class="value-column">${formatNumber(results.D_ax_ER)}</td>
                            <td class="value-column">${formatNumber(results.Pe_ax_ER)}</td>
                        </tr>
                        <tr ${results.D_ax_ZS === axialMinMax.min ? 'class="min-value"' : results.D_ax_ZS === axialMinMax.max ? 'class="max-value"' : ''}>
                            <td class="equation-name">
                                Zehner-Schlünder模型
                                ${results.D_ax_ZS === axialMinMax.min ? '<span class="result-badge min-badge">最小值</span>' : ''}
                                ${results.D_ax_ZS === axialMinMax.max ? '<span class="result-badge max-badge">最大值</span>' : ''}
                            </td>
                            <td class="value-column">${formatNumber(results.D_ax_ZS)}</td>
                            <td class="value-column">${formatNumber(results.Pe_ax_ZS)}</td>
                        </tr>
                        <tr ${results.D_ax_Gunn === axialMinMax.min ? 'class="min-value"' : results.D_ax_Gunn === axialMinMax.max ? 'class="max-value"' : ''}>
                            <td class="equation-name">
                                Gunn模型
                                ${results.D_ax_Gunn === axialMinMax.min ? '<span class="result-badge min-badge">最小值</span>' : ''}
                                ${results.D_ax_Gunn === axialMinMax.max ? '<span class="result-badge max-badge">最大值</span>' : ''}
                            </td>
                            <td class="value-column">${formatNumber(results.D_ax_Gunn)}</td>
                            <td class="value-column">${formatNumber(results.Pe_ax_Gunn)}</td>
                        </tr>
                    </table>
                    
                    <!-- 轴向图表 -->
                    <div class="result-chart">
                        <div class="chart-title">轴向反混系数对比图示</div>
                        <div class="bar-chart">
                            ${[
                                {name: "标准模型", value: inputs.fluidVelocity * inputs.particleDiameter / 2.0},
                                {name: "Edwards-Richardson模型", value: results.D_ax_ER},
                                {name: "Zehner-Schlünder模型", value: results.D_ax_ZS},
                                {name: "Gunn模型", value: results.D_ax_Gunn}
                            ].map(result => {
                                const percent = (result.value / axialMinMax.max * 100).toFixed(1);
                                let barClass = "";
                                if (result.value === axialMinMax.min) barClass = "min-bar";
                                if (result.value === axialMinMax.max) barClass = "max-bar";
                                
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
                </div>
                
                <!-- 径向反混系数卡片 -->
                <div class="result-card stats-card">
                    <div class="section-header">
                        <span class="section-icon">↔️</span>
                        径向反混系数 (<i>D</i><sub>rad</sub>)
                    </div>
                    <table class="results-table">
                        <tr>
                            <th width="40%">模型</th>
                            <th width="30%">反混系数 (m²/s)</th>
                            <th width="30%">佩克列数 (<i>Pe</i><sub>rad</sub>)</th>
                        </tr>
                        <tr ${results.D_rad_Lerou === radialMinMax.min ? 'class="min-value"' : results.D_rad_Lerou === radialMinMax.max ? 'class="max-value"' : ''}>
                            <td class="equation-name">
                                Lerou-Wammes模型
                                ${results.D_rad_Lerou === radialMinMax.min ? '<span class="result-badge min-badge">最小值</span>' : ''}
                                ${results.D_rad_Lerou === radialMinMax.max ? '<span class="result-badge max-badge">最大值</span>' : ''}
                            </td>
                            <td class="value-column">${formatNumber(results.D_rad_Lerou)}</td>
                            <td class="value-column">${formatNumber(results.Pe_rad_Lerou)}</td>
                        </tr>
                        <tr ${results.D_rad_Bauer === radialMinMax.min ? 'class="min-value"' : results.D_rad_Bauer === radialMinMax.max ? 'class="max-value"' : ''}>
                            <td class="equation-name">
                                Bauer模型
                                ${results.D_rad_Bauer === radialMinMax.min ? '<span class="result-badge min-badge">最小值</span>' : ''}
                                ${results.D_rad_Bauer === radialMinMax.max ? '<span class="result-badge max-badge">最大值</span>' : ''}
                            </td>
                            <td class="value-column">${formatNumber(results.D_rad_Bauer)}</td>
                            <td class="value-column">${formatNumber(results.Pe_rad_Bauer)}</td>
                        </tr>
                        <tr ${results.D_rad_WK === radialMinMax.min ? 'class="min-value"' : results.D_rad_WK === radialMinMax.max ? 'class="max-value"' : ''}>
                            <td class="equation-name">
                                Wakao-Kaguei模型
                                ${results.D_rad_WK === radialMinMax.min ? '<span class="result-badge min-badge">最小值</span>' : ''}
                                ${results.D_rad_WK === radialMinMax.max ? '<span class="result-badge max-badge">最大值</span>' : ''}
                            </td>
                            <td class="value-column">${formatNumber(results.D_rad_WK)}</td>
                            <td class="value-column">${formatNumber(results.Pe_rad_WK)}</td>
                        </tr>
                        <tr ${results.D_rad_Specchia === radialMinMax.min ? 'class="min-value"' : results.D_rad_Specchia === radialMinMax.max ? 'class="max-value"' : ''}>
                            <td class="equation-name">
                                Specchia模型
                                ${results.D_rad_Specchia === radialMinMax.min ? '<span class="result-badge min-badge">最小值</span>' : ''}
                                ${results.D_rad_Specchia === radialMinMax.max ? '<span class="result-badge max-badge">最大值</span>' : ''}
                            </td>
                            <td class="value-column">${formatNumber(results.D_rad_Specchia)}</td>
                            <td class="value-column">${formatNumber(results.Pe_rad_Specchia)}</td>
                        </tr>
                    </table>
                    
                    <!-- 径向图表 -->
                    <div class="result-chart">
                        <div class="chart-title">径向反混系数对比图示</div>
                        <div class="bar-chart">
                            ${[
                                {name: "Lerou-Wammes模型", value: results.D_rad_Lerou},
                                {name: "Bauer模型", value: results.D_rad_Bauer},
                                {name: "Wakao-Kaguei模型", value: results.D_rad_WK},
                                {name: "Specchia模型", value: results.D_rad_Specchia}
                            ].map(result => {
                                const percent = (result.value / radialMinMax.max * 100).toFixed(1);
                                let barClass = "";
                                if (result.value === radialMinMax.min) barClass = "min-bar";
                                if (result.value === radialMinMax.max) barClass = "max-bar";
                                
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
                </div>
            </div>
            <div class="completion-message">✅ 计算完成！✨</div>`;
            
            resultsContent.innerHTML = html;
        } catch (error) {
            console.error('显示结果时发生错误:', error);
            alert('显示结果时发生错误: ' + error.message);
        }
    }

    // Modal Functionality
    function showModal() {
        modal.style.display = "block";

        // 关注可访问性
        setTimeout(() => {
            // 聚焦第一个可交互元素
            const firstFocusable = modal.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (firstFocusable) firstFocusable.focus();
        }, 0);
    }

    // 加载MathJax函数
    function loadMathJax() {
        if (typeof window.ensureMathJaxReady === 'function') {
            return window.ensureMathJaxReady();
        }
        return Promise.resolve(window.MathJax || null);
    }

    // Event Listeners
    
    // 事件监听器已经在DOMContentLoaded中添加，这里注释掉防止重复
    // document.getElementById('calculate-button').addEventListener('click', calculate);
    // document.getElementById('clear-button').addEventListener('click', clearValues);
    // document.getElementById('reset-button').addEventListener('click', resetValues);

    modalClose.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Use event delegation for formula info links
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.correlation-info')) {
            e.preventDefault();
            e.stopPropagation();
            const link = e.target.closest('.correlation-info');
            const correlation = link.dataset.correlation;
            const info = formulaInfo[correlation];
            if (info) {
                // 使用新的HTML结构展示公式详情
                let content = `
                    <div class="formula-detail">
                        <h4>${info.title}</h4>
                        
                        <div class="formula-section formula-main">
                            <h4>
                                <span class="section-icon">📐</span>
                                <span class="section-title">数学表达式</span>
                            </h4>
                            <div class="formula-math loading">
                                ${info.formula || (info.content ? (info.content.match(/<div class="formula-math">\s*([\s\S]*?)\s*<\/div>/) || ['', '暂无公式'])[1] : '暂无公式')}
                                <div class="formula-overlay"></div>
                            </div>
                        </div>`;
                
                if (info.parameters || (info.content && info.content.includes('适用范围'))) {
                    content += `
                        <div class="formula-section parameters-section">
                            <h4>
                                <span class="section-icon">📝</span>
                                <span class="section-title">参数说明</span>
                                <span class="param-count">${info.parameters ? info.parameters.length : 0}个参数</span>
                            </h4>`;
                    
                    if (info.parameters) {
                        content += `
                            <table class="param-table">
                                <thead>
                                    <tr>
                                        <th width="15%">符号</th>
                                        <th width="25%">参数</th>
                                        <th>说明</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${info.parameters.map(([symbol, param, desc]) => `
                                        <tr>
                                            <td class="symbol-cell" title="数学符号">$${symbol}$</td>
                                            <td class="param-cell" title="参数名称">${param}</td>
                                            <td class="desc-cell" title="详细说明">${desc}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>`;
                    } else if (info.content) {
                        // 从content中提取适用范围
                        const applicabilityMatch = info.content.match(/<p>适用范围：<\/p>\s*<ul>([\s\S]*?)<\/ul>/);
                        if (applicabilityMatch) {
                            content += applicabilityMatch[0];
                        }
                    }
                    
                    content += `</div>`;
                }

                if (info.theory || (info.content && info.content.includes('特点'))) {
                    content += `
                        <div class="formula-section theory-section">
                            <h4>
                                <span class="section-icon">💡</span>
                                <span class="section-title">理论基础</span>
                            </h4>
                            <div class="theory-content">
                                <div class="theory-card">
                                    ${info.theory || ''}
                                    ${!info.theory && info.content ? 
                                        (info.content.match(/<p>特点：<\/p>\s*<ul>([\s\S]*?)<\/ul>/) || [])[0] || '' : ''}
                                </div>
                            </div>
                        </div>`;
                }

                if (info.applicability || (info.content && info.content.includes('参考文献'))) {
                    content += `
                        <div class="formula-section applicability-section">
                            <h4>
                                <span class="section-icon">📋</span>
                                <span class="section-title">适用条件</span>
                            </h4>
                            <div class="applicability-content">
                                <div class="conditions-list">
                                    ${info.applicability || ''}
                                    ${!info.applicability && info.content ? 
                                        (info.content.match(/<p>参考文献：.*?<\/p>/) || [])[0] || '' : ''}
                                </div>
                            </div>
                        </div>`;
                }
                
                content += renderFormulaReferences(correlation);

                content += `</div>`;
                
                formulaDetail.innerHTML = content;
                showModal();
                loadingOverlay.classList.remove('show');

                if (typeof window.scheduleMathJaxTypeset === 'function') {
                    window.scheduleMathJaxTypeset(formulaDetail);
                } else {
                    loadMathJax();
                }
            }
        }
    });

    // Initialize with default values
    resetValues();

    // Remove loading overlay after initialization
    loadingOverlay.classList.remove('show');

    // Set default values on page load
    window.onload = function() {
        // 在页面加载过程中隐藏加载状态
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.classList.remove('show');
        
        // 强化清除所有错误状态
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.classList.remove('error');
            input.style.border = ''; // 移除任何可能的边框样式
            const inputGroup = input.closest('.input-group');
            const errorSpans = inputGroup.querySelectorAll('.error-message');
            errorSpans.forEach(span => span.remove());
            
            // 移除用户输入标记，避免初始状态触发验证
            input.removeAttribute('data-user-input');
            
            // 移除所有现有的事件处理器
            const oldInputHandler = input._inputHandler;
            const oldBlurHandler = input._blurHandler;
            
            if (oldInputHandler) {
                input.removeEventListener('input', oldInputHandler);
            }
            
            if (oldBlurHandler) {
                input.removeEventListener('blur', oldBlurHandler);
            }
            
            // 设置step为any，允许任意小数位数
            input.setAttribute('step', 'any');
        });
        
        // 清除所有错误提示
        clearErrorTooltips();
        
        // 设置默认值
        Object.entries(defaultValues).forEach(([id, value]) => {
            const input = document.getElementById(id);
            if (input) {
                input.value = value;
                input.classList.remove('error');
            }
        });
        
        // 延迟设置验证，确保默认值已经完全加载且不会触发验证
        setTimeout(() => {
            setupValidation();
        }, 1000);
    };

    // Formula Information
    const formulaInfo = {
        axial_standard: {
            title: "轴向反混系数 - 标准模型",
            formula: `\\[ D_{ax} = \\frac{u_0 d_p}{Pe_{ax}}, \\quad Pe_{ax} = 2.0 \\]`,
            parameters: [
                ["D_{ax}", "轴向反混系数", "表征流体在固定床中轴向混合的系数"],
                ["u_0", "流体表观速度", "通过固定床的流体表观速度"],
                ["d_p", "颗粒直径", "填充颗粒的特征尺寸"],
                ["Pe_{ax}", "轴向佩克列数", "轴向流动条件下的特征无量纲数，通常取2.0"]
            ],
            theory: `<p><strong>轴向反混系数标准模型</strong>是固定床流动中最基础的描述方式。</p>
            <p>关键特点：</p>
            <ul>
                <li>假设轴向佩克列数为恒定值2.0</li>
                <li>适用于完全发展的湍流流动区域</li>
                <li>忽略了分子扩散的贡献</li>
            </ul>
            <p>这是最简单的轴向混合模型，通常用于初步设计计算。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">Reynolds数 (Re): 0 - 50</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">床层高度与颗粒直径比 > 50</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">颗粒直径：0.5-6 mm</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于初步工程估算</span>
    </div>
</div>`
        },
        axial_edwards: {
            title: "轴向反混系数 - Edwards-Richardson模型",
            formula: `\\[ \\frac{1}{Pe_{ax}} = \\frac{0.73\\varepsilon}{Re\\cdot Sc} + \\frac{0.5}{1 + \\frac{9.7\\varepsilon}{Re\\cdot Sc}} \\]
\\[ D_{ax} = \\frac{u_0 d_p}{Pe_{ax}} \\]`,
            parameters: [
                ["D_{ax}", "轴向反混系数", "表征流体在固定床中轴向混合的系数"],
                ["Pe_{ax}", "轴向佩克列数", "轴向流动条件下的特征无量纲数"],
                ["\\varepsilon", "床层空隙率", "固定床中流体所占体积分数"],
                ["Re", "雷诺数", "表征流动状态的无量纲数"],
                ["Sc", "施密特数", "动量扩散与质量扩散的比值"]
            ],
            theory: `<p><strong>Edwards-Richardson模型</strong>是一个考虑多种因素的轴向弥散关联式。</p>
            <p>关键特点：</p>
            <ul>
                <li>考虑了床层空隙率的影响</li>
                <li>结合了分子扩散和湍流混合的贡献</li>
                <li>适用于低雷诺数条件</li>
            </ul>
            <p>Edwards和Richardson在1968年提出的这一模型至今仍广泛应用于各种反应器设计中。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">Reynolds数 (Re): 0.008 - 50</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">管径与颗粒直径比 (D/dp): 14 - 220</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">特别适用于实验室规模反应器</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">参考文献：Edwards, M. F., & Richardson, J. F. (1968)</span>
    </div>
</div>`
        },
        axial_zehner: {
            title: "轴向反混系数 - Zehner-Schlünder模型",
            formula: `\\[ \\frac{1}{Pe_{ax}} = \\frac{1-\\sqrt{1-\\varepsilon_b}}{Re\\cdot Sc} + \\frac{1}{2} \\]
\\[ D_{ax} = \\frac{u_0 d_p}{Pe_{ax}} \\]`,
            parameters: [
                ["D_{ax}", "轴向反混系数", "表征流体在固定床中轴向混合的系数"],
                ["Pe_{ax}", "轴向佩克列数", "轴向流动条件下的特征无量纲数"],
                ["\\varepsilon_b", "床层空隙率", "固定床中流体所占体积分数"],
                ["Re", "雷诺数", "表征流动状态的无量纲数"],
                ["Sc", "施密特数", "动量扩散与质量扩散的比值"]
            ],
            theory: `<p><strong>Zehner-Schlünder模型</strong>在分析多孔介质传递过程方面有广泛应用。</p>
            <p>关键特点：</p>
            <ul>
                <li>结合了分子扩散和对流混合机制</li>
                <li>考虑了床层结构参数的影响</li>
                <li>适用于较广范围的操作条件</li>
            </ul>
            <p>Zehner和Schlünder在1970年提出的这个模型，在描述固定床传递过程方面具有坚实的理论基础。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于多孔介质中流体的轴向混合</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">考虑了床层空隙率的影响</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">依赖于床层结构参数</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">参考文献：Zehner, P., & Schlünder, E. U. (1970)</span>
    </div>
</div>`
        },
        axial_gunn: {
            title: "轴向反混系数 - Gunn模型",
        formula: `\\[ Pe_{ax} = \\frac{\\tau \\cdot Re \\cdot Sc}{\\varepsilon_b} \\cdot \\frac{1}{\\frac{\\varepsilon_b}{\\tau \\cdot Re \\cdot Sc} + \\frac{1}{2}} \\]
                        \\[ \\tau = \\frac{\\varepsilon_b}{(1-\\varepsilon_b)^{1/3}} \\]
\\[ D_{ax} = \\frac{u_0 d_p}{Pe_{ax}} \\]`,
        parameters: [
            ["D_{ax}", "轴向反混系数", "表征流体在固定床中轴向混合的系数"],
            ["Pe_{ax}", "轴向佩克列数", "轴向流动条件下的特征无量纲数"],
            ["\\tau", "曲折因子", "考虑床层结构的影响因素"],
            ["\\varepsilon_b", "床层空隙率", "固定床中流体所占体积分数"],
            ["Re", "雷诺数", "表征流动状态的无量纲数"],
            ["Sc", "施密特数", "动量扩散与质量扩散的比值"]
        ],
        theory: `<p><strong>Gunn模型</strong>在描述固定床轴向弥散方面具有广泛的适用性。</p>
        <p>关键特点：</p>
        <ul>
            <li>考虑了床层的曲折因子(τ)</li>
            <li>结合了分子扩散和湍流混合的贡献</li>
            <li>广泛适用于多种Reynolds数范围</li>
                    </ul>
        <p>Gunn在1987年提出的这一模型在工程应用和研究中广泛使用。</p>`,
        applicability: `<div class="applicability-conditions">
<div class="condition-item">
    <span class="condition-icon">✓</span>
    <span class="condition-text">Reynolds数 (Re): 1 - 1000</span>
</div>
<div class="condition-item">
    <span class="condition-icon">✓</span>
    <span class="condition-text">床层空隙率 (ε): 0.3 - 0.6</span>
</div>
<div class="condition-item">
    <span class="condition-icon">✓</span>
    <span class="condition-text">适用于多孔介质中的流动</span>
</div>
<div class="condition-item">
    <span class="condition-icon">✓</span>
    <span class="condition-text">参考文献：Gunn, D. J. (1987)</span>
</div>
                </div>`
        },
        radial_edwards: {
            title: "径向反混系数 - Edwards-Richardson模型",
            formula: `\\[ D_{rad} = \\varepsilon_b D_m + 0.073 \\frac{u_0 d_p}{1 + \\frac{9.7 D_m}{u_0 d_p}} \\]`,
            parameters: [
                ["D_{rad}", "径向反混系数", "表征流体在固定床中径向混合的系数"],
                ["\\varepsilon_b", "床层空隙率", "固定床中流体所占体积分数"],
                ["D_m", "分子扩散系数", "流体中组分的分子扩散系数"],
                ["u_0", "流体表观速度", "通过固定床的流体表观速度"],
                ["d_p", "颗粒直径", "填充颗粒的特征尺寸"]
            ],
            theory: `<p><strong>Edwards-Richardson径向模型</strong>描述了流体在固定床中的径向混合行为。</p>
            <p>关键特点：</p>
            <ul>
                <li>考虑了分子扩散和湍流混合的共同作用</li>
                <li>适用于低雷诺数流动条件</li>
                <li>考虑了床层空隙率的影响</li>
            </ul>
            <p>这个模型在固定床反应器设计中具有重要的应用价值。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">Reynolds数 (Re): 0.008 - 50</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">管径与颗粒直径比 (D/dp): > 10</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">特别适用于实验室规模反应器</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">参考文献：Edwards, M. F., & Richardson, J. F. (1968)</span>
    </div>
</div>`
        },
        radial_zehner: {
            title: "径向反混系数 - Zehner-Schlünder模型",
            formula: `\\[ \\frac{1}{Pe_{rad}} = \\frac{\\varepsilon_b}{9.5 \\cdot Re \\cdot Sc} + \\frac{1}{11} \\]
\\[ D_{rad} = \\frac{u_0 d_p}{Pe_{rad}} \\]`,
            parameters: [
                ["D_{rad}", "径向反混系数", "表征流体在固定床中径向混合的系数"],
                ["Pe_{rad}", "径向佩克列数", "径向流动条件下的特征无量纲数"],
                ["\\varepsilon_b", "床层空隙率", "固定床中流体所占体积分数"],
                ["Re", "雷诺数", "表征流动状态的无量纲数"],
                ["Sc", "施密特数", "动量扩散与质量扩散的比值"]
            ],
            theory: `<p><strong>Zehner-Schlünder径向模型</strong>提供了径向佩克列数倒数的计算方法。</p>
            <p>关键特点：</p>
            <ul>
                <li>考虑了床层空隙率的影响</li>
                <li>基于雷诺数和施密特数进行计算</li>
                <li>适用于较广范围的流动条件</li>
            </ul>
            <p>Zehner和Schlünder的这个径向模型对于预测多孔介质中径向混合行为非常有用。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">适用于较广范围的Reynolds数</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">床层空隙率 (ε): 0.3 - 0.6</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">参考文献：Zehner, P., & Schlünder, E. U. (1970)</span>
    </div>
</div>`
        },
        radial_gunn: {
            title: "径向反混系数 - Gunn模型",
            formula: `\\[ D_{rad} = \\varepsilon_b D_m \\left( 1 + 0.11 (Re \\cdot Sc)^{0.8} \\right) / \\left( 1 + \\frac{10.5 D_m}{u_0 d_p} \\right) \\]`,
            parameters: [
                ["D_{rad}", "径向反混系数", "表征流体在固定床中径向混合的系数"],
                ["\\varepsilon_b", "床层空隙率", "固定床中流体所占体积分数"],
                ["D_m", "分子扩散系数", "流体中组分的分子扩散系数"],
                ["Re", "雷诺数", "表征流动状态的无量纲数"],
                ["Sc", "施密特数", "动量扩散与质量扩散的比值"],
                ["u_0", "流体表观速度", "通过固定床的流体表观速度"],
                ["d_p", "颗粒直径", "填充颗粒的特征尺寸"]
            ],
            theory: `<p><strong>Gunn径向模型</strong>描述了固定床反应器中的径向混合行为。</p>
            <p>关键特点：</p>
            <ul>
                <li>考虑了分子扩散和湍流混合的贡献</li>
                <li>引入了雷诺数和施密特数的幂次关系</li>
                <li>适用于广泛的流动条件</li>
            </ul>
            <p>这个模型适用于精确预测固定床中的径向扩散过程。</p>`,
            applicability: `<div class="applicability-conditions">
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">Reynolds数 (Re): 1 - 1000</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">床层空隙率 (ε): 0.3 - 0.6</span>
    </div>
    <div class="condition-item">
        <span class="condition-icon">✓</span>
        <span class="condition-text">参考文献：Gunn, D. J. (1987)</span>
    </div>
</div>`
        },
        radial_lerou: {
            title: "径向反混系数 - Lerou-Wammes模型",
        formula: `\\[ Pe_{rad} = \\frac{8}{1 + \\frac{20}{N^2}} \\]
\\[ D_{rad} = \\frac{u_0 d_p}{Pe_{rad}} \\]`,
        parameters: [
            ["D_{rad}", "径向反混系数", "表征流体在固定床中径向混合的系数"],
            ["Pe_{rad}", "径向佩克列数", "径向流动条件下的特征无量纲数"],
            ["N", "管径比", "管径与颗粒直径的比值 (D/dp)"],
            ["u_0", "流体表观速度", "通过固定床的流体表观速度"],
            ["d_p", "颗粒直径", "填充颗粒的特征尺寸"]
        ],
        theory: `<p><strong>Lerou-Wammes模型</strong>是一个经典的径向弥散关联式。</p>
        <p>关键特点：</p>
                    <ul>
                        <li>考虑了壁面效应的影响</li>
                        <li>适用于均匀粒径分布</li>
            <li>特别适用于催化床层反应器</li>
                    </ul>
        <p>这个模型在工业催化反应器设计中被广泛使用。</p>`,
        applicability: `<div class="applicability-conditions">
<div class="condition-item">
    <span class="condition-icon">✓</span>
    <span class="condition-text">管径比 (N = D/dp) > 5</span>
</div>
<div class="condition-item">
    <span class="condition-icon">✓</span>
    <span class="condition-text">Reynolds数 (Re): 1 - 1000</span>
</div>
<div class="condition-item">
    <span class="condition-icon">✓</span>
    <span class="condition-text">颗粒球形度 > 0.8</span>
</div>
                </div>`
        },
        radial_bauer: {
            title: "径向反混系数 - Bauer模型",
        formula: `\\[ \\frac{1}{Pe_{rm}} = \\frac{0.73\\varepsilon_b}{Re\\cdot Sc} + \\frac{1}{7\\left[2-\\left(1-\\frac{2}{N}\\right)\\right]^2} \\]
                        \\[ D_{rad} = \\frac{u_0 d_p}{Pe_{rm}} \\]
\\[ N = \\frac{D}{d_p} \\]`,
        parameters: [
            ["D_{rad}", "径向反混系数", "表征流体在固定床中径向混合的系数"],
            ["Pe_{rm}", "径向佩克列数", "径向流动条件下的特征无量纲数"],
            ["\\varepsilon_b", "床层空隙率", "固定床中流体所占体积分数"],
            ["Re", "雷诺数", "表征流动状态的无量纲数"],
            ["Sc", "施密特数", "动量扩散与质量扩散的比值"],
            ["N", "管径比", "管径与颗粒直径的比值 (D/dp)"]
        ],
        theory: `<p><strong>Bauer模型</strong>在描述固定床径向混合方面具有良好的适用性。</p>
        <p>关键特点：</p>
        <ul>
                        <li>考虑了管径比对径向混合的影响</li>
                        <li>适用于较宽的流动条件</li>
            <li>结合了分子扩散和湍流混合的贡献</li>
                    </ul>
        <p>Bauer在1978年提出的这一模型在化工设备设计中有广泛应用。</p>`,
        applicability: `<div class="applicability-conditions">
<div class="condition-item">
    <span class="condition-icon">✓</span>
    <span class="condition-text">Reynolds数 (Re): 10 - 2000</span>
</div>
<div class="condition-item">
    <span class="condition-icon">✓</span>
    <span class="condition-text">管径比 (N = D/dp) > 5</span>
</div>
<div class="condition-item">
    <span class="condition-icon">✓</span>
    <span class="condition-text">参考文献：Bauer, R. (1978)</span>
</div>
                </div>`
        },
        radial_wakao_kaguei: {
            title: "径向反混系数 - Wakao-Kaguei模型",
        formula: `\\[ \\frac{1}{Pe_{rm}} = \\frac{0.7\\varepsilon_b}{Re\\cdot Sc} + 0.1 \\]
\\[ D_{rad} = \\frac{u_0 d_p}{Pe_{rm}} \\]`,
        parameters: [
            ["D_{rad}", "径向反混系数", "表征流体在固定床中径向混合的系数"],
            ["Pe_{rm}", "径向佩克列数", "径向流动条件下的特征无量纲数"],
            ["\\varepsilon_b", "床层空隙率", "固定床中流体所占体积分数"],
            ["Re", "雷诺数", "表征流动状态的无量纲数"],
            ["Sc", "施密特数", "动量扩散与质量扩散的比值"]
        ],
        theory: `<p><strong>Wakao-Kaguei模型</strong>是一个在传热和传质分析中广泛使用的经典模型。</p>
        <p>关键特点：</p>
        <ul>
                        <li>考虑了床层空隙率的影响</li>
            <li>适用于气固和液固系统</li>
            <li>结合了分子扩散和对流扩散的贡献</li>
                    </ul>
        <p>Wakao和Kaguei在1982年提出的这一模型至今仍在化工和环境工程中广泛应用。</p>`,
        applicability: `<div class="applicability-conditions">
<div class="condition-item">
    <span class="condition-icon">✓</span>
    <span class="condition-text">Reynolds数 (Re): 5 - 1000</span>
</div>
<div class="condition-item">
    <span class="condition-icon">✓</span>
    <span class="condition-text">主要适用于气固和液固系统</span>
</div>
<div class="condition-item">
    <span class="condition-icon">✓</span>
    <span class="condition-text">参考文献：Wakao, N., & Kaguei, S. (1982)</span>
</div>
                </div>`
        },
        radial_specchia: {
            title: "径向反混系数 - Specchia模型",
        formula: `\\[ \\frac{1}{Pe_{rm}} = \\frac{\\varepsilon_b}{10Re\\cdot Sc} + \\frac{1}{12} \\]
                        \\[ D_{rad} = \\frac{u_0 d_p}{Pe_{rm}} \\]
\\[ Sc = \\frac{\\mu}{\\rho D_m} \\]`,
        parameters: [
            ["D_{rad}", "径向反混系数", "表征流体在固定床中径向混合的系数"],
            ["Pe_{rm}", "径向佩克列数", "径向流动条件下的特征无量纲数"],
            ["\\varepsilon_b", "床层空隙率", "固定床中流体所占体积分数"],
            ["Re", "雷诺数", "表征流动状态的无量纲数"],
            ["Sc", "施密特数", "动量扩散与质量扩散的比值"],
            ["u_0", "流体表观速度", "通过固定床的流体表观速度"],
            ["d_p", "颗粒直径", "填充颗粒的特征尺寸"]
        ],
        theory: `<p><strong>Specchia模型</strong>提供了一种形式简单的径向弥散系数计算方法。</p>
        <p>关键特点：</p>
                    <ul>
                        <li>包含低流速下的分子扩散贡献</li>
                        <li>以Re和Sc为质量弥散基准</li>
                        <li>形式简单，易于应用</li>
                    </ul>
        <p>Specchia等人在1980年提出的这一模型因其简洁性而受到欢迎。</p>`,
        applicability: `<div class="applicability-conditions">
<div class="condition-item">
    <span class="condition-icon">✓</span>
    <span class="condition-text">管径比 (N = D/dp) > 10</span>
</div>
<div class="condition-item">
    <span class="condition-icon">✓</span>
    <span class="condition-text">适用于大尺寸固定床</span>
</div>
<div class="condition-item">
    <span class="condition-icon">✓</span>
    <span class="condition-text">参考文献：Specchia, V., et al. (1980)</span>
</div>
                </div>`
        }
    };

    const formulaReferences = {
        axial_standard: [
            { text: "Levenspiel, O. Chemical Reaction Engineering, axial dispersion and Peclet-number background.", url: "https://scholar.google.com/scholar?q=Levenspiel+Chemical+Reaction+Engineering+axial+dispersion+Peclet" }
        ],
        axial_edwards: [
            { text: "Edwards, M. F.; Richardson, J. F. (1968). Gas dispersion in packed beds. Chemical Engineering Science.", url: "https://scholar.google.com/scholar?q=Edwards+Richardson+1968+gas+dispersion+packed+beds" }
        ],
        axial_zehner: [
            { text: "Zehner, P.; Schlünder, E. U. Packed-bed dispersion/transport correlation source.", url: "https://scholar.google.com/scholar?q=Zehner+Schl%C3%BCnder+1970+packed+bed+dispersion" }
        ],
        axial_gunn: [
            { text: "Gunn, D. J. (1987). Axial and radial dispersion in fixed beds. Chemical Engineering Science.", url: "https://scholar.google.com/scholar?q=Gunn+1987+mixing+dispersion+packed+beds+Chemical+Engineering+Science" }
        ],
        radial_edwards: [
            { text: "Edwards, M. F.; Richardson, J. F. (1968). Packed-bed dispersion correlation source.", url: "https://scholar.google.com/scholar?q=Edwards+Richardson+1968+dispersion+packed+beds" }
        ],
        radial_zehner: [
            { text: "Zehner, P.; Schlünder, E. U. Packed-bed radial dispersion correlation source.", url: "https://scholar.google.com/scholar?q=Zehner+Schl%C3%BCnder+radial+dispersion+packed+beds" }
        ],
        radial_gunn: [
            { text: "Gunn, D. J. (1987). Mixing and dispersion in packed beds. Chemical Engineering Science.", url: "https://scholar.google.com/scholar?q=Gunn+1987+mixing+dispersion+packed+beds" }
        ],
        radial_lerou: [
            { text: "Lerou, J. J.; Wammes, W. J. A. Radial dispersion wall-effect correlation source.", url: "https://scholar.google.com/scholar?q=Lerou+Wammes+radial+dispersion+packed+beds" }
        ],
        radial_bauer: [
            { text: "Bauer, R. (1978). Radial dispersion in packed beds. Chemical Engineering Science.", url: "https://scholar.google.com/scholar?q=Bauer+1978+radial+dispersion+packed+beds+Chemical+Engineering+Science" }
        ],
        radial_wakao_kaguei: [
            { text: "Wakao, N.; Kaguei, S. (1982). Heat and Mass Transfer in Packed Beds.", url: "https://scholar.google.com/scholar?q=Wakao+Kaguei+Heat+and+Mass+Transfer+in+Packed+Beds+1982" }
        ],
        radial_specchia: [
            { text: "Specchia, V.; Baldi, G.; Sicardi, S. (1980). Radial transport in packed beds. Chemical Engineering Communications / related packed-bed transport work.", url: "https://scholar.google.com/scholar?q=Specchia+Baldi+Sicardi+1980+radial+dispersion+packed+beds" }
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

    // Event Listeners - 确保在这里直接设置事件监听器
    try {
        const calculateButton = document.getElementById('calculate-button');
        if (calculateButton) {
            console.log('找到计算按钮，添加事件监听器');
            calculateButton.addEventListener('click', function(e) {
                console.log('计算按钮被点击');
                try {
                    calculate();
                } catch (error) {
                    console.error('计算过程中发生错误:', error);
                    alert('计算过程中发生错误: ' + error.message);
                }
            });
        } else {
            console.error('未找到计算按钮元素');
        }
        
        const clearButton = document.getElementById('clear-button');
        if (clearButton) {
            clearButton.addEventListener('click', clearValues);
        }
        
        const resetButton = document.getElementById('reset-button');
        if (resetButton) {
            resetButton.addEventListener('click', resetValues);
        }
    } catch (error) {
        console.error('设置事件监听器时发生错误:', error);
    }
});
