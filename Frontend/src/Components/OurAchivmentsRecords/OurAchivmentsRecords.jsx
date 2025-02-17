import React from 'react';
import './OurAchivmentsRecords.css';

// Import Assets
import Achivement1 from "../../assets/blog-01.jpg";

const OurAchivmentsRecords = () => {
  return (
    <div className="achievements-container">
      <section className="achievements-main">
        <img src={Achivement1} alt="Blog" className="achievements-image" />
        <div className="achievements-content">
          <h2 className="achievements-title">Building Gains Into Housing Stocks And How To Trade The Sector</h2>
          <p className="achievements-meta">
            <span className="achievements-category">Furniture</span> | January 30
          </p>
          <p className="achievements-excerpt">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin posuere est eget lorem viverra eleifend. Quisque vel tortor sapien. Aenean tristique fermentum urna, id tincidunt nisl pharetra in...
          </p>
          <button className="achievements-read-more">Read More</button>
        </div>
      </section>

      <aside className="achievements-sidebar">
        <div className="achievements-search-box">
          <input type="text" placeholder="Search..." className="achievements-search-input" />
        </div>
        <div className="achievements-categories">
          <h3>Categories</h3>
          <ul>
            <li>Market Updates <span>(50)</span></li>
            <li>Buying Tips <span>(34)</span></li>
            <li>Interior Inspiration <span>(69)</span></li>
            <li>Investment Insights <span>(25)</span></li>
            <li>Home Construction <span>(12)</span></li>
            <li>Legal Guidance <span>(12)</span></li>
            <li>Community Spotlight <span>(69)</span></li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default OurAchivmentsRecords;