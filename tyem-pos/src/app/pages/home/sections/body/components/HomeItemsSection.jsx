import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterItems, getItemCategories, getSelectedBodySection, getSelectedTab } from "../../../store/homeSlice";
import ItemCard from "../../../components/ItemCard";
import SearchInput from "../../../../../components/SearchInput";
import AddItemModal from "./addItem/AddItemModal";
import { getStoreUserData } from "../../../../../store/storeUser/storeUserSlice";
import HomeCategorySection from "../../HomeCategorySection";
import HomeTopBar from "../../HomeTopBar";
import AddCategoryModal from "./addcategory/AddCategoryModal";
import { FaHashtag } from "react-icons/fa"; // Importing an icon from react-icons

const HomeItemsSection = (props) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [shortcode, setShortcode] = useState("");

  const items = useSelector((state) => state.home.filteredItems);
  const selectedBodySection = useSelector(getSelectedBodySection);
  const selectedTab = useSelector(getSelectedTab);

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const store_user = useSelector(getStoreUserData);
  const [openCat, setOpenCat] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const onSearch = (value) => {
    setSearchValue(value);
    dispatch(filterItems(value));
  };

  const handleShortcodeChange = (e) => {
    setShortcode(e.target.value);
  };

  useEffect(() => {
    dispatch(filterItems(searchValue));
  }, [selectedCategory]);

  useEffect(() => {
    if (open === false) {
      dispatch(getItemCategories(store_user?.accessToken));
    }
  }, [open]);

  const showModal = () => {
    setOpen(true);
  };

  const showCatModal = () => {
    setOpenCat(true);
  };

  return (
    <>
      {!props.items_only && <HomeTopBar selectedTab={selectedTab} />}

      <div className="search__section w-full flex gap-4 items-center mb-2 p-3">
        <SearchInput onInputChange={(e) => onSearch(e.target.value)} />

        <div className="flex items-center justify-end mr-[25px] text-blue-500 w-[40%] font-semibold">
          {/* Shortcode Input Box with Icon */}
          <div className="flex items-center border p-2 rounded-md">
            <FaHashtag className="mr-2 text-gray-500" /> {/* Icon */}
            <input
              type="text"
              value={shortcode}
              onChange={handleShortcodeChange}
              placeholder="Enter shortcode"
              className="outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex p-2 w-full h-full overflow-auto flex-row ">
        {selectedBodySection === "home" && (
          <HomeCategorySection onCategorySelect={setSelectedCategory} />
        )}

        <AddItemModal isOpen={open} setOpen={setOpen} />
        <AddCategoryModal isOpen={openCat} setOpen={setOpenCat} />
        <div
  className={`
    w-full items__section overflow-y-scroll 
    grid grid-cols-4 gap-5
    p-3
  `}
  style={{ alignContent: "start" }}
>
  <ItemCard selectedCategory={selectedCategory} />
</div>

      </div>
    </>
  );
};

export default HomeItemsSection;
