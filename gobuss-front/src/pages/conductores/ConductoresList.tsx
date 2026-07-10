import { useEffect, useState } from 'react';
import api from '../../services/api';
import { UserPlus, Search, Edit2, Trash2, Bus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ConductorFormModal } from './ConductorFormModal';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loading } from '../../components/ui/Loading';

interface Conductor {
  cedula: string;
  nombre: string;
  celular: string;
  rucCooperativa: string;
  idRutaAsignada: number | null;
  idUnidadAsignada: number | null;
}

interface Cooperativa {
  ruc: string;
  nombre: string;
}

export const ConductoresList = () => {
  const { user } = useAuth();
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [cooperativas, setCooperativas] = useState<Cooperativa[]>([]);
  const [selectedRuc, setSelectedRuc] = useState<string>('');
  
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConductor, setEditingConductor] = useState<Conductor | null>(null);
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
      fetchConductores(selectedRuc);
    } else {
      setConductores([]);
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

  const fetchConductores = async (ruc: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/cooperativas/${ruc}/conductores`);
      setConductores(response.data);
    } catch (error) {
      toast.error('Error al cargar conductores');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    if (!selectedRuc) {
      toast.error('Seleccione una cooperativa primero');
      return;
    }
    setEditingConductor(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (conductor: Conductor) => {
    setEditingConductor(conductor);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Partial<Conductor>) => {
    try {
      setSubmitting(true);
      
      const payload = {
        ...data,
        idRutaAsignada: data.idRutaAsignada || null,
        idUnidadAsignada: data.idUnidadAsignada || null,
      };

      if (editingConductor) {
        await api.put(`/cooperativas/${selectedRuc}/conductores/${data.cedula}`, payload);
        toast.success('Conductor actualizado exitosamente');
      } else {
        await api.post(`/cooperativas/${selectedRuc}/conductores`, payload);
        toast.success('Conductor registrado exitosamente');
      }
      setIsModalOpen(false);
      fetchConductores(selectedRuc);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar el conductor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cedula: string) => {
    if (window.confirm('¿Está seguro de eliminar este conductor? Esta acción es irreversible.')) {
      try {
        await api.delete(`/cooperativas/${selectedRuc}/conductores/${cedula}`);
        toast.success('Conductor eliminado');
        fetchConductores(selectedRuc);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error al eliminar conductor');
      }
    }
  };

  const filteredConductores = conductores.filter(c => 
    c.nombre.toLowerCase().includes(search.toLowerCase()) || 
    c.cedula.includes(search)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <ConductorFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingConductor}
        loading={submitting}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
        <div>
          <h2 className="text-2xl font-bold text-surface-800 tracking-tight flex items-center font-display">
            <UserPlus className="w-6 h-6 mr-2 text-brand-600" />
            Directorio de Conductores
          </h2>
          <p className="text-sm text-surface-500 mt-1 font-medium">Gestiona el personal de conducción de las unidades.</p>
        </div>
        <Button 
          onClick={handleOpenCreate} 
          disabled={!selectedRuc}
          icon={<UserPlus className="w-5 h-5" />}
        >
          Registrar Conductor
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
            placeholder="Buscar por nombre o cédula..."
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
          description="Para ver y gestionar sus conductores, primero debe seleccionar una cooperativa."
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-50/80 text-surface-600 font-semibold border-b border-surface-200 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4">Conductor</th>
                  <th className="px-6 py-4">Cédula</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">Asignaciones</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10">
                      <Loading type="bus" text="Cargando conductores..." />
                    </td>
                  </tr>
                ) : filteredConductores.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10">
                      <EmptyState 
                        icon={<UserPlus />}
                        title="No se encontraron conductores"
                        description={search ? "Intenta con otro término de búsqueda." : "Aún no hay conductores registrados para esta cooperativa."}
                        actionLabel={!search ? "Registrar primer conductor" : undefined}
                        onAction={!search ? handleOpenCreate : undefined}
                      />
                    </td>
                  </tr>
                ) : (
                  filteredConductores.map((conductor) => (
                    <tr key={conductor.cedula} className="hover:bg-surface-50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-surface-900 font-display">
                        {conductor.nombre}
                      </td>
                      <td className="px-6 py-4 text-surface-500 font-mono text-xs font-semibold">
                        {conductor.cedula}
                      </td>
                      <td className="px-6 py-4 text-surface-600 font-medium">
                        {conductor.celular}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1.5">
                          {conductor.idUnidadAsignada ? (
                            <span className="inline-flex items-center text-xs font-bold text-brand-700 bg-brand-50 px-2 py-1 rounded-md border border-brand-100 w-fit">
                              <Bus className="w-3 h-3 mr-1" />
                              Unidad: {conductor.idUnidadAsignada}
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-surface-400 bg-surface-100 px-2 py-1 rounded-md w-fit">Sin unidad</span>
                          )}
                          
                          {conductor.idRutaAsignada && (
                            <span className="inline-flex items-center text-xs font-bold text-accent-700 bg-accent-50 px-2 py-1 rounded-md border border-accent-100 w-fit">
                              Ruta: {conductor.idRutaAsignada}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenEdit(conductor)}
                            className="p-2 text-surface-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(conductor.cedula)}
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

