import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { WEBSITE_API_URL } from "../../../config";
import {
  categoriesList,
  homeItemsList,
  homeTopBarTabs,
  homeBodySection,
} from "../constants";

const initialState = {
  selectedCategory: 0,
  selectedTab: 1,
  selectedBodySection: homeBodySection[0]?.slug || "",
  allItems: [],
  filteredItems: [],
  isSuccess: false,
  message: "",
  loading: false,
  allCategories: [],
  units:[],
  brands:[],
  tax_types:[],
  pirce_groups:[],
  printers:[],
  paymentMethods:[],
};

export const getItemCategories = createAsyncThunk(
  "home/item-category",
  (accessToken) => {
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    return axios.get(WEBSITE_API_URL + "/item-category", { headers: headers })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error; // Re-throw the error to be caught by the action creator
      });
  }
);

export const getPriceGroups = createAsyncThunk(
  "home/item-getPriceGroups",
  (accessToken) => {
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    return axios.get(WEBSITE_API_URL + "/selling-price-group", { headers: headers })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error; // Re-throw the error to be caught by the action creator
      });
  }
);


export const getPrinters = createAsyncThunk(
  "home/item-getPrinters",
  (accessToken) => {
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    return axios.get(WEBSITE_API_URL + "/get-printers", { headers: headers })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error; // Re-throw the error to be caught by the action creator
      });
  }
);
export const addNewCategory = createAsyncThunk("home/add-new-category", (item_data) => {
  return axios
    .post(WEBSITE_API_URL + "/add-new-category", {
      token: item_data.token,
      data: item_data,
    })
    .then((data) => data.data)
    .catch((error) => console.log(error));
});
export const getBrands = createAsyncThunk(
  "home/brands",
  (accessToken) => {
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    return axios.get(WEBSITE_API_URL + "/brand", { headers: headers })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error; // Re-throw the error to be caught by the action creator
      });
  }
);

export const getTaxTypes = createAsyncThunk(
  "home/taxTypes",
  (accessToken) => {
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    return axios.get(WEBSITE_API_URL + "/tax", { headers: headers })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error; // Re-throw the error to be caught by the action creator
      });
  }
);


export const getUnits = createAsyncThunk(
  "home/unit",
  (accessToken) => {
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    return axios.get(WEBSITE_API_URL + "/unit", { headers: headers })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error; // Re-throw the error to be caught by the action creator
      });
  }
);


export const getItems = createAsyncThunk(
  "home/items",
  (accessToken) => {
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    return axios.get(WEBSITE_API_URL + "/product", { headers: headers })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error; // Re-throw the error to be caught by the action creator
      });
  }
);

export const getPaymentMethods = createAsyncThunk(
  "home/getPaymentMethods",
  (accessToken) => {
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    return axios.get(WEBSITE_API_URL + "/payment-methods", { headers: headers })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error; // Re-throw the error to be caught by the action creator
      });
  }
);




export const addNewItem = createAsyncThunk(
  "home/add-new-item",
  (item_data) => {
    const headers = {
      "Authorization": `Bearer ${item_data?.token}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    return axios.post(WEBSITE_API_URL + "/add-new-item", {
      data: item_data,
    }, { headers: headers })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error; // Re-throw the error to be caught by the action creator
      });
  }
);



export const homeSlice = createSlice({
  name: "home",
  initialState: initialState,
  reducers: {
    selectCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    selectTab: (state, action) => {
      state.selectedTab = action.payload;
    },
    selectBodySection: (state, action) => {
      state.selectedBodySection = action.payload;
    },

    filterItems: (state, action) => {
      const { selectedCategory, allItems } = state;
      let searchedItems = [];
      if (action.payload === "") {
        searchedItems = allItems;
      } else {
        searchedItems = allItems.filter(
          (item) =>
            item.name.toLowerCase().indexOf(action.payload.toLowerCase()) > -1
        );
      }
      if (selectedCategory == "0") {
        state.filteredItems = searchedItems;
      } else {
        state.filteredItems = searchedItems.filter(
          (item) => item.brand?.id === selectedCategory
        );
      }
    },

    // searchItems: (state, action) => {
    //     const { allItems } = state;
    //     state.filteredItems = allItems.filter(
    //         (item) => (item.itemName.toLowerCase().indexOf(action.payload.toLowerCase()) > -1)
    //     );

    // }
  },
  extraReducers: {
    [getItemCategories.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [getItemCategories.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.allCategories = payload?.data
      state.isSuccess = true;
    },
    [getItemCategories.rejected]: (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    },
    [getPriceGroups.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [getPriceGroups.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.pirce_groups = payload?.data
      state.selectedTab = payload?.data && payload?.data?.length > 0 && payload?.data[0];

      state.isSuccess = true;
    },
    [getPriceGroups.rejected]: (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    },

    
    [getPrinters.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [getPrinters.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.printers = payload?.data

      state.isSuccess = true;
    },
    [getPrinters.rejected]: (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    },

    [getPaymentMethods.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [getPaymentMethods.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.paymentMethods = payload?.data

      state.isSuccess = true;
    },
    [getPaymentMethods.rejected]: (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    },
    [getItems.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [getItems.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.allItems = payload.data;
      state.isSuccess = true;
    },
    [getItems.rejected]: (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    },
    [getUnits.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [getUnits.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.units = payload?.data
      state.isSuccess = true;
    },
    [getUnits.rejected]: (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    },

    [getTaxTypes.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [getTaxTypes.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.tax_types = payload?.data
      state.isSuccess = true;
    },
    [getTaxTypes.rejected]: (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    },

    [getBrands.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [getBrands.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.brands = payload?.data
      state.isSuccess = true;
    },
    [getBrands.rejected]: (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    },

    [addNewItem.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [addNewItem.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.isSuccess = true;
    },
    [addNewItem.rejected]: (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    },
  },
});

export const { selectCategory, selectTab, filterItems, selectBodySection } =
  homeSlice.actions;

export const getSelectedCategory = (state) => state.home.selectedCategory;
export const getSelectedTab = (state) => state.home.selectedTab;
export const getFilteredItems = (state) => state.home.filteredItems;
export const getSelectedBodySection = (state) => state.home.selectedBodySection;
export const getCategoryList = (state) => state.home.allCategories;
export const getPriceGroupsList = (state) => state.home.pirce_groups;
export const getPrintersList = (state) => state.home.printers;
export const getUnitsList = (state) => state.home.units;
export const getTaxTypeList = (state) => state.home.tax_types;
export const getItemsList = (state) => state.home.allItems;

export default homeSlice.reducer;
