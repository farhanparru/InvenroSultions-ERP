import React, { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export const useOrderContext = () => {
  return useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
  const [totalOrders, setTotalOrders] = useState(() => {
    // Retrieve totalOrders from localStorage, or default to 0 if not found
    const storedTotalOrders = localStorage.getItem("totalOrders");
    return storedTotalOrders ? parseInt(storedTotalOrders, 10) : 0;
  });

  useEffect(() => {
    // Store totalOrders in localStorage whenever it changes
    localStorage.setItem("totalOrders", totalOrders);
  }, [totalOrders]);

  return (
    <OrderContext.Provider value={{ totalOrders, setTotalOrders }}>
      {children}
    </OrderContext.Provider>
  );
};
