import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { HomeState } from "@/types/store";
import type { ApiSuccessResponse } from "@/types/api";
import type { HomeData } from "@/types/composites";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "https://cubastionconsulting.com/api/v1";

export const fetchHomeData = createAsyncThunk(
  "home/fetchHomeData",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<ApiSuccessResponse<HomeData>>(
        `${apiUrl}/home-data`,
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchIndustryCard = createAsyncThunk(
  "home/fetchIndustryCard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${apiUrl}/service-categories`,
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const initialState: HomeState = {
  homeData: null,
  error: null,
  loading: false,
  industryData: null,
  industryDataLoading: false,
  industryDataError: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.homeData = action.payload.data;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchIndustryCard.pending, (state) => {
        state.industryDataLoading = true;
      })
      .addCase(fetchIndustryCard.fulfilled, (state, action) => {
        state.industryDataLoading = false;
        state.industryData = action.payload.data;
      })
      .addCase(fetchIndustryCard.rejected, (state, action) => {
        state.industryDataLoading = false;
        state.industryDataError = action.payload as string;
      });
  },
});

export default homeSlice.reducer;
