import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, LogOut, Map, LayoutDashboard, Calendar, ClipboardList } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
          <Bus className="w-8 h-8 text-blue-600 mr-3" />
          <span className="text-xl font-bold text-slate-800 dark:text-white">GoBuss Web</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link to="/" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          
          {user?.rol === 'ADMIN' && (
            <Link to="/cooperativas" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
              <Bus className="w-5 h-5 mr-3" /> Cooperativas
            </Link>
          )}

          {(user?.rol === 'ADMIN' || user?.rol === 'COOPERATIVA') && (
            <>
              <Link to="/rutas" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
                <Map className="w-5 h-5 mr-3" /> Rutas
              </Link>
              <Link to="/horarios" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
                <Calendar className="w-5 h-5 mr-3" /> Horarios
              </Link>
              <Link to="/reportes" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
                <ClipboardList className="w-5 h-5 mr-3" /> Reportes
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {user?.nombres}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Rol: {user?.rol}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5 mr-3" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-slate-800 dark:text-white">Panel de Control</h1>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
