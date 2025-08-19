import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AchiverSection.css";
import { API_URL } from '../../Api';

const AchiverSection = () => {
  const [achievers, setAchievers] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchPublishedUrus = async () => {
      try {
        const response = await fetch(`${API_URL}/uru/fetch-published-uru`);
        const data = await response.json();
        // Reverse the data to show the latest posts first
        data.reverse();
        setAchievers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPublishedUrus();
  }, []);

  const filteredAchievers =
    filter === "All"
      ? achievers
      : achievers.filter((achiever) => achiever.position === filter);

  return (
    <div className="Achiver-Details-Section">
      <h2 className="Achiver-Details-Title"> Our Achievers</h2>

      {/* Filter Buttons */}
      <div className="Achiver-Filter">
        <button
          className={`Achiver-Filter-Btn ${filter === "All" ? "active" : ""}`}
          onClick={() => setFilter("All")}
        >
          All
        </button>
        {[...new Set(achievers.map((achiever) => achiever.position))].map((position) => (
          <button
            key={position}
            className={`Achiver-Filter-Btn ${filter === position ? "active" : ""}`}
            onClick={() => setFilter(position)}
          >
            {position}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="Achiver-Details-Grid">
        {filteredAchievers.map((achiever, index) => (
          <div className="Achiver-Details-Card" key={achiever._id}>
            <img
              src={achiever.certificateUrl}
              alt={achiever.applicantName}
              className="Achiver-Details-Photo"
              onClick={() => setSelectedPhoto(achiever.certificateUrl)}
            />
            <div className="Achiver-Details-Info">
              <p className="achiver-details-serial">
              <strong>Serial No:</strong> {index + 1}
            </p>

              <p className="Achiver-Details-Serial">
                <strong>Application No:</strong> {achiever.applicationNumber}
              </p>
              <p className="Achiver-Details-Category">
                <strong>Category:</strong> {achiever.position}
              </p>
              <p className="Achiver-Details-Name">
                <strong>Name:</strong> {achiever.applicantName}
              </p>
              <p className="Achiver-Details-Provider">
                <strong>Provider:</strong> Unique Records of Universe (Managment Team)
              </p>
              <p className="Achiver-Details-Date">
                <strong>Date:</strong> {new Date(achiever.dateOfAttempt).toLocaleDateString()}
              </p>
              <div className="Achiver-Details-CardBtnWrapper">
                <Link
                  to={`/achiever/${achiever._id}`}
                  className="Achiver-Details-CardBtn"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All */}
      <div className="Achiver-Details-ViewAll">
        <button className="Achiver-Details-Btn">View All</button>
      </div>

      {/* Full Image Modal */}
      {selectedPhoto && (
        <div className="Achiver-Modal" onClick={() => setSelectedPhoto(null)}>
          <span className="Achiver-Modal-Close">&times;</span>
          <img
            src={selectedPhoto}
            alt="Full View"
            className="Achiver-Modal-Img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default AchiverSection;