import React, { useState } from 'react';
import DevicesList from './DevicesList';
import KdsGrid from './KdsGrid';

const KitchenDisplaySystem = () => {
    const [selectedDivision, setSelectedDivision] = useState('');

    const handleDivisionSelect = (division) => {
      setSelectedDivision(division);
    };
  
    return (
      <div className="flex">
        <div className="w-1/3">
        <DevicesList onDivisionSelect={handleDivisionSelect} /> {/* Pass the function here */}
        </div>
        <div className="w-2/3">
          <KdsGrid selectedDivision={selectedDivision} />
        </div>
      </div>
    );
  };

export default KitchenDisplaySystem;
