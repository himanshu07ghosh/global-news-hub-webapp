import { useEffect, useState } from 'react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi';
import './WeatherWidget.css';

// Dehradun coordinates (default location per project brief)
const DEFAULT_LOCATION = { name: 'Dehradun', lat: 30.3165, lon: 78.0322 };

// Open-Meteo is a free weather API that requires NO API key, so the
// dashboard works out of the box without any .env configuration.
const WEATHER_CODE_MAP = {
  0: { label: 'Clear Sky', Icon: WiDaySunny },
  1: { label: 'Mostly Clear', Icon: WiDaySunny },
  2: { label: 'Partly Cloudy', Icon: WiCloudy },
  3: { label: 'Overcast', Icon: WiCloudy },
  45: { label: 'Foggy', Icon: WiFog },
  48: { label: 'Foggy', Icon: WiFog },
  51: { label: 'Light Drizzle', Icon: WiRain },
  61: { label: 'Rain', Icon: WiRain },
  63: { label: 'Moderate Rain', Icon: WiRain },
  65: { label: 'Heavy Rain', Icon: WiRain },
  71: { label: 'Snow', Icon: WiSnow },
  80: { label: 'Rain Showers', Icon: WiRain },
  95: { label: 'Thunderstorm', Icon: WiThunderstorm },
};

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('loading');
  const [location, setLocation] = useState(DEFAULT_LOCATION);

  // 🔥 NEW: Function to fetch location name from coordinates
  const fetchLocationName = async (lat, lon) => {
    try {
      // Using OpenStreetMap's Nominatim API (free, no key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&accept-language=en`
      );
      const data = await response.json();
      
      if (data && data.address) {
        // Get city, town, village, or state
        const city = data.address.city || 
                     data.address.town || 
                     data.address.village || 
                     data.address.state_district ||
                     data.address.state ||
                     'Unknown Location';
        return city;
      }
      return 'Unknown Location';
    } catch (error) {
      console.error('Error fetching location name:', error);
      return 'Your Location';
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          // 🔥 NEW: Fetch actual city name using reverse geocoding
          const cityName = await fetchLocationName(latitude, longitude);
          setLocation({ 
            name: cityName, 
            lat: latitude, 
            lon: longitude 
          });
        },
        () => {
          // Silently fall back to Dehradun if permission is denied
          setLocation(DEFAULT_LOCATION);
        },
        { timeout: 5000 }
      );
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchWeather() {
      try {
        setStatus('loading');
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
        const res = await fetch(url);
        const data = await res.json();
        if (!cancelled) {
          setWeather(data);
          setStatus('success');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    }
    fetchWeather();
    return () => {
      cancelled = true;
    };
  }, [location]);

  if (status === 'loading') {
    return (
      <div className="weather-widget weather-widget--loading">
        <div className="skeleton" style={{ width: '100%', height: 120 }} />
      </div>
    );
  }

  if (status === 'error' || !weather) {
    return null;
  }

  const code = weather.current?.weather_code;
  const info = WEATHER_CODE_MAP[code] || { label: 'Clear', Icon: WiDaySunny };
  const Icon = info.Icon;

  return (
    <div className="weather-widget">
      <div className="weather-widget__main">
        <Icon size={54} />
        <div>
          <div className="weather-widget__temp">{Math.round(weather.current?.temperature_2m)}°C</div>
          <div className="weather-widget__label">{info.label}</div>
        </div>
      </div>
      {/* 🔥 UPDATED: Shows actual city name instead of "Your Location" */}
      <div className="weather-widget__location">{location.name}</div>
      <div className="weather-widget__details">
        <span>Humidity: {weather.current?.relative_humidity_2m}%</span>
        <span>Wind: {Math.round(weather.current?.wind_speed_10m)} km/h</span>
      </div>
      {weather.daily && (
        <div className="weather-widget__forecast">
          {weather.daily.time.slice(0, 5).map((day, i) => (
            <div key={day} className="weather-widget__forecast-day">
              <span>{new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span className="weather-widget__forecast-temp">
                {Math.round(weather.daily.temperature_2m_max[i])}° / {Math.round(weather.daily.temperature_2m_min[i])}°
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeatherWidget;