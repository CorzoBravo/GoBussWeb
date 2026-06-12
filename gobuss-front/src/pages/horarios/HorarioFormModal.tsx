import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../../components/ui/Modal';
import { Clock, Calendar, Bus, Route as RouteIcon } from 'lucide-react';

const schema = z.object({
  rutaFinalId: z.number().min(1, 'Seleccione una ruta'),
  unidadId: z.number().min(1, 'Seleccione una unidad'),
  fecha: z.string().min(1, 'Seleccione una fecha'),
  horaSalida: z.string().min(1, 'Seleccione una hora'),
});

type HorarioFormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HorarioFormData) => Promise<void>;
  rutasFinales: any[];
  unidades: any[];
  loading?: boolean;
}

export const HorarioFormModal = ({ isOpen, onClose, onSubmit, rutasFinales, unidades, loading }: Props) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<HorarioFormData>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (isOpen) {
      reset({ rutaFinalId: 0, unidadId: 0, fecha: '', horaSalida: '' });
    }
  }, [isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Horario"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            <RouteIcon className="w-4 h-4 mr-1.5 text-slate-400" />
            Ruta
          </label>
          <select
            {...register('rutaFinalId', { valueAsNumber: true })}
            className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
              errors.rutaFinalId ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'
            }`}
          >
            <option value={0} disabled>Seleccione ruta...</option>
            {rutasFinales.map(r => (
              <option key={r.id} value={r.id}>{r.rutaGeneral.origen.nombre} - {r.rutaGeneral.destino.nombre} (${r.precio})</option>
            ))}
          </select>
          {errors.rutaFinalId && <p className="text-red-500 text-xs mt-1">{errors.rutaFinalId.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            <Bus className="w-4 h-4 mr-1.5 text-slate-400" />
            Unidad
          </label>
          <select
            {...register('unidadId', { valueAsNumber: true })}
            className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
              errors.unidadId ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'
            }`}
          >
            <option value={0} disabled>Seleccione unidad...</option>
            {unidades.map(u => (
              <option key={u.id} value={u.id}>Unidad {u.id} - Placa: {u.placa} ({u.capacidad} asientos)</option>
            ))}
          </select>
          {errors.unidadId && <p className="text-red-500 text-xs mt-1">{errors.unidadId.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
              Fecha
            </label>
            <input
              type="date"
              {...register('fecha')}
              className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
                errors.fecha ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'
              }`}
            />
            {errors.fecha && <p className="text-red-500 text-xs mt-1">{errors.fecha.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
              Hora de Salida
            </label>
            <input
              type="time"
              {...register('horaSalida')}
              className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
                errors.horaSalida ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'
              }`}
            />
            {errors.horaSalida && <p className="text-red-500 text-xs mt-1">{errors.horaSalida.message}</p>}
          </div>
        </div>

        <div className="pt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : (
              <Clock className="w-4 h-4 mr-2" />
            )}
            Crear Horario
          </button>
        </div>
      </form>
    </Modal>
  );
};
