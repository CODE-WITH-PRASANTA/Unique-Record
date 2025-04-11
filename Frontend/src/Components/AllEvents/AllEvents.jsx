import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { API_URL } from "../../Api"; 
import "./AllEvents.css";
import DOMPurify from 'dompurify';

import { useLocation } from "react-router-dom";



const AllEvents = () => {
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const sharedEventId = queryParams.get("eventId");


  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchOngoingEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events/status/Ongoing`);
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

  useEffect(() => {
    if (!loading && sharedEventId) {
      const element = document.getElementById(`event-${sharedEventId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [loading, sharedEventId]);

  
  const handleShare = (event) => {
    const shareUrl = `${window.location.origin}/event?eventId=${event._id}`;
    const shareText = `🌟 Check out this event: ${event.eventName}\n📅 Date: ${new Date(event.eventDate).toDateString()}\n📍 Location: ${event.eventLocation}\n🔗 ${shareUrl}`;

    if (navigator.share) {
      navigator.share({
        title: event.eventName,
        text: shareText,
        url: shareUrl,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (loading) return <p>Loading ongoing events...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="all-event-container">
      <p className="all-event-subtitle">Current Openings </p>
      <h2 className="all-event-title">
        Online Registration for Participation in Events Organized/Conduct by URU & DPKHRC Trust which is Currently going on
      </h2>

      <div className="all-event-list">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div key={event._id} id={`event-${event._id}`} className="all-event-card">
              <div className="all-event-content">
                <p className="event-serial">Sl. No: {events.length - index}</p>
                <h3 className="event-name">{event.eventName}</h3>
                <div className="event-description">
                  <div
                    className="event-description-html"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        expanded[event._id]
                          ? event.eventDescription
                          : truncateText(event.eventDescription, 50)
                      ),
                    }}
                  />
                  {event.eventDescription.split(" ").length > 50 && (
                    <span
                      className="all-read-more-btn"
                      onClick={() => toggleReadMore(event._id)}
                    >
                      {expanded[event._id] ? "Read Less ▲" : "Read More ▼"}
                    </span>
                  )}
                </div>
                <p className="All-Events-Organizer"><strong>Organizer:</strong> {event.eventOrganizer}</p>
                <p className="All-Events-RegistrationFee"><strong>Registration Fee :</strong> ₹{event.pricePerTicket}</p>
                <p className="All-Events-Location"><strong>Event Location :</strong> 📍 {event.eventLocation}</p>
                <p className="All-Events-Date"><strong>Event Date : </strong> 📅 {new Date(event.eventDate).toDateString()}</p>

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
                  <button
                    className="share-btn"
                    onClick={() => handleShare(event)}
                  >
                    🔗 Share
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
