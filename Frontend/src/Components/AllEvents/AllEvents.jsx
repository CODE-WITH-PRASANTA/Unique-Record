import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { API_URL } from "../../Api"; 
import "./AllEvents.css";

const AllEvents = () => {
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchOngoingEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events/status/Ongoing`);
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

    fetchOngoingEvents();
  }, []);

  const handleRegister = (eventId, eventName, eventPrice) => {
    navigate(`/dashboard/event-registration?eventId=${eventId}&eventName=${encodeURIComponent(eventName)}&eventPrice=${eventPrice}`);
  };

  const toggleReadMore = (eventId) => {
    setExpanded((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  if (loading) return <p>Loading ongoing events...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="all-event-container">
      <p className="all-event-subtitle">Current Openings </p>
      <h2 className="all-event-title">Online Registration for Participation in Events Organized/Conduct by URU & DPKHRC Trust which is Currently going on</h2>

      <div className="all-event-list">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div key={event._id} className="all-event-card">
              <div className="all-event-content">
                <p className="event-serial">Sl. No: {events.length - index}</p>
                <h3 className="event-name">{event.eventName}</h3>
                <p className="event-description">
                  {expanded[event._id] ? event.eventDescription : truncateText(event.eventDescription, 50)}
                  <span 
                    className="read-more-btn" 
                    onClick={() => toggleReadMore(event._id)}
                    style={{ color: "blue", cursor: "pointer", marginLeft: "5px" }}
                  >
                    {expanded[event._id] ? "Read Less" : "Read More"}
                  </span>
                </p>
                <p><strong>Organizer:</strong> {event.eventOrganizer}</p>
                <p><strong>Registration Fee :</strong> ₹{event.pricePerTicket}</p>
                <p><strong>Event Location :</strong>📍 {event.eventLocation}</p>
                <p><strong>Event Date : </strong>📅 {new Date(event.eventDate).toDateString()}</p>
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
              </div>
            </div>
          ))
        ) : (
          <p>No ongoing events found.</p>
        )}
      </div>
    </div>
  );
};

export default AllEvents;
