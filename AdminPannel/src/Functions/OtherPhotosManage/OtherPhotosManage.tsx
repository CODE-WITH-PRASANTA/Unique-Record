import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaTimes,
  FaImage,
  FaCheck,
} from "react-icons/fa";
import "./OtherPhotosManage.css";

/**
 * OtherPhotosManage.tsx
 * - Left: Upload photo, choose category (dropdown), Submit
 * - Right: Table: S.No, thumbnail, category, action (edit/delete)
 * - Uses placeholder image at /mnt/data/cd7c5f70-de74-44a8-b081-f726dba2f602.jpg
 */

type Photo = {
  id: string;
  title?: string;
  category: string;
  filename?: string;
  imageDataUrl?: string;
};

const PLACEHOLDER = "/mnt/data/cd7c5f70-de74-44a8-b081-f726dba2f602.jpg";

const uid = () => Math.random().toString(36).slice(2, 9);

const DEFAULT_CATEGORIES = [
  "News Paper",
  "Online News & Photos",
  "Event",
  "Gallery",
  "Other",
];

const OtherPhotosManage: React.FC = () => {
  // form
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  // items
  const [items, setItems] = useState<Photo[]>([
    {
      id: uid(),
      title: "Newspaper — front page",
      category: "News Paper",
      filename: "news-front.jpg",
      imageDataUrl: PLACEHOLDER,
    },
  ]);

  // edit/delete state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // refs
  const fileRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setFile(null);
    setPreview(undefined);
    setCategory("");
    setTitle("");
    setEditingId(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (!f) {
      setPreview(undefined);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(f);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // update existing
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingId
            ? {
                ...it,
                title: title || it.title,
                category: category || it.category,
                imageDataUrl: preview ?? it.imageDataUrl,
                filename: file?.name ?? it.filename,
              }
            : it
        )
      );
      resetForm();
      return;
    }

    // new item
    const newItem: Photo = {
      id: uid(),
      title: title || "Untitled Photo",
      category: category || "Other",
      filename: file?.name ?? "placeholder.jpg",
      imageDataUrl: preview || PLACEHOLDER,
    };
    setItems((p) => [newItem, ...p]);
    resetForm();
  };

  const startEdit = (id: string) => {
    const it = items.find((x) => x.id === id);
    if (!it) return;
    setEditingId(id);
    setCategory(it.category);
    setTitle(it.title ?? "");
    setPreview(it.imageDataUrl);
    setFile(undefined as any);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = (id: string) => setConfirmDeleteId(id);

  const doDelete = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (editingId === id) resetForm();
    setConfirmDeleteId(null);
  };

  const cancelDelete = () => setConfirmDeleteId(null);

  return (
    <div className="opm-root">
      <div className="opm-inner">
        {/* LEFT: form */}
        <div className="opm-left">
          <div className="opm-card">
            <div className="opm-card-header">
              <h2 className="opm-title">{editingId ? "Edit Photo" : "Upload Photo"}</h2>
              <div className="opm-sub">Left: upload photo — choose category — submit</div>
            </div>

            <form className="opm-form" onSubmit={handleSubmit} noValidate>
              <label className="opm-label" htmlFor="opm-file">Upload Photo</label>
              <div className="opm-uploader">
                <div className="opm-preview">
                  {preview ? (
                    <img src={preview} alt="preview" className="opm-preview-img" />
                  ) : (
                    <div className="opm-placeholder">
                      <FaImage size={28} />
                      <div className="opm-placeholder-text">No image selected</div>
                    </div>
                  )}
                </div>

                <div className="opm-controls">
                  <input
                    ref={fileRef}
                    id="opm-file"
                    type="file"
                    accept="image/*"
                    className="opm-file"
                    onChange={handleFileChange}
                    aria-label="Upload photo"
                  />
                  <button
                    type="button"
                    className="opm-btn opm-btn-outline"
                    onClick={() => fileRef.current?.click()}
                  >
                    Choose Image
                  </button>
                  {preview && (
                    <button
                      type="button"
                      className="opm-btn opm-btn-ghost"
                      onClick={() => {
                        setFile(null);
                        setPreview(undefined);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <label className="opm-label" htmlFor="opm-title">Title (optional)</label>
              <input
                id="opm-title"
                className="opm-input"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <label className="opm-label" htmlFor="opm-category">Choose Category</label>
              <select
                id="opm-category"
                className="opm-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                {DEFAULT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <div className="opm-form-actions">
                <button
                  type="submit"
                  className="opm-btn opm-btn-primary"
                  aria-label={editingId ? "Save changes" : "Submit photo"}
                >
                  {editingId ? <FaCheck /> : <FaPlus />} {editingId ? "Save Changes" : "Submit Photo"}
                </button>

                <button type="button" className="opm-btn opm-btn-secondary" onClick={resetForm}>
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT: table */}
        <div className="opm-right">
          <div className="opm-card">
            <div className="opm-card-header">
              <h3 className="opm-title-small">Other Photo Gallery</h3>
              <div className="opm-sub">Right: table — S.No, img, category, action</div>
            </div>

            <div className="opm-table-wrap" role="region" aria-label="Other photos table">
              <table className="opm-table">
                <thead>
                  <tr>
                    <th>S. No</th>
                    <th>Photo</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((it, idx) => (
                    <tr key={it.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div className="opm-thumb-cell">
                          <img
                            src={it.imageDataUrl ?? PLACEHOLDER}
                            alt={it.title || "photo"}
                            className="opm-thumb"
                          />
                        </div>
                      </td>
                      <td className="opm-td-title" title={it.title}>{it.title}</td>
                      <td>{it.category}</td>
                      <td>
                        <div className="opm-actions">
                          <button className="opm-icon-btn" title="Edit" onClick={() => startEdit(it.id)}><FaEdit /></button>
                          <button className="opm-icon-btn opm-icon-delete" title="Delete" onClick={() => confirmDelete(it.id)}><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="opm-empty">No photos uploaded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="opm-table-note">Tip: Use the left panel to upload photos and pick a category.</div>
          </div>
        </div>
      </div>

      {/* Confirm delete modal */}
      {confirmDeleteId && (
        <div className="opm-modal" role="dialog" aria-modal="true">
          <div className="opm-modal-panel">
            <div className="opm-modal-header">
              <h4>Confirm Delete</h4>
              <button className="opm-modal-close" aria-label="Close" onClick={cancelDelete}><FaTimes /></button>
            </div>

            <div className="opm-modal-body">
              <p>Are you sure you want to permanently delete this photo?</p>
            </div>

            <div className="opm-modal-actions">
              <button className="opm-btn opm-btn-danger" onClick={() => doDelete(confirmDeleteId)}><FaTrash /> Delete</button>
              <button className="opm-btn opm-btn-ghost" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherPhotosManage;
