import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  FaHandHoldingHeart,
  FaSearch,
  FaTimes,
  FaTrash,
  FaEye,
  FaPrint,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaSyncAlt,
  FaShieldAlt,
  FaReceipt,
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaIdCard,
  FaUndoAlt,
  FaFileInvoiceDollar
} from "react-icons/fa";
import API from "../../api/axiosInstance";
import "./ManageDonate.css";

const ManageDonate = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [certFilter, setCertFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [toast, setToast] = useState({ show: false, type: "success", text: "" });
  const [viewModal, setViewModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [refundModal, setRefundModal] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  const [processingRefund, setProcessingRefund] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const printAreaRef = useRef();

  const showToast = (text, type = "success") => {
    setToast({ show: true, type, text });
    window.clearTimeout(window.__donateToast);
    window.__donateToast = window.setTimeout(() => {
      setToast({ show: false, type: "success", text: "" });
    }, 3500);
  };

  // Fetch live donations from backend
  const fetchDonations = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      try {
        res = await API.get("/donations/all");
      } catch {
        res = await API.get("/donation/all");
      }

      if (res.data?.success) {
        const list = res.data.donations || res.data.data || [];
        setDonations(list);
      } else {
        setDonations([]);
      }
    } catch (err) {
      console.error("Error fetching donations:", err);
      showToast("Failed to fetch donation records from server.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, certFilter, statusFilter]);

  // Delete donation handler
  const confirmDelete = async () => {
    if (!deleteModal) return;
    try {
      setDeleting(true);
      const res = await API.delete(`/donations/${deleteModal._id}`);
      if (res.data?.success) {
        setDonations((prev) => prev.filter((d) => d._id !== deleteModal._id));
        showToast("Donation record deleted successfully.");
        setDeleteModal(null);
      }
    } catch (err) {
      console.error("Error deleting donation:", err);
      showToast(err.response?.data?.message || "Failed to delete donation record.", "error");
    } finally {
      setDeleting(false);
    }
  };

  // Refund handler
  const handleProcessRefund = async () => {
    if (!refundModal) return;
    try {
      setProcessingRefund(true);
      const res = await API.post(`/donations/${refundModal._id}/refund`, {
        refundReason: refundReason || "Admin processed donation refund",
      });

      if (res.data?.success) {
        const updated = res.data.data;
        setDonations((prev) =>
          prev.map((d) => (d._id === refundModal._id ? { ...d, ...updated } : d))
        );
        if (viewModal && viewModal._id === refundModal._id) {
          setViewModal((prev) => ({ ...prev, ...updated }));
        }
        showToast(`Refund processed successfully! ID: ${res.data.refundId || "Processed"}`);
        setRefundModal(null);
      }
    } catch (err) {
      console.error("Error processing donation refund:", err);
      showToast(err.response?.data?.message || "Failed to process refund.", "error");
    } finally {
      setProcessingRefund(false);
    }
  };

  // Print 80G Receipt
  const handlePrintReceipt = () => {
    window.print();
  };

  // Filter donations
  const filteredDonations = useMemo(() => {
    return donations.filter((item) => {
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        item.name?.toLowerCase().includes(search) ||
        item.paymentNumber?.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.phone?.toLowerCase().includes(search) ||
        item.razorpayPaymentId?.toLowerCase().includes(search);

      const matchesCert =
        certFilter === "All" ||
        (certFilter === "Yes" && item.certificate === "Yes") ||
        (certFilter === "No" && item.certificate !== "Yes");

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Paid" && item.paymentStatus === "Paid") ||
        (statusFilter === "Refunded" && (item.paymentStatus === "Refunded" || item.status === "Refund"));

      return matchesSearch && matchesCert && matchesStatus;
    });
  }, [donations, searchTerm, certFilter, statusFilter]);

  // Metrics
  const metrics = useMemo(() => {
    const totalRaised = donations.reduce(
      (sum, d) => sum + (d.paymentStatus === "Paid" ? Number(d.amount || 0) : 0),
      0
    );
    const certCount = donations.filter((d) => d.certificate === "Yes").length;
    const avgDonation = donations.length > 0 ? Math.round(totalRaised / donations.length) : 0;
    return {
      totalRaised,
      donorCount: donations.length,
      certCount,
      avgDonation,
    };
  }, [donations]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredDonations.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedDonations = filteredDonations.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  return (
    <div className="donate-admin-container">
      {/* Toast Alert */}
      {toast.show && (
        <div className={`donate-toast donate-toast--${toast.type}`}>
          <div className="donate-toast-icon">
            {toast.type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
          </div>
          <div className="donate-toast-text">
            <strong>{toast.type === "success" ? "Success" : "Notice"}</strong>
            <span>{toast.text}</span>
          </div>
          <button
            type="button"
            className="donate-toast-close"
            onClick={() => setToast({ show: false, type: "success", text: "" })}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="donate-page-header">
        <div className="donate-header-left">
          <div className="donate-icon-badge">
            <FaHandHoldingHeart />
          </div>
          <div>
            <h1>Manage Donations</h1>
            <p>Live financial contributions, 80G tax receipts, and Razorpay donor transactions.</p>
          </div>
        </div>

        <button
          type="button"
          className="donate-refresh-action-btn"
          disabled={loading}
          onClick={fetchDonations}
        >
          <FaSyncAlt className={loading ? "fa-spin" : ""} /> {loading ? "Refreshing..." : "Refresh Records"}
        </button>
      </div>

      {/* Metric Cards */}
      <div className="donate-stats-grid">
        <div className="donate-stat-card card-green">
          <div className="stat-icon-wrap">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Funds Raised</span>
            <h3 className="stat-value">₹{metrics.totalRaised.toLocaleString("en-IN")}</h3>
            <span className="stat-hint">Across verified Razorpay transactions</span>
          </div>
        </div>

        <div className="donate-stat-card card-blue">
          <div className="stat-icon-wrap">
            <FaUser />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Donors</span>
            <h3 className="stat-value">{metrics.donorCount}</h3>
            <span className="stat-hint">Generous supporters</span>
          </div>
        </div>

        <div className="donate-stat-card card-purple">
          <div className="stat-icon-wrap">
            <FaReceipt />
          </div>
          <div className="stat-content">
            <span className="stat-label">80G Tax Certificates</span>
            <h3 className="stat-value">{metrics.certCount}</h3>
            <span className="stat-hint">Tax-exemption claims</span>
          </div>
        </div>

        <div className="donate-stat-card card-amber">
          <div className="stat-icon-wrap">
            <FaHandHoldingHeart />
          </div>
          <div className="stat-content">
            <span className="stat-label">Average Contribution</span>
            <h3 className="stat-value">₹{metrics.avgDonation.toLocaleString("en-IN")}</h3>
            <span className="stat-hint">Per recorded donor</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="donate-filters-panel">
        <div className="donate-search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Donor Name, Email, Phone, Ref ID, or Payment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button type="button" className="clear-search-btn" onClick={() => setSearchTerm("")}>
              <FaTimes />
            </button>
          )}
        </div>

        <div className="donate-select-filters">
          <div className="select-wrap">
            <label>80G Certificate:</label>
            <select value={certFilter} onChange={(e) => setCertFilter(e.target.value)}>
              <option value="All">All Requests</option>
              <option value="Yes">Certificate: Yes (80G)</option>
              <option value="No">Certificate: No</option>
            </select>
          </div>

          <div className="select-wrap">
            <label>Payment Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="donate-table-card">
        {loading ? (
          <div className="donate-loading-state">
            <div className="spinner-large"></div>
            <p>Fetching real-time donation records from server...</p>
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="donate-empty-state">
            <FaHandHoldingHeart className="empty-icon" />
            <h3>No Donation Records Found</h3>
            <p>
              {searchTerm || certFilter !== "All" || statusFilter !== "All"
                ? "No donations match your search or filter criteria."
                : "No donation contributions have been received yet."}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="donate-table">
              <thead>
                <tr>
                  <th>Receipt / Ref ID</th>
                  <th>Donor Details</th>
                  <th>Amount</th>
                  <th>80G Tax Cert</th>
                  <th>Gateway & Payment</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDonations.map((d) => (
                  <tr key={d._id} className={d.paymentStatus === "Refunded" ? "row-refunded" : ""}>
                    {/* Receipt ID */}
                    <td>
                      <span className="ref-number-badge">{d.paymentNumber || "DON26----"}</span>
                    </td>

                    {/* Donor Info */}
                    <td>
                      <div className="donor-cell">
                        <strong className="donor-name">{d.name}</strong>
                        <span className="donor-contact"><FaPhoneAlt /> {d.phone}</span>
                        <span className="donor-contact"><FaEnvelope /> {d.email}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td>
                      <span className="amount-pill">₹{Number(d.amount || 0).toLocaleString("en-IN")}</span>
                    </td>

                    {/* 80G Certificate */}
                    <td>
                      {d.certificate === "Yes" ? (
                        <div className="cert-badge-yes">
                          <FaCheckCircle /> 80G Claimed
                          {d.panNumber && <small className="pan-text">PAN: {d.panNumber}</small>}
                        </div>
                      ) : (
                        <span className="cert-badge-no">Standard</span>
                      )}
                    </td>

                    {/* Gateway & Payment ID */}
                    <td>
                      <div className="gateway-cell">
                        <span className="platform-tag">
                          <FaShieldAlt /> {d.paymentPlatform || "Razorpay"}
                        </span>
                        <span className="pay-id-tag">
                          {d.razorpayPaymentId ? d.razorpayPaymentId.slice(0, 14) + "..." : "Online"}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td>
                      <div className="date-cell">
                        <span>{d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-IN") : "N/A"}</span>
                        <small>{d.createdAt ? new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</small>
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      {d.paymentStatus === "Refunded" || d.status === "Refund" ? (
                        <span className="status-badge status-refund">
                          <FaUndoAlt /> Refunded
                        </span>
                      ) : (
                        <span className="status-badge status-paid">
                          <FaCheckCircle /> Paid
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="action-buttons-wrap">
                        <button
                          type="button"
                          className="btn-action btn-view"
                          title="View Full Dossier & Receipt"
                          onClick={() => setViewModal(d)}
                        >
                          <FaEye /> View
                        </button>

                        {d.paymentStatus === "Paid" && (
                          <button
                            type="button"
                            className="btn-action btn-refund"
                            title="Refund Donation"
                            onClick={() => {
                              setRefundModal(d);
                              setRefundReason("Donation refund requested");
                            }}
                          >
                            <FaUndoAlt /> Refund
                          </button>
                        )}

                        <button
                          type="button"
                          className="btn-action btn-delete"
                          title="Delete Record"
                          onClick={() => setDeleteModal(d)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {filteredDonations.length > 0 && (
          <div className="donate-table-footer">
            <span className="footer-count-text">
              Showing {(safePage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(safePage * itemsPerPage, filteredDonations.length)} of{" "}
              {filteredDonations.length} entries
            </span>

            <div className="pagination-controls">
              <button
                type="button"
                className="page-btn"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span className="page-current-indicator">
                Page {safePage} of {totalPages}
              </span>
              <button
                type="button"
                className="page-btn"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW DOSSIER & 80G RECEIPT MODAL */}
      {viewModal && (
        <div className="donate-modal-overlay" onClick={() => setViewModal(null)}>
          <div className="donate-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="donate-modal-header">
              <div className="modal-title-wrap">
                <FaFileInvoiceDollar className="modal-title-icon" />
                <div>
                  <h3>Donation Receipt & Dossier</h3>
                  <span>Reference: {viewModal.paymentNumber}</span>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setViewModal(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="donate-modal-body" ref={printAreaRef}>
              {/* Printable Official Receipt Block */}
              <div className="receipt-paper">
                <div className="receipt-header-branding">
                  <div className="receipt-logo-title">
                    <h2>Unique Record of Universe</h2>
                    <p>Unit of Divya Prerak Kahaniyan Humanity Research Centre Trust</p>
                    <small>Registration & 80G Recognized Humanitarian Organization</small>
                  </div>
                  <div className="receipt-badge-status">
                    <span className={viewModal.paymentStatus === "Refunded" ? "badge-refunded" : "badge-verified"}>
                      {viewModal.paymentStatus === "Refunded" ? "REFUNDED" : "OFFICIAL RECEIPT"}
                    </span>
                  </div>
                </div>

                <div className="receipt-meta-grid">
                  <div className="meta-item">
                    <span className="meta-label">Receipt / Ref No:</span>
                    <strong className="meta-val">{viewModal.paymentNumber}</strong>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Donation Date:</span>
                    <strong className="meta-val">
                      {viewModal.createdAt ? new Date(viewModal.createdAt).toLocaleDateString("en-IN") : "N/A"}
                    </strong>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Payment Gateway:</span>
                    <strong className="meta-val">{viewModal.paymentPlatform || "Razorpay"}</strong>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Transaction ID:</span>
                    <strong className="meta-val monospace">{viewModal.razorpayPaymentId || "pay_ONLINE"}</strong>
                  </div>
                </div>

                <div className="receipt-divider"></div>

                <div className="receipt-donor-box">
                  <h4>Donor Information</h4>
                  <div className="donor-details-grid">
                    <div>
                      <span className="field-title"><FaUser /> Donor Name:</span>
                      <strong className="field-value">{viewModal.name}</strong>
                    </div>
                    <div>
                      <span className="field-title"><FaPhoneAlt /> Phone:</span>
                      <strong className="field-value">{viewModal.phone}</strong>
                    </div>
                    <div>
                      <span className="field-title"><FaEnvelope /> Email:</span>
                      <strong className="field-value">{viewModal.email}</strong>
                    </div>
                    <div>
                      <span className="field-title"><FaIdCard /> 80G Tax Exemption:</span>
                      <strong className="field-value">
                        {viewModal.certificate === "Yes" ? `Yes ${viewModal.panNumber ? `(PAN: ${viewModal.panNumber})` : ""}` : "No"}
                      </strong>
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <span className="field-title"><FaMapMarkerAlt /> Address:</span>
                      <span className="field-value">{viewModal.address}</span>
                    </div>
                    {viewModal.extra && (
                      <div style={{ gridColumn: "span 2" }}>
                        <span className="field-title"><FaHandHoldingHeart /> Message / Dedication:</span>
                        <span className="field-value italic">"{viewModal.extra}"</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount Box */}
                <div className="receipt-amount-banner">
                  <div className="amount-label">Donation Contribution Received:</div>
                  <div className="amount-large">₹{Number(viewModal.amount || 0).toLocaleString("en-IN")}</div>
                </div>

                {viewModal.paymentStatus === "Refunded" && (
                  <div className="receipt-refund-notice">
                    <FaUndoAlt /> This donation has been refunded on{" "}
                    {viewModal.refundedAt ? new Date(viewModal.refundedAt).toLocaleDateString("en-IN") : "N/A"}{" "}
                    (Refund ID: {viewModal.refundId || "Completed"}).
                  </div>
                )}

                <div className="receipt-footer-tax-note">
                  <p>
                    ✓ Donations to this trust are eligible for tax deduction under Section 80G of the Income Tax Act, 1961.
                  </p>
                  <small>This is a computer-generated official receipt and requires no physical signature.</small>
                </div>
              </div>
            </div>

            <div className="donate-modal-footer">
              <button type="button" className="btn-modal-print" onClick={handlePrintReceipt}>
                <FaPrint /> Print Official Receipt
              </button>
              <button type="button" className="btn-modal-close" onClick={() => setViewModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REFUND CONFIRMATION MODAL */}
      {refundModal && (
        <div className="donate-modal-overlay" onClick={() => setRefundModal(null)}>
          <div className="donate-modal-card modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="donate-modal-header header-orange">
              <div className="modal-title-wrap">
                <FaUndoAlt color="#ea580c" />
                <h3 style={{ color: "#9a3412" }}>Process Donation Refund</h3>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setRefundModal(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="donate-modal-body">
              <div className="refund-summary-box">
                <p><strong>Donor:</strong> {refundModal.name}</p>
                <p><strong>Ref Number:</strong> {refundModal.paymentNumber}</p>
                <p><strong>Transaction ID:</strong> {refundModal.razorpayPaymentId || "N/A"}</p>
                <p><strong>Amount to Refund:</strong> <span className="refund-amount-text">₹{refundModal.amount}</span></p>
              </div>

              <div style={{ marginTop: "16px" }}>
                <label className="input-field-label">Refund Reason / Note:</label>
                <input
                  type="text"
                  className="refund-reason-input"
                  placeholder="e.g. Donor requested refund / duplicate charge"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                />
              </div>

              <p style={{ fontSize: "12.5px", color: "#64748b", marginTop: "12px", lineHeight: 1.5 }}>
                ⚠️ This will invoke the Razorpay Refund API and return ₹{refundModal.amount} to the donor's original payment method.
              </p>
            </div>

            <div className="donate-modal-footer">
              <button
                type="button"
                className="btn-modal-close"
                disabled={processingRefund}
                onClick={() => setRefundModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-confirm-refund"
                disabled={processingRefund}
                onClick={handleProcessRefund}
              >
                <FaUndoAlt /> {processingRefund ? "Processing Refund..." : "Confirm & Process Refund"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal && (
        <div className="donate-modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="donate-modal-card modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="donate-modal-header header-red">
              <div className="modal-title-wrap">
                <FaTrash color="#dc2626" />
                <h3 style={{ color: "#991b1b" }}>Confirm Delete</h3>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setDeleteModal(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="donate-modal-body">
              <p style={{ color: "#475569", lineHeight: 1.5, margin: 0 }}>
                Are you sure you want to delete the donation record <strong>{deleteModal.paymentNumber}</strong> for <strong>{deleteModal.name}</strong> (₹{deleteModal.amount})? This action cannot be undone.
              </p>
            </div>

            <div className="donate-modal-footer">
              <button
                type="button"
                className="btn-modal-close"
                disabled={deleting}
                onClick={() => setDeleteModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-confirm-delete"
                disabled={deleting}
                onClick={confirmDelete}
              >
                <FaTrash /> {deleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDonate;