#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
固定床压降计算验证程序
=====================

此程序用于计算固定床反应器中的压降，实现5种不同的关联式，并比较它们的结果。
包括：Ergun方程、Eisfeld-Schnitzlein方程、Dixon方程(无壁面效应)、Dixon方程(有壁面效应)和KTA方程。

作者: Junqi
日期: 2024年
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt


class PressureDropCalculator:
    """固定床压降计算器"""

    def __init__(
        self,
        bed_length,
        void_fraction,
        particle_diameter,
        fluid_velocity,
        fluid_density,
        fluid_viscosity,
        column_diameter,
        particle_shape="球形",
    ):
        """
        初始化压降计算器

        参数:
            bed_length (float): 床层高度 (m)
            void_fraction (float): 空隙率
            particle_diameter (float): 颗粒直径 (m)
            fluid_velocity (float): 流体表观速度 (m/s)
            fluid_density (float): 流体密度 (kg/m³)
            fluid_viscosity (float): 流体粘度 (Pa·s)
            column_diameter (float): 柱直径 (m)
            particle_shape (str): 颗粒形状 ("球形", "圆柱形", "不规则形状")
        """
        self.L = bed_length
        self.epsilon = void_fraction
        self.dp = particle_diameter
        self.u0 = fluid_velocity
        self.rho = fluid_density
        self.mu = fluid_viscosity
        self.D = column_diameter
        self.shape = particle_shape

        # 计算特征参数
        self.Re = self.rho * self.u0 * self.dp / self.mu  # 颗粒雷诺数
        self.Re_m = self.Re / (1 - self.epsilon)  # 修正雷诺数
        self.N = self.D / self.dp  # 管径与颗粒直径之比

    def ergun(self):
        """
        Ergun方程计算压降

        返回值:
            float: 压降值 (Pa)
        """
        term1 = (
            150
            * (1 - self.epsilon) ** 2
            * self.mu
            * self.u0
            / (self.epsilon**3 * self.dp**2)
        )
        term2 = (
            1.75
            * (1 - self.epsilon)
            * self.rho
            * self.u0**2
            / (self.epsilon**3 * self.dp)
        )
        return self.L * (term1 + term2)

    def eisfeld_schnitzlein(self):
        """
        Eisfeld-Schnitzlein方程计算压降

        返回值:
            float: 压降值 (Pa)
        """
        # 根据颗粒形状选择系数
        if self.shape == "球形":
            K1, k1, k2 = 154, 1.15, 0.87
        elif self.shape == "圆柱形":
            K1, k1, k2 = 190, 2.00, 0.77
        else:  # 不规则形状
            K1, k1, k2 = 155, 1.42, 0.83

        # 计算壁面效应参数
        Aw = 1 + (2 / 3) / (self.N * (1 - self.epsilon))
        Bw = (k1 * (self.dp / self.D) ** 2 + k2) ** 2

        # 计算修正系数
        A = K1 * Aw**2
        B = Aw / Bw

        # 计算压降
        term1 = (
            A
            * (1 - self.epsilon) ** 2
            * self.mu
            * self.u0
            / (self.epsilon**3 * self.dp**2)
        )
        term2 = (
            B * (1 - self.epsilon) * self.rho * self.u0**2 / (self.epsilon**3 * self.dp)
        )
        return self.L * (term1 + term2)

    def dixon_no_wall(self):
        """
        Dixon方程(无壁面效应)计算压降

        返回值:
            float: 压降值 (Pa)
        """
        term1 = 160.0 / self.Re_m
        term2 = (0.922 + 16 / self.Re_m**0.46) * (self.Re_m / (self.Re_m + 52))
        return (
            self.L
            * self.rho
            * self.u0**2
            * (1 - self.epsilon)
            / (self.epsilon**3 * self.dp)
            * (term1 + term2)
        )

    def dixon_with_wall(self, alpha=0.564):
        """
        Dixon方程(有壁面效应)计算压降

        参数:
            alpha (float): 壁面系数，默认为0.564(球形颗粒)

        返回值:
            float: 压降值 (Pa)
        """
        term1 = (160 / self.Re_m) * (
            1 + (2 * alpha) / (3 * (1 - self.epsilon) * self.N)
        ) ** 2
        term2 = (0.922 + (16 / (self.Re_m**0.46))) * (self.Re_m / (self.Re_m + 52))
        return (
            self.L
            * self.rho
            * self.u0**2
            * (1 - self.epsilon)
            / (self.epsilon**3 * self.dp)
            * (term1 + term2)
        )

    def kta(self):
        """
        KTA方程计算压降

        返回值:
            float: 压降值 (Pa)
        """
        # 计算摩擦系数
        fk = 160 / self.Re_m + 3.0 / self.Re_m**0.1

        # 计算压降
        return (
            self.L
            * self.rho
            * self.u0**2
            * (1 - self.epsilon)
            / (self.epsilon**3 * self.dp)
            * fk
        )

    def calculate_all(self):
        """
        计算所有压降关联式的结果

        返回值:
            dict: 包含所有方程计算结果的字典
        """
        results = {
            "Ergun方程": self.ergun(),
            "Eisfeld-Schnitzlein方程": self.eisfeld_schnitzlein(),
            "Dixon方程(无壁面效应)": self.dixon_no_wall(),
            "Dixon方程(有壁面效应)": self.dixon_with_wall(),
            "KTA方程": self.kta(),
        }
        return results


