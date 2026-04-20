# 反应工程网页计算器公式文献级审查报告

生成日期：2026-04-20

## 1. 审查范围与判定标准

本报告审查当前仓库中 8 个计算器模块的实际计算公式、弹窗公式和 `*_Theory.md` 理论文档：

- `Pressure-drop`
- `Tube_pressure_drop`
- `Trickle-bed-pressure-drop`
- `Gas-solid-coefficients`
- `Dispersion-coefficients`
- `Thermal-conductivity`
- `Wall-thermal-conductivity`
- `Overall-thermal-coefficient`

判定等级：

| 判定 | 含义 |
|---|---|
| 严重 | 维度错误、变量基准错误、公式与模型名称明显不符，可能导致数量级错误 |
| 中等 | 经验系数、适用范围、模型基准或文档一致性存在问题，可能导致特定工况误差 |
| 轻微 | 显示公式、符号、说明、拼写或范围提示问题，不一定影响实际计算 |
| 通过 | 代码、文档、维度和可核验文献形式基本一致 |
| 待文献确认 | 公开资料不足以确认原式，不应在报告中视为已通过 |

## 2. 核心结论

- 本轮已修复原报告第 5 节中 1、2、3 项的代码级严重问题：`Thermal-conductivity` 现在把静态有效导热并入轴向/径向有效导热，并将径向常数修正为 $19.4$；`Overall-thermal-coefficient` 将 $h_w$ 的特征长度改为 $d_p$，并将 $k_{er}$ 改为含 $D_t/d_p$ 壁效应的径向热弥散形式；`Gas-solid-coefficients` 将 Gnielinski 改为固定床形式，并把 Dittus-Boelter/Hausen 改为非默认的管内流参考式。
- `Pressure-drop` 中 Eisfeld-Schnitzlein 和 KTA 的公开可核形式与代码一致；Dixon 有壁效应式已补入 $(1-e^{-0.22N})$ 壁效应衰减项。Dixon 无壁效应式公开资料存在 $Re_m+52$ 与 $Re_m+60$ 版本差异，仍需以正式期刊原文最终确认。
- `Trickle-bed-pressure-drop` 中 Sato 已改为公开可核的 Lockhart-Martinelli 型 Sato et al. 关联式；Attou-Boyer-Ferschneider 已由旧版任意放大式改为三相阻力闭合求解；Holub 旧版流型切换伪模型已禁用，避免输出不可追溯数值。
- `Dispersion-coefficients` 已修正 Bauer 的 $Pr/Sc$ 显示错误，并让 Specchia 径向质量弥散的代码、弹窗和 Theory.md 统一为同一 $ReSc$ 形式。
- `Pressure-drop` 和 `Tube_pressure_drop` 的基础压降公式总体较稳健；剩余风险集中在 Dixon 版本差异、局部阻力系数过度简化和适用范围未强制提示。

## 3. 文献与公开依据

