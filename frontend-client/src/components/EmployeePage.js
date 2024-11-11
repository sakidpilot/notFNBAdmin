import React, { useEffect } from 'react';
import './EmployeePage.css';
import { useNavigate } from 'react-router-dom';

function EmployeePage() {
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
          // If uesr is customer
          navigate('/customerpage');
        } 
      } catch (error) {
        console.error('Invalid token:', error);
        navigate('/login');
      }
    }
  }, [navigate]);


  const handleRedirectToViewAllPayments = () => {
    navigate('/viewallpayments'); // Redirect to the viewAllPayments page
  };

  const handleRedirectToVerifyAllPayments = () => {
    navigate('/verifypayments'); // Redirect to the viewAllPayments page
  };

  const handleRedirectToRegister = () => {
    navigate('/register'); // Redirect to the viewPayments page
  };

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>Welcome back Employee</h1> 
      </div>

      <div className="info-section">
        <div className="info-card">
          <h2 className="dashboard-subtitle">Create a New Account</h2>
          <p>Click here to Add a New User Profile</p>
          <button onClick={handleRedirectToRegister}>Create</button>
        </div>
        <div className="info-card">
          <h2 className="dashboard-subtitle">Verify Pending Online Transactions</h2>
          <p>Click to verify payment SWIFT Codes</p>
          <button onClick={handleRedirectToVerifyAllPayments}>Process Pending Payments</button> 
        </div>
        <div className="info-card">
          <h2 className="dashboard-subtitle">Payment History</h2>
          <p>View all approved/denied payments.</p>
          <button onClick={handleRedirectToViewAllPayments}>View All Customer Payments</button> 
        </div>
      </div>

      <footer>
        <p>@notFNB 2024</p>
      </footer>
    </div>
  );
}

export default EmployeePage;