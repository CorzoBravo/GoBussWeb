import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Users, Bus, MapPin, TrendingUp, DollarSign, CalendarDays } from 'lucide-react';
import api from '../services/api';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVentas: 0,
    totalViajes: 0,
    totalCooperativas: 0,
    totalUsuarios: 0
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'CONDUCTOR') {
      navigate('/dashboard/conductor-dashboard');
      return;
    }

    if (user?.role === 'USUARIO') {
      navigate('/dashboard/boletos');
      return;
    }

    if (user?.role === 'ADMIN' || user?.role === 'COOPERATIVA') {
        api.get('/admin/dashboard').then(res => {
          setStats(res.data);
        }).catch(err => console.error("Error fetching dashboard stats", err));
    }
  }, [user, navigate]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-surface-800 tracking-tight font-display">Dashboard General</h1>
          <p className="text-surface-500 font-medium mt-1">Resumen de operaciones y rendimiento</p>
        </div>
        <div className="hidden sm:flex items-center text-sm font-bold text-brand-600 bg-brand-50 px-4 py-2 rounded-xl border border-brand-100">
          <CalendarDays className="w-4 h-4 mr-2" />
          General
        </div>
      </div>

      {/* KPI Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${user?.role === 'ADMIN' ? 'lg:grid-cols-4' : ''} gap-6`}>
        <Card className="border-l-4 border-l-brand-500 hover:-translate-y-1 transition-transform cursor-default">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-surface-500 uppercase tracking-wider">Ingresos Totales</p>
              <h3 className="text-2xl font-black text-surface-800 mt-2">${stats.totalVentas.toFixed(2)}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600 font-bold">
            <TrendingUp className="w-4 h-4 mr-1" />
            Actualizado
          </div>
        </Card>

        <Card className="border-l-4 border-l-accent-500 hover:-translate-y-1 transition-transform cursor-default">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-surface-500 uppercase tracking-wider">Viajes Registrados</p>
              <h3 className="text-2xl font-black text-surface-800 mt-2">{stats.totalViajes}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600 font-bold">
            <TrendingUp className="w-4 h-4 mr-1" />
            +5.2% <span className="text-surface-400 font-medium ml-2">vs sem ant.</span>
          </div>
        </Card>

        {user?.role === 'ADMIN' && (
          <>
            <Card className="border-l-4 border-l-info-500 hover:-translate-y-1 transition-transform cursor-default">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-surface-500 uppercase tracking-wider">Cooperativas</p>
                  <h3 className="text-2xl font-black text-surface-800 mt-2">{stats.totalCooperativas}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-info-50 text-info-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-surface-500 font-medium">
                Registradas
              </div>
            </Card>

            <Card className="border-l-4 border-l-success-500 hover:-translate-y-1 transition-transform cursor-default">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-surface-500 uppercase tracking-wider">Usuarios</p>
                  <h3 className="text-2xl font-black text-surface-800 mt-2">{stats.totalUsuarios}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-success-50 text-success-600 flex items-center justify-center">
                  <Bus className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-success-600 font-bold">
                98% <span className="text-surface-400 font-medium ml-2">disponibilidad</span>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
