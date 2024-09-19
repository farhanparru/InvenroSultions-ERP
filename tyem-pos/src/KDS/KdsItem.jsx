import React, { useState, useEffect } from 'react';

const KdsItem = ({ order }) => {
  const { time, table, customer, items, statusColor } = order;
  const [isCooking, setIsCooking] = useState(false);
  const [cookingTime, setCookingTime] = useState(0);
  const [timer, setTimer] = useState(null);

  // Function to handle Start Cooking button click
  const handleStartCooking = () => {
    setIsCooking(true);
    setCookingTime(0); // reset time
    setTimer(setInterval(() => {
      setCookingTime(prevTime => prevTime + 1); // increment time by 1 every second
    }, 1000));
  };

  // Function to handle Finish Cooking button click
  const handleFinishCooking = () => {
    clearInterval(timer);
    setTimer(null);
    setIsCooking(false);
  };

  // Cleanup timer when the component is unmounted
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`border rounded-lg shadow-md p-4 mb-4 bg-white`}>
      {/* Header with Time, Table, and Customer Info */}
      <div className={`p-2 text-white font-bold ${statusColor} rounded-t-lg`}>
        <div className="flex justify-between">
          <span>{time}</span>
          <span>{customer}</span>
        </div>
        <span>Table: {table}</span>
      </div>

      {/* Order Items */}
      <div className="p-2">
        {items.map((item, index) => (
          <div key={index} className="py-2 border-b last:border-b-0">
            <div className="font-semibold">
              {item.qty}x {item.name}
            </div>
            <div className="text-gray-600 text-sm">
              {item.notes ? item.notes : ''}
              {item.cancelled ? (
                <span className="text-red-600 font-bold ml-2">
                  CANCELLED
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* Cooking Controls */}
      <div className="flex justify-between items-center mt-4">
        {!isCooking ? (
          <button 
            onClick={handleStartCooking}
            className="bg-green-500 text-white px-4 py-2 rounded-lg">
            Start Cooking
          </button>
        ) : (
          <button 
            onClick={handleFinishCooking}
            className="bg-red-500 text-white px-4 py-2 rounded-lg">
            Finish Cooking
          </button>
        )}
        {isCooking && (
          <div className="text-gray-700">
            Time: {formatTime(cookingTime)}
          </div>
        )}
      </div>
    </div>
  );
};

export default KdsItem;
