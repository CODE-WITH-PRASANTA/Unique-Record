import React, { useEffect, useRef, useState } from "react";
import {
  FaEllipsisV,
  FaTrashAlt,
  FaEdit,
  FaRegCheckCircle,
  FaRegTimesCircle,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaTh,
  FaList,
} from "react-icons/fa";
import "./TeamMembersPreview.css";

type TeamMember = {
  id: number;
  profile: string;
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
    id: 2,
    profile:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=60",
    name: "Vikram Singh",
    designation: "Senior Frontend Engineer",
    phone: "+91 91234 56789",
    email: "vikram.singh@example.com",
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
    linkedin: "https://linkedin.com/in/johndoe",
    published: true,
    bio: "Automates deployments and ensures reliability across cloud environments.",
    joinedAt: "2019-06-20",
  },
];

const TeamMembersPreview: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(demoMembers);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // dropdown refs
  const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const setMenuRef = (id: number) => (el: HTMLDivElement | null) => {
    menuRefs.current[id] = el;
  };

  // close on outside click
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

  const toggleMenu = (id: number) =>
    setOpenMenuId((p) => (p === id ? null : id));

  const handleDelete = (id: number) => {
    if (!confirm("Delete this team member preview?")) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setOpenMenuId(null);
  };

  const handleTogglePublish = (id: number) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, published: !m.published } : m
      )
    );
    setOpenMenuId(null);
  };

  const handleEdit = (id: number) => {
    const mem = members.find((m) => m.id === id);
    alert(`Edit: ${mem?.name}`);
    setOpenMenuId(null);
  };

  return (
    <div className="teammembers-page">

      {/* Header */}
      <div className="teammembers-header">
        <div className="teammembers-header-left">
          <h2>Team Members Preview</h2>
          <p className="teammembers-sub">Demo data (independent preview)</p>
        </div>

        <div className="tm-view-toggle">
          <button
            className={`tm-view-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <FaTh /> Grid
          </button>
          <button
            className={`tm-view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <FaList /> List
          </button>
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === "grid" && (
        <div className="teammembers-grid">
          {members.map((m) => (
            <article className="teammembers-card" key={m.id}>
              <div className="teammembers-top">
                <div className="teammembers-left">
                  <img className="teammembers-photo" src={m.profile} alt={m.name} />
                  <div className="teammembers-meta">
                    <div className="teammembers-name">{m.name}</div>
                    <div className="teammembers-design">{m.designation}</div>
                    <div className="teammembers-joined">Joined: {m.joinedAt}</div>
                  </div>
                </div>

                {/* Menu */}
                <div className="teammembers-menu" ref={setMenuRef(m.id)}>
                  <button className="teammembers-3dots" onClick={() => toggleMenu(m.id)}>
                    <FaEllipsisV />
                  </button>

                  {openMenuId === m.id && (
                    <div className="teammembers-dropdown">
                      <button
                        className="teammembers-dropdown-item"
                        onClick={() => handleTogglePublish(m.id)}
                      >
                        {m.published ? <FaRegTimesCircle /> : <FaRegCheckCircle />}
                        {m.published ? "Unpublish" : "Publish"}
                      </button>

                      <button
                        className="teammembers-dropdown-item"
                        onClick={() => handleEdit(m.id)}
                      >
                        <FaEdit /> Edit
                      </button>

                      <button
                        className="teammembers-dropdown-item danger"
                        onClick={() => handleDelete(m.id)}
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="teammembers-status">
                <span className={`teammembers-dot ${m.published ? "published" : "draft"}`} />
                {m.published ? "Published" : "Draft"}
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
                    {m.instagram && <a href={m.instagram}><FaInstagram /></a>}
                    {m.facebook && <a href={m.facebook}><FaFacebookF /></a>}
                    {m.twitter && <a href={m.twitter}><FaTwitter /></a>}
                    {m.linkedin && <a href={m.linkedin}><FaLinkedinIn /></a>}
                  </div>
                </div>
              </div>

              <div className="teammembers-bottom">
                <p className="teammembers-bio">{m.bio}</p>
                <div className="teammembers-actions-compact">
                  <button className="btn ghost" onClick={() => handleEdit(m.id)}>
                    <FaEdit /> Edit
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="teammembers-table-wrapper">
          <div className="teammembers-table-card">
            <table className="teammembers-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Member</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => (
                  <tr key={m.id}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="tm-table-profile">
                        <img src={m.profile} alt={m.name} />
                        <div>
                          <div className="tm-table-name">{m.name}</div>
                          <div className="tm-table-designation">{m.designation}</div>
                        </div>
                      </div>
                    </td>
                    <td>{m.phone}</td>
                    <td>{m.email}</td>
                    <td>
                      <span className={`tm-status-pill ${m.published ? "published" : "draft"}`}>
                        {m.published ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td>
                      <div className="teammembers-menu" ref={setMenuRef(m.id)}>
                        <button className="teammembers-3dots" onClick={() => toggleMenu(m.id)}>
                          <FaEllipsisV />
                        </button>

                        {openMenuId === m.id && (
                          <div className="teammembers-dropdown">
                            <button
                              className="teammembers-dropdown-item"
                              onClick={() => handleTogglePublish(m.id)}
                            >
                              {m.published ? <FaRegTimesCircle /> : <FaRegCheckCircle />}
                              {m.published ? "Unpublish" : "Publish"}
                            </button>

                            <button
                              className="teammembers-dropdown-item"
                              onClick={() => handleEdit(m.id)}
                            >
                              <FaEdit /> Edit
                            </button>

                            <button
                              className="teammembers-dropdown-item danger"
                              onClick={() => handleDelete(m.id)}
                            >
                              <FaTrashAlt /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeamMembersPreview;
