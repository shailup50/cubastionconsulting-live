import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBlogData = createAsyncThunk(
  "blog/fetchBlogData",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/portfolios/type/Blog`,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const initialState = {
  blogData: null,
  blogError: null,
  blogLoading: false,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogData.pending, (state) => {
        state.blogLoading = true;
      })
      .addCase(fetchBlogData.fulfilled, (state, action) => {
        state.blogLoading = false;
        state.blogData = action.payload.data;
      })
      .addCase(fetchBlogData.rejected, (state, action) => {
        state.blogLoading = false;
        state.blogError = action.payload;
      });
  },
});

export default blogSlice.reducer;
