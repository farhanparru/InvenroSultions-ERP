import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { homeBodySection } from "../constants";
import { selectBodySection } from "../store/homeSlice";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { clearEditOrder } from "../store/orderSlice";


const HomeTopBar = ({ selectedTab }) => {
  const { ordersList } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [allOrdersCount, setAllOrdersCount] = useState(10);
  const [onlineOrdersCount, setOnlineOrdersCount] = useState(0);
  const [scheduledOrdersCount, setScheduledOrdersCount] = useState(0);
  const [selectedButton, setSelectedButton] = useState("Tables"); 

  useEffect(() => {
    getOrdersCount();
  }, [ordersList]);

  const getOrdersCount = () => {
    const totalOrdersCount = ordersList.length;
    const onlineOrdersCount = ordersList.filter(
      (order) => order.selling_price_group.toLowerCase() === "online"
    ).length;
    const scheduledOrdersCount = ordersList.filter(
      (order) => order.is_scheduled === 1
    ).length;

    setAllOrdersCount(totalOrdersCount);
    setOnlineOrdersCount(onlineOrdersCount);
    setScheduledOrdersCount(scheduledOrdersCount);
  };

  const buttonLabels = [
    "Tables",
    "On Hold",
    "Takeaway",
    "Dine In",
    "Delivery",
    "Online",
    "Zomato",
  ];

  const TextTab = ({ item, active }) => {
    return (
      <Link to={item.link}>
        <div
          className={`
          font-bold text-center text-base px-3 py-2 cursor-pointer transition-all
          ${
            active
              ? "bg-blue-500 text-white"
              : "text-blue-500 hover:bg-blue-100 hover:text-blue-500"
          }
        `}
        >
          <h3
            onClick={() => {
              dispatch(selectBodySection(item.slug));
              dispatch(clearEditOrder());
            }}
          >
          </h3>
        </div>
      </Link>
    );
  };

  return (
    <div>
      <div className="w-full flex gap-6 px-4 py-2 bg-white shadow-md ml-[-195px] " style={{marginBottom:"35px", marginTop:"-13px"}}>
        {homeBodySection.map((item) => {
          let isActive = item.slug === selectedTab;
          return <TextTab key={item.slug} active={isActive} item={item} />;
        })}
        {buttonLabels.map((label, index) => (
          <button
            key={index}
            className={`
              font-bold text-base text-center px-4 py-2 rounded-md cursor-pointer transition-all
              ${
                selectedButton === label
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500 hover:bg-blue-100 hover:text-blue-600"
              }
            `}
            onClick={() => {
              setSelectedButton(label);
              if (label === "Tables") {
                navigate('/tables'); // Navigate to the HomeTableSection route when "Tables" is clicked
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeTopBar;
