import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { tablesList } from "../constants";
import _ from "lodash";
import { WEBSITE_API_URL } from "../../../config";
import axios from "axios";

const initialState = {
  tableList: [],
  selectedTable: null,
  isSuccess: false,
  message: "",
  loading: false,
  groupedTableList: [],
  bookedTables: [],
};


export const getFloorsTables = createAsyncThunk(
  "home/tables-floors",
  async (accessToken, { rejectWithValue }) => {
    const url = new URL(`${WEBSITE_API_URL}/table`);
    const params = {
      "location_id": "1",
    };

    // Append parameters to the URL
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    try {
      const response = await axios.get(url.toString(), { headers });
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data); // Use rejectWithValue to handle errors in createAsyncThunk
    }
  }
);

export const getBookedTablesForToday = createAsyncThunk(
  "home/get-booked-tables",
  (accessToken) => {

    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    const url = new URL(
      WEBSITE_API_URL + "/get-booked-tables"
    );
    return axios.get(url, { headers: headers }
    )
      .then((data) => data.data)
      .catch((error) => console.log(error));
  }
);

export const tableSlice = createSlice({
  name: "table",
  initialState: initialState,
  reducers: {
    groupTables: (state, action) => {
      const { tableList } = state;
      const groupedTableList = _.groupBy(tableList, "floor");
      state.groupedTableList = groupedTableList;
    },
    setselectedTable: (state, action) => {
      if (
        state.selectedTable !== null &&
        state.selectedTable.id === action.payload.id
      ) {
        state.selectedTable = null;
        return;
      }

      state.selectedTable = action.payload;
    },

    clearSelectedTable: (state) => {
      state.selectedTable = null;
    },

    // updateTableStatus: (state, action) => {
    //   const { tableList } = state;
    //   const { id, status } = action.payload;
    //   const table = tableList.find((table) => table.id === id);
    //   if (table) {
    //     table.status = status;
    //     state.selectedTable = table;
    //   }
    // },

    updateTableStatus: (state, action) => {
      // Assuming we're working with the first floor for simplicity.
      const { tableList } = state;

      console.log();
      const activeTables = tableList.floors[0].active_tables; // Adjusted path to access tables
      const { id, status } = action.payload;

      const table = activeTables.find((table) => table.id === id);
      if (table) {
        table.status = status;
        state.selectedTable = table; // Assuming you're updating state directly, which might not be the best practice in all cases.
      }
    },

  },
  extraReducers: {
    [getFloorsTables.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [getFloorsTables.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.tableList = payload?.data;
      state.isSuccess = true;
    },
    [getFloorsTables.rejected]: (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    },

    [getBookedTablesForToday.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [getBookedTablesForToday.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.bookedTables = payload;
      state.isSuccess = true;
    },
    [getBookedTablesForToday.rejected]: (state, { payload }) => {
      state.message = payload;
      state.loading = false;
      state.isSuccess = false;
    },
  },
});

export const {
  setselectedTable,
  updateTableStatus,
  groupTables,
  clearSelectedTable,
} = tableSlice.actions;

export const getTableList = (state) => state.table.tableList;
export const getBookedTableList = (state) => state.table.bookedTables;
export const getselectedTable = (state) => state.table.selectedTable;
export const getGroupedTableList = (state) => state.table.groupedTableList;

export default tableSlice.reducer;
