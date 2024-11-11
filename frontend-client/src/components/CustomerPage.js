import React, { useEffect } from 'react';
import './CustomerPage.css';
import { useNavigate } from 'react-router-dom';

function CustomerPage() {
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

        if (userRole === 'employee' || userRole === 'admin') {
          // If user is employee - re route
          navigate('/employeepage');
        } 
          
        
      } catch (error) {
        console.error('Invalid token:', error);
        navigate('/login');
      }
    }
  }, [navigate]);


  const handleRedirectToViewPayments = () => {
    navigate('/viewpayments'); // Redirect to the viewPayments page
  };

  const handleRedirectToPayments = () => {
    navigate('/payment'); // Redirect to the viewPayments page
  };

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>Welcome back Customer</h1> 
      </div>

      <div className="info-section">
        <div className="info-card">
          <h2 className="dashboard-subtitle">Payment Gateway</h2>
          <p>Click here to complete your international payments</p>
          <button onClick={handleRedirectToPayments}>Make a Payment</button>
        </div>
        <div className="info-card">
          <h2 className="dashboard-subtitle">Payments History</h2>
          <p>View all your payments.</p>
          <button onClick={handleRedirectToViewPayments}>View Your Payments</button>
        </div>
      </div>

      <footer>
        <p>@notFNB 2024</p>
      </footer>
    </div>
  );
}

export default CustomerPage;