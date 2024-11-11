import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 
import logo from './fnblogo.png';

function CustomNavbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <Link to="/">
            <img
              src={logo}
              alt="NOT FNB logo"
              className="logo"
            />
          </Link>
          <span className="brand-name">NOT FNB</span>
        </div>
        <div className="navbar-links">
          <Link to="/">notFNB Home</Link>
          <Link to="/customerpage">Your Home</Link> 
        </div>
      </div>
      <div className="navbar-right">
        {/*<Link to="/register">Register</Link>*/}
        <Link to="/login">Login</Link>
        <Link to="/logout">Logout</Link>
      </div>
    </nav>
  );
}

export default CustomNavbar;
