---

---

# 固定床反应器壁面传热系数理论文档

## 1. 简介

壁面传热系数（Wall Heat Transfer Coefficient）是固定床反应器设计中的关键参数之一，它表征了反应器壁面与床层之间的热量传递能力。在工业反应器中，壁面传热系数直接影响反应器的温度控制、热效率以及反应结果，特别是对于强放热或强吸热反应尤为重要。

壁面传热系数通常用符号 $h_w$ 表示，单位为 W/(m²·K)，它定义了单位面积、单位温差条件下，从反应器壁面到床层（或从床层到壁面）的热量传递速率。

## 2. 壁面传热系数的物理意义

在固定床反应器中，整体热量传递可分为以下几个阶段：

1. 流体与颗粒之间的对流传热
2. 颗粒内部的导热传热
3. 颗粒与颗粒之间的导热、辐射传热
4. **流体与壁面之间的对流传热（壁面传热）**

壁面传热系数主要描述第4项，即流体与反应器壁面之间的热量传递能力。它受到多种因素的影响，包括：

- 流体流速（或雷诺数）
- 填充颗粒的直径
- 反应器直径
- 流体的物理性质（密度、粘度、热容、导热系数等）
- 床层结构（空隙率、填充方式等）

## 3. 壁面传热系数计算公式汇总

### 3.1 基本定义

壁面传热系数无量纲表示（壁面努塞尔数）：

$$
Nu_w = \frac{h_w d_p}{k_f}
$$

粒子雷诺数：

$$
Re_p = \frac{d_p G}{\mu} = \frac{\rho u_0 d_p}{\mu}
$$

普朗特数：

$$
Pr = \frac{\mu C_p}{k_f}
$$

### 3.2 壁面传热系数计算关联式（按时间顺序）

