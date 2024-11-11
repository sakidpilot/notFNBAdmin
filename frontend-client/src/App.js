import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import HomePage from './components/HomePage.js';
import RegisterPage from './components/RegisterPage.js'; 
import LoginPage from './components/LoginPage.js';
import PaymentPage from './components/PaymentPage.js';
import ViewPaymentsPage from './components/ViewPayments.js';
import CustomerPage from './components/CustomerPage.js';
import EmployeePage from './components/EmployeePage.js';
import ViewAllPaymentsPage from './components/ViewAllPayments.js';
import VerifyPaymentsPage from './components/PaymentVerificationPage.js';
import RedirectPage from './components/RedirectSWIFTPage.js';
import SwiftPage from './components/SWIFTHandover.js';
import LogoutPage from './components/LogoutPage.js';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />  
        <Routes>
          <Route path="/" element={<HomePage />} />   
          <Route path="/register" element={<RegisterPage />} />   
          <Route path="/login" element={<LoginPage />} />   
          <Route path="/payment" element={<PaymentPage />} />  
          <Route path="/viewpayments" element={<ViewPaymentsPage />} />  
          <Route path="/customerpage" element={<CustomerPage />} /> 
          <Route path="/employeepage" element={<EmployeePage />} /> 
          <Route path="/viewallpayments" element={<ViewAllPaymentsPage />} /> 
          <Route path="/verifypayments" element={<VerifyPaymentsPage />} /> 
          <Route path="/redirect" element={<RedirectPage />} /> 
          <Route path="/swifthandover" element={<SwiftPage />} /> 
          <Route path="/logout" element={<LogoutPage />} />   
        </Routes>
      </div>
    </Router>
  );
}

export default App;

