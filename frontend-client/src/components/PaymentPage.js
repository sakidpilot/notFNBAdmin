import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const PaymentPage = () => {
  const [userAcc, setUserAcc] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ZAR');
  const [provider, setProvider] = useState('SWIFT');
  const [accountInfo, setAccountInfo] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
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

      // If token is valid, you can proceed to load your component's data or setup
      setIsLoading(false);
    };

    validateToken();
  }, [navigate]);

  const validateForm = () => {
    let newErrors = {};
    if (!userAcc) newErrors.userAcc = "Your account is required.";
    if (!amount) newErrors.amount = "Amount is required.";
    if (!accountInfo) newErrors.accountHolder = "Recipient account number is required.";
    if (!swiftCode) newErrors.swiftCode = "SWIFT code is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setSubmitError('Session expired. Please log in again.');
      navigate('/');
      return;
    }

    const paymentData = {
      userAcc,
      amount,
      currency,
      provider,
      accountInfo,
      swiftCode,
    };

    try {
      const response = await fetch('payment/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.ok) {
        console.log('Payment details saved successfully');
        navigate('/customerpage');
      } else {
        if (response.status === 401 || data.message === 'token invalid') {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setSubmitError(data.message || 'Failed to process payment. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error during payment submission:', error);
      setSubmitError('An error occurred. Please try again later.');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="payment-container">
    <h2>Make Payment</h2>
    {submitError && <div className="error-message">{submitError}</div>}
    <form className="payment-form" onSubmit={handleSubmit}>
      <div className="form-content">
        <div className="left-column">
        <label htmlFor="userAcc">Your account number:</label>
            <input
              type="number"
              id="userAcc"
              placeholder="Enter your details"
              value={userAcc}
              onChange={(e) => setUserAcc(e.target.value)}
              required
            />
          <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          <label htmlFor="currency">Currency:</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
          >
            <option value="ZAR">ZAR</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>

          <label htmlFor="provider">Payment Provider:</label>
          <select
            id="provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            required
          >
            <option value="SWIFT">SWIFT</option>
            <option value="PAYFAST">PAYFAST</option>
          </select>
        </div>
        <div className="spacer"></div>
        <div className="right-column">

          <label htmlFor="accountInfo">Recipient Account Number:</label>
          <input
            type="text"
            id="accountInfo"
            placeholder="Enter account number"
            value={accountInfo}
            onChange={(e) => setAccountInfo(e.target.value)}
            required
          />
          {errors.accountNumber && <p className="error">{errors.accountInfo}</p>}

          <label htmlFor="swiftCode">SWIFT Code:</label>
          <input
            type="text"
            id="swiftCode"
            placeholder="Enter SWIFT code"
            value={swiftCode}
            onChange={(e) => setSwiftCode(e.target.value)}
            required
          />
          {errors.swiftCode && <p className="error">{errors.swiftCode}</p>}
        </div>
      </div>

        <button type="submit" className="submit-button">Submit Payment</button>
      </form>
    </div>
  );
};

export default PaymentPage;