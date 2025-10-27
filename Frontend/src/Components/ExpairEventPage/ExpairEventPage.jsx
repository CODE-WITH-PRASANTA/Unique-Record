import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ExpairEventPage.css";
import { Swiper as AgentSwiper, SwiperSlide as AgentSwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { API_URL } from "../../Api";
import DOMPurify from "dompurify"; // ✅ Sanitize HTML safely

const ExpairEventPage = () => {
  const [expiredEvents, setExpiredEvents] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchExpiredEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events/status/Date%20Over`);
        setExpiredEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching expired events:", error);
      }
    };
    fetchExpiredEvents();
  }, []);

  const toggleReadMore = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const renderDescription = (desc, index) => {
    if (!desc) return "";

    const sanitizedDesc = DOMPurify.sanitize(desc);
    const plainText = sanitizedDesc.replace(/<[^>]+>/g, "");

    if (expanded[index]) {
      return (
        <div className="expair-event-description">
          <div dangerouslySetInnerHTML={{ __html: sanitizedDesc }} />
          <button className="ExpairEvent-readmore" onClick={() => toggleReadMore(index)}>
            Read Less
          </button>
        </div>
      );
    } else {
      const truncated = plainText.length > 120 ? plainText.substring(0, 120) + "..." : plainText;
      return (
        <div className="expair-event-description">
          {truncated}
          {plainText.length > 120 && (
            <button className="ExpairEvent-readmore" onClick={() => toggleReadMore(index)}>
              Read More
            </button>
          )}
        </div>
      );
    }
  };

  return (
    <div className="expair-event-full-sec">
      <section className="expair-event-section">
        <h5 className="expair-event-subtitle">Archives</h5>
        <h2 className="expair-event-main-title">
          Previously Announced Events for which Online Application Date has Expired
        </h2>

        {/* ✅ Mobile Swiper View */}
        <div className="expair-event-swiper-container">
          <AgentSwiper
            slidesPerView={1}
            spaceBetween={10}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="expair-event-mobile-swiper"
          >
            {expiredEvents.map((event, index) => (
              <AgentSwiperSlide key={index} className="expair-event-card">
                <div className="expair-event-thumbnail">
                  <img src={event.eventImage} alt={event.eventName} />
                  <span className="expair-event-date-badge">
                    {new Date(event.eventDate).toDateString()}
                  </span>
                </div>
                <div className="expair-event-details">
                  <p className="expair-event-author">
                    <strong>#{index + 1}</strong> | By {event.eventOrganizer} |{" "}
                    {event.eventLocation}
                  </p>
                  <h3 className="expair-event-title">{event.eventName}</h3>
                  {renderDescription(event.eventDescription, index)}
                </div>
              </AgentSwiperSlide>
            ))}
          </AgentSwiper>
        </div>

        {/* ✅ Desktop Grid View */}
        <div className="expair-event-grid">
          {expiredEvents.map((event, index) => (
            <article key={index} className="expair-event-card">
              <div className="expair-event-thumbnail">
                <img src={event.eventImage} alt={event.eventName} />
                <span className="expair-event-date-badge">
                  {new Date(event.eventDate).toDateString()}
                </span>
              </div>
              <div className="expair-event-details">
                <p className="expair-event-author">
                  <strong>Sl No. : {index + 1}</strong> | By {event.eventOrganizer} |{" "}
                  {event.eventLocation}
                </p>
                <h3 className="expair-event-title">{event.eventName}</h3>
                {renderDescription(event.eventDescription, index)}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ExpairEventPage;
