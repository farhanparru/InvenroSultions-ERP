import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "antd";
import { clearSelectedCustomer, setSelectedCustomer } from "../../../store/customerSlice";
import { clearCart } from "../../../store/cartSlice";
import { addHoldCart } from "../../../store/holdCartSlice";

const HoldSaleModal = ({ visible, onClose, onConfirm }) => {
  const [inputValue, setInputValue] = useState("");
  const [cartNote, setCartNote] = useState("");
  const cartState = useSelector((state) => state.cart);
  const selectedCustomer = useSelector((state) => state.customer.selectedCustomer);
  const dispatch = useDispatch();
  const [notificationApi, contextHolder] = notification.useNotification();

  if (!visible) return null;

  return (
    <div>
      {contextHolder}
      <div className="min-w-screen h-screen fixed left-0 top-0 flex justify-center items-center inset-0 z-50 bg-black bg-opacity-80">
        <div className="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
          <div className="text-center p-5 flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 29"
              stroke="currentColor"
              className="w-16 h-16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M12 16.01l0 .01M12 2a10 10 0 110 20 10 10 0 010-20z"
              />
            </svg>
            <h3 className="text-xl font-bold py-4">Are you sure?</h3>
            <p className="text-sm text-gray-500 px-8">
              Do you really want to hold this sale? This process cannot be undone.
            </p>
            <div className="mt-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Optional note"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="p-3 mt-2 text-center space-x-4 md:block">
            <button
              className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600"
              onClick={() => {
                if (!selectedCustomer || !cartState?.orderitems?.length) {
                  notificationApi.error({
                    message: "Please Select Customer and Add Items to Cart",
                  });
                  return;
                }
                dispatch(
                  addHoldCart({
                    ...cartState,
                    customer: selectedCustomer,
                    cartNote: inputValue,
                    time: new Date().toLocaleString(),
                  })
                );
                dispatch(clearSelectedCustomer());
                dispatch(clearCart());
                onClose();
              }}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldSaleModal;
