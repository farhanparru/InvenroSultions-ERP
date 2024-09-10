import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import { Element } from "react-scroll";
import notificationSound from "../../../../../../assets/Moto Notification Ringtone Download - MobCup.Com.Co.mp3";
import { FaTruck } from "react-icons/fa";
import axios from "axios";
import {
  fetchOrders,
  connectWebSocket,
} from "../../../../../../services/apiService.js";
import { useDispatch, useSelector } from "react-redux";
import CartNumpad from "../../../../../../app/pages/home/components/CartNumpad.jsx";
import CustomModal from "../../../../../components/CustomModal.jsx";
import { clearCart, setPaymentMethod } from "../../../store/cartSlice.js";
import OrderNotification from "./OrderNotification.jsx";
import { DateTime } from "luxon";
import { FaCheckCircle, FaRegCircle, FaUserTie } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useOrderContext } from "./OrderContext.jsx";
import { useOrderStatus } from "../../../components/StatusContext.jsx";
import { FaCalendar, FaClock } from "react-icons/fa"; // Adjust the import according to your icon library
import { useCompletedOrders } from "./CompletedOrdersContext.jsx";

// OrderItem component
const OrderItem = ({ order, onClick, selected }) => {
  const [orderStatus, setOrderStatus] = useState(order.orderMeta.paymentStatus);

  const totalQuantity = order.orderDetails.reduce(
    (sum, item) => sum + item.product_quantity,
    0
  );

  const statusColors = {
    Confirmed: "bg-green-200 text-green-800",
    Ready: "bg-yellow-200 text-yellow-800",
    Assigned: "bg-blue-200 text-blue-800",
    Completed: "bg-purple-200 text-purple-800",
    Pending: "bg-gray-200 text-gray-800",
    Rejected: "bg-red-200 text-red-800",
    Cancelled: "bg-gray-500 text-gray-200",
    Accepted: "bg-green-300 text-green-900", // Added 'Accepted' status
  };

  const updateStatus = async (newStatus) => {
    try {
      const response = await axios.patch(
        `https://tyem.invenro.site/api/user/PaymentStatus/${order._id}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response.status === 200) {
        setOrderStatus(newStatus);
        console.log("Order status updated:", response.data);
      } else {
        console.error("Failed to update order status:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating order status:", error.message || error);
    }
  };

  // Convert UTC to IST
  const utcDate = DateTime.fromISO(order.orderMeta.orderDate, { zone: "utc" });
  const zonedDate = utcDate.setZone("Asia/Kolkata");
  const formattedDate = zonedDate.toFormat("MMM dd, yyyy");
  const formattedTime = zonedDate.toFormat("hh:mm:ss a");

  return (
    <div
      className={`p-3 mb-3 rounded-lg shadow-md flex justify-between items-center border cursor-pointer 
        ${
          selected
            ? "bg-blue-500 border-blue-500 text-white"
            : "bg-white border-gray-200"
        }
        ${selected ? "" : "hover:bg-blue-100 hover:border-blue-300"}
       
      `}
      onClick={() => onClick(order)}
      aria-label={`Order ${order.orderMeta?.posOrderId} details`}
    >
      <div>
        <h3 className="text-lg font-semibold">
          Order #{order.orderMeta?.posOrderId} | INV# {order._id}
        </h3>
        <p className="text-sm">
          {totalQuantity} Item{totalQuantity > 1 ? "s" : ""} |
          {order.orderMeta?.paymentTendered}{" "}
          {order.orderDetails[0]?.product_currency} |{" "}
          {order.orderMeta.orderType}
        </p>

        <div className="flex items-center mt-2">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded ${
              statusColors[orderStatus] || statusColors.Pending
            }`}
          >
            {orderStatus || "Pending"}
          </span>

          {order.new && (
            <span className="ml-2 px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded">
              New
            </span>
          )}
        </div>
      </div>
      <div className="text-right">
        <h1 className="text-md  text-black">
          <FaCalendar className="inline mr-1" />
          {formattedDate}
        </h1>
        <h2 className="text-sm  text-black">
          <FaClock className="inline mr-1" />
          {formattedTime}
        </h2>
      </div>
    </div>
  );
};

const OrderStatusHistory = ({ order }) => {
  const { statuses } = useOrderStatus();

  // Define a color mapping for the status
  const statusColors = {
    Confirmed: "bg-green-500",
    Ready: "bg-yellow-500",
    Assigned: "bg-blue-500",
    Completed: "bg-purple-500",
    Rejected: "bg-red-500", // Add color for Rejected
  };

  // Assuming you have a way to filter the statuses based on the selected order
  const orderStatuses = statuses(order._id);

  console.log(orderStatuses, "gg");

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        {orderStatuses?.map((status, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Status Icon */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                status.completed ? statusColors[status.label] : "bg-gray-300"
              }`}
            >
              {status.icon}
            </div>

            {/* Connector Line */}
            {index < orderStatuses.length - 1 && (
              <div
                className={`absolute top-1/2 left-full transform -translate-y-1/2 w-20 h-1 ${
                  orderStatuses[index + 1].completed
                    ? statusColors[orderStatuses[index + 1].label]
                    : "bg-gray-300"
                }`}
              ></div>
            )}

            {/* Status Details */}
            <div className="mt-2 text-center">
              <span
                className={`block text-sm font-semibold ${
                  status.completed ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {status.label}
              </span>
              <h3 className="text-lg font-semibold">{status.label}</h3>
              {status.date && (
                <p className="text-sm text-gray-600">
                  {`Date: ${DateTime.fromISO(status.date).toFormat(
                    "MMM dd, yyyy hh:mm:ss a"
                  )}`}
                </p>
              )}
              {status.employee && (
                <p className="text-sm text-gray-600">
                  {`Handled by: ${status.employee}`}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// OrderDetails component
const OrderDetails = ({ order }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 max-w-3xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 border-b pb-2">Order Details</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold">Order ID</h4>
            <p>#{order.orderMeta.posOrderId}</p>
          </div>
          <div>
            <h4 className="font-semibold">Invoice Number</h4>
            <p>{order._id}</p>
          </div>
          <div>
            <h4 className="font-semibold">Order Type</h4>
            <p>WhatsAppOrder</p>{" "}
            {/* Ensure orderType is available in the order object */}
          </div>
          <div>
            <h4 className="font-semibold">Total Items</h4>
            <p>{order.orderDetails.length}</p>
          </div>
          <div>
            <h4 className="font-semibold">Subtotal</h4>
            <p>
              {order.orderMeta.paymentTendered}{" "}
              {order.orderDetails[0].product_currency}
            </p>
          </div>
          <div>
            <h4 className="font-semibold flex items-center">
              <FaTruck className="mr-2 text-gray-500" /> Delivery Charge
            </h4>
            <p>
              {order.orderMeta.deliveryCharge}{" "}
              {order.orderDetails[0].product_currency}
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Total Amount</h4>
            <p>
              {order.orderMeta.paymentTendered}{" "}
              {order.orderDetails[0].product_currency}
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Payment Method</h4>
            <p>Null</p>{" "}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 border-b pb-2">
          Customer Details
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold">Name</h4>
            <p>{order.customer.name}</p>
          </div>
          <div>
            <h4 className="font-semibold">Phone Number</h4>
            <p>{order.customer.phone}</p>
          </div>
          <div>
            <h4 className="font-semibold">Place</h4>
            <p>Kasaragod</p>{" "}
            {/* Ensure place is available in the order object */}
          </div>
          <div>
            <h4 className="font-semibold">Latitude & Longitude</h4>
            <p>Null</p>{" "}
            {/* Ensure latitude and longitude are available in the order object */}
          </div>
        </div>
      </div>

      {/* <OrderStatusHistory  /> */}
    </div>
  );
};
// CartSection component
const CartSection = ({
  order,
  onComplete,
  onCancel,
  pauseNotificationSound,
  orders,
  onOrderAccept, // New prop
}) => {
  const updatePaymentStatus = async (orderId, statusKey, statusValue) => {
    try {
      await axios.patch(
        `https://tyem.invenro.site/api/user/PaymentStatus/${orderId}`,
        {
          [statusKey]: statusValue,
        }
      );
    } catch (error) {
      console.error(
        "Error updating payment status:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const { updateOrderStatus, getOrderStatuses } = useOrderStatus();
  const [paymentMethods, setpaymentMethods] = useState([]);
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);
  const selectedCustomer = useSelector(
    (state) => state.customer.selectedCustomer
  );

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

  const [isAccepted, setIsAccepted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [showActions, setShowActions] = useState(true); // New state for button visibility
  const [isRejected, setIsRejected] = useState(false);

  // send Message for Whtsapp
  const sendMessage = async () => {
    try {
      const apiToken = "6916%7CTkrkgYrXFqr6MdA1uQfdNOPcLwDXtrQyoHTxPlft";
      const phoneNumberId = "301969286337576";
      const templateId = "95869";
      const templateVariables = {
        name: `${order.customer.name}`,
        billno: `${order.orderMeta.posOrderId}`,
        systemCartTotalPrice: `${order.orderMeta.paymentTendered}`,
        phoneNumber: `${order.customer.phone}`,
      };

      const url = `https://app.xpressbot.org/api/v1/whatsapp/send/template?apiToken=${apiToken}&phone_number_id=${phoneNumberId}&template_id=${templateId}&templateVariable-name-1=${templateVariables.name}&templateVariable-billno-2=${templateVariables.billno}&templateVariable-system-cart-total-price-3=${templateVariables.systemCartTotalPrice}&phone_number=${templateVariables.phoneNumber}`;

      await axios.get(url);
      toast.success(`Message sent successfully to ${order.customer.phone}!`);
    } catch (error) {
      console.error("Error sending message:", error.response || error.message);
      toast.error("Failed to send message.");
    }
  };


  const sendcustomeField = async () => {
    try {
      const apiToken = "6916|TkrkgYrXFqr6MdA1uQfdNOPcLwDXtrQyoHTxPlft";
      const phoneNumberId = "301969286337576";
      const phoneNumber = "919895639688";
      const customFieldname = 'BillNumber'; // Your custom field value
      const customeFieldValue = "12345678"
  
      const url = `https://app.xpressbot.org/api/v1/whatsapp/subscriber/chat/assign-custom-fields`;
  
      await axios.post(url, {
        apiToken,
        phone_number_id: phoneNumberId,
        phone_number: phoneNumber,
        custom_fields: {
          custom_field_name: customFieldname,
          custom_field_value: customeFieldValue,
        }
      });

   
  
      toast.success(`Custom field sent successfully to ${phoneNumber}!`);
    } catch (error) {
      console.error("Error sending custom field:", error.response || error.message);
      toast.error("Failed to send custom field.");
    }
  };
  
  

  


  // Retrieve order statuses for the current order
  //  const orderStatuses = getOrderStatuses(order._id);
  const handleAccept = (orderId) => {
    pauseNotificationSound(); // Stop the sound when "Accept" is clicked
    setIsAccepted(true);
    setIsReady(false);
    setIsAssigned(false);
    setIsRejected(false);
    onComplete(orderId); // Call the onComplete function if needed
    // sendMessage();
    updatePaymentStatus(orderId, "status", "Accepted");
    updateOrderStatus(orderId, "isAccepted", true);
    updateOrderStatus(orderId, "confirmedDate", new Date().toISOString());
    onComplete(order._id); // Call the completion handler
    updateOrderStatus(orderId, "isRejected", false); // Ensure rejected is false
  };

  const handleReady = (orderId) => {
    updatePaymentStatus(orderId, "isReady", true);
    updateOrderStatus(order._id, "isReady", true);
    setIsReady(true);
    setIsAssigned(false);
    setIsRejected(false);
  };

  const { addCompletedOrder } = useCompletedOrders();

  const handleComplete = async (orderId) => {
    setShowPlaceModal(true);
    updatePaymentStatus(orderId, "status", "Completed");
    await onComplete(orderId);
    updateOrderStatus(order._id, "showPlaceModal", true);
    onComplete(order._id); // Call the completion handler

    // Add completed order to the context
    const completedOrder = orders.find((order) => order._id === orderId);
    addCompletedOrder(completedOrder);

    onComplete(orderId); // Optionally notify parent
    onOrderAccept(orderId); // Decrease the badge count in HomeOrdersSection
  };

  const handleReject = (orderId) => {
    setIsAccepted(false);
    setIsReady(false);
    setIsAssigned(false);
    setIsRejected(true);// Update the state to indicate the order is rejected
    updatePaymentStatus(orderId, "status", "Rejected");
    updateOrderStatus(orderId, "isAccepted", false); // Update order status
    updateOrderStatus(orderId, "isRejected", true);
  };

  const handleCancel = (orderId) => {
    setIsAccepted(false);
    setIsAssigned(false);
    setIsReady(false);
    onCancel(orderId);
    updatePaymentStatus(orderId, "status", "Cancelled");
  };

  const handleAssigned = (orderId) => {
    setIsAssigned(true);
    setIsReady(false);
    setIsRejected(false);
    updatePaymentStatus(orderId, "status", "Assigned");
    updateOrderStatus(order._id, "isAssigned", true);
  };
  // Status History Data

  const handlePrintReceipt = async (orderData, orderId) => {
    console.log(orderData);

    try {
      // Sending the order data to the backend for printing
      await axios.post(
        "https://tyem.invenro.site/api/print/printreceipt",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Receipt printed successfully.");
    } catch (error) {
      console.error("Error printing receipt:", error);
      alert("Failed to print receipt.");
    }
  };

  if (!order) {
    return (
      <div className="p-6 bg-gray-100 text-gray-500 rounded-lg">
        Select an order to view cart items.
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full p-4 bg-gray-800 text-white">
      {/* Cart Items */}
      <div className="flex-grow overflow-auto max-h-96">
        {order.orderDetails.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white rounded-md text-black mb-4"
          >
            <span className="font-semibold">{item.product_name}</span>
            <span>{item.product_quantity}</span>
            <span>{item.unit_price}</span>
            <span>{item.product_currency}</span>
          </div>
        ))}
      </div>

      {/* Summary and Actions */}
      <div
        className="mt-auto p-4 bg-gray-700 text-white rounded-lg"
        style={{ marginBottom: "42px" }}
      >
        {/* Subtotal */}
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Subtotal</span>
          <span>
            {order.orderMeta.paymentTendered}{" "}
            {order.orderDetails[0]?.product_currency}
          </span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total</span>
          <span>
            {order.orderMeta.paymentTendered}{" "}
            {order.orderDetails[0]?.product_currency}
          </span>
        </div>

   
        <div className="flex justify-between items-center gap-4 mt-6">
        {/* Conditionally render buttons based on order status */}
        {!isAccepted && !isRejected && (
          <>
            <button
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              onClick={() => handleAccept(order._id)}
            >
              Accept
            </button>

            <button
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              onClick={() => handleReject(order._id)}
            >
              Reject
            </button>
          </>
        )}

        {isAccepted && !isReady && !isAssigned && (
          <>
            <button
              className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700"
              onClick={() => handleReady(order._id)}
            >
              Ready
            </button>

            <button
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              onClick={() => handleCancel(order._id)}
            >
              Cancel
            </button>
          </>
        )}

        {isReady && !isAssigned && (
          <>
            <button
              className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700"
              onClick={() => handleAssigned(order._id)}
            >
              Assigned
            </button>

            <button
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              onClick={() => handleCancel(order._id)}
            >
              Cancel
            </button>
          </>
        )}

        {isAssigned && (
          <>
            <button
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              onClick={() => handleComplete(order._id)}
            >
              Complete
            </button>

            <button
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              onClick={() => handleCancel(order._id)}
            >
              Cancel
            </button>
          </>
        )}

        {isRejected && (
          <div className="text-red-500 font-semibold">
            Order has been rejected
          </div>
        )}

        {order.status === "Completed" && (
          <div className="text-green-500 font-semibold">
            Order has been completed
          </div>
        )}
      </div>
    </div>



      {showPlaceModal && (
        <CustomModal
          onClose={() => {
            setShowPlaceModal(false);
          }}
        >
          <div className="flex flex-col p-10" style={{ width: "1000px" }}>
            <div className="flex items-center justify-between border-b-2 border-gray-300 pb-5">
              <div className="flex flex-col w-full">
                <h3 className="text-lg font-bold">
                  Order ID : #{order.orderId}
                </h3>
                <h5 className="text-lg font-bold">
                  {cartState?.orderitems?.length} Items
                </h5>
                <h5 className="text-lg font-bold">{selectedCustomer?.name}</h5>
              </div>
              <div className="flex flex-col items-center w-full justify-end">
                <div className="flex items-center w-full justify-end">
                  <h3 className="text-lg font-medium">Payable Amount :</h3>
                  <h2 className="text-2xl font-extrabold text-green-500 ml-10">
                    ₹ {order.orderMeta.paymentTendered}
                  </h2>
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
              <div className="home__cart-items flex flex-col  flex-auto gap-1  w-[60%] overflow-y-scroll "></div>
            </div>

            <div className="flex mt-5">
              <div className="home__cart-items flex flex-col flex-auto gap-1 w-[60%] overflow-y-scroll">
                <div className="flex items-center justify-between mt-5">
                  <div className="text-black text-sm font-medium">Subtotal</div>
                  <div className="text-black text-lg font-bold">
                    ₹ {order.orderMeta.paymentTendered}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-black text-sm font-medium">Discount</div>
                  <div className="text-black text-lg font-bold">
                    ₹ {parseFloat(cartState?.discount)?.toFixed(3)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-black text-sm font-medium">VAT</div>
                  <div className="text-black text-lg font-bold">
                    ₹ {cartState?.tax.toFixed(3)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-black text-sm font-medium">
                    Amount to be returned
                  </div>
                  <div className="text-green-500 text-lg font-bold">
                    ₹ {cartState?.amountToBeReturned.toFixed(3)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-black text-sm font-medium">
                    Balance Due
                  </div>
                  <div className="text-chicket-500 text-lg font-bold">
                    ₹ 0.000
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-black text-lg font-semibold">
                    Grand Total
                  </div>
                  <div className="text-black text-lg font-bold">
                    ₹ {order.orderMeta.paymentTendered}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="bg-yellow-500 mt-5 hover:bg-yellow-400 p-2 flex gap-2 justify-center items-center text-white w-32 h-10"
                    onClick={() => {
                      let table = {
                        id: 1,
                        name: "T1",
                        status: "READYTOBILL",
                        floor: "BASEMENT",
                      };
                      dispatch(setselectedTable(table));
                      setTimeout(() => placeOrder(2), 200);
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="bg-blue-500 mt-5 hover:bg-blue-400 p-2 flex gap-2 justify-center items-center text-white w-32 h-10"
                    onClick={handlePrintReceipt}
                  >
                    Receipt
                  </button>
                  <button
                    className="bg-green-500 mt-5 hover:bg-green-400 p-2 flex gap-2 justify-center items-center text-white w-32 h-10"
                    onClick={() => {
                      let table = {
                        id: 1,
                        name: "T1",
                        status: "READYTOBILL",
                        floor: "BASEMENT",
                      };
                      dispatch(setselectedTable(table));
                      setTimeout(() => placeOrder(3), 200);
                    }}
                  >
                    KOT & Print
                  </button>
                </div>
              </div>

              <div className="w-[40%]">
                <CartNumpad
                  totalPayableAmount={cartState?.totalPayableAmount}
                />
              </div>
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  );
};



// Main HomeOrdersSection component
const HomeOrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(
    orders.length > 0 ? orders[0] : null
  );
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null); // Manage status here
  const { totalOrders, setTotalOrders } = useOrderContext(); // Access context values

  useEffect(() => {
    if (orders.length > 0) {
      setSelectedOrder(orders[0]); // Set the first order as the default selected order
    }
  }, [orders]);

  // Play notification sound
  const playNotificationSound = () => {
    const newAudio = new Audio(notificationSound);
    newAudio.loop = true;
    //HomeOrdersSection.jsx:782 Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD
    newAudio.play();
    setAudio(newAudio);

    setTimeout(() => {
      newAudio.pause();
      newAudio.currentTime = 0;
      setSoundPlaying(false);
    }, 5 * 60 * 1000); // Stop sound after 5 minutes
  };

  const pauseNotificationSound = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setSoundPlaying(false);
    }
  };

  // Fetch orders and set up WebSocket
  useEffect(() => {
    const fetchAndSetOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data); // Set the fetched orders to state
        setTotalOrders(data.length); // Update context value
      } catch (error) {
        console.error("Error fetching initial orders:", error);
      }
    };

    fetchAndSetOrders();

    const socket = connectWebSocket((newOrder) => {
      setOrders((prevOrders) => {
        const updatedOrders = [newOrder, ...prevOrders]; // Add new order to the top
        setTotalOrders(updatedOrders.length); // Update context value
        setSoundPlaying(true); // Play sound when a new order is received
        return updatedOrders;
      });
    });

    return () => {
      socket.close();
      if (audio) {
        audio.pause(); // Ensure audio is stopped if the component unmounts
      }
    };
  }, [audio, setTotalOrders]);

  // Handle sound playing state
  useEffect(() => {
    if (soundPlaying) {
      playNotificationSound();
    }
  }, [soundPlaying]);

  const handleComplete = (orderId) => {
    console.log(`Order ${orderId} accepted`);
    setOrderStatus("Completed");
  };

  const handleCancel = (orderId) => {
    console.log(`Order ${orderId} rejected`);
    setOrderStatus("Cancelled");
  };

  // Function to sort orders by posOrderId in descending order
  const sortOrdersByPosOrderId = (orders) => {
    return orders
      .slice()
      .sort((a, b) => b.orderMeta?.posOrderId - a.orderMeta.posOrderId);
  };

  // Sort orders whenever the orders prop changes
  const sortedOrders = sortOrdersByPosOrderId(orders);
  const mostRecentOrder = sortedOrders[0]; // Assuming the first item is the most recent after sorting

  const onOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handlecomplete = (orderId) => {
    // Your order completion logic
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order._id !== orderId)
    );
    setTotalOrders((prevCount) => prevCount - 1);
  };

  return (
    <div className=" flex h-screen">
      <OrderNotification setOrders={setOrders} />
      <div
        id="order-list"
        className="w-1/3 h-full p-4 border-r border-gray-300 bg-white overflow-y-auto"
      >
        {sortedOrders.map((order) => (
          <OrderItem
            key={order._id}
            order={order}
            onClick={onOrderClick}
            selected={selectedOrder?._id === order._id}
            isMostRecent={order._id === mostRecentOrder._id} // Pass the prop to highlight the most recent order
          />
        ))}
      </div>
      <div className="w-1/3 h-full p-4 bg-white overflow-auto">
        {selectedOrder ? (
          <>
            <OrderDetails order={selectedOrder} />
            <OrderStatusHistory order={selectedOrder} />{" "}
            {/* Add OrderStatusHistory */}
          </>
        ) : (
          <p className="text-gray-500">Select an order to view details.</p>
        )}
      </div>
      <div className="w-1/3 h-full p-4 border-l border-gray-300 bg-white">
        {selectedOrder ? (
          <CartSection
            order={selectedOrder} // Always render CartSection
            onComplete={handleComplete}
            onCancel={handleCancel}
            pauseNotificationSound={pauseNotificationSound}
            orders={orders}
            // updateOrderStatus={handleOrderAccept} // Pass the updated handler
            onOrderAccept={handlecomplete}
          />
        ) : (
          <p className="text-gray-500">Select an order to view the cart.</p>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default HomeOrdersSection;
