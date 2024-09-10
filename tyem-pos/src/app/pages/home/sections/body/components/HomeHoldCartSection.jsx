import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Empty } from "antd";
import { getHoldCartList, removeHoldCart } from "../../../store/holdCartSlice";
import { addFromHoldCart } from "../../../store/cartSlice";
import { setSelectedCustomer, clearSelectedCustomer } from "../../../store/customerSlice";
import { selectTab } from "../../../store/homeSlice";
import HomeTopBar from "../../HomeTopBar";
import HoldingCartCard from './HoldingCartCard'; // Ensure correct import path

const HomeHoldCartSection = () => {
  const holdCartList = useSelector(getHoldCartList);
  const selectedTab = useSelector((state) => state.home.selectedTab);
  const dispatch = useDispatch();

  return (
    <>
      <HomeTopBar selectedTab={selectedTab} />
      <div className="flex flex-col gap-3 p-2 w-full h-full">
        <h2 className="text-lg font-bold">Hold Cart</h2>
        <h2 className="text-lg font-bold mt-10">Carts On Hold</h2>
        {holdCartList.length === 0 ? (
          <Empty className="mx-auto" description="No carts held yet" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 overflow-y-scroll gap-5 p-4">
            {holdCartList.map((cart) => (
              <HoldingCartCard key={cart.id} cart={cart} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HomeHoldCartSection;
