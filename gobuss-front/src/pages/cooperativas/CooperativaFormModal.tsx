import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../../components/ui/Modal';
import { Bus, Phone, Mail, Building, FileText, Lock, MapPin } from 'lucide-react';

const schema = z.object({
  ruc: z.string().length(13, 'El RUC debe tener 13 dígitos').regex(/^\d+$/, 'El RUC solo debe contener números'),
  nombre: z.string().min(3, 'La razón social debe tener al menos 3 caracteres'),
  direccion: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  correo: z.string().email('Email inválido'),
  telefono: z.string().min(7, 'Teléfono inválido').max(20, 'Teléfono muy largo'),
  clave: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional().or(z.literal('')),
});

type CooperativaFormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CooperativaFormData) => Promise<void>;
  initialData?: any | null;
  loading?: boolean;
}

export const CooperativaFormModal = ({ isOpen, onClose, onSubmit, initialData, loading }: Props) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<CooperativaFormData>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (initialData && isOpen) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (key !== 'clave') {
          setValue(key as any, value);
        }
      });
      setValue('clave', ''); // Reset clave para no mostrar la encriptada o null
    } else if (isOpen) {
      reset({ ruc: '', nombre: '', direccion: '', correo: '', telefono: '', clave: '' });
    }
  }, [initialData, isOpen, reset, setValue]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Cooperativa' : 'Nueva Cooperativa'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            <FileText className="w-4 h-4 mr-1.5 text-slate-400" />
            RUC
          </label>
          <input
            {...register('ruc')}
            disabled={!!initialData}
            placeholder="1700000000001"
            className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
              errors.ruc ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'
            } ${initialData ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
          {errors.ruc && <p className="text-red-500 text-xs mt-1">{errors.ruc.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            <Building className="w-4 h-4 mr-1.5 text-slate-400" />
            Razón Social
          </label>
          <input
            {...register('nombre')}
            placeholder="Cooperativa Express S.A."
            className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
              errors.nombre ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'
            }`}
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
            Dirección
          </label>
          <input
            {...register('direccion')}
            placeholder="Av. Principal y Calle Secundaria"
            className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
              errors.direccion ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'
            }`}
          />
          {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 flex items-center">
              <Mail className="w-4 h-4 mr-1.5 text-slate-400" />
              Email
            </label>
            <input
              {...register('correo')}
              placeholder="contacto@empresa.com"
              className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
                errors.correo ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'
              }`}
            />
            {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 flex items-center">
              <Phone className="w-4 h-4 mr-1.5 text-slate-400" />
              Teléfono
            </label>
            <input
              {...register('telefono')}
              placeholder="0999999999"
              className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
                errors.telefono ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'
              }`}
            />
            {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            <Lock className="w-4 h-4 mr-1.5 text-slate-400" />
            Contraseña
          </label>
          <input
            type="password"
            {...register('clave')}
            placeholder={initialData ? "Dejar en blanco para mantener actual" : "********"}
            className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
              errors.clave ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'
            }`}
          />
          {errors.clave && <p className="text-red-500 text-xs mt-1">{errors.clave.message}</p>}
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
              <Bus className="w-4 h-4 mr-2" />
            )}
            {initialData ? 'Guardar Cambios' : 'Crear Cooperativa'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
