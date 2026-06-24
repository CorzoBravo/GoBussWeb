import { Link } from 'react-router-dom';
import { Bus, Map, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col font-sans">
      
      {/* Navbar Public */}
      <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-surface-200/50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-surface-800 tracking-tight font-display">GoBuss</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-surface-600 font-medium hover:text-brand-600 transition-colors">
                Iniciar Sesión
              </Link>
              <Link to="/register">
                <Button variant="primary">
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="relative pt-32 pb-40 lg:pt-48 lg:pb-56 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2000" 
              alt="Viaje en bus" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-900/90 via-surface-900/70 to-surface-900/40"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl animate-slide-up">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-6 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-accent-400 mr-2 animate-pulse"></span>
                Descubre nuevos destinos
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight font-display">
                Tu próximo viaje <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-100">
                  empieza aquí.
                </span>
              </h1>
              
              <p className="mt-4 text-xl text-surface-200 max-w-2xl mb-12 font-medium leading-relaxed">
                Conectamos todas las provincias del país. Compra tus boletos, elige tu asiento favorito y viaja con total comodidad y seguridad.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 mt-12 animate-fade-in mx-auto w-full max-w-md text-center">
            <h3 className="text-xl font-bold text-white mb-4">¿Listo para viajar?</h3>
            <Button variant="primary" size="lg" className="w-full px-8 py-3.5 h-[50px]" onClick={() => window.location.href = '/login'}>
              Ingresa a tu cuenta para buscar boletos
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-32 bg-surface-50 pt-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-800 tracking-tight font-display">¿Por qué viajar con GoBuss?</h2>
              <p className="mt-4 text-lg text-surface-500 font-medium">Diseñado para hacer tu vida más fácil y tu viaje más placentero.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl p-8 border border-surface-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Map className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-surface-800 mb-3 font-display">Rutas Nacionales</h3>
                <p className="text-surface-600 leading-relaxed">Conectamos todas las provincias. Encuentra la ruta que necesitas en segundos con nuestro buscador avanzado.</p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 border border-surface-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent-50 text-accent-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-surface-800 mb-3 font-display">Ahorro de Tiempo</h3>
                <p className="text-surface-600 leading-relaxed">Olvídate de las filas en el terminal. Compra desde tu celular en cualquier momento y lugar.</p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 border border-surface-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-success-50 text-success-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-surface-800 mb-3 font-display">Pago Seguro</h3>
                <p className="text-surface-600 leading-relaxed">Tus transacciones están protegidas. Recibe tu boleto QR directo en tu correo electrónico al instante.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-surface-900 border-t border-surface-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Bus className="w-6 h-6 text-brand-500" />
            <span className="text-xl font-bold text-white tracking-tight font-display">GoBuss</span>
          </div>
          <p className="text-surface-500 text-sm font-medium">
            &copy; 2026 GoBuss. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
