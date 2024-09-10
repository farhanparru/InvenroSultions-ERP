import React, { useState } from 'react';
import { AiFillSetting } from 'react-icons/ai'; // Importing the Settings icon

const PrinterSettings = () => {
  const [posPrinter, setPosPrinter] = useState('POS-80');
  const [cashDrawer, setCashDrawer] = useState(true);
  const [kotPrinter, setKotPrinter] = useState('OneNote For Windows 10');
  const [isLabelPrinter, setIsLabelPrinter] = useState(false);
  const [bufferSize, setBufferSize] = useState(800);
  const [scaleFactor, setScaleFactor] = useState(2);
  const [cutPaper, setCutPaper] = useState(true);
  const [feedLength, setFeedLength] = useState(1);
  const [paperSize, setPaperSize] = useState('3 inch');
  const [activeSidebarItem, setActiveSidebarItem] = useState('Printer');

  const sidebarItems = [
    'Application', 'Sync', 'Online Platform', 'Printer', 'Scanner',
    'Weighing Scale', 'Tidypay', 'Skyband', 'Pinelabs', 'Keyboard', 'System'
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4">
        <ul>
          {sidebarItems.map((item) => (
            <li
              key={item}
              className={`py-2 px-4 mb-2 cursor-pointer rounded-lg text-gray-800 
                ${activeSidebarItem === item ? 'bg-blue-500 text-white' : 'hover:bg-blue-500 hover:text-white'}`}
              onClick={() => setActiveSidebarItem(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Settings Content */}
      <div className="w-3/4 p-6 bg-white">
        <div className="flex items-center mb-4">
          <AiFillSetting className="text-4xl text-blue-500 mr-2" /> {/* Settings Icon */}
          <h1 className="text-3xl font-bold">Printer Settings</h1> {/* Increased font size */}
        </div>
        {/* POS Printer Section */}
        <div className="mb-4">
          <label className="block font-medium mb-2">POS Printer</label>
          <select 
            value={posPrinter} 
            onChange={(e) => setPosPrinter(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="POS-80">POS-80</option>
            <option value="POS-90">POS-90</option>
            <option value="Wondershare PDFelement">Wondershare PDFelement</option>
            <option value="Send To OneNote 16">Send To OneNote 16</option>
            <option value="OneNote For Windows 10">OneNote For Windows 10</option>
            <option value="Microsoft XPS Document Writer">Microsoft XPS Document Writer</option>
            <option value="Microsoft Print To PDF">Microsoft Print To PDF</option>
            <option value="Fax">Fax</option>
            <option value="Brother DCP-B7535DW Series">Brother DCP-B7535DW Series</option>
            <option value="AnyDesk Printer">AnyDesk Printer</option>
          </select>
        </div>

        <div className="flex items-center mb-4">
          <input 
            type="checkbox" 
            checked={cashDrawer} 
            onChange={() => setCashDrawer(!cashDrawer)} 
            className="mr-2"
          />
          <label className="font-medium">Cash Drawer</label>
        </div>

        {/* KOT Printer Section */}
        <div className="mb-4">
          <label className="block font-medium mb-2">KOT Printers</label>
          <select 
            value={kotPrinter} 
            onChange={(e) => setKotPrinter(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="POS-80">POS-80</option>
            <option value="POS-90">POS-90</option>
            <option value="Wondershare PDFelement">Wondershare PDFelement</option>
            <option value="Send To OneNote 16">Send To OneNote 16</option>
            <option value="OneNote For Windows 10">OneNote For Windows 10</option>
            <option value="Microsoft XPS Document Writer">Microsoft XPS Document Writer</option>
            <option value="Microsoft Print To PDF">Microsoft Print To PDF</option>
            <option value="Fax">Fax</option>
            <option value="Brother DCP-B7535DW Series">Brother DCP-B7535DW Series</option>
            <option value="AnyDesk Printer">AnyDesk Printer</option>
          </select>
        </div>

        <div className="flex items-center mb-4">
          <input 
            type="checkbox" 
            checked={isLabelPrinter} 
            onChange={() => setIsLabelPrinter(!isLabelPrinter)} 
            className="mr-2"
          />
          <label className="font-medium">Is Label Printer?</label>
        </div>

        {/* Paper Size Section */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Paper Size</label>
          <select 
            value={paperSize} 
            onChange={(e) => setPaperSize(e.target.value)} 
            className="w-full p-2 border rounded"
          >
            <option value="3 inch">3 inch</option>
            <option value="4 inch">4 inch</option>
          </select>
        </div>

        {/* Buffer Size Slider */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Buffer Size: {bufferSize}</label>
          <input 
            type="range" 
            min="0" 
            max="1000" 
            value={bufferSize} 
            onChange={(e) => setBufferSize(e.target.value)} 
            className="w-full"
          />
        </div>

        {/* Scale Factor Slider */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Scale Factor: {scaleFactor}</label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={scaleFactor} 
            onChange={(e) => setScaleFactor(e.target.value)} 
            className="w-full"
          />
        </div>

        {/* Cut Paper After Print */}
        <div className="flex items-center mb-4">
          <input 
            type="checkbox" 
            checked={cutPaper} 
            onChange={() => setCutPaper(!cutPaper)} 
            className="mr-2"
          />
          <label className="font-medium">Cut Paper After Print</label>
        </div>

        {/* Paper Feed Length Slider */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Paper Feed Length: {feedLength}</label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={feedLength} 
            onChange={(e) => setFeedLength(e.target.value)} 
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded">Test Printer</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded">Clear Queue</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Open Cash Drawer</button>
        </div>
      </div>
    </div>
  );
};

export default PrinterSettings;
