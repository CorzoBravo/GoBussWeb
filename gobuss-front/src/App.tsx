import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleRoute } from './components/RoleRoute';
import { Toaster } from 'sonner';
import { CooperativasList } from './pages/cooperativas/CooperativasList';
import { ConductoresList } from './pages/conductores/ConductoresList';
import { AyudantesList } from './pages/ayudantes/AyudantesList';
import { RutasList } from './pages/rutas/RutasList';
import { HorariosList } from './pages/horarios/HorariosList';
import { ReportesList } from './pages/reportes/ReportesList';
import { BoletosList } from './pages/boletos/BoletosList';
import { MisBoletos } from './pages/boletos/MisBoletos';
import { Landing } from './pages/public/Landing';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute />
            }
          >
            <Route element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              
              <Route element={<RoleRoute roles={['ADMIN']} />}>
                <Route path="cooperativas" element={<CooperativasList />} />
              </Route>

              <Route element={<RoleRoute roles={['USUARIO']} />}>
                <Route path="boletos" element={<BoletosList />} />
                <Route path="mis-boletos" element={<MisBoletos />} />
              </Route>

              <Route element={<RoleRoute roles={['ADMIN', 'COOPERATIVA']} />}>
                <Route path="conductores" element={<ConductoresList />} />
                <Route path="ayudantes" element={<AyudantesList />} />
                <Route path="rutas" element={<RutasList />} />
                <Route path="horarios" element={<HorariosList />} />
                <Route path="reportes" element={<ReportesList />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
