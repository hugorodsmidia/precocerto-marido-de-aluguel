import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wrench, Settings, LogOut, ArrowLeft, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useApp();

    const getTitle = () => {
        switch (location.pathname) {
            case '/calculator': return 'Calculadora';
            case '/catalog': return 'Meus Preços';
            case '/settings': return 'Ajustes';
            case '/result': return 'Resultado';
            case '/welcome': return 'Bem-vindo';
            default: return 'Marido Pro';
        }
    };

    const isHome = location.pathname === '/welcome';
    const [showHelp, setShowHelp] = React.useState(false);

    return (
        <>
            <header className="app-header">
                <div className="header-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {!isHome && (
                            <button onClick={() => navigate(-1)} className="icon-btn-ghost">
                                <ArrowLeft size={24} />
                            </button>
                        )}
                        <div className="app-logo">
                            <Wrench size={20} color="#FFF" />
                        </div>
                        <div>
                            <h1 className="app-title">Preço Certo</h1>
                            <span className="app-subtitle">{getTitle()}</span>
                        </div>
                    </div>

                    <div className="header-actions">
                        <button className="icon-btn" onClick={() => setShowHelp(true)} aria-label="Como fazer?">
                            <HelpCircle size={20} />
                        </button>
                        <button className="icon-btn" onClick={() => navigate('/settings')}>
                            <Settings size={20} />
                        </button>
                        <button className="icon-btn" onClick={logout}>
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {showHelp && (
                <div className="modal-overlay" onClick={() => setShowHelp(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Como usar o App?</h2>
                        <ul style={{ textAlign: 'left', margin: '16px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
                            <li><strong>1. Ajustes:</strong> Configure o valor da sua hora e custo de deslocamento.</li>
                            <li><strong>2. Meus Preços:</strong> Cadastre seus serviços e valores base para agilizar.</li>
                            <li><strong>3. Orçamento:</strong> Na calculadora, preencha os dados do cliente e adicione os serviços.</li>
                            <li><strong>4. Resultado:</strong> Veja o total sugerido e gere um PDF profissional para enviar no WhatsApp.</li>
                        </ul>
                        <button className="btn btn-primary" onClick={() => setShowHelp(false)}>
                            Entendi
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
