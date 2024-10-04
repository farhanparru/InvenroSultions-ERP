import React, { useEffect, useState,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "../../components/CartItem";
import { homeBodySection, homeTopBarTabs } from "../../constants";
import {
  getPriceGroupsList,
  getSelectedBodySection,
  getSelectedTab,
  selectBodySection,
  selectTab,
} from "../../store/homeSlice";
import HomeCartFooter from "./components/HomeCartFooter";
import SearchInput from "../../../../components/SearchInput";
import { CiDiscount1 } from "react-icons/ci";
import { UilTrashAlt } from "@iconscout/react-unicons";
import { Popconfirm } from "antd";
import { FaUser } from 'react-icons/fa';  

import { setWholeCartDiscount } from "../../store/cartSlice";
import { clearCart  } from "../../store/cartSlice";

import CustomModal from "../../../../components/CustomModal";
import { Form, Input, Select } from "antd";
import CartCustomerList from "./components/CartCustomerList";
import { getSelectedCustomer, searchCustomer } from "../../store/customerSlice";
import { clearEditOrder } from "../../store/orderSlice";

const HomeCartSection = () => {

  
  const dispatch = useDispatch();

  const { orderitems, totalAmount } = useSelector((state) => state.cart);
  const cartState = useSelector((state) => state.cart);
  const editOrder = useSelector((state) => state.order.editOrder);

  const homePriceCategories = useSelector(getPriceGroupsList);

  const selectedBodySection = useSelector(getSelectedBodySection);
  const selectedTab = useSelector(getSelectedTab);

  // const selectedCustomer = useSelector(getSelectedCustomer);


  const cartCustomerListRef = useRef(null);
  const modalRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [discountType, setDiscountType] = useState("fixed");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  const [selectedPhone, setSelectedPhone] = useState(''); // Manage the selected phone number

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerFocused, setCustomerFocused] = useState(false);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.match(/^\d+$/)) {
      setSelectedPhone(value);
    } else {
      setSelectedPhone('');
    }
  };


  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerFocused(false); // Close the customer list after selection
  };


   // Function to close the CartCustomerList component
  //  const handleClickOutside = (event) => {
  //   if (
  //     cartCustomerListRef.current &&
  //     !cartCustomerListRef.current.contains(event.target) 
  //   ) {
  //     setCustomerFocused(false);
  //   }
  // };

  // useEffect(() => {
  //   // Add the event listener to detect clicks outside the component
  //   document.addEventListener("mousedown", handleClickOutside);

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);




  const [form] = Form.useForm(); // Initialize form
  useEffect(() => {
    if (selectedCustomer?.name) {
      setSelectedCustomerName(selectedCustomer?.name);
    }
  }, [selectedCustomer]);

  

  const __discountCart = () => {
    dispatch(
      setWholeCartDiscount({
        discountType: discountType,
        discountAmount: discountAmount,
      })
    );
    setShowModal(false); // Close modal after applying discount
  };

  const prefixSelector = (
    <Select
      onChange={(value) => setDiscountType(value)}
      defaultValue={discountType}
    >
      <Select.Option value="fixed">Fixed</Select.Option>
      <Select.Option value="percentage">Percentage</Select.Option>
    </Select>
  );

  const onSearch = (value) => {
    setSearchTerm(value);
  }

  const handleSetCustomerFocused = (status) => {
    setCustomerFocused(status);
  };

  return (
    <div className="w-[35%] relative h-full bg-white text-white border-l-[3px] border-chicket-border flex flex-col">
      <div className="home__cart-top flex gap-3 ml-3 mr-3 mt-2 w-full overflow-x-scroll">
        {homePriceCategories.map((item, index) => {
          const isSelected = item.id === selectedTab?.id;
          return (
            <div key={index}>
              <div
                onClick={() => {
                  dispatch(selectTab(item));
                  dispatch(clearCart());
                  dispatch(clearEditOrder());
                }}
                // className={`flex px-3 py-2 items-center rounded-md border-gray-300 cursor-pointer transition-all ${isSelected
                //   ? "bg-ch-headers-500 text-white"
                //   : "hover:bg-ch-headers-300 bg-ch-headers-100 hover:text-white hover:scale-90 text-ch-headers-500"
                //   }`}
              >
                <h3 className="font-bold text-base text-center">
                  {/* {item.name} */}
                </h3>
              </div>
            </div>
          );
        })}
      </div> 
      <div className="search__section w-full flex gap-4 items-center mb-2 p-3">
      <div className="flex items-center justify-center space-x-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 ">
          <FaUser className="text-black text-xl" />
        </div>
      </div>
        <div
          className="w-full relative"
          tabIndex={0}
          onFocus={() => setCustomerFocused(true)}
      
          onBlur={() => {
            if (!customerFocused) {
              setCustomerFocused(false);
            }
          }}
        >
         <SearchInput
          onInputChange={(e) => handleSearch(e.target.value)}
      
        />
          {customerFocused && (
            <div className="absolute right-1/2 w-[100%] translate-x-1/2 top-[100%] border-2 border-solid border-slate-200 bg-white px-2 pb-2 z-50"
            // ref={cartCustomerListRef}
            >
            <CartCustomerList
                onSelectCustomer={handleSelectCustomer}
                searchTerm={searchTerm}
                modalRef={modalRef}
                selectedPhone={selectedPhone}
                closeCustomerList={() => setCustomerFocused(false)} // Close the list when modal is opened
                
               
              />
            </div>
          )}
        </div>
        <div
          onClick={() => {
            setShowModal(true);
            if (cartState?.discountType !== null) {
              setDiscountType(cartState?.discountType);
              setDiscountAmount(cartState?.discountValue);
            }
          }}
          className="left-3 bg-orange-500 rounded-[10px] w-11 h-10 p-1 flex justify-center items-center transition-all cursor-pointer hover:scale-125"
        >
          <CiDiscount1 className="w-8 h-9 text-white" />
        </div>
        <div className="left-3 bg-red-500 rounded-[10px] p-1 w-11 h-10 flex justify-center items-center transition-all cursor-pointer hover:scale-125">
          <Popconfirm
            placement="top"
            title={"Do you want to clear the cart?"}
            description={"This action cannot be undone."}
            onConfirm={() => {
              dispatch(clearCart())
              // Ensure clearEditOrder() is defined and imported if used
              dispatch(clearEditOrder()); // Clear the order edits
            }}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <UilTrashAlt className="w-8 h-9 text-white" />
          </Popconfirm>
        </div>
      </div>

      {showModal && (
        <CustomModal onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4 p-4 rounded-lg border shadow-2xl">
            <h2 className="text-md text-black font-bold">Cart Discount</h2>
            <div className="flex gap-2">
              <Form form={form}>
                <div className="flex items-center gap-10">
                  <CiDiscount1 className="w-8 h-9 text-black" />
                  <h4 className="text-md text-black font-bold">
                    Apply Discount
                  </h4>
                  <div className="mt-[25px]">
                    <Form.Item
                      name={"discountAmount"}
                      rules={[
                        {
                          required: true,
                          message: "Please enter the discount amount!",
                        },
                      ]}
                    >
                      <Input
                        onChange={(e) => setDiscountAmount(e.target.value)}
                        type="number"
                        defaultValue={discountAmount}
                        addonBefore={prefixSelector}
                      />
                    </Form.Item>
                  </div>
                </div>
                {discountType && discountAmount !== 0 && (
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={__discountCart}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      Apply Discount
                    </button>
                  </div>
                )}
              </Form>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-black text-sm font-medium">Discount</div>
              <div className="text-black text-lg font-bold">
                ₹ {parseFloat(cartState?.discount ?? 0).toFixed(2)}
              </div>
            </div>
          </div>
        </CustomModal>
      )}

      {/* Cart body */}
      {editOrder?.orderitems && editOrder?.orderitems?.length !== 0 ? (
        <div className="bg-red-500 mx-3 px-3 py-2 rounded-md flex items-center justify-center font-bold">
          <h6 className="text-danger">
            Editing Order{" "}
            <span className="underline">{editOrder?.order_id}</span>
          </h6>
        </div>
      ) : null}
      <div className="home__cart-items flex flex-col pb-60 flex-auto gap-2 p-3 overflow-y-scroll">
        {[...orderitems]?.reverse().map((item, index) => (
          <CartItem key={item.id} index={index} item={item} />
        ))}
      </div>
      {/* Cart footer */}
      <HomeCartFooter selectedCustomer={selectedCustomer} />
    </div>
  );
};

export default HomeCartSection;
