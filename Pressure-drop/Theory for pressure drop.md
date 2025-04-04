# 固定床反应器压降理论文档

## 1. 简介

压降（Pressure Drop）是固定床反应器设计中的关键参数之一。它表示流体在通过填充床层时所产生的压力损失。在工业反应器设计中，压降直接影响能耗、设备尺寸和操作成本，对经济性和工艺安全性具有重要意义。

在固定床反应器中，流体（气体或液体）通过填充有固体颗粒的床层时，由于摩擦阻力、流道收缩、流向改变等因素，会产生压力损失。压降通常用符号 $\Delta P$ 表示，单位为 Pa 或 kPa。

压降的准确预测对于以下方面至关重要：

- 泵或鼓风机的设计与选型
- 床层高度和直径的确定
- 热量和物质传递效率的评估
- 流体分布均匀性的保证
- 设备经济性的评价

在工业应用中，压降越低通常意味着运行能耗越低，但这需要与传质传热效率之间进行平衡。

## 2. 压降的物理意义

在固定床反应器中，压降主要由以下因素引起：

1. **粘性摩擦损失**：流体与颗粒表面接触产生的摩擦阻力。这部分损失与流速成正比，在低雷诺数区域占主导地位，由Kozeny-Carman方程描述。

2. **惯性能量损失**：流体在不规则流道中流动时，由于方向变化和速度突变而产生的动能损失。这部分损失与流速的平方成正比，在高雷诺数区域占主导地位，由Burke-Plummer方程描述。

3. **壁面效应**：由于反应器壁面的存在，壁面附近的床层结构与中心区域不同，导致流体在壁面附近的流动特性发生变化。壁面效应的强度与管径与颗粒直径之比（*N*）密切相关，*N*值越小，壁面效应越显著。

4. **床层结构效应**：颗粒的形状、大小分布、填充方式以及空隙率分布等因素影响床层的结构，从而影响流体流动路径和压降。

压降的大小受到多种参数的影响，包括：

- **流体的性质**：密度（$\rho$）和动力粘度（$\mu$）是最主要的参数，直接影响雷诺数和摩擦阻力。
- **颗粒的特性**：直径（$d_p$）、形状（球形度）、表面粗糙度和颗粒尺寸分布都会影响压降。
- **床层结构**：空隙率（$\varepsilon$）是关键参数，空隙率越低，流道越窄，压降越大。填充方式（随机填充或有序排列）也会影响空隙率分布。
- **操作条件**：流体流速（$u_0$）是影响压降最直接的因素，温度和压力则通过影响流体物性间接影响压降。
- **反应器几何尺寸**：直径（$D$）、高度（$L$）以及管径与颗粒直径之比（$N = D/d_p$）是关键的几何参数。

在理论研究和工程实践中，通常采用无量纲的摩擦因子与雷诺数的关系来描述压降。不同的流动区域（如层流区、过渡区和湍流区）有不同的关联式。

## 3. 基本定义与关键参数

### 3.1 基本定义

**颗粒雷诺数**：描述流体通过颗粒床时的流动状态，是惯性力与粘性力的比值：

$$
Re_p = \frac{\rho u_0 d_p}{\mu} = \frac{d_p G}{\mu}
$$

其中，$G = \rho u_0$ 是质量流速，单位为 kg/(m²·s)。

**管径与颗粒直径之比**：描述壁面效应的强度，是反应器设计的关键参数：

$$
N = \frac{D}{d_p}
$$

**修正雷诺数**：考虑了颗粒间空隙的影响，是很多关联式中使用的无量纲数：

$$
Re_m = \frac{Re_p}{(1-\varepsilon)} = \frac{\rho u_0 d_p}{\mu(1-\varepsilon)}
$$

### 3.2 压降与摩擦因子的关系

压降可以通过摩擦因子（$f$）表示为：

$$
\Delta P = f \cdot \frac{L}{d_p} \cdot \frac{\rho u_0^2}{2}
$$

不同的关联式通常给出摩擦因子与雷诺数的关系，进而计算压降。

## 4. 计算器中实现的压降计算关联式

本计算器实现了以下五种主要的压降计算关联式，每种关联式适用于不同的条件和应用场景：

