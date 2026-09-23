import React, { useEffect, useRef, useState } from "react";
import {
  FileText,
  Wallet,
  TrendingUp,
  Inbox,
  Receipt,
  PiggyBank,
} from "lucide-react";

import "./DashBoardHome.css";

/* ---------------------------------------------------
   Count-up hook — animates a number from 0 to target
   every time the component mounts (i.e. every page
   load / refresh), with an easing curve and optional
   stagger delay so the cards don't all pop at once.
--------------------------------------------------- */
function useCountUp(target, { duration = 1400, delay = 0, decimals = 0 } = {}) {
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
        // easeOutExpo — quick rise, gentle settle
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

const defaultStats = [
  {
    id: "month-forms",
    label: "This Month Sales",
    value: 0,
    suffix: " Forms",
    description: "Forms received this month",
    icon: <FileText size={20} />,
    theme: "blue",
  },
  {
    id: "monthly-sales",
    label: "Monthly Sales",
    value: 0,
    prefix: "₹",
    description: "Amount collected this month",
    icon: <Wallet size={20} />,
    theme: "sunset",
  },
  {
    id: "yearly-sales",
    label: "Yearly Sales",
    value: 0,
    prefix: "₹",
    description: "Amount collected this year",
    icon: <TrendingUp size={20} />,
    theme: "violet",
  },
  {
    id: "total-forms",
    label: "Total Forms Received",
    value: 2,
    description: "All-time successful forms",
    icon: <Inbox size={20} />,
    theme: "blue",
  },
  {
    id: "total-pricing",
    label: "Total Pricing Initiated",
    value: 0,
    prefix: "₹",
    description: "Total quotations initiated",
    icon: <Receipt size={20} />,
    theme: "sunset",
  },
  {
    id: "total-collected",
    label: "Total Collected Money",
    value: 0,
    prefix: "₹",
    description: "All-time successful collections",
    icon: <PiggyBank size={20} />,
    theme: "violet",
  },
];

const DashBoardHome = ({
  title = "URU Admin Control",
  subtitle = "Manage records, payments, and notifications efficiently",
  stats = defaultStats,
}) => {
  return (
    <div className="DashBoardHome">
      <header className="DashBoardHome-header">
        <div className="DashBoardHome-headerGlow" aria-hidden="true" />
        <h1 className="DashBoardHome-title">{title}</h1>
        <p className="DashBoardHome-subtitle">{subtitle}</p>
      </header>

      <section className="DashBoardHome-panel">
        <div className="DashBoardHome-grid">
          {stats.map((stat, index) => (
            <DashBoardHome_StatCard
              key={stat.id}
              {...stat}
              delay={index * 110}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashBoardHome;