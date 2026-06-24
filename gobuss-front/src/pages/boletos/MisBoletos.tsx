import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Ticket, Calendar, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface Boleto {
  idBoleto: number;
  usuarioCedula: string;
  usuarioNombre: string;
  horarioId: number;
  rutaInfo: string;
  fechaViaje: string;
  monto: number;
  cantidadAsientos: number;
  asientos: number[];
  activo: boolean;
  montoReembolso?: number;
}

export const MisBoletos = () => {
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoletos();
  }, []);

  const fetchBoletos = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/boletos/mis');
      setBoletos(data);
    } catch (error) {
      toast.error('Error al cargar historial de boletos');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (idBoleto: number) => {
    try {
      const response = await api.get(`/boletos/${idBoleto}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `boleto_${idBoleto}.pdf`);
      document.body.appendChild(link);
      link.click();
      if (link.parentNode) link.parentNode.removeChild(link);
      toast.success('Boleto descargado exitosamente');
    } catch (error) {
      toast.error('Error al descargar el PDF');
    }
  };

  const handleCancelarBoleto = async (idBoleto: number) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar este boleto? Esta acción no se puede deshacer.')) return;
    try {
      await api.patch(`/boletos/${idBoleto}/cancelar`);
      toast.success('Boleto cancelado exitosamente');
      fetchBoletos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cancelar el boleto');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 font-display flex items-center">
            <Ticket className="w-8 h-8 text-brand-600 mr-3 p-1.5 bg-brand-50 rounded-xl" />
            Mis Boletos
          </h1>
          <p className="text-surface-500 mt-1">Historial de todas tus compras y viajes</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-6 h-48 border border-surface-200 shadow-sm animate-pulse flex flex-col justify-between">
               <div className="h-4 bg-surface-200 rounded w-1/2"></div>
               <div className="h-10 bg-surface-100 rounded w-full"></div>
               <div className="h-8 bg-brand-50 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : boletos.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-surface-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mb-6">
            <Ticket className="w-12 h-12 text-brand-400" />
          </div>
          <h3 className="text-xl font-bold text-surface-800 mb-2 font-display">No tienes boletos aún</h3>
          <p className="text-surface-500 max-w-sm mb-8">Empieza a explorar rutas y reserva tu próximo viaje con nosotros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boletos.map((boleto) => (
            <div key={boleto.idBoleto} className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group flex flex-col">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-500"></div>
              
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center text-surface-500 text-xs font-semibold bg-surface-100 px-2 py-1 rounded-md">
                    <span className="text-brand-600 mr-1">Boleto N°</span> {boleto.idBoleto}
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="font-bold text-brand-600 text-lg">
                      ${boleto.monto.toFixed(2)}
                    </div>
                    {!boleto.activo && (
                      <div className="flex flex-col items-end mt-1">
                        <span className="text-[10px] font-bold text-danger-600 uppercase bg-danger-50 px-2 py-0.5 rounded-full">Cancelado</span>
                        {boleto.montoReembolso !== undefined && (
                          <span className="text-[10px] text-surface-500 font-medium mt-1">Reembolsado: ${boleto.montoReembolso.toFixed(2)}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-surface-800 text-lg mb-4 flex items-start">
                  <MapPin className="w-5 h-5 text-brand-500 mr-2 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{boleto.rutaInfo}</span>
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-surface-600">
                    <Calendar className="w-4 h-4 mr-2 text-surface-400" />
                    <span className="font-medium text-surface-800">{boleto.fechaViaje}</span>
                  </div>
                  <div className="flex items-center text-sm text-surface-600">
                    <Ticket className="w-4 h-4 mr-2 text-surface-400" />
                    <span><span className="font-medium text-surface-800">{boleto.cantidadAsientos}</span> Asiento(s): {boleto.asientos.join(', ')}</span>
                  </div>
                </div>
              </div>
              
              {/* Zig-zag divider */}
              <div className="w-full overflow-hidden leading-none h-3 bg-surface-50 border-t border-b border-surface-100 border-dashed relative">
                <div className="absolute -left-3 -top-1 w-4 h-4 rounded-full bg-surface-50 border-r border-surface-200"></div>
                <div className="absolute -right-3 -top-1 w-4 h-4 rounded-full bg-surface-50 border-l border-surface-200"></div>
              </div>
              
              <div className="bg-surface-50 p-4 flex gap-2">
                <button 
                  onClick={() => handleDownloadPDF(boleto.idBoleto)}
                  className="flex-1 py-2 bg-white border border-surface-200 text-surface-700 text-sm font-semibold rounded-xl hover:border-brand-300 hover:text-brand-600 transition-colors shadow-sm"
                >
                  Descargar PDF
                </button>
                {boleto.activo && new Date(boleto.fechaViaje) >= new Date() && (
                  <button 
                    onClick={() => handleCancelarBoleto(boleto.idBoleto)}
                    className="flex-1 py-2 bg-white border border-danger-200 text-danger-600 text-sm font-semibold rounded-xl hover:bg-danger-50 hover:border-danger-300 transition-colors shadow-sm"
                    title="Se reembolsa 100% si cancelas con 24h de anticipación"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
