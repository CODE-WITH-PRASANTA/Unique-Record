import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../Api';
import {
  FaHeart,
  FaShieldAlt,
  FaLock,
  FaCheckCircle,
  FaReceipt,
  FaInfoCircle,
  FaHandHoldingHeart,
  FaMoneyBillWave,
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFileAlt
} from 'react-icons/fa';
import './DonationForm.css';

const PRESET_AMOUNTS = [250, 500, 1000, 2500, 5000, 10000];

// Dynamic loader for Razorpay Checkout script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const DonateForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    amount: '1000',
    name: '',
    phone: '',
    email: '',
    certificate: 'No',
    panNumber: '',
    address: '',
    extra: '',
  });

  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePresetClick = (val) => {
    setIsCustom(false);
    setCustomAmount('');
    setForm((prev) => ({ ...prev, amount: String(val) }));
    setErrorMsg('');
  };

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    setIsCustom(true);
    setForm((prev) => ({ ...prev, amount: val }));
    setErrorMsg('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  const validateForm = () => {
    const amt = Number(form.amount);
    if (!amt || isNaN(amt) || amt < 1) {
      setErrorMsg('Please enter a valid donation amount (minimum ₹1).');
      return false;
    }
    if (!form.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return false;
    }
    if (!form.phone.trim() || form.phone.replace(/[^0-9]/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }
    if (!form.address.trim()) {
      setErrorMsg('Please provide your address for receipt verification.');
      return false;
    }
    if (form.certificate === 'Yes' && form.panNumber.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(form.panNumber.trim())) {
      setErrorMsg('Please enter a valid PAN format (e.g. ABCDE1234F) for 80G tax receipt.');
      return false;
    }
    return true;
  };

  const makePayment = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!validateForm()) {
      const errBox = document.querySelector('.donate-form-error');
      if (errBox) errBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      setLoading(true);

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setErrorMsg('Razorpay payment gateway failed to load. Please check your internet connection and try again.');
        setLoading(false);
        return;
      }

      // Step 1: Create Order in backend
      const orderEndpoint = `${API_URL}/donation/create-order`;
      const { data: orderData } = await axios.post(orderEndpoint, {
        amount: form.amount,
      });

      if (!orderData || !orderData.order) {
        throw new Error(orderData?.message || 'Failed to initialize donation order');
      }

      const order = orderData.order;

      // Step 2: Open Razorpay Checkout Modal
      const options = {
        key: orderData.keyId || 'rzp_live_1gSA9RbSjj0sEj',
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Unique Record of Universe',
        description: `Glory of Donation - Contribution of ₹${form.amount}`,
        order_id: order.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          certificate: form.certificate,
          panNumber: form.panNumber || 'N/A',
          purpose: 'Spiritual & Social Development Donation',
        },
        theme: {
          color: '#e11d48',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (response) => {
          try {
            setLoading(true);
            // Step 3: Verify Payment & Store in Database
            const verifyEndpoint = `${API_URL}/donation/verify-payment`;
            const verifyRes = await axios.post(verifyEndpoint, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              formData: {
                ...form,
                amount: Number(form.amount),
              },
            });

            if (verifyRes.data && verifyRes.data.success) {
              const paymentNumber = verifyRes.data.paymentNumber || verifyRes.data.donation?.paymentNumber || 'N/A';
              navigate('/donation-success', {
                state: {
                  name: form.name,
                  amount: form.amount,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  paymentNumber: paymentNumber,
                  certificate: form.certificate,
                  panNumber: form.panNumber,
                  email: form.email,
                  phone: form.phone,
                  address: form.address,
                  date: new Date().toLocaleDateString('en-IN'),
                },
              });
            } else {
              setErrorMsg(verifyRes.data?.message || 'Payment verification failed. Please contact support.');
              setLoading(false);
            }
          } catch (err) {
            console.error('Error in verification:', err);
            setErrorMsg(err.response?.data?.message || 'Error verifying payment. If amount was deducted, please contact support.');
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setErrorMsg(`Payment failed: ${resp.error.description || 'Transaction declined'}`);
        setLoading(false);
      });
      rzp.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      setErrorMsg(error.response?.data?.message || error.message || 'Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="donate-premium-card" id="donation-form-section">
      {/* Top Banner */}
      <div className="donate-header-ribbon">
        <div className="donate-ribbon-badge">
          <FaHandHoldingHeart /> Sacred Contribution
        </div>
        <div className="donate-secure-pill">
          <FaShieldAlt /> 256-Bit SSL Secured by Razorpay
        </div>
      </div>

      <div className="donate-form-body">
        {/* Amount Selector */}
        <div className="donate-section-block">
          <label className="donate-label">
            <FaMoneyBillWave className="donate-label-icon" /> Select Donation Amount (₹) <span className="req-star">*</span>
          </label>
          
          <div className="donate-amount-chips">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                type="button"
                key={amt}
                className={`donate-chip ${!isCustom && String(form.amount) === String(amt) ? 'active' : ''}`}
                onClick={() => handlePresetClick(amt)}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          <div className="donate-custom-input-wrap">
            <span className="currency-prefix">₹</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Or enter custom amount (e.g. 5100)..."
              value={customAmount}
              onChange={handleCustomChange}
              className="donate-custom-input"
            />
            {isCustom && customAmount && (
              <span className="custom-active-tag">Custom Amount Selected</span>
            )}
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="donate-form-error">
            <FaInfoCircle /> {errorMsg}
          </div>
        )}

        {/* Donor Information Form */}
        <div className="donate-form-grid-modern">
          {/* 1. Name */}
          <div className="donate-input-group">
            <label>
              <FaUser className="input-icon" /> Full Name <span className="req-star">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name..."
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* 2. Phone */}
          <div className="donate-input-group">
            <label>
              <FaPhoneAlt className="input-icon" /> Mobile / WhatsApp Number <span className="req-star">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="10-digit mobile number..."
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* 3. Email */}
          <div className="donate-input-group">
            <label>
              <FaEnvelope className="input-icon" /> Email Address <span className="req-star">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Your email for donation receipt..."
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* 4. 80G Certificate */}
          <div className="donate-input-group">
            <label>
              <FaReceipt className="input-icon" /> 80G Tax Exemption Certificate <span className="req-star">*</span>
            </label>
            <select name="certificate" value={form.certificate} onChange={handleChange} required>
              <option value="No">No (Standard Receipt Only)</option>
              <option value="Yes">Yes (Eligible for 80G Tax Exemption)</option>
            </select>
          </div>

          {/* PAN Card if Certificate == Yes */}
          {form.certificate === 'Yes' && (
            <div className="donate-input-group full-span-input animate-slide-down">
              <label>
                <FaFileAlt className="input-icon" /> PAN Number (For 80G Tax Exemption Certificate)
              </label>
              <input
                type="text"
                name="panNumber"
                placeholder="e.g. ABCDE1234F"
                maxLength={10}
                style={{ textTransform: 'uppercase' }}
                value={form.panNumber}
                onChange={(e) => setForm({ ...form, panNumber: e.target.value.toUpperCase() })}
              />
              <span className="input-hint">PAN is required by the Income Tax Department to issue valid 80G receipts.</span>
            </div>
          )}

          {/* 5. Address */}
          <div className="donate-input-group full-span-input">
            <label>
              <FaMapMarkerAlt className="input-icon" /> Residential / Postal Address <span className="req-star">*</span>
            </label>
            <textarea
              name="address"
              rows={2}
              placeholder="Full postal address with city, state & pin code..."
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* 6. Extra / Prayer / Note */}
          <div className="donate-input-group full-span-input">
            <label>
              <FaHeart className="input-icon" /> Dedication / Message / Notes (Optional)
            </label>
            <textarea
              name="extra"
              rows={2}
              placeholder="Any specific blessing, dedication, or message..."
              value={form.extra}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Submit Action */}
        <div className="donate-action-footer">
          <button
            type="button"
            className="donate-pay-btn"
            disabled={loading}
            onClick={makePayment}
          >
            {loading ? (
              <span className="donate-btn-loader">
                <span className="spinner"></span> Processing Secure Razorpay Payment...
              </span>
            ) : (
              <span className="donate-btn-content">
                <FaHeart className="heart-beat" /> Pay ₹{Number(form.amount || 0).toLocaleString('en-IN')} & Complete Donation
              </span>
            )}
          </button>

          <div className="donate-trust-strip">
            <span><FaCheckCircle color="#10b981" /> Instant Tax Receipt</span>
            <span><FaLock color="#3b82f6" /> 100% Encrypted Gateway</span>
            <span><FaReceipt color="#8b5cf6" /> 80G Benefits Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateForm;
