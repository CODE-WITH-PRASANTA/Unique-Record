import React, { useState } from "react";
import "./ManageCategory.css";
import {
  FaTrashAlt,
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

interface Category {
  id: number;
  name: string;
  published: boolean;
}

const ManageCategory: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Technology", published: true },
    { id: 2, name: "Education", published: false },
  ]);

  const [categoryName, setCategoryName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAddCategory = (e?: React.FormEvent) => {
    e?.preventDefault();
    const name = categoryName.trim();
    if (name === "") return;
    const newCategory: Category = {
      id: Date.now(),
      name,
      published: false,
    };
    setCategories((prev) => [...prev, newCategory]);
    setCategoryName("");
  };

  const handleDelete = (id: number) => {
    // optional: confirm before deleting
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingName("");
    }
  };

  const handleTogglePublish = (id: number) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, published: !cat.published } : cat))
    );
  };

  const startEdit = (catId: number, currentName: string) => {
    setEditingId(catId);
    setEditingName(currentName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = (id: number) => {
    const name = editingName.trim();
    if (name === "") {
      alert("Category name cannot be empty");
      return;
    }
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="ManageCategory-container">
      <h2 className="ManageCategory-heading">🗂️ Manage Category</h2>

      <div className="ManageCategory-content">
        {/* Left: form */}
        <aside className="ManageCategory-formSection">
          <h3 className="ManageCategory-subHeading">Add New Category</h3>

          <form
            className="ManageCategory-form"
            onSubmit={(e) => {
              handleAddCategory(e);
            }}
            aria-label="Add category form"
          >
            <label className="ManageCategory-label" htmlFor="categoryName">
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
              <button
                type="submit"
                className="ManageCategory-submitBtn"
                title="Add category"
              >
                Confirm
              </button>

              <button
                type="button"
                className="ManageCategory-clearBtn"
                onClick={() => setCategoryName("")}
                title="Clear"
              >
                Clear
              </button>
            </div>
          </form>
        </aside>

        {/* Right: table */}
        <section className="ManageCategory-tableSection" aria-live="polite">
          <h3 className="ManageCategory-subHeading">Category List</h3>

          <div className="ManageCategory-tableWrapper">
            <table className="ManageCategory-table" role="table">
              <thead>
                <tr>
                  <th>Sl. No</th>
                  <th>Category Name</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={cat.id}>
                    <td>{idx + 1}</td>

                    <td className="ManageCategory-nameCell">
                      {editingId === cat.id ? (
                        <input
                          className="ManageCategory-editInput"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          aria-label={`Edit name for ${cat.name}`}
                        />
                      ) : (
                        <span className="ManageCategory-nameText">{cat.name}</span>
                      )}
                    </td>

                    <td className="ManageCategory-actions">
                      {editingId === cat.id ? (
                        <>
                          <button
                            className="ManageCategory-actionBtn save"
                            onClick={() => saveEdit(cat.id)}
                            title="Save"
                            aria-label="Save edit"
                          >
                            <FaSave />
                          </button>
                          <button
                            className="ManageCategory-actionBtn cancel"
                            onClick={cancelEdit}
                            title="Cancel"
                            aria-label="Cancel edit"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="ManageCategory-actionBtn edit"
                            onClick={() => startEdit(cat.id, cat.name)}
                            title="Edit"
                            aria-label={`Edit ${cat.name}`}
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="ManageCategory-actionBtn publish"
                            onClick={() => handleTogglePublish(cat.id)}
                            title={cat.published ? "Unpublish" : "Publish"}
                            aria-pressed={cat.published}
                          >
                            {cat.published ? <FaEye /> : <FaEyeSlash />}
                          </button>

                          <button
                            className="ManageCategory-actionBtn delete"
                            onClick={() => handleDelete(cat.id)}
                            title="Delete"
                            aria-label={`Delete ${cat.name}`}
                          >
                            <FaTrashAlt />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}

                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="ManageCategory-empty">
                      No categories yet.
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
