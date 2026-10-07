import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Api";
import "./ApplicationStatus.css";

/* ---------------- DATA ---------------- */
const SUPPORT_EMAIL = "uruonline2025@gmail.com";

/* ---------------- HELPERS ---------------- */
const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const todayLabel = () =>
  new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const buildReceiptHtml = (app) => `<!doctype html>
<html><head><meta charset="utf-8"><title>Receipt ${esc(app.id)}</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;padding:40px 16px;font-family:Inter,Segoe UI,Arial,sans-serif;background:#f4f6fb;color:#0f172a}
  .r{max-width:520px;margin:auto;background:#fff;border-radius:20px;padding:34px;box-shadow:0 24px 60px -20px rgba(15,23,42,.3);border-top:6px solid #7c3aed}
  .b{display:inline-block;padding:5px 12px;border-radius:99px;background:#e3f6ea;color:#16a34a;font-size:12px;font-weight:700}
  h1{margin:14px 0 4px;font-size:24px}
  p{margin:0;color:#64748b;font-size:14px}
  table{width:100%;margin:24px 0;border-collapse:collapse}
  td{padding:12px 0;border-bottom:1px dashed #cbd5e1;font-size:14px}
  td:first-child{color:#64748b}
  td:last-child{text-align:right;font-weight:700}
  .t td{border:0;font-size:18px;color:#16a34a}
  .n{font-size:12px;text-align:center;margin-top:8px}
  @media print{body{background:#fff;padding:0}.r{box-shadow:none}}
</style></head><body>
<div class="r">
  <span class="b">PAID</span>
  <h1>Payment Receipt</h1>
  <p>Thank you. Your payment is received and verified by Unique Records of Universe.</p>
  <table>
    <tr><td>Application No.</td><td>${esc(app.id)}</td></tr>
    <tr><td>Applicant</td><td>${esc(app.name)}</td></tr>
    <tr><td>Position</td><td>${esc(app.position)}</td></tr>
    <tr><td>Application Date</td><td>${esc(app.date)}</td></tr>
    <tr><td>Transaction ID</td><td>${esc(app.txnId || "-")}</td></tr>
    <tr><td>Payment Method</td><td>${esc(app.method || "Online")}</td></tr>
    <tr><td>Paid On</td><td>${esc(app.paidAt || todayLabel())}</td></tr>
    <tr class="t"><td>Amount Paid</td><td>&#8377;${Number(app.price || 499).toFixed(2)}</td></tr>
  </table>
  <p class="n">This is an official computer-generated receipt from Unique Records of Universe.</p>
</div></body></html>`;

/* ---------------- ICONS ---------------- */
const Icon = ({ children, size = 20, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
);

const CheckIcon = (p) => (
  <Icon {...p}>
    <polyline points="20 6 9 17 4 12" />
  </Icon>
);
const CardIcon = (p) => (
  <Icon {...p}>
    <rect x="2" y="5" width="20" height="14" rx="3" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </Icon>
);
const CopyIcon = (p) => (
  <Icon {...p}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </Icon>
);
const DownloadIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3v12" />
    <polyline points="7 11 12 16 17 11" />
    <path d="M4 21h16" />
  </Icon>
);
const PrintIcon = (p) => (
  <Icon {...p}>
    <path d="M6 9V3h12v6" />
    <rect x="3" y="9" width="18" height="9" rx="2" />
    <rect x="7" y="14" width="10" height="7" rx="1" />
  </Icon>
);
const SupportIcon = (p) => (
  <Icon {...p}>
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <rect x="2" y="14" width="4" height="6" rx="1.5" />
    <rect x="18" y="14" width="4" height="6" rx="1.5" />
  </Icon>
);
const RefreshIcon = (p) => (
  <Icon {...p}>
    <path d="M21 12a9 9 0 1 1-3-6.7" />
    <polyline points="21 3 21 9 15 9" />
  </Icon>
);
const CloseIcon = (p) => (
  <Icon {...p}>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </Icon>
);
const ShieldIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
    <polyline points="9 12 11 14 15 10" />
  </Icon>
);
const ClockIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 14" />
  </Icon>
);

