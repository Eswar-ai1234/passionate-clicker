import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Pages.css";

const API_URL = "http://127.0.0.1:8000";

function ClientLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/client-auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Invalid email or password."
        );
      }

      if (rememberMe) {
        localStorage.setItem(
          "client_token",
          data.access_token
        );

        localStorage.setItem(
          "client_data",
          JSON.stringify(data.client)
        );
      } else {
        sessionStorage.setItem(
          "client_token",
          data.access_token
        );

        sessionStorage.setItem(
          "client_data",
          JSON.stringify(data.client)
        );
      }

      // Open the normal website after successful client login
      navigate("/home");

    } catch (err) {
      setError(
        err.message || "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError(
      "Google login is not configured yet. Please use your email and password."
    );
  };

  const handleForgotPassword = () => {
    alert(
      "Please contact Passionate Clicker to reset your password."
    );
  };

  const handleContact = () => {
    navigate("/contact");
  };

  return (
    <div className="client-login-page">

      <div className="client-login-content">

        {/* LEFT SIDE */}
        <div className="client-login-brand">

          <p>PASSIONATE CLICKER</p>

          <h1>
            Your memories.
            <br />
            <span>Your gallery.</span>
          </h1>

          <p className="client-login-brand-text">
            Access your private space and continue
            exploring your beautiful moments.
          </p>

        </div>

        {/* LOGIN BOX */}
        <div className="client-login-box">

          <p className="section-label">
            CLIENT LOGIN
          </p>

          <h2>
            Welcome
            <br />
            <span>Back.</span>
          </h2>

          <p className="client-login-description">
            Login with your email and password to
            continue to Passionate Clicker.
          </p>

          <form
            className="client-login-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}
            <div className="form-group">

              <label htmlFor="client-email">
                EMAIL ADDRESS
              </label>

              <input
                id="client-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
              />

            </div>

            {/* PASSWORD */}
            <div className="form-group">

              <label htmlFor="client-password">
                PASSWORD
              </label>

              <input
                id="client-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
              />

            </div>

            {/* LOGIN OPTIONS */}
            <div className="client-login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                />

                <span>Remember me</span>

              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>

            </div>

            {/* ERROR */}
            {error && (
              <p className="client-login-error">
                {error}
              </p>
            )}

            {/* LOGIN */}
            <button
              type="submit"
              className="primary-btn client-login-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login →"}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="login-divider">
            <span>OR</span>
          </div>

          {/* GOOGLE */}
          <button
            type="button"
            className="google-login-btn"
            onClick={handleGoogleLogin}
          >
            <span className="google-icon">G</span>
            Continue with Google
         </button>

          {/* MICROSOFT */}
          <button
            type="button"
            className="microsoft-login-btn"
            onClick={() =>
              setError(
                "Microsoft login is not configured yet. Please use your email and password."
             )
           }
>
              <span className="microsoft-icon">⊞</span>
              Continue with Microsoft
            </button>

          {/* SIGN UP / CONTACT */}
          <p className="client-signup-text">
            Don't have an account?

            <button
              type="button"
              onClick={() => navigate("/create-account")}
            >
              Create Account
            </button>
          </p>

          {/* BACK */}
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

export default ClientLogin;