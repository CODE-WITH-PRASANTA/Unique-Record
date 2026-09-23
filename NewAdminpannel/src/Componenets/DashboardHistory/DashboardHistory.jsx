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
  Receipt,
} from "lucide-react";

import "./DashboardHistory.css";

/* ---------------------------------------------------
   Dummy data — swap via the `transactions` prop once
   your API is wired in. Shape shown below.
--------------------------------------------------- */
const defaultTransactions = [
  { id: "TXN-1042", user: "Rahul Sharma", category: "Water Can Delivery", date: "2026-09-23T10:42:00", amount: 480, status: "paid" },
  { id: "TXN-1041", user: "Priya Nair", category: "Subscription Renewal", date: "2026-09-23T09:15:00", amount: 1200, status: "paid" },
  { id: "TXN-1040", user: "Amit Verma", category: "Bottle Deposit Return", date: "2026-09-22T18:05:00", amount: 150, status: "pending" },
  { id: "TXN-1039", user: "Sneha Patil", category: "Custom Bulk Order", date: "2026-09-22T14:30:00", amount: 3600, status: "paid" },
  { id: "TXN-1038", user: "Vikram Singh", category: "Delivery Charge", date: "2026-09-22T11:20:00", amount: 60, status: "failed" },
  { id: "TXN-1037", user: "Anjali Gupta", category: "Monthly Plan Upgrade", date: "2026-09-21T17:48:00", amount: 2400, status: "paid" },
  { id: "TXN-1036", user: "Rohit Das", category: "Water Can Delivery", date: "2026-09-21T09:02:00", amount: 480, status: "pending" },
  { id: "TXN-1035", user: "Kavya Reddy", category: "Late Fee Payment", date: "2026-09-20T20:11:00", amount: 100, status: "failed" },
  { id: "TXN-1034", user: "Manish Kumar", category: "Subscription Renewal", date: "2026-09-20T12:55:00", amount: 1200, status: "paid" },
  { id: "TXN-1033", user: "Divya Iyer", category: "Custom Bulk Order", date: "2026-09-19T16:40:00", amount: 5400, status: "paid" },
  { id: "TXN-1032", user: "Suresh Rao", category: "Bottle Deposit Return", date: "2026-09-19T08:25:00", amount: 150, status: "paid" },
  { id: "TXN-1031", user: "Neha Joshi", category: "Water Can Delivery", date: "2026-09-18T19:10:00", amount: 480, status: "pending" },
  { id: "TXN-1030", user: "Arjun Mehta", category: "Delivery Charge", date: "2026-09-18T10:00:00", amount: 60, status: "paid" },
];

const statusMeta = {
  paid: { label: "Paid", color: "#16a34a", bg: "#e7f8ee" },
  pending: { label: "Pending", color: "#b45309", bg: "#fef3c8" },
  failed: { label: "Failed", color: "#dc2626", bg: "#fde8e8" },
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
  return name
    .split(" ")
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
  return dateFormatter.format(new Date(iso));
}

function formatAmount(value) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
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
  const header = ["Transaction ID", "User Name", "Category", "Date/Time", "Amount", "Status"];
  const lines = rows.map((r) =>
    [r.id, r.user, r.category, formatDate(r.date), r.amount, statusMeta[r.status].label]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header.join(","), ...lines].join("\n");
}

const PAGE_SIZE = 5;
const columns = [
  { key: "user", label: "User Name" },
  { key: "category", label: "Category" },
  { key: "date", label: "Date/Time" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];

const DashboardHistory = ({
  transactions = defaultTransactions,
  title = "Transaction History",
}) => {
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
        t.user.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term) ||
        t.id.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesTerm && matchesStatus;
    });

    rows = [...rows].sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (sortKey === "date") {
        av = new Date(av).getTime();
        bv = new Date(bv).getTime();
      } else if (sortKey === "amount") {
        // numeric already
      } else {
        av = String(av).toLowerCase();
        bv = String(bv).toLowerCase();
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
      "transaction-history.csv",
      buildCsv(filtered),
      "text/csv"
    );
  };

  const handleDownloadReceipt = (txn) => {
    const receipt = [
      "ALKA DROPS — PAYMENT RECEIPT",
      "-----------------------------",
      `Transaction ID : ${txn.id}`,
      `User           : ${txn.user}`,
      `Category       : ${txn.category}`,
      `Date/Time      : ${formatDate(txn.date)}`,
      `Amount         : ${formatAmount(txn.amount)}`,
      `Status         : ${statusMeta[txn.status].label}`,
      "-----------------------------",
      "Thank you for your business.",
    ].join("\n");
    downloadTextFile(`${txn.id}-receipt.txt`, receipt);
  };

  const statusFilters = [
    { key: "all", label: "All" },
    { key: "paid", label: "Paid" },
    { key: "pending", label: "Pending" },
    { key: "failed", label: "Failed" },
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
            {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}{" "}
            found
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
              placeholder="Search by user, category or ID..."
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
                    No recent transactions found
                  </td>
                </tr>
              ) : (
                pageRows.map((txn) => {
                  const meta = statusMeta[txn.status];
                  return (
                    <tr key={txn.id} className="DashboardHistory-tr">
                      <td data-label="User Name" className="DashboardHistory-td">
                        <div className="DashboardHistory-userCell">
                          <span
                            className="DashboardHistory-avatar"
                            style={{ background: categoryColor(txn.user) }}
                          >
                            {initialsOf(txn.user)}
                          </span>
                          <span className="DashboardHistory-userName">
                            {txn.user}
                          </span>
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

                      <td data-label="Amount" className="DashboardHistory-td">
                        <span className="DashboardHistory-amount">
                          {formatAmount(txn.amount)}
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
              <h3>Transaction Details</h3>
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
                <span>Transaction ID</span>
                <strong>{selected.id}</strong>
              </div>
              <div className="DashboardHistory-modalRow">
                <span>User</span>
                <strong>{selected.user}</strong>
              </div>
              <div className="DashboardHistory-modalRow">
                <span>Category</span>
                <strong>{selected.category}</strong>
              </div>
              <div className="DashboardHistory-modalRow">
                <span>Date/Time</span>
                <strong>{formatDate(selected.date)}</strong>
              </div>
              <div className="DashboardHistory-modalRow">
                <span>Amount</span>
                <strong>{formatAmount(selected.amount)}</strong>
              </div>
              <div className="DashboardHistory-modalRow">
                <span>Status</span>
                <span
                  className="DashboardHistory-statusPill"
                  style={{
                    color: statusMeta[selected.status].color,
                    background: statusMeta[selected.status].bg,
                  }}
                >
                  {statusMeta[selected.status].label}
                </span>
              </div>
            </div>

            <div className="DashboardHistory-modalActions">
              <button
                type="button"
                className="DashboardHistory-actionBtn DashboardHistory-actionBtn--primary"
                onClick={() => handleDownloadReceipt(selected)}
              >
                <Receipt size={15} />
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHistory;