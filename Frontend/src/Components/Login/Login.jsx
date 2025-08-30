import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../Api";
import { FaFacebookF, FaTwitter, FaGoogle, FaLinkedinIn, FaPinterestP } from "react-icons/fa";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import "./Login.css";
import RightSideCompanyLogo from "../../assets/UNQUE.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const phoneNumber = "+919472351693";
  const [isRegister, setIsRegister] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    emailOrPhone: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        const { fullName, phoneNumber, email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
          return Swal.fire({
            icon: "error",
            title: "Password Mismatch",
            text: "Passwords do not match!",
          });
        }

        const res = await axios.post(`${API_URL}/auth/register`, {
          fullName,
          phoneNumber,
          email,
          password,
          confirmPassword,
        });

        Swal.fire({
          icon: "success",
          title: "Registration Successful 🎉",
          text: res.data.message,
        });

      } else {
        const { emailOrPhone, password } = formData;
        const res = await axios.post(`${API_URL}/auth/login`, {
          emailOrPhone,
          password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        Swal.fire({
          icon: "success",
          title: "Login Successful ✅",
          text: "Redirecting to Dashboard...",
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="login-page-container">
      {/* Left Side Content */}
      <div className="login-page-left-section">
        <h2 className="login-page-welcome-text">Welcome To</h2>
        <h1 className="login-page-title">
          Unique Records of Universe <span className="login-page-brand">Login Portal</span>
        </h1>
        <p className="login-page-description">
          Create your account and login to register your name as "Unique Records of the Universe" holder and apply online to participate in various events and felicitation/award ceremonies.
        </p>
      </div>

      {/* Right Side Content */}
      <div className="login-page-right-section">
        <img src={RightSideCompanyLogo} alt="Company Logo" className="login-page-company-logo" />

        <div className="login-page-toggle-buttons">
          <button
            className={!isRegister ? "active login-page-button" : "login-page-button"}
            onClick={() => setIsRegister(false)}
          >
            Log In
          </button>
          <button
            className={isRegister ? "active login-page-button" : "login-page-button"}
            onClick={() => setIsRegister(true)}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form className="login-page-form" onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              required
              className="login-page-input"
              onChange={handleChange}
            />
          )}

          {isRegister && (
            <div className="login-page-row">
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Mobile Number"
                required
                className="login-page-input half-width"
                maxLength="10"
                pattern="[0-9]{10}"
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="login-page-input half-width"
                onChange={handleChange}
              />
            </div>
          )}

          {!isRegister && (
            <input
              type="text"
              name="emailOrPhone"
              placeholder="Enter Email / Phone"
              required
              className="login-page-input"
              onChange={handleChange}
            />
          )}

          <input
            type="password"
            name="password"
            placeholder={isRegister ? "Create Password" : "Password"}
            required
            className="login-page-input"
            onChange={handleChange}
          />

          {isRegister && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              className="login-page-input"
              onChange={handleChange}
            />
          )}

          <div className="login-page-forgot-password">
            {!isRegister && (
              <a href="/forgot-password" className="login-page-forgot-link">
                Forgot Password?
              </a>
            )}
          </div>

          <button type="submit" className="login-page-submit-button">
            {isRegister ? "Register" : "Log In"}
          </button>

          {/* Social Icons */}
          <div className="login-page-social-icons">
            <FaFacebookF className="login-page-social-icon" />
            <FaTwitter className="login-page-social-icon" />
            <FaGoogle className="login-page-social-icon" />
            <FaLinkedinIn className="login-page-social-icon" />
            <FaPinterestP className="login-page-social-icon" />
          </div>
        </form>

        {/* Assistance Section */}
        <p className="login-assistance-call">
          <FaPhoneAlt className="icon phone-icon" />
          For any Assistance Call or WhatsApp:{" "}
          <a href={`tel:${phoneNumber}`} className="call-link">
            {phoneNumber}
          </a>
          <a
            href={`https://wa.me/${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-link"
          >
            <FaWhatsapp className="icon whatsapp-icon" />
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
