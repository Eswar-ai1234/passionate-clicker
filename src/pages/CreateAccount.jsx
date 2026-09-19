import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Pages.css";

const API_URL = import.meta.env.VITE_API_URL;

function CreateAccount() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/client-auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to create account.");
      }

      setMessage("Account created successfully. You can now login.");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

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
            Your memories.
            <br />
            <span>Your account.</span>
          </h1>
        </div>

        <div className="client-login-box">

          <p className="section-label">CLIENT PORTAL</p>

          <h2>
            Create
            <br />
            <span>Account.</span>
          </h2>

          <p className="client-login-description">
            Create your Passionate Clicker client account
            to access your private experience.
          </p>

          <form
            className="client-login-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">
              <label>FULL NAME</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>PASSWORD</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>CONFIRM PASSWORD</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Creating..." : "Create Account →"}
            </button>

          </form>

          <p className="client-signup-text">
            Already have an account?

            <button
              type="button"
              onClick={() => navigate("/client-login")}
            >
              Login
            </button>
          </p>

          <button
            type="button"
            className="client-back-btn"
            onClick={() => navigate("/")}
          >
            ← Back to Portal
          </button>

        </div>
      </div>
    </div>
  );
}

export default CreateAccount;