import React from 'react';
import { FaWindows,FaAndroid } from 'react-icons/fa';

const DownloadLinks = () => {
  return (
    <div className="bg-white p-4 flex justify-between items-center border-b border-gray-200">
      <div className="flex space-x-4">
        <button className="bg-purple-700 text-white px-4 py-2 rounded flex items-center space-x-2">
        <div className="flex items-center mb-4">
        <FaWindows className="mr-2 text-blue-500" />
        <span>Windows POS application</span>
      </div>
          <span className="bg-purple-900 text-white px-2 py-1 rounded">Download</span>
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center space-x-2">
        <div className="flex items-center mb-4">
        <FaAndroid className="mr-2 text-blue-500" />
        <span>Android POS Application</span>
      </div>
          <span className="bg-green-700 text-white px-2 py-1 rounded">Download</span>
        </button>
      </div>
    </div>
  );
};

export default DownloadLinks;
