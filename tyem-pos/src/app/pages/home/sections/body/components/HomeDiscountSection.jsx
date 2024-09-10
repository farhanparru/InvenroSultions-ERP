import { Form, Input, Select } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setWholeCartDiscount } from "../../../store/cartSlice";

const HomeDiscountSection = () => {
  const [discountType, setDiscountType] = useState("fixed");
  const [discountAmount, setDiscountAmount] = useState(0);
  const dispatch = useDispatch();

  const __discountCart = () => {
    dispatch(setWholeCartDiscount({discountType:discountType,discountAmount:discountAmount}))
  }
  return (
    <div className="flex flex-col gap-3 p-2">
      <h2 className="text-lg font-bold">Discounts & Coupons</h2>

      <div className="flex flex-col gap-4 p-4 rounded-lg border shadow-2xl">
        <h2 className="text-md font-bold">
          Do You Want to Add Discounts to this Cart?
        </h2>
        <div className="flex gap-2">
          <Form>
            <div className="flex gap-10">
              <Form.Item label="Discount Type">
                <Select
                  onChange={(e) => setDiscountType(e)}
                  defaultValue="fixed"
                  style={{ width: 100 }}
                >
                  <Select.Option value="fixed">Fixed</Select.Option>
                  <Select.Option value="percentage">Percentage</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Amount">
                <Input onChange={(e) => setDiscountAmount(e.target.value)} type="number" style={{ width: 100 }} />
              </Form.Item>
            </div>
          </Form>
        </div>
        {discountType &&  discountAmount.length !== 0 && (
          <div className="flex justify-end gap-3">
            <button className="px-10 py-2 text-red-500 border-2 border-red-500 rounded-lg cursor-pointer transition-all hover:bg-red-500 hover:text-white">
              Cancel
            </button>
            <button onClick={()=>__discountCart()} className="px-10 py-2  border-2 border-green-500  bg-green-500 text-white rounded-lg cursor-pointer transition-all hover:bg-green-600 ">
              Proceed
            </button>
          </div>
        )}
      </div>

      {/* <h2 className="text-lg font-bold">Discounts & Coupons</h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <CouponVoucher />
        <CouponVoucher />
        <CouponVoucher />
        <CouponVoucher />
        <CouponVoucher />
        <CouponVoucher />
        <CouponVoucher />
        <CouponVoucher />
      </div> */}
    </div>
  );
};

export default HomeDiscountSection;

const CouponVoucher = () => {
  return (
    <div className="discount__coupon border-dashed border border-black bg-green-200 rounded-md transition-all cursor-pointer hover:scale-105  hover:rotate-1">
      <div className="flex gap-2 p-2 items-center">
        <div className="flex 1">
          <h2 className="text-md font-bold">GET50</h2>
        </div>
        <p className="text-xs pl-3 border-l border-gray-400">Get 50% off</p>
      </div>
    </div>
  );
};
