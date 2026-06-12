import { useEffect, useState } from 'react';
import api from '../../services/api';
import { MapPin, Search, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Ciudad {
  id: number;
  nombre: string;
}

export const CiudadesTab = () => {
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [newCiudad, setNewCiudad] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCiudades = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rutas/ciudades');
      setCiudades(response.data);
    } catch (error) {
      toast.error('Error al cargar ciudades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCiudades();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCiudad.trim()) return;

    try {
      setSubmitting(true);
      await api.post('/rutas/ciudades', { nombre: newCiudad.trim() });
      toast.success('Ciudad agregada exitosamente');
      setNewCiudad('');
      fetchCiudades();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al agregar ciudad');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta ciudad? Puede estar en uso.')) {
      try {
        await api.delete(`/rutas/ciudades/${id}`);
        toast.success('Ciudad eliminada');
        fetchCiudades();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error al eliminar ciudad');
      }
    }
  };

  const filtered = ciudades.filter(c => c.nombre.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Agregar Ciudad */}
      <div className="md:col-span-1 bg-slate-50 p-5 rounded-2xl border border-slate-100 h-fit">
        <h3 className="font-medium text-slate-800 mb-4 flex items-center">
          <Plus className="w-4 h-4 mr-1.5 text-brand-600" />
          Nueva Ciudad
        </h3>
        <form onSubmit={handleCreate} className="space-y-3">
          <input
            type="text"
            value={newCiudad}
            onChange={(e) => setNewCiudad(e.target.value)}
            placeholder="Nombre de la ciudad..."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
          />
          <button
            type="submit"
            disabled={submitting || !newCiudad.trim()}
            className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            {submitting ? 'Guardando...' : 'Agregar Ciudad'}
          </button>
        </form>
      </div>

      {/* Lista de Ciudades */}
      <div className="md:col-span-2 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50"
            placeholder="Buscar ciudad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <ul className="divide-y divide-slate-100">
            {loading ? (
              <li className="p-6 text-center text-slate-500">Cargando...</li>
            ) : filtered.length === 0 ? (
              <li className="p-6 text-center text-slate-500">No se encontraron ciudades</li>
            ) : (
              filtered.map(ciudad => (
                <li key={ciudad.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center text-slate-700 font-medium">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                    {ciudad.nombre}
                  </div>
                  <button
                    onClick={() => handleDelete(ciudad.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
