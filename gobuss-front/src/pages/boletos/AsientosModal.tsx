import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Modal } from '../../components/ui/Modal';
import { toast } from 'sonner';
import { ShoppingCart, CheckCircle2, CreditCard, Lock, Ticket } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

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

  const triggerConfetti = () => {
    const end = Date.now() + 2 * 1000;
    const colors = ['#0ea5e9', '#f59e0b', '#10b981'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
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
      triggerConfetti();
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
        <div className="flex flex-col items-center justify-center py-6 text-center animate-slide-up">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mb-6 shadow-inner shadow-success-200">
            <CheckCircle2 className="w-10 h-10 text-success-600" />
          </div>
          <h3 className="text-2xl font-bold text-surface-800 font-display">¡Boleto Confirmado!</h3>
          <p className="text-surface-500 mt-2 font-medium">Se ha enviado el boleto a tu correo electrónico.</p>
          
          <div className="bg-surface-50 w-full rounded-2xl p-6 mt-8 border border-surface-200 text-left space-y-3 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
               <Ticket className="w-24 h-24" />
            </div>
            <div className="flex justify-between items-center relative z-10">
              <span className="text-surface-500 text-sm font-medium">Boleto N°</span>
              <span className="font-bold text-surface-800">{successBoleto.idBoleto}</span>
            </div>
            <div className="flex justify-between items-center relative z-10">
              <span className="text-surface-500 text-sm font-medium">Ruta</span>
              <span className="font-bold text-surface-800">{successBoleto.rutaInfo}</span>
            </div>
            <div className="flex justify-between items-center relative z-10">
              <span className="text-surface-500 text-sm font-medium">Fecha Viaje</span>
              <span className="font-bold text-surface-800">{successBoleto.fechaViaje}</span>
            </div>
            <div className="flex justify-between items-center relative z-10">
              <span className="text-surface-500 text-sm font-medium">Asientos</span>
              <span className="font-bold text-surface-800">{successBoleto.cantidadAsientos} asientos</span>
            </div>
            <div className="pt-3 mt-3 border-t border-surface-200 flex justify-between items-center relative z-10">
              <span className="text-surface-600 text-sm font-bold">Total Pagado</span>
              <span className="font-black text-xl text-success-600">${successBoleto.monto.toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={onClose}
            variant="primary"
            size="lg"
            className="w-full mt-8"
          >
            Cerrar y Volver
          </Button>
        </div>
      </Modal>
    );
  }

  if (step === 'PAGO') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Finalizar Pago" size="md">
        <div className="space-y-6 animate-fade-in">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between px-8 relative">
             <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-surface-200 -z-10"></div>
             <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-brand-500 -z-10 w-1/2"></div>
             
             <div className="flex flex-col items-center bg-white px-2 cursor-pointer" onClick={() => setStep('SELECCION')}>
               <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold shadow-sm">1</div>
               <span className="text-xs font-semibold text-brand-600 mt-2">Asientos</span>
             </div>
             
             <div className="flex flex-col items-center bg-white px-2">
               <div className="w-8 h-8 rounded-full bg-brand-100 border-2 border-brand-500 text-brand-700 flex items-center justify-center font-bold shadow-sm">2</div>
               <span className="text-xs font-semibold text-brand-600 mt-2">Pago</span>
             </div>
          </div>

          <div className="bg-surface-50 p-5 rounded-2xl border border-surface-200 shadow-inner">
            <div className="flex justify-between mb-3">
              <span className="text-surface-600 font-medium text-sm">Asientos Seleccionados:</span>
              <span className="font-bold text-surface-800">{selectedIds.length}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-surface-200 border-dashed">
              <span className="text-surface-600 font-medium">Total a pagar:</span>
              <span className="text-xl font-black text-brand-600">Calculando...</span>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleComprar(); }} className="space-y-5">
            <Input
              required
              label="Nombre en la tarjeta"
              placeholder="Juan Pérez"
              value={cardData.name}
              onChange={e => setCardData({...cardData, name: e.target.value})}
            />
            
            <Input
              required
              label="Número de tarjeta"
              icon={<CreditCard className="w-5 h-5" />}
              maxLength={19}
              placeholder="0000 0000 0000 0000"
              value={cardData.number}
              onChange={e => {
                 // Auto-format simplistic
                 const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                 setCardData({...cardData, number: val});
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                required
                label="Vencimiento"
                maxLength={5}
                placeholder="MM/YY"
                value={cardData.expiry}
                onChange={e => {
                  let val = e.target.value.replace(/\D/g, '');
                  if (val.length > 2) val = `${val.slice(0,2)}/${val.slice(2,4)}`;
                  setCardData({...cardData, expiry: val})
                }}
              />
              <Input
                required
                label="CVC"
                maxLength={4}
                placeholder="123"
                value={cardData.cvc}
                onChange={e => setCardData({...cardData, cvc: e.target.value.replace(/\D/g, '')})}
              />
            </div>

            <div className="flex items-center text-sm text-surface-600 mt-4 bg-success-50 p-3 rounded-xl border border-success-100">
              <Lock className="w-4 h-4 mr-2 text-success-600" />
              Tus datos están protegidos y encriptados. (Simulación)
            </div>

            <div className="flex gap-3 pt-4 border-t border-surface-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep('SELECCION')}
                className="flex-1"
              >
                Volver
              </Button>
              <Button
                type="submit"
                loading={submitting}
                className="flex-1"
              >
                Pagar y Comprar
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Selección de Asientos" size="xl">
      <div className="flex flex-col md:flex-row gap-8 animate-fade-in">
        
        {/* Mapa de asientos */}
        <div className="flex-1 bg-surface-50 p-8 rounded-3xl border border-surface-200 flex flex-col items-center relative overflow-hidden">
          {/* Subtle road lines background */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l-2 border-r-2 border-dashed border-surface-300 w-12 opacity-20 pointer-events-none"></div>

          <div className="w-full max-w-[200px] mb-10 relative z-10">
            <div className="bg-surface-800 w-full h-10 rounded-t-3xl rounded-b-xl flex items-center justify-center shadow-md">
              <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Conductor</span>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-surface-400 font-medium animate-pulse">Cargando asientos...</div>
          ) : (
            <div className="grid grid-cols-4 gap-4 w-full max-w-[280px] relative z-10">
              {asientos.map((a, i) => {
                const isSelected = selectedIds.includes(a.idReserva);
                const isDisponible = a.estado === 'DISPONIBLE';
                
                // Agrupar visualmente creando un pasillo en el medio
                const isPasillo = (i + 1) % 4 === 2;

                return (
                  <div key={a.idReserva} className={`flex justify-center ${isPasillo ? 'mr-6' : ''}`}>
                    <button
                      disabled={!isDisponible}
                      onClick={() => handleToggleSeat(a.idReserva, a.estado)}
                      className={`
                        w-12 h-14 rounded-t-2xl rounded-b-lg flex items-center justify-center text-sm font-bold transition-all duration-300
                        ${!isDisponible 
                          ? 'bg-surface-200 text-surface-400 cursor-not-allowed opacity-70' 
                          : isSelected 
                            ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/40 transform -translate-y-1 scale-105 border border-brand-400' 
                            : 'bg-white text-surface-600 border-2 border-surface-200 hover:border-brand-400 hover:text-brand-600 shadow-sm hover:shadow-md hover:-translate-y-0.5'}
                      `}
                    >
                      {a.numeroAsiento}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="mt-12 flex gap-6 text-xs font-bold text-surface-500 uppercase tracking-wider relative z-10 bg-white px-6 py-3 rounded-full shadow-sm border border-surface-100">
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-white border-2 border-surface-200 mr-2" /> Libre</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-brand-500 mr-2 shadow-sm shadow-brand-500/50" /> Seleccionado</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-surface-200 mr-2" /> Ocupado</div>
          </div>
        </div>

        {/* Resumen */}
        <div className="w-full md:w-72 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xl text-surface-800 mb-6 font-display">Resumen de Compra</h3>
            
            <div className="space-y-6">
              <div>
                <span className="text-xs text-surface-500 uppercase font-bold tracking-wider block mb-3">Asientos Seleccionados</span>
                <div className="flex flex-wrap gap-2">
                  {selectedIds.length === 0 ? (
                    <div className="text-sm text-surface-400 italic bg-surface-50 w-full p-4 rounded-xl text-center border border-surface-100 border-dashed">
                      No has seleccionado ningún asiento aún.
                    </div>
                  ) : (
                    selectedIds.map(id => {
                      const seat = asientos.find(a => a.idReserva === id);
                      return (
                        <div key={id} className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-sm border border-brand-100 shadow-sm animate-fade-in">
                          {seat?.numeroAsiento}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {selectedIds.length > 0 && (
                <div className="p-5 bg-surface-50 border border-surface-200 rounded-2xl shadow-inner animate-fade-in">
                  <span className="text-xs text-surface-500 uppercase font-bold tracking-wider block mb-1">Cantidad</span>
                  <div className="text-3xl font-black text-surface-800 font-display">
                    {selectedIds.length} <span className="text-lg text-surface-500 font-medium">Boleto(s)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-surface-100 space-y-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setStep('PAGO')}
              disabled={selectedIds.length === 0}
              className="w-full"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Continuar a Pago
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full"
            >
              Cancelar
            </Button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
