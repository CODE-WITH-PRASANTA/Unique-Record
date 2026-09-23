import React, { useState } from "react";
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

// Sample initial blog data with images
const initialBlogs = [
  {
    id: 1,
    title: "Luxury Living in Baramunda Apartments",
    author: "Admin",
    category: "Apartments",
    date: "Sep 22, 2026",
    status: "Published",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
    desc: "Experience high-end residential living with state-of-the-art facilities in Baramunda."
  },
  {
    id: 2,
    title: "Real Estate Investment Trends 2026",
    author: "Property Expert",
    category: "Commercial",
    date: "Sep 20, 2026",
    status: "Draft",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    desc: "An in-depth look at commercial real estate growth and future projections in Bhubaneswar."
  },
  {
    id: 3,
    title: "Exploring Independent Villas in Patia",
    author: "Editorial Team",
    category: "Villas",
    date: "Sep 18, 2026",
    status: "Published",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
    desc: "Discover spacious luxury villas offering supreme privacy and modern architecture."
  }
];

const BlogManage = () => {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); // 'All', 'Published', 'Draft'

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      setBlogs(blogs.filter((blog) => blog.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setBlogs(blogs.map(blog => {
      if (blog.id === id) {
        const newStatus = blog.status === "Published" ? "Draft" : "Published";
        return { ...blog, status: newStatus };
      }
      return blog;
    }));
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
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
          {["All", "Apartments", "Commercial", "Villas"].map((cat) => (
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
              <div key={blog.id} className="blog-grid-card">
                <div className="blog-grid-img-wrap">
                  <img src={blog.image} alt={blog.title} className="blog-grid-img" />
                  <span className={`blog-status-tag ${blog.status.toLowerCase()}`}>
                    {blog.status}
                  </span>
                  <span className="blog-cat-tag">
                    <FiTag size={12} /> {blog.category}
                  </span>
                </div>

                <div className="blog-grid-body">
                  <div className="blog-grid-meta">
                    <span><FiCalendar size={13} /> {blog.date}</span>
                    <span><FiUser size={13} /> {blog.author}</span>
                  </div>
                  <h3 className="blog-grid-heading">{blog.title}</h3>
                  <p className="blog-grid-desc">{blog.desc}</p>
                </div>

                <div className="blog-grid-footer">
                  <button 
                    className={`blog-status-toggle-btn ${blog.status.toLowerCase()}`}
                    onClick={() => handleToggleStatus(blog.id)}
                    title="Click to toggle status"
                  >
                    {blog.status === "Published" ? "Make Draft" : "Publish Now"}
                  </button>

                  <div className="blog-grid-right-btns">
                    <button className="blog-action-btn view" title="Preview">
                      <FiEye size={14} />
                    </button>
                    <button className="blog-action-btn edit" title="Edit">
                      <FiEdit3 size={14} />
                    </button>
                    <button className="blog-action-btn delete" title="Delete" onClick={() => handleDelete(blog.id)}>
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
                    <tr key={blog.id}>
                      <td>
                        <img src={blog.image} alt="" className="blog-list-thumb" />
                      </td>
                      <td className="blog-list-title-cell">
                        <strong>{blog.title}</strong>
                        <p>{blog.desc.substring(0, 50)}...</p>
                      </td>
                      <td>
                        <span className="blog-table-cat">{blog.category}</span>
                      </td>
                      <td>{blog.author}</td>
                      <td>{blog.date}</td>
                      <td>
                        <button
                          type="button"
                          className={`blog-status-badge-btn ${blog.status.toLowerCase()}`}
                          onClick={() => handleToggleStatus(blog.id)}
                          title="Click to toggle status"
                        >
                          {blog.status}
                        </button>
                      </td>
                      <td>
                        <div className="blog-list-actions">
                          <button className="blog-action-btn view" title="Preview">
                            <FiEye size={13} />
                          </button>
                          <button className="blog-action-btn edit" title="Edit">
                            <FiEdit3 size={13} />
                          </button>
                          <button className="blog-action-btn delete" title="Delete" onClick={() => handleDelete(blog.id)}>
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