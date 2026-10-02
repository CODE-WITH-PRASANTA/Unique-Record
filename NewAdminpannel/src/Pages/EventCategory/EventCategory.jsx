import React, { useState, useEffect, useCallback } from 'react';
import {
  FaFolderPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaListOl,
  FaUndo,
} from 'react-icons/fa';
import API from '../../api/axiosInstance';
import './EventCategory.css';

const emptyForm = {
  name: '',
  description: '',
  status: 'Active',
};

const EventCategory = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ show: false, text: '', type: 'success' });

  const showToast = (text, type = 'success') => {
    setMessage({ show: true, text, type });
    window.clearTimeout(window.__ecToast);
    window.__ecToast = window.setTimeout(() => {
      setMessage({ show: false, text: '', type: 'success' });
    }, 3500);
  };

  // Fetch Event Categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/event-categories');
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setCategories(list);
    } catch (err) {
      console.error('Error fetching event categories:', err);
      showToast('Failed to load event categories from server.', 'error');
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
        const res = await API.put(`/event-categories/${editingId}`, {
          name: trimmedName,
          description: formData.description.trim(),
          status: formData.status,
        });

        if (res.data?.success || res.status === 200) {
          showToast('Event category updated successfully!');
          resetForm();
          fetchCategories();
        } else {
          showToast(res.data?.message || 'Failed to update category', 'error');
        }
      } else {
        const res = await API.post('/event-categories', {
          name: trimmedName,
          description: formData.description.trim(),
          status: formData.status,
        });

        if (res.data?.success || res.status === 201) {
          showToast('Event category created successfully!');
          resetForm();
          fetchCategories();
        } else {
          showToast(res.data?.message || 'Failed to create category', 'error');
        }
      }
    } catch (err) {
      console.error('Error saving event category:', err);
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
        `Are you sure you want to delete the event category "${name}"?`
      )
    ) {
      try {
        await API.delete(`/event-categories/${id}`);
        showToast('Event category deleted successfully!');
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
      const res = await API.patch(`/event-categories/${id}/status`);
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
    <div className="ec-page-container">
      {/* Toast Notification */}
      {message.show && (
        <div className={`ec-toast ec-toast-${message.type}`}>
          {message.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
          <span>{message.text}</span>
          <button
            type="button"
            className="ec-toast-close"
            onClick={() => setMessage({ show: false, text: '', type: 'success' })}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Header Section */}
      <header className="ec-header">
        <div className="ec-header-title">
          <div className="ec-header-icon">
            <FaCalendarAlt />
          </div>
          <div>
            <h1>Event Categories</h1>
            <p>Create and manage dynamic categories for all events.</p>
          </div>
        </div>

        <div className="ec-stats-pills">
          <div className="ec-stat-pill">
            <span>Total Categories:</span>
            <strong>{categories.length}</strong>
          </div>
          <div className="ec-stat-pill ec-stat-active">
            <span>Active:</span>
            <strong>{activeCount}</strong>
          </div>
        </div>
      </header>

      {/* Main Grid: Form Card + Table */}
      <div className="ec-grid">
        {/* Left Form Card */}
        <div className="ec-card ec-form-card">
          <div className="ec-card-header">
            <h3>{editingId ? 'Edit Category' : 'Add New Event Category'}</h3>
          </div>

          <form onSubmit={handleSubmit} className="ec-form">
            <div className="ec-form-group">
              <label>Category Name*</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Sports, Workshop, Cultural, Seminar..."
                value={formData.name}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>

            <div className="ec-form-group">
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

            <div className="ec-form-group">
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

            <div className="ec-form-actions">
              {editingId && (
                <button
                  type="button"
                  className="ec-btn-cancel"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  <FaUndo /> Cancel
                </button>
              )}
              <button type="submit" className="ec-btn-submit" disabled={submitting}>
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
        <div className="ec-card ec-table-card">
          <div className="ec-card-header ec-table-header">
            <h3>
              <FaListOl /> Existing Event Categories ({filteredCategories.length})
            </h3>

            <div className="ec-search-box">
              <FaSearch className="ec-search-icon" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="ec-search-clear"
                  onClick={() => setSearchTerm('')}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          <div className="ec-table-responsive">
            <table className="ec-table">
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
                    <td colSpan="5" className="ec-table-empty">
                      Loading categories from database...
                    </td>
                  </tr>
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="ec-table-empty">
                      No event categories found.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat, index) => (
                    <tr key={cat._id}>
                      <td className="ec-td-num">{index + 1}</td>
                      <td className="ec-td-name">
                        <strong>{cat.name}</strong>
                      </td>
                      <td className="ec-td-desc">
                        {cat.description || <span className="ec-text-muted">—</span>}
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`ec-status-badge ${
                            cat.status === 'Active'
                              ? 'ec-status-active'
                              : 'ec-status-inactive'
                          }`}
                          onClick={() => handleToggleStatus(cat._id)}
                          title="Click to toggle status"
                        >
                          {cat.status || 'Active'}
                        </button>
                      </td>
                      <td className="ec-td-actions">
                        <button
                          type="button"
                          className="ec-action-btn ec-action-edit"
                          onClick={() => handleEdit(cat)}
                          title="Edit Category"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          className="ec-action-btn ec-action-delete"
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

export default EventCategory;
