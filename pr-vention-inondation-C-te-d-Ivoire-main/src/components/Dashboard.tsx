import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { AlertTriangle, Users, Map as MapIcon, History } from 'lucide-react';

const data = [
  { name: 'Abidjan', risk: 85, pop: 5.5 },
  { name: 'Bouaké', risk: 20, pop: 1.5 },
  { name: 'Yamoussoukro', risk: 45, pop: 0.4 },
  { name: 'San Pedro', risk: 65, pop: 0.3 },
  { name: 'Daloa', risk: 15, pop: 0.4 },
  { name: 'Korhogo', risk: 10, pop: 0.3 },
];

const pieData = [
  { name: 'Risque Élevé', value: 30, color: '#ef4444' },
  { name: 'Risque Moyen', value: 45, color: '#f59e0b' },
  { name: 'Risque Faible', value: 25, color: '#22c55e' },
];

const historyData = [
  { year: '2018', events: 12 },
  { year: '2019', events: 8 },
  { year: '2020', events: 15 },
  { year: '2021', events: 10 },
  { year: '2022', events: 18 },
  { year: '2023', events: 22 },
  { year: '2024', events: 14 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6 lg:overflow-y-auto lg:h-full bg-slate-50">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Tableau de Bord National</h2>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
          <History className="w-4 h-4" />
          Dernière mise à jour: Mars 2026
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Zones à Haut Risque', value: '42', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Population Exposée', value: '2.4M', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Régions Surveillées', value: '31', icon: MapIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Alertes Actives', value: '03', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className={`p-2 w-fit rounded-lg ${stat.bg} ${stat.color} mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk by City */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Indice de Risque par Ville</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="risk" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Distribution des Niveaux de Risque</h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 pr-4">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-medium text-slate-600">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* History */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Historique des Événements Majeurs (Inondations)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="events" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
