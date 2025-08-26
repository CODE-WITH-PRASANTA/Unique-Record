import React, { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { API_URL } from '../../Api'; // e.g., "http://localhost:5007/api"
import profileDefault from "../../assets/default-profile.png"; // default profile image
import "./Testimonials.css";

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch published quotes from backend
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/freequotes/published`);
      const data = await res.json();
      if (data.success) {
        // Map backend data to review format
        const formattedReviews = data.data.map((item) => ({
          name: item.name,
          role: item.designation || "Participant",
          image: profileDefault,
          feedback: item.message,
        }));
        setReviews(formattedReviews);
      } else {
        setError("Failed to fetch testimonials");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading testimonials...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <section className="Testimonials-section">
      <div className="Testimonials-header">
        <h2>What people say about us</h2>
      </div>

      <div className="Testimonials-desktop">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          slidesPerView={2}
          spaceBetween={20}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index} className="Testimonials-card">
              <div className="Testimonials-cardHeader">
                <img src={review.image} alt={review.name} className="Testimonials-avatar" />
                <div>
                  <h4>{review.name}</h4>
                  <p>{review.role}</p>
                </div>
              </div>
              <p className="Testimonials-text">{review.feedback}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="Testimonials-mobile">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          slidesPerView={1}
          spaceBetween={10}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index} className="Testimonials-card">
              <div className="Testimonials-cardHeader">
                <img src={review.image} alt={review.name} className="Testimonials-avatar" />
                <div>
                  <h4>{review.name}</h4>
                  <p>{review.role}</p>
                </div>
              </div>
              <p className="Testimonials-text">{review.feedback}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
