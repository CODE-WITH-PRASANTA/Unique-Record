import React, { useState, useEffect } from "react";
import { API_URL } from "../../Api"; 
import { useLocation } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaGlobe,
  FaFileUpload,
  FaCamera,
  FaGraduationCap,
} from "react-icons/fa";
import axios from "axios";
import "./RegisterForEvent.css";
import { useNavigate } from "react-router-dom";

const RegisterForEvent = () => {
  const [phoneNumber, setPhoneNumber] = useState(""); 
  const location = useLocation();
  const [events, setEvents] = useState([]); 
  const [eventName, setEventName] = useState("");
  const [eventPrice, setEventPrice] = useState(0);
  const navigate = useNavigate();
  const [applicantName, setApplicantName] = useState("");
  const [sex, setSex] = useState("");
  const [dob, setDob] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [bioData, setBioData] = useState(null);
  const [photo, setPhoto] = useState(null);
  


  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleApplicantNameChange = (e) => {
    setApplicantName(e.target.value);
  };

  const handleSexChange = (e) => {
    setSex(e.target.value);
  };

  const handleDobChange = (e) => {
    setDob(e.target.value);
  };

  const handlePinCodeChange = (e) => {
    setPinCode(e.target.value);
  };

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
  };

  const handleStateChange = (e) => {
    setState(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleWebsiteChange = (e) => {
    setWebsite(e.target.value);
  };

  const handleEducationChange = (e) => {
    setEducation(e.target.value);
  };

  const handleSkillsChange = (e) => {
    setSkills(e.target.value);
  };

  const handleBioDataChange = (e) => {
    setBioData(e.target.files[0]); // Store the selected file
  };
  
  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]); // Store the selected photo
  };
  

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const eventNameParam = urlParams.get("eventName");
    const eventPriceParam = urlParams.get("eventPrice");

    if (eventNameParam && eventPriceParam) {
      setEventName(decodeURIComponent(eventNameParam));
      setEventPrice(eventPriceParam);
    }

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events/status/Ongoing`);
        setEvents(response.data.events); 
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [location.search]);

  const handleEventChange = (e) => {
    const selectedEvent = events.find(event => event.eventName === e.target.value);
    setEventName(selectedEvent.eventName);
    setEventPrice(selectedEvent.pricePerTicket);
  };


 const handlePayment = async (event) => {
  event.preventDefault();

  if (!bioData || !photo) {
    alert("Please upload both biodata and photo before proceeding!");
    return;
  }

  try {
    // Upload Files First
    const formData = new FormData();
    formData.append("biodata", bioData);
    formData.append("photo", photo);

    const uploadResponse = await axios.post(`${API_URL}/upload/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (!uploadResponse.data.biodataUrl || !uploadResponse.data.photoUrl) {
      alert("File upload failed. Please try again.");
      return;
    }

    // Proceed with payment after successful upload
    const paymentData = {
      amount: eventPrice,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      phone: phoneNumber,
    };

    const { data } = await axios.post(`${API_URL}/payment/create-order`, paymentData);

    const options = {
      key: "rzp_live_1gSA9RbSjj0sEj",
      amount: data.order.amount,
      currency: data.order.currency,
      name: "Unique Records of Universe",
      description: "Event Registration Fee",
      order_id: data.order.id,
      handler: async (response) => {
        const verifyRes = await axios.post(`${API_URL}/payment/verify-payment`, response);

        if (verifyRes.data.success) {
          navigate("/payment-success", {
            state: {
              order: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount: data.order.amount / 100,
                currency: data.order.currency,
                phone: phoneNumber,
                date: new Date().toLocaleString(),
                method: "Razorpay",
                status: "SUCCESS",
              },
              formData: {
                applicantName,
                sex,
                dob,
                phoneNumber,
                pinCode,
                district,
                state,
                email,
                website,
                education,
                skills,
                biodataUrl: uploadResponse.data.biodataUrl, // Pass biodata URL
                photoUrl: uploadResponse.data.photoUrl, // Pass photo URL
                eventName,
                eventPrice,
              },
            },
          });
          
        } else {
          alert("Payment Verification Failed!");
        }
      },
      prefill: {
        name: applicantName,
        email: email,
        contact: phoneNumber,
      },
      theme: { color: "#3399cc" },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong! Please try again.");
  }
};

          
          return (
          <>
          <h1 className="event-registaion-page heading">Unique Records of Universe <span>Digitally Marking The Extraordinary Achievement</span></h1>
          <div className="event-container">
            <h2 className="event-heading">Event Registration Form</h2>
            <form className="event-form" onSubmit={handlePayment}>
              
              {/* Event Selection */}
              <div className="event-row">
                <div className="event-group">
                  <label><FaCalendarAlt /> Event Name *</label>
                  <select value={eventName} onChange={handleEventChange} required>
                    <option value="">Select an Event</option>
                    {events.map(event => (
                      <option key={event._id} value={event.eventName}>
                        {event.eventName}
                      </option>
                    ))}
                  </select>
                </div>
          
                <div className="event-group">
                  <label><FaUser /> Applicant Name *</label>
                  <input type="text" value={applicantName} onChange={handleApplicantNameChange} required />
                </div>
          
                <div className="event-group">
                  <label>Sex *</label>
                  <div className="event-radio">
                    <input type="radio" name="sex" value="Male" onChange={handleSexChange} required /> Male
                    <input type="radio" name="sex" value="Female" onChange={handleSexChange} required /> Female
                    <input type="radio" name="sex" value="Transgender" onChange={handleSexChange} required /> Transgender
                  </div>
                </div>
              </div>
          
              {/* DOB, Price, and WhatsApp Number */}
              <div className="event-row">
                <div className="event-group">
                  <label><FaCalendarAlt /> Date of Birth *</label>
                  <input type="date" value={dob} onChange={handleDobChange} required />
                </div>
          
                <div className="event-group">
                  <label><FaMobileAlt /> WhatsApp Mobile Number *</label>
                  <input
                    type="tel"
                    maxLength="10"
                    value={phoneNumber}
                    onChange={handlePhoneChange} 
                    required
                  />
                </div>
          
              </div>
          
              {/* Address Details */}
              <div className="event-row">
                <div className="event-group">
                  <label><FaMapMarkerAlt /> Pin Code *</label>
                  <input type="text" maxLength="6" value={pinCode} onChange={handlePinCodeChange} required />
                </div>
                <div className="event-group">
                  <label>District *</label>
                  <input type="text" value={district} onChange={handleDistrictChange} required />
                </div>
                <div className="event-group">
                  <label>State *</label>
                  <input type="text" value={state} onChange={handleStateChange} required />
                </div>
              </div>
          
              {/* Email & Website */}
              <div className="event-row">
                <div className="event-group">
                  <label><FaEnvelope /> Email ID *</label>
                  <input type="email" value={email} onChange={handleEmailChange} required />
                </div>
                <div className="event-group">
                  <label><FaGlobe /> Website</label>
                  <input type="text" value={website} onChange={handleWebsiteChange} />
                </div>
              </div>
          
              {/* Education & Skills */}
              <div className="event-group">
                <label><FaGraduationCap /> Educational Qualification *</label>
                <input type="text" value={education} onChange={handleEducationChange} required />
              </div>
              <div className="event-group">
                <label>Your Area of Expertise & Special Skills</label>
                <textarea value={skills} onChange={handleSkillsChange} />
              </div>
          
                  {/* File Uploads */}
              <div className="event-row">
              <div className="event-group">
  <label><FaFileUpload /> Attach Bio-data (Max 25MB) *</label>
  <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleBioDataChange} required />
                  </div>

                  <div className="event-group">
                    <label><FaCamera /> Upload Your Passport Size Photo *</label>
                    <input type="file" accept=".jpg,.jpeg,.png" onChange={handlePhotoChange} required />
                  </div>

              </div>
              <div className="event-group">
                <label><FaMoneyBillWave /> Registration Fees *</label>
                <input type="text" value={`₹${eventPrice}`} readOnly />
              </div>

              <button type="submit" className="event-submit">
                Pay ₹{eventPrice} & Register
              </button>
            </form>
          </div>
          </>
          );
          };

          export default RegisterForEvent;