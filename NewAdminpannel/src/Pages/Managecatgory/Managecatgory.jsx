import React, { useState, useEffect } from 'react';
import API from '../../api/axiosInstance';
import './Managecatgory.css';

const Managecatgory = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all categories using axios instance
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get('/categories');
      if (res.data && res.data.success) {
        setCategories(res.data.data || []);
      } else {
        setError(res.data?.message || 'Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to connect to backend server.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Form Submit (Add or Update Category using axios)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = categoryName.trim();
    if (!trimmedName) {
      alert('Please write a category name.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        // Update category with PUT request
        const res = await API.put(`/categories/${editingId}`, {
          name: trimmedName,
        });

        if (res.data && res.data.success) {
          setCategories(
            categories.map((cat) => (cat._id === editingId ? res.data.data : cat))
          );
          setEditingId(null);
          setCategoryName('');
          alert('Category updated successfully!');
        } else {
          alert(res.data?.message || 'Failed to update category');
        }
      } else {
        // Create new category with POST request
        const res = await API.post('/categories', {
          name: trimmedName,
        });

        if (res.data && res.data.success) {
          setCategories([res.data.data, ...categories]);
          setCategoryName('');
          alert('Category added successfully!');
        } else {
          alert(res.data?.message || 'Failed to create category');
        }
      }
    } catch (err) {
      console.error('Error saving category:', err);
      const errMsg = err.response?.data?.message || err.message || 'Error saving category';
      alert(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Category
  const handleEdit = (cat) => {
    setCategoryName(cat.name);
    setEditingId(cat._id);
  };

  // Delete Category using axios DELETE
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const res = await API.delete(`/categories/${id}`);

      if (res.data && res.data.success) {
        setCategories(categories.filter((cat) => cat._id !== id));
        if (editingId === id) {
          setEditingId(null);
          setCategoryName('');
        }
        alert('Category deleted successfully!');
      } else {
        alert(res.data?.message || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to delete category';
      alert(errMsg);
    }
  };

  return (
    <div className="mc-container">
      <div className="mc-wrapper">
        {/* Header Section */}
        <header className="mc-header-section">
          <h1 className="mc-main-title">Manage Categories</h1>
        </header>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #f87171',
              color: '#b91c1c',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{error}</span>
            <button
              onClick={fetchCategories}
              style={{
                background: '#b91c1c',
                color: '#fff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Input & Submit Form Section */}
        <form className="mc-form-card" onSubmit={handleSubmit}>
          <div className="mc-input-group">
            <input
              type="text"
              className="mc-text-input"
              placeholder="Write category..."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              disabled={submitting}
            />
            <button type="submit" className="mc-submit-btn" disabled={submitting}>
              {submitting ? 'Saving...' : editingId ? 'Update' : 'Submit'}
            </button>
            {editingId && (
              <button
                type="button"
                className="mc-cancel-btn"
                disabled={submitting}
                onClick={() => {
                  setEditingId(null);
                  setCategoryName('');
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Categories Full-Width Table Section */}
        <section className="mc-table-section">
          <div className="mc-table-responsive">
            <table className="mc-data-table">
              <thead>
                <tr>
                  <th className="mc-col-sno">S.No.</th>
                  <th>Category Name</th>
                  <th className="mc-text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="mc-empty-row">
                      Loading categories from database...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="mc-empty-row">No categories found in database.</td>
                  </tr>
                ) : (
                  categories.map((cat, index) => (
                    <tr key={cat._id || index} className="mc-table-row">
                      <td className="mc-col-sno">
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td className="mc-col-name">
                        <strong>{cat.name}</strong>
                      </td>
                      <td className="mc-col-actions">
                        <div className="mc-action-group">
                          <button
                            className="mc-btn-edit"
                            onClick={() => handleEdit(cat)}
                          >
                            Edit
                          </button>
                          <button
                            className="mc-btn-delete"
                            onClick={() => handleDelete(cat._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Managecatgory;