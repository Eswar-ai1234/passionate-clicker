import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Images, User, ArrowRight } from "lucide-react";
import "./Pages.css";

const API_URL = "http://127.0.0.1:8000";

function ClientPortal() {
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("client_token");
    const clientData = localStorage.getItem("client_data");

    if (!token || !clientData) {
      navigate("/client-login");
      return;
    }

    try {
      setClient(JSON.parse(clientData));
    } catch {
      localStorage.removeItem("client_token");
      localStorage.removeItem("client_data");
      navigate("/client-login");
      return;
    }

    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("client_token");
    localStorage.removeItem("client_data");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="client-portal-page">
        <div className="client-portal-loading">
          Loading your portal...
        </div>
      </div>
    );
  }

  return (
    <div className="client-portal-page">
      <div className="client-portal-container">

        <header className="client-portal-header">
          <div>
            <p className="section-label">PASSIONATE CLICKER</p>
            <h1>
              Welcome,
              <br />
              <span>{client?.name || "Client"}.</span>
            </h1>
          </div>

          <button
            type="button"
            className="client-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>
        </header>

        <section className="client-portal-welcome">
          <p>
            Your private space for memories captured
            by Passionate Clicker.
          </p>
        </section>

        <section className="client-portal-cards">

          <div className="client-portal-card">
            <div className="client-portal-card-icon">
              <Images size={30} strokeWidth={1.5} />
            </div>

            <p className="section-label">YOUR MEMORIES</p>

            <h2>
              My
              <br />
              <span>Gallery.</span>
            </h2>

            <p>
              View the photographs from your special
              moments, captured and curated by
              Passionate Clicker.
            </p>

            <button
              type="button"
              className="primary-btn"
              onClick={() => navigate("/client-gallery")}
            >
              View My Gallery
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="client-portal-card client-details-card">
            <div className="client-portal-card-icon">
              <User size={30} strokeWidth={1.5} />
            </div>

            <p className="section-label">MY DETAILS</p>

            <h2>
              Client
              <br />
              <span>Profile.</span>
            </h2>

            <div className="client-profile-details">
              <div>
                <small>NAME</small>
                <p>{client?.name || "—"}</p>
              </div>

              <div>
                <small>EMAIL</small>
                <p>{client?.email || "—"}</p>
              </div>
            </div>
          </div>

        </section>

        <button
          type="button"
          className="client-portal-back"
          onClick={() => navigate("/")}
        >
          ← Back to Portal
        </button>

      </div>
    </div>
  );
}

export default ClientPortal;