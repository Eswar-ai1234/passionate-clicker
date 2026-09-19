import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="site-navbar">

      <Link
        to="/"
        className="site-logo"
        onClick={closeMenu}
      >
        <span>PASSIONATE</span>
        <strong>CLICKER</strong>
      </Link>

      {/* DESKTOP NAVIGATION */}
      <nav className="site-nav">
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/about" onClick={closeMenu}>About</Link>
        <Link to="/portfolio" onClick={closeMenu}>Portfolio</Link>
        <Link to="/client-gallery" onClick={closeMenu}>
          Client Gallery
        </Link>
        <Link to="/services" onClick={closeMenu}>Services</Link>
        <Link to="/contact" onClick={closeMenu}>Contact</Link>
      </nav>

      <Link
        to="/contact"
        className="site-book-btn"
      >
        Book a Shoot
      </Link>

      {/* MOBILE MENU BUTTON */}
      <button
        type="button"
        className={`mobile-menu-btn ${
          menuOpen ? "active" : ""
        }`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* MOBILE NAVIGATION */}
      <nav
        className={`mobile-nav ${
          menuOpen ? "open" : ""
        }`}
      >
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>

        <Link to="/about" onClick={closeMenu}>
          About
        </Link>

        <Link to="/portfolio" onClick={closeMenu}>
          Portfolio
        </Link>

        <Link to="/client-gallery" onClick={closeMenu}>
          Client Gallery
        </Link>

        <Link to="/services" onClick={closeMenu}>
          Services
        </Link>

        <Link to="/contact" onClick={closeMenu}>
          Contact
        </Link>

        <Link
          to="/contact"
          className="mobile-book-btn"
          onClick={closeMenu}
        >
          Book a Shoot →
        </Link>
      </nav>

    </header>
  );
}

export default Navbar;