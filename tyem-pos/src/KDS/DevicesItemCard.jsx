import React from 'react';

const DevicesItemCard = ({ table, orderId, type, time, items, status }) => {
  return (
    <div className={`border rounded-lg p-4 m-2 ${status === 'Dine In' ? 'bg-red-200' : 'bg-blue-200'}`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-bold text-lg">Table {table}</h3>
          <p className="text-sm">Order #{orderId}</p>
          <p className="text-sm">{time}</p>
        </div>
        <div>
          <span className="px-3 py-1 text-sm bg-gray-200 rounded-full">{status}</span>
        </div>
      </div>
      <div className="mb-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.name}</span>
            <span>{item.quantity}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Start</button>
        <button className="bg-gray-300 px-4 py-2 rounded-md">Finish</button>
      </div>
    </div>
  );
};

export default DevicesItemCard;
