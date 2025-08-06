# Weather Data Dashboard

<!-- ![Dashboard Screenshot](./public/screenshot.png) Add your screenshot if available -->

A responsive React application for visualizing weather data on an interactive map with polygon drawing capabilities, powered by Leaflet and Open-Meteo API.

## Features

- **Interactive Map Visualization**
  - Draw custom polygons (3-12 points)
  - View existing polygons with color coding
  - Pan and zoom functionality

- **Time Series Analysis**
  - 30-day timeline slider (15 days before/after current date)
  - Hourly resolution data selection

- **Data Management**
  - Multiple data sources (Temperature at 2m included)
  - Custom threshold rules with color coding
  - Polygon persistence using localStorage

- **User Experience**
  - Keyboard shortcuts (Enter to finish, Esc to cancel)
  - Responsive design for all screen sizes
  - Context API for state management

## Technologies Used

- **Frontend**
  - React 18 with TypeScript
  - Leaflet/React-Leaflet for mapping
  - React-Bootstrap for UI components
  - Vite as build tool

- **APIs**
  - Open-Meteo API for weather data
  - OpenStreetMap for base maps

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Install dependencies**

bash
```
npm install
```
Configure environment
Create a .env file in the root directory:

env
```
VITE_OPEN_METEO_API_URL= your_api
```

bash
```
npm run dev
```
## Available Scripts

Below are the available npm scripts for this project:

- **`npm run dev`**  
  Start the development server.

- **`npm run build`**  
  Create a production build.

- **`npm run preview`**  
  Preview the production build locally.

- **`npm run lint`**  
  Run ESLint to check for code quality and formatting issues.

- **`npm run type-check`**  
  Verify TypeScript types for correctness.


## Usage Guide

### Drawing Polygons

- Click the **"Draw Polygon"** button.
- Click on the map to add points (minimum of 3).
- Press **Enter** or click **"Finish Drawing"** to complete.
- Press **Esc** or click **"Cancel"** to abort.

### Analyzing Data

- Select the time range using the **timeline slider**.
- Choose a data source from the **dropdown**.
- Set thresholds using the **controls panel**.
- Polygons will automatically update colors based on the data.

### Managing Polygons

- View all created polygons in the **sidebar**.
- Delete polygons using the **trash icon**.
- **Threshold rules persist between sessions**.


