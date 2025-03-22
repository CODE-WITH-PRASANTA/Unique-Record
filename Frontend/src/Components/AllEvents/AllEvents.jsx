import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { API_URL } from "../../Api"; 
import "./AllEvents.css";

const AllEvents = () => {
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events/all`);
        console.log("API Response:", response.data);

        if (!Array.isArray(response.data.events)) {
          throw new Error("API did not return an array");
        }

        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);


const handleRegister = (eventId, eventName, eventPrice) => {
  navigate(`/dashboard/event-registration?eventId=${eventId}&eventName=${encodeURIComponent(eventName)}&eventPrice=${eventPrice}`);
};

// ...
  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="all-event-container">
      <p className="all-event-subtitle">Archives</p>
      <h2 className="all-event-title">
        Previously Announced Events for which Online Application Date has Expired
      </h2>

      <div className="all-event-list">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div key={event._id} className="all-event-card">
              <div className="all-event-content">
                <p className="event-serial">Sl. No: {events.length - index}</p>
                <h3 className="event-name">{event.eventName}</h3>
                <p className="event-description">{event.eventDescription}</p>
                <p className="event-status">
                  <strong>Status:</strong> <span>{event.currentStatus}</span>
                </p>
                <p>
                  <strong>Organizer:</strong> {event.eventOrganizer}
                </p>
                <p><strong>Price:</strong> ₹{event.pricePerTicket}</p> {/* Show event price */}
                <div className="event-date-box">
                  <p><strong>Opening Date:</strong> {new Date(event.openingDate).toLocaleDateString()}</p>
                  <p><strong>Closing Date:</strong> {new Date(event.closingDate).toLocaleDateString()}</p>
                </div>
                <div className="event-buttons">
                  <button
                    className="register-btn"
                    onClick={() => handleRegister(event._id, event.eventName, event.pricePerTicket)} 
                  >
                    Register & Apply
                  </button>
                </div>
              </div>

              <div className="event-img-container">
                <img src={event.eventImage} alt={event.eventName} className="all-event-img" />
                <div className="event-info-overlay">
                  <p className="event-location">📍 {event.eventLocation}</p>
                  <p className="event-date">📅 {new Date(event.eventDate).toDateString()}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
};

export default AllEvents;
