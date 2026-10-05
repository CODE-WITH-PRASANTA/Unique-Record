import React, { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Calendar,
  Award,
  MessageSquareText,
  MailCheck,
  MessagesSquare,
  Image,
  CheckCircle2,
} from "lucide-react";

import "./DashBoardHome.css";

/* ---------------------------------------------------
   Count-up hook — animates a number from 0 to target
--------------------------------------------------- */
function useCountUp(target, { duration = 1200, delay = 0, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    let start = null;
    const from = 0;
    const to = Number(target) || 0;

    const timer = setTimeout(() => {
      const step = (timestamp) => {
        if (start === null) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setValue(from + (to - from) * eased);

        if (progress < 1) {
          frame.current = requestAnimationFrame(step);
        } else {
          setValue(to);
        }
      };
      frame.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, duration, delay]);

  return decimals > 0 ? value.toFixed(decimals) : Math.round(value);
}

function formatNumber(value) {
  return Number(value).toLocaleString("en-IN");
}

function DashBoardHome_StatCard({
  icon,
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  description,
  theme = "blue",
  delay = 0,
}) {
  const count = useCountUp(value, { delay, decimals });

  return (
    <div className={`DashBoardHome-card DashBoardHome-card--${theme}`}>
      <div className="DashBoardHome-cardBlob" aria-hidden="true" />
      <div className="DashBoardHome-cardIcon">{icon}</div>

      <span className="DashBoardHome-cardLabel">{label}</span>

      <span className="DashBoardHome-cardValue">
        {prefix}
        {formatNumber(count)}
        {suffix}
      </span>

      <span className="DashBoardHome-cardDesc">{description}</span>
    </div>
  );
}

const DashBoardHome = ({
  title = "Unique Records Admin Control",
  subtitle = "Real-time ecosystem analytics, content performance, and community engagement",
  statsData = null,
}) => {
  const stats = statsData || {};

  const cards = [
    {
      id: "stat-blogs",
      label: "Total Blogs & Articles",
      value: stats.totalBlogs || 0,
      description: `${stats.recentBlogs?.length || 0} recent publications`,
      icon: <BookOpen size={20} />,
      theme: "blue",
    },
    {
      id: "stat-events",
      label: "Events & Programs",
      value: stats.totalEvents || 0,
      description: "Scheduled & active events",
      icon: <Calendar size={20} />,
      theme: "sunset",
    },
    {
      id: "stat-achievements",
      label: "Achievements & Awards",
      value: stats.totalAchievements || 0,
      description: "Verified record achievements",
      icon: <Award size={20} />,
      theme: "violet",
    },
    {
      id: "stat-opinions",
      label: "Contact Inquiries",
      value: stats.totalOpinions || 0,
      description: `${stats.pendingOpinions || 0} pending admin review`,
      icon: <MessageSquareText size={20} />,
      theme: "blue",
    },
    {
      id: "stat-subscribers",
      label: "Newsletter Subscribers",
      value: stats.totalSubscribers || 0,
      description: "Active email subscribers",
      icon: <MailCheck size={20} />,
      theme: "sunset",
    },
    {
      id: "stat-comments",
      label: "Community Feedback",
      value: (stats.totalBlogComments || 0) + (stats.totalAchievementComments || 0),
      description: "Comments across blogs & awards",
      icon: <MessagesSquare size={20} />,
      theme: "violet",
    },
  ];

  return (
    <div className="DashBoardHome">
      <header className="DashBoardHome-header">
        <div className="DashBoardHome-headerGlow" aria-hidden="true" />
        <h1 className="DashBoardHome-title">{title}</h1>
        <p className="DashBoardHome-subtitle">{subtitle}</p>
      </header>

      <section className="DashBoardHome-panel">
        <div className="DashBoardHome-grid">
          {cards.map((stat, index) => (
            <DashBoardHome_StatCard
              key={stat.id}
              {...stat}
              delay={index * 90}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashBoardHome;