import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bus, ArrowRight, UserPlus, Mail, Lock, CreditCard, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cedula: '',
    nombres: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/auth/register', formData);
      
      const data = res.data;
      login(data.token, data.refresh_token || data.refreshToken, {
        id: data.user_details?.id || data.userDetails?.id,
        nombre: data.user_details?.nombre || data.userDetails?.nombre,
        role: data.role,
        userType: data.user_type || data.userType,
      });
      
      toast.success('Cuenta creada exitosamente');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden animate-fade-in">
      {/* Back to Home Button floating */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white text-surface-600 hover:text-brand-600 font-medium rounded-xl border border-surface-200 shadow-sm backdrop-blur-md transition-all duration-200 group z-20"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Regresar al Inicio
      </Link>

      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-400/20 blur-3xl" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-accent-400/20 blur-3xl" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-brand-500/30 transform -rotate-3 mb-6">
            <Bus className="w-8 h-8 text-white rotate-3" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-black text-surface-900 tracking-tight font-display">
            Crea tu cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-surface-600 font-medium">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <Card className="p-10 shadow-2xl border border-white/60 bg-white/80 backdrop-blur-xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            <div>
              <label className="block text-sm font-bold text-surface-700 mb-2">
                Cédula
              </label>
              <Input
                name="cedula"
                icon={<CreditCard className="w-5 h-5 text-surface-400" />}
                placeholder="1234567890"
                value={formData.cedula}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-surface-700 mb-2">
                Nombres Completos
              </label>
              <Input
                name="nombres"
                icon={<UserPlus className="w-5 h-5 text-surface-400" />}
                placeholder="Juan Pérez"
                value={formData.nombres}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-surface-700 mb-2">
                Correo Electrónico
              </label>
              <Input
                name="email"
                type="email"
                icon={<Mail className="w-5 h-5 text-surface-400" />}
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-surface-700 mb-2">
                Contraseña
              </label>
              <Input
                name="password"
                type="password"
                icon={<Lock className="w-5 h-5 text-surface-400" />}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                className="w-full text-base py-3.5"
                loading={loading}
              >
                Crear Cuenta <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
