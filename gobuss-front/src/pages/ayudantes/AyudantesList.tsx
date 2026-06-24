import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, Search, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AyudanteFormModal } from './AyudanteFormModal';

interface Ayudante {
  cedula: string;
  nombres: string;
  celular: string;
  conductorAsignadoCedula: string | null;
}

export const AyudantesList = () => {
  const [ayudantes, setAyudantes] = useState<Ayudante[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAyudante, setEditingAyudante] = useState<Ayudante | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAyudantes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ayudantes');
      setAyudantes(response.data);
    } catch (error) {
      toast.error('Error al cargar ayudantes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAyudantes();
  }, []);

  const handleOpenCreate = () => {
    setEditingAyudante(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ayudante: Ayudante) => {
    setEditingAyudante(ayudante);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Partial<Ayudante>) => {
    try {
      setSubmitting(true);
      
      const payload = {
        ...data,
        conductorAsignadoCedula: data.conductorAsignadoCedula || null,
      };

      if (editingAyudante) {
        await api.put(`/ayudantes/${data.cedula}`, payload);
        toast.success('Ayudante actualizado exitosamente');
      } else {
        await api.post('/ayudantes', payload);
        toast.success('Ayudante registrado exitosamente');
      }
      setIsModalOpen(false);
      fetchAyudantes();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar el ayudante');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cedula: string) => {
    if (window.confirm('¿Está seguro de eliminar este ayudante? Esta acción es irreversible.')) {
      try {
        await api.delete(`/ayudantes/${cedula}`);
        toast.success('Ayudante eliminado');
        fetchAyudantes();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error al eliminar ayudante');
      }
    }
  };

  const filteredAyudantes = ayudantes.filter(a => 
    a.nombres.toLowerCase().includes(search.toLowerCase()) || 
    a.cedula.includes(search)
  );

  return (
    <div className="space-y-6">
      <AyudanteFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingAyudante}
        loading={submitting}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center">
            <Users className="w-6 h-6 mr-2 text-brand-600" />
            Directorio de Ayudantes
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Gestiona el personal de apoyo de las unidades.</p>
        </div>
        <button 
          onClick={handleOpenCreate} 
          className="flex items-center px-4 py-2.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm active:scale-95"
        >
          <Users className="w-5 h-5 mr-1.5" />
          Registrar Ayudante
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-slate-50/50 outline-none"
            placeholder="Buscar por nombres o cédula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Ayudante</th>
                <th className="px-6 py-4">Cédula</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Conductor Asignado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </td>
                </tr>
              ) : filteredAyudantes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    No se encontraron ayudantes
                  </td>
                </tr>
              ) : (
                filteredAyudantes.map((ayudante) => (
                  <tr key={ayudante.cedula} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {ayudante.nombres}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {ayudante.cedula}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {ayudante.celular}
                    </td>
                    <td className="px-6 py-4">
                      {ayudante.conductorAsignadoCedula ? (
                        <span className="inline-flex items-center text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">
                          CI: {ayudante.conductorAsignadoCedula}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEdit(ayudante)}
                          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(ayudante.cedula)}
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
  );
};