| 关联式名称 | 公式 | 主要特点 | 适用范围 | 发表年份 |
|------------|------|----------|----------|----------|
| Ergun方程 | $$\frac{\Delta P}{L} =  \frac{\rho u_0^2(1-\varepsilon)}{\varepsilon^3 d_p} \left[ \frac{150}{Re_m} + 1.75 \right]$$ | 结合层流和湍流效应的经典方程 | 适用于各种雷诺数范围 | 1952 |
| Eisfeld-Schnitzlein方程 | $$\frac{\Delta P}{L} =  \frac{\rho u_0^2(1-\varepsilon)}{\varepsilon^3 d_p} \left[ \frac{A}{Re_m} + B \right]$$ | 考虑壁面效应和颗粒形状的改进方程 | 适用于广泛的雷诺数和管径比范围 | 2001 |
| Dixon方程（无壁面效应） | $$\frac{\Delta P}{L} = \frac{\rho u_0^2(1-\varepsilon)}{\varepsilon^3 d_p} \left[ \frac{160}{Re_m} + \left(0.922 + \frac{16}{Re_m^{0.46}}\right)\frac{Re_m}{Re_m+52} \right]$$ | 针对球形颗粒的高精度关联式 | $Re_m$ 范围广泛，从0.01到500,000 | 2023 |
| Dixon方程（有壁面效应） | $$\frac{\Delta P}{L} = \frac{\rho u_0^2(1-\varepsilon)}{\varepsilon^3 d_p} \left[ \frac{160}{Re_m}\left(1 + \frac{2\alpha}{3(1-\varepsilon)N}\right)^2 + \left(0.922 + \frac{16}{Re_m^{0.46}}\right)\frac{Re_m}{Re_m+52} \right]$$ | 考虑壁面效应的最新关联式 | 适用于小管径反应器，$N$ 在5-25范围 | 2023 |
| KTA方程 | $$\frac{\Delta P}{L} = \frac{\rho u_0^2(1-\varepsilon)}{\varepsilon^3 d_p} \cdot \left( \frac{160}{Re_m} + \frac{3.0}{Re_m^{0.1}} \right)$$ | 核工业推荐的高精度关联式 | 适用于雷诺数1-100,000范围 | 1981 |

### 4.1 关联式中的特殊参数说明

**Eisfeld-Schnitzlein方程中的壁面效应和形状修正参数：**  

$A = K_1 \cdot A_w^2$，其中 $A_w = 1 + \frac{2}{3} \cdot \frac{d_p}{D(1-\varepsilon)}$ 是壁面效应修正因子  

$B = \frac{A_w}{B_w}$，其中 $B_w = (k_1 \cdot (\frac{d_p}{D})^2 + k_2)^2$ 是湍流贡献修正因子

这些参数随颗粒形状而变化，计算器中已内置不同形状的参数值。

**Dixon方程中的参数：** 

$Re_m = \frac{Re_p}{1-\varepsilon}$ 是修正雷诺数，考虑了空隙率的影响

Dixon方程（有壁面效应）中，$\alpha = 0.564$ 是描述壁面效应强度的系数，由大量实验数据拟合得到

**KTA方程中的参数：** 

$Re_m = \frac{\rho u_0 d_p}{\mu(1-\varepsilon)}$ 是修正雷诺数

湍流项中的指数0.1是通过对核工业中的实验数据拟合得到的，使该方程在高雷诺数区域具有更好的预测性能

### 4.2 符号说明

| 符号 | 名称 | 单位 |
|------|------|------|
| $\Delta P$ | 压降 | Pa |
| $L$ | 床层高度 | m |
| $\varepsilon$ | 床层空隙率 | 无量纲 |
| $\rho$ | 流体密度 | kg/m³ |
| $\mu$ | 流体动力粘度 | Pa·s |
| $u_0$ | 空管速度（表观流速） | m/s |
| $d_p$ | 颗粒直径 | m |
| $D$ | 反应器内径 | m |
| $G$ | 质量流速 | kg/(m²·s) |
| $Re_p$ | 颗粒雷诺数 | 无量纲 |
| $Re_m$ | 修正雷诺数 | 无量纲 |
| $N$ | 管径与颗粒直径之比 | 无量纲 |
| $K_1, k_1, k_2$ | 形状和壁面效应修正因子 | 无量纲 |
| $A_w, B_w$ | 壁面效应参数 | 无量纲 |
| $\alpha$ | 壁面效应修正参数 | 无量纲 |

## 5. 实现方程的详细说明

### 5.1 Ergun方程[^1]

Ergun方程是最经典、应用最广泛的固定床压降计算关联式，由Ergun于1952年提出。该方程结合了低雷诺数区域的层流效应和高雷诺数区域的湍流效应，适用于广泛的雷诺数范围。

$$
\frac{\Delta P}{L} =  \frac{\rho u_0^2(1-\varepsilon)}{\varepsilon^3 d_p} \left[ \frac{150}{Re_m} + 1.75 \right]
$$

- $Re_m = \frac{Re_p}{1-\varepsilon}$ 是修正雷诺数
- 其中第一项代表粘性能量损失（与流速呈线性关系），第二项代表惯性能量损失（与流速的平方成正比）。

**适用条件：**

- 适用于各种雷诺数范围
- 最适合于球形颗粒填充床

### 5.2 Eisfeld-Schnitzlein方程[^2]

Eisfeld和Schnitzlein在2001年提出了考虑壁面效应的改进方程，特别适用于管径与颗粒直径之比（*N*）较小的情况。在本计算器的实现中，该方程被修改为考虑不同颗粒形状的形式：

$$
\frac{\Delta P}{L} =  \frac{\rho u_0^2(1-\varepsilon)}{\varepsilon^3 d_p} \left[ \frac{A}{Re_m} + B \right]
$$

