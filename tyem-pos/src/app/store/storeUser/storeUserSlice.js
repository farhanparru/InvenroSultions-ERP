import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { WEBSITE_API_URL } from "../../config";

const initialState = {
  data: [],
  isSuccess: false,
  message: "",
  loading: false,
};

export const saveStoreUser = createAsyncThunk("user/login", (arg) => {
  try {
    const data = arg;

    console.log(arg, "args");
    return data;
  } catch (error) {}
});

const storeUserSlice = createSlice({
  name: "store_user",
  initialState: initialState,
  reducers: {
    logoutVendor: (state) => {
      state.data = [];
    },
  },
  extraReducers: {
    [saveStoreUser.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [saveStoreUser.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.data = payload;
      state.isSuccess = true;
    },
    [saveStoreUser.rejected]: (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    },
  },
});

export const { logoutVendor} = storeUserSlice.actions;

export const getStoreUserData = (state) => state.store_user.data;

export default storeUserSlice.reducer;
