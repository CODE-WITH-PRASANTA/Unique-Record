import React, { useEffect, useRef, useState } from "react";
import {
  FaEllipsisV,
  FaTrashAlt,
  FaEdit,
  FaRegEye,
  FaRegCheckCircle,
  FaRegTimesCircle,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import "./TeamMembersPreview.css";

type TeamMember = {
  id: number;
  profile: string; // url
  name: string;
  designation: string;
  phone: string;
  email: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  published?: boolean;
  bio?: string;
  joinedAt?: string;
};

const demoMembers: TeamMember[] = [
  {
    id: 1,
    profile:
      "https://images.unsplash.com/photo-1545996124-1b8b1c8f1b2f?auto=format&fit=crop&w=800&q=60",
    name: "Asha Reddy",
    designation: "Lead Data Scientist",
    phone: "+91 98765 43210",
    email: "asha.reddy@example.com",
    instagram: "https://instagram.com/ashareddy",
    facebook: "https://facebook.com/ashareddy",
    twitter: "https://twitter.com/ashareddy",
    linkedin: "https://linkedin.com/in/ashareddy",
    published: true,
    bio: "Leads ML initiatives and mentors junior data scientists. Passionate about applied research and production ML.",
    joinedAt: "2022-09-01",
  },
  {
    id: 2,
    profile:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=60",
    name: "Vikram Singh",
    designation: "Senior Frontend Engineer",
    phone: "+91 91234 56789",
    email: "vikram.singh@example.com",
    instagram: "",
    facebook: "",
    twitter: "https://twitter.com/vikramdev",
    linkedin: "https://linkedin.com/in/vikramsingh",
    published: false,
    bio: "Focuses on accessible, performant React components and design systems.",
    joinedAt: "2021-03-12",
  },
  {
    id: 3,
    profile:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=60",
    name: "Priya Menon",
    designation: "Product Designer",
    phone: "+91 99887 66554",
    email: "priya.menon@example.com",
    instagram: "https://instagram.com/priyamenon",
    facebook: "",
    twitter: "",
    linkedin: "https://linkedin.com/in/priyamenon",
    published: true,
    bio: "Creates delightful UX and design systems — focusing on motion and accessibility.",
    joinedAt: "2020-11-08",
  },
  {
    id: 4,
    profile:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=800&q=60",
    name: "John Doe",
    designation: "DevOps Engineer",
    phone: "+44 7700 900123",
    email: "john.doe@example.com",
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "https://linkedin.com/in/johndoe",
    published: true,
    bio: "Automates deployments and ensures reliability across cloud environments.",
    joinedAt: "2019-06-20",
  },
];

const TeamMembersPreview: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(demoMembers);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [previewMember, setPreviewMember] = useState<TeamMember | null>(null);

  // map of refs to dropdown wrappers
  const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // callback ref setter
  const setMenuRef = (id: number) => (el: HTMLDivElement | null) => {
    menuRefs.current[id] = el;
  };

  // Close menu when clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (openMenuId === null) return;
      const wrapper = menuRefs.current[openMenuId];
      if (!wrapper || !wrapper.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openMenuId]);

  const toggleMenu = (id: number) => setOpenMenuId((p) => (p === id ? null : id));

  const handleDelete = (id: number) => {
    if (!confirm("Delete this team member preview?")) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setOpenMenuId(null);
  };

  const handleTogglePublish = (id: number) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, published: !m.published } : m)));
    setOpenMenuId(null);
  };

  const handleEdit = (id: number) => {
    // preview-only page: show a simple edit alert
    const mem = members.find((m) => m.id === id);
    alert(`Edit (preview-only)\nName: ${mem?.name}`);
    setOpenMenuId(null);
  };

  const handlePreview = (id: number) => {
    const mem = members.find((m) => m.id === id) || null;
    setPreviewMember(mem);
    setOpenMenuId(null);
  };

  const closePreview = () => setPreviewMember(null);

  return (
    <div className="teammembers-page">
      <div className="teammembers-header">
        <h2>Team Members Preview</h2>
        <p className="teammembers-sub">Demo data (independent from ManageTeamMember)</p>
      </div>

      <div className="teammembers-grid">
        {members.map((m) => (
          <article className="teammembers-card" key={m.id} aria-labelledby={`tm-name-${m.id}`}>
            <div className="teammembers-top">
              <div className="teammembers-left">
                <img className="teammembers-photo" src={m.profile} alt={m.name} />
                <div className="teammembers-meta">
                  <div id={`tm-name-${m.id}`} className="teammembers-name">{m.name}</div>
                  <div className="teammembers-design">{m.designation}</div>
                  <div className="teammembers-joined">Joined: {m.joinedAt ?? "—"}</div>
                </div>
              </div>

              <div className="teammembers-menu" ref={setMenuRef(m.id)}>
                <button className="teammembers-3dots" onClick={() => toggleMenu(m.id)} aria-expanded={openMenuId === m.id}>
                  <FaEllipsisV />
                </button>

                {openMenuId === m.id && (
                  <div className="teammembers-dropdown" role="menu" aria-label="Card actions">
                    <button className="teammembers-dropdown-item" onClick={() => handleTogglePublish(m.id)}>
                      {m.published ? <FaRegTimesCircle /> : <FaRegCheckCircle />} <span>{m.published ? "Unpublish" : "Publish"}</span>
                    </button>

                    <button className="teammembers-dropdown-item" onClick={() => handlePreview(m.id)}>
                      <FaRegEye /> <span>Preview</span>
                    </button>

                    <button className="teammembers-dropdown-item" onClick={() => handleEdit(m.id)}>
                      <FaEdit /> <span>Edit</span>
                    </button>

                    <button className="teammembers-dropdown-item danger" onClick={() => handleDelete(m.id)}>
                      <FaTrashAlt /> <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="teammembers-status">
              <span className={`teammembers-dot ${m.published ? "published" : "draft"}`} />
              <span className="teammembers-status-text">{m.published ? "Published" : "Draft"}</span>
            </div>

            <div className="teammembers-tiles">
              <div className="teammembers-tile">
                <div className="tm-label">Phone</div>
                <div className="tm-value"><FaPhoneAlt /> {m.phone}</div>
              </div>

              <div className="teammembers-tile">
                <div className="tm-label">Email</div>
                <div className="tm-value"><FaEnvelope /> {m.email}</div>
              </div>

              <div className="teammembers-tile">
                <div className="tm-label">Department</div>
                <div className="tm-value">{m.designation}</div>
              </div>

              <div className="teammembers-tile">
                <div className="tm-label">Social</div>
                <div className="tm-value social-icons">
                  {m.instagram ? <a href={m.instagram} target="_blank" rel="noreferrer"><FaInstagram /></a> : null}
                  {m.facebook ? <a href={m.facebook} target="_blank" rel="noreferrer"><FaFacebookF /></a> : null}
                  {m.twitter ? <a href={m.twitter} target="_blank" rel="noreferrer"><FaTwitter /></a> : null}
                  {m.linkedin ? <a href={m.linkedin} target="_blank" rel="noreferrer"><FaLinkedinIn /></a> : null}
                </div>
              </div>
            </div>

            <div className="teammembers-bottom">
              <p className="teammembers-bio">{m.bio}</p>
              <div className="teammembers-actions-compact">
                <button className="btn" onClick={() => handlePreview(m.id)}><FaRegEye /> Preview</button>
                <button className="btn ghost" onClick={() => handleEdit(m.id)}><FaEdit /> Edit</button>
              </div>
            </div>
          </article>
        ))}

        {members.length === 0 && <div className="teammembers-empty">No team members to preview.</div>}
      </div>

      {/* Preview Modal */}
      {previewMember && (
        <div className="tm-modal-backdrop" role="dialog" aria-modal="true" aria-label="Member preview">
          <div className="tm-modal">
            <button className="tm-modal-close" onClick={closePreview}>✕</button>
            <div className="tm-modal-top">
              <img src={previewMember.profile} alt={previewMember.name} />
              <div>
                <h3>{previewMember.name}</h3>
                <p className="muted">{previewMember.designation}</p>
                <p className="muted">Joined: {previewMember.joinedAt ?? "—"}</p>
              </div>
            </div>

            <div className="tm-modal-body">
              <h4>Contact</h4>
              <p><FaPhoneAlt /> {previewMember.phone}</p>
              <p><FaEnvelope /> {previewMember.email}</p>

              <h4>Social</h4>
              <p className="social-row">
                {previewMember.instagram && <a href={previewMember.instagram} target="_blank" rel="noreferrer"><FaInstagram /> Instagram</a>}
                {previewMember.facebook && <a href={previewMember.facebook} target="_blank" rel="noreferrer"><FaFacebookF /> Facebook</a>}
                {previewMember.twitter && <a href={previewMember.twitter} target="_blank" rel="noreferrer"><FaTwitter /> Twitter</a>}
                {previewMember.linkedin && <a href={previewMember.linkedin} target="_blank" rel="noreferrer"><FaLinkedinIn /> LinkedIn</a>}
              </p>

              <h4>Bio</h4>
              <p>{previewMember.bio}</p>
            </div>

            <div className="tm-modal-actions">
              <button className="btn" onClick={() => { alert("Edit (preview-only)"); }}>Edit</button>
              <button className="btn ghost" onClick={closePreview}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembersPreview;
