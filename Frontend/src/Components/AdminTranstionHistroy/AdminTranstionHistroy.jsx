import React from "react";
import "./AdminTranstionHistroy.css";

const AdminTranstionHistroy = () => {
  const transactions = [
    {
      id: 1,
      user: "Airi Satou",
      avatar: "https://i.ibb.co/xChL9Ls/avatar1.png",
      category: "Salary Payment",
      datetime: "2023/02/07 09:05 PM",
      amount: "₹950.54",
      status: "Completed",
    },
    {
      id: 2,
      user: "Ashton Cox",
      avatar: "https://i.ibb.co/xChL9Ls/avatar1.png",
      category: "Project Payment",
      datetime: "2023/02/01 02:14 PM",
      amount: "₹520.30",
      status: "Completed",
    },
    {
      id: 3,
      user: "Bradley Greer",
      avatar: "https://i.ibb.co/xChL9Ls/avatar1.png",
      category: "You Tube Subscribe",
      datetime: "2023/01/22 10:32 AM",
      amount: "₹100.00",
      status: "Pending",
    },
    {
      id: 4,
      user: "Brielle Williamson",
      avatar: "https://i.ibb.co/xChL9Ls/avatar1.png",
      category: "Salary Payment",
      datetime: "2023/02/07 09:05 PM",
      amount: "₹760.25",
      status: "In Progress",
    },
    {
      id: 5,
      user: "Airi Satou",
      avatar: "https://i.ibb.co/xChL9Ls/avatar1.png",
      category: "Spotify Subscribe",
      datetime: "2023/02/07 09:05 PM",
      amount: "₹60.05",
      status: "Canceled",
    },
  ];

  return (
    <div className="Admin-Transition-Container">
      {/* Header */}
      <div className="Admin-Transition-Header-Section">
        <h3 className="Admin-Transition-Title">Transaction History</h3>
        <a href="/" className="Admin-Transition-View-All">View All</a>
      </div>

      {/* Table Section */}
      <div className="Admin-Transition-Table-Section">
        <table className="Admin-Transition-Table">
          <thead>
            <tr>
              <th>USER NAME</th>
              <th>CATEGORY</th>
              <th>DATE/TIME</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>
                  <div className="Admin-Transition-User-Info">
                    <img
                      src={tx.avatar}
                      alt={tx.user}
                      className="Admin-Transition-Avatar"
                    />
                    {tx.user}
                  </div>
                </td>
                <td>{tx.category}</td>
                <td>{tx.datetime}</td>
                <td>{tx.amount}</td>
                <td>
                  <span
                    className={`Admin-Transition-Status ${tx.status
                      .replace(" ", "")
                      .toLowerCase()}`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTranstionHistroy;
