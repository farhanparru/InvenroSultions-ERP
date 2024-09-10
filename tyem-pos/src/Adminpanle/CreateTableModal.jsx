import React, { useState } from 'react';

const CreateTableModal = ({ isOpen, onClose }) => {
  const [tableData, setTableData] = useState({
    name: '',
    seatingCapacity: '',
    priceCategory: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Handle form submission (e.g., API call to save the data)
    console.log(tableData);
    onClose(); // Close the modal after saving
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-semibold">Create Table</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        {/* Form Content */}
        <div className="mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Table Number"
              value={tableData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Seating Capacity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="seatingCapacity"
              placeholder="Seating Capacity"
              value={tableData.seatingCapacity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Price Category
            </label>
            <select
              name="priceCategory"
              value={tableData.priceCategory}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="">Select Price Category</option>
              <option value="Parcel">Parcel</option>
              <option value="Dine-In">Dine-In</option>
            </select>
          </div>
        </div>

  
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="bg-purple-600 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTableModal;