- Ergun 方程及壁效应背景：Cheng, *Powder Technology* 2011，说明 packed-bed Ergun 形式中 $A_E=150$、$B_E=1.75$，且 $D/d<40$ 时壁效应显著。链接：https://www.sciencedirect.com/science/article/abs/pii/S0032591011001410
- Eisfeld-Schnitzlein 壁效应相关式：公开论文记录和二级文献均给出 $A=K_1A_w^2$、$B=A_w/B_w$ 及球形/圆柱/通用颗粒的 $K_1,k_1,k_2$ 常数表。链接：https://www.researchgate.net/publication/277450373_The_influence_of_confining_walls_on_the_pressure_drop_in_packed_beds
- Eisfeld-Schnitzlein 常数表公开转引：硕士论文背景章节列出球形 $K_1=154,k_1=1.15,k_2=0.87$、圆柱 $190,2.00,0.77$、通用 $155,1.42,0.83$。链接：https://pure.tue.nl/ws/portalfiles/portal/351844673/MCE_afstudeerverslag_Yasmine_Bergmans_1222221_.pdf
- Dixon 壁效应公开会议摘要：给出无壁效应摩擦因子结构，并说明小管径比床层需处理壁效应；公开资料中无壁效应分母存在 $Re_m+60.0$ 版本，需与正式期刊版核对。链接：https://proceedings.aiche.org/conferences/aiche-annual-meeting/2023/proceeding/paper/521ei-wall-effects-on-pressure-drop-through-randomly-packed-beds-spherical-catalyst-particles
- KTA 摩擦因子参考：核工程固定床/球床压降评价文献把 KTA 相关式作为参考摩擦因子模型。链接：https://www.sciencedirect.com/science/article/pii/S0029549321001655
- Wakao-Funazkri 传质关联式：Wakao and Funazkri, *Chemical Engineering Science* 1978，摘要给出 $Sh=2+1.1Sc^{1/3}Re^{0.6}$，范围约 $3<Re<10000$。链接：https://www.sciencedirect.com/science/article/abs/pii/0009250978851203
- packed-bed Gnielinski 关联式参考实现：`ht` 文档列出 packed-bed 形式需要空隙率修正、形状/床层增强因子，而不是单颗粒式直接使用。链接：https://ht.readthedocs.io/en/latest/_modules/ht/conv_packed_bed.html
- 固定床轴向弥散背景：ScienceDirect Topics 汇总 Edwards-Richardson/Wen-Fan 类型相关式，说明 $ReSc$ 与 $Pe$ 的关系及适用限制。链接：https://www.sciencedirect.com/topics/engineering/axial-dispersion
- 固定床低 $D_t/d_p$ 径向弥散壁效应：Dixon and Medeiros, *Fluids* 2017，说明径向/横向弥散 $D_T$、$Pe_T=v_i d_p/D_T$，低 $N$ 近壁区域不能用单一常数简单描述。链接：https://www.mdpi.com/2311-5521/2/4/56
- 有效径向导热 Specchia-Baldi 型分解：Mamonov 等引用的固定床热传递公式给出 $k_{rad}=k_{rad,o}+k_{rad,g}$，且 $k_{rad,g}=RePr\,k_f/[8.65(1+19.4(d_p/d_t)^2)]$。链接：https://www.mdpi.com/2227-9717/8/10/1213/htm
- ZBS 模型状态：Rodrigues 等 2022 指出 ZBS 是 packed-bed 有效导热系数标准模型，参数包括孔隙率、接触/扁平系数和形状因子。链接：https://www.sciencedirect.com/science/article/abs/pii/S0017931022004677
- packed-bed 有效导热综述：Díaz-Heras 等 2020 指出静止流体、辐射和流动诱导轴/径向有效导热相关式差异可达一个数量级，必须谨慎使用适用范围。链接：https://www.sciencedirect.com/science/article/abs/pii/S135943111933532X
- Dixon 改进总传热系数公式摘要：给出 $1/U=1/h_w+R_t( Bi+3)/(3k_r(Bi+4))$，可作为简化总传热模型对照。链接：https://www.sciencedirect.com/science/article/abs/pii/0255270196800122
- 涓流床压降模型背景：高压涓流床模型文献说明 Holub/Attou 等为耦合持液率、Ergun 常数和相间作用的模型，不是单一速度比幂函数。链接：https://www.sciencedirect.com/science/article/abs/pii/S000925090700677X
- Sato et al. 涓流床压降关联式公开转引：Walas《Chemical Process Equipment》章节给出 $\phi=1.30+1.85X^{-0.85}$、$0.1 < X < 20$，并注明源自 Sato, Hirose, Takahashi and Toda, *J. Chem. Eng. Japan* 6, 147-152 (1973)。链接：https://enky-afina.ru/f/710_chemical_process_equipment_selection_and_design_stm_walas.pdf
- Holub 现象模型摘要：原模型同时预测压降、持液率和流型转变，并使用单相流数据参数化，不是本仓库旧版的单一 $\phi_L^2$ 切换式。链接：https://www.sciencedirect.com/science/article/pii/000925099287058X
- Attou-Boyer-Ferschneider 模型记录：文献题名为气液并流涓流床水动力学建模，摘要说明其为稳定涓流区的物理模型。链接：https://colab.ws/articles/10.1016%2FS0009-2509%2898%2900285-1
- Attou 型阻力闭合公开转引：博士/硕士论文综述中列出 $F_{LS}=A_{LS}\mu_Lu_L+B_{LS}\rho_Lu_L^2$、$F_{GL}=\varepsilon_G(A_{GL}\mu_Gu_r+B_{GL}\rho_Gu_r^2)$ 等阻力形式。链接：https://utpedia.utp.edu.my/3055/1/NURHIDAYAH_MOHAMMAD_%28A_1-D_MODEL_FOR_TRICKLE_BED_HYDRODESUL~1.pdf

