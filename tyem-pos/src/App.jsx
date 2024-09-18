import React, { useEffect, useState } from "react";
import { Layout, Menu, theme } from "antd";
import Navbar from "./app/layout/navbar/Navbar";
import Drawer from "./app/layout/drawer/Drawer";
import { Routes, Route,useLocation } from "react-router-dom";
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
import HoldOrder from "./app/pages/HoldOrders/HoldOrders";
import Odersale from "./Adminpanle/Odersale";
import FullWrapp from "./Adminpanle/Home/FullWrapp";
import Item from "./Adminpanle/Item";
import Print from "./app/pages/home/components/Print";
import HomeOrdersSection from "./app/pages/home/sections/body/components/HomeOrdersSection";
import ExpenseList from '../src/Adminpanle/ExpenseList'
import Customer from '../src/Adminpanle/Customers'
import HomeItemsSection from "./app/pages/home/sections/body/components/HomeItemsSection";
import Salessecstion from "./app/pages/home/sections/body/components/Salessecstion";
import Employe from '../src/Adminpanle/Employe'
import HomeTopBar from "./app/pages/home/sections/HomeTopBar";
import HomeTableSection from "./app/pages/home/sections/body/components/HomeTableSection";
import ResturentManagment from "./Adminpanle/ResturentManagment";
import InventoryManagement from './Adminpanle/MangmentInventro'
import AccountSettings from './Adminpanle/AccountSettings'
import HomeTable from "./Adminpanle/HomeTable";
import Devices from "./Adminpanle/SettingsNavbar/Devices";
import DevicesList from "./KDS/DevicesList";



drawerMenuLabels;

const { Sider, Content } = Layout;
const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = React.useState("Home");
  const storeUser = useSelector(getStoreUserData)
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
    changeToAuthRoutes()
    
  }, [storeUser])
  

  const changeToAuthRoutes = () => {

    if (storeUser && storeUser?.accessToken) {
      setisLoggedIn(true)
      // if(storeUser.data.role.toLowerCase().includes("kds")){
      //   console.log("kds");
      //   //to fix routing issue
      // }
    } else {
      setisLoggedIn(false);

    }
  }

  const location = useLocation();


 
  const showLayout = ![ '/Sale', '/home','/Item','/Expense','/Customers','/Employes',
    '/ResturentManagment','/:id/HomeTable','/AccountsSettings','/Inventromangment',"/devices",'/Kds'].includes(location.pathname);

  return (
    <div>
      {isLoggedIn ? (
        !['/bill'].includes(location.pathname) ? (
          showLayout ? (
            <Layout className="h-screen">
              <Drawer activeMenu={activeMenu} setActiveMenu={setActiveMenu} collapsed={collapsed} />
              <Layout className="site-layout">
                <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
                <Content style={{ minHeight: 280, height: "100%" }}>
                  <AuthRoutes />
                </Content>
              </Layout>
            </Layout>
          ) : (
            <Routes>
              <Route path="/Sale" element={<Odersale />} />
              <Route path="/Employes" element={<Employe/>} />
              <Route path="/home" element={<FullWrapp />} />
              <Route path="/Item" element={<Item />} />
              <Route path="/Expense" element={<ExpenseList/>}/>
              <Route path="/Customers" element={<Customer/>}/>
              <Route path="/ResturentManagment" element={<ResturentManagment/>}/>
              <Route path="/HomeTable/:id" element={<HomeTable />} />
              <Route path="/AccountsSettings" element={<AccountSettings/>}/>
              <Route path="/Inventromangment" element={<InventoryManagement/>}/>
              <Route path="/devices" element={<Devices/>}/>
              <Route path="/Kds" element={<DevicesList/>} />
            </Routes>
          )
        ) : (
          <Routes>
            <Route path="/bill" element={<Print />} />
          </Routes>
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
      <Route path={drawerMenuLabels.online.path} exact element={<HomeOrdersSection/>}/>
      <Route path={drawerMenuLabels.home.path} exact element={<Login />} />
    
      <Route path={drawerMenuLabels.home.path} exact element={<Home />} />
      
     
    </Routes>
  );
};

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path={drawerMenuLabels.online.path} exact element={<HomeOrdersSection/>}/>
      <Route path="/Home" element={<HomeItemsSection />} />
      <Route path="/sales" element={<Salessecstion />} /> 
      <Route path="/bill" exact element={<Print />} />
      <Route path="/scheduled-orders" element={<HomeOrdersSection />} />
      <Route path={drawerMenuLabels.home.path} exact element={<Home />} />

      <Route path={drawerMenuLabels.customers.path}exact
  element={<Customers isCart={false} />}
      />
       <Route path="/" element={<HomeTopBar/>}/>
       <Route path="/tables" element={<HomeTableSection/>}/>
      {/* <Route path={drawerMenuLabels.sales.path} exact element={<Sales />} /> */}
      <Route path={drawerMenuLabels.orders.path} exact element={<Orders />} />
      <Route path={drawerMenuLabels.reports.path} exact element={<Reports />} />
      <Route path={drawerMenuLabels.cash.path} exact element={<Cash />} />
      <Route
        path={drawerMenuLabels.settings.path}
        exact
        element={<Settings />}
      />
      <Route
        path={'on-hold'}
        exact
        element={<HoldOrder />}
      />
    </Routes>
  );
};

export default App;