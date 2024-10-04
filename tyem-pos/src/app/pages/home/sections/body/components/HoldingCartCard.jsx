import React from 'react';
import { FiShoppingCart } from 'react-icons/fi'; // Icon for empty state

const HoldingCartCard = () => {
  // Dummy data for the items on hold
  const holdItems = [
    { id: 1, date: 'Thu, Oct 3, 2024, 1:57 PM', items: 1, total: '₹200.00' },
    { id: 2, date: 'Thu, Oct 3, 2024, 2:00 PM', items: 1, total: '₹140.00' },
    { id: 3, date: 'Thu, Oct 3, 2024, 2:15 PM', items: 2, total: '₹320.00' },
    { id: 4, date: 'Thu, Oct 3, 2024, 2:30 PM', items: 3, total: '₹450.00' },
    { id: 5, date: 'Thu, Oct 3, 2024, 2:45 PM', items: 4, total: '₹600.00' },
    { id: 6, date: 'Thu, Oct 3, 2024, 3:00 PM', items: 2, total: '₹280.00' },
    { id: 7, date: 'Thu, Oct 3, 2024, 3:15 PM', items: 3, total: '₹500.00' },
    { id: 8, date: 'Thu, Oct 3, 2024, 3:30 PM', items: 1, total: '₹120.00' },
    { id: 9, date: 'Thu, Oct 3, 2024, 3:45 PM', items: 5, total: '₹720.00' },
    { id: 10, date: 'Thu, Oct 3, 2024, 4:00 PM', items: 4, total: '₹620.00' },
  ];

  return (
    <div className="flex w-full h-screen">
      {/* Left section with holding items */}
      <div className="w-3/4 p-4">
        {/* Tabs Heading */}
        <div className="flex justify-start mb-4">
          <button className="px-4 py-2 text-blue-600">All Items</button>
          <button className="px-4 py-2 mx-4 text-blue-600">Favorites</button>
          <button className="px-4 py-2 text-blue-600">Top Items</button>
          <button className="px-4 py-2 mx-4 text-blue-600 border-b-4 border-yellow-500">
            On Hold
          </button>
        </div>

        {/* Grid layout for holding items */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {holdItems.length > 0 ? (
            holdItems.map((item) => (
              <div
                key={item.id}
                className="border p-4 rounded-lg bg-white shadow-lg flex flex-col justify-between"
                style={{ width: '250px', height: '160px' }} // Adjusting the size as per the image
              >
                {/* Order details */}
                <div>
                  <p className="text-sm text-gray-700">{item.date}</p>
                  <p className="text-sm text-gray-600">Items: {item.items}</p>
                  <p className="text-sm text-gray-600">Total: {item.total}</p>
                </div>

                {/* Buttons section */}
                <div className="flex justify-between mt-3">
                  <button className="bg-red-500 text-white px-4 py-1 rounded-md font-bold">
                    Remove
                  </button>
                  <button className="bg-green-500 text-white px-4 py-1 rounded-md font-bold">
                    Add
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500 p-4">
              <FiShoppingCart size={40} className="mb-2" />
              <h1 className="text-sm">No Items on Hold</h1>
            </div>
          )}
        </div>
      </div>

      {/* Right section for the empty cart */}
      <div className="flex justify-center items-center h-screen bg-gray-900" style={{width:"35%"}}>
      <div className="flex flex-col items-center text-gray-500">
        <FiShoppingCart size={70} className="mb-4" />
        <h1 className="text-2xl">Cart is empty</h1>
      </div>
    </div>
    </div>
  );
};

export default HoldingCartCard;
