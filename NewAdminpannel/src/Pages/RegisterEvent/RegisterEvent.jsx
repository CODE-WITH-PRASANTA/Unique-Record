import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FaSearch,
  FaEye,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTimes,
  FaSyncAlt,
  FaCommentDots,
  FaSave,
  FaCreditCard,
  FaUndoAlt,
  FaShieldAlt
} from 'react-icons/fa';
import API from '../../api/axiosInstance';
import './RegisterEvent.css';

const RegisterEvent = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [eventFilter, setEventFilter] = useState('All');
  const [availableEvents, setAvailableEvents] = useState([]);

  const [selectedReg, setSelectedReg] = useState(null);
  const [modalRemark, setModalRemark] = useState('');
  const [modalStatus, setModalStatus] = useState('Pending');
  const [savingModal, setSavingModal] = useState(false);

  const [deleteModal, setDeleteModal] = useState(null);
  const [refundModal, setRefundModal] = useState(null);
  const [refundReason, setRefundReason] = useState('');
  const [processingRefund, setProcessingRefund] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    window.clearTimeout(window.__reToast);
    window.__reToast = window.setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  // Fetch all registrations
  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/event-registrations');
      const list = res.data?.registrations || res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setRegistrations(list);

      // Extract unique event names
      const events = Array.from(new Set(list.map((r) => r.eventName).filter(Boolean)));
      setAvailableEvents(events);
    } catch (err) {
      console.error('Error fetching event registrations:', err);
      showToast('Failed to load registered events.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Handle Quick Inline Status Update
  const handleStatusChange = async (item, newStatus) => {
    try {
      setUpdatingId(item._id);
      const res = await API.patch(`/event-registrations/${item._id}/status`, { status: newStatus });
      if (res.data?.success) {
        setRegistrations((prev) =>
          prev.map((r) => (r._id === item._id ? { ...r, status: newStatus } : r))
        );
        if (selectedReg && selectedReg._id === item._id) {
          setSelectedReg((prev) => ({ ...prev, status: newStatus }));
          setModalStatus(newStatus);
        }
        showToast(`Application status updated to "${newStatus}".`);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Failed to update status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Open Modal Details
  const handleOpenModal = (reg) => {
    setSelectedReg(reg);
    setModalRemark(reg.adminRemark || '');
    setModalStatus(reg.status || 'Pending');
  };

  // Save Modal Updates (Status + Remark)
  const handleSaveModal = async () => {
    if (!selectedReg) return;

    try {
      setSavingModal(true);
      const res = await API.patch(`/event-registrations/${selectedReg._id}/status`, {
        status: modalStatus,
        adminRemark: modalRemark,
      });

      if (res.data?.success) {
        setRegistrations((prev) =>
          prev.map((r) =>
            r._id === selectedReg._id
              ? { ...r, status: modalStatus, adminRemark: modalRemark }
              : r
          )
        );
        setSelectedReg((prev) => ({
          ...prev,
          status: modalStatus,
          adminRemark: modalRemark,
        }));
        showToast('Registration status and remarks updated successfully!');
      }
    } catch (err) {
      console.error('Error updating modal record:', err);
      showToast('Failed to update registration record.', 'error');
    } finally {
      setSavingModal(false);
    }
  };

  // Confirm Status: Refund
  const handleConfirmRefund = async () => {
    if (!refundModal) return;
    try {
      setProcessingRefund(true);
      const res = await API.patch(`/event-registrations/${refundModal._id}/status`, {
        status: 'Refund',
        adminRemark: refundReason || 'Status updated to Refund by admin',
      });

      if (res.data?.success) {
        const updated = res.data.data;
        setRegistrations((prev) =>
          prev.map((r) => (r._id === refundModal._id ? { ...r, ...updated, status: 'Refund' } : r))
        );
        if (selectedReg && selectedReg._id === refundModal._id) {
          setSelectedReg((prev) => ({ ...prev, ...updated, status: 'Refund' }));
        }
        showToast('Application status updated to "Refund" successfully!');
        setRefundModal(null);
      }
    } catch (err) {
      console.error('Error updating status to Refund:', err);
      showToast(err.response?.data?.message || 'Failed to update status.', 'error');
    } finally {
      setProcessingRefund(false);
    }
  };

  // Handle Delete
  const confirmDelete = async () => {
    if (!deleteModal) return;
    try {
      await API.delete(`/event-registrations/${deleteModal._id}`);
      setRegistrations((prev) => prev.filter((r) => r._id !== deleteModal._id));
      showToast('Registration record deleted successfully.');
      setDeleteModal(null);
    } catch (err) {
      console.error('Error deleting registration:', err);
      showToast('Failed to delete registration record.', 'error');
    }
  };

  // Filtering
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        item.applicationNumber?.toLowerCase().includes(search) ||
        item.applicantName?.toLowerCase().includes(search) ||
        item.eventName?.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.whatsappNumber?.includes(search) ||
        item.razorpayPaymentId?.toLowerCase().includes(search) ||
        item.refundId?.toLowerCase().includes(search) ||
        item.district?.toLowerCase().includes(search) ||
        item.state?.toLowerCase().includes(search);

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesEvent = eventFilter === 'All' || item.eventName === eventFilter;

      return matchesSearch && matchesStatus && matchesEvent;
    });
  }, [registrations, searchTerm, statusFilter, eventFilter]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="re-page">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`re-toast ${toast.type}`}>
          {toast.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="re-header">
        <div className="re-header-title">
          <h1>Registered Events Management</h1>
          <p>Review applicant registrations, verify submitted dossier documents, and manage Razorpay payments & refunds.</p>
        </div>
        <button type="button" className="re-refresh-btn" onClick={fetchRegistrations}>
          <FaSyncAlt /> Refresh Records
        </button>
      </div>

      {/* Card with Filters & Table */}
      <div className="re-card">
        <div className="re-filters-bar">
          <div className="re-search-input">
            <FaSearch />
            <input
              type="text"
              placeholder="Search Application ID, applicant, event, payment ID, refund ID, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="re-select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Process">Under Process</option>
            <option value="Approved">Approved</option>
            <option value="Refund">Refund</option>
          </select>

          <select
            className="re-select-filter"
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
          >
            <option value="All">All Events</option>
            {availableEvents.map((ev) => (
              <option key={ev} value={ev}>
                {ev}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="re-table-responsive">
          <table className="re-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Application ID</th>
                <th>Applicant</th>
                <th>Event Name</th>
                <th>Payment & Fee</th>
                <th>Registered Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                    Loading registered events...
                  </td>
                </tr>
              ) : filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((item, index) => {
                  const statusClass = (item.status || 'Pending').replace(/\s+/g, '-');
                  return (
                    <tr key={item._id || item.applicationNumber}>
                      <td>{index + 1}</td>
                      <td>
                        <span className="re-app-id">{item.applicationNumber}</span>
                      </td>
                      <td>
                        <strong style={{ color: '#0f172a', display: 'block' }}>{item.applicantName}</strong>
                        <small style={{ color: '#64748b' }}>
                          <FaPhoneAlt size={10} style={{ marginRight: '4px' }} />
                          {item.whatsappNumber}
                        </small>
                      </td>
                      <td>
                        <span style={{ fontWeight: '600' }}>{item.eventName}</span>
                        {item.district && (
                          <small style={{ display: 'block', color: '#64748b' }}>
                            <FaMapMarkerAlt size={10} style={{ marginRight: '4px' }} />
                            {item.district}, {item.state}
                          </small>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <strong style={{ color: '#059669', fontSize: '14px' }}>
                            {item.registrationFees || '₹0'}
                          </strong>
                          <span style={{ 
                            fontSize: '11px', 
                            fontWeight: '700',
                            color: item.paymentStatus === 'Refunded' ? '#ea580c' : (item.paymentStatus === 'Paid' ? '#16a34a' : '#d97706'),
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <FaCreditCard size={10} />
                            {item.paymentPlatform || 'Razorpay'}: {item.paymentStatus || (item.razorpayPaymentId ? 'Paid' : 'Pending')}
                          </span>
                          {item.razorpayPaymentId && (
                            <small style={{ fontFamily: 'monospace', fontSize: '10.5px', color: '#64748b' }}>
                              {item.razorpayPaymentId}
                            </small>
                          )}
                          {item.refundId && (
                            <small style={{ fontFamily: 'monospace', fontSize: '10.5px', color: '#ea580c' }}>
                              Refund: {item.refundId}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>{formatDate(item.createdAt)}</td>
                      <td>
                        <select
                          className={`re-status-select ${statusClass}`}
                          value={item.status || 'Pending'}
                          onChange={(e) => handleStatusChange(item, e.target.value)}
                          disabled={updatingId === item._id}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Under Process">Under Process</option>
                          <option value="Approved">Approved</option>
                          <option value="Refund">Refund</option>
                        </select>
                      </td>
                      <td>
                        <div className="re-actions">
                          <button
                            type="button"
                            className="re-action-btn"
                            title="View Full Dossier"
                            onClick={() => handleOpenModal(item)}
                          >
                            <FaEye />
                          </button>
                          <button
                            type="button"
                            className="re-action-btn re-action-btn--delete"
                            title="Delete Record"
                            onClick={() => setDeleteModal(item)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                    No event registrations found matching current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedReg && (
        <div className="re-modal-backdrop" onClick={() => setSelectedReg(null)}>
          <div className="re-modal" onClick={(e) => e.stopPropagation()}>
            <div className="re-modal-header">
              <div>
                <span className="re-app-id" style={{ marginBottom: '6px' }}>
                  {selectedReg.applicationNumber}
                </span>
                <h3>Applicant Dossier & Verification</h3>
              </div>
              <button type="button" className="re-modal-close" onClick={() => setSelectedReg(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="re-modal-body">
              {/* Photo & Profile Banner */}
              <div className="re-dossier-banner">
                {selectedReg.photo ? (
                  <img
                    src={selectedReg.photo}
                    alt={selectedReg.applicantName}
                    className="re-dossier-photo"
                  />
                ) : (
                  <div className="re-dossier-photo-placeholder">No Photo</div>
                )}
                <div className="re-dossier-info">
                  <h4>{selectedReg.applicantName}</h4>
                  <p>Gender: <strong>{selectedReg.sex}</strong> · DOB: <strong>{selectedReg.dateOfBirth}</strong></p>
                  <p><FaPhoneAlt size={11} /> {selectedReg.whatsappNumber} · <FaEnvelope size={11} /> {selectedReg.email}</p>
                </div>
              </div>

              <div className="re-modal-grid">
                <div className="re-modal-field">
                  <label>Target Event</label>
                  <p>{selectedReg.eventName}</p>
                </div>
                <div className="re-modal-field">
                  <label>Payment Platform & Amount</label>
                  <p style={{ color: '#059669', fontWeight: 'bold' }}>
                    {selectedReg.registrationFees || '₹0'} ({selectedReg.paymentStatus || 'Paid'})
                  </p>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                    Platform: {selectedReg.paymentPlatform || 'Razorpay'} · Method: {selectedReg.paymentMethod || 'Online'}
                  </span>
                  {selectedReg.razorpayPaymentId && (
                    <small style={{ color: '#2563eb', display: 'block', fontSize: '11px', fontFamily: 'monospace' }}>
                      Payment ID: {selectedReg.razorpayPaymentId}
                    </small>
                  )}
                  {selectedReg.refundId && (
                    <small style={{ color: '#ea580c', display: 'block', fontSize: '11px', fontFamily: 'monospace', fontWeight: '700' }}>
                      Refund ID: {selectedReg.refundId}
                    </small>
                  )}
                </div>
                <div className="re-modal-field">
                  <label>District & State</label>
                  <p>{selectedReg.district}, {selectedReg.state} ({selectedReg.pinCode})</p>
                </div>
                <div className="re-modal-field">
                  <label>Website / Portfolio</label>
                  <p>{selectedReg.website || 'N/A'}</p>
                </div>
                <div className="re-modal-field" style={{ gridColumn: 'span 2' }}>
                  <label>Educational Qualification</label>
                  <p>{selectedReg.educationalQualification}</p>
                </div>
                {selectedReg.expertise && (
                  <div className="re-modal-field" style={{ gridColumn: 'span 2' }}>
                    <label>Area of Expertise & Special Skills</label>
                    <p style={{ fontWeight: 'normal', color: '#475569', lineHeight: 1.5 }}>
                      {selectedReg.expertise}
                    </p>
                  </div>
                )}
                {selectedReg.bioData && (
                  <div className="re-modal-field" style={{ gridColumn: 'span 2' }}>
                    <label>Bio-Data Document</label>
                    <a
                      href={selectedReg.bioData}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="re-file-link"
                    >
                      <FaDownload /> View / Download Bio-Data File
                    </a>
                  </div>
                )}
              </div>

              {/* Admin Remark & Status Modifier */}
              <div className="re-admin-control-box">
                <div className="re-admin-control-row">
                  <div>
                    <label className="re-control-label">Status</label>
                    <select
                      className={`re-status-select ${modalStatus.replace(/\s+/g, '-')}`}
                      style={{ height: '42px', minWidth: '160px' }}
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Under Process">Under Process</option>
                      <option value="Approved">Approved</option>
                      <option value="Refund">Refund</option>
                    </select>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label className="re-control-label">
                      <FaCommentDots /> Admin Remarks / Feedback Note (Visible to Applicant)
                    </label>
                    <input
                      type="text"
                      className="re-remark-input"
                      placeholder="e.g. Document verified, welcome badge sent / Refund processed"
                      value={modalRemark}
                      onChange={(e) => setModalRemark(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="re-modal-footer">
              <button
                type="button"
                className="re-refresh-btn"
                onClick={() => setSelectedReg(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="re-save-btn"
                disabled={savingModal}
                onClick={handleSaveModal}
              >
                <FaSave /> {savingModal ? 'Saving...' : 'Save & Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Confirmation Modal */}
      {refundModal && (
        <div className="re-modal-backdrop" onClick={() => setRefundModal(null)}>
          <div className="re-modal" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="re-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaUndoAlt color="#ea580c" />
                <h3 style={{ color: '#9a3412' }}>Process Event Refund</h3>
              </div>
              <button type="button" className="re-modal-close" onClick={() => setRefundModal(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="re-modal-body">
              <div className="re-refund-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Applicant:</span>
                  <strong>{refundModal.applicantName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Application ID:</span>
                  <span className="re-app-id">{refundModal.applicationNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Event:</span>
                  <strong>{refundModal.eventName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Payment Platform:</span>
                  <span style={{ color: '#2563eb', fontWeight: '700' }}>
                    <FaShieldAlt style={{ marginRight: '4px' }} />
                    {refundModal.paymentPlatform || 'Razorpay'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Transaction ID:</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                    {refundModal.razorpayPaymentId || 'N/A'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px dashed #fed7aa' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#9a3412' }}>Amount to Refund:</span>
                  <strong style={{ fontSize: '18px', color: '#ea580c' }}>{refundModal.registrationFees || '₹0'}</strong>
                </div>
              </div>

              <div>
                <label className="re-control-label">Refund Reason / Note</label>
                <input
                  type="text"
                  className="re-remark-input"
                  placeholder="e.g. Applicant requested refund / Event date rescheduled"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                />
              </div>

              <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', lineHeight: 1.5 }}>
                ⚠️ Clicking confirm will invoke the Razorpay Refund API and reverse the payment back to the applicant's original payment source (UPI/Card/Bank).
              </p>
            </div>

            <div className="re-modal-footer">
              <button
                type="button"
                className="re-refresh-btn"
                disabled={processingRefund}
                onClick={() => setRefundModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="re-refund-btn"
                disabled={processingRefund}
                onClick={handleConfirmRefund}
              >
                <FaUndoAlt /> {processingRefund ? 'Processing Razorpay Refund...' : 'Confirm & Process Refund'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="re-modal-backdrop" onClick={() => setDeleteModal(null)}>
          <div className="re-modal" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="re-modal-header">
              <h3>Confirm Delete</h3>
              <button type="button" className="re-modal-close" onClick={() => setDeleteModal(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="re-modal-body">
              <p style={{ margin: 0, color: '#475569', lineHeight: 1.5 }}>
                Are you sure you want to delete registration <strong>{deleteModal.applicationNumber}</strong> for <strong>{deleteModal.applicantName}</strong>? This action will permanently remove the application record and associated files.
              </p>
            </div>
            <div className="re-modal-footer">
              <button type="button" className="re-refresh-btn" onClick={() => setDeleteModal(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="re-delete-confirm-btn"
                onClick={confirmDelete}
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterEvent;
