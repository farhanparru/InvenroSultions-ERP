import { createSlice } from "@reduxjs/toolkit";

import _ from "lodash";

const initialState = {
  holdCartList: [],
};

export const holdCartSlice = createSlice({
  name: "holdCart",
  initialState: initialState,
  reducers: {
    addHoldCart: (state, action) => {
      const { holdCartList } = state;
      const holdCart = action.payload;

      holdCart.id = crypto.randomUUID();
      holdCartList.push(holdCart);
      state.holdCartList = holdCartList.reverse();
    },
    removeHoldCart: (state, action) => {
      const { holdCartList } = state;

      const { holdCartItem } = action.payload;
      const item = holdCartList.find((item) => item.id === holdCartItem.id);
      console.log(item);

      if (item) {
        const index = holdCartList.indexOf(item);
        holdCartList.splice(index, 1);
      }
    },
  },
});

export const { addHoldCart, removeHoldCart } = holdCartSlice.actions;

export const getHoldCartList = (state) => state.holdCart.holdCartList;

export default holdCartSlice.reducer;
