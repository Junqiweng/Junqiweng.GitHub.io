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

### 4.3 Sato模型

$$
\phi_L^2 = 1 + 25 \left(\frac{u_G}{u_L}\right)^{0.8} \left(\frac{Re_G}{Re_L}\right)^{0.3} We^{-0.15}
$$

$$
\Delta P_{TP} = \Delta P_L \cdot \phi_L^2
$$

---

### 4.4 Attou-Boyer-Ferschneider模型

$$
\Delta P = \left( \kappa \frac{\mu_L u_L}{d_p^2} + f_{GL} \frac{\rho_L u_L^2}{d_p} \right) (1 + 3\alpha_G) L
$$

- \(\kappa\)：Ergun阻力系数
- \(f_{GL}\)：气液界面摩擦系数
- \(\alpha_G\)：气相体积分率

---

### 4.5 Holub模型

- 定义流型参数：

$$
\Psi = Re_L \cdot Re_G^{0.4} \cdot Fr^{-0.6}
$$

- **涓流区域** (\(\Psi < 100\))：

$$
\phi_L^2 = 1 + \frac{20}{X} + \frac{1}{X^2}
$$

- **脉动流区域** (\(\Psi \geq 100\))：

$$
\phi_L^2 = 1 + 60 \left(\frac{u_G}{u_L}\right)^{0.9} \left(\frac{Re_G}{Re_L}\right)^{0.2} We^{-0.1}
$$

- 总压降：

$$
\Delta P_{TP} = \Delta P_L \cdot \phi_L^2
$$

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
- 高气液比、脉动流区域建议采用Sato或Holub模型。
- Attou-Boyer-Ferschneider模型适用于考虑气液固三相作用的复杂工况。
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
