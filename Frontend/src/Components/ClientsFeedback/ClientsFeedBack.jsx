import React, { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { API_URL } from "../../Api";

// Default profile image
import DefaultUser from "../../assets/default-profile.png";

import "./ClientsFeedBack.css";

const ClientFeedBack = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch published free quotes
  const fetchPublishedQuotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/freequotes/published`);
      const result = await response.json();
      if (result.success) {
        setFeedbacks(result.data);
      } else {
        setError("Failed to load published feedback.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching feedback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedQuotes();
  }, []);

  return (
    <div className="full-feedback-sec">
      <div className="client-feedback">
        <h2 className="client-section-title">Your Responses</h2>

        {loading && <p>Loading feedback...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <Swiper
          modules={[Pagination]}
          spaceBetween={30}
          pagination={{ clickable: true }}
          className="feedback-swiper"
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {feedbacks.length > 0 ? (
            feedbacks.map((client) => (
              <SwiperSlide key={client._id}>
                <div className="feedback-card">
                  <p className="feedback-text">&ldquo;{client.message}&rdquo;</p>
                  <div className="client-info">
                    <img
                      src={DefaultUser}
                      alt={client.name}
                      className="client-image"
                    />
                    <div>
                      <h3 className="client-name">{client.name}</h3>
                      <p className="client-role">
                        {client.designation || client.address || "Valued User"}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              No published feedback available.
            </p>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default ClientFeedBack;
