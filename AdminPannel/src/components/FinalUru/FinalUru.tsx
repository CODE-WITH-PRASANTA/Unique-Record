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
  ChevronDown,
} from "lucide-react";

import "./FinalUru.css";

type Application = {
  id: number;
  sl: number;
  csNo: string;
  applicationNo: string;
  applicantDate: string; // ISO
  name: string;
  updatedPrice: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  applicationType?: string;
  notes?: string;
};

const demoApplications: Application[] = [
  { id: 1, sl: 1, csNo: "CS-1001", applicationNo: "APP-2025-001", applicantDate: "2025-11-04", name: "Amit Kumar", updatedPrice: "₹4,999", paymentStatus: "Pending", applicationType: "Tourist Visa", notes: "Urgent: 24h" },
  { id: 2, sl: 2, csNo: "CS-1002", applicationNo: "APP-2025-002", applicantDate: "2025-10-30", name: "Sana Iqbal", updatedPrice: "₹5,999", paymentStatus: "Paid", applicationType: "Business Visa", notes: "UPI verified" },
  { id: 3, sl: 3, csNo: "CS-1003", applicationNo: "APP-2025-003", applicantDate: "2025-10-28", name: "John Doe", updatedPrice: "₹3,999", paymentStatus: "Failed", applicationType: "Student Visa", notes: "Card declined" },
  { id: 4, sl: 4, csNo: "CS-1004", applicationNo: "APP-2025-004", applicantDate: "2025-11-01", name: "Priya Sharma", updatedPrice: "₹4,599", paymentStatus: "Pending", applicationType: "Tourist Visa", notes: "Awaiting docs" },
  { id: 5, sl: 5, csNo: "CS-1005", applicationNo: "APP-2025-005", applicantDate: "2025-10-25", name: "Rahul Verma", updatedPrice: "₹7,499", paymentStatus: "Paid", applicationType: "Work Permit", notes: "VIP" },
];

const FinalUru: React.FC = () => {
  const [apps, setApps] = useState<Application[]>(demoApplications);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid" | "failed">("all");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // refs for outside-click detection
  const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const setMenuRef = (id: number) => (el: HTMLDivElement | null) => { menuRefs.current[id] = el; };

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (openMenuId === null) return;
      const wrapper = menuRefs.current[openMenuId];
      if (!wrapper || !wrapper.contains(e.target as Node)) setOpenMenuId(null);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenMenuId(null); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenuId]);

  const toggleMenu = (id: number) => setOpenMenuId(p => (p === id ? null : id));

  const handleDelete = (id: number) => {
    if (!confirm("Delete this application?")) return;
    setApps(prev => prev.filter(a => a.id !== id));
    setOpenMenuId(null);
  };

  const handleReject = (id: number) => {
    if (!confirm("Reject this application?")) return;
    setApps(prev => prev.map(a => a.id === id ? { ...a, paymentStatus: "Failed" } : a));
    setOpenMenuId(null);
  };

  const handleApprove = (id: number) => {
    if (!confirm("Mark as Paid & Approve?")) return;
    setApps(prev => prev.map(a => a.id === id ? { ...a, paymentStatus: "Paid" } : a));
    setOpenMenuId(null);
    alert("Approved (demo)");
  };

  const filtered = apps.filter(a => {
    if (statusFilter !== "all" && a.paymentStatus.toLowerCase() !== statusFilter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return [a.name, a.applicationNo, a.csNo, a.applicationType].join(" ").toLowerCase().includes(q);
  });

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString(); } catch { return iso; }
  };

  return (
    <div className="finaluru-page">
      <header className="finaluru-header">
        <div className="finaluru-titleWrap">
          <h1 className="finaluru-title">Final URU — Applications</h1>
          <p className="finaluru-sub">Compact card view for quick approval, publish & review.</p>
        </div>

        <div className="finaluru-controls">
          <div className="finaluru-search" role="search" aria-label="Search applications">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name / app no / cs no"
              aria-label="Search applications"
            />
          </div>

          <div className="finaluru-filter" aria-hidden>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} aria-label="Filter by payment status">
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>
      </header>

      <main className="finaluru-grid" aria-live="polite">
        {filtered.map((a, idx) => (
          <article
            key={a.id}
            className="finaluru-card"
            style={{ animationDelay: `${idx * 60}ms` }}
            aria-labelledby={`finaluru-card-${a.id}`}
            tabIndex={0}
          >
            <div className="finaluru-top">
              <div className="finaluru-sl">{a.sl}</div>

              <div className="finaluru-head">
                <div id={`finaluru-card-${a.id}`} className="finaluru-name" title={a.name}>{a.name}</div>
                <div className="finaluru-meta">
                  <span className="finaluru-meta-item"><Calendar size={12} /> {formatDate(a.applicantDate)}</span>
                  <span className="finaluru-meta-item"><DollarSign size={12} /> {a.updatedPrice}</span>
                </div>
              </div>

              <div className="finaluru-menu" ref={setMenuRef(a.id)}>
                <button className="finaluru-3dot" onClick={() => toggleMenu(a.id)} aria-expanded={openMenuId === a.id} aria-controls={`finaluru-dropdown-${a.id}`} aria-label="Actions">
                  <MoreVertical size={18} />
                </button>

                {openMenuId === a.id && (
                  <div id={`finaluru-dropdown-${a.id}`} className="finaluru-dropdown" role="menu">
                    <button className="finaluru-dropdown-item" onClick={() => handleApprove(a.id)}><CheckCircle size={14} /> Mark Paid & Approve</button>
                    <button className="finaluru-dropdown-item" onClick={() => handleReject(a.id)}><XCircle size={14} /> Reject</button>
                    <button className="finaluru-dropdown-item" onClick={() => alert(`Edit ${a.applicationNo}`)}><Edit size={14} /> Edit</button>
                    <button className="finaluru-dropdown-item danger" onClick={() => handleDelete(a.id)}><Trash2 size={14} /> Delete</button>
                  </div>
                )}
              </div>
            </div>

            <div className="finaluru-tiles">
              <div className="finaluru-tile">
                <div className="finaluru-label">App. No.</div>
                <div className="finaluru-value">{a.applicationNo}</div>
              </div>
              <div className="finaluru-tile">
                <div className="finaluru-label">Type</div>
                <div className="finaluru-value">{a.applicationType || "—"}</div>
              </div>
              <div className="finaluru-tile">
                <div className="finaluru-label">Payment</div>
                <div className={`finaluru-badge ${a.paymentStatus.toLowerCase()}`}>{a.paymentStatus}</div>
              </div>
              <div className="finaluru-tile full">
                <div className="finaluru-label">Notes</div>
                <div className="finaluru-value">{a.notes || "—"}</div>
              </div>
            </div>

            <div className="finaluru-actions">
              <button className="finaluru-btn" onClick={() => handleApprove(a.id)}><CheckCircle size={14} /> Approve</button>
              <button className="finaluru-btn danger" onClick={() => handleDelete(a.id)}><Trash2 size={14} /> Delete</button>
            </div>
          </article>
        ))}

        {filtered.length === 0 && <div className="finaluru-empty">No applications found.</div>}
      </main>
    </div>
  );
};

export default FinalUru;
