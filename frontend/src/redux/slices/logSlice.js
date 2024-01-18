import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  isLogged: false,
};

const logSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loggedIn: (state, action) => {
      state.user = action.payload;
      state.isLogged = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    loggedOut: (state, action) => {
      state.user = null 
      state.isLogged = false
      localStorage.removeItem("user")
    },
  },
});

export const { loggedIn, loggedOut } = logSlice.actions;
export default logSlice.reducer;
