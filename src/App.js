import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Component to handle map clicks
function LocationMarker({ onClick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onClick(lat, lng);
    },
  });
  return null;
}

// Component to recenter map programmatically
function SetMapCenter({ coords }) {
  const map = useMap();
  if (coords) map.setView([coords.lat, coords.lng], 6);
  return null;
}


function App() {
  const [coords, setCoords] = useState(null);
  const [uvData, setUvData] = useState(null);
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");

  // Fetch UV data from API
  const fetchUvData = async (lat, lng) => {
    try {
      const res = await fetch(`http://localhost:5000/uv?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      setUvData(data.result);
      console.log(data);
    } catch (err) {
      console.error("Error fetching UV data", err);
      alert("Failed to fetch UV data. Please try again.");
    }
  };

  // Helper function to check if coordinates are valid
const isValidCoordinates = (lat, lng) => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};


// Handle map clicks
const handleClick = (lat, lng) => {
  if (!isValidCoordinates(lat, lng)) {
    alert("Invalid coordinates! Latitude must be -90 to 90, Longitude must be -180 to 180.");
    return;
  }
  setCoords({ lat, lng });
  fetchUvData(lat, lng);
};

  // Handle coordinate search
  const handleSearch = (e) => {
    e.preventDefault();
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (!isNaN(lat) && !isNaN(lng)) {
      handleClick(lat, lng);
      setLatInput("");
      setLngInput("");
    } else {
      alert("Please enter valid numbers for latitude and longitude.");
    }
  };

  return (
    <div className="map-container">
      {/* User Instructions */}
      <div className="instructions">
        <p><strong>Tip:</strong> Click anywhere on the map to get UV index, or enter coordinates below if you know them.</p>
      </div>

      {/* Search Form */}
      <form className="coordinates-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Latitude (e.g. -33.96)"
          value={latInput}
          onChange={(e) => setLatInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Longitude (e.g. 18.41)"
          value={lngInput}
          onChange={(e) => setLngInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Map */}
      <MapContainer center={[-28.6135, 24.1260]} zoom={5} className="leaflet-map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationMarker onClick={handleClick} />
        {coords && <SetMapCenter coords={coords} />}
        {coords && (
          <Marker position={[coords.lat, coords.lng]}>
            <Popup>
              Selected Location <br />
              {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Coordinates Display */}
      {coords && (
        <div className="coords-display">
          <strong>Coordinates:</strong> {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
        </div>
      )}

      {/* UV Data Display */}
      {uvData && (
        <div className="API-response">
          <h4>UV Information</h4>
          <p><strong>UV Index:</strong> {uvData.uv}</p>
          <p><strong>Max UV:</strong> {uvData.uv_max} at {new Date(uvData.uv_max_time).toLocaleTimeString()}</p>
          <p><strong>UV Time:</strong> {new Date(uvData.uv_time).toLocaleTimeString()}</p>
          <p><strong>Ozone:</strong> {uvData.ozone}</p>

          <h5>Sun Position</h5>
          <ul>
            {Object.entries(uvData.sun_info.sun_position).map(([key, value]) => (
              <li key={key}>{key.toUpperCase()}: {value}</li>
            ))}
          </ul>

          <h5>Sun Times</h5>
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
