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
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null); // 🔹 Track editing

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

  // Fetch achievements
  const fetchAchievements = () => {
    axios
      .get(`${API_URL}/achievements/get-all-achievements`)
      .then((response) => {
        setAchievements(response.data);
      })
      .catch((error) => {
        console.error('Error fetching achievements:', error);
      });
  };

  useEffect(() => {
    fetchAchievements();
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
  setLoading(true);

  if (editingId) {
    // 🔹 Update (send JSON, not FormData)
    const updateData = {
      title: formData.title,
      shortDescription: formData.shortDescription,
      content: formData.content,
      providerName: formData.providerName,
      achieverName: formData.achieverName,
      uruHolderLink: formData.uruHolderLink,
      category: formData.category,
      tags: formData.tags,
      address: formData.address,
      effortType: formData.effortType,
    };

    axios
      .put(`${API_URL}/achievements/update-achievement/${editingId}`, updateData)
      .then((response) => {
        setSuccessMsg('✅ Achievement updated successfully!');
        fetchAchievements();
        resetForm();
      })
      .catch((error) => {
        console.error('Error updating achievement:', error);
      })
      .finally(() => setLoading(false));
  } else {
    // 🔹 Create (send FormData because image is included)
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'tags') {
        data.append('tags', formData.tags.join(','));
      } else {
        data.append(key, formData[key]);
      }
    });

    axios
      .post(`${API_URL}/achievements/post-achievement`, data)
      .then((response) => {
        setSuccessMsg('🎉 Achievement posted successfully!');
        fetchAchievements();
        resetForm();
      })
      .catch((error) => {
        console.error('Error posting achievement:', error);
      })
      .finally(() => setLoading(false));
        }
      };

      // 🔹 Helper function to reset form
      const resetForm = () => {
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
        setEditingId(null);
        setTimeout(() => setSuccessMsg(''), 4000);
      };


      const handleEdit = (achievement) => {
        setEditingId(achievement._id);
        setFormData({
          title: achievement.title,
          shortDescription: achievement.shortDescription,
          content: achievement.content,
          providerName: achievement.providerName,
          achieverName: achievement.achieverName,
          category: achievement.category,
          tags: Array.isArray(achievement.tags)
            ? achievement.tags
            : achievement.tags
            ? achievement.tags.split(',').map(tag => tag.trim())
            : [],
          image: null,
          uruHolderLink: achievement.uruHolderLink,
          address: achievement.address,
          effortType: achievement.effortType,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };


  return (
    <div className="achievement-admin-container">
      <h2 className="achievement-admin-heading">
        {editingId ? 'Edit Achievement' : 'Post Achievement'}
      </h2>

      {successMsg && (
        <div className="achievement-admin-success">{successMsg}</div>
      )}

      {/* 🔹 Form Section */}
      <form onSubmit={handleSubmit} className="achievement-admin-form">
 
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
            value={Array.isArray(formData.tags) ? formData.tags : []}
            onChange={(newTags) => setFormData({ ...formData, tags: newTags })}
            name="tags"
            placeHolder="Enter tags"
            classNames={{
              root: "achivement-post-tags-root",
              input: "achivement-post-tags-input",
              tag: "achivement-post-tag",
            }}
          />
        </div>

       <div className="achivement-post-form-group">
  <label className="achivement-post-label">Upload Achievement Image{!editingId && '*'}</label>
  <input
    type="file"
    name="image"
    onChange={handleFileChange}
    required={!editingId}   // 🔹 required only when creating
    className="achivement-post-file"
  />
        </div>


        <button
          type="submit"
          className="achievement-admin-button"
          disabled={loading}
        >
          {loading
            ? editingId
              ? 'Updating...'
              : 'Posting...'
            : editingId
            ? 'Update Achievement'
            : 'Post Achievement'}
        </button>
      </form>

      {/* 🔹 Table Section */}
      <h3 className="achievement-admin-table-heading">All Achievements</h3>
      <table className="achievement-admin-table">
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Title</th>
            <th>Achiever</th>
            <th>Effort Type</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
       <tbody>
        {achievements.length > 0 ? (
          [...achievements].reverse().map((ach, index) => (
            <tr key={ach._id}>
              <td>{index + 1}</td> {/* Serial stays in correct order */}
              <td>{ach.title}</td>
              <td>{ach.achieverName}</td>
              <td>{ach.effortType}</td>
              <td>{ach.category}</td>
              <td>
                <button
                  className="achievement-admin-edit-btn"
                  onClick={() => handleEdit(ach)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="achievement-admin-empty">
              No achievements found.
            </td>
          </tr>
        )}
      </tbody>

      </table>

    </div>
  );
};

export default AdminPostAchievement;
