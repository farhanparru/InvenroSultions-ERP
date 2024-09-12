import React, { useState, useEffect } from "react";
import Headr from "./Headr"; // Adjust the path as necessary
import Sidebar from "./Sidebar"; // Adjust the path as necessary
import axios from "axios";
import Modal from "react-modal";

const Customers = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    place: "",
    number: "",
  });

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  // Function to fetch customers from API
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "https://tyem.invenro.site/api/user/getCustomer"
      );
      setCustomers(response.data.customers); // Assuming response has `customers` array
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  // Open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle input change for new customer form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({
      ...newCustomer,
      [name]: value,
    });
  };

  // Submit new customer data to the API
  const createCustomer = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://tyem.invenro.site/api/user/createCustomer",
        newCustomer
      );
      closeModal(); // Close modal after successful submission
      fetchCustomers(); // Refresh customer list
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  useEffect(() => {
    fetchCustomers(); // Fetch customer data when component mounts
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Headr className="header" OpenSidebar={OpenSidebar} />
      <div className="flex flex-grow">
        <Sidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />
        <div className="flex-grow p-4">
          <h1 className="text-2xl font-bold mb-4">Customers</h1>
          <div className="mb-4 flex flex-wrap items-center justify-between">
            {/* Filter Inputs */}
            <div className="flex flex-wrap items-center space-x-2">
              <input
                type="text"
                placeholder="Filter by Name, Code, Email"
                className="border border-gray-300 rounded px-2 py-1"
              />
              <select className="border border-gray-300 rounded px-2 py-1">
                <option>All Groups</option>
              </select>
              <select className="border border-gray-300 rounded px-2 py-1">
                <option>All Employee</option>
              </select>
              <button className="border border-purple-500 text-purple-500 rounded px-4 py-1">
                More Filters
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button className="border border-purple-500 text-purple-500 rounded px-4 py-1">
                Login To Online Store
              </button>

              <button
                onClick={openModal}
                className="bg-purple-500 text-white rounded px-4 py-1"
              >
                + Create Customer
              </button>

              <button className="border border-purple-500 text-purple-500 rounded px-4 py-1">
                Export
              </button>
            </div>
          </div>

          {/* Customer Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm leading-4 text-gray-500 tracking-wider">
                    Customer
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm leading-4 text-gray-500 tracking-wider">
                    Email
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm leading-4 text-gray-500 tracking-wider">
                    Phone
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm leading-4 text-gray-500 tracking-wider">
                    Credits
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm leading-4 text-gray-500 tracking-wider">
                    Outstanding
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm leading-4 text-gray-500 tracking-wider">
                    Reward Points
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm leading-4 text-gray-500 tracking-wider">
                    Created Date
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm leading-4 text-gray-500 tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="bg-gray-100 border-b border-gray-200"
                  >
                    <td className="py-2 px-4">{customer.name}</td>
                    <td className="py-2 px-4">{customer.email || "N/A"}</td>
                    <td className="py-2 px-4">{customer.number}</td>
                    <td className="py-2 px-4">0</td>
                    <td className="py-2 px-4">
                      <span className="text-black">₹0.00</span>
                    </td>
                    <td className="py-2 px-4">0</td>
                    <td className="py-2 px-4">
                      {new Date(customer.customeraddDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">
                      <button className="bg-purple-500 text-white py-1 px-3 rounded mr-2">
                        View
                      </button>
                      <button className="bg-red-500 text-white py-1 px-3 rounded">
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Create Customer Modal */}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Create Customer Modal"
            className="modal"
            overlayClassName="overlay"
            ariaHideApp={false} // Optional, to avoid warnings in development
          >
            <h2 className="text-2xl font-bold mb-4">Create New Customer</h2>
            <form onSubmit={createCustomer}>
              <div className="mb-4">
                <label className="block text-gray-700">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newCustomer.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Place:</label>
                <input
                  type="text"
                  name="place"
                  value={newCustomer.place}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone:</label>
                <input
                  type="text"
                  name="number"
                  value={newCustomer.number}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="border border-gray-500 text-gray-500 rounded px-4 py-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-500 text-white rounded px-4 py-1"
                >
                  Create
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Customers;
