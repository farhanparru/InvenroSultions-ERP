import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { WEBSITE_API_URL } from "../../config";

export const getItemCategories = createAsyncThunk("items/getData", (arg) => {
  try {
    const data = axios.post(
      WEBSITE_API_URL + "/get-item-categories",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    return data;
  } catch (error) {}
});

const itemsSlice = createSlice({
  name: "items",
  initialState: {
    data: [],
    isSuccess: false,
    message: "",
    loading: false,
  },
  reducers: {},
  extraReducers: {
    [getItemCategories.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [getItemCategories.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.data = payload;
      state.isSuccess = true;
    },
    [getItemCategories.rejected]: (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    },
  },
});
export default itemsSlice;
