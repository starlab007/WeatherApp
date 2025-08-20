import { useState } from "react";
import { MapPin  } from "lucide-react";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);

    if (!API_KEY) {
      console.error("API Key is missing!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        setError("City not found ❌");
        setLoading(false);
        return;
      }
      setWeather(data);

      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data2 = await res2.json();
      setForecast(data2);
    } catch (err) {
      setError("Something went wrong");
    }
    setLoading(false);
  };

  const getLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Current weather
          const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          const weatherData = await weatherRes.json();
          setWeather(weatherData);

          // 5-day forecast
          const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          const forecastData = await forecastRes.json();
          setForecast(forecastData);
        } catch (err) {
          setError("Unable to fetch weather data");
        }
      });
    } else {
      setError("Geolocation not supported by this browser.");
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500
                        ${
                          darkMode
                            ? "bg-gradient-to-br from-gray-900 to-black"
                            : "bg-gradient-to-br from-blue-900 to-blue-400"
                        }`}
      >
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`absolute top-4 right-4 px-4 py-2 rounded-lg shadow transition-colors duration-300
    ${
      darkMode
        ? "bg-gray-800 text-blue-400" // Dark mode: dark bg, blue text
        : "bg-blue-600 text-white" // Light mode: blue bg, white text
    }`}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <div className="min-h-screen w-screen flex flex-col items-center justify-start p-6">
          <div className="w-full max-w-4xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                🌤 Weather Forecast
              </h1>
              <p className="text-white/80">
                Get real-time weather updates for any city
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex">
              <div className="flex w-full max-w-md mx-auto mb-8 shadow-lg">
                <input
                  type="text"
                  placeholder="Enter city name..."
                  className={`flex-1 px-4 py-3 rounded-l-lg outline-none
                           ${
                             darkMode
                               ? "bg-gray-700 text-white placeholder-gray-300"
                               : "bg-white text-gray-700 placeholder-gray-500"
                           }`}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && getWeather()}
                />
                <button
                  onClick={getWeather}
                  disabled={loading}
                  className={`px-6 py-3  font-bold transition-all flex items-center justify-center
                           ${
                             darkMode
                               ? "bg-gray-800 text-white hover:bg-gray-700 rounded-r-lg rounded-l-none"
                               : "bg-yellow-400 text-white hover:bg-yellow-500 rounded-r-lg rounded-l-none"
                           }`}
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Search"
                  )}
                </button>

                <button
                  onClick={getLocationWeather}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition
      ${
        darkMode
          ? "bg-green-700 text-white hover:bg-green-600"
          : "bg-green-500 text-white hover:bg-green-600"
      }`}
                >
                  <MapPin size={20} /> {/* 🎯 location/gps icon */}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className={`p-4 mb-6 rounded max-w-md mx-auto
                              ${
                                darkMode
                                  ? "bg-red-800 text-white"
                                  : "bg-red-100 text-red-700"
                              }`}
              >
                <p>{error}</p>
              </div>
            )}

            {/* Current Weather */}
            {weather && !error && (
              <div
                className={`rounded-xl p-6 mb-8 shadow-2xl transform transition-all duration-300 hover:scale-[1.01]
                               ${
                                 darkMode
                                   ? "bg-gray-700/30 text-white"
                                   : "bg-white/20 text-white"
                               }`}
              >
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <h2 className="text-3xl font-bold">
                      {weather.name}, {weather.sys.country}
                    </h2>
                    <p className="text-xl opacity-90">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-2xl mt-2 capitalize">
                      {weather.weather[0].description}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                      alt="weather icon"
                      className="w-24 h-24"
                    />
                    <p className="text-6xl font-bold ml-2">
                      {Math.round(weather.main.temp)}°C
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {[
                    {
                      label: "Feels Like",
                      value: `${Math.round(weather.main.feels_like)}°C`,
                    },
                    { label: "Humidity", value: `${weather.main.humidity}%` },
                    {
                      label: "Wind",
                      value: `${Math.round(weather.wind.speed * 3.6)} km/h`,
                    },
                    {
                      label: "Pressure",
                      value: `${weather.main.pressure} hPa`,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg"
                      style={{
                        backgroundColor: darkMode
                          ? "rgba(55,65,81,0.5)"
                          : "rgba(255,255,255,0.1)",
                      }}
                    >
                      <p className="text-sm opacity-80">{item.label}</p>
                      <p className="text-xl font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Forecast */}
            {forecast && !error && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  5-Day Forecast
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                  {forecast.list
                    .filter((item) => item.dt_txt.includes("12:00:00"))
                    .map((day, i) => (
                      <div
                        key={i}
                        className="rounded-xl p-4 text-center shadow-lg transform transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: darkMode
                            ? "rgba(55,65,81,0.5)"
                            : "rgba(255,255,255,0.1)",
                        }}
                      >
                        <p className="font-bold text-lg">
                          {new Date(day.dt_txt).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </p>
                        <p className="text-sm opacity-80">
                          {new Date(day.dt_txt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <img
                          src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                          alt="forecast icon"
                          className="mx-auto my-2 w-16 h-16"
                        />
                        <div className="flex justify-center gap-4 mt-2">
                          <p className="font-bold text-xl">
                            {Math.round(day.main.temp)}°C
                          </p>
                          <p className="text-sm opacity-80 self-center">
                            ({day.weather[0].main})
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                          <div>
                            <p className="opacity-70">Min</p>
                            <p>{Math.round(day.main.temp_min)}°C</p>
                          </div>
                          <div>
                            <p className="opacity-70">Max</p>
                            <p>{Math.round(day.main.temp_max)}°C</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
