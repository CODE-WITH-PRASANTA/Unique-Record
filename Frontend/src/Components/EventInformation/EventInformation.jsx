import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { API_URL } from "../../Api"; // Import API_URL
import "./EventInformation.css";

const EventInformation = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Use navigate for redirection

  useEffect(() => {
    axios
      .get(`${API_URL}/events/category/Top%20Category`) // Use API_URL
      .then((response) => {
        setEvents(response.data.events || []); // Ensure it's an array
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="event-information-container">
      <h2 className="event-information-heading">
        Current Openings{" "}
        <span className="event-information-bold">
          Online Registration for Participation in Events Organized/Conducted by URU & DPKHRC Trust is Currently Ongoing
        </span>
      </h2>

      {loading ? (
        <p>Loading events...</p>
      ) : events.length > 0 ? (
        <>
          <div className="event-information-cards">
            {events.map((event, index) => (
              <div key={index} className="event-information-card">
                <div className="event-information-image-container">
                  <img src={event.eventImage} alt={event.eventName} className="event-information-image" />
                  <span className={`information-event-status status-${event.currentStatus.toLowerCase()}`}>
                    {event.currentStatus}
                  </span>
                </div>

                <div className="event-information-details">
                  <h3 className="event-information-title">{event.eventName}</h3>
                  <p className="event-information-description">{event.eventDescription}</p>

                  <div className="event-information-meta">
                    <p><strong>📍 Location:</strong> {event.eventLocation}</p>
                    <p><strong>📅 Event Date:</strong> {new Date(event.eventDate).toDateString()}</p>
                    <p><strong>👤 Organizer:</strong> {event.eventOrganizer}</p>
                    <p><strong>🕒 Opening Date:</strong> {new Date(event.openingDate).toDateString()}</p>
                    <p><strong>🚪 Closing Date:</strong> {new Date(event.closingDate).toDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="view-all-container">
            <button className="view-all-btn" onClick={() => navigate("/event")}>
              View All Events
            </button>
          </div>
        </>
      ) : (
        <p>No events found in this category.</p>
      )}
    </div>
  );
};

export default EventInformation;
