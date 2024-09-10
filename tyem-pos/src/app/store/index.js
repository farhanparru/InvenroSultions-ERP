import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartSlice from "../pages/home/store/cartSlice";
import homeSlice from "../pages/home/store/homeSlice";
import tableSlice from "../pages/home/store/tableSlice";
import orderSlice from "../pages/home/store/orderSlice";
import customerSlice from "../pages/home/store/customerSlice";
import holdCartSlice from "../pages/home/store/holdCartSlice";
import itemsSlice from "./items/itemsSlice";
import storeUserSlice from "./storeUser/storeUserSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import kdsSlice  from '../pages/home/store/kdsSlice';

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducers = combineReducers({
  home: homeSlice,
  cart: cartSlice,
  table: tableSlice,
  order: orderSlice,
  kds: kdsSlice,
  customer: customerSlice,
  holdCart: holdCartSlice,
  items: itemsSlice,
  store_user: storeUserSlice,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
});
export const persistor = persistStore(store);
