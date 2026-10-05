import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  FiUser,
  FiLink,
  FiDownload,
  FiImage,
  FiSearch,
  FiCalendar,
  FiPaperclip,
  FiExternalLink,
  FiBell,
  FiCheckCircle,
  FiEye,
  FiX,
  FiShare2,
  FiCopy,
  FiCheck,
  FiFileText,
  FiArrowRight,
} from "react-icons/fi";
import "./NoticeContent.css";
import { API_URL } from "../../Api";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const parseDate = (dateStr) => {
  if (!dateStr) return { day: "--", month: "---", year: "----", formatted: "-" };
  const str = String(dateStr).substring(0, 10);
  const parts = str.split("-");
  if (parts.length === 3) {
    const year = parts[0];
    const monthNum = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const month = MONTH_NAMES[monthNum - 1] || "";
    return {
      day: isNaN(day) ? "" : day,
      month,
      year: isNaN(year) ? "" : year,
      formatted: `${day} ${month} ${year}`,
    };
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const day = d.getDate();
    const month = MONTH_NAMES[d.getMonth()];
    const year = d.getFullYear();
    return {
      day,
      month,
      year,
      formatted: `${day} ${month} ${year}`,
    };
  }
  return { day: "--", month: "---", year: "----", formatted: String(dateStr) };
};

const formatSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const NoticeSection = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fetch notices from backend
  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}/notices`);
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        const sorted = [...list].sort(
          (a, b) => new Date(b.postingDate || b.createdAt) - new Date(a.postingDate || a.createdAt)
        );
        setNotices(sorted);
      } catch (err) {
        console.error("Error loading notices:", err);
        setError("Unable to load notices. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Keyboard close for modal
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedNotice(null);
    };
    if (selectedNotice) {
      window.addEventListener("keydown", onKey);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedNotice]);

  const handleDownload = (e, url, filename) => {
    if (e) e.stopPropagation();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || url.split("/").pop() || "notice-document";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notices;
    return notices.filter((n) =>
      [n.title, n.postOwner, n.description].some(
        (val) => val && val.toLowerCase().includes(q)
      )
    );
  }, [notices, search]);

  return (
    <section className="fresh-notice-scope">
      {/* 1. Header Toolbar */}
      <div className="fresh-notice-toolbar">
        <div className="fresh-search-bar">
          <FiSearch className="search-ico" />
          <input
            type="text"
            placeholder="Search announcements, orders, circulars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearch("")}
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        <div className="fresh-notice-counter">
          <span>Active Announcements: </span>
          <strong>{filtered.length}</strong>
        </div>
      </div>

      {/* 2. Notice Cards Grid */}
      {loading ? (
        <div className="fresh-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="fresh-skeleton-card">
              <div className="fresh-skel-img"></div>
              <div className="fresh-skel-body">
                <div className="fresh-skel-line w-40"></div>
                <div className="fresh-skel-line w-90 h-title"></div>
                <div className="fresh-skel-line w-75"></div>
                <div className="fresh-skel-line w-60"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="fresh-empty-state error">
          <FiBell size={40} />
          <h3>Notice Board Alert</h3>
          <p>{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="fresh-empty-state">
          <FiSearch size={40} />
          <h3>No Notices Found</h3>
          <p>We couldn't find any announcements matching "{search}".</p>
          <button
            type="button"
            className="fresh-btn-primary"
            onClick={() => setSearch("")}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="fresh-grid">
          {filtered.map((item) => {
            const date = parseDate(item.postingDate);
            const filesList = Array.isArray(item.files) && item.files.length > 0
              ? item.files
              : item.otherFiles
                ? [{ name: "Document", url: item.otherFiles }]
                : [];

            return (
              <article
                key={item._id}
                className="fresh-card"
                onClick={() => setSelectedNotice(item)}
              >
                {/* Card Banner */}
                <div className="fresh-card-media">
                  {item.photo ? (
                    <img src={item.photo} alt={item.title} loading="lazy" />
                  ) : (
                    <div className="fresh-card-media-placeholder">
                      <FiImage size={36} />
                      <span>Official Notice</span>
                    </div>
                  )}

                  {/* Date Badge */}
                  <div className="fresh-date-badge">
                    <span className="day">{date.day}</span>
                    <span className="mon">{date.month}</span>
                    <span className="yr">{date.year}</span>
                  </div>

                  <div className="fresh-card-hover-mask">
                    <span className="view-tag">
                      <FiEye size={15} /> Read Full Notice
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="fresh-card-body">
                  <div className="fresh-card-meta">
                    <div className="author-tag">
                      <span className="author-dot"></span>
                      <span>By {item.postOwner || "Admin"}</span>
                    </div>
                    {filesList.length > 0 && (
                      <span className="doc-pill">
                        <FiPaperclip size={12} /> {filesList.length} {filesList.length > 1 ? "Files" : "File"}
                      </span>
                    )}
                  </div>

                  <h3 className="fresh-card-title">{item.title}</h3>
                  <p className="fresh-card-desc">{item.description}</p>

                  <div className="fresh-card-footer" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="fresh-view-btn"
                      onClick={() => setSelectedNotice(item)}
                    >
                      <span>View Details</span>
                      <FiArrowRight size={14} />
                    </button>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fresh-link-btn"
                        title="Open Resource Link"
                      >
                        <FiExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* =========================================================
          3. COMPLETELY REDESIGNED FRESH MODAL (NO SCROLLBARS)
          ========================================================= */}
      {selectedNotice && (() => {
        const date = parseDate(selectedNotice.postingDate);
        const filesList = Array.isArray(selectedNotice.files) && selectedNotice.files.length > 0
          ? selectedNotice.files
          : selectedNotice.otherFiles
            ? [{ name: "Official Attachment", url: selectedNotice.otherFiles }]
            : [];

        return (
          <div className="fresh-modal-backdrop" onClick={() => setSelectedNotice(null)}>
            <div className="fresh-modal-shell" onClick={(e) => e.stopPropagation()}>

              {/* Modal Top Floating Actions */}
              <div className="fresh-modal-nav">
                <div className="fresh-modal-pill-badge">
                  <FiCheckCircle size={14} />
                  <span>Verified Notice</span>
                </div>
                <button
                  type="button"
                  className="fresh-modal-close-ico"
                  onClick={() => setSelectedNotice(null)}
                  title="Close (ESC)"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Scrollable Body (No visible right scrollbar) */}
              <div className="fresh-modal-scrollable">

                {/* Hero Showcase */}
                {selectedNotice.photo && (
                  <div className="fresh-modal-hero-cover">
                    <img src={selectedNotice.photo} alt={selectedNotice.title} />
                  </div>
                )}

                {/* Main Content Area */}
                <div className="fresh-modal-content-area">

                  {/* Notice Meta Strip */}
                  <div className="fresh-modal-meta-strip">
                    <div className="meta-strip-item">
                      <FiUser className="ico" />
                      <div>
                        <small>Posted By</small>
                        <strong>{selectedNotice.postOwner || "Unique Records Admin"}</strong>
                      </div>
                    </div>

                    <div className="meta-strip-item">
                      <FiCalendar className="ico" />
                      <div>
                        <small>Publication Date</small>
                        <strong>{date.formatted}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="fresh-modal-heading">{selectedNotice.title}</h1>

                  {/* Full Description */}
                  <div className="fresh-modal-text-block">
                    {selectedNotice.description}
                  </div>

                  {/* External Resource Card */}
                  {selectedNotice.link && (
                    <div className="fresh-modal-link-box">
                      <div className="link-box-left">
                        <FiLink size={18} className="link-ico" />
                        <div>
                          <strong>Official Website / Resource Link</strong>
                          <a
                            href={selectedNotice.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {selectedNotice.link}
                          </a>
                        </div>
                      </div>
                      <div className="link-box-actions">
                        <button
                          type="button"
                          className="copy-btn"
                          onClick={() => handleCopyLink(selectedNotice.link)}
                        >
                          {copied ? <FiCheck size={14} color="#10b981" /> : <FiCopy size={14} />}
                          <span>{copied ? "Copied" : "Copy"}</span>
                        </button>
                        <a
                          href={selectedNotice.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="open-btn"
                        >
                          <FiExternalLink size={14} />
                          <span>Open</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Document Attachments */}
                  {filesList.length > 0 && (
                    <div className="fresh-modal-docs-box">
                      <h3>
                        <FiPaperclip size={16} /> Attached Files & Circulars ({filesList.length})
                      </h3>
                      <div className="fresh-docs-list">
                        {filesList.map((file, idx) => (
                          <div key={file._id || file.url || idx} className="fresh-doc-card">
                            <div className="doc-left">
                              <div className="doc-type-icon">
                                <FiFileText size={18} />
                              </div>
                              <div className="doc-info">
                                <span className="doc-name">{file.name || `Document ${idx + 1}`}</span>
                                {file.size ? (
                                  <span className="doc-size">{formatSize(file.size)}</span>
                                ) : null}
                              </div>
                            </div>
                            <button
                              type="button"
                              className="doc-download-action"
                              onClick={(e) => handleDownload(e, file.url, file.name)}
                            >
                              <FiDownload size={14} />
                              <span>Download</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Fixed Footer Bar */}
              <div className="fresh-modal-action-bar">
                <button
                  type="button"
                  className="fresh-btn-ghost"
                  onClick={() => handleCopyLink(window.location.href)}
                >
                  <FiShare2 size={14} />
                  <span>Share Announcement</span>
                </button>
                <button
                  type="button"
                  className="fresh-btn-done"
                  onClick={() => setSelectedNotice(null)}
                >
                  Close Notice
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </section>
  );
};

export default NoticeSection;
