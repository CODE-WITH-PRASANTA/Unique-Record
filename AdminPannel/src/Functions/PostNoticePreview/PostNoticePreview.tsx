import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  ExternalLink,
  Table as TableIcon,
  Grid as GridIcon,
  Search
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
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800",
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
    image: "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=800",
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
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
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
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [filterDate, setFilterDate] = useState<{ start?: string; end?: string }>({});

  const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const setMenuRef = (id: number) => (el: HTMLDivElement | null) => {
    menuRefs.current[id] = el;
  };

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

  const toggleMenu = (id: number) => setOpenMenu((prev) => (prev === id ? null : id));

  const togglePublish = (id: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, published: !c.published } : c))
    );
    setOpenMenu(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this notice?")) {
      setCards((prev) => prev.filter((c) => c.id !== id));
      setOpenMenu(null);
    }
  };

  // Filter logic
  const filteredCards = cards.filter((card) => {
    const matchesQuery =
      card.title.toLowerCase().includes(query.toLowerCase()) ||
      card.description.toLowerCase().includes(query.toLowerCase()) ||
      card.author.toLowerCase().includes(query.toLowerCase());
    const matchesDate =
      (!filterDate.start || new Date(card.noticeDate) >= new Date(filterDate.start)) &&
      (!filterDate.end || new Date(card.noticeDate) <= new Date(filterDate.end));
    return matchesQuery && matchesDate;
  });

  return (
    <div className="noticepreview-page">
      {/* Search and Filter */}
      <div className="noticepreview-filter-bar">
        <div className="noticepreview-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by title, description, or author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="noticepreview-search-input"
          />
        </div>
        <div className="noticepreview-date-filter">
          <input
            type="date"
            onChange={(e) => setFilterDate({ ...filterDate, start: e.target.value })}
          />
          <span>to</span>
          <input
            type="date"
            onChange={(e) => setFilterDate({ ...filterDate, end: e.target.value })}
          />
        </div>
      </div>

      {/* Top Bar */}
      <div className="noticepreview-topbar">
        <h2 className="noticepreview-title-main">Notice Preview</h2>
        <div className="noticepreview-toggle-wrapper">
          <button
            className={`toggle-icon-btn ${viewType === "grid" ? "active" : ""}`}
            onClick={() => setViewType("grid")}
          >
            <GridIcon size={20} />
          </button>
          <button
            className={`toggle-icon-btn ${viewType === "list" ? "active" : ""}`}
            onClick={() => setViewType("list")}
          >
            <TableIcon size={20} />
          </button>
        </div>
      </div>

      {/* Card/List View */}
      {viewType === "grid" ? (
        <div className="noticepreview-grid">
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <div key={card.id} className="noticepreview-card">
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

                <div className="noticepreview-status">
                  <span
                    className={
                      card.published ? "noticepreview-dot green" : "noticepreview-dot yellow"
                    }
                  />
                  {card.published ? "Published" : "Draft"}
                </div>

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

                <div className="noticepreview-bottom">
                  <div className="noticepreview-bottom-title">Details</div>
                  <p className="noticepreview-desc">{card.description}</p>
                  {card.link && (
                    <a
                      href={card.link}
                      rel="noreferrer"
                      target="_blank"
                      className="noticepreview-link"
                    >
                      <ExternalLink size={14} /> Visit Link
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="noticepreview-empty">No matching notices found.</p>
          )}
        </div>
      ) : (
        <div className="noticepreview-list-wrapper">
          <table className="noticepreview-table">
            <thead>
              <tr>
                <th>SL No.</th>
                <th>Title</th>
                <th>Notice Date</th>
                <th>Posted Date</th>
                <th>Status</th>
                <th>Details</th>
                <th>Link</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((card, index) => (
                <tr key={card.id}>
                  <td>{index + 1}</td>
                  <td>{card.title}</td>
                  <td>{card.noticeDate}</td>
                  <td>{card.postingDate}</td>
                  <td>
                    <span
                      className={`status-tag ${card.published ? "active" : "draft"}`}
                    >
                      {card.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td title={card.description}>
                    {card.description.slice(0, 30)}...
                  </td>
                  <td>
                    <a
                      className="noticepreview-table-link"
                      href={card.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit <ExternalLink size={14} />
                    </a>
                  </td>
                  <td className="noticepreview-table-actions">
                    <button
                      className="action-btn publish-btn"
                      onClick={() => togglePublish(card.id)}
                    >
                      {card.published ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(card.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PostNoticePreview;
