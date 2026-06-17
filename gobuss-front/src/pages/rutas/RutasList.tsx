import { useState } from 'react';
import { Map, MapPin, Route as RouteIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CiudadesTab } from './CiudadesTab';
import { RutasGeneralesTab } from './RutasGeneralesTab';
import { RutasFinalesTab } from './RutasFinalesTab';

export const RutasList = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'finales' | 'generales' | 'ciudades'>(
    user?.role === 'ADMIN' ? 'ciudades' : 'finales'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center">
            <RouteIcon className="w-6 h-6 mr-2 text-brand-600" />
            Gestión de Rutas
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Administra ciudades, rutas generales y rutas asignadas.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-1.5 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1">
        {(user?.role === 'ADMIN' || user?.role === 'COOPERATIVA') && (
          <>
            <button
              onClick={() => setActiveTab('ciudades')}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg flex items-center justify-center transition-colors ${
                activeTab === 'ciudades'
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Ciudades
            </button>
            <button
              onClick={() => setActiveTab('generales')}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg flex items-center justify-center transition-colors ${
                activeTab === 'generales'
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Map className="w-4 h-4 mr-2" />
              Rutas Generales
            </button>
          </>
        )}
        <button
          onClick={() => setActiveTab('finales')}
          className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg flex items-center justify-center transition-colors ${
            activeTab === 'finales'
              ? 'bg-brand-50 text-brand-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <RouteIcon className="w-4 h-4 mr-2" />
          Rutas de Cooperativa
        </button>
      </div>

      {/* Content */}
      <div className="bg-transparent">
        {activeTab === 'ciudades' && <CiudadesTab />}
        {activeTab === 'generales' && <RutasGeneralesTab />}
        {activeTab === 'finales' && <RutasFinalesTab />}
      </div>
    </div>
  );
};
