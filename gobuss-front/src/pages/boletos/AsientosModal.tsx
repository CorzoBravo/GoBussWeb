import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Modal } from '../../components/ui/Modal';
import { toast } from 'sonner';
import { ShoppingCart, CheckCircle2, CreditCard, Lock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  horarioId: number;
}

export const AsientosModal = ({ isOpen, onClose, horarioId }: Props) => {
  const [asientos, setAsientos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successBoleto, setSuccessBoleto] = useState<any>(null);
  const [step, setStep] = useState<'SELECCION' | 'PAGO'>('SELECCION');

  // Simulated Payment Form
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  useEffect(() => {
    if (isOpen && horarioId) {
      fetchAsientos();
      setSelectedIds([]);
      setSuccessBoleto(null);
      setStep('SELECCION');
    }
  }, [isOpen, horarioId]);

  const fetchAsientos = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/horarios/${horarioId}/asientos`);
      const sorted = response.data.sort((a: any, b: any) => a.numeroAsiento - b.numeroAsiento);
      setAsientos(sorted);
    } catch (error) {
      toast.error('Error al cargar asientos');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSeat = (idReserva: number, estado: string) => {
    if (estado !== 'DISPONIBLE') return;

    setSelectedIds(prev => {
      if (prev.includes(idReserva)) {
        return prev.filter(id => id !== idReserva);
      } else {
        if (prev.length >= 5) {
          toast.info('Máximo 5 asientos por compra');
          return prev;
        }
        return [...prev, idReserva];
      }
    });
  };

  const handleComprar = async () => {
    if (selectedIds.length === 0) return;
    try {
      setSubmitting(true);
      // Simulate Stripe/Bank processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const payload = {
        horarioId,
        asientos: selectedIds
      };
      const res = await api.post('/boletos', payload);
      toast.success('Pago procesado y compra realizada con éxito');
      setSuccessBoleto(res.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al procesar el pago o la compra');
    } finally {
      setSubmitting(false);
    }
  };

  if (successBoleto) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Compra Exitosa" size="md">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">¡Boleto Confirmado!</h3>
          <p className="text-slate-500 mt-2">Se ha enviado el boleto a tu correo electrónico.</p>
          
          <div className="bg-slate-50 w-full rounded-2xl p-5 mt-6 border border-slate-100 text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Boleto N°</span>
              <span className="font-semibold">{successBoleto.idBoleto}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Ruta</span>
              <span className="font-semibold">{successBoleto.rutaInfo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Fecha Viaje</span>
              <span className="font-semibold">{successBoleto.fechaViaje}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Asientos</span>
              <span className="font-semibold">{successBoleto.cantidadAsientos} asientos</span>
            </div>
            <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between">
              <span className="text-slate-500 text-sm font-medium">Total Pagado</span>
              <span className="font-bold text-emerald-600">${successBoleto.monto.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-8 w-full py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </Modal>
    );
  }

  if (step === 'PAGO') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Finalizar Pago" size="md">
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between mb-2">
              <span className="text-slate-600 font-medium">Asientos Seleccionados:</span>
              <span className="font-bold text-slate-800">{selectedIds.length}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-slate-600 font-medium">Total a pagar:</span>
              {/* Asumiremos precio dinámico devuelto o fijo para demostración. El endpoint nos devolverá el real pero en la UI asumiremos algo para que no quede feo */}
              <span className="font-bold text-brand-600">Procesando...</span>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleComprar(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre en la tarjeta</label>
              <input
                required
                type="text"
                placeholder="Juan Pérez"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                value={cardData.name}
                onChange={e => setCardData({...cardData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Número de tarjeta</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  required
                  type="text"
                  maxLength={19}
                  placeholder="0000 0000 0000 0000"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  value={cardData.number}
                  onChange={e => setCardData({...cardData, number: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vencimiento</label>
                <input
                  required
                  type="text"
                  maxLength={5}
                  placeholder="MM/YY"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  value={cardData.expiry}
                  onChange={e => setCardData({...cardData, expiry: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                <input
                  required
                  type="text"
                  maxLength={4}
                  placeholder="123"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  value={cardData.cvc}
                  onChange={e => setCardData({...cardData, cvc: e.target.value})}
                />
              </div>
            </div>

            <div className="flex items-center text-sm text-slate-500 mt-4 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
              <Lock className="w-4 h-4 mr-2 text-emerald-600" />
              Tus datos están protegidos y encriptados. (Simulación)
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep('SELECCION')}
                className="flex-1 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center"
              >
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Pagar y Comprar'
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Selección de Asientos" size="xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Mapa de asientos */}
        <div className="flex-1 bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center">
          <div className="w-full max-w-[200px] mb-8">
            <div className="bg-slate-300 w-full h-8 rounded-t-3xl rounded-b-md flex items-center justify-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Conductor</span>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-slate-400">Cargando mapa...</div>
          ) : (
            <div className="grid grid-cols-4 gap-3 w-full max-w-[240px]">
              {asientos.map((a, i) => {
                const isSelected = selectedIds.includes(a.idReserva);
                const isDisponible = a.estado === 'DISPONIBLE';
                
                // Agrupar visualmente creando un pasillo en el medio
                const isPasillo = (i + 1) % 4 === 2;

                return (
                  <div key={a.idReserva} className={`flex justify-center ${isPasillo ? 'mr-4' : ''}`}>
                    <button
                      disabled={!isDisponible}
                      onClick={() => handleToggleSeat(a.idReserva, a.estado)}
                      className={`
                        w-10 h-12 rounded-t-xl rounded-b-md flex items-center justify-center text-sm font-bold transition-all
                        ${!isDisponible ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 
                          isSelected ? 'bg-brand-500 text-white shadow-md transform -translate-y-1' : 
                          'bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:bg-brand-50 shadow-sm'}
                      `}
                    >
                      {a.numeroAsiento}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="mt-10 flex gap-4 text-xs font-medium text-slate-500">
            <div className="flex items-center"><div className="w-4 h-4 rounded bg-white border border-slate-200 mr-1.5" /> Libre</div>
            <div className="flex items-center"><div className="w-4 h-4 rounded bg-brand-500 mr-1.5" /> Seleccionado</div>
            <div className="flex items-center"><div className="w-4 h-4 rounded bg-slate-200 mr-1.5" /> Ocupado</div>
          </div>
        </div>

        {/* Resumen */}
        <div className="w-full md:w-64 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-800 mb-4">Resumen de Compra</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Asientos Seleccionados</span>
                <div className="flex flex-wrap gap-2">
                  {selectedIds.length === 0 ? (
                    <span className="text-sm text-slate-400">Ninguno</span>
                  ) : (
                    selectedIds.map(id => {
                      const seat = asientos.find(a => a.idReserva === id);
                      return (
                        <div key={id} className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                          {seat?.numeroAsiento}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {selectedIds.length > 0 && (
                <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl">
                  <span className="text-xs text-slate-600 uppercase font-semibold tracking-wider block mb-1">Cantidad</span>
                  <div className="text-2xl font-black text-slate-800">
                    {selectedIds.length} Boleto(s)
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={onClose}
              className="w-full py-2 text-slate-500 hover:text-slate-700 font-medium text-sm mb-3"
            >
              Cancelar
            </button>
            <button
              onClick={() => setStep('PAGO')}
              disabled={selectedIds.length === 0}
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all shadow-sm flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Continuar a Pago
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
