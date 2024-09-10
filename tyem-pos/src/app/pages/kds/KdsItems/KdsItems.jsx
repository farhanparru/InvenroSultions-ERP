import React from "react";
import { UilTrashAlt } from "@iconscout/react-unicons";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { RiEyeFill } from "react-icons/ri";
const KdsItems = ({
  order_item,
  index,
  order,
  showmore,
  showless,
  total_length,
  showMoreClicked,
  itemsToShow,
  showMoreOrder,
  __manageKdsOrder,
}) => {
  return (
    <div className="">
      <div className="p-1 border-b border-black">
        <h2 className="text-xs font-bold">
          x {order_item?.quantity} {"  "} {order_item?.product?.name} {"  "}{" "}
          {/* {order_item.variations.name} */}
          {}
        </h2>
        {/* <p className="text-xs font-medium text-gray-500">
            : {index} length : {total_length}, splice_length :{" "}
            {itemsToShow}
          </p> */}
      </div>
      <div className="gap-2 flex flex-col items-center justify-between h-full ">
        <div className="w-full">
          {total_length >= 2 && index == itemsToShow - 1 && (
            <>
           
              {showMoreClicked ? (
                <div
                  onClick={() => showless()}
                  className="flex items-center justify-center  mt-3 bg-red-500 p-1 rounded-lg text-white"
                >
                 <RiEyeFill className="w-5 " />
                  <h2 className="text-md font-bold">View Less</h2>
                </div>
              ) : (
                <div
                  onClick={() => showmore(total_length, order.id)}
                  className="flex items-center justify-center  mt-3 bg-red-500 p-1 rounded-lg text-white"
                >
                 <RiEyeFill className="w-5 " />

                  <h2 className="text-md font-bold">View More</h2>
                </div>
              )}
            </>
          )}
        </div>
{/* 
        <div className="w-full items-center justify-center">
          {index == itemsToShow - 1 ? (
            <div
              onClick={() => __manageKdsOrder(order.id, "ACCEPT", order)}
              className="flex items-center text-white bg-chicket-500  p-2 rounded-lg justify-center w-full"
            >
              <UilTrashAlt className="w-5 " />
              <h2 className="text-md font-bold ml-2">Close Order</h2>
            </div>
          ) : (
            <div>
              {total_length < itemsToShow && index == total_length - 1 && (
                <div
                  onClick={() => __manageKdsOrder(order.id, "ACCEPT", order)}
                  className="flex items-center text-white bg-chicket-500  p-2 rounded-lg justify-center  "
                >
                  <UilTrashAlt className="w-5 " />
                  <h2 className="text-md font-bold ml-2">Close Order</h2>
                </div>
              )}
            </div>
          )}
        </div> */}
      </div>
      {/* {total_length >= 2 && index == itemsToShow - 1 && (
        <>
          {showMoreClicked ? (
            <div
              onClick={() => showless()}
              className="flex items-center justify-center mt-3"
            >
              <h2 className="text-md font-bold">View Less</h2>
            </div>
          ) : (
            <div
              onClick={() => showmore(total_length, order.id)}
              className="flex items-center justify-center  mt-3"
            >
              <h2 className="text-md font-bold">View More</h2>
            </div>
          )}
        </>
      )}
      
      {index == itemsToShow - 1 ? (
        <div
          onClick={() => __manageKdsOrder(order.id, "ACCEPT",order)}
          className="flex items-center text-white bg-chicket-500  p-2 rounded-lg justify-center"
        >
          <UilTrashAlt className="w-5 " />
          <h2 className="text-md font-bold ml-2">Close Order</h2>
        </div>
      ) : (
        <>
          {total_length < itemsToShow && index == total_length - 1 && (
            <div
              onClick={() => __manageKdsOrder(order.id, "ACCEPT",order)}
              className="flex items-center text-white bg-chicket-500  p-2 rounded-lg justify-center absolute bottom-0 w-[95%]"
              // style={{ marginTop: height -100 }}
            >
              <UilTrashAlt className="w-5 " />
              <h2 className="text-md font-bold ml-2">Close Order</h2>
            </div>
          )}
        </>
      )} */}
    </div>
  );
};

export default KdsItems;
