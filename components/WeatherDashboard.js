// components/WeatherDashboard.js
"use client";

import React, { useState, useEffect } from 'react';
import CityList from './CityList';
import WeatherCard from './WeatherCard';
import '../styles/dashboard.css';

function WeatherDashboard() {
    const [cities, setCities] = useState([]);
    const [isCelsius, setIsCelsius] = useState(true);

    // Load cities from localStorage when the component mounts (client-side only)
    useEffect(() => {
        if (typeof window !== 'undefined') { // Ensures this code runs only on the client
            const savedCities = JSON.parse(localStorage.getItem('cities')) || [];
            setCities(savedCities);
        }
    }, []);

    // Save cities to localStorage whenever the cities array changes
    useEffect(() => {
        if (typeof window !== 'undefined') { // Client-side check
            localStorage.setItem('cities', JSON.stringify(cities));
        }
    }, [cities]);

    const handleAddCity = (city) => {
        if (!cities.includes(city)) {
            setCities([...cities, city]);
        }
    };

    const handleRemoveCity = (city) => {
        setCities(cities.filter(c => c !== city));
    };

    const handleClearHistory = () => {
        setCities([]);
        if (typeof window !== 'undefined') { // Client-side check
            localStorage.removeItem('cities');
        }
    };

    const toggleUnits = () => setIsCelsius(!isCelsius);

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <h2>Search for a City:</h2>
                <CityList onAddCity={handleAddCity} existingCities={cities.map(c => c.toLowerCase())} />
                <button className="clear-history" onClick={handleClearHistory}>Clear All Cities</button>
                <button className="toggle-units" onClick={toggleUnits}>
                    Show in {isCelsius ? 'Fahrenheit' : 'Celsius'}
                </button>
            </aside>
            <main className="main-content">
                <h1>Weather Dashboard</h1>
                <div className="weather-cards">
                    {cities.map((city) => (
                        <WeatherCard
                            key={city}
                            city={city}
                            onRemove={() => handleRemoveCity(city)}
                            isCelsius={isCelsius}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}

export default WeatherDashboard;
