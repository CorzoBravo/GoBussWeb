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
  conductorCedula: z.string().min(1, 'Seleccione un conductor'),
  isRecurrente: z.boolean().optional(),
  diasSemana: z.array(z.number()).optional(),
  fechaFin: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.isRecurrente) {
    if (!data.fechaFin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Seleccione fecha de fin',
        path: ['fechaFin']
      });
    }
    if (!data.diasSemana || data.diasSemana.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Seleccione al menos un día',
        path: ['diasSemana']
      });
    }
  }
});

type HorarioFormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HorarioFormData) => Promise<void>;
  rutasFinales: any[];
  unidades: any[];
  conductores: any[];
  loading?: boolean;
}

export const HorarioFormModal = ({ isOpen, onClose, onSubmit, rutasFinales, unidades, conductores, loading }: Props) => {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<HorarioFormData>({
    resolver: zodResolver(schema),
    defaultValues: { diasSemana: [] }
  });

  const isRecurrenteValue = watch('isRecurrente');
  const diasSemanaValue = watch('diasSemana') || [];

  const toggleDia = (dia: number) => {
    if (diasSemanaValue.includes(dia)) {
      setValue('diasSemana', diasSemanaValue.filter(d => d !== dia));
    } else {
      setValue('diasSemana', [...diasSemanaValue, dia]);
    }
  };

  const DIAS = [
    { value: 1, label: 'L' }, { value: 2, label: 'M' }, { value: 3, label: 'X' },
    { value: 4, label: 'J' }, { value: 5, label: 'V' }, { value: 6, label: 'S' }, { value: 7, label: 'D' }
  ];

  useEffect(() => {
    if (isOpen) {
      reset({ rutaFinalId: 0, unidadId: 0, fecha: '', horaSalida: '', conductorCedula: '', isRecurrente: false, diasSemana: [], fechaFin: '' });
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
              <option key={u.idUnidad} value={u.idUnidad}>Unidad {u.numero} - Placa: {u.placa} ({u.capacidad} asientos)</option>
            ))}
          </select>
          {errors.unidadId && <p className="text-red-500 text-xs mt-1">{errors.unidadId.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            <svg className="w-4 h-4 mr-1.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Conductor
          </label>
          <select
            {...register('conductorCedula')}
            className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
              errors.conductorCedula ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'
            }`}
          >
            <option value="" disabled>Seleccione conductor...</option>
            {conductores.map(c => (
              <option key={c.cedula} value={c.cedula}>{c.nombre} {c.apellido} ({c.cedula})</option>
            ))}
          </select>
          {errors.conductorCedula && <p className="text-red-500 text-xs mt-1">{errors.conductorCedula.message}</p>}
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

        <div className="pt-4 border-t border-slate-100">
          <label className="flex items-center space-x-2 cursor-pointer mb-4">
            <input 
              type="checkbox" 
              {...register('isRecurrente')}
              className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
            />
            <span className="text-sm font-medium text-slate-700">Crear horario recurrente</span>
          </label>

          {isRecurrenteValue && (
            <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Días de la semana</label>
                <div className="flex flex-wrap gap-2">
                  {DIAS.map(dia => (
                    <button
                      key={dia.value}
                      type="button"
                      onClick={() => toggleDia(dia.value)}
                      className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-colors ${
                        diasSemanaValue.includes(dia.value)
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {dia.label}
                    </button>
                  ))}
                </div>
                {errors.diasSemana && <p className="text-red-500 text-xs mt-1">{errors.diasSemana.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
                  Repetir hasta (Fecha Fin)
                </label>
                <input
                  type="date"
                  {...register('fechaFin')}
                  className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
                    errors.fechaFin ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-white focus:bg-white'
                  }`}
                />
                {errors.fechaFin && <p className="text-red-500 text-xs mt-1">{errors.fechaFin.message}</p>}
              </div>
            </div>
          )}
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
