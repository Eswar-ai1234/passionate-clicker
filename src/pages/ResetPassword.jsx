import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Pages.css";

const API_URL = import.meta.env.VITE_API_URL;

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid or missing reset link.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please enter both password fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/client-auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to reset password."
        );
      }

      setSuccess(
        "Password changed successfully. You can now login."
      );

      setPassword("");
      setConfirmPassword("");

    } catch (err) {
      setError(
        err.message || "Unable to reset password."
      );
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
            A fresh
            <br />
            <span>start.</span>
          </h1>

          <p className="client-login-brand-text">
            Create a new password and get back to
            your Passionate Clicker experience.
          </p>
        </div>

        <div className="client-login-box">

          <p className="section-label">
            CLIENT PORTAL
          </p>

          <h2>
            Reset
            <br />
            <span>Password.</span>
          </h2>

          <p className="client-login-description">
            Enter your new password below.
          </p>

          <form
            className="client-login-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">
              <label>NEW PASSWORD</label>

              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label>CONFIRM PASSWORD</label>

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                autoComplete="new-password"
              />
            </div>

            {error && (
              <p className="client-login-error">
                {error}
              </p>
            )}

            {success && (
              <p className="client-login-success">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="primary-btn client-login-submit"
              disabled={loading}
            >
              {loading
                ? "Changing..."
                : "Change Password →"}
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

export default ResetPassword;