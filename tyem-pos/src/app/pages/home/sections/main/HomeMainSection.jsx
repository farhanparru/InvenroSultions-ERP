import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { getSelectedBodySection, getSelectedTab } from "../../store/homeSlice";
import { homeBodySection, homeTopBarTabs } from "../../constants";
import HomeTopBar from "../HomeTopBar";

const HomeMainSection = () => {
  const selectedBodySection = useSelector(getSelectedBodySection);
  const selectedTab = useSelector(getSelectedTab);

  return (
    <div className="w-[65%] flex flex-col">
      <HomeTopBar selectedTab={selectedTab} />

      {homeTopBarTabs.map((item, index) => {
        if (item.slug === selectedBodySection) {
          return (
            <Suspense key={index} fallback={<div>loading</div>}>
              <item.section />
            </Suspense>
          );
        }
      })}
    </div>
  );
};

export default HomeMainSection;
