import jsPDF from 'jspdf';

export const generatePDF = (data, result, user) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(255, 152, 0); // Orange
    doc.text('Marido de Aluguel Pro', 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Profissional: ${user?.name || 'Não informado'}`, 20, 30);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 20, 36);

    // Divider
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    // Client Details
    doc.setFontSize(14);
    if (data.clientName) {
        doc.text(`Cliente: ${data.clientName}`, 20, 55);
        if (data.clientPhone) {
            doc.setFontSize(12);
            doc.text(`Tel: ${data.clientPhone}`, 20, 62);
        }
        if (data.clientAddress) {
            doc.setFontSize(12);
            doc.text(`Endereço: ${data.clientAddress}`, 20, 68);
        }
    }

    doc.setFontSize(16);
    doc.text('Orçamento de Serviços', 20, data.clientName ? 75 : 60);

    // Content
    let y = data.clientName ? 90 : 80;

    doc.setFontSize(12);
    doc.text('Descrição:', 20, y);
    y += 10;

    if (data.selectedServices && data.selectedServices.length > 0) {
        data.selectedServices.forEach(service => {
            doc.text(`• ${service}`, 25, y);
            y += 8;
        });
    } else {
        doc.text('• Serviços Gerais / Manutenção', 25, y);
        y += 10;
    }

    y += 10;
    doc.text(`Tempo Estimado: ${data.totalHours} horas`, 20, y);
    y += 15;

    // Materials List
    if (data.materials && data.materials.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(255, 152, 0);
        doc.text(data.materialsProvider === 'client' ? 'Lista de Compras (Cliente):' : 'Materiais Inclusos:', 20, y);
        y += 8;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        data.materials.forEach(m => {
            const line = `• ${m.qty}x ${m.name}`;
            doc.text(line, 20, y);
            y += 6;
        });
        y += 5;
    } else {
        y += 5;
    }

    // Values
    doc.setFontSize(14);
    doc.text('Resumo de Valores', 20, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Mão de Obra e Deslocamento: R$ ${(result.breakdown.labor + result.breakdown.displacement).toFixed(2)}`, 20, y);
    y += 8;
    doc.text(`Materiais/Insumos: R$ ${result.breakdown.supplies.toFixed(2)}`, 20, y);
    y += 8;
    doc.text(`Taxas e Outros: R$ ${(result.breakdown.taxes + result.breakdown.tools).toFixed(2)}`, 20, y);
    y += 15;

    // Total
    doc.setFontSize(18);
    doc.setTextColor(33, 150, 243); // Blue
    doc.text(`TOTAL ESTIMADO: R$ ${result.total.toFixed(2)}`, 20, y);

    doc.save('orcamento_marido_pro.pdf');
};
