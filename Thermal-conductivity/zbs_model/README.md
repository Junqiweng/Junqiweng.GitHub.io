# Zehner-Bauer-Schlünder (ZBS) 热导率模型

这个项目实现了Zehner-Bauer-Schlünder模型(ZBS)，用于计算多孔介质中的有效热导率。

## 模型介绍

ZBS模型是一种用于计算颗粒床层热传导的综合模型，考虑了以下热传递机制：
- 流体传热
- 固体传热
- 辐射传热
- Knudsen效应(气体分子自由程)

模型基于以下公式：

```
k_eff/k_f = (1 - √(1 - ε))ε[(ε - 1 + 1/k_G)^(-1) + k_r] + √(1 - ε)[φk_c + (1 - φ)k_s/k_f]
```

其中：
- k_eff：有效热导率
- k_f：流体热导率
- k_s：固体热导率
- ε：孔隙率
- k_G：气体导热系数(考虑Knudsen效应)
- k_r：辐射系数
- k_c：形态导热系数
- φ：形状因子

## 使用方法

### 安装依赖
```bash
pip install numpy matplotlib
```

### 基本使用
```python
from zbs_thermal_conductivity import calculate_zbs_effective_thermal_conductivity

# 计算有效热导率
k_eff = calculate_zbs_effective_thermal_conductivity(
    k_f=0.026,       # 流体热导率 (W/(m·K))
    k_s=10.0,        # 固体热导率 (W/(m·K))
    epsilon=0.4,     # 孔隙率
    d_p=0.003,       # 颗粒直径 (m)
    T=300,           # 温度 (K)
    P=101325,        # 压力 (Pa)
    M_g=0.029,       # 气体摩尔质量 (kg/mol)
    C_p=1005,        # 气体比热容 (J/(kg·K))
    epsilon_r=0.9,   # 辐射发射率
    phi=0.9          # 形状因子
)

print(f"有效热导率: {k_eff} W/(m·K)")
```

### 绘制曲线
```python
import numpy as np
import matplotlib.pyplot as plt
from zbs_thermal_conductivity import plot_effective_conductivity

# 不同流体热导率下的有效热导率曲线
k_f_range = np.linspace(0.01, 0.1, 100)
plot_effective_conductivity(
    k_f_values=k_f_range,
    k_s=10.0,        # 固体热导率 (W/(m·K))
    epsilon=0.4,
    d_p=0.003,
    T=300,
    P=101325,
    M_g=0.029,
    C_p=1005
)
plt.savefig('zbs_effective_conductivity.png')
plt.show()
```

### 参数敏感性分析
```python
from example import compare_parameters_effect

# 运行参数敏感性分析
compare_parameters_effect()
```

## 参考文献
- Zehner, P., & Schlünder, E. U. (1970). Wärmeleitfähigkeit von Schüttungen bei mäßigen Temperaturen. Chemie Ingenieur Technik, 42(14), 933-941.
- Bauer, R. (1978). Effective radial thermal conductivity of gas-permeated packed beds containing particles of different shapes and sizes. VDI-Forschungsheft, 582, 39-46. 