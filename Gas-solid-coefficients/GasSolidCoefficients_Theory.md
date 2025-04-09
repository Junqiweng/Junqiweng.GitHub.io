---
---

# 气固传热与传质系数 理论文档

## 1. 简介

气固传热与传质系数是描述气体与固体颗粒之间热量和物质交换能力的关键参数，广泛应用于固定床、流化床、多相反应器设计与模拟。

---

## 2. 关键参数与符号

| 符号 | 含义 | 单位 |
|-------|--------------------------|----------------|
| \(h\) | 传热系数 | W/m²·K |
| \(k_c\) | 传质系数 | m/s |
| \(d_p\) | 颗粒直径 | m |
| \(k_f\) | 流体导热系数 | W/m·K |
| \(D_{AB}\) | 组分扩散系数 | m²/s |
| \(\rho\) | 流体密度 | kg/m³ |
| \(\mu\) | 流体粘度 | Pa·s |
| \(C_p\) | 流体比热容 | J/kg·K |
| \(u\) | 流体表观速度 | m/s |
| \(\epsilon\) | 空隙率 | 无量纲 |
| \(Re\) | 雷诺数 | 无量纲 |
| \(Pr\) | 普朗特数 | 无量纲 |
| \(Sc\) | 史密特数 | 无量纲 |
| \(Nu\) | 努塞尔数 | 无量纲 |
| \(Sh\) | Sherwood数 | 无量纲 |

---

## 3. 无量纲数定义

- **雷诺数**

$$
Re = \frac{\rho u d_p}{\mu}
$$

- **普朗特数**

$$
Pr = \frac{\mu C_p}{k_f}
$$

- **史密特数**

$$
Sc = \frac{\mu}{\rho D_{AB}}
$$

- **努塞尔数**

$$
Nu = \frac{h d_p}{k_f}
$$

- **Sherwood数**

$$
Sh = \frac{k_c d_p}{D_{AB}}
$$

---

## 4. 传质关联式

### 4.1 Ranz-Marshall

$$
Sh = 2 + 0.6 Re^{0.5} Sc^{1/3}
$$

- 适用于单颗粒或稀疏床层，低Re范围。

---

### 4.2 Wakao-Funazkri

$$
Sh = 2 + 1.1 Re^{0.6} Sc^{1/3}
$$

- 适用于密集固定床，Re范围更广。

---

### 4.3 Froessling

$$
Sh = 2 + 0.6 Re^{0.5} Sc^{1/3}
$$

- 经典单颗粒传质模型，形式与Ranz-Marshall相同。

---

### 4.4 Rowe

$$
Sh = 1.1 \left( Re^{0.5} + 0.2 Re^{0.67} \right) Sc^{0.33}
$$

- 适用范围宽，适合中高Re。

---

## 5. 传热关联式

### 5.1 Ranz-Marshall

$$
Nu = 2 + 0.6 Re^{0.5} Pr^{1/3}
$$

- 适用于单颗粒或稀疏床层。

---

### 5.2 Gnielinski

$$
Nu = 2 + \sqrt{Nu_{lam}^2 + Nu_{turb}^2}
$$

其中：

$$
Nu_{lam} = 0.664 Re^{0.5} Pr^{1/3}
$$

$$
Nu_{turb} = \frac{0.037 Re^{0.8} Pr}{1 + 2.443 Re^{-0.1} (Pr^{2/3} - 1)}
$$

- 适用范围广，层流湍流均适用。

---

### 5.3 Dittus-Boelter

$$
Nu = 0.023 Re^{0.8} Pr^{n}
$$

- \(n=0.4\)（加热），\(n=0.3\)（冷却）
- 适用于高Re湍流区。

---

### 5.4 Hausen

$$
Nu = 0.037 Re^{0.8} Pr^{1/3}
$$

- 简化湍流模型，适合中高Re。

---

## 6. 传热与传质系数计算

- 传热系数：

$$
h = \frac{Nu \cdot k_f}{d_p}
$$

- 传质系数：

$$
k_c = \frac{Sh \cdot D_{AB}}{d_p}
$$

---

## 7. 工程应用建议

- 低Re、稀疏床层优先采用Ranz-Marshall或Froessling模型。
- 密集床层、宽Re范围建议采用Wakao-Funazkri或Rowe模型。
- 传热计算中，Gnielinski模型适用范围最广，推荐优先使用。
- 高Re湍流区可采用Dittus-Boelter或Hausen模型。
- 设计中建议多模型对比，取合理范围。
- 注意参数单位一致，特别是扩散系数和颗粒尺寸。

---

## 8. 参考文献

1. Ranz, W. E., & Marshall, W. R. (1952). Chem. Eng. Prog., 48(3), 141-146.
2. Wakao, N., & Funazkri, T. (1978). AIChE J., 24(6), 1076-1082.
3. Bird, Stewart, Lightfoot, *Transport Phenomena*, 2nd Ed.
4. Gnielinski, V. (1976). Int. Chem. Eng., 16(2), 359-368.
5. Perry's Chemical Engineers' Handbook, 8th Edition.
