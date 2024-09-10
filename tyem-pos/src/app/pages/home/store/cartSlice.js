import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderitems: [],
  totalAmount: 0,
  totalAmountWithoutDiscount: 0,
  tax: 0,
  discount: 0,
  amountToBeReturned: 0,
  returnAmountCash: 0,
  totalPayableAmount: 0,
  paymentMethod: "cash",
  discountType: null,
  discountValue: null,
  splitPayment: false,
  splitCash: 0,
  splitCard: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,

  reducers: {
    addToCart: (state, action) => {
      const { id, type, name, price, quantity: newQuantity } = action.payload;
      let currentTotal = state.totalAmount;
    
      // Find if the item already exists in the cart
      const existingItem = state.orderitems.find((item) => item.id === id);
    
      if (existingItem) {
        if (type === 'increase') {
          existingItem.quantity += 1;
          existingItem.totalPrice = (existingItem.price * existingItem.quantity).toFixed(2);
          currentTotal += parseFloat(existingItem.price);
        } else if (type === 'decrease') {
          if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
            existingItem.totalPrice = (existingItem.price * existingItem.quantity).toFixed(2);
            currentTotal -= parseFloat(existingItem.price);
          } else {
            state.orderitems = state.orderitems.filter((item) => item.id !== id);
            currentTotal -= parseFloat(existingItem.price);
          }
        } else if (type === 'set' && newQuantity > 0) {
          existingItem.quantity = newQuantity;
          existingItem.totalPrice = (existingItem.price * existingItem.quantity).toFixed(2);
          currentTotal += parseFloat(existingItem.price) * (newQuantity - 1);
        }
      } else if (type === 'increase') {
        const newItem = {
          id,
          name,
          price,
          quantity: 1,
          totalPrice: parseFloat(price).toFixed(2),
        };
        state.orderitems.push(newItem);
        currentTotal += parseFloat(newItem.price);
      }
    
      // Update state values
      state.totalAmount = currentTotal;
      state.totalAmountWithoutDiscount = currentTotal;
      state.tax = parseFloat((currentTotal * 0.1).toFixed(2));
      state.totalPayableAmount = parseFloat((currentTotal + state.tax - state.discount).toFixed(2));
    },
    
    
    
    removeFromCart: (state, action) => {
      const { orderitems, totalAmount } = state;

      console.log(orderitems, "orderitemsorderitemsorderitems");

      const { id, isRemoveAll } = action.payload;
      const item = orderitems.find((item) => item.id === id && item.variation_id === action.payload.variation_id);
      let currentTotal = totalAmount;
      if (item) {
        if (isRemoveAll) {
          currentTotal -= item.totalPrice;
          const index = orderitems.indexOf(item);
          orderitems.splice(index, 1);
          if (orderitems.length === 0) {
            currentTotal = 0;
          }
          state.tax = parseFloat((currentTotal * 0.1).toFixed(3));
        } else {
          item.quantity -= 1;
          let totalPrice = 0;
          item.totalPrice = (item.price * item.quantity).toFixed(3);
          currentTotal -= item.price;
          if (item.quantity === 0) {
            const index = orderitems.indexOf(item);
            orderitems.splice(index, 1);
            if (orderitems.length === 0) {
              currentTotal = 0;
            }
          }
          state.tax = parseFloat((currentTotal * 0.1).toFixed(3));
        }
        state.totalAmount = currentTotal;
        state.totalAmountWithoutDiscount = currentTotal
        state.totalPayableAmount = parseFloat(
          (currentTotal + state.tax - state.discount).toFixed(3)
        );
      }
    },


    // Clear Cart Reducer - THIS WAS MISSING
    clearCart: (state) => {
      state.orderitems = [];
      state.totalAmount = 0;
      state.totalAmountWithoutDiscount = 0;
      state.tax = 0;
      state.discount = 0;
      state.amountToBeReturned = 0;
      state.totalPayableAmount = 0;
      state.paymentMethod = "cash"; 
      state.discountType = null;
      state.discountValue = null;
      state.splitPayment = false;
      state.splitCash = 0;
      state.splitCard = 0;
      state.returnAmountCash = 0;
    },
    
    updateItemNote: (state, action) => {
      const { orderitems } = state;
      const { item_id, variation_id, note } = action.payload;
      const item = orderitems.find(
        (item) => item.id === item_id && item.variation_id === variation_id
      );
      if (item) {
        item.sell_line_note = note;
      }
    },
    updateTotalAmount: (state, action) => {
      state.totalAmount = action.payload;
      state.totalAmountWithoutDiscount = action.payload
    },
    setDiscount: (state, action) => {
      state.discount = action.payload;
    },
    setAmountToBeReturned: (state, action) => {
      state.amountToBeReturned = action.payload.amountToBeReturned;
      state.totalPayableAmount = action.payload.totalPayableAmount;
      state.returnAmountCash = action.payload.returnAmountCash;
      if (action.payload.paymentMethod == 'Split') {
        state.splitPayment = true;
        state.splitCash = action.payload.splitCash;
        state.splitCard = action.payload.splitCard;
      } else {
        state.splitPayment = false;
        state.splitCash = 0;
        state.splitCard = 0;
      }
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    setSingleItemDiscount: (state, action) => {
      const { orderitems, totalAmount, totalPayableAmount } = state;
      const { item_id, discountAmount, variation_id, discountType } =
        action.payload;
      let currentTotal = totalAmount;
      const item = orderitems.find(
        (item) => item.id === item_id && item.variation_id === variation_id
      );
      if (item) {
        let oldTotal = totalAmount;
        if (discountType === "fixed") {
          item.discountType = "fixed";
          item.discountValue = discountAmount;
          item.totalPrice -= discountAmount;
          item.price = item.totalPrice / item.quantity;
          oldTotal = parseFloat(oldTotal) - parseFloat(discountAmount);
        } else {
          item.discountType = "percentage";
          item.discountValue = discountAmount;
          const toReduce = ((item.totalPrice * discountAmount) / 100).toFixed(
            3
          );
          item.totalPrice -= parseFloat(toReduce);
          item.price = item.totalPrice / item.quantity;
          oldTotal = parseFloat(oldTotal) - parseFloat(toReduce);
        }
        currentTotal = oldTotal;
        state.totalAmount = oldTotal;
        state.totalAmountWithoutDiscount = oldTotal
        state.tax = parseFloat((currentTotal * 0.1).toFixed(3));
        state.totalPayableAmount = parseFloat(
          (currentTotal + state.tax - state.discount).toFixed(3)
        );
      }
    },

    setWholeCartDiscount: (state, action) => {
      const { discountType, discountAmount } = action.payload;
      const { totalAmount } = state;
      // if (state.discount > 0) {
      //   state.totalPayableAmount += parseFloat(state.discount);
      // }
      if (discountType == "fixed") {
        state.discountType = "fixed";
        state.discountValue = discountAmount;
        // state.totalAmount -= discountAmount;
        // state.totalAmountWithoutDiscount = discountAmount
        state.discount = discountAmount;
        state.totalPayableAmount -= discountAmount;
      } else {
        state.discountType = "percentage";
        state.discountValue = discountAmount;
        const toReduce = (
          (state.totalAmountWithoutDiscount * discountAmount) /
          100
        ).toFixed(3);
        state.totalPayableAmount -= toReduce;
        state.discount = toReduce;
      }
      state.tax = parseFloat((totalAmount * 0.1).toFixed(3));
    },
    setSelectedAddon: (state, action) => {
      const { orderitems, totalAmount } = state;
      const { item_id, selectedVariation } = action.payload;
      const item = orderitems.find((item) => item.id === item_id);
      if (item) {
        const price = parseFloat(selectedVariation.sell_price_inc_tax).toFixed(3);
        const variation_id = selectedVariation.id;
        const quantity = 1;
        const totalPrice = price * quantity;
        if (item.variation_id != selectedVariation.id) {
          state.totalAmount = parseFloat(totalAmount) - parseFloat(item.totalPrice);
          state.totalAmountWithoutDiscount = parseFloat(totalAmount) - parseFloat(item.totalPrice);
          item.price = price;
          item.totalPrice = totalPrice;
          item.variation_id = variation_id;
          state.totalAmount = parseFloat(state.totalAmount) + parseFloat(item.totalPrice);
          state.totalAmountWithoutDiscount = parseFloat(state.totalAmount) + parseFloat(item.totalPrice);
        }
      }
      state.tax = parseFloat((state.totalAmount * 0.1).toFixed(3));
      state.totalPayableAmount = parseFloat(
        (state.totalAmount + state.tax - state.discount).toFixed(3)
      );
    },

    addFromHoldCart: (state, action) => {
      const { data } = action.payload;
      state.orderitems = data.orderitems;
      state.totalAmount = data.totalAmount;
      state.totalAmountWithoutDiscount = data.totalAmount;
      state.tax = data.tax;
      state.discount = data.discount;
      state.amountToBeReturned = data.amountToBeReturned;
      state.totalPayableAmount = data.totalPayableAmount;
      state.paymentMethod = data.paymentMethod;
      state.discountType = data.discountType;
      state.discountValue = data.discountValue;
      state.splitPayment = data.splitPayment;
      state.splitCash = data.splitCash;
      state.splitCard = data.splitCard;
    },
    // addToTableHistory: (state, action) => {
    //     const { tableCartHistory } = state;
    //     const { orderitems, totalAmount, tax, discount, amountToBeReturned, paymentMethod } = action.payload;
    //     tableCartHistory.push({
    //         orderitems,
    //         totalAmount,
    //         tax,
    //         discount,
    //         amountToBeReturned,
    //         paymentMethod,
    //     });
    // }
  },
});
export const {
  addToCart,
  removeFromCart,
 
  updateItemNote,
  setDiscount,
  setAmountToBeReturned,
  setPaymentMethod,
  clearCart,
  updateTotalAmount,
  setSelectedAddon,
  setSingleItemDiscount,
  setWholeCartDiscount,
  addFromHoldCart,
} = cartSlice.actions;

export const getorderitems = (state) => state.cart.orderitems;


export default cartSlice.reducer;
