import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../../components/ui/Modal';
import { User, Phone, Users, IdCard } from 'lucide-react';

const schema = z.object({
  cedula: z.string().length(10, 'La cédula debe tener 10 dígitos').regex(/^\d+$/, 'La cédula solo debe contener números'),
  nombres: z.string().min(3, 'Los nombres deben tener al menos 3 caracteres'),
  celular: z.string().min(7, 'Celular inválido').max(20, 'Celular muy largo'),
  conductorAsignadoCedula: z.string().optional().or(z.literal('')),
});

type AyudanteFormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AyudanteFormData) => Promise<void>;
  initialData?: any | null;
  loading?: boolean;
}

export const AyudanteFormModal = ({ isOpen, onClose, onSubmit, initialData, loading }: Props) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<AyudanteFormData>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (initialData && isOpen) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    } else if (isOpen) {
      reset({ cedula: '', nombres: '', celular: '', conductorAsignadoCedula: '' });
    }
  }, [initialData, isOpen, reset, setValue]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Ayudante' : 'Nuevo Ayudante'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            <IdCard className="w-4 h-4 mr-1.5 text-slate-400" />
            Cédula
          </label>
          <input
            {...register('cedula')}
            disabled={!!initialData}
            placeholder="1700000000"
            className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
              errors.cedula ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'
            } ${initialData ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
          {errors.cedula && <p className="text-red-500 text-xs mt-1">{errors.cedula.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            <User className="w-4 h-4 mr-1.5 text-slate-400" />
            Nombres Completos
          </label>
          <input
            {...register('nombres')}
            placeholder="Luis Martínez"
            className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
              errors.nombres ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'
            }`}
          />
          {errors.nombres && <p className="text-red-500 text-xs mt-1">{errors.nombres.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            <Phone className="w-4 h-4 mr-1.5 text-slate-400" />
            Celular
          </label>
          <input
            {...register('celular')}
            placeholder="0999999999"
            className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
              errors.celular ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'
            }`}
          />
          {errors.celular && <p className="text-red-500 text-xs mt-1">{errors.celular.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            <Users className="w-4 h-4 mr-1.5 text-slate-400" />
            Conductor Asignado
          </label>
          <input
            {...register('conductorAsignadoCedula')}
            placeholder="Cédula del Conductor (Opcional)"
            className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
              errors.conductorAsignadoCedula ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'
            }`}
          />
          {errors.conductorAsignadoCedula && <p className="text-red-500 text-xs mt-1">{errors.conductorAsignadoCedula.message}</p>}
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
              <Users className="w-4 h-4 mr-2" />
            )}
            {initialData ? 'Guardar Cambios' : 'Registrar Ayudante'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
