import React, { useEffect } from "react";
import { WifiOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrder,
  getOrders,
  getOrdersList2,
} from "../../../../pages/home/store/orderSlice";
import { getStoreUserData } from "../../../../store/storeUser/storeUserSlice";
import { useState } from "react";
import { useRef } from "react";
const OnlineComponent = ({ network }) => {
  const { ordersList } = useSelector(getOrdersList2);
  const store_user = useSelector(getStoreUserData);
  const isMounted = useRef(false);

  const dispatch = useDispatch();

  useEffect(() => {
    // window.addEventListener("offline", console.log(network, "offline"));
    // window.addEventListener("online", console.log(network, "online"));
  }, []);

  useEffect(() => {
    if (network == true) {
      setTimeout(() => {
        if (localStorage.getItem("synced") !== undefined) {
          if (
            localStorage.getItem("synced") == "false" ||
            localStorage.getItem("synced") == false
          ) {
            syncAllOrders();
            console.log("Online..");
            localStorage.setItem("synced", true);
          }
        } else {
          localStorage.setItem("synced", true);
        }
      }, 5000);
    }
  }, []);

  const syncAllOrders = () => {
    [...ordersList].reverse().forEach((order) => {
      if (order.is_synced == 0) {
        syncSingleOrder(order);
      }
    });
  };
  const syncSingleOrder = (order) => {
    if (order) {
      dispatch(
        addOrder({
          token: store_user.accessToken,
          table: order.table ? order.table : 0,
          cartState: order.cartState,
          orderitems: order?.cartState?.orderitems,
          orderStatus: order.orderStatus,
          id: order.id,
          time: new Date().getTime(),
          paymentMethod: order?.cartState?.paymentMethod,
          paymentStatus: order.paymentStatus,
          customer: order.customer ? order.customer : 0,
          store_id: store_user.business.id,
          type: order.type,
        })
      );

      setTimeout(() => {
        dispatch(getOrders(store_user?.accessToken));
      }, 200);
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center m-3">
        {/* <p className="font-bold">You are Online</p> */}
        <WifiOutlined
          height="150"
          width="150"
          className="mx-4 text-xl text-lime-500"
        />
      </div>
    </div>
  );
};

export default OnlineComponent;
