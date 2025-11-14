import React, { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  MapPin,
  User,
  Tag,
  Clock,
  DollarSign,
  Copy,
  Share2,
  X,
} from "lucide-react";
import "./AddEventPreview.css";

type EventDataPreview = {
  id: number;
  eventName: string;
  eventLocation: string;
  locationImage?: string;
  eventDate: string;
  eventDescription: string;
  eventOrganizer: string;
  openingDate?: string;
  closingDate?: string;
  status: "Ongoing" | "Date Over";
  registrationFee?: string;
  category: "Normal" | "Top Category" | "Both";
  publishingDate: string;
};

const demoEvents: EventDataPreview[] = [
  {
    id: 1,
    eventName: "AI & ML Symposium 2025",
    eventLocation: "IIIT Auditorium",
    locationImage:
      "https://images.unsplash.com/photo-1503424886306-4f1a7f6b58d6?auto=format&fit=crop&w=1400&q=60",
    eventDate: "2025-11-04",
    eventDescription:
      "<p>An advanced symposium exploring production ML, responsible AI, and real-world case studies. Speakers from industry and academia.</p><ul><li>Keynotes</li><li>Panels</li><li>Workshops</li></ul>",
    eventOrganizer: "Research & AI Cell",
    openingDate: "2025-10-10",
    closingDate: "2025-11-03",
    status: "Ongoing",
    registrationFee: "₹1,999",
    category: "Top Category",
    publishingDate: "2025-09-01",
  },
  {
    id: 2,
    eventName: "Frontend Conf — Accessibility Edition",
    eventLocation: "Hybrid (Online + Bangalore)",
    locationImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=60",
    eventDate: "2025-10-20",
    eventDescription:
      "<p>Hands-on sessions focused on building accessible, responsive components with modern tooling.</p>",
    eventOrganizer: "UI/UX Team",
    openingDate: "2025-09-20",
    closingDate: "2025-10-18",
    status: "Ongoing",
    registrationFee: "₹999",
    category: "Normal",
    publishingDate: "2025-09-15",
  },
  {
    id: 3,
    eventName: "Startup Pitch Day",
    eventLocation: "Innovation Hub",
    locationImage:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=60",
    eventDate: "2025-12-05",
    eventDescription:
      "<p>Invite-only pitch day for pre-seed startups. Mentorship and potential investor introductions.</p>",
    eventOrganizer: "Incubation Center",
    openingDate: "2025-11-01",
    closingDate: "2025-12-04",
    status: "Date Over",
    registrationFee: "₹0",
    category: "Both",
    publishingDate: "2025-10-10",
  },
  {
    id: 4,
    eventName: "Career Fair 2025",
    eventLocation: "Open Grounds",
    locationImage:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=60",
    eventDate: "2025-09-30",
    eventDescription:
      "<p>Meet hiring teams from leading companies. Bring your resume and portfolio.</p>",
    eventOrganizer: "Placement Cell",
    openingDate: "2025-09-01",
    closingDate: "2025-09-29",
    status: "Ongoing",
    registrationFee: "₹0",
    category: "Normal",
    publishingDate: "2025-08-20",
  },
];

