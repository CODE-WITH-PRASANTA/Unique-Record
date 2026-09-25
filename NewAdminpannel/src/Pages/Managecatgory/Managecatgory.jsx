import React, { useState } from 'react';
import './Managecatgory.css';

const Managecatgory = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Other' }
  ]);
  const [categoryName, setCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Handle Form Submit (Add or Update Category)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert('Please write a category name.');
      return;
    }

    if (editingId) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingId ? { ...cat, name: categoryName.trim() } : cat
        )
      );
      setEditingId(null);
      alert('Category updated successfully!');
    } else {
      const newCat = {
        id: Date.now(),
        name: categoryName.trim(),
      };
      setCategories([newCat, ...categories]);
      alert('Category added successfully!');
    }

    setCategoryName('');
  };

  // Edit Category
  const handleEdit = (cat) => {
    setCategoryName(cat.name);
    setEditingId(cat.id);
  };

  // Delete Category
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter((cat) => cat.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setCategoryName('');
      }
    }
  };

  return (
    <div className="mc-container">
      <div className="mc-wrapper">
        
        {/* Header Section */}
        <header className="mc-header-section">
          <h1 className="mc-main-title">Manage Categories</h1>
        </header>

        {/* Input & Submit Form Section */}
        <form className="mc-form-card" onSubmit={handleSubmit}>
          <div className="mc-input-group">
            <input 
              type="text" 
              className="mc-text-input" 
              placeholder="Write category..."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <button type="submit" className="mc-submit-btn">
              {editingId ? 'Update' : 'Submit'}
            </button>
            {editingId && (
              <button 
                type="button" 
                className="mc-cancel-btn"
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
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="mc-empty-row">No categories found.</td>
                  </tr>
                ) : (
                  categories.map((cat, index) => (
                    <tr key={cat.id} className="mc-table-row">
                      <td className="mc-col-sno">0{index + 1}</td>
                      <td className="mc-col-name"><strong>{cat.name}</strong></td>
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
                            onClick={() => handleDelete(cat.id)}
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