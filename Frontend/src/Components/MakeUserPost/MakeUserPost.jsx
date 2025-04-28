import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import './MakeUserPost.css';
import Swal from 'sweetalert2';
import { API_URL } from '../../Api';  // Import the API_URL from a separate config file

const MakeUserPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    authorName: '',
    category: '',
    tags: [],
    image: null,
  });

  const [tagInput, setTagInput] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('authorName', formData.authorName || 'Anonymous');
    formDataToSend.append('category', formData.category);
    formDataToSend.append('tags', formData.tags.join(','));
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
  
    try {
      const response = await axios.post(`${API_URL}/user/blog/create`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      
      // Success alert after the post is successfully created
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your blog post has been created successfully!',
        showConfirmButton: false,
        timer: 1500,
      });
  
      // Optionally, reset the form after successful submission
      setFormData({
        title: '',
        description: '',
        content: '',
        authorName: '',
        category: '',
        tags: [],
        image: null,
      });
  
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show an error message)
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'An error occurred. Please try again later.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  return (
    <div className="Make-User-Post-Container">
      <h2 className="Make-User-Post-Heading">Create a New Blog Post</h2>
      <form onSubmit={handleSubmit} className="Make-User-Post-Form">

        {/* Title & Description */}
        <div className="Make-User-Post-Row">
          <div className="Make-User-Post-FormGroup">
            <label>Title<span>*</span></label>
            <input
              type="text"
              name="title"
              placeholder="Enter blog title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="Make-User-Post-FormGroup">
            <label>Description<span>*</span></label>
            <input
              type="text"
              name="description"
              placeholder="Short description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Content */}
        <div className="Make-User-Post-FormGroupFull">
          <label>Content<span>*</span></label>
          <Editor
            apiKey="38wljwg2resc6xba8ypjqp4duobboibboshf3czbuyv5iulv"
            value={formData.content}
            init={{
              plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
              toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
              menubar: false,
              height: 300,
              branding: false,  // <<<<<< REMOVE TinyMCE branding
              promotion: false, // <<<<<< REMOVE TinyMCE "Upgrade to Premium" ads
            }}
            onEditorChange={handleEditorChange}
          />
        </div>

        {/* Author Name & Category */}
        <div className="Make-User-Post-Row">
          <div className="Make-User-Post-FormGroup">
            <label>Author Name</label>
            <input
              type="text"
              name="authorName"
              placeholder="Author name (default: Anonymous)"
              value={formData.authorName}
              onChange={handleChange}
            />
          </div>

          <div className="Make-User-Post-FormGroup">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Travel">Travel</option>
              <option value="Education">Education</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>
        </div>

        {/* Tags & Image Upload */}
        <div className="Make-User-Post-Row">
          <div className="Make-User-Post-FormGroup">
            <label>Tags</label>
            <input
              type="text"
              name="tagsInput"
              placeholder="Press Enter or Comma to add"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
            />
            <div className="Make-User-Post-TagsContainer">
              {formData.tags.map((tag, index) => (
                <div key={index} className="Make-User-Post-Tag">
                  #{tag}
                  <span onClick={() => removeTag(index)} className="Make-User-Post-TagRemove">&times;</span>
                </div>
              ))}
            </div>
          </div>

          <div className="Make-User-Post-FormGroup">
            <label>Upload Image<span>*</span></label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="Make-User-Post-SubmitButton">Post Blog</button>
      </form>
    </div>
  );
};

export default MakeUserPost;
