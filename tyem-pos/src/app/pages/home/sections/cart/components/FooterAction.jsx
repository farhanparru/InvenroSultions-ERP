import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, setPaymentMethod } from "../../../store/cartSlice";
import axios from "axios";
import HoldSaleModal from "./HoldSaleModal";
import {
  getSelectedTab,
  getTaxTypeList,
  selectBodySection,
} from "../../../store/homeSlice";
import { getStoreUserData } from "../../../../../store/storeUser/storeUserSlice";
import {
  FLOORS,
  ORDERSTATES,
  PAYMENTSTATUS,
  TABLESTATES,
} from "../../../constants";
import { uniqueId } from "lodash";
import {
  clearSelectedCustomer,
  getSelectedCustomer,
} from "../../../store/customerSlice";
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

import { Dropdown, notification, Popconfirm } from "antd";
const actionBtnClass = `w-full text-[0.6rem] py-2 font-medium rounded-lg   transition-all ease-in-out hover:scale-95 `;
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
import { Avatar, Form, Input, Select } from "antd";
import { Toaster, toast } from "sonner";
import CustomModal from "../../../../../components/CustomModal";
import CartNumpad from "../../../components/CartNumpad";

const FooterActions = () => {
  const navigate = useNavigate();
  function generateInvoiceNumber() {
    const prefix = "INV";
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(Math.random() * 1000000);

    return `${prefix}${datePart}${randomPart.toString().padStart(6, "0")}`;
  }

  const PAYMENTSTATUS = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
  };

  const PAYMENT_METHOD_STATUS = {
    cash: PAYMENTSTATUS.COMPLETED,
    card: PAYMENTSTATUS.PENDING,
    split: PAYMENTSTATUS.PENDING,
    Talabat: PAYMENTSTATUS.PENDING,
    other: PAYMENTSTATUS.PENDING,
  };

  const handleSubmit = async () => {
    const invoiceNumber = generateInvoiceNumber();

    const paymentMethod = cartState?.paymentMethod;
    const status =
      PAYMENT_METHOD_STATUS[paymentMethod] || PAYMENTSTATUS.PENDING;

    const orderData = {
      status: status,
      orderDetails: {
        paymentStatus: status, // Include paymentStatus here
        orderNumber: orderId,
        invoiceNumber: invoiceNumber, // Use generated invoice number
        customerName: selectedCustomer?.name,
        location: "Store",
        orderDate: new Date().toISOString(), // Use the current date
      },
      itemDetails: {
        items: cartState?.orderitems?.length || 0,
        quantity:
          cartState?.orderitems?.reduce(
            (acc, item) => acc + item.quantity,
            0
          ) || 0,
        itemName: cartState?.orderitems?.map((item) => item.name) || [], // Include item names
        method: paymentMethod,
        total: cartState?.totalPayableAmount || 0,
      },
      discount: {
        type: cartState?.discountType || "fixed", // Default to "fixed" if undefined
        value: cartState?.discountValue || 0, // Default to 0 if undefined
      },
      type: "SALE",
    };

    console.log("Sending order data:", orderData); // Debug log

    try {
      const response = await axios.post(
        "https://tyem.invenro.com/api/user/Posorder",
        orderData
      );
      console.log("API response:", response); // Log the API response
      if (response.status === 201) {
        toast.success("Order created successfully!");
      } else {
        toast.error("Failed to create order.");
      }
    } catch (error) {
      console.error("Error creating order:", error); // Log the error
      toast.error(
        `Error creating order: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const selectedTable = useSelector((state) => state.table.selectedTable);
  // console.log(selectedTable);
  const taxLists = useSelector(getTaxTypeList);

  let kotfinalItems = [];
  const [saveModal, setSaveModal] = useState(false); // New state for save modal
  const selectedTab = useSelector(getSelectedTab);
  const [showModal, setShowModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [schedule_date, setschedule_date] = useState(null);
  const [schedule_time, setschedule_time] = useState(null);
  const [printState, setPrintState] = useState(false);
  const [cartNote, setCartNote] = useState("");
  const [orderId, setOrderId] = useState(0);
  const [scheduleDate, setScheduleDate] = useState();
  const [paymentMethods, setpaymentMethods] = useState([]);

  const finalItems = useSelector((state) => state.finalItems);
  // console.log(finalItems,"kkk");

  const date = new Date();
  const odCount = useSelector((state) => state.odCount);

  // console.log(odCount,"jjj");

  const selectedCustomer = useSelector(
    (state) => state.customer.selectedCustomer
  );
  const cartState = useSelector((state) => state.cart);
  const ordersData = useSelector((state) => state.order);
  const selectedOrderType = useSelector(getSelectedTab);
  const editOrder = useSelector((state) => state.order.editOrder);
  const bookedTableList = useSelector(getBookedTableList);
  const [notificationApi, contextHolder] = notification.useNotification();
  const store_user = useSelector(getStoreUserData);

  const ipcRenderer = window.ipcRenderer;

  const printThermal = (selectedOrder) => {
    // console.log(cartState?.orderitems,'jjj');
    let finalItems = [];
    let kotfinalItems = [];

    // console.log(ordersData);
    let odCount = 0;
    ordersData?.ordersList.forEach(function (order) {
      if (moment(order.created_at).isSame(moment(), "day")) {
        odCount++;
      }
    });

    // console.log(cartState);

    // return;
    cartState?.orderitems.forEach(function (item) {
      let name;

      if (item?.sell_line_note) {
        name = item.name + "(" + item?.sell_line_note + ")";
      } else {
        name = item.name;
      }
      let readyToPush = [
        name,
        item.price,
        item.quantity,
        // parseFloat((item.price * 1.1) / 100).toFixed(3),
        parseFloat(item.price * item.quantity).toFixed(3),
      ];
      let readyToPushKot = [
        item.name,
        item.quantity,
        item?.sell_line_note,
        // parseFloat((item.price * 1.1) / 100).toFixed(3),
      ];
      if (item.selectedAddon) {
        readyToPush = [
          item.name +
            "<br />" +
            item.selectedAddon.name +
            "(" +
            item.selectedAddon.price +
            ")",
          item.price,
          parseFloat((item.price * 1.15) / 100).toFixed(3),
          item.quantity,
          parseFloat(item.price * item.quantity, 2).toFixed(3),
        ];

        readyToPushKot = [
          item.name +
            "<br />" +
            item.selectedAddon.name +
            "(" +
            item.selectedAddon.price +
            ")",
          item.price,
          parseFloat((item.price * 1.15) / 100).toFixed(3),
          item.quantity,
          parseFloat(item.price * item.quantity, 2).toFixed(3),
        ];
      }

      finalItems.push(readyToPush);
      kotfinalItems.push(readyToPushKot);
    });

    const date = new Date();

    const settings = {
      main_printer: localStorage.getItem("main_printer"),
      kot_printer: "80mm",
      width: "500px",
      height: null,
    };

    const kotsettings = {
      main_printer: localStorage.getItem("kot_printer"),
      kot_printer: "80mm",
      width: "500px",
      height: null,
    };

    const finalData = {
      settings: kotsettings,
      data: data,
    };

    const kotfinalData = {
      settings: settings,
      data: kotdata,
    };

    // ipcRenderer.send("print", JSON.stringify(finalData));
    // ipcRenderer.send("print2", JSON.stringify(kotfinalData));
  };
  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => dispatch(setPaymentMethod("Split"))}
          className="flex gap-2"
        >
          <UilLayersAlt /> <p>Split</p>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          onClick={() => dispatch(setPaymentMethod("other"))}
          className="flex gap-2"
        >
          <UilQrcodeScan /> <p>Other</p>
        </div>
      ),
    },
  ];

  const placeOrder = (type) => {
    if (isScheduled == true) {
      if (schedule_date == null || schedule_time == null) {
        toast.error(
          "If you are scheduling the order , please choose a scheduled date"
        );
        return;
      }
    }
    if (selectedTab == null) {
      notificationApi["error"]({
        message: "No Tab Selected",
        description: "Please select a tab to place order",
      });
      return;
    }
    if (cartState?.orderitems?.length === 0) {
      notificationApi["error"]({
        message: "No Items in Cart",
        description: "Please add items to cart to place order",
      });
      return;
    }

    if (selectedTab.is_customer_needed == true && selectedCustomer == null) {
      notificationApi["error"]({
        message: "No Customer Selected",
        description: "Please select a customer to place order",
      });
      return;
    }
    if (selectedTable) {
      dispatch(
        updateTableStatus({ id: selectedTable.id, status: TABLESTATES.BUSY })
      );
    }
    let status;

    if (selectedTable) {
      status = "draft";
    } else {
      if (type === 1) {
        status = "draft";
      } else if (type === 2 || type === 3) {
        status = "final";
      }
    }
    dispatch(
      pushOrder({
        token: store_user.accessToken,
        table: selectedTable ? selectedTable?.id : 0,
        cartState: cartState,
        orderStatus: status,
        orderitems: cartState?.orderitems,
        id: uniqueId("order_"),
        time: new Date().getTime(),
        paymentMethod: cartState?.paymentMethod,
        paymentStatus: PAYMENTSTATUS.PENDING,
        customer: selectedCustomer,
        store_id: store_user.business.id,
        price_group_id: selectedTab?.name,
        is_scheduled: isScheduled == true ? 1 : 0,
        schedule_date: schedule_date,
        schedule_time: schedule_time,
      })
    );

    dispatch(
      sell({
        token: store_user.accessToken,
        table: selectedTable ? selectedTable?.id : 0,
        cartState: cartState,
        orderitems: cartState?.orderitems,
        orderStatus: "received",
        id: uniqueId("order_"),
        time: new Date().getTime(),
        paymentMethod: cartState?.paymentMethod,
        paymentStatus: PAYMENTSTATUS.PENDING,
        customer: selectedCustomer ? selectedCustomer : 0,
        store_id: store_user.business.id,
        price_group_id: selectedTab?.id,
        is_scheduled: isScheduled == true ? 1 : 0,
        schedule_date: schedule_date,
        schedule_time: schedule_time,
        discount_type: cartState.discountType,
        discount_amount: cartState.discount,
        tax_rate_id: taxLists && taxLists?.length > 0 ? taxLists[0]?.id : null,
      })
    );
    dispatch(clearSelectedCustomer());
    setTimeout(() => {
      dispatch(clearSelectedTable());
      dispatch(getOrders(store_user?.accessToken));
      dispatch(getFloorsTables(store_user?.accessToken));
      dispatch(getBookedTablesForToday(store_user?.accessToken));
      dispatch(getOrders(store_user?.accessToken));
      setShowPlaceModal(false);
      dispatch(clearEditOrder());

      setShowModal(true);
      setPrintState(true);
      setTimeout(() => {
        setPrintState(false);
      }, 500);
    }, 200);
  };

  const updateOrder = (type) => {
    // if (isScheduled == true) {
    //   if (schedule_date == null || schedule_time == null) {
    //     toast.error("If you are scheduling the order , please choose a scheduled date")
    //     return;
    //   }

    // }
    // if (selectedTab == null) {
    //   notificationApi["error"]({
    //     message: "No Tab Selected",
    //     description: "Please select a tab to place order",
    //   });
    //   return;
    // }
    // if (cartState?.orderitems?.length === 0) {
    //   notificationApi["error"]({
    //     message: "No Items in Cart",
    //     description: "Please add items to cart to place order",
    //   });
    //   return;
    // }

    // if (selectedTab.is_customer_needed == true && selectedCustomer == null) {
    //   notificationApi["error"]({
    //     message: "No Customer Selected",
    //     description: "Please select a customer to place order",
    //   });
    //   return;
    // }
    // if (selectedTable) {
    //   dispatch(
    //     updateTableStatus({ id: selectedTable.id, status: TABLESTATES.BUSY })
    //   );
    // }
    // let status;

    // if (selectedTable) {
    //   status = "draft"
    // } else {
    //   if (type === 1) {
    //     status = "draft"
    //   } else if (type === 2 || type === 3) {
    //     status = "final"
    //   }
    // }
    // alert(status)
    // console.log(editOrder,'ff');
    // return

    dispatch(
      sellUpdate({
        token: store_user.accessToken,
        table: selectedTable ? selectedTable?.id : 0,
        cartState: cartState,
        orderitems: cartState?.orderitems,
        orderStatus: "final",
        id: editOrder?.order_id,
        time: new Date().getTime(),
        paymentMethod: cartState?.paymentMethod,
        paymentStatus: PAYMENTSTATUS.PENDING,
        customer: selectedCustomer ? selectedCustomer : 0,
        store_id: store_user.business.id,
        price_group_id: selectedTab?.id,
        is_scheduled: isScheduled == true ? 1 : 0,
        schedule_date: schedule_date,
        schedule_time: schedule_time,
      })
    );
    dispatch(clearSelectedCustomer());
    setTimeout(() => {
      dispatch(groupTables());

      dispatch(clearSelectedTable());
      dispatch(getOrders(store_user?.accessToken));
      dispatch(getFloorsTables(store_user?.accessToken));
      dispatch(getBookedTablesForToday(store_user?.accessToken));
      dispatch(getOrders(store_user?.accessToken));
      setShowPlaceModal(false);
      dispatch(clearEditOrder());

      setShowModal(true);
      setPrintState(true);
      setTimeout(() => {
        setPrintState(false);
      }, 500);
    }, 200);
  };
  const __generataOrderId = () => {
    setOrderId(uniqueId("order_"));
  };

  const layout = {
    layout: "vertical",
  };
  const [form] = Form.useForm();

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };
  const onFinish = (values) => {
    setschedule_date(values?.schedule_date);
    setschedule_time(values?.schedule_time);
  };

  const dispatch = useDispatch();

  let paymentMethod;

  switch (cartState.paymentMethod) {
    case "Cash":
      paymentMethod = "cash";
      break;

    case "Card":
      paymentMethod = "card";
      break;

    default:
      paymentMethod = "cash";
      break;
  }



  const handleConfirm = () => {
    // Add your hold sale logic here
    setHoldCartModal(false);
  };


  // const { ipcRenderer } = require('electron')
  const data = [
    {
      // file path
      position: 'center',                                  // position of image: 'left' | 'center' | 'right'
      width: '160px',                                           // width of image in px; default: auto
      height: '60px',                                          // width of image in px; default: 50 or '50px'
    },
    {
      type: 'text',
      value: 'SAMPLE HEADING',
      style: { fontWeight: "700", textAlign: 'center', fontSize: "24px" }
    },
    {
      type: 'text',
      value: 'Secondary text',
      style: { textDecoration: "underline", fontSize: "10px", textAlign: "center", color: "red" }
    },
    {
      type: 'barCode',
      value: '023456789010',
      height: 40,
      width: 2,
      displayValue: true,
      fontsize: 12,
    },
    {
      type: 'qrCode',
      value: 'https://github.com/Hubertformin/electron-pos-printer',
      height: 55,
      width: 55,
      style: { margin: '10 20px 20 20px' }
    },
    {
      type: 'table',
      style: { border: '1px solid #ddd' },
      tableHeader: ['Animal', 'Age'],
      tableBody: [
        ['Cat', 2],
        ['Dog', 4],
        ['Horse', 12],
        ['Pig', 4],
      ],
      tableFooter: ['Animal', 'Age'],
      tableHeaderStyle: { backgroundColor: '#000', color: 'white' },
      tableBodyStyle: { 'border': '0.5px solid #ddd' },
      tableFooterStyle: { backgroundColor: '#000', color: 'white' },
    }
  ];

  function printData() {
      ipcRenderer.send('print', JSON.stringify(data))
  }




  const [holdCartModal, setHoldCartModal] = useState(false);

  return (
    <div className=" flex flex-col gap-3">
      <Toaster position="bottom-center" richColors />

      {contextHolder}

      {cartState?.orderitems?.length !== 0 && (
        <div className="flex gap-2 items-center">
          <button
            className={`${actionBtnClass}  bg-yellow-500  text-white hover:bg-orange-300 p-2 flex gap-2 justify-center`}
            onClick={() => {
              setIsScheduled(true);
              setShowPlaceModal(true);
              __generataOrderId();
              let methods = JSON.parse(store_user?.business?.pos_settings);

              if (
                methods?.enable_cash_denomination_for_payment_methods &&
                methods.enable_cash_denomination_for_payment_methods?.length > 0
              ) {
                setPaymentMethod(
                  methods.enable_cash_denomination_for_payment_methods?.length
                );
              }
            }}
          >
            <UilCalender color="#fff" />
            <p className="text-sm font-semibold mt-[0.2rem] text-white">
              Schedule
            </p>
          </button>

          <button
            className={`${actionBtnClass} bg-orange-500 text-white hover:bg-orange-300 p-2 flex items-center gap-2 justify-center`}
            onClick={() => setHoldCartModal(true)}
          >
            <UilPauseCircle color="#fff" />
            <p className="text-sm font-semibold text-white">Hold</p>
          </button>

          <HoldSaleModal
            visible={holdCartModal}
            onClose={() => setHoldCartModal(false)}
            onConfirm={handleConfirm}
          />

          {editOrder?.orderitems && editOrder?.orderitems?.length !== 0 ? (
            <>
              <button
                className={`${actionBtnClass}  bg-yellow-600   hover:bg-yellow-500 p-2 flex gap-2 justify-center text-white `}
                onClick={() => {
                  if (selectedTable !== null || selectedTable !== undefined) {
                    setOrderId(editOrder?.id);
                    placeOrder(1);
                  } else {
                    setIsScheduled(false);

                    setShowPlaceModal(true);
                    __generataOrderId();
                    let methods = JSON.parse(
                      store_user?.business?.pos_settings
                    );

                    console.log(
                      JSON.parse(store_user?.business?.pos_settings),
                      ",,"
                    );
                    if (
                      methods?.enable_cash_denomination_for_payment_methods &&
                      methods.enable_cash_denomination_for_payment_methods
                        ?.length > 0
                    ) {
                      setPaymentMethod(
                        methods.enable_cash_denomination_for_payment_methods
                          ?.length
                      );
                    }
                  }
                }}
              >
                <UilArrowCircleRight color="#fff" />
                <p className="text-sm font-semibold mt-[0.2rem] ">Update </p>
              </button>
              <button
                className={`${actionBtnClass}  bg-green-600   hover:bg-green-500 p-2 flex gap-2 justify-center text-white `}
                onClick={() => {
                  setIsScheduled(false);
                  setShowPlaceModal(true);
                  setOrderId(editOrder?.id);

                  let methods = JSON.parse(store_user?.business?.pos_settings);

                  console.log(
                    JSON.parse(store_user?.business?.pos_settings),
                    ",,"
                  );
                  if (
                    methods?.enable_cash_denomination_for_payment_methods &&
                    methods.enable_cash_denomination_for_payment_methods
                      ?.length > 0
                  ) {
                    setPaymentMethod(
                      methods.enable_cash_denomination_for_payment_methods
                        ?.length
                    );
                  }
                }}
              >
                <UilArrowCircleRight color="#fff" />
                <p className="text-sm font-semibold mt-[0.2rem] ">Complete </p>
              </button>
            </>
          ) : (
            <button
              className={`${actionBtnClass}  bg-green-600   hover:bg-green-500 p-2 flex gap-2 justify-center text-white `}
              onClick={() => {
                if (selectedTable !== null) {
                  __generataOrderId();
                  placeOrder(1);
                } else {
                  setIsScheduled(false);

                  setShowPlaceModal(true);
                  __generataOrderId();
                  let methods = JSON.parse(store_user?.business?.pos_settings);

                  console.log(
                    JSON.parse(store_user?.business?.pos_settings),
                    ",,"
                  );
                  if (
                    methods?.enable_cash_denomination_for_payment_methods &&
                    methods.enable_cash_denomination_for_payment_methods
                      ?.length > 0
                  ) {
                    setPaymentMethod(
                      methods.enable_cash_denomination_for_payment_methods
                        ?.length
                    );
                  }
                }
              }}
            >
              <UilArrowCircleRight color="#fff" />
              <p className="text-sm font-semibold mt-[0.2rem] ">Place Order</p>
            </button>
          )}
        </div>
      )}
      {showPlaceModal && (
        <CustomModal
          onClose={() => {
            setShowPlaceModal(false);
          }}
        >
          <div className="flex flex-col  p-10" style={{ width: "1000px" }}>
            <div className="flex items-center justify-between border-b-2 border-gray-300 pb-5">
              <div className="flex flex-col  w-full ">
                <div>
                  <h3 className="text-lg font-bold">Order ID : #{orderId}</h3>
                </div>
                <div>
                  <h5 className="text-lg font-bold">
                    {cartState?.orderitems?.length} Items
                  </h5>
                </div>
                <div>
                  {/* <h5 className="text-lg font-bold">
                    {selectedCustomer?.name}
                  </h5> */}
                </div>
              </div>
              <div className="flex flex-col items-center w-full justify-end">
                <div className="flex  items-center w-full justify-end">
                  <div>
                    <h3 className="text-lg font-medium ">Payable Amount :</h3>
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-green-500 ml-10">
                      ₹ {cartState.totalPayableAmount}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex text-white items-center border-b-2 border-gray-300 ">
              <div className="text-black text-lg font-semibold w-full">
                Select Payment Mode
              </div>
              <div className="flex text-white items-center w-full">
                {paymentMethods.map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => dispatch(setPaymentMethod("cash"))}
                      className={`
                        font-bold  text-center
                        text-base p-3 
                          cursor-pointer w-full
                          
                          ${
                            cartState?.paymentMethod &&
                            cartState?.paymentMethod == item
                              ? "bg-ch-headers-500 "
                              : "hover:bg-ch-headers-500 hover:text-white bg-ch-headers-300"
                          }
                          `}
                    >
                      item
                    </div>
                  );
                })}
                <div
                  onClick={() => dispatch(setPaymentMethod("cash"))}
                  className={`
                        font-bold  text-center
                        text-base p-3 
                          cursor-pointer w-full
                          
                          ${
                            cartState?.paymentMethod &&
                            cartState?.paymentMethod == "cash"
                              ? "bg-ch-headers-500 "
                              : "hover:bg-ch-headers-500 hover:text-white bg-ch-headers-300"
                          }
                          `}
                >
                  Cash
                </div>
                <div
                  onClick={() => dispatch(setPaymentMethod("card"))}
                  className={`
                        font-bold  text-center
                        text-base p-3 
                          cursor-pointer w-full border-l-2 border-white
                          
                          ${
                            cartState?.paymentMethod &&
                            cartState?.paymentMethod == "card"
                              ? "bg-ch-headers-500 "
                              : "hover:bg-ch-headers-500 hover:text-white bg-ch-headers-300"
                          }
                          `}
                >
                  CARD
                </div>
                <div
                  onClick={() => dispatch(setPaymentMethod("Split"))}
                  className={`
                        font-bold  text-center
                        text-base p-3 
                          cursor-pointer w-full border-l-2 border-white
                          
                          ${
                            cartState?.paymentMethod &&
                            cartState?.paymentMethod == "Split"
                              ? "bg-ch-headers-500 "
                              : "hover:bg-ch-headers-500 hover:text-white bg-ch-headers-300"
                          }
                          `}
                >
                  Split
                </div>
                <div
                  onClick={() => dispatch(setPaymentMethod("Talabat"))}
                  className={`
                      font-bold  text-center
                      text-base p-3 
                        cursor-pointer w-full border-l-2 border-white
                        
                        ${
                          cartState?.paymentMethod &&
                          cartState?.paymentMethod == "Talabat"
                            ? "bg-ch-headers-500 "
                            : "hover:bg-ch-headers-500 hover:text-white bg-ch-headers-300"
                        }
                        `}
                >
                  Talabat
                </div>
                <div
                  onClick={() => dispatch(setPaymentMethod("other"))}
                  className={`
                      font-bold  text-center
                      text-base p-3 
                        cursor-pointer w-full border-l-2 border-white
                        
                        ${
                          cartState?.paymentMethod &&
                          cartState?.paymentMethod == "other"
                            ? "bg-chicket-500 "
                            : "hover:bg-ch-headers-500 hover:text-white bg-ch-headers-300"
                        }
                        `}
                >
                  Other
                </div>
              </div>
            </div>
            <div className="flex  mt-5">
              <div className="home__cart-items flex flex-col  flex-auto gap-1  w-[60%] overflow-y-scroll ">
                {/* <div className="max-h-[12rem] overflow-auto flex-auto gap-2 ">
                      {[...cartState?.orderitems]
                        ?.reverse()
                        .map((item, index) => {
                          return (
                            <CartItem key={item.id} index={index} item={item} />
                          );
                        })}
                    </div> */}
                <div className="flex items-center justify-between mt-5">
                  <div className="text-black text-sm font-medium">Subtotal</div>
                  <div className="text-black text-lg font-bold">
                    ₹ {cartState?.totalAmount.toFixed(3)}
                  </div>
                </div>

                <div className="flex items-center justify-between ">
                  <div className="text-black text-sm font-medium">Discount</div>
                  <div className="text-black text-lg font-bold">
                    ₹ {parseFloat(cartState?.discount)?.toFixed(3)}
                  </div>
                </div>
                {/* <div className="flex items-center justify-between ">
                  <div className="text-black text-sm font-medium">VAT</div>
                  <div className="text-black text-lg font-bold">
                    ₹ {cartState?.tax.toFixed(3)}
                  </div>
                </div> */}
                <div className="flex items-center justify-between ">
                  <div className="text-black text-sm font-medium">
                    Amount to be returned
                  </div>
                  <div className="text-green-500 text-lg font-bold">
                    ₹ {cartState?.amountToBeReturned.toFixed(3)}
                  </div>
                </div>
                <div className="flex items-center justify-between ">
                  <div className="text-black text-sm font-medium">
                    Balance Due
                  </div>
                  <div className="text-chicket-500 text-lg font-bold">
                    ₹ 0.000
                  </div>
                </div>
                <div className="flex items-center justify-between ">
                  <div className="text-black text-lg font-semibold">
                    Grand Total
                  </div>
                  <div className="text-black text-lg font-bold">
                    ₹ {cartState?.totalPayableAmount.toFixed(3)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className={`${actionBtnClass}  bg-yellow-500 mt-5  hover:bg-yellow-400 p-2 flex gap-2 justify-center text-white`}
                    onClick={() => {
                      let table = {
                        id: 1,
                        name: "T1",
                        status: TABLESTATES.READYTOBILL,
                        floor: FLOORS.BASEMENT,
                      };
                      dispatch(setselectedTable(table));

                      setTimeout(() => {
                        placeOrder(2);

                        // printThermal();
                      }, 200);
                    }}
                  >
                      <p
                      className="text-sm font-semibold mt-[0.2rem] "
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      Save
                    </p>
                  </button>
                  <button
                    className={`${actionBtnClass}  bg-blue-500 mt-5  hover:bg-blue-400 p-2 flex gap-2 justify-center text-white`}
                    onClick={() => {
                      let table = {
                        id: 1,
                        name: "T1",
                        status: TABLESTATES.READYTOBILL,
                        floor: FLOORS.BASEMENT,
                      };
                      dispatch(setselectedTable(table));

                      setTimeout(() => {
                        placeOrder(2);
                        printData(); // Call printData after placing the order
                      }, 200);
                    }}
                  >
                  
                      <p
                      className="text-sm font-semibold mt-[0.2rem] "
                   >
                      Receipt
                    </p>
                  </button>
                  <button
                    className={`${actionBtnClass}  bg-green-500 mt-5  hover:bg-green-400 p-2 flex gap-2 justify-center text-white`}
                    onClick={() => {
                      let table = {
                        id: 1,
                        name: "T1",
                        status: TABLESTATES.READYTOBILL,
                        floor: FLOORS.BASEMENT,
                      };
                      dispatch(setselectedTable(table));

                      setTimeout(() => {
                        if (
                          editOrder?.orderitems &&
                          editOrder?.orderitems?.length !== 0
                        ) {
                          // updateOrder(3);
                          alert(1);
                        } else {
                          alert(2);

                          //placeOrder(3);
                        }
                        // printThermal();
                      }, 200);
                    }}
                  >
                    <p className="text-sm font-semibold mt-[0.2rem] ">
                      KOT & Print
                    </p>
                  </button>
                </div>
              </div>
              <div className="w-[40%]">
                {isScheduled ? (
                  <div className="modal__numpad  bg-white text-black flex-auto  ml-10 flex flex-col justify-center gap-2 ">
                    <div>
                      <h3 className="text-lg font-medium ">
                        Choose schedule date :
                      </h3>
                    </div>
                    <div>
                      <Form
                        {...layout}
                        form={form}
                        name="nest-messages"
                        onFinish={onFinish}
                        validateMessages={validateMessages}
                      >
                        <Form.Item
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                          name={"schedule_date"}
                          label="Choose Schedule Date"
                        >
                          <Input type="date" />
                        </Form.Item>

                        <Form.Item
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                          name={"schedule_time"}
                          label="Choose Schedule Time"
                        >
                          <Input type="time" />
                        </Form.Item>
                        <Form.Item>
                          <button
                            htmltype="submit"
                            key={"save&add"}
                            className="px-3 rounded-lg   w-full py-2 bg-green-600 text-white font-bold transition-all hover:scale-90"
                          >
                            Confirm Schedule Details
                          </button>
                        </Form.Item>
                      </Form>
                      {/* <Calendar className="h-100" onChange={setScheduleDate} showWeekNumbers value={scheduleDate} minDate={new Date()} /> */}
                    </div>
                  </div>
                ) : null}
                <CartNumpad
                  totalPayableAmount={cartState?.totalPayableAmount}
                />
              </div>
            </div>
          </div>
        </CustomModal>
      )}

      {showModal && (
        <CustomModal
          onClose={() => {
            setShowModal(false);
            dispatch(clearCart());
          }}
        >
          <div className="p-10 flex items-center flex-col gap-3">
            <UilCheckCircle size="100" color="green" />
            <p className="text-lg font-black text-gray-800">
              Order Placed Successfully
            </p>
            <div className="w-full gap-4 rounded-lg flex justify-between p-10 items-center">
              <div className="cart__item-details flex-1">
                <p className="text-lg font-bold text-black mt-2">
                  Total Bill Amount: ₹ {cartState.totalPayableAmount.toFixed(3)}
                </p>
                <p className="text-lg font-bold text-black mt-2">
                  Total Paid: ₹ {cartState.amountToBeReturned.toFixed(3)}
                </p>
                <p className="text-lg font-bold text-black mt-2">
                  Amount Returned: ₹ {cartState.amountToBeReturned.toFixed(3)}
                </p>
                <p className="text-lg font-bold text-black mt-2">
                  Payment Method:{" "}
                  {cartState?.paymentMethod.replace(
                    /^./,
                    cartState?.paymentMethod[0].toUpperCase()
                  )}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="bg-blue-500 w-[100px] items-center text-white justify-center rounded-lg hover:bg-blue-400 p-2 flex gap-2">
                print
              </button>
              <button
                className="bg-red-500 w-[100px] items-center text-white justify-center rounded-lg hover:bg-green-400 p-2 flex gap-2"
                onClick={() => {
                  setShowModal(false);
                  dispatch(clearCart());
                }}
              >
                Close
              </button>
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default FooterActions;
