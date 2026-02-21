import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Save, Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';

const Settings = () => {
    const { settings, updateSettings, exportBackup, importBackup } = useApp();
    const [formData, setFormData] = useState(settings);
    const [saved, setSaved] = useState(false);
    const [showCalcInfo, setShowCalcInfo] = useState(false);
    const [backupStatus, setBackupStatus] = useState(null); // null | 'exporting' | 'success' | 'error'
    const [backupMessage, setBackupMessage] = useState('');

    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (parseFloat(value) || 0) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSettings(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleExport = () => {
        try {
            exportBackup();
            setBackupStatus('success');
            setBackupMessage(`Backup exportado em ${new Date().toLocaleString('pt-BR')}`);
        } catch {
            setBackupStatus('error');
            setBackupMessage('Erro ao gerar o arquivo de backup.');
        }
        setTimeout(() => setBackupStatus(null), 4000);
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Reseta o input para permitir reimportar o mesmo arquivo
        e.target.value = '';
        if (!window.confirm('Isso vai sobrescrever seus dados atuais com o backup. Continuar?')) return;
        try {
            setBackupStatus('exporting');
            const exportDate = await importBackup(file);
            const d = new Date(exportDate).toLocaleString('pt-BR');
            setBackupStatus('success');
            setBackupMessage(`Backup de ${d} restaurado com sucesso!`);
        } catch (err) {
            setBackupStatus('error');
            setBackupMessage(err.message || 'Arquivo de backup inválido.');
        }
        setTimeout(() => setBackupStatus(null), 5000);
    };

    return (
        <div className="page-settings content-wrapper" style={{ paddingTop: '20px', paddingBottom: '120px' }}>
            <header style={{ marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem' }}>Configurações</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Defina seus custos para o cálculo automático.</p>
            </header>

            <form onSubmit={handleSubmit}>
                {/* Business Name */}
                <div className="card">
                    <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Identificação</h3>
                    <label>Nome do Negócio (WhatsApp/PDF)</label>
                    <input
                        type="text"
                        name="businessName"
                        placeholder="Ex: João Serviços Gerais"
                        value={formData.businessName || ''}
                        onChange={handleChange}
                    />
                </div>

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

                {/* How Calculation Works */}
                <div className="card">
                    <button
                        type="button"
                        onClick={() => setShowCalcInfo(!showCalcInfo)}
                        style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}
                    >
                        <h3 style={{ color: 'var(--secondary)', margin: 0 }}>Como o Cálculo Funciona</h3>
                        <span style={{ fontSize: '1.2rem', color: '#999' }}>{showCalcInfo ? '▲' : '▼'}</span>
                    </button>
                    {showCalcInfo && (
                        <div style={{ marginTop: '12px', fontSize: '0.9rem', color: '#555', lineHeight: '1.6' }}>
                            <p><strong>1.</strong> Soma dos serviços adicionados (preço fixo)</p>
                            <p><strong>2.</strong> + Deslocamento (km ÷ consumo × combustível + manutenção)</p>
                            <p><strong>3.</strong> + Materiais (se fornecidos pelo profissional)</p>
                            <p><strong>4.</strong> + Depreciação de ferramentas por serviço</p>
                            <p><strong>5.</strong> + Impostos/MEI (% sobre subtotal)</p>
                            <p><strong>6.</strong> + Margem de segurança (10%)</p>
                            <p style={{ marginTop: '8px', fontStyle: 'italic', color: '#888' }}>
                                Horas = apenas controle interno, não afeta o preço cobrado.
                            </p>
                        </div>
                    )}
                </div>

                {/* Backup Section */}
                <div className="card">
                    <h3 style={{ marginBottom: '8px', color: 'var(--secondary)' }}>Backup de Dados</h3>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '16px', lineHeight: '1.45' }}>
                        Exporte seus dados para não perder ao trocar de celular ou limpar o navegador.
                        Para migrar para outro dispositivo: exporte aqui, transfira o arquivo e importe no novo aparelho.
                    </p>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: backupStatus ? '12px' : '0' }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ flex: 1 }}
                            onClick={handleExport}
                        >
                            <Download size={18} /> Exportar Backup
                        </button>
                        <label
                            className="btn"
                            style={{ flex: 1, background: '#E8F5E9', color: '#2E7D32', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            <Upload size={18} /> Importar Backup
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>

                    {/* Feedback de status */}
                    {backupStatus && (
                        <div style={{
                            marginTop: '10px',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            background: backupStatus === 'success' ? '#E8F5E9' : backupStatus === 'error' ? '#FFEBEE' : '#E3F2FD',
                            color: backupStatus === 'success' ? '#2E7D32' : backupStatus === 'error' ? '#C62828' : '#1565C0',
                        }}>
                            {backupStatus === 'success' && <CheckCircle size={16} />}
                            {backupStatus === 'error' && <AlertCircle size={16} />}
                            {backupStatus === 'exporting' && <span style={{ fontSize: '1rem' }}>⏳</span>}
                            {backupStatus === 'exporting' ? 'Restaurando dados...' : backupMessage}
                        </div>
                    )}
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
