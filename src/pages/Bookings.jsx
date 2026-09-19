import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Pages.css";

const API_URL = import.meta.env.VITE_API_URL;

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "—";

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

  // =========================================================
  // LOAD BOOKINGS
  // =========================================================

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/bookings/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load bookings."
        );
      }

      setBookings(data);
    } catch (err) {
      setError(
        err.message || "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // =========================================================
  // UPDATE BOOKING STATUS
  // =========================================================

  const updateStatus = async (bookingId, status) => {
    try {
      setError("");
      setMessage("");

      const params = new URLSearchParams({
        status: status,
      });

      const response = await fetch(
        `${API_URL}/bookings/${bookingId}/status?${params.toString()}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to update booking status."
        );
      }

      setMessage(
        "Booking status updated successfully."
      );

      await loadBookings();
    } catch (err) {
      setError(
        err.message || "Unable to update booking."
      );
    }
  };

  // =========================================================
  // DELETE BOOKING
  // =========================================================

  const deleteBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to delete booking."
        );
      }

      setMessage(
        "Booking deleted successfully."
      );

      await loadBookings();
    } catch (err) {
      setError(
        err.message || "Unable to delete booking."
      );
    }
  };

  return (
    <div className="page bookings-page">

      {/* HEADER */}
      <section className="admin-header">
        <div>
          <p className="section-label">
            BOOKING MANAGEMENT
          </p>

          <h1>
            Manage
            <br />
            <span>Bookings.</span>
          </h1>

          <p>
            View and manage photography booking requests.
          </p>
        </div>

        <Link
          to="/admin/dashboard"
          className="secondary-btn"
        >
          ← Dashboard
        </Link>
      </section>

      {/* MESSAGES */}
      {message && (
        <section className="booking-message booking-success">
          {message}
        </section>
      )}

      {error && (
        <section className="booking-message booking-error">
          {error}
        </section>
      )}

      {/* BOOKINGS */}
      <section className="bookings-section">

        <div className="admin-gallery-heading">
          <div>
            <p className="section-label">
              ALL REQUESTS
            </p>

            <h2>
              Booking Requests
            </h2>
          </div>

          <span>
            {bookings.length} Bookings
          </span>
        </div>

        {loading ? (
          <div className="admin-empty-state">
            <p>Loading bookings...</p>

            <span>
              Please wait while booking requests are loaded.
            </span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="admin-empty-state">
            <p>No bookings yet.</p>

            <span>
              New booking requests from the website
              will appear here.
            </span>
          </div>
        ) : (
          <div className="booking-admin-list">

            {bookings.map((booking, index) => (
              <div
                className="booking-admin-card"
                key={booking.id}
              >

                {/* TOP */}
                <div className="booking-admin-top">

                  <div className="booking-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="booking-client">
                    <p className="section-label">
                      CLIENT
                    </p>

                    <h3>
                      {booking.client_name}
                    </h3>
                  </div>

                  <div className="booking-status">
                    <select
                      value={booking.status}
                      onChange={(event) =>
                        updateStatus(
                          booking.id,
                          event.target.value
                        )
                      }
                    >
                      <option value="New">
                        New
                      </option>

                      <option value="Confirmed">
                        Confirmed
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>
                  </div>

                </div>

                {/* DETAILS */}
                <div className="booking-admin-details">

                  <div>
                    <span>EMAIL</span>
                    <p>{booking.email}</p>
                  </div>

                  <div>
                    <span>PHONE</span>
                    <p>{booking.phone}</p>
                  </div>

                  <div>
                    <span>SERVICE</span>
                    <p>{booking.service}</p>
                  </div>

                  <div>
                    <span>SHOOT DATE</span>
                    <p>
                      {formatDate(
                        booking.shoot_date
                      )}
                    </p>
                  </div>

                  <div>
                    <span>LOCATION</span>
                    <p>{booking.location}</p>
                  </div>

                </div>

                {/* MESSAGE */}
                {booking.message && (
                  <div className="booking-admin-message">
                    <span>MESSAGE</span>

                    <p>
                      {booking.message}
                    </p>
                  </div>
                )}

                {/* ACTIONS */}
                <div className="booking-admin-actions">

                  <a
                    href={`mailto:${booking.email}`}
                    className="admin-gallery-manage-btn"
                  >
                    Email Client →
                  </a>

                  <a
                    href={`tel:${booking.phone}`}
                    className="admin-gallery-manage-btn"
                  >
                    Call Client →
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      deleteBooking(booking.id)
                    }
                    className="admin-gallery-delete-btn"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Bookings;