## 4. 分模块审查

### 4.1 `Pressure-drop`

| 模型/公式 | 代码位置 | 当前实现 | 判定 | 问题类型 | 建议正确形式 | 依据/备注 |
|---|---:|---|---|---|---|---|
| Ergun | `PressureDrop_script.js:241-246` | $\Delta P=L[150(1-\epsilon)^2\mu u_0/(\epsilon^3d_p^2)+1.75(1-\epsilon)\rho u_0^2/(\epsilon^3d_p)]$ | 通过 | 无 | 保持；说明 $d_p$ 为等体积球形等效粒径，非球形需形状修正 | 与 Ergun 形式一致；Cheng 2011 也列出 $A_E=150$、$B_E=1.75$ |
| Eisfeld-Schnitzlein | `PressureDrop_script.js:248-269` | $A=K_1A_w^2$，$B=A_w/B_w$，再代入 Ergun 型式；球形/圆柱/通用颗粒常数表与公开转引一致 | 通过 | 无 | 保持；补充 $Re_p$ 与 $D_t/d_p$ 适用范围提示 | 公开转引可核到 $K_1,k_1,k_2$ 常数表；非球形粒径仍需说明采用 Sauter 等效粒径 |
| Dixon 无壁效应 | `PressureDrop_script.js:272-277` | $Re_m=Re/(1-\epsilon)$，摩擦项 $160/Re_m+(0.922+16/Re_m^{0.46})Re_m/(Re_m+52)$ | 中等 | 版本差异 | 保留当前 $+52$ 版本，但在文档中注明公开会议摘要出现 $Re_m+60.0$；最终应核对 AIChE Journal 正式版本 | 维度闭合；公开资料显示 Dixon 形式存在版本差异，不宜完全标为通过 |
| Dixon 有壁效应 | `PressureDrop_script.js:280-286` | 粘性项乘 $(1+2\alpha/[3(1-\epsilon)N])^2$，惯性过渡项加入 $(1-e^{-0.22N})$ | 通过 | 已修复 | 保持；注明 $\alpha=0.564$ 主要针对球形颗粒和有限 $N$ 范围 | 已补齐公开摘要中壁效应衰减项；代码、弹窗和 Theory.md 已一致 |
| KTA | `PressureDrop_script.js:289-301` | $f_k=160/Re_m+3/Re_m^{0.1}$，$\Delta P=L\rho u_0^2(1-\epsilon)f_k/(\epsilon^3d_p)$ | 通过 | 无 | 保持；说明 KTA 模型主要面向球形/球床与核工程固定床，非球形床需谨慎 | 公开核工程文献把 KTA 作为 packed/pebble-bed 摩擦因子参考；代码维度闭合 |
| 结果单位 | `PressureDrop_script.js:787-830` | 输入 SI，输出 Pa/kPa 显示 | 通过 | 无 | 保持 | 量纲闭合 |

### 4.2 `Tube_pressure_drop`

| 模型/公式 | 代码位置 | 当前实现 | 判定 | 问题类型 | 建议正确形式 | 依据/备注 |
|---|---:|---|---|---|---|---|
| Darcy-Weisbach | `TubePressureDrop_script.js:290-301` | $\Delta P=f(L/D)\rho u_0^2/2$ | 通过 | 无 | 保持；明确 $f$ 是 Darcy friction factor，不是 Fanning friction factor | 维度和工程通用形式正确 |
| Reynolds 数 | `TubePressureDrop_script.js:305-313` | $Re=\rho u_0D/\mu$，$\epsilon_r=\epsilon_{rough}/D$ | 通过 | 无 | 保持；粗糙度输入单位应继续注明 mm | 代码已将 mm 转 m |
| 层流摩擦因子 | `TubePressureDrop_script.js:320` | $f=64/Re$ | 通过 | 无 | 保持 | 适用于 Darcy 摩擦因子 |
| 过渡区插值 | `TubePressureDrop_script.js:323-349` | $Re=2300$ 与 $Re=4000$ 间线性插值 | 中等 | 模型经验性 | 标注“工程近似”，不要写成标准唯一公式 | 过渡区摩擦因子本身无唯一标准 |
| Blasius | `TubePressureDrop_script.js:355-357` | $f=0.316/Re^{0.25}$ | 轻微 | 系数精度 | 可改为 $0.3164Re^{-0.25}$ 或保留 0.316 并注明近似 | 对结果影响小 |
| Colebrook-White | `TubePressureDrop_script.js:367-386` | Swamee-Jain 初值 + Colebrook 迭代 | 通过 | 无 | 保持 | 形式正确 |
| 局部阻力 | `TubePressureDrop_script.js:394-481` | 弯头、突然收缩、突然扩张的 $K$ 值经验近似 | 中等 | 适用范围不足 | 标注为估算；弯头应区分长半径/短半径/标准件，收缩应区分锐边/圆角 | 当前可做教学估算，不宜宣称高精度 |

