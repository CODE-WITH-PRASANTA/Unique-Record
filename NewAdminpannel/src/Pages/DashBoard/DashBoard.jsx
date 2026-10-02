import React, { useEffect, useState } from "react";
import axios from "axios";
import DashBoardHome from "../../Componenets/DashBoardHome/DashBoardHome";
import DashBoardTrends from "../../Componenets/DashBoardTrends/DashBoardTrends";
import DashBoardSec from "../../Componenets/DashBoardSec/DashBoardSec";
import DashboardHistory from "../../Componenets/DashboardHistory/DashboardHistory";

const API_BASE_URL = "http://localhost:5000/api";

const DashBoard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/dashboard/stats`);
      if (res.data && res.data.success) {
        setAnalyticsData(res.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const stats = analyticsData?.stats || {
    totalBlogs: 3,
    totalEvents: 1,
    totalAchievements: 1,
    totalOpinions: 1,
    totalSubscribers: 1,
    totalBlogComments: 2,
    totalAchievementComments: 0,
    totalGallery: 1,
    totalRecords: 0,
    pendingOpinions: 0,
    approvedOpinions: 1,
  };

  const monthlyTrends = analyticsData?.monthlyTrends || [];
  const recentAchievements = analyticsData?.recentAchievements || [];
  const recentActivity = analyticsData?.recentActivity || [];
  const distribution = analyticsData?.distribution || [];
  const recentSubmissions = analyticsData?.recentSubmissions || [];
  const totalContent = stats.totalContent || 8;

  return (
    <div style={{ minHeight: "100%", background: "#eef1f8" }}>
      {/* Overview Stat Cards with Count-Up Animations */}
      <DashBoardHome
        title="Unique Records Admin Control"
        subtitle="Real-time ecosystem analytics, performance indicators, and audience engagement"
        statsData={stats}
      />

      {/* Interactive Activity & Growth Trends Graphs */}
      <DashBoardTrends
        monthlyData={monthlyTrends}
        summaryStats={stats}
      />

      {/* Visual Donut Chart, Achievements and Activity Feed */}
      <DashBoardSec
        achievementsList={recentAchievements}
        recentActivityList={recentActivity}
        distributionSegments={distribution}
        totalItemsCount={totalContent}
      />

      {/* Interactive Submissions, Inquiries & Subscriptions Table */}
      <DashboardHistory
        submissions={recentSubmissions}
        title="Live Inquiries & Community Submissions"
        onRefresh={fetchDashboardStats}
      />
    </div>
  );
};

export default DashBoard;