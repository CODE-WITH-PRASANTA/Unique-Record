import React, { useEffect, useState } from 'react';
import './VisionSuccessCount.css';

const VisionSuccessCount = () => {
  const [counts, setCounts] = useState({
    donations: 0,
    funds: 0,
    volunteers: 0,
    projects: 0,
  });

  const handleScroll = () => {
    const section = document.querySelector('.vision-success-wrapper');
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop <= windowHeight) {
      startCounting();
      window.removeEventListener('scroll', handleScroll);
    }
  };

  const startCounting = () => {
    const targetCounts = {
      donations: 100 ,
      funds: 100 ,
      volunteers: 190 ,
      projects: 900 
    };

    const interval = 20; // Interval in milliseconds
    const steps = 100; // Number of steps for counting animation

    const incrementValues = {
      donations: targetCounts.donations / steps,
      funds: targetCounts.funds / steps,
      volunteers: targetCounts.volunteers / steps,
      projects: targetCounts.projects / steps,
    };

    const counterInterval = setInterval(() => {
      setCounts((prevCounts) => {
        const newCounts = {
          donations: Math.min(prevCounts.donations + incrementValues.donations, targetCounts.donations),
          funds: Math.min(prevCounts.funds + incrementValues.funds, targetCounts.funds),
          volunteers: Math.min(prevCounts.volunteers + incrementValues.volunteers, targetCounts.volunteers),
          projects: Math.min(prevCounts.projects + incrementValues.projects, targetCounts.projects),
        };

        if (
          newCounts.donations === targetCounts.donations &&
          newCounts.funds === targetCounts.funds &&
          newCounts.volunteers === targetCounts.volunteers &&
          newCounts.projects === targetCounts.projects
        ) {
          clearInterval(counterInterval);
        }

        return newCounts;
      });
    }, interval);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="vision-success-wrapper">
      <div className="success-metrics">
        <div className="metric-item">
          <h2 className="metric-value">{Math.floor(counts.donations)}+</h2>
          <p className="metric-label">Record Category</p>
        </div>
        <div className="metric-item">
          <h2 className="metric-value">{Math.floor(counts.funds)}+</h2>
          <p className="metric-label">URU Post Classification</p>
        </div>
        <div className="metric-item">
          <h2 className="metric-value">{Math.floor(counts.volunteers)}</h2>
          <p className="metric-label">Country Target</p>
        </div>
        <div className="metric-item">
          <h2 className="metric-value">{Math.floor(counts.projects)}</h2>
          <p className="metric-label">Volunteers</p>
        </div>
      </div>
    </div>
  );
};

export default VisionSuccessCount;