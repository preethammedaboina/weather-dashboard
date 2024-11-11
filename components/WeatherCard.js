// components/WeatherCard.js
"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function WeatherCard({ city, onRemove, isCelsius }) {
    const [latestForecastTemp, setLatestForecastTemp] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            setError(null);
            try {
                const units = isCelsius ? 'metric' : 'imperial';

                const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                    params: {
                        q: city,
                        appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
                        units: units
                    }
                });
                setWeatherData(weatherResponse.data);

                const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
                    params: {
                        q: city,
                        appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
                        units: units
                    }
                });

                const latestForecast = forecastResponse.data.list[0];
                setLatestForecastTemp(latestForecast.main.temp.toFixed(1));

                const dailyForecast = {};
                forecastResponse.data.list.forEach((item) => {
                    const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                    });
                    if (!dailyForecast[date]) {
                        dailyForecast[date] = { tempSum: 0, count: 0, description: item.weather[0].description };
                    }
                    dailyForecast[date].tempSum += item.main.temp;
                    dailyForecast[date].count += 1;
                });

                const forecastArray = Object.keys(dailyForecast).map((date) => ({
                    date,
                    avgTemp: (dailyForecast[date].tempSum / dailyForecast[date].count).toFixed(1),
                    description: dailyForecast[date].description,
                }));

                setForecastData(forecastArray);
            } catch (error) {
                setError("Could not fetch weather data");
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();

        const interval = setInterval(fetchWeather, 300000);
        return () => clearInterval(interval);
    }, [city, isCelsius]);

    if (loading) return <p>Loading weather data for {city}...</p>;
    if (error) return <p>{error}</p>;

    const iconUrl = weatherData ? `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png` : '';

    // Determine background gradient based on weather condition
    const getBackgroundGradient = () => {
        const condition = weatherData.weather[0].main.toLowerCase();
        switch (condition) {
            case 'clear':
                return 'linear-gradient(to top, #89CFF0, #FFD700)'; // Clear: Light blue to gold
            case 'rain':
                return 'linear-gradient(to top, #5f9ea0, #1c1c1c)'; // Rainy: Dark teal to charcoal
            case 'clouds':
                return 'linear-gradient(to top, #d3d3d3, #a9a9a9)'; // Cloudy: Light gray to dark gray
            case 'snow':
                return 'linear-gradient(to top, #e6e9f0, #f0f4f8)'; // Snowy: Very light blue to white
            default:
                return 'linear-gradient(to top, #cfd9df, #e2ebf0)'; // Default: Neutral gradient
        }
    };

    return (
        <div
            className="weather-card"
            style={{
                background: getBackgroundGradient(),
                color: '#fff',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                transition: 'background 0.5s ease-in-out'
            }}
        >
            <h3>{city}</h3>
            {weatherData && <img src={iconUrl} alt="Weather icon" />}
            <p>Temperature: {latestForecastTemp}°{isCelsius ? 'C' : 'F'}</p>
            <p>Weather: {weatherData?.weather[0].description}</p>
            <p>Humidity: {weatherData?.main.humidity}%</p>
            <p>Wind Speed: {weatherData?.wind.speed} {isCelsius ? 'm/s' : 'mph'}</p>
            <button onClick={onRemove}>Remove</button>

            <h4>5-Day Forecast (Average Temperature):</h4>
            <div className="weather-forecast">
                {forecastData.map((day, index) => (
                    <div key={index} className="forecast-item">
                        <p>{day.date}</p>
                        <p>{day.description}</p>
                        <p>Avg Temp: {day.avgTemp}°{isCelsius ? 'C' : 'F'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WeatherCard;
