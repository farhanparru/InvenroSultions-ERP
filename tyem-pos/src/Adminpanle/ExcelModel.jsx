import React, { useState } from 'react';
import Modal from 'react-modal';
import { AiFillFileExcel } from 'react-icons/ai';
import axios from 'axios';


const ExcelModel = ({ modalIsOpen, closeModal, onUpload }) => {


    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
    };
  
    const handleUpload = async() => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
      
            try {
              const response = await axios.post('https://tyem.invenro.com/api/user/importexcel', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
              });
              console.log(response,"hai");
              
              onUpload(); // Call the parent component's callback if needed
              closeModal(); // Close the modal after uploading
            } catch (error) {
              console.error('Error uploading file:', error);
            }
          }
    };
  
    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
      },
    };
  





    return (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Import Excel Modal"
          style={customStyles}
        >
          <h2 className="text-center mb-4">Import Excel File</h2>
          <div className="mb-4">
            <label className="block text-gray-700">
              Select Excel File <AiFillFileExcel className="inline-block text-green-500" />
            </label>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="p-2 border rounded w-full" />
          </div>
          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="p-2 bg-gray-500 text-white rounded mr-2"
            >
              Close
            </button>
            <button
              onClick={handleUpload}
              className="p-2 bg-purple-500 text-white rounded"
            >
              Upload
            </button>
          </div>
        </Modal>
      );
    };
export default ExcelModel
