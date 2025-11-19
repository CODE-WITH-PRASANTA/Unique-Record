import React, { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  Trash2,
  CheckCircle,
  CircleOff,
  Eye,
  Clock,
  Calendar,
  User,
  Tag,
  Folder,
  Mail,
  Table as TableIcon,
  Grid as GridIcon,
} from "lucide-react";
import "./BlogPreview.css";

type BlogCard = {
  id: number;
  title: string;
  bannerUrl?: string;
  author: string;
  designation?: string;
  category: string;
  postingDateTime: string;
  tags: string[];
  readTime: string;
  views: number;
  isPublished: boolean;
  contactEmail?: string;
};

const initialCards: BlogCard[] = [
  {
    id: 1,
    title: "How to Build Accessible, Responsive React Components",
    bannerUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166",
    author: "Priya Sharma",
    designation: "Senior Frontend Engineer",
    category: "Development",
    postingDateTime: new Date().toISOString(),
    tags: ["React", "Accessibility", "Responsive"],
    readTime: "6 min",
    views: 1423,
    isPublished: true,
    contactEmail: "priya.sharma@example.com",
  },
];

const BlogPreview: React.FC = () => {
  const [cards, setCards] = useState<BlogCard[]>(initialCards);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const setMenuRef = (id: number) => (el: HTMLDivElement | null) => {
    menuRefs.current[id] = el;
  };

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (openMenuId !== null && !menuRefs.current[openMenuId]?.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [openMenuId]);

  const toggleMenu = (id: number) => setOpenMenuId((prev) => (prev === id ? null : id));

  const handleTogglePublish = (id: number) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, isPublished: !c.isPublished } : c)));
    setOpenMenuId(null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    setCards((prev) => prev.filter((c) => c.id !== id));
    setOpenMenuId(null);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  return (
    <section className="blogpreview-container">
      <div className="blogpreview-content-wrapper">
        <h2 className="blogpreview-heading">Blog Preview</h2>

        {/* View Toggle */}
        <div className="blogpreview-view-toggle">
          <button
            className={`view-btn ${viewType === "grid" ? "active" : ""}`}
            onClick={() => setViewType("grid")}
          >
            <GridIcon size={18} /> Grid View
          </button>
          <button
            className={`view-btn ${viewType === "list" ? "active" : ""}`}
            onClick={() => setViewType("list")}
          >
            <TableIcon size={18} /> List View
          </button>
        </div>

        {/* Content */}
        {viewType === "grid" ? (
          <div className="blogpreview-grid">
            {cards.map((card) => (
              <article key={card.id} className="blogpreview-card">
                <div className="blogpreview-image-wrapper">
                  <img src={card.bannerUrl} alt={card.title} className="blogpreview-image" />
                </div>

                <div className="blogpreview-body">
                  <h3 className="blogpreview-title">{card.title}</h3>
                  <p className="blogpreview-author">
                    <User size={14} /> {card.author} • {card.designation}
                  </p>

                  <div className="blogpreview-stats">
                    <div className="blogpreview-stat-item" title="Read Time">
                      <Clock size={14} /> {card.readTime}
                    </div>
                    <div className="blogpreview-stat-item" title="Total Views">
                      <Eye size={14} /> {card.views.toLocaleString()}
                    </div>
                    <div className="blogpreview-stat-item" title="Published Date">
                      <Calendar size={14} /> {formatDate(card.postingDateTime)}
                    </div>
                  </div>

                  <div className="blogpreview-meta">
                    <span className="blogpreview-category">
                      <Folder size={12} /> {card.category}
                    </span>
                    <span
                      className={`blogpreview-status ${
                        card.isPublished ? "status-active" : "status-draft"
                      }`}
                    >
                      {card.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div className="blogpreview-tags">
                    {card.tags.map((tag) => (
                      <span key={tag} className="blogpreview-tag">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>

                  <div className="blogpreview-email">
                    <Mail size={14} /> {card.contactEmail}
                  </div>
                </div>

                <div className="blogpreview-menu" ref={setMenuRef(card.id)}>
                  <button
                    className="blogpreview-menu-btn"
                    onClick={() => toggleMenu(card.id)}
                    aria-label="Actions"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenuId === card.id && (
                    <div className="blogpreview-dropdown">
                      <button onClick={() => handleTogglePublish(card.id)}>
                        {card.isPublished ? (
                          <>
                            <CircleOff size={14} /> Unpublish
                          </>
                        ) : (
                          <>
                            <CheckCircle size={14} /> Publish
                          </>
                        )}
                      </button>
                      <button className="danger" onClick={() => handleDelete(card.id)}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="blogpreview-list-wrapper">
            <table className="blogpreview-table">
              <thead>
                <tr>
                  <th>SL No.</th>
                  <th>Title</th>
                  <th>Author & Designation</th>
                  <th>Posted Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card, index) => (
                  <tr key={card.id}>
                    <td>{index + 1}</td>
                    <td>{card.title}</td>
                    <td>{card.author} • {card.designation}</td>
                    <td>{formatDate(card.postingDateTime)}</td>
                    <td>
                      <span
                        className={`BlogPreview-status-badge ${
                          card.isPublished ? "active" : "draft"
                        }`}
                      >
                        {card.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td>
                      <div className="table-action-buttons">
                        <button onClick={() => handleTogglePublish(card.id)}>
                          {card.isPublished ? "Unpublish" : "Publish"}
                        </button>
                        <button className="danger" onClick={() => handleDelete(card.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogPreview;
