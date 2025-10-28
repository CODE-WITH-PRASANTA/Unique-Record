import React, { useState, useEffect } from "react";
import { API_URL } from "../../Api";
import { useLocation, useNavigate } from "react-router-dom";
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

const RegisterForEvent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventPrice, setEventPrice] = useState(0);

  const [applicantName, setApplicantName] = useState("");
  const [sex, setSex] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // optional
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState(""); // optional
  const [bioData, setBioData] = useState(null);
  const [photo, setPhoto] = useState(null);

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
    const selectedEvent = events.find((event) => event.eventName === e.target.value);
    if (selectedEvent) {
      setEventName(selectedEvent.eventName);
      setEventPrice(selectedEvent.pricePerTicket);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!bioData || !photo) {
      alert("Please upload both biodata and photo!");
      return;
    }

    if (phoneNumber.length !== 10) {
      alert("Phone number must be exactly 10 digits!");
      return;
    }

    try {
      // Upload biodata and photo
      const formData = new FormData();
      formData.append("biodata", bioData);
      formData.append("photo", photo);

      const uploadResponse = await axios.post(`${API_URL}/upload/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { biodataUrl, photoUrl } = uploadResponse.data;
      if (!biodataUrl || !photoUrl) {
        alert("File upload failed! Please try again.");
        return;
      }

      // Create Razorpay order
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
            try {
              const registerRes = await axios.post(`${API_URL}/registerevent/register`, {
                eventName,
                applicantName,
                sex,
                dateOfBirth: dob,
                phone: phoneNumber,
                pinCode,
                district,
                state,
                email,
                website,
                education,
                skills,
                bioDataUrl: biodataUrl,
                passportPhotoUrl: photoUrl,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount: data.order.amount / 100,
                currency: data.order.currency,
                method: "Razorpay",
                status: "SUCCESS",
              });

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
                  registration: registerRes.data.data,
                },
              });
            } catch (err) {
              console.error("Error saving registration:", err);
              alert("Registration failed after payment!");
            }
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
      alert("Something went wrong. Please try again!");
    }
  };

  return (
    <>
      <h1 className="event-registaion-page heading">
        Unique Records of Universe <span>Digitally Marking The Extraordinary Achievement</span>
      </h1>

      <div className="event-container">
        <h2 className="event-heading">Event Registration Form</h2>
        <form className="event-form" onSubmit={handlePayment}>
          <div className="event-row">
            <div className="event-group">
              <label><FaCalendarAlt /> Event Name *</label>
              <select value={eventName} onChange={handleEventChange} required>
                <option value="">Select an Event</option>
                {events.map((event) => (
                  <option key={event._id} value={event.eventName}>
                    {event.eventName}
                  </option>
                ))}
              </select>
            </div>

            <div className="event-group">
              <label><FaUser /> Applicant Name *</label>
              <input type="text" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} required />
            </div>

            <div className="event-group">
              <label>Sex *</label>
              <div className="event-radio">
                <input type="radio" name="sex" value="Male" onChange={(e) => setSex(e.target.value)} required /> Male
                <input type="radio" name="sex" value="Female" onChange={(e) => setSex(e.target.value)} required /> Female
                <input type="radio" name="sex" value="Transgender" onChange={(e) => setSex(e.target.value)} required /> Transgender
              </div>
            </div>
          </div>

          <div className="event-row">
            <div className="event-group">
              <label><FaCalendarAlt /> Date of Birth *</label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
            </div>
            <div className="event-group">
              <label><FaMobileAlt /> WhatsApp Mobile Number *</label>
              <input type="tel" maxLength="10" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            </div>
          </div>

          <div className="event-row">
            <div className="event-group">
              <label><FaMapMarkerAlt /> Pin Code *</label>
              <input type="text" maxLength="6" value={pinCode} onChange={(e) => setPinCode(e.target.value)} required />
            </div>
            <div className="event-group">
              <label>District *</label>
              <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} required />
            </div>
            <div className="event-group">
              <label>State *</label>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} required />
            </div>
          </div>

          <div className="event-row">
            <div className="event-group">
              <label><FaEnvelope /> Email ID *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="event-group">
              <label><FaGlobe /> Website (Optional)</label>
              <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
          </div>

          <div className="event-group">
            <label><FaGraduationCap /> Educational Qualification *</label>
            <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} required />
          </div>

          <div className="event-group">
            <label>Your Area of Expertise & Special Skills (Optional)</label>
            <textarea value={skills} onChange={(e) => setSkills(e.target.value)} />
          </div>

          <div className="event-row">
            <div className="event-group">
              <label><FaFileUpload /> Attach Bio-data (Max 25MB) *</label>
              <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setBioData(e.target.files[0])} required />
            </div>
            <div className="event-group">
              <label><FaCamera /> Upload Your Passport Size Photo *</label>
              <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setPhoto(e.target.files[0])} required />
            </div>
          </div>

          <div className="event-group">
            <label><FaMoneyBillWave /> Registration Fees *</label>
            <input type="text" value={`₹${eventPrice}`} readOnly />
          </div>

          <button type="submit" className="event-submit">Pay ₹{eventPrice} & Register</button>
        </form>
      </div>
    </>
  );
};

export default RegisterForEvent;
