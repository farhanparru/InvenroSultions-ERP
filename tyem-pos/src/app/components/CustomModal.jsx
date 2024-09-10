import React, { Children, useState } from "react";
import { UilTimes } from "@iconscout/react-unicons";

export default function CustomModal({ onClose, children }) {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative   my-6 mx-auto ">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {children}
          </div>
          <div
            onClick={onClose}
            className=" absolute top-[-1.5rem] right-[-1rem] rounded-[50%] p-2 text-white bg-chicket-500 cursor-pointer transition-all ease-in-out hover:bg-chicket-300 hover:scale-90"
          >
            <UilTimes />
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
