import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">

      <div className="footer-main">

        {/* BRAND */}

        <div className="footer-brand">

          <p className="footer-eyebrow">
            PHOTOGRAPHY & FILMS
          </p>

          <Link to="/" className="footer-logo">
            PASSIONATE
            <br />
            <span>CLICKER</span>
          </Link>

          <p className="footer-description">
            Capturing emotions, stories and beautiful
            moments that deserve to last forever.
          </p>

        </div>


        {/* CONTACT */}

        <div className="footer-contact">

          <p className="footer-heading">
            GET IN TOUCH
          </p>

          <a href="mailto:adhireddyeswar@gmail.com">
            adhireddyeswar@gmail.com
          </a>

          <a href="tel:+91 8977181477">
            +91 8977181477
          </a>

        </div>


        {/* CTA */}

        <div className="footer-action">

          <p className="footer-heading">
            READY TO CREATE?
          </p>

          <Link
            to="/contact"
            className="footer-book-btn"
          >
            Book a Shoot →
          </Link>

        </div>

      </div>


      {/* BOTTOM */}

      <div className="footer-bottom">

        <p>
          © 2026 Passionate Clicker. All rights reserved.
        </p>

        <p>
          Photography & Films
        </p>

      </div>

    </footer>
  );
}

export default Footer;