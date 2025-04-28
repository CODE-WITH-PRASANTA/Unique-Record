import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaTimes, FaUpload } from 'react-icons/fa';
import { Editor } from '@tinymce/tinymce-react';
import './AdminEditBlogs.css';
import { API_URL } from '../../Api'; // Correct import at top


const AdminEditBlogs = () => {
  const [blogData, setBlogData] = useState([]);
  const [editBlog, setEditBlog] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch all blogs initially
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/blogs/all`);
      setBlogData(res.data.blogs);
    } catch (error) {
      console.error("Error fetching blogs", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle Edit
  const handleEditClick = (blog) => {
    setEditBlog({ ...blog, tags: blog.tags.join(',') }); // Convert tags array to comma-separated string
    setSelectedImage(null); // Reset image
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditBlog((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Content Change (TinyMCE)
  const handleEditorChange = (content) => {
    setEditBlog((prev) => ({ ...prev, content }));
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setEditBlog((prev) => ({ ...prev, imageUrl }));
    }
  };

  // Submit Updated Blog
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', editBlog.title);
    formData.append('description', editBlog.description);
    formData.append('content', editBlog.content);
    formData.append('authorName', editBlog.authorName);
    formData.append('category', editBlog.category);
    formData.append('tags', editBlog.tags);

    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      await axios.put(`${API_URL}/blogs/update/${editBlog._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      alert('Blog updated successfully');
      fetchBlogs();
      setEditBlog(null);
    } catch (error) {
      console.error("Error updating blog", error);
      alert('Failed to update blog');
    }
  };

  // Handle Delete
  const handleDeleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`${API_URL}/blogs/delete/${id}`);
        alert('Blog deleted successfully');
        fetchBlogs();
      } catch (error) {
        console.error("Error deleting blog", error);
        alert('Failed to delete blog');
      }
    }
  };

  // Close Edit Form
  const handleCloseForm = () => {
    setEditBlog(null);
  };

  const truncateTitle = (title, maxLength = 30) => {
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
  };

  return (
    <div className="admin-edit-blog-container">
      <h2 className="admin-edit-blog-heading">Manage Blogs</h2>
      <div className="admin-edit-blog-table-wrapper">
        <table className="admin-edit-blog-table">
          <thead className="admin-edit-blog-table-head">
            <tr className="admin-edit-blog-table-row">
              <th className="admin-edit-blog-table-header">Sl No.</th>
              <th className="admin-edit-blog-table-header">Post Photo</th>
              <th className="admin-edit-blog-table-header">Post Title</th>
              <th className="admin-edit-blog-table-header">Action</th>
            </tr>
          </thead>
          <tbody className="admin-edit-blog-table-body">
            {blogData.map((blog, index) => (
              <tr key={blog._id} className="admin-edit-blog-table-row">
                <td className="admin-edit-blog-table-data">{index + 1}</td>
                <td className="admin-edit-blog-table-data">
                  <img src={blog.imageUrl} alt="Post" className="admin-edit-blog-post-photo" />
                </td>
                <td className="admin-edit-blog-table-data">{truncateTitle(blog.title)}</td>
                <td className="admin-edit-blog-table-data admin-edit-blog-actions">
                  <button className="admin-edit-blog-edit-btn" onClick={() => handleEditClick(blog)}>
                    <FaEdit />
                  </button>
                  <button className="admin-edit-blog-delete-btn" onClick={() => handleDeleteBlog(blog._id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editBlog && (
        <div className="admin-edit-blog-form-overlay">
          <div className="admin-edit-blog-form-container">
            <div className="admin-edit-blog-form-header">
              <h3 className="admin-edit-blog-form-title">Edit Blog</h3>
              <button className="admin-edit-blog-close-btn" onClick={handleCloseForm}>
                <FaTimes />
              </button>
            </div>
            <form className="admin-edit-blog-form" onSubmit={handleFormSubmit}>
              <div className="admin-edit-blog-form-row">
                <div className="admin-edit-blog-form-column">
                  <div className="admin-edit-blog-form-group">
                    <label className="admin-edit-blog-form-label">Title</label>
                    <input type="text" name="title" value={editBlog.title} onChange={handleInputChange} required className="admin-edit-blog-form-input" />
                  </div>
                  <div className="admin-edit-blog-form-group">
                    <label className="admin-edit-blog-form-label">Description</label>
                    <input type="text" name="description" value={editBlog.description} onChange={handleInputChange} required className="admin-edit-blog-form-input" />
                  </div>
                  <div className="admin-edit-blog-form-group">
                    <label className="admin-edit-blog-form-label">Author</label>
                    <input type="text" name="authorName" value={editBlog.authorName} onChange={handleInputChange} className="admin-edit-blog-form-input" />
                  </div>
                  <div className="admin-edit-blog-form-group">
                    <label className="admin-edit-blog-form-label">Category</label>
                    <input type="text" name="category" value={editBlog.category} onChange={handleInputChange} className="admin-edit-blog-form-input" />
                  </div>
                  <div className="admin-edit-blog-form-group">
                    <label className="admin-edit-blog-form-label">Tags (comma separated)</label>
                    <input type="text" name="tags" value={editBlog.tags} onChange={handleInputChange} className="admin-edit-blog-form-input" />
                  </div>
                  <div className="admin-edit-blog-form-group">
                    <label className="admin-edit-blog-form-label">Image</label>
                    <input type="file" onChange={handleImageUpload} className="admin-edit-blog-form-file-input" />
                  </div>
                  {editBlog.imageUrl && (
                    <div className="admin-edit-blog-form-group">
                      <img src={editBlog.imageUrl} alt="Preview" className="admin-edit-blog-image-preview" />
                    </div>
                  )}
                </div>
                <div className="admin-edit-blog-form-column">
                  <div className="admin-edit-blog-form-group">
                    <label className="admin-edit-blog-form-label">Content</label>
                    <Editor
  apiKey="38wljwg2resc6xba8ypjqp4duobboibboshf3czbuyv5iulv"
  value={editBlog.content}
  onEditorChange={handleEditorChange}
  className="admin-edit-blog-editor"
  init={{
    height: 400,
    menubar: true, // enable menubar for full features
    branding: false, // remove "Powered by Tiny" branding
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
    ],
    toolbar:
      'undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | help | code preview',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
  }}
/>

                  </div>
                </div>
              </div>
              <div className="admin-edit-blog-form-actions">
                <button type="submit" className="admin-edit-blog-save-btn">
                  <FaUpload /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEditBlogs;