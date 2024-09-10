import React, { createContext, useState, useContext } from 'react';

// Create a context for completed orders
const CompletedOrdersContext = createContext();

export const CompletedOrdersProvider = ({ children }) => {
  const [completedOrders, setCompletedOrders] = useState([]);

  // Function to add a completed order
  const addCompletedOrder = (order) => {
    setCompletedOrders((prevOrders) => [...prevOrders, order]);
  };

  // Function to remove a completed order (if needed)
  const removeCompletedOrder = (orderId) => {
    setCompletedOrders((prevOrders) =>
      prevOrders.filter((order) => order._id !== orderId)
    );
  };

  return (
    <CompletedOrdersContext.Provider
      value={{ completedOrders, addCompletedOrder, removeCompletedOrder }}
    >
      {children}
    </CompletedOrdersContext.Provider>
  );
};

// Custom hook for using the CompletedOrdersContext
export const useCompletedOrders = () => useContext(CompletedOrdersContext);
