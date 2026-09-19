import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Pages.css";

const API_URL = "http://127.0.0.1:8000";

function AdminGalleries() {
  const [galleries, setGalleries] = useState([]);

  const [formData, setFormData] = useState({
    client_name: "",
    gallery_name: "",
    event_type: "",
    event_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // LOAD GALLERIES
  // =====================================================

  const loadGalleries = async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/galleries/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load galleries."
        );
      }

      setGalleries(data);
    } catch (err) {
      setError(err.message || "Unable to load galleries.");
    }
  };

  useEffect(() => {
    loadGalleries();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =====================================================
  // GENERATE GALLERY CODE
  // =====================================================

  const generateGalleryCode = () => {
    const letters = formData.client_name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();

    const randomNumber = Math.floor(100 + Math.random() * 900);

    return `PC-${letters || "GAL"}-${randomNumber}`;
  };

  // =====================================================
  // CREATE GALLERY
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    if (
      !formData.client_name ||
      !formData.gallery_name ||
      !formData.event_type ||
      !formData.event_date
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const galleryCode = generateGalleryCode();

    const params = new URLSearchParams({
      client_name: formData.client_name,
      gallery_name: formData.gallery_name,
      event_type: formData.event_type,
      event_date: formData.event_date,
      gallery_code: galleryCode,
    });

    try {
      const response = await fetch(
        `${API_URL}/galleries/?${params.toString()}`,
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
          data.detail || "Failed to create gallery."
        );
      }

      setMessage(
        `Gallery created successfully. Code: ${data.gallery_code}`
      );

      setFormData({
        client_name: "",
        gallery_name: "",
        event_type: "",
        event_date: "",
      });

      await loadGalleries();
    } catch (err) {
      setError(err.message || "Unable to create gallery.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE GALLERY
  // =====================================================

  const handleDelete = async (galleryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gallery?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/galleries/${galleryId}`,
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
          data.detail || "Failed to delete gallery."
        );
      }

      setMessage("Gallery deleted successfully.");

      await loadGalleries();
    } catch (err) {
      setError(err.message || "Unable to delete gallery.");
    }
  };

  return (
    <div className="page admin-galleries-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="admin-header">

        <div>
          <p className="section-label">
            GALLERY MANAGEMENT
          </p>

          <h1>
            Manage
            <br />
            <span>Galleries.</span>
          </h1>

          <p>
            Create client galleries and manage their
            access codes.
          </p>
        </div>

        <Link
          to="/admin/dashboard"
          className="secondary-btn"
        >
          ← Dashboard
        </Link>

      </section>


      {/* =================================================
          CREATE GALLERY
      ================================================= */}

      <section className="admin-gallery-create">

        <div className="admin-panel">

          <div className="admin-panel-heading">

            <div>
              <p className="section-label">
                NEW GALLERY
              </p>

              <h2>
                Create Gallery
              </h2>
            </div>

          </div>


          <form
            className="admin-gallery-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">
              <label>CLIENT NAME</label>

              <input
                type="text"
                name="client_name"
                placeholder="Example: Rahul & Ananya"
                value={formData.client_name}
                onChange={handleChange}
              />
            </div>


            <div className="form-group">
              <label>GALLERY NAME</label>

              <input
                type="text"
                name="gallery_name"
                placeholder="Example: Rahul & Ananya Wedding"
                value={formData.gallery_name}
                onChange={handleChange}
              />
            </div>


            <div className="form-group">
              <label>EVENT TYPE</label>

              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleChange}
              >
                <option value="">
                  Select Event Type
                </option>

                <option value="Wedding">
                  Wedding
                </option>

                <option value="Pre-Wedding">
                  Pre-Wedding
                </option>

                <option value="Engagement">
                  Engagement
                </option>

                <option value="Birthday">
                  Birthday
                </option>

                <option value="Portrait">
                  Portrait
                </option>

                <option value="Corporate">
                  Corporate
                </option>

                <option value="Event">
                  Event
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>


            <div className="form-group">
              <label>EVENT DATE</label>

              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
              />
            </div>


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


            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading
                ? "Creating Gallery..."
                : "Create Gallery →"}
            </button>

          </form>

        </div>

      </section>


      {/* =================================================
          EXISTING GALLERIES
      ================================================= */}

      <section className="admin-gallery-section">

        <p className="section-label">
          EXISTING GALLERIES
        </p>


        <div className="admin-gallery-heading">

          <h2>
            Client Galleries
          </h2>

          <span>
            {galleries.length} Galleries
          </span>

        </div>


        {galleries.length === 0 ? (

          <div className="admin-empty-state">

            <p>
              No galleries created yet.
            </p>

            <span>
              Create your first client gallery above.
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

                <small>
                  {gallery.event_type}
                </small>

                <div>

                  <small>
                    {gallery.event_date}
                  </small>

                  <small>
                    {gallery.gallery_code}
                  </small>

                </div>


                <div className="admin-gallery-actions">

                  <Link
                    to={`/admin/galleries/${gallery.id}`}
                    className="admin-gallery-manage-btn"
                  >
                    Manage Photos →
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(gallery.id)
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

export default AdminGalleries;