import React, { useState, useEffect } from "react";
import { API_URL } from "../../Api"; // Adjust the path if needed
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
const [phoneNumber, setPhoneNumber] = useState("");  // State to store phone number
  const location = useLocation();
  const [events, setEvents] = useState([]); // Store ongoing events
  const [eventName, setEventName] = useState("");
  const [eventPrice, setEventPrice] = useState(0);
const navigate = useNavigate();

const handlePhoneChange = (e) => {
  setPhoneNumber(e.target.value);
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
    setEvents(response.data.events); // Store fetched events
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};
    fetchEvents();
  }, [location.search]);

  // Handle event selection
  const handleEventChange = (e) => {
    const selectedEvent = events.find(event => event.eventName === e.target.value);
    setEventName(selectedEvent.eventName);
    setEventPrice(selectedEvent.pricePerTicket);
  };

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/payment/create-order`, {
        amount: eventPrice,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        phone: phoneNumber,  // Pass dynamic phone number
      });
  
      const options = {
        key: "rzp_live_1gSA9RbSjj0sEj",  // Replace with your Razorpay Key ID
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Unique Records of Universe",
        description: "Event Registration Fee",
        order_id: data.order.id,
        handler: async (response) => {
          const verifyRes = await axios.post(`${API_URL}/payment/verify-payment`, response);
          
          if (verifyRes.data.success) {
            // Redirect to PaymentSuccess page with order details
            navigate("/payment-success", {
              state: {
                order: {
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  amount: data.order.amount / 100,  // Convert from paise to INR
                  currency: data.order.currency,
                  phone: phoneNumber,  // Pass phone number
                  date: new Date().toLocaleString(),
                  method: "Razorpay",
                  status: "SUCCESS",
                },
              },
            });
          } else {
            alert("Payment Verification Failed!");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: phoneNumber,  // Prefill with the phone number
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };
  

  return (
    <>
    <h1 className="event-registaion-page heading">Unique Records of Universe <span>Digitally Marking The Extraordinary Achievement</span></h1>
    <div className="event-container">
      <h2 className="event-heading">Event Registration Form</h2>
      <form className="event-form">
        
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
            <input type="text" required />
          </div>

          <div className="event-group">
            <label>Sex *</label>
            <div className="event-radio">
              <input type="radio" name="sex" value="Male" required /> Male
              <input type="radio" name="sex" value="Female" required /> Female
              <input type="radio" name="sex" value="Transgender" required /> Transgender
            </div>
          </div>
        </div>

        {/* DOB, Price, and WhatsApp Number */}
        <div className="event-row">
          <div className="event-group">
            <label><FaCalendarAlt /> Date of Birth *</label>
            <input type="date" required />
          </div>

          <div className="event-group">
  <label><FaMobileAlt /> WhatsApp Mobile Number *</label>
  <input
    type="tel"
    maxLength="10"
    value={phoneNumber}
    onChange={handlePhoneChange}  // Capture user input
    required
  />
</div>

        </div>

        {/* Address Details */}
        <div className="event-row">
          <div className="event-group">
            <label><FaMapMarkerAlt /> Pin Code *</label>
            <input type="text" maxLength="6" required />
          </div>
          <div className="event-group">
            <label>District *</label>
            <input type="text" required />
          </div>
          <div className="event-group">
            <label>State *</label>
            <input type="text" required />
          </div>
        </div>

        {/* Email & Website */}
        <div className="event-row">
          <div className="event-group">
            <label><FaEnvelope /> Email ID *</label>
            <input type="email" required />
          </div>
          <div className="event-group">
            <label><FaGlobe /> Website</label>
            <input type="url" />
          </div>
        </div>

        {/* Education & Skills */}
        <div className="event-group">
          <label><FaGraduationCap /> Educational Qualification *</label>
          <input type="text" required />
        </div>
        <div className="event-group">
          <label>Your Area of Expertise & Special Skills</label>
          <textarea></textarea>
        </div>
       
        <div className="event-group">
          <label>Your Area of Expertise & Special Skills</label>
          <textarea></textarea>
        </div>

        {/* File Uploads */}
        <div className="event-row">
          <div className="event-group">
            <label><FaFileUpload /> Attach Bio-data (Max 25MB) *</label>
            <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" required />
          </div>
          <div className="event-group">
            <label><FaCamera /> Upload Your Passport Size Photo *</label>
            <input type="file" accept=".jpg,.jpeg,.png" required />
          </div>
        </div>
        <div className="event-group">
          <label>Any Other Information : </label>
          <input type="text" required />
        </div>
        <div className="event-group">
            <label><FaMoneyBillWave /> Registation Fees *</label>
            <input type="text" value={`₹${eventPrice}`} readOnly />
          </div>

       <button type="button" onClick={handlePayment} className="event-submit">
            Pay ₹{eventPrice} & Register
          </button>
      </form>
    </div>
    </>
  );
};

export default RegisterForEvent;
