import React, { useEffect, useState } from "react";
import {
  Trophy,
  Target,
  CheckCircle2,
  Bell,
  Wallet,
  Truck,
  ChevronRight,
  Inbox,
  BellOff,
  X,
} from "lucide-react";

import "./DashBoardSec.css";

const defaultAchievements = [
  {
    id: "ach-1",
    icon: <Trophy size={16} />,
    title: "50 Orders Delivered",
    meta: "2 days ago",
    tone: "blue",
  },
  {
    id: "ach-2",
    icon: <Target size={16} />,
    title: "₹50,000 Sales Milestone Reached",
    meta: "5 days ago",
    tone: "blue",
  },
  {
    id: "ach-3",
    icon: <CheckCircle2 size={16} />,
    title: "Zero Pending Complaints This Week",
    meta: "1 week ago",
    tone: "blue",
  },
];

const defaultNotifications = [
  {
    id: "notif-1",
    icon: <Bell size={16} />,
    title: "New order received from Rahul Sharma",
    meta: "10 mins ago",
    read: false,
  },
  {
    id: "notif-2",
    icon: <Wallet size={16} />,
    title: "Payment of ₹2,500 confirmed",
    meta: "1 hour ago",
    read: false,
  },
  {
    id: "notif-3",
    icon: <Truck size={16} />,
    title: "Delivery boy assigned to Route 3",
    meta: "3 hours ago",
    read: true,
  },
];

const defaultExpenseSegments = [
  { key: "paid", label: "Paid", value: 62, color: "#22c55e" },
  { key: "pending", label: "Pending", value: 18, color: "#eab308" },
  { key: "formFilled", label: "Total Form Filled", value: 13, color: "#ef4444" },
  { key: "moneyUpdated", label: "Total Money Updated", value: 7, color: "#3b82f6" },
];

