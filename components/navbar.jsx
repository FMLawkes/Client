import React from 'react'

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-light container">
    <a className="navbar-brand" href="/">
      <img
        src="/static/logo.png"
        height="40"
        className="d-inline-block align-top"
        alt="Anifiles"
      />
    </a>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarTogglerDemo02"
      aria-controls="navbarTogglerDemo02"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" href="/">
            Home
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            Features
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            Files
          </a>
        </li>
      </ul>
    </div>
    <style jsx>{`
      .navbar {
        background: 0 0;
        padding: 5px 0;
        border-radius: 0;
        border: 0;
        font-weight: 700;
      }
      .nav-item a {
        padding: 21px 15px;
        text-transform: uppercase;
        color: #fff;
      }
    `}</style>
  </nav>
)

export default Navbar
