import React, { useState, ChangeEvent, FormEvent } from "react";
import "./CreateBlog.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Editor } from "@tinymce/tinymce-react";

interface Blog {
  id: number;
  title: string;
  author: string;
  designation: string;
  shortDesc: string;
  quotes: string;
  content: string;
  category: string;
  tags: string[];
  email: string;
  address: string;
  banner: File | null;
  postingDate: string;
}

interface FormData {
  title: string;
  author: string;
  designation: string;
  shortDesc: string;
  quotes: string;
  content: string;
  category: string;
  tags: string[];
  email: string;
  address: string;
  banner: File | null;
}

const CreateBlog: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    author: "",
    designation: "",
    shortDesc: "",
    quotes: "",
    content: "",
    category: "",
    tags: [],
    email: "",
    address: "",
    banner: null,
  });

  const [tagInput, setTagInput] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Handle Input Change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle File Upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, banner: e.target.files![0] }));
    }
  };

  // Handle Tags
  const handleTagAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  // Create new blog
  const createBlog = () => {
    const newBlog: Blog = {
      id: blogs.length > 0 ? Math.max(...blogs.map((b) => b.id)) + 1 : 1,
      ...formData,
      postingDate: new Date().toLocaleDateString(),
    };
    setBlogs((prev) => [...prev, newBlog]);
    resetForm();
  };

  // Update existing blog
  const updateBlog = () => {
    if (editingId === null) return;
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === editingId
          ? { ...b, ...formData, postingDate: b.postingDate }
          : b
      )
    );
    setEditingId(null);
    resetForm();
  };

  // Handle Submit (create or update)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      updateBlog();
    } else {
      createBlog();
    }
  };

  // Populate form for editing
  const handleEdit = (id: number) => {
    const blog = blogs.find((b) => b.id === id);
    if (!blog) return;
    setFormData({
      title: blog.title,
      author: blog.author,
      designation: blog.designation,
      shortDesc: blog.shortDesc,
      quotes: blog.quotes,
      content: blog.content,
      category: blog.category,
      tags: [...blog.tags],
      email: blog.email,
      address: blog.address,
      banner: blog.banner ?? null,
    });
    setEditingId(blog.id);
    const el = document.querySelector(".BlogPosting-left");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Delete blog
  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    if (editingId === id) {
      setEditingId(null);
      resetForm();
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      designation: "",
      shortDesc: "",
      quotes: "",
      content: "",
      category: "",
      tags: [],
      email: "",
      address: "",
      banner: null,
    });
    setTagInput("");
  };

  return (
    <div className="BlogPosting-container">
      <h2 className="BlogPosting-title">Create & Manage Blogs</h2>

      <div className="BlogPosting-main">
        {/* ===== Left Side: Blog Form ===== */}
        <div className="BlogPosting-left">
          <form onSubmit={handleSubmit} className="BlogPosting-form" noValidate>
            {/* Blog Title */}
            <div className="BlogPosting-form-group">
                    <label>Blog Title</label>
                    <textarea
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      rows={4} // initial rows
                      style={{ resize: "none" }} // optional: prevent manual resize
                      placeholder="Enter your blog title..."
                    />
                  </div>

            {/* Author & Designation */}
            <div className="BlogPosting-two-col">
              <div className="BlogPosting-form-group">
                <label>Author Name</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="BlogPosting-form-group">
                <label>Author Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="BlogPosting-form-group textarea-lg">
              <label>Short Description</label>
              <textarea
                name="shortDesc"
                value={formData.shortDesc}
                onChange={handleChange}
                rows={4}
              />
            </div>

            {/* Quotes */}
            <div className="BlogPosting-form-group textarea-lg">
              <label>Quotes</label>
              <textarea
                name="quotes"
                value={formData.quotes}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {/* ✅ TinyMCE Blog Content */}
            <div className="BlogPosting-form-group">
              <label>Blog Content</label>
              <Editor
                  apiKey="38wljwg2resc6xba8ypjqp4duobboibboshf3czbuyv5iulv"
                  value={formData.content}
                  init={{
                    height: 350,
                    menubar: true,
                    branding: false, // ✅ removes TinyMCE branding
                    plugins:
                      "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount paste",
                    toolbar:
                      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    paste_as_text: false, // ✅ preserve formatting while pasting
                  }}
                  onEditorChange={(content) =>
                    setFormData((prev) => ({ ...prev, content }))
                  }
                />
            </div>

            {/* Category */}
            <div className="BlogPosting-form-group">
              <label>Choose Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">-- Select Category --</option>
                <option value="Technology">Technology</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Development">Development</option>
              </select>
            </div>

            {/* Tags */}
            <div className="BlogPosting-form-group">
              <label>Tags</label>
              <div className="BlogPosting-tags">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="BlogPosting-tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="BlogPosting-tag-remove"
                      aria-label={`Remove tag ${tag}`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <div className="BlogPosting-tag-input">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                />
                <button onClick={handleTagAdd}>Add</button>
              </div>
            </div>

            {/* Email & Address */}
            <div className="BlogPosting-two-col">
              <div className="BlogPosting-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="BlogPosting-form-group textarea-lg">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>

            {/* Upload Banner */}
            <div className="BlogPosting-form-group">
              <label>Upload Blog Banner</label>
              <input type="file" name="banner" onChange={handleFileChange} />
              {formData.banner && (
                <div style={{ marginTop: 8 }}>
                  <img
                    src={URL.createObjectURL(formData.banner)}
                    alt="banner preview"
                    style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 6 }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button type="submit" className="BlogPosting-submit-btn">
                {editingId ? "Update Blog" : "Publish Blog"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="BlogPosting-cancel-btn"
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "10px 14px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ===== Right Side: Manage Blogs ===== */}
        <div className="BlogPosting-right">
          <h3>Manage Blogs</h3>
          <table className="BlogPosting-table">
            <thead>
              <tr>
                <th>Sl No.</th>
                <th>Title</th>
                <th>Posting Date</th>
                <th>Photo</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length > 0 ? (
                blogs.map((blog, index) => (
                  <tr key={blog.id}>
                    <td>{index + 1}</td>
                    <td style={{ textAlign: "left", paddingLeft: 12 }}>{blog.title}</td>
                    <td>{blog.postingDate}</td>
                    <td>
                      {blog.banner ? (
                        <img
                          src={URL.createObjectURL(blog.banner)}
                          alt="banner"
                          className="BlogPosting-table-img"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>{blog.email || "—"}</td>
                    <td className="BlogPosting-actions">
                      <button
                        onClick={() => handleEdit(blog.id)}
                        title="Edit"
                        className="BlogPosting-action-btn"
                      >
                        <FaEdit className="BlogPosting-icon edit" />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        title="Delete"
                        className="BlogPosting-action-btn"
                      >
                        <FaTrashAlt className="BlogPosting-icon delete" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="BlogPosting-empty">
                    No blogs added yet.
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

export default CreateBlog;