其中：

- $A = K_1 \cdot A_w^2$，$A_w = 1 + \frac{2}{3} \cdot \frac{d_p}{D(1-\varepsilon)}$
- $B = \frac{A_w}{B_w}$，$B_w = (k_1 \cdot (\frac{d_p}{D})^2 + k_2)^2$

针对不同形状的颗粒，系数取值不同：

- 球形：$K_1 = 154$，$k_1 = 1.15$，$k_2 = 0.87$
- 圆柱形：$K_1 = 190$，$k_1 = 2.00$，$k_2 = 0.77$
- 不规则形状：$K_1 = 155$，$k_1 = 1.42$，$k_2 = 0.83$

**适用条件：**

- 颗粒雷诺数 $0.01 ≤ Re_m ≤ 17635$
- 管径与颗粒直径之比 $1.624 ≤ N ≤ 250$
- 床层空隙率$0.330 ≤ \varepsilon ≤ 0.882$

### 5.3 Dixon方程（无壁面效应）[^3]

Dixon在2023年提出的方程：

$$
\frac{\Delta P}{L} = \frac{\rho u_0^2(1-\varepsilon)}{\varepsilon^3 d_p} \left[ \frac{160}{Re_m} + \left(0.922 + \frac{16}{Re_m^{0.46}}\right)\frac{Re_m}{Re_m+52} \right]
$$

其中：

- $Re_m = \frac{Re_p}{1-\varepsilon}$ 是修正雷诺数

**适用条件：**

- 修正雷诺数范围：$0.01 ≤ Re_m ≤ 500,000$
- 主要适用于球形颗粒

### 5.4 Dixon方程（有壁面效应）[^4]

Dixon在2023年提出了考虑壁面效应的方程：
$$
\frac{\Delta P}{L} = \frac{\rho u_0^2(1-\varepsilon)}{\varepsilon^3 d_p} \left[ \frac{160}{Re_m}\left(1 + \frac{2\alpha}{3(1-\varepsilon)N}\right)^2 + \left(0.922 + \frac{16}{Re_m^{0.46}}\right)\frac{Re_m}{Re_m+52} \right]
$$

其中：

- $Re_m = \frac{Re_p}{1-\varepsilon}$ 是修正雷诺数
- $N = \frac{D}{d_p}$ 是管径与颗粒直径之比
- $\alpha = 0.564$ 是描述壁面效应强度的系数

**适用条件：**

- 颗粒雷诺数 $100 ≤ Re_m ≤ 30,000$
- 管径与颗粒直径之比 $5 ≤ N ≤ 25$
- 考虑壁面效应，特别适合于管径较小的反应器

### 5.5 KTA方程[^5]

KTA方程是由德国核安全标准委员会(Kerntechnischer Ausschuss, KTA)推荐的固定床压降关联式，广泛应用于核工业中的颗粒床反应器设计。该方程的表达式为：

$$
\frac{\Delta P}{L} = \frac{\rho u_0^2(1-\varepsilon)}{\varepsilon^3 d_p} \cdot \left( \frac{160}{Re_m} + \frac{3.0}{Re_m^{0.1}} \right)
$$

其中：

- $Re_m = \frac{\rho u_0 d_p}{\mu(1-\varepsilon)}$ 是修正雷诺数

KTA方程中的第一项 $\frac{160}{Re_m}$ 代表层流贡献，与Ergun和Dixon方程类似，而第二项 $\frac{3.0}{Re_m^{0.1}}$ 采用了不同的指数关系来表示湍流贡献，使其在高雷诺数区域具有更好的预测性能。

**适用条件：**

- 修正雷诺数范围：$1 ≤ Re_m ≤ 100,000$
- 球形或近似球形颗粒
- 空隙率在0.36-0.42之间时预测最准确
- 没有考虑壁面效应

KTA方程的特点是结构简单，但预测精度高，尤其在工程应用中广受欢迎。其摩擦系数表达式考虑了从层流到湍流区域的平滑过渡，使该方程在各种操作条件下都能提供较为准确的压降预测。

## 参考文献

[^1]: Ergun S. Fluid flow through packed columns[J]. Chemical engineering progress, 1952, 48(2): 89.
[^2]: Eisfeld B, Schnitzlein K. The influence of confining walls on the pressure drop in packed beds[J]. Chemical engineering science, 2001, 56(14): 4321-4329.
[^3]: Dixon A G. General correlation for pressure drop through randomly‐packed beds of spheres with negligible wall effects[J]. AIChE Journal, 2023, 69(6): e18035.
[^4]: Dixon A G. Are there wall effects on pressure drop through randomly packed beds of spherical catalyst particles?[J]. AIChE Journal, 2024, 70(1): e18272.
[^5]: Zheng Y. Reactor core design of high-temperature gascooled reactors, Part 3: loss of pressure through friction in pebble bed cores[J]. KTA3102, 1981, 3.



