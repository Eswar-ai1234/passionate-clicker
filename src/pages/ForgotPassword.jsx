import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Pages.css";

const API_URL = "http://127.0.0.1:8000";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your registered email.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/client-auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to process your request."
        );
      }

      setMessage(
        "If this email is registered, a password reset link has been sent."
      );

      setEmail("");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-login-page">
      <div className="client-login-content">

        <div className="client-login-brand">
          <p>PASSIONATE CLICKER</p>

          <h1>
            Forgot your
            <br />
            <span>password?</span>
          </h1>
        </div>

        <div className="client-login-box">

          <p className="section-label">CLIENT PORTAL</p>

          <h2>
            Reset
            <br />
            <span>Password.</span>
          </h2>

          <p className="client-login-description">
            Enter your registered email address and
            we'll send you a secure password reset link.
          </p>

          <form
            className="client-login-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">
              <label>EMAIL ADDRESS</label>

              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <p className="client-login-error">{error}</p>
            )}

            {message && (
              <p className="client-login-success">{message}</p>
            )}

            <button
              type="submit"
              className="primary-btn client-login-submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link →"}
            </button>

          </form>

          <button
            type="button"
            className="client-back-btn"
            onClick={() => navigate("/client-login")}
          >
            ← Back to Login
          </button>

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;