import React from 'react';

const OrderItemCard = ({ order, onClick }) => {
  return (
    <div
      onClick={() => onClick(order)}
      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition"
    >
      <div className="flex justify-between items-center">
        <p className="text-lg font-bold">Order ID: {order.orderDetails.posOrderId}</p>
        <p className="text-sm text-gray-500">{order.orderDetails.orderType}</p>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <p className="text-sm">Payment Method: {order.orderDetails.paymentMethod}</p>
        <p className="text-sm font-bold">${order.orderDetails.paymentTendered.toFixed(2)}</p>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <p className="text-sm">Order Date:</p>
        <p className="text-sm">{new Date(order.orderDetails.orderDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default OrderItemCard;
