import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { RIVERS_GEOJSON, FLOOD_ZONES_GEOJSON, CITIES, COMMUNES_ABIDJAN, FIRE_STATIONS } from '../data';

// Use CDN for Leaflet icons to avoid build issues with local assets
const markerIcon = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const markerShadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

// Firefighter themed icon (using a red marker as a proxy for now, or a custom SVG if possible)
const fireIcon = L.divIcon({
  html: `<div class="bg-orange-600 p-2 rounded-full border-2 border-white shadow-lg animate-pulse">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
         </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  layers: {
    rivers: boolean;
    floodZones: boolean;
    urban: boolean;
    population: boolean;
    fireStations: boolean;
  };
  simulationLevel: number;
  onZoneSelect: (zone: any) => void;
  searchLocation: { lat: number; lng: number } | null;
}

// Custom icon for fire stations
const fireStationIcon = L.divIcon({
  html: `<div class="bg-red-600 p-2 rounded-full border-2 border-white shadow-lg">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2a.3.3 0 1 0-.2.3zm5.4 0A.3.3 0 1 0 10.4 2a.3.3 0 1 0-.2.3zM2 6h20v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm9 15V11h2v10h-2zM2 6V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2H2z"/></svg>
         </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const searchResultIcon = L.divIcon({
  html: `<div class="relative flex items-center justify-center">
           <div class="absolute w-12 h-12 bg-orange-400/30 rounded-full animate-ping"></div>
           <div class="bg-white p-2 rounded-full border-2 border-orange-600 shadow-xl z-20">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
           </div>
         </div>`,
  className: '',
  iconSize: [48, 48],
  iconAnchor: [24, 24],
});

const LocationMarker = ({ position }: { position: { lat: number; lng: number } | null }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 14);
    }
  }, [position, map]);

  return position ? (
    <Marker position={[position.lat, position.lng]} icon={searchResultIcon}>
      <Popup>Lieu recherché</Popup>
    </Marker>
  ) : null;
};

const MapComponent: React.FC<MapComponentProps> = ({ layers, simulationLevel, onZoneSelect, searchLocation }) => {
  const getFloodZoneStyle = (feature: any) => {
    const risk = feature.properties.risk;
    let color = '#22c55e'; // low
    if (risk === 'medium') color = '#f59e0b';
    if (risk === 'high') color = '#ef4444';

    // Simulation effect: increase opacity or change color if simulation is high
    const opacity = 0.5 + (simulationLevel / 4);
    
    return {
      fillColor: color,
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: opacity,
    };
  };

  const onEachFloodZone = (feature: any, layer: L.Layer) => {
    layer.on({
      click: () => {
        onZoneSelect(feature.properties);
      },
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.7
        });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle(getFloodZoneStyle(feature));
      }
    });
  };

  return (
    <div className="w-full h-full relative" id="map-container">
      <MapContainer
        center={[5.36, -4.008]}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {layers.rivers && (
          <GeoJSON 
            data={RIVERS_GEOJSON} 
            style={{ color: '#10b981', weight: 3, opacity: 0.8 }} 
          />
        )}

        {layers.floodZones && COMMUNES_ABIDJAN.map((commune, idx) => (
          <Marker 
            key={`commune-${idx}`} 
            position={[commune.lat, commune.lng]}
            icon={fireIcon}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
                  <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-800">{commune.name}</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Population</p>
                    <p className="text-xs font-bold text-slate-700">{commune.pop}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Superficie</p>
                    <p className="text-xs font-bold text-slate-700">{commune.area}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Risque</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      commune.risk_level.includes('Élevé') ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {commune.risk_level}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Montée Eau</p>
                    <p className="text-xs font-bold text-orange-600">+{commune.water_rise}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    {commune.details}
                  </p>
                </div>

                <button 
                  onClick={() => onZoneSelect({
                    name: commune.name,
                    risk: commune.risk_level.toLowerCase().includes('élevé') ? 'high' : 'medium',
                    pop_exposed: commune.pop,
                    freq: 'Annuelle',
                    avg_height: commune.water_rise
                  })}
                  className="w-full mt-3 py-1.5 bg-orange-600 text-white text-[10px] font-bold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Voir Rapport d'Intervention
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {layers.urban && CITIES.map((city, idx) => (
          <Marker key={idx} position={[city.lat, city.lng]}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-lg">{city.name}</h3>
                <p className="text-sm">Risque: <span className={city.risk === 'Élevé' ? 'text-red-500 font-bold' : city.risk === 'Moyen' ? 'text-amber-500' : 'text-green-500'}>{city.risk}</span></p>
                <p className="text-sm">Population: {city.pop}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {layers.fireStations && FIRE_STATIONS.map((station, idx) => (
          <Marker 
            key={`station-${idx}`} 
            position={[station.lat, station.lng]}
            icon={fireStationIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-red-600 mb-1">{station.name}</h3>
                <p className="text-xs font-bold mb-2">Caserne Sapeurs-Pompiers</p>
                <div className="flex items-center gap-2 text-xs bg-red-50 p-2 rounded-lg border border-red-100">
                  <span className="font-bold text-red-700">Urgence:</span>
                  <a href={`tel:${station.phone.split('/')[0].trim()}`} className="text-red-600 underline font-bold">
                    {station.phone}
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <LocationMarker position={searchLocation} />
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200">
        <h4 className="text-sm font-bold mb-3 text-slate-800">Légende Risk PICI</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
            </div>
            <span className="text-xs text-slate-600">Points d'Intervention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h20v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm9 15V11h2v10h-2zM2 6V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2H2z"/></svg>
            </div>
            <span className="text-xs text-slate-600">Casernes GSPM</span>
          </div>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
            <div className="w-4 h-0.5 bg-emerald-500"></div>
            <span className="text-xs text-slate-600">Cours d'eau</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