### 4.3 `Trickle-bed-pressure-drop`

| 模型/公式 | 代码位置 | 当前实现 | 判定 | 问题类型 | 建议正确形式 | 依据/备注 |
|---|---:|---|---|---|---|---|
| 单相 Ergun 基准 | `TrickleBedPressureDrop_script.js:259-263` | 对液相/气相分别用 Ergun 单相压降 | 通过 | 无 | 保持；说明 $u_L,u_G$ 为表观速度 | 单相基准维度正确 |
| Lockhart-Martinelli | `TrickleBedPressureDrop_script.js:267-282` | $X=\sqrt{\Delta P_L/\Delta P_G}$，$\phi_L^2=1+C/X+1/X^2$，$C=20$ | 中等 | 流型限制 | $C=20$ 仅适用于湍流-湍流型 Chisholm 参数；应根据相态流型或允许用户选择 | 结构为 LM 标准形式，但不能无条件固定 $C=20$ |
| Larkins-White-Jeffrey | `TrickleBedPressureDrop_script.js:286-300` | $\phi_L^2=1+40(u_G/u_L)(\rho_G/\rho_L)^{0.5}Re_L^{-0.2}$ | 待文献确认 | 原式核验不足 | 核对 Larkins 等 1961 packed-bed 原文；当前只可标为经验近似 | 文献索引确认该类模型存在，但未核实当前常数和指数 |
| Sato et al. 关联式 | `TrickleBedPressureDrop_script.js:304-316` | $X=(\Delta P_L/\Delta P_G)^{1/2}$，$\phi_L=1.30+1.85X^{-0.85}$，$\Delta P_{TP}=\Delta P_L\phi_L^2$ | 通过 | 已修复 | 保持；在 UI 中提示 $0.1 < X < 20$，超出范围应警告 | 公开转引与 Sato et al. 1973 形式一致；旧版任意 $We$ 幂函数和裁剪已删除 |
| Attou-Boyer-Ferschneider型三相阻力闭合 | `TrickleBedPressureDrop_script.js:319-394` | 由 $F_{LS}$、$F_{GL}$ 阻力闭合求解 $\alpha_G$，再用 $\Delta P=L F_{GL}/\varepsilon_G$ 输出摩擦压降 | 中等 | 模型简化 | 当前已比旧版任意放大式更接近 Attou 型机理形式；若要完整原模型，应加入重力、轴向加速度、润湿/流型判据并核对原文所有闭合项 | 使用公开转引的阻力形式实现；但不是完整一维 CFD 模型，不能标为完全通过 |
| Holub原始模型 | `TrickleBedPressureDrop_script.js:397-399`；`TrickleBedPressureDrop_index.html:255-258` | 旧版 $\Psi$ 切换式已删除，复选框默认禁用；若强行调用会抛出“未实现”错误 | 通过 | 已修复误导输出 | 保持禁用，待原文方程、液持率联立和滑移/剪切因子补齐后再启用 | Holub 摘要说明原模型同时预测压降、液持率和流型转变；旧版单一切换式不应输出 |

### 4.4 `Gas-solid-coefficients`

