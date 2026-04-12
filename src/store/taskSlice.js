import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

// Async thunk to fetch weather data based on user's location
export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (_, { rejectWithValue }) => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=6cb562664f9fac9ad447922c6de72fc3&units=metric`
      );

      return {
        city: response.data.name,
        temp_c: response.data.main.temp,
        feelslike_c: response.data.main.feels_like,
        condition: {
          text: response.data.weather[0].description,
          icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
        },
      };
    } catch (error) {
      console.error("Weather fetch error:", error);
      try {
        const fallbackResponse = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=6cb562664f9fac9ad447922c6de72fc3&units=metric"
        );
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
        return rejectWithValue(error.message || "Failed to fetch weather data");
      }
    }
  }
);

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, { getState }) => {
  const state = getState();
  if (!state.user) return [];
  const q = query(collection(db, "tasks"), where("userId", "==", state.user.uid));
  const querySnapshot = await getDocs(q);
  const tasks = [];
  querySnapshot.forEach((doc) => {
    tasks.push({ id: doc.id, ...doc.data() });
  });
  return tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
});

export const addTask = createAsyncThunk("tasks/addTask", async (text, { getState }) => {
  const state = getState();
  const userId = state.user?.uid;
  const taskData = {
    text,
    completed: false,
    createdAt: new Date().toISOString(),
    priority: "none",
    userId,
  };
  const docRef = await addDoc(collection(db, "tasks"), taskData);
  return { id: docRef.id, ...taskData };
});

export const toggleTask = createAsyncThunk("tasks/toggleTask", async (taskId, { getState }) => {
  const state = getState();
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task) throw new Error("Task not found");
  
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, { completed: !task.completed });
  return taskId;
});

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (taskId) => {
  const taskRef = doc(db, "tasks", taskId);
  await deleteDoc(taskRef);
  return taskId;
});

export const setPriority = createAsyncThunk("tasks/setPriority", async ({ taskId, priority }) => {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, { priority });
  return { taskId, priority };
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    weather: null,
    city: null,
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    setUserLoggedOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.tasks = [];
    },
    setUserLoggedIn: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Weather
      .addCase(fetchWeather.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.weather = {
          temp_c: action.payload.temp_c,
          feelslike_c: action.payload.feelslike_c,
          condition: action.payload.condition,
        };
        state.city = action.payload.city;
        state.isLoading = false;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch weather";
      })
      // Fetch Tasks
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      // Add Task
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      // Toggle Task
      .addCase(toggleTask.fulfilled, (state, action) => {
        const task = state.tasks.find((task) => task.id === action.payload);
        if (task) task.completed = !task.completed;
      })
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      // Set Priority
      .addCase(setPriority.fulfilled, (state, action) => {
        const { taskId, priority } = action.payload;
        const task = state.tasks.find((task) => task.id === taskId);
        if (task) task.priority = priority;
      });
  },
});

export const { setUserLoggedOut, setUserLoggedIn } = taskSlice.actions;

export default taskSlice.reducer;
