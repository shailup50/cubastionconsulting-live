import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { CaseState } from "@/types/store";

export const fetchCaseData = createAsyncThunk(
  "case/fetchCaseData",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/portfolios/type/CaseStudy`,
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const initialState: CaseState = {
  caseData: null,
  caseError: null,
  caseLoading: false,
};

const caseSlice = createSlice({
  name: "case",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCaseData.pending, (state) => {
        state.caseLoading = true;
      })
      .addCase(fetchCaseData.fulfilled, (state, action) => {
        state.caseLoading = false;
        state.caseData = action.payload.data;
      })
      .addCase(fetchCaseData.rejected, (state, action) => {
        state.caseLoading = false;
        state.caseError = action.payload as string;
      });
  },
});

export default caseSlice.reducer;
