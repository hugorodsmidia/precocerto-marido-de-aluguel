import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Wrench, Share, Menu, Download } from 'lucide-react';

const Welcome = () => {
    const { user, login } = useApp();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showInstallHelp, setShowInstallHelp] = useState(true);

    useEffect(() => {
        if (user) {
            navigate('/calculator');
        }
    }, [user, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (name.trim()) {
            if (password.length === 4) {
                login(name);
                navigate('/calculator');
            } else {
                alert("A senha deve ter 4 dígitos.");
            }
        }
    };

    return (
        <div className="page-welcome" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '85vh' }}>

            <div style={{ margin: '2rem 0', color: 'var(--primary)', textAlign: 'center' }}>
                <Wrench size={64} />
                <h1 style={{ marginBottom: '0.5rem', fontSize: '1.8rem' }}>Preço Certo</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Marido de Aluguel</p>
            </div>

            <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '350px', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                <h3 style={{ marginTop: 0, fontSize: '1.1rem', marginBottom: '16px', textAlign: 'center' }}>Acesso ao Sistema</h3>
                <div style={{ marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Seu Nome"
                        className="minimal"
                        style={{ border: '1px solid #ddd', background: '#f9f9f9' }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <input
                        type="tel"
                        placeholder="Senha (4 dígitos)"
                        maxLength={4}
                        className="minimal"
                        style={{ border: '1px solid #ddd', background: '#f9f9f9' }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        pattern="[0-9]{4}"
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Entrar e Sincronizar
                </button>
            </form>

            <button
                onClick={() => setShowInstallHelp(!showInstallHelp)}
                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer', marginBottom: '2rem' }}
            >
                {showInstallHelp ? 'Ocultar Instruções de Instalação' : 'Como instalar este App?'}
            </button>

            {showInstallHelp && (
                <div className="fade-in" style={{ width: '100%', maxWidth: '600px', display: 'grid', gap: '20px' }}>

                    {/* Android Instructions */}
                    <div style={{ background: '#E8F5E9', padding: '16px', borderRadius: '12px', border: '1px solid #C8E6C9' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Download size={18} /> Android (Chrome)
                        </h4>
                        <ol style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem', lineHeight: '1.5', color: '#1B5E20' }}>
                            <li style={{ marginBottom: '8px' }}>Toque nos três pontinhos <Menu size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> no canto superior direito do navegador.</li>
                            <li>Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</li>
                        </ol>
                    </div>

                    {/* iOS Instructions */}
                    <div style={{ background: '#F3E5F5', padding: '16px', borderRadius: '12px', border: '1px solid #E1BEE7' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#7B1FA2', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Share size={18} /> iPhone (Safari)
                        </h4>
                        <ol style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem', lineHeight: '1.5', color: '#4A148C' }}>
                            <li style={{ marginBottom: '8px' }}>Toque no botão de compartilhar <Share size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> na barra inferior.</li>
                            <li>Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.</li>
                        </ol>
                    </div>
                </div>
            )}

            <div style={{ marginTop: 'auto', padding: '20px', color: '#999', fontSize: '0.8rem' }}>
                v1.0.0
            </div>
        </div>
    );
};

export default Welcome;
