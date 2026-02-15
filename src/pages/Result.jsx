import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FileText, Share2, ArrowLeft, Home, MapPin } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';

const Result = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user, addHistoryItem } = useApp();

    if (!state || !state.result) {
        return (
            <div className="page-result" style={{ textAlign: 'center', marginTop: '2rem' }}>
                <p>Nenhum resultado encontrado.</p>
                <button className="btn btn-secondary" onClick={() => navigate('/calculator')}>
                    Voltar
                </button>
            </div>
        );
    }

    const { result, inputData } = state;
    const professionalName = user?.name || 'Profissional';

    const handleWhatsApp = () => {
        const greeting = inputData.clientName ? `Olá ${inputData.clientName}!` : 'Olá!';

        // Services list
        let servicesText = '';
        if (inputData.additionalServices && inputData.additionalServices.length > 0) {
            const list = inputData.additionalServices.map(s => {
                const price = parseFloat(s.price) || 0;
                return `  • ${s.name} — R$ ${price.toFixed(2)}`;
            }).join('\n');
            servicesText = `\n*Serviços:*\n${list}`;
        } else if (inputData.selectedServices && inputData.selectedServices.length > 0) {
            servicesText = `\n*Serviços:* ${inputData.selectedServices.join(', ')}`;
        }

        // Materials list
        let materialsText = '';
        if (inputData.materials && inputData.materials.length > 0) {
            const list = inputData.materials.map(m => `  • ${m.qty}x ${m.name}`).join('\n');
            if (inputData.materialsProvider === 'client') {
                materialsText = `\n*Materiais (Comprar):*\n${list}`;
            } else {
                materialsText = `\n*Materiais (Incluso):* R$ ${inputData.supplies.toFixed(2)}\n${list}`;
            }
        }

        const message = `${greeting} Segue o orçamento:${servicesText}${materialsText}\n\n*Total: R$ ${result.total.toFixed(2)}*\n\n_${professionalName}_`;

        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleSave = () => {
        addHistoryItem({
            id: Date.now(),
            date: new Date().toISOString(),
            client: inputData.clientName,
            address: inputData.clientAddress,
            total: result.total,
            services: inputData.additionalServices || [],
            materials: inputData.materials || [],
            // Dados completos para reabrir o orçamento
            result,
            inputData
        });
        alert('Orçamento salvo no histórico!');
        navigate('/calculator');
    };

    return (
        <div className="page-result content-wrapper" style={{ paddingBottom: '100px', paddingTop: '20px' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)' }}>
                    <ArrowLeft />
                </button>
                <h1 style={{ fontSize: '1.5rem' }}>Orçamento Final</h1>
            </header>

            {/* Client + Total */}
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                        {inputData.clientName || 'Cliente'}
                    </h2>
                    {inputData.clientAddress && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <MapPin size={14} />
                            {inputData.clientAddress}
                        </p>
                    )}
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Valor Sugerido</p>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                    R$ {result.total.toFixed(2)}
                </h2>

                {/* Services Summary */}
                {inputData.additionalServices && inputData.additionalServices.length > 0 && (
                    <div style={{ textAlign: 'left', marginTop: '12px', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Serviços:</strong>
                        {inputData.additionalServices.map((s, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem' }}>
                                <span>{s.name}</span>
                                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>R$ {parseFloat(s.price).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Materials Summary */}
                {inputData.materials && inputData.materials.length > 0 && (
                    <div style={{ textAlign: 'left', marginTop: '12px', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>
                            {inputData.materialsProvider === 'client' ? 'Materiais (Cliente compra):' : 'Materiais (Incluso):'}
                        </strong>
                        {inputData.materials.map((m, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem' }}>
                                <span>{m.qty}x {m.name}</span>
                                {inputData.materialsProvider === 'professional' && (
                                    <span style={{ color: '#666' }}>R$ {(parseFloat(m.price) * m.qty).toFixed(2)}</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Breakdown */}
            <div className="card">
                <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Detalhamento</h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Serviços</span>
                    <span>R$ {result.breakdown.services.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Deslocamento</span>
                    <span>R$ {result.breakdown.displacement.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Materiais</span>
                    <span>R$ {result.breakdown.supplies.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#888' }}>
                    <span>Ferramentas (depr.)</span>
                    <span>R$ {result.breakdown.tools.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#888' }}>
                    <span>Impostos/MEI</span>
                    <span>R$ {result.breakdown.taxes.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                    <span>Margem Segurança (10%)</span>
                    <span>R$ {result.breakdown.margin.toFixed(2)}</span>
                </div>
            </div>

            {/* Internal Metrics */}
            {inputData.totalHours > 0 && (
                <div className="card" style={{ background: '#FFF8E1', border: '1px solid #FFE082' }}>
                    <h3 style={{ marginBottom: '8px', fontSize: '0.9rem', color: '#F57F17' }}>📊 Métricas Internas (só você vê)</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span>Custo real mão de obra ({inputData.totalHours}h)</span>
                        <span>R$ {result.internalMetrics.realLaborCost.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span>Valor/hora efetivo</span>
                        <span>R$ {result.internalMetrics.effectiveHourlyRate.toFixed(2)}/h</span>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => generatePDF(inputData, result, user, professionalName)}>
                    <FileText />
                    PDF
                </button>
                <button className="btn" style={{ backgroundColor: '#25D366', color: '#fff' }} onClick={handleWhatsApp}>
                    <Share2 />
                    WhatsApp
                </button>
            </div>

            <button className="btn" style={{ marginTop: '1rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }} onClick={handleSave}>
                <Home />
                Finalizar e Salvar
            </button>
        </div>
    );
};

export default Result;
