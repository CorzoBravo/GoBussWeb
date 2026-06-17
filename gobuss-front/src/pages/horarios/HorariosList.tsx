import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Calendar as CalendarIcon, Search, Plus, Power, Bus, Route as RouteIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { HorarioFormModal } from './HorarioFormModal';

interface Horario {
  idHorario: number;
  fecha: string;
  horaSalida: string;
  unidad: any;
  rutaFinal: any;
  activo: boolean;
  asientosDisponibles: number;
  asientosReservados: number;
  conductorNombre?: string;
}

export const HorariosList = () => {
  const { user } = useAuth();
  
  const [cooperativas, setCooperativas] = useState<any[]>([]);
  const [selectedRuc, setSelectedRuc] = useState<string>('');
  
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [rutasFinales, setRutasFinales] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [conductores, setConductores] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      fetchData(selectedRuc, page);
    } else {
      setHorarios([]);
      setRutasFinales([]);
      setUnidades([]);
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

  const fetchData = async (ruc: string, pageNum: number = 0) => {
    try {
      setLoading(true);
      const [horariosRes, rutasRes, unidadesRes, conductoresRes] = await Promise.all([
        api.get(`/horarios/cooperativa/${ruc}?page=${pageNum}&size=10`),
        api.get(`/rutas/cooperativas/${ruc}`),
        api.get(`/cooperativas/${ruc}/unidades`).catch(() => ({ data: [] })),
        api.get(`/cooperativas/${ruc}/conductores`).catch(() => ({ data: [] }))
      ]);
      setHorarios(horariosRes.data.content);
      setTotalPages(horariosRes.data.totalPages);
      setRutasFinales(rutasRes.data);
      setUnidades(unidadesRes.data);
      setConductores(conductoresRes.data);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    if (!selectedRuc) {
      toast.error('Seleccione una cooperativa');
      return;
    }
    if (rutasFinales.length === 0) {
      toast.error('La cooperativa no tiene rutas asignadas');
      return;
    }
    if (unidades.length === 0) {
      toast.error('La cooperativa no tiene unidades registradas');
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      // Construct payload
      const payload = {
        rutaFinalId: data.rutaFinalId,
        unidadId: data.unidadId,
        fecha: data.fecha,
        horaSalida: data.horaSalida + ":00", // Ensure HH:mm:ss if required by backend, though HH:mm might be parsed correctly by string
        conductorCedula: data.conductorCedula,
        isRecurrente: data.isRecurrente,
        diasSemana: data.diasSemana,
        fechaFin: data.fechaFin
      };

      const res = await api.post(`/horarios/cooperativa/${selectedRuc}`, payload);
      const message = data.isRecurrente ? `Se han creado ${res.data.length} horarios recurrentes` : 'Horario creado exitosamente';
      toast.success(message);
      setIsModalOpen(false);
      fetchData(selectedRuc, page);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear horario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await api.patch(`/horarios/cooperativa/${selectedRuc}/${id}/toggle-status`);
      toast.success('Estado actualizado');
      fetchData(selectedRuc, page);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const filteredHorarios = horarios.filter(h => {
    const searchString = `${h.rutaFinal.rutaGeneral.origen.nombre} ${h.rutaFinal.rutaGeneral.destino.nombre} ${h.fecha}`.toLowerCase();
    return searchString.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <HorarioFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        rutasFinales={rutasFinales}
        unidades={unidades}
        conductores={conductores}
        loading={submitting}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center">
            <CalendarIcon className="w-6 h-6 mr-2 text-brand-600" />
            Programación de Horarios
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Gestiona las salidas, unidades y rutas.</p>
        </div>
        <button 
          onClick={handleOpenCreate} 
          disabled={!selectedRuc}
          className="flex items-center px-4 py-2.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm active:scale-95 disabled:opacity-50"
        >
          <Plus className="w-5 h-5 mr-1.5" />
          Nuevo Horario
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        {user?.role === 'ADMIN' && (
          <div className="w-full md:w-64">
            <select
              value={selectedRuc}
              onChange={(e) => setSelectedRuc(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
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
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50"
            placeholder="Buscar por ciudad o fecha..."
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
          <p className="text-slate-500 mt-1">Para ver y programar horarios.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Ruta y Salida</th>
                  <th className="px-6 py-4">Unidad</th>
                  <th className="px-6 py-4">Asientos</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500">Cargando...</td>
                  </tr>
                ) : filteredHorarios.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500">No se encontraron horarios</td>
                  </tr>
                ) : (
                  filteredHorarios.map((horario) => (
                    <tr key={horario.idHorario} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 flex items-center">
                          <RouteIcon className="w-3.5 h-3.5 mr-1.5 text-brand-500" />
                          {horario.rutaFinal.rutaGeneral.origen.nombre} <span className="mx-1 text-slate-400">→</span> {horario.rutaFinal.rutaGeneral.destino.nombre}
                        </div>
                        <div className="text-sm text-slate-500 mt-1 flex items-center">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {horario.fecha} a las <span className="font-medium text-slate-700 ml-1">{horario.horaSalida}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Bus className="w-4 h-4 mr-1.5 text-slate-400" />
                          <span className="font-medium">Unidad {horario.unidad.id}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">Placa: {horario.unidad.placa}</div>
                        {horario.conductorNombre && (
                           <div className="text-xs text-brand-600 font-medium mt-1">Conductor: {horario.conductorNombre}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                            {horario.asientosDisponibles} Libres
                          </span>
                          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                            {horario.asientosReservados} Ocupados
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          horario.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${horario.activo ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                          {horario.activo ? 'Activo' : 'Cancelado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleToggleStatus(horario.idHorario)}
                            title={horario.activo ? "Cancelar salida" : "Reactivar salida"}
                            className={`p-2 rounded-lg transition-colors ${
                              horario.activo 
                                ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50' 
                                : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            <Power className="w-4 h-4" />
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
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500">Página {page + 1} de {totalPages}</span>
            <div className="flex space-x-2">
              <button 
                disabled={page === 0} 
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button 
                disabled={page >= totalPages - 1} 
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
