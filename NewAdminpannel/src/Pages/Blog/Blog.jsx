import React, { useState, useRef } from "react";
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
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiLink,
  FiType,
} from "react-icons/fi";
import "./Blog.css";

const Blog = () => {
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

  const [tags, setTags] = useState([
    "Real Estate",
    "Bhubaneswar",
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // Rich editor reference
  const editorRef = useRef(null);

  // =========================================================
  // SAMPLE BLOG DATA
  // =========================================================

  const [blogsList, setBlogsList] = useState([
    {
      id: 1,
      title: "Luxury Living in Baramunda",
      author: "Admin",
      category: "Apartments",
      date: "Sep 22, 2026",
      status: "Published",
      authorDesignation: "Senior Manager",
      shortDesc: "Experience luxury living.",
      quotes: "Home is where heart is.",
      content:
        "<p>Detailed content about luxury living in Baramunda...</p>",
      email: "admin@utkalproperty.com",
      address: "Baramunda, Bhubaneswar",
    },
    {
      id: 2,
      title: "Real Estate Investment Trends 2026",
      author: "Property Expert",
      category: "Commercial",
      date: "Sep 20, 2026",
      status: "Draft",
      authorDesignation: "Analyst",
      shortDesc: "Market trends overview.",
      quotes: "Invest wisely.",
      content:
        "<p>Detailed content about trends...</p>",
      email: "expert@utkalproperty.com",
      address: "Satya Nagar, Bhubaneswar",
    },
  ]);

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
  // RICH TEXT EDITOR
  // =========================================================

  const syncEditorContent = () => {
    if (!editorRef.current) return;

    setFormData((prev) => ({
      ...prev,
      content: editorRef.current.innerHTML,
    }));
  };

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const executeEditorCommand = (command, value = null) => {
    focusEditor();

    document.execCommand(command, false, value);

    syncEditorContent();
  };

  // =========================================================
  // TEXT FORMAT
  // =========================================================

  const handleBold = () => {
    executeEditorCommand("bold");
  };

  const handleItalic = () => {
    executeEditorCommand("italic");
  };

  const handleUnderline = () => {
    executeEditorCommand("underline");
  };

  const handleBulletList = () => {
    executeEditorCommand("insertUnorderedList");
  };

  const handleNumberList = () => {
    executeEditorCommand("insertOrderedList");
  };

  const handleAlignLeft = () => {
    executeEditorCommand("justifyLeft");
  };

  const handleAlignCenter = () => {
    executeEditorCommand("justifyCenter");
  };

  const handleAlignRight = () => {
    executeEditorCommand("justifyRight");
  };

  const handleHeading = (e) => {
    const value = e.target.value;

    if (!value) return;

    executeEditorCommand("formatBlock", value);

    e.target.value = "";
  };

  const handleCreateLink = () => {
    const url = window.prompt("Enter URL:");

    if (!url) return;

    executeEditorCommand("createLink", url);
  };

  // =========================================================
  // EDITOR KEY HANDLER
  // =========================================================

  const handleEditorKeyDown = (e) => {
    // Ctrl + B
    if (e.ctrlKey && e.key.toLowerCase() === "b") {
      e.preventDefault();
      handleBold();
    }

    // Ctrl + I
    if (e.ctrlKey && e.key.toLowerCase() === "i") {
      e.preventDefault();
      handleItalic();
    }

    // Ctrl + U
    if (e.ctrlKey && e.key.toLowerCase() === "u") {
      e.preventDefault();
      handleUnderline();
    }
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
    setTags((prev) =>
      prev.filter((tag) => tag !== tagToRemove)
    );
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
      category: "",
      email: "",
      address: "",
      image: null,
    });

    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }

    setEditingId(null);
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a blog title!");
      return;
    }

    const editorContent =
      editorRef.current?.innerHTML || formData.content;

    if (editingId) {
      // UPDATE
      setBlogsList((prev) =>
        prev.map((blog) =>
          blog.id === editingId
            ? {
                ...blog,
                title: formData.title,
                author:
                  formData.authorName || blog.author,
                category:
                  formData.category || blog.category,
                authorDesignation:
                  formData.authorDesignation,
                shortDesc:
                  formData.shortDesc,
                quotes:
                  formData.quotes,
                content:
                  editorContent,
                email:
                  formData.email,
                address:
                  formData.address,
              }
            : blog
        )
      );

      alert("Blog updated successfully!");
    } else {
      // CREATE
      const newBlog = {
        id: Date.now(),
        title: formData.title,
        author:
          formData.authorName || "Admin",
        category:
          formData.category || "General",
        date: new Date().toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        ),
        status: "Published",
        authorDesignation:
          formData.authorDesignation,
        shortDesc:
          formData.shortDesc,
        quotes:
          formData.quotes,
        content:
          editorContent,
        email:
          formData.email,
        address:
          formData.address,
      };

      setBlogsList((prev) => [
        newBlog,
        ...prev,
      ]);

      alert("Blog published successfully!");
    }

    resetForm();
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEditClick = (blog) => {
    setEditingId(blog.id);

    setFormData({
      title: blog.title || "",
      authorName: blog.author || "",
      authorDesignation:
        blog.authorDesignation || "",
      shortDesc:
        blog.shortDesc || "",
      quotes:
        blog.quotes || "",
      content:
        blog.content || "",
      category:
        blog.category || "",
      email:
        blog.email || "",
      address:
        blog.address || "",
      image: null,
    });

    // Put HTML inside editor
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML =
          blog.content || "";
      }
    }, 0);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) return;

    setBlogsList((prev) =>
      prev.filter((blog) => blog.id !== id)
    );
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredBlogs = blogsList.filter(
    (blog) =>
      blog.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      blog.author
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      blog.category
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // =========================================================
  // WORD COUNT
  // =========================================================

  const getWordCount = () => {
    if (!editorRef.current) return 0;

    const text =
      editorRef.current.innerText.trim();

    if (!text) return 0;

    return text.split(/\s+/).length;
  };

  // =========================================================
  // UI
  // =========================================================

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
          Publish insightful articles,
          announcements, and news for your
          platform.
        </p>
      </div>

      {/* =====================================================
          FORM CARD
      ===================================================== */}

      <div className="blog-form-card">

        <div className="blog-card-header">
          <FiFileText className="blog-card-header-icon" />

          <h2>
            {editingId
              ? "Edit Blog Post"
              : "New Blog Post Form"}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="blog-form"
        >

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <div className="blog-form-grid">

            <div className="blog-form-group">
              <label className="blog-form-label">
                Blog Title
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

            <div className="blog-form-group">
              <label className="blog-form-label">
                Author Designation
              </label>

              <div className="blog-input-wrapper">
                <input
                  type="text"
                  name="authorDesignation"
                  value={
                    formData.authorDesignation
                  }
                  onChange={handleInputChange}
                  placeholder="Enter author designation"
                  className="blog-form-input"
                />
              </div>
            </div>

            <div className="blog-form-group">
              <label className="blog-form-label">
                Short Description
              </label>

              <div className="blog-input-wrapper">
                <input
                  type="text"
                  name="shortDesc"
                  value={formData.shortDesc}
                  onChange={handleInputChange}
                  placeholder="Enter short description"
                  className="blog-form-input"
                />
              </div>
            </div>

          </div>

          {/* =================================================
              QUOTE
          ================================================= */}

          <div className="blog-form-group full-width">

            <label className="blog-form-label">
              Quotes
            </label>

            <textarea
              name="quotes"
              value={formData.quotes}
              onChange={handleInputChange}
              placeholder="Enter featured quote..."
              className="blog-form-textarea small"
            />

          </div>

          {/* =================================================
              REAL RICH TEXT EDITOR
          ================================================= */}

          <div className="blog-form-group full-width">

            <label className="blog-form-label">
              Blog Content
            </label>

            <div className="blog-editor-box">

              {/* TOOLBAR */}

              <div className="blog-editor-toolbar">

                {/* Heading */}

                <select
                  className="blog-editor-heading"
                  defaultValue=""
                  onChange={handleHeading}
                >
                  <option value="">
                    Paragraph
                  </option>

                  <option value="h1">
                    Heading 1
                  </option>

                  <option value="h2">
                    Heading 2
                  </option>

                  <option value="h3">
                    Heading 3
                  </option>

                  <option value="h4">
                    Heading 4
                  </option>
                </select>

                <span className="editor-divider">
                  |
                </span>

                {/* BOLD */}

                <button
                  type="button"
                  className="blog-editor-btn"
                  onMouseDown={(e) =>
                    e.preventDefault()
                  }
                  onClick={handleBold}
                  title="Bold"
                >
                  <FiBold size={16} />
                </button>

                {/* ITALIC */}

                <button
                  type="button"
                  className="blog-editor-btn"
                  onMouseDown={(e) =>
                    e.preventDefault()
                  }
                  onClick={handleItalic}
                  title="Italic"
                >
                  <FiItalic size={16} />
                </button>

                {/* UNDERLINE */}

                <button
                  type="button"
                  className="blog-editor-btn"
                  onMouseDown={(e) =>
                    e.preventDefault()
                  }
                  onClick={handleUnderline}
                  title="Underline"
                >
                  <FiUnderline size={16} />
                </button>

                <span className="editor-divider">
                  |
                </span>

                {/* BULLET */}

                <button
                  type="button"
                  className="blog-editor-btn"
                  onMouseDown={(e) =>
                    e.preventDefault()
                  }
                  onClick={handleBulletList}
                  title="Bullet List"
                >
                  <FiList size={16} />
                </button>

                {/* NUMBER LIST */}

                <button
                  type="button"
                  className="blog-editor-btn"
                  onMouseDown={(e) =>
                    e.preventDefault()
                  }
                  onClick={handleNumberList}
                  title="Numbered List"
                >
                  <FiType size={16} />
                </button>

                <span className="editor-divider">
                  |
                </span>

                {/* LEFT */}

                <button
                  type="button"
                  className="blog-editor-btn"
                  onMouseDown={(e) =>
                    e.preventDefault()
                  }
                  onClick={handleAlignLeft}
                  title="Align Left"
                >
                  <FiAlignLeft size={16} />
                </button>

                {/* CENTER */}

                <button
                  type="button"
                  className="blog-editor-btn"
                  onMouseDown={(e) =>
                    e.preventDefault()
                  }
                  onClick={handleAlignCenter}
                  title="Align Center"
                >
                  <FiAlignCenter size={16} />
                </button>

                {/* RIGHT */}

                <button
                  type="button"
                  className="blog-editor-btn"
                  onMouseDown={(e) =>
                    e.preventDefault()
                  }
                  onClick={handleAlignRight}
                  title="Align Right"
                >
                  <FiAlignRight size={16} />
                </button>

                <span className="editor-divider">
                  |
                </span>

                {/* LINK */}

                <button
                  type="button"
                  className="blog-editor-btn"
                  onMouseDown={(e) =>
                    e.preventDefault()
                  }
                  onClick={handleCreateLink}
                  title="Insert Link"
                >
                  <FiLink size={16} />
                </button>

              </div>

              {/* EDITABLE AREA */}

              <div
                ref={editorRef}
                className="blog-rich-editor"
                contentEditable="true"
                suppressContentEditableWarning={true}
                data-placeholder="Write your main article content here..."
                onInput={syncEditorContent}
                onKeyDown={handleEditorKeyDown}
                spellCheck={true}
              />

              {/* FOOTER */}

              <div className="blog-editor-footer">

                <span>
                  Rich Text Editor
                </span>

                <span>
                  {getWordCount()} words
                </span>

              </div>

            </div>
          </div>

          {/* =================================================
              CATEGORY / TAGS / EMAIL / ADDRESS
          ================================================= */}

          <div className="blog-form-grid">

            {/* CATEGORY */}

            <div className="blog-form-group">

              <label className="blog-form-label">
                Choose Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="blog-form-select"
              >
                <option value="">
                  Select category
                </option>

                <option value="Apartments">
                  Apartments
                </option>

                <option value="Commercial">
                  Commercial
                </option>

                <option value="Villas">
                  Villas
                </option>

                <option value="Real Estate News">
                  Real Estate News
                </option>
              </select>

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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image:
                        e.target.files?.[0] ||
                        null,
                    })
                  }
                  className="blog-file-input"
                />

              </label>

              <span className="blog-file-name">

                {formData.image
                  ? formData.image.name
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
                    <tr key={blog.id}>

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
                        {blog.date}
                      </td>

                      <td>

                        <span
                          className={`blog-status-badge ${blog.status.toLowerCase()}`}
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
                              handleDelete(blog.id)
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
                    No blogs found matching
                    your search.
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