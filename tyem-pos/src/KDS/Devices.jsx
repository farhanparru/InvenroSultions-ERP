import React from 'react';
import DevicesItemCard from './DevicesItemCard';

const Devices = () => {
  const orders = [
    {
      table: '07',
      orderId: '458',
      type: 'Dine In',
      time: '01:44 PM',
      status: 'Dine In',
      items: [
        { name: 'Chicken Tandoori', quantity: '1½ Kg' },
        { name: 'Capstain', quantity: '1½ Kg' },
        { name: 'Karak Chai', quantity: '5x' },
      ],
    },
    {
      table: '12',
      orderId: '436',
      type: 'Dine In',
      time: '01:44 PM',
      status: 'Dine In',
      items: [
        { name: 'Capstain', quantity: '05' },
        { name: 'Karak Chai', quantity: '05' },
        { name: 'Mutton Karahi', quantity: '1 Kg' },
      ],
    },
    {
      table: '06',
      orderId: '451',
      type: 'Dine In',
      time: '01:44 PM',
      status: 'Dine In',
      items: [
        { name: 'Chicken Tandoori', quantity: '1½ Kg' },
        { name: 'Karak Chai', quantity: '01' },
        { name: 'Sting', quantity: '03' },
      ],
    },
    {
      table: 'Walk-in',
      orderId: '428',
      type: 'Take Away',
      time: '01:44 PM',
      status: 'Take Away',
      items: [{ name: 'Chicken Tandoori', quantity: '1½ Kg' }],
    },
    {
      table: '01',
      orderId: '450',
      type: 'Dine In',
      time: '01:44 PM',
      status: 'Dine In',
      items: [
        { name: 'Chicken Tandoori', quantity: '1½ Kg' },
        { name: 'Capstain', quantity: '02' },
        { name: 'Karak Chai', quantity: '01' },
      ],
    },
    {
      table: 'Walk-in',
      orderId: '420',
      type: 'Take Away',
      time: '01:44 PM',
      status: 'Take Away',
      items: [
        { name: 'Capstain', quantity: '01' },
        { name: 'Soft Drinks', quantity: '300 ml' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">6 Orders in Queue</h2>
        <div className="space-x-2">
          <button className="bg-gray-300 px-4 py-2 rounded-md">Filter</button>
          <button className="bg-gray-300 px-4 py-2 rounded-md">Call Staff</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {orders.map((order, index) => (
          <DevicesItemCard key={index} {...order} />
        ))}
      </div>
    </div>
  );
};

export default Devices;
