import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook
import "./ManageUru.css";
import {
  FaEllipsisV,
  FaEdit,
  FaTrashAlt,
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaGlobe,
  FaTransgender,
  FaBriefcase,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import logo from "../../Asserts/UNQUE.webp";

interface Applicant {
  id: number;
  applicationNumber: string;
  name: string;
  position: string;
  sex: string;
  whatsapp: string;
  email: string;
  country: string;
  state: string;
}

const ManageUru: React.FC = () => {
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate(); // ✅ Hook for routing

  const itemsPerPage = 10;

  // ✅ Dummy Data
  const applicants: Applicant[] = Array.from({ length: 36 }).map((_, i) => ({
    id: i + 1,
    applicationNumber: `APP${10000 + i}`,
    name: `Applicant ${i + 1}`,
    position: ["Developer", "Designer", "Manager", "HR"][i % 4],
    sex: i % 2 === 0 ? "Male" : "Female",
    whatsapp: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
    email: `user${i + 1}@example.com`,
    country: "India",
    state: ["Odisha", "Delhi", "Bihar", "Maharashtra"][i % 4],
  }));

  // ✅ Handlers
  const toggleMenu = (id: number) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  const handleAction = (action: string, id: number) => {
    if (action === "Edit") {
      navigate(`/uru/manage/edit/${id}`); // ✅ Navigate to Edit page
    } else {
      alert(`${action} clicked for Applicant ID: ${id}`);
    }
    setMenuOpenId(null);
  };

  const filteredApplicants = applicants.filter((applicant) =>
    Object.values(applicant)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirstItem, indexOfLastItem);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="ManageUru-container">
      <h2 className="ManageUru-title">Applicant Management</h2>

      {/* ✅ Search Bar */}
      <div className="ManageUru-searchBar">
        <FaSearch className="ManageUru-searchIcon" />
        <input
          type="text"
          placeholder="Search by Application No, Name, Email, Country..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="ManageUru-grid">
        {currentApplicants.length > 0 ? (
          currentApplicants.map((applicant, index) => (
            <div key={applicant.id} className="ManageUru-card">
              <div className="ManageUru-header">
                <img src={logo} alt="Logo" className="ManageUru-logo" />
                <FaEllipsisV
                  className="ManageUru-menuIcon"
                  onClick={() => toggleMenu(applicant.id)}
                />
                <div
                  className={`ManageUru-dropdown ${
                    menuOpenId === applicant.id ? "show" : ""
                  }`}
                >
                  <p onClick={() => handleAction("Edit", applicant.id)}>
                    <FaEdit /> Edit
                  </p>
                  <p onClick={() => handleAction("Delete", applicant.id)}>
                    <FaTrashAlt /> Delete
                  </p>
                  <p onClick={() => handleAction("Approve", applicant.id)}>
                    <FaCheckCircle /> Approve
                  </p>
                </div>
              </div>

              <div className="ManageUru-body">
                <div className="ManageUru-row">
                  <strong>S.No:</strong> <span>#{indexOfFirstItem + index + 1}</span>
                </div>
                <div className="ManageUru-row">
                  <strong>Application No:</strong>
                  <span>{applicant.applicationNumber}</span>
                </div>
                <div className="ManageUru-row">
                  <FaUser /> <span>{applicant.name}</span>
                </div>
                <div className="ManageUru-row">
                  <FaBriefcase /> <span>{applicant.position}</span>
                </div>
                <div className="ManageUru-row">
                  <FaTransgender /> <span>{applicant.sex}</span>
                </div>
                <div className="ManageUru-row">
                  <FaPhoneAlt /> <span>{applicant.whatsapp}</span>
                </div>
                <div className="ManageUru-row">
                  <FaEnvelope /> <span>{applicant.email}</span>
                </div>
                <div className="ManageUru-row">
                  <FaGlobe /> <span>{applicant.country}</span>
                </div>
                <div className="ManageUru-row">
                  <FaGlobe /> <span>{applicant.state}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="ManageUru-noResult">No matching applicants found.</p>
        )}
      </div>

      {/* ✅ Pagination */}
      {filteredApplicants.length > 0 && (
        <div className="ManageUru-pagination">
          <button
            className="ManageUru-pageBtn"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            <FaChevronLeft /> Prev
          </button>

          <span className="ManageUru-pageInfo">
            Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredApplicants.length)} of{" "}
            {filteredApplicants.length}
          </span>

          <button
            className="ManageUru-pageBtn"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageUru;
