import React, { useState, useEffect } from 'react';
import API from '../../api/axiosInstance';
import './ApproveUru.css';

const ApproveUru = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOption, setFilterOption] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch approved records from backend (records marked as Approved or Paid)
  const fetchApprovedRecords = async () => {
    try {
      setLoading(true);
      const res = await API.get('/uru/approved');
      if (res.data && Array.isArray(res.data.data)) {
        setRecords(res.data.data);
      } else if (Array.isArray(res.data)) {
        setRecords(res.data);
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error('Error fetching approved URU records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedRecords();
  }, []);

  // Filter records based on dropdown selection & search query
  const filteredRecords = records.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (item.name || item.applicantName || '').toLowerCase().includes(term) ||
      (item.appNo || item.applicationNumber || '').toLowerCase().includes(term) ||
      (item.email || item.emailId || '').toLowerCase().includes(term) ||
      (item.mobile || item.whatsappMobileNumber || '').toString().includes(term);

    if (!matchesSearch) return false;

    if (filterOption === 'All') return true;
    if (filterOption === 'Pending') return (item.paymentStatus || 'Pending') === 'Pending';
    if (filterOption === 'Paid') return (item.paymentStatus || '') === 'Paid';
    return true;
  });

  // Handle price input change for individual rows
  const handlePriceChange = (id, newPrice) => {
    setRecords((prev) =>
      prev.map((rec) => ((rec.id || rec._id) === id ? { ...rec, price: newPrice } : rec))
    );
  };

  // Submit Price Action
  const handleSubmitPrice = async (id) => {
    const item = records.find((rec) => (rec.id || rec._id) === id);
    if (!item) return;

    try {
      await API.put('/uru/update-price', {
        id: item.id || item._id,
        applicationNumber: item.appNo || item.applicationNumber,
        price: item.price,
      });
      alert(`Updated price (₹${item.price}) successfully submitted for application ${item.appNo || item.applicationNumber}!`);
    } catch (err) {
      console.error('Error submitting price:', err);
      alert('Failed to submit price update.');
    }
  };

  // Paid Approve Action (Integrates manual or final payment approval)
  const handlePaidApprove = async (id) => {
    const item = records.find((rec) => (rec.id || rec._id) === id);
    if (!item) return;

    try {
      const res = await API.put(`/uru/give-paid-approve/${id}`);
      const updatedData = res.data?.data;
      const isNowPaid = updatedData?.paymentStatus === 'Paid';

      setRecords((prev) =>
        prev.map((rec) =>
          (rec.id || rec._id) === id
            ? {
                ...rec,
                paymentStatus: isNowPaid ? 'Paid' : 'Pending',
                status: isNowPaid ? 'Paid' : 'Approved',
                transactionId: isNowPaid
                  ? updatedData?.razorpayPaymentId || `TXN_ADMIN_${id.toString().slice(-6)}`
                  : 'N/A',
              }
            : rec
        )
      );

      alert(
        isNowPaid
          ? `Application ${item.appNo || item.applicationNumber} marked as Paid & Approved!`
          : `Application ${item.appNo || item.applicationNumber} marked as Pending Payment.`
      );
    } catch (err) {
      console.error('Error in Paid Approve:', err);
      alert('Failed to update payment approval.');
    }
  };

  // Download Excel Action
  const handleDownloadExcel = () => {
    if (records.length === 0) {
      alert('No data available to export.');
      return;
    }

    const headers = [
      'Serial No.',
      'Application Number',
      'Application Date',
      'Name',
      'Updated Price',
      'Transaction ID',
      'Payment Status',
    ];
    const rows = filteredRecords.map((item, index) => [
      index + 1,
      item.appNo || item.applicationNumber,
      item.date || 'N/A',
      `"${item.name || item.applicantName || ''}"`,
      item.price || 0,
      item.transactionId || 'N/A',
      item.paymentStatus || 'Pending',
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
  const handleSendReminder = async () => {
    try {
      const res = await API.post('/uru/send-reminders');
      alert(res.data?.message || 'Payment reminders sent successfully to pending applicants!');
    } catch (err) {
      console.error('Error sending reminder:', err);
      alert('Failed to send reminders.');
    }
  };

  return (
    <div className="app-uru-container">
      <div className="app-uru-wrapper">
        {/* Header Section */}
        <header className="app-uru-header-section">
          <div>
            <h1 className="app-uru-title">Approve URU Records &amp; Pricing</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
              Applications approved from Manage URU appear here for pricing setup and <strong>Paid Approval</strong>.
            </p>
          </div>
          <div className="app-uru-header-actions">
            <button className="app-uru-btn-excel" onClick={handleDownloadExcel}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download Excel</span>
            </button>
            <button className="app-uru-btn-reminder" onClick={handleSendReminder}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span>Send Reminder</span>
            </button>
          </div>
        </header>

        {/* Filter Toolbar */}
        <div className="app-uru-toolbar-section" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div className="app-uru-select-wrapper">
            <select
              className="app-uru-filter-select"
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
            >
              <option value="All">All Payment Statuses</option>
              <option value="Pending">Payment Pending</option>
              <option value="Paid">Payment Paid</option>
            </select>
          </div>
          <input
            type="text"
            className="app-uru-filter-select"
            style={{
              border: '2px solid #cbd5e1',
              borderRadius: '8px',
              padding: '8px 14px',
              minWidth: '260px',
              background: '#fff',
            }}
            placeholder="Search approved applicant or App No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                {loading ? (
                  <tr>
                    <td colSpan="8" className="app-uru-empty-row" style={{ padding: '30px', textAlign: 'center' }}>
                      Loading approved records...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="app-uru-empty-row">
                      No approved URU records found. Approve applications from &quot;Manage URU&quot; to see them here.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((item, index) => {
                    const recordId = item.id || item._id;
                    const isPaid = item.paymentStatus === 'Paid' || item.status === 'Paid';

                    return (
                      <tr key={recordId || index} className="app-uru-table-row">
                        <td className="app-uru-col-sno">{index + 1}</td>
                        <td className="app-uru-col-appno">
                          <strong>{item.appNo || item.applicationNumber}</strong>
                        </td>
                        <td>{item.date || 'N/A'}</td>
                        <td className="app-uru-col-name">{item.name || item.applicantName}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>₹</span>
                            <input
                              type="number"
                              className="app-uru-input-price"
                              value={item.price !== undefined ? item.price : ''}
                              onChange={(e) => handlePriceChange(recordId, e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        </td>
                        <td>
                          <code style={{ fontSize: '12px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                            {item.transactionId || (isPaid ? 'TXN_COMPLETED' : 'N/A')}
                          </code>
                        </td>
                        <td>
                          <span className={`app-uru-status-badge ${isPaid ? 'paid' : 'pending'}`}>
                            {isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="app-uru-col-action">
                          <div className="app-uru-action-group">
                            <button
                              className="app-uru-btn-submit"
                              onClick={() => handleSubmitPrice(recordId)}
                              title="Update price for this application"
                            >
                              Submit
                            </button>
                            <button
                              className={`app-uru-btn-approve ${isPaid ? 'approved' : 'pending'}`}
                              onClick={() => handlePaidApprove(recordId)}
                              title="Click to approve payment"
                            >
                              {isPaid ? 'Paid Approved' : 'Paid Approve'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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