import React, { useEffect, useState } from "react";
import { RingLoader } from "react-spinners";

const Loader = ({ loading }) => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timer;
    if (loading) {
      setShowLoader(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.body.style.overflow = "hidden";
    } else {
      timer = setTimeout(() => {
        setShowLoader(false);
        document.body.style.overflow = "auto";
      }, 800); // slightly longer for smoothness
    }
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: showLoader
          ? "linear-gradient(135deg, #0d0d0d, #1e1e2f, #24243e, #302b63, #0f0c29)"
          : "transparent",
        backgroundSize: "400% 400%",
        zIndex: 9999,
        opacity: showLoader ? 1 : 0,
        visibility: showLoader ? "visible" : "hidden",
        transition: "opacity 1s ease, visibility 1s ease",
        animation: showLoader ? "gradientShift 6s ease infinite" : "none",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            filter: "drop-shadow(0 0 25px rgba(212, 175, 55, 0.7))",
            animation: "pulseGlow 2s infinite ease-in-out",
          }}
        >
          <RingLoader color="#d4af37" size={120} />
        </div>

        <p
          style={{
            color: "#ffd700",
            marginTop: "25px",
            fontSize: "20px",
            fontWeight: "700",
            letterSpacing: "2px",
            fontFamily: "Poppins, sans-serif",
            textTransform: "uppercase",
            textShadow: "0 0 10px rgba(255, 215, 0, 0.6)",
            animation: "floatText 2.5s infinite ease-in-out",
          }}
        >
          Loading...
        </p>
      </div>

      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes pulseGlow {
            0%, 100% { filter: drop-shadow(0 0 15px rgba(212,175,55,0.4)); }
            50% { filter: drop-shadow(0 0 35px rgba(212,175,55,0.9)); }
          }

          @keyframes floatText {
            0%, 100% { transform: translateY(0); opacity: 0.8; }
            50% { transform: translateY(-10px); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
