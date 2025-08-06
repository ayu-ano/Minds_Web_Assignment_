import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AppProvider from './ContextApi/AppProvider';
import TimelineSlider from './components/TimelineSlider/TimelineSlider';
import MapComponent from './components/MapComponent/MapComponent';
import DataControls from './components/DataControls/DataControls';
import PolygonList from './components/PolygonList/PolygonList';

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="app-root">
        {/* Header */}
        <header className="app-header">
          <h1>Weather Data Dashboard</h1>
        </header>

        {/* Timeline */}
        <div className="app-timeline">
          <TimelineSlider />
        </div>

        {/* Main Content */}
        <main className="app-main">
          <div className="app-map-container">
            <MapComponent />
          </div>
          
          <div className="app-sidebar">
            <div className="app-controls-container">
              <DataControls />
            </div>
            <div className="app-polygon-container">
              <PolygonList />
            </div>
          </div>
        </main>
      </div>
    </AppProvider>
  );
};

export default App;