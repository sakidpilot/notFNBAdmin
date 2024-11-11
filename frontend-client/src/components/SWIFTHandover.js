import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './SWIFTHandover.css';

function SwiftPage() {

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
          
        setTimeout(() => {navigate('/employeepage');}, 5000);
        
      } catch (error) {
        console.error('Invalid token:', error);
        navigate('/login');
      }
    }
  }, [navigate]);


  return (
    <div className="next-container">
      <h1>You are now being redirected to SWIFT payments...</h1>
      <p>Thank you for your payment!</p>
    </div>
  );
};

export default SwiftPage;
