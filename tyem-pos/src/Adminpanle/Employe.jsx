import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar"; // Adjust the path as necessary
import Headr from "./Headr"; // Adjust the path as necessary
import CreateEmployeeModal from "../Adminpanle/CreateEmployeeModal";
import { DateTime } from "luxon";

const ConfirmDeactivateModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="text-center">
          <div className="text-orange-500 text-4xl mb-4">!</div>
          <h2 className="text-lg font-semibold">Are you sure?</h2>
          <p className="text-gray-600">Your Employee will be deactivated</p>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="bg-gray-200 text-gray-600 py-2 px-4 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded"
            onClick={onConfirm}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

const EmployeSection = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]); // State to hold employee data
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "https://tyem.invenro.com/api/user/getEmploye"
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Deactivate employee function
  const deactivateEmployee = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/user/deactivateEmploye/${selectedEmployee}`
      );
      setEmployees(employees.filter((emp) => emp._id !== selectedEmployee)); // Remove the deactivated employee from the list
      closeConfirmModal();
    } catch (error) {
      console.error("Error deactivating employee:", error);
    }
  };

  const openConfirmModal = (employeeId) => {
    setSelectedEmployee(employeeId);
    setConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalOpen(false);
    setSelectedEmployee(null);
  };

  const toggleActionMenu = (employeeId) => {
    setActionMenuOpen((prev) => (prev === employeeId ? null : employeeId));
  };

  return (
    <div className="flex min-h-screen">
    
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />

     
      <div className="flex flex-col flex-grow">
       
        <Headr className="header" OpenSidebar={OpenSidebar} />

      
        <div className="p-6">
          {/* Top Navigation */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <button className="bg-purple-600 text-white py-2 px-4 rounded-lg">
                Employees
              </button>
              <button className="text-gray-600 py-2 px-4">Roles</button>
              <button className="text-gray-600 py-2 px-4">Activity</button>
            </div>
            <button
              onClick={toggleModal}
              className="bg-purple-100 text-purple-600 border-2 border-purple-600 py-2 px-4 rounded-lg"
            >
              Create Employee
            </button>
            <CreateEmployeeModal isOpen={isModalOpen} onClose={toggleModal} />
          </div>

          {/* Filters */}
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              className="border border-gray-300 rounded-md py-2 px-4 w-1/3"
              placeholder="Filter by Name, Email, Phone"
            />
            <select className="border border-gray-300 rounded-md py-2 px-4 w-1/3">
              <option>All Location</option>
              <option>Paicha</option>
            </select>
            <select className="border border-gray-300 rounded-md py-2 px-4 w-1/3">
              <option>Select Employee Status</option>
              <option>Admin</option>
              <option>Staff</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Location</th>
                  <th className="py-2 px-4 border-b">Roles</th>
                  <th className="py-2 px-4 border-b">Type</th>
                  <th className="py-2 px-4 border-b">Created Date</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees?.length > 0 ? (
                  employees.map((employee) => {
                    const utcDate = DateTime.fromISO(employee.createEmployeeDate, { zone: "utc" });
                    const zonedDate = utcDate.setZone("Asia/Kolkata");
                    const formattedDate = zonedDate.toFormat("MMM dd, yyyy");
                    const formattedTime = zonedDate.toFormat("hh:mm:ss a");

                    return (
                      <tr key={employee._id}>
                        <td className="py-2 px-4 border-b">{employee.name}</td>
                        <td className="py-2 px-4 border-b">{employee.email}</td>
                        <td className="py-2 px-4 border-b">{employee.location}</td>
                        <td className="py-2 px-4 border-b">{employee.roles}</td>
                        <td className="py-2 px-4 border-b">{employee.type}</td>
                        <td className="py-2 px-4 border-b">
                          {formattedDate} {formattedTime}
                        </td>
                        <td className="py-2 px-4 border-b">
                          <div className="flex items-center space-x-2">
                            {/* Deactivate Button */}
                            <button
                              className="bg-red-500 text-white py-1 px-3 rounded-lg"
                             
                            >
                              Deactivate
                            </button>

                           
                            <div className="relative">
                              <button
                                className="bg-gray-100 text-gray-600 py-1 px-3 rounded-lg"
                                onClick={() => toggleActionMenu(employee._id)}
                              >
                                ...
                              </button>
                              {actionMenuOpen === employee._id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                  <button className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100">
                                    View
                                  </button>
                                  <button className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100">
                                    Edit
                                  </button>
                                  <button className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100">
                                    Change Password
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      
        <ConfirmDeactivateModal
          isOpen={confirmModalOpen}
          onClose={closeConfirmModal}
          onConfirm={deactivateEmployee}
        />
      </div>
    </div>
  );
};

export default EmployeSection;