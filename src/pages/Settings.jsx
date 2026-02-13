import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Save } from 'lucide-react';

const Settings = () => {
    const { settings, updateSettings } = useApp();
    const [formData, setFormData] = useState(settings);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSettings(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="page-settings content-wrapper" style={{ paddingTop: '20px' }}>
            <header style={{ marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem' }}>Configurações</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Defina seus custos para o cálculo automático.</p>
            </header>

            <form onSubmit={handleSubmit}>
                <div className="card">
                    <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Veículo</h3>
                    <label>Preço Combustível (R$/L)</label>
                    <input
                        type="number" step="0.01" name="fuelPrice"
                        value={formData.fuelPrice} onChange={handleChange}
                    />

                    <label>Consumo Médio (km/L)</label>
                    <input
                        type="number" step="0.1" name="fuelConsumption"
                        value={formData.fuelConsumption} onChange={handleChange}
                    />

                    <label>Custo Manutenção (R$/km)</label>
                    <input
                        type="number" step="0.01" name="maintenanceCost"
                        placeholder="Sugestão: 0.20"
                        value={formData.maintenanceCost} onChange={handleChange}
                    />
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Mão de Obra</h3>
                    <label>Valor Hora Técnica (R$)</label>
                    <input
                        type="number" step="1.00" name="hourlyRate"
                        value={formData.hourlyRate} onChange={handleChange}
                    />

                    <label>Meta Mensal (R$)</label>
                    <input
                        type="number" step="100" name="monthlyGoal"
                        value={formData.monthlyGoal} onChange={handleChange}
                    />
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Impostos & Ferramentas</h3>
                    <label>Valor Total Ferramentas (R$)</label>
                    <input
                        type="number" step="100" name="toolKitValue"
                        value={formData.toolKitValue} onChange={handleChange}
                    />
                    <small style={{ display: 'block', marginBottom: '1rem', color: '#666' }}>
                        Depreciação estimada: R$ {((formData.toolKitValue * 0.01)).toFixed(2)}/mês
                    </small>

                    <label>Impostos/MEI (%)</label>
                    <input
                        type="number" step="0.1" name="taxRate"
                        value={formData.taxRate} onChange={handleChange}
                    />
                </div>

                <div className="floating-action-bar">
                    <button type="submit" className="btn btn-primary">
                        <Save size={20} />
                        {saved ? 'Salvo!' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
