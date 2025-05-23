import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { TagsInput } from 'react-tag-input-component';
import axios from 'axios';
import './AdminPostAchievement.css';
import { API_URL } from '../../Api'; // Ensure API_URL = http://localhost:5005

const AdminPostAchievement = () => {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    content: '',
    providerName: '',
    achieverName: '',
    category: '',
    tags: [],
    image: null,
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [categories, setCategories] = useState([]);

  // 🔹 Fetch categories on component mount
  useEffect(() => {
    axios
      .get(`${API_URL}/categories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleEditorChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('shortDescription', formData.shortDescription);
    data.append('content', formData.content);
    data.append('providerName', formData.providerName);
    data.append('achieverName', formData.achieverName);
    data.append('category', formData.category);
    data.append('tags', formData.tags.join(','));
    data.append('image', formData.image);

    axios
      .post(`${API_URL}/achievements/post-achievement`, data)
      .then((response) => {
        console.log(response.data);
        setSuccessMsg('🎉 Achievement posted successfully!');
        setFormData({
          title: '',
          shortDescription: '',
          content: '',
          providerName: '',
          achieverName: '',
          category: '',
          tags: [],
          image: null,
        });
        setTimeout(() => setSuccessMsg(''), 4000);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="achivement-post-container">
      <h2 className="achivement-post-heading">Post Achievement</h2>

      {successMsg && <div className="achivement-post-success-alert">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="achivement-post-form">
        <div className="achivement-post-form-group">
          <label className="achivement-post-label">Achievement Title*</label>
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="achivement-post-input" />
        </div>

        <div className="achivement-post-form-group">
          <label className="achivement-post-label">Achievement Short Description*</label>
          <textarea name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} required className="achivement-post-textarea" />
        </div>

        <div className="achivement-post-form-group">
          <label className="achivement-post-label">Achievement Content*</label>
          <Editor
            apiKey="38wljwg2resc6xba8ypjqp4duobboibboshf3czbuyv5iulv"
            init={{
              plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
              toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
              branding: false,
            }}
            value={formData.content}
            onEditorChange={handleEditorChange}
          />
        </div>

        <div className="achivement-post-form-group">
          <label className="achivement-post-label">Achievement Provider Name*</label>
          <input type="text" name="providerName" value={formData.providerName} onChange={handleInputChange} required className="achivement-post-input" />
        </div>

        <div className="achivement-post-form-group">
          <label className="achivement-post-label">Achiever Name*</label>
          <input type="text" name="achieverName" value={formData.achieverName} onChange={handleInputChange} required className="achivement-post-input" />
        </div>

        <div className="achivement-post-form-group">
          <label className="achivement-post-label">Achievement Category*</label>
          <select name="category" value={formData.category} onChange={handleInputChange} required className="achivement-post-select">
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="achivement-post-form-group">
          <label className="achivement-post-label">Tags*</label>
          <TagsInput
            value={formData.tags}
            onChange={(newTags) => setFormData({ ...formData, tags: newTags })}
            name="tags"
            placeHolder="Enter tags"
            classNames={{
              input: "achivement-post-tags-input",
              tag: "achivement-post-tag",
            }}
          />
        </div>

        <div className="achivement-post-form-group">
          <label className="achivement-post-label">Upload Achievement Image*</label>
          <input type="file" name="image" onChange={handleFileChange} required className="achivement-post-file" />
        </div>

        <button type="submit" className="achivement-post-button">Post Achievement</button>
      </form>
    </div>
  );
};

export default AdminPostAchievement;
