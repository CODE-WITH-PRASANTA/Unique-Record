import React from 'react';
import './DonationForm.css';

const DonateForm = () => {
  return (
    <div className="Donate-form-container">
      <h2 className="Donate-form-title">Enter Amount (₹): <span>*</span></h2>
      <input type="number" placeholder="Enter Amount..." className="Donate-form-input" required />

      <div className="Donate-form-grid">
        <div className="Donate-form-field">
          <label>1. Name: <span>*</span></label>
          <input type="text" placeholder="Enter Name..." required />
        </div>
        
        <div className="Donate-form-field">
          <label>2. Mobile Number: <span>*</span></label>
          <input type="tel" placeholder="Enter Mobile Number..." required />
        </div>

        <div className="Donate-form-field">
          <label>3. Email: <span>*</span></label>
          <input type="email" placeholder="Enter Email..." required />
        </div>

        <div className="Donate-form-field">
          <label>4. Do you want an 80G certificate? <span>*</span></label>
          <select required>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="Donate-form-field full-width">
          <label>5. Address: <span>*</span></label>
          <textarea placeholder="Enter Address..." required></textarea>
        </div>

        <div className="Donate-form-field full-width">
          <label>6. Anything Else?:</label>
          <textarea placeholder="Anything else..."></textarea>
        </div>
      </div>

      <button className="Donate-form-button">Make Payment</button>
    </div>
  );
};

export default DonateForm;
