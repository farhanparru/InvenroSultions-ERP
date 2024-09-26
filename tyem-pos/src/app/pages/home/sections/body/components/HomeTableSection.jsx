import React, { useState, useEffect } from "react";
import { FaUtensils, FaUser, FaReceipt, FaTable } from "react-icons/fa"; 
import axios from 'axios'

const getStatusColor = (status, hasNewOrder) => {
  if (hasNewOrder) return "bg-red-500"; // Red for tables with new orders
  switch (status) {
    case "booked":
      return "bg-green-500"; // Green for booked tables
    case "free":
      return "bg-blue-500"; // Blue for free tables
    case "bill":
      return "bg-yellow-500"; // Yellow for bill
    default:
      return "bg-gray-200"; // Default gray
  }
};

const getIcon = (status) => {
  switch (status) {
    case "booked":
      return <FaUser className="text-white" />;
    case "free":
      return <FaUtensils className="text-white" />;
    case "bill":
      return <FaReceipt className="text-white" />;
    default:
      return null;
  }
};

const HomeTableSection = () => {
  const [tables, setTables] = useState([]); // Initialize table data
  const [newOrderTables, setNewOrderTables] = useState([]); // Track tables with new orders
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Fetch orders and find the tables with new orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://loaclhsot:8000/api/user/getWaIterOder");
      const data = await response.json();
      
      // Extract table IDs that have new orders
      const newOrderTableIds = data.reduce((acc, order) => {
        return [...acc, ...order.tableIds];
      }, []);
      
      setNewOrderTables(newOrderTableIds);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Fetch table data from API
  const fetchTables = async () => {
    try {
      const response = await axios.get("https://localhost:8000/api/user/getTableData"); // Replace with the actual table API endpoint
      console.log(response,"hiiii");
      
      const data = await response.json();
      setTables(data); // Assuming `data` is the list of tables with their categories and labels
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  useEffect(() => {
    fetchTables(); // Fetch tables once on component mount
    fetchOrders(); // Fetch orders as well

    // Poll for new orders every 30 seconds (optional)
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const filteredTables =
    selectedCategory === "All"
      ? tables
      : tables.filter((table) => table.category === selectedCategory);

  return (
    <div className="p-4">
      {/* Heading with Icon */}
      <div className="flex justify-center items-center mb-6">
        <FaTable className="text-3xl mr-2 text-blue-500" /> {/* Table icon */}
        <h2 className="text-2xl font-semibold text-blue-500">Table Overview</h2> {/* Heading */}
      </div>

      {/* Category Filter Buttons */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => handleCategoryChange("All")}
          className={`px-4 py-2 mx-2 rounded ${
            selectedCategory === "All"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleCategoryChange("Party Hall")}
          className={`px-4 py-2 mx-2 rounded ${
            selectedCategory === "Party Hall"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Party Hall
        </button>
        <button
          onClick={() => handleCategoryChange("Ground Floor")}
          className={`px-4 py-2 mx-2 rounded ${
            selectedCategory === "Ground Floor"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Ground Floor
        </button>
        <button
          onClick={() => handleCategoryChange("Hall")}
          className={`px-4 py-2 mx-2 rounded ${
            selectedCategory === "Hall"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Hall
        </button>
      </div>

      {/* Table Layout */}
      <div className="grid grid-cols-4 gap-4">
        {filteredTables.map((table) => (
          <div
            key={table._id} // Assuming the table object has an _id field
            className={`p-4 text-center text-white rounded ${getStatusColor(
              table.status,
              newOrderTables.includes(table._id) // Check if table has a new order
            )}`}
          >
            <div className="flex justify-center items-center mb-2">
              {getIcon(table.status)}
            </div>
            <p>{table.label}</p>
            {table.time && <p className="text-sm mt-2">{table.time}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeTableSection;
