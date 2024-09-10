import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaChartBar, FaClipboardList, FaUsers, FaBoxes, FaUtensils, FaCog ,FaWallet} from 'react-icons/fa';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside className={`fixed inset-y-0 left-0 transform ${openSidebarToggle ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out bg-purple-900 text-white w-64 z-30`}>
      <div className="flex items-center justify-between p-4 bg-purple-800">
        <span className="text-lg font-semibold">TYEMventrures</span>
        <button onClick={OpenSidebar} className="text-white">
          <FaCog />
        </button>
      </div>
      <nav className="mt-10">
        <Link to="/home" className="flex items-center py-2 px-6 text-sm text-white hover:bg-purple-700">
          <FaHome className="mr-3" />
          Home
        </Link>
        <Link to="/dashboard" className="flex items-center py-2 px-6 text-sm text-white hover:bg-purple-700">
          <FaChartBar className="mr-3" />
          Dashboard
        </Link>
        <Link to="/Sale" className="flex items-center py-2 px-6 text-sm text-white hover:bg-purple-700">
          <FaClipboardList className="mr-3" />
          Sales
        </Link>
        <Link to="/reports" className="flex items-center py-2 px-6 text-sm text-white hover:bg-purple-700">
          <FaChartBar className="mr-3" />
          Reports
        </Link>
        <Link to="/Item" className="flex items-center py-2 px-6 text-sm text-white hover:bg-purple-700">
          <FaBoxes className="mr-3" />
          Items
        </Link>
        <Link to="/Customers" className="flex items-center py-2 px-6 text-sm text-white hover:bg-purple-700">
          <FaUsers className="mr-3" />
          Customers
        </Link>
        <Link to="/Employes" className="flex items-center py-2 px-6 text-sm text-white hover:bg-purple-700">
          <FaUsers className="mr-3" />
          Employees
        </Link>
        <Link to="/inventory-management" className="flex items-center py-2 px-6 text-sm text-white hover:bg-purple-700">
          <FaBoxes className="mr-3" />
          Inventory Management
        </Link>
        <Link to="/ResturentManagment" className="flex items-center py-2 px-6 text-sm text-white hover:bg-purple-700">
          <FaUtensils className="mr-3" />
          Restaurant Management
        </Link>
        <Link to="/Expense" className="flex items-center py-2 px-6 text-sm text-white hover:bg-purple-700">
        <FaWallet className="mr-3" />
  Expense
</Link>

      </nav>
    </aside>
  );
}

export default Sidebar;
