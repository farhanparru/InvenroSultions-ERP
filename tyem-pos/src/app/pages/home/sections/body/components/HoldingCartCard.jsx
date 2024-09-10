import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeHoldCart } from "../../../store/holdCartSlice";
import { addFromHoldCart } from "../../../store/cartSlice";
import { setSelectedCustomer } from "../../../store/customerSlice";
import { selectTab } from "../../../store/homeSlice";

const HoldingCartCard = ({ cart }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col bg-white rounded-lg border border-gray-300 p-4 gap-2">
      <div className="flex justify-between items-center gap-10">
        <h2 className="text-sm font-bold">{cart?.customer?.name}</h2>
        <p className="text-xs">Held At {cart.time}</p>
      </div>
      <div className="flex justify-between items-center gap-10">
        <h2 className="text-sm font-bold">Cart Note:</h2>
        <p className="text-xs">{cart.cartNote}</p>
      </div>
      <div className="flex flex-col gap-2 mt-2 h-[60%] overflow-y-scroll">
        {cart?.orderitems?.slice(0, 5).map((item, index) => (
          <div key={index} className="flex flex-col">
            <p className="text-xs font-bold">{">"} {item.name}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-evenly gap-10 mt-5">
        <button
          onClick={() => dispatch(removeHoldCart({ holdCartItem: cart }))}
          className="px-4 py-2 text-white border-2 bg-red-500 rounded-lg cursor-pointer transition-all hover:scale-90"
        >
          REMOVE
        </button>
        <button
          onClick={() => {
            dispatch(addFromHoldCart({ data: cart }));
            dispatch(setSelectedCustomer(cart.customer));
            dispatch(selectTab(cart.orderType));
            dispatch(removeHoldCart({ holdCartItem: cart }));
          }}
          className="px-4 py-2 text-white border-2 bg-green-500 rounded-lg cursor-pointer transition-all hover:scale-90"
        >
          SELECT
        </button>
      </div>
    </div>
  );
};

export default HoldingCartCard;
