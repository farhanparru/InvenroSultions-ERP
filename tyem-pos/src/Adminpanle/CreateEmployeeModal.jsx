import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateEmployeeModal = ({ isOpen, onClose }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    fourDigitPasscode: "",
    sixDigitPasscode: "",
    type: "",
    email: "",
    phone: "",
    roles: "",
    location: "",
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }

    // Validate location
    if (!formData.location) {
      toast.error('Location is required.');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/user/createEmploye', formData);
      toast.success('Employee created successfully!');

      // Clear form data
      setFormData({
        name: "",
        password: "",
        fourDigitPasscode: "",
        sixDigitPasscode: "",
        type: "",
        email: "",
        phone: "",
        roles: "",
        location: "",
      });

      // Close the modal after a short delay to allow the toast to display
      setTimeout(() => {
        onClose();
      }, 2000);  // Delay closing the modal by 2 seconds to show the toast
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error('Failed to create employee!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-lg w-2/3 max-w-4xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Create Employee</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            &#x2715;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name and Type Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                required
              >
                <option>Select Type</option>
                <option>staff</option>
                <option>delivery</option>
                <option>waiter</option>
              </select>
            </div>
          </div>

          {/* Password and 6 Digit Passcode Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <AiFillEyeInvisible size={20} />
                  ) : (
                    <AiFillEye size={20} />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                6 Digit Passcode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sixDigitPasscode"
                value={formData.sixDigitPasscode}
                onChange={handleChange}
                placeholder="6 Digit Passcode"
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                required
              />
            </div>
          </div>

          {/* 4 Digit Passcode and Email Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                4 Digit Passcode
              </label>
              <input
                type="text"
                name="fourDigitPasscode"
                value={formData.fourDigitPasscode}
                onChange={handleChange}
                placeholder="4 Digit Passcode"
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                required
              />
            </div>
          </div>

          {/* Phone and Roles Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Roles <span className="text-red-500">*</span>
              </label>
              <select
                name="roles"
                value={formData.roles}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                required
              >
                <option>Select Roles</option>
                <option>Admin</option>
                <option>Employe</option>
              </select>
            </div>
          </div>

          {/* Locations Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Locations
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
              required
            >
              <option value="">Select Location</option>
              <option>Location 1</option>
              <option>Location 2</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
            >
              Create Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployeeModal;
