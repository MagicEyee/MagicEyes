import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./reducers/AuthSlice.js";

export const store = configureStore({
  reducer: {
    auth: AuthSlice,
  },
});
