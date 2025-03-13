import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaGoogle, FaLinkedinIn, FaPinterestP } from "react-icons/fa";
import "./Login.css";
import RightSideCompanyLogo from "../../assets/UNQUE.png";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="login-page-container">
      {/* Left Side Content */}
      <div className="login-page-left-section">
        <h2 className="login-page-welcome-text">Welcome To</h2>
        <h1 className="login-page-title">
            Our <span className="login-page-brand">URU</span>
        </h1>
        <p className="login-page-description">
            Elevate your experience with cutting-edge solutions. Join us and explore the future of technology with Xmee.
        </p>
        </div>

{/* Right Side Content */}
<div className="login-page-right-section">
  <img src={RightSideCompanyLogo} alt="Company Logo" className="login-page-company-logo" />
  
  <div className="login-page-toggle-buttons">
    <button className={!isRegister ? "active login-page-button" : "login-page-button"} onClick={() => setIsRegister(false)}>
      Log In
    </button>
    <button className={isRegister ? "active login-page-button" : "login-page-button"} onClick={() => setIsRegister(true)}>
      Register
    </button>
  </div>

  <form className="login-page-form">
    {isRegister && <input type="text" placeholder="Full Name" required className="login-page-input" />}
    
    {isRegister && (
      <div className="login-page-row">
        <input type="tel" placeholder="Phone Number" required className="login-page-input half-width" maxLength="10" pattern="[0-9]{10}" />
        <input type="email" placeholder="Email Address" required className="login-page-input half-width" />
      </div>
    )}
    
    {!isRegister && <input type="text" placeholder="Enter Mail / Phone" required className="login-page-input" />}
    
    <input type="password" placeholder="Password" required className="login-page-input" />
    
    {isRegister && (
      <input type="password" placeholder="Confirm Password" required className="login-page-input" />
    )}
    
    <div className="login-page-forgot-password">
      {!isRegister && <a href="#" className="login-page-forgot-link">Forgot Password?</a>}
    </div>

    <button type="submit" className="login-page-submit-button">
      {isRegister ? "Register" : "Log In"}
    </button>

    <div className="login-page-social-icons">
      <FaFacebookF className="login-page-social-icon" />
      <FaTwitter className="login-page-social-icon" />
      <FaGoogle className="login-page-social-icon" />
      <FaLinkedinIn className="login-page-social-icon" />
      <FaPinterestP className="login-page-social-icon" />
    </div>
  </form>
</div>


    </div>
  );
};

export default Login;
