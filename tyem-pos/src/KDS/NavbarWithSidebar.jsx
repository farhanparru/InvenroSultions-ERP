import React, { useState } from 'react';
import { MenuOutlined, LogoutOutlined } from '@ant-design/icons';
import { FaRegWindowClose ,FaBell} from 'react-icons/fa';
import logo from '../../src/assets/logo-color-modified (1).png';
import KdsGrid from './KdsGrid'; // Import the KdsGrid component

// FooterUI Component
const FooterUI = () => {
  return (
    <div className="w-full fixed bottom-0 left-0 bg-gray-800 shadow-lg">
      <div className="flex justify-between items-center p-2 space-x-2">
        <button className="flex-1 bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none hover:bg-red-700">
          PRIORITY
        </button>
        <button className="flex-1 bg-green-500 text-white font-semibold py-2 px-4 rounded focus:outline-none hover:bg-green-600">
          BUMP
        </button>
        <button className="flex-1 bg-blue-500 text-white font-semibold py-2 px-4 rounded focus:outline-none hover:bg-blue-600">
          COOKING
        </button>
        <button className="flex-1 bg-blue-400 text-white font-semibold py-2 px-4 rounded focus:outline-none hover:bg-blue-500">
          JOIN
        </button>
        <button className="flex-1 bg-blue-500 text-white font-semibold py-2 px-4 rounded focus:outline-none hover:bg-blue-600">
          PRINT
        </button>
        <button className="flex-1 bg-blue-400 text-white font-semibold py-2 px-4 rounded focus:outline-none hover:bg-blue-500">
          INFO
        </button>
        <button className="flex-1 bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none hover:bg-red-700">
          RECALL
        </button>
        <button className="flex-1 bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none hover:bg-red-700">
          RECALL LAST
        </button>
      </div>
    </div>
  );
};

const NavbarWithSidebar = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gray-900 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle Button */}
          <MenuOutlined
            className="text-white text-2xl cursor-pointer"
            onClick={toggleSidebar}
          />
          {/* Logo */}
          <div className="flex items-center">
            <img src={logo} alt="RestApp Logo" className="h-8 mr-2" />
            <span className="text-white text-xl font-bold">Invenro Solution</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Order Coming Sound Icon */}
          <FaBell
            className="text-white text-2xl cursor-pointer"
          
            title="Play Order Sound"
          />
          {/* Logout Icon */}
          <LogoutOutlined className="text-white text-2xl cursor-pointer" />
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          openSidebarToggle ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 ease-in-out bg-gray-900 text-white w-64 z-30 h-full`}
      >
        {/* Header with Logo and Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
          <div className="flex items-center">
            <FaRegWindowClose className="mr-3 text-lg cursor-pointer" onClick={toggleSidebar} />
            <span className="text-xl font-bold">RestApp</span>
          </div>
        </div>

        {/* Product Section */}
        <div className="p-4">
          {/* PRODUCT Header */}
          <div className="text-sm font-semibold tracking-wider mb-2 uppercase">Product</div>

          {/* Seafoods Section */}
          <div className="mb-4">
            <h3 className="text-gray-400 uppercase text-sm mb-1">Seafoods</h3>
            <ul className="space-y-1">
              <li className="flex justify-between">
                <span>Salmon Grill</span> <span>2</span>
              </li>
              <li className="flex justify-between">
                <span>Miso Salmon</span> <span>3</span>
              </li>
              <li className="flex justify-between">
                <span>Sea Bass Grill</span> <span>4</span>
              </li>
              <li className="flex justify-between">
                <span>Grilled Calamari</span> <span>1</span>
              </li>
            </ul>
          </div>

          {/* Soups Section */}
          <div className="mb-4">
            <h3 className="text-gray-400 uppercase text-sm mb-1">Soups</h3>
            <ul className="space-y-1">
              <li className="flex justify-between">
                <span>Lobster Bisque</span> <span>4</span>
              </li>
              <li className="flex justify-between">
                <span>Tomato Soup</span> <span>2</span>
              </li>
            </ul>
          </div>

          {/* Salads Section */}
          <div className="mb-4">
            <h3 className="text-gray-400 uppercase text-sm mb-1">Salads</h3>
            <ul className="space-y-1">
              <li className="flex justify-between">
                <span>Caesar Salad</span> <span>4</span>
              </li>
              <li className="flex justify-between">
                <span>Spicy Carrot Salad</span> <span>1</span>
              </li>
              <li className="flex justify-between">
                <span>Salmon Sushi Salad</span> <span>1</span>
              </li>
              <li className="flex justify-between">
                <span>Quinoa Salad</span> <span>1</span>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Toggle Button to Open Sidebar */}
      <button
        className="fixed top-4 left-4 bg-gray-600 text-white p-2 rounded focus:outline-none z-40"
        onClick={toggleSidebar}
      >
        &#9776; {/* Menu icon */}
      </button>

      {/* KdsGrid Component */}
      <div className="p-4">
        <KdsGrid /> {/* Render KdsGrid below the Navbar and Sidebar */}
      </div>

      {/* Footer Component */}
      <FooterUI />
    </div>
  );
};

export default NavbarWithSidebar;
