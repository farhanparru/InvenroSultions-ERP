import React, { useEffect, useState } from "react";
import {
  UilMinus,
  UilPlus,
  UilTimes,
  UilAngleDown,
  UilPercentage,
  UilEdit,
  UilPen,
  UilMoneyWithdraw,
  UilTrashAlt,
} from "@iconscout/react-unicons";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  getorderitems,
  removeFromCart,
  setSelectedAddon,
  setSingleItemDiscount,
  updateItemNote,
} from "../store/cartSlice";

import { Avatar, Dropdown, Form, Input, Select } from "antd";
import CustomModal from "../../../components/CustomModal";
import { CiDiscount1 } from "react-icons/ci";
import TextArea from "antd/es/input/TextArea";

const CartItem = ({ item, index, initialQuantity = 1 }) => {
  const [quantity, setQuantity] = useState(initialQuantity.toString());

  const dispatch = useDispatch();
  const cartitems = useSelector(getorderitems); // Assuming getorderitems is a selector function

  const onIncreaseQuantity = (e) => {
    e.stopPropagation();
    const newQuantity = parseInt(quantity) + 1;
    setQuantity(newQuantity.toString());
    dispatch(
      addToCart({
        id: item.id,
        type: "increase",
        name: item.name,
        price: item.price,
      })
    );
  };
  
  const onDecreaseQuantity = (e) => {
    e.stopPropagation();
    if (parseInt(quantity) > 1) {
      const newQuantity = parseInt(quantity) - 1;
      setQuantity(newQuantity.toString());
      dispatch(addToCart({ id: item.id, type: "decrease" }));
    } else {
      setQuantity(""); // Clear the quantity if it's below 1
    }
  };

  const handleQuantityChange = (e) => {
    e.stopPropagation();
    const value = e.target.value;

    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setQuantity(value);
    }

    if (value !== "" && !isNaN(value)) {
      dispatch(
        addToCart({
          id: item.id,
          type: "set",
          name: item.name,
          price: item.price,
          quantity: parseInt(value),
        })
      );
    }
  };
  // const onAddItem = (e) => {
  //   e.stopPropagation();
  //   dispatch(addToCart({ item: item, isUpdateProduct: true }));
  // };

  const onUpdateItemNote = (item) => {
    // e.stopPropagation();
    dispatch(
      updateItemNote({
        item_id: item.id,
        variation_id: item.variation_id,
        note: itemNote,
      })
    );
  };

  const onRemoveItem = (e, confirm) => {
    e.stopPropagation();
    if (confirm) {
      dispatch(removeFromCart({ id: item.id }));
    }
  };

  const addAddon = (e, addon) => {
    // console.log(addon);
    e.stopPropagation();
    if (item?.variation_id?.id !== addon.id) {
      dispatch(
        setSelectedAddon({ item_id: item.id, selectedVariation: addon })
      );
    }

    // console.log(cartitems);
  };
  const getAddons = (product_variations) => {
    const keys = Object.keys(product_variations.variations);

    return keys.map((key, index) => {
      return (
        <div
          onClick={(e) => addAddon(e, product_variations.variations[key])}
          className={`text-black border-1 border-gray-200 bg-gray-100 p-3 rounded-md mt-4 ${
            item?.selectedAddon?.id == product_variations.variations[key].id
              ? "border-2 border-chicket-500 bg-chicket-200 text-black"
              : ""
          }`}
          key={key}
        >
          <h4 className="font-semibold capitalize text-base">
            {product_variations.variations[key].name}
          </h4>
          <h3 className="text-xs font-medium mt-2">
            ₹ {product_variations.variations[key].sell_price_inc_tax}
          </h3>
        </div>
      );
    });
  };

  // const getAddonCat = () => {
  //   const keys = Object.keys(item.product_variations);

  //   return (
  //     item.type == "variable" && (
  //       <>
  //         {keys && keys.length > 0 && (
  //           <>
  //             <h6 className="text-black font-bold text-base">Addons</h6>
  //             {keys.map((key, index) => {
  //               return (
  //                 <div className="text-black" key={key}>
  //                   <h4 className="font-semibold mt-2 text-capitalize text-sm">
  //                     - {item.product_variations[key].name}
  //                   </h4>
  //                   <div className="flex gap-4 flex-wrap">
  //                     {getAddons(item.product_variations[key])}
  //                   </div>
  //                 </div>
  //               );
  //             })}
  //           </>
  //         )}
  //       </>
  //     )
  //   );
  // };

  const [showModal, setShowModal] = React.useState(false);

  const __updateSingleItemPrice = (item, price) => {
    // console.log(item, price);
    dispatch(setSingleItemDiscount({ item_id: item.id, price: price }));
  };

  const __discountCart = (item) => {
    // console.log(item, price);
    dispatch(
      setSingleItemDiscount({
        item_id: item.id,
        variation_id: item.variation_id,
        discountAmount: discountAmount,
        discountType: discountType,
      })
    );
  };

  const prefixSelector = (
    <Form.Item name={"prefix"} required noStyle>
      <Select
        onChange={(e) => setDiscountType(e)}
        defaultValue="fixed"
        // style={{ width: 100 }}
      >
        <Select.Option value="fixed">Fixed</Select.Option>
        <Select.Option value="percentage">Percentage</Select.Option>
      </Select>
    </Form.Item>
  );
  return (
    <div>
      <div
        className={`w-full border border-zinc-300 rounded-lg flex justify-between items-center p-2 cursor-pointer transition-all bg-gray-100 text-gray-800`}
      >
        <div onClick={() => setShowModal(true)} className="flex-1 flex gap-4">
          <div className="cart__item-details flex-1">
            <p className="text-sm font-black">
              {item.name}
              {item?.selectedAddon && (
                <span className="text-xs font-semibold ml-1">
                  ({item.selectedAddon.name})
                </span>
              )}
            </p>
            <p className="text-xs font-normal">{item.size}</p>{" "}
            {/* Assuming you have a size or other detail */}
          </div>

          <div className="cart__item-price text-sm font-bold">
            ₹ {parseFloat(item.price).toFixed(2)}
          </div>

          <form className="max-w-xs mx-auto">
            <div className="relative flex items-center space-x-3">
              {/* Decrease Button */}
              <button
                type="button"
                onClick={onDecreaseQuantity}
                id="decrement-button"
                data-input-counter-decrement="counter-input"
                class="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
              >
                <AiOutlineMinus size={20} />
              </button>
              <input
                id="counter-input"
                data-input-counter
                class="flex-shrink-0
               text-gray-900 dark:text-white border-0 bg-transparent 
               text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                placeholder=""
                type="text"
                value={item.quantity}
                onChange={handleQuantityChange}
                required
              />

              <button
                type="button"
                onClick={onIncreaseQuantity}
                data-input-counter-increment="counter-input"
                class="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
              >
                <AiOutlinePlus size={20} />
              </button>
            </div>
          </form>

          <div className="cart__item-total text-sm font-bold">
            ₹ {parseFloat(item.totalPrice).toFixed(2)}
          </div>
        </div>

        <div
          onClick={(e) => onRemoveItem(e, true)}
          className="mx-2 p-1 rounded-md bg-red-500 cursor-pointer transition-all hover:scale-90"
        >
          <UilTrashAlt className="w-5 text-white" />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
