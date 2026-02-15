/**
 * Calculadora de Orçamento — Preço Certo
 * 
 * Modo: Empreitada (Preço Fixo por Serviço)
 * 
 * Fórmula:
 *   1. Serviços = soma dos preços dos serviços adicionados
 *   2. Deslocamento = (distância / consumo × preço combustível) + (distância × manutenção)
 *   3. Materiais = soma dos materiais (se fornecidos pelo profissional)
 *   4. Ferramentas = depreciação mensal / jobs por mês
 *   5. Subtotal = Serviços + Deslocamento + Materiais + Ferramentas
 *   6. Impostos = Subtotal × taxa%
 *   7. Margem = (Subtotal + Impostos) × 10%
 *   8. Total = Subtotal + Impostos + Margem
 * 
 * Horas: apenas métrica interna (não afeta preço cobrado)
 */
export const calculateBudget = (data, settings) => {
    const {
        distance = 0,
        supplies = 0,
        totalHours = 0,
        additionalServices = []
    } = data;

    const {
        fuelPrice = 5.50,
        fuelConsumption = 10,
        maintenanceCost = 0.20,
        hourlyRate = 50,
        toolKitValue = 3000,
        taxRate = 5
    } = settings;

    // 1. Serviços (Preço fixo de cada serviço adicionado)
    const servicesTotal = additionalServices.reduce(
        (acc, item) => acc + (parseFloat(item.price) || 0), 0
    );

    // 2. Deslocamento
    const fuelCost = fuelConsumption > 0 ? (distance / fuelConsumption) * fuelPrice : 0;
    const vehicleMaintenance = distance * maintenanceCost;
    const displacementCost = fuelCost + vehicleMaintenance;

    // 3. Ferramentas (Depreciação por serviço)
    const monthlyDepreciation = toolKitValue * 0.01;
    const jobsPerMonth = 40;
    const toolCost = monthlyDepreciation / jobsPerMonth;

    // 4. Subtotal
    const subtotal = servicesTotal + displacementCost + supplies + toolCost;

    // 5. Impostos
    const taxAmount = subtotal * (taxRate / 100);

    // 6. Margem de segurança (10%)
    const margin = (subtotal + taxAmount) * 0.10;

    // 7. Total Final
    const finalPrice = subtotal + taxAmount + margin;

    // Métricas internas (não afetam preço)
    const internalLaborCost = totalHours * hourlyRate;

    return {
        breakdown: {
            services: servicesTotal,
            displacement: displacementCost,
            supplies: supplies,
            tools: toolCost,
            taxes: taxAmount,
            margin: margin
        },
        total: finalPrice,
        internalMetrics: {
            realLaborCost: internalLaborCost,
            effectiveHourlyRate: totalHours > 0
                ? (finalPrice / totalHours)
                : 0
        }
    };
};