function DonutChart({
  segments,
  centerValue,
  centerLabel,
  hoveredKey,
  onHover,
}) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 72;
  const strokeWidth = 36;
  const circumference = 2 * Math.PI * r;
  const gap = 3;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  let cumulative = 0;
  const activeKey = hoveredKey;
  const active = segments.find((s) => s.key === activeKey);

  return (
    <div className="DashBoardSec-donutWrap">
      <svg
        className="DashBoardSec-donutSvg"
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Total expenses breakdown"
      >
        <defs>
          <filter id="dbsDonutShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="8"
              floodColor="#0f172a"
              floodOpacity="0.16"
            />
          </filter>
        </defs>

        <g transform={`rotate(-90 ${cx} ${cy})`} filter="url(#dbsDonutShadow)">
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#eef1f8"
            strokeWidth={strokeWidth}
          />

          {segments.map((seg) => {
            const pct = seg.value / total;
            const segLen = Math.max(pct * circumference - gap, 0);
            const offsetLen = (cumulative / total) * circumference;
            cumulative += seg.value;

            const isDimmed = activeKey && activeKey !== seg.key;
            const isActive = activeKey === seg.key;

            return (
              <circle
                key={seg.key}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={isActive ? strokeWidth + 4 : strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${segLen} ${circumference - segLen}`}
                strokeDashoffset={mounted ? -offsetLen : circumference}
                className="DashBoardSec-donutSegment"
                style={{
                  opacity: isDimmed ? 0.32 : 1,
                }}
                onMouseEnter={() => onHover(seg.key)}
                onMouseLeave={() => onHover(null)}
              />
            );
          })}
        </g>
      </svg>

      <div className="DashBoardSec-donutCenter">
        <span className="DashBoardSec-donutCenterValue">
          {active ? `${Math.round((active.value / total) * 100)}%` : centerValue}
        </span>
        <span className="DashBoardSec-donutCenterLabel">
          {active ? active.label : centerLabel}
        </span>
      </div>
    </div>
  );
}

const DashBoardSec = ({
  achievements = defaultAchievements,
  notifications: notificationsProp = defaultNotifications,
  expenseSegments = defaultExpenseSegments,
  totalExpensesValue = "₹1,24,500",
  onViewAllAchievements,
}) => {
  const [notifications, setNotifications] = useState(notificationsProp);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleViewAllClick = () => {
    if (typeof onViewAllAchievements === "function") {
      onViewAllAchievements();
    }
    setShowModal(true);
  };

  return (
    <div className="DashBoardSec">
      <div className="DashBoardSec-grid">
        {/* ============================
            RECENT ACHIEVEMENTS
        ============================ */}
        <section className="DashBoardSec-card DashBoardSec-card--blue">
          <header className="DashBoardSec-cardHeader">
            <div className="DashBoardSec-cardHeaderLeft">
              <span className="DashBoardSec-cardIcon DashBoardSec-cardIcon--blue">
                <Trophy size={16} />
              </span>
              <h2 className="DashBoardSec-cardTitle">Recent Achievements</h2>
            </div>
          </header>

          {achievements.length === 0 ? (
            <div className="DashBoardSec-emptyState">
              <Inbox size={26} className="DashBoardSec-emptyIcon" />
              <span className="DashBoardSec-emptyText">
                No recent achievements found
              </span>
            </div>
          ) : (
            <ul className="DashBoardSec-list">
              {achievements.map((item) => (
                <li key={item.id} className="DashBoardSec-listItem">
                  <span className="DashBoardSec-listItemIcon DashBoardSec-listItemIcon--blue">
                    {item.icon}
                  </span>
                  <span className="DashBoardSec-listItemBody">
                    <span className="DashBoardSec-listItemTitle">
                      {item.title}
                    </span>
                    <span className="DashBoardSec-listItemMeta">
                      {item.meta}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}

          {achievements.length > 0 && (
            <button
              type="button"
              className="DashBoardSec-viewAll"
              onClick={handleViewAllClick}
            >
              View all achievements
              <ChevronRight size={14} />
            </button>
          )}
        </section>

        {/* ============================
            TOTAL EXPENSES (DONUT)
        ============================ */}
        <section className="DashBoardSec-card DashBoardSec-card--mint">
          <header className="DashBoardSec-cardHeader DashBoardSec-cardHeader--center">
            <div className="DashBoardSec-cardHeaderLeft">
              <span className="DashBoardSec-cardIcon DashBoardSec-cardIcon--mint">
                <Wallet size={16} />
              </span>
              <h2 className="DashBoardSec-cardTitle">Total Expenses</h2>
            </div>
          </header>

          <DonutChart
            segments={expenseSegments}
            centerValue={totalExpensesValue}
            centerLabel="Total Expenses"
            hoveredKey={hoveredKey}
            onHover={setHoveredKey}
          />
        </section>

        {/* ============================
            NOTIFICATIONS
        ============================ */}
        <section className="DashBoardSec-card DashBoardSec-card--violet">
          <header className="DashBoardSec-cardHeader">
            <div className="DashBoardSec-cardHeaderLeft">
              <span className="DashBoardSec-cardIcon DashBoardSec-cardIcon--violet">
                <Bell size={16} />
              </span>
              <h2 className="DashBoardSec-cardTitle">Notifications</h2>
              {unreadCount > 0 && (
                <span className="DashBoardSec-cardBadge">{unreadCount}</span>
              )}
            </div>

            {notifications.length > 0 && unreadCount > 0 && (
              <button
                type="button"
                className="DashBoardSec-cardAction"
                onClick={markAllRead}
              >
                Mark all read
              </button>
            )}
          </header>

          {notifications.length === 0 ? (
            <div className="DashBoardSec-emptyState">
              <BellOff size={26} className="DashBoardSec-emptyIcon" />
              <span className="DashBoardSec-emptyText">
                No new notifications
              </span>
            </div>
          ) : (
            <ul className="DashBoardSec-list">
              {notifications.map((item) => (
                <li
                  key={item.id}
                  className={`DashBoardSec-listItem ${
                    !item.read ? "DashBoardSec-listItem--unread" : ""
                  }`}
                  onClick={() => toggleRead(item.id)}
                  role="button"
                  tabIndex={0}
                >
                  <span className="DashBoardSec-listItemIcon DashBoardSec-listItemIcon--violet">
                    {item.icon}
                  </span>
                  <span className="DashBoardSec-listItemBody">
                    <span className="DashBoardSec-listItemTitle">
                      {item.title}
                    </span>
                    <span className="DashBoardSec-listItemMeta">
                      {item.meta}
                    </span>
                  </span>
                  {!item.read && (
                    <span
                      className="DashBoardSec-unreadDot"
                      aria-label="Unread"
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* ============================
          LEGEND
      ============================ */}
      <div className="DashBoardSec-legend">
        {expenseSegments.map((seg) => (
          <button
            key={seg.key}
            type="button"
            className={`DashBoardSec-legendItem ${
              hoveredKey === seg.key ? "is-active" : ""
            }`}
            onMouseEnter={() => setHoveredKey(seg.key)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <span
              className="DashBoardSec-legendDot"
              style={{ backgroundColor: seg.color }}
            />
            <span className="DashBoardSec-legendLabel">{seg.label}</span>
          </button>
        ))}
      </div>

      {/* ============================
          ACHIEVEMENTS MODAL POPUP
      ============================ */}
      {showModal && (
        <div className="DashBoardSec-modalOverlay" onClick={() => setShowModal(false)}>
          <div className="DashBoardSec-modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="DashBoardSec-modalHeader">
              <h3>All Achievements</h3>
              <button className="DashBoardSec-modalClose" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <ul className="DashBoardSec-modalList">
              {achievements.map((item) => (
                <li key={item.id} className="DashBoardSec-modalItem">
                  <span className="DashBoardSec-listItemIcon DashBoardSec-listItemIcon--blue">
                    {item.icon}
                  </span>
                  <div>
                    <div className="DashBoardSec-listItemTitle">{item.title}</div>
                    <div className="DashBoardSec-listItemMeta">{item.meta}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoardSec;