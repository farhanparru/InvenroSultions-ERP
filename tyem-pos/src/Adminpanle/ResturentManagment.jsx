import React, { useState, useEffect,useParams } from "react";
import { Button, Table, Modal, Input, Select, Checkbox } from "antd";
import axios from "axios"; // Import Axios
import Headr from "./Headr";
import Sidebar from "./Sidebar";
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom"; // Import the hook

const { Option } = Select;

const ResturentManagment = () => {
 
  const navigate = useNavigate();
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [autoApplyGratuity, setAutoApplyGratuity] = useState(false);
  const [floors, setFloors] = useState([]); // State to hold floors data
  const [floorForm, setFloorForm] = useState({
    name: "",
    location: "",
    gratuity: "",
    minimumPartySize: "",
  });

  // Fetch Floors from API on component mount
  useEffect(() => {
    fetchFloors();
  }, []);

  const fetchFloors = async () => {
    try {
      const response = await axios.get(
        "https://tyem.invenro.com/api/user/getFloor"
      );
      setFloors(response.data); // Set the fetched floors data
    } catch (error) {
      console.error("Error fetching floors:", error);
    }
  };

  // Function to handle sidebar toggle
  const handleSidebarToggle = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  // Function to handle create modal visibility
  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
  };

  const handleCreateSave = async () => {
    try {
      await axios.post("https://tyem.invenro.com/api/user/createFloor", floorForm);
      setIsCreateModalVisible(false);
      fetchFloors(); // Refresh the list after saving
      setFloorForm({
        // Reset the form fields
        name: "",
        location: "",
        gratuity: "",
        minimumPartySize: "",
      });
      setAutoApplyGratuity(false); // Reset auto apply gratuity checkbox
    } catch (error) {
      console.error("Error creating floor:", error);
    }
  };

  // Function to handle edit modal visibility
  const showEditModal = (floor) => {
    setSelectedFloor(floor);
    setFloorForm({
      name: floor.name,
      location: floor.location,
      gratuity: floor.gratuity,
      minimumPartySize: floor.minimumPartySize,
    });
    setAutoApplyGratuity(floor.autoApplyGratuity);
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `https://tyem.invenro.com/api/user/updateFloor/${selectedFloor.id}`,
        floorForm
      );
      setIsEditModalVisible(false);
      fetchFloors(); // Refresh the list after saving
      setFloorForm({
        // Reset the form fields
        name: "",
        location: "",
        gratuity: "",
        minimumPartySize: "",
      });
      setAutoApplyGratuity(false); // Reset auto apply gratuity checkbox
      setSelectedFloor(null);
    } catch (error) {
      console.error("Error updating floor:", error);
    }
  };

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFloorForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (value, field) => {
    setFloorForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };


  
  const handleTableClick = (id) => {
    navigate(`/HomeTable/${id}`);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Created Date",
      dataIndex: "createFloorDate",
      key: "createdDate",
      render: (text, record) => {
        const utcDate = DateTime.fromISO(record.createFloorDate, {
          zone: "utc",
        });
        const zonedDate = utcDate.setZone("Asia/Kolkata");
        const formattedDate = zonedDate.toFormat("MMM dd, yyyy");
        const formattedTime = zonedDate.toFormat("hh:mm:ss a");
        return `${formattedDate} at ${formattedTime}`;
      },
    },

    

    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            className="bg-teal-500 border-teal-500"
            onClick={() => handleTableClick(record._id)}
          >
            Tables
          </Button>
          <Button
            type="primary"
            className="bg-purple-500 border-purple-500"
            onClick={() => showEditModal(record)} // Open edit modal with selected floor data
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Headr className="header" OpenSidebar={handleSidebarToggle} />
      <div className="flex flex-grow">
        <Sidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={handleSidebarToggle}
        />
        <div className="flex-grow p-4">
          {/* Header for the Floors section */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Floors</h2>
            <Button
              type="primary"
              className="bg-purple-500 border-purple-500"
              onClick={showCreateModal}
            >
              + Create Floor
            </Button>
          </div>

          {/* Ant Design Table */}
          <Table dataSource={floors} columns={columns} pagination={false} />

          {/* Create Floor Modal */}
          <Modal
            title="Create Floor"
            visible={isCreateModalVisible}
            onCancel={handleCreateCancel}
            footer={[
              <Button
                key="cancel"
                onClick={handleCreateCancel}
                className="bg-gray-500 border-gray-500"
              >
                Close
              </Button>,
              <Button
                key="save"
                type="primary"
                onClick={handleCreateSave}
                className="bg-purple-500 border-purple-500"
              >
                Save
              </Button>,
            ]}
          >
            <form className="space-y-4">
              {/* Floor Name */}
              <div>
                <label className="block font-semibold mb-1">Name *</label>
                <Input
                  name="name"
                  value={floorForm.name}
                  onChange={handleInputChange}
                  placeholder="Floor Name"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block font-semibold mb-1">Location *</label>
                <Select
                  value={floorForm.location}
                  onChange={(value) => handleSelectChange(value, "location")}
                  placeholder="Select Location"
                  className="w-full"
                >
                  <Option value="location1">Location 1</Option>
                  <Option value="location2">Location 2</Option>
                </Select>
              </div>

              {/* Auto apply Gratuity */}
              <div className="flex items-center">
                <Checkbox
                  checked={autoApplyGratuity}
                  onChange={(e) => setAutoApplyGratuity(e.target.checked)}
                >
                  Auto apply Gratuity
                </Checkbox>
              </div>

              {/* Gratuity */}
              <div>
                <label className="block font-semibold mb-1">Gratuity *</label>
                <Select
                  value={floorForm.gratuity}
                  onChange={(value) => handleSelectChange(value, "gratuity")}
                  placeholder="Select Service Charge"
                  className="w-full"
                >
                  <Option value="10">10%</Option>
                  <Option value="15">15%</Option>
                </Select>
              </div>

              {/* Minimum Party Size */}
              <div>
                <label className="block font-semibold mb-1">
                  Minimum Party Size *
                </label>
                <Input
                  name="minimumPartySize"
                  value={floorForm.minimumPartySize}
                  onChange={handleInputChange}
                  placeholder="Minimum Party Size"
                  type="number"
                />
              </div>
            </form>
          </Modal>

          {/* Edit Floor Modal */}
          <Modal
            title="Edit Floor"
            visible={isEditModalVisible}
            onCancel={handleEditCancel}
            footer={[
              <Button
                key="cancel"
                onClick={handleEditCancel}
                className="bg-gray-500 border-gray-500"
              >
                Close
              </Button>,
              <Button
                key="save"
                type="primary"
                onClick={handleEditSave}
                className="bg-purple-500 border-purple-500"
              >
                Save
              </Button>,
            ]}
          >
            <form className="space-y-4">
              {/* Floor Name */}
              <div>
                <label className="block font-semibold mb-1">Name *</label>
                <Input
                  name="name"
                  value={floorForm.name}
                  onChange={handleInputChange}
                  placeholder="Floor Name"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block font-semibold mb-1">Location *</label>
                <Select
                  value={floorForm.location}
                  onChange={(value) => handleSelectChange(value, "location")}
                  placeholder="Select Location"
                  className="w-full"
                >
                  <Option value="location1">Location 1</Option>
                  <Option value="location2">Location 2</Option>
                </Select>
              </div>

              {/* Auto apply Gratuity */}
              <div className="flex items-center">
                <Checkbox
                  checked={autoApplyGratuity}
                  onChange={(e) => setAutoApplyGratuity(e.target.checked)}
                >
                  Auto apply Gratuity
                </Checkbox>
              </div>

              {/* Gratuity */}
              <div>
                <label className="block font-semibold mb-1">Gratuity *</label>
                <Select
                  value={floorForm.gratuity}
                  onChange={(value) => handleSelectChange(value, "gratuity")}
                  placeholder="Select Service Charge"
                  className="w-full"
                >
                  <Option value="10">10%</Option>
                  <Option value="15">15%</Option>
                </Select>
              </div>

              {/* Minimum Party Size */}
              <div>
                <label className="block font-semibold mb-1">
                  Minimum Party Size *
                </label>
                <Input
                  name="minimumPartySize"
                  value={floorForm.minimumPartySize}
                  onChange={handleInputChange}
                  placeholder="Minimum Party Size"
                  type="number"
                />
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ResturentManagment;
