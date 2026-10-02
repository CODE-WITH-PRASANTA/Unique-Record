import React, { useState } from "react";
import {
  TrendingUp,
  BarChart2,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import "./DashBoardTrends.css";

const defaultMonthlyData = [
  { month: "May", blogs: 2, events: 1, inquiries: 3, subscribers: 5, total: 11 },
  { month: "Jun", blogs: 4, events: 2, inquiries: 6, subscribers: 8, total: 20 },
  { month: "Jul", blogs: 5, events: 3, inquiries: 8, subscribers: 12, total: 28 },
  { month: "Aug", blogs: 7, events: 4, inquiries: 10, subscribers: 15, total: 36 },
  { month: "Sep", blogs: 9, events: 5, inquiries: 14, subscribers: 22, total: 50 },
  { month: "Oct", blogs: 12, events: 8, inquiries: 18, subscribers: 30, total: 68 },
];

const DashBoardTrends = ({
  monthlyData = defaultMonthlyData,
  summaryStats = {},
}) => {
  const [activeMetric, setActiveMetric] = useState("all"); // 'all', 'blogs', 'events', 'inquiries', 'subscribers'
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const data = (monthlyData && monthlyData.length > 0) ? monthlyData : defaultMonthlyData;

  const getMetricValue = (item, metric) => {
    if (metric === "blogs") return item.blogs || 0;
    if (metric === "events") return item.events || 0;
    if (metric === "inquiries") return item.inquiries || 0;
    if (metric === "subscribers") return item.subscribers || 0;
    return (item.total !== undefined ? item.total : ((item.blogs || 0) + (item.events || 0) + (item.inquiries || 0) + (item.subscribers || 0)));
  };

  const maxValue = Math.max(...data.map((d) => getMetricValue(d, activeMetric)), 5);

  const metricColors = {
    all: { bar: "linear-gradient(180deg, #3f6df0 0%, #8f2bf5 100%)", glow: "rgba(111, 63, 245, 0.4)", text: "#6a4bf0" },
    blogs: { bar: "linear-gradient(180deg, #38bdf8 0%, #2563eb 100%)", glow: "rgba(37, 99, 235, 0.4)", text: "#2563eb" },
    events: { bar: "linear-gradient(180deg, #34d399 0%, #059669 100%)", glow: "rgba(5, 150, 105, 0.4)", text: "#059669" },
    inquiries: { bar: "linear-gradient(180deg, #fbbf24 0%, #d97706 100%)", glow: "rgba(217, 119, 6, 0.4)", text: "#d97706" },
    subscribers: { bar: "linear-gradient(180deg, #c084fc 0%, #7c3aed 100%)", glow: "rgba(124, 58, 237, 0.4)", text: "#7c3aed" },
  };

  const currentTheme = metricColors[activeMetric] || metricColors.all;

  const totalCalculated = data.reduce((acc, curr) => acc + getMetricValue(curr, activeMetric), 0);

  return (
    <div className="DashBoardTrends">
      <div className="DashBoardTrends-panel">
        {/* Header */}
        <div className="DashBoardTrends-header">
          <div className="DashBoardTrends-titleWrap">
            <div className="DashBoardTrends-iconBadge">
              <BarChart2 size={18} />
            </div>
            <div>
              <h2 className="DashBoardTrends-title">Ecosystem Growth & Activity Analytics</h2>
              <p className="DashBoardTrends-subtitle">
                Monthly submissions, engagements, and content performance trends
              </p>
            </div>
          </div>

          {/* Metric Selector Tabs */}
          <div className="DashBoardTrends-tabs">
            <button
              type="button"
              className={`DashBoardTrends-tab ${activeMetric === "all" ? "is-active" : ""}`}
              onClick={() => setActiveMetric("all")}
            >
              <Layers size={14} />
              All Activity
            </button>
            <button
              type="button"
              className={`DashBoardTrends-tab ${activeMetric === "blogs" ? "is-active" : ""}`}
              onClick={() => setActiveMetric("blogs")}
            >
              Blogs
            </button>
            <button
              type="button"
              className={`DashBoardTrends-tab ${activeMetric === "events" ? "is-active" : ""}`}
              onClick={() => setActiveMetric("events")}
            >
              Events
            </button>
            <button
              type="button"
              className={`DashBoardTrends-tab ${activeMetric === "inquiries" ? "is-active" : ""}`}
              onClick={() => setActiveMetric("inquiries")}
            >
              Inquiries
            </button>
            <button
              type="button"
              className={`DashBoardTrends-tab ${activeMetric === "subscribers" ? "is-active" : ""}`}
              onClick={() => setActiveMetric("subscribers")}
            >
              Subscribers
            </button>
          </div>
        </div>

        {/* Analytics Highlights Banner */}
        <div className="DashBoardTrends-highlights">
          <div className="DashBoardTrends-highlightCard">
            <span className="DashBoardTrends-highlightLabel">Total in Window</span>
            <div className="DashBoardTrends-highlightVal">
              {totalCalculated}
              <span className="DashBoardTrends-highlightBadge">
                <ArrowUpRight size={12} /> Active
              </span>
            </div>
          </div>
          <div className="DashBoardTrends-highlightCard">
            <span className="DashBoardTrends-highlightLabel">Peak Month</span>
            <div className="DashBoardTrends-highlightVal">
              {data.reduce((prev, curr) => (getMetricValue(curr, activeMetric) > getMetricValue(prev, activeMetric) ? curr : prev), data[0]).month}
              <span className="DashBoardTrends-highlightPeak">
                High Volume
              </span>
            </div>
          </div>
          <div className="DashBoardTrends-highlightCard">
            <span className="DashBoardTrends-highlightLabel">Platform Engagement</span>
            <div className="DashBoardTrends-highlightVal">
              99.8%
              <span className="DashBoardTrends-highlightStatus">
                <Sparkles size={12} /> Healthy
              </span>
            </div>
          </div>
        </div>

        {/* Visual Chart Canvas */}
        <div className="DashBoardTrends-chartWrap">
          <div className="DashBoardTrends-barsContainer">
            {data.map((item, idx) => {
              const val = getMetricValue(item, activeMetric);
              const heightPercent = maxValue > 0 ? Math.max((val / maxValue) * 100, 8) : 8;
              const isHovered = hoveredIdx === idx;

              return (
                <div
                  key={idx}
                  className={`DashBoardTrends-barCol ${isHovered ? "is-hovered" : ""}`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="DashBoardTrends-tooltip">
                      <div className="DashBoardTrends-tooltipMonth">{item.month} Analytics</div>
                      <div className="DashBoardTrends-tooltipRow">
                        <span>Selected Value:</span>
                        <strong>{val}</strong>
                      </div>
                      <div className="DashBoardTrends-tooltipDetails">
                        <div>Blogs: {item.blogs || 0}</div>
                        <div>Events: {item.events || 0}</div>
                        <div>Inquiries: {item.inquiries || 0}</div>
                        <div>Subscribers: {item.subscribers || 0}</div>
                      </div>
                    </div>
                  )}

                  <div className="DashBoardTrends-barTrack">
                    <div
                      className="DashBoardTrends-barFill"
                      style={{
                        height: `${heightPercent}%`,
                        background: currentTheme.bar,
                        boxShadow: isHovered ? `0 0 16px ${currentTheme.glow}` : "none",
                      }}
                    >
                      <span className="DashBoardTrends-barValueLabel">{val}</span>
                    </div>
                  </div>
                  <span className="DashBoardTrends-barLabel">{item.month}</span>
                </div>
              );
            })}
          </div>

          {/* Grid lines */}
          <div className="DashBoardTrends-gridLines" aria-hidden="true">
            <div className="DashBoardTrends-gridLine" />
            <div className="DashBoardTrends-gridLine" />
            <div className="DashBoardTrends-gridLine" />
            <div className="DashBoardTrends-gridLine" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardTrends;
