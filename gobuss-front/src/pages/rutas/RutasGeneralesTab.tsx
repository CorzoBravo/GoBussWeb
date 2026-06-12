import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Ciudad {
  id: number;
  nombre: string;
}

interface RutaGeneral {
  id: number;
  origen: Ciudad;
  destino: Ciudad;
}

export const RutasGeneralesTab = () => {
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [rutas, setRutas] = useState<RutaGeneral[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [origenId, setOrigenId] = useState<number | ''>('');
  const [destinoId, setDestinoId] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rutasRes, ciudadesRes] = await Promise.all([
        api.get('/rutas/generales'),
        api.get('/rutas/ciudades')
      ]);
      setRutas(rutasRes.data);
      setCiudades(ciudadesRes.data);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origenId || !destinoId) return;
    
    if (origenId === destinoId) {
      toast.error('El origen y destino deben ser diferentes');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/rutas/generales', { origenId, destinoId });
      toast.success('Ruta general creada');
      setOrigenId('');
      setDestinoId('');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear ruta');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Agregar Ruta */}
      <div className="lg:col-span-1 bg-slate-50 p-5 rounded-2xl border border-slate-100 h-fit">
        <h3 className="font-medium text-slate-800 mb-4 flex items-center">
          <Plus className="w-4 h-4 mr-1.5 text-brand-600" />
          Nueva Ruta General
        </h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Origen</label>
            <select
              value={origenId}
              onChange={(e) => setOrigenId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white"
            >
              <option value="" disabled>Seleccione ciudad...</option>
              {ciudades.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Destino</label>
            <select
              value={destinoId}
              onChange={(e) => setDestinoId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white"
            >
              <option value="" disabled>Seleccione ciudad...</option>
              {ciudades.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting || !origenId || !destinoId}
            className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50 mt-2"
          >
            {submitting ? 'Creando...' : 'Crear Ruta'}
          </button>
        </form>
      </div>

      {/* Lista de Rutas Generales */}
      <div className="lg:col-span-2">
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Origen</th>
                <th className="px-6 py-4">Destino</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">Cargando...</td>
                </tr>
              ) : rutas.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">No hay rutas generales registradas</td>
                </tr>
              ) : (
                rutas.map(ruta => (
                  <tr key={ruta.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">#{ruta.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{ruta.origen.nombre}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{ruta.destino.nombre}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
