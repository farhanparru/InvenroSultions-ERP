import React, { useState } from 'react';
import { FaTable } from 'react-icons/fa'; // Importing an icon from react-icons

const HomeTableSection = () => {
  const [activeCategory, setActiveCategory] = useState("Family");

  const categories = ["Family", "Hall", "Cafe", "Parcel"];
  const tables = [
    { id: "F1", seats: 4 },
    { id: "F2", seats: 6 },
    { id: "F3", seats: 4 },
    { id: "F4", seats: 8 },
    { id: "F5", seats: 4 },
    { id: "F6", seats: 4 },
  ];

  return (
    <div className="flex flex-col md:flex-row p-4">
      {/* Sidebar */}
      <div className="w-full md:w-1/5 bg-gray-500 text-white p-4 rounded-t-lg md:rounded-l-lg">
        <h2 className="text-center text-lg mb-4 font-semibold">{activeCategory}</h2>
        <ul>
          {categories.map((category) => (
            <li key={category}>
              <button
                className={`w-full p-2 text-left ${
                  activeCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                } mb-2 border-2 rounded`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Section with Header */}
      <div className="w-full md:w-4/5 p-4">
        {/* Animated Header */}
        <div className="flex items-center mb-6">
          <FaTable className="text-3xl text-teal-600  mr-2" /> {/* Icon with animation */}
          <h1 className="text-3xl font-bold animate-fadeIn">Tables Overview</h1> {/* Animated header */}
        </div>

        {/* Table Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className="bg-green-500 text-white p-4 text-center rounded-lg flex flex-col justify-center items-center h-40 w-40"
            >
              <div className="text-lg font-semibold">{table.id}</div>
              <div className="text-sm">{table.seats} Seats</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTableSection;
