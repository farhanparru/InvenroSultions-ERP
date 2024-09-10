import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ setSearchQuery }) => {
  return (
    <div className="flex justify-center mt-4">
      <label className="flex border-2 border-orange-500 rounded-md items-center">
        <span className="pl-2 pr-2 text-gray-500">
          <FaSearch />
        </span>

        
        <input
          type="text"
          placeholder="Search customer by name / phone / code"
         className="outline-none border-none py-2 px-3 w-80 text-gray-700 rounded-md focus:ring-0 h-10"
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
        />

         {/* Alt + S Button */}
         <button
          className="bg-gray-200 text-gray-600 px-4 py-2 border-l border-gray-300 text-sm rounded-md flex items-center justify-center h-full"
          title="Alt + S"
        >
          Alt + S
        </button>
        
      </label>
    </div>
  );
};

export default SearchBar;
