import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Bus, KeyRound, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { id: username, password });
      const data = response.data;
      
      login(data.token, data.refresh_token || data.refreshToken, {
        id: data.user_details.id,
        nombre: data.user_details.nombre,
        role: data.role,
        userType: data.user_type || data.userType,
      });
      
      toast.success('Sesión iniciada correctamente');
      navigate('/dashboard');
    } catch (err: any) {
      setError('Credenciales inválidas o cuenta inactiva');
      toast.error('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden animate-fade-in">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-200/40 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-accent-200/40 blur-[100px]" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <Card className="p-10 shadow-2xl border border-white/60 bg-white/80 backdrop-blur-xl">
          <div className="text-center">
            <div className="bg-brand-50 w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-sm border border-brand-100">
              <Bus className="h-10 w-10 text-brand-600" />
            </div>
            <h2 className="mt-2 text-3xl font-black text-surface-900 tracking-tight font-display">
              Ingreso al Sistema
            </h2>
            <p className="mt-2 text-sm text-surface-500 font-medium">
              Plataforma Administrativa <span className="font-bold text-brand-600">GoBuss</span>
            </p>
          </div>
          <form className="mt-10 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-surface-700 mb-2">Usuario / RUC / Cédula</label>
                <Input
                  icon={<UserIcon className="w-5 h-5 text-surface-400" />}
                  placeholder="Tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-surface-700 mb-2">Contraseña</label>
                <Input
                  type="password"
                  icon={<KeyRound className="w-5 h-5 text-surface-400" />}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-danger-600 text-sm text-center font-bold bg-danger-50 py-3 rounded-xl border border-danger-100 animate-slide-up">
                {error}
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                className="w-full text-base py-3.5"
                loading={loading}
              >
                Iniciar Sesión
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
