import React, { useState, useEffect, useCallback } from 'react';
import {
  FaUndo,
  FaRedo,
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaLink,
  FaImage,
  FaTable,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaQuoteRight,
} from 'react-icons/fa';
import API from '../../api/axiosInstance';
import './ArchivementPost.css';

const initialFormData = {
  title: '',
  shortDesc: '',
  content: '',
  providerName: '',
  achieverName: '',
  holderLink: '',
  address: '',
  effortType: '',
  category: '',
  tags: '',
};

const ArchivementPost = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [imagePreview, setImagePreview] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all categories directly from /categories (categories/manage)
  const fetchCategories = useCallback(async () => {
    try {
      const res = await API.get('/categories');
      const catList = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      const names = [];
      catList.forEach((c) => {
        if (c.isActive !== false) {
          const n = typeof c === 'string' ? c : c.name;
          if (n && n.trim()) names.push(n.trim());
        }
      });
      if (names.length > 0) {
        setCategories([...new Set(names)]);
      }
    } catch (err) {
      console.error('Error fetching categories from /categories:', err);
    }
  }, []);

  // Fetch all achievements from backend
  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/achievements/all');
      if (Array.isArray(res.data)) {
        setAchievements(res.data);
      } else if (res.data && Array.isArray(res.data.data)) {
        setAchievements(res.data.data);
      } else {
        setAchievements([]);
      }
    } catch (err) {
      console.error('Error fetching achievements:', err);
      try {
        const fallback = await API.get('/achievements');
        if (Array.isArray(fallback.data)) {
          setAchievements(fallback.data);
        } else if (fallback.data && Array.isArray(fallback.data.data)) {
          setAchievements(fallback.data.data);
        }
      } catch (fallbackErr) {
        console.error('Fallback fetch error:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAchievements();
    fetchCategories();
  }, [fetchAchievements, fetchCategories]);

  // Handle standard input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setFileName('No file chosen');
      setImagePreview(null);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedFile(null);
    setFileName('No file chosen');
    setImagePreview(null);
    setEditingId(null);
  };

  // Form Submit / Post Achievement to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.achieverName || !formData.effortType || !formData.category) {
      alert('Please fill out all required fields (*).');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('shortDesc', formData.shortDesc.trim());
      data.append('shortDescription', formData.shortDesc.trim());
      data.append('content', formData.content || '');
      data.append('providerName', formData.providerName.trim() || 'Unique Record');
      data.append('achieverName', formData.achieverName.trim());
      data.append('holderLink', formData.holderLink.trim());
      data.append('uruHolderLink', formData.holderLink.trim());
      data.append('address', formData.address.trim());
      data.append('effortType', formData.effortType);
      data.append('category', formData.category);
      data.append('tags', formData.tags);

      if (selectedFile) {
        data.append('image', selectedFile);
      } else if (imagePreview && typeof imagePreview === 'string') {
        data.append('image', imagePreview);
      }

      if (editingId) {
        const res = await API.put(`/achievements/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data?.success || res.status === 200) {
          alert('Achievement updated successfully!');
          resetForm();
          fetchAchievements();
        } else {
          alert(res.data?.message || 'Failed to update achievement.');
        }
      } else {
        const res = await API.post('/achievements', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data?.success || res.status === 201) {
          alert('Achievement posted successfully!');
          resetForm();
          fetchAchievements();
        } else {
          alert(res.data?.message || 'Failed to post achievement.');
        }
      }
    } catch (err) {
      console.error('Error saving achievement:', err);
      alert(err.response?.data?.message || 'Error saving achievement into database.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Record from backend
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        await API.delete(`/achievements/${id}`);
        alert('Achievement deleted successfully!');
        if (editingId === id) resetForm();
        fetchAchievements();
      } catch (err) {
        console.error('Error deleting achievement:', err);
        alert(err.response?.data?.message || 'Error deleting achievement from database.');
      }
    }
  };

  // Edit Record
  const handleEdit = (item) => {
    const targetId = item._id || item.id;
    setEditingId(targetId);

    const tagsStr = Array.isArray(item.tags)
      ? item.tags.join(', ')
      : item.tags || '';

    setFormData({
      title: item.title || '',
      shortDesc: item.shortDesc || item.shortDescription || '',
      content: item.content || '',
      providerName: item.providerName || '',
      achieverName: item.achieverName || '',
      holderLink: item.holderLink || item.uruHolderLink || '',
      address: item.address || '',
      effortType: item.effortType || '',
      category: item.category || '',
      tags: tagsStr,
    });

    const existingImg = item.image || item.imageUrl || null;
    setImagePreview(existingImg);
    setFileName(existingImg ? 'Existing Image Loaded' : 'No file chosen');
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="ap-container">
      <div className="ap-wrapper">
        {/* Main Title Section */}
        <header className="ap-header-section">
          <h1 className="ap-main-title">
            {editingId ? 'Edit Achievement' : 'Post Achievement'}
          </h1>
        </header>

        {/* Post Achievement Form Card */}
        <form className="ap-form-card" onSubmit={handleSubmit}>
          {/* Achievement Title */}
          <div className="ap-form-group">
            <label className="ap-label">Achievement Title*</label>
            <input
              type="text"
              name="title"
              className="ap-text-input"
              placeholder="Enter achievement title..."
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Short Description */}
          <div className="ap-form-group">
            <label className="ap-label">Achievement Short Description*</label>
            <textarea
              name="shortDesc"
              className="ap-textarea-input"
              placeholder="Enter brief description..."
              rows="4"
              value={formData.shortDesc}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Achievement Content (Rich Text Editor Simulation) */}
          <div className="ap-form-group">
            <label className="ap-label">Achievement Content*</label>
            <div className="ap-editor-container">
              <div className="ap-editor-menubar">
                <span className="ap-menu-item">File</span>
                <span className="ap-menu-item">Edit</span>
                <span className="ap-menu-item">View</span>
                <span className="ap-menu-item">Insert</span>
                <span className="ap-menu-item">Format</span>
                <span className="ap-menu-item">Tools</span>
                <span className="ap-menu-item">Table</span>
                <span className="ap-menu-item">Help</span>
              </div>

              <div className="ap-editor-toolbar">
                <div className="ap-toolbar-group">
                  <button type="button" className="ap-tool-btn" title="Undo">
                    <FaUndo />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Redo">
                    <FaRedo />
                  </button>
                </div>

                <span className="ap-toolbar-divider" />

                <div className="ap-toolbar-group">
                  <select className="ap-editor-select">
                    <option>Paragraph</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                  </select>
                  <select className="ap-editor-select">
                    <option>System Font</option>
                  </select>
                  <select className="ap-editor-select ap-editor-select-sm">
                    <option>12pt</option>
                    <option>14pt</option>
                  </select>
                </div>

                <span className="ap-toolbar-divider" />

                <div className="ap-toolbar-group">
                  <button type="button" className="ap-tool-btn" title="Bold">
                    <FaBold />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Italic">
                    <FaItalic />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Underline">
                    <FaUnderline />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Strikethrough">
                    <FaStrikethrough />
                  </button>
                </div>

                <span className="ap-toolbar-divider" />

                <div className="ap-toolbar-group">
                  <button type="button" className="ap-tool-btn" title="Align Left">
                    <FaAlignLeft />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Align Center">
                    <FaAlignCenter />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Align Right">
                    <FaAlignRight />
                  </button>
                </div>

                <span className="ap-toolbar-divider" />

                <div className="ap-toolbar-group">
                  <button type="button" className="ap-tool-btn" title="Bullet List">
                    <FaListUl />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Numbered List">
                    <FaListOl />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Quote">
                    <FaQuoteRight />
                  </button>
                </div>

                <span className="ap-toolbar-divider" />

                <div className="ap-toolbar-group">
                  <button type="button" className="ap-tool-btn" title="Insert Link">
                    <FaLink />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Insert Image">
                    <FaImage />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Insert Table">
                    <FaTable />
                  </button>
                </div>
              </div>

              <textarea
                name="content"
                className="ap-editor-textarea"
                placeholder="Write detailed content here..."
                rows="6"
                value={formData.content}
                onChange={handleChange}
              ></textarea>

              <div className="ap-editor-footer">
                <span>p</span>
                <span>Press Alt+0 for help</span>
                <span>{formData.content?.length || 0} characters</span>
              </div>
            </div>
          </div>

          {/* Achievement Provider Name */}
          <div className="ap-form-group">
            <label className="ap-label">Achievement Provider Name*</label>
            <input
              type="text"
              name="providerName"
              className="ap-text-input"
              placeholder="Enter provider name..."
              value={formData.providerName}
              onChange={handleChange}
            />
          </div>

          {/* Achiever Name */}
          <div className="ap-form-group">
            <label className="ap-label">Achiever Name*</label>
            <input
              type="text"
              name="achieverName"
              className="ap-text-input"
              placeholder="Enter achiever name..."
              value={formData.achieverName}
              onChange={handleChange}
              required
            />
          </div>

          {/* URU Holder Details Link */}
          <div className="ap-form-group">
            <label className="ap-label">URU Holder Details Link</label>
            <input
              type="text"
              name="holderLink"
              className="ap-text-input"
              placeholder="https://example.com/holder"
              value={formData.holderLink}
              onChange={handleChange}
            />
          </div>

          {/* Address */}
          <div className="ap-form-group">
            <label className="ap-label">Address*</label>
            <input
              type="text"
              name="address"
              className="ap-text-input"
              placeholder="Enter full address..."
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Effort Type */}
          <div className="ap-form-group">
            <label className="ap-label">Effort Type*</label>
            <div className="ap-select-wrapper">
              <select
                name="effortType"
                className="ap-select-input"
                value={formData.effortType}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Effort Type
                </option>
                <option value="Individual">Individual Effort</option>
                <option value="Team">Team Effort</option>
                <option value="Organizational">Organizational</option>
              </select>
            </div>
          </div>

          {/* Achievement Category */}
          <div className="ap-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="ap-label" style={{ marginBottom: 0 }}>Category*</label>
              <a
                href="/categories/manage"
                style={{ fontSize: '12px', color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}
              >
                + Manage Categories
              </a>
            </div>
            <div className="ap-select-wrapper">
              <select
                name="category"
                className="ap-select-input"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  {categories.length === 0 ? 'Loading categories...' : 'Select Category'}
                </option>
                {formData.category && !categories.includes(formData.category) && (
                  <option value={formData.category}>{formData.category}</option>
                )}
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="ap-form-group">
            <label className="ap-label">Tags*</label>
            <input
              type="text"
              name="tags"
              className="ap-text-input"
              placeholder="Enter tags separated by commas..."
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          {/* Upload Achievement Image */}
          <div className="ap-form-group">
            <label className="ap-label">Upload Achievement Image*</label>
            <div className="ap-file-picker-container">
              <label className="ap-file-custom-btn">
                Choose File
                <input
                  type="file"
                  className="ap-file-hidden-input"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <span className="ap-file-name-display">{fileName}</span>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="ap-file-preview-thumb" />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="ap-form-actions">
            {editingId && (
              <button
                type="button"
                className="ap-btn-edit"
                style={{ marginRight: '10px', padding: '10px 20px', cursor: 'pointer' }}
                onClick={resetForm}
                disabled={submitting}
              >
                Cancel Edit
              </button>
            )}
            <button type="submit" className="ap-submit-btn" disabled={submitting}>
              {submitting
                ? 'Saving...'
                : editingId
                ? 'Update Achievement'
                : 'Post Achievement'}
            </button>
          </div>
        </form>

        {/* All Achievements Table Section */}
        <section className="ap-table-section">
          <h2 className="ap-table-heading">All Achievements</h2>
          <div className="ap-table-responsive">
            <table className="ap-data-table">
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Achiever</th>
                  <th>Effort Type</th>
                  <th>Category</th>
                  <th className="ap-text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="ap-empty-row">
                      Loading achievements from database...
                    </td>
                  </tr>
                ) : achievements.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="ap-empty-row">
                      No achievements found.
                    </td>
                  </tr>
                ) : (
                  achievements.map((item, index) => {
                    const itemId = item._id || item.id;
                    const itemImage = item.image || item.imageUrl;
                    return (
                      <tr key={itemId} className="ap-table-row">
                        <td className="ap-col-sno">{index + 1}</td>
                        <td className="ap-col-image">
                          {itemImage ? (
                            <img src={itemImage} alt={item.title} className="ap-table-thumb" />
                          ) : (
                            <span className="ap-table-thumb ap-table-thumb-placeholder">
                              <FaImage />
                            </span>
                          )}
                        </td>
                        <td className="ap-col-title">
                          <strong>{item.title}</strong>
                        </td>
                        <td className="ap-col-achiever">{item.achieverName}</td>
                        <td>{item.effortType}</td>
                        <td>
                          <span className="ap-category-pill">{item.category}</span>
                        </td>
                        <td className="ap-col-actions">
                          <div className="ap-action-group">
                            <button
                              type="button"
                              className="ap-btn-edit"
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="ap-btn-delete"
                              onClick={() => handleDelete(itemId)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ArchivementPost;