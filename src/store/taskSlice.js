// Importing dependencies from Redux Toolkit and Axios
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initialize savedTasks from localStorage for persistent task data
let savedTasks = [];
try {
  // Retrieve tasks from localStorage
  const tasksJson = localStorage.getItem("tasks");
  // Parse JSON string to array, default to empty array if null
  savedTasks = tasksJson ? JSON.parse(tasksJson) : [];
  // Ensure savedTasks is an array, reset to empty array if not
  if (!Array.isArray(savedTasks)) savedTasks = [];
} catch (e) {
  // Log error if parsing fails and default to empty array
  console.error("Failed to parse tasks:", e);
  savedTasks = [];
}

// Initialize authentication status from localStorage
let savedIsAuthenticated = false;
try {
  // Retrieve authentication status from localStorage
  const authJson = localStorage.getItem("isAuthenticated");
  // Parse JSON to boolean, default to false if null
  savedIsAuthenticated = authJson ? JSON.parse(authJson) : false;
} catch (e) {
  // Log error if parsing fails and default to false
  console.error("Failed to parse authentication status:", e);
  savedIsAuthenticated = false;
}

// Define an async thunk to fetch weather data based on user's location
export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather", // Unique action type string
  async (_, { rejectWithValue }) => {
    try {
      // Get user's geolocation asynchronously
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      // Extract latitude and longitude from position
      const { latitude, longitude } = position.coords;

      // Fetch weather data from OpenWeatherMap API using coordinates
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=6cb562664f9fac9ad447922c6de72fc3&units=metric`
      );

      // Return structured weather data
      return {
        city: response.data.name, // City name from API response
        temp_c: response.data.main.temp, // Temperature in Celsius
        feelslike_c: response.data.main.feels_like, // Feels-like temperature
        condition: {
          text: response.data.weather[0].description, // Weather description
          icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`, // Weather icon URL
        },
      };
    } catch (error) {
      // Log initial weather fetch error
      console.error("Weather fetch error:", error);
      try {
        // Fallback to London weather if geolocation fails
        const fallbackResponse = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=6cb562664f9fac9ad447922c6de72fc3&units=metric"
        );
        // Return structured weather data for London
        return {
          city: "London",
          temp_c: fallbackResponse.data.main.temp,
          feelslike_c: fallbackResponse.data.main.feels_like,
          condition: {
            text: fallbackResponse.data.weather[0].description,
            icon: `http://openweathermap.org/img/wn/${fallbackResponse.data.weather[0].icon}@2x.png`,
          },
        };
      } catch (fallbackError) {
        // Reject with error message if both attempts fail
        return rejectWithValue(error.message || "Failed to fetch weather data");
      }
    }
  }
);

// Create a Redux slice to manage tasks and weather state
const taskSlice = createSlice({
  name: "tasks", // Slice name for identification
  initialState: {
    tasks: savedTasks, // Array of tasks loaded from localStorage
    weather: null, // Weather data object, initially null
    city: null, // City name, initially null
    isAuthenticated: savedIsAuthenticated, // Authentication status from localStorage
    isLoading: false, // Loading state for async operations
    error: null, // Error message for failed operations
  },
  reducers: {
    // Reducer to add a new task
    addTask: (state, action) => {
      state.tasks.push({
        id: Date.now(), // Unique ID based on timestamp
        text: action.payload, // Task description from action payload
        completed: false, // Initial completion status
        createdAt: new Date().toISOString(), // Creation timestamp
        priority: "none", // Default priority
      });
    },
    // Reducer to toggle a task's completion status
    toggleTask: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) task.completed = !task.completed; // Flip completion status if task exists
    },
    // Reducer to delete a task
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload); // Remove task by ID
    },
    // Reducer to set a task's priority
    setPriority: (state, action) => {
      const { taskId, priority } = action.payload;
      const task = state.tasks.find((task) => task.id === taskId);
      if (task) task.priority = priority;
    },
    // Reducer to log in (set authenticated state)
    login: (state) => {
      state.isAuthenticated = true;
    },
    // Reducer to log out (clear tasks and authentication)
    logout: (state) => {
      state.isAuthenticated = false;
      state.tasks = []; // Clear all tasks on logout
    },
  },
  extraReducers: (builder) => {
    // Handle async weather fetch states
    builder
      // When weather fetch is pending
      .addCase(fetchWeather.pending, (state) => {
        state.isLoading = true; // Indicate loading state
        state.error = null; // Clear any previous errors
      })
      // When weather fetch succeeds
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.weather = {
          temp_c: action.payload.temp_c,
          feelslike_c: action.payload.feelslike_c,
          condition: action.payload.condition,
        }; // Update weather data
        state.city = action.payload.city; // Update city name
        state.isLoading = false; // Reset loading state
      })
      // When weather fetch fails
      .addCase(fetchWeather.rejected, (state, action) => {
        state.isLoading = false; // Reset loading state
        state.error = action.payload || "Failed to fetch weather"; // Set error message
      });
  },
});

// Export action creators for use in components
export const { addTask, toggleTask, deleteTask, setPriority, login, logout } =
  taskSlice.actions;

// Export the reducer to be included in the Redux store
export default taskSlice.reducer;
