import { Card } from '../components/ui/Card';
import { Users, Bus, MapPin, TrendingUp, DollarSign, CalendarDays } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

const dataIngresos = [
  { name: 'Lun', ingresos: 4000 },
  { name: 'Mar', ingresos: 3000 },
  { name: 'Mié', ingresos: 2000 },
  { name: 'Jue', ingresos: 2780 },
  { name: 'Vie', ingresos: 1890 },
  { name: 'Sáb', ingresos: 2390 },
  { name: 'Dom', ingresos: 3490 },
];

const dataRutas = [
  { name: 'UIO-GYE', boletos: 400, capacidad: 240 },
  { name: 'CUE-GYE', boletos: 300, capacidad: 139 },
  { name: 'UIO-CUE', boletos: 200, capacidad: 980 },
  { name: 'MTA-UIO', boletos: 278, capacidad: 390 },
  { name: 'LOJ-CUE', boletos: 189, capacidad: 480 },
];

export const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-surface-800 tracking-tight font-display">Dashboard General</h1>
          <p className="text-surface-500 font-medium mt-1">Resumen de operaciones y rendimiento</p>
        </div>
        <div className="hidden sm:flex items-center text-sm font-bold text-brand-600 bg-brand-50 px-4 py-2 rounded-xl border border-brand-100">
          <CalendarDays className="w-4 h-4 mr-2" />
          Últimos 7 días
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-brand-500 hover:-translate-y-1 transition-transform cursor-default">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-surface-500 uppercase tracking-wider">Ingresos Totales</p>
              <h3 className="text-2xl font-black text-surface-800 mt-2">$24,590.00</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600 font-bold">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12.5% <span className="text-surface-400 font-medium ml-2">vs sem ant.</span>
          </div>
        </Card>

        <Card className="border-l-4 border-l-accent-500 hover:-translate-y-1 transition-transform cursor-default">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-surface-500 uppercase tracking-wider">Boletos Vendidos</p>
              <h3 className="text-2xl font-black text-surface-800 mt-2">1,234</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600 font-bold">
            <TrendingUp className="w-4 h-4 mr-1" />
            +5.2% <span className="text-surface-400 font-medium ml-2">vs sem ant.</span>
          </div>
        </Card>

        <Card className="border-l-4 border-l-info-500 hover:-translate-y-1 transition-transform cursor-default">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-surface-500 uppercase tracking-wider">Rutas Activas</p>
              <h3 className="text-2xl font-black text-surface-800 mt-2">48</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-info-50 text-info-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-surface-500 font-medium">
            3 nuevas este mes
          </div>
        </Card>

        <Card className="border-l-4 border-l-success-500 hover:-translate-y-1 transition-transform cursor-default">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-surface-500 uppercase tracking-wider">Flota Operativa</p>
              <h3 className="text-2xl font-black text-surface-800 mt-2">156</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-success-50 text-success-600 flex items-center justify-center">
              <Bus className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600 font-bold">
            98% <span className="text-surface-400 font-medium ml-2">disponibilidad</span>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1 p-6">
          <h3 className="text-lg font-bold text-surface-800 mb-6 font-display">Ingresos de la Semana</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataIngresos} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                  formatter={(value: number) => [`$${value}`, 'Ingresos']}
                />
                <Area type="monotone" dataKey="ingresos" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="col-span-1 p-6">
          <h3 className="text-lg font-bold text-surface-800 mb-6 font-display">Demanda por Rutas Principales</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataRutas} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="boletos" name="Boletos Vendidos" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="capacidad" name="Capacidad Total" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
