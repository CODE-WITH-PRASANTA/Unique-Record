import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ApproveURU.css";
import { API_URL } from "../../Api";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";


const ApproveURU = () => {
  const [urus, setUrus] = useState([]);
  const [filteredUrus, setFilteredUrus] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [prices, setPrices] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // New states for reminders
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [reminderMessage, setReminderMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchApprovedUrus = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/uru/fetch-approved-uru`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUrus(response.data);
        setFilteredUrus(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApprovedUrus();
  }, []);

  useEffect(() => {
    const filtered = urus.filter((uru) => {
      if (!filterStatus) return true;
      return uru.paymentStatus === filterStatus;
    });
    setFilteredUrus(filtered);
  }, [filterStatus, urus]);

  const handlePriceChange = (applicationNumber, newPrice) => {
    if (!isNaN(newPrice)) {
      setPrices((prevPrices) => ({
        ...prevPrices,
        [applicationNumber]: newPrice,
      }));
    }
  };

  const handleSubmit = async (applicationNumber) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/uru/update-price`,
        {
          applicationNumber,
          price: prices[applicationNumber],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUrus((prevUrus) =>
        prevUrus.map((uru) =>
          uru.applicationNumber === applicationNumber
            ? {
                ...uru,
                priceUpdated: true,
                price: prices[applicationNumber],
              }
            : uru
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

const handleGivePaidApprove = async (id) => {
  const token = localStorage.getItem("token");

  // ✅ Confirm before marking as paid
  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "You’re marking this applicant as 'Paid'. This will mark their payment as successful even if no payment was made.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#27ae60",
    cancelButtonColor: "#e74c3c",
    confirmButtonText: "Yes, mark as Paid",
    cancelButtonText: "Cancel",
  });

  if (!confirm.isConfirmed) return;

  try {
    const response = await axios.put(
      `${API_URL}/uru/give-paid-approve/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // ✅ Sweet success message
    Swal.fire({
      icon: "success",
      title: "Marked as Paid!",
      text: response.data?.message || "Payment status updated successfully.",
      confirmButtonColor: "#27ae60",
    });

    // ✅ Update local state
    setUrus((prev) =>
      prev.map((u) =>
        u._id === id ? { ...u, status: "Paid", paymentStatus: "Success" } : u
      )
    );
  } catch (err) {
    console.error(err);

    Swal.fire({
      icon: "error",
      title: "Failed to Update",
      text: "Could not mark as Paid. Please try again later.",
      confirmButtonColor: "#e74c3c",
    });
  }
};



  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUrus);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "URUs");
    XLSX.writeFile(
      workbook,
      `URUs_${new Date().toLocaleDateString("en-GB")}.xlsx`
    );
  };

  const handleSendReminders = async () => {
    try {
      setIsSendingReminder(true);
      setReminderMessage("");
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/uru/send-reminders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReminderMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setReminderMessage("❌ Failed to send reminders. Try again.");
    } finally {
      setIsSendingReminder(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="Approve-URU-container">
      <h2 className="Approve-URU-title">Approve URU</h2>

      <div className="filter-container">
        <select
          value={filterStatus}
          onChange={handleFilterChange}
          className="filter-status-select"
        >
          <option value="">All</option>
          <option value="Success">Success</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>

        <div className="action-buttons">
          <button className="download-excel-btn" onClick={handleDownloadExcel}>
            Download Excel
          </button>
          <button
            className="send-reminder-btn"
            onClick={handleSendReminders}
            disabled={isSendingReminder}
          >
            {isSendingReminder ? "Sending..." : "Send Reminder"}
          </button>
        </div>
      </div>

      {reminderMessage && (
        <div
          style={{
            marginTop: "10px",
            color: reminderMessage.startsWith("❌") ? "red" : "green",
          }}
        >
          {reminderMessage}
        </div>
      )}

      <div className="Approve-URU-table-container">
        <table className="Approve-URU-table">
          <thead>
            <tr>
              <th className="Approve-URU-table-header">Serial No.</th>
              <th className="Approve-URU-table-header">Application Number</th>
              <th className="Approve-URU-table-header">Application Date</th>
              <th className="Approve-URU-table-header">Name</th>
              <th className="Approve-URU-table-header">Updated Price</th>
              <th className="Approve-URU-table-header">Transaction ID</th>
              <th className="Approve-URU-table-header">Payment Status</th>
              <th className="Approve-URU-table-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUrus
              .slice()
              .reverse()
              .map((uru) => (
                <tr key={uru.applicationNumber}>
                  <td className="Approve-URU-table-data">
                    {urus.findIndex(
                      (u) =>
                        u.applicationNumber === uru.applicationNumber
                    ) + 1}
                  </td>
                  <td className="Approve-URU-table-data">
                    {uru.applicationNumber}
                  </td>
                  <td className="Approve-URU-table-data">
                    {uru.createdAt
                      ? new Date(uru.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="Approve-URU-table-data">
                    {uru.applicantName}
                  </td>
                  <td className="Approve-URU-table-data">
                    {uru.priceUpdated ? (
                      <span style={{ color: "green" }}>₹ {uru.price}</span>
                    ) : (
                      <input
                        type="number"
                        value={prices[uru.applicationNumber] || uru.price}
                        onChange={(e) =>
                          handlePriceChange(
                            uru.applicationNumber,
                            parseInt(e.target.value)
                          )
                        }
                        className="Approve-URU-price-input"
                      />
                    )}
                  </td>
                  <td className="Approve-URU-table-data">
                    {uru.razorpayPaymentId ? (
                      <span style={{ color: "green" }}>
                        {uru.razorpayPaymentId}
                      </span>
                    ) : (
                      <span>N/A</span>
                    )}
                  </td>
                  <td className="Approve-URU-table-data">
                    {uru.paymentStatus}
                  </td>
                <td className="Approve-URU-table-data">
                  {uru.priceUpdated ? (
                    <span style={{ color: "green" }}>Price Updated</span>
                  ) : (
                    <button
                      className="Approve-URU-submit-btn"
                      onClick={() => handleSubmit(uru.applicationNumber)}
                    >
                      Submit
                    </button>
                  )}

                  {/* ✅ New Give Paid Approve Button */}
                  <button
                    className="Approve-URU-paid-btn"
                    onClick={() => handleGivePaidApprove(uru._id)}
                  >
                    Paid Approve
                  </button>
                </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApproveURU;
