import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Pages.css";

const API_URL = "http://127.0.0.1:8000";

function Admin() {
  const [stats, setStats] = useState({
    total_clients: 0,
    active_galleries: 0,
    new_bookings: 0,
    completed_shoots: 0,
  });

  const [bookings, setBookings] = useState([]);
  const [galleries, setGalleries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) {
      return "—";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("admin_token");

const [
  statsResponse,
  bookingsResponse,
  galleriesResponse,
] = await Promise.all([
  fetch(`${API_URL}/dashboard/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),

  fetch(`${API_URL}/dashboard/bookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),

  fetch(`${API_URL}/dashboard/galleries`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
]);

      const statsData = await statsResponse.json();
      const bookingsData = await bookingsResponse.json();
      const galleriesData = await galleriesResponse.json();

      if (!statsResponse.ok) {
        throw new Error(
          statsData.detail || "Failed to load dashboard statistics."
        );
      }

      if (!bookingsResponse.ok) {
        throw new Error(
          bookingsData.detail || "Failed to load bookings."
        );
      }

      if (!galleriesResponse.ok) {
        throw new Error(
          galleriesData.detail || "Failed to load galleries."
        );
      }

      setStats(statsData);
      setBookings(bookingsData);
      setGalleries(galleriesData);
    } catch (err) {
      setError(
        err.message || "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="page admin-page">

      {/* =====================================================
          ADMIN HEADER
      ===================================================== */}

      <section className="admin-header">

        <div>
          <p className="section-label">
            PASSIONATE CLICKER
          </p>

          <h1>
            Admin
            <br />
            <span>Dashboard.</span>
          </h1>

          <p>
            Manage your photography business from one place.
          </p>
        </div>

        <Link
          to="/"
          className="secondary-btn"
        >
          View Website →
        </Link>

      </section>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <section
          style={{
            padding: "20px 7%",
            borderBottom: "1px solid var(--border)",
            color: "#d99",
            fontSize: "11px",
          }}
        >
          {error}
        </section>
      )}


      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <section className="admin-stats">

        <div className="admin-stat-card">
          <span>01</span>

          <h2>
            {loading ? "—" : stats.total_clients}
          </h2>

          <p>
            Total Clients
          </p>
        </div>


        <div className="admin-stat-card">
          <span>02</span>

          <h2>
            {loading ? "—" : stats.active_galleries}
          </h2>

          <p>
            Active Galleries
          </p>
        </div>


        <div className="admin-stat-card">
          <span>03</span>

          <h2>
            {loading ? "—" : stats.new_bookings}
          </h2>

          <p>
            New Bookings
          </p>
        </div>


        <div className="admin-stat-card">
          <span>04</span>

          <h2>
            {loading ? "—" : stats.completed_shoots}
          </h2>

          <p>
            Completed Shoots
          </p>
        </div>

      </section>


      {/* =====================================================
          DASHBOARD CONTENT
      ===================================================== */}

      <section className="admin-content">


        {/* ===================================================
            RECENT BOOKINGS
        =================================================== */}

        <div className="admin-panel">

          <div className="admin-panel-heading">

            <div>
              <p className="section-label">
                RECENT ACTIVITY
              </p>

              <h2>
                Recent Bookings
              </h2>
            </div>

            <Link
              to="/admin/bookings"
              className="admin-panel-link"
            >
              View All →
            </Link>

          </div>


          <div className="booking-list">

            {bookings.length === 0 ? (

              <div className="admin-empty-state">
                <p>
                  No bookings yet.
                </p>

                <span>
                  New booking requests will appear here.
                </span>
              </div>

            ) : (

              bookings.map((booking, index) => (

                <div
                  className="booking-row"
                  key={booking.id}
                >

                  <div>
                    <span>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>
                      {booking.client_name}
                    </h3>
                  </div>

                  <p>
                    {booking.service}
                  </p>

                  <p>
                    {formatDate(booking.shoot_date)}
                  </p>

                  <strong>
                    {booking.status}
                  </strong>

                </div>

              ))

            )}

          </div>

        </div>


        {/* ===================================================
            QUICK ACTIONS
        =================================================== */}

        <div className="admin-panel">

          <div className="admin-panel-heading">

            <div>
              <p className="section-label">
                QUICK ACTIONS
              </p>

              <h2>
                Manage
              </h2>
            </div>

          </div>


          <div className="admin-actions">

            <Link
              to="/admin/clients"
              className="admin-action-link"
            >
              <span>01</span>
              Manage Clients
              <b>→</b>
            </Link>


            <Link
              to="/admin/bookings"
              className="admin-action-link"
            >
              <span>02</span>
              Manage Bookings
              <b>→</b>
            </Link>


            <Link
              to="/admin/galleries"
              className="admin-action-link"
            >
              <span>03</span>
              Manage Galleries
              <b>→</b>
            </Link>


            <Link
              to="/admin/galleries"
              className="admin-action-link"
            >
              <span>04</span>
              Upload Photos
              <b>→</b>
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          GALLERY OVERVIEW
      ===================================================== */}

      <section className="admin-gallery-section">

        <p className="section-label">
          GALLERY MANAGEMENT
        </p>


        <div className="admin-gallery-heading">

          <h2>
            Client Galleries
          </h2>

          <Link
            to="/admin/galleries"
            className="text-link"
          >
            Manage Galleries →
          </Link>

        </div>


        {galleries.length === 0 ? (

          <div className="admin-empty-state">

            <p>
              No galleries created yet.
            </p>

            <span>
              Create a gallery to see it here.
            </span>

          </div>

        ) : (

          <div className="admin-gallery-grid">

            {galleries.map((gallery) => (

              <div
                className="admin-gallery-card"
                key={gallery.id}
              >

                <span>
                  ACTIVE
                </span>

                <h3>
                  {gallery.client_name}
                </h3>

                <p>
                  {gallery.gallery_name}
                </p>

                <div>

                  <small>
                    {gallery.photo_count} Photos
                  </small>

                  <small>
                    {gallery.gallery_code}
                  </small>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default Admin;