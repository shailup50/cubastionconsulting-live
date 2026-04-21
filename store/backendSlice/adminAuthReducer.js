import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminUser: null,
  isLoggedIn: false,
  token: null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminUser(state, action) {
      state.adminUser = action.payload;
      state.isLoggedIn = true;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    clearAdminUser(state) {
      state.adminUser = null;
      state.isLoggedIn = false;
      state.token = null;
    },
  },
});

export const { setAdminUser, clearAdminUser, setToken } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
