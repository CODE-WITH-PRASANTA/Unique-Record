import React, { useState } from 'react';
import './ApproveUru.css';

const ApproveUru = () => {
  // Initial Mock Data based on the reference UI
  const [records, setRecords] = useState([
    {
      id: 1,
      serialNo: 1,
      appNumber: 'URU3778',
      date: '22 Sept 2026',
      name: 'Prasanta Kumar Khuntia',
      price: '0',
      transactionId: 'N/A',
      paymentStatus: 'Pending',
      approved: false,
    },
    {
      id: 2,
      serialNo: 2,
      appNumber: 'URU6310',
      date: '22 Sept 2026',
      name: 'Prasanta Kumar Khuntia',
      price: '0',
      transactionId: 'N/A',
      paymentStatus: 'Pending',
      approved: false,
    },
  ]);

  const [filterOption, setFilterOption] = useState('All');

  // Filter records based on dropdown selection
  const filteredRecords = records.filter((item) => {
    if (filterOption === 'All') return true;
    if (filterOption === 'Pending') return item.paymentStatus === 'Pending';
    if (filterOption === 'Paid') return item.paymentStatus === 'Paid';
    return true;
  });

  // Handle price input change for individual rows
  const handlePriceChange = (id, newPrice) => {
    setRecords(
      records.map((rec) => (rec.id === id ? { ...rec, price: newPrice } : rec))
    );
  };

  // Submit Price Action
  const handleSubmitPrice = (id) => {
    const item = records.find((rec) => rec.id === id);
    alert(`Updated price (${item.price}) successfully submitted for application ${item.appNumber}!`);
  };

  // Paid Approve Action
  const handlePaidApprove = (id) => {
    setRecords(
      records.map((rec) =>
        rec.id === id
          ? {
              ...rec,
              paymentStatus: rec.paymentStatus === 'Pending' ? 'Paid' : 'Pending',
              approved: !rec.approved,
            }
          : rec
      )
    );
  };

  // Download Excel Action
  const handleDownloadExcel = () => {
    if (records.length === 0) {
      alert('No data available to export.');
      return;
    }

    const headers = ['Serial No.', 'Application Number', 'Application Date', 'Name', 'Updated Price', 'Transaction ID', 'Payment Status'];
    const rows = filteredRecords.map((item, index) => [
      index + 1,
      item.appNumber,
      item.date,
      `"${item.name}"`,
      item.price,
      item.transactionId,
      item.paymentStatus,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Approve_URU_Report_${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Send Reminder Action
  const handleSendReminder = () => {
    alert('Payment and submission reminders sent successfully to pending applicants!');
  };

  return (
    <div className="app-uru-container">
      <div className="app-uru-wrapper">
        
        {/* Header Section */}
        <header className="app-uru-header-section">
          <h1 className="app-uru-title">Approve URU</h1>
          <div className="app-uru-header-actions">
            <button className="app-uru-btn-excel" onClick={handleDownloadExcel}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span>Download Excel</span>
            </button>
            <button className="app-uru-btn-reminder" onClick={handleSendReminder}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span>Send Reminder</span>
            </button>
          </div>
        </header>

        {/* Filter Toolbar */}
        <div className="app-uru-toolbar-section">
          <div className="app-uru-select-wrapper">
            <select
              className="app-uru-filter-select"
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        <section className="app-uru-table-section">
          <div className="app-uru-table-responsive">
            <table className="app-uru-data-table">
              <thead>
                <tr>
                  <th>Serial No.</th>
                  <th>Application Number</th>
                  <th>Application Date</th>
                  <th>Name</th>
                  <th>Updated Price</th>
                  <th>Transaction ID</th>
                  <th>Payment Status</th>
                  <th className="app-uru-text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="app-uru-empty-row">No records found.</td>
                  </tr>
                ) : (
                  filteredRecords.map((item, index) => (
                    <tr key={item.id} className="app-uru-table-row">
                      <td className="app-uru-col-sno">{index + 1}</td>
                      <td className="app-uru-col-appno"><strong>{item.appNumber}</strong></td>
                      <td>{item.date}</td>
                      <td className="app-uru-col-name">{item.name}</td>
                      <td>
                        <input
                          type="number"
                          className="app-uru-input-price"
                          value={item.price}
                          onChange={(e) => handlePriceChange(item.id, e.target.value)}
                        />
                      </td>
                      <td>{item.transactionId}</td>
                      <td>
                        <span className={`app-uru-status-badge ${item.paymentStatus.toLowerCase()}`}>
                          {item.paymentStatus}
                        </span>
                      </td>
                      <td className="app-uru-col-action">
                        <div className="app-uru-action-group">
                          <button
                            className="app-uru-btn-submit"
                            onClick={() => handleSubmitPrice(item.id)}
                          >
                            Submit
                          </button>
                          <button
                            className={`app-uru-btn-approve ${item.approved ? 'approved' : 'pending'}`}
                            onClick={() => handlePaidApprove(item.id)}
                          >
                            {item.approved ? 'Approved' : 'Paid Approve'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ApproveUru;