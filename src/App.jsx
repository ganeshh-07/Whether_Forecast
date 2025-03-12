import React, { useState } from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import headerLogo from "./assets/header-logo.png";

function App() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchWeather = async () => {
    const apiKey = "7c1a60b4acd2460095593845252201";
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Location not found");
      }
      const data = await response.json();
      setWeather(data);
      setError("");
      setCoordinates([data.location.lat, data.location.lon]);
      setShowDetails(true);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setCoordinates(null);
      setShowDetails(false);
    }
  };

  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-title">
          <img src={headerLogo} alt="Header Logo" /> <h1>Weather Buddy</h1>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={handleInputChange}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Get Info
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {showDetails && weather && (
          <div className="weather-map-container">
            <div className="weather-info">
              <h2>
                {weather.location.name}, {weather.location.country}
              </h2>
              <p>
                <strong>Temperature:</strong> {weather.current.temp_c}°C
              </p>
              <p>
                <strong>Condition:</strong> {weather.current.condition.text}
              </p>
              <p>
                <strong>Air Quality:</strong> PM2.5 -{" "}
                {weather.current.air_quality.pm2_5.toFixed(2)}
              </p>
              <img src={weather.current.condition.icon} alt="weather icon" />
            </div>

            {coordinates && (
              <div className="map-container">
                <MapContainer
                  key={coordinates.join(",")}
                  center={coordinates}
                  zoom={12}
                  style={{ width: "100%", height: "400px" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={coordinates}>
                    <Popup>{weather?.location.name}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
