import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <div className="Navbar">
      <div class="nav-container">
        <div class="nav-logo">Crash Team Racing</div>
        <div class="nav-item">Time Trials</div>
        <div class="nav-item">Speedruns</div>
        <div class="nav-item">Archives</div>
        <div class="nav-item">Log in</div>
        <div class="nav-item">Register</div>
      </div>
    </div>
  );
}

export default Navbar;
