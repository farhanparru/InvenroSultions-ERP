import React, { useState } from "react";
import { UilTimes } from "@iconscout/react-unicons";
import { Button, Radio } from "antd";
import CartNumpad from "./CartNumpad";
import { useSelector } from "react-redux";

export default function CartOrderModal({ setShowModal }) {
  const [value, setValue] = useState("cash");
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const { orderitems, totalAmount } = useSelector((state) => state.cart);

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-[80%]  my-6 mx-auto ">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-center gap-5  justify-between px-5 py-3 border-b-2 border-solid border-slate-200 rounded-t">
              <div className="modal__order-details flex-1">
                <h3 className="text-2xl font-bold">Order #34134341</h3>
                <p className="text-xs text-gray-500">Customer</p>
                <p className="text-xs text-gray-500">Dine-in - T3</p>
              </div>
              <div className="modal__order-amount flex-1 flex gap-5  justify-between">
                <h2 className="text-2xl font-medium text-black">
                  Payable Amount:
                </h2>
                <p className="text-2xl font-bold text-green-600">₹ {totalAmount.toFixed(3)}</p>
              </div>
            </div>


            {/*body*/}
            <div className="relative p-5 flex-auto">
              <div className="flex gap-5">

                {/* Left side of Body Begin */}
                <div className="flex-1 max-h-[60vh] flex flex-col justify-between">
                  <div className="flex-auto flex flex-col  gap-2 overflow-y-scroll ">
                    {orderitems?.map((item, index) => {
                      return (
                        <ModalOrderItem
                          item={item}
                          itemNo={index + 1}
                          key={index}
                        />
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-5 mt-5">
                    <div>
                      {/* subtotal */}
                      <div className="flex gap-5 justify-between items-center">
                        <h2 className="text-lg font-normal text-black">
                          Subtotal
                        </h2>
                        <p className="text-md font-bold text-black items-center">₹ 100.00</p>
                      </div>

                      {/* Tax */}
                      <div className="flex gap-5 justify-between items-center">
                        <h2 className="text-lg font-normal text-black">
                          Tax
                        </h2>
                        <p className="text-md font-bold text-black">₹ 4.00</p>
                      </div>

                      {/* Grand Total */}
                      <div className="flex gap-5 justify-between items-center">
                        <h2 className="text-lg font-bold text-black">
                          Grand Total
                        </h2>
                        <p className="text-md font-black text-black">₹ 100.00</p>
                      </div>
                    </div>

                    <button className="w-full rounded py-2  text-md text-white font-extrabold bg-green-600 transition-all hover:bg-green-600 hover:scale-90" type="primary">Pay & Print</button>

                  </div>
                </div>
                {/* Left side of Body Ends */}

                {/* Right side of Body */}
                <div className="flex-1 rounded-md flex flex-col justify-evenly border border-gray-300 p-2 overflow-scroll">
                  <div className="py-2">
                    <Radio.Group
                      className="w-full flex justify-between"
                      onChange={onChange}
                      value={value}
                    >
                      <Radio value={"cash"}>Cash</Radio>
                      <Radio value={"card"}>Card</Radio>
                      <Radio value={"split"}>Split</Radio>
                      <Radio value={"other"}>Other</Radio>
                    </Radio.Group>
                  </div>

                  <CartNumpad totalAmount={totalAmount.toFixed(3)} />

                </div>
              </div>
            </div>
            {/*body Ends*/}

          </div>
          <div
            onClick={() => setShowModal(false)}
            className=" absolute top-[-1.5rem] right-[-1rem] rounded-[50%] p-2 text-white bg-blue-600 cursor-pointer transition-all ease-in-out hover:bg-blue-400 hover:scale-90"
          >
            <UilTimes />
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}


const ModalOrderItem = ({ item, itemNo }) => {
  return (
    <div className="w-full bg-zinc-100  border border-zinc-200 rounded-lg flex justify-between p-2 items-center">
      <div className="flex  items-center">
        <p className="text-sm font-bold  text-center ml-3 mr-5">
          {itemNo}
        </p>
        <div className="cart__item-details ">
          <p className="text-sm font-black text-gray-800">
            {item.itemName}
          </p>
          <p className="text-xs text-gray-800">{item.size} ML</p>
        </div>
      </div>
      <p className="text-xs font-bold text-gray-800 text-center">
        ₹ {item.totalPrice}
      </p>
    </div>
  )
}