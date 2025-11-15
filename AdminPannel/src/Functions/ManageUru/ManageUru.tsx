import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FaThLarge,   // Grid Icon
  FaListUl     // List Icon
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // ✅ View Toggle
  const navigate = useNavigate();

  const itemsPerPage = 10;

  // Dummy Data
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

  const toggleMenu = (id: number) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  const handleAction = (action: string, id: number) => {
    if (action === "Edit") navigate(`/uru/manage/edit/${id}`);
    else alert(`${action} clicked for Applicant: ${id}`);
    setMenuOpenId(null);
  };

  const filteredApplicants = applicants.filter((a) =>
    Object.values(a).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirst, indexOfLast);

  return (
    <div className="ManageUru-container">
      <div className="ManageUru-headerTop">
        <h2 className="ManageUru-title">Applicant Management</h2>

        {/* VIEW TOGGLE BUTTON */}
        <div className="ManageUru-viewToggle">
          <FaThLarge
            className={`viewIcon ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          />
          <FaListUl
            className={`viewIcon ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="ManageUru-searchBar">
        <FaSearch className="ManageUru-searchIcon" />
        <input
          type="text"
          placeholder="Search by Application No, Name, Email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* CONDITIONAL RENDER */}
      {viewMode === "grid" ? (
        // GRID VIEW
        <div className="ManageUru-grid">
          {currentApplicants.map((applicant, index) => (
            <div key={applicant.id} className="ManageUru-card">
              <div className="ManageUru-card-header">
                <img src={logo} alt="logo" className="ManageUru-logo" />
                <FaEllipsisV
                  className="ManageUru-menuIcon"
                  onClick={() => toggleMenu(applicant.id)}
                />

                {/* Dropdown */}
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
                  <strong>S.No:</strong>
                  <span>#{indexOfFirst + index + 1}</span>
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
          ))}
        </div>
      ) : (
        // LIST VIEW (TABLE)
        <div className="ManageUru-tableWrapper">
          <table className="ManageUru-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Application No</th>
                <th>Name</th>
                <th>Position</th>
                <th>Sex</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Country</th>
                <th>State</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentApplicants.map((app, index) => (
                <tr key={app.id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{app.applicationNumber}</td>
                  <td>{app.name}</td>
                  <td>{app.position}</td>
                  <td>{app.sex}</td>
                  <td>{app.whatsapp}</td>
                  <td>{app.email}</td>
                  <td>{app.country}</td>
                  <td>{app.state}</td>
                  <td>
                    <div className="table-actions">
                      <FaEdit onClick={() => handleAction("Edit", app.id)} />
                      <FaTrashAlt onClick={() => handleAction("Delete", app.id)} />
                      <FaCheckCircle onClick={() => handleAction("Approve", app.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="ManageUru-pagination">
        <button
          className="ManageUru-pageBtn"
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft /> Prev
        </button>

        <span className="ManageUru-pageInfo">
          Showing {indexOfFirst + 1}–{Math.min(indexOfLast, filteredApplicants.length)} of{" "}
          {filteredApplicants.length}
        </span>

        <button
          className="ManageUru-pageBtn"
          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ManageUru;
