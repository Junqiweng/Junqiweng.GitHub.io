import numpy as np
import matplotlib.pyplot as plt
from zbs_thermal_conductivity import calculate_zbs_effective_thermal_conductivity


def compare_parameters_effect():
    """比较不同参数对ZBS模型有效热导率的影响"""

    # 基准参数
    k_f = 0.026  # 空气在常温下的热导率 (W/(m·K))
    k_s = 10.0  # 固体热导率 (W/(m·K))
    epsilon = 0.4  # 床层孔隙率
    d_p = 0.003  # 颗粒直径 3mm
    T = 300  # 温度 (K)
    P = 101325  # 大气压 (Pa)
    M_g = 0.029  # 空气的摩尔质量 (kg/mol)
    C_p = 1005  # 空气的比热容 (J/(kg·K))
    epsilon_r = 0.9  # 辐射发射率
    phi = 0.9  # 形状因子

    # 创建一个2x2的子图布局
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))

    # 1. 研究孔隙率的影响
    epsilon_values = np.linspace(0.1, 0.9, 50)
    k_eff_epsilon = []

    for eps in epsilon_values:
        k_eff = calculate_zbs_effective_thermal_conductivity(
            k_f, k_s, eps, d_p, T, P, M_g, C_p, epsilon_r=epsilon_r, phi=phi
        )
        k_eff_epsilon.append(k_eff / k_f)  # 归一化有效热导率

    axes[0, 0].plot(epsilon_values, k_eff_epsilon, "b-", linewidth=2)
    axes[0, 0].set_xlabel("孔隙率 ε")
    axes[0, 0].set_ylabel("相对热导率 k_eff/k_f")
    axes[0, 0].set_title("孔隙率对有效热导率的影响")
    axes[0, 0].grid(True)

    # 2. 研究温度的影响
    T_values = np.linspace(200, 1000, 50)  # 温度范围从200K到1000K
    k_eff_T = []

    for temp in T_values:
        k_eff = calculate_zbs_effective_thermal_conductivity(
            k_f,
            k_s,
            epsilon,
            d_p,
            temp,
            P,
            M_g,
            C_p,
            epsilon_r=epsilon_r,
            phi=phi,
        )
        k_eff_T.append(k_eff / k_f)

    axes[0, 1].plot(T_values, k_eff_T, "r-", linewidth=2)
    axes[0, 1].set_xlabel("温度 T (K)")
    axes[0, 1].set_ylabel("相对热导率 k_eff/k_f")
    axes[0, 1].set_title("温度对有效热导率的影响")
    axes[0, 1].grid(True)

    # 3. 研究颗粒直径的影响
    d_p_values = np.logspace(-5, -2, 50)  # 颗粒直径从10微米到1厘米
    k_eff_dp = []

    for dp in d_p_values:
        k_eff = calculate_zbs_effective_thermal_conductivity(
            k_f, k_s, epsilon, dp, T, P, M_g, C_p, epsilon_r=epsilon_r, phi=phi
        )
        k_eff_dp.append(k_eff / k_f)

    axes[1, 0].semilogx(d_p_values, k_eff_dp, "g-", linewidth=2)
    axes[1, 0].set_xlabel("颗粒直径 d_p (m)")
    axes[1, 0].set_ylabel("相对热导率 k_eff/k_f")
    axes[1, 0].set_title("颗粒直径对有效热导率的影响")
    axes[1, 0].grid(True)

    # 4. 研究固体/流体热导率比的影响
    k_s_values = np.logspace(0, 4, 50) * k_f  # k_s从k_f到10000*k_f
    k_eff_ratio = []

    for k_s_val in k_s_values:
        k_eff = calculate_zbs_effective_thermal_conductivity(
            k_f, k_s_val, epsilon, d_p, T, P, M_g, C_p, epsilon_r=epsilon_r, phi=phi
        )
        k_eff_ratio.append(k_eff / k_f)

    axes[1, 1].loglog(k_s_values / k_f, k_eff_ratio, "m-", linewidth=2)
    axes[1, 1].set_xlabel("热导率比 k_s/k_f")
    axes[1, 1].set_ylabel("相对热导率 k_eff/k_f")
    axes[1, 1].set_title("固体/流体热导率比对有效热导率的影响")
    axes[1, 1].grid(True)

    plt.tight_layout()
    plt.savefig("zbs_parameter_study.png", dpi=300)
    plt.show()

    # 打印基准值计算结果
    k_eff_base = calculate_zbs_effective_thermal_conductivity(
        k_f, k_s, epsilon, d_p, T, P, M_g, C_p, epsilon_r=epsilon_r, phi=phi
    )

    # 计算固体与流体热导率的比值
    k_s_ratio = k_s / k_f

    print(f"基准参数下的计算结果:")
    print(f"流体热导率 k_f = {k_f} W/(m·K)")
    print(f"固体热导率 k_s = {k_s:.4f} W/(m·K)")
    print(f"固体/流体热导率比值 k_s/k_f = {k_s_ratio:.4f}")
    print(f"有效热导率 k_eff = {k_eff_base:.4f} W/(m·K)")
    print(f"相对热导率 k_eff/k_f = {k_eff_base/k_f:.4f}")


if __name__ == "__main__":
    compare_parameters_effect()
