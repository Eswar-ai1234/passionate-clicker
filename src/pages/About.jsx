import "./Pages.css";

function About() {
  return (
    <div className="page">

      <section className="page-hero">
        <p>PASSIONATE CLICKER</p>
        <h1>
          Behind the
          <br />
          <span>Lens.</span>
        </h1>
        <p className="page-description">
          We believe every photograph should preserve more
          than a moment. It should preserve a feeling.
        </p>
      </section>

      <section className="about-content">

        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1000&q=85"
            alt="Photographer"
          />
        </div>

        <div className="about-text">
          <p className="section-label">OUR STORY</p>

          <h2>
            Passion behind
            <br />
            <span>every frame.</span>
          </h2>

          <p>
            Passionate Clicker was created with one simple idea —
            to turn genuine moments into photographs that last
            forever.
          </p>

          <p>
            From intimate celebrations to grand weddings,
            we focus on authentic emotions, beautiful details
            and the stories that make every person unique.
          </p>

          <div className="signature">
            Passionate Clicker
          </div>
        </div>

      </section>

      <section className="about-values">

        <p className="section-label">WHAT MATTERS TO US</p>

        <div className="values-grid">

          <div>
            <span>01</span>
            <h3>Emotion</h3>
            <p>
              Real moments. Genuine expressions.
              Nothing forced.
            </p>
          </div>

          <div>
            <span>02</span>
            <h3>Story</h3>
            <p>
              Every celebration has a story worth
              remembering.
            </p>
          </div>

          <div>
            <span>03</span>
            <h3>Art</h3>
            <p>
              We combine creativity, composition and
              cinematic visuals.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default About;