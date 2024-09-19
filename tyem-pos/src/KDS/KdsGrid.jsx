import React from 'react';
import KdsItem from './KdsItem';

const orders = [
  {
    time: '18:27',
    table: 'R14',
    customer: 'Jane S.',
    statusColor: 'bg-red-500',
    items: [
      { qty: 1, name: 'Salmon Grill', notes: 'NO SALT' },
      { qty: 1, name: 'Lobster Bisque', notes: 'MEDIUM' },
      { qty: 2, name: 'Caesar Salad', notes: 'ADD CHEESE' },
      { qty: 1, name: 'Broccoli', notes: '' },
    ],
  },
  {
    time: '18:40',
    table: 'R12',
    customer: 'Jane S.',
    statusColor: 'bg-red-500',
    items: [
      { qty: 1, name: 'Grilled Calamari', notes: 'EXTRA SAUCE' },
      { qty: 2, name: 'Sea Bass Grill', notes: 'MEDIUM' },
      { qty: 1, name: 'Tomato Soup', notes: '' },
    ],
  },
  // More orders here...
];

const KdsGrid = () => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {orders.map((order, index) => (
        <KdsItem key={index} order={order} />
      ))}
    </div>
  );
};

export default KdsGrid;
