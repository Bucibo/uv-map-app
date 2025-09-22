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

  function LocationMarker({ onClick }) {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        onClick(lat, lng);
      },
    });
    return null;
  }

// Helper component to programmatically move map to new coords
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
      {/* Search Bar */}
      <form className="coordinates-form" onClick={handleSearch}>
 <input
          type="text"
          placeholder="Latitude"
          value={latInput}
          onChange={(e) => setLatInput(e.target.value)}
          style={{ width: "80px" }}
        />
        <input
          type="text"
          placeholder="Longitude"
          value={lngInput}
          onChange={(e) => setLngInput(e.target.value)}
          style={{ width: "80px" }}
        />
        <button type="submit">Search</button>
      </form>

      <MapContainer center={[-28.6135, 24.1260]} zoom={6} className="leaflet-map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationMarker onClick={handleClick} />
        {coords && <SetMapCenter coords={coords} />}
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
