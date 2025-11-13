import React, { useState } from "react";
import "./SubScribeLetter.css";
import { FaCopy } from "react-icons/fa";

interface Subscriber {
  id: number;
  email: string;
  createdDate: string;
}

const SubScribeLetter: React.FC = () => {
  const [subscribers] = useState<Subscriber[]>([
    { id: 1, email: "rahul@example.com", createdDate: "2025-11-13" },
    { id: 2, email: "priya@gmail.com", createdDate: "2025-11-12" },
    { id: 3, email: "aman@domain.com", createdDate: "2025-11-10" },
    { id: 4, email: "sneha@outlook.com", createdDate: "2025-11-09" },
  ]);

  const handleCopyAll = () => {
    const allEmails = subscribers.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(allEmails);
    alert("✅ All emails copied successfully!");
  };

  const handleCopySingle = (email: string) => {
    navigator.clipboard.writeText(email);
    alert(`📧 ${email} copied to clipboard!`);
  };

  return (
    <div className="SubscribeLetter-container">
      <div className="SubscribeLetter-header">
        <h2>Subscribed Letters</h2>
        <button className="SubscribeLetter-copyAll" onClick={handleCopyAll}>
          📋 Copy All Emails
        </button>
      </div>

      <div className="SubscribeLetter-table">
        <div className="SubscribeLetter-tableHeader">
          <span>Sl. No.</span>
          <span>Subscribed Email</span>
          <span>Created Date</span>
          <span>Action</span>
        </div>

        {subscribers.map((subscriber, index) => (
          <div className="SubscribeLetter-tableRow" key={subscriber.id}>
            <span>#{index + 1}</span>
            <span className="SubscribeLetter-email">{subscriber.email}</span>
            <span>{subscriber.createdDate}</span>
            <button
              className="SubscribeLetter-copyBtn"
              onClick={() => handleCopySingle(subscriber.email)}
            >
              <FaCopy /> Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubScribeLetter;
