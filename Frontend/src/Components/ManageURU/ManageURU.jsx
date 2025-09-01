import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageURU.css';
import { API_URL } from '../../Api';
import Swal from "sweetalert2";
import EditURU from '../EditURU/EditURU';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';




const ManageURU = () => {
  const [uruData, setUruData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all'); // New state for filter status

  const token = localStorage.getItem('token');

  
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const sortedCategories = data.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(sortedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    getAllUru();
    fetchCategories();
  }, []);

  const getAllUru = async () => {
    try {
      const response = await axios.get(`${API_URL}/uru/get-all-uru`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const reversed = response.data.reverse();
      setUruData(reversed);
      setFilteredData(reversed);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (data) => {
  setEditingData({
    ...data,
    witness1: data.witness1 || {},
    witness2: data.witness2 || {},
    photos: data.photos || [],         // ✅ keep same key
    videos: data.videos || [],         // ✅ keep same key
    documents: data.documents || [],   // ✅ keep same key
    googleDriveLink: data.googleDriveLink || [],
    youtubeLink: data.youtubeLink || [],
    instagramLink: data.instagramLink || [],
    facebookLink: data.facebookLink || [],
    linkedInLink: data.linkedInLink || [],
    xLink: data.xLink || [],
    pinterestLink: data.pinterestLink || [],
    otherMediaLink: data.otherMediaLink || [],
  });
  setShowModal(true);
};

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/uru/delete-uru/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });

          getAllUru(); 
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: "Error!",
            text: "Something went wrong while deleting.",
            icon: "error",
          });
        }
      }
    });
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `${API_URL}/uru/approve-uru/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUruData((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, isApproved: true } : item
        )
      );

      setFilteredData((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, isApproved: true } : item
        )
      );
    } catch (error) {
      console.error(error.response?.data || error);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      filterData(uruData);
    } else {
      const term = searchTerm.toLowerCase();
      const results = uruData.filter(
        (item) =>
          item.applicantName?.toLowerCase().includes(term) ||
          item.applicationNumber?.toLowerCase().includes(term) ||
          item.emailId?.toLowerCase().includes(term) ||
          item.whatsappMobileNumber?.toLowerCase().includes(term)
      );
      filterData(results);
    }
  };

  const filterData = (data) => {
    if (filterStatus === 'all') {
      setFilteredData(data);
    } else if (filterStatus === 'approved') {
      setFilteredData(data.filter(item => item.isApproved));
    } else if (filterStatus === 'notApproved') {
      setFilteredData(data.filter(item => !item.isApproved));
    }
  };
  
  useEffect(() => {
    handleSearch();
  }, [filterStatus]);

  // Function to export filteredData to Excel
    const exportToExcel = () => {
      if (!filteredData.length) return;

      // Prepare data for Excel
      const dataForExcel = filteredData.map((item, index) => ({
        "S.No.": filteredData.length - index,
        "Application Number": item.applicationNumber,
        "Position": item.position,
        "Applicant Name": item.applicantName,
        "Sex": item.sex,
        "Whatsapp Mobile Number": item.whatsappMobileNumber,
        "Email Id": item.emailId,
        "Country": item.country,
        "State": item.state,
        "Status": item.status || (item.isApproved ? "Approved" : "Not Approved")
      }));

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "URU Data");

      // Generate Excel file and trigger download
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, "URU_Data.xlsx");
    };

  
  return (
    <div className="manage-uru-container">
      <h1 className="manage-uru-heading">Manage URU</h1>
<div className="manage-uru-actions-top">
  <button className="download-excel-btn" onClick={exportToExcel}>
    Download Excel
  </button>
</div>

      {/* Search Section */}
      <div className="manage-uru-search">
        <input
          type="text"
          placeholder="Search by Name, Application No, Email or Mobile..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="table-responsive">
        <table className="uru-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Application Number</th>
              <th>Position</th>
              <th>Applicant Name</th>
              <th>Sex</th>
              <th>Whatsapp Mobile Number</th>
              <th>Email Id</th>
              <th>Country</th>   
              <th>State</th>     
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((data, index) => (
              <tr key={data._id}>
                <td>{filteredData.length - index}</td>
                <td>{data.applicationNumber}</td>
                <td>{data.position}</td>
                <td>{data.applicantName}</td>
                <td>{data.sex}</td>
                <td>{data.whatsappMobileNumber}</td>
                <td>{data.emailId}</td>
                <td>{data.country}</td>  
                <td>{data.state}</td>    
                <td className="manage-uru-actions">
                  <button className="edit" onClick={() => handleEdit(data)}>
                    Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(data._id)}
                  >
                    Delete
                  </button>
                  {data.status === "Approved" ? (
                    <button className="approved" disabled>
                      Approved
                    </button>
                  ) : (
                    <button
                      className="approve"
                      onClick={() => handleApprove(data._id)}
                    >
                      Approve
                    </button>
                  )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    {showModal && (
      <EditURU
        editingData={editingData}
        setEditingData={setEditingData}
        setShowModal={setShowModal}
        categories={categories}
        refreshData={getAllUru} 
      />
    )}

    </div>
  );
};

export default ManageURU;