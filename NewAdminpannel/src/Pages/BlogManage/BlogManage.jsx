import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";
import { 
  FiSearch, 
  FiGrid, 
  FiList, 
  FiEdit3, 
  FiTrash2, 
  FiEye, 
  FiCalendar, 
  FiUser, 
  FiTag,
  FiCheckCircle,
  FiFileText
} from "react-icons/fi";
import "./BlogManage.css";

const BlogManage = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); // 'All', 'Published', 'Draft'

  // Fetch blogs from database (including Drafts and Published)
  const fetchBlogs = async () => {
    try {
      const res = await API.get("/blogs/all");
      if (res.data && res.data.success) {
        setBlogs(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching blogs from database:", err);
    }
  };

  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      if (res.data && res.data.success) {
        const catNames = res.data.data.map((c) => c.name);
        setCategories(["All", ...catNames]);
      }
    } catch (err) {
      console.warn("Could not load categories for filter:", err);
      setCategories(["All", "Apartments", "Commercial", "Villas"]);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const res = await API.delete(`/blogs/${id}`);
        if (res.data && res.data.success) {
          setBlogs(blogs.filter((blog) => (blog._id || blog.id) !== id));
          alert("Blog deleted successfully!");
        }
      } catch (err) {
        console.error("Error deleting blog:", err);
        alert("Failed to delete blog from database.");
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await API.patch(`/blogs/${id}/status`);
      if (res.data && res.data.success) {
        const updatedBlog = res.data.data;
        setBlogs(
          blogs.map((blog) =>
            (blog._id || blog.id) === id ? updatedBlog : blog
          )
        );
      }
    } catch (err) {
      console.error("Error toggling blog status:", err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredBlogs = blogs.filter((blog) => {
    const title = blog.title || "";
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || blog.category === selectedCategory;
    const matchesStatus = statusFilter === "All" || blog.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="blog-manage-container">
      {/* HEADER & CONTROLS BAR */}
      <div className="blog-manage-header-card">
        <div>
          <h1 className="blog-manage-title">Manage Blogs</h1>
          <p className="blog-manage-subtitle">View, edit, search, and organize all published and draft articles.</p>
        </div>

        <div className="blog-manage-controls">
          <div className="blog-manage-search-box">
            <FiSearch className="blog-manage-search-icon" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="blog-manage-search-input"
            />
          </div>

          <div className="blog-manage-view-toggles">
            <button
              type="button"
              className={`blog-view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <FiGrid size={16} /> Grid
            </button>
            <button
              type="button"
              className={`blog-view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <FiList size={16} /> List
            </button>
          </div>
        </div>
      </div>

      {/* FILTER TOOLBAR: CATEGORY & STATUS BUTTONS */}
      <div className="blog-filter-toolbar">
        <div className="blog-manage-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`blog-filter-tab ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="blog-status-filter-group">
          {["All", "Published", "Draft"].map((status) => (
            <button
              key={status}
              type="button"
              className={`blog-status-filter-btn ${statusFilter === status ? "active" : ""}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === "Published" && <FiCheckCircle size={13} />}
              {status === "Draft" && <FiFileText size={13} />}
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT AREA: GRID OR LIST VIEW */}
      {filteredBlogs.length > 0 ? (
        viewMode === "grid" ? (
          /* ================= GRID VIEW ================= */
          <div className="blog-grid-view">
            {filteredBlogs.map((blog) => (
              <div key={blog._id || blog.id} className="blog-grid-card">
                <div className="blog-grid-img-wrap">
                  <img
                    src={
                      blog.image ||
                      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={blog.title}
                    className="blog-grid-img"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <span className={`blog-status-tag ${(blog.status || "published").toLowerCase()}`}>
                    {blog.status}
                  </span>
                  <span className="blog-cat-tag">
                    <FiTag size={12} /> {blog.category}
                  </span>
                </div>

                <div className="blog-grid-body">
                  <div className="blog-grid-meta">
                    <span>
                      <FiCalendar size={13} /> {formatDate(blog.createdAt || blog.date)}
                    </span>
                    <span>
                      <FiUser size={13} /> {blog.author || "Admin"}
                    </span>
                  </div>
                  <h3 className="blog-grid-heading">{blog.title}</h3>
                  <p className="blog-grid-desc">
                    {blog.shortDesc ||
                      blog.desc ||
                      blog.content?.replace(/<[^>]*>?/gm, "").substring(0, 100) ||
                      ""}
                  </p>
                </div>

                <div className="blog-grid-footer">
                  <button 
                    className={`blog-status-toggle-btn ${(blog.status || "published").toLowerCase()}`}
                    onClick={() => handleToggleStatus(blog._id || blog.id)}
                    title="Click to toggle status"
                  >
                    {blog.status === "Published" ? "Make Draft" : "Publish Now"}
                  </button>

                  <div className="blog-grid-right-btns">
                    <button
                      className="blog-action-btn view"
                      title="Preview"
                      onClick={() => navigate("/blogs/create", { state: { blog } })}
                    >
                      <FiEye size={14} />
                    </button>
                    <button
                      className="blog-action-btn edit"
                      title="Edit"
                      onClick={() => navigate("/blogs/create", { state: { blog } })}
                    >
                      <FiEdit3 size={14} />
                    </button>
                    <button
                      className="blog-action-btn delete"
                      title="Delete"
                      onClick={() => handleDelete(blog._id || blog.id)}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ================= LIST VIEW (TABLE) ================= */
          <div className="blog-list-card">
            <div className="blog-table-responsive">
              <table className="blog-manage-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Blog Title</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlogs.map((blog) => (
                    <tr key={blog._id || blog.id}>
                      <td>
                        <img
                          src={
                            blog.image ||
                            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
                          }
                          alt=""
                          className="blog-list-thumb"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80";
                          }}
                        />
                      </td>
                      <td className="blog-list-title-cell">
                        <strong>{blog.title}</strong>
                        <p>
                          {(
                            blog.shortDesc ||
                            blog.desc ||
                            blog.content?.replace(/<[^>]*>?/gm, "") ||
                            ""
                          ).substring(0, 50)}
                          ...
                        </p>
                      </td>
                      <td>
                        <span className="blog-table-cat">{blog.category}</span>
                      </td>
                      <td>{blog.author || "Admin"}</td>
                      <td>{formatDate(blog.createdAt || blog.date)}</td>
                      <td>
                        <button
                          type="button"
                          className={`blog-status-badge-btn ${(blog.status || "published").toLowerCase()}`}
                          onClick={() => handleToggleStatus(blog._id || blog.id)}
                          title="Click to toggle status"
                        >
                          {blog.status}
                        </button>
                      </td>
                      <td>
                        <div className="blog-list-actions">
                          <button
                            className="blog-action-btn view"
                            title="Preview"
                            onClick={() => navigate("/blogs/create", { state: { blog } })}
                          >
                            <FiEye size={13} />
                          </button>
                          <button
                            className="blog-action-btn edit"
                            title="Edit"
                            onClick={() => navigate("/blogs/create", { state: { blog } })}
                          >
                            <FiEdit3 size={13} />
                          </button>
                          <button
                            className="blog-action-btn delete"
                            title="Delete"
                            onClick={() => handleDelete(blog._id || blog.id)}
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="blog-manage-empty">
          <p>No blogs found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default BlogManage;