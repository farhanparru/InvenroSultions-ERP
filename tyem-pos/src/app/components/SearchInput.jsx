import React from 'react';
import { useSelector } from 'react-redux';
import { getSelectedCustomer } from '../pages/home/store/customerSlice';

const SearchInput = ({ placeholder, trailingTitle, onInputChange, defaultValue }) => {
  const selectedCustomer = useSelector(getSelectedCustomer);

  // Use the selected customer's phone number if available and no defaultValue is provided
  const inputDefaultValue = defaultValue || (selectedCustomer ? selectedCustomer.number : '');

  return (
    <form className="w-full">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-1/2 transform -translate-y-1/2 left-3 w-6 h-6 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder={placeholder ?? "Search"}
          onChange={onInputChange}
          defaultValue={inputDefaultValue}
          className="w-full py-3 pl-12 pr-4 text-gray-800 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
        />
        {trailingTitle && (
          <h2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
            {trailingTitle}
          </h2>
        )}
      </div>
    </form>
  );
};

export default SearchInput;
