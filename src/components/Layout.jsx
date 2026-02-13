import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Settings, Wallet, Calculator } from 'lucide-react';
import './Layout.css';

import Header from './Header';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/welcome', icon: Home, label: 'Início' },
        { path: '/calculator', icon: Calculator, label: 'Orçamento' },
        { path: '/catalog', icon: Wallet, label: 'Preços' },
        { path: '/settings', icon: Settings, label: 'Ajustes' },
    ];

    return (
        <div className="layout">
            <Header />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>

            <nav className="bottom-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <Icon size={24} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Layout;
