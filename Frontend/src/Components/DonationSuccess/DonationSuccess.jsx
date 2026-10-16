import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Api";
import logo from "../../assets/UNQUE.png";
import { generateDonationPdf, fetchLogoBase64 } from "./donationPdfGenerator";
import "./DonationSuccess.css";

const DonationSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeParams = useParams();
  const printRef = useRef();

  // URL query params or route params
  const urlPaymentId =
    searchParams.get("paymentNumber") ||
    searchParams.get("receipt") ||
    searchParams.get("id") ||
    routeParams.paymentNumber ||
    "";
  const shouldAutoDownload =
    searchParams.get("download") === "pdf" ||
    searchParams.get("download") === "true";

  const [donationData, setDonationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [logoBase64, setLogoBase64] = useState("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [hasAutoDownloaded, setHasAutoDownloaded] = useState(false);
  const [lookupInput, setLookupInput] = useState("");

  // Pre-load logo as base64 for pure vector PDF generation
  useEffect(() => {
    let isMounted = true;
    fetchLogoBase64(logo).then((b64) => {
      if (isMounted) setLogoBase64(b64);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch or initialize donation data
  useEffect(() => {
    // 1. If routed with state from form submission
    if (state && (state.amount || state.name)) {
      setDonationData({
        name: state.name || "Valued Donor",
        amount: state.amount,
        paymentId: state.paymentId || "N/A",
        orderId: state.orderId || "N/A",
        paymentNumber: state.paymentNumber || state.paymentId || "DON-PENDING",
        certificate: state.certificate || "No",
        panNumber: state.panNumber || "",
        email: state.email || "",
        phone: state.phone || "",
        address: state.address || "",
        date: state.date || new Date().toLocaleDateString("en-IN"),
        paymentMethod: state.paymentMethod || "Razorpay Online Checkout",
        extra: state.extra || "Spiritual & Social Development Donation",
      });
      return;
    }

    // 2. If accessed via link with paymentNumber / receipt ID in URL
    if (urlPaymentId) {
      fetchDonationRecord(urlPaymentId);
    }
  }, [state, urlPaymentId]);

  // Fetch single donation record from server API
  const fetchDonationRecord = async (idToFetch) => {
    if (!idToFetch) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.get(`${API_URL}/donation/${idToFetch.trim()}`);
      if (res.data?.success && res.data.data) {
        const d = res.data.data;
        const formatted = {
          name: d.name || "Valued Donor",
          amount: d.amount,
          paymentId: d.razorpayPaymentId || d.paymentNumber,
          orderId: d.razorpayOrderId || "N/A",
          paymentNumber: d.paymentNumber,
          certificate: d.certificate || "No",
          panNumber: d.panNumber || "",
          email: d.email || "",
          phone: d.phone || "",
          address: d.address || "",
          extra: d.extra || "Spiritual & Social Development Donation",
          paymentMethod: d.paymentMethod || "Razorpay Online Checkout",
          date: new Date(d.paidAt || d.createdAt || Date.now()).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        };
        setDonationData(formatted);
      } else {
        setErrorMsg("Donation receipt not found. Please verify the receipt number.");
      }
    } catch (err) {
      console.error("Error fetching donation receipt:", err);
      setErrorMsg(
        err.response?.data?.message ||
          "Could not find donation receipt. Please verify your reference number."
      );
    } finally {
      setLoading(false);
    }
  };

  // Auto-download PDF if URL contains download=pdf
  useEffect(() => {
    if (
      shouldAutoDownload &&
      donationData &&
      logoBase64 &&
      !hasAutoDownloaded &&
      !isGeneratingPdf
    ) {
      setHasAutoDownloaded(true);
      handleDownloadPdf();
    }
  }, [shouldAutoDownload, donationData, logoBase64, hasAutoDownloaded, isGeneratingPdf]);

  // PDF Download Handler
  const handleDownloadPdf = async () => {
    if (!donationData) return;
    try {
      setIsGeneratingPdf(true);
      const b64 = logoBase64 || (await fetchLogoBase64(logo));
      generateDonationPdf(donationData, b64);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF receipt. You can also use the Print button.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleManualLookup = (e) => {
    e.preventDefault();
    if (lookupInput.trim()) {
      fetchDonationRecord(lookupInput.trim());
    }
  };

  // State: Loading
  if (loading) {
    return (
      <div className="donation-success-container">
        <div className="donation-success-card" style={{ padding: "60px 20px", textAlign: "center" }}>
          <img src={logo} alt="Logo" className="donation-success-logo" />
          <h2 className="donation-success-heading">Loading Payment Receipt...</h2>
          <p style={{ color: "#64748b", fontSize: "15px", marginTop: "12px" }}>
            Fetching authentic donation details from Unique Record of Universe server.
          </p>
          <div className="donation-receipt-spinner" style={{ margin: "24px auto" }}></div>
        </div>
      </div>
    );
  }

  // State: No Receipt Found or No State & No URL Params
  if (!donationData) {
    return (
      <div className="donation-success-container">
        <div className="donation-success-wrapper">
          <div className="donation-success-card" style={{ padding: "40px 24px", textAlign: "center", maxWidth: "600px" }}>
            <img src={logo} alt="Logo" className="donation-success-logo" />
            <h2 className="donation-success-heading">Unique Record Of Universe</h2>
            <h3 className="donation-success-title" style={{ marginTop: 10, color: "#1e3a8a" }}>
              Donation Payment Receipt Lookup
            </h3>

            {errorMsg ? (
              <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "12px", borderRadius: "8px", margin: "16px 0", fontSize: "14px" }}>
                ⚠️ {errorMsg}
              </div>
            ) : (
              <p style={{ marginTop: 12, color: "#64748b", fontSize: 15 }}>
                Enter your Receipt Number (e.g. <strong>DON26273763</strong>) or Razorpay Transaction ID to view and download your official receipt.
              </p>
            )}

            <form onSubmit={handleManualLookup} style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
              <input
                type="text"
                placeholder="Enter Receipt or Payment ID..."
                value={lookupInput}
                onChange={(e) => setLookupInput(e.target.value)}
                style={{
                  padding: "12px 16px",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: "8px",
                  fontSize: "15px",
                  width: "100%",
                  maxWidth: "340px",
                  outline: "none",
                }}
                required
              />
              <button
                type="submit"
                style={{
                  padding: "12px 20px",
                  backgroundColor: "#1e3a8a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Find Receipt
              </button>
            </form>

            <div className="donation-success-buttons" style={{ marginTop: 28, justifyContent: "center", gap: "16px" }}>
              <button className="donation-success-download-btn" onClick={() => navigate("/donate")}>
                💝 Make a Donation
              </button>
              <button className="donation-success-home-btn" onClick={() => navigate("/")}>
                🏠 Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    name,
    amount,
    paymentId,
    paymentNumber,
    certificate,
    panNumber,
    email,
    phone,
    address,
    date,
    paymentMethod,
  } = donationData;

  return (
    <div className="donation-success-container">
      <div className="donation-success-wrapper" ref={printRef}>
        <div className="donation-success-card">
          <img src={logo} alt="Logo" className="donation-success-logo" />
          <h2 className="donation-success-heading">Unique Record Of Universe</h2>
          <p className="donation-success-description">
            <strong>Digitally Marking The Extraordinary Achievement</strong>
          </p>
          <h3 className="donation-success-title">Official Donation Payment Receipt</h3>

          <div className="donation-success-receipt-container">
            <p className="donation-success-top-text">
              Receipt No: <strong>{paymentNumber || paymentId || "N/A"}</strong>
            </p>

            <div className="donation-success-receipt-box">
              <div className="donation-success-receipt-header">
                <span>
                  <strong>Receipt / Ref ID:</strong> {paymentNumber || "N/A"}
                </span>
                <span>
                  <strong>Transaction ID:</strong> {paymentId || "N/A"}
                </span>
              </div>

              <div className="donation-success-info-section">
                <div className="donation-success-to">
                  <p>
                    <strong>Donor Details:</strong>
                  </p>
                  <p style={{ fontSize: "16px", color: "#1e3a8a" }}>
                    <strong>{name || "N/A"}</strong>
                  </p>
                  {address && <p>{address}</p>}
                  <p>{email || "N/A"}</p>
                  <p>Phone: {phone || "N/A"}</p>
                  {certificate === "Yes" && (
                    <p style={{ color: "#10b981", fontWeight: 600, marginTop: 4 }}>
                      ✓ 80G Tax Exemption Applied {panNumber ? `(PAN: ${panNumber})` : ""}
                    </p>
                  )}
                </div>

                <div className="donation-success-from">
                  <p>
                    <strong>Trust Organization:</strong>
                  </p>
                  <p style={{ fontWeight: 600, color: "#0f172a" }}>
                    Divya Prerak Kahaniya Humanity Research Centre Trust
                  </p>
                  <p>Thekma, District-Azamgarh (Uttar Pradesh) - 276303</p>
                  <p>Email: uruonline2025@gmail.com</p>
                  <p>Phone: +91 9472351693</p>
                </div>
              </div>

              <table className="donation-success-table">
                <thead>
                  <tr>
                    <th>Receipt No.</th>
                    <th>Donor Name</th>
                    <th>Date</th>
                    <th>Total Amount</th>
                    <th>Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{paymentNumber || paymentId || "N/A"}</td>
                    <td>{name || "N/A"}</td>
                    <td>{date || new Date().toLocaleDateString("en-IN")}</td>
                    <td style={{ fontWeight: "bold", color: "#059669" }}>
                      ₹{Number(amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td>{paymentMethod || "Razorpay Online Checkout"}</td>
                  </tr>
                </tbody>
              </table>

              <div className="donation-success-subtotal">
                <span>
                  <strong>Subtotal Contribution Paid</strong>
                </span>
                <span style={{ fontSize: "18px", color: "#059669", fontWeight: "bold" }}>
                  ₹{Number(amount || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          <p className="donation-success-thank-you">🙏 Thank you for your generous contribution to humanity service! 🙏</p>
        </div>

        {/* Action Buttons: Download PDF, Print, Home */}
        <div className="donation-success-buttons">
          <button
            type="button"
            className="donation-success-download-pdf-btn"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
          >
            {isGeneratingPdf ? (
              <span>⏳ Preparing PDF...</span>
            ) : (
              <span>⬇️ Download PDF Receipt</span>
            )}
          </button>

          <button
            type="button"
            className="donation-success-print-btn"
            onClick={handlePrint}
          >
            🖨️ Print Receipt
          </button>

          <button
            type="button"
            className="donation-success-home-btn"
            onClick={() => navigate("/")}
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccess;
