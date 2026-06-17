
import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, LogOut, Map, LayoutDashboard, Calendar, ClipboardList, Users, ChevronLeft, ChevronRight, Ticket } from 'lucide-react';
import { toast } from 'sonner';

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'COOPERATIVA'] },
    { name: 'Cooperativas', path: '/dashboard/cooperativas', icon: Bus, roles: ['ADMIN'] },
    { name: 'Rutas', path: '/dashboard/rutas', icon: Map, roles: ['ADMIN', 'COOPERATIVA'] },
    { name: 'Horarios', path: '/dashboard/horarios', icon: Calendar, roles: ['ADMIN', 'COOPERATIVA'] },
    { name: 'Comprar Boletos', path: '/dashboard/boletos', icon: Ticket, roles: ['USUARIO'] },
    { name: 'Mis Boletos', path: '/dashboard/mis-boletos', icon: Ticket, roles: ['USUARIO'] },
    { name: 'Mi Viaje', path: '/dashboard/conductor-dashboard', icon: Bus, roles: ['CONDUCTOR'] },
    { name: 'Conductores', path: '/dashboard/conductores', icon: Users, roles: ['ADMIN', 'COOPERATIVA'] },
    { name: 'Ayudantes', path: '/dashboard/ayudantes', icon: Users, roles: ['ADMIN', 'COOPERATIVA'] },
    { name: 'Unidades', path: '/dashboard/unidades', icon: Bus, roles: ['ADMIN', 'COOPERATIVA'] },
    { name: 'Reportes', path: '/dashboard/reportes', icon: ClipboardList, roles: ['ADMIN', 'COOPERATIVA'] },
  ];

  const filteredNav = navItems.filter(item => user?.role && item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-surface-50 font-sans selection:bg-brand-500 selection:text-white overflow-hidden relative">
      
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 bg-white border-r border-surface-200 flex flex-col shadow-xl lg:shadow-sm z-40 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className={`h-20 flex items-center border-b border-surface-100 bg-white/50 backdrop-blur-xl sticky top-0 transition-all ${isCollapsed ? 'justify-center px-0' : 'px-8 justify-between'}`}>
          <div className="flex items-center">
            <div className="bg-brand-50 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
              <Bus className="w-5 h-5 text-brand-600" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold text-surface-800 tracking-tight ml-3 font-display whitespace-nowrap overflow-hidden animate-fade-in">
                GoBuss
              </span>
            )}
          </div>
          
          {/* Close button for mobile */}
          {!isCollapsed && (
            <button 
              className="lg:hidden text-surface-400 hover:text-surface-700"
              onClick={() => setIsMobileOpen(false)}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
        </div>
        
        {/* Toggle Button for Desktop */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3.5 top-24 bg-white border border-surface-200 rounded-full p-1.5 shadow-sm text-surface-400 hover:text-brand-600 hover:border-brand-200 transition-colors z-50 items-center justify-center"
          aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-thin scrollbar-thumb-surface-200">
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path}
                to={item.path} 
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center py-3 font-medium rounded-xl transition-all duration-200 group relative ${
                  isCollapsed ? 'justify-center px-0' : 'px-4 text-sm'
                } ${
                  isActive 
                  ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-100/50' 
                  : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900 border border-transparent'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className={`w-5 h-5 transition-colors duration-200 shrink-0 ${isActive ? 'text-brand-600' : 'text-surface-400 group-hover:text-brand-500'}`} /> 
                
                {!isCollapsed && (
                  <span className="ml-3 whitespace-nowrap overflow-hidden">{item.name}</span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="hidden lg:block absolute left-full ml-4 px-3 py-1.5 bg-surface-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        <div className={`p-4 border-t border-surface-100 bg-surface-50/50 transition-all ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          {!isCollapsed ? (
            <div className="flex items-center mb-5 bg-white p-3 rounded-xl border border-surface-200 shadow-sm transition-all hover:border-brand-200 hover:shadow-md cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-inner mr-3 shrink-0 group-hover:scale-105 transition-transform">
                {user?.nombre?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-surface-900 truncate">
                  {user?.nombre}
                </p>
                <p className="text-xs font-medium text-surface-500 truncate flex items-center mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success-500 mr-1.5"></span>
                  {user?.role}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-inner mb-4 cursor-pointer hover:scale-105 transition-transform" title={user?.nombre}>
              {user?.nombre?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}

          <button
            onClick={handleLogout}
            title={isCollapsed ? "Cerrar Sesión" : undefined}
            className={`flex items-center justify-center py-2.5 font-medium text-danger-600 bg-danger-50 hover:bg-danger-100 rounded-xl transition-colors duration-200 border border-danger-100 hover:border-danger-200 ${
              isCollapsed ? 'w-10 h-10 px-0' : 'w-full px-4 text-sm'
            }`}
          >
            <LogOut className={`w-4 h-4 ${!isCollapsed && 'mr-2'}`} /> 
            {!isCollapsed && 'Cerrar Sesión'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-surface-50">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-50/50 to-transparent pointer-events-none" />
        
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-surface-200/60 flex items-center px-4 sm:px-8 z-10 sticky top-0 shadow-sm">
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden mr-4 p-2 text-surface-500 hover:text-surface-800 bg-surface-100 rounded-lg"
          >
            <LayoutDashboard className="w-6 h-6" />
          </button>
          
          <h1 className="text-2xl font-bold text-surface-800 tracking-tight font-display flex-1">Panel de Control</h1>
          
          <div className="flex items-center space-x-4">
             {/* Topbar actions */}
             <div className="hidden sm:flex items-center text-sm font-medium text-surface-500 bg-surface-100/50 px-3 py-1.5 rounded-lg border border-surface-200">
                <span className="w-2 h-2 rounded-full bg-success-500 mr-2 animate-pulse"></span>
                Sistema Operativo
             </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 sm:p-8 relative z-0 scrollbar-thin scrollbar-thumb-surface-200">
          <div className="max-w-7xl mx-auto animate-slide-up">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
