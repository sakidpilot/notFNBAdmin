import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './LoginPage.css';
import { jwtDecode } from 'jwt-decode';

function LoginPage() {
  const [formData, setFormData] = useState({
    name: '',
    accountNum: '',
    password: '',
  });

  const [errors, setErrors] = useState(''); // State to store error messages
  const [loading, setLoading] = useState(false); // To display loading state

  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };




  // Client-side validation for login form
  const validateForm = () => {
    const nameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    if (!nameRegex.test(formData.name)) {
      setErrors('Username can only contain letters and numbers.');
      return false;
    }

    if (!passwordRegex.test(formData.password)) {
      setErrors('Password must be at least 8 characters, with one number, one letter, and one special character.');
      return false;
    }

    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return; // Stop the submission if validation fails
    }
  

    setLoading(true); // Show loading indicator

    // Log the form data to ensure it's correct before sending
    console.log('FormData being sent:', formData);
  
    try {
      const response = await fetch('auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // Ensure JSON.stringify is used here
        credentials: 'include', // Ensures cookies are sent with request if needed for CORS
      });
  
      const res = await response.json();

      setLoading(false); // Hide loading indicator
  
      if (response.ok) {
        console.log('Login successful:', res.token);
       
        //decode token and store user role for auth on app routes
        const decodedToken = jwtDecode(res.token);
        localStorage.setItem("role",decodedToken.role);
        console.log('Role:', decodedToken.role);
        // Store the token in local storage and redirect to user role type dashboard
        localStorage.setItem('token', res.token);

        // Slight delay before navigating to ensure DOM updates
      setTimeout(() => {navigate('/customerpage');}, 500);

      } else {
        setErrors(res.message);
      }
    } catch (error) {
      setLoading(false); // Hide loading indicator
      console.error('Login error:', error);
      setErrors('Something went wrong. Please try again later.');
    }
  };
  

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-heading">Log into the System</h2>
        <h3 className="login-subheading">Enter the following details</h3>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-content">
            <div className="login-input-column">
              <div className="login-input-group">
                <input
                  className="login-input"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Username"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="login-input-group">
                <input
                  className="login-input"
                  type="number"
                  id="accountNum"
                  name="accountNum"
                  placeholder="Account Number"
                  value={formData.accountNum}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="login-input-group">
                <input
                  className="login-input"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Display error messages */}
          {errors && <p className="error-message">{errors}</p>}
          
          {/* Show loading indicator */}
          {loading && <p className="loading-message">Logging in, please wait...</p>}

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}


export default LoginPage;