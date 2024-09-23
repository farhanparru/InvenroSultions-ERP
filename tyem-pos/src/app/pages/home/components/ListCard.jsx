import React, { useState, useEffect } from "react";
import axios from "axios";
import ItemCard from '../../../pages/home/components/ItemCard'

const ListCard = () => {
  const [items, setItems] = useState([]);
  console.log(setItems,"items");
  
//   const [showToggle, setShowToggle] = useState(true); // Control whether to show the toggle switch

  useEffect(() => {
    axios.get('https://tyem.invenro.com/api/user/ExcelItems') // Adjust your API endpoint
      .then((response) => {
        console.log(response,"hai");
        setItems(response.data.items); // Adjust according to your API response
      })

      
      .catch((error) => {
        console.error('There was an error fetching the items!', error);
      });
  }, []);



  return (
    <div className="item-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ListCard;
