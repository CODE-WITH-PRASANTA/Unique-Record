import React, { useEffect, useRef, useState } from 'react';
import './HomeAbout.css';

// Assets
import aboutoneimg from '../../assets/Home-abot-img.jpeg';
import abouttwoimg from '../../assets/Home-abot-img.jpeg';

const HomeAbout = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // Intersection Observer to trigger animation when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.5 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className={`home-about`} ref={sectionRef}>
      <div className="home-about-container">
        {/* Left Side with Images */}
        <div className={`about-images ${ 'animate-images'}`}>
          <img src={aboutoneimg} alt="Business Team" className="about-main-img" />
          <img src={abouttwoimg} alt="Discussion" className="about-secondary-img" />
          <div className="certified-badge">
            <p className="certified-text">📜 Certified Digital Certificate</p>
          </div>
        </div>

        {/* Right Side with Text */}
        <div className="about-content">

            {/* Stylish Paragraph with Read More */}
          <div className="about-extra-section">
            <h3 className="extra-title">✨ The Grand Launch of URU Web Portal</h3>
            <p className={`extra-paragraph ${showMore ? 'expanded' : 'collapsed'}`}>
              The Grand Launch of the Web Portal of 'Unique Records of Universe' was held in Bangkok, the Capital of Thailand.
              <br/><br/>
              <strong>Bangkok, Thailand | 26 May 2025</strong>  <br />
              Inspired by the teachings of Lord Buddha and the messages of peace, the historically and culturally rich country witnessed a historic moment in Bangkok, the capital of Thailand. On the auspicious occasion of the <em>Buddha International Honor Ceremony</em> held at the Bangkok Palace Hotel on 26 May 2025, the grand launch of the web portal of <em>Unique Records of Universe</em>, conceived by litterateur and visionary <strong>Dr. Avishek Kumar,</strong> took place. Eminent personalities from all over the world made the event even more memorable with their dignified presence at this ceremony.
              <br/><br/>
              <em>'Unique Records of Universe'</em> is a unique platform that seeks to digitally bring together extraordinary individuals from around the world, their achievements, and their contribution to humanity on one platform. The aim of this web portal is to provide a global platform to inspiring unique, unique work innovations and world records, so that positive change and inspiration can be communicated in the society.
              <br/><br/>
              <strong>Glory of the ceremony and distinguished guests:</strong> The inauguration ceremony was attended by eminent personalities like the eminent guru of Buddhism Visiyan, His Majesty the King General Grand Master Professor Dato Seri, Dr. Sumapand Rathaphattaya DSC (Thailand), HIRH HE Maharaja Pangeran Duke Prince Raden Mas Ngabi of Malaysia, Advisor to the Chairman of the Police Committee of the Government of Thailand Pol. Lt. Col. Dr. Monrudi Somart, Honorary Vice Chancellor of Dharadham International Prof. Dr. Saurabh Pandey Ji Maharaj, Dr. Sunil Dubey, Mrs. Pooja Nigam and Dr. Prem Prakash (Thailand). Apart from this, hundreds of dignitaries from the country and abroad attended this ceremony and made this occasion even more special.
              <br/><br/>
              <strong>Significance and Message of the Ceremony:</strong> On this occasion, Dr. Abhishek Kumar said in his address, “Unique Records of Universe is not just a web portal, but it is a global platform that honors the excellence of humanity. It will bring to the world the stories of those extraordinary individuals, their unique, unparalleled work done by them, who have inspired the society with their work and given a message for the future.”
              <br/><br/>
              The guests present at the ceremony praised this initiative and called it a historic step. Buddhist religious guru Visian said in his blessings, “This platform will play an important role in further propagating the message of peace and compassion of Lord Buddha.” At the same time, Saudhar Shiromani Saint Dr. Saurabh Pandey Ji Maharaj said that the concept of Unique Records of Universe is unique and inspiring in itself.
              <br/><br/>
              <strong>'Unique Records of Universe': A New Beginning</strong> – This web portal will not only preserve unique world records but will also provide a global recognition to those who have made outstanding contributions in various fields such as art, culture, science, literature, and social work. The platform will also strive to bring together different countries and cultures, thereby promoting global unity and cooperation.
              <br/><br/>
              <strong>Glimpses of the Ceremony:</strong>
              <ul>
                <li>🎭 <em>Cultural Performances</em>: The ceremony featured captivating performances and dances showcasing Thailand's rich cultural heritage.</li>
                <li>🏆 <em>Felicitation Ceremony</em>: Individuals who have done outstanding work in various fields were awarded the Buddha International Award.</li>
                <li>🌍 <em>Global Participation</em>: Guests from across the world underlined the importance of this platform and expressed their desire to collaborate with it in the future.</li>
              </ul>
              <br/>
              <strong>Future Plans:</strong> Under the Unique Records of Universe, many global events, workshops, and felicitation ceremonies will be organized in the future. The platform will also launch special initiatives to inspire youth and promote innovation.
            </p>
            <button className="readmore-btn" onClick={() => setShowMore(!showMore)}>
              {showMore ? "Read Less" : "Read More"}
            </button>
          </div>



          <p className="about-subtitle">🟡🟡🟡 GET TO KNOW US</p>
          <h2 className="about-title">Digital Marked as a  URU Holder</h2>
          <p className="about-highlight">
          We Reflect the Spirit of Connecting Different Cultures, Beliefs and Abilities.
          </p>
          <p className="about-description">
          It is a symbol of extraordinary achievement, diversity, inclusiveness and universal unity, and an important link in the universe that will inspire others.
          </p>

          {/* Features */}
          <div className="about-features">
            <div className="feature-item">
              <span className="down-arrow">↙️</span> <strong>Reputation and Identity </strong>
            <p>The three stars in the URU symbol (Green, Orange, Red) represent quality, prestige and high standards. It indicates that this platform honours special merit and extraordinary work.
            </p>
            </div>
            <div className="feature-item">
              <span className="down-arrow">↙️</span> <strong>Universe and Us
              </strong>
              <p>The solar system depicted in the centre of the URU Symbol represents spiritual and scientific thinking, exploration, harmony and stability and the rainbow colours represent diversity, harmony and balance.
            </p>
            </div>
          </div>
          {/* Discover More Button */}
          <a href="/learnmore"> 
            <button  className="discover-btn" >Learn More</button>
          </a>

        


        </div>
      </div>
    </div>
  );
};

export default HomeAbout;
