import React, { useState } from 'react';
import { 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  Globe, 
  GraduationCap, 
  FileText, 
  Upload, 
  CreditCard,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import './RegisterForEvent.css';

const RegisterForEvent = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    applicantName: '',
    sex: '',
    dateOfBirth: '',
    whatsappNumber: '',
    pinCode: '',
    district: '',
    state: '',
    email: '',
    website: '',
    educationalQualification: '',
    expertise: '',
    bioData: null,
    photo: null,
    registrationFees: '₹0'
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Event registration submitted:', formData);
    // Add your API integration / Axios request here
  };

  return (
    <div className="ure-page-wrapper">
      <div className="ure-container">
        
        {/* Header Section */}
        <div className="ure-header">
          <div className="ure-badge">
            <Sparkles size={16} /> Official Portal
          </div>
          <h1 className="ure-main-title">UNIQUE RECORDS OF UNIVERSE</h1>
          <p className="ure-subtitle">Digitally Marking The Extraordinary Achievement</p>
        </div>

        {/* Form Card */}
        <div className="ure-form-card">
          <div className="ure-form-card-header">
            <div className="ure-form-title-group">
              <span className="ure-blue-accent-bar"></span>
              <h2>EVENT REGISTRATION FORM</h2>
            </div>
            <p className="ure-form-desc">Please fill out all required details accurately to complete your event registration.</p>
          </div>

          <form onSubmit={handleSubmit} className="ure-form-grid">
            
            {/* Event Name & Applicant Name */}
            <div className="ure-input-group">
              <label><Calendar size={16} /> Event Name *</label>
              <div className="ure-select-wrapper">
                <select 
                  name="eventName" 
                  value={formData.eventName} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Select an Event</option>
                  <option value="Global Achievers Summit">Global Achievers Summit</option>
                  <option value="Universe Talent Showcase">Universe Talent Showcase</option>
                  <option value="Innovation & Records Expo">Innovation & Records Expo</option>
                </select>
              </div>
            </div>

            <div className="ure-input-group">
              <label><User size={16} /> Applicant Name *</label>
              <input 
                type="text" 
                name="applicantName" 
                placeholder="Enter your full name" 
                value={formData.applicantName} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Sex / Gender Selection */}
            <div className="ure-input-group ure-full-width">
              <label><User size={16} /> Sex *</label>
              <div className="ure-radio-group">
                {['Male', 'Female', 'Transgender'].map((option) => (
                  <label key={option} className={`ure-radio-chip ${formData.sex === option ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="sex" 
                      value={option} 
                      checked={formData.sex === option} 
                      onChange={handleChange} 
                      required 
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date of Birth & WhatsApp */}
            <div className="ure-input-group">
              <label><Calendar size={16} /> Date of Birth *</label>
              <input 
                type="date" 
                name="dateOfBirth" 
                value={formData.dateOfBirth} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="ure-input-group">
              <label><Phone size={16} /> WhatsApp Mobile Number *</label>
              <input 
                type="tel" 
                name="whatsappNumber" 
                placeholder="e.g. 9876543210" 
                value={formData.whatsappNumber} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Pin Code, District, State */}
            <div className="ure-input-group">
              <label><MapPin size={16} /> Pin Code *</label>
              <input 
                type="text" 
                name="pinCode" 
                placeholder="6-digit pin code" 
                value={formData.pinCode} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="ure-input-group">
              <label><MapPin size={16} /> District *</label>
              <input 
                type="text" 
                name="district" 
                placeholder="Enter district" 
                value={formData.district} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="ure-input-group">
              <label><MapPin size={16} /> State *</label>
              <input 
                type="text" 
                name="state" 
                placeholder="Enter state" 
                value={formData.state} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Email & Website */}
            <div className="ure-input-group">
              <label><Mail size={16} /> Email ID *</label>
              <input 
                type="email" 
                name="email" 
                placeholder="name@example.com" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="ure-input-group">
              <label><Globe size={16} /> Website (Optional)</label>
              <input 
                type="url" 
                name="website" 
                placeholder="https://yourwebsite.com" 
                value={formData.website} 
                onChange={handleChange} 
              />
            </div>

            {/* Educational Qualification */}
            <div className="ure-input-group ure-full-width">
              <label><GraduationCap size={16} /> Educational Qualification *</label>
              <input 
                type="text" 
                name="educationalQualification" 
                placeholder="e.g., Bachelor of Technology / Master in Science" 
                value={formData.educationalQualification} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Expertise & Special Skills */}
            <div className="ure-input-group ure-full-width">
              <label><FileText size={16} /> Your Area of Expertise & Special Skills (Optional)</label>
              <textarea 
                name="expertise" 
                rows="4" 
                placeholder="Describe your unique skills, background, or notable achievements..." 
                value={formData.expertise} 
                onChange={handleChange}
              ></textarea>
            </div>

            {/* File Uploads */}
            <div className="ure-input-group">
              <label><Upload size={16} /> Attach Bio-data (Max 25MB) *</label>
              <div className="ure-file-upload-box">
                <input 
                  type="file" 
                  name="bioData" 
                  id="bioData" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleChange} 
                  required 
                />
                <label htmlFor="bioData" className="ure-file-custom-btn">
                  <span>Choose File</span>
                  <span className="ure-file-name">{formData.bioData ? formData.bioData.name : 'No file chosen'}</span>
                </label>
              </div>
            </div>

            <div className="ure-input-group">
              <label><Upload size={16} /> Upload Your Passport Size Photo *</label>
              <div className="ure-file-upload-box">
                <input 
                  type="file" 
                  name="photo" 
                  id="photo" 
                  accept="image/*" 
                  onChange={handleChange} 
                  required 
                />
                <label htmlFor="photo" className="ure-file-custom-btn">
                  <span>Choose File</span>
                  <span className="ure-file-name">{formData.photo ? formData.photo.name : 'No file chosen'}</span>
                </label>
              </div>
            </div>

            {/* Registration Fees */}
            <div className="ure-input-group ure-full-width">
              <label><CreditCard size={16} /> Registration Fees *</label>
              <input 
                type="text" 
                name="registrationFees" 
                value={formData.registrationFees} 
                readOnly 
                className="ure-readonly-input" 
              />
            </div>

            {/* Submit Button */}
            <div className="ure-submit-wrapper ure-full-width">
              <button type="submit" className="ure-submit-btn">
                <span>PAY {formData.registrationFees} & REGISTER</span>
                <CheckCircle2 size={20} />
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForEvent;