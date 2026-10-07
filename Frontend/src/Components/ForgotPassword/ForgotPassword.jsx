import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Api";
import "./ForgotPassword.css";
import RightSideCompanyLogo from "../../assets/UNQUE.png";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Reusable SweetAlert
  const showAlert = (title, message, type = "success") => {
    let timerInterval;
    Swal.fire({
      title,
      html: `${message} <br/><br/>Closing in <b></b> ms.`,
      icon: type,
      timer: 3000,
      timerProgressBar: true,
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
  };

  const handleSubmitEmail = async () => {
    if (!formData.email) {
      showAlert("Required", "Please enter your registered email address", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/forgot-password/forgot-password`, {
        email: formData.email,
      });
      showAlert("OTP Sent!", res.data.message, "success");
      // Keep OTP empty so user manually types from their email
      setFormData((prev) => ({ ...prev, otp: "" }));
      setStep(2);
    } catch (err) {
      showAlert("Error!", err.response?.data?.message || "Failed to send OTP", "error");
    }
    setLoading(false);
  };

  const handleSubmitOtp = async () => {
    if (!formData.otp) {
      showAlert("Required", "Please enter the 6-digit OTP code", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/forgot-password/verify-otp`, {
        email: formData.email,
        otp: formData.otp,
      });
      showAlert("OTP Verified!", res.data.message, "success");
      setStep(3);
    } catch (err) {
      showAlert("Invalid OTP", err.response?.data?.message || "Please check the OTP and try again", "error");
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      showAlert("Required", "Please fill in all password fields", "warning");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showAlert("Error", "Passwords do not match", "error");
      return;
    }

    if (formData.newPassword.length < 4) {
      showAlert("Error", "Password must be at least 4 characters long", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/forgot-password/reset-password`, {
        email: formData.email,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      Swal.fire({
        title: "Success! 🎉",
        text: res.data.message || "Password reset successfully! Redirecting to login...",
        icon: "success",
        timer: 2500,
        showConfirmButton: true,
        confirmButtonText: "Go to Login",
      }).then(() => {
        navigate("/login");
      });

      setStep(1);
      setFormData({ email: "", otp: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showAlert("Error", err.response?.data?.message || "Error resetting password", "error");
    }
    setLoading(false);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-left-section">
        <h2 className="forgot-password-welcome-text">Welcome To</h2>
        <h1 className="forgot-password-title">
          Our <span className="forgot-password-brand">URU</span>
        </h1>
        <p className="forgot-password-description">
          Reset your password securely and continue your journey with Unique Records of Universe.
        </p>
      </div>

      <div className="forgot-password-right-section">
        <img
          src={RightSideCompanyLogo}
          alt="Company Logo"
          className="forgot-password-company-logo"
        />

        <div className="forgot-password-form-container">
          {step === 1 && (
            <>
              <h2 className="forgot-password-heading">Enter Your Email</h2>
              <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "15px", textAlign: "center" }}>
                Enter your registered email to receive a 6-digit verification code.
              </p>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Email Address"
                className="forgot-password-input"
                onChange={handleChange}
                required
              />
              <button
                className="forgot-password-button"
                onClick={handleSubmitEmail}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
              <div style={{ marginTop: "15px", textAlign: "center" }}>
                <Link to="/login" style={{ color: "#3b82f6", fontSize: "14px", textDecoration: "none" }}>
                  ← Back to Login
                </Link>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="forgot-password-heading">Enter 6-Digit OTP</h2>
              <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "15px", textAlign: "center" }}>
                We sent a verification code to <b>{formData.email}</b>
              </p>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="forgot-password-input"
                onChange={handleChange}
                required
              />
              <button
                className="forgot-password-button"
                onClick={handleSubmitOtp}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span
                  onClick={() => setStep(1)}
                  style={{ color: "#64748b", cursor: "pointer" }}
                >
                  ← Change Email
                </span>
                <span
                  onClick={handleSubmitEmail}
                  style={{ color: "#3b82f6", cursor: "pointer", fontWeight: "600" }}
                >
                  Resend OTP
                </span>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="forgot-password-heading">Set New Password</h2>
              <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "15px", textAlign: "center" }}>
                Enter your new password below.
              </p>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                placeholder="New Password"
                className="forgot-password-input"
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                placeholder="Confirm New Password"
                className="forgot-password-input"
                onChange={handleChange}
                required
              />
              <button
                className="forgot-password-button"
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save & Login"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
