import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaTimes,
  FaUserCircle,
  FaCheck,
} from "react-icons/fa";
import "./UserOpinion.css";

/**
 * UserOpinion.tsx
 *
 * - Only the "Collected Opinions" table (right) scrolls (vertical + horizontal).
 * - Page is viewport-locked to prevent full-page scrolling.
 * - Left card is clipped if taller than available space (no scrollbar on left).
 *
 * Local assets (keep paths as-is or update if needed):
 * - Avatar placeholder: /mnt/data/3f2691ef-2e36-45e9-b451-6ed86313c17f.jpg
 * - Header decoration: /mnt/data/0b838c9f-89ed-448a-bfe0-8f0edcecc608.jpg
 */

type Opinion = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number | null;
  designation?: string;
  address?: string;
  message?: string;
  avatarUrl?: string;
  createdAt: string;
};

const AVATAR_PLACEHOLDER =
  "/mnt/data/3f2691ef-2e36-45e9-b451-6ed86313c17f.jpg";
const HEADER_DECOR =
  "/mnt/data/0b838c9f-89ed-448a-bfe0-8f0edcecc608.jpg";

const uid = () => Math.random().toString(36).slice(2, 9);

const truncate = (s?: string, n = 40) =>
  !s ? "" : s.length > n ? s.slice(0, n) + "…" : s;

