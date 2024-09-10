import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import Headr from './Headr';
import Sidebar from './Sidebar';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';
import { FaEllipsisV } from 'react-icons/fa';
import axios from 'axios';

function Odersale() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://tyem.invenro.site/api/user/PosOrder');
        console.log('API response:', response.data);
        if (response.status === 200 && Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setError('Unexpected response format');
          console.error('Expected an array of orders but got:', response.data);
        }
      } catch (error) {
        setError('Error fetching orders');
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Headr className="header" OpenSidebar={OpenSidebar} />
      <div className="flex flex-grow">
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        <div className="flex-grow p-5">
          <CCard className="mb-4" style={{ backgroundColor: '#ffffff' }}>
            <CCardHeader>
              <h1 className="text-xl font-bold text-gray-800">PosSales</h1>
            </CCardHeader>
            <CCardBody>
              {error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        {['Status', 'Order Details', 'Location', 'Item Details', 'Method', 'Total', 'Created Date', 'Type', 'Actions'].map(header => (
                          <th key={header} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => {
                        const utcDate = DateTime.fromISO(order.orderDetails?.orderDate, { zone: "utc" });
                        const zonedDate = utcDate.setZone("Asia/Kolkata");
                        const formattedDate = zonedDate.toFormat("MMM dd, yyyy");
                        const formattedTime = zonedDate.toFormat("hh:mm:ss a");

                        return (
                          <tr key={order._id} className="border-b border-gray-200">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded">
                                {order.orderDetails.paymentStatus}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              Order #: {order.orderDetails.orderNumber}<br />
                              Invoice Number #: {order.orderDetails.invoiceNumber}<br />
                              Customer Name: {order.orderDetails.customerName}<br />
                              Date: {formattedDate}<br />
                              Time: {formattedTime}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">{order.location}</td>
                            <td className="px-4 py-4 whitespace-pre-wrap">
                              Items: {order.itemDetails.items}<br />
                              Item Name: {order.itemDetails.itemName.join(', ')}<br />
                              Quantity: {order.itemDetails.quantity}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">{order.method}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{order.total}</td>
                            <td className="px-4 py-4 whitespace-pre-wrap">{formattedDate}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{order.type}</td>
                            <td className="px-4 py-4 whitespace-nowrap relative">
                              <button
                                onClick={() => toggleDropdown(order._id)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <FaEllipsisV />
                              </button>
                              {dropdownOpen === order._id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Invoice 1
                                  </button>
                                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Invoice 2
                                  </button>
                                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    View
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CCardBody>
          </CCard>
        </div>
      </div>
    </div>
  );
}

export default Odersale;
