import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { TagsInput } from 'react-tag-input-component';
import axios from 'axios';
import './AdminPostAchievement.css';
import { API_URL } from '../../Api'; 

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
    uruHolderLink: '',
    address: '',
    effortType: '',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false); // 🔹 New state for loading

  // Fetch categories
  useEffect(() => {
    axios
      .get(`${API_URL}/categories`)
      .then((response) => {
        const sortedCategories = response.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCategories(sortedCategories);
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
    setLoading(true); // 🔹 Set loading when submitting

    const data = new FormData();
    data.append('title', formData.title);
    data.append('shortDescription', formData.shortDescription);
    data.append('content', formData.content);
    data.append('providerName', formData.providerName);
    data.append('achieverName', formData.achieverName);
    data.append('category', formData.category);
    data.append('tags', formData.tags.join(','));
    data.append('image', formData.image);
    data.append('uruHolderLink', formData.uruHolderLink);
    data.append('address', formData.address);
    data.append('effortType', formData.effortType);

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
          uruHolderLink: '',
          address: '',
          effortType: '',
        });
        setTimeout(() => setSuccessMsg(''), 4000);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false); // 🔹 Reset loading after success or error
      });
  };


  return (
    <div className="achivement-post-container">
      <h2 className="achivement-post-heading">Post Achievement</h2>

      {successMsg && <div className="achivement-post-success-alert">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="achivement-post-form">
      
        {/* 🔹 Rest of your fields */}
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
            height: 500,
            plugins:
              'anchor autolink charmap codesample emoticons image link lists media ' +
              'searchreplace table visualblocks visualchars wordcount code paste preview ' +
              'fullscreen insertdatetime advlist help',
            toolbar:
              'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough ' +
              '| forecolor backcolor | link image media table | align lineheight | numlist bullist indent outdent ' +
              '| emoticons charmap codesample | copy cut paste | removeformat | fullscreen preview code help',
            menubar: 'file edit view insert format tools table help',
            toolbar_mode: 'sliding',
            branding: false,

            // Enable clipboard context menu
            contextmenu: 'copy cut paste link image table',

            // Mobile optimized config
            mobile: {
              menubar: true,
              plugins: 'autosave lists autolink paste',
              toolbar:
                'undo redo | bold italic underline | forecolor backcolor | ' +
                'align bullist numlist | copy cut paste',
            },

            // Paste configuration
            paste_data_images: true,  // Allow pasting images
            paste_as_text: true,     // Keep formatting
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
          <label className="achivement-post-label">URU Holder Details Link</label>
          <div className="uru-holder-input-wrapper">
            <input
              type="url"
              name="uruHolderLink"
              placeholder="https://example.com/holder-details"
              value={formData.uruHolderLink}
              onChange={handleInputChange}
              className="achivement-post-input"
            />
          </div>
        </div>

          
        {/* 🔹 Address Field */}
        <div className="achivement-post-form-group">
          <label className="achivement-post-label">Address*</label>
          <input 
            type="text" 
            name="address" 
            value={formData.address} 
            onChange={handleInputChange} 
            required 
            className="achivement-post-input" 
          />
        </div>

        {/* 🔹 Effort Type Field */}
        <div className="achivement-post-form-group">
          <label className="achivement-post-label">Effort Type*</label>
          <select 
            name="effortType" 
            value={formData.effortType} 
            onChange={handleInputChange} 
            required 
            className="achivement-post-select"
          >
            <option value="">Select Effort Type</option>
            <option value="Individual Effort">Individual Effort</option>
            <option value="Group Effort">Group Effort</option>
          </select>
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

         <button 
          type="submit" 
          className="achivement-post-button" 
          disabled={loading}  // 🔹 Disable while loading
        >
          {loading ? "Posting..." : "Post Achievement"} {/* 🔹 Dynamic text */}
        </button>

      </form>
    </div>
  );
};

export default AdminPostAchievement;
