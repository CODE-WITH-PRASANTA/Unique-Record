import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutOwner.css';
import aboutusimg from '../../assets/about.png';

const AboutOwner = () => {
  const navigate = useNavigate();

  // Function to navigate to the Contact Us page
  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <section className="about-owner-section">
      <div className="about-owner-container">
        <h2 className="about-owner-title">Welcome To "Unique Records of Universe"</h2>
        <p className="about-owner-mission">Imagineer of the "Unique Record of the Universe"</p>

        <div className="about-owner-content">
          {/* Text Section */}
          <div className="about-owner-text">
            <h3>
              The initiative named "Unique Records of Universe" is indeed a different, wonderful
              and unique in itself which focuses on digitally marking the extraordinary achievements,
              unique works earned by any person, society, institution or organization. And along with
              recording and encouraging them in the digital archives of the universe, its aim is to inspire
              the coming generations and develop in them the spirit of doing something positive.
            </h3>

            <p>
              If you have any extraordinary achievement or any activity which you believe is unique and
              can inspire others in the future, then you can stop by this website and understand more
              about it and see the process of applying, understand and then take further action. This
              initiative provides a platform for those people who want to get recognition for their
              extraordinary achievements, activities and they want to preserve their work for the
              coming generations. It will not only be useful for them but will definitely give them
              immortality in history.
            </p>

            <p>
              From the very beginning of creation, we all have been learning and understanding a lot from
              our forefathers and with the change of time, we have been doing something new and unique. In
              other words, we have been able to build a new mound, destination, home on the path shown by
              those ancestors. When such an aspect guides us in any field, then undoubtedly the work
              capacity and energy increases and achieving the goal becomes easy.
            </p>

            <p>
              Extraordinary feats have been done by all the people and great men who have come to this
              world, which have remained a source of inspiration for every present generation through books
              for centuries and currently through the communication revolution. At the same time, there are
              many positive feats done by such people which should have come in front of the country, world,
              society, but have not come till now..! The reason for this can be anything, such as no one has
              paid attention to those activities..! Or they may not have had any accurate information or suitable
              option about how to secure these achievements and activities for the future or it may be costing
              so much money to register these achievements and activities that they did not pay attention to it.
              Anything can happen. So you can succeed in giving a global recognition to your hard work, sacrifice,
              penance and out-of-the-box work through this website without any hesitation and without any worry
              under a simple process. Our best wishes are with you.
            </p>

            {/* Contact Button */}
            <button className="discover-btn" onClick={handleContactClick}>
              Contact Us
            </button>
          </div>

          {/* Image Section */}
          <div className="about-owner-image">
            <img src={aboutusimg} alt="Profile" />
            <div className="fl-about-owner-img-content">
              <h4>Dr. Avishek Kumar</h4>
              <p>Chief Managing Director</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutOwner;
