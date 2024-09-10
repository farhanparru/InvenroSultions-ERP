import React, { useEffect, useState,useRef  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, notification, Popconfirm } from "antd";
import CartNumpad from "../../../components/CartNumpad";
import axios from "axios";
import moment from "moment";



import {
  UilAngleDoubleUp,
  UilAngleDoubleDown,
  UilTrashAlt,
} from "@iconscout/react-unicons";
import {
  UilCreditCard,
  UilMoneyWithdraw,
  UilBars,
  UilLayersAlt,
  UilQrcodeScan,
  UilCheckCircle,
  UilPauseCircle,
  UilArrowCircleRight,
  UilCalender,
} from "@iconscout/react-unicons";
import { clearCart, setPaymentMethod } from "../../../store/cartSlice";
import useCollapse from "react-collapsed";
import {
  FLOORS,
  ORDERSTATES,
  PAYMENTSTATUS,
  TABLESTATES,
} from "../../../constants";
import { FaUser } from 'react-icons/fa';
import {
  addOrder,
  clearEditOrder,
  getOrders,
  pushOrder,
  sell,
  sellUpdate,
} from "../../../store/orderSlice";
import {
  clearSelectedTable,
  getBookedTableList,
  getBookedTablesForToday,
  getFloorsTables,
  getselectedTable,
  groupTables,
  setselectedTable,
  updateTableStatus,
} from "../../../store/tableSlice";
import { uniqueId } from "lodash";
import {
  getSelectedTab,
  getTaxTypeList,
  selectBodySection,
} from "../../../store/homeSlice";
import {
  clearSelectedCustomer,
  getSelectedCustomer,
} from "../../../store/customerSlice";
import { getStoreUserData } from "../../../../../store/storeUser/storeUserSlice";
import CustomModal from "../../../../../components/CustomModal";
import Bill from "../../body/components/printbill";
import { Invoice } from "@axenda/zatca";
import { addHoldCart } from "../../../store/holdCartSlice";
import { Avatar, Form, Input, Select } from "antd";
import CartItem from "../../../components/CartItem";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Toaster, toast } from "sonner";
import FooterActions from "./FooterAction";

const actionBtnClass = `w-full text-[0.6rem] py-2 font-medium rounded-lg   transition-all ease-in-out hover:scale-95 `;
const HomeCartFooter = ({ selectedCustomer }) => {
  
 console.log(selectedCustomer,"selectedCustomer");
 

  const {
    totalAmount,
    tax,
    discount,
    amountToBeReturned,
    paymentMethod,
    totalPayableAmount,
    totalAmountWithoutDiscount,
  } = useSelector((state) => state.cart);
  const selectedTable = useSelector(getselectedTable);
  // const selectedCustomer = useSelector(getSelectedCustomer);
  const taxLists = useSelector(getTaxTypeList);
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
  // const [isExpanded, setIsExpanded] = React.useState(false);
 
  // const {ipcRenderer} = window.require("electron");
  const cartState = useSelector((state) => state.cart);

  return (
    <div
      className={`home__cart-footer absolute bottom-0 w-full flex flex-col p-3 bg-gray-100 text-black border-t  border-gray-300 gap-3 ${
        isExpanded ? " overflow-y-scroll h-[90%]" : ""
      }`}
    >
      <Toaster position="bottom-center" richColors />

      <div className="flex justify-between gap-2">
        <p className="text-xs font-semibold">
          {selectedTable === null
            ? "No Table Selected"
            : `Table :  ${selectedTable.name} is Selected`}
        </p>
        <p className="text-sm font-bold flex items-center">
      <FaUser className="mr-2 text-lg " />
      Customer: {selectedCustomer ? selectedCustomer.name : 'No Customer Selected'}
    </p>
      </div>

      <div className=" h-full  overflow-y-scroll">
        <div
          {...getCollapseProps()}
          className="home__cart-expand  flex flex-col gap-2"
        >
          <CartNumpad totalPayableAmount={totalPayableAmount} />
          <div className="detailed__amount border border-blue-500 border-dotted rounded-md bg-gray-100 p-2">
            <AmountDetailTile label={"Total"} value={totalAmount} />
            {/* <AmountDetailTile label={"Tax"} value={tax} /> */}
            <AmountDetailTile label={"Discount"} value={discount} />
            <AmountDetailTile
              label={"Amount to be returned"}
              value={amountToBeReturned?.toFixed(3)}
            />
            <AmountDetailTile label={"Payment Method"} value={paymentMethod} />
          </div>
        </div>
      </div>
      <div className="cart__footer-total flex justify-between gap-5  ">
        <p className="text-sm font-sem-bold ">Subtotal</p>
        <p className="text-sm font-black text-black">
          ₹ {totalAmount?.toFixed(3)}
          {}
        </p>
      </div>

      <div className="cart__footer-total flex justify-between gap-5  ">
        {/* <p className="text-sm font-bold ">
          {taxLists && taxLists?.length > 0
            ? taxLists[0]?.name + `(${taxLists[0]?.amount}%)`
            : "VAT"}{" "}
        </p> */}
        {/* <p className="text-sm font-black text-black">₹ {tax?.toFixed(3)}</p> */}
      </div>
      {discount > 0 ? (
        <div className="cart__footer-total flex justify-between gap-5 text-green-500 ">
          <p className="text-sm font-bold ">Discount</p>
          <p className="text-sm font-black ">₹ {discount}</p>
        </div>
      ) : null}
      <div className="cart__footer-total flex justify-between gap-5  ">
        <p className="text-lg font-bold ">Payable Amount</p>
        <p className="text-lg font-black text-black">
          ₹ {totalAmount?.toFixed(3)}
        </p>
      </div>

      <FooterActions/>
      
  
    </div>
  );
};

export default HomeCartFooter;

const AmountDetailTile = ({ label, value }) => {
  return (
    <div className="flex gap-2 justify-between">
      <p className="text-md font-bold ">{label} :</p>

      <p className="text-sm  font-black  text-red-500">{value}</p>
    </div>
  );
};

