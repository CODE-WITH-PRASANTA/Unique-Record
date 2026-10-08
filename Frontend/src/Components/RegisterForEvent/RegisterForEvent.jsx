import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URL } from '../../Api';
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
  Sparkles,
  Loader2,
  FileCheck,
  AlertCircle,
  X
} from 'lucide-react';
import './RegisterForEvent.css';

const RegisterForEvent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlEventName = searchParams.get('eventName') || '';
  const urlEventPrice = searchParams.get('eventPrice') || '';

  const storedUser = (() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  const [availableEvents, setAvailableEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [formData, setFormData] = useState({
    eventName: urlEventName,
    applicantName: storedUser?.fullName || storedUser?.name || '',
    sex: 'Male',
    dateOfBirth: '',
    whatsappNumber: storedUser?.phoneNumber || storedUser?.phone || '',
    pinCode: '',
    district: '',
    state: '',
    email: storedUser?.email || '',
    website: '',
    educationalQualification: '',
    expertise: '',
    bioData: null,
    photo: null,
    registrationFees: urlEventPrice ? `₹${urlEventPrice}` : '₹0'
  });

  // Fetch all events from database
  useEffect(() => {
    const fetchEventsList = async () => {
      try {
        setLoadingEvents(true);
        let res = await axios.get(`${API_URL}/events/status/Ongoing`);
        let list = res.data?.events || res.data?.data || [];
        
        if (!list || list.length === 0) {
          res = await axios.get(`${API_URL}/events`);
          list = res.data?.events || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        }

        setAvailableEvents(list);

        // Pre-fill or sync event price from fetched list
        if (list.length > 0) {
          const selectedName = urlEventName || list[0].eventName;
          const match = list.find(
            (e) => (e.eventName || e.name)?.toLowerCase() === selectedName.toLowerCase()
          ) || list[0];

          if (match) {
            const price = match.pricePerTicket !== undefined 
              ? match.pricePerTicket 
              : (match.registrationFee !== undefined ? match.registrationFee : 0);

            setFormData((prev) => ({
              ...prev,
              eventName: match.eventName,
              registrationFees: `₹${price || 0}`
            }));
          }
        }
      } catch (err) {
        console.error('Error loading events from database:', err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEventsList();
  }, [urlEventName]);

  // Handle Input Changes with Client-side file safety
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      const maxSizeBytes = 25 * 1024 * 1024; // 25MB

      if (file.size > maxSizeBytes) {
        Swal.fire({
          icon: 'warning',
          title: 'File Too Large',
          text: `Selected file (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 25MB maximum limit. Please choose a smaller file.`,
          confirmButtonColor: '#2563eb'
        });
        e.target.value = '';
        return;
      }

      if (name === 'photo') {
        if (!file.type.startsWith('image/')) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Photo Format',
            text: 'Please upload a valid image file (JPG, PNG, or WEBP).',
            confirmButtonColor: '#2563eb'
          });
          e.target.value = '';
          return;
        }

        setFormData((prev) => ({ ...prev, photo: file }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (name === 'bioData') {
        const allowedExts = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
        const fileName = file.name.toLowerCase();
        const isValidExt = allowedExts.some(ext => fileName.endsWith(ext));

        if (!isValidExt) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Document Format',
            text: 'Bio-data must be a PDF, DOC, DOCX, or Image file.',
            confirmButtonColor: '#2563eb'
          });
          e.target.value = '';
          return;
        }

        setFormData((prev) => ({ ...prev, bioData: file }));
      }
    } else if (name === 'eventName') {
      const selected = availableEvents.find(
        (ev) => (ev.eventName || ev.name) === value
      );
      const price = selected?.pricePerTicket !== undefined 
        ? selected.pricePerTicket 
        : (selected?.registrationFee !== undefined ? selected.registrationFee : 0);

      setFormData((prev) => ({
        ...prev,
        eventName: value,
        registrationFees: value ? `₹${price || 0}` : '₹0'
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
    setPhotoPreview(null);
    const photoInput = document.getElementById('photoInput');
    if (photoInput) photoInput.value = '';
  };

  const removeBioData = () => {
    setFormData(prev => ({ ...prev, bioData: null }));
    const bioInput = document.getElementById('bioDataInput');
    if (bioInput) bioInput.value = '';
  };

  // Helper to load Razorpay SDK dynamically if needed
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Execute Actual Registration with backend
  const executeRegistration = async (paymentDetails = null) => {
    try {
      const payload = new FormData();
      payload.append('eventName', formData.eventName);
      payload.append('applicantName', formData.applicantName);
      payload.append('sex', formData.sex);
      payload.append('dateOfBirth', formData.dateOfBirth);
      payload.append('whatsappNumber', formData.whatsappNumber);
      payload.append('pinCode', formData.pinCode);
      payload.append('district', formData.district);
      payload.append('state', formData.state);
      payload.append('email', formData.email);
      payload.append('website', formData.website || '');
      payload.append('educationalQualification', formData.educationalQualification);
      payload.append('expertise', formData.expertise || '');
      payload.append('registrationFees', formData.registrationFees || '₹0');

      if (paymentDetails) {
        payload.append('paymentStatus', 'Paid');
        payload.append('razorpayOrderId', paymentDetails.razorpay_order_id || '');
        payload.append('razorpayPaymentId', paymentDetails.razorpay_payment_id || '');
        payload.append('razorpaySignature', paymentDetails.razorpay_signature || '');
      } else {
        payload.append('paymentStatus', 'Paid');
      }

      if (formData.bioData) payload.append('bioData', formData.bioData);
      if (formData.photo) payload.append('photo', formData.photo);
      if (storedUser?._id) payload.append('userId', storedUser._id);

      const res = await axios.post(`${API_URL}/event-registrations/register`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const appNumber = res.data?.applicationNumber || res.data?.data?.applicationNumber || `EVT26${Math.floor(10000 + Math.random() * 90000)}`;

      await Swal.fire({
        icon: 'success',
        title: 'Registration Successful! 🎉',
        html: `
          <div style="text-align: left; font-size: 14px; line-height: 1.6; padding: 16px; background: #f8fafc; border-radius: 14px; border: 1px solid #e2e8f0; margin-top: 12px;">
            <p style="margin: 0 0 8px;"><strong>Application ID:</strong> <span style="color: #2563eb; font-weight: 800; font-size: 18px; letter-spacing: 1px; font-family: monospace;">${appNumber}</span></p>
            <p style="margin: 0 0 6px;"><strong>Event:</strong> ${formData.eventName}</p>
            <p style="margin: 0 0 6px;"><strong>Applicant:</strong> ${formData.applicantName}</p>
            <p style="margin: 0 0 6px;"><strong>Amount Paid:</strong> <span style="color: #059669; font-weight: 700;">${formData.registrationFees}</span></p>
            ${paymentDetails?.razorpay_payment_id ? `<p style="margin: 0 0 8px; font-size: 12.5px; color: #64748b;"><strong>Transaction ID:</strong> ${paymentDetails.razorpay_payment_id}</p>` : ''}
            <div style="display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700;">
              Status: Pending Review
            </div>
          </div>
          <p style="color: #475569; font-size: 13px; margin-top: 14px;">Use this Application ID anytime to check current verification progress.</p>
        `,
        confirmButtonText: 'Track Status Now 🔍',
        showCancelButton: true,
        cancelButtonText: 'Go to Dashboard',
        confirmButtonColor: '#2563eb',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/event/registration-status?appId=${appNumber}`);
        } else {
          navigate('/dashboard');
        }
      });
    } catch (err) {
      console.error('Error submitting event registration:', err);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.response?.data?.message || 'Failed to submit event registration. Please try again.',
        confirmButtonColor: '#2563eb'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Form Submission with Integrated Payment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.eventName) {
      return Swal.fire('Error', 'Please select an event to register.', 'error');
    }
    if (!formData.applicantName.trim()) {
      return Swal.fire('Error', 'Please enter applicant name.', 'error');
    }
    if (!formData.sex) {
      return Swal.fire('Error', 'Please select gender.', 'error');
    }
    if (!formData.dateOfBirth) {
      return Swal.fire('Error', 'Please select date of birth.', 'error');
    }
    if (!formData.whatsappNumber.trim()) {
      return Swal.fire('Error', 'Please enter WhatsApp mobile number.', 'error');
    }
    if (!formData.email.trim()) {
      return Swal.fire('Error', 'Please enter email address.', 'error');
    }
    if (!formData.pinCode.trim()) {
      return Swal.fire('Error', 'Please enter pin code.', 'error');
    }
    if (!formData.district.trim()) {
      return Swal.fire('Error', 'Please enter district.', 'error');
    }
    if (!formData.state.trim()) {
      return Swal.fire('Error', 'Please enter state.', 'error');
    }
    if (!formData.educationalQualification.trim()) {
      return Swal.fire('Error', 'Please enter educational qualification.', 'error');
    }
    if (!formData.bioData) {
      return Swal.fire('Error', 'Please attach your Bio-data file.', 'error');
    }
    if (!formData.photo) {
      return Swal.fire('Error', 'Please upload your passport size photo.', 'error');
    }

    const numericAmount = parseFloat(String(formData.registrationFees || '0').replace(/[^0-9.]/g, ''));

    // If fee is 0 (Free event), proceed directly
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setSubmitting(true);
      return executeRegistration(null);
    }

    // Initiate Razorpay Payment
    setSubmitting(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setSubmitting(false);
        return Swal.fire('Payment Gateway Error', 'Failed to load Razorpay payment SDK. Please check your internet connection.', 'error');
      }

      // 1. Create order on backend
      const orderRes = await axios.post(`${API_URL}/event-registrations/create-order`, {
        amount: numericAmount,
        eventName: formData.eventName,
        applicantName: formData.applicantName,
      });

      if (!orderRes.data?.success || !orderRes.data?.orderId) {
        throw new Error(orderRes.data?.message || 'Could not initiate payment order');
      }

      const { orderId, amount: amountInPaise, keyId } = orderRes.data;

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: keyId || 'rzp_live_1gSA9RbSjj0sEj',
        amount: amountInPaise,
        currency: 'INR',
        name: 'Unique Records of Universe',
        description: `Event Registration Fee: ${formData.eventName}`,
        image: 'https://ouruniverse.in/logo.png',
        order_id: orderId,
        prefill: {
          name: formData.applicantName,
          email: formData.email,
          contact: formData.whatsappNumber,
        },
        theme: {
          color: '#2563eb',
        },
        handler: async function (paymentResponse) {
          try {
            // 3. Verify Payment Signature
            await axios.post(`${API_URL}/event-registrations/verify-payment`, {
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            });

            // 4. Submit Registration
            await executeRegistration(paymentResponse);
          } catch (verificationErr) {
            console.error('Payment verification failed:', verificationErr);
            setSubmitting(false);
            Swal.fire({
              icon: 'error',
              title: 'Payment Verification Error',
              text: verificationErr.response?.data?.message || 'Payment received but verification failed. Please contact support.',
              confirmButtonColor: '#2563eb',
            });
          }
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
            Swal.fire({
              icon: 'info',
              title: 'Payment Canceled',
              text: 'You dismissed the payment checkout. Registration will only be confirmed after completing the payment.',
              confirmButtonColor: '#2563eb',
            });
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (payErr) {
      console.error('Payment checkout initiation error:', payErr);
      setSubmitting(false);
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: payErr.response?.data?.message || payErr.message || 'Could not initiate payment. Please try again.',
        confirmButtonColor: '#2563eb',
      });
    }
  };

  return (
    <div className="ure-page-wrapper">
      <div className="ure-container">
        
        {/* Header Section */}
        <div className="ure-header">
          <div className="ure-badge">
            <Sparkles size={16} /> Official Registration Portal
          </div>
          <h1 className="ure-main-title">UNIQUE RECORDS OF UNIVERSE</h1>
          <p className="ure-subtitle">Digitally Marking The Extraordinary Achievement</p>
        </div>

        {/* Master Form Card */}
        <div className="ure-form-card">
          <div className="ure-form-card-header">
            <div className="ure-form-title-group">
              <span className="ure-blue-accent-bar"></span>
              <div>
                <h2>EVENT REGISTRATION FORM</h2>
                <p className="ure-form-desc">Complete your application to secure official participation.</p>
              </div>
            </div>

            <div className="ure-pricing-pill">
              <span>Registration Fee</span>
              <strong>{formData.registrationFees || '₹0'}</strong>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="ure-form-grid">
            
            {/* Section 1: Event Selection */}
            <div className="ure-full-width">
              <div className="ure-section-divider">
                <span className="ure-section-divider-title">1. Event Selection</span>
                <span className="ure-section-divider-line"></span>
              </div>
            </div>

            <div className="ure-input-group ure-full-width">
              <label><Calendar size={16} /> Choose Event <span className="ure-req">*</span></label>
              <div className="ure-select-wrapper">
                <select 
                  name="eventName" 
                  value={formData.eventName} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">
                    {loadingEvents ? 'Loading events from database...' : 'Select an Event'}
                  </option>
                  {urlEventName && !availableEvents.some((e) => (e.eventName || e.name) === urlEventName) && (
                    <option value={urlEventName}>{urlEventName}</option>
                  )}
                  {availableEvents.map((ev) => (
                    <option key={ev._id || ev.id} value={ev.eventName}>
                      {ev.eventName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 2: Personal Profile */}
            <div className="ure-full-width">
              <div className="ure-section-divider">
                <span className="ure-section-divider-title">2. Applicant Profile</span>
                <span className="ure-section-divider-line"></span>
              </div>
            </div>

            <div className="ure-input-group">
              <label><User size={16} /> Full Name <span className="ure-req">*</span></label>
              <input 
                type="text" 
                name="applicantName" 
                placeholder="e.g. John Doe" 
                value={formData.applicantName} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="ure-input-group">
              <label><User size={16} /> Sex / Gender <span className="ure-req">*</span></label>
              <div className="ure-radio-group">
                {['Male', 'Female', 'Transgender'].map((option) => (
                  <label 
                    key={option} 
                    className={`ure-radio-chip ${formData.sex === option ? 'active' : ''}`}
                    onClick={() => setFormData((prev) => ({ ...prev, sex: option }))}
                  >
                    <span className="ure-radio-dot"></span>
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="ure-input-group">
              <label><Calendar size={16} /> Date of Birth <span className="ure-req">*</span></label>
              <input 
                type="date" 
                name="dateOfBirth" 
                value={formData.dateOfBirth} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="ure-input-group">
              <label><Phone size={16} /> WhatsApp Mobile Number <span className="ure-req">*</span></label>
              <input 
                type="tel" 
                name="whatsappNumber" 
                placeholder="10-digit mobile number" 
                value={formData.whatsappNumber} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="ure-input-group">
              <label><Mail size={16} /> Email Address <span className="ure-req">*</span></label>
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
              <label><Globe size={16} /> Portfolio / Social Link (Optional)</label>
              <input 
                type="url" 
                name="website" 
                placeholder="https://yourwebsite.com" 
                value={formData.website} 
                onChange={handleChange} 
              />
            </div>

            {/* Section 3: Address */}
            <div className="ure-full-width">
              <div className="ure-section-divider">
                <span className="ure-section-divider-title">3. Address & Location</span>
                <span className="ure-section-divider-line"></span>
              </div>
            </div>

            <div className="ure-input-group">
              <label><MapPin size={16} /> Postal Pin Code <span className="ure-req">*</span></label>
              <input 
                type="text" 
                name="pinCode" 
                placeholder="6-digit PIN code" 
                maxLength="6"
                value={formData.pinCode} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="ure-input-group">
              <label><MapPin size={16} /> District <span className="ure-req">*</span></label>
              <input 
                type="text" 
                name="district" 
                placeholder="Enter district" 
                value={formData.district} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="ure-input-group ure-full-width">
              <label><MapPin size={16} /> State <span className="ure-req">*</span></label>
              <input 
                type="text" 
                name="state" 
                placeholder="Enter state" 
                value={formData.state} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Section 4: Skills */}
            <div className="ure-full-width">
              <div className="ure-section-divider">
                <span className="ure-section-divider-title">4. Background & Skills</span>
                <span className="ure-section-divider-line"></span>
              </div>
            </div>

            <div className="ure-input-group ure-full-width">
              <label><GraduationCap size={16} /> Educational Qualification <span className="ure-req">*</span></label>
              <input 
                type="text" 
                name="educationalQualification" 
                placeholder="e.g. Master in Science, B.Tech, Graduate, Higher Secondary" 
                value={formData.educationalQualification} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="ure-input-group ure-full-width">
              <label><FileText size={16} /> Area of Expertise & Special Achievements (Optional)</label>
              <textarea 
                name="expertise" 
                rows="3" 
                placeholder="Highlight your relevant expertise, awards, records, or achievements..." 
                value={formData.expertise} 
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Section 5: Documents */}
            <div className="ure-full-width">
              <div className="ure-section-divider">
                <span className="ure-section-divider-title">5. Document & Photo Uploads</span>
                <span className="ure-section-divider-line"></span>
              </div>
            </div>

            {/* BioData Upload */}
            <div className="ure-input-group">
              <label><Upload size={16} /> Attach Bio-Data (PDF / DOC) <span className="ure-req">*</span></label>
              <div className="ure-file-upload-box">
                <input 
                  type="file" 
                  name="bioData" 
                  id="bioDataInput" 
                  accept=".pdf,.doc,.docx,image/*" 
                  onChange={handleChange} 
                  required={!formData.bioData}
                />
                <div className="ure-file-custom-btn">
                  <span className="ure-file-btn-text">
                    <FileCheck size={14} /> Choose File
                  </span>
                  <span className="ure-file-name">
                    {formData.bioData ? formData.bioData.name : 'PDF / DOC / Image (Max 25MB)'}
                  </span>
                </div>
              </div>
              {formData.bioData && (
                <div className="ure-file-chip">
                  <FileCheck size={14} color="#2563eb" />
                  <span>{formData.bioData.name}</span>
                  <button type="button" onClick={removeBioData} className="ure-remove-btn"><X size={12} /></button>
                </div>
              )}
            </div>

            {/* Photo Upload */}
            <div className="ure-input-group">
              <label><Upload size={16} /> Passport Size Photo <span className="ure-req">*</span></label>
              <div className="ure-file-upload-box">
                <input 
                  type="file" 
                  name="photo" 
                  id="photoInput" 
                  accept="image/*" 
                  onChange={handleChange} 
                  required={!formData.photo}
                />
                <div className="ure-file-custom-btn">
                  <span className="ure-file-btn-text">
                    <Upload size={14} /> Choose Photo
                  </span>
                  <span className="ure-file-name">
                    {formData.photo ? formData.photo.name : 'JPG, PNG, or WEBP (Max 25MB)'}
                  </span>
                </div>
              </div>

              {photoPreview && (
                <div className="ure-photo-preview-card">
                  <img src={photoPreview} alt="Preview" className="ure-preview-img" />
                  <div className="ure-preview-meta">
                    <strong>{formData.photo?.name}</strong>
                    <span>Ready for verification</span>
                  </div>
                  <button type="button" onClick={removePhoto} className="ure-remove-btn" title="Remove photo">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Section 6: Summary & Submit */}
            <div className="ure-full-width">
              <div className="ure-section-divider">
                <span className="ure-section-divider-title">6. Registration Summary</span>
                <span className="ure-section-divider-line"></span>
              </div>
            </div>

            <div className="ure-input-group ure-full-width">
              <label><CreditCard size={16} /> Registration Fees</label>
              <input 
                type="text" 
                name="registrationFees" 
                value={formData.registrationFees || '₹0'} 
                readOnly 
                className="ure-readonly-input" 
              />
            </div>

            {/* Submit Button */}
            <div className="ure-submit-wrapper ure-full-width">
              <button type="submit" className="ure-submit-btn" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="spinner" size={20} />
                    <span>Processing Registration...</span>
                  </>
                ) : (
                  <>
                    <span>Register</span>
                    <CheckCircle2 size={20} />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForEvent;