import React, { useEffect, useMemo, useState } from "react";
import {
  FaHandHoldingHeart,
  FaSearch,
  FaTimes,
  FaTrash,
  FaEye,
  FaFilePdf,
  FaBell,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
} from "react-icons/fa";
import "./ManageDonate.css";

const STORAGE_KEY = "admin_donations_data";

const INITIAL_DONATIONS = [
  {
    id: 1,
    paymentNumber: "PAY-98321456",
    name: "Aarav Sharma",
    phone: "+91 98765 43210",
    email: "aarav.sharma@gmail.com",
    amount: "2500",
    certificate: "CERT-2026-001",
    address: "12/4 Park Street, Kolkata, WB",
    extraInfo: "General Institution Fund Contribution",
    date: "2026-09-22",
  },
  {
    id: 2,
    paymentNumber: "PAY-88419203",
    name: "Priya Patel",
    phone: "+91 91234 56789",
    email: "priya.patel@yahoo.com",
    amount: "5000",
    certificate: "CERT-2026-002",
    address: "B-402, Titanium Heights, Satellite, Ahmedabad, GJ",
    extraInfo: "Student Welfare Scholarship Program",
    date: "2026-09-23",
  },
  {
    id: 3,
    paymentNumber: "PAY-77340192",
    name: "Vikram Malhotra",
    phone: "+91 99887 66554",
    email: "v.malhotra@corporate.in",
    amount: "10000",
    certificate: "CERT-2026-003",
    address: "Flat 801, Prestige Towers, MG Road, Bangalore, KA",
    extraInfo: "Infrastructure & Lab Equipment Donation",
    date: "2026-09-24",
  },
];

