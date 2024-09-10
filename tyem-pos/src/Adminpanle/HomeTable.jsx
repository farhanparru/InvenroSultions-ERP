import React from 'react';
import { useState } from 'react';
import CreateTableModal from './CreateTableModal';


const HomeTable = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const data = [
    { name: 'P1', seatingCapacity: 4, priceCategory: 'Parcel', createdDate: 'Sep 9, 2024' },
    { name: 'P2', seatingCapacity: 4, priceCategory: 'Parcel', createdDate: 'Sep 9, 2024' },
    { name: 'P3', seatingCapacity: 4, priceCategory: 'Parcel', createdDate: 'Sep 9, 2024' },
    { name: 'P4', seatingCapacity: 4, priceCategory: 'Parcel', createdDate: 'Sep 9, 2024' },
    { name: 'P5', seatingCapacity: 4, priceCategory: 'Parcel', createdDate: 'Sep 9, 2024' },
  ];

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">Floors / Parcel Tables</h1>
        <div className="space-x-2">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md">Floor Plan</button>
          <button
        onClick={() => setModalOpen(true)}
        className="bg-purple-600 text-white px-4 py-2 rounded-md"
      >
        Create Table
      </button>
      <CreateTableModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg p-4">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Seating Capacity</th>
              <th className="px-4 py-2 text-left">Price Category</th>
              <th className="px-4 py-2 text-left">Created Date</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.seatingCapacity}</td>
                <td className="px-4 py-2">{item.priceCategory}</td>
                <td className="px-4 py-2">{item.createdDate}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button className="bg-purple-500 text-white px-2 py-1 rounded-md">Edit</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded-md">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-gray-500">
          Showing {data.length} entries
        </div>
      </div>
    </div>
  );
};

export default HomeTable;
