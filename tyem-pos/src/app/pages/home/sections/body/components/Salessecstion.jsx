import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaCalendar,
  FaClock,
  FaChevronDown,
} from "react-icons/fa";
import { Dropdown, Menu } from "antd";
import { FaPrint, FaDownload, FaUndoAlt } from "react-icons/fa"; // Ensure correct imports
import {
  MailOutlined,
  MessageOutlined,
  WhatsAppOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons"; // Import from @ant-design/icons
import { FaWhatsapp, FaShoppingCart } from "react-icons/fa"; // Import icons
import axios from "axios";
import { DateTime } from "luxon";
import jsPDF from "jspdf";
import "jspdf-autotable";

const OrderItem = ({ order, onClick, selected }) => {
  let formattedDate = "";
  let formattedTime = "";

  // Check if the order is PosOrder or WhatsAppOrder and format the date/time accordingly
  if (order.orderType === "PosOrder") {
    const utcDate = DateTime.fromISO(order.orderDetails?.orderDate, {
      zone: "utc",
    });
    const zonedDate = utcDate.setZone("Asia/Kolkata");
    formattedDate = zonedDate.toFormat("MMM dd, yyyy");
    formattedTime = zonedDate.toFormat("hh:mm:ss a");
  } else if (order.orderType === "WhatsAppOrder") {
    const utcDate = DateTime.fromISO(order.orderMeta?.orderDate, {
      zone: "utc",
    });
    const zonedDate = utcDate.setZone("Asia/Kolkata");
    formattedDate = zonedDate.toFormat("MMM dd, yyyy");
    formattedTime = zonedDate.toFormat("hh:mm:ss a");
  }

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
      onClick={() => onClick(order)}
      aria-label={`Order ${
        order.orderMeta?.posOrderId || order.orderDetails?.orderNumber
      } details`}
    >
      <div className="flex flex-1 items-center">
        {/* Badge for Order Type with Icon */}
        <span
          className={`px-1.5 py-1 text-xs font-medium text-gray-700 rounded-full bg-gray-100 flex items-center ${
            order.orderType === "WhatsAppOrder"
              ? "text-green-500 text-3xl animate-bounce ml-4"
              : "text-blue-500 text-3xl animate-bounce"
          }`}
        >
          {order.orderType === "WhatsAppOrder" ? (
            <FaWhatsapp />
          ) : (
            <FaShoppingCart />
          )}
        </span>

        <div className="ml-4">
          <h3 className="text-lg font-semibold">
            Order #
            {order.orderMeta?.posOrderId || order.orderDetails?.orderNumber}
          </h3>
          <p className="text-sm">
            {order.totalQuantity} Item{order.totalQuantity > 1 ? "s" : ""} |{" "}
            {order.orderMeta?.paymentTendered || order.total}{" "}
            {order.orderDetails[0]?.product_currency || "INR"} |{" "}
            {order.orderMeta?.orderType || order.method}
          </p>

          <div className="flex items-center mt-2">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded ${
                order.orderMeta?.paymentStatus === "Completed" ||
                order.orderDetails.paymentStatus === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {order.orderMeta?.paymentStatus || order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Date and Time Section */}
      <div className="text-right">
        <h1 className="text-md text-black">
          <FaCalendar className="inline mr-1" />
          {formattedDate}
        </h1>
        <h2 className="text-sm text-black">
          <FaClock className="inline mr-1" />
          {formattedTime}
        </h2>
      </div>
    </div>
  );
};

const OrderDetails = ({ order }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Declare formattedDate and formattedTime variables
  let formattedDate = "";
  let formattedTime = "";

  // Check if the order is PosOrder or WhatsAppOrder and format the date/time accordingly
  if (order?.orderType === "PosOrder") {
    const utcDate = DateTime.fromISO(order.orderDetails?.orderDate, {
      zone: "utc",
    });
    const zonedDate = utcDate.setZone("Asia/Kolkata");
    formattedDate = zonedDate.toFormat("MMM dd, yyyy");
    formattedTime = zonedDate.toFormat("hh:mm:ss a");
  } else if (order?.orderType === "WhatsAppOrder") {
    const utcDate = DateTime.fromISO(order.orderMeta?.orderDate, {
      zone: "utc",
    });
    const zonedDate = utcDate.setZone("Asia/Kolkata");
    formattedDate = zonedDate.toFormat("MMM dd, yyyy");
    formattedTime = zonedDate.toFormat("hh:mm:ss a");
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handlePrint = () => {
    window.print(); // Trigger print functionality
  };

  const handleDownload = () => {
    const doc = new jsPDF();

    // Add title and date
    doc.text("Order Details", 20, 20);
    doc.text(`Date: ${formattedDate}`, 20, 30);
    doc.text(`Time: ${formattedTime}`, 20, 40);

    // Add order details
    doc.autoTable({
      startY: 50,
      head: [
        [
          "Invoice Number",
          "Notes",
          "Subtotal",
          "Delivery Charge",
          "Total Amount",
          "Payment Method",
        ],
      ],
      body: [
        [
          order?.orderMeta?.posOrderId || "N/A",
          "WhatsAppOrder",
          `${order?.orderDetails?.[0]?.unit_price || "0"} INR`,
          "98 INR",
          `${order?.orderMeta?.paymentTendered || "0"} ${
            order?.orderDetails?.[0]?.product_currency || "INR"
          }`,
          order?.orderMeta?.paymentMethod || "Cash",
        ],
      ],
    });

    // Add customer details
    doc.text("Customer Details", 20, doc.lastAutoTable.finalY + 20);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 30,
      head: [["Name", "Phone Number", "Place", "Order Outstanding"]],
      body: [
        [
          order?.customer?.name || "N/A",
          order?.customer?.phone || "N/A",
          "Kasaragod",
          "",
        ],
      ],
    });

    // Save the PDF
    doc.save(`order_${order?.orderMeta?.posOrderId}.pdf`);
  };

  // Define delivery charge and discount values
  const deliveryCharge = "98 INR";
  const discountValue =
    order?.discount?.type === "fixed"
      ? `${order.discount.value} INR`
      : deliveryCharge;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 max-w-3xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 border-b pb-2">
          Payment Details
        </h3>
        <div className="relative mb-8">
          <button
            onClick={toggleDropdown}
            className="bg-gray-800 text-white font-bold py-2 px-4 rounded hover:bg-gray-900 flex items-center"
          >
            Invoice Options
            <FaChevronDown className="ml-2" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
              <button
                onClick={handlePrint}
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              >
                Print
              </button>
              <button
                onClick={handleDownload}
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              >
                Download
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold">Invoice Number</h4>
            Order #
            {order?.orderMeta?.orderType || order?.orderDetails?.invoiceNumber}
          </div>
          <div>
            <h4 className="font-semibold">OrderType</h4>
            Order #{order?.type || "WhatsAppOrder"}
          </div>
          <div className="text-right md:text-left">
            <h1 className="text-md text-black">
              <FaCalendar className="inline mr-1" />
              {formattedDate}
            </h1>
            <h2 className="text-sm text-black">
              <FaClock className="inline mr-1" />
              {formattedTime}
            </h2>
          </div>
          <div>
            <h4 className="font-semibold">Subtotal</h4>
            <p>
              {order?.orderDetails?.[0]?.unit_price ||
                order?.itemDetails?.total}{" "}
              INR
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Delivery Charge</h4>
            <p>{discountValue}</p>
          </div>
          <div>
            <h4 className="font-semibold">Total Amount</h4>
            <p>
              {order?.orderMeta?.paymentTendered || order?.itemDetails?.total}
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Payment Method</h4>
            <p>{order?.orderMeta?.paymentMethod || "Cash"}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 border-b pb-2">
          Customer Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold">Name</h4>
            <p>{order?.customer?.name || order?.orderDetails?.customerName}</p>
          </div>
          <div>
            <h4 className="font-semibold">Phone Number</h4>
            <p>{order?.customer?.phone || "N/A"}</p>
          </div>
          <div>
            <h4 className="font-semibold">Place</h4>
            <p>Kasaragod</p>
          </div>
          <div>
            <h4 className="font-semibold">Order Outstanding</h4>
            <p></p>
          </div>
        </div>
      </div>

      <div className="mb-8 text-center">
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
          Pay Outstanding
        </button>
      </div>

      <div className="flex justify-center items-center">
        <FaCheckCircle className="w-6 h-6 text-green-500 mr-2" />
        <span className="text-green-500 font-semibold">Transaction Synced</span>
      </div>
    </div>
  );
};

