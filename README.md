# 固定床反应器计算工具集

<div align="center">

![版本](https://img.shields.io/badge/版本-1.1.0-blue)
![更新日期](https://img.shields.io/badge/更新日期-2025--04--09-green)
![许可证](https://img.shields.io/badge/许可证-MIT-orange)

</div>

---

## 📝 简介

本项目是一个专为化工工程师、科研人员及学生设计的**固定床反应器计算平台**，集成多种经典模型与经验关联式，助力高效、精准完成反应器设计、分析与优化。

---

## ✨ 功能亮点

- **多模型对比**：支持多种计算模型，方便横向比较选择最优方案
- **丰富计算模块**：涵盖扩散、传热、压降等关键参数
- **交互式界面**：基于现代Web技术，操作简便，结果直观
- **理论支持**：内置详细理论背景，助力理解计算依据
- **响应式设计**：兼容桌面与移动端
- **数学公式渲染**：集成MathJax，精准展示复杂方程
- **模块化架构**：便于维护与扩展

---

## 🧮 计算模块

| 模块名称             | 功能描述                               | 主要特点                                               |
|----------------------|----------------------------------------|--------------------------------------------------------|
| 扩散系数计算         | 轴向/径向扩散系数                     | Edwards-Richardson、Wakao-Kaguei等多模型               |
| 气固传热系数计算     | 气固相传质与传热系数                  | Ranz-Marshall、Wakao-Funazkri等经典关联式              |
| 总传热系数计算       | 反应器整体导热性能                    | 综合颗粒、辐射、流体导热                               |
| 压降计算             | 固定床内流体阻力损失                  | Ergun、Carman-Kozeny、Burke-Plummer等方程              |
| 导热系数计算         | 材料有效导热系数                      | 考虑床层结构与流体动力学                              |
| 管道压降计算         | 管道系统压力损失                      | 适用于多种管型（直管、弯头、收缩、扩张）               |
| 壁面传热系数计算     | 反应器壁面传热性能                    | 多实验关联式，适应不同操作条件                         |

---

## 🚀 快速开始

### 运行方式

- **主页访问**：打开根目录 `index.html`，选择所需计算模块
- **直接访问**：进入对应模块文件夹，打开 `index.html`

### 使用流程

1. 选择计算模块
2. 输入参数（带有提示）
3. 点击“计算”获取结果
4. 查看数据表与图形
5. 点击 ℹ️ 图标了解理论依据

---

## 📁 项目结构

```
固定床反应器工具集/
├── index.html
├── global-styles.css
├── README.md
├── Dispersion-coefficients/
│   ├── DispersionCoefficients_index.html
│   ├── DispersionCoefficients_script.js
│   └── DispersionCoefficients_Theory.md
├── Gas-solid-coefficients/
│   ├── GasSolidCoefficients_index.html
│   ├── GasSolidCoefficients_script.js
│   └── GasSolidCoefficients_Theory.md
├── Overall-thermal-coefficient/
│   ├── OverallThermalCoefficient_index.html
│   ├── OverallThermalCoefficient_script.js
│   └── OverallThermalCoefficient_Theory.md
├── Pressure-drop/
│   ├── PressureDrop_index.html
│   ├── PressureDrop_script.js
│   ├── PressureDrop_validation.py
│   └── PressureDrop_Theory.md
├── Thermal-conductivity/
│   ├── ThermalConductivity_index.html
│   ├── ThermalConductivity_script.js
│   ├── ThermalConductivity_Theory.md
│   └── ThermalConductivity_zbs_thermal_conductivity.py
├── Tube_pressure_drop/
│   ├── TubePressureDrop_index.html
│   ├── TubePressureDrop_script.js
│   └── TubePressureDrop_Theory.md
├── Trickle-bed-pressure-drop/
│   ├── TrickleBedPressureDrop_index.html
│   ├── TrickleBedPressureDrop_script.js
│   └── TrickleBedPressureDrop_Theory.md
├── Wall-thermal-conductivity/
│   ├── WallThermalConductivity_index.html
│   ├── WallThermalConductivity_script.js
│   └── WallThermalConductivity_Theory.md
└── .github/
    └── workflows/
        └── static.yml
```

---

## 🛠️ 技术栈

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **数学公式**：MathJax 3.x
- **图表绘制**：原生JavaScript
- **布局设计**：Flexbox & Grid 响应式布局
- **样式管理**：模块化CSS + CSS变量

---

## 📚 理论基础

- **实验关联式**：基于大量实验数据拟合
- **理论模型**：传热传质基本理论推导
- **混合模型**：结合理论与实验的半经验模型

每个模块均提供详细的理论背景、适用范围及局限性，帮助用户科学选型。

---

## 🔍 示例演示

以压降计算为例：

1. 打开 `Pressure-drop/PressureDrop_index.html`
2. 输入床层参数（高度、空隙率、颗粒直径）
3. 输入流体参数（速度、密度、粘度）
4. 选择计算模型（如Ergun方程）
5. 点击“计算”
6. 查看结果及模型对比
7. 点击“查看公式”了解理论依据

---

## 🎯 未来规划

- [ ] 新增动力学模型与反应器选型工具
- [ ] 支持结果导出（CSV、PDF）
- [ ] 参数敏感性分析
- [ ] 多语言界面
- [ ] 数据持久化存储
- [ ] 移动端App版本

---

## 🤝 贡献指南

- **问题反馈**：请通过Issue提交bug或建议
- **代码贡献**：欢迎PR，遵循代码规范
- **文档完善**：协助改进用户手册与理论说明

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源，欢迎自由使用与修改。

---

## 👤 作者信息

- **设计与开发**：Junqi
- **联系方式**：junqi@example.com

---

<div align="center">
<sub>© 2025 固定床反应器工具集 | 一站式反应器设计与分析平台</sub>
</div>
