// Approveuru.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  Edit,
  Trash2,
  XCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";
import "./Approveuru.css";

type Application = {
  id: number;
  csNo: string;
  applicationNo: string;
  applicantDate: string;
  name: string;
  updatedPrice: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  applicationType?: string;
  notes?: string;
};

const demoApplications: Application[] = [
  { id: 1, csNo: "CS-1001", applicationNo: "APP-2025-001", applicantDate: "2025-11-04", name: "Amit Kumar", updatedPrice: "₹4,999", paymentStatus: "Pending", applicationType: "Tourist Visa", notes: "Urgent request." },
  { id: 2, csNo: "CS-1002", applicationNo: "APP-2025-002", applicantDate: "2025-10-30", name: "Sana Iqbal", updatedPrice: "₹5,999", paymentStatus: "Paid", applicationType: "Business Visa", notes: "Payment verified." },
  { id: 3, csNo: "CS-1003", applicationNo: "APP-2025-003", applicantDate: "2025-10-28", name: "John Doe", updatedPrice: "₹3,999", paymentStatus: "Failed", applicationType: "Student Visa", notes: "Card declined." },
  { id: 4, csNo: "CS-1004", applicationNo: "APP-2025-004", applicantDate: "2025-11-01", name: "Priya Sharma", updatedPrice: "₹4,599", paymentStatus: "Pending", applicationType: "Tourist Visa", notes: "Awaiting approval." },
  { id: 5, csNo: "CS-1005", applicationNo: "APP-2025-005", applicantDate: "2025-10-25", name: "Rahul Verma", updatedPrice: "₹7,499", paymentStatus: "Paid", applicationType: "Work Permit", notes: "VIP client." },
];

const Approveuru: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>(demoApplications);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid" | "failed">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // typed refs map for dropdown wrappers
  const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // helper to create callback ref for a given id
  const setMenuRef = (id: number) => (el: HTMLDivElement | null) => {
    menuRefs.current[id] = el;
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (openMenuId === null) return;
      const wrapper = menuRefs.current[openMenuId];
      if (!wrapper || !wrapper.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenuId(null);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openMenuId]);

  const toggleMenu = (id: number) => setOpenMenuId((p) => (p === id ? null : id));

  const deleteApp = (id: number) => {
    if (!confirm("Delete this application?")) return;
    setApplications((prev) => prev.filter((a) => a.id !== id));
    setOpenMenuId(null);
  };

  const rejectApp = (id: number) => {
    if (!confirm("Reject this application?")) return;
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, paymentStatus: "Failed" } : a)));
    setOpenMenuId(null);
  };

  const approveApp = (id: number) => {
    if (!confirm("Mark as paid & approve?")) return;
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, paymentStatus: "Paid" } : a)));
    setOpenMenuId(null);
    alert("Approved (demo only).");
  };

  const editApp = (id: number) => {
    const app = applications.find((a) => a.id === id);
    alert(`Edit (demo): ${app?.name}`);
    setOpenMenuId(null);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  // filtering & searching
  let filtered = applications.filter((a) => {
    if (statusFilter !== "all" && a.paymentStatus.toLowerCase() !== statusFilter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.applicationNo.toLowerCase().includes(q) ||
      a.csNo.toLowerCase().includes(q) ||
      (a.applicationType || "").toLowerCase().includes(q)
    );
  });

  // sorting
  filtered = filtered.sort((x, y) => {
    if (sortBy === "name") return x.name.localeCompare(y.name);
    const dx = new Date(x.applicantDate).getTime();
    const dy = new Date(y.applicantDate).getTime();
    return sortBy === "newest" ? dy - dx : dx - dy;
  });

  return (
    <div className="approveuru-page">
      <div className="approveuru-topbar">
        <h2 className="approveuru-title">Applications Approval</h2>

        <div className="approveuru-searchbar" role="search">
          <Search size={16} aria-hidden />
          <input
            placeholder="Search applications..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search applications"
          />
        </div>

        <div className="approveuru-filters">
          <div className="approveuru-select">
            <Filter size={14} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} aria-label="Filter status">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
            <ChevronDown size={12} />
          </div>

          <div className="approveuru-select small">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} aria-label="Sort by">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name">Name</option>
            </select>
            <ChevronDown size={12} />
          </div>
        </div>
      </div>

      <div className="approveuru-grid">
        {filtered.map((app) => (
          <article key={app.id} className="approveuru-card" aria-labelledby={`card-${app.id}-title`}>
            <div className="approveuru-card-head">
              <div className="approveuru-cs" aria-hidden>{app.csNo}</div>

              <div className="approveuru-info">
                <h3 id={`card-${app.id}-title`} className="approveuru-name">{app.name}</h3>

                <div className="approveuru-meta">
                  <span><Calendar size={14} aria-hidden /> {formatDate(app.applicantDate)}</span>
                  <span><DollarSign size={14} aria-hidden /> {app.updatedPrice}</span>
                </div>

                <span className={`approveuru-status ${app.paymentStatus.toLowerCase()}`}>
                  {app.paymentStatus}
                </span>
              </div>

              <div className="approveuru-menuWrap" ref={setMenuRef(app.id)}>
                <button
                  className="approveuru-iconBtn"
                  onClick={() => toggleMenu(app.id)}
                  aria-haspopup="true"
                  aria-expanded={openMenuId === app.id}
                  aria-controls={`menu-${app.id}`}
                >
                  <MoreVertical size={18} />
                </button>

                {openMenuId === app.id && (
                  <div id={`menu-${app.id}`} className="approveuru-menu" role="menu">
                    <button onClick={() => editApp(app.id)} role="menuitem"><Edit size={14} /> Edit</button>
                    <button onClick={() => deleteApp(app.id)} className="danger" role="menuitem"><Trash2 size={14} /> Delete</button>
                    <button onClick={() => rejectApp(app.id)} role="menuitem"><XCircle size={14} /> Reject</button>
                    <button onClick={() => approveApp(app.id)} className="approve" role="menuitem"><CheckCircle size={14} /> Approve</button>
                  </div>
                )}
              </div>
            </div>

            <div className="approveuru-tiles">
              <div className="approveuru-tile">
                <label>Application No</label>
                <div>{app.applicationNo}</div>
              </div>

              <div className="approveuru-tile">
                <label>Type</label>
                <div>{app.applicationType ?? "—"}</div>
              </div>

              <div className="approveuru-tile full">
                <label>Notes</label>
                <div>{app.notes ?? "—"}</div>
              </div>
            </div>

            <div className="approveuru-actions">
              <button onClick={() => editApp(app.id)} className="edit" aria-label={`Edit ${app.name}`}><Edit size={14} /> Edit</button>
              <button onClick={() => deleteApp(app.id)} className="delete" aria-label={`Delete ${app.name}`}><Trash2 size={14} /> Delete</button>
              <button onClick={() => approveApp(app.id)} className="approve" aria-label={`Approve ${app.name}`}><CheckCircle size={14} /> Approve</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Approveuru;
