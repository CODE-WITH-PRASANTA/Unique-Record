import React, { useState } from "react";
import "./EventRegisterPeople.css";
import { FaBell, FaDownload, FaEllipsisV, FaRedo, FaFilePdf, FaSearch } from "react-icons/fa";

interface EventApplicant {
  id: number;
  eventName: string;
  name: string;
  sex: string;
  dob: string;
  phone: string;
  pincode: string;
  district: string;
  state: string;
  email: string;
  website: string;
  education: string;
  skill: string;
  bioData: string;
  passport: string;
  paymentId: string;
  amount: string;
  method: string;
  status: string;
  date: string;
}

const applicants: EventApplicant[] = [
  {
    id: 1,
    eventName: "Tech Conference 2025",
    name: "John Doe",
    sex: "Male",
    dob: "1998-07-15",
    phone: "9876543210",
    pincode: "110001",
    district: "Cuttack",
    state: "Odisha",
    email: "john@example.com",
    website: "www.johndoe.dev",
    education: "B.Tech CSE",
    skill: "React, Node",
    bioData: "https://example.com/biodata.pdf",
    passport: "https://example.com/passport.pdf",
    paymentId: "PAY12345",
    amount: "₹500",
    method: "UPI",
    status: "Paid",
    date: "2025-11-10",
  },
  {
    id: 2,
    eventName: "AI Workshop 2025",
    name: "Priya Singh",
    sex: "Female",
    dob: "1999-05-20",
    phone: "9876500001",
    pincode: "751001",
    district: "Bhubaneswar",
    state: "Odisha",
    email: "priya@example.com",
    website: "www.priyasingh.me",
    education: "MCA",
    skill: "Python, AI",
    bioData: "https://example.com/priya_bio.pdf",
    passport: "https://example.com/priya_pass.pdf",
    paymentId: "PAY99991",
    amount: "₹750",
    method: "Card",
    status: "Pending",
    date: "2025-11-11",
  },
];

const EventRegisterPeople: React.FC = () => {
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [notificationSent, setNotificationSent] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("All");

  const eventOptions = ["All", ...new Set(applicants.map(a => a.eventName))];

  const handleSendNotification = (id: number) => {
    if (!notificationSent.includes(id)) {
      setNotificationSent([...notificationSent, id]);
      alert(`Notification sent to applicant ID: ${id}`);
    } else {
      alert(`Notification already sent!`);
    }
  };

  const handleDelete = (id: number) => {
    alert(`Deleted applicant ID: ${id}`);
  };

  const handleDownload = (url: string, label: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = label;
    link.click();
  };

  // ✅ Filter + Search logic
  const filteredApplicants = applicants.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.phone.includes(searchTerm) ||
      a.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent =
      selectedEvent === "All" || a.eventName === selectedEvent;
    return matchesSearch && matchesEvent;
  });

  return (
    <div className="EventRegPeople-page">
      {/* 🌟 Search & Filter Bar */}
      <div className="EventRegPeople-searchBar">
        <div className="EventRegPeople-searchBox">
          <FaSearch className="EventRegPeople-searchIcon" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="EventRegPeople-filterSelect"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          {eventOptions.map((event, index) => (
            <option key={index} value={event}>
              {event}
            </option>
          ))}
        </select>
      </div>

      {/* 🌟 Cards Display */}
      <div className="EventRegPeople-wrapper">
        {filteredApplicants.length > 0 ? (
          filteredApplicants.map((a, index) => (
            <div className="EventRegPeople-card" key={a.id}>
              {/* Header */}
              <div className="EventRegPeople-header">
                <div>
                  <h3 className="EventRegPeople-title">{a.eventName}</h3>
                  <p className="EventRegPeople-id">S.No: {index + 1}</p>
                </div>

                <div className="EventRegPeople-headerActions">
                  <button className="EventRegPeople-downloadBtn">
                    <FaDownload /> Download
                  </button>
                  <div className="EventRegPeople-menuWrapper">
                    <FaEllipsisV
                      className="EventRegPeople-menuIcon"
                      onClick={() =>
                        setShowMenu(showMenu === a.id ? null : a.id)
                      }
                    />
                    {showMenu === a.id && (
                      <div className="EventRegPeople-dropdown animate-dropdown">
                        <p onClick={() => handleDelete(a.id)}>🗑 Delete</p>
                        <p onClick={() => handleDownload(a.bioData, "BioData.pdf")}>
                          <FaFilePdf /> Download Bio Data
                        </p>
                        <p onClick={() => handleDownload(a.passport, "Passport.pdf")}>
                          <FaFilePdf /> Download Passport
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="EventRegPeople-section personal">
                <h4>Personal Details</h4>
                <div className="EventRegPeople-infoGrid">
                  <div><strong>Name:</strong> {a.name}</div>
                  <div><strong>Sex:</strong> {a.sex}</div>
                  <div><strong>DOB:</strong> {a.dob}</div>
                  <div><strong>Phone:</strong> {a.phone}</div>
                  <div><strong>Email:</strong> {a.email}</div>
                  <div><strong>Website:</strong> {a.website}</div>
                </div>
              </div>

              <div className="EventRegPeople-section education">
                <h4>Address & Education</h4>
                <div className="EventRegPeople-infoGrid">
                  <div><strong>Pincode:</strong> {a.pincode}</div>
                  <div><strong>District:</strong> {a.district}</div>
                  <div><strong>State:</strong> {a.state}</div>
                  <div><strong>Education:</strong> {a.education}</div>
                  <div><strong>Skill:</strong> {a.skill}</div>
                </div>
              </div>

              <div className="EventRegPeople-section payment">
                <h4>Payment Details</h4>
                <div className="EventRegPeople-infoGrid">
                  <div><strong>Payment ID:</strong> {a.paymentId}</div>
                  <div><strong>Amount:</strong> {a.amount}</div>
                  <div><strong>Method:</strong> {a.method}</div>
                  <div><strong>Status:</strong> {a.status}</div>
                  <div><strong>Date:</strong> {a.date}</div>
                </div>
              </div>

              {/* Footer */}
              <div className="EventRegPeople-footer">
                <div className="EventRegPeople-notification">
                  <FaBell className="EventRegPeople-bellIcon" />
                  <span>
                    {notificationSent.includes(a.id)
                      ? "Notification Sent ✅"
                      : "Payment Confirmation Pending"}
                  </span>
                </div>
                <button
                  className="EventRegPeople-resendBtn"
                  onClick={() => handleSendNotification(a.id)}
                >
                  <FaRedo /> Send Again
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="EventRegPeople-noResult">No matching results found.</p>
        )}
      </div>
    </div>
  );
};

export default EventRegisterPeople;
