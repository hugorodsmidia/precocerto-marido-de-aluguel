import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Wrench, Download, Share, Smartphone, ArrowRight } from 'lucide-react';

const Welcome = () => {
    const { user, login } = useApp();
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [platform, setPlatform] = useState('android');
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        if (user) {
            navigate('/calculator');
        }
    }, [user, navigate]);

    // Capture PWA install prompt
    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            setDeferredPrompt(null);
        } else {
            alert('Use o menu do navegador (⋮) e selecione "Instalar aplicativo" ou "Adicionar à tela inicial".');
        }
    };

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

    if (showLogin) {
        return (
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '85vh' }}>
                <div style={{ marginBottom: '2rem', color: 'var(--primary)', textAlign: 'center' }}>
                    <Wrench size={48} />
                    <h2 style={{ margin: '8px 0 4px' }}>Preço Certo</h2>
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>Marido de Aluguel</p>
                </div>

                <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '350px', background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <h3 style={{ marginTop: 0, fontSize: '1.1rem', marginBottom: '16px', textAlign: 'center' }}>Acesso ao Sistema</h3>
                    <div style={{ marginBottom: '12px' }}>
                        <input
                            type="text"
                            placeholder="Seu Nome"
                            className="minimal"
                            style={{ border: '1px solid #ddd', background: '#f9f9f9', width: '100%', padding: '12px', borderRadius: '8px', fontSize: '1rem' }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            type="tel"
                            placeholder="Senha (4 dígitos)"
                            maxLength={4}
                            className="minimal"
                            style={{ border: '1px solid #ddd', background: '#f9f9f9', width: '100%', padding: '12px', borderRadius: '8px', fontSize: '1rem' }}
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
                    onClick={() => setShowLogin(false)}
                    style={{ marginTop: '20px', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    ← Voltar para instruções
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '85vh' }}>

            {/* Logo */}
            <div style={{ margin: '2rem 0 1.5rem', color: 'var(--primary)', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Wrench size={40} color="var(--primary)" />
                </div>
                <h1 style={{ margin: '0 0 4px', fontSize: '1.6rem' }}>Bem-vindo ao</h1>
                <h1 style={{ margin: 0, fontSize: '1.6rem' }}>Preço Certo</h1>
            </div>

            <p style={{ color: '#888', textAlign: 'center', maxWidth: '320px', marginBottom: '24px', lineHeight: '1.4' }}>
                Instale o aplicativo em seu celular para ter acesso rápido, offline e sem barras de navegação.
            </p>

            {/* Platform Tabs */}
            <div style={{ display: 'flex', width: '100%', maxWidth: '350px', border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
                <button
                    onClick={() => setPlatform('android')}
                    style={{
                        flex: 1, padding: '12px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem',
                        background: platform === 'android' ? '#fff' : '#f5f5f5',
                        color: platform === 'android' ? '#333' : '#999',
                        borderBottom: platform === 'android' ? '2px solid var(--primary)' : '2px solid transparent'
                    }}
                >
                    Android
                </button>
                <button
                    onClick={() => setPlatform('ios')}
                    style={{
                        flex: 1, padding: '12px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem',
                        background: platform === 'ios' ? '#fff' : '#f5f5f5',
                        color: platform === 'ios' ? '#333' : '#999',
                        borderBottom: platform === 'ios' ? '2px solid var(--primary)' : '2px solid transparent'
                    }}
                >
                    iPhone (iOS)
                </button>
            </div>

            {/* Instructions Card */}
            <div style={{ width: '100%', maxWidth: '350px', background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px', border: '1px solid #eee' }}>
                {platform === 'android' ? (
                    <>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Smartphone size={18} color="#2E7D32" />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Passo 1</div>
                                <div style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.4' }}>
                                    Toque no botão abaixo ou no menu do navegador (três pontinhos).
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Download size={18} color="#2E7D32" />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Passo 2</div>
                                <div style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.4' }}>
                                    Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleInstall}
                            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: '#666', color: '#fff', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            <Download size={18} /> Instalar App
                        </button>
                    </>
                ) : (
                    <>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F3E5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Share size={18} color="#7B1FA2" />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Passo 1</div>
                                <div style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.4' }}>
                                    Toque no botão de compartilhar <strong>(⬆)</strong> na barra inferior do Safari.
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F3E5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Download size={18} color="#7B1FA2" />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Passo 2</div>
                                <div style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.4' }}>
                                    Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Access Button */}
            <div style={{ width: '100%', maxWidth: '350px' }}>
                <button
                    onClick={() => setShowLogin(true)}
                    style={{
                        width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #ddd', background: '#fff',
                        cursor: 'pointer', fontWeight: '600', fontSize: '1rem', color: '#333',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                    }}
                >
                    Já instalei / Acessar Agora <ArrowRight size={18} />
                </button>
            </div>

            <div style={{ marginTop: 'auto', padding: '20px', color: '#999', fontSize: '0.8rem' }}>
                v1.0.0
            </div>
        </div>
    );
};

export default Welcome;
