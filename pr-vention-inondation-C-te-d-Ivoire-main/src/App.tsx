import React, { useState, useCallback, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import LoginModal from './components/LoginModal';
import { CITIES, COMMUNES_ABIDJAN } from './data';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { LayoutGrid, Map as MapIcon, Menu, X, MessageSquare, Bell, AlertTriangle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [view, setView] = useState<'map' | 'dashboard' | 'chat'>('map');
  const [layers, setLayers] = useState({
    rivers: true,
    floodZones: true,
    urban: true,
    population: false,
    fireStations: true,
  });
  const [simulationLevel, setSimulationLevel] = useState(0);
  const [selectedZone, setSelectedZone] = useState<any | null>(null);
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  // Alert simulation logic
  useEffect(() => {
    if (user && simulationLevel > 1) {
      const newAlert = {
        id: Date.now(),
        title: "ALERTE INONDATION",
        message: `Risque critique détecté ! Montée des eaux de +${simulationLevel === 2 ? '50cm' : simulationLevel === 3 ? '1m' : '2m'}. ${user.phone ? 'Un SMS d\'alerte a été envoyé au ' + user.phone + '.' : 'Veuillez évacuer les zones bas-fonds.'}`,
        time: new Date().toLocaleTimeString(),
        type: 'critical'
      };
      setAlerts(prev => [newAlert, ...prev]);
      setShowNotification(true);
      
      // Auto-hide notification after 8 seconds
      const timer = setTimeout(() => setShowNotification(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [simulationLevel, user]);

  const handleSearch = (query: string) => {
    const commune = COMMUNES_ABIDJAN.find(c => c.name.toLowerCase().includes(query.toLowerCase()));
    if (commune) {
      setSearchLocation({ lat: commune.lat, lng: commune.lng });
      setSelectedZone({
        name: commune.name,
        risk: commune.risk_level.toLowerCase().includes('élevé') ? 'high' : 'medium',
        pop_exposed: commune.pop,
        freq: 'Annuelle',
        avg_height: commune.water_rise,
        details: commune.details
      });
      setView('map');
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      return;
    }

    const city = CITIES.find(c => c.name.toLowerCase().includes(query.toLowerCase()));
    if (city) {
      setSearchLocation({ lat: city.lat, lng: city.lng });
      setView('map');
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
    } else {
      alert("Localité non trouvée. Essayez 'Cocody', 'Yopougon', 'Abidjan', etc.");
    }
  };

  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          alert("Impossible de récupérer votre position.");
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  const handleExport = async () => {
    if (!selectedZone) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(234, 88, 12); // Orange-600
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Risk PICI - Rapport de Risque', 20, 25);
    
    // Content
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.setFontSize(16);
    doc.text(`Secteur: ${selectedZone.name}`, 20, 60);
    
    doc.setFontSize(12);
    doc.text(`Niveau de Risque: ${selectedZone.risk.toUpperCase()}`, 20, 75);
    doc.text(`Population Exposée: ${selectedZone.pop_exposed}`, 20, 85);
    doc.text(`Fréquence Historique: ${selectedZone.freq}`, 20, 95);
    doc.text(`Hauteur d'eau potentielle: ${selectedZone.avg_height}`, 20, 105);
    
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.line(20, 115, 190, 115);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text('Ce rapport est généré automatiquement par le système Risk PICI.', 20, 130);
    doc.text('Les données sont fournies à titre indicatif par l\'ONPC et la SODEXAM.', 20, 137);
    
    doc.save(`Rapport_Inondation_${selectedZone.name.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-slate-50">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-[2000] p-3 bg-white rounded-2xl shadow-xl border border-slate-200 text-orange-600 active:scale-95 transition-transform"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1400] animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-[1500] transform transition-transform duration-300 lg:relative lg:translate-x-0 w-[85%] sm:w-96 lg:w-auto",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        !isSidebarOpen && "pointer-events-none lg:pointer-events-auto"
      )}>
        <div className="pointer-events-auto h-full">
          <Sidebar 
            layers={layers} 
            setLayers={setLayers}
            simulationLevel={simulationLevel}
            setSimulationLevel={setSimulationLevel}
            onSearch={handleSearch}
            onGeolocate={handleGeolocate}
            onExport={handleExport}
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
            user={user}
            onLogin={() => setIsLoginModalOpen(true)}
            onLogout={() => setUser(null)}
            alerts={alerts}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* View Toggle */}
        <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-[1000] flex bg-white/95 backdrop-blur-md p-1 rounded-xl lg:rounded-2xl shadow-2xl border border-slate-200 w-fit pointer-events-auto">
          <button
            onClick={() => setView('map')}
            className={cn(
              "flex items-center justify-center gap-2 px-3 lg:px-6 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-xs lg:text-sm font-bold transition-all",
              view === 'map' ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <MapIcon className="w-4 h-4" />
            <span className="hidden xs:inline">Carte</span>
          </button>
          <button
            onClick={() => setView('dashboard')}
            className={cn(
              "flex items-center justify-center gap-2 px-3 lg:px-6 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-xs lg:text-sm font-bold transition-all",
              view === 'dashboard' ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden xs:inline">Stats</span>
          </button>
          <button
            onClick={() => setView('chat')}
            className={cn(
              "flex items-center justify-center gap-2 px-3 lg:px-6 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-xs lg:text-sm font-bold transition-all",
              view === 'chat' ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden xs:inline">Chat</span>
          </button>
        </div>

        {/* View Content */}
        <div className="flex-1 h-full overflow-hidden relative">
          {/* Real-time Alert Notification */}
          {showNotification && alerts.length > 0 && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[3000] w-[90%] max-w-md animate-in slide-in-from-top-8 duration-500">
              <div className="bg-red-600 text-white p-4 rounded-2xl shadow-2xl border-2 border-white/20 flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-xl animate-pulse">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-black text-sm tracking-wider">ALERTE Risk PICI</h4>
                    <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">{alerts[0].time}</span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed">{alerts[0].message}</p>
                </div>
                <button onClick={() => setShowNotification(false)} className="p-1 hover:bg-white/10 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {view === 'map' ? (
            <MapComponent 
              layers={layers} 
              simulationLevel={simulationLevel}
              onZoneSelect={setSelectedZone}
              searchLocation={searchLocation}
            />
          ) : view === 'dashboard' ? (
            <div className="h-full overflow-y-auto bg-slate-50">
              <Dashboard />
            </div>
          ) : (
            <div className="h-full overflow-hidden bg-slate-50">
              <Chat user={user} onLogin={() => setIsLoginModalOpen(true)} />
            </div>
          )}
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={setUser} 
      />
    </div>
  );
}
