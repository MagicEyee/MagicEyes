import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false,
  user: null,
  token: null,
  isAdmin: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.loggedIn = true;
      state.user = action.payload.data;
      state.token = action.payload.token;
      state.isAdmin = action.payload.data.isAdmin;
      state.opendash = false;
    },
    logoutUser: (state) => {
      state.loggedIn = false;
      state.user = null;
      state.token = null;
      state.isAdmin = null;
    },
    Opendash: (state, action) => {
      state.opendash = true;
    },
    closedash: (state, action) => {
      state.opendash = false;
    },
  },
});

export const { setUser, logoutUser, BeAdmin, BeUser } = authSlice.actions;

export default authSlice.reducer;
