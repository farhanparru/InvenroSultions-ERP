import React, { useState,useEffect } from 'react';
import Sidebar from '../Sidebar'; // Assuming Sidebar is in the same directory
import SettingsNavbar from '../SettingsNavbar';
import Headr from '../Headr'; // Assuming Headr is in the same directory
import axios from 'axios'
import { FaEllipsisV } from 'react-icons/fa'; // Importing icon for actions
import CreateDeviceModal from './CreateDeviceModal';

const Devices = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
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
  }, []);


  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleAddDevice = () => {
    setIsModalOpen(true);  // Open modal
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Function to save device (you can replace this with your save logic)
  const handleSaveDevice = (newDevice) => {
    console.log('Device saved:', newDevice);
    // You can implement the logic to save the device (like making an API call)
    
    // Close modal after saving
    setIsModalOpen(false);
  };

  // Example device data (you can replace this with actual fetched data)
  // const devices = [
  //   { id: 10869, name: 'juice', code: 'C89C483B', type: 'KOT', location: 'Paicha' },
  //   { id: 10868, name: 'alfaham', code: '604B0D9B', type: 'KOT', location: 'Paicha' },
  //   { id: 10867, name: 'main', code: '52FA70B6', type: 'KOT', location: 'Paicha' },
  //   { id: 10788, name: 'waitor', code: '7354251D', type: 'KOT', location: 'Paicha' },
  //   { id: 9135, name: 'Tyem', code: '5F229431', type: 'PRINTER', location: 'BRANCH 1' },
  //   { id: 8312, name: 'Beverages', code: 'AB7E3AF8', type: 'KOT', location: 'Paicha' },
  //   { id: 8311, name: 'Kitchen', code: 'DDC0D374', type: 'KOT', location: 'Paicha' },
  // ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar component */}
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />

      {/* Main content area */}
      <div className="flex flex-col flex-grow">
        {/* Header component */}
        <Headr className="header" OpenSidebar={OpenSidebar} />

        {/* Settings Navbar component */}
        <SettingsNavbar />

        {/* Devices page content */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            {/* Filters */}
            <div className="flex space-x-4">
              <select className="border border-gray-300 rounded p-2">
                <option>Filter by Location</option>
                <option>Paicha</option>
                <option>BRANCH 1</option>
              </select>
              <select className="border border-gray-300 rounded p-2">
                <option>Select Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            {/* Add Device Button */}
            <button className="bg-purple-900 text-white px-4 py-2 rounded" onClick={handleAddDevice}>
              + Add Device
            </button>
          </div>

          {/* Devices Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-gray-600">ID</th>
                  <th className="px-4 py-2 text-left text-gray-600">Name</th>
                  <th className="px-4 py-2 text-left text-gray-600">Code</th>
                  <th className="px-4 py-2 text-left text-gray-600">Device Type</th>
                  <th className="px-4 py-2 text-left text-gray-600">Location</th>
                  <th className="px-4 py-2 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id} className="border-b">
                    <td className="px-4 py-2">{device.Name}</td>
                    <td className="py-3 px-6 text-left">{device.Devices}</td>
                    <td className="px-4 py-2">{device.type}</td>
                    <td className="px-4 py-2">{device.Location}</td>
                    <td className="px-4 py-2">
                      <button className="text-gray-500 hover:text-gray-700">
                        <FaEllipsisV />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Create Device Modal */}
          <CreateDeviceModal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal} 
            onSave={handleSaveDevice} 
          />
        </div>
      </div>
    </div>
  );
};

export default Devices;
