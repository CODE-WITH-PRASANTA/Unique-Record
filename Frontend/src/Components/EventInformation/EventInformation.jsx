import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../Api"; // Import API_URL
import "./EventInformation.css";

const EventInformation = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
      Current Openings <span className="event-information-bold">Online Registration for Participation in Events Organized/Conduct by URU & DPKHRC Trust which is Currently going on</span>
      </h2>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="event-information-cards">
          {events.length > 0 ? (
            events.map((event, index) => (
              <div key={index} className="event-information-card">
                <img src={event.eventImage} alt={event.eventName} className="event-information-image" />

                <div className="event-information-details">
                  <h3 className="event-information-title">{event.eventName}</h3>
                  <p className="event-information-description">{event.eventDescription}</p>

                  <div className="event-information-meta">
                    <p><strong>📍 Location:</strong> {event.eventLocation}</p>
                    <p><strong>📅 Event Date:</strong> {new Date(event.eventDate).toDateString()}</p>
                    <p><strong>👤 Organizer:</strong> {event.eventOrganizer}</p>
                    <p><strong>🕒 Opening Date:</strong> {new Date(event.openingDate).toDateString()}</p>
                    <p><strong>🚪 Closing Date:</strong> {new Date(event.closingDate).toDateString()}</p>
                    <p><strong>🔴 Status:</strong> <span className={`status-${event.currentStatus.toLowerCase()}`}>{event.currentStatus}</span></p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No events found in this category.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventInformation;
