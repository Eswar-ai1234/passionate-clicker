import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Pages.css";

const API_URL = "http://127.0.0.1:8000";

function Clients() {
  const [clients, setClients] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Wedding Photography",
    date: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // LOAD CLIENTS
  // =========================================================

  const loadClients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/clients/`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
  },
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load clients."
        );
      }

      setClients(data);
    } catch (err) {
      setError(
        err.message || "Unable to load clients."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================================================
  // ADD CLIENT
  // =========================================================

  const handleAddClient = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.date
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);

    const params = new URLSearchParams({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      shoot_date: formData.date,
    });

    try {
      const response = await fetch(
        `${API_URL}/clients/?${params.toString()}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
     );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to create client."
        );
      }

      setMessage("Client added successfully.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "Wedding Photography",
        date: "",
      });

      setShowForm(false);

      await loadClients();
    } catch (err) {
      setError(
        err.message || "Unable to add client."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE CLIENT
  // =========================================================

  const deleteClient = async (clientId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (!confirmDelete) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/clients/${clientId}`,
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
          data.detail || "Failed to delete client."
        );
      }

      setMessage("Client deleted successfully.");

      await loadClients();
    } catch (err) {
      setError(
        err.message || "Unable to delete client."
      );
    }
  };

  // =========================================================
  // DATE FORMAT
  // =========================================================

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

  return (
    <div className="page clients-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="admin-header">

        <div>
          <p className="section-label">
            ADMIN / CLIENTS
          </p>

          <h1>
            Client
            <br />
            <span>Management.</span>
          </h1>

          <p>
            Add, view and manage all your photography clients.
          </p>
        </div>

        <div className="admin-header-actions">

          <Link
            to="/admin/dashboard"
            className="secondary-btn"
          >
            ← Dashboard
          </Link>

          <button
            className="primary-btn"
            onClick={() => {
              setShowForm((current) => !current);
              setMessage("");
              setError("");
            }}
          >
            {showForm ? "Close Form" : "+ Add Client"}
          </button>

        </div>

      </section>


      {/* =====================================================
          MESSAGES
      ===================================================== */}

      {(message || error) && (
        <section
          style={{
            padding: "18px 7%",
            borderBottom: "1px solid var(--border)",
          }}
        >

          {message && (
            <p className="admin-success-message">
              {message}
            </p>
          )}

          {error && (
            <p className="admin-login-error">
              {error}
            </p>
          )}

        </section>
      )}


      {/* =====================================================
          ADD CLIENT FORM
      ===================================================== */}

      {showForm && (
        <section className="client-form-section">

          <div className="admin-panel-heading">

            <div>
              <p className="section-label">
                NEW CLIENT
              </p>

              <h2>
                Add Client
              </h2>
            </div>

          </div>


          <form
            className="client-form"
            onSubmit={handleAddClient}
          >

            <div className="form-group">

              <label>
                CLIENT NAME
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter client name"
                value={formData.name}
                onChange={handleChange}
              />

            </div>


            <div className="form-group">

              <label>
                EMAIL
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
              />

            </div>


            <div className="form-group">

              <label>
                PHONE
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />

            </div>


            <div className="form-group">

              <label>
                SERVICE
              </label>

              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
              >

                <option>
                  Wedding Photography
                </option>

                <option>
                  Pre-Wedding
                </option>

                <option>
                  Portrait Photography
                </option>

                <option>
                  Events
                </option>

                <option>
                  Cinematography
                </option>

                <option>
                  Product Photography
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>
                SHOOT DATE
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />

            </div>


            <div className="client-form-submit">

              <button
                type="submit"
                className="primary-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Client →"}
              </button>

            </div>

          </form>

        </section>
      )}


      {/* =====================================================
          CLIENT LIST
      ===================================================== */}

      <section className="clients-section">

        <div className="admin-panel-heading">

          <div>

            <p className="section-label">
              CLIENT DATABASE
            </p>

            <h2>

              All Clients

              <span className="client-count">
                {clients.length}
              </span>

            </h2>

          </div>

        </div>


        <div className="clients-table">

          {/* TABLE HEADER */}

          <div className="clients-table-header">

            <span>
              CLIENT
            </span>

            <span>
              SERVICE
            </span>

            <span>
              SHOOT DATE
            </span>

            <span>
              STATUS
            </span>

            <span>
              ACTION
            </span>

          </div>


          {/* LOADING */}

          {loading && (
            <div className="admin-empty-state">

              <p>
                Loading clients...
              </p>

            </div>
          )}


          {/* EMPTY */}

          {!loading && clients.length === 0 && (
            <div className="admin-empty-state">

              <p>
                No clients yet.
              </p>

              <span>
                Click “Add Client” to create your first client.
              </span>

            </div>
          )}


          {/* CLIENTS */}

          {!loading &&
            clients.map((client, index) => (

              <div
                className="client-row"
                key={client.id}
              >

                <div className="client-info">

                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>

                    <h3>
                      {client.name}
                    </h3>

                    <p>
                      {client.email}
                    </p>

                    <small>
                      {client.phone}
                    </small>

                  </div>

                </div>


                <p>
                  {client.service}
                </p>


                <p>
                  {formatDate(client.shoot_date)}
                </p>


                <strong
                  className={
                    client.status === "Active"
                      ? "status-active"
                      : "status-pending"
                  }
                >
                  {client.status}
                </strong>


                <button
                  className="delete-client-btn"
                  onClick={() =>
                  deleteClient(client.id)
                  }
                >
                  Delete
                </button>

              </div>

            ))}

        </div>

      </section>

    </div>
  );
}

export default Clients;