const UserOpinion: React.FC = () => {
  // form state
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [age, setAge] = useState<string>(""); // store as string while editing
  const [designation, setDesignation] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // data list
  const [items, setItems] = useState<Opinion[]>([
    {
      id: uid(),
      name: "Aisha Khan",
      email: "aisha@example.com",
      phone: "9876543210",
      age: 29,
      designation: "Reporter",
      address: "Block A, Central Street, City Name",
      message: "Great coverage of the event — enjoyed it!",
      avatarUrl: AVATAR_PLACEHOLDER,
      createdAt: new Date().toISOString(),
    },
    {
      id: uid(),
      name: "Ravi Patel",
      email: "ravi@example.com",
      phone: "9123456780",
      age: 34,
      designation: "Editor",
      address: "45 Park Lane, Town",
      message: "Useful photos and timely updates. Thanks!",
      avatarUrl: AVATAR_PLACEHOLDER,
      createdAt: new Date().toISOString(),
    },
    // extra rows to demonstrate scrolling
    {
      id: uid(),
      name: "Sonal Mehra",
      email: "sonal@example.com",
      phone: "9000001111",
      age: 27,
      designation: "Contributor",
      address: "12 Greenway, Some City",
      message: "Appreciate timely updates and nice layout.",
      avatarUrl: AVATAR_PLACEHOLDER,
      createdAt: new Date().toISOString(),
    },
    {
      id: uid(),
      name: "Arjun Singh",
      email: "arjun@example.com",
      phone: "9000002222",
      age: 31,
      designation: "Reader",
      address: "8 Lakeview, Nearby Town",
      message: "Keep up the good work!",
      avatarUrl: AVATAR_PLACEHOLDER,
      createdAt: new Date().toISOString(),
    },
    {
      id: uid(),
      name: "Maya Rao",
      email: "maya@example.com",
      phone: "9000003333",
      age: 28,
      designation: "Volunteer",
      address: "99 Sunset Blvd",
      message: "Nice experience overall.",
      avatarUrl: AVATAR_PLACEHOLDER,
      createdAt: new Date().toISOString(),
    },
  ]);

  // editing & delete modal state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement | null>(null);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAge("");
    setDesignation("");
    setAddress("");
    setMessage("");
    setEditingId(null);
    if (formRef.current) formRef.current.reset();
  };

  const startEdit = (id: string) => {
    const it = items.find((x) => x.id === id);
    if (!it) return;
    setEditingId(id);
    setName(it.name);
    setEmail(it.email);
    setPhone(it.phone ?? "");
    setAge(it.age != null ? String(it.age) : "");
    setDesignation(it.designation ?? "");
    setAddress(it.address ?? "");
    setMessage(it.message ?? "");
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Please enter at least name and email.");
      return;
    }

    const parsedAge = age ? Number(age) : null;

    if (editingId) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingId
            ? {
                ...it,
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                age: parsedAge,
                designation: designation.trim(),
                address: address.trim(),
                message: message.trim(),
              }
            : it
        )
      );
      resetForm();
      return;
    }

    const newItem: Opinion = {
      id: uid(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      age: parsedAge,
      designation: designation.trim(),
      address: address.trim(),
      message: message.trim(),
      avatarUrl: AVATAR_PLACEHOLDER,
      createdAt: new Date().toISOString(),
    };

    setItems((p) => [newItem, ...p]);
    resetForm();
  };

  const confirmDelete = (id: string) => setConfirmDeleteId(id);

  const doDelete = (id: string | null) => {
    if (!id) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (editingId === id) resetForm();
    setConfirmDeleteId(null);
  };

  const cancelDelete = () => setConfirmDeleteId(null);

  // handlers typed using React.ChangeEvent
  const onNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const onPhoneChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPhone(e.target.value);
  const onAgeChange = (e: ChangeEvent<HTMLInputElement>) =>
    setAge(e.target.value);
  const onDesignationChange = (e: ChangeEvent<HTMLInputElement>) =>
    setDesignation(e.target.value);
  const onAddressChange = (e: ChangeEvent<HTMLInputElement>) =>
    setAddress(e.target.value);
  const onMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setMessage(e.target.value);

  return (
    <div className="uo-root">
      <div
        className="uo-header-decor"
        style={{ backgroundImage: `url(${HEADER_DECOR})` }}
        aria-hidden
      />

      <div className="uo-inner">
        {/* Left: form */}
        <div className="uo-left">
          <div className="uo-card">
            <div className="uo-card-header">
              <h2 className="uo-title">
                {editingId ? "Edit Opinion" : "User Opinion"}
              </h2>
              <div className="uo-sub">
                Collect user's opinion — create, edit, delete
              </div>
            </div>

            <form
              className="uo-form"
              onSubmit={handleSubmit}
              ref={formRef}
              noValidate
            >
              <div className="uo-row">
                <label className="uo-label" htmlFor="uo-name">
                  Name
                </label>
                <input
                  id="uo-name"
                  className="uo-input"
                  value={name}
                  onChange={onNameChange}
                  placeholder="Full name"
                  required
                />
              </div>

              <div className="uo-row">
                <label className="uo-label" htmlFor="uo-email">
                  Email
                </label>
                <input
                  id="uo-email"
                  type="email"
                  className="uo-input"
                  value={email}
                  onChange={onEmailChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="uo-grid-2">
                <div className="uo-row">
                  <label className="uo-label" htmlFor="uo-phone">
                    Phone
                  </label>
                  <input
                    id="uo-phone"
                    className="uo-input"
                    value={phone}
                    onChange={onPhoneChange}
                    placeholder="e.g. 9876543210"
                  />
                </div>

                <div className="uo-row">
                  <label className="uo-label" htmlFor="uo-age">
                    Age
                  </label>
                  <input
                    id="uo-age"
                    type="number"
                    min={0}
                    className="uo-input"
                    value={age}
                    onChange={onAgeChange}
                    placeholder="Age"
                  />
                </div>
              </div>

              <div className="uo-row">
                <label className="uo-label" htmlFor="uo-designation">
                  Designation
                </label>
                <input
                  id="uo-designation"
                  className="uo-input"
                  value={designation}
                  onChange={onDesignationChange}
                  placeholder="e.g. Reporter, Reader..."
                />
              </div>

              <div className="uo-row">
                <label className="uo-label" htmlFor="uo-address">
                  Address
                </label>
                <input
                  id="uo-address"
                  className="uo-input"
                  value={address}
                  onChange={onAddressChange}
                  placeholder="Address"
                />
              </div>

              <div className="uo-row">
                <label className="uo-label" htmlFor="uo-message">
                  Message
                </label>
                <textarea
                  id="uo-message"
                  className="uo-textarea"
                  value={message}
                  onChange={onMessageChange}
                  placeholder="Write the opinion or message..."
                  rows={4}
                />
              </div>

              <div className="uo-form-actions">
                <button
                  type="submit"
                  className="uo-btn uo-btn-primary"
                  aria-label={editingId ? "Save" : "Submit"}
                >
                  {editingId ? <FaCheck /> : <FaPlus />}{" "}
                  {editingId ? "Save" : "Submit"}
                </button>

                <button
                  type="button"
                  className="uo-btn uo-btn-secondary"
                  onClick={resetForm}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: table */}
        <div className="uo-right">
          <div className="uo-card">
            <div className="uo-card-header">
              <h3 className="uo-title-small">Collected Opinions</h3>
              <div className="uo-sub">
                Table — S.No, Name, Email, Phone, Age, Designation, Address,
                Message, Action
              </div>
            </div>

            {/* table wrapper: scrolls independently (vertical & horizontal) */}
            <div
              className="uo-table-wrap"
              role="region"
              aria-label="User opinions table"
            >
              <table className="uo-table" aria-label="Collected Opinions">
                <thead>
                  <tr>
                    <th>S. No</th>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Age</th>
                    <th>Designation</th>
                    <th>Address</th>
                    <th>Message</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((it, idx) => (
                    <tr key={it.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div className="uo-avatar-cell">
                          {it.avatarUrl ? (
                            <img
                              src={it.avatarUrl}
                              alt={it.name}
                              className="uo-avatar"
                              width={44}
                              height={44}
                            />
                          ) : (
                            <div className="uo-avatar-fallback" aria-hidden>
                              <FaUserCircle size={32} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="uo-td-name" title={it.name}>
                        {it.name}
                      </td>
                      <td className="uo-td-email" title={it.email}>
                        {it.email}
                      </td>
                      <td>{it.phone}</td>
                      <td>{it.age ?? "-"}</td>
                      <td>{it.designation ?? "-"}</td>
                      <td className="uo-td-addr" title={it.address}>
                        {truncate(it.address, 30)}
                      </td>
                      <td className="uo-td-msg" title={it.message}>
                        {truncate(it.message, 40)}
                      </td>
                      <td>
                        <div className="uo-actions">
                          <button
                            className="uo-icon-btn"
                            title="Edit"
                            onClick={() => startEdit(it.id)}
                            aria-label={`Edit ${it.name}`}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="uo-icon-btn uo-icon-delete"
                            title="Delete"
                            onClick={() => confirmDelete(it.id)}
                            aria-label={`Delete ${it.name}`}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td colSpan={10} className="uo-empty">
                        No opinions collected yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="uo-table-note">
              Tip: Click edit to update an opinion or use delete to remove it
              permanently.
            </div>
          </div>
        </div>
      </div>

      {/* Confirm delete modal */}
      {confirmDeleteId && (
        <div
          className="uo-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="uo-delete-title"
        >
          <div className="uo-modal-panel" role="document">
            <div className="uo-modal-header">
              <h4 id="uo-delete-title">Confirm Delete</h4>
              <button
                className="uo-modal-close"
                aria-label="Close"
                onClick={cancelDelete}
              >
                <FaTimes />
              </button>
            </div>

            <div className="uo-modal-body">
              <p>Are you sure you want to delete this opinion permanently?</p>
            </div>

            <div className="uo-modal-actions">
              <button
                className="uo-btn uo-btn-danger"
                onClick={() => doDelete(confirmDeleteId)}
                aria-label="Confirm delete"
              >
                <FaTrash /> Delete
              </button>
              <button
                className="uo-btn uo-btn-ghost"
                onClick={cancelDelete}
                aria-label="Cancel delete"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOpinion;
