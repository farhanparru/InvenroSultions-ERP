import React, { useEffect, useState } from "react";
import ExcelImportModal from "./ExcelModel";
import Header from "./Headr"; // Import your Header component
import Sidebar from "./Sidebar"; // Import your Sidebar component
import Modal from "react-modal";
import AddCategory from "./AddCategory"; // Import the AddCategory component
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { AiFillFileExcel } from "react-icons/ai";

Modal.setAppElement("#root");

const Item = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [itemModalIsOpen, setItemModalIsOpen] = useState(false);
  const [categoryModalIsOpen, setCategoryModalIsOpen] = useState(false);
  const [excelModalIsOpen, setExcelModalIsOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState(0);
  const [link, setLink] = useState("");
  const [brand, setBrand] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [id, setId] = useState(""); // Add a new state for the id

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const openItemModal = () => {
    setItemModalIsOpen(true);
  };

  const closeItemModal = () => {
    setItemModalIsOpen(false);
  };

  const openCategoryModal = () => {
    setCategoryModalIsOpen(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalIsOpen(false);
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "40%", // Adjust the width as needed
      height: "60%",
    },
  };

  const openExcelModal = () => setExcelModalIsOpen(true);
  const closeExcelModal = () => setExcelModalIsOpen(false);

  const handleExcelUpload = (data) => {
    console.log("Uploaded Excel Data:", data);
    // Process the data as needed, for example:
  };

  useEffect(() => {
    axios
      .get("https://tyem.invenro.site/api/user/ExcelItems") // Adjust your API endpoint
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the items!", error);
      });
  }, []);

  useEffect(() => {
    if (itemModalIsOpen) {
      axios
        .get("https://tyem.invenro.site/api/user/getCategory")
        .then((response) => {
          setCategories(response.data.categories);
        })
        .catch((error) => {
          console.error("There was an error fetching the categories!", error);
        });
    }
  }, [itemModalIsOpen]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("availability", availability);
    formData.append("condition", condition);
    formData.append("price", price);
    formData.append("link", link);
    formData.append("brand", brand);
    formData.append("imageFile", imageFile);

    if (!imageFile) {
      alert("Please upload an image.");
      return;
    }

    axios
      .post("https://tyem.invenro.site/api/user/addItem", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Item added successfully:", response.data);
        setItems([...items, response.data]); // Update items
        closeItemModal(); // Close modal

        // Clear form fields
        setId("");
        setTitle("");
        setDescription("");
        setAvailability("");
        setCondition("");
        setPrice("");
        setLink("");
        setBrand("");
        setImageFile(null);

        // Show success toast
        toast.success("Item added successfully!");
      })
      .catch((error) => {
        console.error("There was an error adding the item!", error);
        toast.error("Error adding item!");
      });
  };

  // File input change handler
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // Store the selected file
  };

  return (
    <div className="p-4 flex flex-col h-screen">
      <Header OpenSidebar={OpenSidebar} />
      <div className="flex flex-grow">
        <Sidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />
        <div className="flex flex-col flex-grow p-4">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Filter by Item Name"
              className="p-2 border rounded"
            />
            <select className="p-2 border rounded">
              <option>Select Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            <select className="p-2 border rounded">
              <option>Select Brand</option>
            </select>
            <select className="p-2 border rounded">
              <option>Select Price Categories</option>
            </select>
            <button className="p-2 bg-purple-500 text-white rounded">
              More Filters
            </button>
            <button
              className="p-2 bg-purple-500 text-white rounded"
              onClick={openItemModal}
            >
              Create Item
            </button>
            <button
              className="p-2 bg-purple-500 text-white rounded"
              onClick={openCategoryModal}
            >
              Add Category
            </button>
            <button
              className="p-2 bg-gray-500 text-white rounded flex items-center"
              onClick={openExcelModal}
            >
              <AiFillFileExcel
                className="mr-2"
                size={20}
                style={{ color: "gray" }}
              />
              Import Excel
            </button>
          </div>

          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ItemId</th>
                <th className="py-2 px-4 border-b">ItemName</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{item.Id}</td>
                  <td className="py-2 px-4 border-b">{item.ItemName}</td>
                  <td className="py-2 px-4 border-b">{item.category}</td>
                  <td className="py-2 px-4 border-b">{item.Price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={itemModalIsOpen}
        onRequestClose={closeItemModal}
        contentLabel="Create Item Modal"
        style={customStyles}
      >
        <h2 className="text-2xl mb-4">Create Item</h2>

        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* ID Field */}
            <div className="mb-4">
              <label className="block text-gray-700">ID *</label>
              <input
                type="text"
                name="id"
                className="p-2 border rounded w-full"
                placeholder="Enter Item ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>

            {/* Title Field */}
            <div className="mb-4">
              <label className="block text-gray-700">Title *</label>
              <input
                type="text"
                name="title"
                className="p-2 border rounded w-full"
                placeholder="Item Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description Field */}
            <div className="mb-4">
              <label className="block text-gray-700">Description *</label>
              <textarea
                name="description"
                className="p-2 border rounded w-full"
                placeholder="Enter a detailed description of the item."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Availability Field */}
            <div className="mb-4">
              <label className="block text-gray-700">Availability *</label>
              <select
                name="availability"
                className="p-2 border rounded w-full"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="">Select Availability</option>
                <option value="in_stock">in_stock</option>
                <option value="outofstock">Out of Stock</option>
                <option value="preorder">Pre-order</option>
              </select>
            </div>

            {/* Condition Field */}
            <div className="mb-4">
              <label className="block text-gray-700">Condition *</label>
              <select
                name="condition"
                className="p-2 border rounded w-full"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="">Select Condition</option>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="refurbished">Refurbished</option>
              </select>
            </div>

            {/* Price Field */}
            <div className="mb-4">
              <label className="block text-gray-700">Price *</label>
              <input
                type="number"
                name="price"
                className="p-2 border rounded w-full"
                placeholder="Enter Price"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            {/* Link Field */}
            <div className="mb-4">
              <label className="block text-gray-700">Link</label>
              <input
                type="url"
                name="link"
                className="p-2 border rounded w-full"
                placeholder="Enter Item Link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                pattern="https://.*" // Optional pattern to ensure HTTPS links
                title="Please enter a valid URL"
              />
            </div>

            {/* Brand Field */}
            <div className="mb-4">
              <label className="block text-gray-700">Brand</label>
              <input
                type="text"
                name="brand"
                className="p-2 border rounded w-full"
                placeholder="Enter Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            {/* Image Field */}
            <div className="mb-4">
              <label className="block text-gray-700">Image *</label>
              <input
                type="file"
                name="imageFile"
                className="p-2 border rounded w-full"
                onChange={handleFileChange}
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={closeItemModal}
              className="p-2 bg-purple-500 text-white rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 bg-purple-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      <ToastContainer />
      <AddCategory
        modalIsOpen={categoryModalIsOpen}
        closeModal={closeCategoryModal}
      />
      <ExcelImportModal
        modalIsOpen={excelModalIsOpen}
        closeModal={closeExcelModal}
        onUpload={handleExcelUpload}
      />
    </div>
  );
};

export default Item;
