import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminManageCategories.css';
import { API_URL } from '../../Api'; // adjust path as needed
import Swal from "sweetalert2";

const AdminManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editId, setEditId] = useState(null);

  const CATEGORY_API = `${API_URL}/categories`;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
  try {
    const res = await axios.get(CATEGORY_API);
    // Sort alphabetically A-Z
    const sortedCategories = res.data.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
    setCategories(sortedCategories);
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  }
};


  const handleAddCategory = async () => {
    if (inputValue.trim() === '') return;

    try {
      if (editId) {
        const res = await axios.put(`${CATEGORY_API}/${editId}`, { name: inputValue });
        setCategories(categories.map((cat) => (cat._id === editId ? res.data : cat)));
        setEditId(null);
      } else {
        const res = await axios.post(CATEGORY_API, { name: inputValue });
        setCategories([res.data, ...categories]);
      }
      setInputValue('');
    } catch (err) {
      console.error('Error saving category:', err.response?.data?.message || err.message);
    }
  };

const handleDelete = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`${CATEGORY_API}/${id}`);
        setCategories((prev) => prev.filter((cat) => cat._id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      } catch (err) {
        console.error("Error deleting category:", err);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while deleting.",
          icon: "error",
        });
      }
    }
  });
};

  const handleEdit = (id, name) => {
    setInputValue(name);
    setEditId(id);
  };

  return (
    <div className="Admin-category-container">
      <h2 className="Admin-category-title">Manage Categories</h2>

      <div className="Admin-category-input-section">
        <input
          type="text"
          className="Admin-category-input"
          placeholder="Write category..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="Admin-category-button" onClick={handleAddCategory}>
          {editId ? 'Update' : 'Submit'}
        </button>
      </div>

      <div className="Admin-category-list">
        {categories.map((category, index) => (
          <div key={category._id} className="Admin-category-item">
            <span className="Admin-category-serial">{index + 1}.</span>
            <span className="Admin-category-name">{category.name}</span>
            <div className="Admin-category-actions">
              <button
                className="Admin-category-edit-btn"
                onClick={() => handleEdit(category._id, category.name)}
              >
                Edit
              </button>
              <button
                className="Admin-category-delete-btn"
                onClick={() => handleDelete(category._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminManageCategories;