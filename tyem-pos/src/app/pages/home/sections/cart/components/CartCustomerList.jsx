import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUserCircle,
  FaPlusCircle,
  FaPhone,
  FaUser,
  FaMapMarkerAlt,
  FaUserPlus,
} from "react-icons/fa";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactFlagsSelect from "react-flags-select";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
    border: "none",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

Modal.setAppElement("#root");

const CartCustomerList = ({ searchTerm, onSelectCustomer, selectedPhone, closeCustomerList,modalRef }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [warningModalIsOpen, setWarningModalIsOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerPlace, setNewCustomerPlace] = useState("");
  const [countryCode, setCountryCode] = useState("IN");
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // State to hold the selected customer

  const handleCustomerSelect = (customer) => {
    onSelectCustomer(customer);
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user/getCustomer");
        setCustomers(response.data.customers);
        setFilteredCustomers(response.data.customers);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    let filtered = [];

    if (searchTerm.startsWith("+") || searchTerm.match(/^\d+$/)) {
      filtered = customers.filter((customer) => customer.number.includes(searchTerm));
    } else {
      filtered = customers.filter((customer) => customer.name.toLowerCase().includes(lowerCaseSearchTerm));
    }

    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const countryToPhoneCode = {
    US: "1",
    GB: "44",
    AU: "61",
    DE: "49",
    FR: "33",
    IN: "91",
  };

  const handleAddCustomer = async () => {
    try {
      const phoneCode = countryToPhoneCode[countryCode];
      const formattedNumber = `+${phoneCode} ${newCustomerPhone}`;

      const response = await axios.post("https://tyem.invenro.com/api/user/addCustomer", {
        name: newCustomerName,
        number: formattedNumber,
        place: newCustomerPlace,
      });

      toast.success("Customer added successfully!", {
        position: toast?.POSITION?.TOP_RIGHT,
        autoClose: 3000,
      });

      setModalIsOpen(false);
      setNewCustomerName("");
      setNewCustomerPhone("");
      setNewCustomerPlace("");
      closeCustomerList();

      const updatedResponse = await axios.get("https://tyem.invenro.com/api/user/getCustomer");
      setCustomers(updatedResponse.data.customers);

    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message === "Customer already exists") {
        setWarningModalIsOpen(true);
      } else {
        toast.error("Failed to add customer!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      }
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    closeCustomerList();
  }

  const closeWarningModal = () => setWarningModalIsOpen(false);

  const openModal = () => {
    setNewCustomerPhone(selectedPhone);
    setModalIsOpen(true);
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Customer List</h2>
        <button className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={openModal}>
          <FaPlusCircle className="mr-2" /> New Customer
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto mt-4" >
        <ul className="space-y-3">
          {filteredCustomers.map((customer) => (
            <li
              key={customer._id}
              className={`flex items-center p-2 border-b border-gray-200 cursor-pointer ${
                selectedCustomer?._id === customer._id ? "bg-blue-500 text-white" : "bg-white"
              }`}
              onClick={() => {
                setSelectedCustomer(customer);
                handleCustomerSelect(customer);
              }}
            >
              <FaUserCircle className="w-8 h-8 text-gray-500 mr-3" />
              <span className="text-gray-800">{customer.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}   contentLabel="Add New Customer">
        <div className="flex items-center justify-center space-x-2">
          <FaUserPlus className="text-blue-500 text-2xl animate-pulse" />
          <h2 className="text-xl font-semibold mb-4 text-center">Add New Customer</h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddCustomer();
          }}
        >
          <div className="mb-4 flex items-center border-b border-gray-300 pb-2">
            <FaUser className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Customer Name"
              className="w-full px-3 py-2 border-none focus:outline-none"
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 flex items-center border-b border-gray-300 pb-2">
            <FaPhone className="text-gray-500 mr-3" size={30} />
            <ReactFlagsSelect
              selected={countryCode}
              onSelect={(code) => setCountryCode(code)}
              countries={["US", "GB", "AU", "DE", "FR", "IN"]}
              customLabels={{
                US: "United States +1",
                GB: "United Kingdom +44",
                AU: "Australia +61",
                DE: "Germany +49",
                FR: "France +33",
                IN: "India +91",
              }}
              placeholder="Select Country"
              showSelectedLabel={true}
              showOptionLabel={true}
              className="mr-2"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full px-3 py-2 border-none focus:outline-none"
              value={newCustomerPhone}
              onChange={(e) => setNewCustomerPhone(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 flex items-center border-b border-gray-300 pb-2">
            <FaMapMarkerAlt className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Place (Location)"
              className="w-full px-3 py-2 border-none focus:outline-none"
              value={newCustomerPlace}
              onChange={(e) => setNewCustomerPlace(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" className="bg-gray-500 text-white px-3 py-1 rounded mr-2 hover:bg-gray-600" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Add Customer
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={warningModalIsOpen} onRequestClose={closeWarningModal} style={customStyles}    ref={modalRef} contentLabel="Warning">
        <div className="text-center">
          <svg className="w-20 h-20 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">Customer already exists</h3>
          <button
            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2"
            onClick={closeWarningModal}
          >
            Yes, I'm sure
          </button>
          <button
            className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
            onClick={closeWarningModal}
          >
            No, cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CartCustomerList;
