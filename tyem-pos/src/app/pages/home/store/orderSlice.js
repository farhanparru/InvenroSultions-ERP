import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { WEBSITE_API_URL } from "../../../config";

const initialState = {
  ordersList: [],
  orderData: [],
  newOrder: [],
  syncOrder: [],
  filteredOrders: [],
  editOrder :[],
};

export const sell = createAsyncThunk(
  "sales/sell",
  async (sellData, { getState }) => {
    try {
      // Assuming you have auth state with accessToken

      const headers = {
        "Authorization": `Bearer ${sellData?.token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      };

      const requestData = {
        sells: [
          {
            location_id: sellData.store_id ?? null, // Add location_id here
            contact_id: sellData?.customer ? sellData?.customer?.id : 0,
            transaction_date: new Date().toISOString(),
            invoice_no: null, // Assuming sellData?.id is the invoice number
            source: "api", // Example source
            status: sellData?.orderStatus, // Assuming orderStatus matches API statuses
            tax_rate_id: sellData?.tax_rate_id, // Placeholder for tax rate ID, adjust as needed
            discount_amount: sellData?.discount_amount, // Placeholder for discount amount, adjust as needed
            discount_type: sellData?.discount_type, // Placeholder for discount type, adjust as needed
            sale_note: "", // Example sale note
            commission_agent: null, // Placeholder for commission agent, adjust as needed
            shipping_details: "", // Example shipping details
            shipping_address: "", // Example shipping address
            shipping_status: "", // Example shipping status
            delivered_to: "", // Example delivered to
            shipping_charges: null, // Placeholder for shipping charges, adjust as needed
            packing_charge: null, // Placeholder for packing charge, adjust as needed
            exchange_rate: null, // Placeholder for exchange rate, adjust as needed
            selling_price_group_id: sellData?.price_group_id, // Placeholder for selling price group ID, adjust as needed
            is_scheduled: sellData?.is_scheduled,
            schedule_date: sellData?.schedule_date,
            schedule_time: sellData?.schedule_time,
            pay_term_number: null, // Placeholder for pay term number, adjust as needed
            pay_term_type: "", // Example pay term type
            is_suspend: false, // Example is_suspend
            is_recurring: 0, // Example is_recurring
            recur_interval: null, // Placeholder for recur interval, adjust as needed
            recur_interval_type: "", // Example recur interval type
            subscription_repeat_on: null, // Placeholder for subscription repeat on, adjust as needed
            subscription_no: "", // Example subscription number
            recur_repetitions: null, // Placeholder for recur repetitions, adjust as needed
            rp_redeemed: null, // Placeholder for rp redeemed, adjust as needed
            rp_redeemed_amount: null, // Placeholder for rp redeemed amount, adjust as needed
            types_of_service_id: null, // Placeholder for types of service ID, adjust as needed
            service_custom_field_1: "", // Example service custom field 1
            service_custom_field_2: "", // Example service custom field 2
            service_custom_field_3: "", // Example service custom field 3
            service_custom_field_4: "", // Example service custom field 4
            service_custom_field_5: "", // Example service custom field 5
            service_custom_field_6: "", // Example service custom field 6
            round_off_amount: null, // Placeholder for round off amount, adjust as needed
            table_id: sellData?.table ? sellData?.table : null, // Assuming sellData?.table represents table ID
            service_staff_id: null, // Placeholder for service staff ID, adjust as needed
            change_return: null, // Placeholder for change return, adjust as needed
            products: sellData?.cartState?.orderitems.map(item => ({
              product_id: item.id,
              variation_id: item.variation_id,
              quantity: item.quantity,
              unit_price: item.price, // Adjust this if item.price is not available or needs conversion
              tax_rate_id: null, // Placeholder for tax rate ID, adjust as needed
              discount_amount: null, // Placeholder for discount amount, adjust as needed
              discount_type: null, // Placeholder for discount type, adjust as needed
              sub_unit_id: null, // Placeholder for sub unit ID, adjust as needed
              note: "" // Example note
            })) ?? [],
            payments: [
              {
                method: sellData?.cartState?.paymentMethod,
                amount: sellData?.cartState?.totalPayableAmount
              }
            ]
          }
        ]
      };

      const response = await axios.post(
        WEBSITE_API_URL + '/sell'
        , requestData,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error("Error while selling:", error);
      throw error;
    }
  }
);

export const sellUpdate = createAsyncThunk(
  "sales/sellUpdate",
  async (sellData, { getState }) => {
    try {
      // Assuming you have auth state with accessToken

      const headers = {
        "Authorization": `Bearer ${sellData?.token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      };

      const requestData = {
        sells: [
          {
            location_id: sellData.store_id ?? null, // Add location_id here
            contact_id: sellData?.customer ? sellData?.customer?.id : 0,
            transaction_date: new Date().toISOString(),
            invoice_no: null, // Assuming sellData?.id is the invoice number
            source: "api", // Example source
            status: sellData?.orderStatus, // Assuming orderStatus matches API statuses
            tax_rate_id: null, // Placeholder for tax rate ID, adjust as needed
            discount_amount: null, // Placeholder for discount amount, adjust as needed
            discount_type: null, // Placeholder for discount type, adjust as needed
            sale_note: "", // Example sale note
            commission_agent: null, // Placeholder for commission agent, adjust as needed
            shipping_details: "", // Example shipping details
            shipping_address: "", // Example shipping address
            shipping_status: "", // Example shipping status
            delivered_to: "", // Example delivered to
            shipping_charges: null, // Placeholder for shipping charges, adjust as needed
            packing_charge: null, // Placeholder for packing charge, adjust as needed
            exchange_rate: null, // Placeholder for exchange rate, adjust as needed
            selling_price_group_id: sellData?.price_group_id, // Placeholder for selling price group ID, adjust as needed
            is_scheduled: sellData?.is_scheduled,
            schedule_date: sellData?.schedule_date,
            schedule_time: sellData?.schedule_time,
            pay_term_number: null, // Placeholder for pay term number, adjust as needed
            pay_term_type: "", // Example pay term type
            is_suspend: false, // Example is_suspend
            is_recurring: 0, // Example is_recurring
            recur_interval: null, // Placeholder for recur interval, adjust as needed
            recur_interval_type: "", // Example recur interval type
            subscription_repeat_on: null, // Placeholder for subscription repeat on, adjust as needed
            subscription_no: "", // Example subscription number
            recur_repetitions: null, // Placeholder for recur repetitions, adjust as needed
            rp_redeemed: null, // Placeholder for rp redeemed, adjust as needed
            rp_redeemed_amount: null, // Placeholder for rp redeemed amount, adjust as needed
            types_of_service_id: null, // Placeholder for types of service ID, adjust as needed
            service_custom_field_1: "", // Example service custom field 1
            service_custom_field_2: "", // Example service custom field 2
            service_custom_field_3: "", // Example service custom field 3
            service_custom_field_4: "", // Example service custom field 4
            service_custom_field_5: "", // Example service custom field 5
            service_custom_field_6: "", // Example service custom field 6
            round_off_amount: null, // Placeholder for round off amount, adjust as needed
            table_id: sellData?.table ? sellData?.table : null, // Assuming sellData?.table represents table ID
            service_staff_id: null, // Placeholder for service staff ID, adjust as needed
            change_return: null, // Placeholder for change return, adjust as needed
            products: sellData?.cartState?.orderitems.map(item => ({
              product_id: item.id,
              variation_id: item.variation_id,
              quantity: item.quantity,
              unit_price: item.price, // Adjust this if item.price is not available or needs conversion
              tax_rate_id: null, // Placeholder for tax rate ID, adjust as needed
              discount_amount: null, // Placeholder for discount amount, adjust as needed
              discount_type: null, // Placeholder for discount type, adjust as needed
              sub_unit_id: null, // Placeholder for sub unit ID, adjust as needed
              note: "" // Example note
            })) ?? [],
            payments: [
              {
                method: sellData?.cartState?.paymentMethod,
                amount: sellData?.cartState?.totalPayableAmount
              }
            ]
          }
        ]
      };

      const response = await axios.put(
        WEBSITE_API_URL + '/sell/' + sellData?.id
        , requestData,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error("Error while selling:", error);
      throw error;
    }
  }
);
export const addOrder = createAsyncThunk("home/place-order", (order_data) => {
  let orderType = order_data.type ?? "Dine In";
  let contact_id = order_data.customer != 0 ? order_data.customer.id : 0;
  let tax_rate_id = null; //to do
  // let res_table_id = order_data.table != 0 ? order_data.table.id : 0; //to do
  let res_table_id = 0;
  let status = "final";
  let payment = [];
  if (order_data.paymentMethod == "Split") {
    payment = [
      {
        method: "cash",
        amount: order_data.cartState.splitCash,
      },
      {
        method: "card",
        amount: order_data.cartState.splitCard,
      },
    ];
  } else {
    payment = [
      {
        method: order_data.paymentMethod,
        amount: order_data.cartState.totalPayableAmount,
      },
    ];
  }

  let discount_type = order_data.cartState.discountType;
  let discount_amount = order_data.cartState.discountValue;
  let final_total = order_data.cartState.totalPayableAmount;
  let change_return = order_data.cartState.amountToBeReturned;
  let is_suspend = 0;
  let is_credit_sale = 0;
  let res_waiter_id = null;
  let price_group = null;
  let products = order_data.cartState.orderitems.map((item) => {
    return {
      product_id: item.id,
      variation_id: item.variation_id,
      quantity: item.quantity,
      unit_price: item.price,
      unit_price_inc_tax: item.price,
      line_discount_type: item.discountType,
      line_discount_amount: item.discountValue,
      item_tax: 0,
      tax_id: null,
      sell_line_note: item.sell_line_note,
    };
  });
  return axios
    .post(
      WEBSITE_API_URL + "/place-order",
      {
        orderType,
        contact_id,
        tax_rate_id,
        res_table_id,
        status,
        payment,
        discount_type,
        discount_amount,
        final_total,
        change_return,
        is_suspend,
        is_credit_sale,
        res_waiter_id,
        price_group,
        products,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: order_data.token,
        },
      }
    )
    .then((data) => data.data)
    .catch((error) => console.log(error));
});

export const getOrders = createAsyncThunk("home/view-new-orders", (token) => {
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  return axios
    .get(WEBSITE_API_URL + "/get-latest-orders", {
      headers: headers,
    }
    )
    .then((data) => data.data)
    .catch((error) => console.log(error));
});
export const orderSlice = createSlice({
  name: "order",
  initialState: initialState,
  reducers: {
    pushOrder: (state, action) => {
      state.newOrder = action.payload;
    },
    setEditOrder: (state, action) => {
      state.editOrder = action.payload;
    },
    clearEditOrder: (state, action) => {
      state.editOrder = [];
    },
    syncOrder: (state, action) => {
      state.syncOrder = action.payload;
    },
    searchOrder: (state, action) => {
      const { ordersList } = state;
      const searchQuery = action.payload;
      if (searchQuery == "") {
        state.filteredOrders = [];
        return;
      }
      const filteredOrders = ordersList.filter((order) => {
        return order.order_id == searchQuery;
      });
      state.filteredOrders = filteredOrders.reverse();
    },
  },
  extraReducers: {
    [addOrder.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [addOrder.fulfilled]: (state, { payload }) => {
      // console.log(payload);
      if (payload.success == 1) {
        if (state.syncOrder.length) {
          // console.log("syncOrder", state.syncOrder);
          state.syncOrder.is_synced = 1;
          state.syncOrder = [];
        }
        state.newOrder.is_synced = 1;
      } else {
        state.newOrder.is_synced = 0;
      }
      state.ordersList.push(state.newOrder);
      state.newOrder = [];

      state.loading = false;
      state.data = payload;
      state.isSuccess = true;
    },
    [addOrder.rejected]: (state, { payload }) => {
      state.message = payload;
      state.newOrder.is_synced = 0;

      if (state.syncOrder != []) {
        state.syncOrder.is_synced = 0;
      }

      state.loading = false;
      state.isSuccess = false;
    },

    [getOrders.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [getOrders.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.ordersList = payload?.success ? payload?.data?.orders : [];
      state.isSuccess = true;
    },
    [getOrders.rejected]: (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    },
  },
});

export const { pushOrder, removeKdsOrder, syncOrder, searchOrder,setEditOrder ,clearEditOrder} = orderSlice.actions;

export const getOrdersList = (state) => state.order.ordersList;
export const getOrdersList2 = (state) => state.order;
export default orderSlice.reducer;
