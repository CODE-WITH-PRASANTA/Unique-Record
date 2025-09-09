import React, { useEffect, useState } from "react";
import "./AdminTranstionHistroy.css";
import { API_URL } from "../../Api";

const AdminTranstionHistroy = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${API_URL}/uru/fetch-paid-uru`);
        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="Admin-Transition-Container">
      {/* Header */}
      <div className="Admin-Transition-Header-Section">
        <h3 className="Admin-Transition-Title">Transaction History</h3>
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
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx._id}>
                  <td>
                    <div className="Admin-Transition-User-Info">
                      <img
                        src="https://i.ibb.co/xChL9Ls/avatar1.png"
                        alt={tx.applicantName}
                        className="Admin-Transition-Avatar"
                      />
                      {tx.applicantName}
                    </div>
                  </td>
                  <td>{tx.formCategory}</td>
                  <td>
                    {new Date(tx.updatedAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td>₹{tx.price?.toLocaleString("en-IN")}</td>
                  <td>
                    <span
                      className={`Admin-Transition-Status ${tx.paymentStatus.toLowerCase()}`}
                    >
                      {tx.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No recent transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTranstionHistroy;
