import React, { useEffect, useState,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import HomeCartSection from "./sections/cart/HomeCartSection";
import HomeCategorySection from "./sections/HomeCategorySection";
import HomeItemsSection from "./sections/body/components/HomeItemsSection";
import HomeTopBar from "./sections/HomeTopBar";
import {
  getItemCategories,
  getItems,
  getPaymentMethods,
  getPriceGroups,
  getPrinters,
  getSelectedBodySection,
  getSelectedCategory,
  getSelectedTab,
  getTaxTypes,
  getUnits,
} from "./store/homeSlice";
import HomeBodySection from "./sections/body/HomeBodySection";
import { homeBodySection } from "./constants";
import { getStoreUserData } from "../../store/storeUser/storeUserSlice";
import { getBookedTablesForToday, getFloorsTables } from "./store/tableSlice";
import { getOrders } from "./store/orderSlice";
import { getStoreCustomers } from "./store/customerSlice";
import { useNavigate } from 'react-router-dom';
import EditCart from "./sections/editCart";

import { connectWebSocket,fetchOrders} from "../../../services/apiService.js";
import notificationSound from '../../../assets/Moto Notification Ringtone Download - MobCup.Com.Co.mp3'
import { useOrderContext } from "./sections/body/components/OrderContext.jsx";


const Home = () => {
  const selectedCategory = useSelector(getSelectedCategory);
  const selectedBodySection = useSelector(getSelectedBodySection);
  const selectedTab = useSelector(getSelectedTab);
  const dispatch = useDispatch();
  const store_user = useSelector(getStoreUserData);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const editOrder = useSelector((state) => state.order.editOrder);
  const [soundPlaying, setSoundPlaying] = useState(false); // State to manage sound
  const [audio, setAudio] = useState(null);
  const [orders, setOrders] = useState([]); // State to manage orders
  const audioRef = useRef(null); // Use ref to manage audio object
  const { totalOrders, setTotalOrders } = useOrderContext(); // Access context values

  const navigate = useNavigate();
  useEffect(() => {
    if (store_user && store_user?.accessToken) {
      const kdsRoles = store_user.roles.filter(role => role.name.toUpperCase().startsWith("KDS"));
      const hasExactKDSRole = kdsRoles.some(role => role.name.includes("KDS"));

      if (hasExactKDSRole) {
        //to fix routing issue
        navigate('/kds', { replace: true });
        console.log(hasExactKDSRole, 'kds');
        // setisLoggedIn(true)

      }
    } else {
      setisLoggedIn(false);

    }

  }, [store_user, navigate])
  useEffect(() => {

    // dispatch(getItemCategories());
    dispatch(getItemCategories(store_user?.accessToken));
    dispatch(getUnits(store_user?.accessToken));
    dispatch(getTaxTypes(store_user?.accessToken));
    dispatch(getPriceGroups(store_user?.accessToken));
    dispatch(getPrinters(store_user?.accessToken));
    // dispatch(getPaymentMethods(store_user?.accessToken));


    dispatch(getItems(store_user?.accessToken));
    dispatch(getFloorsTables(store_user?.accessToken));
    dispatch(getBookedTablesForToday(store_user?.accessToken));

    dispatch(getOrders(store_user?.accessToken));
    dispatch(getStoreCustomers(store_user?.accessToken));



    const fetchLatestOrders = () => {
      dispatch(getOrders(store_user?.accessToken));
    };
    fetchLatestOrders();
    const intervalId = setInterval(fetchLatestOrders, 30000);

    // Cleanup
      // Cleanup
      return () => {
        clearInterval(intervalId);
      };
    
  }, [dispatch, store_user?.accessToken]);

 


    // Play notification sound
    const playNotificationSound = () => {
      const newAudio = new Audio(notificationSound);
      newAudio.loop = true;
      newAudio.play();
      setAudio(newAudio);
  
      setTimeout(() => {
        newAudio.pause();
        newAudio.currentTime = 0;
        setSoundPlaying(false);
      }, 5 * 60 * 1000); // Stop sound after 5 minutes
    };
  

  // WebSocket connection to receive new orders
  useEffect(() => {
    const fetchAndSetOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data); // Set the fetched orders to state
        setTotalOrders(data.length); // Update context value
      } catch (error) {
        console.error("Error fetching initial orders:", error);
      }
    };

    fetchAndSetOrders();

    const socket = connectWebSocket((newOrder) => {
      setOrders((prevOrders) => {
        const updatedOrders = [newOrder, ...prevOrders]; // Add new order to the top
        setTotalOrders(updatedOrders.length); // Update context value
        setSoundPlaying(true); // Play sound when a new order is received
        return updatedOrders;
      });
    });

    return () => {
      socket.close();
      if (audio) {
        audio.pause(); // Ensure audio is stopped if the component unmounts
      }
    };
  }, [audio]);


    // Handle sound playing state
    useEffect(() => {
      if (soundPlaying) {
        playNotificationSound();
      }
    }, [soundPlaying]);
  

    
  return (
    <div className="flex items-stretch h-full bg-white">
      <div className="w-full h-full">
        <div className="flex flex-col h-full w-full">
          {/* HomeTopBar Component */}
          <div className="w-full h-full flex overflow-hidden">
            <HomeBodySection />
            {selectedBodySection !== "orders" &&
             selectedBodySection !== "online-orders" &&
             selectedBodySection !== "scheduled-orders" &&
             selectedBodySection !== "tables" ?
              <>
                <HomeCartSection />
              </>
              : null}

            {editOrder && (selectedBodySection === "orders" ||
             selectedBodySection === "online-orders" ||
             selectedBodySection === "scheduled-orders" ||
             selectedBodySection === "tables") ?
              <>
                <EditCart />
              </>
              : null}
          </div>
          {/* <button
            className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg"
            onClick={handleChatSupport}
          >
            Contact Support
          </button> */}
        </div>
      </div>
      {/* <ChatBot isOpen={isChatOpen} onClose={handleChatSupport} /> */}
    </div>
  );
};

export default Home;
