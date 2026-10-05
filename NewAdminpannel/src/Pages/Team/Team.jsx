import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  FaUserPlus,
  FaUserEdit,
  FaUser,
  FaBriefcase,
  FaPhone,
  FaEnvelope,
  FaImage,
  FaUpload,
  FaTimes,
  FaUndo,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaFilter,
  FaListAlt,
  FaTrash,
  FaEye,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import API from "../../api/axiosInstance";
import "./Team.css";

const emptyForm = {
  name: "",
  designation: "",
  phone: "",
  email: "",
  profilePic: "",
  facebook: "",
  instagram: "",
  twitter: "",
  linkedin: "",
  status: "Active",
};

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [message, setMessage] = useState({ show: false, type: "", text: "" });
  const [viewModal, setViewModal] = useState(null);
  const [imageModal, setImageModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const formRef = useRef(null);

  const showMessage = (text, type = "success") => {
    setMessage({ show: true, type, text });
    window.clearTimeout(window.__teamToast);
    window.__teamToast = window.setTimeout(() => {
      setMessage({ show: false, type: "", text: "" });
    }, 3500);
  };

  // Fetch team members from Database
  const fetchTeamMembers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/teams/all");
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setTeamMembers(res.data.data);
      } else if (Array.isArray(res.data)) {
        setTeamMembers(res.data);
      } else if (res.data && Array.isArray(res.data.data)) {
        setTeamMembers(res.data.data);
      } else {
        setTeamMembers([]);
      }
    } catch (err) {
      console.error("Error fetching team members:", err);
      // Fallback to public route if needed
      try {
        const fallbackRes = await API.get("/teams");
        if (Array.isArray(fallbackRes.data)) {
          setTeamMembers(fallbackRes.data);
        } else if (fallbackRes.data && Array.isArray(fallbackRes.data.data)) {
          setTeamMembers(fallbackRes.data.data);
        }
      } catch (fallbackErr) {
        console.error("Fallback fetch error:", fallbackErr);
        showMessage("Failed to load team members from server.", "error");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage("Please select a valid image file.", "error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showMessage("Image size should be less than 10MB.", "error");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview("");
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, profilePic: "" }));
    const fileInput = document.getElementById("team-profile-upload");
    if (fileInput) fileInput.value = "";
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showMessage("Please enter member name.", "error");
      return false;
    }
    if (!formData.designation.trim()) {
      showMessage("Please enter designation.", "error");
      return false;
    }
    if (!formData.phone.trim()) {
      showMessage("Please enter phone number.", "error");
      return false;
    }
    if (!formData.email.trim()) {
      showMessage("Please enter email address.", "error");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setImagePreview("");
    setSelectedFile(null);
    const fileInput = document.getElementById("team-profile-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("designation", formData.designation.trim());
      data.append("phone", formData.phone.trim());
      data.append("email", formData.email.trim());
      data.append("status", formData.status || "Active");
      data.append("facebook", formData.facebook.trim());
      data.append("instagram", formData.instagram.trim());
      data.append("twitter", formData.twitter.trim());
      data.append("linkedin", formData.linkedin.trim());

      if (selectedFile) {
        data.append("profilePic", selectedFile);
      } else if (formData.profilePic) {
        data.append("profilePic", formData.profilePic);
      }

      if (editingId) {
        const res = await API.put(`/teams/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data?.success || res.status === 200) {
          showMessage("Team member updated successfully.");
          await fetchTeamMembers();
          resetForm();
        } else {
          showMessage(res.data?.message || "Failed to update member.", "error");
        }
      } else {
        const res = await API.post("/teams", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data?.success || res.status === 201) {
          showMessage("Team member added successfully.");
          await fetchTeamMembers();
          resetForm();
        } else {
          showMessage(res.data?.message || "Failed to add member.", "error");
        }
      }

      setTimeout(() => {
        document.getElementById("team-list-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      console.error("Error saving team member:", err);
      showMessage(
        err.response?.data?.message || "Error saving team member to database.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (member) => {
    const memberId = member._id || member.id;
    setEditingId(memberId);
    setFormData({
      name: member.name || "",
      designation: member.designation || "",
      phone: member.phone || "",
      email: member.email || "",
      profilePic: member.profilePic || "",
      facebook: member.facebook || "",
      instagram: member.instagram || "",
      twitter: member.twitter || "",
      linkedin: member.linkedin || "",
      status: member.status || "Active",
    });
    setImagePreview(member.profilePic || "");
    setSelectedFile(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;
    const targetId = deleteModal._id || deleteModal.id;
    try {
      const res = await API.delete(`/teams/${targetId}`);
      if (res.data?.success || res.status === 200) {
        showMessage("Team member deleted successfully.");
        if (editingId === targetId) resetForm();
        await fetchTeamMembers();
      } else {
        showMessage(res.data?.message || "Failed to delete team member.", "error");
      }
    } catch (err) {
      console.error("Error deleting team member:", err);
      showMessage(
        err.response?.data?.message || "Error deleting team member.",
        "error"
      );
    } finally {
      setDeleteModal(null);
    }
  };

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((item) => {
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        item.name?.toLowerCase().includes(search) ||
        item.designation?.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.phone?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [teamMembers, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedMembers = filteredMembers.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter((item) => item.status === "Active").length,
    inactive: teamMembers.filter((item) => item.status === "Inactive").length,
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="team-page">
      {message.show && (
        <div className={`team-page__toast team-page__toast--${message.type}`}>
          <div className="team-page__toast-icon">
            {message.type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
          </div>
          <div className="team-page__toast-content">
            <strong>{message.type === "success" ? "Success" : "Attention"}</strong>
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            className="team-page__toast-close"
            onClick={() => setMessage({ show: false, type: "", text: "" })}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* STATISTICS */}
      <section className="team-page__stats-section">
        <div className="team-page__stats-grid">
          <div className="team-page__stat-card team-page__stat-card--total">
            <div className="team-page__stat-icon">
              <FaUser />
            </div>
            <div className="team-page__stat-content">
              <span>Total Members</span>
              <strong>{stats.total}</strong>
            </div>
          </div>
          <div className="team-page__stat-card team-page__stat-card--active">
            <div className="team-page__stat-icon">
              <FaCheckCircle />
            </div>
            <div className="team-page__stat-content">
              <span>Active Staff</span>
              <strong>{stats.active}</strong>
            </div>
          </div>
          <div className="team-page__stat-card team-page__stat-card--inactive">
            <div className="team-page__stat-icon">
              <FaTimesCircle />
            </div>
            <div className="team-page__stat-content">
              <span>Inactive Staff</span>
              <strong>{stats.inactive}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="team-page__form-section" ref={formRef} id="team-form-section">
        <div className="team-page__section-heading">
          <div className="team-page__section-heading-left">
            <div className="team-page__section-icon">
              {editingId ? <FaUserEdit /> : <FaUserPlus />}
            </div>
            <div>
              <span>{editingId ? "UPDATE STAFF PROFILE" : "TEAM ADMINISTRATION"}</span>
              <h2>{editingId ? "Edit Team Member" : "Add Team Member"}</h2>
            </div>
          </div>
          {editingId && (
            <div className="team-page__editing-badge">
              <FaUserEdit /> Editing Member
            </div>
          )}
        </div>

        <form className="team-page__form" onSubmit={handleSubmit}>
          {/* PROFILE PICTURE UPLOAD CARD */}
          <div className="team-page__form-card">
            <div className="team-page__field">
              <label htmlFor="team-profile-upload">
                <FaUpload /> Upload Profile Picture: <span>*</span>
              </label>

              <div className="team-page__file-input-wrapper">
                <input
                  id="team-profile-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleImageChange}
                />
                <label htmlFor="team-profile-upload" className="team-page__choose-file-btn">
                  Choose File
                </label>
                <span className="team-page__file-name-display">
                  {imagePreview ? "Image selected & loaded" : "No file chosen"}
                </span>
              </div>

              {imagePreview && (
                <div className="team-page__image-preview">
                  <div className="team-page__image-preview-thumb">
                    <img src={imagePreview} alt="Profile preview" />
                  </div>
                  <div className="team-page__image-preview-info">
                    <strong>Preview Ready</strong>
                    <span>Profile image will be converted to WebP and saved with member info.</span>
                  </div>
                  <button
                    type="button"
                    className="team-page__remove-image-btn"
                    onClick={removeImage}
                  >
                    <FaTimes /> Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* BASIC INFO CARD */}
          <div className="team-page__form-card">
            <div className="team-page__form-grid team-page__form-grid--three">
              <div className="team-page__field">
                <label htmlFor="team-name">
                  <FaUser /> Member Name: <span>*</span>
                </label>
                <div className="team-page__input-wrap">
                  <input
                    id="team-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>

              <div className="team-page__field">
                <label htmlFor="team-designation">
                  <FaBriefcase /> Designation: <span>*</span>
                </label>
                <div className="team-page__input-wrap">
                  <input
                    id="team-designation"
                    name="designation"
                    type="text"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Enter designation"
                    required
                  />
                </div>
              </div>

              <div className="team-page__field">
                <label htmlFor="team-phone">
                  <FaPhone /> Phone Number: <span>*</span>
                </label>
                <div className="team-page__input-wrap">
                  <input
                    id="team-phone"
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="team-page__form-grid team-page__form-grid--two team-page__field--full">
              <div className="team-page__field">
                <label htmlFor="team-email">
                  <FaEnvelope /> Email: <span>*</span>
                </label>
                <div className="team-page__input-wrap">
                  <input
                    id="team-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              <div className="team-page__field">
                <label htmlFor="team-status">
                  <FaCheckCircle /> Account Status:
                </label>
                <div className="team-page__select-wrap">
                  <select
                    id="team-status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SOCIAL MEDIA LINKS CARD */}
          <div className="team-page__form-card">
            <div className="team-page__social-heading">
              <h3>SOCIAL MEDIA LINKS</h3>
            </div>

            <div className="team-page__form-grid team-page__form-grid--three">
              <div className="team-page__field">
                <label htmlFor="team-facebook">
                  <FaFacebook /> Facebook Link:
                </label>
                <div className="team-page__input-wrap">
                  <input
                    id="team-facebook"
                    name="facebook"
                    type="url"
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder="Facebook Profile URL"
                  />
                </div>
              </div>

              <div className="team-page__field">
                <label htmlFor="team-instagram">
                  <FaInstagram /> Instagram Link:
                </label>
                <div className="team-page__input-wrap">
                  <input
                    id="team-instagram"
                    name="instagram"
                    type="url"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="Instagram Profile URL"
                  />
                </div>
              </div>

              <div className="team-page__field">
                <label htmlFor="team-twitter">
                  <FaTwitter /> Twitter Link:
                </label>
                <div className="team-page__input-wrap">
                  <input
                    id="team-twitter"
                    name="twitter"
                    type="url"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="Twitter Profile URL"
                  />
                </div>
              </div>
            </div>

            <div className="team-page__field team-page__field--full">
              <label htmlFor="team-linkedin">
                <FaLinkedin /> LinkedIn Link:
              </label>
              <div className="team-page__input-wrap">
                <input
                  id="team-linkedin"
                  name="linkedin"
                  type="url"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="LinkedIn Profile URL"
                />
              </div>
            </div>
          </div>

          {/* FORM ACTIONS */}
          <div className="team-page__form-actions">
            <button
              type="button"
              className="team-page__reset-btn"
              onClick={resetForm}
              disabled={submitting}
            >
              <FaUndo /> {editingId ? "Cancel Edit" : "Reset Form"}
            </button>
            <button
              type="submit"
              className="team-page__submit-btn"
              disabled={submitting}
            >
              {editingId ? <FaUserEdit /> : <FaUserPlus />}
              {submitting
                ? "Saving..."
                : editingId
                ? "Update Team Member"
                : "Add Team Member"}
            </button>
          </div>
        </form>
      </section>

      {/* TEAM DIRECTORY / TABLE SECTION */}
      <section className="team-page__list-section" id="team-list-section">
        <div className="team-page__list-header">
          <div className="team-page__section-heading-left">
            <div className="team-page__section-icon">
              <FaListAlt />
            </div>
            <div>
              <span>DIRECTORY</span>
              <h2>Team Members List</h2>
              <p>Manage, search, and view your organization staff records.</p>
            </div>
          </div>

          <div className="team-page__result-count">
            <strong>{filteredMembers.length}</strong>
            <span>Members Found</span>
          </div>
        </div>

        {/* FILTERS */}
        <div className="team-page__filters">
          <div className="team-page__search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by name, designation, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm("")}>
                <FaTimes />
              </button>
            )}
          </div>

          <div className="team-page__filter-select">
            <FaFilter />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button
            type="button"
            className="team-page__clear-filter"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("All");
            }}
          >
            <FaUndo /> Clear Filters
          </button>
        </div>

        {/* DESKTOP TABLE */}
        <div className="team-page__table-wrapper">
          <table className="team-page__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Member Name</th>
                <th>Designation</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="team-page__empty-cell">
                    <div className="team-page__empty">
                      <div className="team-page__empty-icon">
                        <FaUser />
                      </div>
                      <h3>Loading Team Members...</h3>
                      <p>Fetching records from database.</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedMembers.length > 0 ? (
                paginatedMembers.map((item, index) => {
                  const itemId = item._id || item.id;
                  return (
                    <tr key={itemId}>
                      <td>
                        <span className="team-page__serial">
                          {(safePage - 1) * itemsPerPage + index + 1}
                        </span>
                      </td>
                      <td>
                        <div className="team-page__member-cell">
                          <div className="team-page__member-thumb">
                            {item.profilePic ? (
                              <img src={item.profilePic} alt={item.name} />
                            ) : (
                              <FaUser />
                            )}
                          </div>
                          <div className="team-page__member-info">
                            <strong>{item.name}</strong>
                            <span>Joined {formatDate(item.createdAt)}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="team-page__designation-text">
                          {item.designation}
                        </span>
                      </td>
                      <td>
                        <span className="team-page__phone-text">{item.phone}</span>
                      </td>
                      <td>
                        <span className="team-page__email-text">{item.email}</span>
                      </td>
                      <td>
                        <span
                          className={`team-page__status team-page__status--${(
                            item.status || "Active"
                          ).toLowerCase()}`}
                        >
                          {item.status === "Active" ? (
                            <FaCheckCircle />
                          ) : (
                            <FaTimesCircle />
                          )}
                          {item.status || "Active"}
                        </span>
                      </td>
                      <td>
                        <div className="team-page__actions">
                          <button
                            type="button"
                            className="team-page__action-btn team-page__action-btn--view"
                            title="View Profile"
                            onClick={() => setViewModal(item)}
                          >
                            <FaEye />
                          </button>
                          {item.profilePic && (
                            <button
                              type="button"
                              className="team-page__action-btn team-page__action-btn--image"
                              title="View Photo"
                              onClick={() => setImageModal(item)}
                            >
                              <FaImage />
                            </button>
                          )}
                          <button
                            type="button"
                            className="team-page__action-btn team-page__action-btn--edit"
                            title="Edit Member"
                            onClick={() => handleEdit(item)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            className="team-page__action-btn team-page__action-btn--delete"
                            title="Delete Member"
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
                  <td colSpan="7" className="team-page__empty-cell">
                    <div className="team-page__empty">
                      <div className="team-page__empty-icon">
                        <FaUser />
                      </div>
                      <h3>No Team Members Found</h3>
                      <p>No members match your current search criteria or database is empty.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("All");
                        }}
                      >
                        Reset Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="team-page__mobile-list">
          {loading ? (
            <div className="team-page__mobile-empty">
              <FaUser />
              <h3>Loading Team Members...</h3>
              <p>Fetching records from database.</p>
            </div>
          ) : paginatedMembers.length > 0 ? (
            paginatedMembers.map((item) => {
              const itemId = item._id || item.id;
              return (
                <article className="team-page__mobile-card" key={itemId}>
                  <div className="team-page__mobile-card-top">
                    <div className="team-page__mobile-image">
                      {item.profilePic ? (
                        <img src={item.profilePic} alt={item.name} />
                      ) : (
                        <FaUser />
                      )}
                    </div>
                    <div className="team-page__mobile-title">
                      <h3>{item.name}</h3>
                      <span>{item.designation}</span>
                    </div>
                  </div>

                  <div className="team-page__mobile-details">
                    <div>
                      <span>
                        <FaPhone /> Phone
                      </span>
                      <strong>{item.phone}</strong>
                    </div>
                    <div>
                      <span>
                        <FaEnvelope /> Email
                      </span>
                      <strong>{item.email}</strong>
                    </div>
                  </div>

                  <div className="team-page__mobile-bottom">
                    <span
                      className={`team-page__status team-page__status--${(
                        item.status || "Active"
                      ).toLowerCase()}`}
                    >
                      {item.status === "Active" ? (
                        <FaCheckCircle />
                      ) : (
                        <FaTimesCircle />
                      )}
                      {item.status || "Active"}
                    </span>

                    <div className="team-page__actions">
                      <button
                        type="button"
                        className="team-page__action-btn team-page__action-btn--view"
                        onClick={() => setViewModal(item)}
                      >
                        <FaEye />
                      </button>
                      {item.profilePic && (
                        <button
                          type="button"
                          className="team-page__action-btn team-page__action-btn--image"
                          onClick={() => setImageModal(item)}
                        >
                          <FaImage />
                        </button>
                      )}
                      <button
                        type="button"
                        className="team-page__action-btn team-page__action-btn--edit"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        className="team-page__action-btn team-page__action-btn--delete"
                        onClick={() => setDeleteModal(item)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="team-page__mobile-empty">
              <FaUser />
              <h3>No Members Found</h3>
              <p>Try changing your search or filters.</p>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {!loading && filteredMembers.length > 0 && (
          <div className="team-page__pagination">
            <div className="team-page__pagination-info">
              Showing{" "}
              <strong>{(safePage - 1) * itemsPerPage + 1}</strong> to{" "}
              <strong>
                {Math.min(safePage * itemsPerPage, filteredMembers.length)}
              </strong>{" "}
              of <strong>{filteredMembers.length}</strong>
            </div>

            <div className="team-page__pagination-buttons">
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
                    safePage === page ? "team-page__pagination-active" : ""
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

      {/* VIEW MODAL */}
      {viewModal && (
        <div
          className="team-page__modal-overlay"
          onClick={() => setViewModal(null)}
        >
          <div
            className="team-page__modal team-page__view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="team-page__modal-header">
              <div>
                <span>STAFF PROFILE DETAILS</span>
                <h3>{viewModal.name}</h3>
              </div>
              <button type="button" onClick={() => setViewModal(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="team-page__view-body">
              <div className="team-page__view-avatar">
                {viewModal.profilePic ? (
                  <img src={viewModal.profilePic} alt={viewModal.name} />
                ) : (
                  <FaUser />
                )}
              </div>
              <div className="team-page__view-info-grid">
                <div>
                  <span>Designation</span>
                  <strong>{viewModal.designation}</strong>
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
                  <span>Account Status</span>
                  <strong>{viewModal.status || "Active"}</strong>
                </div>
              </div>

              {(viewModal.facebook ||
                viewModal.instagram ||
                viewModal.twitter ||
                viewModal.linkedin) && (
                <div className="team-page__view-socials">
                  <h4>Social Profiles</h4>
                  <div className="team-page__social-badges">
                    {viewModal.facebook && (
                      <a href={viewModal.facebook} target="_blank" rel="noreferrer">
                        <FaFacebook /> Facebook
                      </a>
                    )}
                    {viewModal.instagram && (
                      <a href={viewModal.instagram} target="_blank" rel="noreferrer">
                        <FaInstagram /> Instagram
                      </a>
                    )}
                    {viewModal.twitter && (
                      <a href={viewModal.twitter} target="_blank" rel="noreferrer">
                        <FaTwitter /> Twitter
                      </a>
                    )}
                    {viewModal.linkedin && (
                      <a href={viewModal.linkedin} target="_blank" rel="noreferrer">
                        <FaLinkedin /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="team-page__modal-footer">
              <button type="button" onClick={() => setViewModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE MODAL */}
      {imageModal && (
        <div
          className="team-page__modal-overlay"
          onClick={() => setImageModal(null)}
        >
          <div
            className="team-page__modal team-page__image-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="team-page__modal-header">
              <div>
                <span>PROFILE PHOTO</span>
                <h3>{imageModal.name}</h3>
              </div>
              <button type="button" onClick={() => setImageModal(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="team-page__large-image">
              <img src={imageModal.profilePic} alt={imageModal.name} />
            </div>
            <div className="team-page__modal-footer">
              <button type="button" onClick={() => setImageModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div
          className="team-page__modal-overlay"
          onClick={() => setDeleteModal(null)}
        >
          <div
            className="team-page__modal team-page__delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="team-page__delete-icon">
              <FaTrash />
            </div>
            <h3>Delete Team Member?</h3>
            <p>
              Are you sure you want to remove <strong>{deleteModal.name}</strong> from the team directory? This action cannot be undone.
            </p>
            <div className="team-page__delete-actions">
              <button
                type="button"
                className="team-page__delete-cancel"
                onClick={() => setDeleteModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="team-page__delete-confirm"
                onClick={confirmDelete}
              >
                <FaTrash /> Delete Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;