---
---

# 滴流床反应器压降 理论文档

## 1. 简介

滴流床反应器中气液两相流动的压降是设计和操作中的关键参数，影响传质效率、能耗和流型稳定性。准确预测压降有助于优化工艺条件。

---

## 2. 关键参数与符号

| 符号 | 含义 | 单位 |
|-------|--------------------------|----------------|
| \(\Delta P\) | 总压降 | Pa |
| \(L\) | 床层高度 | m |
| \(\varepsilon\) | 空隙率 | 无量纲 |
| \(d_p\) | 颗粒直径 | m |
| \(D\) | 反应器直径 | m |
| \(u_L, u_G\) | 液相/气相表观速度 | m/s |
| \(\rho_L, \rho_G\) | 液体/气体密度 | kg/m³ |
| \(\mu_L, \mu_G\) | 液体/气体粘度 | Pa·s |
| \(\sigma\) | 表面张力 | N/m |
| \(Re_L, Re_G\) | 液相/气相雷诺数 | 无量纲 |
| \(We\) | Weber数 | 无量纲 |
| \(X\) | Martinelli参数 | 无量纲 |
| \(\phi_L^2\) | 两相流修正系数 | 无量纲 |
| \(\Psi\) | 流型参数 | 无量纲 |

---

## 3. 单相压降计算

Ergun方程：

$$
\frac{\Delta P}{L} = \frac{150 (1 - \varepsilon)^2 \mu u}{d_p^2 \varepsilon^3} + \frac{1.75 (1 - \varepsilon) \rho u^2}{d_p \varepsilon^3}
$$

---

## 4. 多相压降模型

### 4.1 Lockhart-Martinelli模型

$$
X = \sqrt{\frac{\Delta P_L}{\Delta P_G}}
$$

$$
\phi_L^2 = 1 + \frac{C}{X} + \frac{1}{X^2}
$$

$$
\Delta P_{TP} = \Delta P_L \cdot \phi_L^2
$$

- \(C\) 为Chisholm系数，典型值20

---

### 4.2 Larkins, White & Jeffrey模型

$$
\phi_L^2 = 1 + 40 \left(\frac{u_G}{u_L}\right) \left(\frac{\rho_G}{\rho_L}\right)^{0.5} Re_L^{-0.2}
$$

$$
\Delta P_{TP} = \Delta P_L \cdot \phi_L^2
$$

---

### 4.3 Sato et al. 关联式

$$
X = \left(\frac{\Delta P_L}{\Delta P_G}\right)^{1/2}
$$

$$
\phi_L = 1.30 + 1.85X^{-0.85}
$$

$$
\Delta P_{TP} = \Delta P_L \phi_L^2
$$

当前实现采用公开资料可核验的 Lockhart-Martinelli 型 Sato 关联式。该式为经验关联式，建议范围为 $0.1 < X < 20$；超出范围时应与实验标定或其他模型交叉验证。

---

### 4.4 Attou-Boyer-Ferschneider型三相阻力闭合

$$
F_{LS}=A_{LS}\mu_Lu_{Li}+B_{LS}\rho_Lu_{Li}^2
$$

$$
F_{GL}=\varepsilon_G(A_{GL}\mu_Gu_r+B_{GL}\rho_Gu_r^2)
$$

其中：

$$
\varepsilon_G=\varepsilon\alpha_G,\quad \varepsilon_L=\varepsilon(1-\alpha_G),\quad
u_{Gi}=\frac{u_G}{\varepsilon_G},\quad u_{Li}=\frac{u_L}{\varepsilon_L},\quad u_r=|u_{Gi}-u_{Li}|
$$

$$
A_{LS}=\frac{150(1-\varepsilon)^2}{(1-\alpha_G)^3\varepsilon^3d_p^2},\quad
B_{LS}=\frac{1.75(1-\varepsilon)}{(1-\alpha_G)^3\varepsilon^3d_p}
$$

$$
A_{GL}=\frac{150(1-\varepsilon\alpha_G)^2}{\alpha_G^3\varepsilon^3d_p^2}
\left(\frac{1-\varepsilon}{1-\varepsilon\alpha_G}\right)^{1/3}
$$

$$
B_{GL}=\frac{1.75(1-\varepsilon\alpha_G)}{\alpha_G^3\varepsilon^3d_p}
\left(\frac{1-\varepsilon}{1-\varepsilon\alpha_G}\right)^{1/3}
$$

稳态摩擦闭合采用：

$$
F_{GL}=\alpha_GF_{LS},\quad \Delta P=L\frac{F_{GL}}{\varepsilon_G}
$$

当前实现删除了旧版任意的 $(1+3\alpha_G)$ 放大项，改为求解气相饱和度 $\alpha_G$ 后输出摩擦压降。该实现未包含轴向加速度项、重力压头和流型转变判据，因此仍应标为“Attou型摩擦闭合”，而不是完整一维 CFD 原模型。

---

### 4.5 Holub原始模型（当前禁用）

Holub 模型是孔尺度狭缝型现象模型，用于联立预测压降、液持率和涓流-脉动流转变。公开摘要和综述均表明该模型需要单相 Ergun 常数、液持率、滑移/剪切因子和流型判据，而不是单一 $\phi_L^2$ 切换式。

当前版本不再输出旧版 Holub 简化估算值。待补齐原文方程、参数表和联立求解策略后，方可重新启用 Holub 数值计算。

---

## 5. 特征参数

- 液相雷诺数：

$$
Re_L = \frac{\rho_L u_L d_p}{\mu_L}
$$

- 气相雷诺数：

$$
Re_G = \frac{\rho_G u_G d_p}{\mu_G}
$$

- Weber数：

$$
We = \frac{\rho_L u_L^2 d_p}{\sigma}
$$

- Martinelli参数：

$$
X = \sqrt{\frac{\Delta P_L}{\Delta P_G}}
$$

- 流型参数：

$$
\Psi = Re_L \cdot Re_G^{0.4} \cdot Fr^{-0.6}
$$

---

## 6. 工程应用建议

- 低气液比、涓流区域优先采用Lockhart-Martinelli或Larkins模型。
- Sato et al. 关联式可用于 Lockhart-Martinelli 参数范围内的经验估算，超出 $0.1 < X < 20$ 时不建议外推。
- Attou-Boyer-Ferschneider 型摩擦闭合适用于稳态均匀涓流区的摩擦压降估算；若重力压头、液泛或脉动流重要，应使用完整模型或实验标定。
- Holub 模型当前禁用，不能作为设计压降输出。
- 设计中建议多模型对比，取合理范围。
- 注意参数单位一致，特别是密度、粘度、表面张力。

---

## 7. 参考文献

1. Saroha, A. K., & Nigam, K. D. P. (1996). Chem. Eng. Sci., 51(10), 1599-1612.
2. Levenspiel, O., *Chemical Reaction Engineering*, 3rd Ed.
3. Attou, A., Boyer, C., & Ferschneider, G. (1999). Chem. Eng. Sci.
4. Holub, M., et al. (1992). Chem. Eng. Sci.
5. Larkins, White & Jeffrey (1980s). Experimental studies.
6. Sato, Y., et al. (1981). J. Chem. Eng. Japan.
