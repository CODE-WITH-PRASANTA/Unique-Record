import React, { useState, useEffect } from 'react';
import './AdminLogin.css';
import companylogo from '../../assets/UNQUE.png';
import AdminNavbar from "../../AdminPannel/AdminNavbar/AdminNavbar";
import { FaFacebookF, FaXTwitter, FaGoogle, FaGithub } from "react-icons/fa6";

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const hardcodedEmail = 'uruonline2025@gmail.com';
    const hardcodedPassword = 'URU@2025';

    if (email === hardcodedEmail && password === hardcodedPassword) {
      setIsLoggedIn(true);
      if (rememberMe) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
      } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  if (isLoggedIn) {
    return <AdminNavbar />;
  }

  return (
    <div className="Admin-login-page">
      <div className="Admin-login-box">
        <img src={companylogo} alt="Logo" className="Admin-login-logo" />
        <h2 className="Admin-login-heading">LOGIN</h2>
        <p className="Admin-login-subtitle">Enter your Username and Password</p>

        <form className="Admin-login-form" onSubmit={handleLogin}>
          <label htmlFor="email" className="Admin-login-label">Email</label>
          <input type="email" id="email" placeholder="test@gmail.com" className="Admin-login-input" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label htmlFor="password" className="Admin-login-label">Password</label>
          <input type="password" id="password" placeholder="••••••" className="Admin-login-input" value={password} onChange={(e) => setPassword(e.target.value)} />

          <div className="Admin-login-remember">
            <input type="checkbox" id="remember" className="Admin-login-checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            <label htmlFor="remember" className="Admin-login-remember-label">Remember me</label>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit" className="Admin-login-btn">Login</button>
        </form>

        <div className="Admin-login-divider">Or Login With</div>

        <div className="Admin-login-social">
          <button className="Admin-login-social-btn facebook"><FaFacebookF /></button>
          <button className="Admin-login-social-btn twitter"><FaXTwitter /></button>
          <button className="Admin-login-social-btn google"><FaGoogle /></button>
          <button className="Admin-login-social-btn github"><FaGithub /></button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;