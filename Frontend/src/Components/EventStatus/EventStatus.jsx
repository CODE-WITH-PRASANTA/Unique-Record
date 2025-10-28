import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import "./EventStatus.css";
import { API_URL } from "../../Api";

const EventStatus = () => {
  const [trackNumber, setTrackNumber] = useState("");
  const [trackedEvent, setTrackedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!trackNumber) return;

    setLoading(true);
    setError("");
    setTrackedEvent(null);

    // ✅ Show SweetAlert2 Timer Popup
    let timerInterval;
    Swal.fire({
      title: "Tracking your event...",
      html: "Please wait <b></b> milliseconds.",
      timer: 2000,
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });

    try {
      // Wait for timer before fetching (optional)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch(`${API_URL}/registerevent/track/${trackNumber}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError("No event found for this application number.");
        } else {
          setError("Something went wrong. Please try again later.");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setTrackedEvent({
        applicationNumber: data.applicationNumber,
        eventName: data.eventName,
        applicantName: data.applicantName,
        paymentAmount: data.amount,
        paymentId: data.paymentId,
        createdAt: data.date,
        status: data.status,
      });

      Swal.close(); // ✅ Close popup after success
      setLoading(false);
    } catch (err) {
      console.error(err);
      Swal.close();
      setError("Unable to fetch data. Check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="EventStatus-wrapper">
      {!trackedEvent && (
        <div className="EventStatus-trackBox">
          <h2>Track Your Event Application</h2>
          <p>Enter your application number sent to your email to view status.</p>
          <div className="EventStatus-trackInputGroup">
            <input
              type="text"
              placeholder="Enter Application Number"
              value={trackNumber}
              onChange={(e) => setTrackNumber(e.target.value)}
            />
            <button onClick={handleTrack} disabled={!trackNumber || loading}>
              {loading ? "Tracking..." : "Track"}
            </button>
          </div>
          {error && <p className="EventStatus-error">{error}</p>}
        </div>
      )}

      {trackedEvent && (
        <div className="EventStatus-card">
          <div className="EventStatus-header">
            <div>
              <h3 className="EventStatus-eventName">{trackedEvent.eventName}</h3>
              <p className="EventStatus-date">
                Applied on{" "}
                {new Date(trackedEvent.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="EventStatus-meta">
              <p>
                <span className="EventStatus-label">Applicant:</span>{" "}
                <b>{trackedEvent.applicantName}</b>
              </p>
              <p>
                <span className="EventStatus-label">Application Number:</span>{" "}
                {trackedEvent.applicationNumber}
              </p>
            </div>
          </div>

          <div className="EventStatus-info">
            <div className="EventStatus-info-item">
              <span className="EventStatus-label">Payment Status:</span>
              <span
                className={`EventStatus-badge ${
                  trackedEvent.status === "COMPLETED" ? "success" : "pending"
                }`}
              >
                {trackedEvent.status === "COMPLETED"
                  ? "Payment Successful"
                  : trackedEvent.status}
              </span>
            </div>

            <div className="EventStatus-info-item">
              <span className="EventStatus-label">Payment Amount:</span>
              <span className="EventStatus-value">₹{trackedEvent.paymentAmount}</span>
            </div>

            <div className="EventStatus-info-item">
              <span className="EventStatus-label">Event Verification:</span>
              <span className="EventStatus-badge success">Approved & Confirmed</span>
            </div>
          </div>

          <div className="EventStatus-timeline">
            <div className="EventStatus-step completed">
              <div className="EventStatus-circle green">
                <FaCheckCircle />
              </div>
              <p>Application Submitted</p>
            </div>

            <div className="EventStatus-line" />

            <div className="EventStatus-step completed">
              <div className="EventStatus-circle green">
                <FaCheckCircle />
              </div>
              <p>Event Verified</p>
            </div>

            <div className="EventStatus-line" />

            <div className="EventStatus-step completed">
              <div className="EventStatus-circle green">
                <FaCheckCircle />
              </div>
              <p>Payment Done</p>
            </div>
          </div>

          <div className="EventStatus-payment-success">
            <p className="success">🎉 Payment completed successfully!</p>
            <p className="EventStatus-transaction">
              Transaction ID: <b>{trackedEvent.paymentId}</b>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventStatus;
