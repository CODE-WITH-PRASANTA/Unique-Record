import React, { useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Download,
  Eye,
  X,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Mail,
  User,
} from "lucide-react";

import "./DashboardHistory.css";

const defaultTransactions = [
  { id: "INQ-AA2D", user: "Saroj Kumar", category: "Contact Inquiry", email: "saroj@gmail.com", date: new Date().toISOString(), message: "Interested in world record submission guidelines and event registrations.", status: "approved" },
  { id: "SUB-22DF", user: "Saroj Mallik", category: "Newsletter Subscription", email: "sarojkumar@gmail.com", date: new Date().toISOString(), message: "Subscribed with email: sarojkumar@gmail.com", status: "approved" },
  { id: "CMT-AE32", user: "Cricket Fan", category: "Blog Feedback", email: "fan@gmail.com", date: new Date().toISOString(), message: "Great insights on the record breaking innings by Sanju Samson!", status: "approved" },
  { id: "CMT-AE31", user: "Rahul Sharma", category: "Blog Feedback", email: "rahul@gmail.com", date: new Date().toISOString(), message: "Looking forward to upcoming cricket awards and achievements.", status: "pending" },
];

const statusMeta = {
  approved: { label: "Approved", color: "#16a34a", bg: "#e7f8ee" },
  pending: { label: "Pending Review", color: "#b45309", bg: "#fef3c8" },
  draft: { label: "Draft", color: "#64748b", bg: "#f1f5f9" },
  rejected: { label: "Rejected", color: "#dc2626", bg: "#fde8e8" },
};

const categoryPalette = ["#2f6bff", "#9b3cf5", "#16c79a", "#f97316", "#ec4899"];
function categoryColor(category) {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return categoryPalette[Math.abs(hash) % categoryPalette.length];
}

