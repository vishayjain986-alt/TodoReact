// Importing the tools we need:
// - React and useEffect for building the component and handling side effects (like fetching data)
// - useDispatch and useSelector from react-redux to connect to the Redux store
// - fetchWeather action from taskSlice to grab weather data
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeather } from "../store/taskSlice";

// Weather component: Displays the current weather for the user's location
const Weather = () => {
  // Grab weather data from the Redux store
  const weather = useSelector((state) => state.weather);
  // Get the city name from the store
  const city = useSelector((state) => state.city);
  // Check if the weather data is still being fetched
  const isLoading = useSelector((state) => state.isLoading);
  // Pull any error messages from the store
  const error = useSelector((state) => state.error);
  // Get the dispatch function to trigger actions (like fetching weather)
  const dispatch = useDispatch();

  // When the component loads, fetch the weather data
  useEffect(() => {
    dispatch(fetchWeather()); // This kicks off the weather fetch action
  }, [dispatch]); // Dependency array includes dispatch (it won’t change, but it’s a good habit)

  // If the data is still loading, show a spinner and a message
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 text-gray-400">
        {/* A spinning SVG to show something’s happening */}
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400"
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
        Loading weather... {/* Let the user know we’re working on it */}
      </div>
    );
  }

  // If there’s an error (like no location access), show an error message
  if (error) {
    return (
      <div className="text-center text-red-400 p-4">
        Error loading weather: {error} {/* Display the error */}
        {/* Add a helpful tip if the error is about geolocation */}
        {error.includes("geolocation") &&
          " - Please allow location access or check your connection"}
      </div>
    );
  }

  // If everything’s ready, show the weather details
  return (
    <div className="bg-gradient-to-r from-blue-700 to-purple-800 text-white rounded-lg p-4 mb-6 shadow-md flex items-center justify-between">
      {/* Left side: weather icon, city, and temp */}
      <div className="flex items-center">
        {/* Show the weather icon if we have the data */}
        {weather && weather.condition && (
          <img
            src={weather.condition.icon} // Icon URL from the weather API
            alt={weather.condition.text} // Alt text for accessibility
            className="w-12 h-12 mr-3" // Size and spacing
          />
        )}
        <div>
          {/* Show the city name if we have it, otherwise just say "Weather" */}
          <h3 className="font-medium">
            {city ? `${city} Weather` : "Weather"}
          </h3>
          {/* Display the temperature in Celsius, or a dash if no data */}
          <p className="text-xl font-bold">
            {weather ? `${weather.temp_c}°C` : "-"}
          </p>
        </div>
      </div>
      {/* Right side: weather condition and "feels like" temp */}
      <div className="text-right">
        {/* Show the condition (e.g., "Sunny") if available */}
        <p className="text-sm opacity-90">
          {weather && weather.condition ? weather.condition.text : ""}
        </p>
        {/* Show the "feels like" temp, or a dash if no data */}
        <p className="text-xs opacity-75">
          Feels like: {weather ? `${weather.feelslike_c}°C` : "-"}
        </p>
      </div>
    </div>
  );
};

// Export the component so it can be used in other parts of the app
export default Weather;
