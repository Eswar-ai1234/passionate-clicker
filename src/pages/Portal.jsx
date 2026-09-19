import { Link } from "react-router-dom";
import "./Pages.css";

function Portal() {
  return (
    <div className="portal-page">

      <div className="portal-background"></div>

      <main className="portal-content">

        <div className="portal-brand">
          <p>PHOTOGRAPHY & FILMS</p>

          <h1>
            PASSIONATE
            <br />
            <span>CLICKER</span>
          </h1>
        </div>

        <div className="portal-welcome">
          <p className="section-label">WELCOME</p>

          <h2>
            Your moments.
            <br />
            <span>Your story.</span>
          </h2>

          <p>
            Enter your dedicated portal to access
            your photography experience.
          </p>
        </div>

        <div className="portal-options">

          {/* CLIENT */}
          <Link
            to="/client-login"
            className="portal-card"
          >
            <div className="portal-card-number">
              01
            </div>

            <div className="portal-card-content">
              <p>FOR CLIENTS</p>

              <h3>
                Client
                <br />
                <span>Portal.</span>
              </h3>

              <p className="portal-card-description">
                Access your private gallery,
                view your photographs and
                relive your special moments.
              </p>

              <span className="portal-enter">
                Enter Client Portal →
              </span>
            </div>
          </Link>

          {/* ADMIN */}
          <Link
            to="/admin"
            className="portal-card"
          >
            <div className="portal-card-number">
              02
            </div>

            <div className="portal-card-content">
              <p>FOR ADMIN</p>

              <h3>
                Admin
                <br />
                <span>Portal.</span>
              </h3>

              <p className="portal-card-description">
                Manage clients, bookings,
                galleries and photography
                content from one place.
              </p>

              <span className="portal-enter">
                Enter Admin Portal →
              </span>
            </div>
          </Link>

        </div>

        <p className="portal-footer">
          © 2026 Passionate Clicker · Photography & Films
        </p>

      </main>

    </div>
  );
}

export default Portal;