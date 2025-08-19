import React from "react";
import "./AdminNotification.css";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const AdminNotification = () => {
  const expenseData = [
    { name: "Pending", value: 3202, color: "#F5C71A" }, // Yellow
    { name: "Paid", value: 45050, color: "#1ABC9C" },   // Green
    { name: "Overdue", value: 25000, color: "#E74C3C" }, // Red
    { name: "Draft", value: 7694, color: "#5DADE2" },   // Blue
  ];

  return (
    <div className="Admin-Notification-Container">
      {/* Recent Invoice */}
      <div className="Admin-Notification-Invoice-Card">
        <h3 className="Admin-Notification-Card-Title">Recent Achivment</h3>
        <ul className="Admin-Notification-Invoice-List">
          <li>
            <img src="https://i.pravatar.cc/40?img=1" alt="avatar" />
            <div>
              <p><strong>David Jones</strong> - #790841</p>
              <span className="Admin-Notification-Price">₹329.20</span>
            </div>
            <span className="Admin-Notification-Time">5 min ago</span>
          </li>
          <li>
            <img src="https://i.pravatar.cc/40?img=2" alt="avatar" />
            <div>
              <p><strong>Jenny Jones</strong> - #790841</p>
              <span className="Admin-Notification-Price">₹329.20</span>
            </div>
            <span className="Admin-Notification-Time">1 day ago</span>
          </li>
          <li>
            <img src="https://i.pravatar.cc/40?img=3" alt="avatar" />
            <div>
              <p><strong>Harry Ben</strong> - #790841</p>
              <span className="Admin-Notification-Price">₹329.20</span>
            </div>
            <span className="Admin-Notification-Time">3 week ago</span>
          </li>
          <li>
            <img src="https://i.pravatar.cc/40?img=4" alt="avatar" />
            <div>
              <p><strong>Jenifer Vintage</strong> - #790841</p>
              <span className="Admin-Notification-Price">₹329.20</span>
            </div>
            <span className="Admin-Notification-Time">3 week ago</span>
          </li>
          <li>
            <img src="https://i.pravatar.cc/40?img=5" alt="avatar" />
            <div>
              <p><strong>Stebin Ben</strong> - #790841</p>
              <span className="Admin-Notification-Price">₹329.20</span>
            </div>
            <span className="Admin-Notification-Time">1 month ago</span>
          </li>
        </ul>
        <button className="Admin-Notification-View-Button">View All</button>
      </div>

      {/* Total Expenses */}
      <div className="Admin-Notification-Expense-Card">
        <h3 className="Admin-Notification-Card-Title">Total Expenses</h3>
        <div className="Admin-Notification-Chart-Container">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={expenseData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-₹{index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="Admin-Notification-Legend">
          {expenseData.map((item, index) => (
            <li key={index}>
              <span className="Admin-Notification-Dot" style={{ background: item.color }}></span>
              {item.name} <span className="Admin-Notification-Amount">₹{item.value.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Notifications */}
      <div className="Admin-Notification-Notification-Card">
        <h3 className="Admin-Notification-Card-Title">Notifications</h3>
        <ul className="Admin-Notification-Notification-List">
          <li>
            <span className="Admin-Notification-Icon green">📥</span>
            <div>
              <p>Johnny sent you an invoice billed <span className="Admin-Notification-Highlight">₹1,000.</span></p>
              <span className="Admin-Notification-Time">2 August</span>
            </div>
          </li>
          <li>
            <span className="Admin-Notification-Icon blue">📄</span>
            <div>
              <p>Sent an invoice to Aida Bugg amount of <span className="Admin-Notification-Highlight">₹200.</span></p>
              <span className="Admin-Notification-Time">7 hours ago</span>
            </div>
          </li>
          <li>
            <span className="Admin-Notification-Icon red">⚙️</span>
            <div>
              <p>There was a failure to your setup</p>
              <span className="Admin-Notification-Time">7 hours ago</span>
            </div>
          </li>
          <li>
            <span className="Admin-Notification-Icon gray">C</span>
            <div>
              <p>Cristina danny invited you to join Meeting</p>
              <span className="Admin-Notification-Time">7 hours ago</span>
            </div>
          </li>
          <li>
            <span className="Admin-Notification-Icon gray">C</span>
            <div>
              <p>Cristina danny invited you to join Meeting</p>
              <span className="Admin-Notification-Time">7 hours ago</span>
            </div>
          </li>
        </ul>
        <button className="Admin-Notification-View-Button">View All</button>
      </div>
    </div>
  );
};

export default AdminNotification;