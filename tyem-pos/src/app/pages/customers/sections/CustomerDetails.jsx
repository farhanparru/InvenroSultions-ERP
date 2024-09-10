import React from 'react';

const CustomerDetails = ({ customer }) => {
  return (
    <div className="bg-white shadow-md rounded p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Customer Details</h2>
      </div>
      <div className="mb-4">
        <input type="checkbox" className="mr-2" id="default-customer" />
        <label htmlFor="default-customer">Use as default customer on checkout</label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border-b py-2">
          <span className="font-bold">Name:</span> {customer.name}
        </div>
        <div className="border-b py-2">
          <span className="font-bold">Place:</span> {customer.place}
        </div>
        <div className="border-b py-2">
          <span className="font-bold">Mobile Number:</span> {customer.number}
        </div>
        <div className="border-b py-2">
          <span className="font-bold">Created At:</span> {new Date(customer.createdAt).toLocaleDateString()}
        </div>
        <div className="border-b py-2">
          <span className="font-bold">Updated At:</span> {new Date(customer.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
