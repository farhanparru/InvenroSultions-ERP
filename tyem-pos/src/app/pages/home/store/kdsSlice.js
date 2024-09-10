import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { WEBSITE_API_URL } from "../../../config";

const initialState = {
  kdsOrdersList: [],
  recallList: [],
};

export const getKdsOrders = createAsyncThunk("home/get-kds-orders", (token) => {
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  return axios
    .post(
      WEBSITE_API_URL + "/get-kds-orders",
      {},
      {
        headers
      }
    )
    .then((data) => data.data)
    .catch((error) => console.log(error));
});

export const closeKdsOrder = createAsyncThunk(
  "home/view-new-orders",
  (data) => {
    const headers = {
      "Authorization": `Bearer ${data.token}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    return axios
      .post(
        WEBSITE_API_URL + "/update-kds-order",
        {
          order_id: data.id,
        },
        {
          headers
        }
      )
      .then((data) => data.data)
      .catch((error) => console.log(error));
  }
);

export const recallClosedOrder = createAsyncThunk(
  "home/recall-closed-order",
  (data) => {
    const headers = {
      "Authorization": `Bearer ${data.token}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    return axios
      .post(
        WEBSITE_API_URL + "/recall-kds-order",
        {
          order_id: data.id,
        },
        {
           headers: headers 
        }
      )
      .then((data) => data.data)
      .catch((error) => console.log(error));
  }
);
export const kdsSlice = createSlice({
  name: "kds",
  initialState: initialState,
  reducers: {
    removeKdsOrder: (state, action) => {
      const { kdsOrdersList } = state;
      const { id } = action.payload;
      const item = kdsOrdersList.find((item) => item.id === id);

      if (item) {
        const index = kdsOrdersList.indexOf(item);
        kdsOrdersList.splice(index, 1);
      }
    },
    pushToRecallList: (state, action) => {
      const { kdsOrdersList } = state;

      const item = state.recallList.find(
        (item) => item.id === action.payload.id
      );
      if (!item) {
        state.recallList.push(action.payload);
      }
    },
    recallSingleItem: (state, action) => {
      const { kdsOrdersList } = state;
      if (state.recallList.length > 0) {
        const lastDeleted = state.recallList[state.recallList.length - 1];
        state.recallList = [...state.recallList];
        state.kdsOrdersList = [lastDeleted, ...state.recallList];
        state.recallList.splice(state.recallList.length - 1, 1);
        console.log(state.kdsOrdersList.length);
      } else {
        console.log("empty recall list");
      }
    },
  },
  extraReducers: {
    [getKdsOrders.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [getKdsOrders.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.kdsOrdersList = payload.success ? payload?.data?.orders : [];
      state.isSuccess = true;
    },
    [getKdsOrders.rejected]: (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    },
  },
});

export const { removeKdsOrder, pushToRecallList, recallSingleItem } =
  kdsSlice.actions;

export const getKdsOrdersList = (state) => state.kdsOrdersList;
export default kdsSlice.reducer;
