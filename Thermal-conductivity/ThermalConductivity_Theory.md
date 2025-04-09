---
---

# 固定床有效导热系数 理论文档

## 1. 简介

固定床反应器或传热设备中，床层的有效导热系数 \(k_{eff}\) 是描述热量传递能力的关键参数，综合考虑了固体、流体、辐射及流动引起的弥散效应。

---

## 2. 关键参数与符号

| 符号 | 含义 | 单位 |
|-------|--------------------------|----------------|
| \(k_{eff}\) | 床层总有效导热系数 | W/m·K |
| \(k_0\) | 静态有效导热系数（无流动） | W/m·K |
| \(k_f\) | 流体导热系数 | W/m·K |
| \(k_s\) | 固体导热系数 | W/m·K |
| \(k_r\) | 辐射等效导热系数 | W/m·K |
| \(\epsilon\) | 空隙率 | 无量纲 |
| \(d_p\) | 颗粒直径 | m |
| \(d_t\) | 管径或床层直径 | m |
| \(Re_p\) | 颗粒雷诺数 | 无量纲 |
| \(Pr\) | 普朗特数 | 无量纲 |
| \(Pe_p\) | 颗粒佩克莱数 | 无量纲 |
| \(C_{disp}\) | 弥散系数经验常数 | 无量纲 |
| \(K_5\) | 径向弥散壁面修正参数 | 无量纲 |

---

## 3. 静态有效导热系数 \(k_0\)

### 3.1 Yagi-Kunii模型

$$
k_0 = \epsilon k_f + (1 - \epsilon) \left[ \frac{1}{\frac{1}{k_s + k_r} + \frac{1}{k_f}} \right]
$$

- 适用于多数固定床，低温时 \(k_r\) 可忽略。
- 视为气体和固体的并联-串联复合模型。

---

### 3.2 ZBS (Zehner-Bauer-Schlünder) 模型

$$
k_0 = k_f \left[ 1 - \sqrt{1 - \epsilon} + \sqrt{1 - \epsilon} \cdot \frac{2}{1 - B/\kappa} \left( \frac{(1 - 1/\kappa) B \ln(\kappa/B)}{(1 - B/\kappa)^2} - \frac{B - 1}{1 - B/\kappa} - \frac{B + 1}{2} \right) \right]
$$

- \(\kappa = k_s / k_f\)，导热比
- \(B\) 为颗粒形状因子，球形颗粒通常取1.25
- 适用于各种颗粒形状，考虑了接触点热阻

---

### 3.3 ZBS模型（含辐射）

适用于高温条件，考虑辐射贡献：

$$
k_0 = k_f \left[ (1 - \sqrt{1 - \epsilon}) \epsilon \left( \frac{1}{\frac{1}{\epsilon} - \frac{1}{k_G}} + k_r \right) + \sqrt{1 - \epsilon} (\phi \kappa + (1 - \phi) k_c) \right]
$$

- \(k_G\)：气体导热修正因子
- \(\phi\)：形状相关参数，通常取0.0077
- \(k_c\)：接触点导热贡献
- \(k_r\)：辐射等效导热
- 复杂表达式，详见ZBS原始文献

---

## 4. 动态导热贡献（弥散效应）

### 4.1 颗粒雷诺数

$$
Re_p = \frac{\rho_f u d_p}{\mu}
$$

### 4.2 普朗特数

$$
Pr = \frac{\mu C_p}{k_f}
$$

### 4.3 佩克莱数

$$
Pe_p = Re_p \times Pr
$$

---

### 4.4 轴向弥散导热系数

Yagi-Kunii / Wakao-Kaguei模型：

$$
k_{axial} = C_{disp,a} \times \rho_f C_p u d_p
$$

- 推荐 \(C_{disp,a} \approx 0.5\)
- 主要反映流动引起的轴向热传递增强

---

### 4.5 径向弥散导热系数

Dixon-Cresswell模型：

$$
k_{radial} = \frac{\rho_f C_p u d_p}{K_5}
$$

$$
K_5 = 8.65 \left(1 + 1.94 \left(\frac{d_p}{d_t}\right)^2 \right)
$$

- \(K_5\) 考虑了壁面效应
- 适用于不同管径与颗粒比

---

## 5. 总有效导热系数

$$
k_{eff} = k_0 + k_{disp}
$$

其中 \(k_{disp}\) 为弥散贡献（轴向或径向），通常分开计算。

---

## 6. 工程应用建议

- 低温条件下，辐射贡献可忽略，采用Yagi-Kunii或ZBS模型。
- 高温（>500K）时，建议采用ZBS含辐射模型。
- 动态弥散贡献在高速流动时显著，应结合静态导热计算总导热系数。
- 颗粒形状、空隙率、温度、流速等均显著影响有效导热系数。
- 设计时建议多模型对比，取合理范围。

---

## 7. 参考文献

1. Wakao, N., Kaguei, S., *Heat and Mass Transfer in Packed Beds*, 1982.
2. Kunii, D., Levenspiel, O., *Fluidization Engineering*, 2nd Ed.
3. Zehner, P., Bauer, G., *Wärmeleitfähigkeit von Schüttungen*, Chemie Ingenieur Technik, 1966.
4. Dixon, A. G., Cresswell, D. L., *Theoretical prediction of effective heat transfer parameters in packed beds*, AIChE J., 1979.
5. Perry's Chemical Engineers' Handbook, 8th Edition.
