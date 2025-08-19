import React from "react";
import "./AdminDashboard.css";
import AdminNotification from "../../Components/AdminNotification/AdminNotification";
import AdminTranstionHistroy from "../../Components/AdminTranstionHistroy/AdminTranstionHistroy";

const AdminDashboard = () => {
  return (
    <div className="Admin-dashboard-container">
      {/* Daily Sales */}
      <div className="Admin-card daily-Admin-card">
        <div className="Admin-card-header">This Month Sales</div>
        <div className="Admin-card-amount">
          5 Form <span className="percent green">36%</span>
        </div>
        <p className="Admin-card-text">You made an extra 1 Form this Month</p>
        <div className="progress-bar">
          <div className="progress-fill green-fill" style={{ width: "70%" }}></div>
        </div>
      </div>

      {/* Monthly Sales */}
      <div className="Admin-card monthly-Admin-card">
        <div className="Admin-card-header">Monthly Sales </div>
        <div className="Admin-card-amount">
          ₹249.95 <span className="percent blue">20%</span>
        </div>
        <p className="Admin-card-text">You made an extra 150 this Monthly</p>
        <div className="progress-bar">
          <div className="progress-fill blue-fill" style={{ width: "50%" }}></div>
        </div>
      </div>

      {/* Yearly Sales */}
      <div className="Admin-card yearly-Admin-card">
        <div className="Admin-card-header">Yearly Sales</div>
        <div className="Admin-card-amount">₹25549.95</div>
        <p className="Admin-card-text">You made an extra 35,000 this Yearly</p>
        <div className="progress-bar">
          <div className="progress-fill white-fill" style={{ width: "90%" }}></div>
        </div>
      </div>

      <AdminNotification />
      <AdminTranstionHistroy />
    </div>
  );
};

export default AdminDashboard;
