import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';


const RegisterPage = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
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
  
          if (userRole != 'admin') {
            // If user is customer - re route
            navigate('/customerpage');
          } 
            
          
        } catch (error) {
          console.error('Invalid token:', error);
          navigate('/login');
        }
      }
    };

    validateToken();
  }, [navigate]);

  
  const [formData, setFormData] = useState({
    name: '',
    idNum: '',
    accountNum: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    specialChar: false,
    number: false,
    capital: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Update password criteria when user types a password
    if (name === 'password') {
      const length = value.length >= 8;
      const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const number = /\d/.test(value);
      const capital = /[A-Z]/.test(value);

      setPasswordCriteria({ length, specialChar, number, capital });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    const emailRegex= /@/;

  
    if (emailRegex.test(formData.name)) {
      newErrors.name = "Username cannot be an email.";
    }


    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 8 characters, include one number, one special character, and one capital letter.";
    }
    if (!formData.name || !formData.idNum || !formData.accountNum || !formData.email ||!formData.password ||!formData.role ) {
      newErrors.form = "All fields must be filled out.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    try {
      const response = await fetch('admin/signup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('User registered successfully');
        // Redirect user to login page upon successful registration
        window.location.href = "/employeepage"; // Assuming you have a route for login
      } else {
        console.error('Failed to register user:', data.message);
        setErrors({ ...errors, form: data.message });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setErrors({ ...errors, form: "An unexpected error occurred." });
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      <h3>Enter the following details</h3>
      {errors.form && (
        <p className="error">
          <span role="img" aria-label="error" style={{ marginRight: '5px' }}>⚠️</span>
          {errors.form}
          </p>
        )}

      <form onSubmit={handleSubmit}>
        <div className="form-content">
          <div className="left-column">
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
            <input
              type="number"
              name="idNum"
              placeholder="ID Number"
              value={formData.idNum}
              onChange={handleChange}
            />
            <input
              type="number"
              name="accountNum"
              placeholder="Account Number"
              value={formData.accountNum}
              onChange={handleChange}
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="role">Select User Role:</label>
            <select 
              type="text"
              name="role"
              placeholder="User Role - employee/user"
              value={formData.role}
              onChange={handleChange}>
                <option value="user">Customer</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
        
          </div>
          <div className="spacer"></div>
          <div className="right-column">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <div className="password-requirements">
              <ul>
                <li className={passwordCriteria.length ? 'valid' : 'invalid'}>
                  Minimum 8 characters
                </li>
                <li className={passwordCriteria.specialChar ? 'valid' : 'invalid'}>
                  At least one special character
                </li>
                <li className={passwordCriteria.number ? 'valid' : 'invalid'}>
                  At least one number
                </li>
                <li className={passwordCriteria.capital ? 'valid' : 'invalid'}>
                  At least one capital letter
                </li>
              </ul>
            </div>
            {errors.password && <p className="error">{errors.password}</p>}
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            {errors.form && <p className="error">{errors.form}</p>}
          </div>
        </div>
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default RegisterPage;
