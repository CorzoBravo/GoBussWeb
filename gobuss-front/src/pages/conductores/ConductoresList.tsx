import { useEffect, useState } from 'react';
import api from '../../services/api';
import { UserPlus, Search, Edit2, Trash2, Bus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ConductorFormModal } from './ConductorFormModal';
import { useAuth } from '../../context/AuthContext';

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
      setSelectedRuc(user.id);
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
      setCooperativas(response.data);
      if (response.data.length > 0) {
        setSelectedRuc(response.data[0].ruc);
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

  const handleSubmit = async (data: any) => {
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
    <div className="space-y-6">
      <ConductorFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingConductor}
        loading={submitting}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center">
            <UserPlus className="w-6 h-6 mr-2 text-brand-600" />
            Directorio de Conductores
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Gestiona el personal de conducción de las unidades.</p>
        </div>
        <button 
          onClick={handleOpenCreate} 
          disabled={!selectedRuc}
          className="flex items-center px-4 py-2.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserPlus className="w-5 h-5 mr-1.5" />
          Registrar Conductor
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        {user?.role === 'ADMIN' && (
          <div className="w-full md:w-64">
            <select
              value={selectedRuc}
              onChange={(e) => setSelectedRuc(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-slate-50/50 outline-none text-slate-700"
            >
              <option value="" disabled>Seleccionar Cooperativa</option>
              {cooperativas.map(c => (
                <option key={c.ruc} value={c.ruc}>{c.nombre}</option>
              ))}
            </select>
          </div>
        )}

        <div className="relative flex-1 w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-slate-50/50 outline-none"
            placeholder="Buscar por nombre o cédula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {!selectedRuc ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-700">Seleccione una cooperativa</h3>
          <p className="text-slate-500 mt-1">Para ver y gestionar sus conductores.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Conductor</th>
                  <th className="px-6 py-4">Cédula</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">Asignaciones</th>
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
                ) : filteredConductores.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                      No se encontraron conductores
                    </td>
                  </tr>
                ) : (
                  filteredConductores.map((conductor) => (
                    <tr key={conductor.cedula} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {conductor.nombre}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                        {conductor.cedula}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {conductor.celular}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          {conductor.idUnidadAsignada ? (
                            <span className="inline-flex items-center text-xs text-brand-700 bg-brand-50 px-2 py-1 rounded-md">
                              <Bus className="w-3 h-3 mr-1" />
                              Unidad: {conductor.idUnidadAsignada}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">Sin unidad</span>
                          )}
                          
                          {conductor.idRutaAsignada && (
                            <span className="inline-flex items-center text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">
                              Ruta: {conductor.idRutaAsignada}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenEdit(conductor)}
                            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(conductor.cedula)}
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
      )}
    </div>
  );
};
