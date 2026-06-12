import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Bus, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { CooperativaFormModal } from './CooperativaFormModal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loading } from '../../components/ui/Loading';

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
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCooperativas = async () => {
    try {
      setLoading(true);
      const url = search 
        ? `/cooperativas/search?q=${search}&page=${page}&size=10`
        : `/cooperativas?page=${page}&size=10`;
      const response = await api.get(url);
      setCooperativas(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Error al cargar las cooperativas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCooperativas();
  }, [page, search]);

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

  return (
    <div className="space-y-6 animate-fade-in">
      <CooperativaFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingCooperativa}
        loading={submitting}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
        <div>
          <h2 className="text-2xl font-bold text-surface-800 tracking-tight flex items-center font-display">
            <Bus className="w-6 h-6 mr-2 text-brand-600" />
            Directorio de Cooperativas
          </h2>
          <p className="text-sm text-surface-500 mt-1 font-medium">Gestiona las cooperativas afiliadas a la terminal.</p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" icon={<Plus className="w-5 h-5" />}>
          Nueva Cooperativa
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-surface-200 flex items-center">
        <div className="relative flex-1 max-w-md">
          <Input
            icon={<Search className="w-5 h-5 text-surface-400" />}
            placeholder="Buscar por nombre o RUC..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-50/80 text-surface-600 font-semibold border-b border-surface-200 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Cooperativa</th>
                <th className="px-6 py-4">RUC</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Dirección</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10">
                    <Loading mode="bus" message="Cargando cooperativas..." />
                  </td>
                </tr>
              ) : cooperativas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10">
                    <EmptyState 
                      icon={Bus}
                      title="No se encontraron cooperativas"
                      description={search ? "Intenta con otro término de búsqueda." : "Aún no hay cooperativas registradas en el sistema."}
                      actionLabel={!search ? "Crear la primera cooperativa" : undefined}
                      onAction={!search ? handleOpenCreate : undefined}
                    />
                  </td>
                </tr>
              ) : (
                cooperativas.map((coop) => (
                  <tr key={coop.ruc} className="hover:bg-surface-50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-surface-900 font-display">
                      {coop.nombre}
                    </td>
                    <td className="px-6 py-4 text-surface-500 font-mono text-xs font-semibold">
                      {coop.ruc}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-surface-900 font-medium">{coop.correo}</div>
                      <div className="text-surface-500 text-xs">{coop.telefono}</div>
                    </td>
                    <td className="px-6 py-4 text-surface-600 font-medium">
                      {coop.direccion}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEdit(coop)}
                          className="p-2 text-surface-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(coop.ruc)}
                          className="p-2 text-surface-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                          title="Eliminar"
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
        
        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-surface-200 bg-surface-50">
            <span className="text-sm text-surface-500 font-medium">
              Página <span className="font-bold text-surface-800">{page + 1}</span> de <span className="font-bold text-surface-800">{totalPages}</span>
            </span>
            <div className="flex space-x-2">
              <Button 
                variant="secondary"
                size="sm"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Anterior
              </Button>
              <Button 
                variant="secondary"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
