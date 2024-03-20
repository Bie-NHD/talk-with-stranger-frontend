import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import toastReducer from "./toastSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
