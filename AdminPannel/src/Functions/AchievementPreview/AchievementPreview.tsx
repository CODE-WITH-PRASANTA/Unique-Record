import React, { useEffect, useState } from "react";
import {
  FaEye,
  FaTrash,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaLink,
  FaMapMarkerAlt,
  FaTags,
  FaMedal,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import { FiGrid, FiList } from "react-icons/fi";
import "./AchievementPreview.css";

/**
 * Standalone preview component — uses local demo data only.
 * Arrow-function component as requested.
 *
 * NOTE: demo images point to a local file path you uploaded earlier.
 * Replace the image strings with imports if desired.
 */
const DEMO_IMAGE = "/mnt/data/c5b04d07-69b0-43ba-815a-1ce11dd3750d.png";

type Achievement = {
  title: string;
  provider: string;
  achiever: string;
  uruLink?: string;
  address?: string;
  shortDescription?: string;
  content?: string;
  effortType?: string;
  category?: string;
  tags?: string[];
  image?: string;
  published?: boolean;
  id: string | number;
};

const demoData: Achievement[] = [
  {
    id: 1,
    title: "Intercollegiate Robotics Championship — Winner",
    provider: "Global Robotics League",
    achiever: "Team Aurora",
    uruLink: "https://example.com/teams/aurora",
    address: "Tech Park Arena, Boston, MA",
    shortDescription:
      "Won 1st place at the annual intercollegiate robotics challenge for autonomous navigation.",
    content:
      "The team built a modular autonomous navigation system leveraging vision & LIDAR. Demonstrated robust obstacle avoidance and path planning under timed conditions.",
    effortType: "Group",
    category: "Innovation",
    tags: ["Robotics", "Autonomy", "Competition"],
    image: DEMO_IMAGE,
    published: true,
  },
  {
    id: 2,
    title: "National Mathematics Olympiad — Gold",
    provider: "National Math Society",
    achiever: "Aisha Rahman",
    uruLink: "https://example.com/users/aisha",
    address: "City Convention Hall, Chicago, IL",
    shortDescription:
      "Secured a gold medal in the senior category with top-scoring performance in proofs and combinatorics.",
    content:
      "Aisha solved the set of challenging combinatorics and number theory problems with elegant proofs that impressed the judges.",
    effortType: "Individual",
    category: "Academic",
    tags: ["Math", "Olympiad", "Gold"],
    image: DEMO_IMAGE,
    published: false,
  },
  {
    id: 3,
    title: "National Football League — MVP Runner-up",
    provider: "National Sports Federation",
    achiever: "Carlos Mendes",
    uruLink: "https://example.com/players/carlos",
    address: "Regional Stadium, Dallas, TX",
    shortDescription:
      "Outstanding season as forward; high scoring average and team captain leading to playoffs.",
    content:
      "Carlos showed exceptional leadership and skill across the season, contributing both on offense and defense.",
    effortType: "Individual",
    category: "Sports",
    tags: ["Football", "MVP", "Sports"],
    image: DEMO_IMAGE,
    published: true,
  },
];

const AchievementPreview: React.FC = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [items, setItems] = useState<Achievement[]>(demoData);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [modalItem, setModalItem] = useState<Achievement | null>(null);

  // open view modal
  const openView = (id: string | number) => {
    const found = items.find((i) => i.id === id) || null;
    if (!found) return;
    setModalItem(found);
    setModalMode("view");
    setModalOpen(true);
  };

  // open edit modal
  const openEdit = (id: string | number) => {
    const found = items.find((i) => i.id === id) || null;
    if (!found) return;
    // copy to avoid mutating original until save
    setModalItem({ ...found });
    setModalMode("edit");
    setModalOpen(true);
  };

  // save edits from modal
  const saveEdit = (updated: Achievement) => {
    setItems((prev) => prev.map((it) => (it.id === updated.id ? { ...updated } : it)));
    setModalOpen(false);
    setModalItem(null);
  };

  const togglePublish = (id: string | number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, published: !it.published } : it))
    );
  };

  const handleDelete = (id: string | number) => {
    if (!window.confirm("Delete this achievement from demo data?")) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
    // close modal if the deleted item is open
    if (modalItem?.id === id) {
      setModalOpen(false);
      setModalItem(null);
    }
  };

  // modal keyboard handling
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalOpen) {
        setModalOpen(false);
        setModalItem(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, modalItem]);

  return (
    <section className="ap-root" aria-live="polite">
      <div className="ap-header">
        <h2 className="ap-title">Achievement Preview</h2>

        <div className="ap-controls" role="toolbar" aria-label="View controls">
          <div className="ap-toggle" role="group" aria-label="Toggle view">
            <button
              className={`ap-view-btn ${view === "grid" ? "active" : ""}`}
              onClick={() => setView("grid")}
              aria-pressed={view === "grid"}
              title="Grid view"
            >
              <FiGrid /> Grid
            </button>

            <button
              className={`ap-view-btn ${view === "list" ? "active" : ""}`}
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
              title="List view"
            >
              <FiList /> List
            </button>
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <div className="ap-grid" role="list">
          {items.map((a) => (
            <article key={a.id} className="ap-card" role="listitem" aria-label={a.title}>
              <div className="ap-card-media">
                <img src={a.image} alt={a.title} className="ap-card-image" />
                <div className="ap-badge">
                  <FaMedal /> {a.category}
                </div>
              </div>

              <div className="ap-card-body">
                <h3 className="ap-card-title">{a.title}</h3>

                <div className="ap-card-sub">
                  <div className="ap-provider">
                    <strong>{a.achiever}</strong>
                    <span className="ap-dot">•</span>
                    <span className="ap-provider-name">{a.provider}</span>
                  </div>

                  <p className="ap-short">{a.shortDescription}</p>

                  <div className="ap-meta-row">
                    <span className="ap-meta">
                      <FaMapMarkerAlt aria-hidden /> {a.address}
                    </span>
                    <span className="ap-meta">
                      <FaTags aria-hidden /> {(a.tags || []).slice(0, 3).join(", ")}
                    </span>
                  </div>

                  <div className="ap-actions">
                    <button
                      className="ap-btn ap-btn-ghost"
                      title="View"
                      onClick={() => openView(a.id)}
                      aria-label={`View ${a.title}`}
                    >
                      <FaEye aria-hidden /> View
                    </button>

                    <button
                      className="ap-btn ap-btn-edit"
                      title="Edit"
                      onClick={() => openEdit(a.id)}
                      aria-label={`Edit ${a.title}`}
                    >
                      <FaEdit aria-hidden /> Edit
                    </button>

                    <button
                      className="ap-btn ap-btn-delete"
                      title="Delete"
                      onClick={() => handleDelete(a.id)}
                      aria-label={`Delete ${a.title}`}
                    >
                      <FaTrash aria-hidden /> Delete
                    </button>

                    <button
                      className="ap-publish-toggle"
                      title={a.published ? "Unpublish" : "Publish"}
                      onClick={() => togglePublish(a.id)}
                      aria-pressed={!!a.published}
                      aria-label={`${a.published ? "Unpublish" : "Publish"} ${a.title}`}
                    >
                      {a.published ? <FaToggleOn aria-hidden /> : <FaToggleOff aria-hidden />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="ap-card-footer">
                <a
                  className="ap-link"
                  href={a.uruLink || "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open holder link for ${a.title}`}
                >
                  <FaLink aria-hidden /> Holder Link
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="ap-list-wrapper" role="region" aria-label="Achievements table">
          <table className="ap-table" role="table" aria-label="Achievements list">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Achiever</th>
                <th scope="col">Effort</th>
                <th scope="col">Category</th>
                <th scope="col">Tags</th>
                <th scope="col">Published</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((a, idx) => (
                <tr key={a.id}>
                  <td>{idx + 1}</td>
                  <td className="ap-td-title" role="cell">
                    <div className="ap-td-title-inner">
                      <img src={a.image} alt="" className="ap-td-thumb" />
                      <div>
                        <div className="ap-td-title-text">{a.title}</div>
                        <div className="ap-td-sub">{a.shortDescription}</div>
                      </div>
                    </div>
                  </td>
                  <td>{a.achiever}</td>
                  <td>{a.effortType}</td>
                  <td>{a.category}</td>
                  <td>{(a.tags || []).join(", ")}</td>
                  <td>
                    <span
                      className={`ap-status ${a.published ? "ap-active" : "ap-draft"}`}
                      aria-label={a.published ? "Published" : "Draft"}
                    >
                      {a.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>
                    <div className="ap-table-actions" role="group" aria-label="Row actions">
                      <button
                        className="ap-btn ap-btn-ghost"
                        onClick={() => openView(a.id)}
                        aria-label={`View ${a.title}`}
                        title="View"
                      >
                        <FaEye aria-hidden />
                      </button>

                      <button
                        className="ap-btn ap-btn-edit"
                        onClick={() => openEdit(a.id)}
                        aria-label={`Edit ${a.title}`}
                        title="Edit"
                      >
                        <FaEdit aria-hidden />
                      </button>

                      <button
                        className="ap-btn ap-btn-delete"
                        onClick={() => handleDelete(a.id)}
                        aria-label={`Delete ${a.title}`}
                        title="Delete"
                      >
                        <FaTrash aria-hidden />
                      </button>

                      <button
                        className="ap-publish-toggle"
                        onClick={() => togglePublish(a.id)}
                        aria-pressed={!!a.published}
                        title={a.published ? "Unpublish" : "Publish"}
                        aria-label={`${a.published ? "Unpublish" : "Publish"} ${a.title}`}
                      >
                        {a.published ? <FaToggleOn aria-hidden /> : <FaToggleOff aria-hidden />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="ap-empty">
                    No demo achievements — delete was performed, or none exist.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal (view / edit) */}
      {modalOpen && modalItem && (
        <div
          className="ap-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={modalMode === "view" ? "View achievement" : "Edit achievement"}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalOpen(false);
              setModalItem(null);
            }
          }}
        >
          <div className="ap-modal-content">
            <div className="ap-modal-header">
              <h3 className="ap-modal-title">
                {modalMode === "view" ? "View Achievement" : "Edit Achievement"}
              </h3>
              <button
                className="ap-modal-close"
                aria-label="Close"
                onClick={() => {
                  setModalOpen(false);
                  setModalItem(null);
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div className="ap-modal-body">
              {modalMode === "view" ? (
                <>
                  <div className="ap-modal-media">
                    <img src={modalItem.image} alt={modalItem.title} />
                  </div>

                  <h4 className="ap-modal-heading">{modalItem.title}</h4>

                  <p className="ap-modal-meta">
                    <strong>Achiever:</strong> {modalItem.achiever} • <strong>Provider:</strong>{" "}
                    {modalItem.provider}
                  </p>

                  <p className="ap-modal-desc">{modalItem.content || modalItem.shortDescription}</p>

                  <p className="ap-modal-meta">
                    <FaMapMarkerAlt aria-hidden /> {modalItem.address}
                  </p>

                  <p className="ap-modal-meta">
                    <FaTags aria-hidden /> {(modalItem.tags || []).join(", ")}
                  </p>

                  <div className="ap-modal-actions">
                    <a
                      className="ap-link"
                      href={modalItem.uruLink || "#"}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaLink /> Open Holder Link
                    </a>

                    <button
                      className="ap-btn ap-btn-edit"
                      onClick={() => {
                        // switch to edit mode with existing modalItem copy
                        setModalMode("edit");
                        setModalItem({ ...modalItem });
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* EDIT FORM */}
                  <EditForm
                    item={modalItem}
                    onCancel={() => {
                      setModalOpen(false);
                      setModalItem(null);
                    }}
                    onSave={(updated) => saveEdit(updated)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AchievementPreview;

/* -------------------------
   EditForm component (small internal helper)
   ------------------------- */
type EditFormProps = {
  item: Achievement;
  onCancel: () => void;
  onSave: (updated: Achievement) => void;
};

const EditForm: React.FC<EditFormProps> = ({ item, onCancel, onSave }) => {
  const [form, setForm] = useState<Achievement>({ ...item });

  useEffect(() => {
    setForm({ ...item });
  }, [item]);

  const handleChange = (k: keyof Achievement, val: any) => {
    setForm((p) => ({ ...p, [k]: val }));
  };

  return (
    <form
      className="ap-edit-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <div className="ap-edit-grid">
        <label>
          Title
          <input
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="ap-input"
            required
          />
        </label>

        <label>
          Achiever
          <input
            value={form.achiever}
            onChange={(e) => handleChange("achiever", e.target.value)}
            className="ap-input"
            required
          />
        </label>

        <label>
          Provider
          <input
            value={form.provider}
            onChange={(e) => handleChange("provider", e.target.value)}
            className="ap-input"
          />
        </label>

        <label>
          Category
          <input
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="ap-input"
          />
        </label>

        <label className="ap-input-full">
          Short Description
          <textarea
            value={form.shortDescription}
            onChange={(e) => handleChange("shortDescription", e.target.value)}
            className="ap-textarea"
          />
        </label>

        <label>
          Tags (comma separated)
          <input
            value={(form.tags || []).join(", ")}
            onChange={(e) => handleChange("tags", e.target.value.split(",").map((s) => s.trim()))}
            className="ap-input"
          />
        </label>

        <label>
          Published
          <select
            value={form.published ? "true" : "false"}
            onChange={(e) => handleChange("published", e.target.value === "true")}
            className="ap-input"
          >
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </label>
      </div>

      <div className="ap-edit-actions">
        <button type="button" className="ap-btn" onClick={onCancel}>
          Cancel
        </button>

        <button type="submit" className="ap-btn ap-btn-edit">
          <FaSave /> Save Changes
        </button>
      </div>
    </form>
  );
};
