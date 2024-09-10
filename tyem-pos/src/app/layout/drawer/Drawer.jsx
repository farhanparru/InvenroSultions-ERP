import React from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Layout } from "antd";
import styled, { keyframes } from "styled-components";
import {
  UilEstate,
  UilUsersAlt,
  UilBox,
  UilFileGraph,
  UilSetting,
  UilTag, // Sales icon
} from "@iconscout/react-unicons";
import {
  FaUtensils,
  FaShoppingCart,
  FaChartLine,
  FaClipboardList,
  FaCashRegister,
  FaUsers,
  FaCog,
  FaGlobe,
} from "react-icons/fa";

import { drawerMenuLabels } from "./constants/drawerMenu";
import { Link } from "react-router-dom";
import logo from "../../../assets/Logo.png";
import { useOrderContext } from "../../pages/home/sections/body/components/OrderContext";

const { Sider } = Layout;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
`;

const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  50% {
    transform: translateX(4px);
  }
  75% {
    transform: translateX(-4px);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: red;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(2);
  transition: transform 0.3s, background-color 0.9s;
  animation: ${pulse} 1.16s infinite;

  &:hover {
    animation: ${shake} 0.5s;
  }
`;

const DrawerMenuItemContainer = styled.div`
  width: 100%;
  padding: 2.75rem;
  height: 6rem; /* Increased height for more spacing */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem; /* Increased gap between icon and label */
  background-color: ${(props) => (props.active ? "#1d1d1d" : "transparent")};
  color: ${(props) => (props.active ? "white" : "#6b7280")};
  transition: all 0.3s ease-in-out;
  position: relative;

  &:hover {
    background-color: #1d1d1d;
    color: white;
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    height: 100%;
    width: 4px;
    background-color: ${(props) => (props.active ? "#3b82f6" : "transparent")};
    transition: background-color 0.3s ease-in-out;
  }
`;

const IconContainer = styled.div`
  position: relative;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem; /* Adjust font size as needed */
  text-align: center;
`;

const ShortcutText = styled.span`
  font-size: 0.75rem; /* Increased font size for the shortcut */
  color: ${(props) => (props.active ? "white" : "#9ca3af")};
  margin-top: 0.5rem; /* Increased space between label and shortcut */
`;

const DrawerMenuItem = ({
  Icon,
  label,
  active,
  onClick,
  path,
  badge,
  shortcut,
}) => {
  return (
    <Link to={path}>
      <DrawerMenuItemContainer onClick={onClick} active={active}>
        <IconContainer>
          <Icon className="text-xl" />
          {badge && <Badge>{badge}</Badge>}
        </IconContainer>
        <p className="text-xs font-medium">{label}</p>
        <ShortcutText active={active}>{shortcut}</ShortcutText>
      </DrawerMenuItemContainer>
    </Link>
  );
};

const Drawer = ({ activeMenu, setActiveMenu, collapsed }) => {
  const { totalOrders } = useOrderContext(); // Access totalOrders from context

  const menuItems = [
    {
      label: drawerMenuLabels.home.label,
      icon: UilEstate,
      onClick: () => setActiveMenu(drawerMenuLabels.home.label),
      path: drawerMenuLabels.home.path,
      shortcut: "Alt+1",
    },
    {
      label: drawerMenuLabels.customers.label,
      icon: UilUsersAlt,
      onClick: () => setActiveMenu(drawerMenuLabels.customers.label),
      path: drawerMenuLabels.customers.path,
      shortcut: "Alt+2",
    },
    {
      label: drawerMenuLabels.online.label,
      icon: FaGlobe,
      onClick: () => setActiveMenu(drawerMenuLabels.online.label),
      path: drawerMenuLabels.online.path,
      badge: totalOrders, // Use totalOrders from context
      shortcut: "Alt+3",
    },
    {
      label: drawerMenuLabels.orders.label,
      icon: UilBox,
      onClick: () => setActiveMenu(drawerMenuLabels.orders.label),
      path: drawerMenuLabels.orders.path,
      shortcut: "Alt+4",
    },
    {
      label: drawerMenuLabels.reports.label,
      icon: FaClipboardList,
      onClick: () => setActiveMenu(drawerMenuLabels.reports.label),
      path: drawerMenuLabels.reports.path,
      shortcut: "Alt+5",
    },
    {
      label: drawerMenuLabels.settings.label,
      icon: FaCog,
      onClick: () => setActiveMenu(drawerMenuLabels.settings.label),
      path: drawerMenuLabels.settings.path,
      shortcut: "Alt+6",
    },
    {
      label: drawerMenuLabels.sales.label,
      icon: FaChartLine, // Sales icon
      onClick: () => setActiveMenu(drawerMenuLabels.sales.label),
      path: drawerMenuLabels.sales.path,
      shortcut: "Alt+7",
    },
    // {
    //   label: drawerMenuLabels.scheduledOrders.label,
    //   icon: AiOutlineShoppingCart, // Scheduled Orders icon
    //   onClick: () => setActiveMenu(drawerMenuLabels.scheduledOrders.label),
    //   path: drawerMenuLabels.scheduledOrders.path,
    //   shortcut: "Alt+8",
    // }
  ];

  return (
    <Sider
      theme="dark"
      trigger={null}
      collapsible
      width={120}
      collapsed={!collapsed}
      className="bg-gray-900 h-[999px] fixed top-0 left-0" // Fixed position with full height
    >
      <div className="flex flex-col items-center py-4">
        <div className="flex items-center justify-center">
          <img
            src={logo}
            alt="logo"
            className="w-15 h-15 mb-2 max-w-[70%] animate-zoom"
          />
        </div>

        {menuItems.map((item) => (
          <DrawerMenuItem
            Icon={item.icon}
            label={item.label}
            active={activeMenu === item.label}
            onClick={item.onClick}
            path={item.path}
            key={item.path}
            badge={item.badge} // Pass badge prop here
            shortcut={item.shortcut} // Passing the shortcut prop here
          />
        ))}
      </div>
      <div className="mt-auto mb-4">
        <div className="flex items-center justify-center text-gray-500">
          <span className="text-xs">Online</span>
          <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
        </div>
      </div>
    </Sider>
  );
};

export default Drawer;
