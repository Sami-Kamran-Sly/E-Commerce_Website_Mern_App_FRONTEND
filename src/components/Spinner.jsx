import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3); // Countdown starts at 3 seconds
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => {
        const newValue = prevValue - 1;
        if (newValue <= 0) {
          clearInterval(interval);  // Clear the interval before navigating
          navigate(`/${path}`, {
            state: { from: location.pathname },
          });
        }
        return newValue;
      });
    }, 1000); // Decrease count every second

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [navigate, location, path]);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <h1 className="text-center">Redirecting you in {count} second{count !== 1 && 's'}...</h1>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
