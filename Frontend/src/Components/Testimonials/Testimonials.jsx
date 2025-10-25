import React, { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { API_URL } from "../../Api";
import profileDefault from "../../assets/default-profile.png";
import "./Testimonials.css";

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/freequotes/published`);
      const data = await res.json();
      if (data.success) {
        const formattedReviews = data.data.map((item) => ({
          name: item.name,
          role: item.designation || "Participant",
          image: profileDefault,
          feedback: item.message,
          expanded: false,
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

  const toggleReadMore = (index) => {
    setReviews((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  if (loading)
    return <p className="vision-testimonial-loading">Loading testimonials...</p>;
  if (error)
    return <p className="vision-testimonial-error">{error}</p>;

  return (
    <section className="vision-testimonial-section">
      <div className="vision-testimonial-header">
        <h2 className="vision-testimonial-title">What People Say About Us</h2>
        <p className="vision-testimonial-subtitle">
          Hear from our participants and clients about their experience
        </p>
      </div>

      <div className="vision-testimonial-swiper">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          slidesPerView={2}
          spaceBetween={30}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 15 },
            768: { slidesPerView: 2, spaceBetween: 30 },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="vision-testimonial-card">
                <div className="vision-testimonial-card-header">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="vision-testimonial-avatar"
                  />
                  <div className="vision-testimonial-info">
                    <h4 className="vision-testimonial-name">{review.name}</h4>
                    <p className="vision-testimonial-role">{review.role}</p>
                  </div>
                </div>
                <p className="vision-testimonial-text">
                  {review.expanded
                    ? review.feedback
                    : review.feedback.length > 150
                    ? `${review.feedback.slice(0, 150)}...`
                    : review.feedback}
                </p>
                {review.feedback.length > 150 && (
                  <button
                    className="vision-testimonial-readmore"
                    onClick={() => toggleReadMore(index)}
                  >
                    {review.expanded ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
