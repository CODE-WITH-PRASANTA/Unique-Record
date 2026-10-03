import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ApplicationStatus.css";

/* ---------------- DATA (replace with API response) ---------------- */
const PAYMENT_AMOUNT = 499; // change to your real fee
const SUPPORT_EMAIL = "support@uru.com"; // change to your real support email

const APPLICATIONS = [
  {
    id: "URU6310",
    name: "Prasanta Kumar Khuntia",
    date: "22nd Sept 2026",
    position: "Unique Record",
    paymentStatus: "success",
    txnId: "TXN2609220041",
    paidAt: "22 Sept 2026",
    method: "UPI",
  },
  {
    id: "URU3778",
    name: "Prasanta Kumar Khuntia",
    date: "22nd Sept 2026",
    position: "Unique Record",
    paymentStatus: "pending",
  },
];

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
  <p>Thank you. Your payment is received and will be verified within 24 hours.</p>
  <table>
    <tr><td>Application No.</td><td>${esc(app.id)}</td></tr>
    <tr><td>Applicant</td><td>${esc(app.name)}</td></tr>
    <tr><td>Position</td><td>${esc(app.position)}</td></tr>
    <tr><td>Application Date</td><td>${esc(app.date)}</td></tr>
    <tr><td>Transaction ID</td><td>${esc(app.txnId || "-")}</td></tr>
    <tr><td>Payment Method</td><td>${esc(app.method || "-")}</td></tr>
    <tr><td>Paid On</td><td>${esc(app.paidAt || "-")}</td></tr>
    <tr class="t"><td>Amount Paid</td><td>&#8377;${PAYMENT_AMOUNT.toFixed(2)}</td></tr>
  </table>
  <p class="n">This is a computer generated receipt.</p>
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
  const paid = app.paymentStatus === "success";

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
const StatusBadge = ({ paid, onRefresh, refreshing }) => (
  <div className="as-badge">
    <span className={`as-badge__chip ${paid ? "is-complete" : "is-progress"}`}>
      <i className="as-badge__dot" />
      {paid ? "Completed · 100%" : "In progress · 80%"}
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

const StatusTitle = ({ paid, onRefresh, refreshing }) => (
  <div className="as-title">
    <h2 className="as-title__heading">Application Status Tracker</h2>
    <p className="as-title__sub">
      Follow your application&apos;s journey from submission to final payment. Stay
      updated every step of the way.
    </p>
    <StatusBadge paid={paid} onRefresh={onRefresh} refreshing={refreshing} />
  </div>
);

/* ---------------- INFO CARD ---------------- */
const StatusInfoCard = ({ app }) => {
  const paid = app.paymentStatus === "success";
  return (
    <section className="as-info" aria-live="polite">
      <div className="as-info__row">
        <span className="as-info__key">Position:</span>
        <span className="as-info__value">{app.position}</span>
      </div>
      <div className="as-info__row">
        <span className="as-info__key">Payment Status:</span>
        <span
          className={`as-info__value as-info__value--strong ${
            paid ? "as-info__value--success" : "as-info__value--danger"
          }`}
        >
          <i className="as-info__dot" />
          {paid ? "Payment Successful" : "Payment Pending"}
        </span>
      </div>
      <div className="as-info__row">
        <span className="as-info__key">Payment Allotment:</span>
        <span className="as-info__value as-info__value--warn">
          <ClockIcon size={16} /> Wait 24 Hr for verifying and allot your payment
        </span>
      </div>
    </section>
  );
};

/* ---------------- TIMELINE ---------------- */
const StatusTimeline = ({ app, onPay }) => {
  const paid = app.paymentStatus === "success";

  const steps = [
    { key: "submitted", label: "Application Submitted", done: true },
    { key: "checks", label: "URU Investigator Checks", done: true },
    { key: "verified", label: "Document Verified", done: true },
    { key: "approved", label: paid ? "Approved & Paid" : "Approved", done: true },
    { key: "payment", label: paid ? "Paid" : "Make Payment", done: paid },
  ];

  return (
    <nav className="as-timeline" aria-label="Application progress">
      <ol className="as-timeline__list">
        {steps.map((s, i) => {
          const isLast = i === steps.length - 1;
          const isAction = isLast && !paid;
          const nextDone = !isLast && steps[i + 1].done;
          return (
            <li
              key={s.key}
              className={`as-timeline__step ${s.done ? "is-done" : ""} ${
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
                >
                  <CardIcon size={26} />
                </button>
              ) : (
                <span className="as-timeline__circle">
                  <CheckIcon size={26} />
                </span>
              )}

              {isAction ? (
                <button type="button" className="as-timeline__paybtn" onClick={onPay}>
                  Make Payment
                </button>
              ) : (
                <span
                  className={`as-timeline__label ${
                    isLast && paid ? "as-timeline__label--paid" : ""
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

/* ---------------- PAYMENT MODAL ---------------- */
const METHODS = [
  { key: "upi", label: "UPI" },
  { key: "card", label: "Card" },
  { key: "netbanking", label: "Net Banking" },
];
const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Bank"];
const CONFETTI = Array.from({ length: 10 }, (_, i) => i);

const PaymentModal = ({ app, onClose, onSuccess, onReceipt }) => {
  const [method, setMethod] = useState("upi");
  const [upi, setUpi] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [bank, setBank] = useState("");
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const panelRef = useRef(null);
  const closeRef = useRef(onClose);
  const busyRef = useRef(false);
  const payTimer = useRef(null);
  closeRef.current = onClose;
  busyRef.current = processing;

  useEffect(() => {
    const prev = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape" && !busyRef.current) {
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll(
        "button:not([disabled]), input:not([disabled]), select:not([disabled])"
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      clearTimeout(payTimer.current);
      prev && prev.focus && prev.focus();
    };
  }, []);

  const validate = () => {
    const e = {};
    if (method === "upi" && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upi.trim()))
      e.upi = "Enter a valid UPI ID (e.g. name@bank)";
    if (method === "card") {
      if (card.number.replace(/\s/g, "").length !== 16) e.number = "Enter 16 digit card number";
      if (card.name.trim().length < 2) e.name = "Enter name on card";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) e.expiry = "Use MM/YY";
      if (!/^\d{3,4}$/.test(card.cvv)) e.cvv = "Invalid CVV";
    }
    if (method === "netbanking" && !bank) e.bank = "Select your bank";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const pay = (ev) => {
    ev.preventDefault();
    if (processing || !validate()) return;
    setProcessing(true);
    payTimer.current = setTimeout(() => {
      const res = {
        txnId: `TXN${Date.now().toString().slice(-10)}`,
        paidAt: todayLabel(),
        method: METHODS.find((m) => m.key === method).label,
      };
      setProcessing(false);
      setResult(res);
      onSuccess(res);
    }, 1800);
  };

  const fmtCard = (v) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
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
              ₹{PAYMENT_AMOUNT.toFixed(2)} paid for <b>{app.id}</b>
            </p>
            <dl className="as-modal__receipt">
              <div><dt>Transaction ID</dt><dd>{result.txnId}</dd></div>
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
          <form onSubmit={pay} noValidate>
            <div className="as-modal__head">
              <span className="as-modal__badge">
                <ShieldIcon size={16} /> Secure Payment
              </span>
              <h3 className="as-modal__title">Complete your payment</h3>
              <p className="as-modal__meta">
                Application <b>{app.id}</b>
              </p>
              <div className="as-modal__amount">
                <span>Amount payable</span>
                <strong>₹{PAYMENT_AMOUNT.toFixed(2)}</strong>
              </div>
            </div>

            <div className="as-modal__tabs" role="tablist">
              {METHODS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  role="tab"
                  aria-selected={method === m.key}
                  className={`as-modal__tab ${method === m.key ? "is-active" : ""}`}
                  onClick={() => {
                    setMethod(m.key);
                    setErrors({});
                  }}
                  disabled={processing}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="as-modal__body">
              {method === "upi" && (
                <label className="as-field">
                  <span className="as-field__label">UPI ID</span>
                  <input
                    className={`as-field__input ${errors.upi ? "has-error" : ""}`}
                    placeholder="yourname@upi"
                    value={upi}
                    onChange={(e) => setUpi(e.target.value)}
                    disabled={processing}
                    autoFocus
                  />
                  {errors.upi && <em className="as-field__error">{errors.upi}</em>}
                </label>
              )}

              {method === "card" && (
                <>
                  <label className="as-field">
                    <span className="as-field__label">Card number</span>
                    <input
                      className={`as-field__input ${errors.number ? "has-error" : ""}`}
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={card.number}
                      onChange={(e) => setCard({ ...card, number: fmtCard(e.target.value) })}
                      disabled={processing}
                      autoFocus
                    />
                    {errors.number && <em className="as-field__error">{errors.number}</em>}
                  </label>
                  <label className="as-field">
                    <span className="as-field__label">Name on card</span>
                    <input
                      className={`as-field__input ${errors.name ? "has-error" : ""}`}
                      placeholder="Full name"
                      value={card.name}
                      onChange={(e) => setCard({ ...card, name: e.target.value })}
                      disabled={processing}
                    />
                    {errors.name && <em className="as-field__error">{errors.name}</em>}
                  </label>
                  <div className="as-modal__split">
                    <label className="as-field">
                      <span className="as-field__label">Expiry</span>
                      <input
                        className={`as-field__input ${errors.expiry ? "has-error" : ""}`}
                        inputMode="numeric"
                        placeholder="MM/YY"
                        value={card.expiry}
                        onChange={(e) => setCard({ ...card, expiry: fmtExpiry(e.target.value) })}
                        disabled={processing}
                      />
                      {errors.expiry && <em className="as-field__error">{errors.expiry}</em>}
                    </label>
                    <label className="as-field">
                      <span className="as-field__label">CVV</span>
                      <input
                        className={`as-field__input ${errors.cvv ? "has-error" : ""}`}
                        inputMode="numeric"
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={card.cvv}
                        onChange={(e) =>
                          setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") })
                        }
                        disabled={processing}
                      />
                      {errors.cvv && <em className="as-field__error">{errors.cvv}</em>}
                    </label>
                  </div>
                </>
              )}

              {method === "netbanking" && (
                <label className="as-field">
                  <span className="as-field__label">Select bank</span>
                  <select
                    className={`as-field__input ${errors.bank ? "has-error" : ""}`}
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    disabled={processing}
                  >
                    <option value="">Choose your bank</option>
                    {BANKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  {errors.bank && <em className="as-field__error">{errors.bank}</em>}
                </label>
              )}
            </div>

            <button type="submit" className="as-modal__pay" disabled={processing}>
              {processing ? (
                <>
                  <span className="as-modal__spinner" /> Processing…
                </>
              ) : (
                <>Pay ₹{PAYMENT_AMOUNT.toFixed(2)}</>
              )}
            </button>
            <p className="as-modal__note">
              Your payment is encrypted and verified within 24 hours.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

/* ---------------- MAIN ---------------- */
const ApplicationStatus = () => {
  const [apps, setApps] = useState(APPLICATIONS);
  const [activeId, setActiveId] = useState(APPLICATIONS[0].id);
  const [payOpen, setPayOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const refreshTimer = useRef(null);

  const app = apps.find((a) => a.id === activeId);
  const paid = app.paymentStatus === "success";

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
    try {
      await navigator.clipboard.writeText(app.id);
      showToast(`${app.id} copied`, "success");
    } catch {
      showToast("Copy failed", "error");
    }
  };

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    refreshTimer.current = setTimeout(() => {
      setRefreshing(false);
      showToast("Status is up to date", "success");
    }, 1000);
  };

  const openReceipt = (target) => {
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
    if (action === "receipt") openReceipt(app);
    if (action === "print") window.print();
    if (action === "support") {
      window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
        `Support for ${app.id}`
      )}`;
    }
  };

  const handlePaid = (res) => {
    setApps((list) =>
      list.map((a) =>
        a.id === activeId ? { ...a, paymentStatus: "success", ...res } : a
      )
    );
    showToast("Payment successful 🎉", "success");
  };

  return (
    <div className="application-status">
      <div className="as-switcher" role="tablist" aria-label="Demo applications">
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

      <article className={`as-card ${refreshing ? "is-refreshing" : ""}`}>
        <StatusHeader app={app} onCopy={copyId} onAction={handleAction} />
        <StatusTitle paid={paid} onRefresh={refresh} refreshing={refreshing} />
        <StatusInfoCard app={app} />
        <StatusTimeline app={app} onPay={() => setPayOpen(true)} />
      </article>

      {payOpen && (
        <PaymentModal
          app={app}
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