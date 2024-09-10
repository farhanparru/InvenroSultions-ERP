import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import axios from "axios";
import { getStoreUserData } from "../../../store/storeUser/storeUserSlice";

const ItemCard = React.memo(({ selectedCategory }) => {
  const dispatch = useDispatch();
  const store_user = useSelector(getStoreUserData);
  const [items, setItems] = useState({
    firstColumn: [],
    secondColumn: [],
    thirdColumn: [],
    fourthColumn: [],
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "https://tyem.invenro.site/api/user/ExcelItems"
        );
        const fetchedItems = response.data;

        // Filter items based on the selected category
        const filteredItems =
          selectedCategory === "All"
            ? fetchedItems
            : fetchedItems.filter((item) => item.category === selectedCategory);

        // Split items into four columns
        const totalItems = filteredItems.length;
        const itemsPerColumn = Math.ceil(totalItems / 4);

        setItems({
          firstColumn: filteredItems.slice(0, itemsPerColumn),
          secondColumn: filteredItems.slice(itemsPerColumn, 2 * itemsPerColumn),
          thirdColumn: filteredItems.slice(
            2 * itemsPerColumn,
            3 * itemsPerColumn
          ),
          fourthColumn: filteredItems.slice(3 * itemsPerColumn),
        });
      } catch (error) {
        console.error("There was an error fetching the items!", error);
      } finally {
      }
    };

    fetchItems();
  }, [selectedCategory]);

  const onItemClick = useCallback(
    (item) => {
      const cartItem = {
        id: item.Id, // Make sure the 'id' matches the one used in the reducer
        name: item.ItemName,
        price: item.Price,
        type: "increase",
      };
      console.log(cartItem, "cartItem");

      dispatch(addToCart(cartItem));
    },
    [dispatch]
  );

  // Memoize column data
  const firstColumnItems = useMemo(
    () => items.firstColumn,
    [items.firstColumn]
  );
  const secondColumnItems = useMemo(
    () => items.secondColumn,
    [items.secondColumn]
  );
  const thirdColumnItems = useMemo(
    () => items.thirdColumn,
    [items.thirdColumn]
  );
  const fourthColumnItems = useMemo(
    () => items.fourthColumn,
    [items.thirdColumn]
  );

  return (
    <div className="flex justify-between gap-x-8 p-6">
      <div className="flex flex-col space-y-6">
        {firstColumnItems?.map((item) => (
          <div
            key={item.Id}
            onClick={() => onItemClick(item)}
            className="bg-teal-600 text-white p-6 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
            style={{ width: "180px", height: "120px" }}
          >
            <h3 className="text-sm font-bold capitalize line-clamp-2">
              {item.ItemName}
            </h3>

            <h3 className="text-md font-medium mt-1">
              ₹{parseFloat(item.Price).toFixed(2)}
            </h3>
          </div>
        ))}
      </div>
      <div className="flex flex-col space-y-6">
        {secondColumnItems?.map((item) => (
          <div
            key={item.Id}
            onClick={() => onItemClick(item)}
            className="bg-teal-600 text-white p-6 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
            style={{ width: "180px", height: "120px" }}
          >
            <h3 className="text-sm font-bold capitalize line-clamp-2">
              {item.ItemName}
            </h3>

            <h3 className="text-md font-medium mt-1">
              ₹{parseFloat(item.Price).toFixed(2)}
            </h3>
          </div>
        ))}
      </div>
      <div className="flex flex-col space-y-6">
        {thirdColumnItems?.map((item) => (
          <div
            key={item.Id}
            onClick={() => onItemClick(item)}
            className="bg-teal-600 text-white p-6 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
            style={{ width: "180px", height: "120px" }}
          >
            <h3 className="text-sm font-bold capitalize line-clamp-2">
              {item.ItemName}
            </h3>

            <h3 className="text-md font-medium mt-1">
              ₹{parseFloat(item.Price).toFixed(2)}
            </h3>
          </div>
        ))}
      </div>
      <div className="flex flex-col space-y-6">
        {fourthColumnItems?.map((item) => (
          <div
            key={item.Id}
            onClick={() => onItemClick(item)}
            className="bg-teal-600 text-white p-6 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
            style={{ width: "180px", height: "120px" }}
          >
            <h3 className="text-sm font-bold capitalize line-clamp-2">
              {item.ItemName}
            </h3>

            <h3 className="text-md font-medium mt-1">
              ₹{parseFloat(item.Price).toFixed(2)}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
});

export default ItemCard;
