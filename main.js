async function fetchSelicRateFromIpeaData() {
    const today = new Date();
    const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Pegando o primeiro dia do mês anterior
    const lastMonthString = `${lastMonthDate.getFullYear()}-${(lastMonthDate.getMonth() + 1).toString().padStart(2, '0')}-01`; // Formatando a data para YYYY-MM-DD

    const url = `http://ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='BM12_TJOVER12')?$filter=VALDATA eq ${lastMonthString}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.value && data.value.length > 0) {
            let correctData = data.value.find(item => item.VALDATA.startsWith(lastMonthString));
            if (correctData) {
                const monthlyRate = correctData.VALVALOR / 100; // Convertendo porcentagem para decimal
                const annualRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100; // Convertendo taxa mensal para anual
                document.getElementById('selicRate').textContent = `Taxa Selic de ${lastMonthString.slice(0, 7)} convertida para anual: ${annualRate.toFixed(2)}% a.a.`;
            } else {
                document.getElementById('selicRate').textContent = 'Taxa Selic do mês anterior: Dados específicos não encontrados';
            }
        } else {
            document.getElementById('selicRate').textContent = 'Taxa Selic do mês anterior: Dados não disponíveis';
        }
    } catch (error) {
        console.error('Erro ao buscar taxa Selic:', error);
        document.getElementById('selicRate').textContent = 'Taxa Selic do mês anterior: Erro ao carregar dados';
    }
}

async function fetchCDIRateFromIpeaData() {
    const today = new Date();
    const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Pegando o primeiro dia do mês anterior
    const lastMonthString = `${lastMonthDate.getFullYear()}-${(lastMonthDate.getMonth() + 1).toString().padStart(2, '0')}-01`; // Formatando a data para YYYY-MM-DD

    const url = `http://ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='BM12_TJCDI12')?$filter=VALDATA eq ${lastMonthString}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.value && data.value.length > 0) {
            let correctData = data.value.find(item => item.VALDATA.startsWith(lastMonthString));
            if (correctData) {
                const monthlyRate = correctData.VALVALOR / 100; // Convertendo porcentagem para decimal
                const annualRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100; // Convertendo taxa mensal para anual
                document.getElementById('cdiRate').textContent = `CDI do mês anterior convertido para anual: ${annualRate.toFixed(2)}% a.a.`;
            } else {
                document.getElementById('cdiRate').textContent = 'CDI do mês anterior: Dados específicos não encontrados';
            }
        } else {
            document.getElementById('cdiRate').textContent = 'CDI do mês anterior: Dados não disponíveis';
        }
    } catch (error) {
        console.error('Erro ao buscar taxa CDI:', error);
        document.getElementById('cdiRate').textContent = 'CDI do mês anterior: Erro ao carregar dados';
    }
}

async function fetchIPCARateFromIpeaData() {
    const today = new Date();
    const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Pegando o primeiro dia do mês anterior
    const lastMonthString = `${lastMonthDate.getFullYear()}-${(lastMonthDate.getMonth() + 1).toString().padStart(2, '0')}-01`; // Formatando a data para YYYY-MM-DD

    const url = `http://ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='PRECOS12_IPCAG12')?$filter=VALDATA eq ${lastMonthString}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.value && data.value.length > 0) {
            let correctData = data.value.find(item => item.VALDATA.startsWith(lastMonthString));
            if (correctData) {
                const annualRate = correctData.VALVALOR; // IPCA já é fornecido como uma taxa anual
                document.getElementById('ipcaRate').textContent = `IPCA do mês anterior: ${annualRate.toFixed(2)}% a.a.`;
            } else {
                document.getElementById('ipcaRate').textContent = 'IPCA do mês anterior: Dados específicos não encontrados';
            }
        } else {
            document.getElementById('ipcaRate').textContent = 'IPCA do mês anterior: Dados não disponíveis';
        }
    } catch (error) {
        console.error('Erro ao buscar taxa IPCA:', error);
        document.getElementById('ipcaRate').textContent = 'IPCA do mês anterior: Erro ao carregar dados';
    }
}




document.addEventListener('DOMContentLoaded', function() {
    const yearsSelect = document.getElementById('yearsInput');
    for (let i = 1; i <= 50; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearsSelect.appendChild(option);
    }

    // const yearsSelect = document.getElementById('yearsInput');
    const periodTypeSelect = document.getElementById('periodType');
    const rateInput = document.getElementById('rateInput');
    const rateTypeSelect = document.getElementById('rateType');
    const monthlyContributionInput = document.getElementById('monthlyContributionInput');
    const totalInvestmentEl = document.getElementById('totalInvestment');
    const finalWealthEl = document.getElementById('finalWealth');
    const profitEl = document.getElementById('profit');
    const monthlyIncomeEl = document.getElementById('monthlyIncome');

    function calculateResults() {
        const years = parseInt(yearsSelect.value);
        const periodType = periodTypeSelect.value;
        const rate = parseFloat(rateInput.value);
        const rateType = rateTypeSelect.value;
        const monthlyContribution = parseFloat(monthlyContributionInput.value);

        const totalPeriods = periodType === 'year' ? years * 12 : years;
        const actualRate = rateType === 'annual' ? (Math.pow(1 + rate / 100, 1/12) - 1) * 100 : rate;
        
        const totalInvestment = totalPeriods * monthlyContribution;
        totalInvestmentEl.textContent = `R$ ${totalInvestment.toFixed(2)}`;

        let finalWealth = 0;
        for (let m = 1; m <= totalPeriods; m++) {
            finalWealth += monthlyContribution * (Math.pow(1 + actualRate / 100, totalPeriods - m + 1));
        }
        finalWealthEl.textContent = `R$ ${finalWealth.toFixed(2)}`;

        const profit = finalWealth - totalInvestment;
        profitEl.textContent = `R$ ${profit.toFixed(2)}`;

        const monthlyIncome = finalWealth * (actualRate / 100);
        monthlyIncomeEl.textContent = `R$ ${monthlyIncome.toFixed(2)}`;
    }

    yearsSelect.addEventListener('change', calculateResults);
    periodTypeSelect.addEventListener('change', calculateResults);
    rateInput.addEventListener('input', calculateResults);
    rateTypeSelect.addEventListener('change', calculateResults);
    monthlyContributionInput.addEventListener('input', calculateResults);


    fetchSelicRateFromIpeaData();
    fetchCDIRateFromIpeaData();
    fetchIPCARateFromIpeaData();
});
