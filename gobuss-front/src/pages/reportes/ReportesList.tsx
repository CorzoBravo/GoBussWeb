import { useEffect, useState } from 'react';
import api from '../../services/api';
import { BarChart3, Download, TrendingUp, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

export const ReportesList = () => {
  const { user } = useAuth();
  
  const [cooperativas, setCooperativas] = useState<any[]>([]);
  const [selectedRuc, setSelectedRuc] = useState<string>('');
  
  const [activeTab, setActiveTab] = useState<'ventas-ruta' | 'ventas-fecha' | 'ocupacion'>('ventas-ruta');
  
  // Date filters
  const [fechaInicio, setFechaInicio] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);

  // Data
  const [ventasRuta, setVentasRuta] = useState<any[]>([]);
  const [ventasFecha, setVentasFecha] = useState<any[]>([]);
  const [ocupacion, setOcupacion] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchCooperativas();
    } else if (user?.role === 'COOPERATIVA') {
      setSelectedRuc(user.ruc || user.id);
    }
  }, [user]);

  useEffect(() => {
    if (selectedRuc) {
      loadData();
    }
  }, [selectedRuc, activeTab]);

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

  const loadData = async () => {
    if (!selectedRuc) return;
    try {
      setLoading(true);
      if (activeTab === 'ventas-ruta') {
        const res = await api.get(`/cooperativas/${selectedRuc}/reportes/ventas-ruta`);
        setVentasRuta(res.data);
      } else if (activeTab === 'ventas-fecha') {
        const res = await api.get(`/cooperativas/${selectedRuc}/reportes/ventas-fecha?inicio=${fechaInicio}&fin=${fechaFin}`);
        setVentasFecha(res.data);
      } else if (activeTab === 'ocupacion') {
        const res = await api.get(`/cooperativas/${selectedRuc}/reportes/ocupacion-horario?inicio=${fechaInicio}&fin=${fechaFin}`);
        setOcupacion(res.data);
      }
    } catch (error) {
      toast.error('Error al cargar reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (activeTab !== 'ventas-ruta') {
      toast.info('La descarga PDF solo está disponible para Ventas por Ruta por ahora.');
      return;
    }
    try {
      toast.info('Generando PDF...');
      const response = await api.get(`/cooperativas/${selectedRuc}/reportes/ventas-ruta/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte_ventas_ruta.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      toast.error('Error al descargar PDF');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-brand-600" />
            Reportes y Estadísticas
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Analiza el rendimiento de rutas y horarios.</p>
        </div>
        <button 
          onClick={handleDownloadPdf}
          disabled={!selectedRuc || activeTab !== 'ventas-ruta'}
          className="flex items-center px-4 py-2.5 bg-brand-50 text-brand-700 font-medium rounded-xl hover:bg-brand-100 transition-colors shadow-sm active:scale-95 disabled:opacity-50"
        >
          <Download className="w-5 h-5 mr-1.5" />
          Descargar PDF
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar / Filters */}
        <div className="w-full md:w-64 flex flex-col gap-4">
          {user?.role === 'ADMIN' && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Cooperativa</label>
              <select
                value={selectedRuc}
                onChange={(e) => setSelectedRuc(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
              >
                <option value="" disabled>Seleccione...</option>
                {cooperativas.map(c => (
                  <option key={c.ruc} value={c.ruc}>{c.nombre}</option>
                ))}
              </select>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-3 border-b border-slate-100 bg-slate-50/50">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tipo de Reporte</span>
            </div>
            <div className="flex flex-col p-2 space-y-1">
              <button
                onClick={() => setActiveTab('ventas-ruta')}
                className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  activeTab === 'ventas-ruta' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Ventas por Ruta
              </button>
              <button
                onClick={() => setActiveTab('ventas-fecha')}
                className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  activeTab === 'ventas-fecha' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Ventas por Fecha
              </button>
              <button
                onClick={() => setActiveTab('ocupacion')}
                className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  activeTab === 'ocupacion' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-4 h-4 mr-2" />
                Ocupación
              </button>
            </div>
          </div>

          {(activeTab === 'ventas-fecha' || activeTab === 'ocupacion') && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <span className="block text-xs font-medium text-slate-500 mb-3 uppercase tracking-wider">Rango de Fechas</span>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Desde</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Hasta</label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand-500"
                  />
                </div>
                <button
                  onClick={loadData}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                >
                  Aplicar Filtro
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          {!selectedRuc ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-lg font-medium text-slate-700">Seleccione una cooperativa</h3>
              <p className="text-slate-500 mt-1 text-sm">Para generar los reportes correspondientes.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-medium text-slate-800">
                  {activeTab === 'ventas-ruta' && 'Total de Ventas por Ruta'}
                  {activeTab === 'ventas-fecha' && 'Evolución de Ventas por Fecha'}
                  {activeTab === 'ocupacion' && 'Ocupación de Horarios'}
                </h3>
                {loading && <span className="text-sm text-slate-400">Actualizando...</span>}
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                    {activeTab === 'ventas-ruta' && (
                      <tr>
                        <th className="px-6 py-3">Ruta</th>
                        <th className="px-6 py-3 text-right">Boletos Vendidos</th>
                        <th className="px-6 py-3 text-right">Ingresos</th>
                      </tr>
                    )}
                    {activeTab === 'ventas-fecha' && (
                      <tr>
                        <th className="px-6 py-3">Fecha</th>
                        <th className="px-6 py-3 text-right">Boletos Vendidos</th>
                        <th className="px-6 py-3 text-right">Ingresos</th>
                      </tr>
                    )}
                    {activeTab === 'ocupacion' && (
                      <tr>
                        <th className="px-6 py-3">Horario</th>
                        <th className="px-6 py-3">Ruta</th>
                        <th className="px-6 py-3 text-right">Capacidad</th>
                        <th className="px-6 py-3 text-right">Ocupados</th>
                        <th className="px-6 py-3 text-right">% Ocupación</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading && (ventasRuta.length === 0 && ventasFecha.length === 0 && ocupacion.length === 0) ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Cargando datos del reporte...</td>
                      </tr>
                    ) : activeTab === 'ventas-ruta' && ventasRuta.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">Sin datos para esta cooperativa</td></tr>
                    ) : activeTab === 'ventas-fecha' && ventasFecha.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">Sin datos para el rango seleccionado</td></tr>
                    ) : activeTab === 'ocupacion' && ocupacion.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Sin datos para el rango seleccionado</td></tr>
                    ) : (
                      <>
                        {activeTab === 'ventas-ruta' && ventasRuta.map((item, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-700">{item.origen} - {item.destino}</td>
                            <td className="px-6 py-4 text-right text-slate-600">{item.cantidadBoletos}</td>
                            <td className="px-6 py-4 text-right font-medium text-emerald-600">${item.totalVentas.toFixed(2)}</td>
                          </tr>
                        ))}

                        {activeTab === 'ventas-fecha' && ventasFecha.map((item, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-700">{item.fecha}</td>
                            <td className="px-6 py-4 text-right text-slate-600">{item.cantidadBoletos}</td>
                            <td className="px-6 py-4 text-right font-medium text-emerald-600">${item.totalVentas.toFixed(2)}</td>
                          </tr>
                        ))}

                        {activeTab === 'ocupacion' && ocupacion.map((item, i) => {
                          const porcentaje = item.capacidadTotal > 0 ? ((item.asientosOcupados / item.capacidadTotal) * 100).toFixed(1) : "0.0";
                          return (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 text-slate-700">{item.fecha} {item.horaSalida}</td>
                              <td className="px-6 py-4 font-medium text-slate-700">{item.origen} - {item.destino}</td>
                              <td className="px-6 py-4 text-right text-slate-500">{item.capacidadTotal}</td>
                              <td className="px-6 py-4 text-right text-slate-600 font-medium">{item.asientosOcupados}</td>
                              <td className="px-6 py-4 text-right">
                                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                  Number(porcentaje) >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                  Number(porcentaje) >= 50 ? 'bg-amber-100 text-amber-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {porcentaje}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
