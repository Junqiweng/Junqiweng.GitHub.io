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
function generateResultsTable(D, L, roughness, u0, ρ, μ, tubeType, Re, results, additionalParams = {}) {
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
                    <td>管道内径</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(D)}</span>
                            <span class="value-unit">m</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>管道长度</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(L)}</span>
                            <span class="value-unit">m</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>管壁粗糙度</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(roughness)}</span>
                            <span class="value-unit">mm</span>
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
                    <td>管道类型</td>
                    <td class="value-column">${translateTubeType(tubeType)}</td>
                </tr>`;

    // 添加额外参数
    if (tubeType !== 'straight') {
        for (const key in additionalParams) {
            if (additionalParams.hasOwnProperty(key)) {
                output += `
                <tr>
                    <td>${paramNameMapping[key] || key}</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(additionalParams[key])}</span>
                            <span class="value-unit">${getUnitForParam(key)}</span>
                        </div>
                    </td>
                </tr>`;
            }
        }
    }

    output += `
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
                    <td>流体流动状态</td>
                    <td class="value-column">${getFlowRegime(Re)}</td>
                </tr>
                <tr>
                    <td>相对粗糙度 (ε/D)</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(roughness/1000/D)}</span>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="result-card pressure-drop-card">
            <div class="section-header">
                <span class="section-icon">📊</span>
                <span class="section-title">压降计算结果</span>
            </div>
            <table class="results-table">
                <tr>
                    <th>计算方法</th>
                    <th>压降值 (Pa)</th>
                </tr>`;
    
    // 总压降值变量
    let totalPressureDrop = 0;
    
    for (const method in results) {
        if (results.hasOwnProperty(method)) {
            const methodName = getMethodName(method);
            
            if (method === 'darcy_weisbach') {
                const { deltaP, f, formulaType } = results[method];
                totalPressureDrop += deltaP;
                
                output += `
                <tr>
                    <td>${methodName}</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(deltaP)}</span>
                            <span class="value-unit">Pa</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>摩擦因子 (f)</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(f)}</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>使用计算公式</td>
                    <td class="value-column">
                        <div class="formula-tooltip" data-tooltip="${getFormulaDescription(formulaType)}">
                            ${getFormulaTypeName(formulaType)}
                            <span class="hover-indicator">i</span>
                        </div>
                    </td>
                </tr>`;
            } else if (method === 'local_loss') {
                totalPressureDrop += results[method];
                
                output += `
                <tr>
                    <td>${methodName}</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(results[method])}</span>
                            <span class="value-unit">Pa</span>
                        </div>
                    </td>
                </tr>`;
            } else {
                totalPressureDrop += results[method];
                
                output += `
                <tr>
                    <td>${methodName}</td>
                    <td class="value-column">
                        <div class="value-with-unit">
                            <span class="value-number">${formatNumber(results[method])}</span>
                            <span class="value-unit">Pa</span>
                        </div>
                    </td>
                </tr>`;
            }
        }
    }
    
    // 如果同时计算了沿程和局部损失，则显示总压降
    if (results.hasOwnProperty('darcy_weisbach') && results.hasOwnProperty('local_loss')) {
        output += `
        <tr class="total-row">
            <td>总压降</td>
            <td class="value-column">
                <div class="value-with-unit">
                    <span class="value-number">${formatNumber(totalPressureDrop)}</span>
                    <span class="value-unit">Pa</span>
                </div>
            </td>
        </tr>`;
    }
    
    output += `
            </table>
        </div>
    </div>`;

    return output;
}

// 翻译管道类型
function translateTubeType(type) {
    const types = {
        'straight': '直管',
        'elbow': '弯头',
        'contraction': '收缩段',
        'expansion': '扩张段'
    };
    return types[type] || type;
}

// 获取流动状态
function getFlowRegime(Re) {
    if (Re < 2300) {
        return '层流 (Re < 2300)';
    } else if (Re >= 2300 && Re < 4000) {
        return '过渡流 (2300 ≤ Re < 4000)';
    } else {
        return '湍流 (Re ≥ 4000)';
    }
}

// 获取方法名称翻译
function getMethodName(method) {
    const methods = {
        'darcy_weisbach': 'Darcy-Weisbach 方程',
        'local_loss': '局部损失计算'
    };
    return methods[method] || method;
}

// 参数名称映射
const paramNameMapping = {
    'angle': '弯头角度',
    'radius': '弯曲半径',
    'diameter_ratio': '直径比',
    'inlet_diameter': '入口直径',
    'outlet_diameter': '出口直径'
};

// 获取参数单位
function getUnitForParam(param) {
    const units = {
        'angle': '°',
        'radius': 'm',
        'diameter_ratio': '',
        'inlet_diameter': 'm',
        'outlet_diameter': 'm'
    };
    return units[param] || '';
}

// 1. Darcy-Weisbach方程计算压降
function calculateDarcyWeisbach(D, L, roughness, u0, ρ, μ, f) {
    // 如果没有提供摩擦因子，则计算摩擦因子
    let formulaType = '';
    if (!f) {
        const result = calculateFrictionFactor(D, roughness, u0, ρ, μ);
        f = result.f;
        formulaType = result.formulaType;
    }
    
    // 压降计算: ΔP = f * (L/D) * (ρ*u0²/2)
    const deltaP = f * (L/D) * (ρ * Math.pow(u0, 2) / 2);
    return { deltaP, f, formulaType };
}

// 2. 计算摩擦因子(针对各种流动状态)
function calculateFrictionFactor(D, roughness, u0, ρ, μ) {
    // 转换粗糙度单位从mm到m
    const roughnessM = roughness / 1000;
    
    // 计算雷诺数 Re = ρ*u0*D/μ
    const Re = ρ * u0 * D / μ;
    
    // 相对粗糙度
    const relRoughness = roughnessM / D;
    
    let f;
    let formulaType = '';
    
    // 1. 层流情况下使用标准公式
    if (Re < 2300) {
        f = 64 / Re;
        formulaType = 'laminar';
    } 
    // 2. 过渡流区域 (2300 ≤ Re < 4000)
    else if (Re >= 2300 && Re < 4000) {
        // 使用插值法估算过渡区域的摩擦因子
        // 在Re=2300处使用层流公式，在Re=4000处使用湍流公式
        const f_laminar = 64 / 2300;
        
        // 在Re=4000处使用Colebrook-White计算湍流摩擦因子
        let f_turbulent = 0.02;  // 初始猜测值
        const maxIterations = 50;
        const tolerance = 1e-6;
        let error = 1;
        let iteration = 0;
        
        while (error > tolerance && iteration < maxIterations) {
            const fNew = 1 / Math.pow(
                -2 * Math.log10(relRoughness/3.7 + 2.51/(4000 * Math.sqrt(f_turbulent))), 
                2
            );
            error = Math.abs(f_turbulent - fNew);
            f_turbulent = fNew;
            iteration++;
        }
        
        // 线性插值
        const x = (Re - 2300) / (4000 - 2300);
        f = f_laminar * (1 - x) + f_turbulent * x;
        formulaType = 'transition';
    } 
    // 3. 湍流区域 (Re ≥ 4000)
    else {
        // 湍流区域细分处理
        // 3.1 对于光滑管道且Re相对较小的情况，使用Blasius公式
        if (relRoughness < 0.00001 && Re < 100000) {
            f = 0.316 / Math.pow(Re, 0.25);
            formulaType = 'blasius';
        } 
        // 3.2 对于高雷诺数和高相对粗糙度，使用完全粗糙区域公式
        else if (Re > 4000000 || (Re > 500000 && relRoughness > 0.01)) {
            f = Math.pow(2 * Math.log10(3.7 / relRoughness), -2);
            formulaType = 'fully_rough';
        }
        // 3.3 一般情况下使用Colebrook-White公式（迭代求解）
        else {
            // 初始猜测值 - 使用Swamee-Jain方程提供更好的初始值
            f = Math.pow(0.25 / (Math.log10(relRoughness/3.7 + 5.74/Math.pow(Re, 0.9))), 2);
            
            // 迭代求解 Colebrook-White 方程
            const maxIterations = 50;
            const tolerance = 1e-6;
            let error = 1;
            let iteration = 0;
            
            while (error > tolerance && iteration < maxIterations) {
                // Colebrook-White方程
                const fNew = 1 / Math.pow(
                    -2 * Math.log10(relRoughness/3.7 + 2.51/(Re * Math.sqrt(f))), 
                    2
                );
                
                error = Math.abs(f - fNew);
                f = fNew;
                iteration++;
            }
            formulaType = 'colebrook_white';
        }
    }
    
    return { f, formulaType };
}

// 4. 计算局部损失
function calculateLocalLoss(D, u0, ρ, tubeType, additionalParams) {
    // 局部损失系数K取决于管道类型
    let K;
    
    switch(tubeType) {
        case 'elbow':
            // 弯头损失，K与弯头角度和弯曲半径/直径比有关
            const angle = additionalParams.angle;
            const r = additionalParams.radius;
            const r_D_ratio = r / D;
            
            // 根据角度和r/D比例计算K值 - 使用更精确的插值公式
            if (angle === 90) {
                // 90度弯头的K值表
                const r_D_values = [1, 2, 4, 6, 10, 15, 20];
                const K_values = [1.2, 0.9, 0.75, 0.6, 0.5, 0.42, 0.4];
                
                // 找到适当的插值区间
                if (r_D_ratio <= r_D_values[0]) {
                    K = K_values[0];
                } else if (r_D_ratio >= r_D_values[r_D_values.length - 1]) {
                    K = K_values[K_values.length - 1];
                } else {
                    // 线性插值
                    for (let i = 0; i < r_D_values.length - 1; i++) {
                        if (r_D_ratio >= r_D_values[i] && r_D_ratio <= r_D_values[i + 1]) {
                            const x = (r_D_ratio - r_D_values[i]) / (r_D_values[i + 1] - r_D_values[i]);
                            K = K_values[i] * (1 - x) + K_values[i + 1] * x;
                            break;
                        }
                    }
                }
            } else {
                // 非90度弯头 - 使用角度比例修正
                let K_90deg;
                
                // 先获取相同r/D比下的90度弯头K值
                if (r_D_ratio < 1) K_90deg = 1.2;
                else if (r_D_ratio < 2) K_90deg = 0.9;
                else if (r_D_ratio < 4) K_90deg = 0.75;
                else if (r_D_ratio < 6) K_90deg = 0.6;
                else if (r_D_ratio < 10) K_90deg = 0.5;
                else if (r_D_ratio < 15) K_90deg = 0.42;
                else K_90deg = 0.4;
                
                // 修正系数 - 角度的非线性影响
                const angleRatio = Math.pow(angle / 90, 0.8);  // 非线性缩放
                K = K_90deg * angleRatio;
            }
            break;
            
        case 'contraction':
            // 收缩段损失
            const d1 = additionalParams.inlet_diameter;
            const d2 = additionalParams.outlet_diameter;
            const area_ratio = Math.pow(d2/d1, 2);
            
            // 改进的K值计算
            // K = 0.5 * (1 - area_ratio) 是理想突然收缩的近似
            // 实际K值还与雷诺数和收缩形状有关
            if (area_ratio < 0.1) {
                K = 0.5 * (1 - area_ratio) + 0.05;  // 小面积比时的修正
            } else if (area_ratio < 0.4) {
                K = 0.5 * (1 - area_ratio);
            } else {
                // 大面积比时的非线性效应
                K = 0.5 * (1 - area_ratio) * (1 + 0.15 * (area_ratio - 0.4));
            }
            break;
            
        case 'expansion':
            // 扩张段损失
            const d_in = additionalParams.inlet_diameter;
            const d_out = additionalParams.outlet_diameter;
            const area_ratio_exp = Math.pow(d_in/d_out, 2);
            
            // 标准扩张损失公式
            K = Math.pow(1 - area_ratio_exp, 2);
            break;
            
        default:
            // 直管没有局部损失
            K = 0;
    }
    
    // 局部损失压降计算: ΔP = K * (ρ*u0²/2)
    const deltaP = K * (ρ * Math.pow(u0, 2) / 2);
    return deltaP;
}

// 计算雷诺数
function calculateReynolds(D, u0, ρ, μ) {
    return ρ * u0 * D / μ;
}

// 主计算函数
function performCalculations() {
    try {
        // 获取DOM元素
        const resultContent = document.getElementById('result-content-area');
        
        // 获取输入参数
        const D = parseFloat(document.getElementById('tube_diameter').value);
        const L = parseFloat(document.getElementById('tube_length').value);
        const roughness = parseFloat(document.getElementById('roughness').value);
        const u0 = parseFloat(document.getElementById('fluid_velocity').value);
        const ρ = parseFloat(document.getElementById('fluid_density').value);
        const μ = parseFloat(document.getElementById('fluid_viscosity').value);
        const tubeType = document.getElementById('tube_type').value;
        
        // 检查输入值是否有效
        if (D <= 0 || L <= 0 || roughness < 0 || u0 <= 0 || ρ <= 0 || μ <= 0) {
            throw new Error('请输入有效的正数值');
        }
        
        // 获取额外参数
        let additionalParams = {};
        if (tubeType === 'elbow') {
            additionalParams.angle = parseFloat(document.getElementById('angle').value);
            additionalParams.radius = parseFloat(document.getElementById('radius').value);
            
            if (additionalParams.angle <= 0 || additionalParams.angle > 180 || additionalParams.radius <= 0) {
                throw new Error('请输入有效的弯头参数');
            }
        } else if (tubeType === 'contraction' || tubeType === 'expansion') {
            additionalParams.inlet_diameter = parseFloat(document.getElementById('inlet_diameter').value);
            additionalParams.outlet_diameter = parseFloat(document.getElementById('outlet_diameter').value);
            
            if (additionalParams.inlet_diameter <= 0 || additionalParams.outlet_diameter <= 0) {
                throw new Error('请输入有效的直径值');
            }
            
            if (tubeType === 'contraction' && additionalParams.inlet_diameter <= additionalParams.outlet_diameter) {
                throw new Error('收缩段入口直径必须大于出口直径');
            }
            
            if (tubeType === 'expansion' && additionalParams.inlet_diameter >= additionalParams.outlet_diameter) {
                throw new Error('扩张段入口直径必须小于出口直径');
            }
        }
        
        // 计算雷诺数
        const Re = calculateReynolds(D, u0, ρ, μ);
        
        // 根据选择的方程进行计算
        const results = {};
        
        // 检查选择的计算方法
        if (document.getElementById('darcy_weisbach').checked) {
            const frictionResult = calculateFrictionFactor(D, roughness, u0, ρ, μ);
            const darcyResult = calculateDarcyWeisbach(D, L, roughness, u0, ρ, μ, frictionResult.f);
            results.darcy_weisbach = {
                deltaP: darcyResult.deltaP,
                f: frictionResult.f,
                formulaType: frictionResult.formulaType
            };
        }
        
        if (document.getElementById('local_loss').checked && tubeType !== 'straight') {
            results.local_loss = calculateLocalLoss(D, u0, ρ, tubeType, additionalParams);
        }
        
        // 生成结果表格
        const resultsHTML = generateResultsTable(D, L, roughness, u0, ρ, μ, tubeType, Re, results, additionalParams);
        resultContent.innerHTML = resultsHTML;
        
        // 切换到结果标签
        document.querySelector('.tab-btn[data-tab="results"]').click();
        
        // 重新渲染数学公式
        if (window.MathJax) {
            MathJax.typesetPromise()
                .then(() => {
                    console.log('Typeset completed');
                })
                .catch((err) => console.log('Typeset failed: ' + err.message));
        }
        
    } catch (error) {
        alert(`计算错误: ${error.message}`);
    }
}

// Document Ready Function
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const calculateBtn = document.getElementById('calculate');
    const clearBtn = document.getElementById('clear');
    const resetBtn = document.getElementById('reset');
    const resultContent = document.getElementById('result-content-area');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const tubeTypeSelect = document.getElementById('tube_type');
    const additionalParamsDiv = document.getElementById('additional_params');
    const formulaLinks = document.querySelectorAll('.equation-info');
    const formulaModal = document.getElementById('formulaModal');
    const modalClose = document.querySelector('.modal-close');
    const formulaDetail = document.getElementById('formulaDetail');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // Tab switching functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });

    // 管道类型变化时更新附加参数
    tubeTypeSelect.addEventListener('change', updateAdditionalParams);
    
    // 初始化附加参数区域
    function updateAdditionalParams() {
        const tubeType = tubeTypeSelect.value;
        additionalParamsDiv.innerHTML = '';
        
        if (tubeType === 'elbow') {
            // 弯头参数
            additionalParamsDiv.innerHTML = `
                <div class="input-group">
                    <label class="tooltip" data-tooltip="弯头角度">🔹 弯头角度 (°):</label>
                    <input type="number" id="angle" value="90" min="0" max="180" required>
                </div>
                <div class="input-group">
                    <label class="tooltip" data-tooltip="弯曲半径">🔹 弯曲半径 (m):</label>
                    <input type="number" id="radius" value="0.05" min="0" required>
                </div>
            `;
        } else if (tubeType === 'contraction' || tubeType === 'expansion') {
            // 收缩/扩张参数
            const defaultText = tubeType === 'contraction' ? '收缩段' : '扩张段';
            additionalParamsDiv.innerHTML = `
                <div class="input-group">
                    <label class="tooltip" data-tooltip="入口直径">🔹 入口直径 (m):</label>
                    <input type="number" id="inlet_diameter" value="${tubeType === 'contraction' ? 0.05 : 0.025}" min="0" required>
                </div>
                <div class="input-group">
                    <label class="tooltip" data-tooltip="出口直径">🔹 出口直径 (m):</label>
                    <input type="number" id="outlet_diameter" value="${tubeType === 'contraction' ? 0.025 : 0.05}" min="0" required>
                </div>
            `;
        }
    }
    
    // 初始化附加参数区域
    updateAdditionalParams();

    // 计算按钮点击事件
    calculateBtn.addEventListener('click', performCalculations);
    
    // 清除按钮点击事件
    clearBtn.addEventListener('click', function() {
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.value = '';
        });
    });
    
    // 重置按钮点击事件
    resetBtn.addEventListener('click', function() {
        document.getElementById('tube_diameter').value = '0.025';
        document.getElementById('tube_length').value = '1';
        document.getElementById('roughness').value = '0.045';
        document.getElementById('fluid_velocity').value = '1';
        document.getElementById('fluid_density').value = '1.225';
        document.getElementById('fluid_viscosity').value = '1.81e-5';
        document.getElementById('tube_type').value = 'straight';
        updateAdditionalParams();
    });
    
    // 公式信息链接点击事件
    formulaLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const formula = this.dataset.formula;
            showFormulaDetails(formula);
        });
    });
    
    // 关闭模态框
    modalClose.addEventListener('click', function() {
        formulaModal.style.display = 'none';
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === formulaModal) {
            formulaModal.style.display = 'none';
        }
    });
    
    // 隐藏加载指示器
    window.addEventListener('load', function() {
        loadingOverlay.classList.remove('show');
    });
    
    // 显示公式详情
    async function showFormulaDetails(formulaId) {
        // 设置公式详情内容
        let formulaContent = '';
        
        switch(formulaId) {
            case 'darcy_weisbach':
                formulaContent = `
                    <div class="formula-header">
                        <div class="formula-icon">📘</div>
                        <h3>Darcy-Weisbach方程</h3>
                    </div>
                    <div class="formula-description">
                        <p>Darcy-Weisbach方程是计算管道中流体压降的基础公式，适用于任何流体和流动状态：</p>
                    </div>
                    <div class="formula-box">
                        <div class="formula">
                            $$\\Delta P = f \\cdot \\frac{L}{D} \\cdot \\frac{\\rho \\cdot v^2}{2}$$
                        </div>
                    </div>
                    <div class="parameter-section">
                        <h4>参数说明</h4>
                        <ul class="parameter-list">
                            <li><span class="param-symbol">$\\Delta P$</span> <span class="param-description">压力损失 (Pa)</span></li>
                            <li><span class="param-symbol">$f$</span> <span class="param-description">Darcy摩擦因子 (无量纲)</span></li>
                            <li><span class="param-symbol">$L$</span> <span class="param-description">管道长度 (m)</span></li>
                            <li><span class="param-symbol">$D$</span> <span class="param-description">管道内径 (m)</span></li>
                            <li><span class="param-symbol">$\\rho$</span> <span class="param-description">流体密度 (kg/m³)</span></li>
                            <li><span class="param-symbol">$v$</span> <span class="param-description">流体速度 (m/s)</span></li>
                        </ul>
                    </div>
                    <div class="application-section">
                        <h4>摩擦因子计算方法</h4>
                        <div class="method-card">
                            <div class="method-header">层流条件 (Re < 2300)</div>
                            <div class="formula-box">
                                <div class="formula">
                                    $$f = \\frac{64}{Re}$$
                                </div>
                            </div>
                        </div>
                        <div class="method-card">
                            <div class="method-header">过渡流条件 (2300 ≤ Re < 4000)</div>
                            <p>在过渡区域，摩擦因子没有精确公式，本计算器采用线性插值方法：</p>
                            <div class="formula-box">
                                <div class="formula">
                                    $$f = f_{层流} \\cdot (1 - x) + f_{湍流} \\cdot x, \\quad x = \\frac{Re - 2300}{4000 - 2300}$$
                                </div>
                            </div>
                            <p>其中$f_{层流}$在Re=2300时使用层流公式计算，$f_{湍流}$在Re=4000时使用Colebrook-White方程计算。</p>
                        </div>
                        <div class="method-card">
                            <div class="method-header">湍流条件 (Re ≥ 4000)</div>
                            <p>湍流状态下，根据不同的条件采用不同的计算方法：</p>
                            
                            <div class="sub-method">
                                <div class="method-header">1. 光滑管道且Re较小 (相对粗糙度 < 0.00001 且 Re < 100,000)</div>
                                <div class="formula-box">
                                    <div class="formula">
                                        $$f = \\frac{0.316}{Re^{0.25}}$$
                                    </div>
                                </div>
                                <p>这是Blasius公式，适用于相对光滑的管道和中等雷诺数。</p>
                            </div>
                            
                            <div class="sub-method">
                                <div class="method-header">2. 完全粗糙区域 (Re > 4,000,000 或 Re > 500,000 且相对粗糙度 > 0.01)</div>
                                <div class="formula-box">
                                    <div class="formula">
                                        $$f = \\left( 2\\log_{10}\\frac{D}{\\varepsilon} + 1.14 \\right)^{-2} = \\left( 2\\log_{10}\\frac{3.7}{\\varepsilon/D} \\right)^{-2}$$
                                    </div>
                                </div>
                                <p>在完全粗糙流动区域，摩擦因子主要由相对粗糙度决定，几乎不受雷诺数影响。</p>
                            </div>
                            
                            <div class="sub-method">
                                <div class="method-header">3. 一般湍流条件 (其他所有湍流情况)</div>
                                <div class="formula-box">
                                    <div class="formula">
                                        $$\\frac{1}{\\sqrt{f}} = -2\\log_{10}\\left(\\frac{\\varepsilon/D}{3.7} + \\frac{2.51}{Re\\sqrt{f}}\\right)$$
                                    </div>
                                </div>
                                <p>这是Colebrook-White方程，需要通过迭代求解。计算器首先使用Swamee-Jain近似公式获得初始值：</p>
                                <div class="formula-box">
                                    <div class="formula">
                                        $$f_{初始} = \\left(0.25 / \\log_{10}\\left(\\frac{\\varepsilon/D}{3.7} + \\frac{5.74}{Re^{0.9}}\\right)\\right)^2$$
                                    </div>
                                </div>
                                <p>然后通过迭代计算收敛到满足精度要求的摩擦因子值。</p>
                            </div>
                        </div>
                    </div>
                    <div class="note-section">
                        <div class="note-box">
                            <p><strong>注意：</strong>输入的管道粗糙度单位为毫米(mm)，计算中会自动转换为米(m)进行计算。</p>
                        </div>
                    </div>
                `;
                break;
                
            case 'local_loss':
                formulaContent = `
                    <div class="formula-header">
                        <div class="formula-icon">📙</div>
                        <h3>局部损失计算</h3>
                    </div>
                    <div class="formula-description">
                        <p>管道系统中，除了沿程损失外，局部构件（弯头、阀门、收缩扩张等）也会产生额外的压降，称为局部损失：</p>
                    </div>
                    <div class="formula-box">
                        <div class="formula">
                            $$\\Delta P_{局部} = K \\cdot \\frac{\\rho \\cdot v^2}{2}$$
                        </div>
                    </div>
                    <div class="parameter-section">
                        <h4>参数说明</h4>
                        <ul class="parameter-list">
                            <li><span class="param-symbol">$\\Delta P_{局部}$</span> <span class="param-description">局部压力损失 (Pa)</span></li>
                            <li><span class="param-symbol">$K$</span> <span class="param-description">局部损失系数 (无量纲)</span></li>
                            <li><span class="param-symbol">$\\rho$</span> <span class="param-description">流体密度 (kg/m³)</span></li>
                            <li><span class="param-symbol">$v$</span> <span class="param-description">流体速度 (m/s)</span></li>
                        </ul>
                    </div>
                    <div class="application-section">
                        <h4>总压降计算</h4>
                        <div class="formula-box">
                            $$\\Delta P_{总} = \\Delta P_{沿程} + \\Delta P_{局部} = f \\cdot \\frac{L}{D} \\cdot \\frac{\\rho \\cdot v^2}{2} + K \\cdot \\frac{\\rho \\cdot v^2}{2}$$
                        </div>
                        
                        <h4>常见局部构件的K值</h4>
                        <div class="method-card">
                            <div class="method-header">弯头的K值</div>
                            <div class="table-container">
                                <table class="formula-table">
                                    <thead>
                                        <tr>
                                            <th>弯头类型</th>
                                            <th>K值范围</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>90°弯头(r/D = 1)</td>
                                            <td>0.9-1.2</td>
                                        </tr>
                                        <tr>
                                            <td>90°弯头(r/D = 2)</td>
                                            <td>0.75-0.9</td>
                                        </tr>
                                        <tr>
                                            <td>90°弯头(r/D = 4)</td>
                                            <td>0.4-0.6</td>
                                        </tr>
                                        <tr>
                                            <td>45°弯头</td>
                                            <td>0.2-0.4</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="method-card">
                            <div class="method-header">突然收缩的K值</div>
                            <div class="formula-box">
                                <div class="formula">
                                    $$K \\approx 0.5 \\cdot \\left(1 - \\frac{A_2}{A_1}\\right) = 0.5 \\cdot \\left(1 - \\left(\\frac{D_2}{D_1}\\right)^2\\right)$$
                                </div>
                            </div>
                            <p>其中$A_1$和$D_1$是大直径段的截面积和直径，$A_2$和$D_2$是小直径段的截面积和直径。</p>
                        </div>
                        <div class="method-card">
                            <div class="method-header">突然扩张的K值</div>
                            <div class="formula-box">
                                <div class="formula">
                                    $$K \\approx \\left(1 - \\frac{A_1}{A_2}\\right)^2 = \\left(1 - \\left(\\frac{D_1}{D_2}\\right)^2\\right)^2$$
                                </div>
                            </div>
                            <p>其中$A_1$和$D_1$是小直径段的截面积和直径，$A_2$和$D_2$是大直径段的截面积和直径。</p>
                        </div>
                        <div class="method-card">
                            <div class="method-header">逐渐收缩/扩张的K值</div>
                            <p>取决于收缩/扩张角度，通常比突然收缩/扩张的K值小很多。</p>
                        </div>
                        <div class="method-card">
                            <div class="method-header">其他常见装置的典型K值</div>
                            <ul class="pipe-fixture-list">
                                <li><span class="fixture-name">全开闸阀:</span> <span class="k-value">K ≈ 0.2</span></li>
                                <li><span class="fixture-name">全开球阀:</span> <span class="k-value">K ≈ 0.1</span></li>
                                <li><span class="fixture-name">全开蝶阀:</span> <span class="k-value">K ≈ 0.3</span></li>
                                <li><span class="fixture-name">管道入口(锐边):</span> <span class="k-value">K ≈ 0.5</span></li>
                                <li><span class="fixture-name">管道出口:</span> <span class="k-value">K ≈ 1.0</span></li>
                            </ul>
                        </div>
                    </div>
                `;
                break;
        }
        
        formulaDetail.innerHTML = formulaContent;
        formulaModal.style.display = 'block';
        
        // 渲染数学公式
        if (window.MathJax) {
            try {
                await MathJax.typesetPromise([formulaDetail]);
                console.log('Modal formula typeset completed');
            } catch (err) {
                console.log('Modal formula typeset failed: ' + err.message);
            }
        }
    }
});

// 获取公式类型名称的翻译
function getFormulaTypeName(type) {
    const types = {
        'laminar': '层流公式',
        'transition': '过渡流线性插值',
        'blasius': 'Blasius公式',
        'fully_rough': '完全粗糙流公式',
        'colebrook_white': 'Colebrook-White方程'
    };
    return types[type] || '未知公式';
}

// 获取公式类型的详细说明
function getFormulaDescription(type) {
    const descriptions = {
        'laminar': '层流条件下计算：\nf = 64/Re\n\n适用于Re < 2300的低速流动状态。',
        'transition': '过渡流区域(2300 ≤ Re < 4000)使用线性插值：\nf = f层流·(1-x) + f湍流·x\n\n其中x = (Re-2300)/(4000-2300)，f层流在Re=2300处使用层流公式计算，f湍流在Re=4000处使用Colebrook-White方程计算。',
        'blasius': 'Blasius公式用于光滑管道湍流：\nf = 0.316/Re^0.25\n\n适用条件：相对粗糙度 < 0.00001且Re < 100,000',
        'fully_rough': '完全粗糙流区域公式：\nf = (2log₁₀(3.7/ε/D))^(-2)\n\n适用条件：Re > 4,000,000或(Re > 500,000且相对粗糙度 > 0.01)',
        'colebrook_white': 'Colebrook-White方程（一般湍流条件）：\n1/√f = -2log₁₀(ε/D/3.7 + 2.51/(Re·√f))\n\n通过迭代求解，适用于大多数湍流条件。'
    };
    return descriptions[type] || '未知计算公式';
} 