| 关联式名称 | 公式 | 适用范围 | 发表年份 |
|------------|------|----------|----------|
| Leva | $$\frac{h_w d_p}{k_f} = 0.813\left(\frac{d_p}{D_t}\right)\exp\left(-6\frac{d_p}{D_t}\right)\left(\frac{d_p G}{\mu}\right)^{0.9}$$ | 250 < $Re_p$ < 3000 <br> 3.3 < $D_t/d_p$ < 20 | 1947 |
| Leva et al. | $$\frac{h_w d_p}{k_f} = 3.5\left(\frac{d_p}{D_t}\right)\exp\left(-4.6\frac{d_p}{D_t}\right)\left(\frac{d_p G}{\mu}\right)^{0.7}$$ | 250 < $Re_p$ < 3000 <br> 3.7 < $D_t/d_p$ < 12.5 | 1948 |
| Chu & Storrow | $$\frac{h_w d_p}{k_f} = 0.134 \left(\frac{d_p}{D_t}\right)^{-0.13} \left(\frac{L_t}{D_t}\right)^{-0.9} \mathrm{Re}_p^{1.17}$$ | $Re_p$ < 1600 <br> 3.9 < $D_t/d_p$ < 25.7 | 1952 |
| Yagi & Wakao | $$\frac{h_w d_p}{k_f} = \begin{cases} 0.6 \cdot \mathrm{Re}_p^{0.5} & \text{for } \mathrm{Re}_p < 40 \\ 0.2 \cdot \mathrm{Re}_p^{0.8} & \text{for } \mathrm{Re}_p \geq 40 \end{cases}$$ | 20 < $Re_p$ < 2000 <br> 6.0 < $D_t/d_p$ < 47.0 | 1959 |
| Kunii et al. | $$\frac{h_w d_p}{k_f} = C_1 \cdot \mathrm{Re}_p^{0.75} \cdot \mathrm{Pr}^{1/3}$$ | $Re_p$ > 100 <br> 3.3 < $D_t/d_p$ < 5.0 | 1968 |
| Olbrich & Potter | $$\frac{h_w d_p}{k_f} = 8.9 \cdot \mathrm{Pr}^{1/3} \cdot \mathrm{Re}_p^{0.34}$$ | 100 < $Re_p$ < 3000 <br> 4.06 < $D_t/d_p$ < 26.6 | 1972 |
| Li & Finlayson | $$\frac{h_w d_p}{k_f} = 0.17 \cdot \mathrm{Re}_p^{0.79}$$ | 1 < $Re_p$ < 1000 <br> 3.3 < $D_t/d_p$ < 20 | 1977 |
| Specchia et al. | $$\frac{h_w d_p}{k_f} = 2\cdot \varepsilon + 0.0835 \mathrm{Re}_p^{0.91}$$ | 10 < $Re_p$ < 1200 <br> 3.5 < $D_t/d_p$ < 8.4 | 1980 |
| Colledge & Paterson | $$\frac{h_w d_p}{k_f} = 0.523 \left(1 - \frac{d_p}{D_t}\right) \mathrm{Pr}^{\frac{1}{3}} \mathrm{Re}_p^{0.738}$$ | 一般适用 | 1984 |
| Dixon et al. | $$\frac{h_w d_p}{k_f} = \left(1 - 1.5\left(\frac{d_p}{D_t}\right)^{1.5}\right) \cdot \mathrm{Pr}^{\frac{1}{3}} \cdot \mathrm{Re}_p^{0.59}$$ | 50 < $Re_p$ < 500 <br> 3.0 < $D_t/d_p$ < 12.0 | 1984 |
| Peters et al. | $$\frac{h_w d_p}{k_f} = 4.9 \cdot \left(\frac{d_p}{D_t}\right)^{0.26} \cdot \mathrm{Pr}^{\frac{1}{3}} \cdot \mathrm{Re}_p^{0.45}$$ | 200 < $Re_p$ < 8000 <br> 3.0 < $D_t/d_p$ < 11.0 | 1988 |
| Martin & Nilles | $$\frac{h_w d_p}{k_f} = \left(1.3 + 5\frac{d_p}{D_t}\right) \frac{k_{er}}{k_f} + 0.19\mathrm{Pr}^{\frac{1}{3}}\mathrm{Re}_p^{0.75}$$ | 35 < $Re_p$ < 500 <br> 3.3 < $D_t/d_p$ < 20 | 1993 |
| Demirel et al. | $$\frac{h_w d_p}{k_f} = 0.047\left(\frac{d_p G}{\mu}\right)^{0.927}$$ | 200 < $Re_p$ < 1450 <br> 4.0 < $D_t/d_p$ < 7.5 | 2000 |
| Laguerre et al. | $$\frac{h_w d_p}{k_f} = 1.56\mathrm{Pr}^{1/3}\left(\frac{d_p G}{\mu}\right)^{0.42}$$ | 100 < $Re_p$ < 400 <br> $D_t/d_p$ = 5.0 | 2006 |
| Das et al. | $$\frac{h_w d_p}{k_f} = 1.351 + 0.1124\mathrm{Pr}^{1/3}\left(\frac{d_p G}{\mu}\right)^{0.878}$$ | 1 < $Re_p$ < 500 <br> 4.0 < $D_t/d_p$ < 8 | 2017 |

### 3.3 符号说明

| 符号 | 名称 | 单位 |
|------|------|------|
| $h_w$ | 壁面传热系数 | W/(m²·K) |
| $d_p$ | 填充颗粒直径 | m |
| $k_f$ | 流体热导率 | W/(m·K) |
| $k_{er}$ | 有效径向热导率 | W/(m·K) |
| $G$ | 质量流速 | kg/(m²·s) |
| $\rho$ | 流体密度 | kg/m³ |
| $u_0$ | 空管速度 | m/s |
| $\mu$ | 流体粘度 | Pa·s |
| $C_p$ | 流体比热容 | J/(kg·K) |
| $D_t$ | 反应器内径 | m |
| $L_t$ | 床层长度 | m |
| $\varepsilon$ | 床层孔隙率 | 无量纲 |
| $C_1$ | Kunii关联式系数 | 无量纲 |
| $Re_p$ | 粒子雷诺数 | 无量纲 |
| $Pr$ | 普朗特数 | 无量纲 |

## 4. 壁面传热系数的计算模型

### 4.1 无量纲表示

为了便于不同操作条件之间的比较，壁面传热系数通常以无量纲的努塞尔数（Nusselt number）表示：

$$
Nu_w = \frac{h_w d_p}{k_f}
$$

其中：

- $Nu_w$ 是壁面努塞尔数
- $h_w$ 是壁面传热系数 [W/(m²·K)]
- $d_p$ 是填充颗粒直径 [m]
- $k_f$ 是流体热导率 [W/(m·K)]

### 4.2 主要关联式

