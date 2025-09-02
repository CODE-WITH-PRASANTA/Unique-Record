import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import AdminNotification from "../../Components/AdminNotification/AdminNotification";
import AdminTranstionHistroy from "../../Components/AdminTranstionHistroy/AdminTranstionHistroy";
import { API_URL } from "../../Api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalForms: 0,
    thisMonthForms: 0,
    monthlySales: 0,
    yearlySales: 0,
    totalCollected: 0,
    totalPricing: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ✅ Fetch all successful payments
        const paidRes = await fetch(`${API_URL}/uru/fetch-paid-uru`);
        const paidData = await paidRes.json();

        // ✅ Fetch all URUs for pricing info
        const allRes = await fetch(`${API_URL}/uru/get-all-uru`);
        const allData = await allRes.json();

        const now = new Date();
        const startOfRange = new Date();
        startOfRange.setDate(now.getDate() - 30); // last 30 days

        let totalForms = allData.length;
        let thisMonthForms = 0;   // forms filled last 30 days
        let monthlySales = 0;     // money collected last 30 days
        let yearlySales = 0;
        let totalCollected = 0;
        let totalPricing = 0;

        // ✅ Loop through paid applications
        paidData.forEach((uru) => {
          const paidDate = new Date(uru.updatedAt || uru.createdAt);
          const amount = uru.price || 0;

          totalCollected += amount;

          // Last 30 days sales + forms
          if (paidDate >= startOfRange && paidDate <= now) {
            thisMonthForms++;
            monthlySales += amount;
          }

          // Yearly sales
          if (paidDate.getFullYear() === now.getFullYear()) {
            yearlySales += amount;
          }
        });


        // ✅ Count total pricing initiated
        allData.forEach((uru) => {
          if (uru.priceUpdated) {
            totalPricing += uru.price || 0;
          }
        });

        setStats({
          totalForms,
          thisMonthForms,
          monthlySales,
          yearlySales,
          totalCollected,
          totalPricing,
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="Admin-dashboard-container">
      <div className="Admin-Total-Details-earning">
        {/* This Month Sales (forms count) */}
        <div className="Admin-card daily-Admin-card">
          <div className="Admin-card-header">This Month Sales</div>
          <div className="Admin-card-amount">
            {stats.thisMonthForms} Forms
          </div>
          <p className="Admin-card-text">Forms received this month</p>
        </div>

        {/* Monthly Sales (amount) */}
        <div className="Admin-card monthly-Admin-card">
          <div className="Admin-card-header">Monthly Sales</div>
          <div className="Admin-card-amount">₹{stats.monthlySales.toLocaleString("en-IN")}</div>
          <p className="Admin-card-text">Amount collected this month</p>
        </div>

        {/* Yearly Sales */}
        <div className="Admin-card yearly-Admin-card">
          <div className="Admin-card-header">Yearly Sales</div>
          <div className="Admin-card-amount">₹{stats.yearlySales.toLocaleString("en-IN")}</div>
          <p className="Admin-card-text">Amount collected this year</p>
        </div>

        {/* Total Forms Received */}
        <div className="Admin-card daily-Admin-card">
          <div className="Admin-card-header">Total Forms Received</div>
          <div className="Admin-card-amount">{stats.totalForms}</div>
          <p className="Admin-card-text">All-time successful forms</p>
        </div>

        {/* Total Pricing Initiated */}
        <div className="Admin-card monthly-Admin-card">
          <div className="Admin-card-header">Total Pricing Initiated</div>
          <div className="Admin-card-amount">₹{stats.totalPricing.toLocaleString("en-IN")}</div>
          <p className="Admin-card-text">Total quotations initiated</p>
        </div>

        {/* Total Collected Money */}
        <div className="Admin-card yearly-Admin-card">
          <div className="Admin-card-header">Total Collected Money</div>
          <div className="Admin-card-amount">₹{stats.totalCollected.toLocaleString("en-IN")}</div>
          <p className="Admin-card-text">All-time successful collections</p>
        </div>
      </div>

      <AdminNotification />
      <AdminTranstionHistroy />
    </div>
  );
};

export default AdminDashboard;
