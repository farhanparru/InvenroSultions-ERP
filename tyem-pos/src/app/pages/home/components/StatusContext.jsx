import React, { createContext, useContext, useState, useEffect } from "react";
import { FaClipboardCheck, FaBoxOpen, FaCheckCircle, FaUserTie, FaTimes } from "react-icons/fa";

import { DateTime } from "luxon"; // Make sure to import luxon

const OrderStatusContext = createContext();

export const OrderStatusProvider = ({ children }) => {
  const [ordersStatus, setOrdersStatus] = useState(() => {
    const storedStatus = JSON.parse(localStorage.getItem("ordersStatus"));
    return storedStatus || {};
  });

  useEffect(() => {
    localStorage.setItem("ordersStatus", JSON.stringify(ordersStatus));
  }, [ordersStatus]);

  const updateOrderStatus = (orderId, statusKey, value) => {
    const currentDateTime = DateTime.now().setZone("Asia/Kolkata").toISO(); // Current date and time in IST
    console.log(currentDateTime,"currentDateTime");
    
    setOrdersStatus((prev) => {
      const orderStatuses = prev[orderId] || {
        isAccepted: false,
        isReady: false,
        isAssigned: false,
        showPlaceModal: false,
        confirmedDate: "",
        readyDate: "",
        assignedDate: "",
        completedDate: "",
        rejectedDate: "", // Add this line if necessary
      };

      
      orderStatuses[statusKey] = value;
      if (value) {
        orderStatuses[`${statusKey}Date`] = currentDateTime;
      } else if (statusKey === "isAccepted") {
        orderStatuses.rejectedDate = currentDateTime; // Track rejection date if applicable
      }
  
      return { ...prev, [orderId]: orderStatuses };
    });
  };


  const getOrderStatuses = (orderId) => {
    return ordersStatus[orderId] || {
      isAccepted: false,
      isReady: false,
      isAssigned: false,
      showPlaceModal: false,
      confirmedDate: "",
      readyDate: "",
      assignedDate: "",
      completedDate: "",
      rejectedDate: "", // Add this line
    };
  };

  const statuses = (orderId) => {
    const orderStatuses = getOrderStatuses(orderId);

    return [

   
      {
        label: orderStatuses.isRejected ? "Rejected" : "Confirmed",
        completed: orderStatuses.isAccepted || orderStatuses.isRejected,
        icon: orderStatuses.isRejected ? <FaTimes className="text-white w-8 h-8" /> : <FaClipboardCheck className="text-white w-8 h-8" />,
        date: orderStatuses.confirmedDate
          ? DateTime.fromISO(orderStatuses.confirmedDate).toFormat("MMM dd, yyyy hh:mm:ss a")
          : "",
      },
      {
        label: "Ready",
        completed: orderStatuses.isReady,
        icon: <FaBoxOpen className="text-white w-8 h-8" />,
        date: orderStatuses.readyDate
          ? DateTime.fromISO(orderStatuses.readyDate).toFormat("MMM dd, yyyy hh:mm:ss a")
          : "",
      },
      {
        label: "Assigned",
        completed: orderStatuses.isAssigned,
        icon: <FaUserTie className="text-white w-8 h-8" />,
        date: orderStatuses.assignedDate
          ? DateTime.fromISO(orderStatuses.assignedDate).toFormat("MMM dd, yyyy hh:mm:ss a")
          : "",
        employee: orderStatuses.isAssigned ? "John Doe" : "",
      },
      {
        label: "Completed",
        completed: orderStatuses.showPlaceModal,
        icon: <FaCheckCircle className="text-white w-8 h-8" />,
        date: orderStatuses.completedDate
          ? DateTime.fromISO(orderStatuses.completedDate).toFormat("MMM dd, yyyy hh:mm:ss a")
          : "",
      },
    ];
  };

  return (
    <OrderStatusContext.Provider value={{ getOrderStatuses, updateOrderStatus, statuses }}>
      {children}
    </OrderStatusContext.Provider>
  );
};

export const useOrderStatus = () => useContext(OrderStatusContext);