function initialsOf(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(iso) {
  if (!iso) return "Recently";
  try {
    return dateFormatter.format(new Date(iso));
  } catch {
    return "Recently";
  }
}

function downloadTextFile(filename, content, mime = "text/plain") {
  const blob = new Blob([content], { type: `${mime};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function buildCsv(rows) {
  const header = ["ID", "User / Contact", "Category", "Email", "Date/Time", "Message / Note", "Status"];
  const lines = rows.map((r) => {
    const meta = statusMeta[r.status] || statusMeta.approved;
    return [r.id, r.user, r.category, r.email || "", formatDate(r.date), r.message || "", meta.label]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",");
  });
  return [header.join(","), ...lines].join("\n");
}

const PAGE_SIZE = 5;
const columns = [
  { key: "user", label: "User / Contact" },
  { key: "category", label: "Category" },
  { key: "date", label: "Date/Time" },
  { key: "message", label: "Message / Detail" },
  { key: "status", label: "Status" },
];

const DashboardHistory = ({
  submissions = null,
  title = "Recent Inquiries & Community Submissions",
  onRefresh = null,
}) => {
  const transactions = (submissions && submissions.length > 0) ? submissions : defaultTransactions;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let rows = transactions.filter((t) => {
      const matchesTerm =
        !term ||
        (t.user && t.user.toLowerCase().includes(term)) ||
        (t.category && t.category.toLowerCase().includes(term)) ||
        (t.email && t.email.toLowerCase().includes(term)) ||
        (t.message && t.message.toLowerCase().includes(term)) ||
        (t.id && t.id.toLowerCase().includes(term));
      
      let matchesStatus = true;
      if (statusFilter === "approved") matchesStatus = t.status === "approved";
      else if (statusFilter === "pending") matchesStatus = t.status === "pending";
      else if (statusFilter === "inquiry") matchesStatus = t.category.toLowerCase().includes("inquiry") || t.category.toLowerCase().includes("contact");
      else if (statusFilter === "feedback") matchesStatus = t.category.toLowerCase().includes("feedback") || t.category.toLowerCase().includes("comment");
      else if (statusFilter === "newsletter") matchesStatus = t.category.toLowerCase().includes("newsletter");

      return matchesTerm && matchesStatus;
    });

    rows = [...rows].sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (sortKey === "date") {
        av = new Date(av || 0).getTime();
        bv = new Date(bv || 0).getTime();
      } else {
        av = String(av || "").toLowerCase();
        bv = String(bv || "").toLowerCase();
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return rows;
  }, [transactions, searchTerm, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (typeof onRefresh === "function") {
      onRefresh();
    }
    setTimeout(() => {
      setSearchTerm("");
      setStatusFilter("all");
      setSortKey("date");
      setSortDir("desc");
      setPage(1);
      setIsRefreshing(false);
    }, 650);
  };

  const handleExport = () => {
    downloadTextFile(
      "unique-record-submissions.csv",
      buildCsv(filtered),
      "text/csv"
    );
  };

  const statusFilters = [
    { key: "all", label: "All Items" },
    { key: "inquiry", label: "Inquiries" },
    { key: "feedback", label: "Feedback" },
    { key: "newsletter", label: "Newsletter" },
    { key: "approved", label: "Approved" },
    { key: "pending", label: "Pending" },
  ];

  return (
    <div className="DashboardHistory">
      {/* ============================
          BANNER
      ============================ */}
      <div className="DashboardHistory-banner">
        <div className="DashboardHistory-bannerGlow" aria-hidden="true" />
        <div>
          <h1 className="DashboardHistory-bannerTitle">{title}</h1>
          <p className="DashboardHistory-bannerSubtitle">
            {filtered.length} active record{filtered.length !== 1 ? "s" : ""}{" "}
            found across inquiry, feedback, and subscribers
          </p>
        </div>
      </div>

      {/* ============================
          PANEL
      ============================ */}
      <div className="DashboardHistory-panel">
        {/* Toolbar */}
        <div className="DashboardHistory-toolbar">
          <div className="DashboardHistory-search">
            <Search size={15} className="DashboardHistory-searchIcon" />
            <input
              type="text"
              className="DashboardHistory-searchInput"
              placeholder="Search by contact name, email, topic or message..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="DashboardHistory-filters">
            {statusFilters.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`DashboardHistory-filterChip ${
                  statusFilter === f.key ? "is-active" : ""
                }`}
                onClick={() => {
                  setStatusFilter(f.key);
                  setPage(1);
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="DashboardHistory-actions">
            <button
              type="button"
              className="DashboardHistory-actionBtn"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh"
            >
              <RefreshCw
                size={15}
                className={isRefreshing ? "is-spinning" : ""}
              />
              Refresh
            </button>
            <button
              type="button"
              className="DashboardHistory-actionBtn DashboardHistory-actionBtn--primary"
              onClick={handleExport}
              title="Export CSV"
            >
              <Download size={15} />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="DashboardHistory-tableWrap">
          <table className="DashboardHistory-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="DashboardHistory-th">
                    <button
                      type="button"
                      className="DashboardHistory-thBtn"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                      {sortKey === col.key ? (
                        sortDir === "asc" ? (
                          <ChevronUp size={13} />
                        ) : (
                          <ChevronDown size={13} />
                        )
                      ) : (
                        <ChevronsUpDown
                          size={13}
                          className="DashboardHistory-sortIcon--idle"
                        />
                      )}
                    </button>
                  </th>
                ))}
                <th className="DashboardHistory-th DashboardHistory-th--action" />
              </tr>
            </thead>

            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="DashboardHistory-emptyCell">
                    No submissions found
                  </td>
                </tr>
              ) : (
                pageRows.map((txn) => {
                  const meta = statusMeta[txn.status] || statusMeta.approved;
                  return (
                    <tr key={txn.id} className="DashboardHistory-tr">
                      <td data-label="User / Contact" className="DashboardHistory-td">
                        <div className="DashboardHistory-userCell">
                          <span
                            className="DashboardHistory-avatar"
                            style={{ background: categoryColor(txn.user) }}
                          >
                            {initialsOf(txn.user)}
                          </span>
                          <div>
                            <span className="DashboardHistory-userName">
                              {txn.user}
                            </span>
                            {txn.email && (
                              <div style={{ fontSize: "11px", color: "#64748b" }}>
                                {txn.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td data-label="Category" className="DashboardHistory-td">
                        <span className="DashboardHistory-categoryCell">
                          <span
                            className="DashboardHistory-categoryDot"
                            style={{
                              background: categoryColor(txn.category),
                            }}
                          />
                          {txn.category}
                        </span>
                      </td>

                      <td data-label="Date/Time" className="DashboardHistory-td">
                        {formatDate(txn.date)}
                      </td>

                      <td data-label="Message / Detail" className="DashboardHistory-td">
                        <span className="DashboardHistory-amount" style={{ fontSize: "13px", fontWeight: "500", color: "#475569" }}>
                          {txn.message ? (txn.message.length > 55 ? `${txn.message.slice(0, 55)}...` : txn.message) : "—"}
                        </span>
                      </td>

                      <td data-label="Status" className="DashboardHistory-td">
                        <span
                          className="DashboardHistory-statusPill"
                          style={{ color: meta.color, background: meta.bg }}
                        >
                          {meta.label}
                        </span>
                      </td>

                      <td className="DashboardHistory-td DashboardHistory-td--action">
                        <button
                          type="button"
                          className="DashboardHistory-viewBtn"
                          onClick={() => setSelected(txn)}
                          title="View details"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="DashboardHistory-pagination">
            <span className="DashboardHistory-pageInfo">
              Page {safePage} of {totalPages}
            </span>
            <div className="DashboardHistory-pageBtns">
              <button
                type="button"
                className="DashboardHistory-pageBtn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                className="DashboardHistory-pageBtn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================
          DETAILS MODAL
      ============================ */}
      {selected && (
        <div
          className="DashboardHistory-modalOverlay"
          onClick={() => setSelected(null)}
        >
          <div
            className="DashboardHistory-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="DashboardHistory-modalHeader">
              <h3>Submission & Inquiry Details</h3>
              <button
                type="button"
                className="DashboardHistory-modalClose"
                onClick={() => setSelected(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="DashboardHistory-modalBody">
              <div className="DashboardHistory-modalRow">
                <span>Record ID</span>
                <strong>{selected.id}</strong>
              </div>
              <div className="DashboardHistory-modalRow">
                <span>Name</span>
                <strong>{selected.user}</strong>
              </div>
              {selected.email && (
                <div className="DashboardHistory-modalRow">
                  <span>Email</span>
                  <strong>{selected.email}</strong>
                </div>
              )}
              <div className="DashboardHistory-modalRow">
                <span>Category</span>
                <strong>{selected.category}</strong>
              </div>
              <div className="DashboardHistory-modalRow">
                <span>Submitted On</span>
                <strong>{formatDate(selected.date)}</strong>
              </div>
              <div className="DashboardHistory-modalRow" style={{ flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
                <span>Message Content:</span>
                <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", width: "100%", fontSize: "13px", lineHeight: "1.5", color: "#1e293b", border: "1px solid #e2e8f0" }}>
                  {selected.message || "No additional message provided."}
                </div>
              </div>
              <div className="DashboardHistory-modalRow">
                <span>Status</span>
                <span
                  className="DashboardHistory-statusPill"
                  style={{
                    color: (statusMeta[selected.status] || statusMeta.approved).color,
                    background: (statusMeta[selected.status] || statusMeta.approved).bg,
                  }}
                >
                  {(statusMeta[selected.status] || statusMeta.approved).label}
                </span>
              </div>
            </div>

            <div className="DashboardHistory-modalActions">
              <button
                type="button"
                className="DashboardHistory-actionBtn DashboardHistory-actionBtn--primary"
                onClick={() => setSelected(null)}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHistory;