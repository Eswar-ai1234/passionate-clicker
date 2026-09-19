import { useState } from "react";
import "./Pages.css";

const API_URL = "http://127.0.0.1:8000";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    location: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.service ||
      !formData.date ||
      !formData.location
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams({
        client_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        shoot_date: formData.date,
        location: formData.location,
        message: formData.message,
      });

      const response = await fetch(
        `${API_URL}/bookings/?${params.toString()}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to submit booking request."
        );
      }

      setSuccess(
        "Your booking request has been sent successfully. We will get in touch with you soon."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        date: "",
        location: "",
        message: "",
      });
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page contact-page">

      <section className="page-hero">
        <p className="section-label">LET'S CREATE TOGETHER</p>

        <h1>
          Get in
          <br />
          <span>Touch.</span>
        </h1>

        <p>
          Tell us about your special moment and
          let's create something beautiful together.
        </p>
      </section>

      <section className="contact-section">

        <div className="contact-info">
          <p className="section-label">CONTACT</p>

          <h2>
            Your story
            <br />
            starts here.
          </h2>

          <p>
            Whether it's a wedding, pre-wedding,
            portrait session or special event,
            we'd love to hear from you.
          </p>

          <div className="contact-details">

            <div>
              <span>EMAIL</span>
              <a href="mailto:adhireddyyeswar@gmail.com">
                adhireddyyeswar@gmail.com
              </a>
            </div>

            <div>
              <span>PHONE</span>
              <a href="tel:+918977181477">
                +91 89771 81477
              </a>
            </div>

          </div>
        </div>

        <div className="contact-form-wrapper">

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">
              <label>YOUR NAME *</label>

              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>EMAIL *</label>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>PHONE *</label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="+91"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="form-row">

              <div className="form-group">
                <label>SERVICE *</label>

                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                >
                  <option value="">
                    Select a service
                  </option>

                  <option value="Wedding Photography">
                    Wedding Photography
                  </option>

                  <option value="Pre-Wedding">
                    Pre-Wedding
                  </option>

                  <option value="Portrait Photography">
                    Portrait Photography
                  </option>

                  <option value="Events">
                    Events
                  </option>

                  <option value="Cinematography">
                    Cinematography
                  </option>

                  <option value="Product Photography">
                    Product Photography
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>SHOOT DATE *</label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="form-group">
              <label>LOCATION *</label>

              <input
                type="text"
                name="location"
                placeholder="Shoot location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>MESSAGE</label>

              <textarea
                name="message"
                rows="5"
                placeholder="Tell us a little about your event..."
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            {success && (
              <div className="contact-success">
                {success}
              </div>
            )}

            {error && (
              <div className="contact-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading
                ? "Sending Request..."
                : "Send Booking Request →"}
            </button>

          </form>

        </div>

      </section>

    </div>
  );
}

export default Contact;