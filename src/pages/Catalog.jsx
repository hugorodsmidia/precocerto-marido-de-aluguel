import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchReferencePrices } from '../utils/prices';
import { Plus, Trash2 } from 'lucide-react';

const Catalog = () => {
    const { myPrices, addPrice, removePrice } = useApp();
    const [activeTab, setActiveTab] = useState('my_prices'); // 'my_prices' or 'reference'
    const [referencePrices, setReferencePrices] = useState([]);
    const [newService, setNewService] = useState('');
    const [newValue, setNewValue] = useState('');

    useEffect(() => {
        const loadReferences = async () => {
            const data = await fetchReferencePrices();
            setReferencePrices(data);
        };
        loadReferences();
    }, []);

    const handleAddPrice = (e) => {
        e.preventDefault();
        if (newService.trim() && newValue) {
            // Handle comma as decimal separator for Brazilian users
            const normalizedValue = newValue.replace(',', '.');
            const parsedValue = parseFloat(normalizedValue);

            if (!isNaN(parsedValue)) {
                addPrice({ name: newService, value: parsedValue });
                setNewService('');
                setNewValue('');
            }
        }
    };

    return (
        <div className="page-catalog content-wrapper" style={{ paddingTop: '20px', paddingBottom: 'calc(var(--nav-height) + 24px)' }}>
            <header style={{ marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem' }}>Catálogo de Preços</h1>
            </header>

            <div style={{ display: 'flex', marginBottom: '1rem', gap: '8px' }}>
                <button
                    className={`btn ${activeTab === 'my_prices' ? 'btn-primary' : 'btn-outline'}`}
                    style={{
                        background: activeTab === 'my_prices' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'my_prices' ? '#fff' : 'var(--text-secondary)',
                        border: activeTab === 'my_prices' ? 'none' : '1px solid var(--border-color)',
                        fontSize: '1rem'
                    }}
                    onClick={() => setActiveTab('my_prices')}
                >
                    Meus Preços
                </button>
                <button
                    className={`btn ${activeTab === 'reference' ? 'btn-primary' : 'btn-outline'}`}
                    style={{
                        background: activeTab === 'reference' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'reference' ? '#fff' : 'var(--text-secondary)',
                        border: activeTab === 'reference' ? 'none' : '1px solid var(--border-color)',
                        fontSize: '1rem'
                    }}
                    onClick={() => setActiveTab('reference')}
                >
                    Referência (2026)
                </button>
            </div>

            {activeTab === 'my_prices' && (
                <div className="my-prices-list">
                    <div className="card" style={{ background: 'var(--bg-card)', border: '2px dashed var(--border-color)' }}>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Adicionar Novo</h4>
                        <form onSubmit={handleAddPrice} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                            <div style={{ flex: '2 1 200px' }}>
                                <input
                                    type="text"
                                    placeholder="Serviço"
                                    style={{ margin: 0, fontSize: '1rem', width: '100%' }}
                                    value={newService}
                                    onChange={(e) => setNewService(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ flex: '1 1 100px' }}>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="R$ 0,00"
                                    style={{ margin: 0, fontSize: '1rem', width: '100%' }}
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-secondary" style={{ flex: '0 0 auto', width: 'auto', padding: '0 16px', height: '56px' }}>
                                <Plus size={24} />
                            </button>
                        </form>
                    </div>

                    {myPrices.length === 0 ? (
                        <p style={{ color: '#666', textAlign: 'center', marginTop: '2rem' }}>Nenhum preço cadastrado.</p>
                    ) : (
                        myPrices.map((item) => (
                            <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{item.name}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>
                                        R$ {item.value.toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => {
                                            if (confirm('Remover este preço?')) removePrice(item.id);
                                        }}
                                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'reference' && (
                <div className="reference-list">
                    {/* Card de aviso/instrução */}
                    <div style={{
                        background: '#FFF8E1',
                        border: '1px solid #FFE082',
                        borderRadius: '10px',
                        padding: '14px 16px',
                        marginBottom: '16px',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'flex-start'
                    }}>
                        <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>💡</span>
                        <div>
                            <p style={{ margin: '0 0 4px', fontWeight: '700', fontSize: '0.9rem', color: '#5D4037' }}>
                                Tabela de Referência — Mercado 2026
                            </p>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#795548', lineHeight: '1.45' }}>
                                Estes valores são <strong>sugestões baseadas no mercado brasileiro</strong> e servem apenas como referência.
                                Os preços reais podem variar conforme sua região, experiência e condições do serviço.
                                Use a aba <strong>Meus Preços</strong> para cadastrar sua tabela personalizada.
                            </p>
                        </div>
                    </div>

                    {referencePrices.map((item) => (
                        <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '500' }}>{item.name}</span>
                            <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.4rem' }}>
                                R$ {item.min} - {item.max}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Catalog;
