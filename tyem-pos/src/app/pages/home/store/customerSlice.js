import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import _ from "lodash";
import { WEBSITE_API_URL } from "../../../config";
import { dummyCustomers } from "../../customers/constants";

const initialState = {
  customerList: [],
  offlineCustomerList: [],
  seachedCustomerList: [],
  selectedCustomer: null,
  isCartOpen: true,
  isSuccess: false,
  message: "",
  loading: false,
};

export const getStoreCustomers = createAsyncThunk(
  "home/get-store-customers",
  (accessToken) => {

    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    const params = {
      "type": "customer",

      "per_page": "10",
    };
    const url = new URL(
      WEBSITE_API_URL + "/contactapi"
    );

    Object.keys(params)
      .forEach(key => url.searchParams.append(key, params[key]));
    return axios.get(url, { headers: headers }
    )
      .then((data) => data.data)
      .catch((error) => console.log(error));
  }
);


export const addStoreCustomers = createAsyncThunk(
  "sales/addStoreCustomers",
  async ({ customer_data, token }) => {
    try {
      // Assuming you have auth state with accessToken

      console.log(customer_data);
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      };

      let body = {
        "type": "customer",
        "supplier_business_name": customer_data?.customer_data,
        "prefix": customer_data?.country_code ?? +971,
        "first_name": customer_data?.name,
        "middle_name": null,
        "last_name": customer_data?.lastName,
        "tax_number": customer_data?.vat,
        "pay_term_number": null,
        "pay_term_type": null,
        "mobile": customer_data?.mobile,
        "landline": customer_data?.mobile,
        "alternate_number": null,
        "address_line_1": customer_data?.address,
        "address_line_2": customer_data?.address,
        "city": null,
        "state": null,
        "country": null,
        "zip_code": null,
        "customer_group_id": null,
        "contact_id": null,
        "dob": null,
        "custom_field1": null,
        "custom_field2": null,
        "custom_field3": null,
        "custom_field4": null,
        "email": customer_data?.email,
        "shipping_address": null,
        "position": null,
        "opening_balance": 0,
        "source_id": null,
        "life_stage_id": null,
        "assigned_to": []
      };


      const response = await axios.post(
        WEBSITE_API_URL + '/contactapi'
        , body,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error("Error while selling:", error);
      throw error;
    }
  }
);
// export const addStoreCustomers = createAsyncThunk(
//   "home/add-store-customer",
//   ({ customer_data, token }) => {


//     return axios
//       .post(
//         WEBSITE_API_URL + "/add-store-customer",
//         {
//           data: customer_data,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: token,
//           },
//         }
//       )
//       .then((data) => data.data)
//       .catch((error) => console.log(error));
//   }
// );

export const customerSlice = createSlice({
  name: "customer",
  initialState: initialState,
  reducers: {
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    setIsCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    },
    searchCustomer: (state, action) => {
      const { customerList } = state;
      const searchQuery = action.payload;

      const seachedCustomerList = searchQuery?.length > 0 && customerList.filter((customer) => {
        return customer?.name?.toLowerCase().includes(searchQuery);
      });

      state.seachedCustomerList = searchQuery?.length > 0 ? seachedCustomerList?.reverse() :customerList ;
    },
    addAndSelectCustomer: (state, action) => {
      const { customerList } = state;
      const customer = action.payload;

      const lastId = customerList[customerList.length - 1].id;
      customer.id = lastId + 1;
      customerList.push(customer);
      state.seachedCustomerList = customerList.reverse();
      state.selectedCustomer = customer;
    },
    clearSelectedCustomer: (state, action) => {
      const { customerList } = state;

      state.selectedCustomer = customerList[0];
    },
  },
  extraReducers: {
    [getStoreCustomers.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [getStoreCustomers.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.customerList = payload?.data;
      state.selectedCustomer = payload?.data[0];
      state.isSuccess = true;
    },
    [getStoreCustomers.rejected]: (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    },
    [addStoreCustomers.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [addStoreCustomers.fulfilled]: (state, { payload }) => {
      state.loading = false;
      // state.customerList = payload.success ? payload?.data?.store_customers: [];
      state.isSuccess = true;
    },
    [addStoreCustomers.rejected]: (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    },
  },
});

export const {
  setSelectedCustomer,
  setIsCartOpen,
  searchCustomer,
  addAndSelectCustomer,
  clearSelectedCustomer,
} = customerSlice.actions;

export const getSelectedCustomer = (state) => state.customer.selectedCustomer;
export const getCustomerList = (state) => state.customer.customerList;
export const getIsCartOpen = (state) => state.customer.isCartOpen;
export const getSeachedCustomerList = (state) =>
  state.customer.seachedCustomerList;
export default customerSlice.reducer;
