import React, { useEffect, useRef } from "react";
import moment from "moment";
import { useState } from "react";
import KdsItems from "../KdsItems/KdsItems";
import { UilTrashAlt } from "@iconscout/react-unicons";

const OrderList = ({ headerColorClass, order, __manageKdsOrder }) => {
  const [itemsToShow, setItemsToShow] = useState(5);
  const [showMoreOrder, setshowMoreOrder] = useState(null);
  const [showMoreClicked, setShowMoreClicked] = useState(false);
  const [createdAt, setCreatedAt] = useState(""); // initialize the createdAt date to the current time
  const [timeElapsed, setTimeElapsed] = useState("");

  const showmore = (length, id) => {
    setshowMoreOrder(id);
    setShowMoreClicked(true);
    setItemsToShow(length);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = moment();
      const createdAtTime = moment(order?.transaction_date);
      const elapsedTime = moment.duration(currentTime.diff(createdAtTime));
      setTimeElapsed(formatElapsedTime(elapsedTime));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [order]);

  const formatElapsedTime = (duration) => {
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const showless = () => {
    setShowMoreClicked(false);

    setItemsToShow(5);
  };

  // const timeElapsed = getTimeElapsed(createdAt);

  return (
    <div>
      <div className="flex flex-col h-full">
        <div
          className={`kot__card-header p-2 rounded-tr-md rounded-tl-md  text-white w-full ${headerColorClass}`}
        >
          <div className="flex gap-5 justify-between">
            <h2 className="text-md  font-bold">{timeElapsed}</h2>
            <div className="bg-white text-black rounded-md p-2 font-bold">
              <h2 className="text-xs ">
                {order?.price_group?.name ?? "Dine In"}
              </h2>
            </div>
          </div>
          <div className="flex gap-5 mt-2 justify-between">
            <h2 className="text-md font-bold">
              x {order?.sell_lines?.length} items
            </h2>
            <h2 className="text-xs font-medium"> #{order?.id}</h2>
            <h2 className="text-xs font-medium">
              {" "}
              {moment(order?.transaction_date)?.format("YYYY/MM/DD  h:mm a")}
            </h2>
          </div>
        </div>
        <div className="kot__card-body flex flex-col gap-2 p-2 bg-gray-200 w-full rounded-b-md relative min-h-[20vw] justify-between gap-3">
        <div className="flex flex-col gap-2">

          {order?.sell_lines.slice(0, itemsToShow)?.map((order_item, index) => {
            return (
              <KdsItems
                order={order}
                order_item={order_item}
                index={index}
                showmore={showmore}
                showless={showless}
                total_length={order?.sell_lines?.length}
                showMoreClicked={showMoreClicked}
                itemsToShow={itemsToShow}
                showMoreOrder={showMoreOrder}
                __manageKdsOrder={__manageKdsOrder}
              />
            );
          })}
        </div>
          <div>
            <div
              onClick={() => __manageKdsOrder(order.id, "ACCEPT", order)}
              className="flex items-center text-white bg-chicket-500  p-2 rounded-lg justify-center  "
            >
              <UilTrashAlt className="w-5 " />
              <h2 className="text-md font-bold ml-2">Close Order</h2>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
