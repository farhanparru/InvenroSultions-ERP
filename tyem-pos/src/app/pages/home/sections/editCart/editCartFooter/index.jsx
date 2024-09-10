import React, { useState } from 'react'
import useCollapse from 'react-collapsed';
import { CiEdit, CiMoneyBill } from 'react-icons/ci';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, clearCart, setWholeCartDiscount } from "../../../store/cartSlice";
import { setselectedTable } from '../../../store/tableSlice';
import { selectBodySection } from '../../../store/homeSlice';
import CustomModal from '../../../../../components/CustomModal';
import { Space, Table, Tag, Input, Checkbox, Select, Radio } from "antd";
import { Button, Dropdown, notification, Popconfirm } from "antd";
import { WEBSITE_API_URL } from '../../../../../config';
import { getOrders } from '../../../store/orderSlice';
import { getStoreUserData } from '../../../../../store/storeUser/storeUserSlice';
import axios from 'axios';

const actionBtnClass = `w-full text-[0.6rem] py-2 font-medium rounded-lg   transition-all ease-in-out hover:scale-95 `;

const EditCartFooter = () => {
    const dispatch = useDispatch();

    const editOrder = useSelector((state) => state.order.editOrder);
    const store_user = useSelector(getStoreUserData);

    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
    const [showModal, setShowModal] = useState(false);
    const [selectedRefundItems, setSelectedRefundItems] = useState([]);
    const [selectedRefundMethod, setRefundMethod] = useState("CASH");
    const [value, setValue] = useState(1);
    const [isButtonLoading, setIsButtonLoading] = useState(false);

    const __editOrder = () => {
        // alert(editOrder?.cartState?.discountValue)
        // return
        dispatch(clearCart())
        dispatch(setselectedTable(editOrder?.selectedTable));
       
        editOrder?.orderitems?.length !== 0 && editOrder?.orderitems?.forEach(element => {

            dispatch(addToCart(element));

        });
        setTimeout(() => {
            dispatch(
                setWholeCartDiscount({
                    discountType: editOrder?.cartState?.discountType,
                    discountAmount: parseFloat(editOrder?.cartState?.discountValue).toFixed(3),
                })
            );
            dispatch(selectBodySection("home"))

           
        }, 500);

    }

    const selectAll = () => {
        if (selectedRefundItems.length === editOrder?.orderitems?.length) {
            setSelectedRefundItems([]);
        } else {
            setSelectedRefundItems(editOrder?.orderitems);
        }
    };

    const getRefundableQuanity = (item) => {
        if (selectedRefundItems.includes(item)) {
            return item.quantity;
        } else {
            return 1;
        }
    };

    const getTotalRefundAmount = () => {
        let amount = 0;
        selectedRefundItems.forEach((item) => {
            // console.log(item);
            amount += item.price * item.quantity;
        });

        return parseFloat(amount).toFixed(2);
    };

    const handleChange = (value) => {
        setRefundMethod(value);
    };


    const onChange = (e) => {
        setValue(e.target.value);
    };

    const addToRefundItems = (item) => {
        const index = selectedRefundItems.indexOf(item);
        if (index !== -1) {
            const newArray = [...selectedRefundItems];
            newArray.splice(index, 1);
            setSelectedRefundItems(newArray);
        } else {
            const newArray = [...selectedRefundItems, item];
            setSelectedRefundItems(newArray);
        }
    };


    const initiateRefund = () => {
        const refundPayload = {
            order_id: editOrder.id,
            refund_items: selectedRefundItems,
            refund_method: selectedRefundMethod,
            refund_reason: value,
        };
        setIsButtonLoading(true);

        const headers = {
            "Authorization": `Bearer ${store_user?.accessToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        };
        axios
            .post(WEBSITE_API_URL + "/refund-order", {
                token: store_user?.accessToken,
                refundPayload,
            }, { headers })
            .then((response) => {
                // console.log(response.data);
                setIsButtonLoading(false);
                setShowModal(false);

                dispatch(getOrders(store_user?.accessToken));
                // dispatch(selectOldOrder(order));

                // Handle success response
            })
            .catch((error) => {
                // console.log(error);
                setIsButtonLoading(false);
                // Handle error response
            });
    };

    const changeRefundQuantity = (e, item) => {
        const index = selectedRefundItems.findIndex((i) => i.id === item.id);
        if (index !== -1) {
            const tempArray = [...selectedRefundItems];
            let newItem = Object.assign({}, item);
            newItem.quantity = e.target.value;
            tempArray[index] = newItem;
            setSelectedRefundItems(tempArray);
        }
    };
    return (
        <div
            className={`home__cart-footer absolute bottom-0 w-full flex flex-col p-3 bg-gray-100 text-black border-t  border-gray-300 gap-3 ${isExpanded ? " overflow-y-scroll h-[90%]" : ""
                }`}

        >
            <div className="flex justify-between gap-2">
                <p className="text-xs font-semibold">
                    {editOrder?.table === 0
                        ? "No Table Selected"
                        : `Table :  ${editOrder.table} is Selected`}
                </p>
                <p className="text-xs font-semibold">
                    Customer :
                    {editOrder?.customer === null
                        ? "No Customer Selected"
                        : `${editOrder?.customer?.name}`}
                </p>
            </div>

            <div className="cart__footer-total flex justify-between gap-5  ">
                <p className="text-sm font-sem-bold ">Subtotal</p>
                <p className="text-sm font-black text-black">
                    ₹ {parseFloat(editOrder?.cartState?.totalAmount).toFixed(3)}
                </p>
            </div>

            <div className="cart__footer-total flex justify-between gap-5  ">
                <p className="text-sm font-bold ">VAT</p>
                <p className="text-sm font-black text-black">₹ {parseFloat(editOrder?.cartState?.tax).toFixed(3)}</p>
            </div>
            <div className="cart__footer-total flex justify-between gap-5  ">
                <p className="text-sm font-bold ">Discount</p>
                <p className="text-sm font-black text-black">₹ {parseFloat(editOrder?.cartState?.discount).toFixed(3)}</p>
            </div>
            <div className="cart__footer-total flex justify-between gap-5  ">
                <p className="text-lg font-bold ">Payable Amount</p>
                <p className="text-lg font-black text-black">
                    ₹ {parseFloat(editOrder?.cartState?.totalPayableAmount).toFixed(3)}
                </p>
            </div>
            {editOrder !== undefined && editOrder?.orderitems?.length !== 0 &&

                <div className="flex gap-2 items-center">
                    <button
                        onClick={() => __editOrder()}
                        className={`${actionBtnClass}  bg-yellow-500  text-white hover:bg-orange-300 p-2 flex gap-2 justify-center items-center`}

                    >
                        <CiEdit color="#fff" size={20} />
                        <p className="text-sm font-semibold mt-[0.2rem] text-white">
                            Edit Order
                        </p>
                    </button>
                    <button
                        onClick={() =>
                            setShowModal(true)
                        }
                        className={`${actionBtnClass}  bg-orange-500  text-white hover:bg-orange-300 p-2 flex gap-2 justify-center items-center`}

                    >
                        <CiMoneyBill color="#fff" size={20} />
                        <p className="text-sm font-semibold mt-[0.2rem] text-white">
                            Refund Ordeer
                        </p>
                    </button>

                </div>
            }

            {showModal && (
                <CustomModal
                    onClose={() => {
                        setSelectedRefundItems([]);
                        setShowModal(false);
                    }}
                >
                    <div className="p-10 flex items-left flex-col gap-5 text-black">
                        <div style={{ display: "flex", width: "45vw" }}>
                            <div className="w-[16.66%] text-left">Name</div>
                            <div className="w-[16.66%] text-center">Amount</div>
                            <div className="w-[16.66%] text-center">Quantity</div>
                            <div className="w-[16.66%] text-center">Refund Quantity</div>
                            <div className="w-[16.66%] text-center">Total</div>
                            <div className="w-[16.66%] text-center"> <Checkbox onChange={selectAll}> Select All</Checkbox>  </div>
                        </div>
                        <hr />
                        <div
                            style={{
                                height: "200px",
                                overflowY: "scroll",
                            }}
                        >

                            {editOrder?.orderitems?.map((item, index) => (
                                <div
                                    style={{
                                        display: "flex",
                                        width: "45vw",
                                        backgroundColor: selectedRefundItems.includes(item)
                                            ? "#e1e1e1"
                                            : "white",
                                        padding: "10px",
                                        borderRadius: "9px",
                                    }}
                                >
                                    <div className="w-[16.66%] text-left">
                                        <b>{item.name}</b>
                                    </div>
                                    <div className="w-[16.66%] text-center">{item.price}</div>
                                    <div className="w-[16.66%] text-center">{item.quantity}</div>
                                    <div className="w-[16.66%] text-center">
                                        <Input
                                            max={item.quantity}
                                            onChange={(e) => changeRefundQuantity(e, item)}
                                            disabled={
                                                !selectedRefundItems.includes(item) ||
                                                item.quantity === 1
                                            }
                                            value={
                                                item.quantity === getRefundableQuanity(item)
                                                    ? item.quantity
                                                    : getRefundableQuanity(item)
                                            }
                                        />
                                    </div>
                                    <div className="w-[16.66%] text-center">
                                        {parseFloat(item.price * item.quantity).toFixed(2)}
                                    </div>
                                    <div className="w-[16.66%] text-center">
                                        <Checkbox onChange={() => addToRefundItems(item)}
                                            checked={selectedRefundItems.includes(item)}

                                        >
                                            {selectedRefundItems.includes(item)
                                                ? "Selected"
                                                : "Select"}
                                        </Checkbox>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr />

                        <div>
                            <b>Amount to Refund</b>
                            <br />
                            <Input disabled value={getTotalRefundAmount()} />
                        </div>
                        <div>
                            <b>Payment Method</b>

                            <Select
                                defaultValue="CASH"
                                style={{ width: "100%" }}
                                onChange={handleChange}
                                options={[
                                    { value: "CASH", label: "CASH" },
                                    { value: "CARD", label: "CARD" },
                                ]}
                            />
                        </div>
                        <div>
                            <b>Reason for Refund</b>
                            <br />
                            <Radio.Group onChange={onChange} value={value}>
                                <Radio value={1}>Returned Goods</Radio>
                                <Radio value={2}>Accidental Charge</Radio>
                                <Radio value={3}>Cancelled Order</Radio>
                                <Radio value={4}>Other</Radio>
                            </Radio.Group>
                        </div>

                        <div style={{ display: "flex", justifyContent: "right" }}>
                            <Button
                                onClick={() => initiateRefund()}
                                loading={isButtonLoading}
                            >
                                Submit for Refund
                            </Button>
                        </div>
                    </div>
                </CustomModal>
            )}
        </div>
    )
}

export default EditCartFooter