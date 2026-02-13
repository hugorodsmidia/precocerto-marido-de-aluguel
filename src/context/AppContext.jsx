import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('marido_pro_user');
        return saved ? JSON.parse(saved) : null;
    });

    // Default settings
    const defaultSettings = {
        fuelPrice: 5.50,
        fuelConsumption: 10, // km/L
        maintenanceCost: 0.20, // R$/km
        hourlyRate: 50.00,
        monthlyGoal: 5000,
        toolKitValue: 3000,
        taxRate: 0.05 // 5% example
    };

    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('marido_pro_settings');
        return saved ? JSON.parse(saved) : defaultSettings;
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

    useEffect(() => {
        localStorage.setItem('marido_pro_user', JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        localStorage.setItem('marido_pro_settings', JSON.stringify(settings));
    }, [settings]);

    useEffect(() => {
        localStorage.setItem('marido_pro_history', JSON.stringify(history));
    }, [history]);

    const [myPrices, setMyPrices] = useState(() => {
        const saved = localStorage.getItem('marido_pro_myprices');
        return saved ? JSON.parse(saved) : [];
    });

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

    return (
        <AppContext.Provider value={{
            user,
            login,
            logout,
            settings,
            updateSettings,
            history,
            addHistoryItem,
            myPrices,
            addPrice,
            removePrice
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
