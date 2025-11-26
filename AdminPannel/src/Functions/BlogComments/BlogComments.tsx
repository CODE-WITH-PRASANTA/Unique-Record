// File: BlogComments.tsx
import React, { useEffect, useState } from "react";
import "./BlogComments.css";

// richer icon set
import { AiOutlineSend, AiOutlineClockCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSortAlt2 } from "react-icons/bi";
import { FiTrash2 } from "react-icons/fi";

type Comment = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  address?: string;
  message: string;
  published: boolean;
  createdAt: number;
};

const uid = () => Math.random().toString(36).slice(2, 9);

const BlogComments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const raw = localStorage.getItem("blog_comments_v1");
      return raw ? (JSON.parse(raw) as Comment[]) : [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    address: "",
    message: "",
  });

  useEffect(() => {
    localStorage.setItem("blog_comments_v1", JSON.stringify(comments));
  }, [comments]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      alert("Please enter at least your name and a message.");
      return;
    }

    const newComment: Comment = {
      id: uid(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subject: form.subject.trim(),
      address: form.address.trim(),
      message: form.message.trim(),
      published: false,
      createdAt: Date.now(),
    };

    setComments((c) => [newComment, ...c]);
    setForm({ name: "", email: "", phone: "", subject: "", address: "", message: "" });
  };

  const togglePublish = (id: string) => {
    setComments((c) => c.map((x) => (x.id === id ? { ...x, published: !x.published } : x)));
  };

  const removeComment = (id: string) => {
    if (!confirm("Delete this comment? This cannot be undone.")) return;
    setComments((c) => c.filter((x) => x.id !== id));
  };

  const clearAll = () => {
    if (!confirm("Clear all comments?")) return;
    setComments([]);
  };

  return (
    <div className="bc-root">
      <header className="bc-header">
        <h2>Blog Comments</h2>
      </header>

      <section className="bc-grid">
        <aside className="bc-side bc-left">
          <form className="bc-form" onSubmit={handleSubmit}>
            <div className="bc-form-row">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name *"
                className="bc-input"
                required
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="bc-input"
                type="email"
              />
            </div>

            <div className="bc-form-row">
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="bc-input"
              />
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="bc-input"
              />
            </div>

            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              className="bc-input bc-full"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Message *"
              className="bc-textarea"
              rows={6}
              required
            />

            <div className="bc-actions">
              <button type="submit" className="btn primary" aria-label="Post Comment">
                <AiOutlineSend size={18} />
                <span>Post Comment</span>
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => setForm({ name: "", email: "", phone: "", subject: "", address: "", message: "" })}
              >
                Reset
              </button>
            </div>

            <p className="bc-note">Admins can publish/delete from the table on the right.</p>
          </form>
        </aside>

        <main className="bc-side bc-right">
          <div className="bc-table-card">
            <div className="bc-table-header">
              <h3>Comments</h3>
              <div className="bc-table-controls">
                <button
                  className="btn small"
                  onClick={() => setComments((c) => [...c].sort((a, b) => b.createdAt - a.createdAt))}
                  title="Sort newest"
                >
                  <BiSortAlt2 />
                  <span className="visually-hidden">Newest</span>
                </button>

                <button
                  className="btn small"
                  onClick={() => setComments((c) => [...c].sort((a, b) => a.createdAt - b.createdAt))}
                  title="Sort oldest"
                >
                  <BiSortAlt2 style={{ transform: "rotate(180deg)" }} />
                  <span className="visually-hidden">Oldest</span>
                </button>

                <button className="btn small danger" onClick={clearAll} title="Clear all comments">
                  <FiTrash2 />
                  <span className="visually-hidden">Clear</span>
                </button>
              </div>
            </div>

            <div className="bc-table-wrap">
              <table className="bc-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Message</th>
                    <th>Published</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.length === 0 ? (
                    <tr className="empty-row">
                      <td colSpan={5}>No comments yet — be the first!</td>
                    </tr>
                  ) : (
                    comments.map((c, i) => (
                      <tr key={c.id} className={c.published ? "published" : ""}>
                        <td>{i + 1}</td>
                        <td>
                          <div className="name-block">
                            <div className="avatar" aria-hidden>
                              {c.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="name">{c.name}</div>
                              <div className="meta">{c.email || c.phone || c.subject}</div>
                            </div>
                          </div>
                        </td>
                        <td className="msg-cell">
                          <div className="msg">{c.message}</div>
                          <div className="ts">{new Date(c.createdAt).toLocaleString()}</div>
                        </td>

                        {/* Published status column: colorful badge */}
                        <td>
                          {c.published ? (
                            <span className="status-badge status-published" aria-label="Published">
                              <AiOutlineCheckCircle size={14} />
                              <span>Published</span>
                            </span>
                          ) : (
                            <span className="status-badge status-draft" aria-label="Draft">
                              <AiOutlineClockCircle size={14} />
                              <span>Draft</span>
                            </span>
                          )}
                        </td>

                        {/* Actions: colorful icon buttons */}
                        <td>
                          <div className="row-actions">
                            <button
                              className={`icon-btn ${c.published ? "icon-draft" : "icon-publish"}`}
                              onClick={() => togglePublish(c.id)}
                              title={c.published ? "Mark as Draft" : "Publish"}
                              aria-label={c.published ? "Mark as Draft" : "Publish"}
                            >
                              {c.published ? <AiOutlineClockCircle size={16} /> : <AiOutlineCheckCircle size={16} />}
                            </button>

                            <button
                              className="icon-btn icon-delete"
                              onClick={() => removeComment(c.id)}
                              title="Delete"
                              aria-label="Delete"
                            >
                              <RiDeleteBin6Line size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default BlogComments;
