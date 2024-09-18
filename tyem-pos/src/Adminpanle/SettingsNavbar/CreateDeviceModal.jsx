import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import styles

// Call toast once at the top level of your application (if not done already)


const CreateDeviceModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [deviceType, setDeviceType] = useState('KOT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Function to handle form submission
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    const newDevice = {
      Name: name,
      Location: location,
      Devices: deviceType,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/user/Devices', newDevice);

      // Trigger the onSave function to update the parent component
      onSave(response.data);

      // Reset form fields
      setName('');
      setLocation('');
      setDeviceType('KOT');

      // Show success toast message
      toast.success("Device saved successfully!", {
        position: "top-right",
        autoClose: 3000, // Close after 3 seconds
      });

      // Close modal
      onClose();
    } catch (err) {
      console.error("Error saving device:", err);
      setError("Failed to save device. Please try again.");

      // Show error toast message
      toast.error("Failed to save device.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Device</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-600 hover:text-gray-900" />
          </button>
        </div>
        
        {/* Name input */}
        <div className="mb-4">
          <label className="block text-gray-700">Name *</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full border border-gray-300 p-2 rounded mt-1" 
            placeholder="Name" 
            required
          />
        </div>
        
        {/* Location input */}
        <div className="mb-4">
          <label className="block text-gray-700">Location *</label>
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            className="w-full border border-gray-300 p-2 rounded mt-1" 
            placeholder="Location" 
            required
          />
        </div>
        
        {/* Device type dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700">Device *</label>
          <select 
            value={deviceType} 
            onChange={(e) => setDeviceType(e.target.value)} 
            className="w-full border border-gray-300 p-2 rounded mt-1"
          >
            <option value="KOT">KOT</option>
            <option value="Printer">Printer</option>
            <option value="Waiter">Waiter</option>
          </select>
        </div>

        {/* Show error message if there's any */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {/* Save and Cancel buttons */}
        <div className="flex justify-end space-x-4">
          <button 
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-purple-900 text-white rounded hover:bg-purple-700" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Device'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDeviceModal;