固定床反应器壁面传热系数的计算通常采用经验关联式。本模型包含多种经典关联式，每种关联式适用于不同的操作条件和几何参数范围。以下按照时间顺序列出主要关联式：

#### 4.2.1 Leva 关联式 (1947) [1]

$$
\frac{h_w d_p}{k_f} = 0.813\left(\frac{d_p}{D_t}\right)\exp\left(-6\frac{d_p}{D_t}\right)\left(\frac{d_p G}{\mu}\right)^{0.9}
$$

**适用条件：**

- 雷诺数范围：250 < $Re_p$ < 3000
- 管径与粒径比：3.3 < $D_t/d_p$ < 20

#### 4.2.2 Leva et al. 关联式 (1948) [2]

$$
\frac{h_w d_p}{k_f} = 3.5\left(\frac{d_p}{D_t}\right)\exp\left(-4.6\frac{d_p}{D_t}\right)\left(\frac{d_p G}{\mu}\right)^{0.7}
$$

**适用条件：**

- 雷诺数范围：250 < $Re_p$ < 3000
- 管径与粒径比：3.7 < $D_t/d_p$ < 12.5

#### 4.2.3 Chu & Storrow 关联式 (1952) [3]

$$
\frac{h_w d_p}{k_f} = 0.134 \left(\frac{d_p}{D_t}\right)^{-0.13} \left(\frac{L_t}{D_t}\right)^{-0.9} \mathrm{Re}_p^{1.17}
$$

**适用条件：**

- 雷诺数范围：$Re_p$ < 1600
- 管径与粒径比：3.9 < $D_t/d_p$ < 25.7

#### 4.2.4 Yagi & Wakao 关联式 (1959) [4]

$$
\frac{h_w d_p}{k_f} = \begin{cases}
0.6 \cdot \mathrm{Re}_p^{0.5} & \text{for } \mathrm{Re}_p < 40 \\
0.2 \cdot \mathrm{Re}_p^{0.8} & \text{for } \mathrm{Re}_p \geq 40
\end{cases}
$$

**适用条件：**

- 雷诺数范围：20 < $Re_p$ < 2000
- 管径与粒径比：6.0 < $D_t/d_p$ < 47.0

#### 4.2.5 Kunii et al. 关联式 (1968) [5]

$$
\frac{h_w d_p}{k_f} = C_1 \cdot \mathrm{Re}_p^{0.75} \cdot \mathrm{Pr}^{1/3}
$$

**适用条件：**

- 雷诺数范围：$Re_p$ > 100
- 管径与粒径比：3.3 < $D_t/d_p$ < 5.0

#### 4.2.6 Olbrich & Potter 关联式 (1972) [6]

$$
\frac{h_w d_p}{k_f} = 8.9 \cdot \mathrm{Pr}^{1/3} \cdot \mathrm{Re}_p^{0.34}
$$

**适用条件：**

- 雷诺数范围：100 < $Re_p$ < 3000
- 管径与粒径比：4.06 < $D_t/d_p$ < 26.6

#### 4.2.7 Li & Finlayson 关联式 (1977) [7]

$$
\frac{h_w d_p}{k_f} = 0.17 \cdot \mathrm{Re}_p^{0.79}
$$

**适用条件：**

- 雷诺数范围：1 < $Re_p$ < 1000
- 管径与粒径比：3.3 < $D_t/d_p$ < 20

#### 4.2.8 Specchia et al. 关联式 (1980) [8]

$$
\frac{h_w d_p}{k_f} = 2\cdot \varepsilon + 0.0835 \mathrm{Re}_p^{0.91}
$$

**适用条件：**

- 雷诺数范围：10 < $Re_p$ < 1200
- 管径与粒径比：3.5 < $D_t/d_p$ < 8.4

#### 4.2.9 Colledge & Paterson 关联式 (1984) [9]

$$
\frac{h_w d_p}{k_f} = 0.523 \left(1 - \frac{d_p}{D_t}\right) \mathrm{Pr}^{\frac{1}{3}} \mathrm{Re}_p^{0.738}
$$

**适用条件：**

- 适用范围：一般适用

#### 4.2.10 Dixon et al. 关联式 (1984) [10]

