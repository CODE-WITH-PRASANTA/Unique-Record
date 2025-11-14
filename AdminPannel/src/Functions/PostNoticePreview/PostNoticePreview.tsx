import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  ExternalLink
} from "lucide-react";
import "./PostNoticePreview.css";

interface NoticePreviewCard {
  id: number;
  image: string;
  title: string;
  author: string;
  noticeDate: string;
  postingDate: string;
  link?: string;
  published: boolean;
  description: string;
}

const demoNotices: NoticePreviewCard[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800",
    title: "Important Notice: Upcoming Maintenance",
    author: "Admin Team",
    noticeDate: "2025-02-01",
    postingDate: "2025-01-20",
    published: true,
    description:
      "Scheduled maintenance will occur this weekend. Please plan accordingly.",
    link: "https://example.com/notice1"
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=800",
    title: "Holiday Announcement for February",
    author: "HR Department",
    noticeDate: "2025-02-10",
    postingDate: "2025-01-28",
    published: false,
    description:
      "The office will remain closed on February 10th for a public holiday.",
    link: "https://example.com/notice2"
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    title: "New Policy Update: Work Guidelines",
    author: "Management",
    noticeDate: "2025-01-30",
    postingDate: "2025-01-18",
    published: true,
    description:
      "A new update has been added to the work guidelines. All employees are advised to read it.",
    link: "https://example.com/notice3"
  }
];

const PostNoticePreview: React.FC = () => {
  const [cards, setCards] = useState(demoNotices);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const setMenuRef =
    (id: number) => (el: HTMLDivElement | null) => {
      menuRefs.current[id] = el;
    };

  // click outside close
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!openMenu) return;
      const ref = menuRefs.current[openMenu];
      if (!ref || !ref.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenu]);

  const toggleMenu = (id: number) =>
    setOpenMenu((prev) => (prev === id ? null : id));

  const togglePublish = (id: number) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, published: !c.published } : c
      )
    );
    setOpenMenu(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this notice?")) {
      setCards((prev) => prev.filter((c) => c.id !== id));
      setOpenMenu(null);
    }
  };

  return (
    <div className="noticepreview-page">
      <div className="noticepreview-grid">
        {cards.map((card) => (
          <div key={card.id} className="noticepreview-card">

            {/* --- TOP SECTION --- */}
            <div className="noticepreview-top">
              <div className="noticepreview-left">
                <img
                  src={card.image}
                  className="noticepreview-thumb"
                  alt={card.title}
                />

                <div className="noticepreview-title-wrap">
                  <div className="noticepreview-title">{card.title}</div>
                  <div className="noticepreview-sub">{card.author}</div>
                </div>
              </div>

              {/* 3-dots */}
              <div
                className="noticepreview-menu-wrapper"
                ref={setMenuRef(card.id)}
              >
                <button
                  className="noticepreview-3dots"
                  onClick={() => toggleMenu(card.id)}
                >
                  <MoreVertical size={20} />
                </button>

                {openMenu === card.id && (
                  <div className="noticepreview-dropdown">
                    <button
                      className="noticepreview-dropdown-item"
                      onClick={() => togglePublish(card.id)}
                    >
                      {card.published ? (
                        <>
                          <EyeOff size={16} /> Unpublish
                        </>
                      ) : (
                        <>
                          <Eye size={16} /> Publish
                        </>
                      )}
                    </button>

                    <button
                      className="noticepreview-dropdown-item"
                      onClick={() => alert("Preview Coming Soon")}
                    >
                      <ExternalLink size={16} /> Preview
                    </button>

                    <button
                      className="noticepreview-dropdown-item"
                      onClick={() => alert("Edit Coming Soon")}
                    >
                      <Edit size={16} /> Edit
                    </button>

                    <button
                      className="noticepreview-dropdown-item danger"
                      onClick={() => handleDelete(card.id)}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="noticepreview-status">
              <span
                className={
                  card.published
                    ? "noticepreview-dot green"
                    : "noticepreview-dot yellow"
                }
              />
              {card.published ? "Published" : "Draft"}
            </div>

            {/* Tiles */}
            <div className="noticepreview-tiles">
              <div className="noticepreview-tile">
                <span>Notice Date:</span>
                <strong>{card.noticeDate}</strong>
              </div>

              <div className="noticepreview-tile">
                <span>Posted:</span>
                <strong>{card.postingDate}</strong>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="noticepreview-bottom">
              <div className="noticepreview-bottom-title">Details</div>
              <p className="noticepreview-desc">{card.description}</p>

              {card.link && (
                <a
                  href={card.link}
                  target="_blank"
                  rel="noreferrer"
                  className="noticepreview-link"
                >
                  <ExternalLink size={14} /> Visit Link
                </a>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default PostNoticePreview;
