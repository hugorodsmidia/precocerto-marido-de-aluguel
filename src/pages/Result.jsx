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

    const handleWhatsApp = () => {
        const greeting = inputData.clientName ? `Olá ${inputData.clientName}!` : 'Olá!';

        let materialsText = '';
        if (inputData.materials && inputData.materials.length > 0) {
            const list = inputData.materials.map(m => `- ${m.qty}x ${m.name}`).join('\n');
            if (inputData.materialsProvider === 'client') {
                materialsText = `\n*Materiais (Comprar):*\n${list}`;
            } else {
                materialsText = `\n*Materiais (Incluso):* R$ ${inputData.supplies.toFixed(2)}\n${list}`;
            }
        }

        const message = `${greeting} Aqui está o orçamento:
    \n*Serviços:* ${inputData.selectedServices.join(', ') || 'Manutenção Geral'}
    \n*Tempo:* ${inputData.totalHours}h${materialsText}
    \n*Total:* R$ ${result.total.toFixed(2)}
    \nEnviado via Marido de Aluguel Pro.`;

        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleSave = () => {
        // Save to history
        addHistoryItem({
            date: new Date().toISOString(),
            client: inputData.clientName,
            total: result.total,
            services: inputData.selectedServices
        });
        navigate('/welcome'); // Back to home
    };

    return (
        <div className="page-result content-wrapper" style={{ paddingBottom: '100px', paddingTop: '20px' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)' }}>
                    <ArrowLeft />
                </button>
                <h1 style={{ fontSize: '1.5rem' }}>Orçamento Final</h1>
            </header>

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

                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Valor Sugerido </p>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                    R$ {result.total.toFixed(2)}
                </h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1rem', background: '#E8F5E9', color: 'var(--success)', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold' }}>
                        Lucro Líquido: R$ {(result.total - result.breakdown.displacement - result.breakdown.taxes - result.breakdown.tools - result.breakdown.supplies).toFixed(2)}
                    </span>
                </div>

                {inputData.materials && inputData.materials.length > 0 && (
                    <div className="card" style={{ marginTop: '16px' }}>
                        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', fontSize: '1.2rem', color: 'var(--primary)' }}>
                            {inputData.materialsProvider === 'client' ? 'Lista de Compras (Cliente)' : 'Materiais Fornecidos (Profissional)'}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {inputData.materials.map((m, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '4px' }}>
                                    <span>{m.qty}x {m.name}</span>
                                    {inputData.materialsProvider === 'professional' && (
                                        <span style={{ color: '#666' }}>R$ {(parseFloat(m.price) * m.qty).toFixed(2)}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Detalhamento</h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Mão de Obra ({inputData.totalHours}h)</span>
                    <span>R$ {result.breakdown.labor.toFixed(2)}</span>
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
                    <span>Taxas/Ferramentas</span>
                    <span>R$ {(result.breakdown.taxes + result.breakdown.tools).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                    <span>Margem Segurança</span>
                    <span>R$ {result.breakdown.margin.toFixed(2)}</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => generatePDF(inputData, result, user)}>
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
