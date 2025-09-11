import React, { useEffect, useState } from "react";
import "./AdminNotification.css";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { API_URL } from "../../Api";

const AdminNotification = () => {
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [expandedMessages, setExpandedMessages] = useState({}); // ✅ Track expanded messages

  // ✅ Toggle Read More
  const toggleMessage = (id) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ✅ Fetch Data
  useEffect(() => {
    const fetchPaid = async () => {
      try {
        const res = await fetch(`${API_URL}/uru/fetch-paid-uru`);
        const data = await res.json();
        const lastFive = data.slice(-5).reverse();
        setRecentAchievements(lastFive);
      } catch (error) {
        console.error("Error fetching paid URUs:", error);
      }
    };

    const fetchExpenses = async () => {
      try {
        const res = await fetch(`${API_URL}/uru/get-all-uru`);
        const data = await res.json();

        let totalMoney = 0,
          paid = 0,
          pending = 0;

        data.forEach((uru) => {
          totalMoney += uru.price || 0;
          if (uru.paymentStatus === "Success") {
            paid += uru.price || 0;
          } else if (uru.paymentStatus === "Pending") {
            pending += uru.price || 0;
          }
        });

        setExpenseData([
          { name: "Total Money Updated", value: totalMoney, color: "#3498db" },
          { name: "Paid", value: paid, color: "#2ecc71" },
          { name: "Pending", value: pending, color: "#f1c40f" },
          { name: "Total Form Filled", value: data.length, color: "#e74c3c" },
        ]);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

  const fetchNotifications = async () => {
  try {
    const res = await fetch(`${API_URL}/freequotes`);
    const result = await res.json();
    if (result.success) {
      const sorted = result.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const latestFive = sorted.slice(0, 5); // ✅ Take recent 5
      setNotifications(latestFive);
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};


    fetchPaid();
    fetchExpenses();
    fetchNotifications();
  }, []);

  return (
    <div className="admin-notification-container">
      {/* ✅ Recent Achievements */}
    <div className="admin-card gradient-blue">
        <h3 className="admin-card-title">Recent Achievements</h3>
        <ul className="admin-list">
          {recentAchievements.length > 0 ? (
            recentAchievements.map((uru, index) => (
              <li key={uru._id} className="admin-list-item">
                <span className="admin-serial">{index + 1}.</span>
                <div className="admin-item-details">
                  <p className="admin-item-text">
                    <strong>{uru.applicantName}</strong> - #{uru.applicationNumber}
                  </p>
                  <span className="admin-price">
                    ₹{uru.price?.toLocaleString()}
                  </span>
                </div>
                <span className="admin-time">
                  {new Date(uru.updatedAt).toLocaleDateString()}
                </span>
              </li>
            ))
          ) : (
            <p className="admin-empty-text">No recent achievements found</p>
          )}
        </ul>
    </div>
    {/* ✅ Total Expenses */}
    <div className="admin-card gradient-green">
      <div className="admin-card-header">
        <h3 className="total-ex admin-card-title">Total Expenses</h3>
      </div>
      <div className="admin-chart-container">
        <ResponsiveContainer width="100%" height={500}>
          <PieChart>
            <defs>
              {/* Shadow Effect */}
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.25"/>
              </filter>
            </defs>

            <Pie
              data={expenseData}
              dataKey="value"
              nameKey="name"
              innerRadius={90}
              outerRadius={140}
              paddingAngle={4}
              labelLine={{ stroke: "#ccc", strokeWidth: 1 }}
              label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
              cx="50%"
              cy="50%"
              style={{ filter: "url(#shadow)" }}
            >
              {expenseData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#fff"
                  strokeWidth={2}
                  cursor="pointer"
                />
              ))}
            </Pie>

           <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                borderRadius: "10px",
                border: "none",
                color: "#fff",
                fontSize: "14px",
                padding: "10px 14px",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
              }}
              itemStyle={{
                color: "#fff",   // Ensures values always stay white
              }}
              labelStyle={{
                color: "#fff",   // Ensures label (like "Total Expenses") stays white
              }}
              formatter={(value) => `₹${value.toLocaleString()}`}
            />


            {/* Legend */}
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{
                fontSize: "14px",
                marginTop: "40px",
                paddingTop: "10px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    {/* ✅ Notifications */}
    <div className="admin-card gradient-purple">
        <h3 className="admin-card-title">Notifications</h3>
        <ul className="admin-list">
          {notifications.length > 0 ? (
            notifications.map((quote, index) => (
              <li key={quote._id} className="admin-list-item">
                <span className="admin-serial">{index + 1}.</span>
                <span className="admin-icon">📥</span>
                <div className="admin-item-details">
                  <p className="admin-item-text">
                    <strong>{quote.name}</strong> ({quote.phone}) <br />
                    {expandedMessages[quote._id] ? (
                      <>
                        {quote.message}
                        <span
                          className="admin-read-toggle"
                          onClick={() => toggleMessage(quote._id)}
                        >
                          {" "}Show Less
                        </span>
                      </>
                    ) : (
                      <>
                        {quote.message.length > 50
                          ? `${quote.message.slice(0, 50)}...`
                          : quote.message}
                        {quote.message.length > 50 && (
                          <span
                            className="admin-read-toggle"
                            onClick={() => toggleMessage(quote._id)}
                          >
                            {" "}Read More
                          </span>
                        )}
                      </>
                    )}
                  </p>
                  <span className="admin-time">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <p className="admin-empty-text">No new notifications</p>
          )}
        </ul>
    </div>
    </div>
  );
};

export default AdminNotification;
