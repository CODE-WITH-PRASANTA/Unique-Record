import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './MakeUserPost.css';
import { API_URL } from '../../Api'; // Import the API_URL


const MakeUserPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    quotes: '',
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

  const formPayload = new FormData();
  formPayload.append("blogTitle", formData.title);
  formPayload.append("shortDescription", formData.quotes); // Map quotes to shortDescription
  formPayload.append("quotes", formData.quotes);
  formPayload.append("blogContent", formData.content);
  formPayload.append("category", formData.category);
  formPayload.append("authorName", formData.authorName || "Anonymous");
  formPayload.append("tags", JSON.stringify(formData.tags)); // must be stringified
  formPayload.append("image", formData.image);

  try {
      const response = await fetch(`${API_URL}/blogs/create`, {
        method: "POST",
        body: formPayload,
      });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Blog posted successfully!");
      // Clear the form
      setFormData({
        title: '',
        quotes: '',
        content: '',
        authorName: '',
        category: '',
        tags: [],
        image: null,
      });
      setTagInput('');
    } else {
      alert(`❌ Failed to post: ${data.message}`);
    }
  } catch (error) {
    console.error("Error submitting blog:", error);
    alert("❌ Server error. Try again later.");
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
            <label>Quotes<span>*</span></label>
            <input
              type="text"
              name="quotes"
              placeholder="Short Quotes"
              value={formData.quotes}
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
              branding: false,
              promotion: false,
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