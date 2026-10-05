import React, { useEffect, useState } from "react";
import {
  Trophy,
  Bell,
  Layers,
  ChevronRight,
  Inbox,
  BellOff,
  X,
  BookOpen,
  Calendar,
  MailCheck,
  MessageSquareText,
} from "lucide-react";

import "./DashBoardSec.css";

const defaultAchievements = [
  {
    id: "ach-1",
    title: "Saroj Kumar Mallik",
    meta: "Sports Category • Verified Record",
    tone: "blue",
  },
  {
    id: "ach-2",
    title: "National Excellence Award",
    meta: "Leadership • Approved",
    tone: "blue",
  },
  {
    id: "ach-3",
    title: "Youngest Record Holder 2026",
    meta: "Academics • Published",
    tone: "blue",
  },
];

const defaultNotifications = [
  {
    id: "notif-1",
    type: "opinion",
    title: "New contact inquiry received from visitor",
    meta: "10 mins ago",
    read: false,
  },
  {
    id: "notif-2",
    type: "subscriber",
    title: "New newsletter subscription confirmed",
    meta: "1 hour ago",
    read: false,
  },
  {
    id: "notif-3",
    type: "event",
    title: "Upcoming event schedule updated",
    meta: "3 hours ago",
    read: true,
  },
];

const defaultDistribution = [
  { key: "blogs", label: "Blogs & Articles", value: 3, color: "#3b82f6" },
  { key: "events", label: "Events & Programs", value: 1, color: "#10b981" },
  { key: "achievements", label: "Achievements", value: 2, color: "#8b5cf6" },
  { key: "opinions", label: "User Inquiries", value: 2, color: "#f59e0b" },
  { key: "gallery", label: "Media & Photos", value: 1, color: "#ec4899" },
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
  const strokeWidth = 34;
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
        aria-label="Content distribution breakdown"
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
  achievementsList = null,
  recentActivityList = null,
  distributionSegments = null,
  totalItemsCount = 0,
  onViewAllAchievements,
}) => {
  // Format achievements
  const achievements = (achievementsList && achievementsList.length > 0)
    ? achievementsList.map((item, i) => ({
        id: item._id || `ach-${i}`,
        title: item.title || item.heading || "Untitled Achievement",
        meta: `${item.category || "General"} • ${item.status || "Published"}`,
        tone: "blue",
      }))
    : defaultAchievements;

  // Format notifications / recent activity
  const initialNotifications = (recentActivityList && recentActivityList.length > 0)
    ? recentActivityList.map((act, i) => ({
        id: act.id || `notif-${i}`,
        type: act.type,
        title: act.title,
        meta: act.meta,
        read: i > 2, // first 3 unread by default
      }))
    : defaultNotifications;

  const [notifications, setNotifications] = useState(initialNotifications);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (recentActivityList && recentActivityList.length > 0) {
      setNotifications(
        recentActivityList.map((act, i) => ({
          id: act.id || `notif-${i}`,
          type: act.type,
          title: act.title,
          meta: act.meta,
          read: i > 2,
        }))
      );
    }
  }, [recentActivityList]);

  const expenseSegments = (distributionSegments && distributionSegments.length > 0)
    ? distributionSegments
    : defaultDistribution;

  const totalDisplay = totalItemsCount > 0 ? `${totalItemsCount} Items` : "100%";

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

  const getNotifIcon = (type) => {
    if (type === "blog") return <BookOpen size={15} />;
    if (type === "event") return <Calendar size={15} />;
    if (type === "opinion") return <MessageSquareText size={15} />;
    if (type === "subscriber") return <MailCheck size={15} />;
    return <Bell size={15} />;
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
                    <Trophy size={15} />
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
            ECOSYSTEM DISTRIBUTION (DONUT)
        ============================ */}
        <section className="DashBoardSec-card DashBoardSec-card--mint">
          <header className="DashBoardSec-cardHeader DashBoardSec-cardHeader--center">
            <div className="DashBoardSec-cardHeaderLeft">
              <span className="DashBoardSec-cardIcon DashBoardSec-cardIcon--mint">
                <Layers size={16} />
              </span>
              <h2 className="DashBoardSec-cardTitle">Content Distribution</h2>
            </div>
          </header>

          <DonutChart
            segments={expenseSegments}
            centerValue={totalDisplay}
            centerLabel="Ecosystem Assets"
            hoveredKey={hoveredKey}
            onHover={setHoveredKey}
          />
        </section>

        {/* ============================
            LIVE NOTIFICATIONS & ACTIVITY
        ============================ */}
        <section className="DashBoardSec-card DashBoardSec-card--violet">
          <header className="DashBoardSec-cardHeader">
            <div className="DashBoardSec-cardHeaderLeft">
              <span className="DashBoardSec-cardIcon DashBoardSec-cardIcon--violet">
                <Bell size={16} />
              </span>
              <h2 className="DashBoardSec-cardTitle">Live Activity Feed</h2>
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
                No new activity
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
                    {getNotifIcon(item.type)}
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
            <span className="DashBoardSec-legendLabel">{seg.label} ({seg.value})</span>
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
              <h3>All Project Achievements</h3>
              <button className="DashBoardSec-modalClose" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <ul className="DashBoardSec-modalList">
              {achievements.map((item) => (
                <li key={item.id} className="DashBoardSec-modalItem">
                  <span className="DashBoardSec-listItemIcon DashBoardSec-listItemIcon--blue">
                    <Trophy size={16} />
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