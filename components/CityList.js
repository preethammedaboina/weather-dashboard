// components/CityList.js
"use client";

import React, { useState } from 'react';
import axios from 'axios';

function CityList({ onAddCity, existingCities = [] }) {
    const [cityName, setCityName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1); // Tracks keyboard navigation

    // Debounce function to limit API calls
    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    // Fetch city suggestions from OpenWeatherMap Geocoding API
    const fetchCitySuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
                params: {
                    q: query,
                    limit: 5,
                    appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
                }
            });
            setSuggestions(response.data);
        } catch (err) {
            setError('Failed to fetch city suggestions');
        } finally {
            setLoading(false);
        }
    };

    // Debounced version of fetchCitySuggestions
    const debouncedFetchSuggestions = debounce(fetchCitySuggestions, 300);

    // Handle input changes
    const handleInputChange = (e) => {
        const query = e.target.value;
        setCityName(query);
        setActiveSuggestionIndex(-1); // Reset suggestion index when typing
        debouncedFetchSuggestions(query);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown' && activeSuggestionIndex < suggestions.length - 1) {
            // Move down in the suggestions
            setActiveSuggestionIndex((prevIndex) => prevIndex + 1);
        } else if (e.key === 'ArrowUp' && activeSuggestionIndex > 0) {
            // Move up in the suggestions
            setActiveSuggestionIndex((prevIndex) => prevIndex - 1);
        } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
            // Select the currently highlighted suggestion
            const selectedCity = suggestions[activeSuggestionIndex];
            handleSelectSuggestion(selectedCity);
            setActiveSuggestionIndex(-1);
        }
    };

    // Handle adding a city
    const handleAddCity = (city) => {
        if (city && !existingCities.includes(city.toLowerCase())) {
            onAddCity(city);
            setCityName('');
            setSuggestions([]);
        }
    };

    // Handle selecting a city from suggestions
    const handleSelectSuggestion = (suggestion) => {
        const city = suggestion.name;
        handleAddCity(city);
    };

    return (
        <div>
            <input
                type="text"
                value={cityName}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown} // Add keyboard navigation handler
                placeholder="Enter city name"
                className="city-input"
            />
            <button onClick={() => handleAddCity(cityName)} className="add-city-button">Add City</button>

            {loading && <p>Loading suggestions...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={`${suggestion.name}-${suggestion.country}-${suggestion.lat}-${suggestion.lon}`}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className={`suggestion-item ${index === activeSuggestionIndex ? 'active' : ''}`}
                        >
                            {suggestion.name}, {suggestion.country}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CityList;
