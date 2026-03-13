import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./taskSlice";

export const store = configureStore({
  reducer: taskReducer,
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("tasks", JSON.stringify(state.tasks));
  localStorage.setItem(
    "isAuthenticated",
    JSON.stringify(state.isAuthenticated)
  );
});
