import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAmountToBeReturned,
  setWholeCartDiscount,
  updateTotalAmount,
} from "../store/cartSlice";
import { notification } from "antd";

const CartNumpad = ({ totalPayableAmount }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [displayCardValue, setDisplayCardValue] = useState(0);
  const [displayCashValue, setDisplayCashValue] = useState(0);
  const cartState = useSelector((state) => state.cart);
  const returnAmountCash = useSelector((state) => state.cart?.returnAmountCash);
  const [notificationApi, contextHolder] = notification.useNotification();

  const dispatch = useDispatch();
  useEffect(() => {
    setDisplayValue("0");
  }, [totalPayableAmount]);

  useEffect(() => {
   setDisplayValue(returnAmountCash)
  }, [returnAmountCash])
  const NumpadKey = ({ keyValue, span }) => {
    return (
      <>
        {cartState?.paymentMethod == "Split" ? (
          <div
            onClick={() => {
              setDisplayCashValue((state) => {
                setDisplayCardValue(0);
                // setDisplayCashValue(0)
                if (keyValue === "Cancel") {
                  return "0";
                } else if (keyValue === "<-") {
                  if (state == "0" || state.length === 1) {
                    return "0";
                  }
                  return state.slice(0, -1);
                } else if (keyValue === "." && state.includes(".")) {
                  return state;
                } else if (keyValue === "Save") {
                  dispatch(
                    setAmountToBeReturned({
                      amountToBeReturned: 0,
                      paymentMethod: "Split",
                      splitCash:
                        parseFloat(displayCashValue),
                      splitCard:
                      parseFloat(totalPayableAmount) -parseFloat(displayCashValue),
                      totalPayableAmount : parseFloat(totalPayableAmount) - (parseFloat(totalPayableAmount) -
                        parseFloat(displayValue))
                    })
                  );

                  setDisplayCardValue(
                    parseFloat(totalPayableAmount) -
                      parseFloat(displayCashValue)
                  );

                  return state;
                } else if (state == "0" || state == "0.00") {
                  if (keyValue == "00") {
                    return state;
                  }
                  return keyValue;
                }
                return state + keyValue;
              });
            }}
            className={`numpad__key py-2 ${span ? span : ""}
        bg-gray-200 rounded-md  text-center items-center
                cursor-pointer transition-all hover:bg-gray-200 hover:text-gray-900
                hover:scale-90
             `}
          >
            <p className="text-xl font-bold ">{keyValue}</p>
          </div>
        ) : (
          <div
            onClick={() => {
              setDisplayValue((state) => {
                if (keyValue === "Cancel") {
                  return "0";
                } else if (keyValue === "<-") {
                  if (state == "0" || state.length === 1) {
                    return "0";
                  }
                  return state.slice(0, -1);
                } else if (keyValue === "." && state.includes(".")) {
                  return state;
                } else if (keyValue === "Save") {
                  setDisplayCardValue(0);
                  setDisplayCashValue(0);
                  console.log(
                    parseFloat(totalPayableAmount) - parseFloat(displayValue)
                  );
                  dispatch(
                    setAmountToBeReturned({
                      returnAmountCash : displayValue,
                      amountToBeReturned:
                        parseFloat(totalPayableAmount) -
                        parseFloat(displayValue),
                      paymentMethod: "other",
                      totalPayableAmount : parseFloat(totalPayableAmount) - (parseFloat(totalPayableAmount) -
                        parseFloat(displayValue))
                    })
                  );
                  return state;
                } else if (state == "0" || state == "0.00") {
                  if (keyValue == "00") {
                    return state;
                  }
                  return keyValue;
                }
                return state + keyValue;
              });
            }}
            className={`numpad__key py-2 ${span ? span : ""}
        bg-gray-200 rounded-md  text-center items-center
                cursor-pointer transition-all hover:bg-gray-200 hover:text-gray-900
                hover:scale-90
             `}
          >
            <p className="text-xl font-bold ">{keyValue}</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="modal__numpad  bg-white text-black flex-auto  ml-10 flex flex-col justify-center gap-2 mt-3">
      {cartState?.paymentMethod == "Split" ? (
        <div className="flex gap-2 items-center justify-between">
          <div className="numpad__display w-full p-1 border border-gray-300 rounded-md">
            <p className="text-xs text-gray-400 text-right">Cash Amount</p>
            <p className="text-xl font-bold  text-right">
              ₹ {displayCashValue}
            </p>
          </div>
          <div className="numpad__display w-full p-1 border border-gray-300 rounded-md">
            <p className="text-xs text-gray-400 text-right">Card Amount</p>
            <p className="text-xl font-bold  text-right">
              ₹ {displayCardValue}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="numpad__display w-full p-1 border border-gray-300 rounded-md">
            <p className="text-xs text-gray-400 text-right">Change Amount</p>
            <p className="text-xl font-bold  text-right">₹ {displayValue}</p>
          </div>
          {/* <h6 className="text-chicket-500 font-bold">
            Change amount can be greater than grand total
          </h6> */}
        </>
      )}

      {/* Numpad Keys using Grid tailwind */}
      <div className="numpad__keys grid  grid-cols-3 gap-2 mt-2">
        <NumpadKey keyValue={"1"} />
        <NumpadKey keyValue={"2"} />
        <NumpadKey keyValue={"3"} />
        <NumpadKey keyValue={"4"} />
        <NumpadKey keyValue={"5"} />
        <NumpadKey keyValue={"6"} />
        <NumpadKey keyValue={"7"} />
        <NumpadKey keyValue={"8"} />
        <NumpadKey keyValue={"9"} />
        <NumpadKey keyValue={"0"} />
        <NumpadKey keyValue={"00"} />
        <NumpadKey keyValue={"<-"} />
        <NumpadKey keyValue={"."} />
        <NumpadKey keyValue={"Cancel"} />
        <NumpadKey keyValue={"Save"} />
      </div>
    </div>
  );
};

export default CartNumpad;
