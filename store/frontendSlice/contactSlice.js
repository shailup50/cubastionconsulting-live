import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const createContactData = createAsyncThunk(
  "contact/createContactData",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/contact-us`,
        formData,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchIndustries = createAsyncThunk(
  "contact/fetchIndustries",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/header-data`,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const initialState = {
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
        state.contactError = action.payload;
      })

      .addCase(fetchIndustries.pending, (state) => {
        state.industriesLoading = true;
      })
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.industriesLoading = false;
        state.industriesList = action.payload.data.industries;
      })
      .addCase(fetchIndustries.rejected, (state, action) => {
        state.industriesLoading = false;
        state.industriesError = action.payload;
      })
  },
});

export default contactSlice.reducer;
