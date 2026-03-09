import { FeatureCollection } from 'geojson';

// Mock data for Côte d'Ivoire rivers
export const RIVERS_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Comoé', length: '1160 km' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-3.5, 5.2], [-3.6, 6.0], [-3.8, 7.0], [-4.0, 8.5], [-4.2, 10.0]
        ]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Bandama', length: '1050 km' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-5.0, 5.1], [-5.2, 6.5], [-5.5, 7.5], [-5.6, 9.0], [-5.8, 10.5]
        ]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Sassandra', length: '650 km' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-6.1, 4.9], [-6.3, 6.0], [-6.5, 7.0], [-6.8, 8.5], [-7.2, 9.5]
        ]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Cavally', length: '515 km' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-7.5, 4.4], [-7.7, 5.5], [-8.0, 6.5], [-8.2, 7.5], [-8.5, 8.5]
        ]
      }
    }
  ]
};

// Mock data for flood risk zones (polygons around major cities and detailed Abidjan communes)
export const FLOOD_ZONES_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // Abidjan - Cocody (Riviera Palmeraie) - High Risk
    {
      type: 'Feature',
      properties: { 
        name: 'Cocody - Riviera Palmeraie', 
        risk: 'high', 
        pop_exposed: '45k', 
        freq: 'Annuelle',
        avg_height: '1.8m'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-3.96, 5.37], [-3.94, 5.37], [-3.94, 5.39], [-3.96, 5.39], [-3.96, 5.37]
        ]]
      }
    },
    // Abidjan - Yopougon (Selmer/Sideci) - High Risk
    {
      type: 'Feature',
      properties: { 
        name: 'Yopougon - Zone Industrielle/Selmer', 
        risk: 'high', 
        pop_exposed: '120k', 
        freq: 'Annuelle',
        avg_height: '1.5m'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-4.08, 5.33], [-4.05, 5.33], [-4.05, 5.36], [-4.08, 5.36], [-4.08, 5.33]
        ]]
      }
    },
    // Abidjan - Koumassi (Prodomo) - High Risk
    {
      type: 'Feature',
      properties: { 
        name: 'Koumassi - Zone Prodomo', 
        risk: 'high', 
        pop_exposed: '60k', 
        freq: 'Annuelle',
        avg_height: '2.2m'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-3.95, 5.28], [-3.92, 5.28], [-3.92, 5.31], [-3.95, 5.31], [-3.95, 5.28]
        ]]
      }
    },
    // Abidjan - Plateau - Low Risk
    {
      type: 'Feature',
      properties: { 
        name: 'Plateau - Centre Affaires', 
        risk: 'low', 
        pop_exposed: '5k', 
        freq: 'Rare',
        avg_height: '0.2m'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-4.03, 5.31], [-4.01, 5.31], [-4.01, 5.33], [-4.03, 5.33], [-4.03, 5.31]
        ]]
      }
    },
    // Abidjan - Marcory (Anoumabo) - High Risk
    {
      type: 'Feature',
      properties: { 
        name: 'Marcory - Anoumabo', 
        risk: 'high', 
        pop_exposed: '35k', 
        freq: 'Annuelle',
        avg_height: '2.0m'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-3.99, 5.29], [-3.97, 5.29], [-3.97, 5.31], [-3.99, 5.31], [-3.99, 5.29]
        ]]
      }
    },
    // Grand-Bassam - High Risk
    {
      type: 'Feature',
      properties: { 
        name: 'Grand-Bassam Littoral', 
        risk: 'high', 
        pop_exposed: '80k', 
        freq: 'Saisonnière',
        avg_height: '2.0m'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-3.8, 5.1], [-3.6, 5.1], [-3.6, 5.3], [-3.8, 5.3], [-3.8, 5.1]
        ]]
      }
    },
    // Yamoussoukro - Medium Risk
    {
      type: 'Feature',
      properties: { 
        name: 'Yamoussoukro - Zone Lacs', 
        risk: 'medium', 
        pop_exposed: '150k', 
        freq: 'Décennale',
        avg_height: '0.8m'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-5.3, 6.7], [-5.1, 6.7], [-5.1, 6.9], [-5.3, 6.9], [-5.3, 6.7]
        ]]
      }
    },
    // Bouaké - Low Risk
    {
      type: 'Feature',
      properties: { 
        name: 'Bouaké Nord', 
        risk: 'low', 
        pop_exposed: '50k', 
        freq: 'Rare',
        avg_height: '0.3m'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-5.1, 7.6], [-4.9, 7.6], [-4.9, 7.8], [-5.1, 7.8], [-5.1, 7.6]
        ]]
      }
    },
    // San Pedro - Medium Risk
    {
      type: 'Feature',
      properties: { 
        name: 'San Pedro Port', 
        risk: 'medium', 
        pop_exposed: '200k', 
        freq: 'Quinquennale',
        avg_height: '1.2m'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-6.7, 4.7], [-6.5, 4.7], [-6.5, 4.9], [-6.7, 4.9], [-6.7, 4.7]
        ]]
      }
    }
  ]
};

