import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewAllPayments.css';

const ViewAllPayments = () => {
  const [payments, setAllPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllPayments = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
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
 
      try {
        const response = await fetch('admin/allPayments', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Error fetching payments from DB:', errorData);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAllPayments(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError('Failed to load payment data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPayments();
  }, [navigate]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="view-payments-container">
      <h2>All Online Payments</h2>
      {payments.length > 0 ? (
        <table className="payment-table">
          <thead>
            <tr>
              <th>User Account Number</th>
              <th>Date of Payment</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Provider</th>
              <th>Recipient Account Number</th>
              <th>SWIFT Code</th>
              <th>Payment Status</th> 
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.userAcc}</td>
                <td>{payment.createdAt}</td>
                <td>{payment.amount}</td>
                <td>{payment.currency}</td>
                <td>{payment.provider}</td>
                <td>{payment.accountInfo}</td>
                <td>{payment.swiftCode}</td>
                <td>{payment.transactionStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No payments found</div>
      )}
    </div>
  );
};

export default ViewAllPayments;