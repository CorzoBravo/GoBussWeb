import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Bus, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { CooperativaFormModal } from './CooperativaFormModal';

interface Cooperativa {
  ruc: string;
  nombre: string;
  direccion: string;
  correo: string;
  telefono: string;
}

export const CooperativasList = () => {
  const [cooperativas, setCooperativas] = useState<Cooperativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCooperativa, setEditingCooperativa] = useState<Cooperativa | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCooperativas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cooperativas');
      setCooperativas(response.data);
    } catch (error) {
      toast.error('Error al cargar las cooperativas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCooperativas();
  }, []);

  const handleOpenCreate = () => {
    setEditingCooperativa(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coop: Cooperativa) => {
    setEditingCooperativa(coop);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      if (editingCooperativa) {
        await api.put(`/cooperativas/${data.ruc}`, data);
        toast.success('Cooperativa actualizada exitosamente');
      } else {
        await api.post('/cooperativas', data);
        toast.success('Cooperativa creada exitosamente');
      }
      setIsModalOpen(false);
      fetchCooperativas();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar la cooperativa');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (ruc: string) => {
    if (window.confirm('¿Está seguro de eliminar esta cooperativa? Esta acción deshabilitará la cooperativa.')) {
      try {
        await api.delete(`/cooperativas/${ruc}`);
        toast.success('Cooperativa eliminada');
        fetchCooperativas();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error al eliminar cooperativa');
      }
    }
  };

  const filteredCooperativas = cooperativas.filter(c => 
    c.nombre.toLowerCase().includes(search.toLowerCase()) || 
    c.ruc.includes(search)
  );

  return (
    <div className="space-y-6">
      <CooperativaFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingCooperativa}
        loading={submitting}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center">
            <Bus className="w-6 h-6 mr-2 text-brand-600" />
            Directorio de Cooperativas
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Gestiona las cooperativas afiliadas a la terminal.</p>
        </div>
        <button onClick={handleOpenCreate} className="flex items-center px-4 py-2.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm active:scale-95">
          <Plus className="w-5 h-5 mr-1.5" />
          Nueva Cooperativa
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
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-slate-50/50"
            placeholder="Buscar por nombre o RUC..."
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
                <th className="px-6 py-4">Cooperativa</th>
                <th className="px-6 py-4">RUC</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Dirección</th>
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
              ) : filteredCooperativas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    No se encontraron cooperativas
                  </td>
                </tr>
              ) : (
                filteredCooperativas.map((coop) => (
                  <tr key={coop.ruc} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {coop.nombre}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {coop.ruc}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900">{coop.correo}</div>
                      <div className="text-slate-500 text-xs">{coop.telefono}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {coop.direccion}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEdit(coop)}
                          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(coop.ruc)}
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
