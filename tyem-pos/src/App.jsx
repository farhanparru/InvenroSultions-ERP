import React, { useEffect, useState } from "react";
import { Layout, Menu, theme } from "antd";
import Navbar from "./app/layout/navbar/Navbar";
import Drawer from "./app/layout/drawer/Drawer";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./app/pages/home/Home";
import Customers from "./app/pages/customers/Customers";
import Sales from "./app/pages/sales/Sales";
import Orders from "./app/pages/orders/Orders";
import Reports from "./app/pages/reports/Reports";
import Cash from "./app/pages/cash/Cash";
import Settings from "./app/pages/settings/Settings";
import { drawerMenuLabels } from "./app/layout/drawer/constants/drawerMenu";
import KDS from "./app/pages/kds/KDS";
import Login from "./app/pages/auth";
import { getStoreUserData } from "./app/store/storeUser/storeUserSlice";
import { useSelector } from "react-redux";
import Print from "./app/pages/home/components/Print";
import HomeOrdersSection from "./app/pages/home/sections/body/components/HomeOrdersSection";
import HomeItemsSection from "./app/pages/home/sections/body/components/HomeItemsSection";
import Salessecstion from "./app/pages/home/sections/body/components/Salessecstion";
import HomeTopBar from "./app/pages/home/sections/HomeTopBar";
import HomeTableSection from "./app/pages/home/sections/body/components/HomeTableSection";
import DevicesList from "./KDS/DevicesList";
import NavbarWithSidebar from "./KDS/NavbarWithSidebar";
import KdsGrid from "./KDS/KdsGrid";
import HoldingCartCard from "./app/pages/home/sections/body/components/HoldingCartCard";
import HomeTableViewCart from "./app/pages/home/sections/body/components/HomeTableViewCart";

drawerMenuLabels;

const { Sider, Content } = Layout;
const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = React.useState("Home");
  const storeUser = useSelector(getStoreUserData);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    let token = storeUser?.accessToken;

    if (token != null || token != undefined) {
      setisLoggedIn(true);
    } else {
      // window.location.href = 'https://tyempos.shiftdevs.com/'
    }
    let keys = Object.keys(drawerMenuLabels);
    keys.forEach((key) => {
      if (drawerMenuLabels[key].path === window.location.pathname) {
        setActiveMenu(drawerMenuLabels[key].label);
      }
    });
  }, [storeUser]);

  useEffect(() => {
    changeToAuthRoutes();
  }, [storeUser]);

  const changeToAuthRoutes = () => {
    if (storeUser && storeUser?.accessToken) {
      setisLoggedIn(true);
      // if(storeUser.data.role.toLowerCase().includes("kds")){
      //   console.log("kds");
      //   //to fix routing issue
      // }
    } else {
      setisLoggedIn(false);
    }
  };

  const location = useLocation();

  const showLayout = ![
    "/Sale",
    "/home",
    "/Item",
    "/Expense",
    "/Customers",
    "/Employes",
    "/ResturentManagment",
    "/:id/HomeTable",
    "/AccountsSettings",
    "/Inventromangment",
    "/devices",
    "/Kds/:deviceId/",
    "/DvList",
  ].includes(location.pathname);

  return (
    <div>
      {isLoggedIn ? (
        !["/bill"].includes(location.pathname) ? (
          showLayout ? (
            <Layout className="h-screen">
              <Drawer
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                collapsed={collapsed}
              />
              <Layout className="site-layout">
                <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
                <Content style={{ minHeight: 280, height: "100%" }}>
                  <AuthRoutes />
                </Content>
              </Layout>
            </Layout>
          ) : (
            <Routes></Routes>
          )
        ) : (
          <Routes>{/* <Route path="/bill" element={<Print />} /> */}</Routes>
        )
      ) : (
        <NonAuthRoutes />
      )}
    </div>
  );
};

const NonAuthRoutes = () => {
  return (
    <Routes>
      <Route
        path={drawerMenuLabels.online.path}
        exact
        element={<HomeOrdersSection />}
      />
      <Route path={drawerMenuLabels.home.path} exact element={<Login />} />
      <Route path={drawerMenuLabels.home.path} exact element={<Home />} />
    </Routes>
  );
};

const AuthRoutes = () => {
  return (
    <Routes>
      <Route
        path={drawerMenuLabels.online.path}
        exact
        element={<HomeOrdersSection />}
      />
      <Route path="/Home" element={<HomeItemsSection />} />
      <Route path="/sales" element={<Salessecstion />} />
      <Route
        path="/hometableviewcart/:tableId"
        element={<HomeTableViewCart />}
      />
      <Route path="/Kds/:deviceId" element={<NavbarWithSidebar />} />
      <Route path="/DvList" element={<DevicesList />} />
      <Route path="/onHold" element={<HoldingCartCard />} />
      <Route path="/bill" exact element={<Print />} />
      <Route path="/scheduled-orders" element={<HomeOrdersSection />} />
      <Route path={drawerMenuLabels.home.path} exact element={<Home />} />
      <Route
        path={drawerMenuLabels.customers.path}
        exact
        element={<Customers />}
      />
      <Route path="/" element={<HomeTopBar />} />
      <Route path="/tables" element={<HomeTableSection />} />
      {/* <Route path={drawerMenuLabels.sales.path} exact element={<Sales />} /> */}
      <Route path={drawerMenuLabels.orders.path} exact element={<Orders />} />
      <Route path={drawerMenuLabels.reports.path} exact element={<Reports />} />
      <Route path={drawerMenuLabels.cash.path} exact element={<Cash />} />
      <Route
        path={drawerMenuLabels.settings.path}
        exactelement={<Settings />}
      />
    </Routes>
  );
};

export default App;
