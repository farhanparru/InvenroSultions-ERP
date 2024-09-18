import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SettingsNavbar = () => {
  const [activeTab, setActiveTab] = useState('Settings');
  const navigate = useNavigate(); // useNavigate for programmatic navigation

  const tabs = [
    'Settings',
    'Integrations',
    'Locations',
    'Devices',
    'POS Licences',
    'Payment Methods',
    'Unit Of Measurements',
    'Stock Adjustment Reason',
    'Item Tag',
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'Devices') {
      navigate('/devices'); // Navigate to the Devices route
    }
  };

  return (
    <div className="bg-white shadow-md p-4">
      <div className="flex space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium rounded ${
              activeTab === tab
                ? 'bg-purple-900 text-white'
                : 'text-purple-700 hover:bg-gray-100'
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsNavbar;
