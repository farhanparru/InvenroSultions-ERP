import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUtensils, FaUser, FaReceipt, FaTable } from "react-icons/fa";

const getStatusColor = (status) => {
  switch (status) {
    case "newOrder":
      return "bg-red-500"; // Red for new orders
    case "free":
      return "bg-green-500"; // Green for free tables
    case "booked":
      return "bg-yellow-500"; // Yellow for booked
    default:
      return "bg-gray-200"; // Default gray
  }
};

const getIcon = (status) => {
  switch (status) {
    case "newOrder":
      return <FaReceipt className="text-white" />;
    case "free":
      return <FaUtensils className="text-white" />;
    case "booked":
      return <FaUser className="text-white" />;
    default:
      return null;
  }
};

const HomeTableSection = () => {
  const [floors, setFloors] = useState([]);
  const [selectedFloorId, setSelectedFloorId] = useState(null);
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch floors on component mount
  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user/getFloor");
        setFloors(response.data);
        if (response.data.length > 0) {
          setSelectedFloorId(response.data[0]._id); // Set the first floor as the default
          fetchTables(response.data[0]._id, "All"); // Fetch tables for the first floor by default
        }
      } catch (error) {
        console.error("Error fetching floors:", error);
      }
    };

    fetchFloors();
  }, []);

  // Fetch tables based on the selected floor and category
  const fetchTables = async (floorId, category) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/user/${floorId}/getTables`
      );
      const fetchedTables = response.data.data
        .filter((table) => (category === "All" ? true : table.category === category))
        .map((table) => ({
          id: table._id,
          label: table.name,
          status: table.isBlocked ? "booked" : "free", // Assuming blocked means booked
          category: table.category, // Ensure you have a category field in your data
        }));
      setTables(fetchedTables);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user/getWaIterOder");
        setOrders(response.data); // Save the orders in state
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleFloorClick = (floorId) => {
    setSelectedFloorId(floorId);
    fetchTables(floorId, selectedCategory); // Fetch tables when a floor button is clicked
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (selectedFloorId) {
      fetchTables(selectedFloorId, category); // Fetch tables based on new category
    }
  };

  // Update the status of tables based on new orders
  const updatedTables = tables.map((table) => {
    const associatedOrder = orders.find((order) =>
      order.tableIds.includes(table.id)
    );

    if (associatedOrder) {
      return {
        ...table,
        status: "newOrder", // Mark table as having a new order
        orderTime: associatedOrder.OdercreateDate, // Save the order creation time
      };
    }
    return table;
  });

  return (
    <div className="p-4">


      {/* Heading with Icon */}
      <div className="flex justify-center items-center mb-6">
        <FaTable className="text-3xl mr-2 text-blue-500" />
        <h2 className="text-2xl font-semibold text-blue-500">Table Overview</h2>
      </div>

      {/* Floor Selection Buttons */}
      <div className="mb-4">
        <label className="mr-2">Select Floor:</label>
        <div className="flex flex-wrap">
          {floors.map((floor) => (
            <button
              key={floor._id}
              onClick={() => handleFloorClick(floor._id)}
              className={`px-4 py-2 mx-2 rounded ${
                selectedFloorId === floor._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {floor.name}
            </button>
          ))}
        </div>
      </div>

      {/* Table Layout */}
      <div className="grid grid-cols-4 gap-4">
        {updatedTables.map((table) => (
          <div
            key={table.id}
            className={`p-4 text-center text-white rounded ${getStatusColor(
              table.status
            )}`}
          >
            <div className="flex justify-center items-center mb-2">
              {getIcon(table.status)}
            </div>
            <p>{table.label}</p>
            {table.status === "newOrder" && (
              <p className="text-sm mt-2">New Order Placed</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeTableSection;