$$
\frac{h_w d_p}{k_f} = \left(1 - 1.5\left(\frac{d_p}{D_t}\right)^{1.5}\right) \cdot \mathrm{Pr}^{\frac{1}{3}} \cdot \mathrm{Re}_p^{0.59}
$$

**适用条件：**

- 雷诺数范围：50 < $Re_p$ < 500
- 管径与粒径比：3.0 < $D_t/d_p$ < 12.0

#### 4.2.11 Peters et al. 关联式 (1988) [11]

$$
\frac{h_w d_p}{k_f} = 4.9 \cdot \left(\frac{d_p}{D_t}\right)^{0.26} \cdot \mathrm{Pr}^{\frac{1}{3}} \cdot \mathrm{Re}_p^{0.45}
$$

**适用条件：**

- 雷诺数范围：200 < $Re_p$ < 8000
- 管径与粒径比：3.0 < $D_t/d_p$ < 11.0

#### 4.2.12 Martin & Nilles 关联式 (1993) [12]

$$
\frac{h_w d_p}{k_f} = \left(1.3 + 5\frac{d_p}{D_t}\right) \frac{k_{er}}{k_f} + 0.19\mathrm{Pr}^{\frac{1}{3}}\mathrm{Re}_p^{0.75}
$$

**适用条件：**

- 雷诺数范围：35 < $Re_p$ < 500
- 管径与粒径比：3.3 < $D_t/d_p$ < 20

#### 4.2.13 Demirel et al. 关联式 (2000) [13]

$$
\frac{h_w d_p}{k_f} = 0.047\left(\frac{d_p G}{\mu}\right)^{0.927}
$$

**适用条件：**

- 雷诺数范围：200 < $Re_p$ < 1450
- 管径与粒径比：4.0 < $D_t/d_p$ < 7.5

#### 4.2.14 Laguerre et al. 关联式 (2006) [14]

$$
\frac{h_w d_p}{k_f} = 1.56\mathrm{Pr}^{1/3}\left(\frac{d_p G}{\mu}\right)^{0.42}
$$

**适用条件：**

- 雷诺数范围：100 < $Re_p$ < 400
- 管径与粒径比：$D_t/d_p$ = 5.0

#### 4.2.15 Das et al. 关联式 (2017) [15]

$$
\frac{h_w d_p}{k_f} = 1.351 + 0.1124\mathrm{Pr}^{1/3}\left(\frac{d_p G}{\mu}\right)^{0.878}
$$

**适用条件：**

- 雷诺数范围：1 < $Re_p$ < 500
- 管径与粒径比：4.0 < $D_t/d_p$ < 8

## 参考文献

1. M. Leva, Industrial & Engineering Chemistry 1947, 39(7), 857
2. M. Leva, M. Weintraub, M. Grummer, E. L. Clark, Industrial & Engineering Chemistry 1948, 40(4), 747.
3. J. H. Quinton, J. A. Storrow, Chem. Eng. Sci. 1952, 1(5), 230.
4. S. Yagi, N. Wakao, AIChE J. 1959, 5, 79.
5. D. Kunii, M. Suzuki, N. Ono, J. Chem. Eng. Jpn. 1968, 1(1), 21.
6. W. E. Olbrich, O. E. Potter, Chem. Eng. Sci. 1972, 27(9), 1723.
7. C. H. Li, B. A. Finlayson, Chem. Eng. Sci. 1977, 32, 1055.
8. V. Specchia, G. Baldi, S. Sicardi, Chem. Eng. Commun. 1980, 4(1–3), 361.
9. R. A. Colledge, W. R. Paterson. in Proc. of the 11th Annual Research Meeting. 1984, 103–108.
10. A. G. Dixon, M. A. DiCostanzo, B. A. Soucy, Int. J. Heat Mass Transfer 1984, 27(10), 1701.
11. P. E. Peters, R. S. Schiffino, P. Harriott, Ind. Eng. Chem. Res. 1988, 27(2), 226.
12. H. Martin, M. Nilles, Chem. Ing. Tech. 1993, 65(12), 1468.
13. Y. Demirel, R. N. Sharma, H. H. Al-Ali, Int. J. Heat Mass Transfer 2000, 43, 327.
14. O. Laguerre, S. Ben Amara, D. Flick, Appl. Therm. Eng. 2006, 26, 1951.
15. S. Das, N. G. Deen, J. A. M. Kuipers, Chem. Eng. Sci. 2017, 160, 1.
