import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AdminAuthState } from "@/types/store";
import type { User } from "@/types/entities";

const initialState: AdminAuthState = {
  adminUser: null,
  isLoggedIn: false,
  token: null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminUser(state, action: PayloadAction<Pick<User, "loginID" | "UserName">>) {
      state.adminUser = action.payload;
      state.isLoggedIn = true;
    },
    setToken(state, action: PayloadAction<string | null>) {
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
