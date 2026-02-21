import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // isLoading impede decisões de rota antes do localStorage ser lido
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Default settings
    const defaultSettings = {
        businessName: 'Preço Certo Marido de Aluguel',
        fuelPrice: 5.50,
        fuelConsumption: 10,
        maintenanceCost: 0.20,
        hourlyRate: 50.00,
        monthlyGoal: 5000,
        toolKitValue: 3000,
        taxRate: 5
    };

    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem('marido_pro_settings');
            return saved ? JSON.parse(saved) : defaultSettings;
        } catch {
            return defaultSettings;
        }
    });

    const [history, setHistory] = useState(() => {
        try {
            const saved = localStorage.getItem('marido_pro_history');
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Erro ao carregar histórico:", e);
            return [];
        }
    });

    const [myPrices, setMyPrices] = useState(() => {
        try {
            const saved = localStorage.getItem('marido_pro_myprices');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Carrega o usuário de forma assíncrona para evitar race condition
    useEffect(() => {
        try {
            const saved = localStorage.getItem('marido_pro_user');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Valida que o objeto salvo é um usuário real (tem nome)
                if (parsed && typeof parsed === 'object' && parsed.name) {
                    setUser(parsed);
                }
            }
        } catch (e) {
            console.error('Erro ao carregar usuário:', e);
            localStorage.removeItem('marido_pro_user');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Persiste usuário — usa removeItem ao invés de salvar "null"
    useEffect(() => {
        if (isLoading) return; // não persiste durante a carga inicial
        if (user) {
            localStorage.setItem('marido_pro_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('marido_pro_user');
        }
    }, [user, isLoading]);

    useEffect(() => {
        localStorage.setItem('marido_pro_settings', JSON.stringify(settings));
    }, [settings]);

    useEffect(() => {
        localStorage.setItem('marido_pro_history', JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem('marido_pro_myprices', JSON.stringify(myPrices));
    }, [myPrices]);

    const login = (name) => {
        setUser({ name });
    };

    const logout = () => {
        setUser(null);
    };

    const addHistoryItem = (item) => {
        setHistory(prev => [item, ...prev]);
    };

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const addPrice = (priceItem) => {
        setMyPrices(prev => [...prev, { ...priceItem, id: Date.now() }]);
    };

    const removePrice = (id) => {
        setMyPrices(prev => prev.filter(item => item.id !== id));
    };
    const exportBackup = useCallback(() => {
        const data = {
            version: 1,
            exportDate: new Date().toISOString(),
            user,
            settings,
            history,
            myPrices
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `preco_certo_backup_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [user, settings, history, myPrices]);

    const importBackup = useCallback((file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const data = JSON.parse(evt.target.result);
                    // Valida estrutura mínima
                    if (!data || typeof data !== 'object') throw new Error('Arquivo inválido');

                    if (data.settings && typeof data.settings === 'object') {
                        setSettings(prev => ({ ...prev, ...data.settings }));
                    }
                    if (Array.isArray(data.history)) {
                        setHistory(data.history);
                    }
                    if (Array.isArray(data.myPrices)) {
                        setMyPrices(data.myPrices);
                    }
                    if (data.user && typeof data.user === 'object' && data.user.name) {
                        setUser(data.user);
                    }
                    resolve(data.exportDate || 'data desconhecida');
                } catch (e) {
                    reject(e);
                }
            };
            reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
            reader.readAsText(file);
        });
    }, []);

    return (
        <AppContext.Provider value={{
            user,
            isLoading,
            login,
            logout,
            settings,
            updateSettings,
            history,
            addHistoryItem,
            myPrices,
            addPrice,
            removePrice,
            exportBackup,
            importBackup
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
