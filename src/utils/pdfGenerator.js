import jsPDF from 'jspdf';

// Colors
const BLUE = [13, 71, 161];
const ORANGE = [255, 152, 0];
const WHITE = [255, 255, 255];
const DARK = [30, 30, 30];
const GRAY = [100, 100, 100];
const LIGHT_BG = [245, 247, 250];
const ZEBRA_BG = [240, 244, 248];
const BORDER = [220, 220, 220];

const PAGE_WIDTH = 210;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const PAGE_HEIGHT = 297;
const BOTTOM_LIMIT = PAGE_HEIGHT - 30;

export const generatePDF = (data, result, user, businessName = '') => {
    const doc = new jsPDF();
    let y = 0;

    const professionalName = user?.name || 'Profissional';

    // --- Helper: check page break ---
    const checkPageBreak = (needed = 20) => {
        if (y + needed > BOTTOM_LIMIT) {
            doc.addPage();
            y = 20;
        }
    };

    // --- Helper: draw a filled rect ---
    const drawRect = (x, yPos, w, h, color) => {
        doc.setFillColor(...color);
        doc.rect(x, yPos, w, h, 'F');
    };

    // --- Helper: draw horizontal line ---
    const drawLine = (yPos, color = BORDER) => {
        doc.setDrawColor(...color);
        doc.setLineWidth(0.3);
        doc.line(MARGIN, yPos, PAGE_WIDTH - MARGIN, yPos);
    };

    // --- Helper: format currency ---
    const fmtMoney = (val) => {
        const num = parseFloat(val) || 0;
        return `R$ ${num.toFixed(2).replace('.', ',')}`;
    };

    // ==========================================
    // HEADER — Blue banner with professional name
    // ==========================================
    drawRect(0, 0, PAGE_WIDTH, 40, BLUE);

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(professionalName, MARGIN, 18);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 210, 230);
    doc.text('Orçamento de Serviços', MARGIN, 27);

    // Date on the right
    const dateStr = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
    doc.setFontSize(9);
    doc.setTextColor(...WHITE);
    doc.text(dateStr, PAGE_WIDTH - MARGIN, 35, { align: 'right' });

    y = 50;

    // ==========================================
    // CLIENT INFO BOX
    // ==========================================
    if (data.clientName || data.clientPhone || data.clientAddress) {
        const boxHeight = 10 + (data.clientName ? 7 : 0) + (data.clientPhone ? 6 : 0) + (data.clientAddress ? 6 : 0);
        drawRect(MARGIN, y, CONTENT_WIDTH, boxHeight, LIGHT_BG);

        doc.setDrawColor(...BLUE);
        doc.setLineWidth(0.8);
        doc.line(MARGIN, y, MARGIN, y + boxHeight);

        let cy = y + 7;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...BLUE);
        doc.text('DADOS DO CLIENTE', MARGIN + 8, cy);
        cy += 7;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...DARK);
        doc.setFontSize(11);

        if (data.clientName) {
            doc.text(data.clientName, MARGIN + 8, cy);
            cy += 6;
        }
        if (data.clientPhone) {
            doc.setFontSize(10);
            doc.setTextColor(...GRAY);
            doc.text(`Tel: ${data.clientPhone}`, MARGIN + 8, cy);
            cy += 6;
        }
        if (data.clientAddress) {
            doc.setFontSize(10);
            doc.setTextColor(...GRAY);
            const addrLines = doc.splitTextToSize(`End: ${data.clientAddress}`, CONTENT_WIDTH - 16);
            doc.text(addrLines, MARGIN + 8, cy);
            cy += addrLines.length * 5;
        }

        y = cy + 8;
    }
    // ==========================================
    // EXECUTION TIME
    // ==========================================
    if (data.totalHours && data.totalHours > 0) {
        const h = parseFloat(data.totalHours);
        let tempoStr;
        if (h >= 8) {
            const dias = Math.round((h / 8) * 10) / 10;
            tempoStr = dias === 1 ? '1 dia' : `${dias} dias`;
        } else {
            tempoStr = h === 1 ? '1 hora' : `${h} horas`;
        }

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...GRAY);
        doc.text('Tempo estimado de execução:', MARGIN, y);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...DARK);
        doc.text(tempoStr, MARGIN + 62, y);
        y += 10;
    }

    // ==========================================
    // SERVICES TABLE
    // ==========================================
    const hasAdditionalServices = data.additionalServices && data.additionalServices.length > 0;
    const hasSelectedServices = data.selectedServices && data.selectedServices.length > 0;

    if (hasAdditionalServices || hasSelectedServices) {
        checkPageBreak(30);

        // Section title
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...BLUE);
        doc.text('Serviços', MARGIN, y);
        y += 4;

        drawLine(y, BLUE);
        y += 6;

        // Table header
        drawRect(MARGIN, y - 4, CONTENT_WIDTH, 8, BLUE);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...WHITE);
        doc.text('Descrição', MARGIN + 4, y);
        if (hasAdditionalServices) {
            doc.text('Valor', PAGE_WIDTH - MARGIN - 4, y, { align: 'right' });
        }
        y += 7;

        // Table rows
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        if (hasAdditionalServices) {
            data.additionalServices.forEach((service, i) => {
                checkPageBreak(10);
                if (i % 2 === 0) {
                    drawRect(MARGIN, y - 4, CONTENT_WIDTH, 7, ZEBRA_BG);
                }
                doc.setTextColor(...DARK);
                doc.text(service.name || 'Serviço', MARGIN + 4, y);
                const price = parseFloat(service.price) || 0;
                doc.setTextColor(...DARK);
                doc.text(fmtMoney(price), PAGE_WIDTH - MARGIN - 4, y, { align: 'right' });
                y += 7;
            });
        } else if (hasSelectedServices) {
            data.selectedServices.forEach((service, i) => {
                checkPageBreak(10);
                if (i % 2 === 0) {
                    drawRect(MARGIN, y - 4, CONTENT_WIDTH, 7, ZEBRA_BG);
                }
                doc.setTextColor(...DARK);
                doc.text(`${service}`, MARGIN + 4, y);
                y += 7;
            });
        }

        drawLine(y - 3);
        y += 5;
    }

    // ==========================================
    // MATERIALS TABLE
    // ==========================================
    if (data.materials && data.materials.length > 0) {
        checkPageBreak(30);

        const isClientBuys = data.materialsProvider === 'client';
        const sectionTitle = isClientBuys ? 'Lista de Compras (Cliente)' : 'Materiais Inclusos';

        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...BLUE);
        doc.text(sectionTitle, MARGIN, y);
        y += 4;

        drawLine(y, BLUE);
        y += 6;

        // Table header
        drawRect(MARGIN, y - 4, CONTENT_WIDTH, 8, BLUE);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...WHITE);
        doc.text('Material', MARGIN + 4, y);
        doc.text('Qtd', MARGIN + 110, y);
        if (!isClientBuys) {
            doc.text('Valor', PAGE_WIDTH - MARGIN - 4, y, { align: 'right' });
        }
        y += 7;

        // Table rows
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        data.materials.forEach((m, i) => {
            checkPageBreak(10);
            if (i % 2 === 0) {
                drawRect(MARGIN, y - 4, CONTENT_WIDTH, 7, ZEBRA_BG);
            }
            doc.setTextColor(...DARK);
            doc.text(m.name || 'Material', MARGIN + 4, y);
            doc.text(`${m.qty}x`, MARGIN + 112, y);
            if (!isClientBuys) {
                const price = (parseFloat(m.price) || 0) * m.qty;
                doc.text(fmtMoney(price), PAGE_WIDTH - MARGIN - 4, y, { align: 'right' });
            }
            y += 7;
        });

        drawLine(y - 3);
        y += 5;
    }

    // ==========================================
    // FINANCIAL BREAKDOWN
    // ==========================================
    checkPageBreak(60);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BLUE);
    doc.text('Resumo Financeiro', MARGIN, y);
    y += 4;

    drawLine(y, BLUE);
    y += 8;

    const breakdownItems = [
        ['Mão de Obra / Serviços', result.breakdown.services],
        ['Materiais / Insumos', result.breakdown.supplies],
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    breakdownItems.forEach(([label, value], i) => {
        if (i % 2 === 0) {
            drawRect(MARGIN, y - 4, CONTENT_WIDTH, 7, ZEBRA_BG);
        }
        doc.setTextColor(...GRAY);
        doc.text(label, MARGIN + 4, y);
        doc.setTextColor(...DARK);
        doc.text(fmtMoney(value), PAGE_WIDTH - MARGIN - 4, y, { align: 'right' });
        y += 7;
    });

    y += 3;

    // ==========================================
    // TOTAL — Orange highlight
    // ==========================================
    drawRect(MARGIN, y, CONTENT_WIDTH, 16, ORANGE);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text('VALOR TOTAL', MARGIN + 6, y + 11);
    doc.setFontSize(16);
    doc.text(fmtMoney(result.total), PAGE_WIDTH - MARGIN - 6, y + 11, { align: 'right' });

    y += 24;

    // ==========================================
    // OBSERVATIONS
    // ==========================================
    checkPageBreak(25);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...GRAY);
    doc.text('Observações:', MARGIN, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const obs = [
        '• Orçamento válido por 7 dias a partir da data de emissão.',
        '• Valores sujeitos a alteração conforme condições do local.',
        '• Pagamento a combinar com o profissional.'
    ];
    obs.forEach(line => {
        doc.text(line, MARGIN, y);
        y += 4.5;
    });

    // ==========================================
    // FOOTER
    // ==========================================
    const footerY = PAGE_HEIGHT - 12;
    drawLine(footerY - 4, BORDER);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 180, 180);
    doc.text(
        `${professionalName} — Orçamento gerado em ${new Date().toLocaleDateString('pt-BR')}`,
        PAGE_WIDTH / 2,
        footerY,
        { align: 'center' }
    );

    // Save
    doc.save(`orcamento_${(data.clientName || 'cliente').replace(/\s+/g, '_').toLowerCase()}.pdf`);
};
