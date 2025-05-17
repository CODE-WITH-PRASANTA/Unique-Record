import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ApproveURU.css';
import { API_URL } from '../../Api'; // Import API_URL
import * as XLSX from 'xlsx';

const ApproveURU = () => {
  const [urus, setUrus] = useState([]);
  const [prices, setPrices] = useState({});
  const [priceUpdateDates, setPriceUpdateDates] = useState({});
  const [filterStatus, setFilterStatus] = useState('');
  const [filteredUrus, setFilteredUrus] = useState([]);

  useEffect(() => {
    const fetchApprovedUrus = async () => {
      try {
        const response = await axios.get(`${API_URL}/uru/get-all-approved-urus`);
        setUrus(response.data);
        setFilteredUrus(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchApprovedUrus();
  }, []);

  useEffect(() => {
    const filtered = urus.filter((uru) => {
      if (!filterStatus) return true;
      return uru.paymentStatus === filterStatus;
    });
    setFilteredUrus(filtered);
  }, [filterStatus, urus]);

  const handlePriceChange = (id, newPrice) => {
    setPrices((prevPrices) => ({ ...prevPrices, [id]: newPrice }));
  };

  const handleSubmit = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/uru/update-uru-price/${id}`, {
        price: prices[id],
      });
      setUrus((prevUrus) =>
        prevUrus.map((uru) =>
          uru._id === id ? { ...uru, priceUpdated: true } : uru
        )
      );
      setPriceUpdateDates((prevDates) => ({
        ...prevDates,
        [id]: new Date().toLocaleString(),
      }));
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUrus);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'URUs');
    XLSX.writeFile(workbook, `URUs_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <div className="Approve-URU-container">
      <h2 className="Approve-URU-title">Approve URU</h2>
      <div className="filter-container">
        <select
          value={filterStatus}
          onChange={handleFilterChange}
          className="filter-status-select"
        >
          <option value="">All</option>
          <option value="Success">Success</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
        <button className="download-excel-btn" onClick={handleDownloadExcel}>
          Download Excel
        </button>
      </div>
      <div className="Approve-URU-table-container">
        <table className="Approve-URU-table">
          <thead>
            <tr>
              <th className="Approve-URU-table-header">Serial No.</th>
              <th className="Approve-URU-table-header">Unique ID</th>
              <th className="Approve-URU-table-header">Name</th>
              <th className="Approve-URU-table-header">Price</th>
              <th className="Approve-URU-table-header">Payment Status</th>
              <th className="Approve-URU-table-header">Razorpay Order ID</th>
              <th className="Approve-URU-table-header">Razorpay Payment ID</th>
              <th className="Approve-URU-table-header">Razorpay Signature</th>
              <th className="Approve-URU-table-header">Price Updated Date</th>
              <th className="Approve-URU-table-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUrus.map((uru, index) => (
              <tr key={uru._id}>
                <td className="Approve-URU-table-data">{index + 1}</td>
                <td className="Approve-URU-table-data">{uru._id}</td>
                <td className="Approve-URU-table-data">{uru.applicantName}</td>
                <td className="Approve-URU-table-data">
                  {uru.priceUpdated ? (
                    <span>{uru.price}</span>
                  ) : (
                    <input
                      type="number"
                      value={prices[uru._id] || uru.price || ''}
                      onChange={(e) => handlePriceChange(uru._id, parseInt(e.target.value))}
                      className="Approve-URU-price-input"
                    />
                  )}
                </td>
                <td className="Approve-URU-table-data">{uru.paymentStatus || 'Pending'}</td>
                <td className="Approve-URU-table-data">{uru.razorpayOrderId || 'N/A'}</td>
                <td className="Approve-URU-table-data">{uru.razorpayPaymentId || 'N/A'}</td>
                <td className="Approve-URU-table-data">{uru.razorpaySignature || 'N/A'}</td>
                <td className="Approve-URU-table-data">
                  {uru.priceUpdatedDate || (uru.priceUpdated ? 'N/A' : '')}
                </td>
                <td className="Approve-URU-table-data">
                  {uru.priceUpdated ? (
                    <span>Price Updated</span>
                  ) : (
                    <button
                      className="Approve-URU-submit-btn"
                      onClick={() => handleSubmit(uru._id)}
                    >
                      Submit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApproveURU;