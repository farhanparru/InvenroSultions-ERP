import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Headr from "./Headr";
import SettingsNavbar from "./SettingsNavbar";  // Import SettingsNavbar
import SettingsSidebar from './SettingsSidebar'

const AccountSettings = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="flex min-h-screen">
     <SettingsSidebar /> {/* Replacing Sidebar with SettingsSidebar */}

      {/* Sidebar */}
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />

      {/* Main content area */}
      <div className="flex flex-col flex-grow bg-gray-100">
        {/* Header */}
        <Headr OpenSidebar={OpenSidebar} />

        {/* Settings Navbar */}
        <SettingsNavbar />

        {/* Main Content */}
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">Account & Settings</h1>

          {/* Subscription Info */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-semibold">Premium Plan</h2>
            <p>Next billing on: <strong>Dec 27, 2024</strong></p>
            <button className="bg-green-500 text-white px-4 py-2 rounded mt-2">
              Manage Subscription
            </button>
          </div>

          {/* Business Information */}
          <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Business Information</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Profile Name</label>
                <input
                  type="text"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded"
                  placeholder="Paicha"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Business Name</label>
                <input
                  type="text"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded"
                  placeholder="Paicha"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Brand Name</label>
                <input
                  type="text"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded"
                  placeholder="Paicha"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Calling Code</label>
                <input
                  type="text"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded"
                  placeholder="91"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="text"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded"
                  placeholder="9895639688"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Business Type</label>
                <input
                  type="text"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded"
                  placeholder="Restaurant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Website URL</label>
                <input
                  type="text"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded"
                  placeholder="Website URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Merchant Code</label>
                <input
                  type="text"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded"
                  placeholder="M0008402"
                  readOnly
                />
              </div>
            </form>
          </div>

          {/* Business Location */}
          <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Business Location</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Address Line 1</label>
                <input
                  type="text"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded"
                  placeholder="fgfg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Address Line 2</label>
                <input
                  type="text"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded"
                  placeholder="dfgfg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">City</label>
                <input
                  type="text"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded"
                  placeholder="Kasaragod"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Postal Code</label>
                <input
                  type="text"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded"
                  placeholder="671121"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Country</label>
                <select
                  className="mt-1 p-2 block w-full border border-gray-300 rounded"
                >
                  <option>India</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">State/Province/Region</label>
                <select
                  className="mt-1 p-2 block w-full border border-gray-300 rounded"
                >
                  <option>Kerala</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Business WhatsApp Number</label>
                <input
                  type="text"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded"
                  placeholder="Business WhatsApp Number"
                />
              </div>
            </form>
          </div>

          {/* Business Hours */}
          <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Business Hours</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Opening Time</label>
                <input
                  type="time"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Closing Time</label>
                <input
                  type="time"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
