import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import Calculator from './pages/Calculator';
import Catalog from './pages/Catalog';
import Settings from './pages/Settings';
import Result from './pages/Result';

import { AppProvider, useApp } from './context/AppContext';

// Protected route: redirects to /welcome if not logged in
const ProtectedRoute = ({ children }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/welcome" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/welcome" replace />} />
        <Route path="welcome" element={<Welcome />} />
        <Route path="calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
        <Route path="catalog" element={<ProtectedRoute><Catalog /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