/* ---------------- TOAST ---------------- */
const StatusToast = ({ toast }) => (
  <div
    className={`as-toast ${toast ? "as-toast--show" : ""} ${
      toast ? `as-toast--${toast.type}` : ""
    }`}
    role="status"
    aria-live="polite"
  >
    {toast?.message}
  </div>
);

/* ---------------- HEADER ---------------- */
const StatusHeader = ({ app, onCopy, onAction }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const paid = app.paymentStatus === "success" || app.paymentStatus === "Paid";

  useEffect(() => {
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const run = (action) => {
    setMenuOpen(false);
    onAction(action);
  };

  return (
    <header className="as-header">
      <div className="as-header__left">
        <span className="as-header__label">Application No.</span>
        <div className="as-header__idrow">
          <strong className="as-header__id">{app.id}</strong>
          <button
            type="button"
            className="as-header__copy"
            onClick={onCopy}
            title="Copy application number"
            aria-label="Copy application number"
          >
            <CopyIcon size={15} />
          </button>
        </div>
        <span className="as-header__date">Date: {app.date}</span>
      </div>

      <div className="as-header__right">
        <span className="as-header__label">Applicant Name</span>
        <strong className="as-header__name">{app.name}</strong>

        <div className="as-header__menu" ref={menuRef}>
          <button
            type="button"
            className={`as-header__dots ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="More actions"
          >
            <span />
            <span />
            <span />
          </button>

          {menuOpen && (
            <ul className="as-header__dropdown" role="menu">
              <li>
                <button type="button" role="menuitem" onClick={() => run("refresh")}>
                  <RefreshIcon size={16} /> Refresh status
                </button>
              </li>
              <li>
                <button
                  type="button"
                  role="menuitem"
                  disabled={!paid}
                  onClick={() => run("receipt")}
                >
                  <DownloadIcon size={16} /> Download receipt
                </button>
              </li>
              <li>
                <button type="button" role="menuitem" onClick={() => run("print")}>
                  <PrintIcon size={16} /> Print page
                </button>
              </li>
              <li>
                <button type="button" role="menuitem" onClick={() => run("support")}>
                  <SupportIcon size={16} /> Contact support
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

/* ---------------- TITLE + BADGE ---------------- */
const StatusBadge = ({ isApproved, isPaid, isPending, onRefresh, refreshing }) => (
  <div className="as-badge">
    <span
      className={`as-badge__chip ${
        isPaid
          ? "is-complete"
          : isApproved
          ? "is-approved-chip"
          : "is-pending-chip"
      }`}
    >
      <i className="as-badge__dot" />
      {isPaid
        ? "Completed · 100%"
        : isApproved
        ? "Approved · Payment Required"
        : "In progress · Pending Review"}
    </span>
    <button
      type="button"
      className={`as-badge__refresh ${refreshing ? "is-spinning" : ""}`}
      onClick={onRefresh}
      disabled={refreshing}
      aria-label="Refresh status"
      title="Refresh status"
    >
      <RefreshIcon size={16} />
    </button>
  </div>
);

const StatusTitle = ({ isApproved, isPaid, isPending, onRefresh, refreshing }) => (
  <div className="as-title">
    <h2 className="as-title__heading">Application Status Tracker</h2>
    <p className="as-title__sub">
      Follow your application&apos;s journey from submission to final approval &amp; payment.
    </p>
    <StatusBadge
      isApproved={isApproved}
      isPaid={isPaid}
      isPending={isPending}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  </div>
);

/* ---------------- INFO CARD ---------------- */
const StatusInfoCard = ({ app, isApproved, isPaid, isPending }) => {
  return (
    <section className="as-info" aria-live="polite">
      <div className="as-info__row">
        <span className="as-info__key">Position:</span>
        <span className="as-info__value">{app.position || "Unique Record"}</span>
      </div>
      <div className="as-info__row">
        <span className="as-info__key">Application Status:</span>
        {isApproved || isPaid ? (
          <span className="as-info__value as-info__value--strong as-info__value--success">
            <i className="as-info__dot" /> Approved
          </span>
        ) : (
          <span className="as-info__value as-info__value--strong as-info__value--warn">
            <i className="as-info__dot" /> Under Review (Pending)
          </span>
        )}
      </div>
      <div className="as-info__row">
        <span className="as-info__key">Payment Status:</span>
        {isPaid ? (
          <span className="as-info__value as-info__value--strong as-info__value--success">
            <i className="as-info__dot" /> Payment Successful
          </span>
        ) : isApproved ? (
          <span className="as-info__value as-info__value--strong as-info__value--danger">
            <i className="as-info__dot" /> Payment Pending (₹{app.price || 499})
          </span>
        ) : (
          <span className="as-info__value as-info__value--warn">
            <i className="as-info__dot" /> Awaiting Verification (Opens upon approval)
          </span>
        )}
      </div>
      <div className="as-info__row">
        <span className="as-info__key">Verification Notice:</span>
        {isPending ? (
          <span className="as-info__value as-info__value--warn">
            <ClockIcon size={16} /> Wait 24-48 Hr for verifying documents and allotting approval
          </span>
        ) : isApproved && !isPaid ? (
          <span className="as-info__value as-info__value--success">
            <CheckIcon size={16} /> Application approved! Please click Make Payment below to complete allotment.
          </span>
        ) : (
          <span className="as-info__value as-info__value--success">
            <CheckIcon size={16} /> Application verified &amp; approved successfully!
          </span>
        )}
      </div>
    </section>
  );
};

/* ---------------- TIMELINE ---------------- */
const StatusTimeline = ({ app, isApproved, isPaid, isPending, onPay }) => {
  const steps = [
    { key: "submitted", label: "Application Submitted", done: true },
    { key: "checks", label: "URU Investigator Checks", done: isApproved || isPaid, inProgress: isPending },
    { key: "verified", label: "Document Verified", done: isApproved || isPaid, inProgress: isPending },
    { key: "approved", label: isPaid ? "Approved & Paid" : isApproved ? "Approved" : "Approval Pending", done: isApproved || isPaid, inProgress: isPending },
    { key: "payment", label: isPaid ? "Paid" : "Make Payment", done: isPaid, isAction: isApproved && !isPaid },
  ];

  return (
    <nav className="as-timeline" aria-label="Application progress">
      <ol className="as-timeline__list">
        {steps.map((s, i) => {
          const isLast = i === steps.length - 1;
          const isAction = s.isAction;
          const nextDone = !isLast && (steps[i + 1].done || steps[i + 1].isAction);

          return (
            <li
              key={s.key}
              className={`as-timeline__step ${s.done ? "is-done" : s.inProgress ? "is-pending" : "is-inactive"} ${
                isAction ? "is-action" : ""
              }`}
              style={{ "--i": i }}
              aria-current={isAction ? "step" : undefined}
            >
              {!isLast && (
                <span className="as-timeline__line">
                  <span
                    className={`as-timeline__fill ${nextDone ? "is-filled" : ""}`}
                  />
                </span>
              )}

              {isAction ? (
                <button
                  type="button"
                  className="as-timeline__circle as-timeline__circle--pay"
                  onClick={onPay}
                  aria-label="Make payment"
                  title="Application approved! Click to pay fee"
                >
                  <CardIcon size={26} />
                </button>
              ) : s.done ? (
                <span className="as-timeline__circle as-timeline__circle--done">
                  <CheckIcon size={26} />
                </span>
              ) : s.inProgress ? (
                <span className="as-timeline__circle as-timeline__circle--pending" title="In progress">
                  <ClockIcon size={24} />
                </span>
              ) : (
                <span className="as-timeline__circle as-timeline__circle--idle">
                  {i + 1}
                </span>
              )}

              {isAction ? (
                <button type="button" className="as-timeline__paybtn" onClick={onPay}>
                  Make Payment
                </button>
              ) : (
                <span
                  className={`as-timeline__label ${
                    isLast && isPaid
                      ? "as-timeline__label--paid"
                      : s.done
                      ? "as-timeline__label--done"
                      : s.inProgress
                      ? "as-timeline__label--pending"
                      : "as-timeline__label--idle"
                  }`}
                >
                  {s.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

/* ---------------- LOAD RAZORPAY SDK HELPER ---------------- */
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/* ---------------- PAYMENT MODAL ---------------- */
const CONFETTI = Array.from({ length: 10 }, (_, i) => i);

const PaymentModal = ({ app, user, onClose, onSuccess, onReceipt }) => {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const panelRef = useRef(null);
  const closeRef = useRef(onClose);
  const busyRef = useRef(false);
  closeRef.current = onClose;
  busyRef.current = processing;

  const paymentAmount = Number(app.price || 499);

  useEffect(() => {
    const prev = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape" && !busyRef.current) {
        closeRef.current();
        return;
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev && prev.focus && prev.focus();
    };
  }, []);

  const initiateRazorpay = async () => {
    if (processing) return;
    setProcessing(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        alert("Unable to load Razorpay SDK. Please check your internet connection.");
        setProcessing(false);
        return;
      }

      // 1. Create Razorpay order from backend
      const targetId = app._id || app.id;
      const orderRes = await axios.post(`${API_URL}/uru/create-razorpay-order`, {
        id: targetId,
        applicationNumber: app.id,
        amount: paymentAmount,
      });

      const orderData = orderRes.data;
      if (!orderData || !orderData.orderId) {
        alert("Failed to create Razorpay order on server.");
        setProcessing(false);
        return;
      }

      // 2. Configure Razorpay checkout options
      const options = {
        key: orderData.keyId || "rzp_live_1gSA9RbSjj0sEj",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Unique Records of Universe",
        description: `Application Fee: ${app.id} (${app.position})`,
        image: "https://uniquerecordsofuniverse.com/logo.png",
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            setProcessing(true);
            // 3. Verify Razorpay Payment Signature
            const verifyRes = await axios.post(`${API_URL}/uru/verify-razorpay-payment`, {
              id: targetId,
              applicationNumber: app.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes.data?.success) {
              const resData = {
                txnId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                paidAt: todayLabel(),
                method: "Razorpay (Live Secure)",
              };
              setResult(resData);
              onSuccess(resData);
            } else {
              alert("Payment verification failed on server.");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("Error verifying payment with server.");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: app.name || user?.name || user?.fullName || "",
          email: app.email || user?.email || "",
          contact: app.mobile || user?.mobile || user?.phoneNumber || "",
        },
        notes: {
          applicationNumber: app.id,
          position: app.position,
        },
        theme: {
          color: "#7c3aed",
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        setProcessing(false);
        alert(`Payment Failed: ${resp.error?.description || "Transaction declined"}`);
      });
      rzp.open();
    } catch (err) {
      console.error("Razorpay initiation error:", err);
      alert(err.response?.data?.message || "Failed to initialize Razorpay payment. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div
      className="as-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Make payment"
      onMouseDown={(e) => e.target === e.currentTarget && !processing && onClose()}
    >
      <div className="as-modal__panel" ref={panelRef} tabIndex={-1}>
        <button
          type="button"
          className="as-modal__close"
          onClick={onClose}
          disabled={processing}
          aria-label="Close"
        >
          <CloseIcon size={18} />
        </button>

        {result ? (
          <div className="as-modal__success">
            <div className="as-modal__tickwrap">
              {CONFETTI.map((i) => (
                <span key={i} className="as-modal__confetti" style={{ "--a": `${i * 36}deg`, "--d": `${(i % 3) * 60}ms` }} />
              ))}
              <span className="as-modal__tick">
                <CheckIcon size={40} strokeWidth={3} />
              </span>
            </div>
            <h3 className="as-modal__title">Payment successful</h3>
            <p className="as-modal__meta">
              ₹{paymentAmount.toFixed(2)} paid for <b>{app.id}</b>
            </p>
            <dl className="as-modal__receipt">
              <div><dt>Payment ID</dt><dd>{result.txnId}</dd></div>
              <div><dt>Method</dt><dd>{result.method}</dd></div>
              <div><dt>Date</dt><dd>{result.paidAt}</dd></div>
            </dl>
            <div className="as-modal__actions">
              <button type="button" className="as-modal__ghost" onClick={onReceipt}>
                <DownloadIcon size={16} /> Receipt
              </button>
              <button type="button" className="as-modal__pay" onClick={onClose} autoFocus>
                Done
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div className="as-modal__head">
              <span className="as-modal__badge">
                <ShieldIcon size={16} /> Razorpay Secure Gateway
              </span>
              <h3 className="as-modal__title">Pay Official Application Fee</h3>
              <p className="as-modal__meta">
                Application <b>{app.id}</b> ({app.position})
              </p>
              <div className="as-modal__amount">
                <span>Amount payable</span>
                <strong>₹{paymentAmount.toFixed(2)}</strong>
              </div>
            </div>

            <div style={{ margin: "24px 0", background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", color: "#64748b" }}>
                <span>Applicant:</span>
                <strong style={{ color: "#0f172a" }}>{app.name}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", color: "#64748b" }}>
                <span>Application No:</span>
                <strong style={{ color: "#7c3aed" }}>{app.id}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748b" }}>
                <span>Supported Modes:</span>
                <span style={{ color: "#0f172a", fontWeight: 600 }}>UPI (GPay, PhonePe, Paytm), Cards, NetBanking</span>
              </div>
            </div>

            <button
              type="button"
              className="as-modal__pay"
              onClick={initiateRazorpay}
              disabled={processing}
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                boxShadow: "0 8px 24px rgba(124, 58, 237, 0.35)",
              }}
            >
              {processing ? (
                <>
                  <span className="as-modal__spinner" /> Opening Razorpay…
                </>
              ) : (
                <>
                  <CardIcon size={20} /> Pay ₹{paymentAmount.toFixed(2)} with Razorpay
                </>
              )}
            </button>
            <p className="as-modal__note" style={{ marginTop: "16px" }}>
              🔒 256-bit SSL encrypted live checkout powered by Razorpay.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- MAIN ---------------- */
const ApplicationStatus = () => {
  const [apps, setApps] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payOpen, setPayOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const toastTimer = useRef(null);
  const refreshTimer = useRef(null);

  const fetchUserApps = async () => {
    try {
      setLoading(true);
      const stored = localStorage.getItem("user");
      let user = null;
      if (stored) {
        try {
          user = JSON.parse(stored);
          setCurrentUser(user);
        } catch (e) {}
      }

      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const params = {};
      if (user) {
        if (user.email) params.email = user.email;
        if (user.id || user._id) params.userId = user.id || user._id;
        if (user.uniqueId) params.uniqueId = user.uniqueId;
      }

      const res = await axios.get(`${API_URL}/uru/user`, { headers, params });
      const list = res.data?.data || [];

      if (Array.isArray(list) && list.length > 0) {
        const mapped = list.map((item) => {
          const isAppr = Boolean(item.approved || item.status === "Approved" || item.status === "Paid");
          const isPaidStatus = Boolean(item.paymentStatus === "Paid" || item.paymentStatus === "success" || item.status === "Paid");

          return {
            id: item.appNo || item.applicationNumber || `URU${item._id?.slice(-4)}`,
            _id: item._id || item.id,
            name: item.applicantName || item.name || user?.name || user?.fullName || "Applicant",
            date: item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Recent"),
            position: item.position || "Unique Record",
            status: item.status || (isAppr ? "Approved" : "Pending"),
            approved: isAppr,
            paymentStatus: isPaidStatus ? "success" : "pending",
            price: item.price || 499,
            txnId: item.transactionId || "TXN" + (item._id?.slice(-8) || ""),
            paidAt: item.date || "Recent",
            method: "Online",
          };
        });

        setApps(mapped);
        setActiveId((prev) => (mapped.some((m) => m.id === prev) ? prev : mapped[0].id));
      } else {
        setApps([]);
        setActiveId(null);
      }
    } catch (e) {
      console.error("Error fetching user applications:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserApps();
  }, []);

  const app = apps.find((a) => a.id === activeId) || apps[0] || null;
  const isApproved = Boolean(app?.approved || app?.status === "Approved" || app?.status === "Paid");
  const isPaid = Boolean(app?.paymentStatus === "success" || app?.paymentStatus === "Paid" || app?.status === "Paid");
  const isPending = Boolean(!isApproved && !isPaid);

  const showToast = useCallback((message, type = "info") => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(
    () => () => {
      clearTimeout(toastTimer.current);
      clearTimeout(refreshTimer.current);
    },
    []
  );

  const copyId = async () => {
    if (!app) return;
    try {
      await navigator.clipboard.writeText(app.id);
      showToast(`${app.id} copied`, "success");
    } catch {
      showToast("Copy failed", "error");
    }
  };

  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await fetchUserApps();
    refreshTimer.current = setTimeout(() => {
      setRefreshing(false);
      showToast("Status is up to date", "success");
    }, 600);
  };

  const openReceipt = (target) => {
    if (!target) return;
    const html = buildReceiptHtml(target);
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      w.focus();
      setTimeout(() => w.print(), 350);
      showToast("Receipt ready. Save as PDF from print", "success");
    } else {
      const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${target.id}.html`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Receipt downloaded", "success");
    }
  };

  const handleAction = (action) => {
    if (action === "refresh") refresh();
    if (action === "receipt" && app) openReceipt(app);
    if (action === "print") window.print();
    if (action === "support" && app) {
      window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
        `Support for Application ${app.id}`
      )}`;
    }
  };

  const handlePaid = (res) => {
    setApps((list) =>
      list.map((a) =>
        a.id === activeId ? { ...a, paymentStatus: "success", status: "Paid", approved: true, ...res } : a
      )
    );
    showToast("Payment successful 🎉", "success");
  };

  if (loading) {
    return (
      <div className="application-status">
        <div className="as-card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <div className="as-modal__spinner" style={{ margin: "0 auto 16px", width: "32px", height: "32px" }}></div>
          <h3>Loading your application status...</h3>
        </div>
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div className="application-status">
        <article className="as-card" style={{ textAlign: "center", padding: "60px 30px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
          <h2 style={{ fontSize: "22px", color: "#0f172a", marginBottom: "10px" }}>
            No Submitted Applications Found
          </h2>
          <p style={{ color: "#64748b", maxWidth: "500px", margin: "0 auto 24px" }}>
            You haven&apos;t submitted any URU record or activity application under your account yet.
          </p>
          <Link
            to="/uru/apply"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              color: "#ffffff",
              padding: "12px 28px",
              borderRadius: "10px",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 6px 18px rgba(124, 58, 237, 0.35)",
            }}
          >
            Apply Online Now 🚀
          </Link>
        </article>
      </div>
    );
  }

  return (
    <div className="application-status">
      {/* Application Switcher Tabs: ONLY Logged-in User's Applications */}
      {apps.length > 1 && (
        <div className="as-switcher" role="tablist" aria-label="Your applications">
          {apps.map((a) => (
            <button
              key={a.id}
              type="button"
              role="tab"
              aria-selected={a.id === activeId}
              className={`as-switcher__btn ${a.id === activeId ? "is-active" : ""}`}
              onClick={() => setActiveId(a.id)}
            >
              {a.id}
            </button>
          ))}
        </div>
      )}

      {app && (
        <article className={`as-card ${refreshing ? "is-refreshing" : ""}`}>
          <StatusHeader app={app} onCopy={copyId} onAction={handleAction} />
          <StatusTitle
            isApproved={isApproved}
            isPaid={isPaid}
            isPending={isPending}
            onRefresh={refresh}
            refreshing={refreshing}
          />
          <StatusInfoCard
            app={app}
            isApproved={isApproved}
            isPaid={isPaid}
            isPending={isPending}
          />
          <StatusTimeline
            app={app}
            isApproved={isApproved}
            isPaid={isPaid}
            isPending={isPending}
            onPay={() => setPayOpen(true)}
          />
        </article>
      )}

      {payOpen && app && (
        <PaymentModal
          app={app}
          user={currentUser}
          onClose={() => setPayOpen(false)}
          onSuccess={handlePaid}
          onReceipt={() => openReceipt(app)}
        />
      )}
      <StatusToast toast={toast} />
    </div>
  );
};

export default ApplicationStatus;