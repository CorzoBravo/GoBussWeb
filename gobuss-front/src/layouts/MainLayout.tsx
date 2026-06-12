
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, LogOut, Map, LayoutDashboard, Calendar, ClipboardList, Users } from 'lucide-react';
import { toast } from 'sonner';

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['ADMIN', 'COOPERATIVA', 'USUARIO'] },
    { name: 'Cooperativas', path: '/cooperativas', icon: Bus, roles: ['ADMIN'] },
    { name: 'Rutas', path: '/rutas', icon: Map, roles: ['ADMIN', 'COOPERATIVA'] },
    { name: 'Horarios', path: '/horarios', icon: Calendar, roles: ['ADMIN', 'COOPERATIVA'] },
    { name: 'Conductores', path: '/conductores', icon: Users, roles: ['ADMIN', 'COOPERATIVA'] },
    { name: 'Ayudantes', path: '/ayudantes', icon: Users, roles: ['ADMIN', 'COOPERATIVA'] },
    { name: 'Reportes', path: '/reportes', icon: ClipboardList, roles: ['ADMIN', 'COOPERATIVA'] },
  ];

  const filteredNav = navItems.filter(item => user?.role && item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-50 font-sans selection:bg-brand-500 selection:text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
        <div className="h-20 flex items-center px-8 border-b border-slate-100 bg-white/50 backdrop-blur-xl sticky top-0">
          <div className="bg-brand-600/10 w-10 h-10 rounded-xl flex items-center justify-center mr-3">
            <Bus className="w-5 h-5 text-brand-600" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">GoBuss Web</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200">
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-100/50' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 transition-colors duration-200 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} /> 
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center mb-5 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-inner mr-3 shrink-0">
              {user?.nombre?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.nombre}
              </p>
              <p className="text-xs font-medium text-slate-500 truncate flex items-center mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors duration-200 border border-red-100 hover:border-red-200"
          >
            <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-50/50 to-transparent -z-10" />
        
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-8 z-10 sticky top-0">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Panel de Control</h1>
          <div className="flex items-center space-x-4">
             {/* Future topbar items can go here */}
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8 relative z-0">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
