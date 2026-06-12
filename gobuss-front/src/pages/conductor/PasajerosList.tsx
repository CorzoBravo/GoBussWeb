import { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Users, User as UserIcon, Ticket, CheckCircle2, Hash } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'sonner';

interface Pasajero {
  cedula: string;
  nombre: string;
  numeroAsiento: number;
  numeroBoleto: string;
  estado: string;
}

interface Props {
  horarioId: number;
  onClose: () => void;
}

export const PasajerosList = ({ horarioId, onClose }: Props) => {
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPasajeros = async () => {
      try {
        const res = await api.get(`/conductores-app/horarios/${horarioId}/pasajeros`);
        setPasajeros(res.data);
      } catch (error) {
        toast.error('Error al cargar los pasajeros');
      } finally {
        setLoading(false);
      }
    };
    fetchPasajeros();
  }, [horarioId]);

  // Sort by seat number
  const sortedPasajeros = [...pasajeros].sort((a, b) => a.numeroAsiento - b.numeroAsiento);

  return (
    <Modal isOpen={true} onClose={onClose} title={`Pasajeros - Horario #${horarioId}`}>
      <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-6 h-6 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          </div>
        ) : sortedPasajeros.length === 0 ? (
          <div className="text-center py-12 bg-surface-50 rounded-xl border border-surface-100">
            <Users className="w-12 h-12 text-surface-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-surface-600">Sin pasajeros registrados</h3>
            <p className="text-xs text-surface-500 mt-1">Aún no hay reservas u ocupaciones para este viaje.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedPasajeros.map((pasajero, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white border border-surface-200 rounded-xl hover:border-brand-200 hover:shadow-sm transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center shrink-0 border border-brand-100">
                    <span className="text-brand-600 font-black text-sm">#{pasajero.numeroAsiento}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-surface-800 flex items-center">
                      <UserIcon className="w-3.5 h-3.5 mr-1.5 text-surface-400" />
                      {pasajero.nombre || 'Pasajero Anónimo'}
                    </h4>
                    <div className="flex items-center mt-1 space-x-3 text-xs text-surface-500">
                      <span className="flex items-center">
                        <Hash className="w-3 h-3 mr-1" />
                        {pasajero.cedula}
                      </span>
                      {pasajero.numeroBoleto && (
                        <span className="flex items-center">
                          <Ticket className="w-3 h-3 mr-1" />
                          Boleto: {pasajero.numeroBoleto}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    pasajero.estado === 'OCUPADO' 
                      ? 'bg-success-50 text-success-700 border border-success-200'
                      : 'bg-warning-50 text-warning-700 border border-warning-200'
                  }`}>
                    {pasajero.estado === 'OCUPADO' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {pasajero.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
