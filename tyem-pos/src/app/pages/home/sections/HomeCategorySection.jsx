import React, { useEffect, useState } from 'react';



export const userContext = React.createContext()






const HomeCategorySection = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [totalItems, setTotalItems] = useState(0); // Added state for total items
  const [selectedCategory, setSelectedCategory] = useState('All');




  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user/ExcelItems');
        const data = await response.json();

        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategorySelect(category);
  };

  return (
    <div className="w-64 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      {/* Total Items */}
      <div className="text-right p-2 text-sm text-gray-600 border-b border-gray-200">
        Showing <span className="font-bold text-black">{categories.length}</span> / <span className="font-bold text-black">{totalItems}</span> items
      </div>
      
      {/* All Category */}
      <div
        className={`text-center py-3 font-semibold text-lg cursor-pointer 
          ${selectedCategory === 'All' ? 'bg-teal-600 text-white' : 'bg-teal-500 text-white hover:bg-teal-600'}`}
        onClick={() => handleCategoryClick('All')}
      >
        All
      </div>
      
      {/* Other Categories */}
      <div className="flex flex-col max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`text-center py-3 cursor-pointer 
              ${selectedCategory === category ? 'bg-teal-600 text-white hover:bg-teal-700' : 'text-teal-600 border-b border-gray-200 hover:bg-teal-100'}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCategorySection;
