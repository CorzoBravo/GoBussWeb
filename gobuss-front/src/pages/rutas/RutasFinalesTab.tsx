import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Route as RouteIcon, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

interface Ciudad {
  id: number;
  nombre: string;
}

interface RutaGeneral {
  id: number;
  origen: Ciudad;
  destino: Ciudad;
}

interface RutaFinal {
  id: number;
  rutaGeneral: RutaGeneral;
  precio: number;
}

export const RutasFinalesTab = () => {
  const { user } = useAuth();
  
  const [cooperativas, setCooperativas] = useState<any[]>([]);
  const [selectedRuc, setSelectedRuc] = useState<string>('');
  
  const [rutasFinales, setRutasFinales] = useState<RutaFinal[]>([]);
  const [rutasGenerales, setRutasGenerales] = useState<RutaGeneral[]>([]);
  const [loading, setLoading] = useState(false);

  // Form
  const [rutaGeneralId, setRutaGeneralId] = useState<number | ''>('');
  const [precio, setPrecio] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchCooperativas();
    } else if (user?.role === 'COOPERATIVA') {
      setSelectedRuc(user.ruc || user.id);
    }
    fetchRutasGenerales();
  }, [user]);

  useEffect(() => {
    if (selectedRuc) {
      fetchRutasFinales(selectedRuc);
    } else {
      setRutasFinales([]);
    }
  }, [selectedRuc]);

  const fetchCooperativas = async () => {
    try {
      const response = await api.get('/cooperativas');
      const coops = response.data.content || response.data;
      setCooperativas(coops);
      if (coops.length > 0) {
        setSelectedRuc(coops[0].ruc);
      }
    } catch (error) {
      toast.error('Error al cargar cooperativas');
    }
  };

  const fetchRutasGenerales = async () => {
    try {
      const response = await api.get('/rutas/generales');
      setRutasGenerales(response.data);
    } catch (error) {
      toast.error('Error al cargar rutas generales');
    }
  };

  const fetchRutasFinales = async (ruc: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/rutas/cooperativas/${ruc}`);
      setRutasFinales(response.data);
    } catch (error) {
      toast.error('Error al cargar rutas de la cooperativa');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRuc) {
      toast.error('Seleccione una cooperativa primero');
      return;
    }
    if (!rutaGeneralId || !precio) return;

    try {
      setSubmitting(true);
      if (editingId) {
        await api.put(`/rutas/cooperativas/${selectedRuc}/${editingId}`, { precio });
        toast.success('Ruta actualizada exitosamente');
      } else {
        await api.post(`/rutas/cooperativas/${selectedRuc}`, { rutaGeneralId, precio });
        toast.success('Ruta asignada exitosamente');
      }
      setRutaGeneralId('');
      setPrecio('');
      setEditingId(null);
      fetchRutasFinales(selectedRuc);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar la ruta');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (ruta: RutaFinal) => {
    setEditingId(ruta.id);
    setRutaGeneralId(ruta.rutaGeneral.id);
    setPrecio(ruta.precio);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta ruta?')) {
      try {
        await api.delete(`/rutas/cooperativas/${selectedRuc}/${id}`);
        toast.success('Ruta eliminada');
        fetchRutasFinales(selectedRuc);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error al eliminar ruta');
      }
    }
  };

  return (
    <div className="space-y-6">
      {user?.role === 'ADMIN' && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-1">Cooperativa</label>
          <select
            value={selectedRuc}
            onChange={(e) => setSelectedRuc(e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
          >
            <option value="" disabled>Seleccione...</option>
            {cooperativas.map(c => (
              <option key={c.ruc} value={c.ruc}>{c.nombre}</option>
            ))}
          </select>
        </div>
      )}

      {!selectedRuc ? (
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-10 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-700">Seleccione una cooperativa</h3>
          <p className="text-slate-500 mt-1">Para ver y gestionar sus rutas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Form */}
          <div className="lg:col-span-1 bg-slate-50 p-5 rounded-2xl border border-slate-100 h-fit">
            <h3 className="font-medium text-slate-800 mb-4 flex items-center">
              {editingId ? (
                <><Edit2 className="w-4 h-4 mr-1.5 text-brand-600" /> Editar Ruta</>
              ) : (
                <><Plus className="w-4 h-4 mr-1.5 text-brand-600" /> Asignar Ruta</>
              )}
            </h3>
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Ruta General</label>
                <select
                  value={rutaGeneralId}
                  onChange={(e) => setRutaGeneralId(Number(e.target.value))}
                  disabled={!!editingId}
                  className={`w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none ${editingId ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                >
                  <option value="" disabled>Seleccione ruta...</option>
                  {rutasGenerales.map(r => (
                    <option key={r.id} value={r.id}>{r.origen.nombre} - {r.destino.nombre}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Precio ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={precio}
                  onChange={(e) => setPrecio(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                />
              </div>

              <div className="flex flex-col space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting || !rutaGeneralId || !precio}
                  className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : editingId ? 'Actualizar Precio' : 'Asignar Ruta'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setRutaGeneralId('');
                      setPrecio('');
                    }}
                    className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-xl transition-colors shadow-sm"
                  >
                    Cancelar Edición
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Ruta (Origen - Destino)</th>
                    <th className="px-6 py-4">Precio</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-500">Cargando...</td>
                    </tr>
                  ) : rutasFinales.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-500">No hay rutas asignadas</td>
                    </tr>
                  ) : (
                    rutasFinales.map(ruta => (
                      <tr key={ruta.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 font-medium text-slate-900">
                          <div className="flex items-center">
                            <RouteIcon className="w-4 h-4 mr-2 text-brand-500" />
                            {ruta.rutaGeneral.origen.nombre} <span className="mx-2 text-slate-400">→</span> {ruta.rutaGeneral.destino.nombre}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-brand-700 font-medium text-sm">
                          ${ruta.precio.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEdit(ruta)}
                              className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(ruta.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
