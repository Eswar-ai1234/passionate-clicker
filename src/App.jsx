import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Bookings from "./pages/Bookings";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import ClientGallery from "./pages/ClientGallery";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import Clients from "./pages/Clients";
import AdminGalleries from "./pages/AdminGalleries";
import ManagePhotos from "./pages/ManagePhotos";
import Portal from "./pages/Portal";
import ClientLogin from "./pages/ClientLogin";
import ClientPortal from "./pages/ClientPortal";
import CreateAccount from "./pages/CreateAccount";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
/* =====================================================
   SCROLL TO TOP
===================================================== */

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


/* =====================================================
   HOME PAGE
===================================================== */

function Home() {
  return (
    <main>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">

        <div className="hero-content">

          <p className="hero-eyebrow">
            PHOTOGRAPHY & FILMS
          </p>

          <h1>
            Moments That
            <br />
            <span>Last Forever.</span>
          </h1>

          <p className="hero-description">
            We capture genuine emotions, beautiful details
            and unforgettable moments through photography
            and film.
          </p>

          <div className="hero-actions">

            <Link
              to="/portfolio"
              className="primary-btn"
            >
              View Our Work →
            </Link>

            <Link
              to="/contact"
              className="secondary-btn"
            >
              Book a Shoot
            </Link>

          </div>

        </div>

      </section>


      {/* =================================================
          INTRO
      ================================================= */}

      <section className="home-intro">

        <div className="home-intro-label">

          <p className="section-label">
            OUR APPROACH
          </p>

        </div>

        <div className="home-intro-content">

          <h2>
            Your moments,
            <br />
            <span>beautifully captured.</span>
          </h2>

          <p>
            From weddings and pre-weddings to portraits
            and special events, we create photographs that
            feel natural, timeless and truly yours.
          </p>

          <Link
            to="/about"
            className="text-link"
          >
            More About Us →
          </Link>

        </div>

      </section>


      {/* =================================================
          FEATURED WORK
      ================================================= */}

      <section className="featured-section">

        <div className="section-top">

          <div>

            <p className="section-label">
              SELECTED WORK
            </p>

            <h2>
              Stories worth
              <br />
              <span>remembering.</span>
            </h2>

          </div>

          <Link
            to="/portfolio"
            className="text-link"
          >
            View Portfolio →
          </Link>

        </div>


        <div className="featured-grid">

          {/* PHOTO 01 */}

          <article className="featured-card">

            <div className="featured-image">

              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85"
                alt="Wedding photography"
              />

            </div>

            <div className="featured-info">

              <span>
                01 / WEDDING
              </span>

              <h3>
                Forever Begins
              </h3>

            </div>

          </article>


          {/* PHOTO 02 */}

          <article className="featured-card">

            <div className="featured-image">

              <img
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85"
                alt="Pre-wedding photography"
              />

            </div>

            <div className="featured-info">

              <span>
                02 / PRE-WEDDING
              </span>

              <h3>
                Two Souls
              </h3>

            </div>

          </article>


          {/* PHOTO 03 */}

          <article className="featured-card">

            <div className="featured-image">

              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85"
                alt="Portrait photography"
              />

            </div>

            <div className="featured-info">

              <span>
                03 / PORTRAIT
              </span>

              <h3>
                In Focus
              </h3>

            </div>

          </article>

        </div>

      </section>


      {/* =================================================
          SERVICES
      ================================================= */}

      <section className="home-services">

        <div className="section-top">

          <div>

            <p className="section-label">
              WHAT WE DO
            </p>

            <h2>
              Made for
              <br />
              <span>your story.</span>
            </h2>

          </div>

          <Link
            to="/services"
            className="text-link"
          >
            Explore Services →
          </Link>

        </div>


        <div className="home-services-list">

          <Link
            to="/services"
            className="home-service-row"
          >
            <span>01</span>

            <h3>
              Wedding Photography
            </h3>

            <b>
              →
            </b>

          </Link>


          <Link
            to="/services"
            className="home-service-row"
          >
            <span>02</span>

            <h3>
              Pre-Wedding
            </h3>

            <b>
              →
            </b>

          </Link>


          <Link
            to="/services"
            className="home-service-row"
          >
            <span>03</span>

            <h3>
              Portrait Photography
            </h3>

            <b>
              →
            </b>

          </Link>


          <Link
            to="/services"
            className="home-service-row"
          >
            <span>04</span>

            <h3>
              Events & Cinematography
            </h3>

            <b>
              →
            </b>

          </Link>

        </div>

      </section>


      {/* =================================================
          FINAL CTA
      ================================================= */}

      <section className="home-cta">

        <p className="section-label">
          LET'S CREATE SOMETHING BEAUTIFUL
        </p>

        <h2>
          Your story deserves
          <br />
          <span>to be remembered.</span>
        </h2>

        <Link
          to="/contact"
          className="primary-btn"
        >
          Start Your Story →
        </Link>

      </section>

    </main>
  );
}


/* =====================================================
   APP LAYOUT
===================================================== */

function Layout() {
  return (
    <div className="app">

      <ScrollToTop />

      <Navbar />

      <Routes>

        {/* PUBLIC */}

        <Route path="/" element={<Portal />} />

        <Route path="/home" element={<Home />} />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/portfolio"
          element={<Portfolio />}
        />

        <Route
          path="/services"
          element={<Services />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/client-gallery"
          element={<ClientGallery />}
        />


        {/* ADMIN */}

        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={<Admin />}
        />

        <Route
          path="/admin/clients"
          element={<Clients />}
        />

        <Route
          path="/admin/galleries"
          element={<AdminGalleries />}

        />
        <Route path="/admin/bookings" element={<Bookings />} />
        <Route
          path="/admin/galleries/:galleryId"
          element={<ManagePhotos />}
        />
        <Route
          path="/client-login"
         element={<ClientLogin />}
        />
        <Route
          path="/create-account"
          element={<CreateAccount />}
        />
        <Route
         path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
         path="/forgot-password"
         element={<ForgotPassword />}
       />

        <Route
          path="/client-portal"
          element={<ClientPortal />}
        />
        

      </Routes>

      <Footer />

    </div>
  );
}
/* =====================================================
   APP
===================================================== */

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;