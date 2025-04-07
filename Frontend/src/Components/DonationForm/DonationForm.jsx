import React, { useState } from "react";
import axios from "axios";
import './DonationForm.css';
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../Api'; // adjust the path based on your folder structure


const DonateForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    amount: "",
    name: "",
    phone: "",
    email: "",
    certificate: "No",
    address: "",
    extra: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const makePayment = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/donation/create-order`, {
        amount: form.amount,
      });
  
      const options = {
        key: "rzp_live_1gSA9RbSjj0sEj",
        amount: data.order.amount,
        currency: "INR",
        name: "Unique Records",
        description: "Donation Payment",
        image: "https://yourcompany.com/logo.png", // optional
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(`${API_URL}/donation/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              formData: form,
            });
  
            if (verifyRes.data.success) {
              navigate("/donation-success", {
                state: {
                  name: form.name,
                  amount: form.amount,
                  paymentId: response.razorpay_payment_id,
                  certificate: form.certificate,
                  email: form.email,
                  phone: form.phone,
                },
              });
            } else {
              alert("❌ Payment verification failed!");
            }
          } catch (error) {
            console.error("Error verifying payment", error);
            alert("Something went wrong!");
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#E94e77",
        },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error", error);
      alert("Payment initiation failed");
    }
  };
  

  return (
    <div className="Donate-form-container">
      <h2 className="Donate-form-title">Enter Amount (₹): <span>*</span></h2>
      <input
        type="number"
        name="amount"
        placeholder="Enter Amount..."
        className="Donate-form-input"
        required
        value={form.amount}
        onChange={handleChange}
      />

      <div className="Donate-form-grid">
        <div className="Donate-form-field">
          <label>1. Name: <span>*</span></label>
          <input type="text" name="name" placeholder="Enter Name..." value={form.name} onChange={handleChange} required />
        </div>

        <div className="Donate-form-field">
          <label>2. Mobile Number: <span>*</span></label>
          <input type="tel" name="phone" placeholder="Enter Mobile Number..." value={form.phone} onChange={handleChange} required />
        </div>

        <div className="Donate-form-field">
          <label>3. Email: <span>*</span></label>
          <input type="email" name="email" placeholder="Enter Email..." value={form.email} onChange={handleChange} required />
        </div>

        <div className="Donate-form-field">
          <label>4. Do you want an 80G certificate? <span>*</span></label>
          <select name="certificate" value={form.certificate} onChange={handleChange} required>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="Donate-form-field full-width">
          <label>5. Address: <span>*</span></label>
          <textarea name="address" placeholder="Enter Address..." value={form.address} onChange={handleChange} required />
        </div>

        <div className="Donate-form-field full-width">
          <label>6. Anything Else?:</label>
          <textarea name="extra" placeholder="Anything else..." value={form.extra} onChange={handleChange} />
        </div>
      </div>

      <button className="Donate-form-button" onClick={makePayment}>Make Payment</button>
    </div>
  );
};

export default DonateForm;
