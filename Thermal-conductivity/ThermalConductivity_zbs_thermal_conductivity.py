import numpy as np
import matplotlib.pyplot as plt


def calculate_zbs_effective_thermal_conductivity(
    k_f,  # 流体的热导率
    k_s,  # 固体的热导率
    epsilon,  # 床层孔隙率
    d_p,  # 颗粒直径
    T,  # 温度 (K)
    P,  # 压力 (Pa)
    M_g,  # 气体摩尔质量 (kg/mol)
    C_p,  # 气体比热容 (J/(kg·K))
    sigma=5.67e-8,  # Stefan-Boltzmann常数 (W/(m^2·K^4))
    epsilon_r=0.8,  # 辐射发射率
    phi=0.0077,  # 形状因子
):
    """
    计算Zehner, Bauer和Schlünder模型(ZBS)的有效传热系数

    参数:
    -----
    k_f : 流体的热导率 (W/(m·K))
    k_s : 固体的热导率 (W/(m·K))
    epsilon : 床层孔隙率
    d_p : 颗粒直径 (m)
    T : 温度 (K)
    P : 压力 (Pa)
    M_g : 气体摩尔质量 (kg/mol)
    C_p : 气体比热容 (J/(kg·K))
    sigma : Stefan-Boltzmann常数 (W/(m^2·K^4))
    epsilon_r : 辐射发射率
    phi : 形状因子

    返回:
    -----
    k_eff : 有效热导率 (W/(m·K))
    """
    # 计算固体与流体热导率的比值
    k_s_f = k_s / k_f

    # 变形参数B (deformation parameter)
    # 根据公式中提到的Zehner and Schlünder (1970)
    B = 1.25 * ((1 - epsilon) / epsilon) ** (10 / 9)

    # 辐射参数 (eq. 62)
    k_r = (4 * sigma * T**3 * d_p) / (2 / epsilon_r - 1) / k_f

    # Knudsen参数 (eq. 63)
    # 计算气体分子的修正自由程 (eq. 64)
    R = 8.314  # 气体常数 (J/(mol·K))
    a_T = 1  # 热适应系数，通常取1.0
    l = (
        2
        * (2 - a_T)
        / a_T
        * np.sqrt(2 * np.pi * R * T / M_g)
        * k_f
        / (P * (2 * C_p - R / M_g))
    )

    # 气体导热相关的Knudsen参数 (eq. 63)
    k_G = 1 / (1 + l / d_p)

    # 计算N参数 (eq. 61)
    N = 1 / k_G * (1 + (k_r - B * k_G) / k_s_f) - B * (1 / k_G - 1) * (1 + k_r / k_s_f)

    # 计算k_c参数 (eq. 60)
    k_c_term1 = (
        2
        / N
        * (
            B
            * (k_s_f + k_r - 1)
            / (N**2 * k_G * k_s_f)
            * np.log((k_s_f + k_r) / (B * (k_G + (1 - k_G) * (k_s_f + k_r))))
        )
    )
    k_c_term2 = (
        2 / N * (B + 1) / (2 * B) * (k_r / k_G - B * (1 + (1 - k_G) / k_G * k_r))
    )
    k_c_term3 = -2 / N * (B - 1) / (N * k_G)
    k_c = k_c_term1 + k_c_term2 + k_c_term3

    # 计算有效热导率 (eq. 59)
    k_eff_f = (
        (1 - np.sqrt(1 - epsilon)) * epsilon * ((epsilon - 1 + 1 / k_G) ** (-1) + k_r)
    ) + np.sqrt(1 - epsilon) * (phi * k_s_f + (1 - phi) * k_c)

    # 最终结果为实际热导率值
    return k_eff_f * k_f


# 示例计算
if __name__ == "__main__":
    # 示例参数
    k_f = 0.03  # 空气在常温下的热导率 (W/(m·K))
    k_s = 1.5  # 固体热导率 (W/(m·K))
    epsilon = 0.4  # 典型的床层孔隙率
    d_p = 0.003  # 颗粒直径 3mm
    T = 300  # 温度 (K)
    P = 101325  # 大气压 (Pa)
    M_g = 0.029  # 空气的摩尔质量 (kg/mol)
    C_p = 1005  # 空气的比热容 (J/(kg·K))

    # 计算有效热导率
    k_eff = calculate_zbs_effective_thermal_conductivity(
        k_f, k_s, epsilon, d_p, T, P, M_g, C_p
    )

    # 计算固体与流体热导率的比值
    k_s_f = k_s / k_f

    print(f"参数设置:")
    print(f"流体热导率 k_f = {k_f} W/(m·K)")
    print(f"固体热导率 k_s = {k_s} W/(m·K)")
    print(f"固体/流体热导率比值 k_s/k_f = {k_s_f}")
    print(f"孔隙率 epsilon = {epsilon}")
    print(f"颗粒直径 d_p = {d_p} m")
    print(f"温度 T = {T} K")
    print(f"压力 P = {P} Pa")
    print(f"气体摩尔质量 M_g = {M_g} kg/mol")
    print(f"气体比热容 C_p = {C_p} J/(kg·K)")
    print(f"\n计算结果:")
    print(f"有效热导率 k_eff = {k_eff:.4f} W/(m·K)")
    print(f"相对热导率 k_eff/k_f = {k_eff/k_f:.4f}")