const AddEventPreview: React.FC = () => {
  const [events, setEvents] = useState<EventDataPreview[]>(demoEvents);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [previewEvent, setPreviewEvent] = useState<EventDataPreview | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  // refs map for menu wrappers (to detect outside clicks)
  const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const setMenuRef = (id: number) => (el: HTMLDivElement | null) => {
    menuRefs.current[id] = el;
  };

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (openMenuId === null) return;
      const wrapper = menuRefs.current[openMenuId];
      if (!wrapper || !wrapper.contains(e.target as Node)) setOpenMenuId(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenMenuId(null);
        setPreviewEvent(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenuId]);

  const toggleMenu = (id: number) => setOpenMenuId((p) => (p === id ? null : id));

  const handleTogglePublish = (id: number) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id ? { ...ev, status: ev.status === "Ongoing" ? "Date Over" : "Ongoing" } : ev
      )
    );
    setOpenMenuId(null);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this event preview?")) return;
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    setOpenMenuId(null);
  };

  const handleEdit = (id: number) => {
    const ev = events.find((e) => e.id === id);
    alert(`Edit (preview-only): ${ev?.eventName}`);
    setOpenMenuId(null);
  };

  const handlePreview = (id: number) => {
    const ev = events.find((e) => e.id === id) || null;
    setPreviewEvent(ev);
    setOpenMenuId(null);
  };

  const closePreview = () => setPreviewEvent(null);

  const fmt = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString();
  };

  const handleCopyLink = async (id: number) => {
    try {
      const url = `${window.location.origin}/events/${id}`;
      await navigator.clipboard.writeText(url);
      setCopied(id);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      alert("Copy failed");
    }
  };

  const handleShare = (ev: EventDataPreview) => {
    const url = `${window.location.origin}/events/${ev.id}`;
    if (navigator.share) {
      navigator.share({ title: ev.eventName, text: ev.eventDescription.replace(/<[^>]+>/g, ""), url }).catch(() => {});
    } else {
      handleCopyLink(ev.id);
      alert("Link copied to clipboard");
    }
  };

  return (
    <div className="ae-root">
      <header className="ae-header">
        <div className="ae-head-left">
          <h1 className="ae-title">Events — Preview Gallery</h1>
          <p className="ae-sub">Beautiful, responsive event cards — modernized UX & interactions.</p>
        </div>

        <div className="ae-controls">
          <div className="ae-search" role="search" aria-label="Search events">
            <svg className="ae-search-icon" viewBox="0 0 24 24" aria-hidden>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <input placeholder="Search events (demo)..." aria-label="Search events" />
          </div>
        </div>
      </header>

      <main className="ae-grid" aria-live="polite">
        {events.map((ev, i) => (
          <article
            key={ev.id}
            className="ae-card"
            tabIndex={0}
            style={{ animationDelay: `${i * 60}ms` }}
            aria-labelledby={`ae-title-${ev.id}`}
          >
            <div
              className="ae-visual"
              style={{ backgroundImage: `linear-gradient(rgba(10,12,20,0.18), rgba(10,12,20,0.02)), url(${ev.locationImage})` }}
              role="img"
              aria-label={ev.eventName}
            >
              <div className="ae-visual-left">
                <span className={`ae-badge ae-badge-${ev.category.replace(/\s+/g, "").toLowerCase()}`}>{ev.category}</span>
                <time className="ae-date"><Calendar size={14} /> {fmt(ev.eventDate)}</time>
              </div>

              <div className="ae-visual-right">
                <button
                  className="ae-3dots"
                  onClick={() => toggleMenu(ev.id)}
                  aria-expanded={openMenuId === ev.id}
                  aria-controls={`ae-dropdown-${ev.id}`}
                  aria-label={`More actions for ${ev.eventName}`}
                >
                  <MoreVertical size={18} />
                </button>

                <div className="ae-menu-wrap" ref={setMenuRef(ev.id)}>
                  {openMenuId === ev.id && (
                    <div id={`ae-dropdown-${ev.id}`} className="ae-dropdown" role="menu">
                      <button className="ae-dropdown-item" onClick={() => handleTogglePublish(ev.id)} role="menuitem">
                        {ev.status === "Ongoing" ? <EyeOff size={14} /> : <Eye size={14} />}
                        <span>{ev.status === "Ongoing" ? "Unpublish" : "Publish"}</span>
                      </button>

                      <button className="ae-dropdown-item" onClick={() => handlePreview(ev.id)} role="menuitem">
                        <ExternalLink size={14} /> <span>Preview</span>
                      </button>

                      <button className="ae-dropdown-item" onClick={() => handleEdit(ev.id)} role="menuitem">
                        <Edit size={14} /> <span>Edit</span>
                      </button>

                      <button className="ae-dropdown-item danger" onClick={() => handleDelete(ev.id)} role="menuitem">
                        <Trash2 size={14} /> <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="ae-body">
              <div className="ae-row">
                <div className="ae-head">
                  <h3 id={`ae-title-${ev.id}`} className="ae-name">{ev.eventName}</h3>
                  <div className="ae-meta"><MapPin size={12} /> <span>{ev.eventLocation}</span></div>
                </div>

                <div className="ae-status">
                  <span className={`ae-dot ${ev.status === "Ongoing" ? "ae-ongoing" : "ae-over"}`} />
                  <span className="ae-status-text">{ev.status}</span>
                </div>
              </div>

              <div className="ae-tiles">
                <div className="ae-tile">
                  <div className="ae-tile-label"><DollarSign size={12} /> Fee</div>
                  <div className="ae-tile-value">{ev.registrationFee || "Free"}</div>
                </div>

                <div className="ae-tile">
                  <div className="ae-tile-label"><Clock size={12} /> Duration</div>
                  <div className="ae-tile-value">{ev.openingDate && ev.closingDate ? `${fmt(ev.openingDate)} — ${fmt(ev.closingDate)}` : "—"}</div>
                </div>

                <div className="ae-tile">
                  <div className="ae-tile-label"><User size={12} /> Organizer</div>
                  <div className="ae-tile-value">{ev.eventOrganizer}</div>
                </div>

                <div className="ae-tile">
                  <div className="ae-tile-label"><Tag size={12} /> Category</div>
                  <div className="ae-tile-value">{ev.category}</div>
                </div>
              </div>

              <div className="ae-bottom">
                <div
                  className="ae-excerpt"
                  dangerouslySetInnerHTML={{ __html: ev.eventDescription.length > 120 ? ev.eventDescription.slice(0, 120) + "..." : ev.eventDescription }}
                />

                <div className="ae-actions-sm">
                  <button className="ae-btn ghost" onClick={() => handlePreview(ev.id)} aria-label={`Preview ${ev.eventName}`}>
                    <ExternalLink size={14} /> Preview
                  </button>

                  <div className="ae-share">
                    <button className="ae-icon" onClick={() => handleCopyLink(ev.id)} title="Copy link">
                      <Copy size={14} />
                      <span className="sr-only">Copy link</span>
                    </button>
                    <button className="ae-icon" onClick={() => handleShare(ev)} title="Share">
                      <Share2 size={14} />
                      <span className="sr-only">Share</span>
                    </button>
                    <span className={`ae-toast ${copied === ev.id ? "show" : ""}`}>{copied === ev.id ? "Copied!" : ""}</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </main>

      {previewEvent && (
        <div className="ae-modal-back" role="dialog" aria-modal="true" aria-label="Event preview">
          <div className="ae-modal" role="document">
            <button className="ae-modal-close" onClick={closePreview} aria-label="Close preview"><X size={18} /></button>

            <div className="ae-modal-top">
              <img src={previewEvent.locationImage} alt={previewEvent.eventName} />

              <div className="ae-modal-info">
                <h3>{previewEvent.eventName}</h3>
                <p className="ae-muted"><MapPin size={12} /> {previewEvent.eventLocation} • <Calendar size={12} /> {fmt(previewEvent.eventDate)}</p>
                <p className="ae-muted">Organizer: {previewEvent.eventOrganizer} • Category: {previewEvent.category}</p>

                <div className="ae-modal-actions">
                  <button className="ae-btn" onClick={() => handleCopyLink(previewEvent.id)}><Copy size={14} /> Copy Link</button>
                  <button className="ae-btn ghost" onClick={() => handleShare(previewEvent)}><Share2 size={14} /> Share</button>
                </div>
              </div>
            </div>

            <div className="ae-modal-body">
              <h4>Event Description</h4>
              <div dangerouslySetInnerHTML={{ __html: previewEvent.eventDescription }} />

              <div className="ae-modal-grid">
                <div><strong>Opening:</strong> {fmt(previewEvent.openingDate)}</div>
                <div><strong>Closing:</strong> {fmt(previewEvent.closingDate)}</div>
                <div><strong>Fee:</strong> {previewEvent.registrationFee || "Free"}</div>
                <div><strong>Published:</strong> {previewEvent.publishingDate}</div>
              </div>
            </div>

            <div className="ae-modal-footer">
              <button className="ae-btn" onClick={() => { alert("Edit (preview-only)"); }}>Edit</button>
              <button className="ae-btn ghost" onClick={closePreview}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEventPreview;
