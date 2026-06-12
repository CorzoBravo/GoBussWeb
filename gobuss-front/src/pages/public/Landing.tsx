import { Link } from 'react-router-dom';
import { Bus, Map, Clock, ShieldCheck, ArrowRight, Ticket } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Navbar Public */}
      <header className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-slate-800 tracking-tight">GoBuss</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-slate-600 font-medium hover:text-brand-600 transition-colors">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="bg-brand-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-brand-700 transition-all shadow-sm flex items-center">
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-20">
        <div className="relative overflow-hidden bg-slate-900 pt-32 pb-40">
          <div className="absolute inset-0 z-0">
            {/* Dark aesthetic background with geometric shapes */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-brand-500 opacity-20 blur-[100px]"></div>
            <div className="absolute left-60 right-0 bottom-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-brand-300 text-sm font-semibold mb-8 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-brand-400 mr-2 animate-pulse"></span>
              La nueva forma de viajar
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-tight">
              Tus boletos de bus, <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-400">
                a un click de distancia.
              </span>
            </h1>
            
            <p className="mt-4 text-xl text-slate-300 max-w-2xl mx-auto mb-12 font-medium">
              GoBuss te conecta con las mejores cooperativas del país. Compra tus pasajes, elige tu asiento y viaja sin complicaciones.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/register" className="w-full sm:w-auto bg-brand-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-400 transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center">
                <Ticket className="w-5 h-5 mr-2" />
                Comprar Boletos
              </Link>
              <Link to="/login" className="w-full sm:w-auto bg-white/10 text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all backdrop-blur-md flex items-center justify-center">
                Soy Cooperativa
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">¿Por qué elegir GoBuss?</h2>
              <p className="mt-4 text-lg text-slate-500 font-medium">Diseñado para hacer tu vida más fácil.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-shadow duration-300 group">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Map className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Rutas Nacionales</h3>
                <p className="text-slate-600 leading-relaxed">Conectamos todas las provincias. Encuentra la ruta que necesitas en segundos con nuestro buscador avanzado.</p>
              </div>
              
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-shadow duration-300 group">
                <div className="w-14 h-14 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Ahorro de Tiempo</h3>
                <p className="text-slate-600 leading-relaxed">Olvídate de las filas en el terminal. Compra desde tu celular en cualquier momento y lugar.</p>
              </div>
              
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-shadow duration-300 group">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Pago Seguro</h3>
                <p className="text-slate-600 leading-relaxed">Tus transacciones están protegidas. Recibe tu boleto QR directo en tu correo electrónico al instante.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Bus className="w-6 h-6 text-brand-500" />
            <span className="text-xl font-bold text-white tracking-tight">GoBuss</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            &copy; 2026 GoBuss. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
