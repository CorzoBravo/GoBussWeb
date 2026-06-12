import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Bus, MapPin, Users, CalendarDays, Clock, Route } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'sonner';
import { PasajerosList } from './PasajerosList';

export const ConductorDashboard = () => {
  const [horarios, setHorarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [selectedHorario, setSelectedHorario] = useState<number | null>(null);

  const fetchHorarios = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/conductores-app/mis-horarios?fecha=${fecha}`);
      setHorarios(res.data);
    } catch (error) {
      toast.error('Error al cargar los horarios asignados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorarios();
  }, [fecha]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-surface-800 tracking-tight font-display">Mi Viaje</h1>
          <p className="text-surface-500 font-medium mt-1">Horarios asignados para tu jornada</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-surface-200 shadow-sm">
          <CalendarDays className="w-5 h-5 text-surface-400" />
          <input 
            type="date" 
            value={fecha} 
            onChange={(e) => setFecha(e.target.value)}
            className="border-none outline-none text-surface-700 font-medium bg-transparent focus:ring-0 cursor-pointer"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        </div>
      ) : horarios.length === 0 ? (
        <Card className="flex flex-col justify-center items-center py-16 text-center border-dashed border-2 border-surface-200 bg-surface-50/50">
          <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-4">
            <Bus className="w-8 h-8 text-surface-400" />
          </div>
          <h3 className="text-lg font-bold text-surface-800">Sin rutas programadas</h3>
          <p className="text-surface-500 mt-1 max-w-sm">
            No tienes viajes asignados para la fecha {fecha}. Si crees que esto es un error, contacta a tu cooperativa.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {horarios.map((horario) => {
            const asientosOcupados = horario.asientosReservados || 0;
            const asientosTotales = horario.asientosDisponibles + asientosOcupados;
            const porcentaje = Math.round((asientosOcupados / asientosTotales) * 100) || 0;

            return (
              <Card key={horario.idHorario} className="overflow-hidden group hover:border-brand-200 transition-colors">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 font-bold shadow-sm">
                        <Route className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-surface-900">Horario #{horario.idHorario}</h3>
                        <div className="flex items-center text-sm font-medium text-surface-500 mt-0.5">
                          <Bus className="w-4 h-4 mr-1.5" />
                          Unidad Asignada
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-success-50 text-success-700 border border-success-200">
                        ACTIVO
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 bg-surface-50 p-4 rounded-xl border border-surface-100">
                    <div>
                      <p className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-1">Hora de Salida</p>
                      <div className="flex items-center font-semibold text-surface-800">
                        <Clock className="w-4 h-4 mr-1.5 text-brand-500" />
                        {horario.horaSalida}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-1">Ocupación</p>
                      <div className="flex items-center font-semibold text-surface-800">
                        <Users className="w-4 h-4 mr-1.5 text-accent-500" />
                        {asientosOcupados} / {asientosTotales}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-surface-500">Capacidad del bus</span>
                      <span className="font-bold text-surface-700">{porcentaje}%</span>
                    </div>
                    <div className="w-full bg-surface-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full ${porcentaje > 80 ? 'bg-danger-500' : porcentaje > 50 ? 'bg-warning-500' : 'bg-brand-500'}`} 
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-surface-100 flex justify-end">
                    <Button 
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => setSelectedHorario(horario.idHorario)}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Ver Lista de Pasajeros
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {selectedHorario && (
        <PasajerosList 
          horarioId={selectedHorario} 
          onClose={() => setSelectedHorario(null)} 
        />
      )}
    </div>
  );
};
