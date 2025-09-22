import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

  function LocationMarker({ onClick }) {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        onClick(lat, lng);
      },
    });
    return null;
  }

function App() {
  const [coords, setCoords] = useState(null);
  const [uvData, setUvData] = useState(null);

  const fetchUvData = async (lat, lng) => {
    try {
      const res = await fetch(`http://localhost:5000/uv?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      setUvData(data.result);
      console.log("API response:", data.result);
    } catch (err) {
      console.error("Error fetching UV data", err);
    }
  };

  const handleClick = (lat, lng) => {
    setCoords({ lat, lng });
    fetchUvData(lat, lng);
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

      {/* API response display */}
      {uvData && (
        <div className="API-response">
          {/**style={{
            position: "absolute",
            top: 130,
            left: 10,
            background: "white",
            padding: 10,
            zIndex: 1000,
            maxWidth: 300,
            overflowY: "auto",
            maxHeight: "60vh",
          }}
        >**/}
          <h4>UV Data:</h4>
          <p><strong>UV Index:</strong> {uvData.uv}</p>
          <p><strong>Max UV:</strong> {uvData.uv_max} at {new Date(uvData.uv_max_time).toLocaleTimeString()}</p>
          <p><strong>UV Time:</strong> {new Date(uvData.uv_time).toLocaleTimeString()}</p>
          <p><strong>Ozone:</strong> {uvData.ozone}</p>

          <h5>Sun Position:</h5>
          <ul>
            {Object.entries(uvData.sun_info.sun_position).map(([key, value]) => (
              <li key={key}>{key.toUpperCase()}: {value}</li>
            ))}
          </ul>

          <h5>Safe Exposure Times (minutes):</h5>
          <ul>
            {Object.entries(uvData.safe_exposure_time).map(([key, value]) => (
              <li key={key}>{key.toUpperCase()}: {value}</li>
            ))}
          </ul>

          <h5>Sun Times:</h5>
          <ul>
            {Object.entries(uvData.sun_info.sun_times).map(([key, value]) => (
              <li key={key}>{key}: {new Date(value).toLocaleTimeString()}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}

export default App;
