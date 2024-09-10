import React, { useState } from 'react';
import Headr from '../Headr';
import Sidebar from '../Sidebar';
import DownloadLinks from './DownloadLinks';
import FunctionalitiesGrid from './FunctionalitiesGrid';
import Top from './Top'


const FullWrapp = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="flex flex-col h-screen">
      <Headr OpenSidebar={OpenSidebar} />
      <div className="flex flex-grow">
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        <main className="flex-grow p-4">
          <DownloadLinks />
          <Top/>
          <FunctionalitiesGrid />
        </main>
      </div>
    </div>
  );
};

export default FullWrapp;
