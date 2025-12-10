import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaTimes,
  FaCheck,
  FaImage,
} from "react-icons/fa";
import "./PostEventPhotos.css";

type PhotoItem = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  imageDataUrl?: string; // base64 preview or url
  filename?: string;
};

const DEFAULT_PLACEHOLDER = "/mnt/data/5f08f5a4-b73c-43b4-994e-21e4a0074c6a.jpg";

const uid = () => Math.random().toString(36).slice(2, 9);

const PostEventPhotos: React.FC = () => {
  // form state
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [tagsText, setTagsText] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );

  // items list
  const [items, setItems] = useState<PhotoItem[]>([
    {
      id: uid(),
      title: "Opening Ceremony — Team Photo",
      category: "Ceremony",
      tags: ["opening", "team", "stage"],
      imageDataUrl: DEFAULT_PLACEHOLDER,
      filename: "opening.jpg",
    },
    {
      id: uid(),
      title: "Workshop — Robotics Demo",
      category: "Workshop",
      tags: ["robotics", "demo"],
      imageDataUrl: DEFAULT_PLACEHOLDER,
      filename: "workshop.jpg",
    },
  ]);

  // editing
  const [editingId, setEditingId] = useState<string | null>(null);

  // modal state for delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // helpers
  const resetForm = () => {
    setTitle("");
    setCategory("");
    setTagsText("");
    setImageFile(null);
    setImagePreview(undefined);
    setEditingId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setImageFile(f);
    if (!f) {
      setImagePreview(undefined);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(String(reader.result));
    };
    reader.readAsDataURL(f);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingId) {
      // update existing
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingId
            ? {
                ...it,
                title: title || it.title,
                category: category || it.category,
                tags,
                imageDataUrl: imagePreview ?? it.imageDataUrl,
                filename: imageFile?.name ?? it.filename,
              }
            : it
        )
      );
      resetForm();
      return;
    }

    // add new
    const newItem: PhotoItem = {
      id: uid(),
      title: title || "Untitled Photo",
      category: category || "Uncategorized",
      tags,
      imageDataUrl: imagePreview || DEFAULT_PLACEHOLDER,
      filename: imageFile?.name ?? "placeholder.jpg",
    };
    setItems((p) => [newItem, ...p]);
    resetForm();
  };

  const handleEdit = (id: string) => {
    const it = items.find((x) => x.id === id);
    if (!it) return;
    setEditingId(id);
    setTitle(it.title);
    setCategory(it.category);
    setTagsText((it.tags || []).join(", "));
    setImagePreview(it.imageDataUrl);
    setImageFile(null);
    // scroll into view on small screens
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const confirmDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const doDelete = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setConfirmDeleteId(null);
    // if we were editing the deleted item, reset form
    if (editingId === id) resetForm();
  };

  const cancelDelete = () => setConfirmDeleteId(null);

  return (
    <div className="pep-root">
      <div className="pep-inner">
        {/* LEFT: form */}
        <div className="pep-left">
          <div className="pep-card">
            <div className="pep-card-header">
              <h2 className="pep-title">
                {editingId ? "Edit Photo" : "Post Event Photo"}
              </h2>
              <div className="pep-sub">Upload an image and fill details</div>
            </div>

            <form className="pep-form" onSubmit={handleSubmit} noValidate>
              <label className="pep-label" htmlFor="pep-file">
                Upload Image
              </label>

              <div className="pep-uploader">
                <div className="pep-preview">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="pep-preview-img"
                    />
                  ) : (
                    <div className="pep-placeholder" aria-hidden>
                      <FaImage size={28} />
                      <div className="pep-placeholder-text">No image</div>
                    </div>
                  )}
                </div>

                <div className="pep-uploader-controls">
                  <input
                    ref={fileInputRef}
                    id="pep-file"
                    type="file"
                    accept="image/*"
                    className="pep-file"
                    onChange={handleFileChange}
                    aria-label="Upload photo"
                  />
                  <button
                    type="button"
                    className="pep-btn pep-btn-outline"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Choose image"
                  >
                    Choose Image
                  </button>

                  {imagePreview && (
                    <button
                      type="button"
                      className="pep-btn pep-btn-ghost"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(undefined);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      aria-label="Remove image"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <label className="pep-label" htmlFor="pep-title">
                Title
              </label>
              <input
                id="pep-title"
                name="title"
                className="pep-input"
                placeholder="Enter photo title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label className="pep-label" htmlFor="pep-category">
                Category
              </label>
              <select
                id="pep-category"
                className="pep-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                <option value="Ceremony">Ceremony</option>
                <option value="Workshop">Workshop</option>
                <option value="Performance">Performance</option>
                <option value="Exhibition">Exhibition</option>
                <option value="Other">Other</option>
              </select>

              <label className="pep-label" htmlFor="pep-tags">
                Tags (comma separated)
              </label>
              <input
                id="pep-tags"
                className="pep-input"
                placeholder="e.g. stage, team, keynote"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
              />

              <div className="pep-form-actions">
                <button
                  type="submit"
                  className="pep-btn pep-btn-primary"
                  aria-label={editingId ? "Save changes" : "Submit photo"}
                >
                  {editingId ? <FaCheck /> : <FaPlus />}{" "}
                  {editingId ? "Save Changes" : "Submit Photo"}
                </button>

                <button
                  type="button"
                  className="pep-btn pep-btn-secondary"
                  onClick={resetForm}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT: table */}
        <div className="pep-right">
          <div className="pep-card">
            <div className="pep-card-header">
              <h3 className="pep-title-small">Posted Photos</h3>
              <div className="pep-sub">Manage uploaded photos</div>
            </div>

            <div
              className="pep-table-wrap"
              role="region"
              aria-label="Posted event photos table (scrollable)"
            >
              <table className="pep-table">
                <thead>
                  <tr>
                    <th>S. No</th>
                    <th>Photo</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Tags</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((it, idx) => (
                    <tr key={it.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div className="pep-thumb-cell">
                          <img
                            src={it.imageDataUrl ?? DEFAULT_PLACEHOLDER}
                            alt={it.title}
                            className="pep-thumb"
                          />
                        </div>
                      </td>
                      <td className="pep-td-title" title={it.title}>
                        {it.title}
                      </td>
                      <td>{it.category}</td>
                      <td>{(it.tags || []).join(", ")}</td>
                      <td>
                        <div className="pep-actions">
                          <button
                            className="pep-icon-btn"
                            title="Edit"
                            onClick={() => handleEdit(it.id)}
                            aria-label={`Edit ${it.title}`}
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="pep-icon-btn pep-icon-delete"
                            title="Delete"
                            onClick={() => confirmDelete(it.id)}
                            aria-label={`Delete ${it.title}`}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="pep-empty">
                        No photos posted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="pep-table-note">
              Tip: On tablet & mobile the table scrolls horizontally.
            </div>
          </div>
        </div>
      </div>

      {/* Confirm delete modal */}
      {confirmDeleteId && (
        <div
          className="pep-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pep-modal-title"
        >
          <div className="pep-modal-panel" role="document">
            <div className="pep-modal-header">
              <h4 id="pep-modal-title">Confirm Delete</h4>
              <button
                className="pep-modal-close"
                aria-label="Close"
                onClick={cancelDelete}
              >
                <FaTimes />
              </button>
            </div>

            <div className="pep-modal-body">
              <p>Are you sure you want to delete this photo permanently?</p>
            </div>

            <div className="pep-modal-actions">
              <button
                className="pep-btn pep-btn-danger"
                onClick={() => doDelete(confirmDeleteId)}
                aria-label="Confirm delete"
              >
                <FaTrash /> Delete
              </button>

              <button className="pep-btn pep-btn-ghost" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostEventPhotos;
