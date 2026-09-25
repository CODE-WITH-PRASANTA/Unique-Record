import React, { useEffect, useMemo, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaImage,
  FaFileAlt,
  FaUserTie,
  FaCalendarCheck,
  FaCalendarTimes,
  FaListAlt,
  FaMoneyBillWave,
  FaTags,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaTimes,
  FaUndo,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUpload,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "./Event.css";

const STORAGE_KEY = "admin_events_data";
const TINYMCE_API_KEY = "your-tinymce-api-key-here"; // Replace with your actual TinyMCE API key

const DEFAULT_CATEGORIES = [
  "Top Category",
  "Academic",
  "Cultural",
  "Sports",
  "Workshop",
  "Seminar",
  "Competition",
  "Annual Function",
];

const INITIAL_EVENTS = [
  {
    id: 1,
    eventName: "Annual Sports Day",
    location: "School Main Ground",
    locationImage: "",
    eventDate: "2026-10-15",
    description:
      "<p>Annual Sports Day is organized to encourage students to participate in various sports and physical activities.</p>",
    organizer: "School Administration",
    openingDate: "2026-10-10",
    closingDate: "2026-10-15",
    status: "Ongoing",
    registrationFee: "500",
    category: "Sports",
    createdAt: "2026-09-20",
  },
  {
    id: 2,
    eventName: "Science Exhibition",
    location: "School Auditorium",
    locationImage: "",
    eventDate: "2026-11-05",
    description:
      "<p>Students will present innovative science projects and working models during the science exhibition.</p>",
    organizer: "Science Department",
    openingDate: "2026-10-25",
    closingDate: "2026-11-05",
    status: "Upcoming",
    registrationFee: "300",
    category: "Academic",
    createdAt: "2026-09-21",
  },
  {
    id: 3,
    eventName: "Cultural Fest 2026",
    location: "City Convention Hall",
    locationImage: "",
    eventDate: "2026-12-20",
    description:
      "<p>A grand cultural celebration featuring music, dance, drama and other creative performances.</p>",
    organizer: "Cultural Committee",
    openingDate: "2026-12-01",
    closingDate: "2026-12-20",
    status: "Upcoming",
    registrationFee: "750",
    category: "Cultural",
    createdAt: "2026-09-22",
  },
];

const emptyForm = {
  eventName: "",
  location: "",
  locationImage: "",
  eventDate: "",
  description: "",
  organizer: "",
  openingDate: "",
  closingDate: "",
  status: "Ongoing",
  registrationFee: "",
  category: "Top Category",
};

const formatDate = (date) => {
  if (!date) return "-";
  const value = new Date(`${date}T00:00:00`);
  if (Number.isNaN(value.getTime())) return date;
  return value.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusIcon = (status) => {
  if (status === "Completed") return <FaCheckCircle />;
  if (status === "Cancelled") return <FaTimesCircle />;
  return <FaClock />;
};

const Event = () => {
  const [events, setEvents] = useState(() => {
    try {
      const savedEvents = localStorage.getItem(STORAGE_KEY);
      return savedEvents ? JSON.parse(savedEvents) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState({
    show: false,
    type: "",
    text: "",
  });

  const [descriptionModal, setDescriptionModal] = useState(null);
  const [imageModal, setImageModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const formRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter]);

  const showMessage = (text, type = "success") => {
    setMessage({
      show: true,
      type,
      text,
    });

    window.clearTimeout(window.__eventToast);

    window.__eventToast = window.setTimeout(() => {
      setMessage({
        show: false,
        type: "",
        text: "",
      });
    }, 3000);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage("Please select a valid image file.", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage("Image size should be less than 5MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const image = reader.result;
      setImagePreview(image);
      setFormData((previous) => ({
        ...previous,
        locationImage: image,
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview("");
    setFormData((previous) => ({
      ...previous,
      locationImage: "",
    }));
  };

  const validateForm = () => {
    if (!formData.eventName.trim()) {
      showMessage("Please enter event name.", "error");
      return false;
    }
    if (!formData.location.trim()) {
      showMessage("Please enter event location.", "error");
      return false;
    }
    if (!formData.eventDate) {
      showMessage("Please select event date.", "error");
      return false;
    }
    if (!formData.description.trim()) {
      showMessage("Please enter event description.", "error");
      return false;
    }
    if (!formData.organizer.trim()) {
      showMessage("Please enter event organizer.", "error");
      return false;
    }
    if (!formData.openingDate) {
      showMessage("Please select opening date.", "error");
      return false;
    }
    if (!formData.closingDate) {
      showMessage("Please select closing date.", "error");
      return false;
    }
    if (formData.closingDate < formData.openingDate) {
      showMessage("Closing date cannot be earlier than opening date.", "error");
      return false;
    }
    if (!formData.registrationFee) {
      showMessage("Please enter registration fee.", "error");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setImagePreview("");
    const fileInput = document.getElementById("event-location-image");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    if (editingId) {
      setEvents((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? { ...formData, id: editingId, createdAt: item.createdAt }
            : item
        )
      );
      showMessage("Event updated successfully.");
    } else {
      const newEvent = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString().split("T")[0],
      };
      setEvents((previous) => [newEvent, ...previous]);
      showMessage("New event added successfully.");
    }

    resetForm();
    setTimeout(() => {
      document.getElementById("event-list-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleEdit = (eventItem) => {
    setEditingId(eventItem.id);
    setFormData({
      eventName: eventItem.eventName || "",
      location: eventItem.location || "",
      locationImage: eventItem.locationImage || "",
      eventDate: eventItem.eventDate || "",
      description: eventItem.description || "",
      organizer: eventItem.organizer || "",
      openingDate: eventItem.openingDate || "",
      closingDate: eventItem.closingDate || "",
      status: eventItem.status || "Ongoing",
      registrationFee: eventItem.registrationFee || "",
      category: eventItem.category || "Top Category",
    });
    setImagePreview(eventItem.locationImage || "");
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const confirmDelete = () => {
    if (!deleteModal) return;
    setEvents((previous) => previous.filter((item) => item.id !== deleteModal.id));
    if (editingId === deleteModal.id) resetForm();
    showMessage("Event deleted successfully.");
    setDeleteModal(null);
  };

  const filteredEvents = useMemo(() => {
    return events.filter((item) => {
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        item.eventName?.toLowerCase().includes(search) ||
        item.location?.toLowerCase().includes(search) ||
        item.organizer?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search);

      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [events, searchTerm, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedEvents = filteredEvents.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const stats = {
    total: events.length,
    ongoing: events.filter((item) => item.status === "Ongoing").length,
    upcoming: events.filter((item) => item.status === "Upcoming").length,
    completed: events.filter((item) => item.status === "Completed").length,
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="event-page">
      {message.show && (
        <div className={`event-page__toast event-page__toast--${message.type}`}>
          <div className="event-page__toast-icon">
            {message.type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
          </div>
          <div className="event-page__toast-content">
            <strong>{message.type === "success" ? "Success" : "Attention"}</strong>
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            className="event-page__toast-close"
            onClick={() => setMessage({ show: false, type: "", text: "" })}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* STATISTICS */}
      <section className="event-page__stats-section">
        <div className="event-page__stats-grid">
          <div className="event-page__stat-card event-page__stat-card--total">
            <div className="event-page__stat-icon">
              <FaCalendarAlt />
            </div>
            <div className="event-page__stat-content">
              <span>Total Events</span>
              <strong>{stats.total}</strong>
            </div>
          </div>
          <div className="event-page__stat-card event-page__stat-card--ongoing">
            <div className="event-page__stat-icon">
              <FaClock />
            </div>
            <div className="event-page__stat-content">
              <span>Ongoing</span>
              <strong>{stats.ongoing}</strong>
            </div>
          </div>
          <div className="event-page__stat-card event-page__stat-card--upcoming">
            <div className="event-page__stat-icon">
              <FaCalendarCheck />
            </div>
            <div className="event-page__stat-content">
              <span>Upcoming</span>
              <strong>{stats.upcoming}</strong>
            </div>
          </div>
          <div className="event-page__stat-card event-page__stat-card--completed">
            <div className="event-page__stat-icon">
              <FaCheckCircle />
            </div>
            <div className="event-page__stat-content">
              <span>Completed</span>
              <strong>{stats.completed}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="event-page__form-section" ref={formRef} id="event-form-section">
        <div className="event-page__section-heading">
          <div className="event-page__section-heading-left">
            <div className="event-page__section-icon">
              {editingId ? <FaEdit /> : <FaPlus />}
            </div>
            <div>
              <span>{editingId ? "UPDATE EVENT" : "EVENT INFORMATION"}</span>
              <h2>{editingId ? "Edit Event" : "Add New Event"}</h2>
            </div>
          </div>
          {editingId && (
            <div className="event-page__editing-badge">
              <FaEdit /> Editing Event
            </div>
          )}
        </div>

        <form className="event-page__form" onSubmit={handleSubmit}>
          <div className="event-page__form-card event-page__form-card--basic">
            <div className="event-page__card-title">
              <span className="event-page__card-title-icon">
                <FaCalendarAlt />
              </span>
              <div>
                <h3>Basic Information</h3>
                <p>Enter the primary details of your event.</p>
              </div>
            </div>

            <div className="event-page__form-grid event-page__form-grid--two">
              <div className="event-page__field">
                <label htmlFor="event-name">
                  <FaCalendarAlt /> Event Name <span>*</span>
                </label>
                <div className="event-page__input-wrap">
                  <input
                    id="event-name"
                    name="eventName"
                    type="text"
                    value={formData.eventName}
                    onChange={handleChange}
                    placeholder="Enter event name"
                  />
                </div>
              </div>

              <div className="event-page__field">
                <label htmlFor="event-location">
                  <FaMapMarkerAlt /> Event Location <span>*</span>
                </label>
                <div className="event-page__input-wrap">
                  <input
                    id="event-location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter event location"
                  />
                </div>
              </div>
            </div>

            <div className="event-page__field event-page__field--full">
              <label htmlFor="event-location-image">
                <FaImage /> Upload Location Image
              </label>
              <div className="event-page__upload-box">
                <input
                  id="event-location-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleImageChange}
                />
                <div className="event-page__upload-content">
                  <div className="event-page__upload-icon">
                    <FaUpload />
                  </div>
                  <div>
                    <strong>Upload Event Image</strong>
                    <span>PNG, JPG or WEBP · Maximum 5MB</span>
                  </div>
                  <label htmlFor="event-location-image" className="event-page__upload-btn">
                    Choose Image
                  </label>
                </div>
              </div>

              {imagePreview && (
                <div className="event-page__image-preview">
                  <div className="event-page__image-preview-image">
                    <img src={imagePreview} alt="Event location preview" />
                  </div>
                  <div className="event-page__image-preview-info">
                    <strong>Image Preview</strong>
                    <span>This image will be shown with the event.</span>
                  </div>
                  <button
                    type="button"
                    className="event-page__remove-image"
                    onClick={removeImage}
                  >
                    <FaTimes /> Remove
                  </button>
                </div>
              )}
            </div>

            <div className="event-page__field event-page__field--full">
              <label htmlFor="event-date">
                <FaCalendarAlt /> Event Date <span>*</span>
              </label>
              <div className="event-page__input-wrap event-page__date-wrap">
                <input
                  id="event-date"
                  name="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="event-page__form-card event-page__form-card--editor">
            <div className="event-page__card-title">
              <span className="event-page__card-title-icon">
                <FaFileAlt />
              </span>
              <div>
                <h3>Event Description</h3>
                <p>Add detailed information using the rich text editor.</p>
              </div>
            </div>

            <div className="event-page__editor-wrapper">
              <Editor
                apiKey="jeq7g2k84sqpi9364o8x9ptqf09aoesaq8jxmp49dl4sh57z"
                value={formData.description}
                onEditorChange={(content) =>
                  setFormData((previous) => ({
                    ...previous,
                    description: content,
                  }))
                }
                init={{
                  height: 400,
                  menubar: true,
                  branding: false,
                  resize: false,
                  statusbar: true,
                  plugins:
                    "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | removeformat fullscreen",
                  content_style:
                    "body { font-family: Inter, Arial, sans-serif; font-size: 15px; color: #334155; line-height: 1.7; padding: 12px; }",
                  placeholder: "Write a detailed description about the event...",
                }}
              />
            </div>
          </div>

          <div className="event-page__form-card event-page__form-card--details">
            <div className="event-page__card-title">
              <span className="event-page__card-title-icon">
                <FaUserTie />
              </span>
              <div>
                <h3>Event Details</h3>
                <p>Configure organizer, dates and registration.</p>
              </div>
            </div>

            <div className="event-page__form-grid event-page__form-grid--two">
              <div className="event-page__field event-page__field--full-two">
                <label htmlFor="event-organizer">
                  <FaUserTie /> Event Organizer <span>*</span>
                </label>
                <div className="event-page__input-wrap">
                  <input
                    id="event-organizer"
                    name="organizer"
                    type="text"
                    value={formData.organizer}
                    onChange={handleChange}
                    placeholder="Enter event organizer"
                  />
                </div>
              </div>

              <div className="event-page__field">
                <label htmlFor="opening-date">
                  <FaCalendarCheck /> Opening Date <span>*</span>
                </label>
                <div className="event-page__input-wrap event-page__date-wrap">
                  <input
                    id="opening-date"
                    name="openingDate"
                    type="date"
                    value={formData.openingDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="event-page__field">
                <label htmlFor="closing-date">
                  <FaCalendarTimes /> Closing Date <span>*</span>
                </label>
                <div className="event-page__input-wrap event-page__date-wrap">
                  <input
                    id="closing-date"
                    name="closingDate"
                    type="date"
                    value={formData.closingDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="event-page__field">
                <label htmlFor="event-status">
                  <FaListAlt /> Current Status
                </label>
                <div className="event-page__select-wrap">
                  <select
                    id="event-status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="event-page__field">
                <label htmlFor="registration-fee">
                  <FaMoneyBillWave /> Registration Fee <span>*</span>
                </label>
                <div className="event-page__input-prefix">
                  <span>₹</span>
                  <input
                    id="registration-fee"
                    name="registrationFee"
                    type="number"
                    min="0"
                    value={formData.registrationFee}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="event-page__field event-page__field--full-two">
                <label htmlFor="event-category">
                  <FaTags /> Choose Category
                </label>
                <div className="event-page__select-wrap">
                  <select
                    id="event-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {DEFAULT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="event-page__form-actions">
            <button type="button" className="event-page__reset-btn" onClick={resetForm}>
              <FaUndo /> {editingId ? "Cancel Edit" : "Reset Form"}
            </button>
            <button type="submit" className="event-page__submit-btn">
              {editingId ? <FaEdit /> : <FaPlus />}
              {editingId ? "Update Event" : "Add Event"}
            </button>
          </div>
        </form>
      </section>

      {/* EVENT LIST */}
      <section className="event-page__list-section" id="event-list-section">
        <div className="event-page__list-header">
          <div className="event-page__section-heading-left">
            <div className="event-page__section-icon">
              <FaListAlt />
            </div>
            <div>
              <span>EVENT DIRECTORY</span>
              <h2>All Events</h2>
              <p>Manage, search and update your published events.</p>
            </div>
          </div>

          <div className="event-page__result-count">
            <strong>{filteredEvents.length}</strong>
            <span>Events Found</span>
          </div>
        </div>

        <div className="event-page__filters">
          <div className="event-page__search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search event, location, organizer..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm("")}>
                <FaTimes />
              </button>
            )}
          </div>

          <div className="event-page__filter-select">
            <FaFilter />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="event-page__filter-select">
            <FaTags />
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="All">All Categories</option>
              {DEFAULT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="event-page__clear-filter"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("All");
              setCategoryFilter("All");
            }}
          >
            <FaUndo /> Clear
          </button>
        </div>

        <div className="event-page__table-wrapper">
          <table className="event-page__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Event</th>
                <th>Location</th>
                <th>Event Date</th>
                <th>Organizer</th>
                <th>Category</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEvents.length > 0 ? (
                paginatedEvents.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <span className="event-page__serial">
                        {(safePage - 1) * itemsPerPage + index + 1}
                      </span>
                    </td>
                    <td>
                      <div className="event-page__event-cell">
                        <div className={`event-page__event-thumb ${item.locationImage ? "event-page__event-thumb--image" : ""}`}>
                          {item.locationImage ? (
                            <img src={item.locationImage} alt={item.eventName} />
                          ) : (
                            <FaCalendarAlt />
                          )}
                        </div>
                        <div className="event-page__event-info">
                          <strong>{item.eventName}</strong>
                          <span>Created {formatDate(item.createdAt)}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="event-page__location-cell">
                        <FaMapMarkerAlt />
                        <span>{item.location}</span>
                      </div>
                    </td>
                    <td>
                      <span className="event-page__date-text">{formatDate(item.eventDate)}</span>
                    </td>
                    <td>
                      <span className="event-page__organizer-text">{item.organizer}</span>
                    </td>
                    <td>
                      <span className="event-page__category-badge">{item.category}</span>
                    </td>
                    <td>
                      <strong className="event-page__fee">
                        ₹{Number(item.registrationFee || 0).toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      <span className={`event-page__status event-page__status--${item.status.toLowerCase()}`}>
                        {getStatusIcon(item.status)}
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="event-page__actions">
                        <button
                          type="button"
                          className="event-page__action-btn event-page__action-btn--view"
                          title="View Description"
                          onClick={() => setDescriptionModal(item)}
                        >
                          <FaEye />
                        </button>
                        {item.locationImage && (
                          <button
                            type="button"
                            className="event-page__action-btn event-page__action-btn--image"
                            title="View Image"
                            onClick={() => setImageModal(item)}
                          >
                            <FaImage />
                          </button>
                        )}
                        <button
                          type="button"
                          className="event-page__action-btn event-page__action-btn--edit"
                          title="Edit Event"
                          onClick={() => handleEdit(item)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          className="event-page__action-btn event-page__action-btn--delete"
                          title="Delete Event"
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
                  <td colSpan="9" className="event-page__empty-cell">
                    <div className="event-page__empty">
                      <div className="event-page__empty-icon">
                        <FaCalendarAlt />
                      </div>
                      <h3>No Events Found</h3>
                      <p>No events match your current search or filter.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("All");
                          setCategoryFilter("All");
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="event-page__mobile-list">
          {paginatedEvents.length > 0 ? (
            paginatedEvents.map((item) => (
              <article className="event-page__mobile-card" key={item.id}>
                <div className="event-page__mobile-card-top">
                  <div className={`event-page__mobile-image ${item.locationImage ? "event-page__mobile-image--has-image" : ""}`}>
                    {item.locationImage ? (
                      <img src={item.locationImage} alt={item.eventName} />
                    ) : (
                      <FaCalendarAlt />
                    )}
                  </div>
                  <div className="event-page__mobile-title">
                    <h3>{item.eventName}</h3>
                    <span className="event-page__category-badge">{item.category}</span>
                  </div>
                </div>

                <div className="event-page__mobile-details">
                  <div>
                    <span><FaMapMarkerAlt /> Location</span>
                    <strong>{item.location}</strong>
                  </div>
                  <div>
                    <span><FaCalendarAlt /> Event Date</span>
                    <strong>{formatDate(item.eventDate)}</strong>
                  </div>
                  <div>
                    <span><FaUserTie /> Organizer</span>
                    <strong>{item.organizer}</strong>
                  </div>
                  <div>
                    <span><FaMoneyBillWave /> Fee</span>
                    <strong>₹{Number(item.registrationFee || 0).toLocaleString()}</strong>
                  </div>
                </div>

                <div className="event-page__mobile-bottom">
                  <span className={`event-page__status event-page__status--${item.status.toLowerCase()}`}>
                    {getStatusIcon(item.status)}
                    {item.status}
                  </span>
                  <div className="event-page__actions">
                    <button
                      type="button"
                      className="event-page__action-btn event-page__action-btn--view"
                      onClick={() => setDescriptionModal(item)}
                    >
                      <FaEye />
                    </button>
                    {item.locationImage && (
                      <button
                        type="button"
                        className="event-page__action-btn event-page__action-btn--image"
                        onClick={() => setImageModal(item)}
                      >
                        <FaImage />
                      </button>
                    )}
                    <button
                      type="button"
                      className="event-page__action-btn event-page__action-btn--edit"
                      onClick={() => handleEdit(item)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      className="event-page__action-btn event-page__action-btn--delete"
                      onClick={() => setDeleteModal(item)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="event-page__mobile-empty">
              <FaCalendarAlt />
              <h3>No Events Found</h3>
              <p>Try changing your search or filters.</p>
            </div>
          )}
        </div>

        {filteredEvents.length > 0 && (
          <div className="event-page__pagination">
            <div className="event-page__pagination-info">
              Showing{" "}
              <strong>{(safePage - 1) * itemsPerPage + 1}</strong> to{" "}
              <strong>
                {Math.min(safePage * itemsPerPage, filteredEvents.length)}
              </strong>{" "}
              of <strong>{filteredEvents.length}</strong>
            </div>

            <div className="event-page__pagination-buttons">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => goToPage(safePage - 1)}
              >
                <FaChevronLeft />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  type="button"
                  key={page}
                  className={safePage === page ? "event-page__pagination-active" : ""}
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

      {/* DESCRIPTION MODAL */}
      {descriptionModal && (
        <div className="event-page__modal-overlay" onClick={() => setDescriptionModal(null)}>
          <div className="event-page__modal event-page__description-modal" onClick={(event) => event.stopPropagation()}>
            <div className="event-page__modal-header">
              <div>
                <span>EVENT DESCRIPTION</span>
                <h3>{descriptionModal.eventName}</h3>
              </div>
              <button type="button" onClick={() => setDescriptionModal(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="event-page__description-meta">
              <span><FaMapMarkerAlt /> {descriptionModal.location}</span>
              <span><FaCalendarAlt /> {formatDate(descriptionModal.eventDate)}</span>
            </div>
            <div
              className="event-page__description-content"
              dangerouslySetInnerHTML={{ __html: descriptionModal.description }}
            />
            <div className="event-page__modal-footer">
              <button type="button" onClick={() => setDescriptionModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE MODAL */}
      {imageModal && (
        <div className="event-page__modal-overlay" onClick={() => setImageModal(null)}>
          <div className="event-page__modal event-page__image-modal" onClick={(event) => event.stopPropagation()}>
            <div className="event-page__modal-header">
              <div>
                <span>EVENT IMAGE</span>
                <h3>{imageModal.eventName}</h3>
              </div>
              <button type="button" onClick={() => setImageModal(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="event-page__large-image">
              <img src={imageModal.locationImage} alt={imageModal.eventName} />
            </div>
            <div className="event-page__modal-footer">
              <button type="button" onClick={() => setImageModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="event-page__modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="event-page__modal event-page__delete-modal" onClick={(event) => event.stopPropagation()}>
            <div className="event-page__delete-icon">
              <FaTrash />
            </div>
            <h3>Delete Event?</h3>
            <p>
              Are you sure you want to delete <strong>{deleteModal.eventName}</strong>? This action cannot be undone.
            </p>
            <div className="event-page__delete-actions">
              <button
                type="button"
                className="event-page__delete-cancel"
                onClick={() => setDeleteModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="event-page__delete-confirm"
                onClick={confirmDelete}
              >
                <FaTrash /> Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Event;