| 模型/公式 | 代码位置 | 当前实现 | 判定 | 问题类型 | 建议正确形式 | 依据/备注 |
|---|---:|---|---|---|---|---|
| $Re,Sc,Pr$ | `GasSolidCoefficients_script.js:102-104` | $Re=\rho u d_p/\mu$，$Sc=\mu/(\rho D_{AB})$，$Pr=\mu C_p/k_f$ | 通过 | 无 | 保持 | 维度正确 |
| Ranz-Marshall / Froessling | `GasSolidCoefficients_script.js:114-129` | $Sh=2+0.6Re^{0.5}Sc^{1/3}$ | 中等 | 适用对象 | 若模块强调“固定床气固”，需提示其更接近孤立球/稀疏床外部传质 | 公式本身常见且维度正确 |
| Wakao-Funazkri | `GasSolidCoefficients_script.js:121-122` | $Sh=2+1.1Re^{0.6}Sc^{1/3}$ | 通过 | 无 | 保持；补充 $3<Re<10000$ 量级范围 | Wakao-Funazkri 摘要明确给出该式 |
| Rowe | `GasSolidCoefficients_script.js:135-136` | $Sh=1.1(Re^{0.5}+0.2Re^{0.67})Sc^{0.33}$ | 待文献确认 | 原式核验不足 | 补充 Rowe 原文与适用范围；若是 packed-bed 传质，说明是否缺少常数 2 | 当前公开资料不足 |
| Ranz-Marshall heat | `GasSolidCoefficients_script.js:143-144` | $Nu=2+0.6Re^{0.5}Pr^{1/3}$ | 中等 | 适用对象 | 标注为单颗粒/稀疏颗粒近似，不宜作为密集固定床默认推荐 | 维度正确 |
| Gnielinski固定床 | `GasSolidCoefficients_script.js:150-156` | $Nu=f_a[2+\sqrt{Nu_{lam}^2+Nu_{turb}^2}]$，$f_a=1+1.5(1-\epsilon)$，$Re_i=Re_p/\epsilon$ | 通过 | 已修复 | 保持；继续在适用范围中提示颗粒形状和 $Re,Pr,\epsilon$ 限制 | 与 packed-bed Gnielinski 公开参考实现一致 |
| Dittus-Boelter / Hausen 管内流参考 | `GasSolidCoefficients_script.js:160-169`；`GasSolidCoefficients_index.html:245-251` | 公式保留但不再默认选中，界面/弹窗/Theory.md 均标为管内流参考式 | 中等 | 非气固主模型 | 若后续要计算严格管内流，应增加水力直径输入；当前不得作为固定床颗粒外传热推荐值 | 本轮已完成重分类，避免默认把管内流式用于气固颗粒换热 |

### 4.5 `Dispersion-coefficients`

| 模型/公式 | 代码位置 | 当前实现 | 判定 | 问题类型 | 建议正确形式 | 依据/备注 |
|---|---:|---|---|---|---|---|
| $Re,Sc,Pe_m$ | `DispersionCoefficients_script.js:337-339` | $Re=\rho u_0d_p/\mu$，$Sc=\mu/(\rho D_m)$，$Pe_m=ReSc$ | 通过 | 无 | 保持；说明 $u_0$ 是表观速度还是间隙速度 | 与常用质量弥散定义一致 |
| Edwards-Richardson 轴向 | `DispersionCoefficients_script.js:347-348` | $D_{ax}=u_0d_p[0.73\epsilon/(ReSc)+0.5/(1+9.7\epsilon/(ReSc))]$ | 通过 | 无 | 保持；注明适用粒径/Re/Sc 限制 | 与公开汇总中 Edwards-Richardson 型式一致 |
| Zehner-Schlünder / Gunn 轴向 | `DispersionCoefficients_script.js:351-358` | 以 $1/Pe$ 形式转为 $D=u_0d_p/Pe$ | 待文献确认 | 原式核验不足 | 补充原始文献；保留维度检查通过 | 维度闭合，但公开资料不足以确认全部常数 |
| Wakao-Kaguei 轴向 | `DispersionCoefficients_script.js:361` | $D_{ax}=\epsilon D_m+0.5u_0d_p$ | 中等 | 模型变体 | 说明该式与 $1/Pe=20/(ReSc)+1/2$ 等 Wakao/Funazkri 变体不同 | 不应与所有 Wakao 轴向弥散公式混称 |
| Edwards-Richardson / ZS / Gunn 径向 | `DispersionCoefficients_script.js:365-373` | 多个 $D_{rad}$ 相关式 | 待文献确认 | 原式核验不足 | 补充每个径向公式的来源和适用 $N$ 范围 | 维度闭合，但公开核验不足 |
| Bauer 径向 | `DispersionCoefficients_script.js:384-385`；弹窗 `:1356`；Theory `:172` | 代码、弹窗和 Theory.md 均使用 $Sc$ | 通过 | 已修复 | 保持；仍需补充 Bauer 原文适用范围 | 本轮已修正 $Pr/Sc$ 显示错误 |
| Specchia 径向 | `DispersionCoefficients_script.js:388-389`；弹窗 `:1426`；Theory `:184` | 代码、弹窗和 Theory.md 均统一为 $1/Pe_{rad}=\epsilon/(10ReSc)+1/12$ | 待文献确认 | 已消除一致性错误 | 保持当前一致形式，但需核对 Specchia 质量弥散原文；热弥散的 $8.65/19.4$ 形式已放在热导模块处理 | 本轮已消除代码-文档冲突，但未把该式标为文献通过 |

