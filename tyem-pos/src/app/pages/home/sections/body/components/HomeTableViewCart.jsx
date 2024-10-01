import { useEffect, useState } from "react";
import {
  FaPrint,
  FaTimes,
  FaCheck,
  FaCalendar,
  FaClock,
  FaArrowLeft,
} from "react-icons/fa";
import {
  FaEdit,
  FaArrowsAlt,
  FaCodeBranch,
  FaExchangeAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";

import Modal from "react-modal"; // Make sure this import is present

// Set up for accessibility (required for react-modal)
Modal.setAppElement("#root");

// Header Component
Modal.setAppElement("#root");

// Header Component
const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Start with modal closed
  const navigate = useNavigate();

  const backTable = () => {
    navigate("/tables");
  };

  const openModal = () => {
    setIsModalOpen(true);
    console.log("Modal opened"); // Check if this logs correctly
  };

  const closeModal = () => {
    setIsModalOpen(false);
    console.log("Modal closed"); // Check if this logs correctly
  };

  return (
    <div>
      <div
        className="flex justify-between items-center py-4 px-6 bg-white border-b"
        style={{ width: "67%" }}
      >
        {/* Left: Back to Table button */}
        <button
          onClick={backTable}
          className="px-4 py-2 border rounded text-blue-500 border-blue-500 hover:bg-blue-50 flex items-center space-x-2"
        >
          <FaArrowLeft />
          <span>Back To Table</span>
        </button>

        {/* Middle: Table Info */}
        <div className="text-center">
          <span className="font-semibold">Table: F2</span>
          <span className="mx-2">•</span>
          <span className="font-semibold">6 Seats</span>
          <span className="mx-2">•</span>
          <span className="text-red-500 font-semibold">Occupied</span>
        </div>

        {/* Right: New Order button */}
        <button
          onClick={openModal}
          className="px-4 py-2 border rounded text-blue-500 border-blue-500 hover:bg-blue-50"
        >
          + New Order
        </button>
      </div>

      {/* Modal for Assign Waiter */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Assign Waiter Modal"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="bg-black bg-opacity-50 fixed inset-0"
      >
        <div className="bg-white w-full max-w-md mx-auto p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Assign Waiter</h2>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>

          {/* Select Waiter */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Select Waiter
            </label>
            <select className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select your option</option>
              {/* Add waiter options here */}
            </select>
          </div>

          {/* Number of Guests */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Number Of Guests
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number of guests"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end mt-6">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded mr-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Continue
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// OrderItem Component (Already provided)
const OrderItem = ({ order, onSelect, selected }) => {
  const totalAmount = order.items.reduce( (total, item) => total + item.price * item.quantity, 0 ); // Assuming each item has price and quantity fields

  return (
    <div
      className={`relative p-3 mb-3 rounded-lg shadow-md flex justify-between items-center border cursor-pointer
        ${
          selected
            ? "bg-blue-500 border-blue-500 text-white"
            : "bg-white border-gray-200"
        }
        ${selected ? "" : "hover:bg-blue-100 hover:border-blue-300"}
      `}
      onClick={() => onSelect(order)}
    >
      <div className="flex flex-1 items-center">
        <div className="ml-4">
          <h3 className="text-lg font-semibold">
            Quantity: {order.items.length}
          </h3>
          <p className="text-sm">Total Amount: ₹{totalAmount.toFixed(2)}</p>
          <p className="text-sm">
            Order Created: {new Date(order.OdercreateDate).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Date and Time Section */}
      <div className="text-right">
        <h1 className="text-md text-black">
          <FaCalendar className="inline mr-1" />
        </h1>
        <h2 className="text-sm text-black">
          <FaClock className="inline mr-1" />
        </h2>
      </div>
    </div>
  );
};

// OrderDetails Component (Already provided)
// OrderDetails Component
const OrderDetails = ({ order }) => {
  if (!order) return null; // Handle case when no order is provided

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 max-w-3xl mx-auto relative">
      {/* Order Details Header with Buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col"></div>

        <div className="flex space-x-2">
          <button className="px-4 py-2 border rounded text-blue-500 border-blue-500 hover:bg-blue-50 flex items-center space-x-2">
            <FaEdit />
            <span>Edit</span>
          </button>

          <button className="px-4 py-2 border rounded text-blue-500 border-blue-500 hover:bg-blue-50 flex items-center space-x-2">
            <FaCodeBranch />
            <span>Split</span>
          </button>

          <button className="px-4 py-2 border rounded text-blue-500 border-blue-500 hover:bg-blue-50 flex items-center space-x-2">
            <FaExchangeAlt />
            <span>Merge</span>
          </button>

          <button className="px-4 py-2 border rounded text-blue-500 border-blue-500 hover:bg-blue-50 flex items-center space-x-2">
            <FaArrowsAlt />
            <span>Move</span>
          </button>
        </div>
      </div>

      {/* Order Information */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold">Bill Number:</h4>
            <p>{order.billnumber}</p>
          </div>
          <div>
            <h4 className="font-semibold">Status</h4>
            <p className="text-red-500 font-semibold">Pending</p>
          </div>
          <div>
            <h4 className="font-semibold">Category:</h4>
            <p>{order.priceCategory}</p>{" "}
            {/* Assuming priceCategory is part of the order */}
          </div>
          <div>
            <h4 className="font-semibold">Waiter</h4>
            <p>Shuhaib</p>
          </div>
          <div>
            <h4 className="font-semibold">Date & Time</h4>
            <p>{new Date(order.OdercreateDate).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* KOT History Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 border-b pb-2">KOT History</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <h4 className="font-semibold">S.No.</h4>
          </div>
          <div>
            <h4 className="font-semibold">Item Name</h4>
          </div>
          <div>
            <h4 className="font-semibold">Quantity</h4>
          </div>
          <div>
            <h4 className="font-semibold">Status</h4>
          </div>
        </div>

        {/* Render KOT Items */}

        {/* Render KOT Items */}
        {order.items.map((item, index) => (
          <div
            key={item._id}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
          >
            <p>{index + 1}</p> {/* Serial Number */}
            <p>{item.itemName}</p>
            <p>{item.quantity}</p>
            <p>{item.notes || "N/A"}</p>{" "}
            {/* Assuming status can be represented with notes or set to "N/A" if empty */}
          </div>
        ))}
      </div>
    </div>
  );
};

// CartSection Component (Already provided)
const CartSection = ({ orders }) => {
  const totalAmount = orders.reduce((total, order) => {
    return (
      total +
      order?.items.reduce(
        (subtotal, item) => subtotal + item.price * item.quantity,
        0
      )
    );
  }, 0);

  return (
    <div className="flex flex-col h-full p-4 bg-gray-800 text-white">
      <div className="flex-grow overflow-auto max-h-96">
        {/* Displaying items in cart */}
        {orders.map((order) => (
          <div key={order?._id} className="mb-2">
            {order?.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2 px-4 bg-white text-black rounded-lg mb-2 border border-gray-300"
              >
                <div className="flex-1">
                  <span className="font-semibold">
                    {item.itemName.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-1 justify-end items-center">
                  <span className="mx-2">₹{item.price.toFixed(2)}</span>
                  <span className="mx-2">x {item.quantity}</span>
                  <span className="font-semibold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Summary and Actions */}
      <div className="mt-auto p-4 bg-gray-700 rounded-lg" style={{marginBottom:"34px","width":"103%","marginLeft":"-6px"}}>
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Subtotal:</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-between items-center gap-4 mt-6">
          {/* Print Button */}
          <button className="flex-1 flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
            <FaPrint className="mr-2" /> Print
          </button>

          {/* Cancel Button */}
          <button className="flex-1 flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
            <FaTimes className="mr-2" /> Cancel
          </button>

          {/* Complete Button */}
          <button className="flex-1 flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
            <FaCheck className="mr-2" /> Complete
          </button>
        </div>
      </div>
    </div>
  );
};

// Main SalesSection Component
const SalesSection = () => {
  const { tableId } = useParams(); // Get tableId from URL params
  const [waiterOrders, setWaiterOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order

  useEffect(() => {
    const fetchWaiterOrders = async () => {
      try {
        const response = await axios.get(
          `https://tyem.invenro.com/api/user/${tableId}/getWaiterOrder`
        );
        console.log(response.data);

        const orders = response.data;
        setWaiterOrders(orders);

        // Set the first order as the default selected order if it exists
        if (orders.length > 0) {
          setSelectedOrder(orders[0]);
        }
      } catch (error) {
        console.error("Error fetching waiter orders:", error);
      }
    };

    fetchWaiterOrders();
  }, [tableId]); // Fetch orders again when tableId changes

  const handleOrderSelect = (order) => {
    setSelectedOrder(order); // Update the selected order when an order is clicked
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header Section */}
      <Header />

      {/* Content Section */}
      <div className="flex flex-grow">
        {/* Order List Section */}
        <div
         id="order-list"
          className="w-full md:w-1/3 h-full p-4 border-r border-gray-300 bg-white overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100"
          style={{ maxHeight: "100vh" }} // Ensuring full viewport height for scrolling
        >
          {waiterOrders.map((order) => (
            <OrderItem
              key={order._id}
              order={order}
              onSelect={handleOrderSelect}
              selected={selectedOrder?._id === order._id} // Highlight selected order
            />
          ))}
        </div>

        {/* Order Details Section */}
        <div className="hidden md:block w-full md:w-1/3 h-full p-4 bg-white overflow-auto">
          <OrderDetails order={selectedOrder} /> {/* Display selected order details */}
        </div>

        {/* Cart Section */}
        <div
          className="hidden md:block w-full md:w-1/3 h-full p-4 border-l border-gray-300 bg-white"
          style={{ marginTop: "-74px" }}
        >
          <CartSection orders={[selectedOrder]} /> {/* Pass selected order to CartSection */}
        </div>
      </div>
    </div>
  );
};

export default SalesSection;
