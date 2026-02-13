import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Wrench } from 'lucide-react';

const Welcome = () => {
    const { user, login } = useApp();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/calculator');
        }
    }, [user, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (name.trim()) {
            // Simulate password check (any 4 digits work for now as requested "fake login")
            if (password.length === 4) {
                login(name);
                navigate('/settings'); // Redirect to settings first to setup costs? Or Calculator? User didn't specify, but logically settings.
                // User requirements: "Entrar e Sincronizar". 
                // Let's go to Calculator as main screen, but maybe prompt for settings later.
                navigate('/calculator');
            } else {
                alert("A senha deve ter 4 dígitos.");
            }
        }
    };

    return (
        <div className="page-welcome content-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center' }}>

            <div style={{ marginBottom: '2rem', color: 'var(--primary)' }}>
                <Wrench size={64} />
            </div>

            <h1 style={{ marginBottom: '1rem' }}>Preço Certo Marido de Aluguel</h1>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px' }}>
                Bem-vindo. Seus dados são privados e ficam salvos apenas neste aparelho.
            </p>

            <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Seu Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <input
                        type="tel"
                        placeholder="Senha (4 dígitos)"
                        maxLength={4}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        pattern="[0-9]{4}"
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Entrar e Sincronizar
                </button>
            </form>
        </div>
    );
};

export default Welcome;
