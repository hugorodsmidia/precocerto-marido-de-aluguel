import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { calculateBudget } from '../utils/calculator';
import { fetchReferencePrices } from '../utils/prices';
import { ChevronRight, User, MapPin, Package, Trash2, Plus } from 'lucide-react';

const Calculator = () => {
    const { settings, myPrices, history } = useApp();
    const navigate = useNavigate();

    // View State
    const [viewMode, setViewMode] = useState('new'); // 'new' or 'history'
    const [currentStep, setCurrentStep] = useState(1);

    // Form State
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [distance, setDistance] = useState('');
    const [hours, setHours] = useState('');
    const [materialsProvider, setMaterialsProvider] = useState('professional');
    const [materials, setMaterials] = useState([]);

    // ... (keep existing helper functions) ...
    const [newItem, setNewItem] = useState({ name: '', qty: 1, price: '' });
    const addMaterial = () => {
        if (!newItem.name) return;
        setMaterials([...materials, { ...newItem, id: Date.now() }]);
        setNewItem({ name: '', qty: 1, price: '' });
    };
    const removeMaterial = (id) => setMaterials(materials.filter(m => m.id !== id));
    const calculateSuppliesTotal = () => {
        if (materialsProvider === 'client') return 0;
        return materials.reduce((acc, item) => acc + (parseFloat(item.price) || 0) * item.qty, 0);
    };

    const [addedServices, setAddedServices] = useState([]);
    const [newServiceItem, setNewServiceItem] = useState({ name: '', price: '' });
    const addServiceItem = () => {
        if (!newServiceItem.name || !newServiceItem.price) return;
        setAddedServices([...addedServices, { ...newServiceItem, id: Date.now() }]);
        setNewServiceItem({ name: '', price: '' });
    };
    const removeServiceItem = (id) => setAddedServices(addedServices.filter(s => s.id !== id));

    const [catalog, setCatalog] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const handleCalculate = (e) => {
        e.preventDefault();

        const inputData = {
            clientName,
            clientPhone,
            clientAddress,
            distance: parseFloat(distance) || 0,
            totalHours: parseFloat(hours) || 0,
            supplies: calculateSuppliesTotal(),
            materialsProvider,
            materials,
            additionalServices: addedServices,
            selectedServices: addedServices.map(s => s.name),
            billingType: 'fixed' // Enforce Fixed / Empreitada
        };
        const result = calculateBudget(inputData, settings);
        navigate('/result', { state: { result, inputData } });
    };

    // Wizard Navigation logic — auto-add pending items before advancing
    const nextStep = () => {
        // Step 2: auto-add pending service
        if (currentStep === 2 && newServiceItem.name && newServiceItem.price) {
            setAddedServices(prev => [...prev, { ...newServiceItem, id: Date.now() }]);
            setNewServiceItem({ name: '', price: '' });
            setSuggestions([]);
        }
        // Step 3: auto-add pending material
        if (currentStep === 3 && newItem.name) {
            setMaterials(prev => [...prev, { ...newItem, id: Date.now() }]);
            setNewItem({ name: '', qty: 1, price: '' });
        }
        setCurrentStep(prev => Math.min(prev + 1, 4));
    };
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    // Progress Bar Component
    const ProgressBar = () => (
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
            {[1, 2, 3, 4].map(step => (
                <div
                    key={step}
                    style={{
                        flex: 1,
                        height: '6px',
                        borderRadius: '3px',
                        background: step <= currentStep ? 'var(--primary)' : '#E0E0E0',
                        transition: 'background 0.3s ease'
                    }}
                />
            ))}
        </div>
    );

    return (
        <div className="page-calculator">
            {/* Global Header is used in Layout */}

            <div className="toggle-container">
                <button
                    className={`toggle-btn ${viewMode === 'new' ? 'active' : ''}`}
                    onClick={() => setViewMode('new')}
                >
                    Novo Orçamento
                </button>
                <button
                    className={`toggle-btn ${viewMode === 'history' ? 'active' : ''}`}
                    onClick={() => setViewMode('history')}
                >
                    Histórico
                </button>
            </div>

            <div className="content-wrapper">
                {viewMode === 'new' ? (
                    <form onSubmit={handleCalculate}>
                        <ProgressBar />

                        {/* Step 1: Cliente */}
                        {currentStep === 1 && (
                            <div className="card fade-in">
                                <h3 style={{ marginTop: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <User size={20} /> Identificação
                                </h3>
                                <div className="input-group">
                                    <input
                                        className="minimal"
                                        type="text"
                                        placeholder="Nome do Cliente"
                                        value={clientName}
                                        onChange={e => setClientName(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        className="minimal"
                                        type="tel"
                                        placeholder="WhatsApp"
                                        value={clientPhone}
                                        onChange={e => setClientPhone(e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        className="minimal"
                                        type="text"
                                        placeholder="Endereço"
                                        value={clientAddress}
                                        onChange={e => setClientAddress(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Logística */}
                        {currentStep === 4 && (
                            <div className="card fade-in">
                                <h3 style={{ marginTop: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <MapPin size={20} /> Logística
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="input-group">
                                        <label style={{ fontSize: '0.8rem', color: '#888' }}>Distância (km)</label>
                                        <input
                                            className="minimal"
                                            type="number" step="0.1"
                                            value={distance} onChange={e => setDistance(e.target.value)}
                                            required
                                            placeholder="0"
                                            style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label style={{ fontSize: '0.8rem', color: '#888' }}>
                                            Tempo Previsto (h) <br />
                                            <small>(Uso Interno)</small>
                                        </label>
                                        <input
                                            className="minimal"
                                            type="number" step="0.5"
                                            value={hours} onChange={e => setHours(e.target.value)}
                                            required
                                            placeholder="0h"
                                            style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Materiais */}
                        {currentStep === 3 && (
                            <div className="card fade-in">
                                <h3 style={{ marginTop: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Package size={20} /> Materiais
                                </h3>

                                <div className="toggle-container" style={{ marginBottom: '16px', background: '#F0F0F0', padding: '4px', borderRadius: '8px' }}>
                                    <button
                                        type="button"
                                        className={`toggle-btn ${materialsProvider === 'professional' ? 'active' : ''}`}
                                        onClick={() => setMaterialsProvider('professional')}
                                        style={{ flex: 1, padding: '8px', fontSize: '0.9rem' }}
                                    >
                                        Eu Forneço
                                    </button>
                                    <button
                                        type="button"
                                        className={`toggle-btn ${materialsProvider === 'client' ? 'active' : ''}`}
                                        onClick={() => setMaterialsProvider('client')}
                                        style={{ flex: 1, padding: '8px', fontSize: '0.9rem' }}
                                    >
                                        Cliente Compra
                                    </button>
                                </div>

                                {/* Add Item Form */}
                                <div style={{ display: 'grid', gridTemplateColumns: materialsProvider === 'professional' ? '1.5fr 0.8fr 1fr auto' : '2fr 0.8fr auto', gap: '8px', alignItems: 'end', marginBottom: '12px' }}>
                                    <div className="input-group" style={{ margin: 0 }}>
                                        <label style={{ fontSize: '0.7rem', color: '#888' }}>Produto</label>
                                        <input
                                            type="text"
                                            placeholder="Nome"
                                            className="minimal"
                                            style={{ fontSize: '0.9rem', padding: '8px 0' }}
                                            value={newItem.name}
                                            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group" style={{ margin: 0 }}>
                                        <label style={{ fontSize: '0.7rem', color: '#888' }}>Qtd</label>
                                        <input
                                            type="number"
                                            placeholder="1"
                                            className="minimal"
                                            style={{ fontSize: '0.9rem', padding: '8px 0', textAlign: 'center' }}
                                            value={newItem.qty}
                                            onChange={e => setNewItem({ ...newItem, qty: parseFloat(e.target.value) || 1 })}
                                        />
                                    </div>
                                    {materialsProvider === 'professional' && (
                                        <div className="input-group" style={{ margin: 0 }}>
                                            <label style={{ fontSize: '0.7rem', color: '#888' }}>Preço Unit.</label>
                                            <input
                                                type="number"
                                                placeholder="R$ 0"
                                                className="minimal"
                                                style={{ fontSize: '0.9rem', padding: '8px 0' }}
                                                value={newItem.price}
                                                onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                            />
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        style={{ padding: '8px', height: '40px', marginBottom: '8px' }}
                                        onClick={addMaterial}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                {/* List of Added Materials */}
                                {materials.length > 0 && (
                                    <div style={{ background: '#FAFAFA', borderRadius: '8px', overflow: 'hidden', border: '1px solid #EEE' }}>
                                        {materials.map(item => (
                                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #EEE' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{item.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                                        {item.qty}x {materialsProvider === 'professional' && `(R$ ${parseFloat(item.price || 0).toFixed(2)})`}
                                                    </div>
                                                </div>
                                                {materialsProvider === 'professional' && (
                                                    <div style={{ fontWeight: 'bold', marginRight: '12px', fontSize: '0.9rem' }}>
                                                        R$ {((parseFloat(item.price || 0)) * item.qty).toFixed(2)}
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeMaterial(item.id)}
                                                    style={{ border: 'none', background: 'transparent', color: 'var(--danger)', padding: '4px' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        {materialsProvider === 'professional' && (
                                            <div style={{ padding: '10px', background: '#E3F2FD', borderTop: '1px solid #BBDEFB', fontWeight: 'bold', textAlign: 'right', color: 'var(--primary)' }}>
                                                Total Materiais: R$ {calculateSuppliesTotal().toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Serviços */}
                        {currentStep === 2 && (
                            <div className="card fade-in">
                                <h3 style={{ marginTop: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Package size={20} /> Serviços
                                </h3>

                                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '8px' }}>
                                    Busque na tabela ou digite um novo.
                                </p>

                                {/* Service Input Form */}
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '8px', marginBottom: '12px', position: 'relative' }}>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            placeholder="Descrição"
                                            className="minimal"
                                            style={{ margin: 0, width: '100%' }}
                                            value={newServiceItem.name}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setNewServiceItem({ ...newServiceItem, name: val });
                                                if (val.length > 1) {
                                                    const matches = catalog.filter(item =>
                                                        item.name.toLowerCase().includes(val.toLowerCase())
                                                    );
                                                    setSuggestions(matches);
                                                } else {
                                                    setSuggestions([]);
                                                }
                                            }}
                                            onFocus={async () => {
                                                if (catalog.length === 0) {
                                                    const refs = await fetchReferencePrices();
                                                    const combined = [
                                                        ...myPrices.map(p => ({ ...p, type: 'personal' })),
                                                        ...refs.map(p => ({ ...p, type: 'ref' }))
                                                    ];
                                                    setCatalog(combined);
                                                }
                                            }}
                                        />
                                        {suggestions.length > 0 && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                right: 0,
                                                background: '#fff',
                                                border: '1px solid #ddd',
                                                borderRadius: '8px',
                                                maxHeight: '200px',
                                                overflowY: 'auto',
                                                zIndex: 10,
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                            }}>
                                                {suggestions.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => {
                                                            setNewServiceItem({
                                                                name: item.name,
                                                                price: item.value || Math.round((item.min + item.max) / 2) || ''
                                                            });
                                                            setSuggestions([]);
                                                        }}
                                                        style={{
                                                            padding: '10px',
                                                            borderBottom: '1px solid #eee',
                                                            cursor: 'pointer',
                                                            fontSize: '0.9rem'
                                                        }}
                                                    >
                                                        <div style={{ fontWeight: '500' }}>{item.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                                            R$ {item.value ? item.value.toFixed(2) : `${item.min} - ${item.max}`}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="R$"
                                        className="minimal"
                                        style={{ margin: 0 }}
                                        value={newServiceItem.price}
                                        onChange={e => setNewServiceItem({ ...newServiceItem, price: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        style={{ padding: '0 12px' }}
                                        onClick={() => {
                                            addServiceItem();
                                            setSuggestions([]);
                                        }}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                {/* Added Services List */}
                                {addedServices.length > 0 ? (
                                    <div style={{ marginBottom: '1rem', background: '#FAFAFA', borderRadius: '8px', overflow: 'hidden', border: '1px solid #EEE' }}>
                                        {addedServices.map(item => (
                                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #EEE' }}>
                                                <span>{item.name}</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>R$ {parseFloat(item.price).toFixed(2)}</span>
                                                    <button type="button" onClick={() => removeServiceItem(item.id)} style={{ border: 'none', background: 'transparent', color: 'var(--danger)' }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <div style={{ padding: '8px', background: '#E3F2FD', textAlign: 'right', fontWeight: 'bold', fontSize: '0.9rem', color: '#1565C0' }}>
                                            Subtotal Serviços: R$ {addedServices.reduce((acc, i) => acc + (parseFloat(i.price) || 0), 0).toFixed(2)}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#999', padding: '20px', fontStyle: 'italic' }}>
                                        Adicione pelo menos um serviço.
                                    </div>
                                )}
                            </div>
                        )}

                        <div style={{ height: '100px' }}></div>

                        {/* Wizard Navigation Bar */}
                        <div className="floating-action-bar" style={{ display: 'flex', gap: '10px', padding: '16px' }}>
                            {currentStep > 1 && (
                                <button type="button" className="btn btn-secondary" onClick={prevStep} style={{ flex: 1 }}>
                                    Voltar
                                </button>
                            )}
                            {currentStep < 4 ? (
                                <button type="button" className="btn btn-primary" onClick={nextStep} style={{ flex: 1 }}>
                                    Próximo <ChevronRight size={16} />
                                </button>
                            ) : (
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    Calcular Orçamento !
                                </button>
                            )}
                        </div>
                    </form>
                ) : (
                    <div className="history-view content-wrapper" style={{ paddingBottom: '100px' }}>
                        {(!Array.isArray(history) || history.length === 0) ? (
                            <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                                <p style={{ color: '#999' }}>Nenhum orçamento salvo ainda.</p>
                            </div>
                        ) : (
                            history.map((item, index) => (
                                <div
                                    key={item.id || index}
                                    className="card"
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', cursor: item.result ? 'pointer' : 'default', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
                                    onClick={() => {
                                        if (item.result && item.inputData) {
                                            navigate('/result', { state: { result: item.result, inputData: item.inputData } });
                                        }
                                    }}
                                    onMouseDown={e => { if (item.result) e.currentTarget.style.transform = 'scale(0.98)'; }}
                                    onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>
                                            {item.client || 'Cliente não informado'}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                            {item.date ? new Date(item.date).toLocaleDateString() : 'Data desconhecida'} - {item.date ? new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '4px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {Array.isArray(item.services)
                                                ? item.services.map(s => typeof s === 'string' ? s : s.name).join(', ')
                                                : 'Serviços não listados'}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                            R$ {Number(item.total || 0).toFixed(2)}
                                        </div>
                                        {item.result && (
                                            <ChevronRight size={20} color="#999" />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div >
    );
};

export default Calculator;
