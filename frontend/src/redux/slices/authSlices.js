


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    loginSuccess: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});




export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