export const COMMUNES_ABIDJAN = [
  { 
    name: 'Cocody', 
    lat: 5.3484, 
    lng: -3.9821, 
    pop: '450,000', 
    area: '90 km²', 
    risk_level: 'Élevé',
    water_rise: '1.8m',
    details: 'Zone résidentielle avec points critiques à la Riviera Palmeraie et Allabra.'
  },
  { 
    name: 'Yopougon', 
    lat: 5.3333, 
    lng: -4.0667, 
    pop: '1,100,000', 
    area: '153 km²', 
    risk_level: 'Élevé',
    water_rise: '1.5m',
    details: 'Plus grande commune, risques majeurs à Selmer, Sideci et Zone Industrielle.'
  },
  { 
    name: 'Abobo', 
    lat: 5.4167, 
    lng: -4.0167, 
    pop: '1,030,000', 
    area: '90 km²', 
    risk_level: 'Moyen',
    water_rise: '1.2m',
    details: 'Relief accidenté, risques d\'éboulements et d\'inondations dans les bas-fonds.'
  },
  { 
    name: 'Koumassi', 
    lat: 5.2956, 
    lng: -3.9489, 
    pop: '412,000', 
    area: '12 km²', 
    risk_level: 'Très Élevé',
    water_rise: '2.2m',
    details: 'Zone lagunaire, inondations fréquentes à Prodomo et Grand Campement.'
  },
  { 
    name: 'Marcory', 
    lat: 5.3000, 
    lng: -3.9833, 
    pop: '250,000', 
    area: '12.5 km²', 
    risk_level: 'Élevé',
    water_rise: '2.0m',
    details: 'Risques accrus à Anoumabo et en bordure de lagune.'
  },
  { 
    name: 'Treichville', 
    lat: 5.3000, 
    lng: -4.0167, 
    pop: '102,000', 
    area: '7 km²', 
    risk_level: 'Moyen',
    water_rise: '1.0m',
    details: 'Zone portuaire et commerciale.'
  },
  { 
    name: 'Adjamé', 
    lat: 5.3500, 
    lng: -4.0167, 
    pop: '372,000', 
    area: '12 km²', 
    risk_level: 'Faible',
    water_rise: '0.5m',
    details: 'Centre commercial, risques localisés.'
  },
  { 
    name: 'Plateau', 
    lat: 5.3200, 
    lng: -4.0200, 
    pop: '7,000', 
    area: '4 km²', 
    risk_level: 'Faible',
    water_rise: '0.2m',
    details: 'Centre administratif, peu de zones résidentielles à risque.'
  },
  { 
    name: 'Port-Bouët', 
    lat: 5.2500, 
    lng: -3.9333, 
    pop: '350,000', 
    area: '110 km²', 
    risk_level: 'Très Élevé',
    water_rise: '2.5m',
    details: 'Zone aéroportuaire et littoral, risques de submersion marine.'
  },
  { 
    name: 'Attécoubé', 
    lat: 5.3333, 
    lng: -4.0333, 
    pop: '260,000', 
    area: '68 km²', 
    risk_level: 'Élevé',
    water_rise: '1.6m',
    details: 'Zones précaires à flanc de colline, risques d\'éboulements.'
  }
];

export const FIRE_STATIONS = [
  { name: 'GSPM Indénié (Adjamé)', lat: 5.3412, lng: -4.0185, phone: '180 / 27 20 37 47 47' },
  { name: 'GSPM Yopougon', lat: 5.3250, lng: -4.0750, phone: '180 / 27 23 45 45 45' },
  { name: 'GSPM Marcory (Zone 4)', lat: 5.2900, lng: -3.9750, phone: '180 / 27 21 24 24 24' },
  { name: 'GSPM Bingerville', lat: 5.3550, lng: -3.8950, phone: '180 / 27 22 40 40 40' },
  { name: 'GSPM Abobo', lat: 5.4200, lng: -4.0100, phone: '180 / 27 24 39 39 39' },
];

export const CITIES = [
  { name: 'Abidjan', lat: 5.36, lng: -4.008, risk: 'Élevé', pop: '5.5M' },
  { name: 'Bouaké', lat: 7.69, lng: -5.03, risk: 'Faible', pop: '1.5M' },
  { name: 'Yamoussoukro', lat: 6.82, lng: -5.27, risk: 'Moyen', pop: '0.4M' },
  { name: 'San Pedro', lat: 4.75, lng: -6.64, risk: 'Moyen', pop: '0.3M' },
  { name: 'Korhogo', lat: 9.45, lng: -5.63, risk: 'Faible', pop: '0.3M' },
  { name: 'Daloa', lat: 6.88, lng: -6.45, risk: 'Faible', pop: '0.4M' },
];
