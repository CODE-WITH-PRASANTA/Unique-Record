import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../api/axiosInstance";
import { Editor } from "@tinymce/tinymce-react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiUpload,
  FiTag,
  FiFileText,
  FiUser,
  FiMail,
} from "react-icons/fi";
import "./Blog.css";

const Blog = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================================================
  // FORM STATE
  // =========================================================

  const [formData, setFormData] = useState({
    title: "",
    authorName: "",
    authorDesignation: "",
    shortDesc: "",
    quotes: "",
    content: "",
    category: "",
    email: "",
    address: "",
    image: null,
  });

  const [editingId, setEditingId] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [blogsList, setBlogsList] = useState([]);
  const [imagePreview, setImagePreview] = useState("");

  // =========================================================
  // FETCH BLOGS AND CATEGORIES FROM DATABASE
  // =========================================================

  const fetchBlogs = async () => {
    try {
      const res = await API.get("/blogs/all");
      if (res.data && res.data.success) {
        setBlogsList(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      if (res.data && res.data.success) {
        const catNames = res.data.data.map((c) => c.name);
        setCategories(catNames);
        if (catNames.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: catNames[0] }));
        }
      }
    } catch (err) {
      console.warn("Could not load categories:", err);
    }
  };

  const handleEditClick = (blog) => {
    setEditingId(blog._id || blog.id);

    setFormData({
      title: blog.title || "",
      authorName: blog.author || "",
      authorDesignation: blog.authorDesignation || "",
      shortDesc: blog.shortDesc || "",
      quotes: blog.quotes || "",
      content: blog.content || "",
      category: blog.category || "",
      email: blog.email || "",
      address: blog.address || "",
      image: null,
    });

    setTags(blog.tags || []);
    setImagePreview(blog.image || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();

    // If navigated with edit state
    if (location.state?.blog) {
      handleEditClick(location.state.blog);
    }
  }, [location.state]);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // TAG FUNCTIONS
  // =========================================================

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags((prev) => [...prev, newTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setFormData({
      title: "",
      authorName: "",
      authorDesignation: "",
      shortDesc: "",
      quotes: "",
      content: "",
      category: categories[0] || "",
      email: "",
      address: "",
      image: null,
    });

    setTags([]);
    setImagePreview("");
    setEditingId(null);
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a blog title!");
      return;
    }

    if (!formData.content || !formData.content.trim()) {
      alert("Please enter blog content!");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      author: formData.authorName.trim() || "Admin",
      category: formData.category || (categories[0] || "General"),
      authorDesignation: formData.authorDesignation.trim(),
      shortDesc: formData.shortDesc.trim(),
      quotes: formData.quotes.trim(),
      content: formData.content,
      email: formData.email.trim(),
      address: formData.address.trim(),
      tags: tags,
      image: imagePreview || "",
      status: "Published",
    };

    try {
      if (editingId) {
        // UPDATE IN DATABASE
        const res = await API.put(`/blogs/${editingId}`, payload);
        if (res.data && res.data.success) {
          alert("Blog updated successfully!");
          resetForm();
          fetchBlogs();
          navigate("/blogs/manage");
        } else {
          alert(res.data?.message || "Failed to update blog");
        }
      } else {
        // CREATE IN DATABASE
        const res = await API.post("/blogs", payload);
        if (res.data && res.data.success) {
          alert("Blog published successfully!");
          resetForm();
          fetchBlogs();
          navigate("/blogs/manage");
        } else {
          alert(res.data?.message || "Failed to create blog");
        }
      }
    } catch (err) {
      console.error("Error saving blog:", err);
      alert(err.response?.data?.message || "Error saving blog to database.");
    }
  };



  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) return;

    try {
      const res = await API.delete(`/blogs/${id}`);
      if (res.data && res.data.success) {
        setBlogsList((prev) => prev.filter((blog) => (blog._id || blog.id) !== id));
        if (editingId === id) {
          resetForm();
        }
        alert("Blog deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("Failed to delete blog from database.");
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredBlogs = blogsList.filter(
    (blog) =>
      (blog.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (blog.author || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (blog.category || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="blog-page-container">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="blog-page-header">
        <h1 className="blog-page-title">
          Create & Manage Blog
        </h1>

        <p className="blog-page-subtitle">
          Publish insightful articles, announcements, and news for your audience.
        </p>
      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      <div className="blog-form-card">
        <div className="blog-card-header">
          <FiFileText className="blog-card-icon" />
          <h2 className="blog-card-title">
            {editingId ? "Edit Blog Article" : "Write Blog Article"}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="blog-form-grid">
            {/* TITLE */}

            <div className="blog-form-group full-width">
              <label className="blog-form-label">
                Blog Title <span>*</span>
              </label>

              <div className="blog-input-wrapper">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog title"
                  className="blog-form-input"
                  required
                />
              </div>
            </div>

            {/* AUTHOR */}

            <div className="blog-form-group">
              <label className="blog-form-label">
                Author Name
              </label>

              <div className="blog-input-wrapper">
                <FiUser className="blog-input-icon" />

                <input
                  type="text"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  placeholder="Enter author name"
                  className="blog-form-input with-icon"
                />
              </div>
            </div>

            {/* DESIGNATION */}

            <div className="blog-form-group">
              <label className="blog-form-label">
                Author Designation
              </label>

              <div className="blog-input-wrapper">
                <input
                  type="text"
                  name="authorDesignation"
                  value={formData.authorDesignation}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Editor"
                  className="blog-form-input"
                />
              </div>
            </div>

            {/* CATEGORY */}

            <div className="blog-form-group">
              <label className="blog-form-label">
                Category <span>*</span>
              </label>

              <div className="blog-input-wrapper">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="blog-form-select"
                  required
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.length === 0 ? (
                    <>
                      <option value="Apartments">Apartments</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Villas">Villas</option>
                    </>
                  ) : (
                    categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* SHORT DESC */}

            <div className="blog-form-group">
              <label className="blog-form-label">
                Short Description
              </label>

              <div className="blog-input-wrapper">
                <textarea
                  name="shortDesc"
                  value={formData.shortDesc}
                  onChange={handleInputChange}
                  placeholder="Brief summary"
                  className="blog-form-textarea tiny"
                />
              </div>
            </div>

            {/* QUOTE */}

            <div className="blog-form-group full-width">
              <label className="blog-form-label">
                Featured Quote
              </label>

              <div className="blog-input-wrapper">
                <input
                  type="text"
                  name="quotes"
                  value={formData.quotes}
                  onChange={handleInputChange}
                  placeholder="Enter quote"
                  className="blog-form-input"
                />
              </div>
            </div>

            {/* =================================================
                TINYMCE RICH TEXT EDITOR
            ================================================= */}

            <div className="blog-form-group full-width">
              <label className="blog-form-label">
                Blog Content <span>*</span>
              </label>

              <div style={{ marginTop: "6px", borderRadius: "10px", overflow: "hidden", border: "1px solid #cbd5e1" }}>
                <Editor
                  apiKey="jeq7g2k84sqpi9364o8x9ptqf09aoesaq8jxmp49dl4sh57z"
                  value={formData.content}
                  onEditorChange={(content) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: content,
                    }))
                  }
                  init={{
                    height: 380,
                    menubar: true,
                    branding: false,
                    resize: false,
                    statusbar: true,
                    plugins:
                      "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",
                    toolbar:
                      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | removeformat fullscreen",
                    content_style:
                      "body { font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif; font-size: 15px; color: #1e293b; line-height: 1.7; padding: 12px; }",
                    placeholder: "Write your engaging and rich blog article content here...",
                  }}
                />
              </div>
            </div>

            {/* TAGS */}

            <div className="blog-form-group">
              <label className="blog-form-label">
                Tags
              </label>

              <div className="blog-tag-input-row">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) =>
                    setTagInput(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Enter tag"
                  className="blog-form-input"
                />

                <button
                  type="button"
                  onClick={handleAddTag}
                  className="blog-add-tag-btn"
                >
                  <FiPlus />
                  Add Tag
                </button>
              </div>

              <div className="blog-tags-container">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="blog-tag-badge"
                  >
                    <FiTag size={12} />

                    {tag}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveTag(tag)
                      }
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* EMAIL */}

            <div className="blog-form-group">
              <label className="blog-form-label">
                Email
              </label>

              <div className="blog-input-wrapper">
                <FiMail className="blog-input-icon" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  className="blog-form-input with-icon"
                />
              </div>
            </div>

            {/* ADDRESS */}

            <div className="blog-form-group">
              <label className="blog-form-label">
                Address
              </label>

              <div className="blog-input-wrapper">
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  className="blog-form-textarea tiny"
                />
              </div>
            </div>
          </div>

          {/* =================================================
              IMAGE
          ================================================= */}

          <div className="blog-form-group full-width">
            <label className="blog-form-label">
              Upload Image
            </label>

            <div className="blog-file-upload-box">
              <label className="blog-file-custom-btn">
                <FiUpload />
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({
                        ...formData,
                        image: file,
                      });
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagePreview(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="blog-file-input"
                />
              </label>

              <span className="blog-file-name">
                {formData.image
                  ? formData.image.name
                  : imagePreview
                  ? "Image selected"
                  : "No file chosen"}
              </span>
            </div>
          </div>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <div className="blog-submit-wrapper">
            <button
              type="submit"
              className="blog-publish-btn"
            >
              {editingId
                ? "Update Blog Post"
                : "Publish Blog"}
            </button>

            {editingId && (
              <button
                type="button"
                className="blog-cancel-btn"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* =====================================================
          BLOG TABLE
      ===================================================== */}

      <div className="blog-table-card">
        <div className="blog-table-header-row">
          <h2>
            Published Blogs Directory
          </h2>

          <div className="blog-search-wrapper">
            <FiSearch className="blog-search-icon" />

            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="blog-search-input"
            />
          </div>
        </div>

        <div className="blog-table-responsive">
          <table className="blog-data-table">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Blog Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map(
                  (blog, index) => (
                    <tr key={blog._id || blog.id || index}>
                      <td>
                        {index + 1}
                      </td>

                      <td className="blog-title-cell">
                        {blog.title}
                      </td>

                      <td>
                        {blog.author}
                      </td>

                      <td>
                        <span className="blog-cat-badge">
                          {blog.category}
                        </span>
                      </td>

                      <td>
                        {blog.createdAt
                          ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : blog.date || "N/A"}
                      </td>

                      <td>
                        <span
                          className={`blog-status-badge ${(blog.status || "published").toLowerCase()}`}
                        >
                          {blog.status}
                        </span>
                      </td>

                      <td>
                        <div className="blog-action-btns">
                          <button
                            type="button"
                            className="blog-action-btn edit"
                            title="Edit"
                            onClick={() =>
                              handleEditClick(blog)
                            }
                          >
                            <FiEdit size={14} />
                          </button>

                          <button
                            type="button"
                            className="blog-action-btn delete"
                            title="Delete"
                            onClick={() =>
                              handleDelete(blog._id || blog.id)
                            }
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="blog-empty-row"
                  >
                    No blogs found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Blog;