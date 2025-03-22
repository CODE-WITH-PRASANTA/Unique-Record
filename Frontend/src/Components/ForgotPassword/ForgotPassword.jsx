import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../Api"; // Importing API_URL
import "./ForgotPassword.css";
import RightSideCompanyLogo from "../../assets/UNQUE.png";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitEmail = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/forgot-password/forgot-password`, {
        email: formData.email,
      });
      alert(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  const handleSubmitOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/forgot-password/verify-otp`, {
        email: formData.email,
        otp: formData.otp,
      });
      alert(res.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setError("");
    try {
      if (formData.newPassword !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
      const res = await axios.post(`${API_URL}/forgot-password/reset-password`, {
        email: formData.email,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      alert(res.data.message);
      setStep(1);
      setFormData({ email: "", otp: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
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
        <img src={RightSideCompanyLogo} alt="Company Logo" className="forgot-password-company-logo" />

        <div className="forgot-password-form-container">
          {error && <p className="error-message">{error}</p>}

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
              <button className="forgot-password-button" onClick={handleSubmitEmail} disabled={loading}>
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
              <button className="forgot-password-button" onClick={handleSubmitOtp} disabled={loading}>
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
              <button className="forgot-password-button" onClick={handleResetPassword} disabled={loading}>
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
