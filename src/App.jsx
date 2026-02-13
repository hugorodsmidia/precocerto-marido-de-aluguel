import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import Calculator from './pages/Calculator';
import Catalog from './pages/Catalog';
import Settings from './pages/Settings';
import Result from './pages/Result';

import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/welcome" replace />} />
            <Route path="welcome" element={<Welcome />} />
            <Route path="calculator" element={<Calculator />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="settings" element={<Settings />} />
            <Route path="result" element={<Result />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
