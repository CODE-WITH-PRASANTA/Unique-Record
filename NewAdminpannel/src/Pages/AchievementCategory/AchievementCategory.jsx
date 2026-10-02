import React, { useState, useEffect, useCallback } from 'react';
import {
  FaFolderPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaLayerGroup,
  FaListOl,
  FaUndo,
} from 'react-icons/fa';
import API from '../../api/axiosInstance';
import './AchievementCategory.css';

const emptyForm = {
  name: '',
  description: '',
  status: 'Active',
};

const AchievementCategory = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ show: false, text: '', type: 'success' });

  const showToast = (text, type = 'success') => {
    setMessage({ show: true, text, type });
    window.clearTimeout(window.__catToast);
    window.__catToast = window.setTimeout(() => {
      setMessage({ show: false, text: '', type: 'success' });
    }, 3500);
  };

  // Fetch Achievement Categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/achievement-categories');
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setCategories(list);
    } catch (err) {
      console.error('Error fetching achievement categories:', err);
      showToast('Failed to load achievement categories from server.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset Form
  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  // Submit Category (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      showToast('Please enter category name.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        const res = await API.put(`/achievement-categories/${editingId}`, {
          name: trimmedName,
          description: formData.description.trim(),
          status: formData.status,
        });

        if (res.data?.success || res.status === 200) {
          showToast('Achievement category updated successfully!');
          resetForm();
          fetchCategories();
        } else {
          showToast(res.data?.message || 'Failed to update category', 'error');
        }
      } else {
        const res = await API.post('/achievement-categories', {
          name: trimmedName,
          description: formData.description.trim(),
          status: formData.status,
        });

        if (res.data?.success || res.status === 201) {
          showToast('Achievement category created successfully!');
          resetForm();
          fetchCategories();
        } else {
          showToast(res.data?.message || 'Failed to create category', 'error');
        }
      }
    } catch (err) {
      console.error('Error saving achievement category:', err);
      showToast(
        err.response?.data?.message || 'Error saving category into database.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Category
  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      status: cat.status || 'Active',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Category
  const handleDelete = async (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to delete the category "${name}"?`
      )
    ) {
      try {
        await API.delete(`/achievement-categories/${id}`);
        showToast('Achievement category deleted successfully!');
        if (editingId === id) resetForm();
        fetchCategories();
      } catch (err) {
        console.error('Error deleting category:', err);
        showToast(
          err.response?.data?.message || 'Error deleting category.',
          'error'
        );
      }
    }
  };

  // Toggle Status
  const handleToggleStatus = async (id) => {
    try {
      const res = await API.patch(`/achievement-categories/${id}/status`);
      if (res.data?.success || res.status === 200) {
        showToast(res.data?.message || 'Status updated successfully!');
        fetchCategories();
      }
    } catch (err) {
      console.error('Error toggling status:', err);
      showToast('Failed to update category status.', 'error');
    }
  };

  // Filtered List
  const filteredCategories = categories.filter((cat) => {
    const q = searchTerm.toLowerCase().trim();
    return (
      !q ||
      cat.name?.toLowerCase().includes(q) ||
      cat.description?.toLowerCase().includes(q) ||
      cat.status?.toLowerCase().includes(q)
    );
  });

  const activeCount = categories.filter((c) => c.status === 'Active').length;

  return (
    <div className="ac-page-container">
      {/* Toast Notification */}
      {message.show && (
        <div className={`ac-toast ac-toast-${message.type}`}>
          {message.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
          <span>{message.text}</span>
          <button
            type="button"
            className="ac-toast-close"
            onClick={() => setMessage({ show: false, text: '', type: 'success' })}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Header Section */}
      <header className="ac-header">
        <div className="ac-header-title">
          <div className="ac-header-icon">
            <FaLayerGroup />
          </div>
          <div>
            <h1>Achievement Categories</h1>
            <p>Create and organize dynamic categories for record achievements.</p>
          </div>
        </div>

        <div className="ac-stats-pills">
          <div className="ac-stat-pill">
            <span>Total Categories:</span>
            <strong>{categories.length}</strong>
          </div>
          <div className="ac-stat-pill ac-stat-active">
            <span>Active:</span>
            <strong>{activeCount}</strong>
          </div>
        </div>
      </header>

      {/* Main Grid: Form Card + Table */}
      <div className="ac-grid">
        {/* Left Form Card */}
        <div className="ac-card ac-form-card">
          <div className="ac-card-header">
            <h3>{editingId ? 'Edit Category' : 'Add New Achievement Category'}</h3>
          </div>

          <form onSubmit={handleSubmit} className="ac-form">
            <div className="ac-form-group">
              <label>Category Name*</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. World Record, Sports, Academic..."
                value={formData.name}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>

            <div className="ac-form-group">
              <label>Description (Optional)</label>
              <textarea
                name="description"
                placeholder="Brief description for this category..."
                rows="3"
                value={formData.description}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div className="ac-form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="ac-form-actions">
              {editingId && (
                <button
                  type="button"
                  className="ac-btn-cancel"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  <FaUndo /> Cancel
                </button>
              )}
              <button type="submit" className="ac-btn-submit" disabled={submitting}>
                <FaFolderPlus />
                {submitting
                  ? 'Saving...'
                  : editingId
                  ? 'Update Category'
                  : 'Save Category'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Table Card */}
        <div className="ac-card ac-table-card">
          <div className="ac-card-header ac-table-header">
            <h3>
              <FaListOl /> Existing Categories ({filteredCategories.length})
            </h3>

            <div className="ac-search-box">
              <FaSearch className="ac-search-icon" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="ac-search-clear"
                  onClick={() => setSearchTerm('')}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          <div className="ac-table-responsive">
            <table className="ac-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>#</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="ac-table-empty">
                      Loading categories from database...
                    </td>
                  </tr>
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="ac-table-empty">
                      No achievement categories found.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat, index) => (
                    <tr key={cat._id}>
                      <td className="ac-td-num">{index + 1}</td>
                      <td className="ac-td-name">
                        <strong>{cat.name}</strong>
                      </td>
                      <td className="ac-td-desc">
                        {cat.description || <span className="ac-text-muted">—</span>}
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`ac-status-badge ${
                            cat.status === 'Active'
                              ? 'ac-status-active'
                              : 'ac-status-inactive'
                          }`}
                          onClick={() => handleToggleStatus(cat._id)}
                          title="Click to toggle status"
                        >
                          {cat.status || 'Active'}
                        </button>
                      </td>
                      <td className="ac-td-actions">
                        <button
                          type="button"
                          className="ac-action-btn ac-action-edit"
                          onClick={() => handleEdit(cat)}
                          title="Edit Category"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          className="ac-action-btn ac-action-delete"
                          onClick={() => handleDelete(cat._id, cat.name)}
                          title="Delete Category"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCategory;
