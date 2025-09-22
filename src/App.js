import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

function App() {
  const [coords, setCoords] = useState(null);

  function LocationMarker({ onClick }) {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        onClick(lat, lng);
      },
    });
    return null;
  }

  const handleClick = (lat, lng) => {
    setCoords({ lat, lng });
    console.log(`Latitude: ${lat} and ${lng}`);
  };

  return (
    <div className="map-container">
      <MapContainer center={[0, 0]} zoom={2} className="leaflet-map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationMarker onClick={handleClick} />
        {coords && (
          <Marker position={[coords.lat, coords.lng]}>
            <Popup>
              You clicked at <br /> {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {coords && (
        <div className="coords-display">
          <strong>Coordinates:</strong> {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
}

export default App;
