import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Bus, Search, Edit2, Trash2, AlertCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { UnidadFormModal } from './UnidadFormModal';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loading } from '../../components/ui/Loading';

interface Unidad {
  idUnidad: number;
  numero: number;
  placa: string;
  modelo: string;
  capacidad: number;
  fabricado: string;
}

interface Cooperativa {
  ruc: string;
  nombre: string;
}

export const UnidadesList = () => {
  const { user } = useAuth();
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [cooperativas, setCooperativas] = useState<Cooperativa[]>([]);
  const [selectedRuc, setSelectedRuc] = useState<string>('');
  
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnidad, setEditingUnidad] = useState<Unidad | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchCooperativas();
    } else if (user?.role === 'COOPERATIVA') {
      setSelectedRuc(user.ruc || user.id);
    }
  }, [user]);

  useEffect(() => {
    if (selectedRuc) {
      fetchUnidades(selectedRuc);
    } else {
      setUnidades([]);
    }
  }, [selectedRuc]);

  const fetchCooperativas = async () => {
    try {
      const response = await api.get('/cooperativas');
      setCooperativas(response.data);
      if (response.data.length > 0) {
        setSelectedRuc(response.data[0].ruc);
      }
    } catch (error) {
      toast.error('Error al cargar cooperativas');
    }
  };

  const fetchUnidades = async (ruc: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/cooperativas/${ruc}/unidades`);
      setUnidades(response.data);
    } catch (error) {
      toast.error('Error al cargar unidades');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    if (!selectedRuc) {
      toast.error('Seleccione una cooperativa primero');
      return;
    }
    setEditingUnidad(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (unidad: Unidad) => {
    setEditingUnidad(unidad);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Partial<Unidad>) => {
    try {
      setSubmitting(true);
      
      if (editingUnidad) {
        await api.put(`/cooperativas/${selectedRuc}/unidades/${editingUnidad.idUnidad}`, data);
        toast.success('Unidad actualizada exitosamente');
      } else {
        await api.post(`/cooperativas/${selectedRuc}/unidades`, data);
        toast.success('Unidad registrada exitosamente');
      }
      setIsModalOpen(false);
      fetchUnidades(selectedRuc);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar la unidad');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta unidad? Esta acción es irreversible.')) {
      try {
        await api.delete(`/cooperativas/${selectedRuc}/unidades/${id}`);
        toast.success('Unidad eliminada');
        fetchUnidades(selectedRuc);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error al eliminar unidad');
      }
    }
  };

  const filteredUnidades = unidades.filter(u => 
    u.placa.toLowerCase().includes(search.toLowerCase()) || 
    u.numero.toString().includes(search)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <UnidadFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingUnidad}
        loading={submitting}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
        <div>
          <h2 className="text-2xl font-bold text-surface-800 tracking-tight flex items-center font-display">
            <Bus className="w-6 h-6 mr-2 text-brand-600" />
            Directorio de Unidades
          </h2>
          <p className="text-sm text-surface-500 mt-1 font-medium">Gestiona la flota de buses de la cooperativa.</p>
        </div>
        <Button 
          onClick={handleOpenCreate} 
          disabled={!selectedRuc}
          icon={<Plus className="w-5 h-5" />}
        >
          Registrar Unidad
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-surface-200 flex flex-col md:flex-row gap-4 items-center">
        {user?.role === 'ADMIN' && (
          <div className="w-full md:w-64">
            <select
              value={selectedRuc}
              onChange={(e) => setSelectedRuc(e.target.value)}
              className="w-full px-3 py-2.5 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-surface-50 outline-none text-surface-700 font-medium"
            >
              <option value="" disabled>Seleccionar Cooperativa</option>
              {cooperativas.map(c => (
                <option key={c.ruc} value={c.ruc}>{c.nombre}</option>
              ))}
            </select>
          </div>
        )}

        <div className="relative flex-1 w-full max-w-md">
          <Input
            icon={<Search className="w-5 h-5 text-surface-400" />}
            placeholder="Buscar por placa o número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {!selectedRuc ? (
        <EmptyState 
          icon={<AlertCircle />}
          title="Seleccione una cooperativa"
          description="Para ver y gestionar sus unidades, primero debe seleccionar una cooperativa."
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-50/80 text-surface-600 font-semibold border-b border-surface-200 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4">Unidad</th>
                  <th className="px-6 py-4">Placa</th>
                  <th className="px-6 py-4">Modelo</th>
                  <th className="px-6 py-4">Capacidad</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10">
                      <Loading type="bus" text="Cargando unidades..." />
                    </td>
                  </tr>
                ) : filteredUnidades.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10">
                      <EmptyState 
                        icon={<Bus />}
                        title="No se encontraron unidades"
                        description={search ? "Intenta con otro término de búsqueda." : "Aún no hay unidades registradas para esta cooperativa."}
                        actionLabel={!search ? "Registrar primera unidad" : undefined}
                        onAction={!search ? handleOpenCreate : undefined}
                      />
                    </td>
                  </tr>
                ) : (
                  filteredUnidades.map((unidad) => (
                    <tr key={unidad.idUnidad} className="hover:bg-surface-50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-surface-900 font-display">
                        Bus #{unidad.numero}
                      </td>
                      <td className="px-6 py-4 text-surface-500 font-mono text-xs font-semibold">
                        {unidad.placa}
                      </td>
                      <td className="px-6 py-4 text-surface-600 font-medium">
                        {unidad.modelo} <span className="text-surface-400 text-xs ml-1">({unidad.fabricado})</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center text-xs font-bold text-brand-700 bg-brand-50 px-2 py-1 rounded-md border border-brand-100 w-fit">
                          {unidad.capacidad} pasajeros
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenEdit(unidad)}
                            className="p-2 text-surface-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(unidad.idUnidad)}
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
        </div>
      )}
    </div>
  );
};

