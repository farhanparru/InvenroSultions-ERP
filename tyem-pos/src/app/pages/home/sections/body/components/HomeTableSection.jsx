import React, { useState } from "react";
import { FaUtensils, FaUser, FaReceipt, FaTable } from "react-icons/fa"; // Import the icon

const tables = [
  {
    id: 1,
    status: "booked",
    time: "09:18 AM",
    label: "TABLE 01",
    category: "Party Hall",
  },
  {
    id: 2,
    status: "booked",
    time: "09:06 PM",
    label: "TABLE 02",
    category: "Ground Floor",
  },
  {
    id: 3,
    status: "bill",
    time: "10:02 PM",
    label: "TABLE 03",
    category: "Party Hall",
  },
  { id: 4, status: "free", time: "", label: "TABLE 04", category: "Hall" },
  {
    id: 5,
    status: "free",
    time: "",
    label: "TABLE 05",
    category: "Ground Floor",
  },
  {
    id: 6,
    status: "free",
    time: "",
    label: "TABLE 06",
    category: "Party Hall",
  },
  {
    id: 7,
    status: "free",
    time: "",
    label: "TABLE 07",
    category: "Ground Floor",
  },
  { id: 8, status: "free", time: "", label: "TABLE 08", category: "Hall" },
  {
    id: 9,
    status: "booked",
    time: "02:59 PM",
    label: "TABLE 09",
    category: "Party Hall",
  },
  {
    id: 10,
    status: "free",
    time: "",
    label: "TABLE 10",
    category: "Ground Floor",
  },
  {
    id: 11,
    status: "booked",
    time: "12:56 PM",
    label: "TABLE 11",
    category: "Hall",
  },
  {
    id: 12,
    status: "free",
    time: "",
    label: "TABLE 12",
    category: "Ground Floor",
  },
  { id: 13, status: "free", time: "", label: "TABLE 13", category: "Hall" },
  {
    id: 14,
    status: "free",
    time: "",
    label: "TABLE 14",
    category: "Party Hall",
  },
  {
    id: 15,
    status: "free",
    time: "",
    label: "TABLE 15",
    category: "Ground Floor",
  },
  {
    id: 16,
    status: "free",
    time: "",
    label: "TABLE 16",
    category: "Party Hall",
  },
];



const getStatusColor = (status) => {
  switch (status) {
    case "booked":
      return "bg-red-500"; // Red for booked tables
    case "free":
      return "bg-green-500"; // Green for free tables
    case "bill":
      return "bg-yellow-500"; // Yellow for bill
    default:
      return "bg-gray-200"; // Default gray
  }
};

const getIcon = (status) => {
  switch (status) {
    case "booked":
      return <FaUser className="text-white" />;
    case "free":
      return <FaUtensils className="text-white" />;
    case "bill":
      return <FaReceipt className="text-white" />;
    default:
      return null;
  }
};

const HomeTableSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredTables =
    selectedCategory === "All"
      ? tables
      : tables.filter((table) => table.category === selectedCategory);

  return (
    <div className="p-4">
      {/* Heading with Icon */}
      <div className="flex justify-center items-center mb-6">
        <FaTable className="text-3xl mr-2 text-blue-500" /> {/* Table icon */}
        <h2 className="text-2xl font-semibold text-blue-500">Table Overview</h2> {/* Heading */}
      </div>

      {/* Category Filter Buttons */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => handleCategoryChange("All")}
          className={`px-4 py-2 mx-2 rounded ${
            selectedCategory === "All"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleCategoryChange("Party Hall")}
          className={`px-4 py-2 mx-2 rounded ${
            selectedCategory === "Party Hall"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Party Hall
        </button>
        <button
          onClick={() => handleCategoryChange("Ground Floor")}
          className={`px-4 py-2 mx-2 rounded ${
            selectedCategory === "Ground Floor"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Ground Floor
        </button>
        <button
          onClick={() => handleCategoryChange("Hall")}
          className={`px-4 py-2 mx-2 rounded ${
            selectedCategory === "Hall"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Hall
        </button>
      </div>

      {/* Table Layout */}
      <div className="grid grid-cols-4 gap-4">
        {filteredTables.map((table) => (
          <div
            key={table.id}
            className={`p-4 text-center text-white rounded ${getStatusColor(
              table.status
            )}`}
          >
            <div className="flex justify-center items-center mb-2">
              {getIcon(table.status)}
            </div>
            <p>{table.label}</p>
            {table.time && <p className="text-sm mt-2">{table.time}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeTableSection;
