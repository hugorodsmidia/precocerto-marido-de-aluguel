export const calculateBudget = (data, settings) => {
    const {
        distance, // km
        selectedServices, // array of objects { name, value } (value is price? or just name?)
        // actually user prompt says "Service Price" comes from catalog.
        // But also "Hourly Rate".
        // "Custo Hora = Tempo Estimado * Valor Hora"
        // So distinct from "Service Price"?
        // Maybe "Service Price" IS the "Labor Cost"?
        // The prompt says: "Custo Hora = Tempo Estimado * Valor Hora" AND "Preço de serviços selecionados".
        // It's ambiguous. "Calculadora que some o custo de deslocamento + preço de serviços selecionados + insumos".
        // AND "Custo Hora = Tempo Estimado * Valor Hora".
        // Usage: Maybe "Price Catalog" is just a reference, and the ACTUAL cost is calculated by time?
        // OR the catalog has fixed prices.
        // Let's support BOTH: Base Service Price + Hourly Extra?
        // Let's go with:
        // Total = (KM Cost) + (Services Sum) + (Supplies) + (Tax/Tools) + Margin.
        // Where "Services Sum" MIGHT be based on time if the user chooses, or fixed price.
        // Users usually want fixed price *OR* hourly.
        // The prompt says:
        // 1. Custo Deslocamento
        // 2. Custo Hora
        // 3. Taxa Ferramenta/MEI
        // 4. Total Sugerido

        // It seems "Custo Hora" is the MAIN labor component. "Preço de serviços" might be the reference to help *estimate* the time or just a flat add-on?
        // Let's treat "Selected Services" as a list of "Items" to show in the PDF, but the *Value* comes from (Hours * Rate).
        // OR, if the user selected a "Fixed Price" service from Catalog, we use that.

        // DECISION: 
        // Inputs: Distance, Supplies, TotalHours.
        // Services: Just a list of names for the invoice/PDF.
        // CALCULATION:
        // 1. Displacement = (dist / kmL * fuelPrice) + (dist * maintenance)
        // 2. Labor = hours * hourlyRate
        // 3. Taxes = (Labor + Displacement) * taxRate  <-- usually tax is on gross
        // 4. Tools = (ToolValue * 0.01) / 44 (approx jobs per month)
        // 5. Total Cost = Displacement + Labor + Tools + Supplies + Taxes
        // 6. Final Price = Total Cost * 1.10 (Margin)

        supplies, // R$
        totalHours // hours
    } = data;

    const {
        fuelPrice,
        fuelConsumption,
        maintenanceCost,
        hourlyRate,
        toolKitValue,
        taxRate // percentage (e.g. 5 for 5%)
    } = settings;

    // 1. Displacement
    const fuelCost = (distance / fuelConsumption) * fuelPrice;
    const vehicleMant = distance * maintenanceCost;
    const displacementCost = fuelCost + vehicleMant;

    // 2. Labor
    // If billingType is 'fixed', labor is NOT charged to customer (it's internal).
    // If billingType is 'hourly', it IS charged.
    const shouldChargeLabor = data.billingType === 'hourly';

    const laborCost = shouldChargeLabor ? (totalHours * hourlyRate) : 0;

    // Internal Metric: True Labor Cost (opportunity cost)
    const internalLaborCost = totalHours * hourlyRate;

    // 3. Tools (Depreciation per job - assuming 44 jobs/mo)
    const monthlyDepreciation = toolKitValue * 0.01;
    const jobsPerMonth = 40; // Conservative average
    const toolCost = monthlyDepreciation / jobsPerMonth;

    // 4. Subtotal (Cost Basis)
    const subtotal = displacementCost + laborCost + toolCost + supplies;

    // 5. Taxes (Tax logic can be circular if based on final price, but let's do markup style)
    // Simple: Cost + Tax% of Cost? Or Tax is % of Final?
    // Prompt: "Valor do MEI e impostos (%) sobre cada serviço"
    // Let's add Tax to the Cost.
    const taxAmount = subtotal * (taxRate / 100);

    // New: Fixed Price Services Total
    // If billingType is 'hourly', services are just descriptive/free (included in hourly rate).
    const shouldChargeServices = !data.billingType || data.billingType === 'fixed';

    const rawServicesTotal = (data.additionalServices || []).reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);
    const servicesTotal = shouldChargeServices ? rawServicesTotal : 0;

    // 6. Total with Tax (Services added AFTER tax? Or before? Usually Services are taxed too)
    // Let's assume Services Price includes tax or is raw. Let's add it to subtotal base for simplicity, OR treat as separate add-on.
    // If we treat it as "part of the job", it should be in subtotal.
    // Redefining subtotal:
    const subtotalWithServices = subtotal + servicesTotal;

    // Recalculate Tax on new subtotal
    const totalTax = subtotalWithServices * (taxRate / 100);

    // 6. Total
    const totalWithTax = subtotalWithServices + totalTax;

    // 7. Margin (10%)
    const margin = totalWithTax * 0.10;

    const finalPrice = totalWithTax + margin;

    return {
        breakdown: {
            displacement: displacementCost,
            labor: laborCost,
            tools: toolCost,
            supplies: supplies,
            services: servicesTotal,
            taxes: subtotalWithServices * (taxRate / 100),
            margin: margin
        },
        total: finalPrice,
        internalMetrics: {
            realLaborCost: internalLaborCost,
            effectiveHourlyRate: totalHours > 0 ? ((finalPrice - supplies - displacementCost - toolCost) / totalHours) : 0
        }
    };
};
