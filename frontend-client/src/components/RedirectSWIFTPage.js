// RedirectPage.js
import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './RedirectSWIFTPage.css';

function RedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } 
    else {
      try {
        const userRole = localStorage.getItem('role');

        if (userRole === 'user') {
          // If user is customer - re route
          navigate('/customerpage');
        } 
          
        
      } catch (error) {
        console.error('Invalid token:', error);
        navigate('/login');
      }
    }
  }, [navigate]);


  const handleProceed = () => {
    navigate('/swifthandover');
  };

  return (
    <div className="redirect-container">
      <h1>Welcome to the Redirect Page</h1>
      <button className="proceed-button" onClick={handleProceed}>
        Proceed to SWIFT
      </button>
    </div>
  );
};

export default RedirectPage;
