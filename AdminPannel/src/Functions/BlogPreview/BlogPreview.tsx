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
} from "lucide-react";
import "./BlogPreview.css";

type DemoCard = {
  id: number;
  title: string;
  bannerUrl?: string;
  author: string;
  designation?: string;
  category: string;
  postingDateTime: string;
  excerpt?: string;
  tags: string[];
  readTime: string;
  comments: number;
  views: number;
  isPublished: boolean;
  contactEmail?: string;
};

const initialDemoCards: DemoCard[] = [
  {
    id: 1,
    title: "How to Build Accessible, Responsive React Components",
    bannerUrl:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=60",
    author: "Priya Sharma",
    designation: "Senior Frontend Engineer",
    category: "Development",
    postingDateTime: new Date().toISOString(),
    excerpt:
      "A practical and modern guide for creating beautiful accessible interfaces in React.",
    tags: ["react", "accessibility", "responsive"],
    readTime: "6 min",
    comments: 12,
    views: 1423,
    isPublished: true,
    contactEmail: "priya.sharma@example.com",
  },
  {
    id: 2,
    title: "Design Systems: From Tokens to Production",
    bannerUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=60",
    author: "Arjun Patel",
    designation: "UI/UX Lead",
    category: "Design",
    postingDateTime: new Date(Date.now() - 86400000).toISOString(),
    excerpt: "A comprehensive walkthrough of building scalable design systems.",
    tags: ["design", "tokens", "ui"],
    readTime: "8 min",
    comments: 8,
    views: 980,
    isPublished: false,
    contactEmail: "arjun.patel@example.com",
  },
  {
    id: 3,
    title: "Marketing Funnels That Actually Convert",
    bannerUrl:
      "https://images.unsplash.com/photo-1508385082359-f1d7b8f7a7f9?auto=format&fit=crop&w=1200&q=60",
    author: "Meera Kapoor",
    designation: "Growth Marketer",
    category: "Marketing",
    postingDateTime: new Date(Date.now() - 86400000 * 2).toISOString(),
    excerpt: "Growth-focused funnel strategies that drive real impact.",
    tags: ["growth", "analytics", "funnels"],
    readTime: "5 min",
    comments: 3,
    views: 560,
    isPublished: true,
    contactEmail: "meera.kapoor@example.com",
  },
];

const BlogPreview: React.FC = () => {
  const [cards, setCards] = useState<DemoCard[]>(initialDemoCards);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // refs per-card for outside-click detection
  const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // typed callback ref setter
  const setMenuRef =
    (id: number) =>
    (el: HTMLDivElement | null): void => {
      menuRefs.current[id] = el;
    };

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (openMenuId === null) return;
      const wrapper = menuRefs.current[openMenuId];
      if (!wrapper || !wrapper.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [openMenuId]);

  const toggleMenu = (id: number) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleTogglePublish = (id: number) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, isPublished: !c.isPublished } : c)));
    setOpenMenuId(null);
  };

  const handleDelete = (id: number) => {
    const confirmed = confirm("Delete this item? This action cannot be undone.");
    if (!confirmed) return;
    setCards((prev) => prev.filter((c) => c.id !== id));
    setOpenMenuId(null);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString();
  };

  return (
    <div className="blogpreview-page">
      <div className="blogpreview-grid">
        {cards.map((card) => (
          <article
            key={card.id}
            className="blogpreview-card"
            aria-labelledby={`blogpreview-card-title-${card.id}`}
          >
            <div className="blogpreview-card-top">
              <div className="blogpreview-card-left">
                <img src={card.bannerUrl} alt={card.title} className="blogpreview-thumb" />

                <div className="blogpreview-title-container">
                  <div id={`blogpreview-card-title-${card.id}`} className="blogpreview-title">
                    {card.title}
                  </div>
                  <div className="blogpreview-subtitle">
                    {card.author} • {card.designation}
                  </div>
                </div>
              </div>

              <div className="blogpreview-menu-wrapper" ref={setMenuRef(card.id)}>
                <button
                  className="blogpreview-3dots"
                  onClick={() => toggleMenu(card.id)}
                  aria-expanded={openMenuId === card.id}
                  aria-controls={`blogpreview-dropdown-${card.id}`}
                  aria-label="Open card menu"
                >
                  <MoreVertical size={18} />
                </button>

                {openMenuId === card.id && (
                  <div
                    id={`blogpreview-dropdown-${card.id}`}
                    className="blogpreview-dropdown"
                    role="menu"
                    aria-label="Card actions"
                  >
                    <button
                      className="blogpreview-dropdown-item"
                      onClick={() => handleTogglePublish(card.id)}
                      role="menuitem"
                    >
                      {card.isPublished ? (
                        <>
                          <CircleOff size={14} /> <span>Unpublish</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} /> <span>Publish</span>
                        </>
                      )}
                    </button>

                    <button
                      className="blogpreview-dropdown-item danger"
                      onClick={() => handleDelete(card.id)}
                      role="menuitem"
                    >
                      <Trash2 size={14} /> <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="blogpreview-status" aria-hidden>
              <span
                className={`blogpreview-status-dot ${card.isPublished ? "published" : "draft"}`}
              />
              <span>{card.isPublished ? "Published" : "Draft"}</span>
            </div>

            <div className="blogpreview-tiles" role="list" aria-label="Card metadata">
              <div className="blogpreview-tile" role="listitem" title="Estimated read time">
                <Clock size={14} /> <span>{card.readTime}</span>
              </div>

              <div className="blogpreview-tile" role="listitem" title="Views">
                <Eye size={14} /> <span>{card.views.toLocaleString()}</span>
              </div>

              <div className="blogpreview-tile" role="listitem" title="Posting date">
                <Calendar size={14} /> <span>{formatDate(card.postingDateTime)}</span>
              </div>

              <div className="blogpreview-tile" role="listitem" title="Author">
                <User size={14} /> <span>{card.author}</span>
              </div>
            </div>

            <div className="blogpreview-bottom">
              <div className="blogpreview-bottom-title">
                <Folder size={16} /> <span>{card.category}</span>
              </div>

              <div className="blogpreview-tags" aria-hidden>
                {card.tags.map((t) => (
                  <span key={t} className="blogpreview-tag">
                    <Tag size={12} /> <span>{t}</span>
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogPreview;
