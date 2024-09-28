import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUtensils, FaUser, FaReceipt, FaTable } from "react-icons/fa";
import HomeTopBar from "../../HomeTopBar";

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

  // Fetch floors on component mount
  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const response = await axios.get("https://tyem.invenro.com/api/user/getFloor");
        setFloors(response.data);
        fetchTables("All"); // Fetch all tables initially
      } catch (error) {
        console.error("Error fetching floors:", error);
      }
    };

    fetchFloors();
  }, []);

  // Fetch tables based on the selected floor
  const fetchTables = async (floorId) => {
    try {
      let response;
      if (floorId === "All") {
        response = await axios.get("https://tyem.invenro.com/api/user/getAllTables");
      } else {
        response = await axios.get(`https://tyem.invenro.com/api/user/${floorId}/getTables`);
      }

      const fetchedTables = response.data?.data.map((table) => ({
        id: table._id,
        label: table.name,
        status: table.isBlocked ? "booked" : "free",
      }));

      setTables(fetchedTables);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  // Fetch orders on component mount and at intervals
  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://tyem.invenro.com/api/user/getWaIterOder");
      setOrders(response.data); // Save the orders in state
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Use effect for fetching orders every X seconds
  useEffect(() => {
    fetchOrders(); // Initial fetch

    const intervalId = setInterval(fetchOrders, 10000); // Fetch every 10 seconds
    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  const handleFloorClick = (floorId) => {
    setSelectedFloorId(floorId);
    fetchTables(floorId); // Fetch tables when a floor button is clicked
  };

  // Function to calculate time difference between the order time and current time
  const calculateTimeElapsed = (orderTime) => {
    const currentTime = new Date();
    const orderDateTime = new Date(orderTime);
    const diffInSeconds = Math.floor((currentTime - orderDateTime) / 1000);

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    return { hours, minutes, seconds };
  };

  // Update the status of tables based on new orders
  const updatedTables = tables?.map((table) => {
    const associatedOrder = orders.find((order) =>
      order.tableIds.includes(table.id)
    );

    if (associatedOrder) {
      const { hours, minutes, seconds } = calculateTimeElapsed(associatedOrder.OdercreateDate);

      return {
        ...table,
        status: "newOrder", // Mark table as having a new order
        orderTime: associatedOrder.OdercreateDate, // Save the order creation time
        timeElapsed: { hours, minutes, seconds },
      };
    }
    return table;
  });

  // Real-time updating of time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTables((prevTables) =>
        prevTables.map((table) => {
          if (table.status === "newOrder" && table.orderTime) {
            const { hours, minutes, seconds } = calculateTimeElapsed(table.orderTime);
            return { ...table, timeElapsed: { hours, minutes, seconds } };
          }
          return table;
        })
      );
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [orders]);

  return (
    <div className="p-4">
    <HomeTopBar />
      {/* Heading with Icon */}
      <div className="flex justify-center items-center mb-6">
        <FaTable className="text-3xl mr-2 text-blue-500" />
        <h2 className="text-2xl font-semibold text-blue-500">Table Overview</h2>
      </div>

      {/* Floor Selection Buttons */}
      <div className="mb-4">
        <div className="flex flex-wrap justify-center">
          {/* Add "All" button */}
          <button
            onClick={() => handleFloorClick("All")}
            className={`px-4 py-2 mx-2 rounded ${
              selectedFloorId === "All" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>
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
        {updatedTables?.map((table) => (
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
              <p className="text-sm mt-2">
                Order placed for: {table.timeElapsed.hours}h {table.timeElapsed.minutes}m {table.timeElapsed.seconds}s
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeTableSection;
