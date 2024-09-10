import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { getSelectedBodySection, getSelectedTab } from "../../store/homeSlice";
import { homeBodySection } from "../../constants";
import HomeTopBar from '../HomeTopBar';

const HomeBodySection = () => {
  const selectedBodySection = useSelector(getSelectedBodySection);
  const selectedTab = useSelector(getSelectedTab);

  return (
    <div className="w-[65%] flex flex-col">

      {homeBodySection.map((item, index) => {
        if (item.slug == selectedBodySection) {
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

export default HomeBodySection;
