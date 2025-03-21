// ... [保持前面的代码不变直到 results.forEach] ...

    results.forEach((result) => {
        const value = formatNumber(result.value);
        let indication = '';
        if (results.length > 1) {
            if (result.value === minValue) indication = '<span class="min-value">▼ 最小</span>';
            if (result.value === maxValue) indication = '<span class="max-value">▲ 最大</span>';
        }
        
        output += `
        <tr>
            <td>
                ${result.name}
                <a href="#" class="info-link correlation-info" data-formula="${result.id}" title="查看公式">ℹ️</a>
            </td>
            <td class="value-column">
                <div class="value-with-unit">
                    <span class="value-number">${value}</span>
                    <span class="value-unit">W/m·K</span>
                    ${indication}
                </div>
            </td>
        </tr>`;
    });

// ... [保持其他代码不变] ...
