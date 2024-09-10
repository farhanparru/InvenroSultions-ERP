import React, { useState, useEffect } from "react";
import { FaUser, FaUserPlus, FaPrint, FaMoneyCheckAlt, FaFileExport, FaCalendarAlt, FaClock } from "react-icons/fa";
import { Drawer } from "antd";
import CustomerDetails from "./CustomerDetails";
import AddCustomerModal from "../components/AddCustomerModal";
import SearchBar from "./SearchBar";
import { DateTime } from 'luxon'; // Import Luxon for date/time formatting

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // New state to track the search query

  useEffect(() => {
    // Fetch customers from the API
    fetch("https://tyem.invenro.site/api/user/getCustomer")
      .then((response) => response.json())
      .then((data) => {
        setCustomers(data.customers); // Assuming the data structure returned from the API
        setSelectedCustomer(data.customers[0]); // Set the first customer as selected by default
      })
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setDrawerVisible(true);
  };

  // Function to format date and time
  const formatDateTime = (date) => {
    const utcDate = DateTime.fromJSDate(new Date(date), { zone: "utc" });
    const zonedDate = utcDate.setZone("Asia/Kolkata");
    return {
      date: zonedDate.toFormat("MMM dd, yyyy"),
      time: zonedDate.toFormat("hh:mm:ss a"),
    };
  };

  // Filter customers based on the search query
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.number.includes(searchQuery)
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {/* Pass setSearchQuery to SearchBar to handle input changes */}
          <SearchBar setSearchQuery={setSearchQuery} /> 
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-blue-600 transition duration-300 ease-out border-2 border-blue-600 rounded-full shadow-md group"
            onClick={() => setOpen(true)}
          >
            <FaUserPlus className="mr-2" />
            Add Customer
          </button>
          <button className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-blue-600 transition duration-300 ease-out border-2 border-blue-600 rounded-full shadow-md group hover:animate-pulse">
            <span className="absolute inset-0 w-full h-full bg-blue-600 transition-all duration-300 ease-out transform translate-x-full group-hover:translate-x-0 group-hover:scale-105"></span>
            <span className="absolute inset-0 w-full h-full border-2 border-blue-600 transition-all duration-300 ease-out transform translate-x-0 translate-y-full group-hover:translate-y-0"></span>
            <span className="absolute inset-0 w-full h-full bg-white transition-all duration-300 ease-out transform group-hover:bg-blue-600 group-hover:scale-105"></span>
            <span className="relative flex items-center space-x-2 text-blue-600 transition-colors duration-300 ease-in-out group-hover:text-white">
              <FaPrint className="text-lg animate-spin-slow group-hover:text-white" />
              <span>Print</span>
            </span>
          </button>
          <button className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-blue-600 transition duration-300 ease-out border-2 border-blue-600 rounded-full shadow-md group hover:animate-bounce">
            <FaMoneyCheckAlt className="mr-2" />
            Pay Outstanding
          </button>
        </div>
      </div>

      <div className="flex justify-between mb-2">
        <span>
          Showing {filteredCustomers.length} / {customers.length} customers
        </span>
        <a href="#" className="flex items-center text-blue-500 space-x-2 group">
          <FaFileExport className="text-xl transition-transform duration-300 transform group-hover:rotate-45 group-hover:scale-110" />
          <span className="transition-colors duration-300 group-hover:text-blue-700">
            Export
          </span>
        </a>
      </div>

      <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100 h-96"> {/* Added height class */}
        {filteredCustomers.map((customer, index) => {
          const { date, time } = formatDateTime(customer.customeraddDate);

          return (
            <div
              key={index}
              className={`p-4 mb-4 flex items-center rounded border cursor-pointer hover:bg-gray-100 transition-all duration-200 ${
                selectedCustomer === customer
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
              onClick={() => handleCustomerClick(customer)}
            >
              <div className="mr-4">
                <FaUser className="text-4xl text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold">{customer.name}</p>
                <p className="text-sm text-gray-500">Location: {customer.place}</p>
                <p className="text-sm">{customer.number}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <FaCalendarAlt className="mr-2" />
                  <span>Added on: {date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <FaClock className="mr-2" />
                  <span>At: {time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddCustomerModal isOpen={open} setOpen={setOpen} />

      {selectedCustomer && (
        <Drawer
          width="30%"
          placement="right"
          closable
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
        >
          <CustomerDetails customer={selectedCustomer} />
        </Drawer>
      )}
    </div>
  );
};

export default CustomerList;