const CartSection = ({ order }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<FaPrint />}>
        Print
      </Menu.Item>
      <Menu.Item key="2" icon={<FaDownload />}>
        Download
      </Menu.Item>
      <Menu.Item key="3" icon={<MailOutlined />}>
        e-mail
      </Menu.Item>
      <Menu.Item key="4" icon={<MessageOutlined />}>
        sms
      </Menu.Item>
      <Menu.Item key="5" icon={<WhatsAppOutlined />}>
        WhatsApp
      </Menu.Item>
    </Menu>
  );

  // if (!order) {
  //   return (
  //     <div className="p-6 bg-gray-100 text-gray-500 rounded-lg">
  //       Select an order to view cart items.
  //     </div>
  //   );
  // }

  const renderItemDetails = () => {
    if (!order) return null;

    if (order.orderType === "PosOrder") {
      console.log("PosOrder items:", order.itemDetails);

      // Check if order.itemDetails exists and has the expected properties
      if (order.itemDetails && order.itemDetails.items > 0) {
        return (
          <div className="flex items-center justify-between p-4 bg-white rounded-md text-black mb-4">
            <span className="font-semibold">
              {order.itemDetails.itemName.join(", ")}
            </span>
            <span>{order.itemDetails.quantity}</span>
            <span>{order.itemDetails.total}</span>
          </div>
        );
      } else {
        return <p>No items found.</p>;
      }
    } else if (order.orderType === "WhatsAppOrder") {
      console.log("WhatsAppOrder items:", order.orderDetails);

      if (Array.isArray(order.orderDetails)) {
        return order.orderDetails.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white rounded-md text-black mb-4"
          >
            <span className="font-semibold">{item.product_name}</span>
            <span>{item.product_quantity}</span>
            <span>{item.unit_price}</span>
            <span>{item.product_currency}</span>
          </div>
        ));
      } else {
        return <p>No items found.</p>;
      }
    }
    return null;
  };

  // Handle the total calculation based on order type
  const calculateTotal = () => {
    if (!order) return 0;

    if (order.orderType === "PosOrder") {
      return order.itemDetails.total; // Use the total from PosOrder details
    } else if (order.orderType === "WhatsAppOrder") {
      // Assuming you have a way to calculate total for WhatsAppOrder
      return order.orderDetails.reduce(
        (acc, item) => acc + item.unit_price * item.product_quantity,
        0
      );
    }
    return 0;
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-800 text-white">
      <div className="flex-grow overflow-auto max-h-96">
        {renderItemDetails()}
      </div>

      {/* Summary and Actions */}
      <div
        className="mt-auto p-4 bg-gray-700 text-white rounded-lg"
        style={{ marginBottom: "42px" }}
      >
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Subtotal</span>
          <span>
            {order?.orderMeta?.paymentTendered || order?.itemDetails?.total}{" "}
            {order?.orderDetails[0]?.product_currency || "INR"}
          </span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total</span>
          <span>
            <h1>
              {calculateTotal()}{" "}
              {order?.orderDetails[0]?.product_currency || "INR"}
            </h1>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center gap-4 mt-6">
          <button className="flex-1 flex items-center justify-center bg-yellow-500 text-black py-2 px-4 rounded-lg hover:bg-yellow-600">
            <FaUndoAlt className="mr-2" /> Refund
          </button>
          <Dropdown
            overlay={menu} // Replace the inline dropdown content with the menu variable
            trigger={["click"]}
            onVisibleChange={(visible) => setDropdownVisible(visible)}
          >
            <button className="flex-1 flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
              Receipt{" "}
              {dropdownVisible ? (
                <UpOutlined className="ml-2" />
              ) : (
                <DownOutlined className="ml-2" />
              )}
            </button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

const SalesSection = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // WebSocket for WhatsAppOrder real-time updates
  useEffect(() => {
    const wsWhatsApp = new WebSocket("wss://tyem.invenro.com");

    wsWhatsApp.onmessage = (event) => {
      const newOrder = JSON.parse(event.data);
      console.log("New WhatsApp WebSocket Order:", newOrder);

      if (newOrder.orderMeta.paymentStatus === "Completed") {
        newOrder.orderType = "WhatsAppOrder";
        setOrders((prevOrders) => [newOrder, ...prevOrders]);
      }
    };

    return () => {
      wsWhatsApp.close();
    };
  }, []);

  // WebSocket for PosOrder real-time updates
  useEffect(() => {
    const wsPosOrder = new WebSocket("wss://tyem.invenro.com/pos");

    wsPosOrder.onmessage = (event) => {
      const newOrder = JSON.parse(event.data);
      console.log("New PosOrder WebSocket Order:", newOrder);

      if (newOrder.status === "COMPLETED") {
        newOrder.orderType = "PosOrder";
        setOrders((prevOrders) => [newOrder, ...prevOrders]);
      }
    };

    return () => {
      wsPosOrder.close();
    };
  }, []);

  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch WhatsApp Orders
        const responseWhatsApp = await axios.get(
          "https://tyem.invenro.com/api/user/Whatsappget"
        );
        console.log("WhatsApp API Response:", responseWhatsApp.data);

        // Fetch POS Orders
        const responsePosOrder = await axios.get(
          "https://tyem.invenro.com/api/user/PosOrder"
        );
        console.log("POS API Response:", responsePosOrder.data);

        // Filter completed orders and add orderType
        const completedWhatsAppOrders = responseWhatsApp.data
          .filter((order) => order.orderMeta.paymentStatus === "Completed")
          .map((order) => ({
            ...order,
            orderType: "WhatsAppOrder",
          }));

        const completedPosOrders = responsePosOrder.data
          .filter((order) => order.orderDetails.paymentStatus === "COMPLETED")
          .map((order) => ({
            ...order,
            orderType: "PosOrder",
          }));

        console.log(completedPosOrders, "completedPosOrders");

        setOrders([...completedWhatsAppOrders, ...completedPosOrders]);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Handler for when an order is selected
  const onOrderClick = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="flex h-screen">
      <div
        id="order-list"
        className="w-1/3 h-full p-4 border-r border-gray-300 bg-white overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100"
      >
        {orders.map((order) => (
          <OrderItem
            key={order._id}
            order={order}
            onClick={onOrderClick}
            selected={selectedOrder?._id === order._id}
          />
        ))}
      </div>
      <div className="hidden md:block w-1/3 h-full p-4 bg-white overflow-auto">
        <OrderDetails order={selectedOrder} />
      </div>
      <div className="hidden md:block w-1/3 h-full p-4 border-l border-gray-300 bg-white">
        <CartSection order={selectedOrder} />
      </div>
    </div>
  );
};

export default SalesSection;
