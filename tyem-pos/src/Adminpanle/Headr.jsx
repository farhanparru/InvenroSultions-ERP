import React, { useState } from 'react';
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify } from 'react-icons/bs';

function Headr({ OpenSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="flex justify-between items-center p-4 bg-purple-900 text-white">
      <div className="flex items-center">
        <BsJustify className="text-2xl cursor-pointer" onClick={OpenSidebar} />
      </div>
      <div className="flex items-center space-x-4">
        <BsSearch className="text-2xl cursor-pointer" />
        <BsFillBellFill className="text-2xl cursor-pointer" />
        <BsFillEnvelopeFill className="text-2xl cursor-pointer" />
        <div className="relative">
          <BsPersonCircle className="text-2xl cursor-pointer" onClick={toggleDropdown} />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Account & Settings</button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Request a Callback</button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Help Center</button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Tutorial</button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Video Tutorial</button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Support Center</button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">support@email.posbytz.com</button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">8248606095</button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Headr;
