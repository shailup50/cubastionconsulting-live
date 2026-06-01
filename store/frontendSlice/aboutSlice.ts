import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { AboutState } from "@/types/store";

export const fetchAboutData = createAsyncThunk(
  "about/fetchAboutData",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/about-us-data`,
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const initialState: AboutState = {
  aboutData: null,
  aboutError: null,
  aboutLoading: false,
};

const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutData.pending, (state) => {
        state.aboutLoading = true;
      })
      .addCase(fetchAboutData.fulfilled, (state, action) => {
        state.aboutLoading = false;
        state.aboutData = action.payload.data;
      })
      .addCase(fetchAboutData.rejected, (state, action) => {
        state.aboutLoading = false;
        state.aboutError = action.payload as string;
      });
  },
});

export default aboutSlice.reducer;
