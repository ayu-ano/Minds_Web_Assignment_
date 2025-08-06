import React, { useContext, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AppContext } from '../../ContextApi/AppContext';
import { calculateBounds } from '../../utils/helper';
import './MapComponent.css';

const MapEvents: React.FC = () => {
  const { state, addTempPoint, finishDrawing } = useContext(AppContext)!;
  const map = useMap();

  useEffect(() => {
    if (!state.isDrawing) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      e.originalEvent.stopPropagation();
      e.originalEvent.preventDefault();
      addTempPoint([e.latlng.lat, e.latlng.lng]);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        finishDrawing(true);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        finishDrawing();
      }
    };

    map.on('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      map.off('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.isDrawing, addTempPoint, finishDrawing, map]);

  useEffect(() => {
    if (state.polygons.length > 0) {
      const allCoords = state.polygons.flatMap(p => p.coordinates);
      const bounds = calculateBounds(allCoords);
      map.fitBounds(bounds);
    }
  }, [state.polygons, map]);

  return null;
};

const MapComponent: React.FC = () => {
  const { state, startDrawing, finishDrawing } = useContext(AppContext)!;
  const mapRef = useRef<L.Map>(null);

  const defaultCenter: [number, number] = [51.505, -0.09];
  const defaultZoom = 10;

  return (
    <div className="map-container">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        doubleClickZoom={false}
        closePopupOnClick={false}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {state.polygons.map(polygon => (
          <Polygon
            key={polygon.id}
            positions={polygon.coordinates}
            pathOptions={{
              color: polygon.color || '#3388ff',
              fillColor: polygon.color || '#3388ff',
              fillOpacity: 0.4,
              weight: 2,
            }}
            eventHandlers={{
              click: (e) => e.originalEvent.stopPropagation()
            }}
          />
        ))}
        
        {state.isDrawing && state.tempPolygon.length > 0 && (
          <Polygon
            positions={state.tempPolygon}
            pathOptions={{
              color: '#ff0000',
              fillColor: '#ff0000',
              fillOpacity: 0.2,
              weight: 2,
              dashArray: '5, 5',
            }}
          />
        )}
        
        <MapEvents />
      </MapContainer>
      
      <div className="map-controls">
        <button
          className="btn btn-primary m-2"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            state.isDrawing ? finishDrawing() : startDrawing();
          }}
        >
          {state.isDrawing ? 'Finish Drawing (Enter)' : 'Draw Polygon'}
        </button>
        {state.isDrawing && (
          <button
            className="btn btn-danger m-2"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              finishDrawing(true);
            }}
          >
            Cancel (Esc)
          </button>
        )}
      </div>
    </div>
  );
};

export default MapComponent;