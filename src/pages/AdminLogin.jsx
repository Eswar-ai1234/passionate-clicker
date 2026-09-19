import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Pages.css";

const API_URL = import.meta.env.VITE_API_URL;

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Login failed."
        );
      }

      localStorage.setItem(
        "admin_token",
        data.access_token
      );

      navigate("/admin/dashboard");

    } catch (err) {
      setError(
        err.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-box">

        <p className="section-label">
          PASSIONATE CLICKER
        </p>

        <h1>
          Admin
          <br />
          <span>Portal.</span>
        </h1>

        <p className="admin-login-description">
          Sign in to manage clients, bookings,
          galleries and photographs.
        </p>

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label>USERNAME</label>

            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Enter username"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>PASSWORD</label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

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
              ? "Signing In..."
              : "Sign In →"}
          </button>

        </form>

        <button
          type="button"
          className="admin-back-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Portal
        </button>

      </div>

    </div>
  );
}

export default AdminLogin;