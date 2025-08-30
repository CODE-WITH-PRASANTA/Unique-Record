import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FinalURU.css';
import { API_URL } from '../../Api';
import Swal from 'sweetalert2';

const FinalURU = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFile, setSelectedFile] = useState({});

  useEffect(() => {
    fetchPaidUru();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) => {
      return (
        item.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.applicantName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const fetchPaidUru = async () => {
    try {
      const response = await axios.get(`${API_URL}/uru/fetch-paid-uru`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCertificateUpload = (applicationNumber, file) => {
    setSelectedFile((prevState) => ({ ...prevState, [applicationNumber]: file }));
  };

  const handleCertificateSubmit = async (applicationNumber) => {
    try {
      const file = selectedFile[applicationNumber];
      if (!file) {
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: 'Please select a file to upload.',
          confirmButtonText: 'OK',
        });
        return;
      }
      const formData = new FormData();
      formData.append('certificate', file);
      const response = await axios.post(`${API_URL}/uru/upload-certificate/${applicationNumber}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      Swal.fire({
        title: 'Certificate Uploaded Successfully!',
        icon: 'success',
        text: 'The certificate has been uploaded successfully.',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error!',
        icon: 'error',
        text: 'Failed to upload the certificate.',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleDelete = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/uru/delete-uru/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });

        fetchPaidUru(); // refresh list after deletion
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


  const handleReupload = (id) => {
    // Handle reupload logic here
    console.log(`Reuploaded for ${id}`);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDownloadExcel = () => {
    const csvData = [
      ['Sl No.', 'Application No.', 'Applicant Name', 'Payment Status'],
      ...filteredData.map((data, index) => [
        index + 1,
        data.applicationNumber,
        data.applicantName,
        data.paymentStatus,
      ]),
    ];
    const csvString = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'final-uru-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePublish = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/uru/publish-uru/${id}`, 
        { isPublished: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchPaidUru();
      Swal.fire({
        title: 'Published Successfully!',
        icon: 'success',
        text: 'The URU application has been published successfully.',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error!',
        icon: 'error',
        text: 'Failed to publish the URU application.',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleUnpublish = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/uru/publish-uru/${id}`, 
        { isPublished: false },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchPaidUru();
      Swal.fire({
        title: 'Unpublished Successfully!',
        icon: 'success',
        text: 'The URU application has been unpublished successfully.',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error!',
        icon: 'error',
        text: 'Failed to unpublish the URU application.',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="Final-Uru-Container">
      <h1 className="Final-Uru-Heading">Final URU</h1>
      <div className="Final-Uru-Search-Bar-Container">
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by application number or name"
          className="Final-Uru-Search-Bar"
        />
        <button
          onClick={handleDownloadExcel}
          className="Final-Uru-Download-Excel-Button"
        >
          Download Excel Sheet
        </button>
      </div>
      <table className="Final-Uru-Table table-responsive">
        <thead>
            <tr>
              <th className="Final-Uru-Table-Header">Sl No.</th>
              <th className="Final-Uru-Table-Header">Application No.</th>
              <th className="Final-Uru-Table-Header">Application Date</th> {/* ✅ New */}
              <th className="Final-Uru-Table-Header">Applicant Name</th>
              <th className="Final-Uru-Table-Header">Payment Status</th>
              <th className="Final-Uru-Table-Header">Upload Certificate</th>
              <th className="Final-Uru-Table-Header">Action</th>
            </tr>
          </thead>

    <tbody>
  {filteredData && filteredData.length > 0 ? (
    filteredData
      .slice() // create a shallow copy to avoid mutating state
      .reverse() // show latest entries on top
      .map((item) => (
        <tr key={item._id}>
          {/* Original serial number from the original data array */}
          <td className="Final-Uru-Table-Data">
            {data.findIndex((d) => d._id === item._id) + 1}
          </td>
          <td className="Final-Uru-Table-Data">{item.applicationNumber}</td>
          <td className="Final-Uru-Table-Data">
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A"}
          </td>
          <td className="Final-Uru-Table-Data">{item.applicantName}</td>
          <td className="Final-Uru-Table-Data">{item.paymentStatus}</td>
          <td className="Final-Uru-Table-Data">
            <input
              type="file"
              onChange={(event) =>
                handleCertificateUpload(item.applicationNumber, event.target.files[0])
              }
              className="Final-Uru-File-Input"
            />
          </td>
          <td className="Final-Uru-Table-Data">
            <button
              onClick={() => handleCertificateSubmit(item.applicationNumber)}
              className="Final-Uru-Submit-Button"
            >
              Submit
            </button>
            <button
              onClick={() => handleDelete(item._id)}
              className="Final-Uru-Delete-Button"
            >
              Delete
            </button>
            {item.isPublished ? (
              <button
                onClick={() => handleUnpublish(item._id)}
                className="Final-Uru-Unpublish-Button"
              >
                Unpublish
              </button>
            ) : (
              <button
                onClick={() => handlePublish(item._id)}
                className="Final-Uru-Publish-Button"
              >
                Publish
              </button>
            )}
          </td>
        </tr>
      ))
  ) : (
    <tr>
      <td colSpan={7} className="Final-Uru-No-Data-Found">
        No data found
      </td>
    </tr>
  )}
</tbody>


      </table>
    </div>
  );
};

export default FinalURU;