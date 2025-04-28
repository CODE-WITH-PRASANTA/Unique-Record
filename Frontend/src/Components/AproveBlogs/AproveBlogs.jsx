import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { Editor } from '@tinymce/tinymce-react';
import './AproveBlogs.css';
import axios from 'axios';
import { API_URL } from '../../Api';  // Import the API_URL

const AproveBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const editorRef = useRef(null);

  // Fetch all blog posts from the backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/blog`);  // Use the API_URL here
        setBlogs(response.data);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      }
    };
    fetchBlogs();
  }, []);

  const shortenTitle = (title) => {
    const words = title.trim().split(' ');
    if (words.length > 5) {
      return words.slice(0, 5).join(' ') + '...';
    }
    return title;
  };

  const handleEditClick = (blog) => {
    setEditingBlog({ ...blog });
    setTagInput('');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingBlog(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      setEditingBlog(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (index) => {
    setEditingBlog(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSaveChanges = async () => {
    const updatedContent = editorRef.current ? editorRef.current.getContent() : editingBlog.content;
    const formData = new FormData();
  
    formData.append('title', editingBlog.title);
    formData.append('description', editingBlog.description);
    formData.append('content', updatedContent);
    formData.append('authorName', editingBlog.authorName);
    formData.append('category', editingBlog.category);
    formData.append('tags', editingBlog.tags.join(',')); // send as comma-separated
    formData.append('isApproved', editingBlog.isApproved);
  
    if (editingBlog.newImageFile) {
      formData.append('image', editingBlog.newImageFile); // important for image
    }
  
    try {
      const response = await axios.put(`${API_URL}/user/blog/${editingBlog._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      setBlogs(prevBlogs =>
        prevBlogs.map(b => (b._id === editingBlog._id ? response.data.updatedPost : b))
      );
      setEditingBlog(null);
      document.body.style.overflow = 'auto';
    } catch (error) {
      console.error("Failed to update blog post", error);
    }
  };
  
  const handleCloseForm = () => {
    setEditingBlog(null);
    document.body.style.overflow = 'auto';
  };

  // Approve Blog Post
  const handleApproveClick = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/user/blog/${id}/approve`);  // Use the API_URL here
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => 
          blog._id === id ? { ...blog, isApproved: true } : blog
        )
      );
    } catch (error) {
      console.error("Failed to approve blog post", error);
    }
  };

  // Unapprove Blog Post
  const handleUnapproveClick = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/user/blog/${id}/unapprove`);  // Use the API_URL here
      setBlogs(prevBlogs => 
        prevBlogs.filter(blog => blog._id !== id)
      );
    } catch (error) {
      console.error("Failed to unapprove blog post", error);
    }
  };

  return (
    <div className="aprove-blogs-container">
      <h2 className="aprove-blogs-heading">Manage Blog Approval</h2>

      <div className="aprove-blogs-table-wrapper">
        <table className="aprove-blogs-table">
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Blog Picture</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, index) => (
              <tr key={blog._id}>
                <td>{index + 1}</td>
                <td>
                  <img src={blog.image || 'https://via.placeholder.com/80'} alt="Blog" className="aprove-blogs-image" />
                </td>
                <td>{shortenTitle(blog.title)}</td>
                <td className="aprove-blogs-action-icons">
                  <FaEdit className="aprove-blogs-icon edit" onClick={() => handleEditClick(blog)} />
                  <FaTrash className="aprove-blogs-icon delete" onClick={() => handleUnapproveClick(blog._id)} />
                  {blog.isApproved ? (
                    <FaTimes className="aprove-blogs-icon unapprove" onClick={() => handleUnapproveClick(blog._id)} />
                  ) : (
                    <FaCheck className="aprove-blogs-icon approve" onClick={() => handleApproveClick(blog._id)} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingBlog && (
        <div className="aprove-blogs-edit-form-overlay">
          <div className="aprove-blogs-edit-form-container animate-slide">
            <h3 className="aprove-blogs-edit-heading">Edit Blog Details</h3>

            <div className="aprove-blogs-row">
              <input
                type="text"
                name="title"
                value={editingBlog.title}
                onChange={handleInputChange}
                placeholder="Blog Title"
                className="aprove-blogs-input"
              />
              <input
                type="text"
                name="authorName"
                value={editingBlog.authorName}
                onChange={handleInputChange}
                placeholder="Author Name"
                className="aprove-blogs-input"
              />
            </div>

            <div className="aprove-blogs-row">
              <textarea
                name="description"
                value={editingBlog.description}
                onChange={handleInputChange}
                placeholder="Short Description"
                className="aprove-blogs-textarea"
                rows="3"
              />
            </div>

            <div className="aprove-blogs-row">
              <Editor
                apiKey="38wljwg2resc6xba8ypjqp4duobboibboshf3czbuyv5iulv"
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={editingBlog.content}
                init={{
                    height: 300,
                    menubar: false,
                    branding: false,
                    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                }}
              />
            </div>

            <div className="aprove-blogs-row">
              <input
                type="text"
                name="category"
                value={editingBlog.category}
                onChange={handleInputChange}
                placeholder="Category"
                className="aprove-blogs-input"
              />
            </div>

            <div className="aprove-blogs-row tags-input-container">
              {editingBlog.tags.map((tag, index) => (
                <div key={index} className="tag-item">
                  {tag}
                  <FaTimes className="tag-remove-icon" onClick={() => handleRemoveTag(index)} />
                </div>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagKeyDown}
                placeholder="Press Enter to add tag"
                className="aprove-blogs-input"
              />
            </div>

            <div className="aprove-blogs-row">
            <input 
                    type="file"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                        setEditingBlog(prev => ({
                            ...prev,
                            newImageFile: file, // store the new selected image file
                            imagePreview: URL.createObjectURL(file), // for previewing
                        }));
                        }
                    }}
                    />

                    {editingBlog.imagePreview && (
                    <img src={editingBlog.imagePreview} alt="Preview" style={{ width: "100px", height: "auto" }} />
                    )}
            </div>

            <div className="aprove-blogs-edit-form-buttons">
              <button className="aprove-blogs-save-btn" onClick={handleSaveChanges}>Save</button>
              <button className="aprove-blogs-cancel-btn" onClick={handleCloseForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AproveBlogs;