### 4.6 `Thermal-conductivity`

| 模型/公式 | 代码位置 | 当前实现 | 判定 | 问题类型 | 建议正确形式 | 依据/备注 |
|---|---:|---|---|---|---|---|
| $Re,Pr,Pe$ | `ThermalConductivity_script.js:672-681` | $Re=\rho u d_p/\mu$，$Pr=\mu C_p/k_f$，$Pe=RePr$ | 通过 | 无 | 保持 | 热弥散使用 $RePr$ 合理 |
| Yagi-Kunii 静态 | `ThermalConductivity_script.js:690-694` | 简化串并联热阻形式 | 待文献确认 | 原式核验不足 | 补充 Yagi-Kunii 原式、接触热阻/辐射项假设 | 维度闭合，但模型名与简化式需核实 |
| ZBS 静态 | `ThermalConductivity_script.js:701-726` | $B=1.25$ 固定，$\kappa=k_s/k_f$ | 中等 | 参数定义 | ZBS 中形状/结构参数通常依赖孔隙率、接触/形状参数；若固定 $B=1.25$，应说明是球形简化 | ZBS 是标准模型，但参数化不能泛化 |
| ZBS 含辐射 | `ThermalConductivity_script.js:758-794` | 使用 $B=1.25[(1-\epsilon)/\epsilon]^{10/9}$、Knudsen 修正、辐射比 $k_r$ | 待文献确认 | 原式核验不足 | 需核对 Zehner-Schlünder/Breitbach-Barthels 原式，尤其 $k_G,N,k_c$ 的定义 | 维度上多数为无量纲比值，但不能直接判为通过 |
| 轴向热弥散 | `ThermalConductivity_script.js:819-840` | $k_{ea}=k_0+0.5\,k_fRePr$，同时保留动态贡献输出 | 通过 | 已修复 | 保持；若 UI 需要，可进一步把动态贡献单独标注为 `disp_only` | 与有效导热“静态项 + 流动诱导项”的公开综述形式一致 |
| 径向热弥散 | `ThermalConductivity_script.js:858-881` | $K_5=8.65[1+19.4(d_p/d_t)^2]$，$k_{er}=k_0+k_fRePr/K_5$ | 通过 | 已修复 | 保持；继续提示 $D_t/d_p$ 适用范围 | 公开热传递公式给出 19.4，并明确 $k_{rad}=k_{rad,o}+k_{rad,g}$ |
| Theory/弹窗说明 | `ThermalConductivity_script.js:225-257`；`ThermalConductivity_Theory.md:98-121` | 弹窗和 Theory.md 已同步为“有效导热 = 静态项 + 动态弥散项” | 通过 | 已修复 | 保持 | 代码、弹窗和 Theory.md 现已一致 |

### 4.7 `Wall-thermal-conductivity`

| 模型/公式 | 代码位置 | 当前实现 | 判定 | 问题类型 | 建议正确形式 | 依据/备注 |
|---|---:|---|---|---|---|---|
| $Re_p,Pr$ 基准 | `WallThermalConductivity_script.js:1007`；Theory `:37-49` | $Re_p=\rho u_0d_p/\mu$，$Nu_w=h_wd_p/k_f$ | 通过 | 无 | 保持 | 与模块 Theory.md 一致 |
| Leva / Leva et al. | `WallThermalConductivity_script.js:669-748` | 使用 $d_p/D_t$、$\exp(-6d_p/D_t)$ 或 $\exp(-4.6d_p/D_t)$ | 通过 | 无 | 保持；保留适用范围提示 | 与 Theory.md 表中公式一致 |
| Chu-Storrow | `WallThermalConductivity_script.js:752-763` | $0.134(dp/D_t)^{-0.13}(L_t/D_t)^{-0.9}Re_p^{1.17}$ | 通过 | 无 | 保持 | 与 Theory.md 一致 |
| Yagi-Wakao | `WallThermalConductivity_script.js:767-783`；弹窗 `:268` | 代码和弹窗均按 $h_wd_p/k_f$ 表示 | 通过 | 已修复 | 保持 | 代码、弹窗和 Theory.md 现已一致 |
| Kunii et al. | `WallThermalConductivity_script.js:787-795`；Theory `:60` | 代码固定 $C_1=0.2$ | 中等 | 参数默认值 | Theory.md 应说明 $C_1=0.2$ 的来源，或允许用户输入 $C_1$ | 当前文档只说 $C_1$，代码静默固定 |
| Olbrich、Li、Specchia、Colledge、Dixon、Peters、Martin、Demirel、Laguerre、Das | `WallThermalConductivity_script.js:619-858` | 常数和指数与 Theory.md 列表基本一致 | 通过 | 无 | 保持；但应对超出适用范围给警告 | 该模块是全仓库公式一致性较好的模块之一 |
| 未暴露函数 | `WallThermalConductivity_script.js:630-666` | Dixon-Cresswell、De Wasch-Froment、Specchia 另有函数但未在主要表中展示 | 轻微 | 死代码/未说明模型 | 若未使用可删除；若未来启用需补充 Theory.md 和弹窗 | 避免维护时误用未经审查公式 |

### 4.8 `Overall-thermal-coefficient`

| 模型/公式 | 代码位置 | 当前实现 | 判定 | 问题类型 | 建议正确形式 | 依据/备注 |
|---|---:|---|---|---|---|---|
| $Re_p,Pr$ | `OverallThermalCoefficient_script.js:426-436` | $Re_p=\rho u_0d_p/\mu$，$Pr=C_p\mu/k_f$ | 通过 | 无 | 保持 | 维度正确 |
| 壁面 Nusselt | `OverallThermalCoefficient_script.js:440-451` | $Nu_w=(0.5Re_p^{0.5}+0.2Re_p^{2/3})Pr^{1/3}$，$h_w=Nu_wk_f/d_p$ | 通过 | 已修复 | 保持；后续仍可替换为 `Wall-thermal-conductivity` 中可选壁面关联式 | 同仓库壁面传热模块和 Theory.md 均定义 $Nu_w=h_wd_p/k_f$ |
| 静态有效导热 $k_e$ | `OverallThermalCoefficient_script.js:459` | $k_e=k_f[\epsilon+(1-\epsilon)(k_s/k_f)/(1+0.1k_s/k_f)]$ | 中等 | 简化模型 | 改用与 `Thermal-conductivity` 一致的 ZBS/Yagi-Kunii 静态模型，或说明这是内部近似 | 该式不是 ZBS 标准表达 |
| 有效径向导热 $k_{er}$ | `OverallThermalCoefficient_script.js:466-467` | $k_{er}=k_e+k_fRe_pPr/[8.65(1+19.4(d_p/D_t)^2)]$ | 通过 | 已修复 | 保持；若追求统一，可直接复用 `Thermal-conductivity` 的静态导热模型 | 公开固定床热传递公式包含 $D_t/d_p$ 修正 |
| 完整模型 Bessel 项 | `OverallThermalCoefficient_script.js:473-491` | $1/U=1/h_w + D_t[ I_0(N_w)/(N_wI_1(N_w))]/(2k_{er})$ | 待文献确认 | 模型来源 | 保留但补充来源；并避免称“完整模型”除非给出边界条件推导 | 维度闭合，但公开摘要中常见总传热近似还包括不同的 $\beta/Bi$ 修正 |
| 简化模型 | `OverallThermalCoefficient_script.js:555-557` | $1/U=1/h_w+D_t/(4k_{er})$ | 中等 | 近似说明不足 | 建议命名为“工程近似”；如采用 Dixon 改进式，应使用 $R_t( Bi+3)/(3k_r(Bi+4))$ | Dixon 1996 摘要给出不同的 Biot 依赖形式 |
| 外部壁/管壁热阻 | `OverallThermalCoefficient_Theory.md:1-14` 与脚本 | Theory.md 讨论内/外表面积和管壁热阻；脚本只算床层到内壁 | 中等 | 文档-代码范围不一致 | UI 和 Theory.md 应明确脚本计算的是床层内侧等效 $U$，不含管壁导热与外侧换热 | 防止用户把结果当成全换热器总传热系数 |

