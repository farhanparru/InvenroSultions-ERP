import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DateTime } from 'luxon';
import { useParams } from 'react-router-dom';

const DevicesList = () => {
 
  const [selectedDeviceId, setSelectedDeviceId] = useState(null); // State to track selected device
  const [devices, setDevices] = useState([]); // State to store devices data

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/AllDevices');
        setDevices(response.data); // Assuming response.data contains the list of devices
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };
    fetchDevices();
  }, [id]);

  // Format device creation date and time using luxon
  const formatDateTime = (isoString) => {
    const utcDate = DateTime.fromISO(isoString, { zone: 'utc' });
    const zonedDate = utcDate.setZone('Asia/Kolkata');
    const formattedDate = zonedDate.toFormat('MMM dd, yyyy');
    const formattedTime = zonedDate.toFormat('hh:mm:ss a');
    return `${formattedDate} ${formattedTime}`;
  };

  // Handle row click to select and highlight a device
  const handleRowClick = (id) => {
    setSelectedDeviceId(id);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Kitchen Display System Heading */}
      <h1 className="text-3xl font-bold mb-6 text-center">Kitchen Display System</h1>

      {/* Additional UI: Search Bar and Description */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          This section shows all the connected devices in the kitchen display system with their respective creation date and time.
        </p>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search Devices"
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Devices Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Device Name</th>
            <th className="py-3 px-6 text-left">Location</th>
            <th className="py-3 px-6 text-left">Device Type</th>
            <th className="py-3 px-6 text-left">Creation Date & Time</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm">
          {devices.map((device) => (
            <tr
              key={device._id}
              onClick={() => handleRowClick(device._id)} // Set selected device on click
              className={`border-b border-gray-200 hover:bg-gray-100 cursor-pointer ${
                selectedDeviceId === device._id ? 'bg-blue-200' : ''
              }`} // Highlight row if selected
            >
              <td className="py-3 px-6 text-left">{device.Name}</td>
              <td className="py-3 px-6 text-left">{device.Location}</td>
              <td className="py-3 px-6 text-left">{device.Devices}</td>
              <td className="py-3 px-6 text-left">{formatDateTime(device.DevicesCreateDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DevicesList;