const ManageDonate = () => {
  const [donations, setDonations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
    } catch {
      return INITIAL_DONATIONS;
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [message, setMessage] = useState({ show: false, type: "", text: "" });
  const [viewModal, setViewModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const showMessage = (text, type = "success") => {
    setMessage({ show: true, type, text });
    window.clearTimeout(window.__donateToast);
    window.__donateToast = window.setTimeout(() => {
      setMessage({ show: false, type: "", text: "" });
    }, 3000);
  };

  const confirmDelete = () => {
    if (!deleteModal) return;
    setDonations((prev) => prev.filter((item) => item.id !== deleteModal.id));
    showMessage("Donation record deleted successfully.");
    setDeleteModal(null);
  };

  const filteredDonations = useMemo(() => {
    return donations.filter((item) => {
      const search = searchTerm.toLowerCase().trim();
      return (
        !search ||
        item.name?.toLowerCase().includes(search) ||
        item.paymentNumber?.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.phone?.toLowerCase().includes(search)
      );
    });
  }, [donations, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredDonations.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedDonations = filteredDonations.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const totalAmount = donations.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="donate-page">
      {message.show && (
        <div className={`donate-page__toast donate-page__toast--${message.type}`}>
          <div className="donate-page__toast-icon">
            {message.type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
          </div>
          <div className="donate-page__toast-content">
            <strong>{message.type === "success" ? "Success" : "Attention"}</strong>
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            className="donate-page__toast-close"
            onClick={() => setMessage({ show: false, type: "", text: "" })}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* TOP HEADER SECTION */}
      <section className="donate-page__header">
        <div className="donate-page__header-title">
          <h1>Manage Donations</h1>
          <p>Track financial contributions, certificates, and donor details.</p>
        </div>

        <div className="donate-page__header-badge">
          <div className="donate-page__badge-icon">
            <FaBell />
          </div>
          <span>
            <strong>{donations.length}</strong> donations received
          </span>
        </div>
      </section>

      {/* FINANCIAL METRIC HIGHLIGHT */}
      <section className="donate-page__stats-section">
        <div className="donate-page__stat-card">
          <div className="donate-page__stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="donate-page__stat-content">
            <span>Total Funds Collected</span>
            <strong>₹{totalAmount.toLocaleString()}</strong>
          </div>
        </div>
      </section>

      {/* SEARCH AND DIRECTORY SECTION */}
      <section className="donate-page__list-section">
        <div className="donate-page__search-bar-wrap">
          <div className="donate-page__search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by Name, Payment Number, or Email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm("")}>
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* DESKTOP TABLE */}
        <div className="donate-page__table-wrapper">
          <table className="donate-page__table">
            <thead>
              <tr>
                <th>Sl. No.</th>
                <th>Payment Number</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Certificate</th>
                <th>Address</th>
                <th>Extra Info</th>
                <th>Date</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDonations.length > 0 ? (
                paginatedDonations.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <span className="donate-page__serial">
                        {(safePage - 1) * itemsPerPage + index + 1}
                      </span>
                    </td>
                    <td>
                      <span className="donate-page__pay-num">
                        {item.paymentNumber}
                      </span>
                    </td>
                    <td>
                      <div className="donate-page__name-cell">
                        <strong>{item.name}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="donate-page__text-muted">{item.phone}</span>
                    </td>
                    <td>
                      <span className="donate-page__text-muted">{item.email}</span>
                    </td>
                    <td>
                      <strong className="donate-page__amount">
                        ₹{Number(item.amount).toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="donate-page__cert-btn"
                        onClick={() =>
                          showMessage(`Downloading ${item.certificate}...`, "success")
                        }
                        title="View Certificate"
                      >
                        <FaFilePdf /> {item.certificate}
                      </button>
                    </td>
                    <td>
                      <span className="donate-page__address-text" title={item.address}>
                        {item.address}
                      </span>
                    </td>
                    <td>
                      <span className="donate-page__extra-text" title={item.extraInfo}>
                        {item.extraInfo}
                      </span>
                    </td>
                    <td>
                      <span className="donate-page__date-text">{item.date}</span>
                    </td>
                    <td>
                      <div className="donate-page__actions">
                        <button
                          type="button"
                          className="donate-page__action-btn donate-page__action-btn--view"
                          title="View Details"
                          onClick={() => setViewModal(item)}
                        >
                          <FaEye />
                        </button>
                        <button
                          type="button"
                          className="donate-page__action-btn donate-page__action-btn--delete"
                          title="Delete Donation"
                          onClick={() => setDeleteModal(item)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="donate-page__empty-cell">
                    <div className="donate-page__empty">
                      <div className="donate-page__empty-icon">
                        <FaHandHoldingHeart />
                      </div>
                      <h3>No donations found.</h3>
                      <p>No donation records match your search query.</p>
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => setSearchTerm("")}
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="donate-page__mobile-list">
          {paginatedDonations.length > 0 ? (
            paginatedDonations.map((item) => (
              <article className="donate-page__mobile-card" key={item.id}>
                <div className="donate-page__mobile-card-top">
                  <div>
                    <span className="donate-page__mobile-pay">
                      {item.paymentNumber}
                    </span>
                    <h3>{item.name}</h3>
                  </div>
                  <strong className="donate-page__amount">
                    ₹{Number(item.amount).toLocaleString()}
                  </strong>
                </div>

                <div className="donate-page__mobile-details">
                  <div>
                    <span>Phone</span>
                    <strong>{item.phone}</strong>
                  </div>
                  <div>
                    <span>Email</span>
                    <strong>{item.email}</strong>
                  </div>
                  <div>
                    <span>Certificate</span>
                    <strong>{item.certificate}</strong>
                  </div>
                  <div>
                    <span>Date</span>
                    <strong>{item.date}</strong>
                  </div>
                  <div className="donate-page__mobile-full">
                    <span>Address</span>
                    <strong>{item.address}</strong>
                  </div>
                  <div className="donate-page__mobile-full">
                    <span>Extra Info</span>
                    <strong>{item.extraInfo}</strong>
                  </div>
                </div>

                <div className="donate-page__mobile-bottom">
                  <button
                    type="button"
                    className="donate-page__cert-btn"
                    onClick={() =>
                      showMessage(`Downloading ${item.certificate}...`, "success")
                    }
                  >
                    <FaFilePdf /> Certificate
                  </button>

                  <div className="donate-page__actions">
                    <button
                      type="button"
                      className="donate-page__action-btn donate-page__action-btn--view"
                      onClick={() => setViewModal(item)}
                    >
                      <FaEye />
                    </button>
                    <button
                      type="button"
                      className="donate-page__action-btn donate-page__action-btn--delete"
                      onClick={() => setDeleteModal(item)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="donate-page__mobile-empty">
              <FaHandHoldingHeart />
              <h3>No donations found.</h3>
              <p>Try searching with a different keyword.</p>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {filteredDonations.length > 0 && (
          <div className="donate-page__pagination">
            <div className="donate-page__pagination-info">
              Showing{" "}
              <strong>{(safePage - 1) * itemsPerPage + 1}</strong> to{" "}
              <strong>
                {Math.min(safePage * itemsPerPage, filteredDonations.length)}
              </strong>{" "}
              of <strong>{filteredDonations.length}</strong> records
            </div>

            <div className="donate-page__pagination-buttons">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => goToPage(safePage - 1)}
              >
                <FaChevronLeft />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  type="button"
                  key={page}
                  className={
                    safePage === page ? "donate-page__pagination-active" : ""
                  }
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => goToPage(safePage + 1)}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* VIEW DETAILS MODAL */}
      {viewModal && (
        <div
          className="donate-page__modal-overlay"
          onClick={() => setViewModal(null)}
        >
          <div
            className="donate-page__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="donate-page__modal-header">
              <div>
                <span>DONATION RECEIPT</span>
                <h3>{viewModal.name}</h3>
              </div>
              <button type="button" onClick={() => setViewModal(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="donate-page__modal-body">
              <div className="donate-page__receipt-box">
                <div>
                  <span>Payment Reference</span>
                  <strong>{viewModal.paymentNumber}</strong>
                </div>
                <div>
                  <span>Donation Amount</span>
                  <strong className="donate-page__amount">
                    ₹{Number(viewModal.amount).toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span>Phone Number</span>
                  <strong>{viewModal.phone}</strong>
                </div>
                <div>
                  <span>Email Address</span>
                  <strong>{viewModal.email}</strong>
                </div>
                <div>
                  <span>Certificate ID</span>
                  <strong>{viewModal.certificate}</strong>
                </div>
                <div>
                  <span>Transaction Date</span>
                  <strong>{viewModal.date}</strong>
                </div>
                <div className="donate-page__receipt-full">
                  <span>Donor Address</span>
                  <strong>{viewModal.address}</strong>
                </div>
                <div className="donate-page__receipt-full">
                  <span>Additional Information</span>
                  <strong>{viewModal.extraInfo}</strong>
                </div>
              </div>
            </div>

            <div className="donate-page__modal-footer">
              <button type="button" onClick={() => setViewModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div
          className="donate-page__modal-overlay"
          onClick={() => setDeleteModal(null)}
        >
          <div
            className="donate-page__modal donate-page__delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="donate-page__delete-icon">
              <FaTrash />
            </div>
            <h3>Delete Donation Record?</h3>
            <p>
              Are you sure you want to remove the donation record for{" "}
              <strong>{deleteModal.name}</strong> (Ref: {deleteModal.paymentNumber})? This cannot be undone.
            </p>
            <div className="donate-page__delete-actions">
              <button
                type="button"
                className="donate-page__delete-cancel"
                onClick={() => setDeleteModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="donate-page__delete-confirm"
                onClick={confirmDelete}
              >
                <FaTrash /> Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDonate;