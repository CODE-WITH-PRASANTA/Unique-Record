import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaImages,
  FaImage,
  FaInstagram,
  FaFacebook,
  FaUpload,
  FaTimes,
  FaUndo,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaTrash,
  FaEye,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
} from "react-icons/fa";
import "./Gallery.css";

const STORAGE_KEY = "admin_event_gallery_data";

const INITIAL_GALLERY = [
  {
    id: 1,
    photoUrl: "",
    instagram: "https://instagram.com/p/sample1",
    facebook: "https://facebook.com/photo/sample1",
    createdAt: "2026-09-20",
  },
  {
    id: 2,
    photoUrl: "",
    instagram: "https://instagram.com/p/sample2",
    facebook: "",
    createdAt: "2026-09-22",
  },
];

const emptyForm = {
  photoUrl: "",
  instagram: "",
  facebook: "",
};

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_GALLERY;
    } catch {
      return INITIAL_GALLERY;
    }
  });

  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [message, setMessage] = useState({ show: false, type: "", text: "" });
  const [imageModal, setImageModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const formRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(galleryItems));
  }, [galleryItems]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const showMessage = (text, type = "success") => {
    setMessage({ show: true, type, text });
    window.clearTimeout(window.__galleryToast);
    window.__galleryToast = window.setTimeout(() => {
      setMessage({ show: false, type: "", text: "" });
    }, 3000);
  };

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

    if (file.size > 5 * 1024 * 1024) {
      showMessage("Image size should be less than 5MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setImagePreview(result);
      setFormData((prev) => ({ ...prev, photoUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview("");
    setFormData((prev) => ({ ...prev, photoUrl: "" }));
    const fileInput = document.getElementById("gallery-photo-upload");
    if (fileInput) fileInput.value = "";
  };

  const validateForm = () => {
    if (!formData.photoUrl) {
      showMessage("Please upload a gallery photo.", "error");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setImagePreview("");
    const fileInput = document.getElementById("gallery-photo-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingId) {
      setGalleryItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...formData, id: editingId, createdAt: item.createdAt }
            : item
        )
      );
      showMessage("Gallery item updated successfully.");
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString().split("T")[0],
      };
      setGalleryItems((prev) => [newItem, ...prev]);
      showMessage("Gallery photo uploaded successfully.");
    }

    resetForm();
    setTimeout(() => {
      document.getElementById("gallery-list-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      photoUrl: item.photoUrl || "",
      instagram: item.instagram || "",
      facebook: item.facebook || "",
    });
    setImagePreview(item.photoUrl || "");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const confirmDelete = () => {
    if (!deleteModal) return;
    setGalleryItems((prev) => prev.filter((item) => item.id !== deleteModal.id));
    if (editingId === deleteModal.id) resetForm();
    showMessage("Gallery item deleted successfully.");
    setDeleteModal(null);
  };

  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const search = searchTerm.toLowerCase().trim();
      return (
        !search ||
        item.instagram?.toLowerCase().includes(search) ||
        item.facebook?.toLowerCase().includes(search) ||
        item.createdAt?.toLowerCase().includes(search)
      );
    });
  }, [galleryItems, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredItems.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="gallery-page">
      {message.show && (
        <div className={`gallery-page__toast gallery-page__toast--${message.type}`}>
          <div className="gallery-page__toast-icon">
            {message.type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
          </div>
          <div className="gallery-page__toast-content">
            <strong>{message.type === "success" ? "Success" : "Attention"}</strong>
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            className="gallery-page__toast-close"
            onClick={() => setMessage({ show: false, type: "", text: "" })}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* TOP FORM SECTION */}
      <section className="gallery-page__form-section" ref={formRef} id="gallery-form-section">
        <div className="gallery-page__section-header">
          <h2>Event's Gallery</h2>
          {editingId && (
            <div className="gallery-page__editing-badge">
              <FaEdit /> Editing Gallery Item
            </div>
          )}
        </div>

        <form className="gallery-page__form" onSubmit={handleSubmit}>
          {/* UPLOAD PHOTO FIELD */}
          <div className="gallery-page__field">
            <label htmlFor="gallery-photo-upload">Upload Photo:</label>
            <div className="gallery-page__file-input-wrapper">
              <input
                id="gallery-photo-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                onChange={handleImageChange}
              />
              <label htmlFor="gallery-photo-upload" className="gallery-page__choose-file-btn">
                Choose File
              </label>
              <span className="gallery-page__file-name-display">
                {imagePreview ? "Photo loaded successfully" : "No file chosen"}
              </span>
            </div>

            {imagePreview && (
              <div className="gallery-page__image-preview">
                <div className="gallery-page__image-preview-thumb">
                  <img src={imagePreview} alt="Gallery upload preview" />
                </div>
                <div className="gallery-page__image-preview-info">
                  <strong>Preview Ready</strong>
                  <span>This photo will be added to the gallery.</span>
                </div>
                <button
                  type="button"
                  className="gallery-page__remove-image-btn"
                  onClick={removeImage}
                >
                  <FaTimes /> Remove
                </button>
              </div>
            )}
          </div>

          {/* INSTAGRAM LINK FIELD */}
          <div className="gallery-page__field">
            <label htmlFor="gallery-instagram">Instagram Link:</label>
            <div className="gallery-page__input-wrap">
              <input
                id="gallery-instagram"
                name="instagram"
                type="url"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="Enter Instagram URL"
              />
            </div>
          </div>

          {/* FACEBOOK LINK FIELD */}
          <div className="gallery-page__field">
            <label htmlFor="gallery-facebook">Facebook Link:</label>
            <div className="gallery-page__input-wrap">
              <input
                id="gallery-facebook"
                name="facebook"
                type="url"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="Enter Facebook URL"
              />
            </div>
          </div>

          {/* FORM ACTIONS */}
          <div className="gallery-page__form-actions">
            {editingId && (
              <button
                type="button"
                className="gallery-page__reset-btn"
                onClick={resetForm}
              >
                <FaUndo /> Cancel Edit
              </button>
            )}
            <button type="submit" className="gallery-page__submit-btn">
              {editingId ? "Update Gallery" : "Submit"}
            </button>
          </div>
        </form>
      </section>

      {/* GALLERY LIST / DIRECTORY SECTION */}
      <section className="gallery-page__list-section" id="gallery-list-section">
        <div className="gallery-page__list-header">
          <div className="gallery-page__section-heading-left">
            <div className="gallery-page__section-icon">
              <FaImages />
            </div>
            <div>
              <span>MEDIA DIRECTORY</span>
              <h2>Uploaded Gallery Photos</h2>
              <p>Manage, view, and organize your event photo records.</p>
            </div>
          </div>

          <div className="gallery-page__result-count">
            <strong>{filteredItems.length}</strong>
            <span>Photos Stored</span>
          </div>
        </div>

        {/* SEARCH FILTER */}
        <div className="gallery-page__filters">
          <div className="gallery-page__search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by social links or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm("")}>
                <FaTimes />
              </button>
            )}
          </div>

          <button
            type="button"
            className="gallery-page__clear-filter"
            onClick={() => setSearchTerm("")}
          >
            <FaUndo /> Reset Search
          </button>
        </div>

        {/* DESKTOP TABLE */}
        <div className="gallery-page__table-wrapper">
          <table className="gallery-page__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Photo Preview</th>
                <th>Instagram Link</th>
                <th>Facebook Link</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <span className="gallery-page__serial">
                        {(safePage - 1) * itemsPerPage + index + 1}
                      </span>
                    </td>
                    <td>
                      <div className="gallery-page__thumb-cell">
                        <div
                          className="gallery-page__table-thumb"
                          onClick={() => setImageModal(item)}
                          title="Click to zoom"
                        >
                          {item.photoUrl ? (
                            <img src={item.photoUrl} alt="Gallery item" />
                          ) : (
                            <FaImage />
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      {item.instagram ? (
                        <a
                          href={item.instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="gallery-page__social-link"
                        >
                          <FaInstagram /> View Instagram <FaExternalLinkAlt size={10} />
                        </a>
                      ) : (
                        <span className="gallery-page__text-muted">Not provided</span>
                      )}
                    </td>
                    <td>
                      {item.facebook ? (
                        <a
                          href={item.facebook}
                          target="_blank"
                          rel="noreferrer"
                          className="gallery-page__social-link"
                        >
                          <FaFacebook /> View Facebook <FaExternalLinkAlt size={10} />
                        </a>
                      ) : (
                        <span className="gallery-page__text-muted">Not provided</span>
                      )}
                    </td>
                    <td>
                      <span className="gallery-page__date-text">{item.createdAt}</span>
                    </td>
                    <td>
                      <div className="gallery-page__actions">
                        <button
                          type="button"
                          className="gallery-page__action-btn gallery-page__action-btn--image"
                          title="View Full Photo"
                          onClick={() => setImageModal(item)}
                        >
                          <FaEye />
                        </button>
                        <button
                          type="button"
                          className="gallery-page__action-btn gallery-page__action-btn--edit"
                          title="Edit Item"
                          onClick={() => handleEdit(item)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          className="gallery-page__action-btn gallery-page__action-btn--delete"
                          title="Delete Item"
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
                  <td colSpan="6" className="gallery-page__empty-cell">
                    <div className="gallery-page__empty">
                      <div className="gallery-page__empty-icon">
                        <FaImages />
                      </div>
                      <h3>No Gallery Photos Found</h3>
                      <p>No records match your search criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="gallery-page__mobile-list">
          {paginatedItems.length > 0 ? (
            paginatedItems.map((item) => (
              <article className="gallery-page__mobile-card" key={item.id}>
                <div className="gallery-page__mobile-card-top">
                  <div
                    className="gallery-page__mobile-image"
                    onClick={() => setImageModal(item)}
                  >
                    {item.photoUrl ? (
                      <img src={item.photoUrl} alt="Gallery item" />
                    ) : (
                      <FaImage />
                    )}
                  </div>
                  <div className="gallery-page__mobile-title">
                    <span>Uploaded on</span>
                    <strong>{item.createdAt}</strong>
                  </div>
                </div>

                <div className="gallery-page__mobile-details">
                  {item.instagram && (
                    <div>
                      <span>Instagram</span>
                      <a href={item.instagram} target="_blank" rel="noreferrer">
                        Open Link <FaExternalLinkAlt size={9} />
                      </a>
                    </div>
                  )}
                  {item.facebook && (
                    <div>
                      <span>Facebook</span>
                      <a href={item.facebook} target="_blank" rel="noreferrer">
                        Open Link <FaExternalLinkAlt size={9} />
                      </a>
                    </div>
                  )}
                </div>

                <div className="gallery-page__mobile-bottom">
                  <div className="gallery-page__actions">
                    <button
                      type="button"
                      className="gallery-page__action-btn gallery-page__action-btn--image"
                      onClick={() => setImageModal(item)}
                    >
                      <FaEye />
                    </button>
                    <button
                      type="button"
                      className="gallery-page__action-btn gallery-page__action-btn--edit"
                      onClick={() => handleEdit(item)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      className="gallery-page__action-btn gallery-page__action-btn--delete"
                      onClick={() => setDeleteModal(item)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="gallery-page__mobile-empty">
              <FaImages />
              <h3>No Photos Found</h3>
              <p>Try changing your search keywords.</p>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {filteredItems.length > 0 && (
          <div className="gallery-page__pagination">
            <div className="gallery-page__pagination-info">
              Showing{" "}
              <strong>{(safePage - 1) * itemsPerPage + 1}</strong> to{" "}
              <strong>
                {Math.min(safePage * itemsPerPage, filteredItems.length)}
              </strong>{" "}
              of <strong>{filteredItems.length}</strong> photos
            </div>

            <div className="gallery-page__pagination-buttons">
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
                    safePage === page ? "gallery-page__pagination-active" : ""
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

      {/* FULL IMAGE MODAL */}
      {imageModal && (
        <div
          className="gallery-page__modal-overlay"
          onClick={() => setImageModal(null)}
        >
          <div
            className="gallery-page__modal gallery-page__image-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gallery-page__modal-header">
              <div>
                <span>GALLERY PREVIEW</span>
                <h3>Photo Record</h3>
              </div>
              <button type="button" onClick={() => setImageModal(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="gallery-page__large-image">
              <img src={imageModal.photoUrl} alt="Gallery full view" />
            </div>
            <div className="gallery-page__modal-footer">
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
          className="gallery-page__modal-overlay"
          onClick={() => setDeleteModal(null)}
        >
          <div
            className="gallery-page__modal gallery-page__delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gallery-page__delete-icon">
              <FaTrash />
            </div>
            <h3>Delete Gallery Photo?</h3>
            <p>
              Are you sure you want to remove this photo from the event gallery? This action cannot be undone.
            </p>
            <div className="gallery-page__delete-actions">
              <button
                type="button"
                className="gallery-page__delete-cancel"
                onClick={() => setDeleteModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="gallery-page__delete-confirm"
                onClick={confirmDelete}
              >
                <FaTrash /> Delete Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;