import React, { useState } from "react";
import "./DonationManage.css";
import { FaEllipsisV } from "react-icons/fa";

interface Donation {
  id: number;
  paymentNumber: string;
  name: string;
  phone: string;
  email: string;
  amount: string;
  certificate: string;
  address: string;
  extraInfo: string;
  date: string;
}

const DonationManage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [published, setPublished] = useState<Record<number, boolean>>({});

  const donations: Donation[] = [
    {
      id: 1,
      paymentNumber: "PAY12345",
      name: "Rahul Sharma",
      phone: "9876543210",
      email: "rahul@example.com",
      amount: "₹1000",
      certificate: "Yes",
      address: "Bhubaneswar, Odisha",
      extraInfo: "For education support",
      date: "2025-11-13",
    },
    {
      id: 2,
      paymentNumber: "PAY67890",
      name: "Priya Verma",
      phone: "9123456789",
      email: "priya@example.com",
      amount: "₹1500",
      certificate: "No",
      address: "Cuttack, Odisha",
      extraInfo: "Helping needy children",
      date: "2025-11-10",
    },
    {
      id: 3,
      paymentNumber: "PAY33456",
      name: "Aman Gupta",
      phone: "9998887777",
      email: "aman@example.com",
      amount: "₹2500",
      certificate: "Yes",
      address: "Puri, Odisha",
      extraInfo: "Temple donation",
      date: "2025-11-08",
    },
  ];

  const filteredDonations = donations.filter(
    (donation) =>
      donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.phone.includes(searchTerm)
  );

  const toggleMenu = (id: number) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  const handlePublishToggle = (id: number) => {
    setPublished((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    setMenuOpenId(null);
  };

  const handleDelete = (id: number) => {
    alert(`Donation ID ${id} deleted!`);
    setMenuOpenId(null);
  };

  return (
    <div className="DonationManage-container">
      <h2 className="DonationManage-title">Donation Management</h2>

      {/* Search Bar */}
      <div className="DonationManage-search">
        <input
          type="text"
          placeholder="🔍 Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid Layout */}
      <div className="DonationManage-grid">
        {filteredDonations.map((donation, index) => (
          <div
            key={donation.id}
            className={`DonationManage-card ${
              published[donation.id] ? "published" : "unpublished"
            }`}
          >
            <div className="DonationManage-header">
              <span className="DonationManage-slno">#{index + 1}</span>
              <span className="DonationManage-name">{donation.name}</span>
              <div className="DonationManage-menu">
                <FaEllipsisV
                  className="DonationManage-menuIcon"
                  onClick={() => toggleMenu(donation.id)}
                />
                <div
                  className={`DonationManage-dropdown ${
                    menuOpenId === donation.id ? "show" : ""
                  }`}
                >
                  <p onClick={() => handleDelete(donation.id)}>🗑 Delete</p>
                  <p onClick={() => handlePublishToggle(donation.id)}>
                    {published[donation.id] ? "🚫 Unpublish" : "✅ Publish"}
                  </p>
                </div>
              </div>
            </div>

            <div className="DonationManage-divider"></div>

            <div className="DonationManage-details">
              <div className="DonationManage-row">
                <p>
                  <strong>Payment No:</strong> {donation.paymentNumber}
                </p>
                <p>
                  <strong>Amount:</strong> {donation.amount}
                </p>
              </div>
              <div className="DonationManage-row">
                <p>
                  <strong>Phone:</strong> {donation.phone}
                </p>
                <p>
                  <strong>Email:</strong> {donation.email}
                </p>
              </div>
              <p>
                <strong>Address:</strong> {donation.address}
              </p>
              <p>
                <strong>Extra Info:</strong> {donation.extraInfo}
              </p>
              <p>
                <strong>Certificate:</strong> {donation.certificate}
              </p>
              <p>
                <strong>Date:</strong> {donation.date}
              </p>
            </div>

            <div
              className={`DonationManage-status ${
                published[donation.id] ? "active" : "inactive"
              }`}
            >
              {published[donation.id] ? "Published" : "Unpublished"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationManage;
