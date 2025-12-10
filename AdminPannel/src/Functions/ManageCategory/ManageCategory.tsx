import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageCategory.css";
import {
  FaTrashAlt,
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaSave,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import { API_URL } from "../Api";

interface Category {
  _id: string;
  name: string;
  published: boolean;
}

const ManageCategory: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Sort A-Z before rendering
  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Filter categories based on search
  const filteredCategories = sortedCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!categoryName.trim()) return;

    try {
      const res = await axios.post(`${API_URL}/categories`, {
        name: categoryName,
      });

      setCategories((prev) => [...prev, res.data]);
      setCategoryName("");
    } catch (error: any) {
      alert(error.response?.data?.message || "Error creating category");
    }
  };

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = async (id: string) => {
    if (!editingName.trim()) {
      alert("Category name cannot be empty");
      return;
    }

    try {
      const res = await axios.put(`${API_URL}/categories/${id}`, {
        name: editingName,
      });

      setCategories((prev) =>
        prev.map((c) => (c._id === id ? res.data : c))
      );

      cancelEdit();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error updating category");
    }
  };

  const handleTogglePublish = async (id: string, state: boolean) => {
    try {
      const res = await axios.patch(
        `${API_URL}/categories/${id}/publish`,
        { published: !state }
      );

      setCategories((prev) =>
        prev.map((c) => (c._id === id ? res.data : c))
      );
    } catch (error) {
      console.error("Error updating publish state:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${API_URL}/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="ManageCategory-container">
      <h2 className="ManageCategory-heading">🗂️ Manage Category</h2>

      <div className="ManageCategory-content">
        
        {/* Left Form */}
        <aside className="ManageCategory-formSection">
          <h3 className="ManageCategory-subHeading">Add New Category</h3>

          <form className="ManageCategory-form" onSubmit={handleAddCategory}>
            <label htmlFor="categoryName" className="ManageCategory-label">
              Category Name
            </label>

            <input
              id="categoryName"
              type="text"
              className="ManageCategory-input"
              placeholder="Enter Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />

            <div className="ManageCategory-formButtons">
              <button type="submit" className="ManageCategory-submitBtn">
                Confirm
              </button>
              <button
                type="button"
                className="ManageCategory-clearBtn"
                onClick={() => setCategoryName("")}
              >
                Clear
              </button>
            </div>
          </form>
        </aside>


        {/* Table Section */}
        <section className="ManageCategory-tableSection">
          <div className="ManageCategory-headerRow">
            <h3 className="ManageCategory-subHeading">Category List</h3>

            {/* 🔍 Search Input */}
            <div className="ManageCategory-searchWrapper">
              <FaSearch className="ManageCategory-searchIcon" />
              <input
                type="text"
                placeholder="Search category..."
                className="ManageCategory-searchInput"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="ManageCategory-tableWrapper">
            <table className="ManageCategory-table">
              <thead>
                <tr>
                  <th>Sl. No (A - Z)</th>
                  <th>Category Name</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.map((cat, index) => (
                  <tr key={cat._id}>
                    <td>{index + 1}</td>

                    <td className="ManageCategory-nameCell">
                      {editingId === cat._id ? (
                        <input
                          className="ManageCategory-editInput"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                        />
                      ) : (
                        <span className="ManageCategory-nameText">{cat.name}</span>
                      )}
                    </td>

                    <td className="ManageCategory-actions">
                      {editingId === cat._id ? (
                        <>
                          <button
                            className="ManageCategory-actionBtn save"
                            onClick={() => saveEdit(cat._id)}
                          >
                            <FaSave />
                          </button>
                          <button
                            className="ManageCategory-actionBtn cancel"
                            onClick={cancelEdit}
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="ManageCategory-actionBtn edit"
                            onClick={() => startEdit(cat._id, cat.name)}
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="ManageCategory-actionBtn publish"
                            onClick={() =>
                              handleTogglePublish(cat._id, cat.published)
                            }
                          >
                            {cat.published ? <FaEye /> : <FaEyeSlash />}
                          </button>

                          <button
                            className="ManageCategory-actionBtn delete"
                            onClick={() => handleDelete(cat._id)}
                          >
                            <FaTrashAlt />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredCategories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="ManageCategory-empty">
                      No categories match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ManageCategory;
