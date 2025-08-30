import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../Api";
import "./ForgotPassword.css";
import RightSideCompanyLogo from "../../assets/UNQUE.png";
import Swal from "sweetalert2";

const ForgotPassword = () => {
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
      timer: 2000,
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
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/forgot-password/forgot-password`, {
        email: formData.email,
      });
      showAlert("OTP Sent!", res.data.message, "success");
      setStep(2);
    } catch (err) {
      showAlert("Error!", err.response?.data?.message || "Something went wrong", "error");
    }
    setLoading(false);
  };

  const handleSubmitOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/forgot-password/verify-otp`, {
        email: formData.email,
        otp: formData.otp,
      });
      showAlert("OTP Verified!", res.data.message, "success");
      setStep(3);
    } catch (err) {
      showAlert("Invalid OTP", err.response?.data?.message || "Try again", "error");
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      if (formData.newPassword !== formData.confirmPassword) {
        showAlert("Error", "Passwords do not match", "error");
        setLoading(false);
        return;
      }
      const res = await axios.post(`${API_URL}/forgot-password/reset-password`, {
        email: formData.email,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      showAlert("Success!", res.data.message, "success");
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
          Reset your password securely and continue your journey with Xmee.
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
              <input
                type="email"
                name="email"
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
                {loading ? "Sending..." : "Submit"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="forgot-password-heading">Enter OTP</h2>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
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
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="forgot-password-heading">Reset Password</h2>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                className="forgot-password-input"
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="forgot-password-input"
                onChange={handleChange}
                required
              />
              <button
                className="forgot-password-button"
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Password"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
