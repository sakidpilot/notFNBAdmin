import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentVerificationPage.css';

const VerifyPayments = () => {
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

      try {
        const response = await fetch('admin/pendingPayments', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching payments');
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

  const handleUpdateStatus = async (paymentId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`admin/verifyPayment/${paymentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transactionStatus: 'Completed' }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) { 
        throw new Error('Error updating payment status');
      }

      // Refresh the payment list
      setAllPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === paymentId
            ? { ...payment, transactionStatus: 'Completed' }
            : payment
        )
      );

      // Redirect to swift
      setTimeout(() => {navigate('/redirect');}, 3500);
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

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
              <th>Verify the Payment</th>
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
                <td>
                  <button
                    className="update-button"
                    onClick={() => handleUpdateStatus(payment._id)}
                  >
                    Verify SWIFT Code
                  </button>
                </td>
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

export default VerifyPayments;
