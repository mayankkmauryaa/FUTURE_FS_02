
// File: client/src/components/WeatherApp.js
import React, { useState } from 'react';
import './WeatherApp.css';

const WeatherApp = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [favorites, setFavorites] = useState(() =>
        JSON.parse(localStorage.getItem('favorites')) || []
    );

    const fetchWeather = async () => {
        try {
            const res = await fetch(`http://localhost:5000/weather/${city}`);
            const data = await res.json();
            if (res.ok && data.main) {
                setWeather(data);
            } else {
                alert(data.error || 'City not found');
                setWeather(null);
            }
        } catch (err) {
            alert('Error fetching weather');
            console.error(err);
            setWeather(null);
        }
    };

    const addToFavorites = () => {
        if (city && !favorites.includes(city)) {
            const updated = [...favorites, city];
            setFavorites(updated);
            localStorage.setItem('favorites', JSON.stringify(updated));
        }
    };

    const removeFromFavorites = (cityToRemove) => {
        const updated = favorites.filter((fav) => fav !== cityToRemove);
        setFavorites(updated);
        localStorage.setItem('favorites', JSON.stringify(updated));
    };

    return (
        <div className="weather-container">
            <h1 className="title">Weather App 🌤️</h1>

            <div className="search-box">
                <input
                    className="input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                />
                <button className="btn primary" onClick={fetchWeather}>Get Weather</button>
                <button className="btn secondary" onClick={addToFavorites}>Add to Favorites</button>
            </div>

            {weather && weather.main && weather.weather && (
                <div className="weather-card">
                    <h2>{weather.name}</h2>
                    <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
                    <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
                    <p><strong>Condition:</strong> {weather.weather[0].description}</p>
                </div>
            )}

            <div className="favorites">
                <h3>Favorite Cities</h3>
                <ul>
                    {favorites.map((fav, idx) => (
                        <li key={idx}>
                            <span onClick={() => setCity(fav)}>{fav}</span>
                            <button className="remove-btn" onClick={() => removeFromFavorites(fav)}>❌</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WeatherApp;

