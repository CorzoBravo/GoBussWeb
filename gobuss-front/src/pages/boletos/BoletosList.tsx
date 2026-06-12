import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Ticket, MapPin, Calendar, Search, ArrowRight, Bus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AsientosModal } from './AsientosModal';

export const BoletosList = () => {
  const [ciudades, setCiudades] = useState<any[]>([]);
  const [origenId, setOrigenId] = useState<number>(0);
  const [destinoId, setDestinoId] = useState<number>(0);
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [horarios, setHorarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedHorarioId, setSelectedHorarioId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCiudades();
  }, []);

  const fetchCiudades = async () => {
    try {
      const response = await api.get('/ciudades');
      setCiudades(response.data);
    } catch (error) {
      toast.error('Error al cargar ciudades');
    }
  };

  const handleSearch = async () => {
    if (!origenId || !destinoId) {
      toast.error('Seleccione origen y destino');
      return;
    }
    if (origenId === destinoId) {
      toast.error('El origen y destino no pueden ser el mismo');
      return;
    }
    try {
      setLoading(true);
      setHasSearched(true);
      const response = await api.get(`/horarios/search?fecha=${fecha}&origenId=${origenId}&destinoId=${destinoId}`);
      setHorarios(response.data);
    } catch (error) {
      toast.error('Error al buscar horarios');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAsientos = (idHorario: number) => {
    setSelectedHorarioId(idHorario);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {selectedHorarioId && (
        <AsientosModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          horarioId={selectedHorarioId}
        />
      )}

      {/* Header & Search */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Bus className="w-64 h-64 text-brand-600" />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center mb-2">
            <Ticket className="w-8 h-8 mr-3 text-brand-600" />
            Compra de Boletos
          </h2>
          <p className="text-slate-500 font-medium mb-8">Encuentra tu ruta y selecciona tus asientos ideales para tu próximo viaje.</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/60 shadow-inner">
            <div className="space-y-1.5 md:col-span-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1" /> Origen
              </label>
              <select
                value={origenId}
                onChange={(e) => setOrigenId(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-slate-700"
              >
                <option value={0} disabled>Seleccionar...</option>
                {ciudades.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1" /> Destino
              </label>
              <select
                value={destinoId}
                onChange={(e) => setDestinoId(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-slate-700"
              >
                <option value={0} disabled>Seleccionar...</option>
                {ciudades.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" /> Fecha
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-slate-700"
              />
            </div>

            <div className="flex items-end md:col-span-1">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center disabled:opacity-70"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-700 px-1">Resultados de Búsqueda</h3>
          
          {horarios.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
              <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
              <h4 className="text-lg font-medium text-slate-800">No hay rutas disponibles</h4>
              <p className="text-slate-500 mt-1 max-w-sm">No pudimos encontrar horarios para la fecha y ruta seleccionada. Intenta cambiando los criterios de búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {horarios.map((horario) => (
                <div key={horario.idHorario} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col">
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-md mb-2 inline-block">
                        {horario.fecha}
                      </span>
                      <div className="text-2xl font-black text-slate-800 tracking-tight">{horario.horaSalida}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-500">Asientos Libres</div>
                      <div className={`text-xl font-bold ${horario.asientosDisponibles > 5 ? 'text-emerald-600' : 'text-amber-500'}`}>
                        {horario.asientosDisponibles}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center text-slate-700 font-medium mb-1">
                      {ciudades.find(c => c.id === origenId)?.nombre || 'Origen'}
                      <ArrowRight className="w-4 h-4 mx-2 text-slate-400" />
                      {ciudades.find(c => c.id === destinoId)?.nombre || 'Destino'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenAsientos(horario.idHorario)}
                    className="mt-6 w-full py-2.5 bg-slate-50 hover:bg-brand-50 text-slate-700 hover:text-brand-700 font-medium rounded-xl transition-colors border border-slate-200 hover:border-brand-200 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600"
                  >
                    Seleccionar Asientos
                    <Ticket className="w-4 h-4 ml-2 opacity-70" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
