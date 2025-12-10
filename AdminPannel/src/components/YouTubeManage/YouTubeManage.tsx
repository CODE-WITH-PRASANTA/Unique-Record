import React, { useState, useRef, FormEvent, ChangeEvent } from "react";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaTimes,
  FaPlay,
  FaCheck,
  FaYoutube,
} from "react-icons/fa";
import "./YouTubeManage.css";

/**
 * YouTubeManage.tsx
 * - Left: small form to add a YouTube link + title
 * - Right: table showing videos (S.No, preview thumbnail, title, action)
 * - Clicking preview opens a modal with embedded player
 *
 * Uses the uploaded placeholder at:
 * /mnt/data/134826f7-fcdf-4923-89fb-d24e59c867da.jpg
 */

type VideoItem = {
  id: string;
  url: string;
  title: string;
  youtubeId?: string;
  thumbnail?: string;
};

const PLACEHOLDER = "/mnt/data/134826f7-fcdf-4923-89fb-d24e59c867da.jpg";

const uid = () => Math.random().toString(36).slice(2, 9);

/** Extract youtube video id from many URL formats */
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  // common youtube id patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/v\/([A-Za-z0-9_-]{6,})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m && m[1]) return m[1];
  }
  // last-resort: try query param v
  try {
    const u = new URL(url);
    const v = u.searchParams.get("v");
    if (v) return v;
  } catch (e) {
    // ignore invalid URL parse
  }
  return null;
}

/** Given id return standard thumbnail URL */
function youtubeThumb(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

const YouTubeManage: React.FC = () => {
  const [link, setLink] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [items, setItems] = useState<VideoItem[]>([
    {
      id: uid(),
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Demo Video — Opening Talk",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: youtubeThumb("dQw4w9WgXcQ"),
    },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null); // for modal
  const linkRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setLink("");
    setTitle("");
    setEditingId(null);
    if (linkRef.current) linkRef.current.value = "";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = link.trim();
    if (!trimmed) return;

    const id = extractYouTubeId(trimmed);
    const thumb = id ? youtubeThumb(id) : PLACEHOLDER;

    if (editingId) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingId
            ? { ...it, url: trimmed, title: title || it.title, youtubeId: id ?? undefined, thumbnail: thumb }
            : it
        )
      );
      resetForm();
      return;
    }

    const newItem: VideoItem = {
      id: uid(),
      url: trimmed,
      title: title || "Untitled Video",
      youtubeId: id ?? undefined,
      thumbnail: id ? thumb : PLACEHOLDER,
    };
    setItems((p) => [newItem, ...p]);
    resetForm();
  };

  const handleEdit = (id: string) => {
    const it = items.find((x) => x.id === id);
    if (!it) return;
    setEditingId(id);
    setLink(it.url);
    setTitle(it.title);
    if (linkRef.current) linkRef.current.value = it.url;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (editingId === id) resetForm();
  };

  const openPreview = (youtubeId?: string) => {
    if (!youtubeId) return;
    setPreviewId(youtubeId);
  };

  const closePreview = () => setPreviewId(null);

  return (
    <div className="yt-root">
      <div className="yt-inner">
        {/* LEFT: small form */}
        <div className="yt-left">
          <div className="yt-card">
            <div className="yt-card-header">
              <h2 className="yt-title">{editingId ? "Edit Video" : "Add YouTube Link"}</h2>
              <div className="yt-sub">Paste a YouTube URL and submit</div>
            </div>

            <form className="yt-form" onSubmit={handleSubmit}>
              <label className="yt-label" htmlFor="yt-link">YouTube Link</label>
              <input
                id="yt-link"
                ref={linkRef}
                className="yt-input"
                placeholder="https://www.youtube.com/watch?v=..."
                value={link}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLink(e.target.value)}
                required
              />

              <label className="yt-label" htmlFor="yt-title">Title (optional)</label>
              <input
                id="yt-title"
                className="yt-input"
                placeholder="Video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="yt-form-actions">
                <button type="submit" className="yt-btn yt-btn-primary" aria-label={editingId ? "Save changes" : "Add video"}>
                  {editingId ? <FaCheck /> : <FaPlus />} {editingId ? "Save" : "Add"}
                </button>

                <button type="button" className="yt-btn yt-btn-secondary" onClick={resetForm}>
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT: table */}
        <div className="yt-right">
          <div className="yt-card">
            <div className="yt-card-header">
              <h3 className="yt-title-small">YouTube Videos</h3>
              <div className="yt-sub">Preview and manage uploaded links</div>
            </div>

            <div className="yt-table-wrap" role="region" aria-label="YouTube videos">
              <table className="yt-table">
                <thead>
                  <tr>
                    <th>S. No</th>
                    <th>Preview</th>
                    <th>Title</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((it, idx) => (
                    <tr key={it.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div className="yt-thumb-cell">
                          <img
                            src={it.thumbnail ?? PLACEHOLDER}
                            alt={it.title}
                            className="yt-thumb"
                            onClick={() => openPreview(it.youtubeId)}
                            style={{ cursor: it.youtubeId ? "pointer" : "default" }}
                            title={it.youtubeId ? "Open preview" : "No preview available"}
                          />
                          {it.youtubeId ? (
                            <button className="yt-play-btn" onClick={() => openPreview(it.youtubeId)} aria-label="Play video">
                              <FaPlay />
                            </button>
                          ) : (
                            <div className="yt-no-thumb"><FaYoutube /></div>
                          )}
                        </div>
                      </td>
                      <td className="yt-td-title" title={it.title}>{it.title}</td>
                      <td>
                        <div className="yt-actions">
                          <button className="yt-icon-btn" title="Edit" onClick={() => handleEdit(it.id)}><FaEdit /></button>
                          <button className="yt-icon-btn yt-icon-delete" title="Delete" onClick={() => handleDelete(it.id)}><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="yt-empty">No videos added yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="yt-note">Tip: Click the thumbnail to open a preview.</div>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {previewId && (
        <div className="yt-modal" role="dialog" aria-modal="true" aria-label="Video preview">
          <div className="yt-modal-panel">
            <div className="yt-modal-header">
              <h4>Video Preview</h4>
              <button className="yt-modal-close" onClick={closePreview} aria-label="Close preview"><FaTimes /></button>
            </div>

            <div className="yt-modal-body">
              <div className="yt-iframe-wrap">
                <iframe
                  title="YouTube preview"
                  src={`https://www.youtube.com/embed/${previewId}`}
                  frameBorder={0}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="yt-modal-actions">
              <button className="yt-btn yt-btn-ghost" onClick={closePreview}><FaTimes /> Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeManage;
