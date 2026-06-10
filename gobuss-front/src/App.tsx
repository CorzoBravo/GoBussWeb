import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const Dashboard = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
    <h2 className="text-2xl font-bold text-slate-800 mb-4">Bienvenido a GoBuss</h2>
    <p className="text-slate-600">Selecciona una opción del menú lateral para comenzar.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="cooperativas" element={<div>Módulo Cooperativas (En desarrollo)</div>} />
            <Route path="rutas" element={<div>Módulo Rutas (En desarrollo)</div>} />
            <Route path="horarios" element={<div>Módulo Horarios (En desarrollo)</div>} />
            <Route path="reportes" element={<div>Módulo Reportes (En desarrollo)</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