def run_case_study(case_params, case_name="默认工况"):
    """
    运行工况研究，计算给定参数下的压降

    参数:
        case_params (dict): 工况参数字典
        case_name (str): 工况名称

    返回值:
        pd.DataFrame: 计算结果的DataFrame
    """
    calculator = PressureDropCalculator(**case_params)
    results = calculator.calculate_all()

    # 创建结果DataFrame
    df = pd.DataFrame(
        {
            "方程": list(results.keys()),
            "压降 (Pa)": list(results.values()),
            "压降 (kPa)": [p / 1000 for p in results.values()],
        }
    )

    # 计算方差和差异
    min_val = df["压降 (kPa)"].min()
    max_val = df["压降 (kPa)"].max()
    mean_val = df["压降 (kPa)"].mean()


    print("\n计算结果:")
    print(df.to_string(index=False))

    print(f"\n最小压降: {min_val:.4f} kPa")
    print(f"最大压降: {max_val:.4f} kPa")
    print(f"平均压降: {mean_val:.4f} kPa")
    print(
        f"最大差异: {max_val - min_val:.4f} kPa (差异率: {(max_val - min_val)/mean_val*100:.2f}%)"
    )

    # 绘制条形图表示结果
    plt.figure(figsize=(10, 6))
    colors = ["#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6"]

    # 创建英文方程名映射
    equation_name_map = {
        "Ergun方程": "Ergun",
        "Eisfeld-Schnitzlein方程": "Eisfeld-Schnitzlein",
        "Dixon方程(无壁面效应)": "Dixon (No Wall)",
        "Dixon方程(有壁面效应)": "Dixon (With Wall)",
        "KTA方程": "KTA",
    }

    # 使用英文标签
    english_labels = [equation_name_map.get(eq, eq) for eq in df["方程"]]

    bars = plt.bar(english_labels, df["压降 (kPa)"], color=colors)

    # 添加数据标签
    for bar in bars:
        height = bar.get_height()
        plt.text(
            bar.get_x() + bar.get_width() / 2.0,
            height + 0.05,
            f"{height:.2f}",
            ha="center",
            va="bottom",
        )

    plt.xlabel("Calculation Method")
    plt.ylabel("Pressure Drop (kPa)")
    plt.title("Comparison of Pressure Drop Results by Different Equations")
    plt.xticks(rotation=15, ha="right")
    plt.tight_layout()
    plt.grid(axis="y", linestyle="--", alpha=0.7)
    plt.show()
    return df


def main():
    """主函数"""
    # 默认工况参数
    default_params = {
        "bed_length": 1.0,  # 床层高度 (m)
        "void_fraction": 0.4,  # 空隙率
        "particle_diameter": 0.006,  # 颗粒直径 (m)
        "fluid_velocity": 1.0,  # 流体表观速度 (m/s)
        "fluid_density": 1.225,  # 流体密度 (kg/m³) - 空气
        "fluid_viscosity": 1.81e-5,  # 流体粘度 (Pa·s) - 空气
        "column_diameter": 0.03,  # 柱直径 (m)
        "particle_shape": "球形",  # 颗粒形状
    }

    # 运行默认工况
    run_case_study(default_params, "默认工况")

    print("\n计算完成！默认工况的结果已保存到 default_case_results.png")


if __name__ == "__main__":
    main()
