import { uniqueId } from "lodash";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import KdsItems from "./KdsItems/KdsItems";
import OrderList from "./OrderList/OrderList";
import Hotkeys from "react-hot-keys";
import {
  closeKdsOrder,
  getKdsOrders,
  getKdsOrdersList,
  pushToRecallList,
  recallClosedOrder,
  recallSingleItem,
  removeKdsOrder,
} from "../home/store/kdsSlice";
import { getStoreUserData } from "../../store/storeUser/storeUserSlice";
import moment from "moment";
import HomeBodySection from "../home/sections/body/HomeBodySection";
import HomeCartSection from "../home/sections/cart/HomeCartSection";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

const KDS = () => {
  const { kdsOrdersList } = useSelector((state) => state.kds);
  const { recallList } = useSelector((state) => state.kds);

  const [closeOrderId, setcloseOrderId] = useState(0);
  const navigate = useNavigate()

  // console.log(kdsOrdersList, "kdsOrdersList");

  const store_user = useSelector(getStoreUserData);

  const dispatch = useDispatch();

  // const sortedList = ordersList.sort((a, b) => a.created_at - b.created_at);
  // useEffect(() => {
  //   dispatch(getKdsOrders(store_user?.accessToken));
  // }, []);

  useEffect(() => {
    // Define a function to fetch latest orders
    const fetchLatestOrders = () => {
      dispatch(getKdsOrders(store_user?.accessToken));
    };

    // Call the function initially when the component mounts
    fetchLatestOrders();

    // Set up an interval to call the function every 5 seconds
    const intervalId = setInterval(fetchLatestOrders, 5000);

    // Clear the interval when the component unmounts to prevent memory leaks
    return () => clearInterval(intervalId);
  }, [store_user, dispatch]);

  useEffect(() => {
    let token = store_user?.accessToken;

    if (token != null || token != undefined) {
    } else {
      navigate('/', { replace: true });
      
      // window.location.href = 'https://tyempos.shiftdevs.com/'

    }
    
  }, [store_user]);
  const __manageKdsOrder = (id, type, order) => {
    dispatch(
      closeKdsOrder({ token: store_user?.accessToken, id: id, type: type })
    );

    toast.success('Order #' + id + ' marked as ready for table' )
    dispatch(pushToRecallList(order));

    setTimeout(() => {
      dispatch(getKdsOrders(store_user?.accessToken));

      // dispatch(
      //   getStoreUserData()
      // );
      // window.location.reload();
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getKdsOrders(store_user?.accessToken));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const __recallSingleOrder = () => {
    if (recallList?.length > 0) {
      // this.users.splice(index, 1);
      const lastDeleted = recallList[recallList?.length - 1];
      dispatch(
        recallClosedOrder({
          token: store_user?.accessToken,
          id: lastDeleted.id,
          type: "RECALL",
        })
      );
    } else {
      console.log(recallList?.length);
    }

    // kdsOrdersList.
    dispatch(recallSingleItem());
  };

  const __getHeaderColorClass = (order) => {
    const diff = moment().diff(moment(order?.created_at));
    const duration = moment.duration(diff);
    const minutes = duration.asHours();
    if (minutes < 10) {
      return "bg-green-500"; // return the name of the color or a CSS value
    } else {
      return "bg-red-500";
    }
  };

  const onKeyDown = (keyName, e, handle) => {
    if(keyName === "shift+r"){
      __recallSingleOrder();
    }else{
      const order = kdsOrdersList[keyName - 1];
      if (order) {
        __manageKdsOrder(order.id, "ACCEPT", order);
      }
    }
  };

  return (
    <div className="flex items-stretch h-full  bg-white">
        <Toaster position="bottom-center" richColors />

     <div className="w-full h-full">
        <div className="flex flex-col  h-full w-full">
          {/* <HomeTopBar selectedTab={selectedTab} /> */}
          <div className="w-full h-full flex-col flex  overflow-hidden ">
          <div
        className={`
            overflow-x-scroll 
            grid grid-cols-1 gap-0 grid-rows-auto  h-full w-full
          p-3
          md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4
          sm:gap-3 lg:gap-1 xl:gap-1
          
          `}
      >
        <Hotkeys
          keyName="1,2,3,4,5,6,7,8,shift+r"
          onKeyDown={onKeyDown.bind(this)}
          filter={(event) => true}
        >
          {kdsOrdersList &&
            kdsOrdersList.slice(0, 8).map((order, index) => {
              const headerColorClass = __getHeaderColorClass(order);

              return (
                <OrderList
                  headerColorClass={headerColorClass}
                  order={order}
                  __manageKdsOrder={__manageKdsOrder}
                />
              );
            })}
        </Hotkeys>
      </div> 

      <div className=" flex justify-between">
        <div className="bg-red-600 p-4 w-full">
          <h2 className="text-white font-black text-lg text-center">LATE</h2>
        </div>
        <div className="bg-green-500 p-4 w-full">
          <h2 className="text-white font-black text-lg text-center">NEW</h2>
        </div>
        <div className="bg-orange-500 p-4 w-full">
          <h2 className="text-white font-black text-lg text-center">READY</h2>
        </div>
        <div className="bg-purple-500 p-4 w-full">
          <h2 className="text-white font-black text-lg text-center">
            CANCELLED
          </h2>
        </div>
        <div className="bg-yellow-500 p-4 w-full">
          <h2 className="text-white font-black text-lg text-center">NEXT</h2>
        </div>
        <div className="bg-red-700 p-4 w-full">
          <h2 className="text-white font-black text-lg text-center">RECALL</h2>
        </div>
        <div
          className="bg-red-900 p-4 w-full"
          onClick={() => __recallSingleOrder()}
        >
          <h2 className="text-white font-black text-lg text-center">
            RECALL LAST
          </h2>
        </div>
      </div> 
          </div>
        </div>
      </div>
      {/* <div
        className={`
            overflow-x-scroll 
            grid grid-cols-1 gap-0 grid-rows-auto  h-full w-full
          p-3
          md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4
          sm:gap-3 lg:gap-1 xl:gap-1
          
          `}
      >
        <Hotkeys
          keyName="1,2,3,4,5,6,7,8,shift+r"
          onKeyDown={onKeyDown.bind(this)}
          filter={(event) => true}
        >
          {kdsOrdersList &&
            kdsOrdersList.slice(0, 8).map((order, index) => {
              const headerColorClass = __getHeaderColorClass(order);

              return (
                <OrderList
                  headerColorClass={headerColorClass}
                  order={order}
                  __manageKdsOrder={__manageKdsOrder}
                />
              );
            })}
        </Hotkeys>
      </div> */}

      {/* <div className=" flex justify-between">
        <div className="bg-red-600 p-4 w-full">
          <h2 className="text-white font-black text-lg text-center">LATE</h2>
        </div>
        <div className="bg-green-500 p-4 w-full">
          <h2 className="text-white font-black text-lg text-center">NEW</h2>
        </div>
        <div className="bg-orange-500 p-4 w-full">
          <h2 className="text-white font-black text-lg text-center">READY</h2>
        </div>
        <div className="bg-purple-500 p-4 w-full">
          <h2 className="text-white font-black text-lg text-center">
            CANCELLED
          </h2>
        </div>
        <div className="bg-yellow-500 p-4 w-full">
          <h2 className="text-white font-black text-lg text-center">NEXT</h2>
        </div>
        <div className="bg-red-700 p-4 w-full">
          <h2 className="text-white font-black text-lg text-center">RECALL</h2>
        </div>
        <div
          className="bg-red-900 p-4 w-full"
          onClick={() => __recallSingleOrder()}
        >
          <h2 className="text-white font-black text-lg text-center">
            RECALL LAST
          </h2>
        </div>
      </div> */}
    </div>
  );
};

export default KDS;
