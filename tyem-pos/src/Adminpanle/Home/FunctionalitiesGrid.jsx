import React from 'react';
import { FaTachometerAlt, FaShoppingCart, FaFileAlt, FaBox, FaUsers, FaUserTie, FaWarehouse, FaUtensils, FaGift, FaFileImport, FaFileExport, FaStore, FaCog } from 'react-icons/fa';

const functionalities = [
  { name: 'Dashboard', icon: FaTachometerAlt },
  { name: 'Sales', icon: FaShoppingCart },
  { name: 'Reports', icon: FaFileAlt },
  { name: 'Items', icon: FaBox },
  { name: 'Customers', icon: FaUsers },
  { name: 'Employees', icon: FaUserTie },
  { name: 'Inventory Management', icon: FaWarehouse },
  { name: 'Restaurant Management', icon: FaUtensils },
  { name: 'Loyalty Management', icon: FaGift },
  { name: 'Upload/Import Files', icon: FaFileImport },
  { name: 'Download/Export Files', icon: FaFileExport },
  { name: 'Store', icon: FaStore },
  { name: 'Account & Settings', icon: FaCog },
];

const FunctionalitiesGrid = () => {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {functionalities.map((func) => (
        <div key={func.name} className="bg-white p-4 rounded shadow flex flex-col items-center space-y-2">
          <func.icon className="text-4xl text-gray-700" />
          <span className="text-lg font-semibold">{func.name}</span>
        </div>
      ))}
    </div>
  );
};

export default FunctionalitiesGrid;
