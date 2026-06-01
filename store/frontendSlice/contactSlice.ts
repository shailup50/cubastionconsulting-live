import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { ContactState } from "@/types/store";
import type { ApiSuccessResponse } from "@/types/api";
import type { ContactUs } from "@/types/entities";
import type { HeaderData } from "@/types/composites";

export const createContactData = createAsyncThunk(
  "contact/createContactData",
  async (formData: Partial<ContactUs>, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<ApiSuccessResponse<ContactUs>>(
        `${process.env.NEXT_PUBLIC_API_URL}/contact-us`,
        formData,
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchIndustries = createAsyncThunk(
  "contact/fetchIndustries",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<ApiSuccessResponse<HeaderData>>(
        `${process.env.NEXT_PUBLIC_API_URL}/header-data`,
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const initialState: ContactState = {
  contactData: null,
  industriesList: null,
  contactError: null,
  contactLoading: false,
  industriesLoading: false,
  industriesError: null,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createContactData.pending, (state) => {
        state.contactLoading = true;
      })
      .addCase(createContactData.fulfilled, (state, action) => {
        state.contactLoading = false;
        state.contactData = action.payload.data;
      })
      .addCase(createContactData.rejected, (state, action) => {
        state.contactLoading = false;
        state.contactError = action.payload as string;
      })

      .addCase(fetchIndustries.pending, (state) => {
        state.industriesLoading = true;
      })
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.industriesLoading = false;
        state.industriesList = action.payload.data.industries as any;
      })
      .addCase(fetchIndustries.rejected, (state, action) => {
        state.industriesLoading = false;
        state.industriesError = action.payload as string;
      })
  },
});

export default contactSlice.reducer;