## 5. 本轮修复记录

| 编号 | 修复项 | 涉及文件 | 修复后状态 |
|---:|---|---|---|
| 1 | `Thermal-conductivity` 轴向/径向有效导热恢复静态项，径向 $K_5$ 常数由 `1.94` 改为 `19.4` | `ThermalConductivity_script.js`、`ThermalConductivity_Theory.md` | 严重项已关闭 |
| 2 | `Overall-thermal-coefficient` 的 $h_w$ 特征长度由 $D_t$ 改为 $d_p$，$k_{er}$ 改为含 $D_t/d_p$ 的径向热弥散形式 | `OverallThermalCoefficient_script.js`、`OverallThermalCoefficient_Theory.md` | 严重项已关闭 |
| 3 | `Gas-solid-coefficients` 的 Gnielinski 改为固定床形式；Dittus-Boelter/Hausen 改为非默认管内流参考式 | `GasSolidCoefficients_script.js`、`GasSolidCoefficients_index.html`、`GasSolidCoefficients_Theory.md` | 严重项已关闭；管内参考式仍为中等风险 |
| 4 | `Trickle-bed-pressure-drop` 的 Sato 改为 Sato et al. Lockhart-Martinelli 型关联式；Attou 改为三相阻力闭合；Holub 旧版伪模型禁用 | `TrickleBedPressureDrop_script.js`、`TrickleBedPressureDrop_index.html`、`TrickleBedPressureDrop_Theory.md` | Sato 已通过；Attou 为中等风险摩擦闭合；Holub 误导输出已关闭 |
| 5 | `Dispersion-coefficients` 修正 Bauer 的 $Pr/Sc$ 显示错误，并统一 Specchia 的代码/弹窗/Theory.md 形式 | `DispersionCoefficients_script.js`、`DispersionCoefficients_Theory.md` | 一致性错误已关闭；Specchia 质量式仍待原文确认 |
| 6 | `Wall-thermal-conductivity` 修正 Yagi-Wakao 弹窗符号 $d_t \rightarrow d_p$ | `WallThermalConductivity_script.js` | 轻微项已关闭 |
| 7 | `Pressure-drop` 核对 Eisfeld-Schnitzlein/KTA，并修正 Dixon 有壁效应式的 $(1-e^{-0.22N})$ 缺失项 | `PressureDrop_script.js`、`PressureDrop_Theory.md` | Eisfeld/KTA 已通过；Dixon 有壁效应已修复；Dixon 无壁效应版本差异仍为中等风险 |

## 6. 需要原文进一步确认的项目

以下项目公开资料不足，不能判定为“通过”：

- `Pressure-drop`：Dixon 无壁效应式中 $Re_m+52$ 与公开会议摘要 $Re_m+60.0$ 的版本差异；Dixon 有壁效应式的 $\alpha=0.564$ 适用边界仍需正式原文确认。
- `Trickle-bed-pressure-drop`：Larkins-White-Jeffrey 的当前常数和指数；Attou 型若要升为完全原文模型，需要加入重力、轴向加速度和完整闭合项；Holub 型需要按原文液持率-压降联立模型重写。
- `Dispersion-coefficients`：Zehner-Schlünder/Gunn 径向与轴向公式、Bauer 几何项、Specchia 质量弥散式。
- `Thermal-conductivity`：Yagi-Kunii 静态简化式、ZBS 含辐射完整参数定义。
- `Overall-thermal-coefficient`：Bessel 完整模型的边界条件、$N_w$ 定义和与文献中 Biot 数形式的关系。

## 7. 修复后回归检查要求

- JavaScript 语法检查：对本轮触及的 6 个 `*_script.js` 运行 `node --check`。
- 公式一致性检查：复查 `1.94`、`h_w=Nu_wk_f/D_t`、Bauer `RePr`、Specchia `8.65/19.4` 误放在质量弥散模块等旧错误是否仍残留。
- 文档一致性检查：确认脚本、弹窗公式和 Theory.md 对同一模型使用相同常数、变量基准和适用性说明。
