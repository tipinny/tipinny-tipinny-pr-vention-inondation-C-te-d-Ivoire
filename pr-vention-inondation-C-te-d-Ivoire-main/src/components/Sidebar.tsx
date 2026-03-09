import React from 'react';
import { 
  Layers, 
  Waves, 
  Search, 
  MapPin, 
  Info, 
  BarChart3, 
  Download,
  X,
  ChevronRight,
  Droplets,
  Shield,
  User,
  LogOut,
  MessageSquare,
  Navigation,
  AlertTriangle,
  Bell,
  Phone
} from 'lucide-react';
import { COMMUNES_ABIDJAN, CITIES } from '../data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  layers: {
    rivers: boolean;
    floodZones: boolean;
    urban: boolean;
    population: boolean;
    fireStations: boolean;
  };
  setLayers: React.Dispatch<React.SetStateAction<any>>;
  simulationLevel: number;
  setSimulationLevel: (level: number) => void;
  onSearch: (query: string) => void;
  onGeolocate: () => void;
  onExport: () => void;
  selectedZone: any | null;
  setSelectedZone: (zone: any | null) => void;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
  alerts: any[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  layers, 
  setLayers, 
  simulationLevel, 
  setSimulationLevel,
  onSearch,
  onGeolocate,
  onExport,
  selectedZone,
  setSelectedZone,
  user,
  onLogin,
  onLogout,
  alerts
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const allLocalities = [...COMMUNES_ABIDJAN, ...CITIES];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 1) {
      const filtered = allLocalities.filter(l => 
        l.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (locality: any) => {
    setSearchQuery(locality.name);
    setShowSuggestions(false);
    onSearch(locality.name);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const simulationOptions = [
    { label: 'Normal', value: 0 },
    { label: '+20 cm', value: 1 },
    { label: '+50 cm', value: 2 },
    { label: '+1 m', value: 3 },
    { label: '+2 m', value: 4 },
  ];

  return (
    <div className="w-full sm:w-96 h-full flex flex-col bg-white border-r border-slate-200 overflow-hidden shadow-xl z-10">
      {/* Header */}
      <div className="p-6 bg-orange-600 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Waves className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Risk PICI</h1>
        </div>
        <p className="text-orange-50 font-medium text-sm">Prévention et gestion des risques d'inondation en Côte d'Ivoire</p>
      </div>

        {/* User Account */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                  {user.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{user.name}</p>
                  {user.phone && (
                    <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                      <Phone className="w-2.5 h-2.5 text-emerald-600" />
                      {user.phone}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Compte Citoyen</p>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[9px] text-emerald-600 font-bold uppercase">Alertes Actives</span>
                  </div>
                </div>
              </div>
              <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-all shadow-sm"
            >
              <User className="w-4 h-4 text-emerald-600" />
              Se connecter / S'inscrire
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Alerts Section for Logged-in Users */}
        {user && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Mes Alertes</label>
              {alerts.length > 0 && (
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
              )}
            </div>
            {alerts.length > 0 ? (
              <div className="space-y-2">
                {alerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="p-3 bg-red-50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-right-2">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-wider">{alert.title}</p>
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium leading-tight mb-1">{alert.message}</p>
                    <p className="text-[9px] text-slate-400 font-bold">{alert.time}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                <Bell className="w-5 h-5 text-slate-300 mx-auto mb-2" />
                <p className="text-[10px] text-slate-500 font-medium">Aucune alerte active pour votre zone.</p>
              </div>
            )}
          </div>
        )}

        {/* Search */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Recherche de localité</label>
          <div className="relative">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="Ex: Cocody, Abidjan..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 z-[2000] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {suggestions.map((locality, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSuggestion(locality)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left transition-colors border-b border-slate-50 last:border-0"
                  >
                    <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600">
                      <Navigation className="w-3 h-3" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{locality.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">
                        {locality.risk_level ? `Risque ${locality.risk_level}` : `Population ${locality.pop}`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={onGeolocate}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Ma position actuelle
          </button>
        </div>

        {/* Layers */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Couches SIG</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: 'floodZones', label: 'Zones Inondables', icon: Waves },
              { id: 'rivers', label: 'Cours d\'eau', icon: Droplets },
              { id: 'fireStations', label: 'Casernes GSPM', icon: Shield },
              { id: 'urban', label: 'Zones Urbaines', icon: MapPin },
              { id: 'population', label: 'Densité Pop.', icon: BarChart3 },
            ].map((layer) => (
              <button
                key={layer.id}
                onClick={() => setLayers((prev: any) => ({ ...prev, [layer.id]: !prev[layer.id] }))}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all",
                  layers[layer.id as keyof typeof layers] 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm" 
                    : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
                )}
              >
                <layer.icon className={cn("w-4 h-4", layers[layer.id as keyof typeof layers] ? "text-emerald-600" : "text-slate-400")} />
                {layer.label}
              </button>
            ))}
          </div>
        </div>

        {/* Simulation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Simulation de montée</label>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
              {simulationOptions[simulationLevel].label}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1 bg-slate-100 p-1 rounded-xl">
            {simulationOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSimulationLevel(opt.value)}
                className={cn(
                  "py-2 text-[10px] font-bold rounded-lg transition-all",
                  simulationLevel === opt.value 
                    ? "bg-white text-orange-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 italic">
            * Simulation basée sur les modèles numériques de terrain (MNT) officiels.
          </p>
        </div>

        {/* Selected Zone Info */}
        {selectedZone && (
          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 border border-emerald-500/20">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-orange-400" />
                <h3 className="font-bold">Détails de la Zone</h3>
              </div>
              <button onClick={() => setSelectedZone(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-bold">Nom du secteur</p>
                <p className="text-sm font-medium">{selectedZone.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Niveau de Risque</p>
                  <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-full",
                    selectedZone.risk === 'high' ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                  )}>
                    {selectedZone.risk === 'high' ? 'Élevé' : 'Moyen'}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Pop. Exposée</p>
                  <p className="text-sm font-medium">{selectedZone.pop_exposed}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Fréquence</p>
                  <p className="text-sm font-medium">{selectedZone.freq}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Haut. Moyenne</p>
                  <p className="text-sm font-medium">{selectedZone.avg_height}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={onExport}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-orange-600/20"
            >
              <Download className="w-4 h-4" />
              Exporter Rapport PDF
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Données: ONPC / SODEXAM</span>
          <span>v1.0.2</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
