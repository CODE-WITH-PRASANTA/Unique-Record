import React from 'react';
import './Home.css';
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';

// Import assets
import stackimg from '../../assets/banner-img.png';
import HomeAbout from '../../Components/HomeAbout/HomeAbout';
import WhyChooseUs from '../../Components/HomeWhyChooseus/WhyChooseUs';
import MeetOurAgent from '../../Components/MeetOurAgent/MeetOurAgent';
import HomeFaq from '../../Components/HomeFaq/HomeFaq';
import FreeQuotes from '../../Components/GetFreeQuotes/FreeQuotes';
import StyledBlog from '../../Components/LatestBlog/LatestBlog';
import OurVision from '../../Components/OurVision/OurVision';
import Rotation from '../../Components/Rotation/Rotation';

const Home = () => {
  return (
    <>
    <div className="home-home-container">
      <section className="banner-section">
        <div className="banner-social-area">
          <ul className="social-icons">
            <li><a href="#0"><FaFacebookF /></a></li>
            <li><a href="#0"><FaTwitter /></a></li>
            <li><a href="#0"><FaYoutube /></a></li>
            <li><a href="#0"><FaInstagram /></a></li>
          </ul>
        </div>
        <div className="home-container">
          <div className="banner-content">
            <h2 className="sub-title"><span>Unique </span>Records of Universe </h2>
            <h1 className="main-title">Digitally Marking The Extraordinary Achievement</h1>
            <p className="description">
            If you have any amazing, unique Records or Activity to share with coming generations and to develop in them the spirit of doing something positive for the welfare of the people, then get it recorded in the digital archives of the universe.
            </p>
            <div className="banner-buttons">
              <a href="#make-your-trip" className="btn btn-primary">Apply Now</a>
              <a href="#request-quote" className="btn btn-secondary">See The Demo</a>
            </div>
          </div>
          <div className="banner-image">
            <img src={stackimg} alt="Private Jet" className="jet-animation" />
          </div>
        </div>
      </section>
    </div>
    <HomeAbout />
    <WhyChooseUs />
    <MeetOurAgent />
    <Rotation />
    <StyledBlog />
    <OurVision />
    <FreeQuotes />
    <HomeFaq />

    </>
  );
};

export default Home;
