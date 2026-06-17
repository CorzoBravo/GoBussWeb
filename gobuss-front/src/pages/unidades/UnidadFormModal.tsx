import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface UnidadFormData {
  numero: number | '';
  placa: string;
  modelo: string;
  capacidad: number | '';
  fabricado: string;
}

interface UnidadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  loading?: boolean;
}

export const UnidadFormModal = ({ isOpen, onClose, onSubmit, initialData, loading }: UnidadFormModalProps) => {
  const [formData, setFormData] = useState<UnidadFormData>({
    numero: '',
    placa: '',
    modelo: '',
    capacidad: '',
    fabricado: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        numero: initialData.numero,
        placa: initialData.placa,
        modelo: initialData.modelo,
        capacidad: initialData.capacidad,
        fabricado: initialData.fabricado || ''
      });
    } else {
      setFormData({
        numero: '',
        placa: '',
        modelo: '',
        capacidad: '',
        fabricado: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-surface-200 flex justify-between items-center bg-surface-50/50">
          <h3 className="text-lg font-bold text-surface-800 font-display">
            {initialData ? 'Editar Unidad' : 'Registrar Nueva Unidad'}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-200/50 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="unidad-form" onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Número de Unidad"
              type="number"
              required
              value={formData.numero}
              onChange={(e) => setFormData({...formData, numero: Number(e.target.value)})}
              placeholder="Ej. 101"
            />
            
            <Input
              label="Placa"
              required
              value={formData.placa}
              onChange={(e) => setFormData({...formData, placa: e.target.value.toUpperCase()})}
              placeholder="Ej. ABC-1234"
            />

            <Input
              label="Modelo"
              required
              value={formData.modelo}
              onChange={(e) => setFormData({...formData, modelo: e.target.value})}
              placeholder="Ej. Mercedes Benz O500"
            />

            <Input
              label="Capacidad (Pasajeros)"
              type="number"
              required
              min="5"
              value={formData.capacidad}
              onChange={(e) => setFormData({...formData, capacidad: Number(e.target.value)})}
              placeholder="Ej. 42"
            />

            <Input
              label="Año de Fabricación"
              type="text"
              value={formData.fabricado}
              onChange={(e) => setFormData({...formData, fabricado: e.target.value})}
              placeholder="Ej. 2020"
            />
          </form>
        </div>

        <div className="px-6 py-4 border-t border-surface-200 bg-surface-50/50 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" form="unidad-form" disabled={loading || !formData.numero || !formData.placa || !formData.modelo || !formData.capacidad}>
            {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Registrar'}
          </Button>
        </div>
      </div>
    </div>
  );
};
