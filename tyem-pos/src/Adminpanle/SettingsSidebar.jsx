import React, { useState } from "react";

const SettingsSidebar = () => {
  const [activeSection, setActiveSection] = useState("Business Profile");

  const sections = [
    "Business Profile",
    "POS Settings",
    "Admin Settings",
    "Store Settings",
    "Catalog Settings",
    "Inventory Management Settings",
    "Change Password",
    "API Keys",
  ];

  return (
    <div className="w-64 bg-gray-50 h-screen p-4 shadow-md">
      <ul>
        {sections.map((section, index) => (
          <li
            key={index}
            onClick={() => setActiveSection(section)}
            className={`mb-4 px-4 py-2 cursor-pointer rounded-lg ${
              activeSection === section
                ? "bg-purple-700 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {section}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingsSidebar;
