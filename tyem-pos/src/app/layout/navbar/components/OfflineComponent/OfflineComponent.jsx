import React, { useState, useEffect } from "react";
import { WifiOutlined } from "@ant-design/icons";
import { RiWifiOffLine } from "react-icons/ri";

const OfflineComponent = ({network}) => {

  useEffect(() => {
    if (network == false) {
      const synced = localStorage.getItem("synced");
      if (synced) {
        localStorage.setItem("synced", false);
        console.log("Offline..");
      } else {
        localStorage.setItem("synced", false);

      }
    }
  }, [network]);
  return (
    <div>
      <div className="flex justify-between items-center m-3">
        {/* <p className="font-bold">You are offline</p> */}
        <RiWifiOffLine
          height="150"
          width="150"
          className="mx-4 text-xl text-red-500"
        />
      </div>
    </div>
  );
};

export default OfflineComponent;
